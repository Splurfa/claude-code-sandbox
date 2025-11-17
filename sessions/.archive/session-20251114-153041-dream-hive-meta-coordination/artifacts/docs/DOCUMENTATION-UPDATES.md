# Documentation Updates - Aligning with Reality

**Date:** 2025-11-14
**Purpose:** Correct CLAUDE.md and .swarm/README.md to match actual implementations

---

## Critical Corrections Needed

### 1. CLAUDE.md - Session Management Section

**Current (INCORRECT):**
```markdown
## 🚨 CRITICAL: AUTOMATIC SESSION MANAGEMENT

**ON FIRST MESSAGE IN NEW CHAT:**
1. Auto-generate session ID: `session-$(date +%Y%m%d-%H%M%S)-<topic>`
2. Auto-create: `sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}`
3. Auto-initialize metadata and session-summary.md
```

**Should Be (CORRECT):**
```markdown
## 📋 SESSION MANAGEMENT PROTOCOL

**MANUAL SESSION CREATION:**
Claude Code should create a session at the start of each new chat:

1. Generate session ID: `session-$(date +%Y%m%d-%H%M%S)-<topic>`
2. Create directory structure:
   ```bash
   mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}
   ```
3. Initialize metadata.json and session-summary.md
4. Run pre-task hook:
   ```bash
   npx claude-flow@alpha hooks pre-task --description "<task>" --task-id "$SESSION_ID"
   ```

**Note:** This is a MANUAL process currently. Auto-init script planned but not yet implemented.
```

---

### 2. CLAUDE.md - Hooks Section

**Current (INCORRECT):**
```markdown
**Why this matters:**
- Hooks fire automatically during agent work
- Memory accumulates across sessions
- Coordination happens properly
```

**Should Be (CORRECT):**
```markdown
**Hook Usage:**
- Hooks are available via CLI: `npx claude-flow@alpha hooks <command>`
- Memory persists in `.swarm/memory.db` (stock schema)
- Coordination enabled through manual hook calls

**Available Hooks:**
```bash
# Pre-task hook
npx claude-flow@alpha hooks pre-task --description "Build API"

# Post-task hook
npx claude-flow@alpha hooks post-task --task-id "task-1"

# Memory operations
npx claude-flow@alpha hooks memory --action store --key "test" --value "data"
npx claude-flow@alpha hooks memory --action retrieve --key "test"

# Session closeout
npx claude-flow@alpha hooks session-end --export-metrics true
```

**Checkpoint Automation:**
Git checkpoints can be created via bash script:
```bash
bash .claude/helpers/standard-checkpoint-hooks.sh post-edit '{"file_path":"file.js"}'
bash .claude/helpers/standard-checkpoint-hooks.sh session-end
```
```

---

### 3. CLAUDE.md - Remove AgentDB/ReasoningBank Claims

**Current (INCORRECT):**
```markdown
- AgentDB: Installed at `.agentdb/reasoningbank.db`
- ReasoningBank: Learning loop via `.claude/reasoningbank/learning-loop.sh`
```

**Should Be (CORRECT):**
```markdown
**Future Enhancements (Planned):**
- AgentDB vector database for semantic search
- ReasoningBank learning pipeline for pattern recognition
- Automated hook firing during agent operations

**Current Status:** These features are planned but not yet implemented. The workspace currently uses:
- Stock claude-flow hooks (manual CLI)
- Stock memory.db schema (SQLite)
- Git checkpoint hooks (bash script)
```

---

### 4. .swarm/README.md - Fix Memory Table References

**Current (INCORRECT):**
```bash
# Store information
npx claude-flow@alpha hooks memory --action store \
  --key "project/auth-pattern" \
  --value "JWT with refresh tokens"
```

**Should Be (CORRECT):**
```bash
# Store information (saves to memory_entries table)
npx claude-flow@alpha hooks memory --action store \
  --key "project/auth-pattern" \
  --value "JWT with refresh tokens" \
  --namespace "project"

# Retrieve information
npx claude-flow@alpha hooks memory --action retrieve \
  --key "project/auth-pattern" \
  --namespace "project"

# Search memory
npx claude-flow@alpha hooks memory --action search \
  --pattern "auth" \
  --namespace "project"
```

**Schema Note:**
```sql
-- Actual table name is memory_entries, not memory
CREATE TABLE memory_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  namespace TEXT NOT NULL DEFAULT 'default',
  metadata TEXT,
  created_at INTEGER,
  updated_at INTEGER,
  accessed_at INTEGER,
  access_count INTEGER DEFAULT 0,
  ttl INTEGER,
  expires_at INTEGER,
  UNIQUE(key, namespace)
);
```

---

### 5. CLAUDE.md - Add "What Actually Works" Section

**NEW SECTION TO ADD:**

```markdown
---

## ✅ What Actually Works Right Now

### Stock Tools Available:

**1. Memory Storage (Claude-Flow)**
```bash
# Store data
npx claude-flow@alpha hooks memory --action store \
  --key "decision/auth" \
  --value "Using JWT with refresh tokens" \
  --namespace "project"

# Retrieve data
npx claude-flow@alpha hooks memory --action retrieve \
  --key "decision/auth" \
  --namespace "project"

# Search memory
npx claude-flow@alpha hooks memory --action search \
  --pattern "auth" \
  --namespace "project"
```

**Storage:** `.swarm/memory.db` (SQLite)
**Schema:** Stock claude-flow (memory_entries table)

---

**2. Git Checkpointing (Bash Script)**
```bash
# Checkpoint after editing a file
bash .claude/helpers/standard-checkpoint-hooks.sh post-edit \
  '{"file_path":"src/server.js"}'

# Checkpoint at end of session
bash .claude/helpers/standard-checkpoint-hooks.sh session-end
```

**Features:**
- Automatic git commits with metadata
- Tagged checkpoints for rollback
- Session summaries with checkpoint history

---

**3. Task Hooks (Claude-Flow)**
```bash
# Before starting work
npx claude-flow@alpha hooks pre-task \
  --description "Build REST API" \
  --task-id "api-dev-1"

# After completing work
npx claude-flow@alpha hooks post-task \
  --task-id "api-dev-1" \
  --status "completed"

# Session closeout with metrics
npx claude-flow@alpha hooks session-end \
  --export-metrics true \
  --session-id "session-20251114-150000-api-dev"
```

**Purpose:** Track task execution, gather metrics, enable learning

---

**4. Session Backups**
```bash
# Automatically created by session-end hook
# Location: .swarm/backups/session-YYYYMMDD-HHMMSS-topic.json

# Manual backup
npx claude-flow@alpha hooks session-end \
  --export-metrics true \
  --backup-path ".swarm/backups/"
```

**Contents:** Session metadata, metrics, memory snapshot, file list

---

### What Does NOT Work Yet (Planned):

❌ Automatic hook firing during agent operations
❌ AgentDB vector database
❌ ReasoningBank learning pipeline
❌ Auto-session initialization on first message
❌ Journal hook CLI

**These are planned enhancements. Current workflow uses manual CLI commands.**

---
```

---

### 6. Remove Misleading "Infrastructure Learning" Claims

**Current (INCORRECT):**
```markdown
## WORKSPACE LEARNING INFRASTRUCTURE

...automated learning from trajectories...
...hooks feed AgentDB continuously...
```

**Should Be (CORRECT):**
```markdown
## WORKSPACE MEMORY INFRASTRUCTURE

**Current Capabilities:**
- Structured memory storage via SQLite (`.swarm/memory.db`)
- Git-based checkpoint system (`.claude/helpers/standard-checkpoint-hooks.sh`)
- Manual hook CLI for task tracking (`npx claude-flow@alpha hooks`)
- Session backup/restore (`.swarm/backups/`)

**Planned Capabilities:**
- Automated learning from agent trajectories (ReasoningBank)
- Semantic vector search (AgentDB)
- Auto-firing hooks during operations
- Captain's Log journal integration

**Current Status:** Manual CLI-based workflow with stock tools.
```

---

## Summary of Changes

| Section | Current Status | Correction Needed |
|---------|---------------|-------------------|
| Session auto-init | Claims automatic | Change to manual process |
| Hook automation | Claims auto-fire | Clarify manual CLI only |
| AgentDB | Claims installed | Remove or mark as planned |
| ReasoningBank | Claims working | Remove or mark as planned |
| Memory table name | Uses `memory` | Fix to `memory_entries` |
| Learning pipeline | Claims continuous | Clarify manual only |

---

## Files to Update

1. **CLAUDE.md** (project root)
   - Session management section
   - Hooks section
   - Remove AgentDB/ReasoningBank claims
   - Add "What Actually Works" section
   - Fix memory table references

2. **.swarm/README.md**
   - Fix memory table name (memory → memory_entries)
   - Update CLI examples with correct namespace usage
   - Remove claims about automated feeding

3. **Any agent docs referencing these features**
   - Grep for "agentdb", "reasoningbank", "auto-hook"
   - Update to reflect manual CLI workflow

---

## Verification Commands

After updates, test that documentation matches reality:

```bash
# Test 1: Memory storage works
npx claude-flow@alpha hooks memory --action store --key "test" --value "data"
npx claude-flow@alpha hooks memory --action retrieve --key "test"

# Test 2: Checkpoint hooks work
bash .claude/helpers/standard-checkpoint-hooks.sh session-end

# Test 3: AgentDB NOT installed
npm list agentdb  # Should fail

# Test 4: No auto-hooks directory
ls .claude/hooks/  # Should NOT contain activate.sh or auto-hooks.js

# Test 5: Memory table is memory_entries
sqlite3 .swarm/memory.db "SELECT name FROM sqlite_master WHERE type='table';"
# Should show: memory_entries (not "memory")
```

---

## Next Steps

1. Apply all corrections to CLAUDE.md
2. Update .swarm/README.md
3. Remove misleading claims from agent docs
4. Add "What Actually Works" section
5. Test all documented commands
6. Commit with message: "docs: Align CLAUDE.md with actual implementation status"

**Goal:** 100% documentation accuracy. Only claim what exists and works.
