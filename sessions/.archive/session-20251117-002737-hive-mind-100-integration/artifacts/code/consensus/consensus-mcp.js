/**
 * Consensus MCP Tool Wrapper
 * Provides MCP tool interface for automated consensus voting
 */

const AutoConsensus = require('./auto-consensus');
const VoteCollector = require('./vote-collector');

class ConsensusMCP {
  constructor(dbPath = '.hive-mind/hive.db') {
    this.consensus = new AutoConsensus(dbPath);
    this.collector = null;
    this.initialized = false;
  }

  /**
   * Initialize the consensus system
   */
  async initialize() {
    if (this.initialized) return;

    await this.consensus.initialize();
    this.collector = new VoteCollector(this.consensus);

    // Set up event listeners
    this.collector.on('vote-received', (data) => {
      console.log(`[Consensus] Vote received: ${data.agentId} on ${data.proposalId}`);
    });

    this.collector.on('completed', (data) => {
      console.log(`[Consensus] Voting completed: ${data.proposalId} - Decision: ${data.decision}`);
    });

    this.collector.on('error', (data) => {
      console.error(`[Consensus] Error on ${data.proposalId}: ${data.error}`);
    });

    this.initialized = true;
  }

  /**
   * Create a new voting proposal
   * MCP Tool: consensus_create_proposal
   */
  async createProposal(params) {
    await this.initialize();

    const {
      swarm_id,
      proposal_id,
      agents,
      algorithm = 'majority',
      timeout = 60000,
      description = '',
      notify_agents = true
    } = params;

    if (!swarm_id || !proposal_id || !agents || !Array.isArray(agents)) {
      throw new Error('Missing required parameters: swarm_id, proposal_id, agents');
    }

    return this.collector.startCollection(swarm_id, proposal_id, agents, {
      algorithm,
      timeout,
      description,
      autoWeighting: true,
      notifyAgents: notify_agents
    });
  }

  /**
   * Submit a vote
   * MCP Tool: consensus_submit_vote
   */
  async submitVote(params) {
    await this.initialize();

    const {
      proposal_id,
      agent_id,
      vote,
      justification = ''
    } = params;

    if (!proposal_id || !agent_id || vote === undefined) {
      throw new Error('Missing required parameters: proposal_id, agent_id, vote');
    }

    // Normalize vote to 0-1 range
    const normalizedVote = typeof vote === 'boolean' ? (vote ? 1.0 : 0.0) : vote;

    if (normalizedVote < 0 || normalizedVote > 1) {
      throw new Error('Vote must be between 0 and 1, or boolean');
    }

    return this.collector.submitVote(proposal_id, agent_id, normalizedVote, justification);
  }

  /**
   * Get proposal status
   * MCP Tool: consensus_get_status
   */
  async getStatus(params) {
    await this.initialize();

    const { proposal_id } = params;

    if (!proposal_id) {
      // Return all active proposals
      return {
        active_sessions: this.collector.getActiveSessions(),
        active_proposals: this.consensus.getActiveProposals()
      };
    }

    // Get specific proposal status
    const sessionStatus = this.collector.getSessionStatus(proposal_id);
    const proposalStatus = this.consensus.getProposalStatus(proposal_id);

    return {
      session: sessionStatus,
      proposal: proposalStatus
    };
  }

  /**
   * Finalize voting manually
   * MCP Tool: consensus_finalize
   */
  async finalize(params) {
    await this.initialize();

    const { proposal_id } = params;

    if (!proposal_id) {
      throw new Error('Missing required parameter: proposal_id');
    }

    return this.consensus.finalizeVoting(proposal_id);
  }

  /**
   * Get vote history
   * MCP Tool: consensus_get_history
   */
  async getHistory(params) {
    await this.initialize();

    const { proposal_id, swarm_id, limit = 50 } = params;

    if (proposal_id) {
      // Get vote history for specific proposal
      return {
        proposal_id,
        votes: await this.consensus.getVoteHistory(proposal_id)
      };
    } else if (swarm_id) {
      // Get decision history for swarm
      return {
        swarm_id,
        decisions: await this.consensus.getDecisionHistory(swarm_id, limit)
      };
    } else {
      throw new Error('Must provide either proposal_id or swarm_id');
    }
  }

  /**
   * Cancel a voting session
   * MCP Tool: consensus_cancel
   */
  async cancel(params) {
    await this.initialize();

    const { proposal_id } = params;

    if (!proposal_id) {
      throw new Error('Missing required parameter: proposal_id');
    }

    return this.collector.cancelSession(proposal_id);
  }

  /**
   * Batch vote submission
   * MCP Tool: consensus_batch_vote
   */
  async batchVote(params) {
    await this.initialize();

    const { votes } = params;

    if (!votes || !Array.isArray(votes)) {
      throw new Error('Missing required parameter: votes (array)');
    }

    const results = await Promise.allSettled(
      votes.map(v => this.submitVote(v))
    );

    return {
      total: votes.length,
      successful: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      results: results.map((r, i) => ({
        vote: votes[i],
        status: r.status,
        result: r.status === 'fulfilled' ? r.value : r.reason.message
      }))
    };
  }

  /**
   * Get consensus statistics
   * MCP Tool: consensus_get_stats
   */
  async getStats(params) {
    await this.initialize();

    const { swarm_id } = params;

    if (!swarm_id) {
      throw new Error('Missing required parameter: swarm_id');
    }

    return new Promise((resolve, reject) => {
      this.consensus.db.all(
        `SELECT
          algorithm,
          COUNT(*) as total_decisions,
          AVG(confidence) as avg_confidence,
          SUM(CASE WHEN decision = 'approved' THEN 1 ELSE 0 END) as approved_count,
          SUM(CASE WHEN decision = 'rejected' THEN 1 ELSE 0 END) as rejected_count
         FROM consensus_decisions
         WHERE swarm_id = ?
         GROUP BY algorithm`,
        [swarm_id],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            // Get vote count
            this.consensus.db.get(
              `SELECT COUNT(*) as total_votes FROM consensus_votes WHERE swarm_id = ?`,
              [swarm_id],
              (err2, voteRow) => {
                if (err2) {
                  reject(err2);
                } else {
                  resolve({
                    swarm_id,
                    total_votes: voteRow.total_votes,
                    algorithms: rows,
                    active_proposals: this.consensus.getActiveProposals().filter(
                      p => p.swarmId === swarm_id
                    ).length
                  });
                }
              }
            );
          }
        }
      );
    });
  }

  /**
   * Shutdown the consensus system
   */
  async shutdown() {
    if (this.initialized) {
      await this.consensus.close();
      this.initialized = false;
    }
  }
}

// Export singleton instance
let instance = null;

module.exports = {
  ConsensusMCP,
  getInstance: (dbPath) => {
    if (!instance) {
      instance = new ConsensusMCP(dbPath);
    }
    return instance;
  }
};
