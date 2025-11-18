# Adaptive Mode Analysis for Claude Flow Wizard Prompt

**Analysis Date**: 2025-11-17
**Session**: session-20251117-100232-docs-refactor-tutor
**Purpose**: Determine how to properly invoke "adaptive mode" in wizard prompt per Claude Flow spec

---

## Executive Summary

**Finding**: "Adaptive mode" in Claude Flow spec refers to **TWO DISTINCT CONCEPTS**:

1. **MCP Swarm Strategy Parameter** (`strategy: "adaptive"`) - Available via `mcp__claude-flow__swarm_init` and `mcp__claude-flow__task_orchestrate`
2. **Hive-Mind Queen Type** (`queen_type: "adaptive"`) - Conceptual label for queen behavior patterns

**Current Wizard Prompt Status**: ❌ **INCOMPLETE**
- Mentions "adaptive coordinator" and "adaptive topology" conceptually
- **MISSING**: Explicit MCP tool invocations with `strategy: "adaptive"` parameter
- **MISSING**: Instructions to spawn agents with adaptive strategy

**Recommendation**: Add explicit MCP tool invocation examples showing `strategy: "adaptive"` parameter usage.

---

## Part 1: What is "Adaptive Mode" in Claude Flow Spec?

### 1.1 MCP Swarm Strategy Parameter

**Location**: Stock Claude Flow MCP tool parameters

**Tool**: `mcp__claude-flow__swarm_init`
**Parameter**: `strategy` (enum)
**Values**: `"balanced"`, `"specialized"`, `"adaptive"`, `"auto"`

**Example from CLAUDE.md (Line 332)**:
```javascript
mcp__claude-flow__swarm_init {
  topology: "mesh",
  maxAgents: 6,
  strategy: "adaptive"  // ← THIS IS "ADAPTIVE MODE"
}
```

**Tool**: `mcp__claude-flow__task_orchestrate`
**Parameter**: `strategy` (enum)
**Values**: `"parallel"`, `"sequential"`, `"adaptive"`, `"balanced"`

**Example from codebase**:
```javascript
mcp__claude-flow__task_orchestrate({
  task: "Optimize database queries",
  strategy: "adaptive",  // ← Dynamic strategy selection
  priority: "high"
})
```

**What it does** (from Flow-Nexus skill docs):
> - **Parallel**: Maximum concurrency for independent subtasks
> - **Sequential**: Step-by-step execution with dependencies
> - **Adaptive**: AI-powered strategy selection based on task analysis

**Evidence**: Found in 15+ codebase files including:
- `.claude/skills/flow-nexus-swarm/SKILL.md` (Line 88)
- `.claude/agents/goal/code-goal-planner.md` (Line 353)
- `.claude/agents/swarm/adaptive-coordinator.md` (Line 18)

### 1.2 Hive-Mind Adaptive Queen Type

**Location**: Hive-Mind system (custom extension)

**Configuration**: `queen_type: "adaptive"` in metadata.json

**Profile** (from `docs/explanation/hive-mind-system.md`, Lines 69-91):
- **Planning Horizon**: Adaptive (adjusts dynamically)
- **Decision Style**: Context-aware and flexible
- **Adaptability**: 1.0 (maximum)
- **Oversight**: Performance-based

**Advanced Capabilities**:
1. Performance Monitoring - Tracks agent effectiveness in real-time
2. Dynamic Strategy Adjustment - Can pivot approach mid-execution
3. Auto-Scaling - Spawn additional specialists when needed
4. Collective Memory Integration - Learns from past pivot decisions
5. Consensus Building - Involves team in pivot decisions

**When to Choose**:
> "Choose adaptive queen when the problem requires flexibility, performance monitoring, and potential mid-execution pivots. Ideal for optimization and dynamic problem-solving."

**⚠️ IMPORTANT REALITY CHECK** (from `hive-mind-reality-guide.md`, Lines 194-216):

**Documentation Claims**: Three queen types with automatic behavior differences

**Reality**: ⚠️ **CONCEPTUAL - Labels only, no automated behavior**

**What Actually Happens**:
- Queen type stored in `metadata.json`
- Label helps you THINK about coordination approach
- **NO AUTOMATIC BEHAVIOR CHANGES** occur based on queen type
- You must manually apply coordination patterns

**Example**:
```json
// This is conceptual, not automatic
"queen_transition": "strategic→adaptive at Layer 0 completion"
// We changed the LABEL and approached work differently
// But no automatic behavior triggered
```

---

## Part 2: Current Wizard Prompt Analysis

### 2.1 What Prompt Currently Says

**File**: `WIZARD-PROMPT-FINAL.md`

**Lines 188-204 - Execution Autonomy Section**:
```markdown
### You Choose
- **Topology**: Mesh, hierarchical, ring, star - pick what makes sense for task distribution
- **Queen**: Strategic planner, adaptive coordinator, collective intelligence - match to mission complexity
- **Consensus**: Byzantine, Raft, gossip - match to decision criticality

### Guidance (NOT Rules)

**For documentation refactoring**:
- Mesh topology: Parallel doc review by multiple agents
- Collective intelligence queen: Synthesize findings
- Byzantine consensus: High-stakes decisions (what to archive vs fix)

**For tutor-mode BUILD**:
- Hierarchical topology: Backend, frontend, testing specialists
- Strategic planner queen: Coordinate multi-domain work
- Raft consensus: Feature design decisions
```

**Analysis**:
- ✅ Mentions "adaptive coordinator" as a choice
- ✅ Explains WHEN to use different queens conceptually
- ❌ **MISSING**: Explicit MCP tool invocation showing `strategy: "adaptive"`
- ❌ **MISSING**: Instructions on HOW to set adaptive mode via MCP parameters
- ❌ **MISSING**: Distinction between conceptual queen labels vs actual MCP strategy parameter

### 2.2 What's Missing

**Gap 1: No Explicit MCP Tool Invocation Example**

Current prompt TALKS ABOUT adaptive mode but doesn't SHOW HOW TO INVOKE IT.

**Gap 2: No Strategy Parameter Guidance**

Wizard needs to know:
- When to use `strategy: "adaptive"` vs `strategy: "balanced"`
- How to pass strategy to `swarm_init` and `task_orchestrate`
- Difference between MCP strategy parameter and hive-mind queen type

**Gap 3: No Integration Point**

Missing instructions like:
> "When you choose adaptive coordinator, invoke MCP tools with `strategy: 'adaptive'` parameter to enable dynamic strategy selection."

---

## Part 3: How to Properly Invoke Adaptive Mode

### 3.1 MCP Tool Invocation Pattern

**Stock Claude Flow (Primary Method)**:

```javascript
// Step 1: Initialize swarm with adaptive strategy
mcp__claude-flow__swarm_init({
  topology: "mesh",           // or hierarchical, ring, star
  maxAgents: 8,
  strategy: "adaptive"        // ← KEY: Enables AI-powered strategy selection
})

// Step 2: Orchestrate tasks with adaptive execution
mcp__claude-flow__task_orchestrate({
  task: "Build tutor-mode feature with multi-agent coordination",
  strategy: "adaptive",       // ← Allows dynamic parallel/sequential decisions
  priority: "high"
})
```

**What This Does** (from spec):
1. **Swarm Init**: Enables AI to dynamically adjust agent distribution strategy
2. **Task Orchestrate**: Allows runtime decision between parallel/sequential execution based on task analysis

### 3.2 Hive-Mind Integration Pattern

**Custom Hive-Mind Extension**:

```javascript
// Optional: Use hive-mind wizard with adaptive queen
// This sets conceptual label, not automated behavior
npx claude-flow@alpha hive-mind:wizard
// Interactive prompt will ask for queen type
// Choose: "adaptive" for dynamic replanning capability

// Then apply adaptive patterns manually:
// 1. Monitor performance metrics during execution
// 2. Pivot strategy when bottlenecks detected
// 3. Scale agents dynamically based on workload
// 4. Use consensus for pivot decisions
```

**Reality** (from hive-mind-reality-guide.md):
- Queen type = mental model for coordination approach
- You must manually execute adaptive patterns
- No automatic behavior changes based on queen type
- Use MCP `strategy: "adaptive"` for actual AI-powered adaptation

### 3.3 Combined Pattern (Recommended)

**For Complex Tasks Requiring Both**:

```javascript
[Single Message - Full Adaptive Setup]:

  // 1. Initialize with adaptive MCP strategy (stock)
  mcp__claude-flow__swarm_init({
    topology: "hierarchical",
    maxAgents: 10,
    strategy: "adaptive"      // AI-powered strategy selection
  })

  // 2. Set hive-mind metadata (custom - conceptual)
  mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "coordination",
    key: "hive/queen/type",
    value: JSON.stringify({ queen_type: "adaptive", rationale: "Dynamic replanning needed" })
  })

  // 3. Orchestrate with adaptive task execution
  mcp__claude-flow__task_orchestrate({
    task: "Documentation refactor + tutor-mode build",
    strategy: "adaptive",     // Runtime parallel/sequential decisions
    priority: "critical"
  })

  // 4. Spawn agents via Claude Code Task tool (execution)
  Task("Doc Reviewer 1", "Review 10 docs with adaptive focus", "reviewer")
  Task("Backend Dev", "Build tutor-mode backend adaptively", "backend-dev")
  Task("Performance Monitor", "Track metrics, signal if pivot needed", "perf-analyzer")
```

---

## Part 4: Recommended Wizard Prompt Additions

### 4.1 Integration Point: After Line 204 (Execution Autonomy)

**Add New Section**:

```markdown
### How to Enable Adaptive Mode

**When you choose adaptive coordination, invoke MCP tools with explicit strategy parameter:**

**Pattern 1: Adaptive Swarm Initialization**
```javascript
// Initialize with AI-powered strategy selection
mcp__claude-flow__swarm_init({
  topology: "mesh",           // Choose based on task distribution
  maxAgents: 8,
  strategy: "adaptive"        // ← Enables dynamic strategy adjustment
})
```

**Pattern 2: Adaptive Task Orchestration**
```javascript
// Orchestrate tasks with runtime strategy decisions
mcp__claude-flow__task_orchestrate({
  task: "Your mission description here",
  strategy: "adaptive",       // ← AI decides parallel vs sequential
  priority: "high"
})
```

**Pattern 3: Full Adaptive Setup (Complex Missions)**
```javascript
[Single Message - Adaptive Coordination]:

  // Stock MCP tools for adaptive behavior
  mcp__claude-flow__swarm_init({
    topology: "hierarchical",
    maxAgents: 10,
    strategy: "adaptive"      // Primary: AI-powered adaptation
  })

  mcp__claude-flow__task_orchestrate({
    task: "Multi-domain mission requiring dynamic pivoting",
    strategy: "adaptive",
    priority: "critical"
  })

  // Hive-mind metadata (conceptual guidance)
  mcp__claude-flow__memory_usage({
    action: "store",
    namespace: "coordination",
    key: "hive/queen/type",
    value: JSON.stringify({
      queen_type: "adaptive",
      performance_monitoring: true,
      pivot_threshold: 0.7  // Pivot if confidence < 70%
    })
  })

  // Claude Code Task tool for actual agent execution
  Task("Performance Monitor", "Track agent effectiveness, signal pivots", "perf-analyzer")
  Task("Agent 1", "Primary work with adaptive focus", "type")
  Task("Agent 2", "Secondary work with adaptive focus", "type")
```

**When to Use Adaptive Mode:**
- Unknown complexity (could be simple or complex)
- Dynamic requirements (may change mid-execution)
- Performance-critical (need to optimize during execution)
- Research missions (discoveries may require replanning)
- Multi-phase work (strategy may differ per phase)

**When NOT to Use Adaptive Mode:**
- Clear, well-defined tasks
- Known complexity (simple or complex but stable)
- Speed-critical work (adaptation adds overhead)
- Straightforward parallel work (use `strategy: "balanced"`)
```

### 4.2 Integration Point: After Line 530 (Weighting Schema)

**Add Clarification**:

```markdown
### Adaptive Mode vs Adaptive Queen

**IMPORTANT DISTINCTION:**

1. **MCP Strategy Parameter** (`strategy: "adaptive"`)
   - **Stock Claude Flow feature**
   - **AI-powered**: Automatically adjusts execution strategy
   - **Real behavior change**: System dynamically chooses parallel/sequential
   - **Invoke via**: `mcp__claude-flow__swarm_init` and `task_orchestrate`

2. **Hive-Mind Queen Type** (`queen_type: "adaptive"`)
   - **Custom extension feature**
   - **Conceptual label**: Mental model for coordination approach
   - **No automatic behavior**: You must manually apply adaptive patterns
   - **Use for**: Human thinking about when to pivot/replan

**Recommendation**: Use BOTH together:
- MCP `strategy: "adaptive"` for AI-powered runtime adaptation
- Hive-mind queen label for YOUR mental model of coordination style
```

### 4.3 Integration Point: Lines 300-303 (Coordination Ledger Example)

**Update Example Entry**:

```markdown
## [15:30:15] Hive Initialization
**Agent**: Adaptive Queen
**Task**: Initialize swarm with adaptive strategy
**Reasoning**: Mission complexity unknown - using adaptive mode to allow runtime strategy pivots based on performance monitoring
**MCP Invocation**:
  ```javascript
  mcp__claude-flow__swarm_init({
    topology: "mesh",
    maxAgents: 8,
    strategy: "adaptive"  // ← AI-powered strategy selection enabled
  })
  ```
**Evidence**:
  - Swarm initialized: mesh topology, 8 max agents
  - Strategy parameter: "adaptive" (runtime parallel/sequential decisions)
  - Queen type: "adaptive" (conceptual - enables pivot thinking)
  - Memory stored: coordination/swarm/init
**Next**: Spawn agents with performance monitoring
```

---

## Part 5: Exact Wording Recommendations

### 5.1 Replace Line 190 (Queen Choice)

**Current**:
```markdown
- **Queen**: Strategic planner, adaptive coordinator, collective intelligence - match to mission complexity
```

**Recommended**:
```markdown
- **Queen Type**: Strategic planner, adaptive coordinator, collective intelligence - conceptual mental model
- **MCP Strategy**: `"adaptive"`, `"balanced"`, `"specialized"` - actual AI-powered behavior
- **Use Both**: Queen type guides YOUR thinking, MCP strategy controls SYSTEM behavior
```

### 5.2 Add After Line 204 (Guidance Section)

**Insert**:
```markdown
### Invoking Adaptive Mode (REQUIRED FOR ADAPTIVE COORDINATION)

**Stock MCP Tools** (AI-powered adaptation):
```javascript
mcp__claude-flow__swarm_init({
  topology: "mesh",
  maxAgents: 8,
  strategy: "adaptive"  // ← Enables runtime strategy adjustment
})

mcp__claude-flow__task_orchestrate({
  task: "Your mission",
  strategy: "adaptive",   // ← AI decides parallel vs sequential
  priority: "high"
})
```

**Hive-Mind Extension** (conceptual guidance):
- Set queen_type to "adaptive" in coordination memory
- Manually monitor performance metrics
- Execute pivot decisions via consensus
- Scale agents dynamically when bottlenecks detected
```

### 5.3 Update Line 486 (Launch Command Section)

**Current**:
```markdown
3. Choose topology/queen/consensus
```

**Recommended**:
```markdown
3. Choose topology/queen/consensus AND set MCP strategy parameter
   - Topology: mesh, hierarchical, ring, star
   - Queen type: strategic, tactical, adaptive (conceptual)
   - MCP strategy: "adaptive", "balanced", "specialized" (AI-powered)
   - Consensus: byzantine, weighted, majority
```

---

## Part 6: Summary & Action Items

### 6.1 What Adaptive Mode Actually Is

**Two Concepts**:

1. **MCP Strategy Parameter** (Stock Claude Flow)
   - Parameter: `strategy: "adaptive"`
   - Tools: `swarm_init`, `task_orchestrate`
   - Behavior: AI-powered runtime strategy selection
   - **This is PRIMARY "adaptive mode"**

2. **Hive-Mind Queen Type** (Custom Extension)
   - Label: `queen_type: "adaptive"`
   - Storage: coordination memory metadata
   - Behavior: Conceptual guide for YOUR coordination thinking
   - **This is SECONDARY conceptual label**

### 6.2 Current Wizard Prompt Gaps

**Missing Elements**:
1. ❌ No explicit MCP tool invocation showing `strategy: "adaptive"`
2. ❌ No distinction between MCP strategy vs hive-mind queen type
3. ❌ No instructions on WHEN to use `strategy: "adaptive"` parameter
4. ❌ No examples showing both MCP adaptive + hive-mind adaptive together

### 6.3 Recommended Additions

**High Priority** (Add These):

1. **After Line 204**: New section "How to Enable Adaptive Mode" with explicit MCP invocations
2. **After Line 530**: Clarification section "Adaptive Mode vs Adaptive Queen"
3. **Update Line 300**: Coordination ledger example showing MCP strategy parameter

**Medium Priority** (Nice to Have):

1. Update Line 190: Distinguish queen type (conceptual) from MCP strategy (behavioral)
2. Update Line 486: Include MCP strategy in decision list
3. Add decision tree: When to use `strategy: "adaptive"` vs `"balanced"`

### 6.4 Integration Points in Existing Prompt Structure

**Minimal Disruption Approach**:

```markdown
Line 204 (End of "Guidance" section):
  → INSERT: "How to Enable Adaptive Mode" section (Pattern 1-3 examples)

Line 530 (End of "Weighting Schema Integration"):
  → INSERT: "Adaptive Mode vs Adaptive Queen" clarification

Line 300 (Coordination Ledger Example):
  → UPDATE: Add MCP invocation showing strategy parameter

Line 190 (Execution Autonomy - You Choose):
  → UPDATE: Distinguish queen type from MCP strategy

Line 486 (Launch Command - You will):
  → UPDATE: Include "set MCP strategy parameter" in list
```

---

## Part 7: Evidence Sources

**MCP Strategy Parameter Evidence**:
1. `CLAUDE.md` (Line 332): `mcp__claude-flow__swarm_init { topology: "mesh", maxAgents: 6 }`
2. `.claude/skills/flow-nexus-swarm/SKILL.md` (Line 88): `strategy: "adaptive"` parameter documentation
3. `.claude/agents/goal/code-goal-planner.md` (Line 353): Example usage in agent template
4. `.claude/agents/swarm/adaptive-coordinator.md` (Line 18): Adaptive coordinator agent using strategy parameter

**Hive-Mind Queen Type Evidence**:
1. `docs/explanation/hive-mind-system.md` (Lines 69-91): Adaptive queen profile
2. `docs/reference/hive-mind-reality-guide.md` (Lines 194-216): Reality check showing conceptual nature
3. `docs/reference/hive-mind-quick-reference.md` (Line 25): Queen types overview

**Strategy Parameter Values**:
- `swarm_init`: `"balanced"`, `"specialized"`, `"adaptive"`, `"auto"`
- `task_orchestrate`: `"parallel"`, `"sequential"`, `"adaptive"`, `"balanced"`

**Verification Status**:
- ✅ MCP strategy parameter: Verified in 15+ codebase files
- ✅ Hive-mind queen type: Verified in hive-mind documentation
- ✅ Reality gap documented: hive-mind-reality-guide.md confirms conceptual nature of queen types

---

## Conclusion

**Wizard prompt currently lacks explicit instructions for invoking adaptive mode via MCP tools.** While it mentions "adaptive coordinator" conceptually, it doesn't show the critical MCP parameter: `strategy: "adaptive"`.

**Recommended fix**: Add three integration points showing explicit MCP invocations with strategy parameter, distinguish MCP adaptive (AI-powered) from hive-mind adaptive (conceptual), and update coordination ledger examples.

**Impact**: Medium-high priority. Without this, wizard may not properly enable adaptive mode even when user expects it, leading to suboptimal coordination strategy.

**Implementation Difficulty**: Low. Simply add sections showing existing MCP tool usage patterns that are already documented elsewhere in codebase.
