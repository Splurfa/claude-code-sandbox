/**
 * Context7 Integration Module
 *
 * Provides intelligent consultation with Claude Code documentation
 * using Context7's retrieval mechanism. Implements smart caching
 * and complexity heuristics to minimize token usage.
 */

class Context7Integration {
  constructor(config = {}) {
    this.config = config;
    this.sessionCache = new Map(); // Session-level cache
    this.lastFetchTime = new Map(); // Track fetch timestamps
    this.cacheTTL = config.cacheTTL || 3600000; // 1 hour default
  }

  /**
   * Check if Context7 consultation is needed based on complexity heuristics
   * @param {object} analysis - Prompt analysis result
   * @returns {boolean} True if Context7 should be consulted
   */
  shouldConsultContext7(analysis) {
    // Complexity heuristics for Context7 consultation
    const triggers = {
      // High complexity prompts benefit from Claude Code best practices
      highComplexity: analysis.complexity > 0.6,

      // Low quality prompts need grounding in principles
      lowQuality: analysis.qualityScore < 0.5,

      // Critical issues require authoritative guidance
      criticalIssues: analysis.criticalIssues && analysis.criticalIssues.length > 0,

      // Multi-agent coordination needs proper patterns
      multiAgent: analysis.mode !== 'direct' && analysis.agentCount > 2,

      // Missing structural elements need Claude Code guidance
      missingStructure: analysis.structure && analysis.structure.score < 0.4
    };

    // Consult if any trigger is active
    return Object.values(triggers).some(Boolean);
  }

  /**
   * Fetch relevant Claude Code documentation insights
   * @param {object} analysis - Prompt analysis result
   * @returns {Promise<object>} Context7 insights
   */
  async fetchContext7Insights(analysis) {
    try {
      // Check cache first
      const cacheKey = this._getCacheKey(analysis);
      const cached = this._getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // Determine which documentation sections to fetch
      const sections = this._selectRelevantSections(analysis);

      // Fetch documentation (in real implementation, use Context7 API)
      const insights = await this._fetchDocumentation(sections, analysis);

      // Cache results
      this._storeInCache(cacheKey, insights);

      return insights;

    } catch (error) {
      console.error('[Context7] Error fetching insights:', error.message);
      return this._getFallbackInsights(analysis);
    }
  }

  /**
   * Select relevant documentation sections based on analysis
   * @param {object} analysis - Prompt analysis
   * @returns {Array<string>} Documentation sections to fetch
   */
  _selectRelevantSections(analysis) {
    const sections = [];

    // Mode-specific guidance
    if (analysis.mode === 'hive') {
      sections.push('advanced/hive-mind');
      sections.push('advanced/consensus-mechanisms');
    } else if (analysis.mode === 'swarm') {
      sections.push('advanced/swarm-coordination');
      sections.push('essentials/agent-spawning');
    } else if (analysis.mode === 'wizard') {
      sections.push('learning/wizard-mode');
    }

    // Session management if file paths mentioned
    if (analysis.context && (analysis.context.files || analysis.context.directories)) {
      sections.push('essentials/session-management');
      sections.push('essentials/quick-start');
    }

    // Memory coordination for multi-agent
    if (analysis.agentCount > 2) {
      sections.push('essentials/memory-coordination');
    }

    // Quality and best practices
    if (analysis.qualityScore < 0.5) {
      sections.push('essentials/prompt-engineering');
      sections.push('reality/architecture');
    }

    // Limit to top 3 sections for token efficiency
    return sections.slice(0, 3);
  }

  /**
   * Fetch documentation from selected sections
   * @param {Array<string>} sections - Documentation sections
   * @param {object} analysis - Prompt analysis
   * @returns {Promise<object>} Extracted insights
   */
  async _fetchDocumentation(sections, analysis) {
    // In real implementation, this would use Context7's retrieval mechanism
    // For now, return structured insights based on section patterns

    const insights = {
      principles: [],
      patterns: [],
      antipatterns: [],
      recommendations: [],
      examples: [],
      timestamp: Date.now()
    };

    // Extract principles from Claude Code documentation
    for (const section of sections) {
      const sectionInsights = await this._extractSectionInsights(section, analysis);

      insights.principles.push(...sectionInsights.principles);
      insights.patterns.push(...sectionInsights.patterns);
      insights.antipatterns.push(...sectionInsights.antipatterns);
      insights.recommendations.push(...sectionInsights.recommendations);
      insights.examples.push(...sectionInsights.examples);
    }

    // Deduplicate and prioritize
    insights.principles = this._deduplicate(insights.principles).slice(0, 5);
    insights.patterns = this._deduplicate(insights.patterns).slice(0, 5);
    insights.antipatterns = this._deduplicate(insights.antipatterns).slice(0, 3);
    insights.recommendations = this._deduplicate(insights.recommendations).slice(0, 5);
    insights.examples = this._deduplicate(insights.examples).slice(0, 3);

    return insights;
  }

  /**
   * Extract insights from a specific documentation section
   * @param {string} section - Documentation section path
   * @param {object} analysis - Prompt analysis context
   * @returns {Promise<object>} Section-specific insights
   */
  async _extractSectionInsights(section, analysis) {
    // This is a simplified implementation
    // Real implementation would parse actual documentation files

    const knowledgeBase = {
      'advanced/hive-mind': {
        principles: [
          'Queen agent coordinates collective intelligence',
          'Consensus mechanisms ensure alignment',
          'Byzantine fault tolerance for reliability'
        ],
        patterns: [
          'Hierarchical topology with queen at apex',
          'Proposal-vote-execute consensus flow',
          'Memory-backed decision persistence'
        ],
        antipatterns: [
          'No queen specified in hierarchical mode',
          'Missing consensus mechanism for critical decisions',
          'No convergence criteria defined'
        ],
        recommendations: [
          'Use /hive-mind:wizard for guided setup',
          'Define queen capabilities explicitly',
          'Specify vote threshold for consensus'
        ],
        examples: [
          'npx claude-flow@alpha hive-mind:wizard'
        ]
      },
      'advanced/swarm-coordination': {
        principles: [
          'Concurrent execution via Claude Code Task tool',
          'MCP coordinates, Claude Code executes',
          '"1 MESSAGE = ALL OPERATIONS" golden rule'
        ],
        patterns: [
          'Batch all agent spawning in single message',
          'Use mesh topology for peer coordination',
          'Memory namespace for inter-agent communication'
        ],
        antipatterns: [
          'Sequential agent spawning (slow)',
          'Multiple messages for related operations',
          'No memory coordination strategy'
        ],
        recommendations: [
          'Spawn all agents concurrently via Task tool',
          'Define clear memory namespaces',
          'Use hooks for automatic coordination'
        ],
        examples: [
          'Task("Agent1", "Work", "type") + Task("Agent2", "Work", "type")'
        ]
      },
      'essentials/session-management': {
        principles: [
          'ONE SESSION = ONE CHAT THREAD',
          'ALL work goes to sessions/$SESSION_ID/artifacts/',
          'Never write to root docs/, tests/, scripts/'
        ],
        patterns: [
          'Create session at chat start',
          'Route all files to session artifacts',
          'Closeout and archive on chat end'
        ],
        antipatterns: [
          'Writing to root directories',
          'Multiple sessions per chat',
          'No session closeout'
        ],
        recommendations: [
          'Use /session-start <topic> at beginning',
          'Always specify sessions/$SESSION_ID/artifacts/ paths',
          'Run /session-closeout when done'
        ],
        examples: [
          '/session-start api-refactor',
          'sessions/session-YYYYMMDD-HHMMSS-api-refactor/artifacts/code/'
        ]
      },
      'essentials/memory-coordination': {
        principles: [
          'Memory enables cross-agent communication',
          'Namespaces organize coordination data',
          'SQLite-backed for persistence'
        ],
        patterns: [
          'Store decisions in swarm/shared namespace',
          'Agents retrieve before starting work',
          'Update memory after completing tasks'
        ],
        antipatterns: [
          'No memory coordination in multi-agent tasks',
          'Missing namespace organization',
          'No cleanup of stale entries'
        ],
        recommendations: [
          'Use mcp__claude-flow__memory_usage for coordination',
          'Define clear namespace conventions',
          'TTL for temporary coordination data'
        ],
        examples: [
          'mcp__claude-flow__memory_usage({ action: "store", key: "swarm/decision", value: "data" })'
        ]
      },
      'essentials/prompt-engineering': {
        principles: [
          'Specificity beats vagueness',
          'Include what, where, and why',
          'Define success criteria upfront'
        ],
        patterns: [
          'Action + Target + Context structure',
          'Explicit file paths and locations',
          'Clear deliverables and constraints'
        ],
        antipatterns: [
          'Vague pronouns (it, that, thing)',
          'Missing file locations',
          'Undefined success criteria'
        ],
        recommendations: [
          'Use concrete nouns instead of pronouns',
          'Always specify file save locations',
          'State expected outcomes explicitly'
        ],
        examples: [
          'Implement JWT auth in src/auth.js with refresh tokens, saving to sessions/$SESSION_ID/artifacts/code/'
        ]
      },
      'reality/architecture': {
        principles: [
          'MCP coordinates strategy, Claude Code executes',
          'Containment-promotion architecture',
          'Concurrent execution for performance'
        ],
        patterns: [
          'Use Task tool for agent spawning',
          'Batch operations in single messages',
          'Session artifacts for AI work'
        ],
        antipatterns: [
          'Using MCP for execution (wrong layer)',
          'Sequential operations across messages',
          'Writing to workspace instead of sessions'
        ],
        recommendations: [
          'Understand the execution layers',
          'Follow "1 MESSAGE = ALL OPERATIONS" rule',
          'Use session artifacts for containment'
        ],
        examples: [
          '[Single Message]: Task() + Task() + TodoWrite() + Write()'
        ]
      }
    };

    const sectionData = knowledgeBase[section] || {
      principles: [],
      patterns: [],
      antipatterns: [],
      recommendations: [],
      examples: []
    };

    return sectionData;
  }

  /**
   * Get cache key for analysis
   */
  _getCacheKey(analysis) {
    return `${analysis.mode}-${analysis.complexity.toFixed(1)}-${analysis.agentCount}`;
  }

  /**
   * Get from session cache if not expired
   */
  _getFromCache(cacheKey) {
    const cached = this.sessionCache.get(cacheKey);
    if (!cached) return null;

    const age = Date.now() - (this.lastFetchTime.get(cacheKey) || 0);
    if (age > this.cacheTTL) {
      // Expired, remove from cache
      this.sessionCache.delete(cacheKey);
      this.lastFetchTime.delete(cacheKey);
      return null;
    }

    return cached;
  }

  /**
   * Store in session cache
   */
  _storeInCache(cacheKey, insights) {
    this.sessionCache.set(cacheKey, insights);
    this.lastFetchTime.set(cacheKey, Date.now());
  }

  /**
   * Deduplicate array items
   */
  _deduplicate(items) {
    return [...new Set(items)];
  }

  /**
   * Get fallback insights when Context7 fetch fails
   */
  _getFallbackInsights(analysis) {
    return {
      principles: ['Be specific and actionable'],
      patterns: ['Define clear requirements'],
      antipatterns: ['Avoid vague terminology'],
      recommendations: ['Include file paths and success criteria'],
      examples: [],
      timestamp: Date.now(),
      fallback: true
    };
  }

  /**
   * Clear session cache (called on session end)
   */
  clearCache() {
    this.sessionCache.clear();
    this.lastFetchTime.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      entries: this.sessionCache.size,
      oldestEntry: Math.min(...Array.from(this.lastFetchTime.values())),
      newestEntry: Math.max(...Array.from(this.lastFetchTime.values())),
      ttl: this.cacheTTL
    };
  }
}

module.exports = { Context7Integration };
