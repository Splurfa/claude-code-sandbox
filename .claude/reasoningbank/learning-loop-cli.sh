#!/bin/bash
# ReasoningBank Learning Loop (CLI version)
#
# Stock-first: Pure shell + sqlite3 CLI, no Node.js dependencies
# Runs complete learning pipeline: collect → judge → distill

set -e

DB_PATH="${DB_PATH:-.swarm/memory.db}"
CONFIDENCE_THRESHOLD="${1:-0.8}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🧠 ReasoningBank Learning Loop Starting..."
echo "   Database: $DB_PATH"
echo "   Confidence threshold: $CONFIDENCE_THRESHOLD"
echo "   Script dir: $SCRIPT_DIR"
echo ""
echo "=========================================="
echo ""

# Step 1: Collect trajectories
echo "📊 Step 1: Collecting trajectories..."
bash "$SCRIPT_DIR/trajectory-collector-cli.sh" swarm 100
echo ""

# Step 2: Judge trajectories
echo "⚖️  Step 2: Judging trajectories..."
bash "$SCRIPT_DIR/verdict-judge-cli.sh" "$CONFIDENCE_THRESHOLD"
echo ""

# Step 3: Distill patterns
echo "🔬 Step 3: Distilling patterns..."
bash "$SCRIPT_DIR/memory-distiller-cli.sh" "$CONFIDENCE_THRESHOLD"
echo ""

# Step 4: Summary statistics
echo "=========================================="
echo "📈 Step 4: Summary Statistics"
echo "=========================================="
echo ""

echo "Trajectory Judgments:"
echo "─────────────────────"
sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  COALESCE(judge_label, 'unjudged') as label,
  COUNT(*) as count,
  ROUND(AVG(judge_conf), 2) as avg_conf
FROM task_trajectories
GROUP BY judge_label
ORDER BY count DESC;
EOF

echo ""
echo "Top Learned Patterns:"
echo "─────────────────────"
sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  substr(id, 1, 8) as pattern_id,
  ROUND(confidence, 2) as conf,
  usage_count as uses,
  datetime(created_at) as created
FROM patterns
WHERE type = 'reasoning_memory'
ORDER BY confidence DESC, usage_count DESC
LIMIT 10;
EOF

echo ""
echo "Overall Stats:"
echo "──────────────"
sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  COUNT(*) as total_patterns,
  ROUND(AVG(confidence), 2) as avg_confidence,
  SUM(usage_count) as total_uses,
  ROUND(AVG(usage_count), 1) as avg_uses_per_pattern
FROM patterns
WHERE type = 'reasoning_memory';
EOF

echo ""
echo "=========================================="
echo "✅ Learning loop complete!"
echo "=========================================="
echo ""
echo "Query examples:"
echo "  # View successful trajectories:"
echo "  sqlite3 $DB_PATH \"SELECT * FROM task_trajectories WHERE judge_label = 'success';\""
echo ""
echo "  # View high-confidence patterns:"
echo "  sqlite3 $DB_PATH \"SELECT * FROM patterns WHERE confidence > 0.9;\""
echo ""
echo "  # Pattern usage over time:"
echo "  sqlite3 $DB_PATH \"SELECT datetime(created_at), COUNT(*) FROM patterns GROUP BY date(created_at);\""
