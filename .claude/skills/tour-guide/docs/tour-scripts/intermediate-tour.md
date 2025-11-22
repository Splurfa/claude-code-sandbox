# Intermediate Pathway Tour - Claude Code + Claude-Flow Workspace

**Target Audience**: Regular Claude Code users with some AI agent experience
**Duration**: ~50 minutes (6 sections)
**Prerequisites**: Basic Claude Code knowledge, some multi-agent exposure
**Learning Style**: Practical patterns and real-world workflows

---

## Navigation Commands

- `/tour next` - Advance to next section
- `/tour back` - Return to previous section
- `/tour jump <section>` - Jump directly to section (1-6)
- `/tour reset` - Restart from beginning
- `/tour exit` - Exit tour

---

## Section 1: Welcome & System Architecture (7 min)

### Overview for Intermediate Users

Welcome to the intermediate pathway! If you're here, you probably already use Claude Code regularly and have experimented with multi-agent workflows. This tour will take you beyond the basics to show you how to build sophisticated, production-grade AI coordination systems.

This workspace combines **Claude Code** (your primary interface) with **claude-flow** (agent coordination layer) to create a powerful development environment that achieves:

- **84.8% SWE-Bench solve rate** (industry-leading)
- **2.8-4.4x speed improvement** over sequential workflows
- **32.3% token reduction** through efficient coordination
- **10-20x faster agent spawning** via parallel execution

### Architecture: How the Pieces Fit Together

Think of this system as three interconnected layers:

#### Layer 1: Claude Code (Your Interface)
This is where you work. Claude Code provides the tools (Read, Write, Edit, Bash, Task) and manages the conversation flow. Everything you see and interact with happens here.

#### Layer 2: Claude Flow Alpha (Coordination via MCP)
This is the "nervous system" that coordinates multiple agents. It provides:
- **Swarm initialization** - Set up coordination topologies
- **Memory management** - Persistent key-value store for agent communication
- **Agent spawning** - Define agent types and capabilities
- **Task orchestration** - High-level workflow planning
- **Neural features** - Pattern recognition and learning
- **Performance tracking** - Metrics and optimization

#### Layer 3: Session + Hooks (Organization + Automation)
This layer keeps everything organized:
- **Sessions** - Isolated workspaces for each project (`sessions/session-ID/artifacts/`)
- **Hooks** - Automatic coordination points (pre-task, post-edit, session-end)
- **Memory** - SQLite database (`.swarm/memory.db`) with ~100K memory entries (actively growing)
- **Backups** - Point-in-time snapshots for recovery

### The Architecture in Practice

Here's a simplified diagram of how everything connects:

```
┌─────────────────────────────────────────────────────────┐
│           Claude Code (Primary Interface)               │
│  - File operations (Read, Write, Edit)                  │
│  - Task tool (spawn agents concurrently)                │
│  - Bash commands                                         │
│  - Git operations                                        │
├─────────────────────────────────────────────────────────┤
│         Claude Flow Alpha (MCP Coordination)            │
│  ┌──────────────────┐      ┌────────────────────────┐  │
│  │  Swarm Setup     │      │  Memory Management     │  │
│  │  - Topology init │      │  - Store/retrieve      │  │
│  │  - Agent types   │      │  - Search patterns     │  │
│  │  - Orchestration │      │  - Cross-session state │  │
│  └──────────────────┘      └────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│          Session Management + File Routing              │
│  sessions/session-YYYYMMDD-HHMMSS-<topic>/              │
│    └── artifacts/                                        │
│        ├── code/       ← All source code                │
│        ├── tests/      ← All test files                 │
│        ├── docs/       ← All documentation              │
│        ├── scripts/    ← All scripts                    │
│        └── notes/      ← Working notes                  │
├─────────────────────────────────────────────────────────┤
│           Hooks Layer (Auto-Fire Coordination)          │
│  Pre-task → Work → Post-edit → Post-task → Session-end  │
│  - Validate session exists                               │
│  - Update memory with changes                            │
│  - Track metrics                                         │
│  - Create backups                                        │
└─────────────────────────────────────────────────────────┘
```

### Key Architectural Decisions

**1. Session-Based Isolation**
Every chat gets its own session directory. This prevents conflicts when working on multiple projects and makes cleanup easy. All AI-generated files go to `sessions/<session-id>/artifacts/`, never to root directories.

**2. Hooks Auto-Fire for Coordination**
Hooks automatically execute at key points (before/after file operations, task completion, session end). This handles memory updates, metrics tracking, and backups without manual intervention.

**3. Memory Enables Agent Communication**
The shared memory database (`.swarm/memory.db`) allows agents to coordinate asynchronously. Agent A stores decisions, Agent B retrieves them. No direct communication needed.

**4. File Routing Maintains Organization**
Strict file routing rules ensure all work stays organized in session artifacts. This makes promotion to the main workspace intentional and controlled.

### Stock vs. Custom (Overview)

This workspace has a **92/100 stock-first score**:

- **Core**: 100% Stock Claude Flow (SPARC, Topologies, Reasoning, Swarm, Custom Commands)
- **Execution**: 100% Stock Claude Code (CLI, Task tool, File ops)
- **Extensions**: Custom Skills (31 domain skills), Session Management, Protocols
- **Philosophy**: Use the powerful stock engine for all execution, add thin custom layers for organization and learning.

This means you get the battle-tested foundation (Stock Claude Flow) plus productivity enhancements (Session Mgmt, Tutor Mode) without modifying the core system.

For a deep dive into stock vs. custom analysis, see the Advanced pathway (`/tour jump advanced`).

### What This Means for You

You're working with a system designed for:
- **Scalability** - Works identically with 10 items or 10,000
- **Time-neutrality** - All on-demand CLI, no background processes
- **Reliability** - 95% battle-tested infrastructure
- **Flexibility** - Multiple coordination patterns for different use cases

**Ready to see how sessions work?**

→ `/tour next` - Session Management Deep Dive
→ `/tour jump advanced` - More architectural depth

---

## Section 2: Session Management Deep Dive (10 min)

### Understanding the Session Lifecycle

Sessions are the foundation of workspace organization. Every chat gets one session, and every session goes through four states:

#### State 1: Pre-Session (Workspace Idle)
- No active work
- Workspace is clean
- Previous session closed and archived

#### State 2: Active Session (Work in Progress)
- Session directory exists: `sessions/session-YYYYMMDD-HHMMSS-<topic>/`
- All work flows to `artifacts/{code,tests,docs,scripts,notes}/`
- Memory tracks decisions and coordination state
- Hooks fire automatically on operations

#### State 3: Closing (Cleanup and Summary)
- `/session-closeout` invoked
- Summary generated automatically
- Metrics collected (files, agents, duration)
- **HITL approval requested** (you review and approve/reject)

#### State 4: Archived (Backed Up)
- Approved session archived to `.swarm/backups/session-*.json`
- Captain's Log updated with summary
- Session directory optionally cleaned
- Ready for next session

### Creating a Session: The Behind-the-Scenes Process

When you run `/session-start project-name`, here's what happens:

```bash
# User command
/session-start rest-api-implementation

# System actions (automatic):
# 1. Generate timestamp
timestamp="20251121-143022"

# 2. Create session directory
session_id="session-20251121-143022-rest-api-implementation"
mkdir -p sessions/${session_id}/

# 3. Create artifacts structure
mkdir -p sessions/${session_id}/artifacts/{code,tests,docs,scripts,notes}

# 4. Set as active session (stored in memory)
memory["workspace/active-session"] = session_id

# 5. Initialize session metadata
sessions/metadata.json → Track start time, topic, status

# 6. Log session start
sessions/captains-log/2025-11-21.md → "Started rest-api-implementation"
```

**Result**: You now have an isolated workspace for all API-related work.

### During Session: File Routing in Action

The golden rule: **ALL working files go to session artifacts**.

```bash
# ✅ CORRECT: New feature code
sessions/session-20251121-143022-rest-api/artifacts/code/auth.js
sessions/session-20251121-143022-rest-api/artifacts/code/routes/user.js

# ✅ CORRECT: Tests
sessions/session-20251121-143022-rest-api/artifacts/tests/auth.test.js

# ✅ CORRECT: Documentation
sessions/session-20251121-143022-rest-api/artifacts/docs/API-SPEC.md

# ✅ CORRECT: Build scripts
sessions/session-20251121-143022-rest-api/artifacts/scripts/setup-db.sh

# ✅ CORRECT: Working notes
sessions/session-20251121-143022-rest-api/artifacts/notes/decisions.md

# ❌ WRONG: Root directories (NEVER write here for session work)
code/auth.js           # Wrong! Use session artifacts
tests/auth.test.js     # Wrong! Use session artifacts
docs/API-SPEC.md       # Wrong! Use session artifacts
```

**Exception**: Editing existing project files (like `package.json`, `CLAUDE.md`) happens in their original location. Session artifacts are for NEW work generated during the session.

### Session Closeout: The HITL Protocol

When your work is complete, invoke the closeout:

```bash
/session-closeout

# Process (automatic):
# 1. Generate summary
summary = {
  "session_id": "session-20251121-143022-rest-api",
  "topic": "REST API implementation",
  "duration": "2h 34m",
  "achievements": [
    "Implemented JWT authentication",
    "Created 5 REST endpoints",
    "Wrote 47 unit tests (94% coverage)",
    "Documented API with OpenAPI spec"
  ],
  "files_created": 23,
  "agents_used": ["coder", "tester", "reviewer"],
  "key_decisions": [
    "Used PostgreSQL over MongoDB for relational data",
    "Implemented rate limiting with express-rate-limit",
    "Chose bcrypt for password hashing"
  ]
}

# 2. Collect metrics
metrics = {
  "files": 23,
  "lines_of_code": 1847,
  "test_coverage": "94%",
  "agents_spawned": 7,
  "memory_entries": 34
}

# 3. Present for HITL approval
# You see:
# ---
# Session Summary:
# - Implemented REST API with authentication
# - Created 23 files (1847 LOC, 94% coverage)
# - Used 7 agents across 2h 34m
#
# Key Decisions:
# - PostgreSQL for database
# - JWT for authentication
# - Express for routing
#
# Approve this closeout? [Y/n]
# ---

# 4a. If approved (Y):
#   - Archive to .swarm/backups/session-20251121-143022-rest-api.json
#   - Update sessions/captains-log/2025-11-21.md
#   - Optionally clean session directory
#   - Mark session as closed in metadata

# 4b. If rejected (n):
#   - Cancel closeout
#   - Remain in active session
#   - User can continue work or modify summary
```

**Why HITL?** Human approval ensures you're aware of what was accomplished and gives you a chance to review before archiving. No surprise deletions or automatic cleanups.

### Best Practices for Session Management

**DO:**
- ✅ One session = one logical project/task (e.g., "add-authentication", "refactor-database")
- ✅ Close sessions when done (keeps workspace clean)
- ✅ Review session summaries before approving
- ✅ Use descriptive session topics (helps with searching later)
- ✅ Let agents route files automatically (they know the rules)

**DON'T:**
- ❌ Create nested sessions (one session per chat thread)
- ❌ Manually manage session directories (let the system handle it)
- ❌ Save files to root directories during session work
- ❌ Forget to closeout sessions (leads to clutter)

### Practical Example: Building a REST API

Let's walk through a complete session lifecycle:

```
┌─────────────────────────────────────────────────────────┐
│ Phase 1: Start Session                                  │
└─────────────────────────────────────────────────────────┘
User: /session-start rest-api-implementation
System: Created session-20251121-143022-rest-api

┌─────────────────────────────────────────────────────────┐
│ Phase 2: Work (Agents spawn, files created)             │
└─────────────────────────────────────────────────────────┘
Task("Backend Coder", "Implement Express API with JWT auth", "coder")
Task("Test Engineer", "Write comprehensive tests", "tester")
Task("Code Reviewer", "Review security and best practices", "reviewer")

# Files created in sessions/.../artifacts/:
- code/server.js (Express setup)
- code/routes/auth.js (Authentication routes)
- code/routes/users.js (User CRUD)
- code/middleware/auth.js (JWT verification)
- code/models/user.js (User model)
- tests/auth.test.js (Auth tests)
- tests/users.test.js (User tests)
- docs/API-SPEC.md (OpenAPI spec)

┌─────────────────────────────────────────────────────────┐
│ Phase 3: Review Results                                 │
└─────────────────────────────────────────────────────────┘
User: Check test coverage, review security
Agents: 94% coverage, security review passed

┌─────────────────────────────────────────────────────────┐
│ Phase 4: Closeout                                       │
└─────────────────────────────────────────────────────────┘
User: /session-closeout
System: [Presents summary with achievements and metrics]
User: Y (approve)
System: Archived to .swarm/backups/, updated Captain's Log

┌─────────────────────────────────────────────────────────┐
│ Phase 5: Promotion (Optional)                           │
└─────────────────────────────────────────────────────────┘
User: Promote code/server.js and docs/API-SPEC.md to main workspace
System: [Guides through promotion process]
```

**Total Time**: 2h 34m
**Result**: Fully tested REST API with documentation, archived for reference

### Common Mistakes and How to Avoid Them

**Mistake 1: Saving to root directories**
```bash
# ❌ WRONG
Write("code/feature.js")        # Root directory!
Write("tests/feature.test.js")  # Root directory!

# ✅ CORRECT
Write("sessions/session-123/artifacts/code/feature.js")
Write("sessions/session-123/artifacts/tests/feature.test.js")
```

**Mistake 2: Creating nested sessions**
```bash
# ❌ WRONG
/session-start main-project
  /session-start sub-task-1    # Don't nest!
  /session-start sub-task-2    # Don't nest!

# ✅ CORRECT
/session-start main-project
  # Use subdirectories for sub-tasks:
  artifacts/code/feature-a/
  artifacts/code/feature-b/
```

**Mistake 3: Forgetting to closeout**
```bash
# ❌ WRONG: Session left open, workspace cluttered
# (Multiple unfinished sessions accumulate)

# ✅ CORRECT: Close when done
/session-closeout
# Workspace stays clean, work is archived
```

**Mistake 4: Manually managing session files**
```bash
# ❌ WRONG: Manual file operations
rm -rf sessions/session-123/    # Don't delete manually!
mv sessions/session-123/ archive/    # Don't move manually!

# ✅ CORRECT: Use session commands
/session-closeout    # System handles archiving
```

**Ready to learn agent spawning?**

→ `/tour next` - Agent Spawning Patterns
→ `/tour back` - Architecture overview

---

## Section 3: Agent Spawning Patterns (12 min)

### Core Principle: Task Tool Executes, MCP Coordinates

There's a crucial distinction to understand:

- **MCP tools** (claude-flow) → Set up coordination topology (optional)
- **Task tool** (Claude Code) → Spawn and run agents that do actual work (required)

Most of your agent spawning will use the **Task tool**. MCP tools are only needed for complex coordination patterns.

### Single Agent Pattern

The simplest pattern: spawn one agent for one task.

```javascript
Task(
  "Code Reviewer",                    // Agent name (descriptive)
  "Review security of authentication module in sessions/.../artifacts/code/auth.js. Report findings to sessions/.../artifacts/docs/security-review.md. Check for: SQL injection, XSS, CSRF, password storage, session management.",
  "reviewer"                          // Agent type (from catalog)
)
```

**When to use**: Single-focus tasks (code review, security audit, documentation)

**Key points**:
- Clear instructions ("Review security of...")
- Specific file paths (both input and output)
- Explicit criteria ("Check for: SQL injection...")

### Parallel Agent Pattern: The Power of Concurrency

Spawn multiple agents **in a single message** to execute tasks concurrently.

```javascript
// Single message, multiple agents (10-20x faster than sequential)
[Parallel Execution]:

Task(
  "Backend Developer",
  "Build Express REST API with JWT authentication. Implement routes: /auth/login, /auth/register, /users/:id. Save to sessions/.../artifacts/code/. Use PostgreSQL for database.",
  "coder"
)

Task(
  "Frontend Developer",
  "Build React UI with login form, user dashboard, and profile page. Integrate with backend API. Save to sessions/.../artifacts/code/frontend/. Use hooks for state management.",
  "coder"
)

Task(
  "Database Architect",
  "Design PostgreSQL schema for users table with proper constraints. Include indexes for performance. Save migration to sessions/.../artifacts/code/migrations/001-users.sql.",
  "code-analyzer"
)

Task(
  "Test Engineer",
  "Write Jest tests for all API endpoints with 90%+ coverage. Test authentication flows, error cases, edge cases. Save to sessions/.../artifacts/tests/.",
  "tester"
)

Task(
  "DevOps Engineer",
  "Create Docker setup with Node.js, PostgreSQL, and Redis. Write docker-compose.yml and Dockerfile. Add README for local development. Save to sessions/.../artifacts/scripts/.",
  "cicd-engineer"
)
```

**Result**: All 5 agents execute simultaneously. Each completes its work in parallel, communicating through memory and file artifacts.

**Performance gain**: 10-20x faster than spawning agents one at a time.

### Sequential Agent Pattern: Dependencies via Memory

When agents need to build on each other's work, use memory for coordination:

```javascript
// Phase 1: Research (runs first)
Task(
  "Research Analyst",
  "Research best database for e-commerce platform (10k+ products, real-time inventory). Consider: PostgreSQL, MongoDB, DynamoDB. Store decision with rationale in memory key 'db-decision' under namespace 'ecommerce-project'.",
  "researcher"
)

// Wait for completion (check memory)
// Then Phase 2: Implementation (reads memory)
Task(
  "Backend Developer",
  "Retrieve database decision from memory key 'db-decision' (namespace: ecommerce-project). Implement chosen database setup with proper schema. Save to sessions/.../artifacts/code/database/.",
  "coder"
)

// Phase 3: Testing (reads implementation)
Task(
  "Test Engineer",
  "Read database implementation from sessions/.../artifacts/code/database/. Write integration tests for all CRUD operations. Test performance with 10k records. Save to sessions/.../artifacts/tests/.",
  "tester"
)
```

**How it works**:
1. Researcher stores finding → `memory["db-decision"] = "PostgreSQL"`
2. Coder retrieves finding → `decision = memory["db-decision"]`
3. Tester reads code files → Creates targeted tests

### Coordination Mechanisms: How Agents Communicate

**Mechanism 1: Shared Memory (Key-Value Store)**

Agents store and retrieve data using MCP memory tools:

```javascript
// Agent A: Store API schema
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "api-schema",
  value: JSON.stringify({
    endpoints: [
      { path: "/users", method: "GET", auth: true },
      { path: "/users/:id", method: "GET", auth: true },
      { path: "/users", method: "POST", auth: false }
    ]
  }),
  namespace: "rest-api-project"
})

// Agent B: Retrieve API schema
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "api-schema",
  namespace: "rest-api-project"
})
// Returns: { endpoints: [...] }

// Agent C: Search for all API-related decisions
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "api%",
  namespace: "rest-api-project"
})
// Returns: ["api-schema", "api-auth-method", "api-rate-limiting"]
```

**Mechanism 2: Hooks (Automatic Coordination)**

Hooks fire automatically at key points:

- **Pre-task**: Setup (validate session, load context)
- **Post-edit**: Update memory with changes
- **Post-task**: Finalize (store results, metrics)
- **Session-end**: Generate summary

Agents don't manually invoke hooks—they fire automatically via Claude Code's native hook system.

**Mechanism 3: File Artifacts (Read/Write)**

Agents communicate by reading each other's outputs:

1. **Coder** writes → `sessions/.../artifacts/code/api.js`
2. **Tester** reads → Creates tests based on API code
3. **Reviewer** reads → Reviews both code and tests

### Agent Type Selection: Choosing the Right Specialist

With **50+ documented agent types** available (22 base definitions + extensibility → 80+ possible combinations), how do you choose?

See the [Agent Catalog](../../../docs/reference/agent-catalog.md) for the complete list.

**Core Agents (Use 80% of the time)**:
- `coder` - Implementation work (features, bug fixes)
- `tester` - Test creation (unit, integration, e2e)
- `reviewer` - Code review, quality checks, security
- `researcher` - Information gathering, analysis
- `planner` - Task breakdown, project planning

**Specialized Agents (Use for specific domains)**:
- `code-analyzer` - Static analysis, architecture review
- `cicd-engineer` - DevOps, Docker, CI/CD pipelines
- `backend-dev` - Backend-specific development
- `mobile-dev` - Mobile app development
- `system-architect` - System design, architecture decisions

**Coordination Agents (Use for complex workflows)**:
- `hierarchical-coordinator` - Tree-based coordination
- `mesh-coordinator` - Peer-to-peer coordination
- `adaptive-coordinator` - Dynamic coordination

**See full catalog**: `.claude/agents/` or [Agent Catalog](../../../docs/reference/agent-catalog.md)

### Practical Patterns: Real-World Workflows

**Pattern 1: Feature Development (4 agents)**

```javascript
[Single Message - All Parallel]:

// 1. Research requirements
Task("Requirements Analyst", "Analyze user stories for search feature. Define acceptance criteria. Store requirements in memory key 'search-requirements'.", "researcher")

// 2. Implement feature
Task("Feature Developer", "Retrieve search requirements from memory. Implement full-text search with fuzzy matching. Save to sessions/.../artifacts/code/.", "coder")

// 3. Test thoroughly
Task("QA Engineer", "Read search implementation. Write comprehensive tests including edge cases, performance tests. Aim for 95% coverage. Save to sessions/.../artifacts/tests/.", "tester")

// 4. Review quality
Task("Code Reviewer", "Review search implementation and tests. Check: code quality, test coverage, performance, security. Save report to sessions/.../artifacts/docs/review.md.", "reviewer")
```

**Pattern 2: Refactoring (3 agents)**

```javascript
[Single Message - All Parallel]:

// 1. Analyze current state
Task("Code Analyzer", "Analyze authentication module. Identify: code smells, duplication, performance issues, security concerns. Store findings in memory key 'refactor-analysis'.", "code-analyzer")

// 2. Apply refactoring
Task("Refactoring Specialist", "Retrieve refactor analysis from memory. Apply refactoring to improve code quality without changing behavior. Save to sessions/.../artifacts/code/.", "coder")

// 3. Verify behavior unchanged
Task("Regression Tester", "Compare old vs. new implementation. Run full test suite. Verify behavior is identical. Save verification report to sessions/.../artifacts/docs/.", "tester")
```

**Pattern 3: Bug Fix (3 agents)**

```javascript
[Single Message - All Parallel]:

// 1. Root cause analysis
Task("Bug Investigator", "Reproduce authentication timeout bug. Use debugging to identify root cause. Store findings in memory key 'bug-root-cause'.", "researcher")

// 2. Implement fix
Task("Bug Fixer", "Retrieve bug analysis from memory. Implement fix for authentication timeout. Add defensive checks. Save to sessions/.../artifacts/code/.", "coder")

// 3. Add regression tests
Task("Test Writer", "Read bug fix. Write regression tests to prevent this bug from returning. Test edge cases. Save to sessions/.../artifacts/tests/regression/.", "tester")
```

### Fan-Out/Fan-In Pattern: Aggregate Results

When you need multiple agents to work independently, then combine their results:

```javascript
// Phase 1: Fan-Out (parallel research)
[Parallel Execution]:
Task("Database Researcher", "Research database options. Store findings in memory key 'research/database'.", "researcher")
Task("Cache Researcher", "Research caching strategies. Store findings in memory key 'research/cache'.", "researcher")
Task("API Researcher", "Research API design patterns. Store findings in memory key 'research/api'.", "researcher")

// Phase 2: Fan-In (aggregate)
Task("System Architect", "Retrieve all research findings (keys: research/database, research/cache, research/api). Synthesize into unified architecture proposal. Save to sessions/.../artifacts/docs/architecture.md.", "system-architect")
```

**Ready to learn memory coordination?**

→ `/tour next` - Memory Coordination
→ `/tour back` - Session management

---

## Section 4: Memory Coordination (10 min)

### What Is Memory?

Memory is a **persistent, shared key-value store** (SQLite database at `.swarm/memory.db`) that allows agents to coordinate asynchronously.

**Current state**:
- **~110-120MB database** with **~100K memory entries (actively growing)**
- **15+ active namespaces** for different projects
- **Cross-session persistence** (survives chat restarts)
- **ACID transactions** (data integrity guaranteed)

> *Statistics reflect typical ranges. Exact values vary with workspace activity.*

**Key insight**: Memory is the "nervous system" that allows agents to communicate without direct interaction.

### Memory Operations: The Four Basics

All memory operations use the MCP memory tool: `mcp__claude-flow_alpha__memory_usage`

#### Operation 1: Store Data

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "design-decisions/authentication",
  value: JSON.stringify({
    decision: "JWT with RS256 signing",
    rationale: "Better security than HS256, supports key rotation",
    alternatives: ["Session cookies", "OAuth2"],
    date: "2025-11-21"
  }),
  namespace: "rest-api-project",
  ttl: 86400  // Optional: 24 hours in seconds
})
```

**Best practices**:
- Use descriptive, hierarchical keys (`design-decisions/authentication`)
- Store structured data as JSON strings
- Include rationale and alternatives for future reference
- Use TTL for temporary data

#### Operation 2: Retrieve Data

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "design-decisions/authentication",
  namespace: "rest-api-project"
})

// Returns:
{
  decision: "JWT with RS256 signing",
  rationale: "Better security than HS256, supports key rotation",
  alternatives: ["Session cookies", "OAuth2"],
  date: "2025-11-21"
}
```

**When to use**: Agent needs specific decision or context from previous work.

#### Operation 3: Search Pattern

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "design-decisions/%",  // SQL LIKE pattern
  namespace: "rest-api-project"
})

// Returns:
[
  "design-decisions/authentication",
  "design-decisions/database",
  "design-decisions/caching",
  "design-decisions/error-handling"
]
```

**When to use**: Agent needs to discover related decisions or context.

#### Operation 4: List All Keys

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "rest-api-project"
})

// Returns all keys in namespace:
[
  "design-decisions/authentication",
  "design-decisions/database",
  "implementation/api-endpoints",
  "implementation/database-schema",
  "testing/coverage-report"
]
```

**When to use**: Audit what's stored, debug coordination issues.

### Coordination Pattern: The Handoff

The most common memory pattern: Agent A stores, Agent B retrieves.

```
┌─────────────────────────────────────────────────────────┐
│ Agent A: Research Analyst                               │
└─────────────────────────────────────────────────────────┘
Task: "Research best database for e-commerce platform"

1. Analyzes requirements (10k+ products, real-time inventory)
2. Evaluates options:
   - PostgreSQL: ✅ ACID, ✅ Relations, ✅ Performance
   - MongoDB: ✅ Flexible schema, ❌ Weak transactions
   - DynamoDB: ✅ Scalable, ❌ Expensive, ❌ Complex queries

3. Stores decision:
   mcp__claude-flow_alpha__memory_usage({
     action: "store",
     key: "database-decision",
     value: JSON.stringify({
       choice: "PostgreSQL",
       rationale: "Need ACID transactions for inventory, complex queries for reporting",
       schema_considerations: ["Heavy indexing needed", "Partitioning for products table"]
     }),
     namespace: "ecommerce-project"
   })

┌─────────────────────────────────────────────────────────┐
│ Agent B: Backend Developer                              │
└─────────────────────────────────────────────────────────┘
Task: "Implement database based on research findings"

1. Retrieves decision:
   decision = mcp__claude-flow_alpha__memory_usage({
     action: "retrieve",
     key: "database-decision",
     namespace: "ecommerce-project"
   })
   // Returns: { choice: "PostgreSQL", rationale: "...", schema_considerations: [...] }

2. Implements PostgreSQL setup
3. Applies schema considerations (indexing, partitioning)
4. Stores implementation notes for tester:
   mcp__claude-flow_alpha__memory_usage({
     action: "store",
     key: "database-implementation",
     value: JSON.stringify({
       tables: ["products", "inventory", "orders"],
       indexes: ["products_sku_idx", "inventory_product_id_idx"],
       performance_notes: "Partitioned products table by category"
     }),
     namespace: "ecommerce-project"
   })

┌─────────────────────────────────────────────────────────┐
│ Agent C: Test Engineer                                  │
└─────────────────────────────────────────────────────────┘
Task: "Write comprehensive database tests"

1. Retrieves implementation notes:
   impl = mcp__claude-flow_alpha__memory_usage({
     action: "retrieve",
     key: "database-implementation",
     namespace: "ecommerce-project"
   })

2. Creates targeted tests:
   - Test all tables exist
   - Test indexes are created
   - Test partitioning works
   - Performance test with 10k products
```

**Result**: Three agents coordinate perfectly without direct communication.

### Namespace Strategy: Organizing Memory

Namespaces prevent cross-project pollution. Use session ID as namespace for isolation:

```javascript
// Per-session namespace (isolated)
namespace: "session-20251121-143022-rest-api"

// Project-wide namespace (shared across sessions)
namespace: "ecommerce-platform"

// Workspace-wide namespace (global coordination)
namespace: "workspace-coordination"

// Tutor progress (persistent learning)
namespace: "tutor-progress"
```

**Best practice**: Use session ID as namespace unless you need cross-session sharing.

### Fan-Out/Fan-In Pattern with Memory

When multiple agents need to work independently, then aggregate:

```javascript
// Phase 1: Fan-Out (parallel work, each stores to memory)
[Parallel Execution]:

Task("Security Auditor",
  "Audit authentication module for vulnerabilities. Store findings in memory key 'audit/security'.",
  "reviewer")

Task("Performance Auditor",
  "Profile authentication module for bottlenecks. Store findings in memory key 'audit/performance'.",
  "performance-benchmarker")

Task("Code Quality Auditor",
  "Analyze authentication module for code smells. Store findings in memory key 'audit/quality'.",
  "code-analyzer")

// Phase 2: Fan-In (aggregate all findings)
Task("Audit Report Generator",
  "Retrieve all audit findings (keys: audit/security, audit/performance, audit/quality). Generate comprehensive audit report. Save to sessions/.../artifacts/docs/audit-report.md.",
  "documenter")
```

**Memory state after Phase 1**:
```
memory["audit/security"] = { vulnerabilities: [...], severity: "medium" }
memory["audit/performance"] = { bottlenecks: [...], avg_response: "120ms" }
memory["audit/quality"] = { code_smells: [...], maintainability_score: 7.2 }
```

**Phase 2 agent retrieves all three**, synthesizes into unified report.

### Best Practices for Memory Coordination

**DO:**
- ✅ Use descriptive, hierarchical keys (`project/module/decision`)
- ✅ Store structured data as JSON strings (easy to parse)
- ✅ Include rationale and alternatives (context for future agents)
- ✅ Use session ID as namespace (isolation)
- ✅ Clean up memory after session via hooks (automatic)
- ✅ Document memory keys for team awareness

**DON'T:**
- ❌ Use generic keys like `data`, `result`, `output` (not descriptive)
- ❌ Store large files in memory (use file artifacts instead)
- ❌ Mix namespaces without clear reason (causes confusion)
- ❌ Forget to retrieve before implementing (breaks coordination)

### Practical Example: Building a Search Feature

Let's see memory coordination in action:

```javascript
// Agent 1: Requirements Analyst
Task("Requirements Analyst",
  "Analyze search requirements. Store in memory key 'search/requirements'.",
  "researcher")

// Memory stores:
memory["search/requirements"] = {
  types: ["full-text", "fuzzy"],
  fields: ["title", "content", "tags"],
  performance: "< 100ms response time",
  features: ["autocomplete", "filters", "sorting"]
}

// Agent 2: Backend Developer
Task("Backend Developer",
  "Retrieve search requirements from memory. Implement search API. Store API contract in memory key 'search/api'.",
  "coder")

// Memory stores:
memory["search/api"] = {
  endpoint: "/api/search",
  method: "POST",
  params: {
    query: "string",
    filters: "object",
    limit: "number"
  },
  response: {
    results: "array",
    total: "number",
    took: "number (ms)"
  }
}

// Agent 3: Frontend Developer
Task("Frontend Developer",
  "Retrieve search API contract from memory. Build React search UI.",
  "coder")

// Agent 4: Test Engineer
Task("Test Engineer",
  "Retrieve search requirements and API contract from memory. Write comprehensive tests.",
  "tester")
```

**Result**: All four agents work in harmony, guided by shared memory.

**Ready to learn file routing?**

→ `/tour next` - File Routing Rules
→ `/tour back` - Agent spawning

---

## Section 5: File Routing & Organization (8 min)

### The Golden Rule

**ALL working files go to session artifacts.** No exceptions for AI-generated content.

This simple rule keeps your workspace organized and makes cleanup trivial.

### Session Artifact Structure

Every session has five artifact directories:

```
sessions/session-YYYYMMDD-HHMMSS-<topic>/
└── artifacts/
    ├── code/          ← All source code (JS, Python, Go, etc.)
    ├── tests/         ← All test files (unit, integration, e2e)
    ├── docs/          ← All documentation (MD, specs, guides)
    ├── scripts/       ← All automation scripts (build, deploy, utils)
    └── notes/         ← Working notes, scratchpad, decisions
```

**Why this structure?**
- **Organization**: Related work stays together
- **Cleanup**: Easy to archive/delete entire session
- **Isolation**: Multiple sessions don't conflict
- **Collaboration**: Clear boundaries for agents

### The Routing Decision Tree

Use this three-question tree to route files correctly:

```
┌─────────────────────────────────────────────────────────┐
│ Q1: Is this a new file being created?                   │
└─────────────────────────────────────────────────────────┘
         │
         ├─ YES → Q2: Is this work for the current session?
         │              │
         │              ├─ YES → sessions/$SESSION_ID/artifacts/[type]/
         │              └─ NO  → ERROR: Should be in a session!
         │
         └─ NO → Q3: Is this an existing project file?
                       │
                       ├─ YES → Edit in original location
                       │        (package.json, CLAUDE.md, etc.)
                       │
                       └─ NO → ERROR: Where did this file come from?
```

### Routing Examples: Correct vs. Incorrect

**✅ CORRECT: New feature implementation**

```bash
# User: "Build authentication module"

# Agent creates:
sessions/session-20251121-150000-auth/artifacts/code/auth.js
sessions/session-20251121-150000-auth/artifacts/code/middleware/jwt.js
sessions/session-20251121-150000-auth/artifacts/tests/auth.test.js
sessions/session-20251121-150000-auth/artifacts/docs/AUTH-SPEC.md
sessions/session-20251121-150000-auth/artifacts/scripts/generate-keys.sh
sessions/session-20251121-150000-auth/artifacts/notes/decisions.md
```

**❌ INCORRECT: New files to root directories**

```bash
# Agent creates (WRONG!):
code/auth.js                 # ❌ Root directory!
tests/auth.test.js           # ❌ Root directory!
docs/AUTH-SPEC.md            # ❌ Root directory!
scripts/generate-keys.sh     # ❌ Root directory!
```

**Why wrong?** Pollutes root workspace, makes cleanup hard, breaks organization.

### Exceptions: Edit Existing Project Files

**The ONLY exception**: Editing existing project configuration files.

```bash
# ✅ CORRECT: Edit existing project files in place
Edit("package.json")              # Add new dependency
Edit("CLAUDE.md")                 # Update configuration
Edit(".claude/settings.json")     # Modify hook settings
Edit("README.md")                 # Update project overview
Edit("tsconfig.json")             # Change TypeScript config
```

**Why exception?** These files are part of the project infrastructure and should be version-controlled in their original location.

### When to Promote Files to Root

After session closeout, you can **optionally promote** valuable artifacts to the main workspace:

```bash
# Session closes, you review artifacts
/session-closeout

# Approved, now decide what to promote:
# ✅ Promote: User-facing documentation
cp sessions/session-123/artifacts/docs/API-SPEC.md docs/

# ✅ Promote: Reusable scripts
cp sessions/session-123/artifacts/scripts/deploy.sh scripts/

# ❌ Don't promote: Working notes
# (Keep in session backup for reference)

# ❌ Don't promote: Test code
# (Unless it's a shared test utility)
```

**Promotion is intentional and manual**. The system never auto-promotes.

### Why Routing Matters: Real Consequences

**Scenario 1: Without routing (chaos)**
```bash
# Multiple agents working simultaneously:
Agent A: Write("code/auth.js")      # Root directory
Agent B: Write("code/auth.js")      # Overwrites Agent A's work!
Agent C: Write("tests/test.js")     # Generic name, conflicts inevitable
Agent D: Write("docs/notes.md")     # Mixes with project docs

# Result: Files scattered, conflicts, confusion
```

**Scenario 2: With routing (organized)**
```bash
# Multiple sessions working simultaneously:
Session 1: Write("sessions/session-123-auth/artifacts/code/auth.js")
Session 2: Write("sessions/session-124-search/artifacts/code/search.js")
Session 3: Write("sessions/session-125-refactor/artifacts/code/refactored.js")

# Result: No conflicts, each session isolated, easy cleanup
```

### Agent Responsibility for Routing

**Agents automatically route files correctly** based on CLAUDE.md instructions. Your job is to verify paths are correct.

**What agents do**:
1. Read active session from memory
2. Construct path: `sessions/$SESSION_ID/artifacts/[type]/filename`
3. Create file at correct location
4. Update memory with file metadata

**What you do**:
- Verify paths in agent responses
- Correct if agent makes a mistake (rare)
- Understand the routing logic for custom work

### Practical Routing Example

Let's walk through routing for a blog platform:

```javascript
// User: "Build a blog platform with posts, comments, and authentication"
// Session: session-20251121-160000-blog-platform

[Parallel Agent Execution]:

Task("Backend Developer",
  "Build Express API for blog. Save all code to sessions/session-20251121-160000-blog-platform/artifacts/code/backend/.",
  "coder")
// Creates:
// - artifacts/code/backend/server.js
// - artifacts/code/backend/routes/posts.js
// - artifacts/code/backend/routes/comments.js
// - artifacts/code/backend/models/post.js

Task("Frontend Developer",
  "Build React blog UI. Save all code to sessions/session-20251121-160000-blog-platform/artifacts/code/frontend/.",
  "coder")
// Creates:
// - artifacts/code/frontend/App.jsx
// - artifacts/code/frontend/components/PostList.jsx
// - artifacts/code/frontend/components/CommentSection.jsx

Task("Test Engineer",
  "Write comprehensive tests. Save to sessions/session-20251121-160000-blog-platform/artifacts/tests/.",
  "tester")
// Creates:
// - artifacts/tests/api/posts.test.js
// - artifacts/tests/api/comments.test.js
// - artifacts/tests/ui/PostList.test.jsx

Task("Technical Writer",
  "Write API documentation and user guide. Save to sessions/session-20251121-160000-blog-platform/artifacts/docs/.",
  "documenter")
// Creates:
// - artifacts/docs/API-REFERENCE.md
// - artifacts/docs/USER-GUIDE.md
// - artifacts/docs/DEPLOYMENT.md
```

**Result**: All 4 agents work in parallel, all files properly routed to session artifacts, zero conflicts.

### Common Routing Mistakes

**Mistake 1: Using root directories for session work**
```bash
# ❌ WRONG
Write("code/feature.js")
Write("tests/feature.test.js")
Write("docs/feature.md")

# ✅ CORRECT
Write("sessions/session-123/artifacts/code/feature.js")
Write("sessions/session-123/artifacts/tests/feature.test.js")
Write("sessions/session-123/artifacts/docs/feature.md")
```

**Mistake 2: Creating files outside session artifacts**
```bash
# ❌ WRONG
Write("temp/working.js")                    # Not in session artifacts
Write("output/results.json")                # Not in session artifacts

# ✅ CORRECT
Write("sessions/session-123/artifacts/notes/working.js")
Write("sessions/session-123/artifacts/docs/results.json")
```

**Mistake 3: Editing project files in session artifacts**
```bash
# ❌ WRONG (editing project file in session)
Edit("sessions/session-123/artifacts/code/package.json")    # Wrong location!

# ✅ CORRECT (edit project file in place)
Edit("package.json")                                        # Original location
```

**Ready for next steps?**

→ `/tour next` - Next Steps & Resources
→ `/tour back` - Memory coordination

---

## Section 5.5: Skill Composition & Custom Commands (NEW)

**Duration**: ~8 minutes
**Goal**: Understand how skills integrate and how to create custom workflows

### Skill Integration: How Skills Work Together

This workspace includes 31 custom skills that integrate seamlessly. Skills don't work in isolation—they compose into powerful workflows.

**Meta-Skill Routing**:
```bash
# Natural language skill discovery
/meta-skill "help me optimize my prompts"

# Meta-skill analyzes your request:
→ Extracts keywords: ["optimize", "prompts"]
→ Scores skills: prompt-improver (95%), verification-quality (38%)
→ Auto-invokes prompt-improver (>80% confidence)
```

**Stream-Chain Sequential Execution**:
```bash
# Execute skills in sequence with data flow
/stream-chain prompt-improver → verification-quality → github-code-review

# Each skill receives output from previous skill
# Data flows automatically between skills
```

### Custom Commands: Powerful Workflow Composition

Custom commands let you combine multiple skills into reusable workflows. This is where the real power of skill integration shines.

**Example: Full-Stack Feature Command**:
```bash
/full-stack-feature user-authentication --topology=mesh --phases=all

# This custom command executes:
1. SPARC Specification Phase
   - researcher skill: Gather requirements
   - planner skill: Create user stories
   
2. SPARC Architecture Phase
   - system-architect skill: Design system
   - db-architect skill: Design database
   
3. Swarm Orchestration Setup
   - swarm-orchestration skill: Initialize mesh topology
   - Spawn backend, frontend, database agents
   
4. SPARC Refinement Phase (Parallel)
   - coder skill: Implement backend
   - coder skill: Implement frontend
   - tester skill: Write tests
   
5. Quality Gates
   - github-code-review skill: Review code
   - verification-quality skill: Score quality, rollback if needed
   
6. SPARC Completion Phase
   - documenter skill: Generate documentation
   - workflow-manager skill: Prepare deployment
```

**Why Custom Commands Are Powerful**:
- **Reusable**: Save workflows for repeated use
- **Composable**: Combine any skills into workflows
- **Parameterized**: Execute with different parameters
- **Coordinated**: Skills work together seamlessly
- **Scalable**: Handle complex multi-phase workflows

### Creating Your Own Custom Commands

You can create custom commands by combining skills:

```bash
# Example: Code review workflow
/custom-command code-review-workflow
  Step 1: swarm-orchestration --topology=star
  Step 2: github-code-review --strict
  Step 3: verification-quality --threshold=80
  Step 4: prompt-improver --suggest-improvements
```

**Best Practices**:
- Start with meta-skill to discover relevant skills
- Use stream-chain for sequential execution
- Combine with SPARC methodology for structured workflows
- Use memory to pass data between skills
- Test workflows before saving as custom commands

### Integration Examples

**Skill + Topology Integration**:
```bash
# Skills can request specific topologies
/swarm-orchestration --topology=hierarchical --max-agents=8
→ Skills coordinate agents using hierarchical topology
```

**Skill + Memory Integration**:
```bash
# Skills store patterns in memory
/prompt-improver "optimize this code"
→ Stores successful patterns in memory
→ Future prompts use learned patterns
```

**Skill + SPARC Integration**:
```bash
# SPARC methodology uses skills for each phase
/sparc-methodology full-feature
→ Specification phase: Uses researcher, planner skills
→ Architecture phase: Uses system-architect, db-architect skills
→ Refinement phase: Uses coder, tester skills
→ Completion phase: Uses documenter, workflow-manager skills
```

### Next: Advanced Patterns

In the Advanced pathway, you'll learn:
- Deep SPARC + topology integration
- Advanced orchestration patterns
- Custom command optimization
- ReasoningBank learning patterns

---

## Section 6: Next Steps & Resources (5 min)

### What You've Mastered

Congratulations! You've completed the intermediate pathway. You now understand:

✓ **Workspace architecture** - How Claude Code, claude-flow, and sessions work together
✓ **Session lifecycle** - Creation, work phase, HITL closeout, archiving
✓ **Agent spawning patterns** - Single, parallel, sequential, fan-out/fan-in
✓ **Memory coordination** - Store, retrieve, search, namespace strategies
✓ **File routing** - Session artifacts structure, routing decision tree

These skills enable you to build sophisticated multi-agent workflows with confidence.

### Ready for More?

Your learning journey has three paths forward:

#### Path 1: Hands-On Practice with Tutor Mode

The best way to solidify your knowledge is practice. Use **tutor-mode** for interactive exercises:

```bash
# Start interactive learning
/tutor-mode "multi-agent coordination"

# Or specific topics:
/tutor-mode "memory coordination patterns"
/tutor-mode "swarm topologies"
/tutor-mode "parallel agent spawning"
```

**What tutor-mode provides**:
- Hands-on exercises with real tasks
- Immediate feedback on your approach
- Adaptive difficulty based on your progress
- Progress tracking across sessions
- Quality-scored references (safe materials only)

**Recommended exercises**:
1. Build a REST API with 5 parallel agents
2. Implement fan-out/fan-in pattern for research
3. Create a refactoring workflow with memory handoffs
4. Practice session lifecycle (create → work → closeout → promote)

#### Path 2: Explore Advanced Topics

Ready to go deeper? Try the **advanced pathway**:

```bash
/tour jump advanced
```

**What you'll learn**:
- **Architecture deep-dive** - Stock vs. custom analysis, extension points
- **Swarm topologies** - When to use mesh, hierarchical, star, ring
- **Consensus mechanisms** - Byzantine fault tolerance, Raft, Gossip
- **Hive-Mind coordination** - Queen-based collective intelligence
- **ReasoningBank intelligence** - Adaptive learning and pattern recognition
- **Performance optimization** - Bottleneck detection, token efficiency
- **Extension development** - Build custom skills and agents

**Advanced pathway duration**: ~75 minutes (8 sections)

#### Path 3: Specialized Skills for Your Domain

Use **meta-skill** to discover specialized capabilities:

```bash
# Natural language skill discovery
/meta-skill "I need help with GitHub automation"
/meta-skill "I want to optimize performance"
/meta-skill "I need to build a mobile app"
```

**Specialized skill categories**:

**1. Development Workflows**:
- `sparc-methodology` - Systematic TDD with multi-agent orchestration
- `pair-programming` - AI-assisted coding with verification
- `verification-quality` - Truth scoring with automatic rollback

**2. GitHub Integration**:
- `github-workflow-automation` - CI/CD pipeline automation
- `github-code-review` - Multi-agent code review swarms
- `github-release-management` - Automated versioning and deployment
- `github-project-management` - Issue tracking and sprint planning
- `github-multi-repo` - Multi-repository coordination

**3. Swarm Coordination**:
- `swarm-orchestration` - Multi-agent workflow patterns
- `swarm-advanced` - Research, development, testing patterns
- `hive-mind-advanced` - Queen-led collective intelligence
- `performance-analysis` - Bottleneck detection and optimization

**4. Learning & Intelligence**:
- `reasoningbank-intelligence` - Adaptive learning and strategy optimization
- `reasoningbank-agentdb` - ReasoningBank + AgentDB integration
- `agentdb-vector-search` - Semantic search and retrieval
- `agentdb-learning` - 9 RL algorithms for self-learning agents

**5. Platform Integration** (Optional):
- `flow-nexus-swarm` - Cloud-based swarm deployment
- `flow-nexus-neural` - Distributed neural network training
- `flow-nexus-platform` - Auth, apps, payments (requires registration)

### Documentation Resources

**Essential reading**:

**Workflow Guides**:
- [Swarm Coordination Guide](../../../docs/coordinate/swarm-coordination.md) - Multi-agent patterns
- [Memory Coordination Tutorial](../../../docs/operate/memory-coordination-tutorial.md) - Advanced memory patterns
- [Advanced Agent Patterns](../../../docs/build/spawning-agents.md) - Sophisticated spawning techniques

**Reference Materials**:
- [Agent Catalog](../../../docs/reference/agent-catalog.md) - All 80+ agent types detailed
- [Architecture Overview](../../../docs/reference/architecture.md) - System design and stock-first analysis
- [Troubleshooting Guide](../../../docs/operate/troubleshooting.md) - Common issues and solutions

**Learning Path**:
- [Documentation Overview](../../../docs/README.md) - Complete learning journey

### Your Completion Status

```
╔══════════════════════════════════════════════════════════╗
║         Intermediate Pathway Complete! 🚀                 ║
╚══════════════════════════════════════════════════════════╝

You're now proficient with:
✓ Session-based workflows (containment-promotion pattern)
✓ Multi-agent coordination (parallel spawning, memory handoffs)
✓ Memory-based state management (store, retrieve, search)
✓ Proper file organization (session artifacts routing)

Performance achievements unlocked:
→ 2.8-4.4x speed improvement (parallel execution)
→ 32.3% token reduction (efficient coordination)
→ 10-20x faster agent spawning (concurrent execution)

Next steps:
→ /tour jump advanced       (Architecture deep-dive)
→ /tutor-mode "coordination" (Hands-on practice)
→ /meta-skill "github"       (Specialized capabilities)
→ Start building complex workflows in your own projects!

Thank you for completing the intermediate pathway.
You're ready to build sophisticated multi-agent systems.
```

### Navigation Options

**Continue Learning**:
- `/tour jump advanced` - Architecture deep-dive (75 min)
- `/tour reset` - Restart from beginning
- Exit and start building!

**Get Help**:
- `/tutor-mode` - Interactive practice with feedback
- `/meta-skill` - Discover specialized skills
- Check documentation in `docs/` directory

**Build Something**:
- `/session-start my-project` - Create your first coordinated workflow
- Apply what you've learned to real projects
- Experiment with different agent patterns

---

**You've completed the intermediate pathway. Time to build!**
