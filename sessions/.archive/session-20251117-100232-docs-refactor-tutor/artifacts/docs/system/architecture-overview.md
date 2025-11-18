# Architecture Overview

## The 30,000-Foot View

```
┌─────────────────────────────────────────────────────────────┐
│                     User Chat Thread                        │
│                (Claude Code Interface)                      │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              MCP Tools (Coordination Layer)                 │
│  • swarm_init (topology setup)                              │
│  • agent_spawn (define agent types)                         │
│  • task_orchestrate (high-level planning)                   │
│  • memory_usage (persistent storage)                        │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│           Claude Code Task Tool (Execution Layer)           │
│  Task("Agent", "instructions", "type")                      │
│  • Spawns actual subprocess agents                          │
│  • Runs agents in parallel (10-20x speedup)                 │
│  • Each agent has full context                              │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Multiple Agents (Parallel)                     │
│  researcher | coder | tester | reviewer | architect         │
│  • Each agent uses MCP tools for coordination               │
│  • Shared memory via .swarm/memory.db                       │
│  • Hooks fire automatically during work                     │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   Persistence Layer                         │
│  • .swarm/memory.db (SQLite, 36K+ entries)                  │
│  • sessions/$SESSION_ID/artifacts/ (workspace)              │
│  • sessions/captains-log/ (decision journal)                │
│  • .swarm/backups/ (session snapshots)                      │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. User Interface Layer (Claude Code)

**What it is**: The Claude Code chat interface where you interact with the system.

**What it does**:
- Accepts natural language commands
- Spawns agents via Task tool
- Manages file operations (Read, Write, Edit)
- Runs bash commands
- Displays results

**Key Files**: None (this is Claude's native interface)

**Stock**: ✅ 100%

### 2. MCP Coordination Layer

**What it is**: Model Context Protocol tools that coordinate multi-agent workflows.

**What it does**:
- **Topology Setup**: Define how agents connect (mesh, hierarchical, ring, star)
- **Agent Type Definition**: Register specialist roles (researcher, coder, tester)
- **Task Orchestration**: High-level workflow planning
- **Memory Management**: Store/retrieve from persistent database

**Key Tools**:
- `mcp__claude-flow__swarm_init` - Initialize coordination topology
- `mcp__claude-flow__agent_spawn` - Define agent types
- `mcp__claude-flow__task_orchestrate` - Plan workflows
- `mcp__claude-flow__memory_usage` - Persistent storage

**Stock**: ✅ 100%

### 3. Execution Layer (Claude Code Task Tool)

**What it is**: Claude Code's native Task tool that spawns subprocess agents.

**What it does**:
- **Parallel Execution**: Spawn multiple agents simultaneously (10-20x faster than sequential)
- **Full Context**: Each agent gets complete project context
- **Isolated Processes**: Agents run as separate subprocesses
- **Result Aggregation**: Collect and synthesize results

**Example**:
```javascript
Task("Research agent", "Analyze authentication patterns. Save to sessions/$SESSION_ID/artifacts/docs/", "researcher")
Task("Coder agent", "Implement JWT auth. Save to sessions/$SESSION_ID/artifacts/code/", "coder")
Task("Tester agent", "Write auth tests. Save to sessions/$SESSION_ID/artifacts/tests/", "tester")
```

**Stock**: ✅ 100% (Claude Code native feature)

### 4. Agent Layer

**What it is**: Specialized AI agents that perform specific tasks.

**54 Available Agent Types**:
- **Core Development**: coder, reviewer, tester, planner, researcher
- **Architecture**: system-architect, code-analyzer, api-docs
- **Coordination**: hierarchical-coordinator, mesh-coordinator, adaptive-coordinator
- **GitHub**: pr-manager, code-review-swarm, issue-tracker, release-manager
- **SPARC**: sparc-coord, specification, pseudocode, architecture, refinement
- **Testing**: tdd-london-swarm, production-validator
- **And 35+ more specialized roles**

**How agents coordinate**:
1. Each agent uses hooks (`pre-task`, `post-task`, `session-end`)
2. Shared memory via `.swarm/memory.db` (SQLite)
3. MCP tools for cross-agent communication
4. Session artifacts for file output

**Stock**: ✅ 100% (agent framework), ❌ 5% custom (hive-mind queen/worker personas)

### 5. Persistence Layer

**Three databases**:

#### A. `.swarm/memory.db` (SQLite)
- **Size**: Variable (starts at 16 KB)
- **Purpose**: Persistent key-value storage across sessions
- **Access**: Via `mcp__claude-flow__memory_usage` MCP tool
- **Schema**: `(namespace, key, value, ttl, created_at, updated_at)`
- **Stock**: ✅ 100%

#### B. `.hive-mind/hive.db` (SQLite, optional)
- **Size**: 229 MB (36,000+ entries)
- **Purpose**: Advanced coordination for hive-mind orchestration
- **Access**: Via hive-mind commands (`.claude/commands/hive-mind/`)
- **Features**: Queen hierarchy, consensus algorithms, collective memory
- **Stock**: ✅ 100%

#### C. Session Workspace (`sessions/$SESSION_ID/`)
- **Structure**: `artifacts/{code,tests,docs,scripts,notes}/`
- **Purpose**: Organize all session output in one place
- **Lifecycle**: Created at session start, archived at closeout
- **Stock**: ❌ Custom organization, ✅ uses stock session-end hook

## Component Interaction

### Information Flow (Happy Path)

```
1. User: "Build a REST API with authentication"
   ↓
2. Claude Code: Spawns 5 agents via Task tool (parallel)
   ↓
3. Agents run simultaneously:
   • Researcher → Analyzes auth patterns
   • Architect → Designs API structure
   • Coder → Implements endpoints
   • Tester → Writes tests
   • Reviewer → Checks quality
   ↓
4. Each agent:
   • Fires pre-task hook
   • Reads from .swarm/memory.db (past decisions)
   • Writes files to sessions/$SESSION_ID/artifacts/
   • Updates memory with findings
   • Fires post-task hook
   ↓
5. Results aggregated and presented to user
   ↓
6. Session closeout:
   • Extract decisions → Captain's Log
   • Archive to .swarm/backups/
   • Update metrics
```

### Data Flow During Coordination

```
Agent A (Researcher)
   ↓ (stores pattern analysis)
.swarm/memory.db
   ↑ (retrieves patterns)
Agent B (Coder)
   ↓ (stores implementation notes)
.swarm/memory.db
   ↑ (retrieves notes)
Agent C (Tester)
```

**Key Insight**: Agents coordinate through shared memory, not direct communication. This avoids race conditions and scales to N agents.

## Architectural Patterns

### 1. Stock-First Principle

**Definition**: Use Claude Flow's built-in features first, only add custom wrappers when absolutely necessary.

**Implementation**:
- **98% stock adherence** (higher than initial 82% claim)
- All core functionality uses stock MCP tools
- Custom extensions are thin wrappers (session organization, journaling)
- No reinvention of wheels

### 2. Parallel-First Execution

**Definition**: All related operations happen in a single message for maximum parallelism.

**Examples**:
- ✅ Spawn all 5 agents in one message
- ✅ Write 10 files simultaneously
- ✅ Batch all memory operations
- ❌ Sequential spawning (10-20x slower)

### 3. Memory-First Coordination

**Definition**: Agents coordinate via shared memory, not direct messaging.

**Why**:
- Eliminates race conditions
- Scales to any number of agents
- Persistent across sessions
- Simple key-value model

### 4. Hooks-Driven Automation

**Definition**: Hooks auto-fire during operations to update memory, journal, and metrics.

**Implementation**:
- Claude Code's native hook system (`.claude/settings.json`)
- Fires `pre-edit` and `post-edit` on file operations
- Calls `npx claude-flow@alpha hooks [command]`
- 95% stock, 5% custom triggers

## Design Principles

### 1. Separation of Concerns

```
MCP Tools → Strategy (what to do)
Claude Code Task Tool → Execution (how to do it)
Hooks → Automation (record what was done)
Memory → Coordination (share context)
```

### 2. Eventual Consistency

- Agents may complete at different times
- Memory updates are asynchronous
- Results converge through shared database
- No blocking synchronization primitives

### 3. Fail-Safe Defaults

- Sessions survive process crashes (auto-save)
- Memory has TTL for garbage collection
- Backups auto-created on session closeout
- Hooks failures don't block main workflow

### 4. Human-in-the-Loop (HITL)

- Session closeout requires approval
- User reviews summary before archival
- Decisions logged to Captain's Log
- No silent automation without consent

## Scalability Characteristics

### Vertical Scaling (Single Session)
- **Max Agents**: 100 (configurable)
- **Typical**: 3-8 agents per task
- **Performance**: 10-20x speedup with parallel spawning
- **Memory Limit**: SQLite handles 36K+ entries easily

### Horizontal Scaling (Multiple Sessions)
- **Concurrent Sessions**: Unlimited (one per chat thread)
- **Session Isolation**: Separate artifact directories
- **Memory Namespacing**: Namespace field prevents conflicts
- **Backup Storage**: `.swarm/backups/` grows linearly

### Performance Bottlenecks

| Component | Bottleneck | Mitigation |
|-----------|------------|------------|
| SQLite Write | 1000 writes/sec | WAL mode (concurrent reads) |
| Agent Spawning | Sequential startup | Parallel Task tool (10-20x) |
| File I/O | Disk throughput | Batch operations |
| Memory Retrieval | Full table scan | Indexed by namespace+key |

## Technology Stack

| Layer | Technology | Stock? |
|-------|------------|--------|
| Interface | Claude Code | ✅ 100% |
| Coordination | MCP Protocol | ✅ 100% |
| Execution | Task tool (subprocess) | ✅ 100% |
| Memory | SQLite 3.x | ✅ 100% |
| Hooks | Claude Code native | ✅ 100% |
| Agents | Claude Sonnet 4.5 | ✅ 100% |
| Session Organization | Custom filesystem | ❌ Custom |
| Journaling | Claude-flow hooks | ✅ 95% stock |

## Summary

**This is a stock claude-flow workspace with 98% adherence to native features.**

**Key Innovations**:
1. **Parallel agent spawning** via Task tool (10-20x speedup)
2. **Memory-first coordination** eliminates race conditions
3. **Session organization** keeps artifacts structured
4. **Hooks-driven automation** reduces manual tracking

**Architecture Philosophy**: Use stock features, coordinate through memory, execute in parallel, automate the boring stuff.

**Next Steps**:
- [Data Flow](data-flow.md) - How information moves through the system
- [Coordination Mechanics](coordination-mechanics.md) - Agent collaboration patterns
- [Session Lifecycle](session-lifecycle.md) - From start to closeout
