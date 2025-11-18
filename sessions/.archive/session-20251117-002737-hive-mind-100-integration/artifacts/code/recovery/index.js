/**
 * Recovery System - Main Integration Module
 *
 * Production reliability with error recovery and resilience
 */

const CrashRecovery = require('./crash-recovery');
const GracefulDegradation = require('./graceful-degradation');
const AgentWatchdog = require('./agent-watchdog');
const BackupManager = require('./backup-manager');
const EventEmitter = require('events');

class RecoverySystem extends EventEmitter {
  constructor(options = {}) {
    super();

    this.crashRecovery = new CrashRecovery({
      checkpointDir: options.checkpointDir || '.hive-mind/sessions',
      backupDir: options.backupDir || '.swarm/backups',
      maxRecoveryTime: options.maxRecoveryTime || 30000
    });

    this.degradation = new GracefulDegradation({
      degradationLevels: options.degradationLevels,
      autoRecover: options.autoRecover !== false,
      recoverCheckInterval: options.recoverCheckInterval || 60000
    });

    this.watchdog = new AgentWatchdog({
      checkInterval: options.watchdogCheckInterval || 5000,
      heartbeatTimeout: options.heartbeatTimeout || 15000,
      maxRestartAttempts: options.maxRestartAttempts || 3
    });

    this.backupManager = new BackupManager({
      backupDir: options.backupDir || '.swarm/backups',
      checkpointDir: options.checkpointDir || '.hive-mind/sessions',
      scheduleInterval: options.backupInterval || 24 * 60 * 60 * 1000,
      maxBackups: options.maxBackups || 30,
      compressionEnabled: options.compressionEnabled !== false
    });

    this.healthCheckInterval = options.healthCheckInterval || 60000;
    this.healthCheckTimer = null;

    // Wire up events
    this.setupEventHandlers();
  }

  /**
   * Initialize recovery system
   */
  async initialize() {
    await this.backupManager.initialize();

    // Check for crashes on startup
    const recovery = await this.crashRecovery.detectAndRecover();

    if (recovery.recovered) {
      this.emit('system:recovered', recovery);
    }

    // Start monitoring
    this.watchdog.start();
    this.startHealthChecks();

    this.emit('system:initialized', {
      crashRecoveryEnabled: true,
      watchdogEnabled: true,
      healthChecksEnabled: true,
      backupEnabled: true
    });
  }

  /**
   * Setup event handlers for cross-component coordination
   */
  setupEventHandlers() {
    // Agent failures trigger degradation
    this.watchdog.on('agent:failed', async (event) => {
      this.emit('recovery:agent-failed', event);

      const failedAgents = this.watchdog.getFailedAgents();
      const healthyAgents = this.watchdog.getHealthyAgents();

      // Degrade if too many failures
      if (failedAgents.length > healthyAgents.length) {
        await this.degradation.degrade(`High agent failure rate: ${failedAgents.length} failed`);
      }
    });

    // Agent replacement
    this.watchdog.on('agent:replaced', (event) => {
      this.emit('recovery:agent-replaced', event);
    });

    // Degradation changes
    this.degradation.on('degradation:level-changed', (event) => {
      this.emit('recovery:degraded', event);
    });

    // Recovery
    this.degradation.on('degradation:recovered', (event) => {
      this.emit('recovery:recovered-level', event);
    });

    // Checkpoints
    this.crashRecovery.on('checkpoint:created', (event) => {
      this.emit('recovery:checkpoint-created', event);
    });

    // Backups
    this.backupManager.on('backup:created', (event) => {
      this.emit('recovery:backup-created', event);
    });
  }

  /**
   * Start health monitoring
   */
  startHealthChecks() {
    if (this.healthCheckTimer) return;

    this.healthCheckTimer = setInterval(async () => {
      await this.performHealthCheck();
    }, this.healthCheckInterval);

    this.emit('recovery:health-checks-started');
  }

  /**
   * Stop health monitoring
   */
  stopHealthChecks() {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }
    this.emit('recovery:health-checks-stopped');
  }

  /**
   * Perform health check
   */
  async performHealthCheck() {
    const health = {
      timestamp: Date.now(),
      agents: {
        total: this.watchdog.agents.size,
        healthy: this.watchdog.getHealthyAgents().length,
        failed: this.watchdog.getFailedAgents().length,
        availability: this.watchdog.getHealthyAgents().length / this.watchdog.agents.size
      },
      degradation: {
        currentLevel: this.degradation.currentLevel,
        levelName: this.degradation.getCurrentConfig().name
      },
      backups: await this.backupManager.getStats()
    };

    // Evaluate health and potentially degrade
    const healthMetrics = {
      agents: health.agents,
      consensus: { failureRate: 0 }, // Would be provided by swarm
      memory: { responseTime: 0 }, // Would be provided by memory system
      neural: { errorRate: 0 } // Would be provided by neural system
    };

    await this.degradation.evaluateHealth(healthMetrics);

    this.emit('recovery:health-check', health);

    return health;
  }

  /**
   * Register agent for monitoring
   */
  registerAgent(agentId, agentInfo) {
    this.watchdog.registerAgent(agentId, agentInfo);
  }

  /**
   * Record agent heartbeat
   */
  heartbeat(agentId) {
    this.watchdog.heartbeat(agentId);
  }

  /**
   * Create checkpoint
   */
  async createCheckpoint(swarmState) {
    return await this.crashRecovery.createCheckpoint(swarmState);
  }

  /**
   * Create backup
   */
  async createBackup(swarmState, options = {}) {
    return await this.backupManager.createBackup(swarmState, options);
  }

  /**
   * Start scheduled backups
   */
  startScheduledBackups(swarmState) {
    this.backupManager.startScheduledBackups(swarmState);
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(backupId) {
    return await this.backupManager.restoreFromBackup(backupId);
  }

  /**
   * Get current degradation level
   */
  getDegradationLevel() {
    return this.degradation.getCurrentConfig();
  }

  /**
   * Check if feature is available
   */
  isFeatureAvailable(feature) {
    return this.degradation.isFeatureAvailable(feature);
  }

  /**
   * Get comprehensive status
   */
  async getStatus() {
    return {
      initialized: true,
      degradation: this.degradation.getStatus(),
      watchdog: this.watchdog.getStatus(),
      backups: await this.backupManager.getStats(),
      crashRecovery: this.crashRecovery.getStats()
    };
  }

  /**
   * Shutdown recovery system
   */
  async shutdown() {
    this.stopHealthChecks();
    this.watchdog.stop();
    this.backupManager.stopScheduledBackups();
    this.degradation.destroy();
    this.watchdog.destroy();
    await this.backupManager.destroy();

    this.emit('system:shutdown');
  }
}

module.exports = {
  RecoverySystem,
  CrashRecovery,
  GracefulDegradation,
  AgentWatchdog,
  BackupManager
};
