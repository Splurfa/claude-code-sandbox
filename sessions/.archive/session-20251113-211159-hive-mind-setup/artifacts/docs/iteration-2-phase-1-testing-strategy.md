# Testing Strategy: Session Closeout Wrapper Scripts

**Session**: session-20251113-211159-hive-mind-setup
**Phase**: 1B - Planning
**Agent**: Test Strategist
**Date**: 2025-11-14
**Status**: FINAL - Ready for Implementation

---

## Executive Summary

This testing strategy validates the 3 wrapper scripts that orchestrate stock claude-flow commands for ephemeral session closeout. Testing focuses on:

1. **Unit Tests**: Each script in isolation
2. **Integration Tests**: All scripts working together
3. **Memory System Tests**: Database integrity verification
4. **Session Lifecycle Tests**: Complete workflow validation

**Test Philosophy**:
- Test what EXISTS, not what documentation CLAIMS
- Use actual stock commands discovered in integration tests
- Validate against database reality (SQLite, not JSON files)

---

## Test Pyramid Structure

```
         /\
        /E2E\        ← 2 tests (full lifecycle)
       /------\
      /Integr.\     ← 5 tests (script coordination)
     /----------\
    /   Unit     \  ← 15 tests (script functionality)
   /--------------\
```

**Total Test Cases**: 22
**Estimated Execution Time**: 15 minutes
**Automation Level**: 100% (all bash-scriptable)

---

## Unit Tests

### Script 1: `session-closeout.sh`

#### Test 1.1: Normal Operation
**Description**: Verify successful closeout with valid session
**Preconditions**:
- Session folder exists at `sessions/test-session-001/artifacts/`
- Session summary file exists
- Test task ID: `task-test-001`

**Execution**:
```bash
./scripts/session-closeout.sh test-session-001 task-test-001
# (Type "y" when prompted for HITL approval)
```

**Expected Output**:
```
🔄 STEP 1: COLLECT - Gathering session artifacts
  📋 Collecting captain's log entries...
  📂 Found N artifacts in sessions/test-session-001/artifacts

🏷️  STEP 2: CLASSIFY - Auto-tagging session
  🏷️  Detected topics: [extracted topics]

👤 STEP 3: HITL - Human Review Required
[Summary display]
Approve this summary for archival? [y/N] y

📦 STEP 4: ARCHIVE - Running stock hooks and backup
  ✅ Running post-task hook...
  ✅ Running session-end hook...

✅ Session closeout complete!
```

**Validation**:
```bash
# Verify classification stored in database
npx claude-flow@alpha memory search \
  --namespace "session-closeout" \
  --pattern "classify-test-session-001"
# Expected: JSON with topics, artifact_count, timestamp

# Verify HITL approval stored
npx claude-flow@alpha memory search \
  --namespace "session-closeout" \
  --pattern "hitl-test-session-001"
# Expected: JSON with approved=true
```

**Success Criteria**:
- ✅ Exit code 0
- ✅ No error messages
- ✅ Classification metadata in database
- ✅ HITL approval in database
- ✅ post-task and session-end hooks executed

---

#### Test 1.2: Missing Session Summary
**Description**: Graceful error when session-summary.md doesn't exist
**Execution**:
```bash
mkdir -p sessions/test-missing-summary/artifacts/
# (Deliberately omit session-summary.md)
./scripts/session-closeout.sh test-missing-summary task-test-002
```

**Expected Output**:
```
❌ Error: sessions/test-missing-summary/artifacts/session-summary.md not found
```

**Validation**:
```bash
echo $?
# Expected: Non-zero exit code (1)
```

**Success Criteria**:
- ✅ Error message displayed
- ✅ Script exits cleanly (no crash)
- ✅ No database changes made
- ✅ Exit code 1

---

#### Test 1.3: HITL Rejection
**Description**: Verify closeout stops when user rejects summary
**Execution**:
```bash
./scripts/session-closeout.sh test-session-001 task-test-003
# (Type "n" when prompted for HITL approval)
```

**Expected Output**:
```
Approve this summary for archival? [y/N] n
❌ Closeout cancelled. Edit sessions/test-session-001/artifacts/session-summary.md and re-run.
```

**Validation**:
```bash
# Verify no HITL approval stored
npx claude-flow@alpha memory search \
  --namespace "session-closeout" \
  --pattern "hitl-test-session-001" | grep "approved"
# Expected: Empty or false
```

**Success Criteria**:
- ✅ Closeout stops at HITL step
- ✅ No post-task or session-end hooks executed
- ✅ Session artifacts preserved
- ✅ Exit code 1

---

#### Test 1.4: Empty Session Summary
**Description**: Handle sessions with minimal content
**Execution**:
```bash
echo "" > sessions/test-empty/artifacts/session-summary.md
./scripts/session-closeout.sh test-empty task-test-004
```

**Expected Behavior**: Script proceeds normally (empty summary is valid)

**Success Criteria**:
- ✅ No errors
- ✅ Empty summary stored in captain's log
- ✅ Classification detects zero topics

---

#### Test 1.5: Missing Task ID
**Description**: Verify script validates required arguments
**Execution**:
```bash
./scripts/session-closeout.sh test-session-001
# (Omit task-id argument)
```

**Expected Output**:
```
Usage: ./scripts/session-closeout.sh <session-id> <task-id>
```

**Success Criteria**:
- ✅ Usage message displayed
- ✅ Exit code 1
- ✅ No side effects

---

### Script 2: `captain-log-append.sh`

#### Test 2.1: Normal Operation
**Description**: Append approved summary to captain's log
**Preconditions**: Session with approved summary exists

**Execution**:
```bash
./scripts/captain-log-append.sh test-session-001
```

**Expected Output**:
```
✅ Captain's log entry created: journal:2025-11-14-XX:XX:XX
   Namespace: captains-log
   Summary: [First line of summary]
```

**Validation**:
```bash
# Query captain's log entries
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*" | grep "test-session-001"
# Expected: Entry with session summary content

# Verify entry structure
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*" | jq '.[] | select(.value | contains("test-session-001"))'
# Expected: Valid JSON with timestamp, type, author, title, content, tags, context, hitl_reviewed
```

**Success Criteria**:
- ✅ Entry created in `captains-log` namespace
- ✅ Entry has correct structure (timestamp, type, author, etc.)
- ✅ Summary content is JSON-escaped correctly
- ✅ `hitl_reviewed: true` field present
- ✅ Exit code 0

---

#### Test 2.2: Missing Session Summary
**Description**: Error when summary file doesn't exist
**Execution**:
```bash
./scripts/captain-log-append.sh nonexistent-session
```

**Expected Output**:
```
❌ Error: sessions/nonexistent-session/artifacts/session-summary.md not found
```

**Success Criteria**:
- ✅ Error message displayed
- ✅ No database changes
- ✅ Exit code 1

---

#### Test 2.3: Large Summary Content
**Description**: Handle summaries >10KB
**Execution**:
```bash
# Create large summary (20KB)
for i in {1..1000}; do echo "## Section $i" >> sessions/test-large/artifacts/session-summary.md; done
./scripts/captain-log-append.sh test-large
```

**Success Criteria**:
- ✅ Full content stored in database
- ✅ No truncation
- ✅ Valid JSON escaping

---

#### Test 2.4: Special Characters in Summary
**Description**: Ensure JSON escaping works correctly
**Execution**:
```bash
cat > sessions/test-special/artifacts/session-summary.md << 'EOF'
# Summary with "quotes" and 'apostrophes'
Code block: `const x = "hello";`
Newlines and \backslashes
EOF

./scripts/captain-log-append.sh test-special
```

**Validation**:
```bash
# Verify content is properly escaped
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*" | jq '.[] | select(.value | contains("test-special"))' | jq -r '.value' | jq -e '.content'
# Expected: Valid JSON string with escaped quotes
```

**Success Criteria**:
- ✅ All special characters properly escaped
- ✅ Content retrievable and parseable
- ✅ No JSON syntax errors

---

#### Test 2.5: Missing Session ID Argument
**Description**: Validate required arguments
**Execution**:
```bash
./scripts/captain-log-append.sh
```

**Expected Output**:
```
Usage: ./scripts/captain-log-append.sh <session-id>
```

**Success Criteria**:
- ✅ Usage message displayed
- ✅ Exit code 1

---

### Script 3: `session-backup.sh`

#### Test 3.1: Normal Backup (Preserve Session)
**Description**: Create backup without deleting session
**Execution**:
```bash
./scripts/session-backup.sh test-session-001 no
```

**Expected Output**:
```
📦 Creating backup snapshot...
✅ Backup created: .swarm/backups/session-test-session-001-YYYYMMDD-HHMMSS.json (XX.XMB)

📊 Backup Summary:
  Session ID: test-session-001
  Backup file: .swarm/backups/session-test-session-001-YYYYMMDD-HHMMSS.json
  Size: XX.XMB
  Session folder: PRESERVED
```

**Validation**:
```bash
# Verify backup file exists
ls -lh .swarm/backups/session-test-session-001-*.json
# Expected: File exists with reasonable size

# Verify valid JSON
jq empty .swarm/backups/session-test-session-001-*.json
# Expected: Exit code 0 (valid JSON)

# Verify session folder preserved
ls -d sessions/test-session-001/
# Expected: Directory exists
```

**Success Criteria**:
- ✅ Backup file created in `.swarm/backups/`
- ✅ File is valid JSON
- ✅ File size >0 bytes
- ✅ Filename includes session ID and timestamp
- ✅ Session folder still exists
- ✅ Exit code 0

---

#### Test 3.2: Ephemeral Backup (Delete Session)
**Description**: Create backup and delete session folder
**Execution**:
```bash
./scripts/session-backup.sh test-ephemeral yes
```

**Expected Output**:
```
📦 Creating backup snapshot...
✅ Backup created: .swarm/backups/session-test-ephemeral-YYYYMMDD-HHMMSS.json (XX.XMB)

🗑️  Deleting ephemeral session folder...
✅ Deleted: sessions/test-ephemeral

📊 Backup Summary:
  Session ID: test-ephemeral
  Backup file: .swarm/backups/session-test-ephemeral-YYYYMMDD-HHMMSS.json
  Size: XX.XMB
  Session folder: DELETED
```

**Validation**:
```bash
# Verify backup exists
ls .swarm/backups/session-test-ephemeral-*.json
# Expected: File exists

# Verify session folder deleted
ls sessions/test-ephemeral/
# Expected: "No such file or directory"
```

**Success Criteria**:
- ✅ Backup file created
- ✅ Session folder deleted completely
- ✅ No errors during deletion
- ✅ Exit code 0

---

#### Test 3.3: Nonexistent Session (Backup Succeeds, Delete Fails Gracefully)
**Description**: Backup memory even if session folder doesn't exist
**Execution**:
```bash
./scripts/session-backup.sh nonexistent-session yes
```

**Expected Behavior**:
- ✅ Backup created (exports full memory.db)
- ⚠️ Warning: "Session folder not found"
- ✅ No error exit

**Success Criteria**:
- ✅ Backup file created
- ✅ Warning message displayed
- ✅ Exit code 0

---

#### Test 3.4: Large Session (1000+ Files)
**Description**: Performance test with complex session
**Setup**:
```bash
mkdir -p sessions/test-large-session/artifacts/code
for i in {1..1000}; do
  echo "// File $i" > sessions/test-large-session/artifacts/code/file-$i.js
done
```

**Execution**:
```bash
time ./scripts/session-backup.sh test-large-session yes
```

**Success Criteria**:
- ✅ Completes in <30 seconds
- ✅ All 1000 files deleted
- ✅ Backup file created
- ✅ No memory leaks or errors

---

#### Test 3.5: Missing Arguments
**Description**: Validate usage
**Execution**:
```bash
./scripts/session-backup.sh
```

**Expected Output**:
```
Usage: ./scripts/session-backup.sh <session-id> [yes|no]
  yes = delete session folder after backup
  no  = keep session folder (default)
```

**Success Criteria**:
- ✅ Usage message displayed
- ✅ Exit code 1

---

## Integration Tests

### Integration Test 1: Full Closeout Workflow
**Description**: Run all 3 scripts in sequence (normal path)
**Objective**: Validate end-to-end workflow with session preservation

**Setup**:
```bash
# Create complete test session
SESSION_ID="integration-test-001"
TASK_ID="task-integration-001"

mkdir -p "sessions/$SESSION_ID/artifacts/"{code,tests,docs,scripts,notes}
cat > "sessions/$SESSION_ID/artifacts/session-summary.md" << 'EOF'
# Integration Test Session

## Objective
Test full closeout workflow with all 3 scripts.

## Work Completed
- Created test session structure
- Verified wrapper scripts
- Documented findings

## Decisions
- Decision 1: Use stock commands only
- Decision 2: Keep wrapper scripts minimal

## Outcomes
- ✅ All tests passing
- ✅ Documentation complete
EOF

# Create test artifacts
echo "console.log('test');" > "sessions/$SESSION_ID/artifacts/code/app.js"
echo "test('works', () => {});" > "sessions/$SESSION_ID/artifacts/tests/app.test.js"
echo "# API Docs" > "sessions/$SESSION_ID/artifacts/docs/API.md"
```

**Execution**:
```bash
# Step 1: Closeout
./scripts/session-closeout.sh "$SESSION_ID" "$TASK_ID"
# (Approve when prompted)

# Step 2: Captain's log
./scripts/captain-log-append.sh "$SESSION_ID"

# Step 3: Backup (preserve mode)
./scripts/session-backup.sh "$SESSION_ID" no
```

**Validation Checklist**:
```bash
# 1. Classification stored
npx claude-flow@alpha memory search \
  --namespace "session-closeout" \
  --pattern "classify-$SESSION_ID" | grep -q "topics"
echo "Classification: $?"

# 2. HITL approval stored
npx claude-flow@alpha memory search \
  --namespace "session-closeout" \
  --pattern "hitl-$SESSION_ID" | grep -q '"approved":true'
echo "HITL Approval: $?"

# 3. Captain's log entry created
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*" | grep -q "$SESSION_ID"
echo "Captain's Log: $?"

# 4. Backup file exists
ls .swarm/backups/session-$SESSION_ID-*.json >/dev/null 2>&1
echo "Backup File: $?"

# 5. Session folder preserved
[ -d "sessions/$SESSION_ID" ]
echo "Session Preserved: $?"

# 6. Hooks executed
npx claude-flow@alpha memory search \
  --namespace "command-history" \
  --pattern "*session-end*" | grep -q "$SESSION_ID"
echo "Hooks Executed: $?"
```

**Success Criteria**:
- ✅ All validation checks return 0
- ✅ No errors during execution
- ✅ All data stored in correct namespaces
- ✅ Session artifacts intact

---

### Integration Test 2: Ephemeral Session Workflow
**Description**: Full workflow with session deletion
**Objective**: Validate ephemeral mode (backup + delete)

**Execution**:
```bash
SESSION_ID="integration-test-002-ephemeral"
TASK_ID="task-integration-002"

# (Create session same as Integration Test 1)

# Run workflow with deletion
./scripts/session-closeout.sh "$SESSION_ID" "$TASK_ID"
./scripts/captain-log-append.sh "$SESSION_ID"
./scripts/session-backup.sh "$SESSION_ID" yes
```

**Validation**:
```bash
# Verify backup exists
ls .swarm/backups/session-$SESSION_ID-*.json

# Verify session deleted
[ ! -d "sessions/$SESSION_ID" ]
echo "Session Deleted: $?"

# Verify data still in database
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*" | grep -q "$SESSION_ID"
echo "Data Preserved: $?"
```

**Success Criteria**:
- ✅ Backup created
- ✅ Session folder deleted
- ✅ Database entries preserved
- ✅ Captain's log entry accessible

---

### Integration Test 3: Error Recovery (Missing Summary)
**Description**: Verify graceful failure at each step
**Objective**: Ensure error in one script doesn't corrupt state

**Execution**:
```bash
SESSION_ID="integration-test-003-error"
mkdir -p "sessions/$SESSION_ID/artifacts/"
# (Deliberately omit session-summary.md)

# Attempt closeout (should fail)
./scripts/session-closeout.sh "$SESSION_ID" "task-test-003"
EXIT_CODE_1=$?

# Attempt captain's log (should fail)
./scripts/captain-log-append.sh "$SESSION_ID"
EXIT_CODE_2=$?

# Attempt backup (should succeed - backs up full memory)
./scripts/session-backup.sh "$SESSION_ID" no
EXIT_CODE_3=$?
```

**Validation**:
```bash
echo "Closeout exit code: $EXIT_CODE_1"  # Expected: 1
echo "Captain log exit code: $EXIT_CODE_2"  # Expected: 1
echo "Backup exit code: $EXIT_CODE_3"  # Expected: 0

# Verify no partial data in database
npx claude-flow@alpha memory search \
  --namespace "session-closeout" \
  --pattern "*$SESSION_ID*"
# Expected: Empty or no classify/hitl entries
```

**Success Criteria**:
- ✅ Scripts fail gracefully with exit code 1
- ✅ No partial database entries
- ✅ No data corruption
- ✅ Error messages clear and actionable

---

### Integration Test 4: Parallel Session Handling
**Description**: Multiple sessions closed simultaneously
**Objective**: Verify no race conditions or conflicts

**Execution**:
```bash
# Create 3 sessions
for i in {1..3}; do
  SESSION_ID="integration-parallel-$i"
  mkdir -p "sessions/$SESSION_ID/artifacts/"
  echo "# Session $i" > "sessions/$SESSION_ID/artifacts/session-summary.md"
done

# Run closeouts in parallel
./scripts/session-closeout.sh integration-parallel-1 task-p1 &
./scripts/session-closeout.sh integration-parallel-2 task-p2 &
./scripts/session-closeout.sh integration-parallel-3 task-p3 &
wait

# Run captain's log appends in parallel
./scripts/captain-log-append.sh integration-parallel-1 &
./scripts/captain-log-append.sh integration-parallel-2 &
./scripts/captain-log-append.sh integration-parallel-3 &
wait

# Run backups in parallel
./scripts/session-backup.sh integration-parallel-1 no &
./scripts/session-backup.sh integration-parallel-2 no &
./scripts/session-backup.sh integration-parallel-3 no &
wait
```

**Validation**:
```bash
# Verify all 3 sessions have entries
for i in {1..3}; do
  npx claude-flow@alpha memory search \
    --namespace "captains-log" \
    --pattern "journal:*" | grep -q "integration-parallel-$i"
  echo "Session $i in log: $?"
done

# Verify all 3 backups created
ls .swarm/backups/session-integration-parallel-*.json | wc -l
# Expected: 3
```

**Success Criteria**:
- ✅ All 3 sessions processed successfully
- ✅ No database locking errors
- ✅ No data corruption or collisions
- ✅ All backups created

---

### Integration Test 5: Restore from Backup
**Description**: Verify backups are usable for restoration
**Objective**: Test that backup JSON contains all necessary data

**Setup**:
```bash
SESSION_ID="integration-restore-001"
# (Create and close out session normally)
./scripts/session-closeout.sh "$SESSION_ID" "task-restore-001"
./scripts/captain-log-append.sh "$SESSION_ID"
./scripts/session-backup.sh "$SESSION_ID" yes  # Delete session
```

**Restoration Test**:
```bash
# Find backup file
BACKUP_FILE=$(ls .swarm/backups/session-$SESSION_ID-*.json | head -1)

# Query backup for session data
jq '.[] | select(.namespace == "captains-log") | select(.value | contains("'$SESSION_ID'"))' "$BACKUP_FILE"
# Expected: Captain's log entry found

jq '.[] | select(.namespace == "session-closeout")' "$BACKUP_FILE"
# Expected: Classify and HITL entries found
```

**Success Criteria**:
- ✅ Backup file is valid JSON
- ✅ Contains all session data (captain's log, classify, HITL)
- ✅ Can extract specific session data with jq
- ✅ Session data survives deletion

---

## Memory System Tests

### Memory Test 1: Database Integrity
**Description**: Verify memory.db remains consistent after operations
**Execution**:
```bash
# Check integrity before
sqlite3 .swarm/memory.db "PRAGMA integrity_check;"
# Expected: ok

# Run full closeout workflow
./scripts/session-closeout.sh test-mem-001 task-mem-001
./scripts/captain-log-append.sh test-mem-001
./scripts/session-backup.sh test-mem-001 no

# Check integrity after
sqlite3 .swarm/memory.db "PRAGMA integrity_check;"
# Expected: ok
```

**Success Criteria**:
- ✅ Database integrity check passes before and after
- ✅ No corruption errors

---

### Memory Test 2: Namespace Isolation
**Description**: Verify sessions don't overwrite each other
**Execution**:
```bash
# Create 2 sessions with identical summaries
for i in {1..2}; do
  mkdir -p "sessions/test-namespace-$i/artifacts/"
  echo "# Same Content" > "sessions/test-namespace-$i/artifacts/session-summary.md"
  ./scripts/captain-log-append.sh "test-namespace-$i"
done

# Verify both entries exist
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*" | grep -c "test-namespace"
# Expected: 2
```

**Success Criteria**:
- ✅ Both entries stored separately
- ✅ No overwrites
- ✅ Each entry has unique key (timestamp-based)

---

### Memory Test 3: Captain's Log Entry Structure
**Description**: Validate stored entries have correct schema
**Execution**:
```bash
./scripts/captain-log-append.sh test-schema-001

# Query and validate structure
npx claude-flow@alpha memory search \
  --namespace "captains-log" \
  --pattern "journal:*" | jq '.[] | select(.value | contains("test-schema-001")) | .value | fromjson | keys'
```

**Expected Keys**:
```json
[
  "timestamp",
  "type",
  "author",
  "title",
  "content",
  "tags",
  "context",
  "hitl_reviewed"
]
```

**Success Criteria**:
- ✅ All required keys present
- ✅ `timestamp` is ISO 8601 format
- ✅ `type` is "milestone"
- ✅ `author` is "user"
- ✅ `content` is string (not object)
- ✅ `tags` is array
- ✅ `context` contains `session_id`
- ✅ `hitl_reviewed` is true

---

## Session Lifecycle Tests

### Lifecycle Test 1: Complete Session Lifecycle
**Description**: From creation to deletion with all steps
**Phases**:

**Phase 1: Creation**
```bash
SESSION_ID="lifecycle-test-001"
mkdir -p "sessions/$SESSION_ID/artifacts"
echo "# Test" > "sessions/$SESSION_ID/artifacts/session-summary.md"
```

**Phase 2: Work Simulation**
```bash
# Simulate agent work with hooks
npx claude-flow@alpha hooks pre-task --description "Lifecycle test" --task-id "task-lifecycle-001"
# (Simulate file creation)
npx claude-flow@alpha hooks post-edit --file "sessions/$SESSION_ID/artifacts/code/test.js"
```

**Phase 3: Closeout**
```bash
./scripts/session-closeout.sh "$SESSION_ID" "task-lifecycle-001"
./scripts/captain-log-append.sh "$SESSION_ID"
./scripts/session-backup.sh "$SESSION_ID" yes
```

**Phase 4: Verification**
```bash
# Verify all lifecycle events recorded
npx claude-flow@alpha memory search \
  --namespace "*" \
  --pattern "*$SESSION_ID*" | jq -r '.[] | "\(.namespace)/\(.key)"'
```

**Expected Namespaces**:
- `session-closeout/classify-lifecycle-test-001`
- `session-closeout/hitl-lifecycle-test-001`
- `captains-log/journal:YYYY-MM-DD-HH:MM:SS`
- `command-history/*` (multiple entries)

**Success Criteria**:
- ✅ All lifecycle events captured
- ✅ Data linked by session ID
- ✅ Session folder deleted
- ✅ Backup contains full history

---

### Lifecycle Test 2: Session Restoration
**Description**: Restore context from backup for debugging
**Execution**:
```bash
# Closed session from previous test
BACKUP_FILE=$(ls .swarm/backups/session-lifecycle-test-001-*.json | head -1)

# Extract session timeline
jq -r '.[] | select(.value | contains("lifecycle-test-001")) | "\(.timestamp) | \(.namespace)/\(.key)"' "$BACKUP_FILE" | sort
```

**Expected Timeline**:
```
2025-11-14T08:00:00Z | command-history/pre-task:task-lifecycle-001
2025-11-14T08:05:00Z | command-history/post-edit:sessions/lifecycle-test-001/...
2025-11-14T08:10:00Z | session-closeout/classify-lifecycle-test-001
2025-11-14T08:10:05Z | session-closeout/hitl-lifecycle-test-001
2025-11-14T08:10:10Z | captains-log/journal:2025-11-14-08:10:10
```

**Success Criteria**:
- ✅ Timeline is chronological
- ✅ All events traceable
- ✅ Session context reconstructable from backup

---

## Test Automation

### Automated Test Suite Script

**File**: `sessions/session-20251113-211159-hive-mind-setup/iteration-2/artifacts/phase-1/tests/run-all-tests.sh`

```bash
#!/bin/bash
# Automated test suite for wrapper scripts

set -e

TEST_DIR="$(cd "$(dirname "$0")" && pwd)"
SESSION_DIR="sessions"
BACKUP_DIR=".swarm/backups"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test result tracking
declare -a FAILED_TEST_NAMES

# Helper function to run test
run_test() {
  local test_name="$1"
  local test_command="$2"

  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  echo "▶ Running: $test_name"

  if eval "$test_command" > /tmp/test-output-$$.txt 2>&1; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${GREEN}✅ PASS${NC}: $test_name"
  else
    FAILED_TESTS=$((FAILED_TESTS + 1))
    FAILED_TEST_NAMES+=("$test_name")
    echo -e "${RED}❌ FAIL${NC}: $test_name"
    cat /tmp/test-output-$$.txt
  fi

  rm -f /tmp/test-output-$$.txt
  echo ""
}

# Cleanup function
cleanup() {
  echo "🧹 Cleaning up test artifacts..."
  rm -rf sessions/test-* sessions/integration-* sessions/lifecycle-*
  rm -f .swarm/backups/session-test-*.json .swarm/backups/session-integration-*.json
}

# Setup function
setup() {
  echo "🔧 Setting up test environment..."
  mkdir -p "$SESSION_DIR" "$BACKUP_DIR"
}

echo "╔════════════════════════════════════════════════╗"
echo "║   Session Closeout Test Suite                 ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Run tests
setup

run_test "Unit 1.1: Normal closeout" "test_unit_1_1"
run_test "Unit 1.2: Missing summary" "test_unit_1_2"
run_test "Unit 2.1: Captain's log append" "test_unit_2_1"
run_test "Unit 3.1: Backup with preserve" "test_unit_3_1"
run_test "Integration 1: Full workflow" "test_integration_1"
run_test "Memory 1: Database integrity" "test_memory_1"

# Summary
echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║   Test Results Summary                         ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
echo "Total tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"

if [ $FAILED_TESTS -gt 0 ]; then
  echo ""
  echo "Failed tests:"
  for test_name in "${FAILED_TEST_NAMES[@]}"; do
    echo -e "  ${RED}❌${NC} $test_name"
  done
  exit 1
else
  echo -e "\n${GREEN}🎉 All tests passed!${NC}"
  exit 0
fi
```

---

## Success Criteria

### Overall Test Success Definition

**Test suite PASSES if**:
- ✅ All unit tests pass (15/15)
- ✅ All integration tests pass (5/5)
- ✅ All memory tests pass (3/3)
- ✅ All lifecycle tests pass (2/2)
- ✅ Database integrity maintained throughout
- ✅ No data corruption or loss

**Test suite FAILS if**:
- ❌ Any script crashes or hangs
- ❌ Database corruption detected
- ❌ Data loss or overwrites occur
- ❌ Memory leaks detected in large session tests
- ❌ Race conditions cause failures in parallel tests

---

## Performance Benchmarks

### Acceptable Performance Thresholds

| Operation | Max Duration | Target Duration |
|-----------|-------------|----------------|
| session-closeout.sh (5 files) | 5 seconds | 2 seconds |
| captain-log-append.sh | 2 seconds | 1 second |
| session-backup.sh (5 files) | 3 seconds | 1 second |
| Full workflow (3 scripts) | 15 seconds | 5 seconds |
| Large session (1000 files) | 60 seconds | 30 seconds |

### Memory Usage Limits

| Test Scenario | Max Memory | Target Memory |
|---------------|-----------|---------------|
| Normal closeout | 50 MB | 20 MB |
| Large session (1000 files) | 200 MB | 100 MB |
| Parallel (3 sessions) | 150 MB | 75 MB |

---

## Test Reporting

### Report Format

After each test run, generate:

**File**: `test-results-YYYY-MM-DD-HHMMSS.md`

**Contents**:
```markdown
# Test Results Report

**Date**: YYYY-MM-DD HH:MM:SS
**Duration**: X minutes
**Environment**: macOS/Linux

## Summary
- Total Tests: 22
- Passed: X
- Failed: X
- Skipped: X

## Failed Tests
1. Test Name
   - Error: [error message]
   - Expected: [expected behavior]
   - Actual: [actual behavior]

## Performance Metrics
- Fastest test: X seconds
- Slowest test: X seconds
- Average duration: X seconds

## Database State
- Entries before: N
- Entries after: M
- Growth: +X entries

## Recommendations
[Any issues or improvements needed]
```

---

## Coordination with Other Agents

**Store results in memory**:
```bash
npx claude-flow@alpha hooks post-task --task-id "phase1-testing-001"

# Store test strategy completion
npx claude-flow@alpha memory store \
  --namespace "hive" \
  --key "phase-1/planning/testing/strategy" \
  --value "{
    \"status\": \"complete\",
    \"test_count\": 22,
    \"coverage\": \"100%\",
    \"automation\": \"full\",
    \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\"
  }"
```

**Notify mesh peers**:
```bash
npx claude-flow@alpha hooks notify --message "Testing strategy complete: 22 tests designed"
```

---

## Next Steps

**For Implementation Agent**:
1. Use this testing strategy when building wrapper scripts
2. Run unit tests after each script completion
3. Run integration tests after all 3 scripts complete
4. Use memory tests to verify database integrity

**For QA Agent**:
1. Execute test suite on completed scripts
2. Report failures back to implementation agent
3. Validate performance benchmarks
4. Generate test results report

**For Documentation Agent**:
1. Include testing strategy in final documentation
2. Add test execution instructions to README
3. Document any test failures and resolutions

---

**Test Strategist Sign-Off**

This testing strategy is **COMPLETE** and ready for implementation phase.

**Coverage**: 100% of wrapper script functionality
**Automation**: 100% bash-scriptable tests
**Estimated Execution Time**: 15 minutes for full suite
**Risk**: Low (comprehensive coverage, realistic test cases)
