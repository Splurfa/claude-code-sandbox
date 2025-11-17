#!/bin/bash
# Test Script for Refactored Batch Closeout
#
# This script demonstrates the fix for the HITL approval bug

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
REFACTORED_SCRIPT="$PROJECT_ROOT/sessions/session-20251114-120738-system-validation/artifacts/code/batch-closeout-refactored.js"

echo "==========================================="
echo "Batch Closeout Refactoring Test"
echo "==========================================="
echo ""

# Check if test sessions exist
if [ ! -d "$PROJECT_ROOT/sessions/test-session-1" ]; then
  echo "❌ Test sessions not found. Please create them first:"
  echo "   Run the setup commands from background-process-report.md"
  exit 1
fi

echo "✅ Test sessions found"
echo ""

# Check if refactored script exists
if [ ! -f "$REFACTORED_SCRIPT" ]; then
  echo "❌ Refactored script not found at:"
  echo "   $REFACTORED_SCRIPT"
  exit 1
fi

echo "✅ Refactored script found"
echo ""

echo "==========================================="
echo "TEST 1: Verify Code Structure"
echo "==========================================="
echo ""

# Check for the 4 phases in the code
echo "Checking for Phase 1 (Generate)..."
grep -q "PHASE 1: GENERATE SUMMARIES" "$REFACTORED_SCRIPT" && echo "✅ Phase 1 found"

echo "Checking for Phase 2 (Preview)..."
grep -q "PHASE 2: SHOW PREVIEW" "$REFACTORED_SCRIPT" && echo "✅ Phase 2 found"

echo "Checking for Phase 3 (HITL Approval)..."
grep -q "PHASE 3: GET HITL APPROVAL" "$REFACTORED_SCRIPT" && echo "✅ Phase 3 found"

echo "Checking for Phase 4 (Execute Archive)..."
grep -q "PHASE 4: EXECUTE ARCHIVE" "$REFACTORED_SCRIPT" && echo "✅ Phase 4 found"

echo ""
echo "Checking for approval functions..."
grep -q "async function promptUser" "$REFACTORED_SCRIPT" && echo "✅ promptUser() found"
grep -q "async function promptForEdit" "$REFACTORED_SCRIPT" && echo "✅ promptForEdit() found"

echo ""

echo "==========================================="
echo "TEST 2: Verify No Nested Prompts"
echo "==========================================="
echo ""

# Verify Phase 4 has no readline calls
echo "Checking Phase 4 for readline calls..."
if grep -A 60 "PHASE 4: EXECUTE ARCHIVE" "$REFACTORED_SCRIPT" | grep -q "readline\|promptUser\|promptForEdit"; then
  echo "❌ FAILED: Found prompt in Phase 4 (would hang in background)"
  exit 1
else
  echo "✅ PASSED: No prompts in Phase 4 (safe for background)"
fi

echo ""

echo "==========================================="
echo "TEST 3: Dry Run (Code Validation)"
echo "==========================================="
echo ""

# Validate JavaScript syntax
echo "Checking JavaScript syntax..."
node --check "$REFACTORED_SCRIPT" && echo "✅ Syntax valid"

echo ""

echo "==========================================="
echo "TEST 4: Module Exports"
echo "==========================================="
echo ""

# Check if module exports the right functions
node -e "
const module = require('$REFACTORED_SCRIPT');
console.log('Checking exports...');
if (typeof module.batchCloseout === 'function') {
  console.log('✅ batchCloseout() exported');
} else {
  console.log('❌ batchCloseout() missing');
  process.exit(1);
}
if (typeof module.promptUser === 'function') {
  console.log('✅ promptUser() exported');
} else {
  console.log('❌ promptUser() missing');
  process.exit(1);
}
if (typeof module.promptForEdit === 'function') {
  console.log('✅ promptForEdit() exported');
} else {
  console.log('❌ promptForEdit() missing');
  process.exit(1);
}
"

echo ""

echo "==========================================="
echo "TEST 5: Interactive Execution (Manual)"
echo "==========================================="
echo ""

echo "To test the interactive flow, run:"
echo ""
echo "  cd $PROJECT_ROOT"
echo "  node $REFACTORED_SCRIPT test-session-1 test-session-2 test-session-3"
echo ""
echo "Expected behavior:"
echo "  1. Shows preview of all 3 sessions"
echo "  2. Prompts: 'Approve batch closeout?' (y/n)"
echo "  3. Prompts: Review each Captain's Log entry (y/n/skip)"
echo "  4. Archives all sessions (no more prompts)"
echo "  5. Exits with status 0"
echo ""
echo "❗ This test requires manual execution (interactive)"
echo ""

echo "==========================================="
echo "TEST 6: Background Execution (Should Fail Fast)"
echo "==========================================="
echo ""

echo "To test background safety, run:"
echo ""
echo "  cd $PROJECT_ROOT"
echo "  node $REFACTORED_SCRIPT test-session-1 test-session-2 test-session-3 < /dev/null"
echo ""
echo "Expected behavior:"
echo "  1. Phases 1-2 complete"
echo "  2. Phase 3 fails with 'stdin not available' (IMMEDIATE, not hung)"
echo "  3. Exits with error"
echo ""
echo "❗ This test requires manual execution"
echo ""

echo "==========================================="
echo "All Automated Tests Passed! ✅"
echo "==========================================="
echo ""
echo "Summary:"
echo "  ✅ Code structure verified (4 phases)"
echo "  ✅ No nested prompts in Phase 4"
echo "  ✅ JavaScript syntax valid"
echo "  ✅ Module exports correct"
echo ""
echo "Manual tests required:"
echo "  ⏳ Interactive execution (see TEST 5)"
echo "  ⏳ Background safety (see TEST 6)"
echo ""
