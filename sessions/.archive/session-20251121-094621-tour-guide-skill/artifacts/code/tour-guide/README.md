# Tour-Guide Skill

Interactive workspace orientation tailored to your proficiency level.

## What This Skill Does

Tour-guide provides a personalized, interactive walkthrough of the common-thread workspace. It assesses your experience level and delivers content at the appropriate depth—from complete beginner to expert contributor.

**Core features:**
- **Proficiency-based pathways**: Content adapted to your experience (Beginner/Intermediate/Advanced/Expert)
- **Interactive navigation**: Simple slash commands to move through content
- **Show, don't do**: Explains capabilities without executing on your behalf
- **Skill coordination**: References other skills (tutor-mode, meta-skill) without invoking them
- **Non-invasive**: Read-only orientation, never modifies your workspace

## Quick Start

### Start the Tour
```bash
/tour
```

This launches the intake menu (3 quick questions) to assess your proficiency and route you to the right pathway.

### Manual Level Selection

Skip the assessment and choose directly:

```
1. Beginner - "I'm new to AI agents and Claude Code"
2. Intermediate - "I know Claude Code, new to this workspace"
3. Advanced - "I want architectural depth and patterns"
4. Expert - "Show me the full technical details"
```

## Slash Commands Reference

### Core Navigation
- `/tour` - Start or resume tour
- `/tour next` - Next section
- `/tour back` - Previous section
- `/tour skip [section]` - Jump to specific section
- `/tour jump [level]` - Switch proficiency levels

### Progress & Discovery
- `/tour status` - Show current progress
- `/tour list` - Show all sections in pathway
- `/tour help` - Command reference

### Bookmarks & Control
- `/tour bookmark [name]` - Save current position
- `/tour reset` - Restart from intake

**Examples:**
```bash
# Navigate forward
/tour next

# Jump to different proficiency level
/tour jump advanced

# See where you are
/tour status

# Skip to specific topic
/tour skip memory-coordination

# Restart tour
/tour reset
```

## Proficiency Levels Overview

### Beginner Pathway (20-30 min)
**For:** First-time Claude Code users, new to AI agents

**What you'll learn:**
- What this workspace is
- How sessions organize work
- How to spawn AI agents
- Basic agent coordination
- Where to find help

**Starts with:** High-level metaphors, plain language, step-by-step examples

---

### Intermediate Pathway (30-45 min)
**For:** Regular Claude Code users, want practical patterns

**What you'll learn:**
- Workspace architecture overview
- Complete session lifecycle
- Agent spawning patterns (single, parallel, sequential)
- Memory coordination basics
- File routing rules

**Starts with:** System components, practical workflows, hands-on patterns

---

### Advanced Pathway (45-60 min)
**For:** Experienced users, seek architectural depth

**What you'll learn:**
- Deep architecture dive (components, data flow, ADRs)
- Stock vs. custom analysis (82/100 adherence score)
- Extension points for customization
- Advanced coordination patterns (topologies, consensus)
- Performance optimization strategies

**Starts with:** System design philosophy, architectural decisions, trade-offs

---

### Expert Pathway (60-90 min)
**For:** System architects, contributors, framework developers

**What you'll learn:**
- Implementation internals (hooks, memory schema, MCP integration)
- Line-by-line stock adherence analysis
- Contribution guidelines (setup, testing, PRs)
- Advanced debugging techniques
- Future roadmap & research areas

**Starts with:** Stock vs. custom deep comparison, implementation details, extension architecture

## Tour Pathways

Each pathway covers these core areas, adapted to proficiency:

1. **Workspace Overview** - What is this system?
2. **Session Management** - How work is organized
3. **Agent Coordination** - Spawning and orchestrating agents
4. **Memory & State** - Cross-agent communication
5. **File Organization** - Where files go
6. **Next Steps** - Deeper resources

**Progressive Disclosure:** Beginner gets high-level concepts, Expert gets implementation internals.

## Skill Coordination

Tour-guide references other skills but never invokes them automatically ("show don't do" principle).

### Skills You'll Encounter

**tutor-mode** - Hands-on interactive learning
- Tour-guide: Explains concepts
- Tutor-mode: Teaches through practice
- Invoke: `/tutor-mode "[topic]"`

**meta-skill** - Skill discovery and routing
- Tour-guide: Workspace orientation
- Meta-skill: Skill catalog navigation
- Invoke: `/meta-skill`

**swarm-orchestration** - Advanced coordination patterns
- Tour-guide: Basic agent spawning
- Swarm-orchestration: Production topologies
- Invoke: `/swarm-orchestration`

**reasoningbank-intelligence** - Adaptive learning
- Tour-guide: Static coordination knowledge
- ReasoningBank: Dynamic learning from experience
- Invoke: `/reasoningbank-intelligence`

**session-closeout** - Structured session ending
- Tour-guide: Explains session lifecycle
- Session-closeout: Actually closes sessions
- Invoke: `/session-closeout`

**Why this matters:** Tour-guide shows you capabilities and how to use them, but respects your agency—you decide when to dive deeper.

## Navigation Flow Example

```
You: /tour
  ↓
[Intake Menu: 3 questions]
  ↓
You: Answer proficiency questions
  ↓
[Routing: "You're matched to Intermediate pathway"]
  ↓
[Section 1: Workspace Architecture]
  ↓
You: /tour next
  ↓
[Section 2: Session Management Deep Dive]
  ↓
You: /tour skip memory
  ↓
[Section 4: Memory Coordination]
  ↓
You: /tour jump advanced
  ↓
[Confirmation: "Switch to Advanced pathway?"]
  ↓
You: Y
  ↓
[Advanced Section 1: Architecture Deep Dive]
```

## Technical Details

### Architecture

```
┌─────────────────────────────────────────┐
│          Tour-Guide Skill                │
├─────────────────────────────────────────┤
│  Intake → Router → Pathway → Content    │
│                                          │
│  Components:                             │
│  • intake-menu.js (proficiency routing) │
│  • tour-pathways.js (all 4 pathways)    │
│  • workspace-catalog.js (feature map)   │
│  • skill-coordinator.js (references)    │
└─────────────────────────────────────────┘
```

### State Management

**In-memory (conversation context):**
- Current pathway & section
- Visited sections
- Bookmarks
- Navigation history

**Not persisted:**
- No file-based state
- Resets between conversations
- Can resume within same conversation

### Boundaries

**What tour-guide does:**
- ✅ Reads existing documentation
- ✅ Explains concepts and workflows
- ✅ Demonstrates command usage
- ✅ References other skills

**What tour-guide does NOT do:**
- ❌ Modify workspace files
- ❌ Invoke other skills automatically
- ❌ Execute commands or spawn agents
- ❌ Create or modify sessions

### File Structure

```
tour-guide/
├── README.md                     # This file
├── lib/
│   ├── intake-menu.js            # Proficiency assessment
│   ├── tour-pathways.js          # All 4 pathway definitions
│   ├── workspace-catalog.js      # Folder/feature inventory
│   └── skill-coordinator.js      # Skill reference logic
├── docs/
│   ├── tour-scripts/
│   │   ├── beginner-tour.md      # Full beginner pathway
│   │   ├── intermediate-tour.md  # Full intermediate pathway
│   │   ├── advanced-tour.md      # Full advanced pathway
│   │   └── expert-tour.md        # Full expert pathway
│   └── feature-catalog.md        # Complete feature reference
└── examples/
    └── sample-tour-sessions.md   # Example tours at each level
```

## Use Cases

### Scenario 1: Complete Newbie
```
User: "I just installed Claude Code and found this workspace. What is all this?"

Action: /tour
Result: Beginner pathway, plain language, basic concepts
Time: 20-30 minutes to orientation
```

### Scenario 2: Claude Code Veteran
```
User: "I'm experienced with Claude Code but new to this specific workspace setup."

Action: /tour (selects Intermediate in intake)
Result: Practical patterns, session workflows, agent coordination
Time: 30-45 minutes to productivity
```

### Scenario 3: System Architect
```
User: "I want to evaluate this workspace architecture and potentially extend it."

Action: /tour (selects Expert in intake)
Result: Stock vs. custom analysis, extension points, contribution guide
Time: 60-90 minutes to full understanding
```

### Scenario 4: Mid-Tour Level Switch
```
User: "This beginner content is too basic. I need more depth."

Action: /tour jump intermediate
Result: Switches to Intermediate pathway, Section 1
Note: Previous progress not retained (clean slate at new level)
```

## Best Practices

### When to Use Tour-Guide
- ✅ First time in this workspace
- ✅ Want structured orientation
- ✅ Need to understand architecture
- ✅ Looking for specific features
- ✅ Evaluating workspace capabilities

### When NOT to Use Tour-Guide
- ❌ Already familiar with workspace structure
- ❌ Just need quick reference (use docs directly)
- ❌ Want hands-on practice (use tutor-mode)
- ❌ Need specific skill (use meta-skill to find it)

### Tips for Effective Learning
1. **Answer intake honestly** - Better matching = better experience
2. **Don't rush** - Take time to understand each section
3. **Use bookmarks** - Save interesting sections for later
4. **Jump levels freely** - If content doesn't fit, switch pathways
5. **Follow references** - Tour-guide points to deeper resources
6. **Practice after tour** - Use tutor-mode to reinforce learning

## Accessibility

### Keyboard-Only Navigation
All commands work via keyboard:
- No mouse required
- Simple slash command syntax
- Clear navigation options at every step

### Screen Reader Support
- Progress indicators use semantic markup
- Section headers clearly labeled
- Navigation options listed verbally

### Cognitive Load Management
- Short, memorable commands
- Consistent patterns across all pathways
- Clear "where am I" indicators
- Easy undo (go back)
- No destructive operations

## Integration with Documentation

Tour-guide complements (doesn't replace) the docs:

**Documentation (`docs/`)**: Reference material for lookup
**Tour-guide**: Guided exploration of documentation

**When to use which:**
- **Quick lookup** → Read docs directly
- **Structured learning** → Use tour-guide
- **Hands-on practice** → Use tutor-mode (referenced by tour)

Tour-guide references these key docs:
- `docs/setup/quick-start.md` - Beginner pathway
- `docs/operate/session-management.md` - All pathways
- `docs/reference/architecture.md` - Advanced/Expert
- `docs/coordinate/swarm-coordination.md` - Advanced

## Troubleshooting

### "I'm in the wrong pathway"
```bash
/tour jump [level]
# Choose: beginner, intermediate, advanced, expert
```

### "I want to skip ahead"
```bash
/tour list           # See all sections
/tour skip [section] # Jump to specific section
```

### "I'm lost"
```bash
/tour status  # See where you are
/tour help    # Command reference
```

### "I want to start over"
```bash
/tour reset   # Restart from intake
```

### "The tour is too fast/slow"
- Too fast? Jump to lower level (`/tour jump beginner`)
- Too slow? Jump to higher level (`/tour jump advanced`)
- Just right? Continue (`/tour next`)

## Version Information

**Version**: 1.0.0
**Created**: 2025-11-21
**Workspace**: common-thread-sandbox
**Stock Adherence**: 100% (pure skill, no core modifications)

## Related Skills

- **tutor-mode**: Interactive learning with exercises
- **meta-skill**: Skill discovery and routing
- **swarm-orchestration**: Advanced multi-agent coordination
- **reasoningbank-intelligence**: Adaptive learning patterns
- **session-closeout**: Session lifecycle management
- **pair-programming**: Real-time collaborative development

**Discovery**: Use `/meta-skill` to explore all 49 skills

## Support

**Documentation**:
- [Session Management](../../../docs/operate/session-management.md)
- [Quick Start Guide](../../../docs/setup/quick-start.md)
- [Architecture Overview](../../../docs/reference/architecture.md)

**Help Commands**:
- `/tour help` - Command reference
- `/tour list` - See all sections
- `/tour status` - Current position

**Community**: This is a custom skill for the common-thread workspace. For Claude Flow questions, see https://github.com/ruvnet/claude-flow

---

**Ready to explore?** Start with `/tour` and let's begin your orientation!
