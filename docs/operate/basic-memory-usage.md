# Basic Memory Usage

Memory is how agents coordinate. Think of it like a shared whiteboard that all agents can read and write to.

## What is Memory?

**Simple definition**: A SQLite database (`.swarm/memory.db`) that stores key-value pairs with namespaces.

**Why it matters**: Without memory, agents can't coordinate. They'd be working in silos.

## The Memory Database

### Location
```
.swarm/memory.db
```

This is a SQLite database. You don't edit it directly - you use MCP tools to interact with it.

### Structure

Each memory entry has:
- **Key**: Unique identifier (e.g., "swarm/researcher/findings")
- **Value**: The data (JSON string usually)
- **Namespace**: Organization bucket (e.g., "coordination", "default")
- **TTL**: Time-to-live (optional expiration)

## Basic Memory Operations

### 1. Storing Data

**MCP Tool**: `mcp__claude_flow_alpha__memory_usage`

**Example**: Store research findings

```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "swarm/researcher/api-patterns",
  value: JSON.stringify({
    pattern: "REST",
    conventions: ["use plural nouns", "version APIs", "use HTTP verbs correctly"],
    examples: ["GET /users", "POST /users", "PUT /users/:id"]
  }),
  namespace: "coordination"
})
```

**What this does**: Saves data that other agents can retrieve.

### 2. Retrieving Data

**Example**: Get research findings

```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "retrieve",
  key: "swarm/researcher/api-patterns",
  namespace: "coordination"
})
```

**Returns**:
```json
{
  "pattern": "REST",
  "conventions": ["use plural nouns", "version APIs", "use HTTP verbs correctly"],
  "examples": ["GET /users", "POST /users", "PUT /users/:id"]
}
```

### 3. Listing Entries

**Example**: See all coordination memory

```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "list",
  namespace: "coordination"
})
```

**Returns**:
```json
[
  "swarm/researcher/api-patterns",
  "swarm/coder/implementation-status",
  "swarm/tester/test-results",
  "swarm/shared/api-contract"
]
```

### 4. Searching with Patterns

**Example**: Find all researcher entries

```javascript
mcp__claude_flow_alpha__memory_search({
  pattern: "swarm/researcher/%",
  namespace: "coordination",
  limit: 10
})
```

**Returns**: All keys matching the pattern (SQL LIKE syntax).

### 5. Deleting Data

**Example**: Remove old test results

```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "delete",
  key: "swarm/tester/test-results",
  namespace: "coordination"
})
```

## Namespaces: Organizing Memory

Think of namespaces like folders for organizing data.

### Standard Namespaces

**`default`**: General purpose storage
```javascript
key: "user-preference"
value: "dark-mode"
namespace: "default"
```

**`coordination`**: Agent coordination and status
```javascript
key: "swarm/agents/active-count"
value: "5"
namespace: "coordination"
```

**`reasoning-bank`**: Learning patterns (custom extension)
```javascript
key: "pattern/byzantine-consensus"
value: "{trajectory data...}"
namespace: "reasoning-bank"
```

**`captains-log`**: Journal entries (custom extension)
```javascript
key: "journal/2025-11-17/hive-mind-integration"
value: "Byzantine consensus integrated successfully..."
namespace: "captains-log"
```

### Why Namespaces Matter

**Without namespaces**:
```
api-contract (which project?)
test-results (which test?)
status (status of what?)
```

**With namespaces**:
```
coordination:swarm/shared/api-contract
coordination:swarm/tester/test-results
coordination:swarm/coordinator/status
```

Much clearer!

## Real Example: Agent Coordination

Let's trace how agents coordinated in the hive-mind integration session.

### Step 1: Research Agent Stores Findings

```javascript
// Research agent completes analysis
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "swarm/researcher/consensus-mechanisms",
  value: JSON.stringify({
    recommended: "Byzantine",
    reasons: ["fault-tolerant", "handles malicious actors", "proven in distributed systems"],
    implementation: "BFT algorithm with 3f+1 nodes"
  }),
  namespace: "coordination"
})
```

### Step 2: Coder Agent Retrieves Findings

```javascript
// Coder agent starts work
const research = await mcp__claude_flow_alpha__memory_usage({
  action: "retrieve",
  key: "swarm/researcher/consensus-mechanisms",
  namespace: "coordination"
})

// Coder now knows: use Byzantine consensus, BFT algorithm, 3f+1 nodes
```

### Step 3: Coder Stores API Contract

```javascript
// Coder agent completes implementation
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "swarm/shared/api-contract",
  value: JSON.stringify({
    function: "initializeConsensus",
    params: ["nodeCount", "faultTolerance"],
    returns: "ConsensusManager"
  }),
  namespace: "coordination"
})
```

### Step 4: Tester Agent Retrieves Contract

```javascript
// Tester agent creates tests
const apiContract = await mcp__claude_flow_alpha__memory_usage({
  action: "retrieve",
  key: "swarm/shared/api-contract",
  namespace: "coordination"
})

// Tester now knows: test initializeConsensus() with those params
```

### Step 5: Coordinator Tracks Progress

```javascript
// Coordinator monitors swarm
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "swarm/coordination/progress",
  value: JSON.stringify({
    research: "complete",
    coding: "complete",
    testing: "in-progress",
    review: "pending"
  }),
  namespace: "coordination"
})
```

**Result**: All agents coordinated without blocking each other. Parallel execution with shared knowledge.

## Memory Patterns

### Pattern 1: Shared API Contracts

**Use case**: Backend and frontend need to agree on API shape

```javascript
// Backend stores contract
key: "swarm/shared/user-api"
value: {
  endpoint: "POST /users",
  body: { "email": "string", "password": "string" },
  response: { "id": "number", "email": "string", "token": "string" }
}

// Frontend retrieves and uses it
```

### Pattern 2: Progressive Results

**Use case**: Long-running research that updates incrementally

```javascript
// Researcher stores partial findings
key: "swarm/researcher/security-analysis"
value: { findings: ["XSS vulnerability in input", "CSRF protection missing"] }

// Later, researcher updates
value: { findings: [..., "SQL injection possible in search"] }
```

### Pattern 3: Agent Status Tracking

**Use case**: Coordinator monitors swarm health

```javascript
// Each agent reports status
key: "swarm/coder/status"
value: { state: "working", progress: 75, eta: "2 min" }

key: "swarm/tester/status"
value: { state: "blocked", waiting_for: "swarm/coder/api-contract" }

// Coordinator can see who's blocked and why
```

## Time-To-Live (TTL)

Memory entries can auto-expire:

```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "swarm/temporary/build-cache",
  value: "...",
  namespace: "coordination",
  ttl: 3600  // Expires in 1 hour (3600 seconds)
})
```

**Use cases**:
- Temporary coordination data
- Session-specific caches
- Time-limited tokens

## You'll Know You Understand When...

✅ You can store and retrieve data from memory
✅ You understand what namespaces are for
✅ You can trace how agents coordinate through memory
✅ You know when to use TTL

## Try This Exercise

**Build a multi-agent memory coordination**:

1. Start a new session: `/session-start memory-practice`
2. Spawn a researcher to analyze a topic and store findings in memory
3. Spawn a coder to retrieve the findings and implement something based on them
4. Spawn a tester to retrieve the coder's API contract and write tests
5. List all memory entries in the coordination namespace
6. Close the session

**Success criteria**:
- Each agent reads from memory what the previous agent wrote
- You can list all coordination entries
- Session closes with all memory preserved in backup

## Hands-On Practice

Tell Claude Code:

```
Create a simple memory coordination example where:
1. Agent A stores a user schema in memory
2. Agent B retrieves it and creates validation logic
3. Agent C retrieves the schema and creates tests
Show me the memory operations explicitly.
```

## Common Mistakes

**❌ Storing non-JSON values**
```javascript
value: "just a string"  // Hard to parse later
```

**✅ Always use JSON**
```javascript
value: JSON.stringify({ message: "just a string" })
```

**❌ Not using namespaces**
```javascript
key: "results"  // Conflicts with other "results"
```

**✅ Use namespaced keys**
```javascript
key: "swarm/tester/results",
namespace: "coordination"
```

**❌ Forgetting to retrieve before using**
```javascript
// Agent B assumes Agent A's data structure without checking
```

**✅ Always retrieve and validate**
```javascript
const data = await retrieve("swarm/agentA/data")
if (!data.expectedField) throw new Error("Invalid data from Agent A")
```

## Advanced Preview (Phase 2: Essential Skills)

In the next phase you'll learn:
- Memory versioning (handling conflicts)
- Cross-session memory (learning patterns)
- Memory compression (large datasets)
- Memory synchronization (distributed swarms)

## Next Step

Congratulations! You've completed Phase 1: Foundations foundations. You now understand:
- What claude-flow is ✅
- Workspace structure ✅
- Session lifecycle ✅
- Memory coordination ✅

→ **Next**: [Phase 2: Essential Skills: Essential Skills](../02-essential-skills/README.md)

---

**Phase 1: Foundations Checkpoint**: Before moving on, make sure you can:
1. Start and close a session
2. Spawn agents and find their artifacts
3. Store and retrieve data from memory
4. Explain why memory enables parallel coordination

If any of these feel unclear, revisit the relevant foundation guide.
