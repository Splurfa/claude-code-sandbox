# Session State Manager - Integration Guide

## Quick Start

### 1. Install in Project

Copy the session state manager to your project:

```bash
cp sessions/session-20251114-145225-dream-hive-production-readiness/artifacts/code/session-state-manager.js \
   bin/session-state-manager.js
chmod +x bin/session-state-manager.js
```

### 2. Basic Usage

```bash
# Check current state
node bin/session-state-manager.js <session-id> get

# Pause session when chat ends
node bin/session-state-manager.js <session-id> pause "chat ended"

# Resume session when work continues
node bin/session-state-manager.js <session-id> resume "work continues"

# Close session (final)
node bin/session-state-manager.js <session-id> close "work complete"
```

### 3. Integrate with Hooks

Add to your claude-flow hooks:

```bash
# hooks/pre-task.sh
SESSION_ID=$(cat .current-session)
STATE=$(node bin/session-state-manager.js "$SESSION_ID" get)

if [ "$STATE" = "paused" ]; then
  echo "📂 Resuming paused session: $SESSION_ID"
  node bin/session-state-manager.js "$SESSION_ID" resume "task started"
fi
```

```bash
# hooks/post-task.sh
SESSION_ID=$(cat .current-session)
# Only pause if explicitly requested, not automatically
# (allows multiple tasks in same session)
```

```bash
# hooks/session-end.sh
SESSION_ID=$(cat .current-session)
node bin/session-state-manager.js "$SESSION_ID" close "session closeout complete"
```

## Claude Code Integration

### Automatic Session Management

Update `CLAUDE.md` with state management:

```markdown
## 🚨 CRITICAL: AUTOMATIC SESSION MANAGEMENT

**ON FIRST MESSAGE IN NEW CHAT:**
1. Auto-generate session ID: `session-$(date +%Y%m%d-%H%M%S)-<topic>`
2. Auto-create session structure
3. **Set initial state to ACTIVE:**
   ```bash
   node bin/session-state-manager.js "$SESSION_ID" get
   # Should return: active
   ```

**WHEN CHAT ENDS (no explicit closeout):**
- Session transitions to PAUSED automatically
- Can be resumed when chat continues

**WHEN WORK IS COMPLETE:**
- Explicit closeout ritual required
- Session transitions to CLOSED (terminal state)
```

## State Machine Reference

```
┌──────────┐
│          │
│  ACTIVE  │◄──┐
│          │   │
└────┬─────┘   │
     │         │
     │ pause   │ resume
     │         │
     ▼         │
┌──────────┐   │
│          │   │
│  PAUSED  │───┘
│          │
└────┬─────┘
     │
     │ close
     │
     ▼
┌──────────┐
│          │
│  CLOSED  │ (terminal)
│          │
└──────────┘
```

## Validation Rules

**Before state transitions:**
1. Validate current state exists and is valid
2. Check transition is allowed per state machine
3. Ensure session metadata file exists
4. Verify session directory structure

**After state transitions:**
1. Write metadata atomically (tmp file + rename)
2. Add timestamp for audit trail
3. Clean up old state metadata
4. Update reason/context fields

## Error Handling

### Invalid Transition
```javascript
try {
  manager.resume();
} catch (error) {
  // Error: Invalid transition: closed → active
  console.error('Cannot resume closed session');
  console.log('Create new session or restore from backup');
}
```

### Missing Metadata
```javascript
try {
  const manager = new SessionStateManager('nonexistent-session');
  manager.getState();
} catch (error) {
  // Error: Metadata not found
  console.error('Session does not exist');
}
```

## Migration from Old Sessions

Use the repair script to fix legacy sessions:

```bash
bash sessions/session-20251114-145225-dream-hive-production-readiness/artifacts/scripts/fix-session-metadata.sh
```

**What it does:**
1. Scans all session metadata files
2. Detects invalid/missing states
3. Infers correct state from context
4. Backs up before modifying
5. Reports statistics

**Safe to run multiple times** - idempotent operation.

## Best Practices

### 1. One Session Per Chat Thread

```bash
# ✅ CORRECT
Chat Thread 1 → session-20251114-120000-feature-a (ACTIVE)
Chat Thread 2 → session-20251114-140000-feature-b (ACTIVE)

# ❌ WRONG
Chat Thread 1 → session-20251114-120000-feature-a (ACTIVE)
              → session-20251114-121500-subtask-1 (ACTIVE)  # Same chat!
```

### 2. Explicit State Transitions

```bash
# ✅ CORRECT - Explicit transitions
node bin/session-state-manager.js "$SESSION_ID" pause "taking break"
node bin/session-state-manager.js "$SESSION_ID" resume "back to work"

# ❌ WRONG - Manual metadata edits
echo '{"status":"paused"}' > sessions/$SESSION_ID/metadata.json
```

### 3. Always Provide Reasons

```bash
# ✅ CORRECT - Context for future review
node bin/session-state-manager.js "$SESSION_ID" pause "chat ended, may continue tomorrow"
node bin/session-state-manager.js "$SESSION_ID" close "feature complete, all tests passing"

# ❌ WRONG - Missing context
node bin/session-state-manager.js "$SESSION_ID" pause
node bin/session-state-manager.js "$SESSION_ID" close
```

### 4. Verify State Before Operations

```bash
# ✅ CORRECT - Check state first
STATE=$(node bin/session-state-manager.js "$SESSION_ID" get)
if [ "$STATE" = "closed" ]; then
  echo "Session is closed, create new one"
  exit 1
fi

# Continue with work...
```

## Monitoring & Auditing

### List Sessions by State

```bash
# Find all active sessions
for meta in sessions/*/metadata.json; do
  if [ "$(jq -r '.status' "$meta")" = "active" ]; then
    echo "$meta"
  fi
done
```

### Audit Trail

Session metadata includes full history:

```json
{
  "session_id": "session-20251114-120000",
  "created_at": "2025-11-14T20:00:00Z",
  "status": "active",
  "last_resumed_at": "2025-11-14T22:30:00Z",
  "resume_reason": "continuing API work"
}
```

Track:
- Creation timestamp
- Current state
- Last state change
- Reason for transition

## Troubleshooting

### Multiple Active Sessions

```bash
# Find all active sessions
ACTIVE=$(grep -l '"status": "active"' sessions/*/metadata.json | wc -l)

if [ $ACTIVE -gt 1 ]; then
  echo "⚠️  Multiple active sessions detected"
  echo "Review and pause inactive ones"
fi
```

### Corrupted Metadata

```bash
# Validate metadata JSON
for meta in sessions/*/metadata.json; do
  if ! jq empty "$meta" 2>/dev/null; then
    echo "❌ Invalid JSON: $meta"
  fi
done
```

### Restore from Backup

All state changes create backups:

```bash
# List backups for session
ls -la sessions/$SESSION_ID/metadata.json.backup-*

# Restore from backup
cp sessions/$SESSION_ID/metadata.json.backup-20251114-120000 \
   sessions/$SESSION_ID/metadata.json
```

## Testing

Run comprehensive test suite:

```bash
node sessions/session-20251114-145225-dream-hive-production-readiness/artifacts/tests/session-state-manager.test.js
```

**Expected output:**
```
🧪 Session State Manager Tests
================================
✅ Test 1: Read initial active state
✅ Test 2: Transition from active to paused
...
✅ Test 10: Remove old state metadata on transition

📊 Test Summary
================
Total:  10
Passed: 10
Failed: 0

✅ All tests passed
```

## Future Enhancements

1. **Automatic state detection** - Infer state from chat context
2. **Multi-session warnings** - Alert when multiple sessions appear active
3. **State history tracking** - Record all transitions in metadata
4. **Integration with hooks** - Auto-pause/resume based on chat lifecycle
5. **Dashboard view** - Visual session state overview

## Support

**Documentation:**
- State definitions: `artifacts/docs/session-lifecycle-states.md`
- This integration guide: `artifacts/docs/integration-guide.md`

**Code:**
- Implementation: `artifacts/code/session-state-manager.js`
- Tests: `artifacts/tests/session-state-manager.test.js`

**Scripts:**
- Repair tool: `artifacts/scripts/fix-session-metadata.sh`

**Questions?** Review the test suite for usage examples.
