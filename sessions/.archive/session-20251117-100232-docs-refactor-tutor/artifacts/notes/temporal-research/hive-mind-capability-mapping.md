# Hive-Mind Capability Mapping

**Document Type**: Reference Guide
**Audience**: Users mapping specific problems to hive-mind capabilities
**Source**: Integrated from `inbox/assistant/2025-11-16-hive-mind-investigation/3-reference/capability-mapping.md`
**Note**: This is a comprehensive reference showing how to match problems to hive-mind solutions

---

## Purpose

This document maps real-world problems to appropriate hive-mind configurations, showing:
- Which queen type to use
- Which worker specializations to assign
- Which consensus mechanism to apply
- Expected deliverables and outcomes

---

## Problem Categories

### 1. Strategic Architectural Decisions

**Characteristics**:
- 5+ solution options to evaluate
- Long-term architectural impact
- Requires multiple expert perspectives
- Need robust consensus (2/3 supermajority)

**Recommended Configuration**:
- **Queen Type**: Strategic
- **Consensus**: Byzantine
- **Workers**: 6-8 specialists

**Example Problem**: Broken Session Links Systematic Solution

**Worker Assignment**:
1. **Documentation Architect** - Permanent vs. ephemeral content taxonomy
2. **Session Lifecycle Analyst** - Timeline analysis of when links break
3. **Link Management Researcher** - Comparative analysis of 5 options
4. **File System Specialist** - Technical feasibility analysis
5. **Git Integration Analyst** - Repository impact assessment
6. **Closeout Protocol Designer** - Artifact promotion policy
7. **Cross-Reference Mapper** - Impact assessment
8. **Implementation Coder** - Winning solution prototype

**Expected Deliverables**:
- `docs/protocols/session-artifact-linking.md` (chosen solution + rationale)
- `code/closeout-link-handler.js` (implementation)
- `scripts/fix-broken-links.sh` (migration script)

**Why Byzantine Consensus**:
- Architectural decision with high impact (2/3 supermajority required)
- Multiple valid approaches exist (5 options)
- Need robust consensus for long-term stability

---

### 2. Adaptive Mid-Task Pivoting

**Characteristics**:
- Task starts simple, discovers hidden complexity
- Confidence drops significantly (e.g., 90% → 30%)
- Domain expertise gap detected mid-analysis
- Need to spawn specialists dynamically

**Recommended Configuration**:
- **Queen Type**: Adaptive
- **Consensus**: Weighted
- **Workers**: 6-8 specialists

**Example Problem**: Adaptive Pivot Protocol Design

**Worker Assignment**:
1. **Meta-Cognitive Analyst** - Confidence monitoring checkpoints
2. **Decision Framework Architect** - Formal pivot decision tree
3. **Transparency Protocol Designer** - User-facing communication template
4. **Risk Assessment Specialist** - Stakeholder risk matrix
5. **Pattern Recognition Agent** - Pivot trigger catalog
6. **Implementation Coder** - Confidence monitoring hooks
7. **Quality Assurance Tester** - Pivot protocol test scenarios
8. **Integration Reviewer** - Compatibility check

**Expected Deliverables**:
- `docs/protocols/adaptive-pivot-protocol.md` (formal specification)
- `code/pivot-confidence-scoring.js` (confidence monitoring)
- `code/pivot-triggers.js` (detection logic)
- `tests/pivot-protocol.test.js` (validation scenarios)

**Why Adaptive Queen**:
- The queen's behavior demonstrates the pattern we're designing
- Need real-time performance monitoring and strategy adjustment
- Meta-level insight: Using adaptive queen to design adaptive protocols

**Why Weighted Consensus**:
- Queen guides strategic pivots (3x voting power)
- Workers provide domain expertise
- Not fault-tolerance problem (Byzantine overkill)

**Meta-Level Insight**: Adaptive queen **is the solution** to its own design problem.

---

### 3. Complex Multi-Agent Features

**Characteristics**:
- 6+ specialized workers needed
- Parallel task distribution required
- Consensus on critical decisions
- Cross-domain coordination

**Recommended Configuration**:
- **Queen Type**: Tactical
- **Consensus**: Weighted
- **Workers**: 6-10 specialists

**Example Problem**: Full-Stack Authentication Implementation

**Worker Assignment**:
1. **Backend Developer** - REST API + authentication logic
2. **Frontend Developer** - React UI + auth flows
3. **Database Architect** - User schema + migrations
4. **Test Engineer** - Comprehensive test suite
5. **DevOps Engineer** - Docker + CI/CD + secrets management
6. **Security Auditor** - Vulnerability assessment + penetration testing

**Expected Deliverables**:
- Backend API implementation
- Frontend authentication UI
- Database schema
- Test suite (unit + integration)
- DevOps configuration
- Security audit report

**Why Tactical Queen**:
- Short-term execution, clear deliverables
- Focus on efficient implementation

**Why Weighted Consensus**:
- Security auditor needs veto power on security decisions
- Queen guides execution strategy

---

### 4. Research-Heavy Planning

**Characteristics**:
- Multiple options to evaluate (3+ approaches)
- Requires deep analysis of trade-offs
- Long-term strategic implications
- Decision rationale critical

**Recommended Configuration**:
- **Queen Type**: Strategic
- **Consensus**: Weighted
- **Workers**: 4-6 researchers/analysts

**Example Problem**: Database Migration Strategy Evaluation

**Worker Assignment**:
1. **Technology Researcher** - Flyway capabilities and limitations
2. **Technology Researcher** - Liquibase capabilities and limitations
3. **Technology Researcher** - Custom script approach pros/cons
4. **Performance Analyst** - Benchmark comparison
5. **Risk Assessor** - Risk matrix for each approach
6. **Implementation Planner** - Roadmap for chosen solution

**Expected Deliverables**:
- Comparative analysis matrix
- Risk assessment for each approach
- Performance benchmarks
- Implementation roadmap
- Decision rationale document

**Why Strategic Queen**:
- Research and planning domain
- Long-term strategic implications

**Why Weighted Consensus**:
- Expert opinions should be weighted
- Queen guides research direction

---

## Adaptive Queen Capabilities

**What Makes Adaptive Queen Special**:

1. **Performance Monitoring** - Tracks agent effectiveness in real-time
2. **Dynamic Strategy Adjustment** - Can pivot approach mid-execution
3. **Auto-Scaling** - Spawn additional specialists when needed
4. **Collective Memory Integration** - Learns from past pivot decisions
5. **Consensus Building** - Involves team in pivot decisions

**How Adaptive Queen Works**:

```
Initial Plan:
  - Spawn 2 research agents
  - Simple confidence framework design

Mid-Execution Discovery:
  - Confidence monitoring requires cognitive science expertise
  - User transparency needs UX/communication design
  - Integration testing more complex than expected

Adaptive Queen Response:
  - AUTO-SCALE: Spawn 2 additional specialists
    - Meta-Cognitive Analyst (cognitive science)
    - Transparency Protocol Designer (UX/communication)
  - ADJUST STRATEGY: Switch from simple checklist to formal decision framework
  - REDISTRIBUTE TASKS: Move integration testing to dedicated tester agent
  - CHECKPOINT PROGRESS: Save research findings before pivot
```

**Practical Example: Rocket Guide Scenario**

```
T+0s:  Adaptive Queen spawns 2 documentation analyst workers
T+30s: Worker 1 reports: "Guide A: Clear writing style, good diagrams"
T+60s: Worker 2 reports: "Guide B: Complex terminology detected"
       → Worker 2 confidence: 90% → 60% (DROP DETECTED)
T+90s: Adaptive Queen CHECKPOINT
       → Analyze: "fuel oxidizer ratios", "thrust vector control" detected
       → Decision: Domain expertise gap (aerospace engineering)
       → PIVOT TRIGGERED

T+120s: Adaptive Queen AUTO-SCALES
        → Spawn Aerospace Engineering Specialist (researcher)
        → Spawn Technical Accuracy Validator (analyst)
        → Original workers continue surface-level analysis

T+300s: Combined delivery:
        - Surface comparison (Worker 1)
        - Technical accuracy validation (Specialist)
        - Safety-critical section review (Validator)
        → COMPREHENSIVE ANALYSIS ✅
```

---

## Consensus Mechanism Selection

### When to Use Majority Consensus

**Characteristics**:
- Fast decision-making needed
- Low-stakes decisions
- All agents have equal expertise
- Simple democratic voting

**Example Scenarios**:
- "Choose color scheme for UI"
- "Select naming convention for variables"
- "Decide test framework (all options viable)"

**Voting Pattern**:
```
Option A: 5 votes (queen + 4 workers)
Option B: 3 votes (3 workers)
Winner: Option A (simple majority)
```

### When to Use Weighted Consensus

**Characteristics**:
- Strategic direction matters
- Queen has superior context/expertise
- Mid-level stakes decisions
- Expert-led decision-making

**Example Scenarios**:
- "Adaptive pivot protocol design" (queen guides strategy)
- "Security approach selection" (security expert has more weight)
- "Architecture pattern choice" (architect's opinion weighted)

**Voting Pattern**:
```
Option A: Queen (3x) + 2 workers = 5 total weight
Option B: 5 workers = 5 total weight
Tie-breaker: Queen's 3x weight can break ties
```

### When to Use Byzantine Consensus

**Characteristics**:
- Fault-tolerance critical
- Security-sensitive decisions
- High-stakes with significant impact
- Potential for agent errors/conflicts

**Example Scenarios**:
- "Production deployment decision"
- "Security protocol changes"
- "Infrastructure architecture choice"
- "Financial or compliance decisions"

**Voting Pattern**:
```
Total agents: 9 (queen + 8 workers)
Required votes: 6 (2/3 of 9)
Option A: 7 votes → PASS
Option B: 5 votes → FAIL (below 2/3 threshold)
```

---

## Worker Specialization Matching

### Keyword-Based Auto-Assignment

Hive-mind automatically assigns workers based on keyword matching:

**Architect Worker Keywords**:
`architecture`, `design`, `system`, `scalability`, `integration`, `framework`, `pattern`

**Researcher Worker Keywords**:
`research`, `analysis`, `investigate`, `explore`, `trend`, `pattern`, `cognitive`, `recognition`

**Coder Worker Keywords**:
`implement`, `code`, `develop`, `build`, `programming`, `debugging`, `deployment`, `hooks`, `monitoring`

**Tester Worker Keywords**:
`test`, `testing`, `quality`, `validation`, `automation`, `coverage`, `scenarios`, `QA`

**Reviewer Worker Keywords**:
`review`, `quality`, `assessment`, `compliance`, `standards`, `best practices`, `integration`, `compatibility`

---

## Complexity Assessment

### Scoring Formula

| Factor | Weight | Score Range | Purpose |
|--------|--------|-------------|---------|
| **Agent Count** | 3x | 0-10 | How many specialists needed? |
| **Decision Complexity** | 2x | 0-10 | How many solution options? |
| **Coordination Need** | 2x | 0-10 | Parallel vs. sequential? |
| **Consensus Requirement** | 2x | 0-10 | Democratic decision needed? |
| **Pivot Potential** | 1x | 0-10 | Might complexity increase? |

**Total Weighted Score Thresholds**:
- **0-20**: ❌ Do NOT use hive-mind (simple task)
- **21-40**: 🟡 MAYBE (evaluate case-by-case)
- **41-60**: 🟢 YES (good candidate)
- **61-100**: 🎯 PERFECT FIT (ideal for hive-mind)

### Example Calculation: Adaptive Pivot Protocol

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

## Integration Patterns

### Memory Integration

```javascript
// Store collective decision
await memory.store('hive/decision/pivot-protocol', {
  queenType: "adaptive",
  consensus: "weighted",
  outcome: "approved",
  timestamp: Date.now()
}, 'knowledge', { confidence: 0.95 });

// Retrieve decision
const decision = await memory.retrieve('hive/decision/pivot-protocol');
```

### Session Checkpoint Integration

```bash
# Create checkpoint after major phase
npx claude-flow hive-mind checkpoint "research-complete" \
  --data '{"triggers": [...], "patterns": [...]}'

# Resume from checkpoint
npx claude-flow hive-mind resume <session-id> \
  --checkpoint "research-complete"
```

---

## Risk Mitigation

### Common Risks and Safeguards

| Risk | Safeguard |
|------|-----------|
| **Over-pivoting** (trigger too sensitive) | Track pivot success rate in collective memory |
| **Under-pivoting** (threshold too high) | Track quality issues from failed pivots |
| **Performance overhead** (too many checkpoints) | Benchmark checkpoint execution time |
| **User friction** (too many interruptions) | Learn user quality-vs-speed preferences |
| **Protocol complexity** (hard to understand) | Extensive documentation and examples |

### Safeguard Implementation Example

```javascript
// Track pivot outcomes
await memory.store('pivot-outcome', {
  sessionId: 'session-123',
  triggered: true,
  userApproved: true,
  qualityImprovement: 0.8,
  timeOverhead: 120 // seconds
}, 'metric', { confidence: 0.95 });

// Adaptive queen analyzes patterns
const pivotStats = await memory.search('pivot-outcome*', {
  type: 'metric',
  limit: 100
});

// Adjust thresholds based on success rate
if (successRate < 0.7) {
  // Thresholds too aggressive, raise them
}
```

---

## Decision Framework Summary

| Problem Type | Queen | Consensus | Workers | Use When |
|--------------|-------|-----------|---------|----------|
| **Architectural Decision** | Strategic | Byzantine | 6-8 | 5+ options, long-term impact |
| **Mid-Task Pivot** | Adaptive | Weighted | 6-8 | Complexity discovered, confidence drops |
| **Feature Implementation** | Tactical | Weighted | 6-10 | Clear deliverables, cross-domain |
| **Research Planning** | Strategic | Weighted | 4-6 | Multiple approaches, strategic implications |

---

## Related Documentation

**Core Concepts**:
- [Hive-Mind System Overview](../concepts/hive-mind-system.md) - System architecture
- [Choose Coordination Approach](../how-to/choose-coordination-approach.md) - Decision framework

**Practical Guides**:
- [Zero-Risk Execution Pattern](../how-to/zero-risk-execution-pattern.md) - Safe execution
- [Hive-Mind Quick Reference](hive-mind-quick-reference.md) - Command reference

**Advanced**:
- [Adaptive Pivot Protocol](../advanced/adaptive-pivot-protocol.md) - Pivoting pattern

---

**Last Updated**: 2025-11-16
**Analysis Scope**: Comprehensive problem-to-solution mapping
