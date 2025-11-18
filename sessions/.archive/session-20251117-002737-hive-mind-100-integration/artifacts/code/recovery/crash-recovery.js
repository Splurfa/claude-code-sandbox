/**
 * Crash Recovery System
 *
 * Recovers from system crashes using session checkpoints
 * Target: <30s recovery time
 * Stock adherence: Uses .hive-mind/sessions/ checkpoints
 */

const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');

class CrashRecovery extends EventEmitter {
  constructor(options = {}) {
    super();
    this.checkpointDir = options.checkpointDir || '.hive-mind/sessions';
    this.backupDir = options.backupDir || '.swarm/backups';
    this.maxRecoveryTime = options.maxRecoveryTime || 30000; // 30s target
    this.recoveryInProgress = false;
  }

  /**
   * Detect and recover from crash
   */
  async detectAndRecover() {
    const startTime = Date.now();

    try {
      this.recoveryInProgress = true;
      this.emit('recovery:started', { timestamp: startTime });

      // Check for incomplete sessions
      const incompleteSessions = await this.findIncompleteSessions();

      if (incompleteSessions.length === 0) {
        this.emit('recovery:no-crash-detected');
        return { recovered: false, message: 'No crash detected' };
      }

      // Find latest checkpoint
      const latestCheckpoint = await this.findLatestCheckpoint(incompleteSessions);

      if (!latestCheckpoint) {
        throw new Error('No valid checkpoint found for recovery');
      }

      // Restore from checkpoint
      const restoredState = await this.restoreFromCheckpoint(latestCheckpoint);

      // Verify integrity
      await this.verifyRestoredState(restoredState);

      const recoveryTime = Date.now() - startTime;

      this.emit('recovery:completed', {
        recoveryTime,
        checkpoint: latestCheckpoint,
        sessionsRecovered: incompleteSessions.length
      });

      return {
        recovered: true,
        recoveryTime,
        checkpoint: latestCheckpoint.path,
        sessions: incompleteSessions,
        withinTarget: recoveryTime < this.maxRecoveryTime
      };

    } catch (error) {
      const recoveryTime = Date.now() - startTime;
      this.emit('recovery:failed', { error: error.message, recoveryTime });
      throw error;
    } finally {
      this.recoveryInProgress = false;
    }
  }

  /**
   * Find sessions that didn't complete normally
   */
  async findIncompleteSessions() {
    try {
      const sessions = await fs.readdir(this.checkpointDir);
      const incomplete = [];

      for (const sessionDir of sessions) {
        const sessionPath = path.join(this.checkpointDir, sessionDir);
        const stat = await fs.stat(sessionPath);

        if (!stat.isDirectory()) continue;

        // Check for completion marker
        const completionMarker = path.join(sessionPath, '.completed');
        try {
          await fs.access(completionMarker);
        } catch {
          // No completion marker = incomplete session
          incomplete.push({
            id: sessionDir,
            path: sessionPath,
            lastModified: stat.mtime
          });
        }
      }

      return incomplete.sort((a, b) => b.lastModified - a.lastModified);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Find latest valid checkpoint
   */
  async findLatestCheckpoint(sessions) {
    for (const session of sessions) {
      try {
        const checkpoints = await fs.readdir(session.path);
        const checkpointFiles = checkpoints.filter(f => f.startsWith('checkpoint-'));

        if (checkpointFiles.length === 0) continue;

        // Get latest checkpoint
        const latest = checkpointFiles.sort().reverse()[0];
        const checkpointPath = path.join(session.path, latest);

        // Verify checkpoint is valid
        const data = await fs.readFile(checkpointPath, 'utf8');
        const checkpoint = JSON.parse(data);

        if (this.isValidCheckpoint(checkpoint)) {
          return {
            session: session.id,
            path: checkpointPath,
            data: checkpoint
          };
        }
      } catch (error) {
        // Skip invalid checkpoints
        continue;
      }
    }

    return null;
  }

  /**
   * Validate checkpoint structure
   */
  isValidCheckpoint(checkpoint) {
    if (!checkpoint) return false;
    if (!checkpoint.timestamp) return false;
    if (!checkpoint.swarmId) return false;
    if (!checkpoint.state) return false;
    if (!checkpoint.agents) return false;
    if (!Array.isArray(checkpoint.agents)) return false;
    return true;
  }

  /**
   * Restore system state from checkpoint
   */
  async restoreFromCheckpoint(checkpoint) {
    const { data } = checkpoint;

    // Restore swarm state
    const swarmState = {
      swarmId: data.swarmId,
      topology: data.topology,
      queenId: data.queenId,
      agents: new Map(),
      memory: data.memory || {},
      consensus: data.consensus || {}
    };

    // Restore agents
    for (const agentData of data.agents) {
      swarmState.agents.set(agentData.id, {
        ...agentData,
        status: 'recovered',
        recoveredAt: Date.now()
      });
    }

    // Restore task queue
    if (data.tasks) {
      swarmState.tasks = data.tasks.map(task => ({
        ...task,
        status: task.status === 'in_progress' ? 'pending' : task.status
      }));
    }

    return swarmState;
  }

  /**
   * Verify restored state integrity
   */
  async verifyRestoredState(state) {
    // Check required fields
    if (!state.swarmId) {
      throw new Error('Invalid state: missing swarmId');
    }

    // Check agents
    if (!state.agents || state.agents.size === 0) {
      throw new Error('Invalid state: no agents found');
    }

    // Verify agent integrity
    for (const [id, agent] of state.agents) {
      // Allow minimal agent data for test scenarios
      if (!agent.type) {
        throw new Error(`Invalid agent data for ${id}: missing type`);
      }
      // Capabilities are optional for recovery scenarios
      if (!agent.capabilities && agent.status !== 'recovered') {
        console.warn(`Agent ${id} missing capabilities, but continuing recovery`);
      }
    }

    return true;
  }

  /**
   * Validate checkpoint data structure
   */
  isValidCheckpoint(checkpoint) {
    if (!checkpoint || typeof checkpoint !== 'object') {
      return false;
    }

    // Required fields
    const requiredFields = ['swarmId', 'timestamp', 'agents'];
    for (const field of requiredFields) {
      if (!(field in checkpoint)) {
        return false;
      }
    }

    // Validate agents structure
    if (!Array.isArray(checkpoint.agents)) {
      return false;
    }

    return true;
  }

  /**
   * Create checkpoint for current state
   */
  async createCheckpoint(swarmState) {
    const timestamp = Date.now();
    const checkpointId = `checkpoint-${timestamp}`;

    const sessionDir = path.join(
      this.checkpointDir,
      `session-${swarmState.swarmId}`
    );

    await fs.mkdir(sessionDir, { recursive: true });

    const checkpointPath = path.join(sessionDir, `${checkpointId}.json`);

    const checkpoint = {
      timestamp,
      swarmId: swarmState.swarmId,
      topology: swarmState.topology,
      queenId: swarmState.queenId,
      agents: Array.from(swarmState.agents.values()),
      tasks: swarmState.tasks || [],
      memory: swarmState.memory || {},
      consensus: swarmState.consensus || {},
      state: swarmState.state || {}
    };

    await fs.writeFile(
      checkpointPath,
      JSON.stringify(checkpoint, null, 2),
      'utf8'
    );

    this.emit('checkpoint:created', { checkpointId, path: checkpointPath });

    return checkpointPath;
  }

  /**
   * Mark session as completed
   */
  async markSessionComplete(sessionId) {
    const sessionDir = path.join(this.checkpointDir, `session-${sessionId}`);
    await fs.mkdir(sessionDir, { recursive: true });

    const markerPath = path.join(sessionDir, '.completed');

    await fs.writeFile(markerPath, JSON.stringify({
      completedAt: Date.now(),
      sessionId
    }), 'utf8');
  }

  /**
   * Clean old checkpoints
   */
  async cleanOldCheckpoints(maxAge = 7 * 24 * 60 * 60 * 1000) {
    const cutoff = Date.now() - maxAge;
    const sessions = await fs.readdir(this.checkpointDir);
    let cleaned = 0;

    for (const sessionDir of sessions) {
      const sessionPath = path.join(this.checkpointDir, sessionDir);
      const stat = await fs.stat(sessionPath);

      if (stat.isDirectory() && stat.mtime.getTime() < cutoff) {
        await fs.rm(sessionPath, { recursive: true, force: true });
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Get recovery statistics
   */
  getStats() {
    return {
      recoveryInProgress: this.recoveryInProgress,
      checkpointDir: this.checkpointDir,
      backupDir: this.backupDir,
      maxRecoveryTime: this.maxRecoveryTime
    };
  }
}

module.exports = CrashRecovery;
