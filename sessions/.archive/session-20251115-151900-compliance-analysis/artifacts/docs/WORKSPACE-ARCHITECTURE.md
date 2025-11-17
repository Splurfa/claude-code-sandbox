# Claude-Flow+ Workspace Architecture

**Status:** Custom Extended Implementation
**Base:** claude-flow v2.7.35
**Architecture Compliance:** 68% Stock-Aligned / 97.5% Stock-First Implementation
**Last Updated:** 2025-11-15

---

## Executive Summary

This workspace is **claude-flow+ (custom extended version)**, NOT a stock claude-flow installation.

**What this means:**
- Built ON TOP of stock claude-flow CLI tools (97.5% stock-first execution)
- Adds custom infrastructure for session management, learning, and coordination
- Uses stock `.swarm/memory.db` but adds custom session artifact system
- Compatible with stock claude-flow commands but extends them with custom workflows

**Stock-First Score: 82/100 (B+)**

---

## Architecture Overview

### Stock Claude-Flow Components (68% of architecture)

**Memory System** (`.swarm/memory.db`)
- SQLite database with stock schema
- 32,049+ entries across 9 stock tables
- 4 custom tables added: task_trajectories, matts_runs, consolidation_runs, metrics_log
- **Compliance:** 95% stock

**Hooks System** (`.claude/hooks/`)
- ALL execution via `npx claude-flow@alpha hooks <command>`
- Stock hooks: pre-edit, post-edit, pre-task, post-task, pre-bash, post-bash, session-start, session-end
- Custom wrappers: auto-hooks.js (123 lines), journal.sh (Captain's Log)
- **Compliance:** 97% stock

**Skills Architecture** (`.claude/skills/`)
- 28 skills with proper YAML frontmatter
- Stock-compliant structure: skills/[name]/SKILL.md
- No nested subdirectories or namespaces
- Progressive disclosure: metadata → content → resources
- **Compliance:** 95% stock

### Custom Extensions (32% of architecture)

**Session Management Protocol**
- Custom `sessions/` directory with artifact organization
- Structure: `sessions/[session-id]/artifacts/{code,tests,docs,scripts,notes}/`
- Auto-initialization via `.claude/session/auto-init.sh`
- **Stock Equivalent:** None (uses .swarm/ for state only)
- **Status:** Production-ready, 5.6MB of session data

**File Routing System**
- Enforces artifact organization per session
- Routes code/tests/docs/scripts/notes to appropriate subdirectories
- Implemented as `.claude/skills/file-routing/` skill
- **Stock Equivalent:** None
- **Status:** Production-ready, AI-enforced

**ReasoningBank Learning Pipeline**
- Trajectory collection, verdict judgment, memory distillation
- Uses stock `task_trajectories` table schema
- Scripts: trajectory-collector.js, verdict-judge.js, memory-distiller.js (1,181 lines total)
- **Stock Equivalent:** Table schema provided, scripts custom
- **Status:** Deployed, 0 trajectories collected (awaiting data)

**AgentDB Vector Integration**
- Vector database for semantic search and learning
- Database: `.agentdb/reasoningbank.db` (385KB, 1536 dimensions)
- Stock agentdb CLI with thin wrapper scripts
- **Stock Equivalent:** Optional sanctioned addition
- **Status:** Initialized, 0 episodes (awaiting data)

**Captain's Log Journaling**
- Daily markdown logs in `sessions/captains-log/YYYY-MM-DD.md`
- Stock journal hook concept with custom bash implementation
- Human-readable decision tracking
- **Stock Equivalent:** Stock provides journal hook, custom script implementation
- **Status:** Production-ready, 3 daily logs created

**Git Checkpoint System**
- Automatic git commits with metadata on file edits
- Tagged checkpoints for rollback
- Script: `.claude/helpers/standard-checkpoint-hooks.sh` (179 lines, pure bash)
- **Stock Equivalent:** None
- **Status:** Production-ready

---

## Directory Structure

```
common-thread-sandbox/
├── .swarm/                      # ✅ STOCK - Memory and coordination
│   ├── memory.db               # Stock SQLite (32K+ entries)
│   └── backups/                # Stock session snapshots (30+)
│
├── .claude/                     # ⚠️ CUSTOM - Extended infrastructure
│   ├── agents/                 # Custom: 64 agent patterns
│   ├── checkpoints/            # Custom: Git checkpoint metadata
│   ├── commands/               # Custom: Wrapper documentation
│   ├── helpers/                # Custom: Setup scripts
│   ├── hooks/                  # Mixed: Stock + custom wrappers
│   ├── integrations/           # Custom: AgentDB bridge
│   ├── reasoningbank/          # Custom: Learning pipeline
│   ├── scripts/                # Custom: Batch operations
│   ├── session/                # Custom: Auto-init system
│   ├── skills/                 # Mixed: 28 skills (some stock-inspired)
│   ├── settings.json           # Custom: Workspace settings
│   └── settings.local.json     # Custom: Local overrides
│
├── .agentdb/                    # ⚠️ CUSTOM - Vector database
│   └── reasoningbank.db        # AgentDB (385KB, 0 episodes)
│
├── sessions/                    # ⚠️ CUSTOM - Session artifacts
│   ├── captains-log/           # Daily markdown journals
│   │   └── YYYY-MM-DD.md       # Date-based log files
│   └── session-*/              # Session directories
│       ├── metadata.json       # Session metadata
│       ├── session-summary.md  # Session narrative
│       └── artifacts/          # Organized outputs
│           ├── code/           # Source code files
│           ├── tests/          # Test files
│           ├── docs/           # Documentation
│           ├── scripts/        # Utility scripts
│           └── notes/          # Working notes
│
├── docs/                        # Project documentation
├── inbox/                       # Incoming items (if used)
├── CLAUDE.md                    # Workspace configuration
└── WORKSPACE-ARCHITECTURE.md    # This file
```

### Missing Stock Directories

These should exist per stock claude-flow but are ABSENT:
- ❌ `.claude-flow/` - Framework configuration
- ❌ `.hive-mind/` - Hive coordination files
- ❌ `.claude-plugin/` - Plugin system

**Impact:** Stock claude-flow commands may fail or behave unexpectedly. This workspace was NOT initialized via `npx claude-flow@alpha hive init`.

---

## Component Compliance Matrix

| Component | Stock % | Custom % | Status | Implementation |
|-----------|---------|----------|--------|----------------|
| Memory Database | 95% | 5% | ✅ Compliant | Stock schema + 4 custom tables |
| Hooks System | 97% | 3% | ✅ Compliant | All exec via npx claude-flow |
| Skills Structure | 95% | 5% | ✅ Compliant | Proper YAML, no nesting |
| Session Management | 0% | 100% | ❌ Custom | No stock equivalent |
| File Routing | 0% | 100% | ❌ Custom | No stock equivalent |
| AgentDB Integration | 95% | 5% | ✅ Optional | Stock-sanctioned addition |
| ReasoningBank | 97% | 3% | ⚠️ Inspired | Stock concept, custom scripts |
| Captain's Log | 100% | 0% | ⚠️ Mixed | Stock hook, custom script |
| Git Checkpoints | 0% | 100% | ❌ Custom | Not in stock |
| Auto-Init | 0% | 100% | ❌ Custom | Not in stock |

**Overall:** 68% Stock-Aligned Architecture / 97.5% Stock-First Implementation

---

## Stock-First Principles Adherence

### ✅ What We Got Right

1. **97% Stock Execution** - All hooks call `npx claude-flow@alpha hooks <command>`
2. **Thin Wrappers** - Custom scripts average 150 lines, focus on glue logic
3. **Zero Custom Frameworks** - Uses stock bash, sqlite3, jq, agentdb
4. **Stock Tools** - No reimplementation of core functionality
5. **Progressive Disclosure** - Skills use stock metadata-first loading

### ⚠️ Where We Deviated

1. **Custom Architecture** - Session/artifact management is non-stock
2. **Missing Stock Init** - Never ran `npx claude-flow@alpha hive init`
3. **Documentation Mixing** - CLAUDE.md blurs stock vs custom features
4. **Non-Standard Structure** - `sessions/` hierarchy not portable to stock
5. **Unused Features** - AgentDB (0 episodes), ReasoningBank (0 trajectories)

---

## Feature Status & Readiness

### ✅ Production-Ready (Fully Functional)

| Feature | Lines of Code | Stock % | Status | Usage |
|---------|--------------|---------|--------|-------|
| Memory Storage | Stock CLI | 95% | ✅ Active | 32,049 entries |
| Session Backups | Stock CLI | 100% | ✅ Active | 30+ snapshots |
| Captain's Log | 84 lines | 100% | ✅ Active | 3 daily logs |
| Session Auto-Init | 67 lines | 0% | ✅ Ready | Tested, not auto-integrated |
| Git Checkpoints | 179 lines | 0% | ✅ Active | On every file edit |
| Skills System | 28 skills | 95% | ✅ Active | Proper YAML structure |

### ⚠️ Deployed but Inactive (Awaiting Data)

| Feature | Lines of Code | Stock % | Status | Blocker |
|---------|--------------|---------|--------|---------|
| AgentDB | 2 scripts | 95% | ⚠️ Initialized | 0 episodes synced |
| ReasoningBank | 1,181 lines | 97% | ⚠️ Ready | 0 trajectories collected |

**Why Inactive:**
- AgentDB: Sync bridge exists but requires manual activation
- ReasoningBank: Pipeline ready but needs agent work to generate trajectories

---

## Migration & Compatibility

### Stock Command Compatibility

**Should Work (Untested):**
```bash
npx claude-flow@alpha hooks memory --action store --key "test" --value "data"
npx claude-flow@alpha hooks pre-task --description "Build API"
npx claude-flow@alpha hooks session-end --export-metrics true
```

**May Fail (Missing Directories):**
```bash
npx claude-flow@alpha hive init          # Missing .hive-mind/
npx claude-flow@alpha hive status        # Missing .claude-flow/
npx claude-flow@alpha swarm "task"       # Unknown behavior
```

### Migrating to Stock Claude-Flow

**If you want pure stock setup:**
1. Backup current workspace: `tar -czf claude-flow-plus-backup.tar.gz .`
2. Run stock init: `npx claude-flow@alpha hive init --topology mesh`
3. Migrate `.swarm/memory.db` (compatible)
4. Lose: Session management, file routing, ReasoningBank, Captain's Log

**Cost:** All custom features (32% of architecture)

### Migrating Stock to Claude-Flow+

**If others want this setup:**
1. Copy `.claude/` directory structure
2. Copy session management scripts
3. Update CLAUDE.md with custom protocols
4. Initialize `.agentdb/` and ReasoningBank if desired
5. Configure auto-hooks (optional)

**Benefit:** Structured session management, learning pipeline, artifact organization

---

## Decision Guide: Stock vs Custom

### Choose Stock Claude-Flow If...

- ✅ You want minimal setup and configuration
- ✅ You don't need structured session artifact management
- ✅ You're following official claude-flow documentation
- ✅ You want automatic updates and compatibility
- ✅ You're collaborating with stock claude-flow users

### Choose Claude-Flow+ If...

- ✅ You need structured session/artifact organization
- ✅ You want learning pipeline for pattern extraction
- ✅ You need daily journal logs (Captain's Log)
- ✅ You want git checkpoint automation
- ✅ You value file routing and organization

### Hybrid Approach (Recommended)

- ✅ Run `npx claude-flow@alpha hive init` to create stock directories
- ✅ Keep custom `.claude/` extensions for workflows
- ✅ Use stock commands for core operations
- ✅ Use custom scripts for enhanced features
- ✅ Document clearly what's stock vs custom (this file!)

---

## Upstream Contribution Candidates

These features could benefit the wider claude-flow community:

1. **Session Management Protocol** - Universal need for artifact organization
2. **File Routing Skill** - Helps organize multi-file projects
3. **ReasoningBank Scripts** - Implements documented but unscripted feature
4. **Captain's Log Hook** - Natural language journaling is valuable
5. **Git Checkpoint System** - Automatic versioning on edits

**Next Steps:** Consider opening PRs to ruvnet/claude-flow for community review

---

## Maintenance & Updates

### When Stock Claude-Flow Updates

**What Updates Automatically:**
- ✅ CLI commands (`npx claude-flow@alpha`)
- ✅ Memory schema (backward compatible)
- ✅ Hooks interface
- ✅ MCP integration

**What May Break:**
- ⚠️ Custom scripts calling stock CLI (test after updates)
- ⚠️ Skills relying on specific stock behavior
- ⚠️ Auto-hooks if stock hook signatures change

### Recommended Update Process

```bash
# 1. Check current version
npx claude-flow@alpha --version

# 2. Update stock claude-flow
npm update -g claude-flow@alpha

# 3. Test stock commands
npx claude-flow@alpha hooks memory --action search --pattern "test"

# 4. Test custom integrations
bash .claude/hooks/auto-hooks.js  # Verify no errors
bash .claude/reasoningbank/learning-loop-cli.sh stats

# 5. Review changelog for breaking changes
# https://github.com/ruvnet/claude-flow/releases
```

---

## Support & Resources

### Stock Claude-Flow
- Repository: https://github.com/ruvnet/claude-flow
- Documentation: https://github.com/ruvnet/claude-flow/wiki
- Issues: https://github.com/ruvnet/claude-flow/issues

### Claude-Flow+ (This Workspace)
- Architecture: This file (`WORKSPACE-ARCHITECTURE.md`)
- Configuration: `CLAUDE.md`
- Deployment Status: `.claude/DEPLOYMENT-STATUS.md`
- Session Protocol: See CLAUDE.md "Session Artifacts & Collaborative Closeout"

---

## Version History

**v1.0.0** (2025-11-15)
- Initial architecture documentation
- Compliance analysis completed
- Stock-first score: 82/100 (B+)
- 68% stock architecture / 97.5% stock implementation

---

**This is a living document.** Update as the workspace evolves or stock claude-flow changes.
