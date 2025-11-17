# Claude-Flow+ Workspace Guide

**Custom Extensions for Claude-Flow v2.7.35**
**For Architecture Overview, See:** [WORKSPACE-ARCHITECTURE.md](WORKSPACE-ARCHITECTURE.md)

This guide documents the custom extensions added to stock claude-flow for enhanced session management, learning, and artifact organization.

---

## Table of Contents

1. [Session Management Protocol](#session-management-protocol)
2. [File Routing System](#file-routing-system)
3. [Captain's Log Journaling](#captains-log-journaling)
4. [ReasoningBank Learning Pipeline](#reasoningbank-learning-pipeline)
5. [AgentDB Vector Integration](#agentdb-vector-integration)
6. [Git Checkpoint System](#git-checkpoint-system)
7. [Hooks Automation](#hooks-automation)

---

## Session Management Protocol

### Overview

Custom session organization system that creates structured directories for each chat session, ensuring all artifacts are organized and traceable.

### Core Concept

**ONE SESSION = ONE CHAT THREAD**
- Not per task
- Not per agent
- One chat conversation = One session directory

### Session Lifecycle

```
New Chat → Auto-create session-YYYYMMDD-HHMMSS-<topic>/
         → ALL work goes to: sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}/
         → Sub-tasks use subdirectories within artifacts/ (NOT new sessions)
         → Chat ends → Session closeout → Archive to .swarm/backups/
```

### Directory Structure

```
sessions/session-20251113-150000-api-development/
├── metadata.json                   # Session metadata
├── session-summary.md              # Narrative summary
└── artifacts/                      # All session outputs
    ├── code/                       # Source code files
    ├── tests/                      # Test files
    ├── docs/                       # Documentation
    ├── scripts/                    # Utility scripts
    └── notes/                      # Working notes
        ├── backend-decisions.md    # Sub-task notes
        ├── database-schema.md
        └── auth-flow.md
```

### Automatic Initialization

**On First Message of New Chat:**

```bash
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-<inferred-topic>"

# Create structure
mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}

# Initialize metadata
cat > "sessions/$SESSION_ID/metadata.json" <<EOF
{
  "session_id": "$SESSION_ID",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "active"
}
EOF

# Initialize summary
cat > "sessions/$SESSION_ID/session-summary.md" <<EOF
# Session: $SESSION_ID
**Started:** $(date)
**Status:** Active
## Progress
- Session initialized
EOF

# Run pre-task hook
npx claude-flow@alpha hooks pre-task --description "<first task>" --task-id "$SESSION_ID"
```

### Manual Session Creation

```bash
# Using auto-init script
bash .claude/session/auto-init.sh "my-project-topic"

# Or with detection script
bash .claude/session/detect-and-init.sh
```

### Session Closeout

**When user says "Done" or "Close Session":**

1. **Collect** - Generate summary of all work
2. **Review** - User reviews and approves summary (HITL)
3. **Archive** - Run hooks to backup session state
4. **Promote** (Optional) - Move artifacts to project docs

```bash
# Manual closeout
npx claude-flow@alpha hooks session-end --generate-summary true
```

**Closeout creates:**
- `.swarm/backups/session-YYYYMMDD-HHMMSS-topic.json`
- Frozen session directory
- Captain's Log entry (if approved)
- Memory storage of key decisions

### Agent Integration

When spawning agents via Claude Code Task tool, include session path:

```javascript
Task("Backend Developer",
     "Build REST API. Save to sessions/$SESSION_ID/artifacts/code/.",
     "backend-dev")
```

---

## File Routing System

### Purpose

Enforces consistent artifact organization by routing files to appropriate session directories based on type.

### Routing Rules

| File Type | Destination | Example |
|-----------|-------------|---------|
| Source code | `sessions/$SESSION_ID/artifacts/code/` | `server.js`, `App.jsx` |
| Tests | `sessions/$SESSION_ID/artifacts/tests/` | `server.test.js`, `integration.test.js` |
| Documentation | `sessions/$SESSION_ID/artifacts/docs/` | `API.md`, `README.md` |
| Scripts | `sessions/$SESSION_ID/artifacts/scripts/` | `deploy.sh`, `build.sh` |
| Notes | `sessions/$SESSION_ID/artifacts/notes/` | `ideas.md`, `decisions.md` |

### Exceptions

**Only edit existing project files in their original locations:**
- `package.json`
- `CLAUDE.md`
- `tsconfig.json`
- Root configuration files

**Never write to root directories:**
- ❌ `tests/` (use `sessions/.../artifacts/tests/`)
- ❌ `docs/` (use `sessions/.../artifacts/docs/`)
- ❌ `scripts/` (use `sessions/.../artifacts/scripts/`)

### Implementation

File routing is enforced via:
1. `.claude/skills/file-routing/` skill (AI guidance)
2. CLAUDE.md instructions (explicit rules)
3. Session initialization scripts (automatic structure)

### Verification

Check if you're in an active session:

```bash
# Check session ID
echo $SESSION_ID

# Verify session exists
ls -la "sessions/$SESSION_ID/artifacts/"

# If no session, create one
bash .claude/session/auto-init.sh "topic-name"
```

---

## Captain's Log Journaling

### Overview

Human-readable daily journal for capturing decisions, insights, and blockers in narrative form.

### Location

```
sessions/captains-log/YYYY-MM-DD.md
```

### Format

Each daily log contains timestamped entries:

```markdown
# Captain's Log - 2025-11-15

## 09:30 - Session: API Development
**Decision:** Using JWT with refresh tokens for authentication
**Rationale:** Better security than session cookies, mobile-friendly
**Impact:** Need to implement token rotation

## 14:45 - Session: Database Schema
**Blocker:** PostgreSQL version mismatch
**Solution:** Updated docker-compose to use postgres:15
**Learning:** Always pin versions in production configs
```

### Usage

**Via script:**
```bash
bash .claude/hooks/journal.sh "Entry text" "category"
```

**Manual entry:**
```bash
# Append to today's log
cat >> sessions/captains-log/$(date +%Y-%m-%d).md <<EOF

## $(date +%H:%M) - My Entry Title
**Context:** What was happening
**Action:** What I did
**Outcome:** What resulted
EOF
```

### Integration with Session Closeout

During HITL review, approved session summaries are copied to Captain's Log for permanent record.

### Stock Alignment

- Stock claude-flow provides `journal` hook concept
- Custom bash script implements the functionality
- 100% stock tools (bash + cat + date)

---

## ReasoningBank Learning Pipeline

### Overview

Learning system that collects agent work trajectories, judges their quality, and distills patterns for future use.

### Status

✅ **Deployed** - Pipeline ready, 0 trajectories collected (awaiting data)

### Architecture

```
Work Session
     ↓
1. Trajectory Collector - Captures agent actions
     ↓
2. Verdict Judge - Evaluates success/failure
     ↓
3. Memory Distiller - Extracts patterns
     ↓
Pattern Library (`.swarm/memory.db`)
```

### Components

**1. Trajectory Collector** (`.claude/reasoningbank/trajectory-collector.js`)
- Captures agent work sessions
- Records actions, decisions, outcomes
- Stores in `task_trajectories` table

**2. Verdict Judge** (`.claude/reasoningbank/verdict-judge.js`)
- Evaluates trajectory quality
- Marks success/failure
- Calculates confidence scores

**3. Memory Distiller** (`.claude/reasoningbank/memory-distiller.js`)
- Extracts reusable patterns
- Updates pattern library
- Links patterns to use cases

### Database Schema

Stock claude-flow provides the schema in `.swarm/memory.db`:

```sql
CREATE TABLE task_trajectories (
  id INTEGER PRIMARY KEY,
  session_id TEXT,
  task_description TEXT,
  actions_taken TEXT,  -- JSON array
  outcome TEXT,
  verdict TEXT,        -- 'success' | 'failure' | 'partial'
  confidence REAL,     -- 0.0 to 1.0
  created_at TIMESTAMP
);
```

### Usage

**Collect trajectory:**
```bash
bash .claude/reasoningbank/learning-loop-cli.sh collect \
  --session "session-id" \
  --task "Build REST API" \
  --outcome "success"
```

**Judge trajectory:**
```bash
bash .claude/reasoningbank/learning-loop-cli.sh judge \
  --trajectory-id 123
```

**Query learnings:**
```bash
bash .claude/reasoningbank/query-learnings.sh stats
bash .claude/reasoningbank/query-learnings.sh search "authentication"
```

### Current Status

```bash
sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM task_trajectories;"
# Returns: 0 (no trajectories collected yet)
```

**Why inactive:** Pipeline requires active agent work to generate trajectories. Requires manual activation or integration into agent workflows.

### Stock Alignment

- Stock: Table schema provided
- Custom: Pipeline scripts (1,181 lines)
- Tools: 97% stock (bash, sqlite3, jq)

---

## AgentDB Vector Integration

### Overview

Vector database for semantic search and learning, enabling AI agents to find similar past experiences.

### Status

✅ **Initialized** - Database created, 0 episodes (awaiting data)

### Installation

```bash
# AgentDB is NOT in package.json, use via npx
npx agentdb@latest init .agentdb/reasoningbank.db --dimensions 1536
```

### Database Location

```
.agentdb/
└── reasoningbank.db        # 385KB, 1536 dimensions (OpenAI-compatible)
```

### Integration Scripts

**AgentDB Wrapper** (`.claude/integrations/agentdb-wrapper.js`)
- Thin CLI wrapper for agentdb
- Handles connection pooling
- Error handling and logging

**Memory Bridge** (`.claude/integrations/memory-agentdb-bridge.js`)
- Syncs `.swarm/memory.db` → AgentDB
- Converts text entries to embeddings
- Enables semantic search across memory

### Usage

**Add episode:**
```bash
npx agentdb@latest add .agentdb/reasoningbank.db \
  --text "Successfully implemented JWT authentication with refresh tokens" \
  --metadata '{"session": "session-123", "outcome": "success"}'
```

**Search similar:**
```bash
npx agentdb@latest search .agentdb/reasoningbank.db \
  --query "authentication patterns" \
  --limit 5
```

**Check stats:**
```bash
npx agentdb@latest stats .agentdb/reasoningbank.db
# Episodes: 0, Embeddings: 0, Size: 385KB
```

### Current Status

**Why inactive:** Sync bridge exists but requires manual activation. No episodes synced from memory yet.

**To activate:**
```bash
# Run sync script
node .claude/integrations/memory-agentdb-bridge.js sync
```

### Stock Alignment

- Stock: AgentDB is sanctioned optional addition
- Custom: Sync bridge scripts (thin wrappers)
- Tools: 95% stock (agentdb CLI)

---

## Git Checkpoint System

### Overview

Automatic git commits with metadata on every file edit, creating rollback points and maintaining history.

### Status

✅ **Production-Ready** - Active on every file operation

### Implementation

**File:** `.claude/helpers/standard-checkpoint-hooks.sh` (179 lines, pure bash)

### Features

1. **Automatic commits** on file edits
2. **Tagged checkpoints** for rollback
3. **Metadata tracking** (session, agent, timestamp)
4. **Session summaries** with commit history

### Usage

**Auto-fire on edits:**
```bash
# Integrated with hooks
bash .claude/helpers/standard-checkpoint-hooks.sh post-edit \
  '{"file_path":"src/server.js"}'
```

**Session end checkpoint:**
```bash
bash .claude/helpers/standard-checkpoint-hooks.sh session-end
```

**View checkpoints:**
```bash
git tag --list 'checkpoint-*'
git log --oneline --decorate | grep checkpoint
```

**Rollback to checkpoint:**
```bash
git checkout checkpoint-session-20251113-150000-1
```

### Commit Message Format

```
[Checkpoint] Edit: src/server.js

Session: session-20251113-150000-api-dev
Agent: backend-developer
Timestamp: 2025-11-15T10:30:00Z
```

### Integration

Hooks into:
- Post-edit (after file write)
- Post-task (after task completion)
- Session-end (final checkpoint)

### Stock Alignment

- Stock: NO equivalent in claude-flow
- Custom: 100% custom (179 lines bash)
- Tools: 100% stock (git, bash)

---

## Hooks Automation

### Overview

Optional auto-fire wrapper that triggers stock claude-flow hooks during operations.

### Files

- `.claude/hooks/auto-hooks.js` - Main wrapper (123 lines)
- `.claude/hooks/journal.sh` - Captain's Log script (84 lines)

### Manual Hooks (Stock, Always Available)

```bash
# Pre-task hook
npx claude-flow@alpha hooks pre-task --description "Build API" --task-id "task-1"

# Post-task hook
npx claude-flow@alpha hooks post-task --task-id "task-1" --status "completed"

# Memory operations
npx claude-flow@alpha hooks memory --action store --key "decision" --value "data"

# Session closeout
npx claude-flow@alpha hooks session-end --export-metrics true
```

### Auto-Hooks (Optional)

**Enable auto-fire:**
```javascript
const { enableAutoHooks } = require('./.claude/hooks/auto-hooks.js');
enableAutoHooks();
```

**What auto-fires:**
- Pre-task on task start
- Post-task on task completion
- Post-edit on file write
- Memory store on key decisions

### How It Works

```javascript
// Wrapper intercepts operations
Write("file.js") → Triggers auto-hook → npx claude-flow hooks post-edit
Task("agent")    → Triggers auto-hook → npx claude-flow hooks pre-task
```

### Stock Alignment

- Stock: 97% - ALL execution via `npx claude-flow@alpha hooks`
- Custom: 3% - Thin wrapper for auto-fire
- Tools: 100% stock claude-flow CLI

### Configuration

Settings in `.claude/settings.json`:

```json
{
  "hooks": {
    "enabled": true,
    "auto_fire": false,  // Set true to enable auto-hooks
    "stock_first": true
  }
}
```

---

## Workspace Principles

All custom features follow these principles:

### 1. Time-Neutral
- On-demand via CLI commands
- No scheduled tasks or timers
- Work when ready, not on a schedule

### 2. Scale-Agnostic
- Works with 10 items or 10,000
- Graceful degradation
- No hard limits or architectural rewrites

### 3. Stock-First
- 95%+ stock claude-flow infrastructure
- 5% thin wrappers for workflow
- No custom frameworks or reinvention

---

## Quick Reference

### Check What's Active

```bash
# Session ID
echo $SESSION_ID

# Memory entries
sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM memory_entries;"

# AgentDB episodes
npx agentdb@latest stats .agentdb/reasoningbank.db

# ReasoningBank trajectories
sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM task_trajectories;"

# Captain's Log entries
ls -la sessions/captains-log/

# Session backups
ls -la .swarm/backups/
```

### Verify Stock Compliance

```bash
# Hooks version
npx claude-flow@alpha hooks --version

# Memory test
npx claude-flow@alpha hooks memory --action store --key "test" --value "data"
npx claude-flow@alpha hooks memory --action retrieve --key "test"

# Session scripts exist
ls -la .claude/session/*.sh
```

---

## Support & Maintenance

### When Stock Claude-Flow Updates

**Auto-updates:**
- ✅ CLI commands
- ✅ Memory schema
- ✅ Hooks interface

**May break:**
- ⚠️ Custom scripts if hook signatures change
- ⚠️ Auto-hooks if stock behavior changes

**Update process:**
```bash
# 1. Update stock
npm update -g claude-flow@alpha

# 2. Test stock commands
npx claude-flow@alpha hooks memory --action search --pattern "test"

# 3. Test custom integrations
bash .claude/reasoningbank/learning-loop-cli.sh stats
```

### Troubleshooting

**Session not created:**
```bash
bash .claude/session/auto-init.sh "topic"
```

**AgentDB not initialized:**
```bash
npx agentdb@latest init .agentdb/reasoningbank.db --dimensions 1536
```

**Hooks not firing:**
```bash
# Test manually
npx claude-flow@alpha hooks pre-task --description "test"
```

---

## See Also

- [WORKSPACE-ARCHITECTURE.md](WORKSPACE-ARCHITECTURE.md) - Architecture overview and compliance analysis
- [CLAUDE.md](CLAUDE.md) - Main workspace configuration
- [.claude/DEPLOYMENT-STATUS.md](.claude/DEPLOYMENT-STATUS.md) - Deployment status and readiness
- [Stock claude-flow docs](https://github.com/ruvnet/claude-flow)

---

**Last Updated:** 2025-11-15
**Claude-Flow Version:** v2.7.35
**Stock-First Score:** 97.5%
