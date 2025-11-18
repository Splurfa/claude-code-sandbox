/**
 * Topology System Tests
 *
 * Comprehensive test suite for adaptive topology switching system.
 * Tests all 4 topology types, coherence preservation, and rollback mechanisms.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const TopologyManager = require('../code/topology/topology-manager');
const CoherenceMonitor = require('../code/topology/coherence-monitor');
const TopologySelector = require('../code/topology/topology-selector');
const TopologyMCP = require('../code/topology/topology-mcp');

// Test database path
const TEST_DB_PATH = path.join(__dirname, '../../../.hive-mind', 'test-topology.db');

// Clean up test database before/after tests
function cleanupTestDb() {
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
}

test('TopologyManager - initialization', async (t) => {
  cleanupTestDb();

  const manager = new TopologyManager({ dbPath: TEST_DB_PATH });

  assert.ok(manager, 'Manager should be created');
  assert.ok(fs.existsSync(TEST_DB_PATH), 'Database file should be created');

  manager.close();
  cleanupTestDb();
});

test('TopologyManager - topology switching', async (t) => {
  cleanupTestDb();

  const manager = new TopologyManager({ dbPath: TEST_DB_PATH });

  await t.test('should switch to hierarchical topology', async () => {
    const result = await manager.switchTopology('hierarchical', 'planning', 5);

    assert.ok(result.success, 'Switch should succeed');
    assert.strictEqual(result.topology, 'hierarchical');
    assert.ok(result.coherenceAfter >= 0.95, 'Coherence should be preserved');
  });

  await t.test('should switch to mesh topology', async () => {
    const result = await manager.switchTopology('mesh', 'design', 8);

    assert.ok(result.success, 'Switch should succeed');
    assert.strictEqual(result.topology, 'mesh');
    assert.ok(result.coherenceAfter >= 0.95, 'Coherence should be preserved');
  });

  await t.test('should switch to star topology', async () => {
    const result = await manager.switchTopology('star', 'review', 6);

    assert.ok(result.success, 'Switch should succeed');
    assert.strictEqual(result.topology, 'star');
    assert.ok(result.coherenceAfter >= 0.95, 'Coherence should be preserved');
  });

  await t.test('should switch to ring topology', async () => {
    const result = await manager.switchTopology('ring', 'pipeline', 7);

    assert.ok(result.success, 'Switch should succeed');
    assert.strictEqual(result.topology, 'ring');
    assert.ok(result.coherenceAfter >= 0.95, 'Coherence should be preserved');
  });

  manager.close();
  cleanupTestDb();
});

test('TopologyManager - coherence preservation', async (t) => {
  cleanupTestDb();

  const manager = new TopologyManager({
    dbPath: TEST_DB_PATH,
    coherenceThreshold: 0.95
  });

  await t.test('should preserve coherence during multiple switches', async () => {
    const switches = [
      ['hierarchical', 'planning', 5],
      ['mesh', 'design', 8],
      ['star', 'review', 6],
      ['ring', 'pipeline', 7]
    ];

    for (const [topology, phase, agentCount] of switches) {
      const result = await manager.switchTopology(topology, phase, agentCount);
      assert.ok(result.coherenceAfter >= 0.95, `Coherence should be >= 0.95 for ${topology}`);
    }

    const metrics = manager.getTopologyMetrics();
    assert.ok(metrics.avgCoherence >= 0.95, 'Average coherence should be >= 0.95');
  });

  manager.close();
  cleanupTestDb();
});

test('TopologyManager - rollback mechanism', async (t) => {
  cleanupTestDb();

  // Create manager with very high coherence threshold
  const manager = new TopologyManager({
    dbPath: TEST_DB_PATH,
    coherenceThreshold: 0.985 // Very high threshold
  });

  await t.test('should rollback on coherence failure', async () => {
    // First switch should succeed (initial state)
    const result1 = await manager.switchTopology('hierarchical', 'planning', 5);

    // Ring topology has lower base coherence (0.96)
    // With many agents, should potentially fall below 0.985 threshold
    const result2 = await manager.switchTopology('ring', 'pipeline', 15);

    if (!result2.success) {
      // If coherence check failed, verify rollback occurred
      assert.ok(result2.rolledBack, 'Should have rolled back');
      assert.ok(result2.error, 'Should have error message');
      assert.ok(result2.coherenceAfter < 0.985, 'Coherence should be below threshold');

      const current = manager.getCurrentTopology();
      assert.strictEqual(current.topology, 'hierarchical', 'Should rollback to previous topology');
    } else {
      // If switch succeeded, coherence was acceptable
      assert.ok(result2.coherenceAfter >= 0.985, 'Coherence should be above threshold');
    }
  });

  manager.close();
  cleanupTestDb();
});

test('TopologyManager - switch history', async (t) => {
  cleanupTestDb();

  const manager = new TopologyManager({ dbPath: TEST_DB_PATH });

  await t.test('should record switch history', async () => {
    const r1 = await manager.switchTopology('hierarchical', 'planning', 5);
    const r2 = await manager.switchTopology('mesh', 'design', 8);
    const r3 = await manager.switchTopology('star', 'review', 6);

    // Ensure all switches succeeded
    assert.ok(r1.success && r2.success && r3.success, 'All switches should succeed');

    const history = manager.getSwitchHistory(10);

    // Filter only successful switches (ignore any rollbacks)
    const successfulSwitches = history.filter(s => s.success === 1);

    assert.ok(successfulSwitches.length >= 3, 'Should have at least 3 successful switches');

    // Verify topologies are in history (order may vary with rollbacks)
    const topologies = successfulSwitches.map(s => s.to_topology);
    assert.ok(topologies.includes('star'), 'Should include star topology');
    assert.ok(topologies.includes('mesh'), 'Should include mesh topology');
    assert.ok(topologies.includes('hierarchical'), 'Should include hierarchical topology');
  });

  manager.close();
  cleanupTestDb();
});

test('CoherenceMonitor - monitoring', async (t) => {
  const monitor = new CoherenceMonitor({ threshold: 0.95 });

  await t.test('should start and stop monitoring', async () => {
    monitor.startMonitoring();
    assert.ok(monitor.isMonitoring, 'Should be monitoring');

    monitor.stopMonitoring();
    assert.ok(!monitor.isMonitoring, 'Should stop monitoring');
  });

  await t.test('should track coherence metrics', async () => {
    monitor.startMonitoring();

    // Wait for some metrics to be collected
    await new Promise(resolve => setTimeout(resolve, 2000));

    const metrics = monitor.getMetrics();
    assert.ok(metrics.samples > 0, 'Should have collected samples');
    assert.ok(metrics.current !== null, 'Should have current coherence');

    monitor.stopMonitoring();
  });

  await t.test('should validate topology switches', async () => {
    const validation = monitor.validateSwitch('hierarchical', 'mesh');

    assert.ok(typeof validation.canSwitch === 'boolean', 'Should have canSwitch flag');
    assert.ok(validation.currentCoherence >= 0, 'Should have coherence value');
    assert.strictEqual(validation.threshold, 0.95, 'Should have correct threshold');
  });

  monitor.destroy();
});

test('TopologySelector - phase-based selection', async (t) => {
  const selector = new TopologySelector();

  await t.test('should select hierarchical for planning', async () => {
    const result = selector.selectTopology({ phase: 'planning' });
    assert.strictEqual(result.topology, 'hierarchical');
    assert.strictEqual(result.confidence, 1.0);
  });

  await t.test('should select mesh for design', async () => {
    const result = selector.selectTopology({ phase: 'design' });
    assert.strictEqual(result.topology, 'mesh');
  });

  await t.test('should select star for review', async () => {
    const result = selector.selectTopology({ phase: 'review' });
    assert.strictEqual(result.topology, 'star');
  });

  await t.test('should select ring for pipeline', async () => {
    const result = selector.selectTopology({ phase: 'pipeline' });
    assert.strictEqual(result.topology, 'ring');
  });
});

test('TopologySelector - agent count selection', async (t) => {
  const selector = new TopologySelector();

  await t.test('should select star for small teams', async () => {
    const result = selector.selectTopology({ agentCount: 3 });
    assert.strictEqual(result.topology, 'star');
  });

  await t.test('should select mesh for medium teams', async () => {
    const result = selector.selectTopology({ agentCount: 8 });
    assert.strictEqual(result.topology, 'mesh');
  });

  await t.test('should select hierarchical for large teams', async () => {
    const result = selector.selectTopology({ agentCount: 15 });
    assert.strictEqual(result.topology, 'hierarchical');
  });
});

test('TopologySelector - transition recommendations', async (t) => {
  const selector = new TopologySelector();

  await t.test('should recommend switch for phase transition', async () => {
    const result = selector.getTransitionRecommendation('planning', 'design');

    assert.ok(result.needsSwitch, 'Should need switch from planning to design');
    assert.strictEqual(result.fromTopology, 'hierarchical');
    assert.strictEqual(result.toTopology, 'mesh');
  });

  await t.test('should not recommend switch for same phase', async () => {
    const result = selector.getTransitionRecommendation('design', 'implementation');

    assert.ok(!result.needsSwitch, 'Should not need switch (both use mesh)');
  });
});

test('TopologyMCP - integration', async (t) => {
  cleanupTestDb();

  const mcp = new TopologyMCP({ dbPath: TEST_DB_PATH });

  await t.test('should initialize swarm with auto-selected topology', async () => {
    const result = await mcp.initializeSwarm({
      phase: 'planning',
      maxAgents: 5
    });

    assert.ok(result.success, 'Initialization should succeed');
    assert.strictEqual(result.topology, 'hierarchical', 'Should auto-select hierarchical for planning');
  });

  await t.test('should switch to phase with auto-selection', async () => {
    const result = await mcp.switchToPhase({
      toPhase: 'design',
      agentCount: 8
    });

    assert.ok(result.success, 'Switch should succeed');
    assert.strictEqual(result.topology, 'mesh', 'Should auto-select mesh for design');
  });

  await t.test('should get current status', async () => {
    const status = mcp.getStatus();

    assert.ok(status.topology, 'Should have topology info');
    assert.ok(status.metrics, 'Should have metrics');
    assert.ok(status.coherence, 'Should have coherence data');
  });

  await t.test('should get recommendations', async () => {
    const rec = mcp.getRecommendation({ phase: 'review' });

    assert.strictEqual(rec.topology, 'star', 'Should recommend star for review');
  });

  await t.test('should validate coherence', async () => {
    const validation = mcp.validateCoherence();

    assert.ok(typeof validation.valid === 'boolean', 'Should have valid flag');
    assert.ok(validation.threshold === 0.95, 'Should have correct threshold');
  });

  mcp.destroy();
  cleanupTestDb();
});

test('TopologyMCP - complete workflow', async (t) => {
  cleanupTestDb();

  const mcp = new TopologyMCP({ dbPath: TEST_DB_PATH });

  await t.test('should handle complete development workflow', async () => {
    const phases = [];

    // Phase 1: Planning (hierarchical)
    const planning = await mcp.switchToPhase({
      toPhase: 'planning',
      agentCount: 5
    });
    if (planning.success) {
      assert.strictEqual(planning.topology, 'hierarchical', 'Planning should use hierarchical');
      phases.push(planning);
    }

    // Phase 2: Design (mesh)
    const design = await mcp.switchToPhase({
      toPhase: 'design',
      agentCount: 8
    });
    if (design.success) {
      assert.strictEqual(design.topology, 'mesh', 'Design should use mesh');
      phases.push(design);
    }

    // Phase 3: Review (star)
    const review = await mcp.switchToPhase({
      toPhase: 'review',
      agentCount: 6
    });
    if (review.success) {
      assert.strictEqual(review.topology, 'star', 'Review should use star');
      phases.push(review);
    }

    // Phase 4: Pipeline (ring)
    const pipeline = await mcp.switchToPhase({
      toPhase: 'pipeline',
      agentCount: 7
    });
    if (pipeline.success) {
      assert.strictEqual(pipeline.topology, 'ring', 'Pipeline should use ring');
      phases.push(pipeline);
    }

    // Verify most phases succeeded
    assert.ok(phases.length >= 3, `Should have at least 3 successful phases (got ${phases.length})`);

    // Verify coherence maintained throughout successful switches
    for (const phase of phases) {
      assert.ok(phase.coherenceAfter >= 0.95, `Coherence should be >= 0.95 for ${phase.topology}`);
    }

    // Verify history contains switches
    const history = mcp.getHistory(10);
    assert.ok(history.length >= 3, 'Should have at least 3 switches in history');

    // Verify average coherence is maintained
    const metrics = mcp.manager.getTopologyMetrics();
    assert.ok(metrics.avgCoherence >= 0.95, 'Average coherence should be >= 0.95');
  });

  mcp.destroy();
  cleanupTestDb();
});
