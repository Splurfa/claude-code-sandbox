#!/bin/bash
# Hook System Integration Test
# Tests all available hooks in claude-flow@alpha

SESSION_DIR="sessions/session-20251115-210537-claude-flow-integration-testing/artifacts"

echo "🪝 Testing Hook System..."
echo "=================================="
echo ""

# Test 1: Pre-Task Hook
echo "📋 Test 1: pre-task hook"
echo "----------------------------"
npx claude-flow@alpha hooks pre-task \
  --description "Test pre-task hook" \
  --task-id "hook-test-1"
echo ""

# Test 2: Post-Task Hook
echo "📋 Test 2: post-task hook"
echo "----------------------------"
npx claude-flow@alpha hooks post-task \
  --task-id "hook-test-1" \
  --status "completed"
echo ""

# Test 3: Pre-Edit Hook
echo "📋 Test 3: pre-edit hook"
echo "----------------------------"
npx claude-flow@alpha hooks pre-edit \
  --file "$SESSION_DIR/code/test.js" \
  --auto-assign-agents true \
  --load-context true
echo ""

# Test 4: Post-Edit Hook
echo "📋 Test 4: post-edit hook"
echo "----------------------------"
npx claude-flow@alpha hooks post-edit \
  --file "$SESSION_DIR/code/test.js" \
  --format true \
  --update-memory true \
  --train-neural false
echo ""

# Test 5: Pre-Command Hook
echo "📋 Test 5: pre-command hook"
echo "----------------------------"
npx claude-flow@alpha hooks pre-command \
  --command "npm test" \
  --validate-safety true
echo ""

# Test 6: Post-Command Hook
echo "📋 Test 6: post-command hook"
echo "----------------------------"
npx claude-flow@alpha hooks post-command \
  --command "npm test" \
  --track-metrics true \
  --store-results true
echo ""

# Test 7: Notify Hook
echo "📋 Test 7: notify hook"
echo "----------------------------"
npx claude-flow@alpha hooks notify \
  --message "Hook test completed" \
  --level "success"
echo ""

# Test 8: Session End Hook (without actually ending)
echo "📋 Test 8: session-end hook (dry run)"
echo "----------------------------"
echo "ℹ️  Would run: hooks session-end --generate-summary true --export-metrics true"
echo "   (Skipping to avoid ending current session)"
echo ""

echo "=================================="
echo "✅ Hook system test complete"
