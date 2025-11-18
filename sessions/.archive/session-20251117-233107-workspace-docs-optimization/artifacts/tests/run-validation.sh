#!/bin/bash
# Validation Test Runner
# Session: session-20251117-233107-workspace-docs-optimization
# Purpose: Run documentation structure validation and report results

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
SESSION_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
ARTIFACTS_DIR="$SESSION_DIR/artifacts"
DOCS_DIR="$ARTIFACTS_DIR/docs"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🧪 Workspace Documentation Validation"
echo "======================================"
echo ""
echo "📂 Project Root: $PROJECT_ROOT"
echo "📁 Session: $(basename "$SESSION_DIR")"
echo "📋 Test: structure-validation.test.js"
echo ""

# Create docs directory if needed
mkdir -p "$DOCS_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
REPORT_FILE="$DOCS_DIR/VALIDATION-REPORT-${TIMESTAMP}.md"
JSON_REPORT="$DOCS_DIR/validation-results-${TIMESTAMP}.json"

# Function to run tests and capture output
run_tests() {
    local stage="$1"
    local output_file="$2"

    echo -e "${BLUE}Running ${stage} validation tests...${NC}"

    cd "$PROJECT_ROOT"

    # Run node test and capture output
    if node --test "$SCRIPT_DIR/structure-validation.test.js" > "$output_file" 2>&1; then
        echo -e "${GREEN}✅ Tests passed!${NC}"
        return 0
    else
        echo -e "${RED}❌ Tests failed!${NC}"
        return 1
    fi
}

# Run baseline (current state)
echo -e "${YELLOW}📊 Running baseline validation...${NC}"
BASELINE_OUTPUT="/tmp/validation-baseline-${TIMESTAMP}.txt"

if run_tests "BASELINE" "$BASELINE_OUTPUT"; then
    BASELINE_STATUS="✅ PASSED"
    BASELINE_EXIT=0
else
    BASELINE_STATUS="❌ FAILED"
    BASELINE_EXIT=1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Count test results
TOTAL_TESTS=$(grep -c "^# " "$BASELINE_OUTPUT" || echo "0")
PASSED_TESTS=$(grep -c "^ok " "$BASELINE_OUTPUT" || echo "0")
FAILED_TESTS=$(grep -c "^not ok " "$BASELINE_OUTPUT" || echo "0")

# Display summary
echo -e "${BLUE}📈 Test Results Summary${NC}"
echo "─────────────────────────"
echo "Total Tests:  $TOTAL_TESTS"
echo "Passed:       $PASSED_TESTS"
echo "Failed:       $FAILED_TESTS"
echo "Status:       $BASELINE_STATUS"
echo ""

# Generate detailed report
echo "📝 Generating validation report..."

cat > "$REPORT_FILE" << EOF
# Workspace Documentation Validation Report

**Session**: \`$(basename "$SESSION_DIR")\`
**Date**: $(date +"%Y-%m-%d %H:%M:%S")
**Test Suite**: structure-validation.test.js

## Executive Summary

**Overall Status**: $BASELINE_STATUS

| Metric | Value |
|--------|-------|
| Total Tests | $TOTAL_TESTS |
| Passed | $PASSED_TESTS |
| Failed | $FAILED_TESTS |
| Pass Rate | $(awk "BEGIN {printf \"%.1f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}")% |

## Test Categories

### 1. Structure Validation
Tests for Diátaxis framework compliance, directory organization, and README placement.

### 2. Content Validation
Tests for documentation coverage, link validity, and content quality.

### 3. Learning Path Validation
Tests for tutorial progression, cross-references, and new user experience.

### 4. Integration Validation
Tests for system integration, tool functionality, and coordination.

## Detailed Results

\`\`\`
EOF

# Append test output
cat "$BASELINE_OUTPUT" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF
\`\`\`

## Analysis

### Passing Tests
EOF

# Extract passing test names
grep "^ok " "$BASELINE_OUTPUT" | sed 's/^ok [0-9]* - /- ✅ /' >> "$REPORT_FILE" || echo "- No passing tests" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF

### Failing Tests
EOF

# Extract failing test names
grep "^not ok " "$BASELINE_OUTPUT" | sed 's/^not ok [0-9]* - /- ❌ /' >> "$REPORT_FILE" || echo "- No failing tests" >> "$REPORT_FILE"

cat >> "$REPORT_FILE" << EOF

## Recommendations

EOF

if [ $BASELINE_EXIT -eq 0 ]; then
    cat >> "$REPORT_FILE" << EOF
✅ **All tests passed!** The documentation structure meets all validation criteria.

### Maintenance Recommendations:
1. Continue following Diátaxis framework principles
2. Keep internal links updated as content evolves
3. Review tutorial progression quarterly
4. Update integration tests when features change
EOF
else
    cat >> "$REPORT_FILE" << EOF
❌ **Action required:** Review failing tests and address issues before migration.

### Immediate Actions:
1. Review failing tests in detail
2. Fix structural issues (missing files, broken links)
3. Complete required documentation
4. Re-run validation until all tests pass

### Before Migration Checklist:
- [ ] All structure validation tests pass
- [ ] No broken internal links
- [ ] All critical files present
- [ ] Tutorial progression is clear
- [ ] Integration points validated
EOF
fi

cat >> "$REPORT_FILE" << EOF

## Next Steps

### If Tests Pass:
1. Proceed with content migration
2. Run post-migration validation
3. Compare baseline vs. post-migration metrics
4. Document any improvements

### If Tests Fail:
1. Address failures systematically
2. Run validation again
3. Do not proceed until all tests pass
4. Document root causes of failures

## Artifacts

- **Test Suite**: \`$(basename "$SCRIPT_DIR")/structure-validation.test.js\`
- **Baseline Output**: \`$BASELINE_OUTPUT\`
- **This Report**: \`$(basename "$REPORT_FILE")\`
- **Timestamp**: $TIMESTAMP

---

**Generated by**: Workspace Documentation Validation System
**Namespace**: workspace-optimization-20251117
EOF

echo -e "${GREEN}✅ Report generated: $(basename "$REPORT_FILE")${NC}"

# Generate JSON report for programmatic access
cat > "$JSON_REPORT" << EOF
{
  "session": "$(basename "$SESSION_DIR")",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "testSuite": "structure-validation.test.js",
  "summary": {
    "totalTests": $TOTAL_TESTS,
    "passed": $PASSED_TESTS,
    "failed": $FAILED_TESTS,
    "passRate": $(awk "BEGIN {printf \"%.2f\", ($PASSED_TESTS/$TOTAL_TESTS)*100}"),
    "status": "$BASELINE_STATUS"
  },
  "exitCode": $BASELINE_EXIT,
  "reportFile": "$(basename "$REPORT_FILE")",
  "baselineOutput": "$BASELINE_OUTPUT"
}
EOF

echo -e "${GREEN}✅ JSON report: $(basename "$JSON_REPORT")${NC}"

# Display report location
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📄 Reports Generated:${NC}"
echo "  • Markdown: $DOCS_DIR/$(basename "$REPORT_FILE")"
echo "  • JSON:     $DOCS_DIR/$(basename "$JSON_REPORT")"
echo ""

# Store results in memory
if command -v npx &> /dev/null; then
    echo "💾 Storing results in memory..."

    # Create memory entry
    MEMORY_VALUE=$(cat "$JSON_REPORT")

    npx claude-flow@alpha hooks notify --message "Validation complete: $BASELINE_STATUS ($PASSED_TESTS/$TOTAL_TESTS passed)" 2>&1 | grep -v "INFO" || true

    echo -e "${GREEN}✅ Results stored in coordination memory${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Exit with test result code
if [ $BASELINE_EXIT -eq 0 ]; then
    echo -e "${GREEN}🎉 Validation successful! Ready to proceed.${NC}"
else
    echo -e "${RED}⚠️  Validation failed. Review report and fix issues.${NC}"
fi

echo ""
exit $BASELINE_EXIT
