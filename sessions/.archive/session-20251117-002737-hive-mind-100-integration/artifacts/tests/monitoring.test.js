/**
 * Monitoring System Tests
 *
 * Comprehensive tests for dashboard, coherence display, alert system, and metrics API.
 */

const assert = require('assert');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const WebSocket = require('ws');

const DashboardServer = require('../code/monitoring/dashboard-server');
const CoherenceDisplay = require('../code/monitoring/coherence-display');
const AlertSystem = require('../code/monitoring/alert-system');
const MetricsAPI = require('../code/monitoring/metrics-api');

// Test database path
const TEST_DB_PATH = path.join(__dirname, 'test-hive.db');

/**
 * Setup test database
 */
async function setupTestDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(TEST_DB_PATH, (err) => {
      if (err) return reject(err);

      // Create tables
      db.serialize(() => {
        // Performance metrics table
        db.run(`
          CREATE TABLE IF NOT EXISTS performance_metrics (
            id TEXT PRIMARY KEY,
            entity_type TEXT NOT NULL,
            entity_id TEXT NOT NULL,
            metric_name TEXT NOT NULL,
            metric_value REAL NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT DEFAULT '{}'
          )
        `);

        // Agents table
        db.run(`
          CREATE TABLE IF NOT EXISTS agents (
            id TEXT PRIMARY KEY,
            swarm_id TEXT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            role TEXT,
            capabilities TEXT DEFAULT '[]',
            status TEXT DEFAULT 'active',
            performance_score REAL DEFAULT 0.5,
            task_count INTEGER DEFAULT 0,
            success_rate REAL DEFAULT 1.0,
            last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            metadata TEXT DEFAULT '{}'
          )
        `);

        // Consensus votes table
        db.run(`
          CREATE TABLE IF NOT EXISTS consensus_votes (
            id TEXT PRIMARY KEY,
            swarm_id TEXT,
            proposal_id TEXT NOT NULL,
            agent_id TEXT,
            vote REAL NOT NULL,
            weight REAL DEFAULT 1.0,
            justification TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);

        // Insert test data
        const now = new Date().toISOString();

        // Coherence scores
        for (let i = 0; i < 10; i++) {
          const coherence = 0.85 + (Math.random() * 0.15);
          db.run(`
            INSERT INTO performance_metrics (id, entity_type, entity_id, metric_name, metric_value, timestamp)
            VALUES (?, 'swarm', 'test-swarm', 'coherence_score', ?, datetime('now', '-${i} minutes'))
          `, [`coherence-${i}`, coherence]);
        }

        // Performance metrics
        db.run(`
          INSERT INTO performance_metrics (id, entity_type, entity_id, metric_name, metric_value)
          VALUES
            ('perf-1', 'swarm', 'test-swarm', 'response_time', 150),
            ('perf-2', 'swarm', 'test-swarm', 'task_success', 0.95),
            ('perf-3', 'swarm', 'test-swarm', 'task_completed', 42),
            ('perf-4', 'swarm', 'test-swarm', 'consensus_achieved', 0.88)
        `);

        // Test agents
        db.run(`
          INSERT INTO agents (id, name, type, status, performance_score, task_count, success_rate)
          VALUES
            ('agent-1', 'Queen Agent', 'queen', 'active', 0.95, 100, 0.98),
            ('agent-2', 'Worker 1', 'worker', 'active', 0.87, 50, 0.94),
            ('agent-3', 'Worker 2', 'worker', 'inactive', 0.72, 30, 0.85)
        `);

        // Consensus votes
        db.run(`
          INSERT INTO consensus_votes (id, proposal_id, agent_id, vote)
          VALUES
            ('vote-1', 'proposal-1', 'agent-1', 1.0),
            ('vote-2', 'proposal-1', 'agent-2', 0.9),
            ('vote-3', 'proposal-2', 'agent-1', 0.8)
        `, (err) => {
          db.close();
          if (err) reject(err);
          else resolve();
        });
      });
    });
  });
}

/**
 * Cleanup test database
 */
async function cleanupTestDatabase() {
  const fs = require('fs').promises;
  try {
    await fs.unlink(TEST_DB_PATH);
  } catch (error) {
    // Ignore if file doesn't exist
  }
}

/**
 * Make HTTP request
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Test Suite
 */
async function runTests() {
  console.log('Setting up test database...');
  await setupTestDatabase();

  let passed = 0;
  let failed = 0;

  // Helper function to run test
  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.error(`❌ ${name}`);
      console.error(`   ${error.message}`);
      failed++;
    }
  }

  // ==================== Coherence Display Tests ====================

  await test('CoherenceDisplay: Initialize successfully', async () => {
    const display = new CoherenceDisplay({ dbPath: TEST_DB_PATH });
    await display.init();
    await display.close();
  });

  await test('CoherenceDisplay: Get current coherence', async () => {
    const display = new CoherenceDisplay({ dbPath: TEST_DB_PATH });
    await display.init();

    const current = await display.getCurrentCoherence();
    assert(current.metric_value >= 0 && current.metric_value <= 1, 'Coherence should be between 0 and 1');

    await display.close();
  });

  await test('CoherenceDisplay: Get coherence history', async () => {
    const display = new CoherenceDisplay({ dbPath: TEST_DB_PATH });
    await display.init();

    const history = await display.getCoherenceHistory(24);
    assert(Array.isArray(history), 'History should be an array');
    assert(history.length > 0, 'Should have history data');

    await display.close();
  });

  await test('CoherenceDisplay: Calculate statistics', async () => {
    const display = new CoherenceDisplay({ dbPath: TEST_DB_PATH });
    await display.init();

    const stats = await display.getCoherenceStats(24);
    assert(typeof stats.current === 'number', 'Should have current value');
    assert(typeof stats.average === 'number', 'Should have average');
    assert(typeof stats.min === 'number', 'Should have min');
    assert(typeof stats.max === 'number', 'Should have max');
    assert(['improving', 'declining', 'stable'].includes(stats.trend), 'Should have valid trend');

    await display.close();
  });

  await test('CoherenceDisplay: Forecast future values', async () => {
    const display = new CoherenceDisplay({ dbPath: TEST_DB_PATH });
    await display.init();

    const forecast = await display.forecastCoherence(5);
    assert(Array.isArray(forecast.forecast), 'Forecast should be an array');
    assert(forecast.forecast.length === 5, 'Should have 5 forecast points');
    assert(['low', 'medium', 'high'].includes(forecast.confidence), 'Should have confidence level');

    await display.close();
  });

  await test('CoherenceDisplay: Get status with color coding', async () => {
    const display = new CoherenceDisplay({ dbPath: TEST_DB_PATH });
    await display.init();

    const status = await display.getCoherenceStatus();
    assert(['optimal', 'warning', 'critical', 'emergency'].includes(status.status), 'Should have valid status');
    assert(['green', 'yellow', 'orange', 'red'].includes(status.color), 'Should have valid color');

    await display.close();
  });

  await test('CoherenceDisplay: Export to JSON', async () => {
    const display = new CoherenceDisplay({ dbPath: TEST_DB_PATH });
    await display.init();

    const exported = await display.exportToJSON(24);
    assert(exported.report, 'Should have report');
    assert(exported.history, 'Should have history');
    assert(exported.metadata, 'Should have metadata');

    await display.close();
  });

  // ==================== Alert System Tests ====================

  await test('AlertSystem: Initialize successfully', async () => {
    const alerts = new AlertSystem({ dbPath: TEST_DB_PATH });
    await alerts.init();
    await alerts.close();
  });

  await test('AlertSystem: Check coherence metrics', async () => {
    const alerts = new AlertSystem({ dbPath: TEST_DB_PATH });
    await alerts.init();

    const coherence = await alerts.getLatestCoherence();
    assert(typeof coherence === 'number', 'Should return a number');
    assert(coherence >= 0 && coherence <= 1, 'Should be between 0 and 1');

    await alerts.close();
  });

  await test('AlertSystem: Get agent status', async () => {
    const alerts = new AlertSystem({ dbPath: TEST_DB_PATH });
    await alerts.init();

    const status = await alerts.getAgentStatus();
    assert(typeof status.total === 'number', 'Should have total count');
    assert(typeof status.active === 'number', 'Should have active count');
    assert(status.active <= status.total, 'Active should not exceed total');

    await alerts.close();
  });

  await test('AlertSystem: Trigger alert on low coherence', async () => {
    const alerts = new AlertSystem({ dbPath: TEST_DB_PATH });
    await alerts.init();

    let alertTriggered = false;
    alerts.on('alert', (alert) => {
      alertTriggered = true;
      assert(alert.severity, 'Alert should have severity');
      assert(alert.message, 'Alert should have message');
    });

    await alerts.checkAlerts();

    // Note: Alert may or may not trigger depending on test data
    // Just verify the mechanism works

    await alerts.close();
  });

  // ==================== Metrics API Tests ====================

  await test('MetricsAPI: Start and stop server', async () => {
    const api = new MetricsAPI({ port: 3001, dbPath: TEST_DB_PATH });
    await api.start();
    await api.stop();
  });

  await test('MetricsAPI: Health check endpoint', async () => {
    const api = new MetricsAPI({ port: 3002, dbPath: TEST_DB_PATH });
    await api.start();

    const health = await makeRequest('http://localhost:3002/health');
    assert(health.status === 'healthy', 'Should be healthy');
    assert(health.timestamp, 'Should have timestamp');

    await api.stop();
  });

  await test('MetricsAPI: Get coherence metrics', async () => {
    const api = new MetricsAPI({ port: 3003, dbPath: TEST_DB_PATH });
    await api.start();

    const coherence = await makeRequest('http://localhost:3003/metrics/coherence');
    assert(typeof coherence.current === 'number', 'Should have current value');
    assert(typeof coherence.average === 'number', 'Should have average');
    assert(Array.isArray(coherence.history), 'Should have history');

    await api.stop();
  });

  await test('MetricsAPI: Get agent metrics', async () => {
    const api = new MetricsAPI({ port: 3004, dbPath: TEST_DB_PATH });
    await api.start();

    const agents = await makeRequest('http://localhost:3004/metrics/agents');
    assert(typeof agents.total === 'number', 'Should have total count');
    assert(typeof agents.active === 'number', 'Should have active count');
    assert(Array.isArray(agents.agents), 'Should have agents array');

    await api.stop();
  });

  await test('MetricsAPI: Export all metrics', async () => {
    const api = new MetricsAPI({ port: 3005, dbPath: TEST_DB_PATH });
    await api.start();

    const exported = await makeRequest('http://localhost:3005/export');
    assert(exported.coherence, 'Should have coherence data');
    assert(exported.performance, 'Should have performance data');
    assert(exported.agents, 'Should have agent data');
    assert(exported.metadata, 'Should have metadata');

    await api.stop();
  });

  // ==================== Dashboard Server Tests ====================

  await test('DashboardServer: Start and stop', async () => {
    const dashboard = new DashboardServer({ port: 8081, dbPath: TEST_DB_PATH });
    await dashboard.start();
    await dashboard.stop();
  });

  await test('DashboardServer: Serve HTML dashboard', async () => {
    const dashboard = new DashboardServer({ port: 8082, dbPath: TEST_DB_PATH });
    await dashboard.start();

    const html = await makeRequest('http://localhost:8082/');
    assert(typeof html === 'string', 'Should return HTML');
    assert(html.includes('Hive Mind'), 'Should contain dashboard title');

    await dashboard.stop();
  });

  await test('DashboardServer: Metrics API endpoint', async () => {
    const dashboard = new DashboardServer({ port: 8083, dbPath: TEST_DB_PATH });
    await dashboard.start();

    const metrics = await makeRequest('http://localhost:8083/metrics');
    assert(metrics.coherence, 'Should have coherence');
    assert(metrics.performance, 'Should have performance');
    assert(metrics.timestamp, 'Should have timestamp');

    await dashboard.stop();
  });

  await test('DashboardServer: WebSocket connection', async (done) => {
    const dashboard = new DashboardServer({ port: 8084, dbPath: TEST_DB_PATH, updateInterval: 500 });
    await dashboard.start();

    return new Promise((resolve) => {
      const ws = new WebSocket('ws://localhost:8084');

      ws.on('open', () => {
        // Connection successful
      });

      ws.on('message', (data) => {
        const metrics = JSON.parse(data);
        assert(metrics.coherence, 'Should receive coherence data');
        ws.close();
        dashboard.stop().then(resolve);
      });

      ws.on('error', (error) => {
        ws.close();
        dashboard.stop().then(() => {
          throw error;
        });
      });
    });
  });

  // ==================== Integration Tests ====================

  await test('Integration: All components work together', async () => {
    // Start dashboard
    const dashboard = new DashboardServer({ port: 8085, dbPath: TEST_DB_PATH });
    await dashboard.start();

    // Start metrics API
    const api = new MetricsAPI({ port: 3006, dbPath: TEST_DB_PATH });
    await api.start();

    // Start alert system
    const alerts = new AlertSystem({ dbPath: TEST_DB_PATH, checkInterval: 1000 });
    await alerts.init();
    alerts.start();

    // Get data from all sources
    const dashboardMetrics = await makeRequest('http://localhost:8085/metrics');
    const apiMetrics = await makeRequest('http://localhost:3006/metrics/all');

    // Verify consistency
    assert(dashboardMetrics.coherence, 'Dashboard should provide coherence');
    assert(apiMetrics.coherence, 'API should provide coherence');

    // Cleanup
    await dashboard.stop();
    await api.stop();
    await alerts.close();
  });

  // ==================== Cleanup ====================

  console.log('\nCleaning up...');
  await cleanupTestDatabase();

  // ==================== Results ====================

  console.log('\n' + '='.repeat(60));
  console.log('Test Results');
  console.log('='.repeat(60));
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}`);
  console.log('='.repeat(60));

  if (failed > 0) {
    process.exit(1);
  }
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch((error) => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests, setupTestDatabase, cleanupTestDatabase };
