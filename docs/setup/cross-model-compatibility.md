# Cross-Model Compatibility Guide

**Version**: 1.0
**Purpose**: How to use this workspace with LLMs other than Claude Code (e.g., GPT-4, Gemini, Local Models).

---

## Core Concept: The "Universal Agent" Protocol

This workspace is built on principles that are **model-agnostic**. While it was initialized with Claude Code, the underlying architecture uses standard patterns that any advanced LLM can follow.

### 1. The Task Tool -> Function Calling Mapping

Claude Code uses a `Task` tool to spawn agents. This is simply a structured function call.

**Claude Code Pattern**:
```javascript
Task("Agent Name", "Instructions...", "agent-type")
```

**Generic LLM Pattern (Function Calling)**:
```json
{
  "name": "spawn_agent",
  "arguments": {
    "name": "Agent Name",
    "instructions": "Instructions...",
    "type": "agent-type"
  }
}
```

**How to Adapt**:
- If using **OpenAI/Gemini**: Define a `spawn_agent` tool in your system prompt that matches the `Task` signature.
- If using **Local Models**: Use a structured prompt template (e.g., XML tags) to simulate tool calls: `<tool_code>spawn_agent(...)</tool_code>`.

### 2. MCP -> Universal Context

The **Model Context Protocol (MCP)** is an open standard, not a proprietary Anthropic tool.

- **What it does**: Provides a standard way to connect LLMs to data (memory, files, GitHub).
- **Compatibility**: Any MCP-compliant client (Cursor, Zed, generic MCP clients) can connect to the `.swarm/memory.db` via the `claude-flow` MCP server.

**Setup for Other Clients**:
1. Install the MCP server: `npm install -g claude-flow@alpha`
2. Configure your client to use the stdio transport: `npx claude-flow@alpha mcp start`

### 3. Hooks -> System Events

Hooks are just scripts that run when files change. They are not dependent on the LLM.

- **Claude Code**: Uses `.claude/settings.json` to trigger hooks on `Write`/`Edit`.
- **VS Code / Cursor**: Can use tasks or file watchers (e.g., `Run on Save` extension) to trigger the same scripts.

**Universal Hook Command**:
```bash
# Run this manually or via your IDE's watcher
npx claude-flow@alpha hooks post-edit --file "path/to/changed/file.js"
```

### 4. Session Artifacts -> Context Management

The `sessions/` directory structure is a **Context Management Strategy**.

- **Problem**: LLMs have limited context windows.
- **Solution**: Isolate high-volume work in `sessions/` and only promote high-value summaries to the root.

**Universal Rule**:
"Always create a new folder for a new conversation. Never dump files in the root."

### 5. Agent Personas -> System Prompts

The agents in `.claude/agents/` are just markdown files containing system prompts.

- **Adaptation**: Read the content of `.claude/agents/core/coder.md` and paste it as the system prompt for your generic LLM session.

---

## Feature Support Matrix

| Feature | Claude Code | Cursor/VS Code | Generic Terminal |
|---------|-------------|----------------|------------------|
| **Agent Spawning** | Native (`Task`) | Manual / MCP | Manual CLI |
| **Memory** | Native MCP | MCP Client | CLI Tools |
| **File Routing** | Enforced | Manual | Manual |
| **Hooks** | Auto-Fire | Extension | Manual |
| **SPARC** | Native | CLI (`npx`) | CLI (`npx`) |

## Migration Checklist

If you are switching to a different model driver:

1. [ ] **Install Node.js**: Ensure `npx` is available.
2. [ ] **Connect MCP**: Set up your client to talk to `claude-flow`.
3. [ ] **Adopt the Protocol**: Manually enforce the "One Session = One Chat" rule.
4. [ ] **Use the CLI**: Rely on `npx claude-flow` commands for coordination instead of native tool calls.

