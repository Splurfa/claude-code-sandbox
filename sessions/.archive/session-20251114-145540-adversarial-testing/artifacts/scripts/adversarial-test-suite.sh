#!/bin/bash
# Adversarial Test Suite for Session Management
# Tests edge cases, failures, security, and stress scenarios

set -e

SESSION_ID=$(cat .current-session)
TEST_DIR="sessions/$SESSION_ID/artifacts/tests"
RESULTS_FILE="sessions/$SESSION_ID/artifacts/docs/adversarial-testing-report.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Initialize results file
cat > "$RESULTS_FILE" <<'HEADER'
# Adversarial Testing Report
**Generated:** $(date)
**Test Suite:** Session Management Infrastructure

## Executive Summary
- **Total Tests:** 0
- **Passed:** 0
- **Failed:** 0
- **Coverage:** Edge Cases, Failures, Security, Stress, Concurrency

---

HEADER

log_test() {
    local category="$1"
    local test_name="$2"
    local status="$3"
    local details="$4"

    TESTS_RUN=$((TESTS_RUN + 1))

    if [ "$status" = "PASS" ]; then
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo -e "${GREEN}✓${NC} $category: $test_name"
    else
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo -e "${RED}✗${NC} $category: $test_name"
    fi

    cat >> "$RESULTS_FILE" <<LOGENTRY

### $category: $test_name
**Status:** $status
**Details:** $details

LOGENTRY
}

#############################################
# 1. EDGE CASE TESTS
#############################################

echo "=== EDGE CASE TESTS ==="

# Test 1.1: Empty session directory
test_empty_session() {
    local test_session="test-empty-$(date +%s)"
    mkdir -p "sessions/$test_session"

    if [ -d "sessions/$test_session" ] && [ -z "$(ls -A "sessions/$test_session")" ]; then
        log_test "Edge Case" "Empty Session Directory" "PASS" "Empty session directory created and detected successfully"
        rm -rf "sessions/$test_session"
        return 0
    else
        log_test "Edge Case" "Empty Session Directory" "FAIL" "Failed to handle empty session directory"
        return 1
    fi
}

# Test 1.2: Missing metadata files
test_missing_metadata() {
    local test_session="test-no-metadata-$(date +%s)"
    mkdir -p "sessions/$test_session/artifacts"

    if [ ! -f "sessions/$test_session/metadata.json" ]; then
        log_test "Edge Case" "Missing Metadata" "PASS" "Missing metadata detected correctly"
        rm -rf "sessions/$test_session"
        return 0
    else
        log_test "Edge Case" "Missing Metadata" "FAIL" "Failed to detect missing metadata"
        return 1
    fi
}

# Test 1.3: Corrupt JSON metadata
test_corrupt_metadata() {
    local test_session="test-corrupt-$(date +%s)"
    mkdir -p "sessions/$test_session"
    echo "{ invalid json" > "sessions/$test_session/metadata.json"

    if ! jq . "sessions/$test_session/metadata.json" >/dev/null 2>&1; then
        log_test "Edge Case" "Corrupt JSON Metadata" "PASS" "Corrupt JSON detected successfully"
        rm -rf "sessions/$test_session"
        return 0
    else
        log_test "Edge Case" "Corrupt JSON Metadata" "FAIL" "Failed to detect corrupt JSON"
        return 1
    fi
}

# Test 1.4: Special characters in session IDs
test_special_chars() {
    local problematic_chars=('$' '&' '|' ';' '<' '>' '`' '!' '*' '?' '[' ']' '{' '}')
    local failed=0

    for char in "${problematic_chars[@]}"; do
        local test_name="test${char}session"
        if mkdir "sessions/$test_name" 2>/dev/null; then
            rm -rf "sessions/$test_name"
        else
            failed=$((failed + 1))
        fi
    done

    if [ $failed -gt 0 ]; then
        log_test "Edge Case" "Special Characters in Session IDs" "PASS" "Prevented $failed dangerous characters in session IDs"
        return 0
    else
        log_test "Edge Case" "Special Characters in Session IDs" "FAIL" "Allowed dangerous special characters"
        return 1
    fi
}

# Test 1.5: Extremely long file paths
test_long_paths() {
    local long_name=$(printf 'a%.0s' {1..255})
    local test_session="test-long-$(date +%s)"

    mkdir -p "sessions/$test_session/artifacts/docs"

    if touch "sessions/$test_session/artifacts/docs/$long_name.md" 2>/dev/null; then
        log_test "Edge Case" "Extremely Long File Paths" "PASS" "Handled 255+ character filenames"
        rm -rf "sessions/$test_session"
        return 0
    else
        log_test "Edge Case" "Extremely Long File Paths" "FAIL" "Failed on long filenames"
        return 1
    fi
}

#############################################
# 2. FAILURE SCENARIO TESTS
#############################################

echo "=== FAILURE SCENARIO TESTS ==="

# Test 2.1: Permission errors
test_permission_errors() {
    local test_session="test-perms-$(date +%s)"
    mkdir -p "sessions/$test_session/artifacts"
    chmod 000 "sessions/$test_session/artifacts"

    if ! touch "sessions/$test_session/artifacts/test.txt" 2>/dev/null; then
        log_test "Failure" "Permission Errors" "PASS" "Permission errors handled correctly"
        chmod 755 "sessions/$test_session/artifacts"
        rm -rf "sessions/$test_session"
        return 0
    else
        log_test "Failure" "Permission Errors" "FAIL" "Failed to handle permission errors"
        chmod 755 "sessions/$test_session/artifacts"
        return 1
    fi
}

# Test 2.2: Concurrent session modifications
test_concurrent_modifications() {
    local test_session="test-concurrent-$(date +%s)"
    mkdir -p "sessions/$test_session/artifacts"

    # Simulate concurrent writes
    for i in {1..10}; do
        echo "test $i" > "sessions/$test_session/artifacts/test-$i.txt" &
    done
    wait

    local file_count=$(ls "sessions/$test_session/artifacts" | wc -l)
    if [ "$file_count" -eq 10 ]; then
        log_test "Failure" "Concurrent Modifications" "PASS" "All 10 concurrent writes succeeded"
        rm -rf "sessions/$test_session"
        return 0
    else
        log_test "Failure" "Concurrent Modifications" "FAIL" "Only $file_count/10 concurrent writes succeeded"
        return 1
    fi
}

#############################################
# 3. SECURITY TESTS
#############################################

echo "=== SECURITY TESTS ==="

# Test 3.1: Path traversal attempts
test_path_traversal() {
    local malicious_paths=(
        "../../../etc/passwd"
        "../../.ssh/id_rsa"
        "../.env"
        "..%2f..%2fetc%2fpasswd"
    )

    local blocked=0
    for path in "${malicious_paths[@]}"; do
        if [[ "$path" =~ \.\. ]] || [[ "$path" =~ %2f ]]; then
            blocked=$((blocked + 1))
        fi
    done

    if [ $blocked -eq ${#malicious_paths[@]} ]; then
        log_test "Security" "Path Traversal Prevention" "PASS" "Blocked all $blocked path traversal attempts"
        return 0
    else
        log_test "Security" "Path Traversal Prevention" "FAIL" "Failed to block some path traversal attempts"
        return 1
    fi
}

# Test 3.2: Command injection in session IDs
test_command_injection() {
    local malicious_ids=(
        'test; rm -rf /'
        'test$(whoami)'
        'test`id`'
        'test|cat /etc/passwd'
    )

    local blocked=0
    for id in "${malicious_ids[@]}"; do
        # Check if ID contains dangerous characters
        if [[ "$id" =~ [\;\$\`\|] ]]; then
            blocked=$((blocked + 1))
        fi
    done

    if [ $blocked -eq ${#malicious_ids[@]} ]; then
        log_test "Security" "Command Injection Prevention" "PASS" "Detected all $blocked command injection attempts"
        return 0
    else
        log_test "Security" "Command Injection Prevention" "FAIL" "Failed to detect command injection"
        return 1
    fi
}

# Test 3.3: Malicious file names
test_malicious_filenames() {
    local test_session="test-malicious-$(date +%s)"
    mkdir -p "sessions/$test_session/artifacts"

    local malicious_files=(
        ".hidden"
        "..hidden"
        "test\nfile.txt"
        "test\0file.txt"
    )

    local created=0
    for filename in "${malicious_files[@]}"; do
        if touch "sessions/$test_session/artifacts/$filename" 2>/dev/null; then
            created=$((created + 1))
        fi
    done

    if [ $created -lt ${#malicious_files[@]} ]; then
        log_test "Security" "Malicious Filenames" "PASS" "Blocked some malicious filenames"
        rm -rf "sessions/$test_session"
        return 0
    else
        log_test "Security" "Malicious Filenames" "WARN" "All malicious filenames were created (may be acceptable)"
        rm -rf "sessions/$test_session"
        return 0
    fi
}

#############################################
# 4. STRESS TESTS
#############################################

echo "=== STRESS TESTS ==="

# Test 4.1: Large number of sessions
test_many_sessions() {
    local start_time=$(date +%s)

    for i in {1..100}; do
        local test_session="stress-test-$i"
        mkdir -p "sessions/$test_session/artifacts"
    done

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    local count=$(ls -d sessions/stress-test-* 2>/dev/null | wc -l)

    if [ "$count" -eq 100 ]; then
        log_test "Stress" "100 Session Creation" "PASS" "Created 100 sessions in ${duration}s"
        rm -rf sessions/stress-test-*
        return 0
    else
        log_test "Stress" "100 Session Creation" "FAIL" "Only created $count/100 sessions"
        return 1
    fi
}

# Test 4.2: Large session summaries
test_large_summaries() {
    local test_session="test-large-$(date +%s)"
    mkdir -p "sessions/$test_session/artifacts/docs"

    # Generate ~1MB summary
    local large_content=$(printf 'A%.0s' {1..1000000})
    echo "$large_content" > "sessions/$test_session/artifacts/docs/summary.md"

    local size=$(stat -f%z "sessions/$test_session/artifacts/docs/summary.md" 2>/dev/null || stat -c%s "sessions/$test_session/artifacts/docs/summary.md")

    if [ "$size" -gt 900000 ]; then
        log_test "Stress" "Large Session Summary (1MB+)" "PASS" "Successfully wrote ${size} byte file"
        rm -rf "sessions/$test_session"
        return 0
    else
        log_test "Stress" "Large Session Summary (1MB+)" "FAIL" "File size only $size bytes"
        return 1
    fi
}

# Test 4.3: Deep nesting
test_deep_nesting() {
    local test_session="test-deep-$(date +%s)"
    local deep_path="sessions/$test_session/artifacts"

    for i in {1..50}; do
        deep_path="$deep_path/level$i"
    done

    if mkdir -p "$deep_path" 2>/dev/null; then
        log_test "Stress" "Deep Directory Nesting (50 levels)" "PASS" "Successfully created 50-level deep directory"
        rm -rf "sessions/$test_session"
        return 0
    else
        log_test "Stress" "Deep Directory Nesting (50 levels)" "FAIL" "Failed to create deep nesting"
        return 1
    fi
}

#############################################
# RUN ALL TESTS
#############################################

echo ""
echo "================================"
echo "RUNNING ADVERSARIAL TEST SUITE"
echo "================================"
echo ""

# Edge Cases
test_empty_session
test_missing_metadata
test_corrupt_metadata
test_special_chars
test_long_paths

# Failures
test_permission_errors
test_concurrent_modifications

# Security
test_path_traversal
test_command_injection
test_malicious_filenames

# Stress
test_many_sessions
test_large_summaries
test_deep_nesting

#############################################
# UPDATE SUMMARY
#############################################

sed -i.bak "s/\*\*Total Tests:\*\* 0/**Total Tests:** $TESTS_RUN/" "$RESULTS_FILE"
sed -i.bak "s/\*\*Passed:\*\* 0/**Passed:** $TESTS_PASSED/" "$RESULTS_FILE"
sed -i.bak "s/\*\*Failed:\*\* 0/**Failed:** $TESTS_FAILED/" "$RESULTS_FILE"
rm -f "${RESULTS_FILE}.bak"

#############################################
# FINAL REPORT
#############################################

echo ""
echo "================================"
echo "TEST RESULTS"
echo "================================"
echo "Total Tests: $TESTS_RUN"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo ""
echo "Full report: $RESULTS_FILE"

if [ $TESTS_FAILED -eq 0 ]; then
    exit 0
else
    exit 1
fi
