/**
 * Learning Log Module
 *
 * Tracks user preferences and successful patterns for continuous improvement.
 * Integrates with captain's log for persistence across sessions.
 */

const fs = require('fs').promises;
const path = require('path');

class LearningLog {
  constructor(config = {}) {
    this.config = config;
    this.captainsLogPath = config.captainsLogPath || 'sessions/captains-log';
    this.learningLogFile = path.join(this.captainsLogPath, 'learning-log.jsonl');

    // In-memory tracking
    this.preferences = new Map();
    this.patterns = new Map();
    this.rejectionPatterns = new Map();

    // Statistics
    this.stats = {
      totalRecords: 0,
      totalRejections: 0,
      patternUpdates: 0,
      lastUpdate: null
    };

    // Initialize log
    this._initialize().catch(err => {
      console.error('[LearningLog] Initialization error:', err.message);
    });
  }

  /**
   * Record a successful improvement interaction
   * @param {object} record - Improvement record
   * @returns {Promise<object>} Record result
   */
  async record(record) {
    try {
      const entry = {
        type: 'improvement',
        timestamp: record.timestamp || Date.now(),
        mode: record.analysis?.mode,
        originalQuality: record.analysis?.qualityDimensions?.overall,
        improvements: {
          fileRouting: record.userSelections?.fileRouting || false,
          structure: record.userSelections?.structure || false,
          clarity: record.userSelections?.clarity || false,
          coordination: record.userSelections?.coordination || false,
          context: record.userSelections?.context || false
        },
        context7Used: record.context7Used || false,
        promptSnippet: record.originalPrompt?.substring(0, 100),
        metadata: {
          agentCount: record.analysis?.agentCount,
          complexity: record.analysis?.complexity,
          interventionLevel: record.analysis?.interventionAnalysis?.interventionLevel
        }
      };

      // Update in-memory preferences
      this._updatePreferences(entry);

      // Update patterns
      this._updatePatterns(entry);

      // Persist to log file
      await this._persistEntry(entry);

      this.stats.totalRecords++;
      this.stats.lastUpdate = entry.timestamp;

      return {
        success: true,
        entry,
        timestamp: entry.timestamp
      };

    } catch (error) {
      console.error('[LearningLog] Record error:', error.message);

      return {
        success: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Record a rejection (user declined improvements)
   * @param {object} record - Rejection record
   * @returns {Promise<object>} Record result
   */
  async recordRejection(record) {
    try {
      const entry = {
        type: 'rejection',
        timestamp: record.timestamp || Date.now(),
        promptSnippet: record.prompt?.substring(0, 100),
        suggestions: this._summarizeSuggestions(record.suggestions),
        reason: record.reason || 'user_declined',
        metadata: {
          suggestionCount: this._countSuggestions(record.suggestions)
        }
      };

      // Track rejection patterns
      this._trackRejectionPattern(entry);

      // Persist to log file
      await this._persistEntry(entry);

      this.stats.totalRejections++;
      this.stats.lastUpdate = entry.timestamp;

      return {
        success: true,
        entry,
        timestamp: entry.timestamp
      };

    } catch (error) {
      console.error('[LearningLog] Record rejection error:', error.message);

      return {
        success: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Log user preference
   * @param {object} preference - User preference
   * @returns {object} Result
   */
  logUserPreference(preference) {
    try {
      const key = preference.type || 'general';
      const current = this.preferences.get(key) || { count: 0, values: [] };

      current.count++;
      current.values.push({
        value: preference.value,
        timestamp: Date.now()
      });

      // Keep last 20 values
      if (current.values.length > 20) {
        current.values.shift();
      }

      this.preferences.set(key, current);

      return {
        success: true,
        preference: key,
        count: current.count,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('[LearningLog] Log preference error:', error.message);

      return {
        success: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Get learned preferences
   * @param {string} type - Optional preference type filter
   * @returns {object} Preferences
   */
  getPreferences(type = null) {
    if (type) {
      const pref = this.preferences.get(type);
      return pref ? { [type]: pref } : {};
    }

    // Return all preferences
    const allPrefs = {};
    for (const [key, value] of this.preferences.entries()) {
      allPrefs[key] = value;
    }

    return allPrefs;
  }

  /**
   * Update pattern tracking
   * @param {string} pattern - Pattern identifier
   * @param {boolean} success - Whether pattern was successful
   * @returns {object} Updated pattern stats
   */
  updatePatterns(pattern, success) {
    try {
      const current = this.patterns.get(pattern) || {
        successes: 0,
        failures: 0,
        total: 0,
        lastSeen: null
      };

      current.total++;
      if (success) {
        current.successes++;
      } else {
        current.failures++;
      }
      current.lastSeen = Date.now();
      current.successRate = (current.successes / current.total * 100).toFixed(1);

      this.patterns.set(pattern, current);
      this.stats.patternUpdates++;

      return {
        success: true,
        pattern,
        stats: current,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('[LearningLog] Update patterns error:', error.message);

      return {
        success: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Get successful patterns
   * @param {number} minSuccessRate - Minimum success rate threshold (0-100)
   * @returns {Array} Successful patterns
   */
  getSuccessfulPatterns(minSuccessRate = 70) {
    const successful = [];

    for (const [pattern, stats] of this.patterns.entries()) {
      const rate = parseFloat(stats.successRate);
      if (rate >= minSuccessRate && stats.total >= 3) {
        successful.push({
          pattern,
          ...stats
        });
      }
    }

    // Sort by success rate and total usage
    return successful.sort((a, b) => {
      const rateDiff = parseFloat(b.successRate) - parseFloat(a.successRate);
      if (Math.abs(rateDiff) > 5) return rateDiff;
      return b.total - a.total;
    });
  }

  /**
   * Get learning statistics
   * @returns {object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      preferenceTypes: this.preferences.size,
      patterns: this.patterns.size,
      rejectionPatterns: this.rejectionPatterns.size
    };
  }

  /**
   * Get insights from learning log
   * @returns {object} Insights
   */
  async getInsights() {
    try {
      const insights = {
        mostCommonImprovements: this._getMostCommonImprovements(),
        frequentRejectionReasons: this._getFrequentRejectionReasons(),
        successfulPatterns: this.getSuccessfulPatterns(),
        preferencesTrends: this._getPreferenceTrends(),
        recommendations: this._generateRecommendations()
      };

      return {
        success: true,
        insights,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error('[LearningLog] Get insights error:', error.message);

      return {
        success: false,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  // ============================================================================
  // Private Methods
  // ============================================================================

  /**
   * Initialize learning log
   * @private
   */
  async _initialize() {
    try {
      // Ensure captain's log directory exists
      await fs.mkdir(this.captainsLogPath, { recursive: true });

      // Load existing log if present
      try {
        const content = await fs.readFile(this.learningLogFile, 'utf-8');
        const lines = content.trim().split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const entry = JSON.parse(line);

            if (entry.type === 'improvement') {
              this._updatePreferences(entry);
              this._updatePatterns(entry);
              this.stats.totalRecords++;
            } else if (entry.type === 'rejection') {
              this._trackRejectionPattern(entry);
              this.stats.totalRejections++;
            }

            if (entry.timestamp > (this.stats.lastUpdate || 0)) {
              this.stats.lastUpdate = entry.timestamp;
            }
          } catch (parseError) {
            // Skip malformed lines
            continue;
          }
        }

        console.log(`[LearningLog] Loaded ${lines.length} entries`);

      } catch (readError) {
        // Log file doesn't exist yet, that's okay
        console.log('[LearningLog] No existing log found, starting fresh');
      }

    } catch (error) {
      console.error('[LearningLog] Initialize error:', error.message);
    }
  }

  /**
   * Persist entry to log file
   * @private
   */
  async _persistEntry(entry) {
    try {
      const line = JSON.stringify(entry) + '\n';
      await fs.appendFile(this.learningLogFile, line, 'utf-8');
    } catch (error) {
      console.error('[LearningLog] Persist error:', error.message);
      // Don't throw - allow in-memory tracking to continue
    }
  }

  /**
   * Update preferences from entry
   * @private
   */
  _updatePreferences(entry) {
    if (entry.type !== 'improvement') return;

    for (const [key, value] of Object.entries(entry.improvements)) {
      if (value) {
        this.logUserPreference({ type: key, value: true });
      }
    }

    // Track mode preference
    if (entry.mode) {
      this.logUserPreference({ type: 'mode', value: entry.mode });
    }
  }

  /**
   * Update patterns from entry
   * @private
   */
  _updatePatterns(entry) {
    if (entry.type !== 'improvement') return;

    // Track improvement type patterns
    for (const [key, value] of Object.entries(entry.improvements)) {
      if (value) {
        const pattern = `improvement:${key}`;
        this.updatePatterns(pattern, true);
      }
    }

    // Track mode patterns
    if (entry.mode) {
      const pattern = `mode:${entry.mode}`;
      this.updatePatterns(pattern, true);
    }

    // Track Context7 usage patterns
    if (entry.context7Used) {
      this.updatePatterns('context7:used', true);
    }
  }

  /**
   * Track rejection pattern
   * @private
   */
  _trackRejectionPattern(entry) {
    const reason = entry.reason || 'unknown';
    const current = this.rejectionPatterns.get(reason) || 0;
    this.rejectionPatterns.set(reason, current + 1);
  }

  /**
   * Summarize suggestions for rejection tracking
   * @private
   */
  _summarizeSuggestions(suggestions) {
    if (!suggestions) return [];

    const summary = [];
    for (const [category, items] of Object.entries(suggestions)) {
      if (items && items.length > 0) {
        summary.push({
          category,
          count: items.length
        });
      }
    }

    return summary;
  }

  /**
   * Count total suggestions
   * @private
   */
  _countSuggestions(suggestions) {
    if (!suggestions) return 0;

    let total = 0;
    for (const items of Object.values(suggestions)) {
      if (Array.isArray(items)) {
        total += items.length;
      }
    }

    return total;
  }

  /**
   * Get most common improvements
   * @private
   */
  _getMostCommonImprovements() {
    const improvements = [];

    for (const [type, data] of this.preferences.entries()) {
      if (type !== 'mode' && type !== 'general') {
        improvements.push({
          type,
          count: data.count,
          percentage: (data.count / this.stats.totalRecords * 100).toFixed(1)
        });
      }
    }

    return improvements.sort((a, b) => b.count - a.count).slice(0, 5);
  }

  /**
   * Get frequent rejection reasons
   * @private
   */
  _getFrequentRejectionReasons() {
    const reasons = [];

    for (const [reason, count] of this.rejectionPatterns.entries()) {
      reasons.push({
        reason,
        count,
        percentage: (count / this.stats.totalRejections * 100).toFixed(1)
      });
    }

    return reasons.sort((a, b) => b.count - a.count).slice(0, 5);
  }

  /**
   * Get preference trends
   * @private
   */
  _getPreferenceTrends() {
    const trends = [];

    for (const [type, data] of this.preferences.entries()) {
      if (data.values.length >= 5) {
        const recent = data.values.slice(-5);
        const trend = {
          type,
          recentCount: recent.length,
          increasing: recent.length > data.values.length / 2
        };
        trends.push(trend);
      }
    }

    return trends;
  }

  /**
   * Generate recommendations based on learning
   * @private
   */
  _generateRecommendations() {
    const recommendations = [];

    // Recommend Context7 if high success rate
    const context7Pattern = this.patterns.get('context7:used');
    if (context7Pattern && parseFloat(context7Pattern.successRate) > 80) {
      recommendations.push({
        type: 'feature',
        recommendation: 'Enable Context7 by default (high success rate)',
        evidence: `${context7Pattern.successRate}% success rate over ${context7Pattern.total} uses`
      });
    }

    // Recommend common improvement types
    const commonImprovements = this._getMostCommonImprovements();
    if (commonImprovements.length > 0 && parseFloat(commonImprovements[0].percentage) > 60) {
      recommendations.push({
        type: 'improvement',
        recommendation: `Focus on ${commonImprovements[0].type} improvements`,
        evidence: `${commonImprovements[0].percentage}% of improvements include this type`
      });
    }

    return recommendations;
  }
}

module.exports = { LearningLog };
