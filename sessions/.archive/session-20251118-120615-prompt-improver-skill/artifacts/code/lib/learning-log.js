/**
 * Learning Log
 *
 * Separate learning log for tracking improvements and rejections.
 * Used to continuously improve suggestion quality.
 */

const fs = require('fs');
const path = require('path');

class LearningLog {
  constructor(config = {}) {
    this.logPath = config.learningLogPath ||
      path.join(process.cwd(), '.prompt-improver-learning');
    this.maxEntries = config.maxLearningEntries || 1000;

    this._ensureLogDirectory();
  }

  /**
   * Record successful improvement
   * @param {object} entry - Learning entry
   */
  async record(entry) {
    try {
      const logFile = path.join(this.logPath, 'improvements.jsonl');

      const logEntry = {
        ...entry,
        timestamp: entry.timestamp || Date.now(),
        type: 'improvement'
      };

      fs.appendFileSync(
        logFile,
        JSON.stringify(logEntry) + '\n',
        'utf8'
      );

      // Rotate if needed
      await this._rotateIfNeeded(logFile);

    } catch (error) {
      console.error('[LearningLog] Error recording improvement:', error.message);
    }
  }

  /**
   * Record rejection
   * @param {object} entry - Rejection entry
   */
  async recordRejection(entry) {
    try {
      const logFile = path.join(this.logPath, 'rejections.jsonl');

      const logEntry = {
        ...entry,
        timestamp: entry.timestamp || Date.now(),
        type: 'rejection'
      };

      fs.appendFileSync(
        logFile,
        JSON.stringify(logEntry) + '\n',
        'utf8'
      );

      // Rotate if needed
      await this._rotateIfNeeded(logFile);

    } catch (error) {
      console.error('[LearningLog] Error recording rejection:', error.message);
    }
  }

  /**
   * Get learning statistics
   * @returns {Promise<object>} Statistics
   */
  async getStats() {
    try {
      const improvements = await this._readLog('improvements.jsonl');
      const rejections = await this._readLog('rejections.jsonl');

      const stats = {
        totalImprovements: improvements.length,
        totalRejections: rejections.length,
        acceptanceRate: improvements.length / (improvements.length + rejections.length),

        topImprovementTypes: this._getTopTypes(improvements, 'suggestions'),
        topRejectionReasons: this._getTopReasons(rejections),

        avgImprovementsPerPrompt: this._calculateAverage(improvements, 'suggestions'),

        recentTrend: this._calculateTrend(improvements, rejections, 7)
      };

      return stats;

    } catch (error) {
      console.error('[LearningLog] Error getting stats:', error.message);
      return null;
    }
  }

  /**
   * Get successful patterns for a category
   * @param {string} category - Category (structure, clarity, etc.)
   * @param {number} limit - Number of patterns to return
   * @returns {Promise<Array>} Successful patterns
   */
  async getSuccessfulPatterns(category, limit = 10) {
    try {
      const improvements = await this._readLog('improvements.jsonl');

      const patterns = improvements
        .filter(entry => {
          return entry.suggestions &&
                 entry.suggestions[category] &&
                 entry.suggestions[category].length > 0;
        })
        .map(entry => ({
          originalPrompt: entry.originalPrompt,
          improvedPrompt: entry.improvedPrompt,
          suggestions: entry.suggestions[category],
          userSelections: entry.userSelections ? entry.userSelections[category] : [],
          timestamp: entry.timestamp
        }))
        .slice(-limit);

      return patterns;

    } catch (error) {
      console.error('[LearningLog] Error getting patterns:', error.message);
      return [];
    }
  }

  /**
   * Get rejection patterns to avoid
   * @param {number} limit - Number of patterns to return
   * @returns {Promise<Array>} Rejection patterns
   */
  async getRejectionPatterns(limit = 10) {
    try {
      const rejections = await this._readLog('rejections.jsonl');

      return rejections
        .map(entry => ({
          prompt: entry.prompt,
          suggestions: entry.suggestions,
          reason: entry.reason,
          timestamp: entry.timestamp
        }))
        .slice(-limit);

    } catch (error) {
      console.error('[LearningLog] Error getting rejection patterns:', error.message);
      return [];
    }
  }

  /**
   * Ensure log directory exists
   */
  _ensureLogDirectory() {
    if (!fs.existsSync(this.logPath)) {
      fs.mkdirSync(this.logPath, { recursive: true });
    }
  }

  /**
   * Read log file
   */
  async _readLog(filename) {
    const logFile = path.join(this.logPath, filename);

    if (!fs.existsSync(logFile)) {
      return [];
    }

    const content = fs.readFileSync(logFile, 'utf8');
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  /**
   * Rotate log file if it exceeds max entries
   */
  async _rotateIfNeeded(logFile) {
    try {
      const content = fs.readFileSync(logFile, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());

      if (lines.length > this.maxEntries) {
        // Keep only the most recent entries
        const keep = lines.slice(-this.maxEntries);
        fs.writeFileSync(logFile, keep.join('\n') + '\n', 'utf8');

        // Archive old entries
        const timestamp = new Date().toISOString().split('T')[0];
        const archiveFile = logFile.replace('.jsonl', `-archive-${timestamp}.jsonl`);
        const archive = lines.slice(0, -this.maxEntries);
        fs.writeFileSync(archiveFile, archive.join('\n') + '\n', 'utf8');
      }

    } catch (error) {
      console.error('[LearningLog] Error rotating log:', error.message);
    }
  }

  /**
   * Get top improvement types
   */
  _getTopTypes(entries, field) {
    const counts = {};

    for (const entry of entries) {
      if (entry[field]) {
        for (const [category, items] of Object.entries(entry[field])) {
          for (const item of items) {
            const key = `${category}:${item.type || 'unknown'}`;
            counts[key] = (counts[key] || 0) + 1;
          }
        }
      }
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));
  }

  /**
   * Get top rejection reasons
   */
  _getTopReasons(entries) {
    const counts = {};

    for (const entry of entries) {
      const reason = entry.reason || 'unknown';
      counts[reason] = (counts[reason] || 0) + 1;
    }

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason, count]) => ({ reason, count }));
  }

  /**
   * Calculate average
   */
  _calculateAverage(entries, field) {
    if (entries.length === 0) return 0;

    let total = 0;
    for (const entry of entries) {
      if (entry[field]) {
        total += Object.values(entry[field]).flat().length;
      }
    }

    return total / entries.length;
  }

  /**
   * Calculate trend (last N days)
   */
  _calculateTrend(improvements, rejections, days) {
    const now = Date.now();
    const cutoff = now - (days * 24 * 60 * 60 * 1000);

    const recentImprovements = improvements.filter(e => e.timestamp >= cutoff);
    const recentRejections = rejections.filter(e => e.timestamp >= cutoff);

    const total = recentImprovements.length + recentRejections.length;
    if (total === 0) return { trend: 'no-data', rate: 0 };

    const rate = recentImprovements.length / total;

    let trend = 'stable';
    if (rate > 0.7) trend = 'improving';
    if (rate < 0.3) trend = 'declining';

    return {
      trend,
      rate,
      improvements: recentImprovements.length,
      rejections: recentRejections.length,
      days
    };
  }
}

module.exports = { LearningLog };
