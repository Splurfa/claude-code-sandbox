# Revised Simple Plan - 5 Moves

**Date**: 2025-11-15
**Status**: Ready for execution
**Estimated time**: 5 minutes

---

## What's Already Working ✅

**Stock claude-flow infrastructure (keep as-is):**
- `.swarm/memory.db` - Memory persistence
- `.swarm/backups/` - Session backups
- Stock hooks: pre-task, post-task, session-end, memory, journal
- 28 claude-flow skills installed

**Current workspace structure (keep as-is):**
- `docs/` folder - Documentation
- `inbox/` folder - Intake system
- `sessions/` folder - Session artifacts
- `sessions/captains-log/` - Learning journal
- File routing pattern already defined in CLAUDE.md

**Working commands:**
- `/session-closeout` skill - Complete with HITL approval
- All hook commands in `.claude/commands/hooks/`

---

## What's Missing ❌

1. `/session-start` command (partner to closeout)
2. Duration bug fix in closeout.sh (line 56 calculation)

That's it. Everything else exists.

---

## The 5 Moves

### Move 1: Create `/session-start` Command
**What**: Add `.claude/commands/session/session-start.md` slash command
**Why**: Partner to existing `/session-closeout`
**How**: Natural language triggers session creation via stock hooks

**Implementation**:
```bash
# Command file triggers:
npx claude-flow@alpha hooks pre-task --description "<topic>" --task-id "session-$(date +%Y%m%d-%H%M%S)-<topic>"
mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}
# Initialize metadata.json and session-summary.md
```

### Move 2: Fix Duration Bug in Closeout
**What**: Fix time calculation in `.claude/skills/session-closeout/scripts/closeout.sh`
**Why**: Session duration not calculating correctly
**Where**: Line 56 (summary text extraction)

**Fix**:
```bash
# Add duration calculation before summary display
START_TIME=$(jq -r '.created_at' "sessions/$SESSION_ID/metadata.json")
END_TIME=$(date -u +%s)
DURATION=$((END_TIME - START_TIME))
# Display human-readable duration
```

### Move 3: Activate Existing Memory Skills
**What**: Document how to use existing claude-flow memory skills
**Why**: User thinks these need building - they don't, just need activation
**How**: Reference existing commands

**Already available**:
- `npx claude-flow@alpha hooks memory --action store` - Store decisions
- `npx claude-flow@alpha hooks memory --action retrieve` - Recall context
- `npx claude-flow@alpha hooks memory --action search` - Search patterns

### Move 4: Activate Existing Learning Skills
**What**: Document how to use existing reasoningbank/agentdb skills
**Why**: ReasoningBank and AgentDB are already installed as skills
**How**: Reference skill invocations

**Already installed**:
- `/reasoningbank-intelligence` - Pattern learning
- `/reasoningbank-agentdb` - Trajectory tracking
- `/agentdb-memory-patterns` - Session memory

### Move 5: Update CLAUDE.md Session Protocol
**What**: Add `/session-start` to session protocol section
**Why**: Document the command-based workflow
**Where**: CLAUDE.md line 10-22 (SESSION MANAGEMENT PROTOCOL)

**Add**:
```markdown
**User-initiated session commands:**
- `/session-start <topic>` - Create new session
- `/session-closeout` - End current session (with HITL approval)
```

---

## What We're NOT Doing

- ❌ Not building automatic session detection
- ❌ Not creating new integrations
- ❌ Not rebuilding existing structure
- ❌ Not inventing new systems
- ❌ Not writing 50 documents

---

## Execution Checklist

- [ ] Move 1: Create session-start command file
- [ ] Move 2: Fix duration calculation in closeout.sh
- [ ] Move 3: Document memory activation (reference existing)
- [ ] Move 4: Document learning activation (reference existing)
- [ ] Move 5: Update CLAUDE.md with command references

**Total new files**: 1 (session-start.md command)
**Total edits**: 2 (closeout.sh, CLAUDE.md)
**Total documentation**: This file

---

## Testing

1. Test `/session-start` creates session structure
2. Test `/session-closeout` shows correct duration
3. Verify memory commands work (they should - stock claude-flow)
4. Verify learning skills work (they should - already installed)

---

## Success Criteria

- User can type `/session-start project-name`
- Session directory created with artifacts structure
- User can type `/session-closeout`
- Duration displays correctly
- HITL approval works
- Session archived to `.swarm/backups/`

Done.
