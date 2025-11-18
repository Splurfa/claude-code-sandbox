# Session Lifecycle

## What Happens During a Session (From Start to Closeout)

This document walks through a complete session lifecycle, explaining what happens at each stage.

## The Big Picture

```
User starts chat
       ↓
Session directory created
       ↓
Agents spawn and work
       ↓
Files written to artifacts/
       ↓
Memory updated continuously
       ↓
User ends chat
       ↓
Session closeout (with HITL approval)
       ↓
Archive to .swarm/backups/
```

**Duration**: Typically 10 minutes to several hours

**Key Principle**: **ONE SESSION = ONE CHAT THREAD** (not per task, not per agent)

---

## Stage 1: Session Initialization

### User Action

**Explicit Start** (recommended):
```bash
/session-start api-development
```

**Implicit Start** (automatic):
- User opens new chat thread
- First message triggers session creation

---

### System Actions

**1. Generate Session ID**:
```bash
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-$(topic)"
# Example: session-20251117-100232-api-development
```

**2. Create Directory Structure**:
```bash
mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}
```

**Result**:
```
sessions/session-20251117-100232-api-development/
├── artifacts/
│   ├── code/       # Source code files
│   ├── tests/      # Test files
│   ├── docs/       # Documentation
│   ├── scripts/    # Build/deploy scripts
│   └── notes/      # Scratch notes
└── (metadata files created later)
```

**3. Initialize Memory Namespace**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "session/metadata",
  value: JSON.stringify({
    session_id: "session-20251117-100232-api-development",
    started_at: Date.now(),
    topic: "api-development"
  }),
  namespace: "session-20251117-100232-api-development"
})
```

**4. Create Captain's Log Entry**:
```markdown
## [10:02] Session Start: API Development

**Objective:** Build REST API with authentication and testing

**Session ID:** session-20251117-100232-api-development
```

**5. Export Environment Variable** (for agents):
```bash
export SESSION_ID="session-20251117-100232-api-development"
```

---

## Stage 2: Active Work Phase

### Agent Spawning

**User Request**:
```
"Build a REST API with JWT authentication, comprehensive tests, and documentation"
```

**Claude Code Response** (parallel agent spawning):
```javascript
// All agents spawned in single message (10-20x speedup)
Task("Research agent", "Analyze JWT best practices. Save to sessions/$SESSION_ID/artifacts/docs/", "researcher")
Task("Architect agent", "Design API structure. Save to sessions/$SESSION_ID/artifacts/docs/", "system-architect")
Task("Coder agent", "Implement endpoints. Save to sessions/$SESSION_ID/artifacts/code/", "coder")
Task("Tester agent", "Write tests. Save to sessions/$SESSION_ID/artifacts/tests/", "tester")
Task("Reviewer agent", "Security audit. Save to sessions/$SESSION_ID/artifacts/docs/", "reviewer")
```

**What Happens**:
1. Claude Code spawns 5 subprocess agents **simultaneously**
2. Each agent receives:
   - Session ID in instructions
   - Access to memory namespace
   - Full project context
3. Agents start work in parallel

**Performance**:
- **Sequential**: 5 agents × 30 seconds = 2.5 minutes
- **Parallel**: 30 seconds total (**5x speedup**)

---

### Agent Work Cycle

**Each Agent Follows This Pattern**:

#### 1. Pre-Task Hook

```bash
npx claude-flow@alpha hooks pre-task --description "Research JWT patterns" --task-id "research-1"
```

**Hook Actions**:
- Validate session directory exists
- Create task tracking entry in memory
- Log task start time

---

#### 2. Check Memory for Context

```javascript
// Research agent checks for existing patterns
mcp__claude_flow_alpha__memory_usage({
  action: "search",
  pattern: "auth/%",
  namespace: "default"  // Cross-session patterns
})
```

**Example Retrieved Data**:
```json
[
  {"key": "auth/jwt-patterns", "value": "{\"algorithm\":\"RS256\"}"},
  {"key": "auth/best-practices", "value": "Use httpOnly cookies"}
]
```

**Benefit**: Agent starts with institutional knowledge, not from scratch.

---

#### 3. Execute Task

**Research Agent**:
```
1. WebSearch for JWT security advisories
2. Analyze OAuth 2.0 specifications
3. Compare HS256 vs RS256 algorithms
4. Document findings
```

**Output**:
```bash
Write("sessions/session-20251117-100232-api-development/artifacts/docs/jwt-analysis.md")
```

**Coder Agent** (runs simultaneously):
```
1. Read research findings from memory
2. Implement JWT middleware
3. Add token generation/validation
4. Write code to artifacts/code/
```

**Tester Agent** (runs simultaneously):
```
1. Read implementation notes from memory
2. Design test cases
3. Implement tests
4. Run test suite
```

---

#### 4. Store Findings in Memory

**Research Agent**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "auth/jwt-patterns",
  value: JSON.stringify({
    algorithm: "RS256",
    expiration: "15min",
    refresh: "7d",
    storage: "httpOnly cookies"
  }),
  namespace: "default",  // Available to all sessions
  ttl: 604800  // 7 days
})
```

**Coder Agent**:
```javascript
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "implementation/auth-middleware",
  value: JSON.stringify({
    library: "jsonwebtoken@9.0.0",
    file: "sessions/session-20251117-100232-api-development/artifacts/code/auth-middleware.js",
    functions: ["generateToken", "validateToken"]
  }),
  namespace: "session-20251117-100232-api-development"
})
```

---

#### 5. Post-Edit Hooks (Automatic)

**Trigger**: Agent writes file

**Hook Configuration** (`.claude/settings.json`):
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [{
          "type": "command",
          "command": "npx claude-flow@alpha hooks post-edit --file '{}'"
        }]
      }
    ]
  }
}
```

**Hook Execution**:
```bash
# Agent writes file
Write("sessions/session-20251117-100232-api-development/artifacts/code/auth-middleware.js")

# Hook auto-fires
npx claude-flow@alpha hooks post-edit --file "auth-middleware.js"
```

**Hook Actions**:
1. **Update Captain's Log**:
   ```markdown
   ## [10:15] Implemented JWT Auth Middleware
   **Decision:** RS256 algorithm with 15min expiration
   **File:** artifacts/code/auth-middleware.js
   ```

2. **Store file metadata in memory**:
   ```javascript
   mcp__claude_flow_alpha__memory_usage({
     action: "store",
     key: "files/code/auth-middleware.js",
     value: JSON.stringify({
       last_modified: Date.now(),
       agent: "coder",
       lines: 150
     })
   })
   ```

3. **Increment operation counter**:
   ```javascript
   mcp__claude_flow_alpha__memory_usage({
     action: "store",
     key: "session/metrics/files-created",
     value: (previousCount + 1).toString()
   })
   ```

---

#### 6. Post-Task Hook

```bash
npx claude-flow@alpha hooks post-task --task-id "research-1" --status "completed"
```

**Hook Actions**:
- Mark task complete in memory
- Calculate task duration
- Log completion time

---

### Concurrent Agent Coordination

**All agents work simultaneously**, coordinating through memory:

```
Time: 10:05
  Research → Stores "JWT patterns" in memory
  Architect → Designs API structure
  Coder → Waiting for research findings
  Tester → Waiting for implementation
  Reviewer → Waiting for code

Time: 10:10
  Research → ✅ Complete
  Architect → ✅ Complete
  Coder → Reads research → Implements
  Tester → Waits
  Reviewer → Waits

Time: 10:15
  Coder → ✅ Complete
  Tester → Reads implementation → Writes tests
  Reviewer → Reads code → Audits security

Time: 10:20
  Tester → ✅ Complete
  Reviewer → ✅ Complete

All agents done in 15 minutes (vs 1.5 hours sequential)
```

---

## Stage 3: Session Progress Tracking

### Metadata Accumulation

**Memory Entries**:
```javascript
{
  "session/metadata": {
    "session_id": "session-20251117-100232-api-development",
    "started_at": 1700000000,
    "topic": "api-development"
  },
  "session/metrics/agents-spawned": "5",
  "session/metrics/files-created": "12",
  "session/metrics/memory-ops": "37"
}
```

**Captain's Log Entries**:
```markdown
## [10:02] Session Start: API Development
## [10:10] Chose RS256 for JWT Signing
## [10:15] Implemented Auth Middleware
## [10:20] Achieved 92% Test Coverage
```

**Artifact Files**:
```
sessions/session-20251117-100232-api-development/artifacts/
├── code/
│   ├── auth-middleware.js (150 lines)
│   ├── user-routes.js (200 lines)
│   └── server.js (100 lines)
├── tests/
│   ├── auth.test.js (180 lines)
│   └── user.test.js (120 lines)
└── docs/
    ├── jwt-analysis.md (50 lines)
    ├── api-design.md (75 lines)
    └── security-review.md (40 lines)
```

**Total Output**: 12 files, 915 lines of code/docs

---

## Stage 4: Session Closeout (User-Initiated)

### User Action

**Command**:
```bash
/session-closeout
```

**Alternative**: User ends chat thread (Claude Code prompts for closeout)

---

### Closeout Workflow

#### Step 1: Generate Summary

**Hook Execution**:
```bash
npx claude-flow@alpha hooks session-end --export-metrics true
```

**Summary Generated**:
```markdown
# Session Summary: api-development

**Session ID:** session-20251117-100232-api-development
**Duration:** 18 minutes
**Started:** 2025-11-17 10:02:32
**Ended:** 2025-11-17 10:20:15

## Agents Spawned
- researcher (1 agent)
- system-architect (1 agent)
- coder (1 agent)
- tester (1 agent)
- reviewer (1 agent)

## Files Created
- 3 code files (450 lines)
- 2 test files (300 lines)
- 3 doc files (165 lines)

## Key Decisions
1. **JWT Algorithm:** Chose RS256 over HS256 for better security
2. **Token Expiration:** 15min access, 7d refresh
3. **Storage:** httpOnly cookies for XSS protection

## Test Results
- Coverage: 92%
- Passing: All tests green
- Security: OWASP Top 10 compliant

## Memory Entries
- 37 operations (15 stored, 22 retrieved)
- 8 permanent patterns
- 5 session-specific entries
```

---

#### Step 2: Extract Decisions for Captain's Log

**Decision Extraction** (from summary):
```markdown
## [10:20] Session Closeout: API Development

**Achievements:**
- Built REST API with JWT authentication
- 92% test coverage achieved
- Security audit completed (OWASP compliant)

**Key Decisions:**
1. RS256 algorithm (asymmetric signing for better security)
2. 15min access tokens with 7d refresh tokens
3. httpOnly cookies (XSS protection)

**Tradeoffs Accepted:**
- Increased complexity (public/private key pair) for better security
- Slightly higher latency (RS256 slower than HS256) for stronger guarantees

**Outcome:** Production-ready API with comprehensive tests and security audit.

**Files:** 12 files created (915 lines total)
```

**Append to Captain's Log**:
```bash
cat >> sessions/captains-log/2025-11-17.md << 'EOF'
## [10:20] Session Closeout: API Development
...
EOF
```

---

#### Step 3: Create Backup Snapshot

**Backup File**: `.swarm/backups/session-20251117-100232-api-development.json`

**Contents**:
```json
{
  "session_id": "session-20251117-100232-api-development",
  "started_at": 1700000000,
  "ended_at": 1700001000,
  "duration_seconds": 1080,
  "topic": "api-development",
  "memory_snapshot": {
    "namespace": "session-20251117-100232-api-development",
    "entries": [
      {
        "key": "implementation/auth-middleware",
        "value": "{\"library\":\"jsonwebtoken@9.0.0\"}",
        "created_at": 1700000500
      },
      {
        "key": "session/metrics/files-created",
        "value": "12",
        "created_at": 1700000900
      }
    ]
  },
  "metrics": {
    "agents_spawned": 5,
    "files_created": 12,
    "lines_written": 915,
    "memory_operations": 37,
    "test_coverage": 92
  },
  "files": [
    "artifacts/code/auth-middleware.js",
    "artifacts/code/user-routes.js",
    "artifacts/code/server.js",
    "artifacts/tests/auth.test.js",
    "artifacts/tests/user.test.js",
    "artifacts/docs/jwt-analysis.md",
    "artifacts/docs/api-design.md",
    "artifacts/docs/security-review.md"
  ]
}
```

---

#### Step 4: HITL Approval (Human-in-the-Loop)

**Prompt to User**:
```
Session closeout summary:

✅ 5 agents spawned
✅ 12 files created (915 lines)
✅ 92% test coverage
✅ Security audit passed

Archive this session? [Y/n]
```

**User Options**:
- **Y** → Proceed with archival
- **n** → Cancel closeout, continue working

**Why HITL?** Prevents accidental session loss, allows user to review before finalizing.

---

#### Step 5: Archive and Cleanup

**If User Approves**:

1. **Update Session Metadata**:
   ```bash
   # sessions/session-20251117-100232-api-development/metadata.json
   {
     "status": "archived",
     "archived_at": 1700001000,
     "summary_path": ".swarm/backups/session-20251117-100232-api-development.json"
   }
   ```

2. **Optional: Cleanup Session-Specific Memory**:
   ```javascript
   // Delete ephemeral entries (keep permanent patterns)
   mcp__claude_flow_alpha__memory_usage({
     action: "delete",
     key: "session/metrics/%",
     namespace: "session-20251117-100232-api-development"
   })
   ```

3. **Git Checkpoint** (optional custom feature):
   ```bash
   # If .git exists and user approved git operations
   git add sessions/session-20251117-100232-api-development/
   git commit -m "Session: api-development (session-20251117-100232)

   - Built REST API with JWT auth
   - 92% test coverage
   - Security audit passed"
   ```

4. **Export Metrics**:
   ```bash
   # Write to .swarm/metrics.json (aggregated metrics)
   {
     "sessions_completed": 47,
     "total_agents_spawned": 234,
     "total_files_created": 589,
     "average_duration_seconds": 1200
   }
   ```

---

## Stage 5: Post-Session State

### What Persists

✅ **Session artifacts**: `sessions/session-ID/artifacts/` (preserved)
✅ **Captain's Log entries**: `sessions/captains-log/YYYY-MM-DD.md` (permanent)
✅ **Memory snapshots**: `.swarm/backups/session-ID.json` (archived)
✅ **Permanent patterns**: `.swarm/memory.db` (namespace=default)
✅ **Metrics**: `.swarm/metrics.json` (aggregated)

### What Is Cleaned Up

❌ **Session-specific memory**: Ephemeral entries deleted
❌ **Temporary files**: OS temp files removed
❌ **Process state**: Agent subprocesses terminated

### What Can Be Restored

**Scenario**: User wants to continue work from archived session

**Restoration**:
```bash
npx claude-flow@alpha hooks session-restore --backup ".swarm/backups/session-20251117-100232-api-development.json"
```

**What Happens**:
1. Memory snapshot restored to `.swarm/memory.db`
2. Session metadata loaded
3. Captain's Log entries indexed
4. User can continue from where they left off

**Benefit**: No work is ever truly lost.

---

## Lifecycle Variations

### Short Session (Quick Fix)

**Duration**: 2-5 minutes

**Typical Flow**:
1. User: "Fix this bug in auth.js"
2. Single agent spawned (coder)
3. 1-2 files modified
4. Closeout: Minimal summary

**Memory Usage**: Low (1-3 entries)

---

### Medium Session (Feature Development)

**Duration**: 15-30 minutes

**Typical Flow**:
1. User: "Build user authentication"
2. 3-5 agents spawned (researcher, coder, tester)
3. 5-10 files created
4. Closeout: Moderate summary with key decisions

**Memory Usage**: Medium (10-20 entries)

---

### Long Session (Architecture Project)

**Duration**: 1-3 hours

**Typical Flow**:
1. User: "Design microservices architecture"
2. 8-12 agents spawned (multiple rounds)
3. 20-40 files created (diagrams, docs, code)
4. Closeout: Comprehensive summary with ADRs

**Memory Usage**: High (50-100 entries)

**Note**: May require multiple checkpoints (auto-save every 30 minutes).

---

## Performance Metrics Across Lifecycle

| Stage | Sequential | Parallel | Speedup |
|-------|------------|----------|---------|
| Initialization | 2s | 2s | 1x |
| Agent Spawning | 150s (5×30s) | 30s | **5x** |
| Agent Execution | 300s (5×60s) | 90s | **3.3x** |
| Memory Ops | 10s | 10s | 1x |
| Hooks | 20s (4×5s) | 5s | **4x** |
| Closeout | 15s | 15s | 1x |
| **Total** | **497s (8.3min)** | **152s (2.5min)** | **3.27x** |

**Key Insight**: Parallel agent spawning + execution = 3-5x speedup for typical sessions.

---

## Best Practices

### During Session

✅ **Use descriptive session topics**: `api-development` (clear) vs `work` (vague)
✅ **Let agents coordinate via memory**: Don't micromanage
✅ **Write files to session artifacts**: Keeps workspace organized
✅ **Check Captain's Log periodically**: Review decisions as they're made

❌ **Don't manually edit .swarm/memory.db**: Use MCP tools
❌ **Don't delete session directories**: Archive instead
❌ **Don't bypass HITL approval**: Review summaries before archival

---

### Session Closeout

✅ **Review summary before approving**: Catch any missed items
✅ **Export metrics**: Track productivity over time
✅ **Update Captain's Log**: Capture lessons learned

❌ **Don't close session prematurely**: Finish all related work first
❌ **Don't skip closeout**: Data loss risk without backup

---

## Debugging Lifecycle Issues

### Issue: Session Directory Not Created

**Symptom**: Agents report "Cannot write to session artifacts"

**Diagnosis**:
```bash
ls sessions/session-$(date +%Y%m%d)*
```

**Solution**: Manually create directory structure:
```bash
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-topic"
mkdir -p sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}
```

---

### Issue: Closeout Hangs

**Symptom**: `npx claude-flow@alpha hooks session-end` never completes

**Diagnosis**:
```bash
# Check for long-running agents
ps aux | grep claude

# Check database locks
sqlite3 .swarm/memory.db "PRAGMA busy_timeout;"
```

**Solution**:
- Kill hanging agent processes
- Increase SQLite busy timeout
- Retry closeout

---

### Issue: Memory Entries Missing After Restore

**Symptom**: Restored session missing memory entries

**Diagnosis**:
```bash
# Check backup file
cat .swarm/backups/session-ID.json | jq '.memory_snapshot.entries | length'
```

**Solution**:
- Verify backup integrity
- Check namespace isolation
- Manually restore critical entries

---

## Summary

**A session is the complete lifecycle of a chat thread**, from initialization to archival.

**Lifecycle Stages**:
1. **Initialization** → Directory + namespace + Captain's Log entry
2. **Active Work** → Agents spawn, execute, coordinate via memory
3. **Progress Tracking** → Metrics accumulate, hooks fire automatically
4. **Closeout** → Summary generated, HITL approval, backup created
5. **Post-Session** → Artifacts preserved, memory cleaned, ready to restore

**Key Insights**:
- **ONE SESSION = ONE CHAT THREAD** (not per task)
- **Parallel execution** = 3-5x speedup
- **Hooks automate journaling** (no manual tracking)
- **HITL approval** prevents accidental data loss
- **Backups enable restoration** (no work lost)

**Stock Adherence**: 98% (session-end hook is stock, directory structure is 2% custom)

**Next Steps**:
- [Hooks & Automation](hooks-and-automation.md) - How hooks fire automatically
- [Data Flow](data-flow.md) - Information flow through lifecycle stages
- [Coordination Mechanics](coordination-mechanics.md) - Agent collaboration patterns
