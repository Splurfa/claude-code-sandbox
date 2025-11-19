# Parallel Execution

The "one message" rule is the key to 2.8-4.4x speed improvements. Master this and you'll unlock claude-flow's full power.

## The Golden Rule

**ONE MESSAGE = ALL RELATED OPERATIONS**

Everything that can run in parallel MUST be in a single message:
- Agent spawning
- Todo creation
- File operations
- Memory operations
- Bash commands

## Why This Matters

### Sequential Execution (Wrong)
```
Message 1: Task("Backend", "Build API", "backend-dev")
[Wait for completion]

Message 2: Task("Frontend", "Build UI", "coder")
[Wait for completion]

Message 3: Task("Tester", "Write tests", "tester")
[Wait for completion]

Total time: 45 minutes
```

### Parallel Execution (Correct)
```
[Single Message]:
  Task("Backend", "Build API", "backend-dev")
  Task("Frontend", "Build UI", "coder")
  Task("Tester", "Write tests", "tester")

Total time: 15 minutes (3x faster)
```

**All three agents work simultaneously.**

## The Complete Pattern

Here's the perfect single-message structure:

```javascript
[Single Message - All Operations]:

// 1. Optional: MCP coordination setup
mcp__claude_flow__swarm_init({ topology: "mesh" })

// 2. Spawn ALL agents in parallel
Task("Research Agent", "Analyze auth patterns. Store findings in memory under 'swarm/researcher/auth-patterns'.", "researcher")

Task("Backend Agent", "Build authentication API using research findings from memory. Save to sessions/session-YYYYMMDD-HHMMSS-auth-system/artifacts/code/", "backend-dev")

Task("Database Agent", "Design user authentication schema. Store schema in memory under 'swarm/database/schema'.", "code-analyzer")

Task("Frontend Agent", "Build login UI using API contract from memory. Save to sessions/.../artifacts/code/", "coder")

Task("Test Agent", "Write comprehensive tests using API contract from memory. Save to sessions/.../artifacts/tests/", "tester")

Task("Security Agent", "Audit authentication system for vulnerabilities. Report to sessions/.../artifacts/docs/security-audit.md", "security-manager")

Task("Docs Agent", "Create API documentation and user guide. Save to sessions/.../artifacts/docs/", "api-docs")

// 3. Batch ALL todos together (8-10 minimum)
TodoWrite({
  todos: [
    {id: "1", content: "Research authentication patterns", status: "in_progress", priority: "high"},
    {id: "2", content: "Design database schema", status: "in_progress", priority: "high"},
    {id: "3", content: "Implement backend API", status: "in_progress", priority: "high"},
    {id: "4", content: "Build frontend UI", status: "in_progress", priority: "high"},
    {id: "5", content: "Write comprehensive tests", status: "pending", priority: "medium"},
    {id: "6", content: "Security audit", status: "pending", priority: "high"},
    {id: "7", content: "API documentation", status: "pending", priority: "medium"},
    {id: "8", content: "User guide", status: "pending", priority: "low"},
    {id: "9", content: "Integration testing", status: "pending", priority: "medium"},
    {id: "10", content: "Performance optimization", status: "pending", priority: "low"}
  ]
})

// 4. Batch file operations (if needed)
Bash("mkdir -p sessions/session-YYYYMMDD-HHMMSS-auth-system/artifacts/{code,tests,docs,scripts}")

// 5. Batch memory operations (if coordinating upfront)
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "swarm/coordination/project-kickoff",
  value: JSON.stringify({
    project: "auth-system",
    agents: 7,
    started: new Date().toISOString()
  }),
  namespace: "coordination"
})
```

**Result**: All 7 agents start simultaneously, coordinate through memory, complete in parallel.

## Coordination Through Memory

Agents coordinate via memory without blocking:

### Agent Execution Timeline

**T=0s** (All agents spawn):
```
Researcher starts analysis
Database starts schema design
Backend waits for researcher findings
Frontend waits for API contract
Tester waits for API contract
Security waits for implementation
Docs starts general documentation
```

**T=3min** (Researcher completes):
```javascript
// Researcher stores findings
memory.store("swarm/researcher/auth-patterns", {...})

// Backend sees findings available, starts coding
Backend unblocks, starts implementation
```

**T=8min** (Database completes):
```javascript
// Database stores schema
memory.store("swarm/database/schema", {...})

// Backend reads schema, continues implementation
Backend reads schema, adapts API accordingly
```

**T=10min** (Backend completes):
```javascript
// Backend stores API contract
memory.store("swarm/shared/api-contract", {...})

// Frontend and Tester unblock
Frontend reads contract, starts UI implementation
Tester reads contract, starts writing tests
Security starts auditing implementation
```

**T=15min** (All complete):
```
All agents finish
All artifacts saved to session directories
Coordination complete
```

**Total time**: 15 minutes (vs 45 minutes sequential)

## Real Example: Hive-Mind Integration

**Session**: `session-20251115-162200-hive-mind-integration`

### The Single Message

```javascript
[One Message - Complete Integration]:

Task("Integration Specialist",
  "Integrate Byzantine consensus into hive-mind coordination system. " +
  "Read existing hive-mind code from memory or files. " +
  "Implement BFT algorithm with 3f+1 nodes. " +
  "Store integration API in memory under 'swarm/integration/api-contract'. " +
  "Save implementation to sessions/session-20251115-162200-hive-mind-integration/artifacts/code/",
  "coder")

Task("Test Engineer",
  "Create comprehensive integration tests for Byzantine consensus. " +
  "Read API contract from memory 'swarm/integration/api-contract'. " +
  "Test fault tolerance scenarios (f=1, f=2). " +
  "Save tests to sessions/.../artifacts/tests/",
  "tester")

Task("Documentation Writer",
  "Document Byzantine consensus integration with usage examples. " +
  "Read API contract from memory. " +
  "Create integration guide and API reference. " +
  "Save to sessions/.../artifacts/docs/",
  "researcher")

Task("Security Reviewer",
  "Review Byzantine consensus implementation for vulnerabilities. " +
  "Check for edge cases and attack vectors. " +
  "Report findings to sessions/.../artifacts/docs/security-review.md",
  "security-manager")

TodoWrite({
  todos: [
    {id: "1", content: "Implement Byzantine consensus integration", status: "in_progress", priority: "critical"},
    {id: "2", content: "Write fault tolerance tests", status: "in_progress", priority: "high"},
    {id: "3", content: "Create integration documentation", status: "in_progress", priority: "high"},
    {id: "4", content: "Security review", status: "in_progress", priority: "critical"},
    {id: "5", content: "Performance benchmarking", status: "pending", priority: "medium"},
    {id: "6", content: "Edge case testing", status: "pending", priority: "medium"},
    {id: "7", content: "API documentation", status: "pending", priority: "high"},
    {id: "8", content: "Integration with queen selection", status: "pending", priority: "low"}
  ]
})
```

**Result**:
- All 4 agents worked in parallel
- Integration complete in 25 minutes
- 100% test coverage achieved
- Security review passed
- Full documentation created

## Batching Operations

### TodoWrite Batching

**❌ Wrong (Multiple calls)**:
```javascript
Message 1: TodoWrite({ todos: [{...one todo...}] })
Message 2: TodoWrite({ todos: [{...another todo...}] })
```

**✅ Correct (Single batched call)**:
```javascript
TodoWrite({
  todos: [
    {id: "1", content: "Task 1", status: "in_progress", priority: "high"},
    {id: "2", content: "Task 2", status: "in_progress", priority: "high"},
    {id: "3", content: "Task 3", status: "pending", priority: "medium"},
    {id: "4", content: "Task 4", status: "pending", priority: "medium"},
    {id: "5", content: "Task 5", status: "pending", priority: "low"},
    // ... minimum 8-10 todos for comprehensive tracking
  ]
})
```

### File Operations Batching

**❌ Wrong (Sequential)**:
```javascript
Message 1: Write("file1.js", content1)
Message 2: Write("file2.js", content2)
```

**✅ Correct (Parallel)**:
```javascript
[Single Message]:
  Write("sessions/.../artifacts/code/file1.js", content1)
  Write("sessions/.../artifacts/code/file2.js", content2)
  Write("sessions/.../artifacts/tests/file1.test.js", testContent1)
```

### Memory Operations Batching

**❌ Wrong (Sequential)**:
```javascript
Message 1: memory.store("key1", value1)
Message 2: memory.store("key2", value2)
```

**✅ Correct (Single message, multiple operations)**:
```javascript
[Single Message]:
  mcp__claude_flow_alpha__memory_usage({action: "store", key: "key1", value: value1})
  mcp__claude_flow_alpha__memory_usage({action: "store", key: "key2", value: value2})
  mcp__claude_flow_alpha__memory_usage({action: "store", key: "key3", value: value3})
```

## Agent Coordination Patterns

### Pattern 1: Linear Dependency Chain

**Scenario**: Research → Code → Test (sequential dependencies)

```javascript
[Single Message]:
  Task("Researcher", "Analyze patterns. Store findings in memory 'swarm/research/findings'.", "researcher")

  Task("Coder", "Wait for 'swarm/research/findings' in memory. Then implement based on findings.", "coder")

  Task("Tester", "Wait for 'swarm/coder/implementation-complete' in memory. Then test.", "tester")
```

**How it works**: Agents check memory for prerequisites before starting. No manual coordination needed.

### Pattern 2: Parallel with Merge Point

**Scenario**: Multiple agents research different areas, one agent synthesizes

```javascript
[Single Message]:
  Task("Security Researcher", "Research security patterns. Store in 'swarm/research/security'.", "researcher")

  Task("Performance Researcher", "Research performance patterns. Store in 'swarm/research/performance'.", "researcher")

  Task("Scalability Researcher", "Research scalability patterns. Store in 'swarm/research/scalability'.", "researcher")

  Task("Architect", "Wait for all three research findings. Synthesize into system design.", "system-architect")
```

### Pattern 3: Fan-Out

**Scenario**: One agent creates contract, many implement against it

```javascript
[Single Message]:
  Task("API Designer", "Design API contract. Store in 'swarm/shared/api-contract'.", "system-architect")

  Task("Backend Impl", "Wait for API contract. Implement server-side.", "backend-dev")

  Task("Frontend Impl", "Wait for API contract. Implement client-side.", "coder")

  Task("Mobile Impl", "Wait for API contract. Implement mobile app.", "mobile-dev")

  Task("Tester", "Wait for API contract. Write integration tests.", "tester")
```

### Pattern 4: No Dependencies (Pure Parallel)

**Scenario**: Completely independent tasks

```javascript
[Single Message]:
  Task("Backend Dev", "Build user service API.", "backend-dev")
  Task("Frontend Dev", "Build landing page.", "coder")
  Task("DevOps", "Setup CI/CD pipeline.", "cicd-engineer")
  Task("Docs Writer", "Write project README.", "api-docs")
```

All four agents work independently, no coordination needed.

## Performance Metrics

**Real data from this workspace**:

| Agents | Sequential Time | Parallel Time | Speedup |
|--------|----------------|---------------|---------|
| 2      | 30 min         | 15 min        | 2.0x    |
| 4      | 60 min         | 18 min        | 3.3x    |
| 7      | 105 min        | 25 min        | 4.2x    |
| 10     | 150 min        | 35 min        | 4.3x    |

**Diminishing returns** after 10 agents due to coordination overhead.

## You'll Know You Understand When...

✅ You spawn all agents in a single message without thinking
✅ You batch 8-10 todos in one TodoWrite call
✅ You understand coordination through memory
✅ You can design dependency patterns (linear, fan-out, merge)
✅ Your workflows feel 3-4x faster

## Try This Exercise

**Build a full-stack e-commerce cart**:

In ONE message, spawn:
1. Backend developer - Cart API (add/remove/checkout)
2. Frontend developer - Cart UI components
3. Database architect - Cart schema design
4. Payment integration - Stripe integration
5. Test engineer - E2E cart tests
6. Security auditor - Payment security review
7. Documentation writer - API and integration docs

**Success criteria**:
- All 7 agents in single message
- Proper memory coordination (schema → backend → frontend → tester)
- All artifacts in session directories
- Complete in under 30 minutes

## Common Mistakes

**❌ Spawning agents across multiple messages**
```
Message 1: Task("Agent 1")
Message 2: Task("Agent 2")
```

**✅ One message, all agents**
```
[Single Message]:
  Task("Agent 1")
  Task("Agent 2")
  ...
```

**❌ Single todos**
```
TodoWrite({ todos: [{...one...}] })
```

**✅ Batch 8-10 todos**
```
TodoWrite({ todos: [{...}, {...}, {...}, {...}, {...}, {...}, {...}, {...}] })
```

**❌ Not specifying memory coordination**
```
Task("Coder", "Build API", "coder")
Task("Tester", "Test API", "tester")
// How does tester know what coder built?
```

**✅ Explicit memory coordination**
```
Task("Coder", "Build API. Store contract in memory 'swarm/shared/api-contract'.", "coder")
Task("Tester", "Read API contract from memory 'swarm/shared/api-contract'. Write tests.", "tester")
```

## Next Step

You've mastered parallel execution! Now let's dive deeper into memory coordination patterns.

→ **Next**: [Memory Coordination](memory-coordination-tutorial.md)
