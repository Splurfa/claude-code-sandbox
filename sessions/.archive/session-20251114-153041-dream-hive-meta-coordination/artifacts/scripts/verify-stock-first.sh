#!/bin/bash
# Stock-First Compliance Verification Script
# Tests all claims in documentation against actual implementation

# Don't exit on first error - we want to run all tests
set +e

echo "========================================"
echo "Stock-First Compliance Verification"
echo "========================================"
echo ""

PASS=0
FAIL=0

# Helper functions
check_pass() {
    echo "✅ PASS: $1"
    ((PASS++))
}

check_fail() {
    echo "❌ FAIL: $1"
    ((FAIL++))
}

# Test 1: Memory.db exists and has correct schema
echo "Test 1: Memory database schema..."
if [ -f ".swarm/memory.db" ]; then
    if sqlite3 .swarm/memory.db "SELECT name FROM sqlite_master WHERE type='table' AND name='memory_entries';" | grep -q "memory_entries"; then
        check_pass "memory_entries table exists (not 'memory')"
    else
        check_fail "memory_entries table not found"
    fi
else
    check_fail "memory.db does not exist"
fi
echo ""

# Test 2: Checkpoint hooks script exists
echo "Test 2: Checkpoint hooks..."
if [ -f ".claude/helpers/standard-checkpoint-hooks.sh" ]; then
    LINES=$(wc -l < .claude/helpers/standard-checkpoint-hooks.sh)
    check_pass "Checkpoint script exists ($LINES lines)"
else
    check_fail "Checkpoint script not found"
fi
echo ""

# Test 3: AgentDB should NOT be installed
echo "Test 3: AgentDB installation status..."
if npm list agentdb 2>/dev/null | grep -q "agentdb@"; then
    check_fail "AgentDB is installed (documentation claims it's not)"
else
    check_pass "AgentDB not installed (matches documentation)"
fi
echo ""

# Test 4: Auto-hooks should NOT exist
echo "Test 4: Hook automation status..."
if [ -f ".claude/hooks/auto-hooks.js" ] || [ -f ".claude/hooks/activate.sh" ]; then
    check_fail "Auto-hooks exist (documentation claims they don't)"
else
    check_pass "Auto-hooks not found (matches documentation)"
fi
echo ""

# Test 5: ReasoningBank directory should NOT exist
echo "Test 5: ReasoningBank implementation status..."
if [ -d ".claude/reasoningbank" ]; then
    check_fail "ReasoningBank directory exists (documentation claims it doesn't)"
else
    check_pass "ReasoningBank not implemented (matches documentation)"
fi
echo ""

# Test 6: Session auto-init should NOT exist
echo "Test 6: Session auto-init status..."
if [ -f ".claude/session/detect-and-init.sh" ]; then
    check_fail "Session auto-init exists (documentation claims it doesn't)"
else
    check_pass "Session auto-init not found (matches documentation)"
fi
echo ""

# Test 7: Memory CLI works
echo "Test 7: Memory CLI functionality..."
if npx claude-flow@alpha hooks memory --action store --key "test-verify" --value "test-value" --namespace "test" 2>/dev/null; then
    if npx claude-flow@alpha hooks memory --action retrieve --key "test-verify" --namespace "test" 2>/dev/null | grep -q "test-value"; then
        check_pass "Memory storage/retrieval works"
        # Cleanup
        npx claude-flow@alpha hooks memory --action delete --key "test-verify" --namespace "test" 2>/dev/null || true
    else
        check_fail "Memory retrieval failed"
    fi
else
    check_fail "Memory storage failed"
fi
echo ""

# Test 8: Checkpoint hooks are executable
echo "Test 8: Checkpoint hooks functionality..."
if bash .claude/helpers/standard-checkpoint-hooks.sh 2>&1 | grep -q "Usage"; then
    check_pass "Checkpoint script is executable"
else
    check_fail "Checkpoint script not working"
fi
echo ""

# Test 9: Session backups directory exists
echo "Test 9: Session backups infrastructure..."
if [ -d ".swarm/backups" ]; then
    BACKUP_COUNT=$(find .swarm/backups -name "*.json" 2>/dev/null | wc -l)
    check_pass "Backups directory exists ($BACKUP_COUNT backups)"
else
    check_fail "Backups directory not found"
fi
echo ""

# Test 10: Journal hook should NOT exist
echo "Test 10: Journal hook status..."
if [ -f ".claude/hooks/journal.sh" ]; then
    check_fail "Journal hook exists (documentation claims it doesn't)"
else
    check_pass "Journal hook not found (matches documentation)"
fi
echo ""

# Summary
echo "========================================"
echo "Summary"
echo "========================================"
echo "✅ Passed: $PASS"
echo "❌ Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 All tests passed! Documentation matches implementation."
    exit 0
else
    echo "⚠️  Some tests failed. Documentation may be inaccurate."
    exit 1
fi
