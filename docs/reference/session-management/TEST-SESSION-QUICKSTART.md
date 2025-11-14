# Session Protocol Quick-Start Test

## What This Tests

This is a **minimal end-to-end test** of the session management protocol. Copy-paste this into a new Claude Code chat to verify everything works.

## Test Script (Copy-Paste This)

```markdown
I want to test the session management protocol. Please follow these exact steps:

**Step 1: Initialize Session**
```bash
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-quicktest"
echo "Testing session: $SESSION_ID"

# Create session structure
mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}

# Create metadata
cat > "sessions/$SESSION_ID/metadata.json" <<EOF
{
  "session_id": "$SESSION_ID",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "active",
  "test_type": "protocol_verification"
}
EOF

# Create session summary
cat > "sessions/$SESSION_ID/session-summary.md" <<EOF
# Session: $SESSION_ID

## Status
Active - Testing session management protocol

## Progress
- Session initialized
EOF

echo "Session initialized"
ls -la "sessions/$SESSION_ID"
```

**Step 2: Create Test Artifacts**
```bash
# Create a simple test file in code/
cat > "sessions/$SESSION_ID/artifacts/code/test.js" <<EOF
// Test artifact for session $SESSION_ID
function hello() {
  return 'Session management test';
}
module.exports = { hello };
EOF

# Create a test doc
cat > "sessions/$SESSION_ID/artifacts/docs/README.md" <<EOF
# Test Artifact

This file was created as part of session $SESSION_ID
to test the session management protocol.
EOF

echo "Artifacts created"
find "sessions/$SESSION_ID/artifacts" -type f
```

**Step 3: Run Verification**
```bash
# Run the verification script
./scripts/verify-session-protocol.sh "$SESSION_ID"
```

**Step 4: Report Results**
After running the verification script, tell me:
1. Did all checks pass?
2. What was the output?
3. Are the files in the right place?

Then we can test the archival process.
```

## Expected Success Indicators

If the test works correctly, you should see:

1. ✓ Session directory created at `sessions/session-YYYYMMDD-HHMMSS-quicktest/`
2. ✓ Subdirectories created: `artifacts/{code,tests,docs,scripts,notes}`
3. ✓ Metadata JSON file is valid
4. ✓ Test files appear in `artifacts/code/` and `artifacts/docs/`
5. ✓ Verification script shows "All checks passed!"

## What To Look For

**Green Flags (Protocol Works):**
- Session directory structure matches spec
- Files are created in `artifacts/` subdirectories (not root)
- Metadata is valid JSON
- Verification script passes all checks

**Red Flags (Protocol Broken):**
- Files created in root (`/tests`, `/docs`) instead of session folder
- Session directory doesn't exist
- Permission errors
- Verification script fails checks

## Next Steps After Test

**If test passes:**
1. Come back to this orchestration chat
2. Report success
3. We'll design the automation layer

**If test fails:**
1. Copy the exact error message
2. Come back to this orchestration chat
3. We'll debug and adjust the protocol

## Advanced Test (Optional)

If basic test passes, you can also test the archival process:

```bash
# Create artifact index
cat > "sessions/$SESSION_ID/ARTIFACTS-INDEX.md" <<EOF
# Artifacts Created
$(find "sessions/$SESSION_ID/artifacts" -type f -exec echo "- {}" \;)
EOF

# Archive session
mv "sessions/$SESSION_ID" "sessions/completed/$SESSION_ID"

# Update metadata status
jq '.status = "completed" | .completed_at = "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"' \
  "sessions/completed/$SESSION_ID/metadata.json" > tmp.json && \
  mv tmp.json "sessions/completed/$SESSION_ID/metadata.json"

# Create backup
BACKUP_FILE=".swarm/backups/session-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" "sessions/completed/$SESSION_ID"

# Verify
ls -la "sessions/completed/$SESSION_ID"
ls -lh "$BACKUP_FILE"
```

## Cleanup After Test

To remove test artifacts:

```bash
# Remove completed session
rm -rf "sessions/completed/session-*-quicktest"

# Remove backups
rm -f .swarm/backups/session-backup-*.tar.gz

# Verify cleanup
ls -la sessions/completed/
ls -la .swarm/backups/
```
