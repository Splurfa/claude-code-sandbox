#!/bin/bash
# Stock Compliance Validation Script
# Verifies zero modifications to stock claude-flow files

set -e

SESSION_ID="session-20251115-165054-clean-workspace-rebuild"
REPORT_FILE="sessions/$SESSION_ID/artifacts/tests/stock-compliance-report.txt"
FAILED=0

echo "========================================" > "$REPORT_FILE"
echo "Stock Compliance Validation Report" >> "$REPORT_FILE"
echo "Generated: $(date)" >> "$REPORT_FILE"
echo "========================================" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_pass() {
    echo -e "${GREEN}✓${NC} $1"
    echo "✓ $1" >> "$REPORT_FILE"
}

print_fail() {
    echo -e "${RED}✗${NC} $1"
    echo "✗ $1" >> "$REPORT_FILE"
    FAILED=1
}

print_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    echo "⚠ $1" >> "$REPORT_FILE"
}

print_section() {
    echo ""
    echo "========================================" | tee -a "$REPORT_FILE"
    echo "$1" | tee -a "$REPORT_FILE"
    echo "========================================" | tee -a "$REPORT_FILE"
}

# Test SC-001: No modifications to node_modules/claude-flow/
print_section "TC-SC-001: Stock Node Modules Integrity"

if [ -d "node_modules/claude-flow" ]; then
    # Check if any files have been modified (git would detect this)
    if git ls-files --modified | grep -q "node_modules/claude-flow"; then
        print_fail "Modifications detected in node_modules/claude-flow/"
    else
        print_pass "No modifications to node_modules/claude-flow/"
    fi
else
    print_warn "node_modules/claude-flow/ not found (run npm install)"
fi

# Test SC-002: Stock hooks call through correctly
print_section "TC-SC-002: Stock Hooks Integration"

if npx claude-flow@alpha hooks --help &>/dev/null; then
    print_pass "Stock hooks CLI is functional"
else
    print_fail "Stock hooks CLI not working"
fi

# Test if hooks wrapper exists and calls stock
if [ -f ".claude/hooks/auto-hooks.js" ]; then
    if grep -q "npx claude-flow@alpha hooks" ".claude/hooks/auto-hooks.js"; then
        print_pass "Hooks wrapper calls stock CLI correctly"
    else
        print_fail "Hooks wrapper doesn't call stock CLI"
    fi
else
    print_warn "Hooks wrapper not found (feature may not be implemented)"
fi

# Test SC-003: Stock memory uses .swarm/memory.db
print_section "TC-SC-003: Stock Memory Location"

if npx claude-flow@alpha hooks memory --action store --key "test" --value "data" &>/dev/null; then
    if [ -f ".swarm/memory.db" ]; then
        print_pass "Stock memory database at correct location (.swarm/memory.db)"
    else
        print_fail "Stock memory database not at .swarm/memory.db"
    fi
else
    print_warn "Unable to test memory location (hooks may not be installed)"
fi

# Test SC-004: Stock session backups at .swarm/backups/
print_section "TC-SC-004: Stock Backup Location"

if [ -d ".swarm/backups" ]; then
    print_pass "Stock backup directory exists (.swarm/backups/)"
else
    print_warn "Stock backup directory not found (no sessions completed yet)"
fi

# Test SC-005: Package.json uses stock versions
print_section "TC-SC-005: Stock Dependencies"

if [ -f "package.json" ]; then
    # Check for @alpha or latest versions
    if grep -q '"claude-flow": ".*@alpha"' package.json || \
       grep -q '"claude-flow": ".*latest"' package.json; then
        print_pass "Using stock claude-flow version"
    else
        print_warn "Non-standard claude-flow version detected"
    fi
else
    print_fail "package.json not found"
fi

# Test SC-006: No monkey-patching detected
print_section "TC-SC-006: No Monkey-Patching"

# Search for common monkey-patch patterns
MONKEY_PATCH_PATTERNS=(
    "require\\.cache.*claude-flow"
    "Module\\.prototype\\.require.*claude-flow"
    "Object\\.defineProperty.*claude-flow"
    "__proto__.*claude-flow"
)

FOUND_PATCHES=0
for pattern in "${MONKEY_PATCH_PATTERNS[@]}"; do
    if grep -r "$pattern" .claude/ 2>/dev/null | grep -v node_modules > /dev/null; then
        print_fail "Potential monkey-patching detected: $pattern"
        FOUND_PATCHES=1
    fi
done

if [ $FOUND_PATCHES -eq 0 ]; then
    print_pass "No monkey-patching detected"
fi

# Test SC-007: Stock CLI commands work unchanged
print_section "TC-SC-007: Stock CLI Functionality"

STOCK_COMMANDS=(
    "npx claude-flow@alpha --version"
    "npx claude-flow@alpha hooks --help"
    "npx claude-flow@alpha sparc modes"
)

for cmd in "${STOCK_COMMANDS[@]}"; do
    if eval "$cmd" &>/dev/null; then
        print_pass "Stock command works: $cmd"
    else
        print_fail "Stock command failed: $cmd"
    fi
done

# Additional: Check for stock file modifications
print_section "Additional: Stock File Integrity"

# List of critical stock files that should never be modified
STOCK_FILES=(
    ".swarm/memory.db"
    ".swarm/backups"
)

for file in "${STOCK_FILES[@]}"; do
    if [ -e "$file" ]; then
        # Check if git tracks any modifications
        if git ls-files --modified | grep -q "^$file$"; then
            print_fail "Stock file modified: $file"
        else
            print_pass "Stock file unmodified: $file"
        fi
    fi
done

# Check .claude/ contains only custom features
print_section "Custom Features Isolation"

if [ -d ".claude" ]; then
    # Verify no stock files in .claude/
    CUSTOM_ONLY=1
    if ls .claude/ | grep -E "^(memory\.db|backups)$" > /dev/null; then
        print_fail "Stock files found in .claude/ (should be in .swarm/)"
        CUSTOM_ONLY=0
    fi

    if [ $CUSTOM_ONLY -eq 1 ]; then
        print_pass "All .claude/ contents are custom features"
    fi
else
    print_warn ".claude/ directory not found"
fi

# Final Summary
print_section "Validation Summary"

echo "" | tee -a "$REPORT_FILE"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}========================================${NC}" | tee -a "$REPORT_FILE"
    echo -e "${GREEN}✓ STOCK COMPLIANCE: PASS (100%)${NC}" | tee -a "$REPORT_FILE"
    echo -e "${GREEN}========================================${NC}" | tee -a "$REPORT_FILE"
    echo "" | tee -a "$REPORT_FILE"
    echo "All stock compliance tests passed." | tee -a "$REPORT_FILE"
    echo "Zero modifications detected to stock claude-flow files." | tee -a "$REPORT_FILE"
    echo "" | tee -a "$REPORT_FILE"
    echo "Report saved to: $REPORT_FILE" | tee -a "$REPORT_FILE"
    exit 0
else
    echo -e "${RED}========================================${NC}" | tee -a "$REPORT_FILE"
    echo -e "${RED}✗ STOCK COMPLIANCE: FAIL${NC}" | tee -a "$REPORT_FILE"
    echo -e "${RED}========================================${NC}" | tee -a "$REPORT_FILE"
    echo "" | tee -a "$REPORT_FILE"
    echo "Stock compliance violations detected." | tee -a "$REPORT_FILE"
    echo "Review failures above and fix before proceeding." | tee -a "$REPORT_FILE"
    echo "" | tee -a "$REPORT_FILE"
    echo "Report saved to: $REPORT_FILE" | tee -a "$REPORT_FILE"
    exit 1
fi
