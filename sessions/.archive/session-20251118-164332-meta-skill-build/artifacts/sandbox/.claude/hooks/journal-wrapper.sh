#!/bin/bash
# Wrapper to integrate with npx claude-flow@alpha hooks journal pattern
# This bridges stock claude-flow hooks with our custom journal implementation

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Try to find journal.sh in various locations
if [ -f "$SCRIPT_DIR/journal.sh" ]; then
  bash "$SCRIPT_DIR/journal.sh" "$@"
elif [ -f ".claude/hooks/journal.sh" ]; then
  bash .claude/hooks/journal.sh "$@"
elif [ -f "sessions/session-*/artifacts/code/hooks/journal.sh" ]; then
  # Find most recent session's journal.sh
  JOURNAL_SH=$(find sessions/session-*/artifacts/code/hooks/journal.sh 2>/dev/null | head -n 1)
  if [ -n "$JOURNAL_SH" ]; then
    bash "$JOURNAL_SH" "$@"
  fi
else
  echo "Error: journal.sh not found" >&2
  exit 1
fi
