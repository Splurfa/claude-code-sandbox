## Post-Integration Reality (100/100 Certified)

**🎯 PRIMARY METHOD: Use Claude Code's Task Tool**

The hive-mind has been tested and certified at 100/100 integration score. The **correct** way to spawn agents is using Claude Code's Task tool:

```javascript
// ✅ CORRECT: Task tool does actual work (3-5x faster via parallelization)
[Single Message - Parallel Agent Execution]:
  Task("Strategic Queen", "Long-term planning and architecture decisions. Coordinate with tactical queen.", "system-architect")
  Task("Tactical Queen", "Fast execution and implementation. Report to strategic queen.", "coder")
  Task("Adaptive Queen", "Complexity assessment and optimization. Adjust strategy dynamically.", "code-analyzer")
  Task("Backend Worker", "Implement REST API with authentication. Save to sessions/$SESSION_ID/artifacts/code/.", "backend-dev")
  Task("Frontend Worker", "Build React UI components. Save to sessions/$SESSION_ID/artifacts/code/.", "coder")
  Task("Test Worker", "Write comprehensive test suite to sessions/$SESSION_ID/artifacts/tests/.", "tester")
```

**🔧 MCP COORDINATION (Optional Setup)**

MCP tools are ONLY for topology setup and coordination planning:

```javascript
// Optional: Setup coordination topology
mcp__claude-flow_alpha__swarm_init({ topology: "hierarchical", maxAgents: 8 })

// Optional: Define agent types for coordination
mcp__claude-flow_alpha__agent_spawn({ type: "system-architect", name: "Strategic Queen" })
```

**⚡ KEY INSIGHTS**

1. **Task tool = Execution**: Real agents doing real work
2. **MCP tools = Coordination**: Optional setup and planning
3. **Hooks = Auto-coordination**: Agents report progress via hooks
4. **Memory = State sharing**: Cross-agent communication via memory

**📊 PERFORMANCE**

- Task tool: 3-5x faster (parallel execution)
- MCP + CLI: Sequential, slower
- Best practice: Task tool for 99% of work

**🎯 WHEN TO USE WHAT**

| Need | Use This | Not This |
|------|----------|----------|
| Spawn agents to do work | Task tool | MCP spawn + CLI |
| Complex topology | MCP swarm_init (optional) | Manual coordination |
| Agent coordination | Hooks + Memory | Manual messaging |
| Quick single task | Task tool directly | Any MCP tools |

**Example: Full-Stack Development**

```javascript
[Single Message]:
  // Optional MCP setup
  mcp__claude-flow_alpha__swarm_init({ topology: "hierarchical", maxAgents: 10 })

  // Actual work via Task tool
  Task("Strategic Queen", "Orchestrate full-stack development. Define architecture.", "system-architect")
  Task("Backend Developer", "Build Express API. Save to sessions/$SESSION_ID/artifacts/code/backend/.", "backend-dev")
  Task("Frontend Developer", "Build React UI. Save to sessions/$SESSION_ID/artifacts/code/frontend/.", "coder")
  Task("Database Architect", "Design PostgreSQL schema. Save to sessions/$SESSION_ID/artifacts/code/db/.", "code-analyzer")
  Task("Test Engineer", "Create Jest tests to sessions/$SESSION_ID/artifacts/tests/.", "tester")
  Task("DevOps Engineer", "Setup Docker and CI/CD to sessions/$SESSION_ID/artifacts/scripts/.", "cicd-engineer")
```

**Remember**: CLI commands are fallback/manual mode. Task tool is primary for all agent execution.
