/**
 * Captain's Log Integration
 *
 * Integrates with the workspace captain's log system
 * to track prompt improvements and learning.
 */

const fs = require('fs');
const path = require('path');

class CaptainsLog {
  constructor(config = {}) {
    this.logPath = config.captainsLogPath ||
      path.join(process.cwd(), 'sessions/captains-log');
    this.enabled = config.captainsLog !== false;
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
