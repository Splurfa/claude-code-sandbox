# Claude Code Sandbox

A workspace built on **Three Principles** for AI-human collaboration:

1. **Time-neutral** - Work when you're ready, not on a schedule. All operations are on-demand CLI commands.
2. **Scale-agnostic** - Works identically with 10 items or 10,000. Start small, scale naturally.
3. **Stock-first** - 95% battle-tested claude-flow infrastructure, 5% thin workflow wrappers.

## What This Is

A structured workspace where:
- Every chat session auto-creates its own workspace under `sessions/`
- All work artifacts (code, tests, docs) stay organized by session
- Agent coordination happens through hooks and memory
- Learning accumulates across sessions without manual tagging

## Quick Start

**Starting a New Session** (automatic on first message):
1. Begin a new chat with your task
2. Session auto-initializes: `sessions/session-YYYYMMDD-HHMMSS-<topic>/`
3. All your work saves to: `sessions/<session-id>/artifacts/{code,tests,docs,scripts,notes}/`
4. Continue working - hooks handle coordination automatically

**Example First Message:**
```
"Let's build a REST API with authentication"
→ Auto-creates: sessions/session-20251114-120000-rest-api/
→ All code goes to: sessions/.../artifacts/code/
→ All tests go to: sessions/.../artifacts/tests/
```

**During Work:**
- Files auto-route to correct artifact directories
- Hooks maintain memory and coordination state
- Session summary tracks progress automatically

**Closing a Session:**
1. Say "done" or "close session"
2. Review auto-generated summary
3. Approve closeout - hooks archive everything to `.swarm/backups/`

## Core Infrastructure

- **`sessions/`** - All session workspaces and artifacts ([detailed guide](sessions/README.md))
- **`.swarm/`** - Memory, backups, coordination state ([infrastructure docs](.swarm/README.md))
- **`sessions/captains-log/`** - Human-readable journal of decisions and learnings

## Why These Principles Matter

**Time-neutral:** You work when inspired, not when scheduled. No cron jobs, no "daily" tasks. Everything is pull-based.

**Scale-agnostic:** Start with one session. Grow to hundreds. The system works identically. No rewrites, no limits.

**Stock-first:** We use claude-flow's proven infrastructure. When claude-flow improves, you get those improvements automatically. Minimal custom code means minimal maintenance.

## File Organization Rule

**ALL new files go to session artifacts, NEVER to root directories:**

✅ `sessions/<session-id>/artifacts/code/server.js`
❌ `code/server.js` or `server.js`

✅ `sessions/<session-id>/artifacts/tests/api.test.js`
❌ `tests/api.test.js`

See [sessions/README.md](sessions/README.md) for complete routing rules.

## Documentation

- [Session Management](sessions/README.md) - Lifecycle, artifacts, closeout
- [Infrastructure Storage](.swarm/README.md) - Memory, backups, coordination
- [CLAUDE.md](CLAUDE.md) - Full project configuration and agent protocols

## Support

Built on [claude-flow](https://github.com/ruvnet/claude-flow) infrastructure.
