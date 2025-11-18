#!/usr/bin/env node

/**
 * Real-time Monitoring Dashboard Server
 *
 * Provides WebSocket-based real-time monitoring for hive mind system.
 * Streams coherence scores, performance metrics, agent health, and alerts.
 */

const http = require('http');
const WebSocket = require('ws');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DashboardServer {
  constructor(options = {}) {
    this.port = options.port || 8080;
    this.dbPath = options.dbPath || path.join(process.cwd(), '.hive-mind/hive.db');
    this.updateInterval = options.updateInterval || 1000; // 1 second
    this.clients = new Set();
    this.db = null;
    this.server = null;
    this.wss = null;
    this.updateTimer = null;
  }

  /**
   * Initialize database connection
   */
  async initDatabase() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(new Error(`Failed to connect to database: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Start the dashboard server
   */
  async start() {
    await this.initDatabase();

    // Create HTTP server
    this.server = http.createServer((req, res) => {
      if (req.url === '/') {
        this.serveDashboard(res);
      } else if (req.url === '/metrics') {
        this.serveMetricsAPI(req, res);
      } else if (req.url === '/health') {
        this.serveHealthCheck(res);
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    // Create WebSocket server
    this.wss = new WebSocket.Server({ server: this.server });

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log(`Client connected. Total clients: ${this.clients.size}`);

      // Send initial data
      this.sendUpdate(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
        console.log(`Client disconnected. Total clients: ${this.clients.size}`);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    // Start update timer
    this.updateTimer = setInterval(() => {
      this.broadcastUpdates();
    }, this.updateInterval);

    // Start server
    this.server.listen(this.port, () => {
      console.log(`Dashboard server running on http://localhost:${this.port}`);
      console.log(`WebSocket endpoint: ws://localhost:${this.port}`);
    });
  }

  /**
   * Stop the dashboard server
   */
  async stop() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }

    if (this.wss) {
      this.wss.close();
    }

    if (this.server) {
      this.server.close();
    }

    if (this.db) {
      await new Promise((resolve) => {
        this.db.close(resolve);
      });
    }
  }

  /**
   * Serve dashboard HTML
   */
  serveDashboard(res) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Hive Mind Monitoring Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    h1 { color: white; margin-bottom: 10px; }
    .status { color: #a5f3fc; font-size: 14px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }
    .card {
      background: #1e293b;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .card h2 {
      font-size: 16px;
      color: #94a3b8;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .metric {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #334155;
    }
    .metric:last-child { border-bottom: none; }
    .metric-label { color: #cbd5e1; font-size: 14px; }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #10b981;
    }
    .metric-value.warning { color: #f59e0b; }
    .metric-value.critical { color: #ef4444; }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: #334155;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 8px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      transition: width 0.3s ease;
    }
    .progress-fill.warning {
      background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
    }
    .progress-fill.critical {
      background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
    }
    .agent-list {
      max-height: 300px;
      overflow-y: auto;
    }
    .agent-item {
      padding: 10px;
      margin-bottom: 8px;
      background: #0f172a;
      border-radius: 6px;
      border-left: 3px solid #10b981;
    }
    .agent-item.inactive { border-left-color: #6b7280; opacity: 0.6; }
    .agent-name { font-weight: bold; color: #e2e8f0; }
    .agent-stats {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 4px;
    }
    .alert {
      padding: 12px 16px;
      margin-bottom: 10px;
      border-radius: 6px;
      border-left: 4px solid;
      animation: slideIn 0.3s ease;
    }
    @keyframes slideIn {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .alert.warning {
      background: rgba(245, 158, 11, 0.1);
      border-left-color: #f59e0b;
      color: #fbbf24;
    }
    .alert.critical {
      background: rgba(239, 68, 68, 0.1);
      border-left-color: #ef4444;
      color: #fca5a5;
    }
    .chart-container {
      height: 200px;
      margin-top: 15px;
    }
    .chart-canvas {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🐝 Hive Mind Monitoring Dashboard</h1>
    <div class="status">Connected • Real-time monitoring active</div>
  </div>

  <div class="grid">
    <div class="card">
      <h2>Coherence Scoring</h2>
      <div class="metric">
        <span class="metric-label">Current Coherence</span>
        <span class="metric-value" id="coherence-value">--</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="coherence-bar" style="width: 0%"></div>
      </div>
      <div class="metric">
        <span class="metric-label">Avg (24h)</span>
        <span class="metric-value" id="coherence-avg">--</span>
      </div>
    </div>

    <div class="card">
      <h2>Performance Metrics</h2>
      <div class="metric">
        <span class="metric-label">Tasks Completed</span>
        <span class="metric-value" id="tasks-completed">--</span>
      </div>
      <div class="metric">
        <span class="metric-label">Success Rate</span>
        <span class="metric-value" id="success-rate">--</span>
      </div>
      <div class="metric">
        <span class="metric-label">Avg Response Time</span>
        <span class="metric-value" id="response-time">--</span>
      </div>
    </div>

    <div class="card">
      <h2>Agent Health</h2>
      <div class="metric">
        <span class="metric-label">Active Agents</span>
        <span class="metric-value" id="active-agents">--</span>
      </div>
      <div class="metric">
        <span class="metric-label">Total Agents</span>
        <span class="metric-value" id="total-agents">--</span>
      </div>
      <div class="agent-list" id="agent-list"></div>
    </div>

    <div class="card">
      <h2>Consensus Status</h2>
      <div class="metric">
        <span class="metric-label">Active Proposals</span>
        <span class="metric-value" id="active-proposals">--</span>
      </div>
      <div class="metric">
        <span class="metric-label">Consensus Rate</span>
        <span class="metric-value" id="consensus-rate">--</span>
      </div>
      <div class="metric">
        <span class="metric-label">Avg Convergence Time</span>
        <span class="metric-value" id="convergence-time">--</span>
      </div>
    </div>
  </div>

  <div class="card">
    <h2>Active Alerts</h2>
    <div id="alerts-container"></div>
  </div>

  <script>
    const ws = new WebSocket('ws://' + location.host);
    const alerts = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateDashboard(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      document.querySelector('.status').textContent = 'Disconnected • Attempting to reconnect...';
      setTimeout(() => location.reload(), 5000);
    };

    function updateDashboard(data) {
      // Coherence scoring
      if (data.coherence) {
        const coherence = (data.coherence.current * 100).toFixed(1);
        const coherenceEl = document.getElementById('coherence-value');
        const coherenceBar = document.getElementById('coherence-bar');

        coherenceEl.textContent = coherence + '%';
        coherenceBar.style.width = coherence + '%';

        // Color coding
        if (data.coherence.current >= 0.95) {
          coherenceEl.className = 'metric-value';
          coherenceBar.className = 'progress-fill';
        } else if (data.coherence.current >= 0.90) {
          coherenceEl.className = 'metric-value warning';
          coherenceBar.className = 'progress-fill warning';
        } else {
          coherenceEl.className = 'metric-value critical';
          coherenceBar.className = 'progress-fill critical';
        }

        document.getElementById('coherence-avg').textContent =
          (data.coherence.average * 100).toFixed(1) + '%';
      }

      // Performance metrics
      if (data.performance) {
        document.getElementById('tasks-completed').textContent =
          data.performance.tasks_completed || 0;
        document.getElementById('success-rate').textContent =
          ((data.performance.success_rate || 0) * 100).toFixed(1) + '%';
        document.getElementById('response-time').textContent =
          (data.performance.avg_response_time || 0).toFixed(0) + 'ms';
      }

      // Agent health
      if (data.agents) {
        document.getElementById('active-agents').textContent = data.agents.active || 0;
        document.getElementById('total-agents').textContent = data.agents.total || 0;

        const agentList = document.getElementById('agent-list');
        agentList.innerHTML = data.agents.list.map(agent => \`
          <div class="agent-item \${agent.status !== 'active' ? 'inactive' : ''}">
            <div class="agent-name">\${agent.name}</div>
            <div class="agent-stats">
              Performance: \${(agent.performance_score * 100).toFixed(0)}% •
              Tasks: \${agent.task_count} •
              Success: \${(agent.success_rate * 100).toFixed(0)}%
            </div>
          </div>
        \`).join('');
      }

      // Consensus status
      if (data.consensus) {
        document.getElementById('active-proposals').textContent =
          data.consensus.active_proposals || 0;
        document.getElementById('consensus-rate').textContent =
          ((data.consensus.consensus_rate || 0) * 100).toFixed(1) + '%';
        document.getElementById('convergence-time').textContent =
          (data.consensus.avg_convergence_time || 0).toFixed(0) + 'ms';
      }

      // Alerts
      if (data.alerts) {
        const alertsContainer = document.getElementById('alerts-container');

        // Add new alerts
        data.alerts.forEach(alert => {
          if (!alerts.has(alert.id)) {
            alerts.set(alert.id, alert);
            const alertEl = document.createElement('div');
            alertEl.className = \`alert \${alert.severity}\`;
            alertEl.id = 'alert-' + alert.id;
            alertEl.innerHTML = \`
              <strong>\${alert.severity.toUpperCase()}</strong>: \${alert.message}
              <small style="display: block; margin-top: 4px; opacity: 0.7;">
                \${new Date(alert.timestamp).toLocaleTimeString()}
              </small>
            \`;
            alertsContainer.insertBefore(alertEl, alertsContainer.firstChild);
          }
        });

        // Remove old alerts after 30 seconds
        alerts.forEach((alert, id) => {
          if (Date.now() - new Date(alert.timestamp).getTime() > 30000) {
            const el = document.getElementById('alert-' + id);
            if (el) el.remove();
            alerts.delete(id);
          }
        });
      }
    }

    // Show no alerts message if empty
    setInterval(() => {
      const alertsContainer = document.getElementById('alerts-container');
      if (!alertsContainer.hasChildNodes()) {
        alertsContainer.innerHTML = '<p style="color: #64748b; text-align: center; padding: 20px;">No active alerts</p>';
      }
    }, 1000);
  </script>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  }

  /**
   * Serve metrics API endpoint
   */
  async serveMetricsAPI(req, res) {
    try {
      const metrics = await this.collectMetrics();
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(metrics, null, 2));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  }

  /**
   * Serve health check endpoint
   */
  serveHealthCheck(res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      clients: this.clients.size,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    }));
  }

  /**
   * Collect all metrics from database
   */
  async collectMetrics() {
    const metrics = {
      coherence: await this.getCoherenceMetrics(),
      performance: await this.getPerformanceMetrics(),
      agents: await this.getAgentMetrics(),
      consensus: await this.getConsensusMetrics(),
      alerts: await this.getAlerts(),
      timestamp: new Date().toISOString()
    };

    return metrics;
  }

  /**
   * Get coherence scoring metrics
   */
  async getCoherenceMetrics() {
    return new Promise((resolve, reject) => {
      const queries = {
        current: `
          SELECT metric_value
          FROM performance_metrics
          WHERE metric_name = 'coherence_score'
          ORDER BY timestamp DESC
          LIMIT 1
        `,
        average: `
          SELECT AVG(metric_value) as avg_coherence
          FROM performance_metrics
          WHERE metric_name = 'coherence_score'
            AND timestamp > datetime('now', '-24 hours')
        `
      };

      Promise.all([
        new Promise((res, rej) => {
          this.db.get(queries.current, (err, row) => {
            if (err) rej(err);
            else res(row?.metric_value || 0);
          });
        }),
        new Promise((res, rej) => {
          this.db.get(queries.average, (err, row) => {
            if (err) rej(err);
            else res(row?.avg_coherence || 0);
          });
        })
      ]).then(([current, average]) => {
        resolve({ current, average });
      }).catch(reject);
    });
  }

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          SUM(CASE WHEN metric_name = 'task_completed' THEN metric_value ELSE 0 END) as tasks_completed,
          AVG(CASE WHEN metric_name = 'success_rate' THEN metric_value ELSE NULL END) as success_rate,
          AVG(CASE WHEN metric_name = 'response_time' THEN metric_value ELSE NULL END) as avg_response_time
        FROM performance_metrics
        WHERE timestamp > datetime('now', '-1 hour')
      `;

      this.db.get(query, (err, row) => {
        if (err) reject(err);
        else resolve(row || { tasks_completed: 0, success_rate: 0, avg_response_time: 0 });
      });
    });
  }

  /**
   * Get agent health metrics
   */
  async getAgentMetrics() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT
          id, name, type, status, performance_score, task_count, success_rate
        FROM agents
        ORDER BY last_active DESC
      `;

      this.db.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const agents = rows || [];
          resolve({
            total: agents.length,
            active: agents.filter(a => a.status === 'active').length,
            list: agents
          });
        }
      });
    });
  }

  /**
   * Get consensus metrics
   */
  async getConsensusMetrics() {
    return new Promise((resolve, reject) => {
      const queries = {
        activeProposals: `
          SELECT COUNT(DISTINCT proposal_id) as count
          FROM consensus_votes
          WHERE timestamp > datetime('now', '-1 hour')
        `,
        consensusRate: `
          SELECT AVG(metric_value) as rate
          FROM performance_metrics
          WHERE metric_name = 'consensus_achieved'
            AND timestamp > datetime('now', '-24 hours')
        `,
        convergenceTime: `
          SELECT AVG(metric_value) as avg_time
          FROM performance_metrics
          WHERE metric_name = 'convergence_time'
            AND timestamp > datetime('now', '-1 hour')
        `
      };

      Promise.all([
        new Promise((res, rej) => {
          this.db.get(queries.activeProposals, (err, row) => {
            if (err) rej(err);
            else res(row?.count || 0);
          });
        }),
        new Promise((res, rej) => {
          this.db.get(queries.consensusRate, (err, row) => {
            if (err) rej(err);
            else res(row?.rate || 0);
          });
        }),
        new Promise((res, rej) => {
          this.db.get(queries.convergenceTime, (err, row) => {
            if (err) rej(err);
            else res(row?.avg_time || 0);
          });
        })
      ]).then(([active_proposals, consensus_rate, avg_convergence_time]) => {
        resolve({ active_proposals, consensus_rate, avg_convergence_time });
      }).catch(reject);
    });
  }

  /**
   * Get active alerts
   */
  async getAlerts() {
    const alerts = [];
    const coherence = await this.getCoherenceMetrics();

    // Check coherence threshold
    if (coherence.current < 0.95) {
      alerts.push({
        id: 'coherence-low-' + Date.now(),
        severity: coherence.current < 0.90 ? 'critical' : 'warning',
        message: `Coherence score below threshold: ${(coherence.current * 100).toFixed(1)}%`,
        timestamp: new Date().toISOString()
      });
    }

    // Check for consensus failures
    const consensus = await this.getConsensusMetrics();
    if (consensus.consensus_rate < 0.80) {
      alerts.push({
        id: 'consensus-low-' + Date.now(),
        severity: 'warning',
        message: `Consensus rate low: ${(consensus.consensus_rate * 100).toFixed(1)}%`,
        timestamp: new Date().toISOString()
      });
    }

    return alerts;
  }

  /**
   * Send update to specific client
   */
  async sendUpdate(ws) {
    try {
      const metrics = await this.collectMetrics();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(metrics));
      }
    } catch (error) {
      console.error('Error sending update:', error);
    }
  }

  /**
   * Broadcast updates to all clients
   */
  async broadcastUpdates() {
    const metrics = await this.collectMetrics();
    const message = JSON.stringify(metrics);

    this.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const port = args[0] ? parseInt(args[0]) : 8080;

  const server = new DashboardServer({ port });

  server.start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await server.stop();
    process.exit(0);
  });
}

module.exports = DashboardServer;
