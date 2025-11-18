/**
 * Apply database migration for consensus enhancements
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve('.hive-mind/hive.db');
const MIGRATION_PATH = path.join(__dirname, 'db-migration.sql');

async function applyMigration() {
  console.log('Applying consensus database migration...');

  // Read migration SQL
  const sql = fs.readFileSync(MIGRATION_PATH, 'utf8');

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }

      // Execute migration SQL
      db.exec(sql, (execErr) => {
        if (execErr) {
          db.close();
          reject(execErr);
          return;
        }

        console.log('✓ Migration applied successfully');

        // Verify indexes
        db.all(
          `SELECT name, sql FROM sqlite_master
           WHERE type = 'index'
           AND name LIKE 'idx_consensus%'
           ORDER BY name`,
          (err, indexes) => {
            if (err) {
              db.close();
              reject(err);
              return;
            }

            console.log('\n✓ Consensus indexes created:');
            indexes.forEach(idx => {
              console.log(`  - ${idx.name}`);
            });

            // Verify views
            db.all(
              `SELECT name FROM sqlite_master
               WHERE type = 'view'
               AND (name = 'consensus_analytics' OR name = 'vote_participation')`,
              (err, views) => {
                if (err) {
                  db.close();
                  reject(err);
                  return;
                }

                console.log('\n✓ Consensus views created:');
                views.forEach(view => {
                  console.log(`  - ${view.name}`);
                });

                // Verify triggers
                db.all(
                  `SELECT name FROM sqlite_master
                   WHERE type = 'trigger'
                   AND (name = 'update_agent_on_vote' OR name = 'log_consensus_decision')`,
                  (err, triggers) => {
                    db.close();

                    if (err) {
                      reject(err);
                      return;
                    }

                    console.log('\n✓ Consensus triggers created:');
                    triggers.forEach(trigger => {
                      console.log(`  - ${trigger.name}`);
                    });

                    console.log('\n✅ Migration completed successfully!\n');
                    resolve();
                  }
                );
              }
            );
          }
        );
      });
    });
  });
}

// Run migration if called directly
if (require.main === module) {
  applyMigration()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = applyMigration;
