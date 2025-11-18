# Best Practices Summary: Tutor-Mode and Adaptive Learning

**Research Date**: 2025-11-17
**Researcher**: Hive Mind Research Agent
**Session**: session-20251117-100232-docs-refactor-tutor

## Executive Summary

Consolidated best practices from analyzing tutor-mode skill, pair-programming skill, swarm-orchestration, hooks-automation, and skill-builder patterns. These practices enable scalable, adaptive learning systems that work effectively across diverse user knowledge levels.

---

## 1. Progressive Disclosure Architecture

### ✅ DO:

**Use Three-Level Loading**
```yaml
---
name: "Skill Name"              # Level 1: Always loaded (~61 chars)
description: "What and when"    # Level 1: Always loaded (~200 chars)
---

# Core Instructions                # Level 2: Loaded when active (~5KB)
## Quick Start
[Basic usage]

## Advanced Topics                 # Level 3: On-demand loading
See [ADVANCED.md](docs/ADVANCED.md)
```

**Benefits**:
- 100 skills = ~6KB base context (vs 500KB flat)
- Only active skill content enters context
- Scale without performance penalty

**Structure Content in 4 Levels**
```markdown
Level 1: Overview (Always read first)
  - 2-3 sentences
  - Prerequisites
  - What it does

Level 2: Quick Start (80% use case)
  - Simplest command
  - Common scenarios
  - Expected output

Level 3: Detailed Instructions (Deep work)
  - Step-by-step guides
  - Advanced options
  - Integration patterns

Level 4: Reference (Rarely needed)
  - Troubleshooting
  - Complete API
  - Edge cases
```

### ❌ DON'T:

- Put all content in SKILL.md (creates bloat)
- Create flat, unstructured documents
- Load unnecessary content into context
- Mix beginner and advanced content

---

## 2. YAML Frontmatter Standards

### ✅ DO:

**Required Fields Only**
```yaml
---
name: "API Documentation Generator"
description: "Generate OpenAPI 3.0 documentation from Express.js routes. Use when creating API docs, documenting endpoints, or building API specifications."
---
```

**Description Best Practices**:
- Front-load keywords (API, OpenAPI, Express)
- Include "what" (Generate OpenAPI docs)
- Include "when" (Use when creating API docs...)
- Be specific about technologies
- Max 1024 characters
- Plain text or minimal markdown

**Name Best Practices**:
- Max 64 characters
- Title Case
- Descriptive, not generic
- Human-friendly
- Examples:
  - ✅ "React Component Builder"
  - ✅ "Database Schema Designer"
  - ❌ "skill-1"
  - ❌ "helper-tool"

### ❌ DON'T:

- Use generic descriptions ("A tool for APIs")
- Omit trigger conditions (no "when" clause)
- Bury important keywords at end
- Add non-standard fields (version, author, tags ignored by Claude)
- Exceed character limits
- Use special characters without quotes

---

## 3. Adaptive Learning Paths

### ✅ DO:

**Assess Before Teaching**
```javascript
// Strategic assessment across 4 dimensions
const assessment = {
  conceptual: evaluateUnderstanding(),      // Can explain concepts?
  practical: evaluateSkills(),              // Can execute commands?
  patterns: evaluateRecognition(),          // Know when to use what?
  problemSolving: evaluateSolutions()       // Can design solutions?
};

// Provide specific recommendations
if (assessment.conceptual < 0.7) {
  recommend("Re-read: 03-intermediate/swarm-topologies.md");
} else if (assessment.practical < 0.8) {
  recommend("Practice: Exercise I1 (Choose topology)");
}
```

**Provide Multiple Learning Modes**
```bash
# Different learners, different preferences
/tutor explain topic --mode eli5      # Simple analogies
/tutor explain topic --mode code      # Real examples
/tutor explain topic --mode test      # Interactive challenge
/tutor explain topic --mode why       # Real-world importance
```

**Track Progress Persistently**
```javascript
// Store in .swarm/memory.db
await memory.store('tutor-progress/user-123', {
  currentPhase: "Phase 2: Essential Skills",
  completedLessons: ["what-is-claude-flow", "workspace-tour", ...],
  skillLevels: {
    "parallel-execution": 0.8,
    "memory-coordination": 0.6
  },
  weakAreas: ["memory-namespaces", "complex-handoffs"],
  lastActive: Date.now()
});
```

**Adapt Dynamically**
```javascript
// Detect struggle patterns
if (user.failures[topic] > 3) {
  // Intervention
  suggest("Revisit prerequisite material");
  suggest("Try easier exercises first");
  suggest("Use ELI5 mode for clearer explanation");

  // Adjust difficulty
  currentDifficulty -= 1;
}

// Detect fast progress
if (completionTime < avgTime * 0.7) {
  suggest("Challenge yourself with advanced exercises");
  recommend("Consider skipping to Phase 3");
}
```

### ❌ DON'T:

- Assume one-size-fits-all learning
- Force linear progression for all users
- Ignore repeated failures
- Forget past progress between sessions
- Neglect learning style preferences

---

## 4. Exercise-Based Learning

### ✅ DO:

**Graduate Difficulty Levels**
```markdown
Foundations (F1-F4):
- F1: Start first session
- F2: Store/retrieve memory
- F3: Spawn single agent
- F4: Close session with HITL

Essential Skills (E1-E4):
- E1: Spawn 5 agents in one message
- E2: Design handoff chain for 3 agents
- E3: Build blog platform (backend + frontend + tests)
- E4: Implement file routing to session artifacts

Intermediate (I1-I4):
- I1: Choose topology for 3 scenarios
- I2: Implement queen-led hierarchical swarm
- I3: Use consensus for architecture decision
- I4: Build multi-phase documentation system

Advanced (A1-A4):
- A1: Use hive-mind wizard for complex feature
- A2: Implement Byzantine consensus (3f+1)
- A3: Build adaptive topology switching
- A4: Create ReasoningBank learning pipeline
```

**Provide Real-World Scenarios**
```markdown
Exercise E2: Design Handoff Chain

Scenario:
Build login system with:
- Backend developer
- Security specialist
- Database architect
- Test engineer

Question: How would you coordinate them using memory?
Design the namespace strategy and handoff chain.

[User attempts solution]

Feedback:
✅ Your namespace strategy is correct!
⚠️  Consider: Add TTL to prevent memory bloat
💡 Bonus: Security specialist should validate backend's auth logic

Solution:
[Full explanation with code]
```

**Use Immediate Feedback**
```javascript
// After exercise completion
if (solution.correct) {
  feedback.correctness = "✅ Excellent work!";
  feedback.improvement = "Consider adding [specific enhancement]";
  feedback.nextStep = "Ready for Exercise E3? [Y/n]";
} else {
  feedback.correctness = "⚠️ Almost there! The issue is...";
  feedback.hint = "Hint: Think about namespace collisions";
  feedback.retry = "Would you like to try again? [Y/n]";
}
```

### ❌ DON'T:

- Create exercises that are too easy or too hard
- Skip feedback after completion
- Use abstract, unrealistic scenarios
- Forget to show correct solutions
- Neglect graduated difficulty

---

## 5. Command System Design

### ✅ DO:

**Create Discoverable Commands**
```bash
# Clear naming patterns
/tutor start              # Begin
/tutor next               # Get next recommendation
/tutor assess             # Check knowledge
/tutor explain <topic>    # Deep dive
/tutor exercise <level>   # Practice
/tutor progress           # View status

# Help system
/tutor help               # All commands
/tutor help <command>     # Specific command help
```

**Provide Shortcuts**
```bash
# Full command
/tutor suggest

# Shortcut
/s

# Alias mapping
/s → /suggest
/e → /explain
/t → /test
/r → /review
```

**Support Command Chaining**
```bash
# Multiple operations
/test && /commit && /push

# Conditional execution
/lint --fix && /test && /review --strict
```

**Consistent Parameter Patterns**
```bash
# Format: /command <required> [--optional <value>]
/tutor explain <topic> [--mode <eli5|code|test|why>]
/tutor exercise <level> [--hint]
/test [--watch] [--coverage] [--only <pattern>]
```

### ❌ DON'T:

- Create cryptic command names
- Require memorization
- Hide functionality
- Use inconsistent parameter patterns
- Neglect help documentation

---

## 6. Context-Aware Examples

### ✅ DO:

**Reference Real Workspace Files**
```markdown
Here's what happened in session-20251115-162200:

The challenge was integrating Byzantine consensus into hive-mind.

Files created:
sessions/session-20251115-162200-hive-mind-integration/artifacts/
  code/byzantine-consensus.js
  tests/byzantine-consensus.test.js
  docs/byzantine-integration-guide.md

Total time: ~25 minutes (6x faster than serial)

Want to try this yourself? [Y/n]
```

**Show Actual Command Outputs**
```bash
$ npx claude-flow@alpha hive-mind:wizard

✅ Swarm initialized (mesh topology, 5 agents)
✅ Agents spawned:
   - Research agent (analyzing patterns)
   - Coder agent (implementing integration)
   - Test agent (writing tests)
   - Reviewer agent (verifying quality)
   - Documentation agent (creating guides)

📊 Progress: 80% complete
⏱️  Estimated time remaining: 5 minutes
```

**Use Project-Specific Patterns**
```javascript
// From your actual codebase
const memory = await swarm.memory.retrieve('api-schema');

// Not abstract examples
const data = await system.getData(); // ❌ Too generic
```

### ❌ DON'T:

- Use abstract, fictional examples
- Show pseudocode instead of real code
- Create scenarios unrelated to workspace
- Omit expected outputs
- Reference non-existent files

---

## 7. Progress Tracking & Feedback

### ✅ DO:

**Provide Immediate Feedback**
```javascript
// After every action
/commit --message "feat: JWT authentication"
→ ✅ Truth Score: 0.98 - Committed successfully

/commit --message "fix"
→ ❌ Truth Score: 0.87 - Below threshold (0.95)
→ Recommendation: Add more specific commit message
```

**Show Visual Progress**
```markdown
📊 Phase 2: Essential Skills

████████░░ 80%

✅ Spawning Agents (100%)
✅ Parallel Execution (100%)
✅ Memory Coordination (85%)
🔄 Session Management (50%)
```

**Track Across Sessions**
```javascript
// Persistent storage
{
  sessions: [
    {
      id: "session-20241115",
      duration: "2h 15m",
      completed: ["Exercise E1", "Exercise E2"],
      score: 0.975
    },
    {
      id: "session-20241116",
      duration: "1h 30m",
      completed: ["Exercise E3"],
      score: 0.991
    }
  ],
  totalTime: "3h 45m",
  overallProgress: 0.80
}
```

**Celebrate Milestones**
```markdown
🎉 Congratulations!

You've completed Phase 2: Essential Skills!

Achievements unlocked:
🥈 Silver: Skills Expert
✅ Spawned 5+ agents in parallel
✅ Built complete feature end-to-end
✅ Designed coordination pattern

Next: Phase 3: Intermediate
Estimated time: 1-2 weeks
```

### ❌ DON'T:

- Delay feedback (provide immediately)
- Give vague feedback ("good job")
- Forget progress between sessions
- Neglect to celebrate achievements
- Hide performance metrics

---

## 8. Documentation Structure

### ✅ DO:

**Organize by User Intent**
```
docs/
├── tutorials/           # Learning-oriented (how to learn)
│   ├── 01-foundations/
│   ├── 02-essential-skills/
│   ├── 03-intermediate/
│   └── 04-advanced/
├── how-to/             # Task-oriented (how to do X)
│   ├── choose-topology.md
│   ├── debug-coordination.md
│   └── optimize-performance.md
├── reference/          # Information-oriented (complete details)
│   ├── api-reference.md
│   ├── command-reference.md
│   └── configuration-reference.md
├── explanation/        # Understanding-oriented (why & concepts)
│   ├── architecture-explained.md
│   ├── memory-explained.md
│   └── coordination-explained.md
└── troubleshooting/    # Problem-solving (when things fail)
    ├── common-errors.md
    └── debug-guide.md
```

**Link Between Documentation Types**
```markdown
# In tutorial
For complete API details, see [API Reference](../reference/api-reference.md)

# In reference
For step-by-step guide, see [Tutorial: Memory Coordination](../tutorials/02-essential-skills/memory-coordination.md)

# In troubleshooting
To understand why this happens, see [Explanation: Memory Architecture](../explanation/memory-explained.md)
```

**Use Consistent Structure**
```markdown
# Every tutorial file

## Prerequisites
[What you need to know first]

## What You'll Learn
[Learning objectives]

## Step-by-Step Guide
[Detailed instructions]

## Practice Exercise
[Hands-on practice]

## Summary
[Key takeaways]

## Next Steps
[Where to go next]
```

### ❌ DON'T:

- Mix different documentation types in one file
- Create documentation without clear purpose
- Use inconsistent structure across files
- Forget to link related content
- Ignore user intent (learning vs reference vs task)

---

## 9. Mastery-Based Progression

### ✅ DO:

**Define Clear Mastery Criteria**
```markdown
Phase 1: Foundations Completion Criteria

Knowledge (80%+):
✅ Can explain claude-flow in one sentence
✅ Understand why parallel execution is faster
✅ Know difference between agents, memory, and sessions

Skills (90%+):
✅ Can start a session and spawn an agent
✅ Store and retrieve data in memory
✅ Complete session with HITL approval

Transfer (N/A for foundations):
Not required

→ PASS: Advance to Phase 2
```

**Enforce Prerequisites**
```javascript
async function canAdvance(user, toPhase) {
  const currentPhase = user.currentPhase;
  const mastery = await assessMastery(user, currentPhase);

  if (mastery.knowledge < 0.80) {
    return {
      allowed: false,
      reason: "Knowledge mastery below 80%",
      recommendation: "Review: " + getMissingTopics(mastery)
    };
  }

  if (mastery.skills < 0.90) {
    return {
      allowed: false,
      reason: "Skills mastery below 90%",
      recommendation: "Practice: " + getSuggestedExercises(mastery)
    };
  }

  return { allowed: true };
}
```

**Provide Multiple Paths to Mastery**
```markdown
To master "Memory Coordination", you can:

Path 1: Tutorial-based
1. Read: memory-coordination.md
2. Complete: Exercise E2
3. Build: Exercise E3

Path 2: Project-based
1. Build: Blog platform with agent coordination
2. Get: Real-time feedback and guidance

Path 3: Exploration-based
1. Experiment: Try different coordination patterns
2. Review: Get feedback on each attempt
3. Refine: Iterate until mastery achieved

Choose your path: [1/2/3]
```

### ❌ DON'T:

- Allow advancement without mastery
- Use arbitrary progress metrics
- Ignore prerequisite knowledge
- Force single learning path
- Skip mastery validation

---

## 10. Error Handling & Recovery

### ✅ DO:

**Normalize Errors**
```markdown
⚠️ Common mistake detected!

You tried to use hierarchical topology for peer-to-peer work.

87% of learners make this mistake when starting!

Here's why mesh is better for this case:
- Hierarchical: Central coordinator (queen)
- Mesh: All agents are equal peers

Your scenario needs equal peers, so mesh is correct.
```

**Detect Error Patterns**
```javascript
// Track repeated mistakes
if (user.mistakes["topology-selection"] > 3) {
  // Intervention
  console.log("I notice you're struggling with topology selection.");
  console.log("");
  console.log("This is a common challenge! Let me help:");
  suggest("/tutor explain topologies --mode eli5");
  suggest("/tutor exercise foundations --retry");
  offer("Would you like a 1-on-1 walkthrough?");
}
```

**Provide Constructive Feedback**
```markdown
❌ Your namespace strategy has an issue

What you did:
swarm/data

Why it's problematic:
Multiple agents storing to same key will overwrite each other

Better approach:
swarm/<agent-type>/<specific-context>

Example:
swarm/backend/api-schema
swarm/frontend/component-tree
swarm/tester/test-results

Why this works:
Each agent gets isolated namespace, preventing collisions
```

**Enable Recovery**
```bash
# After error
/tutor retry          # Try exercise again
/tutor hint           # Get a hint
/tutor explain        # Deeper explanation
/tutor skip           # Move on (if appropriate)
```

### ❌ DON'T:

- Blame user for mistakes
- Provide vague error messages
- Hide error causes
- Skip recovery options
- Ignore repeated failures

---

## 11. Performance Optimization

### ✅ DO:

**Keep Hooks Lightweight**
```bash
# Target: < 100ms execution time
npx claude-flow@alpha hook pre-edit --file "test.js"
→ ✅ Completed in 45ms
```

**Use Async for Heavy Operations**
```javascript
// Don't block main flow
{
  "type": "command",
  "command": "npx claude-flow@alpha hook post-task ...",
  "async": true  // Run in background
}
```

**Cache Aggressively**
```javascript
// Check cache first
const cached = await cache.get(`search:${query}`);
if (cached && (Date.now() - cached.timestamp < 3600000)) {
  return cached.results;  // Use cached results (< 1 hour old)
}

// Otherwise, perform search and cache
const results = await performSearch(query);
await cache.set(`search:${query}`, { results, timestamp: Date.now() });
```

**Batch Related Operations**
```bash
# ❌ Multiple sequential calls
git add .
git commit -m "message"
git push

# ✅ Single batched operation
git add . && git commit -m "message" && git push
```

### ❌ DON'T:

- Block operations unnecessarily
- Skip caching for repeated operations
- Make sequential calls when parallel possible
- Load unnecessary data
- Ignore performance metrics

---

## 12. Memory Coordination

### ✅ DO:

**Use Clear Namespaces**
```javascript
// Organized memory structure
await memory.store('swarm/backend/api-schema', schema);
await memory.store('swarm/frontend/component-tree', tree);
await memory.store('swarm/tester/test-results', results);
await memory.store('tutor-progress/user-123/phase2', progress);
```

**Set Appropriate TTLs**
```javascript
// Short-lived (task-specific)
await memory.store('swarm/task/temp-data', data, { ttl: 3600 }); // 1 hour

// Medium-lived (session-specific)
await memory.store('session/current/state', state, { ttl: 86400 }); // 1 day

// Long-lived (user progress)
await memory.store('tutor-progress/user-123', progress); // No TTL (permanent)
```

**Document Memory Keys**
```markdown
## Memory Key Structure

swarm/
  <agent-type>/
    <context>/
      data

Examples:
- swarm/backend/api-schema
- swarm/frontend/component-tree
- swarm/tester/coverage-report

tutor-progress/
  <user-id>/
    phase
    completed-lessons
    skill-levels
    weak-areas
```

**Enable Cross-Agent Access**
```javascript
// Agent 1: Backend stores API schema
await memory.store('swarm/shared/api-schema', {
  endpoints: [...],
  models: [...]
});

// Agent 2: Frontend reads schema
const schema = await memory.retrieve('swarm/shared/api-schema');
// Uses schema to generate types and API calls
```

### ❌ DON'T:

- Use flat, unorganized key names
- Set incorrect TTLs (too short or too long)
- Skip memory cleanup
- Create namespace collisions
- Forget to document memory structure

---

## Summary Checklist

### Progressive Disclosure
- [ ] 3-level loading architecture
- [ ] 4-level content structure
- [ ] References to external files
- [ ] Minimal base context

### YAML Frontmatter
- [ ] Name under 64 characters
- [ ] Description includes "what" and "when"
- [ ] Front-loaded keywords
- [ ] Max 1024 characters

### Adaptive Learning
- [ ] Initial knowledge assessment
- [ ] Multiple explanation modes
- [ ] Progress tracking (persistent)
- [ ] Dynamic recommendations
- [ ] Struggle detection

### Exercises
- [ ] Graduated difficulty
- [ ] Real-world scenarios
- [ ] Immediate feedback
- [ ] Solution explanations
- [ ] Multiple difficulty levels

### Commands
- [ ] Clear naming patterns
- [ ] Shortcuts provided
- [ ] Help system
- [ ] Command chaining
- [ ] Consistent parameters

### Examples
- [ ] Real workspace files
- [ ] Actual command outputs
- [ ] Project-specific patterns
- [ ] Expected results shown
- [ ] Runnable code

### Progress & Feedback
- [ ] Immediate feedback
- [ ] Visual progress
- [ ] Cross-session tracking
- [ ] Milestone celebrations
- [ ] Performance metrics

### Documentation
- [ ] Organized by intent
- [ ] Consistent structure
- [ ] Linked content
- [ ] Multiple types
- [ ] Clear purpose

### Mastery
- [ ] Clear criteria
- [ ] Prerequisites enforced
- [ ] Multiple paths
- [ ] Validation checkpoints
- [ ] Transfer assessment

### Error Handling
- [ ] Normalized errors
- [ ] Pattern detection
- [ ] Constructive feedback
- [ ] Recovery options
- [ ] Intervention strategies

### Performance
- [ ] Lightweight hooks
- [ ] Async operations
- [ ] Aggressive caching
- [ ] Batched operations
- [ ] Monitored metrics

### Memory
- [ ] Clear namespaces
- [ ] Appropriate TTLs
- [ ] Documented structure
- [ ] Cross-agent access
- [ ] Regular cleanup

---

## Conclusion

These best practices enable:

1. **Scalability**: 100+ skills without performance penalty
2. **Adaptability**: Personalized learning for all levels
3. **Usability**: Clear, discoverable interfaces
4. **Effectiveness**: Proven learning patterns
5. **Maintainability**: Organized, consistent structure

Apply these practices when:
- Creating new skills
- Enhancing existing skills
- Building learning systems
- Designing adaptive workflows
- Implementing progress tracking

---

**Research Status**: Phase 3 Complete - Best Practices ✅
