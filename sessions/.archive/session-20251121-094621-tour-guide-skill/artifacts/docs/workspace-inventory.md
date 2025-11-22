# Workspace Inventory - Complete Directory Catalog

**Generated**: 2025-11-21
**Purpose**: Complete catalog of all workspace directories for tour-guide skill
**Scope**: All major folders from root level to key subdirectories

---

## Root Directory Structure

```
common-thread-sandbox/
├── .agentdb/               # AgentDB vector database (learning & memory)
├── .archive/               # Deprecated features and old system files
├── .claude/                # Claude Code configuration and extensions
├── .claude-flow/           # Claude Flow coordination state
├── .git/                   # Git repository
├── .hive-mind/             # Hive-Mind coordination system (3.5MB database)
├── .inbox/                 # Staging area (deprecated, use inbox/ instead)
├── .swarm/                 # Core infrastructure (118MB memory database)
├── .test-verify-recovery/  # System recovery testing
├── coverage/               # Test coverage reports
├── docs/                   # Documentation hierarchy
├── inbox/                  # External agent workspace integration
├── node_modules/           # NPM dependencies
├── sessions/               # Session workspaces (156MB active work)
├── CLAUDE.md               # Project configuration (main config)
├── README.md               # Project overview
└── package.json            # NPM configuration
```

---

## 1. `.claude/` - Claude Code Configuration (Core System)

**Purpose**: All Claude Code configuration, agents, skills, commands, and extensions

### Structure:
```
.claude/
├── agents/                 # 80+ agent definitions (organized by category)
├── checkpoints/            # System checkpoints
├── commands/               # 40+ slash commands
├── helpers/                # Utility scripts
├── hooks/                  # Hook system (auto-fire coordination)
├── integrations/           # External integrations
├── reasoningbank/          # ReasoningBank learning system
├── scripts/                # Automation scripts
├── settings.json           # Main settings (native hooks config)
├── settings.local.json     # Local overrides
├── skills/                 # 32 skills (main tour focus)
└── statusline-command.sh   # Status line customization
```

### Key Subdirectories:

#### `.claude/agents/` (80+ Agent Definitions)
```
agents/
├── core/                   # 5 core agents (researcher, coder, tester, planner, reviewer)
├── consensus/              # 7 consensus agents (Byzantine, Raft, Gossip, CRDT, etc.)
├── swarm/                  # 3 swarm coordinators (hierarchical, mesh, adaptive)
├── hive-mind/              # 5 hive-mind agents (queen, worker, scout, memory-manager)
├── github/                 # 13 GitHub agents (PR, issues, releases, workflows)
├── flow-nexus/             # 9 Flow-Nexus agents (sandboxes, neural, auth, payments)
├── sparc/                  # 4 SPARC agents (specification, pseudocode, architecture, refinement)
├── templates/              # 9 agent templates
├── optimization/           # 5 optimization agents (load-balancer, resource-allocator)
├── testing/                # 2 testing agents (TDD London swarm, production validator)
├── development/            # Backend developer
├── specialized/            # Mobile developer
├── architecture/           # System architect
├── devops/                 # CI/CD engineer
├── documentation/          # API docs generator
└── analysis/               # Code analyzer, code review swarm
```

#### `.claude/skills/` (32 Skills - Main Tour Focus)
```
skills/
├── session-closeout/       # Session lifecycle management
├── meta-skill/             # Intelligent skill routing
├── tutor-mode/             # Adaptive learning guide
├── file-routing/           # File organization guide
├── prompt-improver/        # Prompt optimization with HITL
├── pair-programming/       # AI-assisted coding with verification
├── skill-builder/          # Create custom skills
├── hive-mind-advanced/     # Queen-led coordination
├── swarm-orchestration/    # Multi-agent workflows
├── swarm-advanced/         # Advanced swarm patterns
├── hooks-automation/       # Hook system management
├── verification-quality/   # Truth scoring & rollback
├── performance-analysis/   # Bottleneck detection
├── sparc-methodology/      # SPARC development methodology
├── stream-chain/           # Stream-JSON chaining
├── agentic-jujutsu/        # Version control for agents
├── reasoningbank-intelligence/ # Adaptive learning
├── reasoningbank-agentdb/  # ReasoningBank + AgentDB integration
├── agentdb-*/ (5 skills)   # AgentDB features (vector search, optimization, learning, memory, advanced)
├── github-*/ (5 skills)    # GitHub automation (workflow, release, code review, project mgmt, multi-repo)
└── flow-nexus-*/ (3 skills) # Flow-Nexus features (swarm, neural, platform)
```

#### `.claude/commands/` (40+ Slash Commands)
```
commands/
├── swarm/                  # Swarm management commands
├── analysis/               # Performance analysis
├── coordination/           # Orchestration commands
├── memory/                 # Memory operations (neural)
├── optimization/           # Performance optimization
└── training/               # Model training
```

#### `.claude/hooks/` (Hook System)
```
hooks/
├── auto-hooks.js           # DEPRECATED (violated stock-first)
├── pre-task.sh             # Pre-task hook
├── post-task.sh            # Post-task hook
├── session-end.sh          # Session closeout
└── README.md               # Migration guide to settings.json
```

---

## 2. `.swarm/` - Core Infrastructure (118MB)

**Purpose**: Persistent storage for memory, backups, and coordination state

### Structure:
```
.swarm/
├── memory.db               # SQLite database (111MB, 68,219 entries)
├── memory.db-shm           # Shared memory file
├── memory.db-wal           # Write-ahead log
├── backups/                # 49 session snapshots (avg 2.1MB each)
├── captains-log.md         # Human-readable decision journal
├── hooks/                  # Hook execution logs
├── metrics/                # Performance metrics
├── tutor-cache/            # Tutor-mode learning cache
└── README.md               # Infrastructure documentation
```

### Key Files:

#### `memory.db` (111MB SQLite Database)
- **68,219 total memory entries**
- **15 active namespaces**:
  - `workspace-coordination` - Cross-session project state
  - `swarm/shared/*` - Agent coordination data
  - `tutor-progress` - Learning tracking
  - `session/*` - Session-specific state
  - `reasoningbank/*` - Learning patterns

#### `backups/` (49 Session Snapshots)
- Point-in-time session archives
- JSON format (human & machine readable)
- Includes: summary, artifacts list, memory snapshot, metrics
- Used for context restoration and auditing

---

## 3. `sessions/` - Session Workspaces (156MB)

**Purpose**: Isolated workspaces for all AI-generated content

### Structure:
```
sessions/
├── README.md               # Session management guide
├── metadata.json           # Session tracking
├── captains-log/           # Daily decision journal
│   ├── 2025-11-13.md
│   ├── 2025-11-14.md
│   └── learning-log.jsonl
├── session-YYYYMMDD-HHMMSS-<topic>/  # Individual sessions
│   └── artifacts/
│       ├── code/           # All source code
│       ├── tests/          # All test files
│       ├── docs/           # Documentation
│       ├── scripts/        # Utility scripts
│       └── notes/          # Working notes
└── .archive/               # Closed sessions (moved here post-closeout)
```

### Session Scope Rule:
**ONE SESSION = ONE CHAT THREAD**

All work for a chat goes into a single session directory. Sub-tasks use subdirectories within `artifacts/`, NOT new sessions.

---

## 4. `docs/` - Documentation Hierarchy

**Purpose**: Organized documentation by workflow stage

### Structure:
```
docs/
├── README.md               # Documentation overview
├── setup/                  # Getting started (4 docs)
│   ├── quick-start.md
│   ├── orientation.md
│   ├── what-is-claude-flow.md
│   └── cross-model-compatibility.md
├── operate/                # Daily workflows (9 docs)
│   ├── session-management.md
│   ├── first-session.md
│   ├── memory-basics.md
│   ├── parallel-execution.md
│   └── troubleshooting.md
├── build/                  # Creation & extension (5 docs)
│   ├── spawning-agents.md
│   ├── create-skills.md
│   ├── custom-agents.md
│   └── extending-system.md
├── coordinate/             # Multi-agent orchestration (9 docs)
│   ├── swarm-topologies.md
│   ├── hive-mind.md
│   ├── consensus-mechanisms.md
│   └── performance-tuning.md
└── reference/              # Architecture & catalogs (4 docs)
    ├── architecture.md
    ├── agent-catalog.md
    ├── limitations.md
    └── what-actually-works.md
```

### Learning Path:
1. **Setup** → 2. **Operate** → 3. **Build** → 4. **Coordinate** → 5. **Reference**

---

## 5. `.hive-mind/` - Hive-Mind Coordination (3.5MB)

**Purpose**: Queen-based multi-agent coordination system

### Structure:
```
.hive-mind/
├── hive.db                 # SQLite coordination database (364KB)
├── hive.db-shm             # Shared memory
├── hive.db-wal             # Write-ahead log (3.2MB)
├── sessions/               # 25 coordination sessions
├── config/                 # Hive configuration
├── backups/                # Hive state backups
├── logs/                   # Coordination logs
├── memory/                 # Hive memory storage
├── templates/              # Hive templates
└── README.md               # Hive-mind documentation
```

---

## 6. `inbox/` - External Agent Integration

**Purpose**: Staging area for work from non-Claude agents

### Structure:
```
inbox/
├── README.md               # External integration guide
├── gemini-agent/           # Google Gemini contributions
├── codex-agent/            # OpenAI Codex contributions
├── cursor-agent/           # Cursor editor contributions
└── user/                   # User-provided materials
```

### Protocol:
- Claude Code does NOT modify `inbox/` unless explicitly directed
- Each workspace has README.md marking it as external
- Integration happens only on explicit user request

---

## 7. `.archive/` - Deprecated Features

**Purpose**: Historical features no longer in use

### Structure:
```
.archive/
└── deprecated/
    └── memory-20251113/    # Old memory system (migrated to .swarm/)
```

---

## 8. `.agentdb/` - AgentDB Vector Database

**Purpose**: Vector-based semantic search and agent learning

**Contents**: Vector embeddings, agent memory patterns, similarity search indexes

---

## 9. `.claude-flow/` - Claude Flow State

**Purpose**: Claude Flow coordination state and configuration

**Contents**: Swarm topologies, agent registrations, orchestration state

---

## System Metrics (Current State)

### Storage Distribution:
- **Memory Database**: 111MB (`.swarm/memory.db`)
- **Active Sessions**: 156MB (`sessions/`)
- **Hive Database**: 3.5MB (`.hive-mind/hive.db`)
- **Documentation**: ~5MB (`docs/`)
- **Configuration**: ~2MB (`.claude/`)

### Memory Statistics:
- **68,219 memory entries** across 15 namespaces
- **49 session backups** (avg 2.1MB each)
- **15 active namespaces** for coordination

### Agent & Skill Counts:
- **80+ agent definitions** (organized by category)
- **32 skills** (main capabilities)
- **40+ slash commands** (quick actions)

---

## File Routing Rules

### Session Artifacts (ALL new files):
```
✅ sessions/<session-id>/artifacts/code/       # Source code
✅ sessions/<session-id>/artifacts/tests/      # Test files
✅ sessions/<session-id>/artifacts/docs/       # Documentation
✅ sessions/<session-id>/artifacts/scripts/    # Scripts
✅ sessions/<session-id>/artifacts/notes/      # Notes
```

### Root Files (EDIT ONLY):
```
✅ CLAUDE.md                # Main configuration (edit in place)
✅ package.json             # NPM config (edit in place)
✅ README.md                # Project overview (edit in place)
```

### NEVER Write To:
```
❌ root tests/              # Use session artifacts instead
❌ root docs/               # Use session artifacts (promote later)
❌ root scripts/            # Use session artifacts
```

---

## Tour Navigation

This inventory serves as the **foundation for the tour-guide skill**. Key tour stops should include:

1. **CLAUDE.md** - The constitution (main config)
2. **sessions/** - Where all work happens
3. **.swarm/memory.db** - The brain (persistent memory)
4. **.claude/skills/** - All 32 skills
5. **.claude/agents/** - All 80+ agent types
6. **docs/** - Learning documentation
7. **inbox/** - External integration

---

## Related Documentation

- [Skills Catalog](./skills-catalog.md) - All 32 skills detailed
- [Features Catalog](./features-catalog.md) - System capabilities
- [Tour Highlights](./tour-highlights.md) - Recommended tour stops
- [System Architecture](../../../docs/reference/architecture.md) - How it works

---

**Next Steps for Tour-Guide**: Use this inventory to design interactive tour stops that help users understand the workspace structure and find their way around.
