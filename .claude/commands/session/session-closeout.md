---
description: End session with automated issue detection and Captain's Log integration
---

# Session Closeout with Issue Detection

You are now activating the **session-closeout** skill with enhanced issue detection.

## What will happen:

1. **Session Summary Generation**: Collect all session data and generate summary
2. **Issue Detection**: Analyze session for patterns and violations
3. **HITL Approval**: Present summary and issue findings for your approval
4. **Archival**: Archive session to `.swarm/backups/` (if approved)
5. **Captain's Log**: Update today's log with session entry
6. **Cleanup**: Move session to `sessions/.archive/`

## Your Instructions:

Execute the session closeout workflow with issue detection:

### Step 1: Run Issue Detection

```bash
# Detect current session ID and run issue detection
SESSION_ID=$(find sessions -maxdepth 1 -type d -name "session-*" 2>/dev/null | \
    grep -E "session-[0-9]{8}-[0-9]{6}-" | \
    xargs ls -td 2>/dev/null | head -1 | xargs basename)

# If no session found, use current timestamp
if [ -z "$SESSION_ID" ]; then
    SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-auto"
    echo "⚠ No active session detected, using: $SESSION_ID"
fi

# Run issue detection
bash sessions/findings/detect-issues.sh "$SESSION_ID"
```

### Step 2: Activate Session Closeout Skill

Now invoke the session-closeout skill:

```
/skill session-closeout
```

The skill will handle:
- HITL approval workflow
- Stock session-end hook execution
- Captain's Log integration
- Session archival

## Issue Detection Results

The issue detection will:
- Check for protocol violations (session naming, file routing)
- Track recurring patterns in pattern database
- Auto-create issues when threshold (3 occurrences) is reached
- Display pattern summary

**Results stored at**: `.swarm/backups/last-issue-detection.json`

## Notes:

- **Automatic Detection**: Stop hook runs issue detection automatically on chat end
- **Manual Closeout**: This command provides HITL approval workflow
- **Pattern Tracking**: All patterns tracked across sessions in `sessions/findings/.pattern-database.json`
- **Issue Registry**: New issues appear in `sessions/findings/FINDING-*.md`

## Troubleshooting:

**No session found?**
- Check `sessions/` for directories matching `session-YYYYMMDD-HHMMSS-topic`
- Run `/session-start <topic>` to create new session first

**Issue detection failed?**
- Check `sessions/findings/detect-issues.sh` exists
- Verify `jq` is installed: `which jq`
- Review `.swarm/backups/last-issue-detection.json` for errors

**Pattern database errors?**
- Check `sessions/findings/.pattern-database.json` is valid JSON
- Reset if corrupted: `echo '{}' > sessions/findings/.pattern-database.json`

---

**Ready**: Execute Step 1 (issue detection) then Step 2 (skill activation)
