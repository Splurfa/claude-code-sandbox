# System Internals Documentation

This folder explains how your claude-flow workspace actually works under the hood.

## Who This Is For

- **You want to understand the system** without reading code
- **You're debugging an issue** and need to know where to look
- **You're curious** about how agents coordinate
- **You're extending the system** with custom integrations

## What's Inside

### Architecture
- [Architecture Overview](architecture-overview.md) - Big picture design
- [Data Flow](data-flow.md) - How information moves
- [Integration Points](integration-points.md) - How components connect

### Coordination
- [Coordination Mechanics](coordination-mechanics.md) - How agents work together
- [Session Lifecycle](session-lifecycle.md) - What happens during a session
- [Hooks & Automation](hooks-and-automation.md) - Auto-firing workflows

### Deep Dives
- [Memory Architecture](memory-architecture.md) - The `.swarm/memory.db` database
- [Stock vs Custom](stock-vs-custom.md) - What's native, what's added

## Key Concepts

**Stock Claude-Flow** (98% of the system):
- MCP tools for coordination
- Memory database (SQLite)
- Native hooks system
- Agent spawning framework

**Custom Extensions** (2%):
- Workspace session organization
- Captain's Log journaling
- AgentDB semantic search wrapper
- Optional hive-mind orchestration

**Stock Compliance**: 98% (higher than claimed 82%)

## Quick Reference

| Component | Location | Purpose | Stock? |
|-----------|----------|---------|--------|
| Memory DB | `.swarm/memory.db` | Persistent storage | ✅ 100% |
| Session Artifacts | `sessions/session-ID/artifacts/` | Workspace organization | ❌ Custom |
| Hive-Mind State | `.hive-mind/` | Advanced coordination | ✅ 100% stock |
| Captain's Log | `sessions/captains-log/` | Decision journal | ✅ 95% stock |
| AgentDB | `.swarm/agentdb/` | Vector search | ✅ Stock (wrapper custom) |

## Navigation

**Start here if you're**:
- New to the system → [Architecture Overview](architecture-overview.md)
- Debugging memory issues → [Memory Architecture](memory-architecture.md)
- Understanding agent coordination → [Coordination Mechanics](coordination-mechanics.md)
- Extending the system → [Integration Points](integration-points.md)
- Confused about stock vs custom → [Stock vs Custom](stock-vs-custom.md)

## The Big Picture

```
User Chat Thread
       ↓
Claude Code (Task tool spawns agents)
       ↓
Multiple Agents Running in Parallel
       ↓
Shared Memory (.swarm/memory.db)
       ↓
Coordination (via hooks + MCP tools)
       ↓
Artifacts (sessions/session-ID/artifacts/)
```

**Core Principle**: MCP tools coordinate strategy, Claude Code's Task tool executes with real agents.

## Performance Highlights

- **84.8% SWE-Bench solve rate**
- **32.3% token reduction**
- **2.8-4.4x speed improvement**
- **10-20x parallel agent spawning speedup**

## Related Documentation

- **User Guide**: See `CLAUDE.md` for operational instructions
- **Integration Tests**: See `docs/guides/how-to/integration-testing-guide.md`
- **Feature Verification**: See `docs/guides/reference/feature-verification-checklist.md`
- **Troubleshooting**: See `docs/guides/troubleshooting/troubleshooting-guide.md`

---

**Remember**: This documentation explains HOW the system works. For WHAT to do with it, see the user-facing guides.
