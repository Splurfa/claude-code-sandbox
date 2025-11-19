# Example: Batch Session Closeout

**Scenario:** You have 3 completed sessions and want to archive them all.

## Current Sessions

```bash
sessions/
├── session-20251114-120000-api-development/ (done)
├── session-20251114-140000-bug-fix/ (done)
├── session-20251114-160000-refactor/ (done)
└── session-20251114-180000-current/ (active)
```

## Approach

Close each session individually with closeout skill.

**Note:** Batch mode not yet implemented (would require custom script, violates stock-first).

## Session 1: API Development

**Say:** "Close out session-20251114-120000-api-development"

*[Approval prompt shows, user types `y`]*

✅ Session 1 archived

## Session 2: Bug Fix

**Say:** "Close out session-20251114-140000-bug-fix"

*[Approval prompt shows, user types `y`]*

✅ Session 2 archived

## Session 3: Refactor

**Say:** "Close out session-20251114-160000-refactor"

*[Approval prompt shows, user types `y`]*

✅ Session 3 archived

## Verification

```bash
ls -lh .swarm/backups/
# session-20251114-120000-api-development.json
# session-20251114-140000-bug-fix.json
# session-20251114-160000-refactor.json
```

## Alternative: Script Wrapper (5% Custom)

If you frequently need batch closeout, create thin wrapper:

```bash
#!/bin/bash
# batch-closeout.sh (thin wrapper, not part of skill)

for session in "$@"; do
  echo "Closing $session..."
  # Invoke skill for each session
  # (Requires manual approval for each)
done
```

**Usage:**
```bash
./batch-closeout.sh session-20251114-120000-* session-20251114-140000-*
```

**Stock-first check:** ✅ Still uses skill for each session (95% stock)
