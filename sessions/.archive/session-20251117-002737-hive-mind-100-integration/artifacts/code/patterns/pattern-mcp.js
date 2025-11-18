#!/usr/bin/env node

/**
 * Pattern MCP Tool Integration
 * Provides MCP tools for pattern matching, extraction, and application
 */

const PatternMatcher = require('./pattern-matcher');
const PatternExtractor = require('./pattern-extractor');
const PatternApplicator = require('./pattern-applicator');

class PatternMCP {
  constructor(dbPath = '.swarm/memory.db') {
    this.matcher = new PatternMatcher(dbPath);
    this.extractor = new PatternExtractor(dbPath);
    this.applicator = new PatternApplicator(dbPath);
    this.initialized = false;
  }

  /**
   * Initialize all pattern tools
   */
  async initialize() {
    await Promise.all([
      this.matcher.initialize(),
      this.extractor.initialize(),
      this.applicator.initialize()
    ]);
    this.initialized = true;
  }

  /**
   * MCP Tool: Search patterns
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} - Search results
   */
  async searchPatterns(params) {
    const {
      query,
      type,
      limit = 10,
      threshold = 0.85
    } = params;

    if (query) {
      return await this.matcher.matchByContent(query, {
        limit,
        threshold,
        patternType: type
      });
    } else {
      const patterns = await this.matcher.getAllPatterns();
      return {
        patterns: type ? patterns.filter(p => p.type === type) : patterns,
        total: patterns.length
      };
    }
  }

  /**
   * MCP Tool: Match patterns by context
   * @param {Object} params - Match parameters
   * @returns {Promise<Object>} - Match results
   */
  async matchPatterns(params) {
    const {
      context,
      limit = 5,
      threshold = 0.85,
      autoApply = false
    } = params;

    return await this.matcher.matchByContext(context, {
      limit,
      threshold,
      autoApply
    });
  }

  /**
   * MCP Tool: Extract pattern from episode
   * @param {Object} params - Extraction parameters
   * @returns {Promise<Object>} - Extracted pattern
   */
  async extractPattern(params) {
    const {
      source,
      data,
      saveToDb = true
    } = params;

    let pattern;

    switch (source) {
      case 'trajectory':
        pattern = await this.extractor.extractFromTrajectory(data);
        break;
      case 'file_operations':
        pattern = this.extractor.extractFromFileOperations(data);
        break;
      case 'coordination':
        pattern = this.extractor.extractFromCoordination(data);
        break;
      case 'memory':
        pattern = this.extractor.extractFromMemoryUsage(data);
        break;
      case 'episodes':
        const patterns = await this.extractor.extractFromSuccessfulEpisodes(data.limit || 20);
        if (saveToDb) {
          for (const p of patterns) {
            await this.extractor.savePattern(p);
          }
        }
        return {
          success: true,
          patterns,
          count: patterns.length,
          saved: saveToDb
        };
      default:
        throw new Error(`Unknown extraction source: ${source}`);
    }

    if (saveToDb && pattern) {
      await this.extractor.savePattern(pattern);
    }

    return {
      success: true,
      pattern,
      saved: saveToDb
    };
  }

  /**
   * MCP Tool: Apply pattern to project
   * @param {Object} params - Application parameters
   * @returns {Promise<Object>} - Application result
   */
  async applyPattern(params) {
    const {
      patternId,
      projectContext,
      dryRun = false,
      requireApproval = true,
      createBackup = true
    } = params;

    return await this.applicator.applyPattern(patternId, projectContext, {
      dryRun,
      requireApproval,
      createBackup
    });
  }

  /**
   * MCP Tool: Auto-apply patterns
   * @param {Object} params - Auto-apply parameters
   * @returns {Promise<Object>} - Auto-apply results
   */
  async autoApplyPatterns(params) {
    const {
      projectContext,
      minConfidence = 0.90,
      maxPatterns = 5,
      createBackup = true
    } = params;

    return await this.applicator.autoApplyPatterns(projectContext, {
      minConfidence,
      maxPatterns,
      createBackup
    });
  }

  /**
   * MCP Tool: Analyze project for pattern recommendations
   * @param {Object} params - Analysis parameters
   * @returns {Promise<Object>} - Analysis results
   */
  async analyzeProject(params) {
    const {
      projectContext,
      autoApply = false,
      minConfidence = 0.85
    } = params;

    return await this.applicator.analyzeProject(projectContext, {
      autoApply,
      minConfidence
    });
  }

  /**
   * MCP Tool: Request queen approval
   * @param {Object} params - Approval request parameters
   * @returns {Promise<Object>} - Approval request
   */
  async requestQueenApproval(params) {
    const {
      patternId,
      projectContext
    } = params;

    return await this.applicator.requestQueenApproval(patternId, projectContext);
  }

  /**
   * MCP Tool: Get pattern statistics
   * @param {Object} params - Statistics parameters
   * @returns {Promise<Object>} - Pattern statistics
   */
  async getPatternStats(params = {}) {
    const patterns = await this.matcher.getAllPatterns();

    const stats = {
      total: patterns.length,
      byType: {},
      byConfidence: {
        high: 0,    // >= 0.9
        medium: 0,  // >= 0.7
        low: 0      // < 0.7
      },
      topUsed: [],
      recent: []
    };

    patterns.forEach(pattern => {
      // Count by type
      stats.byType[pattern.type] = (stats.byType[pattern.type] || 0) + 1;

      // Count by confidence
      if (pattern.confidence >= 0.9) {
        stats.byConfidence.high++;
      } else if (pattern.confidence >= 0.7) {
        stats.byConfidence.medium++;
      } else {
        stats.byConfidence.low++;
      }
    });

    // Top 10 most used patterns
    stats.topUsed = patterns
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        type: p.type,
        usageCount: p.usageCount,
        confidence: p.confidence
      }));

    // 10 most recently used patterns
    stats.recent = patterns
      .filter(p => p.lastUsed)
      .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        type: p.type,
        lastUsed: p.lastUsed,
        confidence: p.confidence
      }));

    return stats;
  }

  /**
   * MCP Tool: Get application history
   * @param {Object} params - History parameters
   * @returns {Object} - Application history
   */
  getApplicationHistory(params = {}) {
    return {
      history: this.applicator.getApplicationHistory(params),
      total: this.applicator.applicationHistory.length
    };
  }

  /**
   * MCP Tool: Create pattern link
   * @param {Object} params - Link parameters
   * @returns {Promise<Object>} - Link result
   */
  async createPatternLink(params) {
    const {
      sourcePatternId,
      targetPatternId,
      relation,
      weight = 1.0
    } = params;

    return await this.extractor.createPatternLink(
      sourcePatternId,
      targetPatternId,
      relation,
      weight
    );
  }

  /**
   * MCP Tool: Get pattern links
   * @param {Object} params - Link query parameters
   * @returns {Promise<Object>} - Pattern links
   */
  async getPatternLinks(params) {
    const { patternId } = params;

    const links = await this.matcher.getPatternLinks(patternId);

    return {
      patternId,
      links,
      total: links.length
    };
  }

  /**
   * Close all connections
   */
  async close() {
    await Promise.all([
      this.matcher.close(),
      this.extractor.close(),
      this.applicator.close()
    ]);
    this.initialized = false;
  }
}

/**
 * Export MCP tool definitions
 */
const mcpTools = {
  pattern_search: {
    name: 'pattern_search',
    description: 'Search for patterns by query or type',
    parameters: {
      query: { type: 'string', description: 'Search query' },
      type: { type: 'string', description: 'Pattern type filter' },
      limit: { type: 'number', default: 10, description: 'Result limit' },
      threshold: { type: 'number', default: 0.85, description: 'Similarity threshold' }
    }
  },

  pattern_match: {
    name: 'pattern_match',
    description: 'Match patterns by project context',
    parameters: {
      context: { type: 'object', required: true, description: 'Project context' },
      limit: { type: 'number', default: 5, description: 'Result limit' },
      threshold: { type: 'number', default: 0.85, description: 'Similarity threshold' },
      autoApply: { type: 'boolean', default: false, description: 'Enable auto-apply' }
    }
  },

  pattern_extract: {
    name: 'pattern_extract',
    description: 'Extract pattern from episode or workflow',
    parameters: {
      source: {
        type: 'string',
        required: true,
        enum: ['trajectory', 'file_operations', 'coordination', 'memory', 'episodes'],
        description: 'Extraction source'
      },
      data: { type: 'object', required: true, description: 'Source data' },
      saveToDb: { type: 'boolean', default: true, description: 'Save to database' }
    }
  },

  pattern_apply: {
    name: 'pattern_apply',
    description: 'Apply pattern to project',
    parameters: {
      patternId: { type: 'string', required: true, description: 'Pattern ID' },
      projectContext: { type: 'object', required: true, description: 'Project context' },
      dryRun: { type: 'boolean', default: false, description: 'Simulate application' },
      requireApproval: { type: 'boolean', default: true, description: 'Require approval' },
      createBackup: { type: 'boolean', default: true, description: 'Create backup' }
    }
  },

  pattern_auto_apply: {
    name: 'pattern_auto_apply',
    description: 'Auto-apply patterns with high confidence',
    parameters: {
      projectContext: { type: 'object', required: true, description: 'Project context' },
      minConfidence: { type: 'number', default: 0.90, description: 'Minimum confidence' },
      maxPatterns: { type: 'number', default: 5, description: 'Maximum patterns to apply' },
      createBackup: { type: 'boolean', default: true, description: 'Create backup' }
    }
  },

  pattern_analyze_project: {
    name: 'pattern_analyze_project',
    description: 'Analyze project and recommend patterns',
    parameters: {
      projectContext: { type: 'object', required: true, description: 'Project context' },
      autoApply: { type: 'boolean', default: false, description: 'Enable auto-apply' },
      minConfidence: { type: 'number', default: 0.85, description: 'Minimum confidence' }
    }
  },

  pattern_queen_approval: {
    name: 'pattern_queen_approval',
    description: 'Request strategic queen approval for pattern',
    parameters: {
      patternId: { type: 'string', required: true, description: 'Pattern ID' },
      projectContext: { type: 'object', required: true, description: 'Project context' }
    }
  },

  pattern_stats: {
    name: 'pattern_stats',
    description: 'Get pattern statistics and metrics',
    parameters: {}
  },

  pattern_history: {
    name: 'pattern_history',
    description: 'Get pattern application history',
    parameters: {
      patternId: { type: 'string', description: 'Filter by pattern ID' },
      successOnly: { type: 'boolean', default: false, description: 'Show only successful applications' },
      minConfidence: { type: 'number', description: 'Minimum confidence filter' }
    }
  },

  pattern_link_create: {
    name: 'pattern_link_create',
    description: 'Create link between patterns',
    parameters: {
      sourcePatternId: { type: 'string', required: true, description: 'Source pattern ID' },
      targetPatternId: { type: 'string', required: true, description: 'Target pattern ID' },
      relation: { type: 'string', required: true, description: 'Relationship type' },
      weight: { type: 'number', default: 1.0, description: 'Link weight' }
    }
  },

  pattern_links_get: {
    name: 'pattern_links_get',
    description: 'Get links for a pattern',
    parameters: {
      patternId: { type: 'string', required: true, description: 'Pattern ID' }
    }
  }
};

module.exports = { PatternMCP, mcpTools };
