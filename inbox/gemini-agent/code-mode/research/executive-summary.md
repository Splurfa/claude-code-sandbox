# Executive Summary: Code-Mode Integration for Claude-Flow

## Overview
This research package analyzes the feasibility and path for integrating "Code Mode" (execution-based tool use) into the `claude-flow` architecture. The goal is to move from chatty, sequential tool calls to efficient, batched script execution for swarm coordination.

## Key Findings

1.  **Architectural Alignment**: `claude-flow` is uniquely positioned for this upgrade. Its existing split between **MCP (Coordination)** and **Claude Code (Execution)** maps perfectly to the Code Mode paradigm.
2.  **The Missing Link**: We lack a "bridge" that allows the Execution layer to script the Coordination layer. Currently, agents must call MCP tools one by one via the chat interface.
3.  **Recommended Solution**: Implement a **"Spec File" Workflow (Path C)**.
    *   **Step 1**: Agent writes a TypeScript plan to `sessions/.../artifacts/plan.ts`.
    *   **Step 2**: Agent calls a new tool `execute_plan({ path: "..." })`.
    *   **Step 3**: System executes the plan using a generated SDK that wraps the MCP tools.

## Roadmap

### Phase 1: The Adapter (Prototype)
*   **Goal**: Generate a `claude-flow.d.ts` file from current MCP definitions.
*   **Output**: A TypeScript definition file that agents can reference.

### Phase 2: The Runner (Implementation)
*   **Goal**: Build the `execute_plan` MCP tool.
*   **Mechanism**: A Node.js `vm` wrapper that loads the plan, injects the MCP proxies, and executes safely within the session scope.

### Phase 3: The Rollout (Adoption)
*   **Goal**: Update the `Task()` prompt to encourage writing plans instead of calling tools directly.
*   **Metric**: Reduction in total messages per complex task.

## Directory of Research

*   [Phase 1: Code Mode Overview](./phase1-code-mode-overview.md) - Theory and background.
*   [Phase 2: Claude-Flow Analysis](./phase2-claude-flow-architecture.md) - Current system state.
*   [Phase 3: Integration Analysis](./phase3-integration-analysis.md) - Detailed technical proposal.
*   [Phase 4: Verification](./phase4-verification.md) - Sources and confidence checks.

