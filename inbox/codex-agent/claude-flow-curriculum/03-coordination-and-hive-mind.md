# 03 · Coordination, Subagents & Hive Mind

This lesson explains how the repo authors expect you to scale beyond a single agent. It draws on `CLAUDE.md`, `.claude/skills/hive-mind-advanced/SKILL.md`, and the personas inside `.claude/agents/hive-mind/`.

## Learning Objectives
1. Decide when to stick with one agent vs. invoking a hive.
2. Understand the roles inside the hive mind (queen, collective intelligence, scouts, workers, memory manager).
3. Run the hive-mind wizard and interpret its output.
4. Customize coordination safely without breaking stock expectations.

## When to Use Hive Mind (Straight from `CLAUDE.md`)
Use `/hive-mind:wizard` or `npx claude-flow@alpha hive-mind:wizard` when:
- Work spans multiple disciplines (frontend + backend + tests + docs).
- Architecture decisions need multiple viewpoints.
- Large refactors or feature builds require parallel effort.
Avoid it for trivial, single-file edits.

## What Happens When You Engage `/hive-mind:wizard`
1. **Wizard interview** — You provide objective, constraints, risk appetite, deliverable types. (`CLAUDE.md`)
2. **Topology planning** — Wizard picks queen type (strategic/tactical/adaptive), consensus mode (majority/weighted/Byzantine), worker counts, and memory budgets. (ref: `.claude/skills/hive-mind-advanced/SKILL.md`)
3. **Persona wiring** — Claude Flow instantiates agents defined in `.claude/agents/hive-mind/`:
   - `queen-coordinator`: sets hierarchy, allocates resources, posts royal directives. (ref: `.claude/agents/hive-mind/queen-coordinator.md`)
   - `collective-intelligence-coordinator`: synchronizes memory, runs consensus votes, watches load. (ref: `.claude/agents/hive-mind/collective-intelligence-coordinator.md`)
   - `scout-explorer`: gathers intel, maps codebases, surfaces threats/opportunities. (ref: `.claude/agents/hive-mind/scout-explorer.md`)
   - `worker-specialist`: executes tasks, reports status before/during/after. (ref: `.claude/agents/hive-mind/worker-specialist.md`)
   - `swarm-memory-manager`: keeps memory indexes, resolves conflicts, reports metrics every 60s. (ref: `.claude/agents/hive-mind/swarm-memory-manager.md`)
4. **Task bundle output** — Wizard produces a set of `Task("role", "instructions", "agent-type")` lines plus TodoWrite entries and optional Bash scaffolding. You paste/run that entire batch in one Claude Code message.
5. **Runtime logging** — Each persona immediately writes to `mcp__claude-flow__memory_usage` under the `coordination` namespace, so you can monitor `swarm/queen/*`, `swarm/shared/*`, `swarm/worker-*`, etc.

## Consensus & Memory (Plain English)
- **Majority**: whoever gets the most votes wins.
- **Weighted**: queen votes count triple, useful when strategic direction matters.
- **Byzantine**: needs ≥⅔ agreement, resistant to flaky agents.
- **Memory types** (from the skill doc):
  - `knowledge` (permanent insights)
  - `context` (hour-long session state)
  - `task` (30-minute scoped data)
  - `result`, `error`, `metric`, `consensus`, `system`
- Repo customization: all hive writes funnel through the `coordination` namespace so session tooling can read them without special casing.
- Vendor expectation: Claude Code isn’t just chat—it “takes action” (edits files, runs commands, creates commits) and MCP lets it reach design docs and tickets. (ref: [Claude Code overview → “What Claude Code does for you”](https://code.claude.com/docs/en/overview))

## Customization Without Breaking Stock Behavior
1. **Add new worker personas** by copying `.claude/agents/hive-mind/worker-specialist.md` and adjusting capabilities. Keep mandatory memory logging intact.
2. **Change topology defaults** via wizard answers instead of hacking scripts—authors expect you to use CLI prompts, not edit core helpers.
3. **Tune memory** using `hive-mind memory` CLI flags (cache size, GC interval). Avoid editing `.swarm/memory.db` manually.
4. **Log everything** — new personas should still use `mcp__claude-flow__memory_usage` so Captain's Log + audits stay accurate.

## Monitoring & Control Commands
```bash
npx claude-flow hive-mind status      # Overall health, active agents
npx claude-flow hive-mind metrics     # Performance stats (queue depth, success rate)
npx claude-flow hive-mind memory      # Collective memory usage + optional GC
npx claude-flow hive-mind sessions    # List active/past sessions
npx claude-flow hive-mind resume <id> # Resume paused hive
npx claude-flow hive-mind stop <id>   # Gracefully stop hive
```
*(Commands from `.claude/skills/hive-mind-advanced/SKILL.md` and `CLAUDE.md`.)*

## Practical Exercise
1. Run the wizard (even hypothetically) and note the questions it asked. Draft your answers for a project you care about.
2. Sketch the memory keys you expect to watch (e.g., `swarm/queen/royal-report`, `swarm/shared/collective-state`).
3. Describe how you would downgrade from Byzantine consensus to weighted if decisions are stalling—what command/parameter would you change?

Ready for Module 04 once you can explain the hive roles and CLI flow without referencing this sheet.
