# Phase 2: Claude-Flow Architecture Analysis

## 1. System Overview

`claude-flow` is a multi-agent orchestration platform designed to work within a Cursor/Claude environment. It strictly separates **coordination** (strategy) from **execution** (tactics).

### 1.1 The Core Split

*   **Coordination (MCP Layer)**:
    *   Tools like `swarm_init`, `agent_spawn`, `task_orchestrate`.
    *   **Purpose**: Define the shape of the team, the memory structure, and the high-level plan.
    *   **Execution**: Instant, cheap, metadata-only. Does *not* write code or modify project files directly.
    *   **Mechanism**: Standard MCP tool calls (JSON-RPC).

*   **Execution (Claude Code Layer)**:
    *   Tools like `Task()` (Claude Code's native tool), `Write`, `Bash`.
    *   **Purpose**: Do the actual work. Spawn agents that read/write files, run tests, and implement features.
    *   **Execution**: Expensive, time-consuming, capable of side effects.
    *   **Mechanism**: "Claude Code" native environment tools.

### 1.2 Directory Structure & Session Management

The system enforces a strict session-based workflow to maintain hygiene and context isolation.

*   **Root**: Contains configuration (`CLAUDE.md`, `package.json`) and the `claude-flow` engine.
*   **Sessions (`sessions/`)**:
    *   Each task/thread gets a unique ID: `session-YYYYMMDD-HHMMSS-<topic>`.
    *   **Artifacts**: All output goes to `sessions/<id>/artifacts/{code,docs,tests,scripts}`.
    *   **Rule**: "NEVER save working files to root."

### 1.3 The Hive-Mind

The architecture implements a "Queen-Worker" topology:
*   **Queens** (Strategic, Tactical, Adaptive): High-level decision makers.
*   **Workers**: Specialized agents (Coder, Reviewer, Tester).
*   **Consensus**: Mechanisms for voting on decisions (Majority, Weighted, Byzantine).

## 2. Current Tooling Implementation

### 2.1 MCP Integration
The workspace acts as an MCP server (or set of servers).
*   **Entry**: `npx claude-flow` or `npx claude-flow@alpha`.
*   **Discovery**: Tools are exposed via standard MCP discovery.
*   **Progressive Disclosure (Current)**: `claude-flow` already implements a form of this by using a "Task" tool that can dynamically instantiate agents, rather than overloading the context with every possible agent definition at once.

### 2.2 Hooks System
A critical component for state management.
*   **Pre-Task/Post-Task**: Track lifecycle.
*   **Pre-Edit/Post-Edit**: Track file modifications.
*   **Session-End**: Consolidate memory and backup.
*   **Invocation**: Currently CLI-based (`npx claude-flow hooks ...`) or auto-triggered by Claude Code settings.

## 3. Gap Analysis for Code Mode

| Feature | Current `claude-flow` | Required for Code Mode |
| :--- | :--- | :--- |
| **Tool Interface** | JSON Schema (MCP) | TypeScript/Python SDK (`.d.ts`) |
| **Logic handling** | Chat-turn dependent | Embedded in script |
| **Agent Spawning** | `Task("name", ...)` | `await agents.spawn("name", ...)` |
| **Output** | Direct file writes / Chat text | Return values / Objects |

## 4. Conclusion

`claude-flow` is well-structured for Code Mode adoption because it already treats "Tools" (MCP) and "Work" (Execution) separately. The challenge lies in bridging the gap: allowing the "Execution" layer (Claude Code) to script the "Coordination" layer (MCP) dynamically, rather than relying on the user or the model to make individual tool calls for every coordination step.

