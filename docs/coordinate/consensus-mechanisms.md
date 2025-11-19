# Consensus Mechanisms

Sometimes decisions are too important for one agent. Consensus mechanisms let multiple agents vote to prevent costly mistakes.

## What is Consensus?

**Definition**: A process where multiple agents agree on a decision before proceeding.

**Why it matters**: Prevents single-agent mistakes on critical decisions.

**Cost**: additional coordination time for voting, but saves significant time fixing mistakes.

## When to Use Consensus

### ✅ Use Consensus For:

**Architectural decisions**
```
Choice of database (SQL vs NoSQL) → CONSENSUS
Choice of framework (React vs Vue) → CONSENSUS
```

**Security-critical decisions**
```
Authentication strategy → CONSENSUS
Data encryption approach → CONSENSUS
```

**High-cost decisions**
```
Cloud provider choice → CONSENSUS
Major refactor approach → CONSENSUS
```

**Team disagreements**
```
Backend wants REST, Frontend wants GraphQL → CONSENSUS
```

### ❌ Skip Consensus For:

**Implementation details**
```
Variable naming → NO CONSENSUS NEEDED
File organization → NO CONSENSUS NEEDED
```

**Low-risk decisions**
```
UI button color → NO CONSENSUS
Log message format → NO CONSENSUS
```

**Time-sensitive decisions**
```
Hotfix deployment → NO CONSENSUS (too slow)
```

**Clear best practices**
```
Using HTTPS → NO CONSENSUS (obvious)
```

## The Three Consensus Types

### 1. Majority Vote (Simple)

**How it works**: More than 50% agreement = decision passes

**When to use**:
- Equal expertise among voters
- Binary decisions (yes/no)
- Quick decisions needed
- Low stakes

**Example**:
```javascript
Task("Consensus Coordinator", `
  DECISION: Should we use TypeScript or JavaScript?

  VOTING PROCESS:
  1. Pose question to all backend developers
  2. Each votes TypeScript or JavaScript
  3. Count votes
  4. Majority wins (> 50%)
  5. Store decision in memory

  VOTERS: 5 backend developers
  MECHANISM: Majority vote
`, "hierarchical-coordinator")

Task("Backend Dev 1", "Vote: TypeScript or JavaScript. Store in memory['vote/backend-1']", "backend-dev")
Task("Backend Dev 2", "Vote: TypeScript or JavaScript. Store in memory['vote/backend-2']", "backend-dev")
Task("Backend Dev 3", "Vote: TypeScript or JavaScript. Store in memory['vote/backend-3']", "backend-dev")
Task("Backend Dev 4", "Vote: TypeScript or JavaScript. Store in memory['vote/backend-4']", "backend-dev")
Task("Backend Dev 5", "Vote: TypeScript or JavaScript. Store in memory['vote/backend-5']", "backend-dev")

Task("Vote Counter", `
  1. Wait for all votes in memory
  2. Count: TypeScript votes vs JavaScript votes
  3. Determine majority (need 3+ votes)
  4. Store result: memory['consensus/decision'] = winner
`, "planner")
```

**Voting outcome**:
```
TypeScript: 4 votes
JavaScript: 1 vote

RESULT: TypeScript wins (80% majority)
DECISION: Use TypeScript
```

**Pros**:
- Simple and fast
- Clear outcome
- Democratic

**Cons**:
- Ignores expertise differences
- 51% can override 49%
- No weight for experience

### 2. Weighted Vote (Expert Opinions Matter)

**How it works**: Votes are weighted by expertise or role

**When to use**:
- Varying expertise levels
- Technical decisions
- Some voters are domain experts
- Need quality over pure democracy

**Example**:
```javascript
Task("Consensus Coordinator", `
  DECISION: Should we use PostgreSQL or MongoDB?

  VOTING PROCESS:
  1. Each voter votes with justification
  2. Weight votes by expertise:
     - Database architect: 3x weight
     - Backend developers: 2x weight
     - Frontend developers: 1x weight
  3. Calculate weighted total
  4. Highest weight wins

  VOTERS:
  - 1 Database Architect (weight: 3)
  - 3 Backend Developers (weight: 2 each)
  - 2 Frontend Developers (weight: 1 each)
`, "hierarchical-coordinator")

Task("Database Architect", "Vote: PostgreSQL or MongoDB. Explain why. Weight: 3", "code-analyzer")
Task("Backend Dev 1", "Vote: PostgreSQL or MongoDB. Explain why. Weight: 2", "backend-dev")
Task("Backend Dev 2", "Vote: PostgreSQL or MongoDB. Explain why. Weight: 2", "backend-dev")
Task("Backend Dev 3", "Vote: PostgreSQL or MongoDB. Explain why. Weight: 2", "backend-dev")
Task("Frontend Dev 1", "Vote: PostgreSQL or MongoDB. Explain why. Weight: 1", "coder")
Task("Frontend Dev 2", "Vote: PostgreSQL or MongoDB. Explain why. Weight: 1", "coder")
```

**Voting outcome**:
```
PostgreSQL:
  - Database Architect (3 votes)
  - Backend Dev 1 (2 votes)
  - Backend Dev 2 (2 votes)
  Total: 7 weighted votes

MongoDB:
  - Backend Dev 3 (2 votes)
  - Frontend Dev 1 (1 vote)
  - Frontend Dev 2 (1 vote)
  Total: 4 weighted votes

RESULT: PostgreSQL wins (63% weighted majority)
DECISION: Use PostgreSQL
```

**Pros**:
- Expertise matters
- Better quality decisions
- Domain experts have more influence

**Cons**:
- Requires defining weights
- Can discount minority expert opinions
- More complex to implement

### 3. Byzantine Consensus (Fault-Tolerant)

**How it works**: Consensus even with malicious or faulty agents (BFT algorithm)

**When to use**:
- Security-critical decisions
- Cannot trust all agents
- Production deployments
- High-stakes decisions
- Simulating adversarial review

**Theory**: Byzantine Fault Tolerance
- Requires 3f+1 agents to tolerate f malicious agents
- Example: 7 agents can tolerate 2 malicious

**Example**:
```javascript
Task("Byzantine Consensus Coordinator", `
  DECISION: Approve production deployment?

  BYZANTINE CONSENSUS (BFT):
  1. Need 7 agents minimum (tolerates 2 malicious)
  2. Each agent votes: APPROVE or REJECT
  3. Byzantine algorithm:
     - If 5+ agents APPROVE → CONSENSUS REACHED
     - If 3+ agents REJECT → CONSENSUS REJECTED
     - Must account for up to 2 malicious/faulty agents

  VOTERS (7 agents):
  - 3 Security auditors
  - 2 Performance reviewers
  - 2 Code quality reviewers

  MALICIOUS SIMULATION:
  - Randomly 0-2 agents may give faulty votes
  - BFT algorithm still reaches correct consensus
`, "byzantine-coordinator")

// 7 agents vote
Task("Security Auditor 1", "Review for vulnerabilities. Vote APPROVE/REJECT.", "security-manager")
Task("Security Auditor 2", "Review for vulnerabilities. Vote APPROVE/REJECT.", "security-manager")
Task("Security Auditor 3", "Review for vulnerabilities. Vote APPROVE/REJECT.", "security-manager")
Task("Performance Reviewer 1", "Check performance. Vote APPROVE/REJECT.", "perf-analyzer")
Task("Performance Reviewer 2", "Check performance. Vote APPROVE/REJECT.", "perf-analyzer")
Task("Code Quality 1", "Review code quality. Vote APPROVE/REJECT.", "reviewer")
Task("Code Quality 2", "Review code quality. Vote APPROVE/REJECT.", "reviewer")
```

**Voting outcome (with malicious agent)**:
```
Votes:
  Security 1: APPROVE ✅
  Security 2: APPROVE ✅
  Security 3: REJECT (malicious) ❌
  Performance 1: APPROVE ✅
  Performance 2: APPROVE ✅
  Code Quality 1: APPROVE ✅
  Code Quality 2: REJECT (faulty) ❌

Total: 5 APPROVE, 2 REJECT

BFT Analysis:
- Need 5+ approvals for consensus (7 agents, f=2, need 3f+1 = 5)
- Got 5 approvals
- 2 rejects tolerated (within fault tolerance)

RESULT: CONSENSUS REACHED - APPROVE deployment
```

**Pros**:
- Handles malicious/faulty agents
- Security-critical decisions
- Fault-tolerant
- Proven algorithm

**Cons**:
- Requires 3f+1 agents (overhead)
- More complex to implement
- Slower than simple majority

## Implementing Consensus

### Pattern 1: Simple Majority Vote

```javascript
// Memory structure
memory['consensus/proposal'] = {
  question: "Use TypeScript?",
  options: ["yes", "no"],
  voters: ["agent1", "agent2", "agent3", "agent4", "agent5"]
}

// Agents vote
memory['consensus/votes/agent1'] = "yes"
memory['consensus/votes/agent2'] = "yes"
memory['consensus/votes/agent3'] = "no"
memory['consensus/votes/agent4'] = "yes"
memory['consensus/votes/agent5'] = "yes"

// Coordinator counts
Task("Vote Counter", `
  1. Retrieve all votes from memory['consensus/votes/*']
  2. Count: yes = 4, no = 1
  3. Majority = 4/5 = 80%
  4. Result: YES wins
  5. Store: memory['consensus/decision'] = "yes"
`, "planner")
```

### Pattern 2: Weighted Vote

```javascript
// Memory structure with weights
memory['consensus/proposal'] = {
  question: "Choose database",
  options: ["PostgreSQL", "MongoDB"],
  voters: [
    {id: "db-architect", weight: 3},
    {id: "backend-1", weight: 2},
    {id: "backend-2", weight: 2},
    {id: "frontend-1", weight: 1}
  ]
}

// Weighted votes
memory['consensus/votes/db-architect'] = {vote: "PostgreSQL", weight: 3}
memory['consensus/votes/backend-1'] = {vote: "PostgreSQL", weight: 2}
memory['consensus/votes/backend-2'] = {vote: "MongoDB", weight: 2}
memory['consensus/votes/frontend-1'] = {vote: "MongoDB", weight: 1}

// Coordinator calculates weighted total
Task("Weighted Vote Counter", `
  PostgreSQL: 3 + 2 = 5 weighted votes
  MongoDB: 2 + 1 = 3 weighted votes

  RESULT: PostgreSQL wins (62.5% weighted)
`, "planner")
```

### Pattern 3: Byzantine Consensus

```javascript
// Byzantine setup (7 agents, tolerates 2 faults)
memory['consensus/byzantine/config'] = {
  total_agents: 7,
  fault_tolerance: 2,  // f = 2
  required_consensus: 5 // 3f+1 = 5
}

// Agents vote
memory['consensus/byzantine/votes'] = [
  {agent: "security-1", vote: "APPROVE"},
  {agent: "security-2", vote: "APPROVE"},
  {agent: "security-3", vote: "REJECT"},  // Malicious
  {agent: "perf-1", vote: "APPROVE"},
  {agent: "perf-2", vote: "APPROVE"},
  {agent: "quality-1", vote: "APPROVE"},
  {agent: "quality-2", vote: "REJECT"}   // Faulty
]

// BFT algorithm
Task("Byzantine Consensus Coordinator", `
  BFT Analysis:
  - APPROVE votes: 5
  - REJECT votes: 2
  - Required for consensus: 5 (3f+1)
  - Result: CONSENSUS REACHED (5 ≥ 5)

  Even with 2 malicious/faulty agents, consensus achieved.
  DECISION: APPROVE
`, "byzantine-coordinator")
```

## Real Example: This Session's Documentation Architecture

**Decision**: Choose learning path structure (linear vs modular vs progressive disclosure)

**Consensus approach**: HITL (Human-in-the-loop) approval
- Agent proposed 3 options (Phase 0)
- Human reviewed and chose Option A
- Served as "weighted vote" (human weight = ∞)

**Could have been**:
```javascript
Task("Architecture Consensus", `
  PROPOSAL: Documentation structure
  OPTIONS:
  A. Progressive disclosure (00-04)
  B. Task-based guides
  C. Reference documentation

  VOTERS:
  - Documentation specialist (weight: 3)
  - Technical writer (weight: 2)
  - User experience researcher (weight: 2)
  - Content strategist (weight: 2)

  WEIGHTED VOTE with justifications
`, "hierarchical-coordinator")
```

## You'll Know You Understand When...

✅ You know when to use vs skip consensus
✅ You choose the right consensus type for decisions
✅ You implement majority voting correctly
✅ You understand weighted voting for expertise
✅ You know when Byzantine consensus is necessary

## Try This Exercise

**Design consensus for these decisions**:

**Decision 1**: Choose CSS framework (Tailwind vs Bootstrap)
- [ ] Consensus type: __________
- [ ] Number of voters: __________
- [ ] Why: __________

**Decision 2**: Approve production deployment of critical security fix
- [ ] Consensus type: __________
- [ ] Number of voters: __________
- [ ] Why: __________

**Decision 3**: Pick linter rule for semicolons (require vs omit)
- [ ] Consensus type: __________
- [ ] Number of voters: __________
- [ ] Why: __________

**Answers**:
<details>
<summary>Click to reveal</summary>

1. **WEIGHTED VOTE** - Frontend devs (weight 3), backend devs (weight 1). Frontend expertise matters most.

2. **BYZANTINE CONSENSUS** - 7+ voters (security, DevOps, QA). Security-critical, need fault tolerance.

3. **NO CONSENSUS** - Low stakes, use team convention or skip consensus entirely.

</details>

## Next Step

You've learned topologies, queen selection, and consensus. Now build custom workflows combining all three.

→ **Next**: [Custom Workflows](custom-workflows.md)
