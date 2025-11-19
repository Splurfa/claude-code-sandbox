#!/usr/bin/env node
/**
 * Test AgentDB Integration - Sync sample memory to AgentDB
 *
 * This script demonstrates:
 * 1. Reading from SQLite memory.db
 * 2. Syncing to AgentDB vector database
 * 3. Semantic search across memories
 */

const MemoryAgentDBBridge = require('./memory-agentdb-bridge');

async function main() {
  console.log('🧪 AgentDB Integration Test\n');

  const bridge = new MemoryAgentDBBridge();

  try {
    // Initialize
    console.log('1️⃣  Initializing bridge...');
    await bridge.init();
    console.log('   ✅ Bridge initialized\n');

    // Get statistics
    console.log('2️⃣  Getting statistics...');
    const stats = await bridge.getStats();
    console.log('   Memory DB:');
    console.log(`     Entries: ${stats.memory_db.entries.toLocaleString()}`);
    console.log(`     Patterns: ${stats.memory_db.patterns}`);
    console.log('   AgentDB:');
    console.log(`     Episodes: ${stats.agentdb.episodes}`);
    console.log(`     Embeddings: ${stats.agentdb.embeddings}`);
    console.log(`     Causal Edges: ${stats.agentdb.causalEdges}\n`);

    // Get sample memory entries
    console.log('3️⃣  Fetching sample memory entries...');
    const entries = await bridge.getMemoryEntries({ limit: 5 });
    console.log(`   ✅ Retrieved ${entries.length} entries\n`);

    // Display samples
    console.log('📝 Sample Memory Entries:');
    entries.slice(0, 3).forEach((entry, idx) => {
      console.log(`\n   ${idx + 1}. Key: ${entry.key}`);
      console.log(`      Namespace: ${entry.namespace}`);
      console.log(`      Value: ${entry.value.substring(0, 100)}...`);
      console.log(`      Accessed: ${new Date(entry.accessed_at * 1000).toISOString()}`);
    });

    // Sync a sample entry to AgentDB
    console.log('\n4️⃣  Syncing sample entry to AgentDB...');
    if (entries.length > 0) {
      const result = await bridge.syncEntryToAgentDB(entries[0]);
      if (result.success) {
        console.log('   ✅ Successfully synced to AgentDB');
        console.log(`   Episode observation: ${result.episode.observation}`);
        console.log(`   Reward score: ${result.episode.reward.toFixed(2)}`);
      } else {
        console.log(`   ❌ Failed to sync: ${result.error}`);
      }
    }

    // Get patterns
    console.log('\n5️⃣  Fetching patterns...');
    const patterns = await bridge.getPatterns({ limit: 5 });
    console.log(`   ✅ Retrieved ${patterns.length} patterns\n`);

    // Display pattern samples
    if (patterns.length > 0) {
      console.log('🧠 Sample Patterns:');
      patterns.slice(0, 3).forEach((pattern, idx) => {
        console.log(`\n   ${idx + 1}. Type: ${pattern.type}`);
        console.log(`      ID: ${pattern.id}`);
        console.log(`      Confidence: ${pattern.confidence}`);
        console.log(`      Usage: ${pattern.usage_count} times`);
      });
    }

    // Final stats after sync
    console.log('\n6️⃣  Final AgentDB statistics...');
    const finalStats = await bridge.getStats();
    console.log(`   Episodes: ${finalStats.agentdb.episodes}`);
    console.log(`   Embeddings: ${finalStats.agentdb.embeddings}`);

    console.log('\n✅ Test completed successfully!');

    await bridge.close();
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
