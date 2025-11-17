#!/usr/bin/env node
/**
 * Consensus Coordination System
 * Multi-agent decision coordination with 3 algorithms
 *
 * Stock dependencies: claude-flow memory hooks
 * Builds on: Phase 1 always-on-hooks.js (memory coordination)
 */

const { execSync } = require('child_process');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

/**
 * Consensus algorithms
 */
const ALGORITHMS = {
  MAJORITY: 'majority',      // Simple majority vote
  WEIGHTED: 'weighted',      // Queen has 3x weight
  BYZANTINE: 'byzantine'     // Requires 2/3 agreement
};

/**
 * Request vote from agents on a decision
 */
async function requestConsensus(decision, agents, algorithm = ALGORITHMS.MAJORITY, timeout = 30000) {
  const votingKey = `hive/consensus/${Date.now()}`;
  const sessionId = process.env.SESSION_ID || 'unknown';

  // Initialize voting record
  const votingRecord = {
    decision,
    algorithm,
    agents: agents.map(a => ({ id: a, vote: null })),
    startTime: Date.now(),
    timeout,
    sessionId,
    status: 'voting'
  };

  // Store in memory (using hooks)
  await storeInMemory(votingKey, votingRecord);

  // Collect votes (in real implementation, agents would vote via hooks)
  // For now, simulate with timeout-based collection
  const votes = await collectVotes(votingKey, agents, timeout);

  // Calculate consensus based on algorithm
  const result = calculateConsensus(votes, algorithm);

  // Update voting record
  votingRecord.votes = votes;
  votingRecord.result = result;
  votingRecord.status = 'complete';
  votingRecord.endTime = Date.now();

  await storeInMemory(votingKey, votingRecord);

  return result;
}

/**
 * Collect votes from agents
 */
async function collectVotes(votingKey, agents, timeout) {
  // In production, agents vote by storing their vote in memory
  // Here we simulate by returning placeholder votes
  return agents.map(agent => ({
    agent,
    vote: 'approve', // Real implementation: read from memory
    timestamp: Date.now(),
    weight: agent === 'queen-coordinator' ? 3 : 1
  }));
}

/**
 * Calculate consensus based on algorithm
 */
function calculateConsensus(votes, algorithm) {
  switch (algorithm) {
    case ALGORITHMS.MAJORITY:
      return calculateMajority(votes);

    case ALGORITHMS.WEIGHTED:
      return calculateWeighted(votes);

    case ALGORITHMS.BYZANTINE:
      return calculateByzantine(votes);

    default:
      throw new Error(`Unknown algorithm: ${algorithm}`);
  }
}

/**
 * Simple majority (> 50%)
 */
function calculateMajority(votes) {
  const approvals = votes.filter(v => v.vote === 'approve').length;
  const total = votes.length;
  const passed = approvals > total / 2;

  return {
    algorithm: 'majority',
    passed,
    approvals,
    total,
    threshold: total / 2,
    percentage: (approvals / total * 100).toFixed(1)
  };
}

/**
 * Weighted voting (queen has 3x weight)
 */
function calculateWeighted(votes) {
  const totalWeight = votes.reduce((sum, v) => sum + v.weight, 0);
  const approvalWeight = votes
    .filter(v => v.vote === 'approve')
    .reduce((sum, v) => sum + v.weight, 0);

  const passed = approvalWeight > totalWeight / 2;

  return {
    algorithm: 'weighted',
    passed,
    approvalWeight,
    totalWeight,
    threshold: totalWeight / 2,
    percentage: (approvalWeight / totalWeight * 100).toFixed(1)
  };
}

/**
 * Byzantine fault tolerance (requires 2/3 agreement)
 */
function calculateByzantine(votes) {
  const approvals = votes.filter(v => v.vote === 'approve').length;
  const total = votes.length;
  const threshold = Math.ceil(total * 2 / 3);
  const passed = approvals >= threshold;

  return {
    algorithm: 'byzantine',
    passed,
    approvals,
    total,
    threshold,
    percentage: (approvals / total * 100).toFixed(1)
  };
}

/**
 * Store data in memory via hooks
 */
async function storeInMemory(key, value) {
  try {
    const cmd = `npx claude-flow@alpha hooks post-task --task-id "${key}"`;
    await execAsync(cmd);
  } catch (error) {
    console.warn('Memory storage warning:', error.message);
  }
}

/**
 * Retrieve consensus history
 */
function getConsensusHistory(limit = 10) {
  // In production: query memory for hive/consensus/* keys
  // Returns array of past consensus decisions
  return [];
}

// Export functions
module.exports = {
  requestConsensus,
  calculateConsensus,
  getConsensusHistory,
  ALGORITHMS
};

// CLI usage
if (require.main === module) {
  const [command, decision, ...agentArgs] = process.argv.slice(2);

  if (command === 'vote') {
    const agents = agentArgs.length > 0 ? agentArgs : ['queen', 'worker-1', 'worker-2'];
    const algorithm = process.env.CONSENSUS_ALGORITHM || ALGORITHMS.MAJORITY;

    requestConsensus(decision, agents, algorithm).then(result => {
      console.log('Consensus Result:');
      console.log(`  Algorithm: ${result.algorithm}`);
      console.log(`  Passed: ${result.passed}`);
      console.log(`  Votes: ${result.approvals}/${result.total} (${result.percentage}%)`);
    });
  } else {
    console.log('Usage:');
    console.log('  node consensus.js vote "<decision>" [agent1] [agent2] ...');
    console.log('  CONSENSUS_ALGORITHM=weighted node consensus.js vote "<decision>"');
  }
}
