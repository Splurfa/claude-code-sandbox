/**
 * Meta-Skill Coordinator - Main entry point
 * Routes user queries to appropriate skills via menus or semantic matching
 */

const SkillRegistry = require('./skill-registry');
const SemanticMatcher = require('./semantic-matcher');
const fs = require('fs').promises;

class MetaSkillCoordinator {
  constructor() {
    this.registry = new SkillRegistry();
    this.matcher = null;
    this.initialized = false;
  }

  /**
   * Initialize the coordinator (load skill metadata)
   */
  async initialize() {
    if (this.initialized) return;

    await this.registry.loadMetadata();
    this.matcher = new SemanticMatcher(this.registry);
    this.initialized = true;
  }

  /**
   * Main entry point - route user query
   */
  async handle(query) {
    await this.initialize();

    // Handle direct commands
    if (query.startsWith('/meta')) {
      return this.handleCommand(query);
    }

    // Natural language routing
    return this.handleNaturalLanguage(query);
  }

  /**
   * Handle /meta commands
   */
  handleCommand(cmd) {
    const parts = cmd.split(/\s+/);
    const command = parts[1] || 'help';
    const args = parts.slice(2);

    switch (command.toLowerCase()) {
      case 'menu':
        return this.showMenu(args[0]);

      case 'search':
        return this.searchSkills(args.join(' '));

      case 'invoke':
        return this.invokeSkill(args[0]);

      case 'list':
        return this.listSkills(args.includes('--categories'));

      case 'help':
      default:
        return this.showHelp();
    }
  }

  /**
   * Handle natural language queries
   */
  handleNaturalLanguage(query) {
    const matches = this.matcher.match(query);

    if (matches.length === 0) {
      return this.handleNoMatch(query);
    }

    if (matches.length === 1 && matches[0].score > 0.8) {
      // High confidence - auto-invoke
      return this.presentAutoInvoke(matches[0], query);
    }

    // Multiple matches - present menu
    return this.presentMatches(matches, query);
  }

  /**
   * Show category menu
   */
  showMenu(categoryFilter = null) {
    const categories = this.registry.getCategories();
    const totalSkills = this.registry.size();

    let output = `📚 Available Skills (${totalSkills} total)\n\n`;

    const categoriesToShow = categoryFilter
      ? categories.filter(c => c.toLowerCase().includes(categoryFilter.toLowerCase()))
      : categories;

    let skillNumber = 1;
    for (const category of categoriesToShow) {
      const skills = this.registry.getByCategory(category);
      if (skills.length === 0) continue;

      output += `${this.getCategoryIcon(category)} ${category}\n`;

      for (const skill of skills) {
        output += `  ${skillNumber}. ${skill.id.padEnd(25)} - ${skill.description.substring(0, 60)}\n`;
        skillNumber++;
      }
      output += '\n';
    }

    output += 'Type a number to select a skill, or describe what you want to do:\n';

    return output;
  }

  /**
   * Get emoji icon for category
   */
  getCategoryIcon(category) {
    const icons = {
      'Learning & Development': '🎓',
      'Code Quality & Review': '🔧',
      'Multi-Agent Coordination': '🤖',
      'Database & Memory': '📦',
      'GitHub Integration': '🔗',
      'Performance & Optimization': '⚡',
      'Neural & AI': '🧠',
      'Miscellaneous': '📋'
    };
    return icons[category] || '📁';
  }

  /**
   * Search skills by query
   */
  searchSkills(query) {
    if (!query || query.trim() === '') {
      return 'Usage: /meta search <query>\nExample: /meta search optimization';
    }

    const matches = this.matcher.match(query, 0.2);

    if (matches.length === 0) {
      return `🤔 No skills found matching "${query}"\n\nTry:\n  - /meta menu (browse all skills)\n  - Different keywords`;
    }

    let output = `🔍 Search results for "${query}" (${matches.length} matches):\n\n`;

    for (let i = 0; i < Math.min(matches.length, 10); i++) {
      const { skill, score, matchedKeywords } = matches[i];
      const confidence = Math.round(score * 100);

      output += `${i + 1}. ${skill.id} (${confidence}% match)\n`;
      output += `   ${skill.description}\n`;
      output += `   Keywords: ${matchedKeywords.join(', ')}\n\n`;
    }

    output += 'Type a number to select, or refine your search:\n';

    return output;
  }

  /**
   * Invoke a skill directly by name
   */
  async invokeSkill(skillId) {
    if (!skillId) {
      return 'Usage: /meta invoke <skill-name>\nExample: /meta invoke prompt-improver';
    }

    const skill = this.registry.get(skillId);

    if (!skill) {
      const suggestions = this.findSimilarSkills(skillId);
      let output = `❌ Skill "${skillId}" not found\n\n`;

      if (suggestions.length > 0) {
        output += 'Did you mean:\n';
        for (const suggestion of suggestions.slice(0, 3)) {
          output += `  - ${suggestion.id}\n`;
        }
      }

      output += '\nUse /meta list to see all available skills';
      return output;
    }

    return this.loadSkill(skill);
  }

  /**
   * Find skills with similar names (fuzzy match)
   */
  findSimilarSkills(query) {
    const allSkills = this.registry.getAll();
    const results = [];

    for (const skill of allSkills) {
      const similarity = this.matcher.levenshteinRatio(query.toLowerCase(), skill.id.toLowerCase());
      if (similarity > 0.5) {
        results.push({ skill, similarity });
      }
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .map(r => r.skill);
  }

  /**
   * List all skills
   */
  listSkills(groupByCategory = false) {
    if (groupByCategory) {
      return this.showMenu();
    }

    const skills = this.registry.getAll().sort((a, b) => a.id.localeCompare(b.id));
    let output = `📋 All Skills (${skills.length} total):\n\n`;

    for (const skill of skills) {
      output += `  ${skill.id.padEnd(30)} - ${skill.description.substring(0, 70)}\n`;
    }

    output += '\nUse /meta invoke <skill-name> to load a skill\n';

    return output;
  }

  /**
   * Show help documentation
   */
  showHelp() {
    return `
🎯 Meta-Skill Coordinator Help

NATURAL LANGUAGE:
  Just describe what you want to do:
    "help me optimize my prompts"
    "I want to learn about claude flow"
    "need to review code quality"

COMMANDS:
  /meta menu [category]         - Browse skills by category
  /meta search <query>          - Search for skills
  /meta invoke <skill-name>     - Load a specific skill
  /meta list [--categories]     - List all skills
  /meta help                    - Show this help

EXAMPLES:
  /meta menu learning           - Show learning category
  /meta search optimization     - Find optimization skills
  /meta invoke prompt-improver  - Load prompt improver skill

TIP: The more specific your query, the better the match!
`;
  }

  /**
   * Handle when no skills match
   */
  handleNoMatch(query) {
    const intent = this.matcher.parseIntent(query);
    let output = `🤔 No matching skills found for "${query}"\n\n`;

    // Suggest based on intent
    if (intent === 'learn') {
      output += 'For learning, try:\n  - tutor-mode\n  - skill-builder\n\n';
    } else if (intent === 'optimize') {
      output += 'For optimization, try:\n  - prompt-improver\n  - agentdb-optimization\n  - performance-analysis\n\n';
    } else if (intent === 'review') {
      output += 'For code review, try:\n  - github-code-review\n  - verification-quality\n\n';
    }

    output += 'Browse all skills: /meta menu\n';

    return output;
  }

  /**
   * Present auto-invoke option for high confidence match
   */
  presentAutoInvoke(match, query) {
    const { skill, score } = match;
    const confidence = Math.round(score * 100);

    return `
🎯 Found: ${skill.name} (${confidence}% confidence)
   ${skill.description}

Loading ${skill.id}...

Your request: "${query}"

${this.getSkillInvocationMessage(skill)}
`;
  }

  /**
   * Present multiple matches for user selection
   */
  presentMatches(matches, query) {
    let output = `🎯 Found ${matches.length} matching skills for "${query}":\n\n`;

    for (let i = 0; i < Math.min(matches.length, 5); i++) {
      const { skill, score, matchedKeywords } = matches[i];
      const confidence = Math.round(score * 100);
      const star = i === 0 ? '⭐ ' : '';

      output += `${i + 1}. ${star}${skill.id} (${confidence}% match)\n`;
      output += `   ${skill.description}\n`;
      output += `   Matched: ${matchedKeywords.join(', ')}\n\n`;
    }

    output += 'Select a skill (1-' + Math.min(matches.length, 5) + ') or describe differently:\n';

    return output;
  }

  /**
   * Load skill content (lazy loading)
   */
  async loadSkill(skill) {
    try {
      const content = await fs.readFile(skill.path, 'utf-8');

      return `
✅ Loaded: ${skill.name}
   Category: ${skill.category}
   ${skill.version ? `Version: ${skill.version}` : ''}

${content}
`;
    } catch (err) {
      return `❌ Failed to load skill "${skill.id}"
Reason: ${err.message}

The skill file may be missing or corrupted.
Path: ${skill.path}
`;
    }
  }

  /**
   * Get skill invocation message
   */
  getSkillInvocationMessage(skill) {
    return `Ready to use ${skill.name}. The skill documentation is now loaded.`;
  }
}

module.exports = MetaSkillCoordinator;
