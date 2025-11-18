#!/usr/bin/env node

/**
 * Speedup Calculator
 *
 * Analyzes parallel vs sequential execution performance.
 * Calculates speedup factors, efficiency, and scalability metrics.
 *
 * Features:
 * - Parallel vs sequential time comparison
 * - Amdahl's Law analysis
 * - Efficiency calculation
 * - Scalability prediction
 */

const { MetricsCollector } = require('./metrics-collector');

class SpeedupCalculator {
  constructor(metricsCollector = null) {
    this.collector = metricsCollector || new MetricsCollector();
  }

  /**
   * Initialize calculator and connect to database
   */
  async initialize() {
    if (!this.collector.db) {
      await this.collector.connect();
    }
  }

  /**
   * Calculate speedup from parallel and sequential times
   *
   * @param {number} parallelTimeMs - Parallel execution time in ms
   * @param {number} sequentialTimeMs - Sequential execution time in ms
   * @param {number} agentCount - Number of parallel agents
   * @returns {object} Speedup metrics
   */
  calculateSpeedup(parallelTimeMs, sequentialTimeMs, agentCount) {
    if (parallelTimeMs <= 0 || sequentialTimeMs <= 0) {
      throw new Error('Times must be positive values');
    }

    const speedup = sequentialTimeMs / parallelTimeMs;
    const efficiency = speedup / agentCount;
    const percentImprovement = ((sequentialTimeMs - parallelTimeMs) / sequentialTimeMs) * 100;

    // Calculate parallel fraction (Amdahl's Law)
    // speedup = 1 / (1 - p + p/n)
    // where p is parallel fraction, n is processor count
    const parallelFraction = (1/speedup - 1) / (1/agentCount - 1);

    // Predict scalability
    const scalabilityScore = this.calculateScalabilityScore(speedup, efficiency, agentCount);

    return {
      parallelTimeMs,
      sequentialTimeMs,
      agentCount,
      speedup,
      efficiency,
      percentImprovement,
      parallelFraction: Math.max(0, Math.min(1, parallelFraction)),
      scalabilityScore,
      isLinearSpeedup: Math.abs(speedup - agentCount) / agentCount < 0.1,
      isSuperLinear: speedup > agentCount
    };
  }

  /**
   * Calculate scalability score (0-100)
   *
   * @param {number} speedup - Speedup factor
   * @param {number} efficiency - Efficiency ratio
   * @param {number} agentCount - Number of agents
   * @returns {number} Score from 0-100
   */
  calculateScalabilityScore(speedup, efficiency, agentCount) {
    // Perfect linear speedup = 100
    // Efficiency-based scoring
    const efficiencyScore = efficiency * 100;

    // Penalty for very low speedup
    const speedupPenalty = speedup < 1.5 ? (1.5 - speedup) * 20 : 0;

    // Bonus for high agent count with good efficiency
    const scalabilityBonus = agentCount > 4 && efficiency > 0.7 ? 10 : 0;

    const score = Math.max(0, Math.min(100,
      efficiencyScore - speedupPenalty + scalabilityBonus
    ));

    return Math.round(score);
  }

  /**
   * Predict speedup for different agent counts using Amdahl's Law
   *
   * @param {number} parallelFraction - Fraction of code that can be parallelized (0-1)
   * @param {number} maxAgents - Maximum number of agents to predict
   * @returns {Array} Array of predictions
   */
  predictSpeedup(parallelFraction, maxAgents = 16) {
    const predictions = [];

    for (let n = 1; n <= maxAgents; n++) {
      // Amdahl's Law: Speedup = 1 / ((1 - p) + p/n)
      const speedup = 1 / ((1 - parallelFraction) + (parallelFraction / n));
      const efficiency = speedup / n;

      predictions.push({
        agentCount: n,
        predictedSpeedup: speedup,
        efficiency,
        diminishingReturns: n > 1 ? (predictions[n - 2].predictedSpeedup / predictions[n - 2].agentCount) - (speedup / n) : 0
      });
    }

    return predictions;
  }

  /**
   * Record speedup measurement
   *
   * @param {string} swarmId - Swarm identifier
   * @param {number} parallelTimeMs - Parallel execution time
   * @param {number} sequentialTimeMs - Sequential execution time
   * @param {number} agentCount - Number of agents
   * @param {object} metadata - Additional metadata
   */
  async recordSpeedup(swarmId, parallelTimeMs, sequentialTimeMs, agentCount, metadata = {}) {
    const metrics = this.calculateSpeedup(parallelTimeMs, sequentialTimeMs, agentCount);

    await this.collector.recordSpeedup(
      swarmId,
      parallelTimeMs,
      sequentialTimeMs,
      {
        ...metadata,
        agentCount,
        efficiency: metrics.efficiency,
        parallelFraction: metrics.parallelFraction,
        scalabilityScore: metrics.scalabilityScore
      }
    );

    return metrics;
  }

  /**
   * Analyze swarm performance from database
   *
   * @param {string} swarmId - Swarm identifier
   * @returns {Promise<object>} Performance analysis
   */
  async analyzeSwarmPerformance(swarmId) {
    const metrics = await this.collector.getEntityMetrics('swarm', swarmId);

    const analysis = {
      swarmId,
      measurements: [],
      averageSpeedup: 0,
      averageEfficiency: 0,
      bestSpeedup: 0,
      worstSpeedup: Infinity,
      trend: 'stable'
    };

    const speedupMetrics = metrics.filter(m => m.metric_name === 'speedup_factor');
    const efficiencyMetrics = metrics.filter(m => m.metric_name === 'efficiency');

    if (speedupMetrics.length === 0) {
      return analysis;
    }

    let totalSpeedup = 0;
    let totalEfficiency = 0;

    for (let i = 0; i < speedupMetrics.length; i++) {
      const speedup = speedupMetrics[i].metric_value;
      const efficiency = efficiencyMetrics[i]?.metric_value || 0;

      analysis.measurements.push({
        timestamp: speedupMetrics[i].timestamp,
        speedup,
        efficiency,
        metadata: speedupMetrics[i].metadata
      });

      totalSpeedup += speedup;
      totalEfficiency += efficiency;

      if (speedup > analysis.bestSpeedup) analysis.bestSpeedup = speedup;
      if (speedup < analysis.worstSpeedup) analysis.worstSpeedup = speedup;
    }

    analysis.averageSpeedup = totalSpeedup / speedupMetrics.length;
    analysis.averageEfficiency = totalEfficiency / speedupMetrics.length;

    // Detect trend
    if (speedupMetrics.length >= 3) {
      const recent = speedupMetrics.slice(0, 3).map(m => m.metric_value);
      const older = speedupMetrics.slice(-3).map(m => m.metric_value);

      const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b) / older.length;

      if (recentAvg > olderAvg * 1.1) {
        analysis.trend = 'improving';
      } else if (recentAvg < olderAvg * 0.9) {
        analysis.trend = 'degrading';
      }
    }

    return analysis;
  }

  /**
   * Calculate optimal agent count based on task characteristics
   *
   * @param {number} taskComplexity - Complexity score (1-10)
   * @param {number} parallelizability - How parallelizable the task is (0-1)
   * @param {number} coordinationOverhead - Overhead per agent (ms)
   * @returns {object} Recommendation
   */
  recommendAgentCount(taskComplexity, parallelizability, coordinationOverhead = 100) {
    // Simple heuristic model
    const baseAgents = Math.ceil(taskComplexity / 2);
    const parallelAdjustment = Math.floor(baseAgents * parallelizability);

    // Calculate break-even point where coordination overhead negates benefits
    const maxEffectiveAgents = Math.floor(
      (taskComplexity * 1000) / (coordinationOverhead * 2)
    );

    const recommendedAgents = Math.min(
      Math.max(1, baseAgents + parallelAdjustment),
      maxEffectiveAgents,
      16 // Hard cap
    );

    return {
      recommended: recommendedAgents,
      minimum: Math.max(1, Math.floor(recommendedAgents * 0.5)),
      maximum: Math.min(16, Math.ceil(recommendedAgents * 1.5)),
      reasoning: {
        taskComplexity,
        parallelizability,
        coordinationOverhead,
        maxEffectiveAgents
      }
    };
  }

  /**
   * Generate performance report
   *
   * @param {string} swarmId - Swarm identifier
   * @returns {Promise<object>} Detailed report
   */
  async generateReport(swarmId) {
    const analysis = await this.analyzeSwarmPerformance(swarmId);

    if (analysis.measurements.length === 0) {
      return {
        swarmId,
        status: 'no_data',
        message: 'No performance data available for this swarm'
      };
    }

    const latestMeasurement = analysis.measurements[0];
    const predictions = this.predictSpeedup(
      latestMeasurement.metadata.parallelFraction || 0.8,
      16
    );

    return {
      swarmId,
      status: 'success',
      currentPerformance: {
        speedup: analysis.averageSpeedup,
        efficiency: analysis.averageEfficiency,
        trend: analysis.trend
      },
      historicalData: analysis.measurements,
      scalabilityPredictions: predictions,
      recommendations: this.generateRecommendations(analysis, predictions)
    };
  }

  /**
   * Generate performance recommendations
   *
   * @param {object} analysis - Performance analysis
   * @param {Array} predictions - Scalability predictions
   * @returns {Array} List of recommendations
   */
  generateRecommendations(analysis, predictions) {
    const recommendations = [];

    // Low efficiency recommendation
    if (analysis.averageEfficiency < 0.5) {
      recommendations.push({
        priority: 'high',
        category: 'efficiency',
        message: 'Low parallel efficiency detected. Consider reducing agent count or improving task parallelization.',
        data: { efficiency: analysis.averageEfficiency }
      });
    }

    // Degrading trend recommendation
    if (analysis.trend === 'degrading') {
      recommendations.push({
        priority: 'medium',
        category: 'trend',
        message: 'Performance is degrading over time. Review coordination overhead and agent communication patterns.',
        data: { trend: analysis.trend }
      });
    }

    // Scalability recommendation
    const optimalPoint = predictions.reduce((best, curr, idx) =>
      curr.efficiency > predictions[best].efficiency ? idx : best, 0
    );

    if (optimalPoint < predictions.length - 1) {
      recommendations.push({
        priority: 'low',
        category: 'scalability',
        message: `Optimal agent count appears to be ${predictions[optimalPoint].agentCount} based on efficiency analysis.`,
        data: { optimalAgentCount: predictions[optimalPoint].agentCount }
      });
    }

    return recommendations;
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

  const calculator = new SpeedupCalculator();

  (async () => {
    try {
      await calculator.initialize();

      switch (command) {
        case 'calculate':
          const metrics = calculator.calculateSpeedup(
            parseFloat(args[1]), // parallel time
            parseFloat(args[2]), // sequential time
            parseInt(args[3])    // agent count
          );
          console.log(JSON.stringify(metrics, null, 2));
          break;

        case 'record':
          const recorded = await calculator.recordSpeedup(
            args[1],             // swarm ID
            parseFloat(args[2]), // parallel time
            parseFloat(args[3]), // sequential time
            parseInt(args[4])    // agent count
          );
          console.log(JSON.stringify(recorded, null, 2));
          break;

        case 'analyze':
          const analysis = await calculator.analyzeSwarmPerformance(args[1]);
          console.log(JSON.stringify(analysis, null, 2));
          break;

        case 'predict':
          const predictions = calculator.predictSpeedup(
            parseFloat(args[1]),  // parallel fraction
            parseInt(args[2]) || 16  // max agents
          );
          console.log(JSON.stringify(predictions, null, 2));
          break;

        case 'recommend':
          const recommendation = calculator.recommendAgentCount(
            parseInt(args[1]),    // task complexity
            parseFloat(args[2]),  // parallelizability
            parseInt(args[3]) || 100  // coordination overhead
          );
          console.log(JSON.stringify(recommendation, null, 2));
          break;

        case 'report':
          const report = await calculator.generateReport(args[1]);
          console.log(JSON.stringify(report, null, 2));
          break;

        default:
          console.error(`Unknown command: ${command}`);
          console.log(`
Usage:
  node speedup-calculator.js calculate <parallelMs> <sequentialMs> <agentCount>
  node speedup-calculator.js record <swarmId> <parallelMs> <sequentialMs> <agentCount>
  node speedup-calculator.js analyze <swarmId>
  node speedup-calculator.js predict <parallelFraction> [maxAgents]
  node speedup-calculator.js recommend <complexity> <parallelizability> [overhead]
  node speedup-calculator.js report <swarmId>
          `);
          process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    } finally {
      await calculator.close();
    }
  })();
}

module.exports = { SpeedupCalculator };
