# Queen Selection

In hierarchical and complex swarms, the queen coordinator makes or breaks success. Learn when to use queens and how to select the right strategy.

## What is a Queen?

A **queen** is a specialized agent that coordinates other agents in a swarm.

**Responsibilities**:
- Task decomposition and assignment
- Progress monitoring
- Conflict resolution
- Architectural decision-making
- Resource allocation
- Final integration

**Think of it like**: Project manager + architect combined.

## When to Use a Queen

### ✅ Use a Queen When:

**Complex projects** (8+ agents)
```
Building full-stack app with 12 agents → NEED QUEEN
```

**Hierarchical topology**
```
topology: "hierarchical" → ALWAYS use queen
```

**Need centralized decisions**
```
Architectural choices affecting all agents → NEED QUEEN
```

**Long-running projects**
```
Multi-session projects → QUEEN provides continuity
```

### ❌ Skip Queen When:

**Simple projects** (< 5 agents)
```
Building calculator with 3 agents → NO QUEEN NEEDED
```

**Mesh topology**
```
topology: "mesh" → Peers coordinate directly
```

**Quick tasks**
```
One-off code review → STAR topology, no queen
```

## The Three Queen Selection Strategies

### 1. Strategic Queen

**Focus**: Long-term planning, architecture, big-picture decisions

**When to use**:
- New projects (greenfield)
- Architecture decisions needed
- Long-term vision required
- Building foundations

**Behavior**:
- Spends time upfront on planning
- Creates detailed architecture
- Delegates implementation to specialists
- Reviews final integration

**Example**:
```javascript
Task("Strategic Queen", `
  STRATEGIC MODE:
  1. Analyze requirements and create architecture
  2. Decompose into team tasks
  3. Assign teams and monitor progress
  4. Make architectural decisions as needed
  5. Review final integration

  PROJECT: Build microservices e-commerce platform
  FOCUS: Long-term architecture, scalability, maintainability
`, "hierarchical-coordinator")
```

**Typical workflow**:
```
1. Analyze requirements (10% of time)
2. Design architecture (20% of time)
3. Decompose and assign (10% of time)
4. Monitor and guide (40% of time)
5. Review integration (20% of time)
```

**Best for**:
- New platforms
- System rewrites
- Architecture refactors
- Greenfield projects

### 2. Tactical Queen

**Focus**: Short-term execution, quick delivery, pragmatic decisions

**When to use**:
- Feature additions to existing systems
- Bug fixes and improvements
- Short sprints
- Clear requirements

**Behavior**:
- Minimal upfront planning
- Focuses on execution
- Makes quick pragmatic decisions
- Optimizes for speed

**Example**:
```javascript
Task("Tactical Queen", `
  TACTICAL MODE:
  1. Quick task breakdown
  2. Immediate agent assignment
  3. Monitor for blockers
  4. Make fast decisions to unblock
  5. Ship quickly

  PROJECT: Add user authentication to existing app
  FOCUS: Fast delivery, pragmatic choices, leverage existing patterns
`, "hierarchical-coordinator")
```

**Typical workflow**:
```
1. Quick task breakdown (5% of time)
2. Immediate assignment (5% of time)
3. Monitor progress (30% of time)
4. Unblock agents quickly (40% of time)
5. Fast integration (20% of time)
```

**Best for**:
- Feature development
- Bug fixes
- Maintenance work
- Well-understood problems

### 3. Adaptive Queen

**Focus**: Context-aware, switches between strategic and tactical based on needs

**When to use**:
- Mixed projects (some greenfield, some existing)
- Uncertain requirements
- Need flexibility
- Learning projects

**Behavior**:
- Analyzes context first
- Chooses strategy per task
- Switches modes as needed
- Balances speed and quality

**Example**:
```javascript
Task("Adaptive Queen", `
  ADAPTIVE MODE:
  1. Analyze each task's complexity and context
  2. For greenfield/architectural: Use STRATEGIC mode
  3. For implementation/features: Use TACTICAL mode
  4. Monitor and adjust strategy as needed

  PROJECT: Migrate legacy app to microservices (mixed mode)
  - New microservices → STRATEGIC
  - Legacy integration → TACTICAL
  - Database migration → STRATEGIC
  - UI updates → TACTICAL
`, "adaptive-coordinator")
```

**Decision logic**:
```javascript
if (task.isGreenfield || task.isArchitectural) {
  strategy = "STRATEGIC"
  // Take time for planning and architecture
} else if (task.isClear && task.hasPatterns) {
  strategy = "TACTICAL"
  // Execute quickly with known patterns
} else {
  strategy = "STRATEGIC"
  // Default to strategic for uncertainty
}
```

**Best for**:
- Mixed projects
- Migrations
- Refactors with new features
- Learning and experimentation

## Implementing Queen Selection

### Strategic Queen Example

```javascript
mcp__claude_flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 15,
  strategy: "specialized"  // Queen will delegate to specialists
})

Task("Strategic Queen - Platform Architect", `
  PROJECT: Build SaaS analytics platform from scratch

  PHASE 1: STRATEGIC PLANNING (Step 1-2)
  1. Analyze requirements and create system architecture
  2. Choose tech stack (databases, frameworks, infrastructure)
  3. Design microservices breakdown
  4. Create API contracts between services
  5. Define data models and schemas
  6. Store all decisions in memory for teams

  PHASE 2: TEAM COORDINATION (Step 3-10)
  1. Create 3 teams: Backend, Frontend, DevOps
  2. Assign team leads
  3. Delegate tasks to teams with clear contracts
  4. Monitor progress via memory coordination
  5. Make architectural decisions as blockers arise

  PHASE 3: INTEGRATION (Step 11-12)
  1. Review all team deliverables
  2. Integrate services
  3. Conduct final architecture review
  4. Approve for deployment

  STORE ALL DECISIONS IN: memory['queen/strategic/*']
`, "hierarchical-coordinator")

// Team leads await queen's architecture
Task("Backend Team Lead", "Wait for queen's architecture. Coordinate backend team.", "backend-dev")
Task("Frontend Team Lead", "Wait for queen's architecture. Coordinate frontend team.", "coder")
Task("DevOps Team Lead", "Wait for queen's architecture. Coordinate infrastructure.", "cicd-engineer")
```

### Tactical Queen Example

```javascript
mcp__claude_flow__swarm_init({
  topology: "hierarchical",
  maxAgents: 8,
  strategy: "balanced"
})

Task("Tactical Queen - Feature Delivery Lead", `
  PROJECT: Add payment processing to existing e-commerce app

  FAST EXECUTION MODE:
  1. Quick breakdown (30 min):
     - Stripe integration (backend)
     - Payment UI (frontend)
     - Security audit
     - Testing

  2. Immediate assignment with clear contracts

  3. Monitor for blockers:
     - Check memory every 10 min
     - Unblock immediately when agents stuck

  4. Quick integration:
     - Merge as soon as tests pass
     - Ship to staging ASAP

  GOAL: Ship efficiently
  STORE COORDINATION IN: memory['queen/tactical/*']
`, "hierarchical-coordinator")

Task("Backend Integration", "Implement Stripe. Fast execution.", "backend-dev")
Task("Frontend UI", "Payment forms. Fast execution.", "coder")
Task("Security Audit", "Quick security review.", "security-manager")
Task("E2E Tests", "Payment flow tests.", "tester")
```

### Adaptive Queen Example

```javascript
Task("Adaptive Queen - Migration Coordinator", `
  PROJECT: Migrate monolith to microservices

  ADAPTIVE STRATEGY:

  TASK ANALYSIS:
  For each task, determine mode:
  - If new service: STRATEGIC (design architecture)
  - If data migration: STRATEGIC (ensure data integrity)
  - If UI update: TACTICAL (quick changes)
  - If API wrapper: TACTICAL (known pattern)

  TASK BREAKDOWN:
  1. User Service (new) → STRATEGIC MODE
     - Design schema carefully
     - Plan authentication architecture
     - Create comprehensive API contract

  2. Product Service (new) → STRATEGIC MODE
     - Design product catalog architecture
     - Plan search/filter strategy

  3. Legacy API wrapper (known pattern) → TACTICAL MODE
     - Quick implementation
     - Use existing patterns

  4. React UI updates (simple) → TACTICAL MODE
     - Update components quickly
     - No major redesign

  COORDINATION:
  - STRATEGIC tasks: More upfront planning, detailed review
  - TACTICAL tasks: Fast assignment, quick review
  - Adjust strategy based on blockers

  STORE MODE DECISIONS IN: memory['queen/adaptive/mode-selection']
`, "adaptive-coordinator")
```

## Queen Decision Framework

### Strategic Decision Matrix

| Factor | Strategic | Tactical | Adaptive |
|--------|-----------|----------|----------|
| **Timeline** | Phases-months | Hours-days | Variable |
| **Complexity** | High | Low-medium | Mixed |
| **Uncertainty** | High | Low | Medium |
| **Team size** | 10+ agents | 3-8 agents | Variable |
| **Innovation** | New patterns | Known patterns | Mixed |
| **Risk** | High stakes | Low stakes | Mixed |

### Example Scenarios

**Scenario 1**: Build authentication system from scratch
- ✅ Strategic Queen
- Why: Greenfield, security-critical, long-term impact

**Scenario 2**: Add "Forgot Password" feature to existing auth
- ✅ Tactical Queen
- Why: Known pattern, existing system, quick delivery

**Scenario 3**: Refactor auth AND add social login
- ✅ Adaptive Queen
- Why: Mixed (refactor = strategic, social login = tactical)

## Queen Coordination Patterns

### Pattern 1: Delegation Chain

```javascript
Queen
  ↓ Assigns tasks
Team Lead
  ↓ Decomposes
Specialists
```

**Memory flow**:
```javascript
// Queen stores high-level plan
memory['queen/plan/overall-architecture']

// Team leads read and create detailed plans
memory['team/backend/detailed-tasks']
memory['team/frontend/detailed-tasks']

// Specialists read team plans and execute
memory['specialist/backend-dev-1/status']
```

### Pattern 2: Checkpoint Reviews

```javascript
// Queen sets checkpoints
memory['checkpoint/architecture-review'] = 'pending'

// Teams complete work
memory['team/backend/architecture'] = 'complete'
memory['team/frontend/architecture'] = 'complete'

// Queen reviews at checkpoint
if (allTeamsComplete) {
  memory['checkpoint/architecture-review'] = 'approved'
  memory['checkpoint/implementation-start'] = 'go'
}
```

### Pattern 3: Conflict Resolution

```javascript
// Conflict detected
memory['conflict/api-design/backend-vs-frontend'] = {
  backend_wants: "REST",
  frontend_wants: "GraphQL",
  status: "needs-resolution"
}

// Queen makes decision
memory['conflict/api-design/resolution'] = {
  decision: "REST for now, GraphQL later",
  reasoning: "Faster delivery, less complexity",
  decision_by: "strategic-queen"
}
```

## You'll Know You Understand When...

✅ You choose strategic vs tactical vs adaptive based on context
✅ You understand when to skip queens entirely
✅ You implement delegation chains properly
✅ Your queens make appropriate decisions
✅ Projects run smoother with queen coordination

## Try This Exercise

**Design queen selection for these projects**:

**Project 1**: Add dark mode to existing React app
- [ ] Queen type: __________
- [ ] Agents: __________
- [ ] Why: __________

**Project 2**: Build new cloud infrastructure from scratch
- [ ] Queen type: __________
- [ ] Agents: __________
- [ ] Why: __________

**Project 3**: Migrate database AND add new feature
- [ ] Queen type: __________
- [ ] Agents: __________
- [ ] Why: __________

**Answers**:
<details>
<summary>Click to reveal</summary>

1. **TACTICAL** or **NO QUEEN** - Simple feature, known pattern, 3-4 agents (UI dev, tester)
2. **STRATEGIC** - Greenfield, architecture-heavy, 10+ agents
3. **ADAPTIVE** - Mixed (migration = strategic, feature = tactical), 6-8 agents

</details>

## Next Step

Queens make decisions, but sometimes you need team consensus.

→ **Next**: [Consensus Mechanisms](consensus-mechanisms.md)
