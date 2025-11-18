/**
 * Agent Watchdog System
 *
 * Monitors agent health and automatically replaces failed agents
 * Maintains swarm operational capacity
 */

const EventEmitter = require('events');

class AgentWatchdog extends EventEmitter {
  constructor(options = {}) {
    super();
    this.checkInterval = options.checkInterval || 5000; // 5s
    this.heartbeatTimeout = options.heartbeatTimeout || 15000; // 15s
    this.maxRestartAttempts = options.maxRestartAttempts || 3;
    this.agents = new Map();
    this.watchdogTimer = null;
    this.failureHistory = [];
  }

  /**
   * Start monitoring agents
   */
  start() {
    if (this.watchdogTimer) {
      return; // Already running
    }

    this.watchdogTimer = setInterval(() => {
      this.checkAgentHealth();
    }, this.checkInterval);

    this.emit('watchdog:started');
  }

  /**
   * Stop monitoring
   */
  stop() {
    if (this.watchdogTimer) {
      clearInterval(this.watchdogTimer);
      this.watchdogTimer = null;
    }
    this.emit('watchdog:stopped');
  }

  /**
   * Register agent for monitoring
   */
  registerAgent(agentId, agentInfo) {
    this.agents.set(agentId, {
      id: agentId,
      type: agentInfo.type,
      capabilities: agentInfo.capabilities || [],
      status: 'healthy',
      lastHeartbeat: Date.now(),
      restartAttempts: 0,
      createdAt: Date.now(),
      totalFailures: 0
    });

    this.emit('agent:registered', { agentId, type: agentInfo.type });
  }

  /**
   * Unregister agent
   */
  unregisterAgent(agentId) {
    const agent = this.agents.get(agentId);
    if (agent) {
      this.agents.delete(agentId);
      this.emit('agent:unregistered', { agentId });
    }
  }

  /**
   * Record agent heartbeat
   */
  heartbeat(agentId) {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.lastHeartbeat = Date.now();
      agent.status = 'healthy';
      this.emit('agent:heartbeat', { agentId });
    }
  }

  /**
   * Check health of all agents
   */
  async checkAgentHealth() {
    const now = Date.now();
    const failedAgents = [];

    for (const [agentId, agent] of this.agents) {
      const timeSinceHeartbeat = now - agent.lastHeartbeat;

      if (timeSinceHeartbeat > this.heartbeatTimeout) {
        // Agent is unresponsive
        agent.status = 'failed';
        failedAgents.push(agent);

        this.emit('agent:failed', {
          agentId,
          timeSinceHeartbeat,
          type: agent.type
        });

        // Attempt recovery
        await this.recoverAgent(agent);
      }
    }

    if (failedAgents.length > 0) {
      this.emit('watchdog:check-failed', {
        failedCount: failedAgents.length,
        agents: failedAgents.map(a => a.id)
      });
    }
  }

  /**
   * Recover failed agent
   */
  async recoverAgent(agent) {
    agent.totalFailures++;
    agent.restartAttempts++;

    this.failureHistory.push({
      timestamp: Date.now(),
      agentId: agent.id,
      type: agent.type,
      attempt: agent.restartAttempts
    });

    if (agent.restartAttempts > this.maxRestartAttempts) {
      // Max attempts reached - replace agent
      this.emit('agent:max-restarts', {
        agentId: agent.id,
        attempts: agent.restartAttempts
      });

      await this.replaceAgent(agent);
      return;
    }

    // Attempt restart
    this.emit('agent:restarting', {
      agentId: agent.id,
      attempt: agent.restartAttempts
    });

    // Reset heartbeat timer
    agent.lastHeartbeat = Date.now();
    agent.status = 'restarting';
  }

  /**
   * Replace failed agent with new one
   */
  async replaceAgent(failedAgent) {
    const newAgentId = `${failedAgent.type}-${Date.now()}`;

    // Create new agent with same capabilities
    const newAgent = {
      id: newAgentId,
      type: failedAgent.type,
      capabilities: failedAgent.capabilities,
      status: 'healthy',
      lastHeartbeat: Date.now(),
      restartAttempts: 0,
      createdAt: Date.now(),
      totalFailures: 0,
      replacedAgent: failedAgent.id
    };

    // Remove failed agent
    this.agents.delete(failedAgent.id);

    // Register new agent
    this.agents.set(newAgentId, newAgent);

    this.emit('agent:replaced', {
      oldAgentId: failedAgent.id,
      newAgentId,
      type: failedAgent.type
    });

    return newAgent;
  }

  /**
   * Get agent status
   */
  getAgentStatus(agentId) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return null;
    }

    const now = Date.now();
    return {
      id: agent.id,
      type: agent.type,
      status: agent.status,
      uptime: now - agent.createdAt,
      timeSinceHeartbeat: now - agent.lastHeartbeat,
      restartAttempts: agent.restartAttempts,
      totalFailures: agent.totalFailures,
      isHealthy: now - agent.lastHeartbeat < this.heartbeatTimeout
    };
  }

  /**
   * Get all agent statuses
   */
  getAllStatuses() {
    const statuses = [];
    for (const agentId of this.agents.keys()) {
      statuses.push(this.getAgentStatus(agentId));
    }
    return statuses;
  }

  /**
   * Get healthy agents
   */
  getHealthyAgents() {
    const now = Date.now();
    return Array.from(this.agents.values()).filter(agent => {
      return now - agent.lastHeartbeat < this.heartbeatTimeout;
    });
  }

  /**
   * Get failed agents
   */
  getFailedAgents() {
    const now = Date.now();
    return Array.from(this.agents.values()).filter(agent => {
      return now - agent.lastHeartbeat >= this.heartbeatTimeout;
    });
  }

  /**
   * Get failure statistics
   */
  getFailureStats() {
    const recentFailures = this.failureHistory.filter(f => {
      return Date.now() - f.timestamp < 3600000; // Last hour
    });

    const failuresByType = {};
    for (const failure of recentFailures) {
      failuresByType[failure.type] = (failuresByType[failure.type] || 0) + 1;
    }

    return {
      totalFailures: this.failureHistory.length,
      recentFailures: recentFailures.length,
      failuresByType,
      averageRestarts: this.calculateAverageRestarts()
    };
  }

  /**
   * Calculate average restart attempts
   */
  calculateAverageRestarts() {
    if (this.agents.size === 0) return 0;

    let total = 0;
    for (const agent of this.agents.values()) {
      total += agent.restartAttempts;
    }

    return total / this.agents.size;
  }

  /**
   * Get watchdog status
   */
  getStatus() {
    return {
      running: this.watchdogTimer !== null,
      totalAgents: this.agents.size,
      healthyAgents: this.getHealthyAgents().length,
      failedAgents: this.getFailedAgents().length,
      checkInterval: this.checkInterval,
      heartbeatTimeout: this.heartbeatTimeout,
      failureStats: this.getFailureStats()
    };
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stop();
    this.agents.clear();
    this.failureHistory = [];
    this.removeAllListeners();
  }
}

module.exports = AgentWatchdog;
