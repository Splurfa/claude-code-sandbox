# Memory Coordination

Advanced memory patterns that enable complex agent coordination without manual intervention.

## Beyond Basic Storage

In Phase 1: Foundations, you learned basic `store`/`retrieve`. Now you'll learn:
- Namespace strategies for organizing multi-agent data
- Coordination patterns (handoffs, checkpoints, contracts)
- Memory versioning and conflict resolution
- Cross-session learning patterns

## Namespace Strategies

### Standard Namespaces

**`default`**: General purpose, non-critical data
```javascript
key: "user-preferences"
namespace: "default"
```

**`coordination`**: Agent coordination and status
```javascript
key: "swarm/coordination/active-agents"
namespace: "coordination"
```

**`reasoning-bank`**: Learning patterns (custom extension)
```javascript
key: "pattern/api-design/rest-conventions"
namespace: "reasoning-bank"
```

**`captains-log`**: Journal entries (custom extension)
```javascript
key: "journal/2025-11-17/integration-insights"
namespace: "captains-log"
```

### Custom Namespace Organization

For complex projects, create project-specific namespaces:

```javascript
// Project: E-commerce platform
namespace: "ecommerce"

keys:
  "ecommerce/cart/api-contract"
  "ecommerce/payment/stripe-integration"
  "ecommerce/inventory/schema"
  "ecommerce/shipping/carriers"
```

**Why**: Isolates project data, easier cleanup, clearer organization.

## Memory Key Conventions

### Hierarchical Key Structure

**Format**: `<scope>/<agent-or-domain>/<specific-data>`

**Examples**:
```javascript
// Agent-specific status
"swarm/researcher/status"
"swarm/coder/progress"
"swarm/tester/test-results"

// Shared data between agents
"swarm/shared/api-contract"
"swarm/shared/database-schema"
"swarm/shared/architecture-decisions"

// Project-specific
"project/auth-system/api-endpoints"
"project/auth-system/security-requirements"
"project/auth-system/test-coverage"

// Session-specific
"session/session-20251117-120000/coordination"
"session/session-20251117-120000/artifacts-created"
```

**Benefits**:
- Easy to search (`pattern: "swarm/researcher/%"`)
- Clear ownership
- Logical grouping

## Coordination Patterns

### Pattern 1: Handoff Chain

**Scenario**: Agent A → Agent B → Agent C (sequential workflow)

```javascript
[Single Message]:

// Agent A (Research)
Task("Researcher", `
  1. Analyze authentication patterns
  2. Store findings in memory: 'handoff/step1/research-complete'
  3. Include: {recommended_approach, security_considerations, libraries}
`, "researcher")

// Agent B (Implementation)
Task("Backend Dev", `
  1. Wait for memory key 'handoff/step1/research-complete'
  2. Read research findings
  3. Implement authentication API based on findings
  4. Store API contract in memory: 'handoff/step2/implementation-complete'
  5. Include: {endpoints, request_formats, response_formats}
`, "backend-dev")

// Agent C (Testing)
Task("Tester", `
  1. Wait for memory key 'handoff/step2/implementation-complete'
  2. Read API contract
  3. Write comprehensive tests
  4. Store test results in memory: 'handoff/step3/testing-complete'
  5. Include: {coverage_percent, test_cases, edge_cases_covered}
`, "tester")
```

**Memory flow**:
```
Researcher → memory['handoff/step1/research-complete']
                ↓
         Backend Dev reads, implements
                ↓
            memory['handoff/step2/implementation-complete']
                ↓
            Tester reads, tests
                ↓
            memory['handoff/step3/testing-complete']
```

### Pattern 2: Fan-Out/Fan-In

**Scenario**: One agent creates specification, multiple implement, one integrates

```javascript
[Single Message]:

// Fan-Out Source
Task("System Architect", `
  1. Design microservices architecture
  2. Store in memory: 'fanout/architecture/spec'
  3. Include: {services: [{name, api_contract, dependencies}]}
`, "system-architect")

// Fan-Out Workers (Parallel)
Task("User Service Dev", `
  1. Wait for 'fanout/architecture/spec'
  2. Implement User microservice
  3. Store completion in 'fanout/workers/user-service-complete'
`, "backend-dev")

Task("Product Service Dev", `
  1. Wait for 'fanout/architecture/spec'
  2. Implement Product microservice
  3. Store completion in 'fanout/workers/product-service-complete'
`, "backend-dev")

Task("Order Service Dev", `
  1. Wait for 'fanout/architecture/spec'
  2. Implement Order microservice
  3. Store completion in 'fanout/workers/order-service-complete'
`, "backend-dev")

// Fan-In Integrator
Task("Integration Specialist", `
  1. Wait for all worker completions:
     - 'fanout/workers/user-service-complete'
     - 'fanout/workers/product-service-complete'
     - 'fanout/workers/order-service-complete'
  2. Create API gateway and service mesh
  3. Write integration tests
  4. Store in 'fanout/integration/complete'
`, "system-architect")
```

**Memory flow**:
```
          Architect
              ↓
       memory['spec']
         ↙    ↓    ↘
   User  Product  Order  (parallel workers)
     ↓      ↓       ↓
  complete complete complete
         ↘    ↓    ↙
        Integrator
```

### Pattern 3: Checkpoint System

**Scenario**: Multi-phase project with validation gates

```javascript
// Phase 1: Planning
Task("Planner", `
  1. Create project plan
  2. Store in 'checkpoint/phase1/plan'
  3. Set checkpoint status: 'checkpoint/gates/planning' = 'pending-approval'
`, "planner")

// Gate 1: Planning Approval (Human-in-the-loop)
Task("Planning Reviewer", `
  1. Wait for 'checkpoint/phase1/plan'
  2. Review plan quality
  3. If approved: Set 'checkpoint/gates/planning' = 'approved'
  4. Else: Set 'checkpoint/gates/planning' = 'rejected' with feedback
`, "reviewer")

// Phase 2: Implementation (Only starts if planning approved)
Task("Implementation Team", `
  1. Wait for 'checkpoint/gates/planning' = 'approved'
  2. Implement based on plan from 'checkpoint/phase1/plan'
  3. Store in 'checkpoint/phase2/implementation'
  4. Set 'checkpoint/gates/implementation' = 'pending-review'
`, "coder")

// Gate 2: Code Review
Task("Code Reviewer", `
  1. Wait for 'checkpoint/phase2/implementation'
  2. Review code quality, security, tests
  3. Set 'checkpoint/gates/implementation' = 'approved' or 'rejected'
`, "reviewer")

// Phase 3: Deployment (Only if implementation approved)
Task("DevOps", `
  1. Wait for 'checkpoint/gates/implementation' = 'approved'
  2. Deploy to production
  3. Set 'checkpoint/gates/deployment' = 'complete'
`, "cicd-engineer")
```

**Why this works**: Gates prevent phases from proceeding until quality standards met.

### Pattern 4: Shared State Management

**Scenario**: Multiple agents modify shared data structure

```javascript
// Agent 1: Initialize shared state
Task("Project Initializer", `
  1. Create project state structure
  2. Store in 'shared/project-state':
     {
       api_endpoints: [],
       test_coverage: 0,
       security_issues: [],
       performance_metrics: {}
     }
`, "planner")

// Agents 2-N: Update shared state
Task("API Developer", `
  1. Read 'shared/project-state'
  2. Add API endpoints to api_endpoints array
  3. Update 'shared/project-state' with new endpoints
`, "backend-dev")

Task("Tester", `
  1. Read 'shared/project-state'
  2. Run tests and calculate coverage
  3. Update 'shared/project-state' with test_coverage: 85
`, "tester")

Task("Security Auditor", `
  1. Read 'shared/project-state'
  2. Audit APIs and add findings to security_issues array
  3. Update 'shared/project-state'
`, "security-manager")

Task("Performance Analyzer", `
  1. Read 'shared/project-state'
  2. Run benchmarks
  3. Update 'shared/project-state' with performance_metrics
`, "perf-analyzer")

// Final aggregator
Task("Project Manager", `
  1. Wait for all agents to update 'shared/project-state'
  2. Generate final report from aggregated state
  3. Store report in 'shared/project-report'
`, "planner")
```

**Conflict handling**: Last write wins (simple), or use versioning (advanced).

## Memory Versioning

For conflict resolution when multiple agents update the same key:

### Version Tracking Pattern

```javascript
// Agent writes with version
const currentData = await memory.retrieve('shared/api-contract')
const version = currentData.version || 0

await memory.store('shared/api-contract', JSON.stringify({
  version: version + 1,
  data: newApiContract,
  updated_by: 'backend-dev',
  updated_at: new Date().toISOString()
}))

// Agent reads with version check
const data = await memory.retrieve('shared/api-contract')
if (data.version !== expectedVersion) {
  // Handle conflict: merge, override, or error
}
```

### Conflict Resolution Strategies

**1. Last Write Wins** (Simple)
```javascript
// Just overwrite, no version checking
await memory.store('key', newValue)
```

**2. Optimistic Locking** (Version check)
```javascript
const current = await memory.retrieve('key')
if (current.version !== myLastReadVersion) {
  throw new Error('Conflict: data changed since last read')
}
await memory.store('key', { ...newData, version: current.version + 1 })
```

**3. Merge Strategy** (Complex)
```javascript
const current = await memory.retrieve('key')
const merged = deepMerge(current.data, myChanges)
await memory.store('key', { data: merged, version: current.version + 1 })
```

## Cross-Session Learning (ReasoningBank)

Store learned patterns for future sessions:

```javascript
// Store successful pattern
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "pattern/authentication/jwt-best-practices",
  value: JSON.stringify({
    pattern_type: "authentication",
    approach: "JWT with refresh tokens",
    success_rate: 100,
    sessions_used: ["session-20251115-...", "session-20251117-..."],
    lessons_learned: [
      "Use httpOnly cookies for tokens",
      "Implement token rotation",
      "Short access token TTL (15min)"
    ],
    code_snippets: {...}
  }),
  namespace: "reasoning-bank"
})

// Retrieve in future sessions
const authPatterns = await memory.search("pattern/authentication/%", "reasoning-bank")
// Use learned patterns to guide new implementations
```

**Why this matters**: Agents get smarter over time by learning from past successes.

## Memory Search Techniques

### Pattern Matching

```javascript
// Find all researcher findings
mcp__claude_flow_alpha__memory_search({
  pattern: "swarm/researcher/%",
  namespace: "coordination",
  limit: 10
})

// Find all API contracts
mcp__claude_flow_alpha__memory_search({
  pattern: "swarm/shared/%-contract",
  namespace: "coordination"
})

// Find all checkpoint gates
mcp__claude_flow_alpha__memory_search({
  pattern: "checkpoint/gates/%",
  namespace: "coordination"
})
```

### List and Filter

```javascript
// Get all coordination keys
const allKeys = await memory.list("coordination")

// Filter programmatically
const activeAgents = allKeys.filter(key => key.includes('/status'))
```

## Real Example: Documentation Refactor Session

**This session** (`session-20251117-100232-docs-refactor-tutor`) uses memory coordination:

### Memory Keys Used

```javascript
// Session tracking
"session/docs-refactor/phase"
"session/docs-refactor/progress"

// Agent coordination
"swarm/researcher/content-analysis"
"swarm/writer/structure-proposal"
"swarm/reviewer/quality-feedback"

// Shared decisions
"swarm/shared/learning-path-architecture"
"swarm/shared/target-audience-profile"

// Checkpoints
"checkpoint/phase0/architecture-approved"
"checkpoint/phase1/alignment-complete"
"checkpoint/phase2/user-guide-complete"
```

### Coordination Flow

```
1. Researcher analyzes existing docs
   → Stores findings in "swarm/researcher/content-analysis"

2. Architect proposes structure
   → Reads research findings
   → Stores proposal in "swarm/shared/learning-path-architecture"

3. Human approves (HITL)
   → Sets "checkpoint/phase0/architecture-approved" = true

4. Writer creates guides
   → Reads approved architecture
   → Writes guides in parallel
   → Updates "swarm/shared/progress"

5. Reviewer validates
   → Reads completed guides
   → Stores feedback
```

## You'll Know You Understand When...

✅ You design custom namespace strategies for projects
✅ You implement handoff chains without manual coordination
✅ You use checkpoint gates for quality control
✅ You leverage cross-session learning patterns
✅ Your agents coordinate complex workflows autonomously

## Try This Exercise

**Build a microservices project with full coordination**:

```javascript
[Single Message]:

// Phase 1: Architecture
Task("Architect", "Design 3-service architecture. Store spec in 'fanout/spec'.", "system-architect")

// Phase 2: Parallel Service Development
Task("User Service", "Wait for spec. Build user service. Store in 'services/user/complete'.", "backend-dev")
Task("Product Service", "Wait for spec. Build product service. Store in 'services/product/complete'.", "backend-dev")
Task("Order Service", "Wait for spec. Build order service. Store in 'services/order/complete'.", "backend-dev")

// Phase 3: Integration (waits for all services)
Task("Integrator", "Wait for all services. Create API gateway. Store in 'integration/complete'.", "system-architect")

// Phase 4: Testing (waits for integration)
Task("E2E Tester", "Wait for integration. Write cross-service tests. Store in 'testing/complete'.", "tester")

// Phase 5: Final Review
Task("Reviewer", "Wait for all phases. Generate final report.", "reviewer")
```

**Success criteria**:
- Proper handoff chain through memory
- No agent starts before prerequisites ready
- All coordination automatic (no manual intervention)

## Next Step

Final piece of Phase 2: Essential Skills: comprehensive session management.

→ **Next**: [Session Management](session-management.md)
