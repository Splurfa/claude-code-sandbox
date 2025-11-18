---
description: Run post-task hook after agent work completes
---

# Post-Task Hook

## Usage

```bash
npx claude-flow@alpha hooks post-task --task-id "task-123" --status "completed"
```

## Parameters

- `--task-id` - Task identifier from pre-task hook (required)
- `--status` - Task completion status: `completed`, `failed`, `partial` (optional, default: completed)

## What It Does

1. Records task end time
2. Calculates task duration
3. Updates memory with task results
4. Tracks metrics for performance analysis

## Real Capabilities

✅ **Works**:
- Task completion tracking
- Duration calculation
- Memory updates
- Metric collection

❌ **Doesn't work** (removed from docs):
- ~~--update-neural-patterns~~
- ~~--archive-context~~
- ~~--trigger-learning~~

These features don't exist in stock claude-flow hooks CLI.

## Integration

Post-task hooks fire automatically via:
- `.claude/hooks/auto-hooks.js` (on file writes)
- Manual execution: `npx claude-flow@alpha hooks post-task`

## See Also

- `/hooks/pre-task` - Before task begins
- WORKSPACE-GUIDE.md - Hooks architecture
