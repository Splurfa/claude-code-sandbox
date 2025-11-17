# 01 · Claude Flow Foundations

## Why This Lesson Exists
This module orients you to the Claude Code + Claude Flow ecosystem so you always know **what tool is doing what**, why the repo authors set things up this way, and how to talk about it in plain English.

## Learning Objectives
1. Describe the difference between **Claude Code** (the coding IDE agent) and **Claude Flow** (the orchestration layer).
2. Explain why the repo enforces "one message = all related operations" and what benefits it delivers.
3. Recognize the stock directories and artifacts that Claude Flow expects.

## Core Concepts (Plain English)
| Term | Plain-English Definition | Where It Shows Up |
| --- | --- | --- |
| Claude Code | The hands-on coder that edits files, runs commands, and answers questions. Think "pair programmer in the IDE." | Every time you or an agent writes code/tests/docs. (ref: [Claude Code overview](https://code.claude.com/docs/en/overview)) |
| Claude Flow | The project-wide conductor that coordinates multiple agents, tracks memory, and enforces process (SPARC, hooks, etc.). | `npx claude-flow ...` commands, MCP tools, hive-mind wizard. (ref: `CLAUDE.md`) |
| MCP Tool | Stock Claude Flow tool that sets up topology, memory, or orchestration. It **never** edits files directly—it only sets the stage. | e.g., `mcp__claude-flow__swarm_init`, `hive-mind:wizard`. (ref: `CLAUDE.md` "Claude Code vs MCP") |
| Hooks | Automations Claude Flow runs before/after tasks (pre-task, post-edit, notify, session-end). They keep memory, logs, and analytics up to date automatically. | `.claude/helpers/standard-checkpoint-hooks.sh`, `CLAUDE.md` rules. |
| SPARC | The five-phase methodology (Specification, Pseudocode, Architecture, Refinement, Completion) baked into the repo. | `CLAUDE.md` + `docs/guides/session-lifecycle-guide.md`. |

### SPARC at a Glance
- **Specification** – capture requirements + acceptance criteria (`npx claude-flow sparc run spec-pseudocode "task"`).  
- **Pseudocode** – outline algorithms before writing code (same `spec-pseudocode` mode).  
- **Architecture** – define systems + contracts (`npx claude-flow sparc run architect "task"`).  
- **Refinement** – implement + test iteratively (`npx claude-flow sparc tdd "feature"`).  
- **Completion** – integrate, document, and hand off (`npx claude-flow sparc run integration "task"`).  
(All commands summarized from `CLAUDE.md`.)

## Stock Repository Expectations
1. **Directory layout matters.** From `CLAUDE.md`: never save work in the repo root; use `src/`, `docs/`, `tests/`, `config/`, `scripts/`, etc.
2. **Artifacts live in sessions until approved.** Every active session writes to `sessions/<session-id>/artifacts/`. Only after closeout do docs move to `docs/projects/...`.
3. **Documentation discipline.** Do not create new `.md` files unless explicitly asked. When you do, they belong under `docs/` or the requested inbox folder (like this exercise).
4. **Parallelism by default.** All substantive actions happen together in single messages. That keeps hooks, logging, and coordination in sync. (ref: `CLAUDE.md` "Golden Rule")
5. **TodoWrite + Tasks are mandatory batches.** If you create todos or spawn agents, you do them all at once.
6. **Claude Code is action-oriented.** Claude Code is expected to "take action—edit files, run commands, create commits" rather than just chat. (ref: [Claude Code overview → "What Claude Code does for you"](https://code.claude.com/docs/en/overview))

## How Claude Flow Uses This Repo
1. You describe the work.
2. Claude Flow (via MCP) sets coordination topology, memory namespaces, and agent roles.
3. Claude Code runs the actual edits/tests inside one big batched message (per "Golden Rule").
4. Hooks capture what happened: memory updates, session summaries, checkpoints, Captain's Log seeds.
5. Closeout scripts archive the session and unlock project promotion (moving docs/test artifacts into permanent folders).

## Practice Prompts
- Explain to a teammate: *"Claude Code does ___ while Claude Flow does ___"*. Use one sentence.
- Describe why the repo forbids saving files in the root folder. What bad things happen if you ignore it?
- List three stock directories and what belongs there.

Move to Module 02 once you can answer those confidently without peeking.
