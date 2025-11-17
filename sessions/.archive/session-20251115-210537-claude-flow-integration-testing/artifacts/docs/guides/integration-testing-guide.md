# Claude Flow Integration Testing Guide

**Version**: 1.0.0
**Last Updated**: 2025-11-16
**Session**: session-20251115-210537-claude-flow-integration-testing

## Overview

This guide documents how to test and verify all claude-flow integrations in your workspace. It includes step-by-step procedures, expected results, and troubleshooting tips.

---

## Table of Contents

1. [MCP Server Connection Testing](#mcp-server-connection-testing)
2. [Hook System Verification](#hook-system-verification)
3. [Memory Operations Testing](#memory-operations-testing)
4. [Agent Spawning Validation](#agent-spawning-validation)
5. [Session Management Verification](#session-management-verification)
6. [Concurrent Execution Testing](#concurrent-execution-testing)

---

## MCP Server Connection Testing

### Prerequisites

Ensure MCP servers are configured in Claude Code:

```bash
claude mcp add claude-flow npx claude-flow@alpha mcp start
claude mcp add ruv-swarm npx ruv-swarm mcp start
claude mcp add flow-nexus npx flow-nexus@latest mcp start
```

### Test 1: Claude Flow Alpha Connection

**Test Command:**
```bash
npx claude-flow@alpha hooks pre-task --description "Test" --task-id "test-1"
```

**Expected Output:**
```
🔄 Executing pre-task hook...
📋 Task: Test
🆔 Task ID: test-1
  💾 Saved to .swarm/memory.db
🎯 TASK PREPARATION COMPLETE
```

**Status Indicators:**
- ✅ Hook executes without errors
- ✅ Memory database path shown
- ✅ Success message displayed

---

### Test 2: RUV Swarm Initialization

**MCP Tool Call:**
```javascript
mcp__ruv-swarm__swarm_init({
  topology: "mesh",
  maxAgents: 5,
  strategy: "balanced"
})
```

**Expected Response:**
```json
{
  "id": "swarm-[timestamp]",
  "message": "Successfully initialized mesh swarm with 5 max agents",
  "topology": "mesh",
  "strategy": "balanced",
  "maxAgents": 5,
  "features": {
    "cognitive_diversity": true,
    "neural_networks": true,
    "simd_support": true
  }
}
```

**Common Issue:**
- ❌ Error: "Cannot read properties of null"
- **Solution**: Initialize swarm first before calling status

---

### Test 3: Flow Nexus System Health

**MCP Tool Call:**
```javascript
mcp__flow-nexus__system_health()
```

**Expected Response:**
```json
{
  "success": true,
  "health": {
    "database": "healthy",
    "version": "2.0.0"
  }
}
```

---

## Hook System Verification

### Available Hooks

Claude Flow provides these hooks (NO separate `memory` command):

**Pre-Operation Hooks:**
- `pre-task` - Execute before starting a task
- `pre-edit` - Validate before file modifications
- `pre-command` (alias: `pre-bash`) - Check command safety

**Post-Operation Hooks:**
- `post-task` - Execute after completing a task
- `post-edit` - Auto-format and log edits
- `post-command` (alias: `post-bash`) - Log command execution

**Session Hooks:**
- `session-end` - Generate summary and save state
- `session-restore` - Load previous session state
- `notify` - Custom notifications

**Modification Hooks (v2.0.10+):**
- `modify-bash` - Modify Bash tool inputs
- `modify-file` - Modify Write/Edit tool inputs
- `modify-git-commit` - Modify git commit messages

### Test Script: Hook System

Run the test script:

```bash
bash sessions/[SESSION_ID]/artifacts/scripts/test-hooks.sh
```

**Expected Results:**

1. **Pre-Task Hook** ✅
   - Task logged to memory
   - Task ID tracked
   - Preparation complete

2. **Post-Task Hook** ✅
   - Performance metrics recorded
   - Task completion saved
   - Success confirmation

3. **Pre-Edit Hook** ✅
   - Agent recommendations provided
   - Context loaded
   - State saved to memory

4. **Post-Edit Hook** ✅
   - Edit context stored in memory
   - Neural patterns trained
   - Memory updated

5. **Pre-Command Hook** ✅
   - Safety validation performed
   - Command logged
   - Safety check passed

6. **Post-Command Hook** ✅
   - Metrics tracked
   - Results stored
   - Execution logged

7. **Notify Hook** ✅
   - Notification saved to memory
   - Success level confirmed
   - Swarm status included

---

## Memory Operations Testing

### Important: Memory via MCP Tools

**❌ INCORRECT** (No separate memory command):
```bash
npx claude-flow@alpha hooks memory --action store --key "test" --value "data"
```

**✅ CORRECT** (Use MCP tool):
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "test/key",
  value: "test data",
  namespace: "testing"
})
```

### Memory Operations

#### 1. Store Data

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "session/status",
  value: "Active session in progress",
  namespace: "testing",
  ttl: 3600  // Optional: seconds
})
```

**Expected Response:**
```json
{
  "success": true,
  "action": "store",
  "key": "session/status",
  "namespace": "testing",
  "stored": true,
  "size": 26,
  "storage_type": "sqlite"
}
```

#### 2. Retrieve Data

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "session/status",
  namespace: "testing"
})
```

#### 3. List Entries

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "testing"
})
```

**Expected Response:**
```json
{
  "success": true,
  "action": "list",
  "namespace": "testing",
  "entries": [
    {
      "key": "session/status",
      "value": "Active session in progress",
      "namespace": "testing",
      "createdAt": "2025-11-16T05:06:44.000Z",
      "accessCount": 0
    }
  ],
  "count": 1
}
```

#### 4. Search Patterns

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "session/%",
  namespace: "testing"
})
```

---

## Agent Spawning Validation

### Correct Pattern: Task Tool vs MCP

**✅ CORRECT WORKFLOW:**

1. **Optional**: MCP sets up coordination topology
   ```javascript
   mcp__claude-flow_alpha__swarm_init({
     topology: "mesh",
     maxAgents: 5
   })
   ```

2. **Required**: Claude Code Task tool spawns ACTUAL agents
   ```javascript
   // Single message with all agents
   Task("Research agent", "Analyze requirements...", "researcher")
   Task("Coder agent", "Implement features...", "coder")
   Task("Tester agent", "Write tests...", "tester")
   ```

**❌ WRONG**: Using only MCP tools
```javascript
// MCP tools are for COORDINATION, not execution
mcp__claude-flow_alpha__agent_spawn({ type: "coder" })  // Defines type only
```

### Test: Agent Spawning

**Test Code:**
```javascript
Task("Test agent", "Create test report in sessions/[SESSION]/artifacts/notes/", "researcher")
```

**Verification:**
- ✅ Agent spawns without errors
- ✅ Agent can access session directories
- ✅ Agent creates files in artifacts/
- ✅ Files saved to correct session path

---

## Session Management Verification

### Session Structure

**Correct Structure:**
```
sessions/session-YYYYMMDD-HHMMSS-<topic>/
├── metadata.json
├── session-summary.md
└── artifacts/
    ├── code/       ← Source code
    ├── tests/      ← Test files
    ├── docs/       ← Documentation
    ├── scripts/    ← Automation
    └── notes/      ← Findings
```

### Critical Rules

1. **ONE SESSION = ONE CHAT THREAD** (not per task)
2. **ALL work** → `sessions/$SESSION_ID/artifacts/`
3. **NEVER** write to root `tests/`, `docs/`, `scripts/`

### Test: File Organization

**Test Files Created:**
```bash
sessions/session-20251115-210537-claude-flow-integration-testing/artifacts/
├── code/
│   ├── integration-test.js ✅
│   ├── agent-test.js ✅
│   └── test-file.js ✅
├── scripts/
│   ├── test-mcp-connections.sh ✅
│   └── test-hooks.sh ✅
├── docs/guides/
│   └── integration-testing-guide.md ✅
└── notes/
    └── agent-spawn-test.md ✅
```

**Verification:**
- ✅ All files in session artifacts
- ✅ No files in root directories
- ✅ Proper subdirectory organization
- ✅ Session isolation maintained

---

## Concurrent Execution Testing

### Golden Rule

**"1 MESSAGE = ALL RELATED OPERATIONS"**

### Test Patterns

#### ✅ CORRECT: Batch Operations

```javascript
// Single message with all operations
[Message 1]:
  Task("Agent 1", "Task 1...", "researcher")
  Task("Agent 2", "Task 2...", "coder")
  Task("Agent 3", "Task 3...", "tester")

  TodoWrite({ todos: [
    {content: "Task 1", status: "in_progress", activeForm: "..."},
    {content: "Task 2", status: "pending", activeForm: "..."},
    {content: "Task 3", status: "pending", activeForm: "..."},
    // ... 5-10+ todos
  ]})

  Write("sessions/[SESSION]/artifacts/code/file1.js", "...")
  Write("sessions/[SESSION]/artifacts/code/file2.js", "...")
  Write("sessions/[SESSION]/artifacts/tests/test1.js", "...")
```

#### ❌ WRONG: Sequential Messages

```javascript
Message 1: Task("Agent 1", ...)
Message 2: Task("Agent 2", ...)  // Should be in Message 1!
Message 3: TodoWrite({ todos: [single todo] })  // Should batch all todos!
Message 4: Write("file.js", ...)  // Should be in Message 1!
```

### Verification

**Test Execution:**
- ✅ All agents spawned in parallel
- ✅ All todos written in one call (10+ items)
- ✅ All files created in one operation
- ✅ Memory operations batched together

---

## Test Results Summary

### All Tests: PASSED ✅

| Component | Status | Notes |
|-----------|--------|-------|
| claude-flow@alpha | ✅ | Connected, hooks working |
| ruv-swarm | ✅ | Initialized successfully |
| flow-nexus | ✅ | System healthy, v2.0.0 |
| Hook System | ✅ | All 7 hook types verified |
| Memory Operations | ✅ | Store/retrieve/list/search working |
| Agent Spawning | ✅ | Task tool executing agents |
| Session Management | ✅ | File organization correct |
| Concurrent Execution | ✅ | Batching patterns verified |

---

## Next Steps

1. ✅ Run test scripts regularly to verify integrations
2. ✅ Use MCP `memory_usage` tool (NOT hooks memory)
3. ✅ Spawn agents with Task tool, not just MCP
4. ✅ Batch all operations in single messages
5. ✅ Keep work in session artifacts directories

---

## References

- **Test Scripts**: `sessions/[SESSION]/artifacts/scripts/`
- **Test Code**: `sessions/[SESSION]/artifacts/code/`
- **Hook Documentation**: `npx claude-flow@alpha hooks` (no args)
- **MCP Tools**: See CLAUDE.md for full tool reference
