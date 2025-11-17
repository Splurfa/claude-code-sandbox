# Session Closeout User Guide

## Overview

Session closeout is a human-in-the-loop workflow that reviews session work, archives to `.swarm/backups/`, and optionally promotes artifacts to project directories.

## Workflow Steps

1. **Generate Summary** - Collect session artifacts and metadata
2. **HITL Review** - Present summary for user approval
3. **Archive** - Save snapshot to `.swarm/backups/`
4. **Cleanup** - Update metadata, run hooks
5. **Optional: Promote** - Move artifacts to `docs/projects/`

## Basic Usage

### Interactive Closeout

```bash
node session-closeout.js closeout
```

This will:
1. Generate session summary
2. Display summary for review
3. Prompt: "Approve session closeout? (y/n)"
4. Archive session if approved
5. Run session-end hooks

### Non-Interactive Summary

```bash
node session-closeout.js summary
```

View session summary without closeout.

## Session Summary Format

```markdown
# Session: session-20251113-211159-hive-mind-setup
**Started:** 2025-11-13 21:11:59
**Status:** Active

## Progress
- Session initialized automatically
- Artifacts structure created
- Phase 2 systems implemented

## Artifacts Created

### code/
- captains-log.js
- consensus.js
- session-closeout.js

### tests/
- captains-log.test.js
- consensus.test.js
- integration.test.js

### docs/
- captains-log-guide.md
- consensus-guide.md
- session-closeout-guide.md
```

## Archive Structure

Archives stored in `.swarm/backups/session-TIMESTAMP.json`:

```json
{
  "sessionId": "session-20251113-211159-hive-mind-setup",
  "timestamp": "2025-11-14T10:30:00.000Z",
  "summary": "# Session: ...",
  "metadata": {
    "session_id": "session-20251113-211159-hive-mind-setup",
    "created_at": "2025-11-13T21:11:59.000Z",
    "status": "closed",
    "closed_at": "2025-11-14T10:30:00.000Z"
  },
  "artifacts": [
    "code/captains-log.js",
    "code/consensus.js",
    "tests/captains-log.test.js",
    "docs/captains-log-guide.md"
  ]
}
```

## Promoting to Projects

After closeout, promote artifacts to project directory:

```bash
node session-closeout.js promote session-20251113-211159-hive-mind-setup hive-mind
```

This copies artifacts to `docs/projects/hive-mind/`.

### When to Promote

- **Session produces reusable components** → Promote
- **Experimental/throwaway work** → Don't promote
- **Bug fixes/patches** → Don't promote (already in codebase)
- **New features/systems** → Promote

## Integration with Phase 1

Closeout uses Phase 1 systems:
- **session-auto-init.js** - Reads session metadata
- **always-on-hooks.js** - Runs session-end hooks
- **learning-integration.js** - Captures session insights

## Hooks Integration

Session-end hooks automatically:
1. Generate summary
2. Persist state to `.swarm/memory.db`
3. Export metrics
4. Compress logs

```bash
npx claude-flow@alpha hooks session-end --generate-summary true --persist-state true
```

## HITL Review Process

When closeout runs:

```
🔚 Session Closeout: session-20251113-211159-hive-mind-setup

📊 Generating session summary...

# Session: session-20251113-211159-hive-mind-setup
**Started:** 2025-11-13 21:11:59
**Status:** Active

## Progress
[... session details ...]

Approve session closeout? (y/n):
```

User options:
- **y** - Approve: Archive session, run hooks, cleanup
- **n** - Cancel: Keep session active, no changes

## Backup Management

List backups:
```bash
ls -lh .swarm/backups/
```

Restore from backup:
```bash
# Manually restore by reading JSON and recreating session
cat .swarm/backups/session-20251114-103000.json
```

## Session Lifecycle

```
New Chat → Auto-init → Work → Closeout → Archive
                         ↓           ↓
                    Captain's Log   Backup
                    Consensus       Metadata
                    Learning        Cleanup
```

## Best Practices

1. **Close sessions when chat ends** - Don't leave orphaned sessions
2. **Review summary carefully** - Ensure all work captured
3. **Promote valuable artifacts** - Build project documentation
4. **Archive regularly** - Don't accumulate too many open sessions
5. **Link to Captain's Log** - Cross-reference decisions

## Metadata Tracking

Session metadata evolves:

```json
// Active session
{
  "session_id": "session-20251113-211159-hive-mind-setup",
  "created_at": "2025-11-13T21:11:59.000Z",
  "status": "active"
}

// Closed session
{
  "session_id": "session-20251113-211159-hive-mind-setup",
  "created_at": "2025-11-13T21:11:59.000Z",
  "status": "closed",
  "closed_at": "2025-11-14T10:30:00.000Z"
}
```

## Artifact Organization

During session:
```
sessions/
  session-YYYYMMDD-HHMMSS-topic/
    artifacts/
      code/     ← Working files
      tests/    ← Test files
      docs/     ← Documentation
      scripts/  ← Utility scripts
      notes/    ← Working notes
```

After promotion:
```
docs/projects/
  project-name/
    code/     ← Promoted from session
    tests/    ← Promoted from session
    docs/     ← Promoted from session
```

## Error Handling

If closeout fails:
1. Session remains active
2. No archive created
3. Metadata unchanged
4. User can retry closeout

## Programmatic Usage

```javascript
const { closeoutSession, promoteToProject } = require('./session-closeout');

async function endSession() {
  const result = await closeoutSession('session-20251113-211159-hive-mind-setup');

  if (result.status === 'closed') {
    console.log('Session closed:', result.backupPath);

    // Optionally promote
    promoteToProject('session-20251113-211159-hive-mind-setup', 'hive-mind');
  }
}
```

## Session History

Query closed sessions:

```bash
# List all backups
ls -1 .swarm/backups/ | grep session

# View specific backup
cat .swarm/backups/session-20251114-103000.json | jq .

# Search backups by content
grep -l "Captain's Log" .swarm/backups/*.json
```

## Integration with Captain's Log

Closeout summary includes Captain's Log entries:

```markdown
## Captain's Log Highlights

### Decisions
- 2025-11-14T10:00:00Z: Use Byzantine consensus for critical decisions
- 2025-11-14T10:30:00Z: Implement hierarchical topology for Phase 3

### Insights
- Phase 1 hooks work seamlessly with Phase 2 systems
- Time-neutral logging improves searchability

### Blockers
- None reported
```

## Cleanup Tasks

Closeout performs:
1. Update session metadata (status: closed)
2. Run session-end hooks
3. Compress memory data
4. Export metrics
5. Generate final summary
