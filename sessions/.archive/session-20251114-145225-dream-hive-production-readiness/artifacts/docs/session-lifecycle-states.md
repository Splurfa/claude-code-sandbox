# Session Lifecycle States

## State Machine Definition

```
┌──────────┐
│          │
│  ACTIVE  │◄──┐
│          │   │
└────┬─────┘   │
     │         │
     │ pause   │ resume
     │         │
     ▼         │
┌──────────┐   │
│          │   │
│  PAUSED  │───┘
│          │
└────┬─────┘
     │
     │ close
     │
     ▼
┌──────────┐
│          │
│  CLOSED  │
│          │
└──────────┘
```

## State Definitions

### ACTIVE
**Meaning:** Session is currently being worked on
**Transitions:** Can pause or close
**Metadata:**
```json
{
  "status": "active",
  "created_at": "ISO8601",
  "last_resumed_at": "ISO8601" // optional
}
```

### PAUSED
**Meaning:** Session was active but work has stopped temporarily (chat ended, but may resume)
**Transitions:** Can resume (→ ACTIVE) or close (→ CLOSED)
**Metadata:**
```json
{
  "status": "paused",
  "created_at": "ISO8601",
  "paused_at": "ISO8601",
  "pause_reason": "chat ended" // optional context
}
```

### CLOSED
**Meaning:** Session is complete and archived (no further work expected)
**Transitions:** Terminal state (no transitions)
**Metadata:**
```json
{
  "status": "closed",
  "created_at": "ISO8601",
  "closed_at": "ISO8601",
  "closure_reason": "work complete" // optional
}
```

## State Transition Events

| Event | From State | To State | Trigger |
|-------|-----------|----------|---------|
| **create** | none | ACTIVE | New chat started, session auto-created |
| **pause** | ACTIVE | PAUSED | Chat ends without explicit closure |
| **resume** | PAUSED | ACTIVE | Chat continues in existing session |
| **close** | ACTIVE/PAUSED | CLOSED | Explicit session closeout ritual |

## Implementation Rules

1. **Auto-pause on chat end**: If chat ends and session is ACTIVE, transition to PAUSED
2. **Auto-resume on continuation**: If chat starts and session is PAUSED, transition to ACTIVE
3. **Never close automatically**: CLOSED state requires explicit human confirmation
4. **Timestamp all transitions**: Every state change records timestamp

## Historical Issue

**Problem:** Sessions marked as "closed" while work continued
**Root cause:** Missing PAUSED state - binary ACTIVE/CLOSED model couldn't represent "temporarily inactive"
**Solution:** Introduce PAUSED state as intermediate, default to PAUSED instead of CLOSED when chat ends

## Usage

### Check current state
```bash
jq -r '.status' sessions/$SESSION_ID/metadata.json
```

### Pause session
```bash
npx claude-flow@alpha hooks session-end --pause true
```

### Resume session
```bash
npx claude-flow@alpha hooks session-restore --session-id "$SESSION_ID"
```

### Close session (final)
```bash
npx claude-flow@alpha hooks session-end --close true --export-metrics true
```

## Validation

Session state is valid if:
- Status is one of: "active", "paused", "closed"
- Timestamps are ISO8601 format
- State transitions follow allowed paths
- Closed sessions cannot transition to other states
