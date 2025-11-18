#!/usr/bin/env node

/**
 * Token Usage Tracker
 *
 * Tracks token consumption per agent and task, integrating with
 * Claude API response headers and usage statistics.
 *
 * Features:
 * - Per-agent token accounting
 * - Cost estimation
 * - Usage trend analysis
 * - Budget monitoring
 */

const { MetricsCollector } = require('./metrics-collector');
const fs = require('fs').promises;
const path = require('path');

class TokenTracker {
  constructor(metricsCollector = null) {
    this.collector = metricsCollector || new MetricsCollector();
    this.sessionTokens = new Map();

    // Pricing per 1M tokens (as of Nov 2024)
    this.pricing = {
      'claude-sonnet-4-5-20250929': {
        input: 3.00,
        output: 15.00
      },
      'claude-3-5-sonnet-20241022': {
        input: 3.00,
        output: 15.00
      },
      'claude-3-5-haiku-20241022': {
        input: 0.80,
        output: 4.00
      }
    };
  }

  /**
   * Initialize tracker and connect to database
   */
  async initialize() {
    if (!this.collector.db) {
      await this.collector.connect();
    }
  }

  /**
   * Track token usage from API response
   *
   * @param {string} agentId - Agent identifier
   * @param {object} usage - Usage object from API response
   * @param {object} metadata - Additional context
   */
  async trackUsage(agentId, usage, metadata = {}) {
    const {
      input_tokens = 0,
      output_tokens = 0,
      cache_creation_input_tokens = 0,
      cache_read_input_tokens = 0
    } = usage;

    const totalInputTokens = input_tokens + cache_creation_input_tokens;
    const effectiveInputTokens = input_tokens - cache_read_input_tokens;

    // Record in database
    await this.collector.recordTokenUsage(
      agentId,
      totalInputTokens,
      output_tokens,
      {
        ...metadata,
        cacheCreation: cache_creation_input_tokens,
        cacheRead: cache_read_input_tokens,
        effectiveInput: effectiveInputTokens
      }
    );

    // Update session tracking
    if (!this.sessionTokens.has(agentId)) {
      this.sessionTokens.set(agentId, {
        inputTokens: 0,
        outputTokens: 0,
        cacheCreation: 0,
        cacheRead: 0,
        requests: 0
      });
    }

    const agentStats = this.sessionTokens.get(agentId);
    agentStats.inputTokens += totalInputTokens;
    agentStats.outputTokens += output_tokens;
    agentStats.cacheCreation += cache_creation_input_tokens;
    agentStats.cacheRead += cache_read_input_tokens;
    agentStats.requests += 1;
  }

  /**
   * Calculate cost for token usage
   *
   * @param {number} inputTokens - Input token count
   * @param {number} outputTokens - Output token count
   * @param {string} model - Model identifier
   * @returns {number} Estimated cost in USD
   */
  calculateCost(inputTokens, outputTokens, model = 'claude-sonnet-4-5-20250929') {
    const pricing = this.pricing[model] || this.pricing['claude-sonnet-4-5-20250929'];

    const inputCost = (inputTokens / 1_000_000) * pricing.input;
    const outputCost = (outputTokens / 1_000_000) * pricing.output;

    return inputCost + outputCost;
  }

  /**
   * Get token usage summary for an agent
   *
   * @param {string} agentId - Agent identifier
   * @returns {Promise<object>} Usage summary
   */
  async getAgentSummary(agentId) {
    const metrics = await this.collector.getEntityMetrics('agent', agentId);

    const summary = {
      agentId,
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalTokens: 0,
      requestCount: 0,
      averageTokensPerRequest: 0,
      estimatedCost: 0,
      timeline: []
    };

    const tokenMetrics = metrics.filter(m =>
      m.metric_name === 'input_tokens' ||
      m.metric_name === 'output_tokens'
    );

    for (const metric of tokenMetrics) {
      if (metric.metric_name === 'input_tokens') {
        summary.totalInputTokens += metric.metric_value;
      } else if (metric.metric_name === 'output_tokens') {
        summary.totalOutputTokens += metric.metric_value;
      }

      summary.timeline.push({
        timestamp: metric.timestamp,
        type: metric.metric_name,
        value: metric.metric_value,
        metadata: metric.metadata
      });
    }

    summary.totalTokens = summary.totalInputTokens + summary.totalOutputTokens;
    summary.requestCount = tokenMetrics.filter(m => m.metric_name === 'input_tokens').length;

    if (summary.requestCount > 0) {
      summary.averageTokensPerRequest = summary.totalTokens / summary.requestCount;
    }

    summary.estimatedCost = this.calculateCost(
      summary.totalInputTokens,
      summary.totalOutputTokens
    );

    return summary;
  }

  /**
   * Get session-wide token usage
   *
   * @returns {object} Session summary
   */
  getSessionSummary() {
    const summary = {
      totalInputTokens: 0,
      totalOutputTokens: 0,
      totalTokens: 0,
      totalRequests: 0,
      totalCacheCreation: 0,
      totalCacheRead: 0,
      estimatedCost: 0,
      agents: []
    };

    for (const [agentId, stats] of this.sessionTokens.entries()) {
      summary.totalInputTokens += stats.inputTokens;
      summary.totalOutputTokens += stats.outputTokens;
      summary.totalRequests += stats.requests;
      summary.totalCacheCreation += stats.cacheCreation;
      summary.totalCacheRead += stats.cacheRead;

      const agentCost = this.calculateCost(stats.inputTokens, stats.outputTokens);

      summary.agents.push({
        agentId,
        ...stats,
        estimatedCost: agentCost
      });

      summary.estimatedCost += agentCost;
    }

    summary.totalTokens = summary.totalInputTokens + summary.totalOutputTokens;
    summary.cacheHitRate = summary.totalInputTokens > 0
      ? summary.totalCacheRead / summary.totalInputTokens
      : 0;

    return summary;
  }

  /**
   * Monitor budget and alert if threshold exceeded
   *
   * @param {number} budgetUsd - Budget threshold in USD
   * @returns {object} Budget status
   */
  checkBudget(budgetUsd) {
    const summary = this.getSessionSummary();
    const percentUsed = (summary.estimatedCost / budgetUsd) * 100;

    return {
      budget: budgetUsd,
      spent: summary.estimatedCost,
      remaining: budgetUsd - summary.estimatedCost,
      percentUsed,
      withinBudget: summary.estimatedCost <= budgetUsd,
      warningLevel: percentUsed >= 90 ? 'critical' :
                   percentUsed >= 75 ? 'warning' :
                   percentUsed >= 50 ? 'caution' : 'ok'
    };
  }

  /**
   * Export token usage report
   *
   * @param {string} format - Export format (json, csv, markdown)
   * @returns {Promise<string>} Formatted report
   */
  async exportReport(format = 'json') {
    const summary = this.getSessionSummary();

    switch (format) {
      case 'json':
        return JSON.stringify(summary, null, 2);

      case 'markdown':
        let md = '# Token Usage Report\n\n';
        md += `**Total Tokens**: ${summary.totalTokens.toLocaleString()}\n`;
        md += `**Total Requests**: ${summary.totalRequests}\n`;
        md += `**Estimated Cost**: $${summary.estimatedCost.toFixed(4)}\n`;
        md += `**Cache Hit Rate**: ${(summary.cacheHitRate * 100).toFixed(2)}%\n\n`;
        md += '## Agent Breakdown\n\n';
        md += '| Agent | Input Tokens | Output Tokens | Requests | Cost |\n';
        md += '|-------|--------------|---------------|----------|------|\n';

        for (const agent of summary.agents) {
          md += `| ${agent.agentId} | ${agent.inputTokens.toLocaleString()} | `;
          md += `${agent.outputTokens.toLocaleString()} | ${agent.requests} | `;
          md += `$${agent.estimatedCost.toFixed(4)} |\n`;
        }

        return md;

      case 'csv':
        let csv = 'Agent,Input Tokens,Output Tokens,Requests,Estimated Cost\n';
        for (const agent of summary.agents) {
          csv += `${agent.agentId},${agent.inputTokens},${agent.outputTokens},`;
          csv += `${agent.requests},${agent.estimatedCost.toFixed(4)}\n`;
        }
        return csv;

      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.collector) {
      await this.collector.close();
    }
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const tracker = new TokenTracker();

  (async () => {
    try {
      await tracker.initialize();

      switch (command) {
        case 'track':
          await tracker.trackUsage(args[1], {
            input_tokens: parseInt(args[2]),
            output_tokens: parseInt(args[3])
          }, { task: args[4] || '' });
          console.log(`Tracked usage for agent: ${args[1]}`);
          break;

        case 'summary':
          if (args[1]) {
            const summary = await tracker.getAgentSummary(args[1]);
            console.log(JSON.stringify(summary, null, 2));
          } else {
            const summary = tracker.getSessionSummary();
            console.log(JSON.stringify(summary, null, 2));
          }
          break;

        case 'budget':
          const budget = tracker.checkBudget(parseFloat(args[1] || 10.0));
          console.log(JSON.stringify(budget, null, 2));
          break;

        case 'export':
          const report = await tracker.exportReport(args[1] || 'json');
          console.log(report);
          break;

        default:
          console.error(`Unknown command: ${command}`);
          console.log(`
Usage:
  node token-tracker.js track <agentId> <inputTokens> <outputTokens> [task]
  node token-tracker.js summary [agentId]
  node token-tracker.js budget [budgetUsd]
  node token-tracker.js export [format]
          `);
          process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    } finally {
      await tracker.close();
    }
  })();
}

module.exports = { TokenTracker };
