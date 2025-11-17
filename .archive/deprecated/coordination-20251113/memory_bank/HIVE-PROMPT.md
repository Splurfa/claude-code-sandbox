# Build Your Dream Hive - No Holds Barred

## The Challenge

User wants an ephemeral session workflow (closeout → backup → delete → fresh workspace).

**No constraints. Show us what you can do.**

---

## Context

User implemented a `sessions/` folder (intentionally added, follows stock principles that allow additions).

**Intended workflow:**
1. Work happens in session folder
2. User triggers closeout
3. Hooks run → snapshots created → captain's log updated
4. Session folder deleted (keep only memory + backups)
5. New session auto-created as placeholder for next chat

---

## Current State (Observed)

**File system:**
- `.swarm/memory.db` (9.6 MB, 7,486 entries)
- `.hive-mind/hive.db` (127 KB)
- `.inbox/archive.db` (64 KB)
- 206 files in `.claude/` directory
- Empty directories: `sessions/captains-log/`, `.swarm/backups/`
- CLAUDE.md (543 lines of specifications)

**Behavior observed:**
- `.env` contains JWT tokens and passwords
- `npx claude-flow@alpha hooks session-end` writes to memory.db
- Memory uses session IDs as keys (not file paths)
- Captain's log and backup directories remain empty after hook execution

**Context documents available:**
Agent findings exist in `sessions/session-analysis/artifacts/docs/`. Verify independently.

---

## Your Mission

**Investigate, explain, and architect the solution.**

Design your own investigation strategy. You decide:
- What to examine and how deeply
- What agents to spawn and how they coordinate
- What tests to run for verification
- What matters vs what's noise

**The questions only you can answer:**
- How do these three databases relate to the intended architecture?
- What's stock claude-flow infrastructure vs custom additions?
- What explains the empty directories vs the documented behavior?
- Is the ephemeral session workflow compatible with stock patterns?
- What's the optimal path forward?

---

## Deliverable

Whatever format serves the analysis best:
- Verified technical findings
- Architecture explanation
- Implementation plan
- Recommendation document

You decide based on what you discover.

---

## Constraints

- User is not a developer - solution must follow stock claude-flow best practices
- Stock = adherence to original developer's intended design (not file count)
- Follow stock patterns where they exist; propose minimal wrappers only when stock doesn't cover the use case

---

## Why This Approach

You can architect a hive with the coordination, investigation, and verification power needed to get this right.

Take this as a personal challenge. Show what a properly orchestrated hive can accomplish.

No holds barred.

---

**Usage:**
```bash
npx claude-flow@alpha hive-mind wizard
# Paste this prompt when requested
```
