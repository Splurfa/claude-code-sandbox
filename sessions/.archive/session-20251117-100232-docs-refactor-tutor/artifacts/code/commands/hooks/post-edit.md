---
description: Run post-edit hook after file modifications
---

# Post-Edit Hook

## Usage

```bash
npx claude-flow@alpha hooks post-edit --file "src/api/server.js" --memory-key "swarm/coder/implementation"
```

## Parameters

- `--file` - Path to modified file (required)
- `--memory-key` - Key for storing edit context (optional)

## What It Does

1. Records file modification
2. Tracks edit timestamp
3. Stores edit context in memory (if memory-key provided)
4. Updates file change metrics

## Real Capabilities

✅ **Works**:
- File change tracking
- Timestamp recording
- Memory storage (basic)
- Edit metrics

❌ **Doesn't work** (removed from docs):
- ~~--auto-format~~
- ~~--run-linters~~
- ~~--update-dependencies~~
- ~~--notify-agents~~

These features don't exist in stock claude-flow hooks CLI.

## Integration

Post-edit hooks fire automatically via:
- `.claude/hooks/auto-hooks.js` (on file writes via Write/Edit tools)
- Manual execution: `npx claude-flow@alpha hooks post-edit`

## See Also

- `/hooks/pre-task` - Before task begins
- `/hooks/post-task` - After task completion
- WORKSPACE-GUIDE.md - Hooks architecture
