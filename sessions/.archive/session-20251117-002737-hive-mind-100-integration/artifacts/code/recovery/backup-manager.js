/**
 * Backup Manager
 *
 * Automated backup and restore for swarm state
 * Daily backups to .swarm/backups/
 * Stock adherence: Uses standard backup directory structure
 */

const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');
const { createGzip, createGunzip } = require('zlib');
const { createReadStream, createWriteStream } = require('fs');
const { pipeline } = require('stream/promises');

class BackupManager extends EventEmitter {
  constructor(options = {}) {
    super();
    this.backupDir = options.backupDir || '.swarm/backups';
    this.checkpointDir = options.checkpointDir || '.hive-mind/sessions';
    this.scheduleInterval = options.scheduleInterval || 24 * 60 * 60 * 1000; // 24h
    this.maxBackups = options.maxBackups || 30; // Keep 30 days
    this.compressionEnabled = options.compressionEnabled !== false;
    this.scheduledBackupTimer = null;
  }

  /**
   * Initialize backup manager
   */
  async initialize() {
    await fs.mkdir(this.backupDir, { recursive: true });
    await fs.mkdir(this.checkpointDir, { recursive: true });
    this.emit('backup:initialized');
  }

  /**
   * Create backup of current state
   */
  async createBackup(swarmState, options = {}) {
    const timestamp = Date.now();
    const backupId = options.backupId || `backup-${timestamp}`;

    try {
      // Prepare backup data
      const backupData = {
        id: backupId,
        timestamp,
        version: '1.0.0',
        swarm: {
          id: swarmState.swarmId,
          topology: swarmState.topology,
          queenId: swarmState.queenId
        },
        agents: Array.from(swarmState.agents.values()),
        memory: swarmState.memory || {},
        consensus: swarmState.consensus || {},
        tasks: swarmState.tasks || [],
        metadata: {
          agentCount: swarmState.agents.size,
          createdBy: options.createdBy || 'system',
          reason: options.reason || 'scheduled'
        }
      };

      // Write backup
      const backupPath = await this.writeBackup(backupId, backupData);

      // Cleanup old backups
      await this.cleanOldBackups();

      this.emit('backup:created', {
        backupId,
        path: backupPath,
        size: await this.getFileSize(backupPath),
        agentCount: backupData.agents.length
      });

      return {
        backupId,
        path: backupPath,
        timestamp,
        metadata: backupData.metadata
      };

    } catch (error) {
      this.emit('backup:failed', { backupId, error: error.message });
      throw error;
    }
  }

  /**
   * Write backup to disk
   */
  async writeBackup(backupId, data) {
    const filename = `${backupId}.json`;
    const backupPath = path.join(this.backupDir, filename);

    if (this.compressionEnabled) {
      // Write compressed
      const gzPath = `${backupPath}.gz`;
      const input = JSON.stringify(data, null, 2);

      await pipeline(
        async function* () { yield input; },
        createGzip(),
        createWriteStream(gzPath)
      );

      return gzPath;
    } else {
      // Write uncompressed
      await fs.writeFile(backupPath, JSON.stringify(data, null, 2), 'utf8');
      return backupPath;
    }
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(backupId) {
    try {
      // Find backup file
      const backupPath = await this.findBackup(backupId);

      if (!backupPath) {
        throw new Error(`Backup ${backupId} not found`);
      }

      // Read backup
      const backupData = await this.readBackup(backupPath);

      // Validate backup
      this.validateBackup(backupData);

      // Restore swarm state
      const restoredState = {
        swarmId: backupData.swarm.id,
        topology: backupData.swarm.topology,
        queenId: backupData.swarm.queenId,
        agents: new Map(backupData.agents.map(a => [a.id, a])),
        memory: backupData.memory,
        consensus: backupData.consensus,
        tasks: backupData.tasks
      };

      this.emit('backup:restored', {
        backupId,
        timestamp: backupData.timestamp,
        agentCount: backupData.agents.length
      });

      return restoredState;

    } catch (error) {
      this.emit('backup:restore-failed', { backupId, error: error.message });
      throw error;
    }
  }

  /**
   * Read backup file
   */
  async readBackup(backupPath) {
    if (backupPath.endsWith('.gz')) {
      // Read compressed
      const chunks = [];
      await pipeline(
        createReadStream(backupPath),
        createGunzip(),
        async function* (source) {
          for await (const chunk of source) {
            chunks.push(chunk);
          }
        }
      );
      return JSON.parse(Buffer.concat(chunks).toString());
    } else {
      // Read uncompressed
      const content = await fs.readFile(backupPath, 'utf8');
      return JSON.parse(content);
    }
  }

  /**
   * Find backup file
   */
  async findBackup(backupId) {
    const files = await fs.readdir(this.backupDir);

    // Try both compressed and uncompressed
    const possibleNames = [
      `${backupId}.json`,
      `${backupId}.json.gz`
    ];

    for (const name of possibleNames) {
      if (files.includes(name)) {
        return path.join(this.backupDir, name);
      }
    }

    return null;
  }

  /**
   * Validate backup structure
   */
  validateBackup(backup) {
    if (!backup.timestamp || !backup.swarm || !backup.agents) {
      throw new Error('Invalid backup structure');
    }

    if (!backup.swarm.id) {
      throw new Error('Invalid backup: missing swarm ID');
    }

    if (!Array.isArray(backup.agents)) {
      throw new Error('Invalid backup: agents must be array');
    }

    return true;
  }

  /**
   * List available backups
   */
  async listBackups() {
    const files = await fs.readdir(this.backupDir);
    const backups = [];

    for (const file of files) {
      if (file.startsWith('backup-') && (file.endsWith('.json') || file.endsWith('.json.gz'))) {
        const filePath = path.join(this.backupDir, file);
        const stat = await fs.stat(filePath);

        backups.push({
          id: file.replace(/\.json(\.gz)?$/, ''),
          path: filePath,
          size: stat.size,
          created: stat.mtime,
          compressed: file.endsWith('.gz')
        });
      }
    }

    return backups.sort((a, b) => b.created - a.created);
  }

  /**
   * Clean old backups
   */
  async cleanOldBackups() {
    const backups = await this.listBackups();

    if (backups.length <= this.maxBackups) {
      return 0;
    }

    // Remove oldest backups
    const toRemove = backups.slice(this.maxBackups);
    let removed = 0;

    for (const backup of toRemove) {
      try {
        await fs.unlink(backup.path);
        removed++;
        this.emit('backup:cleaned', { backupId: backup.id });
      } catch (error) {
        this.emit('backup:clean-failed', {
          backupId: backup.id,
          error: error.message
        });
      }
    }

    return removed;
  }

  /**
   * Start scheduled backups
   */
  startScheduledBackups(swarmState) {
    if (this.scheduledBackupTimer) {
      return; // Already running
    }

    this.scheduledBackupTimer = setInterval(async () => {
      try {
        await this.createBackup(swarmState, {
          reason: 'scheduled',
          createdBy: 'auto'
        });
      } catch (error) {
        this.emit('backup:scheduled-failed', { error: error.message });
      }
    }, this.scheduleInterval);

    this.emit('backup:schedule-started', {
      interval: this.scheduleInterval
    });
  }

  /**
   * Stop scheduled backups
   */
  stopScheduledBackups() {
    if (this.scheduledBackupTimer) {
      clearInterval(this.scheduledBackupTimer);
      this.scheduledBackupTimer = null;
      this.emit('backup:schedule-stopped');
    }
  }

  /**
   * Get file size
   */
  async getFileSize(filePath) {
    const stat = await fs.stat(filePath);
    return stat.size;
  }

  /**
   * Get backup statistics
   */
  async getStats() {
    const backups = await this.listBackups();

    let totalSize = 0;
    for (const backup of backups) {
      totalSize += backup.size;
    }

    return {
      totalBackups: backups.length,
      totalSize,
      oldestBackup: backups[backups.length - 1]?.created,
      newestBackup: backups[0]?.created,
      averageSize: backups.length > 0 ? totalSize / backups.length : 0,
      compressionEnabled: this.compressionEnabled
    };
  }

  /**
   * Cleanup
   */
  async destroy() {
    this.stopScheduledBackups();
    this.removeAllListeners();
  }
}

module.exports = BackupManager;
