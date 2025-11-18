# Essential Skills: Phase 2: Essential Skills

Welcome to Phase 2: Essential Skills! In this phase you'll move from single agents to coordinated teams working in parallel.

## What You'll Learn

By the end of this phase, you'll be able to:
- Spawn multiple agents in parallel using Claude Code's Task tool
- Coordinate agents through shared memory
- Understand the difference between Claude Code tools and MCP tools
- Manage sessions with proper file routing
- Build real features with multi-agent teams

## Time Commitment

**Total**: Essential skills phase completed at your own pace
- Lessons 1-2: Spawning Agents (1 hour)
- Phase 3: Parallel Execution (at your own pace)
- Phase 4-5: Memory Coordination (at your own pace)
- Lessons 6-7: Session Management (1 hour)

## Learning Order

**Follow this exact sequence:**

1. [Spawning Agents](spawning-agents.md) - Claude Code Task tool vs MCP tools
2. [Parallel Execution](parallel-execution.md) - The "one message" rule
3. [Memory Coordination](memory-coordination.md) - Advanced memory patterns
4. [Session Management](session-management.md) - Full lifecycle workflows

## You'll Know You're Ready When...

✅ You can spawn 5+ agents in a single message
✅ You understand when to use Task tool vs MCP tools
✅ You can coordinate agents through memory namespaces
✅ You can manage a complete session from start to closeout
✅ Your agents coordinate without manual intervention

## Practice Project

**Build a blog platform** (at your own pace)

By the end of Phase 2: Essential Skills, build this in parallel:

**Agents to spawn**:
1. Backend developer - REST API (posts CRUD)
2. Frontend developer - React UI
3. Database architect - Schema design
4. Test engineer - Comprehensive tests
5. Documentation writer - API docs

**Success criteria**:
- All 5 agents spawned in single message
- All agents coordinate through memory (API contracts, schema, etc.)
- All artifacts in correct session directories
- Session closes with complete backup

This is a realistic project you can actually use afterward.

## Key Concepts This Phase

### 1. The Task Tool (Claude Code)

**What it is**: Claude Code's native tool for spawning actual agents that do work.

**Why it matters**: This is THE way to execute multi-agent workflows.

**Example**:
```javascript
Task("Backend Developer", "Build REST API. Save to sessions/.../artifacts/code/", "backend-dev")
Task("Frontend Developer", "Build React UI. Save to sessions/.../artifacts/code/", "coder")
Task("Tester", "Write tests. Save to sessions/.../artifacts/tests/", "tester")
```

### 2. MCP Tools (Coordination Only)

**What they are**: Model Context Protocol tools for setup and monitoring.

**Why they matter**: They set up coordination topology, but don't execute work.

**Example**:
```javascript
mcp__claude_flow__swarm_init({ topology: "mesh" })
mcp__claude_flow__agent_spawn({ type: "researcher" })  // Defines type, doesn't spawn actual agent
```

### 3. The "One Message" Rule

**CRITICAL**: All related operations in one message for parallel execution.

**❌ Wrong** (Sequential - slow):
```
Message 1: Task("Agent 1")
Message 2: Task("Agent 2")
Message 3: Task("Agent 3")
```

**✅ Correct** (Parallel - fast):
```
[Single Message]:
  Task("Agent 1", "...", "type1")
  Task("Agent 2", "...", "type2")
  Task("Agent 3", "...", "type3")
```

### 4. Memory as Coordination Layer

Agents don't talk directly to each other. They coordinate through memory:

```
Agent A → Memory → Agent B
         ↑
         Memory Database
         ↓
Agent C → Memory → Agent D
```

## Common Phase 2: Essential Skills Questions

**Q: How many agents can I spawn at once?**
A: Technically unlimited, practically 5-15 for most tasks. More isn't always better.

**Q: What if agents conflict (same file)?**
A: Memory coordination prevents this. Agents check status before writing.

**Q: Do I need to use MCP tools?**
A: No, for simple tasks. MCP tools are for complex coordination topologies.

**Q: How do I know if agents are coordinating properly?**
A: Check memory entries. You should see agents reading what others wrote.

## Phase 2: Essential Skills Success Indicators

By the end of this phase, you should be able to:
1. Spawn 5 agents in parallel without thinking about it
2. Design memory coordination patterns for new projects
3. Explain Task tool vs MCP tools to someone else
4. Build a simple multi-agent project end-to-end

## Next Phase Preview

In Phase 3 (Phase 3: Intermediate), you'll learn:
- Swarm topologies (mesh, hierarchical, star, ring)
- When to use each topology
- Queen selection strategies
- Consensus mechanisms for critical decisions

## Need Help?

- Stuck on spawning? Reread [Spawning Agents](spawning-agents.md)
- Confused about memory? Review Phase 1: Foundations's [Basic Memory Usage](../01-foundations/basic-memory-usage.md)
- Lost? Come back to this README for orientation

**Ready to start?** → [Spawning Agents](spawning-agents.md)
