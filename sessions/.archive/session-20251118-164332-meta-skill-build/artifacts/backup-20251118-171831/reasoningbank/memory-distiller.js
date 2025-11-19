#!/usr/bin/env node
/**
 * ReasoningBank Memory Distiller
 *
 * Stock-first implementation: Extracts successful patterns from judged trajectories
 * and stores them in the patterns table. Increments confidence on repetition.
 *
 * Usage: node memory-distiller.js [--min-confidence 0.8]
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(process.cwd(), '.swarm', 'memory.db');

class MemoryDistiller {
  constructor(dbPath = DB_PATH) {
    this.db = new sqlite3.Database(dbPath);
  }

  /**
   * Extract pattern from successful trajectory
   * Stock-first: Simple state→action extraction, no complex ML
   */
  extractPattern(trajectory) {
    try {
      const data = JSON.parse(trajectory.trajectory_json);

      // Extract the core pattern: state → action that succeeded
      const pattern = {
        state_context: data.state || {},
        successful_action: data.action,
        outcome_signals: {
          success: data.outcome?.success,
          quality: data.outcome?.quality_score,
          duration: data.outcome?.duration
        },
        agent_id: trajectory.agent_id,
        query: trajectory.query
      };

      // Generate stable ID based on state+action
      const patternKey = JSON.stringify({
        state: pattern.state_context,
        action: pattern.successful_action
      });
      const patternId = crypto.createHash('sha256').update(patternKey).digest('hex').substr(0, 16);

      return {
        id: patternId,
        pattern,
        confidence: trajectory.judge_conf || 0.8
      };
    } catch (err) {
      return null;
    }
  }

  /**
   * Store or update pattern in patterns table
   * Stock-first: Uses existing patterns table, increments confidence on repetition
   */
  async storePattern(patternId, patternData, confidence) {
    return new Promise((resolve, reject) => {
      // Check if pattern exists
      this.db.get(`
        SELECT id, confidence, usage_count
        FROM patterns
        WHERE id = ?
      `, [patternId], (err, existing) => {
        if (err) {
          reject(err);
          return;
        }

        if (existing) {
          // Pattern exists - increment confidence and usage
          const newConfidence = Math.min(existing.confidence + 0.05, 1.0);
          const newUsage = existing.usage_count + 1;

          this.db.run(`
            UPDATE patterns
            SET confidence = ?,
                usage_count = ?,
                last_used = datetime('now')
            WHERE id = ?
          `, [newConfidence, newUsage, patternId], (updateErr) => {
            if (updateErr) reject(updateErr);
            else resolve({ updated: true, confidence: newConfidence });
          });
        } else {
          // New pattern - insert
          this.db.run(`
            INSERT INTO patterns (id, type, pattern_data, confidence, usage_count)
            VALUES (?, ?, ?, ?, ?)
          `, [
            patternId,
            'reasoning_memory',
            JSON.stringify(patternData),
            confidence,
            1
          ], (insertErr) => {
            if (insertErr) reject(insertErr);
            else resolve({ created: true, confidence });
          });
        }
      });
    });
  }

  /**
   * Distill patterns from successful trajectories
   * Stock-first: Queries existing task_trajectories table
   */
  async distillPatterns(minJudgeConfidence = 0.8) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT task_id, agent_id, query, trajectory_json, judge_label, judge_conf
        FROM task_trajectories
        WHERE judge_label = 'success'
          AND judge_conf >= ?
      `, [minJudgeConfidence], async (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        const results = {
          total: rows.length,
          extracted: 0,
          created: 0,
          updated: 0,
          failed: 0
        };

        for (const row of rows) {
          const extracted = this.extractPattern(row);

          if (extracted) {
            try {
              const stored = await this.storePattern(
                extracted.id,
                extracted.pattern,
                extracted.confidence
              );

              results.extracted++;
              if (stored.created) results.created++;
              if (stored.updated) results.updated++;
            } catch (storeErr) {
              results.failed++;
            }
          }
        }

        resolve(results);
      });
    });
  }

  /**
   * Query learned patterns by confidence
   */
  async getTopPatterns(limit = 10) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT id, type, pattern_data, confidence, usage_count, created_at, last_used
        FROM patterns
        WHERE type = 'reasoning_memory'
        ORDER BY confidence DESC, usage_count DESC
        LIMIT ?
      `, [limit], (err, rows) => {
        if (err) reject(err);
        else {
          const patterns = rows.map(r => ({
            id: r.id,
            confidence: r.confidence,
            usage_count: r.usage_count,
            pattern: JSON.parse(r.pattern_data),
            created_at: r.created_at,
            last_used: r.last_used
          }));
          resolve(patterns);
        }
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
  const minConfidence = parseFloat(args[args.indexOf('--min-confidence') + 1] || '0.8');

  const distiller = new MemoryDistiller();

  distiller.distillPatterns(minConfidence)
    .then(results => {
      console.log('✅ Pattern distillation complete:');
      console.log(`   Successful trajectories: ${results.total}`);
      console.log(`   Patterns extracted: ${results.extracted}`);
      console.log(`   New patterns: ${results.created}`);
      console.log(`   Updated patterns: ${results.updated}`);
      if (results.failed > 0) {
        console.log(`   Failed: ${results.failed}`);
      }

      return distiller.getTopPatterns(5);
    })
    .then(patterns => {
      console.log('\n🧠 Top learned patterns:');
      patterns.forEach((p, i) => {
        console.log(`   ${i+1}. Confidence: ${p.confidence.toFixed(2)}, Usage: ${p.usage_count}`);
        console.log(`      Action: ${JSON.stringify(p.pattern.successful_action).substr(0, 60)}...`);
      });
      distiller.close();
    })
    .catch(err => {
      console.error('❌ Error:', err.message);
      distiller.close();
      process.exit(1);
    });
}

module.exports = MemoryDistiller;
