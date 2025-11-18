# Wizard Guidance Rules
**Extracted from:** Workspace audit, session summaries, and operational patterns
**Date:** 2025-11-17
**Purpose:** Simple, actionable rules for autonomous agent decision-making

---

## 🟢 ALWAYS Rules (Patterns That Succeed)

### Evidence-Based Validation
**ALWAYS verify claims with real tests before marking complete**
- Pattern: Dream Hive revealed "code complete" ≠ "production ready" (78% vs claimed 100%)
- Evidence: Multi-agent validation prevented false confidence
- Action: Run actual tests, check actual files, verify actual behavior

**ALWAYS use multiple independent validators for critical decisions**
- Pattern: 6 hive reports with Byzantine consensus reached 95% confidence
- Evidence: Single-agent estimates were 75-80%, multi-agent validation confirmed 78%
- Action: Cross-check findings across agents before final verdict

**ALWAYS document with evidence, not assertions**
- Pattern: Session summaries with file paths, line counts, test results vs vague claims
- Evidence: Audit report cataloged 360 files with exact line counts (88,471 lines)
- Action: Include file paths, metrics, test output, not "it works"

### File Organization
**ALWAYS route working files to session artifacts**
- Pattern: 100% compliance achieved when `sessions/$SESSION_ID/artifacts/{code,tests,docs,scripts,notes}/` enforced
- Evidence: Root violations eliminated (test-workflow-* cleaned) → 85% organization score
- Action: Before creating ANY file, verify path starts with `sessions/session-*/artifacts/`

**ALWAYS preserve READ-ONLY boundaries**
- Pattern: 60 READ-ONLY files (backups, external research) never corrupted
- Evidence: `.swarm/backups/` (31 files), `inbox/codex-agent/` (16 files), `inbox/cursor-agent/` (13 files)
- Action: Never edit files in `.swarm/backups/`, `inbox/codex-agent/`, `inbox/cursor-agent/`

### Coordination
**ALWAYS use memory namespaces for cross-agent communication**
- Pattern: Agents coordinate via `mcp__claude-flow_alpha__memory_usage` with namespaces
- Evidence: Memory.db contains coordination state across 31 session snapshots
- Action: Store shared state in memory with namespace (e.g., `swarm/agent-name/task-step`)

**ALWAYS fire hooks for session lifecycle events**
- Pattern: Sessions with `npx claude-flow@alpha hooks session-end` have proper snapshots
- Evidence: 31 backups in `.swarm/backups/` from sessions that ran hooks
- Action: `pre-task`, `post-task`, `session-end` hooks create audit trail

---

## 🔴 NEVER Rules (Patterns That Fail)

### Theater Behavior
**NEVER claim completion without execution evidence**
- Anti-pattern: "Code complete" without running tests (led to 78% actual vs 100% claimed)
- Evidence: Integration sprint needed 1 hour to go from "complete" to actually working
- Violation: Creates false confidence, delays real production readiness

**NEVER ask permission for tasks with defined completion criteria**
- Anti-pattern: "Should I run the tests?" when completion criterion IS "tests passing"
- Evidence: Session delays when agents asked permission instead of executing verification
- Violation: Wastes time, signals uncertainty on clearly-defined tasks

**NEVER disable functionality instead of fixing root cause**
- Anti-pattern: Commenting out failing tests instead of fixing the code
- Evidence: Test failures in sessions that took shortcuts vs fixed root causes
- Violation: Technical debt accumulation, reduces actual quality

### File Management
**NEVER create files in root directories for working content**
- Anti-pattern: `code/`, `tests/`, `docs/` at root level (not in session artifacts)
- Evidence: Root violations dropped from 100% to 0% when sessions enforced artifacts/ structure
- Violation: File routing chaos, prevents clean session boundaries

**NEVER modify external agent research content**
- Anti-pattern: Editing files in `inbox/codex-agent/` or `inbox/cursor-agent/`
- Evidence: 29 READ-ONLY research files provide curriculum/tools (never need editing)
- Violation: Corrupts reference material, breaks permission boundaries

### Quality Shortcuts
**NEVER mock real behavior in integration tests**
- Anti-pattern: Testing mocked hooks instead of real hook execution
- Evidence: Integration tests that passed with mocks but failed in production
- Violation: False test confidence, doesn't validate actual behavior

**NEVER skip validation steps due to time pressure**
- Anti-pattern: "User seems in a hurry" → skip tests → claim done
- Evidence: Sessions that skipped verification needed remediation sprints
- Violation: Compounds problems, increases total time to quality outcome

---

## ⚡ EXECUTE Rules (How to Proceed Autonomously)

### Decision-Making
**EXECUTE verification before claiming completion**
```bash
# Autonomous pattern for task completion
1. Implement feature/fix
2. Run: npm test (or equivalent verification)
3. Check: All tests pass + no console errors
4. Only then: Mark task complete with evidence
```
- Context: If completion criterion is "tests pass", run tests autonomously
- No permission needed: Verification is part of the task definition

**EXECUTE evidence collection during work**
```bash
# Autonomous pattern for reporting
1. Track: File paths created/modified
2. Capture: Test output, metrics, line counts
3. Document: Actual results, not assumptions
4. Report: "Created X at /path with Y lines, tests: Z passed/failed"
```
- Context: Evidence gathering is always appropriate
- No permission needed: Transparency expected

### Coordination
**EXECUTE memory coordination for agent handoffs**
```javascript
// Autonomous pattern for cross-agent work
mcp__claude-flow_alpha__memory_usage({
  action: "store",
  key: "agent-handoff/task-123/step-1-results",
  value: JSON.stringify({ files: [...], status: "complete", next: "step-2" }),
  namespace: "coordination"
})
```
- Context: Agents need shared state for workflows
- No permission needed: Coordination prevents re-work

**EXECUTE hooks for session lifecycle**
```bash
# Autonomous pattern for session management
npx claude-flow@alpha hooks pre-task --description "Task X" --task-id "123"
# ... do work ...
npx claude-flow@alpha hooks post-task --task-id "123" --status "completed"
```
- Context: Hooks create audit trail and enable learning
- No permission needed: Infrastructure expects hooks

### Quality Assurance
**EXECUTE root cause analysis on failures**
```bash
# Autonomous pattern for debugging
1. Reproduce: Run failing test/command
2. Inspect: Read error output, check logs
3. Trace: Follow error to source file/line
4. Fix: Address root cause, not symptom
5. Verify: Re-run test, confirm fix
```
- Context: When encountering errors or test failures
- No permission needed: Fixing broken things is always appropriate

**EXECUTE comprehensive testing for new features**
```bash
# Autonomous pattern for TDD
1. Write failing test (defines expected behavior)
2. Run test (confirm it fails correctly)
3. Implement minimal code to pass
4. Run test (confirm it passes)
5. Refactor if needed
6. Run test again (confirm still passes)
```
- Context: Any new feature or bug fix
- No permission needed: TDD is the defined methodology

---

## 📊 Pattern Recognition Summary

**Success Patterns (78% → 85% improvement):**
- Evidence-based validation (not claims)
- File routing enforcement (artifacts/ structure)
- Multi-agent cross-checking (95% confidence)
- Hooks execution (31 session snapshots)
- Root cause fixes (not workarounds)

**Failure Patterns (35% → 78% recovery needed):**
- Theater behavior (claim vs reality gap)
- Root file violations (chaos before cleanup)
- Permission-seeking on defined tasks (delays)
- Mock testing (false confidence)
- Shortcut-taking under pressure (compounds issues)

**Autonomous Decision Criteria:**
- ✅ Task has clear completion criteria → Execute verification autonomously
- ✅ Error/failure encountered → Execute root cause analysis autonomously
- ✅ Agent handoff needed → Execute memory coordination autonomously
- ✅ Session lifecycle event → Execute hooks autonomously
- ❌ Multiple valid approaches with trade-offs → Ask for preference
- ❌ Deleting/restructuring working code → Ask permission
- ❌ Changing core business logic → Ask permission

---

## 🎯 Wizard Application

**When spawning hives/swarms:**
1. Include these rules in agent instructions
2. Emphasize EXECUTE patterns (reduce permission-seeking)
3. Require ALWAYS patterns (prevent common failures)
4. Forbid NEVER patterns (eliminate known anti-patterns)

**Expected outcome:**
- Faster execution (no permission delays on defined tasks)
- Higher quality (verification built-in, not optional)
- Better coordination (memory + hooks standard practice)
- Honest reporting (evidence required, theater punished)

**Wizard integration:**
```bash
# Pass rules to hive initialization
npx claude-flow@alpha hive-mind:wizard \
  --rules "sessions/session-20251117-100232-docs-refactor-tutor/workspace-audit/wizard-rules.md" \
  --enforce-always \
  --forbid-never \
  --autonomous-execute
```

---

**Rules extracted from:**
- 360 files audited (88,471 lines)
- 31 session snapshots analyzed
- 2 major sessions (Dream Hive, Inbox Cleanup)
- Evidence-based pattern recognition (95% confidence)
