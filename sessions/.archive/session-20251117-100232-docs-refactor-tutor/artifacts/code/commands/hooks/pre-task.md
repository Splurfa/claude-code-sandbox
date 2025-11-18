---
description: Run pre-task hook before agent work begins
---

# Pre-Task Hook

## Usage

```bash
npx claude-flow@alpha hooks pre-task --description "Build API endpoint" --task-id "task-123"
```

## Parameters

- `--description` - Task description (required)
- `--task-id` - Unique task identifier (optional, auto-generated if omitted)

## What It Does

1. Validates session exists
2. Prepares resources (directories, memory namespace)
3. Records task start time
4. Returns task metadata

## Real Capabilities

✅ **Works**:
- Task tracking
- Resource preparation
- Timestamp recording

❌ **Doesn't work** (removed from docs):
- ~~--auto-spawn-agents~~
- ~~--optimize-topology~~
- ~~--estimate-complexity~~

These features don't exist in stock claude-flow hooks CLI.

## Integration

Pre-task hooks fire automatically via:
- `.claude/hooks/auto-hooks.js` (on file writes)
- Manual execution: `npx claude-flow@alpha hooks pre-task`

## See Also

- `/hooks/post-task` - After task completion
- WORKSPACE-GUIDE.md - Hooks architecture
