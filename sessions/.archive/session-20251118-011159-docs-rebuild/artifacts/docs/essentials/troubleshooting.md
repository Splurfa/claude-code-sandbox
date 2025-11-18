# Troubleshooting Guide

**Essential debugging for common claude-flow+ workspace issues**

This guide documents **verified errors** encountered in real sessions with **tested solutions**.

---

## Quick Diagnosis

### 🔴 Symptom: Files Created in Wrong Location

**Error Pattern:**
```
Created: docs/my-feature.md
Created: tests/my-test.js
Created: scripts/setup.sh
```

**Cause:** Violating file routing protocol (CLAUDE.md lines 22, 46)

**Solution:**
```bash
# 1. Check current session
echo $SESSION_ID
# If empty, session wasn't initialized

# 2. Move files to session artifacts
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-topic"
mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}

# 3. Move misplaced files
mv docs/my-feature.md sessions/$SESSION_ID/artifacts/docs/
mv tests/my-test.js sessions/$SESSION_ID/artifacts/tests/
mv scripts/setup.sh sessions/$SESSION_ID/artifacts/scripts/

# 4. Update session metadata
npx claude-flow@alpha hooks session-restore --session-id "$SESSION_ID"
```

**Prevention:**
- ✅ Always start sessions: `/session-start <topic>`
- ✅ Include session path in agent instructions
- ✅ Use absolute paths: `sessions/$SESSION_ID/artifacts/`

**Reference:** [File Routing Explained](../../explanation/file-routing.md)

---

### 🟠 Symptom: Agent Spawning in Sequence (Slow)

**Error Pattern:**
```javascript
// Message 1
Task("Researcher", "...", "researcher")

// Message 2
Task("Coder", "...", "coder")

// Message 3
Task("Tester", "...", "tester")

// Result: 3x longer execution time
```

**Cause:** Breaking concurrent execution rule (CLAUDE.md lines 50-57)

**Solution:**
```javascript
// ✅ CORRECT: Spawn ALL agents in ONE message
[Single Message]:
  Task("Researcher", "Analyze patterns. Save to sessions/$SESSION_ID/artifacts/docs/.", "researcher")
  Task("Coder", "Implement features. Save to sessions/$SESSION_ID/artifacts/code/.", "coder")
  Task("Tester", "Write tests. Save to sessions/$SESSION_ID/artifacts/tests/.", "tester")
  Task("Reviewer", "Review code. Save findings to sessions/$SESSION_ID/artifacts/docs/.", "reviewer")

  // Batch all file operations
  Bash "mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts}"
  Write "sessions/$SESSION_ID/artifacts/code/feature.js"
  Write "sessions/$SESSION_ID/artifacts/tests/feature.test.js"
```

**Performance Impact:**
- ❌ Sequential: 3 agents × 5 min = 15 minutes
- ✅ Parallel: max(5, 5, 5) = 5 minutes (3x faster)

**Prevention:**
- ✅ Use "1 MESSAGE = ALL RELATED OPERATIONS" rule
- ✅ Batch all TodoWrite calls (5-10+ todos minimum)
- ✅ Group all file operations together

**Reference:** CLAUDE.md "⚡ GOLDEN RULE" section

---

### 🟡 Symptom: Memory Operations Failing

**Error Pattern:**
```bash
# ❌ WRONG - Hooks don't have memory commands
npx claude-flow@alpha hooks memory-store --key "data" --value "test"
# Error: Unknown hook 'memory-store'
```

**Cause:** Confusing hooks CLI with MCP tools (CLAUDE.md lines 394-396, 507)

**Solution:**
```javascript
// ✅ CORRECT: Use MCP tools for memory
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "swarm/decision/architecture",
  value: JSON.stringify({
    pattern: "microservices",
    reason: "scalability requirements",
    timestamp: Date.now()
  }),
  namespace: "coordination"
})

// Retrieve data
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "swarm/decision/architecture",
  namespace: "coordination"
})

// Search patterns
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "swarm/%",
  namespace: "coordination"
})
```

**Key Distinction:**
- **Hooks** (`npx claude-flow@alpha hooks`): pre-task, post-task, session-end
- **MCP Tools** (`mcp__claude-flow_alpha__*`): memory, swarm, agents, neural

**Prevention:**
- ✅ Check [Stock Claude-Flow Features](../../explanation/workspace-architecture.md#stock-features) section
- ✅ Use MCP tools for all coordination operations
- ✅ Use hooks only for lifecycle events

**Reference:** CLAUDE.md "Stock Claude-Flow Features" section

---

### 🔵 Symptom: Pre-commit Hooks Failing

**Error Pattern:**
```bash
git commit -m "Add feature"
# Running hooks...
# ✗ pre-commit hook failed: claude-flow hooks not found
# ✗ episode-recorder failed: AgentDB not initialized
```

**Cause:** Hooks not executable or dependencies missing

**Solution:**
```bash
# 1. Make hooks executable
chmod +x .claude/hooks/*.sh
chmod +x .claude/integrations/*.js

# 2. Verify claude-flow installed
npx claude-flow@alpha --version
# If missing: npm install -g claude-flow@alpha

# 3. Test hooks individually
npx claude-flow@alpha hooks pre-task --description "test" --task-id "test-001"

# 4. Check .claude/settings.json syntax
cat .claude/settings.json | jq .
# Verify JSON is valid

# 5. Re-run commit
git commit -m "Add feature"
```

**Common Hook Errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| `command not found: npx` | Node.js not installed | Install Node.js 18+ |
| `hooks: command not found` | claude-flow not installed | `npm install -g claude-flow@alpha` |
| `Permission denied` | Script not executable | `chmod +x .claude/hooks/*.sh` |
| `Invalid JSON` | Syntax error in settings.json | Validate with `jq` |

**Prevention:**
- ✅ Never use `--no-verify` or `--no-hooks` flags
- ✅ Fix root cause, don't bypass hooks
- ✅ Test hooks after modifying `.claude/settings.json`

**Reference:** [Hooks System Architecture](../.claude/hooks/README.md)

---

### 🟣 Symptom: Hooks System Not Working

**Error Pattern:**
```bash
# Hook doesn't execute
git commit -m "Add feature"
# ✗ pre-commit hook failed: npx: command not found

# Or: Hook runs but fails silently
# (No visible error, but memory not updating)

# Or: Permission denied
bash: .claude/hooks/journal.sh: Permission denied
```

**Cause:** Hook configuration, permissions, or dependency issues

**Solution:**

#### 1. Pre-commit Hook Failures (Git Integration)

```bash
# Check if hooks are executable
ls -la .git/hooks/pre-commit
# Should show: -rwxr-xr-x (executable)

# Make executable if needed
chmod +x .git/hooks/pre-commit

# Verify Node.js installed
node --version
# Should show: v18.0.0 or higher

# Verify claude-flow installed
npx claude-flow@alpha --version
# Should show: v2.7.35 or similar

# Test hook manually
npx claude-flow@alpha hooks pre-task --description "Test" --task-id "test-001"
# Should succeed without errors

# If still failing, check hook script syntax
cat .git/hooks/pre-commit
# Verify shebang: #!/bin/bash or #!/bin/sh
```

**Common Pre-commit Issues:**

| Error | Cause | Fix |
|-------|-------|-----|
| `npx: command not found` | Node.js not in PATH | Add to PATH or use full path: `/usr/local/bin/npx` |
| `claude-flow: command not found` | Not installed | `npm install -g claude-flow@alpha` |
| `Permission denied` | Not executable | `chmod +x .git/hooks/pre-commit` |
| `Invalid JSON` | Settings syntax error | Validate `.claude/settings.json` with `jq` |

#### 2. Auto-Fire Hooks Not Working (Claude Code Native Hooks)

```bash
# Check .claude/settings.json configuration
cat .claude/settings.json | jq '.hooks'
# Should show PreToolUse/PostToolUse configuration

# Verify JSON syntax
cat .claude/settings.json | jq .
# Should parse without errors

# Common issues:
# - Missing closing braces
# - Trailing commas
# - Unescaped quotes

# Example correct configuration:
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
    ]
  }
}

# Test hook manually to verify command works
npx claude-flow@alpha hooks pre-edit --file "/tmp/test.md"
# Should succeed
```

**Auto-Fire Hook Configuration Issues:**

| Symptom | Cause | Fix |
|---------|-------|-----|
| Hooks never fire | Settings file not loaded | Restart Claude Code |
| Hooks fire but fail | Command syntax error | Test command manually first |
| Hooks fire randomly | Matcher pattern wrong | Fix regex: `Write\|Edit\|MultiEdit` |
| Error: "Invalid JSON" | Syntax error | Use `jq` to find error line |

#### 3. Hook Scripts Not Executable

```bash
# Check script permissions
ls -la .claude/hooks/*.sh
# Should show: -rwxr-xr-x (executable)

# Make all hook scripts executable
chmod +x .claude/hooks/*.sh
chmod +x .claude/integrations/*.js

# Verify shebang line
head -1 .claude/hooks/journal.sh
# Should be: #!/bin/bash

# Test script directly
.claude/hooks/journal.sh "Test entry" "test"
# Should create log entry without errors

# Check for Windows line endings (if on WSL/Git Bash)
file .claude/hooks/journal.sh
# Should show: "Bourne-Again shell script, ASCII text executable"
# NOT: "with CRLF line terminators"

# Fix line endings if needed
dos2unix .claude/hooks/*.sh
# Or: sed -i 's/\r$//' .claude/hooks/*.sh
```

#### 4. Deprecated auto-hooks.js Migration

**Error Pattern:**
```bash
# Old filesystem monkey-patching pattern (DEPRECATED)
Error: Cannot find module '.claude/hooks/auto-hooks.js'
```

**Cause:** Using deprecated auto-hooks.js (violated stock-first principle)

**Solution:**
```bash
# 1. Verify migration to native hooks complete
cat .claude/settings.json | jq '.hooks'
# Should show native Claude Code hooks, NOT:
# "preEdit": "node .claude/hooks/auto-hooks.js"

# 2. Remove deprecated auto-hooks.js (if present)
# DO NOT DELETE - Check .claude/hooks/README.md first
cat .claude/hooks/README.md
# Migration guide shows correct native hook pattern

# 3. Verify new pattern in use
grep -r "auto-hooks.js" .claude/
# Should return: EMPTY (or only in README as example of wrong pattern)

# 4. Test native hooks working
echo "test" > /tmp/test-file.md
# Then Write this file in Claude Code
# Hooks should fire automatically
```

**Migration Verification:**
```bash
# ✅ CORRECT (Native Claude Code hooks)
.claude/settings.json → "PreToolUse": [{"matcher": "Write", ...}]

# ❌ WRONG (Deprecated filesystem interception)
.claude/hooks/auto-hooks.js → const fs = require('fs'); fs.writeFileSync = ...
```

See [Hooks Migration Guide](../../../../.claude/hooks/README.md) for complete migration steps.

#### 5. Hook Failures Silent (No Errors Shown)

**Symptom:**
- Hooks configured correctly
- Commands work manually
- But memory not updating, logs not created

**Cause:** Hooks failing silently (continueOnError: true)

**Diagnosis:**
```bash
# 1. Check hook logs (if configured)
cat .swarm/logs/hooks.log
# Or check Captain's Log
cat sessions/captains-log/$(date +%Y-%m-%d).md

# 2. Enable verbose hook output
# Edit .claude/settings.json, add to hook command:
"command": "npx claude-flow@alpha hooks pre-edit --file '{}' --verbose"

# 3. Test hook with logging
npx claude-flow@alpha hooks pre-edit --file "/tmp/test.md" 2>&1 | tee hook-debug.log

# 4. Check memory database
sqlite3 .swarm/memory.db "SELECT * FROM memory_entries ORDER BY created_at DESC LIMIT 5;"
# Should show recent entries if hooks working

# 5. Verify hook actually ran
ps aux | grep "claude-flow"
# Should show processes during file operations
```

**Solutions:**
```bash
# Enable error reporting (edit .claude/settings.json):
{
  "hooks": {
    "PreToolUse": [{
      "hooks": [{
        "continueOnError": false  // ← Change to false to see errors
      }]
    }]
  }
}

# Add logging to hook commands:
"command": "npx claude-flow@alpha hooks pre-edit --file '{}' 2>> .swarm/logs/hooks.log"

# Or use shell wrapper for debugging:
"command": "bash -c 'set -x; npx claude-flow@alpha hooks pre-edit --file \"{}\" 2>&1 | tee -a .swarm/logs/hooks.log'"
```

#### 6. Hook Dependencies Missing

**Common Dependency Issues:**

```bash
# Check for jq (JSON processor)
which jq
# If missing: brew install jq (macOS) or apt install jq (Linux)

# Check for sqlite3 (memory database)
which sqlite3
# If missing: brew install sqlite (macOS) or apt install sqlite3 (Linux)

# Check for git (version control)
git --version
# Should show: git version 2.x or higher

# Check for bash (shell)
bash --version
# Should show: GNU bash, version 4.0 or higher

# Verify all dependencies at once
npx claude-flow@alpha hooks check-dependencies
# Should report all dependencies installed
```

**Installing Missing Dependencies:**

```bash
# macOS (Homebrew)
brew install node jq sqlite git

# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm jq sqlite3 git

# Windows (WSL recommended)
# Use WSL Ubuntu and follow Linux instructions

# Verify installation
node --version && jq --version && sqlite3 --version && git --version
```

#### 7. Hook Runtime Errors

**Error Pattern:**
```bash
# Syntax error in hook script
.claude/hooks/journal.sh: line 23: syntax error near unexpected token `fi'

# Or: Command not found
.claude/hooks/journal.sh: line 15: npx: command not found

# Or: Database locked
Error: database is locked
```

**Solutions:**
```bash
# 1. Check hook script syntax
bash -n .claude/hooks/journal.sh
# Should return: EMPTY (no output = no errors)

# 2. Test script with debug mode
bash -x .claude/hooks/journal.sh "Test entry" "test"
# Shows each command as it executes

# 3. Check for concurrent database access
lsof .swarm/memory.db
# Shows processes using database
# Kill any stuck processes: kill -9 <PID>

# 4. Verify environment variables
env | grep CLAUDE
# Should show: CLAUDE_FLOW_HOOKS_ENABLED=true

# 5. Check PATH for commands
which npx
which sqlite3
# Both should return paths
```

**Common Script Errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| `syntax error near 'fi'` | Unclosed if/else | Check all `if` have matching `fi` |
| `command not found` | Missing PATH | Add to script: `export PATH="/usr/local/bin:$PATH"` |
| `database is locked` | Concurrent access | Add retry logic or use exclusive lock |
| `Permission denied: /usr/local/bin` | No write access | Use user-local: `npm install -g --prefix ~/.local` |

---

**Prevention Checklist for Hooks:**

Before relying on hooks:
- [ ] Hooks configured in `.claude/settings.json`
- [ ] All hook scripts executable (`chmod +x`)
- [ ] Dependencies installed (node, npx, jq, sqlite3)
- [ ] JSON syntax validated (`jq` test)
- [ ] Hooks tested manually (`npx claude-flow@alpha hooks ...`)
- [ ] Migration from auto-hooks.js complete
- [ ] Error reporting enabled (continueOnError: false for testing)

During development:
- [ ] Check Captain's Log for hook execution logs
- [ ] Verify memory updates after operations
- [ ] Monitor `.swarm/logs/hooks.log` if configured
- [ ] Test hooks after modifying `.claude/settings.json`

**Reference:**
- [Hooks System Architecture](../../../../.claude/hooks/README.md)
- [Stock Cascade Pattern](../../../../.claude/hooks/README.md#stock-claude-code-pattern-adr-002)
- [Migration Guide](../../../../.claude/hooks/README.md#migration-from-auto-hooksjs)

---

### 🟤 Symptom: Session Not Auto-Created

**Error Pattern:**
```
User: "Implement feature X"
Claude: [Creates files in root directories]
# No session/ directory exists
```

**Cause:** Session protocol violation - must create on first message (Captain's Log 2025-11-16, session-20251115-151900)

**Solution:**
```bash
# 1. Create session retroactively
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-topic-description"
mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}

# 2. Move all created files
find . -maxdepth 1 -name "*.md" -o -name "*.js" | while read file; do
  # Determine type and move
  case "$file" in
    *.md) mv "$file" sessions/$SESSION_ID/artifacts/docs/ ;;
    *.js) mv "$file" sessions/$SESSION_ID/artifacts/code/ ;;
    *test*) mv "$file" sessions/$SESSION_ID/artifacts/tests/ ;;
  esac
done

# 3. Create metadata
cat > sessions/$SESSION_ID/metadata.json <<EOF
{
  "sessionId": "$SESSION_ID",
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "active",
  "remediated": true
}
EOF

# 4. Run hooks for proper tracking
npx claude-flow@alpha hooks pre-task \
  --description "Retroactive session creation" \
  --task-id "$SESSION_ID"
```

**Prevention:**
- ✅ Always use `/session-start <topic>` at beginning of conversation
- ✅ ONE SESSION = ONE CHAT THREAD (not per task)
- ✅ Include session path in every agent instruction

**Reference:** [Session Management Explained](../../explanation/session-management.md)

---

### 🟢 Symptom: Tests Failing (Coverage Report)

**Real Error (session-20251117-002737):**
```json
{
  "results": {
    "total": 5,
    "passed": 0,
    "failed": 5
  }
}
```

**Common Test Failure Causes:**

#### 1. Missing Dependencies
```bash
# Check if node_modules exists
ls node_modules/
# If missing:
npm install

# Verify test framework
npm list jest
# Or:
npm list mocha
```

#### 2. Incorrect Test Paths
```javascript
// ❌ WRONG - Absolute path breaks in CI
const module = require('/Users/me/project/src/module.js');

// ✅ CORRECT - Relative path
const module = require('../../src/module.js');
```

#### 3. Environment Variables Missing
```bash
# Check required env vars
grep -r "process.env" tests/
# Set missing vars:
export API_KEY="test-key"
export DATABASE_URL="sqlite::memory:"

# Run tests
npm test
```

**Debugging Workflow:**
```bash
# 1. Run single test file
npm test -- tests/specific.test.js

# 2. Enable verbose output
npm test -- --verbose

# 3. Check for syntax errors
npx eslint tests/

# 4. Verify mocks aren't hiding real issues
grep -r "mock\|stub\|spy" tests/
# Review: Are we testing mocks or real logic?
```

**Prevention:**
- ✅ Use TDD: Write failing test → Implement → Test passes
- ✅ Avoid testing mocked behavior (test real logic)
- ✅ Keep test output pristine (no unexpected logs)

**Reference:** CLAUDE.md "Testing" section

---

## Error Categories

### Category 1: File Routing Violations

**Symptoms:**
- Files in root `docs/`, `tests/`, `scripts/`
- Agent output in wrong directories
- Session artifacts missing

**Root Cause:** Not following CLAUDE.md file routing protocol

**Fix Pattern:**
1. Identify all misplaced files
2. Create/verify session structure
3. Move files to `sessions/$SESSION_ID/artifacts/`
4. Update all references/links
5. Run session hooks for tracking

**Permanent Solution:**
- Review [File Routing Explained](../../explanation/file-routing.md)
- Add session path to all agent instructions
- Use file routing skill for AI guidance

---

### Category 2: Coordination Issues

**Symptoms:**
- Sequential agent execution (slow)
- Missing agent coordination
- Memory not shared between agents
- Agents unaware of each other's work

**Root Cause:** Breaking concurrent execution or memory coordination rules

**Fix Pattern:**
1. Batch all agent spawning in single message
2. Use MCP memory tools for sharing state
3. Include coordination instructions in agent prompts
4. Verify hooks are running (check `.swarm/memory.db`)

**Permanent Solution:**
- Follow "1 MESSAGE = ALL RELATED OPERATIONS" rule
- Use memory coordination pattern:
  ```javascript
  // Agent 1 stores decision
  mcp__claude-flow_alpha__memory_usage({
    action: "store",
    key: "swarm/shared/api-design",
    value: JSON.stringify({ endpoints: [...] }),
    namespace: "coordination"
  })

  // Agent 2 retrieves decision
  mcp__claude-flow_alpha__memory_usage({
    action: "retrieve",
    key: "swarm/shared/api-design",
    namespace: "coordination"
  })
  ```

---

### Category 3: Hook System Failures

**Symptoms:**
- Pre-commit hooks failing with "command not found"
- Auto-fire hooks not executing (silent failures)
- Permission denied errors on hook scripts
- JSON syntax errors in settings.json
- Memory not updating after operations
- Database locked errors
- Migration errors from deprecated auto-hooks.js

**Root Cause:** Configuration, permissions, dependencies, or migration issues

**Fix Pattern:**
1. **Verify permissions**: `chmod +x .claude/hooks/*.sh`
2. **Check configuration**: `cat .claude/settings.json | jq '.hooks'`
3. **Test manually**: `npx claude-flow@alpha hooks pre-task --description "test" --task-id "test-001"`
4. **Install dependencies**: `brew install node jq sqlite git` (macOS) or `apt install nodejs jq sqlite3 git` (Linux)
5. **Verify migration**: Ensure auto-hooks.js pattern removed
6. **Enable error logging**: Set `continueOnError: false` during debugging
7. **Check logs**: Review Captain's Log or `.swarm/logs/hooks.log`

**Common Errors & Solutions:**

| Error Type | Quick Fix |
|------------|-----------|
| `npx: command not found` | Install Node.js: `brew install node` |
| `Permission denied` | Make executable: `chmod +x .claude/hooks/*.sh` |
| `Invalid JSON` | Validate: `cat .claude/settings.json \| jq .` |
| `Database locked` | Kill processes: `lsof .swarm/memory.db` then `kill -9 <PID>` |
| `auto-hooks.js not found` | Check migration: `.claude/hooks/README.md` |
| Silent failures | Set `continueOnError: false` in settings.json |
| Hooks never fire | Restart Claude Code to reload settings |

**Permanent Solution:**
- Review [Hooks System Architecture](../../../../.claude/hooks/README.md)
- Follow [Migration Guide](../../../../.claude/hooks/README.md#migration-from-auto-hooksjs)
- Never bypass with `--no-verify` or `--no-hooks`
- Fix root cause, don't work around
- Test hooks after every settings.json change
- Keep dependencies updated (`npm update -g claude-flow@alpha`)

**Detailed Troubleshooting:** See "🟣 Symptom: Hooks System Not Working" section above for step-by-step debugging

---

### Category 4: Session Management Issues

**Symptoms:**
- No session directory created
- Files scattered across workspace
- Missing session metadata
- Unable to track session history

**Root Cause:** Session protocol violations

**Fix Pattern:**
1. Create session structure retroactively
2. Move files to proper locations
3. Generate metadata file
4. Run session hooks for backfill

**Permanent Solution:**
- Always start with `/session-start <topic>`
- ONE SESSION = ONE CHAT THREAD
- Never reuse session IDs across conversations

---

## Prevention Checklist

Before starting any work, verify:

- [ ] Session created (`/session-start <topic>`)
- [ ] `$SESSION_ID` environment variable set
- [ ] File paths include `sessions/$SESSION_ID/artifacts/`
- [ ] Hooks are executable (`ls -la .claude/hooks/`)
- [ ] Dependencies installed (`npx claude-flow@alpha --version`)
- [ ] `.claude/settings.json` is valid JSON

During work, ensure:

- [ ] All agents spawned in single message (parallel execution)
- [ ] All file operations batched together
- [ ] Memory coordination via MCP tools
- [ ] TodoWrite batched (5-10+ todos minimum)
- [ ] Session path in all agent instructions

Before committing:

- [ ] All tests passing (`npm test`)
- [ ] No files in root directories (except project files)
- [ ] Session artifacts properly organized
- [ ] Hooks executed successfully (no `--no-verify`)
- [ ] Captain's Log updated (if using journal.sh)

---

## Debugging Workflow

### Step 1: Identify the Issue

```bash
# Check file locations
find . -maxdepth 1 -name "*.md" -o -name "*.js"
# Should be empty (except project files)

# Verify session exists
ls -la sessions/
# Should show current session directory

# Check hooks status
cat .claude/settings.json | jq '.hooks'
# Should show PreToolUse/PostToolUse configuration

# Test memory access
npx claude-flow@alpha hooks session-restore --session-id "$(basename sessions/session-*)"
# Should succeed without errors
```

### Step 2: Determine Root Cause

**File Location Issues?**
→ Review CLAUDE.md file routing rules
→ Check if session was created
→ Verify agent instructions included session path

**Slow Execution?**
→ Count messages between agent spawns
→ Check if operations are batched
→ Review concurrent execution patterns

**Hook Failures?**
→ Check file permissions
→ Verify dependencies installed
→ Validate JSON syntax
→ Test hooks individually

**Test Failures?**
→ Run tests with verbose output
→ Check for missing dependencies
→ Review test for mocked behavior
→ Verify environment variables

### Step 3: Apply Fix

1. **Fix immediate issue** (move files, batch operations, fix permissions)
2. **Verify fix works** (test manually, run hooks, check tests)
3. **Update process** (document in Captain's Log, update skills)
4. **Prevent recurrence** (add to checklist, update CLAUDE.md if needed)

### Step 4: Validate Solution

```bash
# Verify file locations
find sessions/$SESSION_ID/artifacts/ -type f
# Should show all session files

# Test hooks
npx claude-flow@alpha hooks pre-task --description "Validation test" --task-id "validate-001"
# Should succeed

# Run tests
npm test
# Should pass

# Check memory
sqlite3 .swarm/memory.db "SELECT key, namespace FROM memory_entries ORDER BY created_at DESC LIMIT 10;"
# Should show recent coordination entries
```

---

## Common Gotchas

### 1. Session Scope Confusion

❌ **WRONG:** Create new session for each task
```
/session-start "implement-feature"
[work on feature]
/session-closeout

/session-start "write-tests"  ← WRONG (same conversation)
```

✅ **CORRECT:** One session per conversation thread
```
/session-start "feature-implementation-with-tests"
[implement feature, write tests, review, iterate]
/session-closeout
```

---

### 2. Hook vs MCP Tool Confusion

❌ **WRONG:** Using hooks for memory operations
```bash
npx claude-flow@alpha hooks memory-store --key "data"
# Error: No such hook
```

✅ **CORRECT:** Use MCP tools for memory
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "data",
  value: "content",
  namespace: "default"
})
```

---

### 3. Relative vs Absolute Paths

❌ **WRONG:** Relative session paths
```javascript
Task("Coder", "Save to artifacts/code/", "coder")
// Where is artifacts/?
```

✅ **CORRECT:** Absolute session paths
```javascript
Task("Coder", "Save to sessions/$SESSION_ID/artifacts/code/", "coder")
```

---

### 4. Sequential vs Parallel Operations

❌ **WRONG:** Multiple messages
```
Message 1: Task("Agent1")
Message 2: Task("Agent2")
Message 3: Write file1
Message 4: Write file2
```

✅ **CORRECT:** Single message
```
[Single Message]:
  Task("Agent1", "...", "type1")
  Task("Agent2", "...", "type2")
  Write "file1"
  Write "file2"
  TodoWrite { todos: [...all todos...] }
```

---

## Resources

### Documentation
- [Workspace Architecture](../../explanation/workspace-architecture.md) - System overview
- [Session Management](../../explanation/session-management.md) - Session protocol
- [File Routing](../../explanation/file-routing.md) - File organization rules
- [Hooks System](../.claude/hooks/README.md) - Hook architecture

### References
- CLAUDE.md - Complete configuration and rules
- Captain's Log - Historical decisions and issues
- Session artifacts - Examples of proper structure

### Support
- GitHub Issues: https://github.com/ruvnet/claude-flow/issues
- Documentation: https://github.com/ruvnet/claude-flow

---

## Quick Reference

### File Routing
```bash
# ✅ CORRECT
sessions/$SESSION_ID/artifacts/code/      # Source code
sessions/$SESSION_ID/artifacts/tests/     # Tests
sessions/$SESSION_ID/artifacts/docs/      # Documentation
sessions/$SESSION_ID/artifacts/scripts/   # Scripts
sessions/$SESSION_ID/artifacts/notes/     # Notes

# ❌ WRONG
docs/           # Never write here
tests/          # Never write here
scripts/        # Never write here
```

### Memory Operations
```javascript
// Store
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "key",
  value: "data",
  namespace: "coordination"
})

// Retrieve
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "key",
  namespace: "coordination"
})

// Search
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "prefix%",
  namespace: "coordination"
})
```

### Hook Commands
```bash
# Pre-task
npx claude-flow@alpha hooks pre-task --description "task" --task-id "id"

# Post-task
npx claude-flow@alpha hooks post-task --task-id "id" --status "completed"

# Session end
npx claude-flow@alpha hooks session-end --export-metrics true
```

### Concurrent Pattern
```javascript
// ✅ ONE MESSAGE = ALL OPERATIONS
[Single Message]:
  // All agents
  Task("Agent1", "Task 1. Save to sessions/$SESSION_ID/artifacts/code/.", "type1")
  Task("Agent2", "Task 2. Save to sessions/$SESSION_ID/artifacts/tests/.", "type2")

  // All todos
  TodoWrite { todos: [...8+ todos...] }

  // All files
  Write "sessions/$SESSION_ID/artifacts/code/file1.js"
  Write "sessions/$SESSION_ID/artifacts/tests/file1.test.js"

  // All bash commands
  Bash "mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs}"
  Bash "npm install"
```

---

**Last Updated:** 2025-11-18
**Session:** session-20251118-011159-docs-rebuild
**Status:** ✅ All solutions verified from real sessions
