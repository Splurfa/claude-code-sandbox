# README Updates Proposal - Content Placement Guidelines

**Session**: session-20251116-084306-system-hygiene-check
**Date**: 2025-11-16
**Purpose**: Clarify content placement rules for docs/ vs inbox/assistant/

---

## Executive Summary

This proposal adds explicit content placement guidelines to README files to prevent confusion about where different types of content belong:

- **docs/guides/**: USER-FACING guides explaining features and concepts
- **inbox/assistant/**: Architectural analysis, system integration work, "working on the system"

**Files Updated**: 3
- docs/README.md
- docs/guides/README.md
- inbox/README.md

**New Files**: 1
- inbox/assistant/README.md (create)

---

## 1. docs/README.md

### Current Issues
- No clear guidance on what content belongs in docs/
- No distinction between user-facing guides and system development work
- No reference to inbox/assistant/ for architectural work

### Proposed Changes

#### BEFORE (lines 1-20)
```markdown
# Project Documentation

This folder contains user project documentation and materials.

## Structure

### `projects/`
User projects will be organized here. Each project gets its own subfolder when work begins.

**Current status:** Empty (setup phase - waiting for first project)

---

## Usage

- **User manages:** Project folders, documentation structure, content organization
- **System creates:** Session artifacts go to `sessions/$SESSION_ID/artifacts/docs/` (not here)

This folder reflects the current state of your projects. Session-specific documentation stays in session artifacts.
```

#### AFTER
```markdown
# Project Documentation

This folder contains user project documentation and materials.

## What Belongs in docs/

**Content Type**: USER-FACING DOCUMENTATION

This directory is for:
- ✅ **User guides** explaining how to use features
- ✅ **Concept explanations** for understanding the system
- ✅ **How-to guides** for accomplishing tasks
- ✅ **Reference documentation** (checklists, quick references)
- ✅ **Troubleshooting guides** for fixing common problems

**NOT for:**
- ❌ Architectural analysis and system design work
- ❌ Integration investigations and technical deep-dives
- ❌ "Working on the system" documentation
- ❌ Session-specific artifacts (use `sessions/$SESSION_ID/artifacts/docs/`)

**For system development work**, see: `inbox/assistant/` (architectural problems, integration analysis)

---

## Structure

### `guides/`
Comprehensive user-facing documentation following the Divio system:
- `getting-started/` - Tutorials for beginners
- `how-to/` - Step-by-step task guides
- `reference/` - Quick references and checklists
- `troubleshooting/` - Problem-solving guides
- `concepts/` - Explanations and architecture
- `advanced/` - Advanced topics and optimization

See: [guides/README.md](guides/README.md) for complete guide catalog

### `projects/`
User projects will be organized here. Each project gets its own subfolder when work begins.

**Current status:** Empty (setup phase - waiting for first project)

---

## Usage

- **User manages:** Project folders, documentation structure, content organization
- **System creates:** Session artifacts go to `sessions/$SESSION_ID/artifacts/docs/` (not here)

This folder reflects the current state of your projects. Session-specific documentation stays in session artifacts.

---

## Content Placement Quick Reference

| Content Type | Location | Example |
|--------------|----------|---------|
| User guide | `docs/guides/how-to/` | "How to test integrations" |
| Feature explanation | `docs/guides/concepts/` | "Understanding sessions" |
| Troubleshooting | `docs/guides/troubleshooting/` | "Fixing MCP errors" |
| Architectural analysis | `inbox/assistant/` | "ReasoningBank integration research" |
| System integration work | `inbox/assistant/` | "Claude-flow hook system investigation" |
| Session artifacts | `sessions/$SESSION_ID/artifacts/docs/` | Session-specific documentation |

**Rule of thumb:** If it's explaining features TO the user, it goes in `docs/guides/`. If it's analyzing the system FOR development, it goes in `inbox/assistant/`.
```

### Rationale
- **Clear boundaries**: Explicitly states what content belongs where
- **Visual clarity**: Uses ✅/❌ markers for quick scanning
- **Quick reference table**: Provides concrete examples
- **Cross-reference**: Links to inbox/assistant/ for system work
- **Preserves structure**: Keeps existing organization intact

---

## 2. docs/guides/README.md

### Current Issues
- Comprehensive guide catalog but no content placement rules
- Could benefit from clarifying it's user-facing only

### Proposed Changes

#### Addition at Top (after line 6, before "Documentation Structure")

```markdown
---

## What Belongs in docs/guides/

**Audience**: End users and developers USING the system

This directory contains:
- ✅ **User-facing guides** explaining how features work
- ✅ **Feature explanations** for understanding concepts
- ✅ **How-to documentation** for accomplishing tasks
- ✅ **Reference materials** (checklists, quick lookups)
- ✅ **Troubleshooting guides** for fixing issues

**NOT for:**
- ❌ Architectural analysis or system design investigations
- ❌ Integration research or technical deep-dives
- ❌ "Working on the system" development documentation

**For system development work**, use: `inbox/assistant/` (organized by topic/date)

**For session-specific docs**, use: `sessions/$SESSION_ID/artifacts/docs/`

---
```

### Rationale
- **Clarifies scope**: Makes it clear this is user-facing only
- **Prevents pollution**: Avoids mixing user guides with system analysis
- **Provides alternatives**: Directs system work to appropriate location
- **Minimal change**: Adds context without restructuring existing content

---

## 3. inbox/README.md

### Current Issues
- Focuses on permissions (read/write) but not content organization
- No guidance on organizing assistant/ subfolder by topic
- No examples of what belongs in assistant/ vs docs/

### Proposed Changes

#### Addition after line 18 (in assistant/ section)

**BEFORE (lines 6-19)**:
```markdown
### `assistant/` - Claude Code Writes Here ✍️
**Permissions:** Read/Write for Claude Code
**Purpose:** Claude Code deposits reports, summaries, and findings from sessions

**What goes here:**
- Session completion reports
- Investigation findings
- Hive mind coordination summaries
- Cross-session insights
- closeout-investigation/ (forensic reports, evidence, recommendations)

**When to write:** After significant milestones, session closeouts, or when findings need to persist across sessions
```

**AFTER**:
```markdown
### `assistant/` - Claude Code Writes Here ✍️
**Permissions:** Read/Write for Claude Code
**Purpose:** Claude Code deposits reports, summaries, and findings from sessions

**Content Type:** SYSTEM DEVELOPMENT & ARCHITECTURAL WORK

**What goes here:**
- ✅ **Architectural analysis** and system design investigations
- ✅ **Integration research** and technical deep-dives
- ✅ **"Working on the system"** documentation and findings
- ✅ **Session completion reports** from significant milestones
- ✅ **Hive mind coordination** summaries
- ✅ **Cross-session insights** that need to persist
- ✅ **closeout-investigation/** (forensic reports, evidence, recommendations)

**Organization**: Use dated topic subfolders for clarity
```
Examples:
- `2025-11-16-reasoningbank-integration/` - Integration research
- `2025-11-15-hook-system-analysis/` - System architecture analysis
- `2025-11-14-session-protocol-investigation/` - Protocol design work
- `closeout-investigation/` - Session closeout forensics
```

**NOT for:**
- ❌ User-facing guides (use `docs/guides/`)
- ❌ Feature explanations for end users (use `docs/guides/concepts/`)
- ❌ How-to guides for users (use `docs/guides/how-to/`)

**When to write:** After significant milestones, session closeouts, or when findings need to persist across sessions
```

#### New Section: "Content Organization" (add after line 64, before "Archive System")

```markdown
---

## Content Organization Guidelines

### docs/ vs inbox/assistant/ - What Goes Where?

**Use `docs/guides/` for:**
- Explaining features to users ("How to use sessions")
- Troubleshooting guides ("Fixing hook errors")
- Reference documentation ("Command quick reference")
- Conceptual explanations ("Understanding swarm topology")

**Use `inbox/assistant/` for:**
- Researching integration approaches ("Evaluating ReasoningBank options")
- Analyzing system architecture ("Hook system design investigation")
- Investigating technical problems ("Root cause analysis of coordination failures")
- Documenting system development decisions ("Why we chose X over Y")

**Rule of thumb:**
- **FOR the user** → `docs/guides/`
- **ABOUT the system** → `inbox/assistant/`

### Organization Best Practices

**inbox/assistant/ structure:**
```
inbox/assistant/
├── 2025-11-16-research-topic/     ← Dated topic folders
│   ├── findings.md
│   ├── analysis.md
│   └── recommendations.md
├── 2025-11-15-integration-work/
│   └── implementation-notes.md
└── closeout-investigation/         ← Persistent subfolder
    └── session-YYYYMMDD-HHMMSS.md
```

**Why date prefixes?**
- Easy chronological sorting
- Clear context for stale content
- Natural archival candidates (>90 days)

---
```

### Rationale
- **Clear differentiation**: Explicit examples of docs/ vs inbox/assistant/ content
- **Organization system**: Introduces dated topic folders for clarity
- **Examples**: Concrete folder names show the pattern
- **Prevents mixing**: Clear ✅/❌ markers prevent content pollution

---

## 4. inbox/assistant/README.md (NEW FILE)

### Current Status
- File does not exist
- No guidance for organizing assistant/ subfolder

### Proposed Content

```markdown
# Assistant Workspace - System Development & Analysis

**Purpose**: Claude Code's workspace for architectural analysis, system integration research, and "working on the system" documentation.

---

## What Belongs Here

**Content Type**: SYSTEM DEVELOPMENT & ARCHITECTURAL WORK

This directory is for:
- ✅ **Architectural analysis** and system design investigations
- ✅ **Integration research** (evaluating approaches, technical feasibility)
- ✅ **Root cause analysis** of system-level issues
- ✅ **Technical deep-dives** and implementation research
- ✅ **Session closeout reports** (closeout-investigation/)
- ✅ **Cross-session findings** that need to persist

**NOT for:**
- ❌ User-facing guides (use `docs/guides/`)
- ❌ Feature explanations (use `docs/guides/concepts/`)
- ❌ How-to documentation (use `docs/guides/how-to/`)
- ❌ Session artifacts (use `sessions/$SESSION_ID/artifacts/`)

---

## Organization System

### Dated Topic Folders

**Pattern**: `YYYY-MM-DD-topic-description/`

**Examples:**
```
inbox/assistant/
├── 2025-11-16-reasoningbank-integration/
│   ├── research-findings.md
│   ├── implementation-options.md
│   └── decision-rationale.md
├── 2025-11-15-hook-system-analysis/
│   ├── current-architecture.md
│   ├── performance-analysis.md
│   └── optimization-recommendations.md
├── 2025-11-14-session-protocol-investigation/
│   ├── protocol-design.md
│   └── edge-cases.md
└── closeout-investigation/         ← Persistent (no date prefix)
    ├── session-20251115-210537.md
    └── session-20251114-163042.md
```

**Why this structure?**
- **Chronological sorting**: Easy to find recent work
- **Clear context**: Date shows when research was done
- **Archival clarity**: Old content (>90 days) is easy to identify
- **Topic grouping**: Related files stay together

---

## Content Examples

### ✅ GOOD (belongs in inbox/assistant/)

**Architectural Analysis:**
- "ReasoningBank Integration Options Analysis"
- "Hook System Performance Investigation"
- "Session Protocol Edge Case Research"

**Integration Research:**
- "Evaluating AgentDB vs PostgreSQL for Memory Storage"
- "Claude-Flow vs Custom Orchestration Comparison"
- "MCP Tool Performance Benchmarking"

**System Development:**
- "Root Cause: Session Overlap Coordination Failures"
- "Git Checkpoint System Design Investigation"
- "Memory Namespace Architecture Decisions"

### ❌ WRONG (belongs in docs/guides/)

**User-Facing Guides:**
- "How to Use Sessions" → `docs/guides/how-to/`
- "Understanding Swarm Topology" → `docs/guides/concepts/`
- "Fixing Hook Errors" → `docs/guides/troubleshooting/`

---

## Lifecycle & Archival

### When to Archive

Content older than **90 days** should be reviewed for archival:

```bash
# Find old content
find inbox/assistant -type d -name "2024-*" -o -name "2025-0[1-8]-*"

# Move to archive
mv inbox/assistant/2025-08-15-old-topic .inbox/archive/assistant/
```

### Exception: Persistent Folders

Some folders persist indefinitely:
- `closeout-investigation/` - Session forensics (keep all)
- Active research (even if >90 days)

---

## Quick Reference

| Content Type | Location | Example |
|--------------|----------|---------|
| Architectural research | `inbox/assistant/YYYY-MM-DD-topic/` | Integration options analysis |
| System design analysis | `inbox/assistant/YYYY-MM-DD-topic/` | Performance investigation |
| Implementation research | `inbox/assistant/YYYY-MM-DD-topic/` | Technical feasibility study |
| Session closeout | `inbox/assistant/closeout-investigation/` | Forensic reports |
| User guide | `docs/guides/how-to/` | NOT here |
| Feature explanation | `docs/guides/concepts/` | NOT here |

---

## Usage Patterns

### Starting New Investigation

```bash
# Create dated topic folder
mkdir -p inbox/assistant/$(date +%Y-%m-%d)-topic-name

# Add initial findings
touch inbox/assistant/$(date +%Y-%m-%d)-topic-name/{research.md,findings.md,recommendations.md}
```

### Writing Session Closeout

```bash
# Closeout reports go to persistent folder
touch inbox/assistant/closeout-investigation/session-$(date +%Y%m%d-%H%M%S).md
```

### Cross-Session Coordination

When multiple sessions need to share findings:
1. Write to dated topic folder in `inbox/assistant/`
2. Other sessions read from this location
3. Findings persist after session closeout

---

## Integration with docs/guides/

**After research completes:**

If findings need to be shared with users, create user-facing documentation:

1. **Research done**: `inbox/assistant/2025-11-16-feature-research/`
2. **User guide created**: `docs/guides/how-to/using-new-feature.md`
3. **Keep both**: Research stays in inbox/ for future reference

**Separation of concerns:**
- `inbox/assistant/` = Technical research and decisions
- `docs/guides/` = User-facing explanation of the feature

---

## Permissions

- **Claude Code**: Read/Write ✍️
- **User**: Read 👁️ (for transparency)
- **External agents**: No access (use `inbox/codex-agent/` instead)

---

**Last Updated**: 2025-11-16
**Status**: Active workspace
```

### Rationale
- **Complete guidance**: Standalone README for assistant/ subfolder
- **Organization system**: Clear pattern for dated topic folders
- **Examples**: Concrete use cases show the intended pattern
- **Lifecycle management**: Archival guidance prevents clutter
- **Integration**: Shows relationship to docs/guides/

---

## Impact Assessment

### Files Created
1. `inbox/assistant/README.md` - New organizational guidance

### Files Modified
1. `docs/README.md` - Added content placement section
2. `docs/guides/README.md` - Added scope clarification
3. `inbox/README.md` - Enhanced organization guidelines

### Existing Content
- **No content moved** - This is purely documentation/guidance
- **No breaking changes** - Existing files remain in place
- **Clarification only** - Prevents future misplacement

### Migration Needed?
**No**. Current content placement appears correct:
- `docs/guides/` contains user-facing guides ✅
- `inbox/assistant/closeout-investigation/` has session reports ✅
- No obvious misplaced content found

---

## Implementation Checklist

- [ ] Review proposal with user
- [ ] User approves changes
- [ ] Apply changes to docs/README.md
- [ ] Apply changes to docs/guides/README.md
- [ ] Apply changes to inbox/README.md
- [ ] Create inbox/assistant/README.md
- [ ] Verify links work
- [ ] Test organization pattern with next research task
- [ ] Update session closeout to reference these guidelines

---

## Next Steps

**After HITL approval:**

1. Apply all README changes
2. Create inbox/assistant/README.md
3. Test organization pattern with next architectural research
4. Monitor for confusion over next few sessions
5. Refine guidelines based on actual usage

**No immediate action needed** - Waiting for user review and approval.

---

## Appendix: Key Principles

### The Core Distinction

**docs/guides/ (FOR the user)**
- "How do I use sessions?"
- "What is swarm topology?"
- "How to fix this error?"

**inbox/assistant/ (ABOUT the system)**
- "Should we use ReasoningBank or custom implementation?"
- "Root cause of coordination failures?"
- "Performance analysis of hook system?"

### Visual Guide

```
User asks: "How do I test integrations?"
└─> Write guide: docs/guides/how-to/integration-testing-guide.md

Claude investigates: "What's the best memory storage approach?"
└─> Research: inbox/assistant/2025-11-16-memory-storage-research/

Session completes with findings
└─> Report: inbox/assistant/closeout-investigation/session-YYYYMMDD.md

Session creates temporary analysis
└─> Artifact: sessions/$SESSION_ID/artifacts/docs/analysis.md
```

---

**END OF PROPOSAL**

**Status**: Awaiting HITL review and approval
**Created**: 2025-11-16
**Session**: session-20251116-084306-system-hygiene-check
