#!/usr/bin/env bash
set -euo pipefail

# Session Metadata Repair Script
# Fixes inconsistent session states by implementing proper lifecycle

WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "$WORKSPACE_ROOT"

echo "🔧 Session Metadata Repair"
echo "=========================="
echo

# Find all session metadata files
SESSIONS=($(find sessions -name "metadata.json" -type f | grep -v ".backup" | sort))

if [ ${#SESSIONS[@]} -eq 0 ]; then
  echo "❌ No session metadata files found"
  exit 1
fi

echo "📋 Found ${#SESSIONS[@]} session(s)"
echo

# Track statistics
FIXED=0
ALREADY_VALID=0
SKIPPED=0

for session_meta in "${SESSIONS[@]}"; do
  SESSION_DIR="$(dirname "$session_meta")"
  SESSION_ID="$(basename "$SESSION_DIR")"

  echo "🔍 Analyzing: $SESSION_ID"

  # Read current status
  CURRENT_STATUS=$(jq -r '.status // "unknown"' "$session_meta")
  CLOSED_AT=$(jq -r '.closed_at // "null"' "$session_meta")
  CREATED_AT=$(jq -r '.created_at // "null"' "$session_meta")

  echo "   Current status: $CURRENT_STATUS"

  # Determine correct state
  NEW_STATUS="$CURRENT_STATUS"
  NEEDS_FIX=false

  # Rule 1: If status is "closed" but this is the current active session, mark as ACTIVE
  CURRENT_SESSION=$(cat .current-session 2>/dev/null || echo "")
  if [ "$SESSION_ID" = "$CURRENT_SESSION" ]; then
    if [ "$CURRENT_STATUS" = "closed" ] || [ "$CURRENT_STATUS" = "paused" ]; then
      NEW_STATUS="active"
      NEEDS_FIX=true
      echo "   ⚠️  Current session marked as $CURRENT_STATUS - should be ACTIVE"
    fi
  else
    # Rule 2: If status is "closed" and has closed_at, keep as closed
    if [ "$CURRENT_STATUS" = "closed" ] && [ "$CLOSED_AT" != "null" ]; then
      echo "   ✅ Already closed properly"
      ((ALREADY_VALID++))
      continue
    fi

    # Rule 3: If status is "active" but not current session, mark as PAUSED
    if [ "$CURRENT_STATUS" = "active" ]; then
      NEW_STATUS="paused"
      NEEDS_FIX=true
      echo "   ⚠️  Inactive session marked as active - should be PAUSED"
    fi
  fi

  # Rule 4: If status is unknown or invalid, infer from context
  if [ "$CURRENT_STATUS" = "unknown" ] || [ "$CURRENT_STATUS" = "null" ]; then
    if [ "$SESSION_ID" = "$CURRENT_SESSION" ]; then
      NEW_STATUS="active"
    else
      NEW_STATUS="paused"
    fi
    NEEDS_FIX=true
    echo "   ⚠️  Invalid status - inferring as $NEW_STATUS"
  fi

  # Apply fix if needed
  if [ "$NEEDS_FIX" = true ]; then
    # Backup original
    cp "$session_meta" "$session_meta.backup-$(date +%Y%m%d-%H%M%S)"

    # Build new metadata
    if [ "$NEW_STATUS" = "active" ]; then
      jq --arg status "$NEW_STATUS" \
         --arg resumed "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
         '. + {status: $status, last_resumed_at: $resumed} | del(.closed_at, .paused_at)' \
         "$session_meta" > "$session_meta.tmp"
    elif [ "$NEW_STATUS" = "paused" ]; then
      jq --arg status "$NEW_STATUS" \
         --arg paused "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
         '. + {status: $status, paused_at: $paused, pause_reason: "auto-detected inactive"} | del(.closed_at)' \
         "$session_meta" > "$session_meta.tmp"
    fi

    mv "$session_meta.tmp" "$session_meta"
    echo "   ✅ Fixed: $CURRENT_STATUS → $NEW_STATUS"
    ((FIXED++))
  else
    echo "   ✅ Already valid"
    ((ALREADY_VALID++))
  fi

  echo
done

echo "📊 Summary"
echo "=========="
echo "Fixed:         $FIXED"
echo "Already valid: $ALREADY_VALID"
echo "Skipped:       $SKIPPED"
echo
echo "✅ Metadata repair complete"
