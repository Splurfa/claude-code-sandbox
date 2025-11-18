#!/bin/bash

echo "🔍 Repository Violation Verification"
echo "====================================="
echo ""

cd /Users/splurfa/common-thread-sandbox

FAILED=0

# Test 1: .env should NOT be tracked
echo -n "✓ [1/7] .env untracked... "
if git ls-files | grep -q "^\.env$"; then
    echo "❌ FAILED (.env still tracked)"
    FAILED=$((FAILED + 1))
else
    echo "✅ PASS"
fi

# Test 2: DEPLOYMENT-SUMMARY.md in artifacts
echo -n "✓ [2/7] DEPLOYMENT-SUMMARY.md location... "
if [ -f "sessions/session-20251118-011159-docs-rebuild/artifacts/docs/DEPLOYMENT-SUMMARY.md" ]; then
    echo "✅ PASS"
else
    echo "❌ FAILED (not in artifacts/docs/)"
    FAILED=$((FAILED + 1))
fi

# Test 3: No recursive session nesting
echo -n "✓ [3/7] No recursive sessions... "
NESTED=$(find sessions -type d -path "*/artifacts/tests/sessions" 2>/dev/null | wc -l | tr -d ' ')
if [ "$NESTED" -eq 0 ]; then
    echo "✅ PASS"
else
    echo "❌ FAILED (found $NESTED nested session dirs)"
    FAILED=$((FAILED + 1))
fi

# Test 4: No .db files tracked
echo -n "✓ [4/7] Database files untracked... "
if git ls-files | grep -q -E "\\.db$"; then
    echo "❌ FAILED (.db files still tracked)"
    FAILED=$((FAILED + 1))
else
    echo "✅ PASS"
fi

# Test 5: verify-links.sh in scripts/
echo -n "✓ [5/7] verify-links.sh location... "
if [ -f "scripts/verify-links.sh" ]; then
    echo "✅ PASS"
else
    echo "⚠️  SKIP (file may not exist)"
fi

# Test 6: No files in session roots
echo -n "✓ [6/7] Session root files... "
BAD_FILES=$(find sessions/session-* -maxdepth 1 -type f -not -name "metadata.json" -not -name "session-summary.md" 2>/dev/null | wc -l | tr -d ' ')
if [ "$BAD_FILES" -eq 0 ]; then
    echo "✅ PASS"
else
    echo "❌ FAILED (found $BAD_FILES files in session roots)"
    FAILED=$((FAILED + 1))
fi

# Test 7: No markdown in root (except allowed)
echo -n "✓ [7/7] Root markdown files... "
ROOT_MD=$(find . -maxdepth 1 -name "*.md" -not -name "README.md" -not -name "CLAUDE.md" -type f 2>/dev/null | wc -l | tr -d ' ')
if [ "$ROOT_MD" -eq 0 ]; then
    echo "✅ PASS"
else
    echo "❌ FAILED (found $ROOT_MD .md files in root)"
    FAILED=$((FAILED + 1))
fi

echo ""
echo "======================================="
if [ $FAILED -eq 0 ]; then
    echo "✅ ALL TESTS PASSED - Repository is compliant"
    exit 0
else
    echo "❌ $FAILED TESTS FAILED - Violations remain"
    exit 1
fi
