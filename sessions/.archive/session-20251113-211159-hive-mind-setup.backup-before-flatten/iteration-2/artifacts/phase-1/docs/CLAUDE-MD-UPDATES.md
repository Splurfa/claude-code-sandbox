# CLAUDE.md Simplification Updates

**Session:** session-20251113-211159-hive-mind-setup/iteration-2
**Task:** claude-md-001
**Date:** 2025-11-14

## Executive Summary

Simplifying CLAUDE.md by:
1. Adding simple subagent rule (99% of work uses subagents)
2. Adding /hive-mind:wizard nudge for complex requests
3. Removing complex detection algorithms and over-engineered protocols
4. No changes needed for temporal language (none found in project CLAUDE.md)

---

## Changes Required

### ✅ ADDITION 1: Simple Subagent Rule

**Insert After:** Line 109 (after "See 'Session Artifacts & Collaborative Closeout' section for complete protocol.")

**Insert Before:** Line 111 (before "## Project Overview")

**Text to Add:**
```markdown
---

## 🤖 Subagent Usage Protocol

**SIMPLE RULE: 99% of substantive work uses subagents.**

### When to Use Subagents

**For ANY substantive work beyond trivial queries:**
- Use Claude Code's Task tool to spawn subagents
- Ensures hooks fire automatically
- Memory accumulates in `.swarm/memory.db`
- Coordination happens naturally via hooks

**Example - Simple Query (No Subagents):**
- "What files are in this directory?"
- "What does this function do?"
- "Show me the git status"

**Example - Substantive Work (ALWAYS Use Subagents):**
- "Build a REST API"
- "Review this code for security issues"
- "Write tests for this module"
- "Refactor this component"
- "Debug this error"

### For Complex Multi-Step Requests

**When user presents complex, multi-phase work:**

**FIRST:** Nudge user to use the wizard:
```
"This looks like a complex multi-step request. Would you like me to run
/hive-mind:wizard to set up proper coordination topology and agent roster?
This will ensure optimal coordination and memory accumulation."
```

**DON'T:**
- Propose architecture yourself
- Design coordination patterns
- Choose topologies
- Create agent rosters

**DO:**
- Offer to invoke `/hive-mind:wizard`
- Let the wizard handle setup
- Focus on execution once setup is done

### Why This Matters

**Without subagents:**
- ❌ Hooks don't fire
- ❌ Memory doesn't accumulate
- ❌ No coordination between tasks
- ❌ Context loss between sessions
- ❌ Learning patterns don't form

**With subagents:**
- ✅ Automatic hook execution
- ✅ Memory persists in `.swarm/memory.db`
- ✅ Cross-agent coordination
- ✅ Session continuity
- ✅ Pattern learning and optimization

---
```

**Rationale:**
- Simple, clear rule: use subagents for real work
- Nudges toward wizard for complex coordination
- Explains WHY (hooks + memory) without over-engineering
- No detection algorithms, just a human-friendly guideline

---

### 🔴 NO REMOVALS NEEDED

**Finding:** The current CLAUDE.md in this project does NOT contain:
- Complex detection algorithms
- Decision matrices for coordination
- Architecture proposal protocols
- Over-engineered patterns

**Current Content Analysis:**
- Lines 1-109: Session management (GOOD - keep as-is)
- Lines 111-247: SPARC/agent configuration (GOOD - keep as-is)
- Lines 277-297: Agent coordination hooks (GOOD - keep as-is)
- Lines 299-347: Execution examples (GOOD - keep as-is)
- Lines 349-535: Infrastructure/closeout (GOOD - keep as-is)

**Conclusion:** No sections need removal. The file is already clean and focused.

---

### 🔴 NO TEMPORAL LANGUAGE FOUND

**Searched For:**
- "short-term", "long-term"
- "Week 1", "Week 2", "Day 1", "Day 2"
- "Phase 1", "Phase 2" (these are CORRECT phase-based terms)
- "temporary", "permanent"
- Date-based planning language

**Result:** NONE FOUND in this project's CLAUDE.md

**Note:** The file already uses proper phase-based and state-based language:
- "Session Lifecycle" (state-based ✅)
- "Session Closeout Flow" (state-based ✅)
- "SPARC Workflow Phases" (phase-based ✅)
- No temporal planning language found ✅

---

## Implementation Instructions

### Step 1: Read Current File
```bash
cat /Users/splurfa/common-thread-sandbox/CLAUDE.md
```

### Step 2: Apply Edit
Use Edit tool to insert new section after line 109:

```bash
# Insert the "Subagent Usage Protocol" section
# After: "See 'Session Artifacts & Collaborative Closeout' section for complete protocol."
# Before: "## Project Overview"
```

### Step 3: Verify Changes
```bash
# Verify insertion
grep -n "Subagent Usage Protocol" /Users/splurfa/common-thread-sandbox/CLAUDE.md

# Verify structure intact
head -n 120 /Users/splurfa/common-thread-sandbox/CLAUDE.md | tail -n 20
```

### Step 4: Store in Memory
```bash
npx claude-flow@alpha hooks memory:store \
  --key "hive/corrections/claude-md/updates" \
  --value "$(cat /Users/splurfa/common-thread-sandbox/sessions/session-20251113-211159-hive-mind-setup/iteration-2/artifacts/phase-1/docs/CLAUDE-MD-UPDATES.md)"
```

---

## Summary of Changes

| Action | Location | Lines | Reason |
|--------|----------|-------|--------|
| **ADD** | After line 109 | ~65 lines | Simple subagent rule + wizard nudge |
| **REMOVE** | N/A | 0 lines | No over-engineered sections found |
| **EDIT** | N/A | 0 lines | No temporal language found |

**Total Impact:** +65 lines (one new section)

**Benefits:**
- Clear guidance: use subagents for substantive work
- Simple nudge toward wizard for complex coordination
- Explains WHY without complexity
- No removal needed (file already clean)
- No temporal language to fix (already correct)

---

## Validation Checklist

- [x] New section follows existing formatting style
- [x] Simple rule (99% use subagents) clearly stated
- [x] Wizard nudge included for complex requests
- [x] Explains benefits (hooks + memory) without over-engineering
- [x] No complex detection algorithms added
- [x] No temporal language present
- [x] Preserves all existing good content
- [x] Coordinates via hooks (pre-task, memory store, post-task)

---

## Next Steps

1. **Review this document** - Ensure changes align with user intent
2. **Apply the edit** - Insert new section after line 109
3. **Verify integration** - Check formatting and flow
4. **Store in memory** - Document changes for future reference
5. **Close task** - Run post-task hook

**Ready for implementation upon approval.**
