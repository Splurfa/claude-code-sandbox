# Consensus Mechanisms Guide

## Overview

The consensus system coordinates multi-agent decisions using three algorithms: majority, weighted, and byzantine. Built on Phase 1's memory coordination infrastructure.

## Algorithms

### 1. Majority (Simple Democracy)
- **Pass threshold**: > 50% approval
- **Use case**: Routine decisions with equal agents
- **Example**: 3 agents, need 2+ approvals

```javascript
const { requestConsensus, ALGORITHMS } = require('./consensus');

const result = await requestConsensus(
  'Deploy to production',
  ['queen', 'worker-1', 'worker-2'],
  ALGORITHMS.MAJORITY
);
// Result: { passed: true, approvals: 2, total: 3, percentage: "66.7" }
```

### 2. Weighted (Queen Authority)
- **Pass threshold**: > 50% of total weight
- **Queen weight**: 3x
- **Use case**: Strategic decisions requiring queen oversight
- **Example**: Queen (3) + 2 workers (1 each) = 5 total weight, need 2.5+

```javascript
const result = await requestConsensus(
  'Change core architecture',
  ['queen', 'worker-1', 'worker-2'],
  ALGORITHMS.WEIGHTED
);
// Queen approval (3) + 1 worker (1) = 4 weight (passes)
```

### 3. Byzantine (Fault Tolerance)
- **Pass threshold**: ≥ 2/3 approval
- **Use case**: Critical decisions requiring strong consensus
- **Example**: 6 agents, need 4+ approvals

```javascript
const result = await requestConsensus(
  'Security policy change',
  ['queen', 'security-1', 'security-2', 'worker-1', 'worker-2', 'worker-3'],
  ALGORITHMS.BYZANTINE
);
// Need 4/6 approvals (66.7%)
```

## Algorithm Selection Guide

| Decision Type | Algorithm | Rationale |
|---------------|-----------|-----------|
| Routine tasks | Majority | Fast, equal voices |
| Strategic changes | Weighted | Queen oversight needed |
| Security/critical | Byzantine | High confidence required |
| Infrastructure | Byzantine | Fault tolerance critical |
| Experiments | Majority | Low risk, democratic |
| Production deploys | Weighted | Queen veto power |

## Usage Patterns

### CLI Usage

```bash
# Majority vote
node consensus.js vote "Deploy feature-x" queen worker-1 worker-2

# Weighted vote (via environment variable)
CONSENSUS_ALGORITHM=weighted node consensus.js vote "Refactor core system" queen architect worker-1

# Byzantine vote
CONSENSUS_ALGORITHM=byzantine node consensus.js vote "Change security policy" queen security-1 security-2 worker-1
```

### Programmatic Usage

```javascript
const { requestConsensus, ALGORITHMS } = require('./consensus');

async function makeDecision(decision, agents, algorithm) {
  const result = await requestConsensus(decision, agents, algorithm);

  if (result.passed) {
    console.log(`✅ Decision approved: ${result.percentage}% consensus`);
    // Execute decision
  } else {
    console.log(`❌ Decision rejected: ${result.percentage}% consensus`);
    // Handle rejection
  }

  return result;
}
```

## Integration with Captain's Log

Consensus decisions are automatically logged:

```javascript
const { requestConsensus } = require('./consensus');
const { logDecision } = require('./captains-log');

const result = await requestConsensus(decision, agents, algorithm);

if (result.passed) {
  logDecision(decision, `Consensus: ${result.percentage}% (${result.algorithm})`);
}
```

## Voting Workflow

1. **Request consensus** - Queen initiates vote
2. **Agents vote** - Each agent records vote in memory
3. **Calculate result** - Apply algorithm rules
4. **Log outcome** - Record in Captain's Log
5. **Execute decision** - If passed

## Memory Storage

Consensus records stored in memory:

```javascript
{
  "decision": "Deploy to production",
  "algorithm": "weighted",
  "agents": [
    { "id": "queen", "vote": "approve", "weight": 3 },
    { "id": "worker-1", "vote": "approve", "weight": 1 },
    { "id": "worker-2", "vote": "reject", "weight": 1 }
  ],
  "result": {
    "passed": true,
    "approvalWeight": 4,
    "totalWeight": 5,
    "percentage": "80.0"
  },
  "timestamp": "2025-11-14T10:30:00Z",
  "sessionId": "session-20251113-211159-hive-mind-setup"
}
```

## Timeout Handling

Default timeout: 30 seconds

```javascript
const result = await requestConsensus(
  decision,
  agents,
  algorithm,
  60000  // 60 second timeout
);
```

If timeout reached:
- Count votes received
- Apply algorithm to partial results
- Log timeout in Captain's Log

## Best Practices

1. **Choose algorithm by risk** - Higher risk = stronger consensus
2. **Include queen for strategic decisions** - Use weighted algorithm
3. **Document rationale** - Log why algorithm was chosen
4. **Respect outcomes** - Don't retry immediately if rejected
5. **Review history** - Learn from past consensus patterns

## Example Scenarios

### Scenario 1: Deploy Feature
- **Decision**: Deploy new feature to production
- **Algorithm**: Weighted (queen oversight)
- **Agents**: Queen, DevOps, QA
- **Outcome**: Queen (3) + DevOps (1) = 4/5 weight → Pass

### Scenario 2: Change Security Policy
- **Decision**: Update authentication requirements
- **Algorithm**: Byzantine (critical system)
- **Agents**: Queen, Security-1, Security-2, Architect
- **Outcome**: Need 3/4 approvals → Pass

### Scenario 3: Experiment with Tool
- **Decision**: Try new testing framework
- **Algorithm**: Majority (low risk)
- **Agents**: Queen, Coder-1, Coder-2, Tester
- **Outcome**: Need 3/4 approvals → Pass

## Integration with Phase 1

Consensus uses Phase 1 systems:
- **always-on-hooks.js** - Auto-store votes in memory
- **learning-integration.js** - Learn from consensus outcomes
- **session-auto-init.js** - Link to session context

## Consensus History

Query past decisions:

```javascript
const { getConsensusHistory } = require('./consensus');

const history = getConsensusHistory(10); // Last 10 decisions
history.forEach(record => {
  console.log(`${record.timestamp}: ${record.decision} - ${record.result.passed ? 'PASS' : 'FAIL'}`);
});
```

## Error Handling

```javascript
try {
  const result = await requestConsensus(decision, agents, algorithm);
} catch (error) {
  console.error('Consensus failed:', error.message);
  // Fall back to queen decision or retry
}
```
