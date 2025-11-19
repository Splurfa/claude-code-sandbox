#!/bin/bash
# Complete session closeout workflow with HITL approval
# Stock-first: wraps claude-flow hooks with thin orchestration

set -e

SESSION_ID="${1:-$SESSION_ID}"

if [[ -z "$SESSION_ID" ]]; then
  echo "❌ No session ID provided"
  echo "Usage: $0 <session-id>"
  echo "  or: export SESSION_ID=<session-id> && $0"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "📊 Collecting session data..."
npx claude-flow@alpha hooks post-task --task-id "$SESSION_ID"
echo "✓ Post-task hook complete"
echo

echo "📝 Generating session summary..."
npx claude-flow@alpha hooks session-end --generate-summary true
echo "✓ Summary generated"
echo

# Calculate session duration
METADATA="sessions/$SESSION_ID/metadata.json"
if [[ -f "$METADATA" ]] && command -v jq &> /dev/null; then
  START_TIME=$(jq -r '.created_at' "$METADATA")
  if [[ -n "$START_TIME" ]] && [[ "$START_TIME" != "null" ]]; then
    START_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$START_TIME" "+%s" 2>/dev/null || echo "0")
    END_EPOCH=$(date "+%s")
    if [[ "$START_EPOCH" != "0" ]]; then
      DURATION_SECONDS=$((END_EPOCH - START_EPOCH))
      HOURS=$((DURATION_SECONDS / 3600))
      MINUTES=$(((DURATION_SECONDS % 3600) / 60))
      echo "⏱️  Session duration: ${HOURS}h ${MINUTES}m"
      echo
    fi
  fi
fi

# Display summary
SUMMARY_FILE="sessions/$SESSION_ID/session-summary.md"
if [[ -f "$SUMMARY_FILE" ]]; then
  echo "=== Session Summary ==="
  cat "$SUMMARY_FILE"
  echo
fi

# Load preview library and show closeout preview
source "$SCRIPT_DIR/lib/closeout-preview.sh"
show_closeout_preview "$SESSION_ID" "$SUMMARY_FILE"

# Interactive choice menu
echo "What would you like to do?"
echo
echo "  (1) Auto-approve all and complete closeout"
echo "  (2) Continue in terminal with HITL review"
echo "  (n) Cancel closeout"
echo
read -p "Choice [1/2/n]: " -n 1 -r
echo

case "$REPLY" in
  1)
    echo "✅ Auto-approving closeout..."
    AUTO_APPROVE=true
    ;;
  2)
    echo
    echo "To continue with full HITL review, run this command in your terminal:"
    echo
    echo "  .claude/skills/session-closeout/scripts/closeout.sh $SESSION_ID"
    echo
    echo "(Session remains active - closeout cancelled)"
    exit 0
    ;;
  *)
    echo "❌ Closeout cancelled. Session remains active."
    exit 0
    ;;
esac

# Archive
echo
echo "📦 Archiving session..."
npx claude-flow@alpha hooks session-end --export-metrics true
echo "✓ Backup created in .swarm/backups/"
echo

# Load Captain's Log HITL functions
source "$SCRIPT_DIR/lib/captains-log-draft.sh"

echo "📖 Preparing Captain's Log entry..."
if [[ -f "$SUMMARY_FILE" ]]; then
  DRAFT_FILE=$(generate_captains_log_draft "$SESSION_ID" "$SUMMARY_FILE")

  if [[ "$AUTO_APPROVE" == "true" ]]; then
    # Auto-approve mode: write directly
    write_captains_log_entry "$DRAFT_FILE"
  else
    # HITL mode: review first
    if review_captains_log_draft "$DRAFT_FILE"; then
      write_captains_log_entry "$DRAFT_FILE"
    else
      echo "  ℹ️  Captain's Log entry skipped"
    fi
  fi

  # Cleanup draft
  rm -f "$DRAFT_FILE" 2>/dev/null
else
  echo "  ⚠️  No session summary found, skipping Captain's Log"
fi
echo

echo "📝 Updating metadata..."
# Update metadata status (Patch 3: Mark session as completed)
METADATA="sessions/$SESSION_ID/metadata.json"
if [[ -f "$METADATA" ]]; then
  if command -v jq &> /dev/null; then
    jq --arg closed_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
       '. + {status: "closed", closed_at: $closed_at}' \
       "$METADATA" > "$METADATA.tmp"
    mv "$METADATA.tmp" "$METADATA"
  else
    echo "  (jq not found, metadata update skipped)"
  fi
fi
echo "✓ Metadata updated to 'completed'"
echo

# Load artifact review functions
source "$SCRIPT_DIR/lib/artifact-review.sh"

echo "📦 Session Artifact Review"
echo "═══════════════════════════════════════════════════"
echo

show_code_artifacts "$SESSION_ID"
show_test_artifacts "$SESSION_ID"
show_script_artifacts "$SESSION_ID"
show_notes_artifacts "$SESSION_ID"

echo "═══════════════════════════════════════════════════"
echo

echo "📄 Analyzing session documentation..."
DOCS_DIR="sessions/$SESSION_ID/artifacts/docs"

if [[ -d "$DOCS_DIR" ]]; then
  # Load categorization functions
  source "$SCRIPT_DIR/lib/doc-categorizer.sh"

  # Categorize all docs (bash 3.2 compatible - use simple arrays)
  tier1_files=()
  tier1_promoted=()
  tier2_files=()
  tier2_promoted=()
  tier3_files=()
  tier3_promoted=()

  for doc in "$DOCS_DIR"/*.md; do
    [ -f "$doc" ] || continue
    filename=$(basename "$doc")
    tier=$(categorize_document "$doc")
    status=$(check_promotion_status "$filename")

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

  # Present categorization
  total_docs=$((${#tier1_files[@]} + ${#tier2_files[@]} + ${#tier3_files[@]}))

  if [ "$total_docs" -gt 0 ]; then
    echo
    echo "📊 Document Promotion Analysis ($total_docs files scanned)"
    echo

    # Show Tier 1
    needs_promotion_tier1=()
    if [ "${#tier1_files[@]}" -gt 0 ]; then
      echo "✅ TIER 1: Definitely Promote (${#tier1_files[@]} files)"
      for i in "${!tier1_files[@]}"; do
        doc="${tier1_files[$i]}"
        status="${tier1_promoted[$i]}"
        filename=$(basename "$doc")
        size=$(du -h "$doc" | cut -f1)
        target=$(suggest_target_path "$filename")

        if [[ "$status" == "PROMOTED" ]]; then
          echo "  ✓ $filename ($size) - Already promoted to $target"
        else
          needs_promotion_tier1+=("$doc")
          echo "→ $target"
          echo "  Source: $filename ($size)"
          echo "  Why: $(explain_tier1 "$doc")"
        fi
        echo
      done

      if [ ${#needs_promotion_tier1[@]} -eq 0 ]; then
        echo "  ℹ️  All Tier 1 documents already promoted"
        echo
      fi
    fi

    # Show Tier 2
    needs_promotion_tier2=()
    if [ "${#tier2_files[@]}" -gt 0 ]; then
      echo "💡 TIER 2: Recommend Promote (${#tier2_files[@]} files)"
      for i in "${!tier2_files[@]}"; do
        doc="${tier2_files[$i]}"
        status="${tier2_promoted[$i]}"
        filename=$(basename "$doc")
        size=$(du -h "$doc" | cut -f1)
        target=$(suggest_target_path "$filename")

        if [[ "$status" == "PROMOTED" ]]; then
          echo "  ✓ $filename ($size) - Already promoted to $target"
        else
          needs_promotion_tier2+=("$doc")
          echo "→ $target"
          echo "  Source: $filename ($size)"
          echo "  Why: $(explain_tier2 "$doc")"
        fi
        echo
      done

      if [ ${#needs_promotion_tier2[@]} -eq 0 ]; then
        echo "  ℹ️  All Tier 2 documents already promoted"
        echo
      fi
    fi

    # Show Tier 3
    if [ "${#tier3_files[@]}" -gt 0 ]; then
      echo "⏸️  TIER 3: Keep in Session (${#tier3_files[@]} files)"
      for doc in "${tier3_files[@]}"; do
        filename=$(basename "$doc")
        size=$(du -h "$doc" | cut -f1)
        echo "  → $filename ($size) - $(explain_tier3 "$doc")"
      done
      echo
    fi

    # HITL interaction
    if [ ${#needs_promotion_tier1[@]} -gt 0 ] || [ ${#needs_promotion_tier2[@]} -gt 0 ]; then
      if [[ "$AUTO_APPROVE" == "true" ]]; then
        # Auto-approve mode: promote Tier 1+2
        echo "📦 Auto-promoting Tier 1+2 documents..."
        REPLY="y"
      else
        # HITL mode: ask user
        echo "Documents requiring promotion:"
        echo "  • Tier 1: ${#needs_promotion_tier1[@]} files"
        echo "  • Tier 2: ${#needs_promotion_tier2[@]} files"
        echo
        echo "Review promotion plan?"
        echo "  (y) Accept and promote Tier 1+2"
        echo "  (n) Skip all promotion"
        echo "  (1) Promote only Tier 1"
        read -p "Choice [y/n/1]: " -n 1 -r
        echo
      fi
    else
      echo "  ℹ️  No documents need promotion (all already promoted during session)"
      echo
      REPLY="n"  # Skip promotion logic
    fi

    case "$REPLY" in
      [Yy])
        # Promote Tier 1 + 2 (only files that need promotion)
        echo "📦 Promoting documents..."
        for doc in "${needs_promotion_tier1[@]}" "${needs_promotion_tier2[@]}"; do
          filename=$(basename "$doc")
          target=$(suggest_target_path "$filename")
          mkdir -p "$(dirname "$target")"
          cp "$doc" "$target"
          echo "  ✓ $filename → $target"
        done
        echo "  ✅ Promotion complete"
        ;;
      1)
        # Promote only Tier 1 (only files that need promotion)
        echo "📦 Promoting documents..."
        for doc in "${needs_promotion_tier1[@]}"; do
          filename=$(basename "$doc")
          target=$(suggest_target_path "$filename")
          mkdir -p "$(dirname "$target")"
          cp "$doc" "$target"
          echo "  ✓ $filename → $target"
        done
        echo "  ✅ Promotion complete"
        ;;
      *)
        echo "  ✓ Skipping document promotion"
        ;;
    esac
  fi
fi

# Continue with closeout (NO EXIT!)
echo

echo "🔄 Clearing session environment..."
# Clear active session environment variable (Patch 3: Session Inheritance cleanup)
if [[ -n "$ACTIVE_SESSION_ID" ]] && [[ "$ACTIVE_SESSION_ID" == "$SESSION_ID" ]]; then
  unset ACTIVE_SESSION_ID
  echo "✓ ACTIVE_SESSION_ID cleared"
else
  echo "  (No matching active session variable found)"
fi
echo

echo "🗄️  Moving to archive..."
"$SCRIPT_DIR/archive-session.sh" "$SESSION_ID"
echo

echo "✅ Session closed successfully"
echo
echo "Active sessions remaining:"
ls -1 sessions/ | grep "^session-" || echo "  (none)"
