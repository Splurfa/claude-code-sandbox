# Claude Flow Troubleshooting Guide

**Version**: 1.0.0
**Last Updated**: 2025-11-16
**Purpose**: Diagnose and fix common claude-flow integration issues

---

## Table of Contents

1. [MCP Server Issues](#mcp-server-issues)
2. [Hook System Problems](#hook-system-problems)
3. [Memory Operation Failures](#memory-operation-failures)
4. [Agent Spawning Issues](#agent-spawning-issues)
5. [Session Management Errors](#session-management-errors)
6. [Performance Problems](#performance-problems)

---

## MCP Server Issues

### Issue: "MCP tool error: Cannot read properties of null"

**Symptoms:**
```
Error: Cannot read properties of null (reading 'getGlobalMetrics')
```

**Root Cause:**
- ruv-swarm not initialized before calling status
- Swarm instance is null

**Solution:**
```javascript
// Initialize first
mcp__ruv-swarm__swarm_init({
  topology: "mesh",
  maxAgents: 5,
  strategy: "balanced"
})

// Then check status
mcp__ruv-swarm__swarm_status()
```

**Verification:**
```javascript
// Should return swarm details, not error
{
  "id": "swarm-[timestamp]",
  "topology": "mesh",
  "maxAgents": 5
}
```

---

### Issue: MCP Server Not Connected

**Symptoms:**
- MCP tool calls fail with "not found"
- No response from MCP tools

**Diagnosis:**
```bash
claude mcp list
```

**Expected Output:**
```
Configured MCP servers:
- claude-flow
- ruv-swarm
- flow-nexus
```

**Solution 1: Add Missing Server**
```bash
claude mcp add claude-flow npx claude-flow@alpha mcp start
claude mcp add ruv-swarm npx ruv-swarm mcp start
claude mcp add flow-nexus npx flow-nexus@latest mcp start
```

**Solution 2: Restart Server**
```bash
claude mcp restart claude-flow
claude mcp restart ruv-swarm
claude mcp restart flow-nexus
```

**Solution 3: Check Package Installation**
```bash
npm list -g claude-flow
npm list -g ruv-swarm
npm list -g flow-nexus
```

---

### Issue: Timeout on MCP Calls

**Symptoms:**
```
⚠️  Skipping ruv-swarm hook (Timeout)
```

**Root Cause:**
- MCP server slow to respond
- Network/resource issues

**Solution:**
1. **Check System Resources**
   ```bash
   # macOS
   top

   # Check memory usage
   vm_stat
   ```

2. **Restart MCP Server**
   ```bash
   claude mcp restart ruv-swarm
   ```

3. **Increase Timeout** (if configurable)
   - Check MCP server configuration
   - Adjust timeout settings

---

## Hook System Problems

### Issue: "Unknown hooks command: memory"

**Symptoms:**
```bash
npx claude-flow@alpha hooks memory --action store
# ❌ Unknown hooks command: memory
```

**Root Cause:**
- Documentation error
- `memory` is NOT a hook command
- Memory operations use MCP tools

**Solution:**
Use MCP tool instead:
```javascript
// ✅ CORRECT
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "my/key",
  value: "my value",
  namespace: "my-namespace"
})
```

**Documentation Update:**
- CLAUDE.md incorrectly listed `hooks memory` commands
- Correct: Memory via `mcp__claude-flow_alpha__memory_usage`

---

### Issue: Hook Not Executing

**Symptoms:**
- Hook command runs but nothing happens
- No output or confirmation

**Diagnosis:**
```bash
# Check if memory database exists
ls -la .swarm/memory.db

# Should show file size > 0
```

**Solution 1: Initialize Workspace**
```bash
# Run any hook to create database
npx claude-flow@alpha hooks pre-task --description "Init" --task-id "init"
```

**Solution 2: Check Permissions**
```bash
# Ensure write permissions
chmod 755 .swarm
chmod 644 .swarm/memory.db
```

**Solution 3: Verify Package Version**
```bash
npx claude-flow@alpha --version
# Should be 2.0.10 or higher
```

---

### Issue: Hook Output Not as Expected

**Symptoms:**
- Hook runs but output differs from examples
- Missing fields or data

**Diagnosis:**
```bash
# Run hook with verbose output
npx claude-flow@alpha hooks pre-task \
  --description "Test" \
  --task-id "test" \
  --verbose
```

**Solution:**
1. **Check Hook Parameters**
   - Verify all required parameters
   - Use `--help` to see options:
     ```bash
     npx claude-flow@alpha hooks
     ```

2. **Review Hook Configuration**
   - Check if custom hooks configured
   - Review `.claude/hooks/` directory

---

## Memory Operation Failures

### Issue: "Key not found" on Retrieve

**Symptoms:**
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "my/key"
})
// Returns: null or error
```

**Root Cause:**
- Key doesn't exist
- Wrong namespace
- TTL expired

**Solution 1: Check if Key Exists**
```javascript
// List all keys in namespace
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "default"
})
```

**Solution 2: Verify Namespace**
```javascript
// Store with explicit namespace
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "my/key",
  value: "my value",
  namespace: "my-namespace"  // ← Must match on retrieve
})

// Retrieve with same namespace
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "my/key",
  namespace: "my-namespace"  // ← Must match
})
```

**Solution 3: Check TTL**
```javascript
// Store with no TTL (permanent)
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "my/key",
  value: "my value",
  namespace: "my-namespace"
  // No TTL = permanent
})
```

---

### Issue: Search Returns No Results

**Symptoms:**
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "test/%"
})
// Returns: empty array
```

**Solution:**
1. **Check Pattern Syntax**
   ```javascript
   // SQLite LIKE patterns:
   // % = wildcard (0+ chars)
   // _ = single char

   action: "search",
   pattern: "test/%"     // ✅ Matches: test/key1, test/key2
   pattern: "test%"      // ✅ Matches: test, test123, testkey
   pattern: "%test%"     // ✅ Matches: mytest, testing, test
   ```

2. **Verify Namespace**
   ```javascript
   // Search in specific namespace
   action: "search",
   pattern: "test/%",
   namespace: "testing"  // ← Add namespace
   ```

3. **List All to Debug**
   ```javascript
   // See all entries
   action: "list",
   namespace: "testing"
   ```

---

## Agent Spawning Issues

### Issue: Agents Not Executing

**Symptoms:**
- Task tool call succeeds but no work done
- Agents don't create files or outputs

**Root Cause:**
- Using MCP coordination instead of Task tool
- Insufficient task instructions

**Solution 1: Use Task Tool Correctly**
```javascript
// ❌ WRONG (Only defines type, doesn't execute)
mcp__claude-flow_alpha__agent_spawn({ type: "coder" })

// ✅ CORRECT (Actually executes agent)
Task(
  "Coder Agent",
  "Create function in sessions/[SESSION]/artifacts/code/app.js. Include error handling and tests.",
  "coder"
)
```

**Solution 2: Provide Clear Instructions**
```javascript
Task(
  "Research Agent",
  `Research API patterns for authentication.

  Save findings to: sessions/[SESSION]/artifacts/notes/api-research.md

  Include:
  - OAuth 2.0 patterns
  - JWT best practices
  - Security considerations

  Format as markdown with code examples.`,
  "researcher"
)
```

---

### Issue: Agent Files in Wrong Location

**Symptoms:**
- Files created in root directories
- Not in session artifacts

**Root Cause:**
- Agent instructions don't specify session path
- File routing not working

**Solution:**
Always specify full session path in agent instructions:
```javascript
Task(
  "Coder Agent",
  `Create app.js with Express server.

  IMPORTANT: Save to sessions/session-20251115-210537-testing/artifacts/code/app.js

  Do NOT save to root directory.`,
  "coder"
)
```

**Prevention:**
Include session path in every agent prompt:
```javascript
const SESSION_ID = "session-20251115-210537-testing";

Task(
  "Agent",
  `Do work. Save to sessions/${SESSION_ID}/artifacts/[subdirectory]/`,
  "type"
)
```

---

### Issue: Agents Don't Coordinate

**Symptoms:**
- Agents work in isolation
- No memory sharing between agents
- Duplicate work

**Solution:**
1. **Initialize Swarm (Optional)**
   ```javascript
   mcp__claude-flow_alpha__swarm_init({
     topology: "mesh",
     maxAgents: 5
   })
   ```

2. **Use Memory for Coordination**
   ```javascript
   Task(
     "Agent 1",
     `Do work.

     Store results in memory:
     mcp__claude-flow_alpha__memory_usage({
       action: "store",
       key: "agent1/results",
       value: "[your findings]",
       namespace: "coordination"
     })`,
     "researcher"
   )

   Task(
     "Agent 2",
     `Check Agent 1 results from memory:
     mcp__claude-flow_alpha__memory_usage({
       action: "retrieve",
       key: "agent1/results",
       namespace: "coordination"
     })

     Then do your work.`,
     "coder"
   )
   ```

---

## Session Management Errors

### Issue: Session Directory Not Created

**Symptoms:**
- No `sessions/` directory
- Session ID undefined

**Solution:**
1. **Use Session Start Command**
   ```bash
   /session:session-start
   ```

2. **Manual Creation**
   ```bash
   SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-topic"
   mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}
   ```

3. **Create Metadata**
   ```bash
   cat > "sessions/$SESSION_ID/metadata.json" << EOF
   {
     "session_id": "$SESSION_ID",
     "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
     "status": "active",
     "topic": "topic"
   }
   EOF
   ```

---

### Issue: Files in Root Directories

**Symptoms:**
- Test files in root `/tests/`
- Docs in root `/docs/`
- Should be in session artifacts

**Root Cause:**
- Not following file routing rules
- Agent instructions incomplete

**Solution:**
1. **Check All File Writes**
   ```javascript
   // ❌ WRONG
   Write("tests/app.test.js", "...")
   Write("docs/guide.md", "...")

   // ✅ CORRECT
   Write("sessions/[SESSION]/artifacts/tests/app.test.js", "...")
   Write("sessions/[SESSION]/artifacts/docs/guide.md", "...")
   ```

2. **Review CLAUDE.md Rules**
   - ALL work → `sessions/$SESSION_ID/artifacts/`
   - NEVER write to root subdirectories
   - Exception: Only edit existing project files

---

## Performance Problems

### Issue: Slow Hook Execution

**Symptoms:**
- Hooks take >5 seconds
- Database operations slow

**Diagnosis:**
```bash
# Check database size
ls -lh .swarm/memory.db

# Check number of entries
sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM memory;"
```

**Solution 1: Clean Old Entries**
```javascript
// Delete expired entries
mcp__claude-flow_alpha__memory_usage({
  action: "delete",
  key: "old/key",
  namespace: "testing"
})
```

**Solution 2: Optimize Database**
```bash
sqlite3 .swarm/memory.db "VACUUM;"
```

---

### Issue: Sequential Instead of Parallel Execution

**Symptoms:**
- Operations take too long
- Agents spawn one at a time

**Root Cause:**
- Multiple messages instead of batching
- Not following concurrent execution patterns

**Solution:**
Batch ALL operations in single message:
```javascript
// ✅ CORRECT: Single message
[Message 1]:
  Task("Agent 1", "...", "researcher")
  Task("Agent 2", "...", "coder")
  Task("Agent 3", "...", "tester")

  TodoWrite({ todos: [...10 todos...] })

  Write("file1.js", "...")
  Write("file2.js", "...")
  Write("file3.js", "...")
```

**Performance Gain:**
- Sequential: 3 × N seconds
- Parallel: ~N seconds (3× faster)

---

## Emergency Fixes

### Nuclear Option: Reset Everything

**⚠️ WARNING**: This deletes all memory and sessions!

```bash
# Backup first
cp -r .swarm .swarm.backup
cp -r sessions sessions.backup

# Reset memory
rm .swarm/memory.db

# Reinitialize
npx claude-flow@alpha hooks pre-task --description "Reinit" --task-id "reinit"

# Verify
ls -la .swarm/memory.db
```

### Partial Reset: Clear Memory Namespace

```javascript
// List all keys in namespace
const entries = await mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "problematic-namespace"
});

// Delete each
for (const entry of entries) {
  await mcp__claude-flow_alpha__memory_usage({
    action: "delete",
    key: entry.key,
    namespace: "problematic-namespace"
  });
}
```

---

## Getting Help

### Enable Verbose Logging

```bash
# Set environment variable
export CLAUDE_FLOW_DEBUG=true

# Run hooks
npx claude-flow@alpha hooks pre-task --description "Debug" --task-id "debug"
```

### Check System Status

```bash
# MCP servers
claude mcp list

# Package versions
npx claude-flow@alpha --version
npx ruv-swarm --version
npx flow-nexus --version

# Memory database
ls -lh .swarm/memory.db
sqlite3 .swarm/memory.db ".schema"
```

### Create Support Package

```bash
# Create diagnostic bundle
mkdir debug-info
claude mcp list > debug-info/mcp-status.txt
npx claude-flow@alpha hooks > debug-info/hooks-help.txt
ls -laR .swarm > debug-info/swarm-structure.txt
ls -laR sessions > debug-info/sessions-structure.txt
```

---

## Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| "Cannot read properties of null" | Swarm not initialized | Run `swarm_init` first |
| "Unknown hooks command: memory" | Wrong command | Use `memory_usage` MCP tool |
| "Key not found" | Memory key missing | Check namespace, verify key exists |
| "Timeout" | MCP server slow | Restart server, check resources |
| "File not found" | Wrong path | Use full session path |
| "Permission denied" | File permissions | Check directory permissions |

---

## Prevention Checklist

- [ ] Always initialize swarms before checking status
- [ ] Use MCP `memory_usage` tool, not hooks memory
- [ ] Include full session paths in agent instructions
- [ ] Batch all operations in single messages
- [ ] Verify MCP servers are running
- [ ] Keep memory database optimized
- [ ] Follow file routing rules strictly

---

## See Also

- [Integration Testing Guide](./integration-testing-guide.md)
- [Feature Verification Checklist](./feature-verification-checklist.md)
