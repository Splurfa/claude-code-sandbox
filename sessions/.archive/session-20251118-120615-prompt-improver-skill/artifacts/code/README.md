# Prompt Improver Skill

Intelligent prompt improvement system for Claude Flow that analyzes user prompts, detects execution modes, and suggests improvements before execution.

## Features

- **Mode Detection**: Automatically detects hive, swarm, wizard, or direct execution modes
- **Quality Analysis**: Evaluates prompt structure, clarity, specificity, and coordination needs
- **Smart Suggestions**: Generates context-aware improvement suggestions based on baseline patterns
- **Interactive Confirmation**: Presents suggestions with smart defaults and context inference
- **Learning System**: Continuously learns from accepted and rejected improvements
- **Memory Integration**: Leverages Claude Flow memory for pattern baselines
- **Captain's Log**: Integrates with workspace captain's log system
- **Token Efficient**: Optimized for minimal token usage

## Installation

```bash
# From this directory
npm install

# Or link globally
npm link
```

## Usage

### CLI Interface

```bash
# Analyze a prompt (dry run, no improvements)
prompt-improver analyze "Build a REST API with authentication"

# Improve a prompt (with confirmation)
prompt-improver improve "Create frontend and backend"

# Detect execution mode
prompt-improver detect-mode "Spawn swarm to analyze codebase"

# View learning statistics
prompt-improver stats

# View successful patterns
prompt-improver patterns structure 10
```

### Programmatic API

```javascript
const { PromptImprover } = require('./prompt-improver');

const improver = new PromptImprover({
  interventionThreshold: 0.7,  // Only intervene if quality < 0.7
  autoLearn: true,              // Automatically learn from interactions
  captainsLogPath: 'sessions/captains-log'
});

// Analyze and improve a prompt
const result = await improver.improvePrompt(
  "Build authentication system",
  { dryRun: false }
);

if (result.shouldImprove) {
  console.log('Improved prompt:', result.improvedPrompt);
  console.log('Applied improvements:', result.improvements);
}
```

## Architecture

### Core Components

1. **PromptAnalyzer** (`lib/analyzer.js`)
   - Mode detection (hive, swarm, wizard, direct)
   - Quality scoring (structure, clarity, specificity)
   - Complexity estimation
   - Context extraction

2. **MemoryManager** (`lib/memory-manager.js`)
   - Baseline pattern retrieval
   - Pattern storage and aggregation
   - MCP integration with filesystem fallback

3. **ConfirmationHandler** (`lib/confirmation.js`)
   - Interactive user confirmation
   - Smart default inference
   - Custom selection flow

4. **LearningLog** (`lib/learning-log.js`)
   - Success/rejection tracking
   - Pattern analysis
   - Statistics generation
   - Log rotation

5. **CaptainsLog** (`lib/captains-log.js`)
   - Workspace log integration
   - Improvement tracking
   - Statistics reporting

### Analysis Pipeline

```
User Prompt
    ↓
Mode Detection → (hive/swarm/wizard/direct)
    ↓
Quality Analysis → (structure, clarity, specificity)
    ↓
Threshold Check → (intervene if quality < threshold)
    ↓
Pattern Retrieval → (from memory/baselines)
    ↓
Suggestion Generation → (categorized by priority)
    ↓
Smart Defaults → (context inference)
    ↓
User Confirmation → (interactive/auto)
    ↓
Apply Improvements
    ↓
Learning Log → (record outcome)
    ↓
Captain's Log → (track improvement)
```

## Configuration

### Constructor Options

```javascript
{
  // Intervention threshold (0-1)
  // Only intervene if quality score is below this
  interventionThreshold: 0.7,

  // Automatically learn from interactions
  autoLearn: true,

  // Auto-approve improvements (skip confirmation)
  autoApprove: false,

  // Captain's log directory
  captainsLogPath: 'sessions/captains-log',

  // Memory namespace
  memoryNamespace: 'prompt-improver',

  // Learning log path
  learningLogPath: '.prompt-improver-learning',

  // Max learning log entries before rotation
  maxLearningEntries: 1000,

  // Use MCP for memory (fallback to filesystem)
  useMcp: true,

  // Enable captain's log integration
  captainsLog: true
}
```

## Mode Detection

The analyzer detects execution modes based on prompt content:

### Hive Mode
Indicators: `hive`, `queen`, `consensus`, `byzantine`

### Swarm Mode
Indicators: `swarm`, `spawn`, `topology`, `mesh`, `hierarchical`

### Wizard Mode
Indicators: `wizard`, `guided`, `step-by-step`, `interactive`

### Direct Mode
Default for simple single-agent tasks

## Quality Metrics

### Structure Score (0-1)
Evaluates presence of:
- Goal definition
- Constraints
- Deliverables
- Context
- Steps/phases

### Clarity Score (0-1)
Evaluates:
- Ambiguous term count
- Specificity of language
- Clear terminology

### Specificity Score (0-1)
Evaluates:
- Vague vs. specific indicators
- Concrete details (numbers, names, versions)
- Technical precision

### Overall Quality Score
Weighted combination:
- Structure: 30%
- Clarity: 30%
- Specificity: 20%
- Coordination: 20%

## Improvement Categories

### Structure
- Add missing goal/constraints/deliverables
- Include steps/phases
- Add context

### Clarity
- Clarify ambiguous terms
- Replace vague language
- Improve terminology

### Specificity
- Add concrete details
- Include numbers/versions
- Specify requirements

### Context
- Add relevant file paths
- Include technology context
- Reference prior decisions

### Coordination
- Specify topology
- Define execution strategy
- Add memory sharing plan

## Learning System

### Improvement Tracking
Records:
- Original prompt
- Improved prompt
- Analysis results
- Applied suggestions
- User selections
- Timestamp

### Rejection Tracking
Records:
- Rejected prompt
- Suggestions offered
- Rejection reason
- Timestamp

### Statistics
- Total improvements/rejections
- Acceptance rate
- Top improvement types
- Top rejection reasons
- Recent trends
- Average improvements per prompt

### Pattern Learning
- Aggregates successful patterns
- Builds baseline recommendations
- Learns from rejection patterns
- Updates over time

## Memory Integration

### Baseline Patterns
Stored per mode:
```javascript
{
  commonContext: {
    key: 'suggested value',
    ...
  },
  contextFrequency: {
    key: count,
    ...
  },
  bestPractices: [
    'practice 1',
    'practice 2',
    ...
  ]
}
```

### Pattern Storage
Individual patterns stored with:
- Mode
- Analysis
- Suggestions
- User selections
- Outcome
- Timestamp

## Captain's Log Integration

Automatically logs to daily captain's log:
- Improvement summaries
- Applied changes
- Mode and impact
- Learning statistics
- Trend analysis

## Error Handling

Graceful degradation:
- Falls back to filesystem if MCP unavailable
- Returns original prompt on errors
- Continues learning even on failures
- Provides clear error messages

## Token Efficiency

Optimizations:
- Minimal analysis footprint
- Efficient pattern storage
- Truncated log entries
- Smart caching
- Lazy loading

## Examples

### Example 1: Structure Improvement

**Input:**
```
Build an API
```

**Analysis:**
- Mode: direct
- Quality Score: 0.35
- Missing: constraints, deliverables, context, steps

**Suggested Improvements:**
- Add: What kind of API? (REST, GraphQL)
- Add: What entities/endpoints?
- Add: Authentication requirements?
- Add: Testing expectations?
- Add: Deployment context?

**Improved:**
```
Build a REST API with the following:

**Requirements:**
- User authentication (JWT)
- CRUD operations for [entities]
- PostgreSQL database
- Express.js framework

**Deliverables:**
- API endpoints implementation
- Database schema
- Authentication middleware
- Comprehensive tests
- API documentation

**Context:**
Save all code to sessions/$SESSION_ID/artifacts/code/
```

### Example 2: Swarm Coordination

**Input:**
```
Spawn agents to build frontend and backend
```

**Analysis:**
- Mode: swarm
- Quality Score: 0.55
- Missing: topology, coordination strategy

**Suggested Improvements:**
- Add: Swarm topology (mesh/hierarchical)
- Add: Memory coordination strategy
- Add: Specific agent types
- Add: Success criteria

**Improved:**
```
Spawn swarm to build full-stack application:

**Swarm Configuration:**
- Topology: hierarchical
- Agents: backend-dev, frontend-dev, tester, reviewer
- Coordination: mesh topology with memory sharing

**Backend Agent:**
- Build REST API with Express
- PostgreSQL database
- Share API contract in memory: swarm/api/contract

**Frontend Agent:**
- Build React UI
- Read API contract from memory
- Coordinate with backend via hooks

**Testing:**
- Integration tests for full stack
- 90% coverage requirement

**Memory Coordination:**
All agents use swarm/project/* namespace for decisions
```

## Best Practices

1. **Set Appropriate Threshold**: Use 0.7 for most cases, lower for stricter intervention
2. **Enable Auto-Learning**: Helps improve suggestions over time
3. **Review Statistics**: Regular review helps tune the system
4. **Use Smart Defaults**: Accept them for consistency
5. **Provide Feedback**: Rejection reasons improve future suggestions

## Future Enhancements

- [ ] ML-based suggestion ranking
- [ ] A/B testing of suggestions
- [ ] Multi-language support
- [ ] Integration with more MCP servers
- [ ] Real-time collaboration suggestions
- [ ] Semantic similarity matching
- [ ] Custom rule definitions
- [ ] Webhook notifications

## License

MIT
