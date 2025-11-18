#!/bin/bash
# Link Verification Script
# Tests all internal markdown links in the documentation

set -e

DOCS_DIR="sessions/session-20251118-011159-docs-rebuild/artifacts/docs"
BROKEN_LINKS=0
TOTAL_LINKS=0

echo "🔍 Verifying all internal documentation links..."
echo ""

# Function to check if a file exists
check_link() {
  local source_file="$1"
  local link_path="$2"
  local source_dir=$(dirname "$source_file")

  # Resolve relative path
  local target_file="$source_dir/$link_path"

  # Normalize path (remove ../ and ./)
  target_file=$(cd "$(dirname "$target_file")" 2>/dev/null && echo "$PWD/$(basename "$target_file")")

  if [ -f "$target_file" ]; then
    echo "  ✅ $link_path"
    return 0
  else
    echo "  ❌ $link_path → $target_file (NOT FOUND)"
    return 1
  fi
}

# Check swarm-coordination.md links
echo "📄 advanced/swarm-coordination.md"
SOURCE="$DOCS_DIR/advanced/swarm-coordination.md"
LINKS=(
  "../essentials/quick-start.md"
  "../essentials/agent-spawning.md"
  "performance-tuning.md"
  "extending-system.md"
  "../reality/architecture.md"
  "../essentials/memory-coordination.md"
  "custom-agents.md"
  "../reality/what-actually-works.md"
  "../essentials/troubleshooting.md"
)

for link in "${LINKS[@]}"; do
  TOTAL_LINKS=$((TOTAL_LINKS + 1))
  if ! check_link "$SOURCE" "$link"; then
    BROKEN_LINKS=$((BROKEN_LINKS + 1))
  fi
done

echo ""

# Check performance-tuning.md links
echo "📄 advanced/performance-tuning.md"
SOURCE="$DOCS_DIR/advanced/performance-tuning.md"
LINKS=(
  "../essentials/session-management.md"
  "../reality/architecture.md"
)

for link in "${LINKS[@]}"; do
  TOTAL_LINKS=$((TOTAL_LINKS + 1))
  if ! check_link "$SOURCE" "$link"; then
    BROKEN_LINKS=$((BROKEN_LINKS + 1))
  fi
done

echo ""

# Check extending-system.md links
echo "📄 advanced/extending-system.md"
SOURCE="$DOCS_DIR/advanced/extending-system.md"
LINKS=(
  "performance-tuning.md"
  "../reality/architecture.md"
)

for link in "${LINKS[@]}"; do
  TOTAL_LINKS=$((TOTAL_LINKS + 1))
  if ! check_link "$SOURCE" "$link"; then
    BROKEN_LINKS=$((BROKEN_LINKS + 1))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 VERIFICATION RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total Links Tested: $TOTAL_LINKS"
echo "Broken Links: $BROKEN_LINKS"
echo "Working Links: $((TOTAL_LINKS - BROKEN_LINKS))"
echo ""

if [ $BROKEN_LINKS -eq 0 ]; then
  echo "✅ SUCCESS: All links are working!"
  echo "Link Accuracy: 100%"
  exit 0
else
  echo "❌ FAILURE: $BROKEN_LINKS broken links found"
  echo "Link Accuracy: $(echo "scale=2; ($TOTAL_LINKS - $BROKEN_LINKS) / $TOTAL_LINKS * 100" | bc)%"
  exit 1
fi
