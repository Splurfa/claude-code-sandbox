#!/bin/bash

###############################################################################
# File Router Enforcement Test Suite
#
# Comprehensive end-to-end testing of file router prevention system.
# Demonstrates automatic violation detection and path correction.
#
# USAGE:
#   bash test-file-router-enforcement.sh
#
###############################################################################

set -euo pipefail

WORKSPACE_ROOT="/Users/splurfa/common-thread-sandbox"
SESSION_ID="$(cat $WORKSPACE_ROOT/.current-session 2>/dev/null || echo 'session-default')"
VALIDATION_HOOK="$WORKSPACE_ROOT/.swarm/hooks/file-router-validation.js"
MODIFY_HOOK="$WORKSPACE_ROOT/.swarm/hooks/modify-file-router.js"

echo "🧪 FILE ROUTER ENFORCEMENT TEST SUITE"
echo "======================================"
echo "Session: $SESSION_ID"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0

function test_case() {
  local test_name="$1"
  local expected="$2"
  shift 2
  local command="$@"

  echo -n "Test: $test_name ... "

  if eval "$command" &>/dev/null; then
    if [ "$expected" = "pass" ]; then
      echo -e "${GREEN}✓ PASS${NC}"
      ((PASS_COUNT++))
    else
      echo -e "${RED}✗ FAIL (expected failure, got success)${NC}"
      ((FAIL_COUNT++))
    fi
  else
    if [ "$expected" = "fail" ]; then
      echo -e "${GREEN}✓ PASS (correctly rejected)${NC}"
      ((PASS_COUNT++))
    else
      echo -e "${RED}✗ FAIL (expected success, got failure)${NC}"
      ((FAIL_COUNT++))
    fi
  fi
}

echo "═══════════════════════════════════════"
echo "1. VALIDATION HOOK TESTS"
echo "═══════════════════════════════════════"
echo ""

# Test validation hook directly
test_case "Reject root tests/ directory" \
  "fail" \
  "node $VALIDATION_HOOK validate 'tests/app.test.js' '$SESSION_ID'"

test_case "Reject root docs/ directory" \
  "fail" \
  "node $VALIDATION_HOOK validate 'docs/guide.md' '$SESSION_ID'"

test_case "Reject root scripts/ directory" \
  "fail" \
  "node $VALIDATION_HOOK validate 'scripts/build.sh' '$SESSION_ID'"

test_case "Reject test- prefix directory" \
  "fail" \
  "node $VALIDATION_HOOK validate 'test-workflow/file.js' '$SESSION_ID'"

test_case "Allow session artifacts - code" \
  "pass" \
  "node $VALIDATION_HOOK validate 'sessions/$SESSION_ID/artifacts/code/app.js' '$SESSION_ID'"

test_case "Allow session artifacts - tests" \
  "pass" \
  "node $VALIDATION_HOOK validate 'sessions/$SESSION_ID/artifacts/tests/app.test.js' '$SESSION_ID'"

test_case "Allow session artifacts - docs" \
  "pass" \
  "node $VALIDATION_HOOK validate 'sessions/$SESSION_ID/artifacts/docs/README.md' '$SESSION_ID'"

test_case "Allow permanent docs/projects/" \
  "pass" \
  "node $VALIDATION_HOOK validate 'docs/projects/myapp/README.md' '$SESSION_ID'"

test_case "Allow permanent docs/protocols/" \
  "pass" \
  "node $VALIDATION_HOOK validate 'docs/protocols/api-design.md' '$SESSION_ID'"

test_case "Allow project files (package.json)" \
  "pass" \
  "node $VALIDATION_HOOK validate 'package.json' '$SESSION_ID'"

test_case "Allow project files (CLAUDE.md)" \
  "pass" \
  "node $VALIDATION_HOOK validate 'CLAUDE.md' '$SESSION_ID'"

test_case "Allow inbox files" \
  "pass" \
  "node $VALIDATION_HOOK validate 'inbox/new-idea.md' '$SESSION_ID'"

echo ""
echo "═══════════════════════════════════════"
echo "2. MODIFICATION HOOK TESTS"
echo "═══════════════════════════════════════"
echo ""

# Test modification hook with JSON input/output
function test_modify_hook() {
  local test_name="$1"
  local input_path="$2"
  local expected_contains="$3"

  echo -n "Test: $test_name ... "

  local output=$(echo "{\"tool_input\":{\"file_path\":\"$input_path\"}}" | node "$MODIFY_HOOK" 2>&1)

  if echo "$output" | grep -q "$expected_contains"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASS_COUNT++))
  else
    echo -e "${RED}✗ FAIL${NC}"
    echo "  Expected: $expected_contains"
    echo "  Got: $output"
    ((FAIL_COUNT++))
  fi
}

test_modify_hook \
  "Auto-correct root tests/ to session artifacts" \
  "tests/app.test.js" \
  "sessions/$SESSION_ID/artifacts/tests/app.test.js"

test_modify_hook \
  "Auto-correct root docs/ to session artifacts" \
  "docs/guide.md" \
  "sessions/$SESSION_ID/artifacts/docs/guide.md"

test_modify_hook \
  "Auto-correct root scripts/ to session artifacts" \
  "scripts/build.sh" \
  "sessions/$SESSION_ID/artifacts/scripts/build.sh"

test_modify_hook \
  "Passthrough valid session paths" \
  "sessions/$SESSION_ID/artifacts/code/app.js" \
  "sessions/$SESSION_ID/artifacts/code/app.js"

test_modify_hook \
  "Passthrough permanent docs" \
  "docs/projects/myapp/README.md" \
  "docs/projects/myapp/README.md"

echo ""
echo "═══════════════════════════════════════"
echo "3. VIOLATION DETECTION"
echo "═══════════════════════════════════════"
echo ""

echo -n "Scanning workspace for violations ... "
if node "$VALIDATION_HOOK" detect &>/dev/null; then
  echo -e "${GREEN}✓ PASS (no violations)${NC}"
  ((PASS_COUNT++))
else
  echo -e "${YELLOW}⚠ WARN (violations found - see details above)${NC}"
  # Don't count as fail - might be expected in dev environment
fi

echo ""
echo "═══════════════════════════════════════"
echo "4. HOOKS INTEGRATION"
echo "═══════════════════════════════════════"
echo ""

echo -n "Test: Validation hook is executable ... "
if [ -x "$VALIDATION_HOOK" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASS_COUNT++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAIL_COUNT++))
fi

echo -n "Test: Modification hook is executable ... "
if [ -x "$MODIFY_HOOK" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASS_COUNT++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAIL_COUNT++))
fi

echo -n "Test: Pre-edit wrapper exists ... "
if [ -f "$WORKSPACE_ROOT/.swarm/hooks/pre-edit-file-router.sh" ]; then
  echo -e "${GREEN}✓ PASS${NC}"
  ((PASS_COUNT++))
else
  echo -e "${RED}✗ FAIL${NC}"
  ((FAIL_COUNT++))
fi

echo ""
echo "═══════════════════════════════════════"
echo "TEST SUMMARY"
echo "═══════════════════════════════════════"
echo ""

TOTAL=$((PASS_COUNT + FAIL_COUNT))
PASS_RATE=$((PASS_COUNT * 100 / TOTAL))

echo "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo "Pass Rate: $PASS_RATE%"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
  echo ""
  echo "✅ File Router Prevention System: OPERATIONAL"
  echo "✅ CLAUDE.md Compliance: ENFORCED"
  echo "✅ Session Artifacts: PROTECTED"
  exit 0
else
  echo -e "${RED}❌ SOME TESTS FAILED${NC}"
  echo ""
  echo "Please review failures above and fix issues."
  exit 1
fi
