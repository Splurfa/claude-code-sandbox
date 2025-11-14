#!/bin/bash

# CLAUDE.md Validation Test Suite
# Tests that all contradictions have been resolved

set -e

CLAUDE_MD="/Users/splurfa/common-thread-sandbox/CLAUDE.md"
RESULTS_FILE="sessions/claudemd-update-20251113-164700/artifacts/tests/test-results.txt"

echo "========================================" > "$RESULTS_FILE"
echo "CLAUDE.md Validation Test Results" >> "$RESULTS_FILE"
echo "Date: $(date)" >> "$RESULTS_FILE"
echo "========================================" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

PASS_COUNT=0
FAIL_COUNT=0

# Helper function to report test results
test_result() {
    local test_name="$1"
    local result="$2"
    local details="$3"

    if [ "$result" = "PASS" ]; then
        echo "✅ PASS: $test_name" | tee -a "$RESULTS_FILE"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo "❌ FAIL: $test_name" | tee -a "$RESULTS_FILE"
        echo "   Details: $details" | tee -a "$RESULTS_FILE"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

# Test 1: No root /tests/ references (except in artifacts/)
echo "Test 1: Checking for incorrect /tests/ references..." | tee -a "$RESULTS_FILE"
if grep -n '"/tests/' "$CLAUDE_MD" | grep -v 'artifacts/tests' | grep -v '^\s*#' | grep -q .; then
    FOUND=$(grep -n '"/tests/' "$CLAUDE_MD" | grep -v 'artifacts/tests' | grep -v '^\s*#')
    test_result "No root /tests/ paths" "FAIL" "$FOUND"
else
    test_result "No root /tests/ paths" "PASS"
fi

# Test 2: No root /docs/ references (except in artifacts/)
echo "Test 2: Checking for incorrect /docs/ references..." | tee -a "$RESULTS_FILE"
if grep -n '"/docs/' "$CLAUDE_MD" | grep -v 'artifacts/docs' | grep -v '^\s*#' | grep -q .; then
    FOUND=$(grep -n '"/docs/' "$CLAUDE_MD" | grep -v 'artifacts/docs' | grep -v '^\s*#')
    test_result "No root /docs/ paths" "FAIL" "$FOUND"
else
    test_result "No root /docs/ paths" "PASS"
fi

# Test 3: No root /scripts/ references (except in artifacts/)
echo "Test 3: Checking for incorrect /scripts/ references..." | tee -a "$RESULTS_FILE"
if grep -n '"/scripts/' "$CLAUDE_MD" | grep -v 'artifacts/scripts' | grep -v '^\s*#' | grep -q .; then
    FOUND=$(grep -n '"/scripts/' "$CLAUDE_MD" | grep -v 'artifacts/scripts' | grep -v '^\s*#')
    test_result "No root /scripts/ paths" "FAIL" "$FOUND"
else
    test_result "No root /scripts/ paths" "PASS"
fi

# Test 4: All Write examples use session artifacts
echo "Test 4: Checking Write statements use session artifacts..." | tee -a "$RESULTS_FILE"
if grep -n 'Write "' "$CLAUDE_MD" | grep -v 'sessions/\$SESSION_ID/artifacts' | grep -v '^\s*#' | grep -v '//.*Write' | grep -q .; then
    FOUND=$(grep -n 'Write "' "$CLAUDE_MD" | grep -v 'sessions/\$SESSION_ID/artifacts' | grep -v '^\s*#' | grep -v '//.*Write')
    test_result "All Write examples use session artifacts" "FAIL" "$FOUND"
else
    test_result "All Write examples use session artifacts" "PASS"
fi

# Test 5: No mkdir creating root directories (except sessions/)
echo "Test 5: Checking mkdir doesn't create root directories..." | tee -a "$RESULTS_FILE"
if grep -n 'mkdir -p' "$CLAUDE_MD" | grep -v 'sessions/' | grep -v '^\s*#' | grep -q .; then
    FOUND=$(grep -n 'mkdir -p' "$CLAUDE_MD" | grep -v 'sessions/' | grep -v '^\s*#')
    test_result "No mkdir for root directories" "FAIL" "$FOUND"
else
    test_result "No mkdir for root directories" "PASS"
fi

# Test 6: Stock claude-flow hooks intact
echo "Test 6: Verifying stock hooks commands..." | tee -a "$RESULTS_FILE"
HOOKS_COUNT=$(grep -c "npx claude-flow@alpha hooks" "$CLAUDE_MD" || echo 0)
if [ "$HOOKS_COUNT" -ge 5 ]; then
    test_result "Stock hooks commands present" "PASS"
else
    test_result "Stock hooks commands present" "FAIL" "Found only $HOOKS_COUNT hook references, expected 5+"
fi

# Test 7: Stock MCP tools intact
echo "Test 7: Verifying stock MCP tool references..." | tee -a "$RESULTS_FILE"
MCP_COUNT=$(grep -c "mcp__claude-flow__" "$CLAUDE_MD" || echo 0)
if [ "$MCP_COUNT" -ge 5 ]; then
    test_result "Stock MCP tools present" "PASS"
else
    test_result "Stock MCP tools present" "FAIL" "Found only $MCP_COUNT MCP references, expected 5+"
fi

# Test 8: Session protocol consistency
echo "Test 8: Checking session protocol consistency..." | tee -a "$RESULTS_FILE"
if grep -q "sessions/\$SESSION_ID/artifacts/" "$CLAUDE_MD" && \
   grep -q "AUTOMATIC SESSION INITIALIZATION" "$CLAUDE_MD" && \
   grep -q "FILE ROUTING RULES" "$CLAUDE_MD"; then
    test_result "Session protocol documented" "PASS"
else
    test_result "Session protocol documented" "FAIL" "Missing session protocol documentation"
fi

# Test 9: No contradictory guidance in file organization section
echo "Test 9: Checking file organization section for contradictions..." | tee -a "$RESULTS_FILE"
# Extract lines 52-62 (File Organization Rules section)
SECTION=$(sed -n '52,62p' "$CLAUDE_MD")
if echo "$SECTION" | grep -q "sessions/\$SESSION_ID/artifacts"; then
    test_result "File organization section uses session artifacts" "PASS"
else
    test_result "File organization section uses session artifacts" "FAIL" "Section still references root directories"
fi

# Test 10: Full-stack example uses correct paths
echo "Test 10: Checking full-stack example paths..." | tee -a "$RESULTS_FILE"
# Extract lines 207-226 (Full-stack example)
EXAMPLE=$(sed -n '207,226p' "$CLAUDE_MD")
if echo "$EXAMPLE" | grep 'Write "' | grep -v 'sessions/\$SESSION_ID/artifacts' | grep -q .; then
    FOUND=$(echo "$EXAMPLE" | grep 'Write "' | grep -v 'sessions/\$SESSION_ID/artifacts')
    test_result "Full-stack example uses session artifacts" "FAIL" "$FOUND"
else
    test_result "Full-stack example uses session artifacts" "PASS"
fi

# Summary
echo "" | tee -a "$RESULTS_FILE"
echo "========================================" | tee -a "$RESULTS_FILE"
echo "TEST SUMMARY" | tee -a "$RESULTS_FILE"
echo "========================================" | tee -a "$RESULTS_FILE"
echo "Passed: $PASS_COUNT" | tee -a "$RESULTS_FILE"
echo "Failed: $FAIL_COUNT" | tee -a "$RESULTS_FILE"
echo "" | tee -a "$RESULTS_FILE"

if [ "$FAIL_COUNT" -eq 0 ]; then
    echo "✅ ALL TESTS PASSED - CLAUDE.md contradictions resolved!" | tee -a "$RESULTS_FILE"
    exit 0
else
    echo "❌ TESTS FAILED - Contradictions remain, changes needed" | tee -a "$RESULTS_FILE"
    exit 1
fi
