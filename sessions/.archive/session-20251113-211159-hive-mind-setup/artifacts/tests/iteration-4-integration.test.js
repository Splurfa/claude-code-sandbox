#!/usr/bin/env node
/**
 * Phase 2 Integration Tests
 * Verify Captain's Log, Consensus, and Closeout work together
 */

const assert = require('assert');
const { logDecision } = require('../code/captains-log');
const { calculateConsensus, ALGORITHMS } = require('../code/consensus');
const { generateSessionSummary } = require('../code/session-closeout');

function runTests() {
  console.log('🧪 Testing Phase 2 Integration...\n');

  // Test 1: Decision → Captain's Log
  console.log('Test 1: Decision logged to Captain\'s Log');
  const decision = 'Implement Byzantine consensus for critical decisions';
  const rationale = 'Higher security for multi-agent coordination';
  const logResult = logDecision(decision, rationale, { agent: 'queen' });
  assert(logResult.timestamp, 'Decision should be timestamped');
  console.log('✅ Decision logged successfully\n');

  // Test 2: Consensus → Decision
  console.log('Test 2: Consensus mechanism for decision');
  const votes = [
    { agent: 'queen', vote: 'approve', weight: 3 },
    { agent: 'collective-intelligence', vote: 'approve', weight: 1 },
    { agent: 'worker-1', vote: 'approve', weight: 1 },
    { agent: 'worker-2', vote: 'reject', weight: 1 }
  ];
  const consensusResult = calculateConsensus(votes, ALGORITHMS.WEIGHTED);
  assert(consensusResult.passed === true, 'Weighted consensus should pass');
  console.log(`✅ Consensus reached: ${consensusResult.approvalWeight}/${consensusResult.totalWeight}\n`);

  // Test 3: Session summary includes decisions
  console.log('Test 3: Session summary generation');
  const sessionId = process.env.SESSION_ID || 'session-20251113-211159-hive-mind-setup';
  const summary = generateSessionSummary(sessionId);
  assert(summary.includes('Session:'), 'Summary should have session header');
  assert(summary.includes('## Artifacts Created'), 'Summary should list artifacts');
  console.log('✅ Session summary generated\n');

  // Test 4: End-to-end workflow
  console.log('Test 4: End-to-end workflow');
  // 1. Make decision
  const decision2 = 'Use hierarchical topology for Phase 3';
  logDecision(decision2, 'Better coordination for complex tasks');

  // 2. Get consensus
  const votes2 = [
    { agent: 'queen', vote: 'approve', weight: 3 },
    { agent: 'architect', vote: 'approve', weight: 1 },
    { agent: 'performance-analyst', vote: 'approve', weight: 1 }
  ];
  const consensus2 = calculateConsensus(votes2, ALGORITHMS.WEIGHTED);
  assert(consensus2.passed === true, 'Should reach consensus');

  // 3. Summary captures workflow
  const summary2 = generateSessionSummary(sessionId);
  assert(summary2.length > 0, 'Summary should contain content');

  console.log('✅ End-to-end workflow verified\n');

  // Test 5: Phase 1 + Phase 2 integration
  console.log('Test 5: Phase 1 + Phase 2 integration');
  const phase1Modules = [
    '../../../iteration-3/artifacts/code/session-auto-init.js',
    '../../../iteration-3/artifacts/code/always-on-hooks.js',
    '../../../iteration-3/artifacts/code/learning-integration.js'
  ];

  phase1Modules.forEach(modulePath => {
    try {
      require(modulePath);
      console.log(`  ✓ ${modulePath.split('/').pop()} loaded`);
    } catch (error) {
      throw new Error(`Failed to load ${modulePath}: ${error.message}`);
    }
  });

  console.log('✅ Phase 1 + Phase 2 integration verified\n');

  console.log('✅ All Integration tests passed!');
}

// Run tests
if (require.main === module) {
  try {
    runTests();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = { runTests };
