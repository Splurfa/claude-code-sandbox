/**
 * Agent Pool Manager
 * Manages agent lifecycle, performance tracking, and selection
 *
 * Stock Adherence: Uses stock agent types and integrates with .hive-mind/hive.db
 */

class AgentPoolManager {
  constructor(options = {}) {
    this.maxAgents = options.maxAgents || 12;
    this.agentTypes = options.agentTypes || [
      'researcher', 'coder', 'tester', 'reviewer', 'architect',
      'optimizer', 'coordinator', 'analyst'
    ];

    this.pool = new Map(); // agentId -> agent data
    this.metrics = new Map(); // agentId -> performance metrics
  }

  /**
   * Spawn a new agent to the pool
   * @param {Object} config - Agent configuration
   * @returns {Promise<Object>} Spawned agent
   */
  async spawnAgent(config) {
    if (this.pool.size >= this.maxAgents) {
      throw new Error(`Agent pool at maximum capacity: ${this.maxAgents}`);
    }

    const agent = {
      id: config.id || `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: config.type,
      status: 'idle',
      performance: config.performance || 0.75, // Default performance score
      spawnedAt: Date.now(),
      lastActive: Date.now(),
      tasksCompleted: 0,
      currentTask: null
    };

    this.pool.set(agent.id, agent);
    this._initializeMetrics(agent.id);

    return agent;
  }

  /**
   * Get agent by ID
   * @param {string} agentId - Agent identifier
   * @returns {Object|undefined} Agent data
   */
  getAgent(agentId) {
    return this.pool.get(agentId);
  }

  /**
   * Get all agents in pool
   * @returns {Array<Object>} All agents
   */
  getAllAgents() {
    return Array.from(this.pool.values());
  }

  /**
   * Get active agents
   * @returns {Array<Object>} Active agents
   */
  getActiveAgents() {
    return this.getAllAgents().filter(a => a.status === 'active');
  }

  /**
   * Get idle agents
   * @returns {Array<Object>} Idle agents
   */
  getIdleAgents() {
    return this.getAllAgents().filter(a => a.status === 'idle');
  }

  /**
   * Mark agent as active
   * @param {string} agentId - Agent identifier
   * @param {Object} task - Task being worked on
   */
  markActive(agentId, task = null) {
    const agent = this.pool.get(agentId);
    if (agent) {
      agent.status = 'active';
      agent.lastActive = Date.now();
      agent.currentTask = task;
    }
  }

  /**
   * Mark agent as idle
   * @param {string} agentId - Agent identifier
   */
  markIdle(agentId) {
    const agent = this.pool.get(agentId);
    if (agent) {
      agent.status = 'idle';
      agent.currentTask = null;
    }
  }

  /**
   * Select best agents based on criteria
   * @param {Object} criteria - Selection criteria
   * @returns {Array<Object>} Selected agents
   */
  selectAgents(criteria = {}) {
    const {
      count,
      type,
      preferIdle = true,
      minPerformance = 0
    } = criteria;

    let candidates = this.getAllAgents();

    // Filter by type if specified
    if (type) {
      candidates = candidates.filter(a => a.type === type);
    }

    // Filter by minimum performance
    candidates = candidates.filter(a => a.performance >= minPerformance);

    // Prefer idle agents
    if (preferIdle) {
      const idle = candidates.filter(a => a.status === 'idle');
      if (idle.length > 0) {
        candidates = idle;
      }
    }

    // Sort by performance (descending)
    candidates.sort((a, b) => b.performance - a.performance);

    // Return requested count
    if (count !== undefined) {
      return candidates.slice(0, count);
    }

    return candidates;
  }

  /**
   * Record task completion for performance tracking
   * @param {string} agentId - Agent identifier
   * @param {Object} result - Task result
   */
  recordTaskCompletion(agentId, result) {
    const agent = this.pool.get(agentId);
    const metrics = this.metrics.get(agentId);

    if (!agent || !metrics) return;

    agent.tasksCompleted++;
    metrics.totalTasks++;

    if (result.success) {
      metrics.successfulTasks++;
    } else {
      metrics.failedTasks++;
    }

    // Update duration tracking
    if (result.duration) {
      metrics.totalDuration += result.duration;
      metrics.durations.push(result.duration);
      if (metrics.durations.length > 100) {
        metrics.durations.shift(); // Keep last 100 durations
      }
    }

    // Recalculate performance score (0-1 scale)
    const successRate = metrics.successfulTasks / metrics.totalTasks;
    const avgDuration = metrics.totalDuration / metrics.totalTasks;
    const speedScore = Math.max(0, 1 - (avgDuration / 10000)); // Penalty for slow tasks

    agent.performance = (successRate * 0.7) + (speedScore * 0.3);
    agent.lastActive = Date.now();
  }

  /**
   * Get agent performance metrics
   * @param {string} agentId - Agent identifier
   * @returns {Object} Performance metrics
   */
  getAgentMetrics(agentId) {
    const metrics = this.metrics.get(agentId);
    if (!metrics) return null;

    return {
      tasksCompleted: metrics.totalTasks,
      successRate: metrics.totalTasks > 0
        ? metrics.successfulTasks / metrics.totalTasks
        : 0,
      averageDuration: metrics.totalTasks > 0
        ? metrics.totalDuration / metrics.totalTasks
        : 0,
      performance: this.pool.get(agentId)?.performance || 0
    };
  }

  /**
   * Remove underperforming agents
   * @param {Object} options - Removal options
   * @returns {Promise<Array<string>>} Removed agent IDs
   */
  async removeUnderperformers(options = {}) {
    const { threshold = 0.50 } = options;
    const removed = [];

    for (const [agentId, agent] of this.pool.entries()) {
      if (agent.performance < threshold && agent.status === 'idle') {
        this.pool.delete(agentId);
        this.metrics.delete(agentId);
        removed.push(agentId);
      }
    }

    return removed;
  }

  /**
   * Rebalance pool to match desired agent type distribution
   * @param {Object} options - Rebalancing options
   * @returns {Promise<Object>} New distribution
   */
  async rebalancePool(options = {}) {
    const { desired } = options;
    const current = this._getTypeDistribution();
    const newDistribution = { ...current };

    // Remove excess agents of over-represented types
    for (const [type, desiredCount] of Object.entries(desired)) {
      const currentCount = current[type] || 0;

      if (currentCount > desiredCount) {
        const excess = currentCount - desiredCount;
        const typeAgents = this.getAllAgents()
          .filter(a => a.type === type && a.status === 'idle')
          .sort((a, b) => a.performance - b.performance); // Remove worst performers

        for (let i = 0; i < excess && i < typeAgents.length; i++) {
          this.pool.delete(typeAgents[i].id);
          this.metrics.delete(typeAgents[i].id);
          newDistribution[type]--;
        }
      }
    }

    // Add agents for under-represented types
    for (const [type, desiredCount] of Object.entries(desired)) {
      const currentCount = newDistribution[type] || 0;

      if (currentCount < desiredCount && this.pool.size < this.maxAgents) {
        const needed = Math.min(desiredCount - currentCount, this.maxAgents - this.pool.size);

        for (let i = 0; i < needed; i++) {
          await this.spawnAgent({ type });
          newDistribution[type] = (newDistribution[type] || 0) + 1;
        }
      }
    }

    return newDistribution;
  }

  /**
   * Get current pool size
   * @returns {number} Pool size
   */
  getPoolSize() {
    return this.pool.size;
  }

  /**
   * Get active agent count
   * @returns {number} Active count
   */
  getActiveCount() {
    return this.getActiveAgents().length;
  }

  /**
   * Get idle agent count
   * @returns {number} Idle count
   */
  getIdleCount() {
    return this.getIdleAgents().length;
  }

  /**
   * Initialize performance metrics for agent
   * @private
   */
  _initializeMetrics(agentId) {
    this.metrics.set(agentId, {
      totalTasks: 0,
      successfulTasks: 0,
      failedTasks: 0,
      totalDuration: 0,
      durations: []
    });
  }

  /**
   * Get current type distribution
   * @private
   */
  _getTypeDistribution() {
    const distribution = {};

    for (const agent of this.pool.values()) {
      distribution[agent.type] = (distribution[agent.type] || 0) + 1;
    }

    return distribution;
  }

  /**
   * Remove agent from pool
   * @param {string} agentId - Agent identifier
   */
  removeAgent(agentId) {
    this.pool.delete(agentId);
    this.metrics.delete(agentId);
  }

  /**
   * Clear entire pool
   */
  clearPool() {
    this.pool.clear();
    this.metrics.clear();
  }
}

module.exports = { AgentPoolManager };
