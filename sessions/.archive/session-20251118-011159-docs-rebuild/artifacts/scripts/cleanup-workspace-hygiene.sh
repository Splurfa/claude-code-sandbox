#!/bin/bash
# File: cleanup-workspace-hygiene.sh
# Purpose: Fix all protocol violations identified in hygiene analysis
# Session: session-20251118-011159-docs-rebuild
# Date: 2025-11-18

set -e  # Exit on error

echo "🧹 Starting workspace hygiene cleanup..."
echo ""

# ============================================================================
# PHASE 1: Fix Session Root Violations
# ============================================================================
echo "Phase 1: Moving files from session roots to artifacts/"
echo "--------------------------------------------------------"

# session-20251117-100232-docs-refactor-tutor
SESSION_1="sessions/session-20251117-100232-docs-refactor-tutor"
if [ -f "$SESSION_1/HANDOFF-TO-TERMINAL.md" ]; then
    mv "$SESSION_1/HANDOFF-TO-TERMINAL.md" "$SESSION_1/artifacts/docs/"
    echo "  ✅ Moved HANDOFF-TO-TERMINAL.md"
fi
if [ -f "$SESSION_1/TERMINAL-MISSION-BRIEF.md" ]; then
    mv "$SESSION_1/TERMINAL-MISSION-BRIEF.md" "$SESSION_1/artifacts/docs/"
    echo "  ✅ Moved TERMINAL-MISSION-BRIEF.md"
fi
if [ -f "$SESSION_1/WIZARD-PROMPT-FINAL.md" ]; then
    mv "$SESSION_1/WIZARD-PROMPT-FINAL.md" "$SESSION_1/artifacts/docs/"
    echo "  ✅ Moved WIZARD-PROMPT-FINAL.md"
fi
if [ -f "$SESSION_1/WIZARD-PROMPT-VERIFICATION.md" ]; then
    mv "$SESSION_1/WIZARD-PROMPT-VERIFICATION.md" "$SESSION_1/artifacts/docs/"
    echo "  ✅ Moved WIZARD-PROMPT-VERIFICATION.md"
fi
if [ -f "$SESSION_1/WIZARD-PROMPT.md" ]; then
    mv "$SESSION_1/WIZARD-PROMPT.md" "$SESSION_1/artifacts/docs/"
    echo "  ✅ Moved WIZARD-PROMPT.md"
fi
if [ -f "$SESSION_1/phase-timing.log" ]; then
    mv "$SESSION_1/phase-timing.log" "$SESSION_1/artifacts/notes/"
    echo "  ✅ Moved phase-timing.log"
fi
echo "  ✅ Fixed session-20251117-100232-docs-refactor-tutor"
echo ""

# session-20251117-225020-hive-docs-tutor
SESSION_2="sessions/session-20251117-225020-hive-docs-tutor"
if [ -f "$SESSION_2/COORDINATION-LEDGER.md" ]; then
    mv "$SESSION_2/COORDINATION-LEDGER.md" "$SESSION_2/artifacts/docs/"
    echo "  ✅ Moved COORDINATION-LEDGER.md"
fi
if [ -f "$SESSION_2/EVIDENCE-PACKAGE.md" ]; then
    mv "$SESSION_2/EVIDENCE-PACKAGE.md" "$SESSION_2/artifacts/docs/"
    echo "  ✅ Moved EVIDENCE-PACKAGE.md"
fi
echo "  ✅ Fixed session-20251117-225020-hive-docs-tutor"
echo ""

# session-20251117-233300-workspace-docs-optimization
SESSION_3="sessions/session-20251117-233300-workspace-docs-optimization"
if [ -f "$SESSION_3/COORDINATION-LEDGER.md" ]; then
    mv "$SESSION_3/COORDINATION-LEDGER.md" "$SESSION_3/artifacts/docs/"
    echo "  ✅ Moved COORDINATION-LEDGER.md"
fi
if [ -f "$SESSION_3/SYNTHESIS-RECOMMENDATION.md" ]; then
    mv "$SESSION_3/SYNTHESIS-RECOMMENDATION.md" "$SESSION_3/artifacts/docs/"
    echo "  ✅ Moved SYNTHESIS-RECOMMENDATION.md"
fi
if [ -f "$SESSION_3/WORKSPACE-OPTIMIZATION-SYNTHESIS.md" ]; then
    mv "$SESSION_3/WORKSPACE-OPTIMIZATION-SYNTHESIS.md" "$SESSION_3/artifacts/docs/"
    echo "  ✅ Moved WORKSPACE-OPTIMIZATION-SYNTHESIS.md"
fi
echo "  ✅ Fixed session-20251117-233300-workspace-docs-optimization"
echo ""

# session-20251118-011159-docs-rebuild (CURRENT SESSION)
SESSION_4="sessions/session-20251118-011159-docs-rebuild"
if [ -f "$SESSION_4/PHASE-2-SUMMARY.md" ]; then
    mv "$SESSION_4/PHASE-2-SUMMARY.md" "$SESSION_4/artifacts/docs/"
    echo "  ✅ Moved PHASE-2-SUMMARY.md"
    echo "  ✅ Fixed session-20251118-011159-docs-rebuild"
    echo ""
fi

echo "📊 Phase 1 Complete: All files moved to artifacts/"
echo ""

# ============================================================================
# PHASE 2: Clean Empty Docs Directories
# ============================================================================
echo "Phase 2: Removing empty docs directories"
echo "----------------------------------------"

REMOVED_COUNT=0

if [ -d "docs/advanced" ] && [ ! "$(ls -A docs/advanced)" ]; then
    rm -rf docs/advanced
    echo "  ✅ Removed docs/advanced/"
    REMOVED_COUNT=$((REMOVED_COUNT + 1))
fi

if [ -d "docs/essentials" ] && [ ! "$(ls -A docs/essentials)" ]; then
    rm -rf docs/essentials
    echo "  ✅ Removed docs/essentials/"
    REMOVED_COUNT=$((REMOVED_COUNT + 1))
fi

if [ -d "docs/reality" ] && [ ! "$(ls -A docs/reality)" ]; then
    rm -rf docs/reality
    echo "  ✅ Removed docs/reality/"
    REMOVED_COUNT=$((REMOVED_COUNT + 1))
fi

if [ $REMOVED_COUNT -eq 0 ]; then
    echo "  ℹ️  No empty directories found"
else
    echo "  📊 Cleaned $REMOVED_COUNT empty directories"
fi
echo ""

# ============================================================================
# PHASE 3: Archive Empty Sessions
# ============================================================================
echo "Phase 3: Archiving empty sessions"
echo "---------------------------------"

ARCHIVED_COUNT=0

if [ -d "sessions/session-20251118-004942-hive-mind-analysis" ]; then
    # Check if directory is empty or only has metadata
    FILE_COUNT=$(find sessions/session-20251118-004942-hive-mind-analysis -type f | wc -l)
    if [ "$FILE_COUNT" -eq 0 ] || [ "$FILE_COUNT" -eq 1 ]; then
        mv sessions/session-20251118-004942-hive-mind-analysis sessions/.archive/
        echo "  ✅ Archived session-20251118-004942-hive-mind-analysis"
        ARCHIVED_COUNT=$((ARCHIVED_COUNT + 1))
    fi
fi

if [ $ARCHIVED_COUNT -eq 0 ]; then
    echo "  ℹ️  No empty sessions found"
else
    echo "  📊 Archived $ARCHIVED_COUNT empty sessions"
fi
echo ""

# ============================================================================
# PHASE 4: Verification
# ============================================================================
echo "Phase 4: Verification"
echo "--------------------"

# Count remaining violations (exclude allowed files)
VIOLATIONS=$(find sessions/ -maxdepth 2 -type f \
    -not -path "*/artifacts/*" \
    -not -path "*/.archive/*" \
    -not -path "*/.hive-mind/*" \
    -not -name "metadata.json" \
    -not -name "session-summary.md" \
    -not -name "README.md" | wc -l | tr -d ' ')

echo "  📊 Remaining violations: $VIOLATIONS"
echo ""

if [ "$VIOLATIONS" -eq 0 ]; then
    echo "✅ WORKSPACE HYGIENE CLEANUP COMPLETE"
    echo "======================================"
    echo ""
    echo "   ✅ All files moved to proper locations"
    echo "   ✅ Empty directories removed"
    echo "   ✅ Empty sessions archived"
    echo "   ✅ 100% protocol compliant"
    echo ""
    echo "🎉 Workspace is now ready for documentation rebuild!"
    exit 0
else
    echo "⚠️  Warning: $VIOLATIONS files still in session roots"
    echo ""
    echo "To investigate, run:"
    echo "  find sessions/ -maxdepth 2 -type f -not -path '*/artifacts/*' \\"
    echo "    -not -path '*/.archive/*' -not -path '*/.hive-mind/*' \\"
    echo "    -not -name 'metadata.json' -not -name 'session-summary.md' \\"
    echo "    -not -name 'README.md'"
    echo ""
    exit 1
fi
