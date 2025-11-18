# Prompt Improver v2.0.0 - Developer Guide

**Version**: 2.0.0
**Date**: 2025-11-18
**Status**: Production Ready

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Module Reference](#module-reference)
4. [API Documentation](#api-documentation)
5. [Configuration](#configuration)
6. [Usage Examples](#usage-examples)
7. [Integration Patterns](#integration-patterns)
8. [Testing Guide](#testing-guide)
9. [Troubleshooting](#troubleshooting)
10. [Performance Tuning](#performance-tuning)

---

## Quick Start

### Installation

1. Copy refactored code to your skill directory:

```bash
cp -r sessions/session-1763500195-prompt-improver-refactor/artifacts/code/* \
  .claude/skills/prompt-improver/
```

2. No additional dependencies required (uses Node.js built-ins only)

3. Update your skill integration:

```javascript
const { RefactoredPromptImprover } = require('./.claude/skills/prompt-improver/prompt-improver-refactored');

const improver = new RefactoredPromptImprover({
  context7Enabled: true,
  cacheTTL: 3600000 // 1 hour
});
```

### Basic Usage

```javascript
// Analyze and improve a prompt
const result = await improver.improvePrompt(userPrompt);

if (result.shouldImprove) {
  console.log('Improvements suggested:');
  result.improvements.forEach(imp => {
    console.log(`  - ${imp.suggestion}`);
  });
}

// End session and get statistics
const summary = await improver.endSession();
console.log('Session summary:', summary);
```

---

## Architecture Overview

### System Design

```
┌─────────────────────────────────────────────────────────────┐
│  RefactoredPromptImprover (Main Orchestrator)               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 1. Enhanced Analyzer                                 │  │
│  │    ├─ Quality Dimensions (5 metrics)                │  │
│  │    ├─ Structural Completeness                       │  │
│  │    ├─ Clarity & Actionability                       │  │
│  │    ├─ File Routing Compliance                       │  │
│  │    ├─ Coordination Strategy                         │  │
│  │    └─ Mode-Specific Best Practices                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 2. Complexity Heuristics (5 triggers)                │  │
│  │    ├─ High complexity (>0.6)                         │  │
│  │    ├─ Low quality (<0.5)                             │  │
│  │    ├─ Critical issues                                │  │
│  │    ├─ Multi-agent (>2 agents)                        │  │
│  │    └─ Missing elements (<0.4)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 3. Context7 Integration (if triggered)               │  │
│  │    ├─ Section Selection                              │  │
│  │    ├─ Insight Deduplication                          │  │
│  │    ├─ Session Cache (TTL: 1 hour)                    │  │
│  │    └─ Token Savings Tracking                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 4. Intervention Decision                             │  │
│  │    ├─ Evidence-based Thresholds                      │  │
│  │    ├─ Severity Classification                        │  │
│  │    └─ Intervention Level (Required/Recommended/...)   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 5. Improvement Generation                            │  │
│  │    ├─ Grounded in Context7 Insights                  │  │
│  │    ├─ Specific Recommendations                       │  │
│  │    └─ Priority-Ordered Improvements                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 6. Captain's Log Enhancement                         │  │
│  │    ├─ Context7 Consultation Tracking                 │  │
│  │    ├─ Session Statistics                             │  │
│  │    └─ Quality Improvement Tracking                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Input Prompt
    ↓
[Enhanced Analysis]
    ├─ 5 Quality Dimensions
    └─ Intervention Analysis
    ↓
[Complexity Check]
    ├─ YES: Trigger Context7
    │   ├─ Check Cache
    │   ├─ Fetch Sections
    │   └─ Deduplicate Insights
    └─ NO: Skip Context7
    ↓
[Intervention Decision]
    ├─ Critical Issues
    ├─ Severity Classification
    └─ Recommendations
    ↓
[Improvement Generation]
    └─ Prioritized Suggestions
    ↓
[Session Tracking]
    ├─ Count Analysis
    ├─ Track Improvements
    └─ Log to Captain's Log
    ↓
Output (Analysis + Improvements)
```

### Module Dependencies

```
prompt-improver-refactored.js (Main)
├── lib/analyzer-enhanced.js
│   └── Quality dimension scoring
├── lib/context-aware.js
│   ├─ Documentation consultation
│   └─ Session caching
├── lib/captains-log-enhanced.js
│   └── Context7 consultation logging
└── lib/memory-manager.js (unchanged)
    └── Learning persistence
```

---

## Module Reference

### 1. RefactoredPromptImprover (Main Entry Point)

**File**: `prompt-improver-refactored.js`
**LOC**: 661
**Purpose**: Orchestrate Context7-aware prompt improvement workflow

**Class**: `RefactoredPromptImprover`

#### Constructor

```javascript
constructor(options = {})
```

**Options**:
```javascript
{
  interventionThreshold: 0.7,      // Quality threshold for intervention
  context7Enabled: true,            // Enable Context7 consultation
  cacheTTL: 3600000,                // Cache TTL in milliseconds (1 hour)
  captainsLogPath: 'sessions/captains-log',  // Log directory
  autoLearn: true                   // Enable learning persistence
}
```

#### Methods

**improvePrompt(prompt, options)**

Analyze and improve a user prompt with Context7 grounding.

```javascript
async improvePrompt(prompt, options = {}) -> Promise<PromptImprovementResult>
```

**Parameters**:
- `prompt` (string): User's prompt to analyze
- `options` (object): Optional overrides
  - `mode` (string): Force execution mode detection
  - `skipContext7` (boolean): Skip Context7 consultation for this prompt

**Returns**:
```javascript
{
  prompt: string,                 // Original prompt
  analysis: {
    qualityDimensions: {          // 5-dimension quality breakdown
      structuralCompleteness: 0.8,
      clarityActionability: 0.7,
      fileRoutingCompliance: 1.0,
      coordinationStrategy: 0.6,
      modeBestPractices: 0.75,
      overall: 0.76               // Weighted average
    },
    context7Insights: {           // Claude Code grounding (if consulted)
      principles: [...],
      patterns: [...],
      antipatterns: [...],
      recommendations: [...]
    },
    interventionAnalysis: {
      interventionLevel: 'suggested',  // required/recommended/suggested/optional/none
      criticalIssues: [],
      allIssues: [
        {
          type: 'structure',
          severity: 'high',
          message: 'Missing deliverables specification',
          threshold: 0.5,
          actual: 0.2,
          intervention: 'recommended'
        },
        ...
      ],
      recommendations: [...]
    },
    executionMode: 'direct'       // Detected: direct/swarm/hive/wizard
  },
  shouldImprove: true,
  improvements: [
    {
      issue: 'clarity',
      suggestion: 'Be more specific about what "API" means',
      before: 'Build an API',
      after: 'Build a REST API with Express.js'
    },
    ...
  ],
  estimatedQualityImprovement: 0.35  // Expected quality gain
}
```

**endSession()**

Generate session summary and statistics.

```javascript
async endSession() -> Promise<SessionSummary>
```

**Returns**:
```javascript
{
  startTime: 1763500195000,
  endTime: 1763500197000,
  sessionDuration: 2000,           // Milliseconds
  totalAnalyzed: 15,
  totalImproved: 12,
  improvementRate: 0.8,            // 80%
  context7Stats: {
    consultations: 8,
    cacheEntries: 3,
    cacheHits: 5,
    hitRate: 0.625,                // 62.5%
    tokenSavings: '~2.0k tokens'
  },
  topIssues: [
    { type: 'clarity', count: 9 },
    { type: 'coordination', count: 6 },
    { type: 'file_routing', count: 3 }
  ],
  qualityMetrics: {
    averageInitialQuality: 0.452,
    averageFinalQuality: 0.786,
    averageImprovement: 0.334
  }
}
```

---

### 2. EnhancedPromptAnalyzer

**File**: `lib/analyzer-enhanced.js`
**LOC**: 703
**Purpose**: Claude Code-grounded quality scoring with 5 dimensions

**Class**: `EnhancedPromptAnalyzer`

#### Constructor

```javascript
constructor(options = {})
```

**Options**:
```javascript
{
  context7Enabled: true,
  cacheTTL: 3600000
}
```

#### Methods

**analyze(prompt)**

Perform comprehensive prompt analysis.

```javascript
async analyze(prompt) -> Promise<AnalysisResult>
```

**Quality Dimensions**:

1. **Structural Completeness** (25% weight)
   - Checks for: goal, constraints, deliverables, context, steps
   - Score: 0.0-1.0 (ratio of present elements)

2. **Clarity & Actionability** (25% weight)
   - Detects ambiguous terms (it, that, thing, etc.)
   - Measures specificity
   - Score: 0.0-1.0

3. **File Routing Compliance** (15% weight) - CRITICAL
   - Sessions/artifacts pattern required
   - Detects root folder violations
   - Score: 1.0 (compliant), 0.5 (neutral), 0.0 (violation)

4. **Coordination Strategy** (20% weight)
   - For multi-agent tasks only
   - Checks topology, strategy, memory, consensus
   - Score: N/A (direct), 0.0-1.0 (multi-agent)

5. **Mode-Specific Best Practices** (15% weight)
   - Validates hive/swarm/wizard/direct patterns
   - Score: 0.0-1.0

**analyzeStructuralCompleteness(prompt)**

```javascript
analyzeStructuralCompleteness(prompt) -> {
  goal: boolean,
  constraints: boolean,
  deliverables: boolean,
  context: boolean,
  steps: boolean,
  score: number
}
```

**analyzeClarityActionability(prompt)**

```javascript
analyzeClarityActionability(prompt) -> {
  clarityScore: number,
  specificityScount: number,
  ambiguousTerms: string[],
  finalScore: number
}
```

**analyzeFileRouting(prompt)**

```javascript
analyzeFileRouting(prompt) -> {
  hasSessionPath: boolean,
  hasViolations: boolean,
  violations: string[],
  score: number  // 1.0|0.5|0.0
}
```

---

### 3. Context7Integration

**File**: `lib/context-aware.js`
**LOC**: 407
**Purpose**: Intelligent Claude Code documentation consultation with caching

**Class**: `Context7Integration`

#### Constructor

```javascript
constructor(options = {})
```

**Options**:
```javascript
{
  cacheTTL: 3600000,  // 1 hour
  maxSections: 3      // Max sections per consultation
}
```

#### Methods

**shouldConsultContext7(analysis)**

Determine if Context7 consultation is needed.

```javascript
shouldConsultContext7(analysis) -> boolean
```

**Triggers**:
- High complexity (>0.6)
- Low quality score (<0.5)
- Critical issues detected
- Multi-agent coordination (>2 agents)
- Missing structural elements (<0.4)

**fetchContext7Insights(analysis)**

Fetch and cache Claude Code insights.

```javascript
async fetchContext7Insights(analysis) -> Promise<Context7Insights>
```

**Returns**:
```javascript
{
  principles: [
    'Concurrent execution via Claude Code Task tool',
    'MCP coordinates, Claude Code executes',
    ...
  ],
  patterns: [
    'Batch all agent spawning in single message',
    'Use memory for coordination',
    ...
  ],
  antipatterns: [
    'Sequential agent spawning (slow)',
    'Multiple messages for related operations',
    ...
  ],
  recommendations: [
    'Spawn agents concurrently',
    'Define clear memory namespaces',
    ...
  ],
  examples: [
    {code: '...', description: '...'},
    ...
  ],
  timestamp: Date.now(),
  fromCache: boolean
}
```

**getContext7CacheStats()**

Retrieve cache statistics.

```javascript
getContext7CacheStats() -> {
  totalEntries: number,
  cacheHits: number,
  cacheMisses: number,
  hitRate: number,
  oldestEntry: number,  // Timestamp
  newestEntry: number
}
```

**clearContext7Cache()**

Manually clear the session cache.

```javascript
clearContext7Cache() -> void
```

---

### 4. EnhancedCaptainsLog

**File**: `lib/captains-log-enhanced.js`
**LOC**: 356
**Purpose**: Track Context7 consultations and learning statistics

**Class**: `EnhancedCaptainsLog`

#### Methods

**logContext7Consultation(consultation)**

Log a Context7 consultation event.

```javascript
async logContext7Consultation(consultation) -> Promise<void>
```

**Parameters**:
```javascript
{
  timestamp: Date.now(),
  trigger: 'high_complexity',  // Trigger reason
  mode: 'swarm',
  sectionsConsulted: [
    'advanced/swarm-coordination',
    'essentials/memory-coordination'
  ],
  insightsRetrieved: {
    principles: 2,
    patterns: 3,
    antipatterns: 2,
    recommendations: 4
  },
  fromCache: false,
  duration: 150
}
```

**logSessionSummary(summary)**

Log comprehensive session summary.

```javascript
async logSessionSummary(summary) -> Promise<void>
```

**Parameters**:
```javascript
{
  duration: 2520000,           // Milliseconds
  totalAnalyzed: 15,
  totalImproved: 12,
  context7Stats: {...},
  topIssues: [
    { type: 'clarity', count: 9 },
    ...
  ],
  qualityMetrics: {...}
}
```

---

## API Documentation

### PromptImprovementResult

Complete result of prompt analysis and improvement.

```typescript
interface PromptImprovementResult {
  prompt: string;
  analysis: {
    qualityDimensions: QualityDimensions;
    context7Insights?: Context7Insights;
    interventionAnalysis: InterventionAnalysis;
    executionMode: ExecutionMode;
  };
  shouldImprove: boolean;
  improvements: Improvement[];
  estimatedQualityImprovement: number;
}

interface QualityDimensions {
  structuralCompleteness: number;      // 0.0-1.0
  clarityActionability: number;        // 0.0-1.0
  fileRoutingCompliance: number;       // 0.0-1.0
  coordinationStrategy: number;        // 0.0-1.0
  modeBestPractices: number;           // 0.0-1.0
  overall: number;                     // Weighted average
  details: {
    [key: string]: any
  };
}

interface Context7Insights {
  principles: string[];
  patterns: string[];
  antipatterns: string[];
  recommendations: string[];
  examples: CodeExample[];
  timestamp: number;
  fromCache: boolean;
}

interface InterventionAnalysis {
  interventionLevel: 'required' | 'recommended' | 'suggested' | 'optional' | 'none';
  criticalIssues: Issue[];
  allIssues: Issue[];
  recommendations: string[];
  shouldIntervene: boolean;
}

interface Improvement {
  issue: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  suggestion: string;
  before: string;
  after: string;
  reasoning: string;
}

type ExecutionMode = 'direct' | 'swarm' | 'hive' | 'wizard';
```

---

## Configuration

### Basic Configuration

```javascript
const improver = new RefactoredPromptImprover({
  // Quality threshold for suggesting improvements
  interventionThreshold: 0.7,

  // Enable Context7 consultation
  context7Enabled: true,

  // Cache TTL in milliseconds
  cacheTTL: 3600000,  // 1 hour

  // Captain's Log location
  captainsLogPath: 'sessions/captains-log',

  // Enable learning persistence
  autoLearn: true
});
```

### Advanced Configuration

```javascript
// Strict mode (intervene on low quality)
const strictImprover = new RefactoredPromptImprover({
  interventionThreshold: 0.5,  // Lower threshold = more interventions
  context7Enabled: true,
  cacheTTL: 600000             // 10 minutes
});

// Minimal mode (only critical issues)
const minimalImprover = new RefactoredPromptImprover({
  interventionThreshold: 0.9,  // High threshold = less interventions
  context7Enabled: false,      // Skip Context7 for speed
  autoLearn: false
});

// Learning mode (track everything)
const learningImprover = new RefactoredPromptImprover({
  interventionThreshold: 0.6,
  context7Enabled: true,
  cacheTTL: 7200000,          // 2 hours
  autoLearn: true,            // Enable learning
  captainsLogPath: 'sessions/captains-log'
});
```

---

## Usage Examples

### Example 1: Basic Prompt Improvement

```javascript
const { RefactoredPromptImprover } = require('./prompt-improver-refactored');

const improver = new RefactoredPromptImprover();

async function example1() {
  const prompt = "Build an API";

  const result = await improver.improvePrompt(prompt);

  if (result.shouldImprove) {
    console.log('Original:', result.prompt);
    console.log('\nQuality Score:', result.analysis.qualityDimensions.overall);
    console.log('\nDimension Breakdown:');
    console.log('  - Structural:', result.analysis.qualityDimensions.structuralCompleteness);
    console.log('  - Clarity:', result.analysis.qualityDimensions.clarityActionability);
    console.log('  - File Routing:', result.analysis.qualityDimensions.fileRoutingCompliance);

    console.log('\nSuggested Improvements:');
    result.improvements.forEach((imp, i) => {
      console.log(`${i + 1}. ${imp.suggestion}`);
      console.log(`   Before: "${imp.before}"`);
      console.log(`   After: "${imp.after}"`);
    });
  }
}

example1();
```

### Example 2: Context7-Grounded Analysis

```javascript
async function example2() {
  const complexPrompt = `
    Build a full-stack application with:
    - Backend API
    - Frontend UI
    - Database
    - Authentication
    - Testing
    But I'm not sure how to structure the work
  `;

  const result = await improver.improvePrompt(complexPrompt);

  if (result.analysis.context7Insights) {
    console.log('Claude Code Principles:');
    result.analysis.context7Insights.principles.forEach(p => {
      console.log(`  - ${p}`);
    });

    console.log('\nRecommended Patterns:');
    result.analysis.context7Insights.patterns.forEach(p => {
      console.log(`  - ${p}`);
    });

    console.log('\nPatterns to Avoid:');
    result.analysis.context7Insights.antipatterns.forEach(a => {
      console.log(`  - ${a}`);
    });
  }
}

example2();
```

### Example 3: File Routing Validation

```javascript
async function example3() {
  const badRouting = "Create tests in tests/";
  const goodRouting = "Create tests in sessions/$SESSION_ID/artifacts/tests/";

  const badResult = await improver.improvePrompt(badRouting);
  const goodResult = await improver.improvePrompt(goodRouting);

  console.log('Bad Routing Score:',
    badResult.analysis.qualityDimensions.fileRoutingCompliance);  // 0.0

  console.log('Good Routing Score:',
    goodResult.analysis.qualityDimensions.fileRoutingCompliance); // 1.0

  console.log('\nIntervention Required:', badResult.shouldImprove);
  console.log('Critical Issues:', badResult.analysis.interventionAnalysis.criticalIssues);
}

example3();
```

### Example 4: Session Management

```javascript
async function example4() {
  const improver = new RefactoredPromptImprover();

  // Analyze multiple prompts in a session
  const prompts = [
    "Build an API",
    "Create database schema",
    "Write tests",
    "Add error handling"
  ];

  for (const prompt of prompts) {
    console.log(`\nAnalyzing: "${prompt}"`);
    const result = await improver.improvePrompt(prompt);
    console.log(`Quality: ${(result.analysis.qualityDimensions.overall * 100).toFixed(1)}%`);
  }

  // End session and get statistics
  const summary = await improver.endSession();

  console.log('\n=== Session Summary ===');
  console.log(`Total prompts: ${summary.totalAnalyzed}`);
  console.log(`Improved: ${summary.totalImproved}`);
  console.log(`Improvement rate: ${(summary.improvementRate * 100).toFixed(1)}%`);

  console.log('\nContext7 Statistics:');
  console.log(`  Consultations: ${summary.context7Stats.consultations}`);
  console.log(`  Cache hits: ${summary.context7Stats.cacheHits}`);
  console.log(`  Hit rate: ${(summary.context7Stats.hitRate * 100).toFixed(1)}%`);
  console.log(`  Token savings: ${summary.context7Stats.tokenSavings}`);

  console.log('\nTop Issues:');
  summary.topIssues.forEach(issue => {
    console.log(`  - ${issue.type}: ${issue.count}`);
  });
}

example4();
```

---

## Integration Patterns

### Pattern 1: Skill Integration

```javascript
// In your skill definition
const { RefactoredPromptImprover } = require('./prompt-improver-refactored');

module.exports = {
  name: 'prompt-improver',
  async execute(userMessage, context) {
    const improver = new RefactoredPromptImprover({
      context7Enabled: true
    });

    // Analyze user prompt
    const result = await improver.improvePrompt(userMessage);

    // Return analysis and suggestions
    return {
      analysis: result.analysis,
      improvements: result.improvements,
      shouldImprove: result.shouldImprove
    };
  }
};
```

### Pattern 2: Pre-Execution Hook

```javascript
// Validate prompt before executing
async function executeWithValidation(prompt) {
  const improver = new RefactoredPromptImprover();
  const result = await improver.improvePrompt(prompt);

  if (result.analysis.interventionAnalysis.criticalIssues.length > 0) {
    // Critical issues found
    throw new Error(`Critical issue: ${
      result.analysis.interventionAnalysis.criticalIssues[0].message
    }`);
  }

  if (result.shouldImprove) {
    // Suggest improvements but allow execution
    console.warn('Improvements suggested:', result.improvements);
  }

  // Proceed with execution
  return executePrompt(prompt);
}
```

### Pattern 3: Learning Loop

```javascript
// Track improvement effectiveness
async function trackImprovements() {
  const improver = new RefactoredPromptImprover({ autoLearn: true });

  for (const prompt of userPrompts) {
    const result = await improver.improvePrompt(prompt);

    // Log what worked
    if (result.estimatedQualityImprovement > 0.3) {
      console.log('High-value improvement:');
      console.log(`  Original: ${result.prompt}`);
      result.improvements.forEach(imp => {
        console.log(`  - ${imp.suggestion}`);
      });
    }
  }

  // Get learning insights
  const summary = await improver.endSession();
  console.log('Most common issues:', summary.topIssues);
}
```

---

## Testing Guide

### Unit Tests

```javascript
const { EnhancedPromptAnalyzer } = require('./lib/analyzer-enhanced');
const { Context7Integration } = require('./lib/context-aware');

describe('Quality Dimensions', () => {
  it('detects structural completeness', async () => {
    const analyzer = new EnhancedPromptAnalyzer();
    const analysis = await analyzer.analyze("Build an API with Express, JWT auth, PostgreSQL, Jest tests, saving to sessions/$SESSION_ID/artifacts/");

    expect(analysis.qualityDimensions.structuralCompleteness).toBeGreaterThan(0.8);
  });

  it('flags file routing violations', async () => {
    const analyzer = new EnhancedPromptAnalyzer();
    const analysis = await analyzer.analyze("Create tests in tests/");

    expect(analysis.qualityDimensions.fileRoutingCompliance).toBe(0.0);
  });

  it('detects ambiguous terms', async () => {
    const analyzer = new EnhancedPromptAnalyzer();
    const analysis = await analyzer.analyze("Fix it so that thing works");

    expect(analysis.qualityDimensions.clarityActionability).toBeLessThan(0.5);
  });
});

describe('Context7 Caching', () => {
  it('caches Context7 insights', async () => {
    const context7 = new Context7Integration();
    const analysis = { complexity: 0.8, issues: ['structure'] };

    const insights1 = await context7.fetchContext7Insights(analysis);
    const insights2 = await context7.fetchContext7Insights(analysis);

    // Second call should be from cache
    expect(insights2.fromCache).toBe(true);
  });

  it('tracks cache statistics', async () => {
    const context7 = new Context7Integration();
    const stats = context7.getContext7CacheStats();

    expect(stats).toHaveProperty('totalEntries');
    expect(stats).toHaveProperty('cacheHits');
    expect(stats).toHaveProperty('hitRate');
  });
});
```

### Integration Tests

```javascript
const { RefactoredPromptImprover } = require('./prompt-improver-refactored');

describe('End-to-End Workflow', () => {
  it('improves vague prompts', async () => {
    const improver = new RefactoredPromptImprover();
    const result = await improver.improvePrompt("Build an API");

    expect(result.shouldImprove).toBe(true);
    expect(result.improvements.length).toBeGreaterThan(0);
  });

  it('provides Context7 insights for complex tasks', async () => {
    const improver = new RefactoredPromptImprover({
      context7Enabled: true
    });

    const complexPrompt = "Build a full-stack app with hive mind coordination";
    const result = await improver.improvePrompt(complexPrompt);

    expect(result.analysis.context7Insights).toBeDefined();
    expect(result.analysis.context7Insights.principles.length).toBeGreaterThan(0);
  });

  it('generates session summaries', async () => {
    const improver = new RefactoredPromptImprover();

    // Analyze some prompts
    for (let i = 0; i < 5; i++) {
      await improver.improvePrompt(`Prompt ${i}`);
    }

    // End session
    const summary = await improver.endSession();

    expect(summary.totalAnalyzed).toBe(5);
    expect(summary.context7Stats).toBeDefined();
  });
});
```

---

## Troubleshooting

### Issue: No Context7 Insights Generated

**Symptom**: `analysis.context7Insights` is undefined

**Diagnosis**:
- Context7 consultation not triggered by complexity heuristics
- Context7 disabled in configuration

**Solution**:
```javascript
// Check if consultation was triggered
const result = await improver.improvePrompt(prompt);
console.log('Context7 Triggered:', !!result.analysis.context7Insights);

// Force Context7 for testing
const complexPrompt = "Build [very long/detailed multi-agent task description]";
const result2 = await improver.improvePrompt(complexPrompt);
```

### Issue: Cache Hit Rate Too Low

**Symptom**: Cache hits < 30% even with similar prompts

**Diagnosis**:
- Cache key doesn't match similar prompts
- Mode detection differs between similar prompts
- Cache TTL expired

**Solution**:
```javascript
// Increase cache TTL
const improver = new RefactoredPromptImprover({
  cacheTTL: 7200000  // 2 hours instead of 1
});

// Check cache statistics
const stats = improver.analyzer.getContext7CacheStats();
console.log('Cache hit rate:', stats.hitRate);
console.log('Cache entries:', stats.totalEntries);
```

### Issue: File Routing Always Violations

**Symptom**: File routing compliance always 0.0

**Diagnosis**:
- Prompts mention root-level paths (`tests/`, `docs/`)
- Session path format incorrect

**Solution**:
```javascript
// Correct format
const goodPrompt = "Save to sessions/$SESSION_ID/artifacts/tests/";
const badPrompt = "Save to tests/";

// Validate routing
const result = await improver.improvePrompt(badPrompt);
console.log('Violations:',
  result.analysis.qualityDimensions.fileRoutingCompliance);  // 0.0
```

---

## Performance Tuning

### Optimize for Speed

```javascript
// Minimal configuration for maximum speed
const fastImprover = new RefactoredPromptImprover({
  context7Enabled: false,      // Skip Context7
  autoLearn: false,            // Skip learning
  interventionThreshold: 0.95   // High threshold = less analysis
});

// Analyze quickly
const result = await fastImprover.improvePrompt(prompt);
```

### Optimize for Accuracy

```javascript
// Comprehensive configuration for maximum accuracy
const accurateImprover = new RefactoredPromptImprover({
  context7Enabled: true,       // Full Context7 consultation
  cacheTTL: 1800000,           // 30 minutes (more cache hits)
  autoLearn: true,             // Learn from patterns
  interventionThreshold: 0.5    // Lower threshold = more analysis
});

const result = await accurateImprover.improvePrompt(prompt);
console.log('Detailed Analysis:', result.analysis);
```

### Optimize for Token Usage

```javascript
// Configuration for minimum token usage
const efficientImprover = new RefactoredPromptImprover({
  context7Enabled: true,       // Context7 caching saves tokens
  cacheTTL: 7200000,           // 2 hours (maximize cache)
  autoLearn: false,            // Skip learning overhead
  interventionThreshold: 0.7
});

// Batch similar prompts in session
const prompts = [
  "Build API with swarm",
  "Create database with swarm",
  "Add tests with swarm"  // Cache hit - 400 tokens saved!
];

for (const prompt of prompts) {
  await efficientImprover.improvePrompt(prompt);
}

const summary = await efficientImprover.endSession();
console.log('Token Savings:', summary.context7Stats.tokenSavings);
```

---

## Summary

The Prompt Improver v2.0.0 provides:

- ✅ **Context7-aware analysis** grounded in Claude Code best practices
- ✅ **5 quality dimensions** for comprehensive evaluation
- ✅ **Smart caching** for 400-token savings per hit
- ✅ **Evidence-based intervention** thresholds
- ✅ **Captain's Log integration** for learning persistence
- ✅ **Backward compatibility** with v1.0.0

For production use, start with the configuration matching your needs (speed/accuracy/tokens) and adjust thresholds based on your workflow.

---

**Version**: 2.0.0
**Last Updated**: 2025-11-18
**Status**: Production Ready
