/**
 * Metrics API for External Dashboard Integration
 *
 * Provides RESTful API for accessing hive mind metrics.
 * Supports JSON export, filtering, aggregation, and real-time subscriptions.
 */

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class MetricsAPI {
  constructor(options = {}) {
    this.port = options.port || 3000;
    this.dbPath = options.dbPath || path.join(process.cwd(), '.hive-mind/hive.db');
    this.app = express();
    this.db = null;
    this.server = null;

    this.setupMiddleware();
    this.setupRoutes();
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    this.app.use(express.json());

    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // Get coherence metrics
    this.app.get('/metrics/coherence', async (req, res) => {
      try {
        const hours = parseInt(req.query.hours) || 24;
        const coherence = await this.getCoherenceMetrics(hours);
        res.json(coherence);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get performance metrics
    this.app.get('/metrics/performance', async (req, res) => {
      try {
        const hours = parseInt(req.query.hours) || 24;
        const performance = await this.getPerformanceMetrics(hours);
        res.json(performance);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get agent metrics
    this.app.get('/metrics/agents', async (req, res) => {
      try {
        const agents = await this.getAgentMetrics();
        res.json(agents);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get specific agent
    this.app.get('/metrics/agents/:id', async (req, res) => {
      try {
        const agent = await this.getAgentById(req.params.id);
        if (!agent) {
          res.status(404).json({ error: 'Agent not found' });
        } else {
          res.json(agent);
        }
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get consensus metrics
    this.app.get('/metrics/consensus', async (req, res) => {
      try {
        const hours = parseInt(req.query.hours) || 24;
        const consensus = await this.getConsensusMetrics(hours);
        res.json(consensus);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get alerts
    this.app.get('/metrics/alerts', async (req, res) => {
      try {
        const hours = parseInt(req.query.hours) || 24;
        const alerts = await this.getAlerts(hours);
        res.json(alerts);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get all metrics (comprehensive)
    this.app.get('/metrics/all', async (req, res) => {
      try {
        const hours = parseInt(req.query.hours) || 24;
        const all = await this.getAllMetrics(hours);
        res.json(all);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Export metrics to JSON
    this.app.get('/export', async (req, res) => {
      try {
        const hours = parseInt(req.query.hours) || 24;
        const format = req.query.format || 'detailed';
        const data = await this.exportMetrics(hours, format);

        res.setHeader('Content-Disposition', `attachment; filename="hive-metrics-${Date.now()}.json"`);
        res.json(data);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Custom metric query
    this.app.post('/query', async (req, res) => {
      try {
        const { metric, filters, aggregation } = req.body;
        const results = await this.customQuery(metric, filters, aggregation);
        res.json(results);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Time series data
    this.app.get('/timeseries/:metric', async (req, res) => {
      try {
        const metric = req.params.metric;
        const hours = parseInt(req.query.hours) || 24;
        const interval = req.query.interval || '1m';
        const timeseries = await this.getTimeSeries(metric, hours, interval);
        res.json(timeseries);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // API documentation
    this.app.get('/', (req, res) => {
      res.json({
        name: 'Hive Mind Metrics API',
        version: '1.0.0',
        endpoints: {
          '/health': 'Health check',
          '/metrics/coherence': 'Coherence metrics',
          '/metrics/performance': 'Performance metrics',
          '/metrics/agents': 'Agent metrics',
          '/metrics/agents/:id': 'Specific agent metrics',
          '/metrics/consensus': 'Consensus metrics',
          '/metrics/alerts': 'Alert history',
          '/metrics/all': 'All metrics',
          '/export': 'Export all data',
          '/query': 'Custom query (POST)',
          '/timeseries/:metric': 'Time series data'
        },
        parameters: {
          hours: 'Time range in hours (default: 24)',
          format: 'Export format: summary|detailed (default: detailed)',
          interval: 'Time series interval: 1m|5m|15m|1h (default: 1m)'
        }
      });
    });
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
   * Start API server
   */
  async start() {
    await this.init();

    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        console.log(`Metrics API running on http://localhost:${this.port}`);
        console.log(`Documentation: http://localhost:${this.port}`);
        resolve();
      });
    });
  }

  /**
   * Stop API server
   */
  async stop() {
    if (this.server) {
      await new Promise((resolve) => {
        this.server.close(resolve);
      });
    }

    if (this.db) {
      await new Promise((resolve) => {
        this.db.close(resolve);
      });
    }
  }

  /**
   * Get coherence metrics
   */
  async getCoherenceMetrics(hours = 24) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          metric_value,
          timestamp
        FROM performance_metrics
        WHERE metric_name = 'coherence_score'
          AND timestamp > datetime('now', '-${hours} hours')
        ORDER BY timestamp DESC
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const values = rows.map(r => r.metric_value);
          resolve({
            current: rows[0]?.metric_value || 0,
            average: values.reduce((a, b) => a + b, 0) / (values.length || 1),
            min: Math.min(...values, 0),
            max: Math.max(...values, 0),
            history: rows,
            dataPoints: rows.length
          });
        }
      });
    });
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(hours = 24) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          metric_name,
          AVG(metric_value) as avg_value,
          MIN(metric_value) as min_value,
          MAX(metric_value) as max_value,
          COUNT(*) as count
        FROM performance_metrics
        WHERE timestamp > datetime('now', '-${hours} hours')
          AND metric_name IN ('response_time', 'task_success', 'task_completed')
        GROUP BY metric_name
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const metrics = {};
          rows.forEach(row => {
            metrics[row.metric_name] = {
              average: row.avg_value,
              min: row.min_value,
              max: row.max_value,
              count: row.count
            };
          });
          resolve(metrics);
        }
      });
    });
  }

  /**
   * Get agent metrics
   */
  async getAgentMetrics() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          id, name, type, role, status,
          performance_score, task_count, success_rate,
          last_active, created_at
        FROM agents
        ORDER BY last_active DESC
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            total: rows.length,
            active: rows.filter(r => r.status === 'active').length,
            agents: rows
          });
        }
      });
    });
  }

  /**
   * Get specific agent by ID
   */
  async getAgentById(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM agents WHERE id = ?';
      this.db.get(query, [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  /**
   * Get consensus metrics
   */
  async getConsensusMetrics(hours = 24) {
    return new Promise((resolve, reject) => {
      const queries = {
        decisions: `
          SELECT COUNT(DISTINCT proposal_id) as count
          FROM consensus_votes
          WHERE timestamp > datetime('now', '-${hours} hours')
        `,
        rate: `
          SELECT AVG(metric_value) as rate
          FROM performance_metrics
          WHERE metric_name = 'consensus_achieved'
            AND timestamp > datetime('now', '-${hours} hours')
        `
      };

      Promise.all([
        new Promise((res, rej) => {
          this.db.get(queries.decisions, (err, row) => {
            if (err) rej(err);
            else res(row?.count || 0);
          });
        }),
        new Promise((res, rej) => {
          this.db.get(queries.rate, (err, row) => {
            if (err) rej(err);
            else res(row?.rate || 0);
          });
        })
      ]).then(([decisions, rate]) => {
        resolve({
          total_decisions: decisions,
          success_rate: rate,
          failures: Math.round(decisions * (1 - rate))
        });
      }).catch(reject);
    });
  }

  /**
   * Get alerts
   */
  async getAlerts(hours = 24) {
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
          resolve({
            total: alerts.length,
            critical: alerts.filter(a => a.severity === 'critical').length,
            warning: alerts.filter(a => a.severity === 'warning').length,
            alerts
          });
        }
      });
    });
  }

  /**
   * Get all metrics
   */
  async getAllMetrics(hours = 24) {
    const [coherence, performance, agents, consensus, alerts] = await Promise.all([
      this.getCoherenceMetrics(hours),
      this.getPerformanceMetrics(hours),
      this.getAgentMetrics(),
      this.getConsensusMetrics(hours),
      this.getAlerts(hours)
    ]);

    return {
      coherence,
      performance,
      agents,
      consensus,
      alerts,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Export metrics
   */
  async exportMetrics(hours = 24, format = 'detailed') {
    const all = await this.getAllMetrics(hours);

    if (format === 'summary') {
      return {
        summary: {
          coherence_current: all.coherence.current,
          coherence_average: all.coherence.average,
          active_agents: all.agents.active,
          total_agents: all.agents.total,
          consensus_rate: all.consensus.success_rate,
          active_alerts: all.alerts.total
        },
        exported_at: all.timestamp,
        time_range_hours: hours
      };
    }

    return {
      ...all,
      metadata: {
        format,
        time_range_hours: hours,
        exported_at: all.timestamp
      }
    };
  }

  /**
   * Custom query
   */
  async customQuery(metric, filters = {}, aggregation = 'avg') {
    return new Promise((resolve, reject) => {
      let query = `SELECT ${aggregation}(metric_value) as value FROM performance_metrics WHERE metric_name = ?`;
      const params = [metric];

      if (filters.hours) {
        query += ` AND timestamp > datetime('now', '-${parseInt(filters.hours)} hours')`;
      }

      if (filters.entity_type) {
        query += ` AND entity_type = ?`;
        params.push(filters.entity_type);
      }

      this.db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve({ metric, aggregation, value: row?.value || 0, filters });
      });
    });
  }

  /**
   * Get time series data
   */
  async getTimeSeries(metric, hours = 24, interval = '1m') {
    const intervalMap = {
      '1m': 60,
      '5m': 300,
      '15m': 900,
      '1h': 3600
    };

    const seconds = intervalMap[interval] || 60;

    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          datetime((strftime('%s', timestamp) / ${seconds}) * ${seconds}, 'unixepoch') as bucket,
          AVG(metric_value) as value
        FROM performance_metrics
        WHERE metric_name = ?
          AND timestamp > datetime('now', '-${hours} hours')
        GROUP BY bucket
        ORDER BY bucket ASC
      `;

      this.db.all(query, [metric], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            metric,
            interval,
            hours,
            data: rows
          });
        }
      });
    });
  }
}

// CLI interface
if (require.main === module) {
  const port = process.argv[2] ? parseInt(process.argv[2]) : 3000;
  const api = new MetricsAPI({ port });

  api.start().catch((error) => {
    console.error('Failed to start API:', error);
    process.exit(1);
  });

  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await api.stop();
    process.exit(0);
  });
}

module.exports = MetricsAPI;
