# Prompt Improver Skill - Optimization Recommendations

**Session**: session-20251118-120615-prompt-improver-skill
**Date**: 2025-11-18
**Status**: ⚠️ **CONDITIONAL - PENDING IMPLEMENTATION**

---

## Executive Summary

This document provides optimization recommendations for the prompt-improver skill **once it is actually implemented**. Currently, the skill does not exist, so these are **forward-looking recommendations** based on the requirements.

---

## Performance Optimization Recommendations

### 1. Token Efficiency (HIGH PRIORITY)

**Context**: This is a high-frequency skill that will be invoked often. Token usage must be minimized.

#### Recommendation 1.1: Minimize SKILL.md Size

**Target**: Keep total skill documentation under 800 lines

**Strategy**:
```markdown
# SKILL.md Structure (Token-Optimized)

## What This Skill Does (50 lines)
- Brief description
- Key capabilities
- When to use

## Quick Start (100 lines)
- 60-second usage example
- Common commands
- Immediate value

## Mode Reference (200 lines)
- 4 modes with brief descriptions
- Transition criteria
- Example outputs

## Integration Guide (150 lines)
- Memory coordination
- Captain's Log integration
- Tutor-mode coordination

## Troubleshooting (100 lines)
- Common issues
- Quick fixes
- FAQ

## Advanced (200 lines)
- Progressive disclosure for power users
- Edge cases
- Customization
```

**Rationale**: tutor-mode is 1,313 lines (acceptable for low-frequency skill). Prompt-improver will be invoked more often, so should target 60% of that size (~800 lines).

---

#### Recommendation 1.2: Progressive Disclosure in Mode Definitions

**Current Anti-Pattern** (if implemented naively):
```json
{
  "silent": {
    "description": "Full 500-word explanation of silent mode...",
    "examples": ["20 examples with full context..."],
    "when_to_use": "Extensive documentation..."
  }
}
```

**Optimized Pattern**:
```json
{
  "modes": {
    "silent": {
      "name": "Silent Mode",
      "desc": "No intervention",
      "threshold": 0,
      "next": "gentle"
    },
    "gentle": {
      "name": "Gentle Guidance",
      "desc": "Subtle hints",
      "threshold": 3,
      "next": "moderate"
    }
  }
}
```

**Token Savings**: ~70% reduction by keeping mode definitions compact

---

#### Recommendation 1.3: Memory-First Documentation

**Pattern**: Store extensive examples in memory, not in SKILL.md

```javascript
// On first load: Store comprehensive examples in memory
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "mode-examples",
  namespace: "prompt-improver",
  ttl: 2592000, // 30 days
  value: JSON.stringify({
    gentle: [
      "Example 1: Spawning agents...",
      "Example 2: Memory coordination...",
      // 50+ examples
    ],
    moderate: [...],
    prescriptive: [...]
  })
})

// In SKILL.md: Reference memory instead of embedding examples
```

**Token Savings**: ~1000 tokens per invocation (examples loaded from memory only when needed)

---

### 2. Mode Selection Performance

#### Recommendation 2.1: Fast-Path Mode Detection

**Optimization**: Detect mode in <50ms without complex analysis

```javascript
// Fast path: Check recent memory
const recentMode = await memory.retrieve("prompt-improver/current-mode");
if (recentMode && recentMode.timestamp > Date.now() - 300000) { // 5 min
  return recentMode.mode; // Use cached mode
}

// Slow path: Analyze user behavior (only if needed)
const interventionScore = await analyzeUserBehavior();
return selectModeByScore(interventionScore);
```

**Rationale**: Most users will stay in same mode for extended periods. Caching avoids re-analysis on every invocation.

---

#### Recommendation 2.2: Incremental Score Updates

**Anti-Pattern**: Recalculate full intervention score every time
```javascript
// DON'T DO THIS
function getInterventionScore() {
  // Analyze ALL past interactions
  const history = loadFullHistory(); // Expensive!
  return calculateScore(history);
}
```

**Optimized Pattern**: Update score incrementally
```javascript
// DO THIS
function updateInterventionScore(event) {
  const currentScore = memory.get("intervention-score") || 5;
  const delta = calculateDelta(event);
  const newScore = Math.max(0, Math.min(10, currentScore + delta));
  memory.set("intervention-score", newScore);
  return newScore;
}
```

**Performance Gain**: O(1) vs O(n) complexity

---

### 3. Memory Schema Optimization

#### Recommendation 3.1: Denormalized Storage

**Optimized Schema**:
```json
{
  "namespace": "prompt-improver",
  "keys": {
    "user-state": {
      "description": "Single denormalized object for fast access",
      "schema": {
        "mode": "string",
        "score": "number",
        "lastTransition": "timestamp",
        "patterns": {
          "successful": ["array"],
          "struggling": ["array"]
        },
        "velocity": "string"
      },
      "ttl": 2592000
    }
  }
}
```

**Rationale**:
- Single memory read gets all needed data
- No joins or aggregations needed
- Fast mode selection (<10ms)

**Alternative (Slower)**:
```json
// DON'T split into multiple keys requiring multiple reads
{
  "keys": {
    "current-mode": {...},
    "intervention-score": {...},
    "successful-patterns": {...},
    "struggling-areas": {...}
  }
}
```

---

#### Recommendation 3.2: TTL Strategy

**Recommendation**:
```javascript
{
  "user-state": {
    ttl: 2592000  // 30 days - long-term progress
  },
  "session-cache": {
    ttl: 3600  // 1 hour - temporary state
  },
  "mode-examples": {
    ttl: 2592000  // 30 days - static content
  }
}
```

**Rationale**:
- User state persists across sessions
- Session cache prevents stale data
- Examples rarely change

---

### 4. Integration Efficiency

#### Recommendation 4.1: Lazy Loading with Tutor-Mode

**Anti-Pattern**: Load tutor-mode data on every invocation

**Optimized Pattern**:
```javascript
// Only load tutor data when user is in learning context
if (context.isLearning) {
  const tutorProgress = await loadTutorData();
  return enhanceWithTutorContext(tutorProgress);
}
// Otherwise, skip tutor integration
return basicModeSelection();
```

---

#### Recommendation 4.2: Captain's Log - Batched Writes

**Anti-Pattern**: Write to Captain's Log on every mode transition
```javascript
// DON'T
function onModeChange(newMode) {
  appendToCaptainsLog(`Mode changed to ${newMode}`);
}
```

**Optimized Pattern**: Batch log writes every 10 events or 5 minutes
```javascript
let logBuffer = [];

function onModeChange(newMode) {
  logBuffer.push({event: "mode-change", mode: newMode, ts: Date.now()});

  if (logBuffer.length >= 10 || timeSinceLastFlush > 300000) {
    flushLogBuffer();
  }
}
```

**Performance Gain**: 90% reduction in write operations

---

## Architectural Optimization

### 5. Mode Transition Algorithm

#### Recommendation 5.1: State Machine Design

**Optimized State Machine**:
```
┌────────┐  score≥3   ┌────────┐  score≥6   ┌──────────┐  score≥9   ┌──────────────┐
│ Silent ├───────────→│ Gentle ├───────────→│ Moderate ├───────────→│ Prescriptive │
└───┬────┘            └───┬────┘            └────┬─────┘            └──────┬───────┘
    │                     │                      │                         │
    │  score<1            │  score<3             │  score<5                │  score<7
    │◄────────────────────┴──────────────────────┴─────────────────────────┘
    │
    └─→ (never drop below silent)
```

**Implementation**:
```javascript
const transitions = {
  silent:       { threshold: 0,  next: "gentle" },
  gentle:       { threshold: 3,  next: "moderate", prev: "silent" },
  moderate:     { threshold: 6,  next: "prescriptive", prev: "gentle" },
  prescriptive: { threshold: 9,  prev: "moderate" }
};

function selectMode(score) {
  if (score >= 9) return "prescriptive";
  if (score >= 6) return "moderate";
  if (score >= 3) return "gentle";
  return "silent";
}
```

**Complexity**: O(1) mode selection

---

#### Recommendation 5.2: Hysteresis to Prevent Mode Thrashing

**Problem**: User oscillates between scores 5.9 and 6.1, causing frequent mode switches

**Solution**: Add hysteresis (dead zone)
```javascript
function shouldTransition(currentMode, newScore, oldScore) {
  const threshold = transitions[currentMode].threshold;
  const hysteresis = 0.5; // Dead zone

  // Upgrade: Must exceed threshold + hysteresis
  if (newScore > oldScore && newScore > threshold + hysteresis) {
    return true;
  }

  // Downgrade: Must drop below threshold - hysteresis
  if (newScore < oldScore && newScore < threshold - hysteresis) {
    return true;
  }

  return false;
}
```

**Result**: More stable mode selection, fewer transitions

---

### 6. Intervention Threshold Configuration

#### Recommendation 6.1: Conservative Default Thresholds

**Recommended Thresholds** (based on tutor-mode analysis):

```json
{
  "thresholds": {
    "silent": 0,
    "gentle": 4,      // Was 3, raised to be less aggressive
    "moderate": 7,    // Was 6, raised to allow more exploration
    "prescriptive": 9 // Unchanged
  },
  "hysteresis": 0.5,
  "autoDeescalate": true,
  "deescalateAfter": 3600000  // 1 hour without issues → drop one level
}
```

**Rationale**:
- Higher thresholds = less aggressive intervention
- Users should spend most time in silent/gentle modes
- Auto-deescalate rewards good performance

---

#### Recommendation 6.2: User Preference Override

**Feature**: Let users manually set their preferred mode

```javascript
// User can override automatic mode selection
const userPreference = await memory.retrieve("prompt-improver/user-pref-mode");

if (userPreference) {
  return userPreference; // Respect user choice
}

// Otherwise, use automatic selection
return automaticModeSelection(interventionScore);
```

**Commands**:
```
/prompt-mode silent       # User wants no intervention
/prompt-mode gentle       # User wants subtle hints
/prompt-mode moderate     # User wants clear guidance
/prompt-mode prescriptive # User wants step-by-step help
/prompt-mode auto         # Return to automatic selection
```

---

## Testing & Validation Recommendations

### 7. Performance Benchmarks

#### Recommendation 7.1: Mode Selection Latency

**Target**: <50ms from invocation to mode selection

**Benchmark**:
```javascript
const start = Date.now();
const mode = await selectMode(context);
const latency = Date.now() - start;

assert(latency < 50, `Mode selection too slow: ${latency}ms`);
```

---

#### Recommendation 7.2: Memory Access Performance

**Target**: <10ms per memory operation

**Benchmark**:
```javascript
// Test denormalized schema performance
const start = Date.now();
const state = await memory.retrieve("prompt-improver/user-state");
const latency = Date.now() - start;

assert(latency < 10, `Memory access too slow: ${latency}ms`);
```

---

### 8. Quality Metrics

#### Recommendation 8.1: User Satisfaction Tracking

**Metric**: Percentage of manual mode overrides

```javascript
const metrics = {
  autoModeSelections: 100,
  manualOverrides: 5,
  satisfactionRate: (95 / 100) * 100 // 95%
};

// Target: >90% satisfaction (users accept auto mode selection)
assert(metrics.satisfactionRate > 90);
```

---

#### Recommendation 8.2: Intervention Effectiveness

**Metric**: Problem resolution rate after intervention

```javascript
const metrics = {
  interventionsTriggered: 20,
  problemsResolved: 18,
  effectivenessRate: (18 / 20) * 100 // 90%
};

// Target: >80% effectiveness
assert(metrics.effectivenessRate > 80);
```

---

## Implementation Checklist

### Phase 1: Foundation (Must-Haves)

- [ ] Create `.claude/skills/prompt-improver/` directory
- [ ] Write token-optimized SKILL.md (<800 lines)
- [ ] Create denormalized memory schema
- [ ] Implement fast-path mode selection (<50ms)
- [ ] Add YAML frontmatter
- [ ] Install to correct location

### Phase 2: Core Functionality (Must-Haves)

- [ ] Implement state machine with hysteresis
- [ ] Add conservative default thresholds (4/7/9)
- [ ] Implement incremental score updates
- [ ] Add mode caching (5-minute TTL)
- [ ] Create modes.json with minimal definitions

### Phase 3: Integration (Should-Haves)

- [ ] Lazy-load tutor-mode data
- [ ] Batch Captain's Log writes
- [ ] Add user preference override
- [ ] Memory-first example storage
- [ ] Session-aware context detection

### Phase 4: Optimization (Nice-to-Haves)

- [ ] Auto-deescalation after 1 hour success
- [ ] User satisfaction tracking
- [ ] Intervention effectiveness metrics
- [ ] Performance benchmarks
- [ ] A/B testing framework for thresholds

---

## Risk Assessment

### High-Risk Areas

1. **Mode Thrashing** (Likelihood: HIGH, Impact: HIGH)
   - **Risk**: User gets stuck in mode oscillation
   - **Mitigation**: Implement hysteresis (Recommendation 5.2)

2. **Over-Intervention** (Likelihood: MEDIUM, Impact: HIGH)
   - **Risk**: Skill is too aggressive, annoys users
   - **Mitigation**: Conservative thresholds (Recommendation 6.1)

3. **Performance Degradation** (Likelihood: MEDIUM, Impact: MEDIUM)
   - **Risk**: Slow mode selection impacts user experience
   - **Mitigation**: Fast-path caching (Recommendation 2.1)

### Medium-Risk Areas

4. **Memory Bloat** (Likelihood: MEDIUM, Impact: LOW)
   - **Risk**: Memory grows unbounded
   - **Mitigation**: Appropriate TTLs (Recommendation 3.2)

5. **Integration Conflicts** (Likelihood: LOW, Impact: MEDIUM)
   - **Risk**: Conflicts with tutor-mode
   - **Mitigation**: Lazy loading (Recommendation 4.1)

---

## Estimated Performance Gains

If all recommendations are implemented:

| Metric | Baseline (Naive) | Optimized | Improvement |
|--------|-----------------|-----------|-------------|
| Mode selection latency | 200ms | <50ms | **75% faster** |
| Memory reads per invocation | 5 | 1 | **80% reduction** |
| Token usage per invocation | 2000 | 800 | **60% reduction** |
| Captain's Log writes | 1 per event | 1 per 10 events | **90% reduction** |
| Mode thrashing incidents | 10% | <2% | **80% reduction** |

**Total Expected Improvement**: 60-80% across all metrics

---

## Conclusion

These optimizations are **conditional on the skill being implemented first**. Once the basic implementation is complete, apply these recommendations in phases:

1. **Phase 1 & 2**: Critical for deployment (token efficiency, fast mode selection)
2. **Phase 3**: Important for user experience (integration, preferences)
3. **Phase 4**: Valuable for long-term refinement (metrics, A/B testing)

**Estimated Implementation Time**:
- Phase 1-2: 2-3 hours (part of initial implementation)
- Phase 3: 1-2 hours (post-deployment)
- Phase 4: 2-4 hours (ongoing refinement)

---

**Created By**: Code Review Agent (reviewer)
**Timestamp**: 2025-11-18T12:45:00Z
**Status**: Forward-looking recommendations (skill not yet implemented)
