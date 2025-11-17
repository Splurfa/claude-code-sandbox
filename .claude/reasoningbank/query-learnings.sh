#!/bin/bash
# Query ReasoningBank Learnings
#
# Helper script to query learned patterns and trajectories
# Usage: bash query-learnings.sh [command] [args...]

set -e

DB_PATH="${DB_PATH:-.swarm/memory.db}"
COMMAND="${1:-help}"

case "$COMMAND" in
  "patterns")
    echo "🧠 All Learned Patterns:"
    echo "────────────────────────"
    sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  substr(id, 1, 8) as id,
  ROUND(confidence, 2) as conf,
  usage_count as uses,
  datetime(created_at) as created,
  datetime(last_used) as last_used
FROM patterns
WHERE type = 'reasoning_memory'
ORDER BY confidence DESC, usage_count DESC;
EOF
    ;;

  "top")
    LIMIT="${2:-10}"
    echo "🏆 Top $LIMIT Patterns by Confidence:"
    echo "────────────────────────────────────"
    sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  substr(id, 1, 8) as id,
  ROUND(confidence, 2) as conf,
  usage_count as uses,
  substr(pattern_data, 1, 80) as pattern_preview
FROM patterns
WHERE type = 'reasoning_memory'
ORDER BY confidence DESC, usage_count DESC
LIMIT $LIMIT;
EOF
    ;;

  "high-confidence")
    THRESHOLD="${2:-0.9}"
    echo "⭐ Patterns with confidence > $THRESHOLD:"
    echo "────────────────────────────────────────"
    sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  substr(id, 1, 8) as id,
  ROUND(confidence, 2) as conf,
  usage_count as uses,
  pattern_data
FROM patterns
WHERE type = 'reasoning_memory'
  AND confidence > $THRESHOLD
ORDER BY confidence DESC;
EOF
    ;;

  "trajectories")
    echo "📊 Trajectory Summary:"
    echo "─────────────────────"
    sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  judge_label as status,
  COUNT(*) as count,
  ROUND(AVG(judge_conf), 2) as avg_conf,
  COUNT(DISTINCT agent_id) as agents
FROM task_trajectories
GROUP BY judge_label
ORDER BY count DESC;
EOF
    ;;

  "successful")
    LIMIT="${2:-10}"
    echo "✅ Top $LIMIT Successful Trajectories:"
    echo "──────────────────────────────────────"
    sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  substr(task_id, 1, 16) as task,
  agent_id,
  ROUND(judge_conf, 2) as conf,
  substr(query, 1, 40) as query,
  datetime(created_at) as created
FROM task_trajectories
WHERE judge_label = 'success'
ORDER BY judge_conf DESC, created_at DESC
LIMIT $LIMIT;
EOF
    ;;

  "failed")
    LIMIT="${2:-10}"
    echo "❌ Recent $LIMIT Failed Trajectories:"
    echo "────────────────────────────────────"
    sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  substr(task_id, 1, 16) as task,
  agent_id,
  ROUND(judge_conf, 2) as conf,
  judge_reasons,
  datetime(created_at) as created
FROM task_trajectories
WHERE judge_label = 'failure'
ORDER BY created_at DESC
LIMIT $LIMIT;
EOF
    ;;

  "stats")
    echo "📈 ReasoningBank Statistics:"
    echo "────────────────────────────"
    echo ""
    echo "Patterns:"
    sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  COUNT(*) as total,
  ROUND(AVG(confidence), 2) as avg_conf,
  ROUND(MIN(confidence), 2) as min_conf,
  ROUND(MAX(confidence), 2) as max_conf,
  SUM(usage_count) as total_uses
FROM patterns
WHERE type = 'reasoning_memory';
EOF
    echo ""
    echo "Trajectories:"
    sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  COUNT(*) as total,
  SUM(CASE WHEN judge_label = 'success' THEN 1 ELSE 0 END) as success,
  SUM(CASE WHEN judge_label = 'failure' THEN 1 ELSE 0 END) as failure,
  SUM(CASE WHEN judge_label = 'partial' THEN 1 ELSE 0 END) as partial,
  SUM(CASE WHEN judge_label IS NULL THEN 1 ELSE 0 END) as unjudged
FROM task_trajectories;
EOF
    ;;

  "pattern")
    PATTERN_ID="${2}"
    if [ -z "$PATTERN_ID" ]; then
      echo "❌ Error: Pattern ID required"
      echo "Usage: query-learnings.sh pattern <pattern-id>"
      exit 1
    fi
    echo "🔍 Pattern Details: $PATTERN_ID"
    echo "────────────────────────────────"
    sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  id,
  type,
  ROUND(confidence, 2) as confidence,
  usage_count,
  datetime(created_at) as created,
  datetime(last_used) as last_used,
  pattern_data
FROM patterns
WHERE id LIKE '${PATTERN_ID}%';
EOF
    ;;

  "timeline")
    echo "📅 Learning Timeline:"
    echo "────────────────────"
    sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  date(created_at) as date,
  COUNT(*) as new_patterns,
  SUM(usage_count) as total_uses
FROM patterns
WHERE type = 'reasoning_memory'
GROUP BY date(created_at)
ORDER BY date DESC
LIMIT 30;
EOF
    ;;

  "help"|*)
    cat <<EOF
ReasoningBank Query Tool
═══════════════════════

Usage: bash query-learnings.sh [command] [args...]

Commands:
  patterns              List all learned patterns
  top [n]              Show top N patterns by confidence (default: 10)
  high-confidence [t]  Show patterns above threshold (default: 0.9)
  trajectories         Summary of trajectory judgments
  successful [n]       Show top N successful trajectories (default: 10)
  failed [n]           Show recent N failed trajectories (default: 10)
  stats                Overall ReasoningBank statistics
  pattern <id>         Show details for specific pattern
  timeline             Show pattern learning over time
  help                 Show this help message

Examples:
  bash query-learnings.sh top 5
  bash query-learnings.sh high-confidence 0.95
  bash query-learnings.sh pattern 5f894154
  bash query-learnings.sh stats

Environment:
  DB_PATH              Path to memory.db (default: .swarm/memory.db)
EOF
    ;;
esac
