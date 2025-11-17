# Hive-Mind Quick Reference

**Document Type**: Quick Lookup Reference
**Audience**: Users who need fast command and concept lookups
**Source**: Integrated from `inbox/assistant/2025-11-16-hive-mind-investigation/3-reference/quick-reference.md`

---

## What Is It?

**Runtime data persistence layer** for Claude Flow's multi-agent Hive Mind orchestration system.

**NOT**: A command directory or source code repo
**IS**: Configuration files + SQLite databases + session checkpoints

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

## Commands

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

### Full Command Reference

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

## When to Use Hive-Mind

### ✅ USE:
- Large refactors spanning multiple modules
- Multi-disciplinary work (backend + frontend + tests + docs)
- Strategic architecture decisions
- Performance optimization
- Complex research

### ❌ DON'T USE:
- Simple documentation edits
- Single-file bug fixes
- Trivial updates
- Quick clarifications

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

## Performance Characteristics

- **Parallel spawning**: 10-20x faster than sequential
- **Token reduction**: 32.3% (vs. sequential execution)
- **Speed improvement**: 2.8-4.4x (parallel vs. serial)
- **Memory entries**: 36,000+ tracked
- **Memory latency**: <150ms average
- **Auto-scaling**: Dynamic based on queue depth

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

## Queen Selection Guide

| Problem Type | Queen Type | Consensus | Example |
|--------------|------------|-----------|---------|
| **Research & Planning** | Strategic | Byzantine | "Evaluate 5 database migration strategies" |
| **Mid-task Pivoting** | Adaptive | Weighted | "Design adaptive pivot protocol" |
| **Feature Implementation** | Tactical | Weighted | "Build OAuth2 authentication system" |

---

## Consensus Selection Guide

| Scenario | Algorithm | Threshold | Why |
|----------|-----------|-----------|-----|
| **Critical Architecture** | Byzantine | 2/3 supermajority | Fault-tolerant, robust for high-stakes decisions |
| **Expert-Led Decisions** | Weighted | Queen 3x power | Strategic perspective matters, queen guides |
| **Simple Democratic Vote** | Majority | 51%+ | Fast decision, low stakes, equal perspectives |

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

## Related Documentation

**Conceptual**:
- [Hive-Mind System Overview](../concepts/hive-mind-system.md) - What hive-mind is

**How-To**:
- [Choose Coordination Approach](../how-to/choose-coordination-approach.md) - When to use hive-mind
- [Zero-Risk Execution Pattern](../how-to/zero-risk-execution-pattern.md) - Safe execution guide

**Advanced**:
- [Adaptive Pivot Protocol](../advanced/adaptive-pivot-protocol.md) - Mid-task pivoting

**Skills & Commands**:
- **Skill guide**: `.claude/skills/hive-mind-advanced/SKILL.md` (100+ lines)
- **Main config**: `CLAUDE.md` (lines 106, 158)

---

## Quick Decision Tree

```
SHOULD I USE HIVE-MIND?

Is task > 5 minutes? ──NO──> Single agent
         │
        YES
         │
Need 3+ agents? ──NO──> Simple coordination
         │
        YES
         │
Need consensus? ──NO──> Task tool (parallel spawn)
         │
        YES
         │
     USE HIVE-MIND
```

---

**Last Updated**: 2025-11-16
**Investigation Scope**: VERY THOROUGH (215+ files analyzed)
