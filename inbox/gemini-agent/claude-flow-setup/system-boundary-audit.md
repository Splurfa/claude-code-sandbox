# System Boundary Audit: Stock Claude Flow vs. Custom Extensions

**Date:** November 22, 2025
**Agent:** Gemini (Cursor)
**Objective:** Define the precise boundary between Stock Claude Flow and user-created Custom Extensions to ensure "100% system self-awareness."

## 1. Truth Table: System Components

Based on `git history` analysis of the initial commit (`5ce9b5d`), we have established the following classification:

| Feature/Component | Classification | Rationale |
| :--- | :--- | :--- |
| **Claude Code CLI** | **Stock Claude Code** | Foundational execution layer. |
| **Parallel Execution** | **Stock Claude Code** | Native `Task()` tool capability. |
| **Orchestration Topologies** | **Stock Claude Flow** | Defined in `mcp` tools (mesh, hierarchical, etc.) in initial commit. |
| **SPARC Methodology** | **Stock Claude Flow** | Present in `.claude/skills/sparc-methodology` in initial commit. |
| **ReasoningBank** | **Stock Claude Flow** | Present in `.claude/skills/reasoningbank-intelligence` in initial commit. |
| **Hive-Mind** | **Stock Claude Flow** | Present in `.claude/skills/hive-mind-advanced` in initial commit. |
| **Custom Commands** | **Stock Claude Flow** | `.claude/commands/` structure and engine are native. |
| **Skill Integration** | **Stock Claude Flow** | The *mechanism* for loading/routing skills is native. |
| **Prompting Flexibility** | **Stock Claude Flow** | Native capability to handle both NL and structured commands. |
| **Session Management** | **Custom Extension** | `session-closeout` skill and containment protocols added later (`f766c1a`). |
| **Captain's Log** | **Custom Extension** | User-defined protocol and file structure. |
| **Tour Guide Skill** | **Custom Extension** | Added in commit `c3cb87e` (User built). |
| **Tutor Mode Skill** | **Custom Extension** | `v3.0.0` deployed in `768a26e` (User built). |
| **Meta-Skill** | **Custom Extension** | Added in `768a26e` (User built skill for routing). |
| **Prompt Improver** | **Custom Extension** | Added/Updated in `768a26e` (User built). |
| **Findings System** | **Custom Extension** | User-defined protocol for issue tracking. |

## 2. Revised Top 10 Features (Corrected Attribution)

The previous "Top 10" list conflated high-value Stock features with Custom ones. The revised list accurately attributes the power of the *underlying system* while highlighting the *extensions* that manage it.

1.  **SPARC Methodology** (Stock Claude Flow)
2.  **Orchestration Topology Integration** (Stock Claude Flow)
3.  **ReasoningBank Learning** (Stock Claude Flow)
4.  **Hive-Mind Coordination** (Stock Claude Flow)
5.  **Session Management System** (Custom Extension)
6.  **Tour Guide & Tutor Mode** (Custom Skills)
7.  **Captain's Log & Findings** (Custom Protocol)
8.  **Custom Command Engine** (Stock Claude Flow)
9.  **Skill Integration Framework** (Stock Claude Flow)
10. **Prompting Flexibility** (Stock Claude Flow)

## 3. Stock-First Score Re-Calculation

**Previous Score:** 82/100
**New Score:** 92/100

**Logic:**
- The core orchestration logic (SPARC, Topologies, Reasoning, Swarm) is **100% Stock**.
- The execution layer (Claude Code) is **100% Stock**.
- Customizations are strictly **additive** (Skills & Protocols) rather than **modifying** core behavior.
- We are not "patching" Claude Flow; we are "using" it exactly as intended, plus adding our own skills layer.
- **Stock Adherence:** High.
- **Custom Value:** High (in organization and learning layers).

## 4. Implementation Plan

The following files are being updated to reflect this new understanding:

1.  `.claude/skills/tour-guide/lib/feature-explorer.js` & `feature-data.json` (Completed)
2.  `.claude/skills/tour-guide/docs/feature-catalog.md` (Completed)
3.  `CLAUDE.md` (Updating Score)
4.  Tour Scripts (`beginner` through `expert`)
5.  `tutor-mode/skill.md`

