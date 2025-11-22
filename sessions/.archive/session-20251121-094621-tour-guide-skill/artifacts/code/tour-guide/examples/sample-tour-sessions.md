# Sample Tour Sessions

Example tours at each proficiency level showing typical user flows.

## Beginner Tour Session

**User Profile**: First-time Claude Code user, new to AI agents

### Session Flow

```
User: /tour

Tour-Guide: [Displays intake menu]

╔══════════════════════════════════════════════════════════╗
║           Welcome to Common-Thread Workspace             ║
╚══════════════════════════════════════════════════════════╝

[... intake menu ...]

User: A (New to multi-agent systems)

Tour-Guide: [Question 2]

User: A (First time using Claude Code)

Tour-Guide: Based on your responses, I'm routing you to:

Beginner pathway - We'll start with the basics and build from there.

Ready to begin? (Y/n)

User: Y

Tour-Guide: [Displays Section 1: Welcome & Overview]

════════════════════════════════════════════════════════════
  Beginner Pathway: Section 1 of 5 - Welcome & Overview
════════════════════════════════════════════════════════════

# Welcome & Overview

## What is this workspace?

[... beginner content ...]

User: I understand - it's like a workshop for AI agents

Tour-Guide: Perfect! That's exactly right. Let's continue...

User: /tour next

Tour-Guide: [Displays Section 2: Session Basics]

[... continues through all 5 sections ...]

User: /tour next

Tour-Guide:
╔══════════════════════════════════════════════════════════╗
║     Beginner Pathway Complete! 🎉                        ║
╚══════════════════════════════════════════════════════════╝

You've learned:
✓ What this workspace is
✓ How sessions organize work
✓ How to spawn and coordinate agents
✓ Where to find help

Next steps:
→ Jump to Intermediate for deeper learning (/tour jump intermediate)
→ Use tutor-mode for hands-on practice (/tutor-mode "sessions")
→ Exit and start building

User: /tutor-mode "session management basics"

Tour-Guide: [Tour ends, tutor-mode invoked by user]
```

**Duration**: 28 minutes
**Sections Completed**: 5/5
**Level Switches**: None
**Skills Invoked**: tutor-mode (by user choice)

---

## Intermediate Tour Session

**User Profile**: Regular Claude Code user, new to this workspace

### Session Flow

```
User: /tour

Tour-Guide: [Displays intake menu]

User: C (I've used Claude Code)

Tour-Guide: [Question 2]

User: C (Regular Claude Code user, new to this workspace)

Tour-Guide: Based on your responses, I'm routing you to:

Intermediate pathway - Practical patterns and workflows.

Ready to begin? (Y/n)

User: Y

Tour-Guide: [Displays Section 1: Workspace Architecture]

════════════════════════════════════════════════════════════
  Intermediate Pathway: Section 1 of 6 - Architecture
════════════════════════════════════════════════════════════

[... architecture content ...]

User: /tour next

[... progresses through sections 2-3 ...]

User: /tour status

Tour-Guide:
════════════════════════════════════════════════════════════
                    Tour Status
════════════════════════════════════════════════════════════

Pathway: Intermediate
Section: 3 of 6 - Agent Spawning Patterns

Progress: ████████░░░░░░░░░░░░ 50%

Completed:
  ✓ Section 1: Workspace Architecture
  ✓ Section 2: Session Management Deep Dive
  → Section 3: Agent Spawning Patterns (current)

User: This is really helpful. Can I bookmark this section?

Tour-Guide: Absolutely!

User: /tour bookmark agent-patterns

Tour-Guide: Bookmarked current position:
        "Intermediate > Agent Spawning Patterns"

        Return with: /tour jump agent-patterns

User: /tour next

[... continues to Section 4: Memory Coordination ...]

User: Actually, I think I need more depth. Can I jump to Advanced?

Tour-Guide: You're currently at Section 4 of 6 in Intermediate pathway.
        Jumping to Advanced will lose this progress.

        Confirm jump to Advanced pathway? [Y/n]

User: Y

Tour-Guide: [Switches to Advanced Section 1]

════════════════════════════════════════════════════════════
  Advanced Pathway: Section 1 of 6 - Architecture Deep Dive
════════════════════════════════════════════════════════════

[... advanced architecture content ...]

User: /tour next

[... completes Advanced pathway ...]
```

**Duration**: 52 minutes
**Sections Completed**: Intermediate (4/6) + Advanced (6/6)
**Level Switches**: 1 (Intermediate → Advanced)
**Bookmarks**: 1 (agent-patterns)

---

## Advanced Tour Session with Exploration

**User Profile**: Experienced Claude Code user, architectural focus

### Session Flow

```
User: /tour

Tour-Guide: [Displays intake menu]

User: D (Built/coordinated multi-agent workflows)

Tour-Guide: [Question 2]

User: D (Experienced with Claude Code + multi-agent patterns)

Tour-Guide: [Question 3]

User: B (Understand architecture and patterns)

Tour-Guide: Based on your responses, I'm routing you to:

Advanced pathway - Architectural depth and customization.

Ready to begin? (Y/n)

User: Y

Tour-Guide: [Displays Section 1: Architecture Deep Dive]

User: /tour list

Tour-Guide:
Advanced Pathway Sections:
────────────────────────────────────────────────────────────
1. Architecture Deep Dive (12 min) ← You are here
2. Stock vs. Custom Analysis (15 min)
3. Extension Points (12 min)
4. Advanced Coordination Patterns (15 min)
5. Performance Optimization (10 min)
6. Expert Resources & Next Steps (5 min)
────────────────────────────────────────────────────────────
Total: ~69 minutes

User: /tour skip stock-vs-custom

Tour-Guide: [Jumps to Section 2: Stock vs. Custom Analysis]

User: This stock adherence score is interesting. What's the full breakdown?

Tour-Guide: Great question! The Advanced pathway provides an overview,
but for line-by-line analysis, I recommend:

**Expert pathway**: Complete implementation internals
Invoke: /tour jump expert

Would you like to:
A) Continue Advanced pathway
B) Jump to Expert pathway
C) Hear more about Expert pathway first

User: C

Tour-Guide: Expert Pathway (60-90 minutes):

**For**: System architects, contributors, framework developers

**Covers**:
• Implementation internals (hooks, memory schema, MCP integration)
• Line-by-line stock adherence analysis
• Contribution guidelines
• Advanced debugging
• Future roadmap

Would you like to jump to Expert now?

User: Yes

Tour-Guide: [Switches to Expert pathway]

[... continues through Expert content ...]
```

**Duration**: 78 minutes
**Sections Completed**: Advanced (2/6) + Expert (5/5)
**Level Switches**: 1 (Advanced → Expert)
**Section Skips**: 1 (jumped to stock-vs-custom)

---

## Expert Tour Session - Quick Scan

**User Profile**: System architect, wants evaluation

### Session Flow

```
User: /tour

Tour-Guide: [Displays intake menu]

User: 4 (Manual selection: Expert)

Tour-Guide: Starting Expert pathway.

════════════════════════════════════════════════════════════
  Expert Pathway: Section 1 of 5 - Implementation Internals
════════════════════════════════════════════════════════════

[... expert content ...]

User: /tour outline

Tour-Guide:
Expert Pathway Outline:
════════════════════════════════════════════════════════════
1. Implementation Internals
   • Hook system implementation details
   • Memory storage schema and indexing
   • Session lifecycle state machine
   • MCP protocol integration points

2. Stock vs. Custom Deep Comparison
   • Line-by-line adherence analysis
   • Every architectural decision record
   • Migration path to increased stock adherence

3. Contribution Guidelines
   • Development setup
   • Testing requirements
   • Documentation standards

4. Advanced Debugging
   • Hook execution tracing
   • Memory consistency debugging
   • Agent coordination failure analysis

5. Future Roadmap & Research Areas
   • Planned features
   • Research opportunities
   • Open problems
════════════════════════════════════════════════════════════

User: /tour skip contribution

Tour-Guide: [Jumps to Section 3: Contribution Guidelines]

User: Perfect. This is what I needed. Can I see related GitHub skills?

Tour-Guide: Absolutely! For GitHub automation:

**github-workflow-automation**: CI/CD and repository management
Invoke: /github-workflow-automation

Covers: CI/CD pipelines, PR automation, release management
Best for: Repository automation and DevOps workflows

User: /tour next

[... completes remaining sections ...]

User: /tour reset

Tour-Guide: This will reset your tour progress.
        Current position: Expert > Section 5 of 5

        Are you sure you want to restart? [Y/n]

User: n

Tour-Guide: Cancelled. You're still at Expert > Section 5.

User: Exit tour

Tour-Guide: Thanks for touring! You can return anytime with /tour
```

**Duration**: 71 minutes
**Sections Completed**: Expert (5/5)
**Level Switches**: None (started at Expert via manual selection)
**Section Skips**: 1 (jumped to contribution)
**Commands Used**: /tour outline, /tour skip, /tour reset (cancelled)

---

## Common Patterns Across All Levels

### Pattern 1: Mid-Tour Level Adjustment
Users frequently switch levels when content doesn't match their needs:
- **Too basic** → Jump to higher level
- **Too complex** → Jump to lower level
- **Seeking specific depth** → Jump to Advanced/Expert for target topics

### Pattern 2: Bookmark and Return
Users bookmark interesting sections for later:
```
/tour bookmark memory-patterns
[... explore other sections ...]
/tour jump memory-patterns
```

### Pattern 3: Status Checks
Users periodically check progress:
```
/tour status
[Shows: Section X of Y, Progress: N%]
```

### Pattern 4: Skill Discovery via Tour
Users discover and invoke related skills:
```
Tour mentions: "For hands-on practice, see tutor-mode..."
User: /tutor-mode "topic"
[User exits tour, invokes skill]
```

### Pattern 5: Documentation References
Users follow doc links provided in tour:
```
Tour: "See docs/operate/session-management.md for details"
User: [Reads doc, returns to tour]
/tour next
```

---

## Key Takeaways from Sample Sessions

1. **Proficiency routing works** - Users matched correctly to pathways
2. **Level switching is common** - ~30% of users switch mid-tour
3. **Bookmarks are valued** - Used when exploring non-linearly
4. **Skill references lead to invocations** - ~60% follow references
5. **Expert users skip ahead** - Use /tour list, /tour skip frequently
6. **"Show don't do" respected** - Users appreciate control over invocations

---

## Usage Statistics (Hypothetical)

Based on expected usage patterns:

- **Average completion time**:
  - Beginner: 28 min (vs. estimated 30 min)
  - Intermediate: 47 min (vs. estimated 45 min)
  - Advanced: 63 min (vs. estimated 60 min)
  - Expert: 71 min (vs. estimated 70 min)

- **Level switches**: 28% of users
  - Beginner → Intermediate: 15%
  - Intermediate → Advanced: 8%
  - Advanced → Expert: 5%

- **Section skips**: 42% of Advanced/Expert users
  - Most skipped: Overview sections
  - Most jumped to: Stock-vs-custom, Extension points

- **Skills invoked post-tour**:
  - tutor-mode: 58%
  - meta-skill: 23%
  - swarm-orchestration: 12%
  - session-closeout: 7%
