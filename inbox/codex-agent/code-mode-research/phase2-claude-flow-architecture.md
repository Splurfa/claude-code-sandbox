# Phase 2 – Claude-Flow MCP & Hive Architecture Audit

## Source References
| ID | Reference | Notes |
| --- | --- | --- |
| [^readme] | `README.md` (v2.7.0) | High-level platform capabilities, skills, memory/perf data |
| [^archdoc] | `docs/architecture/ARCHITECTURE.md` | Detailed system diagrams, component APIs, storage + security layers |
| [^phase12] | `docs/phase-1-2-implementation-summary.md` | Progressive disclosure + `tools/search` implementation (98.7% token reduction) |
| [^mcp2025] | `docs/mcp-2025-implementation-summary.md` | MCP 2025-11 compliance (version negotiation, async jobs, registry) |

> All file paths refer to the Claude-Flow repository root (`/Users/splurfa/claude-code-sandbox/claude-flow` wrapper).

---

## 1. System Overview
- Claude-Flow is a **microservices-inspired, event-driven platform** that exposes CLI, REST, WebSocket, and MCP interfaces at the client layer backed by an API gateway (load balancer, auth, rate limiting). Core services include the Orchestrator, Agent Manager, Task Engine, Swarm Coordinator, Memory Manager, and MCP Server, each backed by infrastructure services (database, queue, cache, storage, monitoring).[^archdoc]
- The platform’s **value props** emphasize hive-mind swarms, persistent hybrid memory (AgentDB + ReasoningBank), hooks/skills, GitHub integrations, and Flow Nexus sandboxes.[^readme]

### High-Level Stack Diagram
```
Clients (CLI/API/WebSocket/MCP)
        ↓
API Gateway (LB + Auth + Router)
        ↓
Core Engine (Orchestrator ↔ Agent Manager ↔ Task Engine ↔ Swarm Coordinator ↔ Memory Manager ↔ MCP Server)
        ↓
Infrastructure (SQLite DB, Redis-like cache, queues, file storage, monitoring/logging)
```
*Derived from `docs/architecture/ARCHITECTURE.md` component diagrams.*[^archdoc]

---

## 2. Core Components & Responsibilities
| Component | Implementation Reference | Responsibilities |
| --- | --- | --- |
| **Orchestrator** | `src/core/orchestrator.ts` | Initializes subsystems, coordinates task execution, wires event bus, selects agents & memory context before execution.[^archdoc] |
| **Agent Manager** | `src/agents/manager.ts` | Spawns/schedules agents, maintains pools, selects best agent per task. Supports specialized agents (coder/tester/reviewer/etc.).[^archdoc] |
| **Task Engine** | `src/task/engine.ts` | Handles queueing, scheduling, execution lifecycle (submit → dequeue → execute → monitor).[^archdoc] |
| **Swarm Coordinator** | `src/swarm/coordinator.ts` | Builds topologies (centralized queen-led, mesh P2P, hierarchical, distributed) and coordinates multi-agent objectives.[^archdoc] |
| **Memory Manager** | `src/memory/manager.ts` | Provides tiered memory (L1/L2 caches + SQLite persistent store), indexing, retrieval with caching, integration with AgentDB & ReasoningBank features.[^archdoc][^readme] |
| **MCP Server Layer** | `src/mcp/*` | Hosts progressive tool registry, MCP 2025-11 compliance, async jobs, registry integration.[^phase12][^mcp2025] |

---

## 3. Multi-Agent Coordination Patterns
Claude-Flow natively supports four swarm topologies with distinct coordination semantics:[^archdoc]

1. **Centralized (Queen-led)** – Single coordinator agent manages consensus (Byzantine fault-tolerant at 66% threshold), dispatches tasks to worker agents, aggregates results.
2. **Mesh (Peer-to-Peer)** – Agents communicate P2P with distributed consensus/voting, adaptive load balancing, and circuit-breaker fault tolerance.
3. **Hierarchical (Multi-level)** – Tiered managers oversee domain-specific clusters (e.g., frontend vs backend), enabling resource pooling and cross-cluster messaging.
4. **Distributed (Cloud-Native)** – Region-aware agent pools behind a load balancer with distributed memory synchronization for large-scale workloads.

Consensus engine implementations incorporate weighted voting, quorum checks, and multi-round negotiation; metrics show ~2.3 s consensus time with 94.2% first-round success.[^archdoc]

---

## 4. Memory & Data Flow
### Hybrid Memory (AgentDB + ReasoningBank)
- **AgentDB v1.3.9** adds HNSW semantic vector search, RL-driven reflexion, quantization, and skill consolidation with 96–164x performance improvements.[^readme]
- **ReasoningBank** provides SQLite-backed pattern matching with deterministic embeddings and namespace isolation; both systems share CLI commands under `memory` namespace for storage/query/status operations.[^readme]

### Tiered Caching Pipeline
```
L1 Memory Cache (in-process, TTL ~5 min) → L2 Distributed Cache (Redis-like) → L3 Persistent SQLite (WAL + indexing)
```
Cache misses cascade across tiers; writes update cache + backend + indexer to keep retrieval low-latency.[^archdoc]

### Data Flow Sequence
1. Client submits request → API gateway authenticates/validates.
2. Orchestrator generates task → Task Engine queues.
3. Agent Manager selects agent (considering swarm strategy).
4. Agent fetches context from Memory Manager (cache-first).
5. Agent executes, optionally invoking MCP tools, storing results back in memory.
6. Responses propagate back through Task Engine → Orchestrator → client.[^archdoc]

---

## 5. MCP Tooling Architecture

### Progressive Disclosure & Tool Search
- Phase 1/2 work refactored MCP tools into `src/mcp/tools/**`, each exporting a definition plus metadata template. A new dynamic loader (`src/mcp/tools/loader.ts`) scans directories, builds a lightweight metadata index, and lazily loads full tool schemas only when called, delivering a **98.7% token reduction** (150k → 2k tokens).[^phase12]
- `src/mcp/tools/system/search.ts` implements `tools/search` with tiered detail levels (`names-only`, `basic`, `full`) and token-savings metrics, enabling programs (or humans) to query by category, tags, or keywords before loading heavy schemas.[^phase12]

### MCP 2025-11 Compliance
- New components include `protocol/version-negotiation.ts`, `async/job-manager-mcp25.ts`, `registry/mcp-registry-client-2025.ts`, `validation/schema-validator-2025.ts`, and `server-mcp-2025.ts`, all orchestrated through `server-factory.ts`. Features:
  - **Version negotiation** with YYYY-MM semantics and capability exchange.
  - **Async job handles** (poll/resume, progress %, TTL, configurable persistence).
  - **MCP Registry integration** (health reporting, metadata, discovery).
  - **JSON Schema 1.1 (Draft 2020-12)** validation pipeline with caching.
  - Feature flags for gradual rollout and legacy client fallback via CLI `--mcp2025` or config toggles.[^mcp2025]

### Tool Registry Flow
```
Tool Metadata Scan (loader.ts) → Progressive Registry (tool-registry-progressive.ts) → On-demand Tool Load → MCP Server (server-mcp-2025.ts) → Client (stdio/http)
```
This structure keeps in-process token cost low, supports hot reloads, and plugs into the MCP 2025 async + registry stack.

---

## 6. Security & Isolation
- **Application Layer**: Input validation, CSRF protection, RBAC/ABAC policies, OAuth/JWT auth flows managed via SecurityManager (`docs/architecture/ARCHITECTURE.md`).[^archdoc]
- **Network Layer**: TLS, VPC isolation, security groups, plus container/Kubernetes guardrails for deployments.
- **Sandboxing Expectations**: While Claude-Flow currently exposes MCP servers, the doc stresses need for secure execution harnesses when running agent-generated code (relevant for future code-mode integration).[^archdoc][^phase12]
- **Byzantine Detection**: Consensus engine detects malicious agents with 99.1% accuracy; circuit breakers + retry manager enforce fault tolerance.[^archdoc]

---

## 7. Critical Integration Surfaces for Code-Mode

| Surface | Existing Behavior | Integration Considerations |
| --- | --- | --- |
| **Agent Loop (Orchestrator + Agent Manager)** | Agents execute tasks directly by calling MCP tools via tool registry | Code-mode runner could be injected as an agent type or harness so tasks emit TypeScript instead of direct tool calls |
| **MCP Tool Registry** | Progressive loader + search; exposes tools as RPC definitions | Code-mode needs schema exports for TS client generation; current metadata already structured, so extend loader to output code templates |
| **Async Job Manager** | Handles MCP 2025 async semantics (poll/resume) | Sandbox execution may produce long-running jobs; integrate job handles to bridge sandbox progress reporting |
| **Memory System** | L1/L2/L3 caches + AgentDB/ReasoningBank CLI | Code-mode writes/reads artifacts; ensure sandbox writes map to `.swarm` or Flow Nexus storage without violating cache assumptions |
| **Swarm Topologies** | Multi-agent patterns rely on deterministic coordination | When code-mode tasks spawn sub-workflows, need to preserve consensus hooks (e.g., wrap sandbox tasks as swarm subtasks) |
| **Observability & Security** | Metrics, logging, circuit breakers, RBAC | Sandbox logs must feed existing metrics collectors; ensure sandbox inherits RBAC constraints and PII tokenization policies |

---

## 8. Constraints & Dependencies to Preserve
- **Progressive Tool Loading** must remain default to keep token budgets viable—code-mode integrations should hook into the same metadata index rather than rehydrating full schemas.[^phase12]
- **Legacy MCP Clients** rely on backward-compatible JSONRPC flows; any code-mode addition must coexist with existing CLI/server usage via feature flags already defined in `server-factory.ts`.[^mcp2025]
- **Swarm Reliability Metrics** (SWE-Bench score 84.8%, 2.8–4.4× speed improvement, 50+ concurrent agents) are selling points—new execution paths cannot regress these KPIs without clear mitigation.[^readme][^archdoc]
- **Hybrid Memory Guarantees** ensure deterministic retrieval latencies (2–3 ms). Introduce new storage/sandbox volumes carefully to avoid breaking WAL/indexing or namespace isolation.[^archdoc][^readme]
- **Security Envelope** (RBAC/ABAC, OAuth, encryption) must extend to sandbox executors; code-mode should reuse existing SecurityManager validations and logging pipelines.[^archdoc]

---

[^readme]: Repository `README.md` (Claude-Flow v2.7.0 overview, skills, memory + performance metrics).
[^archdoc]: `docs/architecture/ARCHITECTURE.md` (system diagrams, component snippets, security/performance details).
[^phase12]: `docs/phase-1-2-implementation-summary.md` (progressive disclosure, `tools/search`, loader + template).
[^mcp2025]: `docs/mcp-2025-implementation-summary.md` (version negotiation, async jobs, registry, schema validation).

