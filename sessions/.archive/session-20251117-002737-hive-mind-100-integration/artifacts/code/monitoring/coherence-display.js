/**
 * Coherence Display Component
 *
 * Specialized component for displaying and analyzing coherence scores
 * in real-time with trend analysis and forecasting.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class CoherenceDisplay {
  constructor(options = {}) {
    this.dbPath = options.dbPath || path.join(process.cwd(), '.hive-mind/hive.db');
    this.db = null;
    this.thresholds = {
      optimal: 0.95,
      warning: 0.90,
      critical: 0.85
    };
  }

  /**
   * Initialize database connection
   */
  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Get current coherence score
   */
  async getCurrentCoherence() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT metric_value, timestamp
        FROM performance_metrics
        WHERE metric_name = 'coherence_score'
        ORDER BY timestamp DESC
        LIMIT 1
      `;

      this.db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row || { metric_value: 0, timestamp: null });
      });
    });
  }

  /**
   * Get coherence history for trend analysis
   */
  async getCoherenceHistory(hours = 24) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT metric_value, timestamp
        FROM performance_metrics
        WHERE metric_name = 'coherence_score'
          AND timestamp > datetime('now', '-${hours} hours')
        ORDER BY timestamp ASC
      `;

      this.db.all(query, (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Calculate coherence statistics
   */
  async getCoherenceStats(hours = 24) {
    const history = await this.getCoherenceHistory(hours);

    if (history.length === 0) {
      return {
        current: 0,
        average: 0,
        min: 0,
        max: 0,
        trend: 'stable',
        volatility: 0
      };
    }

    const values = history.map(h => h.metric_value);
    const current = values[values.length - 1];
    const average = values.reduce((sum, v) => sum + v, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Calculate trend (simple linear regression slope)
    const trend = this.calculateTrend(values);

    // Calculate volatility (standard deviation)
    const volatility = this.calculateVolatility(values, average);

    return {
      current,
      average,
      min,
      max,
      trend,
      volatility,
      dataPoints: history.length
    };
  }

  /**
   * Calculate trend direction
   */
  calculateTrend(values) {
    if (values.length < 2) return 'stable';

    const n = values.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += values[i];
      sumXY += i * values[i];
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);

    if (slope > 0.001) return 'improving';
    if (slope < -0.001) return 'declining';
    return 'stable';
  }

  /**
   * Calculate volatility (standard deviation)
   */
  calculateVolatility(values, average) {
    if (values.length < 2) return 0;

    const squaredDiffs = values.map(v => Math.pow(v - average, 2));
    const variance = squaredDiffs.reduce((sum, sd) => sum + sd, 0) / values.length;
    return Math.sqrt(variance);
  }

  /**
   * Forecast future coherence using simple moving average
   */
  async forecastCoherence(steps = 10) {
    const history = await this.getCoherenceHistory(24);

    if (history.length < 5) {
      return {
        forecast: [],
        confidence: 'low',
        message: 'Insufficient data for forecasting'
      };
    }

    const values = history.map(h => h.metric_value);
    const windowSize = Math.min(5, Math.floor(values.length / 2));
    const forecast = [];

    // Simple moving average forecast
    let currentValues = values.slice(-windowSize);

    for (let i = 0; i < steps; i++) {
      const prediction = currentValues.reduce((sum, v) => sum + v, 0) / currentValues.length;
      forecast.push({
        step: i + 1,
        value: prediction,
        timestamp: new Date(Date.now() + (i + 1) * 60000).toISOString() // 1 minute steps
      });

      // Update window
      currentValues = [...currentValues.slice(1), prediction];
    }

    // Calculate confidence based on volatility
    const stats = await this.getCoherenceStats();
    const confidence = stats.volatility < 0.05 ? 'high' : stats.volatility < 0.10 ? 'medium' : 'low';

    return {
      forecast,
      confidence,
      volatility: stats.volatility,
      trend: stats.trend
    };
  }

  /**
   * Get coherence status with color coding
   */
  async getCoherenceStatus() {
    const current = await this.getCurrentCoherence();
    const score = current.metric_value;

    let status, color, severity;

    if (score >= this.thresholds.optimal) {
      status = 'optimal';
      color = 'green';
      severity = 'normal';
    } else if (score >= this.thresholds.warning) {
      status = 'warning';
      color = 'yellow';
      severity = 'warning';
    } else if (score >= this.thresholds.critical) {
      status = 'critical';
      color = 'orange';
      severity = 'critical';
    } else {
      status = 'emergency';
      color = 'red';
      severity = 'critical';
    }

    return {
      score,
      status,
      color,
      severity,
      timestamp: current.timestamp,
      thresholds: this.thresholds
    };
  }

  /**
   * Get detailed coherence report
   */
  async getDetailedReport(hours = 24) {
    const [stats, status, forecast] = await Promise.all([
      this.getCoherenceStats(hours),
      this.getCoherenceStatus(),
      this.forecastCoherence(10)
    ]);

    return {
      current: status,
      statistics: stats,
      forecast,
      recommendations: this.generateRecommendations(stats, status),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate recommendations based on coherence data
   */
  generateRecommendations(stats, status) {
    const recommendations = [];

    if (status.score < this.thresholds.optimal) {
      recommendations.push({
        priority: 'high',
        message: 'Coherence below optimal threshold. Review consensus mechanisms.',
        action: 'investigate_consensus'
      });
    }

    if (stats.trend === 'declining') {
      recommendations.push({
        priority: 'high',
        message: 'Declining coherence trend detected. Check agent coordination.',
        action: 'review_coordination'
      });
    }

    if (stats.volatility > 0.10) {
      recommendations.push({
        priority: 'medium',
        message: 'High coherence volatility detected. Stabilize agent responses.',
        action: 'stabilize_agents'
      });
    }

    if (stats.current < stats.average * 0.95) {
      recommendations.push({
        priority: 'medium',
        message: 'Current coherence below recent average. Monitor closely.',
        action: 'increase_monitoring'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'low',
        message: 'Coherence metrics are healthy. Continue monitoring.',
        action: 'maintain'
      });
    }

    return recommendations;
  }

  /**
   * Export coherence data to JSON
   */
  async exportToJSON(hours = 24, filepath = null) {
    const report = await this.getDetailedReport(hours);
    const history = await this.getCoherenceHistory(hours);

    const exportData = {
      report,
      history,
      metadata: {
        exported_at: new Date().toISOString(),
        hours_of_data: hours,
        data_points: history.length
      }
    };

    const json = JSON.stringify(exportData, null, 2);

    if (filepath) {
      const fs = require('fs').promises;
      await fs.writeFile(filepath, json, 'utf8');
      return { success: true, filepath, size: json.length };
    }

    return exportData;
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.db) {
      return new Promise((resolve) => {
        this.db.close(resolve);
      });
    }
  }

  /**
   * Format coherence for terminal display
   */
  formatForTerminal(stats, status) {
    const bar = this.createProgressBar(status.score, 40);

    return `
╔════════════════════════════════════════════════════════════╗
║           COHERENCE SCORING DASHBOARD                      ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Current Score: ${(status.score * 100).toFixed(2)}%  [${status.status.toUpperCase()}]
║  ${bar}
║                                                            ║
║  Statistics (24h):                                         ║
║    Average:    ${(stats.average * 100).toFixed(2)}%
║    Min:        ${(stats.min * 100).toFixed(2)}%
║    Max:        ${(stats.max * 100).toFixed(2)}%
║    Trend:      ${stats.trend.toUpperCase()}
║    Volatility: ${(stats.volatility * 100).toFixed(2)}%
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`;
  }

  /**
   * Create ASCII progress bar
   */
  createProgressBar(value, width = 40) {
    const filled = Math.round(value * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}

// CLI interface
if (require.main === module) {
  const display = new CoherenceDisplay();

  (async () => {
    try {
      await display.init();

      const command = process.argv[2] || 'status';

      switch (command) {
        case 'status': {
          const stats = await display.getCoherenceStats();
          const status = await display.getCoherenceStatus();
          console.log(display.formatForTerminal(stats, status));
          break;
        }

        case 'report': {
          const report = await display.getDetailedReport();
          console.log(JSON.stringify(report, null, 2));
          break;
        }

        case 'forecast': {
          const forecast = await display.forecastCoherence(10);
          console.log(JSON.stringify(forecast, null, 2));
          break;
        }

        case 'export': {
          const filepath = process.argv[3] || 'coherence-export.json';
          const result = await display.exportToJSON(24, filepath);
          console.log(`Exported to ${result.filepath} (${result.size} bytes)`);
          break;
        }

        default:
          console.log('Usage: node coherence-display.js [status|report|forecast|export]');
      }

      await display.close();
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = CoherenceDisplay;
