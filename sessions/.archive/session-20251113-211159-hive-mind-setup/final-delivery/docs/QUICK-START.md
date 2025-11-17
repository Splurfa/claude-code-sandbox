# Quick Start Guide
## Complete Hive Mind System in 5 Minutes

Welcome to the complete Claude Flow Hive Mind orchestration system. This guide will get you up and running in under 5 minutes.

## What You're Getting

A complete, production-ready hive mind system with:

- ✅ **Automatic session initialization** - No manual setup required
- ✅ **Always-on memory coordination** - Cross-session context and learning
- ✅ **Agent templates with embedded hooks** - Coordination built-in
- ✅ **Captain's Log auto-journaling** - Decisions captured automatically
- ✅ **3 consensus algorithms** - Multi-agent decision coordination
- ✅ **Session closeout workflow** - HITL review and archival
- ✅ **AgentDB integration** - 150x faster vector search
- ✅ **Pattern recognition** - 72 ReasoningBank patterns
- ✅ **Cross-session intelligence** - Learn from all past work

**Total System:** 2,856 lines of production-ready code across 3 phases.

## Installation

### Prerequisites

- Node.js 16+ or 18+
- npm or yarn
- Claude Code CLI

### Step 1: Install Claude Flow

```bash
npm install -g claude-flow@alpha
```

### Step 2: Initialize Hive Mind

```bash
npx claude-flow hive-mind init
```

This creates:
- `.swarm/memory.db` - Cross-session memory (SQLite)
- `.hive-mind/hive.db` - Swarm coordination
- `sessions/captains-log/` - Decision journal
- `.swarm/backups/` - Session archives

### Step 3: Verify Installation

```bash
npx claude-flow hive-mind status
```

You should see:
```
✅ Hive Mind Status: Operational
✅ Memory Database: Active
✅ Captain's Log: Ready
✅ AgentDB: Available
✅ Hooks: Configured
```

**That's it!** The system is ready to use.

## Your First Session

### Opening a New Chat

When you open Claude Code and start a new chat, **everything happens automatically**:

1. Session auto-detects from your first message
2. Session structure created: `sessions/session-YYYYMMDD-HHMMSS-<topic>/`
3. Hooks activated for memory coordination
4. Captain's Log ready to capture decisions

**You don't do anything.** It just works.

### Example: Building a REST API

```
You: Help me build a REST API for a task management app

Claude: I'll coordinate a development hive to build your REST API...
```

Behind the scenes:
- Session created: `session-20251114-103045-task-api`
- Queen coordinator spawned
- Worker agents assigned (backend dev, database architect, tester)
- All work goes to: `sessions/session-20251114-103045-task-api/artifacts/`
- Captain's Log captures all decisions
- Memory accumulates for future sessions
- Patterns learned automatically

### Spawning Agents with Coordination

Use the wizard for complex coordination:

```bash
/hive-mind:wizard
```

Or spawn individual agents with embedded hooks:

```javascript
Task("Backend Developer",
  "Build REST API with Express. Save to sessions/$SESSION_ID/artifacts/code/. Use hooks for coordination.",
  "backend-dev"
)
```

The agent prompt automatically includes:
- Pre-task hook (memory setup)
- Memory coordination during work
- Post-task hook (capture results)

### Session Closeout

When you're done with a session:

```
You: This session is complete, let's close it out

Claude: I'll initiate the session closeout workflow...
```

Closeout process:
1. **Summary generated** - All work, decisions, learnings
2. **HITL review** - You approve the summary
3. **Archive created** - Backup to `.swarm/backups/session-TIMESTAMP.json`
4. **Memory updated** - Patterns stored for future use
5. **Session frozen** - Metadata marked as closed

## Key Commands

### Session Management

```bash
# Check current session
npx claude-flow hive-mind status

# List all sessions
npx claude-flow hive-mind sessions

# Resume paused session
npx claude-flow hive-mind resume <session-id>

# Close current session
npx claude-flow hive-mind closeout
```

### Memory Operations

```bash
# Store in memory
npx claude-flow@alpha hooks memory:store --key "project/decision" --value "data"

# Retrieve from memory
npx claude-flow@alpha hooks memory:retrieve --key "project/decision"

# Search memory
npx claude-flow@alpha hooks memory:search --pattern "api*"
```

### Captain's Log

```bash
# Log a decision
npx claude-flow@alpha hooks journal --entry "Chose PostgreSQL" --category "decision"

# View today's log
cat sessions/captains-log/$(date +%Y-%m-%d).md

# Search all logs
grep -r "PostgreSQL" sessions/captains-log/
```

### Consensus

When multiple agents need to make a decision:

```javascript
// Majority consensus (simple vote)
const decision = await consensus.build('majority', options, agents);

// Weighted consensus (queen has 3x weight)
const decision = await consensus.build('weighted', options, agents);

// Byzantine consensus (requires 2/3 agreement)
const decision = await consensus.build('byzantine', options, agents);
```

## File Organization

All session work goes to session artifacts:

```
sessions/
├── session-YYYYMMDD-HHMMSS-<topic>/
│   ├── metadata.json
│   ├── session-summary.md
│   └── artifacts/
│       ├── code/          ← Source files
│       ├── tests/         ← Test files
│       ├── docs/          ← Documentation
│       ├── scripts/       ← Utility scripts
│       └── notes/         ← Working notes
│
├── captains-log/
│   ├── 2025-11-14.md      ← Daily decision journal
│   └── 2025-11-15.md
│
└── .swarm/
    ├── memory.db          ← Cross-session memory
    └── backups/           ← Session archives
        └── session-20251114-103045.json
```

**Never write to root directories** - everything goes to session artifacts.

## Understanding the Three Databases

The system uses three complementary databases:

### 1. `.swarm/memory.db` (SQLite, ~12 MB)
- **Purpose:** Cross-session memory and coordination
- **Contains:** Agent decisions, patterns, coordination state
- **When:** Active during all work, queried across sessions
- **Scale:** Works well for 0-10K entries

### 2. `.hive-mind/hive.db` (SQLite, ~127 KB)
- **Purpose:** Multi-agent swarm coordination
- **Contains:** Agent assignments, consensus records, task state
- **When:** Active during multi-agent coordination
- **Scale:** Lightweight, always fast

### 3. AgentDB (Vector database, cloud/local)
- **Purpose:** Large-scale vector search (100K+ entries)
- **Contains:** Semantic embeddings, pattern vectors
- **When:** Automatically activated when data exceeds 10K entries
- **Scale:** Designed for millions of vectors

**Automatic routing** transparently chooses the right database based on scale. You never have to think about it.

## The Three Principles

Everything follows these core principles:

### 1. Time-Neutral
- No temporal language ("today", "yesterday", "week 1")
- All timestamps are ISO format
- Operations are on-demand (no schedules)
- Past work is referenced by session ID, not time

### 2. Scale-Agnostic
- Works identically for 10 entries or 10 million
- Both SQLite and AgentDB deployed immediately
- Automatic routing based on scale
- No "upgrade paths" - everything ready now

### 3. Stock-First
- 95% stock Claude Flow infrastructure
- 5% thin wrappers for workflow
- No custom frameworks
- Leverage battle-tested tools

## What Happens Automatically

You don't need to manage any of this manually:

✅ **Session initialization** - Detects new chat, creates structure
✅ **Hook activation** - Fires during all agent work
✅ **Memory coordination** - Stores context automatically
✅ **Captain's Log** - Captures decisions as they happen
✅ **Pattern learning** - Learns from corrections
✅ **Database routing** - Chooses SQLite or AgentDB automatically
✅ **Cross-session queries** - Finds relevant past work
✅ **Session archival** - Backs up on closeout

The system is designed to **work in the background** while you focus on your actual work.

## Common Workflows

### Research Project

```
1. Open Claude Code, start chat
2. "Research GraphQL vs REST for my project"
3. Session auto-creates, agents coordinate
4. Research delivered to artifacts/docs/
5. Decisions captured in Captain's Log
6. Patterns learned for future projects
7. Close session when done
```

### Code Implementation

```
1. Open Claude Code, start chat
2. "Build authentication system with JWT"
3. Session auto-creates with code/ tests/ structure
4. Agents implement with coordination hooks
5. Code delivered to artifacts/code/
6. Tests delivered to artifacts/tests/
7. Decisions logged automatically
8. Close session, everything archived
```

### Multi-Agent Coordination

```
1. Open Claude Code, run /hive-mind:wizard
2. Describe complex objective
3. Wizard spawns appropriate topology
4. Queen coordinates multiple workers
5. Consensus for critical decisions
6. All work tracked in memory
7. Captain's Log captures strategy
8. Close session with full archive
```

## Troubleshooting

### Session not auto-creating?

Check that hooks are enabled:
```bash
npx claude-flow@alpha hooks status
```

If not enabled:
```bash
npx claude-flow hive-mind init --force
```

### Memory not persisting?

Verify database exists:
```bash
ls -la .swarm/memory.db
```

If missing:
```bash
npx claude-flow hive-mind init
```

### Captain's Log empty?

Check directory exists:
```bash
ls -la sessions/captains-log/
```

Create if needed:
```bash
mkdir -p sessions/captains-log
```

### AgentDB not activating?

Verify installation:
```bash
npx ruv-swarm --version
```

Install if needed:
```bash
npm install -g ruv-swarm
```

## Next Steps

Now that you're set up:

1. **Read the [Architecture Guide](./ARCHITECTURE.md)** to understand how everything works together
2. **Read the [User Guide](./USER-GUIDE.md)** for detailed workflows and usage patterns
3. **Read the [Developer Guide](./DEVELOPER-GUIDE.md)** if you want to extend the system
4. **Read the [Operations Guide](./OPERATIONS-GUIDE.md)** for deployment and maintenance

## Support

- **Documentation:** Full guides in `final-delivery/docs/`
- **Issues:** https://github.com/ruvnet/claude-flow/issues
- **Community:** Discord link in main repo

---

**You're ready!** Open Claude Code and start your first session. Everything else happens automatically.

**Total setup time:** < 5 minutes
**Manual configuration:** Zero
**Ongoing maintenance:** Minimal

Welcome to the hive mind. 🐝👑
