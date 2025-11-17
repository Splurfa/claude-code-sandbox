#!/bin/bash
# Auto-detect if session init needed
# Usage: ./detect-and-init.sh [inferred-topic-from-first-message]

# Check 1: .current-session exists?
if [ -f ".current-session" ]; then
  # Session already active
  exit 0
fi

# Check 2: Any recent sessions (< 4 hours old)?
if [ -d "sessions" ]; then
  RECENT=$(find sessions/ -name "session-*" -type d -mmin -240 2>/dev/null | wc -l | tr -d ' ')
  if [ "$RECENT" -gt 0 ]; then
    # Recent session exists, assume continuation
    exit 0
  fi
fi

# No active session found, auto-init
# Extract topic from arguments (sanitize user's first message)
TOPIC=$(echo "$@" | sed 's/[^a-zA-Z0-9 ]//g' | tr ' ' '-' | cut -c1-30)

# Default to "general" if no topic provided
if [ -z "$TOPIC" ]; then
  TOPIC="general"
fi

# Get script directory to find auto-init.sh
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Call auto-init
if [ -f "$SCRIPT_DIR/auto-init.sh" ]; then
  bash "$SCRIPT_DIR/auto-init.sh" "$TOPIC"
else
  # Fallback: try from project root
  bash .claude/session/auto-init.sh "$TOPIC" 2>/dev/null || \
  bash sessions/session-*/artifacts/code/session/auto-init.sh "$TOPIC"
fi
