/**
 * Enhanced Captain's Log Integration
 *
 * Stores Context7 insights, learning statistics, and tracks
 * when Claude Code documentation insights were consulted.
 */

const fs = require('fs');
const path = require('path');

class EnhancedCaptainsLog {
  constructor(config = {}) {
    this.logPath = config.captainsLogPath ||
      path.join(process.cwd(), 'sessions/captains-log');
    this.enabled = config.captainsLog !== false;
  }

  /**
   * Log Context7 consultation with insights retrieved
   * @param {object} entry - Context7 consultation entry
   */
  async logContext7Consultation(entry) {
    if (!this.enabled) return;

    try {
      const logEntry = this._formatContext7Entry(entry);
      const logFile = this._getTodaysLogFile();

      this._appendToLog(logFile, logEntry);

    } catch (error) {
      console.error('[CaptainsLog] Error logging Context7:', error.message);
    }
  }

  /**
   * Log security event
   * @param {object} event - Security event
   */
  async logSecurityEvent(event) {
    if (!this.enabled) return;

    try {
      const logEntry = this._formatSecurityEntry(event);
      const logFile = this._getTodaysLogFile();
      this._appendToLog(logFile, logEntry);
    } catch (error) {
      console.error('[CaptainsLog] Error logging security event:', error.message);
    }
  }

  /**
   * Log a prompt improvement to captain's log
   * @param {object} entry - Log entry
   */
  async logImprovement(entry) {
    if (!this.enabled) return;

    try {
      const logEntry = this._formatImprovementEntry(entry);
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
   * Log session summary with Context7 cache stats
   * @param {object} summary - Session summary
   */
  async logSessionSummary(summary) {
    if (!this.enabled) return;

    try {
      const logEntry = this._formatSessionSummary(summary);
      const logFile = this._getTodaysLogFile();

      this._appendToLog(logFile, logEntry);

    } catch (error) {
      console.error('[CaptainsLog] Error logging session summary:', error.message);
    }
  }

  /**
   * Format Context7 consultation entry
   */
  _formatContext7Entry(entry) {
    const timestamp = new Date(entry.timestamp).toISOString();
    const insights = entry.insights || {};

    let logEntry = `\n### Context7 Consultation - ${timestamp}\n\n`;
    logEntry += `**Trigger**: ${entry.trigger || 'Complexity/Quality threshold'}\n`;
    logEntry += `**Mode**: ${entry.mode}\n`;
    logEntry += `**Sections Consulted**: ${(entry.sections || []).join(', ')}\n\n`;

    if (insights.principles && insights.principles.length > 0) {
      logEntry += `**Claude Code Principles Retrieved**:\n`;
      for (const principle of insights.principles) {
        logEntry += `- ${principle}\n`;
      }
      logEntry += '\n';
    }

    if (insights.patterns && insights.patterns.length > 0) {
      logEntry += `**Patterns Identified**:\n`;
      for (const pattern of insights.patterns) {
        logEntry += `- ${pattern}\n`;
      }
      logEntry += '\n';
    }

    if (insights.antipatterns && insights.antipatterns.length > 0) {
      logEntry += `**Antipatterns to Avoid**:\n`;
      for (const antipattern of insights.antipatterns) {
        logEntry += `- ${antipattern}\n`;
      }
      logEntry += '\n';
    }

    if (insights.recommendations && insights.recommendations.length > 0) {
      logEntry += `**Recommendations Applied**:\n`;
      for (const recommendation of insights.recommendations) {
        logEntry += `- ${recommendation}\n`;
      }
      logEntry += '\n';
    }

    if (entry.cacheHit) {
      logEntry += `**Cache**: Retrieved from session cache (${entry.cacheAge}ms old)\n`;
    } else {
      logEntry += `**Cache**: Freshly fetched and cached\n`;
    }

    logEntry += `\n**Impact**: Grounded prompt improvement in Claude Code best practices\n`;

    return logEntry;
  }

  _formatSecurityEntry(event) {
    const timestamp = new Date(event.timestamp || Date.now()).toISOString();
    let logEntry = `\n### 🛡️ Security Event - ${timestamp}\n\n`;
    logEntry += `**Type**: ${event.type}\n`;
    logEntry += `**Severity**: ${event.severity}\n`;
    logEntry += `**Description**: ${event.description || event.details?.description || 'No description'}\n`;
    
    if (event.details) {
       logEntry += `**Details**: ${JSON.stringify(event.details)}\n`;
    }
    
    return logEntry;
  }

  /**
   * Format improvement entry for captain's log
   */
  _formatImprovementEntry(entry) {
    const timestamp = new Date(entry.timestamp).toISOString();
    const improvements = entry.improvements || [];

    let logEntry = `\n## Prompt Improvement - ${timestamp}\n\n`;
    logEntry += `**Mode**: ${entry.mode}\n`;

    if (entry.qualityScore !== undefined) {
      logEntry += `**Quality Score**: ${(entry.qualityScore * 100).toFixed(1)}%\n`;
    }

    if (entry.interventionLevel) {
      logEntry += `**Intervention Level**: ${entry.interventionLevel}\n`;
    }

    logEntry += `\n**Original Prompt** (truncated):\n`;
    logEntry += `> ${this._truncate(entry.prompt, 150)}\n\n`;

    if (improvements.length > 0) {
      logEntry += `**Improvements Applied**:\n`;
      for (const improvement of improvements) {
        logEntry += `- **${improvement.type}**: ${improvement.action}\n`;
        if (improvement.details) {
          const details = Array.isArray(improvement.details)
            ? improvement.details.join(', ')
            : JSON.stringify(improvement.details);
          logEntry += `  _Details_: ${details}\n`;
        }
      }
      logEntry += '\n';
    }

    if (entry.context7Used) {
      logEntry += `**Context7**: Consulted Claude Code documentation\n`;
    }

    logEntry += `**Impact**: Improved prompt quality and Claude Code compliance\n`;

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
    logEntry += `- Acceptance Rate: ${(stats.acceptanceRate * 100).toFixed(1)}%\n`;
    logEntry += `- Context7 Consultations: ${stats.context7Consultations || 0}\n`;
    logEntry += `- Cache Hit Rate: ${((stats.cacheHits || 0) / Math.max(1, stats.context7Consultations || 1) * 100).toFixed(1)}%\n\n`;

    if (stats.topImprovementTypes && stats.topImprovementTypes.length > 0) {
      logEntry += `**Top Improvement Types**:\n`;
      for (const { type, count } of stats.topImprovementTypes) {
        logEntry += `- ${type}: ${count} times\n`;
      }
      logEntry += '\n';
    }

    if (stats.qualityImprovements) {
      logEntry += `**Quality Improvements**:\n`;
      logEntry += `- Average Initial Score: ${(stats.qualityImprovements.averageInitial * 100).toFixed(1)}%\n`;
      logEntry += `- Average Final Score: ${(stats.qualityImprovements.averageFinal * 100).toFixed(1)}%\n`;
      logEntry += `- Average Improvement: +${((stats.qualityImprovements.averageFinal - stats.qualityImprovements.averageInitial) * 100).toFixed(1)}%\n\n`;
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
   * Format session summary
   */
  _formatSessionSummary(summary) {
    const timestamp = new Date(summary.timestamp || Date.now()).toISOString();

    let logEntry = `\n---\n\n## Prompt Improver Session Summary - ${timestamp}\n\n`;

    if (summary.sessionDuration) {
      const minutes = Math.floor(summary.sessionDuration / 60000);
      logEntry += `**Session Duration**: ${minutes} minutes\n`;
    }

    logEntry += `**Total Prompts Analyzed**: ${summary.totalAnalyzed || 0}\n`;
    logEntry += `**Prompts Improved**: ${summary.totalImproved || 0}\n`;
    logEntry += `**Improvement Rate**: ${((summary.totalImproved || 0) / Math.max(1, summary.totalAnalyzed || 1) * 100).toFixed(1)}%\n\n`;

    if (summary.context7Stats) {
      logEntry += `**Context7 Statistics**:\n`;
      logEntry += `- Consultations: ${summary.context7Stats.consultations}\n`;
      logEntry += `- Cache Entries: ${summary.context7Stats.cacheEntries}\n`;
      logEntry += `- Cache Hit Rate: ${((summary.context7Stats.cacheHits || 0) / Math.max(1, summary.context7Stats.consultations) * 100).toFixed(1)}%\n`;
      logEntry += `- Token Savings (estimated): ${summary.context7Stats.tokenSavings || 'N/A'}\n\n`;
    }

    if (summary.topIssues && summary.topIssues.length > 0) {
      logEntry += `**Most Common Issues**:\n`;
      for (const { type, count } of summary.topIssues) {
        logEntry += `- ${type}: ${count} occurrences\n`;
      }
      logEntry += '\n';
    }

    if (summary.qualityMetrics) {
      logEntry += `**Quality Metrics**:\n`;
      logEntry += `- Average Initial Quality: ${(summary.qualityMetrics.avgInitial * 100).toFixed(1)}%\n`;
      logEntry += `- Average Final Quality: ${(summary.qualityMetrics.avgFinal * 100).toFixed(1)}%\n`;
      logEntry += `- Average Improvement: +${((summary.qualityMetrics.avgFinal - summary.qualityMetrics.avgInitial) * 100).toFixed(1)}%\n\n`;
    }

    logEntry += `**Learning**: Patterns and insights persisted to memory for future sessions\n`;

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
    const dir = path.dirname(logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(logFile)) {
      const date = new Date().toISOString().split('T')[0];
      const header = `# Captain's Log - ${date}\n\n`;
      fs.writeFileSync(logFile, header, 'utf8');
    }

    fs.appendFileSync(logFile, content, 'utf8');
  }

  /**
   * Truncate string
   */
  _truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  }

  /**
   * Get recent Context7 consultations from log
   * @param {number} days - Number of days to look back
   * @returns {Promise<Array>} Recent consultations
   */
  async getRecentContext7Consultations(days = 7) {
    if (!this.enabled) return [];

    try {
      const consultations = [];
      const now = Date.now();
      const cutoff = now - (days * 24 * 60 * 60 * 1000);

      // Scan log files for Context7 entries
      for (let i = 0; i < days; i++) {
        const date = new Date(now - (i * 24 * 60 * 60 * 1000));
        const dateStr = date.toISOString().split('T')[0];
        const logFile = path.join(this.logPath, `${dateStr}.md`);

        if (fs.existsSync(logFile)) {
          const content = fs.readFileSync(logFile, 'utf8');

          // Extract Context7 sections
          const regex = /### Context7 Consultation - (.+?)\n\n(.+?)(?=\n###|\n##|$)/gs;
          let match;

          while ((match = regex.exec(content)) !== null) {
            const timestamp = new Date(match[1]).getTime();
            if (timestamp >= cutoff) {
              consultations.push({
                timestamp,
                date: match[1],
                content: match[2].trim()
              });
            }
          }
        }
      }

      return consultations.sort((a, b) => b.timestamp - a.timestamp);

    } catch (error) {
      console.error('[CaptainsLog] Error reading consultations:', error.message);
      return [];
    }
  }
}

module.exports = { EnhancedCaptainsLog };
