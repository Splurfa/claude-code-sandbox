# Performance Tuning Guide

**Last Updated**: 2025-11-18
**Status**: ✅ Verified practices, ⚠️ Performance claims need validation
**Audience**: Advanced users optimizing multi-agent workflows

---

## Overview

This guide documents performance optimization strategies for claude-flow+ workspaces. All techniques are based on workspace architecture and concurrent execution patterns documented in CLAUDE.md.

**Performance Philosophy**:
- Parallel > Sequential (always)
- Batch operations in single messages
- Use appropriate coordination topology
- Minimize round-trip communication

---

## 1. Concurrent Execution (VERIFIED)

### The Golden Rule

**✅ VERIFIED PRACTICE**: "1 MESSAGE = ALL RELATED OPERATIONS"

```javascript
// ✅ CORRECT: All operations batched in single message
[Single Message]:
  Task("Research agent", "Analyze requirements...", "researcher")
  Task("Coder agent", "Implement features...", "coder")
  Task("Tester agent", "Write tests...", "tester")

  TodoWrite({ todos: [
    {content: "Research patterns", status: "in_progress"},
    {content: "Implement core", status: "pending"},
    {content: "Write tests", status: "pending"},
    {content: "Review code", status: "pending"}
  ]})

  Write("sessions/$SESSION_ID/artifacts/code/server.js", content1)
  Write("sessions/$SESSION_ID/artifacts/tests/server.test.js", content2)
  Bash("npm test")

// ❌ WRONG: Multiple messages (serialized execution)
Message 1: Task("Research agent", ...)
Message 2: Task("Coder agent", ...)
Message 3: TodoWrite(...)
// This destroys parallelization!
```

**Why This Works**:
- Claude Code executes parallel Task() calls concurrently
- Single message = single coordination context
- Reduces context switches
- Eliminates message round-trip overhead

**Measured Impact**: ⚠️ Needs verification (claimed 2.8-4.4x speedup)

---

## 2. Batch Operations (VERIFIED)

### TodoWrite Batching

**✅ VERIFIED PRACTICE**: Always batch 5-10+ todos in ONE call

```javascript
// ✅ CORRECT: Single TodoWrite with all tasks
TodoWrite({ todos: [
  {content: "Analyze requirements", status: "in_progress", priority: "high"},
  {content: "Design architecture", status: "pending", priority: "high"},
  {content: "Implement core", status: "pending", priority: "high"},
  {content: "Write tests", status: "pending", priority: "medium"},
  {content: "Document API", status: "pending", priority: "low"}
]})

// ❌ WRONG: Multiple TodoWrite calls
TodoWrite({ todos: [{content: "task1", status: "pending"}] })
TodoWrite({ todos: [{content: "task2", status: "pending"}] })
```

**Why This Works**:
- Single tool call overhead vs multiple
- Atomic state updates
- Better coordination tracking

### File Operations Batching

**✅ VERIFIED PRACTICE**: Batch all Read/Write/Edit operations

```javascript
// ✅ CORRECT: All file operations together
[Single Message]:
  Read("/path/to/config.json")
  Read("/path/to/schema.sql")
  Write("sessions/$SESSION_ID/artifacts/code/server.js", serverCode)
  Write("sessions/$SESSION_ID/artifacts/tests/server.test.js", testCode)
  Edit("/path/to/package.json", oldDep, newDep)

// ❌ WRONG: Serialized file operations
Message 1: Read(...)
Message 2: Write(...)
Message 3: Edit(...)
```

### Bash Command Batching

**✅ VERIFIED PRACTICE**: Chain related commands with `&&`

```bash
# ✅ CORRECT: Chained in single Bash call
mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs} && \
  npm install && \
  npm test && \
  git add sessions/$SESSION_ID/artifacts/

# ❌ WRONG: Multiple Bash calls
Bash("mkdir -p sessions/$SESSION_ID/artifacts/code")
Bash("npm install")
Bash("npm test")
```

---

## 3. Agent Spawning Optimization (VERIFIED)

### Parallel Agent Spawning

**✅ VERIFIED PRACTICE**: Use Claude Code's Task tool for concurrent execution

```javascript
// ✅ CORRECT: All agents spawned in parallel
[Single Message]:
  Task("Backend Dev", "Build API. Save to sessions/$SESSION_ID/artifacts/code/.", "backend-dev")
  Task("Frontend Dev", "Build UI. Save to sessions/$SESSION_ID/artifacts/code/.", "coder")
  Task("Database Architect", "Design schema. Save to sessions/$SESSION_ID/artifacts/code/.", "code-analyzer")
  Task("Test Engineer", "Write tests. Save to sessions/$SESSION_ID/artifacts/tests/.", "tester")
  Task("DevOps", "Setup CI/CD. Save to sessions/$SESSION_ID/artifacts/scripts/.", "cicd-engineer")

// All agents execute concurrently
```

**Coordination Setup (Optional)**:

```javascript
// For complex coordination, set up topology first
[Message 1 - Coordination]:
  mcp__claude-flow__swarm_init({ topology: "mesh", maxAgents: 6 })
  mcp__claude-flow__agent_spawn({ type: "researcher" })
  mcp__claude-flow__agent_spawn({ type: "coder" })

// Then spawn actual work agents
[Message 2 - Execution]:
  Task("Research Agent", "Analyze...", "researcher")
  Task("Coder Agent", "Implement...", "coder")
```

**Measured Impact**: ⚠️ Needs verification (claimed 10-20x faster than sequential)

---

## 4. Memory Operations Optimization (VERIFIED)

### Batch Memory Calls

**✅ VERIFIED PRACTICE**: Use MCP tools for memory, not hooks

```javascript
// ✅ CORRECT: MCP tool for memory operations
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "api-design",
  value: JSON.stringify({endpoints: [...]}),
  namespace: "default"
})

// Retrieve in batches
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "default"
})

// ❌ WRONG: Hooks commands for memory
Bash("npx claude-flow@alpha hooks memory-store ...")  // Not a thing!
```

### Memory Namespacing

**✅ VERIFIED PRACTICE**: Use namespaces for isolation

```javascript
// Store by workflow phase
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "requirements",
  value: data,
  namespace: "specification"
})

mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "architecture",
  value: data,
  namespace: "design"
})

// Search within namespace
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "endpoint%",
  namespace: "specification"
})
```

---

## 5. Topology Selection (VERIFIED)

### Choosing the Right Topology

**✅ VERIFIED ARCHITECTURES**:

| Topology | Best For | Coordination Overhead | Scale |
|----------|----------|----------------------|-------|
| **Mesh** | Peer collaboration, equal agents | Low | 2-8 agents |
| **Hierarchical** | Clear task delegation | Medium | 5-20 agents |
| **Star** | Single coordinator | Low | 3-10 agents |
| **Ring** | Sequential workflows | High | 3-6 agents |

```javascript
// Mesh: For collaborative research/design
mcp__claude-flow__swarm_init({
  topology: "mesh",
  maxAgents: 6,
  strategy: "balanced"
})

// Hierarchical: For complex multi-layer systems
mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 12,
  strategy: "specialized"
})

// Star: For simple coordination
mcp__claude-flow__swarm_init({
  topology: "star",
  maxAgents: 5,
  strategy: "balanced"
})
```

**Measured Impact**: ⚠️ Topology performance comparison needs verification

---

## 6. Token Optimization (PARTIALLY VERIFIED)

### Minimize Agent Instructions

**✅ VERIFIED PRACTICE**: Clear, concise task descriptions

```javascript
// ✅ GOOD: Concise with session path
Task("API Dev", "Build REST endpoints. Save to sessions/$SESSION_ID/artifacts/code/.", "backend-dev")

// ❌ VERBOSE: Unnecessary detail
Task("API Developer", "You are an experienced backend developer. Please build a comprehensive REST API with proper authentication, error handling, logging, and documentation. Make sure to follow best practices and save all files to the session artifacts directory at sessions/$SESSION_ID/artifacts/code/. Also coordinate with other agents via memory.", "backend-dev")
```

### Reuse Memory Instead of Repeating

**✅ VERIFIED PRACTICE**: Store once, reference many times

```javascript
// Store design decisions once
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "api-schema",
  value: JSON.stringify(schema),
  namespace: "design"
})

// Agents reference from memory (saves tokens)
Task("Backend Dev", "Implement API from schema in memory. Save to sessions/$SESSION_ID/artifacts/code/.", "backend-dev")
Task("Test Engineer", "Test API per schema in memory. Save to sessions/$SESSION_ID/artifacts/tests/.", "tester")
Task("Doc Writer", "Document API from schema in memory. Save to sessions/$SESSION_ID/artifacts/docs/.", "api-docs")
```

**Measured Impact**: ⚠️ Token reduction claims (32.3%) need verification

---

## 7. Session Management Optimization (VERIFIED)

### Session Artifact Organization

**✅ VERIFIED PRACTICE**: Proper file routing to session artifacts

```bash
# ✅ CORRECT: All work goes to session artifacts
sessions/$SESSION_ID/artifacts/
├── code/          # Source code
├── tests/         # Test files
├── docs/          # Documentation
├── scripts/       # Automation scripts
└── notes/         # Planning notes

# ❌ WRONG: Writing to root directories
tests/             # Never write here!
docs/              # Never write here!
scripts/           # Never write here!
```

**Why This Works**:
- Clean separation of session work
- Easy archival/cleanup
- No workspace pollution
- Clear project vs session boundaries

### Hooks Integration

**✅ VERIFIED PRACTICE**: Auto-firing hooks via `.claude/settings.json`

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks pre-edit --file '{}'"
        }]
      }
    ],
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

**Hook Performance**: ⚠️ Overhead measurement needs verification

---

## 8. Benchmarking Techniques (VERIFIED)

### Measure Real Performance

**✅ VERIFIED METRICS STRUCTURE** (from session data):

```json
{
  "startTime": 1763324224724,
  "sessionDuration": 0,
  "totalTasks": 1,
  "successfulTasks": 1,
  "failedTasks": 0,
  "totalAgents": 0,
  "activeAgents": 0,
  "operations": {
    "store": {
      "count": 0,
      "totalDuration": 0,
      "errors": 0
    }
  },
  "performance": {
    "avgOperationDuration": 0,
    "minOperationDuration": null,
    "maxOperationDuration": null
  }
}
```

**Location**: `.swarm/backups/session-*.json` and `.claude-flow/metrics/`

### Manual Benchmarking

```bash
# Time agent execution
time Task("Agent", "Task...", "type")

# Compare sequential vs parallel
# Sequential (3 agents)
time npx claude-flow@alpha ... (agent1)
time npx claude-flow@alpha ... (agent2)
time npx claude-flow@alpha ... (agent3)

# Parallel (all agents)
time [Single Message with all 3 Task() calls]
```

**Real Benchmarks**: ⚠️ Workspace-specific benchmarks need to be run

---

## 9. Common Performance Pitfalls (VERIFIED)

### Antipattern: Sequential Agent Spawning

```javascript
// ❌ SLOW: Sequential spawning
Message 1: Task("agent1", ...)
[Wait for completion]
Message 2: Task("agent2", ...)
[Wait for completion]
Message 3: Task("agent3", ...)

// Time: 3x agent execution time
```

### Antipattern: Single Todo Writes

```javascript
// ❌ SLOW: Multiple TodoWrite calls
TodoWrite({ todos: [{content: "task1"}] })
TodoWrite({ todos: [{content: "task2"}] })
TodoWrite({ todos: [{content: "task3"}] })

// Creates 3 tool call overheads
```

### Antipattern: Repeated Memory Fetches

```javascript
// ❌ SLOW: Fetch same data multiple times
mcp__claude-flow_alpha__memory_usage({ action: "retrieve", key: "schema" })
[Use schema]
mcp__claude-flow_alpha__memory_usage({ action: "retrieve", key: "schema" })
[Use schema again]

// ✅ FAST: Fetch once, reuse
const schema = mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "schema"
})
[Use schema multiple times]
```

---

## 10. Performance Checklist

### Before Starting Work

- [ ] Plan all file operations for batching
- [ ] Identify all agents needed (spawn together)
- [ ] Choose appropriate topology for task
- [ ] Organize session artifact structure
- [ ] Prepare memory namespaces

### During Execution

- [ ] Batch all related operations in single messages
- [ ] Use Task() tool for parallel agent spawning
- [ ] Store shared data in memory (avoid repetition)
- [ ] Chain bash commands with `&&`
- [ ] Route all files to session artifacts

### After Completion

- [ ] Review `.claude-flow/metrics/` for bottlenecks
- [ ] Check session backups for timing data
- [ ] Identify serialization points
- [ ] Document optimization opportunities

---

## 11. Optimization Examples

### Example 1: Full-Stack Development (VERIFIED PATTERN)

```javascript
// ✅ OPTIMIZED: All agents + operations in parallel
[Single Message]:
  // Topology setup (optional for complex coordination)
  mcp__claude-flow__swarm_init({ topology: "mesh", maxAgents: 6 })

  // Spawn all agents concurrently
  Task("Backend Dev", "Build REST API. Save to sessions/$SESSION_ID/artifacts/code/.", "backend-dev")
  Task("Frontend Dev", "Build React UI. Save to sessions/$SESSION_ID/artifacts/code/.", "coder")
  Task("DB Architect", "Design PostgreSQL schema. Save to sessions/$SESSION_ID/artifacts/code/.", "code-analyzer")
  Task("Test Engineer", "Write Jest tests. Save to sessions/$SESSION_ID/artifacts/tests/.", "tester")
  Task("DevOps", "Setup Docker + CI/CD. Save to sessions/$SESSION_ID/artifacts/scripts/.", "cicd-engineer")
  Task("Docs Writer", "API documentation. Save to sessions/$SESSION_ID/artifacts/docs/.", "api-docs")

  // Batch all todos
  TodoWrite({ todos: [
    {content: "Design API endpoints", status: "in_progress", priority: "high"},
    {content: "Build React components", status: "in_progress", priority: "high"},
    {content: "Create database schema", status: "in_progress", priority: "high"},
    {content: "Write integration tests", status: "pending", priority: "medium"},
    {content: "Setup CI/CD pipeline", status: "pending", priority: "medium"},
    {content: "Document API", status: "pending", priority: "low"}
  ]})

  // Prepare session structure
  Bash("mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts}")
```

**Result**: 6 agents working in parallel vs sequential execution

---

## 12. Performance Claims Status

### ✅ Verified Practices

- Concurrent execution via single-message batching
- Task() tool for parallel agent spawning
- File operation batching
- Bash command chaining
- Memory operations via MCP tools
- Session artifact organization
- Hooks auto-firing via Claude Code native system

### ⚠️ Needs Verification

- **84.8% SWE-Bench solve rate** - No local benchmark data
- **32.3% token reduction** - No measurement methodology documented
- **2.8-4.4x speed improvement** - No workspace-specific benchmarks
- **10-20x faster parallel spawning** - No timing comparisons run
- Topology-specific performance differences - No comparative data
- Hook overhead measurement - No metrics available
- Neural model performance (27+ models) - Not tested locally

**Recommendation**: Run benchmarks for workspace-specific claims before documenting as verified.

---

## 13. Next Steps

### Run Your Own Benchmarks

1. **Baseline Measurement**:
   ```bash
   time Task("Single agent", "Simple task", "coder")
   ```

2. **Parallel Comparison**:
   ```bash
   time [3 Task() calls in single message]
   ```

3. **Sequential Comparison**:
   ```bash
   time Task("Agent 1", ...)
   time Task("Agent 2", ...)
   time Task("Agent 3", ...)
   ```

4. **Document Results**:
   Save to `sessions/$SESSION_ID/artifacts/docs/benchmarks.md`

### Profile Memory Operations

```bash
# Check metrics
cat .claude-flow/metrics/performance.json

# Analyze operation timing
jq '.operations[] | select(.count > 0) | {operation: .operation, avgTime: (.totalDuration / .count)}' \
  .claude-flow/metrics/performance.json
```

### Monitor Session Performance

```bash
# Session timing
jq '{sessionDuration, totalTasks, successfulTasks, failedTasks}' \
  .swarm/backups/session-$(date +%Y%m%d)-*.json
```

---

## 14. Additional Resources

- **CLAUDE.md**: Concurrent execution protocol and rules (see workspace root)
- **Session Management**: [Session Management Essentials](../essentials/session-management.md)
- **Architecture**: [Architecture Guide](../reality/architecture.md)
- **File Routing**: See CLAUDE.md "SESSION MANAGEMENT PROTOCOL" section in workspace root

---

## Summary

**Core Principles**:
1. ⚡ **Parallel > Sequential** - Always batch operations
2. 📦 **Single Message = All Operations** - Golden rule
3. 🎯 **Appropriate Topology** - Match coordination to task
4. 💾 **Memory Optimization** - Store once, reference many
5. 📁 **Session Organization** - Clean artifact routing
6. 📊 **Measure Everything** - Verify claims with data

**Performance gains are achieved through**:
- Architectural patterns (verified)
- Concurrent execution (verified)
- Proper tool usage (verified)
- Session management (verified)

**Claims requiring verification**:
- Specific speedup percentages
- Token reduction amounts
- Benchmark comparisons
- Neural model performance

---

**Status Legend**:
- ✅ **Verified**: Practice confirmed working in this workspace
- ⚠️ **Needs Verification**: Claim requires local benchmarking
- 🔮 **Planned**: Future optimization opportunity

**Last Updated**: 2025-11-18
**Source**: CLAUDE.md + Session Analysis + Synthesis Recommendation
**Verification Level**: Practices verified, performance numbers need benchmarking
