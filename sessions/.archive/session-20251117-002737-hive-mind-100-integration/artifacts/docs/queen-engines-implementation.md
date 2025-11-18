# Queen Behavior Engines Implementation

## Overview

Implemented functional queen behavior engines that make queen types (strategic, tactical, adaptive) more than just labels - they now have distinct decision-making patterns, state machines, and auto-selection logic.

## Components Implemented

### 1. Strategic Queen Engine (`strategic-engine.js`)

**Characteristics:**
- **Decision Style**: Analytical
- **Planning Horizon**: Long-term (30+ days)
- **Consensus Preference**: Byzantine (fault-tolerant)
- **Risk Tolerance**: Low
- **Focus**: Architecture, quality, comprehensive planning

**Key Features:**
- Comprehensive analysis with deep strategic assessment
- Byzantine consensus for critical decisions requiring 67% supermajority
- Extensive quality gates (90% test coverage, comprehensive documentation)
- Multi-phase planning (research, design, implementation, validation, deployment)
- Risk mitigation strategies with continuous monitoring
- State machine with 8 states (analyzing, planning, consulting, deciding, delegating, monitoring, adjusting, refining)

**Best For:**
- Complex architectural decisions
- High-risk projects
- Long-term platform development
- Infrastructure changes
- Projects requiring comprehensive quality oversight

### 2. Tactical Queen Engine (`tactical-engine.js`)

**Characteristics:**
- **Decision Style**: Pragmatic
- **Planning Horizon**: Short-term (1-7 days)
- **Consensus Preference**: Weighted (fast with expertise weighting)
- **Risk Tolerance**: Medium
- **Execution Speed**: Fast
- **Focus**: Rapid execution, optimization, problem-solving

**Key Features:**
- Quick assessment for rapid decision-making (30s vs 5min for strategic)
- Immediate action for critical situations
- Weighted consensus with single voting round (60% threshold, 1min timeout)
- Minimal but sufficient quality gates (70% test coverage)
- Fast execution plan with 2-8 hour iterations
- Quick wins identification and optimization
- State machine with 8 states (ready, assessing, deciding, executing, delegating, monitoring, adjusting, escalating)

**Best For:**
- Urgent bug fixes
- Feature implementation with tight deadlines
- Performance optimizations
- Well-understood problems
- Time-critical decisions

### 3. Adaptive Queen Engine (`adaptive-engine.js`)

**Characteristics:**
- **Decision Style**: Flexible
- **Planning Horizon**: Adaptive (adjusts based on context)
- **Consensus Preference**: Adaptive (changes based on situation)
- **Risk Tolerance**: Adaptive
- **Adaptability**: 1.0 (maximum)
- **Focus**: Learning, pattern recognition, context-awareness

**Key Features:**
- Learning from context and historical patterns
- Dynamic consensus algorithm selection (weighted for urgency, byzantine for complexity, raft for scale)
- Auto-scaling based on predicted load
- Pattern recognition and outcome recording
- Adaptive strategy adjustment based on real-time feedback
- Performance prediction from historical data
- State machine with 9 states (most flexible - observing, learning, analyzing, deciding, executing, delegating, monitoring, adapting, escalating)

**Consensus Selection Logic:**
- Urgency > 0.7 → Weighted consensus (fast)
- Complexity > 0.7 OR critical → Byzantine consensus (fault-tolerant)
- Scale > 0.7 → Raft consensus (scalable)
- Default → Simple majority

**Auto-Scaling Triggers:**
- Predicted load > current * 1.5 → Scale up (2x agents)
- Predicted load < current * 0.5 → Scale down (0.7x agents)
- Stable load → Maintain

**Best For:**
- Research and exploration projects
- High innovation/uncertainty
- Evolving requirements
- Projects with unpredictable complexity
- Learning from past experiences

### 4. Queen Selector (`queen-selector.js`)

**Auto-Selection Algorithm:**

Calculates fitness scores for each queen type based on project characteristics:

**Strategic Score** (favors):
- High complexity (> 0.7): +0.25
- Low urgency (< 0.4): +0.2
- High quality requirements (> 0.8): +0.2
- Architecture/infrastructure projects: +0.25
- High risk (> 0.7): +0.15
- Low technical debt tolerance: +0.1
- Many stakeholders (> 0.7): +0.15
- High innovation (> 0.7): +0.1

**Tactical Score** (favors):
- Low-medium complexity (< 0.6): +0.2
- High urgency (> 0.7): +0.3
- Feature/bugfix/optimization projects: +0.25
- Smaller teams (≤ 5): +0.15
- Moderate quality (0.6-0.9): +0.15
- High predictability (> 0.7): +0.2
- Moderate risk (0.3-0.7): +0.1
- Low innovation (< 0.5): +0.15

**Adaptive Score** (favors):
- Variable complexity (0.4-0.8): +0.2
- Medium urgency (0.4-0.7): +0.2
- Research/exploration/prototype projects: +0.3
- Medium teams (5-15): +0.15
- High innovation (> 0.6): +0.25
- Low predictability (< 0.5): +0.3
- Variable risk (0.4-0.8): +0.15
- Mixed quality requirements: +0.1

**Selection Logic:**
- If best score - second best < 0.15 → Choose adaptive (uncertain situation)
- Otherwise → Choose highest scoring queen

**Project Analysis:**
- Scale assessment (team size, codebase, agent count)
- Urgency (priority, deadline)
- Complexity (unknowns, dependencies, integrations)
- Project type identification
- Quality requirements
- Risk profile
- Innovation level
- Stakeholder complexity
- Technical debt
- Predictability

## State Machines

### Strategic Queen States
```
analyzing → planning → deciding → delegating → monitoring → adjusting
         ↓                                                      ↑
      consulting ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ↓
         ↓
      deciding → refining → planning
```

### Tactical Queen States
```
ready → assessing → deciding → executing → monitoring → adjusting
                       ↓                        ↓
                  delegating                escalating
                                               ↓
                                            deciding
```

### Adaptive Queen States (Most Flexible)
```
observing → learning → analyzing → deciding → executing
    ↑          ↓           ↓          ↓          ↓
    ← ← ← ← adapting ← ← ← ← ← ← ← ← ← ← ← monitoring
                ↓                          ↓
            delegating                 escalating
```

## Test Coverage

**29 tests, 100% pass rate:**

- Strategic Queen: 6 tests
  - Initialization
  - Decision-making with comprehensive analysis
  - Byzantine consensus for complex decisions
  - Quality gates definition
  - State machine transitions
  - Metrics tracking

- Tactical Queen: 6 tests
  - Initialization
  - Rapid decision-making
  - Immediate action for critical urgency
  - Weighted consensus
  - Minimal quality gates
  - Response time metrics

- Adaptive Queen: 7 tests
  - Initialization
  - Learning from context
  - Consensus algorithm selection
  - Auto-scaling strategy
  - Pattern learning over time
  - Outcome recording
  - Flexible state transitions

- Queen Selector: 7 tests
  - Strategic queen selection
  - Tactical queen selection
  - Adaptive queen selection
  - Default to adaptive when uncertain
  - Comprehensive analysis
  - Selection history tracking
  - Engine reuse

- Integration: 3 tests
  - Compatible interfaces
  - Metrics tracking
  - Distinct consensus preferences

## Integration with Existing Config

All engines integrate with `.hive-mind/config/queens.json`:
- Respects defined capabilities
- Follows decision style specifications
- Implements planning horizon requirements
- Uses adaptability scores
- Leverages specialty definitions

## Performance Characteristics

**Strategic Queen:**
- Decision time: 5-10 minutes
- Consensus timeout: 5 minutes
- Quality emphasis: Maximum (90%+ coverage)
- Resource allocation: Conservative with 20% buffer

**Tactical Queen:**
- Decision time: 30 seconds - 2 minutes
- Consensus timeout: 1 minute
- Quality emphasis: Sufficient (70%+ coverage)
- Resource allocation: Aggressive, fast execution

**Adaptive Queen:**
- Decision time: Variable (adapts to context)
- Consensus timeout: Adaptive (1-5 minutes)
- Quality emphasis: Context-dependent
- Resource allocation: Dynamic scaling

## Usage Example

```javascript
const QueenSelector = require('./queen-selector');

const selector = new QueenSelector();

// Auto-select based on project
const result = selector.selectQueen({
  projectType: 'architecture',
  agentCount: 12,
  quality: 'critical',
  priority: 'medium',
  risk: 'high'
});

console.log(result.queenType); // 'strategic'
console.log(result.rationale); // Comprehensive explanation

// Use the selected engine
const decision = await result.engine.makeDecision(context);
```

## Coordination Memory Integration

**Progress Tracking:**
- `coordination/phase1/queens/status` - Implementation status
- `coordination/phase1/queens/engines-active` - Active engines count
- `coordination/phase1/queens/completed` - Completion flag

**Decision Storage:**
Each queen stores decisions in memory for learning and coordination:
- Strategic: `swarm/queen/strategic/decisions`
- Tactical: `swarm/queen/tactical/decisions`
- Adaptive: `swarm/queen/adaptive/learning-model`

## Next Steps for Full Integration

1. **CLI Integration**: Add `npx claude-flow@alpha queen select` command
2. **Hive Mind Integration**: Wire queen engines into hive-mind initialization
3. **Consensus Execution**: Implement actual consensus algorithms (Byzantine, Raft, Weighted)
4. **Memory Persistence**: Store queen decisions and learning models in .swarm/memory.db
5. **Performance Monitoring**: Track queen performance metrics over time
6. **Auto-Tuning**: Adjust queen parameters based on outcomes

## Stock Adherence

**100% Stock-First Compliance:**
- Uses existing config/queens.json schema
- Integrates with .claude/agents/hive-mind/ personas
- Follows stock coordination patterns
- No modifications to queen configuration format
- Leverages existing memory and consensus infrastructure

## Files Created

1. `strategic-engine.js` - Strategic queen behavior engine (428 lines)
2. `tactical-engine.js` - Tactical queen behavior engine (362 lines)
3. `adaptive-engine.js` - Adaptive queen behavior engine (556 lines)
4. `queen-selector.js` - Auto-selection logic (466 lines)
5. `queen-engines.test.js` - Comprehensive test suite (409 lines)

**Total Implementation:** 2,221 lines of production code + tests

## Verification

All tests pass (29/29):
```
Test Suites: 1 passed, 1 total
Tests:       29 passed, 29 total
```

Queen behavior engines are now functional and ready for integration into the hive mind system.
