# Code Mode Developer Guide

## Introduction

**Code Mode** changes how you interact with the `claude-flow` system. Instead of making individual, sequential tool calls (which is slow and token-expensive), you write a **Plan**—a single TypeScript script that orchestrates the entire workflow—and execute it in one go.

## The Workflow

### Old Way (Tool Mode)
1.  Think: "I need to check the swarm status."
2.  Tool Call: `swarm_status()`
3.  Wait for response...
4.  Think: "Okay, now I need to spawn a coder."
5.  Tool Call: `agent_spawn({ type: "coder" })`
6.  Wait for response...

### New Way (Code Mode)
1.  Think: "I need to check status and spawn a coder if needed."
2.  **Write Plan** (`sessions/.../plan.ts`):
    ```typescript
    // Import is implied/injected globally as 'sdk' or 'tools'
    
    const status = await tools.swarm_status();
    if (status.activeAgents < 5) {
      console.log("Scaling up swarm...");
      await tools.agent_spawn({ type: "coder", count: 1 });
    } else {
      console.log("Swarm is sufficient.");
    }
    ```
3.  **Execute Plan**:
    Tool Call: `execute_plan({ planPath: "sessions/.../plan.ts" })`

## Writing Plans

### 1. The SDK
You have access to a global object `tools` (or `sdk`) that mirrors the MCP tools available in the system.
Refer to `claude-flow.d.ts` for the exact signatures.

### 2. Path Rules
*   Always save your plan files to the current session's artifacts directory: `sessions/$SESSION_ID/artifacts/scripts/`.
*   You cannot read/write files outside the session directory.

### 3. Best Practices
*   **Batch Logic**: Use loops and conditionals! If you need to create 10 files, write a `for` loop in your plan rather than calling `write_file` 10 times in chat.
*   **Log Generously**: Use `console.log`. All logs are returned in the tool result, so you can debug what happened.
*   **Error Handling**: Wrap critical steps in `try/catch` blocks so your plan fails gracefully.

## Example: Full Coordination

```typescript
/**
 * Plan: Initialize Swarm and Assign Tasks
 */

// 1. Init
console.log("Initializing Mesh Topology...");
await tools.swarm_init({ topology: "mesh" });

// 2. Spawn Agents
const agents = ["coder", "tester", "reviewer"];
for (const type of agents) {
    console.log(`Spawning ${type}...`);
    await tools.agent_spawn({ type, count: 1 });
}

// 3. Verify
const status = await tools.swarm_status();
console.log("Final Status:", status);
```

