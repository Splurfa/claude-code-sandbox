#!/usr/bin/env node
/**
 * Verdict Judge - Success/Failure Scoring Engine
 *
 * Implements ReasoningBank verdict judgment:
 * - Analyzes task completion quality
 * - Calculates reward score (0-1 scale)
 * - Extracts learning signals
 * - Provides actionable feedback
 *
 * Scoring Criteria:
 * - Task completion (0.4 weight)
 * - Quality metrics (0.3 weight)
 * - Best practices adherence (0.2 weight)
 * - Performance/efficiency (0.1 weight)
 *
 * Stock-First: 100% JavaScript logic (no external dependencies)
 */

const path = require('path');
const fs = require('fs');

class VerdictJudge {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();

    // Scoring weights
    this.weights = options.weights || {
      completion: 0.4,
      quality: 0.3,
      practices: 0.2,
      performance: 0.1
    };

    // Thresholds
    this.thresholds = options.thresholds || {
      success: 0.7,
      partial: 0.5,
      failure: 0.3
    };
  }

  /**
   * Judge task outcome and calculate reward score
   *
   * @param {Object} outcome - Task outcome data
   * @param {string} outcome.task - Task description
   * @param {string} outcome.status - Completion status (completed, failed, partial)
   * @param {Object} outcome.trajectory - Trajectory data
   * @param {Object} outcome.context - Additional context
   * @returns {Object} Verdict with score and details
   */
  async judge(outcome) {
    try {
      const scores = {
        completion: this._scoreCompletion(outcome),
        quality: this._scoreQuality(outcome),
        practices: this._scorePractices(outcome),
        performance: this._scorePerformance(outcome)
      };

      // Calculate weighted total
      const totalScore = Object.keys(scores).reduce((sum, key) => {
        return sum + (scores[key] * this.weights[key]);
      }, 0);

      // Determine verdict category
      const verdict = this._categorizeVerdict(totalScore);

      // Extract learning signals
      const learnings = this._extractLearnings(scores, outcome);

      return {
        score: totalScore,
        verdict: verdict,
        scores: scores,
        learnings: learnings,
        details: {
          task: outcome.task,
          status: outcome.status,
          timestamp: Date.now()
        }
      };
    } catch (error) {
      console.error('Failed to judge outcome:', error.message);
      return {
        score: 0,
        verdict: 'error',
        error: error.message
      };
    }
  }

  /**
   * Score task completion (0-1)
   * Based on status and trajectory completion
   */
  _scoreCompletion(outcome) {
    const status = outcome.status?.toLowerCase() || '';

    // Status-based base score
    let score = 0;
    if (status === 'completed' || status === 'success') {
      score = 1.0;
    } else if (status === 'partial' || status === 'in_progress') {
      score = 0.5;
    } else if (status === 'failed' || status === 'error') {
      score = 0.0;
    }

    // Adjust based on trajectory
    if (outcome.trajectory) {
      const trajectory = outcome.trajectory;
      const stepCount = trajectory.steps?.length || 0;
      const avgReward = trajectory.current_reward / Math.max(stepCount, 1);

      // Trajectory completion boosts score
      if (stepCount > 0) {
        score = score * 0.7 + avgReward * 0.3;
      }
    }

    return Math.min(Math.max(score, 0), 1);
  }

  /**
   * Score quality (0-1)
   * Based on test coverage, error handling, documentation
   */
  _scoreQuality(outcome) {
    let score = 0.5; // Default neutral

    const context = outcome.context || {};

    // Test coverage
    if (context.test_coverage !== undefined) {
      score += context.test_coverage * 0.3;
    } else if (context.tests_written) {
      score += 0.2;
    }

    // Error handling
    if (context.error_handling || context.try_catch_blocks) {
      score += 0.2;
    }

    // Documentation
    if (context.documented || context.comments_added) {
      score += 0.15;
    }

    // Code review passed
    if (context.review_passed || context.approved) {
      score += 0.15;
    }

    // No errors/warnings
    if (!context.errors && !context.warnings) {
      score += 0.1;
    } else if (context.errors) {
      score -= 0.2;
    }

    return Math.min(Math.max(score, 0), 1);
  }

  /**
   * Score best practices adherence (0-1)
   * Based on code style, patterns, conventions
   */
  _scorePractices(outcome) {
    let score = 0.5; // Default neutral

    const context = outcome.context || {};

    // Linting passed
    if (context.lint_passed || context.no_lint_errors) {
      score += 0.25;
    } else if (context.lint_errors) {
      score -= 0.15;
    }

    // Type safety (TypeScript)
    if (context.type_safe || context.typescript) {
      score += 0.2;
    }

    // Design patterns used
    if (context.design_patterns || context.solid_principles) {
      score += 0.15;
    }

    // DRY (no duplication)
    if (context.no_duplication || context.dry) {
      score += 0.15;
    }

    // Naming conventions
    if (context.good_naming || context.descriptive_names) {
      score += 0.1;
    }

    // Security practices
    if (context.secure || context.no_hardcoded_secrets) {
      score += 0.15;
    } else if (context.security_issues) {
      score -= 0.3;
    }

    return Math.min(Math.max(score, 0), 1);
  }

  /**
   * Score performance/efficiency (0-1)
   * Based on execution time, resource usage, optimization
   */
  _scorePerformance(outcome) {
    let score = 0.5; // Default neutral

    const context = outcome.context || {};
    const trajectory = outcome.trajectory || {};

    // Execution time (trajectory length as proxy)
    const stepCount = trajectory.steps?.length || 0;
    if (stepCount > 0) {
      // Fewer steps = more efficient (up to a point)
      if (stepCount <= 5) {
        score += 0.2;
      } else if (stepCount <= 10) {
        score += 0.1;
      } else if (stepCount > 20) {
        score -= 0.1;
      }
    }

    // Performance metrics
    if (context.performance_optimized || context.efficient) {
      score += 0.25;
    }

    // Resource usage
    if (context.low_memory || context.fast_execution) {
      score += 0.2;
    }

    // Caching/memoization
    if (context.cached || context.memoized) {
      score += 0.15;
    }

    // Benchmarks passed
    if (context.benchmarks_passed) {
      score += 0.2;
    }

    return Math.min(Math.max(score, 0), 1);
  }

  /**
   * Categorize verdict based on total score
   */
  _categorizeVerdict(score) {
    if (score >= this.thresholds.success) {
      return 'success';
    } else if (score >= this.thresholds.partial) {
      return 'partial';
    } else if (score >= this.thresholds.failure) {
      return 'failure';
    } else {
      return 'critical_failure';
    }
  }

  /**
   * Extract learning signals from scores
   */
  _extractLearnings(scores, outcome) {
    const learnings = [];

    // Identify weak areas
    const weakAreas = Object.entries(scores)
      .filter(([_, score]) => score < 0.5)
      .map(([area, score]) => ({ area, score }))
      .sort((a, b) => a.score - b.score);

    for (const weak of weakAreas) {
      learnings.push({
        type: 'improvement_needed',
        area: weak.area,
        score: weak.score,
        suggestion: this._getSuggestion(weak.area, outcome)
      });
    }

    // Identify strong areas
    const strongAreas = Object.entries(scores)
      .filter(([_, score]) => score >= 0.8)
      .map(([area, score]) => ({ area, score }));

    for (const strong of strongAreas) {
      learnings.push({
        type: 'strength',
        area: strong.area,
        score: strong.score
      });
    }

    return learnings;
  }

  /**
   * Get improvement suggestions based on weak area
   */
  _getSuggestion(area, outcome) {
    const suggestions = {
      completion: 'Focus on completing all task requirements before marking as done',
      quality: 'Add comprehensive tests, error handling, and documentation',
      practices: 'Follow coding conventions, use design patterns, ensure security',
      performance: 'Optimize for efficiency, reduce unnecessary steps, use caching'
    };

    return suggestions[area] || 'Review and improve this area';
  }

  /**
   * Batch judge multiple outcomes
   */
  async batchJudge(outcomes) {
    const results = [];
    for (const outcome of outcomes) {
      const verdict = await this.judge(outcome);
      results.push(verdict);
    }

    return {
      total: results.length,
      verdicts: results,
      summary: {
        avg_score: results.reduce((sum, r) => sum + r.score, 0) / results.length,
        success_count: results.filter(r => r.verdict === 'success').length,
        failure_count: results.filter(r => r.verdict === 'failure' || r.verdict === 'critical_failure').length
      }
    };
  }

  /**
   * Get verdict statistics
   */
  getStats() {
    return {
      weights: this.weights,
      thresholds: this.thresholds,
      scoring_criteria: {
        completion: 'Task completion status and trajectory progress',
        quality: 'Test coverage, error handling, documentation',
        practices: 'Code style, patterns, security, conventions',
        performance: 'Efficiency, resource usage, optimization'
      }
    };
  }
}

module.exports = VerdictJudge;

// CLI usage
if (require.main === module) {
  (async () => {
    const judge = new VerdictJudge();

    console.log('⚖️ Verdict Judge - ReasoningBank Scoring\n');

    // Test case: Successful task
    const successCase = {
      task: 'Implement user authentication',
      status: 'completed',
      trajectory: {
        steps: [
          { reward: 0.8 },
          { reward: 0.9 },
          { reward: 0.85 }
        ],
        current_reward: 2.55
      },
      context: {
        test_coverage: 0.92,
        lint_passed: true,
        documented: true,
        no_hardcoded_secrets: true
      }
    };

    const verdict = await judge.judge(successCase);
    console.log('Test Case: Successful Authentication Implementation');
    console.log('Score:', verdict.score.toFixed(2));
    console.log('Verdict:', verdict.verdict);
    console.log('Breakdown:', verdict.scores);
    console.log('\nLearning Signals:', verdict.learnings);

    // Test case: Failed task
    const failCase = {
      task: 'Fix critical bug',
      status: 'failed',
      context: {
        errors: ['TypeError: undefined'],
        lint_errors: true
      }
    };

    const failVerdict = await judge.judge(failCase);
    console.log('\n\nTest Case: Failed Bug Fix');
    console.log('Score:', failVerdict.score.toFixed(2));
    console.log('Verdict:', failVerdict.verdict);
    console.log('Learning Signals:', failVerdict.learnings);
  })();
}
