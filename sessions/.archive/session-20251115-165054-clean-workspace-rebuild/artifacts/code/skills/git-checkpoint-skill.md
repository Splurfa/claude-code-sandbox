---
name: git-checkpoint
description: Automated git commit checkpoints during development
version: 1.0.0
priority: medium
type: automation
author: Migration Script
---

# Git Checkpoint Skill

Automated git commit checkpoints for tracking development progress.

## Overview

This skill provides automatic git checkpointing:
- Create commits after significant work
- Track progress throughout development
- Enable easy rollback to checkpoints
- Maintain clean commit history

## Usage

### Manual Checkpoints

```bash
# Create checkpoint
npx claude-flow@alpha hooks post-task \
  --task-id "checkpoint-1" \
  --status "completed"

# Git commit is created automatically
```

### Automatic Checkpoints

Trigger checkpoints on:
- Task completion
- File edits (configurable)
- Session milestones
- Test passes

## Implementation

### Checkpoint Hook

```javascript
/**
 * Git Checkpoint Hook
 * Auto-commit after significant work
 */

const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function createCheckpoint(message, files = []) {
  try {
    // Stage files
    if (files.length > 0) {
      for (const file of files) {
        await execAsync(`git add "${file}"`);
      }
    } else {
      // Stage all changes
      await execAsync('git add -A');
    }

    // Create commit
    const commitMessage = `[CHECKPOINT] ${message}\n\n` +
      `Auto-generated checkpoint via git-checkpoint skill`;

    await execAsync(`git commit -m "${commitMessage}"`);

    console.log(`[GIT-CHECKPOINT] Created: ${message}`);
    return true;
  } catch (error) {
    console.error(`[GIT-CHECKPOINT] Failed: ${error.message}`);
    return false;
  }
}

module.exports = { createCheckpoint };
```

### Integration with Stock Hooks

```javascript
// In post-task hook
const { createCheckpoint } = require('./git-checkpoint');

async function postTaskHook(taskId, status) {
  // Call stock hook first
  await execAsync(`npx claude-flow@alpha hooks post-task --task-id "${taskId}" --status "${status}"`);

  // Then create checkpoint
  if (status === 'completed') {
    await createCheckpoint(`Completed task: ${taskId}`);
  }
}
```

## Configuration

### Enable in CLAUDE.md

```markdown
## Git Checkpoints

Automatic checkpoints:
- ✅ After task completion
- ✅ After successful tests
- ⚠️  After file edits (optional)
- ✅ At session end

Configure via `.claude/hooks/git-checkpoint-config.json`
```

### Config File

```json
{
  "enabled": true,
  "triggers": {
    "post-task": true,
    "post-edit": false,
    "test-pass": true,
    "session-end": true
  },
  "commitPrefix": "[CHECKPOINT]",
  "stagingStrategy": "selective"
}
```

## Checkpoint Patterns

### After Task Completion

```javascript
// Triggered automatically via post-task hook
await createCheckpoint('Task: Build API endpoints');
```

### After Test Success

```javascript
// After test suite passes
if (testsPass) {
  await createCheckpoint('Tests passing: API endpoints');
}
```

### Session Milestones

```javascript
// Major milestones
await createCheckpoint('Milestone: Feature complete');
await createCheckpoint('Milestone: All tests passing');
await createCheckpoint('Milestone: Ready for review');
```

## Rollback Support

### List Checkpoints

```bash
# Show checkpoint history
git log --grep="\[CHECKPOINT\]" --oneline
```

### Rollback to Checkpoint

```bash
# Find checkpoint
git log --grep="\[CHECKPOINT\]" --oneline -10

# Rollback
git reset --hard <commit-hash>
```

## Stock Hooks Integration

```bash
# Post-task checkpoint
npx claude-flow@alpha hooks post-task \
  --task-id "build-api" \
  --status "completed"
# → Auto-creates git checkpoint

# Session end checkpoint
npx claude-flow@alpha hooks session-end \
  --export-metrics true
# → Auto-creates final checkpoint
```

## Best Practices

### Good Checkpoint Messages

```
✅ [CHECKPOINT] Completed: User authentication
✅ [CHECKPOINT] Tests passing: API endpoints
✅ [CHECKPOINT] Milestone: Database schema complete
```

### Avoid

```
❌ [CHECKPOINT] WIP
❌ [CHECKPOINT] Stuff
❌ [CHECKPOINT] Updates
```

## Stock-First Compliance

- **Stock Architecture**: 100%
- **Custom Code**: Git automation (pure utility)
- **Uses**: Stock hooks, native git
- **Score**: 97/100 (3 points for automation logic)

## Migration Notes

Simplified from custom git checkpoint system to skill-based approach.
All checkpoints created via standard git commands.
No modifications to claude-flow core.
