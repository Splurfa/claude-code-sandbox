# Phase 2 – Claude-Flow MCP & Hive Architecture Analysis

## Source References
| ID | Reference | Notes |
| --- | --- | --- |
| [^claude-md] | `CLAUDE.md` (workspace root) | MCP tool usage patterns, agent execution flow, coordination patterns |
| [^hive-mind] | `docs/guides/concepts/hive-mind-system.md` | Hive-mind architecture, queen-worker patterns, consensus mechanisms |
| [^existing-research] | `inbox/codex-agent/code-mode-research/phase2-claude-flow-architecture.md` | Previous architecture analysis (referenced for comparison) |
| [^curriculum] | `inbox/codex-agent/claude-flow-curriculum/` | Educational materials on claude-flow foundations |

> **Note**: This analysis is based on workspace-local documentation and patterns. The actual `ruvnet/claude-flow` repository may have additional implementation details not captured here.

---

## 1. System Overview

### Architecture Philosophy
Claude-Flow is a **multi-agent orchestration platform** that coordinates specialized agents through:
- **MCP (Model Context Protocol)** for tool coordination and discovery
- **Hive-Mind System** for queen-led multi-agent coordination
- **SPARC Methodology** for systematic development workflows
- **Session-based artifact management** for persistent work tracking

### Core Design Principles
1. **Separation of Concerns**: MCP tools coordinate strategy; Claude Code's Task tool executes work
2. **Progressive Disclosure**: Tools and capabilities loaded on-demand to minimize token usage
3. **Multi-Agent Coordination**: Hive-mind system enables parallel execution with 10-20x speedup
4. **Memory Persistence**: Hybrid memory system (AgentDB + ReasoningBank) for collective intelligence

### High-Level Architecture
```
User/Agent Request
        ↓
Claude Code Task Tool (Execution Layer)
        ↓
MCP Tools (Coordination Layer)
        ↓
├── Swarm Coordinator (Topology Management)
├── Agent Manager (Agent Selection & Spawning)
├── Task Orchestrator (Workflow Planning)
├── Memory Manager (Persistent State)
└── Hive-Mind System (Queen-Worker Coordination)
        ↓
Session Artifacts (Persistent Storage)
```

---

## 2. MCP Tool Architecture

### MCP Tool Categories

#### Coordination Tools
- `swarm_init` - Initialize coordination topology
- `agent_spawn` - Define agent types for coordination
- `task_orchestrate` - Orchestrate high-level workflows

**Usage Pattern** (from CLAUDE.md):
```javascript
// MCP tools ONLY coordinate - they don't execute work
mcp__claude-flow__swarm_init({ topology: "hierarchical" })
mcp__claude-flow__agent_spawn({ type: "coder", count: 3 })
mcp__claude-flow__task_orchestrate({ task: "Build API", strategy: "parallel" })
```

#### Monitoring Tools
- `swarm_status` - Check swarm status
- `agent_list` - List active agents
- `agent_metrics` - Get agent performance metrics
- `task_status` - Check task execution status
- `task_results` - Retrieve task results

#### Memory & Neural Tools
- `memory_usage` - Store/retrieve from collective memory
- `neural_status` - Check neural model status
- `neural_train` - Train neural patterns
- `neural_patterns` - Query neural patterns

#### GitHub Integration Tools
- `github_swarm` - GitHub-based swarm coordination
- `repo_analyze` - Analyze repository structure
- `pr_enhance` - Enhance pull requests
- `issue_triage` - Triage GitHub issues
- `code_review` - Perform code reviews

#### System Tools
- `benchmark_run` - Run performance benchmarks
- `features_detect` - Detect system features
- `swarm_monitor` - Monitor swarm health

### MCP Tool Execution Model

**Key Principle** (from CLAUDE.md):
> "MCP coordinates the strategy, Claude Code's Task tool executes with real agents."

**Execution Flow**:
1. **Coordination Phase**: MCP tools set up topology, define agents, orchestrate workflows
2. **Execution Phase**: Claude Code's Task tool spawns actual agents that do the work
3. **Coordination Hooks**: Agents automatically run hooks for coordination during execution
4. **Memory Integration**: Results stored in memory via MCP memory tools

### Progressive Disclosure Implementation

Based on existing research, Claude-Flow implements progressive disclosure through:
- **Tool Metadata Index**: Lightweight metadata loaded first
- **Lazy Schema Loading**: Full tool schemas loaded only when needed
- **Token Reduction**: 98.7% reduction (150k → 2k tokens) for tool definitions
- **Search Capability**: `tools/search` with tiered detail levels (`names-only`, `basic`, `full`)

**File Structure Pattern** (inferred from research):
```
src/mcp/tools/
├── coordination/
│   ├── swarm_init.ts
│   ├── agent_spawn.ts
│   └── task_orchestrate.ts
├── monitoring/
│   ├── swarm_status.ts
│   └── agent_metrics.ts
└── loader.ts  # Progressive loader
```

---

## 3. Hive-Mind System Architecture

### Queen-Led Hierarchy

The Hive-Mind system implements a **queen-led hierarchical architecture** where strategic coordinators direct specialized worker agents through collective decision-making and shared memory.

#### Three Queen Types

**1. Strategic Queen**
- **Planning Horizon**: Long-term
- **Decision Style**: Analytical and methodical
- **Adaptability**: 0.7 (moderate)
- **Best For**: Research projects, architecture decisions, strategic planning

**2. Tactical Queen**
- **Planning Horizon**: Short-term
- **Decision Style**: Execution-focused and pragmatic
- **Adaptability**: 0.9 (high)
- **Best For**: Feature implementation, rapid problem-solving, tight deadlines

**3. Adaptive Queen**
- **Planning Horizon**: Adaptive (adjusts dynamically)
- **Decision Style**: Context-aware and flexible
- **Adaptability**: 1.0 (maximum)
- **Best For**: Optimization tasks, dynamic environments, performance tuning

#### Worker Specializations

Five core worker types:
1. **Architect Worker**: System design, architecture planning, technology evaluation
2. **Researcher Worker**: Information gathering, trend analysis, best practices research
3. **Implementer Worker (Coder)**: Code implementation, debugging, integration
4. **Tester Worker**: Test design, quality assurance, test automation
5. **Reviewer Worker**: Code review, quality assessment, standards compliance

### Consensus Mechanisms

**1. Majority Consensus**
- Simple voting: option with most votes wins
- Fast decision-making
- Best for low-stakes decisions

**2. Weighted Consensus**
- Queen vote counts 3x weight, workers count 1x
- Strategic perspective prioritized
- Balance between democracy and hierarchy

**3. Byzantine Consensus**
- Requires 2/3 majority (supermajority)
- Fault-tolerant and robust
- Best for security-sensitive or high-stakes decisions

### Hive-Mind Performance

**Speed Improvements**:
- **10-20x faster** than sequential agent creation
- **2.8-4.4x overall speed improvement**
- **84.8% SWE-Bench solve rate**

**Memory Performance**:
- **36,000+ memory entries** tracked
- **229 MB database** (`.hive-mind/hive.db`)
- **150x faster vector search** (AgentDB integration)
- **LRU cache** with memory pressure handling

---

## 4. Memory & Data Flow

### Hybrid Memory System

**AgentDB Integration**:
- HNSW semantic vector search
- RL-driven reflexion
- Quantization and skill consolidation
- 96-164x performance improvements

**ReasoningBank**:
- SQLite-backed pattern matching
- Deterministic embeddings
- Namespace isolation
- Shared CLI commands under `memory` namespace

### Tiered Caching Pipeline

```
L1 Memory Cache (in-process, TTL ~5 min)
    ↓ (cache miss)
L2 Distributed Cache (Redis-like)
    ↓ (cache miss)
L3 Persistent SQLite (WAL + indexing)
```

**Cache Coherence**: Writes update cache + backend + indexer to keep retrieval low-latency.

### Data Flow Sequence

1. **Request Intake**: Client/agent submits request
2. **Coordination Setup**: MCP tools initialize swarm topology (optional)
3. **Task Generation**: Orchestrator generates task
4. **Agent Selection**: Agent Manager selects appropriate agent(s)
5. **Memory Context**: Agent fetches context from Memory Manager (cache-first)
6. **Execution**: Agent executes, optionally invoking MCP tools
7. **Result Storage**: Results stored back in memory via Memory Manager
8. **Response**: Responses propagate back through coordination layer

---

## 5. Session Management & Artifacts

### Session Structure

**Session ID Format**: `session-$(date +%Y%m%d-%H%M%S)-<topic>`

**Directory Structure**:
```
sessions/$SESSION_ID/
├── artifacts/
│   ├── code/          # Source code
│   ├── tests/         # Test files
│   ├── docs/          # Documentation
│   ├── scripts/       # Scripts
│   └── notes/         # Notes
├── metadata.json      # Session metadata
└── session-summary.md # Session summary
```

### File Organization Rules

**Critical Rule** (from CLAUDE.md):
> "ALL working files MUST go to session artifacts. NEVER save working files to root folder."

**Exception**: Only edit existing project files (`package.json`, `CLAUDE.md`, etc.) in their original locations.

### Session Lifecycle

1. **Session Start**: Auto-create session directory on new chat
2. **Work Phase**: All artifacts saved to `sessions/$SESSION_ID/artifacts/`
3. **Session Closeout**: Archive to `.swarm/backups/` with HITL approval
4. **Memory Persistence**: Key insights stored in collective memory

---

## 6. Agent Execution Patterns

### Claude Code Task Tool (Primary Execution)

**Pattern** (from CLAUDE.md):
```javascript
// Single message with all agent spawning
Task("Agent Name", "Task description. Save to sessions/$SESSION_ID/artifacts/code/.", "agent-type")
```

**Available Agent Types** (54 total):
- **Core Development**: `coder`, `reviewer`, `tester`, `planner`, `researcher`
- **Swarm Coordination**: `hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`
- **Specialized**: `backend-dev`, `mobile-dev`, `ml-developer`, `system-architect`
- **SPARC Methodology**: `sparc-coord`, `specification`, `pseudocode`, `architecture`

### Execution Flow

**The Correct Pattern**:
1. **Optional**: Use MCP tools to set up coordination topology
2. **REQUIRED**: Use Claude Code's Task tool to spawn agents that do actual work
3. **REQUIRED**: Each agent runs hooks for coordination
4. **REQUIRED**: Batch all operations in single messages

### Golden Rule: "1 MESSAGE = ALL RELATED OPERATIONS"

**Mandatory Patterns**:
- **TodoWrite**: Batch ALL todos in ONE call (5-10+ todos minimum)
- **Task tool**: Batch ALL agent spawning in ONE message
- **File operations**: Batch ALL reads/writes/edits in ONE message
- **Memory operations**: Batch ALL memory store/retrieve in ONE message

---

## 7. Critical Integration Surfaces for Code-Mode

| Surface | Current Behavior | Integration Considerations |
| --- | --- | --- |
| **Agent Execution (Task Tool)** | Agents execute tasks directly, optionally calling MCP tools | Code-mode runner could be injected as agent type; tasks emit TypeScript instead of direct tool calls |
| **MCP Tool Registry** | Progressive loader with search; exposes tools as RPC definitions | Code-mode needs schema exports for TS client generation; extend loader to output code templates |
| **Memory System** | L1/L2/L3 caches + AgentDB/ReasoningBank | Code-mode writes/reads artifacts; ensure sandbox writes map to session artifacts without violating cache assumptions |
| **Hive-Mind Coordination** | Queen-worker patterns rely on deterministic coordination | When code-mode tasks spawn sub-workflows, preserve consensus hooks (wrap sandbox tasks as swarm subtasks) |
| **Session Artifacts** | All work saved to `sessions/$SESSION_ID/artifacts/` | Sandbox workspace should map to session artifacts directory structure |
| **Progressive Disclosure** | Tool metadata loaded lazily to minimize tokens | Code-mode should leverage same metadata index rather than rehydrating full schemas |

---

## 8. Security & Isolation

### Current Security Model

**Application Layer**:
- Input validation
- CSRF protection
- RBAC/ABAC policies
- OAuth/JWT auth flows

**Network Layer**:
- TLS encryption
- VPC isolation (for cloud deployments)
- Security groups

**Agent Isolation**:
- Agents run in separate execution contexts
- Memory namespaces provide isolation
- Session-based artifact separation

### Sandboxing Expectations

While Claude-Flow currently exposes MCP servers, there's recognition of the need for secure execution harnesses when running agent-generated code (relevant for code-mode integration).

**Flow-Nexus Sandboxes** (from CLAUDE.md):
- `sandbox_create` - Create cloud execution sandbox
- `sandbox_execute` - Execute code in sandbox
- `sandbox_upload` - Upload files to sandbox

These suggest existing infrastructure for sandboxed execution that could be leveraged for code-mode.

---

## 9. Constraints & Dependencies to Preserve

### Progressive Tool Loading
Must remain default to keep token budgets viable. Code-mode integrations should hook into the same metadata index rather than rehydrating full schemas.

### Legacy MCP Clients
Backward-compatible JSONRPC flows must be maintained. Any code-mode addition must coexist with existing CLI/server usage via feature flags.

### Swarm Reliability Metrics
Key performance indicators that must be preserved:
- **84.8% SWE-Bench solve rate**
- **2.8-4.4× speed improvement**
- **50+ concurrent agents** capability
- **10-20x parallel execution speedup**

### Hybrid Memory Guarantees
Deterministic retrieval latencies (2-3 ms) must be maintained. New storage/sandbox volumes must not break WAL/indexing or namespace isolation.

### Security Envelope
RBAC/ABAC, OAuth, encryption must extend to sandbox executors. Code-mode should reuse existing SecurityManager validations and logging pipelines.

---

## 10. Flow-Nexus Integration Points

### Cloud-Based Features

Flow-Nexus extends MCP capabilities with 70+ cloud-based orchestration tools:

**Key Categories**:
- **Sandboxes**: `sandbox_create`, `sandbox_execute`, `sandbox_upload` (cloud execution)
- **Templates**: `template_list`, `template_deploy` (pre-built project templates)
- **Neural AI**: `neural_train`, `neural_patterns`, `seraphina_chat` (AI assistant)
- **Storage**: `storage_upload`, `storage_list` (cloud file management)
- **Real-time**: `execution_stream_subscribe`, `realtime_subscribe` (live monitoring)

**Authentication Required**:
- Register: `mcp__flow-nexus__user_register` or `npx flow-nexus@latest register`
- Login: `mcp__flow-nexus__user_login` or `npx flow-nexus@latest login`

### Sandbox Infrastructure

Flow-Nexus provides cloud-based sandbox execution that could be leveraged for code-mode:
- Cloud execution environments
- File upload/download capabilities
- Real-time monitoring and streaming
- Template-based project scaffolding

---

## 11. API Contracts & Extension Points

### MCP Tool Interface Pattern

**Tool Definition Structure** (inferred):
```typescript
interface MCPTool {
  name: string;
  description: string;
  parameters: JSONSchema;
  handler: (params: any) => Promise<any>;
  metadata?: {
    category: string;
    tags: string[];
    tokenEstimate: number;
  };
}
```

### Extension Points

1. **Tool Registry**: Add new tools via `src/mcp/tools/**` directory structure
2. **Agent Types**: Define new agent types in `.claude/agents/` directory
3. **Hive-Mind Roles**: Extend queen/worker types via configuration
4. **Memory Namespaces**: Create isolated memory spaces for different concerns
5. **Session Hooks**: Add pre/post execution hooks for coordination

---

## 12. Summary: Key Architectural Characteristics

### Strengths for Code-Mode Integration

1. **Progressive Disclosure**: Already implemented, aligns with code-mode's file-system tool discovery
2. **Sandbox Infrastructure**: Flow-Nexus provides cloud sandbox capabilities
3. **Session Artifacts**: Clear file organization matches code-mode workspace expectations
4. **Memory System**: Persistent storage for skills/state aligns with code-mode skills concept
5. **Multi-Agent Coordination**: Hive-mind system can coordinate code-mode execution tasks

### Potential Friction Points

1. **Execution Model Mismatch**: Current model uses direct tool calls; code-mode uses code execution
2. **Schema Export**: Need to generate TypeScript clients from MCP tool schemas
3. **Sandbox Integration**: Need to bridge Flow-Nexus sandboxes with code-mode execution model
4. **Consensus Coordination**: Long-running code-mode tasks may impact swarm consensus timing
5. **Token Accounting**: Need to track code-mode token savings vs. traditional tool calls

---

[^claude-md]: `CLAUDE.md` - Workspace configuration and MCP tool usage patterns
[^hive-mind]: `docs/guides/concepts/hive-mind-system.md` - Hive-mind architecture documentation
[^existing-research]: `inbox/codex-agent/code-mode-research/phase2-claude-flow-architecture.md` - Previous architecture analysis
[^curriculum]: `inbox/codex-agent/claude-flow-curriculum/` - Educational materials

