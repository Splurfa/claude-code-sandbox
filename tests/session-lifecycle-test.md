# Session Lifecycle Validation Test

This file validates that the session lifecycle works correctly.

## Test Execution
- Session start: run pre-task hook **and** ensure `sessions/<session-id>/artifacts/` exists before agents write.
- During work: perform file edits + post-edit hook, confirm `session-summary.md` is created/updated inside the artifacts folder.
- Closeout rehearsal: present artifacts + summary for HITL review, capture approval result, then execute post-task + session-end hooks.

## Expected Results
- Memory entries persist (AgentDB + Reasoning Bank reflect the session context).
- All artifacts live inside the session's artifacts folder, organized with agent-defined subfolders.
- `session-summary.md` matches the reviewed/approved summary text.
- Captain's Log entry references the approved summary file path after HITL sign-off.
- Backup created in `.swarm/backups/` and session folder treated as read-only once closed.
- Session restore functional.
