## Primary Execution Method: Claude Code Task Tool

**🎯 CRITICAL: Use Task Tool for All SPARC Phases**

The Task tool is the **primary and preferred** method for SPARC execution. It provides 3-5x speed improvements through parallel execution.

### ✅ CORRECT: Task Tool (Primary Method)

```javascript
// Single message - parallel SPARC phase execution
[Parallel Agent Execution]:
  Task("Specification Agent", "Analyze requirements and constraints. Store decisions in memory.", "researcher")
  Task("Pseudocode Agent", "Design algorithm and logic flow. Document in sessions/$SESSION_ID/artifacts/docs/.", "system-architect")
  Task("Architecture Agent", "Design system components and interfaces. Save to sessions/$SESSION_ID/artifacts/code/.", "system-architect")
  Task("Refinement Agent", "Implement with TDD. Write tests first to sessions/$SESSION_ID/artifacts/tests/.", "coder")
  Task("Completion Agent", "Integration testing and deployment prep. Document in sessions/$SESSION_ID/artifacts/docs/.", "tester")

  // Batch all todos together
  TodoWrite { todos: [
    {content: "Complete specification phase", status: "in_progress", activeForm: "Analyzing requirements"},
    {content: "Design pseudocode algorithms", status: "in_progress", activeForm: "Designing algorithms"},
    {content: "Architect system components", status: "in_progress", activeForm: "Architecting system"},
    {content: "Implement with TDD", status: "pending", activeForm: "Implementing features"},
    {content: "Integration testing", status: "pending", activeForm: "Testing integration"},
    {content: "Documentation finalization", status: "pending", activeForm: "Finalizing documentation"},
    {content: "Deployment preparation", status: "pending", activeForm: "Preparing deployment"},
    {content: "Performance optimization", status: "pending", activeForm: "Optimizing performance"}
  ]}
```

### Performance Comparison

| Method | Speed | When to Use |
|--------|-------|-------------|
| **Task tool** | **3-5x faster** | **99% of work** (primary) |
| MCP tools | Coordination only | Topology setup (optional) |
| CLI (`npx claude-flow`) | Sequential | Fallback/manual mode |

### Full Development Example

```javascript
// ✅ CORRECT: Single message with all execution
[Single Message]:
  // Optional: MCP coordination setup
  mcp__claude-flow_alpha__swarm_init({ topology: "hierarchical", maxAgents: 8 })

  // PRIMARY: Task tool for actual work (parallel execution)
  Task("Research Agent", "Analyze authentication patterns and best practices. Store findings in memory with key 'sparc/research/auth'.", "researcher")

  Task("Specification Agent", "Define authentication requirements: JWT tokens, refresh mechanism, role-based access. Document in sessions/$SESSION_ID/artifacts/docs/spec.md.", "researcher")

  Task("Architecture Agent", "Design auth system: middleware layer, token service, user service, database schema. Save architecture doc to sessions/$SESSION_ID/artifacts/docs/architecture.md.", "system-architect")

  Task("Pseudocode Agent", "Create algorithm designs for login flow, token refresh, permission checking. Document in sessions/$SESSION_ID/artifacts/docs/pseudocode.md.", "system-architect")

  Task("TDD Agent", "Write failing tests first: login, logout, token refresh, permissions. Save to sessions/$SESSION_ID/artifacts/tests/. Then implement minimal code to pass.", "coder")

  Task("Coder Agent", "Implement authentication features following TDD cycle. Save code to sessions/$SESSION_ID/artifacts/code/. Use hooks for coordination.", "coder")

  Task("Reviewer Agent", "Review authentication code for security vulnerabilities, best practices, test coverage. Report findings to sessions/$SESSION_ID/artifacts/docs/review.md.", "reviewer")

  Task("Completion Agent", "Integration testing, documentation finalization, deployment prep. Final report to sessions/$SESSION_ID/artifacts/docs/completion.md.", "tester")

  // Batch ALL todos in ONE call (8-10 minimum)
  TodoWrite { todos: [
    {content: "Research authentication patterns", status: "in_progress", activeForm: "Researching authentication"},
    {content: "Define authentication requirements", status: "in_progress", activeForm: "Defining requirements"},
    {content: "Design authentication architecture", status: "in_progress", activeForm: "Designing architecture"},
    {content: "Create pseudocode algorithms", status: "in_progress", activeForm: "Creating pseudocode"},
    {content: "Write failing tests (TDD)", status: "pending", activeForm: "Writing tests"},
    {content: "Implement authentication features", status: "pending", activeForm: "Implementing features"},
    {content: "Security code review", status: "pending", activeForm: "Reviewing security"},
    {content: "Integration testing", status: "pending", activeForm: "Testing integration"},
    {content: "Documentation finalization", status: "pending", activeForm: "Finalizing docs"},
    {content: "Deployment preparation", status: "pending", activeForm: "Preparing deployment"}
  ]}
```

### ❌ WRONG: Sequential/Multiple Messages

```javascript
// Don't do this - breaks parallel coordination
Message 1: mcp__claude-flow_alpha__sparc_mode { mode: "researcher" }
Message 2: mcp__claude-flow_alpha__sparc_mode { mode: "architect" }
Message 3: Task("Coder", "Implement", "coder")
// This loses 3-5x speed benefit!
```

### CLI as Fallback Only

The CLI commands are still available but should be used sparingly:

```bash
# Fallback method (when Task tool unavailable)
npx claude-flow@alpha sparc run spec-pseudocode "Build API"
npx claude-flow@alpha sparc run architect "Design system"
npx claude-flow@alpha sparc tdd "Implement features"
```

**Prefer Task tool** - it's faster, more powerful, and properly integrated with hooks and memory coordination.

### Why Task Tool is Superior

1. **Parallel Execution**: 3-5x faster via concurrent agent spawning
2. **Hooks Integration**: Automatic coordination via pre/post hooks
3. **Memory Coordination**: Cross-agent state sharing
4. **Single Message**: All operations in one coordinated batch
5. **Better Resource Usage**: Optimal agent scheduling
6. **Proven Performance**: 84.8% SWE-Bench solve rate

### Quick Reference

```javascript
// Primary method (use this 99% of the time)
Task("<Agent Name>", "<Task description>. Save to sessions/$SESSION_ID/artifacts/...", "<agent-type>")

// Optional MCP setup (complex topologies)
mcp__claude-flow_alpha__swarm_init({ topology: "...", maxAgents: N })

// Fallback CLI (when Task tool unavailable)
npx claude-flow@alpha sparc run <mode> "task description"
```

Remember: **Task tool first, CLI as fallback.**
