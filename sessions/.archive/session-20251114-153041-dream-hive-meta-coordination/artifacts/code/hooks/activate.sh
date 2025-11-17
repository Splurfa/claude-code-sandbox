#!/bin/bash
# Hook Activation Script
# One-time setup to enable automatic hook firing

set -e

echo "🔗 Activating automatic hook system..."

# Ensure hooks directory exists
mkdir -p .claude/hooks

# Copy auto-hooks to .claude/hooks (deployment location)
cp "$(dirname "$0")/auto-hooks.js" .claude/hooks/auto-hooks.js
chmod +x .claude/hooks/auto-hooks.js

# Enable auto-hooks
node .claude/hooks/auto-hooks.js --enable

echo ""
echo "✅ Hook automation activated successfully"
echo ""
echo "📋 Hooks will auto-fire on:"
echo "   • pre-task   - Before agent work begins"
echo "   • post-task  - After agent work completes"
echo "   • post-edit  - After file writes (fs.writeFileSync)"
echo "   • session-end - On session closeout"
echo ""
echo "🔍 Verify activation:"
echo "   sqlite3 .swarm/memory.db 'SELECT COUNT(*) FROM memory_entries;'"
echo ""
echo "📚 All hooks use stock: npx claude-flow@alpha hooks"
