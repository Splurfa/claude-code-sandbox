# Hive-Mind MCP Tools Reference

**Document Type**: Comprehensive MCP Tool Reference  
**Date**: 2025-11-17  
**Session**: session-20251117-002737-hive-mind-100-integration  
**Readiness Level**: 100/100

---

## Overview

This reference documents all MCP (Model Context Protocol) tools used by the hive-mind system for swarm coordination, memory management, neural training, and automation.

**MCP Servers Used**:
- **claude-flow**: Core swarm coordination (primary)
- **ruv-swarm**: Enhanced coordination features (optional)
- **flow-nexus**: Cloud-based orchestration (optional)

---

## Core Coordination Tools

### `mcp__claude-flow_alpha__swarm_init`

**Purpose**: Initialize swarm with topology and configuration

**Parameters**:
```javascript
{
  topology: "hierarchical" | "mesh" | "ring" | "star",  // required
  maxAgents: number,          // default: 8
  strategy: "auto" | "balanced" | "specialized" | "adaptive"  // default: "auto"
}
```

**Example**:
```javascript
await mcp__claude-flow_alpha__swarm_init({
  topology: "hierarchical",
  maxAgents: 12,
  strategy: "adaptive"
});
```

**Returns**:
```javascript
{
  swarmId: "swarm-20251117-001234",
  topology: "hierarchical",
  status: "initialized",
  agents: []
}
```

---

### `mcp__claude-flow_alpha__agent_spawn`

**Purpose**: Create specialized AI agent in swarm

**Parameters**:
```javascript
{
  type: "coordinator" | "analyst" | "optimizer" | "researcher" | "coder" | "tester" | "reviewer",  // required
  name: string,               // optional custom identifier
  capabilities: string[],     // optional specific capabilities
  swarmId: string            // optional (uses active swarm if not provided)
}
```

**Example**:
```javascript
await mcp__claude-flow_alpha__agent_spawn({
  type: "researcher",
  name: "API Pattern Researcher",
  capabilities: ["research", "analysis", "trend-identification"],
  swarmId: "swarm-20251117-001234"
});
```

**Returns**:
```javascript
{
  agentId: "agent-researcher-001",
  type: "researcher",
  status: "active",
  spawnedAt: 1700183456789
}
```

---

### `mcp__claude-flow_alpha__task_orchestrate`

**Purpose**: Orchestrate complex task workflow across swarm

**Parameters**:
```javascript
{
  task: string,               // required: task description
  strategy: "parallel" | "sequential" | "adaptive" | "balanced",  // default: "adaptive"
  priority: "low" | "medium" | "high" | "critical",  // default: "medium"
  dependencies: string[],     // optional task IDs
  maxAgents: number          // optional max agents to use (default: 10)
}
```

**Example**:
```javascript
await mcp__claude-flow_alpha__task_orchestrate({
  task: "Build REST API with authentication, testing, and documentation",
  strategy: "adaptive",
  priority: "high",
  maxAgents: 8
});
```

**Returns**:
```javascript
{
  taskId: "task-001",
  status: "orchestrating",
  assignedAgents: ["agent-researcher-001", "agent-coder-002", "agent-tester-003"],
  estimatedDuration: 7200000  // milliseconds
}
```

---

## Memory Management Tools

### `mcp__claude-flow_alpha__memory_usage`

**Purpose**: Store, retrieve, search, and manage persistent memory

**Actions**: `store`, `retrieve`, `list`, `delete`, `search`

#### Store Action

**Parameters**:
```javascript
{
  action: "store",
  key: string,                // required
  value: string,              // required (JSON.stringify for objects)
  namespace: string,          // default: "default"
  ttl: number                 // optional: time-to-live in milliseconds
}
```

**Example**:
```javascript
await mcp__claude-flow_alpha__memory_usage({
  action: "store",
  namespace: "coordination",
  key: "swarm/swarm-123/state",
  value: JSON.stringify({ phase: 1, completedTasks: 5 }),
  ttl: 3600000  // 1 hour
});
```

---

#### Retrieve Action

**Parameters**:
```javascript
{
  action: "retrieve",
  key: string,                // required
  namespace: string           // default: "default"
}
```

**Example**:
```javascript
const result = await mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  namespace: "coordination",
  key: "swarm/swarm-123/state"
});

// Returns: { phase: 1, completedTasks: 5 }
```

---

#### Search Action

**Parameters**:
```javascript
{
  action: "search",
  pattern: string,            // required: SQL LIKE pattern (e.g., "swarm/%")
  namespace: string,          // default: "default"
  limit: number              // optional: max results
}
```

**Example**:
```javascript
const results = await mcp__claude-flow_alpha__memory_usage({
  action: "search",
  namespace: "coordination",
  pattern: "swarm/%/state"
});

// Returns: [{ key: "swarm/swarm-123/state", value: "..." }, ...]
```

---

#### List Action

**Parameters**:
```javascript
{
  action: "list",
  namespace: string           // default: "default"
}
```

**Example**:
```javascript
const entries = await mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "coordination"
});

// Returns: [{ key: "...", value: "...", createdAt: 123456 }, ...]
```

---

#### Delete Action

**Parameters**:
```javascript
{
  action: "delete",
  key: string,                // required: specific key to delete
  namespace: string           // default: "default"
}
```

**Example**:
```javascript
await mcp__claude-flow_alpha__memory_usage({
  action: "delete",
  namespace: "coordination",
  key: "swarm/swarm-123/state"
});
```

---

## Monitoring & Status Tools

### `mcp__claude-flow_alpha__swarm_status`

**Purpose**: Get current swarm status and agent information

**Parameters**:
```javascript
{
  swarmId: string             // optional (uses active swarm if not provided)
}
```

**Example**:
```javascript
const status = await mcp__claude-flow_alpha__swarm_status({
  swarmId: "swarm-20251117-001234"
});
```

**Returns**:
```javascript
{
  swarmId: "swarm-20251117-001234",
  topology: "hierarchical",
  queenType: "adaptive",
  agents: [
    { id: "agent-001", type: "researcher", status: "active", tasksCompleted: 5 },
    { id: "agent-002", type: "coder", status: "busy", currentTask: "task-123" }
  ],
  tasks: {
    total: 12,
    completed: 8,
    pending: 3,
    failed: 1
  },
  memory: {
    entriesCount: 156,
    sizeBytes: 163840000
  }
}
```

---

### `mcp__claude-flow_alpha__agent_metrics`

**Purpose**: Get performance metrics for agents

**Parameters**:
```javascript
{
  agentId: string             // optional (returns all agents if not provided)
}
```

**Example**:
```javascript
const metrics = await mcp__claude-flow_alpha__agent_metrics({
  agentId: "agent-researcher-001"
});
```

**Returns**:
```javascript
{
  agentId: "agent-researcher-001",
  type: "researcher",
  metrics: {
    tasksCompleted: 15,
    tasksF ailed: 2,
    avgTaskDuration: 450000,  // milliseconds
    successRate: 0.88,
    performanceScore: 85
  }
}
```

---

### `mcp__claude-flow_alpha__task_status`

**Purpose**: Check progress of running tasks

**Parameters**:
```javascript
{
  taskId: string              // optional (returns all tasks if not provided)
}
```

**Example**:
```javascript
const status = await mcp__claude-flow_alpha__task_status({
  taskId: "task-001"
});
```

**Returns**:
```javascript
{
  taskId: "task-001",
  status: "in-progress",
  progress: 65,  // percentage
  assignedAgent: "agent-coder-002",
  startedAt: 1700183456789,
  estimatedCompletion: 1700187056789
}
```

---

## Neural Intelligence Tools

### `mcp__claude-flow_alpha__neural_train`

**Purpose**: Train neural patterns with WASM SIMD acceleration

**Parameters**:
```javascript
{
  pattern_type: "coordination" | "optimization" | "prediction",  // required
  training_data: string,      // required: JSON data
  epochs: number              // default: 50
}
```

**Example**:
```javascript
await mcp__claude-flow_alpha__neural_train({
  pattern_type: "coordination",
  training_data: JSON.stringify({
    inputs: [/* coordination patterns */],
    outputs: [/* success metrics */]
  }),
  epochs: 100
});
```

**Returns**:
```javascript
{
  modelId: "model-coord-001",
  accuracy: 0.92,
  trainingDuration: 45000  // milliseconds
}
```

---

### `mcp__claude-flow_alpha__neural_patterns`

**Purpose**: Analyze cognitive patterns

**Parameters**:
```javascript
{
  action: "analyze" | "learn" | "predict",  // required
  operation: string,          // required for learn/predict
  outcome: string,            // required for learn
  metadata: object           // optional
}
```

**Example - Learn**:
```javascript
await mcp__claude-flow_alpha__neural_patterns({
  action: "learn",
  operation: "swarm_coordination",
  outcome: "success",
  metadata: {
    queenType: "adaptive",
    topology: "hierarchical",
    duration: 7200000,
    qualityScore: 92
  }
});
```

**Example - Predict**:
```javascript
const prediction = await mcp__claude-flow_alpha__neural_patterns({
  action: "predict",
  operation: "swarm_coordination",
  metadata: {
    taskComplexity: 75,
    agentCount: 8
  }
});

// Returns: { recommendedQueenType: "adaptive", confidence: 0.87 }
```

---

## Advanced Coordination Tools

### `mcp__claude-flow_alpha__agents_spawn_parallel`

**Purpose**: Spawn multiple agents in parallel (10-20x faster than sequential)

**Parameters**:
```javascript
{
  agents: [                   // required: array of agent configs
    {
      type: string,           // required
      name: string,           // required
      priority: "low" | "medium" | "high" | "critical",  // default: "medium"
      capabilities: string[]  // optional
    }
  ],
  maxConcurrency: number,     // default: 5
  batchSize: number           // default: 3
}
```

**Example**:
```javascript
await mcp__claude-flow_alpha__agents_spawn_parallel({
  agents: [
    { type: "researcher", name: "API Researcher", priority: "high" },
    { type: "architect", name: "System Architect", priority: "high" },
    { type: "coder", name: "Backend Developer", priority: "medium" },
    { type: "tester", name: "QA Engineer", priority: "medium" },
    { type: "reviewer", name: "Code Reviewer", priority: "low" }
  ],
  maxConcurrency: 5
});
```

**Returns**:
```javascript
{
  spawned: 5,
  duration: 3500,  // milliseconds
  speedup: 17.2,   // vs sequential
  agents: [
    { id: "agent-001", type: "researcher", status: "active" },
    // ...
  ]
}
```

---

## Automation Tools

### `mcp__claude-flow_alpha__workflow_create`

**Purpose**: Create custom workflows with event-driven processing

**Parameters**:
```javascript
{
  name: string,               // required
  steps: [                    // required
    {
      id: string,
      agent_type: string,
      task: string,
      dependencies: string[]
    }
  ],
  triggers: string[]          // optional: event triggers
}
```

**Example**:
```javascript
await mcp__claude-flow_alpha__workflow_create({
  name: "API Development Workflow",
  steps: [
    { id: "step-1", agent_type: "researcher", task: "Research API patterns", dependencies: [] },
    { id: "step-2", agent_type: "architect", task: "Design system architecture", dependencies: ["step-1"] },
    { id: "step-3", agent_type: "coder", task: "Implement REST endpoints", dependencies: ["step-2"] },
    { id: "step-4", agent_type: "tester", task: "Write integration tests", dependencies: ["step-3"] }
  ],
  triggers: ["on_commit", "on_pr_create"]
});
```

---

## Query Control Tools

### `mcp__claude-flow_alpha__query_control`

**Purpose**: Control running queries (pause, resume, terminate, change model)

**Parameters**:
```javascript
{
  action: "pause" | "resume" | "terminate" | "change_model" | "change_permissions" | "execute_command",  // required
  queryId: string,            // required
  model: string,              // required for change_model
  permissionMode: string,     // required for change_permissions
  command: string             // required for execute_command
}
```

**Example - Pause**:
```javascript
await mcp__claude-flow_alpha__query_control({
  action: "pause",
  queryId: "query-123"
});
```

**Example - Change Model**:
```javascript
await mcp__claude-flow_alpha__query_control({
  action: "change_model",
  queryId: "query-123",
  model: "claude-3-5-sonnet-20241022"  // Switch to more powerful model
});
```

---

## Best Practices

### 1. Memory Management

**DO**:
- Use namespaces to organize memory (`coordination`, `sessions`, `patterns`)
- Set TTL for temporary data (task states, intermediate results)
- Use pattern matching for efficient searches (`swarm/%/state`)
- Consolidate similar entries periodically

**DON'T**:
- Store large binary data in memory (use file system)
- Create unlimited keys without cleanup
- Use flat key structure (use namespaces instead)

---

### 2. Agent Spawning

**DO**:
- Use `agents_spawn_parallel` for 5+ agents (10-20x speedup)
- Set appropriate priorities (high/critical for blocking tasks)
- Specify capabilities to enable auto-assignment
- Monitor agent metrics to detect bottlenecks

**DON'T**:
- Spawn agents sequentially (slow)
- Exceed max_workers limit (resource waste)
- Spawn agents without checking existing capacity

---

### 3. Neural Training

**DO**:
- Record patterns from successful sessions
- Use adequate training data (100+ samples)
- Set reasonable epochs (50-100 for coordination patterns)
- Validate predictions with confidence thresholds

**DON'T**:
- Train on single session data (overfitting)
- Ignore confidence scores (false positives)
- Skip pattern validation

---

## Troubleshooting

### Issue: Memory store/retrieve not working

```javascript
// Check namespace exists
const entries = await mcp__claude-flow_alpha__memory_usage({
  action: "list",
  namespace: "coordination"
});

// Verify key format
await mcp__claude-flow_alpha__memory_usage({
  action: "store",
  namespace: "coordination",
  key: "swarm/test/key",  // Use forward slashes, not dots
  value: "test"
});
```

---

### Issue: Parallel spawning slower than expected

```javascript
// Check maxConcurrency setting
await mcp__claude-flow_alpha__agents_spawn_parallel({
  agents: [...],
  maxConcurrency: 10,  // Increase from default 5
  batchSize: 5         // Increase batch size
});

// Verify system resources (CPU/memory)
const metrics = await mcp__claude-flow_alpha__agent_metrics();
```

---

### Issue: Task orchestration hanging

```javascript
// Check task status
const status = await mcp__claude-flow_alpha__task_status({
  taskId: "task-001"
});

// Check agent status
const swarmStatus = await mcp__claude-flow_alpha__swarm_status();

// Terminate hanging task
await mcp__claude-flow_alpha__query_control({
  action: "terminate",
  queryId: status.queryId
});
```

---

## Summary

The MCP tools provide **comprehensive control** over hive-mind operations:

✅ **Coordination**: Initialize swarms, spawn agents, orchestrate tasks
✅ **Memory**: Persistent storage with TTL, search, and consolidation
✅ **Monitoring**: Real-time status, metrics, and progress tracking
✅ **Intelligence**: Neural training, pattern learning, predictions
✅ **Automation**: Workflows, parallel execution, query control

**Quick Reference**: See [Integration Guide](./integration-guide.md) for usage examples and patterns.

---

**Document Status**: Complete  
**Last Updated**: 2025-11-17  
**Version**: 1.0.0 (100/100 Readiness)
