/**
 * Captain's Log Integration - Enhanced
 *
 * Integrates with the workspace captain's log system to track prompt improvements,
 * learning, and store Context7 insights for cross-session persistence.
 */

const fs = require('fs');
const path = require('path');

class CaptainsLog {
  constructor(config = {}) {
    this.logPath = config.captainsLogPath ||
      path.join(process.cwd(), 'sessions/captains-log');
    this.insightsPath = path.join(this.logPath, 'context7-insights');
    this.enabled = config.captainsLog !== false;

    // Ensure insights directory exists
    if (this.enabled && !fs.existsSync(this.insightsPath)) {
      fs.mkdirSync(this.insightsPath, { recursive: true });
    }
  }

  /**
   * Log a prompt improvement to captain's log
   * @param {object} entry - Log entry
   */
  async logImprovement(entry) {
    if (!this.enabled) return;

    try {
      const logEntry = this._formatLogEntry(entry);
      const logFile = this._getTodaysLogFile();

      this._appendToLog(logFile, logEntry);

    } catch (error) {
      console.error('[CaptainsLog] Error logging improvement:', error.message);
    }
  }

  /**
   * Log learning statistics
   * @param {object} stats - Learning statistics
   */
  async logStats(stats) {
    if (!this.enabled) return;

    try {
      const logEntry = this._formatStatsEntry(stats);
      const logFile = this._getTodaysLogFile();

      this._appendToLog(logFile, logEntry);

    } catch (error) {
      console.error('[CaptainsLog] Error logging stats:', error.message);
    }
  }

  /**
   * Store Context7 insights for cross-session persistence
   * @param {object} insights - Context7 insights to store
   * @returns {Promise<string>} - File path of stored insights
   */
  async storeContext7Insights(insights) {
    if (!this.enabled) {
      console.warn('[CaptainsLog] Captain\'s log disabled, skipping insight storage');
      return null;
    }

    try {
      const timestamp = new Date().toISOString();
      const filename = `context7-${Date.now()}.json`;
      const filepath = path.join(this.insightsPath, filename);

      const insightData = {
        timestamp,
        version: '1.0.0',
        insights: {
          claudeCodePrinciples: insights.claudeCodePrinciples || [],
          qualityScoring: insights.qualityScoring || {},
          interventionThresholds: insights.interventionThresholds || {},
          patterns: insights.patterns || [],
          learnings: insights.learnings || [],
          metadata: insights.metadata || {}
        },
        searchable: {
          topics: this._extractTopics(insights),
          keywords: this._extractKeywords(insights),
          categories: this._extractCategories(insights)
        }
      };

      fs.writeFileSync(filepath, JSON.stringify(insightData, null, 2), 'utf8');

      // Also create a human-readable markdown version
      await this._createMarkdownInsight(insightData, filepath.replace('.json', '.md'));

      console.log(`[CaptainsLog] Stored Context7 insights: ${filename}`);
      return filepath;

    } catch (error) {
      console.error('[CaptainsLog] Error storing Context7 insights:', error.message);
      throw error;
    }
  }

  /**
   * Retrieve Context7 insights from previous sessions
   * @param {object} filters - Filter criteria
   * @returns {Promise<Array>} - Array of matching insights
   */
  async retrieveContext7Insights(filters = {}) {
    if (!this.enabled) {
      return [];
    }

    try {
      const insightFiles = fs.readdirSync(this.insightsPath)
        .filter(f => f.startsWith('context7-') && f.endsWith('.json'))
        .sort()
        .reverse(); // Most recent first

      const insights = [];

      for (const file of insightFiles) {
        const filepath = path.join(this.insightsPath, file);
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));

        // Apply filters
        if (filters.topic && !data.searchable.topics.includes(filters.topic)) {
          continue;
        }
        if (filters.keyword && !this._matchesKeyword(data, filters.keyword)) {
          continue;
        }
        if (filters.category && !data.searchable.categories.includes(filters.category)) {
          continue;
        }
        if (filters.since && new Date(data.timestamp) < new Date(filters.since)) {
          continue;
        }

        insights.push(data);

        // Limit results
        if (filters.limit && insights.length >= filters.limit) {
          break;
        }
      }

      return insights;

    } catch (error) {
      console.error('[CaptainsLog] Error retrieving Context7 insights:', error.message);
      return [];
    }
  }

  /**
   * Populate analyzer with learned patterns from previous sessions
   * @param {object} analyzer - Analyzer instance to populate
   * @returns {Promise<object>} - Summary of loaded patterns
   */
  async populateAnalyzer(analyzer) {
    if (!this.enabled) {
      return { loaded: false, reason: 'Captain\'s log disabled' };
    }

    try {
      // Retrieve recent insights
      const recentInsights = await this.retrieveContext7Insights({
        limit: 10,
        since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      });

      if (recentInsights.length === 0) {
        return { loaded: false, reason: 'No recent insights found' };
      }

      // Aggregate patterns
      const aggregated = {
        claudeCodePrinciples: [],
        qualityScoring: {},
        interventionThresholds: {},
        patterns: [],
        learnings: []
      };

      for (const insight of recentInsights) {
        // Merge principles
        if (insight.insights.claudeCodePrinciples) {
          aggregated.claudeCodePrinciples.push(...insight.insights.claudeCodePrinciples);
        }

        // Merge quality scoring (use most recent)
        if (insight.insights.qualityScoring) {
          Object.assign(aggregated.qualityScoring, insight.insights.qualityScoring);
        }

        // Merge intervention thresholds (use most recent)
        if (insight.insights.interventionThresholds) {
          Object.assign(aggregated.interventionThresholds, insight.insights.interventionThresholds);
        }

        // Merge patterns
        if (insight.insights.patterns) {
          aggregated.patterns.push(...insight.insights.patterns);
        }

        // Merge learnings
        if (insight.insights.learnings) {
          aggregated.learnings.push(...insight.insights.learnings);
        }
      }

      // Deduplicate principles and patterns
      aggregated.claudeCodePrinciples = [...new Set(aggregated.claudeCodePrinciples)];
      aggregated.patterns = this._deduplicatePatterns(aggregated.patterns);

      // Populate analyzer (if it has a method for this)
      if (typeof analyzer.loadInsights === 'function') {
        analyzer.loadInsights(aggregated);
      } else {
        // Store in analyzer's config or instance variable
        analyzer.context7Insights = aggregated;
      }

      return {
        loaded: true,
        insightsCount: recentInsights.length,
        principlesCount: aggregated.claudeCodePrinciples.length,
        patternsCount: aggregated.patterns.length,
        learningsCount: aggregated.learnings.length,
        summary: 'Successfully loaded Context7 insights into analyzer'
      };

    } catch (error) {
      console.error('[CaptainsLog] Error populating analyzer:', error.message);
      return { loaded: false, reason: error.message };
    }
  }

  /**
   * Search insights by topic
   * @param {string} topic - Topic to search for
   * @returns {Promise<Array>} - Matching insights
   */
  async searchByTopic(topic) {
    return this.retrieveContext7Insights({ topic });
  }

  /**
   * Search insights by keyword
   * @param {string} keyword - Keyword to search for
   * @returns {Promise<Array>} - Matching insights
   */
  async searchByKeyword(keyword) {
    return this.retrieveContext7Insights({ keyword });
  }

  /**
   * Get latest insight
   * @returns {Promise<object|null>} - Latest insight or null
   */
  async getLatestInsight() {
    const insights = await this.retrieveContext7Insights({ limit: 1 });
    return insights.length > 0 ? insights[0] : null;
  }

  /**
   * Format improvement entry for captain's log
   */
  _formatLogEntry(entry) {
    const timestamp = new Date(entry.timestamp).toISOString();
    const improvements = entry.improvements || [];

    let logEntry = `\n## Prompt Improvement - ${timestamp}\n\n`;
    logEntry += `**Mode**: ${entry.mode}\n\n`;
    logEntry += `**Original Prompt** (truncated):\n`;
    logEntry += `> ${this._truncate(entry.prompt, 100)}\n\n`;

    if (improvements.length > 0) {
      logEntry += `**Improvements Applied**:\n`;
      for (const improvement of improvements) {
        logEntry += `- ${improvement.type}: ${improvement.action}\n`;
        if (improvement.details) {
          const details = Array.isArray(improvement.details)
            ? improvement.details.join(', ')
            : JSON.stringify(improvement.details);
          logEntry += `  Details: ${details}\n`;
        }
      }
      logEntry += '\n';
    }

    logEntry += `**Impact**: Improved prompt quality for ${entry.mode} execution\n`;

    return logEntry;
  }

  /**
   * Format stats entry for captain's log
   */
  _formatStatsEntry(stats) {
    const timestamp = new Date().toISOString();

    let logEntry = `\n## Prompt Improver Statistics - ${timestamp}\n\n`;
    logEntry += `**Performance**:\n`;
    logEntry += `- Total Improvements: ${stats.totalImprovements}\n`;
    logEntry += `- Total Rejections: ${stats.totalRejections}\n`;
    logEntry += `- Acceptance Rate: ${(stats.acceptanceRate * 100).toFixed(1)}%\n\n`;

    if (stats.topImprovementTypes && stats.topImprovementTypes.length > 0) {
      logEntry += `**Top Improvement Types**:\n`;
      for (const { type, count } of stats.topImprovementTypes) {
        logEntry += `- ${type}: ${count} times\n`;
      }
      logEntry += '\n';
    }

    if (stats.recentTrend) {
      logEntry += `**Recent Trend** (${stats.recentTrend.days} days):\n`;
      logEntry += `- Trend: ${stats.recentTrend.trend}\n`;
      logEntry += `- Rate: ${(stats.recentTrend.rate * 100).toFixed(1)}%\n`;
      logEntry += `- Improvements: ${stats.recentTrend.improvements}\n`;
      logEntry += `- Rejections: ${stats.recentTrend.rejections}\n\n`;
    }

    return logEntry;
  }

  /**
   * Create markdown version of insights for human readability
   */
  async _createMarkdownInsight(insightData, filepath) {
    let markdown = `# Context7 Insights\n\n`;
    markdown += `**Timestamp**: ${insightData.timestamp}\n\n`;

    if (insightData.insights.claudeCodePrinciples.length > 0) {
      markdown += `## Claude Code Principles\n\n`;
      for (const principle of insightData.insights.claudeCodePrinciples) {
        markdown += `- ${principle}\n`;
      }
      markdown += '\n';
    }

    if (Object.keys(insightData.insights.qualityScoring).length > 0) {
      markdown += `## Quality Scoring Criteria\n\n`;
      markdown += '```json\n';
      markdown += JSON.stringify(insightData.insights.qualityScoring, null, 2);
      markdown += '\n```\n\n';
    }

    if (Object.keys(insightData.insights.interventionThresholds).length > 0) {
      markdown += `## Intervention Thresholds\n\n`;
      markdown += '```json\n';
      markdown += JSON.stringify(insightData.insights.interventionThresholds, null, 2);
      markdown += '\n```\n\n';
    }

    if (insightData.insights.patterns.length > 0) {
      markdown += `## Patterns\n\n`;
      for (const pattern of insightData.insights.patterns) {
        markdown += `### ${pattern.name || 'Pattern'}\n\n`;
        markdown += `${pattern.description || 'No description'}\n\n`;
      }
    }

    if (insightData.insights.learnings.length > 0) {
      markdown += `## Learnings\n\n`;
      for (const learning of insightData.insights.learnings) {
        markdown += `- ${learning}\n`;
      }
      markdown += '\n';
    }

    markdown += `## Searchable Metadata\n\n`;
    markdown += `**Topics**: ${insightData.searchable.topics.join(', ')}\n\n`;
    markdown += `**Keywords**: ${insightData.searchable.keywords.join(', ')}\n\n`;
    markdown += `**Categories**: ${insightData.searchable.categories.join(', ')}\n`;

    fs.writeFileSync(filepath, markdown, 'utf8');
  }

  /**
   * Extract topics from insights
   */
  _extractTopics(insights) {
    const topics = new Set();

    if (insights.qualityScoring) {
      topics.add('quality-scoring');
    }
    if (insights.interventionThresholds) {
      topics.add('intervention-thresholds');
    }
    if (insights.claudeCodePrinciples && insights.claudeCodePrinciples.length > 0) {
      topics.add('claude-code-principles');
    }
    if (insights.patterns && insights.patterns.length > 0) {
      topics.add('patterns');
    }

    return Array.from(topics);
  }

  /**
   * Extract keywords from insights
   */
  _extractKeywords(insights) {
    const keywords = new Set();

    // Extract from principles
    if (insights.claudeCodePrinciples) {
      for (const principle of insights.claudeCodePrinciples) {
        const words = principle.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
        words.forEach(w => keywords.add(w));
      }
    }

    // Extract from patterns
    if (insights.patterns) {
      for (const pattern of insights.patterns) {
        if (pattern.name) {
          const words = pattern.name.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
          words.forEach(w => keywords.add(w));
        }
      }
    }

    return Array.from(keywords).slice(0, 20); // Limit to top 20
  }

  /**
   * Extract categories from insights
   */
  _extractCategories(insights) {
    const categories = [];

    if (insights.claudeCodePrinciples && insights.claudeCodePrinciples.length > 0) {
      categories.push('principles');
    }
    if (insights.qualityScoring && Object.keys(insights.qualityScoring).length > 0) {
      categories.push('quality');
    }
    if (insights.interventionThresholds && Object.keys(insights.interventionThresholds).length > 0) {
      categories.push('thresholds');
    }
    if (insights.patterns && insights.patterns.length > 0) {
      categories.push('patterns');
    }
    if (insights.learnings && insights.learnings.length > 0) {
      categories.push('learnings');
    }

    return categories;
  }

  /**
   * Check if insight matches keyword
   */
  _matchesKeyword(insightData, keyword) {
    const searchIn = JSON.stringify(insightData).toLowerCase();
    return searchIn.includes(keyword.toLowerCase());
  }

  /**
   * Deduplicate patterns by name/description
   */
  _deduplicatePatterns(patterns) {
    const seen = new Map();
    const unique = [];

    for (const pattern of patterns) {
      const key = pattern.name || pattern.description || JSON.stringify(pattern);
      if (!seen.has(key)) {
        seen.set(key, true);
        unique.push(pattern);
      }
    }

    return unique;
  }

  /**
   * Get today's log file path
   */
  _getTodaysLogFile() {
    const today = new Date().toISOString().split('T')[0];
    return path.join(this.logPath, `${today}.md`);
  }

  /**
   * Append to log file
   */
  _appendToLog(logFile, content) {
    // Ensure directory exists
    const dir = path.dirname(logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create file with header if it doesn't exist
    if (!fs.existsSync(logFile)) {
      const date = new Date().toISOString().split('T')[0];
      const header = `# Captain's Log - ${date}\n\n`;
      fs.writeFileSync(logFile, header, 'utf8');
    }

    // Append content
    fs.appendFileSync(logFile, content, 'utf8');
  }

  /**
   * Truncate string
   */
  _truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  }
}

module.exports = { CaptainsLog };
