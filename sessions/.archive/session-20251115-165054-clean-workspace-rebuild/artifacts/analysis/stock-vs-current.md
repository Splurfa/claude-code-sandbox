# Stock vs Current Architecture Analysis

**Date**: 2025-11-15
**Analyst**: System Architect
**Session**: session-20251115-165054-clean-workspace-rebuild

## Executive Summary

Current workspace shows **82/100 stock-first score** with heavy customization that violates core claude-flow principles. A clean rebuild using **features-as-skills architecture** will achieve **95+ stock-first score** while preserving all desired functionality.

---

## What Stock Claude-Flow Provides

### Core Infrastructure (via `npx claude-flow@alpha init`)

**Generated Files:**
```
CLAUDE.md                    # AI-readable project config
.claude/
├── commands/               # 43 slash commands (analysis, automation, coordination, etc.)
│   ├── analysis/          # 3 commands
│   ├── automation/        # 3 commands
│   ├── coordination/      # 3 commands
│   ├── github/            # 5 commands
│   ├── hooks/             # 5 commands
│   ├── memory/            # 3 commands
│   ├── monitoring/        # 3 commands
│   ├── optimization/      # 3 commands
│   ├── training/          # 3 commands
│   ├── workflows/         # 3 commands
│   ├── swarm/             # 9 commands
│   └── hive-mind/         # 11 commands
├── agents/                # 64 specialized agents
│   ├── core/              # coder, reviewer, tester, planner, researcher
│   ├── swarm/             # hierarchical-coordinator, mesh-coordinator, adaptive-coordinator
│   ├── consensus/         # byzantine, raft, gossip, crdt, quorum
│   ├── github/            # pr-manager, issue-tracker, release-manager
│   ├── sparc/             # specification, pseudocode, architecture, refinement
│   └── specialized/       # backend-dev, mobile-dev, ml-developer, cicd-engineer
├── helpers/               # 6 helper scripts
├── settings.json          # Configuration with MCP permissions
├── settings.local.json    # Local overrides
└── statusline-command.sh  # Status line integration
```

**Stock Hooks System:**
```bash
# Available hooks (all via CLI)
npx claude-flow@alpha hooks pre-task --description "task" --task-id "id"
npx claude-flow@alpha hooks post-task --task-id "id" --status "completed"
npx claude-flow@alpha hooks post-edit --file "path" --memory-key "key"
npx claude-flow@alpha hooks session-restore --session-id "id"
npx claude-flow@alpha hooks session-end --export-metrics true
npx claude-flow@alpha hooks memory --action store --key "k" --value "v"
npx claude-flow@alpha hooks notify --message "msg" --channel "slack"
npx claude-flow@alpha hooks journal --entry "text" --tags "tag1,tag2"
```

**Stock Memory System:**
- SQLite database at `.swarm/memory.db`
- Key-value storage with TTL
- Pattern search with namespacing
- Session backups at `.swarm/backups/session-*.json`

**Stock Features:**
- ✅ Multi-agent coordination (mesh, hierarchical, ring, star topologies)
- ✅ Swarm initialization and management
- ✅ Task orchestration with parallel/sequential/adaptive strategies
- ✅ Performance monitoring and bottleneck analysis
- ✅ Neural network training with WASM acceleration
- ✅ GitHub integration (PR review, issue triage, releases)
- ✅ Cross-session memory persistence
- ✅ Hooks for pre/post operations
- ✅ SPARC methodology support
- ✅ 64 specialized agent templates
- ✅ 43 slash commands for workflows

---

## Current Workspace Customizations

### Directory Structure Analysis

**Stock Elements (Preserved):**
```
.claude/
├── agents/                # ✅ Stock agent definitions (64 agents)
├── commands/              # ✅ Stock slash commands (43 commands)
├── helpers/               # ✅ Stock helper scripts (6 helpers)
├── settings.json          # ✅ Stock configuration
└── statusline-command.sh  # ✅ Stock status line
```

**Custom Additions (Non-Stock):**
```
.claude/
├── hooks/                 # ⚠️  CUSTOM: Auto-fire wrapper around stock hooks
│   ├── auto-hooks.js      # Thin wrapper (123 lines)
│   ├── pre-task.sh        # Custom pre-task logic
│   └── post-task.sh       # Custom post-task logic
├── integrations/          # ⚠️  CUSTOM: External service integrations
│   ├── agentdb/           # AgentDB vector DB integration
│   ├── reasoningbank/     # Learning pipeline integration
│   └── git-checkpoints/   # Custom git checkpoint logic
├── reasoningbank/         # ⚠️  CUSTOM: Learning pipeline implementation
│   ├── trajectory-collector.js
│   ├── verdict-judge.js
│   └── memory-distiller.js
├── scripts/               # ⚠️  CUSTOM: Session management scripts
│   ├── closeout.sh
│   ├── archive-session.sh
│   └── init-session.sh
├── session/               # ⚠️  CUSTOM: Session tracking metadata
│   └── current-session.json
└── skills/                # ⚠️  CUSTOM: 28 skills (file-routing, session-closeout, etc.)
```

**Root-Level Custom Additions:**
```
sessions/                  # ⚠️  CUSTOM: Session artifact storage
├── README.md
├── metadata.json
├── captains-log/          # Custom journaling system
└── session-*/             # Individual session directories

inbox/                     # ⚠️  CUSTOM: Async collaboration inbox
├── README.md
├── assistant/
└── codex-agent/

.agentdb/                  # ⚠️  CUSTOM: AgentDB vector database
.archive/                  # ⚠️  CUSTOM: Archived content

docs/                      # ⚠️  CUSTOM: Root-level docs (should be per-session)
README.md                  # ⚠️  CUSTOM: Workspace README
```

### Compliance Issues

#### 1. **Stock File Modifications**

**CLAUDE.md** - Heavily customized beyond stock init:
- ❌ Custom session management protocol added
- ❌ Custom file routing rules embedded
- ❌ Custom subagent usage protocol
- ❌ Custom concurrent execution patterns
- ⚠️  **ISSUE**: Stock init creates minimal CLAUDE.md, current one has 500+ lines of custom content

**Stock CLAUDE.md should contain:**
- Project overview
- Technology stack
- MCP integration instructions
- Basic workflow patterns

**Current CLAUDE.md contains:**
- Session management protocol (should be a skill)
- File routing system (should be a skill)
- Hooks automation (should be a skill)
- Agent coordination protocol (should be a skill)
- Multiple custom features documentation

#### 2. **Custom Features Implemented as Code**

**Current Implementation:**
- ❌ `.claude/hooks/auto-hooks.js` - Intercepts filesystem operations
- ❌ `.claude/reasoningbank/` - Custom learning pipeline
- ❌ `.claude/integrations/` - External service wrappers
- ❌ `.claude/scripts/` - Session management automation
- ❌ Root `sessions/` directory with custom structure

**Should Be:**
- ✅ Skills that coordinate stock features
- ✅ Documentation that guides usage
- ✅ Shell scripts that call stock CLI commands
- ✅ No file interception or monkey-patching

#### 3. **Session Management Divergence**

**Stock Session Management:**
- Uses `.swarm/backups/session-*.json` for session snapshots
- `npx claude-flow@alpha hooks session-end --export-metrics true`
- No prescribed directory structure for artifacts

**Current Session Management:**
- ❌ Custom `sessions/` directory at root
- ❌ Mandatory `artifacts/{code,tests,docs,scripts,notes}` structure
- ❌ Custom metadata.json and session-summary.md
- ❌ CLAUDE.md enforcement rules (file routing)
- ⚠️  **ISSUE**: Creates rigid structure that stock claude-flow doesn't know about

---

## Stock-First Score Breakdown

### Current Score: 82/100

**Architecture (68% Stock):**
- ✅ Uses stock agent definitions (64 agents)
- ✅ Uses stock slash commands (43 commands)
- ✅ Uses stock hooks CLI (`npx claude-flow@alpha hooks`)
- ✅ Uses stock memory system (`.swarm/memory.db`)
- ❌ Custom session directory structure (`sessions/`)
- ❌ Custom file routing enforcement
- ❌ Custom inbox system
- ❌ Custom Captain's Log

**Implementation (97.5% Stock):**
- ✅ All hooks go through stock CLI (auto-hooks.js is thin wrapper)
- ✅ No modification of stock agent definitions
- ✅ No modification of stock command files
- ❌ Custom scripts in `.claude/scripts/`
- ❌ Custom integrations in `.claude/integrations/`
- ❌ CLAUDE.md heavily modified

**Key Violations:**
1. **CLAUDE.md bloat** - 500+ lines vs stock 50-100 lines
2. **Custom directory mandates** - Enforces `sessions/` structure
3. **File routing enforcement** - Not stock behavior
4. **Code-based customizations** - auto-hooks.js, reasoningbank/, integrations/

---

## Proposed Architecture: Features-as-Skills

### Core Principle

> **Never edit stock files. All custom features as skills.**

### Design Philosophy

**Stock claude-flow provides:**
- Infrastructure (hooks, memory, agents, commands)
- Coordination primitives (swarms, tasks, workflows)
- Integration points (MCP tools, CLI hooks)

**Skills provide:**
- Workflow patterns and best practices
- Feature coordination via stock infrastructure
- Documentation and guidance
- Shell scripts that call stock CLI

**Skills DO NOT provide:**
- Custom code execution
- File interception
- Monkey-patching
- New infrastructure

### Architecture Layers

```
┌─────────────────────────────────────────────┐
│          User & Claude Code                 │
│  (Natural language requests & Task tool)    │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│         Skills Layer (.claude/skills/)      │
│  • session-management/                      │
│  • file-routing/                            │
│  • captains-log/                            │
│  • hooks-cascade/                           │
│  • reasoningbank-integration/               │
│  • agentdb-integration/                     │
│                                             │
│  Skills coordinate stock features via:      │
│  - Shell scripts calling stock CLI          │
│  - Documentation/guidance                   │
│  - YAML frontmatter configuration           │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│    Stock Claude-Flow Infrastructure         │
│  • npx claude-flow@alpha hooks [cmd]        │
│  • .swarm/memory.db                         │
│  • .claude/agents/ (64 agents)              │
│  • .claude/commands/ (43 commands)          │
│  • MCP tools (swarm_init, task_orchestrate) │
└─────────────────────────────────────────────┘
```

### Auto-Cascading Hooks Pattern

**Problem**: Manual hook invocation is error-prone and tedious.

**Solution**: Pre-task hook auto-fires all necessary hooks.

**Implementation** (100% stock CLI):
```bash
# Pre-task hook script (.claude/skills/hooks-cascade/scripts/pre-task.sh)
#!/bin/bash
# Fires all necessary hooks before task execution
# All hooks use stock CLI - no custom code

SESSION_ID="${SESSION_ID:-unknown}"
TASK_ID="$1"
DESCRIPTION="$2"

# 1. Session restore (if exists)
if [ -f ".swarm/backups/session-${SESSION_ID}.json" ]; then
  npx claude-flow@alpha hooks session-restore --session-id "$SESSION_ID"
fi

# 2. Pre-task hook
npx claude-flow@alpha hooks pre-task \
  --description "$DESCRIPTION" \
  --task-id "$TASK_ID" \
  --auto-spawn-agents

# 3. Load session memory into context
npx claude-flow@alpha hooks memory \
  --action retrieve \
  --key "session/${SESSION_ID}/context"

# 4. Initialize session artifacts (if new session)
if [ ! -d "sessions/$SESSION_ID" ]; then
  .claude/skills/session-management/scripts/init-session.sh "$SESSION_ID"
fi

# 5. Log to Captain's Log
npx claude-flow@alpha hooks journal \
  --entry "Starting task: $DESCRIPTION" \
  --tags "session:$SESSION_ID,task:$TASK_ID"
```

**Invocation** (automatic during agent spawn):
```bash
# User spawns agent via Claude Code Task tool
# Pre-task hook fires automatically before agent starts
# All coordination via stock hooks - zero custom code
```

**Benefits:**
- ✅ 100% stock CLI calls
- ✅ Zero file interception
- ✅ Transparent to user
- ✅ Composable (skills can add their own hooks)
- ✅ Auditable (all hooks logged via stock system)

### Stock Integration Points

**1. Workspace Integration:**
- Stock: `.swarm/` directory for memory and backups
- Custom: Skills reference `.swarm/` data
- No modification of stock storage format

**2. Session Integration:**
- Stock: `session-end` hook creates backup JSON
- Custom: Skill extends with metadata and archival
- No modification of stock backup format

**3. Memory Integration:**
- Stock: `hooks memory --action [store|retrieve|search]`
- Custom: Skills use namespaced keys (`session/`, `captains-log/`, `reasoningbank/`)
- No custom memory implementation

**4. Hooks Integration:**
- Stock: All hooks via `npx claude-flow@alpha hooks [cmd]`
- Custom: Skills chain hooks via shell scripts
- No hook interception or modification

---

## Migration Path to 95+ Stock-First

### Phase 1: Extract Custom Features to Skills

**Target Score: 90/100**

**Actions:**
1. Create skills for all custom features:
   - `session-management` - Extract from CLAUDE.md
   - `file-routing` - Extract from CLAUDE.md
   - `captains-log` - Extract from sessions/captains-log/
   - `hooks-cascade` - Extract from .claude/hooks/auto-hooks.js
   - `reasoningbank-integration` - Wrap reasoningbank/ as skill
   - `agentdb-integration` - Wrap .agentdb/ as skill

2. Restore CLAUDE.md to stock-like format:
   - Project overview only
   - Technology stack
   - MCP integration guide
   - Reference to skills for advanced features

3. Move custom scripts to skills:
   - `.claude/scripts/` → `.claude/skills/*/scripts/`
   - All scripts call stock CLI only

**Validation:**
- ✅ All custom features accessible via skills
- ✅ CLAUDE.md under 200 lines
- ✅ Zero modifications to stock agent definitions
- ✅ Zero modifications to stock command files

### Phase 2: Stock-Only Implementation

**Target Score: 95+/100**

**Actions:**
1. Replace all custom code with stock CLI calls:
   - `auto-hooks.js` → Shell script with stock hooks
   - `reasoningbank/*.js` → Skills that coordinate stock memory
   - `integrations/*` → Skills that use stock hooks for coordination

2. Align session management with stock patterns:
   - Use `.swarm/backups/` as primary session storage
   - `sessions/` becomes secondary (skill-managed)
   - Skills coordinate session artifacts via stock hooks

3. Remove all file interception:
   - No fs.writeFileSync overrides
   - No monkey-patching
   - All coordination via hooks CLI

**Validation:**
- ✅ 95% architecture stock (only skills directory custom)
- ✅ 100% implementation stock (all execution via stock CLI)
- ✅ All features preserved as skills
- ✅ Zero breaking changes for users

### Phase 3: Clean Rebuild Testing

**Target Score: 98+/100**

**Actions:**
1. Fresh `npx claude-flow@alpha init` in new directory
2. Copy only skills from current workspace
3. Verify all features work via skills
4. Document any stock gaps or feature requests

**Validation:**
- ✅ Clean init + skills = full feature parity
- ✅ No manual editing of stock files
- ✅ Skills are portable across workspaces
- ✅ Stock upgrades don't break custom features

---

## Key Architectural Decisions

### ADR-001: Never Edit Stock Files

**Decision**: All custom functionality must be implemented as skills, never by modifying stock claude-flow files.

**Rationale**:
- Stock upgrades don't break custom features
- Clear separation of concerns
- Skills are portable across projects
- Easier to debug (stock vs custom)

**Implementation**:
- CLAUDE.md: Restore to stock format, reference skills
- Agents: Use stock definitions, coordinate via skills
- Commands: Use stock commands, extend via skills
- Hooks: Always call stock CLI, never intercept

### ADR-002: Auto-Cascading Hooks via Pre-Task

**Decision**: All hook coordination happens via pre-task hook, not file interception.

**Rationale**:
- Transparent execution (visible in logs)
- Composable (skills can add hooks)
- No monkey-patching or interception
- 100% stock CLI usage

**Implementation**:
- Pre-task fires session-restore, memory-load, journal-entry
- Skills add their own hooks to cascade
- All hooks use stock CLI syntax
- Zero custom code execution

### ADR-003: Session Management as Skill

**Decision**: Session management is a skill that coordinates stock features, not infrastructure.

**Rationale**:
- Stock `.swarm/backups/` is canonical session storage
- `sessions/` directory is skill-specific enhancement
- File routing is guidance, not enforcement
- Users remain free to organize as they wish

**Implementation**:
- Skill provides session-init, session-end scripts
- Scripts call stock hooks (session-end, memory store, journal)
- Skill documents recommended practices
- No CLAUDE.md enforcement rules

### ADR-004: Skills Use Stock CLI Only

**Decision**: Skills coordinate via shell scripts that call stock CLI, never custom code.

**Rationale**:
- Auditable (all CLI calls logged)
- Testable (can mock CLI responses)
- Maintainable (no custom runtime)
- Stock-first compliance

**Implementation**:
- Skills contain shell scripts in `scripts/` directory
- Scripts call `npx claude-flow@alpha hooks [cmd]`
- Skills can use MCP tools for coordination
- No custom JavaScript/TypeScript execution

---

## Comparison Matrix

| Feature | Current | Proposed | Stock-First Score |
|---------|---------|----------|-------------------|
| **Session Management** | Custom directory + metadata | Skill coordinating stock backups | 95% |
| **File Routing** | CLAUDE.md enforcement | Skill documentation/guidance | 100% |
| **Hooks Cascade** | auto-hooks.js (interception) | pre-task.sh (stock CLI) | 100% |
| **Captain's Log** | Custom implementation | Skill using stock journal hook | 95% |
| **ReasoningBank** | Custom JS implementation | Skill using stock memory | 90% |
| **AgentDB** | Custom integration code | Skill coordinating via hooks | 90% |
| **Git Checkpoints** | Custom checkpoint logic | Skill using git + stock hooks | 95% |
| **CLAUDE.md** | 500+ lines, enforcement | 150 lines, guidance | 100% |
| **Overall Score** | 82/100 | 97/100 | **+15 points** |

---

## Risk Analysis

### Low Risk

- ✅ Skills are additive (don't break stock)
- ✅ Stock upgrades work seamlessly
- ✅ Rollback is trivial (remove skills)
- ✅ Users can opt-in per feature

### Medium Risk

- ⚠️  Learning curve for skills vs direct implementation
- ⚠️  Documentation needs to be excellent
- ⚠️  Progressive disclosure critical for adoption

### High Risk

- ❌ None identified (skills don't modify stock)

### Mitigation Strategies

1. **Excellent Documentation**:
   - Each skill has progressive disclosure (beginner → advanced)
   - Clear examples for common workflows
   - Migration guides for existing users

2. **HITL Approval**:
   - All breaking changes require user approval
   - Session closeout always prompts before archive
   - File routing is guidance, not enforcement

3. **Rollback Safety**:
   - Skills can be disabled individually
   - Stock workspace works without skills
   - No data loss if skills removed

---

## Recommendations

### Immediate Actions

1. **Create features-as-skills architecture spec** (next document)
2. **Design migration strategy** with rollback safety
3. **Document all ADRs** for architectural decisions
4. **Build proof-of-concept** skill to validate pattern

### Success Criteria

- ✅ 95+ stock-first score
- ✅ All current features preserved
- ✅ Zero breaking changes for users
- ✅ Skills work with stock init
- ✅ Clean separation of stock vs custom

### User Experience

**Before** (current):
```bash
# User must understand CLAUDE.md rules
# File routing enforced
# Session structure mandatory
# Custom scripts scattered
```

**After** (proposed):
```bash
# User gets clean stock workspace
npx claude-flow@alpha init

# User opts into features via skills
.claude/skills/session-management/  # Session best practices
.claude/skills/file-routing/        # File organization guidance
.claude/skills/captains-log/        # Journaling feature
.claude/skills/hooks-cascade/       # Auto-coordination

# Skills provide guidance, not enforcement
# Stock claude-flow + skills = full power
```

---

## Conclusion

Current workspace achieves 82/100 stock-first score with valuable features but concerning architectural violations. By refactoring to **features-as-skills architecture**, we can achieve **97/100 stock-first score** while preserving all functionality and improving:

- ✅ Maintainability (stock upgrades work)
- ✅ Portability (skills work across projects)
- ✅ Clarity (stock vs custom boundaries clear)
- ✅ User experience (opt-in features, no enforcement)
- ✅ Compliance (no stock file modifications)

The migration path is low-risk with clear rollback options and excellent user experience.

**Next Steps**: Create detailed features-as-skills specification and migration strategy.
