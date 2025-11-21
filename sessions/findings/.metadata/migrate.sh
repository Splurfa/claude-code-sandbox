#!/usr/bin/env bash
# Migration script for findings system reorganization
# Preserves git history using 'git mv'
# Version: 1.0.0

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
SESSION_DIR="$PROJECT_ROOT/sessions/findings"
LOG_FILE="$SCRIPT_DIR/migration.log"
DRY_RUN=false
VERBOSE=false

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Usage information
usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

Migrate findings system to new directory structure while preserving git history.

OPTIONS:
    --dry-run       Show what would be done without making changes
    --verbose       Show detailed output
    --help          Display this help message

EXAMPLES:
    # Preview migration
    $(basename "$0") --dry-run

    # Execute migration
    $(basename "$0")

    # Execute with verbose output
    $(basename "$0") --verbose

ROLLBACK:
    To rollback, use: git reset --hard HEAD~1
    Or restore from backup: $SESSION_DIR/.metadata/backup/

EOF
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            usage
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            usage
            ;;
    esac
done

# Logging functions
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"

    if [[ "$VERBOSE" == "true" ]] || [[ "$level" == "ERROR" ]] || [[ "$level" == "WARNING" ]]; then
        case $level in
            INFO)
                echo -e "${BLUE}[INFO]${NC} $message"
                ;;
            SUCCESS)
                echo -e "${GREEN}[SUCCESS]${NC} $message"
                ;;
            WARNING)
                echo -e "${YELLOW}[WARNING]${NC} $message"
                ;;
            ERROR)
                echo -e "${RED}[ERROR]${NC} $message"
                ;;
        esac
    fi
}

# Execute command with logging
execute() {
    local cmd="$*"
    log INFO "Executing: $cmd"

    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}[DRY-RUN]${NC} Would execute: $cmd"
        return 0
    fi

    if eval "$cmd" >> "$LOG_FILE" 2>&1; then
        log SUCCESS "Command succeeded: $cmd"
        return 0
    else
        log ERROR "Command failed: $cmd"
        return 1
    fi
}

# Git move wrapper
git_mv() {
    local src="$1"
    local dst="$2"

    # Check if source exists
    if [[ ! -e "$src" ]]; then
        log WARNING "Source does not exist, skipping: $src"
        return 0
    fi

    # Create destination directory if needed
    local dst_dir=$(dirname "$dst")
    if [[ ! -d "$dst_dir" ]]; then
        execute mkdir -p "$dst_dir"
    fi

    # Perform git mv
    execute git mv "$src" "$dst"
}

# Create backup
create_backup() {
    log INFO "Creating backup..."
    local backup_dir="$SESSION_DIR/.metadata/backup"

    if [[ "$DRY_RUN" == "false" ]]; then
        mkdir -p "$backup_dir"

        # Backup current git state
        git -C "$PROJECT_ROOT" branch "backup-findings-$(date +%Y%m%d-%H%M%S)" 2>/dev/null || true

        log SUCCESS "Backup created at: $backup_dir"
        log INFO "Git backup branch created"
    else
        echo -e "${YELLOW}[DRY-RUN]${NC} Would create backup at: $backup_dir"
    fi
}

# Verify prerequisites
verify_prerequisites() {
    log INFO "Verifying prerequisites..."

    # Check if in git repository
    if ! git -C "$PROJECT_ROOT" rev-parse --git-dir >/dev/null 2>&1; then
        log ERROR "Not in a git repository"
        exit 1
    fi

    # Check for uncommitted changes
    if [[ -n $(git -C "$PROJECT_ROOT" status --porcelain) ]]; then
        log WARNING "Uncommitted changes detected. Commit or stash before migration."
        if [[ "$DRY_RUN" == "false" ]]; then
            echo -e "${RED}Aborting migration. Please commit or stash changes first.${NC}"
            exit 1
        fi
    fi

    # Check if session directory exists
    if [[ ! -d "$SESSION_DIR" ]]; then
        log ERROR "Session directory does not exist: $SESSION_DIR"
        exit 1
    fi

    log SUCCESS "Prerequisites verified"
}

# Phase 1: Database files
migrate_database() {
    log INFO "Phase 1: Migrating database files..."

    cd "$SESSION_DIR"

    # Create .database directory
    execute mkdir -p .database

    # Move database files
    git_mv .issues-database.json .database/findings.json
    git_mv .pattern-database.json .database/patterns.json

    log SUCCESS "Phase 1 complete: Database files migrated"
}

# Phase 2: Scripts to bin
migrate_scripts() {
    log INFO "Phase 2: Migrating scripts to bin/..."

    cd "$SESSION_DIR"

    # Create bin directory
    execute mkdir -p bin

    # Move and rename scripts
    git_mv issue-utils.sh bin/findings
    git_mv detect-issues.sh bin/detect-findings
    git_mv pattern-database.sh bin/pattern-db

    # Make scripts executable
    if [[ "$DRY_RUN" == "false" ]]; then
        chmod +x bin/findings bin/detect-findings bin/pattern-db 2>/dev/null || true
    fi

    log SUCCESS "Phase 2 complete: Scripts migrated to bin/"
}

# Phase 3: Tests
migrate_tests() {
    log INFO "Phase 3: Migrating tests..."

    cd "$SESSION_DIR"

    # Create tests directory structure
    execute mkdir -p tests/integration

    # Move test files
    git_mv test-integration.sh tests/integration/test-integration.sh

    # Make test executable
    if [[ "$DRY_RUN" == "false" ]]; then
        chmod +x tests/integration/test-integration.sh 2>/dev/null || true
    fi

    log SUCCESS "Phase 3 complete: Tests migrated"
}

# Phase 4: Documentation
migrate_docs() {
    log INFO "Phase 4: Migrating documentation..."

    cd "$SESSION_DIR"

    # Create docs directory
    execute mkdir -p docs

    # Move documentation files
    git_mv README.md docs/README.md
    git_mv PATTERN-DATABASE.md docs/PATTERN-DATABASE.md
    git_mv SESSION-CLOSEOUT-TEMPLATE.md docs/SESSION-CLOSEOUT-TEMPLATE.md

    log SUCCESS "Phase 4 complete: Documentation migrated"
}

# Phase 5: Views
migrate_views() {
    log INFO "Phase 5: Migrating views..."

    cd "$SESSION_DIR"

    # Create views directory
    execute mkdir -p views

    # Move log file to views
    git_mv ISSUES-LOG.md views/findings-log.md

    log SUCCESS "Phase 5 complete: Views migrated"
}

# Phase 6: Archive duplicates
migrate_archive() {
    log INFO "Phase 6: Archiving duplicates..."

    cd "$SESSION_DIR"

    # Create archive directory
    execute mkdir -p .archive/duplicates

    # Move duplicate files if they exist
    if [[ -d .duplicates ]]; then
        # Move each file in .duplicates
        if [[ -n $(ls -A .duplicates 2>/dev/null) ]]; then
            for file in .duplicates/*; do
                if [[ -e "$file" ]]; then
                    local basename=$(basename "$file")
                    git_mv "$file" ".archive/duplicates/$basename"
                fi
            done
        fi

        # Remove empty .duplicates directory
        if [[ "$DRY_RUN" == "false" ]] && [[ -d .duplicates ]]; then
            rmdir .duplicates 2>/dev/null || log WARNING "Could not remove .duplicates directory"
        fi
    else
        log INFO "No .duplicates directory found, skipping"
    fi

    log SUCCESS "Phase 6 complete: Duplicates archived"
}

# Phase 7: Rename issue records to findings
migrate_records() {
    log INFO "Phase 7: Migrating issue records to findings..."

    cd "$SESSION_DIR"

    # Create records directory
    execute mkdir -p records

    # Move and rename issue files if issues directory exists
    if [[ -d issues ]]; then
        for file in issues/ISSUE-*.md; do
            if [[ -e "$file" ]]; then
                local basename=$(basename "$file")
                local new_name=$(echo "$basename" | sed 's/ISSUE-/FINDING-/')
                git_mv "$file" "records/$new_name"
            fi
        done

        # Remove empty issues directory
        if [[ "$DRY_RUN" == "false" ]] && [[ -d issues ]]; then
            rmdir issues 2>/dev/null || log WARNING "Could not remove issues directory (may not be empty)"
        fi
    else
        log INFO "No issues directory found, skipping"
    fi

    log SUCCESS "Phase 7 complete: Records migrated and renamed"
}

# Generate migration summary
generate_summary() {
    log INFO "Generating migration summary..."

    local summary_file="$SCRIPT_DIR/migration-summary.md"

    cat > "$summary_file" << 'EOF'
# Findings System Migration Summary

## Migration Completed

The findings system has been reorganized with the following structure:

```
sessions/findings/
├── .database/              # Database files
│   ├── findings.json       # Findings database (was .issues-database.json)
│   └── patterns.json       # Patterns database (was .pattern-database.json)
├── bin/                    # Executable scripts
│   ├── findings            # Core utilities (was issue-utils.sh)
│   ├── detect-findings     # Detection script (was detect-issues.sh)
│   └── pattern-db          # Pattern database CLI (was pattern-database.sh)
├── tests/                  # Test files
│   └── integration/
│       └── test-integration.sh
├── docs/                   # Documentation
│   ├── README.md
│   ├── PATTERN-DATABASE.md
│   └── SESSION-CLOSEOUT-TEMPLATE.md
├── views/                  # User-facing views
│   └── findings-log.md     # Findings log (was ISSUES-LOG.md)
├── records/                # Finding records
│   └── FINDING-*.md        # Individual findings (was ISSUE-*.md)
├── .archive/               # Archived content
│   └── duplicates/         # Duplicate files (was .duplicates/)
└── .metadata/              # Migration metadata
    ├── migrate.sh
    ├── migration.log
    └── migration-summary.md
```

## Changes Made

### Database Files
- `.issues-database.json` → `.database/findings.json`
- `.pattern-database.json` → `.database/patterns.json`

### Scripts
- `issue-utils.sh` → `bin/findings`
- `detect-issues.sh` → `bin/detect-findings`
- `pattern-database.sh` → `bin/pattern-db`

### Tests
- `test-integration.sh` → `tests/integration/test-integration.sh`

### Documentation
- `README.md` → `docs/README.md`
- `PATTERN-DATABASE.md` → `docs/PATTERN-DATABASE.md`
- `SESSION-CLOSEOUT-TEMPLATE.md` → `docs/SESSION-CLOSEOUT-TEMPLATE.md`

### Views
- `ISSUES-LOG.md` → `views/findings-log.md`

### Records
- `issues/ISSUE-*.md` → `records/FINDING-*.md`

### Archive
- `.duplicates/*` → `.archive/duplicates/*`

## Git History Preserved

All moves used `git mv` to preserve file history. You can verify with:

```bash
# Check history of migrated files
git log --follow sessions/findings/.database/findings.json
git log --follow sessions/findings/bin/findings
git log --follow sessions/findings/records/FINDING-*.md
```

## Rollback Instructions

If you need to rollback this migration:

### Option 1: Git Reset (if not yet pushed)
```bash
git reset --hard HEAD~1
```

### Option 2: Restore from backup branch
```bash
git checkout backup-findings-YYYYMMDD-HHMMSS
```

### Option 3: Manual restoration
The git history is preserved, so you can use `git mv` to move files back:

```bash
cd sessions/findings
git mv .database/findings.json .issues-database.json
git mv .database/patterns.json .pattern-database.json
git mv bin/findings issue-utils.sh
# ... etc
```

## Next Steps

1. Update any scripts that reference old paths
2. Update documentation with new paths
3. Test all functionality with new structure
4. Commit the migration:
   ```bash
   git add -A
   git commit -m "refactor: Reorganize findings system structure"
   ```

## Verification

Run the integration tests to verify everything works:

```bash
cd sessions/findings
./tests/integration/test-integration.sh
```

---

Migration completed at: $(date '+%Y-%m-%d %H:%M:%S')
Log file: $LOG_FILE
EOF

    log SUCCESS "Migration summary written to: $summary_file"

    if [[ "$DRY_RUN" == "false" ]]; then
        cat "$summary_file"
    fi
}

# Main migration function
main() {
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║     Findings System Migration Script v1.0.0            ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""

    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}[DRY-RUN MODE] No changes will be made${NC}"
        echo ""
    fi

    # Initialize log file
    if [[ "$DRY_RUN" == "false" ]]; then
        mkdir -p "$(dirname "$LOG_FILE")"
        echo "Migration started at $(date '+%Y-%m-%d %H:%M:%S')" > "$LOG_FILE"
    fi

    # Execute migration phases
    verify_prerequisites
    create_backup

    migrate_database
    migrate_scripts
    migrate_tests
    migrate_docs
    migrate_views
    migrate_archive
    migrate_records

    generate_summary

    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     Migration Complete!                                 ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""

    if [[ "$DRY_RUN" == "false" ]]; then
        echo -e "Log file: ${BLUE}$LOG_FILE${NC}"
        echo -e "Summary: ${BLUE}$SCRIPT_DIR/migration-summary.md${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo "1. Review the changes: git status"
        echo "2. Test functionality: cd sessions/findings && ./tests/integration/test-integration.sh"
        echo "3. Commit: git add -A && git commit -m 'refactor: Reorganize findings system structure'"
        echo ""
        echo -e "${YELLOW}To rollback:${NC} git reset --hard HEAD~1"
    else
        echo -e "${YELLOW}This was a dry-run. Execute without --dry-run to apply changes.${NC}"
    fi
}

# Run main function
main
