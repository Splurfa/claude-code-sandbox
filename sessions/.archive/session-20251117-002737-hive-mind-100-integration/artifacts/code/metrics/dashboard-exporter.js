#!/usr/bin/env node

/**
 * Dashboard Data Exporter
 *
 * Exports performance metrics in dashboard-ready JSON format.
 * Provides real-time and historical performance visualizations.
 */

const { MetricsCollector } = require('./metrics-collector');
const { TokenTracker } = require('./token-tracker');
const { SpeedupCalculator } = require('./speedup-calculator');
const fs = require('fs').promises;
const path = require('path');

class DashboardExporter {
  constructor(metricsCollector = null) {
    this.collector = metricsCollector || new MetricsCollector();
    this.tokenTracker = new TokenTracker(this.collector);
    this.speedupCalc = new SpeedupCalculator(this.collector);
    this.ownCollector = !metricsCollector; // Track if we own the collector
  }

  /**
   * Initialize all components
   */
  async initialize() {
    if (this.ownCollector && !this.collector.db) {
      await this.collector.connect();
    }
  }

  /**
   * Export complete dashboard data
   *
   * @param {object} options - Export options
   * @returns {Promise<object>} Dashboard JSON
   */
  async exportDashboard(options = {}) {
    const {
      includeRawMetrics = false,
      timeRange = '24h',
      entityTypes = ['task', 'agent', 'swarm', 'memory']
    } = options;

    const startDate = this.getStartDate(timeRange);

    const dashboard = {
      metadata: {
        exportedAt: new Date().toISOString(),
        timeRange,
        version: '1.0.0'
      },
      summary: await this.getSummaryMetrics(entityTypes, startDate),
      performance: await this.getPerformanceMetrics(startDate),
      tokens: await this.getTokenMetrics(),
      speedup: await this.getSpeedupMetrics(),
      timeline: await this.getTimelineData(entityTypes, startDate),
      alerts: await this.generateAlerts()
    };

    if (includeRawMetrics) {
      dashboard.raw = await this.getRawMetrics(entityTypes, startDate);
    }

    return dashboard;
  }

  /**
   * Get summary metrics for all entity types
   */
  async getSummaryMetrics(entityTypes, startDate) {
    const summary = {};

    for (const entityType of entityTypes) {
      const metrics = await this.collector.getTypeMetrics(entityType, startDate);

      summary[entityType] = {
        count: metrics.length,
        uniqueEntities: new Set(metrics.map(m => m.entity_id)).size,
        metrics: this.aggregateMetrics(metrics)
      };
    }

    return summary;
  }

  /**
   * Get performance-specific metrics
   */
  async getPerformanceMetrics(startDate) {
    const taskMetrics = await this.collector.getTypeMetrics('task', startDate);

    const durations = taskMetrics
      .filter(m => m.metric_name === 'duration_ms')
      .map(m => m.metric_value);

    return {
      tasks: {
        total: taskMetrics.filter(m => m.metric_name === 'duration_ms').length,
        totalDuration: durations.reduce((a, b) => a + b, 0),
        averageDuration: durations.length > 0
          ? durations.reduce((a, b) => a + b, 0) / durations.length
          : 0,
        minDuration: durations.length > 0 ? Math.min(...durations) : 0,
        maxDuration: durations.length > 0 ? Math.max(...durations) : 0
      }
    };
  }

  /**
   * Get token usage metrics
   */
  async getTokenMetrics() {
    const sessionSummary = this.tokenTracker.getSessionSummary();

    return {
      session: sessionSummary,
      budget: this.tokenTracker.checkBudget(10.0), // Default $10 budget
      topAgents: sessionSummary.agents
        .sort((a, b) => b.totalTokens - a.totalTokens)
        .slice(0, 5)
    };
  }

  /**
   * Get speedup and parallelization metrics
   */
  async getSpeedupMetrics() {
    const swarmMetrics = await this.collector.getTypeMetrics('swarm');

    const speedupData = swarmMetrics
      .filter(m => m.metric_name === 'speedup_factor')
      .map(m => ({
        swarmId: m.entity_id,
        speedup: m.metric_value,
        timestamp: m.timestamp,
        metadata: m.metadata
      }));

    if (speedupData.length === 0) {
      return { speedup: [], average: 0, efficiency: 0 };
    }

    const avgSpeedup = speedupData.reduce((a, b) => a + b.speedup, 0) / speedupData.length;

    const efficiencyMetrics = swarmMetrics.filter(m => m.metric_name === 'efficiency');
    const avgEfficiency = efficiencyMetrics.length > 0
      ? efficiencyMetrics.reduce((a, b) => a + b.metric_value, 0) / efficiencyMetrics.length
      : 0;

    return {
      speedup: speedupData,
      average: avgSpeedup,
      efficiency: avgEfficiency,
      measurements: speedupData.length
    };
  }

  /**
   * Get timeline data for visualization
   */
  async getTimelineData(entityTypes, startDate) {
    const timeline = [];

    for (const entityType of entityTypes) {
      const metrics = await this.collector.getTypeMetrics(entityType, startDate);

      for (const metric of metrics) {
        timeline.push({
          timestamp: metric.timestamp,
          entityType: metric.entity_type,
          entityId: metric.entity_id,
          metricName: metric.metric_name,
          value: metric.metric_value,
          metadata: metric.metadata
        });
      }
    }

    // Sort by timestamp
    timeline.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return timeline.slice(0, 100); // Limit to 100 most recent events
  }

  /**
   * Generate performance alerts
   */
  async generateAlerts() {
    const alerts = [];

    // Check token budget
    const budget = this.tokenTracker.checkBudget(10.0);
    if (budget.warningLevel === 'critical') {
      alerts.push({
        severity: 'critical',
        category: 'budget',
        message: `Token budget critically low: ${budget.percentUsed.toFixed(1)}% used`,
        data: budget
      });
    } else if (budget.warningLevel === 'warning') {
      alerts.push({
        severity: 'warning',
        category: 'budget',
        message: `Token budget warning: ${budget.percentUsed.toFixed(1)}% used`,
        data: budget
      });
    }

    // Check for slow tasks
    const taskMetrics = await this.collector.getTypeMetrics('task');
    const durations = taskMetrics
      .filter(m => m.metric_name === 'duration_ms')
      .map(m => m.metric_value);

    if (durations.length > 0) {
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const slowTasks = durations.filter(d => d > avgDuration * 2);

      if (slowTasks.length > durations.length * 0.2) {
        alerts.push({
          severity: 'warning',
          category: 'performance',
          message: `${slowTasks.length} tasks running significantly slower than average`,
          data: { slowCount: slowTasks.length, totalCount: durations.length }
        });
      }
    }

    // Check swarm efficiency
    const swarmMetrics = await this.collector.getTypeMetrics('swarm');
    const efficiencyMetrics = swarmMetrics.filter(m => m.metric_name === 'efficiency');

    if (efficiencyMetrics.length > 0) {
      const avgEfficiency = efficiencyMetrics.reduce((a, b) => a + b.metric_value, 0) / efficiencyMetrics.length;

      if (avgEfficiency < 0.5) {
        alerts.push({
          severity: 'warning',
          category: 'efficiency',
          message: `Low swarm efficiency detected: ${(avgEfficiency * 100).toFixed(1)}%`,
          data: { efficiency: avgEfficiency }
        });
      }
    }

    return alerts;
  }

  /**
   * Get raw metrics data
   */
  async getRawMetrics(entityTypes, startDate) {
    const raw = {};

    for (const entityType of entityTypes) {
      raw[entityType] = await this.collector.getTypeMetrics(entityType, startDate);
    }

    return raw;
  }

  /**
   * Aggregate metrics for summary
   */
  aggregateMetrics(metrics) {
    const byMetricName = {};

    for (const metric of metrics) {
      if (!byMetricName[metric.metric_name]) {
        byMetricName[metric.metric_name] = [];
      }
      byMetricName[metric.metric_name].push(metric.metric_value);
    }

    const aggregated = {};
    for (const [name, values] of Object.entries(byMetricName)) {
      aggregated[name] = {
        count: values.length,
        sum: values.reduce((a, b) => a + b, 0),
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      };
    }

    return aggregated;
  }

  /**
   * Calculate start date from time range
   */
  getStartDate(timeRange) {
    const now = new Date();
    const ranges = {
      '1h': 1 * 60 * 60 * 1000,
      '6h': 6 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const offset = ranges[timeRange] || ranges['24h'];
    return new Date(now.getTime() - offset);
  }

  /**
   * Save dashboard to file
   */
  async saveDashboard(filepath, options = {}) {
    const dashboard = await this.exportDashboard(options);
    await fs.writeFile(filepath, JSON.stringify(dashboard, null, 2));
    return filepath;
  }

  /**
   * Close all connections
   */
  async close() {
    await this.collector.close();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const exporter = new DashboardExporter();

  (async () => {
    try {
      await exporter.initialize();

      switch (command) {
        case 'export':
          const dashboard = await exporter.exportDashboard({
            includeRawMetrics: args.includes('--raw'),
            timeRange: args[2] || '24h'
          });
          console.log(JSON.stringify(dashboard, null, 2));
          break;

        case 'save':
          const filepath = args[1] || '.hive-mind/exports/dashboard.json';
          await exporter.saveDashboard(filepath, {
            timeRange: args[2] || '24h'
          });
          console.log(`Dashboard saved to: ${filepath}`);
          break;

        default:
          console.error(`Unknown command: ${command}`);
          console.log(`
Usage:
  node dashboard-exporter.js export [--raw] [timeRange]
  node dashboard-exporter.js save [filepath] [timeRange]

Time ranges: 1h, 6h, 24h, 7d, 30d
          `);
          process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    } finally {
      await exporter.close();
    }
  })();
}

module.exports = { DashboardExporter };
