# Spawning Agents

Time to learn the difference between Claude Code's Task tool (which does actual work) and MCP tools (which coordinate).

## The Core Distinction

**Claude Code Task Tool**: Spawns actual agents that execute tasks
**MCP Tools**: Set up coordination topology and track agent types

Think of it like this:
- **MCP tools** = Planning a team meeting (who attends, what roles)
- **Task tool** = Actually running the meeting (people doing work)

## Claude Code Task Tool (PRIMARY)

### What It Does

The Task tool spawns an actual agent that:
1. Runs in a separate context
2. Executes the task you specify
3. Creates files, writes code, runs tests
4. Reports results back

### Basic Syntax

```javascript
Task(
  "Agent Name",           // Human-readable name
  "Detailed instructions", // What the agent should do
  "agent-type"            // Agent specialization
)
```

### Example: Single Agent

```javascript
Task(
  "Backend Developer",
  "Create a REST API for user authentication with Express. Include login, logout, and token refresh endpoints. Save to sessions/session-20251117-120000-auth-api/artifacts/code/",
  "backend-dev"
)
```

**What happens**:
1. Claude spawns a backend-dev agent
2. Agent creates auth API code
3. Agent saves to specified session directory
4. Agent reports completion

### Example: Multiple Agents in Parallel

```javascript
[Single Message]:
  Task("Research Specialist", "Analyze best practices for authentication systems. Store findings in memory under 'swarm/researcher/auth-patterns'.", "researcher")

  Task("Backend Developer", "Build authentication API based on research findings in memory. Save to sessions/.../artifacts/code/", "backend-dev")

  Task("Security Expert", "Review authentication implementation for vulnerabilities. Report findings to sessions/.../artifacts/docs/security-review.md", "reviewer")

  Task("Test Engineer", "Create comprehensive security tests for auth system. Save to sessions/.../artifacts/tests/", "tester")
```

**What happens**:
1. All four agents spawn simultaneously
2. Backend dev waits for researcher to store findings
3. Security expert reviews backend dev's code
4. Tester creates tests based on implementation
5. All coordinate through memory

**Time savings**: 4x faster than sequential

## Available Agent Types (54 total)

### Core Development
- `researcher` - Deep analysis, pattern recognition
- `coder` - General purpose implementation
- `tester` - Comprehensive test coverage
- `reviewer` - Code quality and security
- `planner` - Task decomposition and planning

### Specialized Development
- `backend-dev` - Server-side development (Node, Python, etc.)
- `frontend-dev` - Not in list, use `coder` with specific instructions
- `mobile-dev` - Mobile app development
- `ml-developer` - Machine learning and AI
- `system-architect` - System design and architecture
- `code-analyzer` - Code analysis and optimization
- `api-docs` - API documentation specialist

### Testing & Quality
- `tdd-london-swarm` - Test-driven development
- `production-validator` - Production readiness checks
- `perf-analyzer` - Performance analysis

### CI/CD & DevOps
- `cicd-engineer` - CI/CD pipelines and automation
- `security-manager` - Security and compliance

### GitHub & Repository
- `github-modes` - GitHub integration
- `pr-manager` - Pull request management
- `code-review-swarm` - Automated code reviews
- `issue-tracker` - Issue tracking and triage
- `release-manager` - Release coordination
- `repo-architect` - Repository architecture

### SPARC Methodology
- `specification` - Requirements and specifications
- `pseudocode` - Algorithm design
- `architecture` - System architecture
- `refinement` - Code refinement

### Swarm Coordination (Advanced - Phase 4: Advanced)
- `hierarchical-coordinator` - Hierarchical swarm coordination
- `mesh-coordinator` - Mesh topology coordination
- `adaptive-coordinator` - Adaptive topology switching
- `collective-intelligence-coordinator` - Hive-mind coordination
- `byzantine-coordinator` - Byzantine consensus
- `raft-manager` - Raft consensus
- `gossip-coordinator` - Gossip protocol coordination

**Full list**: See `.claude/agents/` directory

## MCP Tools (COORDINATION ONLY)

### What They Do

MCP tools set up coordination infrastructure:
- Initialize swarm topologies
- Define agent type configurations
- Track high-level orchestration
- Monitor coordination health

**They DON'T spawn actual working agents.**

### When to Use MCP Tools

**Use MCP tools when**:
- Setting up complex swarm topologies (mesh, hierarchical, etc.)
- Initializing coordination infrastructure
- Monitoring swarm health
- Tracking cross-agent metrics

**Don't use MCP tools when**:
- You just want agents to do work (use Task tool instead)
- Simple parallel execution (Task tool is sufficient)
- Building features (Task tool spawns the builders)

### Common MCP Tools

#### Initialize Swarm
```javascript
mcp__claude_flow__swarm_init({
  topology: "mesh",      // or "hierarchical", "star", "ring"
  maxAgents: 8,
  strategy: "balanced"
})
```

**What this does**: Sets up coordination topology. Doesn't spawn working agents.

#### Define Agent Type (Not Spawn)
```javascript
mcp__claude_flow__agent_spawn({
  type: "researcher"
})
```

**What this does**: Registers agent type in coordination system. Doesn't create actual researcher.

**To actually spawn**: Use Task tool afterward.

#### Monitor Status
```javascript
mcp__claude_flow__swarm_status()
```

**What this does**: Shows coordination health, active agents, topology info.

## The Complete Pattern: MCP + Task Tool

For complex projects, combine both:

### Step 1: Optional MCP Setup
```javascript
[Message 1 - Coordination Setup]:
  mcp__claude_flow__swarm_init({ topology: "hierarchical", maxAgents: 10 })
```

### Step 2: Spawn Actual Agents
```javascript
[Message 2 - Agent Execution]:
  Task("Queen Coordinator", "Coordinate the authentication project. Monitor progress via memory.", "hierarchical-coordinator")
  Task("Research Team Lead", "Analyze auth patterns and store findings.", "researcher")
  Task("Backend Team Lead", "Implement authentication API.", "backend-dev")
  Task("Testing Team Lead", "Create comprehensive tests.", "tester")
  Task("Security Auditor", "Review security posture.", "security-manager")
```

### Step 3: Monitor (Optional)
```javascript
[Message 3 - Check Progress]:
  mcp__claude_flow__swarm_status()
  mcp__claude_flow__agent_metrics()
```

## Real Example from This Workspace

**Session**: `session-20251115-162200-hive-mind-integration`

### What Happened

**Step 1: No MCP setup needed** (simple task)

**Step 2: Spawn agents with Task tool**
```javascript
[Single Message]:
  Task("Integration Specialist", "Integrate Byzantine consensus into hive-mind system. Save to sessions/.../artifacts/code/", "coder")

  Task("Test Engineer", "Create integration tests for Byzantine consensus. Save to sessions/.../artifacts/tests/", "tester")

  Task("Documentation Writer", "Document the integration with examples. Save to sessions/.../artifacts/docs/", "researcher")

  Task("Code Reviewer", "Review integration for quality and security. Report to sessions/.../artifacts/docs/review.md", "reviewer")
```

**Result**:
- 4 agents worked in parallel
- 25 minutes total (vs 2+ hours sequentially)
- 100% test coverage
- Complete documentation
- Security review passed

## Common Patterns

### Pattern 1: Simple Parallel Execution (No MCP)

**Use case**: Build a feature with multiple specialists

```javascript
Task("Backend Dev", "Build API", "backend-dev")
Task("Frontend Dev", "Build UI", "coder")
Task("Tester", "Write tests", "tester")
```

No MCP tools needed. Just spawn and go.

### Pattern 2: Complex Coordination (MCP + Task)

**Use case**: Large project with 10+ agents and specific topology

```javascript
// Step 1: Setup coordination
mcp__claude_flow__swarm_init({ topology: "hierarchical" })

// Step 2: Spawn agents
Task("Queen", "Coordinate 10 agents...", "hierarchical-coordinator")
Task("Research Lead", "...", "researcher")
// ... 8 more agents
```

### Pattern 3: Adaptive Coordination (Advanced)

**Use case**: Auto-select topology based on task complexity

```javascript
// MCP analyzes task and picks topology
mcp__claude_flow__swarm_init({ topology: "adaptive" })

// Spawn agents - coordinator auto-adjusts topology
Task("Adaptive Queen", "Coordinate and adjust topology as needed", "adaptive-coordinator")
// ... other agents
```

## Choosing the Right Agent Type

### Decision Tree

**For research and analysis** → `researcher`
**For general coding** → `coder`
**For backend APIs** → `backend-dev`
**For testing** → `tester`
**For code review** → `reviewer`
**For documentation** → `api-docs` or `researcher`
**For architecture** → `system-architect`
**For CI/CD** → `cicd-engineer`
**For security** → `security-manager`
**For coordination** → `*-coordinator` types (advanced)

### Specialist vs Generalist

**Use specialists** when:
- Task requires domain expertise
- Quality matters more than speed
- Multiple specialists coordinate better than one generalist

**Use generalists** (`coder`, `researcher`) when:
- Task is straightforward
- Single agent can handle it
- Over-specialization adds complexity

## You'll Know You Understand When...

✅ You can spawn 5 agents in one message using Task tool
✅ You know when to use Task tool vs MCP tools
✅ You can choose appropriate agent types for tasks
✅ You understand why MCP doesn't spawn working agents

## Try This Exercise

**Build a calculator app with agents**:

```javascript
[Single Message]:
  Task("Backend Developer", "Create calculator API with add/subtract/multiply/divide endpoints. Save to sessions/session-YYYYMMDD-HHMMSS-calculator/artifacts/code/", "backend-dev")

  Task("Test Engineer", "Write comprehensive tests including edge cases (divide by zero, etc.). Save to sessions/.../artifacts/tests/", "tester")

  Task("Documentation Writer", "Create API documentation with examples. Save to sessions/.../artifacts/docs/", "api-docs")

  Task("Code Reviewer", "Review for code quality, error handling, and edge cases. Report findings to sessions/.../artifacts/docs/review.md", "reviewer")
```

**Success criteria**:
- All 4 agents complete
- All artifacts in correct directories
- Agents coordinated through memory (reviewer checked coder's implementation)

## Common Mistakes

**❌ Using MCP agent_spawn thinking it spawns workers**
```javascript
mcp__claude_flow__agent_spawn({ type: "coder" })
// This just registers the type, doesn't spawn an actual coder
```

**✅ Use Task tool to spawn workers**
```javascript
Task("Coder", "Build the feature", "coder")
// This spawns an actual working agent
```

**❌ Spawning agents sequentially**
```javascript
Message 1: Task("Agent 1", "...", "type1")
Message 2: Task("Agent 2", "...", "type2")
```

**✅ Spawn in parallel (single message)**
```javascript
[Single Message]:
  Task("Agent 1", "...", "type1")
  Task("Agent 2", "...", "type2")
```

## Next Step

Now that you can spawn agents, let's master parallel execution patterns.

→ **Next**: [Parallel Execution](../operate/parallel-execution.md)
