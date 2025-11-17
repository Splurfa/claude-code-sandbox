#!/bin/bash
# Test suite for session auto-init functionality

set -e

echo "🧪 Testing Session Auto-Init System"
echo "===================================="
echo ""

# Backup current session if exists
if [ -f ".current-session" ]; then
  mv .current-session .current-session.backup
  echo "✅ Backed up existing session"
fi

# Test 1: Auto-init with topic
echo "Test 1: Auto-init with topic"
bash sessions/session-20251114-200256-session-automation/artifacts/code/session/auto-init.sh "test-topic"

if [ -f ".current-session" ]; then
  SESSION_ID=$(cat .current-session)
  echo "✅ Session created: $SESSION_ID"
else
  echo "❌ FAILED: .current-session not created"
  exit 1
fi

# Test 2: Verify session structure
echo ""
echo "Test 2: Verify session structure"
if [ -d "sessions/$SESSION_ID/artifacts/code" ] && \
   [ -d "sessions/$SESSION_ID/artifacts/tests" ] && \
   [ -d "sessions/$SESSION_ID/artifacts/docs" ] && \
   [ -d "sessions/$SESSION_ID/artifacts/scripts" ] && \
   [ -d "sessions/$SESSION_ID/artifacts/notes" ]; then
  echo "✅ All artifact directories created"
else
  echo "❌ FAILED: Missing artifact directories"
  ls -la "sessions/$SESSION_ID/artifacts/" 2>/dev/null || echo "No artifacts directory"
  exit 1
fi

# Test 3: Verify metadata
echo ""
echo "Test 3: Verify metadata.json"
if [ -f "sessions/$SESSION_ID/metadata.json" ]; then
  echo "✅ metadata.json exists"
  cat "sessions/$SESSION_ID/metadata.json"
else
  echo "❌ FAILED: metadata.json not created"
  exit 1
fi

# Test 4: Verify session summary
echo ""
echo "Test 4: Verify session-summary.md"
if [ -f "sessions/$SESSION_ID/session-summary.md" ]; then
  echo "✅ session-summary.md exists"
  head -10 "sessions/$SESSION_ID/session-summary.md"
else
  echo "❌ FAILED: session-summary.md not created"
  exit 1
fi

# Test 5: Detect existing session
echo ""
echo "Test 5: Detect existing session (should not create new)"
BEFORE_ID=$(cat .current-session)
bash sessions/session-20251114-200256-session-automation/artifacts/code/session/auto-init.sh "another-topic"
AFTER_ID=$(cat .current-session)

if [ "$BEFORE_ID" = "$AFTER_ID" ]; then
  echo "✅ Existing session detected, no new session created"
else
  echo "❌ FAILED: New session created when one already exists"
  exit 1
fi

# Test 6: Detect-and-init script
echo ""
echo "Test 6: Detect-and-init wrapper"
bash sessions/session-20251114-200256-session-automation/artifacts/code/session/detect-and-init.sh "wrapper-test"
WRAPPER_ID=$(cat .current-session)

if [ "$WRAPPER_ID" = "$AFTER_ID" ]; then
  echo "✅ Wrapper correctly detected existing session"
else
  echo "❌ FAILED: Wrapper created new session unnecessarily"
  exit 1
fi

# Cleanup test session
echo ""
echo "Cleanup: Removing test session"
rm -f .current-session
rm -rf "sessions/$SESSION_ID"

# Restore original session if backed up
if [ -f ".current-session.backup" ]; then
  mv .current-session.backup .current-session
  echo "✅ Restored original session"
fi

echo ""
echo "===================================="
echo "✅ ALL TESTS PASSED"
echo "===================================="
