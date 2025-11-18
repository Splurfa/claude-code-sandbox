/**
 * Automated Consensus System
 * Implements Byzantine, weighted, and majority voting algorithms
 * with full audit trail and timeout handling
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class AutoConsensus {
  constructor(dbPath = '.hive-mind/hive.db') {
    this.dbPath = path.resolve(dbPath);
    this.db = null;
    this.activeProposals = new Map();
  }

  /**
   * Initialize database connection
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Close database connection
   */
  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(err);
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Create a new voting proposal
   */
  async createProposal(swarmId, proposalId, options = {}) {
    const {
      algorithm = 'majority',
      timeout = 60000, // 60 seconds default
      requiredVotes = null,
      description = '',
      metadata = {}
    } = options;

    const proposal = {
      id: proposalId,
      swarmId,
      algorithm,
      timeout,
      requiredVotes,
      description,
      metadata,
      votes: [],
      status: 'active',
      createdAt: Date.now(),
      expiresAt: Date.now() + timeout
    };

    this.activeProposals.set(proposalId, proposal);

    // Set timeout to auto-finalize
    setTimeout(() => {
      if (this.activeProposals.has(proposalId)) {
        this.finalizeVoting(proposalId).catch(console.error);
      }
    }, timeout);

    return proposal;
  }

  /**
   * Record a vote from an agent
   */
  async recordVote(proposalId, agentId, vote, options = {}) {
    const proposal = this.activeProposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found or already finalized`);
    }

    if (proposal.status !== 'active') {
      throw new Error(`Proposal ${proposalId} is not active`);
    }

    const { weight = 1.0, justification = '' } = options;

    // Check if agent already voted
    const existingVoteIndex = proposal.votes.findIndex(v => v.agentId === agentId);
    if (existingVoteIndex !== -1) {
      // Update existing vote
      proposal.votes[existingVoteIndex] = {
        agentId,
        vote,
        weight,
        justification,
        timestamp: Date.now()
      };
    } else {
      // Add new vote
      proposal.votes.push({
        agentId,
        vote,
        weight,
        justification,
        timestamp: Date.now()
      });
    }

    // Store vote in database
    await this._storeVote(proposal.swarmId, proposalId, agentId, vote, weight, justification);

    // Check if we have enough votes to finalize
    if (proposal.requiredVotes && proposal.votes.length >= proposal.requiredVotes) {
      return this.finalizeVoting(proposalId);
    }

    return {
      proposalId,
      votesReceived: proposal.votes.length,
      requiredVotes: proposal.requiredVotes,
      status: 'pending'
    };
  }

  /**
   * Get agent weight based on role
   */
  async _getAgentWeight(swarmId, agentId) {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT role, metadata FROM agents WHERE id = ? AND swarm_id = ?`,
        [agentId, swarmId],
        (err, row) => {
          if (err) {
            reject(err);
          } else if (!row) {
            resolve(1.0); // Default weight
          } else {
            // Queens get 3x weight
            if (row.role === 'queen') {
              resolve(3.0);
            } else {
              // Check for custom weight in metadata
              try {
                const metadata = JSON.parse(row.metadata || '{}');
                resolve(metadata.voteWeight || 1.0);
              } catch {
                resolve(1.0);
              }
            }
          }
        }
      );
    });
  }

  /**
   * Store vote in database
   */
  async _storeVote(swarmId, proposalId, agentId, vote, weight, justification) {
    return new Promise((resolve, reject) => {
      const voteId = `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.db.run(
        `INSERT INTO consensus_votes (id, swarm_id, proposal_id, agent_id, vote, weight, justification)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [voteId, swarmId, proposalId, agentId, vote, weight, justification],
        (err) => {
          if (err) reject(err);
          else resolve(voteId);
        }
      );
    });
  }

  /**
   * Calculate consensus using Byzantine algorithm (2/3 supermajority)
   */
  _calculateByzantine(votes) {
    if (votes.length === 0) {
      return { decision: null, confidence: 0, details: 'No votes received' };
    }

    // Count yes/no votes
    const yesVotes = votes.filter(v => v.vote > 0.5).length;
    const totalVotes = votes.length;
    const threshold = Math.ceil(totalVotes * 2 / 3);

    const decision = yesVotes >= threshold;
    const confidence = yesVotes / totalVotes;

    return {
      decision,
      confidence,
      details: {
        yesVotes,
        totalVotes,
        threshold,
        required: '2/3 supermajority',
        met: yesVotes >= threshold
      }
    };
  }

  /**
   * Calculate consensus using weighted voting (queen 3x weight)
   */
  _calculateWeighted(votes) {
    if (votes.length === 0) {
      return { decision: null, confidence: 0, details: 'No votes received' };
    }

    // Calculate weighted sum
    let weightedYes = 0;
    let totalWeight = 0;

    for (const vote of votes) {
      const weight = vote.weight || 1.0;
      totalWeight += weight;
      if (vote.vote > 0.5) {
        weightedYes += weight;
      }
    }

    const weightedPercentage = totalWeight > 0 ? weightedYes / totalWeight : 0;
    const decision = weightedPercentage > 0.5;

    return {
      decision,
      confidence: weightedPercentage,
      details: {
        weightedYes,
        totalWeight,
        weightedPercentage,
        threshold: '50% of weighted votes',
        met: decision
      }
    };
  }

  /**
   * Calculate consensus using simple majority (51%+)
   */
  _calculateMajority(votes) {
    if (votes.length === 0) {
      return { decision: null, confidence: 0, details: 'No votes received' };
    }

    // Count yes votes
    const yesVotes = votes.filter(v => v.vote > 0.5).length;
    const totalVotes = votes.length;
    const percentage = yesVotes / totalVotes;
    const decision = percentage > 0.5;

    return {
      decision,
      confidence: percentage,
      details: {
        yesVotes,
        totalVotes,
        percentage,
        threshold: '51% majority',
        met: decision
      }
    };
  }

  /**
   * Finalize voting and calculate consensus
   */
  async finalizeVoting(proposalId) {
    const proposal = this.activeProposals.get(proposalId);
    if (!proposal) {
      throw new Error(`Proposal ${proposalId} not found`);
    }

    proposal.status = 'finalized';

    let result;
    switch (proposal.algorithm) {
      case 'byzantine':
        result = this._calculateByzantine(proposal.votes);
        break;
      case 'weighted':
        result = this._calculateWeighted(proposal.votes);
        break;
      case 'majority':
      default:
        result = this._calculateMajority(proposal.votes);
        break;
    }

    // Store decision in database
    await this._storeDecision(
      proposal.swarmId,
      proposalId,
      proposal.description,
      result.decision,
      proposal.votes,
      proposal.algorithm,
      result.confidence
    );

    // Remove from active proposals
    this.activeProposals.delete(proposalId);

    return {
      proposalId,
      algorithm: proposal.algorithm,
      decision: result.decision,
      confidence: result.confidence,
      details: result.details,
      votesCount: proposal.votes.length,
      finalizedAt: Date.now()
    };
  }

  /**
   * Store consensus decision in database
   */
  async _storeDecision(swarmId, proposalId, topic, decision, votes, algorithm, confidence) {
    return new Promise((resolve, reject) => {
      const decisionId = `decision-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.db.run(
        `INSERT INTO consensus_decisions (id, swarm_id, topic, decision, votes, algorithm, confidence)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          decisionId,
          swarmId,
          topic,
          decision ? 'approved' : 'rejected',
          JSON.stringify(votes),
          algorithm,
          confidence
        ],
        (err) => {
          if (err) reject(err);
          else resolve(decisionId);
        }
      );
    });
  }

  /**
   * Get voting status
   */
  getProposalStatus(proposalId) {
    const proposal = this.activeProposals.get(proposalId);
    if (!proposal) {
      return null;
    }

    return {
      proposalId,
      status: proposal.status,
      algorithm: proposal.algorithm,
      votesReceived: proposal.votes.length,
      requiredVotes: proposal.requiredVotes,
      timeRemaining: Math.max(0, proposal.expiresAt - Date.now()),
      createdAt: proposal.createdAt
    };
  }

  /**
   * Get all active proposals
   */
  getActiveProposals() {
    return Array.from(this.activeProposals.values()).map(p => ({
      id: p.id,
      swarmId: p.swarmId,
      algorithm: p.algorithm,
      status: p.status,
      votesCount: p.votes.length,
      timeRemaining: Math.max(0, p.expiresAt - Date.now())
    }));
  }

  /**
   * Get vote history for a proposal from database
   */
  async getVoteHistory(proposalId) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM consensus_votes WHERE proposal_id = ? ORDER BY timestamp DESC`,
        [proposalId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  /**
   * Get decision history for a swarm
   */
  async getDecisionHistory(swarmId, limit = 50) {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM consensus_decisions WHERE swarm_id = ? ORDER BY created_at DESC LIMIT ?`,
        [swarmId, limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }
}

module.exports = AutoConsensus;
