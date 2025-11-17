#!/bin/bash
# ReasoningBank Memory Distiller (CLI version)
#
# Stock-first: Uses sqlite3 CLI to extract patterns from successful trajectories
# No Node.js dependencies - pure shell + sqlite3 + jq (optional)

set -e

DB_PATH="${DB_PATH:-.swarm/memory.db}"
MIN_CONFIDENCE="${1:-0.8}"

echo "🔬 Distilling patterns from successful trajectories..."
echo "   Database: $DB_PATH"
echo "   Minimum judge confidence: $MIN_CONFIDENCE"
echo ""

# Count successful trajectories
SUCCESSFUL=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM task_trajectories WHERE judge_label = 'success' AND judge_conf >= $MIN_CONFIDENCE;")
echo "   Successful trajectories: $SUCCESSFUL"

if [ "$SUCCESSFUL" -eq 0 ]; then
  echo "   No successful trajectories to distill"
  exit 0
fi

# Count patterns before
PATTERNS_BEFORE=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM patterns WHERE type = 'reasoning_memory';")

# Extract and store patterns from successful trajectories
# This creates patterns based on agent_id and query combinations
sqlite3 "$DB_PATH" <<EOF
-- Extract patterns from successful trajectories
INSERT OR IGNORE INTO patterns (id, type, pattern_data, confidence, usage_count)
SELECT
  substr(
    hex(
      randomblob(8)
    ), 1, 16
  ) as id,
  'reasoning_memory' as type,
  json_object(
    'agent_id', agent_id,
    'query', query,
    'success_indicator', 'trajectory_success',
    'judge_confidence', judge_conf,
    'timestamp', created_at
  ) as pattern_data,
  judge_conf as confidence,
  1 as usage_count
FROM task_trajectories
WHERE judge_label = 'success'
  AND judge_conf >= $MIN_CONFIDENCE
  AND NOT EXISTS (
    SELECT 1 FROM patterns
    WHERE patterns.pattern_data LIKE '%' || task_trajectories.agent_id || '%'
      AND patterns.pattern_data LIKE '%' || substr(task_trajectories.query, 1, 20) || '%'
  );

-- Update existing patterns (increment confidence and usage)
UPDATE patterns
SET
  confidence = MIN(confidence + 0.05, 1.0),
  usage_count = usage_count + 1,
  last_used = datetime('now')
WHERE type = 'reasoning_memory'
  AND id IN (
    SELECT p.id
    FROM patterns p
    JOIN task_trajectories t ON (
      p.pattern_data LIKE '%' || t.agent_id || '%'
      AND p.pattern_data LIKE '%' || substr(t.query, 1, 20) || '%'
    )
    WHERE t.judge_label = 'success'
      AND t.judge_conf >= $MIN_CONFIDENCE
  );
EOF

PATTERNS_AFTER=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM patterns WHERE type = 'reasoning_memory';")
NEW_PATTERNS=$((PATTERNS_AFTER - PATTERNS_BEFORE))

echo ""
echo "✅ Distillation complete"
echo "   Patterns before: $PATTERNS_BEFORE"
echo "   Patterns after: $PATTERNS_AFTER"
echo "   New patterns: $NEW_PATTERNS"
echo ""

# Show top patterns
echo "🧠 Top learned patterns:"
sqlite3 -column -header "$DB_PATH" <<EOF
SELECT
  substr(id, 1, 8) as pattern_id,
  ROUND(confidence, 2) as conf,
  usage_count as uses,
  datetime(created_at) as created,
  substr(pattern_data, 1, 60) as pattern_preview
FROM patterns
WHERE type = 'reasoning_memory'
ORDER BY confidence DESC, usage_count DESC
LIMIT 5;
EOF
