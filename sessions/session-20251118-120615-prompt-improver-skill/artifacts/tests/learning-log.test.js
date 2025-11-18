/**
 * Tests for LearningLog
 *
 * Covers improvement tracking, rejection tracking, and statistics
 */

const { LearningLog } = require('../../../../../.claude/skills/prompt-improver/lib/learning-log');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('LearningLog', () => {
  let log;
  let testLogDir;

  beforeEach(() => {
    testLogDir = path.join(process.cwd(), '.prompt-improver-learning-test');
    log = new LearningLog({
      learningLogPath: testLogDir,
      maxLearningEntries: 100
    });
  });

  afterEach(() => {
    // Clean up test log directory
    if (fs.existsSync(testLogDir)) {
      fs.rmSync(testLogDir, { recursive: true, force: true });
    }
  });

  describe('Recording Improvements', () => {
    it('should record successful improvement', async () => {
      const entry = {
        originalPrompt: 'Build API',
        improvedPrompt: 'Build REST API with Express.js',
        suggestions: {
          structure: ['add-framework', 'add-type'],
          specificity: ['add-details']
        }
      };

      await log.record(entry);

      // Verify file was created
      const logFile = path.join(testLogDir, 'improvements.jsonl');
      assert.ok(fs.existsSync(logFile));

      // Verify content
      const content = fs.readFileSync(logFile, 'utf8');
      assert.ok(content.includes('Build API'));
    });

    it('should add timestamp if not provided', async () => {
      const entry = {
        originalPrompt: 'Test prompt',
        improvedPrompt: 'Improved test prompt'
      };

      await log.record(entry);

      const logFile = path.join(testLogDir, 'improvements.jsonl');
      const content = fs.readFileSync(logFile, 'utf8');
      const logged = JSON.parse(content.trim());

      assert.ok(logged.timestamp);
    });

    it('should preserve provided timestamp', async () => {
      const timestamp = Date.now() - 10000;
      const entry = {
        originalPrompt: 'Test',
        improvedPrompt: 'Improved',
        timestamp
      };

      await log.record(entry);

      const logFile = path.join(testLogDir, 'improvements.jsonl');
      const content = fs.readFileSync(logFile, 'utf8');
      const logged = JSON.parse(content.trim());

      assert.strictEqual(logged.timestamp, timestamp);
    });

    it('should add type field', async () => {
      const entry = {
        originalPrompt: 'Test',
        improvedPrompt: 'Improved'
      };

      await log.record(entry);

      const logFile = path.join(testLogDir, 'improvements.jsonl');
      const content = fs.readFileSync(logFile, 'utf8');
      const logged = JSON.parse(content.trim());

      assert.strictEqual(logged.type, 'improvement');
    });

    it('should append to existing log file', async () => {
      await log.record({ originalPrompt: 'First', improvedPrompt: 'First improved' });
      await log.record({ originalPrompt: 'Second', improvedPrompt: 'Second improved' });

      const logFile = path.join(testLogDir, 'improvements.jsonl');
      const content = fs.readFileSync(logFile, 'utf8');
      const lines = content.trim().split('\n');

      assert.strictEqual(lines.length, 2);
    });

    it('should handle recording errors gracefully', async () => {
      // Try to record to invalid path
      const invalidLog = new LearningLog({
        learningLogPath: '/invalid/path/that/cannot/be/created'
      });

      // Should not throw
      await invalidLog.record({ prompt: 'test' });
    });
  });

  describe('Recording Rejections', () => {
    it('should record rejection', async () => {
      const entry = {
        prompt: 'Do something',
        suggestions: ['add-specificity'],
        reason: 'Too vague'
      };

      await log.recordRejection(entry);

      const logFile = path.join(testLogDir, 'rejections.jsonl');
      assert.ok(fs.existsSync(logFile));

      const content = fs.readFileSync(logFile, 'utf8');
      assert.ok(content.includes('Too vague'));
    });

    it('should add timestamp and type to rejection', async () => {
      const entry = {
        prompt: 'Test',
        reason: 'Test reason'
      };

      await log.recordRejection(entry);

      const logFile = path.join(testLogDir, 'rejections.jsonl');
      const content = fs.readFileSync(logFile, 'utf8');
      const logged = JSON.parse(content.trim());

      assert.ok(logged.timestamp);
      assert.strictEqual(logged.type, 'rejection');
    });
  });

  describe('Log Rotation', () => {
    it('should rotate log when exceeding max entries', async () => {
      // Set low max for testing
      const rotatingLog = new LearningLog({
        learningLogPath: testLogDir,
        maxLearningEntries: 5
      });

      // Add more than max entries
      for (let i = 0; i < 10; i++) {
        await rotatingLog.record({
          originalPrompt: `Prompt ${i}`,
          improvedPrompt: `Improved ${i}`
        });
      }

      const logFile = path.join(testLogDir, 'improvements.jsonl');
      const content = fs.readFileSync(logFile, 'utf8');
      const lines = content.trim().split('\n').filter(l => l);

      // Should keep only last 5 entries
      assert.ok(lines.length <= 5);
    });

    it('should create archive file when rotating', async () => {
      const rotatingLog = new LearningLog({
        learningLogPath: testLogDir,
        maxLearningEntries: 3
      });

      // Add entries
      for (let i = 0; i < 10; i++) {
        await rotatingLog.record({
          originalPrompt: `Prompt ${i}`,
          improvedPrompt: `Improved ${i}`
        });
      }

      // Check for archive file
      const files = fs.readdirSync(testLogDir);
      const archiveFiles = files.filter(f => f.includes('archive'));

      assert.ok(archiveFiles.length > 0);
    });

    it('should handle rotation errors gracefully', async () => {
      const rotatingLog = new LearningLog({
        learningLogPath: testLogDir,
        maxLearningEntries: 2
      });

      // Should not throw even if rotation has issues
      for (let i = 0; i < 5; i++) {
        await rotatingLog.record({
          originalPrompt: `Test ${i}`,
          improvedPrompt: `Improved ${i}`
        });
      }
    });
  });

  describe('Statistics', () => {
    it('should calculate basic statistics', async () => {
      // Add some improvements
      await log.record({
        originalPrompt: 'Test 1',
        improvedPrompt: 'Improved 1',
        suggestions: { structure: ['add-goal'] }
      });
      await log.record({
        originalPrompt: 'Test 2',
        improvedPrompt: 'Improved 2',
        suggestions: { clarity: ['remove-ambiguity'] }
      });

      // Add some rejections
      await log.recordRejection({
        prompt: 'Bad 1',
        reason: 'Too vague'
      });

      const stats = await log.getStats();

      assert.strictEqual(stats.totalImprovements, 2);
      assert.strictEqual(stats.totalRejections, 1);
      assert.ok(stats.acceptanceRate > 0);
    });

    it('should calculate acceptance rate', async () => {
      await log.record({ originalPrompt: 'A', improvedPrompt: 'B' });
      await log.record({ originalPrompt: 'C', improvedPrompt: 'D' });
      await log.recordRejection({ prompt: 'E', reason: 'Bad' });

      const stats = await log.getStats();

      // 2 improvements, 1 rejection = 2/3 acceptance
      assert.ok(Math.abs(stats.acceptanceRate - 0.6667) < 0.01);
    });

    it('should identify top improvement types', async () => {
      await log.record({
        originalPrompt: 'Test 1',
        improvedPrompt: 'Improved 1',
        suggestions: {
          structure: [{ type: 'add-goal' }]
        }
      });
      await log.record({
        originalPrompt: 'Test 2',
        improvedPrompt: 'Improved 2',
        suggestions: {
          structure: [{ type: 'add-goal' }],
          clarity: [{ type: 'remove-ambiguity' }]
        }
      });

      const stats = await log.getStats();

      assert.ok(stats.topImprovementTypes);
      assert.ok(stats.topImprovementTypes.length > 0);
    });

    it('should identify top rejection reasons', async () => {
      await log.recordRejection({ prompt: 'A', reason: 'Too vague' });
      await log.recordRejection({ prompt: 'B', reason: 'Too vague' });
      await log.recordRejection({ prompt: 'C', reason: 'Missing context' });

      const stats = await log.getStats();

      assert.ok(stats.topRejectionReasons);
      assert.ok(stats.topRejectionReasons.length > 0);
      assert.strictEqual(stats.topRejectionReasons[0].reason, 'Too vague');
      assert.strictEqual(stats.topRejectionReasons[0].count, 2);
    });

    it('should calculate recent trend', async () => {
      const now = Date.now();

      // Add recent improvements
      await log.record({
        originalPrompt: 'Recent 1',
        improvedPrompt: 'Improved 1',
        timestamp: now - 3600000 // 1 hour ago
      });
      await log.record({
        originalPrompt: 'Recent 2',
        improvedPrompt: 'Improved 2',
        timestamp: now - 7200000 // 2 hours ago
      });

      // Add old improvement (outside 7 day window)
      await log.record({
        originalPrompt: 'Old',
        improvedPrompt: 'Old improved',
        timestamp: now - (8 * 24 * 60 * 60 * 1000) // 8 days ago
      });

      const stats = await log.getStats();

      assert.ok(stats.recentTrend);
      assert.strictEqual(stats.recentTrend.improvements, 2);
      assert.strictEqual(stats.recentTrend.days, 7);
    });

    it('should classify trend as improving', async () => {
      const now = Date.now();

      // Add many improvements, few rejections
      for (let i = 0; i < 8; i++) {
        await log.record({
          originalPrompt: `Test ${i}`,
          improvedPrompt: `Improved ${i}`,
          timestamp: now - (i * 3600000)
        });
      }

      await log.recordRejection({
        prompt: 'Bad',
        reason: 'Test',
        timestamp: now - 3600000
      });

      const stats = await log.getStats();

      assert.strictEqual(stats.recentTrend.trend, 'improving');
    });

    it('should classify trend as declining', async () => {
      const now = Date.now();

      // Add many rejections, few improvements
      for (let i = 0; i < 8; i++) {
        await log.recordRejection({
          prompt: `Bad ${i}`,
          reason: 'Test',
          timestamp: now - (i * 3600000)
        });
      }

      await log.record({
        originalPrompt: 'Good',
        improvedPrompt: 'Better',
        timestamp: now - 3600000
      });

      const stats = await log.getStats();

      assert.strictEqual(stats.recentTrend.trend, 'declining');
    });

    it('should handle no data gracefully', async () => {
      const stats = await log.getStats();

      assert.strictEqual(stats.totalImprovements, 0);
      assert.strictEqual(stats.totalRejections, 0);
      assert.ok(isNaN(stats.acceptanceRate) || stats.acceptanceRate === 0);
    });
  });

  describe('Successful Patterns', () => {
    it('should retrieve successful patterns by category', async () => {
      await log.record({
        originalPrompt: 'Build API',
        improvedPrompt: 'Build REST API with Express',
        suggestions: {
          structure: ['add-framework'],
          specificity: ['add-type']
        },
        userSelections: {
          structure: ['add-framework']
        }
      });

      const patterns = await log.getSuccessfulPatterns('structure', 10);

      assert.ok(patterns.length > 0);
      assert.strictEqual(patterns[0].originalPrompt, 'Build API');
    });

    it('should filter patterns by category', async () => {
      await log.record({
        originalPrompt: 'Test',
        improvedPrompt: 'Improved',
        suggestions: {
          clarity: ['remove-ambiguity']
        }
      });
      await log.record({
        originalPrompt: 'Test 2',
        improvedPrompt: 'Improved 2',
        suggestions: {
          structure: ['add-goal']
        }
      });

      const clarityPatterns = await log.getSuccessfulPatterns('clarity', 10);

      assert.strictEqual(clarityPatterns.length, 1);
    });

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 10; i++) {
        await log.record({
          originalPrompt: `Test ${i}`,
          improvedPrompt: `Improved ${i}`,
          suggestions: {
            structure: ['add-something']
          }
        });
      }

      const patterns = await log.getSuccessfulPatterns('structure', 3);

      assert.strictEqual(patterns.length, 3);
    });

    it('should return most recent patterns', async () => {
      await log.record({
        originalPrompt: 'First',
        improvedPrompt: 'First improved',
        suggestions: { structure: ['test'] },
        timestamp: Date.now() - 10000
      });
      await log.record({
        originalPrompt: 'Second',
        improvedPrompt: 'Second improved',
        suggestions: { structure: ['test'] },
        timestamp: Date.now()
      });

      const patterns = await log.getSuccessfulPatterns('structure', 10);

      // Most recent should be 'Second'
      assert.strictEqual(patterns[patterns.length - 1].originalPrompt, 'Second');
    });

    it('should handle category with no patterns', async () => {
      const patterns = await log.getSuccessfulPatterns('nonexistent', 10);
      assert.strictEqual(patterns.length, 0);
    });
  });

  describe('Rejection Patterns', () => {
    it('should retrieve rejection patterns', async () => {
      await log.recordRejection({
        prompt: 'Bad prompt',
        suggestions: ['improve'],
        reason: 'Too vague'
      });

      const patterns = await log.getRejectionPatterns(10);

      assert.ok(patterns.length > 0);
      assert.strictEqual(patterns[0].prompt, 'Bad prompt');
      assert.strictEqual(patterns[0].reason, 'Too vague');
    });

    it('should respect limit for rejection patterns', async () => {
      for (let i = 0; i < 10; i++) {
        await log.recordRejection({
          prompt: `Bad ${i}`,
          reason: 'Test'
        });
      }

      const patterns = await log.getRejectionPatterns(5);
      assert.strictEqual(patterns.length, 5);
    });

    it('should return most recent rejections', async () => {
      await log.recordRejection({
        prompt: 'Old',
        reason: 'Old reason',
        timestamp: Date.now() - 10000
      });
      await log.recordRejection({
        prompt: 'Recent',
        reason: 'Recent reason',
        timestamp: Date.now()
      });

      const patterns = await log.getRejectionPatterns(10);

      assert.strictEqual(patterns[patterns.length - 1].prompt, 'Recent');
    });
  });

  describe('Log File Reading', () => {
    it('should read and parse log file', async () => {
      await log.record({ originalPrompt: 'Test', improvedPrompt: 'Improved' });

      const entries = await log._readLog('improvements.jsonl');

      assert.ok(entries.length > 0);
      assert.strictEqual(entries[0].originalPrompt, 'Test');
    });

    it('should handle non-existent log file', async () => {
      const entries = await log._readLog('nonexistent.jsonl');
      assert.strictEqual(entries.length, 0);
    });

    it('should skip invalid JSON lines', async () => {
      const logFile = path.join(testLogDir, 'test.jsonl');
      fs.mkdirSync(testLogDir, { recursive: true });
      fs.writeFileSync(logFile,
        '{"valid": true}\n' +
        'invalid json line\n' +
        '{"also": "valid"}\n',
        'utf8'
      );

      const entries = await log._readLog('test.jsonl');

      assert.strictEqual(entries.length, 2);
    });

    it('should filter empty lines', async () => {
      const logFile = path.join(testLogDir, 'test.jsonl');
      fs.mkdirSync(testLogDir, { recursive: true });
      fs.writeFileSync(logFile,
        '{"test": 1}\n' +
        '\n' +
        '{"test": 2}\n' +
        '\n\n',
        'utf8'
      );

      const entries = await log._readLog('test.jsonl');

      assert.strictEqual(entries.length, 2);
    });
  });

  describe('Error Handling', () => {
    it('should handle getStats errors gracefully', async () => {
      const invalidLog = new LearningLog({
        learningLogPath: '/invalid/path'
      });

      const stats = await invalidLog.getStats();
      assert.strictEqual(stats, null);
    });

    it('should handle getSuccessfulPatterns errors gracefully', async () => {
      const invalidLog = new LearningLog({
        learningLogPath: '/invalid/path'
      });

      const patterns = await invalidLog.getSuccessfulPatterns('test', 10);
      assert.strictEqual(patterns.length, 0);
    });

    it('should handle getRejectionPatterns errors gracefully', async () => {
      const invalidLog = new LearningLog({
        learningLogPath: '/invalid/path'
      });

      const patterns = await invalidLog.getRejectionPatterns(10);
      assert.strictEqual(patterns.length, 0);
    });
  });
});

// Run if executed directly
if (require.main === module) {
  console.log('LearningLog tests defined. Use Jest or similar test runner to execute.');
  process.exit(0);
}

module.exports = { describe };
