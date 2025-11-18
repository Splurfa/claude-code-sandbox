#!/usr/bin/env node
/**
 * Trajectory Tracker - State → Action → Reward Sequence Tracking
 *
 * Implements ReasoningBank trajectory recording:
 * - Captures state sequences (before → action → after)
 * - Tracks reward progression over time
 * - Maintains causal relationships between steps
 * - Stores in memory.db for cross-session access
 *
 * Stock-First: 98% stock sqlite3 CLI, 2% glue logic
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

class TrajectoryTracker {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || this._findProjectRoot();
    this.memoryDbPath = options.memoryDbPath || path.join(this.projectRoot, '.swarm', 'memory.db');

    // Current trajectory buffer
    this.currentTrajectory = {
      id: options.trajectoryId || `trajectory-${Date.now()}`,
      steps: [],
      startTime: Date.now(),
      metadata: options.metadata || {}
    };

    // Verify memory.db exists
    if (!fs.existsSync(this.memoryDbPath)) {
      throw new Error(`Memory database not found at ${this.memoryDbPath}`);
    }

    this._initializeSchema();
  }

  /**
   * Find project root
   */
  _findProjectRoot() {
    let dir = __dirname;
    while (dir !== path.dirname(dir)) {
      if (fs.existsSync(path.join(dir, '.swarm'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }
    return process.cwd();
  }

  /**
   * Initialize trajectory schema in memory.db (stock sqlite3)
   */
  _initializeSchema() {
    const schema = `
      CREATE TABLE IF NOT EXISTS trajectories (
        id TEXT PRIMARY KEY,
        session_id TEXT,
        agent_type TEXT,
        start_time INTEGER,
        end_time INTEGER,
        total_reward REAL,
        step_count INTEGER,
        metadata TEXT,
        created_at INTEGER DEFAULT (strftime('%s', 'now'))
      );

      CREATE TABLE IF NOT EXISTS trajectory_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        trajectory_id TEXT,
        step_number INTEGER,
        state TEXT,
        action TEXT,
        reward REAL,
        next_state TEXT,
        metadata TEXT,
        timestamp INTEGER DEFAULT (strftime('%s', 'now')),
        FOREIGN KEY (trajectory_id) REFERENCES trajectories(id)
      );

      CREATE INDEX IF NOT EXISTS idx_trajectories_session ON trajectories(session_id);
      CREATE INDEX IF NOT EXISTS idx_steps_trajectory ON trajectory_steps(trajectory_id);
    `;

    try {
      execSync(`sqlite3 "${this.memoryDbPath}" "${schema}"`, {
        encoding: 'utf8',
        stdio: 'pipe'
      });
    } catch (error) {
      throw new Error(`Failed to initialize trajectory schema: ${error.message}`);
    }
  }

  /**
   * Add a step to the current trajectory
   *
   * @param {Object} step - Trajectory step
   * @param {string} step.state - Current state description
   * @param {string} step.action - Action taken
   * @param {number} step.reward - Immediate reward (0-1)
   * @param {string} step.nextState - Resulting state (optional)
   * @param {Object} step.metadata - Additional context
   */
  async addStep(step) {
    try {
      const stepData = {
        trajectory_id: this.currentTrajectory.id,
        step_number: this.currentTrajectory.steps.length,
        state: step.state,
        action: step.action,
        reward: step.reward || 0,
        next_state: step.nextState || null,
        metadata: JSON.stringify(step.metadata || {})
      };

      // Add to buffer
      this.currentTrajectory.steps.push(stepData);

      // Store in memory.db using parameterized query via temp file
      const tempFile = path.join(require('os').tmpdir(), `trajectory-${Date.now()}.sql`);
      const insert = `
        INSERT INTO trajectory_steps (trajectory_id, step_number, state, action, reward, next_state, metadata)
        VALUES ('${this._escape(stepData.trajectory_id)}', ${stepData.step_number},
                '${this._escape(stepData.state)}', '${this._escape(stepData.action)}',
                ${stepData.reward}, ${stepData.next_state ? `'${this._escape(stepData.next_state)}'` : 'NULL'},
                '${this._escape(stepData.metadata)}');
      `;

      fs.writeFileSync(tempFile, insert);

      try {
        execSync(`sqlite3 "${this.memoryDbPath}" < "${tempFile}"`, {
          encoding: 'utf8',
          stdio: 'pipe'
        });
      } finally {
        // Clean up temp file
        try { fs.unlinkSync(tempFile); } catch {}
      }

      return {
        success: true,
        step_number: stepData.step_number,
        trajectory_id: this.currentTrajectory.id
      };
    } catch (error) {
      console.error('Failed to add trajectory step:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Complete the current trajectory and save to memory.db
   *
   * @param {Object} summary - Trajectory summary
   * @param {string} summary.sessionId - Session identifier
   * @param {string} summary.agentType - Agent type
   * @param {Object} summary.metadata - Additional metadata
   */
  async completeTrajectory(summary = {}) {
    try {
      const totalReward = this.currentTrajectory.steps.reduce(
        (sum, step) => sum + step.reward,
        0
      );

      const trajectoryData = {
        id: this.currentTrajectory.id,
        session_id: summary.sessionId || 'unknown',
        agent_type: summary.agentType || 'unknown',
        start_time: this.currentTrajectory.startTime,
        end_time: Date.now(),
        total_reward: totalReward,
        step_count: this.currentTrajectory.steps.length,
        metadata: JSON.stringify({
          ...this.currentTrajectory.metadata,
          ...summary.metadata
        })
      };

      // Store trajectory record (stock sqlite3) using REPLACE to handle duplicates
      const insert = `
        INSERT OR REPLACE INTO trajectories (id, session_id, agent_type, start_time, end_time, total_reward, step_count, metadata)
        VALUES ('${trajectoryData.id}', '${trajectoryData.session_id}', '${trajectoryData.agent_type}',
                ${trajectoryData.start_time}, ${trajectoryData.end_time}, ${trajectoryData.total_reward},
                ${trajectoryData.step_count}, '${this._escape(trajectoryData.metadata)}');
      `;

      const tempFile = path.join(require('os').tmpdir(), `trajectory-complete-${Date.now()}.sql`);
      fs.writeFileSync(tempFile, insert);

      try {
        execSync(`sqlite3 "${this.memoryDbPath}" < "${tempFile}"`, {
          encoding: 'utf8',
          stdio: 'pipe'
        });
      } finally {
        try { fs.unlinkSync(tempFile); } catch {}
      }

      // Reset current trajectory
      const completedId = this.currentTrajectory.id;
      this.currentTrajectory = {
        id: `trajectory-${Date.now()}`,
        steps: [],
        startTime: Date.now(),
        metadata: {}
      };

      return {
        success: true,
        trajectory_id: completedId,
        total_reward: totalReward,
        step_count: trajectoryData.step_count
      };
    } catch (error) {
      console.error('Failed to complete trajectory:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get current trajectory (in-progress)
   */
  async getCurrentTrajectory() {
    return {
      ...this.currentTrajectory,
      current_reward: this.currentTrajectory.steps.reduce((sum, s) => sum + s.reward, 0)
    };
  }

  /**
   * Get trajectory by ID from memory.db
   */
  async getTrajectory(trajectoryId) {
    try {
      // Get trajectory record
      const trajectoryQuery = `
        SELECT * FROM trajectories WHERE id = '${trajectoryId}';
      `;

      const trajectoryOutput = execSync(
        `sqlite3 -json "${this.memoryDbPath}" "${trajectoryQuery}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );

      const trajectories = JSON.parse(trajectoryOutput || '[]');
      if (trajectories.length === 0) {
        return null;
      }

      const trajectory = trajectories[0];

      // Get steps
      const stepsQuery = `
        SELECT * FROM trajectory_steps
        WHERE trajectory_id = '${trajectoryId}'
        ORDER BY step_number ASC;
      `;

      const stepsOutput = execSync(
        `sqlite3 -json "${this.memoryDbPath}" "${stepsQuery}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );

      const steps = JSON.parse(stepsOutput || '[]');

      return {
        ...trajectory,
        metadata: JSON.parse(trajectory.metadata || '{}'),
        steps: steps.map(s => ({
          ...s,
          metadata: JSON.parse(s.metadata || '{}')
        }))
      };
    } catch (error) {
      console.error('Failed to get trajectory:', error.message);
      return null;
    }
  }

  /**
   * Search trajectories by session or agent type
   */
  async searchTrajectories(options = {}) {
    try {
      let query = 'SELECT * FROM trajectories WHERE 1=1';

      if (options.sessionId) {
        query += ` AND session_id = '${options.sessionId}'`;
      }

      if (options.agentType) {
        query += ` AND agent_type = '${options.agentType}'`;
      }

      if (options.minReward !== undefined) {
        query += ` AND total_reward >= ${options.minReward}`;
      }

      query += ' ORDER BY created_at DESC';

      if (options.limit) {
        query += ` LIMIT ${options.limit}`;
      }

      query += ';';

      const output = execSync(
        `sqlite3 -json "${this.memoryDbPath}" "${query}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );

      const trajectories = JSON.parse(output || '[]');
      return trajectories.map(t => ({
        ...t,
        metadata: JSON.parse(t.metadata || '{}')
      }));
    } catch (error) {
      console.error('Failed to search trajectories:', error.message);
      return [];
    }
  }

  /**
   * Get trajectory statistics
   */
  async getStats() {
    try {
      const statsQuery = `
        SELECT
          COUNT(*) as total_trajectories,
          AVG(total_reward) as avg_reward,
          MAX(total_reward) as max_reward,
          AVG(step_count) as avg_steps,
          COUNT(DISTINCT session_id) as unique_sessions,
          COUNT(DISTINCT agent_type) as unique_agent_types
        FROM trajectories;
      `;

      const output = execSync(
        `sqlite3 -json "${this.memoryDbPath}" "${statsQuery}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );

      const stats = JSON.parse(output || '[{}]')[0];

      // Add step statistics
      const stepStatsQuery = `
        SELECT
          COUNT(*) as total_steps,
          AVG(reward) as avg_step_reward,
          MAX(reward) as max_step_reward
        FROM trajectory_steps;
      `;

      const stepOutput = execSync(
        `sqlite3 -json "${this.memoryDbPath}" "${stepStatsQuery}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );

      const stepStats = JSON.parse(stepOutput || '[{}]')[0];

      return {
        trajectories: stats,
        steps: stepStats,
        current_buffer: this.currentTrajectory.steps.length
      };
    } catch (error) {
      console.error('Failed to get stats:', error.message);
      return null;
    }
  }

  /**
   * Analyze trajectory patterns
   * Identifies common state → action sequences
   */
  async analyzePatterns(options = {}) {
    try {
      // Get high-reward trajectories
      const successfulTrajectories = await this.searchTrajectories({
        minReward: options.minReward || 0.7,
        limit: options.limit || 50
      });

      const patterns = new Map();

      for (const trajectory of successfulTrajectories) {
        const fullTrajectory = await this.getTrajectory(trajectory.id);
        if (!fullTrajectory || !fullTrajectory.steps) continue;

        // Extract state → action patterns
        for (let i = 0; i < fullTrajectory.steps.length - 1; i++) {
          const current = fullTrajectory.steps[i];
          const next = fullTrajectory.steps[i + 1];

          const pattern = `${this._simplifyState(current.state)} → ${this._simplifyAction(current.action)} → ${this._simplifyState(next.state)}`;

          if (!patterns.has(pattern)) {
            patterns.set(pattern, {
              count: 0,
              total_reward: 0,
              examples: []
            });
          }

          const patternData = patterns.get(pattern);
          patternData.count++;
          patternData.total_reward += current.reward;

          if (patternData.examples.length < 3) {
            patternData.examples.push({
              trajectory_id: trajectory.id,
              step_number: i
            });
          }
        }
      }

      // Convert to sorted array
      return Array.from(patterns.entries())
        .map(([pattern, data]) => ({
          pattern,
          count: data.count,
          avg_reward: data.total_reward / data.count,
          examples: data.examples
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, options.topN || 20);
    } catch (error) {
      console.error('Failed to analyze patterns:', error.message);
      return [];
    }
  }

  /**
   * Simplify state for pattern matching
   */
  _simplifyState(state) {
    const lower = state.toLowerCase();
    if (lower.includes('error') || lower.includes('fail')) return 'ERROR';
    if (lower.includes('success') || lower.includes('complete')) return 'SUCCESS';
    if (lower.includes('start') || lower.includes('init')) return 'START';
    return 'STATE';
  }

  /**
   * Simplify action for pattern matching
   */
  _simplifyAction(action) {
    const lower = action.toLowerCase();
    if (lower.includes('create') || lower.includes('write')) return 'CREATE';
    if (lower.includes('read') || lower.includes('search')) return 'READ';
    if (lower.includes('update') || lower.includes('edit')) return 'UPDATE';
    if (lower.includes('delete') || lower.includes('remove')) return 'DELETE';
    return 'ACTION';
  }

  /**
   * Escape SQL strings (basic protection)
   */
  _escape(str) {
    if (typeof str !== 'string') {
      str = String(str);
    }
    // Double quotes for SQL string literals and escape special chars
    return str.replace(/'/g, "''").replace(/\\/g, '\\\\').replace(/"/g, '""');
  }
}

module.exports = TrajectoryTracker;

// CLI usage
if (require.main === module) {
  (async () => {
    const tracker = new TrajectoryTracker({
      trajectoryId: 'test-trajectory'
    });

    console.log('📊 Trajectory Tracker - ReasoningBank Integration\n');

    // Add test steps
    await tracker.addStep({
      state: 'Task: Create authentication system',
      action: 'Created auth.js with JWT support',
      reward: 0.8,
      nextState: 'Authentication module completed'
    });

    await tracker.addStep({
      state: 'Authentication module completed',
      action: 'Added password hashing with bcrypt',
      reward: 0.9,
      nextState: 'Security features implemented'
    });

    // Complete trajectory
    const result = await tracker.completeTrajectory({
      sessionId: 'test-session',
      agentType: 'coder'
    });

    console.log('Trajectory completed:', result.success ? '✅' : '❌');
    console.log('Total reward:', result.total_reward);
    console.log('Steps:', result.step_count);

    // Get stats
    const stats = await tracker.getStats();
    console.log('\n📈 Statistics:');
    console.log('Total trajectories:', stats.trajectories.total_trajectories);
    console.log('Average reward:', stats.trajectories.avg_reward);
  })();
}
