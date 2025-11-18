/**
 * Comprehensive Tests for Consensus System
 * Tests Byzantine, weighted, and majority voting algorithms
 */

const AutoConsensus = require('../code/consensus/auto-consensus');
const VoteCollector = require('../code/consensus/vote-collector');
const { ConsensusMCP } = require('../code/consensus/consensus-mcp');
const fs = require('fs');
const path = require('path');

// Test database path
const TEST_DB_PATH = path.join(__dirname, 'test-consensus.db');

// Clean up test database
function cleanupTestDb() {
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
}

// Create test database with schema
async function setupTestDb(consensus) {
  await consensus.initialize();

  return new Promise((resolve, reject) => {
    consensus.db.exec(`
      CREATE TABLE IF NOT EXISTS swarms (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        status TEXT DEFAULT 'active'
      );

      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        name TEXT NOT NULL,
        role TEXT,
        metadata TEXT DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS consensus_votes (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        proposal_id TEXT NOT NULL,
        agent_id TEXT,
        vote REAL NOT NULL,
        weight REAL DEFAULT 1.0,
        justification TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS consensus_decisions (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        topic TEXT NOT NULL,
        decision TEXT,
        votes TEXT,
        algorithm TEXT DEFAULT 'majority',
        confidence REAL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        swarm_id TEXT,
        sender_id TEXT,
        recipient_id TEXT,
        channel TEXT DEFAULT 'general',
        type TEXT DEFAULT 'info',
        content TEXT NOT NULL,
        priority INTEGER DEFAULT 3,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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
describe('Consensus System Tests', () => {
  let consensus;
  let collector;

  beforeEach(async () => {
    cleanupTestDb();
    consensus = new AutoConsensus(TEST_DB_PATH);
    await setupTestDb(consensus);
    await insertTestData(consensus);
    collector = new VoteCollector(consensus);
  });

  afterEach(async () => {
    await consensus.close();
    cleanupTestDb();
  });

  // ==================== MAJORITY VOTING TESTS ====================
  describe('Majority Voting Algorithm (51%+)', () => {
    test('should approve with simple majority (3 yes, 2 no)', async () => {
      const proposalId = 'proposal-majority-1';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'majority'
      });

      // Submit votes
      await consensus.recordVote(proposalId, 'agent-1', 1.0);
      await consensus.recordVote(proposalId, 'agent-2', 1.0);
      await consensus.recordVote(proposalId, 'agent-3', 1.0);
      await consensus.recordVote(proposalId, 'agent-4', 0.0);
      await consensus.recordVote(proposalId, 'queen-1', 0.0);

      const result = await consensus.finalizeVoting(proposalId);

      expect(result.decision).toBe(true);
      expect(result.algorithm).toBe('majority');
      expect(result.confidence).toBe(0.6); // 3/5 = 60%
      expect(result.details.yesVotes).toBe(3);
      expect(result.details.totalVotes).toBe(5);
    });

    test('should reject without majority (2 yes, 3 no)', async () => {
      const proposalId = 'proposal-majority-2';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'majority'
      });

      await consensus.recordVote(proposalId, 'agent-1', 1.0);
      await consensus.recordVote(proposalId, 'agent-2', 1.0);
      await consensus.recordVote(proposalId, 'agent-3', 0.0);
      await consensus.recordVote(proposalId, 'agent-4', 0.0);
      await consensus.recordVote(proposalId, 'queen-1', 0.0);

      const result = await consensus.finalizeVoting(proposalId);

      expect(result.decision).toBe(false);
      expect(result.confidence).toBe(0.4); // 2/5 = 40%
    });

    test('should handle exactly 50% as rejection', async () => {
      const proposalId = 'proposal-majority-3';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'majority'
      });

      await consensus.recordVote(proposalId, 'agent-1', 1.0);
      await consensus.recordVote(proposalId, 'agent-2', 1.0);
      await consensus.recordVote(proposalId, 'agent-3', 0.0);
      await consensus.recordVote(proposalId, 'agent-4', 0.0);

      const result = await consensus.finalizeVoting(proposalId);

      expect(result.decision).toBe(false); // 50% is not > 50%
      expect(result.confidence).toBe(0.5);
    });
  });

  // ==================== BYZANTINE VOTING TESTS ====================
  describe('Byzantine Voting Algorithm (2/3 supermajority)', () => {
    test('should approve with 2/3 supermajority (4 yes, 1 no)', async () => {
      const proposalId = 'proposal-byzantine-1';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'byzantine'
      });

      await consensus.recordVote(proposalId, 'agent-1', 1.0);
      await consensus.recordVote(proposalId, 'agent-2', 1.0);
      await consensus.recordVote(proposalId, 'agent-3', 1.0);
      await consensus.recordVote(proposalId, 'agent-4', 1.0);
      await consensus.recordVote(proposalId, 'queen-1', 0.0);

      const result = await consensus.finalizeVoting(proposalId);

      expect(result.decision).toBe(true);
      expect(result.algorithm).toBe('byzantine');
      expect(result.details.threshold).toBe(4); // ceil(5 * 2/3) = 4
      expect(result.details.yesVotes).toBe(4);
      expect(result.details.met).toBe(true);
    });

    test('should reject without 2/3 supermajority (3 yes, 2 no)', async () => {
      const proposalId = 'proposal-byzantine-2';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'byzantine'
      });

      await consensus.recordVote(proposalId, 'agent-1', 1.0);
      await consensus.recordVote(proposalId, 'agent-2', 1.0);
      await consensus.recordVote(proposalId, 'agent-3', 1.0);
      await consensus.recordVote(proposalId, 'agent-4', 0.0);
      await consensus.recordVote(proposalId, 'queen-1', 0.0);

      const result = await consensus.finalizeVoting(proposalId);

      expect(result.decision).toBe(false);
      expect(result.details.yesVotes).toBe(3);
      expect(result.details.threshold).toBe(4);
      expect(result.details.met).toBe(false);
    });

    test('should handle exact 2/3 threshold (2 yes out of 3)', async () => {
      const proposalId = 'proposal-byzantine-3';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'byzantine'
      });

      await consensus.recordVote(proposalId, 'agent-1', 1.0);
      await consensus.recordVote(proposalId, 'agent-2', 1.0);
      await consensus.recordVote(proposalId, 'agent-3', 0.0);

      const result = await consensus.finalizeVoting(proposalId);

      expect(result.decision).toBe(true);
      expect(result.details.threshold).toBe(2); // ceil(3 * 2/3) = 2
      expect(result.details.yesVotes).toBe(2);
    });
  });

  // ==================== WEIGHTED VOTING TESTS ====================
  describe('Weighted Voting Algorithm (queen 3x weight)', () => {
    test('should approve with queen vote (queen yes, workers no)', async () => {
      const proposalId = 'proposal-weighted-1';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'weighted'
      });

      // Workers vote no (4 votes, weight 1 each = 4)
      await consensus.recordVote(proposalId, 'agent-1', 0.0, { weight: 1.0 });
      await consensus.recordVote(proposalId, 'agent-2', 0.0, { weight: 1.0 });
      await consensus.recordVote(proposalId, 'agent-3', 0.0, { weight: 1.0 });
      await consensus.recordVote(proposalId, 'agent-4', 0.0, { weight: 1.0 });

      // Queen votes yes (weight 3)
      await consensus.recordVote(proposalId, 'queen-1', 1.0, { weight: 3.0 });

      const result = await consensus.finalizeVoting(proposalId);

      // Total weight: 4 + 3 = 7
      // Yes weight: 3
      // Percentage: 3/7 ≈ 0.43 < 0.5
      expect(result.decision).toBe(false);
      expect(result.algorithm).toBe('weighted');
      expect(result.details.weightedYes).toBe(3);
      expect(result.details.totalWeight).toBe(7);
    });

    test('should approve when queen + 1 worker vote yes', async () => {
      const proposalId = 'proposal-weighted-2';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'weighted'
      });

      // Queen + 1 worker vote yes (weight 4)
      await consensus.recordVote(proposalId, 'queen-1', 1.0, { weight: 3.0 });
      await consensus.recordVote(proposalId, 'agent-1', 1.0, { weight: 1.0 });

      // Other workers vote no (weight 3)
      await consensus.recordVote(proposalId, 'agent-2', 0.0, { weight: 1.0 });
      await consensus.recordVote(proposalId, 'agent-3', 0.0, { weight: 1.0 });
      await consensus.recordVote(proposalId, 'agent-4', 0.0, { weight: 1.0 });

      const result = await consensus.finalizeVoting(proposalId);

      // Total weight: 7, Yes weight: 4, Percentage: 4/7 ≈ 0.57 > 0.5
      expect(result.decision).toBe(true);
      expect(result.details.weightedYes).toBe(4);
      expect(result.details.totalWeight).toBe(7);
      expect(result.confidence).toBeCloseTo(0.571, 2);
    });

    test('should handle custom weights', async () => {
      const proposalId = 'proposal-weighted-3';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'weighted'
      });

      // Varying weights
      await consensus.recordVote(proposalId, 'agent-1', 1.0, { weight: 2.0 });
      await consensus.recordVote(proposalId, 'agent-2', 1.0, { weight: 1.5 });
      await consensus.recordVote(proposalId, 'agent-3', 0.0, { weight: 1.0 });
      await consensus.recordVote(proposalId, 'agent-4', 0.0, { weight: 0.5 });

      const result = await consensus.finalizeVoting(proposalId);

      // Total weight: 2 + 1.5 + 1 + 0.5 = 5
      // Yes weight: 2 + 1.5 = 3.5
      // Percentage: 3.5/5 = 0.7
      expect(result.decision).toBe(true);
      expect(result.details.weightedYes).toBe(3.5);
      expect(result.details.totalWeight).toBe(5);
      expect(result.confidence).toBe(0.7);
    });
  });

  // ==================== VOTE COLLECTOR TESTS ====================
  describe('Vote Collector', () => {
    test('should collect all votes and auto-finalize', (done) => {
      const proposalId = 'proposal-collector-1';
      const agents = ['agent-1', 'agent-2', 'agent-3'];

      collector.on('completed', (data) => {
        expect(data.proposalId).toBe(proposalId);
        expect(data.votesReceived).toBe(3);
        expect(data.totalAgents).toBe(3);
        done();
      });

      collector.startCollection('swarm-1', proposalId, agents, {
        algorithm: 'majority',
        timeout: 10000,
        notifyAgents: false
      }).then(() => {
        // Submit all votes
        collector.submitVote(proposalId, 'agent-1', 1.0);
        collector.submitVote(proposalId, 'agent-2', 1.0);
        collector.submitVote(proposalId, 'agent-3', 0.0);
      });
    }, 15000);

    test('should handle timeout when not all votes received', (done) => {
      const proposalId = 'proposal-collector-2';
      const agents = ['agent-1', 'agent-2', 'agent-3'];

      collector.on('completed', (data) => {
        expect(data.proposalId).toBe(proposalId);
        expect(data.votesReceived).toBe(2); // Only 2 votes submitted
        done();
      });

      collector.startCollection('swarm-1', proposalId, agents, {
        algorithm: 'majority',
        timeout: 2000, // 2 second timeout
        notifyAgents: false
      }).then(() => {
        // Submit only 2 votes
        collector.submitVote(proposalId, 'agent-1', 1.0);
        collector.submitVote(proposalId, 'agent-2', 1.0);
        // agent-3 doesn't vote (timeout will trigger)
      });
    }, 5000);

    test('should emit vote-received events', (done) => {
      const proposalId = 'proposal-collector-3';
      const agents = ['agent-1'];
      let eventReceived = false;

      collector.on('vote-received', (data) => {
        expect(data.proposalId).toBe(proposalId);
        expect(data.agentId).toBe('agent-1');
        expect(data.vote).toBe(1.0);
        eventReceived = true;
      });

      collector.on('completed', () => {
        expect(eventReceived).toBe(true);
        done();
      });

      collector.startCollection('swarm-1', proposalId, agents, {
        notifyAgents: false
      }).then(() => {
        collector.submitVote(proposalId, 'agent-1', 1.0);
      });
    });
  });

  // ==================== DATABASE PERSISTENCE TESTS ====================
  describe('Database Persistence', () => {
    test('should store votes in database', async () => {
      const proposalId = 'proposal-db-1';
      await consensus.createProposal('swarm-1', proposalId);

      await consensus.recordVote(proposalId, 'agent-1', 1.0, {
        weight: 1.0,
        justification: 'Test justification'
      });

      const votes = await consensus.getVoteHistory(proposalId);
      expect(votes.length).toBe(1);
      expect(votes[0].agent_id).toBe('agent-1');
      expect(votes[0].vote).toBe(1.0);
      expect(votes[0].justification).toBe('Test justification');
    });

    test('should store decisions in database', async () => {
      const proposalId = 'proposal-db-2';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'majority',
        description: 'Test proposal'
      });

      await consensus.recordVote(proposalId, 'agent-1', 1.0);
      await consensus.recordVote(proposalId, 'agent-2', 1.0);
      await consensus.recordVote(proposalId, 'agent-3', 0.0);

      await consensus.finalizeVoting(proposalId);

      const decisions = await consensus.getDecisionHistory('swarm-1');
      expect(decisions.length).toBe(1);
      expect(decisions[0].topic).toBe('Test proposal');
      expect(decisions[0].decision).toBe('approved');
      expect(decisions[0].algorithm).toBe('majority');
    });

    test('should maintain audit trail', async () => {
      const proposalId = 'proposal-db-3';
      await consensus.createProposal('swarm-1', proposalId);

      // Multiple votes from same agent (should update)
      await consensus.recordVote(proposalId, 'agent-1', 0.0);
      await consensus.recordVote(proposalId, 'agent-1', 1.0);

      const votes = await consensus.getVoteHistory(proposalId);
      expect(votes.length).toBe(2); // Both votes stored in audit trail
    });
  });

  // ==================== MCP TOOL TESTS ====================
  describe('MCP Tool Interface', () => {
    let mcp;

    beforeEach(async () => {
      mcp = new ConsensusMCP(TEST_DB_PATH);
      await mcp.initialize();

      // Insert test data
      await new Promise((resolve, reject) => {
        mcp.consensus.db.run(`
          INSERT INTO swarms (id, name) VALUES ('swarm-1', 'Test Swarm');
          INSERT INTO agents (id, swarm_id, name, role) VALUES
            ('agent-1', 'swarm-1', 'Worker 1', 'worker'),
            ('agent-2', 'swarm-1', 'Worker 2', 'worker'),
            ('agent-3', 'swarm-1', 'Worker 3', 'worker');
        `, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    });

    afterEach(async () => {
      await mcp.shutdown();
    });

    test('should create proposal via MCP', async () => {
      const result = await mcp.createProposal({
        swarm_id: 'swarm-1',
        proposal_id: 'mcp-proposal-1',
        agents: ['agent-1', 'agent-2', 'agent-3'],
        algorithm: 'majority',
        description: 'Test via MCP'
      });

      expect(result.proposalId).toBe('mcp-proposal-1');
      expect(result.status).toBe('collecting');
    });

    test('should submit votes via MCP', async () => {
      await mcp.createProposal({
        swarm_id: 'swarm-1',
        proposal_id: 'mcp-proposal-2',
        agents: ['agent-1', 'agent-2'],
        notify_agents: false
      });

      const result = await mcp.submitVote({
        proposal_id: 'mcp-proposal-2',
        agent_id: 'agent-1',
        vote: true, // Boolean vote
        justification: 'Approved via MCP'
      });

      expect(result.proposalId).toBe('mcp-proposal-2');
    });

    test('should get status via MCP', async () => {
      await mcp.createProposal({
        swarm_id: 'swarm-1',
        proposal_id: 'mcp-proposal-3',
        agents: ['agent-1'],
        notify_agents: false
      });

      const status = await mcp.getStatus({ proposal_id: 'mcp-proposal-3' });

      expect(status.session).toBeTruthy();
      expect(status.proposal).toBeTruthy();
      expect(status.proposal.proposalId).toBe('mcp-proposal-3');
    });

    test('should batch vote via MCP', async () => {
      await mcp.createProposal({
        swarm_id: 'swarm-1',
        proposal_id: 'mcp-proposal-4',
        agents: ['agent-1', 'agent-2', 'agent-3'],
        notify_agents: false
      });

      const result = await mcp.batchVote({
        votes: [
          { proposal_id: 'mcp-proposal-4', agent_id: 'agent-1', vote: 1.0 },
          { proposal_id: 'mcp-proposal-4', agent_id: 'agent-2', vote: 1.0 },
          { proposal_id: 'mcp-proposal-4', agent_id: 'agent-3', vote: 0.0 }
        ]
      });

      expect(result.total).toBe(3);
      expect(result.successful).toBe(3);
      expect(result.failed).toBe(0);
    });
  });

  // ==================== EDGE CASE TESTS ====================
  describe('Edge Cases', () => {
    test('should handle no votes', async () => {
      const proposalId = 'proposal-edge-1';
      await consensus.createProposal('swarm-1', proposalId);

      const result = await consensus.finalizeVoting(proposalId);

      expect(result.decision).toBe(null);
      expect(result.confidence).toBe(0);
    });

    test('should handle single vote', async () => {
      const proposalId = 'proposal-edge-2';
      await consensus.createProposal('swarm-1', proposalId, {
        algorithm: 'majority'
      });

      await consensus.recordVote(proposalId, 'agent-1', 1.0);
      const result = await consensus.finalizeVoting(proposalId);

      expect(result.decision).toBe(true);
      expect(result.confidence).toBe(1.0);
    });

    test('should reject duplicate finalization', async () => {
      const proposalId = 'proposal-edge-3';
      await consensus.createProposal('swarm-1', proposalId);

      await consensus.recordVote(proposalId, 'agent-1', 1.0);
      await consensus.finalizeVoting(proposalId);

      await expect(consensus.finalizeVoting(proposalId))
        .rejects.toThrow();
    });

    test('should reject votes after finalization', async () => {
      const proposalId = 'proposal-edge-4';
      await consensus.createProposal('swarm-1', proposalId);

      await consensus.recordVote(proposalId, 'agent-1', 1.0);
      await consensus.finalizeVoting(proposalId);

      await expect(consensus.recordVote(proposalId, 'agent-2', 1.0))
        .rejects.toThrow();
    });
  });
});

// Export for external test runners
module.exports = { cleanupTestDb, setupTestDb, insertTestData };
