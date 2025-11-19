---
name: "Meta-Skill Coordinator"
description: "Intelligent skill routing via natural language and menus. Use when you need help finding the right skill, want to explore available skills, or need multi-skill coordination."
version: "1.0.0"
category: "Core Tools"
---

# Meta-Skill Coordinator

## What This Skill Does

The Meta-Skill Coordinator is your intelligent front door to all available skills. Instead of manually searching through CLAUDE.md or memorizing skill names, use natural language to describe what you want to do, and the coordinator will:

- **Match your intent** to the most relevant skill(s)
- **Present organized menus** for browsing by category
- **Route your request** to the right specialist
- **Coordinate multi-skill workflows** for complex tasks
- **Reduce context bloat** by lazy-loading only what you need

**When to use this skill:**
- "I want to learn about..." (routing to tutorials)
- "Help me optimize..." (finding optimization tools)
- "I need to review..." (connecting to review skills)
- You're unsure which skill to use
- You want to explore what's available

## Quick Start

### Natural Language (Recommended)

Just describe what you want to do:

```
"help me optimize my prompts"
→ Routes to: prompt-improver (95% confidence)

"I want to learn about claude flow"
→ Routes to: tutor-mode (92% confidence)

"need to review code quality"
→ Routes to: github-code-review, verification-quality
```

### Menu-Driven

Browse skills by category:

```
User: "show me available skills"

📚 Available Skills (30 total)

🎓 Learning & Development
  1. tutor-mode          - Adaptive learning guide
  2. skill-builder       - Create custom skills

🔧 Code Quality & Review
  3. github-code-review  - Automated code review
  4. verification-quality - Truth scoring & rollback

[... more categories ...]

Type a number (1-12) or describe what you want:
```

### Direct Invocation (Expert Mode)

If you know the exact skill name:

```
/meta invoke prompt-improver
/meta invoke tutor-mode
```

## Available Commands

### `/meta menu`
Display all skills organized by category with descriptions.

**Usage:**
```
/meta menu
/meta menu learning        # Show only learning category
```

### `/meta search <query>`
Search for skills matching keywords or description.

**Usage:**
```
/meta search optimization
/meta search github review
/meta search neural training
```

### `/meta invoke <skill-name>`
Directly load a specific skill by name.

**Usage:**
```
/meta invoke prompt-improver
/meta invoke swarm-orchestration
```

### `/meta list`
Show all available skills in a simple list format.

**Usage:**
```
/meta list
/meta list --categories    # Group by category
```

### `/meta help`
Display this help documentation.

## How Skill Matching Works

The coordinator uses **semantic matching** with confidence scores:

1. **Extract keywords** from your query (remove stop words)
2. **Score each skill** based on keyword overlap with descriptions
3. **Weight by position** (keywords early in description = higher score)
4. **Return top matches** with confidence percentages

**Confidence Thresholds:**
- **>80%**: Auto-invoke (high confidence single match)
- **30-80%**: Present options menu (multiple candidates)
- **<30%**: Show category menu (no clear match)

**Example:**
```
Query: "optimize my prompts for better results"
Extracted: ["optimize", "prompts", "better", "results"]

Matches:
  1. ⭐ prompt-improver (95% match)
     Keywords: optimize, prompts

  2. verification-quality (38% match)
     Keywords: better, results

  3. tutor-mode (25% match)
     Keywords: better

Auto-invoking prompt-improver...
```

## Multi-Skill Workflows

For complex tasks requiring multiple skills, the coordinator can suggest workflows:

**Example: Building a Review System**
```
User: "I want to build a review system for my code"

Meta-Skill:
🎯 This requires multiple skills:

1. swarm-orchestration - Set up multi-agent coordination
2. github-code-review - Configure automated review
3. verification-quality - Add quality scoring gates

Recommended workflow:
  Step 1: swarm-orchestration (setup agents)
  Step 2: github-code-review (review logic)
  Step 3: verification-quality (quality gates)

Start with Step 1? (yes/no)
```

**Common Workflows:**
- **Learn Claude Flow**: tutor-mode → swarm-orchestration → hive-mind-advanced
- **Build Review System**: swarm-orchestration → github-code-review → verification-quality
- **Optimize Performance**: performance-analysis → agentdb-optimization → neural-train

## Skill Categories

**🎓 Learning & Development**
- `tutor-mode` - Interactive learning with progress tracking
- `skill-builder` - Create custom skills with templates
- `pair-programming` - AI-assisted coding sessions

**🔧 Code Quality & Review**
- `github-code-review` - Automated code review with swarms
- `verification-quality` - Truth scoring and rollback
- `prompt-improver` - Optimize AI prompts with HITL

**🤖 Multi-Agent Coordination**
- `swarm-orchestration` - Multi-agent workflows
- `hive-mind-advanced` - Queen-based coordination
- `sparc-methodology` - Systematic TDD development

**📦 Database & Memory**
- `agentdb-vector-search` - Semantic search with vectors
- `agentdb-optimization` - Performance tuning (4-32x faster)
- `reasoningbank-intelligence` - Adaptive learning patterns

**🔗 GitHub Integration**
- `github-workflow-automation` - CI/CD automation
- `github-project-management` - Issue tracking & boards
- `github-release-management` - Release orchestration

**⚡ Performance & Optimization**
- `performance-analysis` - Bottleneck detection
- `agentdb-optimization` - Database performance
- Neural training tools

**🧠 Neural & AI**
- Neural network training
- Pattern recognition
- Model optimization

## Troubleshooting

### No Match Found
If no skills match your query, the coordinator will:
1. Suggest similar queries based on available skills
2. Show category menu for browsing
3. Offer to search documentation

**Example:**
```
🤔 No matching skills for "build quantum computer"

Did you mean:
  - "build custom skill" → skill-builder
  - "build review system" → github-code-review

Or browse categories: /meta menu
```

### Wrong Skill Loaded
If the coordinator routes you to the wrong skill:
1. Use `/meta menu` to browse alternatives
2. Refine your query with more specific keywords
3. Use direct invocation: `/meta invoke <skill-name>`

### Multiple Matches
When several skills match your query:
- The coordinator presents a numbered menu
- Choose the best match or refine your query
- Confidence scores help identify the best option

## Technical Details

**Implementation:** ~200 lines core logic + libraries
**Context Usage:** 6-8KB baseline, 13KB with active skill
**Matching Speed:** <10ms for 100 skills
**Memory:** ~500KB for skill index

For implementation details, see:
- `lib/skill-registry.js` - Skill metadata management
- `lib/semantic-matcher.js` - TF-IDF matching algorithm
- `lib/menu-generator.js` - Menu rendering
- `lib/skill-invoker.js` - Lazy loading and invocation

---

**Pro Tip:** The more specific your query, the better the match. Instead of "optimize", try "optimize prompts" or "optimize database queries".
