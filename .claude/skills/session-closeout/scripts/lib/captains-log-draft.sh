#!/usr/bin/env bash
# Captain's Log Draft Generation and HITL Approval
# Functions for generating, reviewing, and writing Captain's Log entries

# generate_captains_log_draft: Create draft entry from session summary
# Arguments:
#   $1 - Session ID
#   $2 - Path to session-summary.md
# Returns:
#   Path to draft file
generate_captains_log_draft() {
  local session_id="$1"
  local summary_file="$2"
  local draft_file="sessions/$session_id/captains-log-draft.md"

  # Extract key information from session-summary.md
  local title=$(grep "^# " "$summary_file" | head -1 | sed 's/^# //')
  local duration=$(grep "^\*\*Duration\*\*:" "$summary_file" | sed 's/^**Duration**: //' | sed 's/ *$//')

  # Extract objectives (between ## Objectives and next ##)
  local objectives=$(awk '/^## Objectives/,/^##/ {if (/^## Objectives/) next; if (/^##/) exit; print}' "$summary_file" | head -5)

  # Extract key findings/accomplishments
  local findings=$(awk '/^## (Key Findings|Work Completed|Outcome)/,/^##/ {if (/^## /) next; if (/^---/) exit; print}' "$summary_file" | head -8)

  # Extract deliverables count
  local deliverables=$(awk '/^## Deliverables/,/^##/ {if (/^## Deliverables/) next; if (/^---/) exit; print}' "$summary_file" | grep "^###" | wc -l | tr -d ' ')

  # Get total files
  local total_files=$(awk '/^\*\*Total\*\*:/ {print; exit}' "$summary_file" | sed 's/^**Total**: //')

  # Generate structured draft
  cat > "$draft_file" <<EOF
## [$(date +%H:%M)] session-closeout

**Session**: $session_id
**Topic**: $title
**Duration**: $duration

**Objectives**:
$objectives

**Key Accomplishments**:
$findings

**Deliverables**: $total_files

**Status**: Session closed and archived to sessions/.archive/

---
EOF

  echo "$draft_file"
}

# review_captains_log_draft: Interactive review and approval
# Arguments:
#   $1 - Path to draft file
# Returns:
#   0 if approved, 1 if rejected
review_captains_log_draft() {
  local draft_file="$1"

  echo "📖 Captain's Log Entry Draft"
  echo "═══════════════════════════════════════"
  cat "$draft_file"
  echo "═══════════════════════════════════════"
  echo
  echo "Review options:"
  echo "  (y) Accept and write to Captain's Log"
  echo "  (e) Edit draft (opens in \$EDITOR)"
  echo "  (n) Skip Captain's Log entry"
  echo

  read -p "Choice [y/e/n]: " -n 1 -r
  echo

  case "$REPLY" in
    [Yy])
      return 0  # Approved
      ;;
    [Ee])
      ${EDITOR:-nano} "$draft_file"
      echo
      echo "Review edited draft:"
      echo "═══════════════════════════════════════"
      cat "$draft_file"
      echo "═══════════════════════════════════════"
      echo
      read -p "Accept edited version? (y/N): " -n 1 -r
      echo
      [[ $REPLY =~ ^[Yy]$ ]] && return 0 || return 1
      ;;
    *)
      return 1  # Rejected
      ;;
  esac
}

# write_captains_log_entry: Write approved entry to Captain's Log
# Arguments:
#   $1 - Path to draft file
# Returns:
#   0 if successful, 1 if failed
write_captains_log_entry() {
  local draft_file="$1"
  local entry_text=$(cat "$draft_file")

  # Call stock journal.sh hook
  bash .claude/hooks/journal.sh "$entry_text" "session-closeout" 2>/dev/null

  if [ $? -eq 0 ]; then
    echo "✅ Captain's Log updated"
    return 0
  else
    echo "⚠️  Captain's Log update failed (continuing closeout)"
    return 1
  fi
}
