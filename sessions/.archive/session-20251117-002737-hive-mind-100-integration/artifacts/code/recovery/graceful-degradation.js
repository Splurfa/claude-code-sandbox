/**
 * Graceful Degradation System
 *
 * Falls back to simpler coordination when complex systems fail
 * Maintains service availability under failure conditions
 */

const EventEmitter = require('events');

class GracefulDegradation extends EventEmitter {
  constructor(options = {}) {
    super();
    this.degradationLevels = options.degradationLevels || this.getDefaultLevels();
    this.currentLevel = 0; // 0 = full functionality
    this.degradationHistory = [];
    this.autoRecover = options.autoRecover !== false;
    this.recoverCheckInterval = options.recoverCheckInterval || 60000; // 1 minute
    this.recoveryTimer = null;
  }

  /**
   * Default degradation levels
   */
  getDefaultLevels() {
    return [
      {
        level: 0,
        name: 'full',
        description: 'Full functionality - all features available',
        features: {
          consensus: 'byzantine',
          coordination: 'hierarchical',
          neural: 'enabled',
          memory: 'distributed',
          replication: 3
        }
      },
      {
        level: 1,
        name: 'reduced-consensus',
        description: 'Simpler consensus - switch to Raft',
        features: {
          consensus: 'raft',
          coordination: 'hierarchical',
          neural: 'enabled',
          memory: 'distributed',
          replication: 2
        }
      },
      {
        level: 2,
        name: 'simple-coordination',
        description: 'Basic coordination - mesh topology',
        features: {
          consensus: 'majority',
          coordination: 'mesh',
          neural: 'disabled',
          memory: 'distributed',
          replication: 2
        }
      },
      {
        level: 3,
        name: 'minimal',
        description: 'Minimal functionality - single coordinator',
        features: {
          consensus: 'none',
          coordination: 'star',
          neural: 'disabled',
          memory: 'local',
          replication: 1
        }
      },
      {
        level: 4,
        name: 'emergency',
        description: 'Emergency mode - basic task execution only',
        features: {
          consensus: 'none',
          coordination: 'direct',
          neural: 'disabled',
          memory: 'local',
          replication: 1
        }
      }
    ];
  }

  /**
   * Degrade to next level
   */
  async degrade(reason) {
    if (this.currentLevel >= this.degradationLevels.length - 1) {
      this.emit('degradation:max-level-reached', { reason });
      return false;
    }

    const previousLevel = this.currentLevel;
    this.currentLevel++;

    const newConfig = this.degradationLevels[this.currentLevel];

    this.degradationHistory.push({
      timestamp: Date.now(),
      from: previousLevel,
      to: this.currentLevel,
      reason,
      config: newConfig
    });

    this.emit('degradation:level-changed', {
      previousLevel,
      currentLevel: this.currentLevel,
      config: newConfig,
      reason
    });

    // Start auto-recovery checks if enabled
    if (this.autoRecover && !this.recoveryTimer) {
      this.startRecoveryChecks();
    }

    return newConfig;
  }

  /**
   * Attempt to recover to previous level
   */
  async recover() {
    if (this.currentLevel === 0) {
      return false; // Already at full functionality
    }

    const previousLevel = this.currentLevel;
    this.currentLevel--;

    const newConfig = this.degradationLevels[this.currentLevel];

    this.degradationHistory.push({
      timestamp: Date.now(),
      from: previousLevel,
      to: this.currentLevel,
      reason: 'recovery',
      config: newConfig
    });

    this.emit('degradation:recovered', {
      previousLevel,
      currentLevel: this.currentLevel,
      config: newConfig
    });

    // Stop recovery checks if back to full functionality
    if (this.currentLevel === 0 && this.recoveryTimer) {
      this.stopRecoveryChecks();
    }

    return newConfig;
  }

  /**
   * Get current configuration
   */
  getCurrentConfig() {
    return this.degradationLevels[this.currentLevel];
  }

  /**
   * Check if feature is available at current level
   */
  isFeatureAvailable(feature) {
    const config = this.getCurrentConfig();
    return config.features[feature] !== 'disabled' &&
           config.features[feature] !== 'none';
  }

  /**
   * Get feature configuration
   */
  getFeatureConfig(feature) {
    const config = this.getCurrentConfig();
    return config.features[feature];
  }

  /**
   * Evaluate system health and degrade if needed
   */
  async evaluateHealth(healthMetrics) {
    const issues = [];

    // Check consensus failure rate
    if (healthMetrics.consensus?.failureRate > 0.3) {
      issues.push('High consensus failure rate');
    }

    // Check agent availability
    if (healthMetrics.agents?.availability < 0.7) {
      issues.push('Low agent availability');
    }

    // Check memory system
    if (healthMetrics.memory?.responseTime > 1000) {
      issues.push('Slow memory response');
    }

    // Check neural system
    if (healthMetrics.neural?.errorRate > 0.2) {
      issues.push('High neural error rate');
    }

    // Degrade if issues detected
    if (issues.length > 0) {
      await this.degrade(issues.join(', '));
      return {
        degraded: true,
        issues,
        newLevel: this.currentLevel
      };
    }

    return {
      degraded: false,
      issues: []
    };
  }

  /**
   * Start automatic recovery checks
   */
  startRecoveryChecks() {
    this.recoveryTimer = setInterval(async () => {
      this.emit('degradation:recovery-check');

      // Try to recover if conditions are good
      // This would normally check system health
      // For now, just emit event
      this.emit('degradation:recovery-attempted');
    }, this.recoverCheckInterval);
  }

  /**
   * Stop recovery checks
   */
  stopRecoveryChecks() {
    if (this.recoveryTimer) {
      clearInterval(this.recoveryTimer);
      this.recoveryTimer = null;
    }
  }

  /**
   * Get recommended configuration for error
   */
  getRecommendedLevel(error) {
    const errorType = error.type || 'unknown';

    const recommendations = {
      'consensus-timeout': 1, // Switch to Raft
      'byzantine-failure': 2, // Use simple majority
      'agent-unavailable': 2, // Simplify coordination
      'memory-failure': 3, // Use local memory
      'neural-error': 2, // Disable neural features
      'network-partition': 3, // Minimize coordination
      'unknown': 1 // Conservative degradation
    };

    return recommendations[errorType] || 1;
  }

  /**
   * Apply recommended degradation for error
   */
  async degradeForError(error) {
    const recommendedLevel = this.getRecommendedLevel(error);

    while (this.currentLevel < recommendedLevel) {
      await this.degrade(`Error: ${error.type || 'unknown'}`);
    }

    return this.getCurrentConfig();
  }

  /**
   * Get degradation history
   */
  getHistory() {
    return this.degradationHistory;
  }

  /**
   * Reset to full functionality
   */
  async reset() {
    if (this.currentLevel === 0) {
      return false;
    }

    const previousLevel = this.currentLevel;
    this.currentLevel = 0;

    this.degradationHistory.push({
      timestamp: Date.now(),
      from: previousLevel,
      to: 0,
      reason: 'manual-reset',
      config: this.degradationLevels[0]
    });

    this.emit('degradation:reset', {
      previousLevel,
      config: this.degradationLevels[0]
    });

    this.stopRecoveryChecks();

    return this.degradationLevels[0];
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      currentLevel: this.currentLevel,
      levelName: this.degradationLevels[this.currentLevel].name,
      config: this.getCurrentConfig(),
      autoRecover: this.autoRecover,
      historyLength: this.degradationHistory.length
    };
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopRecoveryChecks();
    this.removeAllListeners();
  }
}

module.exports = GracefulDegradation;
