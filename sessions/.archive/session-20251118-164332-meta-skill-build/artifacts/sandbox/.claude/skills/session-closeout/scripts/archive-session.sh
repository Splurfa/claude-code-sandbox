#!/bin/bash
# Stock-first session archival script
# Handles session directory movement to archive

set -e

SESSION_ID="$1"

if [[ -z "$SESSION_ID" ]]; then
  echo "Usage: $0 <session-id>"
  exit 1
fi

SESSION_PATH="sessions/$SESSION_ID"
ARCHIVE_PATH="sessions/.archive/$SESSION_ID"

# Verify session exists
if [[ ! -d "$SESSION_PATH" ]]; then
  echo "❌ Session not found: $SESSION_PATH"
  exit 1
fi

# Check if already archived
if [[ -d "$ARCHIVE_PATH" ]]; then
  echo "⚠️  Session already archived: $ARCHIVE_PATH"
  exit 0
fi

# Read metadata status
METADATA="$SESSION_PATH/metadata.json"
if [[ -f "$METADATA" ]]; then
  if command -v jq &> /dev/null; then
    STATUS=$(jq -r '.status // "unknown"' "$METADATA")
    if [[ "$STATUS" != "closed" ]]; then
      echo "⚠️  Session status: $STATUS (expected: closed)"
      echo "Session should be closed before archiving."
      exit 1
    fi
  fi
fi

# Move to archive (atomic operation)
echo "📦 Moving session to archive..."
mkdir -p sessions/.archive
mv "$SESSION_PATH" "$ARCHIVE_PATH"

echo "✅ Session archived: $ARCHIVE_PATH"
