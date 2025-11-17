# Claude Flow Feature Verification Checklist

**Version**: 1.0.0
**Last Updated**: 2025-11-16
**Purpose**: Quick reference for verifying all claude-flow features are working correctly

---

## Quick Verification

Run this checklist whenever you:
- Set up a new workspace
- Update claude-flow packages
- Suspect integration issues
- Onboard new team members

---

## 1. MCP Server Connections

### Claude Flow Alpha

- [ ] **Test Command Works**
  ```bash
  npx claude-flow@alpha hooks pre-task --description "Test" --task-id "test"
  ```
- [ ] **Output Shows Success**
  - ✅ No errors
  - ✅ "TASK PREPARATION COMPLETE" message
  - ✅ Memory path shown (`.swarm/memory.db`)

### RUV Swarm

- [ ] **Initialization Succeeds**
  ```javascript
  mcp__ruv-swarm__swarm_init({ topology: "mesh", maxAgents: 5 })
  ```
- [ ] **Response Contains**
  - ✅ Swarm ID
  - ✅ Topology confirmed
  - ✅ Features listed
  - ✅ Performance metrics

- [ ] **Status Check Works**
  ```javascript
  mcp__ruv-swarm__swarm_status()
  ```

### Flow Nexus

- [ ] **Health Check Passes**
  ```javascript
  mcp__flow-nexus__system_health()
  ```
- [ ] **Response Shows**
  - ✅ `success: true`
  - ✅ `database: "healthy"`
  - ✅ Version number

---

## 2. Hook System

### Pre-Operation Hooks

- [ ] **pre-task Hook**
  ```bash
  npx claude-flow@alpha hooks pre-task --description "Test" --task-id "test-1"
  ```
  - ✅ Task logged
  - ✅ Memory saved
  - ✅ Preparation complete

- [ ] **pre-edit Hook**
  ```bash
  npx claude-flow@alpha hooks pre-edit --file "test.js" --auto-assign-agents true
  ```
  - ✅ Agent recommendation shown
  - ✅ Context loaded
  - ✅ State saved

- [ ] **pre-command Hook**
  ```bash
  npx claude-flow@alpha hooks pre-command --command "npm test" --validate-safety true
  ```
  - ✅ Safety validation performed
  - ✅ Command logged
  - ✅ Check passed

### Post-Operation Hooks

- [ ] **post-task Hook**
  ```bash
  npx claude-flow@alpha hooks post-task --task-id "test-1" --status "completed"
  ```
  - ✅ Metrics recorded
  - ✅ Completion saved
  - ✅ Success message

- [ ] **post-edit Hook**
  ```bash
  npx claude-flow@alpha hooks post-edit --file "test.js" --update-memory true
  ```
  - ✅ Memory updated
  - ✅ Context stored
  - ✅ Neural patterns trained (optional)

- [ ] **post-command Hook**
  ```bash
  npx claude-flow@alpha hooks post-command --command "test" --track-metrics true
  ```
  - ✅ Metrics tracked
  - ✅ Results stored
  - ✅ Execution logged

### Session Hooks

- [ ] **notify Hook**
  ```bash
  npx claude-flow@alpha hooks notify --message "Test" --level "success"
  ```
  - ✅ Notification displayed
  - ✅ Saved to memory
  - ✅ Swarm status shown

- [ ] **session-end Hook** (Test at end of session)
  ```bash
  npx claude-flow@alpha hooks session-end --generate-summary true --export-metrics true
  ```
  - ✅ Summary generated
  - ✅ Metrics exported
  - ✅ State persisted

---

## 3. Memory Operations

### Store Data

- [ ] **Basic Store**
  ```javascript
  mcp__claude-flow_alpha__memory_usage({
    action: "store",
    key: "test/key",
    value: "test value",
    namespace: "testing"
  })
  ```
  - ✅ `success: true`
  - ✅ `stored: true`
  - ✅ Size reported

### Retrieve Data

- [ ] **Basic Retrieve**
  ```javascript
  mcp__claude-flow_alpha__memory_usage({
    action: "retrieve",
    key: "test/key",
    namespace: "testing"
  })
  ```
  - ✅ Value returned
  - ✅ Metadata included

### List Entries

- [ ] **List by Namespace**
  ```javascript
  mcp__claude-flow_alpha__memory_usage({
    action: "list",
    namespace: "testing"
  })
  ```
  - ✅ Entries array returned
  - ✅ Count provided
  - ✅ Timestamps included

### Search Patterns

- [ ] **Pattern Search**
  ```javascript
  mcp__claude-flow_alpha__memory_usage({
    action: "search",
    pattern: "test/%",
    namespace: "testing"
  })
  ```
  - ✅ Matching entries found
  - ✅ Pattern applied correctly

---

## 4. Agent Spawning

### Task Tool Execution

- [ ] **Single Agent Spawn**
  ```javascript
  Task("Test agent", "Create test file in sessions/[SESSION]/artifacts/notes/test.md", "researcher")
  ```
  - ✅ Agent executes
  - ✅ File created
  - ✅ Correct location

- [ ] **Multiple Agents (Parallel)**
  ```javascript
  // In single message:
  Task("Agent 1", "Task 1...", "researcher")
  Task("Agent 2", "Task 2...", "coder")
  Task("Agent 3", "Task 3...", "tester")
  ```
  - ✅ All agents spawn
  - ✅ Parallel execution
  - ✅ Results from all

### MCP Coordination (Optional)

- [ ] **Swarm Initialization**
  ```javascript
  mcp__claude-flow_alpha__swarm_init({ topology: "mesh" })
  ```
  - ✅ Swarm created
  - ✅ Topology set

- [ ] **Agent Type Definition**
  ```javascript
  mcp__claude-flow_alpha__agent_spawn({ type: "researcher" })
  ```
  - ✅ Type registered
  - ✅ Capabilities noted

---

## 5. Session Management

### Session Creation

- [ ] **Directory Structure**
  ```
  sessions/session-YYYYMMDD-HHMMSS-<topic>/
  ├── metadata.json
  ├── session-summary.md
  └── artifacts/
      ├── code/
      ├── tests/
      ├── docs/
      ├── scripts/
      └── notes/
  ```
  - ✅ All directories created
  - ✅ metadata.json present
  - ✅ session-summary.md present

### File Organization

- [ ] **Artifact Subdirectories**
  - ✅ Code files → `artifacts/code/`
  - ✅ Tests → `artifacts/tests/`
  - ✅ Docs → `artifacts/docs/`
  - ✅ Scripts → `artifacts/scripts/`
  - ✅ Notes → `artifacts/notes/`

- [ ] **No Root Pollution**
  - ✅ No files in root `tests/`
  - ✅ No files in root `docs/`
  - ✅ No files in root `scripts/`

### Session Lifecycle

- [ ] **Hook Registration**
  ```bash
  npx claude-flow@alpha hooks pre-task --task-id "session-[ID]"
  ```
  - ✅ Session tracked

- [ ] **Session Closeout** (At end)
  ```bash
  npx claude-flow@alpha hooks session-end --generate-summary true
  ```
  - ✅ Summary generated
  - ✅ Backup created
  - ✅ Metrics exported

---

## 6. Concurrent Execution

### Batch Operations

- [ ] **TodoWrite Batching**
  ```javascript
  TodoWrite({ todos: [
    {content: "Task 1", status: "pending", activeForm: "..."},
    {content: "Task 2", status: "pending", activeForm: "..."},
    {content: "Task 3", status: "pending", activeForm: "..."},
    // ... 5-10+ todos
  ]})
  ```
  - ✅ All todos in one call
  - ✅ 5-10+ items minimum

- [ ] **Multi-Agent Spawning**
  ```javascript
  // Single message:
  Task("Agent 1", "...", "type1")
  Task("Agent 2", "...", "type2")
  Task("Agent 3", "...", "type3")
  ```
  - ✅ All in one message
  - ✅ Parallel execution

- [ ] **File Operations**
  ```javascript
  // Single message:
  Write("file1.js", "...")
  Write("file2.js", "...")
  Write("file3.js", "...")
  ```
  - ✅ All writes together
  - ✅ No sequential messages

- [ ] **Memory Operations**
  ```javascript
  // Single message:
  mcp__claude-flow_alpha__memory_usage({ action: "store", key: "k1", value: "v1" })
  mcp__claude-flow_alpha__memory_usage({ action: "store", key: "k2", value: "v2" })
  mcp__claude-flow_alpha__memory_usage({ action: "store", key: "k3", value: "v3" })
  ```
  - ✅ All operations batched

---

## 7. Integration Points

### .swarm Directory

- [ ] **Memory Database**
  - ✅ `.swarm/memory.db` exists
  - ✅ SQLite database valid
  - ✅ Tables created

- [ ] **Backups Directory**
  - ✅ `.swarm/backups/` exists
  - ✅ Session backups created (at end)

### Sessions Directory

- [ ] **Active Session**
  - ✅ Current session directory present
  - ✅ Artifacts organized properly
  - ✅ Metadata up to date

- [ ] **Archive Structure**
  - ✅ `.archive/` for old sessions
  - ✅ `metadata.json` tracks all sessions

---

## Troubleshooting Quick Checks

### If Hooks Fail

- [ ] **Check Package Version**
  ```bash
  npx claude-flow@alpha --version
  ```
  - ✅ Should be 2.0.10 or higher

- [ ] **Verify Memory DB**
  ```bash
  ls -la .swarm/memory.db
  ```
  - ✅ File exists and has content

### If MCP Fails

- [ ] **Check MCP Configuration**
  ```bash
  claude mcp list
  ```
  - ✅ claude-flow listed
  - ✅ ruv-swarm listed (optional)
  - ✅ flow-nexus listed (optional)

- [ ] **Restart MCP Servers**
  ```bash
  claude mcp restart claude-flow
  ```

### If Agents Don't Spawn

- [ ] **Use Task Tool, Not Just MCP**
  - ❌ Wrong: Only `mcp__claude-flow__agent_spawn`
  - ✅ Right: Claude Code `Task(...)` tool

- [ ] **Check Session Path**
  - ✅ Path includes `sessions/[SESSION_ID]/artifacts/`
  - ✅ No root directory paths

---

## Final Verification

### All Systems Go? ✅

- [ ] All MCP servers connected
- [ ] All hooks executing without errors
- [ ] Memory operations working
- [ ] Agents spawning via Task tool
- [ ] Files organized in session artifacts
- [ ] Concurrent execution patterns followed

### Ready for Production

If all checkboxes are marked, your claude-flow integration is:
- ✅ **Fully Functional**
- ✅ **Ready for Multi-Agent Work**
- ✅ **Following Best Practices**

---

## Automated Test Script

For automated verification, run:

```bash
bash sessions/[SESSION_ID]/artifacts/scripts/test-hooks.sh
bash sessions/[SESSION_ID]/artifacts/scripts/test-mcp-connections.sh
```

**Expected**: All tests pass with ✅ indicators

---

## Support

If any checklist item fails, see:
- [Integration Testing Guide](./integration-testing-guide.md)
- [Troubleshooting Documentation](./troubleshooting-guide.md)
