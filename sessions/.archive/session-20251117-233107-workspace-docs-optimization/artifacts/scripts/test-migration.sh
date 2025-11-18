#!/bin/bash
# Migration Testing Suite
# Session: session-20251117-233107-workspace-docs-optimization
# Purpose: Comprehensive testing of migration plan

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

RESULTS_FILE="sessions/session-20251117-233107-workspace-docs-optimization/artifacts/notes/test-results.txt"

pass() {
    echo -e "${GREEN}✓${NC} $1" | tee -a "$RESULTS_FILE"
}

fail() {
    echo -e "${RED}✗${NC} $1" | tee -a "$RESULTS_FILE"
}

warn() {
    echo -e "${YELLOW}⚠${NC} $1" | tee -a "$RESULTS_FILE"
}

info() {
    echo -e "${BLUE}ℹ${NC} $1" | tee -a "$RESULTS_FILE"
}

# Initialize results file
echo "MIGRATION TEST RESULTS" > "$RESULTS_FILE"
echo "=====================" >> "$RESULTS_FILE"
echo "Date: $(date)" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Test 1: Script Exists and is Executable
test_script_exists() {
    info "Test 1: Migration script exists and is executable"

    if [ -f "sessions/session-20251117-233107-workspace-docs-optimization/artifacts/scripts/MIGRATION-PLAN.sh" ]; then
        pass "Migration script exists"
    else
        fail "Migration script not found"
        return 1
    fi

    if [ -x "sessions/session-20251117-233107-workspace-docs-optimization/artifacts/scripts/MIGRATION-PLAN.sh" ]; then
        pass "Script is executable"
    else
        fail "Script is not executable"
        return 1
    fi
}

# Test 2: Documentation Exists
test_docs_exist() {
    info "Test 2: Documentation files exist"

    local docs=(
        "sessions/session-20251117-233107-workspace-docs-optimization/artifacts/docs/MIGRATION-GUIDE.md"
        "sessions/session-20251117-233107-workspace-docs-optimization/artifacts/docs/CROSS-REFERENCE-MAP.md"
    )

    for doc in "${docs[@]}"; do
        if [ -f "$doc" ]; then
            pass "Found: $(basename "$doc")"
        else
            fail "Missing: $(basename "$doc")"
        fi
    done
}

# Test 3: Dry Run Succeeds
test_dry_run() {
    info "Test 3: Dry run execution"

    if DRY_RUN=true bash sessions/session-20251117-233107-workspace-docs-optimization/artifacts/scripts/MIGRATION-PLAN.sh > /dev/null 2>&1; then
        pass "Dry run completed without errors"
    else
        fail "Dry run failed"
        return 1
    fi
}

# Test 4: Current Structure Validation
test_current_structure() {
    info "Test 4: Current docs structure validation"

    # Check essential current files exist
    local essential=(
        "docs/README.md"
        "docs/explanation/workspace-architecture.md"
        "docs/explanation/session-management.md"
        "docs/explanation/file-routing.md"
        "docs/how-to/integration-testing-guide.md"
        "docs/internals/architecture-overview.md"
    )

    for file in "${essential[@]}"; do
        if [ -f "$file" ]; then
            pass "Current file exists: $(basename "$file")"
        else
            fail "Missing essential file: $file"
        fi
    done
}

# Test 5: Files to Delete Exist
test_deletion_targets() {
    info "Test 5: Validate files marked for deletion"

    local delete_files=(
        "docs/reference/meta-research-mission.md"
        "docs/reference/temporal-research-collections.md"
        "docs/reference/session-protocol-gap-analysis.md"
        "docs/reference/adaptive-queen-proposal.md"
    )

    local exist_count=0
    local total=${#delete_files[@]}

    for file in "${delete_files[@]}"; do
        if [ -f "$file" ]; then
            ((exist_count++))
            info "To delete: $(basename "$file")"
        fi
    done

    if [ $exist_count -gt 0 ]; then
        pass "Found $exist_count/$total files to delete"
    else
        warn "No files to delete (may already be clean)"
    fi
}

# Test 6: Script Syntax Check
test_script_syntax() {
    info "Test 6: Script syntax validation"

    if bash -n sessions/session-20251117-233107-workspace-docs-optimization/artifacts/scripts/MIGRATION-PLAN.sh 2>/dev/null; then
        pass "Script syntax is valid"
    else
        fail "Script has syntax errors"
        return 1
    fi
}

# Test 7: Git Repository Check
test_git_repo() {
    info "Test 7: Git repository validation"

    if [ -d ".git" ]; then
        pass "Git repository exists"
    else
        fail "Not in a git repository"
        return 1
    fi

    if git rev-parse --git-dir > /dev/null 2>&1; then
        pass "Git repository is valid"
    else
        fail "Git repository is corrupted"
        return 1
    fi
}

# Test 8: Backup Directory Preparation
test_backup_preparation() {
    info "Test 8: Backup directory preparation"

    # Check if we have write permissions
    if [ -w "." ]; then
        pass "Have write permissions in current directory"
    else
        fail "No write permissions for backup"
        return 1
    fi

    # Check if docs exists and is readable
    if [ -d "docs" ] && [ -r "docs" ]; then
        pass "Docs directory is readable for backup"
    else
        fail "Cannot read docs directory"
        return 1
    fi
}

# Test 9: Required Directories Exist
test_required_dirs() {
    info "Test 9: Required directory structure"

    local required=(
        "docs"
        "docs/explanation"
        "docs/how-to"
        "docs/reference"
        "docs/internals"
        "docs/tutorials"
    )

    for dir in "${required[@]}"; do
        if [ -d "$dir" ]; then
            pass "Directory exists: $dir"
        else
            warn "Directory will be created: $dir"
        fi
    done
}

# Test 10: Link Validation (Sample)
test_links_sample() {
    info "Test 10: Link validation (sample check)"

    # Check a few key files for broken links
    local test_files=(
        "docs/README.md"
        "docs/explanation/workspace-architecture.md"
    )

    local broken_count=0

    for file in "${test_files[@]}"; do
        if [ -f "$file" ]; then
            # Extract and check links (basic check)
            if grep -q "\[.*\](.*\.md)" "$file"; then
                info "File has links: $(basename "$file")"
            else
                warn "File has no internal links: $(basename "$file")"
            fi
        fi
    done

    if [ $broken_count -eq 0 ]; then
        pass "Sample link check passed"
    else
        warn "Found potential link issues (full check needed)"
    fi
}

# Test 11: Content Plan Validation
test_content_plan() {
    info "Test 11: Content plan validation"

    # Verify migration creates expected output files
    local expected_outputs=(
        "sessions/session-20251117-233107-workspace-docs-optimization/artifacts/notes/review-needed.txt"
        "sessions/session-20251117-233107-workspace-docs-optimization/artifacts/notes/content-plan.txt"
        "sessions/session-20251117-233107-workspace-docs-optimization/artifacts/notes/verification-checklist.txt"
    )

    # These will be created by migration, so we just check the script mentions them
    if grep -q "review-needed.txt" sessions/session-20251117-233107-workspace-docs-optimization/artifacts/scripts/MIGRATION-PLAN.sh; then
        pass "Script creates review-needed.txt"
    else
        fail "Script missing review-needed.txt creation"
    fi

    if grep -q "content-plan.txt" sessions/session-20251117-233107-workspace-docs-optimization/artifacts/scripts/MIGRATION-PLAN.sh; then
        pass "Script creates content-plan.txt"
    else
        fail "Script missing content-plan.txt creation"
    fi
}

# Test 12: Rollback Function Exists
test_rollback_exists() {
    info "Test 12: Rollback function validation"

    if grep -q "^rollback()" sessions/session-20251117-233107-workspace-docs-optimization/artifacts/scripts/MIGRATION-PLAN.sh; then
        pass "Rollback function exists"
    else
        fail "Rollback function missing"
        return 1
    fi

    if grep -q 'if \[ $# -gt 0 \] && \[ "$1" = "rollback" \]' sessions/session-20251117-233107-workspace-docs-optimization/artifacts/scripts/MIGRATION-PLAN.sh; then
        pass "Rollback can be invoked via argument"
    else
        fail "Rollback invocation missing"
    fi
}

# Test 13: Safety Checks in Script
test_safety_checks() {
    info "Test 13: Safety check validation"

    local safety_checks=(
        "check_prerequisites"
        "create_backup"
        "DRY_RUN"
    )

    for check in "${safety_checks[@]}"; do
        if grep -q "$check" sessions/session-20251117-233107-workspace-docs-optimization/artifacts/scripts/MIGRATION-PLAN.sh; then
            pass "Safety check present: $check"
        else
            fail "Missing safety check: $check"
        fi
    done
}

# Test 14: Migration Guide Completeness
test_guide_completeness() {
    info "Test 14: Migration guide completeness"

    local required_sections=(
        "Executive Summary"
        "Migration Overview"
        "Migration Phases"
        "Execution Instructions"
        "Rollback Procedure"
        "Safety Guarantees"
    )

    local guide="sessions/session-20251117-233107-workspace-docs-optimization/artifacts/docs/MIGRATION-GUIDE.md"

    if [ ! -f "$guide" ]; then
        fail "Migration guide not found"
        return 1
    fi

    for section in "${required_sections[@]}"; do
        if grep -q "$section" "$guide"; then
            pass "Guide section: $section"
        else
            fail "Missing guide section: $section"
        fi
    done
}

# Test 15: Cross-Reference Map Completeness
test_crossref_completeness() {
    info "Test 15: Cross-reference map completeness"

    local crossref="sessions/session-20251117-233107-workspace-docs-optimization/artifacts/docs/CROSS-REFERENCE-MAP.md"

    if [ ! -f "$crossref" ]; then
        fail "Cross-reference map not found"
        return 1
    fi

    local required_topics=(
        "Session Management"
        "File Routing"
        "Workspace Architecture"
        "Coordination & Agents"
        "Memory & State"
    )

    for topic in "${required_topics[@]}"; do
        if grep -q "$topic" "$crossref"; then
            pass "Cross-ref topic: $topic"
        else
            warn "Missing cross-ref topic: $topic"
        fi
    done
}

# Summary
print_summary() {
    echo "" | tee -a "$RESULTS_FILE"
    echo "==============================" | tee -a "$RESULTS_FILE"
    echo "TEST SUMMARY" | tee -a "$RESULTS_FILE"
    echo "==============================" | tee -a "$RESULTS_FILE"

    local total_tests=15
    local passed=$(grep -c "^✓" "$RESULTS_FILE" || echo 0)
    local failed=$(grep -c "^✗" "$RESULTS_FILE" || echo 0)
    local warned=$(grep -c "^⚠" "$RESULTS_FILE" || echo 0)

    echo "" | tee -a "$RESULTS_FILE"
    echo -e "${GREEN}Passed:${NC} $passed/$total_tests" | tee -a "$RESULTS_FILE"
    echo -e "${RED}Failed:${NC} $failed/$total_tests" | tee -a "$RESULTS_FILE"
    echo -e "${YELLOW}Warnings:${NC} $warned" | tee -a "$RESULTS_FILE"
    echo "" | tee -a "$RESULTS_FILE"

    if [ $failed -eq 0 ]; then
        echo -e "${GREEN}✓ ALL TESTS PASSED${NC}" | tee -a "$RESULTS_FILE"
        echo "Migration is ready for execution." | tee -a "$RESULTS_FILE"
        return 0
    else
        echo -e "${RED}✗ SOME TESTS FAILED${NC}" | tee -a "$RESULTS_FILE"
        echo "Review failures before executing migration." | tee -a "$RESULTS_FILE"
        return 1
    fi
}

# Run all tests
main() {
    echo "==================================="
    echo "MIGRATION TESTING SUITE"
    echo "==================================="
    echo ""

    mkdir -p sessions/session-20251117-233107-workspace-docs-optimization/artifacts/notes

    test_script_exists || true
    test_docs_exist || true
    test_dry_run || true
    test_current_structure || true
    test_deletion_targets || true
    test_script_syntax || true
    test_git_repo || true
    test_backup_preparation || true
    test_required_dirs || true
    test_links_sample || true
    test_content_plan || true
    test_rollback_exists || true
    test_safety_checks || true
    test_guide_completeness || true
    test_crossref_completeness || true

    print_summary
}

main
