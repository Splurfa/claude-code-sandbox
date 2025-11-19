#!/usr/bin/env node
/**
 * ReasoningBank Trajectory Collector
 *
 * Stock-first implementation: Collects agent actions from memory_entries
 * and stores as trajectories in existing task_trajectories table.
 *
 * Usage: node trajectory-collector.js --agent-id <id> --task-id <id>
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(process.cwd(), '.swarm', 'memory.db');

class TrajectoryCollector {
  constructor(dbPath = DB_PATH) {
    this.db = new sqlite3.Database(dbPath);
  }

  /**
   * Collect trajectory from agent work session
   * Stock-first: Uses existing memory_entries to reconstruct state→action→outcome
   */
  async collectTrajectory(agentId, taskId, query, trajectoryData) {
    return new Promise((resolve, reject) => {
      // Format trajectory using stock schema
      const trajectory = {
        task_id: taskId,
        agent_id: agentId,
        query: query,
        trajectory_json: JSON.stringify(trajectoryData),
        started_at: trajectoryData.started_at || new Date().toISOString(),
        ended_at: trajectoryData.ended_at || new Date().toISOString(),
        judge_label: null, // To be filled by verdict-judge
        judge_conf: null,
        judge_reasons: null
      };

      this.db.run(`
        INSERT OR REPLACE INTO task_trajectories
        (task_id, agent_id, query, trajectory_json, started_at, ended_at, judge_label, judge_conf, judge_reasons)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        trajectory.task_id,
        trajectory.agent_id,
        trajectory.query,
        trajectory.trajectory_json,
        trajectory.started_at,
        trajectory.ended_at,
        trajectory.judge_label,
        trajectory.judge_conf,
        trajectory.judge_reasons
      ], (err) => {
        if (err) reject(err);
        else resolve(trajectory);
      });
    });
  }

  /**
   * Collect trajectories from recent memory entries
   * Stock-first: Queries existing memory_entries table
   */
  async collectFromMemory(namespace = 'swarm', limit = 100) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT key, value, metadata, created_at
        FROM memory_entries
        WHERE namespace LIKE ?
        ORDER BY created_at DESC
        LIMIT ?
      `, [`${namespace}%`, limit], async (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const trajectories = [];
        for (const row of rows) {
          try {
            const value = JSON.parse(row.value);
            const metadata = row.metadata ? JSON.parse(row.metadata) : {};

            // Extract trajectory components from memory entry
            if (metadata.agent_id && value.action) {
              const trajectory = await this.collectTrajectory(
                metadata.agent_id,
                `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                row.key,
                {
                  state: value.state || {},
                  action: value.action,
                  outcome: value.outcome || {},
                  started_at: new Date(row.created_at * 1000).toISOString(),
                  ended_at: new Date().toISOString()
                }
              );
              trajectories.push(trajectory);
            }
          } catch (parseErr) {
            // Skip entries that don't parse as trajectories
            continue;
          }
        }

        resolve(trajectories);
      });
    });
  }

  close() {
    this.db.close();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const agentId = args[args.indexOf('--agent-id') + 1] || 'default-agent';
  const taskId = args[args.indexOf('--task-id') + 1] || `task-${Date.now()}`;
  const namespace = args[args.indexOf('--namespace') + 1] || 'swarm';

  const collector = new TrajectoryCollector();

  collector.collectFromMemory(namespace)
    .then(trajectories => {
      console.log(`✅ Collected ${trajectories.length} trajectories`);
      trajectories.slice(0, 3).forEach(t => {
        console.log(`  - ${t.task_id} (${t.agent_id})`);
      });
      collector.close();
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      collector.close();
      process.exit(1);
    });
}

module.exports = TrajectoryCollector;
