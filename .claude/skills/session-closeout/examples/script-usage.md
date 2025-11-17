# Script Usage Examples

How to use the session-closeout scripts directly from the command line.

## One-Line Closeout

**Full closeout with HITL approval:**

```bash
.claude/skills/session-closeout/scripts/closeout.sh session-20251114-120000-topic
```

**What happens:**
1. Generates summary
2. Prompts for approval (y/N)
3. On approval: backups + Captain's Log + metadata + archive

---

## Step-by-Step Manual Process

### 1. Generate Summary Only

```bash
SESSION_ID="session-20251114-120000-topic"
npx claude-flow@alpha hooks session-end --generate-summary true
cat sessions/$SESSION_ID/session-summary.md
```

### 2. Review and Decide

- Read the generated summary
- Make edits if needed
- Decide whether to archive or continue working

### 3. Close and Archive (If Approved)

```bash
.claude/skills/session-closeout/scripts/closeout.sh $SESSION_ID
```

### 4. Archive Only (Session Already Closed)

If you've already run hooks manually and just need archival:

```bash
.claude/skills/session-closeout/scripts/archive-session.sh $SESSION_ID
```

---

## Batch Closeout Multiple Sessions

**Close several sessions sequentially:**

```bash
for session in session-20251114-120000-* session-20251114-130000-*; do
  echo "Processing: $session"
  .claude/skills/session-closeout/scripts/closeout.sh "$session"
  echo
done
```

**Note:** Each session requires separate HITL approval (y/N prompt).

---

## Using Environment Variables

**Set session ID once, run multiple commands:**

```bash
export SESSION_ID="session-20251114-120000-topic"

# Generate summary
npx claude-flow@alpha hooks session-end --generate-summary true

# Review
cat sessions/$SESSION_ID/session-summary.md

# Close (script uses $SESSION_ID from environment)
.claude/skills/session-closeout/scripts/closeout.sh
```

---

## Troubleshooting

### Session Not Found

```bash
$ .claude/skills/session-closeout/scripts/archive-session.sh session-20251114-999999
❌ Session not found: sessions/session-20251114-999999
```

**Fix:** Check session exists with `ls -1 sessions/`

### Session Already Archived

```bash
$ .claude/skills/session-closeout/scripts/archive-session.sh session-20251114-120000-topic
⚠️  Session already archived: sessions/.archive/session-20251114-120000-topic
```

**This is safe** - script detects already-archived sessions and exits gracefully.

### Session Not Closed

```bash
$ .claude/skills/session-closeout/scripts/archive-session.sh session-active
⚠️  Session status: active (expected: closed)
Session should be closed before archiving.
```

**Fix:** Run full closeout workflow first:
```bash
.claude/skills/session-closeout/scripts/closeout.sh session-active
```

---

## Restore Archived Session

**To bring an archived session back to active:**

```bash
mv sessions/.archive/session-20251114-120000-topic \
   sessions/session-20251114-120000-topic
```

Then update metadata:
```bash
jq '.status = "active" | del(.closed_at)' \
  sessions/session-20251114-120000-topic/metadata.json > temp.json
mv temp.json sessions/session-20251114-120000-topic/metadata.json
```

---

## Cleanup Old Archives

**Remove archived sessions older than 90 days:**

```bash
find sessions/.archive -maxdepth 1 -type d -mtime +90 -exec rm -rf {} \;
```

**Check what would be deleted (dry run):**

```bash
find sessions/.archive -maxdepth 1 -type d -mtime +90 -print
```

---

## Integration with Natural Language

When Claude Code sees "close out this session", it internally runs:

```bash
# Determine current session ID
SESSION_ID=$(cat .current-session 2>/dev/null || echo "unknown")

# Run closeout workflow
.claude/skills/session-closeout/scripts/closeout.sh "$SESSION_ID"
```

You can do the same manually from the command line.
