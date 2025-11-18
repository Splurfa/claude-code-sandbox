# Integration Points

## How Components Connect and Communicate

This document maps all integration points between system components, explaining how data flows across boundaries.

## Component Map

```
┌─────────────────────────────────────────────────────────────┐
│                     Claude Code (User Interface)            │
└────────────┬──────────────────────────────────┬─────────────┘
             │                                  │
             ↓                                  ↓
┌────────────────────────┐         ┌───────────────────────┐
│   MCP Tools            │         │   Task Tool           │
│   (Coordination)       │         │   (Execution)         │
└────────────┬───────────┘         └──────────┬────────────┘
             │                                │
             ↓                                ↓
┌────────────────────────────────────────────────────────────┐
│              Agents (researcher, coder, tester, etc.)       │
└────────────┬──────────────────────────────────┬────────────┘
             │                                  │
             ↓                                  ↓
┌────────────────────────┐         ┌───────────────────────┐
│   Memory Database      │         │   File System         │
│   (.swarm/memory.db)   │         │   (sessions/)         │
└────────────┬───────────┘         └──────────┬────────────┘
             │                                │
             ↓                                ↓
┌────────────────────────────────────────────────────────────┐
│                       Hooks System                          │
│         (Updates memory, journals, tracks metrics)          │
└─────────────────────────────────────────────────────────────┘
```

---

## Integration 1: Claude Code ↔ MCP Tools

### Protocol: Model Context Protocol

**Direction**: Bidirectional (Claude Code calls MCP, MCP returns results)

**Transport**: JSON-RPC over stdio

**Data Format**:
```json
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "mcp__claude-flow_alpha__memory_usage",
    "arguments": {
      "action": "store",
      "key": "auth/patterns",
      "value": "{...}"
    }
  },
  "id": 1
}
```

**Response**:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "success": true,
    "key": "auth/patterns",
    "namespace": "default"
  },
  "id": 1
}
```

---

### Key MCP Tools

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| `swarm_init` | Initialize coordination | Topology, maxAgents | Swarm ID |
| `agent_spawn` | Define agent type | Type, capabilities | Agent ID |
| `task_orchestrate` | High-level planning | Task description | Orchestration plan |
| `memory_usage` | Persistent storage | action, key, value | Success/data |
| `neural_train` | Train patterns | Training data | Model ID |

---

### Example Call Chain

**User**: "Build REST API"

**Claude Code**:
```javascript
// 1. Initialize swarm (optional)
mcp__claude-flow__swarm_init({
  topology: "mesh",
  maxAgents: 5
})
// → Returns: { swarm_id: "swarm-abc123" }

// 2. Define agent types
mcp__claude-flow__agent_spawn({ type: "researcher" })
mcp__claude-flow__agent_spawn({ type: "coder" })
// → Returns: { agent_id: "agent-001" }

// 3. Store coordination plan
mcp__claude-flow__memory_usage({
  action: "store",
  key: "swarm/plan",
  value: JSON.stringify({ tasks: [...] }),
  namespace: "swarm-abc123"
})
// → Returns: { success: true }
```

---

## Integration 2: Claude Code ↔ Task Tool

### Protocol: Claude Code Native (Subprocess Spawning)

**Direction**: Unidirectional (Claude Code spawns agents, agents return results)

**Transport**: Process stdout/stderr

**Data Format**: Text streams

---

### Task Tool Interface

**Invocation**:
```javascript
Task("Research agent", "Analyze JWT patterns. Save to sessions/$SESSION_ID/artifacts/docs/", "researcher")
```

**What Happens**:
1. Claude Code spawns subprocess with context
2. Agent executes task (has full access to tools)
3. Agent writes results to session artifacts
4. Process terminates, stdout returned to Claude Code

**Performance**: 10-20x faster than sequential spawning (parallel execution)

---

### Example Task Chain

```javascript
// Single message (parallel execution)
Task("Researcher", "Analyze auth patterns", "researcher")
Task("Coder", "Implement JWT auth", "coder")
Task("Tester", "Write auth tests", "tester")

// All 3 agents run simultaneously
// Each agent has access to:
//   - MCP tools (memory, coordination)
//   - File system (read/write artifacts)
//   - Full project context
```

---

## Integration 3: Agents ↔ Memory Database

### Protocol: MCP Tools (via claude-flow)

**Direction**: Bidirectional (agents read/write memory)

**Transport**: SQLite via MCP wrapper

**Data Format**: Key-value JSON

---

### Memory Operations

**Store**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "auth/jwt-patterns",
  value: JSON.stringify({ algorithm: "RS256" }),
  namespace: "default"
})
```

**Retrieve**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "retrieve",
  key: "auth/jwt-patterns",
  namespace: "default"
})
// → Returns: { value: "{\"algorithm\":\"RS256\"}" }
```

**Search**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "search",
  pattern: "auth/%",
  namespace: "default"
})
// → Returns: [{ key: "auth/jwt-patterns", value: "..." }, ...]
```

---

### Cross-Agent Coordination Pattern

```
Agent A (Researcher)
   ↓ Stores findings
Memory DB
   ↑ Retrieves findings
Agent B (Coder)
   ↓ Stores implementation notes
Memory DB
   ↑ Retrieves implementation notes
Agent C (Tester)
```

**Key Insight**: Agents coordinate through memory, not direct communication.

---

## Integration 4: Agents ↔ File System

### Protocol: Direct File I/O (via Claude Code tools)

**Direction**: Bidirectional (agents read/write files)

**Transport**: OS file system calls

**Data Format**: Text files (code, markdown, JSON, etc.)

---

### File Operations

**Write**:
```javascript
Write("sessions/$SESSION_ID/artifacts/code/auth.js", content)
```

**Read**:
```javascript
Read("sessions/$SESSION_ID/artifacts/code/auth.js")
// → Returns file contents
```

**Edit**:
```javascript
Edit("sessions/$SESSION_ID/artifacts/code/auth.js", old_string, new_string)
```

---

### Session Artifact Structure

```
sessions/$SESSION_ID/artifacts/
├── code/           # Source code (agents write here)
├── tests/          # Test files (tester agent writes here)
├── docs/           # Documentation (researcher writes here)
├── scripts/        # Build/deploy scripts
└── notes/          # Scratch notes
```

**Isolation**: Each session has its own directory → No cross-session file conflicts.

---

## Integration 5: File System ↔ Hooks

### Protocol: Event-driven (Claude Code hook system)

**Direction**: Unidirectional (file ops trigger hooks)

**Transport**: Process execution (bash commands)

**Data Format**: Command-line arguments

---

### Hook Trigger Flow

```
Agent: Write("sessions/$SESSION_ID/artifacts/code/auth.js")
       ↓
File System: File created
       ↓
Hook Trigger: PostToolUse matcher "Write"
       ↓
Hook Execute: npx claude-flow@alpha hooks post-edit --file "auth.js"
       ↓
Hook Actions:
  - Update memory
  - Append to Captain's Log
  - Increment metrics
```

---

### Hook Configuration

**File**: `.claude/settings.json`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks post-edit --file '{}'"
        }]
      }
    ]
  }
}
```

**Placeholder `{}`**: Replaced with file path by Claude Code.

---

## Integration 6: Hooks ↔ Captain's Log

### Protocol: File append (bash)

**Direction**: Unidirectional (hooks write to log)

**Transport**: File system append

**Data Format**: Markdown

---

### Log Entry Creation

**Hook Command**:
```bash
npx claude-flow@alpha hooks post-edit --file "auth.js"
```

**Hook Implementation** (conceptual):
```bash
# Inside hooks post-edit
echo "## [$(date +%H:%M)] File Modified: $FILE" >> sessions/captains-log/$(date +%Y-%m-%d).md
echo "**Agent:** $AGENT" >> sessions/captains-log/$(date +%Y-%m-%d).md
echo "" >> sessions/captains-log/$(date +%Y-%m-%d).md
```

**Result**:
```markdown
## [10:15] File Modified: auth.js
**Agent:** coder
```

---

### Daily Log Files

```
sessions/captains-log/
├── 2025-11-17.md   # Today's entries (appended to continuously)
├── 2025-11-16.md   # Yesterday's entries
└── 2025-11-15.md   # Older entries
```

**File Selection**: `$(date +%Y-%m-%d).md` (automatically creates file if doesn't exist)

---

## Integration 7: Hooks ↔ Memory Database

### Protocol: MCP Tools (indirect)

**Direction**: Unidirectional (hooks write to memory)

**Transport**: Hook calls MCP tool

**Data Format**: Key-value JSON

---

### Memory Update Flow

```
Hook: npx claude-flow@alpha hooks post-edit --file "auth.js"
       ↓
Hook calls MCP tool:
  mcp__claude_flow_alpha__memory_usage({
    action: "store",
    key: "files/code/auth.js",
    value: JSON.stringify({
      last_modified: Date.now(),
      agent: "coder",
      lines: 150
    }),
    namespace: SESSION_ID
  })
       ↓
Memory DB: Entry stored
```

**Result**: File metadata available to all agents via memory queries.

---

## Integration 8: Session Closeout ↔ Backups

### Protocol: JSON export (hooks)

**Direction**: Unidirectional (session data → backup file)

**Transport**: File write

**Data Format**: JSON snapshot

---

### Backup Creation Flow

```
User: /session-closeout
       ↓
Hook: npx claude-flow@alpha hooks session-end --export-metrics true
       ↓
Hook actions:
  1. Query memory for session data
  2. Aggregate metrics
  3. Generate summary
  4. Export to .swarm/backups/session-ID.json
```

**Backup Contents**:
```json
{
  "session_id": "session-20251117-100232",
  "started_at": 1700000000,
  "ended_at": 1700001000,
  "duration_seconds": 1000,
  "memory_snapshot": {
    "namespace": "session-20251117-100232",
    "entries": [
      { "key": "auth/patterns", "value": "{...}" }
    ]
  },
  "metrics": {
    "agents_spawned": 5,
    "files_created": 12
  },
  "files": [
    "artifacts/code/auth.js",
    "artifacts/tests/auth.test.js"
  ]
}
```

---

## Integration 9: Hive-Mind ↔ Core System

### Protocol: Extension layer (100% stock)

**Direction**: Bidirectional (hive-mind uses core features)

**Transport**: Same as core (MCP tools, memory, hooks)

**Data Format**: Same as core

---

### Hive-Mind Extensions

**What Hive-Mind Adds**:
- Queen hierarchy (strategic, tactical, adaptive)
- Worker specializations (5 core types)
- Consensus algorithms (majority, weighted, Byzantine)
- Automatic task routing (keyword matching)

**What Hive-Mind Uses**:
- ✅ Stock memory database (`.hive-mind/hive.db`)
- ✅ Stock MCP tools
- ✅ Stock hooks system
- ✅ Stock agent framework

**Integration Point**: Hive-mind is a **coordination pattern**, not a separate system.

---

### Hive-Mind Coordination Flow

```
User: /hive-mind:wizard
       ↓
Queen Selection (strategic/tactical/adaptive)
       ↓
Worker Assignment (keyword matching)
       ↓
MCP: swarm_init (hierarchical topology)
       ↓
Task Tool: Spawn queen + workers in parallel
       ↓
Agents coordinate via memory
       ↓
Consensus algorithm (majority/weighted/Byzantine)
       ↓
Results synthesized by queen
```

**Stock Adherence**: 100% (hive-mind uses only stock features)

---

## Integration 10: AgentDB ↔ Memory Database

### Protocol: Wrapper layer (95% stock)

**Direction**: AgentDB wraps memory for semantic search

**Transport**: SQLite + vector embeddings

**Data Format**: Key-value + embeddings

---

### AgentDB Enhancement

**Standard Memory**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "search",
  pattern: "auth/%"  // Exact pattern match
})
```

**AgentDB Semantic Search** (optional):
```javascript
// AgentDB generates embedding for query
agentdb.search("JWT security best practices")
// → Returns "auth/jwt-patterns" (semantic match, not exact)
```

**How It Works**:
1. Store: Generate embedding for value → Store in `.swarm/agentdb/`
2. Search: Generate embedding for query → Find nearest neighbors
3. Return: Most semantically similar entries

**Stock**: ✅ 95% (AgentDB is stock library, wrapper adds 5%)

---

## Data Flow Across Integrations

### Complete Request Flow

```
1. User Input
   "Build REST API with authentication"
   ↓
2. Claude Code → MCP Tools
   swarm_init({ topology: "mesh" })
   ↓
3. Claude Code → Task Tool
   Task("Researcher", "...", "researcher")
   Task("Coder", "...", "coder")
   Task("Tester", "...", "tester")
   ↓
4. Agents → Memory Database
   Store findings, implementation notes
   ↓
5. Agents → File System
   Write code/tests/docs to artifacts/
   ↓
6. File System → Hooks
   PostToolUse triggers on each file write
   ↓
7. Hooks → Memory Database
   Store file metadata
   ↓
8. Hooks → Captain's Log
   Append journal entries
   ↓
9. Claude Code ← Agents
   Results aggregated and presented
   ↓
10. User: /session-closeout
    ↓
11. Hooks → Backups
    Export snapshot to .swarm/backups/
```

**Total Integrations**: 10 distinct integration points, all using stock protocols.

---

## Cross-Cutting Concerns

### Authentication

**Not Applicable**: System runs locally, no authentication needed.

**Exception**: Flow-Nexus MCP tools (optional cloud features require login)

---

### Error Handling

**Integration Points with Error Handling**:

| Integration | Error Type | Handling |
|-------------|------------|----------|
| MCP Tools | Tool call fails | Retry 3x, then report error |
| Task Tool | Agent subprocess crashes | Log error, continue with other agents |
| Memory DB | SQLite locked | Wait up to 5s (busy timeout) |
| File System | Permission denied | Fail immediately, report to user |
| Hooks | Hook command fails | Log warning, continue (non-blocking) |

---

### Performance Bottlenecks

**Identified Bottlenecks**:

1. **SQLite Write Lock** (memory database)
   - Mitigation: WAL mode (concurrent reads)
   - Limit: 1000 writes/sec

2. **Sequential Agent Spawning**
   - Mitigation: Parallel Task tool
   - Speedup: 10-20x

3. **File I/O** (large files)
   - Mitigation: SSD recommended
   - Limit: Disk throughput (~100 MB/s)

4. **Hook Cascade** (many file ops)
   - Mitigation: Batch operations
   - Overhead: <100ms per operation

---

## Extension Points

### Adding Custom MCP Tools

**Example**: Custom tool for GitHub integration

**Steps**:
1. Create MCP server (follows MCP spec)
2. Register in `.claude/settings.json`:
   ```json
   {
     "mcpServers": {
       "my-custom-server": {
         "command": "node",
         "args": ["./my-mcp-server.js"]
       }
     }
   }
   ```
3. Use in workflows:
   ```javascript
   mcp__my_custom_server__custom_tool({
     param: "value"
   })
   ```

**Stock Adherence**: ✅ 100% (MCP protocol is extensible by design)

---

### Adding Custom Hooks

**Example**: Auto-format code on save

**Steps**:
1. Edit `.claude/settings.json`:
   ```json
   {
     "hooks": {
       "PostToolUse": [
         {
           "matcher": "Write",
           "hooks": [{
             "type": "command",
             "command": "npx prettier --write '{}'"
           }]
         }
       ]
     }
   }
   ```
2. Hook auto-fires on file writes

**Stock Adherence**: ✅ 100% (hook system is native)

---

### Adding Custom Agents

**Example**: Custom "documentation" agent

**Steps**:
1. Create agent persona (`.claude/agents/documentation.md`)
2. Define capabilities and keywords
3. Use in Task tool:
   ```javascript
   Task("Documentation agent", "Generate API docs", "documentation")
   ```

**Stock Adherence**: ✅ 100% (agent framework is extensible)

---

## Testing Integration Points

### Integration Test Checklist

**Memory Integration**:
- [ ] Store entry → Retrieve entry (success)
- [ ] Store with TTL → Wait → Entry expired
- [ ] Concurrent reads (no locks)
- [ ] Concurrent writes (serialized correctly)

**Hook Integration**:
- [ ] File write → PostToolUse fires
- [ ] Hook updates memory
- [ ] Hook appends to Captain's Log
- [ ] Hook failure doesn't block operation

**Task Tool Integration**:
- [ ] Spawn 5 agents in parallel
- [ ] All agents complete successfully
- [ ] Results aggregated correctly

**Session Closeout Integration**:
- [ ] Generate summary
- [ ] Export backup
- [ ] Update Captain's Log
- [ ] HITL approval works

---

## Summary

**This workspace has 10 major integration points**, all using stock protocols:

1. **Claude Code ↔ MCP Tools** (JSON-RPC)
2. **Claude Code ↔ Task Tool** (subprocess)
3. **Agents ↔ Memory Database** (MCP wrapper)
4. **Agents ↔ File System** (direct I/O)
5. **File System ↔ Hooks** (event-driven)
6. **Hooks ↔ Captain's Log** (file append)
7. **Hooks ↔ Memory Database** (MCP wrapper)
8. **Session Closeout ↔ Backups** (JSON export)
9. **Hive-Mind ↔ Core System** (extension layer)
10. **AgentDB ↔ Memory Database** (semantic wrapper)

**Stock Adherence**: 98% (all protocols are stock, configuration is 2% custom)

**Key Insight**: Integration is **simple and reliable** because the system uses standard protocols (MCP, SQLite, file I/O) instead of custom frameworks.

**Next Steps**:
- [Data Flow](data-flow.md) - How data moves through integration points
- [Architecture Overview](architecture-overview.md) - High-level component design
- [Stock vs Custom](stock-vs-custom.md) - What's stock, what's custom
