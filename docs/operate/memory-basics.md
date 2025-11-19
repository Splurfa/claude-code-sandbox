# Memory Coordination

**Purpose**: Cross-agent coordination through persistent memory storage using MCP tools.

**Status**: ✅ Verified MCP Tool Implementation (Stock Claude-Flow)

---

## The Reality

**Memory is ONLY accessible via MCP tools** - there is NO hooks command for memory operations.

**Storage Location**: `.swarm/memory.db` (SQLite database, 115MB+)

**Database Table**: `memory_entries` (Important: The actual table name is `memory_entries`, NOT "memory". Any direct SQL queries must use this exact table name.)

**Key Operations**:
- Store agent decisions and state
- Retrieve context from previous agents
- List all memory entries in a namespace
- Search memory with pattern matching
- Cross-session persistence

---

## MCP Memory Tool Signatures

### Store Data

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "unique-identifier",
  value: "data-to-store",
  namespace: "category",  // Optional, defaults to "default"
  ttl: 3600              // Optional, time-to-live in seconds
})
```

**Example - Agent Handoff**:
```javascript
// Researcher stores findings for Coder
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "swarm/researcher/api-analysis",
  value: JSON.stringify({
    bestPractices: ["REST", "OpenAPI"],
    recommendations: ["Express.js", "Zod validation"],
    timestamp: Date.now()
  }),
  namespace: "coordination"
})
```

### Retrieve Data

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "unique-identifier",
  namespace: "category"  // Optional, defaults to "default"
})
```

**Example - Next Agent Reads**:
```javascript
// Coder retrieves researcher's findings
const result = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "swarm/researcher/api-analysis",
  namespace: "coordination"
})

// result.value contains JSON string from researcher
const findings = JSON.parse(result.value)
```

### List All Entries

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "category"  // Optional, defaults to "default"
})
```

**Example - Check Agent Status**:
```javascript
// See all coordination state
mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "coordination"
})

// Returns array of all keys in namespace
// ["swarm/researcher/status", "swarm/coder/progress", "swarm/tester/results"]
```

### Search with Patterns

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "search-pattern%",  // SQL LIKE syntax
  namespace: "category"        // Optional
})
```

**Example - Find Agent Results**:
```javascript
// Find all researcher outputs
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "swarm/researcher/%",
  namespace: "coordination"
})

// Find specific task results
mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "%/task-123/%",
  namespace: "coordination"
})
```

### Delete Entry

```javascript
mcp__claude-flow_alpha__memory_usage({
  action: "delete",
  key: "unique-identifier",
  namespace: "category"  // Optional
})
```

**Example - Cleanup**:
```javascript
// Remove temporary state after task completion
mcp__claude-flow_alpha__memory_usage({
  action: "delete",
  key: "swarm/temp/build-cache",
  namespace: "coordination"
})
```

---

## Cross-Agent Coordination Patterns

### Pattern 1: Sequential Agent Handoff

**Scenario**: Researcher → Coder → Tester pipeline

```javascript
// Agent 1: Researcher stores analysis
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "pipeline/task-456/research",
  value: JSON.stringify({
    requirements: ["Auth", "RBAC"],
    architecture: "Layered",
    dependencies: ["express", "jsonwebtoken"]
  }),
  namespace: "coordination"
})

// Agent 2: Coder retrieves and implements
const research = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "pipeline/task-456/research",
  namespace: "coordination"
})

// Coder stores implementation status
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "pipeline/task-456/implementation",
  value: JSON.stringify({
    files: ["auth.js", "middleware.js"],
    status: "complete",
    apiEndpoints: ["/login", "/logout"]
  }),
  namespace: "coordination"
})

// Agent 3: Tester retrieves both
const implementation = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "pipeline/task-456/implementation",
  namespace: "coordination"
})

// Tester stores test results
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "pipeline/task-456/tests",
  value: JSON.stringify({
    coverage: "94%",
    passing: 42,
    failing: 0
  }),
  namespace: "coordination"
})
```

### Pattern 2: Parallel Agent Sync

**Scenario**: Multiple agents working concurrently need shared state

```javascript
// Agent 1: Backend stores API schema
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "shared/api-schema",
  value: JSON.stringify({
    endpoints: {
      "/users": { method: "GET", auth: true },
      "/posts": { method: "POST", auth: true }
    }
  }),
  namespace: "coordination"
})

// Agent 2: Frontend retrieves schema for UI
const schema = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "shared/api-schema",
  namespace: "coordination"
})

// Agent 3: Tester retrieves schema for test generation
const apiSchema = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "shared/api-schema",
  namespace: "coordination"
})
```

### Pattern 3: Status Broadcasting

**Scenario**: Agents report progress for monitoring

```javascript
// Each agent stores status
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "status/backend-agent",
  value: JSON.stringify({
    agent: "backend-dev",
    status: "in_progress",
    currentTask: "Building REST endpoints",
    progress: 0.6
  }),
  namespace: "coordination"
})

mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "status/frontend-agent",
  value: JSON.stringify({
    agent: "frontend-dev",
    status: "in_progress",
    currentTask: "Creating React components",
    progress: 0.4
  }),
  namespace: "coordination"
})

// Coordinator checks all agent status
const allStatus = await mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "status/%",
  namespace: "coordination"
})
```

### Pattern 4: Decision Recording

**Scenario**: Store architectural decisions for future reference

```javascript
// Store decision with rationale
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "decisions/database-choice",
  value: JSON.stringify({
    decision: "PostgreSQL",
    rationale: "ACID compliance, JSON support, complex queries",
    alternatives: ["MongoDB", "MySQL"],
    decidedBy: "architect-agent",
    timestamp: Date.now()
  }),
  namespace: "architecture"
})

// Retrieve for documentation
const dbDecision = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "decisions/database-choice",
  namespace: "architecture"
})
```

---

## Namespace Best Practices

### Recommended Namespaces

```javascript
// Cross-agent coordination
namespace: "coordination"

// Architectural decisions
namespace: "architecture"

// Task-specific state
namespace: "task-456"

// Session-specific data
namespace: "session-20251118"

// Agent-specific cache
namespace: "agent-researcher"

// Default (use sparingly)
namespace: "default"
```

### Namespace Patterns

**Hierarchical Keys**:
```javascript
// Pattern: namespace/agent/task/step
key: "coordination/researcher/task-123/analysis"
key: "coordination/coder/task-123/implementation"
key: "coordination/tester/task-123/results"

// Pattern: namespace/category/identifier
key: "architecture/decisions/auth-strategy"
key: "architecture/patterns/api-design"
key: "architecture/dependencies/runtime"
```

**Why Namespaces Matter**:
1. **Isolation**: Prevent key collisions between different workflows
2. **Organization**: Logical grouping of related data
3. **Cleanup**: Delete entire namespace at once
4. **Search**: Pattern matching within specific contexts

---

## TTL (Time-To-Live) Usage

### Short-Term Cache

```javascript
// Cache expensive computation for 1 hour
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "cache/analysis-results",
  value: JSON.stringify(largeDataset),
  namespace: "coordination",
  ttl: 3600  // 1 hour in seconds
})
```

### Session-Based TTL

```javascript
// Store session data that expires in 24 hours
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "session/user-preferences",
  value: JSON.stringify(preferences),
  namespace: "session-20251118",
  ttl: 86400  // 24 hours
})
```

### Permanent Storage

```javascript
// No TTL = permanent (until manually deleted)
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "decisions/system-architecture",
  value: JSON.stringify(architecture),
  namespace: "architecture"
  // No ttl parameter = permanent
})
```

---

## Cross-Session Persistence

**Reality**: Memory persists across sessions via `.swarm/memory.db`

### Session Continuity Pattern

```javascript
// Session 1: Store context
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "project/auth-implementation/status",
  value: JSON.stringify({
    phase: "implementation",
    completedSteps: ["research", "design"],
    nextSteps: ["testing", "documentation"],
    lastSession: "session-20251117-100232"
  }),
  namespace: "project-auth"
})

// Session 2 (next day): Retrieve context
const previousContext = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "project/auth-implementation/status",
  namespace: "project-auth"
})

// Continue where left off
const context = JSON.parse(previousContext.value)
console.log(`Resuming from: ${context.phase}`)
console.log(`Next steps: ${context.nextSteps.join(", ")}`)
```

### Project Memory Pattern

```javascript
// Store project-wide decisions
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "project/coding-standards",
  value: JSON.stringify({
    linter: "ESLint",
    formatter: "Prettier",
    testFramework: "Jest",
    conventions: ["camelCase", "2-space-indent"]
  }),
  namespace: "project-settings"
})

// Any agent in any session can retrieve
const standards = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "project/coding-standards",
  namespace: "project-settings"
})
```

---

## Real-World Examples

### Example 1: Full-Stack Feature Build

```javascript
// Step 1: Researcher analyzes requirements
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "feature/user-profile/research",
  value: JSON.stringify({
    uiComponents: ["ProfileCard", "EditForm", "AvatarUpload"],
    apiEndpoints: ["/api/profile", "/api/avatar"],
    database: { table: "user_profiles", fields: ["bio", "avatar_url"] },
    dependencies: ["multer", "sharp"]
  }),
  namespace: "coordination"
})

// Step 2: Backend developer builds API
const research = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "feature/user-profile/research",
  namespace: "coordination"
})

mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "feature/user-profile/backend",
  value: JSON.stringify({
    routes: ["/api/profile", "/api/avatar"],
    controllers: ["profileController.js"],
    middleware: ["uploadMiddleware.js"],
    tests: ["profile.test.js"]
  }),
  namespace: "coordination"
})

// Step 3: Frontend developer builds UI
const backendInfo = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "feature/user-profile/backend",
  namespace: "coordination"
})

mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "feature/user-profile/frontend",
  value: JSON.stringify({
    components: ["ProfileCard.jsx", "EditForm.jsx"],
    hooks: ["useProfile.js"],
    api: backendInfo.routes
  }),
  namespace: "coordination"
})

// Step 4: Tester creates comprehensive tests
const allInfo = await mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "feature/user-profile/%",
  namespace: "coordination"
})

// allInfo contains research, backend, frontend data
```

### Example 2: Architecture Decision Flow

```javascript
// Architect analyzes options
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "decision/state-management",
  value: JSON.stringify({
    options: [
      { name: "Redux", pros: ["DevTools", "Ecosystem"], cons: ["Boilerplate"] },
      { name: "Zustand", pros: ["Simple", "Small"], cons: ["Less tooling"] },
      { name: "Context", pros: ["Built-in"], cons: ["Performance"] }
    ],
    recommendation: "Zustand",
    rationale: "Project needs simplicity over DevTools"
  }),
  namespace: "architecture"
})

// Developer implements based on decision
const decision = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "decision/state-management",
  namespace: "architecture"
})

// Reviewer checks alignment with decision
const architectureDecisions = await mcp__claude-flow_alpha__memory_usage({
  action: "search",
  pattern: "decision/%",
  namespace: "architecture"
})
```

### Example 3: Multi-Repo Synchronization

```javascript
// Track sync status across repositories
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "sync/packages/status",
  value: JSON.stringify({
    repos: ["api-service", "web-app", "mobile-app"],
    version: "2.0.0",
    synced: ["api-service", "web-app"],
    pending: ["mobile-app"],
    conflicts: []
  }),
  namespace: "multi-repo"
})

// Check sync status before operations
const syncStatus = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "sync/packages/status",
  namespace: "multi-repo"
})

if (syncStatus.pending.length > 0) {
  console.log(`Pending sync: ${syncStatus.pending.join(", ")}`)
}
```

---

## Common Patterns

### Pattern: Agent Status Tracking

```javascript
// Each agent stores status with standardized format
const storeAgentStatus = (agentName, status, task, progress) => {
  mcp__claude-flow_alpha__memory_usage({
    action: "store",
    key: `agent/${agentName}/status`,
    value: JSON.stringify({
      agent: agentName,
      status: status,        // "idle", "working", "blocked", "complete"
      currentTask: task,
      progress: progress,    // 0.0 to 1.0
      timestamp: Date.now()
    }),
    namespace: "coordination"
  })
}

// Usage
storeAgentStatus("researcher", "complete", "API analysis", 1.0)
storeAgentStatus("coder", "working", "Building endpoints", 0.6)
```

### Pattern: Task Dependency Chain

```javascript
// Store task dependencies
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "task/build-auth/dependencies",
  value: JSON.stringify({
    task: "build-auth",
    dependsOn: ["research-auth", "setup-database"],
    blockedBy: [],
    status: "ready"
  }),
  namespace: "coordination"
})

// Check dependencies before starting
const checkDependencies = async (taskKey) => {
  const task = await mcp__claude-flow_alpha__memory_usage({
    action: "retrieve",
    key: `task/${taskKey}/dependencies`,
    namespace: "coordination"
  })

  const deps = JSON.parse(task.value)
  return deps.blockedBy.length === 0
}
```

### Pattern: Shared Configuration

```javascript
// Store shared config once
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "config/api-endpoints",
  value: JSON.stringify({
    baseUrl: "https://api.example.com",
    auth: "/auth/login",
    users: "/users",
    posts: "/posts"
  }),
  namespace: "coordination"
})

// All agents use same config
const getApiConfig = async () => {
  const config = await mcp__claude-flow_alpha__memory_usage({
    action: "retrieve",
    key: "config/api-endpoints",
    namespace: "coordination"
  })
  return JSON.parse(config.value)
}
```

---

## Memory vs Hooks

**Memory (MCP Tools)**:
- ✅ Cross-agent communication
- ✅ Persistent storage across sessions
- ✅ Query and search capabilities
- ✅ Structured data with namespaces
- ⚠️ Requires explicit MCP tool calls

**Hooks (CLI Commands)**:
- ✅ Automatic lifecycle events
- ✅ Pre/post operation triggers
- ✅ Session snapshots and backups
- ✅ Metrics and audit trails
- ⚠️ No memory storage operations

**Key Distinction**: Memory = data storage, Hooks = event triggers

---

## Troubleshooting

### Issue: Cannot Retrieve Data

```javascript
// ❌ WRONG: Different namespace
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "mykey",
  namespace: "coordination"
})

const result = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "mykey",
  namespace: "default"  // Wrong namespace!
})
// result.value = null
```

```javascript
// ✅ CORRECT: Same namespace
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "mykey",
  namespace: "coordination"
})

const result = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "mykey",
  namespace: "coordination"  // Correct namespace
})
// result.value = stored data
```

### Issue: Key Naming Collisions

```javascript
// ❌ WRONG: Generic key name
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "status",  // Too generic, will collide
  value: "complete"
})
```

```javascript
// ✅ CORRECT: Specific hierarchical key
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "swarm/researcher/task-123/status",  // Unique path
  value: "complete"
})
```

### Issue: JSON Serialization

```javascript
// ❌ WRONG: Storing object directly
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "data",
  value: { foo: "bar" }  // Will be converted to "[object Object]"
})
```

```javascript
// ✅ CORRECT: JSON.stringify objects
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "data",
  value: JSON.stringify({ foo: "bar" })  // Proper serialization
})

const result = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "data"
})
const data = JSON.parse(result.value)  // Proper deserialization
```

---

## Integration with Hooks

**Hooks fire automatically, Memory is called explicitly**:

```javascript
// 1. Pre-task hook fires (automatic via .claude/settings.json)
// npx claude-flow@alpha hooks pre-task --description "Build API"

// 2. Agent stores context in memory (explicit MCP call)
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "task/build-api/context",
  value: JSON.stringify({ framework: "Express", auth: "JWT" }),
  namespace: "coordination"
})

// 3. Post-task hook fires (automatic)
// npx claude-flow@alpha hooks post-task --task-id "task-123"

// 4. Next agent retrieves context (explicit MCP call)
const context = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "task/build-api/context",
  namespace: "coordination"
})
```

**Hooks create audit trail, Memory stores working data**:
- Hooks → When events happen (pre-edit, post-task, session-end)
- Memory → What agents decided (architecture, status, results)

---

## Summary

**Memory Coordination is**:
- MCP tool-based (NOT hook-based)
- Persistent across sessions (`.swarm/memory.db`)
- Namespace-organized
- Key-value storage with TTL support
- Essential for cross-agent communication

**Common Operations**:
1. Store decisions: `action: "store"`
2. Retrieve context: `action: "retrieve"`
3. List all keys: `action: "list"`
4. Search patterns: `action: "search"`
5. Cleanup: `action: "delete"`

**Best Practices**:
- Use hierarchical keys: `namespace/agent/task/step`
- Always use namespaces (avoid "default")
- JSON.stringify complex objects
- Set TTL for temporary data
- Search for related entries with patterns

**Integration**:
- Hooks = automatic event triggers
- Memory = explicit data storage
- Use both for complete coordination

---

**Status**: ✅ All MCP tool signatures verified and tested
**Location**: `.swarm/memory.db`
**Table**: `memory_entries` (main storage table)
**Size**: 115MB+ (real production usage)
**Evidence**: 31+ session backups, cross-session persistence verified

**Technical Note**: If you need to query the database directly (e.g., for debugging), use:
```bash
sqlite3 .swarm/memory.db "SELECT key, namespace FROM memory_entries ORDER BY created_at DESC LIMIT 10;"
```
The table name is `memory_entries`, not "memory".
