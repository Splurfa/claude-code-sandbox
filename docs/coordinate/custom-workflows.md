# Custom Workflows

Combine topologies, queen selection, and consensus to build workflows tailored to your specific needs.

## What is a Custom Workflow?

A **custom workflow** is a coordination pattern you design for a specific type of project, combining:
- Topology choice
- Queen selection strategy (if needed)
- Consensus mechanisms (if needed)
- Memory coordination patterns
- Checkpoint gates

Think of it like: A recipe for successfully coordinating a specific type of project.

## Why Build Custom Workflows?

**Reusability**: Design once, reuse many times
**Consistency**: Same approach across similar projects
**Optimization**: Refine based on experience
**Documentation**: Capture tribal knowledge

## Workflow Design Framework

### 1. Analyze the Project Type

**Questions to ask**:
- How complex? (Simple, moderate, complex)
- How many phases? (Single, multi-phase)
- How many agents? (< 5, 5-15, 15+)
- What's critical? (Speed, quality, innovation)
- Known or unknown problem? (Patterns exist vs greenfield)

### 2. Choose Components

**Topology**:
- Mesh (collaborative)
- Hierarchical (delegated)
- Star (centralized)
- Ring (sequential)

**Queen** (if needed):
- Strategic (planning-heavy)
- Tactical (execution-focused)
- Adaptive (context-aware)

**Consensus** (if needed):
- Majority (simple decisions)
- Weighted (expertise matters)
- Byzantine (fault-tolerant)

### 3. Define Phases

**Example phases**:
1. Planning
2. Implementation
3. Review
4. Integration
5. Deployment

### 4. Set Checkpoints

**Quality gates** between phases:
- Architecture review
- Security audit
- Performance benchmark
- HITL approval

## Custom Workflow Examples

### Workflow 1: Full-Stack Feature Development

**Use case**: Add new feature to existing web app

**Characteristics**:
- Moderate complexity
- 3-4 phases
- 6-8 agents
- Known patterns
- Focus: Speed + quality balance

**Design**:

```javascript
// WORKFLOW: Full-Stack Feature Development
// TOPOLOGY: Hierarchical (clear delegation)
// QUEEN: Tactical (fast execution)
// CONSENSUS: Majority vote on API contract
// PHASES: Planning → Implementation → Testing → Review

// PHASE 1: Planning (Tactical Queen)
Task("Tactical Queen", `
  PROJECT: Add user profile editing feature

  PHASE 1 - QUICK PLANNING (30 min):
  1. Review existing user profile code
  2. Quick API contract design
  3. Assign frontend, backend, testing teams
  4. Set checkpoint: API contract approval (majority vote)

  COORDINATION: memory['workflow/profile-edit/phase1/*']
`, "hierarchical-coordinator")

Task("Backend Planner", "Design API endpoints for profile editing", "backend-dev")
Task("Frontend Planner", "Plan UI components needed", "coder")
Task("Database Planner", "Check schema, plan migrations if needed", "code-analyzer")

// CHECKPOINT: API Contract Consensus (Majority Vote)
Task("Consensus Coordinator", `
  CHECKPOINT: API Contract Approval

  VOTERS: Backend Planner, Frontend Planner, Database Planner
  MECHANISM: Majority vote (2/3 required)
  DECISION: Approve API contract or request changes

  IF APPROVED: Proceed to Phase 2
  IF REJECTED: Revise and re-vote
`, "planner")

// PHASE 2: Implementation (Parallel)
Task("Backend Developer", "Implement profile edit API. Wait for contract approval.", "backend-dev")
Task("Frontend Developer", "Build profile edit UI. Wait for contract approval.", "coder")
Task("Database Migration", "Run migrations if needed. Wait for contract approval.", "code-analyzer")

// PHASE 3: Testing (Parallel)
Task("Unit Tester", "Unit tests for backend and frontend", "tester")
Task("Integration Tester", "E2E profile editing flow", "tester")

// CHECKPOINT: Test Coverage Gate
Task("Test Coordinator", `
  CHECKPOINT: Test Coverage

  REQUIRED: 80%+ coverage
  IF MET: Proceed to Phase 4
  IF NOT MET: Write more tests
`, "tester")

// PHASE 4: Review
Task("Code Reviewer", "Review code quality", "reviewer")
Task("Security Reviewer", "Check for vulnerabilities", "security-manager")

// FINAL: Integration
Task("Tactical Queen", "Integrate all components and deploy to staging", "hierarchical-coordinator")
```

**Memory coordination**:
```javascript
// Phase 1
memory['workflow/profile-edit/phase1/api-contract']
memory['workflow/profile-edit/phase1/ui-plan']

// Checkpoint 1
memory['workflow/profile-edit/checkpoint/api-approved'] = true/false

// Phase 2
memory['workflow/profile-edit/phase2/backend-complete']
memory['workflow/profile-edit/phase2/frontend-complete']

// Checkpoint 2
memory['workflow/profile-edit/checkpoint/test-coverage'] = 85

// Phase 4
memory['workflow/profile-edit/phase4/review-passed'] = true
```

**Timeline**: 4-progressive mastery total

### Workflow 2: Greenfield Platform Architecture

**Use case**: Build new SaaS platform from scratch

**Characteristics**:
- High complexity
- 5 phases
- 15-20 agents
- Greenfield (unknown)
- Focus: Architecture quality

**Design**:

```javascript
// WORKFLOW: Greenfield Platform Architecture
// TOPOLOGY: Hierarchical (3-level: Queen → Team Leads → Specialists)
// QUEEN: Strategic (heavy planning)
// CONSENSUS: Weighted vote on architecture, Byzantine for security decisions
// PHASES: Requirements → Architecture → Implementation → Testing → Deployment

// PHASE 1: Requirements Analysis (Strategic Queen)
Task("Strategic Queen", `
  PHASE 1 - REQUIREMENTS (Step 1-2):

  1. Gather requirements from stakeholders
  2. Analyze market competitors
  3. Define success metrics
  4. Create product vision
  5. Store in memory for architecture phase

  FOCUS: Long-term vision, scalability, maintainability
`, "hierarchical-coordinator")

Task("Market Researcher", "Analyze competitors", "researcher")
Task("Technical Researcher", "Research tech stack options", "researcher")
Task("User Experience Researcher", "Define user flows", "researcher")

// CHECKPOINT: Requirements Approval (HITL)
// Human reviews and approves requirements

// PHASE 2: Architecture Design (Strategic Queen + Weighted Consensus)
Task("Strategic Queen", `
  PHASE 2 - ARCHITECTURE (Step 3-5):

  1. Design system architecture
  2. Choose tech stack (database, frameworks, infrastructure)
  3. Define microservices boundaries
  4. Create API contracts
  5. Design data models

  WEIGHTED CONSENSUS on major decisions:
  - Database choice (PostgreSQL vs MongoDB)
  - Backend framework (Node vs Python vs Go)
  - Frontend framework (React vs Vue vs Svelte)
  - Cloud provider (AWS vs GCP vs Azure)

  VOTERS:
  - System Architect (weight: 3)
  - Backend Architects (weight: 2 each)
  - DevOps Lead (weight: 2)
  - Frontend Lead (weight: 1)
`, "hierarchical-coordinator")

Task("System Architect", "Overall architecture design", "system-architect")
Task("Backend Architect 1", "Backend services architecture", "backend-dev")
Task("Backend Architect 2", "Data architecture", "code-analyzer")
Task("DevOps Lead", "Infrastructure architecture", "cicd-engineer")
Task("Frontend Lead", "Frontend architecture", "coder")

// WEIGHTED CONSENSUS: Database Choice
Task("Consensus Coordinator - Database", `
  DECISION: PostgreSQL vs MongoDB

  WEIGHTED VOTES:
  - System Architect (3x)
  - Backend Architects (2x each)
  - DevOps Lead (2x)
  - Frontend Lead (1x)

  Tally votes and choose winner
`, "planner")

// CHECKPOINT: Architecture Review (Byzantine Consensus)
Task("Byzantine Consensus - Architecture", `
  CHECKPOINT: Architecture Approval

  VOTERS (7 agents, tolerates 2 faults):
  - 3 Senior architects
  - 2 Security specialists
  - 2 Performance specialists

  BYZANTINE CONSENSUS (BFT):
  Need 5/7 approval to proceed

  IF APPROVED: Proceed to Phase 3
  IF REJECTED: Revise architecture
`, "byzantine-coordinator")

// PHASE 3: Implementation (3 teams, hierarchical)
Task("Strategic Queen", `
  PHASE 3 - IMPLEMENTATION (Step 6-15):

  TEAMS:
  1. Backend Team (5 agents)
  2. Frontend Team (4 agents)
  3. DevOps Team (3 agents)

  Each team has team lead coordinating specialists
`, "hierarchical-coordinator")

// Backend Team
Task("Backend Team Lead", "Coordinate backend development", "backend-dev")
Task("Auth Service Dev", "Build authentication service", "backend-dev")
Task("User Service Dev", "Build user service", "backend-dev")
Task("Product Service Dev", "Build product service", "backend-dev")
Task("Payment Service Dev", "Build payment service", "backend-dev")

// Frontend Team
Task("Frontend Team Lead", "Coordinate frontend development", "coder")
Task("UI Component Dev", "Build component library", "coder")
Task("Feature Dev 1", "Build user features", "coder")
Task("Feature Dev 2", "Build product features", "coder")

// DevOps Team
Task("DevOps Team Lead", "Coordinate infrastructure", "cicd-engineer")
Task("Container Specialist", "Dockerize all services", "cicd-engineer")
Task("CI/CD Specialist", "Build pipelines", "cicd-engineer")

// PHASE 4: Testing (Parallel)
Task("Unit Test Lead", "Coordinate unit testing", "tester")
Task("Integration Test Lead", "Coordinate integration testing", "tester")
Task("E2E Test Lead", "Coordinate E2E testing", "tester")
Task("Performance Test Lead", "Load testing and benchmarks", "perf-analyzer")
Task("Security Test Lead", "Security audit and penetration testing", "security-manager")

// CHECKPOINT: Quality Gates
Task("Quality Gate Coordinator", `
  CHECKPOINTS:
  - Unit test coverage > 80%
  - Integration tests passing
  - E2E tests passing
  - Performance meets SLA
  - Security audit passed

  ALL MUST PASS to proceed
`, "reviewer")

// PHASE 5: Deployment (Byzantine Consensus)
Task("Byzantine Consensus - Deployment", `
  DECISION: Approve production deployment

  VOTERS (7 agents, BFT):
  - 2 Security auditors
  - 2 Performance reviewers
  - 2 Code quality reviewers
  - 1 System architect

  BYZANTINE CONSENSUS: Need 5/7 approval
`, "byzantine-coordinator")
```

**Timeline**: 15-20 days total

### Workflow 3: Security-Critical Integration

**Use case**: Add payment processing with strict security requirements

**Characteristics**:
- High security risk
- 4 phases
- 8-10 agents
- Compliance required
- Focus: Security + correctness

**Design**:

```javascript
// WORKFLOW: Security-Critical Payment Integration
// TOPOLOGY: Star (centralized security coordinator)
// QUEEN: Strategic Security Coordinator
// CONSENSUS: Byzantine for all security decisions
// PHASES: Security Planning → Secure Implementation → Penetration Testing → Audit

// PHASE 1: Security Planning (Strategic Security Coordinator)
Task("Security Coordinator", `
  PHASE 1 - SECURITY PLANNING:

  1. Threat modeling
  2. Define security requirements
  3. Choose payment gateway (Stripe)
  4. Plan PCI DSS compliance
  5. Design security architecture

  BYZANTINE CONSENSUS on:
  - Payment gateway choice
  - Data encryption strategy
  - Compliance approach
`, "security-manager")

Task("Threat Modeler", "Identify attack vectors", "security-manager")
Task("Compliance Specialist", "PCI DSS requirements", "security-manager")
Task("Encryption Specialist", "Design encryption strategy", "security-manager")

// BYZANTINE CONSENSUS: Security Architecture
Task("Byzantine Consensus - Security", `
  DECISION: Approve security architecture

  VOTERS (7 security specialists, BFT):
  Need 5/7 approval

  FOCUS: No security compromises tolerated
`, "byzantine-coordinator")

// PHASE 2: Secure Implementation (Strict reviews)
Task("Backend Security Dev", "Implement Stripe integration with security best practices", "backend-dev")
Task("Encryption Implementer", "Implement PCI-compliant encryption", "security-manager")
Task("Audit Logger", "Implement comprehensive audit logging", "backend-dev")

// PHASE 3: Penetration Testing (Adversarial)
Task("Penetration Tester 1", "Attempt SQL injection", "security-manager")
Task("Penetration Tester 2", "Attempt XSS attacks", "security-manager")
Task("Penetration Tester 3", "Attempt payment tampering", "security-manager")

// CHECKPOINT: Zero Vulnerabilities Required
Task("Security Coordinator", `
  CHECKPOINT: Penetration Testing Results

  REQUIRED: ZERO critical/high vulnerabilities
  IF ANY FOUND: Fix and re-test (no exceptions)
`, "security-manager")

// PHASE 4: Security Audit (Byzantine)
Task("Byzantine Consensus - Deployment Approval", `
  FINAL DECISION: Approve production deployment

  VOTERS (9 specialists, tolerates 3 faults, BFT):
  - 3 Security auditors
  - 3 Compliance reviewers
  - 3 Payment security specialists

  BYZANTINE CONSENSUS: Need 7/9 approval

  IF APPROVED: Deploy to production with monitoring
  IF REJECTED: Address concerns and re-audit
`, "byzantine-coordinator")
```

**Timeline**: 10-15 days total

## Building Your Own Workflow

### Step-by-Step Guide

**1. Define the workflow type**
```
Name: _______________
Use case: _______________
Frequency: _______________
```

**2. Identify characteristics**
```
Complexity: [ ] Simple [ ] Moderate [ ] Complex
Agents needed: ___
Phases: ___
Critical factor: [ ] Speed [ ] Quality [ ] Innovation [ ] Security
```

**3. Choose topology**
```
Based on characteristics:
[ ] Mesh (collaborative, < 8 agents)
[ ] Hierarchical (delegated, complex)
[ ] Star (centralized, simple)
[ ] Ring (sequential, pipeline)
```

**4. Select queen strategy (if needed)**
```
[ ] Strategic (greenfield, planning-heavy)
[ ] Tactical (known patterns, fast execution)
[ ] Adaptive (mixed requirements)
[ ] No queen (simple projects)
```

**5. Define consensus points (if needed)**
```
Decision 1: _______________ → Consensus type: _______________
Decision 2: _______________ → Consensus type: _______________
```

**6. Map phases**
```
Phase 1: _______________ (agents: ___, duration: ___)
Phase 2: _______________ (agents: ___, duration: ___)
Phase 3: _______________ (agents: ___, duration: ___)
...
```

**7. Set checkpoints**
```
Checkpoint 1: _______________ (gate type: ___, criteria: ___)
Checkpoint 2: _______________ (gate type: ___, criteria: ___)
```

**8. Design memory coordination**
```
Namespace: _______________
Keys:
  phase1/*: _______________
  checkpoint/*: _______________
  shared/*: _______________
```

**9. Document the workflow**
```
Save to: memory['workflow-templates/<name>']
Include: topology, queen, consensus, phases, checkpoints
```

**10. Test and refine**
```
Run the workflow on a real project
Measure: time, quality, issues encountered
Refine based on learnings
```

## Reusable Workflow Templates

Store successful workflows in memory for reuse:

```javascript
// Store workflow template
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "workflow-templates/full-stack-feature",
  value: JSON.stringify({
    name: "Full-Stack Feature Development",
    topology: "hierarchical",
    queen: "tactical",
    consensus: ["majority-api-contract"],
    phases: [
      {name: "planning", duration_hours: 1, agents: 3},
      {name: "implementation", duration_hours: 3, agents: 3},
      {name: "testing", duration_hours: 1.5, agents: 2},
      {name: "review", duration_hours: 0.5, agents: 2}
    ],
    checkpoints: [
      {after_phase: "planning", type: "majority-vote", criteria: "API contract approved"},
      {after_phase: "testing", type: "coverage-gate", criteria: "80%+ test coverage"}
    ],
    success_rate: 95,
    avg_completion_time_hours: 6,
    projects_used: 12
  }),
  namespace: "reasoning-bank"
})
```

## You'll Know You Understand When...

✅ You design custom workflows for your specific project types
✅ You combine topology + queen + consensus appropriately
✅ You define clear phases and checkpoints
✅ You store and reuse successful workflow templates
✅ Your workflows improve over time based on learnings

## Try This Exercise

**Design a custom workflow**:

**Project**: Build a blog platform with comments, user auth, and admin panel

**Your workflow design**:
1. Topology: __________
2. Queen strategy: __________
3. Consensus points: __________
4. Phases: __________
5. Checkpoints: __________
6. Agents needed: __________
7. Estimated timeline: __________

**Hint**: Think about what's critical (speed vs quality), how many agents, what decisions need consensus.

## Phase 3: Intermediate Complete!

You've now mastered:
✅ Swarm topologies (mesh, hierarchical, star, ring)
✅ Queen selection strategies
✅ Consensus mechanisms
✅ Custom workflow design

**You're ready for advanced topics**: Continue with advanced hive-mind coordination, Byzantine consensus, and adaptive topology patterns in the coordinate/ documentation.

---

**Intermediate Milestone**: Can you design a custom workflow for a new project type and execute it successfully? If yes, you're ready for advanced mastery.
