# Data Flow

## How Information Moves Through the System

This document traces data from user input to final output, explaining how information transforms at each stage.

## Overview: The Complete Journey

```
User Input (natural language)
       ↓
Claude Code (parse intent)
       ↓
MCP Tools (setup coordination)
       ↓
Task Tool (spawn agents)
       ↓
Agents (execute in parallel)
       ↓
Memory Database (shared state)
       ↓
Session Artifacts (files)
       ↓
Hooks (journaling & metrics)
       ↓
User Output (results + summary)
```

## Stage-by-Stage Breakdown

### Stage 1: User Input → Intent Parsing

**Input**: Natural language command

```
User: "Build a REST API with JWT authentication and comprehensive tests"
```

**Claude Code Processing**:
1. Parse intent → "This needs multiple specialists"
2. Identify required agents → researcher, coder, tester, reviewer
3. Determine coordination pattern → mesh topology (peer-to-peer)
4. Plan artifact structure → code/, tests/, docs/

**Output**: Execution plan ready for MCP coordination

---

### Stage 2: MCP Coordination Setup (Optional)

**Input**: Execution plan

**MCP Tool Calls** (optional for complex tasks):
```javascript
mcp__claude-flow__swarm_init({
  topology: "mesh",
  maxAgents: 5,
  strategy: "balanced"
})

mcp__claude-flow__agent_spawn({ type: "researcher" })
mcp__claude-flow__agent_spawn({ type: "coder" })
mcp__claude-flow__agent_spawn({ type: "tester" })
mcp__claude-flow__agent_spawn({ type: "reviewer" })
```

**What Happens**:
- Creates swarm coordination state in `.hive-mind/sessions/`
- Defines agent types and capabilities
- Sets up communication topology
- Initializes shared memory namespace

**Output**: Coordination infrastructure ready

**Note**: This step is optional. For simple tasks, skip directly to Task tool.

---

### Stage 3: Agent Spawning (Claude Code Task Tool)

**Input**: List of agents to spawn

**Task Tool Execution** (all in parallel):
```javascript
Task("Research agent", "Analyze JWT best practices. Save findings to sessions/$SESSION_ID/artifacts/docs/", "researcher")
Task("Coder agent", "Implement JWT auth middleware. Save to sessions/$SESSION_ID/artifacts/code/", "coder")
Task("Tester agent", "Write auth tests. Save to sessions/$SESSION_ID/artifacts/tests/", "tester")
Task("Reviewer agent", "Review security. Save report to sessions/$SESSION_ID/artifacts/docs/", "reviewer")
```

**What Happens**:
1. Claude Code spawns 4 subprocess agents **simultaneously**
2. Each agent receives:
   - Full project context
   - Session ID for artifact paths
   - Access to MCP tools
   - Shared memory namespace
3. Agents start work in parallel (10-20x faster than sequential)

**Performance**:
- **Sequential**: 4 agents × 30 seconds = 2 minutes
- **Parallel**: 30 seconds total (**4x speedup**)

**Output**: 4 agents running concurrently

---

### Stage 4: Agent Execution (Parallel Work)

**Input**: Each agent has its instructions

#### Research Agent Flow

```
1. Fire pre-task hook:
   npx claude-flow@alpha hooks pre-task --description "JWT research" --task-id "research-1"

2. Check memory for existing patterns:
   mcp__claude-flow__memory_usage({
     action: "retrieve",
     key: "auth/jwt-patterns",
     namespace: "default"
   })

3. Research JWT best practices:
   • WebSearch for latest security advisories
   • Read OAuth 2.0 specs
   • Analyze token expiration strategies

4. Store findings in memory:
   mcp__claude-flow__memory_usage({
     action: "store",
     key: "auth/jwt-patterns",
     value: JSON.stringify({
       recommended: "RS256",
       expiration: "15min access, 7d refresh",
       storage: "httpOnly cookies"
     }),
     namespace: "default"
   })

5. Write documentation:
   Write("sessions/session-ID/artifacts/docs/jwt-analysis.md")

6. Fire post-task hook:
   npx claude-flow@alpha hooks post-task --task-id "research-1" --status "completed"
```

#### Coder Agent Flow (runs simultaneously)

```
1. Fire pre-task hook
2. Retrieve research findings:
   mcp__claude-flow__memory_usage({
     action: "retrieve",
     key: "auth/jwt-patterns",
     namespace: "default"
   })
   → Gets "RS256, 15min expiration, httpOnly cookies"

3. Implement JWT middleware:
   Write("sessions/session-ID/artifacts/code/auth-middleware.js")

4. Store implementation notes:
   mcp__claude-flow__memory_usage({
     action: "store",
     key: "auth/implementation-notes",
     value: "Used jsonwebtoken@9.0.0, RS256 signing",
     namespace: "default"
   })

5. Fire post-task hook
```

#### Tester Agent Flow (runs simultaneously)

```
1. Fire pre-task hook
2. Retrieve implementation notes from memory
3. Write tests:
   Write("sessions/session-ID/artifacts/tests/auth.test.js")
4. Run tests to verify coverage
5. Store test results in memory
6. Fire post-task hook
```

#### Reviewer Agent Flow (runs simultaneously)

```
1. Fire pre-task hook
2. Read code from session artifacts
3. Read tests from session artifacts
4. Security audit (OWASP Top 10 check)
5. Write review report:
   Write("sessions/session-ID/artifacts/docs/security-review.md")
6. Fire post-task hook
```

**Key Observations**:
- Agents read from **shared memory** (coordination)
- Agents write to **session artifacts** (isolation)
- Hooks fire automatically (automation)
- No direct agent-to-agent communication (race-free)

---

### Stage 5: Memory Database Updates

**Input**: Store/retrieve operations from agents

**Data Structure** (`.swarm/memory.db`):
```sql
CREATE TABLE memory (
  namespace TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  ttl INTEGER,
  created_at INTEGER,
  updated_at INTEGER,
  PRIMARY KEY (namespace, key)
);
```

**Example Entries After Agent Work**:
```json
[
  {
    "namespace": "default",
    "key": "auth/jwt-patterns",
    "value": "{\"recommended\":\"RS256\",\"expiration\":\"15min\"}",
    "created_at": 1700000001
  },
  {
    "namespace": "default",
    "key": "auth/implementation-notes",
    "value": "Used jsonwebtoken@9.0.0, RS256 signing",
    "created_at": 1700000002
  },
  {
    "namespace": "default",
    "key": "auth/test-results",
    "value": "{\"coverage\":92,\"passing\":true}",
    "created_at": 1700000003
  }
]
```

**Access Pattern**:
- **Concurrent Reads**: Multiple agents can read simultaneously (WAL mode)
- **Serialized Writes**: SQLite handles write ordering automatically
- **Namespace Isolation**: Different sessions use different namespaces

---

### Stage 6: Hooks Auto-Fire (Post-Operation)

**Input**: File write operations from agents

**Hook Configuration** (`.claude/settings.json`):
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

**What Happens After Each File Write**:

```
Agent writes: sessions/session-ID/artifacts/code/auth-middleware.js
       ↓
Hook triggers: npx claude-flow@alpha hooks post-edit --file "auth-middleware.js"
       ↓
Hook actions:
  1. Update Captain's Log (decision journal)
  2. Store file metadata in memory
  3. Increment operation counter
  4. Timestamp last edit
```

**Captain's Log Entry Created**:
```markdown
## [14:23] Implemented JWT Authentication Middleware

**Context:** Building REST API with secure authentication.

**Decision:** RS256 algorithm with 15-minute access tokens.

**Reasoning:** Research agent recommended RS256 over HS256 for better security.

**Tradeoffs:** Increased complexity (public/private key pair) for better security.
```

---

### Stage 7: Result Aggregation

**Input**: All agents complete their tasks

**Claude Code Synthesis**:
1. Collect results from all agents
2. Read memory entries for cross-agent context
3. Read session artifacts for file outputs
4. Generate unified summary

**Output to User**:
```
✅ JWT Authentication Implementation Complete

**Components Created:**
- Research: JWT security analysis (docs/jwt-analysis.md)
- Code: Auth middleware (code/auth-middleware.js)
- Tests: Comprehensive test suite (tests/auth.test.js)
- Review: Security audit report (docs/security-review.md)

**Key Decisions:**
- Algorithm: RS256 (asymmetric signing)
- Expiration: 15min access, 7d refresh
- Storage: httpOnly cookies for XSS protection

**Test Results:**
- Coverage: 92%
- Passing: All tests green
- Security: OWASP Top 10 compliant
```

---

### Stage 8: Session Closeout (Optional)

**Input**: User runs `/session-closeout`

**Workflow**:
```
1. Generate session summary:
   npx claude-flow@alpha hooks session-end --export-metrics true

2. Extract decisions from summary

3. Append to Captain's Log:
   sessions/captains-log/2025-11-17.md

4. Create backup snapshot:
   .swarm/backups/session-20251117-100232.json

5. Export metrics:
   {
     "agents_spawned": 4,
     "files_created": 4,
     "memory_entries": 3,
     "duration_seconds": 180
   }

6. User approval (HITL):
   "Archive this session? [Y/n]"

7. Archive and cleanup
```

---

## Data Transformation Summary

| Stage | Input Format | Output Format | Storage |
|-------|--------------|---------------|---------|
| 1. User Input | Natural language | Execution plan | In-memory |
| 2. MCP Setup | Execution plan | Coordination state | `.hive-mind/sessions/` |
| 3. Agent Spawn | Agent instructions | Running processes | OS subprocesses |
| 4. Agent Work | Task context | Files + memory | `artifacts/` + `.swarm/memory.db` |
| 5. Memory Ops | Key-value pairs | SQLite rows | `.swarm/memory.db` |
| 6. Hooks | File operations | Journal entries | `captains-log/` |
| 7. Aggregation | Partial results | Unified summary | In-memory |
| 8. Closeout | Session data | Backup snapshot | `.swarm/backups/` |

---

## Data Flow Patterns

### Pattern 1: Fan-Out/Fan-In (Parallel Execution)

```
User Request
     ↓
Task Tool (spawn 4 agents)
     ↓
   ┌─┴─┬─────┬─────┐
   ↓   ↓     ↓     ↓
  R    C     T     R  (agents run simultaneously)
  e    o     e     e
  s    d     s     v
  e    e     t     i
  a    r           e
  r                w
  c
  h
   ↓   ↓     ↓     ↓
   └─┬─┴─────┴─────┘
     ↓
Aggregate Results
```

**Speedup**: 10-20x for agent spawning, 2.8-4.4x overall workflow

### Pattern 2: Shared State via Memory

```
Agent A         Agent B         Agent C
   ↓               ↓               ↓
   └───────→ .swarm/memory.db ←───┘
          (shared coordination)
```

**Benefit**: No race conditions, scales to N agents

### Pattern 3: Cascading Hooks

```
File Write
    ↓
PostToolUse Hook
    ↓
npx claude-flow@alpha hooks post-edit
    ↓
    ├→ Update Captain's Log
    ├→ Store in memory
    └→ Track metrics
```

**Benefit**: Automatic journaling and coordination

---

## Performance Characteristics

### Latency Breakdown (Typical 4-Agent Task)

| Stage | Sequential | Parallel | Speedup |
|-------|------------|----------|---------|
| Agent Spawn | 120s (4×30s) | 30s | **4x** |
| Agent Execution | 180s (4×45s) | 60s | **3x** |
| Memory Ops | 4s | 4s | 1x |
| Hooks | 8s (4×2s) | 2s | **4x** |
| **Total** | **312s** | **96s** | **3.25x** |

### Throughput Metrics

- **Memory Writes**: 1000 ops/sec (SQLite WAL mode)
- **File Writes**: Limited by disk I/O (~100 MB/s SSD)
- **Agent Spawning**: 10-20x faster with parallel Task tool
- **Memory Reads**: Unlimited concurrent (SQLite read locks)

---

## Data Integrity Guarantees

### What Is Guaranteed

✅ **Memory consistency**: SQLite ACID guarantees
✅ **File atomicity**: OS-level file system guarantees
✅ **Hook ordering**: Sequential execution per operation
✅ **Session isolation**: Separate artifact directories

### What Is NOT Guaranteed

❌ **Agent completion order**: Parallel agents finish unpredictably
❌ **Real-time coordination**: Memory updates are asynchronous
❌ **Cross-session isolation**: Namespaces prevent conflicts but agents can read any namespace

---

## Debugging Data Flow

### How to Trace Data

1. **Check memory database**:
   ```bash
   npx claude-flow@alpha hooks memory --action list --namespace default
   ```

2. **Read Captain's Log**:
   ```bash
   cat sessions/captains-log/$(date +%Y-%m-%d).md
   ```

3. **Inspect session artifacts**:
   ```bash
   ls -R sessions/session-ID/artifacts/
   ```

4. **View session backups**:
   ```bash
   cat .swarm/backups/session-ID.json
   ```

### Common Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Agent can't find data | Wrong namespace | Check `namespace` parameter |
| Memory entry missing | TTL expired | Increase TTL or refresh entry |
| File not in artifacts | Agent saved to wrong path | Check session ID in agent instructions |
| Hooks not firing | Configuration error | Check `.claude/settings.json` |

---

## Summary

**Data flows through 8 stages**, from user input to archived session:

1. **Parse** → Intent extraction
2. **Coordinate** → MCP topology setup
3. **Spawn** → Parallel agent creation
4. **Execute** → Agents work simultaneously
5. **Store** → Memory database updates
6. **Journal** → Hooks record operations
7. **Aggregate** → Results synthesized
8. **Archive** → Session backed up

**Key Insights**:
- **Memory is the coordination layer** (not direct agent communication)
- **Parallel execution is the default** (10-20x speedup)
- **Hooks automate journaling** (no manual tracking)
- **98% stock claude-flow** (no custom data pipelines)

**Next Steps**:
- [Coordination Mechanics](coordination-mechanics.md) - How agents collaborate
- [Memory Architecture](memory-architecture.md) - Deep dive into `.swarm/memory.db`
- [Session Lifecycle](session-lifecycle.md) - Full session walkthrough
