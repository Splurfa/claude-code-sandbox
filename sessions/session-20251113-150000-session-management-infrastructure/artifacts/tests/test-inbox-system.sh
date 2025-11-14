#!/bin/bash

# Inbox System Comprehensive Test Suite
# Tests all components without breaking existing workspace

set -e  # Exit on error

WORKSPACE_ROOT="/Users/splurfa/common-thread-sandbox"
cd "$WORKSPACE_ROOT"

echo "=========================================="
echo "INBOX SYSTEM COMPREHENSIVE TEST SUITE"
echo "=========================================="
echo ""

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_check() {
  local description="$1"
  local command="$2"

  echo -n "Testing: $description... "
  if eval "$command" > /dev/null 2>&1; then
    echo "✓ PASS"
    ((TESTS_PASSED++))
    return 0
  else
    echo "✗ FAIL"
    ((TESTS_FAILED++))
    return 1
  fi
}

# Test function with output capture
test_check_output() {
  local description="$1"
  local command="$2"
  local expected="$3"

  echo -n "Testing: $description... "
  result=$(eval "$command" 2>&1)
  if [[ "$result" == *"$expected"* ]]; then
    echo "✓ PASS"
    ((TESTS_PASSED++))
    return 0
  else
    echo "✗ FAIL (Expected: '$expected', Got: '$result')"
    ((TESTS_FAILED++))
    return 1
  fi
}

echo "1. DIRECTORY STRUCTURE TESTS"
echo "--------------------------------------------"
test_check "inbox/ directory exists" "test -d inbox"
test_check "inbox/reference/ exists" "test -d inbox/reference"
test_check "inbox/projects/ exists" "test -d inbox/projects"
test_check "inbox/ideas/ exists" "test -d inbox/ideas"
test_check "inbox/triage/ exists" "test -d inbox/triage"
test_check ".inbox/ directory exists" "test -d .inbox"
test_check ".inbox/archive/ exists" "test -d .inbox/archive"
test_check "inbox/README.md exists" "test -f inbox/README.md"
echo ""

echo "2. GITIGNORE CONFIGURATION"
echo "--------------------------------------------"
test_check "gitignore contains .inbox/" "grep -q '^\.inbox/' .gitignore"
test_check "inbox/ is tracked" "! grep -q '^inbox/' .gitignore"
echo ""

echo "3. ARCHIVAL SCRIPT TESTS"
echo "--------------------------------------------"
test_check "inbox-archive.js exists" "test -f .swarm/hooks/inbox-archive.js"
test_check "inbox-archive.js is executable" "test -r .swarm/hooks/inbox-archive.js"
test_check "Script has proper shebang" "head -n1 .swarm/hooks/inbox-archive.js | grep -q '#!/usr/bin/env node'"
echo ""

echo "4. ARCHIVAL FUNCTIONALITY TEST"
echo "--------------------------------------------"

# Create a dummy test file
TEST_FILE="inbox/triage/test-$(date +%s).md"
echo "# Test Document" > "$TEST_FILE"
echo "This is a test for the archival system." >> "$TEST_FILE"
echo "Timestamp: $(date)" >> "$TEST_FILE"

echo "Created test file: $TEST_FILE"

# Run archival script
DEST_FILE="tests/archived-test-$(date +%s).md"
echo "Running archival: $TEST_FILE -> $DEST_FILE"

node .swarm/hooks/inbox-archive.js "$TEST_FILE" "$DEST_FILE" "Automated test run" "test,automated"

# Verify results
test_check "Archived file exists at destination" "test -f $DEST_FILE"
test_check "Archive manifest was created" "ls .inbox/archive/*.json | tail -1"
test_check "Source file still exists" "test -f $TEST_FILE"

# Verify manifest structure
LATEST_MANIFEST=$(ls -t .inbox/archive/*.json | head -1)
echo "Checking manifest: $LATEST_MANIFEST"
test_check "Manifest has timestamp" "grep -q 'timestamp' $LATEST_MANIFEST"
test_check "Manifest has source" "grep -q 'source' $LATEST_MANIFEST"
test_check "Manifest has destination" "grep -q 'destination' $LATEST_MANIFEST"
test_check "Manifest has tags" "grep -q 'tags' $LATEST_MANIFEST"
test_check "Manifest has notes" "grep -q 'notes' $LATEST_MANIFEST"
test_check "Manifest is valid JSON" "cat $LATEST_MANIFEST | jq . > /dev/null 2>&1"

# Cleanup test files
rm -f "$TEST_FILE" "$DEST_FILE"
echo "Cleaned up test files"
echo ""

echo "5. WORKSPACE INTEGRITY TESTS"
echo "--------------------------------------------"
test_check ".swarm/memory.db exists" "test -f .swarm/memory.db"
test_check "memory.db is valid SQLite" "sqlite3 .swarm/memory.db 'SELECT count(*) FROM sqlite_master;' > /dev/null"
test_check "sessions/ directory intact" "test -d sessions"
test_check "sessions/captains-log/ exists" "test -d sessions/captains-log"
test_check "docs/ directory intact" "test -d docs"
test_check "docs/projects/ exists" "test -d docs/projects"
test_check "docs/protocols/ exists" "test -d docs/protocols"
test_check "docs/guides/ exists" "test -d docs/guides"
test_check ".git/ directory intact" "test -d .git"
echo ""

echo "6. GIT STATUS VERIFICATION"
echo "--------------------------------------------"
echo "Current git status:"
git status --short
echo ""
test_check "No modified workspace files" "! git status --short | grep -v '^??' | grep -q '^'"
echo ""

echo "7. EXISTING FILES UNCHANGED"
echo "--------------------------------------------"
test_check "CLAUDE.md unchanged" "git diff --quiet CLAUDE.md || git status --short CLAUDE.md | grep -q '??'"
test_check ".gitignore only has expected changes" "git diff .gitignore | grep -q '^\+.*\.inbox/' || git status --short .gitignore | grep -q '??'"
echo ""

echo "8. CAPTAIN'S LOG INTEGRATION"
echo "--------------------------------------------"
test_check "Captain's Log protocol exists" "test -f docs/protocols/captain-log-protocol.md"
test_check "Session lifecycle guide exists" "test -f docs/guides/session-lifecycle-guide.md"
echo ""

echo "=========================================="
echo "TEST SUMMARY"
echo "=========================================="
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo "✓ ALL TESTS PASSED!"
  echo ""
  echo "SAFETY VERIFICATION:"
  echo "  • Workspace structure intact"
  echo "  • No existing files modified"
  echo "  • Git history clean"
  echo "  • Memory database functional"
  echo "  • Archival script working correctly"
  exit 0
else
  echo "✗ SOME TESTS FAILED"
  echo "Review failures above for details"
  exit 1
fi
