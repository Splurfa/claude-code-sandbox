#!/bin/bash
# ReasoningBank Learning Loop
#
# Stock-first automation: Uses existing hooks + minimal custom scripts
# to run the complete learning pipeline: collect → judge → distill
#
# Usage: bash learning-loop.sh [--confidence-threshold 0.8]

set -e  # Exit on error

CONFIDENCE_THRESHOLD=${1:-0.8}
SESSION_DIR="$(dirname "$0")"
SCRIPTS_DIR="$SESSION_DIR"

echo "🧠 ReasoningBank Learning Loop Starting..."
echo "   Confidence threshold: $CONFIDENCE_THRESHOLD"
echo ""

# Step 1: Collect trajectories from recent agent work
echo "📊 Step 1: Collecting trajectories from memory..."
node "$SCRIPTS_DIR/trajectory-collector.js" --namespace swarm
echo ""

# Step 2: Judge trajectories using heuristics
echo "⚖️  Step 2: Judging trajectories..."
node "$SCRIPTS_DIR/verdict-judge.js" --confidence-threshold "$CONFIDENCE_THRESHOLD"
echo ""

# Step 3: Distill learnings from successful trajectories
echo "🔬 Step 3: Distilling patterns from successes..."
node "$SCRIPTS_DIR/memory-distiller.js" --min-confidence "$CONFIDENCE_THRESHOLD"
echo ""

# Step 4: Report summary statistics
echo "📈 Step 4: Summary Statistics"
echo "─────────────────────────────"

echo ""
echo "Trajectory Judgments:"
sqlite3 .swarm/memory.db "
  SELECT
    COALESCE(judge_label, 'unjudged') as label,
    COUNT(*) as count,
    ROUND(AVG(judge_conf), 2) as avg_conf
  FROM task_trajectories
  GROUP BY judge_label
  ORDER BY count DESC;
" | column -t -s '|'

echo ""
echo "Top Learned Patterns:"
sqlite3 .swarm/memory.db "
  SELECT
    substr(id, 1, 8) as pattern_id,
    ROUND(confidence, 2) as conf,
    usage_count as uses,
    datetime(created_at) as created
  FROM patterns
  WHERE type = 'reasoning_memory'
  ORDER BY confidence DESC, usage_count DESC
  LIMIT 10;
" | column -t -s '|'

echo ""
echo "Overall Pattern Stats:"
sqlite3 .swarm/memory.db "
  SELECT
    COUNT(*) as total_patterns,
    ROUND(AVG(confidence), 2) as avg_confidence,
    SUM(usage_count) as total_uses,
    ROUND(AVG(usage_count), 1) as avg_uses_per_pattern
  FROM patterns
  WHERE type = 'reasoning_memory';
" | column -t -s '|'

echo ""
echo "✅ Learning loop complete!"
echo ""
echo "To query specific patterns:"
echo "  sqlite3 .swarm/memory.db \"SELECT * FROM patterns WHERE confidence > 0.9;\""
echo ""
echo "To view trajectory details:"
echo "  sqlite3 .swarm/memory.db \"SELECT * FROM task_trajectories WHERE judge_label = 'success';\""
