#!/usr/bin/env bash
# Migration Validation Script
# Validates clean workspace meets stock architecture requirements

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
WORKSPACE_DIR="${1:-$(pwd)}"
STRICT_MODE="${STRICT_MODE:-true}"
REPORT_FILE="${REPORT_FILE:-validation-report.json}"

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNINGS=0

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; ((WARNINGS++)); }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_check() { echo -e "${BLUE}[CHECK]${NC} $1"; ((TOTAL_CHECKS++)); }
log_pass() { echo -e "${GREEN}[PASS]${NC} $1"; ((PASSED_CHECKS++)); }
log_fail() { echo -e "${RED}[FAIL]${NC} $1"; ((FAILED_CHECKS++)); }

# Results array
declare -a RESULTS=()

add_result() {
    local check="$1"
    local status="$2"
    local message="$3"
    RESULTS+=("$check|$status|$message")
}

# Check: Directory structure
check_directory_structure() {
    log_check "Validating directory structure..."

    local required_dirs=(
        "src"
        "tests"
        "docs"
        "scripts"
    )

    local all_exist=true
    for dir in "${required_dirs[@]}"; do
        if [ -d "$WORKSPACE_DIR/$dir" ]; then
            log_pass "Directory exists: $dir"
            add_result "directory_$dir" "pass" "Directory exists"
        else
            log_fail "Missing directory: $dir"
            add_result "directory_$dir" "fail" "Directory missing"
            all_exist=false
        fi
    done

    if [ "$all_exist" = true ]; then
        log_pass "Directory structure valid"
    else
        log_fail "Directory structure incomplete"
    fi
}

# Check: Essential files
check_essential_files() {
    log_check "Checking essential files..."

    local required_files=(
        "package.json"
        "CLAUDE.md"
        ".gitignore"
        "README.md"
    )

    local all_exist=true
    for file in "${required_files[@]}"; do
        if [ -f "$WORKSPACE_DIR/$file" ]; then
            log_pass "File exists: $file"
            add_result "file_$file" "pass" "File exists"
        else
            log_fail "Missing file: $file"
            add_result "file_$file" "fail" "File missing"
            all_exist=false
        fi
    done

    if [ "$all_exist" = true ]; then
        log_pass "Essential files present"
    else
        log_fail "Essential files missing"
    fi
}

# Check: claude-flow installation
check_claude_flow() {
    log_check "Validating claude-flow installation..."

    cd "$WORKSPACE_DIR"

    if npx claude-flow --version &> /dev/null; then
        local version=$(npx claude-flow --version 2>&1 || echo "unknown")
        log_pass "claude-flow installed: $version"
        add_result "claude_flow_install" "pass" "Installed: $version"
    else
        log_fail "claude-flow not installed or not working"
        add_result "claude_flow_install" "fail" "Not installed"
    fi
}

# Check: No custom features in root
check_no_custom_features() {
    log_check "Checking for custom features in root..."

    local custom_paths=(
        ".claude/reasoningbank"
        ".agentdb"
        "sessions/captains-log"
        ".archive"
    )

    local found_custom=false
    for path in "${custom_paths[@]}"; do
        if [ -e "$WORKSPACE_DIR/$path" ]; then
            log_fail "Found custom feature: $path"
            add_result "no_custom_$path" "fail" "Custom feature found"
            found_custom=true
        else
            log_pass "No custom feature: $path"
            add_result "no_custom_$path" "pass" "No custom feature"
        fi
    done

    if [ "$found_custom" = false ]; then
        log_pass "No custom features in root"
    else
        log_fail "Custom features found in root"
    fi
}

# Check: CLAUDE.md content
check_claude_md_content() {
    log_check "Validating CLAUDE.md content..."

    if [ ! -f "$WORKSPACE_DIR/CLAUDE.md" ]; then
        log_fail "CLAUDE.md not found"
        add_result "claude_md_content" "fail" "File not found"
        return
    fi

    # Check for stock markers
    if grep -q "Stock Claude-Flow" "$WORKSPACE_DIR/CLAUDE.md"; then
        log_pass "CLAUDE.md contains stock marker"
        add_result "claude_md_stock" "pass" "Contains stock marker"
    else
        log_fail "CLAUDE.md missing stock marker"
        add_result "claude_md_stock" "fail" "Missing stock marker"
    fi

    # Check for custom feature references
    local custom_features=(
        "ReasoningBank"
        "AgentDB"
        "Captain's Log"
        "custom extensions"
    )

    local found_custom=false
    for feature in "${custom_features[@]}"; do
        if grep -qi "$feature" "$WORKSPACE_DIR/CLAUDE.md"; then
            log_warn "CLAUDE.md references custom feature: $feature"
            add_result "claude_md_custom_$feature" "warn" "Custom reference found"
            found_custom=true
        fi
    done

    if [ "$found_custom" = false ]; then
        log_pass "CLAUDE.md contains no custom feature references"
    fi
}

# Check: Hooks configuration
check_hooks() {
    log_check "Validating hooks configuration..."

    if [ -d "$WORKSPACE_DIR/.claude/hooks" ]; then
        log_pass "Hooks directory exists"
        add_result "hooks_dir" "pass" "Directory exists"

        # Check for stock hooks usage
        if [ -f "$WORKSPACE_DIR/.claude/hooks/README.md" ]; then
            if grep -q "npx claude-flow@alpha hooks" "$WORKSPACE_DIR/.claude/hooks/README.md"; then
                log_pass "Hooks use stock claude-flow commands"
                add_result "hooks_stock" "pass" "Uses stock commands"
            else
                log_fail "Hooks don't use stock commands"
                add_result "hooks_stock" "fail" "Not using stock commands"
            fi
        fi

        # Check for auto-hooks wrapper
        if [ -f "$WORKSPACE_DIR/.claude/hooks/auto-hooks.js" ]; then
            log_pass "Auto-hooks wrapper present (optional)"
            add_result "hooks_auto" "pass" "Wrapper exists"

            # Verify it's stock-first
            if grep -q "npx claude-flow" "$WORKSPACE_DIR/.claude/hooks/auto-hooks.js"; then
                log_pass "Auto-hooks wrapper is stock-first"
                add_result "hooks_auto_stock" "pass" "Stock-first wrapper"
            else
                log_fail "Auto-hooks wrapper not stock-first"
                add_result "hooks_auto_stock" "fail" "Not stock-first"
            fi
        fi
    else
        log_warn "Hooks directory not present (optional)"
        add_result "hooks_dir" "warn" "Directory not present"
    fi
}

# Check: Skills directory
check_skills() {
    log_check "Validating skills directory..."

    if [ -d "$WORKSPACE_DIR/.claude/skills" ]; then
        log_pass "Skills directory exists"
        add_result "skills_dir" "pass" "Directory exists"

        # Count skills
        local skill_count=$(find "$WORKSPACE_DIR/.claude/skills" -name "skill.md" 2>/dev/null | wc -l)
        if [ "$skill_count" -gt 0 ]; then
            log_pass "Found $skill_count skill(s)"
            add_result "skills_count" "pass" "Found $skill_count skills"
        else
            log_warn "No skills found"
            add_result "skills_count" "warn" "No skills found"
        fi
    else
        log_warn "Skills directory not present (optional)"
        add_result "skills_dir" "warn" "Directory not present"
    fi
}

# Check: Git repository
check_git() {
    log_check "Validating git repository..."

    if [ -d "$WORKSPACE_DIR/.git" ]; then
        log_pass "Git repository initialized"
        add_result "git_init" "pass" "Repository initialized"

        # Check for commits
        cd "$WORKSPACE_DIR"
        if git log -1 &> /dev/null; then
            local commit_count=$(git rev-list --count HEAD)
            log_pass "Repository has $commit_count commit(s)"
            add_result "git_commits" "pass" "$commit_count commits"
        else
            log_warn "No commits in repository"
            add_result "git_commits" "warn" "No commits"
        fi

        # Check .gitignore
        if [ -f "$WORKSPACE_DIR/.gitignore" ]; then
            if grep -q ".swarm/" "$WORKSPACE_DIR/.gitignore"; then
                log_pass ".gitignore includes .swarm/"
                add_result "gitignore_swarm" "pass" "Includes .swarm/"
            else
                log_fail ".gitignore missing .swarm/"
                add_result "gitignore_swarm" "fail" "Missing .swarm/"
            fi
        fi
    else
        log_fail "Not a git repository"
        add_result "git_init" "fail" "Not initialized"
    fi
}

# Check: Package.json structure
check_package_json() {
    log_check "Validating package.json..."

    if [ ! -f "$WORKSPACE_DIR/package.json" ]; then
        log_fail "package.json not found"
        add_result "package_json" "fail" "File not found"
        return
    fi

    # Check for claude-flow dependency
    if grep -q "claude-flow" "$WORKSPACE_DIR/package.json"; then
        log_pass "package.json includes claude-flow"
        add_result "package_claude_flow" "pass" "Includes claude-flow"
    else
        log_fail "package.json missing claude-flow"
        add_result "package_claude_flow" "fail" "Missing claude-flow"
    fi

    # Check for standard scripts
    local required_scripts=("test" "lint" "build")
    for script in "${required_scripts[@]}"; do
        if grep -q "\"$script\":" "$WORKSPACE_DIR/package.json"; then
            log_pass "package.json has $script script"
            add_result "package_script_$script" "pass" "Has $script script"
        else
            log_warn "package.json missing $script script"
            add_result "package_script_$script" "warn" "Missing $script script"
        fi
    done
}

# Calculate stock-first score
calculate_stock_score() {
    log_check "Calculating stock-first score..."

    local deductions=0

    # Check for custom features (each -10 points)
    [ -d "$WORKSPACE_DIR/.claude/reasoningbank" ] && ((deductions+=10))
    [ -d "$WORKSPACE_DIR/.agentdb" ] && ((deductions+=10))
    [ -d "$WORKSPACE_DIR/sessions/captains-log" ] && ((deductions+=10))

    # Check for custom hooks (-5 points if not stock-first)
    if [ -f "$WORKSPACE_DIR/.claude/hooks/auto-hooks.js" ]; then
        if ! grep -q "npx claude-flow" "$WORKSPACE_DIR/.claude/hooks/auto-hooks.js"; then
            ((deductions+=5))
        fi
    fi

    # Check CLAUDE.md (-15 points if heavy customization)
    if [ -f "$WORKSPACE_DIR/CLAUDE.md" ]; then
        local custom_refs=$(grep -ci "custom\|reasoningbank\|agentdb\|captain" "$WORKSPACE_DIR/CLAUDE.md" 2>/dev/null || echo 0)
        if [ "$custom_refs" -gt 5 ]; then
            ((deductions+=15))
        fi
    fi

    local score=$((100 - deductions))
    if [ $score -lt 0 ]; then
        score=0
    fi

    log_info "Stock-First Score: $score/100"
    add_result "stock_score" "info" "Score: $score/100"

    if [ $score -ge 95 ]; then
        log_pass "Excellent stock compliance"
    elif [ $score -ge 85 ]; then
        log_pass "Good stock compliance"
    elif [ $score -ge 70 ]; then
        log_warn "Moderate stock compliance"
    else
        log_fail "Poor stock compliance"
    fi
}

# Generate JSON report
generate_report() {
    log_info "Generating validation report..."

    local report_path="$WORKSPACE_DIR/$REPORT_FILE"

    cat > "$report_path" << EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "workspace": "$WORKSPACE_DIR",
  "validation": {
    "total_checks": $TOTAL_CHECKS,
    "passed": $PASSED_CHECKS,
    "failed": $FAILED_CHECKS,
    "warnings": $WARNINGS
  },
  "results": [
EOF

    local first=true
    for result in "${RESULTS[@]}"; do
        IFS='|' read -r check status message <<< "$result"

        if [ "$first" = false ]; then
            echo "," >> "$report_path"
        fi
        first=false

        cat >> "$report_path" << EOF
    {
      "check": "$check",
      "status": "$status",
      "message": "$message"
    }
EOF
    done

    cat >> "$report_path" << EOF

  ]
}
EOF

    log_info "Report saved: $report_path"
}

# Print summary
print_summary() {
    echo ""
    echo "=========================================="
    echo "  Migration Validation Summary"
    echo "=========================================="
    echo ""
    echo "Total Checks: $TOTAL_CHECKS"
    echo "Passed: $PASSED_CHECKS"
    echo "Failed: $FAILED_CHECKS"
    echo "Warnings: $WARNINGS"
    echo ""

    local success_rate=0
    if [ $TOTAL_CHECKS -gt 0 ]; then
        success_rate=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    fi
    echo "Success Rate: $success_rate%"
    echo ""

    if [ $FAILED_CHECKS -eq 0 ]; then
        echo -e "${GREEN}✓ Migration VALID${NC}"
        echo "=========================================="
        return 0
    elif [ "$STRICT_MODE" = "true" ]; then
        echo -e "${RED}✗ Migration INVALID (strict mode)${NC}"
        echo "=========================================="
        return 1
    else
        echo -e "${YELLOW}⚠ Migration has issues (non-strict mode)${NC}"
        echo "=========================================="
        return 0
    fi
}

# Main function
main() {
    log_info "Starting migration validation..."
    log_info "Workspace: $WORKSPACE_DIR"
    log_info "Strict Mode: $STRICT_MODE"

    check_directory_structure
    check_essential_files
    check_claude_flow
    check_no_custom_features
    check_claude_md_content
    check_hooks
    check_skills
    check_git
    check_package_json
    calculate_stock_score

    generate_report
    print_summary
}

# Run main
main "$@"
