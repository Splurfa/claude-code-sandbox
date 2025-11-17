#!/usr/bin/env node
/**
 * Consensus Mechanism Tests
 */

const assert = require('assert');
const { calculateConsensus, ALGORITHMS } = require('../code/consensus');

function runTests() {
  console.log('🧪 Testing Consensus Mechanisms...\n');

  // Test 1: Majority algorithm (pass)
  console.log('Test 1: Majority algorithm (pass)');
  const votes1 = [
    { agent: 'queen', vote: 'approve', weight: 1 },
    { agent: 'worker-1', vote: 'approve', weight: 1 },
    { agent: 'worker-2', vote: 'reject', weight: 1 }
  ];
  const result1 = calculateConsensus(votes1, ALGORITHMS.MAJORITY);
  assert(result1.passed === true, 'Should pass with majority (2/3)');
  assert(result1.approvals === 2, 'Should count 2 approvals');
  console.log(`✅ Majority: ${result1.approvals}/${result1.total} = ${result1.percentage}%\n`);

  // Test 2: Majority algorithm (fail)
  console.log('Test 2: Majority algorithm (fail)');
  const votes2 = [
    { agent: 'queen', vote: 'reject', weight: 1 },
    { agent: 'worker-1', vote: 'approve', weight: 1 },
    { agent: 'worker-2', vote: 'reject', weight: 1 }
  ];
  const result2 = calculateConsensus(votes2, ALGORITHMS.MAJORITY);
  assert(result2.passed === false, 'Should fail with minority (1/3)');
  console.log(`✅ Majority: ${result2.approvals}/${result2.total} = ${result2.percentage}%\n`);

  // Test 3: Weighted algorithm (queen 3x) - pass
  console.log('Test 3: Weighted algorithm (queen 3x) - pass');
  const votes3 = [
    { agent: 'queen', vote: 'approve', weight: 3 },
    { agent: 'worker-1', vote: 'reject', weight: 1 },
    { agent: 'worker-2', vote: 'reject', weight: 1 }
  ];
  const result3 = calculateConsensus(votes3, ALGORITHMS.WEIGHTED);
  assert(result3.passed === true, 'Should pass: 3 > 2.5 (3 approve weight vs 5 total)');
  console.log(`✅ Weighted: ${result3.approvalWeight}/${result3.totalWeight} = ${result3.percentage}%\n`);

  // Test 4: Byzantine algorithm (2/3 required)
  console.log('Test 4: Byzantine algorithm (2/3 required)');
  const votes4 = [
    { agent: 'queen', vote: 'approve', weight: 1 },
    { agent: 'worker-1', vote: 'approve', weight: 1 },
    { agent: 'worker-2', vote: 'reject', weight: 1 }
  ];
  const result4 = calculateConsensus(votes4, ALGORITHMS.BYZANTINE);
  assert(result4.passed === true, 'Should pass with 2/3');
  assert(result4.threshold === 2, 'Threshold should be 2 for 3 agents');
  console.log(`✅ Byzantine: ${result4.approvals}/${result4.total} (threshold: ${result4.threshold})\n`);

  // Test 5: Byzantine algorithm (fail with 1/3)
  console.log('Test 5: Byzantine algorithm (fail)');
  const votes5 = [
    { agent: 'queen', vote: 'approve', weight: 1 },
    { agent: 'worker-1', vote: 'reject', weight: 1 },
    { agent: 'worker-2', vote: 'reject', weight: 1 }
  ];
  const result5 = calculateConsensus(votes5, ALGORITHMS.BYZANTINE);
  assert(result5.passed === false, 'Should fail with 1/3');
  console.log(`✅ Byzantine: ${result5.approvals}/${result5.total} (threshold: ${result5.threshold})\n`);

  // Test 6: Weighted with queen approval (pass)
  console.log('Test 6: Weighted with queen approval (pass)');
  const votes6 = [
    { agent: 'queen', vote: 'approve', weight: 3 },
    { agent: 'worker-1', vote: 'approve', weight: 1 },
    { agent: 'worker-2', vote: 'reject', weight: 1 }
  ];
  const result6 = calculateConsensus(votes6, ALGORITHMS.WEIGHTED);
  assert(result6.passed === true, 'Should pass: 4 vs 1 weight');
  console.log(`✅ Weighted: ${result6.approvalWeight}/${result6.totalWeight} = ${result6.percentage}%\n`);

  console.log('✅ All Consensus tests passed!');
}

// Run tests
if (require.main === module) {
  try {
    runTests();
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

module.exports = { runTests };
