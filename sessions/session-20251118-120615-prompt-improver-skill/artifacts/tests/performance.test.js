/**
 * Performance and Token Efficiency Tests
 *
 * Validates response time and resource usage
 */

const { PromptAnalyzer } = require('../../../../../.claude/skills/prompt-improver/lib/analyzer');
const { MemoryManager } = require('../../../../../.claude/skills/prompt-improver/lib/memory-manager');
const { LearningLog } = require('../../../../../.claude/skills/prompt-improver/lib/learning-log');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('Performance Tests', () => {
  let analyzer;
  let memory;
  let learningLog;
  let testDir;

  beforeEach(() => {
    testDir = path.join(process.cwd(), '.prompt-improver-perf-test');

    analyzer = new PromptAnalyzer();
    memory = new MemoryManager({
      useMcp: false,
      memoryNamespace: 'test-perf'
    });
    learningLog = new LearningLog({
      learningLogPath: path.join(testDir, 'learning')
    });
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }

    const memoryDir = path.join(process.cwd(), '.prompt-improver-memory');
    if (fs.existsSync(memoryDir)) {
      fs.rmSync(memoryDir, { recursive: true, force: true });
    }
  });

  describe('Analysis Performance', () => {
    it('should analyze simple prompt in < 50ms', async () => {
      const prompt = 'Create a REST API';

      const start = Date.now();
      const analysis = await analyzer.analyze(prompt);
      const duration = Date.now() - start;

      assert.ok(duration < 50, `Analysis took ${duration}ms (expected < 50ms)`);
      assert.ok(analysis);

      console.log(`  Simple analysis: ${duration}ms`);
    });

    it('should analyze complex prompt in < 100ms', async () => {
      const prompt = `
        Build comprehensive microservices architecture with:
        - API Gateway with rate limiting and authentication
        - User service with PostgreSQL and Redis caching
        - Product service with MongoDB and search indexing
        - Order service with event sourcing and CQRS
        - Payment service with Stripe integration
        - Notification service with email and SMS
        - Message queue with RabbitMQ
        - Service mesh with Istio
        - Distributed tracing with Jaeger
        - Centralized logging with ELK stack
        - Monitoring with Prometheus and Grafana

        Save to sessions/current/artifacts/
      `;

      const start = Date.now();
      const analysis = await analyzer.analyze(prompt);
      const duration = Date.now() - start;

      assert.ok(duration < 100, `Complex analysis took ${duration}ms (expected < 100ms)`);
      assert.ok(analysis);

      console.log(`  Complex analysis: ${duration}ms`);
    });

    it('should handle batch analysis efficiently', async () => {
      const prompts = Array(10).fill(0).map((_, i) =>
        `Build feature ${i} with specific requirements`
      );

      const start = Date.now();
      const results = await Promise.all(
        prompts.map(p => analyzer.analyze(p))
      );
      const duration = Date.now() - start;

      const avgDuration = duration / prompts.length;

      assert.strictEqual(results.length, 10);
      assert.ok(avgDuration < 50, `Average per-prompt: ${avgDuration}ms`);

      console.log(`  Batch (10 prompts): ${duration}ms total, ${avgDuration}ms avg`);
    });
  });

  describe('Memory Performance', () => {
    it('should store pattern in < 20ms', async () => {
      const pattern = {
        prompt: 'Test prompt',
        improvements: ['improvement1', 'improvement2'],
        context: { framework: 'Express' }
      };

      const start = Date.now();
      await memory.storePattern('direct', pattern);
      const duration = Date.now() - start;

      assert.ok(duration < 20, `Store took ${duration}ms (expected < 20ms)`);

      console.log(`  Store pattern: ${duration}ms`);
    });

    it('should retrieve pattern in < 10ms', async () => {
      // Store first
      await memory.storePattern('direct', {
        prompt: 'Test',
        improvements: ['test']
      });

      const start = Date.now();
      const patterns = await memory.getRecentPatterns('direct', 1);
      const duration = Date.now() - start;

      assert.ok(duration < 10, `Retrieve took ${duration}ms (expected < 10ms)`);
      assert.ok(patterns.length > 0);

      console.log(`  Retrieve pattern: ${duration}ms`);
    });

    it('should handle multiple concurrent operations', async () => {
      const operations = Array(20).fill(0).map((_, i) =>
        memory.storePattern('direct', {
          prompt: `Pattern ${i}`,
          improvements: [`improvement-${i}`]
        })
      );

      const start = Date.now();
      await Promise.all(operations);
      const duration = Date.now() - start;

      const avgDuration = duration / operations.length;

      assert.ok(avgDuration < 25, `Average per-operation: ${avgDuration}ms`);

      console.log(`  Concurrent ops (20): ${duration}ms total, ${avgDuration}ms avg`);
    });

    it('should scale baseline retrieval efficiently', async () => {
      const modes = ['hive', 'swarm', 'wizard', 'direct'];

      const start = Date.now();
      const baselines = await Promise.all(
        modes.map(mode => memory.getBaselinePatterns(mode))
      );
      const duration = Date.now() - start;

      assert.strictEqual(baselines.length, 4);
      assert.ok(duration < 50, `Baseline retrieval took ${duration}ms`);

      console.log(`  Baseline retrieval (4 modes): ${duration}ms`);
    });
  });

  describe('Learning Log Performance', () => {
    it('should record improvement in < 15ms', async () => {
      const entry = {
        originalPrompt: 'Test',
        improvedPrompt: 'Improved test',
        suggestions: {
          structure: ['add-goal']
        }
      };

      const start = Date.now();
      await learningLog.record(entry);
      const duration = Date.now() - start;

      assert.ok(duration < 15, `Record took ${duration}ms (expected < 15ms)`);

      console.log(`  Record improvement: ${duration}ms`);
    });

    it('should calculate stats in < 50ms', async () => {
      // Add some entries first
      for (let i = 0; i < 20; i++) {
        await learningLog.record({
          originalPrompt: `Test ${i}`,
          improvedPrompt: `Improved ${i}`,
          suggestions: { structure: ['test'] }
        });
      }

      const start = Date.now();
      const stats = await learningLog.getStats();
      const duration = Date.now() - start;

      assert.ok(duration < 50, `Stats calculation took ${duration}ms (expected < 50ms)`);
      assert.ok(stats);

      console.log(`  Calculate stats (20 entries): ${duration}ms`);
    });

    it('should handle log rotation efficiently', async () => {
      const rotatingLog = new LearningLog({
        learningLogPath: testDir,
        maxLearningEntries: 100
      });

      const start = Date.now();

      // Add entries that will trigger rotation
      for (let i = 0; i < 120; i++) {
        await rotatingLog.record({
          originalPrompt: `Test ${i}`,
          improvedPrompt: `Improved ${i}`
        });
      }

      const duration = Date.now() - start;
      const avgDuration = duration / 120;

      assert.ok(avgDuration < 20, `Average per-record (with rotation): ${avgDuration}ms`);

      console.log(`  Rotation test (120 entries): ${duration}ms total, ${avgDuration}ms avg`);
    });
  });

  describe('Token Efficiency', () => {
    it('should minimize analysis token count', async () => {
      const prompt = 'Build REST API with authentication';

      // Estimate tokens (rough approximation: 4 chars per token)
      const promptTokens = Math.ceil(prompt.length / 4);

      const analysis = await analyzer.analyze(prompt);

      // Analysis result should be compact
      const resultSize = JSON.stringify(analysis).length;
      const resultTokens = Math.ceil(resultSize / 4);

      // Result should be < 500 tokens for simple analysis
      assert.ok(resultTokens < 500,
        `Analysis result: ~${resultTokens} tokens (expected < 500)`);

      console.log(`  Prompt: ~${promptTokens} tokens`);
      console.log(`  Analysis: ~${resultTokens} tokens`);
    });

    it('should avoid redundant computation', async () => {
      const prompt = 'Create simple API';

      // First analysis
      const start1 = Date.now();
      const analysis1 = await analyzer.analyze(prompt);
      const duration1 = Date.now() - start1;

      // Second analysis (same prompt)
      const start2 = Date.now();
      const analysis2 = await analyzer.analyze(prompt);
      const duration2 = Date.now() - start2;

      // Both should complete quickly
      assert.ok(duration1 < 50);
      assert.ok(duration2 < 50);

      // Results should be consistent
      assert.strictEqual(analysis1.mode, analysis2.mode);

      console.log(`  First: ${duration1}ms, Second: ${duration2}ms`);
    });

    it('should efficiently handle pass-through scenario', async () => {
      const highQualityPrompt = `
        Implement user authentication API with JWT:
        - Algorithm: RS256
        - Access tokens: 15 minute expiry
        - Refresh tokens: 7 day expiry with rotation
        - Token blacklist using Redis
        - Rate limiting: 5 failed attempts per hour per IP

        Tech stack:
        - Backend: Express.js v5.0
        - Auth library: jsonwebtoken v9.0
        - Validation: Joi v17.0
        - Database: PostgreSQL v15 with Prisma ORM

        Deliverables:
        - Middleware: src/middleware/auth.js
        - Routes: src/routes/auth.js
        - Controllers: src/controllers/auth.js
        - Tests: tests/auth.test.js (95% coverage)
        - Documentation: docs/AUTH.md

        Save all files to sessions/current/artifacts/code/
      `;

      const start = Date.now();
      const analysis = await analyzer.analyze(highQualityPrompt);
      const duration = Date.now() - start;

      // Should identify as high quality
      assert.ok(analysis.qualityScore >= 0.7);

      // Should complete quickly (minimal processing needed)
      assert.ok(duration < 100, `Pass-through took ${duration}ms`);

      console.log(`  Pass-through (high quality): ${duration}ms, score: ${(analysis.qualityScore * 100).toFixed(1)}%`);
    });
  });

  describe('Memory Usage', () => {
    it('should limit memory growth', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Process many prompts
      for (let i = 0; i < 100; i++) {
        await analyzer.analyze(`Build feature ${i} with requirements`);
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const growth = finalMemory - initialMemory;
      const growthMB = growth / 1024 / 1024;

      // Memory growth should be < 10MB for 100 analyses
      assert.ok(growthMB < 10, `Memory grew by ${growthMB.toFixed(2)}MB`);

      console.log(`  Memory growth (100 analyses): ${growthMB.toFixed(2)}MB`);
    });

    it('should handle large prompts without excessive memory', async () => {
      const initialMemory = process.memoryUsage().heapUsed;

      // Very large prompt
      const largePrompt = 'Build '.repeat(1000) + 'a comprehensive system';

      const analysis = await analyzer.analyze(largePrompt);

      const finalMemory = process.memoryUsage().heapUsed;
      const growth = finalMemory - initialMemory;
      const growthMB = growth / 1024 / 1024;

      // Should not allocate excessive memory
      assert.ok(growthMB < 5, `Large prompt used ${growthMB.toFixed(2)}MB`);
      assert.ok(analysis);

      console.log(`  Large prompt memory: ${growthMB.toFixed(2)}MB`);
    });
  });

  describe('Scalability', () => {
    it('should handle increasing load gracefully', async () => {
      const sizes = [10, 50, 100];
      const results = [];

      for (const size of sizes) {
        const prompts = Array(size).fill(0).map((_, i) =>
          `Build feature ${i}`
        );

        const start = Date.now();
        await Promise.all(prompts.map(p => analyzer.analyze(p)));
        const duration = Date.now() - start;

        const avgDuration = duration / size;
        results.push({ size, total: duration, avg: avgDuration });

        console.log(`  ${size} prompts: ${duration}ms total, ${avgDuration.toFixed(2)}ms avg`);
      }

      // Average duration should not grow significantly
      const firstAvg = results[0].avg;
      const lastAvg = results[results.length - 1].avg;
      const growthFactor = lastAvg / firstAvg;

      assert.ok(growthFactor < 2, `Performance degraded ${growthFactor.toFixed(2)}x`);
    });

    it('should maintain performance with growing learning log', async () => {
      // Add many entries
      for (let i = 0; i < 200; i++) {
        await learningLog.record({
          originalPrompt: `Test ${i}`,
          improvedPrompt: `Improved ${i}`,
          suggestions: { structure: ['test'] }
        });
      }

      // Stats calculation should still be fast
      const start = Date.now();
      const stats = await learningLog.getStats();
      const duration = Date.now() - start;

      assert.ok(duration < 100, `Stats with 200 entries took ${duration}ms`);
      assert.ok(stats);

      console.log(`  Stats with 200 entries: ${duration}ms`);
    });

    it('should handle concurrent analysis requests', async () => {
      const requests = Array(50).fill(0).map((_, i) => ({
        prompt: `Build feature ${i} with specific requirements and constraints`,
        index: i
      }));

      const start = Date.now();
      const results = await Promise.all(
        requests.map(r => analyzer.analyze(r.prompt))
      );
      const duration = Date.now() - start;

      const avgDuration = duration / requests.length;

      assert.strictEqual(results.length, 50);
      assert.ok(avgDuration < 100, `Average: ${avgDuration.toFixed(2)}ms`);

      console.log(`  50 concurrent: ${duration}ms total, ${avgDuration.toFixed(2)}ms avg`);
    });
  });

  describe('Edge Case Performance', () => {
    it('should handle empty prompt efficiently', async () => {
      const start = Date.now();
      const analysis = await analyzer.analyze('');
      const duration = Date.now() - start;

      assert.ok(duration < 10, `Empty prompt took ${duration}ms`);
      assert.ok(analysis);

      console.log(`  Empty prompt: ${duration}ms`);
    });

    it('should handle very long prompt efficiently', async () => {
      const longPrompt = 'Build a system '.repeat(500) + 'with many requirements';

      const start = Date.now();
      const analysis = await analyzer.analyze(longPrompt);
      const duration = Date.now() - start;

      assert.ok(duration < 200, `Very long prompt took ${duration}ms`);
      assert.ok(analysis);

      console.log(`  Very long prompt (${longPrompt.length} chars): ${duration}ms`);
    });

    it('should handle special characters efficiently', async () => {
      const specialPrompt = '!@#$%^&*()_+ Build API with 日本語 and émojis 🚀';

      const start = Date.now();
      const analysis = await analyzer.analyze(specialPrompt);
      const duration = Date.now() - start;

      assert.ok(duration < 50, `Special chars took ${duration}ms`);
      assert.ok(analysis);

      console.log(`  Special characters: ${duration}ms`);
    });
  });
});

// Benchmarking utility
class Benchmark {
  constructor(name) {
    this.name = name;
    this.measurements = [];
  }

  async measure(fn) {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;

    this.measurements.push(duration);
    return { result, duration };
  }

  report() {
    const avg = this.measurements.reduce((a, b) => a + b, 0) / this.measurements.length;
    const min = Math.min(...this.measurements);
    const max = Math.max(...this.measurements);

    console.log(`\n${this.name} Benchmark:`);
    console.log(`  Runs: ${this.measurements.length}`);
    console.log(`  Avg: ${avg.toFixed(2)}ms`);
    console.log(`  Min: ${min}ms`);
    console.log(`  Max: ${max}ms`);
  }
}

// Run if executed directly
if (require.main === module) {
  console.log('Performance tests defined. Use Jest or similar test runner to execute.');
  process.exit(0);
}

module.exports = { describe, Benchmark };
