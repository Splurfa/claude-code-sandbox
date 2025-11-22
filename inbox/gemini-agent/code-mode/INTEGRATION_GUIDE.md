# Code Mode Integration Guide

This guide outlines the steps to integrate the Code Mode "Spec File" workflow into your existing `claude-flow` or Node.js-based MCP server.

## 1. Overview of Artifacts

The `artifacts/` directory contains three key components:

1.  `sdk-gen.ts`: A standalone script to generate the `claude-flow.d.ts` SDK for agents.
2.  `runtime.ts`: The sandboxed execution engine.
3.  `tool-wrapper.ts`: The MCP tool definition class (`execute_plan`).

**Reference Diagrams:**
*   [System Architecture](diagrams/02-system-architecture.mermaid)
*   [Integration Workflow](diagrams/03-integration-path.mermaid)
*   [Component Classes](diagrams/04-component-class.mermaid)

## 2. Installation Steps

### Step 1: Copy Files
Copy the artifacts to your project's source tree (e.g., `src/code-mode/`):
```bash
cp inbox/gemini-agent/code-mode/artifacts/*.ts src/code-mode/
```

### Step 2: Dependencies
Ensure your `package.json` has the required types. Code Mode uses standard Node.js APIs (`vm`, `fs`, `path`), so no heavy dependencies are needed.
*   (Optional) `typescript` and `ts-node` for running the generator.

### Step 3: Register the Tool
In your main MCP server entry point (where you define your tools), import and register the `execute_plan` tool.

**Example Integration:**

```typescript
import { CodeModeManager } from './code-mode/tool-wrapper';

// ... inside your MCP Server class or setup function ...

// 1. Initialize the Manager
// You must provide a 'toolCaller' function that allows the manager to invoke 
// other tools in your system (Loopback).
const codeMode = new CodeModeManager(
  process.cwd(), // Workspace root
  async (toolName, args) => {
    // IMPLEMENTATION REQUIRED:
    // Call your internal tool handler here.
    // Example: return this.callTool(toolName, args);
    return await myInternalToolRegistry.execute(toolName, args);
  }
);

// 2. Add to Tool Definitions
const codeModeTool = codeMode.getToolDefinition();
myToolList.push(codeModeTool);

// 3. Add to Request Handler
if (request.method === 'tools/call' && request.params.name === 'execute_plan') {
  return await codeMode.handleToolCall(request.params.arguments);
}
```

### Step 4: Generate the SDK
Once the server is running with the new tool registered (or even before, if you just want the base tools), generate the SDK file that agents will use.

```bash
# Run the generator against your running MCP server
npx ts-node src/code-mode/sdk-gen.ts "npx claude-flow" ./claude-flow.d.ts
```

### Step 5: Distribute the SDK
Place the generated `claude-flow.d.ts` in a location where the agents know to look (e.g., the root of the workspace or a dedicated `types/` folder), or instruct the agent to read it into context.

## 3. Verification

1.  **Start your MCP Server**.
2.  **Create a test plan**:
    ```typescript
    // sessions/test-session/artifacts/plan.ts
    // (Make sure this path exists!)
    await sdk.swarm_init({ topology: "mesh" });
    console.log("Swarm initialized via Code Mode!");
    ```
3.  **Call the tool**:
    Send an MCP request: `call_tool("execute_plan", { planPath: "sessions/test-session/artifacts/plan.ts" })`
4.  **Check Output**:
    You should see the log message and the actual tool execution in your server logs.

## 4. Security Notes
*   The runtime uses Node's `vm` module. While better than `eval`, it is **not a complete security boundary** against malicious actors with access to the host process memory.
*   The `CodeModeManager` enforces path traversal checks to ensure scripts only run from `sessions/.../artifacts/`. Do not disable this check.

