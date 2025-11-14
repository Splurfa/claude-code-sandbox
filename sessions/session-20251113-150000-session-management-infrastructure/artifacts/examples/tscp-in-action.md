# TSCP In Action: Concrete Examples

**Version:** 1.0.0
**Purpose:** Show exactly what users and agents see during TSCP workflows

---

## Example 1: Simple API Development

### User Request
```
User: "Build a REST API for managing a todo list"
```

### Phase 1: Planning (User Sees This)

```
Claude Code:
I'll create an execution plan for the todo list API.

[Generating plan...]

📋 Execution Plan Created

Location: sessions/20251113-100000-todo-api/artifacts/execution-plan.md

═══════════════════════════════════════════════════════════
EXECUTION PLAN: TODO LIST REST API
═══════════════════════════════════════════════════════════

Mission: Build a production-ready REST API for todo list management
with CRUD operations, data persistence, and comprehensive testing.

Success Criteria:
✓ RESTful endpoints (GET, POST, PUT, DELETE)
✓ SQLite database with schema migrations
✓ Input validation and error handling
✓ 90%+ test coverage
✓ API documentation

Agent Roster:
1. Backend Developer - Express server, API routes, validation
2. Database Architect - SQLite schema, migrations, queries
3. Test Engineer - Jest tests, integration tests
4. API Documenter - OpenAPI spec, usage examples

Execution Strategy:
- Phase 1: Architecture (Sequential)
  └─ Database schema → API design → Test plan
- Phase 2: Implementation (Parallel)
  └─ All agents work concurrently
- Phase 3: Integration (Sequential)
  └─ Connect components → Run tests → Generate docs

Expected Artifacts: (10 files)
- src/server.js
- src/routes/todos.js
- src/middleware/validation.js
- database/schema.sql
- database/migrations/001-init.sql
- tests/todos.test.js
- tests/integration.test.js
- docs/API.md
- docs/SETUP.md
- package.json

Risk Assessment:
⚠ Database locking issues → Mitigation: Use WAL mode
⚠ API versioning confusion → Mitigation: Start with v1 prefix

Estimated Timeline: ~20 minutes
═══════════════════════════════════════════════════════════

[TodoWrite Display]
┌─────────────────────────────────────────────────────────┐
│ PLANNED WORK (10 tasks)                                 │
├─────────────────────────────────────────────────────────┤
│ 🔴 CRITICAL - Awaiting Approval                         │
│   • User reviews and approves execution plan            │
│                                                          │
│ 🟠 HIGH PRIORITY - Architecture Phase                   │
│   • Database Architect designs schema                   │
│   • Backend Developer designs API endpoints             │
│   • Test Engineer creates test strategy                 │
│                                                          │
│ 🟠 HIGH PRIORITY - Implementation Phase                 │
│   • Backend Developer implements server & routes        │
│   • Database Architect implements schema & migrations   │
│   • Test Engineer writes unit tests                     │
│   • Test Engineer writes integration tests              │
│                                                          │
│ 🟡 MEDIUM PRIORITY - Integration Phase                  │
│   • API Documenter generates OpenAPI spec               │
│   • API Documenter writes usage documentation           │
└─────────────────────────────────────────────────────────┘

Please review the execution plan at:
sessions/20251113-100000-todo-api/artifacts/execution-plan.md

Type 'approved' to begin execution, or request changes.
```

### User Approves
```
User: approved
```

### Phase 2: Execution (User Sees This)

```
Claude Code:
Starting execution with 4 agents...

[Spawning agents concurrently...]

┌─────────────────────────────────────────────────────────┐
│ AGENT STATUS                                            │
├─────────────────────────────────────────────────────────┤
│ ✅ Backend Developer - Ready                            │
│ ✅ Database Architect - Ready                           │
│ ✅ Test Engineer - Ready                                │
│ ✅ API Documenter - Ready                               │
└─────────────────────────────────────────────────────────┘

Phase 1: Architecture Design

🔄 Backend Developer: Designing API endpoints...
🔄 Database Architect: Designing schema...
🔄 Test Engineer: Creating test strategy...

[30 seconds later]

📄 Document Created
   Path: sessions/.../artifacts/database/schema.sql
   Agent: Database Architect
   Phase: Architecture Design
   Status: Complete ✓

   Schema includes:
   - todos table (id, title, description, completed, created_at)
   - Indexes on completed and created_at
   - SQLite-specific optimizations

📄 Document Created
   Path: sessions/.../artifacts/backend/api-endpoints.md
   Agent: Backend Developer
   Phase: Architecture Design
   Status: Complete ✓

   Endpoints:
   - GET    /api/v1/todos
   - POST   /api/v1/todos
   - GET    /api/v1/todos/:id
   - PUT    /api/v1/todos/:id
   - DELETE /api/v1/todos/:id

📄 Document Created
   Path: sessions/.../artifacts/tests/test-strategy.md
   Agent: Test Engineer
   Phase: Architecture Design
   Status: Complete ✓

   Coverage targets:
   - Unit tests: 95%+
   - Integration tests: All endpoints
   - Edge cases: 10+ scenarios

[TodoWrite Updates]
┌─────────────────────────────────────────────────────────┐
│ PROGRESS UPDATE                                         │
├─────────────────────────────────────────────────────────┤
│ ✅ User reviews and approves execution plan             │
│ ✅ Database Architect designs schema                    │
│ ✅ Backend Developer designs API endpoints              │
│ ✅ Test Engineer creates test strategy                  │
│ 🔄 Backend Developer implements server & routes         │
│ 🔄 Database Architect implements schema & migrations    │
│ ⏳ Test Engineer writes unit tests                      │
│ ⏳ Test Engineer writes integration tests               │
│ ⏳ API Documenter generates OpenAPI spec                │
│ ⏳ API Documenter writes usage documentation            │
└─────────────────────────────────────────────────────────┘

✅ Phase Complete: Architecture Design

Artifacts Created: 3 files
- database/schema.sql (220 lines)
- backend/api-endpoints.md (85 lines)
- tests/test-strategy.md (102 lines)

Key Decisions:
- Using SQLite with WAL mode for concurrency
- API versioned at v1 for future compatibility
- Test pyramid: 70% unit, 20% integration, 10% e2e

Proceeding to Phase 2: Implementation

[45 seconds later]

📄 Document Created
   Path: sessions/.../artifacts/src/server.js
   Agent: Backend Developer
   Phase: Implementation
   Status: Complete ✓

📄 Document Created
   Path: sessions/.../artifacts/src/routes/todos.js
   Agent: Backend Developer
   Phase: Implementation
   Status: Complete ✓

📄 Document Created
   Path: sessions/.../artifacts/database/migrations/001-init.sql
   Agent: Database Architect
   Phase: Implementation
   Status: Complete ✓

📄 Document Created
   Path: sessions/.../artifacts/tests/todos.test.js
   Agent: Test Engineer
   Phase: Implementation
   Status: Complete ✓

   Test results: ✅ All 18 tests passing

📄 Document Created
   Path: sessions/.../artifacts/tests/integration.test.js
   Agent: Test Engineer
   Phase: Implementation
   Status: Complete ✓

   Test results: ✅ All 12 integration tests passing

[TodoWrite Updates]
┌─────────────────────────────────────────────────────────┐
│ PROGRESS UPDATE                                         │
├─────────────────────────────────────────────────────────┤
│ ✅ All 10 tasks complete                                │
│                                                          │
│ Coverage: 94% (Target: 90%+) ✓                          │
│ Tests: 30/30 passing ✓                                  │
│ Artifacts: 10/10 created ✓                              │
└─────────────────────────────────────────────────────────┘

✅ Phase Complete: Implementation

Artifacts Created: 7 files
- src/server.js (142 lines)
- src/routes/todos.js (187 lines)
- src/middleware/validation.js (56 lines)
- database/migrations/001-init.sql (32 lines)
- tests/todos.test.js (245 lines)
- tests/integration.test.js (189 lines)
- package.json (28 lines)

Test Results:
✅ Unit tests: 18/18 passing (95% coverage)
✅ Integration tests: 12/12 passing

Proceeding to Phase 3: Integration & Documentation

[20 seconds later]

📄 Document Created
   Path: sessions/.../artifacts/docs/API.md
   Agent: API Documenter
   Phase: Integration
   Status: Complete ✓

📄 Document Created
   Path: sessions/.../artifacts/docs/SETUP.md
   Agent: API Documenter
   Phase: Integration
   Status: Complete ✓

✅ All Phases Complete

Final Summary:
- 10 artifacts created
- All tests passing (94% coverage)
- API fully documented
- Ready for deployment

[TodoWrite shows all completed]
```

### Phase 3: Closeout (User Sees This)

```
Claude Code:
═══════════════════════════════════════════════════════════
SESSION SUMMARY READY FOR REVIEW
═══════════════════════════════════════════════════════════

Location: sessions/20251113-100000-todo-api/artifacts/session-summary.md

Summary Highlights:

✅ Mission Accomplished
   Built production-ready REST API for todo list management

✅ All Success Criteria Met
   • RESTful CRUD endpoints implemented
   • SQLite database with migrations
   • Input validation and error handling
   • 94% test coverage (exceeded 90% target)
   • Comprehensive API documentation

📦 Artifacts Delivered (10 files)
   Source Code:
   - src/server.js (Express server)
   - src/routes/todos.js (API routes)
   - src/middleware/validation.js (Input validation)

   Database:
   - database/schema.sql (Schema definition)
   - database/migrations/001-init.sql (Initial migration)

   Tests:
   - tests/todos.test.js (18 unit tests)
   - tests/integration.test.js (12 integration tests)

   Documentation:
   - docs/API.md (OpenAPI spec + examples)
   - docs/SETUP.md (Installation & usage guide)

   Configuration:
   - package.json (Dependencies & scripts)

🎯 Key Decisions
   1. SQLite with WAL mode for concurrency
      Rationale: Simple deployment, good performance for medium traffic

   2. API versioning (v1 prefix)
      Rationale: Enables future backward-compatible changes

   3. Test pyramid approach (70/20/10)
      Rationale: Fast feedback, comprehensive coverage

⚠️ Risks Mitigated
   • Database locking → WAL mode enabled
   • API versioning confusion → Clear v1 namespace

📊 Metrics
   - Execution time: 18 minutes
   - Test coverage: 94%
   - Tests passing: 30/30
   - Code quality: All linting passed

═══════════════════════════════════════════════════════════

Review the full summary and approve for archival.

Commands to run after approval:
1. npx claude-flow@alpha hooks post-task --task-id "todo-api-20251113"
2. npx claude-flow@alpha hooks session-end --export-metrics true
```

### User Approves Closeout
```
User: approved

Claude Code:
Archiving session...

✅ Session archived successfully

Archive location: .swarm/backups/20251113-100000-todo-api.json

Archive includes:
- Full execution plan
- All 10 artifacts
- Session summary
- Memory snapshot (agent coordination state)
- Metrics (token usage, timing, test results)

Session complete. All artifacts remain in:
sessions/20251113-100000-todo-api/artifacts/

You can now:
- Run the API: cd sessions/.../artifacts && npm start
- Review docs: open sessions/.../artifacts/docs/API.md
- Promote to project: Move artifacts to docs/projects/todo-api/
```

---

## Example 2: Large Multi-Phase Migration

### User Request
```
User: "Migrate our monolithic Django app to microservices"
```

### Phase 1: Planning (User Sees This)

```
Claude Code:
This is a complex migration. Creating comprehensive execution plan...

[Analyzing codebase...]
[Generating plan...]

📋 Execution Plan Created

Location: sessions/20251113-140000-microservices-migration/artifacts/execution-plan.md

═══════════════════════════════════════════════════════════
EXECUTION PLAN: MONOLITH TO MICROSERVICES MIGRATION
═══════════════════════════════════════════════════════════

⚠️ LARGE OPERATION WARNING
This migration involves 8 agents across 4 phases (~90 minutes).
Review plan carefully before approving.

Mission: Decompose Django monolith into 5 microservices with
minimal downtime and data consistency guarantees.

Success Criteria:
✓ 5 microservices identified and extracted
✓ API gateway for routing
✓ Event-driven communication (RabbitMQ)
✓ Database per service pattern
✓ Zero-downtime deployment strategy
✓ Rollback plan documented

Agent Roster: (8 agents)
1. System Architect - Overall system design, service boundaries
2. Migration Planner - Sequencing, dependencies, risk analysis
3. Backend Developer (×3) - User, Orders, Inventory services
4. Database Specialist - Schema decomposition, data migration
5. DevOps Engineer - Docker, Kubernetes, CI/CD
6. Integration Engineer - API gateway, message queues

Execution Strategy:
- Phase 1: Analysis & Planning (Sequential)
  └─ Dependency analysis → Service boundaries → Migration sequence

- Phase 2: Architecture (Sequential)
  └─ Service design → API contracts → Data models

- Phase 3: Implementation (Parallel with dependencies)
  └─ User service → (Orders + Inventory) → Payment → Notifications

- Phase 4: Integration & Deployment (Sequential)
  └─ API gateway → Event bus → Deploy strategy → Rollback testing

Expected Artifacts: (35+ files)
[Full inventory in plan document]

Risk Assessment:
⚠️ HIGH: Data consistency during migration
   → Mitigation: Dual-write pattern with reconciliation

⚠️ HIGH: Service interdependencies
   → Mitigation: Strangler fig pattern, incremental migration

⚠️ MEDIUM: Performance degradation from network calls
   → Mitigation: Caching layer, async communication

⚠️ MEDIUM: Deployment coordination
   → Mitigation: Blue-green deployment, feature flags

Estimated Timeline: ~90 minutes
Pause points: After Phase 2 (architecture review)

═══════════════════════════════════════════════════════════

[TodoWrite Display - 18 tasks across 4 phases]
┌─────────────────────────────────────────────────────────┐
│ PLANNED WORK (18 tasks)                                 │
├─────────────────────────────────────────────────────────┤
│ 🔴 CRITICAL - Awaiting Approval                         │
│   • User reviews and approves execution plan            │
│                                                          │
│ 📊 PHASE 1: ANALYSIS (3 tasks)                          │
│   • System Architect analyzes dependencies              │
│   • Migration Planner identifies service boundaries     │
│   • Migration Planner creates migration sequence        │
│                                                          │
│ 🏗️ PHASE 2: ARCHITECTURE (5 tasks)                      │
│   • System Architect designs service architecture       │
│   • Backend Developers design API contracts             │
│   • Database Specialist designs schema decomposition    │
│   • Integration Engineer designs API gateway            │
│   • Integration Engineer designs event bus              │
│                                                          │
│ 💻 PHASE 3: IMPLEMENTATION (7 tasks)                     │
│   • Backend Dev 1 implements User service               │
│   • Backend Dev 2 implements Orders service             │
│   • Backend Dev 3 implements Inventory service          │
│   • Database Specialist implements data migrations      │
│   • Integration Engineer implements API gateway         │
│   • Integration Engineer implements event bus           │
│   • DevOps Engineer creates Docker/K8s configs          │
│                                                          │
│ 🚀 PHASE 4: INTEGRATION (3 tasks)                        │
│   • DevOps Engineer creates deployment strategy         │
│   • Integration Engineer tests service communication    │
│   • Migration Planner documents rollback procedures     │
└─────────────────────────────────────────────────────────┘

⚠️ RECOMMENDATION: Review the full plan before approving.
This is a 90-minute migration with significant architectural changes.

Please review the execution plan at:
sessions/20251113-140000-microservices-migration/artifacts/execution-plan.md

Type 'approved' to begin, or request changes/clarifications.
```

### User Reviews Plan and Requests Change
```
User: "Can we start with just the User service as a proof-of-concept
before doing the full migration?"

Claude Code:
Excellent idea. Refining plan for incremental migration...

[Updating plan...]

📋 Execution Plan Updated

Location: sessions/20251113-140000-microservices-migration/artifacts/execution-plan.md

Changes:
- Reduced scope to User service only (PoC)
- Added validation criteria before full migration
- Reduced agents from 8 to 4
- Reduced timeline from 90min to 30min

PoC Success Criteria (must pass before full migration):
✓ User service fully functional in isolation
✓ API gateway routes user requests correctly
✓ Performance acceptable (< 100ms latency increase)
✓ Data consistency maintained
✓ Rollback tested successfully

If PoC succeeds, we'll proceed with remaining services.

[Updated TodoWrite - now 8 tasks instead of 18]

Review updated plan. Type 'approved' to begin PoC.
```

### User Approves
```
User: approved

Claude Code:
Starting PoC migration with 4 agents...

[Execution proceeds with frequent notifications...]

Phase 1: Analysis (5 minutes)
├─ 📄 dependency-graph.md created
├─ 📄 user-service-boundaries.md created
└─ ✅ Phase complete

Phase 2: Architecture (8 minutes)
├─ 📄 user-service-api-contract.md created
├─ 📄 user-service-data-model.md created
├─ 📄 api-gateway-design.md created
└─ ✅ Phase complete

⏸️  ARCHITECTURE REVIEW CHECKPOINT

Summary: User service will handle authentication, profiles, and
preferences. Clean boundaries with Orders/Inventory services.

Ready to proceed to implementation? [yes/no]

User: yes

Phase 3: Implementation (15 minutes)
[Multiple artifact notifications...]
└─ ✅ Phase complete

Phase 4: Testing & Validation (7 minutes)
[Test results...]
└─ ✅ All PoC criteria met

Session summary ready for review...
```

---

## Example 3: User Monitors Progress Mid-Execution

### Scenario: User checks in during long-running task

```
[40 minutes into a migration]

User: "What's the current status?"

Claude Code:
[Reading current state...]

Current Status: Phase 3 Implementation (In Progress)

┌─────────────────────────────────────────────────────────┐
│ AGENT STATUS                                            │
├─────────────────────────────────────────────────────────┤
│ ✅ Backend Dev 1 - User service complete                │
│ 🔄 Backend Dev 2 - Orders service (80% complete)        │
│ 🔄 Backend Dev 3 - Inventory service (60% complete)     │
│ ✅ Database Specialist - Migrations complete            │
│ 🔄 Integration Engineer - API gateway (90% complete)    │
│ ⏳ DevOps Engineer - Waiting on services                │
└─────────────────────────────────────────────────────────┘

Recent Activity (last 5 minutes):
- Orders service: Implemented order creation endpoint
- Inventory service: Implemented stock checking logic
- API gateway: Added rate limiting middleware

[TodoWrite showing current progress: 12/18 complete]

Estimated time remaining: ~25 minutes

Latest Artifacts:
- orders-service/routes.js (updated 2 min ago)
- inventory-service/stock.js (updated 4 min ago)
- api-gateway/middleware.js (updated 1 min ago)

All artifacts available at:
sessions/20251113-140000-microservices-migration/artifacts/

Would you like details on any specific component?
```

---

## Key Patterns Demonstrated

### 1. Plan Presentation
- Clear execution plan with structured sections
- Visual TodoWrite showing all work
- Explicit approval request
- Risk assessment upfront

### 2. Real-Time Notifications
- Document creation alerts with agent attribution
- Phase completion summaries
- Progressive todo updates with visual indicators
- Artifact locations always provided

### 3. User Control
- Blocking approval prevents unwanted work
- Mid-execution status checks available
- Plan refinement when requested
- HITL review before archival

### 4. Transparency
- Every artifact creation is announced
- Progress visible in real-time
- Decisions explained with rationale
- Estimated timelines provided

### 5. Closeout
- Comprehensive summary with metrics
- User approval before archive
- Clear next steps
- All artifacts remain accessible

---

## What This Prevents

### Without TSCP:
```
User: "Build an API"

Claude: [Spawns 5 agents silently]
Claude: [Creates 20 files without notification]
Claude: "Done! I built an API."

User: "Wait, what did you build? Where is everything?"
User: "Why did you use GraphQL? I wanted REST!"
User: "How do I even run this?"
```

### With TSCP:
```
User: "Build an API"

Claude: "Here's the plan: REST API, 4 agents, 12 tasks. Review?"
User: "Actually, use GraphQL instead"
Claude: "Updated plan. Review?"
User: "Approved"

Claude: [Creates files with notifications]
Claude: "📄 Created: api-schema.graphql"
Claude: "📄 Created: resolvers.js"
User: [Sees progress, can review files in real-time]

Claude: "Summary ready. Tests passed. Approve for archive?"
User: "Approved"
```

**Result:** User is informed, in control, and can review work at every stage.
