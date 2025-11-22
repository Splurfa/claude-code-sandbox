# Skill Coordination Plan

## Overview

The tour-guide skill must reference and coordinate with other workspace skills without invoking them automatically. This document specifies the strategy for "show don't do" skill coordination.

## Core Principle: "Show Don't Do"

**Definition**: The tour-guide describes capabilities and shows users how to invoke other skills, but never invokes them on the user's behalf.

**Rationale**:
1. **User agency**: Users choose when to engage deeper learning
2. **Cognitive load**: Prevents overwhelming users with parallel skill invocations
3. **Clear boundaries**: Tour-guide is for navigation, not execution
4. **Opt-in learning**: Users control their learning depth

## Skills to Reference

### Primary Skills (Mentioned Frequently)

#### 1. tutor-mode
**Purpose**: Interactive, hands-on learning with exercises

**When to mention**:
- After explaining a concept: "Want hands-on practice?"
- When user asks "how do I get better at X?"
- In "Next Steps" sections of pathways

**How to reference**:
```
For hands-on practice with [concept], try tutor-mode:

Invoke: /tutor-mode "[topic]"
   or: Skill tool with skill: "tutor-mode"

Example: /tutor-mode "session management basics"

tutor-mode provides:
- Interactive exercises
- Immediate feedback
- Guided practice
- Progressive difficulty

Note: I won't invoke it for you - you control when to dive deeper.
```

**Distinction from tour-guide**:
- Tour-guide: Explains and orients
- Tutor-mode: Teaches through practice

#### 2. meta-skill
**Purpose**: Discover and navigate all available skills

**When to mention**:
- User asks "what other skills exist?"
- When user needs capability outside tour scope
- In "Advanced Topics" sections

**How to reference**:
```
To explore all available skills (49 total), use meta-skill:

Invoke: /meta-skill
   or: Skill tool with skill: "meta-skill"

meta-skill helps you:
- Browse skill catalog
- Filter by category or capability
- See skill details and examples
- Find the right skill for your need

It's like a guided menu system for discovering workspace capabilities.
```

**Distinction from tour-guide**:
- Tour-guide: Workspace orientation
- Meta-skill: Skill discovery and routing

#### 3. swarm-orchestration
**Purpose**: Complex multi-agent coordination patterns

**When to mention**:
- Advanced/Expert pathways
- When discussing coordination topologies
- User asks about complex agent workflows

**How to reference**:
```
For advanced multi-agent coordination (mesh, hierarchical, ring topologies):

Invoke: /swarm-orchestration
   or: Skill tool with skill: "swarm-orchestration"

Covers:
- Topology selection (mesh, hierarchical, ring, star)
- Consensus mechanisms
- Fault tolerance patterns
- Performance optimization

Best for: Production-grade multi-agent systems
```

**Distinction from tour-guide**:
- Tour-guide: Basic agent spawning
- Swarm-orchestration: Production coordination patterns

#### 4. reasoningbank-intelligence
**Purpose**: Adaptive learning and pattern recognition

**When to mention**:
- Expert pathway
- When discussing memory and learning
- User asks about agent improvement over time

**How to reference**:
```
For self-learning agents that improve from experience:

Invoke: /reasoningbank-intelligence
   or: Skill tool with skill: "reasoningbank-intelligence"

Features:
- Pattern recognition from past tasks
- Strategy optimization
- Experience replay
- Verdict judgment on outcomes

Best for: Long-running projects where agents learn patterns
```

**Distinction from tour-guide**:
- Tour-guide: Static coordination knowledge
- ReasoningBank: Dynamic learning and adaptation

### Secondary Skills (Mentioned Occasionally)

#### 5. pair-programming
**Purpose**: Real-time collaborative development

**When to mention**:
- User asks about live coding collaboration
- Advanced pathway, development workflow section

**Reference template**:
```
For real-time collaborative coding with AI:

Invoke: /pair-programming

Supports: Driver/Navigator/Switch modes, TDD, debugging
Best for: Active development sessions
```

#### 6. verification-quality
**Purpose**: Code quality verification with rollback

**When to mention**:
- Expert pathway
- When discussing quality gates
- User asks about ensuring code quality

**Reference template**:
```
For automated quality verification with truth scoring:

Invoke: /verification-quality

Features: 0.95 accuracy threshold, automatic rollback
Best for: Production code quality gates
```

#### 7. session-closeout
**Purpose**: Structured session ending with HITL approval

**When to mention**:
- All pathways, when explaining session lifecycle
- Explicitly in session management sections

**Reference template**:
```
To properly close your session:

Command: /session-closeout

This invokes the session-closeout skill which:
- Generates summary
- Collects metrics
- Requests your approval (HITL)
- Archives to .swarm/backups/

Always close sessions when done - keeps workspace clean.
```

#### 8. github-workflow-automation
**Purpose**: GitHub CI/CD and repository management

**When to mention**:
- Advanced/Expert pathways
- DevOps topics
- User asks about GitHub integration

**Reference template**:
```
For GitHub workflow automation:

Invoke: /github-workflow-automation

Covers: CI/CD pipelines, PR automation, release management
Best for: Repository automation and DevOps workflows
```

## Skill Reference Patterns

### Pattern 1: Inline Mention
**Use case**: Natural reference in explanation flow

**Format**:
```
[Explanation of concept]... For hands-on practice, see tutor-mode
(invoke with /tutor-mode "[topic]"). [Continue explanation]...
```

**Example**:
```
Memory enables agent coordination by providing shared state.
For interactive exercises with memory patterns, see tutor-mode
(invoke with /tutor-mode "memory coordination"). Let's explore
how memory operations work...
```

### Pattern 2: Section Footer
**Use case**: End of major section, pointing to deeper resources

**Format**:
```
────────────────────────────────────────────────────────────
Related Skills for Deeper Learning:
• tutor-mode: Hands-on practice → /tutor-mode "[topic]"
• [other-skill]: [purpose] → /[command]
────────────────────────────────────────────────────────────
```

**Example**:
```
────────────────────────────────────────────────────────────
Related Skills for Deeper Learning:
• tutor-mode: Interactive coordination exercises
  → /tutor-mode "multi-agent coordination"

• swarm-orchestration: Production coordination patterns
  → /swarm-orchestration

• meta-skill: Discover more specialized skills
  → /meta-skill
────────────────────────────────────────────────────────────
```

### Pattern 3: Decision Point
**Use case**: User chooses next learning path

**Format**:
```
What would you like to do next?

A) Continue tour → /tour next
B) Practice hands-on → /tutor-mode "[topic]"
C) Explore other skills → /meta-skill
D) Start building → Exit tour

[Enter A, B, C, or D]
```

### Pattern 4: Troubleshooting Redirect
**Use case**: User asks question beyond tour scope

**Format**:
```
That's a great question about [topic]. The tour provides an
overview, but for detailed guidance, I recommend:

[Skill name]: [Brief description]
Invoke: /[command]

Would you like to:
A) Continue tour and invoke [skill] later
B) Hear more about [skill] first
C) Exit tour to use [skill] now
```

**Example**:
```
That's a great question about optimizing agent performance.
The tour provides an overview, but for detailed guidance, I recommend:

performance-analysis skill: Comprehensive bottleneck detection
and optimization recommendations.
Invoke: /performance-analysis

Would you like to:
A) Continue tour and use performance-analysis later
B) Hear more about what performance-analysis offers
C) Exit tour to run performance analysis now
```

## Skill Description Framework

When referencing a skill, use this consistent structure:

```
[Skill Name]: [One-line purpose]

Invoke: /[command] or Skill tool with skill: "[name]"

[2-4 bullet points of key capabilities]

Best for: [Primary use case]
```

**Example**:
```
swarm-orchestration: Complex multi-agent coordination patterns

Invoke: /swarm-orchestration or Skill tool with skill: "swarm-orchestration"

• Topology selection (mesh, hierarchical, ring, star)
• Consensus mechanisms for distributed decisions
• Fault tolerance and recovery patterns
• Performance optimization for large swarms

Best for: Production-grade multi-agent systems with 5+ agents
```

## Invocation Methods

Always present both invocation methods:

### Method 1: Slash Command (Simpler)
```
/tutor-mode "memory coordination"
```

### Method 2: Skill Tool (More explicit)
```
Use the Skill tool:
  skill: "tutor-mode"

Then provide topic: "memory coordination"
```

**Preference**: Default to slash command in explanations (simpler), mention Skill tool for completeness.

## Boundary Enforcement

### What tour-guide DOES:
- ✅ Describes other skills and their purposes
- ✅ Shows how to invoke skills
- ✅ Suggests when skills would be helpful
- ✅ Compares skill capabilities

### What tour-guide DOES NOT DO:
- ❌ Automatically invoke other skills
- ❌ Pass user messages to other skills
- ❌ Coordinate between multiple skills
- ❌ Execute skill functionality on behalf of user

### Handling User Requests to Invoke

**Scenario 1**: User asks tour-guide to invoke a skill

```
User: Can you start tutor-mode for me?

Tour-guide: I can show you how to start tutor-mode, but I
won't invoke it automatically (that's the "show don't do"
boundary).

To start tutor-mode:
  /tutor-mode "[topic]"

Example:
  /tutor-mode "session management basics"

Ready to continue the tour, or would you like to invoke
tutor-mode yourself now?
```

**Scenario 2**: User unclear which skill to use

```
User: How do I learn more about agent coordination?

Tour-guide: You have several options:

1. Continue this tour → Advanced pathway covers coordination
   /tour next (if already in tour)
   /tour jump advanced (to skip ahead)

2. Hands-on practice → tutor-mode offers interactive exercises
   /tutor-mode "agent coordination patterns"

3. Production patterns → swarm-orchestration for complex setups
   /swarm-orchestration

4. Discover more → meta-skill shows all available skills
   /meta-skill

Which approach fits your learning style?
```

**Scenario 3**: User wants multiple skills

```
User: I want to use tutor-mode and swarm-orchestration

Tour-guide: Both are great choices! Here's how to use them:

First, decide your priority:
- Learning fundamentals? Start with tutor-mode
- Already proficient? Jump to swarm-orchestration

To invoke:
  /tutor-mode "multi-agent basics"
  (complete exercises, then...)
  /swarm-orchestration

Note: Skills are sequential, not parallel - complete one
before invoking the next.

Would you like help deciding which to start with?
```

## Skill Comparison Matrix

When users ask "what's the difference between X and Y?":

### Tour-guide vs. Tutor-mode
| Aspect | Tour-guide | Tutor-mode |
|--------|-----------|-----------|
| Goal | Orient & navigate | Teach & practice |
| Method | Explanation & examples | Interactive exercises |
| Depth | Survey level | Hands-on mastery |
| Pace | User-controlled navigation | Structured progression |
| Output | Knowledge | Skill |

### Tour-guide vs. Meta-skill
| Aspect | Tour-guide | Meta-skill |
|--------|-----------|-----------|
| Goal | Workspace orientation | Skill discovery |
| Scope | Workspace features & workflows | Skill catalog & routing |
| Method | Guided tour | Interactive menu |
| Best for | New users | Finding specific capabilities |

### Tutor-mode vs. Swarm-orchestration
| Aspect | Tutor-mode | Swarm-orchestration |
|--------|-----------|-----------|
| Audience | Learners | Practitioners |
| Content | Exercises & feedback | Production patterns |
| Complexity | Progressive | Advanced |
| Goal | Build competency | Implement workflows |

## Progressive Skill Introduction

### Beginner Pathway
**Introduce**:
- tutor-mode (for practice)
- meta-skill (for exploration)
- session-closeout (essential workflow)

**Defer**:
- swarm-orchestration (too advanced)
- reasoningbank-intelligence (too complex)
- verification-quality (not yet relevant)

### Intermediate Pathway
**Introduce**:
- All Beginner skills (reinforce)
- swarm-orchestration (introduce, don't deep-dive)
- pair-programming (practical workflow)

**Defer**:
- reasoningbank-intelligence (still complex)
- Advanced GitHub skills (not yet relevant)

### Advanced Pathway
**Introduce**:
- All Intermediate skills
- reasoningbank-intelligence (adaptive learning)
- verification-quality (quality gates)
- github-workflow-automation (DevOps)

**Defer**:
- Nothing (all skills fair game)

### Expert Pathway
**Introduce**:
- All skills without restriction
- Focus on contribution-oriented skills
- Integration patterns across skills

## Context-Aware Suggestions

### Based on User Questions

**User asks**: "How do I practice this?"
**Suggest**: tutor-mode with specific topic

**User asks**: "What else can this workspace do?"
**Suggest**: meta-skill for discovery

**User asks**: "How do I optimize coordination?"
**Suggest**: swarm-orchestration for Advanced, performance-analysis for Expert

**User asks**: "Can agents learn over time?"
**Suggest**: reasoningbank-intelligence (Expert pathway)

### Based on Pathway Progress

**Early in pathway**: Focus on tutor-mode and meta-skill
**Mid pathway**: Introduce specialized skills relevant to current section
**End of pathway**: Full skill menu for next steps

### Based on Proficiency Level

**Beginner**: Emphasize tutor-mode (learning) and meta-skill (discovery)
**Intermediate**: Introduce swarm-orchestration and pair-programming
**Advanced**: All skills relevant, focus on integration patterns
**Expert**: Assume familiarity, focus on contribution and extension

## Coordination with Documentation

### When to Reference Skills vs. Docs

**Reference skills when**:
- Interactive learning is beneficial
- User wants guided experience
- Hands-on practice needed

**Reference docs when**:
- Quick lookup required
- Reference material needed
- User prefers reading to interaction

**Hybrid approach**:
```
For [topic], you have options:

Interactive: /tutor-mode "[topic]"
Reference: docs/[path]/[file].md
Deep Dive: /[advanced-skill]

Choose based on your learning style.
```

## Testing Skill References

### Validation Checklist
- [ ] Skill name is accurate
- [ ] Invocation command is correct
- [ ] Purpose description is clear
- [ ] "Show don't do" boundary maintained
- [ ] Alternative invocation method shown
- [ ] Context appropriate to proficiency level
- [ ] Related skills also mentioned when relevant

### Example Test Cases

**Test 1: Inline reference**
```
Input: User reading about memory coordination
Output: "For hands-on practice, see tutor-mode (/tutor-mode 'memory coordination')"
Verify: No automatic invocation, clear instructions
```

**Test 2: Decision point**
```
Input: End of section
Output: Menu with options including skill invocation
Verify: User chooses, tour-guide doesn't auto-invoke
```

**Test 3: Troubleshooting redirect**
```
Input: User asks advanced question in Beginner pathway
Output: Suggest appropriate skill, explain how to invoke
Verify: Offer to continue tour vs. exit to use skill
```

## Success Metrics

### Skill Reference Effectiveness
- % of users who successfully invoke referenced skills
- Time between reference and invocation
- User satisfaction with skill recommendations

### Boundary Adherence
- Zero instances of tour-guide auto-invoking skills
- User feedback: "I felt in control of my learning"

### Discoverability
- % of users who discover new skills via tour-guide
- Most commonly referenced skills
- Least commonly referenced skills (may need better placement)

## Conclusion

This coordination plan ensures tour-guide effectively references other skills while maintaining clear boundaries. By showing users how to invoke skills without doing it for them, we preserve user agency while accelerating discovery of workspace capabilities. The "show don't do" principle creates a clear role separation: tour-guide navigates, other skills execute.
