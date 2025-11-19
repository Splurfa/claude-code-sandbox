# Session Closeout Skill

Natural language interface for ending sessions with human approval.

## Quick Start

**Say:** "Close out this session"

**What happens:**
1. Session summary generated
2. You review and approve
3. Session backup created (.swarm/backups/)
4. Entry added to Captain's Log
5. Session moved to sessions/.archive/

## Why This Exists

**Problem:** Manual closeout is tedious and error-prone.

**Solution:** One natural language command handles the complete workflow with safety checks.

## How to Use

### Basic Closeout

**Say:** "Close out this session"

**System displays:**
```
📊 Collecting session data...
✓ Post-task hook complete

📝 Generating session summary...
✓ Summary generated

=== Session Summary ===
[Your session work summary]

Review the summary above.
Approve closeout and archive? (y/N):
```

**Type:** `y` to approve, `N` to cancel

### What Gets Archived

- **Backup JSON:** `.swarm/backups/session-YYYYMMDD-HHMMSS.json` (compressed snapshot)
- **Session Directory:** Moved from `sessions/` to `sessions/.archive/`
- **Captain's Log:** `sessions/captains-log/YYYY-MM-DD.md` (entry added)
- **Metadata:** `sessions/$SESSION_ID/metadata.json` (status: "closed")

**Result:** Only active sessions remain visible in `sessions/` folder

## Examples

See examples/ directory for:
- Basic closeout (single session)
- Batch closeout (multiple sessions)
- Error recovery (handling failures)

## Stock-First Design

**95% claude-flow hooks:**
- post-task, session-end, journal hooks
- No custom closeout framework
- Thin bash glue for HITL approval + archival

**Archive Location:**
- Closed sessions: `sessions/.archive/<session-id>/`
- JSON backups: `.swarm/backups/session-*.json`
- Active sessions: `sessions/<session-id>/` (only current work)

**Cleanup:**
```bash
# Remove archived sessions older than 90 days
find sessions/.archive -maxdepth 1 -type d -mtime +90 -exec rm -rf {} \;
```

## Related Skills

- None (this skill is standalone)

## Related Documentation

- [Session Management README](../../../sessions/README.md)
- [Captain's Log README](../../../sessions/captains-log/README.md)
