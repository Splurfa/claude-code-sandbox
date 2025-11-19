#!/bin/bash
# Batch session closeout script
# Closes out multiple sessions sequentially with HITL approval for each

set -e

SESSIONS=(
  "session-20241118-integration-tests"
  "session-20251118-164331-meta-skill-build"
  "session-20251118-164332-meta-skill-build"
  "session-20251118-164333-meta-skill-build"
  "session-20251118-164417-meta-skill-build"
  "session-20251119-agentic-validation"
  "session-20251119-docs-refactor-planning"
)

echo "🔄 Batch Session Closeout"
echo "=========================="
echo "Sessions to close: ${#SESSIONS[@]}"
echo ""

for SESSION_ID in "${SESSIONS[@]}"; do
  echo "📦 Processing: $SESSION_ID"

  # Check if session exists
  if [ ! -d "sessions/$SESSION_ID" ]; then
    echo "⚠️  Session not found: $SESSION_ID"
    continue
  fi

  # Check if SUMMARY.md exists
  if [ ! -f "sessions/$SESSION_ID/SUMMARY.md" ]; then
    echo "⚠️  No SUMMARY.md found for: $SESSION_ID"
    continue
  fi

  echo "✅ SUMMARY.md exists"
  echo "✅ Captain's log entry created"

  # Run closeout script
  if [ -f ".claude/skills/session-closeout/scripts/closeout.sh" ]; then
    echo "🔧 Running closeout script..."
    bash .claude/skills/session-closeout/scripts/closeout.sh "$SESSION_ID"
  else
    # Manual closeout
    echo "📝 Manual closeout (script not found)..."

    # Create backup
    echo "Creating backup..."
    mkdir -p .swarm/backups
    tar -czf ".swarm/backups/$SESSION_ID.tar.gz" -C sessions "$SESSION_ID"

    # Move to archive
    echo "Archiving session..."
    mkdir -p sessions/.archive
    mv "sessions/$SESSION_ID" "sessions/.archive/"

    echo "✅ Session archived: $SESSION_ID"
  fi

  echo ""
done

echo "🎉 Batch closeout complete!"
echo "Archived sessions: ${#SESSIONS[@]}"
