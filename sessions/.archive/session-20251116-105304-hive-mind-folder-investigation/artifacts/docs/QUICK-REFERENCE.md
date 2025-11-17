# .hive-mind Folder - Quick Reference

## What Is It?

**Runtime data persistence layer** for Claude Flow's multi-agent Hive Mind orchestration system.

**NOT**: A command directory or source code repo  
**IS**: Configuration files + SQLite databases + session checkpoints

---

## Directory Structure

```
.hive-mind/
├── config.json              # System defaults
├── config/queens.json       # 3 queen types
├── config/workers.json      # 5 worker specializations
├── hive.db                  # Main database (229 MB, 36,000+ entries)
├── memory.db                # Memory cache (16 KB)
├── sessions/                # 4 active session checkpoints
├── backups/                 # Disaster recovery
└── [logs/, exports/, memory/, templates/]  # Empty (future use)
```

---

## Core Concept

### Queen-Led Hierarchy

**Three Queen Types:**
- **Strategic**: Long-term planning (architecture, research)
- **Tactical**: Execution efficiency (coding, troubleshooting)
- **Adaptive**: Dynamic adjustment (optimization, mid-task pivoting)

**Worker Types:**
- Researcher, Coder, Analyst, Tester, Architect, Reviewer, Optimizer, Documenter

**Consensus Mechanisms:**
- Majority (simple voting)
- Weighted (queen gets 3x vote)
- Byzantine (needs 2/3 agreement, fault-tolerant)

---

## How to Use

### Invoke Hive-Mind

```bash
# Interactive wizard (recommended)
npx claude-flow hive-mind spawn "Your objective"

# Or in chat
/hive-mind:wizard

# Check status
npx claude-flow hive-mind status
npx claude-flow hive-mind metrics
```

### Monitor

```bash
# Collective memory
npx claude-flow hive-mind memory

# Sessions
npx claude-flow hive-mind sessions

# Resume paused session
npx claude-flow hive-mind resume <session-id>

# Stop
npx claude-flow hive-mind stop <session-id>
```

---

## When to Use Hive-Mind

✅ **USE:**
- Large refactors spanning multiple modules
- Multi-disciplinary work (backend + frontend + tests + docs)
- Strategic architecture decisions
- Performance optimization
- Complex research

❌ **DON'T USE:**
- Simple documentation edits
- Single-file bug fixes
- Trivial updates
- Quick clarifications

---

## Key Files & Purposes

| File | Size | Purpose |
|------|------|---------|
| `config.json` | 334 B | System defaults (queue type, workers, consensus) |
| `config/queens.json` | 1.46 KB | 3 queen archetypes with capabilities |
| `config/workers.json` | 1.76 KB | 5 worker specializations |
| `hive.db` | 229 MB | Collective memory + session state + metrics |
| `memory.db` | 16 KB | Memory cache |
| `sessions/*.json` | Variable | Active session checkpoints |

---

## Configuration Example

```json
{
  "version": "2.0.0",
  "defaults": {
    "queenType": "strategic",        // or "tactical", "adaptive"
    "maxWorkers": 8,                 // auto-scaling limit
    "consensusAlgorithm": "majority", // or "weighted", "byzantine"
    "memorySize": 100,               // MB
    "autoScale": true,
    "encryption": false
  }
}
```

---

## Commands Reference

```bash
npx claude-flow hive-mind init              # Initialize
npx claude-flow hive-mind spawn "..."       # Spawn swarm
npx claude-flow hive-mind status            # Check status
npx claude-flow hive-mind metrics           # Performance data
npx claude-flow hive-mind memory            # Memory usage
npx claude-flow hive-mind sessions          # List sessions
npx claude-flow hive-mind resume <id>       # Resume session
npx claude-flow hive-mind stop <id>         # Stop gracefully
npx claude-flow hive-mind consensus ...     # Configure voting
```

All commands: `.claude/commands/hive-mind/`

---

## Agent Roles

| Role | Responsibilities |
|------|-----------------|
| **Queen Coordinator** | Strategic command, resource allocation, hierarchy |
| **Collective Intelligence** | Consensus building, knowledge integration, pattern recognition |
| **Scout Explorer** | Information gathering, threat detection, opportunity identification |
| **Worker Specialist** | Task execution, parallel processing, implementation |
| **Memory Manager** | State persistence, knowledge storage, cache optimization |

All in: `.claude/agents/hive-mind/`

---

## Performance Characteristics

- **Parallel spawning**: 10-20x faster than sequential
- **Token reduction**: 32.3% (vs. sequential execution)
- **Speed improvement**: 2.8-4.4x (parallel vs. serial)
- **Memory entries**: 36,000+ tracked
- **Memory latency**: <150ms average
- **Auto-scaling**: Dynamic based on queue depth

---

## Integration Points

- **Claude Flow**: Hooks, memory ops, agent spawning
- **Custom workspace**: AgentDB, Captain's Log, session management
- **GitHub**: PR analysis, repository management
- **MCP servers**: Extended capabilities

---

## Current Status

**Initialized**: 2025-11-14 23:29:28 UTC  
**Version**: 2.0.0  
**Status**: ✅ Production-ready

**System Health**:
- MCP Servers: ✅ 3 connected
- Hive-Mind: ✅ Operational
- Memory: ✅ 36,000+ entries
- Sessions: ✅ Auto-save active
- Consensus: ✅ All 3 algorithms
- Auto-scaling: ✅ Active

---

## Risk Mitigation

| Risk | Safeguard |
|------|-----------|
| Over-complication | Complexity gate before spawn |
| Aggressive pivoting | Cost-benefit ROI analysis |
| Byzantine deadlock | Fallback to weighted consensus |
| Memory pollution | Quality scoring + TTL + GC |
| Memory system conflict | Synchronization layer |

---

## Related Documentation

- **Full analysis**: `docs/guides/reference/hive-mind-capability-mapping.md` (1,354 lines)
- **Skill guide**: `.claude/skills/hive-mind-advanced/SKILL.md` (100+ lines)
- **Curriculum**: `inbox/codex-agent/claude-flow-curriculum/03-coordination-and-hive-mind.md`
- **Main config**: `CLAUDE.md` (lines 106, 158)

---

## Examples

### Example 1: Build Full-Stack App
```bash
npx claude-flow hive-mind spawn "Build full-stack microservices" \
  --queen-type tactical \
  --max-workers 12 \
  --consensus majority
```
Uses tactical queen (good for execution), 12 workers, simple majority voting.

### Example 2: Research Complex Architecture
```bash
npx claude-flow hive-mind spawn "Design ML infrastructure" \
  --queen-type strategic \
  --max-workers 8 \
  --consensus byzantine
```
Uses strategic queen (planning), 8 workers, Byzantine consensus (robust).

### Example 3: Optimize Performance
```bash
npx claude-flow hive-mind spawn "Optimize database queries" \
  --queen-type adaptive \
  --consensus weighted
```
Uses adaptive queen (dynamic adjustment), weighted consensus (strategic guidance).

---

**Last Updated**: 2025-11-16  
**Investigation Scope**: VERY THOROUGH (215+ files analyzed)

