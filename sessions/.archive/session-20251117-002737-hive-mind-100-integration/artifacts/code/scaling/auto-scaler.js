/**
 * Auto-Scaler
 * Intelligent agent scaling based on complexity thresholds
 *
 * Stock Adherence: Uses stock coordination patterns and agent definitions
 */

const { ComplexityDetector } = require('./complexity-detector.js');

class AutoScaler {
  constructor(options = {}) {
    this.minAgents = options.minAgents || 1;
    this.maxAgents = options.maxAgents || 12;
    this.poolManager = options.poolManager;

    this.thresholds = {
      low: 30,
      medium: 70,
      high: 90,
      ...options.thresholds
    };

    this.scaleDownConfig = {
      idleTimeoutMs: 30000, // 30 seconds
      maxRemovePerCycle: 2,
      preserveMinAgents: true,
      ...options.scaleDownConfig
    };

    this.detector = new ComplexityDetector();
    this.activeAgents = [];
    this.lastScaleTime = Date.now();
  }

  /**
   * Scale agent pool based on task complexity
   * @param {Object} task - Task with complexityScore
   * @returns {Promise<Array>} Spawned/selected agents
   */
  async scaleForTask(task) {
    const score = task.complexityScore || this.detector.scoreTask(task);
    const requiredAgents = this._calculateRequiredAgents(score);

    const currentCount = this.getActiveAgentCount();

    if (requiredAgents > currentCount) {
      // Scale up
      return await this._scaleUp(requiredAgents - currentCount, task);
    } else if (requiredAgents < currentCount) {
      // Scale down
      await this._scaleDown(currentCount - requiredAgents);
      return this.getActiveAgents();
    }

    return this.getActiveAgents();
  }

  /**
   * Scale up agent pool
   * @private
   */
  async _scaleUp(count, task) {
    const newAgents = [];

    // Try to reuse idle agents first
    const idle = this.poolManager.getIdleAgents();
    const toReuse = Math.min(count, idle.length);

    for (let i = 0; i < toReuse; i++) {
      this.poolManager.markActive(idle[i].id, task);
      this.activeAgents.push(idle[i]);
      newAgents.push(idle[i]);
    }

    // Spawn new agents if needed
    const toSpawn = count - toReuse;
    const agentType = this._selectAgentType(task);

    for (let i = 0; i < toSpawn; i++) {
      if (this.poolManager.getPoolSize() < this.maxAgents) {
        const agent = await this.poolManager.spawnAgent({ type: agentType });
        this.poolManager.markActive(agent.id, task);
        this.activeAgents.push(agent);
        newAgents.push(agent);
      }
    }

    this.lastScaleTime = Date.now();
    return newAgents;
  }

  /**
   * Scale down agent pool
   * @param {Object} options - Scale down options
   * @returns {Promise<number>} Number of agents removed
   */
  async scaleDown(options = {}) {
    const {
      maxRemove = this.scaleDownConfig.maxRemovePerCycle,
      idleTimeoutMs = this.scaleDownConfig.idleTimeoutMs
    } = options;

    const idleAgents = this.getIdleAgents({ idleTimeoutMs });
    const toRemove = Math.min(maxRemove, idleAgents.length);

    // Don't go below minimum
    const currentCount = this.getActiveAgentCount();
    const canRemove = Math.max(0, currentCount - this.minAgents);
    const actualRemove = Math.min(toRemove, canRemove);

    if (actualRemove === 0) {
      return 0;
    }

    // Sort by performance (remove worst performers)
    const sorted = idleAgents
      .sort((a, b) => a.performance - b.performance)
      .slice(0, actualRemove);

    for (const agent of sorted) {
      this.activeAgents = this.activeAgents.filter(a => a.id !== agent.id);
      this.poolManager.removeAgent(agent.id);
    }

    this.lastScaleTime = Date.now();
    return actualRemove;
  }

  /**
   * Graceful scale down - remove idle agents gradually
   * @private
   */
  async _scaleDown(count) {
    const idle = this.getIdleAgents({ idleTimeoutMs: this.scaleDownConfig.idleTimeoutMs });

    // Sort by performance (keep high performers)
    const sorted = idle.sort((a, b) => a.performance - b.performance);
    const toRemove = Math.min(count, sorted.length);

    // Don't go below minimum
    const currentCount = this.getActiveAgentCount();
    const canRemove = Math.max(0, currentCount - this.minAgents);
    const actualRemove = Math.min(toRemove, canRemove);

    for (let i = 0; i < actualRemove; i++) {
      const agent = sorted[i];
      this.activeAgents = this.activeAgents.filter(a => a.id !== agent.id);
      this.poolManager.markIdle(agent.id);
    }

    return actualRemove;
  }

  /**
   * Get idle agents based on timeout
   * @param {Object} options - Filter options
   * @returns {Array} Idle agents
   */
  getIdleAgents(options = {}) {
    const { idleTimeoutMs = this.scaleDownConfig.idleTimeoutMs } = options;
    const now = Date.now();

    return this.activeAgents.filter(agent => {
      return agent.status === 'idle' &&
             (now - agent.lastActive) > idleTimeoutMs;
    });
  }

  /**
   * Get active agents
   * @returns {Array} Active agents
   */
  getActiveAgents() {
    return this.activeAgents.filter(a => a.status === 'active');
  }

  /**
   * Get active agent count
   * @returns {number} Count
   */
  getActiveAgentCount() {
    return this.activeAgents.length;
  }

  /**
   * Calculate required agents based on complexity score
   * @private
   */
  _calculateRequiredAgents(score) {
    let required;

    if (score < this.thresholds.low) {
      // Low complexity: 1-3 agents
      required = Math.max(this.minAgents, 3);
    } else if (score < 50) {
      // Low-medium: 3-4 agents
      required = 3;
    } else if (score < this.thresholds.medium) {
      // Medium: 4-6 agents
      required = Math.min(6, Math.ceil(4 + (score - 50) / 10));
    } else if (score < 85) {
      // High: 6-8 agents
      required = Math.min(8, Math.ceil(6 + (score - 70) / 7.5));
    } else {
      // Very high: 8-12 agents
      required = Math.min(this.maxAgents, Math.ceil(8 + (score - 85) / 3.75));
    }

    return Math.max(this.minAgents, Math.min(this.maxAgents, required));
  }

  /**
   * Select appropriate agent type for task
   * @private
   */
  _selectAgentType(task) {
    if (!task) return 'coder';

    const description = (task.description || '').toLowerCase();

    // Simple keyword matching for agent type selection
    if (description.includes('research') || description.includes('analyze')) {
      return 'researcher';
    }
    if (description.includes('test') || description.includes('validation')) {
      return 'tester';
    }
    if (description.includes('review') || description.includes('quality')) {
      return 'reviewer';
    }
    if (description.includes('architect') || description.includes('design')) {
      return 'architect';
    }
    if (description.includes('optimize') || description.includes('performance')) {
      return 'optimizer';
    }

    // Default to coder
    return 'coder';
  }

  /**
   * Get scaling statistics
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      activeAgents: this.getActiveAgentCount(),
      idleAgents: this.getIdleAgents().length,
      totalAgents: this.poolManager.getPoolSize(),
      maxAgents: this.maxAgents,
      minAgents: this.minAgents,
      lastScaleTime: this.lastScaleTime,
      poolUtilization: this.poolManager.getPoolSize() / this.maxAgents
    };
  }

  /**
   * Reset scaler state
   */
  reset() {
    this.activeAgents = [];
    this.lastScaleTime = Date.now();
  }
}

module.exports = { AutoScaler };
