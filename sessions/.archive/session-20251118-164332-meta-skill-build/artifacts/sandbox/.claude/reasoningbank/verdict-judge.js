#!/usr/bin/env node
/**
 * ReasoningBank Verdict Judge
 *
 * Stock-first implementation: Applies simple heuristics to judge trajectories
 * as success/failure/partial. No custom ML - uses outcome signals.
 *
 * Usage: node verdict-judge.js [--confidence-threshold 0.7]
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(process.cwd(), '.swarm', 'memory.db');

class VerdictJudge {
  constructor(dbPath = DB_PATH) {
    this.db = new sqlite3.Database(dbPath);
  }

  /**
   * Judge a single trajectory using simple heuristics
   * Stock-first: No ML, just outcome-based rules
   */
  judgeTrajectory(trajectory) {
    try {
      const data = JSON.parse(trajectory.trajectory_json);
      const outcome = data.outcome || {};

      // Simple heuristic rules (stock-first)
      let label = 'partial';
      let confidence = 0.5;
      let reasons = [];

      // Success indicators
      if (outcome.success === true || outcome.status === 'completed') {
        label = 'success';
        confidence = 0.9;
        reasons.push('Outcome marked as successful');
      } else if (outcome.success === false || outcome.status === 'failed') {
        label = 'failure';
        confidence = 0.9;
        reasons.push('Outcome marked as failed');
      }

      // Error detection
      if (outcome.error || outcome.errors || outcome.status === 'error') {
        label = 'failure';
        confidence = 0.95;
        reasons.push('Error detected in outcome');
      }

      // Performance indicators
      if (outcome.duration && outcome.duration < 1000) {
        confidence = Math.min(confidence + 0.05, 1.0);
        reasons.push('Fast execution time');
      }

      // Quality indicators
      if (outcome.quality_score && outcome.quality_score > 0.8) {
        confidence = Math.min(confidence + 0.1, 1.0);
        reasons.push('High quality score');
      } else if (outcome.quality_score && outcome.quality_score < 0.5) {
        label = 'partial';
        confidence = Math.max(confidence - 0.1, 0.3);
        reasons.push('Low quality score');
      }

      // Test results
      if (outcome.tests_passed && outcome.tests_total) {
        const passRate = outcome.tests_passed / outcome.tests_total;
        if (passRate >= 0.9) {
          label = 'success';
          confidence = 0.95;
          reasons.push(`High test pass rate: ${(passRate * 100).toFixed(1)}%`);
        } else if (passRate < 0.5) {
          label = 'failure';
          confidence = 0.85;
          reasons.push(`Low test pass rate: ${(passRate * 100).toFixed(1)}%`);
        }
      }

      return {
        label,
        confidence,
        reasons: reasons.join('; ')
      };
    } catch (err) {
      return {
        label: 'partial',
        confidence: 0.3,
        reasons: 'Unable to parse trajectory data'
      };
    }
  }

  /**
   * Judge all unjudged trajectories
   * Stock-first: Updates existing task_trajectories table
   */
  async judgeAll(minConfidence = 0.5) {
    return new Promise((resolve, reject) => {
      // Get unjudged trajectories
      this.db.all(`
        SELECT task_id, agent_id, trajectory_json
        FROM task_trajectories
        WHERE judge_label IS NULL
      `, async (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const results = {
          total: rows.length,
          judged: 0,
          success: 0,
          failure: 0,
          partial: 0
        };

        for (const row of rows) {
          const judgment = this.judgeTrajectory(row);

          // Only update if confidence meets threshold
          if (judgment.confidence >= minConfidence) {
            await new Promise((res, rej) => {
              this.db.run(`
                UPDATE task_trajectories
                SET judge_label = ?,
                    judge_conf = ?,
                    judge_reasons = ?
                WHERE task_id = ?
              `, [
                judgment.label,
                judgment.confidence,
                judgment.reasons,
                row.task_id
              ], (updateErr) => {
                if (updateErr) rej(updateErr);
                else {
                  results.judged++;
                  results[judgment.label]++;
                  res();
                }
              });
            });
          }
        }

        resolve(results);
      });
    });
  }

  /**
   * Get judgment statistics
   */
  async getStats() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT
          judge_label,
          COUNT(*) as count,
          AVG(judge_conf) as avg_confidence
        FROM task_trajectories
        WHERE judge_label IS NOT NULL
        GROUP BY judge_label
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
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
  const threshold = parseFloat(args[args.indexOf('--confidence-threshold') + 1] || '0.5');

  const judge = new VerdictJudge();

  judge.judgeAll(threshold)
    .then(results => {
      console.log('✅ Judgment complete:');
      console.log(`   Total trajectories: ${results.total}`);
      console.log(`   Judged: ${results.judged}`);
      console.log(`   Success: ${results.success}`);
      console.log(`   Failure: ${results.failure}`);
      console.log(`   Partial: ${results.partial}`);

      return judge.getStats();
    })
    .then(stats => {
      console.log('\n📊 Statistics:');
      stats.forEach(s => {
        console.log(`   ${s.judge_label}: ${s.count} (avg confidence: ${s.avg_confidence.toFixed(2)})`);
      });
      judge.close();
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      judge.close();
      process.exit(1);
    });
}

module.exports = VerdictJudge;
