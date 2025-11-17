# 02 · Session Lifecycle & Process Discipline

This module covers how the repo authors expect you to run work **end-to-end** using Claude Flow's stock lifecycle: Start → Work → Closeout → Archive. Everything below is drawn directly from the provided docs (`docs/guides/session-lifecycle-guide.md`, `docs/protocols/hitl-workflow.md`, `docs/protocols/captain-log-protocol.md`, `CLAUDE.md`).

## Learning Objectives
1. Run every session with the four official phases.
2. Know when to trigger hooks (pre-task, post-edit, notify, post-task, session-end).
3. Capture human approvals correctly using HITL (Human-in-the-Loop) checkpoints.
4. Keep the Captain's Log as the "why" ledger.

## Step-by-Step Workflow (Plain English)
### Phase 1 · Start
1. **Pre-task hook** `npx claude-flow@alpha hooks pre-task --description "..."`
   - Creates a task ID, initializes memory, and logs "who/what/why".
2. **Create artifacts folder** `sessions/<session-id>/artifacts/`
   - All outputs (notes, drafts, code snippets) stay here until closeout.
3. **Restore context** (optional) `hooks session-restore`, `memory search`.

### Phase 2 · Active Work
1. **Batch your message** (per `CLAUDE.md` Golden Rule).
2. **Use subagents** for real tasks; simple clarifications can stay single-agent.
3. **Post-edit hook** `npx claude-flow@alpha hooks post-edit --file ...` after each file change so memory + analytics stay current.
4. **Notify hook** when coordination updates are needed.
5. **Keep session-summary.md** current (Claude Flow auto-maintains it, but mention key decisions, blockers, tests).

### Phase 3 · HITL + Captain's Log
1. **HITL levels** (from `docs/protocols/hitl-workflow.md`):
   - Level 1 Auto — formatting, reading files, running tests.
   - Level 2 Ask First — migrations, API contract changes, new deps.
   - Level 3 Never Auto — credentials, production data, security-sensitive work.
2. **Log decisions** with `captains-log` namespace using the timestamped key format `journal:YYYY-MM-DD-HH:MM:SS`.
3. **During review**: ensure unreviewed blockers/questions call out `"hitl_reviewed": false` so you remember to approve/decline them later.

### Phase 4 · Closeout
1. **Collect evidence** (from session guide): fetch pre-task metadata, post-edit records, Captain's Log entries, test results.
2. **Classify** progress (categories, complexity, follow-up needed).
3. **HITL** approval: present summary questions (quality, security, architecture, documentation, blockers) and store the decision.
4. **Archive**: run `hooks post-task --task-id ...` and `hooks session-end --export-metrics true`. Artifacts folder becomes read-only. Only now can you promote deliverables to `docs/projects/...`.

## Hooks Cheat Sheet
| Hook | When | Why |
| --- | --- | --- |
| `hooks pre-task` | Before any work | Task ID + context seed |
| `hooks post-edit --file ...` | After file edits | Memory + analytics
| `hooks notify --message ...` | Major milestone or coordination update | Keeps agents in sync |
| `hooks post-task --task-id ...` | After work done | Write final status to memory |
| `hooks session-end --export-metrics true` | Final wrap-up | Metrics + backups |

```bash
# Example command sequence (from `docs/guides/session-lifecycle-guide.md`)
npx claude-flow@alpha hooks pre-task --description "Add audit logging"
npx claude-flow@alpha hooks post-edit --file "src/logging/audit.ts"
npx claude-flow@alpha hooks notify --message "Audit logger complete, ready for review"
npx claude-flow@alpha hooks post-task --task-id task-123456
npx claude-flow@alpha hooks session-end --export-metrics true
```

## Documentation Expectations
- **Session summary**: living narrative under `sessions/<id>/artifacts/session-summary.md`.
- **Captain's Log**: single source of "why" decisions; reference artifact paths.
- **Never create docs in root**: only `docs/` or explicit folders.

### HITL Scenario Example (Level 2 – Ask First)
1. **Proposed action**: "Add `pg` dependency and run database migration."  
2. **Log blocker** (Captain's Log, namespace `captains-log`):  
   ```json
   {
     "timestamp": "2025-11-14T18:30:00Z",
     "type": "blocker",
     "title": "Need approval to add pg dependency",
     "content": "Installing pg@8 and running migration 2025-11-14-add-audit-table. No data loss expected.",
     "hitl_reviewed": false
   }
   ```
3. **Wait for approval**. Reviewer responds "Approved—proceed with dependency install + migration."  
4. **Update entry** with `"hitl_reviewed": true` and summary of what changed.  
(Process from `docs/protocols/hitl-workflow.md` + `docs/protocols/captain-log-protocol.md`.)

## Practice Checklist
1. Draft a mini runbook: Write down the exact CLI commands you would run for the four phases.
2. Create a mock Captain's Log entry (type "decision") referencing a fake session summary path.
3. Identify one HITL Level 2 situation relevant to your work and explain why it needs approval.

Once those feel comfortable, move to Module 03 (coordination).
