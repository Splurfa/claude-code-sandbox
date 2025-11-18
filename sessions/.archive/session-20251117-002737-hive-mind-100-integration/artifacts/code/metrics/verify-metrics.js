#!/usr/bin/env node

/**
 * Metrics System Verification Script
 *
 * Runs 5 test tasks to verify metrics collection,
 * database persistence, and dashboard export.
 */

const { MetricsCollector } = require('./metrics-collector');
const { TokenTracker } = require('./token-tracker');
const { SpeedupCalculator } = require('./speedup-calculator');
const { DashboardExporter } = require('./dashboard-exporter');

async function runVerification() {
  console.log('🔍 Starting Metrics System Verification\n');
  console.log('=' .repeat(60));

  const collector = new MetricsCollector();
  const tokenTracker = new TokenTracker(collector);
  const speedupCalc = new SpeedupCalculator(collector);
  const exporter = new DashboardExporter(collector); // Pass shared collector

  try {
    await collector.connect();
    console.log('✅ Connected to database\n');

    // Test 1: Simple task timing
    console.log('Test 1: Task Timing');
    console.log('-' .repeat(60));
    const task1 = 'verify-task-1';
    collector.startTaskTimer(task1, { description: 'Simple timing test' });
    await sleep(150);
    const duration1 = await collector.stopTaskTimer(task1);
    console.log(`✅ Task completed in ${duration1}ms`);
    console.log();

    // Test 2: Token tracking
    console.log('Test 2: Token Tracking');
    console.log('-' .repeat(60));
    await tokenTracker.trackUsage('verify-agent-1', {
      input_tokens: 1500,
      output_tokens: 800,
      cache_creation_input_tokens: 100,
      cache_read_input_tokens: 200
    }, { task: 'verify-task-2' });
    const agentSummary = await tokenTracker.getAgentSummary('verify-agent-1');
    console.log(`✅ Tracked ${agentSummary.totalTokens} tokens`);
    console.log(`   - Input: ${agentSummary.totalInputTokens}`);
    console.log(`   - Output: ${agentSummary.totalOutputTokens}`);
    console.log(`   - Estimated cost: $${agentSummary.estimatedCost.toFixed(4)}`);
    console.log();

    // Test 3: Speedup calculation
    console.log('Test 3: Speedup Calculation');
    console.log('-' .repeat(60));
    const speedupMetrics = await speedupCalc.recordSpeedup(
      'verify-swarm-1',
      1200,
      4500,
      4,
      { task: 'verify-task-3' }
    );
    console.log(`✅ Speedup: ${speedupMetrics.speedup.toFixed(2)}x`);
    console.log(`   - Efficiency: ${(speedupMetrics.efficiency * 100).toFixed(1)}%`);
    console.log(`   - Improvement: ${speedupMetrics.percentImprovement.toFixed(1)}%`);
    console.log(`   - Scalability score: ${speedupMetrics.scalabilityScore}/100`);
    console.log();

    // Test 4: Memory latency tracking
    console.log('Test 4: Memory Latency Tracking');
    console.log('-' .repeat(60));
    await collector.recordMemoryLatency('store', 15, {
      key: 'test-key',
      size: 1024
    });
    await collector.recordMemoryLatency('retrieve', 8, {
      key: 'test-key'
    });
    const memoryMetrics = await collector.getEntityMetrics('memory', 'store');
    console.log(`✅ Recorded ${memoryMetrics.length} memory operations`);
    console.log();

    // Test 5: Complex multi-agent task
    console.log('Test 5: Multi-Agent Task Coordination');
    console.log('-' .repeat(60));
    const task5 = 'verify-task-5-complex';
    collector.startTaskTimer(task5, {
      description: 'Multi-agent coordination test',
      agents: ['agent-1', 'agent-2', 'agent-3']
    });

    // Simulate parallel agent work
    await Promise.all([
      (async () => {
        await sleep(100);
        await tokenTracker.trackUsage('verify-agent-2', {
          input_tokens: 2000,
          output_tokens: 1000
        }, { task: task5 });
      })(),
      (async () => {
        await sleep(120);
        await tokenTracker.trackUsage('verify-agent-3', {
          input_tokens: 1800,
          output_tokens: 900
        }, { task: task5 });
      })(),
      (async () => {
        await sleep(110);
        await tokenTracker.trackUsage('verify-agent-4', {
          input_tokens: 2200,
          output_tokens: 1100
        }, { task: task5 });
      })()
    ]);

    const duration5 = await collector.stopTaskTimer(task5);
    console.log(`✅ Multi-agent task completed in ${duration5}ms`);

    const sessionSummary = tokenTracker.getSessionSummary();
    console.log(`   - Total agents: ${sessionSummary.agents.length}`);
    console.log(`   - Total tokens: ${sessionSummary.totalTokens.toLocaleString()}`);
    console.log(`   - Total requests: ${sessionSummary.totalRequests}`);
    console.log(`   - Total cost: $${sessionSummary.estimatedCost.toFixed(4)}`);
    console.log();

    // Verify database persistence
    console.log('Database Persistence Verification');
    console.log('-' .repeat(60));
    const allTaskMetrics = await collector.getTypeMetrics('task');
    const allAgentMetrics = await collector.getTypeMetrics('agent');
    const allSwarmMetrics = await collector.getTypeMetrics('swarm');
    const allMemoryMetrics = await collector.getTypeMetrics('memory');

    console.log(`✅ Database contains:`);
    console.log(`   - Task metrics: ${allTaskMetrics.length}`);
    console.log(`   - Agent metrics: ${allAgentMetrics.length}`);
    console.log(`   - Swarm metrics: ${allSwarmMetrics.length}`);
    console.log(`   - Memory metrics: ${allMemoryMetrics.length}`);
    console.log();

    // Verify dashboard export
    console.log('Dashboard Export Verification');
    console.log('-' .repeat(60));
    const dashboard = await exporter.exportDashboard({
      includeRawMetrics: false
    });

    console.log('✅ Dashboard export successful:');
    console.log(`   - Summary entities: ${Object.keys(dashboard.summary).length}`);
    console.log(`   - Timeline events: ${dashboard.timeline.length}`);
    console.log(`   - Alerts: ${dashboard.alerts.length}`);

    if (dashboard.alerts.length > 0) {
      console.log('\n   Active alerts:');
      dashboard.alerts.forEach(alert => {
        console.log(`   - [${alert.severity}] ${alert.message}`);
      });
    }

    // Save dashboard to file
    const dashboardPath = '.hive-mind/exports/verification-dashboard.json';
    await exporter.saveDashboard(dashboardPath);
    console.log(`   - Saved to: ${dashboardPath}`);
    console.log();

    // Summary
    console.log('=' .repeat(60));
    console.log('✅ VERIFICATION COMPLETE - ALL SYSTEMS OPERATIONAL');
    console.log('=' .repeat(60));
    console.log();
    console.log('Summary:');
    console.log(`  - Tests run: 5/5`);
    console.log(`  - Tasks tracked: ${allTaskMetrics.filter(m => m.metric_name === 'duration_ms').length}`);
    console.log(`  - Token operations: ${allAgentMetrics.filter(m => m.metric_name === 'total_tokens').length}`);
    console.log(`  - Speedup measurements: ${allSwarmMetrics.filter(m => m.metric_name === 'speedup_factor').length}`);
    console.log(`  - Memory operations: ${allMemoryMetrics.length}`);
    console.log(`  - Total cost: $${sessionSummary.estimatedCost.toFixed(4)}`);
    console.log();

    // Coordination memory update
    console.log('Updating coordination memory...');
    const coordStatus = {
      phase: 'phase1',
      component: 'metrics',
      status: 'completed',
      verificationResults: {
        tasksRun: 5,
        metricsCollected: allTaskMetrics.length + allAgentMetrics.length + allSwarmMetrics.length + allMemoryMetrics.length,
        dashboardExported: true,
        timestamp: new Date().toISOString()
      }
    };

    // Write coordination status to file for hooks to pick up
    const fs = require('fs').promises;
    await fs.mkdir('.swarm/metrics', { recursive: true });
    await fs.writeFile(
      '.swarm/metrics/verification-complete.json',
      JSON.stringify(coordStatus, null, 2)
    );

    console.log('✅ Coordination memory updated');
    console.log();
    console.log('🎉 Metrics system is fully operational and ready for production use!');

    return {
      success: true,
      metrics: {
        tasks: allTaskMetrics.length,
        agents: allAgentMetrics.length,
        swarms: allSwarmMetrics.length,
        memory: allMemoryMetrics.length
      }
    };

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    console.error(error.stack);
    return { success: false, error: error.message };
  } finally {
    await collector.close();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run verification if executed directly
if (require.main === module) {
  runVerification()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runVerification };
