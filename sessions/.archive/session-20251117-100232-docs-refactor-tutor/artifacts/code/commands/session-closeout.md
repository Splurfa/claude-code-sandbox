---
description: End current session with HITL approval and archive artifacts
priority: high
---

# Session Closeout

**Purpose**: Properly close the current workspace session, archive artifacts, and create session summary.

**When to use**: At the end of a chat thread or when switching to a new major task.

## Usage

```
/session-closeout
```

## What It Does

1. **Gather session information**:
   - Session ID from environment
   - List artifacts created (code, tests, docs, scripts, notes)
   - Collect memory entries from this session
   - Generate session summary

2. **HITL Approval Workflow**:
   - Present summary to user
   - Show artifacts to be archived
   - Ask for confirmation before archival

3. **Archive Process** (after approval):
   - Create backup in `.swarm/backups/session-[ID].json`
   - Update sessions/metadata.json
   - Compress large artifacts
   - Add Captain's Log entry

4. **Cleanup**:
   - Clear session-specific memory (optional)
   - Update session status to "completed"
   - Return to default workspace state

## Integration

- Uses: `npx claude-flow@alpha hooks session-end --export-metrics true`
- Stores: Session backup in `.swarm/backups/`
- Updates: Captain's Log in `sessions/captains-log/[date].md`

## Session vs Coordination Sessions

**This command closes WORKSPACE sessions** (artifact organization):
- Located in: `sessions/session-YYYYMMDD-HHMMSS-topic/`
- Purpose: Organize chat artifacts
- One per chat thread

**Not coordination sessions** (hive-mind state):
- Located in: `.hive-mind/sessions/`
- Purpose: Swarm coordination tracking
- Multiple per workspace session
- Managed automatically by hive-mind

## See Also

- `/session-start` - Begin new session
- Captain's Log - Session decision journal
- WORKSPACE-GUIDE.md - Full session protocol
