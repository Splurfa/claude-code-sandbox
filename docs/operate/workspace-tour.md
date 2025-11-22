# Workspace Tour

Welcome to your workspace! Let's walk through what everything is and where things live.

## The Big Picture

Your workspace has two types of sessions:
1. **Chat sessions** (where work happens) → `sessions/session-*/`
2. **Coordination sessions** (agent swarms) → `.swarm/sessions/swarm-*/`

Don't worry about the difference yet. Just know both exist.

## Root Directory Structure

```
claude-code-sandbox/           ← You are here
├── sessions/                    ← Chat session artifacts
├── .swarm/                      ← Coordination memory & backups
├── .claude/                     ← Agent configs & hooks
├── docs/                        ← Main documentation
├── CLAUDE.md                    ← Workspace instructions
├── WORKSPACE-GUIDE.md           ← Deep dive guide
└── package.json                 ← Node.js configuration
```

## Sessions Directory (Where Your Work Lives)

Every time you start a session with `/session-start <topic>`, a new folder is created:

```
sessions/
├── session-20251117-100232-docs-refactor-tutor/    ← Active session
│   ├── artifacts/
│   │   ├── code/              ← Generated code
│   │   ├── tests/             ← Generated tests
│   │   ├── docs/              ← Generated documentation
│   │   ├── scripts/           ← Generated scripts
│   │   └── notes/             ← Session notes
│   ├── metadata.json          ← Session tracking
│   └── session-summary.md     ← What happened
├── session-20251115-162200-hive-mind-integration/
└── session-20251113-164700-session-management/
```

### Session Naming Convention

**Format**: `session-YYYYMMDD-HHMMSS-<topic>`

Example: `session-20251117-100232-docs-refactor-tutor`
- **20251117**: November 17, 2025
- **100232**: 10:02:32 AM
- **docs-refactor-tutor**: The topic (your choice)

**Why timestamps?** Sessions are chronologically organized and globally unique.

## The .swarm Directory (Coordination Brain)

This is where agents coordinate and learn:

```
.swarm/
├── memory.db                  ← Shared memory database (SQLite)
├── sessions/                  ← Coordination session tracking
│   └── swarm-*/              ← Multi-agent swarm sessions
├── backups/                   ← Auto-generated backups
│   └── session-*.json        ← Session snapshots
└── reasoning-bank/            ← Learning patterns (custom extension)
    └── trajectories/          ← Past decision paths
```

### Memory Database (memory.db)

This SQLite database stores everything agents share:

**Example memory entries**:
```sql
-- Research findings
key: "swarm/researcher/api-patterns"
value: "REST conventions: use plural nouns, version APIs..."

-- Coordination status
key: "swarm/coordination/status"
value: "3 agents active, 2 tasks pending"

-- API contracts
key: "swarm/shared/api-contract"
value: "POST /login { email, password } → { token, user }"
```

**Namespaces organize memory**:
- `default`: General purpose
- `coordination`: Swarm coordination
- `reasoning-bank`: Learning patterns (custom)
- `captains-log`: Journal entries (custom)

Don't worry about namespaces yet. You'll learn them in Phase 2: Essential Skills.

## The .claude Directory (Agent Configuration)

```
.claude/
├── agents/                    ← Agent type definitions
│   ├── researcher.md         ← Research specialist config
│   ├── coder.md              ← Coder specialist config
│   ├── tester.md             ← Test specialist config
│   └── ...                   ← 54 total agent types
├── commands/                  ← Slash commands
│   ├── session-start.md
│   └── session-closeout.md
└── hooks/                     ← Auto-fire coordination
    └── auto-hooks.js         ← Hook execution wrapper
```

### Available Agent Types (54 Total)

**Core Development**:
- `researcher` - Deep analysis and pattern recognition
- `coder` - Implementation specialist
- `tester` - Comprehensive test coverage
- `reviewer` - Quality assurance
- `planner` - Task decomposition

**Specialized**:
- `backend-dev` - Server-side development
- `system-architect` - Architecture design
- `api-docs` - API documentation
- `cicd-engineer` - DevOps and pipelines
- ...and 45 more

You'll explore these as you progress.

## Documentation Structure

```
docs/
├── guides/                    ← How-to guides
│   ├── integration-testing-guide.md
│   ├── troubleshooting-guide.md
│   └── feature-verification-checklist.md
├── reference/                 ← Technical reference
│   ├── api/
│   └── architecture/
└── ...                        ← (You're creating learning/ now)
```

## Key Files to Know

### CLAUDE.md (Workspace Instructions)

This file tells Claude Code how to work in this workspace:
- Session management rules
- File routing protocols
- Agent coordination patterns
- Custom extensions documentation

**Think of it as**: The employee handbook for AI agents.

### WORKSPACE-GUIDE.md (Deep Dive)

Comprehensive guide covering:
- Session management protocol
- File routing system
- Captain's Log usage
- ReasoningBank learning
- Git checkpoint system

**Think of it as**: The technical manual.

### WORKSPACE-ARCHITECTURE.md (System Design)

Architecture overview:
- Stock vs custom comparison
- Compliance analysis
- Integration points
- Design decisions

**Think of it as**: The blueprint.

## Where Things Get Saved

**CRITICAL RULE**: Never save to root directories. Always save to session artifacts.

### ✅ Correct File Routing

```
sessions/session-YYYYMMDD-HHMMSS-<topic>/artifacts/
├── code/         ← Source code
├── tests/        ← Test files
├── docs/         ← Documentation
├── scripts/      ← Shell scripts, utilities
└── notes/        ← Session notes, planning
```

### ❌ Wrong (Don't Do This)

```
claude-code-sandbox/
├── test.js       ← NO! Goes to sessions/.../artifacts/tests/
├── notes.md      ← NO! Goes to sessions/.../artifacts/notes/
└── script.sh     ← NO! Goes to sessions/.../artifacts/scripts/
```

**Why?** Sessions are isolated. When you close a session, artifacts get archived to `.swarm/backups/` but don't pollute the root directory.

## Hidden Files (.gitignore, .env, etc.)

```
.env                  ← Environment variables (API keys, secrets)
.gitignore           ← Files Git should ignore
node_modules/        ← NPM dependencies (ignored by Git)
```

**You won't edit these often**, but know they exist.

## Package.json (Project Configuration)

```json
{
  "name": "claude-code-sandbox",
  "dependencies": {
    "claude-flow": "^2.0.0",
    ...
  },
  "scripts": {
    "test": "jest",
    "build": "tsc",
    ...
  }
}
```

Defines project dependencies and commands. Managed by NPM.

## Real Example: Following a Session's Trail

Let's trace an actual session from this workspace:

**Session**: `session-20251115-162200-hive-mind-integration`

**What was created**:
```
sessions/session-20251115-162200-hive-mind-integration/
├── artifacts/
│   ├── code/
│   │   └── hive-mind-integration.js      ← Implementation
│   ├── tests/
│   │   └── hive-mind-integration.test.js ← Tests
│   └── docs/
│       ├── integration-guide.md          ← User guide
│       └── api-reference.md              ← API docs
├── metadata.json
└── session-summary.md
```

**What was stored in memory**:
```sql
-- Coordination status
"swarm/hive-mind/integration-status" = "complete"

-- Test results
"swarm/hive-mind/test-results" = "100% pass rate"

-- Learned patterns (ReasoningBank)
"reasoning-bank/pattern/byzantine-consensus" = "trajectory data..."
```

**What was backed up**:
```
.swarm/backups/session-20251115-162200-hive-mind-integration.json
```

## Navigation Tips

### Finding Recent Sessions
```bash
ls -lt sessions/ | head -5
```

Shows the 5 most recent sessions.

### Searching Memory
```javascript
mcp__claude_flow_alpha__memory_search({
  pattern: "swarm/hive-mind/%",
  namespace: "coordination"
})
```

Finds all hive-mind coordination entries.

### Viewing Session Summary
```bash
cat sessions/session-YYYYMMDD-HHMMSS-topic/session-summary.md
```

## You'll Know You Understand When...

✅ You can navigate to the current session's artifacts folder
✅ You know where memory.db lives
✅ You understand why files go to `sessions/*/artifacts/` not root
✅ You can list available agent types in `.claude/agents/`

## Try This Exercise

**Answer these questions** (don't peek at the answers first):

1. Where would you save a test file for a session called `session-20251117-120000-login-system`?
2. Where is the shared memory database stored?
3. How many agent types are available in `.claude/agents/`?
4. What file tells Claude Code how to work in this workspace?

**Answers**:
<details>
<summary>Click to reveal</summary>

1. `sessions/session-20251117-120000-login-system/artifacts/tests/<filename>.test.js`
2. `.swarm/memory.db`
3. 54 agent types
4. `CLAUDE.md` (with deep dive in `WORKSPACE-GUIDE.md`)

</details>

## Next Step

Now that you know where everything lives, let's create your first session.

→ **Next**: [Your First Session](first-session.md)

---

**Pro tip**: Bookmark this page. You'll reference it often in Phase 1: Foundations.
