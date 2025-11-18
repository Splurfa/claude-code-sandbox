/**
 * Consensus System Test Runner
 * Comprehensive verification without external test framework
 */

const AutoConsensus = require('../code/consensus/auto-consensus');
const VoteCollector = require('../code/consensus/vote-collector');
const { ConsensusMCP } = require('../code/consensus/consensus-mcp');
const fs = require('fs');
const path = require('path');

const TEST_DB_PATH = path.join(__dirname, 'test-consensus.db');

// Test utilities
let testCount = 0;
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`  ✓ ${message}`);
  } else {
    failCount++;
    console.log(`  ✗ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEquals(actual, expected, message) {
  assert(actual === expected, `${message} (expected: ${expected}, got: ${actual})`);
}

function assertCloseTo(actual, expected, precision, message) {
  const diff = Math.abs(actual - expected);
  assert(diff < precision, `${message} (expected: ${expected}, got: ${actual}, diff: ${diff})`);
}

// Clean up test database
function cleanupTestDb() {
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
}

// Setup test database
async function setupTestDb(consensus) {
  await consensus.initialize();

  return new Promise((resolve, reject) => {
    consensus.db.exec(`
      CREATE TABLE swarms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'active'
      );

      CREATE TABLE agents (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        name TEXT NOT NULL,
        role TEXT,
        metadata TEXT DEFAULT '{}'
      );

      CREATE TABLE consensus_votes (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        proposal_id TEXT NOT NULL,
        agent_id TEXT,
        vote REAL NOT NULL,
        weight REAL DEFAULT 1.0,
        justification TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE consensus_decisions (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        topic TEXT NOT NULL,
        decision TEXT,
        votes TEXT,
        algorithm TEXT DEFAULT 'majority',
        confidence REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE messages (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        sender_id TEXT,
        recipient_id TEXT,
        channel TEXT,
        type TEXT,
        content TEXT,
        priority INTEGER
      );
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Insert test data
async function insertTestData(consensus) {
  return new Promise((resolve, reject) => {
    consensus.db.run(`
      INSERT INTO swarms (id, name) VALUES ('swarm-1', 'Test Swarm');
      INSERT INTO agents (id, swarm_id, name, role) VALUES
        ('agent-1', 'swarm-1', 'Worker 1', 'worker'),
        ('agent-2', 'swarm-1', 'Worker 2', 'worker'),
        ('agent-3', 'swarm-1', 'Worker 3', 'worker'),
        ('agent-4', 'swarm-1', 'Worker 4', 'worker'),
        ('queen-1', 'swarm-1', 'Queen', 'queen');
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Test suite
async function runTests() {
  console.log('\n🧪 Consensus System Tests\n');
  console.log('='.repeat(50));

  let consensus, collector;

  try {
    // ==================== TEST 1: MAJORITY VOTING ====================
    console.log('\n📊 Test Suite 1: Majority Voting (51%+)\n');

    cleanupTestDb();
    consensus = new AutoConsensus(TEST_DB_PATH);
    await setupTestDb(consensus);
    await insertTestData(consensus);

    // Test 1.1: Simple majority approval
    console.log('\n  Test 1.1: Simple majority approval (3 yes, 2 no)');
    const prop1 = await consensus.createProposal('swarm-1', 'majority-1', {
      algorithm: 'majority'
    });
    await consensus.recordVote('majority-1', 'agent-1', 1.0);
    await consensus.recordVote('majority-1', 'agent-2', 1.0);
    await consensus.recordVote('majority-1', 'agent-3', 1.0);
    await consensus.recordVote('majority-1', 'agent-4', 0.0);
    await consensus.recordVote('majority-1', 'queen-1', 0.0);
    const result1 = await consensus.finalizeVoting('majority-1');
    assertEquals(result1.decision, true, 'Should approve with majority');
    assertEquals(result1.confidence, 0.6, 'Confidence should be 60%');

    // Test 1.2: Majority rejection
    console.log('\n  Test 1.2: Majority rejection (2 yes, 3 no)');
    await consensus.createProposal('swarm-1', 'majority-2', { algorithm: 'majority' });
    await consensus.recordVote('majority-2', 'agent-1', 1.0);
    await consensus.recordVote('majority-2', 'agent-2', 1.0);
    await consensus.recordVote('majority-2', 'agent-3', 0.0);
    await consensus.recordVote('majority-2', 'agent-4', 0.0);
    await consensus.recordVote('majority-2', 'queen-1', 0.0);
    const result2 = await consensus.finalizeVoting('majority-2');
    assertEquals(result2.decision, false, 'Should reject without majority');

    await consensus.close();

    // ==================== TEST 2: BYZANTINE VOTING ====================
    console.log('\n\n🛡️  Test Suite 2: Byzantine Voting (2/3 supermajority)\n');

    cleanupTestDb();
    consensus = new AutoConsensus(TEST_DB_PATH);
    await setupTestDb(consensus);
    await insertTestData(consensus);

    // Test 2.1: Byzantine approval
    console.log('\n  Test 2.1: Byzantine approval (4 yes, 1 no)');
    await consensus.createProposal('swarm-1', 'byzantine-1', { algorithm: 'byzantine' });
    await consensus.recordVote('byzantine-1', 'agent-1', 1.0);
    await consensus.recordVote('byzantine-1', 'agent-2', 1.0);
    await consensus.recordVote('byzantine-1', 'agent-3', 1.0);
    await consensus.recordVote('byzantine-1', 'agent-4', 1.0);
    await consensus.recordVote('byzantine-1', 'queen-1', 0.0);
    const result3 = await consensus.finalizeVoting('byzantine-1');
    assertEquals(result3.decision, true, 'Should approve with 2/3 supermajority');
    assertEquals(result3.details.threshold, 4, 'Threshold should be 4');

    // Test 2.2: Byzantine rejection
    console.log('\n  Test 2.2: Byzantine rejection (3 yes, 2 no)');
    await consensus.createProposal('swarm-1', 'byzantine-2', { algorithm: 'byzantine' });
    await consensus.recordVote('byzantine-2', 'agent-1', 1.0);
    await consensus.recordVote('byzantine-2', 'agent-2', 1.0);
    await consensus.recordVote('byzantine-2', 'agent-3', 1.0);
    await consensus.recordVote('byzantine-2', 'agent-4', 0.0);
    await consensus.recordVote('byzantine-2', 'queen-1', 0.0);
    const result4 = await consensus.finalizeVoting('byzantine-2');
    assertEquals(result4.decision, false, 'Should reject without 2/3 supermajority');

    await consensus.close();

    // ==================== TEST 3: WEIGHTED VOTING ====================
    console.log('\n\n⚖️  Test Suite 3: Weighted Voting (queen 3x weight)\n');

    cleanupTestDb();
    consensus = new AutoConsensus(TEST_DB_PATH);
    await setupTestDb(consensus);
    await insertTestData(consensus);

    // Test 3.1: Queen + 1 worker approval
    console.log('\n  Test 3.1: Queen + 1 worker approval');
    await consensus.createProposal('swarm-1', 'weighted-1', { algorithm: 'weighted' });
    await consensus.recordVote('weighted-1', 'queen-1', 1.0, { weight: 3.0 });
    await consensus.recordVote('weighted-1', 'agent-1', 1.0, { weight: 1.0 });
    await consensus.recordVote('weighted-1', 'agent-2', 0.0, { weight: 1.0 });
    await consensus.recordVote('weighted-1', 'agent-3', 0.0, { weight: 1.0 });
    await consensus.recordVote('weighted-1', 'agent-4', 0.0, { weight: 1.0 });
    const result5 = await consensus.finalizeVoting('weighted-1');
    assertEquals(result5.decision, true, 'Should approve with queen + 1 worker');
    assertEquals(result5.details.weightedYes, 4, 'Weighted yes should be 4');
    assertEquals(result5.details.totalWeight, 7, 'Total weight should be 7');

    // Test 3.2: Custom weights
    console.log('\n  Test 3.2: Custom weights');
    await consensus.createProposal('swarm-1', 'weighted-2', { algorithm: 'weighted' });
    await consensus.recordVote('weighted-2', 'agent-1', 1.0, { weight: 2.0 });
    await consensus.recordVote('weighted-2', 'agent-2', 1.0, { weight: 1.5 });
    await consensus.recordVote('weighted-2', 'agent-3', 0.0, { weight: 1.0 });
    await consensus.recordVote('weighted-2', 'agent-4', 0.0, { weight: 0.5 });
    const result6 = await consensus.finalizeVoting('weighted-2');
    assertEquals(result6.decision, true, 'Should approve with custom weights');
    assertEquals(result6.details.weightedYes, 3.5, 'Weighted yes should be 3.5');
    assertEquals(result6.confidence, 0.7, 'Confidence should be 70%');

    await consensus.close();

    // ==================== TEST 4: DATABASE PERSISTENCE ====================
    console.log('\n\n💾 Test Suite 4: Database Persistence\n');

    cleanupTestDb();
    consensus = new AutoConsensus(TEST_DB_PATH);
    await setupTestDb(consensus);
    await insertTestData(consensus);

    // Test 4.1: Vote storage
    console.log('\n  Test 4.1: Vote storage in database');
    await consensus.createProposal('swarm-1', 'db-test-1');
    await consensus.recordVote('db-test-1', 'agent-1', 1.0, {
      weight: 1.0,
      justification: 'Test justification'
    });
    const votes = await consensus.getVoteHistory('db-test-1');
    assert(votes.length === 1, 'Should store 1 vote');
    assertEquals(votes[0].agent_id, 'agent-1', 'Agent ID should match');
    assertEquals(votes[0].justification, 'Test justification', 'Justification should match');

    // Test 4.2: Decision storage
    console.log('\n  Test 4.2: Decision storage in database');
    await consensus.recordVote('db-test-1', 'agent-2', 1.0);
    await consensus.recordVote('db-test-1', 'agent-3', 0.0);
    await consensus.finalizeVoting('db-test-1');
    const decisions = await consensus.getDecisionHistory('swarm-1');
    assert(decisions.length > 0, 'Should store decision');
    assertEquals(decisions[0].decision, 'approved', 'Decision should be approved');

    await consensus.close();

    // ==================== TEST 5: MCP INTERFACE ====================
    console.log('\n\n🔌 Test Suite 5: MCP Tool Interface\n');

    cleanupTestDb();
    const mcp = new ConsensusMCP(TEST_DB_PATH);
    await mcp.initialize();

    // Setup schema first
    await setupTestDb(mcp.consensus);

    // Setup test data
    await insertTestData(mcp.consensus);

    // Test 5.1: Create proposal via MCP
    console.log('\n  Test 5.1: Create proposal via MCP');
    const mcpProposal = await mcp.createProposal({
      swarm_id: 'swarm-1',
      proposal_id: 'mcp-test-1',
      agents: ['agent-1', 'agent-2', 'agent-3'],
      algorithm: 'majority',
      notify_agents: false
    });
    assertEquals(mcpProposal.proposalId, 'mcp-test-1', 'Proposal ID should match');

    // Test 5.2: Submit vote via MCP
    console.log('\n  Test 5.2: Submit vote via MCP');
    const voteResult = await mcp.submitVote({
      proposal_id: 'mcp-test-1',
      agent_id: 'agent-1',
      vote: true, // Boolean vote
      justification: 'Approved via MCP'
    });
    assert(voteResult.proposalId === 'mcp-test-1', 'Vote should be recorded');

    // Test 5.3: Direct consensus votes (bypassing collector)
    console.log('\n  Test 5.3: Direct voting via consensus engine');
    await mcp.consensus.createProposal('swarm-1', 'mcp-test-2', {
      algorithm: 'majority',
      requiredVotes: null
    });
    // Use consensus.recordVote directly (not through collector)
    await mcp.consensus.recordVote('mcp-test-2', 'agent-1', 1.0);
    await mcp.consensus.recordVote('mcp-test-2', 'agent-2', 1.0);
    await mcp.consensus.recordVote('mcp-test-2', 'agent-3', 0.0);
    const finalResult = await mcp.consensus.finalizeVoting('mcp-test-2');
    assertEquals(finalResult.decision, true, 'Should approve with majority');

    await mcp.shutdown();

    // ==================== TEST 6: EDGE CASES ====================
    console.log('\n\n🎯 Test Suite 6: Edge Cases\n');

    cleanupTestDb();
    consensus = new AutoConsensus(TEST_DB_PATH);
    await setupTestDb(consensus);
    await insertTestData(consensus);

    // Test 6.1: No votes
    console.log('\n  Test 6.1: No votes received');
    await consensus.createProposal('swarm-1', 'edge-1');
    const noVotesResult = await consensus.finalizeVoting('edge-1');
    assertEquals(noVotesResult.decision, null, 'Should return null with no votes');
    assertEquals(noVotesResult.confidence, 0, 'Confidence should be 0');

    // Test 6.2: Single vote
    console.log('\n  Test 6.2: Single vote');
    await consensus.createProposal('swarm-1', 'edge-2');
    await consensus.recordVote('edge-2', 'agent-1', 1.0);
    const singleVoteResult = await consensus.finalizeVoting('edge-2');
    assertEquals(singleVoteResult.decision, true, 'Should approve with single yes vote');
    assertEquals(singleVoteResult.confidence, 1.0, 'Confidence should be 100%');

    await consensus.close();

    // ==================== RESULTS ====================
    console.log('\n\n' + '='.repeat(50));
    console.log('\n📊 Test Results Summary\n');
    console.log(`  Total Tests: ${testCount}`);
    console.log(`  ✓ Passed: ${passCount}`);
    console.log(`  ✗ Failed: ${failCount}`);

    if (failCount === 0) {
      console.log('\n  🎉 All tests passed!\n');
      return 0;
    } else {
      console.log(`\n  ⚠️  ${failCount} test(s) failed\n`);
      return 1;
    }

  } catch (error) {
    console.error('\n❌ Test error:', error.message);
    console.error(error.stack);
    return 1;
  } finally {
    cleanupTestDb();
  }
}

// Run tests
if (require.main === module) {
  runTests()
    .then((exitCode) => {
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { runTests };
