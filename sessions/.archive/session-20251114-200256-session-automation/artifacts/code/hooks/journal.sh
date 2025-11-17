#!/bin/bash
# Stock-first journal hook for Captain's Log entries
# Usage: ./journal.sh "Entry text" [category]

set -e

ENTRY="${1:?Entry text required}"
CATEGORY="${2:-decision}"

# Get or create today's log file
LOG_DIR="sessions/captains-log"
LOG_FILE="$LOG_DIR/$(date +%Y-%m-%d).md"

mkdir -p "$LOG_DIR"

# Create file if doesn't exist
if [ ! -f "$LOG_FILE" ]; then
  cat > "$LOG_FILE" <<EOF
# Captain's Log - $(date +%Y-%m-%d)

**Daily chronicle of decisions, insights, and blockers**

---

EOF
fi

# Append entry with timestamp (stock cat/echo)
cat >> "$LOG_FILE" <<EOF

## [$(date +%H:%M)] $CATEGORY

$ENTRY

EOF

# Store in memory.db if available (stock sqlite3)
if [ -f ".swarm/memory.db" ]; then
  # Escape single quotes in entry for SQL
  ESCAPED_ENTRY=$(echo "$ENTRY" | sed "s/'/''/g")
  ESCAPED_CATEGORY=$(echo "$CATEGORY" | sed "s/'/''/g")

  sqlite3 .swarm/memory.db <<SQL
INSERT OR IGNORE INTO memory_entries (key, value, namespace, metadata)
VALUES (
  'captains-log-$(date +%s)',
  '$ESCAPED_ENTRY',
  'journal',
  '{"category": "$ESCAPED_CATEGORY", "date": "$(date +%Y-%m-%d)", "time": "$(date +%H:%M)"}'
);
SQL
fi

echo "✅ Journal entry added to $LOG_FILE"
echo "📝 Category: $CATEGORY"
