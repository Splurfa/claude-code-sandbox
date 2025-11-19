# Adaptive Topology

> **Note**: Advanced topic. Master basic topologies first.

Runtime topology switching based on task complexity analysis and performance metrics.

## What is Adaptive Topology?

**Definition**: A coordination pattern that automatically selects and switches topologies based on task characteristics.

**Why it matters**: Wrong topology = wasted time or poor quality. Adaptive topology optimizes automatically.

## The Problem

**Fixed topologies**:
```
Task A: Complex collaborative research
Fixed topology: Hierarchical
Result: Slow, bottlenecked at queen

Correct topology: Mesh (peer collaboration)
```

**Adaptive topologies**:
```
Task A: Complex collaborative research
Adaptive analysis: High complexity + collaborative → MESH
Result: Fast, optimal

Task B: Clear implementation with 15 agents
Adaptive analysis: Many agents + clear tasks → HIERARCHICAL
Result: Organized, efficient
```

## Task Complexity Analysis

**Factors analyzed**:

1. **Agent count**
   - < 5 → Mesh or Star
   - 5-15 → Hierarchical or Mesh
   - 15+ → Hierarchical (only option)

2. **Task type**
   - Collaborative/exploratory → Mesh
   - Clear delegation → Hierarchical
   - Simple coordination → Star
   - Sequential pipeline → Ring

3. **Uncertainty level**
   - High uncertainty → Mesh (exploration)
   - Medium uncertainty → Adaptive queen
   - Low uncertainty → Hierarchical (execution)

4. **Innovation vs execution**
   - Innovation-heavy → Mesh (collaboration)
   - Execution-heavy → Hierarchical or Star

5. **Time constraints**
   - Urgent → Star (fast decisions) or Mesh (parallel)
   - Normal → Any topology
   - Long-term → Hierarchical (structured)

## Decision Matrix

| Factor | Mesh | Hierarchical | Star | Ring |
|--------|------|--------------|------|------|
| **Agents** | < 8 | 6+ | < 7 | Any |
| **Complexity** | High | High | Low-Med | Med |
| **Collaboration** | High | Med | Low | Low |
| **Delegation** | Low | High | Med | Low |
| **Sequential** | No | No | No | Yes |
| **Innovation** | High | Low | Low | Med |

## Implementation

**Adaptive topology coordinator**:

```javascript
Task("Adaptive Topology Coordinator", `
  PROJECT: Analyze and implement optimal topology

  ANALYSIS PHASE:
  1. Analyze task characteristics:
     - Number of agents needed: ___
     - Task type (collaborative/delegated/sequential): ___
     - Uncertainty level (high/medium/low): ___
     - Innovation vs execution: ___
     - Time constraints: ___

  2. Score each topology:
     MESH score = collaboration_factor + innovation_factor - (agents > 8 ? 10 : 0)
     HIERARCHICAL score = agents_factor + delegation_factor
     STAR score = simplicity_factor + (agents < 7 ? 5 : 0)
     RING score = sequential_factor

  3. Select topology with highest score

  4. Initialize swarm with selected topology

  5. Monitor performance:
     - If bottlenecks detected → switch topology
     - If collaboration needed → switch to mesh
     - If organization needed → switch to hierarchical

  ADAPTATION TRIGGERS:
  - Bottleneck detected (queen overloaded) → Switch to mesh
  - Chaos detected (agents conflicting) → Switch to hierarchical
  - Sequential workflow identified → Switch to ring

  STORE DECISION: memory['adaptive/topology-selection']
`, "adaptive-coordinator")
```

**Real example with scoring**:

```javascript
// Task: Build authentication system
const analysis = {
  agents_needed: 8,
  task_type: "delegated",  // Clear implementation
  uncertainty: "low",      // Known patterns exist
  innovation: 0.2,         // 20% innovation, 80% execution
  collaboration: 0.3,      // Some collaboration needed
  time_constraint: "normal"
}

// Calculate scores
const scores = {
  mesh: (0.3 * 10) + (0.2 * 10) - (8 > 8 ? 10 : 0) = 3 + 2 - 0 = 5
  hierarchical: (8 / 2) + (7 * 1) = 4 + 7 = 11
  star: (0) + (8 < 7 ? 5 : 0) = 0
  ring: 0  // Not sequential
}

// Winner: HIERARCHICAL (score: 11)
// Initialize hierarchical topology with 8 agents
```

## Runtime Topology Switching

**Scenario**: Task starts simple, becomes complex

```javascript
Task("Adaptive Coordinator", `
  INITIAL TOPOLOGY: Star (simple coordination expected)

  MONITORING:
  While project running:
    1. Check memory for:
       - Bottlenecks (coordinator overloaded?)
       - Agent conflicts (need hierarchy?)
       - Collaboration requests (need mesh?)

    2. If bottleneck detected:
       - Calculate new topology score
       - If score > current + threshold → SWITCH

  EXAMPLE SWITCH:
  Started: Star topology (3 agents, simple task)

  T+30min: 2 more agents needed (now 5 agents)
  Analysis: Star still optimal

  T+60min: Task complexity increased, need 8 agents
  Analysis: Star score = 0, Hierarchical score = 9
  DECISION: Switch to Hierarchical

  SWITCH PROCESS:
  1. Pause agents briefly
  2. Reconfigure coordination (star → hierarchical)
  3. Assign team leads
  4. Resume with new topology
  5. Monitor for improvement

  LEARNING: Store decision in ReasoningBank
  - Task started simple, grew complex
  - Star → Hierarchical switch successful
  - Next time: Start with hierarchical if uncertain
`, "adaptive-coordinator")
```

## Performance Metrics for Adaptation

**Metrics monitored**:

1. **Agent utilization**
   ```
   If < 50% average → Too many agents, simplify topology
   If > 90% average → Bottleneck, need better delegation
   ```

2. **Coordination overhead**
   ```
   Mesh: O(n²) communication
   Hierarchical: O(log n) communication
   Star: O(n) communication

   If overhead > 20% of total time → Optimize topology
   ```

3. **Decision latency**
   ```
   Mesh: Fast (peer-to-peer)
   Hierarchical: Slower (goes through queen)
   Star: Fastest (central coordinator)

   If decisions taking too long → Switch to faster topology
   ```

4. **Quality metrics**
   ```
   Mesh: High quality (collaboration)
   Hierarchical: Consistent quality (structured)
   Star: Variable quality (depends on coordinator)

   If quality dropping → Switch to mesh for collaboration
   ```

## Real Example: Adaptive Documentation Project

**Scenario**: This documentation refactor session

**Initial analysis**:
```javascript
Task analysis:
- Agents needed: 1-2 (research + writing)
- Task type: Collaborative writing
- Uncertainty: Medium (structure TBD)
- Innovation: High (new learning path design)
- Time: Normal

Topology decision: START simple (no topology)
Why: Low agent count, can add topology if scales
```

**If project scaled** (hypothetical):
```javascript
T+1 hour: Need 5 more agents (content writers for each level)
New analysis:
- Agents: 7
- Task type: Now delegated (clear structure approved)
- Uncertainty: Low (structure decided)

Topology decision: SWITCH to Hierarchical
- 1 Strategic coordinator (content lead)
- 2 Team leads (foundations lead, skills lead)
- 4 Writers (one per section)

Benefits: Clear delegation, parallel writing, consistent quality
```

## Adaptation Patterns

### Pattern 1: Scale-Up
```
Start: Star (3 agents)
Scale: Need 10 agents
Switch: Star → Hierarchical
Reason: Star doesn't scale beyond 7 agents
```

### Pattern 2: Complexity Increase
```
Start: Star (simple task)
Reality: Task more complex than expected
Switch: Star → Mesh
Reason: Need collaboration to solve complexity
```

### Pattern 3: Organization Needed
```
Start: Mesh (collaborative exploration)
Progress: Solution found, need to implement
Switch: Mesh → Hierarchical
Reason: Execution requires structure
```

### Pattern 4: Pipeline Identified
```
Start: Hierarchical (general coordination)
Discovery: Workflow is sequential
Switch: Hierarchical → Ring
Reason: Sequential pipeline more efficient
```

## You'll Know You Understand When...

✅ You analyze tasks to predict optimal topology
✅ You implement topology switching at runtime
✅ You monitor metrics to detect topology issues
✅ Your systems auto-optimize for performance
✅ You store adaptation learnings for future use

## Practice Exercise

**Design adaptive topology**:

**Scenario**: Unknown project complexity (could be simple or complex)

**Your adaptive strategy**:
1. Initial topology: __________
2. Metrics to monitor: __________
3. Switch trigger 1: __________ → Switch to: __________
4. Switch trigger 2: __________ → Switch to: __________
5. Learning to store: __________

**Example answer**:
<details>
<summary>Click to reveal</summary>

1. **Initial**: Star (assume simple, 3 agents)
2. **Metrics**: Agent count, coordination overhead, decision latency
3. **Trigger 1**: Agents > 7 → Switch to Hierarchical
4. **Trigger 2**: High collaboration needed → Switch to Mesh
5. **Learning**: "Project X started simple, became complex at T+2hrs. Next time start with hierarchical."

</details>

## Next Step

Final advanced topic: Building self-learning workflows with ReasoningBank.

→ **Next**: [ReasoningBank Learning](reasoning-bank.md)
