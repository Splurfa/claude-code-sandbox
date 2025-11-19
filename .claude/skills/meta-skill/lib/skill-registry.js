/**
 * Skill Registry - Lightweight metadata index for all available skills
 * Loads skill frontmatter without loading full content (lazy loading)
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class SkillRegistry {
  constructor() {
    this.skills = new Map(); // skillId -> SkillMetadata
    this.categories = new Map(); // category -> Set<skillId>
  }

  /**
   * Load all skill metadata from .claude/skills directories
   * Only reads YAML frontmatter, not full content
   */
  async loadMetadata() {
    const skillDirs = [
      path.join(os.homedir(), '.claude/skills'),
      path.join(process.cwd(), '.claude/skills')
    ];

    for (const dir of skillDirs) {
      try {
        await this.scanDirectory(dir);
      } catch (err) {
        // Directory doesn't exist or not accessible - skip silently
        continue;
      }
    }
  }

  /**
   * Scan a directory for skill definitions
   */
  async scanDirectory(dir) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const skillPath = path.join(dir, entry.name, 'SKILL.md');

        try {
          await fs.access(skillPath);
          await this.loadSkill(skillPath, entry.name);
        } catch {
          // SKILL.md doesn't exist - skip
          continue;
        }
      }
    } catch (err) {
      // Directory scan failed - skip
    }
  }

  /**
   * Load a single skill's metadata from its SKILL.md
   */
  async loadSkill(skillPath, skillId) {
    try {
      const content = await fs.readFile(skillPath, 'utf-8');
      const metadata = this.extractMetadata(content, skillPath, skillId);

      this.skills.set(skillId, metadata);

      // Add to category index
      const category = metadata.category || 'Miscellaneous';
      if (!this.categories.has(category)) {
        this.categories.set(category, new Set());
      }
      this.categories.get(category).add(skillId);
    } catch (err) {
      console.error(`Failed to load skill ${skillId}:`, err.message);
    }
  }

  /**
   * Extract YAML frontmatter from SKILL.md
   */
  extractMetadata(content, skillPath, skillId) {
    const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---/);

    if (!frontmatterMatch) {
      throw new Error(`Invalid SKILL.md: missing frontmatter in ${skillPath}`);
    }

    const yaml = frontmatterMatch[1];
    const name = this.extractYamlField(yaml, 'name') || skillId;
    const description = this.extractYamlField(yaml, 'description') || '';
    const category = this.extractYamlField(yaml, 'category');
    const version = this.extractYamlField(yaml, 'version');

    // Extract keywords from name and description
    const tags = this.extractKeywords(name + ' ' + description);

    return {
      id: skillId,
      name,
      description,
      path: skillPath,
      tags,
      category: category || this.inferCategory(name, description),
      version
    };
  }

  /**
   * Extract a field from YAML frontmatter
   */
  extractYamlField(yaml, field) {
    const regex = new RegExp(`${field}:\\s*["']?([^"'\\n]+)["']?`, 'i');
    const match = yaml.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract keywords from text (remove stop words)
   */
  extractKeywords(text) {
    const stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
      'to', 'was', 'will', 'with', 'when', 'where', 'which', 'who'
    ]);

    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }

  /**
   * Infer category from skill name and description
   */
  inferCategory(name, description) {
    const text = (name + ' ' + description).toLowerCase();

    const patterns = {
      'Learning & Development': /\b(learn|teach|tutorial|guide|training|tutor|education)\b/,
      'Code Quality & Review': /\b(review|quality|lint|test|verify|validation|audit)\b/,
      'Multi-Agent Coordination': /\b(swarm|agents?|coordinate|orchestrat|multi-agent|hive)\b/,
      'Database & Memory': /\b(database|memory|storage|persist|agentdb|vector|search)\b/,
      'GitHub Integration': /\b(github|git|repository|pr|issue|pull\s*request)\b/,
      'Performance & Optimization': /\b(optimiz|performance|speed|benchmark|bottleneck)\b/,
      'Neural & AI': /\b(neural|ai|model|training|inference|machine\s*learning)\b/
    };

    for (const [category, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return category;
      }
    }

    return 'Miscellaneous';
  }

  /**
   * Search skills by query string
   */
  search(query) {
    const queryKeywords = this.extractKeywords(query);
    const results = [];

    for (const [skillId, metadata] of this.skills) {
      const matchScore = this.calculateMatchScore(queryKeywords, metadata);
      if (matchScore > 0) {
        results.push({ skill: metadata, score: matchScore });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate basic match score (will be refined in semantic-matcher)
   */
  calculateMatchScore(queryKeywords, metadata) {
    const skillKeywords = new Set(metadata.tags);
    let matches = 0;

    for (const keyword of queryKeywords) {
      if (skillKeywords.has(keyword)) {
        matches++;
      }
    }

    return matches / Math.max(queryKeywords.length, 1);
  }

  /**
   * Get skills by category
   */
  getByCategory(category) {
    const skillIds = this.categories.get(category) || new Set();
    return Array.from(skillIds).map(id => this.skills.get(id));
  }

  /**
   * Get all categories
   */
  getCategories() {
    return Array.from(this.categories.keys()).sort();
  }

  /**
   * Get skill by ID
   */
  get(skillId) {
    return this.skills.get(skillId);
  }

  /**
   * Get all skills
   */
  getAll() {
    return Array.from(this.skills.values());
  }

  /**
   * Get skill count
   */
  size() {
    return this.skills.size;
  }
}

module.exports = SkillRegistry;
