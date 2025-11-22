# Skill Coordinator Example Outputs

## Overview

This document shows actual output examples from each specialized reference method in skill-coordinator.js.

## 1. getTutorModeReference(topic)

### Input
```javascript
getTutorModeReference('memory coordination')
```

### Output
```
Want hands-on practice with memory coordination?

**tutor-mode** offers interactive exercises with immediate feedback:

Invoke: /tutor-mode "memory coordination"
   or: Skill tool with skill: "tutor-mode"

What you get:
• Interactive exercises tailored to your level
• Immediate feedback on your work
• Guided practice sessions
• Progressive difficulty

**Note**: I'm showing you how to invoke tutor-mode, but I won't do it automatically.
You decide when you're ready for hands-on practice.
```

---

## 2. getMetaSkillReference()

### Input
```javascript
getMetaSkillReference()
```

### Output
```
Curious what other capabilities exist?

**meta-skill** helps you discover and explore all 49 available skills:

Invoke: /meta-skill
   or: Skill tool with skill: "meta-skill"

What you get:
• Browse full skill catalog
• Filter by category or capability
• See detailed skill descriptions
• Find the right skill for your need

**Note**: I'm showing you how to explore skills, not automatically switching to meta-skill.
You maintain control of your learning path.
```

---

## 3. getSwarmOrchestrationReference()

### Input
```javascript
getSwarmOrchestrationReference()
```

### Output
```
Ready for production-grade multi-agent coordination?

**swarm-orchestration** covers advanced coordination patterns:

Invoke: /swarm-orchestration
   or: Skill tool with skill: "swarm-orchestration"

What you get:
• Topology selection (mesh, hierarchical, ring, star)
• Consensus mechanisms for distributed decisions
• Fault tolerance and recovery patterns
• Performance optimization techniques

**Best for**: Systems with 2-5 agents requiring distributed coordination

**Note**: I'm describing swarm-orchestration, not invoking it. You choose when to dive into
production patterns.
```

---

## 4. getHiveMindReference()

### Input
```javascript
getHiveMindReference()
```

### Output
```
Need centralized coordination for large swarms?

**hive-mind-advanced** provides queen-led multi-agent coordination:

Invoke: /hive-mind-advanced
   or: Skill tool with skill: "hive-mind-advanced"

What you get:
• Queen agent orchestration (centralized control)
• Consensus mechanisms across agents
• Persistent memory across sessions
• Hierarchical task delegation

**Best for**: Large-scale swarms (5+ agents) requiring central orchestration

**Note**: I'm showing you how queen-led coordination works, not invoking the hive mind.
You decide when you need that level of orchestration.
```

---

## 5. getGithubCodeReviewReference()

### Input
```javascript
getGithubCodeReviewReference()
```

### Output
```
Want automated, multi-agent code review?

**github-code-review** coordinates AI swarms for comprehensive PR review:

Invoke: /github-code-review
   or: Skill tool with skill: "github-code-review"

What you get:
• Multi-agent code review swarms
• Security and performance analysis
• Automated PR feedback
• Code quality scoring

**Best for**: Automated code review workflows integrated with GitHub

**Note**: I'm describing the github-code-review capability, not starting a review.
You invoke it when you have code ready for review.
```

---

## 6. getVerificationQualityReference()

### Input
```javascript
getVerificationQualityReference()
```

### Output
```
Need automated quality verification with rollback?

**verification-quality** provides truth scoring and automatic quality gates:

Invoke: /verification-quality
   or: Skill tool with skill: "verification-quality"

What you get:
• 0.95 accuracy threshold for agent outputs
• Automatic rollback on quality failures
• Comprehensive code quality verification
• Truth scoring system

**Best for**: Production code quality gates and ensuring high reliability

**Note**: I'm showing you how quality verification works, not activating it.
You decide when quality gates should be enforced.
```

---

## 7. getPairProgrammingReference()

### Input
```javascript
getPairProgrammingReference()
```

### Output
```
Want real-time collaborative development?

**pair-programming** enables AI-assisted coding with multiple modes:

Invoke: /pair-programming
   or: Skill tool with skill: "pair-programming"

What you get:
• Driver/Navigator/Switch modes
• Real-time verification and feedback
• TDD support (test-driven development)
• Debugging assistance

**Best for**: Active development sessions with live collaboration

**Note**: I'm describing pair-programming, not starting a session.
You invoke it when you're ready for collaborative coding.
```

---

## 8. getSparcMethodologyReference()

### Input
```javascript
getSparcMethodologyReference()
```

### Output
```
Need systematic TDD project development?

**sparc-methodology** orchestrates multi-agent SPARC workflows:

Invoke: /sparc-methodology
   or: Skill tool with skill: "sparc-methodology"

What you get:
• Specification → Pseudocode → Architecture → Refinement → Completion
• Multi-agent coordination for each phase
• Test-driven development automation
• Structured project delivery

**Best for**: Systematic TDD development with clear phases and deliverables

**Note**: I'm showing you how SPARC methodology works, not starting a workflow.
You invoke it when you're ready for structured development.
```

---

## 9. getComparisonText() - Special Comparisons

### Example 1: tour-guide vs tutor-mode

#### Input
```javascript
getComparisonText('tour-guide', 'tutor-mode')
```

#### Output
```
**tour-guide** shows, **tutor-mode** teaches

| Aspect | tour-guide | tutor-mode |
|--------|-----------|-----------|
| Goal | Orient & navigate | Teach & practice |
| Method | Explanation & examples | Interactive exercises |
| Depth | Survey level | Hands-on mastery |
| Output | Knowledge | Skill |

**When to use**:
• tour-guide: Getting started, exploring workspace
• tutor-mode: After tour, for deliberate practice
```

### Example 2: swarm-orchestration vs hive-mind-advanced

#### Input
```javascript
getComparisonText('swarm-orchestration', 'hive-mind-advanced')
```

#### Output
```
**swarm-orchestration** teaches patterns, **hive-mind-advanced** provides queen-led coordination

| Aspect | swarm-orchestration | hive-mind-advanced |
|--------|-----------|-----------|
| Style | Peer coordination | Centralized queen |
| Topology | Mesh, ring, star | Hierarchical with queen |
| Best for | Distributed systems | Large-scale coordination |
| Memory | Per-agent | Persistent across sessions |

**When to use**:
• swarm-orchestration: 2-5 agents, distributed
• hive-mind-advanced: 5+ agents, need central orchestrator
```

### Example 3: tour-guide vs meta-skill

#### Input
```javascript
getComparisonText('tour-guide', 'meta-skill')
```

#### Output
```
**tour-guide** orients you to the workspace, **meta-skill** helps you discover capabilities

| Aspect | tour-guide | meta-skill |
|--------|-----------|-----------|
| Goal | Workspace orientation | Skill discovery |
| Scope | Workspace features & workflows | Skill catalog & routing |
| Method | Guided tour | Interactive menu |
| Best for | New users | Finding specific capabilities |

**When to use**:
• tour-guide: First time in workspace
• meta-skill: Looking for specific capability
```

---

## 10. getReferenceText() - Enhanced Formatting

### Example 1: Inline Context

#### Input
```javascript
getReferenceText('tutor-mode', 'inline')
```

#### Output
```
For interactive, hands-on learning with exercises, see **tutor-mode**:

Invoke: /tutor-mode "[topic]"
   or: Skill tool with skill: "tutor-mode"

Example: /tutor-mode "session management basics"

• Interactive exercises
• Immediate feedback
• Guided practice
• Progressive difficulty

**Note**: I won't invoke it for you - you control when to dive deeper.
```

### Example 2: Detailed Context

#### Input
```javascript
getReferenceText('hive-mind-advanced', 'detailed')
```

#### Output
```
**hive-mind-advanced**: Queen-led multi-agent coordination with consensus

Invoke: /hive-mind-advanced
   or: Skill tool with skill: "hive-mind-advanced"

• Queen agent orchestration
• Consensus mechanisms
• Persistent memory across sessions
• Hierarchical task delegation

**Best for**: Large-scale swarms with centralized coordination

**Distinction from tour-guide**:
• Tour-guide: Basic coordination concepts
• hive-mind-advanced: Production queen-led coordination with memory

**"Show Don't Do" Principle**: The tour-guide describes how to use this skill but never invokes it automatically. You decide when to engage.
```

---

## 11. getInvocationExample()

### Example: tutor-mode

#### Input
```javascript
getInvocationExample('tutor-mode')
```

#### Output
```
**How to invoke tutor-mode**:

**Primary method**: /tutor-mode "[topic]"
**Alternative**: Skill tool with skill: "tutor-mode"

**Example**:
  /tutor-mode "session management basics"

**What you get**:
• Interactive exercises
• Immediate feedback
• Guided practice
• Progressive difficulty

**"Show Don't Do" Boundary**:
The tour-guide won't invoke this for you - you control when to engage.
This ensures you maintain agency over your learning journey.
```

### Example: swarm-orchestration

#### Input
```javascript
getInvocationExample('swarm-orchestration')
```

#### Output
```
**How to invoke swarm-orchestration**:

**Primary method**: /swarm-orchestration
**Alternative**: Skill tool with skill: "swarm-orchestration"

**What you get**:
• Topology selection (mesh, hierarchical, ring, star)
• Consensus mechanisms
• Fault tolerance patterns
• Performance optimization

**Best for**: Production-grade multi-agent systems

**"Show Don't Do" Boundary**:
The tour-guide won't invoke this for you - you control when to engage.
This ensures you maintain agency over your learning journey.
```

---

## 12. getSpecializedReference()

### Example 1: With Topic

#### Input
```javascript
getSpecializedReference('tutor-mode', 'session management')
```

#### Output
```
Want hands-on practice with session management?

**tutor-mode** offers interactive exercises with immediate feedback:

Invoke: /tutor-mode "session management"
   or: Skill tool with skill: "tutor-mode"

What you get:
• Interactive exercises tailored to your level
• Immediate feedback on your work
• Guided practice sessions
• Progressive difficulty

**Note**: I'm showing you how to invoke tutor-mode, but I won't do it automatically.
You decide when you're ready for hands-on practice.
```

### Example 2: Without Topic

#### Input
```javascript
getSpecializedReference('meta-skill')
```

#### Output
```
Curious what other capabilities exist?

**meta-skill** helps you discover and explore all 49 available skills:

Invoke: /meta-skill
   or: Skill tool with skill: "meta-skill"

What you get:
• Browse full skill catalog
• Filter by category or capability
• See detailed skill descriptions
• Find the right skill for your need

**Note**: I'm showing you how to explore skills, not automatically switching to meta-skill.
You maintain control of your learning path.
```

---

## Boundary Verification

### What Outputs Show

All outputs consistently include:

1. ✅ **Skill name and purpose** - Clear identification
2. ✅ **Invocation methods** - Both slash command and Skill tool
3. ✅ **Key features** - Bullet list of capabilities
4. ✅ **Best use cases** - When to use this skill
5. ✅ **Boundary reminder** - Explicit "show don't do" statement

### What Outputs DON'T Show

Outputs never include:

- ❌ Automatic invocation of skills
- ❌ Callback functions or event handlers
- ❌ Side effects or state changes
- ❌ Commands that bypass user control
- ❌ Hidden skill invocations

### Boundary Statements in Every Output

Examples of boundary reminders used:

- "**Note**: I won't invoke it for you - you control when to dive deeper."
- "**Note**: I'm showing you how to invoke... but I won't do it automatically."
- "**Note**: I'm describing [skill], not invoking it. You choose when..."
- "**Note**: I'm showing you how [capability] works, not activating it."
- "The tour-guide won't invoke this for you - you control when to engage."

## Usage in Tour-Guide Context

### Scenario 1: After Explaining a Concept

**Context:** Just explained memory coordination

**Code:**
```javascript
const ref = getTutorModeReference('memory coordination');
console.log(ref);
```

**User sees:** Clear instructions on how to practice with tutor-mode, decides whether to continue tour or invoke tutor-mode

### Scenario 2: User Asks "What Else?"

**Context:** User wants to explore capabilities

**Code:**
```javascript
const ref = getMetaSkillReference();
console.log(ref);
```

**User sees:** Instructions on how to use meta-skill for discovery, maintains control of learning path

### Scenario 3: Advanced Coordination Discussion

**Context:** Discussing production multi-agent patterns

**Code:**
```javascript
const ref = getSwarmOrchestrationReference();
console.log(ref);
```

**User sees:** How swarm-orchestration provides production patterns, decides when to dive deeper

### Scenario 4: Comparing Approaches

**Context:** User asks about coordination differences

**Code:**
```javascript
const comparison = getComparisonText('swarm-orchestration', 'hive-mind-advanced');
console.log(comparison);
```

**User sees:** Clear table showing distributed vs centralized patterns, helps them choose appropriate approach

## Conclusion

All specialized reference methods maintain strict "show don't do" boundaries while providing rich, helpful context. Users receive clear invocation instructions and maintain full control over when and how to engage with referenced skills.

**The Principle in Action:** Every output shows users the way forward without removing their agency to choose their own path.
