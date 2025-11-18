# ReasoningBank Template Learning Capabilities

**Research Date**: 2025-11-17
**Sources**: Official Claude Flow Skills (v2.0.0+)
**Objective**: Document pattern extraction and template generation from adaptive processes

---

## Section 1: Pattern Extraction Capabilities

### 1.1 Pattern Recognition (ReasoningBank Intelligence)

**Evidence**: `reasoningbank-intelligence/SKILL.md:57-69`

```typescript
// Learn patterns from data
await rb.learnPattern({
  pattern: 'api_errors_increase_after_deploy',
  triggers: ['deployment', 'traffic_spike'],
  actions: ['rollback', 'scale_up'],
  confidence: 0.85
});

// Match patterns
const matches = await rb.matchPatterns(currentSituation);
```

**Capabilities**:
- Named pattern storage with triggers and actions
- Confidence scoring (0-1 scale)
- Pattern matching against current situations
- Pattern recognition from historical data

### 1.2 Pattern Matching with AgentDB (150x Faster)

**Evidence**: `reasoningbank-agentdb/SKILL.md:199-214`

```typescript
const result = await rb.retrieveWithReasoning(queryEmbedding, {
  domain: 'problem-solving',
  k: 10,
  useMMR: true,  // Maximal Marginal Relevance for diversity
});

// PatternMatcher returns diverse, relevant memories
result.memories.forEach(mem => {
  console.log(`Pattern: ${mem.pattern.approach}`);
  console.log(`Similarity: ${mem.similarity}`);
  console.log(`Success Rate: ${mem.success_count / mem.usage_count}`);
});
```

**Performance**: 150x faster pattern retrieval (100µs vs 15ms)

### 1.3 Hierarchical Pattern Abstraction

**Evidence**: `reasoningbank-agentdb/SKILL.md:313-350`

ReasoningBank supports three levels of pattern abstraction:

1. **Concrete Level**: Specific implementation details
   ```typescript
   type: 'concrete',
   domain: 'debugging/null-pointer',
   pattern: { bug: 'NPE in UserService.getUser()', fix: 'Add null check' }
   ```

2. **Pattern Level**: Generalized across similar cases
   ```typescript
   type: 'pattern',
   domain: 'debugging',
   pattern: { category: 'null-pointer', approach: 'defensive-checks' }
   ```

3. **Principle Level**: High-level best practices
   ```typescript
   type: 'principle',
   domain: 'software-engineering',
   pattern: { principle: 'fail-fast with clear errors' }
   ```

**Template Generation Capability**: Yes - patterns can be abstracted from concrete to principle level, creating reusable templates.

---

## Section 2: Memory Types for Learning Storage

### 2.1 Hive Mind Memory Types

**Evidence**: `hive-mind-advanced/SKILL.md:164-173`

Eight memory types with different TTLs and purposes:

| Type | TTL | Purpose | Template Storage |
|------|-----|---------|------------------|
| `knowledge` | Permanent | Insights, patterns | ✅ **Yes** - Best for templates |
| `context` | 1 hour | Session context | ❌ No - Too ephemeral |
| `task` | 30 min | Task-specific | ❌ No - Too ephemeral |
| `result` | Permanent | Execution results | ✅ **Partial** - Success patterns |
| `error` | 24 hours | Error logs | ❌ No - Temporary |
| `metric` | 1 hour | Performance metrics | ❌ No - Too ephemeral |
| `consensus` | Permanent | Decision records | ✅ **Yes** - For adaptive decisions |
| `system` | Permanent | System config | ✅ **Yes** - For topology patterns |

### 2.2 Memory Storage Examples

**Evidence**: `hive-mind-advanced/SKILL.md:398-408`

```javascript
// Store learnings after successful pattern implementation
await memory.store('auth-pattern', {
  approach: 'JWT with refresh tokens',
  pros: ['Stateless', 'Scalable'],
  cons: ['Token size', 'Revocation complexity'],
  implementation: {...}
}, 'knowledge', { confidence: 0.95 });
```

**Best Practice**: Use `knowledge` type with high confidence (0.95) for template storage.

### 2.3 Memory Associations

**Evidence**: `hive-mind-advanced/SKILL.md:410-415`

```javascript
// Link related concepts
await memory.associate('jwt-auth', 'refresh-tokens', 0.9);
await memory.associate('jwt-auth', 'oauth2', 0.7);
```

**Template Building**: Associations enable template composition by linking related patterns.

---

## Section 3: Trajectory Tracking for Template Creation

### 3.1 Trajectory Recording

**Evidence**: `reasoningbank-agentdb/SKILL.md:105-131`

```typescript
// Record trajectory (sequence of actions)
const trajectory = {
  task: 'optimize-api-endpoint',
  steps: [
    { action: 'analyze-bottleneck', result: 'found N+1 query' },
    { action: 'add-eager-loading', result: 'reduced queries' },
    { action: 'add-caching', result: 'improved latency' }
  ],
  outcome: 'success',
  metrics: { latency_before: 2500, latency_after: 150 }
};

await rb.insertPattern({
  type: 'trajectory',
  domain: 'api-optimization',
  pattern_data: JSON.stringify({ embedding, pattern: trajectory }),
  confidence: 0.9,
  usage_count: 1,
  success_count: 1
});
```

**Template Generation**: Successful trajectories become templates for similar tasks.

### 3.2 Verdict Judgment

**Evidence**: `reasoningbank-agentdb/SKILL.md:136-151`

```typescript
// Retrieve similar past trajectories
const similar = await rb.retrieveWithReasoning(queryEmbedding, {
  domain: 'api-optimization',
  k: 10,
});

// Judge based on similarity to successful patterns
const verdict = similar.memories.filter(m =>
  m.pattern.outcome === 'success' &&
  m.similarity > 0.8
).length > 5 ? 'likely_success' : 'needs_review';
```

**Template Validation**: Only high-confidence (>0.8 similarity) successful trajectories inform templates.

### 3.3 Memory Distillation

**Evidence**: `reasoningbank-agentdb/SKILL.md:157-189`

```typescript
// Get all experiences in domain
const experiences = await rb.retrieveWithReasoning(embedding, {
  domain: 'api-optimization',
  k: 100,
  optimizeMemory: true,  // Automatic consolidation
});

// Distill into high-level pattern
const distilledPattern = {
  domain: 'api-optimization',
  pattern: 'For N+1 queries: add eager loading, then cache',
  success_rate: 0.92,
  sample_size: experiences.memories.length,
  confidence: 0.95
};

await rb.insertPattern({
  type: 'distilled-pattern',
  domain: 'api-optimization',
  pattern_data: JSON.stringify({...}),
  confidence: 0.95
});
```

**Template Creation**: Distilled patterns are essentially templates derived from multiple trajectories.

**Performance**: <50ms to consolidate 100 patterns into a distilled template (`reasoningbank-agentdb/SKILL.md:305`)

---

## Section 4: Integration with Adaptive Modes

### 4.1 Adaptive Queen Learning

**Evidence**: `hive-mind-advanced/SKILL.md:516-527`

```javascript
// Automatic pattern learning
// Happens after successful task completion
// Stores in collective memory
// Improves future task matching
```

**Note**: The documentation states this happens automatically but doesn't provide implementation details. This is a **documented feature without exposed API**.

### 4.2 Strategy Optimization

**Evidence**: `reasoningbank-intelligence/SKILL.md:72-82`

```typescript
// Compare strategies
const comparison = await rb.compareStrategies('bug_fixing', [
  'tdd_approach',
  'debug_first',
  'reproduce_then_fix'
]);

// Get best strategy
const best = comparison.strategies[0];
console.log(`Best: ${best.name} (score: ${best.score})`);
```

**Adaptive Integration**: Queen can query best strategies from ReasoningBank for adaptive topology decisions.

### 4.3 Transfer Learning

**Evidence**: `reasoningbank-intelligence/SKILL.md:109-117`

```typescript
// Apply knowledge from one domain to another
await rb.transferKnowledge({
  from: 'code_review_javascript',
  to: 'code_review_typescript',
  similarity: 0.8
});
```

**Template Reuse**: Enables applying learned patterns across similar domains.

### 4.4 Multi-Domain Learning

**Evidence**: `reasoningbank-agentdb/SKILL.md:354-369`

```typescript
// Learn from backend optimization
const backendExperience = await rb.retrieveWithReasoning(embedding, {
  domain: 'backend-optimization',
  k: 10,
});

// Apply to frontend optimization
const transferredKnowledge = backendExperience.memories.map(mem => ({
  ...mem,
  domain: 'frontend-optimization',
  adapted: true,
}));
```

**Cross-Domain Templates**: Patterns can be adapted for different but related domains.

---

## Section 5: Code Examples from Skills (Exact Patterns)

### 5.1 Complete Learning Pipeline

**Source**: `reasoningbank-intelligence/SKILL.md:120-141`

```typescript
// Create self-improving agent
class AdaptiveAgent {
  async execute(task: Task) {
    // 1. Get optimal strategy from learned patterns
    const strategy = await rb.recommendStrategy(task.type, task.context);

    // 2. Execute with strategy
    const result = await this.executeWithStrategy(task, strategy);

    // 3. Learn from outcome (creates new template)
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

**Template Generation Flow**:
1. Query existing templates (`recommendStrategy`)
2. Execute task
3. Record outcome as new pattern/template (`recordExperience`)

### 5.2 Complete Integration Example

**Source**: `reasoningbank-intelligence/SKILL.md:20-53`

```typescript
// Initialize ReasoningBank
const rb = new ReasoningBank({
  persist: true,
  learningRate: 0.1,
  adapter: 'agentdb' // Use AgentDB for storage
});

// Record task outcome
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

// Get optimal strategy (retrieves template)
const strategy = await rb.recommendStrategy('code_review', {
  language: 'typescript',
  complexity: 'high'
});
```

### 5.3 Meta-Learning for Template Improvement

**Source**: `reasoningbank-intelligence/SKILL.md:96-107`

```typescript
// Learn about learning (meta-patterns)
await rb.metaLearn({
  observation: 'parallel_execution_faster_for_independent_tasks',
  confidence: 0.95,
  applicability: {
    task_types: ['batch_processing', 'data_transformation'],
    conditions: ['tasks_independent', 'io_bound']
  }
});
```

**Meta-Templates**: Learn patterns about when to apply certain execution strategies (e.g., when to use mesh vs hierarchical topology).

### 5.4 Complete Hive Mind Pattern Storage

**Source**: Combining `hive-mind-advanced/SKILL.md:398-408` and `reasoningbank-agentdb/SKILL.md:64-82`

```typescript
// After successful adaptive queen execution:

// 1. Store the successful approach
await memory.store('adaptive-queen-success', {
  objective: 'Build REST API',
  topology_chosen: 'hierarchical',
  queen_type: 'tactical',
  max_workers: 8,
  outcome: {
    success: true,
    time_taken: 450,
    quality_score: 0.92
  },
  context: {
    complexity: 'medium',
    domain: 'backend-api'
  }
}, 'knowledge', { confidence: 0.95 });

// 2. Store as ReasoningBank pattern
const embedding = await computeEmbedding(JSON.stringify({
  task: 'rest-api-development',
  approach: 'tactical-queen-hierarchical'
}));

await rb.insertPattern({
  type: 'distilled-pattern',
  domain: 'api-development',
  pattern_data: JSON.stringify({
    embedding,
    pattern: {
      recommended_topology: 'hierarchical',
      recommended_queen: 'tactical',
      worker_count: 8,
      success_rate: 0.95
    }
  }),
  confidence: 0.95
});
```

### 5.5 Reasoning Agent Integration

**Source**: `reasoningbank-agentdb/SKILL.md:217-232`

```typescript
const result = await rb.retrieveWithReasoning(queryEmbedding, {
  domain: 'code-optimization',
  synthesizeContext: true,  // Enable context synthesis
  k: 5,
});

// ContextSynthesizer creates coherent narrative from templates
console.log('Synthesized Context:', result.context);
// Output: "Based on 5 similar optimizations, the most effective approach
//  involves profiling, identifying bottlenecks, and applying targeted
//  improvements. Success rate: 87%"
```

**Template Synthesis**: Multiple patterns combined into actionable guidance.

---

## Summary: Template Learning Capabilities

### ✅ Confirmed Capabilities

1. **Pattern Extraction**: Full support via `learnPattern()`, `matchPatterns()`
2. **Trajectory Tracking**: Complete implementation with step-by-step recording
3. **Memory Distillation**: Automatic consolidation of 100+ patterns in <50ms
4. **Hierarchical Abstraction**: 3-level system (concrete → pattern → principle)
5. **Template Storage**: Permanent `knowledge` and `consensus` memory types
6. **Template Retrieval**: 150x faster with AgentDB backend
7. **Template Validation**: Verdict judgment with confidence scoring
8. **Cross-Domain Transfer**: Transfer learning between related domains
9. **Meta-Learning**: Learn about when to apply patterns

### 📊 Performance Characteristics

- **Pattern Search**: 150x faster (100µs vs 15ms)
- **Memory Distillation**: <50ms for 100 patterns
- **Trajectory Judgment**: <5ms
- **Batch Operations**: 500x faster

### 🎯 Recommended Template Generation Workflow

```typescript
// 1. Record successful execution
await rb.recordExperience({
  task: 'adaptive-topology-selection',
  approach: 'hierarchical-for-complex-api',
  outcome: { success: true, metrics: {...} },
  context: { complexity: 'high', domain: 'backend' }
});

// 2. After multiple successes, distill into template
const experiences = await rb.retrieveWithReasoning(embedding, {
  domain: 'topology-selection',
  k: 100,
  optimizeMemory: true
});

// 3. Store as reusable template
await memory.store('topology-template-complex-api', {
  pattern: 'hierarchical',
  confidence: 0.95,
  sample_size: 100
}, 'knowledge', { confidence: 0.95 });

// 4. Future use
const template = await rb.recommendStrategy('topology-selection', {
  complexity: 'high',
  domain: 'backend'
});
```

### ❌ Features NOT Found in Skills

- **Automatic template generation from swarm completion** (mentioned but no API exposed)
- **Template versioning** (not mentioned)
- **Template marketplace** (not mentioned)
- **Template inheritance/composition** (associations exist, but not explicit composition)

---

## Conclusion

ReasoningBank provides comprehensive support for learning from completed processes and creating reusable templates through:

1. **Trajectory tracking** of step-by-step execution paths
2. **Memory distillation** to consolidate patterns
3. **Hierarchical abstraction** from concrete to principles
4. **Transfer learning** across domains
5. **Meta-learning** about pattern applicability

**The primary gap** is the lack of explicit automation for "template generation from completed adaptive queen executions." While all the building blocks exist (`recordExperience`, `distillMemories`, `insertPattern`), there's no documented workflow specifically for "after adaptive queen completes task X with topology Y, automatically generate template recommending topology Y for similar tasks."

**Recommendation**: Create custom automation that:
1. Hooks into adaptive queen completion
2. Extracts trajectory + decision data
3. Uses `distillMemories()` to consolidate
4. Stores as `knowledge` type with high confidence
5. Makes available via `recommendStrategy()` for future tasks
