# ReasoningBank Learning Pipeline - Quick Reference

## 🚀 Quick Start

```bash
# Run the learning pipeline
bash sessions/session-20251114-200257-reasoningbank-learning/artifacts/code/reasoningbank/learning-loop-cli.sh 0.8

# View statistics
bash sessions/session-20251114-200257-reasoningbank-learning/artifacts/code/reasoningbank/query-learnings.sh stats

# See top patterns
bash sessions/session-20251114-200257-reasoningbank-learning/artifacts/code/reasoningbank/query-learnings.sh top 10
```

## 📊 Common Queries

### Statistics
```bash
bash query-learnings.sh stats
```

### Top Patterns
```bash
bash query-learnings.sh top 10
bash query-learnings.sh high-confidence 0.95
```

### Trajectories
```bash
bash query-learnings.sh trajectories
bash query-learnings.sh successful 20
bash query-learnings.sh failed 10
```

### Pattern Details
```bash
bash query-learnings.sh pattern 5f894154
```

### Timeline
```bash
bash query-learnings.sh timeline
```

## 🔧 Pipeline Components

### 1. Collect Trajectories
```bash
bash trajectory-collector-cli.sh [namespace] [limit]
```
Default: namespace=swarm, limit=100

### 2. Judge Trajectories
```bash
bash verdict-judge-cli.sh [confidence-threshold]
```
Default: threshold=0.5

### 3. Distill Patterns
```bash
bash memory-distiller-cli.sh [min-confidence]
```
Default: min-confidence=0.8

### 4. Full Pipeline
```bash
bash learning-loop-cli.sh [confidence-threshold]
```
Default: threshold=0.8

## 📁 File Locations

All scripts in:
```
sessions/session-20251114-200257-reasoningbank-learning/artifacts/code/reasoningbank/
```

Key files:
- `learning-loop-cli.sh` - Full pipeline
- `query-learnings.sh` - Query tool
- `trajectory-collector-cli.sh` - Collector
- `verdict-judge-cli.sh` - Judge
- `memory-distiller-cli.sh` - Distiller

## 💾 Database Schema

### Tables Used
- `task_trajectories` - Agent work trajectories
- `patterns` - Learned patterns
- `memory_entries` - Raw agent memory

### Key Fields

**task_trajectories:**
- `task_id` - Unique identifier
- `agent_id` - Agent that performed work
- `trajectory_json` - State→Action→Outcome
- `judge_label` - success/failure/partial
- `judge_conf` - Confidence (0-1)
- `judge_reasons` - Why this judgment

**patterns:**
- `id` - Pattern identifier
- `type` - 'reasoning_memory'
- `pattern_data` - JSON pattern data
- `confidence` - Learning confidence (0-1)
- `usage_count` - Times pattern reused

## 🎯 Confidence Thresholds

| Threshold | Use Case |
|-----------|----------|
| 0.5 | Include partial successes |
| 0.7 | Balanced learning (default) |
| 0.8 | High-quality patterns only |
| 0.9 | Very high confidence |
| 0.95 | Expert patterns only |

## 📈 Output Interpretation

### Pattern Confidence
- **0.8**: Initial pattern (1 successful use)
- **0.85**: Confirmed pattern (2+ uses)
- **0.9+**: Highly reliable pattern (5+ uses)
- **1.0**: Maximum confidence (capped)

### Judgment Labels
- **success**: Task completed successfully
- **failure**: Task failed with errors
- **partial**: Incomplete or uncertain
- **null**: Not yet judged

## 🔍 Direct SQL Examples

### High-confidence patterns
```bash
sqlite3 .swarm/memory.db "
  SELECT id, confidence, usage_count
  FROM patterns
  WHERE confidence > 0.9
  ORDER BY usage_count DESC;
"
```

### Successful trajectories by agent
```bash
sqlite3 .swarm/memory.db "
  SELECT agent_id, COUNT(*) as successes
  FROM task_trajectories
  WHERE judge_label = 'success'
  GROUP BY agent_id;
"
```

### Pattern growth over time
```bash
sqlite3 .swarm/memory.db "
  SELECT date(created_at), COUNT(*)
  FROM patterns
  WHERE type = 'reasoning_memory'
  GROUP BY date(created_at)
  ORDER BY date(created_at) DESC;
"
```

## 🛠️ Troubleshooting

### No trajectories collected?
- Check if agents are writing to memory_entries
- Verify namespace matches (default: 'swarm')
- Run: `sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM memory_entries;"`

### No patterns extracted?
- Check if any trajectories judged as 'success'
- Lower confidence threshold: `learning-loop-cli.sh 0.5`
- Run: `bash query-learnings.sh trajectories`

### Database errors?
- Verify memory.db exists: `ls -la .swarm/memory.db`
- Check schema: `sqlite3 .swarm/memory.db ".tables"`
- Test access: `sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM patterns;"`

## 📚 Help

Full help:
```bash
bash query-learnings.sh help
```

Documentation:
```
sessions/session-20251114-200257-reasoningbank-learning/artifacts/docs/REASONINGBANK-ACTIVATION.md
```

---

**Stock-First:** 98% stock infrastructure (sqlite3 + existing schema)
**Zero Dependencies:** Pure shell + sqlite3 CLI
**Time-Neutral:** On-demand execution only
