#!/bin/bash
# ReasoningBank Verdict Judge (CLI version)
#
# Stock-first: Uses sqlite3 CLI to judge trajectories with simple heuristics
# No Node.js dependencies - pure shell + sqlite3

set -e

DB_PATH="${DB_PATH:-.swarm/memory.db}"
CONFIDENCE_THRESHOLD="${1:-0.5}"

echo "⚖️  Judging trajectories..."
echo "   Database: $DB_PATH"
echo "   Confidence threshold: $CONFIDENCE_THRESHOLD"
echo ""

# Count unjudged trajectories
UNJUDGED=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM task_trajectories WHERE judge_label IS NULL;")
echo "   Unjudged trajectories: $UNJUDGED"

if [ "$UNJUDGED" -eq 0 ]; then
  echo "   No unjudged trajectories to process"
  exit 0
fi

# Apply simple heuristic judgments using SQL
# This is a simplified version - checks trajectory_json for success indicators
sqlite3 "$DB_PATH" <<EOF
-- Judge trajectories based on trajectory_json content
UPDATE task_trajectories
SET
  judge_label = CASE
    WHEN trajectory_json LIKE '%"success":true%' OR trajectory_json LIKE '%"status":"completed"%' THEN 'success'
    WHEN trajectory_json LIKE '%"error"%' OR trajectory_json LIKE '%"success":false%' THEN 'failure'
    ELSE 'partial'
  END,
  judge_conf = CASE
    WHEN trajectory_json LIKE '%"success":true%' OR trajectory_json LIKE '%"error"%' THEN 0.9
    WHEN trajectory_json LIKE '%"status":"completed"%' THEN 0.85
    ELSE 0.6
  END,
  judge_reasons = CASE
    WHEN trajectory_json LIKE '%"success":true%' THEN 'Outcome marked as successful'
    WHEN trajectory_json LIKE '%"error"%' THEN 'Error detected in outcome'
    WHEN trajectory_json LIKE '%"status":"completed"%' THEN 'Task completed'
    ELSE 'Partial completion or unknown status'
  END
WHERE judge_label IS NULL;

-- Show judgment statistics
SELECT
  judge_label,
  COUNT(*) as count,
  ROUND(AVG(judge_conf), 2) as avg_confidence
FROM task_trajectories
WHERE judge_label IS NOT NULL
GROUP BY judge_label
ORDER BY count DESC;
EOF

echo ""
echo "✅ Judgment complete"
