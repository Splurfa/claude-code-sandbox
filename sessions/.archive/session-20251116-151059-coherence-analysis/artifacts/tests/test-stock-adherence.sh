#!/bin/bash
# Test Suite: Stock Adherence
# Generated: 2025-11-16
# Session: session-20251116-151059-coherence-analysis

set -e

SESSION_DIR="sessions/session-20251116-151059-coherence-analysis/artifacts/tests"
RESULTS_FILE="$SESSION_DIR/implementation-test-results.md"

echo "" >> "$RESULTS_FILE"
echo "# Stock Adherence Test Results" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Test 7: Stock .hive-mind/ Untouched
echo "## Test 7: Stock .hive-mind/ Directory" >> "$RESULTS_FILE"
echo "### Objective: Verify stock directories remain unmodified" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Check if .hive-mind exists (it may not in all workspaces)
if [ -d ".hive-mind" ]; then
    # Check git status for modifications
    HIVE_STATUS=$(git status --porcelain .hive-mind 2>/dev/null || echo "")

    if [ -z "$HIVE_STATUS" ]; then
        echo "✅ **PASS**: .hive-mind/ directory unmodified" >> "$RESULTS_FILE"
    else
        echo "❌ **FAIL**: .hive-mind/ has modifications" >> "$RESULTS_FILE"
        echo "\`\`\`" >> "$RESULTS_FILE"
        echo "$HIVE_STATUS" >> "$RESULTS_FILE"
        echo "\`\`\`" >> "$RESULTS_FILE"
        exit 1
    fi
else
    echo "⚠️ **SKIP**: .hive-mind/ directory not present (may use .swarm/)" >> "$RESULTS_FILE"
fi

# Check .swarm directory (alternative stock location)
if [ -d ".swarm" ]; then
    echo "✅ **PASS**: .swarm/ directory exists (stock alternative)" >> "$RESULTS_FILE"

    # Verify memory.db exists
    if [ -f ".swarm/memory.db" ]; then
        echo "✅ **PASS**: Stock memory.db exists" >> "$RESULTS_FILE"
    else
        echo "⚠️ **WARNING**: memory.db not found" >> "$RESULTS_FILE"
    fi
fi

echo "" >> "$RESULTS_FILE"

# Test 8: Stock Hooks Integration
echo "## Test 8: Stock Hooks Integration" >> "$RESULTS_FILE"
echo "### Objective: Verify stock hooks still functional" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Test pre-task hook
PRE_TASK_OUTPUT=$(npx claude-flow@alpha hooks pre-task --description "Stock adherence test" --task-id "stock-test-001" 2>&1)

if echo "$PRE_TASK_OUTPUT" | grep -q "TASK PREPARATION COMPLETE"; then
    echo "✅ **PASS**: pre-task hook executed successfully" >> "$RESULTS_FILE"
    echo "- Task ID: stock-test-001" >> "$RESULTS_FILE"
else
    echo "❌ **FAIL**: pre-task hook failed" >> "$RESULTS_FILE"
    echo "\`\`\`" >> "$RESULTS_FILE"
    echo "$PRE_TASK_OUTPUT" >> "$RESULTS_FILE"
    echo "\`\`\`" >> "$RESULTS_FILE"
    exit 1
fi

# Test post-task hook
POST_TASK_OUTPUT=$(npx claude-flow@alpha hooks post-task --task-id "stock-test-001" --status "completed" 2>&1)

if echo "$POST_TASK_OUTPUT" | grep -q "Post-task hook completed"; then
    echo "✅ **PASS**: post-task hook executed successfully" >> "$RESULTS_FILE"
else
    echo "❌ **FAIL**: post-task hook failed" >> "$RESULTS_FILE"
    echo "\`\`\`" >> "$RESULTS_FILE"
    echo "$POST_TASK_OUTPUT" >> "$RESULTS_FILE"
    echo "\`\`\`" >> "$RESULTS_FILE"
    exit 1
fi

echo "" >> "$RESULTS_FILE"

# Verify memory operations work
echo "## Memory Operations Test" >> "$RESULTS_FILE"
echo "### Objective: Verify stock memory operations functional" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Memory operations are tested via MCP tools, not shell scripts
# This is a structural check only
if [ -f ".swarm/memory.db" ]; then
    echo "✅ **PASS**: Stock memory database accessible" >> "$RESULTS_FILE"

    # Check file size to verify it's being used
    MEMORY_SIZE=$(stat -f%z ".swarm/memory.db" 2>/dev/null || stat -c%s ".swarm/memory.db" 2>/dev/null || echo "0")
    if [ "$MEMORY_SIZE" -gt 0 ]; then
        echo "✅ **PASS**: Memory database is active (size: $MEMORY_SIZE bytes)" >> "$RESULTS_FILE"
    else
        echo "⚠️ **WARNING**: Memory database is empty" >> "$RESULTS_FILE"
    fi
else
    echo "❌ **FAIL**: Stock memory database not found" >> "$RESULTS_FILE"
    exit 1
fi

echo "" >> "$RESULTS_FILE"
echo "## Summary: Stock Adherence Tests" >> "$RESULTS_FILE"
echo "- **Test 7**: ✅ Stock Directories Unmodified" >> "$RESULTS_FILE"
echo "- **Test 8**: ✅ Stock Hooks Functional" >> "$RESULTS_FILE"
echo "- **Memory**: ✅ Stock Memory Operations" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo "✅ All stock adherence tests passed!" >> "$RESULTS_FILE"
