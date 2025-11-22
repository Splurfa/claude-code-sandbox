# Navigation Commands Specification

## Overview

This document specifies the command structure, syntax, and behavior for all tour-guide navigation commands. Commands follow the `/tour` namespace pattern for clarity and consistency.

## Command Design Principles

1. **Predictable**: Command names clearly indicate their function
2. **Forgiving**: Accept variations and provide helpful error messages
3. **Consistent**: Similar commands use similar syntax patterns
4. **Discoverable**: `/tour help` always available
5. **Safe**: No destructive operations, easy to undo navigation

## Command Namespace

All commands use the `/tour` prefix to:
- Avoid conflicts with other skills/commands
- Clearly indicate they belong to tour-guide
- Enable command completion/suggestion

## Core Commands

### `/tour`
**Purpose**: Start or resume tour

**Syntax**: `/tour`

**Behavior**:
- **First invocation (new conversation)**: Display intake menu
- **Subsequent invocation (same conversation)**: Resume from last position
- **After completion**: Offer to restart or switch pathways

**Examples**:
```
# First time
User: /tour
System: [Displays intake menu]

# Already in tour
User: /tour
System: Resuming Intermediate pathway, Section 3: Agent Spawning
        /tour next to continue

# Tour completed
User: /tour
System: You completed the Intermediate pathway!
        Options:
        - /tour jump advanced (level up)
        - /tour reset (restart from intake)
```

**Error handling**:
- No errors possible (always valid entry point)

---

### `/tour next`
**Purpose**: Move to next section in current pathway

**Syntax**: `/tour next`

**Aliases**:
- `/tour n`
- `/tour continue`

**Behavior**:
- Advance to next section
- Display section content
- Show navigation options at bottom

**Examples**:
```
User: /tour next
System: [Displays Section 4: Multiple Agents]

════════════════════════════════════════════════════════════
  Beginner Pathway: Section 4 of 5 - Multiple Agents
════════════════════════════════════════════════════════════

[Section content...]

Navigation:
  /tour next - Section 5: Finding Help
  /tour back - Section 3: Your First Agent
  /tour status - See progress
```

**Edge cases**:
```
# At end of pathway
User: /tour next
System: You've reached the end of the Beginner pathway!

        Next options:
        - /tour jump intermediate (level up)
        - /tour reset (restart)
        - Exit tour and start building

# Not in tour
User: /tour next
System: No active tour. Start with /tour
```

**Error handling**:
- If not in tour: Suggest `/tour` to start
- If at end: Suggest alternatives (level jump, reset)

---

### `/tour back`
**Purpose**: Move to previous section

**Syntax**: `/tour back`

**Aliases**:
- `/tour b`
- `/tour previous`
- `/tour prev`

**Behavior**:
- Move to previous section
- Display section content
- Update position indicator

**Examples**:
```
User: /tour back
System: [Displays Section 2: Session Basics]

════════════════════════════════════════════════════════════
  Beginner Pathway: Section 2 of 5 - Session Basics
════════════════════════════════════════════════════════════

[Section content...]
```

**Edge cases**:
```
# At beginning of pathway
User: /tour back
System: You're at the beginning of the Beginner pathway.

        Options:
        - /tour next - Continue forward
        - /tour jump [level] - Switch pathways
        - /tour list - See all sections

# Not in tour
User: /tour back
System: No active tour. Start with /tour
```

**Error handling**:
- If not in tour: Suggest `/tour` to start
- If at beginning: Explain position, suggest alternatives

---

### `/tour skip [section-name]`
**Purpose**: Jump to specific section by name

**Syntax**: `/tour skip <section-name>`

**Aliases**:
- `/tour jump [section-name]` (different from level jump)
- `/tour goto [section-name]`

**Behavior**:
- Parse section name (fuzzy match)
- Jump to matching section
- Display section content

**Examples**:
```
# Exact match
User: /tour skip memory-coordination
System: [Jumps to Memory Coordination section]

# Fuzzy match
User: /tour skip memory
System: Found matching section: "Memory Coordination"
        [Displays section content]

# Multiple matches
User: /tour skip session
System: Multiple sections match "session":
        1. Session Basics (Section 2)
        2. Session Management Deep Dive (Section 2, Intermediate)

        Which section? [Enter 1 or 2]

# No match
User: /tour skip quantum-physics
System: No section found matching "quantum-physics"

        See all sections: /tour list
        Or continue: /tour next
```

**Section name patterns**:
- Use kebab-case: `memory-coordination`
- Accept underscores: `memory_coordination`
- Accept spaces: `memory coordination`
- Case-insensitive: `Memory Coordination` = `memory coordination`

**Error handling**:
- No match: Suggest `/tour list` to see available sections
- Multiple matches: Offer numbered menu
- Ambiguous: Ask for clarification

---

### `/tour jump [level]`
**Purpose**: Switch proficiency pathways

**Syntax**: `/tour jump <level>`

**Valid levels**:
- `beginner` (aliases: `basic`, `intro`)
- `intermediate` (aliases: `inter`, `mid`)
- `advanced` (aliases: `adv`)
- `expert` (aliases: `exp`, `master`)

**Behavior**:
- Switch to specified pathway
- Reset to Section 1 of new pathway
- Confirm switch with user

**Examples**:
```
# Standard jump
User: /tour jump advanced
System: Switching to Advanced pathway.
        Starting from Section 1: Architecture Deep Dive

        [Displays Section 1 content]

# With confirmation (if significant progress in current pathway)
User: /tour jump beginner
System: You're currently at Section 4 of 6 in Intermediate pathway.
        Jumping to Beginner will lose this progress.

        Confirm jump to Beginner pathway? [Y/n]

User: Y
System: [Switches to Beginner, Section 1]

# Invalid level
User: /tour jump ninja
System: Unknown proficiency level: "ninja"

        Valid levels:
        - beginner (basic, intro)
        - intermediate (inter, mid)
        - advanced (adv)
        - expert (exp, master)

        Usage: /tour jump [level]
```

**Confirmation logic**:
- If < 2 sections into current pathway: No confirmation (minimal loss)
- If >= 2 sections: Confirm before jumping (preserve user effort)

**Error handling**:
- Invalid level: Show valid levels with aliases
- Typo: Suggest closest match ("Did you mean 'advanced'?")

---

### `/tour status`
**Purpose**: Show current position and progress

**Syntax**: `/tour status`

**Aliases**:
- `/tour progress`
- `/tour where`

**Behavior**:
- Display current pathway and section
- Show progress indicator
- List completed sections
- Show navigation options

**Examples**:
```
User: /tour status

════════════════════════════════════════════════════════════
                    Tour Status
════════════════════════════════════════════════════════════

Pathway: Intermediate
Section: 3 of 6 - Agent Spawning Patterns

Progress: ████████░░░░░░░░░░░░ 33%

Completed:
  ✓ Section 1: Workspace Architecture
  ✓ Section 2: Session Management Deep Dive
  → Section 3: Agent Spawning Patterns (current)
    Section 4: Memory Coordination
    Section 5: File Routing Rules
    Section 6: Next Steps

Estimated time remaining: 25 minutes

Navigation:
  /tour next - Continue to Section 4
  /tour back - Return to Section 2
  /tour jump [level] - Switch pathways
```

**Edge cases**:
```
# Not in tour
User: /tour status
System: No active tour. Start with /tour

# Tour completed
User: /tour status
System: You've completed the Intermediate pathway!

        Completion summary:
        ✓ All 6 sections completed
        ✓ Estimated time: 45 minutes

        Next steps:
        - /tour jump advanced (level up)
        - /tour reset (restart)
```

**Error handling**:
- If not in tour: Suggest `/tour` to start

---

### `/tour list`
**Purpose**: Show all sections in current pathway

**Syntax**: `/tour list [pathway]`

**Behavior**:
- Display all sections in current (or specified) pathway
- Indicate current section
- Show estimated time per section

**Examples**:
```
# Current pathway
User: /tour list

Intermediate Pathway Sections:
────────────────────────────────────────────────────────────
1. Workspace Architecture (7 min)
2. Session Management Deep Dive (10 min)
3. Agent Spawning Patterns (12 min) ← You are here
4. Memory Coordination (10 min)
5. File Routing Rules (8 min)
6. Next Steps & Advanced Topics (5 min)
────────────────────────────────────────────────────────────
Total: ~52 minutes

Jump to section: /tour skip [section-name]
Switch pathway: /tour jump [level]

# Specific pathway
User: /tour list beginner

Beginner Pathway Sections:
────────────────────────────────────────────────────────────
1. Welcome & Overview (5 min)
2. Session Basics (7 min)
3. Your First Agent (8 min)
4. Multiple Agents Working Together (7 min)
5. Finding Help & Next Steps (5 min)
────────────────────────────────────────────────────────────
Total: ~32 minutes

Start this pathway: /tour jump beginner

# All pathways
User: /tour list all

All Available Pathways:
════════════════════════════════════════════════════════════
Beginner (5 sections, ~32 min)
  For: First-time Claude Code users, new to AI agents

Intermediate (6 sections, ~52 min) ← Current
  For: Regular Claude Code users, want practical patterns

Advanced (6 sections, ~70 min)
  For: Experienced users, seek architectural depth

Expert (5 sections, ~70 min)
  For: System architects, contributors, framework developers
════════════════════════════════════════════════════════════

Jump to pathway: /tour jump [level]
```

**Error handling**:
- Invalid pathway name: Suggest valid options

---

### `/tour bookmark [name]`
**Purpose**: Save current position for later return

**Syntax**: `/tour bookmark [name]`

**Behavior**:
- Save current pathway + section with optional name
- Store bookmark in session context
- Provide command to return

**Examples**:
```
# Named bookmark
User: /tour bookmark memory-patterns
System: Bookmarked current position:
        "Intermediate > Memory Coordination"

        Return with: /tour jump memory-patterns

# Unnamed bookmark (auto-generate name)
User: /tour bookmark
System: Bookmarked current position as "bookmark-1":
        "Advanced > Extension Points"

        Return with: /tour jump bookmark-1

# List bookmarks
User: /tour bookmarks
System: Your Bookmarks:
        1. memory-patterns → Intermediate > Memory Coordination
        2. bookmark-1 → Advanced > Extension Points

        Jump to bookmark: /tour jump [bookmark-name]

# Delete bookmark
User: /tour bookmark delete memory-patterns
System: Deleted bookmark "memory-patterns"
```

**Bookmark persistence**:
- Stored in conversation context (not cross-session)
- Lost when conversation ends
- Max 10 bookmarks per conversation

**Error handling**:
- Duplicate name: Ask to overwrite or rename
- Bookmark doesn't exist: Suggest `/tour bookmarks` to list

---

### `/tour reset`
**Purpose**: Restart tour from intake menu

**Syntax**: `/tour reset`

**Aliases**:
- `/tour restart`
- `/tour start-over`

**Behavior**:
- Clear current progress (with confirmation)
- Display intake menu
- Reset all bookmarks

**Examples**:
```
# Reset with progress
User: /tour reset
System: This will reset your tour progress.
        Current position: Intermediate > Section 4 of 6

        Are you sure you want to restart? [Y/n]

User: Y
System: Tour reset. Starting from intake...
        [Displays intake menu]

# Reset with no progress
User: /tour reset
System: Restarting tour from intake...
        [Displays intake menu]
```

**Confirmation logic**:
- If < 2 sections: No confirmation
- If >= 2 sections: Confirm before reset

**Error handling**:
- None (always safe to reset)

---

### `/tour help`
**Purpose**: Show command reference

**Syntax**: `/tour help [command]`

**Behavior**:
- Display all commands with brief descriptions
- If specific command given, show detailed help

**Examples**:
```
# General help
User: /tour help

Tour-Guide Commands:
════════════════════════════════════════════════════════════
/tour              Start or resume tour
/tour next         Next section
/tour back         Previous section
/tour skip [name]  Jump to specific section
/tour jump [level] Switch proficiency pathways
/tour status       Show current progress
/tour list         Show all sections
/tour bookmark     Save current position
/tour reset        Restart from beginning
/tour help         Show this help

For detailed help: /tour help [command]
Example: /tour help skip

# Specific command help
User: /tour help skip

Command: /tour skip [section-name]
════════════════════════════════════════════════════════════
Purpose: Jump to specific section by name

Syntax:
  /tour skip <section-name>

Aliases:
  /tour goto [section-name]

Examples:
  /tour skip memory-coordination
  /tour skip "session basics"
  /tour skip agent

Notes:
  - Section names are case-insensitive
  - Fuzzy matching supported
  - Use /tour list to see all available sections

Related:
  /tour jump [level] - Switch proficiency pathways
  /tour list - Show all sections
```

**Error handling**:
- Unknown command: Show similar commands
- Typo: Suggest correction

---

## Secondary Commands

### `/tour outline`
**Purpose**: Show condensed outline of entire pathway

**Syntax**: `/tour outline [pathway]`

**Behavior**: Display high-level structure without content

**Example**:
```
User: /tour outline

Intermediate Pathway Outline:
════════════════════════════════════════════════════════════
1. Workspace Architecture
   • Core components
   • Architecture diagram
   • Key architectural decisions

2. Session Management Deep Dive
   • Session lifecycle states
   • Creation workflow
   • Closeout protocol
   • Best practices

3. Agent Spawning Patterns
   • Single agent pattern
   • Parallel agent pattern
   • Sequential agent pattern
   • Coordination mechanisms

[... etc ...]
════════════════════════════════════════════════════════════
```

---

### `/tour notes [add|list|clear]`
**Purpose**: Personal notes during tour

**Syntax**:
- `/tour notes add "note text"`
- `/tour notes list`
- `/tour notes clear`

**Behavior**: Store user notes alongside progress

**Example**:
```
User: /tour notes add "Remember: sessions isolate projects"
System: Note added to Section 2: Session Management

User: /tour notes list
System: Your Tour Notes:
        ════════════════════════════════════════════
        Section 2: Session Management
        • "Remember: sessions isolate projects"

        Section 3: Agent Spawning
        • "Try parallel execution for speed"
        ════════════════════════════════════════════
```

---

### `/tour quiz`
**Purpose**: Test understanding of current section

**Syntax**: `/tour quiz`

**Behavior**: Interactive quiz on current section content

**Example**:
```
User: /tour quiz

Quiz: Session Management Deep Dive
════════════════════════════════════════════════════════════
Question 1 of 3:

What is the purpose of session closeout?

A) Delete all files
B) Generate summary and archive
C) Spawn cleanup agents
D) Reset workspace

[Enter A, B, C, or D]
```

---

## Command Parsing Rules

### Case Sensitivity
- Commands are case-insensitive: `/tour` = `/Tour` = `/TOUR`
- Parameters are case-insensitive: `beginner` = `Beginner` = `BEGINNER`

### Whitespace Handling
- Extra spaces ignored: `/tour  next` = `/tour next`
- Leading/trailing spaces trimmed

### Alias Resolution
- Check exact match first
- Check aliases second
- Suggest if close match: "Did you mean '/tour next'?"

### Error Messages
- Always suggest correction
- Show related commands
- Provide examples
- Point to `/tour help`

## Command Context

### State Requirements

**Commands requiring active tour**:
- `/tour next`
- `/tour back`
- `/tour status`
- `/tour bookmark`

**Commands working without active tour**:
- `/tour` (starts tour)
- `/tour help`
- `/tour list`
- `/tour reset`
- `/tour jump [level]` (starts at level)

### Conversation Context

**Persisted across messages**:
- Current pathway
- Current section
- Visited sections
- Bookmarks
- User notes

**Not persisted**:
- Quiz scores
- Temporary navigation state

## Accessibility Considerations

### Keyboard-Only Navigation
All commands work via keyboard (no mouse required)

### Screen Reader Support
- Progress indicators use semantic markup
- Section headers clearly labeled
- Navigation options listed verbally

### Cognitive Load
- Short, memorable commands
- Consistent patterns
- Clear feedback
- Easy undo (go back)

## Testing Checklist

For each command:
- [ ] Basic functionality works
- [ ] Aliases work identically
- [ ] Error messages are helpful
- [ ] Edge cases handled gracefully
- [ ] Help text is accurate
- [ ] Examples are valid
- [ ] Keyboard-only accessible
- [ ] Screen reader friendly

## Future Enhancements

### Potential New Commands

**`/tour speed [slow|normal|fast]`**
- Adjust verbosity level
- Slow: Extra explanations
- Fast: Condensed content

**`/tour compare [level1] [level2]`**
- Compare content across proficiency levels
- Show what changes between pathways

**`/tour search [term]`**
- Search across all pathway content
- Jump to relevant sections

**`/tour estimate`**
- Show estimated time to complete current pathway
- Based on reading speed

**`/tour export`**
- Export tour progress and notes
- Save for later review

## Conclusion

This command structure balances simplicity with power, providing intuitive navigation while supporting advanced use cases. The `/tour` namespace keeps commands organized, while aliases support different user preferences. Consistent error handling and helpful messages ensure users never feel lost, maintaining the tour-guide's primary goal: effective, user-friendly workspace orientation.
