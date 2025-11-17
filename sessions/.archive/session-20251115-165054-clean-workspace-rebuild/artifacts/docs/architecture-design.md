# Clean Workspace Rebuild: Architecture Design

**Version**: 1.0.0
**Date**: 2025-11-15
**Architect**: System Architecture Designer
**Status**: Proposed for HITL Review

---

## Executive Summary

**Objective**: Rebuild claude-flow workspace from stock initialization using features-as-skills architecture.

**Current State**: 82/100 stock-first score with custom features embedded in stock files

**Target State**: 97/100 stock-first score with all custom features as opt-in skills

**Strategy**: Phased migration preserving all functionality while achieving stock-first compliance

**Benefits**: Maintainable, portable, composable, upgrade-safe architecture

---

## System Overview

### Architectural Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    User & Claude Code                        │
│         (Natural language requests & Task tool)              │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Skills Layer (.claude/skills/)                  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   session-   │  │     file-    │  │    hooks-    │      │
│  │  management  │  │   routing    │  │   cascade    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │               │
│  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐      │
│  │  captains-   │  │ reasoningbank│  │   agentdb-   │      │
│  │     log      │  │ -integration │  │ integration  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  All skills coordinate via shell scripts calling stock CLI  │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│           Stock Claude-Flow Infrastructure                   │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Hooks     │  │    Memory    │  │   Agents     │      │
│  │   System     │  │   Storage    │  │  Definitions │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Commands   │  │   Session    │  │     MCP      │      │
│  │  (43 total)  │  │   Backups    │  │    Tools     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  • npx claude-flow@alpha hooks [cmd]                        │
│  • .swarm/memory.db (SQLite)                                │
│  • .swarm/backups/session-*.json                            │
│  • .claude/agents/ (64 agents)                              │
│  • .claude/commands/ (43 commands)                          │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Never Edit Stock Files**: All custom features as skills in `.claude/skills/`
2. **Stock CLI Only**: Skills coordinate via `npx claude-flow@alpha` commands
3. **Auto-Cascading Hooks**: Pre-task hook auto-fires skill coordination
4. **Guidance Not Enforcement**: Skills recommend patterns, don't force them
5. **Progressive Disclosure**: Beginner → intermediate → advanced learning paths

---

## Component Architecture

### Stock Infrastructure (Untouched)

**Directory Structure**:
```
.claude/
├── agents/                 # 64 specialized agent definitions (STOCK)
│   ├── core/              # coder, reviewer, tester, planner, researcher
│   ├── swarm/             # coordinators for topologies
│   ├── consensus/         # byzantine, raft, gossip, crdt
│   ├── github/            # PR, issues, releases
│   └── ...
├── commands/               # 43 slash commands (STOCK)
│   ├── analysis/
│   ├── automation/
│   ├── coordination/
│   ├── github/
│   ├── hooks/
│   ├── memory/
│   ├── monitoring/
│   ├── swarm/
│   └── hive-mind/
├── helpers/                # 6 helper scripts (STOCK)
├── settings.json           # Stock configuration (READ-ONLY)
├── settings.local.json     # Local overrides (EDITABLE)
└── statusline-command.sh   # Status line integration (STOCK)

.swarm/                     # Stock runtime directory
├── memory.db               # SQLite memory storage
└── backups/                # Session backup JSON files
    └── session-*.json

CLAUDE.md                   # Project configuration (STOCK FORMAT)
```

**Stock Features**:
- ✅ Hooks system (`npx claude-flow@alpha hooks [cmd]`)
- ✅ Memory system (`.swarm/memory.db`)
- ✅ Agent definitions (64 specialized agents)
- ✅ Slash commands (43 commands)
- ✅ Session backups (`.swarm/backups/`)
- ✅ MCP integration (swarm_init, agent_spawn, task_orchestrate)

### Skills Layer (Custom)

**Directory Structure**:
```
.claude/skills/
├── session-management/     # Session lifecycle coordination
│   ├── skill.md           # Skill definition + frontmatter
│   ├── scripts/           # Shell scripts (stock CLI only)
│   │   ├── init-session.sh
│   │   ├── closeout.sh
│   │   └── restore.sh
│   ├── examples/          # Progressive disclosure
│   │   ├── basic.md
│   │   ├── multi-session.md
│   │   └── custom-strategy.md
│   ├── docs/              # Deep dive documentation
│   │   ├── concepts.md
│   │   └── stock-integration.md
│   └── tests/             # Skill validation
│       └── lifecycle.test.sh
│
├── file-routing/           # File organization guidance
│   ├── skill.md
│   ├── examples/
│   │   ├── session-artifacts.md
│   │   ├── monorepo.md
│   │   └── microservices.md
│   └── docs/
│       └── why-file-routing.md
│
├── hooks-cascade/          # Auto-coordinating hooks
│   ├── skill.md
│   ├── scripts/
│   │   ├── pre-task-cascade.sh
│   │   └── post-task-cascade.sh
│   ├── examples/
│   │   ├── basic-cascade.md
│   │   └── custom-cascade.md
│   └── docs/
│       └── cascade-theory.md
│
├── captains-log/           # Session journaling
│   ├── skill.md
│   ├── scripts/
│   │   ├── log-entry.sh
│   │   └── search-log.sh
│   └── examples/
│       └── journaling-patterns.md
│
├── reasoningbank-integration/  # Learning pipeline
│   ├── skill.md
│   ├── scripts/
│   │   ├── collect-trajectory.sh
│   │   ├── judge-verdict.sh
│   │   └── distill-memory.sh
│   └── docs/
│       └── learning-theory.md
│
├── agentdb-integration/    # Vector search
│   ├── skill.md
│   ├── scripts/
│   │   ├── vector-search.sh
│   │   └── index-update.sh
│   └── docs/
│       └── vector-search-guide.md
│
└── git-checkpoints/        # Auto-commit
    ├── skill.md
    ├── scripts/
    │   └── auto-commit.sh
    └── examples/
        └── checkpoint-patterns.md
```

**Skill Characteristics**:
- ✅ Self-contained feature packages
- ✅ YAML frontmatter with metadata
- ✅ Shell scripts calling stock CLI
- ✅ Progressive disclosure (beginner → advanced)
- ✅ Tests and validation
- ✅ Documentation of stock integration

---

## Data Flow Architecture

### Session Lifecycle Data Flow

```
User Request: "Build REST API"
        ↓
Claude Code Task Tool: Spawn agents
        ↓
Stock Pre-Task Hook Fires
        ↓
Pre-Task Cascade (via settings.local.json)
        ↓
┌───────────────────────────────────────────────────┐
│  Skill: hooks-cascade/scripts/pre-task-cascade.sh │
│                                                    │
│  1. npx claude-flow@alpha hooks session-restore   │
│     ↓ Loads from .swarm/backups/session-*.json   │
│                                                    │
│  2. npx claude-flow@alpha hooks memory retrieve   │
│     ↓ Loads from .swarm/memory.db                │
│                                                    │
│  3. npx claude-flow@alpha hooks journal           │
│     ↓ Logs to stock journal                      │
└───────────────────────────────────────────────────┘
        ↓
Agent Executes Task
        ↓
Agent Saves Files (session/$SESSION_ID/artifacts/)
        ↓
Stock Post-Task Hook Fires
        ↓
Post-Task Cascade
        ↓
┌───────────────────────────────────────────────────┐
│  Skill: session-management/scripts/session-backup │
│                                                    │
│  1. npx claude-flow@alpha hooks session-end       │
│     ↓ Saves to .swarm/backups/session-*.json     │
│                                                    │
│  2. npx claude-flow@alpha hooks memory store      │
│     ↓ Saves to .swarm/memory.db                  │
└───────────────────────────────────────────────────┘
        ↓
Session Closeout (HITL Approval)
        ↓
┌───────────────────────────────────────────────────┐
│  Skill: session-management/scripts/closeout.sh    │
│                                                    │
│  1. Display summary from .swarm/backups/          │
│  2. HITL: Prompt "Type 'close' to confirm"       │
│  3. Archive sessions/ directory to .archive/      │
│  4. Log to stock journal                          │
└───────────────────────────────────────────────────┘
        ↓
Session Archived & Backed Up
```

### Memory Storage Architecture

```
Stock Memory (.swarm/memory.db):
├── session/                    # Session namespace (skill-managed)
│   ├── session-123/metadata   # Session metadata
│   ├── session-123/context    # Session context for restore
│   └── session-123/stats      # Session statistics
│
├── captains-log/               # Journaling namespace (skill-managed)
│   ├── 2025-11-15/summary     # Daily summaries
│   └── 2025-11-15/entries     # Log entries
│
├── reasoningbank/              # Learning namespace (skill-managed)
│   ├── trajectories/task-*    # Task trajectories
│   ├── verdicts/task-*        # Outcome judgments
│   └── patterns/*             # Learned patterns
│
├── agentdb/                    # Vector search namespace (skill-managed)
│   ├── embeddings/*           # Vector embeddings
│   └── indices/*              # Search indices
│
└── swarm/                      # Stock swarm coordination
    ├── agents/*               # Agent states
    └── tasks/*                # Task execution data

All namespaces use stock memory API:
• npx claude-flow@alpha hooks memory --action store --key "..." --value "..."
• npx claude-flow@alpha hooks memory --action retrieve --key "..."
• npx claude-flow@alpha hooks memory --action search --pattern "..."
```

### Hooks Cascade Architecture

```
Stock Hooks Entry Point:
  npx claude-flow@alpha hooks pre-task --description "..." --task-id "..."

Stock Hook Implementation Reads:
  .claude/settings.local.json

Configuration:
{
  "hooks": {
    "pre-task": {
      "cascade": [
        ".claude/skills/session-management/scripts/session-restore.sh",
        ".claude/skills/hooks-cascade/scripts/pre-task-cascade.sh",
        ".claude/skills/captains-log/scripts/log-task-start.sh",
        ".claude/skills/reasoningbank-integration/scripts/load-context.sh"
      ],
      "parallel": false,
      "fail_fast": false
    },
    "post-task": {
      "cascade": [
        ".claude/skills/session-management/scripts/session-backup.sh",
        ".claude/skills/git-checkpoints/scripts/auto-commit.sh",
        ".claude/skills/reasoningbank-integration/scripts/collect-trajectory.sh"
      ],
      "parallel": true,
      "fail_fast": false
    }
  }
}

Execution Flow:
  Stock Hook → Read Cascade Config → Execute Scripts Sequentially/Parallel
  All scripts call stock CLI only (fully transparent, logged)
```

---

## Integration Points

### Claude Code Integration

```
Claude Code Task Tool
        ↓
Task("Agent", "Description", "type")
        ↓
Stock claude-flow spawns agent
        ↓
Agent calls stock hooks
        ↓
Hooks cascade to skills
        ↓
Skills coordinate via stock CLI
        ↓
Results logged to stock journal/memory
        ↓
User sees transparent execution
```

**Key**: Claude Code's Task tool is primary execution mechanism, MCP tools for coordination only.

### MCP Tools Integration

```
MCP Coordination (Strategy):
  mcp__claude-flow__swarm_init { topology: "mesh" }
  mcp__claude-flow__agent_spawn { type: "researcher" }
  mcp__claude-flow__task_orchestrate { task: "..." }

Claude Code Execution (Work):
  Task("Researcher", "Analyze requirements", "researcher")
  Task("Coder", "Implement features", "coder")
  Task("Tester", "Create tests", "tester")

Stock Hooks Coordination:
  npx claude-flow@alpha hooks pre-task
  npx claude-flow@alpha hooks post-task

Skills Enhancement:
  .claude/skills/*/scripts/*.sh (called by hooks)
```

### Git Integration

```
Stock Git Operations (User Control):
  git add sessions/session-*/artifacts/
  git commit -m "Work completed"

Skill-Enhanced Git (Optional):
  .claude/skills/git-checkpoints/scripts/auto-commit.sh
    ↓
  Fired by post-edit hook
    ↓
  git add sessions/$SESSION_ID/artifacts/
  git commit -m "Checkpoint: $TASK [auto]"

HITL Control:
  User can disable auto-commit in settings.local.json
  User can review commits before push
```

---

## Quality Attributes

### Maintainability

**Stock-First Compliance**:
- ✅ 97/100 score (95+ architecture, 100 implementation)
- ✅ Zero stock file modifications
- ✅ Clear separation of stock vs custom
- ✅ Stock upgrades work seamlessly

**Code Organization**:
- ✅ All custom code in `.claude/skills/`
- ✅ Each skill self-contained
- ✅ Clear dependencies documented
- ✅ Tests for each skill

### Portability

**Workspace Portability**:
- ✅ Skills directory portable across projects
- ✅ Skills work with any stock claude-flow init
- ✅ No project-specific hardcoding
- ✅ Configuration via settings.local.json

**Skill Portability**:
- ✅ Each skill independently usable
- ✅ Skills composable via hooks
- ✅ No tight coupling between skills
- ✅ Clear stock integration documented

### Scalability

**Feature Scalability**:
- ✅ Add new skills without modifying stock
- ✅ Skills don't conflict (namespaced memory)
- ✅ Hooks cascade composable
- ✅ Progressive complexity (beginner → advanced)

**Team Scalability**:
- ✅ Skills documented for team use
- ✅ Opt-in features (users choose)
- ✅ Clear learning paths
- ✅ HITL gates where needed

### Performance

**Execution Efficiency**:
- ✅ Hooks cascade runs sequentially or parallel (configurable)
- ✅ Minimal overhead (shell scripts, stock CLI)
- ✅ Async operations where possible
- ✅ No continuous monitoring (task-boundary only)

**Storage Efficiency**:
- ✅ Stock memory is SQLite (efficient)
- ✅ Session backups are JSON (compact)
- ✅ Skills don't duplicate stock data
- ✅ TTL for temporary memory data

### Security

**Principle of Least Privilege**:
- ✅ Skills can't modify stock files (enforced by pre-commit)
- ✅ HITL approval for destructive operations
- ✅ No filesystem interception
- ✅ All operations logged (auditability)

**Data Protection**:
- ✅ Session backups in `.swarm/backups/` (stock)
- ✅ Git checkpoint safety (review before push)
- ✅ Memory namespacing (skill isolation)
- ✅ Rollback procedures documented

---

## Deployment Architecture

### Fresh Workspace Setup

```bash
# 1. Initialize stock claude-flow
npx claude-flow@alpha init

# 2. Copy skills from reference
cp -r /path/to/reference/.claude/skills/ .claude/skills/

# 3. Configure skill preferences
cat > .claude/settings.local.json <<'EOF'
{
  "hooks": {
    "pre-task": {
      "cascade": [
        ".claude/skills/session-management/scripts/session-restore.sh",
        ".claude/skills/hooks-cascade/scripts/pre-task-cascade.sh"
      ]
    }
  }
}
EOF

# 4. Start using skills
.claude/skills/session-management/scripts/init-session.sh "my-topic"

# ✅ Ready to work with enhanced claude-flow
```

### Migration from Current

See [migration-strategy.md](migration-strategy.md) for detailed 3-phase migration plan.

### Skill Distribution

**Option 1: Git Repository**
```bash
# Add skills as git submodule
git submodule add https://github.com/org/claude-flow-skills .claude/skills

# Update skills
git submodule update --remote
```

**Option 2: NPM Package** (future)
```bash
# Install skills package
npm install @org/claude-flow-skills

# Link to .claude/skills/
ln -s node_modules/@org/claude-flow-skills .claude/skills
```

**Option 3: Manual Copy**
```bash
# Copy skills directory
cp -r /path/to/skills/* .claude/skills/
```

---

## Testing Strategy

### Unit Testing (Skills)

Each skill has tests in `tests/` directory:
```bash
# Test individual skill
.claude/skills/session-management/tests/lifecycle.test.sh

# Test all skills
for skill in .claude/skills/*/tests/*.test.sh; do
  bash "$skill"
done
```

### Integration Testing (Stock + Skills)

```bash
# Test stock integration
tests/test-stock-hooks.sh        # Verify stock hooks work
tests/test-session-lifecycle.sh  # Verify session skill + stock
tests/test-memory-operations.sh  # Verify memory skill + stock
tests/test-cascade-execution.sh  # Verify hooks cascade
```

### System Testing (End-to-End)

```bash
# Full workflow test
tests/test-full-workflow.sh

# Test:
# 1. Init session (stock + skill)
# 2. Spawn agents (Claude Code Task tool)
# 3. Execute tasks (stock hooks fire)
# 4. Cascade to skills (coordination)
# 5. Close session (HITL + stock + skill)
# 6. Restore session (stock + skill)
```

### Regression Testing

```bash
# Ensure no functionality loss after migration
tests/regression-suite.sh

# Compares:
# - Pre-migration baseline
# - Post-migration behavior
# - Expected: 100% feature parity
```

---

## Monitoring and Observability

### Stock Logging

```bash
# Stock journal provides activity log
npx claude-flow@alpha hooks journal --search "session:*"

# Stock memory provides state inspection
npx claude-flow@alpha hooks memory --action search --pattern "*"
```

### Skill Logging

All skill scripts log via stock journal:
```bash
# Each script calls:
npx claude-flow@alpha hooks journal \
  --entry "Skill action completed" \
  --tags "skill:session-management,action:init"

# Query skill activity:
npx claude-flow@alpha hooks journal --search "skill:*"
```

### Performance Monitoring

```bash
# Stock provides metrics
npx claude-flow@alpha hooks session-end \
  --session-id "$SESSION_ID" \
  --export-metrics true

# Metrics in .swarm/backups/session-*.json:
{
  "metrics": {
    "duration": 3600,
    "tasks_completed": 5,
    "hooks_fired": 42,
    "memory_operations": 127
  }
}
```

---

## Architectural Decision Records

See `docs/adr/` for detailed ADRs:

- [ADR-001: Never Edit Stock Files](adr/ADR-001-never-edit-stock-files.md)
- [ADR-002: Auto-Cascading Hooks Pattern](adr/ADR-002-auto-cascading-hooks.md)
- [ADR-003: Session Management as Skill](adr/ADR-003-session-management-as-skill.md)
- ADR-004: Skills Use Stock CLI Only (to be created)

---

## Future Enhancements

### Skill Ecosystem

- **Skill Catalog**: Centralized registry of available skills
- **Skill Dependencies**: Declare skill-to-skill dependencies
- **Skill Versioning**: Semantic versioning for skills
- **Skill Publishing**: NPM packages for skill distribution

### Enhanced Integration

- **IDE Integration**: VSCode extension for skill discovery
- **Skill Templates**: Scaffolding for new skill creation
- **Skill Marketplace**: Community-contributed skills
- **Skill Analytics**: Usage tracking and recommendations

### Advanced Features

- **Distributed Skills**: Skills coordinating across machines
- **Cloud Skills**: Skills using cloud services (Flow Nexus)
- **AI-Generated Skills**: Skills created by AI from patterns
- **Skill Composition**: Meta-skills composed of other skills

---

## Conclusion

**Features-as-skills architecture** achieves:

✅ **97/100 Stock-First Score** (vs 82/100 current)
✅ **Zero Stock Modifications** (pristine stock files)
✅ **Opt-In Features** (user freedom)
✅ **Progressive Disclosure** (beginner → advanced)
✅ **Composability** (skills combine via hooks)
✅ **Portability** (skills work across projects)
✅ **Maintainability** (clear boundaries, testable)
✅ **Upgrade Safety** (stock upgrades seamless)

**Next Steps**:

1. **HITL Review**: User reviews and approves architecture
2. **Phase 1 Migration**: Extract features to skills (1-2 days)
3. **Phase 2 Migration**: Restore stock CLAUDE.md (4-6 hours)
4. **Phase 3 Migration**: Cleanup and validation (4-6 hours)
5. **Team Onboarding**: Document and train on new architecture

**Timeline**: 3 days with testing and validation

**Risk**: Low (incremental, reversible, well-tested)

**Reward**: Clean, maintainable, stock-first architecture with full feature preservation

---

**Architecture approved for implementation pending HITL review.**
