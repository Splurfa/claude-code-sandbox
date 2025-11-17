# How to Choose the Right Coordination Approach

**Document Type**: Task-Oriented Guide
**Audience**: Users deciding when to use hive-mind vs simpler coordination
**Source**: Integrated from `inbox/assistant/2025-11-16-hive-mind-investigation/2-decision-framework/when-to-use.md`

---

## The Golden Rule

**Use hive-mind for complex multi-agent coordination requiring consensus. Use simpler approaches (single agents, basic coordination) for everything else.**

**Key Statistics**:
- **Current Usage**: Nearly zero (`.hive-mind/hive.db` dormant for 1+ days)
- **Alternative**: `.swarm/memory.db` handles 99% of coordination (63.6 MB vs 229 KB)
- **Reality**: Hive-mind is an **available but rarely-needed** advanced feature

---

## Decision Tree

### 🟢 YES - Use Hive-Mind When:

#### 1. Strategic Architectural Decisions

**Trigger Criteria**:
- 5+ solution options to evaluate
- Long-term architectural impact
- Requires multiple expert perspectives
- Need robust consensus (2/3 supermajority)
- Decision rationale must be documented

**Example**: "Choose systematic solution for broken session artifact links"

**Configuration**:
```bash
npx claude-flow@alpha hive-mind spawn \
  "Design systematic solution for session artifact linking" \
  --queen-type strategic \
  --max-workers 8 \
  --consensus byzantine
```

**Why This Works**:
- Strategic queen guides long-term thinking
- Byzantine consensus ensures 2/3 agreement (fault-tolerant)
- Collective memory stores decision rationale for future reference
- Multiple specialists evaluate trade-offs in parallel

#### 2. Adaptive Mid-Task Pivoting

**Trigger Criteria**:
- Task starts simple, discovers hidden complexity
- Confidence drops significantly (e.g., 90% → 30%)
- Domain expertise gap detected mid-analysis
- Need to spawn specialists dynamically
- Want formal pivot protocol

**Example**: "Design adaptive pivot protocol with confidence monitoring"

**Configuration**:
```bash
npx claude-flow@alpha hive-mind spawn \
  "Design adaptive pivot protocol with meta-cognitive checkpoints" \
  --queen-type adaptive \
  --max-workers 8 \
  --consensus weighted
```

**Why This Works**:
- Adaptive queen monitors worker confidence in real-time
- Auto-scales specialists when complexity discovered
- Demonstrates the exact pattern we're trying to formalize
- Collective memory learns successful pivot patterns

**Meta-Level Insight**: The adaptive queen **IS** the solution to the pivot problem. Using it to design the protocol is recursive learning.

#### 3. Complex Multi-Agent Features

**Trigger Criteria**:
- 6+ specialized workers needed
- Parallel task distribution required
- Consensus on critical decisions (e.g., security approach)
- Collective memory prevents duplicate effort
- Cross-domain coordination (backend + frontend + DB + tests + security)

**Example**: "Build full-stack authentication system (OAuth2 + JWT + security audit)"

**Configuration**:
```bash
npx claude-flow@alpha hive-mind spawn \
  "Implement OAuth2 authentication with JWT tokens and security audit" \
  --queen-type tactical \
  --max-workers 10 \
  --consensus weighted
```

**Why This Works**:
- Tactical queen handles short-term execution
- Multiple specialists work in parallel
- Weighted consensus (security auditor has veto power)
- Collective memory prevents duplicate research

#### 4. Research-Heavy Planning

**Trigger Criteria**:
- Multiple options to evaluate (3+ approaches)
- Requires deep analysis of trade-offs
- Long-term strategic implications
- Weighted consensus needed (expert opinions weighted)
- Decision rationale critical for future reference

**Example**: "Evaluate 3 database migration strategies with pros/cons analysis"

**Configuration**:
```bash
npx claude-flow@alpha hive-mind spawn \
  "Research database migration: Flyway vs Liquibase vs custom scripts" \
  --queen-type strategic \
  --max-workers 6 \
  --consensus weighted
```

---

### ❌ NO - Do NOT Use Hive-Mind For:

#### 1. Simple Documentation Edits

**Anti-Pattern Example**: "Update CLAUDE.md with `.claude-flow/` exception clause"

**Why NOT hive-mind**:
- Single-agent task (1 documenter)
- No architectural decision needed
- No consensus required
- 5 minutes of work
- No coordination complexity

**Use Instead**: Direct task to single documenter agent or do it yourself

**Red Flags**:
- Task description starts with "Update docs..."
- Single file modification
- No cross-file dependencies
- No research needed

#### 2. Trivial Bug Fixes

**Anti-Pattern Example**: "Fix typo in function name"

**Why NOT hive-mind**:
- Single-file change
- No coordination needed
- No decision to make
- No multiple perspectives needed

**Use Instead**: Claude Code Edit tool directly

**Red Flags**:
- Task description contains "fix typo", "update variable", "rename function"
- Code change < 10 lines
- No architectural implications
- No testing complexity

#### 3. Linear Sequential Tasks

**Anti-Pattern Example**: "Read file A, then file B, then file C, summarize"

**Why NOT hive-mind**:
- No parallelization benefit
- Single researcher can do sequentially
- No consensus needed
- No coordination required

**Use Instead**: Single research agent

**Red Flags**:
- Task is inherently sequential (step 1 → step 2 → step 3)
- No parallel sub-tasks
- No decision points
- Single deliverable

#### 4. Tasks With Clear Single Approach

**Anti-Pattern Example**: "Implement sorting algorithm (quicksort)"

**Why NOT hive-mind**:
- Algorithm already specified
- No architectural choice
- Single coder sufficient
- No coordination needed

**Use Instead**: Claude Code Task tool with single coder agent

**Red Flags**:
- Task specifies exact implementation ("use quicksort", "follow X pattern")
- No alternative approaches to evaluate
- No consensus needed
- Single specialist handles entire task

---

### 🟡 MAYBE - Consider Hive-Mind If:

#### Complexity Discovery Mid-Task

**Scenario**: Simple task assigned to single agent, but complexity exceeds capability

**Example Workflow**:
```bash
# Initial assessment: Simple comparison
Task("Compare two user guides")

# Mid-task discovery: Rocket engineering equations found
# Confidence drops 90% → 30%

# Pivot to hive-mind
npx claude-flow@alpha hive-mind spawn \
  "Technical accuracy validation for aerospace engineering content" \
  --queen-type adaptive \
  --max-workers 4
```

**Decision Criteria**:
- Initial confidence > 80%, then drops below 50%
- Unknown technical terms > 3
- Domain expertise gap detected
- Stakeholder risk changes from LOW to HIGH
- Quality requirements increase mid-task

**Process**:
1. Agent detects complexity
2. Reports confidence drop
3. Proposes pivot to hive-mind
4. User approves pivot
5. Adaptive queen spawned with specialists

---

## Problem-to-Queen-Type Mapping

### Strategic Queen Use Cases

**When to Use**:
- Research, planning, and analysis
- Long-term architectural decisions
- Multiple solution options to evaluate
- Need robust consensus (Byzantine)

**Example**: Broken Session Links Systematic Solution
- **Why Strategic**: Requires research into 5 solution options
- **Consensus**: Byzantine (2/3 supermajority for architectural decision)
- **Workers**: Documentation Architect, Session Lifecycle Analyst, Link Management Researcher, File System Specialist, Git Integration Analyst, Closeout Protocol Designer, Cross-Reference Mapper, Implementation Coder

### Adaptive Queen Use Cases

**When to Use**:
- Optimization and dynamic adjustment
- Mid-task pivoting based on performance
- Complexity discovered during execution
- Confidence monitoring required

**Example**: Adaptive Pivot Protocol Design
- **Why Adaptive**: The queen's behavior demonstrates the pattern we're designing
- **Consensus**: Weighted (queen guides strategic pivots)
- **Workers**: Meta-Cognitive Analyst, Decision Framework Architect, Transparency Protocol Designer, Risk Assessment Specialist, Pattern Recognition Agent, Implementation Coder, Quality Assurance Tester, Integration Reviewer

**Meta-Level Insight**: Adaptive queen **is the solution** to its own design problem. The tool exemplifies the pattern we're trying to formalize.

### Tactical Queen Use Cases

**When to Use**:
- Implementation and execution
- Short-term tasks with clear deliverables
- Multi-agent coordination for feature development
- Practical execution over strategic planning

**Example**: Full-Stack Authentication Implementation
- **Why Tactical**: Short-term execution, clear deliverables
- **Consensus**: Weighted (security auditor veto power)
- **Workers**: Backend Developer, Frontend Developer, Database Architect, Test Engineer, DevOps Engineer, Security Auditor

---

## Complexity Assessment

### Scoring System

Use this scoring system to determine if hive-mind is warranted:

| Factor | Weight | Score 0-10 | Weighted Score |
|--------|--------|------------|----------------|
| **Agent Count** | 3x | How many specialists needed? | (score × 3) |
| **Decision Complexity** | 2x | How many solution options? | (score × 2) |
| **Coordination Need** | 2x | Parallel vs. sequential? | (score × 2) |
| **Consensus Requirement** | 2x | Democratic decision needed? | (score × 2) |
| **Pivot Potential** | 1x | Might complexity increase? | (score × 1) |

**Total Weighted Score**:
- **0-20**: ❌ Do NOT use hive-mind (simple task)
- **21-40**: 🟡 MAYBE (evaluate case-by-case)
- **41-60**: 🟢 YES (good candidate for hive-mind)
- **61-100**: 🎯 PERFECT FIT (ideal for hive-mind)

### Example Calculations

**Documentation Edit**:
```
Agent Count:     1 → score 0 × 3 = 0
Decision:        0 → score 0 × 2 = 0
Coordination:    0 → score 0 × 2 = 0
Consensus:       0 → score 0 × 2 = 0
Pivot Potential: 0 → score 0 × 1 = 0
-----------------------------------
TOTAL: 0 (❌ Do NOT use hive-mind)
```

**Adaptive Pivot Protocol Design**:
```
Agent Count:     8 → score 8 × 3 = 24
Decision:        5 options → score 8 × 2 = 16
Coordination:    High interdependence → score 9 × 2 = 18
Consensus:       Weighted → score 8 × 2 = 16
Pivot Potential: Adaptive by nature → score 9 × 1 = 9
-----------------------------------
TOTAL: 83 (🎯 PERFECT FIT)
```

---

## Quick Decision Checklist

### 30-Second Assessment

**Ask these questions in order. First "NO" answer → Don't use hive-mind.**

1. **Is this a multi-step task?** (YES = continue, NO = stop)
2. **Do I need 3+ specialized agents?** (YES = continue, NO = stop)
3. **Is there a decision requiring consensus?** (YES = continue, NO = stop)
4. **Would parallel execution help?** (YES = continue, NO = stop)
5. **Is this more complex than documentation edit?** (YES = continue, NO = stop)

**If you answered YES to all 5 → Use hive-mind**

### Queen Type Selection

```
IS THIS A RESEARCH/PLANNING TASK?
├─ YES → Strategic Queen
│   └─ Examples: Architecture decisions, solution evaluation, research projects
│
└─ NO → IS THIS AN OPTIMIZATION/DYNAMIC TASK?
    ├─ YES → Adaptive Queen
    │   └─ Examples: Mid-task pivoting, confidence monitoring, performance-based adjustment
    │
    └─ NO → Tactical Queen
        └─ Examples: Feature implementation, execution, building deliverables
```

### Consensus Algorithm Selection

```
IS THIS A CRITICAL ARCHITECTURAL DECISION?
├─ YES → Byzantine (2/3 supermajority)
│   └─ Examples: Infrastructure changes, long-term commitments, 5+ options
│
└─ NO → DOES QUEEN NEED STRONG GUIDANCE ROLE?
    ├─ YES → Weighted (queen 3x voting power)
    │   └─ Examples: Strategic planning, security decisions, expert-led consensus
    │
    └─ NO → Majority (51%+ approval)
        └─ Examples: Simple democratic voting, low-stakes decisions
```

---

## Why Hive-Mind Is Currently Unused

### Reality Check

**Current Statistics**:
- `.hive-mind/hive.db`: 229 KB (dormant for 1+ days)
- `.swarm/memory.db`: 63.6 MB (actively used, modified recently)
- **Ratio**: 277x more activity in simple coordination vs. hive-mind

### Root Causes of Low Usage

#### 1. Alternative Coordination Suffices

**What Actually Works**:
```javascript
// Simple memory coordination handles 99% of cases
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "swarm/shared/decisions",
  namespace: "coordination",
  value: JSON.stringify({ decision: "..." })
})
```

**Why This Wins**:
- Single database (no complexity)
- Simple key-value storage
- Already integrated with hooks
- Battle-tested (63.6 MB of data)

#### 2. Most Tasks Are Simple

**Usage Pattern Analysis**:
- 95% of tasks: Single-agent or simple coordination
- 4% of tasks: Multi-agent, no consensus needed
- 1% of tasks: Complex multi-agent with consensus (hive-mind territory)

**Implication**: Hive-mind is **correct for 1% of tasks**, which is fine.

### When to Override Default (Use Hive-Mind Anyway)

**Even if simple coordination works, use hive-mind when**:
1. **Decision rationale matters** - Need to document WHY consensus was reached
2. **Learning from patterns** - Want collective memory to improve over time
3. **Formal governance** - Byzantine consensus for critical decisions
4. **Adaptive behavior** - Need queen to pivot strategies mid-task
5. **Demonstrating patterns** - Using adaptive queen to design adaptive protocols (meta-level)

---

## Quick Reference Card

### 30-Second Decision

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
         │
         ├─ Research/Planning? ──> Strategic Queen + Byzantine
         ├─ Mid-task Pivoting? ──> Adaptive Queen + Weighted
         └─ Implementation? ────> Tactical Queen + Weighted
```

### Queen Type Quick Reference

| Queen Type | Best For | Consensus | Example |
|------------|----------|-----------|---------|
| **Strategic** | Research, planning, architecture | Byzantine | "Choose link management approach" |
| **Adaptive** | Optimization, dynamic adjustment | Weighted | "Design pivot protocol" |
| **Tactical** | Implementation, execution | Weighted | "Build authentication system" |

### Consensus Algorithm Quick Reference

| Algorithm | Threshold | Best For | Example |
|-----------|-----------|----------|---------|
| **Majority** | 51%+ | Simple democratic voting | "Choose color scheme" |
| **Weighted** | Queen 3x power | Expert-led decisions | "Security approach" |
| **Byzantine** | 2/3 supermajority | Critical architecture | "Infrastructure changes" |

---

## Summary

**The Decision Framework in One Sentence**:

> Use hive-mind for **complex multi-agent tasks requiring consensus** (1% of work), use simple coordination for everything else (99% of work).

**Key Takeaways**:
1. **Complexity threshold matters** - Calculate weighted score (threshold: 41+)
2. **Queen type selection is critical** - Strategic (planning), Adaptive (pivoting), Tactical (execution)
3. **Consensus algorithm matters** - Byzantine (critical), Weighted (expert-led), Majority (simple)
4. **Integration is key** - Unified memory layer prevents coordination failures
5. **Metrics guide adoption** - Track token cost vs. quality improvement

---

## Related Documentation

- [Hive-Mind System Overview](../concepts/hive-mind-system.md) - What hive-mind is
- [Hive-Mind Quick Reference](../reference/hive-mind-quick-reference.md) - Command reference
- [Adaptive Pivot Protocol](../advanced/adaptive-pivot-protocol.md) - Mid-task pivoting pattern
