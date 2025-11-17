#!/bin/bash
# Start Datasette with Auto-Insight Dashboard
# For Derek's Database Visualization

echo "🚀 Starting Datasette with your AI memory insights..."
echo ""
echo "📊 Loading databases:"
echo "   - .swarm/memory.db (45,563+ entries)"
echo "   - .agentdb/reasoningbank.db (learning data)"
echo "   - .hive-mind/hive.db (coordination)"
echo ""

# Navigate to workspace root
cd /Users/splurfa/common-thread-sandbox

# Start Datasette with metadata config
datasette \
  .swarm/memory.db \
  .agentdb/reasoningbank.db \
  .hive-mind/hive.db \
  --metadata sessions/session-20251116-195139-db-visualization-tools/artifacts/code/metadata.yml \
  --port 8001 \
  --open \
  --reload

# Notes:
# --open: Opens browser automatically
# --reload: Auto-reload on config changes
# --port 8001: Use port 8001
