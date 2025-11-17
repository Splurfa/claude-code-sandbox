# Hive Mind Template Library - Usage Guide

## Overview

This template library provides reusable patterns for common multi-agent workflows. Each template is battle-tested and optimized for specific use cases.

---

## Available Templates

### 1. Verification Swarm (`template-verification-swarm.json`)

**Purpose**: Parallel verification of documentation claims against system reality

**Use when**:
- Verifying documentation claims against codebase
- Audit trails and compliance checks
- Post-migration validation
- Identifying documentation drift
- Quality assurance reviews

**Time**: 30-40 minutes (parallel) / 100+ minutes (sequential)

**Agents**: 5 (3 researchers + 2 analysts)

**Topology**: Hierarchical with Byzantine consensus

**Result**: Verified claims with evidence, discrepancy reports, root cause analysis

**Key Feature**: Parallel execution for independent verifications (70% time savings)

**Example Usage**:
```bash
# Verify 5 claims about file locations in CLAUDE.md
# Spawn 5 agents in parallel using Claude Code's Task() tool
# Each agent verifies one claim independently
# Results consolidated in 30 minutes vs 100 minutes sequential
```

---

### 2. Adaptive Research Mission (`template-adaptive-research.json`)

**Purpose**: Dynamic research with mid-flight replanning based on discoveries

**Use when**:
- Unknown scope exploratory research
- Meta-analysis of complex systems
- Investigating systemic issues
- Feature gap analysis
- Post-mortem investigations

**Time**: 60-120 minutes (variable based on discoveries)

**Agents**: 2-7+ (adaptive, scales based on findings)

**Topology**: Hierarchical with Adaptive Queen

**Result**: Comprehensive research with dynamic replanning, root cause analysis, actionable templates

**Key Feature**: Queen can replan mission based on intermediate findings without HITL intervention

**Example Usage**:
```bash
# Phase 1: Discover (2 agents) - Find unexpected pattern
# Queen Decision: Insert Phase 1.5 deep-dive (1 additional agent)
# Phase 2: Analysis (2 agents) - Complex architectural issue found
# Queen Decision: Spawn specialized security agent
# Phase 3: Documentation (3 agents) - Generate findings and templates
```

**Adaptation Triggers**:
- Discovery of unexpected patterns → Insert analysis layer (+15-20 min)
- Scope larger than expected → Spawn additional agents (+0 min parallel)
- Critical issues found → Escalate to HITL (pauses)
- Conflicting evidence → Spawn validator agent (+20-25 min)

---

### 3. Stock-First Integration Pattern (`template-stock-first-integration.json`)

**Purpose**: Research stock features before building custom integrations

**Use when**:
- Integrating new features into existing system
- Resolving conflicts between stock and custom
- Ensuring coherence across components
- Consolidating fragmented implementations
- Preventing documentation drift

**Time**: 105-140 minutes (sequential with gates)

**Agents**: 5 (researcher → analyst → architect → coder → reviewer)

**Topology**: Hierarchical with sequential gates

**Result**: Coherent integration pattern, leveraging stock where possible, custom only where justified

**Key Feature**: Mandatory gates prevent premature implementation

**Workflow**:
1. **Stock Discovery** (15-20 min): Test and document stock behavior
2. **Custom Analysis** (20-25 min): Identify where custom exists and why
3. **Integration Design** (25-30 min): Design coherent integration
4. **Implementation** (30-45 min): Build following stock patterns
5. **Validation** (15-20 min): Verify coherence and compliance

**HITL Checkpoints**:
- After step 2: Approve custom justifications
- After step 3: Approve integration architecture
- After step 5: Approve final implementation

**Anti-Patterns Prevented**:
- Building custom without checking stock first
- Custom reimplementing stock features
- Documentation claiming stock but using custom
- Custom using different patterns than stock

---

### 4. Documentation Reality Check (`template-documentation-reality-check.json`)

**Purpose**: Systematic audit of documentation accuracy against actual codebase

**Use when**:
- Documentation drift suspected
- After major refactoring
- Before public releases
- During onboarding failures
- Periodic quality audits (quarterly/yearly)

**Time**: 70-95 minutes (small audit, 5-10 claims)

**Agents**: 3 + N (where N = claim count)

**Topology**: Mesh with Raft consensus

**Result**: Verified claims, pattern analysis, fix recommendations, corrected documentation

**Workflow**:
1. **Extract Claims** (10-15 min): Identify verifiable claims in docs
2. **Parallel Verification** (15-20 min per claim): Verify each claim against codebase
3. **Pattern Analysis** (20-25 min): Identify systematic issues
4. **Fix Recommendations** (25-35 min): Generate corrected documentation

**Claim Types**:
- `file_location`: Claims about where files exist
- `feature_behavior`: Claims about what features do
- `api_contract`: Claims about API interfaces
- `command_usage`: Claims about CLI commands
- `configuration`: Claims about config options
- `integration`: Claims about component interactions

**Scaling**:
- Small audit (5-10 claims): 60-90 min, 3-5 agents
- Medium audit (10-25 claims): 90-120 min, 5-10 agents
- Large audit (25-50 claims): 120-180 min, 10-20 agents
- Full system (50+ claims): 180-300 min, break into sessions

**Integration**:
- CI/CD: Can be automated as pre-release gate
- Version control: Generate git patches for fixes
- Issue tracking: Auto-create issues for discrepancies

---

## How to Use Templates

### 1. Select Template

Choose based on your use case:
- **Need to verify claims?** → Verification Swarm
- **Unknown scope research?** → Adaptive Research
- **Integrating features?** → Stock-First Integration
- **Documentation audit?** → Documentation Reality Check

### 2. Customize Template

Copy template to your session artifacts:
```bash
cp template-verification-swarm.json sessions/[SESSION_ID]/artifacts/code/
```

Edit agent tasks for your specific use case:
- Update `task` descriptions
- Modify `deliverable` file names
- Adjust `time_estimate` if needed
- Scale agent count if needed

### 3. Spawn Agents

Use Claude Code's `Task()` tool to spawn all agents in a single message:

```javascript
// Example: Verification Swarm
[Single Message - All Agents Spawned Together]:

Task("Verification Agent 1",
  "Verify claim #1: CLAUDE.md says sessions go to sessions/$SESSION_ID/artifacts/.
   Search codebase for actual implementation.
   Save findings to sessions/[SESSION_ID]/artifacts/docs/verification-1-sessions.md",
  "researcher")

Task("Verification Agent 2",
  "Verify claim #2: Hooks fire automatically during agent work.
   Test hook execution and document behavior.
   Save findings to sessions/[SESSION_ID]/artifacts/docs/verification-2-hooks.md",
  "researcher")

Task("Verification Agent 3",
  "Verify claim #3: Memory uses MCP tools, not hooks.
   Search for memory usage patterns.
   Save findings to sessions/[SESSION_ID]/artifacts/docs/verification-3-memory.md",
  "researcher")

Task("Pattern Analyst",
  "Read verification-1, verification-2, verification-3.
   Identify systematic patterns in discrepancies.
   Save analysis to sessions/[SESSION_ID]/artifacts/docs/verification-4-analysis.md",
  "analyst")

Task("Validation Analyst",
  "Read all reports and cross-validate evidence.
   Identify root causes and recommend fixes.
   Save validation to sessions/[SESSION_ID]/artifacts/docs/verification-5-validation.md",
  "analyst")

// All todos in ONE call
TodoWrite { todos: [
  {id: "1", content: "Verify claim #1 - sessions", status: "in_progress", priority: "high"},
  {id: "2", content: "Verify claim #2 - hooks", status: "in_progress", priority: "high"},
  {id: "3", content: "Verify claim #3 - memory", status: "in_progress", priority: "high"},
  {id: "4", content: "Analyze patterns", status: "pending", priority: "medium"},
  {id: "5", content: "Cross-validate findings", status: "pending", priority: "medium"},
  {id: "6", content: "Generate recommendations", status: "pending", priority: "low"}
]}
```

### 4. Follow Template Workflow

Each template has specific workflow steps:
- **Verification Swarm**: Parallel execution, no dependencies
- **Adaptive Research**: Phased with HITL checkpoints
- **Stock-First**: Sequential with gates (no step N+1 until step N approved)
- **Documentation Reality Check**: Extract → Verify → Analyze → Fix

### 5. Collect Results

All agents save to session artifacts:
```
sessions/[SESSION_ID]/artifacts/
  ├── docs/
  │   ├── verification-1-[topic].md
  │   ├── verification-2-[topic].md
  │   ├── analysis-[topic].md
  │   └── validation-[topic].md
  ├── code/
  │   └── (implementation files if needed)
  └── scripts/
      └── (automation scripts if generated)
```

---

## When NOT to Use Templates

Templates add coordination overhead. **Skip templates for**:

- **Single-agent tasks**: Just do it directly (no coordination needed)
- **Trivial work**: Simple fixes don't need multi-agent orchestration
- **Unique one-off problems**: Templates assume recurring patterns
- **Time-critical hotfixes**: Emergency fixes need speed, not process
- **Exploratory play**: Learning/experimentation doesn't need formal structure

**Rule of thumb**: If task takes < 30 minutes for single agent, don't use template.

---

## Template Selection Decision Tree

```
START: What's your goal?
│
├─ Verify documentation claims?
│  └─ Use: Verification Swarm
│
├─ Research unknown problem space?
│  └─ Use: Adaptive Research Mission
│
├─ Integrate new feature into existing system?
│  └─ Use: Stock-First Integration
│
├─ Audit documentation accuracy?
│  └─ Use: Documentation Reality Check
│
└─ None of the above?
   └─ DON'T use template, work directly
```

---

## Customization Guidelines

### Scaling Agent Count

- **Verification Swarm**: Scale to N claims (2-10 typical)
  - 5 claims = 5 agents (3 verifiers + 2 analysts)
  - 10 claims = 10 agents (8 verifiers + 2 analysts)

- **Adaptive Research**: Let queen adapt (4-15 agents typical)
  - Simple research: 4-6 agents
  - Complex investigation: 8-12 agents
  - Full system analysis: 12-15+ agents

- **Stock-First**: Fixed 5 agents (sequential pipeline)

- **Documentation Reality Check**: 3 + N (where N = claim count)
  - Small audit (5-10 claims): 5-10 agents
  - Large audit (50+ claims): 20+ agents, break into sessions

### Changing Topology

- **Hierarchical**: Best for phased workflows, clear leader
- **Mesh**: Best for peer verification, no central authority
- **Ring**: Best for sequential processing with feedback loops
- **Star**: Best for centralized coordination with many independents

### Choosing Consensus

- **Byzantine**: Fault-tolerant, handles malicious agents, slower
- **Raft**: Faster, assumes honest agents, leader-based
- **Gossip**: Eventual consistency, peer-to-peer, relaxed
- **Proof-of-Learning**: Neural-based, learns from outcomes

**Recommendation**:
- Use Byzantine for critical verification (Verification Swarm)
- Use Raft for documentation checks (Reality Check)
- Use Gossip for exploratory research (Adaptive Research)

---

## Best Practices

### 1. Batch Operations
- Spawn ALL agents in single message (use Task() tool)
- Create ALL todos in one TodoWrite call
- Perform ALL file operations together

### 2. Session Management
- Always work in session artifacts: `sessions/[SESSION_ID]/artifacts/`
- Never write to root `docs/`, `tests/`, `scripts/`
- Use session closeout when complete

### 3. HITL Checkpoints
- Adaptive Research: After each phase
- Stock-First: After steps 2, 3, 5
- Verification Swarm: Optional (can run fully autonomous)
- Reality Check: After pattern analysis

### 4. Memory Coordination
- Agents share via session artifacts (files)
- No cross-agent MCP memory needed for templates
- Use hooks for coordination events

### 5. Time Estimates
- Templates show typical times (not guarantees)
- Parallel execution = 3-4x faster than sequential
- Factor in HITL approval time (5-10 min per checkpoint)

---

## Success Metrics

Track these for continuous improvement:

- **Time savings**: Parallel vs sequential execution time
- **Accuracy rate**: % of claims verified correctly
- **Pattern detection**: # of systematic issues found
- **Fix success rate**: % of recommendations implemented
- **Reusability**: # of times template reused

---

## Template Maintenance

Templates are living documents:

1. **Update after each use**: Capture lessons learned
2. **Version templates**: Increment version on major changes
3. **Document failures**: What didn't work and why
4. **Share improvements**: Contribute back to template library
5. **Archive deprecated**: Don't delete, mark as `deprecated_[reason]`

---

## Support & Feedback

- **Template issues**: Create issue in session artifacts
- **Template requests**: Document use case in `docs/templates/requests/`
- **Template improvements**: Submit via session closeout report
- **Questions**: Check `docs/guides/` or ask in session

---

## Quick Reference Card

| Template | Use Case | Time | Agents | Execution | HITL |
|----------|----------|------|--------|-----------|------|
| **Verification Swarm** | Verify claims | 30-40 min | 5 | Parallel | Low |
| **Adaptive Research** | Unknown scope | 60-120 min | 2-7+ | Phased | Medium |
| **Stock-First** | Integration | 105-140 min | 5 | Sequential | High |
| **Reality Check** | Doc audit | 70-95 min | 3+N | Hybrid | Medium |

**Legend**:
- **Time**: Typical completion time
- **Agents**: Agent count (fixed or range)
- **Execution**: Parallel, Sequential, Phased, or Hybrid
- **HITL**: Human-in-the-loop involvement (Low/Medium/High)

---

**Template Library Version**: 1.0.0
**Last Updated**: 2025-11-16
**Source Session**: session-20251116-151059-coherence-analysis
**Maintainer**: Derek (splurfa)
