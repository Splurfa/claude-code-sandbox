# 00 · Quick Glossary & Checklist

Use this appendix as a single-page refresher before or during a session.

## Key Terms (Plain English)
| Term | Meaning | Reference |
| --- | --- | --- |
| Claude Code | IDE-native agent that edits files, runs commands, and can create commits. | [Claude Code overview](https://code.claude.com/docs/en/overview) |
| Claude Flow | Orchestration layer that coordinates agents, memory, and SPARC workflows. | `CLAUDE.md` |
| MCP Tool | API-style command (e.g., `mcp__claude-flow__swarm_init`) that configures coordination but never edits files directly. | `CLAUDE.md` |
| SPARC | Five-phase methodology: Specification, Pseudocode, Architecture, Refinement, Completion. | `CLAUDE.md` |
| Hooks | Automation entry points (pre-task, post-edit, notify, post-task, session-end) that keep memory/logs updated. | `docs/guides/session-lifecycle-guide.md` |
| Captain's Log | Timestamped decision journal stored under the `captains-log` namespace. | `docs/protocols/captain-log-protocol.md` |
| HITL | Human-in-the-loop approval workflow with three levels (Auto, Ask First, Never Auto). | `docs/protocols/hitl-workflow.md` |

## Hook Order Cheat Sheet
```bash
npx claude-flow@alpha hooks pre-task --description "..."
# Work happens here
npx claude-flow@alpha hooks post-edit --file "..."
# Optional updates
npx claude-flow@alpha hooks notify --message "..."
# When work is done
npx claude-flow@alpha hooks post-task --task-id task-12345
npx claude-flow@alpha hooks session-end --export-metrics true
```

## Memory Namespaces to Watch
| Namespace | Purpose |
| --- | --- |
| `coordination/*` | Hive-mind status (queen, workers, scouts, memory manager). |
| `captains-log` | Decisions, insights, blockers, milestones. |
| `hooks:pre-task` / `hooks:post-task` | Task metadata and completion records. |
| `sessions/captains-log` (files) | Daily human-readable log for each session. |

## CLI Quick Picks
| Action | Command |
| --- | --- |
| SPARC TDD run | `npx claude-flow sparc tdd "feature"` |
| Hive wizard | `npx claude-flow@alpha hive-mind:wizard` |
| Hive status | `npx claude-flow hive-mind status` |
| Add Flow Nexus MCP | `claude mcp add flow-nexus npx flow-nexus@latest mcp start` (Flow Nexus README) |

## Pre-Session Checklist
- [ ] Pre-task hook run with clear description.
- [ ] Session artifacts folder created.
- [ ] Past context restored (session restore or Captain's Log review).

## During-Session Checklist
- [ ] All substantive operations batched in one Claude Code message.
- [ ] Post-edit hook after each file change.
- [ ] Notify hook after major milestones.
- [ ] Captain's Log entries for decisions/blockers (mark `hitl_reviewed` when resolved).

## Closeout Checklist
- [ ] Evidence collected (modified files, tests, log entries).
- [ ] HITL approvals recorded for pending blockers/questions.
- [ ] `hooks post-task` + `hooks session-end` executed.
- [ ] Approved artifacts promoted out of the session folder.
