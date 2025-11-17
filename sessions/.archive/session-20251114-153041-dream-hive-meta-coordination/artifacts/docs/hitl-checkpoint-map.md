# HITL Checkpoint Map - Dream Hive Implementation

## Overview

This document defines the 4 Human-In-The-Loop validation gates that pause execution for user review and approval during Dream Hive implementation.

**Philosophy:** Simple approval gates that ensure we're building the RIGHT thing, not complex review processes.

---

## Checkpoint #1: North Star Validation

**When:** After Phase 0 (North Star + 100% Definition)

**What User Reviews:**
1. `north-star.md` - Vision, principles, scope boundaries
2. `100-percent-definition.md` - Concrete completion criteria

**Why This Matters:**
Ensures we're building the RIGHT thing before any code is written. If the vision is wrong, everything downstream will be wrong.

**User Approves:**
- [ ] Scope is correct (stock-first, no enterprise features)
- [ ] Principles align with intentions (time-neutral, scale-agnostic, stock-first)
- [ ] Success criteria are measurable and achievable
- [ ] 100% definition provides clear validation rules

**Presentation Format:**
```
=== CHECKPOINT #1: North Star Validation ===

I've created the North Star and 100% Definition documents.

📄 North Star (north-star.md):
   - Vision: [1-sentence summary]
   - Key Principles: [list 3 principles]
   - Scope: [what's in, what's out]

📄 100% Definition (100-percent-definition.md):
   - Completion Criteria: [5-7 checkboxes]
   - Validation Method: [how we'll prove it]

Does this match your intention for Dream Hive?
- Type "approved" to proceed to Phase 1
- Type "revise [feedback]" to update the vision
```

**If Rejected:**
- Update north-star.md and/or 100-percent-definition.md based on feedback
- Re-present for approval
- Do NOT proceed until approved

---

## Checkpoint #2: Documentation Review

**When:** After Phase 1 (Documentation Structure)

**What User Reviews:**
1. Directory tree showing all folders
2. Content of every `README.md` file
3. Inline documentation in `.claude/` structure

**Why This Matters:**
Documentation IS the interface for AI-human collaboration. If READMEs are unclear, natural language commands won't work.

**User Approves:**
- [ ] Each folder has a clear README explaining its purpose
- [ ] README content matches the folder's actual function
- [ ] Documentation is simple and jargon-free
- [ ] Structure is intuitive and discoverable

**Presentation Format:**
```
=== CHECKPOINT #2: Documentation Review ===

I've created the complete documentation structure:

📁 Directory Tree:
.swarm/
  ├── README.md (AgentDB + memory overview)
  ├── memory.db (created by hooks)
  └── backups/
      └── README.md (session snapshots)
sessions/
  ├── README.md (session artifacts)
  └── captains-log/
      └── README.md (journal entries)
.claude/
  ├── README.md (agent patterns)
  └── agents/
      └── README.md (natural language commands)
inbox/
  └── README.md (incoming items)

📄 Key README Highlights:
   - .swarm/README.md: [1-line purpose]
   - sessions/README.md: [1-line purpose]
   - .claude/agents/README.md: [1-line purpose]

Review each README file to ensure clarity.
- Type "approved" to proceed to Phase 2
- Type "revise [folder] [feedback]" to update specific READMEs
```

**If Rejected:**
- Update specified README.md files
- Re-present modified documentation
- Do NOT proceed until all READMEs are approved

---

## Checkpoint #3: Agent Pattern Validation

**When:** After Phase 2 (Agent Patterns)

**What User Reviews:**
1. All `.claude/agents/*.md` pattern files
2. Natural language invocation examples
3. Demonstration of pattern activation

**Why This Matters:**
These patterns define HOW the system responds to natural language. If patterns don't work as expected, the UX is broken.

**User Approves:**
- [ ] Agent patterns use natural, conversational language
- [ ] Invocation examples are realistic and intuitive
- [ ] Pattern responses match expected behavior
- [ ] No over-engineered or complex activation syntax

**Presentation Format:**
```
=== CHECKPOINT #3: Agent Pattern Validation ===

I've created agent patterns for natural language activation:

📄 Agent Patterns Created:
   1. .claude/agents/session-closeout.md
      Invocation: "Close out this session"
      Behavior: Generates summary, runs hooks, archives to .swarm/backups/

   2. .claude/agents/captains-log-entry.md
      Invocation: "Add to captain's log: [entry]"
      Behavior: Appends to sessions/captains-log/YYYY-MM-DD.md

   3. .claude/agents/session-restore.md
      Invocation: "Restore session [id]"
      Behavior: Loads from .swarm/backups/[session].json

🎯 Live Demonstration:
   User: "Close out this session"
   → Agent recognizes pattern
   → Generates session-summary.md
   → Runs: npx claude-flow@alpha hooks session-end
   → Archives to .swarm/backups/session-YYYYMMDD-HHMMSS.json
   → Confirms: "Session archived to .swarm/backups/..."

Try invoking one of these patterns to test.
- Type "approved" to proceed to Phase 3
- Type "revise [pattern] [feedback]" to update specific patterns
```

**If Rejected:**
- Update specified agent pattern files
- Revise invocation syntax or behavior
- Re-demonstrate with corrected patterns
- Do NOT proceed until patterns work as intended

---

## Checkpoint #4: Final Validation

**When:** After Phase 3 (Validation & Testing)

**What User Reviews:**
1. Test results (all tests passing)
2. Compliance audit results (100% definition met)
3. Evidence of completion

**Why This Matters:**
This is the proof that "100% complete" is TRUE, not aspirational. No shipping until validated.

**User Approves:**
- [ ] All validation tests pass
- [ ] Every item in 100% definition is checked
- [ ] Evidence supports completion claims
- [ ] No critical gaps or missing functionality

**Presentation Format:**
```
=== CHECKPOINT #4: Final Validation ===

Validation complete. Here are the results:

✅ Test Results:
   - Automated Tests: 12/12 passing
   - Integration Tests: 5/5 passing
   - Pattern Recognition: 3/3 patterns work correctly

✅ Compliance Audit (100% Definition):
   [X] Stock claude-flow infrastructure only
   [X] AgentDB + ReasoningBank configured
   [X] Natural language session commands work
   [X] Captain's log entries function correctly
   [X] Session backups archive properly
   [X] All folders have README.md files
   [X] Documentation is clear and complete

📊 Evidence:
   - Session closeout test: .swarm/backups/test-session.json exists
   - Captain's log test: sessions/captains-log/2025-11-14.md created
   - Memory query test: AgentDB returns correct results
   - Pattern test: "Close out this session" triggers correct hook

Completion Score: 100%

Review the evidence and test results.
- Type "approved" to mark Dream Hive as COMPLETE
- Type "gaps [issue]" if you find missing functionality
```

**If Rejected:**
- Address identified gaps or failures
- Re-run validation tests
- Re-present with corrected results
- Do NOT claim completion until 100% validated

---

## Checkpoint Quick Reference

| Gate | Phase | Focus | Format |
|------|-------|-------|--------|
| #1 | After Phase 0 | Vision & Scope | Review 2 docs, approve/revise |
| #2 | After Phase 1 | Documentation | Review all READMEs, approve/revise |
| #3 | After Phase 2 | Agent Patterns | Demo invocations, approve/revise |
| #4 | After Phase 3 | Validation Proof | Review test results, approve/gaps |

---

## Critical Rules

1. **No Skipping:** Every checkpoint MUST get user approval before proceeding
2. **No Auto-Approval:** Queen Hive cannot approve on user's behalf
3. **Evidence Required:** Claims need proof (test results, created files, demonstrations)
4. **Simple Language:** No technical jargon in approval requests
5. **Clear Actions:** User knows exactly what to type ("approved" or "revise [feedback]")

---

## Success Metrics

- [ ] User understands what they're approving at each gate
- [ ] Approval format is simple (type one word + optional feedback)
- [ ] Rejections are actionable (clear what needs fixing)
- [ ] No gate is a surprise (user knows checkpoints exist upfront)
