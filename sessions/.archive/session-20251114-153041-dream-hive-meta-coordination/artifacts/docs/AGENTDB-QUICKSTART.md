# AgentDB Quick Reference Guide

**For:** Dream Hive Meta-Coordination System
**Version:** AgentDB v1.6.1
**Database:** `.agentdb/reasoningbank.db`

---

## Quick Commands

### Database Operations

```bash
# Get statistics
npx agentdb@latest stats .agentdb/reasoningbank.db

# Export backup
npx agentdb@latest export .agentdb/reasoningbank.db ./backup.json

# Import backup
npx agentdb@latest import ./backup.json

# Reinitialize (if needed)
npx agentdb@latest init .agentdb/reasoningbank.db --dimension 1536 --preset medium
```

---

## Using the Integration

### 1. Test the Bridge

```bash
cd sessions/session-20251114-153041-dream-hive-meta-coordination/artifacts/code/integrations
node test-agentdb-sync.js
```

**Expected Output:**
```
✅ Bridge initialized
✅ Connected to memory.db
Memory DB: 29,600 entries, 77 patterns
AgentDB: 0 episodes, 0 embeddings
✅ Test completed successfully!
```

### 2. Sync Memories to AgentDB

```javascript
const MemoryAgentDBBridge = require('./integrations/memory-agentdb-bridge');

const bridge = new MemoryAgentDBBridge();
await bridge.init();

// Sync 100 recent memories
const results = await bridge.syncRecentMemories({ limit: 100 });
console.log(`Synced: ${results.synced}, Failed: ${results.failed}`);
```

### 3. Semantic Search

```javascript
// Search memories semantically
const results = await bridge.searchMemorySemantica("hooks validation", {
  limit: 10,
  minReward: 0.7
});

console.log('Found memories:', results);
```

---

## CLI Examples

### Store Episodes

```bash
# Store a successful episode
npx agentdb@latest reflexion store \
  "session-123" \
  "implement authentication" \
  0.95 \
  true \
  "Used OAuth2 with JWT tokens"

# Store a failed episode
npx agentdb@latest reflexion store \
  "session-124" \
  "fix bug in payment flow" \
  0.3 \
  false \
  "Approach didn't work, need to refactor"
```

### Search Episodes

```bash
# Semantic search with context synthesis
npx agentdb@latest reflexion retrieve "authentication" \
  --k 10 \
  --synthesize-context

# Only successful episodes
npx agentdb@latest reflexion retrieve "bug fix" \
  --only-successes \
  --min-reward 0.8

# With metadata filters
npx agentdb@latest reflexion retrieve "API development" \
  --filters '{"metadata.priority":"high"}'
```

### Causal Relationships

```bash
# Add causal edge
npx agentdb@latest causal add-edge \
  "add_tests" \
  "code_quality" \
  0.25 \
  0.95 \
  100

# Query causal graph
npx agentdb@latest causal query "add_tests" --depth 2
```

---

## JavaScript API

### AgentDBWrapper

```javascript
const AgentDBWrapper = require('./integrations/agentdb-wrapper');
const db = new AgentDBWrapper();

// Get stats
const stats = db.getStats();
console.log('Episodes:', stats.episodes);
console.log('Embeddings:', stats.embeddings);

// Add episode
await db.addEpisode({
  observation: "User authentication flow",
  thought: "Implement JWT-based auth",
  action: "Created auth middleware",
  reward: 0.95,
  metadata: {
    session_id: "session-123",
    priority: "high"
  }
});

// Search episodes
const results = await db.searchEpisodes("authentication", {
  limit: 10,
  minReward: 0.7
});

// Export backup
await db.export('./backup.json');
```

### MemoryAgentDBBridge

```javascript
const MemoryAgentDBBridge = require('./integrations/memory-agentdb-bridge');
const bridge = new MemoryAgentDBBridge();

await bridge.init();

// Get all stats
const stats = await bridge.getStats();
console.log('Memory DB:', stats.memory_db);
console.log('AgentDB:', stats.agentdb);

// Get memory entries
const entries = await bridge.getMemoryEntries({
  namespace: 'default',
  limit: 100
});

// Sync specific entry
const result = await bridge.syncEntryToAgentDB(entries[0]);

// Sync recent memories
const syncResults = await bridge.syncRecentMemories({ limit: 100 });

// Get patterns
const patterns = await bridge.getPatterns({ limit: 50 });

// Sync pattern to causal graph
await bridge.syncPatternToAgentDB(patterns[0]);
```

---

## Common Patterns

### 1. Daily Memory Sync

```javascript
// Sync today's memories to AgentDB
const bridge = new MemoryAgentDBBridge();
await bridge.init();

const yesterday = Date.now() / 1000 - 86400;
const entries = await bridge.getMemoryEntries({ limit: 1000 });

// Filter entries from last 24 hours
const recentEntries = entries.filter(e => e.created_at > yesterday);

// Sync to AgentDB
for (const entry of recentEntries) {
  await bridge.syncEntryToAgentDB(entry);
}
```

### 2. Pattern Learning

```javascript
// Extract patterns from successful episodes
const patterns = await bridge.getPatterns({
  limit: 100
});

// Convert high-confidence patterns to causal edges
for (const pattern of patterns) {
  if (pattern.confidence > 0.8) {
    await bridge.syncPatternToAgentDB(pattern);
  }
}
```

### 3. Semantic Memory Search

```javascript
// Find memories related to a topic
const query = "hooks validation and testing";
const results = await bridge.searchMemorySemantica(query, {
  limit: 20,
  minReward: 0.7
});

// Group by namespace
const byNamespace = results.reduce((acc, r) => {
  acc[r.namespace] = acc[r.namespace] || [];
  acc[r.namespace].push(r);
  return acc;
}, {});
```

---

## Performance Tips

1. **Batch Operations**: Sync memories in batches of 100-1000 for best performance
2. **Filter by Reward**: Use `minReward` to only sync high-quality memories
3. **Use Namespaces**: Organize memories by namespace for targeted sync
4. **Export Regularly**: Create backups before large sync operations
5. **Monitor Size**: Check database size with `stats` command

---

## Troubleshooting

### Database not found
```bash
# Check if database exists
ls -lh .agentdb/reasoningbank.db

# Reinitialize if missing
npx agentdb@latest init .agentdb/reasoningbank.db --dimension 1536
```

### CLI command fails
```bash
# Verify AgentDB version
npx agentdb@latest --version

# Should show: agentdb v1.6.1 or later
```

### Memory sync errors
```javascript
// Check memory.db exists
const fs = require('fs');
console.log(fs.existsSync('.swarm/memory.db')); // Should be true

// Test bridge initialization
const bridge = new MemoryAgentDBBridge();
await bridge.init(); // Should not throw error
```

### Search returns no results
```bash
# Check if episodes are stored
npx agentdb@latest stats .agentdb/reasoningbank.db
# Episodes should be > 0

# If 0, sync some memories first
node integrations/memory-agentdb-bridge.js
```

---

## File Locations

```
Project Root/
├── .agentdb/
│   └── reasoningbank.db          # AgentDB vector database (376 KB)
├── .swarm/
│   └── memory.db                 # SQLite memory (43 MB)
└── sessions/session-20251114-153041-dream-hive-meta-coordination/
    └── artifacts/code/integrations/
        ├── agentdb-wrapper.js           # AgentDB CLI wrapper
        ├── memory-agentdb-bridge.js     # Memory ↔ AgentDB bridge
        └── test-agentdb-sync.js         # Integration test
```

---

## Next Steps

1. **Bulk Sync**: Sync all 29,600 memories to AgentDB
   ```javascript
   await bridge.syncRecentMemories({ limit: 29600 });
   ```

2. **Pattern Migration**: Convert patterns to causal graph
   ```javascript
   const patterns = await bridge.getPatterns();
   for (const p of patterns) await bridge.syncPatternToAgentDB(p);
   ```

3. **MCP Integration**: Add AgentDB MCP server
   ```bash
   claude mcp add agentdb npx agentdb@latest mcp
   ```

4. **Skills Update**: Enable real vector search in skills
   - `.claude/skills/agentdb-vector-search/`
   - `.claude/skills/reasoningbank-agentdb/`

---

**Quick Reference Version:** 1.0
**Last Updated:** 2025-11-14
**Status:** ✅ Ready for use
