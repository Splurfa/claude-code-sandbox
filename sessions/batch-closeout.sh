#!/usr/bin/env bash
#
# Batch Session Closeout Script
# Safely archive multiple completed sessions at once
#
# Usage:
#   bash sessions/batch-closeout.sh [OPTIONS] [SESSION_IDS...]
#
# Options:
#   --dry-run              Show what would be done without making changes
#   --all                  Process all active sessions
#   --force                Skip confirmation prompts (use with caution)
#   --no-backup            Skip creating backup before archive (faster)
#   --verbose              Show detailed logging
#   --help                 Show this help message
#
# Examples:
#   bash sessions/batch-closeout.sh --dry-run
#   bash sessions/batch-closeout.sh session-20251121-120000-issue-tracking-restructure
#   bash sessions/batch-closeout.sh --all --dry-run
#   bash sessions/batch-closeout.sh session-1 session-2 --verbose
#

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SESSIONS_DIR="$SCRIPT_DIR"
ARCHIVE_DIR="$SESSIONS_DIR/.archive"
BACKUP_PREFIX="backup-before-batch-closeout"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$SESSIONS_DIR/batch-closeout-$TIMESTAMP.log"
REPORT_FILE="$SESSIONS_DIR/batch-closeout-report-$TIMESTAMP.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Flags
DRY_RUN=false
PROCESS_ALL=false
FORCE=false
NO_BACKUP=false
VERBOSE=false

# Counters
TOTAL_SESSIONS=0
SUCCESSFUL_CLOSEOUTS=0
FAILED_CLOSEOUTS=0
SKIPPED_COUNT=0

# Arrays to track results
declare -a SUCCEEDED_SESSIONS=()
declare -a FAILED_SESSIONS=()
declare -a SKIPPED_SESSIONS=()

# Logging functions
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp="$(date '+%Y-%m-%d %H:%M:%S')"

    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"

    case "$level" in
        ERROR)
            echo -e "${RED}✗ $message${NC}" >&2
            ;;
        SUCCESS)
            echo -e "${GREEN}✓ $message${NC}"
            ;;
        WARNING)
            echo -e "${YELLOW}⚠ $message${NC}"
            ;;
        INFO)
            if [[ "$VERBOSE" == true ]]; then
                echo -e "${BLUE}ℹ $message${NC}"
            fi
            ;;
    esac
}

# Display usage information
usage() {
    head -n 30 "$0" | grep "^#" | sed 's/^# \?//'
    exit 0
}

# Check if session is valid
is_valid_session() {
    local session="$1"
    local session_path="$SESSIONS_DIR/$session"

    # Must be a directory
    [[ ! -d "$session_path" ]] && return 1

    # Must match session naming pattern
    [[ ! "$session" =~ ^session- ]] && return 1

    # Must have artifacts directory
    [[ ! -d "$session_path/artifacts" ]] && return 1

    return 0
}

# Check if session has FINAL-SUMMARY.md
has_final_summary() {
    local session="$1"
    local session_path="$SESSIONS_DIR/$session"

    [[ -f "$session_path/FINAL-SUMMARY.md" ]]
}

# Generate FINAL-SUMMARY.md if missing
generate_summary() {
    local session="$1"
    local session_path="$SESSIONS_DIR/$session"

    log INFO "Generating FINAL-SUMMARY.md for $session"

    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY-RUN] Would generate FINAL-SUMMARY.md"
        return 0
    fi

    # Extract session metadata
    local session_id="$session"
    local created_date="unknown"
    local topic="unknown"

    if [[ -f "$session_path/metadata.json" ]]; then
        created_date=$(jq -r '.created // "unknown"' "$session_path/metadata.json" 2>/dev/null || echo "unknown")
        topic=$(jq -r '.topic // "unknown"' "$session_path/metadata.json" 2>/dev/null || echo "unknown")
    fi

    # Count artifacts
    local code_count=$(find "$session_path/artifacts/code" -type f 2>/dev/null | wc -l | xargs)
    local test_count=$(find "$session_path/artifacts/tests" -type f 2>/dev/null | wc -l | xargs)
    local doc_count=$(find "$session_path/artifacts/docs" -type f 2>/dev/null | wc -l | xargs)
    local script_count=$(find "$session_path/artifacts/scripts" -type f 2>/dev/null | wc -l | xargs)
    local note_count=$(find "$session_path/artifacts/notes" -type f 2>/dev/null | wc -l | xargs)

    # Generate summary
    cat > "$session_path/FINAL-SUMMARY.md" << EOF
# Session Closeout Summary

**Session ID:** $session_id
**Created:** $created_date
**Closed:** $(date '+%Y-%m-%d %H:%M:%S')
**Topic:** $topic

## Artifacts Summary

| Category | Count | Location |
|----------|-------|----------|
| Code | $code_count | artifacts/code/ |
| Tests | $test_count | artifacts/tests/ |
| Documentation | $doc_count | artifacts/docs/ |
| Scripts | $script_count | artifacts/scripts/ |
| Notes | $note_count | artifacts/notes/ |
| **Total** | **$((code_count + test_count + doc_count + script_count + note_count))** | |

## Files Created

### Code Files
$(find "$session_path/artifacts/code" -type f 2>/dev/null | sed 's|.*/artifacts/|artifacts/|' || echo "None")

### Test Files
$(find "$session_path/artifacts/tests" -type f 2>/dev/null | sed 's|.*/artifacts/|artifacts/|' || echo "None")

### Documentation
$(find "$session_path/artifacts/docs" -type f 2>/dev/null | sed 's|.*/artifacts/|artifacts/|' || echo "None")

### Scripts
$(find "$session_path/artifacts/scripts" -type f 2>/dev/null | sed 's|.*/artifacts/|artifacts/|' || echo "None")

### Notes
$(find "$session_path/artifacts/notes" -type f 2>/dev/null | sed 's|.*/artifacts/|artifacts/|' || echo "None")

## Closeout Details

- **Closeout Method:** Batch closeout script
- **Closeout Timestamp:** $(date '+%Y-%m-%d %H:%M:%S')
- **Archive Location:** .archive/$session_id

## Status

Session successfully closed and archived.
EOF

    log SUCCESS "Generated FINAL-SUMMARY.md for $session"
    return 0
}

# Create backup of session before archiving
backup_session() {
    local session="$1"
    local session_path="$SESSIONS_DIR/$session"
    local backup_dir="$SESSIONS_DIR/$BACKUP_PREFIX-$TIMESTAMP"

    if [[ "$NO_BACKUP" == true ]]; then
        log INFO "Skipping backup (--no-backup flag set)"
        return 0
    fi

    log INFO "Creating backup of $session"

    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY-RUN] Would backup to $backup_dir/$session"
        return 0
    fi

    mkdir -p "$backup_dir"

    if cp -R "$session_path" "$backup_dir/"; then
        log SUCCESS "Backed up $session to $backup_dir"
        return 0
    else
        log ERROR "Failed to backup $session"
        return 1
    fi
}

# Archive session to .archive/
archive_session() {
    local session="$1"
    local session_path="$SESSIONS_DIR/$session"
    local archive_path="$ARCHIVE_DIR/$session"

    log INFO "Archiving $session to .archive/"

    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY-RUN] Would move $session to .archive/"
        return 0
    fi

    # Ensure archive directory exists
    mkdir -p "$ARCHIVE_DIR"

    # Check if already archived
    if [[ -d "$archive_path" ]]; then
        log WARNING "$session already exists in archive, creating timestamped copy"
        archive_path="${archive_path}-duplicate-${TIMESTAMP}"
    fi

    # Move to archive
    if mv "$session_path" "$archive_path"; then
        # Update metadata with archive timestamp
        if [[ -f "$archive_path/metadata.json" ]]; then
            local temp_file=$(mktemp)
            jq --arg ts "$(date -u +%Y-%m-%dT%H:%M:%SZ)" '. + {archived: $ts}' "$archive_path/metadata.json" > "$temp_file"
            mv "$temp_file" "$archive_path/metadata.json"
        fi

        log SUCCESS "Archived $session"
        return 0
    else
        log ERROR "Failed to archive $session"
        return 1
    fi
}

# Validate archived session
validate_archive() {
    local session="$1"
    local archive_path="$ARCHIVE_DIR/$session"

    log INFO "Validating archive for $session"

    # Check directory exists
    if [[ ! -d "$archive_path" ]]; then
        log ERROR "Archive directory not found: $archive_path"
        return 1
    fi

    # Check FINAL-SUMMARY.md exists
    if [[ ! -f "$archive_path/FINAL-SUMMARY.md" ]]; then
        log WARNING "FINAL-SUMMARY.md missing in archive"
    fi

    # Check artifacts directory
    if [[ ! -d "$archive_path/artifacts" ]]; then
        log ERROR "artifacts/ directory missing in archive"
        return 1
    fi

    # Check metadata
    if [[ ! -f "$archive_path/metadata.json" ]]; then
        log WARNING "metadata.json missing in archive"
    fi

    log SUCCESS "Archive validation passed for $session"
    return 0
}

# Process single session
process_session() {
    local session="$1"

    log INFO "Processing session: $session"
    ((TOTAL_SESSIONS++))

    # Validate session
    if ! is_valid_session "$session"; then
        log WARNING "Invalid session: $session (skipping)"
        ((SKIPPED_COUNT++))
        SKIPPED_SESSIONS+=("$session: Invalid session structure")
        return 1
    fi

    # Check if already archived
    if [[ -d "$ARCHIVE_DIR/$session" ]]; then
        log WARNING "$session already archived (skipping)"
        ((SKIPPED_COUNT++))
        SKIPPED_SESSIONS+=("$session: Already archived")
        return 0
    fi

    # Generate FINAL-SUMMARY.md if missing
    if ! has_final_summary "$session"; then
        log INFO "$session missing FINAL-SUMMARY.md, generating..."
        if ! generate_summary "$session"; then
            log ERROR "Failed to generate summary for $session"
            ((FAILED_CLOSEOUTS++))
            FAILED_SESSIONS+=("$session: Summary generation failed")
            return 1
        fi
    fi

    # Create backup
    if ! backup_session "$session"; then
        log ERROR "Failed to backup $session, aborting closeout"
        ((FAILED_CLOSEOUTS++))
        FAILED_SESSIONS+=("$session: Backup failed")
        return 1
    fi

    # Archive session
    if ! archive_session "$session"; then
        log ERROR "Failed to archive $session"
        ((FAILED_CLOSEOUTS++))
        FAILED_SESSIONS+=("$session: Archive failed")
        return 1
    fi

    # Validate archive (skip in dry-run mode)
    if [[ "$DRY_RUN" == false ]]; then
        if ! validate_archive "$session"; then
            log ERROR "Archive validation failed for $session"
            ((FAILED_CLOSEOUTS++))
            FAILED_SESSIONS+=("$session: Validation failed")
            return 1
        fi
    else
        log INFO "[DRY-RUN] Would validate archive for $session"
    fi

    ((SUCCESSFUL_CLOSEOUTS++))
    SUCCEEDED_SESSIONS+=("$session")
    log SUCCESS "Successfully closed out $session"
    return 0
}

# Clean up old backup directories
cleanup_backups() {
    log INFO "Cleaning up old backup directories"

    if [[ "$DRY_RUN" == true ]]; then
        local backup_dirs=$(find "$SESSIONS_DIR" -maxdepth 1 -type d -name "*backup*" 2>/dev/null || true)
        if [[ -n "$backup_dirs" ]]; then
            log INFO "[DRY-RUN] Would remove backup directories:"
            echo "$backup_dirs" | while read -r dir; do
                log INFO "  - $(basename "$dir")"
            done
        fi
        return 0
    fi

    # Remove backup directories older than 7 days
    find "$SESSIONS_DIR" -maxdepth 1 -type d -name "*backup*" -mtime +7 -exec rm -rf {} \; 2>/dev/null || true

    log SUCCESS "Cleaned up old backups"
}

# Generate reconciliation report
generate_report() {
    log INFO "Generating reconciliation report"

    cat > "$REPORT_FILE" << EOF
# Batch Session Closeout Report

**Timestamp:** $(date '+%Y-%m-%d %H:%M:%S')
**Mode:** $([[ "$DRY_RUN" == true ]] && echo "DRY-RUN" || echo "LIVE")

## Summary

| Metric | Count |
|--------|-------|
| Total Sessions Processed | $TOTAL_SESSIONS |
| Successful Closeouts | $SUCCESSFUL_CLOSEOUTS |
| Failed Closeouts | $FAILED_CLOSEOUTS |
| Skipped Sessions | $SKIPPED_COUNT |

## Successful Closeouts

$(if [[ ${#SUCCEEDED_SESSIONS[@]} -eq 0 ]]; then
    echo "None"
else
    for session in "${SUCCEEDED_SESSIONS[@]}"; do
        echo "- $session"
    done
fi)

## Failed Closeouts

$(if [[ ${#FAILED_SESSIONS[@]} -eq 0 ]]; then
    echo "None"
else
    for failure in "${FAILED_SESSIONS[@]}"; do
        echo "- $failure"
    done
fi)

## Skipped Sessions

$(if [[ ${#SKIPPED_SESSIONS[@]} -eq 0 ]]; then
    echo "None"
else
    for skipped in "${SKIPPED_SESSIONS[@]}"; do
        echo "- $skipped"
    done
fi)

## Archive Status

**Archive Directory:** $ARCHIVE_DIR
**Total Archived Sessions:** $(find "$ARCHIVE_DIR" -maxdepth 1 -type d -name "session-*" 2>/dev/null | wc -l | xargs)

## Active Sessions Remaining

$(find "$SESSIONS_DIR" -maxdepth 1 -type d -name "session-*" 2>/dev/null | while read -r session; do
    echo "- $(basename "$session")"
done || echo "None")

## Verification

**Log File:** $LOG_FILE
**Backup Location:** $([[ "$NO_BACKUP" == true ]] && echo "None (--no-backup)" || echo "$BACKUP_PREFIX-$TIMESTAMP/")

## Clean State Verification

$(if [[ $(find "$SESSIONS_DIR" -maxdepth 1 -type d -name "session-*" 2>/dev/null | wc -l) -eq 0 ]]; then
    echo "✓ No active sessions remain - workspace is clean"
else
    echo "⚠ Active sessions still present - may require attention"
fi)

---
*Generated by batch-closeout.sh*
EOF

    log SUCCESS "Report generated: $REPORT_FILE"
}

# Display final summary
display_summary() {
    echo ""
    echo "=========================================="
    echo "  Batch Session Closeout Summary"
    echo "=========================================="
    echo ""
    echo -e "${BLUE}Total Processed:${NC}    $TOTAL_SESSIONS"
    echo -e "${GREEN}Successful:${NC}         $SUCCESSFUL_CLOSEOUTS"
    echo -e "${RED}Failed:${NC}             $FAILED_CLOSEOUTS"
    echo -e "${YELLOW}Skipped:${NC}            $SKIPPED_COUNT"
    echo ""
    echo "Report: $REPORT_FILE"
    echo "Log:    $LOG_FILE"
    echo ""

    if [[ "$DRY_RUN" == true ]]; then
        echo -e "${YELLOW}*** DRY-RUN MODE - No changes were made ***${NC}"
        echo ""
    fi
}

# Main execution
main() {
    local sessions_to_process=()

    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --all)
                PROCESS_ALL=true
                shift
                ;;
            --force)
                FORCE=true
                shift
                ;;
            --no-backup)
                NO_BACKUP=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --help|-h)
                usage
                ;;
            --*)
                echo "Unknown option: $1"
                usage
                ;;
            *)
                # Treat as session ID
                sessions_to_process+=("$1")
                shift
                ;;
        esac
    done

    # Initialize log file
    echo "Batch Session Closeout - $(date '+%Y-%m-%d %H:%M:%S')" > "$LOG_FILE"
    log INFO "Starting batch session closeout"
    log INFO "Mode: $([[ "$DRY_RUN" == true ]] && echo "DRY-RUN" || echo "LIVE")"

    # Determine sessions to process
    if [[ "$PROCESS_ALL" == true ]]; then
        log INFO "Processing all active sessions"
        while IFS= read -r session; do
            sessions_to_process+=("$(basename "$session")")
        done < <(find "$SESSIONS_DIR" -maxdepth 1 -type d -name "session-*" 2>/dev/null || true)
    fi

    # Validate we have sessions to process
    if [[ ${#sessions_to_process[@]} -eq 0 ]]; then
        log ERROR "No sessions specified. Use --all or provide session IDs."
        usage
    fi

    log INFO "Found ${#sessions_to_process[@]} session(s) to process"

    # Confirm unless --force
    if [[ "$FORCE" == false && "$DRY_RUN" == false ]]; then
        echo ""
        echo "Sessions to close out:"
        for session in "${sessions_to_process[@]}"; do
            echo "  - $session"
        done
        echo ""
        read -p "Continue with closeout? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log INFO "Closeout cancelled by user"
            exit 0
        fi
    fi

    # Process each session
    for session in "${sessions_to_process[@]}"; do
        echo ""
        process_session "$session"
    done

    # Cleanup old backups
    echo ""
    cleanup_backups

    # Generate report
    echo ""
    generate_report

    # Display summary
    display_summary

    # Exit with appropriate code
    if [[ $FAILED_CLOSEOUTS -gt 0 ]]; then
        exit 1
    else
        exit 0
    fi
}

# Run main function
main "$@"
