#!/usr/bin/env node

/**
 * Performance Metrics Collector
 *
 * Core metrics collection system for hive-mind performance tracking.
 * Integrates with stock claude-flow hooks system and stores metrics in
 * the .hive-mind/hive.db performance_metrics table.
 *
 * Features:
 * - Task timing (pre/post hooks)
 * - Token usage tracking per agent
 * - Memory latency monitoring
 * - Database persistence
 * - Dashboard JSON export
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class MetricsCollector {
  constructor(dbPath = '.hive-mind/hive.db') {
    this.dbPath = path.resolve(process.cwd(), dbPath);
    this.db = null;
    this.activeTimers = new Map();
  }

  /**
   * Initialize database connection
   */
  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(new Error(`Failed to connect to database: ${err.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Close database connection
   */
  async close() {
    if (!this.db) return;
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Record a performance metric
   *
   * @param {string} entityType - Type of entity (task, agent, swarm, memory)
   * @param {string} entityId - Unique identifier for the entity
   * @param {string} metricName - Name of the metric
   * @param {number} metricValue - Numeric value of the metric
   * @param {object} metadata - Additional metadata
   * @returns {Promise<string>} Metric ID
   */
  async recordMetric(entityType, entityId, metricName, metricValue, metadata = {}) {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }

    const id = uuidv4();
    const metadataJson = JSON.stringify(metadata);

    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO performance_metrics
        (id, entity_type, entity_id, metric_name, metric_value, metadata, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `;

      this.db.run(sql, [id, entityType, entityId, metricName, metricValue, metadataJson], (err) => {
        if (err) {
          reject(new Error(`Failed to record metric: ${err.message}`));
        } else {
          resolve(id);
        }
      });
    });
  }

  /**
   * Start timing a task
   *
   * @param {string} taskId - Unique task identifier
   * @param {object} metadata - Task metadata
   */
  startTaskTimer(taskId, metadata = {}) {
    this.activeTimers.set(taskId, {
      startTime: Date.now(),
      metadata
    });
  }

  /**
   * Stop timing a task and record the duration
   *
   * @param {string} taskId - Task identifier
   * @param {object} additionalMetadata - Additional metadata to merge
   * @returns {Promise<number>} Duration in milliseconds
   */
  async stopTaskTimer(taskId, additionalMetadata = {}) {
    const timer = this.activeTimers.get(taskId);
    if (!timer) {
      throw new Error(`No active timer found for task: ${taskId}`);
    }

    const duration = Date.now() - timer.startTime;
    this.activeTimers.delete(taskId);

    const metadata = {
      ...timer.metadata,
      ...additionalMetadata,
      startTime: timer.startTime,
      endTime: Date.now()
    };

    await this.recordMetric('task', taskId, 'duration_ms', duration, metadata);
    return duration;
  }

  /**
   * Record token usage for an agent
   *
   * @param {string} agentId - Agent identifier
   * @param {number} inputTokens - Input token count
   * @param {number} outputTokens - Output token count
   * @param {object} metadata - Additional metadata
   */
  async recordTokenUsage(agentId, inputTokens, outputTokens, metadata = {}) {
    const totalTokens = inputTokens + outputTokens;

    await Promise.all([
      this.recordMetric('agent', agentId, 'input_tokens', inputTokens, metadata),
      this.recordMetric('agent', agentId, 'output_tokens', outputTokens, metadata),
      this.recordMetric('agent', agentId, 'total_tokens', totalTokens, metadata)
    ]);
  }

  /**
   * Record memory operation latency
   *
   * @param {string} operation - Operation type (store, retrieve, search)
   * @param {number} latencyMs - Operation latency in milliseconds
   * @param {object} metadata - Additional metadata
   */
  async recordMemoryLatency(operation, latencyMs, metadata = {}) {
    await this.recordMetric('memory', operation, 'latency_ms', latencyMs, {
      ...metadata,
      operation
    });
  }

  /**
   * Record speedup calculation
   *
   * @param {string} swarmId - Swarm identifier
   * @param {number} parallelTime - Parallel execution time
   * @param {number} sequentialTime - Sequential execution time
   * @param {object} metadata - Additional metadata
   */
  async recordSpeedup(swarmId, parallelTime, sequentialTime, metadata = {}) {
    const speedup = sequentialTime / parallelTime;
    const efficiency = speedup / (metadata.agentCount || 1);

    await Promise.all([
      this.recordMetric('swarm', swarmId, 'parallel_time_ms', parallelTime, metadata),
      this.recordMetric('swarm', swarmId, 'sequential_time_ms', sequentialTime, metadata),
      this.recordMetric('swarm', swarmId, 'speedup_factor', speedup, metadata),
      this.recordMetric('swarm', swarmId, 'efficiency', efficiency, metadata)
    ]);
  }

  /**
   * Get metrics for a specific entity
   *
   * @param {string} entityType - Entity type
   * @param {string} entityId - Entity identifier
   * @returns {Promise<Array>} Array of metrics
   */
  async getEntityMetrics(entityType, entityId) {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }

    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM performance_metrics
        WHERE entity_type = ? AND entity_id = ?
        ORDER BY timestamp DESC
      `;

      this.db.all(sql, [entityType, entityId], (err, rows) => {
        if (err) {
          reject(new Error(`Failed to query metrics: ${err.message}`));
        } else {
          const metrics = rows.map(row => ({
            ...row,
            metadata: JSON.parse(row.metadata || '{}')
          }));
          resolve(metrics);
        }
      });
    });
  }

  /**
   * Get aggregated metrics summary
   *
   * @param {string} entityType - Entity type (optional)
   * @returns {Promise<object>} Aggregated metrics
   */
  async getMetricsSummary(entityType = null) {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }

    return new Promise((resolve, reject) => {
      const sql = entityType
        ? `
          SELECT
            entity_type,
            metric_name,
            COUNT(*) as count,
            AVG(metric_value) as avg,
            MIN(metric_value) as min,
            MAX(metric_value) as max,
            SUM(metric_value) as total
          FROM performance_metrics
          WHERE entity_type = ?
          GROUP BY entity_type, metric_name
        `
        : `
          SELECT
            entity_type,
            metric_name,
            COUNT(*) as count,
            AVG(metric_value) as avg,
            MIN(metric_value) as min,
            MAX(metric_value) as max,
            SUM(metric_value) as total
          FROM performance_metrics
          GROUP BY entity_type, metric_name
        `;

      const params = entityType ? [entityType] : [];

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(new Error(`Failed to query summary: ${err.message}`));
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Export metrics for dashboard (JSON format)
   *
   * @param {object} options - Export options
   * @returns {Promise<object>} Dashboard-ready JSON
   */
  async exportForDashboard(options = {}) {
    const {
      startDate = null,
      endDate = null,
      entityTypes = ['task', 'agent', 'swarm', 'memory']
    } = options;

    const summary = await this.getMetricsSummary();

    const dashboardData = {
      timestamp: new Date().toISOString(),
      summary: {},
      details: {}
    };

    // Organize summary by entity type and metric
    for (const row of summary) {
      if (!dashboardData.summary[row.entity_type]) {
        dashboardData.summary[row.entity_type] = {};
      }
      dashboardData.summary[row.entity_type][row.metric_name] = {
        count: row.count,
        average: row.avg,
        min: row.min,
        max: row.max,
        total: row.total
      };
    }

    // Get detailed metrics for each entity type
    for (const entityType of entityTypes) {
      const typeMetrics = await this.getTypeMetrics(entityType, startDate, endDate);
      dashboardData.details[entityType] = typeMetrics;
    }

    return dashboardData;
  }

  /**
   * Get all metrics for a specific entity type
   *
   * @param {string} entityType - Entity type
   * @param {Date} startDate - Start date filter (optional)
   * @param {Date} endDate - End date filter (optional)
   * @returns {Promise<Array>} Array of metrics
   */
  async getTypeMetrics(entityType, startDate = null, endDate = null) {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }

    return new Promise((resolve, reject) => {
      let sql = `
        SELECT * FROM performance_metrics
        WHERE entity_type = ?
      `;
      const params = [entityType];

      if (startDate) {
        sql += ` AND timestamp >= ?`;
        params.push(startDate.toISOString());
      }

      if (endDate) {
        sql += ` AND timestamp <= ?`;
        params.push(endDate.toISOString());
      }

      sql += ` ORDER BY timestamp DESC`;

      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(new Error(`Failed to query type metrics: ${err.message}`));
        } else {
          const metrics = rows.map(row => ({
            ...row,
            metadata: JSON.parse(row.metadata || '{}')
          }));
          resolve(metrics);
        }
      });
    });
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const collector = new MetricsCollector();

  (async () => {
    try {
      await collector.connect();

      switch (command) {
        case 'start-task':
          collector.startTaskTimer(args[1], { description: args[2] || '' });
          console.log(`Started timer for task: ${args[1]}`);
          break;

        case 'stop-task':
          const duration = await collector.stopTaskTimer(args[1], {
            status: args[2] || 'completed'
          });
          console.log(`Task ${args[1]} completed in ${duration}ms`);
          break;

        case 'record-tokens':
          await collector.recordTokenUsage(
            args[1], // agentId
            parseInt(args[2]), // inputTokens
            parseInt(args[3]), // outputTokens
            { task: args[4] || '' }
          );
          console.log(`Recorded token usage for agent: ${args[1]}`);
          break;

        case 'export-dashboard':
          const data = await collector.exportForDashboard();
          console.log(JSON.stringify(data, null, 2));
          break;

        case 'summary':
          const summary = await collector.getMetricsSummary(args[1]);
          console.log(JSON.stringify(summary, null, 2));
          break;

        default:
          console.error(`Unknown command: ${command}`);
          console.log(`
Usage:
  node metrics-collector.js start-task <taskId> [description]
  node metrics-collector.js stop-task <taskId> [status]
  node metrics-collector.js record-tokens <agentId> <inputTokens> <outputTokens> [task]
  node metrics-collector.js export-dashboard
  node metrics-collector.js summary [entityType]
          `);
          process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    } finally {
      await collector.close();
    }
  })();
}

module.exports = { MetricsCollector };
