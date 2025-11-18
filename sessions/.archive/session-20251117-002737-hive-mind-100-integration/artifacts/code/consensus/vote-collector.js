/**
 * Vote Collector
 * Asynchronously collects votes from agents via MCP tools
 */

const { EventEmitter } = require('events');

class VoteCollector extends EventEmitter {
  constructor(consensus, options = {}) {
    super();
    this.consensus = consensus;
    this.options = {
      pollInterval: 1000, // Check for votes every second
      ...options
    };
    this.activeSessions = new Map();
  }

  /**
   * Start collecting votes for a proposal
   */
  async startCollection(swarmId, proposalId, agents, options = {}) {
    const {
      algorithm = 'majority',
      timeout = 60000,
      description = '',
      autoWeighting = true,
      notifyAgents = true
    } = options;

    // Create proposal
    const proposal = await this.consensus.createProposal(swarmId, proposalId, {
      algorithm,
      timeout,
      requiredVotes: agents.length,
      description,
      metadata: { agents }
    });

    // Create collection session
    const session = {
      proposalId,
      swarmId,
      agents,
      autoWeighting,
      votesReceived: new Set(),
      startTime: Date.now(),
      timeout,
      status: 'collecting'
    };

    this.activeSessions.set(proposalId, session);

    // Notify agents if requested
    if (notifyAgents) {
      await this._notifyAgents(swarmId, proposalId, agents, description);
    }

    // Start polling for completion
    this._pollSession(proposalId);

    return {
      proposalId,
      status: 'collecting',
      agentsToVote: agents.length,
      timeout
    };
  }

  /**
   * Submit a vote from an agent
   */
  async submitVote(proposalId, agentId, vote, justification = '') {
    const session = this.activeSessions.get(proposalId);
    if (!session) {
      throw new Error(`No active voting session for proposal ${proposalId}`);
    }

    if (!session.agents.includes(agentId)) {
      throw new Error(`Agent ${agentId} is not authorized to vote on this proposal`);
    }

    // Get agent weight if auto-weighting is enabled
    let weight = 1.0;
    if (session.autoWeighting) {
      weight = await this.consensus._getAgentWeight(session.swarmId, agentId);
    }

    // Record vote
    const result = await this.consensus.recordVote(proposalId, agentId, vote, {
      weight,
      justification
    });

    // Track that this agent voted
    session.votesReceived.add(agentId);

    // Emit vote received event
    this.emit('vote-received', {
      proposalId,
      agentId,
      vote,
      weight,
      votesReceived: session.votesReceived.size,
      totalAgents: session.agents.length
    });

    // Check if all votes received
    if (session.votesReceived.size === session.agents.length) {
      await this._finalizeSession(proposalId);
    }

    return result;
  }

  /**
   * Notify agents about voting request
   */
  async _notifyAgents(swarmId, proposalId, agents, description) {
    // Store notification in messages table for each agent
    return new Promise((resolve, reject) => {
      const notifications = agents.map(agentId => {
        return new Promise((res, rej) => {
          const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          this.consensus.db.run(
            `INSERT INTO messages (id, swarm_id, sender_id, recipient_id, channel, type, content, priority)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              messageId,
              swarmId,
              'system',
              agentId,
              'voting',
              'vote-request',
              JSON.stringify({ proposalId, description }),
              5 // High priority
            ],
            (err) => {
              if (err) rej(err);
              else res(messageId);
            }
          );
        });
      });

      Promise.all(notifications)
        .then(resolve)
        .catch(reject);
    });
  }

  /**
   * Poll session for completion
   */
  _pollSession(proposalId) {
    const interval = setInterval(() => {
      const session = this.activeSessions.get(proposalId);
      if (!session) {
        clearInterval(interval);
        return;
      }

      // Check if timeout reached
      const elapsed = Date.now() - session.startTime;
      if (elapsed >= session.timeout) {
        clearInterval(interval);
        this._finalizeSession(proposalId).catch(console.error);
        return;
      }

      // Emit progress event
      this.emit('progress', {
        proposalId,
        votesReceived: session.votesReceived.size,
        totalAgents: session.agents.length,
        timeRemaining: session.timeout - elapsed,
        status: session.status
      });
    }, this.options.pollInterval);
  }

  /**
   * Finalize voting session
   */
  async _finalizeSession(proposalId) {
    const session = this.activeSessions.get(proposalId);
    if (!session || session.status === 'finalized') {
      return;
    }

    session.status = 'finalized';

    try {
      // Finalize consensus
      const result = await this.consensus.finalizeVoting(proposalId);

      // Emit completion event
      this.emit('completed', {
        proposalId,
        decision: result.decision,
        confidence: result.confidence,
        votesReceived: session.votesReceived.size,
        totalAgents: session.agents.length,
        details: result.details
      });

      // Remove session
      this.activeSessions.delete(proposalId);

      return result;
    } catch (error) {
      this.emit('error', {
        proposalId,
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Get session status
   */
  getSessionStatus(proposalId) {
    const session = this.activeSessions.get(proposalId);
    if (!session) {
      return null;
    }

    const elapsed = Date.now() - session.startTime;
    return {
      proposalId,
      status: session.status,
      votesReceived: session.votesReceived.size,
      totalAgents: session.agents.length,
      timeRemaining: Math.max(0, session.timeout - elapsed),
      percentComplete: (session.votesReceived.size / session.agents.length) * 100
    };
  }

  /**
   * Get all active sessions
   */
  getActiveSessions() {
    return Array.from(this.activeSessions.keys()).map(proposalId =>
      this.getSessionStatus(proposalId)
    );
  }

  /**
   * Cancel a voting session
   */
  async cancelSession(proposalId) {
    const session = this.activeSessions.get(proposalId);
    if (!session) {
      throw new Error(`No active session for proposal ${proposalId}`);
    }

    session.status = 'cancelled';
    this.activeSessions.delete(proposalId);

    this.emit('cancelled', { proposalId });

    return { proposalId, status: 'cancelled' };
  }
}

module.exports = VoteCollector;
