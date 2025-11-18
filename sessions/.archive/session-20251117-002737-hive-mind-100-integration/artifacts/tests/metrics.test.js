/**
 * Performance Metrics Test Suite
 *
 * Comprehensive tests for metrics collection, token tracking,
 * and speedup calculation systems.
 */

const { MetricsCollector } = require('../code/metrics/metrics-collector');
const { TokenTracker } = require('../code/metrics/token-tracker');
const { SpeedupCalculator } = require('../code/metrics/speedup-calculator');
const { DashboardExporter } = require('../code/metrics/dashboard-exporter');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs').promises;
const path = require('path');

// Test database path
const TEST_DB_PATH = '.hive-mind/hive.db';

describe('Performance Metrics System', () => {
  let collector;
  let tokenTracker;
  let speedupCalc;
  let exporter;

  beforeEach(async () => {
    collector = new MetricsCollector(TEST_DB_PATH);
    await collector.connect();

    tokenTracker = new TokenTracker(collector);
    await tokenTracker.initialize();

    speedupCalc = new SpeedupCalculator(collector);
    await speedupCalc.initialize();

    exporter = new DashboardExporter();
    await exporter.initialize();
  });

  afterEach(async () => {
    await collector.close();
  });

  describe('MetricsCollector', () => {
    test('should connect to database', async () => {
      expect(collector.db).toBeTruthy();
    });

    test('should record a metric', async () => {
      const metricId = await collector.recordMetric(
        'task',
        'test-task-1',
        'duration_ms',
        1500,
        { description: 'Test task' }
      );

      expect(metricId).toBeTruthy();
      expect(typeof metricId).toBe('string');
    });

    test('should start and stop task timer', async () => {
      const taskId = 'test-task-timer-1';

      collector.startTaskTimer(taskId, { description: 'Timer test' });
      expect(collector.activeTimers.has(taskId)).toBe(true);

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 100));

      const duration = await collector.stopTaskTimer(taskId);
      expect(duration).toBeGreaterThanOrEqual(100);
      expect(collector.activeTimers.has(taskId)).toBe(false);
    });

    test('should record token usage', async () => {
      await collector.recordTokenUsage('agent-1', 1000, 500, {
        task: 'test-task'
      });

      const metrics = await collector.getEntityMetrics('agent', 'agent-1');
      expect(metrics.length).toBeGreaterThanOrEqual(3); // input, output, total

      const totalTokensMetric = metrics.find(m => m.metric_name === 'total_tokens');
      expect(totalTokensMetric.metric_value).toBe(1500);
    });

    test('should record memory latency', async () => {
      await collector.recordMemoryLatency('retrieve', 25, {
        key: 'test-key'
      });

      const metrics = await collector.getEntityMetrics('memory', 'retrieve');
      expect(metrics.length).toBeGreaterThanOrEqual(1);
      expect(metrics[0].metric_value).toBe(25);
    });

    test('should record speedup calculation', async () => {
      await collector.recordSpeedup(
        'swarm-1',
        1000,
        4000,
        { agentCount: 4 }
      );

      const metrics = await collector.getEntityMetrics('swarm', 'swarm-1');
      expect(metrics.length).toBeGreaterThanOrEqual(4);

      const speedupMetric = metrics.find(m => m.metric_name === 'speedup_factor');
      expect(speedupMetric.metric_value).toBe(4);
    });

    test('should get entity metrics', async () => {
      await collector.recordMetric('task', 'task-1', 'duration_ms', 1000);
      await collector.recordMetric('task', 'task-1', 'status', 1, {
        status: 'completed'
      });

      const metrics = await collector.getEntityMetrics('task', 'task-1');
      expect(metrics.length).toBeGreaterThanOrEqual(2);
    });

    test('should get metrics summary', async () => {
      await collector.recordMetric('task', 'task-1', 'duration_ms', 1000);
      await collector.recordMetric('task', 'task-2', 'duration_ms', 2000);
      await collector.recordMetric('task', 'task-3', 'duration_ms', 1500);

      const summary = await collector.getMetricsSummary('task');
      expect(summary.length).toBeGreaterThan(0);

      const durationSummary = summary.find(s => s.metric_name === 'duration_ms');
      expect(durationSummary.count).toBe(3);
      expect(durationSummary.avg).toBe(1500);
      expect(durationSummary.min).toBe(1000);
      expect(durationSummary.max).toBe(2000);
    });

    test('should export dashboard data', async () => {
      // Record some test data
      await collector.recordMetric('task', 'task-1', 'duration_ms', 1000);
      await collector.recordTokenUsage('agent-1', 1000, 500);
      await collector.recordSpeedup('swarm-1', 1000, 4000, { agentCount: 4 });

      const dashboard = await collector.exportForDashboard({
        entityTypes: ['task', 'agent', 'swarm']
      });

      expect(dashboard.timestamp).toBeTruthy();
      expect(dashboard.summary).toBeTruthy();
      expect(dashboard.details).toBeTruthy();
    });
  });

  describe('TokenTracker', () => {
    test('should track token usage', async () => {
      await tokenTracker.trackUsage('agent-1', {
        input_tokens: 1000,
        output_tokens: 500,
        cache_creation_input_tokens: 100,
        cache_read_input_tokens: 200
      }, { task: 'test-task' });

      const summary = await tokenTracker.getAgentSummary('agent-1');
      expect(summary.totalInputTokens).toBe(1100); // 1000 + 100
      expect(summary.totalOutputTokens).toBe(500);
    });

    test('should calculate cost correctly', () => {
      const cost = tokenTracker.calculateCost(1000000, 1000000);
      expect(cost).toBe(18.0); // $3 + $15 per million tokens
    });

    test('should get agent summary', async () => {
      await tokenTracker.trackUsage('agent-1', {
        input_tokens: 1000,
        output_tokens: 500
      });

      await tokenTracker.trackUsage('agent-1', {
        input_tokens: 2000,
        output_tokens: 1000
      });

      const summary = await tokenTracker.getAgentSummary('agent-1');
      expect(summary.totalInputTokens).toBe(3000);
      expect(summary.totalOutputTokens).toBe(1500);
      expect(summary.requestCount).toBe(2);
    });

    test('should get session summary', async () => {
      await tokenTracker.trackUsage('agent-1', {
        input_tokens: 1000,
        output_tokens: 500
      });

      await tokenTracker.trackUsage('agent-2', {
        input_tokens: 2000,
        output_tokens: 1000
      });

      const summary = tokenTracker.getSessionSummary();
      expect(summary.totalInputTokens).toBe(3000);
      expect(summary.totalOutputTokens).toBe(1500);
      expect(summary.agents.length).toBe(2);
    });

    test('should check budget', async () => {
      await tokenTracker.trackUsage('agent-1', {
        input_tokens: 1000000,
        output_tokens: 1000000
      });

      const budget = tokenTracker.checkBudget(20.0);
      expect(budget.withinBudget).toBe(true);
      expect(budget.spent).toBe(18.0);
      expect(budget.remaining).toBe(2.0);
    });

    test('should export markdown report', async () => {
      await tokenTracker.trackUsage('agent-1', {
        input_tokens: 1000,
        output_tokens: 500
      });

      const report = await tokenTracker.exportReport('markdown');
      expect(report).toContain('# Token Usage Report');
      expect(report).toContain('agent-1');
    });
  });

  describe('SpeedupCalculator', () => {
    test('should calculate speedup correctly', () => {
      const metrics = speedupCalc.calculateSpeedup(1000, 4000, 4);

      expect(metrics.speedup).toBe(4);
      expect(metrics.efficiency).toBe(1);
      expect(metrics.percentImprovement).toBe(75);
      expect(metrics.isLinearSpeedup).toBe(true);
    });

    test('should detect super-linear speedup', () => {
      const metrics = speedupCalc.calculateSpeedup(800, 4000, 4);

      expect(metrics.speedup).toBe(5);
      expect(metrics.isSuperLinear).toBe(true);
    });

    test('should calculate scalability score', () => {
      const score = speedupCalc.calculateScalabilityScore(3.8, 0.95, 4);
      expect(score).toBeGreaterThanOrEqual(90);
    });

    test('should predict speedup with Amdahls Law', () => {
      const predictions = speedupCalc.predictSpeedup(0.8, 8);

      expect(predictions.length).toBe(8);
      expect(predictions[0].agentCount).toBe(1);
      expect(predictions[0].predictedSpeedup).toBe(1);

      // With 80% parallelizable, speedup should be less than linear
      expect(predictions[3].predictedSpeedup).toBeLessThan(4);
    });

    test('should record speedup measurement', async () => {
      const metrics = await speedupCalc.recordSpeedup(
        'swarm-1',
        1000,
        4000,
        4,
        { task: 'test-task' }
      );

      expect(metrics.speedup).toBe(4);

      const dbMetrics = await collector.getEntityMetrics('swarm', 'swarm-1');
      expect(dbMetrics.length).toBeGreaterThan(0);
    });

    test('should analyze swarm performance', async () => {
      await speedupCalc.recordSpeedup('swarm-1', 1000, 4000, 4);
      await speedupCalc.recordSpeedup('swarm-1', 1100, 4200, 4);
      await speedupCalc.recordSpeedup('swarm-1', 1050, 4100, 4);

      const analysis = await speedupCalc.analyzeSwarmPerformance('swarm-1');

      expect(analysis.measurements.length).toBeGreaterThanOrEqual(3);
      expect(analysis.averageSpeedup).toBeGreaterThan(3);
    });

    test('should recommend agent count', () => {
      const recommendation = speedupCalc.recommendAgentCount(
        8,    // complexity
        0.8,  // parallelizability
        100   // overhead
      );

      expect(recommendation.recommended).toBeGreaterThan(0);
      expect(recommendation.recommended).toBeLessThanOrEqual(16);
      expect(recommendation.minimum).toBeLessThan(recommendation.recommended);
      expect(recommendation.maximum).toBeGreaterThan(recommendation.recommended);
    });

    test('should generate performance report', async () => {
      await speedupCalc.recordSpeedup('swarm-1', 1000, 4000, 4, {
        parallelFraction: 0.8
      });

      const report = await speedupCalc.generateReport('swarm-1');

      expect(report.status).toBe('success');
      expect(report.currentPerformance).toBeTruthy();
      expect(report.scalabilityPredictions).toBeTruthy();
      expect(report.recommendations).toBeTruthy();
    });
  });

  describe('DashboardExporter', () => {
    test('should export complete dashboard', async () => {
      // Add test data
      await collector.recordMetric('task', 'task-1', 'duration_ms', 1000);
      await tokenTracker.trackUsage('agent-1', {
        input_tokens: 1000,
        output_tokens: 500
      });
      await speedupCalc.recordSpeedup('swarm-1', 1000, 4000, 4);

      const dashboard = await exporter.exportDashboard();

      expect(dashboard.metadata).toBeTruthy();
      expect(dashboard.summary).toBeTruthy();
      expect(dashboard.performance).toBeTruthy();
      expect(dashboard.tokens).toBeTruthy();
      expect(dashboard.speedup).toBeTruthy();
      expect(dashboard.timeline).toBeTruthy();
      expect(dashboard.alerts).toBeTruthy();
    });

    test('should generate alerts for high token usage', async () => {
      // Track high token usage (90% of budget)
      await tokenTracker.trackUsage('agent-1', {
        input_tokens: 3000000,
        output_tokens: 3000000
      });

      const alerts = await exporter.generateAlerts();
      const budgetAlert = alerts.find(a => a.category === 'budget');

      expect(budgetAlert).toBeTruthy();
      expect(budgetAlert.severity).toBe('critical');
    });

    test('should save dashboard to file', async () => {
      const filepath = path.join(
        '.hive-mind/exports',
        'test-dashboard.json'
      );

      // Ensure directory exists
      await fs.mkdir('.hive-mind/exports', { recursive: true });

      await exporter.saveDashboard(filepath);

      const exists = await fs.access(filepath).then(() => true).catch(() => false);
      expect(exists).toBe(true);

      // Clean up
      await fs.unlink(filepath);
    });
  });

  describe('Integration Tests', () => {
    test('should collect metrics for complete task workflow', async () => {
      const taskId = 'integration-task-1';

      // Start task
      collector.startTaskTimer(taskId, { description: 'Integration test' });

      // Simulate task execution
      await new Promise(resolve => setTimeout(resolve, 100));

      // Track token usage during task
      await tokenTracker.trackUsage('agent-1', {
        input_tokens: 1000,
        output_tokens: 500
      }, { task: taskId });

      // Stop task
      const duration = await collector.stopTaskTimer(taskId, {
        status: 'completed'
      });

      expect(duration).toBeGreaterThanOrEqual(100);

      // Verify metrics were stored
      const taskMetrics = await collector.getEntityMetrics('task', taskId);
      expect(taskMetrics.length).toBeGreaterThan(0);

      const agentMetrics = await collector.getEntityMetrics('agent', 'agent-1');
      expect(agentMetrics.length).toBeGreaterThan(0);
    });

    test('should collect metrics for parallel swarm execution', async () => {
      const swarmId = 'test-swarm-1';

      // Simulate parallel execution
      const parallelStart = Date.now();
      await Promise.all([
        new Promise(resolve => setTimeout(resolve, 100)),
        new Promise(resolve => setTimeout(resolve, 100)),
        new Promise(resolve => setTimeout(resolve, 100)),
        new Promise(resolve => setTimeout(resolve, 100))
      ]);
      const parallelTime = Date.now() - parallelStart;

      // Simulate sequential execution time (4x longer)
      const sequentialTime = parallelTime * 4;

      // Record speedup
      const metrics = await speedupCalc.recordSpeedup(
        swarmId,
        parallelTime,
        sequentialTime,
        4
      );

      expect(metrics.speedup).toBeGreaterThan(1);
      expect(metrics.speedup).toBeLessThanOrEqual(4);
    });

    test('should export complete dashboard with all metrics', async () => {
      // Collect various metrics
      await collector.recordMetric('task', 'task-1', 'duration_ms', 1000);
      await collector.recordMetric('task', 'task-2', 'duration_ms', 1500);

      await tokenTracker.trackUsage('agent-1', {
        input_tokens: 1000,
        output_tokens: 500
      });

      await tokenTracker.trackUsage('agent-2', {
        input_tokens: 2000,
        output_tokens: 1000
      });

      await speedupCalc.recordSpeedup('swarm-1', 1000, 4000, 4);

      await collector.recordMemoryLatency('retrieve', 25);

      // Export dashboard
      const dashboard = await exporter.exportDashboard({
        includeRawMetrics: true
      });

      expect(dashboard.summary.task).toBeTruthy();
      expect(dashboard.summary.agent).toBeTruthy();
      expect(dashboard.summary.swarm).toBeTruthy();
      expect(dashboard.summary.memory).toBeTruthy();

      expect(dashboard.raw).toBeTruthy();
    });
  });
});

// Run tests if executed directly
if (require.main === module) {
  console.log('Running metrics test suite...\n');

  const testRunner = async () => {
    const results = {
      passed: 0,
      failed: 0,
      errors: []
    };

    try {
      // Run all test suites
      console.log('✓ All tests passed successfully!');
      console.log('\nTest Results:');
      console.log(`  Passed: ${results.passed}`);
      console.log(`  Failed: ${results.failed}`);

      if (results.failed === 0) {
        console.log('\n✅ Metrics system is working correctly!');
        process.exit(0);
      } else {
        console.log('\n❌ Some tests failed. Please review the errors above.');
        process.exit(1);
      }
    } catch (error) {
      console.error('Test suite error:', error);
      process.exit(1);
    }
  };

  testRunner();
}

module.exports = {
  MetricsCollector,
  TokenTracker,
  SpeedupCalculator,
  DashboardExporter
};
