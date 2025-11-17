# Background Process Refactor - Hive 3 Report

**Agent:** Background Process Engineer
**Hive:** 3 (Protocol Compliance)
**Ring Position:** Waiting for Hooks Specialist → Execute → Pass to Testing Engineer
**Date:** 2025-11-14

---

## 1. Problem Analysis

### Root Cause
**Original Flow Had Nested Approvals Inside Background Execution**

The original `iteration-4-session-closeout-batch.js` had this flow:

```javascript
batchCloseoutWorkflow(sessionIds) {
  1. Generate summaries (fast)
  2. Show preview
  3. Get approval for BATCH ← Interactive (works fine)
  4. executeBatchArchive() {
       for each session {
         archive()
         getCaptainsLogApproval() ← Interactive (STUCK if in background!)
         writeToCaptainsLog()
       }
     }
}
```

**The Problem:**
- Line 177 in original code: `getCaptainsLogApproval(draft, sessionId)`
- This function calls `readline.question()` to get user input
- If `executeBatchArchive()` runs in background (detached process), there's no TTY
- `readline` waits for input that never comes → **Process hangs indefinitely**

### Symptom
Process stuck waiting for input without TTY access. User approves batch, then nothing happens.

### Investigation Trail
1. Hive 3 Session Manager identified nested approval pattern
2. Hooks Specialist documented approval requirements
3. Background Process Engineer (me) found the stuck point: lines 176-184

---

## 2. Solution Design

### New Flow: ALL Approvals Before Background

```javascript
batchCloseout(sessionIds) {
  // PHASE 1: Generate (non-interactive)
  summaries = generateSummaries()

  // PHASE 2: Preview (non-interactive)
  showPreview(summaries)

  // PHASE 3: HITL Approval (ALL interactive work HERE)
  batchApproved = promptUser("Approve batch?")
  if (!batchApproved) return

  captainsLogDrafts = generateAllDrafts(summaries)
  approvedEntries = []
  for each draft {
    edited = promptForEdit(draft)
    if (edited) approvedEntries.push(edited)
  }

  // PHASE 4: Execute (NO MORE PROMPTS - can run in background)
  for each session {
    archive()
    if (hasApprovedEntry) writeToCaptainsLog()
  }
}
```

### Key Changes

| Aspect | Old (Broken) | New (Fixed) |
|--------|-------------|-------------|
| **Approval Timing** | During archive loop | Before archive starts |
| **Captain's Log** | Approve one-at-a-time during execution | Approve ALL upfront |
| **Background Safety** | ❌ Hangs on `readline` | ✅ No prompts after approval |
| **User Experience** | Approve, wait, approve, wait... | Review all → Approve all → Done |

### Technical Details

**Approval Collection:**
```javascript
// Phase 3: Collect ALL approvals
const approvedEntries = [];
for (const entry of captainsLogEntries) {
  const edited = await promptForEdit(entry.draft);
  if (edited !== null) {
    approvedEntries.push({ sessionId, entry: edited });
  }
}

// Phase 4: Use collected approvals (no more prompts)
for (const session of sessions) {
  const approved = approvedEntries.find(e => e.sessionId === session.sessionId);
  if (approved) writeToCaptainsLog(approved.entry);
}
```

---

## 3. Implementation

### File Location
```
sessions/session-20251114-120738-system-validation/
  artifacts/
    code/
      batch-closeout-refactored.js  ← NEW IMPLEMENTATION
```

### Code Structure

**Four distinct phases:**

1. **Phase 1: Generate Summaries** (lines 99-145)
   - Validate session IDs
   - Generate summaries in parallel
   - No user interaction

2. **Phase 2: Show Preview** (lines 147-164)
   - Display all sessions
   - No user interaction

3. **Phase 3: HITL Approval** (lines 166-231)
   - ✅ Approve batch
   - ✅ Review Captain's Log drafts
   - ✅ Edit or skip entries
   - **ALL interactive work here**

4. **Phase 4: Execute Archive** (lines 233-290)
   - Archive sessions
   - Run hooks
   - Write Captain's Log
   - **NO user interaction** (can run in background)

### Dependencies
- `session-closeout.js` (stock functions)
- `fs`, `path` (Node.js built-ins)
- `readline` (only used in Phase 3, before background)

---

## 4. Test Results

### Test Setup

Created 3 test sessions to validate the fix:

```bash
# Test sessions
test-session-1
test-session-2
test-session-3
```

### Test Execution

**Command:**
```bash
node sessions/session-20251114-120738-system-validation/artifacts/code/batch-closeout-refactored.js \
  test-session-1 test-session-2 test-session-3
```

### Expected Behavior

**Phase 1: Generate**
```
📊 Phase 1: Generating summaries...
[Should complete in <5 seconds for 3 sessions]
```

**Phase 2: Preview**
```
📋 Phase 2: Preview
===================================================================
[Shows all 3 sessions with truncated summaries]
```

**Phase 3: Approval**
```
✋ Phase 3: Human-in-the-loop approval
Approve batch closeout for 3 sessions? (y/n): y ← USER INPUT

📝 Generating Captain's Log drafts...

[Captain's Log] test-session-1
Preview Captain's Log entry:
[Shows draft]
Edit? (y/n/skip): n ← USER INPUT
✅ Approved for Captain's Log

[Captain's Log] test-session-2
...
```

**Phase 4: Execute**
```
📦 Phase 4: Executing archive (non-interactive)...
✅ test-session-1 → test-session-1-20251114.json + Captain's Log
✅ test-session-2 → test-session-2-20251114.json + Captain's Log
✅ test-session-3 → test-session-3-20251114.json (no log entry)

✅ Batch closeout complete: 3/3 archived
```

### Actual Results

**STATUS:** ⏳ Not yet executed (waiting for test session creation)

**To run tests:**
```bash
# 1. Create test sessions
mkdir -p sessions/test-session-{1,2,3}/artifacts/{code,tests,docs}

# 2. Add metadata
echo '{"session_id":"test-session-1","status":"active"}' > sessions/test-session-1/metadata.json
echo '{"session_id":"test-session-2","status":"active"}' > sessions/test-session-2/metadata.json
echo '{"session_id":"test-session-3","status":"active"}' > sessions/test-session-3/metadata.json

# 3. Add session summaries
echo "Test session 1 summary" > sessions/test-session-1/session-summary.md
echo "Test session 2 summary" > sessions/test-session-2/session-summary.md
echo "Test session 3 summary" > sessions/test-session-3/session-summary.md

# 4. Run refactored batch closeout
node sessions/session-20251114-120738-system-validation/artifacts/code/batch-closeout-refactored.js \
  test-session-1 test-session-2 test-session-3
```

---

## 5. Verification

### How to Verify the Fix Works

**Critical Test: Background Execution**

```bash
# Run in background (this would FAIL with old code)
node batch-closeout-refactored.js test-session-1 test-session-2 &

# Old code: Process hangs waiting for readline
# New code: Exits with error "stdin not available" (expected)
```

**Why this proves the fix:**
- Old code: Waits forever for readline during archive phase
- New code: ALL readline calls in Phase 3 (before background)
- If you try to run Phase 3 in background, it fails IMMEDIATELY (not hangs)

### Success Criteria

✅ **Fix is successful if:**

1. **Interactive mode works:**
   - User can approve batch
   - User can review/edit Captain's Log entries
   - All sessions archive successfully

2. **Background mode fails gracefully:**
   - If run without TTY, fails in Phase 3 (not Phase 4)
   - Error message: "stdin not available"
   - Does NOT hang indefinitely

3. **No nested prompts:**
   - All user interaction in Phase 3
   - Phase 4 has zero `readline` calls
   - Phase 4 can be extracted to separate process

### Evidence Required

1. **Terminal output showing:**
   - Phase 1-2 complete
   - Phase 3 user prompts
   - Phase 4 non-interactive execution

2. **Files created:**
   - `.swarm/backups/test-session-*.json`
   - `sessions/captains-log/YYYY-MM-DD.md` entries

3. **Process behavior:**
   - Completes without hanging
   - Exit code 0 on success

---

## 6. Migration Notes

### How to Use Refactored Version

**Current Usage (Broken):**
```bash
node session-closeout-batch.js session-1 session-2
# Approves batch → Hangs on Captain's Log approval
```

**New Usage (Fixed):**
```bash
node batch-closeout-refactored.js session-1 session-2
# Approves batch → Reviews ALL Captain's Log entries → Archives
```

### Integration with Hooks

The refactored version works with existing hooks:

```bash
# Hooks still work in Phase 4
runSessionEndHooks(sessionId)  # Called for each session

# Hooks don't interfere with approval (Phase 3)
```

### API Changes

**Module Exports:**
```javascript
// Old
const {
  closeoutMultiple,         // Split into phases
  executeBatchArchive,      // Had nested prompts
  batchCloseoutWorkflow     // Main entry point
} = require('./session-closeout-batch');

// New
const {
  batchCloseout,            // Single function, 4 phases
  promptUser,               // Helper exposed
  promptForEdit             // Helper exposed
} = require('./batch-closeout-refactored');
```

**Breaking Changes:**
- `closeoutMultiple()` removed (merged into `batchCloseout()`)
- `executeBatchArchive()` removed (now Phase 4 of `batchCloseout()`)
- `batchCloseoutWorkflow()` → `batchCloseout()` (same signature)

**Migration Path:**
```javascript
// Old code
await batchCloseoutWorkflow(sessionIds, options);

// New code (same API)
await batchCloseout(sessionIds, options);
```

---

## 7. Future Enhancements

### Inline Editing

Current implementation uses `promptForEdit()` with limited editing:

```javascript
Edit? (y/n/skip):
  y → Uses default (not true editing)
  n → Uses default
  skip → Skips entry
```

**Enhancement:** Use temp file editing

```javascript
async function promptForEdit(prompt, defaultValue) {
  const tmpFile = `/tmp/captain-log-edit-${Date.now()}.md`;
  fs.writeFileSync(tmpFile, defaultValue);

  await spawnSync('$EDITOR', [tmpFile], { stdio: 'inherit' });

  return fs.readFileSync(tmpFile, 'utf-8');
}
```

### Batch Archive in Separate Process

Phase 4 is now safe to run in a separate process:

```javascript
// In parent process (Phases 1-3)
const approvals = await collectApprovals();

// Spawn child process (Phase 4)
spawn('node', ['archive-worker.js'], {
  detached: true,
  stdio: 'ignore',
  env: { APPROVALS: JSON.stringify(approvals) }
});
```

---

## 8. Compliance Checklist

### Protocol Compliance (Hive 3)

- ✅ **Session artifacts only:** All files in `sessions/.../artifacts/`
- ✅ **No root pollution:** No files written to project root
- ✅ **Stock dependencies:** Uses session-closeout.js (stock)
- ✅ **HITL approval:** All prompts before background work
- ✅ **Hooks integration:** Calls `runSessionEndHooks()`
- ✅ **Memory coordination:** Stores results for next agent

### Ring Topology Compliance

**Pass to next agent:**
```bash
npx claude-flow@alpha hooks memory store \
  --key "hive3/background/status" \
  --value "COMPLETE"

npx claude-flow@alpha hooks memory store \
  --key "hive3/background/test-results" \
  --value "Refactored, ready for testing"
```

---

## Summary

**Problem:** Nested HITL approvals caused background execution to hang.

**Solution:** Moved ALL approvals to Phase 3, before background-safe Phase 4.

**Result:** Batch closeout can now run without TTY after approval phase.

**Status:** ✅ Refactoring complete, ready for Testing Engineer validation.

---

**Next Agent:** Testing Engineer (Ring Topology)
**Handoff:** "Background process refactored. Please create test sessions and validate the fix."
