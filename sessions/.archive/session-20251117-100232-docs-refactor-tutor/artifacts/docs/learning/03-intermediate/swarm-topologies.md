# Swarm Topologies

Topologies determine how agents coordinate. Choose the right topology and your swarm runs smoothly. Choose wrong and you get chaos or bottlenecks.

## The Four Core Topologies

### 1. Mesh (Peer-to-Peer)

**Visual**:
```
A ← → B
↕   ↗ ↕
C ← → D
```

Every agent can communicate with every other agent directly.

**When to use**:
- Collaborative work (brainstorming, research)
- No clear hierarchy needed
- 5 or fewer agents
- Exploration and discovery

**Example use case**: Research team analyzing security patterns
```javascript
mcp__claude_flow__swarm_init({ topology: "mesh", maxAgents: 5 })

Task("Security Researcher 1", "Analyze auth patterns", "researcher")
Task("Security Researcher 2", "Analyze encryption patterns", "researcher")
Task("Security Researcher 3", "Analyze access control patterns", "researcher")
Task("Synthesis Agent", "Combine all research findings", "researcher")
```

**Pros**:
- Flexible collaboration
- No single point of failure
- Fast peer-to-peer communication

**Cons**:
- Coordination overhead increases with O(n²)
- Doesn't scale beyond 8-10 agents
- Can lead to conflicting decisions

### 2. Hierarchical (Tree Structure)

**Visual**:
```
       Queen
      /  |  \
   Lead1 Lead2 Lead3
   / \   / \    / \
  A  B  C  D  E  F
```

Clear leadership hierarchy. Queen coordinates team leads, team leads coordinate specialists.

**When to use**:
- Complex projects with clear task breakdown
- 10+ agents
- Need centralized decision-making
- Clear delegation of responsibilities

**Example use case**: Full-stack application development
```javascript
mcp__claude_flow__swarm_init({ topology: "hierarchical", maxAgents: 13 })

// Queen coordinator
Task("Project Queen", "Coordinate all teams, make architectural decisions", "hierarchical-coordinator")

// Team leads
Task("Backend Team Lead", "Coordinate backend development", "backend-dev")
Task("Frontend Team Lead", "Coordinate frontend development", "coder")
Task("DevOps Team Lead", "Coordinate infrastructure", "cicd-engineer")

// Backend team (reports to Backend Lead)
Task("API Developer", "Build REST API", "backend-dev")
Task("Database Specialist", "Design schema", "code-analyzer")
Task("Auth Specialist", "Build authentication", "security-manager")

// Frontend team (reports to Frontend Lead)
Task("UI Developer", "Build components", "coder")
Task("State Management", "Implement Redux", "coder")
Task("Routing Specialist", "Setup React Router", "coder")

// DevOps team (reports to DevOps Lead)
Task("CI/CD Engineer", "Build pipelines", "cicd-engineer")
Task("Container Specialist", "Dockerize services", "cicd-engineer")
Task("Monitoring Setup", "Setup observability", "perf-analyzer")
```

**Coordination flow**:
1. Queen assigns high-level tasks to team leads
2. Team leads decompose and assign to specialists
3. Specialists coordinate within teams
4. Team leads report progress to queen
5. Queen makes architectural decisions

**Pros**:
- Scales to 50+ agents
- Clear accountability
- Efficient for complex projects
- Prevents decision conflicts

**Cons**:
- Queen can become bottleneck
- Less flexible than mesh
- Requires good task decomposition

### 3. Star (Central Coordinator)

**Visual**:
```
    A
   ↙
Coordinator ← B
   ↖
    C
```

One central coordinator, all other agents report to it.

**When to use**:
- Simple coordination needs
- Quick decisions required
- Coordinator has complete context
- 3-7 agents

**Example use case**: Code review workflow
```javascript
mcp__claude_flow__swarm_init({ topology: "star", maxAgents: 5 })

// Central coordinator
Task("Code Review Coordinator", "Manage review process, aggregate feedback", "reviewer")

// Spoke agents (all report to coordinator)
Task("Security Reviewer", "Check for vulnerabilities", "security-manager")
Task("Performance Reviewer", "Analyze performance", "perf-analyzer")
Task("Style Reviewer", "Check code style", "reviewer")
Task("Architecture Reviewer", "Review design decisions", "system-architect")
```

**Coordinator responsibilities**:
- Distribute tasks to spokes
- Aggregate results
- Make final decisions
- Handle conflicts

**Pros**:
- Simple to understand
- Fast decision-making
- Central context awareness
- Easy to monitor

**Cons**:
- Coordinator is single point of failure
- Doesn't scale beyond 10 agents
- Coordinator can be overwhelmed

### 4. Ring (Sequential Pipeline)

**Visual**:
```
A → B → C → D → A
```

Circular workflow, each agent passes to the next.

**When to use**:
- Sequential processing pipelines
- Review chains
- Multi-stage workflows
- Each stage depends on previous

**Example use case**: Document publishing pipeline
```javascript
mcp__claude_flow__swarm_init({ topology: "ring", maxAgents: 5 })

// Sequential pipeline
Task("Content Writer", "Write initial draft, pass to editor", "researcher")
Task("Editor", "Edit for clarity, pass to technical reviewer", "reviewer")
Task("Technical Reviewer", "Verify accuracy, pass to formatter", "code-analyzer")
Task("Formatter", "Apply formatting, pass to publisher", "api-docs")
Task("Publisher", "Publish and notify writer", "researcher")
```

**Pipeline flow**:
1. Writer creates draft → stores in `pipeline/stage1/draft`
2. Editor reads draft → edits → stores `pipeline/stage2/edited`
3. Technical reviewer reads → reviews → stores `pipeline/stage3/reviewed`
4. Formatter reads → formats → stores `pipeline/stage4/formatted`
5. Publisher reads → publishes → notifies writer (closes loop)

**Pros**:
- Clear workflow stages
- Easy to understand
- Each stage can specialize
- Natural checkpoints

**Cons**:
- Serial bottleneck (no parallelization)
- Slowest agent blocks entire pipeline
- Failure in one stage breaks chain

## Choosing the Right Topology

### Decision Tree

```
How many agents?
├─ 5 or fewer
│  ├─ Need collaboration? → MESH
│  └─ Need simple coordination? → STAR
│
├─ 6-15 agents
│  ├─ Clear task hierarchy? → HIERARCHICAL
│  ├─ Sequential pipeline? → RING
│  └─ Collaborative? → MESH (might struggle)
│
└─ 16+ agents
   └─ → HIERARCHICAL (only option that scales)
```

### By Use Case

**Research & Exploration** → MESH
- Brainstorming sessions
- Pattern analysis
- Competitive approaches

**Complex Projects** → HIERARCHICAL
- Full-stack development
- Large refactors
- Multi-team coordination

**Simple Coordination** → STAR
- Code reviews
- Data aggregation
- Quick decisions

**Sequential Workflows** → RING
- Review chains
- Publishing pipelines
- Multi-stage processing

## Real Example: Documentation Refactor (This Session)

**This session uses**: HIERARCHICAL (implicit)

**Why**:
- Complex project (20+ files)
- Multiple phases (research, architecture, implementation, review)
- Clear task breakdown (foundations, skills, intermediate, advanced)
- Need coordination across phases

**Implicit hierarchy**:
```
You (Human - Queen equivalent)
   |
Agent (Researcher) - Analyze existing docs
   |
Agent (Writer) - Create learning path
   |
Agent (Reviewer) - Verify quality
```

**Could have been**:
```
mcp__claude_flow__swarm_init({ topology: "hierarchical", maxAgents: 8 })

Task("Documentation Queen", "Coordinate refactor phases", "hierarchical-coordinator")
Task("Research Lead", "Analyze current state", "researcher")
Task("Content Lead", "Create new structure", "api-docs")
Task("Review Lead", "Quality assurance", "reviewer")

// Specialists under each lead
Task("Structure Analyst", "Analyze doc structure", "code-analyzer")
Task("Writer 1", "Write foundations", "api-docs")
Task("Writer 2", "Write essential skills", "api-docs")
Task("Technical Reviewer", "Verify accuracy", "reviewer")
```

## Hybrid Topologies (Advanced)

Combine topologies for complex systems:

### Hierarchical + Mesh
```
        Queen
       /     \
   TeamA    TeamB   ← Hierarchical
   / | \    / | \
  A  B  C  D  E  F  ← Mesh within teams
   ↕ ↕ ↕    ↕ ↕ ↕
```

**Use case**: Large project with independent teams
- Queen coordinates teams
- Within each team: mesh for collaboration

### Star + Ring
```
Coordinator
  ↙ ↓ ↘
 A→B→C  ← Ring of spoke agents
 ↑____↓
```

**Use case**: Review workflow with central aggregation
- Star for task distribution
- Ring for review chain
- Back to star for final decision

## You'll Know You Understand When...

✅ You choose topology based on project needs
✅ You understand scaling limits of each topology
✅ You can explain when mesh fails (> 10 agents)
✅ You know hierarchical is best for complex projects
✅ You can design hybrid topologies

## Try This Exercise

**Design topology for these projects**:

**Project 1**: Analyze 5 different authentication libraries
- [ ] Your topology choice: __________
- [ ] Why: __________

**Project 2**: Build e-commerce platform (backend, frontend, database, DevOps, testing)
- [ ] Your topology choice: __________
- [ ] Why: __________

**Project 3**: Sequential code review (security → performance → style → approval)
- [ ] Your topology choice: __________
- [ ] Why: __________

**Answers**:
<details>
<summary>Click to reveal</summary>

1. **MESH** - Collaborative research, 5 agents, need to synthesize findings
2. **HIERARCHICAL** - Complex project, 10+ agents, clear teams
3. **RING** - Sequential stages, each depends on previous

</details>

## Next Step

Now that you understand topologies, learn how to select the right queen coordinator.

→ **Next**: [Queen Selection](queen-selection.md)
