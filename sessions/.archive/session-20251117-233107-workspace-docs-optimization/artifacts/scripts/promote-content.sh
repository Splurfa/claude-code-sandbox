#!/bin/bash
# promote-content.sh - Session Content Promotion Tool
# Implements tag-based promotion workflow (Approach B)

set -euo pipefail

# Configuration
PROMOTE_RULES=".promote-rules.yml"
STAGING_DIR=".promote-staged"
PROMOTION_LOG=".promote-history.log"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${BLUE}[INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $*"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# Main promotion function
promote() {
  local command=$1
  shift

  case $command in
    list-sessions)
      list_sessions "$@"
      ;;
    scan)
      scan_session "$@"
      ;;
    to-projects)
      promote_to_location "projects" "$@"
      ;;
    to-docs)
      promote_to_location "docs" "$@"
      ;;
    to-root)
      promote_to_location "." "$@"
      ;;
    batch)
      batch_promote "$@"
      ;;
    history)
      show_history "$@"
      ;;
    review-staged)
      review_staged "$@"
      ;;
    approve-staged)
      approve_staged "$@"
      ;;
    scan-tags)
      scan_tags "$@"
      ;;
    analyze)
      analyze_quality "$@"
      ;;
    *)
      show_help
      ;;
  esac
}

# List recent sessions with quality indicators
list_sessions() {
  local recent=${1:-10}

  log_info "Listing $recent most recent sessions..."

  find sessions -maxdepth 1 -type d -name "session-*" | \
    sort -r | \
    head -n "$recent" | \
    while read -r session_dir; do
      local session_id=$(basename "$session_dir")
      local artifact_count=$(find "$session_dir/artifacts" -type f 2>/dev/null | wc -l)
      local promotable_count=$(grep -r "PROMOTE:" "$session_dir/artifacts" 2>/dev/null | wc -l)

      echo ""
      echo -e "${GREEN}$session_id${NC}"
      echo "  Files: $artifact_count | Promotable: $promotable_count"

      # Show tagged files
      if [ "$promotable_count" -gt 0 ]; then
        grep -r "PROMOTE:" "$session_dir/artifacts" 2>/dev/null | \
          head -n 3 | \
          while IFS=: read -r file tag; do
            local filename=$(basename "$file")
            local target=$(echo "$tag" | grep -oP 'PROMOTE:\s*\K.*')
            echo "    - $filename → $target"
          done
      fi
    done
}

# Scan session for promotable content
scan_session() {
  local session_dir=$1

  if [ ! -d "$session_dir" ]; then
    log_error "Session directory not found: $session_dir"
    return 1
  fi

  log_info "Scanning $session_dir for promotable content..."

  local artifacts_dir="$session_dir/artifacts"
  if [ ! -d "$artifacts_dir" ]; then
    log_warning "No artifacts directory found in session"
    return 0
  fi

  # Find files with PROMOTE tags
  local tagged_files=$(grep -rl "PROMOTE:" "$artifacts_dir" 2>/dev/null || true)

  if [ -z "$tagged_files" ]; then
    log_info "No tagged files found in session"
    return 0
  fi

  echo ""
  log_success "Found promotable artifacts:"
  echo ""

  echo "$tagged_files" | while read -r file; do
    local target=$(grep "PROMOTE:" "$file" | head -n 1 | grep -oP 'PROMOTE:\s*\K.*')
    local quality=$(grep "QUALITY:" "$file" | head -n 1 | grep -oP '\d+/\d+' || echo "N/A")
    local categories=$(grep "CATEGORIES:" "$file" | head -n 1 | grep -oP 'CATEGORIES:\s*\K.*' || echo "")

    echo -e "  ${GREEN}$(basename "$file")${NC}"
    echo "    Target: $target"
    echo "    Quality: $quality"
    [ -n "$categories" ] && echo "    Categories: $categories"
    echo ""
  done
}

# Scan for promotion tags and stage files
scan_tags() {
  local session_dir=$1

  if [ ! -d "$session_dir" ]; then
    log_error "Session directory not found: $session_dir"
    return 1
  fi

  log_info "Scanning for promotion tags in $session_dir..."

  # Create staging directory
  mkdir -p "$STAGING_DIR"

  local staged_count=0

  # Find all files with PROMOTE tags
  grep -rl "PROMOTE:" "$session_dir/artifacts" 2>/dev/null | while read -r source_file; do
    local target=$(grep "PROMOTE:" "$source_file" | head -n 1 | grep -oP 'PROMOTE:\s*\K.*')
    local quality=$(grep "QUALITY:" "$source_file" | head -n 1 | grep -oP '\d+/\d+' || echo "0/10")
    local quality_score=$(echo "$quality" | grep -oP '^\d+' || echo "0")

    # Create staging metadata
    local staging_file="$STAGING_DIR/$(basename "$source_file")"
    local metadata_file="$staging_file.meta"

    # Copy file to staging
    cp "$source_file" "$staging_file"

    # Create metadata
    cat > "$metadata_file" <<EOF
source: $source_file
target: $target
quality: $quality
quality_score: $quality_score
staged_at: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
session: $(basename "$session_dir")
EOF

    staged_count=$((staged_count + 1))
    log_success "Staged: $(basename "$source_file") → $target (Quality: $quality)"
  done

  log_success "Staged $staged_count files for promotion"
}

# Review staged files
review_staged() {
  if [ ! -d "$STAGING_DIR" ] || [ -z "$(ls -A "$STAGING_DIR" 2>/dev/null)" ]; then
    log_info "No files staged for promotion"
    return 0
  fi

  log_info "Reviewing staged promotions..."
  echo ""

  local files=("$STAGING_DIR"/*.meta)
  local count=${#files[@]}

  echo -e "${GREEN}$count files staged for promotion:${NC}"
  echo ""

  for meta_file in "${files[@]}"; do
    [ -f "$meta_file" ] || continue

    # Read metadata
    local source=$(grep "^source:" "$meta_file" | cut -d' ' -f2-)
    local target=$(grep "^target:" "$meta_file" | cut -d' ' -f2-)
    local quality=$(grep "^quality:" "$meta_file" | cut -d' ' -f2-)
    local quality_score=$(grep "^quality_score:" "$meta_file" | cut -d' ' -f2-)

    # Determine quality indicator
    local quality_label="LOW"
    [ "$quality_score" -ge 7 ] && quality_label="MED"
    [ "$quality_score" -ge 8 ] && quality_label="HIGH"

    local quality_color=$RED
    [ "$quality_score" -ge 7 ] && quality_color=$YELLOW
    [ "$quality_score" -ge 8 ] && quality_color=$GREEN

    echo -e "  [${quality_color}${quality_label}${NC}] $(basename "${meta_file%.meta}") → $target"
    echo "       Quality: $quality"
  done

  echo ""
  echo "Options:"
  echo "  promote approve-staged --auto           # Auto-approve all"
  echo "  promote approve-staged --selective      # Review each file"
  echo "  promote approve-staged --quality-min 8  # Auto-approve quality >= 8"
}

# Approve staged files
approve_staged() {
  local mode="selective"
  local quality_min=0

  # Parse arguments
  while [[ $# -gt 0 ]]; do
    case $1 in
      --auto)
        mode="auto"
        shift
        ;;
      --selective)
        mode="selective"
        shift
        ;;
      --quality-threshold|--quality-min)
        quality_min=$2
        mode="quality"
        shift 2
        ;;
      *)
        shift
        ;;
    esac
  done

  if [ ! -d "$STAGING_DIR" ] || [ -z "$(ls -A "$STAGING_DIR" 2>/dev/null)" ]; then
    log_info "No files staged for promotion"
    return 0
  fi

  log_info "Approving staged promotions (mode: $mode)..."

  for meta_file in "$STAGING_DIR"/*.meta; do
    [ -f "$meta_file" ] || continue

    local source=$(grep "^source:" "$meta_file" | cut -d' ' -f2-)
    local target=$(grep "^target:" "$meta_file" | cut -d' ' -f2-)
    local quality_score=$(grep "^quality_score:" "$meta_file" | cut -d' ' -f2-)
    local staged_file="${meta_file%.meta}"

    local should_promote=false

    case $mode in
      auto)
        should_promote=true
        ;;
      quality)
        [ "$quality_score" -ge "$quality_min" ] && should_promote=true
        ;;
      selective)
        echo ""
        echo -e "${BLUE}Promote $(basename "$staged_file")?${NC}"
        echo "  Source: $source"
        echo "  Target: $target"
        echo "  Quality: $(grep "^quality:" "$meta_file" | cut -d' ' -f2-)"
        read -rp "  [y/n/e(dit target)]: " response

        case $response in
          y|Y)
            should_promote=true
            ;;
          e|E)
            read -rp "  Enter new target: " new_target
            target=$new_target
            should_promote=true
            ;;
          *)
            log_info "Skipped: $(basename "$staged_file")"
            ;;
        esac
        ;;
    esac

    if [ "$should_promote" = true ]; then
      # Execute promotion
      do_promote "$staged_file" "$target" "$source"

      # Clean up staging
      rm -f "$staged_file" "$meta_file"
    fi
  done

  log_success "Promotion approval complete"
}

# Execute actual file promotion
do_promote() {
  local source_file=$1
  local target_path=$2
  local original_source=$3

  # Create target directory
  mkdir -p "$(dirname "$target_path")"

  # Add promotion metadata
  local temp_file=$(mktemp)
  cat > "$temp_file" <<EOF
---
promoted_from: $original_source
promoted_date: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
original_file: $(basename "$original_source")
---

EOF

  # Append original content
  cat "$source_file" >> "$temp_file"

  # Move to target
  mv "$temp_file" "$target_path"

  # Log promotion
  echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") | $original_source → $target_path" >> "$PROMOTION_LOG"

  log_success "Promoted: $(basename "$source_file") → $target_path"
}

# Promote to specific location (manual mode)
promote_to_location() {
  local location=$1
  local source=$2
  local target=${3:-}

  if [ ! -f "$source" ]; then
    log_error "Source file not found: $source"
    return 1
  fi

  # Auto-detect target if not provided
  if [ -z "$target" ]; then
    local filename=$(basename "$source")
    target="$location/$filename"
    log_info "Auto-detected target: $target"
  fi

  # Execute promotion
  do_promote "$source" "$target" "$source"
}

# Batch promotion
batch_promote() {
  local session_dir=$1
  local interactive=${2:-false}

  if [ ! -d "$session_dir" ]; then
    log_error "Session directory not found: $session_dir"
    return 1
  fi

  log_info "Batch promoting from $session_dir..."

  # Scan for tags and stage
  scan_tags "$session_dir"

  # Review and approve
  if [ "$interactive" = "--interactive" ]; then
    approve_staged --selective
  else
    approve_staged --auto
  fi
}

# Show promotion history
show_history() {
  local session=${1:-}

  if [ ! -f "$PROMOTION_LOG" ]; then
    log_info "No promotion history found"
    return 0
  fi

  log_info "Promotion History:"
  echo ""

  if [ -n "$session" ]; then
    grep "$session" "$PROMOTION_LOG" || log_info "No promotions found for session: $session"
  else
    tail -n 20 "$PROMOTION_LOG"
  fi
}

# Analyze quality (placeholder for future AI integration)
analyze_quality() {
  local file=$1

  log_warning "Quality analysis not yet implemented"
  echo "Planned metrics:"
  echo "  - Completeness"
  echo "  - Technical depth"
  echo "  - Organization"
  echo "  - Originality"
  echo "  - Reusability"
}

# Show help
show_help() {
  cat <<EOF
promote-content.sh - Session Content Promotion Tool

Usage:
  promote <command> [options]

Commands:
  list-sessions [N]              List N most recent sessions (default: 10)
  scan <session-dir>             Scan session for promotable content
  scan-tags <session-dir>        Scan and stage files with PROMOTE tags
  review-staged                  Review files staged for promotion
  approve-staged [options]       Approve and execute promotions
    --auto                       Auto-approve all staged files
    --selective                  Review each file individually
    --quality-min N              Auto-approve files with quality >= N

  to-projects <source> [target]  Promote file to projects/
  to-docs <source> [target]      Promote file to docs/
  to-root <source> [target]      Promote file to root

  batch <session-dir> [--interactive]  Batch promote all tagged files
  history [session-id]           Show promotion history
  analyze <file>                 Analyze file quality (placeholder)

Examples:
  # Scan and review recent sessions
  promote list-sessions 10
  promote scan sessions/session-20251117-100000-api-design

  # Tag-based workflow
  promote scan-tags sessions/session-20251117-100000-api-design
  promote review-staged
  promote approve-staged --quality-min 8

  # Manual promotion
  promote to-projects sessions/.../artifacts/docs/RESEARCH.md
  promote to-docs sessions/.../artifacts/docs/GUIDE.md \\
    docs/how-to/custom-guide.md

  # Batch promotion
  promote batch sessions/session-20251117-100000-api-design
  promote batch sessions/session-20251117-100000-api-design --interactive

Tagging Format:
  Add these comments to files for auto-promotion:

  <!-- PROMOTE: target/path/file.md -->
  <!-- QUALITY: 8/10 -->
  <!-- CATEGORIES: research, api-design -->

Configuration:
  .promote-rules.yml    Promotion rules and thresholds
  .promote-staged/      Staging directory for review
  .promote-history.log  Promotion audit log

EOF
}

# Main entry point
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

promote "$@"
