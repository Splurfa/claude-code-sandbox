#!/bin/bash

###############################################################################
# File Router Activation Script
#
# Integrates file-router-validation.js into claude-flow hooks system
# to prevent CLAUDE.md violations in real-time.
#
# USAGE:
#   bash activate-file-router.sh
#
# WHAT IT DOES:
#   1. Copies validation hook to .swarm/hooks/
#   2. Makes hook executable
#   3. Creates wrapper for pre-edit integration
#   4. Tests enforcement with sample violations
#   5. Stores activation status in memory
#
###############################################################################

set -euo pipefail

WORKSPACE_ROOT="/Users/splurfa/common-thread-sandbox"
SESSION_ID="$(cat $WORKSPACE_ROOT/.current-session 2>/dev/null || echo 'session-default')"
HOOKS_DIR="$WORKSPACE_ROOT/.swarm/hooks"
VALIDATION_HOOK="$HOOKS_DIR/file-router-validation.js"

echo "🚀 File Router Activation"
echo "========================="
echo "Session: $SESSION_ID"
echo ""

# Step 1: Ensure hooks directory exists
if [ ! -d "$HOOKS_DIR" ]; then
  echo "📁 Creating hooks directory..."
  mkdir -p "$HOOKS_DIR"
  echo "✓ Created $HOOKS_DIR"
else
  echo "✓ Hooks directory exists: $HOOKS_DIR"
fi

# Step 2: Make validation hook executable
if [ -f "$VALIDATION_HOOK" ]; then
  echo "✓ Validation hook found: $VALIDATION_HOOK"
  chmod +x "$VALIDATION_HOOK"
  echo "✓ Made hook executable"
else
  echo "❌ ERROR: Validation hook not found at $VALIDATION_HOOK"
  echo "Expected hook to be installed in .swarm/hooks/"
  exit 1
fi

# Step 3: Test the hook standalone
echo ""
echo "🧪 Testing Hook Standalone"
echo "-------------------------"

# Test 1: Valid session path
echo "Test 1: Valid session artifact path..."
if node "$VALIDATION_HOOK" validate "sessions/$SESSION_ID/artifacts/code/app.js" "$SESSION_ID" &>/dev/null; then
  echo "✓ Session artifact paths allowed"
else
  echo "❌ FAILED: Session artifacts should be allowed"
  exit 1
fi

# Test 2: Invalid root tests/ path
echo "Test 2: Invalid root tests/ path..."
if node "$VALIDATION_HOOK" validate "tests/app.test.js" "$SESSION_ID" &>/dev/null; then
  echo "❌ FAILED: Root tests/ should be rejected"
  exit 1
else
  echo "✓ Root tests/ correctly rejected"
fi

# Test 3: Invalid root docs/ path
echo "Test 3: Invalid root docs/ path..."
if node "$VALIDATION_HOOK" validate "docs/guide.md" "$SESSION_ID" &>/dev/null; then
  echo "❌ FAILED: Root docs/ should be rejected"
  exit 1
else
  echo "✓ Root docs/ correctly rejected"
fi

# Test 4: Valid permanent docs path
echo "Test 4: Valid permanent docs/ path..."
if node "$VALIDATION_HOOK" validate "docs/projects/myproject/README.md" "$SESSION_ID" &>/dev/null; then
  echo "✓ Permanent docs/projects/ allowed"
else
  echo "❌ FAILED: docs/projects/ should be allowed"
  exit 1
fi

# Test 5: Invalid test- prefix
echo "Test 5: Invalid test- prefix path..."
if node "$VALIDATION_HOOK" validate "test-workflow/file.js" "$SESSION_ID" &>/dev/null; then
  echo "❌ FAILED: test- prefix should be rejected"
  exit 1
else
  echo "✓ test- prefix correctly rejected"
fi

echo ""
echo "✅ All standalone tests passed!"

# Step 4: Detect existing violations
echo ""
echo "🔍 Scanning for Existing Violations"
echo "-----------------------------------"
node "$VALIDATION_HOOK" detect || {
  echo ""
  echo "⚠️  Violations found - consider cleaning up"
  echo "   (Non-fatal - activation continues)"
}

# Step 5: Create pre-edit wrapper hook
echo ""
echo "🔧 Creating Pre-Edit Wrapper"
echo "---------------------------"

PRE_EDIT_WRAPPER="$HOOKS_DIR/pre-edit-file-router.sh"
cat > "$PRE_EDIT_WRAPPER" <<'EOF'
#!/bin/bash
# Pre-Edit File Router Wrapper
# Called by claude-flow hooks pre-edit --file <path>

FILE_PATH="${1:-}"
if [ -z "$FILE_PATH" ]; then
  echo "ERROR: No file path provided to pre-edit hook"
  exit 1
fi

# Run validation hook
HOOKS_DIR="$(dirname "$0")"
node "$HOOKS_DIR/file-router-validation.js" hook "$FILE_PATH"
EOF

chmod +x "$PRE_EDIT_WRAPPER"
echo "✓ Created pre-edit wrapper: $PRE_EDIT_WRAPPER"

# Step 6: Store activation status in memory
echo ""
echo "💾 Storing Activation Status"
echo "----------------------------"

npx claude-flow@alpha hooks memory store \
  --key "dream-hive/file-router/activated" \
  --value "{\"status\":\"active\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"session\":\"$SESSION_ID\",\"hook_path\":\"$VALIDATION_HOOK\"}" \
  --namespace "coordination" || {
    echo "⚠️  Memory storage failed (non-fatal)"
  }

npx claude-flow@alpha hooks notify \
  --message "📋 File Router Activated - CLAUDE.md violations now blocked automatically" \
  --level "info" || {
    echo "⚠️  Captain's log notification failed (non-fatal)"
  }

# Step 7: Final verification
echo ""
echo "🎯 Integration Complete!"
echo "======================="
echo ""
echo "✅ File Router Status: ACTIVE"
echo "✅ Hook Location: $VALIDATION_HOOK"
echo "✅ Pre-Edit Wrapper: $PRE_EDIT_WRAPPER"
echo ""
echo "ENFORCEMENT RULES:"
echo "  🚫 Root tests/ directory"
echo "  🚫 Root docs/ directory (except docs/projects/, docs/protocols/, etc.)"
echo "  🚫 Root scripts/ directory"
echo "  🚫 test- prefixed directories"
echo "  ✅ sessions/<session-id>/artifacts/{code,tests,docs,scripts,notes}/"
echo "  ✅ docs/projects/, docs/protocols/, docs/guides/, docs/reference/"
echo "  ✅ inbox/ and .inbox/"
echo ""
echo "USAGE:"
echo "  Automatic enforcement via claude-flow hooks pre-edit"
echo "  Manual validation: node $VALIDATION_HOOK validate <path>"
echo "  Detect violations: node $VALIDATION_HOOK detect"
echo ""
echo "🎉 File router is now protecting your workspace!"
