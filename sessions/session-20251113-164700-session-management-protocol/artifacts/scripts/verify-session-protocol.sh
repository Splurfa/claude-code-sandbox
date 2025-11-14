#!/bin/bash
# Session Protocol Verification Script
# Usage: ./scripts/verify-session-protocol.sh <session-id>

set -e

SESSION_ID="${1:-session-$(date +%Y%m%d-%H%M%S)-test}"
FAILED=0

echo "========================================"
echo "Session Protocol Verification"
echo "========================================"
echo "Session ID: $SESSION_ID"
echo ""

# Helper functions
check_pass() {
  echo "✓ $1"
}

check_fail() {
  echo "✗ $1"
  FAILED=$((FAILED + 1))
}

# Phase 1: Initialization
echo "Phase 1: Initialization Checks"
echo "--------------------------------"

if [ -d "sessions/$SESSION_ID" ]; then
  check_pass "Session directory exists"
else
  check_fail "Session directory missing"
fi

if [ -d "sessions/$SESSION_ID/artifacts" ]; then
  check_pass "Artifacts directory exists"
else
  check_fail "Artifacts directory missing"
fi

if [ -f "sessions/$SESSION_ID/metadata.json" ]; then
  check_pass "Metadata file exists"

  # Validate JSON
  if jq empty "sessions/$SESSION_ID/metadata.json" 2>/dev/null; then
    check_pass "Metadata is valid JSON"
  else
    check_fail "Metadata is invalid JSON"
  fi
else
  check_fail "Metadata file missing"
fi

if [ -f "sessions/$SESSION_ID/session-summary.md" ]; then
  check_pass "Session summary exists"
else
  check_fail "Session summary missing"
fi

echo ""

# Phase 2: Artifacts
echo "Phase 2: Artifacts Checks"
echo "-------------------------"

ARTIFACT_COUNT=$(find "sessions/$SESSION_ID/artifacts" -type f 2>/dev/null | wc -l | tr -d ' ')
if [ "$ARTIFACT_COUNT" -gt 0 ]; then
  check_pass "Artifacts created ($ARTIFACT_COUNT files)"
else
  echo "⚠ No artifacts found (may be normal if session just started)"
fi

for subdir in code tests docs scripts notes; do
  if [ -d "sessions/$SESSION_ID/artifacts/$subdir" ]; then
    check_pass "Artifact subdirectory exists: $subdir"
  fi
done

echo ""

# Phase 3: Integration
echo "Phase 3: Integration Checks"
echo "---------------------------"

# Check if hooks system knows about this session
if npx claude-flow@alpha hooks session-end --generate-summary true --dry-run 2>&1 | grep -q "session"; then
  check_pass "Hooks system integration"
else
  echo "⚠ Hooks integration check skipped (requires active session)"
fi

# Check memory.db exists
if [ -f ".swarm/memory.db" ]; then
  check_pass "Memory database exists"

  # Check database size
  DB_SIZE=$(stat -f%z ".swarm/memory.db" 2>/dev/null || stat -c%s ".swarm/memory.db" 2>/dev/null || echo "0")
  if [ "$DB_SIZE" -gt 0 ]; then
    check_pass "Memory database has data"
  else
    echo "⚠ Memory database is empty"
  fi
else
  check_fail "Memory database missing"
fi

echo ""

# Phase 4: Completion (if applicable)
echo "Phase 4: Completion Checks (if archived)"
echo "----------------------------------------"

if [ -d "sessions/completed/$SESSION_ID" ]; then
  check_pass "Session archived in completed/"

  if [ -f "sessions/completed/$SESSION_ID/ARTIFACTS-INDEX.md" ]; then
    check_pass "Artifacts index created"
  else
    check_fail "Artifacts index missing"
  fi

  # Check metadata status
  if jq -e '.status == "completed"' "sessions/completed/$SESSION_ID/metadata.json" >/dev/null 2>&1; then
    check_pass "Metadata status set to completed"
  else
    check_fail "Metadata status not updated"
  fi
else
  echo "⚠ Session not yet archived (session still active)"
fi

# Check for backup
BACKUP_PATTERN=".swarm/backups/session-backup-*.tar.gz"
if ls $BACKUP_PATTERN 1> /dev/null 2>&1; then
  BACKUP_COUNT=$(ls $BACKUP_PATTERN | wc -l | tr -d ' ')
  check_pass "Backup file(s) exist ($BACKUP_COUNT found)"
else
  echo "⚠ No backup files found (create with session-end hook)"
fi

echo ""

# Summary
echo "========================================"
echo "Summary"
echo "========================================"
if [ $FAILED -eq 0 ]; then
  echo "✓ All checks passed!"
  echo ""
  echo "Session structure:"
  tree "sessions/$SESSION_ID" 2>/dev/null || find "sessions/$SESSION_ID" -print | sed 's|[^/]*/|  |g'
  exit 0
else
  echo "✗ $FAILED check(s) failed"
  echo "Review the output above for details"
  exit 1
fi
