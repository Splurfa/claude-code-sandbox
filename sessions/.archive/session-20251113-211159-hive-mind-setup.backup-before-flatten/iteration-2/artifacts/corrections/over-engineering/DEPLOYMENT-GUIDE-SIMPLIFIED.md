# Simple Hive Mind Deployment Guide

## What You're Actually Doing

Adding ONE simple rule to CLAUDE.md that tells agents: **"Use the wizard for complex multi-agent work."**

**That's it.** No new systems. No architecture. No protocols.

---

## The Rule

Add this to CLAUDE.md:

```markdown
## Subagent Coordination

For substantive multi-agent work, use the hive mind wizard:

```bash
npx claude-flow@alpha hive-mind:wizard
```

The wizard will:
1. Ask what you're building
2. Spawn appropriate specialist agents
3. Coordinate their work automatically
4. Present consolidated results

**When to use wizard:**
- Complex features requiring multiple specialists (backend, frontend, testing, etc.)
- Architecture decisions needing multiple perspectives
- Large refactors involving coordination

**When NOT to use wizard:**
- Single-agent tasks (just do it yourself)
- Simple fixes or changes
- Reading/analyzing existing code
```

---

## That's The Whole Deployment

No scripts to install. No infrastructure to set up. Just use the existing wizard command when work requires coordination.

---

## How It Works (Already Built Into claude-flow)

**When you run the wizard:**

1. **Wizard prompts you:** "What are you building?"
2. **You describe the work:** "Build REST API with authentication"
3. **Wizard spawns agents:** Backend dev, database architect, security reviewer, tester
4. **Agents coordinate:** Via `.swarm/memory.db` (already exists)
5. **Results consolidate:** One summary of all agent work
6. **Files organized:** Everything goes to `sessions/$SESSION_ID/artifacts/`

**Tools already working:**
- `npx claude-flow@alpha hive-mind:wizard` - Interactive agent spawning ✅
- `.swarm/memory.db` - Agent coordination storage ✅
- Session artifacts - File organization ✅
- Hooks system - Pre/post task coordination ✅

---

## Usage Examples

**Example 1: Build Full-Stack Feature**

```bash
$ npx claude-flow@alpha hive-mind:wizard

What are you building?
> User authentication system with JWT tokens

[Wizard spawns agents]:
- Backend Developer (Express + JWT)
- Database Architect (User schema)
- Security Reviewer (Auth best practices)
- Test Engineer (Auth flow tests)

[Agents work in parallel, coordinating via memory]

[Results presented]:
✅ Backend API implemented
✅ Database schema created
✅ Security audit complete
✅ Tests passing (92% coverage)

Files saved to: sessions/session-20251113-220000-auth-system/artifacts/
```

**Example 2: Architecture Decision**

```bash
$ npx claude-flow@alpha hive-mind:wizard

What needs architecture review?
> Should we use GraphQL or REST for new API?

[Wizard spawns agents]:
- System Architect (Technical analysis)
- Performance Analyst (Benchmark comparison)
- Developer (Implementation complexity)

[Agents analyze and debate]

[Results presented]:
Recommendation: REST API
Reasoning: Simpler implementation, team familiarity, sufficient for current needs
Trade-offs documented in: sessions/.../artifacts/docs/API-DECISION.md
```

---

## What About Sessions, Logs, Backups?

**They already work.** No changes needed.

- **Sessions:** Auto-created when chat starts
- **Captain's log:** Write entries during work with `npx claude-flow@alpha hooks notify`
- **Backups:** Run `npx claude-flow@alpha hooks session-end` when done

The existing infrastructure handles everything. The wizard just makes spawning coordinated agents easier.

---

## Deployment Checklist

- [ ] Add subagent rule to CLAUDE.md (copy from "The Rule" section above)
- [ ] Test wizard: `npx claude-flow@alpha hive-mind:wizard`
- [ ] Done

**Time:** 2 minutes
**Complexity:** Trivial
**New code:** 0 lines
**New systems:** 0

---

## Why This Is NOT Over-Engineered

**What we're NOT doing:**
- ❌ Building new coordination protocols
- ❌ Creating custom databases
- ❌ Writing wrapper scripts
- ❌ Inventing frameworks
- ❌ Architecting systems

**What we ARE doing:**
- ✅ Using existing wizard command
- ✅ Adding one CLAUDE.md rule
- ✅ Leveraging stock infrastructure

**Complexity:** 10 lines of markdown
**Stock vs Custom:** 100% stock (wizard already exists)

---

## Troubleshooting

**Wizard command not found?**
```bash
npm install -g claude-flow@alpha
```

**Agents not coordinating?**
- Check `.swarm/memory.db` exists (auto-created)
- Hooks should run automatically (no action needed)

**Need to coordinate manually?**
- Don't overthink it
- Just spawn agents with Task tool
- They'll coordinate via memory automatically

---

## The Principle

**Use existing tools. Don't build new systems.**

claude-flow already has everything you need. The wizard is production-ready, battle-tested, and designed exactly for this use case. Adding it to CLAUDE.md just makes it official in your workflow.

**Before:** Agents spawn ad-hoc, coordination is manual
**After:** "Use wizard for complex work" rule makes coordination standard

That's the deployment.
