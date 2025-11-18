/**
 * Topology Selector
 *
 * Intelligent topology selection based on phase type and requirements.
 * Provides automatic topology recommendations for different coordination scenarios.
 *
 * Stock-First: Uses stock MCP topology types
 */

class TopologySelector {
  constructor(options = {}) {
    this.rules = options.rules || this._getDefaultRules();
    this.preferences = options.preferences || {};
  }

  /**
   * Get default topology selection rules
   *
   * @private
   */
  _getDefaultRules() {
    return {
      // Phase-based topology mapping
      phases: {
        planning: {
          topology: 'hierarchical',
          reason: 'Strategic planning requires low bandwidth, hierarchical decision-making'
        },
        design: {
          topology: 'mesh',
          reason: 'Collaborative design needs high bandwidth peer-to-peer communication'
        },
        implementation: {
          topology: 'mesh',
          reason: 'Parallel development benefits from peer-to-peer collaboration'
        },
        review: {
          topology: 'star',
          reason: 'Code review requires centralized quality control'
        },
        qa: {
          topology: 'star',
          reason: 'Quality assurance needs centralized test coordination'
        },
        pipeline: {
          topology: 'ring',
          reason: 'Sequential pipeline requires orderly handoffs between stages'
        },
        deployment: {
          topology: 'ring',
          reason: 'Deployment stages execute sequentially with validation gates'
        }
      },

      // Agent count thresholds
      agentCount: {
        small: { max: 3, preferred: 'star' },
        medium: { max: 8, preferred: 'mesh' },
        large: { max: 20, preferred: 'hierarchical' },
        xlarge: { max: Infinity, preferred: 'hierarchical' }
      },

      // Bandwidth requirements
      bandwidth: {
        low: 'hierarchical',
        medium: 'star',
        high: 'mesh',
        sequential: 'ring'
      },

      // Communication patterns
      patterns: {
        broadcast: 'star',
        peertopeer: 'mesh',
        hierarchical: 'hierarchical',
        sequential: 'ring'
      }
    };
  }

  /**
   * Select optimal topology for given phase and requirements
   *
   * @param {Object} requirements - Selection requirements
   * @param {string} requirements.phase - Current phase
   * @param {number} requirements.agentCount - Number of agents
   * @param {string} requirements.bandwidth - Bandwidth requirement (low, medium, high)
   * @param {string} requirements.pattern - Communication pattern
   * @returns {Object} Selection result with topology and reasoning
   */
  selectTopology(requirements = {}) {
    const { phase, agentCount = 5, bandwidth, pattern } = requirements;

    // Priority 1: Explicit phase mapping
    if (phase && this.rules.phases[phase]) {
      return {
        topology: this.rules.phases[phase].topology,
        reason: this.rules.phases[phase].reason,
        confidence: 1.0,
        source: 'phase-based'
      };
    }

    // Priority 2: Communication pattern
    if (pattern && this.rules.patterns[pattern]) {
      return {
        topology: this.rules.patterns[pattern],
        reason: `Communication pattern '${pattern}' optimally served by this topology`,
        confidence: 0.9,
        source: 'pattern-based'
      };
    }

    // Priority 3: Bandwidth requirement
    if (bandwidth && this.rules.bandwidth[bandwidth]) {
      return {
        topology: this.rules.bandwidth[bandwidth],
        reason: `Bandwidth requirement '${bandwidth}' best matched to this topology`,
        confidence: 0.8,
        source: 'bandwidth-based'
      };
    }

    // Priority 4: Agent count
    const agentTopology = this._selectByAgentCount(agentCount);
    if (agentTopology) {
      return {
        topology: agentTopology.topology,
        reason: `Agent count (${agentCount}) best served by ${agentTopology.topology}`,
        confidence: 0.7,
        source: 'agent-count-based'
      };
    }

    // Default fallback
    return {
      topology: 'mesh',
      reason: 'Default topology for general-purpose coordination',
      confidence: 0.5,
      source: 'default'
    };
  }

  /**
   * Select topology based on agent count
   *
   * @private
   */
  _selectByAgentCount(count) {
    const rules = this.rules.agentCount;

    if (count <= rules.small.max) {
      return { topology: rules.small.preferred };
    } else if (count <= rules.medium.max) {
      return { topology: rules.medium.preferred };
    } else if (count <= rules.large.max) {
      return { topology: rules.large.preferred };
    } else {
      return { topology: rules.xlarge.preferred };
    }
  }

  /**
   * Get recommended topology for phase transition
   *
   * @param {string} fromPhase - Current phase
   * @param {string} toPhase - Target phase
   * @returns {Object} Transition recommendation
   */
  getTransitionRecommendation(fromPhase, toPhase) {
    const fromSelection = this.selectTopology({ phase: fromPhase });
    const toSelection = this.selectTopology({ phase: toPhase });

    const needsSwitch = fromSelection.topology !== toSelection.topology;

    return {
      needsSwitch,
      fromTopology: fromSelection.topology,
      toTopology: toSelection.topology,
      fromPhase,
      toPhase,
      reason: toSelection.reason,
      confidence: toSelection.confidence
    };
  }

  /**
   * Get all available topologies with descriptions
   */
  getAvailableTopologies() {
    return {
      hierarchical: {
        name: 'Hierarchical',
        description: 'Tree-based structure for strategic planning with low bandwidth',
        bestFor: ['planning', 'large-teams', 'decision-making'],
        bandwidth: 'low',
        scalability: 'high'
      },
      mesh: {
        name: 'Mesh',
        description: 'Peer-to-peer network for collaborative work with high bandwidth',
        bestFor: ['design', 'implementation', 'collaboration'],
        bandwidth: 'high',
        scalability: 'medium'
      },
      star: {
        name: 'Star',
        description: 'Centralized hub for code review and quality control',
        bestFor: ['review', 'qa', 'coordination'],
        bandwidth: 'medium',
        scalability: 'medium'
      },
      ring: {
        name: 'Ring',
        description: 'Sequential pipeline for orderly stage-by-stage processing',
        bestFor: ['pipeline', 'deployment', 'workflows'],
        bandwidth: 'low-medium',
        scalability: 'medium'
      }
    };
  }

  /**
   * Validate topology selection
   *
   * @param {string} topology - Topology to validate
   * @param {Object} requirements - Requirements to validate against
   * @returns {Object} Validation result
   */
  validateSelection(topology, requirements = {}) {
    const validTopologies = ['hierarchical', 'mesh', 'star', 'ring'];

    if (!validTopologies.includes(topology)) {
      return {
        valid: false,
        error: `Invalid topology: ${topology}`,
        validTopologies
      };
    }

    const recommended = this.selectTopology(requirements);
    const isRecommended = topology === recommended.topology;

    return {
      valid: true,
      isRecommended,
      selected: topology,
      recommended: recommended.topology,
      reason: recommended.reason,
      confidence: recommended.confidence
    };
  }

  /**
   * Update selection rules
   */
  updateRules(newRules) {
    this.rules = { ...this.rules, ...newRules };
  }

  /**
   * Set user preferences
   */
  setPreferences(preferences) {
    this.preferences = { ...this.preferences, ...preferences };
  }
}

module.exports = TopologySelector;
