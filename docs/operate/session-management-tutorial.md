# Session Management

Complete session lifecycle from initialization to HITL-approved closeout with backups and learning.

## The Complete Session Lifecycle

```
1. Session Start
   ↓
2. Agent Orchestration
   ↓
3. Memory Coordination
   ↓
4. Artifact Creation
   ↓
5. Session Closeout (HITL)
   ↓
6. Backup & Learning
```

Let's walk through each phase in detail.

## Phase 1: Session Start

### Manual Start (Recommended)

```
/session-start <topic>
```

**Example**:
```
/session-start auth-system-implementation
```

**Creates**:
```
sessions/session-20251117-143022-auth-system-implementation/
├── artifacts/
│   ├── code/
│   ├── tests/
│   ├── docs/
│   ├── scripts/
│   └── notes/
└── metadata.json
```

### Auto-Start (New Chat)

When you start a new chat, a session can auto-create:
- Session ID: `session-YYYYMMDD-HHMMSS-<inferred-topic>`
- Topic inferred from first user message

**Best practice**: Use explicit `/session-start` for clarity.

## Phase 2: Agent Orchestration

### Session-Aware Agent Spawning

**CRITICAL**: Always specify session path in agent instructions.

```javascript
[Single Message]:

Task("Backend Developer", `
  Build authentication API with JWT tokens.
  Save all code to: sessions/session-20251117-143022-auth-system/artifacts/code/
  Store API contract in memory: 'swarm/shared/api-contract'
`, "backend-dev")

Task("Test Engineer", `
  Write comprehensive auth tests.
  Save all tests to: sessions/session-20251117-143022-auth-system/artifacts/tests/
  Read API contract from memory: 'swarm/shared/api-contract'
`, "tester")

Task("Documentation Writer", `
  Create API documentation and integration guide.
  Save all docs to: sessions/session-20251117-143022-auth-system/artifacts/docs/
  Read API contract from memory.
`, "api-docs")
```

**Why specify paths**: Ensures artifacts go to correct session, prevents root directory pollution.

### Hooks Auto-Fire During Agent Work

Each agent automatically triggers hooks:

**Pre-Task Hook**:
```bash
npx claude-flow@alpha hooks pre-task \
  --description "Build authentication API" \
  --task-id "task-auth-api-001"
```

**Post-Edit Hook** (after each file write):
```bash
npx claude-flow@alpha hooks post-edit \
  --file "sessions/.../artifacts/code/auth.js" \
  --memory-key "swarm/coder/auth-api-complete"
```

**Post-Task Hook**:
```bash
npx claude-flow@alpha hooks post-task \
  --task-id "task-auth-api-001" \
  --status "completed"
```

**You don't invoke these manually** - they fire automatically during agent work.

## Phase 3: Memory Coordination

### Session-Scoped Memory

Store session-specific data:

```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "session/session-20251117-143022/coordination",
  value: JSON.stringify({
    agents_active: 3,
    phase: "implementation",
    progress: 65
  }),
  namespace: "coordination"
})
```

### Cross-Session Memory (Learning)

Store reusable patterns:

```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "pattern/auth-system/jwt-implementation",
  value: JSON.stringify({
    approach: "httpOnly cookies + refresh tokens",
    success_rate: 100,
    reusable: true
  }),
  namespace: "reasoning-bank"
})
```

## Phase 4: Artifact Creation

### File Routing Rules

**✅ CORRECT** (Session artifacts):
```
sessions/session-YYYYMMDD-HHMMSS-<topic>/artifacts/
├── code/
│   ├── auth.js
│   ├── middleware.js
│   └── config.js
├── tests/
│   ├── auth.test.js
│   └── integration.test.js
├── docs/
│   ├── API.md
│   └── integration-guide.md
├── scripts/
│   └── deploy.sh
└── notes/
    └── decisions.md
```

**❌ WRONG** (Root directory):
```
claude-code-sandbox/
├── auth.js          ← NO!
├── test.js          ← NO!
└── notes.md         ← NO!
```

### Artifact Organization

**Code**: Source files, configurations
```
artifacts/code/
├── src/
│   ├── auth/
│   ├── middleware/
│   └── utils/
└── config/
```

**Tests**: All test files
```
artifacts/tests/
├── unit/
├── integration/
└── e2e/
```

**Docs**: Documentation, guides, API references
```
artifacts/docs/
├── API.md
├── architecture.md
└── integration-guide.md
```

**Scripts**: Shell scripts, utilities, deployment
```
artifacts/scripts/
├── deploy.sh
├── test.sh
└── backup.sh
```

**Notes**: Planning, decisions, session notes
```
artifacts/notes/
├── architecture-decisions.md
├── technical-debt.md
└── lessons-learned.md
```

## Phase 5: Session Closeout (HITL)

### Initiate Closeout

```
/session-closeout
```

### Pre-Closeout Hook Fires

Automatically generates summary:

```bash
npx claude-flow@alpha hooks session-end --export-metrics true
```

**Creates**:
1. `session-summary.md` - What was accomplished
2. Metrics export - Agent performance, time tracking
3. Artifact inventory - All files created

### HITL Approval Workflow

Claude presents summary:

```markdown
## Session Summary: auth-system-implementation

**Duration**: 45 minutes
**Agents spawned**: 3 (backend-dev, tester, api-docs)

**Artifacts created**:
- code/auth.js (authentication logic)
- code/middleware.js (auth middleware)
- tests/auth.test.js (100% coverage)
- tests/integration.test.js (E2E tests)
- docs/API.md (API documentation)
- docs/integration-guide.md (integration guide)

**Memory entries**: 12
- API contracts
- Test results
- Learned patterns (stored in reasoning-bank)

**Recommendation**: Archive to .swarm/backups/

**Quality checks**:
✅ All tests passing (100% coverage)
✅ Documentation complete
✅ No security issues found

---

Approve closeout? (yes/no)
```

### User Approves

```
yes
```

### Post-Closeout Processing

**1. Create backup**:
```
.swarm/backups/session-20251117-143022-auth-system-implementation.json
```

**Backup contains**:
- All metadata
- Artifact inventory
- Memory snapshot
- Metrics and timings
- Learned patterns

**2. Update session status**:
```json
// metadata.json
{
  "status": "closed",
  "closed_at": "2025-11-17T14:45:30.000Z",
  "backup_location": ".swarm/backups/session-20251117-143022-..."
}
```

**3. Store learned patterns** (ReasoningBank):
```javascript
// Auto-stores successful patterns
"reasoning-bank/pattern/auth-system/jwt-tokens"
"reasoning-bank/trajectory/session-20251117-143022/decisions"
```

**4. Clean coordination memory**:
- Session-specific memory cleaned
- Shared patterns preserved
- Cross-session learning retained

## Phase 6: Backup & Learning

### Backup Structure

```json
{
  "session_id": "session-20251117-143022-auth-system-implementation",
  "created_at": "2025-11-17T14:30:22.000Z",
  "closed_at": "2025-11-17T14:45:30.000Z",
  "duration_minutes": 15,
  "topic": "auth-system-implementation",

  "agents": [
    {
      "type": "backend-dev",
      "task": "Build authentication API",
      "status": "completed",
      "duration_minutes": 10
    },
    {
      "type": "tester",
      "task": "Write auth tests",
      "status": "completed",
      "duration_minutes": 8
    },
    {
      "type": "api-docs",
      "task": "Create documentation",
      "status": "completed",
      "duration_minutes": 5
    }
  ],

  "artifacts": {
    "code": ["auth.js", "middleware.js"],
    "tests": ["auth.test.js", "integration.test.js"],
    "docs": ["API.md", "integration-guide.md"]
  },

  "memory_snapshot": {
    "coordination": [...],
    "reasoning-bank": [...]
  },

  "metrics": {
    "test_coverage": 100,
    "files_created": 6,
    "memory_entries": 12,
    "agents_spawned": 3
  },

  "learned_patterns": [
    {
      "pattern_id": "auth-jwt-httponly-cookies",
      "success_rate": 100,
      "reusable": true
    }
  ]
}
```

### ReasoningBank Learning

Patterns stored for future sessions:

```javascript
// Pattern learned from this session
{
  "pattern_id": "auth-jwt-implementation",
  "approach": "JWT with httpOnly cookies and refresh tokens",
  "implementation": {
    "access_token_ttl": "15min",
    "refresh_token_ttl": "7days",
    "cookie_settings": {
      "httpOnly": true,
      "secure": true,
      "sameSite": "strict"
    }
  },
  "success_metrics": {
    "sessions_used": 5,
    "success_rate": 100,
    "test_coverage_avg": 98
  },
  "code_snippets": {...},
  "lessons_learned": [
    "Use short access token TTL for security",
    "Store refresh tokens in database for revocation",
    "Implement token rotation on refresh"
  ]
}
```

**Next session**: Agents can retrieve and apply this pattern automatically.

## Session Lifecycle Best Practices

### 1. Start Clean

```
/session-start <clear-descriptive-topic>
```

Use descriptive topics: `auth-system-implementation`, not `work` or `stuff`.

### 2. Spawn Session-Aware

Always specify session path:
```
"Save to sessions/session-YYYYMMDD-HHMMSS-<topic>/artifacts/code/"
```

### 3. Coordinate Through Memory

Use session-scoped keys:
```
"session/session-YYYYMMDD-HHMMSS/phase"
"session/session-YYYYMMDD-HHMMSS/progress"
```

### 4. Close Properly

```
/session-closeout
```

Review summary, approve, ensure backup created.

### 5. Learn and Iterate

Check learned patterns:
```javascript
mcp__claude_flow_alpha__memory_search({
  pattern: "pattern/%",
  namespace: "reasoning-bank"
})
```

Apply successful patterns in future sessions.

## Multi-Session Projects

For large projects spanning multiple sessions:

### Session 1: Planning
```
/session-start project-alpha-planning
// Architecture, requirements, design
/session-closeout
```

### Session 2: Core Implementation
```
/session-start project-alpha-core-impl
// Reference Session 1 artifacts and learned patterns
// Implement core features
/session-closeout
```

### Session 3: Testing & Refinement
```
/session-start project-alpha-testing
// Reference Session 2 implementation
// Comprehensive testing, bug fixes
/session-closeout
```

### Cross-Session Coordination

```javascript
// Session 2 references Session 1
const planningArtifacts = "sessions/session-20251117-120000-project-alpha-planning/artifacts/docs/architecture.md"

// Read prior session artifacts
Task("Backend Dev", `
  Read architecture from: ${planningArtifacts}
  Implement based on approved design
  Save to current session artifacts
`, "backend-dev")

// Or use memory patterns
const architecturePattern = await memory.retrieve(
  "pattern/project-alpha/architecture",
  "reasoning-bank"
)
```

## You'll Know You Understand When...

✅ You start sessions with clear topics
✅ All agents save to correct session directories
✅ You close sessions with HITL approval
✅ Backups are created automatically
✅ Learned patterns stored in ReasoningBank
✅ You can reference prior sessions in new work

## Try This Exercise

**Complete session lifecycle practice**:

1. Start session: `/session-start calculator-app`
2. Spawn 4 agents (implementation, testing, docs, review)
3. Ensure all artifacts in session directories
4. Store coordination data in memory
5. Close session: `/session-closeout`
6. Verify backup created in `.swarm/backups/`
7. Check learned patterns in memory

**Success criteria**:
- Session summary shows all agents and artifacts
- Backup JSON contains complete snapshot
- Learned patterns stored in reasoning-bank
- Session directory clean and organized

## Phase 2: Essential Skills Complete!

You've now mastered:
✅ Spawning agents with Task tool
✅ Parallel execution patterns
✅ Advanced memory coordination
✅ Complete session lifecycle management

**You're ready for coordination topics**: Continue with [Swarm Coordination](../coordinate/swarm-coordination.md) to learn multi-agent orchestration patterns.

---

**Phase 2: Essential Skills Checkpoint**: Can you build a complete feature (backend + frontend + tests + docs) in a single session with proper coordination and closeout? If yes, you're ready for Phase 3: Intermediate (Intermediate).
