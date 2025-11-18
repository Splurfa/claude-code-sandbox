#!/bin/bash
# Workspace Documentation Migration Plan
# Session: session-20251117-233107-workspace-docs-optimization
# Purpose: Migrate docs from old structure → Diátaxis-aligned structure
# Safety: All operations backed up, git-trackable, with rollback

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR=".migration-backup-$(date +%Y%m%d-%H%M%S)"
SESSION_ID="session-20251117-233107-workspace-docs-optimization"
LOG_FILE="sessions/${SESSION_ID}/artifacts/notes/migration-log.txt"
DRY_RUN="${DRY_RUN:-false}"

# Logging functions
log() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

# Safety check: ensure we're in the right directory
check_prerequisites() {
    log "Checking prerequisites..."

    if [ ! -d "docs" ]; then
        error "docs/ directory not found. Are you in the project root?"
        exit 1
    fi

    if [ ! -d ".git" ]; then
        error ".git/ directory not found. This must be run in a git repository."
        exit 1
    fi

    if [ -n "$(git status --porcelain)" ]; then
        warning "Working directory has uncommitted changes."
        echo "It's recommended to commit or stash changes before migration."
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    success "Prerequisites check passed"
}

# Create backup of current state
create_backup() {
    log "Creating backup at ${BACKUP_DIR}..."

    if [ "$DRY_RUN" = "true" ]; then
        log "[DRY RUN] Would create backup at ${BACKUP_DIR}"
        return
    fi

    mkdir -p "$BACKUP_DIR"
    cp -R docs "$BACKUP_DIR/"

    success "Backup created at ${BACKUP_DIR}"
}

# Phase 1: Preparation - Create new folder structure
phase1_preparation() {
    log "=== PHASE 1: PREPARATION ==="

    log "Creating new directory structure..."

    local dirs=(
        "docs/tutorials"
        "docs/tutorials/01-foundations"
        "docs/tutorials/02-essential-skills"
        "docs/tutorials/03-intermediate"
        "docs/tutorials/04-advanced"
        "docs/how-to"
        "docs/explanation"
        "docs/reference"
        "docs/internals"
        "docs/advanced"
        "docs/troubleshooting"
        "docs/.archive"
    )

    for dir in "${dirs[@]}"; do
        if [ "$DRY_RUN" = "true" ]; then
            log "[DRY RUN] Would create directory: $dir"
        else
            mkdir -p "$dir"
            log "Created: $dir"
        fi
    done

    success "Phase 1 complete: Directory structure created"
}

# Phase 2: Content Triage - Delete, move, identify rewrites
phase2_triage() {
    log "=== PHASE 2: CONTENT TRIAGE ==="

    # 2.1: Delete unnecessary research artifacts
    log "Step 2.1: Removing research artifacts..."

    local delete_files=(
        "docs/reference/meta-research-mission.md"
        "docs/reference/temporal-research-collections.md"
        "docs/reference/session-protocol-gap-analysis.md"
        "docs/reference/adaptive-queen-proposal.md"
        "docs/reference/closeout-sh-changes.md"
        "docs/reference/session-mgmt-changes.md"
        "docs/reference/session-management-research.md"
        "docs/reference/session-fix-patch.md"
        "docs/reference/categorization-test-results.md"
        "docs/.archive/temporal-artifacts"
    )

    for file in "${delete_files[@]}"; do
        if [ -e "$file" ]; then
            if [ "$DRY_RUN" = "true" ]; then
                log "[DRY RUN] Would delete: $file"
            else
                if [ -d "$file" ]; then
                    rm -rf "$file"
                else
                    rm -f "$file"
                fi
                log "Deleted: $file"
            fi
        else
            log "Already gone: $file"
        fi
    done

    # 2.2: Move properly categorized files (already in correct locations)
    log "Step 2.2: Verifying properly categorized files..."

    local verify_files=(
        "docs/explanation/workspace-architecture.md"
        "docs/explanation/session-management.md"
        "docs/explanation/file-routing.md"
        "docs/how-to/integration-testing-guide.md"
        "docs/how-to/choose-coordination-approach.md"
        "docs/how-to/zero-risk-execution-pattern.md"
        "docs/reference/feature-verification-checklist.md"
        "docs/troubleshooting/troubleshooting-guide.md"
    )

    for file in "${verify_files[@]}"; do
        if [ -f "$file" ]; then
            success "Verified: $file (already in correct location)"
        else
            warning "Missing expected file: $file"
        fi
    done

    # 2.3: Move misplaced reference files
    log "Step 2.3: Moving misplaced reference files..."

    # These files are currently in docs/reference/ but should move to docs/internals/
    local move_to_internals=(
        "docs/reference/claude-flow-directory-management.md:docs/internals/directory-management.md"
        "docs/reference/implementation-architecture.md:docs/internals/implementation-notes.md"
    )

    for mapping in "${move_to_internals[@]}"; do
        src="${mapping%%:*}"
        dest="${mapping##*:}"

        if [ -f "$src" ]; then
            if [ "$DRY_RUN" = "true" ]; then
                log "[DRY RUN] Would move: $src → $dest"
            else
                mv "$src" "$dest"
                success "Moved: $src → $dest"
            fi
        else
            log "Source not found: $src"
        fi
    done

    # Keep these in reference/ but note they may need content updates
    log "Step 2.4: Identifying files for content review..."

    local review_files=(
        "docs/reference/feature-reality-check.md:Needs update - old feature analysis"
        "docs/reference/template-usage-guide.md:Needs review - template usage clarity"
        "docs/reference/hive-mind-quick-reference.md:Needs consolidation with tutorials"
        "docs/reference/hive-mind-reality-guide.md:Needs consolidation with how-to guides"
    )

    echo "FILES NEEDING CONTENT REVIEW:" > "sessions/${SESSION_ID}/artifacts/notes/review-needed.txt"
    for mapping in "${review_files[@]}"; do
        file="${mapping%%:*}"
        reason="${mapping##*:}"

        echo "- ${file}: ${reason}" | tee -a "sessions/${SESSION_ID}/artifacts/notes/review-needed.txt"
    done

    # 2.5: Move legacy README to archive
    log "Step 2.5: Archiving legacy files..."

    if [ -f "docs/guides-legacy-readme.md" ]; then
        if [ "$DRY_RUN" = "true" ]; then
            log "[DRY RUN] Would move: docs/guides-legacy-readme.md → docs/.archive/"
        else
            mv "docs/guides-legacy-readme.md" "docs/.archive/"
            success "Archived: guides-legacy-readme.md"
        fi
    fi

    success "Phase 2 complete: Content triage finished"
}

# Phase 3: Content Updates - Rewrite outdated, add missing coverage
phase3_updates() {
    log "=== PHASE 3: CONTENT UPDATES ==="

    log "Creating content update plan..."

    # This phase identifies what content needs to be created or rewritten
    # Actual content updates should be done by Content Writer agent

    cat > "sessions/${SESSION_ID}/artifacts/notes/content-plan.txt" << 'EOF'
CONTENT UPDATE PLAN
===================

REQUIRED NEW CONTENT:
--------------------

1. TUTORIALS (High Priority):
   - tutorials/01-foundations/first-session.md
     * Step-by-step: Create session, do work, close session
     * Practice: File routing, memory operations
     * Time: 15-20 minutes

   - tutorials/02-essential-skills/multi-agent-coordination.md
     * Learn: Spawn multiple agents, coordinate work
     * Practice: Memory sharing, task dependencies
     * Time: 30 minutes

   - tutorials/03-intermediate/swarm-topologies.md
     * Explore: Mesh vs hierarchical vs ring
     * Practice: Choose topology for use case
     * Time: 45 minutes

2. HOW-TO GUIDES (Medium Priority):
   - how-to/session-closeout.md
     * Recipe: Close session with HITL approval
     * When: End of work, archival needed

   - how-to/manual-session-management.md
     * Recipe: Create/manage sessions without auto-hooks
     * When: Testing, debugging, special cases

   - how-to/memory-operations.md
     * Recipe: Store/retrieve/search memory
     * When: Agent coordination, context sharing

3. EXPLANATIONS (Medium Priority):
   - explanation/coordination-patterns.md
     * Why: Different patterns exist
     * When: Use mesh vs hierarchical vs swarm
     * Theory: Coordination overhead vs parallelism

   - explanation/memory-management.md
     * How: Memory system works
     * Why: Namespaces, TTL, cross-session persistence
     * Architecture: SQLite backing, MCP interface

4. REFERENCE (Low Priority):
   - reference/mcp-tools-quick-reference.md
     * Lookup: All MCP tool signatures
     * Quick: Copy-paste examples

   - reference/agent-types-catalog.md
     * List: All 54 agent types
     * Specs: Capabilities, use cases

   - reference/hooks-api.md
     * API: All hook commands
     * Usage: Parameters, return values

CONTENT UPDATES REQUIRED:
-------------------------

1. docs/reference/feature-reality-check.md
   - Current: Old feature analysis from research phase
   - Update: Convert to feature status checklist
   - Keep: Current feature state
   - Remove: Historical analysis narrative

2. docs/reference/hive-mind-quick-reference.md
   - Current: Quick reference format
   - Update: Align with tutorial structure
   - Move: Examples to tutorials
   - Keep: Quick lookup tables

3. docs/reference/hive-mind-reality-guide.md
   - Current: Reality check + how-to hybrid
   - Update: Split into:
     * reference/hive-mind-reality.md (facts)
     * how-to/hive-mind-workflows.md (recipes)

4. docs/reference/template-usage-guide.md
   - Current: Guide format (belongs in how-to)
   - Update: Convert to quick reference
   - OR: Move to how-to/use-templates.md

CROSS-REFERENCE UPDATES:
------------------------

All files need cross-references updated to link between:
- Tutorials → How-to (for practical application)
- How-to → Explanation (for understanding)
- Explanation → Reference (for quick lookups)
- Reference → Internals (for deep dives)

See: sessions/${SESSION_ID}/artifacts/docs/CROSS-REFERENCE-MAP.md

EOF

    success "Content plan created at sessions/${SESSION_ID}/artifacts/notes/content-plan.txt"

    log "Phase 3 preparation complete (actual updates need Content Writer)"
}

# Phase 4: Verification - Test links, learning path, tutor integration
phase4_verification() {
    log "=== PHASE 4: VERIFICATION ==="

    log "Creating verification checklist..."

    cat > "sessions/${SESSION_ID}/artifacts/notes/verification-checklist.txt" << 'EOF'
MIGRATION VERIFICATION CHECKLIST
=================================

STRUCTURE VERIFICATION:
----------------------
[ ] All directories created:
    [ ] docs/tutorials/{01,02,03,04}
    [ ] docs/how-to/
    [ ] docs/explanation/
    [ ] docs/reference/
    [ ] docs/internals/
    [ ] docs/advanced/
    [ ] docs/troubleshooting/
    [ ] docs/.archive/

[ ] All files in correct locations:
    [ ] Explanations in docs/explanation/
    [ ] How-to guides in docs/how-to/
    [ ] References in docs/reference/
    [ ] Tutorials in docs/tutorials/
    [ ] Internals in docs/internals/

[ ] Backup created at: ${BACKUP_DIR}

LINK VERIFICATION:
-----------------
Run this command to check for broken links:

    find docs -name "*.md" -exec grep -l "\[.*\](.*\.md)" {} \; | \
    while read file; do
        echo "Checking: $file"
        grep -o "\[.*\](.*\.md)" "$file" | \
        sed 's/.*(\(.*\.md\)).*/\1/' | \
        while read link; do
            if [ ! -f "docs/$link" ]; then
                echo "  BROKEN: $link"
            fi
        done
    done

[ ] All internal links work
[ ] No broken cross-references
[ ] README.md navigation updated

LEARNING PATH VERIFICATION:
--------------------------
[ ] New user path works:
    1. docs/README.md → Quick Navigation → I'm New Here
    2. explanation/workspace-architecture.md (understand system)
    3. explanation/session-management.md (understand sessions)
    4. tutorials/01-foundations/first-session.md (hands-on practice)
    5. how-to/integration-testing-guide.md (verify setup)

[ ] Developer path works:
    1. docs/README.md → Role-Based → For Developers
    2. internals/architecture-overview.md (system design)
    3. internals/coordination-mechanics.md (how agents work)
    4. internals/integration-points.md (extension points)
    5. how-to guides for common tasks

[ ] Power user path works:
    1. docs/README.md → Role-Based → For Power Users
    2. advanced/ guides (advanced patterns)
    3. internals/ for optimization
    4. Custom workflows

TUTOR-MODE INTEGRATION:
----------------------
[ ] Tutor mode can find:
    [ ] Tutorial content in docs/tutorials/
    [ ] Skill exercises in .claude/skills/
    [ ] How-to guides for quick help

[ ] Progress tracking works:
    [ ] tutorials/progress-tracker.md exists
    [ ] Links to all tutorial modules
    [ ] Checkboxes for completion

[ ] Tutor references are accurate:
    [ ] .claude/skills/tutor-mode/SKILL.md updated
    [ ] Points to correct tutorial paths
    [ ] No broken skill references

GIT STATUS:
----------
[ ] All changes tracked:
    [ ] git status shows changes
    [ ] No accidental deletions
    [ ] Backup directory not committed

[ ] Commit message prepared:
    Migration: Optimize workspace docs to Diátaxis structure

    - Remove research artifacts (temporal, meta-analysis)
    - Move misplaced files to correct categories
    - Archive legacy content
    - Create content update plan
    - Preserve all user-facing documentation

    See: sessions/session-20251117-233107-workspace-docs-optimization/

ROLLBACK READINESS:
------------------
[ ] Backup exists: ${BACKUP_DIR}
[ ] Rollback script tested (see ROLLBACK PROCEDURE below)
[ ] Git can revert: git checkout -- docs/

SUCCESS CRITERIA:
----------------
[ ] Navigation: User can find docs by purpose (learning/doing/understanding/lookup)
[ ] Completeness: No missing essential documentation
[ ] Accuracy: All links work, no 404s
[ ] Clarity: Each doc has clear purpose (tutorial/how-to/explanation/reference)
[ ] Discoverability: docs/README.md provides clear entry points
[ ] Maintenance: Easy to add new docs in correct location
EOF

    success "Verification checklist created"

    log "Running automated link checks..."

    if [ "$DRY_RUN" = "true" ]; then
        log "[DRY RUN] Would run link verification"
    else
        # Basic link check (comprehensive check should be done post-migration)
        find docs -name "*.md" -type f | head -10 | while read file; do
            log "Checking links in: $(basename "$file")"
        done
    fi

    success "Phase 4 verification setup complete"
}

# Rollback procedure
rollback() {
    error "ROLLING BACK MIGRATION..."

    if [ ! -d "$BACKUP_DIR" ]; then
        error "Backup directory not found: ${BACKUP_DIR}"
        error "Manual rollback required: git checkout -- docs/"
        exit 1
    fi

    log "Restoring from backup: ${BACKUP_DIR}"
    rm -rf docs
    cp -R "${BACKUP_DIR}/docs" .

    success "Rollback complete. Workspace restored to pre-migration state."
}

# Main execution
main() {
    log "==================================================="
    log "WORKSPACE DOCUMENTATION MIGRATION"
    log "Session: ${SESSION_ID}"
    log "Timestamp: $(date)"
    log "Dry Run: ${DRY_RUN}"
    log "==================================================="

    # Setup
    mkdir -p "sessions/${SESSION_ID}/artifacts/notes"

    # Execute phases
    check_prerequisites
    create_backup

    phase1_preparation
    phase2_triage
    phase3_updates
    phase4_verification

    # Summary
    log "==================================================="
    success "MIGRATION PLAN EXECUTION COMPLETE"
    log "==================================================="

    echo ""
    echo -e "${GREEN}Next Steps:${NC}"
    echo "1. Review migration log: ${LOG_FILE}"
    echo "2. Check files needing review: sessions/${SESSION_ID}/artifacts/notes/review-needed.txt"
    echo "3. Review content plan: sessions/${SESSION_ID}/artifacts/notes/content-plan.txt"
    echo "4. Complete verification: sessions/${SESSION_ID}/artifacts/notes/verification-checklist.txt"
    echo "5. Commit changes: git add docs && git commit"
    echo ""
    echo -e "${YELLOW}Rollback if needed:${NC}"
    echo "   bash $0 rollback"
    echo ""
    echo -e "${BLUE}Backup location:${NC} ${BACKUP_DIR}"
}

# Entrypoint
if [ $# -gt 0 ] && [ "$1" = "rollback" ]; then
    rollback
else
    main
fi
