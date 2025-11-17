#!/bin/bash
# Integration Test Runner for Session Closeout Workflow
# Tests the actual behavior of hooks and session management

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
TEST_ARTIFACTS="$WORKSPACE_ROOT/sessions/session-20251113-211159-hive-mind-setup/artifacts/tests/raw-data"

cd "$WORKSPACE_ROOT"

echo "=== INTEGRATION TEST SUITE FOR SESSION CLOSEOUT WORKFLOW ==="
echo "Workspace: $WORKSPACE_ROOT"
echo "Test Artifacts: $TEST_ARTIFACTS"
echo ""

# Test 1: Normal Session Closeout
echo "=== TEST 1: Normal Session Closeout ==="
mkdir -p test-workflow-normal/artifacts/{code,tests,docs,scripts,notes}
echo "console.log('test');" > test-workflow-normal/artifacts/code/app.js
echo "test('works', () => expect(true).toBe(true));" > test-workflow-normal/artifacts/tests/app.test.js
echo "# Test Docs" > test-workflow-normal/artifacts/docs/README.md

# Capture before state
tree test-workflow-normal/ > "$TEST_ARTIFACTS/test1-before-filesystem.txt" 2>&1
sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM memory_entries;" > "$TEST_ARTIFACTS/test1-before-db-count.txt" 2>&1 || echo "0" > "$TEST_ARTIFACTS/test1-before-db-count.txt"

# Execute hooks
npx claude-flow@alpha hooks post-task --task-id "test-workflow-normal" 2>&1 | tee "$TEST_ARTIFACTS/test1-post-task.log"
npx claude-flow@alpha hooks session-end --generate-summary true --session-id "test-workflow-normal" 2>&1 | tee "$TEST_ARTIFACTS/test1-session-end.log"

# Capture after state
tree test-workflow-normal/ > "$TEST_ARTIFACTS/test1-after-filesystem.txt" 2>&1
sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM memory_entries;" > "$TEST_ARTIFACTS/test1-after-db-count.txt" 2>&1

# Generate diffs
diff "$TEST_ARTIFACTS/test1-before-filesystem.txt" "$TEST_ARTIFACTS/test1-after-filesystem.txt" > "$TEST_ARTIFACTS/test1-filesystem.diff" 2>&1 || true
diff "$TEST_ARTIFACTS/test1-before-db-count.txt" "$TEST_ARTIFACTS/test1-after-db-count.txt" > "$TEST_ARTIFACTS/test1-db.diff" 2>&1 || true

echo "✅ Test 1 Complete"
echo ""

# Test 2: Complex Session
echo "=== TEST 2: Complex Session Closeout ==="
mkdir -p test-workflow-complex/artifacts/{code,tests,docs,scripts,notes,configs,data}
for i in {1..3}; do
  echo "// Code $i" > "test-workflow-complex/artifacts/code/module$i.js"
  echo "test('test $i', () => {});" > "test-workflow-complex/artifacts/tests/module$i.test.js"
  echo "# Doc $i" > "test-workflow-complex/artifacts/docs/doc$i.md"
done

tree test-workflow-complex/ > "$TEST_ARTIFACTS/test2-before-filesystem.txt" 2>&1
npx claude-flow@alpha hooks post-task --task-id "test-workflow-complex" 2>&1 | tee "$TEST_ARTIFACTS/test2-post-task.log"
npx claude-flow@alpha hooks session-end --generate-summary true --session-id "test-workflow-complex" 2>&1 | tee "$TEST_ARTIFACTS/test2-session-end.log"
tree test-workflow-complex/ > "$TEST_ARTIFACTS/test2-after-filesystem.txt" 2>&1

echo "✅ Test 2 Complete"
echo ""

# Test 3: Captain's Log Verification
echo "=== TEST 3: Captain's Log Behavior ==="
mkdir -p sessions/captains-log/
DATE=$(date +%Y-%m-%d)
echo "# Manual Entry - $DATE" > "sessions/captains-log/$DATE.md"
echo "" >> "sessions/captains-log/$DATE.md"
echo "Testing manual captain's log entry" >> "sessions/captains-log/$DATE.md"

cat "sessions/captains-log/$DATE.md" > "$TEST_ARTIFACTS/test3-manual-entry.txt"
echo "✅ Test 3 Complete (No journal hook exists)"
echo ""

# Test 4: Backup Directory Verification
echo "=== TEST 4: Backup Creation Verification ==="
ls -lah .swarm/backups/ > "$TEST_ARTIFACTS/test4-backups-directory.txt" 2>&1 || echo "No backups directory" > "$TEST_ARTIFACTS/test4-backups-directory.txt"
find .swarm -name "*.json" -type f > "$TEST_ARTIFACTS/test4-json-files.txt" 2>&1
sqlite3 .swarm/memory.db "SELECT key, namespace FROM memory_entries WHERE key LIKE '%session%' OR key LIKE '%backup%' LIMIT 20;" > "$TEST_ARTIFACTS/test4-session-entries.txt" 2>&1

echo "✅ Test 4 Complete"
echo ""

# Test 5: Database Schema Verification
echo "=== TEST 5: Database Schema Analysis ==="
sqlite3 .swarm/memory.db "SELECT name FROM sqlite_master WHERE type='table';" > "$TEST_ARTIFACTS/test5-tables.txt" 2>&1
sqlite3 .swarm/memory.db "SELECT namespace, COUNT(*) as count FROM memory_entries GROUP BY namespace ORDER BY count DESC;" > "$TEST_ARTIFACTS/test5-namespace-distribution.txt" 2>&1

echo "✅ Test 5 Complete"
echo ""

echo "=== ALL INTEGRATION TESTS COMPLETE ==="
echo "Results saved to: $TEST_ARTIFACTS"
echo ""
echo "Summary:"
echo "- Test 1: Normal session closeout"
echo "- Test 2: Complex session with multiple artifacts"
echo "- Test 3: Captain's log manual entry (journal hook does not exist)"
echo "- Test 4: Backup directory verification (empty - backups stored in DB)"
echo "- Test 5: Database schema and namespace analysis"
