/**
 * Tests for CaptainsLog
 *
 * Covers captain's log integration and daily log management
 */

const { CaptainsLog } = require('../../../../../.claude/skills/prompt-improver/lib/captains-log');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('CaptainsLog', () => {
  let captainsLog;
  let testLogDir;

  beforeEach(() => {
    testLogDir = path.join(process.cwd(), 'test-captains-log');
    captainsLog = new CaptainsLog({
      captainsLogPath: testLogDir,
      captainsLog: true
    });
  });

  afterEach(() => {
    // Clean up test log directory
    if (fs.existsSync(testLogDir)) {
      fs.rmSync(testLogDir, { recursive: true, force: true });
    }
  });

  describe('Improvement Logging', () => {
    it('should log improvement to daily file', async () => {
      const entry = {
        mode: 'swarm',
        prompt: 'Build a REST API with authentication',
        improvements: [
          {
            type: 'structure',
            action: 'Add framework specification',
            details: ['Express.js', 'JWT']
          }
        ],
        timestamp: Date.now()
      };

      await captainsLog.logImprovement(entry);

      const logFile = captainsLog._getTodaysLogFile();
      assert.ok(fs.existsSync(logFile));

      const content = fs.readFileSync(logFile, 'utf8');
      assert.ok(content.includes('Prompt Improvement'));
      assert.ok(content.includes('swarm'));
    });

    it('should create log file with header if not exists', async () => {
      const entry = {
        mode: 'direct',
        prompt: 'Test prompt',
        improvements: [],
        timestamp: Date.now()
      };

      await captainsLog.logImprovement(entry);

      const logFile = captainsLog._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      assert.ok(content.includes("Captain's Log"));
    });

    it('should append to existing log file', async () => {
      const entry1 = {
        mode: 'swarm',
        prompt: 'First prompt',
        improvements: [],
        timestamp: Date.now()
      };

      const entry2 = {
        mode: 'hive',
        prompt: 'Second prompt',
        improvements: [],
        timestamp: Date.now()
      };

      await captainsLog.logImprovement(entry1);
      await captainsLog.logImprovement(entry2);

      const logFile = captainsLog._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      assert.ok(content.includes('First prompt'));
      assert.ok(content.includes('Second prompt'));
    });

    it('should truncate long prompts', async () => {
      const longPrompt = 'A'.repeat(200);
      const entry = {
        mode: 'direct',
        prompt: longPrompt,
        improvements: [],
        timestamp: Date.now()
      };

      await captainsLog.logImprovement(entry);

      const logFile = captainsLog._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      // Should be truncated to 100 chars + '...'
      assert.ok(!content.includes('A'.repeat(200)));
      assert.ok(content.includes('...'));
    });

    it('should format improvements with details', async () => {
      const entry = {
        mode: 'swarm',
        prompt: 'Test',
        improvements: [
          {
            type: 'structure',
            action: 'Add framework',
            details: ['Express', 'Fastify']
          },
          {
            type: 'clarity',
            action: 'Remove ambiguity',
            details: { term: 'it', replacement: 'the API' }
          }
        ],
        timestamp: Date.now()
      };

      await captainsLog.logImprovement(entry);

      const logFile = captainsLog._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      assert.ok(content.includes('structure: Add framework'));
      assert.ok(content.includes('Details:'));
    });

    it('should handle missing improvements array', async () => {
      const entry = {
        mode: 'direct',
        prompt: 'Test',
        timestamp: Date.now()
      };

      await captainsLog.logImprovement(entry);

      const logFile = captainsLog._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      assert.ok(content.includes('Test'));
    });

    it('should skip logging when disabled', async () => {
      const disabledLog = new CaptainsLog({
        captainsLogPath: testLogDir,
        captainsLog: false
      });

      const entry = {
        mode: 'direct',
        prompt: 'Test',
        timestamp: Date.now()
      };

      await disabledLog.logImprovement(entry);

      // No log file should be created
      const files = fs.existsSync(testLogDir) ? fs.readdirSync(testLogDir) : [];
      assert.strictEqual(files.length, 0);
    });
  });

  describe('Statistics Logging', () => {
    it('should log statistics', async () => {
      const stats = {
        totalImprovements: 42,
        totalRejections: 8,
        acceptanceRate: 0.84,
        topImprovementTypes: [
          { type: 'structure:add-goal', count: 15 },
          { type: 'clarity:remove-ambiguity', count: 12 }
        ],
        recentTrend: {
          trend: 'improving',
          rate: 0.9,
          improvements: 30,
          rejections: 3,
          days: 7
        }
      };

      await captainsLog.logStats(stats);

      const logFile = captainsLog._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      assert.ok(content.includes('Statistics'));
      assert.ok(content.includes('42')); // totalImprovements
      assert.ok(content.includes('84.0%')); // acceptanceRate
    });

    it('should format performance metrics', async () => {
      const stats = {
        totalImprovements: 10,
        totalRejections: 2,
        acceptanceRate: 0.833333,
        topImprovementTypes: [],
        recentTrend: null
      };

      await captainsLog.logStats(stats);

      const logFile = captainsLog._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      assert.ok(content.includes('Performance'));
      assert.ok(content.includes('10')); // improvements
      assert.ok(content.includes('2')); // rejections
      assert.ok(content.includes('83.3%')); // acceptance rate
    });

    it('should format top improvement types', async () => {
      const stats = {
        totalImprovements: 20,
        totalRejections: 5,
        acceptanceRate: 0.8,
        topImprovementTypes: [
          { type: 'structure:add-goal', count: 8 },
          { type: 'clarity:remove-it', count: 6 },
          { type: 'specificity:add-numbers', count: 4 }
        ],
        recentTrend: null
      };

      await captainsLog.logStats(stats);

      const logFile = captainsLog._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      assert.ok(content.includes('Top Improvement Types'));
      assert.ok(content.includes('structure:add-goal: 8 times'));
    });

    it('should format recent trend', async () => {
      const stats = {
        totalImprovements: 100,
        totalRejections: 10,
        acceptanceRate: 0.91,
        topImprovementTypes: [],
        recentTrend: {
          trend: 'improving',
          rate: 0.95,
          improvements: 38,
          rejections: 2,
          days: 7
        }
      };

      await captainsLog.logStats(stats);

      const logFile = captainsLog._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      assert.ok(content.includes('Recent Trend'));
      assert.ok(content.includes('improving'));
      assert.ok(content.includes('95.0%'));
      assert.ok(content.includes('38')); // improvements
      assert.ok(content.includes('2')); // rejections
    });

    it('should handle empty top improvement types', async () => {
      const stats = {
        totalImprovements: 5,
        totalRejections: 0,
        acceptanceRate: 1.0,
        topImprovementTypes: [],
        recentTrend: null
      };

      await captainsLog.logStats(stats);

      const logFile = captainsLog._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      assert.ok(content.includes('Statistics'));
      assert.ok(!content.includes('Top Improvement Types'));
    });

    it('should skip logging when disabled', async () => {
      const disabledLog = new CaptainsLog({
        captainsLogPath: testLogDir,
        captainsLog: false
      });

      const stats = {
        totalImprovements: 10,
        totalRejections: 2,
        acceptanceRate: 0.83
      };

      await disabledLog.logStats(stats);

      const files = fs.existsSync(testLogDir) ? fs.readdirSync(testLogDir) : [];
      assert.strictEqual(files.length, 0);
    });
  });

  describe('Daily Log File Management', () => {
    it('should use correct date format in filename', () => {
      const logFile = captainsLog._getTodaysLogFile();
      const filename = path.basename(logFile);

      // Should be YYYY-MM-DD.md format
      assert.ok(/^\d{4}-\d{2}-\d{2}\.md$/.test(filename));
    });

    it('should create directory if not exists', async () => {
      const entry = {
        mode: 'direct',
        prompt: 'Test',
        improvements: [],
        timestamp: Date.now()
      };

      await captainsLog.logImprovement(entry);

      assert.ok(fs.existsSync(testLogDir));
    });

    it('should create separate files for different days', () => {
      // Mock different dates
      const originalToISOString = Date.prototype.toISOString;

      Date.prototype.toISOString = function() {
        return '2025-01-15T12:00:00.000Z';
      };
      const file1 = captainsLog._getTodaysLogFile();

      Date.prototype.toISOString = function() {
        return '2025-01-16T12:00:00.000Z';
      };
      const file2 = captainsLog._getTodaysLogFile();

      // Restore original
      Date.prototype.toISOString = originalToISOString;

      assert.notStrictEqual(file1, file2);
    });
  });

  describe('String Truncation', () => {
    it('should not truncate short strings', () => {
      const short = 'Short string';
      const truncated = captainsLog._truncate(short, 100);
      assert.strictEqual(truncated, short);
    });

    it('should truncate long strings', () => {
      const long = 'A'.repeat(200);
      const truncated = captainsLog._truncate(long, 100);

      assert.ok(truncated.length <= 103); // 100 + '...'
      assert.ok(truncated.endsWith('...'));
    });

    it('should truncate at exact max length', () => {
      const exact = 'A'.repeat(100);
      const truncated = captainsLog._truncate(exact, 100);

      assert.strictEqual(truncated, exact);
    });

    it('should handle empty strings', () => {
      const truncated = captainsLog._truncate('', 100);
      assert.strictEqual(truncated, '');
    });
  });

  describe('Error Handling', () => {
    it('should handle logging errors gracefully', async () => {
      const invalidLog = new CaptainsLog({
        captainsLogPath: '/invalid/path/that/cannot/be/created',
        captainsLog: true
      });

      const entry = {
        mode: 'direct',
        prompt: 'Test',
        timestamp: Date.now()
      };

      // Should not throw
      await invalidLog.logImprovement(entry);
    });

    it('should handle stats logging errors gracefully', async () => {
      const invalidLog = new CaptainsLog({
        captainsLogPath: '/invalid/path',
        captainsLog: true
      });

      const stats = {
        totalImprovements: 10,
        totalRejections: 2,
        acceptanceRate: 0.83
      };

      // Should not throw
      await invalidLog.logStats(stats);
    });

    it('should handle missing timestamp gracefully', async () => {
      const entry = {
        mode: 'direct',
        prompt: 'Test',
        improvements: []
        // No timestamp
      };

      // Should not throw
      await captainsLog.logImprovement(entry);
    });

    it('should handle malformed improvement entries', async () => {
      const entry = {
        mode: 'direct',
        prompt: 'Test',
        improvements: [
          // Missing required fields
          { type: 'test' },
          null,
          undefined,
          { action: 'something' }
        ],
        timestamp: Date.now()
      };

      // Should not throw
      await captainsLog.logImprovement(entry);
    });
  });

  describe('Format Entry Functions', () => {
    it('should format log entry with all fields', () => {
      const entry = {
        mode: 'swarm',
        prompt: 'Build comprehensive API system',
        improvements: [
          {
            type: 'structure',
            action: 'Add architecture details',
            details: ['microservices', 'REST']
          }
        ],
        timestamp: Date.now()
      };

      const formatted = captainsLog._formatLogEntry(entry);

      assert.ok(formatted.includes('## Prompt Improvement'));
      assert.ok(formatted.includes('Mode')); assert.ok(formatted.includes('swarm'));
      assert.ok(formatted.includes('Original Prompt'));
      assert.ok(formatted.includes('Improvements Applied'));
      assert.ok(formatted.includes('Impact'));
    });

    it('should format stats entry with all fields', () => {
      const stats = {
        totalImprovements: 50,
        totalRejections: 10,
        acceptanceRate: 0.833,
        topImprovementTypes: [
          { type: 'structure:add', count: 20 }
        ],
        recentTrend: {
          trend: 'stable',
          rate: 0.8,
          improvements: 40,
          rejections: 10,
          days: 7
        }
      };

      const formatted = captainsLog._formatStatsEntry(stats);

      assert.ok(formatted.includes('## Prompt Improver Statistics'));
      assert.ok(formatted.includes('Performance'));
      assert.ok(formatted.includes('50')); // improvements
      assert.ok(formatted.includes('Top Improvement Types'));
      assert.ok(formatted.includes('Recent Trend'));
    });

    it('should handle array details in improvements', () => {
      const entry = {
        mode: 'direct',
        prompt: 'Test',
        improvements: [
          {
            type: 'test',
            action: 'Action',
            details: ['item1', 'item2', 'item3']
          }
        ],
        timestamp: Date.now()
      };

      const formatted = captainsLog._formatLogEntry(entry);

      assert.ok(formatted.includes('item1, item2, item3'));
    });

    it('should handle object details in improvements', () => {
      const entry = {
        mode: 'direct',
        prompt: 'Test',
        improvements: [
          {
            type: 'test',
            action: 'Action',
            details: { key: 'value', other: 'data' }
          }
        ],
        timestamp: Date.now()
      };

      const formatted = captainsLog._formatLogEntry(entry);

      assert.ok(formatted.includes('Details:'));
    });
  });
});

// Run if executed directly
if (require.main === module) {
  console.log('CaptainsLog tests defined. Use Jest or similar test runner to execute.');
  process.exit(0);
}

module.exports = { describe };
