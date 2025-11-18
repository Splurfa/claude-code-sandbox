#!/bin/bash
set -e

echo "🔧 Repository Violation Cleanup Script"
echo "========================================"
echo ""

# Change to repo root
cd /Users/splurfa/common-thread-sandbox

# 1. CRITICAL: Remove .env from git tracking
echo "🔴 [1/7] Removing .env from version control..."
if git ls-files | grep -q "^\.env$"; then
    git rm --cached .env
    echo "✅ .env removed from tracking (local file preserved)"
else
    echo "✅ .env already untracked"
fi

# 2. CRITICAL: Move DEPLOYMENT-SUMMARY.md to artifacts
echo "🔴 [2/7] Moving DEPLOYMENT-SUMMARY.md to artifacts..."
if [ -f "sessions/session-20251118-011159-docs-rebuild/DEPLOYMENT-SUMMARY.md" ]; then
    mv sessions/session-20251118-011159-docs-rebuild/DEPLOYMENT-SUMMARY.md \
       sessions/session-20251118-011159-docs-rebuild/artifacts/docs/DEPLOYMENT-SUMMARY.md
    echo "✅ DEPLOYMENT-SUMMARY.md moved to correct location"
else
    echo "✅ DEPLOYMENT-SUMMARY.md already in correct location"
fi

# 3. CRITICAL: Remove recursive session nesting
echo "🔴 [3/7] Removing infinite session recursion..."
if [ -d "sessions/session-20251117-002737-hive-mind-100-integration/artifacts/tests/sessions" ]; then
    rm -rf sessions/session-20251117-002737-hive-mind-100-integration/artifacts/tests/sessions/
    echo "✅ Recursive session directories removed"
else
    echo "✅ No recursive session nesting detected"
fi

# 4. HIGH: Verify no .db files tracked
echo "🟠 [4/7] Verifying database files are untracked..."
DB_FILES=$(git ls-files | grep -E "\\.db$" || true)
if [ -n "$DB_FILES" ]; then
    echo "⚠️ Found tracked .db files:"
    echo "$DB_FILES"
    git rm --cached **/*.db
    echo "✅ Database files removed from tracking"
else
    echo "✅ No database files tracked"
fi

# 5. HIGH: Move verify-links.sh to scripts/
echo "🟠 [5/7] Moving verify-links.sh to scripts/..."
if [ -f "docs/verify-links.sh" ]; then
    mkdir -p scripts
    git mv docs/verify-links.sh scripts/verify-links.sh 2>/dev/null || \
        mv docs/verify-links.sh scripts/verify-links.sh
    echo "✅ verify-links.sh moved to scripts/"
else
    echo "✅ verify-links.sh already in correct location"
fi

# 6. HIGH: Inbox triage reminder
echo "🟠 [6/7] Inbox triage status..."
INBOX_COUNT=$(find inbox -type f \( -name "*.md" -o -name "*.txt" \) 2>/dev/null | wc -l | tr -d ' ')
echo "📥 Inbox contains $INBOX_COUNT files pending triage"
echo "ℹ️  Schedule dedicated inbox cleanup session"

# 7. MEDIUM: Track new project files
echo "🟡 [7/7] Adding new project structure..."
if [ -f "package.json" ] && ! git ls-files | grep -q "^package\.json$"; then
    git add package.json package-lock.json
    echo "✅ Added package.json and package-lock.json"
fi

if [ -d "scripts" ] && ! git ls-files | grep -q "^scripts/"; then
    git add scripts/
    echo "✅ Added scripts/ directory"
fi

echo ""
echo "✅ CLEANUP COMPLETE"
echo ""
echo "Next steps:"
echo "  1. Review changes: git status"
echo "  2. Commit fixes: git commit -m 'Fix repository violations per audit'"
echo "  3. Verify: bash sessions/session-20251118-011159-docs-rebuild/artifacts/scripts/verify-fixes.sh"
