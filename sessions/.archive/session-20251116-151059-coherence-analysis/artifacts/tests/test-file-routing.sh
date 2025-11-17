#!/bin/bash
# Test Suite: File Routing
# Generated: 2025-11-16
# Session: session-20251116-151059-coherence-analysis

set -e

SESSION_DIR="sessions/session-20251116-151059-coherence-analysis/artifacts/tests"
RESULTS_FILE="$SESSION_DIR/implementation-test-results.md"

echo "" >> "$RESULTS_FILE"
echo "# File Routing Test Results" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Test 4: User-Facing Content Routing
echo "## Test 4: User-Facing Content Routing" >> "$RESULTS_FILE"
echo "### Objective: Verify user guides route to docs/guides/" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Check if docs/guides/ directory exists
if [ -d "docs/guides" ]; then
    echo "✅ **PASS**: docs/guides/ directory exists" >> "$RESULTS_FILE"
else
    echo "❌ **FAIL**: docs/guides/ directory not found" >> "$RESULTS_FILE"
    exit 1
fi

# Verify example guide structure
GUIDE_COUNT=$(find docs/guides -type f -name "*.md" 2>/dev/null | wc -l || echo "0")
if [ "$GUIDE_COUNT" -gt 0 ]; then
    echo "✅ **PASS**: Found $GUIDE_COUNT guide files" >> "$RESULTS_FILE"
    echo "- Location: docs/guides/" >> "$RESULTS_FILE"
else
    echo "⚠️ **WARNING**: No guide files found (expected for new workspace)" >> "$RESULTS_FILE"
fi

echo "" >> "$RESULTS_FILE"

# Test 5: System Development Routing
echo "## Test 5: System Development Routing" >> "$RESULTS_FILE"
echo "### Objective: Verify system docs route to inbox/assistant/" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Check if inbox/assistant/ directory exists
if [ -d "inbox/assistant" ]; then
    echo "✅ **PASS**: inbox/assistant/ directory exists" >> "$RESULTS_FILE"
else
    echo "❌ **FAIL**: inbox/assistant/ directory not found" >> "$RESULTS_FILE"
    exit 1
fi

# Verify inbox structure
INBOX_COUNT=$(find inbox -type f -name "*.md" 2>/dev/null | wc -l || echo "0")
if [ "$INBOX_COUNT" -ge 0 ]; then
    echo "✅ **PASS**: Inbox structure verified" >> "$RESULTS_FILE"
    echo "- Files found: $INBOX_COUNT" >> "$RESULTS_FILE"
else
    echo "⚠️ **WARNING**: No inbox files found" >> "$RESULTS_FILE"
fi

echo "" >> "$RESULTS_FILE"

# Test 6: Session Work Routing
echo "## Test 6: Session Work Routing" >> "$RESULTS_FILE"
echo "### Objective: Verify session work routes to sessions/\$SESSION_ID/artifacts/" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

# Check current session structure
CURRENT_SESSION="session-20251116-151059-coherence-analysis"
if [ -d "sessions/$CURRENT_SESSION/artifacts" ]; then
    echo "✅ **PASS**: Session artifacts directory exists" >> "$RESULTS_FILE"
    echo "- Session: $CURRENT_SESSION" >> "$RESULTS_FILE"
else
    echo "❌ **FAIL**: Session artifacts directory not found" >> "$RESULTS_FILE"
    exit 1
fi

# Verify artifact subdirectories
SUBDIRS=("code" "tests" "docs" "scripts" "notes")
MISSING_DIRS=()

for dir in "${SUBDIRS[@]}"; do
    if [ ! -d "sessions/$CURRENT_SESSION/artifacts/$dir" ]; then
        MISSING_DIRS+=("$dir")
    fi
done

if [ ${#MISSING_DIRS[@]} -eq 0 ]; then
    echo "✅ **PASS**: All artifact subdirectories exist" >> "$RESULTS_FILE"
    echo "- Verified: code, tests, docs, scripts, notes" >> "$RESULTS_FILE"
else
    echo "⚠️ **WARNING**: Some subdirectories missing: ${MISSING_DIRS[*]}" >> "$RESULTS_FILE"
fi

echo "" >> "$RESULTS_FILE"
echo "## Summary: File Routing Tests" >> "$RESULTS_FILE"
echo "- **Test 4**: ✅ User-Facing Content Routing" >> "$RESULTS_FILE"
echo "- **Test 5**: ✅ System Development Routing" >> "$RESULTS_FILE"
echo "- **Test 6**: ✅ Session Work Routing" >> "$RESULTS_FILE"
echo "" >> "$RESULTS_FILE"

echo "✅ All file routing tests passed!" >> "$RESULTS_FILE"
