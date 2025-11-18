#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Memory Consolidation System
 *
 * Tests all components:
 * - LRU optimizer
 * - Deduplicator
 * - Memory consolidator
 * - MCP integration
 */

const LRUOptimizer = require('../code/memory/lru-optimizer.js');
const Deduplicator = require('../code/memory/deduplicator.js');
const MemoryConsolidator = require('../code/memory/memory-consolidator.js');
const MemoryMCP = require('../code/memory/memory-mcp.js');

// Test utilities
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertApprox(actual, expected, tolerance, message) {
  const diff = Math.abs(actual - expected);
  if (diff > tolerance) {
    throw new Error(`${message}: expected ~${expected}, got ${actual} (diff: ${diff})`);
  }
}

// Test LRU Optimizer
function testLRUOptimizer() {
  console.log('\n🧪 Testing LRU Optimizer...');

  const cache = new LRUOptimizer(10);

  // Test basic set/get
  cache.set('key1', 'value1');
  assert(cache.get('key1') === 'value1', 'Get should return set value');
  assert(cache.get('nonexistent') === null, 'Get should return null for missing key');

  // Test cache size limit
  for (let i = 0; i < 15; i++) {
    cache.set(`key${i}`, `value${i}`);
  }
  assert(cache.cache.size === 10, `Cache should be limited to 10 entries, got ${cache.cache.size}`);

  // Test eviction (oldest should be evicted)
  assert(cache.get('key0') === null, 'Oldest entry should be evicted');
  assert(cache.get('key14') !== null, 'Newest entry should still exist');

  // Test statistics
  const stats = cache.getStats();
  assert(stats.size === 10, 'Stats should show correct size');
  assert(stats.evictions > 0, 'Stats should show evictions');

  // Test memory pressure detection
  assert(cache.isUnderPressure(0.8) === true, 'Should detect memory pressure at 80%');
  assert(cache.isUnderPressure(1.0) === true, 'Should detect memory pressure at 100%');

  // Test optimization
  const evicted = cache.optimize(5);
  assert(cache.cache.size === 5, 'Optimization should reduce cache size');
  assert(evicted.length === 5, 'Should return evicted keys');

  console.log('✅ LRU Optimizer tests passed');
}

// Test Deduplicator
function testDeduplicator() {
  console.log('\n🧪 Testing Deduplicator...');

  const dedup = new Deduplicator(0.85);

  // Create test memories with duplicates
  const memories = [
    { key: 'mem1', value: 'This is a test memory about API design' },
    { key: 'mem2', value: 'This is a test memory about API design' }, // Duplicate
    { key: 'mem3', value: 'Completely different content here' },
    { key: 'mem4', value: 'This is a test memory about API design patterns' }, // Similar
    { key: 'mem5', value: 'Another unique memory entry' }
  ];

  // Test embedding creation
  const embedding1 = dedup.createEmbedding(memories[0].value);
  const embedding2 = dedup.createEmbedding(memories[1].value);
  assert(Array.isArray(embedding1), 'Should create embedding array');
  assert(embedding1.length === 100, 'Embedding should have 100 dimensions');

  // Test cosine similarity
  const similarity = dedup.cosineSimilarity(embedding1, embedding2);
  assert(similarity >= 0.99, `Identical texts should have similarity ~1.0, got ${similarity}`);

  // Test duplicate detection
  const duplicates = dedup.findDuplicates(memories);
  assert(duplicates.length > 0, 'Should find duplicate groups');

  // Test deduplication
  const result = dedup.deduplicate(memories);
  assert(result.unique.length < memories.length, 'Should remove duplicates');
  assert(result.removed.length > 0, 'Should have removed entries');

  // Test statistics
  const stats = dedup.getStats();
  assert(stats.scanned === memories.length, 'Should scan all memories');
  assert(stats.duplicatesRemoved > 0, 'Should remove duplicates');

  console.log('✅ Deduplicator tests passed');
}

// Test Memory Consolidator
function testMemoryConsolidator() {
  console.log('\n🧪 Testing Memory Consolidator...');

  const consolidator = new MemoryConsolidator({
    maxCacheSize: 50,
    deduplicationThreshold: 0.85,
    compressionEnabled: false, // Disable for testing
    ttl: {
      context: 1000, // 1 second for testing
      task: 500,
      knowledge: Infinity
    }
  });

  // Create test memories
  const now = Date.now();
  const memories = [
    // Active memories
    { key: 'knowledge/pattern1', value: 'API design pattern', metadata: { timestamp: now } },
    { key: 'task/task1', value: 'Task data', metadata: { timestamp: now } },
    { key: 'context/ctx1', value: 'Context data', metadata: { timestamp: now } },

    // Expired memories
    { key: 'context/old1', value: 'Old context', metadata: { timestamp: now - 2000 } },
    { key: 'task/old2', value: 'Old task', metadata: { timestamp: now - 1000 } },

    // Duplicates
    { key: 'dup1', value: 'Duplicate content here', metadata: { timestamp: now } },
    { key: 'dup2', value: 'Duplicate content here', metadata: { timestamp: now } }
  ];

  // Test consolidation
  consolidator.consolidate(memories).then(results => {
    assert(results.processed === memories.length, 'Should process all memories');
    assert(results.evicted > 0, 'Should evict expired memories');
    assert(results.deduplicated > 0, 'Should deduplicate memories');

    const stats = consolidator.getStats();
    assert(stats.consolidations === 1, 'Should track consolidations');
    assert(stats.memoriesProcessed === memories.length, 'Should track processed count');

    console.log('✅ Memory Consolidator tests passed');
  }).catch(error => {
    throw error;
  });
}

// Test MCP Integration
function testMemoryMCP() {
  console.log('\n🧪 Testing MCP Integration...');

  const memoryMCP = new MemoryMCP({
    maxCacheSize: 100,
    namespace: 'test'
  });

  // Mock MCP call function
  const mockMemories = new Map();
  const mockMCPCall = async (tool, params) => {
    if (params.action === 'store') {
      mockMemories.set(params.key, {
        key: params.key,
        value: params.value,
        namespace: params.namespace
      });
      return { success: true };
    } else if (params.action === 'list') {
      return {
        entries: Array.from(mockMemories.values()).filter(
          m => m.namespace === params.namespace
        )
      };
    } else if (params.action === 'retrieve') {
      const mem = Array.from(mockMemories.values()).find(
        m => m.key === params.key && m.namespace === params.namespace
      );
      return mem || { value: null };
    } else if (params.action === 'delete') {
      mockMemories.delete(params.key);
      return { success: true };
    }
  };

  // Test memory storage
  memoryMCP.storeMemory(mockMCPCall, 'test-key', 'test-value').then(() => {
    assert(mockMemories.has('test-key'), 'Should store memory');

    // Test memory retrieval
    return memoryMCP.retrieveAllMemories(mockMCPCall);
  }).then(memories => {
    assert(memories.length === 1, 'Should retrieve stored memory');

    // Test memory deletion
    return memoryMCP.deleteMemory(mockMCPCall, 'test-key');
  }).then(() => {
    assert(!mockMemories.has('test-key'), 'Should delete memory');

    console.log('✅ MCP Integration tests passed');
  }).catch(error => {
    throw error;
  });
}

// Test Integration
async function testIntegration() {
  console.log('\n🧪 Testing Full Integration...');

  const memoryMCP = new MemoryMCP({
    maxCacheSize: 100,
    deduplicationThreshold: 0.85,
    namespace: 'integration-test'
  });

  // Mock MCP with in-memory storage
  const mockMemories = new Map();
  const mockMCPCall = async (tool, params) => {
    if (params.action === 'store') {
      mockMemories.set(`${params.namespace}:${params.key}`, {
        key: params.key,
        value: params.value,
        namespace: params.namespace,
        metadata: { timestamp: Date.now() }
      });
      return { success: true };
    } else if (params.action === 'list') {
      const entries = Array.from(mockMemories.values()).filter(
        m => m.namespace === params.namespace
      );
      return { entries };
    } else if (params.action === 'retrieve') {
      const key = `${params.namespace}:${params.key}`;
      const mem = mockMemories.get(key);
      return mem || { value: null };
    } else if (params.action === 'delete') {
      const key = `${params.namespace}:${params.key}`;
      const deleted = mockMemories.delete(key);
      console.log(`Mock delete: ${key} (${deleted ? 'success' : 'not found'})`);
      return { success: deleted };
    }
  };

  try {
    // Create test memories
    console.log('Creating 100 test memories...');
    await memoryMCP.createTestMemories(mockMCPCall, 100);

    // Count only integration-test namespace before consolidation
    const beforeCount = Array.from(mockMemories.values()).filter(
      m => m.namespace === 'integration-test'
    ).length;
    console.log(`Created ${beforeCount} test memories in integration-test namespace`);
    assert(beforeCount >= 100, 'Should create at least 100 memories');

    // Run consolidation
    console.log('Running consolidation...');
    const results = await memoryMCP.runConsolidation(mockMCPCall);

    assert(results.processed > 0, 'Should process memories');
    assert(results.deduplicated > 0, 'Should deduplicate at least some memories');
    console.log(`Processed ${results.processed} memories`);
    console.log(`Deduplicated ${results.deduplicated} memories`);
    console.log(`Archived ${results.archived} memories`);
    console.log(`Evicted ${results.evicted} memories`);

    // Verify results
    console.log('Verifying consolidation...');
    const verification = await memoryMCP.verifyConsolidation(mockMCPCall);

    assert(verification.status === 'completed', 'Status should be completed');
    assert(verification.consolidationCount > 0, 'Should track consolidation count');
    console.log(`Verification status: ${verification.status}`);
    console.log(`Consolidation count: ${verification.consolidationCount}`);

    // Check final memory count (excluding coordination namespace)
    const afterCount = Array.from(mockMemories.values()).filter(
      m => m.namespace === 'integration-test'
    ).length;
    const afterTotal = mockMemories.size;
    console.log(`Final integration-test memory count: ${afterCount} (reduced from ${beforeCount})`);
    console.log(`Total memory count including coordination: ${afterTotal}`);
    console.log(`Reduction: ${beforeCount - afterCount} memories (${((beforeCount - afterCount) / beforeCount * 100).toFixed(1)}%)`);

    // Should have reduced count (removed duplicates)
    const expectedReduction = results.deduplicated + results.evicted;
    assert(afterCount === beforeCount - expectedReduction,
      `Should reduce by ${expectedReduction} (deduplicated + evicted), got ${beforeCount - afterCount}`);

    console.log('✅ Full Integration tests passed');

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    throw error;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Memory Consolidation System Tests\n');
  console.log('='.repeat(60));

  try {
    testLRUOptimizer();
    testDeduplicator();
    await testMemoryConsolidator();
    await testMemoryMCP();
    await testIntegration();

    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 ALL TESTS PASSED!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
    console.error('');
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testLRUOptimizer,
  testDeduplicator,
  testMemoryConsolidator,
  testMemoryMCP,
  testIntegration
};
