# Inbox - Cross-Session Communication Hub

The inbox enables asynchronous communication between you, Claude Code (assistant), and external agents across multiple parallel sessions.

## Folder Structure & Permissions

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

---

### `codex-agent/` - External Agent Writes, Claude Code Reads 👁️
**Permissions:** READ-ONLY for Claude Code (external agent manages)
**Purpose:** External agent (Codex) deposits analyses and research

**⚠️ CRITICAL: Claude Code running Claude Flow should NOT edit this folder.**

**What's here:**
- claude-flow-curriculum/ (foundational guides, implementation tracks)
- code-mode-research/ (phase analyses, integration studies)
- db-visualization-tools/ (database tooling)

**Claude Code role:** Read and reference this content ONLY when explicitly directed by user. Do NOT auto-scan, modify, or consolidate.

---

### `cursor-agent/` - External Agent Writes, Claude Code Reads 👁️
**Permissions:** READ-ONLY for Claude Code (external agent manages)
**Purpose:** External agent (Cursor) deposits analyses and research

**⚠️ CRITICAL: Claude Code running Claude Flow should NOT edit this folder.**

**What's here:**
- code-mode-research/ (technical research and analysis)
- db-visualization-tools/ (database tooling)

**Claude Code role:** Read and reference this content ONLY when explicitly directed by user. Do NOT auto-scan, modify, or consolidate.

---

### `user/` - User Deposits, Claude Code Reads 👁️
**Permissions:** READ-ONLY for Claude Code
**Purpose:** You deposit files for Claude Code to reference

**What goes here:**
- Instructions or requirements you want Claude Code to follow
- Reference materials for tasks
- Specifications or examples

**Claude Code role:** Read what you deposit here, do NOT create or modify files in this folder

---

## Usage Patterns

**Cross-Session Communication:**
When working across multiple parallel sessions, agents can:
1. Write findings to `assistant/` subfolder
2. Reference `codex-agent/` curriculum and research
3. Read user-provided materials from `user/`

**Folder Stability:**
Unlike session folders (which are archived after closeout), inbox content persists across all sessions, providing a stable communication channel.

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

## Archive System

The inbox has an archive system at `.inbox/archive/` for long-term storage of completed work. Active materials stay in the three main subfolders above.
