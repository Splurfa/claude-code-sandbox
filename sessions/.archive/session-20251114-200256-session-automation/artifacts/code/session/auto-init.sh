#!/bin/bash
# Stock-first session auto-init using standard Unix tools
# Usage: ./auto-init.sh [topic]

set -e

# Detect if session exists
if [ -f ".current-session" ]; then
  SESSION_ID=$(cat .current-session)
  echo "📂 Active session: $SESSION_ID"
  exit 0
fi

# Generate session ID (stock date command)
TOPIC="${1:-general}"
# Sanitize topic: lowercase, replace spaces with hyphens, limit length
TOPIC=$(echo "$TOPIC" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9 -]//g' | tr ' ' '-' | cut -c1-30)
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-$TOPIC"

echo "🚀 Initializing new session: $SESSION_ID"

# Create session structure (stock mkdir)
mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}

# Create metadata (stock cat with heredoc)
cat > "sessions/$SESSION_ID/metadata.json" <<EOF
{
  "session_id": "$SESSION_ID",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "active",
  "topic": "$TOPIC"
}
EOF

# Create session summary (stock cat)
cat > "sessions/$SESSION_ID/session-summary.md" <<EOF
# Session: $SESSION_ID

**Started:** $(date)
**Status:** Active
**Topic:** $TOPIC

## Progress

- Session initialized at $(date +%H:%M:%S)

## Artifacts

### Code
\`sessions/$SESSION_ID/artifacts/code/\`

### Tests
\`sessions/$SESSION_ID/artifacts/tests/\`

### Documentation
\`sessions/$SESSION_ID/artifacts/docs/\`

### Scripts
\`sessions/$SESSION_ID/artifacts/scripts/\`

### Notes
\`sessions/$SESSION_ID/artifacts/notes/\`

EOF

# Track current session (stock echo)
echo "$SESSION_ID" > .current-session

# Run stock pre-task hook (silent failure if not available)
if command -v npx >/dev/null 2>&1; then
  npx claude-flow@alpha hooks pre-task \
    --description "Session initialization: $TOPIC" \
    --task-id "$SESSION_ID" 2>/dev/null || true
fi

echo "✅ Session $SESSION_ID initialized"
echo "📁 Artifacts directory: sessions/$SESSION_ID/artifacts/"
echo ""
echo "File routing rules:"
echo "  Code:    sessions/$SESSION_ID/artifacts/code/"
echo "  Tests:   sessions/$SESSION_ID/artifacts/tests/"
echo "  Docs:    sessions/$SESSION_ID/artifacts/docs/"
echo "  Scripts: sessions/$SESSION_ID/artifacts/scripts/"
echo "  Notes:   sessions/$SESSION_ID/artifacts/notes/"
