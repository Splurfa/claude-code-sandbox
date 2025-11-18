/**
 * Recovery System Tests
 *
 * Verifies crash recovery, graceful degradation, agent watchdog, and backup systems
 */

const CrashRecovery = require('../code/recovery/crash-recovery');
const GracefulDegradation = require('../code/recovery/graceful-degradation');
const AgentWatchdog = require('../code/recovery/agent-watchdog');
const BackupManager = require('../code/recovery/backup-manager');
const fs = require('fs').promises;
const path = require('path');

describe('Recovery Systems', () => {
  const testDir = '.test-recovery';
  const checkpointDir = path.join(testDir, '.hive-mind/sessions');
  const backupDir = path.join(testDir, '.swarm/backups');

  beforeEach(async () => {
    await fs.mkdir(checkpointDir, { recursive: true });
    await fs.mkdir(backupDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('CrashRecovery', () => {
    test('creates checkpoint for swarm state', async () => {
      const recovery = new CrashRecovery({ checkpointDir });

      const swarmState = {
        swarmId: 'test-swarm-1',
        topology: 'mesh',
        queenId: 'queen-1',
        agents: new Map([
          ['agent-1', { id: 'agent-1', type: 'coder', capabilities: ['code'] }],
          ['agent-2', { id: 'agent-2', type: 'tester', capabilities: ['test'] }]
        ]),
        memory: { key: 'value' },
        tasks: []
      };

      const checkpointPath = await recovery.createCheckpoint(swarmState);

      expect(checkpointPath).toBeTruthy();
      const exists = await fs.access(checkpointPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);

      // Verify checkpoint content
      const content = await fs.readFile(checkpointPath, 'utf8');
      const checkpoint = JSON.parse(content);
      expect(checkpoint.swarmId).toBe('test-swarm-1');
      expect(checkpoint.agents).toHaveLength(2);
    });

    test('detects incomplete sessions', async () => {
      const recovery = new CrashRecovery({ checkpointDir });

      // Create incomplete session
      const sessionPath = path.join(checkpointDir, 'session-test-1');
      await fs.mkdir(sessionPath, { recursive: true });

      const incomplete = await recovery.findIncompleteSessions();
      expect(incomplete).toHaveLength(1);
      expect(incomplete[0].id).toBe('session-test-1');
    });

    test('recovers from checkpoint in <30s', async () => {
      const recovery = new CrashRecovery({
        checkpointDir,
        maxRecoveryTime: 30000
      });

      // Create checkpoint
      const swarmState = {
        swarmId: 'test-swarm-1',
        topology: 'mesh',
        queenId: 'queen-1',
        agents: new Map([
          ['agent-1', { id: 'agent-1', type: 'coder', capabilities: ['code'] }]
        ])
      };

      await recovery.createCheckpoint(swarmState);

      const startTime = Date.now();
      const result = await recovery.detectAndRecover();
      const recoveryTime = Date.now() - startTime;

      expect(result.recovered).toBe(true);
      expect(recoveryTime).toBeLessThan(30000);
      expect(result.withinTarget).toBe(true);
    }, 35000);

    test('validates checkpoint integrity', async () => {
      const recovery = new CrashRecovery({ checkpointDir });

      const validCheckpoint = {
        timestamp: Date.now(),
        swarmId: 'test',
        state: {},
        agents: []
      };

      expect(recovery.isValidCheckpoint(validCheckpoint)).toBe(true);

      const invalidCheckpoint = {
        timestamp: Date.now()
        // Missing required fields
      };

      expect(recovery.isValidCheckpoint(invalidCheckpoint)).toBe(false);
    });

    test('marks session as completed', async () => {
      const recovery = new CrashRecovery({ checkpointDir });

      await recovery.markSessionComplete('test-session');

      const markerPath = path.join(checkpointDir, 'session-test-session', '.completed');
      const exists = await fs.access(markerPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });
  });

  describe('GracefulDegradation', () => {
    test('degrades to simpler coordination', async () => {
      const degradation = new GracefulDegradation();

      expect(degradation.currentLevel).toBe(0);
      expect(degradation.getCurrentConfig().name).toBe('full');

      await degradation.degrade('Test degradation');

      expect(degradation.currentLevel).toBe(1);
      expect(degradation.getCurrentConfig().name).toBe('reduced-consensus');
    });

    test('recovers to previous level', async () => {
      const degradation = new GracefulDegradation();

      await degradation.degrade('Test');
      await degradation.degrade('Test');
      expect(degradation.currentLevel).toBe(2);

      await degradation.recover();
      expect(degradation.currentLevel).toBe(1);
    });

    test('tracks degradation history', async () => {
      const degradation = new GracefulDegradation();

      await degradation.degrade('First');
      await degradation.degrade('Second');

      const history = degradation.getHistory();
      expect(history).toHaveLength(2);
      expect(history[0].reason).toBe('First');
      expect(history[1].reason).toBe('Second');
    });

    test('evaluates health and degrades if needed', async () => {
      const degradation = new GracefulDegradation();

      const badHealth = {
        consensus: { failureRate: 0.5 },
        agents: { availability: 0.5 },
        memory: { responseTime: 2000 },
        neural: { errorRate: 0.3 }
      };

      const result = await degradation.evaluateHealth(badHealth);

      expect(result.degraded).toBe(true);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(degradation.currentLevel).toBeGreaterThan(0);
    });

    test('checks feature availability at current level', () => {
      const degradation = new GracefulDegradation();

      expect(degradation.isFeatureAvailable('neural')).toBe(true);

      degradation.currentLevel = 3; // Minimal level
      expect(degradation.isFeatureAvailable('neural')).toBe(false);
    });

    test('resets to full functionality', async () => {
      const degradation = new GracefulDegradation();

      await degradation.degrade('Test');
      await degradation.degrade('Test');
      expect(degradation.currentLevel).toBe(2);

      await degradation.reset();
      expect(degradation.currentLevel).toBe(0);
    });
  });

  describe('AgentWatchdog', () => {
    test('registers and monitors agents', () => {
      const watchdog = new AgentWatchdog({
        checkInterval: 1000,
        heartbeatTimeout: 3000
      });

      watchdog.registerAgent('agent-1', {
        type: 'coder',
        capabilities: ['code']
      });

      const status = watchdog.getAgentStatus('agent-1');
      expect(status.id).toBe('agent-1');
      expect(status.status).toBe('healthy');
    });

    test('detects failed agents', async () => {
      const watchdog = new AgentWatchdog({
        checkInterval: 100,
        heartbeatTimeout: 200
      });

      watchdog.registerAgent('agent-1', { type: 'coder' });

      let failedAgent = null;
      watchdog.on('agent:failed', (event) => {
        failedAgent = event.agentId;
      });

      watchdog.start();

      // Wait for timeout
      await new Promise(resolve => setTimeout(resolve, 300));

      expect(failedAgent).toBe('agent-1');

      watchdog.stop();
    });

    test('replaces failed agent after max restarts', async () => {
      const watchdog = new AgentWatchdog({
        maxRestartAttempts: 2
      });

      watchdog.registerAgent('agent-1', {
        type: 'coder',
        capabilities: ['code']
      });

      const agent = watchdog.agents.get('agent-1');
      agent.restartAttempts = 3;

      let replacedEvent = null;
      watchdog.on('agent:replaced', (event) => {
        replacedEvent = event;
      });

      await watchdog.recoverAgent(agent);

      expect(replacedEvent).toBeTruthy();
      expect(replacedEvent.oldAgentId).toBe('agent-1');
      expect(watchdog.agents.has('agent-1')).toBe(false);
    });

    test('tracks failure statistics', async () => {
      const watchdog = new AgentWatchdog();

      watchdog.registerAgent('agent-1', { type: 'coder' });

      const agent = watchdog.agents.get('agent-1');
      await watchdog.recoverAgent(agent);
      await watchdog.recoverAgent(agent);

      const stats = watchdog.getFailureStats();
      expect(stats.totalFailures).toBe(2);
    });

    test('gets healthy and failed agents', () => {
      const watchdog = new AgentWatchdog({
        heartbeatTimeout: 1000
      });

      watchdog.registerAgent('agent-1', { type: 'coder' });
      watchdog.registerAgent('agent-2', { type: 'tester' });

      // Make agent-2 old
      const agent2 = watchdog.agents.get('agent-2');
      agent2.lastHeartbeat = Date.now() - 2000;

      expect(watchdog.getHealthyAgents()).toHaveLength(1);
      expect(watchdog.getFailedAgents()).toHaveLength(1);
    });
  });

  describe('BackupManager', () => {
    test('creates backup of swarm state', async () => {
      const manager = new BackupManager({ backupDir });
      await manager.initialize();

      const swarmState = {
        swarmId: 'test-swarm',
        topology: 'mesh',
        queenId: 'queen-1',
        agents: new Map([
          ['agent-1', { id: 'agent-1', type: 'coder' }]
        ]),
        memory: {},
        tasks: []
      };

      const result = await manager.createBackup(swarmState);

      expect(result.backupId).toBeTruthy();
      expect(result.path).toBeTruthy();

      const backups = await manager.listBackups();
      expect(backups).toHaveLength(1);
    });

    test('restores from backup', async () => {
      const manager = new BackupManager({
        backupDir,
        compressionEnabled: false // Easier to test
      });
      await manager.initialize();

      const swarmState = {
        swarmId: 'test-swarm',
        topology: 'mesh',
        queenId: 'queen-1',
        agents: new Map([
          ['agent-1', { id: 'agent-1', type: 'coder' }]
        ]),
        memory: { key: 'value' },
        tasks: []
      };

      const backup = await manager.createBackup(swarmState);
      const restored = await manager.restoreFromBackup(backup.backupId);

      expect(restored.swarmId).toBe('test-swarm');
      expect(restored.agents.size).toBe(1);
      expect(restored.memory.key).toBe('value');
    });

    test('cleans old backups', async () => {
      const manager = new BackupManager({
        backupDir,
        maxBackups: 2
      });
      await manager.initialize();

      const swarmState = {
        swarmId: 'test',
        topology: 'mesh',
        queenId: 'queen',
        agents: new Map(),
        memory: {},
        tasks: []
      };

      // Create 3 backups
      await manager.createBackup(swarmState, { backupId: 'backup-1' });
      await manager.createBackup(swarmState, { backupId: 'backup-2' });
      await manager.createBackup(swarmState, { backupId: 'backup-3' });

      const backups = await manager.listBackups();
      expect(backups.length).toBeLessThanOrEqual(2);
    });

    test('handles compressed backups', async () => {
      const manager = new BackupManager({
        backupDir,
        compressionEnabled: true
      });
      await manager.initialize();

      const swarmState = {
        swarmId: 'test',
        topology: 'mesh',
        queenId: 'queen',
        agents: new Map([
          ['agent-1', { id: 'agent-1', type: 'coder' }]
        ]),
        memory: {},
        tasks: []
      };

      const backup = await manager.createBackup(swarmState);
      expect(backup.path).toContain('.gz');

      const restored = await manager.restoreFromBackup(backup.backupId);
      expect(restored.swarmId).toBe('test');
    });

    test('provides backup statistics', async () => {
      const manager = new BackupManager({ backupDir });
      await manager.initialize();

      const swarmState = {
        swarmId: 'test',
        topology: 'mesh',
        queenId: 'queen',
        agents: new Map(),
        memory: {},
        tasks: []
      };

      await manager.createBackup(swarmState);

      const stats = await manager.getStats();
      expect(stats.totalBackups).toBe(1);
      expect(stats.totalSize).toBeGreaterThan(0);
    });
  });

  describe('Integration Tests', () => {
    test('full recovery workflow', async () => {
      const crashRecovery = new CrashRecovery({ checkpointDir });
      const backupManager = new BackupManager({ backupDir });
      await backupManager.initialize();

      // Create initial state
      const swarmState = {
        swarmId: 'integration-test',
        topology: 'mesh',
        queenId: 'queen-1',
        agents: new Map([
          ['agent-1', { id: 'agent-1', type: 'coder', capabilities: ['code'] }]
        ]),
        memory: {},
        tasks: []
      };

      // Create checkpoint and backup
      await crashRecovery.createCheckpoint(swarmState);
      await backupManager.createBackup(swarmState);

      // Simulate crash and recovery
      const recovery = await crashRecovery.detectAndRecover();
      expect(recovery.recovered).toBe(true);

      // Verify backup exists
      const backups = await backupManager.listBackups();
      expect(backups.length).toBeGreaterThan(0);
    });

    test('degradation with agent failures', async () => {
      const degradation = new GracefulDegradation();
      const watchdog = new AgentWatchdog({
        heartbeatTimeout: 500
      });

      // Register agents
      watchdog.registerAgent('agent-1', { type: 'coder' });
      watchdog.registerAgent('agent-2', { type: 'tester' });

      // Start monitoring
      watchdog.start();

      // Wait for agent failure
      await new Promise(resolve => setTimeout(resolve, 600));

      const failed = watchdog.getFailedAgents();

      if (failed.length > 0) {
        // Degrade due to failures
        await degradation.degrade('Agent failures detected');
        expect(degradation.currentLevel).toBeGreaterThan(0);
      }

      watchdog.stop();
    });
  });
});
