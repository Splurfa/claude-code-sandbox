# Session Management Protocol - Implementation Guide

## Overview
This protocol ensures all chat session outputs (code, tests, docs, scripts) are captured in organized session folders rather than scattered across the workspace.

## Directory Structure

```
sessions/
├── session-YYYYMMDD-HHMMSS-<topic>/
│   ├── artifacts/
│   │   ├── code/          # Implementation files
│   │   ├── tests/         # Test files
│   │   ├── docs/          # Documentation created in session
│   │   ├── scripts/       # Scripts and automation
│   │   └── notes/         # Working notes, drafts
│   ├── session-summary.md # Auto-maintained narrative
│   └── metadata.json      # Session metadata (timestamps, agents, metrics)
├── captains-log/
│   └── YYYY-MM-DD.md      # Human-approved insights (after closeout)
└── completed/
    └── session-*/         # Archived completed sessions
```

## Step-by-Step Testing Protocol

### Phase 1: Session Initialization (Test in New Chat)

**Step 1.1: Create Session ID**
```bash
# Generate unique session identifier
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-test-protocol"
echo "Session ID: $SESSION_ID"
```

**Step 1.2: Create Session Structure**
```bash
# Create full session directory structure
mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}

# Create session metadata
cat > "sessions/$SESSION_ID/metadata.json" <<EOF
{
  "session_id": "$SESSION_ID",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "active",
  "agents_used": [],
  "artifacts_created": []
}
EOF

# Initialize session summary
cat > "sessions/$SESSION_ID/session-summary.md" <<EOF
# Session Summary: $SESSION_ID

**Created:** $(date)
**Status:** Active

## Objective
[To be filled during session]

## Progress
- Session initialized

## Artifacts Created
- None yet

## Next Steps
- Begin work
EOF

echo "✓ Session structure created at sessions/$SESSION_ID"
```

**Step 1.3: Initialize Hooks**
```bash
# Run pre-task hook to register session
npx claude-flow@alpha hooks pre-task \
  --description "Test session management protocol" \
  --task-id "$SESSION_ID" \
  --auto-spawn-agents false

echo "✓ Session registered with hooks system"
```

**Verification:**
```bash
# Verify structure
ls -la "sessions/$SESSION_ID/"
ls -la "sessions/$SESSION_ID/artifacts/"

# Verify metadata
cat "sessions/$SESSION_ID/metadata.json"

# Verify hooks recorded it
npx claude-flow@alpha hooks session-end --generate-summary true --dry-run
```

### Phase 2: Working with Session Artifacts

**Step 2.1: Create Test Artifacts**

When creating files during the session, place them in the session artifacts directory:

```bash
# Example: Create a test script
cat > "sessions/$SESSION_ID/artifacts/scripts/test-script.sh" <<EOF
#!/bin/bash
echo "This is a test artifact"
EOF

# Example: Create test code
cat > "sessions/$SESSION_ID/artifacts/code/example.js" <<EOF
function test() {
  console.log('Session artifact test');
}
module.exports = { test };
EOF

# Example: Create test documentation
cat > "sessions/$SESSION_ID/artifacts/docs/test-doc.md" <<EOF
# Test Documentation
This doc was created in session $SESSION_ID
EOF
```

**Step 2.2: Update Session Summary**

After creating artifacts:

```bash
# Update session summary (append to progress section)
cat >> "sessions/$SESSION_ID/session-summary.md" <<EOF

### $(date +%H:%M:%S) - Created Test Artifacts
- Created test script at artifacts/scripts/test-script.sh
- Created test code at artifacts/code/example.js
- Created test documentation at artifacts/docs/test-doc.md
EOF
```

**Step 2.3: Run Post-Edit Hook**

After file modifications:

```bash
npx claude-flow@alpha hooks post-edit \
  --file "sessions/$SESSION_ID/artifacts/code/example.js" \
  --memory-key "session/$SESSION_ID/artifact/example-js"
```

**Verification:**
```bash
# List all artifacts created
find "sessions/$SESSION_ID/artifacts" -type f

# Check session summary
cat "sessions/$SESSION_ID/session-summary.md"

# Verify memory storage
npx claude-flow@alpha hooks memory --action retrieve --key "session/$SESSION_ID/artifact/example-js"
```

### Phase 3: Session Closeout

**Step 3.1: Generate Final Summary**
```bash
# Generate comprehensive session summary
npx claude-flow@alpha hooks session-end \
  --task-id "$SESSION_ID" \
  --generate-summary true \
  --analyze-performance true
```

**Step 3.2: Review Artifacts**

Before archiving, review what was created:

```bash
# Create artifact index
cat > "sessions/$SESSION_ID/ARTIFACTS-INDEX.md" <<EOF
# Artifacts Index - $SESSION_ID

## Created Files
$(find "sessions/$SESSION_ID/artifacts" -type f -exec echo "- {}" \;)

## Summary
- Total files: $(find "sessions/$SESSION_ID/artifacts" -type f | wc -l)
- Code files: $(find "sessions/$SESSION_ID/artifacts/code" -type f 2>/dev/null | wc -l)
- Test files: $(find "sessions/$SESSION_ID/artifacts/tests" -type f 2>/dev/null | wc -l)
- Docs files: $(find "sessions/$SESSION_ID/artifacts/docs" -type f 2>/dev/null | wc -l)
EOF

cat "sessions/$SESSION_ID/ARTIFACTS-INDEX.md"
```

**Step 3.3: Human Review & Approval**

⚠️ **HUMAN-IN-THE-LOOP CHECKPOINT**

At this point, you (the human) should:
1. Review `sessions/$SESSION_ID/session-summary.md`
2. Review `sessions/$SESSION_ID/ARTIFACTS-INDEX.md`
3. Approve or annotate the summary
4. Decide what goes into Captain's Log

**Step 3.4: Archive Session**
```bash
# Move to completed
mv "sessions/$SESSION_ID" "sessions/completed/$SESSION_ID"

# Update metadata
jq '.status = "completed" | .completed_at = "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"' \
  "sessions/completed/$SESSION_ID/metadata.json" > tmp.json && \
  mv tmp.json "sessions/completed/$SESSION_ID/metadata.json"

echo "✓ Session archived to sessions/completed/$SESSION_ID"
```

**Step 3.5: Backup to .swarm**
```bash
# Create backup in .swarm/backups
BACKUP_FILE=".swarm/backups/session-backup-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" "sessions/completed/$SESSION_ID"

echo "✓ Backup created at $BACKUP_FILE"
```

**Verification:**
```bash
# Verify archive exists
ls -la "sessions/completed/$SESSION_ID"

# Verify backup exists
ls -lh "$BACKUP_FILE"

# Verify metadata updated
cat "sessions/completed/$SESSION_ID/metadata.json" | jq '.'
```

### Phase 4: Captain's Log Entry (Optional)

If session produced insights worth preserving:

```bash
# Create or append to today's log
LOG_FILE="sessions/captains-log/$(date +%Y-%m-%d).md"

cat >> "$LOG_FILE" <<EOF

## Session: $SESSION_ID

**Time:** $(date)

### Key Insights
- [Human-approved insight 1]
- [Human-approved insight 2]

### Decisions Made
- [Decision 1 with rationale]
- [Decision 2 with rationale]

### Lessons Learned
- [Lesson 1]
- [Lesson 2]

### References
- Session artifacts: \`sessions/completed/$SESSION_ID\`
- Backup: \`$BACKUP_FILE\`
EOF

echo "✓ Captain's log entry created in $LOG_FILE"
```

## Testing Checklist

Run this checklist in your test chat:

- [ ] Phase 1.1: Session ID created
- [ ] Phase 1.2: Directory structure exists
- [ ] Phase 1.3: Hooks initialized
- [ ] Phase 2.1: Test artifacts created in correct locations
- [ ] Phase 2.2: Session summary updates automatically
- [ ] Phase 2.3: Post-edit hooks run successfully
- [ ] Phase 3.1: Final summary generated
- [ ] Phase 3.2: Artifact index created
- [ ] Phase 3.3: Human review completed
- [ ] Phase 3.4: Session archived to completed/
- [ ] Phase 3.5: Backup created in .swarm/backups/
- [ ] Phase 4: Captain's log entry (if applicable)

## Expected Output Structure

After completing all phases, you should have:

```
sessions/
├── completed/
│   └── session-YYYYMMDD-HHMMSS-test-protocol/
│       ├── artifacts/
│       │   ├── code/example.js
│       │   ├── docs/test-doc.md
│       │   └── scripts/test-script.sh
│       ├── session-summary.md
│       ├── ARTIFACTS-INDEX.md
│       └── metadata.json (status: completed)
└── captains-log/
    └── YYYY-MM-DD.md (human-approved insights)

.swarm/
└── backups/
    └── session-backup-YYYYMMDD-HHMMSS.tar.gz
```

## Troubleshooting

**Problem:** Hooks fail with "not initialized"
**Solution:** Run `npx claude-flow@alpha init` first

**Problem:** Directories not created
**Solution:** Check permissions, try with `sudo` if needed

**Problem:** tar command fails
**Solution:** Check if GNU tar is installed (`tar --version`)

**Problem:** jq not found
**Solution:** Install jq (`brew install jq` on macOS)

## Next Steps After Successful Test

Once you've verified this works in a test chat:
1. Document any issues encountered
2. Refine the protocol based on learnings
3. Decide on automation level (manual vs automatic)
4. Update CLAUDE.md with working protocol
5. Create helper scripts to automate common tasks
