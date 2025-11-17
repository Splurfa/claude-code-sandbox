#!/bin/bash
# Setup Visual Database Viewer (Datasette)
# Creates a user-friendly web interface for exploring agentDB and ReasoningBank

set -e

echo "🎨 Setting up Visual Database Viewer..."
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "   Install Python 3 first: https://www.python.org/downloads/"
    exit 1
fi

# Check if pip is available
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    echo "   Install pip: python3 -m ensurepip --upgrade"
    exit 1
fi

echo "📦 Installing Datasette and visualization plugins..."
pip3 install --user datasette datasette-vega datasette-plot datasette-cluster-map

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 Starting visual database viewer..."
echo ""
echo "   Your databases will open in your browser automatically."
echo "   If not, visit: http://127.0.0.1:8001"
echo ""
echo "   Press Ctrl+C to stop the server."
echo ""

# Get workspace root (assuming script is in sessions/.../scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"

# Start Datasette with your databases
datasette \
    "$WORKSPACE_ROOT/.swarm/memory.db" \
    "$WORKSPACE_ROOT/.agentdb/reasoningbank.db" \
    "$WORKSPACE_ROOT/.hive-mind/hive.db" \
    "$WORKSPACE_ROOT/.hive-mind/memory.db" \
    --open \
    --port 8001 \
    --host 127.0.0.1 \
    --metadata '{
        "title": "AgentDB & ReasoningBank Memory Explorer",
        "description": "Visual exploration of AI agent memory and learning data",
        "databases": {
            ".swarm/memory.db": {
                "title": "Swarm Memory (Main)",
                "description": "Main memory storage with patterns, trajectories, and entries"
            },
            ".agentdb/reasoningbank.db": {
                "title": "ReasoningBank",
                "description": "Learning episodes, skills, and causal chains"
            },
            ".hive-mind/hive.db": {
                "title": "Hive Coordination",
                "description": "Multi-agent swarm coordination state"
            },
            ".hive-mind/memory.db": {
                "title": "Hive Memory",
                "description": "Hive-specific memory storage"
            }
        }
    }'

