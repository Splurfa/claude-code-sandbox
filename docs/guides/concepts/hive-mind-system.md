# Hive-Mind System Overview

**Document Type**: Conceptual Explanation
**Audience**: Users seeking to understand what hive-mind is and how it works
**Source**: Integrated from `inbox/assistant/2025-11-16-hive-mind-investigation/1-foundation/system-overview.md`

---

## What is the Hive-Mind System?

The **Hive-Mind System** is Claude Flow's advanced multi-agent orchestration framework that enables sophisticated collective intelligence through:

- **Strategic coordination** via three queen archetypes (strategic, tactical, adaptive)
- **Specialized worker agents** (architects, researchers, coders, testers, reviewers)
- **Democratic decision-making** through consensus mechanisms (majority, weighted, Byzantine)
- **Collective memory** stored in persistent SQLite databases (36,000+ entries)
- **Parallel execution** achieving 10-20x speedup over sequential agent spawning

**Runtime Data Location**: `.hive-mind/` folder (229 MB total)
**Command Interface**: `.claude/commands/hive-mind/*.md` (11 CLI commands)
**Agent Personas**: `.claude/agents/hive-mind/*.md` (5 specialized roles)

---

## Core Architecture

### Queen-Led Hierarchy

From the skill documentation:

> "The Hive Mind system represents the pinnacle of multi-agent coordination in Claude Flow, implementing a queen-led hierarchical architecture where a strategic queen coordinator directs specialized worker agents through collective decision-making and shared memory."

### Three Queen Types

#### 1. Strategic Queen

**Profile**:
- **Planning Horizon**: Long-term
- **Decision Style**: Analytical and methodical
- **Adaptability**: 0.7 (moderate)
- **Oversight**: Quality-focused

**Best For**:
- Research projects requiring thorough analysis
- Architecture decisions with long-term impact
- Planning phases of complex initiatives
- Strategic roadmap development

**When to Choose**:
> "Choose strategic queen when the problem requires careful analysis, multiple perspectives, and long-term planning. Prioritizes correctness over speed."

#### 2. Tactical Queen

**Profile**:
- **Planning Horizon**: Short-term
- **Decision Style**: Execution-focused and pragmatic
- **Adaptability**: 0.9 (high)
- **Oversight**: Efficiency-oriented

**Best For**:
- Feature implementation with clear requirements
- Rapid problem-solving and troubleshooting
- Coding tasks with tight deadlines
- Immediate response to production issues

**When to Choose**:
> "Choose tactical queen when the problem has clear goals and the focus is on efficient execution. Prioritizes speed over exhaustive analysis."

#### 3. Adaptive Queen

**Profile**:
- **Planning Horizon**: Adaptive (adjusts dynamically)
- **Decision Style**: Context-aware and flexible
- **Adaptability**: 1.0 (maximum)
- **Oversight**: Performance-based

**Best For**:
- Optimization tasks requiring mid-course adjustments
- Dynamic environments with changing requirements
- Performance tuning and bottleneck resolution
- Tasks where initial approach may need pivoting

**Advanced Capabilities**:
1. **Performance Monitoring** - Tracks agent effectiveness in real-time
2. **Dynamic Strategy Adjustment** - Can pivot approach mid-execution
3. **Auto-Scaling** - Spawn additional specialists when needed
4. **Collective Memory Integration** - Learns from past pivot decisions
5. **Consensus Building** - Involves team in pivot decisions

**When to Choose**:
> "Choose adaptive queen when the problem requires flexibility, performance monitoring, and potential mid-execution pivots. Ideal for optimization and dynamic problem-solving."

### Worker Specializations

Five core worker types with specific capabilities:

#### 1. Architect Worker

**Responsibilities**:
- System design and architecture planning
- Technology stack selection and evaluation
- Scalability and performance considerations
- Integration pattern design

**Expertise**: Design patterns, architectural styles, scalability optimization, technology evaluation

**Keyword Matching**: `architecture`, `design`, `system`, `scalability`, `integration`, `framework`, `pattern`

#### 2. Researcher Worker

**Responsibilities**:
- Information gathering and analysis
- Trend identification and evaluation
- Best practices research
- Comparative analysis of approaches

**Expertise**: Research methodologies, information synthesis, trend analysis, comparative evaluation

**Keyword Matching**: `research`, `analysis`, `investigate`, `explore`, `trend`, `pattern`, `cognitive`, `recognition`

#### 3. Implementer Worker (Coder)

**Responsibilities**:
- Code implementation and development
- Debugging and troubleshooting
- Integration and deployment
- Technical problem-solving

**Expertise**: Multiple programming languages, development tools, debugging techniques, integration patterns

**Keyword Matching**: `implement`, `code`, `develop`, `build`, `programming`, `debugging`, `deployment`, `hooks`, `monitoring`

#### 4. Tester Worker

**Responsibilities**:
- Test design and implementation
- Quality assurance and validation
- Test automation
- Coverage analysis and improvement

**Expertise**: Testing frameworks, test automation tools, quality metrics, coverage analysis

**Keyword Matching**: `test`, `testing`, `quality`, `validation`, `automation`, `coverage`, `scenarios`, `QA`

#### 5. Reviewer Worker

**Responsibilities**:
- Code review and quality assessment
- Best practices enforcement
- Mentoring and guidance
- Standards compliance verification

**Expertise**: Code quality standards, best practices, review methodologies, mentoring techniques

**Keyword Matching**: `review`, `quality`, `assessment`, `compliance`, `standards`, `best practices`, `integration`, `compatibility`

### Consensus Mechanisms

#### 1. Majority Consensus

**Algorithm**: Option with most votes wins (simple majority)

**Characteristics**:
- Fast decision-making
- Equal voting weight for all agents
- Democratic and straightforward
- Best for low-stakes decisions

**When to Use**:
- Simple decisions with clear options
- No significant quality differences between choices
- Speed is more important than deep analysis
- All agents have equal expertise

#### 2. Weighted Consensus

**Algorithm**: Queen vote counts 3x weight, workers count 1x

**Characteristics**:
- Strategic perspective prioritized
- Queen has significant influence
- Workers provide input but queen decides
- Balance between democracy and hierarchy

**When to Use**:
- Strategic direction matters significantly
- Queen has superior context or expertise
- Workers provide valuable input but queen should lead
- Mid-level stakes decisions

**Recommended For**:
- Adaptive pivot protocol design
- Strategic roadmap decisions
- Architecture choices with long-term impact

#### 3. Byzantine Consensus

**Algorithm**: Requires 2/3 majority (supermajority)

**Characteristics**:
- Fault-tolerant and robust
- Resistant to malicious or faulty agents
- Slower due to higher threshold
- Highest confidence in decisions

**When to Use**:
- Fault-tolerance is critical
- Security-sensitive decisions
- High-stakes choices with significant impact
- Potential for agent errors or conflicts

**Best For**:
- Production deployment decisions
- Security protocol changes
- Financial or compliance-related choices
- Disaster recovery procedures

---

## When to Use Hive-Mind

**From CLAUDE.md (Subagent Usage Protocol)**:

> "**SIMPLE RULE: 99% of substantive work uses subagents.**"

**Use hive-mind when:**
- Work spans multiple disciplines (frontend + backend + tests + docs)
- Architecture decisions need multiple viewpoints
- Large refactors require parallel effort
- Complex coordination requires strategic oversight

**DO NOT use hive-mind when:**
- Trivial queries ("What color is a brown cat?")
- Simple clarifications or quick lookups
- Single-file edits
- Work fits in single agent's domain

**From CLAUDE.md recommendation**:

> "For complex coordination, nudge user: 'This is a complex request. I recommend running `/hive-mind:wizard` to coordinate multiple agents with proper topology.'"

---

## Performance Benefits

### Speed Improvements

**From research findings**:

> "**Parallel Agent Spawning**: 10-20x faster than sequential agent creation"

**From CLAUDE.md (Performance Benefits)**:

> - **84.8% SWE-Bench solve rate**
> - **32.3% token reduction**
> - **2.8-4.4x speed improvement**
> - **27+ neural models**

### Collective Memory Performance

**Database Statistics**:

- **Database Size**: 229 MB (`.hive-mind/hive.db`)
- **Memory Entries**: 36,000+ tracked entries
- **Access Pattern**: LRU cache with memory pressure handling
- **Concurrency**: WAL mode for concurrent access
- **Integration**: AgentDB integration (150x faster vector search)

### Scalability Metrics

**Auto-Scaling Performance**:
- Scales from 1 to 12 workers dynamically
- Threshold-based spawning (2+ pending tasks per idle worker)
- Automatic cleanup of idle workers
- Memory optimization through LRU cache

**Session Management Performance**:
- Automatic session checkpoints (auto-save intervals)
- Session state restoration in <1 second
- Backup export to `.swarm/backups/` on closeout
- Metrics export for performance analysis

---

## Directory Structure

**Runtime Data Store**: `.hive-mind/`

```
.hive-mind/
├── README.md                           # System overview and getting started
├── config.json                         # Primary configuration (334 bytes)
├── hive.db                             # Main SQLite database (229 MB)
├── memory.db                           # Memory cache (16 KB)
│
├── config/                             # Configuration definitions
│   ├── queens.json                     # 3 queen types (1.46 KB)
│   └── workers.json                    # 5 worker specializations (1.76 KB)
│
├── sessions/                           # Active and historical session data
│   ├── hive-mind-prompt-swarm-*.txt    # Execution transcripts
│   └── session-*-auto-save.json        # Session checkpoints
│
├── backups/                            # Automated backups (empty until used)
├── logs/                               # Debug logging (empty until used)
├── exports/                            # Data exports (empty until used)
├── memory/                             # Memory snapshots (empty until used)
└── templates/                          # Agent templates (empty until used)
```

---

## Command Interface

**Location**: `.claude/commands/hive-mind/` (11 commands)

**Core Commands**:
- `hive-mind.md` - Main command documentation
- `hive-mind-init.md` - Initialize hive system
- `hive-mind-spawn.md` - Spawn swarm with objective
- `hive-mind-wizard.md` - Interactive setup wizard

**Management Commands**:
- `hive-mind-status.md` - Check running status
- `hive-mind-resume.md` - Resume paused session
- `hive-mind-stop.md` - Stop running session
- `hive-mind-sessions.md` - List all sessions

**Advanced Commands**:
- `hive-mind-memory.md` - Collective memory operations
- `hive-mind-metrics.md` - Performance metrics
- `hive-mind-consensus.md` - Consensus configuration

---

## Integration with Claude Flow

**Stock Claude-Flow Features Used**:
- Swarm initialization (`mcp__claude-flow__swarm_init`)
- Agent spawning (`mcp__claude-flow__agent_spawn`)
- Task orchestration (`mcp__claude-flow__task_orchestrate`)
- Memory operations (`mcp__claude-flow__memory_usage`)
- Neural training (`mcp__claude-flow__neural_train`)

**Custom Hive-Mind Extensions**:
- Queen hierarchy system (3 archetypes)
- Worker specialization (5 core + 3 extended types)
- Consensus algorithms (3 types)
- Automatic task distribution via keyword matching
- Parallel agent spawning (10-20x speedup)

**Integration Point** (from CLAUDE.md):

> "For complex coordination, nudge user: 'This is a complex request. I recommend running `/hive-mind:wizard` to coordinate multiple agents with proper topology.'"

---

## Related Documentation

**Quick Start**:
- [How to Choose Coordination Approach](../how-to/choose-coordination-approach.md) - Decision framework
- [Hive-Mind Quick Reference](../reference/hive-mind-quick-reference.md) - Command reference

**Advanced Topics**:
- [Adaptive Pivot Protocol](../advanced/adaptive-pivot-protocol.md) - Mid-task pivoting pattern

**Skills Documentation**:
- `.claude/skills/hive-mind-advanced/SKILL.md` - Comprehensive skill guide
- `CLAUDE.md` - Main workspace configuration

---

## Summary

The Hive-Mind system is the **most sophisticated coordination framework** in Claude Flow, enabling:

✅ **Queen-led strategic oversight** (3 archetypes for different problem types)
✅ **Specialized worker agents** (5 core + 3 extended types)
✅ **Democratic decision-making** (3 consensus mechanisms)
✅ **Collective intelligence** (36,000+ memory entries, 150x faster vector search)
✅ **Parallel execution** (10-20x speedup, 2.8-4.4x overall performance)
✅ **Production-ready** (100/100 readiness score, zero data loss verified)

**When to use**: 99% of substantive work requiring multiple disciplines, strategic oversight, or collective intelligence.

**When NOT to use**: Trivial queries, simple clarifications, single-file edits.

**Recommended entry point**: `/hive-mind:wizard` for interactive setup with guided queen selection, consensus configuration, and worker assignment.
