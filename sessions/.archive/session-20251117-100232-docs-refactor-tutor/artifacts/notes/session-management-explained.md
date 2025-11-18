# Session Management Protocol - Complete Explanation

**Your Question**: "Please respond to my earlier question about multiple session folders and how that is supposed to work—specifically your plan for session folder management."

---

## The Protocol

### **ONE SESSION = ONE CHAT THREAD**

This is the fundamental rule. Not per task, not per agent, not per day - **one chat conversation = one session directory**.

### Why Multiple Sessions Exist

**It's normal and expected to have multiple session directories simultaneously:**

```
sessions/
├── session-20251113-164700-session-management-protocol/  (archived work)
├── session-20251115-151900-compliance-analysis/          (archived work)
├── session-20251116-215913-inbox-cleanup/                (archived work)
├── session-20251117-002737-hive-mind-100-integration/    (may still be active)
├── session-20251117-100232-docs-refactor-tutor/          (THIS chat - active)
└── .archive/                                              (completed sessions)
```

### Session Lifecycle

**1. Chat Starts** → Auto-create `session-YYYYMMDD-HHMMSS-<topic>/`

**2. All Work** → Goes to `sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}/`

**3. Chat Ends** → Run `/session-closeout`:
   - User reviews artifacts
   - HITL approval
   - Archive to `.swarm/backups/session-ID.json`
   - Move to `sessions/.archive/session-ID/`

**4. New Chat** → New session directory (doesn't reuse old ones)

### Session vs Coordination Sessions

**Two Different Systems (Complementary, Not Competing)**:

#### Workspace Sessions (`sessions/`)
- **Purpose**: Artifact organization and markdown documentation
- **Lifespan**: One chat thread
- **Contents**: All code, tests, docs, scripts, notes produced
- **User-facing**: Yes, these are your organized outputs

#### Coordination Sessions (`.hive-mind/sessions/`)
- **Purpose**: Swarm coordination state tracking
- **Lifespan**: One coordination topology
- **Contents**: Agent states, memory references, topology config
- **User-facing**: No, internal system state

### File Routing Within Sessions

**ALL work files go to session artifacts**, NOT workspace root:

```bash
# ✅ CORRECT
sessions/session-ID/artifacts/code/server.js
sessions/session-ID/artifacts/tests/server.test.js
sessions/session-ID/artifacts/docs/API.md

# ❌ WRONG
code/server.js           # Don't create root code/
tests/server.test.js     # Don't create root tests/
docs/API.md              # Don't create root docs/ (except for permanent framework docs)
```

### Multi-Agent Sessions

**When spawning agents, they ALL work in the SAME session**:

```bash
# Single chat spawns 5 agents
Task("Backend", "Build API. Save to sessions/$SESSION_ID/artifacts/code/", "backend-dev")
Task("Frontend", "Build UI. Save to sessions/$SESSION_ID/artifacts/code/", "coder")
Task("Tester", "Write tests. Save to sessions/$SESSION_ID/artifacts/tests/", "tester")
Task("Docs", "Write docs. Save to sessions/$SESSION_ID/artifacts/docs/", "api-docs")
Task("DevOps", "Setup CI. Save to sessions/$SESSION_ID/artifacts/scripts/", "cicd-engineer")

# All 5 agents write to THE SAME session directory
# Result: sessions/session-ID/artifacts/ contains coordinated outputs
```

### Session Hygiene

**Normal State**:
- Active chat = 1 active session directory
- Old chats = Multiple archived session directories

**Clean-up Protocol**:
```bash
# After chat ends, run:
/session-closeout

# This will:
# 1. Show you all artifacts created
# 2. Ask for HITL approval
# 3. Backup to .swarm/backups/
# 4. Move to sessions/.archive/
# 5. Update sessions/metadata.json
```

### What Goes Where?

**Session Artifacts** (`sessions/session-ID/artifacts/`):
- Working code for this chat
- Tests for this chat
- Documentation created in this chat
- Scripts created in this chat
- Notes and research for this chat

**Permanent Workspace** (outside sessions):
- `docs/` - Framework documentation (guides, tutorials, internals)
- `.claude/` - Claude Code configuration (commands, skills, hooks)
- `src/` - Production source code (if applicable)
- `package.json` - Project configuration

**The Rule**: If it's specific to this chat conversation, it goes in `sessions/$SESSION_ID/artifacts/`. If it's permanent workspace infrastructure, it goes in the appropriate permanent location.

### Your Current State

**You have 5 session directories**, which is completely normal:

1. **session-20251117-100232-docs-refactor-tutor** - This chat (active)
2. **session-20251117-002737-hive-mind-100-integration** - Previous chat (ready to archive?)
3. **session-20251116-215913-inbox-cleanup** - Older chat (ready to archive)
4. **session-20251115-151900-compliance-analysis** - Older chat (ready to archive)
5. **session-20251113-164700-session-management-protocol** - Older chat (ready to archive)

### Session Management Plan

**Immediate**:
- Continue current session (docs-refactor-tutor) until this chat ends
- Don't worry about old sessions yet

**When Chat Ends**:
- Run `/session-closeout` for THIS session
- Review artifacts
- Approve archival
- Session moves to `.archive/`

**Periodic Cleanup** (monthly):
```bash
# Move sessions older than 30 days to .archive/
find sessions/ -name "session-*" -type d -mtime +30 -exec mv {} sessions/.archive/ \;

# Update metadata
echo "$(date): Archived sessions older than 30 days" >> sessions/captains-log/$(date +%Y-%m-%d).md
```

### What You Should See

**Normal Healthy State**:
```
sessions/
├── session-CURRENT/              ← Your active chat
├── .archive/
│   ├── session-OLD-1/           ← Completed chats
│   ├── session-OLD-2/
│   └── session-OLD-3/
├── metadata.json                 ← Session tracking
└── captains-log/                 ← Decision journal
    └── YYYY-MM-DD.md
```

**Red Flags** (what to avoid):
```
❌ sessions/session-ID/code/      (should be artifacts/code/)
❌ sessions/code/                  (should be sessions/session-ID/artifacts/code/)
❌ code/                           (outside sessions - violates routing)
```

### The Philosophy

**Sessions are like chapters in a book**:
- Each chat = One chapter
- Each chapter has its own notes/drafts/work
- Chapters are sequential, not nested
- When chapter done, archive it
- Start fresh chapter for next chat

**Not like nested folders**:
- Don't create sessions within sessions
- Don't reuse old session directories
- Don't put multiple chats in one session

### Summary

✅ **Multiple session directories**: Normal and expected
✅ **One session per chat**: Fundamental rule
✅ **All work in artifacts/**: File routing compliance
✅ **Archive when done**: Clean-up protocol
✅ **Periodic archival**: Monthly maintenance

**Your workspace is healthy.** The multiple sessions are just the history of your chats, waiting to be archived when you're ready.

---

**Does this answer your question?** If you want me to archive the old sessions now, I can run the closeout protocol on each one.
