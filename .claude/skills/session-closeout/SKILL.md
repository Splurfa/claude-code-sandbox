---
name: session-closeout
description: Natural language session closeout with HITL approval and Captain's Log integration
version: 1.0.0
triggers:
  - "Close out this session"
  - "End session"
  - "Done with this session"
  - "Session closeout"
  - "Wrap up this session"
stock_first: true
hitl_required: true
---

# Session Closeout Skill

End your work session with automated archival and Captain's Log entry.

---

## Quick Start

Run `/session-closeout` when your work is complete. The skill will:
1. Generate session summary
2. Request your approval
3. Archive to `.swarm/backups/`
4. Update Captain's Log
5. Move session to `sessions/.archive/`

### Prerequisites
- Active session exists in `sessions/`
- Stock hooks configured (`npx claude-flow@alpha hooks`)
- Session has `metadata.json` with valid structure

See: `examples/basic-closeout.md` for walkthrough

---

## Step-by-Step Guide

### Step 1: Collect Session Data

Generate summary using stock hooks:
```bash
npx claude-flow@alpha hooks post-task --task-id "$SESSION_ID" --status "completed"
npx claude-flow@alpha hooks session-end --generate-summary true
```

**Output**: JSON summary with files created, tasks completed, decisions made

### Step 2: Present Summary for HITL Approval

Display human-readable summary:
- **Session ID**: `session-YYYYMMDD-HHMMSS-topic`
- **Duration**: Time elapsed since session start
- **Artifacts**: Files created in `sessions/$SESSION_ID/artifacts/`
- **Key decisions**: Major technical choices made
- **Next steps**: Recommended follow-up tasks

**Prompt**: "Approve closeout and archive? (y/N)"

### Step 3: Archive Session (if approved)

Execute stock session-end hook with metrics export:
```bash
npx claude-flow@alpha hooks session-end --export-metrics true
```

**Creates**:
- `.swarm/backups/session-$SESSION_ID.json` - Full session backup
- Metadata update with completion timestamp

### Step 3.5: Document Promotion (Optional)

After HITL approval, scan session artifacts for user-facing documentation:

1. **Automatic scan**: Checks `sessions/$SESSION_ID/artifacts/docs/` for `.md` files
2. **File list**: Shows document names and sizes
3. **User decision**: Prompts "Promote any docs to docs/guides/? (y/N)"
4. **If yes**:
   - Displays routing checklist (references `.claude/skills/file-routing/README.md`)
   - Shows 3-question test for content classification
   - Pauses closeout for manual promotion
   - Resume with another `/session-closeout` after promotion complete

**Routing Checklist**:
- ✓ User-facing guide? (not system/architecture work)
- ✓ Category: getting-started, how-to, reference, troubleshooting, concepts, advanced?
- ✓ Passes 3-question test in file-routing skill?

**Target**: `docs/guides/{category}/{filename}.md`

See: `examples/document-promotion.md` for complete walkthrough

---

### Step 4: Captain's Log Entry

Append session summary to today's log:
```bash
npx claude-flow@alpha hooks journal --entry "[Session closeout summary]"
```

**Format**:
```markdown
### [HH:MM PST] Session: session-YYYYMMDD-HHMMSS-topic

**Completed**: Brief description of work done
**Key decisions**: Major choices made
**Next steps**: Recommended follow-up

**Artifacts created**:
- `sessions/$SESSION_ID/artifacts/code/file1.js`
- `sessions/$SESSION_ID/artifacts/tests/file1.test.js`
```

### Step 5: Move Session to Archive

Execute archive script:
```bash
.claude/skills/session-closeout/scripts/archive-session.sh $SESSION_ID
```

**Actions**:
- Move `sessions/$SESSION_ID/` → `sessions/.archive/$SESSION_ID/`
- Preserve all artifacts and metadata
- Update `.archive/README.md` with session entry

---

## Advanced Topics

### Stock Infrastructure Used

- `npx claude-flow@alpha hooks post-task` - Collect session data
- `npx claude-flow@alpha hooks session-end --generate-summary true` - Generate summary
- `npx claude-flow@alpha hooks session-end --export-metrics true` - Create backup
- `npx claude-flow@alpha hooks journal --entry "[summary]"` - Update Captain's Log

### Implementation Scripts

- `.claude/skills/session-closeout/scripts/closeout.sh` - Full closeout orchestration with HITL approval
- `.claude/skills/session-closeout/scripts/archive-session.sh` - Session directory archival (move to .archive)

### Usage Methods

**Invoke via natural language:**
"Close out this session"

**Invoke as skill:**
`/session-closeout`

**Invoke via script:**
```bash
.claude/skills/session-closeout/scripts/closeout.sh <session-id>
```

### Progressive Disclosure Examples

- **Beginner:** `examples/basic-closeout.md` - Single session closeout walkthrough
- **Intermediate:** `examples/batch-closeout.md` - Multiple sessions at once
- **Advanced:** `examples/error-recovery.md` - Handling closeout failures

### Troubleshooting

**Session not found**:
- Verify session ID matches directory in `sessions/`
- Check `metadata.json` exists and has valid JSON

**Archive fails**:
- Ensure `.swarm/backups/` directory exists
- Check disk space for backup creation
- Verify `archive-session.sh` has execute permissions

**Document routing confusion**:
- Reference `.claude/skills/file-routing/README.md` for decision tree
- Use 3-question test (audience, purpose, scope)
- When uncertain, keep docs in session (safe default)

**Captain's Log entry missing**:
- Verify `sessions/captains-log/` directory exists
- Check today's date file created with PST timestamps
- Ensure closeout script has write permissions

### HITL Protocol

**Mandatory approval before archive:**
1. Display session summary
2. Prompt: "Approve closeout and archive? (y/N)"
3. If yes → Archive + log + cleanup
4. If no → Cancel and remain in session

**No auto-approval** - Always requires explicit user confirmation.

---

## Related Documentation

- [Session Management](../../../sessions/README.md)
- [Captain's Log](../../../sessions/captains-log/README.md)
- [File Routing](../file-routing/README.md)
- [CLAUDE.md](../../../CLAUDE.md)
