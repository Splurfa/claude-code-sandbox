/**
 * Tests for MemoryManager
 *
 * Covers memory integration, pattern storage, and fallback behavior
 */

const { MemoryManager } = require('../../../../../.claude/skills/prompt-improver/lib/memory-manager');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('MemoryManager', () => {
  let manager;
  let testMemoryDir;

  beforeEach(() => {
    // Use test-specific memory directory
    testMemoryDir = path.join(process.cwd(), '.prompt-improver-memory-test');
    manager = new MemoryManager({
      useMcp: false, // Use filesystem fallback for testing
      memoryNamespace: 'test-prompt-improver'
    });

    // Override directory for testing
    manager.namespace = 'test-prompt-improver';
  });

  afterEach(() => {
    // Clean up test memory directory
    if (fs.existsSync(testMemoryDir)) {
      fs.rmSync(testMemoryDir, { recursive: true, force: true });
    }

    // Also clean up default directory
    const defaultDir = path.join(process.cwd(), '.prompt-improver-memory');
    if (fs.existsSync(defaultDir)) {
      fs.rmSync(defaultDir, { recursive: true, force: true });
    }
  });

  describe('Baseline Patterns', () => {
    it('should return default patterns for hive mode', async () => {
      const patterns = await manager.getBaselinePatterns('hive');

      assert.ok(patterns.commonContext);
      assert.ok(patterns.commonContext.topology);
      assert.ok(patterns.commonContext.consensus);
      assert.ok(patterns.bestPractices);
      assert.ok(patterns.bestPractices.length > 0);
    });

    it('should return default patterns for swarm mode', async () => {
      const patterns = await manager.getBaselinePatterns('swarm');

      assert.ok(patterns.commonContext);
      assert.ok(patterns.commonContext.topology);
      assert.ok(patterns.commonContext.agents);
      assert.ok(patterns.bestPractices);
    });

    it('should return default patterns for wizard mode', async () => {
      const patterns = await manager.getBaselinePatterns('wizard');

      assert.ok(patterns.commonContext);
      assert.ok(patterns.commonContext.interactive);
      assert.ok(patterns.bestPractices);
    });

    it('should return default patterns for direct mode', async () => {
      const patterns = await manager.getBaselinePatterns('direct');

      assert.ok(patterns.commonContext);
      assert.ok(patterns.commonContext.deliverables);
      assert.ok(patterns.bestPractices);
    });

    it('should return default patterns for unknown mode', async () => {
      const patterns = await manager.getBaselinePatterns('unknown-mode');

      assert.ok(patterns.commonContext);
      assert.ok(patterns.bestPractices);
    });
  });

  describe('Pattern Storage', () => {
    it('should store successful pattern', async () => {
      const pattern = {
        prompt: 'Build API with authentication',
        improvements: ['Add JWT specification', 'Specify framework'],
        context: {
          framework: 'Express.js',
          auth: 'JWT'
        }
      };

      await manager.storePattern('swarm', pattern);

      // Verify pattern was stored
      const recent = await manager.getRecentPatterns('swarm', 1);
      assert.ok(recent.length > 0);
      assert.strictEqual(recent[0].prompt, pattern.prompt);
    });

    it('should update baseline after storing pattern', async () => {
      const pattern = {
        prompt: 'Build API',
        improvements: ['Add testing', 'Specify database'],
        context: {
          testing: 'Jest',
          database: 'PostgreSQL'
        }
      };

      await manager.storePattern('direct', pattern);

      // Get updated baseline
      const baseline = await manager.getBaselinePatterns('direct');
      assert.ok(baseline.commonContext.testing);
      assert.ok(baseline.commonContext.database);
    });

    it('should aggregate multiple patterns', async () => {
      const pattern1 = {
        improvements: ['Add tests', 'Specify framework'],
        context: { framework: 'Express' }
      };

      const pattern2 = {
        improvements: ['Add tests', 'Add documentation'],
        context: { framework: 'Fastify' }
      };

      await manager.storePattern('swarm', pattern1);
      await manager.storePattern('swarm', pattern2);

      const baseline = await manager.getBaselinePatterns('swarm');
      assert.ok(baseline.bestPractices.includes('Add tests'));
    });
  });

  describe('Rejection Storage', () => {
    it('should store rejection pattern', async () => {
      const rejection = {
        prompt: 'Do something',
        suggestions: ['Add specificity'],
        reason: 'Too vague'
      };

      await manager.storeRejection('direct', rejection);

      // Verify rejection was stored (check file exists)
      const dir = path.join(process.cwd(), '.prompt-improver-memory');
      const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];
      const rejectionFiles = files.filter(f => f.includes('rejections'));
      assert.ok(rejectionFiles.length > 0);
    });

    it('should handle storage errors gracefully', async () => {
      // Force an error by using invalid path
      const invalidManager = new MemoryManager({
        useMcp: false,
        memoryNamespace: '/invalid/path/that/cannot/be/created'
      });

      // Should not throw
      await invalidManager.storeRejection('direct', { prompt: 'test' });
    });
  });

  describe('Recent Patterns Retrieval', () => {
    it('should retrieve recent patterns with limit', async () => {
      // Store multiple patterns
      for (let i = 0; i < 5; i++) {
        await manager.storePattern('swarm', {
          prompt: `Pattern ${i}`,
          improvements: [`Improvement ${i}`]
        });
        // Small delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const recent = await manager.getRecentPatterns('swarm', 3);
      assert.strictEqual(recent.length, 3);
      assert.strictEqual(recent[2].prompt, 'Pattern 4'); // Most recent
    });

    it('should return empty array for mode with no patterns', async () => {
      const recent = await manager.getRecentPatterns('nonexistent', 10);
      assert.strictEqual(recent.length, 0);
    });

    it('should handle retrieval errors gracefully', async () => {
      const recent = await manager.getRecentPatterns('test-mode', 10);
      assert.ok(Array.isArray(recent));
    });
  });

  describe('Filesystem Fallback', () => {
    it('should store to filesystem when MCP unavailable', async () => {
      const key = 'test-key';
      const value = JSON.stringify({ data: 'test' });

      await manager._store(key, value);

      const retrieved = await manager._retrieve(key);
      assert.strictEqual(retrieved, value);
    });

    it('should retrieve from filesystem', async () => {
      const key = 'test-retrieve';
      const value = JSON.stringify({ data: 'retrieve-test' });

      await manager._storeFilesystem(key, value);
      const retrieved = await manager._retrieveFilesystem(key);

      assert.strictEqual(retrieved, value);
    });

    it('should return null for non-existent keys', async () => {
      const retrieved = await manager._retrieveFilesystem('nonexistent-key');
      assert.strictEqual(retrieved, null);
    });

    it('should list keys with prefix', async () => {
      await manager._storeFilesystem('prefix/key1', 'value1');
      await manager._storeFilesystem('prefix/key2', 'value2');
      await manager._storeFilesystem('other/key3', 'value3');

      const keys = await manager._listFilesystem('prefix/');
      assert.ok(keys.length >= 2);
      assert.ok(keys.some(k => k.includes('prefix')));
    });

    it('should handle empty directory in list', async () => {
      const keys = await manager._listFilesystem('nonexistent/');
      assert.strictEqual(keys.length, 0);
    });

    it('should create directories recursively', async () => {
      const key = 'deep/nested/path/key';
      const value = 'test';

      await manager._storeFilesystem(key, value);
      const retrieved = await manager._retrieveFilesystem(key);

      assert.strictEqual(retrieved, value);
    });
  });

  describe('Baseline Aggregation', () => {
    it('should aggregate common context elements', async () => {
      const pattern = {
        context: {
          framework: 'Express',
          database: 'PostgreSQL'
        }
      };

      await manager.storePattern('swarm', pattern);
      const baseline = await manager.getBaselinePatterns('swarm');

      assert.ok(baseline.commonContext.framework);
      assert.ok(baseline.commonContext.database);
    });

    it('should track context frequency', async () => {
      const pattern1 = { context: { framework: 'Express' } };
      const pattern2 = { context: { framework: 'Fastify' } };

      await manager.storePattern('swarm', pattern1);
      await manager.storePattern('swarm', pattern2);

      const baseline = await manager.getBaselinePatterns('swarm');
      assert.ok(baseline.contextFrequency.framework >= 2);
    });

    it('should deduplicate and rank best practices', async () => {
      const pattern1 = { improvements: ['Add tests', 'Add docs'] };
      const pattern2 = { improvements: ['Add tests', 'Add types'] };
      const pattern3 = { improvements: ['Add tests', 'Add validation'] };

      await manager.storePattern('direct', pattern1);
      await manager.storePattern('direct', pattern2);
      await manager.storePattern('direct', pattern3);

      const baseline = await manager.getBaselinePatterns('direct');

      // 'Add tests' should be most frequent
      assert.ok(baseline.bestPractices.includes('Add tests'));
    });

    it('should limit best practices to top 20', async () => {
      // Add more than 20 unique practices
      for (let i = 0; i < 25; i++) {
        await manager.storePattern('swarm', {
          improvements: [`Practice ${i}`]
        });
      }

      const baseline = await manager.getBaselinePatterns('swarm');
      assert.ok(baseline.bestPractices.length <= 20);
    });
  });

  describe('MCP Integration', () => {
    it('should use MCP when enabled', async () => {
      const mcpManager = new MemoryManager({ useMcp: true });

      // Should attempt MCP but fall back to filesystem
      const key = 'mcp-test';
      const value = JSON.stringify({ test: 'mcp' });

      await mcpManager._store(key, value);
      const retrieved = await mcpManager._retrieve(key);

      assert.strictEqual(retrieved, value);
    });

    it('should fall back to filesystem when MCP fails', async () => {
      const mcpManager = new MemoryManager({ useMcp: true });

      // Even with MCP enabled, should work via fallback
      const patterns = await mcpManager.getBaselinePatterns('swarm');
      assert.ok(patterns);
    });
  });

  describe('Error Handling', () => {
    it('should handle store errors gracefully', async () => {
      // Should not throw
      await manager.storePattern('swarm', null);
      await manager.storePattern('swarm', undefined);
    });

    it('should handle retrieve errors gracefully', async () => {
      const patterns = await manager.getBaselinePatterns('test');
      assert.ok(patterns); // Should return defaults
    });

    it('should handle invalid JSON gracefully', async () => {
      const key = 'invalid-json';
      await manager._storeFilesystem(key, 'not valid json {');

      // Should handle parse error
      const retrieved = await manager._retrieve(key);
      assert.ok(retrieved); // Should return the raw string
    });
  });

  describe('Deduplication', () => {
    it('should deduplicate string items', () => {
      const items = ['test', 'test', 'other', 'test', 'other'];
      const result = manager._deduplicateAndRank(items, 10);

      assert.ok(result.includes('test'));
      assert.ok(result.includes('other'));
      assert.ok(result.length <= 2);
    });

    it('should deduplicate object items', () => {
      const items = [
        { type: 'test' },
        { type: 'test' },
        { type: 'other' }
      ];
      const result = manager._deduplicateAndRank(items, 10);

      assert.ok(result.length >= 2);
    });

    it('should rank by frequency', () => {
      const items = ['a', 'b', 'a', 'a', 'b'];
      const result = manager._deduplicateAndRank(items, 10);

      // 'a' should come first (appears 3 times vs 2)
      assert.strictEqual(result[0], 'a');
    });

    it('should respect limit', () => {
      const items = Array(100).fill(0).map((_, i) => `item-${i}`);
      const result = manager._deduplicateAndRank(items, 5);

      assert.strictEqual(result.length, 5);
    });
  });
});

// Run tests if executed directly
if (require.main === module) {
  console.log('Running MemoryManager Tests...\n');

  // Simple test runner (would use Jest/Mocha in production)
  const runTests = async () => {
    const suite = describe('MemoryManager', () => {});
    let passed = 0;
    let failed = 0;

    // This is a placeholder - actual test execution would use a proper framework
    console.log('Tests defined. Use a test runner like Jest to execute.');
    process.exit(0);
  };

  runTests();
}

module.exports = { describe };
