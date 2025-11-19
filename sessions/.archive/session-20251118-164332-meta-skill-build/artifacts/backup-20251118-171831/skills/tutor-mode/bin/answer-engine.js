/**
 * Answer Engine - Processes questions with weighting schema guidance
 *
 * Uses workspace documentation and weighting schema to provide
 * context-aware answers that guide users toward SAFE references.
 */

const fsPromises = require('fs').promises;
const fs = require('fs');
const path = require('path');

class AnswerEngine {
  constructor() {
    this.workspaceRoot = this.findWorkspaceRoot();
    this.weightingSchema = null;
    this.documentCache = new Map();
  }

  /**
   * Find workspace root directory
   */
  findWorkspaceRoot() {
    let dir = __dirname;
    while (dir !== '/') {
      try {
        if (fs.existsSync(path.join(dir, 'CLAUDE.md'))) {
          return dir;
        }
      } catch (error) {
        console.error('Error checking for CLAUDE.md:', error.message);
      }
      dir = path.dirname(dir);
    }
    return process.cwd();
  }

  /**
   * Load weighting schema from docs
   */
  async loadWeightingSchema() {
    if (this.weightingSchema) {
      return this.weightingSchema;
    }

    try {
      // Look for weighting schema in docs
      const schemaPath = path.join(
        this.workspaceRoot,
        'sessions/session-20251117-225020-hive-docs-tutor/artifacts/docs/weighting-schema.json'
      );

      const content = await fsPromises.readFile(schemaPath, 'utf-8');
      this.weightingSchema = JSON.parse(content);
      return this.weightingSchema;
    } catch (error) {
      // Fallback: basic schema
      this.weightingSchema = {
        safe: ['docs/explanation', 'docs/how-to', 'docs/getting-started'],
        cautionary: ['docs/reference', 'docs/internals'],
        exclude: ['sessions/.archive', 'inbox']
      };
      return this.weightingSchema;
    }
  }

  /**
   * Answer a user question
   * @param {string} question - User's question
   * @returns {Promise<string>} Answer with references
   */
  async answerQuestion(question) {
    await this.loadWeightingSchema();

    // Parse question to identify topic
    const topic = this.extractTopic(question);

    // Find relevant documents
    const relevantDocs = await this.findRelevantDocuments(topic);

    // Generate answer based on weighting
    const answer = await this.generateAnswer(question, topic, relevantDocs);

    return answer;
  }

  /**
   * Extract topic from question
   */
  extractTopic(question) {
    const q = question.toLowerCase();

    // Topic mapping
    const topicMap = {
      'agent': 'agents',
      'spawn': 'agents',
      'memory': 'memory',
      'session': 'session-management',
      'parallel': 'parallel-execution',
      'coordinate': 'coordination',
      'topology': 'swarm-topologies',
      'consensus': 'consensus',
      'byzantine': 'byzantine-consensus',
      'hive': 'hive-mind',
      'queen': 'queen-selection',
      'hook': 'hooks',
      'file': 'file-routing',
      'workflow': 'workflows'
    };

    for (const [keyword, topic] of Object.entries(topicMap)) {
      if (q.includes(keyword)) {
        return topic;
      }
    }

    return 'general';
  }

  /**
   * Find relevant documents based on topic and weighting
   */
  async findRelevantDocuments(topic) {
    const docs = [];

    // Search in SAFE directories first
    for (const safeDir of this.weightingSchema.safe || []) {
      const found = await this.searchDirectory(
        path.join(this.workspaceRoot, safeDir),
        topic
      );
      docs.push(...found.map(d => ({ ...d, category: 'SAFE', weight: 90 })));
    }

    // Then CAUTIONARY directories
    for (const cautionDir of this.weightingSchema.cautionary || []) {
      const found = await this.searchDirectory(
        path.join(this.workspaceRoot, cautionDir),
        topic
      );
      docs.push(...found.map(d => ({ ...d, category: 'CAUTIONARY', weight: 50 })));
    }

    // Sort by weight (SAFE first)
    docs.sort((a, b) => b.weight - a.weight);

    return docs;
  }

  /**
   * Search directory for relevant files
   */
  async searchDirectory(dirPath, topic) {
    const results = [];

    try {
      const entries = await fsPromises.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          const subResults = await this.searchDirectory(fullPath, topic);
          results.push(...subResults);
        } else if (entry.name.endsWith('.md')) {
          // Check if filename or content matches topic
          if (this.isRelevant(entry.name, topic)) {
            results.push({
              path: fullPath,
              name: entry.name,
              relativePath: path.relative(this.workspaceRoot, fullPath)
            });
          }
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
      return [];
    }

    return results;
  }

  /**
   * Check if file is relevant to topic
   */
  isRelevant(filename, topic) {
    const name = filename.toLowerCase();
    const t = topic.toLowerCase();

    // Direct match
    if (name.includes(t)) {
      return true;
    }

    // Topic-specific matches
    const relevanceMap = {
      'agents': ['agent', 'spawn', 'coordination'],
      'memory': ['memory', 'storage', 'persistence'],
      'session-management': ['session', 'lifecycle', 'management'],
      'parallel-execution': ['parallel', 'concurrent', 'execution'],
      'coordination': ['coordinate', 'swarm', 'topology'],
      'swarm-topologies': ['topology', 'mesh', 'hierarchical', 'star', 'ring'],
      'consensus': ['consensus', 'voting', 'agreement'],
      'byzantine-consensus': ['byzantine', 'fault', 'tolerance'],
      'hive-mind': ['hive', 'wizard', 'orchestration'],
      'file-routing': ['file', 'routing', 'organization']
    };

    const keywords = relevanceMap[topic] || [topic];
    return keywords.some(keyword => name.includes(keyword));
  }

  /**
   * Generate answer based on documents and weighting
   */
  async generateAnswer(question, topic, relevantDocs) {
    if (relevantDocs.length === 0) {
      return this.generateFallbackAnswer(question, topic);
    }

    // Read top SAFE documents
    const safeDoc = relevantDocs.find(d => d.category === 'SAFE');
    let answer = '';

    if (safeDoc) {
      const content = await this.readDocument(safeDoc.path);
      answer = this.extractRelevantSection(content, question, topic);
      answer += `\n\n📚 Reference (SAFE): ${safeDoc.relativePath}`;
    } else {
      // Only cautionary docs available
      const cautionDoc = relevantDocs[0];
      const content = await this.readDocument(cautionDoc.path);
      answer = this.extractRelevantSection(content, question, topic);
      answer += `\n\n⚠️  Reference (CAUTIONARY): ${cautionDoc.relativePath}`;
      answer += '\n⚠️  Note: This is advanced documentation. Consider starting with basics first.';
    }

    // Add related SAFE documents
    const otherSafeDocs = relevantDocs.filter(d =>
      d.category === 'SAFE' && d !== safeDoc
    ).slice(0, 2);

    if (otherSafeDocs.length > 0) {
      answer += '\n\nRelated documentation:';
      for (const doc of otherSafeDocs) {
        answer += `\n  - ${doc.relativePath}`;
      }
    }

    return answer;
  }

  /**
   * Generate fallback answer when no docs found
   */
  generateFallbackAnswer(question, topic) {
    const basicAnswers = {
      'agents': 'Agents are specialized AI workers that execute tasks in parallel. Use the Task tool to spawn agents concurrently.',
      'memory': 'Memory allows agents to coordinate by storing and retrieving shared data. Use mcp__claude-flow_alpha__memory_usage MCP tool.',
      'session-management': 'Sessions organize work into isolated workspaces with artifact directories for code, tests, docs, scripts, and notes.',
      'parallel-execution': 'Parallel execution means running multiple agents simultaneously in one message. This is 2-10x faster than sequential execution.',
      'coordination': 'Agents coordinate through shared memory. Each agent stores findings that other agents can retrieve.',
      'general': 'I can help with claude-flow concepts. Try asking about: agents, memory, sessions, parallel execution, or coordination.'
    };

    const answer = basicAnswers[topic] || basicAnswers.general;
    return `${answer}\n\n💡 For detailed documentation, check:\n  - docs/explanation/workspace-architecture.md\n  - docs/getting-started/\n  - docs/how-to/`;
  }

  /**
   * Read document content
   */
  async readDocument(filePath) {
    if (this.documentCache.has(filePath)) {
      return this.documentCache.get(filePath);
    }

    try {
      const content = await fsPromises.readFile(filePath, 'utf-8');
      this.documentCache.set(filePath, content);
      return content;
    } catch (error) {
      return '';
    }
  }

  /**
   * Extract relevant section from document
   */
  extractRelevantSection(content, question, topic) {
    // Find section headers related to topic
    const lines = content.split('\n');
    const relevantLines = [];
    let inRelevantSection = false;
    let sectionDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for header
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        const [, hashes, title] = headerMatch;
        const depth = hashes.length;

        // Check if header is relevant
        if (this.isRelevant(title, topic)) {
          inRelevantSection = true;
          sectionDepth = depth;
          relevantLines.push(line);
        } else if (inRelevantSection && depth <= sectionDepth) {
          // Moved to different section at same/higher level
          break;
        }
      } else if (inRelevantSection) {
        relevantLines.push(line);

        // Stop after reasonable amount
        if (relevantLines.length > 50) {
          break;
        }
      }
    }

    if (relevantLines.length > 0) {
      return relevantLines.join('\n').trim();
    }

    // Fallback: return first 30 lines
    return lines.slice(0, 30).join('\n').trim();
  }
}

module.exports = AnswerEngine;
