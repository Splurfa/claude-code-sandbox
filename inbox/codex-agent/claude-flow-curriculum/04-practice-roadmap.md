# 04 · Practice Roadmap & Next Steps

This final module turns the previous lessons into a repeatable learning plan. It mixes observation, dry runs, and real work so you build muscle memory.

## Stage A · Observe & Narrate
1. **Shadow a session** – Open an existing `sessions/<date>/completed/` folder and read `session-summary.md`, the Captain's Log entry, and any promoted docs. Narrate aloud what happened in each phase.
2. **Trace memory** – Use `npx claude-flow@alpha memory search --namespace "coordination" --pattern "swarm/*"` to see how hive agents wrote status. Identify at least three recurring keys.
3. **Checklist rehearsal** – Without running commands, verbalize every step from Module 02 (Start → Work → HITL → Closeout). Goal: zero hesitation.

## Stage B · Dry Runs (No-code drills)
1. **Hook rehearsal** – Write a fake timeline showing when you'd call `hooks pre-task`, `post-edit`, `notify`, `post-task`, `session-end` for a mock feature.
2. **HITL scenarios** – Invent three actions and classify them Level 1/2/3. Explain what you'd log in the Captain's Log and when you'd pause for human approval.
3. **Wizard questionnaire** – Fill in the prompts you expect from `/hive-mind:wizard` (objective, success criteria, risks, deliverables). Keep this template handy.

## Stage C · Guided Execution (Small real tasks)
1. **Single-agent warmup** – Fix a typo or update a README by yourself while still running the full session lifecycle. Focus on hooks + Captain's Log accuracy.
2. **Mini hive** – Ask the wizard to assemble 2–3 agents for a small refactor (e.g., add a test + adjust docs). Paste the Task bundle, let it run, then read the memory traces to ensure every persona reported status.
3. **Closeout drill** – Fully close the session: collect artifacts, run post-task + session-end hooks, promote one approved doc to `docs/projects/...` (per instructions) to feel the ceremonial finish.

## Stage D · Build Your Own Playbook
1. **Personal checklists** – Turn the module highlights into a single-page cheat sheet (CLI commands, hook order, HITL rules, Captain's Log format).
2. **Coordination patterns** – Document when you'll default to strategic vs. tactical queens, and what consensus mode you prefer for different project types.
3. **Customization ideas** – Keep a living note of persona tweaks or additional worker templates you want to add once you're comfortable.

## Stage E · Continuous Improvement
1. **After-action reviews** – After each real session, answer: What went well? What hooks or logs did I forget? Where did coordination lag?
2. **Memory hygiene** – Schedule periodic `hive-mind memory --gc` or manual cleanup of stale `coordination` entries to keep `.swarm/memory.db` lean.
3. **Learning log** – Record insights in the Captain's Log even outside formal sessions so future you (or collaborators) can see the reasoning thread.

## Measuring Progress
- **Confidence test**: teach someone else the Start → Work → Closeout flow without notes.
- **Autonomy test**: run `/hive-mind:wizard`, review the produced Task bundle, and explain every line.
- **Quality test**: can you spot missing hooks or HITL approvals in someone else's session log? If yes, you're thinking like a coordinator.

Keep iterating through these stages until the patterns feel second nature. Once your custom spec stabilizes, you can layer new modules on top of this core curriculum.
