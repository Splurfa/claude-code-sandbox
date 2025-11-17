# ADR-002: Auto-Cascading Hooks via Pre-Task

**Status**: Proposed
**Date**: 2025-11-15
**Deciders**: System Architect
**Related**: ADR-001 (Never Edit Stock Files), ADR-004 (Skills Use Stock CLI Only)

---

## Context and Problem Statement

Current workspace uses `auto-hooks.js` to intercept filesystem operations and automatically fire hooks. While functional, this approach has issues:

1. **File Interception**: Monkey-patches `fs.writeFileSync` (violates stock-first)
2. **Hidden Execution**: Hooks fire invisibly (hard to debug/audit)
3. **Custom Runtime**: Requires Node.js code execution (not stock CLI)
4. **Fragility**: Breaks if fs API changes or other code patches fs

**Current Pattern**:
```javascript
// .claude/hooks/auto-hooks.js (CUSTOM CODE)
fs.writeFileSync = function(...args) {
  const result = originalWriteFile.apply(this, args);
  firePostEdit(args[0]);  // Hidden hook execution
  return result;
};
```

**Problems**:
- ❌ Not visible in process list or logs
- ❌ Can't be disabled without code changes
- ❌ Violates stock-first (custom runtime)
- ❌ Brittle (fragile interception)

**Question**: How do we automate hook coordination while maintaining stock-first compliance and transparency?

---

## Decision Drivers

### Technical Drivers

- **Transparency**: All hook execution must be visible and auditable
- **Stock-First**: Use only stock CLI, no custom runtime
- **Composability**: Skills should be able to add their own hooks
- **Reliability**: No fragile interception mechanisms

### User Experience Drivers

- **Automation**: Users shouldn't manually fire every hook
- **Control**: Users should be able to see and control hook execution
- **Debugging**: Clear logs of what hooks fired and why
- **Performance**: Minimal overhead from hook coordination

### Compliance Drivers

- **No Interception**: No monkey-patching or filesystem hooks
- **Stock CLI Only**: All hooks via `npx claude-flow@alpha hooks`
- **Auditability**: All hook execution logged
- **Testability**: Hooks can be tested independently

---

## Considered Options

### Option 1: Manual Hook Invocation (Stock Default)

**Description**: Users manually call stock hooks when needed.

**Example**:
```bash
# User must remember to call hooks manually
npx claude-flow@alpha hooks pre-task --description "Build API" --task-id "task-1"
# ... do work ...
npx claude-flow@alpha hooks post-edit --file "server.js"
# ... more work ...
npx claude-flow@alpha hooks post-task --task-id "task-1"
```

**Pros**:
- ✅ 100% stock (no customization)
- ✅ Fully transparent
- ✅ Complete user control

**Cons**:
- ❌ Error-prone (users forget hooks)
- ❌ Tedious for repeated operations
- ❌ Inconsistent hook usage
- ❌ Poor UX for coordination features

**Stock-First Score**: 100/100 (but poor UX)

### Option 2: Continue File Interception (Status Quo)

**Description**: Keep current auto-hooks.js with filesystem interception.

**Pros**:
- ✅ Automatic (no user action needed)
- ✅ Works with current setup

**Cons**:
- ❌ Hidden execution (not transparent)
- ❌ Custom runtime (violates stock-first)
- ❌ Fragile (monkey-patching)
- ❌ Not composable (hard to add skill hooks)
- ❌ Not auditable (no clear logs)

**Stock-First Score**: 70/100 (significant violation)

### Option 3: Git Hooks Integration

**Description**: Use git pre-commit/post-commit hooks to fire claude-flow hooks.

**Example**:
```bash
# .git/hooks/post-commit
#!/bin/bash
npx claude-flow@alpha hooks post-edit --file "$CHANGED_FILES"
```

**Pros**:
- ✅ Standard git mechanism
- ✅ Transparent (git logs)
- ✅ Stock CLI calls

**Cons**:
- ❌ Only fires on git commits (too coarse)
- ❌ Misses non-git operations
- ❌ Git-specific (doesn't cover all workflows)
- ❌ Couples hooks to git actions

**Stock-First Score**: 90/100, but incomplete coverage

### Option 4: Pre-Task Hook Cascade (CHOSEN)

**Description**: Pre-task hook automatically cascades to all necessary hooks at task start.

**Pattern**:
```bash
# User spawns agent (triggers pre-task hook automatically)
Task("Build API", "Create REST endpoints...", "backend-dev")

# Pre-task hook cascades to:
# 1. session-restore (load session context)
# 2. memory-load (load relevant data)
# 3. journal-entry (log task start)
# 4. skill-specific hooks (from settings.local.json)

# All via stock CLI, all logged, all transparent
```

**Pros**:
- ✅ **Transparent**: All hooks visible in logs
- ✅ **Stock CLI only**: No custom runtime
- ✅ **Composable**: Skills add hooks via settings.local.json
- ✅ **Auditable**: All execution logged
- ✅ **Natural trigger**: Task start is logical hook point
- ✅ **User-friendly**: Automatic but controllable

**Cons**:
- ⚠️ Requires pre-task hook configuration
- ⚠️ Only fires at task boundaries (not continuous)

**Stock-First Score**: 98/100

---

## Decision Outcome

**Chosen Option**: **Option 4 - Pre-Task Hook Cascade**

### Rationale

1. **Stock-First Compliance**: Uses only stock hooks CLI
2. **Transparency**: All hook execution visible in logs
3. **Composability**: Skills can add hooks via configuration
4. **Natural Trigger**: Task start is ideal coordination point
5. **User Experience**: Automatic but transparent and controllable

### How It Works

**1. User Spawns Agent (Claude Code Task Tool)**

```bash
# User request: "Build REST API with authentication"

# Claude Code spawns agents
Task("Backend Developer", "Build REST API. Save to sessions/session-xyz/artifacts/code/.", "backend-dev")
```

**2. Pre-Task Hook Fires Automatically**

Stock claude-flow fires pre-task hook when agent starts:
```bash
npx claude-flow@alpha hooks pre-task \
  --description "Build REST API" \
  --task-id "task-$(uuidgen)" \
  --agent-id "backend-dev"
```

**3. Pre-Task Hook Cascades to Skill Scripts**

Pre-task hook reads `.claude/settings.local.json` for cascade:
```json
{
  "hooks": {
    "pre-task": {
      "cascade": [
        ".claude/skills/session-management/scripts/session-restore.sh",
        ".claude/skills/captains-log/scripts/log-task-start.sh",
        ".claude/skills/reasoningbank-integration/scripts/load-context.sh"
      ]
    }
  }
}
```

**4. Each Skill Script Executes (Stock CLI Only)**

Example: `.claude/skills/session-management/scripts/session-restore.sh`
```bash
#!/bin/bash
# Restore session context via stock hooks

SESSION_ID="${SESSION_ID:-unknown}"

# 1. Check if session backup exists
if [ -f ".swarm/backups/session-$SESSION_ID.json" ]; then
  # 2. Restore session via stock hook
  npx claude-flow@alpha hooks session-restore --session-id "$SESSION_ID"

  # 3. Load session memory
  npx claude-flow@alpha hooks memory \
    --action retrieve \
    --key "session/$SESSION_ID/context"

  echo "✅ Session $SESSION_ID restored"
else
  echo "ℹ️  No session backup found, starting fresh"
fi
```

**5. All Execution Logged**

Stock hooks automatically log all execution:
```
[2025-11-15 16:50:54] pre-task: Build REST API (task-abc123)
[2025-11-15 16:50:54]   ↳ cascade: session-restore.sh
[2025-11-15 16:50:55]     ↳ hooks:session-restore (session-20251115-165054)
[2025-11-15 16:50:55]     ↳ hooks:memory retrieve (session/20251115-165054/context)
[2025-11-15 16:50:55]   ↳ cascade: log-task-start.sh
[2025-11-15 16:50:55]     ↳ hooks:journal (Starting task: Build REST API)
[2025-11-15 16:50:56]   ↳ cascade: load-context.sh
[2025-11-15 16:50:56]     ↳ hooks:memory retrieve (reasoningbank/trajectories/*)
```

---

## Implementation Details

### Stock Hook Extension Point

**Stock claude-flow provides**:
```bash
# Pre-task hook with auto-spawn support
npx claude-flow@alpha hooks pre-task \
  --description "..." \
  --task-id "..." \
  --auto-spawn-agents
```

**Skills extend via settings.local.json**:
```json
{
  "hooks": {
    "pre-task": {
      "cascade": [
        ".claude/skills/session-management/scripts/session-restore.sh",
        ".claude/skills/hooks-cascade/scripts/pre-task-all.sh"
      ],
      "parallel": false,  # Run sequentially
      "fail_fast": false  # Continue on error
    },
    "post-task": {
      "cascade": [
        ".claude/skills/session-management/scripts/session-backup.sh",
        ".claude/skills/git-checkpoints/scripts/auto-commit.sh",
        ".claude/skills/reasoningbank-integration/scripts/collect-trajectory.sh"
      ],
      "parallel": true,  # Run in parallel (faster)
      "fail_fast": false
    }
  }
}
```

### Cascade Script Template

**Every cascade script follows this pattern**:
```bash
#!/bin/bash
# Skill: <skill-name>
# Hook: <hook-name>
# Purpose: <what this script does>
# Stock Integration: <which stock hooks used>

set -euo pipefail  # Fail fast, no undefined vars

# 1. Get context from environment or arguments
TASK_ID="${1:-unknown}"
TASK_DESC="${2:-}"
SESSION_ID="${SESSION_ID:-unknown}"

# 2. Execute coordination via stock CLI only
npx claude-flow@alpha hooks <stock-hook> \
  --param1 "..." \
  --param2 "..."

# 3. Log outcome via stock journal
npx claude-flow@alpha hooks journal \
  --entry "Cascade script completed: <script-name>" \
  --tags "hook:<hook-name>,session:$SESSION_ID"

# 4. Exit with success
echo "✅ Cascade: <script-name> completed"
exit 0
```

### Error Handling

**Cascade continues on error** (by default):
```bash
# If fail_fast: false (default)
# Script errors are logged but don't stop cascade

#!/bin/bash
set +e  # Don't exit on error

npx claude-flow@alpha hooks memory --action retrieve --key "missing-key" || {
  # Log error but continue
  npx claude-flow@alpha hooks journal \
    --entry "Warning: Failed to retrieve missing-key" \
    --tags "error,hook:pre-task"
}

# Continue with rest of cascade
```

**Cascade stops on error** (if configured):
```json
{
  "hooks": {
    "pre-task": {
      "fail_fast": true  # Stop cascade on any error
    }
  }
}
```

### Cascade Composition

**Skills can depend on other skills**:
```bash
#!/bin/bash
# Skill: reasoningbank-integration
# Depends on: session-management (for session context)

# 1. Ensure session-management ran first
if [ ! -f ".swarm/backups/session-$SESSION_ID.json" ]; then
  echo "⚠️  Session not initialized, skipping reasoningbank"
  exit 0  # Graceful skip
fi

# 2. Load context from session
CONTEXT=$(npx claude-flow@alpha hooks memory \
  --action retrieve \
  --key "session/$SESSION_ID/context")

# 3. Use context for reasoningbank
npx claude-flow@alpha hooks memory \
  --action store \
  --key "reasoningbank/context/$SESSION_ID" \
  --value "$CONTEXT"

echo "✅ ReasoningBank context loaded"
```

---

## Positive Consequences

### Transparency Benefits

1. **Visible Execution**
   - All hooks logged by stock system
   - Process list shows scripts running
   - Easy to trace execution flow

2. **Auditable**
   - Stock journal records all hook calls
   - Cascade scripts visible in logs
   - No hidden operations

3. **Debuggable**
   - Can disable individual cascade scripts
   - Can run cascade scripts manually for testing
   - Clear error messages

### Composability Benefits

1. **Skills Add Hooks Easily**
   - Add script path to settings.local.json
   - No code modifications needed
   - Skills coordinate automatically

2. **Dependency Management**
   - Skills check prerequisites
   - Graceful degradation if deps missing
   - Clear dependency documentation

3. **Mix and Match**
   - Users enable/disable skills
   - Cascade order configurable
   - No conflicts (namespaced memory)

### Performance Benefits

1. **Parallel Execution** (optional)
   - Post-task cascades can run in parallel
   - Faster session backups and commits
   - Configurable per hook type

2. **Lazy Loading**
   - Cascades only fire when tasks execute
   - No continuous monitoring overhead
   - Efficient for batch operations

3. **Failure Tolerance**
   - Errors don't block execution (unless configured)
   - Degraded gracefully
   - Logged for later review

---

## Negative Consequences

### Limitations

1. **Task Boundary Only**
   - Cascades fire at task start/end only
   - Not continuous (unlike file interception)
   - Mitigated: Most coordination needed at task boundaries anyway

2. **Configuration Required**
   - Users must configure settings.local.json
   - Skills should provide setup scripts
   - Mitigated: Skills include configure.sh scripts

3. **Script Maintenance**
   - Each skill maintains cascade scripts
   - Scripts must follow conventions
   - Mitigated: Templates and validation

### Trade-offs

1. **Less Automatic than Interception**
   - File writes don't trigger hooks automatically
   - Users must structure work as tasks
   - Benefit: More explicit and controllable

2. **Cascade Order Matters**
   - Scripts may depend on others
   - Incorrect order can cause issues
   - Mitigated: Skill documentation specifies dependencies

3. **Error Handling Complexity**
   - Need clear strategy for errors
   - Fail-fast vs continue debate
   - Mitigated: Sensible defaults, configurable

---

## Validation and Testing

### Cascade Validation

**Check cascade configuration**:
```bash
#!/bin/bash
# Validate settings.local.json cascade configuration

CONFIG=".claude/settings.local.json"

# 1. Check file exists
if [ ! -f "$CONFIG" ]; then
  echo "⚠️  No settings.local.json found"
  exit 0
fi

# 2. Extract cascade scripts
CASCADES=$(jq -r '.hooks["pre-task"].cascade[]' "$CONFIG" 2>/dev/null)

# 3. Validate each script exists and is executable
for script in $CASCADES; do
  if [ ! -f "$script" ]; then
    echo "❌ ERROR: Cascade script not found: $script"
    exit 1
  fi

  if [ ! -x "$script" ]; then
    echo "⚠️  WARNING: Cascade script not executable: $script"
    chmod +x "$script"
  fi

  echo "✅ Validated: $script"
done

echo "✅ Cascade configuration valid"
```

### Cascade Testing

**Test cascade execution**:
```bash
#!/bin/bash
# Test pre-task cascade manually

TEST_TASK_ID="test-$(date +%s)"
TEST_DESC="Test cascade execution"

# Fire pre-task hook
echo "Testing pre-task cascade..."
npx claude-flow@alpha hooks pre-task \
  --description "$TEST_DESC" \
  --task-id "$TEST_TASK_ID"

# Check logs
echo ""
echo "Cascade logs:"
npx claude-flow@alpha hooks journal --search "task:$TEST_TASK_ID"

# Check memory
echo ""
echo "Session memory:"
npx claude-flow@alpha hooks memory --action search --pattern "session/*"

echo ""
echo "✅ Cascade test complete"
```

### Skill Integration Testing

**Test skill cascade scripts**:
```bash
#!/bin/bash
# Test skill cascade script in isolation

SKILL_NAME="session-management"
SCRIPT=".claude/skills/$SKILL_NAME/scripts/session-restore.sh"

# Setup test environment
export SESSION_ID="test-session-$(date +%s)"

# Create test session backup
mkdir -p .swarm/backups
cat > ".swarm/backups/session-$SESSION_ID.json" <<EOF
{
  "session_id": "$SESSION_ID",
  "created": "$(date -Iseconds)",
  "summary": "Test session"
}
EOF

# Run cascade script
echo "Testing $SCRIPT..."
bash "$SCRIPT"

# Validate results
if npx claude-flow@alpha hooks memory --action retrieve --key "session/$SESSION_ID/context"; then
  echo "✅ Session context restored"
else
  echo "❌ Session context not found"
  exit 1
fi

# Cleanup
rm -f ".swarm/backups/session-$SESSION_ID.json"

echo "✅ Skill cascade test passed"
```

---

## Migration from Current

### Phase 1: Disable File Interception

```bash
# 1. Comment out auto-hooks.js loading
# (Remove from any init scripts or requires)

# 2. Verify hooks still fire via pre-task
export SESSION_ID="migration-test"
npx claude-flow@alpha hooks pre-task \
  --description "Migration test" \
  --task-id "migration-1"

# 3. Check cascade executed
npx claude-flow@alpha hooks journal --search "task:migration-1"
```

### Phase 2: Convert to Cascade Scripts

```bash
# 1. Create cascade script from auto-hooks.js logic
mkdir -p .claude/skills/hooks-cascade/scripts

# 2. Extract firePreTask logic to script
cat > .claude/skills/hooks-cascade/scripts/pre-task-cascade.sh <<'EOF'
#!/bin/bash
# Converted from auto-hooks.js firePreTask

DESCRIPTION="$1"
TASK_ID="$2"
AGENT_ID="${3:-unknown}"

# Same logic, but via stock CLI
npx claude-flow@alpha hooks session-restore --session-id "$SESSION_ID"
npx claude-flow@alpha hooks memory --action retrieve --key "session/$SESSION_ID/context"
npx claude-flow@alpha hooks journal --entry "Starting task: $DESCRIPTION" --tags "session:$SESSION_ID,task:$TASK_ID"

echo "✅ Pre-task cascade complete"
EOF

chmod +x .claude/skills/hooks-cascade/scripts/pre-task-cascade.sh

# 3. Configure cascade
cat > .claude/settings.local.json <<EOF
{
  "hooks": {
    "pre-task": {
      "cascade": [
        ".claude/skills/hooks-cascade/scripts/pre-task-cascade.sh"
      ]
    }
  }
}
EOF
```

### Phase 3: Test and Validate

```bash
# 1. Test cascade manually
npx claude-flow@alpha hooks pre-task --description "Test" --task-id "test-1"

# 2. Verify cascade executed
npx claude-flow@alpha hooks journal --search "task:test-1"

# 3. Test in real workflow
# (Spawn agent via Claude Code Task tool, verify hooks fire)

# 4. Remove auto-hooks.js
mv .claude/hooks/auto-hooks.js .claude/skills/hooks-cascade/legacy/
```

---

## Related Patterns

### Pattern 1: Session Lifecycle Cascade

```bash
# Pre-task: Restore session
# Post-task: Backup session

# .claude/skills/session-management/scripts/session-restore.sh
npx claude-flow@alpha hooks session-restore --session-id "$SESSION_ID"

# .claude/skills/session-management/scripts/session-backup.sh
npx claude-flow@alpha hooks session-end --session-id "$SESSION_ID" --export-metrics true
```

### Pattern 2: Learning Pipeline Cascade

```bash
# Pre-task: Load trajectories
# Post-task: Collect new trajectory

# .claude/skills/reasoningbank-integration/scripts/load-context.sh
npx claude-flow@alpha hooks memory --action search --pattern "reasoningbank/trajectories/*"

# .claude/skills/reasoningbank-integration/scripts/collect-trajectory.sh
npx claude-flow@alpha hooks memory --action store --key "reasoningbank/trajectories/$TASK_ID" --value "$OUTCOME"
```

### Pattern 3: Git Checkpoint Cascade

```bash
# Post-task: Auto-commit with checkpoint

# .claude/skills/git-checkpoints/scripts/auto-commit.sh
git add sessions/$SESSION_ID/
git commit -m "Checkpoint: $TASK_DESC [task:$TASK_ID]"
```

---

## References

- [ADR-001: Never Edit Stock Files](ADR-001-never-edit-stock-files.md)
- [ADR-004: Skills Use Stock CLI Only](ADR-004-skills-use-stock-cli-only.md)
- [Features-as-Skills Specification](../features-as-skills-spec.md)
- [Stock Hooks Documentation](https://github.com/ruvnet/claude-flow/docs/hooks)

---

**Decision**: Adopted
**Implementation**: Phase 1 (extract to cascade scripts)
**Next Review**: After cascade migration complete
