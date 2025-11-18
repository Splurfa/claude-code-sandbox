/**
 * Alert System for Hive Mind Monitoring
 *
 * Monitors metrics and triggers alerts based on thresholds.
 * Supports multiple alert channels and escalation policies.
 */

const EventEmitter = require('events');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class AlertSystem extends EventEmitter {
  constructor(options = {}) {
    super();

    this.dbPath = options.dbPath || path.join(process.cwd(), '.hive-mind/hive.db');
    this.db = null;
    this.checkInterval = options.checkInterval || 5000; // 5 seconds
    this.alertHistory = new Map();
    this.isRunning = false;
    this.timer = null;

    // Alert rules
    this.rules = [
      {
        id: 'coherence-critical',
        name: 'Critical Coherence Drop',
        condition: async () => {
          const coherence = await this.getLatestCoherence();
          return coherence < 0.85;
        },
        severity: 'critical',
        message: (data) => `Critical coherence drop detected: ${(data.value * 100).toFixed(2)}%`,
        cooldown: 60000 // 1 minute
      },
      {
        id: 'coherence-warning',
        name: 'Coherence Below Threshold',
        condition: async () => {
          const coherence = await this.getLatestCoherence();
          return coherence >= 0.85 && coherence < 0.95;
        },
        severity: 'warning',
        message: (data) => `Coherence below optimal threshold: ${(data.value * 100).toFixed(2)}%`,
        cooldown: 120000 // 2 minutes
      },
      {
        id: 'consensus-failure',
        name: 'Consensus Failure Rate High',
        condition: async () => {
          const rate = await this.getConsensusRate();
          return rate < 0.70;
        },
        severity: 'critical',
        message: (data) => `High consensus failure rate: ${(data.value * 100).toFixed(2)}%`,
        cooldown: 60000
      },
      {
        id: 'agent-inactive',
        name: 'Agents Becoming Inactive',
        condition: async () => {
          const { active, total } = await this.getAgentStatus();
          return total > 0 && (active / total) < 0.70;
        },
        severity: 'warning',
        message: (data) => `${data.inactive} of ${data.total} agents inactive`,
        cooldown: 180000 // 3 minutes
      },
      {
        id: 'performance-degradation',
        name: 'Performance Degradation',
        condition: async () => {
          const avgResponseTime = await this.getAverageResponseTime();
          return avgResponseTime > 5000; // 5 seconds
        },
        severity: 'warning',
        message: (data) => `High average response time: ${data.value.toFixed(0)}ms`,
        cooldown: 120000
      },
      {
        id: 'task-failure-spike',
        name: 'Task Failure Spike',
        condition: async () => {
          const successRate = await this.getTaskSuccessRate();
          return successRate < 0.80;
        },
        severity: 'warning',
        message: (data) => `Low task success rate: ${(data.value * 100).toFixed(2)}%`,
        cooldown: 120000
      }
    ];
  }

  /**
   * Initialize alert system
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
   * Start monitoring
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('Alert system started');

    this.timer = setInterval(() => {
      this.checkAlerts();
    }, this.checkInterval);

    // Initial check
    this.checkAlerts();
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    console.log('Alert system stopped');
  }

  /**
   * Check all alert rules
   */
  async checkAlerts() {
    for (const rule of this.rules) {
      try {
        // Check cooldown
        const lastAlert = this.alertHistory.get(rule.id);
        if (lastAlert && Date.now() - lastAlert.timestamp < rule.cooldown) {
          continue;
        }

        // Check condition
        const triggered = await rule.condition();

        if (triggered) {
          await this.triggerAlert(rule);
        }
      } catch (error) {
        console.error(`Error checking rule ${rule.id}:`, error.message);
      }
    }
  }

  /**
   * Trigger an alert
   */
  async triggerAlert(rule) {
    // Gather context data
    const data = await this.gatherAlertData(rule);

    const alert = {
      id: `${rule.id}-${Date.now()}`,
      ruleId: rule.id,
      name: rule.name,
      severity: rule.severity,
      message: rule.message(data),
      data,
      timestamp: new Date().toISOString()
    };

    // Record in history
    this.alertHistory.set(rule.id, {
      timestamp: Date.now(),
      alert
    });

    // Emit alert event
    this.emit('alert', alert);

    // Log to console
    this.logAlert(alert);

    // Store in database
    await this.storeAlert(alert);

    return alert;
  }

  /**
   * Gather data for alert context
   */
  async gatherAlertData(rule) {
    const data = {};

    switch (rule.id) {
      case 'coherence-critical':
      case 'coherence-warning':
        data.value = await this.getLatestCoherence();
        data.average = await this.getAverageCoherence();
        break;

      case 'consensus-failure':
        data.value = await this.getConsensusRate();
        data.failures = await this.getRecentConsensusFailures();
        break;

      case 'agent-inactive': {
        const status = await this.getAgentStatus();
        data.active = status.active;
        data.inactive = status.total - status.active;
        data.total = status.total;
        break;
      }

      case 'performance-degradation':
        data.value = await this.getAverageResponseTime();
        break;

      case 'task-failure-spike':
        data.value = await this.getTaskSuccessRate();
        data.failures = await this.getRecentTaskFailures();
        break;
    }

    return data;
  }

  /**
   * Log alert to console with formatting
   */
  logAlert(alert) {
    const colors = {
      critical: '\x1b[31m', // Red
      warning: '\x1b[33m',  // Yellow
      info: '\x1b[36m'      // Cyan
    };
    const reset = '\x1b[0m';

    const color = colors[alert.severity] || colors.info;
    const prefix = alert.severity === 'critical' ? '🚨' : '⚠️';

    console.log(`${prefix} ${color}[${alert.severity.toUpperCase()}]${reset} ${alert.message}`);
    console.log(`   Time: ${new Date(alert.timestamp).toLocaleString()}`);
    console.log(`   Rule: ${alert.name} (${alert.ruleId})`);
  }

  /**
   * Store alert in database
   */
  async storeAlert(alert) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO performance_metrics (entity_type, entity_id, metric_name, metric_value, metadata)
        VALUES (?, ?, ?, ?, ?)
      `;

      this.db.run(query, [
        'alert',
        alert.id,
        alert.ruleId,
        alert.severity === 'critical' ? 1 : 0.5,
        JSON.stringify(alert)
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Get latest coherence score
   */
  async getLatestCoherence() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT metric_value
        FROM performance_metrics
        WHERE metric_name = 'coherence_score'
        ORDER BY timestamp DESC
        LIMIT 1
      `;

      this.db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row?.metric_value || 1.0);
      });
    });
  }

  /**
   * Get average coherence over last hour
   */
  async getAverageCoherence() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT AVG(metric_value) as avg
        FROM performance_metrics
        WHERE metric_name = 'coherence_score'
          AND timestamp > datetime('now', '-1 hour')
      `;

      this.db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row?.avg || 1.0);
      });
    });
  }

  /**
   * Get consensus success rate
   */
  async getConsensusRate() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT AVG(metric_value) as rate
        FROM performance_metrics
        WHERE metric_name = 'consensus_achieved'
          AND timestamp > datetime('now', '-1 hour')
      `;

      this.db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row?.rate || 1.0);
      });
    });
  }

  /**
   * Get recent consensus failures
   */
  async getRecentConsensusFailures() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(*) as count
        FROM performance_metrics
        WHERE metric_name = 'consensus_achieved'
          AND metric_value = 0
          AND timestamp > datetime('now', '-1 hour')
      `;

      this.db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });
  }

  /**
   * Get agent status
   */
  async getAgentStatus() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
        FROM agents
      `;

      this.db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row || { total: 0, active: 0 });
      });
    });
  }

  /**
   * Get average response time
   */
  async getAverageResponseTime() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT AVG(metric_value) as avg
        FROM performance_metrics
        WHERE metric_name = 'response_time'
          AND timestamp > datetime('now', '-15 minutes')
      `;

      this.db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row?.avg || 0);
      });
    });
  }

  /**
   * Get task success rate
   */
  async getTaskSuccessRate() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT AVG(metric_value) as rate
        FROM performance_metrics
        WHERE metric_name = 'task_success'
          AND timestamp > datetime('now', '-1 hour')
      `;

      this.db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row?.rate || 1.0);
      });
    });
  }

  /**
   * Get recent task failures
   */
  async getRecentTaskFailures() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT COUNT(*) as count
        FROM performance_metrics
        WHERE metric_name = 'task_success'
          AND metric_value = 0
          AND timestamp > datetime('now', '-1 hour')
      `;

      this.db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });
  }

  /**
   * Get alert history
   */
  async getAlertHistory(hours = 24) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT metadata
        FROM performance_metrics
        WHERE entity_type = 'alert'
          AND timestamp > datetime('now', '-${hours} hours')
        ORDER BY timestamp DESC
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const alerts = rows.map(row => JSON.parse(row.metadata));
          resolve(alerts);
        }
      });
    });
  }

  /**
   * Close database connection
   */
  async close() {
    this.stop();

    if (this.db) {
      return new Promise((resolve) => {
        this.db.close(resolve);
      });
    }
  }
}

// CLI interface
if (require.main === module) {
  const alertSystem = new AlertSystem();

  (async () => {
    try {
      await alertSystem.init();

      // Listen for alerts
      alertSystem.on('alert', (alert) => {
        // Alerts are already logged by logAlert()
      });

      alertSystem.start();

      console.log('Alert system monitoring started. Press Ctrl+C to stop.\n');

      // Graceful shutdown
      process.on('SIGINT', async () => {
        console.log('\nShutting down alert system...');
        await alertSystem.close();
        process.exit(0);
      });

    } catch (error) {
      console.error('Failed to start alert system:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = AlertSystem;
