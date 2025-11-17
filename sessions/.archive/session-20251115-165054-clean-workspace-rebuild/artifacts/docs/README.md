# Claude-Flow Research Documentation

**Session:** session-20251115-165054-clean-workspace-rebuild
**Research Date:** 2025-11-15
**Researcher:** Research Agent (claude-flow best practices specialist)

---

## Overview

Comprehensive research and documentation of claude-flow stock features, architecture patterns, and best practices. This research provides the foundation for building a clean, stock-first workspace with claude-flow orchestration.

**Total Documentation:** 7 files, ~50KB
**Coverage:** Stock features, skills, hooks, integration, best practices, examples

---

## Documentation Index

### 1. [Claude-Flow Reference](claude-flow-reference.md)
**Stock features documentation - complete reference**

**Contents:**
- Memory system (.swarm/memory.db)
- Session backups (.swarm/backups/)
- Hooks system (pre/post operation hooks)
- 90+ MCP tools (swarm, agents, neural, GitHub, performance)
- SPARC methodology (5-phase development)
- 54 agent types (core, specialized, swarm, GitHub)

**Use When:**
- Learning stock claude-flow features
- Looking up MCP tool signatures
- Understanding memory/hooks/backups
- Reference for agent types

**Key Sections:**
- Core Infrastructure (memory, backups, hooks)
- MCP Tools by category
- Agent types and capabilities
- Configuration and setup
- Troubleshooting

---

### 2. [Skills Pattern Guide](skills-pattern-guide.md)
**Progressive disclosure architecture for Claude Code Skills**

**Contents:**
- 3-level progressive disclosure system
- YAML frontmatter specification
- Directory structure requirements
- Content best practices
- Validation checklist
- Skill templates

**Use When:**
- Creating new Claude Code Skills
- Understanding skill architecture
- Optimizing skill discovery
- Scaling to 100+ skills

**Key Patterns:**
- Level 1: Metadata only (~200 chars, always loaded)
- Level 2: Instructions (~2-5KB, on-demand)
- Level 3+: Reference (lazy loaded)
- **Result:** 100+ skills with <10KB context

**Critical Rules:**
- Skills MUST be at top level (no nesting)
- YAML requires name + description
- Front-load keywords for matching

---

### 3. [Hooks Cascade Pattern](hooks-cascade-pattern.md)
**Auto-cascading hooks with stock-first architecture**

**Contents:**
- Auto-cascading hooks architecture
- Stock-first principle (97% stock, 3% wrapper)
- Memory coordination protocol
- Settings.json integration
- Non-blocking execution
- Agent workflow examples

**Use When:**
- Setting up automatic hook firing
- Understanding hook architecture
- Configuring settings.json
- Implementing memory coordination

**Key Patterns:**
- Thin wrapper (~80 lines, event detection only)
- Stock execution (ALL logic in `npx claude-flow@alpha hooks`)
- Non-blocking (async, fire-and-forget)
- Error-tolerant (never breaks workflow)

**Cascade Flow:**
```
Operation → Settings.json → Hook → Stock CLI → Memory → Learning
```

---

### 4. [Integration Guide](integration-guide.md)
**Integration patterns between Claude Code, MCP, hooks, and memory**

**Contents:**
- Integration architecture overview
- 7 complete integration patterns
- Memory coordination examples
- Settings.json configuration
- Skills + hooks integration
- Session management lifecycle
- Common scenarios (full-stack, code review, migration)

**Use When:**
- Understanding component integration
- Setting up multi-agent coordination
- Configuring Claude Code + MCP
- Planning complex workflows

**Key Patterns:**
- **Execution:** Claude Code Task tool
- **Coordination:** MCP tools
- **Communication:** Memory
- **Automation:** Settings.json + hooks

**Integration Flow:**
```
Claude Code → Settings.json → Hooks → MCP Tools → Memory
     ↓                                              ↑
     └──────────────── Agents Coordinate ──────────┘
```

---

### 5. [Best Practices](best-practices.md)
**Comprehensive best practices for claude-flow**

**Contents:**
- Core principles (stock-first, progressive disclosure, non-blocking)
- Memory management (hierarchical keys, TTL, namespaces)
- Hook configuration (settings.json, async, error handling)
- Agent coordination (execution vs strategy)
- Session management (lifecycle, restoration)
- Skills development (structure, keywords, size)
- Performance optimization (batching, caching, monitoring)
- Security (secrets, validation, file protection)
- Error handling (graceful degradation, logging)
- Testing practices (isolation, dry-run, monitoring)

**Use When:**
- Setting up new workspace
- Optimizing performance
- Implementing security
- Troubleshooting issues
- Code review

**Key Metrics:**
- Hook execution: <100ms target
- SKILL.md size: 2-5KB target
- Stock features: 95%+ target
- Custom wrappers: <5% target

---

### 6. [Example: Full-Stack Workflow](../code/examples/full-stack-workflow.md)
**Complete full-stack development workflow demonstration**

**Contents:**
- Step-by-step authentication system build
- 5 agents coordinated via memory
- Hook automation examples
- Session management lifecycle
- Memory state documentation
- Performance metrics

**Demonstrates:**
- Memory coordination (5 memory keys)
- Agent dependencies (sequential phases)
- Hook automation (30+ hooks fired)
- Session closeout (backup creation)
- 100% stock claude-flow usage

**Metrics:**
- 5 agents: Research, Database, Backend, Frontend, Tester
- 14 files: 10 code, 4 tests
- 30+ hooks: pre-edit, post-edit, pre-task, post-task
- 92% test coverage
- 45 minute session
- <5 seconds coordination overhead

---

### 7. [Research Summary](research-summary.md)
**Executive summary of all research findings**

**Contents:**
- Research deliverables overview
- Key findings (5 major insights)
- Architecture patterns identified (4 core patterns)
- Tools & technologies mapped
- Gaps & recommendations
- Performance metrics
- Next steps

**Use When:**
- Quick overview of research
- Understanding key findings
- Reviewing architecture patterns
- Planning implementation

**Key Findings:**
1. Stock-first architecture is best
2. Progressive disclosure scales
3. Memory enables coordination
4. Hooks automate coordination
5. Claude Code handles execution

---

## Quick Reference

### Common Tasks

**Setting up hooks:**
→ See [Hooks Cascade Pattern](hooks-cascade-pattern.md#claude-code-settings-integration)

**Creating a skill:**
→ See [Skills Pattern Guide](skills-pattern-guide.md#skill-templates)

**Agent coordination:**
→ See [Integration Guide](integration-guide.md#integration-pattern-5-mcp-tools--agent-coordination)

**Memory operations:**
→ See [Claude-Flow Reference](claude-flow-reference.md#1-memory-system-swarmmemorydb)

**Session management:**
→ See [Best Practices](best-practices.md#session-management)

**Performance optimization:**
→ See [Best Practices](best-practices.md#performance-optimization)

**Troubleshooting:**
→ See [Best Practices](best-practices.md#troubleshooting-guide)

---

## Architecture Patterns

### Pattern 1: Memory Coordination
```javascript
// Store findings
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/agent/findings",
  namespace: "coordination",
  value: "..."
}

// Retrieve findings
mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/agent/findings",
  namespace: "coordination"
}
```

### Pattern 2: Auto-Cascading Hooks
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "^Edit$",
      "hooks": [{
        "command": "npx claude-flow@alpha hooks post-edit --file '${tool.params.file_path}'",
        "async": true
      }]
    }]
  }
}
```

### Pattern 3: Progressive Skills
```yaml
---
name: "Skill Name"
description: "What it does and when to use it"
---

# Quick Start
[Common use case]

# Advanced
See [docs/ADVANCED.md]
```

### Pattern 4: Agent Coordination
```javascript
// MCP: Coordinate strategy
mcp__claude-flow__swarm_init { topology: "mesh" }

// Claude Code: Execute work
Task("Agent", "Task description. Store in memory.", "agent-type")

// Memory: Share context
mcp__claude-flow__memory_usage { action: "store", ... }
```

---

## Key Principles

### 1. Stock-First (95%+)
Maximize use of stock claude-flow features. Minimize custom code.

**Target:** 95%+ stock, <5% wrappers

### 2. Progressive Disclosure
Load only what's needed, when it's needed.

**Result:** 100+ skills with <10KB context

### 3. Non-Blocking Operations
Hooks and coordination should never delay execution.

**Target:** <100ms per hook

### 4. Memory Coordination
Agents share context via memory, not explicit messages.

**Pattern:** Hierarchical keys, namespaced by domain

### 5. Claude Code Executes
Task tool spawns agents. MCP coordinates strategy.

**Flow:** MCP → Strategy, Claude Code → Execution

---

## File Structure

```
sessions/session-20251115-165054-clean-workspace-rebuild/
└── artifacts/
    ├── docs/
    │   ├── README.md                     # This file
    │   ├── claude-flow-reference.md      # Stock features
    │   ├── skills-pattern-guide.md       # Skills architecture
    │   ├── hooks-cascade-pattern.md      # Auto-cascading hooks
    │   ├── integration-guide.md          # Integration patterns
    │   ├── best-practices.md             # Best practices
    │   └── research-summary.md           # Executive summary
    │
    └── code/
        └── examples/
            └── full-stack-workflow.md    # Complete example
```

---

## Usage Guide

### For Learning
1. Start with [Research Summary](research-summary.md) - Executive overview
2. Read [Claude-Flow Reference](claude-flow-reference.md) - Stock features
3. Study [Skills Pattern Guide](skills-pattern-guide.md) - Architecture
4. Review [Example Workflow](../code/examples/full-stack-workflow.md) - Real usage

### For Implementation
1. Review [Best Practices](best-practices.md) - Setup guidelines
2. Configure hooks using [Hooks Cascade Pattern](hooks-cascade-pattern.md)
3. Setup integration using [Integration Guide](integration-guide.md)
4. Follow patterns from [Example Workflow](../code/examples/full-stack-workflow.md)

### For Reference
- **MCP Tools:** [Claude-Flow Reference](claude-flow-reference.md#mcp-tools-90-available)
- **Hook Commands:** [Claude-Flow Reference](claude-flow-reference.md#3-hooks-system)
- **Skill Templates:** [Skills Pattern Guide](skills-pattern-guide.md#skill-templates)
- **Integration Patterns:** [Integration Guide](integration-guide.md#integration-architecture)
- **Troubleshooting:** [Best Practices](best-practices.md#troubleshooting-guide)

---

## Summary Statistics

**Documentation:**
- Files: 7
- Total Size: ~50KB
- Code Examples: ~150
- Integration Patterns: ~30
- Best Practices: ~20

**Coverage:**
- Stock Features: Complete (90+ tools documented)
- Skills Architecture: Complete (3-level disclosure)
- Hooks System: Complete (all hook types)
- Integration: Complete (7 patterns)
- Examples: 1 full workflow

**Research Scope:**
- Claude-Flow v2.7.35 (alpha)
- Stock features only (MCP tools, hooks, memory)
- Skills architecture (progressive disclosure)
- Integration patterns (Claude Code + MCP)
- Best practices (performance, security, error handling)

---

## Next Steps

1. **Share with Code Analyzer:** Architecture review
2. **Share with Architect:** System design validation
3. **Create Reference Implementations:** Common patterns
4. **Build Validation Tools:** Skill validation, hook testing
5. **Document Custom Extensions:** Stock vs custom comparison

---

## Resources

**Stock Claude-Flow:**
- GitHub: https://github.com/ruvnet/claude-flow
- Documentation: https://github.com/ruvnet/claude-flow/wiki
- Issues: https://github.com/ruvnet/claude-flow/issues

**This Research:**
- Session: sessions/session-20251115-165054-clean-workspace-rebuild/
- Artifacts: sessions/.../artifacts/docs/
- Examples: sessions/.../artifacts/code/examples/

**Related:**
- Claude Code Skills: https://docs.claude.com/en/docs/agents-and-tools/agent-skills
- MCP Tools: All 90+ tools documented in [Claude-Flow Reference](claude-flow-reference.md)

---

**Research Complete**
**Status:** Ready for architecture review and implementation planning
**Researcher:** Research Agent (claude-flow specialist)
**Date:** 2025-11-15
