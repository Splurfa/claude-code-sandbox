# Implementation Track · 02 Agentic Operations

Goal: practice running Claude Flow the way authors intended—single batched commands, SPARC workflows, and hook discipline.

## Learning Objectives
1. Execute the start → work → closeout flow using real commands.
2. Run SPARC helpers to structure work even if you're non-technical.
3. Observe hook + memory effects so you know what "good" looks like.

## Exercise A · Run a Mini Session
1. **Pre-task**
   ```bash
   npx claude-flow@alpha hooks pre-task --description "Practice audit logging"
   ```
2. **Batch work** – spawn a hive or single agent via one Claude Code message (per `CLAUDE.md`).
3. **Post-edit** after each file touch:
   ```bash
   npx claude-flow@alpha hooks post-edit --file "docs/practice.md"
   ```
4. **Notify** when you finish a milestone:
   ```bash
   npx claude-flow@alpha hooks notify --message "Practice change staged"
   ```
5. **Closeout** using post-task + session-end hooks.

Track outputs in `sessions/<session-id>/artifacts/` and confirm Captain's Log entries exist (`docs/protocols/captain-log-protocol.md`).

## Exercise B · SPARC Dry Run
1. Specification/Pseudocode combo: `npx claude-flow sparc run spec-pseudocode "build audit trail"`
2. Architecture: `npx claude-flow sparc run architect "build audit trail"`
3. Refinement (TDD): `npx claude-flow sparc tdd "audit trail"`
4. Completion: `npx claude-flow sparc run integration "audit trail"`

Log key decisions in Captain's Log after each phase. SPARC commands lifted directly from `CLAUDE.md`.

## Exercise C · Observe Memory
Use the CLI to inspect coordination status:
```bash
npx claude-flow hive-mind status
npx claude-flow hive-mind memory
npx claude-flow@alpha memory search --namespace "coordination" --pattern "swarm/*"
```
Document which keys update (e.g., `swarm/queen/status`, `swarm/shared/collective-state`).

## Exit Criteria
- [ ] Completed one session with all five hooks executed.
- [ ] Ran at least one SPARC command and captured notes.
- [ ] Identified at least three coordination memory keys and what they mean.
