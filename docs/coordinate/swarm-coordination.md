# Advanced Swarm Coordination

> **Prerequisites**: Complete [Quick Start](../setup/quick-start.md) and [Agent Spawning](../build/spawning-agents.md)

Master multi-agent coordination with topology selection, consensus mechanisms, collective memory, and queen-led hierarchical orchestration for production-scale Claude Flow systems.

---

## Table of Contents

1. [What is Swarm Coordination?](#what-is-swarm-coordination)
2. [Topology Patterns](#topology-patterns)
3. [Consensus Mechanisms](#consensus-mechanisms)
4. [Collective Memory](#collective-memory)
5. [Queen Selection & Roles](#queen-selection--roles)
6. [Real-World Examples](#real-world-examples)
7. [Performance & Scaling](#performance--scaling)
8. [Troubleshooting](#troubleshooting)

---

## What is Swarm Coordination?

**Definition**: Multi-agent orchestration where specialized AI agents collaborate through shared memory, consensus voting, and hierarchical leadership to solve complex problems at scale.

**When to use swarm coordination**:
- ✅ Complex features requiring multiple specialists (backend + frontend + testing)
- ✅ Architecture decisions needing multiple perspectives
- ✅ Large refactors involving 10+ agents
- ✅ Production-critical systems requiring consensus gates
- ✅ Cross-session learning and pattern reuse

**When NOT to use**:
- ❌ Simple tasks (< 5 agents)
- ❌ Quick one-off fixes
- ❌ Experimentation and learning
- ❌ Single-file changes

**Key Benefits**:
- **84.8% SWE-Bench solve rate** with coordinated agents
- **2.8-4.4x speed improvement** through parallel execution
- **32.3% token reduction** via efficient memory sharing
- **Self-healing workflows** with adaptive coordination

---

## Topology Patterns

Topology determines how agents communicate and coordinate. Choose based on task complexity, parallelism needs, and coordination overhead.

### Topology Comparison Chart

| Feature | Mesh | Hierarchical | Ring | Star | Adaptive |
|---------|------|--------------|------|------|----------|
| **Communication** | Peer-to-peer | Multi-level | Circular | Centralized | Dynamic |
| **Best For** | Equal specialists | Large teams | Sequential | Simple tasks | Evolving work |
| **Coordination Overhead** | Low | Medium | Low | Very Low | Variable |
| **Scalability** | 5-10 agents | 20+ agents | 3-8 agents | 3-5 agents | 5-20 agents |
| **Fault Tolerance** | High | Medium | Low | Very Low | High |
| **Decision Speed** | Fast | Medium | Slow | Very Fast | Adaptive |
| **Queen Required** | No | Yes | No | Yes | Yes |
| **Use Case** | Parallel research | Full-stack dev | Pipeline tasks | Quick prototypes | Complex projects |

### 1. Mesh Topology

**Pattern**: All agents communicate directly with each other through shared memory.

```
    Agent 1 ←→ Agent 2
        ↕           ↕
    Agent 3 ←→ Agent 4
```

**When to use**:
- Equal-level specialists (all coders, all researchers)
- Independent parallel tasks
- Flat team structure
- High agent autonomy needed

**Example**:
```javascript
// Initialize mesh swarm
mcp__claude-flow__swarm_init({
  topology: "mesh",
  maxAgents: 8,
  strategy: "balanced"
})

// Spawn equal specialists
Task("Backend Researcher", "Research Node.js patterns. Store findings in memory['research/backend']", "researcher")
Task("Frontend Researcher", "Research React patterns. Store findings in memory['research/frontend']", "researcher")
Task("Database Researcher", "Research PostgreSQL patterns. Store findings in memory['research/database']", "researcher")
Task("Security Researcher", "Research auth patterns. Store findings in memory['research/security']", "researcher")

// All agents read from each other's research
// No hierarchy, pure collaboration
```

**Memory pattern**:
```
mesh/
├── agent-1/status    # Each agent writes own status
├── agent-2/status
├── agent-3/status
└── shared/           # Collective findings
    ├── research
    ├── decisions
    └── blockers
```

### 2. Hierarchical Topology

**Pattern**: Queen coordinator leads tactical team leads, who direct specialist workers.

```
           Queen Coordinator
          (Strategic/Adaptive)
                  |
      +-----------+-----------+
      |           |           |
  Team Lead 1  Team Lead 2  Team Lead 3
  (Tactical)   (Tactical)   (Tactical)
      |           |           |
   +--+--+     +--+--+     +--+--+
   |  |  |     |  |  |     |  |  |
   S1 S2 S3   S4 S5 S6    S7 S8 S9
```

**When to use**:
- Large teams (10+ agents)
- Multi-phase projects
- Complex coordination needs
- Cross-team dependencies
- Production systems

**Example - Full-Stack E-Commerce**:
```javascript
mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 20,
  strategy: "adaptive"
})

// Strategic Queen
Task("Strategic Queen - Project Architect", `
  HIVE-MIND COORDINATION MODE

  PROJECT: Build distributed e-commerce platform

  RESPONSIBILITIES:
  1. High-level architecture and vision
  2. Coordinate 3 team leads (Backend, Frontend, DevOps)
  3. Make strategic decisions (tech stack, architecture patterns)
  4. Byzantine consensus for critical decisions
  5. Monitor cross-team integration
  6. Store learnings in ReasoningBank

  COORDINATION:
  - Use memory namespace 'hive-mind/strategic/*'
  - Set checkpoints with consensus gates
  - Store architectural decisions for team leads
  - Review integration points
  - Collect learnings for ReasoningBank

  ADAPTIVE BEHAVIOR:
  - Start strategic (heavy planning)
  - Switch to tactical as implementation progresses
  - Auto-adjust based on team velocity and blockers
`, "hierarchical-coordinator")

// Tactical Team Leads
Task("Backend Team Lead", `
  TEAM: Backend Services (8 specialists)

  READ: memory['hive-mind/strategic/architecture']
  STORE: memory['hive-mind/backend/*']

  COORDINATE:
  - 5 backend developers
  - 2 database specialists
  - 1 API documentation specialist

  CONSENSUS: Majority vote on API contracts
  REPORT: Daily status to Strategic Queen
`, "backend-dev")

Task("Frontend Team Lead", `
  TEAM: Frontend UI (6 specialists)

  READ: memory['hive-mind/strategic/architecture']
  STORE: memory['hive-mind/frontend/*']

  COORDINATE:
  - 4 frontend developers
  - 1 UX specialist
  - 1 accessibility specialist

  CONSENSUS: Weighted vote on framework choices
  REPORT: Daily status to Strategic Queen
`, "coder")

Task("DevOps Team Lead", `
  TEAM: Infrastructure (4 specialists)

  READ: memory['hive-mind/strategic/architecture']
  STORE: memory['hive-mind/devops/*']

  COORDINATE:
  - 2 DevOps engineers
  - 1 Security specialist
  - 1 Monitoring specialist

  CONSENSUS: Byzantine for deployment approvals
  REPORT: Daily status to Strategic Queen
`, "cicd-engineer")

// Specialist workers (spawn 18 total)
// Each reads from team lead and writes to team namespace
```

**Memory hierarchy**:
```
hive-mind/
├── strategic/              # Queen decisions
│   ├── architecture
│   ├── tech-stack
│   └── integration-contracts
├── backend/                # Backend team
│   ├── team-lead/status
│   ├── specialists/progress
│   └── api-contracts
├── frontend/               # Frontend team
│   ├── team-lead/status
│   ├── specialists/progress
│   └── component-contracts
├── devops/                 # DevOps team
│   ├── team-lead/status
│   ├── infrastructure/status
│   └── deployment-readiness
└── consensus/              # Votes & decisions
    ├── database-choice
    ├── framework-choice
    └── deployment-approval
```

### 3. Ring Topology

**Pattern**: Agents pass work sequentially in a circle.

```
Agent 1 → Agent 2 → Agent 3
   ↑                    ↓
Agent 6 ← Agent 5 ← Agent 4
```

**When to use**:
- Sequential pipeline tasks
- Data transformation workflows
- Iterative refinement processes
- Code → Test → Review → Deploy cycles

**Example - SPARC Workflow**:
```javascript
mcp__claude-flow__swarm_init({
  topology: "ring",
  maxAgents: 6
})

// Sequential task handoff
Task("Specification Agent", "Write specs → pass to memory['ring/specs']", "specification")
Task("Pseudocode Agent", "Read specs → write pseudocode → pass to memory['ring/pseudocode']", "pseudocode")
Task("Architecture Agent", "Read pseudocode → design architecture → pass to memory['ring/architecture']", "architecture")
Task("Coder Agent", "Read architecture → implement code → pass to memory['ring/code']", "coder")
Task("Tester Agent", "Read code → write tests → pass to memory['ring/tests']", "tester")
Task("Reviewer Agent", "Read tests → review → feedback to Specification", "reviewer")
```

### 4. Star Topology

**Pattern**: All agents report to central coordinator.

```
    Agent 2
       |
Agent 1 - Queen - Agent 3
       |
    Agent 4
```

**When to use**:
- Simple centralized coordination
- Quick prototypes
- Small teams (3-5 agents)
- Single point of control needed

**Example**:
```javascript
mcp__claude-flow__swarm_init({
  topology: "star",
  maxAgents: 5
})

Task("Queen Coordinator", "Assign tasks, collect results from all workers", "coordinator")
Task("Worker 1", "Execute assigned task, report to Queen", "coder")
Task("Worker 2", "Execute assigned task, report to Queen", "tester")
Task("Worker 3", "Execute assigned task, report to Queen", "reviewer")
```

### 5. Adaptive Topology

**Pattern**: Automatically switches between mesh/hierarchical/ring based on task complexity.

**When to use**:
- Workload characteristics change during execution
- Unknown complexity at start
- Need automatic optimization
- Complex evolving projects

**Adaptive Logic**:
```javascript
mcp__claude-flow__swarm_init({
  topology: "adaptive",
  maxAgents: 15,
  strategy: "adaptive"
})

// Auto-switches based on:
// - Simple parallel tasks → mesh (speed)
// - Complex tasks → hierarchical (coordination)
// - Sequential phases → ring (pipeline)
// - Bottlenecks detected → reorganize topology
```

**Real Example - Workspace Documentation Refactoring**:
```
Session: session-20251117-233300-workspace-docs-optimization
Topology: Large Mesh (12+ agents for maximum parallelism)
Queen: Adaptive Coordinator
Consensus: Byzantine (2/3 majority for structural decisions)

Started: mesh (parallel analysis)
Switched: hierarchical (complex synthesis)
Result: Completed in 45 minutes (vs 3+ hours single-agent)
```

---

## Consensus Mechanisms

Consensus determines how agents make collective decisions. Choose based on decision criticality, agent expertise weighting, and fault tolerance needs.

### Consensus Algorithm Guide

| Mechanism | Vote Requirement | Speed | Fault Tolerance | Best For |
|-----------|------------------|-------|-----------------|----------|
| **Majority** | >50% agreement | Fast | Low | Code reviews, style decisions |
| **Weighted** | Queen vote = 3x | Medium | Medium | Architecture choices, tech stack |
| **Byzantine** | ≥2/3 agreement | Slow | Very High | Production deploys, security |
| **Unanimous** | 100% agreement | Very Slow | Maximum | Critical safety decisions |

### 1. Majority Consensus

**Rule**: >50% of agents must agree.

**When to use**:
- Non-critical decisions
- Code review approvals
- Style guide choices
- Test coverage gates

**Implementation**:
```javascript
// Store votes
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "consensus/code-review-pr-123",
  namespace: "coordination",
  value: JSON.stringify({
    proposal: "Approve PR #123",
    votes: {
      "agent-1": "approve",
      "agent-2": "approve",
      "agent-3": "reject",
      "agent-4": "approve",
      "agent-5": "approve"
    },
    result: "approved",  // 4/5 = 80% > 50%
    mechanism: "majority"
  })
})
```

**Example - Code Review Swarm**:
```javascript
Task("Reviewer 1", "Vote on PR #123 code quality", "reviewer")
Task("Reviewer 2", "Vote on PR #123 test coverage", "reviewer")
Task("Reviewer 3", "Vote on PR #123 security", "reviewer")

// Majority (2/3) approves → merge
```

### 2. Weighted Consensus

**Rule**: Queen/expert votes count 3x normal agent votes.

**When to use**:
- Architecture decisions
- Tech stack selection
- Design pattern choices
- Strategic direction

**Implementation**:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "consensus/database-choice",
  namespace: "coordination",
  value: JSON.stringify({
    proposal: "Use PostgreSQL vs MongoDB",
    votes: {
      "queen": { vote: "PostgreSQL", weight: 3 },
      "db-specialist": { vote: "PostgreSQL", weight: 2 },
      "backend-dev-1": { vote: "MongoDB", weight: 1 },
      "backend-dev-2": { vote: "MongoDB", weight: 1 },
      "backend-dev-3": { vote: "PostgreSQL", weight: 1 }
    },
    weighted_score: {
      "PostgreSQL": 6,  // 3 + 2 + 1 = 6
      "MongoDB": 2      // 1 + 1 = 2
    },
    result: "PostgreSQL",
    mechanism: "weighted"
  })
})
```

**Example - Architecture Decision**:
```javascript
Task("Strategic Queen", "Vote on database choice (weight=3)", "hierarchical-coordinator")
Task("Database Architect", "Vote on database choice (weight=2)", "code-analyzer")
Task("Backend Dev 1", "Vote on database choice (weight=1)", "backend-dev")
Task("Backend Dev 2", "Vote on database choice (weight=1)", "backend-dev")

// Queen + Architect > 3 backend devs
```

### 3. Byzantine Consensus

**Rule**: ≥2/3 of agents must agree (resistant to failures/malicious agents).

**When to use**:
- Production deployments
- Security decisions
- Compliance requirements
- Financial transactions
- Data deletion

**Implementation**:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "consensus/production-deploy",
  namespace: "coordination",
  value: JSON.stringify({
    proposal: "Deploy v2.0 to production",
    votes: {
      "security-specialist": "approve",
      "devops-lead": "approve",
      "backend-lead": "approve",
      "frontend-lead": "reject",
      "qa-lead": "approve",
      "monitoring-lead": "approve"
    },
    result: "approved",  // 5/6 = 83% >= 67% (2/3)
    mechanism: "byzantine",
    safety_threshold: 0.67
  })
})
```

**Example - Production Deployment Gate**:
```javascript
Task("Security Specialist", "Audit deployment security", "security-manager")
Task("DevOps Lead", "Verify infrastructure readiness", "cicd-engineer")
Task("Backend Lead", "Confirm API stability", "backend-dev")
Task("Frontend Lead", "Validate UI/UX", "coder")
Task("QA Lead", "Review test results", "tester")
Task("Monitoring Lead", "Check observability", "performance-benchmarker")

// Require 4/6 (67%) for deploy approval
// Single agent failure doesn't block critical decision
```

**Real Example - Byzantine Consensus Integration**:
```
Session: session-20251115-162200-hive-mind-integration
Task: Integrate Byzantine consensus into hive-mind system
Agents: 4 coordinated through memory
Consensus: 2/3 majority for architectural decisions
Result: Completed in 25 minutes, pattern stored in ReasoningBank
```

### 4. Unanimous Consensus

**Rule**: 100% of agents must agree.

**When to use**:
- Critical safety decisions
- Legal compliance approvals
- Irreversible operations
- Maximum risk aversion

**Implementation**:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "consensus/database-deletion",
  namespace: "coordination",
  value: JSON.stringify({
    proposal: "Delete production database backup",
    votes: {
      "dba-1": "reject",  // Single reject blocks
      "dba-2": "approve",
      "security-lead": "approve",
      "compliance-officer": "approve"
    },
    result: "rejected",  // 3/4 = 75% < 100%
    mechanism: "unanimous",
    safety_threshold: 1.0
  })
})
```

---

## Collective Memory

Shared memory enables agent coordination, decision tracking, and cross-session learning.

### Memory Namespace Patterns

**Standard hierarchy**:
```
coordination/
├── swarm/
│   ├── queen/
│   │   ├── royal-report        # Strategic updates
│   │   ├── directives          # Commands to teams
│   │   └── blockers            # Escalated issues
│   ├── shared/
│   │   ├── decisions           # Collective choices
│   │   ├── architecture        # System design
│   │   └── integration-points  # Cross-team contracts
│   ├── worker-{id}/
│   │   ├── status              # Individual progress
│   │   ├── findings            # Discoveries
│   │   └── needs-review        # Escalation queue
│   └── consensus/
│       ├── votes               # Active votes
│       ├── results             # Decisions made
│       └── history             # Past decisions
├── sessions/
│   └── {session-id}/
│       ├── objectives          # Mission goals
│       ├── progress            # Completion %
│       └── artifacts           # Deliverables
└── reasoning-bank/
    ├── patterns/               # Learned solutions
    ├── trajectories/           # Decision paths
    └── verdicts/               # Success/failure analysis
```

### Memory Operations

**Store decision**:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "swarm/shared/architecture",
  namespace: "coordination",
  value: JSON.stringify({
    pattern: "microservices",
    services: ["user", "product", "order", "payment"],
    communication: "REST + gRPC",
    decided_by: "Strategic Queen",
    consensus: "weighted",
    timestamp: Date.now()
  })
})
```

**Retrieve for coordination**:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "swarm/shared/architecture",
  namespace: "coordination"
})
```

**Search patterns**:
```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "swarm/worker-%",
  namespace: "coordination"
})
// Returns: All worker status entries
```

### Cross-Session Learning (ReasoningBank)

**Store successful pattern**:
```javascript
// Session 1: Solve problem
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "reasoning-bank/pattern/ecommerce-microservices",
  namespace: "coordination",
  value: JSON.stringify({
    domain: "e-commerce",
    architecture: "microservices",
    services: ["user", "product", "order", "payment"],
    topology: "hierarchical",
    queen_type: "strategic",
    consensus: "weighted",
    success_rate: 90,
    completion_time: "3 hours",
    lessons: [
      "Payment service needs Byzantine consensus",
      "Product service scales independently",
      "Order orchestration requires saga pattern"
    ]
  })
})

// Session 2: Auto-apply pattern
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "reasoning-bank/pattern/ecommerce-microservices",
  namespace: "coordination"
})
// Use as foundation → success_rate now 95%

// Session 3+: Continuous improvement
// Pattern refined based on new learnings → success_rate → 98%
```

---

## Queen Selection & Roles

Queens coordinate swarm activities. Choose type based on project phase and complexity.

### Queen Types Comparison

| Queen Type | Best Phase | Decision Style | Delegation | Adaptability |
|------------|------------|----------------|------------|--------------|
| **Strategic** | Planning | Long-term vision | High-level teams | Low |
| **Tactical** | Execution | Task-focused | Individual agents | Medium |
| **Adaptive** | Dynamic | Context-aware | Auto-adjust | High |

### Strategic Queen

**Use for**:
- Project kickoff and planning
- Architecture design
- High-level coordination
- Long-term vision

**Behavior**:
```javascript
Task("Strategic Queen", `
  RESPONSIBILITIES:
  - Define high-level architecture
  - Set strategic direction
  - Coordinate team leads (not individual workers)
  - Make critical technology decisions
  - Monitor cross-team integration

  DELEGATION:
  - Spawn tactical queens for each team
  - Let team leads handle specialist coordination
  - Focus on big picture, not implementation details

  MEMORY USAGE:
  - Store: hive-mind/strategic/*
  - Read: hive-mind/*/team-lead/status
  - Monitor: hive-mind/consensus/*
`, "hierarchical-coordinator")
```

### Tactical Queen

**Use for**:
- Implementation phase
- Task execution
- Direct specialist coordination
- Sprint-level work

**Behavior**:
```javascript
Task("Tactical Queen - Backend Lead", `
  RESPONSIBILITIES:
  - Coordinate 8 backend specialists
  - Assign specific implementation tasks
  - Review code and unblock developers
  - Report progress to Strategic Queen

  DELEGATION:
  - Direct worker instructions
  - Task breakdowns and assignments
  - Daily status checks

  MEMORY USAGE:
  - Store: hive-mind/backend/*
  - Read: hive-mind/strategic/architecture
  - Report: hive-mind/strategic/team-status
`, "backend-dev")
```

### Adaptive Queen

**Use for**:
- Complex evolving projects
- Unknown complexity at start
- Need automatic optimization
- Multi-phase work

**Behavior**:
```javascript
Task("Adaptive Queen", `
  AUTO-SWITCHING LOGIC:
  - Start: Strategic mode (planning heavy)
  - Detect: Implementation begins → switch to Tactical
  - Detect: Blockers accumulate → spawn specialist sub-queens
  - Detect: Integration phase → return to Strategic

  METRICS MONITORED:
  - Team velocity
  - Blocker count
  - Complexity indicators
  - Resource utilization

  ADAPTATION TRIGGERS:
  - High complexity → more hierarchy
  - Simple tasks → flatten to mesh
  - Bottlenecks → reorganize topology
`, "adaptive-coordinator")
```

**Real Example - Workspace Optimization**:
```
Session: session-20251117-233300-workspace-docs-optimization
Queen: Adaptive Coordinator
Behavior:
  [23:33] Started: Strategic (analyze requirements)
  [23:45] Switched: Tactical (assign specific tasks to 12 agents)
  [00:15] Switched: Strategic (synthesize findings)
Result: 130MB workspace analyzed, 53 docs audited, synthesis complete
```

---

## Real-World Examples

### Example 1: Full-Stack E-Commerce Platform

**Objective**: Build production e-commerce system with microservices

**Swarm Configuration**:
```javascript
mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 20,
  strategy: "adaptive"
})
```

**Team Structure**:
- **Strategic Queen** (1): Project architect
- **Tactical Team Leads** (3): Backend, Frontend, DevOps
- **Specialist Workers** (18): 6 per team

**Consensus Gates**:
- **Weighted**: Database choice, framework selection
- **Byzantine**: Production deployment, security policies
- **Majority**: Code reviews, test coverage

**Coordination Ledger** (`COORDINATION-LEDGER.md`):
```markdown
## [10:00:00] Strategic Queen - Architecture Decision
**Decision**: Microservices architecture with 4 services
**Consensus**: Weighted (Queen=3, Architect=2, Devs=1 each)
**Vote**: PostgreSQL (7 weighted votes) vs MongoDB (3 weighted votes)
**Result**: PostgreSQL approved
**Memory**: hive-mind/strategic/architecture

## [10:15:30] Backend Team Lead - API Contract Proposal
**Team**: Backend Services (8 agents)
**Proposal**: REST + gRPC for inter-service communication
**Consensus**: Majority (6/8 approve)
**Memory**: hive-mind/backend/api-contracts

## [11:45:00] DevOps Team Lead - Production Deploy Request
**Team**: Infrastructure (4 agents)
**Proposal**: Deploy v1.0 to production
**Consensus**: Byzantine (4/4 required for safety)
**Vote**: 3/4 approve → REJECTED (need 100% for prod)
**Blocker**: Security specialist flagged SSL config issue
**Action**: Fix SSL → re-vote at 12:30
```

**Memory Snapshot**:
```javascript
{
  "hive-mind/strategic/architecture": {
    "pattern": "microservices",
    "services": ["user", "product", "order", "payment"]
  },
  "hive-mind/backend/api-contracts": {
    "protocol": "REST + gRPC",
    "auth": "JWT",
    "rate_limiting": "token_bucket"
  },
  "hive-mind/consensus/production-deploy-v1": {
    "status": "rejected",
    "blocker": "SSL configuration",
    "retry_at": "12:30"
  }
}
```

**Outcome**:
- **Duration**: 6 hours (vs 3 days single-agent)
- **Agents**: 20 coordinated specialists
- **Consensus Votes**: 12 (weighted + Byzantine)
- **Pattern Stored**: reasoning-bank/ecommerce-microservices
- **Success Rate**: 92% (first implementation)

### Example 2: Documentation Refactoring with Workspace Optimization

**Objective**: Audit 53 docs, rebuild folder structure, optimize workspace

**Swarm Configuration**:
```javascript
mcp__claude-flow__swarm_init({
  topology: "mesh",  // Auto-switched to hierarchical
  maxAgents: 12,
  strategy: "adaptive"
})
```

**Team Structure**:
- **Adaptive Queen** (1): Mission coordinator
- **Workspace Mapping Team** (4):
  - Hidden Folders Specialist
  - Project Structure Analyst
  - Node Ecosystem Mapper
  - Integration Points Tracer
- **Docs Optimization Team** (6):
  - Content Auditor
  - Intent Extractor
  - Framework Specialist
  - Structure Architect
  - Migration Planner
  - Quality Validator
- **Coordination Team** (2):
  - Synthesis Coordinator
  - Evidence Compiler

**Consensus Configuration**:
- **Byzantine**: Structural decisions (2/3 majority)
- **Weighted**: Framework selection
- **Majority**: File categorization

**Coordination Ledger** (`COORDINATION-LEDGER.md`):
```markdown
Session: session-20251117-233300-workspace-docs-optimization
Started: 2025-11-17 23:33:00
Topology: Large Mesh → Hierarchical (auto-switched)
Queen: Adaptive Coordinator
Consensus: Byzantine (2/3 majority for structural decisions)

## [23:33:00] Mission Start - Power Demonstration
**Agent**: Adaptive Queen
**Action**: Deploy 12 agents in parallel (maximum parallelism)
**Reasoning**: User requested "POWER over everything else"
**Memory**: workspace-optimization-20251117

## [23:38:45] USER CORRECTION - Strategy Adaptation
**Type**: Nudge (fundamental understanding correction)
**Priority**: CRITICAL
**Issue**: Agents operating under constrained view of projects/ and docs/
**Impact**: Docs scope too narrow, projects/ needs rethink
**Action**: Redirect agents, add HITL checkpoints, first principles design

## [00:15:00] Final Synthesis Complete
**Evidence**: 23,500+ words analysis
**Deliverables**:
  - Workspace map (9 hidden folders, visible structure)
  - Docs quality audit (6.2/10 score, 52% accuracy)
  - Framework recommendation (Activity-Centric, 95/100 fit)
  - Promotion workflow (Tag-based, handles 1000+ docs/hr)
**Memory**: workspace-optimization-20251117/synthesis/complete
```

**Outcome**:
- **Duration**: 45 minutes (vs 3+ hours single-agent)
- **Analysis**: 130MB workspace, 53 docs audited
- **Agents**: 12 specialists in parallel
- **Evidence**: 23,500+ words comprehensive synthesis
- **User Feedback**: "Power demonstrated successfully"

### Example 3: Hive-Mind Integration with Byzantine Consensus

**Objective**: Integrate Byzantine consensus mechanism into hive-mind system

**Swarm Configuration**:
```javascript
mcp__claude-flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 4,
  strategy: "balanced"
})
```

**Team Structure**:
- **Queen** (1): Integration coordinator
- **Implementation Team** (2): Consensus builder, CRDT synchronizer
- **Validation Team** (2): Security manager, Test engineer

**Coordination Flow**:
```markdown
## [15:30:00] Integration Started
**Queen**: Coordinate Byzantine consensus integration
**Memory**: hive-mind/byzantine-integration/*

## [15:45:00] Consensus Builder - Implementation Complete
**Task**: Build Byzantine fault-tolerant voting
**Files**: consensus-builder.js, byzantine-validator.js
**Memory**: hive-mind/implementation/consensus-algorithm

## [16:00:00] Security Manager - Audit Complete
**Task**: Verify Byzantine resistance (⅔ threshold)
**Result**: PASSED (resistant to 1/3 malicious agents)
**Memory**: hive-mind/validation/security-audit

## [16:15:00] Integration Complete
**Consensus Vote**: 4/4 agents approve (unanimous)
**Pattern Stored**: reasoning-bank/byzantine-consensus-integration
**Duration**: 25 minutes
**Memory**: hive-mind/patterns/byzantine-consensus
```

**Outcome**:
- **Duration**: 25 minutes
- **Agents**: 4 coordinated through memory
- **Consensus**: Byzantine (2/3 majority)
- **Pattern Reuse**: Stored in ReasoningBank for future integrations
- **Success Rate**: 100% (first implementation)

---

## Performance & Scaling

### Scaling Guidelines

| Swarm Size | Topology | Queen Type | Consensus | Best For |
|------------|----------|------------|-----------|----------|
| 3-5 agents | Star/Mesh | Tactical | Majority | Quick tasks |
| 5-10 agents | Mesh | Tactical | Weighted | Parallel research |
| 10-20 agents | Hierarchical | Strategic | Weighted | Full-stack projects |
| 20+ agents | Hierarchical | Adaptive | Byzantine | Enterprise systems |

### Performance Metrics

**Real benchmarks from claude-flow**:
- **84.8% SWE-Bench solve rate** with coordinated swarms
- **2.8-4.4x speed improvement** vs single-agent
- **32.3% token reduction** via memory sharing
- **27+ neural models** for pattern recognition

**Optimization tips**:
1. **Use mesh for parallelism** (3-10 independent specialists)
2. **Use hierarchical for scale** (10+ agents with teams)
3. **Add Byzantine for safety** (production deployments only)
4. **Store patterns in ReasoningBank** (reuse successful approaches)
5. **Monitor memory usage** (avoid namespace collisions)
6. **Batch operations** (spawn all agents in single message)

### Memory Optimization

**Efficient namespace design**:
```javascript
// ✅ GOOD: Clear hierarchy
hive-mind/strategic/architecture
hive-mind/backend/team-lead/status
hive-mind/backend/specialists/progress

// ❌ BAD: Flat, collision-prone
backend-status
status
architecture
```

**Memory cleanup**:
```javascript
// Auto-cleanup via TTL (30 minutes for task data)
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "task/temp-data",
  namespace: "coordination",
  value: data,
  ttl: 1800  // 30 minutes
})

// Manual cleanup at session end
npx claude-flow@alpha hooks session-end --export-metrics true
// Creates backup at .swarm/backups/session-*.json
```

---

## Troubleshooting

### Common Issues

**1. Agents not coordinating**

**Symptom**: Agents work independently, ignore shared decisions

**Diagnosis**:
```bash
# Check memory writes
npx claude-flow@alpha hive-mind memory

# Verify namespace usage
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "hive-mind/%",
  namespace: "coordination"
})
```

**Solution**:
```javascript
// Ensure every agent reads shared memory
Task("Agent", `
  BEFORE WORK:
  1. Read memory['hive-mind/strategic/architecture']
  2. Read memory['hive-mind/shared/decisions']
  3. Align work with collective direction

  DURING WORK:
  4. Store progress in memory['hive-mind/worker-{id}/status']
  5. Store findings in memory['hive-mind/shared/discoveries']

  AFTER WORK:
  6. Report completion to memory['hive-mind/worker-{id}/complete']
`, "coder")
```

**2. Consensus votes stalling**

**Symptom**: Byzantine consensus never reaches 2/3 threshold

**Diagnosis**:
```javascript
// Check vote status
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "consensus/production-deploy",
  namespace: "coordination"
})
// Shows: 2/6 votes (need 4/6)
```

**Solution**:
```javascript
// Option 1: Lower threshold for non-critical decisions
// Use weighted instead of Byzantine

// Option 2: Add timeout with fallback
Task("Queen", `
  If consensus not reached in 5 minutes:
  1. Identify non-voting agents
  2. Request explicit vote
  3. Escalate to human if still blocked
`, "hierarchical-coordinator")

// Option 3: Switch to majority for speed
// Only use Byzantine for critical decisions
```

**3. Memory namespace collisions**

**Symptom**: Agents overwriting each other's data

**Diagnosis**:
```bash
# Check for duplicate keys
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "coordination"
})
```

**Solution**:
```javascript
// Use unique agent IDs in keys
memory['hive-mind/worker-{agent-id}/status']  // ✅ Unique
memory['hive-mind/status']                      // ❌ Collision risk

// Use timestamp for versioning
memory['hive-mind/decision-{timestamp}']
```

**4. Queen overwhelmed in star topology**

**Symptom**: Queen becomes bottleneck, slow responses

**Solution**:
```javascript
// Switch to hierarchical with team leads
mcp__claude-flow__swarm_init({
  topology: "hierarchical",  // Was: "star"
  maxAgents: 15,
  strategy: "adaptive"
})

// Spawn tactical queens to distribute load
Task("Backend Team Lead", "Coordinate 5 backend devs", "backend-dev")
Task("Frontend Team Lead", "Coordinate 5 frontend devs", "coder")
// Strategic queen now coordinates 2 team leads, not 10 individuals
```

**5. Adaptive topology thrashing**

**Symptom**: Topology switches too frequently, coordination overhead

**Solution**:
```javascript
// Add switching cooldown
Task("Adaptive Queen", `
  TOPOLOGY SWITCHING RULES:
  - Minimum 15 minutes between switches
  - Require 3 consecutive complexity signals
  - Human approval for major reorganizations
`, "adaptive-coordinator")
```

---

## Quick Reference

### Topology Selection Decision Tree

```
Is work parallelizable?
├─ Yes → All agents equal expertise?
│        ├─ Yes → MESH (fastest)
│        └─ No → Need coordination?
│                ├─ Yes → HIERARCHICAL
│                └─ No → STAR (simple)
└─ No → Sequential pipeline?
         ├─ Yes → RING
         └─ No → Complex/evolving?
                 ├─ Yes → ADAPTIVE
                 └─ No → STAR
```

### Consensus Selection Guide

```
Production deployment? → BYZANTINE
Security decision? → BYZANTINE
Architecture choice? → WEIGHTED
Framework selection? → WEIGHTED
Code review? → MAJORITY
Style guide? → MAJORITY
```

### Memory Namespace Templates

```javascript
// Strategic decisions
hive-mind/strategic/{decision}

// Team coordination
hive-mind/{team}/team-lead/{topic}
hive-mind/{team}/specialists/{topic}

// Individual agent status
hive-mind/worker-{id}/{topic}

// Shared knowledge
hive-mind/shared/{topic}

// Consensus tracking
hive-mind/consensus/{decision-id}

// Cross-session learning
reasoning-bank/pattern/{domain}
reasoning-bank/trajectory/{scenario}
reasoning-bank/verdict/{outcome}
```

---

## Next Steps

**Master swarm coordination**:
1. ✅ Complete [Quick Start](../setup/quick-start.md)
2. ✅ Practice topology selection with real projects
3. ✅ Implement consensus mechanisms
4. ✅ Build cross-session learning with memory coordination
5. → **Next**: [Performance Tuning](performance-tuning.md) for optimization
6. → **Next**: [Extending the System](../build/extending-system.md) for custom workflows

**Related Documentation**:
- [Architecture Guide](../reference/architecture.md) - System internals and data flow
- [Memory Coordination](../operate/memory-coordination-tutorial.md) - Shared memory patterns
- [Custom Agents](../build/custom-agents.md) - Building specialized agents
- [What Actually Works](../reference/what-actually-works.md) - Reality check on features

---

**Questions? Issues?**
- Check [Troubleshooting](../operate/troubleshooting.md)
- Review real examples in `sessions/*/COORDINATION-LEDGER.md`
- Explore active swarms: `npx claude-flow@alpha hive-mind status`
