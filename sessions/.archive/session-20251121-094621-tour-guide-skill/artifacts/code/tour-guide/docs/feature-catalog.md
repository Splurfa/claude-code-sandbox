# Feature Catalog - Complete System Reference

**Purpose**: Comprehensive reference of all workspace features for tour-guide to draw upon during tours.

**Source**: Compiled from Phase 1 research (workspace-inventory.md, features-catalog.md, skills-catalog.md)

---

## Core System Features

### 1. Parallel Agent Execution

**What it does**: Spawn multiple agents concurrently in a single message

**Performance**: 10-20x faster than sequential spawning

**Benefits**:
- 2.8-4.4x speed improvement for complex workflows
- 32.3% token reduction through efficient coordination
- 84.8% SWE-Bench solve rate (industry-leading)

**Key principle**: "1 MESSAGE = ALL RELATED OPERATIONS"

**Referenced in**: All pathways (Beginner: basic, Intermediate: patterns, Advanced: optimization)

---

### 2. Memory Coordination System

**What it does**: Persistent cross-session memory for agent coordination

**Storage**: SQLite database (`.swarm/memory.db`, 111MB)

**Current state**:
- 68,219 memory entries
- 15 active namespaces
- Cross-session persistence

**Operations via MCP**:
- Store: `mcp__claude-flow_alpha__memory_usage({ action: "store", ... })`
- Retrieve: `mcp__claude-flow_alpha__memory_usage({ action: "retrieve", ... })`
- Search: `mcp__claude-flow_alpha__memory_search({ pattern: "...", ... })`

**Referenced in**: Intermediate (basics), Advanced (patterns), Expert (internals)

---

### 3. Session Management (Containment-Promotion)

**What it does**: Isolated workspaces for all AI-generated content

**Lifecycle**:
1. Auto-initialize → `sessions/session-YYYYMMDD-HHMMSS-<topic>/`
2. Work phase → All artifacts to `sessions/<id>/artifacts/{code,tests,docs,scripts,notes}/`
3. Closeout → HITL approval → Archive to `.swarm/backups/`
4. Promotion → Curate valuable artifacts to main workspace

**Key rule**: ONE SESSION = ONE CHAT THREAD

**File routing**:
- ✅ `sessions/<id>/artifacts/code/` - All source code
- ✅ `sessions/<id>/artifacts/tests/` - All tests
- ✅ `sessions/<id>/artifacts/docs/` - All documentation
- ❌ Root directories - NEVER write here

**Referenced in**: All pathways (Beginner: basics, Intermediate: deep-dive, Advanced: architecture, Expert: implementation)

---

### 4. Hooks System (Auto-Fire Coordination)

**What it does**: Automatic pre/post operation coordination via Claude Code native hooks

**Configuration**: `.claude/settings.json`

**Hook types**:
- PreToolUse: Before file operations (validation, prep, context loading)
- PostToolUse: After file operations (memory update, metrics, backups)

**Stock adherence**: 98% (uses stock claude-flow CLI + Claude Code native hooks)

**Referenced in**: Intermediate (automation), Advanced (architecture), Expert (implementation details)

---

### 5. Swarm Topologies (4 Types)

**What it does**: Multiple coordination patterns for different use cases

**Topologies**:
1. **Mesh** (Peer-to-Peer) - Best for collaboration, distributed tasks
2. **Hierarchical** (Tree) - Best for delegation, clear command chain
3. **Star** (Centralized) - Best for single coordinator, many workers
4. **Ring** (Circular) - Best for sequential processing, pipeline

**Initialization**: `mcp__claude-flow__swarm_init({ topology: "mesh", ... })`

**Referenced in**: Intermediate (intro), Advanced (deep patterns), Expert (optimization)

---

### 6. Neural Network Training (27+ Models)

**What it does**: Train and deploy neural networks with WASM acceleration

**Features**:
- 27+ neural models available
- WASM SIMD acceleration for performance
- Distributed training support
- Pattern recognition and learning

**Operations via MCP**:
- Train: `mcp__claude-flow_alpha__neural_train({ pattern_type: "coordination", ... })`
- Status: `mcp__claude-flow_alpha__neural_status({ modelId: "..." })`
- Patterns: `mcp__claude-flow_alpha__neural_patterns({ action: "analyze", ... })`

**Referenced in**: Advanced (overview), Expert (internals)

---

## Custom Extensions (5% Custom Code)

### 1. Session Closeout with HITL

**Extension**: `.claude/skills/session-closeout/`

**Features**:
- Auto-generates session summary
- HITL approval required (no auto-closeout)
- Archives to `.swarm/backups/`
- Updates Captain's Log (`sessions/captains-log/YYYY-MM-DD.md`)
- Optional document promotion with routing guide

**Protocol**: Generate summary → Present for approval → If approved: Archive + log + cleanup

**Referenced in**: All pathways (lifecycle explanation)

---

### 2. Meta-Skill Routing

**Extension**: `.claude/skills/meta-skill/`

**Features**:
- Natural language matching (95% confidence)
- Category-based browsing (9 categories)
- Semantic search (TF-IDF algorithm)
- Multi-skill workflow suggestions
- Lazy loading (reduces context bloat)

**Thresholds**:
- >80%: Auto-invoke (high confidence)
- 30-80%: Present options menu
- <30%: Show category menu

**Referenced in**: All pathways (skill discovery)

---

### 3. Tutor Mode (Adaptive Learning)

**Extension**: `.claude/skills/tutor-mode/`

**Learning phases**:
1. Foundations (1-2 weeks) - Basics, first session, memory
2. Essential Skills (2-3 weeks) - Parallel execution, coordination
3. Intermediate (3-4 weeks) - Swarm topologies, consensus
4. Advanced (3-6 months) - Hive-mind, BFT, self-learning

**Features**:
- Quality-scored references (SAFE ≥70, CAUTIONARY 40-69, EXCLUDE <40)
- Progress tracking (stored in memory)
- Hands-on exercises with verification
- Adaptive difficulty
- Context-aware guidance

**Referenced in**: All pathways (practice recommendations)

---

### 4. File Routing Compliance

**Extension**: `.claude/skills/file-routing/`

**Features**:
- 3-question decision tree
- Session artifacts routing guide
- Document promotion checklist
- Compliance verification

**Decision tree**:
1. Is this a new file? → Session artifacts
2. Is this an existing project file? → Edit in place
3. Is this user-facing documentation? → Promote after review

**Referenced in**: Beginner (basics), Intermediate (rules), Advanced (architecture)

---

### 5. Verification & Quality Gates

**Extension**: `.claude/skills/verification-quality/`

**Features**:
- Truth scoring (0-100 scale)
- 0.95 accuracy threshold (95% required to pass)
- Automatic rollback on failure
- Quality metrics tracking
- Codebase reliability checks

**Quality gates**:
- Code quality verification
- Test coverage checks (>80% required)
- Security scanning
- Performance benchmarks
- Best practices enforcement

**Referenced in**: Advanced (quality overview), Expert (implementation)

---

## Integration Features

### GitHub Integration (5 Skills)

**Capabilities**:
- Workflow automation (CI/CD)
- Code review with swarm coordination
- Release management (versioning, testing, deployment)
- Project management (issues, boards, sprints)
- Multi-repo coordination

**Skills**: github-workflow-automation, github-code-review, github-release-management, github-project-management, github-multi-repo

**Referenced in**: Advanced/Expert pathways

---

### AgentDB Integration (5 Skills)

**Capabilities**:
- Vector search (semantic retrieval, 150x faster)
- Memory patterns (session, long-term, pattern learning)
- Optimization (4-32x memory reduction, HNSW indexing)
- Learning (9 RL algorithms: Q-Learning, SARSA, Actor-Critic, etc.)
- Advanced features (QUIC sync, multi-DB, hybrid search)

**Skills**: agentdb-vector-search, agentdb-memory-patterns, agentdb-optimization, agentdb-learning, agentdb-advanced

**Referenced in**: Advanced/Expert pathways

---

### Flow-Nexus Integration (3 Skills, Optional)

**Capabilities** (requires registration):
- Cloud-based swarm deployment
- E2B sandbox execution
- Neural network training (distributed)
- Event-driven workflows
- Platform management (auth, apps, payments)

**Skills**: flow-nexus-swarm, flow-nexus-neural, flow-nexus-platform

**Access**: https://flow-nexus.ruv.io

**Referenced in**: Expert pathway only

---

### Hive-Mind Coordination

**Storage**: `.hive-mind/hive.db` (3.5MB)

**Features**:
- Queen selection (strategic/tactical/adaptive)
- Worker specialization
- Scout exploration
- Memory manager
- Consensus building (majority, weighted, Byzantine)
- Persistent hive memory

**Consensus types**:
1. Majority - Simple voting (>50% agreement)
2. Weighted - Vote by expertise/confidence
3. Byzantine - BFT consensus (2/3+ majority, tolerates faulty nodes)

**Skill**: hive-mind-advanced

**Referenced in**: Advanced (overview), Expert (implementation)

---

### ReasoningBank Intelligence

**Features**:
- Trajectory tracking (decision history)
- Verdict judgment (outcome analysis)
- Memory distillation (pattern extraction)
- Pattern recognition (>70% accuracy)
- Experience replay (learn from history)
- Meta-cognitive system design

**Skills**: reasoningbank-intelligence, reasoningbank-agentdb (integrated with AgentDB)

**Referenced in**: Expert pathway

---

## Development Features

### SPARC Methodology

**Phases**:
1. Specification - Requirements analysis
2. Pseudocode - Algorithm design
3. Architecture - System design
4. Refinement - TDD implementation
5. Completion - Integration

**Commands**:
```bash
npx claude-flow sparc run <mode> "<task>"
npx claude-flow sparc tdd "<feature>"
npx claude-flow sparc batch <modes> "<task>"
```

**Skill**: sparc-methodology

**Referenced in**: Advanced/Expert pathways

---

### Pair Programming Mode

**Modes**:
- Driver - AI drives, you navigate
- Navigator - You drive, AI navigates
- Switch - Alternate roles

**Features**:
- Real-time verification (truth-score)
- Quality monitoring
- TDD workflows
- Debugging assistance
- Automatic role switching
- Security scanning

**Skill**: pair-programming

**Referenced in**: Advanced/Expert pathways

---

### Agent Spawning (80+ Agent Types)

**Categories**:
- Core (5) - researcher, coder, tester, planner, reviewer
- Consensus (7) - Byzantine, Raft, Gossip, CRDT, etc.
- Swarm (3) - hierarchical, mesh, adaptive coordinators
- Hive-Mind (5) - queen, worker, scout, memory-manager
- GitHub (13) - PR, issues, releases, workflows
- Flow-Nexus (9) - sandboxes, neural, auth, payments
- SPARC (4) - specification, pseudocode, architecture, refinement
- Templates (9) - agent templates
- Optimization (5) - load-balancer, resource-allocator
- Testing (2) - TDD swarm, production validator
- Development (1) - backend developer
- Specialized (1) - mobile developer
- Architecture (1) - system architect
- DevOps (1) - CI/CD engineer
- Documentation (1) - API docs generator
- Analysis (2) - code analyzer, code review swarm

**Total**: 80+ agent definitions in `.claude/agents/`

**Referenced in**: Beginner (basic types), Intermediate (spawning patterns), Advanced (advanced patterns), Expert (agent catalog)

---

## Performance Metrics

### Speed Improvements
- 2.8-4.4x speed improvement over sequential execution
- 32.3% token reduction through batching
- 10-20x faster agent spawning via concurrent execution
- 84.8% SWE-Bench solve rate (industry-leading)

### Efficiency Gains
- AgentDB: 150x faster vector search (HNSW indexing)
- AgentDB: 4-32x memory reduction (quantization)
- Parallel execution: ~3.5x average speedup
- Memory caching: Instant retrieval of computed results

### System Stats
- Memory database: 111MB with 68,219 entries
- Active sessions: 156MB workspace data
- Hive database: 3.5MB coordination state
- Session backups: 49 snapshots (avg 2.1MB each)

**Referenced in**: Advanced (optimization section), Expert (performance analysis)

---

## Stock-First Principles

### Stock Adherence Score: 82/100
- Core architecture: 100% stock
- Implementation patterns: 97.5% stock
- Extensions: Additive, not modifying

### 100% Stock (No modifications)
- Claude Flow core coordination
- MCP protocol implementation
- Swarm topology algorithms
- Memory storage mechanism
- Neural training capabilities
- GitHub integration tools

### Custom Extensions (Additive)
1. Session Management System
2. File Routing Protocol
3. HITL Session Closeout
4. Hooks Integration via Claude Code Native System

### What we explicitly avoid
- ❌ Forking Claude Flow codebase
- ❌ Modifying core coordination algorithms
- ❌ Replacing MCP protocol
- ❌ Custom agent execution runtimes
- ❌ Filesystem monkey-patching

**Referenced in**: Advanced (overview), Expert (deep comparison)

---

## System Architecture

### High-Level Components

```
┌───────────────────────────────────────────────────────────┐
│                   User Interface Layer                     │
│                      (Claude Code)                         │
├───────────────────────────────────────────────────────────┤
│                  MCP Integration Layer                     │
│  ┌─────────────────┐  ┌──────────────────────────────┐   │
│  │  Claude Flow    │  │  Optional MCPs               │   │
│  │  Alpha (Core)   │  │  (ruv-swarm, flow-nexus)     │   │
│  └─────────────────┘  └──────────────────────────────┘   │
├───────────────────────────────────────────────────────────┤
│              Coordination & State Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │    Swarm     │  │    Memory    │  │   Hooks      │   │
│  │ Coordination │  │  Management  │  │  Automation  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
├───────────────────────────────────────────────────────────┤
│              Session Management Layer                      │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Session Lifecycle Management (Custom Extension)   │   │
│  │  - Creation, Active Work, Closeout, Archival       │   │
│  └────────────────────────────────────────────────────┘   │
├───────────────────────────────────────────────────────────┤
│                  File System Layer                         │
│  ┌────────────────────────────────────────────────────┐   │
│  │  sessions/session-ID/artifacts/{code,tests,docs}   │   │
│  │  .swarm/{memory.db, backups/, coordination.json}   │   │
│  └────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

**Referenced in**: Intermediate (overview), Advanced (deep dive), Expert (internals)

---

## Key Documentation Locations

### Setup & Getting Started
- `docs/setup/quick-start.md` - Quick start guide
- `docs/setup/orientation.md` - Workspace orientation
- `docs/setup/what-is-claude-flow.md` - Claude Flow intro
- `docs/setup/cross-model-compatibility.md` - Multi-model support

### Operations & Daily Use
- `docs/operate/session-management.md` - Session lifecycle
- `docs/operate/first-session.md` - First session walkthrough
- `docs/operate/memory-basics.md` - Memory system basics
- `docs/operate/parallel-execution.md` - Concurrent operations
- `docs/operate/troubleshooting.md` - Common issues

### Building & Extending
- `docs/build/spawning-agents.md` - Agent creation
- `docs/build/create-skills.md` - Skill development
- `docs/build/custom-agents.md` - Custom agent types
- `docs/build/extending-system.md` - System extensions

### Coordination & Advanced
- `docs/coordinate/swarm-topologies.md` - Topology patterns
- `docs/coordinate/hive-mind.md` - Hive-Mind coordination
- `docs/coordinate/consensus-mechanisms.md` - Consensus algorithms
- `docs/coordinate/performance-tuning.md` - Optimization guide

### Reference & Deep Dive
- `docs/reference/architecture.md` - System architecture
- `docs/reference/agent-catalog.md` - All 80+ agents
- `docs/reference/limitations.md` - Known limitations
- `docs/reference/what-actually-works.md` - Battle-tested patterns

**Referenced in**: All pathways (appropriate to proficiency level)

---

## All 32 Skills Summary

### Core Workflow (5)
1. session-closeout - Natural language session closeout
2. meta-skill - Intelligent skill routing
3. file-routing - File placement compliance
4. prompt-improver - Prompt optimization
5. hooks-automation - Hook system management

### Learning & Education (3)
6. tutor-mode - Adaptive learning guide
7. skill-builder - Create custom skills
8. pair-programming - AI-assisted coding

### Multi-Agent Coordination (4)
9. swarm-orchestration - Multi-agent swarms
10. swarm-advanced - Advanced swarm patterns
11. hive-mind-advanced - Queen-led coordination
12. stream-chain - Stream-JSON chaining

### Quality & Verification (2)
13. verification-quality - Truth scoring & rollback
14. github-code-review - Code review automation

### AgentDB Integration (5)
15. agentdb-vector-search - Semantic retrieval
16. agentdb-optimization - Performance tuning
17. agentdb-memory-patterns - Persistent memory
18. agentdb-learning - Reinforcement learning
19. agentdb-advanced - Advanced features

### GitHub Integration (5)
20. github-workflow-automation - CI/CD automation
21. github-release-management - Release orchestration
22. github-project-management - Project tracking
23. github-multi-repo - Multi-repo coordination
24. github-code-review - (listed above)

### Flow-Nexus Integration (3)
25. flow-nexus-swarm - Cloud swarm deployment
26. flow-nexus-neural - Distributed neural training
27. flow-nexus-platform - Platform management

### Advanced Coordination (3)
28. reasoningbank-intelligence - Adaptive learning
29. reasoningbank-agentdb - ReasoningBank + AgentDB
30. agentic-jujutsu - Agent version control

### Development Methodology (2)
31. sparc-methodology - SPARC development
32. pair-programming - (listed above)

**Referenced in**: Meta-skill and skill discovery discussions across all pathways

---

This feature catalog provides the complete reference material for tour-guide to draw upon when creating proficiency-adapted content. All facts are sourced from Phase 1 verified research.
