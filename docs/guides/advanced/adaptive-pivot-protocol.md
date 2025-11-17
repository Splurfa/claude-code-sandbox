# Adaptive Pivot Protocol

**Document Type**: Advanced Pattern Guide
**Audience**: Users implementing mid-task complexity detection and pivoting
**Source**: Integrated from `inbox/assistant/2025-11-16-hive-mind-investigation/2-decision-framework/adaptive-pivot.md`

---

## Core Problem

**"What happens when a task initially seems simple but proves harder than expected?"**

**Example**: Comparing two user guides that turn out to contain advanced rocket engineering or nuclear physics.

---

## The Gap in Current Framework

### Problem

No formalized "mid-task pivot protocol" when complexity exceeds initial assessment.

**Current Behavior**:
- Start with simple approach
- Discover complexity mid-execution
- Often push through with surface analysis (risky)
- No formal checkpoints or confidence monitoring

**Better Behavior**:
- Recognize complexity threshold
- STOP immediately
- Explain what changed
- Recommend agent approach
- Let user decide quality vs. speed

---

## Recognition Triggers

### 1. Domain Expertise Exceeds Capability

**Indicators**:
- Technical concepts you can't validate
- Specialized knowledge required
- Need to verify calculations/equations
- Safety-critical information

**Example**: Rocket fuel oxidizer ratios, nuclear decay calculations

### 2. Confidence Drops Below Threshold

**Pattern**:
- Initial assessment: 90% confident
- Reality check: 30% confident
- **→ TRIGGER PIVOT**

**Calculation**:
```javascript
const confidenceDrop = initialConfidence - currentConfidence;
const shouldPivot = confidenceDrop > 0.5; // 50+ percentage point drop
```

### 3. Stakeholder Risk Too High

**Assessment**:
- Wrong analysis has serious consequences
- Safety implications
- Financial impact
- Regulatory compliance

**Risk Levels**:
- **Low**: Documentation preferences, UI choices
- **Medium**: Feature implementation, API design
- **High**: Safety systems, financial calculations, security protocols

### 4. Multiple Unknown Unknowns

**Indicators**:
- Need to look up terminology (>3 lookups)
- Cross-references required to validate
- Concepts requiring research
- Can't verify technical accuracy

**Threshold**:
```javascript
const unknownTerms = countTermsRequiringLookup(content);
const shouldPivot = unknownTerms > 3;
```

---

## Meta-Cognitive Checkpoints

### Checkpoint 1: After Initial Read

**Question**: "Do I understand core concepts well enough to judge?"

**Decision Tree**:
```
Can I explain this to a colleague? ───YES──> Continue
         │
        NO
         │
    Consider pivot
```

**Implementation**:
```javascript
function checkpointInitialRead(content, domain) {
  const comprehension = assessComprehension(content);
  const confidence = calculateConfidence(comprehension, domain);

  if (confidence < 0.8) {
    return {
      shouldContinue: false,
      reason: "Insufficient comprehension of core concepts",
      confidence: confidence,
      recommendation: "Pivot to specialist agents"
    };
  }

  return { shouldContinue: true, confidence: confidence };
}
```

### Checkpoint 2: During Analysis

**Question**: "Am I finding terms/concepts I need to look up?"

**Threshold**: >3 lookups needed → Consider pivot

**Implementation**:
```javascript
function checkpointDuringAnalysis(lookupCount, confidenceScore) {
  if (lookupCount > 3 || confidenceScore < 0.7) {
    return {
      shouldPivot: true,
      reason: `${lookupCount} unknown terms detected, confidence at ${confidenceScore}`,
      recommendation: "Spawn domain specialists"
    };
  }

  return { shouldPivot: false };
}
```

### Checkpoint 3: Before Delivering

**Question**: "Would I bet my reputation on this assessment?"

**Test**: Reputation bet
- If NO → STOP and pivot

**Implementation**:
```javascript
function checkpointPreDelivery(analysis, confidence) {
  const reputationBet = wouldBetReputation(analysis, confidence);

  if (!reputationBet) {
    return {
      shouldDeliver: false,
      reason: "Insufficient confidence to stake reputation",
      confidence: confidence,
      action: "STOP - Request specialist review or pivot to agents"
    };
  }

  return { shouldDeliver: true };
}

function wouldBetReputation(analysis, confidence) {
  // Reputation threshold: 0.85 (85% confidence minimum)
  return confidence >= 0.85 && allClaimsValidated(analysis);
}
```

---

## Transparency Framework

### When Hitting Pivot Trigger

**5-Step Protocol**:

1. **STOP immediately** - Don't continue bad path
2. **Explain what changed** - "I initially thought X, but I'm seeing Y"
3. **Show limitations** - "I can't validate these equations"
4. **Offer options** - Agent approach vs. limited scope vs. user review
5. **Let user decide** - Don't assume what they need

### Example Communication Template

```markdown
I initially assessed this as a simple comparison task (confidence: 90%).

However, I've discovered advanced aerospace engineering concepts including
fuel oxidizer ratios and thrust vector control equations.

My confidence has dropped to 30% because I cannot validate technical accuracy
of these calculations.

Options:
1. Surface-level comparison only (2 min, limited technical value)
2. Spawn aerospace engineering specialists (5 min, comprehensive analysis)
3. Flag technical sections for your expert review

Which approach would you prefer?
```

---

## Current Weaknesses (To Address)

1. **No formal confidence monitoring** during execution
2. **Sunk cost bias** - Once started, feels wasteful to stop
3. **Overconfidence** - Can usually give *some* answer
4. **No built-in checkpoints** in framework
5. **Worried about seeming uncertain** to user

---

## What Should Happen

### Example: Rocket Engine Guides Comparison

**❌ Bad Approach**:
- Compare based on writing style, organization, diagrams
- Miss fatal error in fuel mixture ratio
- Miss that "confusing" section is critical safety info
- Recommend wrong guide → Bad outcome

**✅ Good Approach**:

1. **Start reading** - Initial assessment looks simple
2. **Notice complexity** - Advanced aerospace engineering concepts detected
3. **STOP** - "I see fuel oxidizer ratios, thrust vector control, combustion chamber pressure calculations"
4. **Explain limitation** - "I can do surface comparison but cannot verify technical accuracy"
5. **Offer options**:
   - Surface comparison only (2 min, limited value)
   - Spawn aerospace engineering agents (5 min, comprehensive)
   - Flag technical sections for user expert review
6. **User decides** - Which approach fits their needs

---

## Integration with Hive-Mind

### Using Adaptive Queen

**Perfect Match**: Adaptive queen **IS** the pivot protocol implementation.

**Configuration**:
```bash
npx claude-flow@alpha hive-mind spawn \
  "Design adaptive pivot protocol with meta-cognitive checkpoints" \
  --queen-type adaptive \
  --max-workers 8 \
  --consensus weighted
```

**Why Adaptive Queen**:
- Monitors worker confidence in real-time
- Auto-scales specialists when complexity discovered
- Demonstrates the exact pattern we're formalizing
- Learns successful pivot patterns in collective memory

**Worker Assignment**:
1. **Meta-Cognitive Analyst** - Define confidence monitoring checkpoints
2. **Decision Framework Architect** - Design formal pivot decision tree
3. **Transparency Protocol Designer** - Create user communication templates
4. **Risk Assessment Specialist** - Map stakeholder risk categories
5. **Pattern Recognition Agent** - Identify pivot triggers from history
6. **Implementation Coder** - Prototype confidence monitoring hooks
7. **Quality Assurance Tester** - Design test scenarios
8. **Integration Reviewer** - Ensure compatibility with existing framework

---

## Implementation Example

### Confidence Monitoring Hooks

```javascript
// Pre-task confidence assessment
function preTaskConfidence(task, domain) {
  return {
    initialConfidence: 0.9, // High confidence for simple task
    domain: domain,
    complexity: assessComplexity(task),
    timestamp: Date.now()
  };
}

// Mid-task confidence checkpoint
function midTaskCheckpoint(currentState, discoveries) {
  const unknownTerms = discoveries.filter(d => d.type === 'unknown-term');
  const technicalConcepts = discoveries.filter(d => d.type === 'technical');

  let confidence = currentState.initialConfidence;

  // Reduce confidence for each unknown term
  confidence -= unknownTerms.length * 0.15;

  // Reduce confidence for technical concepts
  confidence -= technicalConcepts.length * 0.20;

  const confidenceDrop = currentState.initialConfidence - confidence;

  return {
    currentConfidence: Math.max(0, confidence),
    confidenceDrop: confidenceDrop,
    shouldPivot: confidenceDrop > 0.5,
    reason: `Discovered ${unknownTerms.length} unknown terms, ${technicalConcepts.length} technical concepts`,
    timestamp: Date.now()
  };
}

// Pre-delivery confidence verification
function preDeliveryCheck(analysis, confidence) {
  const reputationThreshold = 0.85;
  const canDeliver = confidence >= reputationThreshold;

  return {
    canDeliver: canDeliver,
    confidence: confidence,
    action: canDeliver ? 'DELIVER' : 'PIVOT',
    recommendation: canDeliver ? null : 'Request specialist review or spawn domain experts',
    timestamp: Date.now()
  };
}
```

### Pivot Trigger Detection

```javascript
class PivotTriggerDetector {
  constructor(initialConfidence, domain) {
    this.initialConfidence = initialConfidence;
    this.currentConfidence = initialConfidence;
    this.domain = domain;
    this.unknownTerms = [];
    this.discoveries = [];
  }

  addDiscovery(term, type, description) {
    this.discoveries.push({
      term: term,
      type: type,
      description: description,
      timestamp: Date.now()
    });

    if (type === 'unknown-term') {
      this.unknownTerms.push(term);
      this.currentConfidence -= 0.15;
    } else if (type === 'technical-concept') {
      this.currentConfidence -= 0.20;
    }

    return this.checkPivotTrigger();
  }

  checkPivotTrigger() {
    const confidenceDrop = this.initialConfidence - this.currentConfidence;
    const unknownTermCount = this.unknownTerms.length;

    const shouldPivot = (
      confidenceDrop > 0.5 ||     // 50+ percentage point drop
      unknownTermCount > 3 ||     // More than 3 unknown terms
      this.currentConfidence < 0.3 // Below minimum threshold
    );

    if (shouldPivot) {
      return {
        shouldPivot: true,
        reason: this.buildPivotReason(confidenceDrop, unknownTermCount),
        currentConfidence: this.currentConfidence,
        recommendations: this.buildRecommendations()
      };
    }

    return { shouldPivot: false };
  }

  buildPivotReason(drop, unknownTerms) {
    const reasons = [];

    if (drop > 0.5) {
      reasons.push(`Confidence dropped ${(drop * 100).toFixed(0)}%`);
    }
    if (unknownTerms > 3) {
      reasons.push(`${unknownTerms} unknown technical terms detected`);
    }
    if (this.currentConfidence < 0.3) {
      reasons.push(`Current confidence below minimum threshold (${(this.currentConfidence * 100).toFixed(0)}%)`);
    }

    return reasons.join('; ');
  }

  buildRecommendations() {
    return {
      option1: {
        type: "limited-scope",
        description: "Continue with surface-level analysis only",
        timeEstimate: "2-3 minutes",
        limitations: "Cannot verify technical accuracy"
      },
      option2: {
        type: "spawn-specialists",
        description: "Spawn domain specialists for comprehensive analysis",
        timeEstimate: "5-10 minutes",
        specialists: this.identifyNeededSpecialists()
      },
      option3: {
        type: "user-review",
        description: "Flag technical sections for user expert review",
        sections: this.discoveries.map(d => d.term)
      }
    };
  }

  identifyNeededSpecialists() {
    // Based on discovered technical terms, identify specialists
    const specialistMap = {
      'aerospace': ['fuel oxidizer', 'thrust vector', 'combustion chamber'],
      'nuclear': ['decay rate', 'half-life', 'criticality'],
      'electrical': ['voltage', 'current', 'impedance'],
      'chemistry': ['reaction rate', 'molarity', 'activation energy']
    };

    const needed = [];

    for (const [domain, keywords] of Object.entries(specialistMap)) {
      const hasKeyword = keywords.some(kw =>
        this.unknownTerms.some(term => term.toLowerCase().includes(kw))
      );

      if (hasKeyword) {
        needed.push(domain);
      }
    }

    return needed.length > 0 ? needed : ['general-technical'];
  }
}
```

---

## Expected Deliverables

### 1. Formal Protocol Specification

**File**: `docs/protocols/adaptive-pivot-protocol.md`

**Contents**:
- Recognition triggers catalog
- Meta-cognitive checkpoints
- Transparency communication templates
- Decision framework flowchart
- Integration with existing agent framework

### 2. Implementation Code

**File**: `code/pivot-confidence-monitoring.js`

**Contents**:
- Confidence scoring logic
- Checkpoint integration
- Trigger detection algorithms
- User communication helpers

### 3. Test Suite

**File**: `tests/pivot-protocol.test.js`

**Contents**:
- Rocket guide scenario test
- Confidence threshold validation
- Trigger detection tests
- Communication template tests

### 4. Integration Guide

**File**: `docs/integration/pivot-integration.md`

**Contents**:
- How to integrate with agent framework
- Backward compatibility analysis
- Migration path from current behavior
- Configuration options

---

## Related Concepts

- **Confidence thresholds** - When to trust your analysis
- **Meta-cognitive monitoring** - Self-awareness during execution
- **Sunk cost fallacy avoidance** - Don't continue bad paths
- **Transparent limitation acknowledgment** - Honest about capabilities
- **User-driven quality vs. speed trade-offs** - Let user decide priorities

---

## Implementation Status

**Problem**: ✅ Well-defined
**Solution**: 🟡 Design pending (ideal for hive-mind adaptive queen)
**Integration**: 🔵 Requires hive-mind coordination capabilities

**Recommended Next Step**: Use adaptive queen to design this protocol, as the queen's behavior exemplifies the pattern we're formalizing.

---

## Related Documentation

**Core Concepts**:
- [Hive-Mind System Overview](../concepts/hive-mind-system.md) - Adaptive queen capabilities
- [Choose Coordination Approach](../how-to/choose-coordination-approach.md) - When to use adaptive queen

**Reference**:
- [Hive-Mind Capability Mapping](../reference/hive-mind-capability-mapping.md) - Adaptive pivot example
- [Hive-Mind Quick Reference](../reference/hive-mind-quick-reference.md) - Commands

**Practical**:
- [Zero-Risk Execution Pattern](../how-to/zero-risk-execution-pattern.md) - Safe execution guide

---

**Last Updated**: 2025-11-16
**Status**: Design pattern documented, implementation pending
