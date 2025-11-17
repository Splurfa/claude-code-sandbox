#!/usr/bin/env node
/**
 * Bulk Memory Sync Script
 * 
 * Syncs all memory entries from .swarm/memory.db to AgentDB
 * Run with: node sync-all-memories.js [limit]
 */

const path = require('path');
const MemoryAgentDBBridge = require('../code/integrations/memory-agentdb-bridge');

async function main() {
  const limit = parseInt(process.argv[2]) || 100;
  
  console.log(`🚀 Bulk Memory Sync to AgentDB`);
  console.log(`Limit: ${limit} entries\n`);

  const bridge = new MemoryAgentDBBridge();

  try {
    console.log('1️⃣  Initializing bridge...');
    await bridge.init();
    console.log('   ✅ Connected\n');

    console.log('2️⃣  Syncing memories...');
    const results = await bridge.syncRecentMemories({ limit });
    
    console.log(`\n📊 Results:`);
    console.log(`   Total: ${results.total}`);
    console.log(`   Synced: ${results.synced} ✅`);
    console.log(`   Failed: ${results.failed} ❌`);
    
    if (results.errors.length > 0) {
      console.log(`\n❌ Errors:`);
      results.errors.slice(0, 5).forEach(e => {
        console.log(`   - ${e.entry}: ${e.error}`);
      });
    }

    console.log('\n3️⃣  Final statistics...');
    const stats = await bridge.getStats();
    console.log(`   AgentDB Episodes: ${stats.agentdb.episodes}`);
    console.log(`   AgentDB Embeddings: ${stats.agentdb.embeddings}`);

    console.log('\n✅ Sync complete!');
    await bridge.close();
  } catch (error) {
    console.error('\n❌ Sync failed:', error.message);
    process.exit(1);
  }
}

main();
