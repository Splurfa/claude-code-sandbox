/**
 * Scaling MCP Integration
 * Connects auto-scaling system with MCP coordination layer
 *
 * Stock Adherence: Uses stock MCP patterns and memory coordination
 */

const { ComplexityDetector } = require('./complexity-detector.js');
const { AutoScaler } = require('./auto-scaler.js');
const { AgentPoolManager } = require('./agent-pool-manager.js');

class ScalingMCPIntegration {
  constructor(options = {}) {
    this.memoryNamespace = options.memoryNamespace || 'coordination/phase2/scaling';
    this.enabled = options.enabled !== false;

    // Initialize components
    this.poolManager = new AgentPoolManager({
      maxAgents: options.maxAgents || 12,
      agentTypes: options.agentTypes
    });

    this.detector = new ComplexityDetector(options.complexityOptions);

    this.scaler = new AutoScaler({
      minAgents: options.minAgents || 1,
      maxAgents: options.maxAgents || 12,
      thresholds: options.thresholds,
      poolManager: this.poolManager,
      scaleDownConfig: options.scaleDownConfig
    });

    this.config = {
      autoScaleEnabled: true,
      adaptiveThresholds: true,
      trackMetrics: true,
      ...options.config
    };
  }

  /**
   * Analyze task and scale agents accordingly
   * @param {Object} task - Task to analyze
   * @returns {Promise<Object>} Scaling result
   */
  async analyzeAndScale(task) {
    if (!this.config.autoScaleEnabled) {
      return { scaled: false, reason: 'Auto-scaling disabled' };
    }

    // 1. Detect complexity
    const complexityScore = this.detector.scoreTask(task);
    const complexityMetrics = this.detector.getComplexityMetrics(task);
    const complexityLevel = this.detector.classifyComplexity(complexityScore);

    // 2. Store complexity analysis
    await this._storeComplexityData(task.id, {
      score: complexityScore,
      metrics: complexityMetrics,
      level: complexityLevel,
      timestamp: Date.now()
    });

    // 3. Scale based on complexity
    task.complexityScore = complexityScore;
    const agents = await this.scaler.scaleForTask(task);

    // 4. Update status
    await this._updateScalingStatus({
      taskId: task.id,
      complexityScore,
      complexityLevel,
      agentsAllocated: agents.length,
      agents: agents.map(a => ({ id: a.id, type: a.type, performance: a.performance }))
    });

    return {
      scaled: true,
      complexityScore,
      complexityLevel,
      complexityMetrics,
      agents,
      agentCount: agents.length,
      recommendation: this.detector.recommendAgentCount(complexityScore, {
        minAgents: this.scaler.minAgents,
        maxAgents: this.scaler.maxAgents
      })
    };
  }

  /**
   * Trigger graceful scale-down
   * @param {Object} options - Scale-down options
   * @returns {Promise<Object>} Scale-down result
   */
  async scaleDown(options = {}) {
    const removed = await this.scaler.scaleDown(options);

    await this._updateScalingStatus({
      action: 'scale-down',
      agentsRemoved: removed,
      remainingAgents: this.scaler.getActiveAgentCount(),
      timestamp: Date.now()
    });

    return {
      success: true,
      removed,
      remaining: this.scaler.getActiveAgentCount(),
      stats: this.scaler.getStats()
    };
  }

  /**
   * Get current scaling status
   * @returns {Promise<Object>} Status
   */
  async getStatus() {
    const stats = this.scaler.getStats();
    const poolStats = {
      size: this.poolManager.getPoolSize(),
      active: this.poolManager.getActiveCount(),
      idle: this.poolManager.getIdleCount()
    };

    return {
      enabled: this.config.autoScaleEnabled,
      stats,
      pool: poolStats,
      config: this.config
    };
  }

  /**
   * Update configuration
   * @param {Object} updates - Configuration updates
   */
  async updateConfig(updates) {
    this.config = { ...this.config, ...updates };

    await this._storeMemory('config', this.config);

    return this.config;
  }

  /**
   * Get complexity analysis for task
   * @param {string} taskId - Task identifier
   * @returns {Promise<Object>} Complexity data
   */
  async getComplexityAnalysis(taskId) {
    return await this._retrieveMemory(`complexity-${taskId}`);
  }

  /**
   * Get scaling metrics
   * @param {Object} options - Metrics options
   * @returns {Promise<Object>} Metrics
   */
  async getMetrics(options = {}) {
    const { timeRange = '24h' } = options;

    // Get all agents and their metrics
    const agents = this.poolManager.getAllAgents();
    const agentMetrics = agents.map(a => ({
      id: a.id,
      type: a.type,
      performance: a.performance,
      tasksCompleted: a.tasksCompleted,
      metrics: this.poolManager.getAgentMetrics(a.id)
    }));

    // Calculate aggregate metrics
    const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
    const avgPerformance = agents.reduce((sum, a) => sum + a.performance, 0) / agents.length;

    return {
      timeRange,
      agents: agentMetrics,
      aggregate: {
        totalAgents: agents.length,
        activeAgents: this.poolManager.getActiveCount(),
        totalTasks,
        averagePerformance: avgPerformance || 0
      },
      scaling: this.scaler.getStats()
    };
  }

  /**
   * Optimize pool based on performance
   * @returns {Promise<Object>} Optimization result
   */
  async optimizePool() {
    const removed = await this.poolManager.removeUnderperformers({
      threshold: 0.50
    });

    await this._updateScalingStatus({
      action: 'optimize',
      removedUnderperformers: removed.length,
      timestamp: Date.now()
    });

    return {
      success: true,
      removed,
      remainingAgents: this.poolManager.getPoolSize()
    };
  }

  /**
   * Rebalance agent types in pool
   * @param {Object} desired - Desired distribution
   * @returns {Promise<Object>} Rebalancing result
   */
  async rebalancePool(desired) {
    const newDistribution = await this.poolManager.rebalancePool({ desired });

    await this._updateScalingStatus({
      action: 'rebalance',
      distribution: newDistribution,
      timestamp: Date.now()
    });

    return {
      success: true,
      distribution: newDistribution,
      poolSize: this.poolManager.getPoolSize()
    };
  }

  /**
   * Mark scaling phase as complete
   * @returns {Promise<void>}
   */
  async markComplete() {
    await this._storeMemory('completed', {
      timestamp: Date.now(),
      finalStats: this.scaler.getStats(),
      poolSize: this.poolManager.getPoolSize()
    });
  }

  /**
   * Store complexity data in memory
   * @private
   */
  async _storeComplexityData(taskId, data) {
    await this._storeMemory(`complexity-${taskId}`, data);
  }

  /**
   * Update scaling status in memory
   * @private
   */
  async _updateScalingStatus(status) {
    await this._storeMemory('status', {
      ...status,
      lastUpdated: Date.now()
    });
  }

  /**
   * Store data in memory (abstraction for MCP integration)
   * @private
   */
  async _storeMemory(key, value) {
    // This would integrate with MCP memory_usage tool:
    // mcp__claude-flow__memory_usage({
    //   action: "store",
    //   key: `${this.memoryNamespace}/${key}`,
    //   value: JSON.stringify(value),
    //   namespace: "coordination"
    // })

    // For now, return the data structure
    return {
      namespace: this.memoryNamespace,
      key,
      value,
      stored: true
    };
  }

  /**
   * Retrieve data from memory
   * @private
   */
  async _retrieveMemory(key) {
    // This would integrate with MCP memory_usage tool:
    // mcp__claude-flow__memory_usage({
    //   action: "retrieve",
    //   key: `${this.memoryNamespace}/${key}`,
    //   namespace: "coordination"
    // })

    // For now, return placeholder
    return {
      namespace: this.memoryNamespace,
      key,
      found: false
    };
  }
}

/**
 * Factory function to create MCP-integrated scaling system
 * @param {Object} options - Configuration options
 * @returns {ScalingMCPIntegration} Scaling system
 */
function createScalingSystem(options = {}) {
  return new ScalingMCPIntegration(options);
}

module.exports = {
  ScalingMCPIntegration,
  createScalingSystem
};
