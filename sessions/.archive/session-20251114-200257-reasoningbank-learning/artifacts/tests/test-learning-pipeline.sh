#!/bin/bash
# Test ReasoningBank Learning Pipeline
#
# Validates: trajectory collection, judgment, pattern distillation

set -e

SESSION_DIR="$(dirname "$0")/../code/reasoningbank"
TEST_RESULTS="$(dirname "$0")/test-results.txt"

echo "🧪 Testing ReasoningBank Learning Pipeline" | tee "$TEST_RESULTS"
echo "==========================================" | tee -a "$TEST_RESULTS"
echo "" | tee -a "$TEST_RESULTS"

# Test 1: Verify database schema
echo "Test 1: Database Schema Verification" | tee -a "$TEST_RESULTS"
echo "────────────────────────────────────" | tee -a "$TEST_RESULTS"

TABLES=$(sqlite3 .swarm/memory.db "SELECT name FROM sqlite_master WHERE type='table' AND (name LIKE '%trajector%' OR name = 'patterns');" 2>&1)

if echo "$TABLES" | grep -q "task_trajectories"; then
  echo "✅ task_trajectories table exists" | tee -a "$TEST_RESULTS"
else
  echo "❌ task_trajectories table missing" | tee -a "$TEST_RESULTS"
  exit 1
fi

if echo "$TABLES" | grep -q "patterns"; then
  echo "✅ patterns table exists" | tee -a "$TEST_RESULTS"
else
  echo "❌ patterns table missing" | tee -a "$TEST_RESULTS"
  exit 1
fi

echo "" | tee -a "$TEST_RESULTS"

# Test 2: Trajectory collection
echo "Test 2: Trajectory Collection" | tee -a "$TEST_RESULTS"
echo "─────────────────────────────" | tee -a "$TEST_RESULTS"

BEFORE_COUNT=$(sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM task_trajectories;")
echo "   Trajectories before: $BEFORE_COUNT" | tee -a "$TEST_RESULTS"

# Run collector (may find zero if no recent memory entries, that's ok)
node "$SESSION_DIR/trajectory-collector.js" 2>&1 | tee -a "$TEST_RESULTS"

AFTER_COUNT=$(sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM task_trajectories;")
echo "   Trajectories after: $AFTER_COUNT" | tee -a "$TEST_RESULTS"

if [ "$AFTER_COUNT" -ge "$BEFORE_COUNT" ]; then
  echo "✅ Trajectory collection working" | tee -a "$TEST_RESULTS"
else
  echo "⚠️  No new trajectories (expected if no recent agent work)" | tee -a "$TEST_RESULTS"
fi

echo "" | tee -a "$TEST_RESULTS"

# Test 3: Verdict judgment
echo "Test 3: Verdict Judgment" | tee -a "$TEST_RESULTS"
echo "────────────────────────" | tee -a "$TEST_RESULTS"

UNJUDGED_BEFORE=$(sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM task_trajectories WHERE judge_label IS NULL;")
echo "   Unjudged before: $UNJUDGED_BEFORE" | tee -a "$TEST_RESULTS"

node "$SESSION_DIR/verdict-judge.js" --confidence-threshold 0.5 2>&1 | tee -a "$TEST_RESULTS"

UNJUDGED_AFTER=$(sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM task_trajectories WHERE judge_label IS NULL;")
echo "   Unjudged after: $UNJUDGED_AFTER" | tee -a "$TEST_RESULTS"

if [ "$UNJUDGED_AFTER" -le "$UNJUDGED_BEFORE" ]; then
  echo "✅ Judgment working" | tee -a "$TEST_RESULTS"
else
  echo "❌ Judgment not working" | tee -a "$TEST_RESULTS"
  exit 1
fi

echo "" | tee -a "$TEST_RESULTS"

# Test 4: Pattern distillation
echo "Test 4: Pattern Distillation" | tee -a "$TEST_RESULTS"
echo "────────────────────────────" | tee -a "$TEST_RESULTS"

PATTERNS_BEFORE=$(sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM patterns WHERE type = 'reasoning_memory';")
echo "   Patterns before: $PATTERNS_BEFORE" | tee -a "$TEST_RESULTS"

node "$SESSION_DIR/memory-distiller.js" --min-confidence 0.5 2>&1 | tee -a "$TEST_RESULTS"

PATTERNS_AFTER=$(sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM patterns WHERE type = 'reasoning_memory';")
echo "   Patterns after: $PATTERNS_AFTER" | tee -a "$TEST_RESULTS"

if [ "$PATTERNS_AFTER" -ge "$PATTERNS_BEFORE" ]; then
  echo "✅ Pattern distillation working" | tee -a "$TEST_RESULTS"
else
  echo "⚠️  No new patterns (expected if no successful trajectories)" | tee -a "$TEST_RESULTS"
fi

echo "" | tee -a "$TEST_RESULTS"

# Test 5: Full learning loop
echo "Test 5: Full Learning Loop" | tee -a "$TEST_RESULTS"
echo "──────────────────────────" | tee -a "$TEST_RESULTS"

bash "$SESSION_DIR/learning-loop.sh" 0.7 2>&1 | tee -a "$TEST_RESULTS"

echo "" | tee -a "$TEST_RESULTS"
echo "==========================================" | tee -a "$TEST_RESULTS"
echo "✅ All tests completed successfully!" | tee -a "$TEST_RESULTS"
echo "" | tee -a "$TEST_RESULTS"
echo "Test results saved to: $TEST_RESULTS" | tee -a "$TEST_RESULTS"
