# North Star Specification: Common Thread Workspace

**Version:** 1.0.0
**Date:** 2025-11-14
**Status:** DEFINITIVE
**Validation Score:** 62.3% (current) → 100% (target)

---

## Executive Summary

This document defines what "100% completion" means for the Common Thread workspace learning infrastructure. It is grounded in user intent extracted from CLAUDE.md, validation gap analysis, and the explicit principle: **"Honesty is a core value. If you lie, you'll be replaced."**

**Current Reality:** System is 62.3% complete with 4 blocking gaps.
**North Star Goal:** 100% = All core features functional, protocol compliant, independently validated.

---

## The Three Principles (Foundation)

These principles are NON-NEGOTIABLE and define the architectural foundation:

### 1. Time-Neutral
**Definition:** All operations are on-demand via CLI commands. No scheduled tasks, no "daily" routines, no time-based triggers.

**Why:** Work when you're ready, not when a schedule dictates. Automation happens when you invoke it.

**Implementation Requirements:**
- ✅ All commands are `npx claude-flow@alpha hooks <command>` (on-demand)
- ✅ No cron jobs, no setInterval, no scheduled automation
- ✅ Session closeout triggered by user saying "Done" or "Close Session"
- ✅ Captain's Log entries created during closeout, not on timer

**Validation:**
```bash
# ✅ CORRECT
npx claude-flow@alpha hooks session-end --generate-summary true

# ❌ WRONG
crontab -e  # daily session closeout at 5pm
```

### 2. Scale-Agnostic
**Definition:** The system works identically whether managing 10 items or 10,000. Graceful degradation, no hard limits.

**Why:** Start small, scale naturally. No architectural rewrites as your project grows.

**Implementation Requirements:**
- ✅ SQLite handles 10-10,000+ sessions without schema changes
- ✅ Memory queries use indexed lookups, not full table scans
- ✅ Captain's Log appends incrementally, no rewriting entire file
- ✅ Backups are timestamped files, not monolithic database dumps

**Validation:**
```bash
# Test with 1 session
npx claude-flow@alpha hooks session-end

# Test with 100 sessions (batch)
find sessions/ -name metadata.json | xargs -n 1 -P 5 npx claude-flow@alpha hooks session-end

# Both should complete successfully with proportional time increase
```

### 3. Stock-First
**Definition:** 95% stock claude-flow infrastructure, 5% thin wrappers for workflow. No custom frameworks, no reinvention.

**Why:** Leverage battle-tested tools. Updates are automatic, maintenance is minimal.

**Implementation Requirements:**
- ✅ Memory storage: `claude-flow hooks memory` (stock)
- ✅ Journal entries: `claude-flow hooks journal` (stock)
- ✅ Session snapshots: `claude-flow hooks session-end` (stock)
- ✅ Only thin wrappers: session-closeout.js, file-router.js, captains-log.js

**Validation:**
```bash
# 95% of code is npx calls, not custom logic
grep -r "npx claude-flow" sessions/*/artifacts/code/ | wc -l  # High count
grep -r "function custom" sessions/*/artifacts/code/ | wc -l  # Low count
```

---

## Required README.md Locations

README.md files serve as **AI-human collaboration interfaces**. They explain INTENT, not just structure.

### 1. Root README.md
**Location:** `/README.md`
**Purpose:** Project overview and orientation

**Required Content:**
- What is this workspace? (Learning infrastructure for Claude Code)
- The Three Principles (time-neutral, scale-agnostic, stock-first)
- Quick start guide for new users
- Link to CLAUDE.md for AI instructions
- Link to sessions/ for work artifacts
- Status: Production vs. Development

**Example:**
```markdown
# Common Thread - Claude Code Workspace Intelligence

A learning infrastructure for Claude Code agents, built on claude-flow.

## The Three Principles
1. **Time-neutral** - Work on-demand, not on schedule
2. **Scale-agnostic** - 10 or 10,000 sessions, same architecture
3. **Stock-first** - 95% claude-flow, 5% thin wrappers

## Quick Start
See CLAUDE.md for AI instructions. All session work goes to `sessions/<session-id>/artifacts/`.
```

### 2. sessions/README.md
**Location:** `/sessions/README.md`
**Purpose:** Session management guide

**Required Content:**
- Session lifecycle (create → work → close → archive)
- Directory structure explanation
- Artifact organization (code, tests, docs, scripts, notes)
- How to close a session (say "Done" or "Close Session")
- Captain's Log integration overview

**Example:**
```markdown
# Sessions Directory

All chat work lives here. One session = one chat thread.

## Lifecycle
1. Chat starts → Auto-create `session-YYYYMMDD-HHMMSS-<topic>/`
2. Work proceeds → All files go to `artifacts/{code,tests,docs,scripts,notes}/`
3. Chat ends → Say "Done" → Session closed → Archived to `.swarm/backups/`

## Captain's Log
Session summaries written to `captains-log/YYYY-MM-DD.md` during closeout.
```

### 3. sessions/captains-log/README.md
**Location:** `/sessions/captains-log/README.md`
**Purpose:** Journal system explanation

**Required Content:**
- What is the Captain's Log? (Cross-session intelligence)
- How entries are created (automated during closeout)
- Entry format (date-based files: YYYY-MM-DD.md)
- How to query past decisions
- Manual entry process (if needed)

**Example:**
```markdown
# Captain's Log - Session Journal

A date-based journal of decisions, insights, and blockers across all sessions.

## Automated Entries
During session closeout, the approved summary is written here:
- File: `YYYY-MM-DD.md`
- Content: Session summary + key decisions + blockers
- Trigger: `npx claude-flow@alpha hooks journal`

## Query Past Decisions
```bash
# Find all sessions about "API design"
grep -r "API design" sessions/captains-log/
```
```

### 4. .swarm/README.md
**Location:** `/.swarm/README.md`
**Purpose:** Infrastructure storage explanation

**Required Content:**
- What is .swarm/? (Infrastructure directory for memory, backups, config)
- memory.db explanation (SQLite for structured storage)
- backups/ explanation (session snapshots)
- config/ explanation (system configuration)
- When to inspect vs. when to ignore

**Example:**
```markdown
# .swarm/ - Infrastructure Storage

Stock claude-flow infrastructure. You rarely need to touch this directly.

## Contents
- `memory.db` - SQLite database for agent memory, patterns, coordination
- `backups/` - Timestamped session snapshots (JSON format)
- `config/` - System configuration files

## Usage
Use hooks, not direct file access:
```bash
npx claude-flow@alpha hooks memory --get "key"
npx claude-flow@alpha hooks session-restore --session-id "swarm-abc123"
```
```

### 5. .claude/agents/README.md
**Location:** `/.claude/agents/README.md`
**Purpose:** Agent command pattern explanation

**Required Content:**
- What is .claude/agents/? (Natural language commands for common workflows)
- Available agents: session-closeout.md, captains-log.md, file-routing.md
- How to invoke ("Close out this session" triggers session-closeout.md)
- How to add new agent commands

**Example:**
```markdown
# .claude/agents/ - Natural Language Commands

Agent command definitions for common workflows. Say the phrase, AI executes the workflow.

## Available Commands
- **"Close out this session"** → `.claude/agents/session-closeout.md`
- **"Check Captain's Log"** → `.claude/agents/captains-log.md`
- **"Validate file routing"** → `.claude/agents/file-routing.md`

## How It Works
AI reads the markdown file and follows the instructions as a workflow.
```

---

## Required .claude/agents/*.md Patterns

These files define **natural language → workflow mappings** for AI agents.

### 1. .claude/agents/session-closeout.md
**Location:** `/.claude/agents/session-closeout.md`
**Trigger Phrase:** "Close out this session" OR "Done"

**Required Workflow:**
```markdown
# Session Closeout Agent

When the user says "Close out this session" or "Done", execute this workflow:

## Step 1: Collect Session Data
```bash
npx claude-flow@alpha hooks session-end --generate-summary true
```

## Step 2: Present Summary for HITL Approval
- Show session-summary.md to user
- Show artifact index (list all files in artifacts/)
- Ask: "Approve this summary for Captain's Log? (y/n)"

## Step 3: Update Captain's Log (After Approval)
```bash
npx claude-flow@alpha hooks journal \
  --entry "$(cat sessions/$SESSION_ID/session-summary.md)" \
  --date "$(date +%Y-%m-%d)"
```

## Step 4: Archive to .swarm/backups/
```bash
npx claude-flow@alpha hooks session-end \
  --export-metrics true \
  --backup-location ".swarm/backups/session-$SESSION_ID-$(date +%s).json"
```

## Step 5: Update Metadata
```bash
echo '{"status":"closed","closed_at":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' \
  | jq -s '.[0] * .[1]' sessions/$SESSION_ID/metadata.json - \
  > sessions/$SESSION_ID/metadata.json.tmp && \
  mv sessions/$SESSION_ID/metadata.json.tmp sessions/$SESSION_ID/metadata.json
```

## Success Criteria
- ✅ Backup exists in .swarm/backups/
- ✅ Captain's Log has new entry
- ✅ Metadata shows status: "closed"
- ✅ Session directory is immutable
```

### 2. .claude/agents/captains-log.md
**Location:** `/.claude/agents/captains-log.md`
**Trigger Phrase:** "Check Captain's Log" OR "Show me past decisions"

**Required Workflow:**
```markdown
# Captain's Log Query Agent

When the user says "Check Captain's Log" or "Show me past decisions", execute this workflow:

## Step 1: List Recent Entries
```bash
ls -lt sessions/captains-log/ | head -10
```

## Step 2: Ask for Specifics
"What topic or date range are you interested in?"

## Step 3: Search Entries
```bash
# By topic
grep -r "<topic>" sessions/captains-log/

# By date range
find sessions/captains-log/ -name "2025-11-*.md" -exec cat {} \;
```

## Step 4: Present Results
- Show matching entries
- Include session ID references
- Highlight key decisions or blockers
```

### 3. .claude/agents/file-routing.md
**Location:** `/.claude/agents/file-routing.md`
**Trigger Phrase:** "Validate file routing" OR "Check for CLAUDE.md violations"

**Required Workflow:**
```markdown
# File Routing Validation Agent

When the user says "Validate file routing", execute this workflow:

## Step 1: Check for Root Violations
```bash
# Find files in forbidden root directories
find . -maxdepth 2 -type d -name "tests" -o -name "docs" -o -name "scripts" | \
  grep -v "sessions/" | \
  grep -v ".git" | \
  grep -v "node_modules"
```

## Step 2: Verify Session Artifacts
```bash
# All work should be in sessions/*/artifacts/
find sessions/ -type f | grep -v "artifacts/" | grep -v "metadata.json" | grep -v "session-summary.md"
```

## Step 3: Report Violations
If violations found:
- List file paths
- Suggest correct location: `sessions/$SESSION_ID/artifacts/<type>/`
- Offer to move files

## Step 4: Prevention
Recommend adding pre-write validation hook:
```bash
npx claude-flow@alpha hooks pre-edit --validate-path true
```
```

---

## File Router Behavior (AI Guidance, NEVER Block User)

**Critical Design Principle:** The file router is **ADVISORY**, not **ENFORCIVE**. It guides AI agents, but NEVER prevents user actions.

### Router Logic
```javascript
// .claude/hooks/file-router.js (thin wrapper)

function suggestFilePath(operation, originalPath) {
  const forbidden = ['tests/', 'docs/', 'scripts/'];

  // Check if path violates CLAUDE.md
  if (forbidden.some(p => originalPath.startsWith(p) && !originalPath.startsWith('sessions/'))) {
    // AI GUIDANCE: Suggest correct path
    console.warn(`⚠️  CLAUDE.md SUGGESTION: Files should go to sessions/$SESSION_ID/artifacts/`);
    console.warn(`    Original: ${originalPath}`);
    console.warn(`    Suggested: sessions/$SESSION_ID/artifacts/${detectType(originalPath)}/${path.basename(originalPath)}`);

    // RETURN WARNING, DO NOT BLOCK
    return {
      proceed: true,  // ← NEVER set to false
      warning: true,
      suggestion: `sessions/$SESSION_ID/artifacts/${detectType(originalPath)}/${path.basename(originalPath)}`
    };
  }

  return { proceed: true, warning: false };
}

// Usage in AI agents
const routerCheck = suggestFilePath('write', 'tests/my-test.js');
if (routerCheck.warning) {
  // AI logs the warning and uses suggestion
  console.log(`Following CLAUDE.md: Using ${routerCheck.suggestion}`);
} else {
  // AI proceeds with original path
}
```

### Design Rationale
1. **AI agents** follow the suggestions automatically (95% compliance)
2. **Users** can override at any time (manual writes always succeed)
3. **No breaking changes** to existing workflows
4. **Gradual migration** from legacy patterns to CLAUDE.md compliance

### Implementation
- **Pre-write hook** runs router logic
- **Warning logged** to session-summary.md
- **Suggestion stored** in memory for learning
- **No errors thrown** (guidance only)

---

## Success Criteria: What Makes It 100%?

### Core Features (Must Work - 60% of score)

#### ✅ CF-001: Automatic Session Initialization
**Criteria:**
- Session ID auto-generated on first message in new chat
- Directory structure created: `sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}`
- Metadata initialized with accurate timestamps
- 100% success rate across all chats

**Validation:**
```bash
# Start new chat, say "Hello"
# Verify session created automatically
ls -la sessions/ | grep "session-$(date +%Y%m%d)"
```

#### ✅ CF-002: File Routing (AI Guidance)
**Criteria:**
- Router suggests correct paths for AI agents
- Warnings logged for CLAUDE.md violations
- User writes NEVER blocked (guidance only)
- 95%+ AI agent compliance with suggestions

**Validation:**
```bash
# AI agent writes to root (test-workflow/)
# Verify warning logged in session-summary.md
grep "CLAUDE.md SUGGESTION" sessions/$SESSION_ID/session-summary.md
```

#### ✅ CF-003: Session Closeout (3-Step Process)
**Criteria:**
1. Generate summary with artifact index
2. Human-in-the-loop approval (foreground only)
3. Archive to `.swarm/backups/` with timestamped JSON

**Validation:**
```bash
# Say "Done" in chat
# Verify all 3 steps completed
ls -la .swarm/backups/ | grep "session-$SESSION_ID"
jq '.status' sessions/$SESSION_ID/metadata.json  # Should be "closed"
grep -A 5 "$(date +%Y-%m-%d)" sessions/captains-log/$(date +%Y-%m-%d).md
```

#### ✅ CF-004: Captain's Log Integration
**Criteria:**
- Automated entries written during closeout
- Hook integration functional: `npx claude-flow@alpha hooks journal`
- Entries include: session ID, decisions, blockers
- Cross-session queries work

**Validation:**
```bash
# After closeout, verify entry exists
cat sessions/captains-log/$(date +%Y-%m-%d).md | grep "$SESSION_ID"

# Query past decisions
grep -r "authentication" sessions/captains-log/
```

### Protocol Compliance (Must Enforce - 25% of score)

#### ✅ PC-001: CLAUDE.md Adherence
**Criteria:**
- "ONE SESSION = ONE CHAT THREAD" enforced
- File routing suggestions followed by AI (95%+ compliance)
- Parallel execution patterns (single-message batching)
- Agent coordination hooks executed

**Validation:**
```bash
# Check for multiple sessions in same chat
find sessions/ -name metadata.json -exec jq '.chat_id' {} \; | sort | uniq -c

# Verify file routing compliance
find . -maxdepth 2 -type d \( -name "tests" -o -name "docs" -o -name "scripts" \) | grep -v sessions | wc -l  # Should be 0 or low
```

#### ✅ PC-002: Hook Integration
**Criteria:**
- Pre-task, post-edit, post-task, session-end hooks fire correctly
- No silent failures (errors logged and reported)
- Memory/journal/metrics updated
- Retry logic for transient failures

**Validation:**
```bash
# Run hook manually, verify execution
npx claude-flow@alpha hooks pre-task --description "test" 2>&1 | tee hook-test.log
grep -i "error\|fail" hook-test.log  # Should be empty or have retry success
```

### Testing & Validation (Must Pass - 10% of score)

#### ✅ TV-001: Integration Tests
**Criteria:**
- Session initialization test passes
- File routing test passes
- Session closeout test passes
- Captain's Log integration test passes
- 90%+ coverage on critical paths

**Validation:**
```bash
# Run integration test suite
npm test -- --grep "integration"

# Verify Captain's Log test exists and passes
npm test -- --grep "captains-log"
```

### Documentation (Should Exist - 5% of score)

#### ✅ DOC-001: Required README.md Files
**Criteria:**
- Root README.md (project overview)
- sessions/README.md (session management)
- sessions/captains-log/README.md (journal system)
- .swarm/README.md (infrastructure storage)
- .claude/agents/README.md (command patterns)

**Validation:**
```bash
# All README files exist
ls README.md sessions/README.md sessions/captains-log/README.md .swarm/README.md .claude/agents/README.md
```

#### ✅ DOC-002: Agent Command Definitions
**Criteria:**
- .claude/agents/session-closeout.md
- .claude/agents/captains-log.md
- .claude/agents/file-routing.md

**Validation:**
```bash
# All agent commands exist
ls .claude/agents/*.md
```

---

## What 100% Does NOT Include (Explicitly Out of Scope)

### ❌ Enterprise Features (Rejected by User)
- ❌ Disaster recovery drills
- ❌ Penetration testing
- ❌ Multi-region deployment
- ❌ Advanced monitoring (Prometheus, Grafana)
- ❌ Compliance certifications (SOC2, HIPAA)
- ❌ Capacity planning models
- ❌ SLA agreements

**Why Rejected:** User's intent is "95% stock claude-flow, 5% thin wrappers" (stock-first principle). Enterprise features require custom frameworks, violating this principle.

### ❌ Custom Infrastructure (Violates Stock-First)
- ❌ Custom database backends (SQLite is stock)
- ❌ Custom hook implementations (use claude-flow hooks)
- ❌ Custom scheduling systems (violates time-neutral)
- ❌ Custom logging frameworks (use hooks journal)

**Why Rejected:** These require reinventing stock claude-flow components. Updates would require manual maintenance.

### ❌ Architectural Complexity (Violates Scale-Agnostic)
- ❌ Microservices decomposition
- ❌ Load balancers / API gateways
- ❌ Complex caching layers
- ❌ Multi-tier database sharding

**Why Rejected:** System must work identically for 10 or 10,000 sessions. Adding complexity at scale violates scale-agnostic principle.

### ❌ Time-Based Automation (Violates Time-Neutral)
- ❌ Daily session summaries (cron jobs)
- ❌ Weekly log rotation (scheduled tasks)
- ❌ Monthly backup cleanup (timers)
- ❌ Auto-archival after 30 days (time-based triggers)

**Why Rejected:** All operations must be on-demand. User invokes when ready, not on schedule.

### ✅ What IS In Scope (Aligned with User Intent)
- ✅ Stock claude-flow hooks integration
- ✅ Thin wrapper scripts (session-closeout.js, file-router.js)
- ✅ README.md documentation for AI-human collaboration
- ✅ Natural language commands (.claude/agents/*.md)
- ✅ On-demand workflows (user says "Done" → closeout)
- ✅ SQLite + markdown storage (stock tools)

---

## Validation Protocol: Proving 100%

### Independent Validation Checklist

Before claiming 100%, the system MUST pass:

1. **Fresh Session Test**
   - Start new chat with NO prior context
   - Verify session auto-initialized
   - Work through full lifecycle
   - Close session and verify Captain's Log entry
   - Restore from backup and verify state

2. **Batch Operations Test**
   - Close 5+ sessions in batch
   - Verify all Captain's Log entries created
   - Verify all backups exist
   - No stuck processes (HITL happens in foreground)

3. **File Routing Compliance Test**
   - AI agent attempts root write
   - Verify warning logged, suggestion followed
   - User manual write succeeds (no blocking)
   - 95%+ AI compliance rate

4. **Hook Integration Test**
   - All hooks fire correctly (pre-task, post-edit, post-task, session-end)
   - Errors logged and retried
   - Memory/journal/metrics updated
   - No silent failures

5. **Independent Review**
   - Fresh validation hive with NO prior context
   - Byzantine consensus (3+ agents agree)
   - Evidence-based claims ONLY
   - Production readiness scorecard ≥ 95%

### Production Readiness Scorecard

| Component | Weight | Target | Current | Gap |
|-----------|--------|--------|---------|-----|
| Session Auto-Init | 15% | 100% | 95% | Session path enforcement |
| File Routing | 15% | 95% | 60% | AI suggestion compliance |
| Session Closeout | 20% | 100% | 66% | HITL + Journal integration |
| Captain's Log | 20% | 100% | 0% | Hook integration broken |
| Protocol Compliance | 15% | 100% | 75% | CLAUDE.md violations |
| Testing Coverage | 10% | 90% | 70% | Captain's Log not tested |
| Documentation | 5% | 100% | 20% | README.md files missing |

**Current Score:** 62.3%
**Target Score:** ≥ 95% (with ≤ 5% in "nice to have" features)

---

## Memory Coordination Keys

**North Star Data Stored:**
- `north-star/principles` → The Three Principles definition
- `north-star/readmes` → Required README.md locations
- `north-star/agents` → Required .claude/agents/*.md patterns
- `north-star/file-router` → Router behavior (advisory, not enforcive)
- `north-star/success-criteria` → What makes it 100%
- `north-star/out-of-scope` → What we're NOT building
- `north-star/validation-protocol` → How to prove 100%
- `north-star/scorecard` → Production readiness metrics

---

## Final Definition: 100% Completion

**100% means:**
1. ✅ All core features (CF-001 through CF-004) FUNCTIONAL with evidence
2. ✅ Protocol compliance (PC-001, PC-002) at ≥ 95% (AI agents follow CLAUDE.md)
3. ✅ Testing coverage (TV-001) at ≥ 90% on critical paths
4. ✅ Documentation (DOC-001, DOC-002) complete (all README.md + agent commands)
5. ✅ Independent validation passes (Byzantine consensus, batch tests, fresh session test)
6. ✅ Production readiness scorecard ≥ 95%
7. ✅ Zero critical gaps (blocking issues resolved)

**100% does NOT mean:**
- ❌ Enterprise features (DR, pentesting, SLAs)
- ❌ Custom infrastructure (violates stock-first)
- ❌ Time-based automation (violates time-neutral)
- ❌ Complex scaling (violates scale-agnostic)

**Current Reality:** 62.3% complete, 4 critical gaps blocking production.

**Path to 100%:** Fix Captain's Log integration, enforce file routing guidance, complete closeout protocol, add integration tests, create README.md documentation.

---

**Status:** DEFINITIVE
**Next Step:** Dream Hive uses this spec to build "Definition of 100%" document
