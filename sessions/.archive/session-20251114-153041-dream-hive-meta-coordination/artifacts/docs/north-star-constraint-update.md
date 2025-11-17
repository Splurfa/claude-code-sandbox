# North Star Constraint Update - Skills-First Design

**Date:** 2025-11-14
**Change:** Add constraint prohibiting new agent creation
**Rationale:** Skills are more scalable, better structured, and align with stock-first principle

---

## New Constraint Added

### ❌ NO NEW AGENT CREATION

**Rule:** Do not create new `.claude/agents/*.md` files.

**Rationale:**
1. **Too many agents already** - 50+ agents in library, cluttered directory
2. **Skills are more scalable** - Can be simple OR complex, progressive disclosure
3. **Skills can invoke agents** - If agent behavior needed, use existing agents
4. **Better documentation model** - SKILL.md, examples/, README.md structure

**Implementation:**
- Everything implemented via `.claude/skills/` directories
- Documentation in README.md files
- CLAUDE.md for global rules

---

## Updated Implementation Approach

### Before (Agent-First)

```
.claude/agents/
├── session-closeout.md    ❌ New agent file
├── captains-log.md         ❌ New agent file
├── file-routing.md         ❌ New agent file
```

### After (Skills-First)

```
.claude/skills/
├── session-closeout/
│   ├── SKILL.md           ✅ Skill definition
│   ├── README.md          ✅ User guide
│   └── examples/          ✅ Usage examples
└── file-routing/
    ├── SKILL.md           ✅ Quick reference skill
    └── README.md          ✅ AI guidance docs
```

---

## Revised North Star Requirements

### Documentation Requirements (Updated)

1. **README.md in every folder** ✅ (no change)
2. **~.claude/agents/*.md patterns~ ❌ REMOVED**
3. **.claude/skills/ directories** ✅ NEW REQUIREMENT

### Required Skills (2 Total)

1. **session-closeout/** - Natural language session closeout workflow
2. **file-routing/** - AI self-check reference guide

**Removed:**
- ~~captains-log agent~~ - Captain's Log entries via session-closeout skill or direct hooks command

---

## Skills vs Agents Decision Matrix

| Characteristic | Skills | Agents |
|----------------|--------|--------|
| Structure | SKILL.md + examples/ + README.md | Single .md file |
| Complexity | Simple → Complex | Simple only |
| Examples | examples/ directory | Inline markdown |
| Configuration | Supported | Not supported |
| Discoverability | Browsable skill library | Flat list |
| Stock-first | ✅ Documented pattern | ⚠️ Less structured |

**Decision:** Always use skills. They can be as simple as agents but scale better.

---

## Implementation Changes

### Session Closeout (Agent → Skill)

**Before (Agent):**
```markdown
# Session Closeout

## Trigger Phrases
- "Close out this session"

## Commands Executed
[bash commands inline]
```

**After (Skill):**
```
.claude/skills/session-closeout/
├── SKILL.md
│   - Skill metadata
│   - Trigger: natural language or skill invocation
│   - Progressive disclosure (basic → advanced)
│
├── README.md
│   - User-facing documentation
│   - What it does, why it exists
│   - Quick start guide
│
└── examples/
    ├── basic-closeout.md
    ├── batch-closeout.md
    └── error-recovery.md
```

**Benefits:**
- Richer documentation structure
- Examples separate from core definition
- Configuration options (auto-approve, custom summaries)
- Progressive disclosure (beginner → advanced)

---

### File Routing (Agent → Skill)

**Before (Agent):**
```markdown
# File Routing Quick Reference

[Quick lookup table]
```

**After (Skill):**
```
.claude/skills/file-routing/
├── SKILL.md
│   - Skill: "Check file routing for [path]"
│   - Returns suggestion for AI agents
│
└── README.md
    - Quick reference table
    - Common mistakes
    - Self-check questions
```

**Benefits:**
- Invokable as skill ("Check file routing")
- README.md still serves as quick reference
- Can add examples/ if needed later

---

### Captain's Log (Removed)

**Decision:** No separate Captain's Log skill/agent needed.

**Rationale:**
- Captain's Log entries created automatically during session closeout
- Manual entries: Direct hooks command (`npx claude-flow@alpha hooks journal --entry "[text]"`)
- Querying: Simple grep/find (no workflow needed)
- Adding a skill/agent is over-engineering

**Documentation:**
- Captain's Log README.md explains usage ✅ (already created)
- Session closeout skill includes log integration ✅

---

## Updated North Star Summary

### Core Principles (No Change)
1. Time-neutral
2. Scale-agnostic
3. Stock-first

### Documentation (No Change)
- 5 README.md files ✅ (already created)

### Skills (Updated)
- ~~3 agent patterns~~ ❌ REMOVED
- **2 skill directories** ✅ NEW
  - session-closeout/
  - file-routing/

### Constraint Added
- ❌ **NO NEW AGENT CREATION**
- ✅ Use skills for all workflows
- ✅ Skills can be simple (just SKILL.md + README.md)

---

## Impact on Completion Score

**Previous Plan:**
- Create 3 agent .md files
- Estimated effort: 2-3 hours

**Revised Plan:**
- Create 2 skill directories
- Each with SKILL.md + README.md + examples/
- Estimated effort: 3-4 hours (more structure, but better quality)

**Completion Impact:** Minimal (still achieves 100% with better architecture)

---

## Stock-First Verification

**Skills approach is MORE stock-first:**
- ✅ Skills are documented Claude Code pattern
- ✅ Examples in examples/ directory (standard structure)
- ✅ SKILL.md follows official template
- ✅ Better alignment with existing skill library

**Agent approach was LESS stock-first:**
- ⚠️ Flat .md files (less structured)
- ⚠️ Clutters .claude/agents/ directory (50+ agents)
- ⚠️ No examples separation

---

## Next Steps

1. **Update North Star spec** ✅ (this document)
2. **Delete created agent files** ✅
3. **Create skill directories:**
   - `.claude/skills/session-closeout/`
   - `.claude/skills/file-routing/`
4. **Populate each with:**
   - SKILL.md (skill definition)
   - README.md (user documentation)
   - examples/ (usage patterns)

---

## HITL Decision Required

**Updated approach presented:**
- Skills-first constraint added
- Agent files deleted
- Skills approach outlined

**User approval needed before proceeding to Phase 2 (Skills Design)**

Type `approved` to proceed with skills-first design
Type `revise [feedback]` for further changes

---

**Constraint Update Complete**
**Architect:** Queen Hive (North Star Coordinator)
**Status:** Awaiting HITL approval for skills-first approach
