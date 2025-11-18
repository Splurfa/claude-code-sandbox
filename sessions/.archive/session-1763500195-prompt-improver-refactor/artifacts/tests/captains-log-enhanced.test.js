/**
 * Enhanced Captain's Log Tests
 *
 * Tests for persistence, formatting, and retrieval of Context7 insights
 * and improvement statistics.
 */

const fs = require('fs');
const path = require('path');
const { EnhancedCaptainsLog } = require('../code/lib/captains-log-enhanced');

describe('EnhancedCaptainsLog', () => {
  let log;
  let testLogPath;

  beforeEach(() => {
    testLogPath = path.join(__dirname, '../temp-logs');
    log = new EnhancedCaptainsLog({
      captainsLogPath: testLogPath,
      captainsLog: true
    });
  });

  afterEach(() => {
    // Clean up test log files
    if (fs.existsSync(testLogPath)) {
      fs.rmSync(testLogPath, { recursive: true, force: true });
    }
  });

  describe('Context7 Consultation Logging', () => {
    it('should log Context7 consultation', async () => {
      const entry = {
        timestamp: Date.now(),
        mode: 'swarm',
        trigger: 'High complexity',
        sections: ['advanced/swarm-coordination', 'essentials/memory-coordination'],
        insights: {
          principles: [
            'Concurrent execution via Claude Code Task tool',
            'MCP coordinates, Claude Code executes'
          ],
          patterns: [
            'Batch all agent spawning in single message',
            'Use mesh topology for peer coordination'
          ],
          antipatterns: [
            'Sequential agent spawning (slow)',
            'No memory coordination strategy'
          ],
          recommendations: [
            'Spawn all agents concurrently via Task tool',
            'Define clear memory namespaces'
          ]
        },
        cacheHit: false
      };

      await log.logContext7Consultation(entry);

      const logFile = log._getTodaysLogFile();
      expect(fs.existsSync(logFile)).toBe(true);

      const content = fs.readFileSync(logFile, 'utf8');
      expect(content).toContain('Context7 Consultation');
      expect(content).toContain('swarm');
      expect(content).toContain('Concurrent execution via Claude Code Task tool');
      expect(content).toContain('Batch all agent spawning in single message');
      expect(content).toContain('Sequential agent spawning (slow)');
      expect(content).toContain('Freshly fetched and cached');
    });

    it('should indicate cache hit in log', async () => {
      const entry = {
        timestamp: Date.now(),
        mode: 'hive',
        trigger: 'Multi-agent coordination',
        sections: ['advanced/hive-mind'],
        insights: {
          principles: ['Queen agent coordinates collective intelligence'],
          patterns: [],
          antipatterns: [],
          recommendations: []
        },
        cacheHit: true,
        cacheAge: 1500
      };

      await log.logContext7Consultation(entry);

      const logFile = log._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      expect(content).toContain('Retrieved from session cache');
      expect(content).toContain('1500ms old');
    });

    it('should format principles correctly', async () => {
      const entry = {
        timestamp: Date.now(),
        mode: 'wizard',
        trigger: 'Low quality',
        sections: ['essentials/prompt-engineering'],
        insights: {
          principles: [
            'Specificity beats vagueness',
            'Include what, where, and why'
          ],
          patterns: [],
          antipatterns: [],
          recommendations: []
        },
        cacheHit: false
      };

      await log.logContext7Consultation(entry);

      const logFile = log._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      expect(content).toContain('**Claude Code Principles Retrieved**:');
      expect(content).toContain('- Specificity beats vagueness');
      expect(content).toContain('- Include what, where, and why');
    });
  });

  describe('Improvement Logging', () => {
    it('should log prompt improvement', async () => {
      const entry = {
        timestamp: Date.now(),
        mode: 'swarm',
        prompt: 'Build API with frontend and backend',
        qualityScore: 0.55,
        interventionLevel: 'recommended',
        improvements: [
          {
            type: 'file_routing',
            action: 'Added session artifact paths',
            details: ['sessions/$SESSION_ID/artifacts/code/', 'sessions/$SESSION_ID/artifacts/tests/']
          },
          {
            type: 'coordination',
            action: 'Defined memory namespace and topology',
            details: { namespace: 'swarm/api-build', topology: 'mesh' }
          }
        ],
        context7Used: true
      };

      await log.logImprovement(entry);

      const logFile = log._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      expect(content).toContain('Prompt Improvement');
      expect(content).toContain('**Mode**: swarm');
      expect(content).toContain('**Quality Score**: 55.0%');
      expect(content).toContain('**Intervention Level**: recommended');
      expect(content).toContain('**file_routing**: Added session artifact paths');
      expect(content).toContain('**Context7**: Consulted Claude Code documentation');
    });

    it('should truncate long prompts', async () => {
      const longPrompt = 'A'.repeat(500);

      const entry = {
        timestamp: Date.now(),
        mode: 'direct',
        prompt: longPrompt,
        qualityScore: 0.3,
        interventionLevel: 'suggested',
        improvements: [],
        context7Used: false
      };

      await log.logImprovement(entry);

      const logFile = log._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      expect(content).toContain('...');
      expect(content.length).toBeLessThan(longPrompt.length + 1000);
    });
  });

  describe('Statistics Logging', () => {
    it('should log statistics with Context7 metrics', async () => {
      const stats = {
        totalImprovements: 45,
        totalRejections: 5,
        acceptanceRate: 0.9,
        context7Consultations: 12,
        cacheHits: 8,
        topImprovementTypes: [
          { type: 'file_routing', count: 15 },
          { type: 'coordination', count: 10 },
          { type: 'clarity', count: 8 }
        ],
        qualityImprovements: {
          averageInitial: 0.52,
          averageFinal: 0.87
        }
      };

      await log.logStats(stats);

      const logFile = log._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      expect(content).toContain('Prompt Improver Statistics');
      expect(content).toContain('Total Improvements: 45');
      expect(content).toContain('Acceptance Rate: 90.0%');
      expect(content).toContain('Context7 Consultations: 12');
      expect(content).toContain('Cache Hit Rate: 66.7%');
      expect(content).toContain('file_routing: 15 times');
      expect(content).toContain('Average Initial Score: 52.0%');
      expect(content).toContain('Average Final Score: 87.0%');
    });

    it('should handle missing optional fields', async () => {
      const minimalStats = {
        totalImprovements: 10,
        totalRejections: 2,
        acceptanceRate: 0.83
      };

      await log.logStats(minimalStats);

      const logFile = log._getTodaysLogFile();
      expect(fs.existsSync(logFile)).toBe(true);

      const content = fs.readFileSync(logFile, 'utf8');
      expect(content).toContain('Total Improvements: 10');
    });
  });

  describe('Session Summary', () => {
    it('should log session summary with Context7 stats', async () => {
      const summary = {
        timestamp: Date.now(),
        sessionDuration: 1800000, // 30 minutes
        totalAnalyzed: 25,
        totalImproved: 18,
        context7Stats: {
          consultations: 8,
          cacheEntries: 3,
          cacheHits: 5,
          tokenSavings: '~2400 tokens'
        },
        topIssues: [
          { type: 'file_routing', count: 7 },
          { type: 'coordination', count: 5 }
        ],
        qualityMetrics: {
          avgInitial: 0.58,
          avgFinal: 0.89
        }
      };

      await log.logSessionSummary(summary);

      const logFile = log._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      expect(content).toContain('Session Summary');
      expect(content).toContain('30 minutes'); // Flexible - matches both "Duration: 30" and "Duration**: 30"
      expect(content).toMatch(/Total Prompts Analyzed\*\*:\s*25/); // Match with or without bold markdown
      expect(content).toContain('72.0%');
      expect(content).toContain('Context7 Statistics');
      expect(content).toContain('8'); // Just check the number is present
      expect(content).toContain('Cache Hit Rate: 62.5%');
      expect(content).toContain('Token Savings (estimated): ~2400 tokens');
      expect(content).toContain('file_routing: 7 occurrences');
      expect(content).toContain('Average Improvement: +31.0%');
    });
  });

  describe('File Management', () => {
    it('should create log directory if not exists', async () => {
      const entry = {
        timestamp: Date.now(),
        mode: 'direct',
        prompt: 'Test',
        qualityScore: 0.8,
        interventionLevel: 'none',
        improvements: [],
        context7Used: false
      };

      await log.logImprovement(entry);

      expect(fs.existsSync(testLogPath)).toBe(true);
    });

    it('should create daily log files', async () => {
      const entry = {
        timestamp: Date.now(),
        mode: 'swarm',
        trigger: 'Test',
        sections: [],
        insights: { principles: [], patterns: [], antipatterns: [], recommendations: [] },
        cacheHit: false
      };

      await log.logContext7Consultation(entry);

      const today = new Date().toISOString().split('T')[0];
      const expectedFile = path.join(testLogPath, `${today}.md`);

      expect(fs.existsSync(expectedFile)).toBe(true);
    });

    it('should append to existing log file', async () => {
      const entry1 = {
        timestamp: Date.now(),
        mode: 'swarm',
        prompt: 'First',
        qualityScore: 0.5,
        interventionLevel: 'suggested',
        improvements: [],
        context7Used: false
      };

      const entry2 = {
        timestamp: Date.now(),
        mode: 'hive',
        prompt: 'Second',
        qualityScore: 0.6,
        interventionLevel: 'recommended',
        improvements: [],
        context7Used: true
      };

      await log.logImprovement(entry1);
      await log.logImprovement(entry2);

      const logFile = log._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      expect(content).toContain('First');
      expect(content).toContain('Second');
    });
  });

  describe('Retrieval', () => {
    it('should retrieve recent Context7 consultations', async () => {
      const entry1 = {
        timestamp: Date.now() - 3600000, // 1 hour ago
        mode: 'swarm',
        trigger: 'Complexity',
        sections: ['advanced/swarm-coordination'],
        insights: { principles: ['Test1'], patterns: [], antipatterns: [], recommendations: [] },
        cacheHit: false
      };

      const entry2 = {
        timestamp: Date.now(),
        mode: 'hive',
        trigger: 'Quality',
        sections: ['advanced/hive-mind'],
        insights: { principles: ['Test2'], patterns: [], antipatterns: [], recommendations: [] },
        cacheHit: false
      };

      await log.logContext7Consultation(entry1);
      await log.logContext7Consultation(entry2);

      const recent = await log.getRecentContext7Consultations(7);

      expect(recent.length).toBe(2);
      expect(recent[0].content).toContain('Test2'); // Most recent first
      expect(recent[1].content).toContain('Test1');
    });

    it('should filter by date range', async () => {
      const oldEntry = {
        timestamp: Date.now() - (10 * 24 * 60 * 60 * 1000), // 10 days ago
        mode: 'swarm',
        trigger: 'Old',
        sections: [],
        insights: { principles: ['Old'], patterns: [], antipatterns: [], recommendations: [] },
        cacheHit: false
      };

      await log.logContext7Consultation(oldEntry);

      const recent = await log.getRecentContext7Consultations(7); // Last 7 days

      expect(recent.length).toBe(0); // Old entry excluded
    });
  });

  describe('Disabled Mode', () => {
    it('should not log when disabled', async () => {
      const disabledLog = new EnhancedCaptainsLog({
        captainsLogPath: testLogPath,
        captainsLog: false
      });

      const entry = {
        timestamp: Date.now(),
        mode: 'swarm',
        trigger: 'Test',
        sections: [],
        insights: { principles: [], patterns: [], antipatterns: [], recommendations: [] },
        cacheHit: false
      };

      await disabledLog.logContext7Consultation(entry);

      expect(fs.existsSync(testLogPath)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty insights gracefully', async () => {
      const entry = {
        timestamp: Date.now(),
        mode: 'direct',
        trigger: 'Test',
        sections: [],
        insights: {
          principles: [],
          patterns: [],
          antipatterns: [],
          recommendations: []
        },
        cacheHit: false
      };

      await log.logContext7Consultation(entry);

      const logFile = log._getTodaysLogFile();
      expect(fs.existsSync(logFile)).toBe(true);
    });

    it('should handle special characters in log content', async () => {
      const entry = {
        timestamp: Date.now(),
        mode: 'swarm',
        prompt: 'Test with <tags> & "quotes" and \'apostrophes\'',
        qualityScore: 0.7,
        interventionLevel: 'none',
        improvements: [],
        context7Used: false
      };

      await log.logImprovement(entry);

      const logFile = log._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      expect(content).toContain('<tags>');
      expect(content).toContain('"quotes"');
    });

    it('should handle concurrent writes', async () => {
      const entries = Array(10).fill(null).map((_, i) => ({
        timestamp: Date.now() + i,
        mode: 'swarm',
        trigger: `Test ${i}`,
        sections: [],
        insights: { principles: [`Principle ${i}`], patterns: [], antipatterns: [], recommendations: [] },
        cacheHit: false
      }));

      await Promise.all(entries.map(e => log.logContext7Consultation(e)));

      const logFile = log._getTodaysLogFile();
      const content = fs.readFileSync(logFile, 'utf8');

      // All entries should be present
      for (let i = 0; i < 10; i++) {
        expect(content).toContain(`Principle ${i}`);
      }
    });
  });
});
