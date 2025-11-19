#!/usr/bin/env bash
# Closeout Preview Display Library
# Comprehensive preview of closeout actions before HITL approval

# show_closeout_preview: Display full closeout preview
# Arguments:
#   $1 - Session ID
#   $2 - Path to session-summary.md
# Effects:
#   Displays formatted preview of all closeout actions
show_closeout_preview() {
  local session_id="$1"
  local summary_file="$2"

  # Source required libraries
  local script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "$script_dir/captains-log-draft.sh"
  source "$script_dir/artifact-review.sh"
  source "$script_dir/doc-categorizer.sh"

  echo
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 CLOSEOUT PREVIEW"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo

  # Generate and display Captain's Log draft preview
  if [[ -f "$summary_file" ]]; then
    local draft_file=$(generate_captains_log_draft "$session_id" "$summary_file")

    echo "📖 Captain's Log Entry (Draft)"
    echo "───────────────────────────────"
    cat "$draft_file"
    echo

    # Cleanup draft
    rm -f "$draft_file" 2>/dev/null
  else
    echo "📖 Captain's Log Entry"
    echo "───────────────────────────────"
    echo "  ⚠️  No session summary found"
    echo
  fi

  # Show artifact summary counts
  echo "📦 Artifact Summary"
  echo "───────────────────────────────"

  local code_dir="sessions/$session_id/artifacts/code"
  local test_dir="sessions/$session_id/artifacts/tests"
  local script_dir="sessions/$session_id/artifacts/scripts"
  local notes_dir="sessions/$session_id/artifacts/notes"
  local docs_dir="sessions/$session_id/artifacts/docs"

  local code_count=0
  local test_count=0
  local script_count=0
  local notes_count=0
  local docs_count=0

  [[ -d "$code_dir" ]] && code_count=$(find "$code_dir" -type f 2>/dev/null | wc -l | tr -d ' ')
  [[ -d "$test_dir" ]] && test_count=$(find "$test_dir" -type f 2>/dev/null | wc -l | tr -d ' ')
  [[ -d "$script_dir" ]] && script_count=$(find "$script_dir" -type f 2>/dev/null | wc -l | tr -d ' ')
  [[ -d "$notes_dir" ]] && notes_count=$(find "$notes_dir" -type f 2>/dev/null | wc -l | tr -d ' ')
  [[ -d "$docs_dir" ]] && docs_count=$(find "$docs_dir" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')

  local code_size="0B"
  local test_size="0B"

  [[ -d "$code_dir" ]] && code_size=$(du -sh "$code_dir" 2>/dev/null | cut -f1)
  [[ -d "$test_dir" ]] && test_size=$(du -sh "$test_dir" 2>/dev/null | cut -f1)

  echo "  💻 Code Artifacts: $code_count files ($code_size)"
  echo "  🧪 Test Artifacts: $test_count files ($test_size)"
  echo "  ⚙️  Scripts: $script_count files"
  echo "  📝 Notes: $notes_count files"
  echo

  # Show document promotion preview
  if [[ -d "$docs_dir" ]] && [[ $docs_count -gt 0 ]]; then
    echo "📊 Document Promotion Analysis"
    echo "───────────────────────────────"

    # Categorize all docs
    local tier1_files=()
    local tier1_promoted=()
    local tier2_files=()
    local tier2_promoted=()
    local tier3_files=()
    local tier3_promoted=()

    for doc in "$docs_dir"/*.md; do
      [ -f "$doc" ] || continue
      local filename=$(basename "$doc")
      local tier=$(categorize_document "$doc")
      local status=$(check_promotion_status "$filename")

      case "$tier" in
        TIER1)
          tier1_files+=("$doc")
          tier1_promoted+=("$status")
          ;;
        TIER2)
          tier2_files+=("$doc")
          tier2_promoted+=("$status")
          ;;
        TIER3)
          tier3_files+=("$doc")
          tier3_promoted+=("$status")
          ;;
      esac
    done

    # Count what needs promotion
    local tier1_needs=0
    local tier2_needs=0

    for i in "${!tier1_promoted[@]}"; do
      [[ "${tier1_promoted[$i]}" == "NEEDS_PROMOTION" ]] && tier1_needs=$((tier1_needs + 1))
    done

    for i in "${!tier2_promoted[@]}"; do
      [[ "${tier2_promoted[$i]}" == "NEEDS_PROMOTION" ]] && tier2_needs=$((tier2_needs + 1))
    done

    local tier1_already=$((${#tier1_files[@]} - tier1_needs))
    local tier2_already=$((${#tier2_files[@]} - tier2_needs))

    # Display tier breakdown
    if [ ${#tier1_files[@]} -gt 0 ]; then
      echo "  ✅ TIER 1: Definitely Promote (${#tier1_files[@]} files)"
      [ $tier1_already -gt 0 ] && echo "     ✓ $tier1_already already promoted"
      [ $tier1_needs -gt 0 ] && echo "     → $tier1_needs will promote"
    fi

    if [ ${#tier2_files[@]} -gt 0 ]; then
      echo "  💡 TIER 2: Recommend Promote (${#tier2_files[@]} files)"
      [ $tier2_already -gt 0 ] && echo "     ✓ $tier2_already already promoted"
      [ $tier2_needs -gt 0 ] && echo "     → $tier2_needs will promote"
    fi

    if [ ${#tier3_files[@]} -gt 0 ]; then
      echo "  ⏸️  TIER 3: Keep in Session (${#tier3_files[@]} files)"
    fi

    echo

    # Show sample files (top 3 from Tier 1 needing promotion)
    if [ $tier1_needs -gt 0 ]; then
      echo "  Sample Tier 1 files to promote:"
      local count=0
      for i in "${!tier1_files[@]}"; do
        if [[ "${tier1_promoted[$i]}" == "NEEDS_PROMOTION" ]] && [[ $count -lt 3 ]]; then
          local filename=$(basename "${tier1_files[$i]}")
          local size=$(du -h "${tier1_files[$i]}" | cut -f1)
          echo "    • $filename ($size)"
          count=$((count + 1))
        fi
      done
      [ $tier1_needs -gt 3 ] && echo "    ... and $((tier1_needs - 3)) more"
      echo
    fi
  fi

  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo
}
