# Wizard Recommendation Patterns in Stock Claude Flow

**Research Date**: 2025-11-17
**Scope**: Official Claude Flow skills and hive-mind systems only
**Sources**: `.claude/skills/` (hive-mind-advanced, swarm-orchestration, hooks-automation, reasoningbank-intelligence)

---

## Section 1: How Wizards Currently Make Recommendations

### 1.1 Hive-Mind Wizard (Primary Example)

The hive-mind wizard (`npx claude-flow hive-mind spawn`) makes recommendations based on **queen type selection**:

**Queen Types** (from `hive-mind-advanced/SKILL.md`):

1. **Strategic Queens** - For research, planning, and analysis
   ```bash
   npx claude-flow hive-mind spawn "Research ML frameworks" --queen-type strategic
   ```

2. **Tactical Queens** - For implementation and execution
   ```bash
   npx claude-flow hive-mind spawn "Build authentication" --queen-type tactical
   ```

3. **Adaptive Queens** - For optimization and dynamic tasks
   ```bash
   npx claude-flow hive-mind spawn "Optimize performance" --queen-type adaptive
   ```

**Key Finding**: Recommendations are **task-description based**, not historical. The wizard analyzes the objective string to determine queen type.

### 1.2 Topology Recommendations

**Automatic Topology Selection** (from `swarm-orchestration/SKILL.md`):

The system supports adaptive topology switching based on task complexity:

```typescript
// Automatically switches topology based on task
await swarm.init({
  topology: 'adaptive',
  optimization: 'task-complexity'
});
```

**Topology Selection Criteria** (from `github-code-review/SKILL.md`):
- Small PR (< 100 lines): ring topology
- Medium PR (100-500 lines): mesh topology
- Large PR (> 500 lines): hierarchical topology

**Key Finding**: Size/complexity metrics drive topology recommendations, not past execution patterns.

### 1.3 Strategy Recommendations

**Agent Distribution Strategies** (from `swarm-advanced/SKILL.md`):

1. **Adaptive** - Dynamic adjustment based on task complexity
2. **Balanced** - Equal distribution of work across agents
3. **Specialized** - Task-specific agent assignment
4. **Parallel** - Maximum concurrent execution

```javascript
mcp__claude-flow__swarm_init({
  "topology": "mesh",
  "maxAgents": 6,
  "strategy": "adaptive"
})
```

**Key Finding**: Strategy is selected at initialization based on objective analysis, not learned from prior success.

### 1.4 Consensus Mechanism Recommendations

**Consensus Algorithms** (from `hive-mind-advanced/SKILL.md`):

1. **Majority** - Simple democratic voting
2. **Weighted** - Queen has 3x voting power
3. **Byzantine** - 2/3 supermajority required

**Best Practice Guidance**:
```bash
# For critical decisions requiring robust consensus
npx claude-flow hive-mind spawn "..." --consensus byzantine

# For more decisive results
npx claude-flow hive-mind spawn "..." --consensus weighted

# For simple voting
npx claude-flow hive-mind spawn "..." --consensus majority
```

**Key Finding**: Consensus selection is **manual or rule-based**, not learned from historical decision quality.

---

## Section 2: Memory-Based Learning for Recommendations

### 2.1 Collective Memory System

**Memory Types** (from `hive-mind-advanced/SKILL.md`):

| Type | TTL | Purpose | Relevance to Recommendations |
|------|-----|---------|------------------------------|
| `knowledge` | No TTL | Permanent insights | **High** - Could inform future decisions |
| `result` | Permanent | Execution results | **High** - Success patterns stored here |
| `consensus` | Permanent | Decision records | **Medium** - Historical voting patterns |
| `context` | 1 hour | Session context | Low - Temporary only |
| `task` | 30 min | Task-specific data | Low - Short-lived |

**Storing Learnings** (from best practices):
```javascript
// After successful pattern implementation
await memory.store('auth-pattern', {
  approach: 'JWT with refresh tokens',
  pros: ['Stateless', 'Scalable'],
  cons: ['Token size', 'Revocation complexity'],
  implementation: {...}
}, 'knowledge', { confidence: 0.95 });
```

**Building Associations**:
```javascript
// Link related concepts
await memory.associate('jwt-auth', 'refresh-tokens', 0.9);
await memory.associate('jwt-auth', 'oauth2', 0.7);
```

### 2.2 Memory Search Capabilities

**Pattern Search** (from `hive-mind-advanced/SKILL.md`):
```javascript
// Search memory by pattern
const results = await memory.search('api*', {
  type: 'knowledge',
  minConfidence: 0.8,
  limit: 50
});

// Get related memories
const related = await memory.getRelated('api-patterns', 10);
```

**Key Finding**: While memory storage exists for successful patterns, **there's no documented feedback loop** from memory to future wizard recommendations.

### 2.3 Cross-Session Memory Persistence

**Session Management** (from `hive-mind-advanced/SKILL.md`):
- Sessions can be exported/imported
- Checkpoint creation at key milestones
- Memory state is restored between sessions

```bash
# Export session for backup
npx claude-flow hive-mind export <session-id> --output backup.json

# Import session
npx claude-flow hive-mind import backup.json

# Resume from checkpoint
npx claude-flow hive-mind resume <session-id>
```

**Key Finding**: Sessions preserve state, but **wizard recommendations don't query past session outcomes**.

---

## Section 3: Pattern Matching for Similar Scenarios

### 3.1 Neural Pattern Training

**Post-Operation Learning** (from `hooks-automation/SKILL.md`):

After successful operations, hooks can train neural patterns:

```javascript
npx claude-flow@alpha hook post-edit \
  --file "api/auth.js" \
  --memory-key "swarm/backend/auth-api" \
  --train-patterns  // ← Pattern training
```

**Neural Training Integration**:
```javascript
mcp__claude-flow__neural_train {
  pattern_type: "coordination",
  training_data: { /* edit patterns */ }
}
```

**Key Finding**: Pattern training occurs, but **no documented link between trained patterns and wizard initialization recommendations**.

### 3.2 Task-Based Agent Assignment

**Automatic Worker Assignment** (from `hive-mind-advanced/SKILL.md`):

The system intelligently assigns tasks based on:
- **Keyword matching** with agent specialization
- **Historical performance metrics** ← Closest to pattern matching
- Worker availability and load
- Task complexity analysis

```javascript
// Create task (auto-assigned based on history)
const task = await hiveMind.createTask(
  'Implement user authentication',
  priority: 8,
  { estimatedDuration: 30000 }
);
```

**Key Finding**: Task assignment uses historical performance, but **wizard-level recommendations don't leverage this**.

### 3.3 ReasoningBank Pattern Recognition

**Strategy Recommendation** (from `reasoningbank-intelligence/SKILL.md`):

ReasoningBank provides the **closest match to pattern-based recommendations**:

```typescript
// Get optimal strategy based on similar past scenarios
const strategy = await rb.recommendStrategy('code_review', {
  language: 'typescript',
  complexity: 'high'
});

// Compare strategies based on historical success
const comparison = await rb.compareStrategies('bug_fixing', [
  'tdd_approach',
  'debug_first',
  'reproduce_then_fix'
]);

// Get best strategy
const best = comparison.strategies[0];
console.log(`Best: ${best.name} (score: ${best.score})`);
```

**Recording Experience**:
```typescript
await rb.recordExperience({
  task: 'code_review',
  approach: 'static_analysis_first',
  outcome: {
    success: true,
    metrics: {
      bugs_found: 5,
      time_taken: 120,
      false_positives: 1
    }
  },
  context: {
    language: 'typescript',
    complexity: 'medium'
  }
});
```

**Pattern Learning**:
```typescript
await rb.learnPattern({
  pattern: 'api_errors_increase_after_deploy',
  triggers: ['deployment', 'traffic_spike'],
  actions: ['rollback', 'scale_up'],
  confidence: 0.85
});

// Match patterns to current situation
const matches = await rb.matchPatterns(currentSituation);
```

**Key Finding**: ReasoningBank has full pattern matching and strategy recommendation, but **it's a separate system** from hive-mind wizards. No documented integration showing wizards using ReasoningBank for topology/queen/consensus recommendations.

---

## Section 4: Neural Training Integration

### 4.1 Neural Pattern Training

**Available Neural Features** (from `swarm-advanced/SKILL.md`):

```javascript
// Adaptive learning from experience
mcp__claude-flow__learning_adapt({
  "experience": {
    "workflow": "research-to-report",
    "success_metrics": {...},
    "improvements": [...]
  }
})
```

**Pattern Storage in Collective Memory**:
From `hive-mind-advanced/SKILL.md`:
> "The system trains on successful patterns... Happens after successful task completion... Stores in collective memory... Improves future task matching"

### 4.2 Neural Training Workflow

**Hook Integration** (from `hooks-automation/SKILL.md`):

```bash
# Post-task learning
npx claude-flow@alpha hook post-task \
  --task-id "auth-implementation" \
  --analyze-performance \
  --store-decisions \
  --export-learnings  # ← Neural learning export
```

**Features**:
- Execution time and token usage measurement
- Decision and implementation choice recording
- Neural learning pattern export
- Completion report generation

### 4.3 Auto-Learning Configuration

**ReasoningBank Auto-Learning** (from `reasoningbank-intelligence/SKILL.md`):

```typescript
// Enable auto-learning from all tasks
await rb.enableAutoLearning({
  threshold: 0.7,        // Only learn from high-confidence outcomes
  updateFrequency: 100   // Update models every 100 experiences
});
```

**Meta-Learning**:
```typescript
await rb.metaLearn({
  observation: 'parallel_execution_faster_for_independent_tasks',
  confidence: 0.95,
  applicability: {
    task_types: ['batch_processing', 'data_transformation'],
    conditions: ['tasks_independent', 'io_bound']
  }
});
```

**Key Finding**: Neural training infrastructure exists, but **no documented mechanism for wizards to query neural models when making topology/queen/consensus recommendations**.

---

## Section 5: Best Practice Guidance from Skills

### 5.1 Wizard Usage Best Practices

**From `hive-mind-advanced/SKILL.md`**:

#### Choose the Right Queen Type

**Strategic Queens** - For research, planning, and analysis
- Use when: Tasks require investigation, discovery, or analysis
- Example: "Research ML frameworks"

**Tactical Queens** - For implementation and execution
- Use when: Building features, implementing functionality
- Example: "Build authentication"

**Adaptive Queens** - For optimization and dynamic tasks
- Use when: Performance tuning, dynamic adjustment needed
- Example: "Optimize performance"

#### Leverage Consensus

Use consensus for critical decisions:
- Architecture pattern selection
- Technology stack choices
- Implementation approach
- Code review approval
- Release readiness

**Recommendation**: Use Byzantine consensus (2/3 majority) for mission-critical decisions requiring fault tolerance.

### 5.2 Topology Selection Guidance

**From `swarm-orchestration/SKILL.md`**:

1. **Mesh (Peer-to-Peer)** - Equal peers, distributed decision-making
2. **Hierarchical (Queen-Worker)** - Centralized coordination, specialized workers
3. **Adaptive (Dynamic)** - Automatically switches topology based on task

**Best Practice**: "Start small: Begin with 2-3 agents, scale up"

### 5.3 Memory Coordination Best Practices

**From `hive-mind-advanced/SKILL.md`**:

**Store Learnings**:
```javascript
// After successful pattern implementation
await memory.store('auth-pattern', {
  approach: 'JWT with refresh tokens',
  pros: ['Stateless', 'Scalable'],
  cons: ['Token size', 'Revocation complexity'],
  implementation: {...}
}, 'knowledge', { confidence: 0.95 });
```

**Build Associations**:
```javascript
// Link related concepts
await memory.associate('jwt-auth', 'refresh-tokens', 0.9);
await memory.associate('jwt-auth', 'oauth2', 0.7);
```

**Key Finding**: Best practices focus on **storing knowledge after execution**, not **using stored knowledge for future recommendations**.

### 5.4 ReasoningBank Integration Best Practices

**From `reasoningbank-intelligence/SKILL.md`**:

1. **Record consistently**: Log all task outcomes, not just successes
2. **Provide context**: Rich context improves pattern matching
3. **Set thresholds**: Filter low-confidence learnings
4. **Review periodically**: Audit learned patterns for quality
5. **Use vector search**: Enable semantic pattern matching

**Adaptive Agent Pattern**:
```typescript
class AdaptiveAgent {
  async execute(task: Task) {
    // Get optimal strategy (based on history!)
    const strategy = await rb.recommendStrategy(task.type, task.context);

    // Execute with strategy
    const result = await this.executeWithStrategy(task, strategy);

    // Learn from outcome (feedback loop!)
    await rb.recordExperience({
      task: task.type,
      approach: strategy.name,
      outcome: result,
      context: task.context
    });

    return result;
  }
}
```

**Key Finding**: ReasoningBank shows the **ideal pattern** for recommendation-from-history, but it's designed for **agent-level strategy selection**, not **wizard-level topology/queen/consensus recommendations**.

---

## Summary of Findings

### What Exists in Stock Claude Flow

1. **Collective Memory System** - Stores successful patterns, decisions, and results
2. **Neural Pattern Training** - Learns from successful operations
3. **ReasoningBank** - Full pattern matching and strategy recommendation (separate system)
4. **Task Assignment** - Uses historical performance for worker assignment
5. **Session Persistence** - Maintains state across sessions

### What's Missing

1. **Wizard-Level Feedback Loop** - No documented mechanism for wizards to query past execution success when recommending topology/queen/consensus
2. **ReasoningBank Integration with Wizards** - ReasoningBank exists but isn't shown integrating with hive-mind wizard recommendations
3. **Pattern-Based Topology Selection** - Topology choice is rule-based (PR size) or manual, not learned from similar past scenarios
4. **Historical Success Metrics for Recommendations** - Memory stores results, but wizard recommendations don't query them

### How Recommendations Currently Work

**Wizards make recommendations based on**:
1. **Task description analysis** (keyword matching)
2. **Complexity metrics** (PR size, task complexity)
3. **Manual best practice rules** (critical decisions → Byzantine consensus)
4. **Static mappings** (small tasks → ring, large tasks → hierarchical)

**NOT based on**:
1. Historical success rates of topology choices
2. Past execution metrics for similar tasks
3. Learned patterns from collective memory
4. ReasoningBank strategy recommendations

---

## Conclusion

Stock Claude Flow has **all the infrastructure** for feedback-based recommendations (memory, neural training, ReasoningBank), but the **hive-mind wizard doesn't currently use it** for topology/queen/consensus recommendations.

The closest pattern is **ReasoningBank's strategy recommendation system**, which does exactly what we want (learn from history, recommend based on similar scenarios) but for **agent-level strategy selection**, not **wizard-level architecture decisions**.

**Key Architectural Gap**: The feedback loop exists at the **agent task execution level** (ReasoningBank) but not at the **swarm initialization level** (hive-mind wizard).
