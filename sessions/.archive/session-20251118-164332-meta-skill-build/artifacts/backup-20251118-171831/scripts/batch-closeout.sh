#!/bin/bash
# Batch session closeout with captain's log entries

CURRENT_SESSION="session-20251114-153041-dream-hive-meta-coordination"
LOG_FILE="sessions/captains-log/$(date +%Y-%m-%d).md"

# Sessions to close
SESSIONS=(
  "session-20251113-211159-hive-mind-setup"
  "session-20251113-211159-hive-mind-setup.backup-before-flatten"
  "session-20251114-120738-system-validation"
  "session-20251114-145225-dream-hive-production-readiness"
  "session-20251114-145540-adversarial-testing"
  "session-20251114-153041-infrastructure-audit"
  "session-20251114-174024-readme-documentation"
  "session-20251114-200256-session-automation"
  "session-20251114-200257-reasoningbank-learning"
  "session-20251114-210519-deployment-verification-test"
  "test-session-1"
  "test-session-2"
  "test-session-3"
)

echo "Starting batch closeout of ${#SESSIONS[@]} sessions..."

for session in "${SESSIONS[@]}"; do
  echo "Closing: $session"

  # Generate summary from session if it exists
  if [ -f "sessions/$session/session-summary.md" ]; then
    SUMMARY=$(head -10 "sessions/$session/session-summary.md" | tail -5)
  else
    SUMMARY="Session closed during workspace cleanup"
  fi

  # Add to captain's log
  cat >> "$LOG_FILE" <<EOF

## [$(date +%H:%M)] session-closed

**Session:** $session
**Status:** Closed during workspace cleanup
**Summary:** $SUMMARY

EOF

  # Update session metadata if it exists
  if [ -f "sessions/$session/metadata.json" ]; then
    if command -v jq &> /dev/null; then
      jq '. + {status: "closed", closed_at: now | todate}' \
        "sessions/$session/metadata.json" > temp.json && \
        mv temp.json "sessions/$session/metadata.json"
    else
      # Fallback: manual JSON update
      echo "{\"status\": \"closed\", \"closed_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" > "sessions/$session/metadata-closeout.json"
    fi
  fi

  # Create backup
  npx claude-flow@alpha hooks session-end \
    --session-id "$session" \
    --export-metrics true 2>/dev/null || echo "  (no hooks backup created)"
done

echo ""
echo "✅ Batch closeout complete"
echo "📊 Closed: ${#SESSIONS[@]} sessions"
echo "📝 Log updated: $LOG_FILE"
echo ""
echo "Remaining sessions:"
ls -1 sessions/ | grep "^session-"
