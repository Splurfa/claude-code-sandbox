#!/usr/bin/env bash
# Document Categorization Library
# Intelligent tier-based categorization for session closeout promotion

# categorize_document: Score and tier a document based on content analysis
# Arguments:
#   $1 - Path to document file
# Returns:
#   TIER1, TIER2, or TIER3
categorize_document() {
  local file="$1"
  local header=$(head -50 "$file")
  local title=$(echo "$header" | grep "^# " | head -1 | sed 's/^# //')
  local lines=$(wc -l < "$file")
  local score=0

  # TIER 1 indicators (+points for user-facing guides)
  echo "$title" | grep -qiE "(guide|tutorial|how to|reference|quick start|walkthrough)" && score=$((score + 4))
  echo "$header" | grep -qiE "^## (overview|table of contents|prerequisites)" && score=$((score + 3))
  [ "$lines" -gt 1000 ] && score=$((score + 4))  # Comprehensive guides
  [ "$lines" -gt 200 ] && score=$((score + 2))   # Moderate length
  echo "$header" | grep -qiE "(step-by-step|getting started|user guide)" && score=$((score + 3))

  # TIER 3 indicators (-points for session-specific work)
  echo "$title" | grep -qiE "(analysis|report|summary|checkpoint|hitl|delivery|findings)" && score=$((score - 4))
  echo "$header" | grep -qE "session-[0-9]{8}-[0-9]{6}" && score=$((score - 4))
  echo "$title" | grep -qiE "(verification|coherence|meta-issue|research)" && score=$((score - 3))

  # Return tier based on score
  if [ "$score" -ge 6 ]; then
    echo "TIER1"
  elif [ "$score" -ge -2 ]; then
    echo "TIER2"
  else
    echo "TIER3"
  fi
}

# suggest_target_path: Map filename to docs/guides category
# Arguments:
#   $1 - Document filename
# Returns:
#   Suggested path in docs/guides structure
suggest_target_path() {
  local filename="$1"
  local lowercase=$(echo "$filename" | tr '[:upper:]' '[:lower:]')

  # Pattern match to category
  case "$lowercase" in
    *guide*|*reference*) echo "docs/guides/reference/${lowercase}" ;;
    *tutorial*|*walkthrough*|*usage*|*how-to*) echo "docs/guides/how-to/${lowercase}" ;;
    *concept*|*explained*|*understanding*) echo "docs/guides/concepts/${lowercase}" ;;
    *troubleshoot*|*debug*|*error*) echo "docs/guides/troubleshooting/${lowercase}" ;;
    *advanced*|*deep-dive*) echo "docs/guides/advanced/${lowercase}" ;;
    *) echo "docs/guides/reference/${lowercase}" ;;
  esac
}

# explain_tier1: Generate reasoning for Tier 1 classification
# Arguments:
#   $1 - Path to document file
# Returns:
#   Human-readable explanation
explain_tier1() {
  local file="$1"
  local lines=$(wc -l < "$file")
  echo "User-facing guide (${lines} lines), comprehensive reference"
}

# explain_tier2: Generate reasoning for Tier 2 classification
# Returns:
#   Human-readable explanation
explain_tier2() {
  echo "Educational content, may have permanent value"
}

# explain_tier3: Generate reasoning for Tier 3 classification
# Arguments:
#   $1 - Path to document file
# Returns:
#   Human-readable explanation
explain_tier3() {
  local file="$1"
  if grep -qE "session-[0-9]{8}-[0-9]{6}" "$file"; then
    echo "Session-specific analysis"
  else
    echo "Research findings from this session"
  fi
}

# check_promotion_status: Detect if document already promoted to docs/guides
# Arguments:
#   $1 - Document filename (basename)
# Returns:
#   "PROMOTED" or "NEEDS_PROMOTION"
check_promotion_status() {
  local filename="$1"

  # Check all docs/guides subdirectories
  for category in how-to reference concepts troubleshooting advanced getting-started; do
    if [[ -f "docs/guides/$category/$filename" ]]; then
      echo "PROMOTED"
      return 0
    fi
  done

  echo "NEEDS_PROMOTION"
  return 0
}

# promote_documents: Copy categorized documents to workspace
# Arguments:
#   $1 - Name reference to tier1 associative array (filename => source_path)
#   $2 - Optional name reference to tier2 associative array
# Effects:
#   Creates target directories and copies files to docs/guides structure
promote_documents() {
  local -n tier1_ref=$1
  local -n tier2_ref=${2:-}

  echo "📦 Promoting documents..."

  for filename in "${!tier1_ref[@]}"; do
    source="${tier1_ref[$filename]}"
    target=$(suggest_target_path "$filename")
    mkdir -p "$(dirname "$target")"
    cp "$source" "$target"
    echo "  ✓ $filename → $target"
  done

  if [ -n "$tier2_ref" ]; then
    for filename in "${!tier2_ref[@]}"; do
      source="${tier2_ref[$filename]}"
      target=$(suggest_target_path "$filename")
      mkdir -p "$(dirname "$target")"
      cp "$source" "$target"
      echo "  ✓ $filename → $target"
    done
  fi

  echo "  ✅ Promotion complete"
}
