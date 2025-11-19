# Example: Basic Session Closeout

**Scenario:** You've finished working on a feature and want to close the session.

## User Action

**Say:** "Close out this session"

## System Response

```
📊 Collecting session data...
✓ Post-task hook complete

📝 Generating session summary...
✓ Summary generated

=== Session Summary ===
# Session: session-20251114-153041-feature-development

## Work Completed
- Implemented user authentication endpoints
- Created tests with 95% coverage
- Documented API in OpenAPI spec

## Files Created
- artifacts/code/auth.js (234 lines)
- artifacts/tests/auth.test.js (156 lines)
- artifacts/docs/auth-api.md (89 lines)

## Decisions Made
- Chose JWT over session cookies (stateless API)
- Implemented refresh token rotation
- Added rate limiting (100 req/min)

Review the summary above.
Approve closeout and archive? (y/N):
```

## User Types

`y`

## System Archives

```
📦 Archiving session...
✓ Backup created: .swarm/backups/session-20251114-180530.json

📖 Updating Captain's Log...
✓ Entry added: sessions/captains-log/2025-11-14.md

📝 Updating metadata...
✓ Session status: closed

✅ Session closed successfully
```

## Verification

**Check backup exists:**
```bash
ls -lh .swarm/backups/session-20251114-180530.json
# -rw-r--r-- 1 user staff 23K Nov 14 18:05
```

**Check Captain's Log:**
```bash
tail sessions/captains-log/2025-11-14.md
# ## [18:05] Session: feature-development
# Implemented user authentication with JWT...
```

**Check metadata:**
```bash
cat sessions/session-20251114-153041-feature-development/metadata.json
# {
#   "status": "closed",
#   "closed_at": "2025-11-14T18:05:30Z"
# }
```

## Success Criteria

✅ Backup exists in .swarm/backups/
✅ Captain's Log has timestamped entry
✅ Metadata shows status: "closed"
✅ Session summary preserved in session directory
