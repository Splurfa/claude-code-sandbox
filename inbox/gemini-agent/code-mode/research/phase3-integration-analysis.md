# Phase 3: First-Principles Integration Analysis

## 1. The Integration Challenge

The goal is to enable `claude-flow` agents to "write code to coordinate" rather than "call tools to coordinate."

**Current Flow:**
1.  Model thinks: "I need a mesh topology."
2.  Model calls tool: `mcp__claude-flow__swarm_init({ topology: "mesh" })`.
3.  System responds: "Swarm initialized."
4.  Model thinks: "Now I need 3 coders."
5.  Model calls tool: `mcp__claude-flow__agent_spawn({ type: "coder", count: 3 })`.

**Target Code Mode Flow:**
1.  Model thinks: "I need to set up the swarm."
2.  Model writes code:
    ```typescript
    import { swarm } from '@claude-flow/sdk';

    await swarm.init({ topology: "mesh" });
    await swarm.spawn({ type: "coder", count: 3 });
    ```
3.  System executes code -> Returns success.

## 2. Proposed Architecture: The "Code Mode Adapter"

To achieve this without rewriting the entire `claude-flow` codebase, we propose a **Schema-to-SDK Adapter**.

### 2.1 Component: The SDK Generator
We need a utility that:
1.  Connects to the running MCP server.
2.  Fetches the `tools/list` (JSON Schemas).
3.  Generates a TypeScript Declaration file (`d.ts`) and a runtime shim.
4.  Injects this into the agent's context (or sandbox).

**Draft Interface (`claude-flow.d.ts`):**
```typescript
export namespace swarm {
    function init(params: { topology: "mesh" | "star" | "hierarchical" }): Promise<void>;
    function status(): Promise<SwarmStatus>;
}
export namespace agents {
    function spawn(params: { type: AgentType, count: number }): Promise<string[]>;
}
```

### 2.2 Component: The Execution Harness
When the model provides the script, we need a runner.
Since `claude-flow` uses "Claude Code" (which likely runs locally on the user's machine in this context), the "sandbox" is effectively the local Node.js environment, scoped by the `claude-flow` wrapper.

We can introduce a new MCP tool: `run_coordination_script`.
*   **Input**: TypeScript code string.
*   **Behavior**:
    1.  Transpiles TS to JS (using `esbuild` or `ts-node`).
    2.  Executes in a VM context (using `vm` module or a dedicated sandbox library) that has the "SDK Shim" loaded.
    3.  The SDK Shim proxies calls back to the internal MCP handlers.

## 3. Compatibility & Friction

### 3.1 The "One Message" Rule
`claude-flow` emphasizes "1 Message = All Related Operations".
*   **Code Mode Alignment**: This is a **perfect match**. Code Mode allows bundling infinite logic into one script execution. It reinforces the existing philosophy.

### 3.2 Session Artifacts
Code Mode scripts might fetch data or generate reports.
*   **Constraint**: Scripts must honor the `sessions/$SESSION_ID/artifacts/` path rule.
*   **Solution**: The SDK Shim should auto-inject the current Session ID or provide a `Session.getPath()` helper to ensure file operations land in the right place.

### 3.3 Security
*   **Risk**: Arbitrary code execution.
*   **Mitigation**: The execution harness must be strict. It should only allow:
    *   Importing the `@claude-flow/sdk`.
    *   Standard JS logic.
    *   File I/O *only* within the session directory (enforced by the shim or a filesystem jail).

## 4. Integration Pathways

### Path A: The "Wrapper" Tool (Low Risk)
Create a single new MCP tool `execute_swarm_script` that takes a script body.
*   **Pros**: No changes to existing tools.
*   **Cons**: Model has to write code inside a JSON string (string escaping hell).

### Path B: The Native Integration (High Reward)
Modify `claude-flow` to expose a "REPL" or "Notebook" interface where the model sends code blocks directly, and the system intercepts and runs them.
*   **Pros**: Natural coding experience.
*   **Cons**: Requires deeper integration with the chat interface/client.

### Path C: The "Spec File" Approach (Balanced)
Model writes a `.ts` file to the session artifacts (e.g., `sessions/.../plan.ts`) using standard `Write` tools, then calls `run_script({ path: "..." })`.
*   **Pros**: Uses existing file editing capabilities; easy to debug; persistent record of the plan.
*   **Cons**: Two steps (Write + Run).

## 5. Recommendation
**Path C (Spec File)** is the most robust starting point.
1.  It leverages `claude-flow`'s strength (file artifacts).
2.  It creates a paper trail of the "Code Mode" logic.
3.  It avoids complex string escaping in JSON.
4.  It fits the "Write Plan -> Execute Plan" mental model.

