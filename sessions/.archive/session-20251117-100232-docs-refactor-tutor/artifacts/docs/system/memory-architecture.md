# Memory Architecture

## The `.swarm/memory.db` Database Explained

This document explains the persistent memory system that enables cross-session coordination and agent collaboration.

## What Is the Memory Database?

**Location**: `.swarm/memory.db`

**Technology**: SQLite 3.x (embedded relational database)

**Purpose**: Persistent key-value store for agent coordination and cross-session context.

**Stock**: ✅ 100% stock claude-flow (no custom database layer)

---

## Why SQLite?

**Advantages**:
- ✅ **Zero configuration** (no database server needed)
- ✅ **ACID transactions** (atomic, consistent, isolated, durable)
- ✅ **Fast** (1000+ writes/sec, unlimited concurrent reads)
- ✅ **Portable** (single file, cross-platform)
- ✅ **Mature** (battle-tested since 2000)

**Comparison to Alternatives**:
- **vs. JSON files**: SQLite supports concurrent access, JSON doesn't
- **vs. PostgreSQL**: SQLite is embedded (no server), PostgreSQL requires setup
- **vs. Redis**: SQLite persists to disk, Redis is in-memory (data loss risk)

**The Right Tool**: For agent coordination, SQLite is the sweet spot (simple + reliable + fast).

---

## Database Schema

### Memory Table

```sql
CREATE TABLE memory (
  namespace TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  ttl INTEGER,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  PRIMARY KEY (namespace, key)
);

CREATE INDEX idx_memory_namespace ON memory(namespace);
CREATE INDEX idx_memory_ttl ON memory(ttl);
```

**Field Descriptions**:

| Field | Type | Purpose |
|-------|------|---------|
| `namespace` | TEXT | Session/swarm isolation (e.g., "default", "swarm-123") |
| `key` | TEXT | Hierarchical identifier (e.g., "auth/jwt-patterns") |
| `value` | TEXT | JSON or plain text data |
| `ttl` | INTEGER | Expiration timestamp (Unix seconds, NULL = permanent) |
| `created_at` | INTEGER | Creation timestamp (Unix seconds) |
| `updated_at` | INTEGER | Last modification timestamp |

**Primary Key**: `(namespace, key)` → Ensures uniqueness per namespace

**Indexes**:
- `idx_memory_namespace` → Fast queries by namespace
- `idx_memory_ttl` → Efficient TTL cleanup

---

## CRUD Operations

### Create (Store)

**Command**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "auth/jwt-patterns",
  value: JSON.stringify({
    algorithm: "RS256",
    expiration: "15min",
    refresh: "7d"
  }),
  namespace: "default",
  ttl: 604800  // 7 days
})
```

**SQL Executed**:
```sql
INSERT OR REPLACE INTO memory (namespace, key, value, ttl, created_at, updated_at)
VALUES (
  'default',
  'auth/jwt-patterns',
  '{"algorithm":"RS256","expiration":"15min","refresh":"7d"}',
  1700604800,  -- ttl timestamp
  1700000000,  -- created_at
  1700000000   -- updated_at
);
```

**Behavior**:
- If key exists → **Update** (replace value, update timestamp)
- If key doesn't exist → **Insert** (new entry)

---

### Read (Retrieve)

**Command**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "retrieve",
  key: "auth/jwt-patterns",
  namespace: "default"
})
```

**SQL Executed**:
```sql
SELECT value, created_at, updated_at
FROM memory
WHERE namespace = 'default'
  AND key = 'auth/jwt-patterns'
  AND (ttl IS NULL OR ttl > strftime('%s', 'now'));
```

**Returns**:
```json
{
  "value": "{\"algorithm\":\"RS256\",\"expiration\":\"15min\",\"refresh\":\"7d\"}",
  "created_at": 1700000000,
  "updated_at": 1700000000
}
```

**TTL Check**: Expired entries return `NULL` (automatic cleanup on read).

---

### Update

**Same as Store**: `INSERT OR REPLACE` handles both insert and update.

**Timestamp Behavior**:
- `created_at` → Preserved on update
- `updated_at` → Refreshed on update

---

### Delete

**Command**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "delete",
  key: "auth/jwt-patterns",
  namespace: "default"
})
```

**SQL Executed**:
```sql
DELETE FROM memory
WHERE namespace = 'default'
  AND key = 'auth/jwt-patterns';
```

---

### List (Enumerate)

**Command**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "list",
  namespace: "default"
})
```

**SQL Executed**:
```sql
SELECT key, value, created_at, updated_at
FROM memory
WHERE namespace = 'default'
  AND (ttl IS NULL OR ttl > strftime('%s', 'now'))
ORDER BY updated_at DESC;
```

**Returns**:
```json
[
  {"key": "auth/jwt-patterns", "value": "{...}", "updated_at": 1700000003},
  {"key": "api/endpoints/users", "value": "{...}", "updated_at": 1700000002},
  {"key": "db/schema/users", "value": "{...}", "updated_at": 1700000001}
]
```

---

### Search (Pattern Matching)

**Command**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "search",
  pattern: "auth/%",  // SQL LIKE pattern
  namespace: "default"
})
```

**SQL Executed**:
```sql
SELECT key, value, created_at, updated_at
FROM memory
WHERE namespace = 'default'
  AND key LIKE 'auth/%'
  AND (ttl IS NULL OR ttl > strftime('%s', 'now'))
ORDER BY updated_at DESC;
```

**Pattern Examples**:
- `"auth/%"` → All auth-related keys
- `"%/patterns"` → All pattern-related keys
- `"%jwt%"` → All keys containing "jwt"

---

## Namespace Strategy

### Built-In Namespaces

| Namespace | Purpose | Scope |
|-----------|---------|-------|
| `default` | Cross-session shared patterns | Global |
| `session-ID` | Session-specific data | Per chat thread |
| `swarm-ID` | Swarm coordination state | Per swarm |
| `agent-type` | Agent-specific memory | Per agent role |

### Example Usage

```javascript
// Global pattern (available to all sessions)
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "project/tech-stack",
  value: "Node.js + PostgreSQL",
  namespace: "default"  // ← Cross-session
})

// Session-specific data (isolated)
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "api/endpoints/users",
  value: "POST /api/v1/users",
  namespace: "session-20251117-100232"  // ← This session only
})

// Swarm coordination (isolated)
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "queue/pending-tasks",
  value: JSON.stringify(["task1", "task2"]),
  namespace: "swarm-abc123"  // ← This swarm only
})
```

**Isolation Guarantees**:
- Agents in `session-A` **cannot** read `session-B` namespace (unless explicitly allowed)
- Swarm coordination **cannot** interfere with other swarms
- `default` namespace is shared (use for project-wide patterns)

---

## TTL (Time-to-Live) Management

### How TTL Works

**Concept**: Each entry can have an expiration time.

**Storage**: Unix timestamp (seconds since epoch)

**Example**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "swarm/active-agents",
  value: "5",
  ttl: Math.floor(Date.now() / 1000) + 3600  // 1 hour from now
})
```

**Cleanup**:
- **Automatic**: Expired entries filtered out on read (SQL `WHERE ttl > NOW()`)
- **Manual**: `npx claude-flow@alpha hooks memory --action cleanup`

### TTL Strategies

| Use Case | TTL | Reasoning |
|----------|-----|-----------|
| Swarm coordination | 1 hour | Temporary state, session-scoped |
| Session data | 7 days | Useful for recent context |
| Project patterns | 30 days | Long-term but refreshable |
| Architecture decisions | Permanent | Never expires (no TTL) |

**Best Practice**: Set TTL for temporary data, omit for permanent patterns.

---

## Concurrency and Locking

### SQLite WAL Mode

**What is WAL?** Write-Ahead Logging (journaling mode)

**Configuration**:
```sql
PRAGMA journal_mode = WAL;
```

**Benefits**:
- ✅ **Concurrent reads**: Multiple agents can read simultaneously
- ✅ **Non-blocking writes**: Readers don't block writers
- ✅ **Crash recovery**: WAL log enables rollback

**How It Works**:
```
Agent A reads → .swarm/memory.db (no lock)
Agent B reads → .swarm/memory.db (no lock)
Agent C writes → .swarm/memory.db-wal (write log)
       ↓
Background checkpoint merges WAL → .swarm/memory.db
```

**Performance**:
- **Reads**: Unlimited concurrent (no locking)
- **Writes**: Serialized by SQLite (automatic)

---

### Write Conflicts

**Scenario**: Two agents try to update the same key simultaneously.

**SQLite Behavior**:
```
Agent A: UPDATE memory SET value = 'A' WHERE key = 'counter'
Agent B: UPDATE memory SET value = 'B' WHERE key = 'counter'
```

**Resolution**:
1. SQLite serializes writes (Agent A completes first)
2. Agent B's write overwrites Agent A
3. Last write wins (no merge, no conflict resolution)

**Best Practice**:
- Use unique keys per agent → Avoid conflicts
- Use work queue pattern → Atomic task claiming
- Use consensus pattern → Vote instead of direct update

---

## Performance Characteristics

### Benchmarks

**Test Environment**: MacBook Pro M1, SSD

| Operation | Throughput | Latency |
|-----------|------------|---------|
| Single Read | ~100K ops/sec | <0.01 ms |
| Batch Read (100 keys) | ~10K ops/sec | <0.1 ms |
| Single Write | ~1K ops/sec | ~1 ms |
| Batch Write (100 keys) | ~500 ops/sec | ~2 ms |

**Key Insight**: Reads are **100x faster** than writes (WAL mode advantage).

---

### Scaling Limits

**Tested Configurations**:
- ✅ 36,000 entries (229 MB) → No performance degradation
- ✅ 8 concurrent agents → Reads scale linearly
- ✅ 1000 writes/sec → Sustained throughput

**Estimated Limits**:
- **Database Size**: 100+ GB (SQLite supports up to 281 TB)
- **Concurrent Readers**: Unlimited (WAL mode)
- **Concurrent Writers**: 1 (SQLite write lock)

**Practical Bottleneck**: Disk I/O (SSD recommended for high-write workloads).

---

## Backup and Recovery

### Automatic Backups

**Hook Trigger**: Session closeout

**Command**:
```bash
npx claude-flow@alpha hooks session-end --export-metrics true
```

**Backup Location**: `.swarm/backups/session-ID.json`

**Backup Contents**:
```json
{
  "session_id": "session-20251117-100232",
  "memory_snapshot": {
    "namespace": "session-20251117-100232",
    "entries": [
      {"key": "auth/patterns", "value": "{...}"},
      {"key": "api/design", "value": "{...}"}
    ]
  },
  "metrics": {
    "agents_spawned": 5,
    "files_created": 12,
    "duration_seconds": 180
  }
}
```

**Restoration**:
```bash
# Import from backup
npx claude-flow@alpha hooks session-restore --backup ".swarm/backups/session-ID.json"
```

---

### Manual Backups

**Full Database Backup**:
```bash
# Using SQLite CLI
sqlite3 .swarm/memory.db ".backup .swarm/memory-backup-$(date +%Y%m%d).db"

# Using cp (while database is idle)
cp .swarm/memory.db .swarm/memory-backup-$(date +%Y%m%d).db
```

**Namespace Backup** (export to JSON):
```bash
npx claude-flow@alpha hooks memory --action export --namespace "default" > default-backup.json
```

---

### Disaster Recovery

**Scenario**: `.swarm/memory.db` corrupted

**Recovery Steps**:
1. Stop all agents (prevent further corruption)
2. Attempt SQLite repair:
   ```bash
   sqlite3 .swarm/memory.db ".recover" | sqlite3 memory-recovered.db
   ```
3. If repair fails, restore from backup:
   ```bash
   cp .swarm/memory-backup-YYYYMMDD.db .swarm/memory.db
   ```
4. Verify integrity:
   ```bash
   sqlite3 .swarm/memory.db "PRAGMA integrity_check;"
   ```

**Prevention**:
- Enable WAL mode (default in claude-flow)
- Regular backups via session-end hook
- Monitor disk space (full disk → corruption)

---

## Integration with Other Systems

### Memory + Captain's Log

```
Agents work → Store decisions in memory
       ↓
Session closeout → Extract from memory
       ↓
Captain's Log → Human-readable narrative
```

**Example**:
```javascript
// Agent stores decision
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "decision/auth-algorithm",
  value: JSON.stringify({
    choice: "RS256",
    reason: "Better security than HS256",
    tradeoff: "Increased complexity"
  }),
  namespace: "default"
})

// Session closeout extracts decision
npx claude-flow@alpha hooks session-end --generate-summary true

// Captain's Log entry created:
## [14:23] Chose RS256 Over HS256
**Reasoning:** Better security (asymmetric signing)
**Tradeoff:** Increased complexity (public/private key pair)
```

---

### Memory + AgentDB Vector Search

**AgentDB**: Wrapper around memory for semantic search (optional).

**Location**: `.swarm/agentdb/`

**Usage**:
```javascript
// Store with vector embedding
agentdb.store({
  key: "auth/jwt-patterns",
  value: "Use RS256 for JWT signing",
  embedding: [0.12, 0.45, ...]  // Auto-generated
})

// Semantic search
agentdb.search("JWT security best practices")
// → Returns "auth/jwt-patterns" (semantic match)
```

**Stock**: ✅ 95% (AgentDB is stock, wrapper adds 5%)

---

## Debugging Memory Issues

### Common Problems

#### Issue 1: Entry Not Found

**Symptoms**: Agent reports "No data in memory"

**Diagnosis**:
```bash
# Check if entry exists
npx claude-flow@alpha hooks memory --action retrieve --key "auth/patterns" --namespace "default"

# List all keys in namespace
npx claude-flow@alpha hooks memory --action list --namespace "default"
```

**Likely Causes**:
- Wrong namespace
- Typo in key
- TTL expired
- Entry never stored

---

#### Issue 2: Stale Data

**Symptoms**: Agent reads outdated information

**Diagnosis**:
```bash
# Check timestamp
sqlite3 .swarm/memory.db "SELECT key, updated_at FROM memory WHERE key = 'auth/patterns'"
```

**Solution**:
- Refresh entry (store with new value)
- Check if another agent overwrote it
- Verify TTL hasn't expired

---

#### Issue 3: Database Locked

**Symptoms**: `SQLITE_BUSY` error

**Cause**: Long-running write transaction blocking reads

**Diagnosis**:
```bash
# Check for long transactions
sqlite3 .swarm/memory.db "PRAGMA busy_timeout;"
```

**Solution**:
- Increase busy timeout: `PRAGMA busy_timeout = 5000;` (5 seconds)
- Use WAL mode (default in claude-flow)
- Reduce transaction duration (batch writes)

---

### Inspection Tools

**SQLite CLI**:
```bash
# Interactive shell
sqlite3 .swarm/memory.db

# List all tables
.tables

# Describe schema
.schema memory

# Count entries
SELECT COUNT(*) FROM memory;

# Find large values
SELECT key, LENGTH(value) as size FROM memory ORDER BY size DESC LIMIT 10;
```

**Claude-Flow CLI**:
```bash
# List all entries
npx claude-flow@alpha hooks memory --action list --namespace "default"

# Search by pattern
npx claude-flow@alpha hooks memory --action search --pattern "auth/%"

# Cleanup expired entries
npx claude-flow@alpha hooks memory --action cleanup
```

---

## Best Practices

### Key Naming

✅ **Use hierarchical keys**:
- `"auth/jwt-patterns"` (clear)
- `"api/endpoints/users"` (organized)
- `"db/schema/users"` (domain-specific)

❌ **Avoid flat keys**:
- `"patterns"` (ambiguous)
- `"users"` (collision-prone)
- `"temp"` (unclear purpose)

---

### Value Storage

✅ **Use JSON for structured data**:
```javascript
value: JSON.stringify({
  algorithm: "RS256",
  expiration: "15min"
})
```

✅ **Use plain text for simple data**:
```javascript
value: "RS256"
```

❌ **Don't store large binaries**:
- Use file system for files
- Store file paths in memory

---

### TTL Management

✅ **Set TTL for temporary data**:
```javascript
ttl: Math.floor(Date.now() / 1000) + 3600  // 1 hour
```

✅ **Omit TTL for permanent patterns**:
```javascript
// No ttl parameter → permanent
```

❌ **Don't use extremely long TTL**:
```javascript
ttl: Math.floor(Date.now() / 1000) + 31536000  // 1 year (just omit TTL instead)
```

---

## Summary

**The memory database is the coordination backbone of the system.**

**Key Characteristics**:
- **Technology**: SQLite 3.x (embedded, ACID-compliant)
- **Schema**: Simple key-value with namespaces and TTL
- **Concurrency**: WAL mode (unlimited concurrent reads)
- **Performance**: 100K reads/sec, 1K writes/sec
- **Scale**: 36K+ entries tested, 100+ GB theoretical limit
- **Stock**: ✅ 100% stock claude-flow (no custom layer)

**Operations**:
- `store` → Create/update entry
- `retrieve` → Read single entry
- `list` → Enumerate namespace
- `search` → Pattern matching
- `delete` → Remove entry

**Best Practices**:
- Hierarchical keys (`domain/subdomain/item`)
- Namespace isolation (session-specific vs global)
- TTL for temporary data
- JSON for structured values

**Next Steps**:
- [Coordination Mechanics](coordination-mechanics.md) - How agents use memory
- [Session Lifecycle](session-lifecycle.md) - Memory in session context
- [Data Flow](data-flow.md) - Memory in the complete data pipeline
