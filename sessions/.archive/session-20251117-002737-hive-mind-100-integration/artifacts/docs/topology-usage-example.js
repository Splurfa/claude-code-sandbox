/**
 * Adaptive Topology Switching - Usage Example
 *
 * Demonstrates complete development workflow with automatic
 * topology switching based on phase.
 */

const TopologyMCP = require('../code/topology/topology-mcp');

async function developmentWorkflow() {
  console.log('🚀 Starting Development Workflow with Adaptive Topology\n');

  // Initialize topology manager
  const mcp = new TopologyMCP({
    dbPath: '.hive-mind/hive.db',
    coherenceThreshold: 0.95
  });

  try {
    // ==========================================
    // Phase 1: Strategic Planning
    // ==========================================
    console.log('📋 Phase 1: Strategic Planning');
    console.log('   → Auto-selecting topology for planning phase...');

    const planning = await mcp.initializeSwarm({
      phase: 'planning',
      maxAgents: 5
    });

    console.log(`   ✓ Selected: ${planning.topology.toUpperCase()}`);
    console.log(`   ✓ Coherence: ${(planning.coherence * 100).toFixed(1)}%`);
    console.log(`   ✓ Reason: ${planning.selection.reason}\n`);

    // Start coherence monitoring
    mcp.startMonitoring();

    // ==========================================
    // Phase 2: Collaborative Design
    // ==========================================
    console.log('🎨 Phase 2: Collaborative Design');
    console.log('   → Switching to design phase...');

    const design = await mcp.switchToPhase({
      toPhase: 'design',
      agentCount: 8
    });

    if (design.success) {
      console.log(`   ✓ Switched to: ${design.topology.toUpperCase()}`);
      console.log(`   ✓ Coherence: ${(design.coherenceAfter * 100).toFixed(1)}%`);
      console.log(`   ✓ Preserved: ${design.preserved ? 'YES' : 'NO'}\n`);
    } else {
      console.log(`   ✗ Switch failed - rolled back to ${design.topology}`);
      console.log(`   ✗ Reason: ${design.error}\n`);
    }

    // ==========================================
    // Phase 3: Code Review
    // ==========================================
    console.log('🔍 Phase 3: Code Review');
    console.log('   → Switching to review phase...');

    const review = await mcp.switchToPhase({
      toPhase: 'review',
      agentCount: 6
    });

    if (review.success) {
      console.log(`   ✓ Switched to: ${review.topology.toUpperCase()}`);
      console.log(`   ✓ Coherence: ${(review.coherenceAfter * 100).toFixed(1)}%`);
      console.log(`   ✓ Validation: ${review.validation.canSwitch ? 'PASSED' : 'FAILED'}\n`);
    }

    // ==========================================
    // Phase 4: Deployment Pipeline
    // ==========================================
    console.log('🚢 Phase 4: Deployment Pipeline');
    console.log('   → Switching to pipeline phase...');

    const pipeline = await mcp.switchToPhase({
      toPhase: 'pipeline',
      agentCount: 7
    });

    if (pipeline.success) {
      console.log(`   ✓ Switched to: ${pipeline.topology.toUpperCase()}`);
      console.log(`   ✓ Coherence: ${(pipeline.coherenceAfter * 100).toFixed(1)}%`);
      console.log(`   ✓ Stages: 7 agents in sequence\n`);
    }

    // ==========================================
    // Workflow Summary
    // ==========================================
    console.log('📊 Workflow Summary\n');

    // Get switch history
    const history = mcp.getHistory(10);
    console.log(`   Total Switches: ${history.length}`);
    console.log(`   Successful: ${history.filter(s => s.success).length}`);
    console.log(`   Rolled Back: ${history.filter(s => !s.success).length}\n`);

    // Get topology metrics
    const metrics = mcp.manager.getTopologyMetrics();
    console.log(`   Success Rate: ${(metrics.successRate * 100).toFixed(1)}%`);
    console.log(`   Avg Coherence: ${(metrics.avgCoherence * 100).toFixed(1)}%`);
    console.log(`   Current Topology: ${metrics.current}\n`);

    // Display switch history
    console.log('   Switch History:');
    history.forEach((sw, idx) => {
      const status = sw.success ? '✓' : '✗';
      const from = sw.from_topology || 'INIT';
      const to = sw.to_topology;
      const coherence = (sw.coherence_after * 100).toFixed(1);
      console.log(`   ${idx + 1}. ${status} ${from} → ${to} (${coherence}%)`);
    });

    // ==========================================
    // Advanced: Get Recommendations
    // ==========================================
    console.log('\n💡 Topology Recommendations\n');

    const recommendations = [
      { phase: 'planning', agentCount: 3 },
      { phase: 'implementation', agentCount: 10 },
      { phase: 'qa', agentCount: 15 }
    ];

    recommendations.forEach(req => {
      const rec = mcp.getRecommendation(req);
      console.log(`   ${req.phase} (${req.agentCount} agents):`);
      console.log(`   → ${rec.topology} (confidence: ${(rec.confidence * 100).toFixed(0)}%)`);
      console.log(`   → ${rec.reason}\n`);
    });

    // ==========================================
    // Coherence Validation
    // ==========================================
    console.log('🛡️  Coherence Validation\n');

    const validation = mcp.validateCoherence();
    console.log(`   Valid: ${validation.valid ? 'YES' : 'NO'}`);
    console.log(`   Current: ${(validation.current * 100).toFixed(1)}%`);
    console.log(`   Average: ${(validation.average * 100).toFixed(1)}%`);
    console.log(`   Threshold: ${(validation.threshold * 100).toFixed(1)}%\n`);

    // ==========================================
    // Available Topologies Reference
    // ==========================================
    console.log('📚 Available Topologies\n');

    const topologies = mcp.selector.getAvailableTopologies();
    Object.entries(topologies).forEach(([key, info]) => {
      console.log(`   ${info.name.toUpperCase()}`);
      console.log(`   → ${info.description}`);
      console.log(`   → Best for: ${info.bestFor.join(', ')}`);
      console.log(`   → Bandwidth: ${info.bandwidth}, Scalability: ${info.scalability}\n`);
    });

    // Stop monitoring
    mcp.stopMonitoring();

  } catch (error) {
    console.error('❌ Workflow Error:', error.message);
    console.error(error.stack);
  } finally {
    // Cleanup
    mcp.destroy();
    console.log('✅ Workflow Complete\n');
  }
}

// ==========================================
// Example: Manual Topology Selection
// ==========================================
async function manualTopologyExample() {
  console.log('🔧 Manual Topology Selection Example\n');

  const mcp = new TopologyMCP({
    dbPath: '.hive-mind/hive-manual.db',
    coherenceThreshold: 0.95
  });

  try {
    // Force mesh topology regardless of phase
    console.log('   → Forcing MESH topology for collaborative work...');

    const result = await mcp.initializeSwarm({
      topology: 'mesh',  // Explicit topology
      phase: 'planning', // Phase doesn't affect selection
      maxAgents: 8
    });

    console.log(`   ✓ Topology: ${result.topology}`);
    console.log(`   ✓ Coherence: ${(result.coherence * 100).toFixed(1)}%`);

    // Switch with explicit topology
    console.log('\n   → Forcing STAR topology for testing...');

    const star = await mcp.switchToPhase({
      toPhase: 'implementation',
      topology: 'star',  // Override auto-selection
      agentCount: 12
    });

    if (star.success) {
      console.log(`   ✓ Switched to: ${star.topology}`);
      console.log(`   ✓ Coherence: ${(star.coherenceAfter * 100).toFixed(1)}%\n`);
    }

  } finally {
    mcp.destroy();
  }
}

// ==========================================
// Example: Rollback Simulation
// ==========================================
async function rollbackExample() {
  console.log('⏮️  Rollback Mechanism Example\n');

  const mcp = new TopologyMCP({
    dbPath: '.hive-mind/hive-rollback.db',
    coherenceThreshold: 0.985  // Very high threshold to trigger rollback
  });

  try {
    // Initialize with hierarchical
    console.log('   → Initializing with HIERARCHICAL topology...');

    await mcp.initializeSwarm({
      phase: 'planning',
      maxAgents: 5
    });

    console.log('   ✓ Initialized successfully\n');

    // Attempt switch that might fail coherence check
    console.log('   → Attempting switch to RING with high threshold...');
    console.log('   → (May trigger rollback if coherence < 98.5%)\n');

    const result = await mcp.switchToPhase({
      toPhase: 'pipeline',
      agentCount: 15  // Many agents = lower coherence
    });

    if (result.success) {
      console.log('   ✓ Switch succeeded');
      console.log(`   ✓ Coherence: ${(result.coherenceAfter * 100).toFixed(1)}%\n`);
    } else {
      console.log('   ⏮️  Switch failed - rollback triggered!');
      console.log(`   ✓ Rolled back to: ${result.topology}`);
      console.log(`   ✓ Coherence was: ${(result.coherenceAfter * 100).toFixed(1)}%`);
      console.log(`   ✓ Threshold: ${(result.threshold * 100).toFixed(1)}%`);
      console.log(`   ✓ Error: ${result.error}\n`);
    }

    // Verify current state
    const status = mcp.getStatus();
    console.log(`   Current Topology: ${status.topology.topology}`);
    console.log(`   Current Coherence: ${(status.coherence.average * 100).toFixed(1)}%\n`);

  } finally {
    mcp.destroy();
  }
}

// ==========================================
// Run Examples
// ==========================================
async function main() {
  console.log('═'.repeat(60));
  console.log('  Adaptive Topology Switching - Usage Examples');
  console.log('═'.repeat(60) + '\n');

  // Run development workflow
  await developmentWorkflow();

  console.log('\n' + '═'.repeat(60) + '\n');

  // Run manual selection example
  await manualTopologyExample();

  console.log('\n' + '═'.repeat(60) + '\n');

  // Run rollback example
  await rollbackExample();

  console.log('═'.repeat(60));
  console.log('  All Examples Complete');
  console.log('═'.repeat(60) + '\n');
}

// Execute if run directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal Error:', error);
    process.exit(1);
  });
}

module.exports = {
  developmentWorkflow,
  manualTopologyExample,
  rollbackExample
};
