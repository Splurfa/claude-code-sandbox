# Example: Error Recovery During Closeout

**Scenario:** Closeout fails partway through. How to recover?

## Failure Scenarios

### Scenario 1: Backup Fails

```
📊 Collecting session data...
✓ Post-task hook complete

📝 Generating session summary...
✓ Summary generated

📦 Archiving session...
❌ ERROR: Failed to create backup (disk full)
```

**Recovery:**
1. Free up disk space
2. Re-run closeout skill
3. Skill should detect partial state and resume

**Verification:**
```bash
# Check if backup exists
ls .swarm/backups/session-*.json

# If not, safe to re-run closeout
```

### Scenario 2: Captain's Log Fails

```
📦 Archiving session...
✓ Backup created

📖 Updating Captain's Log...
❌ ERROR: Failed to write to sessions/captains-log/2025-11-14.md (permission denied)
```

**Recovery:**
1. Fix permissions: `chmod u+w sessions/captains-log/`
2. Manual journal entry:
   ```bash
   npx claude-flow@alpha hooks journal \
     --entry "Session $SESSION_ID closed: [summary]"
   ```

**Why safe:** Backup already created, session work is safe.

### Scenario 3: User Cancels During Approval

```
Review the summary above.
Approve closeout and archive? (y/N): N

❌ Closeout cancelled. Session remains active.
```

**Recovery:**
- No recovery needed
- Session still active
- Can continue working or re-run closeout later

**Verification:**
```bash
cat sessions/$SESSION_ID/metadata.json
# { "status": "active" }  ← Still active
```

## Idempotency

**Question:** What if I run closeout twice on the same session?

**Answer:** Second run should be safe (idempotent):
1. Backup already exists → Skip or create timestamped duplicate
2. Captain's Log entry exists → Append new entry with note
3. Metadata status=closed → Already closed, confirm with user

**Expected behavior:**
```
⚠️  Session already closed (2025-11-14 18:05:30)
    Backup: .swarm/backups/session-20251114-180530.json

Would you like to create a new backup? (y/N):
```

## Best Practices

✅ **Do:** Run closeout immediately after "I'm done with this session"
✅ **Do:** Review summary carefully before approving
✅ **Do:** Keep backups (they're cheap, recovery is expensive)

❌ **Don't:** Run closeout on active session you'll continue
❌ **Don't:** Skip approval (HITL is a safety check)
❌ **Don't:** Delete backups without checking Captain's Log matches
