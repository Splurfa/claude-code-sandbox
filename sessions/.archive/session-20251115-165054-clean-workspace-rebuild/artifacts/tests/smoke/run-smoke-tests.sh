#!/bin/bash
# Smoke Tests - Quick Validation (<2 minutes)
# Run these tests for fast feedback on critical functionality

set -e

SESSION_ID="session-20251115-165054-clean-workspace-rebuild"
START_TIME=$(date +%s)

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

run_test() {
    local test_name="$1"
    local test_command="$2"

    echo -n "Running: $test_name ... "

    if eval "$test_command" &>/dev/null; then
        echo -e "${GREEN}PASS${NC}"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
        ((FAILED++))
        return 1
    fi
}

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Smoke Test Suite - Quick Validation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ST-001: Stock hooks executable
run_test "ST-001: Stock hooks CLI" \
    "npx claude-flow@alpha hooks --help"

# ST-002: Memory store/retrieve
run_test "ST-002: Memory operations" \
    "npx claude-flow@alpha hooks memory --action store --key smoke-test --value test && \
     npx claude-flow@alpha hooks memory --action retrieve --key smoke-test"

# ST-003: Session directory creation
run_test "ST-003: Session creation" \
    "mkdir -p sessions/smoke-test-session/artifacts/{code,tests,docs}"

# ST-004: File routing to artifacts
run_test "ST-004: File routing" \
    "echo 'test' > sessions/smoke-test-session/artifacts/code/test.js && \
     test -f sessions/smoke-test-session/artifacts/code/test.js"

# ST-005: Basic hook cascade (check if hooks wrapper exists)
if [ -f ".claude/hooks/auto-hooks.js" ]; then
    run_test "ST-005: Hook cascade setup" \
        "grep -q 'npx claude-flow@alpha hooks' .claude/hooks/auto-hooks.js"
else
    echo -n "Running: ST-005: Hook cascade setup ... "
    echo -e "${YELLOW}SKIP (not implemented)${NC}"
fi

# ST-006: Skills directory valid
run_test "ST-006: Skills directory" \
    "test -d .claude/skills"

# ST-007: CLAUDE.md loads correctly
run_test "ST-007: CLAUDE.md valid" \
    "test -f CLAUDE.md && grep -q 'SESSION MANAGEMENT PROTOCOL' CLAUDE.md"

# ST-008: Package dependencies
run_test "ST-008: Dependencies installed" \
    "test -d node_modules && test -f package.json"

# ST-009: Git repository functional
run_test "ST-009: Git repository" \
    "git status"

# ST-010: No stock file modifications
run_test "ST-010: Stock integrity" \
    "! git ls-files --modified | grep -q node_modules/claude-flow"

# Cleanup
rm -rf sessions/smoke-test-session 2>/dev/null || true

# Summary
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Smoke Test Results${NC}"
echo -e "${BLUE}========================================${NC}"

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo "Passed: $PASSED"
echo "Failed: $FAILED"
echo "Duration: ${DURATION}s"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All smoke tests passed${NC}"
    exit 0
else
    echo -e "${RED}✗ Some smoke tests failed${NC}"
    exit 1
fi
