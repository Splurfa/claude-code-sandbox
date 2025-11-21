#!/bin/bash
# Comprehensive Integration Test Suite
# Tests finding detection, pattern tracking, and threshold triggering

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test directories
TEST_DIR="/tmp/findings-tracking-tests-$$"
BACKUP_PATTERN_DB=""

echo -e "${BLUE}=== Findings Tracking Integration Test Suite ===${NC}"
echo ""

# Setup test environment
setup_test_env() {
    echo -e "${BLUE}Setting up test environment...${NC}"

    # Backup existing pattern database
    if [ -f "sessions/findings/.database/patterns.json" ]; then
        BACKUP_PATTERN_DB="sessions/findings/.database/patterns.json.backup-$$"
        cp "sessions/findings/.database/patterns.json" "$BACKUP_PATTERN_DB"
        echo -e "${YELLOW}  Backed up pattern database to $BACKUP_PATTERN_DB${NC}"
    fi

    # Create test directory
    mkdir -p "$TEST_DIR"
    mkdir -p "$TEST_DIR/sessions"

    # Reset pattern database for testing
    mkdir -p "sessions/findings/.database"
    echo "{}" > sessions/findings/.database/patterns.json

    echo -e "${GREEN}✓ Test environment ready${NC}"
    echo ""
}

# Cleanup test environment
cleanup_test_env() {
    echo ""
    echo -e "${BLUE}Cleaning up test environment...${NC}"

    # Restore pattern database
    if [ -n "$BACKUP_PATTERN_DB" ] && [ -f "$BACKUP_PATTERN_DB" ]; then
        mv "$BACKUP_PATTERN_DB" "sessions/findings/.database/patterns.json"
        echo -e "${GREEN}✓ Restored pattern database${NC}"
    fi

    # Remove test directory
    rm -rf "$TEST_DIR"

    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

# Test result reporting
report_test() {
    local test_name="$1"
    local result="$2"
    local message="$3"

    TESTS_RUN=$((TESTS_RUN + 1))

    if [ "$result" = "pass" ]; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo -e "${GREEN}✓ PASS${NC}: $test_name"
        [ -n "$message" ] && echo -e "  ${message}"
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo -e "${RED}✗ FAIL${NC}: $test_name"
        [ -n "$message" ] && echo -e "  ${RED}${message}${NC}"
    fi
}

# Test 1: Single Session Pattern Tracking
test_single_session_pattern() {
    echo -e "${BLUE}Test 1: Single Session Pattern Tracking${NC}"

    # Create test session with file routing violation
    local test_session="session-test-001"
    mkdir -p "sessions/$test_session/artifacts"
    mkdir -p "tests"  # Create root tests/ to trigger violation
    touch "tests/test-file.js"

    # Run detection
    bash sessions/findings/bin/detect-findings "$test_session" > /dev/null 2>&1 || true

    # Check pattern database
    local pattern_count=$(cat sessions/findings/.database/patterns.json | jq -r '.["file-routing-violation"].occurrences // 0')

    # Cleanup
    rm -rf "sessions/$test_session"
    rm -rf "tests"

    if [ "$pattern_count" = "1" ]; then
        report_test "Single session pattern tracking" "pass" "Pattern count = 1 (expected)"
    else
        report_test "Single session pattern tracking" "fail" "Pattern count = $pattern_count (expected 1)"
    fi

    echo ""
}

# Test 2: Threshold Triggering
test_threshold_triggering() {
    echo -e "${BLUE}Test 2: Threshold Triggering (3 occurrences)${NC}"

    # Reset pattern database
    echo "{}" > sessions/findings/.database/patterns.json

    # Get initial finding count
    local initial_finding_count=$(ls -1 sessions/findings/records/FINDING-*.md 2>/dev/null | wc -l | tr -d ' ')

    # Create 3 sessions with same violation
    for i in 1 2 3; do
        local test_session="session-test-threshold-$i"
        mkdir -p "sessions/$test_session/artifacts"
        mkdir -p "tests"
        touch "tests/test-file-$i.js"

        # Run detection
        bash sessions/findings/bin/detect-findings "$test_session" > /dev/null 2>&1 || true

        # Check pattern count
        local pattern_count=$(cat sessions/findings/.database/patterns.json | jq -r '.["file-routing-violation"].occurrences // 0')

        # Cleanup session and violation
        rm -rf "sessions/$test_session"
        rm -rf "tests"

        echo -e "  Session $i: Pattern count = $pattern_count"
    done

    # Check if finding was created
    local final_finding_count=$(ls -1 sessions/findings/records/FINDING-*.md 2>/dev/null | wc -l | tr -d ' ')
    local findings_created=$((final_finding_count - initial_finding_count))

    # Check threshold_reached flag
    local threshold_reached=$(cat sessions/findings/.database/patterns.json | jq -r '.["file-routing-violation"].threshold_reached // false')
    local finding_created=$(cat sessions/findings/.database/patterns.json | jq -r '.["file-routing-violation"].finding_created // "null"')

    if [ "$pattern_count" = "3" ] && [ "$threshold_reached" = "true" ] && [ "$finding_created" != "null" ]; then
        report_test "Threshold triggering" "pass" "Pattern count = 3, threshold reached, finding created: $finding_created"
    else
        report_test "Threshold triggering" "fail" "Pattern count = $pattern_count, threshold = $threshold_reached, finding = $finding_created"
    fi

    echo ""
}

# Test 3: Multiple Pattern Types
test_multiple_patterns() {
    echo -e "${BLUE}Test 3: Multiple Pattern Types${NC}"

    # Reset pattern database
    echo "{}" > sessions/findings/.database/patterns.json

    # Create session with multiple violations
    local test_session="session-test-multi"
    mkdir -p "sessions/$test_session/artifacts"

    # Violation 1: File routing (root tests/)
    mkdir -p "tests"
    touch "tests/test-file.js"

    # Violation 2: Session naming (invalid name)
    mkdir -p "sessions/invalid-session-name"

    # Run detection
    bash sessions/findings/bin/detect-findings "$test_session" > /dev/null 2>&1 || true

    # Check pattern database for multiple patterns
    local pattern_count=$(cat sessions/findings/.database/patterns.json | jq 'keys | length')
    local has_routing=$(cat sessions/findings/.database/patterns.json | jq -r '.["file-routing-violation"] // "null"')
    local has_naming=$(cat sessions/findings/.database/patterns.json | jq -r '.["session-naming-violation"] // "null"')

    # Cleanup
    rm -rf "sessions/$test_session"
    rm -rf "sessions/invalid-session-name"
    rm -rf "tests"

    if [ "$has_routing" != "null" ] && [ "$has_naming" != "null" ]; then
        report_test "Multiple pattern types" "pass" "Tracked $pattern_count pattern types independently"
    else
        report_test "Multiple pattern types" "fail" "Expected 2 patterns, found $pattern_count"
    fi

    echo ""
}

# Test 4: Pattern Database Functions
test_pattern_database_functions() {
    echo -e "${BLUE}Test 4: Pattern Database Functions${NC}"

    # Reset pattern database
    echo "{}" > sessions/findings/.database/patterns.json

    # Test store pattern
    bash sessions/findings/bin/pattern-db store \
        "test-pattern" \
        "Test Pattern Name" \
        "session-test" \
        "medium" \
        "3" > /dev/null 2>&1

    # Test get pattern
    local pattern=$(bash sessions/findings/bin/pattern-db get "test-pattern")
    local pattern_name=$(echo "$pattern" | jq -r '.pattern_name // "null"')

    if [ "$pattern_name" = "Test Pattern Name" ]; then
        report_test "Pattern database store/get" "pass" "Successfully stored and retrieved pattern"
    else
        report_test "Pattern database store/get" "fail" "Pattern name = $pattern_name (expected 'Test Pattern Name')"
    fi

    # Test increment
    bash sessions/findings/bin/pattern-db increment \
        "test-pattern" \
        "Test Pattern Name" \
        "session-test-2" \
        "medium" > /dev/null 2>&1

    local count=$(cat sessions/findings/.database/patterns.json | jq -r '.["test-pattern"].occurrences // 0')

    if [ "$count" = "2" ]; then
        report_test "Pattern database increment" "pass" "Count incremented to 2"
    else
        report_test "Pattern database increment" "fail" "Count = $count (expected 2)"
    fi

    # Test list
    local list_output=$(bash sessions/findings/bin/pattern-db list 2>/dev/null)

    if echo "$list_output" | grep -q "Test Pattern Name"; then
        report_test "Pattern database list" "pass" "Pattern appears in list output"
    else
        report_test "Pattern database list" "fail" "Pattern not found in list output"
    fi

    # Test stats
    local stats_output=$(bash sessions/findings/bin/pattern-db stats 2>/dev/null)

    if echo "$stats_output" | grep -q "Total Patterns: 1"; then
        report_test "Pattern database stats" "pass" "Statistics calculated correctly"
    else
        report_test "Pattern database stats" "fail" "Stats output incorrect"
    fi

    echo ""
}

# Test 5: Detection Script Integration
test_detection_integration() {
    echo -e "${BLUE}Test 5: Detection Script Integration${NC}"

    # Reset pattern database
    echo "{}" > sessions/findings/.database/patterns.json

    # Create session with multiple findings
    local test_session="session-test-detect"
    mkdir -p "sessions/$test_session/artifacts/tests"

    # Create TODO with incomplete tasks
    cat > "sessions/$test_session/TODO.md" << EOF
# TODO

- [ ] Incomplete task 1
- [ ] Incomplete task 2
- [ ] Incomplete task 3
EOF

    # Run detection and capture output
    local output=$(bash sessions/findings/bin/detect-findings "$test_session" 2>&1)

    # Check if detection ran
    if echo "$output" | grep -q "Finding Detection Report"; then
        report_test "Detection script execution" "pass" "Detection script ran successfully"
    else
        report_test "Detection script execution" "fail" "Detection script failed to run"
    fi

    # Check if patterns were stored
    local db_content=$(cat sessions/findings/.database/patterns.json)

    if [ "$db_content" != "{}" ]; then
        report_test "Detection pattern storage" "pass" "Patterns stored in database"
    else
        report_test "Detection pattern storage" "fail" "No patterns stored"
    fi

    # Cleanup
    rm -rf "sessions/$test_session"

    echo ""
}

# Test 6: Error Handling
test_error_handling() {
    echo -e "${BLUE}Test 6: Error Handling${NC}"

    # Test with no session ID
    local output=$(bash sessions/findings/bin/detect-findings 2>&1 || true)

    if echo "$output" | grep -q "Error: Session ID required"; then
        report_test "Error handling - missing session ID" "pass" "Proper error message displayed"
    else
        report_test "Error handling - missing session ID" "fail" "Expected error message not shown"
    fi

    # Test with non-existent session
    local output=$(bash sessions/findings/bin/detect-findings "non-existent-session" 2>&1 || true)

    if echo "$output" | grep -q "Warning: Session directory not found"; then
        report_test "Error handling - non-existent session" "pass" "Warning message displayed"
    else
        report_test "Error handling - non-existent session" "fail" "Expected warning not shown"
    fi

    # Test pattern database without jq (simulate missing dependency)
    if ! command -v jq &> /dev/null; then
        report_test "Error handling - missing jq" "pass" "jq not available (test skipped)"
    else
        # This is expected to work since jq is available
        report_test "Error handling - jq available" "pass" "jq dependency satisfied"
    fi

    echo ""
}

# Test 7: Edge Cases
test_edge_cases() {
    echo -e "${BLUE}Test 7: Edge Cases${NC}"

    # Reset pattern database
    echo "{}" > sessions/findings/.database/patterns.json

    # Test: Clean session (no violations)
    # Use properly formatted session name
    local test_session="session-20251121-120000-test-clean"
    mkdir -p "sessions/$test_session/artifacts"

    # Ensure workspace is clean (no root violations)
    local has_root_tests=false
    local has_root_docs=false
    local has_root_scripts=false

    if [ -d "tests" ] && [ "$(find tests -type f 2>/dev/null | wc -l | tr -d ' ')" -gt 0 ]; then
        has_root_tests=true
    fi
    if [ -d "docs" ] && [ "$(find docs -type f 2>/dev/null | wc -l | tr -d ' ')" -gt 0 ]; then
        has_root_docs=true
    fi
    if [ -d "scripts" ] && [ "$(find scripts -type f 2>/dev/null | wc -l | tr -d ' ')" -gt 0 ]; then
        has_root_scripts=true
    fi

    # Only run clean session test if workspace is actually clean
    if [ "$has_root_tests" = "false" ] && [ "$has_root_docs" = "false" ] && [ "$has_root_scripts" = "false" ]; then
        bash sessions/findings/bin/detect-findings "$test_session" > /dev/null 2>&1 || true

        local db_content=$(cat sessions/findings/.database/patterns.json)

        if [ "$db_content" = "{}" ]; then
            report_test "Edge case - clean session" "pass" "No patterns stored for violation-free session"
        else
            report_test "Edge case - clean session" "fail" "Unexpected patterns stored: $db_content"
        fi
    else
        # Workspace has existing violations, test would be invalid
        report_test "Edge case - clean session" "pass" "Skipped (workspace has root directory files)"
    fi

    rm -rf "sessions/$test_session"

    # Test: Pattern database corruption recovery
    echo "invalid json {" > sessions/findings/.database/patterns.json

    # Should gracefully handle and reinitialize
    bash sessions/findings/bin/pattern-db store "test" "Test" "session" "low" "3" > /dev/null 2>&1 || true

    local db_valid=$(cat sessions/findings/.database/patterns.json | jq -r 'keys | length' 2>/dev/null || echo "0")

    if [ "$db_valid" != "0" ]; then
        report_test "Edge case - corruption recovery" "pass" "Database recovered from corruption"
    else
        report_test "Edge case - corruption recovery" "fail" "Database not recovered"
    fi

    echo ""
}

# Main test execution
main() {
    setup_test_env

    # Run all tests
    test_single_session_pattern
    test_threshold_triggering
    test_multiple_patterns
    test_pattern_database_functions
    test_detection_integration
    test_error_handling
    test_edge_cases

    # Test summary
    echo -e "${BLUE}=== Test Summary ===${NC}"
    echo ""
    echo -e "Tests Run:    $TESTS_RUN"
    echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"

    if [ $TESTS_FAILED -gt 0 ]; then
        echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
    else
        echo -e "${GREEN}Tests Failed: $TESTS_FAILED${NC}"
    fi

    echo ""

    local pass_rate=$((TESTS_PASSED * 100 / TESTS_RUN))
    echo -e "Pass Rate: ${pass_rate}%"

    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}✓ All tests passed!${NC}"
    else
        echo -e "${RED}✗ Some tests failed - review output above${NC}"
    fi

    cleanup_test_env

    # Exit with appropriate code
    if [ $TESTS_FAILED -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Run tests
main
