---
name: tutor-mode
description: "Adaptive learning guide with full workspace documentation awareness. Provides personalized learning paths, context-aware exercises, and progress tracking through Claude-Flow fundamentals to advanced orchestration. Use when teaching new users, providing guidance on workflow patterns, or helping users progress through learning phases."
version: 1.0.0
category: learning
created: 2025-11-18
---

# Tutor Mode

## What This Skill Does

Tutor Mode is an intelligent learning assistant that guides users from Claude-Flow fundamentals through advanced multi-agent orchestration. It provides:

1. **Personalized Learning Paths** - Adapts to user's current knowledge level
2. **Context-Aware Guidance** - References verified workspace documentation with quality scoring
3. **Progressive Disclosure** - Reveals complexity as users advance
4. **Hands-On Exercises** - Real projects at each skill level
5. **Progress Tracking** - Monitors mastery and suggests next steps

## Prerequisites

- Claude Code 2.0+ or Claude.ai with Skills support
- This workspace with claude-flow installed
- Access to \`docs/\` and \`sessions/\` directories

---

## Quick Start (60 seconds)

### Get Learning Guidance

Ask the tutor anything about the workspace:
- "What is claude-flow?"
- "How do I spawn agents in parallel?"
- "What's the difference between mesh and hierarchical topology?"
- "How do I use memory coordination?"

### Check Your Progress

\`\`\`bash
# View your learning tracker
cat docs/learning/progress-tracker.md
\`\`\`

### Start a Learning Session

Ask: "I'm new to claude-flow, where should I start?"

The tutor will guide you through each phase.

---

## Learning Path Architecture

### Phase 1: Foundations (1-2 weeks)

**You'll Learn**:
- What claude-flow is and why parallel execution matters
- How to navigate the workspace
- Your first session and agent spawn
- Basic memory operations

**Milestone**: Spawn 3 agents in parallel and coordinate via memory

**Key Topics**:
- What is Claude-Flow? (`learning/01-foundations/what-is-claude-flow.md`)
- Workspace Tour (`learning/01-foundations/workspace-tour.md`)
- Your First Session (`learning/01-foundations/first-session.md`)
- Basic Memory Usage (`learning/01-foundations/basic-memory-usage.md`)

### Phase 2: Essential Skills (2-3 weeks)

**You'll Learn**:
- Spawning 5+ agents in parallel using Task tool
- The "one message" rule for batching operations
- Memory coordination patterns (handoffs, fan-out/fan-in)
- Session management with HITL approval

**Milestone**: Build a blog platform (backend + frontend + tests + docs)

**Key Topics**:
- Spawning Agents (`learning/02-essential-skills/spawning-agents.md`)
- Understanding Agent Definitions (see section below)
- Parallel Execution (`learning/02-essential-skills/parallel-execution.md`)
- Memory Coordination (`learning/02-essential-skills/memory-coordination.md`)
- Session Management (`learning/02-essential-skills/session-management.md`)

### Phase 3: Intermediate (3-4 weeks)

**You'll Learn**:
- Swarm topologies (mesh, hierarchical, star, ring)
- Queen selection strategies (strategic, tactical, adaptive)
- Consensus mechanisms (majority, weighted, Byzantine)
- Custom workflows with quality gates

**Milestone**: Distributed documentation system with 10+ agents

**Key Topics**:
- Swarm Topologies (`learning/03-intermediate/swarm-topologies.md`)
- Queen Selection (`learning/03-intermediate/queen-selection.md`)
- Consensus Mechanisms (`learning/03-intermediate/consensus-mechanisms.md`)
- Custom Workflows (`learning/03-intermediate/custom-workflows.md`)

### Phase 4: Advanced (Ongoing Mastery)

**You'll Learn**:
- Hive-Mind coordination with wizard
- Byzantine Fault Tolerance (BFT) consensus
- Adaptive topology switching at runtime
- ReasoningBank self-learning patterns

**Milestone**: Self-learning multi-agent system

**Key Topics**:
- Hive-Mind Coordination (`learning/04-advanced/hive-mind-coordination.md`)
- Byzantine Consensus (`learning/04-advanced/byzantine-consensus.md`)
- Adaptive Topology (`learning/04-advanced/adaptive-topology.md`)
- ReasoningBank Learning (`learning/04-advanced/reasoning-bank.md`)

---

## Step-by-Step Learning Guide

### Step 1: Assess Your Current Level

**Ask the Tutor**: "What should I learn first based on my experience?"

The tutor will ask:
- Have you used multi-agent systems before?
- Do you understand parallel execution?
- Have you worked with memory coordination?
- What's your programming background?

**Recommendations**:
- **Complete Beginner** → Phase 1: Foundations
- **Some Experience** → Phase 2: Essential Skills
- **Advanced User** → Phase 3: Intermediate or Phase 4

### Step 2: Start Your Learning Path

**Phase 1 Example** (Complete Beginner):

\`\`\`bash
# 1. Read the overview
cat docs/learning/00-start-here.md

# 2. Learn what claude-flow is
cat docs/learning/01-foundations/what-is-claude-flow.md

# 3. Take the workspace tour
cat docs/learning/01-foundations/workspace-tour.md

# 4. Try your first session
# (Follow the guide in first-session.md)
\`\`\`

**Ask the Tutor**: "Walk me through spawning my first agent step-by-step"

### Step 3: Complete Hands-On Exercises

Each phase includes exercises. The tutor will guide you through them.

**Phase 1 Exercise**:
\`\`\`bash
# Exercise: Spawn 3 agents and coordinate via memory
# The tutor will provide:
# - Exact commands to run
# - Expected output at each step
# - How to verify success
# - Common mistakes to avoid
\`\`\`

**Ask**: "Show me the Phase 1 exercise with step-by-step instructions"

### Step 4: Track Your Progress

**Update your progress tracker**:
\`\`\`bash
# Open the tracker
nano docs/learning/progress-tracker.md

# Check off completed skills:
- [x] Can explain claude-flow in one sentence
- [x] Understand parallel execution benefits
- [ ] Know the difference between agents, memory, and sessions
\`\`\`

**Ask**: "Review my progress tracker and suggest what to learn next"

### Step 5: Apply What You Learned

**Build real projects**:

- **Phase 1 Project**: Single-agent task with memory storage
- **Phase 2 Project**: 5-agent blog platform (backend, frontend, tests, docs, reviewer)
- **Phase 3 Project**: 10-agent documentation system with consensus
- **Phase 4 Project**: Self-learning system with ReasoningBank

**Ask**: "Help me design a project to practice Phase 2 skills"

---

## Advanced Features

### Context-Aware Answers

The tutor uses the **weighting schema** to provide quality-scored references.

**When you ask a question**, the tutor:
1. Searches workspace documentation
2. Checks quality scores (SAFE ≥70, CAUTIONARY 40-69, EXCLUDE <40)
3. Provides answers with confidence levels
4. Warns about unverified content

**Example**:
\`\`\`
You: "How do I use Byzantine consensus?"

Tutor:
"Byzantine consensus requires 2/3 majority for decisions.

📚 SAFE Reference (Score: 95):
docs/learning/04-advanced/byzantine-consensus.md
- Verified implementation
- 100% test pass rate

📚 Architecture Reference:
docs/reality/architecture.md
- System design and internals
- Data flow and coordination

Usage:
npx claude-flow hive-mind spawn 'task' --consensus byzantine
"
\`\`\`

### Adaptive Learning Paths

The tutor adapts based on:
- **Your Questions** - Tracks topics you ask about
- **Your Progress** - Monitors skills you've mastered
- **Your Projects** - Learns from what you build
- **Your Challenges** - Identifies where you struggle

**Storage**:
\`\`\`javascript
// Tutor stores your learning profile in memory
{
  namespace: "tutor-mode/user-profile",
  phase: "essential-skills",
  completed_skills: ["spawning-agents", "parallel-execution"],
  next_milestone: "memory-coordination",
  learning_velocity: "fast",
  preferred_style: "hands-on"
}
\`\`\`

### Exercise Generation

**Ask for exercises at your level**:

"Give me an exercise to practice memory coordination"

The tutor will generate:
1. Exercise description and goals
2. Step-by-step implementation guide
3. Expected output and verification
4. Extension challenges
5. Solution code (revealed on request)

**Exercise Difficulty Levels**:
- **Beginner** (Phase 1): Follow exact steps
- **Intermediate** (Phase 2-3): Guided implementation with hints
- **Advanced** (Phase 4): Open-ended problems with requirements only

### Progress Milestones

**The tutor tracks milestones**:

- **Phase 1**: Spawn 3 agents, coordinate via memory
- **Phase 2**: Build blog platform (5 agents, parallel execution)
- **Phase 3**: Distributed docs system (10+ agents, consensus)
- **Phase 4**: Self-learning system (ReasoningBank, adaptive topology)

**Ask**:
- "What milestone should I work toward next?"
- "Show me examples of Phase 2 milestone projects"
- "How close am I to completing Phase 3?"

---

## Integration with Workspace

### Documentation References

The tutor knows about all workspace documentation:

**Core Documentation**:
- \`CLAUDE.md\` (Score: 100) - User configuration and protocols
- \`docs/reality/architecture.md\` (95) - System design and internals
- \`docs/essentials/session-management.md\` (95) - Session lifecycle
- \`docs/essentials/troubleshooting.md\` (90) - Common issues and solutions

**Learning Materials**:
- \`docs/learning/\` - Structured tutorials (4 phases)
- \`docs/essentials/\` - Quick start and core skills
- \`docs/advanced/\` - Advanced coordination patterns
- \`docs/reality/\` - What actually works (honest assessment)

The tutor references these automatically when answering questions.

### Memory Integration

**The tutor uses memory for**:
- Storing your learning profile
- Tracking completed exercises
- Recording successful patterns
- Sharing knowledge across sessions

**Memory Namespaces**:
\`\`\`
tutor-mode/user-profile        # Your learning state
tutor-mode/exercises/{id}      # Exercise history
tutor-mode/patterns/{name}     # Successful patterns
tutor-mode/questions/{topic}   # FAQ responses
\`\`\`

### Session Integration

**The tutor respects session boundaries**:
- All exercise code goes to \`sessions/\$SESSION_ID/artifacts/code/\`
- All exercise docs go to \`sessions/\$SESSION_ID/artifacts/docs/\`
- Progress updates saved to session artifacts
- No root file pollution

**Starting a learning session**:
\`\`\`bash
# Start a dedicated learning session
/session-start learning-phase-2

# Tutor will guide you through exercises
# All work saved to session artifacts

# Close when done
/session-closeout
\`\`\`

---

## System Architecture: Stock vs. Custom

### Understanding the Boundary
This workspace is built on a "Stock-First" philosophy, meaning we use the powerful native engine for execution and only add thin custom layers for organization.

1. **Stock Claude Code** (The Execution Layer):
   - CLI interface
   - Task() tool for parallel execution
   - File operations

2. **Stock Claude Flow** (The Orchestration Layer):
   - **SPARC Methodology**: Native systematic development process
   - **Orchestration Topologies**: Mesh, Hierarchical, Star, Ring (Native)
   - **ReasoningBank**: Native learning system
   - **Custom Commands**: Native engine for slash commands
   - **Skill Integration**: Native framework

3. **Custom Extensions** (The User Layer):
   - **Session Management**: Organization protocol for containment
   - **Interactive Learning**: Tutor Mode and Tour Guide skills
   - **Captains Log**: Documentation protocol

### Why This Matters
Knowing what is "Stock" helps you trust the system. When you use SPARC or Parallel Execution, you are using the core, battle-tested engine, not a custom script. When you use Tutor Mode, you are using a helpful custom guide layered on top.

---

## Understanding Agent Definitions

### What Are Agent Definitions?

Agent definition files in `.claude/agents/` are **reference documentation** for agent types. They are NOT automatically loaded when you use Task() tool, but they provide valuable information about agent capabilities and behavior.

### Key Concepts

1. **Agent Definitions vs Agent Types**:
   - Agent definitions: Reference documentation files (`.claude/agents/core/coder.md`)
   - Agent types: String identifiers used in Task() tool (`"coder"`, `"researcher"`)
   - Task() uses agent-type as semantic hint, NOT file reference

2. **What Agent Definitions Contain**:
   - YAML frontmatter: Metadata (name, type, capabilities, hooks)
   - Markdown content: Detailed prompts and instructions
   - Hooks examples: Reference examples (not automatically executed)
   - Capability descriptions: What the agent can do

3. **How to Use Agent Definitions**:
   - **Reference**: Check definitions to understand agent capabilities
   - **Documentation**: Learn what each agent type does
   - **Templates**: Use as templates when creating custom agents
   - **Coordination**: Reference hooks examples for coordination patterns

### Practical Usage

**Example: Understanding Coder Agent**
```javascript
// Check agent definition for capabilities
Read: .claude/agents/core/coder.md

// Learn what coder agent does:
// - Code implementation
// - API design
// - Refactoring
// - Optimization
// - Error handling

// Use in Task() with semantic understanding
Task("Backend Developer", "Implement REST API. Save to sessions/$SESSION_ID/artifacts/code/.", "coder")
//                    ↑
//            Agent-type is semantic hint
//            NOT loaded from coder.md file
```

**Example: Creating Custom Agent**
```javascript
// Use agent definition as template
1. Copy structure from .claude/agents/core/coder.md
2. Modify YAML frontmatter for your agent
3. Update markdown content with your prompts
4. Use new agent-type in Task() calls
```

### Common Misconceptions

❌ **Wrong**: "Agent definitions are automatically loaded when I use Task()"
✅ **Correct**: "Agent definitions are reference documentation. Task() uses agent-type as semantic hint."

❌ **Wrong**: "I need to load agent definitions manually"
✅ **Correct**: "Agent definitions are optional reference material. Task() works without them."

❌ **Wrong**: "Agent definition hooks are automatically executed"
✅ **Correct**: "Agent definition hooks are examples. Workspace hooks in .claude/settings.json are executed."

### Advanced: Agent Definition Hooks

Agent definitions contain hooks in YAML frontmatter, but these are **reference examples**, not automatically executed code.

**Workspace Hooks** (actually executed):
- Configured in `.claude/settings.json`
- Fire automatically via Claude Code native hooks
- PreToolUse: Before file operations
- PostToolUse: After file operations

**Agent Definition Hooks** (reference examples):
- Shown in YAML frontmatter
- Demonstrate coordination patterns
- NOT automatically executed
- Use as reference for custom hooks

### Best Practices

1. **Use as Reference**: Check agent definitions to understand capabilities
2. **Don't Expect Auto-Loading**: Task() works independently
3. **Learn Patterns**: Study hooks examples for coordination ideas
4. **Create Custom**: Use definitions as templates for custom agents
5. **Stay Stock-First**: Keep definitions as reference, don't modify core behavior

---

## Common Questions

### "Where do I start if I'm completely new?"

**Answer**: Start with \`00-start-here.md\` in the learning artifacts.

Then follow Phase 1 in order:
1. What is Claude-Flow? (10 min read)
2. Workspace Tour (15 min hands-on)
3. Your First Session (30 min exercise)
4. Basic Memory Usage (20 min exercise)

**Time commitment**: ~2 hours for Phase 1 basics.

### "How do I know when I'm ready for the next phase?"

**Criteria for advancement**:

- **Phase 1 → Phase 2**: Can spawn 3 agents and coordinate via memory
- **Phase 2 → Phase 3**: Built a 5-agent project (blog platform or equivalent)
- **Phase 3 → Phase 4**: Distributed system with 10+ agents and consensus

**Ask**: "Am I ready for Phase 3?"

The tutor will check your progress tracker and recent projects.

### "What if I get stuck on an exercise?"

**The tutor provides help at multiple levels**:

1. **Hint** - Nudge in the right direction
2. **Explanation** - Clarify concepts
3. **Example** - Show similar working code
4. **Solution** - Complete working implementation

**Ask**:
- "I'm stuck on the memory coordination exercise, can you give me a hint?"
- "Show me an example of fan-out/fan-in pattern"
- "I need the solution for the Phase 2 blog platform project"

### "How long does it take to reach mastery?"

**Typical Timeline** (based on workspace experience):

- **Phase 1: Foundations**: 1-2 weeks (part-time)
- **Phase 2: Essential Skills**: 2-3 weeks
- **Phase 3: Intermediate**: 3-4 weeks
- **Phase 4: Advanced**: Ongoing (3-6 months to mastery)

**Total to Advanced**: ~8-12 weeks of consistent practice

**Factors affecting speed**:
- Prior multi-agent experience
- Programming background
- Time commitment (part-time vs full-time)
- Learning style (hands-on vs conceptual)

### "Can I skip phases if I have experience?"

**Yes, but verify your knowledge first**.

**Ask**: "I've used multi-agent systems before, can I skip Phase 1?"

The tutor will give you a **quick assessment exercise**:
- If you complete it correctly → Skip to next phase
- If you struggle → Review the phase materials

---

## Troubleshooting

### Issue: "I can't find the learning documents"

**Symptoms**: 404 errors or file not found

**Solution**:
\`\`\`bash
# Learning docs are in permanent location
ls -la docs/learning/

# Navigate to learning docs
cd docs/learning/

# Or use absolute paths
cat docs/learning/00-start-here.md
\`\`\`

### Issue: "The tutor gives outdated information"

**Symptoms**: References don't match current workspace

**Solution**: Ask the tutor to check source quality:
- "What's the quality score for that reference?"
- If CAUTIONARY or EXCLUDE: "Can you provide a SAFE reference instead?"

### Issue: "Exercises are too hard/easy"

**Too Hard**: "Give me an easier version of this exercise"
**Too Easy**: "Give me a harder challenge for this skill"

The tutor adapts difficulty based on feedback.

### Issue: "I completed Phase 2 but feel unprepared for Phase 3"

**Ask**: "Audit my Phase 2 skills and identify gaps"

The tutor will:
1. Review your progress tracker
2. Check completed exercises
3. Identify weak areas
4. Suggest targeted practice

---

## Expert Tips

### Tip 1: Learn by Building Real Projects

Don't just read tutorials - build real projects at each phase.

**Ask**: "Help me design a Phase 2 project that teaches essential skills"

### Tip 2: Use the Progress Tracker

Track your learning systematically:
- Check off skills as you master them
- Note completion dates
- Document lessons learned
- Set goals for next milestones

**Location**: \`docs/learning/progress-tracker.md\`

### Tip 3: Master One Phase Before Moving On

Weak foundations lead to confusion later. The tutor enforces milestones to ensure you're ready.

### Tip 4: Ask for Examples from Workspace

The workspace has real examples from completed projects.

**Ask**: "Show me a real example of Byzantine consensus from workspace sessions"

### Tip 5: Experiment in Dedicated Learning Sessions

\`\`\`bash
# Start a learning session
/session-start learning-experiment

# Try new patterns, break things, learn

# Close without fear
/session-closeout
\`\`\`

Learning sessions are for mistakes - production sessions are for quality.

---

## API Reference

### Tutor Commands (Natural Language)

**Getting Started**:
- "Where should I start?"
- "What's my current learning phase?"
- "Show me the learning roadmap"

**Phase Navigation**:
- "Start Phase 1"
- "What's next in Phase 2?"
- "Am I ready for Phase 3?"

**Exercises**:
- "Give me a Phase 2 exercise"
- "Show me the solution for [exercise]"
- "What's a harder version of this exercise?"

**Progress Tracking**:
- "Review my progress"
- "What skills have I mastered?"
- "What should I learn next?"

**Questions**:
- "What is [concept]?"
- "How do I [task]?"
- "Show me an example of [pattern]"

**Help**:
- "I'm stuck on [topic]"
- "Give me a hint for [problem]"
- "Explain [concept] in simpler terms"

### Memory Schema

**User Profile** (\`tutor-mode/user-profile\`):
\`\`\`json
{
  "phase": "essential-skills",
  "completed_skills": ["spawning-agents", "parallel-execution"],
  "next_milestone": "memory-coordination",
  "learning_velocity": "fast",
  "preferred_style": "hands-on"
}
\`\`\`

**Exercise History** (\`tutor-mode/exercises/{id}\`):
\`\`\`json
{
  "exercise_id": "phase2-blog-platform",
  "phase": 2,
  "completed": true,
  "attempts": 2,
  "time_spent_minutes": 120,
  "lessons_learned": ["Memory handoffs critical"]
}
\`\`\`

---

## Slash Commands Reference

The tutor-mode skill provides interactive commands for guided learning:

### `/tutor start`
Begin your learning journey or start a new phase.

**Usage**:
```
/tutor start
/tutor start phase-2
/tutor start intermediate
```

**What it does**:
- Assesses your current knowledge level
- Recommends appropriate starting phase
- Creates a personalized learning roadmap
- Sets up progress tracking

### `/tutor assess`
Evaluate your current skill level and readiness for next phase.

**Usage**:
```
/tutor assess
/tutor assess phase-2
/tutor assess current
```

**What it does**:
- Tests your knowledge with quick exercises
- Identifies skill gaps
- Recommends focus areas
- Determines phase readiness

### `/tutor next`
Get the next lesson or exercise in your learning path.

**Usage**:
```
/tutor next
/tutor next lesson
/tutor next exercise
```

**What it does**:
- Shows your next recommended lesson
- Provides context on why it's important
- Estimates time commitment
- Links to relevant documentation

### `/tutor explain <topic>`
Get detailed explanation of a concept with examples.

**Usage**:
```
/tutor explain memory-coordination
/tutor explain byzantine-consensus
/tutor explain parallel-execution
```

**What it does**:
- Provides clear, level-appropriate explanations
- Shows real-world examples from workspace
- References SAFE documentation (score ≥70)
- Offers interactive examples

### `/tutor exercise <phase>`
Get a hands-on exercise for your current level.

**Usage**:
```
/tutor exercise
/tutor exercise phase-1
/tutor exercise intermediate
```

**What it does**:
- Generates level-appropriate exercises
- Provides step-by-step guidance
- Includes solution and verification steps
- Tracks completion in memory

### `/tutor progress`
Review your learning progress and achievements.

**Usage**:
```
/tutor progress
/tutor progress detailed
/tutor progress summary
```

**What it does**:
- Shows completed lessons and exercises
- Displays mastery levels for each skill
- Calculates phase completion percentage
- Suggests next milestones

### `/tutor help`
Get help with the tutor system or specific topics.

**Usage**:
```
/tutor help
/tutor help commands
/tutor help stuck
```

**What it does**:
- Lists all available commands
- Provides troubleshooting guidance
- Suggests resources for common issues
- Connects you with appropriate documentation

---

## Memory Integration & Progress Tracking

### Memory Namespaces

The tutor-mode skill uses the `.swarm/memory.db` for persistent tracking:

**Progress Tracking** (`tutor-progress`):
```json
{
  "currentPhase": "essential-skills",
  "completedLessons": [
    "foundations/what-is-claude-flow",
    "foundations/workspace-tour",
    "foundations/first-session"
  ],
  "skillLevels": {
    "parallel-execution": "intermediate",
    "memory-coordination": "beginner",
    "swarm-topology": "not-started"
  },
  "exercisesCompleted": 7,
  "weakAreas": ["consensus-mechanisms", "byzantine-tolerance"],
  "lastActivity": "2025-11-18T10:30:00Z"
}
```

**Exercise History** (`tutor-exercises`):
```json
{
  "exercise-f1-spawn-agents": {
    "phase": 1,
    "completed": true,
    "attempts": 2,
    "timeSpent": "45min",
    "score": 85,
    "feedback": "Good work on parallel spawning"
  }
}
```

**Assessments** (`tutor-assessments`):
```json
{
  "phase-1-assessment": {
    "date": "2025-11-18",
    "score": 90,
    "passed": true,
    "readyForPhase2": true,
    "strengths": ["agent-spawning", "basic-memory"],
    "weaknesses": ["session-closeout"]
  }
}
```

### Progress Tracking Structure

The tutor automatically tracks:

1. **currentPhase** - Your active learning phase (foundations, essential-skills, intermediate, advanced)
2. **completedLessons** - Array of finished lesson identifiers
3. **skillLevels** - Mastery level for each skill (not-started, beginner, intermediate, advanced, expert)
4. **exercisesCompleted** - Count of finished hands-on exercises
5. **weakAreas** - Topics requiring additional practice

### Accessing Your Progress

**Via Memory Tool**:
```javascript
// Retrieve progress
mcp__claude-flow_alpha__memory_usage({
  action: "retrieve",
  key: "user-progress",
  namespace: "tutor-progress"
})

// Update skill level
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "user-progress",
  namespace: "tutor-progress",
  value: JSON.stringify({
    skillLevels: {
      "parallel-execution": "advanced"
    }
  })
})
```

**Via Slash Command**:
```
/tutor progress detailed
```

---

## Exercises & Assessments

### Foundations Exercises

#### Exercise F1: Your First Agent Spawn
**Goal**: Spawn a single agent and verify it runs correctly.

**Prerequisites**: Completed workspace tour

**Steps**:
1. Start a learning session: `/session-start learning-f1`
2. Spawn a researcher agent: Use Task tool with "Research agent" description
3. Verify agent completes: Check session artifacts
4. Store result in memory: Use memory tool to record completion

**Success Criteria**:
- ✅ Agent spawns without errors
- ✅ Agent produces output in session artifacts
- ✅ Memory records exercise completion
- ✅ Session closes cleanly

**Time**: 20-30 minutes

#### Exercise F2: Memory Basics
**Goal**: Store and retrieve data using memory coordination.

**Prerequisites**: Exercise F1 completed

**Steps**:
1. Store a key-value pair in memory
2. Spawn an agent that retrieves the value
3. Verify data persistence across agent boundaries
4. Clean up memory namespace

**Success Criteria**:
- ✅ Data stored successfully
- ✅ Agent retrieves correct value
- ✅ Memory persists across operations
- ✅ Cleanup completes without errors

**Time**: 20-30 minutes

#### Exercise F3: Parallel Agent Spawning
**Goal**: Spawn 3 agents in parallel and coordinate their work.

**Prerequisites**: Exercises F1 and F2 completed

**Steps**:
1. Define 3 agent tasks (researcher, coder, documenter)
2. Spawn all 3 in a single message using Task tool
3. Coordinate data sharing via memory
4. Verify all agents complete successfully

**Success Criteria**:
- ✅ All 3 agents spawn in one message
- ✅ Agents run concurrently (not sequentially)
- ✅ Data shared correctly via memory
- ✅ All outputs present in session artifacts

**Time**: 45-60 minutes

### Essential Skills Exercises

#### Exercise E1: 5-Agent Blog Platform
**Goal**: Build a simple blog with backend, frontend, tests, docs, and reviewer.

**Prerequisites**: All Foundations exercises completed

**Steps**:
1. Design the system architecture
2. Spawn 5 agents in parallel: backend-dev, coder (frontend), tester, documenter, reviewer
3. Coordinate via memory handoffs
4. Integrate components
5. Verify complete system

**Success Criteria**:
- ✅ All 5 agents spawn in single message
- ✅ Backend API functional
- ✅ Frontend renders correctly
- ✅ Tests achieve >80% coverage
- ✅ Documentation complete

**Time**: 2-3 hours

#### Exercise E2: Memory Coordination Patterns
**Goal**: Implement fan-out/fan-in pattern with 6 agents.

**Prerequisites**: Exercise E1 completed

**Steps**:
1. One coordinator agent spawns 5 worker agents
2. Workers process tasks in parallel
3. Coordinator aggregates results
4. All coordination via memory

**Success Criteria**:
- ✅ Fan-out pattern implemented correctly
- ✅ Workers execute in parallel
- ✅ Fan-in aggregation successful
- ✅ No race conditions or data loss

**Time**: 1-2 hours

#### Exercise E3: Session Management
**Goal**: Practice full session lifecycle with HITL approval.

**Prerequisites**: Exercises E1 and E2 completed

**Steps**:
1. Start session with topic
2. Execute multi-agent workflow
3. Generate session summary
4. Close with HITL approval
5. Verify archive creation

**Success Criteria**:
- ✅ Session starts correctly
- ✅ All artifacts in session directory
- ✅ Summary generated automatically
- ✅ Closeout completes with approval
- ✅ Archive created in .swarm/backups/

**Time**: 1-2 hours

#### Exercise E4: Explore Agent Definitions
**Goal**: Understand what agent definitions are and how to use them.

**Prerequisites**: Exercise E1 completed

**Steps**:
1. List all agent definitions: `ls -R .claude/agents/`
2. Read a core agent definition: `read .claude/agents/core/coder.md`
3. Identify YAML frontmatter sections
4. Note capabilities listed
5. Spawn agent using agent-type from definition
6. Verify agent-type is semantic hint (not file reference)

**Questions to Answer**:
- What information do agent definitions contain?
- How do agent definitions relate to Task() tool?
- Are agent definitions automatically loaded?
- How can you use agent definitions as reference?

**Success Criteria**:
- ✅ Can locate agent definition files
- ✅ Understands YAML frontmatter structure
- ✅ Recognizes agent definitions as reference documentation
- ✅ Successfully spawns agent using agent-type
- ✅ Understands agent-type is semantic hint, not file reference

**Expected Outcome**: Clear understanding that agent definitions are reference documentation, not runtime code.

**Time**: 20-30 minutes

### Intermediate Exercises

#### Exercise I1: Swarm Topology Selection
**Goal**: Implement 3 different topologies and compare performance.

**Prerequisites**: All Essential Skills exercises completed

**Steps**:
1. Implement mesh topology for distributed task
2. Implement hierarchical topology for same task
3. Implement star topology for same task
4. Measure and compare performance
5. Document findings

**Success Criteria**:
- ✅ All 3 topologies function correctly
- ✅ Performance metrics collected
- ✅ Clear winner identified for use case
- ✅ Findings documented with rationale

**Time**: 3-4 hours

#### Exercise I2: Queen Selection & Consensus
**Goal**: Implement queen-based coordination with majority consensus.

**Prerequisites**: Exercise I1 completed

**Steps**:
1. Spawn 7 agents in mesh topology
2. Implement queen election (strategic mode)
3. Coordinate decision-making via queen
4. Implement majority consensus for key decisions
5. Verify consensus accuracy

**Success Criteria**:
- ✅ Queen elected correctly
- ✅ Queen coordinates effectively
- ✅ Consensus mechanism works (4/7 majority)
- ✅ Decisions tracked in memory
- ✅ No split-brain scenarios

**Time**: 3-4 hours

#### Exercise I3: Custom Workflow with Quality Gates
**Goal**: Build a deployment pipeline with automated quality checks.

**Prerequisites**: Exercises I1 and I2 completed

**Steps**:
1. Design 5-stage pipeline (code, test, review, security, deploy)
2. Implement quality gates between stages
3. Configure automatic rollback on failure
4. Test with intentional failures
5. Verify quality enforcement

**Success Criteria**:
- ✅ All 5 stages implemented
- ✅ Quality gates block bad code
- ✅ Rollback functions correctly
- ✅ Pipeline recoverable after failures
- ✅ Metrics tracked in memory

**Time**: 4-6 hours

### Advanced Exercises

#### Exercise A1: Byzantine Fault Tolerance
**Goal**: Implement BFT consensus with 10 agents (3 Byzantine).

**Prerequisites**: All Intermediate exercises completed

**Steps**:
1. Spawn 10 agents in mesh topology
2. Configure 3 agents as Byzantine (faulty)
3. Implement BFT consensus (7/10 required)
4. Test decision-making with Byzantine nodes
5. Verify system resilience

**Success Criteria**:
- ✅ 10 agents coordinate correctly
- ✅ Byzantine agents don't corrupt decisions
- ✅ Consensus achieves 2/3+ majority
- ✅ System tolerates up to 3 failures
- ✅ Performance acceptable (<2s per decision)

**Time**: 6-8 hours

#### Exercise A2: Adaptive Topology Switching
**Goal**: Implement runtime topology changes based on workload.

**Prerequisites**: Exercise A1 completed

**Steps**:
1. Start with hierarchical topology
2. Monitor performance metrics
3. Detect bottleneck conditions
4. Switch to mesh topology automatically
5. Verify seamless transition

**Success Criteria**:
- ✅ Bottleneck detection accurate
- ✅ Topology switch completes <5s
- ✅ No data loss during transition
- ✅ Performance improves post-switch
- ✅ Decision logic documented

**Time**: 6-8 hours

#### Exercise A3: Self-Learning System with ReasoningBank
**Goal**: Build a system that learns from past decisions.

**Prerequisites**: Exercises A1 and A2 completed

**Steps**:
1. Implement ReasoningBank trajectory tracking
2. Record decision outcomes (success/failure)
3. Train pattern recognition from history
4. Apply learned patterns to new problems
5. Measure improvement over time

**Success Criteria**:
- ✅ Trajectory tracking functional
- ✅ Learning improves decision quality
- ✅ Pattern recognition >70% accurate
- ✅ System adapts to feedback
- ✅ Performance gains measurable

**Time**: 8-12 hours

---

## Interactive Learning Modes

### Explain Like I'm 5 (ELI5)
For complex topics, request simple explanations:

**Usage**: `/tutor explain memory-coordination --mode eli5`

**Example**:
```
You: Explain Byzantine consensus like I'm 5

Tutor:
Imagine 10 friends trying to decide on pizza toppings.
Some friends might be silly and give wrong answers on purpose.

Byzantine consensus says: "If 7 out of 10 friends agree,
we trust that answer, even if 3 friends are being silly."

That's how agents make decisions when some agents might be faulty!
```

### Show Me The Code
Request concrete code examples instead of theory:

**Usage**: `/tutor exercise e1 --mode code-first`

**Example**:
```
You: Show me how to spawn 3 agents in parallel

Tutor:
Here's the exact code:

[Single Message]:
  Task("Research agent", "Analyze requirements. Save to sessions/$SESSION_ID/artifacts/code/", "researcher")
  Task("Coder agent", "Implement features. Coordinate via memory.", "coder")
  Task("Tester agent", "Write tests. Check memory for API contracts.", "tester")

That's it! All 3 spawn at once in one message.
```

### Test My Knowledge
Interactive quizzes to verify understanding:

**Usage**: `/tutor assess --mode quiz`

**Example**:
```
Tutor: Quick quiz on parallel execution!

Question 1: How many agents can you spawn in one message?
A) Only 1
B) Up to 3
C) Up to 10
D) Unlimited

[User answers]

Tutor: Correct! The answer is D - unlimited.
The "one message" rule means you should spawn ALL agents
for a task in a single message, no matter how many.
```

### Why Does This Matter?
Context on real-world applications:

**Usage**: `/tutor explain memory-coordination --mode why`

**Example**:
```
You: Why does memory coordination matter?

Tutor:
Without memory coordination:
- Agents can't share data
- You need manual handoffs
- Race conditions occur
- Work gets duplicated

With memory coordination:
- Agents share state automatically
- Handoffs are clean and tracked
- No race conditions (atomic operations)
- Work divided efficiently

Real example from workspace:
In session-20251116-215913-inbox-cleanup, 6 agents
coordinated via memory to analyze 50+ files without
duplicating work or missing files.
```

---

## Success Criteria by Phase

### Phase 1: Foundations Success Criteria

**Knowledge**:
- ✅ Can explain claude-flow in one sentence
- ✅ Understands parallel execution benefits
- ✅ Knows difference between agents, memory, and sessions
- ✅ Can navigate workspace documentation

**Skills**:
- ✅ Spawns single agent successfully
- ✅ Uses memory to store/retrieve data
- ✅ Spawns 3 agents in parallel
- ✅ Manages basic session lifecycle

**Time Commitment**: 2-4 hours to complete Phase 1

**Advancement Criteria**: Complete Exercise F3 successfully

### Phase 2: Essential Skills Success Criteria

**Knowledge**:
- ✅ Understands "one message" rule importance
- ✅ Knows memory coordination patterns (handoff, fan-out/fan-in)
- ✅ Can explain session artifacts structure
- ✅ Understands HITL approval process
- ✅ Understands agent definitions are reference documentation (not automatically loaded)
- ✅ Knows difference between agent definitions and agent types

**Skills**:
- ✅ Spawns 5+ agents in one message
- ✅ Implements memory handoffs correctly
- ✅ Builds complete multi-agent projects
- ✅ Manages session lifecycle with HITL

**Time Commitment**: 1-2 days of focused practice

**Advancement Criteria**: Complete Exercise E1 (blog platform)

### Phase 3: Intermediate Success Criteria

**Knowledge**:
- ✅ Understands all 4 swarm topologies (mesh, hierarchical, star, ring)
- ✅ Knows queen selection strategies (strategic, tactical, adaptive)
- ✅ Can explain consensus mechanisms (majority, weighted, Byzantine)
- ✅ Understands quality gates and rollback patterns

**Skills**:
- ✅ Implements appropriate topology for use case
- ✅ Configures queen-based coordination
- ✅ Builds custom workflows with quality gates
- ✅ Manages 10+ agent systems

**Time Commitment**: 1-2 weeks of consistent practice

**Advancement Criteria**: Complete Exercise I3 (deployment pipeline)

### Phase 4: Advanced Success Criteria

**Knowledge**:
- ✅ Understands Byzantine Fault Tolerance theory
- ✅ Knows adaptive topology switching algorithms
- ✅ Can explain ReasoningBank learning patterns
- ✅ Masters meta-cognitive system design

**Skills**:
- ✅ Implements BFT consensus correctly
- ✅ Builds adaptive topology systems
- ✅ Integrates ReasoningBank for learning
- ✅ Designs self-improving agent systems

**Time Commitment**: 3-6 months to mastery

**Advancement Criteria**: Complete all Advanced exercises + build production system

---

## Getting Help

### When You're Stuck

**Levels of Help**:

1. **Hint** - Gentle nudge in right direction
   - `/tutor help hint <exercise>`
   - Example: "Check the memory namespace - is it correct?"

2. **Explanation** - Clarify the concept
   - `/tutor explain <concept>`
   - Example: "Let me explain how memory handoffs work..."

3. **Example** - Show similar working code
   - `/tutor example <pattern>`
   - Example: "Here's a working fan-out/fan-in pattern..."

4. **Solution** - Complete implementation
   - `/tutor exercise <id> --solution`
   - Example: "Here's the full Exercise E1 solution..."

### Common Issues

**Issue: "I don't understand parallel execution"**
→ `/tutor explain parallel-execution --mode eli5`

**Issue: "My agents aren't coordinating"**
→ `/tutor help hint memory-coordination`

**Issue: "I'm stuck on Exercise I2"**
→ `/tutor exercise i2 --hint`

**Issue: "How do I know if I'm ready for Phase 3?"**
→ `/tutor assess phase-3`

**Issue: "The exercise is too hard"**
→ `/tutor exercise <id> --easier`

**Issue: "I need a real-world example"**
→ `/tutor example <pattern> --from-workspace`

### Captain's Log Integration

The tutor-mode skill integrates with the workspace Captain's Log:

**Location**: `sessions/captains-log/YYYY-MM-DD.md`

**What Gets Logged**:
- Phase completions
- Exercise completions
- Skill level advances
- Assessment results
- Milestone achievements

**Example Entry**:
```markdown
## 2025-11-18 - Tutor Progress

### Phase 1 Completed ✅
- Time: 3.5 hours
- Exercises: F1, F2, F3
- Skills: spawning-agents (intermediate), memory-basics (intermediate)
- Next: Begin Phase 2 - Essential Skills

### Notable Achievements
- First 3-agent parallel spawn successful
- Memory coordination pattern mastered
- Session management fundamentals solid
```

**Access Your Log**:
```bash
cat sessions/captains-log/$(date +%Y-%m-%d).md
```

---

## Related Skills

- **Skill Builder** - Create custom skills
- **Swarm Orchestration** - Advanced multi-agent patterns
- **Hive-Mind Advanced** - Queen coordination and consensus
- **Hooks Automation** - Automated workflow management

---

## Resources

### Official Documentation
- [Claude-Flow GitHub](https://github.com/ruvnet/claude-flow)
- [Quick Start Guide](/docs/essentials/quick-start.md)
- [System Architecture](/docs/reality/architecture.md)
- [Troubleshooting](/docs/essentials/troubleshooting.md)

### Workspace Learning Materials
- [Learning Path Overview](/docs/learning/00-start-here.md)
- [Progress Tracker](/docs/learning/progress-tracker.md)
- [Current Limitations](/docs/reality/current-limitations.md)
- [What Actually Works](/docs/reality/what-actually-works.md)

---

**Created**: 2025-11-18
**Version**: 1.0.0
**Category**: Learning & Education
**Difficulty**: All Levels (Adaptive)
**Estimated Time**: 8-12 weeks to Advanced mastery
