#!/bin/bash
# Unit Tests for Session ID Validation

source "$(dirname "$0")/../code/session-id-validator.sh"

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test framework
assert_pass() {
    local test_name="$1"
    local command="$2"

    TESTS_RUN=$((TESTS_RUN + 1))

    if eval "$command" >/dev/null 2>&1; then
        echo "✓ $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo "✗ $test_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

assert_fail() {
    local test_name="$1"
    local command="$2"

    TESTS_RUN=$((TESTS_RUN + 1))

    if eval "$command" >/dev/null 2>&1; then
        echo "✗ $test_name (should have failed)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    else
        echo "✓ $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    fi
}

assert_equals() {
    local test_name="$1"
    local expected="$2"
    local actual="$3"

    TESTS_RUN=$((TESTS_RUN + 1))

    if [ "$expected" = "$actual" ]; then
        echo "✓ $test_name"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo "✗ $test_name"
        echo "  Expected: $expected"
        echo "  Got: $actual"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo "=== SESSION ID VALIDATOR TESTS ==="
echo ""

# Test validate_session_id
echo "Testing validate_session_id..."
assert_pass "Valid session ID" "validate_session_id 'session-20251114-145540-test-topic'"
assert_fail "Invalid: missing prefix" "validate_session_id '20251114-145540-test'"
assert_fail "Invalid: bad date format" "validate_session_id 'session-2025-11-14-145540-test'"
assert_fail "Invalid: uppercase in topic" "validate_session_id 'session-20251114-145540-Test-Topic'"
assert_fail "Invalid: spaces in topic" "validate_session_id 'session-20251114-145540-test topic'"
assert_fail "Invalid: special chars" "validate_session_id 'session-20251114-145540-test\$topic'"
assert_fail "Invalid: path traversal" "validate_session_id 'session-20251114-145540-../etc/passwd'"
assert_fail "Invalid: command injection" "validate_session_id 'session-20251114-145540-test\`whoami\`'"
assert_fail "Invalid: semicolon" "validate_session_id 'session-20251114-145540-test;rm -rf /'"

echo ""

# Test sanitize_topic
echo "Testing sanitize_topic..."
result=$(sanitize_topic "Test Topic")
assert_equals "Lowercase conversion" "test-topic" "$result"

result=$(sanitize_topic "Test!@#\$%Topic")
assert_equals "Special char removal" "testtopic" "$result"

result=$(sanitize_topic "Test   Multiple   Spaces")
assert_equals "Space to hyphen" "test-multiple-spaces" "$result"

result=$(sanitize_topic "Test--Double--Hyphens")
assert_equals "Consecutive hyphens" "test-double-hyphens" "$result"

result=$(sanitize_topic "-Leading and Trailing-")
assert_equals "Trim hyphens" "leading-and-trailing" "$result"

long_topic=$(printf 'a%.0s' {1..100})
result=$(sanitize_topic "$long_topic")
assert_equals "Length limit" 50 "${#result}"

echo ""

# Test generate_session_id
echo "Testing generate_session_id..."
result=$(generate_session_id "Test Topic")
assert_pass "Generate valid ID" "echo '$result' | grep -q '^session-[0-9]\{8\}-[0-9]\{6\}-test-topic$'"

# Test that dangerous characters are sanitized properly
test_topic='Dangerous$Topic'  # Avoid backticks in test
result=$(generate_session_id "$test_topic")
if [ -n "$result" ]; then
    # Just verify it generated something and doesn't contain dangerous chars
    if [[ ! "$result" =~ [\$\`] ]]; then
        echo "✓ Sanitize dangerous chars"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo "✗ Sanitize dangerous chars (contains dangerous chars)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
else
    echo "✗ Sanitize dangerous chars (no result)"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TESTS_RUN=$((TESTS_RUN + 1))

echo ""

# Test sanitize_path
echo "Testing sanitize_path..."
result=$(sanitize_path "../../../etc/passwd")
assert_equals "Path traversal removal" "etc/passwd" "$result"

result=$(sanitize_path "/absolute/path")
assert_equals "Leading slash removal" "absolute/path" "$result"

echo ""

# Test sanitize_filename
echo "Testing sanitize_filename..."
result=$(sanitize_filename "my\$dangerous\`file.txt")
assert_equals "Filename sanitization" "my_dangerous_file.txt" "$result"

result=$(sanitize_filename "test file.md")
assert_equals "Space replacement" "test_file.md" "$result"

echo ""

# Test validate_artifact_type
echo "Testing validate_artifact_type..."
assert_pass "Valid: code" "validate_artifact_type 'code'"
assert_pass "Valid: tests" "validate_artifact_type 'tests'"
assert_pass "Valid: docs" "validate_artifact_type 'docs'"
assert_pass "Valid: scripts" "validate_artifact_type 'scripts'"
assert_pass "Valid: notes" "validate_artifact_type 'notes'"
assert_fail "Invalid: random" "validate_artifact_type 'random'"
assert_fail "Invalid: malicious" "validate_artifact_type '../etc'"

echo ""

# Test get_session_path
echo "Testing get_session_path..."
result=$(get_session_path "session-20251114-145540-test")
assert_equals "Base path" "sessions/session-20251114-145540-test" "$result"

result=$(get_session_path "session-20251114-145540-test" "code")
assert_equals "With artifact type" "sessions/session-20251114-145540-test/artifacts/code" "$result"

assert_fail "Invalid session ID" "get_session_path 'invalid-id'"
assert_fail "Invalid artifact type" "get_session_path 'session-20251114-145540-test' 'invalid'"

echo ""

# Final results
echo "================================"
echo "TEST RESULTS"
echo "================================"
echo "Total Tests: $TESTS_RUN"
echo "Passed: $TESTS_PASSED"
echo "Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo "✓ All tests passed!"
    exit 0
else
    echo "✗ Some tests failed"
    exit 1
fi
