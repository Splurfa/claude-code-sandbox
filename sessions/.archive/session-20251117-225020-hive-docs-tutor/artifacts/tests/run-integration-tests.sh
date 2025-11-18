#!/bin/bash
# Tutor-Mode Integration Test Runner
# Session: session-20251117-225020-hive-docs-tutor
# Namespace: hive-wizard-20251117

set -e  # Exit on error

SESSION_ID="session-20251117-225020-hive-docs-tutor"
NAMESPACE="hive-wizard-20251117"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_FILE="$SCRIPT_DIR/tutor-mode.test.js"

echo "======================================================================"
echo "  Tutor-Mode Integration Test Suite"
echo "======================================================================"
echo ""
echo "Session:   $SESSION_ID"
echo "Namespace: $NAMESPACE"
echo "Test File: $TEST_FILE"
echo ""

# Pre-test hook
echo "🔄 Running pre-task hook..."
npx claude-flow@alpha hooks pre-task \
  --description "Run tutor-mode integration tests" \
  --task-id "tutor-test-$(date +%s)"

# Run tests
echo ""
echo "🧪 Executing tests..."
echo ""

node "$TEST_FILE"
TEST_EXIT_CODE=$?

echo ""
echo "======================================================================"

# Store results in memory via MCP
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo "✅ All tests PASSED"
  STATUS="completed"
else
  echo "❌ Some tests FAILED"
  STATUS="failed"
fi

# Post-test hook
echo ""
echo "🔄 Running post-task hook..."
npx claude-flow@alpha hooks post-task \
  --task-id "tutor-test-$(date +%s)" \
  --status "$STATUS"

echo ""
echo "======================================================================"
echo "Test execution complete!"
echo ""
echo "📋 To view results in memory:"
echo "   mcp__claude-flow_alpha__memory_usage({"
echo "     action: 'retrieve',"
echo "     key: 'coordination/tutor-tests/results',"
echo "     namespace: '$NAMESPACE'"
echo "   })"
echo ""

exit $TEST_EXIT_CODE
