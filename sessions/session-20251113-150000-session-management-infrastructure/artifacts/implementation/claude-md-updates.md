# CLAUDE.md Updates for TSCP Implementation

**Version:** 1.0.0
**Purpose:** Specific text additions/modifications for CLAUDE.md
**Status:** Ready to merge

---

## UPDATE 1: Add New Section After "Agent Coordination Protocol"

**Location:** After line "## 📋 Agent Coordination Protocol"

**Insert:**

```markdown
## 🔍 Transparent Swarm Protocol (TSCP)

### Overview

ALL swarm coordination automatically follows the Transparent Swarm Protocol (TSCP) to ensure visibility into agent work. TSCP has three phases: Planning (user reviews plan before execution), Execution (real-time notifications), and Closeout (HITL summary review).

### Phase 1: Planning (BLOCKING - User Approval Required)

**BEFORE spawning ANY agents, Claude Code MUST:**

1. **Generate execution plan document:**
   ```bash
   sessions/<session-id>/artifacts/execution-plan.md
   ```

   **Plan Structure:**
   - Mission Statement (what we're building)
   - Success Criteria (how we know we're done)
   - Agent Roster (who's doing what - type, role, capabilities)
   - Execution Strategy (parallel/sequential/adaptive)
   - Work Breakdown (detailed todo list, 8-12+ items)
   - Artifact Inventory (expected outputs with paths)
   - Risk Assessment (potential blockers and mitigations)
   - Estimated Timeline (rough completion expectations)

2. **Present plan with comprehensive TodoWrite:**
   ```javascript
   TodoWrite({
     todos: [
       {
         id: "plan-approval",
         content: "User reviews and approves execution plan",
         activeForm: "Awaiting user approval for execution plan",
         status: "in_progress",
         priority: "critical"
       },
       // ... 8-12+ todos covering ALL planned work
     ]
   })
   ```

3. **Explicitly request approval:**
   ```
   I've created the execution plan at:
   `sessions/<session-id>/artifacts/execution-plan.md`

   This plan includes [N] agents working across [M] phases:
   [TodoWrite display]

   Please review the plan. Type "approved" to begin execution.
   ```

4. **WAIT for explicit user approval** before proceeding
   - Accepted approval phrases: "approved", "yes", "go", "proceed", "start"
   - If user requests changes, refine plan and re-present
   - Do NOT spawn agents until approval received

**Opt-Out:** User can skip planning approval by saying "skip TSCP approval" or "skip planning phase"

### Phase 2: Execution (Automatic Notifications)

**During agent work, automatically provide:**

1. **Document Creation Notifications:**
   ```
   📄 Document Created: `sessions/<session-id>/artifacts/<category>/<file>.md`
      Agent: <agent-name>
      Phase: <phase-name>
      Status: <draft/complete/review-ready>
   ```

2. **Real-Time Progress Updates:**
   - TodoWrite automatically updates as agents complete tasks
   - Mark todos: ✅ completed, 🔄 in_progress, ⏳ pending
   - Include progress notes for in-progress items

3. **Phase Completion Reports:**
   ```
   ✅ Phase Complete: <phase-name>

   Artifacts Created:
   - `sessions/<session-id>/artifacts/specifications/api-design.md`
   - `sessions/<session-id>/artifacts/diagrams/architecture.md`

   Next Phase: <next-phase-name> ([N] agents spawning)
   ```

**Notification Triggers:**
- Agent creates/modifies any file in artifacts directory
- Agent completes a todo item
- Major phase completes (all phase todos done)

### Phase 3: Closeout (HITL Review)

**After execution completes:**

1. **Present session summary:**
   ```
   Session summary ready for review:
   sessions/<session-id>/artifacts/session-summary.md

   Summary includes:
   - All artifacts created ([N] files)
   - Todos completed ([M] of [M])
   - Key decisions and rationale
   - Lessons learned

   Review summary and approve for archival.
   ```

2. **WAIT for user approval:**
   - User reviews summary and either approves or requests changes
   - If approved, proceed to archive
   - If changes needed, refine summary and re-present

3. **Archive after approval:**
   ```bash
   npx claude-flow@alpha hooks post-task --task-id "swarm-<session-id>"
   npx claude-flow@alpha hooks session-end --export-metrics true
   ```

### TSCP Integration with Agent Spawning

**Every agent spawned via Task tool MUST include TSCP instructions:**

```markdown
## Transparent Swarm Protocol Requirements

You are part of a transparent swarm following TSCP. You MUST:

1. **Before starting work:**
   - Read execution plan: `sessions/<session-id>/artifacts/execution-plan.md`
   - Understand your role, success criteria, and which todos you own

2. **During work:**
   - Create ALL artifacts in: `sessions/<session-id>/artifacts/<category>/`
   - After creating/modifying files, run notification hook:
     ```bash
     npx claude-flow@alpha hooks post-edit \
       --file "<path>" \
       --memory-key "swarm/<agent-id>/<step>" \
       --description "Created <artifact> for <phase>"
     ```

3. **After completing tasks:**
   - Update progress in session summary
   - Mark your todos complete
   - Run completion hook:
     ```bash
     npx claude-flow@alpha hooks post-task \
       --task-id "<your-task-id>" \
       --status "complete"
     ```

4. **Document everything:**
   - Write clear, reviewable artifacts
   - Explain decisions in docs/comments
   - Link related work in memory
```

### TSCP Enforcement Rules

- **Planning phase is BLOCKING** - No agents spawn without approval
- **Notifications are AUTOMATIC** - Cannot be disabled (can be muted with `--quiet`)
- **Closeout is MANDATORY** - Session doesn't archive until user reviews
- **All swarm operations use TSCP by default** - No opt-in required

### Verbosity Scaling

TSCP automatically adjusts notification detail based on swarm size:

- **Small swarms (2-3 agents):** Full verbosity, all notifications
- **Medium swarms (4-8 agents):** Grouped notifications by phase
- **Large swarms (9+ agents):** Summary notifications, detailed log available

User can override: `--tscp-verbosity=<full|medium|summary>`
```

---

## UPDATE 2: Modify "Agent Execution Flow with Claude Code" Section

**Location:** Find section "## 🚀 Agent Execution Flow with Claude Code"

**Replace "The Correct Pattern:" subsection with:**

```markdown
### The Correct Pattern with TSCP:

1. **REQUIRED (TSCP Phase 1)**: Generate execution plan and get user approval (BLOCKING)
2. **Optional**: Use MCP tools to set up coordination topology
3. **REQUIRED (TSCP Phase 2)**: Use Claude Code's Task tool to spawn agents with TSCP instructions
4. **AUTOMATIC (TSCP Phase 2)**: Agents run hooks for coordination and notifications
5. **REQUIRED**: All operations batched in single messages
6. **REQUIRED (TSCP Phase 3)**: User reviews summary after execution (HITL)
```

---

## UPDATE 3: Replace "Example Full-Stack Development" with TSCP Version

**Location:** Find "### Example Full-Stack Development:"

**Replace entire example with:**

```markdown
### Example Full-Stack Development (TSCP-Compliant):

**Step 0: TSCP Planning Phase (BLOCKING)**
```javascript
[Single Message - Generate Plan & Present]:
  // Generate comprehensive execution plan
  Write "sessions/20251113-120000-fullstack-app/artifacts/execution-plan.md" {
    content: `
      # Execution Plan: Full-Stack Web Application

      ## Mission Statement
      Build a production-ready full-stack web application with React frontend,
      Express backend, PostgreSQL database, and Docker deployment.

      ## Success Criteria
      - Frontend: Responsive UI with 3 core pages
      - Backend: REST API with authentication
      - Database: Normalized schema with migrations
      - Tests: 90%+ coverage across all layers
      - Deployment: Docker compose with CI/CD pipeline

      ## Agent Roster
      1. Backend Developer (Express API, auth)
      2. Frontend Developer (React UI, state management)
      3. Database Architect (PostgreSQL schema, migrations)
      4. Test Engineer (Jest tests, integration tests)
      5. DevOps Engineer (Docker, CI/CD)
      6. Security Auditor (Auth review, vulnerability scan)

      ## Execution Strategy
      - Phase 1: Architecture (Sequential - Backend/DB/Frontend design)
      - Phase 2: Implementation (Parallel - All agents work concurrently)
      - Phase 3: Integration (Sequential - Connect components, deploy)

      ## Work Breakdown
      [See TodoWrite below for detailed tasks]

      ## Artifact Inventory
      - Backend: server.js, auth.js, routes/, middleware/
      - Frontend: App.jsx, components/, services/
      - Database: schema.sql, migrations/
      - Tests: *.test.js (8 test files)
      - Deployment: Dockerfile, docker-compose.yml, .github/workflows/
      - Docs: API.md, ARCHITECTURE.md, SETUP.md

      ## Risk Assessment
      - Risk: Database schema conflicts → Mitigation: DB architect leads, others follow
      - Risk: Frontend/backend API mismatch → Mitigation: API contract defined first
      - Risk: Docker networking issues → Mitigation: DevOps validates locally first

      ## Estimated Timeline
      - Phase 1: ~10 minutes (architecture)
      - Phase 2: ~30 minutes (parallel implementation)
      - Phase 3: ~10 minutes (integration)
      - Total: ~50 minutes
    `
  }

  // Present plan with comprehensive todos
  TodoWrite({
    todos: [
      {
        id: "plan-approval",
        content: "User reviews and approves execution plan",
        activeForm: "Awaiting user approval for execution plan",
        status: "in_progress",
        priority: "critical"
      },
      {
        id: "arch-backend",
        content: "Backend Developer designs API architecture and endpoints",
        activeForm: "Backend Developer designing API architecture",
        status: "pending",
        priority: "high"
      },
      {
        id: "arch-database",
        content: "Database Architect designs schema and relationships",
        activeForm: "Database Architect designing schema",
        status: "pending",
        priority: "high"
      },
      {
        id: "arch-frontend",
        content: "Frontend Developer designs component architecture",
        activeForm: "Frontend Developer designing components",
        status: "pending",
        priority: "high"
      },
      {
        id: "impl-backend",
        content: "Backend Developer implements Express server and auth",
        activeForm: "Backend Developer implementing server",
        status: "pending",
        priority: "high"
      },
      {
        id: "impl-frontend",
        content: "Frontend Developer implements React UI",
        activeForm: "Frontend Developer implementing UI",
        status: "pending",
        priority: "high"
      },
      {
        id: "impl-database",
        content: "Database Architect implements schema and migrations",
        activeForm: "Database Architect implementing schema",
        status: "pending",
        priority: "high"
      },
      {
        id: "test-unit",
        content: "Test Engineer writes unit tests for all components",
        activeForm: "Test Engineer writing unit tests",
        status: "pending",
        priority: "medium"
      },
      {
        id: "test-integration",
        content: "Test Engineer writes integration tests",
        activeForm: "Test Engineer writing integration tests",
        status: "pending",
        priority: "medium"
      },
      {
        id: "deploy-docker",
        content: "DevOps Engineer creates Docker configuration",
        activeForm: "DevOps Engineer creating Docker config",
        status: "pending",
        priority: "medium"
      },
      {
        id: "deploy-cicd",
        content: "DevOps Engineer sets up CI/CD pipeline",
        activeForm: "DevOps Engineer setting up CI/CD",
        status: "pending",
        priority: "medium"
      },
      {
        id: "security-audit",
        content: "Security Auditor reviews authentication and vulnerabilities",
        activeForm: "Security Auditor reviewing security",
        status: "pending",
        priority: "high"
      }
    ]
  })

  // Explicit approval request
  "I've created the execution plan at:
   `sessions/20251113-120000-fullstack-app/artifacts/execution-plan.md`

   This plan includes 6 agents working across 3 phases with 12 tasks.

   Please review the plan. Type 'approved' to begin execution."
```

**[USER TYPES: "approved"]**

**Step 1: Optional MCP Coordination Setup**
```javascript
[Single Message - Coordination Topology]:
  mcp__claude-flow__swarm_init {
    topology: "mesh",
    maxAgents: 6,
    strategy: "adaptive"
  }
```

**Step 2: Spawn Agents with TSCP Instructions**
```javascript
[Single Message - Parallel Agent Execution]:
  // Update plan approval todo
  TodoWrite({
    todos: [{ id: "plan-approval", status: "completed" }]
  })

  // Spawn all agents concurrently via Claude Code's Task tool
  Task("Backend Developer", `
    You are the Backend Developer for a full-stack app.

    ## Transparent Swarm Protocol Requirements
    Read execution plan: sessions/20251113-120000-fullstack-app/artifacts/execution-plan.md
    Your todos: arch-backend, impl-backend
    Create artifacts in: sessions/20251113-120000-fullstack-app/artifacts/backend/

    After creating files, run:
    npx claude-flow@alpha hooks post-edit --file "<path>" --memory-key "swarm/backend-dev/api"

    ## Your Tasks
    1. Design REST API architecture (endpoints, auth, middleware)
    2. Implement Express server with JWT authentication
    3. Document API in artifacts/docs/API.md
    4. Coordinate with DB architect via memory for schema
  `, "backend-dev")

  Task("Frontend Developer", `
    You are the Frontend Developer for a full-stack app.

    ## Transparent Swarm Protocol Requirements
    Read execution plan: sessions/20251113-120000-fullstack-app/artifacts/execution-plan.md
    Your todos: arch-frontend, impl-frontend
    Create artifacts in: sessions/20251113-120000-fullstack-app/artifacts/frontend/

    After creating files, run:
    npx claude-flow@alpha hooks post-edit --file "<path>" --memory-key "swarm/frontend-dev/ui"

    ## Your Tasks
    1. Design React component architecture
    2. Implement responsive UI with state management
    3. Integrate with backend API (check memory for endpoints)
    4. Document components in artifacts/docs/COMPONENTS.md
  `, "coder")

  Task("Database Architect", `
    You are the Database Architect for a full-stack app.

    ## Transparent Swarm Protocol Requirements
    Read execution plan: sessions/20251113-120000-fullstack-app/artifacts/execution-plan.md
    Your todos: arch-database, impl-database
    Create artifacts in: sessions/20251113-120000-fullstack-app/artifacts/database/

    After creating files, run:
    npx claude-flow@alpha hooks post-edit --file "<path>" --memory-key "swarm/db-architect/schema"

    ## Your Tasks
    1. Design normalized PostgreSQL schema
    2. Create migration scripts
    3. Store schema in memory for backend to reference
    4. Document data model in artifacts/docs/DATA-MODEL.md
  `, "code-analyzer")

  Task("Test Engineer", `
    You are the Test Engineer for a full-stack app.

    ## Transparent Swarm Protocol Requirements
    Read execution plan: sessions/20251113-120000-fullstack-app/artifacts/execution-plan.md
    Your todos: test-unit, test-integration
    Create artifacts in: sessions/20251113-120000-fullstack-app/artifacts/tests/

    After creating files, run:
    npx claude-flow@alpha hooks post-edit --file "<path>" --memory-key "swarm/test-engineer/tests"

    ## Your Tasks
    1. Write Jest unit tests for all components (90%+ coverage)
    2. Write integration tests for API + DB
    3. Check memory for API contracts and component interfaces
    4. Document test strategy in artifacts/docs/TESTING.md
  `, "tester")

  Task("DevOps Engineer", `
    You are the DevOps Engineer for a full-stack app.

    ## Transparent Swarm Protocol Requirements
    Read execution plan: sessions/20251113-120000-fullstack-app/artifacts/execution-plan.md
    Your todos: deploy-docker, deploy-cicd
    Create artifacts in: sessions/20251113-120000-fullstack-app/artifacts/deployment/

    After creating files, run:
    npx claude-flow@alpha hooks post-edit --file "<path>" --memory-key "swarm/devops/deploy"

    ## Your Tasks
    1. Create Dockerfile and docker-compose.yml
    2. Setup GitHub Actions CI/CD pipeline
    3. Document deployment in artifacts/docs/DEPLOYMENT.md
  `, "cicd-engineer")

  Task("Security Auditor", `
    You are the Security Auditor for a full-stack app.

    ## Transparent Swarm Protocol Requirements
    Read execution plan: sessions/20251113-120000-fullstack-app/artifacts/execution-plan.md
    Your todos: security-audit
    Create artifacts in: sessions/20251113-120000-fullstack-app/artifacts/security/

    After creating files, run:
    npx claude-flow@alpha hooks post-edit --file "<path>" --memory-key "swarm/security/audit"

    ## Your Tasks
    1. Review authentication implementation
    2. Scan for common vulnerabilities (OWASP Top 10)
    3. Document findings and recommendations in artifacts/security/AUDIT-REPORT.md
  `, "reviewer")
```

**[Agents work, automatic notifications appear]**
```
📄 Document Created: `sessions/.../artifacts/backend/api-design.md`
   Agent: Backend Developer
   Phase: Architecture Design
   Status: Draft complete, ready for review

📄 Document Created: `sessions/.../artifacts/database/schema.sql`
   Agent: Database Architect
   Phase: Database Design
   Status: Schema complete, migrations pending

[TodoWrite updates automatically]
✅ arch-backend (completed)
✅ arch-database (completed)
🔄 arch-frontend (in progress)
⏳ impl-backend (pending)
...

✅ Phase Complete: Architecture Design

Artifacts Created:
- backend/api-design.md (Backend Developer)
- database/schema.sql (Database Architect)
- frontend/component-architecture.md (Frontend Developer)

Next Phase: Implementation (6 agents continuing work)
```

**Step 3: TSCP Closeout**
```javascript
[Single Message - Present Summary]:
  Read "sessions/20251113-120000-fullstack-app/artifacts/session-summary.md"

  "Session summary ready for review:
   sessions/20251113-120000-fullstack-app/artifacts/session-summary.md

   Summary includes:
   - 18 artifacts created (backend, frontend, database, tests, deployment, docs)
   - All 12 todos completed ✅
   - All tests passing (94% coverage)
   - Security audit: 2 minor findings addressed
   - Key decisions documented in architecture docs

   Review summary and approve for archival."
```

**[USER APPROVES]**

```bash
npx claude-flow@alpha hooks post-task --task-id "swarm-fullstack-20251113"
npx claude-flow@alpha hooks session-end --export-metrics true
```

**Result:** Complete full-stack application with transparent development process, user visibility at every stage, and comprehensive archival for future reference.
```

---

## UPDATE 4: Add TSCP Note to Concurrent Execution Golden Rule

**Location:** Find "### ⚡ GOLDEN RULE: '1 MESSAGE = ALL RELATED OPERATIONS'"

**Add after the rule:**

```markdown
**TSCP Exception:** The planning phase approval is BLOCKING and requires a separate user message. However, all other operations (agent spawning, file creation, todo updates) remain batched.

```

---

## UPDATE 5: Add TSCP to "When to Use TodoWrite" Section

**Location:** Find section about TodoWrite usage

**Add bullet:**

```markdown
- **TSCP Planning Phase** - When presenting execution plan for approval, TodoWrite MUST include all planned work (8-12+ todos) plus the approval todo as first item
```

---

## Summary of Changes

1. **New Section:** Complete TSCP protocol documentation (~150 lines)
2. **Modified Section:** Updated agent execution flow pattern
3. **Replaced Example:** TSCP-compliant full-stack development example
4. **Minor Additions:** TSCP notes in golden rule and TodoWrite sections

**Total Lines Added:** ~250
**Total Lines Modified:** ~30
**New Concepts:** TSCP phases, blocking approval, automatic notifications, HITL closeout

**Backward Compatibility:**
- Existing workflows still work (TSCP wraps existing hooks)
- Users can opt-out with `--skip-tscp-approval`
- No breaking changes to MCP tools or Claude Code functionality
