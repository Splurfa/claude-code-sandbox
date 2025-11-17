#!/usr/bin/env bash
# Rollback Script
# Safely rollback migration if validation fails

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
WORKSPACE_DIR="${1:-$(pwd)}"
BACKUP_DIR="${BACKUP_DIR:-.migration-backup}"
CONFIRM="${CONFIRM:-false}"

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Verify backup exists
verify_backup() {
    log_info "Verifying backup..."

    if [ ! -d "$BACKUP_DIR" ]; then
        log_error "Backup directory not found: $BACKUP_DIR"
        exit 1
    fi

    if [ ! -f "$BACKUP_DIR/backup-manifest.json" ]; then
        log_error "Backup manifest not found"
        exit 1
    fi

    log_info "Backup verified"
}

# Confirm rollback
confirm_rollback() {
    if [ "$CONFIRM" = "true" ]; then
        return
    fi

    echo ""
    echo "=========================================="
    echo "  ⚠️  ROLLBACK CONFIRMATION"
    echo "=========================================="
    echo ""
    echo "This will:"
    echo "  - Restore files from $BACKUP_DIR"
    echo "  - Overwrite current workspace"
    echo "  - Cannot be undone"
    echo ""
    read -p "Continue with rollback? (yes/no): " -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log_info "Rollback cancelled"
        exit 0
    fi
}

# Create pre-rollback snapshot
create_snapshot() {
    log_info "Creating pre-rollback snapshot..."

    local snapshot_dir=".rollback-snapshot-$(date +%Y%m%d-%H%M%S)"

    mkdir -p "$snapshot_dir"

    # Copy current state
    rsync -a \
        --exclude=node_modules \
        --exclude=.git \
        --exclude="$BACKUP_DIR" \
        "$WORKSPACE_DIR/" "$snapshot_dir/"

    log_info "Snapshot created: $snapshot_dir"
    echo "$snapshot_dir" > .last-snapshot
}

# Restore files
restore_files() {
    log_info "Restoring files from backup..."

    # Read manifest
    local manifest="$BACKUP_DIR/backup-manifest.json"

    if ! command -v jq &> /dev/null; then
        log_warn "jq not found, using simple restore"
        # Simple restore without manifest parsing
        rsync -a "$BACKUP_DIR/files/" "$WORKSPACE_DIR/"
    else
        # Parse manifest and restore
        local files=$(jq -r '.files[]' "$manifest")

        while IFS= read -r file; do
            local source="$BACKUP_DIR/files/$file"
            local target="$WORKSPACE_DIR/$file"

            if [ -f "$source" ]; then
                mkdir -p "$(dirname "$target")"
                cp "$source" "$target"
                log_info "Restored: $file"
            fi
        done <<< "$files"
    fi

    log_info "Files restored"
}

# Restore package.json and dependencies
restore_dependencies() {
    log_info "Restoring dependencies..."

    if [ -f "$BACKUP_DIR/files/package.json" ]; then
        cp "$BACKUP_DIR/files/package.json" "$WORKSPACE_DIR/package.json"

        cd "$WORKSPACE_DIR"

        if [ -f "$BACKUP_DIR/files/package-lock.json" ]; then
            cp "$BACKUP_DIR/files/package-lock.json" "$WORKSPACE_DIR/package-lock.json"
            npm ci
        else
            npm install
        fi

        log_info "Dependencies restored"
    else
        log_warn "No package.json in backup"
    fi
}

# Restore git state
restore_git() {
    log_info "Restoring git state..."

    if [ -d "$BACKUP_DIR/git" ]; then
        cd "$WORKSPACE_DIR"

        # Restore git refs
        if [ -d "$BACKUP_DIR/git/refs" ]; then
            cp -r "$BACKUP_DIR/git/refs" .git/
        fi

        # Restore HEAD
        if [ -f "$BACKUP_DIR/git/HEAD" ]; then
            cp "$BACKUP_DIR/git/HEAD" .git/HEAD
        fi

        log_info "Git state restored"
    else
        log_warn "No git backup found"
    fi
}

# Clean migration artifacts
clean_artifacts() {
    log_info "Cleaning migration artifacts..."

    local artifacts=(
        ".claude/skills"
        ".claude/hooks"
        "migration-report.json"
        "validation-report.json"
    )

    for artifact in "${artifacts[@]}"; do
        if [ -e "$WORKSPACE_DIR/$artifact" ]; then
            rm -rf "$WORKSPACE_DIR/$artifact"
            log_info "Removed: $artifact"
        fi
    done

    log_info "Artifacts cleaned"
}

# Verify rollback
verify_rollback() {
    log_info "Verifying rollback..."

    local errors=0

    # Check essential files
    if [ ! -f "$WORKSPACE_DIR/package.json" ]; then
        log_error "package.json not restored"
        ((errors++))
    fi

    if [ ! -f "$WORKSPACE_DIR/CLAUDE.md" ]; then
        log_error "CLAUDE.md not restored"
        ((errors++))
    fi

    # Check git
    if [ -d "$WORKSPACE_DIR/.git" ]; then
        cd "$WORKSPACE_DIR"
        if ! git status &> /dev/null; then
            log_error "Git repository corrupted"
            ((errors++))
        fi
    fi

    if [ $errors -eq 0 ]; then
        log_info "Rollback verified"
        return 0
    else
        log_error "Rollback verification failed ($errors errors)"
        return 1
    fi
}

# Generate rollback report
generate_report() {
    log_info "Generating rollback report..."

    local report="$WORKSPACE_DIR/rollback-report.json"

    cat > "$report" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "workspace": "$WORKSPACE_DIR",
  "backup_source": "$BACKUP_DIR",
  "snapshot": "$(cat .last-snapshot 2>/dev/null || echo 'none')",
  "status": "completed",
  "files_restored": true,
  "dependencies_restored": true,
  "git_restored": true
}
EOF

    log_info "Report saved: $report"
}

# Print summary
print_summary() {
    echo ""
    echo "=========================================="
    echo "  Rollback Complete"
    echo "=========================================="
    echo ""
    echo "Workspace: $WORKSPACE_DIR"
    echo "Backup: $BACKUP_DIR"
    echo "Snapshot: $(cat .last-snapshot 2>/dev/null || echo 'none')"
    echo ""
    echo "Next steps:"
    echo "  1. Review workspace state"
    echo "  2. Check git status"
    echo "  3. Verify application works"
    echo "  4. Review rollback-report.json"
    echo ""
    echo "=========================================="
}

# Main function
main() {
    log_info "Starting rollback process..."

    verify_backup
    confirm_rollback
    create_snapshot
    restore_files
    restore_dependencies
    restore_git
    clean_artifacts
    verify_rollback
    generate_report
    print_summary

    log_info "Rollback complete!"
}

# Run main
main "$@"
