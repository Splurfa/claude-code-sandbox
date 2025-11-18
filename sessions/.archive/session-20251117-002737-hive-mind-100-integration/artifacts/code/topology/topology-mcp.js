/**
 * Topology MCP Integration
 *
 * Integrates topology manager with stock MCP swarm coordination.
 * Provides high-level API for topology control via MCP tools.
 *
 * Stock-First: Uses stock MCP swarm_init for actual topology setup
 */

const TopologyManager = require('./topology-manager');
const CoherenceMonitor = require('./coherence-monitor');
const TopologySelector = require('./topology-selector');

class TopologyMCP {
  constructor(options = {}) {
    this.manager = new TopologyManager(options);
    this.monitor = new CoherenceMonitor(options);
    this.selector = new TopologySelector(options);

    // Set up event listeners
    this._setupEventHandlers();
  }

  /**
   * Set up coherence monitoring event handlers
   *
   * @private
   */
  _setupEventHandlers() {
    this.monitor.on('coherence-violation', (data) => {
      console.warn('⚠️  Coherence violation detected:', data);
    });

    this.monitor.on('coherence-update', (data) => {
      if (data.average < this.monitor.threshold * 1.05) {
        console.log('⚡ Coherence near threshold:', data);
      }
    });
  }

  /**
   * Initialize swarm with topology
   *
   * This wraps stock MCP swarm_init with coherence monitoring
   *
   * @param {Object} config - Swarm configuration
   * @param {string} config.topology - Topology type
   * @param {number} config.maxAgents - Maximum agents
   * @param {string} config.phase - Current phase
   * @returns {Object} Initialization result
   */
  async initializeSwarm(config = {}) {
    const { topology, maxAgents = 8, phase = 'planning' } = config;

    // Auto-select topology if not specified
    let selectedTopology = topology;
    let selectionInfo = null;

    if (!selectedTopology) {
      selectionInfo = this.selector.selectTopology({
        phase,
        agentCount: maxAgents
      });
      selectedTopology = selectionInfo.topology;
    }

    // Validate coherence before switch
    const validation = this.monitor.validateSwitch(null, selectedTopology);

    if (!validation.canSwitch) {
      return {
        success: false,
        error: 'Coherence too low for topology initialization',
        validation
      };
    }

    // Switch to topology
    const result = await this.manager.switchTopology(
      selectedTopology,
      phase,
      maxAgents
    );

    // Start monitoring
    this.monitor.startMonitoring();

    return {
      success: result.success,
      topology: selectedTopology,
      phase,
      maxAgents,
      selection: selectionInfo,
      coherence: result.coherenceAfter,
      timestamp: result.timestamp
    };
  }

  /**
   * Switch topology with automatic selection
   *
   * @param {Object} config - Switch configuration
   * @param {string} config.toPhase - Target phase
   * @param {string} config.topology - Explicit topology (optional)
   * @param {number} config.agentCount - Number of agents
   * @returns {Object} Switch result
   */
  async switchToPhase(config = {}) {
    const { toPhase, topology, agentCount = 8 } = config;

    // Auto-select topology if not specified
    let selectedTopology = topology;
    let selectionInfo = null;

    if (!selectedTopology) {
      selectionInfo = this.selector.selectTopology({
        phase: toPhase,
        agentCount
      });
      selectedTopology = selectionInfo.topology;
    }

    // Validate switch
    const validation = this.monitor.validateSwitch(
      this.manager.currentTopology?.topology,
      selectedTopology
    );

    if (!validation.canSwitch) {
      return {
        success: false,
        error: 'Coherence too low for topology switch',
        validation
      };
    }

    // Perform switch
    const result = await this.manager.switchTopology(
      selectedTopology,
      toPhase,
      agentCount
    );

    return {
      ...result,
      selection: selectionInfo,
      validation
    };
  }

  /**
   * Get current topology status
   */
  getStatus() {
    const topology = this.manager.getCurrentTopology();
    const metrics = this.manager.getTopologyMetrics();
    const coherence = this.monitor.getMetrics();

    return {
      topology,
      metrics,
      coherence,
      timestamp: Date.now()
    };
  }

  /**
   * Get topology recommendations
   *
   * @param {Object} requirements - Requirements for recommendation
   * @returns {Object} Recommendation
   */
  getRecommendation(requirements = {}) {
    return this.selector.selectTopology(requirements);
  }

  /**
   * Get phase transition recommendation
   *
   * @param {string} fromPhase - Current phase
   * @param {string} toPhase - Target phase
   * @returns {Object} Transition recommendation
   */
  getTransitionRecommendation(fromPhase, toPhase) {
    return this.selector.getTransitionRecommendation(fromPhase, toPhase);
  }

  /**
   * Validate topology coherence
   *
   * @returns {Object} Coherence validation result
   */
  validateCoherence() {
    const coherence = this.monitor.getMetrics();
    const isValid = coherence.average >= this.monitor.threshold;

    return {
      valid: isValid,
      current: coherence.current,
      average: coherence.average,
      threshold: this.monitor.threshold,
      timestamp: Date.now()
    };
  }

  /**
   * Get topology switch history
   *
   * @param {number} limit - Maximum entries to return
   * @returns {Array} Switch history
   */
  getHistory(limit = 10) {
    return this.manager.getSwitchHistory(limit);
  }

  /**
   * Get available topologies
   */
  getAvailableTopologies() {
    return this.selector.getAvailableTopologies();
  }

  /**
   * Set coherence threshold
   *
   * @param {number} threshold - New threshold (0-1)
   */
  setCoherenceThreshold(threshold) {
    this.monitor.setThreshold(threshold);
  }

  /**
   * Start coherence monitoring
   */
  startMonitoring() {
    this.monitor.startMonitoring();
  }

  /**
   * Stop coherence monitoring
   */
  stopMonitoring() {
    this.monitor.stopMonitoring();
  }

  /**
   * Clean up resources
   */
  destroy() {
    this.monitor.destroy();
    this.manager.close();
  }
}

module.exports = TopologyMCP;
