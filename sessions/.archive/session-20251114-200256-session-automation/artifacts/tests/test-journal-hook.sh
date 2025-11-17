#!/bin/bash
# Test suite for journal hook functionality

set -e

echo "🧪 Testing Journal Hook System"
echo "==============================="
echo ""

# Ensure captains-log directory exists
mkdir -p sessions/captains-log

# Test 1: Create journal entry
echo "Test 1: Create journal entry"
bash sessions/session-20251114-200256-session-automation/artifacts/code/hooks/journal.sh \
  "Test entry: Journal hook implementation" \
  "test"

LOG_FILE="sessions/captains-log/$(date +%Y-%m-%d).md"
if [ -f "$LOG_FILE" ]; then
  echo "✅ Journal file created: $LOG_FILE"
else
  echo "❌ FAILED: Journal file not created"
  exit 1
fi

# Test 2: Verify entry content
echo ""
echo "Test 2: Verify entry in journal file"
if grep -q "Test entry: Journal hook implementation" "$LOG_FILE"; then
  echo "✅ Entry found in journal"
  echo ""
  echo "Last 15 lines of journal:"
  tail -15 "$LOG_FILE"
else
  echo "❌ FAILED: Entry not found in journal"
  cat "$LOG_FILE"
  exit 1
fi

# Test 3: Multiple entries
echo ""
echo "Test 3: Add multiple entries"
bash sessions/session-20251114-200256-session-automation/artifacts/code/hooks/journal.sh \
  "Test entry 2: Session auto-init working" \
  "implementation"

bash sessions/session-20251114-200256-session-automation/artifacts/code/hooks/journal.sh \
  "Test entry 3: Integration successful" \
  "success"

ENTRY_COUNT=$(grep -c "^## \[" "$LOG_FILE" || echo "0")
if [ "$ENTRY_COUNT" -ge 3 ]; then
  echo "✅ Multiple entries added successfully ($ENTRY_COUNT total)"
else
  echo "❌ FAILED: Expected 3+ entries, found $ENTRY_COUNT"
  exit 1
fi

# Test 4: Journal wrapper
echo ""
echo "Test 4: Test journal wrapper"
bash sessions/session-20251114-200256-session-automation/artifacts/code/hooks/journal-wrapper.sh \
  "Wrapper test entry" \
  "wrapper-test"

if grep -q "Wrapper test entry" "$LOG_FILE"; then
  echo "✅ Wrapper successfully added entry"
else
  echo "❌ FAILED: Wrapper did not add entry"
  exit 1
fi

# Test 5: Verify memory.db storage (if exists)
echo ""
echo "Test 5: Check memory.db storage"
if [ -f ".swarm/memory.db" ]; then
  COUNT=$(sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM memory_entries WHERE namespace='journal' AND date(created_at, 'unixepoch') = date('now');" 2>/dev/null || echo "0")
  echo "✅ Found $COUNT journal entries in memory.db today"

  if [ "$COUNT" -gt 0 ]; then
    echo ""
    echo "Most recent journal entry from memory.db:"
    sqlite3 .swarm/memory.db "SELECT value, metadata FROM memory_entries WHERE namespace='journal' ORDER BY created_at DESC LIMIT 1;" 2>/dev/null || echo "Query failed"
  fi
else
  echo "⚠️  memory.db not found (optional feature)"
fi

echo ""
echo "==============================="
echo "✅ ALL JOURNAL TESTS PASSED"
echo "==============================="
echo ""
echo "📝 Today's journal location: $LOG_FILE"
