/**
 * Monitoring System Usage Examples
 *
 * Demonstrates various integration patterns and use cases.
 */

const DashboardServer = require('./dashboard-server');
const CoherenceDisplay = require('./coherence-display');
const AlertSystem = require('./alert-system');
const MetricsAPI = require('./metrics-api');

// ==================== Example 1: Basic Dashboard ====================

async function example1_basicDashboard() {
  console.log('Example 1: Starting basic dashboard...\n');

  const dashboard = new DashboardServer({ port: 8080 });
  await dashboard.start();

  console.log('Dashboard running at: http://localhost:8080');
  console.log('Press Ctrl+C to stop\n');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down...');
    await dashboard.stop();
    process.exit(0);
  });
}

// ==================== Example 2: Coherence Monitoring ====================

async function example2_coherenceMonitoring() {
  console.log('Example 2: Coherence monitoring and analysis\n');

  const display = new CoherenceDisplay();
  await display.init();

  // Get current status
  const status = await display.getCoherenceStatus();
  console.log(`Current Coherence: ${(status.score * 100).toFixed(2)}%`);
  console.log(`Status: ${status.status.toUpperCase()}`);
  console.log(`Color: ${status.color}\n`);

  // Get statistics
  const stats = await display.getCoherenceStats(24);
  console.log('Statistics (24h):');
  console.log(`  Average: ${(stats.average * 100).toFixed(2)}%`);
  console.log(`  Min: ${(stats.min * 100).toFixed(2)}%`);
  console.log(`  Max: ${(stats.max * 100).toFixed(2)}%`);
  console.log(`  Trend: ${stats.trend}`);
  console.log(`  Volatility: ${(stats.volatility * 100).toFixed(2)}%\n`);

  // Get forecast
  const forecast = await display.forecastCoherence(5);
  console.log('Forecast (next 5 steps):');
  forecast.forecast.forEach((f, i) => {
    console.log(`  Step ${i + 1}: ${(f.value * 100).toFixed(2)}%`);
  });
  console.log(`  Confidence: ${forecast.confidence}\n`);

  // Get detailed report
  const report = await display.getDetailedReport();
  console.log('Recommendations:');
  report.recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. [${rec.priority.toUpperCase()}] ${rec.message}`);
  });

  await display.close();
}

// ==================== Example 3: Alert System with Custom Handlers ====================

async function example3_alertSystem() {
  console.log('Example 3: Alert system with custom handlers\n');

  const alerts = new AlertSystem({ checkInterval: 5000 });
  await alerts.init();

  // Custom alert handlers
  alerts.on('alert', async (alert) => {
    console.log(`\n🔔 Alert Triggered!`);
    console.log(`   Severity: ${alert.severity.toUpperCase()}`);
    console.log(`   Message: ${alert.message}`);
    console.log(`   Time: ${new Date(alert.timestamp).toLocaleString()}\n`);

    // Example: Send to external systems
    if (alert.severity === 'critical') {
      // await sendToSlack(alert);
      // await createPagerDutyIncident(alert);
      console.log('   → Would notify PagerDuty for critical alert');
    } else if (alert.severity === 'warning') {
      // await sendEmail(alert);
      console.log('   → Would send email for warning alert');
    }
  });

  alerts.start();
  console.log('Alert system monitoring started...');
  console.log('Press Ctrl+C to stop\n');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down alert system...');
    await alerts.close();
    process.exit(0);
  });
}

// ==================== Example 4: Metrics API with Custom Queries ====================

async function example4_metricsAPI() {
  console.log('Example 4: Metrics API with custom queries\n');

  const api = new MetricsAPI({ port: 3000 });
  await api.start();

  console.log('API Endpoints:');
  console.log('  http://localhost:3000/metrics/coherence');
  console.log('  http://localhost:3000/metrics/performance');
  console.log('  http://localhost:3000/metrics/agents');
  console.log('  http://localhost:3000/metrics/consensus');
  console.log('  http://localhost:3000/export\n');

  // Example queries
  console.log('Example curl commands:');
  console.log('  curl http://localhost:3000/metrics/coherence?hours=24');
  console.log('  curl http://localhost:3000/export?format=summary');
  console.log('  curl http://localhost:3000/timeseries/coherence_score?interval=5m\n');

  console.log('Press Ctrl+C to stop\n');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down API...');
    await api.stop();
    process.exit(0);
  });
}

// ==================== Example 5: Complete Monitoring Stack ====================

async function example5_completeStack() {
  console.log('Example 5: Complete monitoring stack deployment\n');

  // Start all components
  console.log('Starting monitoring stack...\n');

  // 1. Dashboard
  const dashboard = new DashboardServer({ port: 8080 });
  await dashboard.start();
  console.log('✅ Dashboard started on http://localhost:8080');

  // 2. Metrics API
  const api = new MetricsAPI({ port: 3000 });
  await api.start();
  console.log('✅ Metrics API started on http://localhost:3000');

  // 3. Alert System
  const alerts = new AlertSystem({ checkInterval: 5000 });
  await alerts.init();

  alerts.on('alert', (alert) => {
    console.log(`🚨 Alert: ${alert.severity.toUpperCase()} - ${alert.message}`);
  });

  alerts.start();
  console.log('✅ Alert system started\n');

  console.log('Monitoring stack is fully operational!');
  console.log('Press Ctrl+C to stop all services\n');

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down monitoring stack...');
    await dashboard.stop();
    await api.stop();
    await alerts.close();
    console.log('All services stopped.');
    process.exit(0);
  });
}

// ==================== Example 6: Export and Analysis ====================

async function example6_exportAnalysis() {
  console.log('Example 6: Data export and analysis\n');

  const display = new CoherenceDisplay();
  await display.init();

  // Export to JSON
  const exportPath = '/tmp/coherence-export.json';
  const result = await display.exportToJSON(24, exportPath);

  console.log(`✅ Exported ${result.size} bytes to ${result.filepath}`);

  // Read and analyze
  const fs = require('fs').promises;
  const data = JSON.parse(await fs.readFile(exportPath, 'utf8'));

  console.log('\nExport Summary:');
  console.log(`  Current coherence: ${(data.report.current.score * 100).toFixed(2)}%`);
  console.log(`  Status: ${data.report.current.status}`);
  console.log(`  Average (24h): ${(data.report.statistics.average * 100).toFixed(2)}%`);
  console.log(`  Data points: ${data.metadata.data_points}`);
  console.log(`  Trend: ${data.report.statistics.trend}`);

  console.log('\nForecast:');
  data.report.forecast.forecast.slice(0, 3).forEach((f, i) => {
    console.log(`  Step ${i + 1}: ${(f.value * 100).toFixed(2)}%`);
  });

  console.log('\nRecommendations:');
  data.report.recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. [${rec.priority}] ${rec.message}`);
  });

  await display.close();
}

// ==================== Example 7: Real-time WebSocket Client ====================

async function example7_websocketClient() {
  console.log('Example 7: Real-time WebSocket monitoring\n');

  const WebSocket = require('ws');

  // Connect to dashboard
  const ws = new WebSocket('ws://localhost:8080');

  ws.on('open', () => {
    console.log('✅ Connected to monitoring dashboard\n');
  });

  ws.on('message', (data) => {
    const metrics = JSON.parse(data);

    console.clear();
    console.log('=== Real-time Monitoring ===\n');
    console.log(`Coherence: ${(metrics.coherence.current * 100).toFixed(2)}%`);
    console.log(`Active Agents: ${metrics.agents.active}/${metrics.agents.total}`);
    console.log(`Tasks Completed: ${metrics.performance.tasks_completed || 0}`);
    console.log(`Success Rate: ${((metrics.performance.success_rate || 0) * 100).toFixed(1)}%`);

    if (metrics.alerts && metrics.alerts.length > 0) {
      console.log('\n⚠️  Active Alerts:');
      metrics.alerts.forEach(alert => {
        console.log(`   ${alert.severity.toUpperCase()}: ${alert.message}`);
      });
    }

    console.log(`\nLast update: ${new Date(metrics.timestamp).toLocaleTimeString()}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error.message);
  });

  ws.on('close', () => {
    console.log('\nDisconnected from dashboard');
  });
}

// ==================== Example 8: Custom Metrics Aggregation ====================

async function example8_customAggregation() {
  console.log('Example 8: Custom metrics aggregation\n');

  const api = new MetricsAPI({ port: 3000 });
  await api.start();

  // Custom aggregation using the API
  const http = require('http');

  function makeRequest(path) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:3000${path}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
  }

  // Get all metrics
  const all = await makeRequest('/metrics/all');

  // Calculate custom KPIs
  const kpis = {
    health_score: (
      all.coherence.current * 0.4 +
      all.consensus.success_rate * 0.3 +
      (all.agents.active / all.agents.total) * 0.3
    ),
    efficiency: all.performance.task_success?.average || 0,
    stability: 1 - (all.coherence.current - all.coherence.min),
    alert_severity: all.alerts.critical > 0 ? 'high' : all.alerts.warning > 0 ? 'medium' : 'low'
  };

  console.log('Custom KPIs:');
  console.log(`  Overall Health: ${(kpis.health_score * 100).toFixed(1)}%`);
  console.log(`  Efficiency: ${(kpis.efficiency * 100).toFixed(1)}%`);
  console.log(`  Stability: ${(kpis.stability * 100).toFixed(1)}%`);
  console.log(`  Alert Severity: ${kpis.alert_severity.toUpperCase()}`);

  await api.stop();
}

// ==================== Main Menu ====================

async function main() {
  const examples = {
    '1': { name: 'Basic Dashboard', fn: example1_basicDashboard },
    '2': { name: 'Coherence Monitoring', fn: example2_coherenceMonitoring },
    '3': { name: 'Alert System', fn: example3_alertSystem },
    '4': { name: 'Metrics API', fn: example4_metricsAPI },
    '5': { name: 'Complete Stack', fn: example5_completeStack },
    '6': { name: 'Export & Analysis', fn: example6_exportAnalysis },
    '7': { name: 'WebSocket Client', fn: example7_websocketClient },
    '8': { name: 'Custom Aggregation', fn: example8_customAggregation }
  };

  const choice = process.argv[2];

  if (!choice || !examples[choice]) {
    console.log('Monitoring System Examples\n');
    console.log('Usage: node examples.js <number>\n');
    console.log('Available examples:');
    Object.entries(examples).forEach(([num, ex]) => {
      console.log(`  ${num}. ${ex.name}`);
    });
    console.log();
    process.exit(0);
  }

  try {
    await examples[choice].fn();
  } catch (error) {
    console.error('Error running example:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  example1_basicDashboard,
  example2_coherenceMonitoring,
  example3_alertSystem,
  example4_metricsAPI,
  example5_completeStack,
  example6_exportAnalysis,
  example7_websocketClient,
  example8_customAggregation
};
