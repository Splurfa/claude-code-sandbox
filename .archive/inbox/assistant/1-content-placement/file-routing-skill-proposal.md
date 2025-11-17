# File Routing Skill Proposal

**Date**: 2025-11-16
**Session**: session-20251116-084306-system-hygiene-check
**Status**: HITL Review Required

## Executive Summary

The file-routing skill currently provides general guidance for session artifact placement but lacks **specific rules for distinguishing user-facing guides from system development work**. This proposal adds clear routing logic to align with user preferences:

- **docs/guides/**: USER-FACING guides only (how features work for users)
- **inbox/assistant/**: Architectural problems, system integration work, "working on the system"
- **Session artifacts**: Implementation work, testing, proposals, analysis

## Current State Analysis

### What the Skill Does Well

1. ✅ Clear session artifact structure (`sessions/$SESSION_ID/artifacts/{type}/`)
2. ✅ Strong "don't pollute root" messaging
3. ✅ Good self-check questions for AI agents
4. ✅ Explicit user vs AI distinction

### What's Missing

1. ❌ **No guidance on docs/guides/ vs inbox/assistant/ distinction**
2. ❌ **No examples of "user-facing" vs "system development" content**
3. ❌ **No decision tree for "where does this doc go?"**
4. ❌ **No guardrails against putting system work in docs/guides/**

## Content Placement Rules (From User)

### User-Facing Content → `docs/guides/`

**Characteristics:**
- End-user documentation
- How-to guides for using features
- Feature explanations for users
- Getting started guides
- Troubleshooting (user perspective)

**Examples:**
- "How to use session management"
- "Integration testing guide" (how to run tests)
- "Quick start guide"
- "API reference for users"

### System Development Work → `inbox/assistant/`

**Characteristics:**
- Architectural problems to solve
- System integration work
- "Working on the system" itself
- Internal development discussions
- Technical debt analysis
- Refactoring proposals

**Examples:**
- "File routing skill needs updating"
- "Session protocol contradictions"
- "AgentDB integration architecture"
- "Hook system refactoring proposal"
- "Code quality analysis reports"

### Implementation/Proposals → Session Artifacts

**Characteristics:**
- Active development work
- Testing and validation
- Proposals requiring HITL review
- Analysis and research outputs

**Examples:**
- This document itself
- Test implementations
- Code prototypes
- Performance analysis reports

## Proposed Changes

### 1. Add Content Type Decision Tree

**Add to README.md after line 12 (Quick Lookup Table):**

```markdown
## Content Type Decision Tree

Before creating documentation, ask:

### 1. Is this explaining a feature to users?
   - YES → `docs/guides/` (user-facing)
   - NO → Continue to question 2

### 2. Is this architectural/system development work?
   - YES → `inbox/assistant/` (system work)
   - NO → Continue to question 3

### 3. Is this proposal/analysis requiring HITL review?
   - YES → `sessions/$SESSION_ID/artifacts/docs/` (active work)
   - NO → Ask user for clarification

### Examples by Type

**User-Facing Guides (`docs/guides/`):**
- ✅ How to run integration tests
- ✅ Session management user guide
- ✅ Quick start tutorial
- ✅ Troubleshooting common errors
- ✅ API reference for end users

**System Development (`inbox/assistant/`):**
- ✅ File routing skill needs updating
- ✅ Session protocol contradictions
- ✅ Hook system architecture proposal
- ✅ AgentDB integration analysis
- ✅ Technical debt assessment

**Active Work (`sessions/$SESSION_ID/artifacts/docs/`):**
- ✅ Code quality analysis (this session)
- ✅ Feature implementation proposals
- ✅ Testing results and reports
- ✅ Research findings
- ✅ HITL review packages
```

### 2. Update Quick Lookup Table

**Current (line 7-13):**
```markdown
| What You're Creating | Correct Location | Wrong Location |
|---------------------|------------------|----------------|
| Source code | `sessions/$SESSION_ID/artifacts/code/` | `code/`, `/src/`, root |
| Test files | `sessions/$SESSION_ID/artifacts/tests/` | `tests/`, `__tests__/`, root |
| Documentation | `sessions/$SESSION_ID/artifacts/docs/` | `docs/`, root |
| Build scripts | `sessions/$SESSION_ID/artifacts/scripts/` | `scripts/`, root |
| Notes, ideas | `sessions/$SESSION_ID/artifacts/notes/` | `notes/`, root |
```

**Proposed (replace above):**
```markdown
| What You're Creating | Correct Location | Wrong Location |
|---------------------|------------------|----------------|
| Source code | `sessions/$SESSION_ID/artifacts/code/` | `code/`, `/src/`, root |
| Test files | `sessions/$SESSION_ID/artifacts/tests/` | `tests/`, `__tests__/`, root |
| **User-facing guides** | `docs/guides/` | `sessions/*/docs/`, `inbox/`, root |
| **System development docs** | `inbox/assistant/` | `docs/guides/`, `sessions/*/docs/` |
| **Proposals/analysis** | `sessions/$SESSION_ID/artifacts/docs/` | `docs/`, root |
| Build scripts | `sessions/$SESSION_ID/artifacts/scripts/` | `scripts/`, root |
| Notes, ideas | `sessions/$SESSION_ID/artifacts/notes/` | `notes/`, root |
```

### 3. Add Guardrails Section

**Add new section after "Common Mistakes to Avoid" (after line 60):**

```markdown
## Documentation Guardrails

### ⚠️ Critical Distinction: User vs System Content

**Rule:** `docs/guides/` is for END USERS, not system development

### ❌ Wrong: System work in docs/guides/
```
docs/guides/
  file-routing-skill-analysis.md     # System development, not user guide!
  session-protocol-refactoring.md    # Internal work, not user-facing!
  agentdb-integration-proposal.md    # Architecture work, not user guide!
```

### ✅ Correct: System work in inbox/assistant/
```
inbox/assistant/
  file-routing-skill-needs-update.md   # Architectural problem
  session-protocol-contradictions.md   # System integration issue
  agentdb-integration-architecture.md  # Working on the system
```

### ✅ Correct: User guides in docs/guides/
```
docs/guides/
  getting-started/
    quick-start.md                     # How users start using features
  how-to/
    run-integration-tests.md           # How users run tests
  concepts/
    session-management-explained.md    # What sessions are (user view)
  troubleshooting/
    common-errors.md                   # User troubleshooting
```

### Decision Questions for docs/guides/

Before creating content in `docs/guides/`, ask:

1. **Audience Test**: Is the primary audience an end user?
   - NO → Use `inbox/assistant/` or session artifacts

2. **Purpose Test**: Does this explain HOW to use a feature?
   - NO → Use `inbox/assistant/` or session artifacts

3. **Scope Test**: Is this about the feature, not the codebase?
   - NO → Use `inbox/assistant/` or session artifacts

**All three must be YES for `docs/guides/` placement.**
```

### 4. Update Self-Check Questions

**Current (line 64-76):**
```markdown
Before creating a file, ask:

1. **Is this an existing file I'm editing?**
   - YES → Use its current location
   - NO → Continue to question 2

2. **Is this session work (code, tests, docs, scripts, notes)?**
   - YES → Use `sessions/$SESSION_ID/artifacts/{type}/`
   - NO → Ask user where it should go

3. **Am I certain of the session ID?**
   - YES → Proceed with session path
   - NO → Check `.current-session` file or environment variable
```

**Proposed (replace above):**
```markdown
Before creating a file, ask:

1. **Is this an existing file I'm editing?**
   - YES → Use its current location
   - NO → Continue to question 2

2. **Is this documentation?**
   - NO → Continue to question 5
   - YES → Continue to question 3

3. **Is this a user-facing guide?** (How to use features, end-user docs)
   - YES → Use `docs/guides/{category}/`
   - NO → Continue to question 4

4. **Is this system/architectural work?** (Working on the system itself)
   - YES → Use `inbox/assistant/`
   - NO → Use `sessions/$SESSION_ID/artifacts/docs/`

5. **Is this session work (code, tests, scripts, notes)?**
   - YES → Use `sessions/$SESSION_ID/artifacts/{type}/`
   - NO → Ask user where it should go

6. **Am I certain of the session ID?**
   - YES → Proceed with session path
   - NO → Check `.current-session` file or environment variable
```

### 5. Add Examples Section

**Add new section before "Why This Matters" (before line 97):**

```markdown
## Real-World Routing Examples

### Scenario 1: Integration Testing Documentation

**Question:** Where does "How to run integration tests" go?

**Analysis:**
- Audience: End users who want to test
- Purpose: Explains HOW to use testing features
- Scope: About the feature, not the codebase

**Answer:** `docs/guides/how-to/run-integration-tests.md` ✅

---

### Scenario 2: File Routing Skill Analysis

**Question:** Where does "File routing skill needs updating" go?

**Analysis:**
- Audience: System developers
- Purpose: Architectural problem identification
- Scope: Working on the system itself

**Answer:** `inbox/assistant/file-routing-skill-update-needed.md` ✅

---

### Scenario 3: Code Quality Analysis Report

**Question:** Where does code quality analysis for current session go?

**Analysis:**
- Audience: HITL review (user + system)
- Purpose: Analysis requiring review
- Scope: Active session work

**Answer:** `sessions/$SESSION_ID/artifacts/docs/code-quality-report.md` ✅

---

### Scenario 4: Session Management User Guide

**Question:** Where does "Understanding session lifecycle" go?

**Analysis:**
- Audience: End users
- Purpose: Explains what sessions are and how they work
- Scope: Feature explanation

**Answer:** `docs/guides/concepts/session-management.md` ✅

---

### Scenario 5: AgentDB Integration Architecture

**Question:** Where does AgentDB integration proposal go?

**Analysis:**
- Audience: System developers
- Purpose: Architectural integration work
- Scope: Working on the system

**Answer:** `inbox/assistant/agentdb-integration-architecture.md` ✅
```

## Validation Criteria

### Post-Implementation Validation

After updating the file-routing skill, validate with these scenarios:

#### Test Case 1: User Guide Routing
**Input:** "Create a guide for users on how to use the session management feature"
**Expected:** `docs/guides/how-to/use-session-management.md`
**Why:** User-facing, explains HOW to use feature

#### Test Case 2: System Problem Routing
**Input:** "Analyze the session protocol for contradictions"
**Expected:** `inbox/assistant/session-protocol-contradictions.md`
**Why:** System work, architectural problem

#### Test Case 3: Session Work Routing
**Input:** "Create proposal for file routing skill updates"
**Expected:** `sessions/$SESSION_ID/artifacts/docs/file-routing-proposal.md`
**Why:** Active work requiring HITL review

#### Test Case 4: Ambiguous Content Routing
**Input:** "Document the hook system architecture"
**Expected:** AI asks clarification: "Is this for end users (how to use hooks) or system work (how hooks are implemented)?"

### Success Metrics

✅ **Routing accuracy**: 100% of test cases route correctly
✅ **Guardrail effectiveness**: No system work in `docs/guides/`
✅ **Decision clarity**: AI agents can self-route without asking
✅ **User override**: Users can still write anywhere (no restrictions)

## Implementation Checklist

- [ ] Update README.md Quick Lookup Table
- [ ] Add Content Type Decision Tree
- [ ] Add Documentation Guardrails section
- [ ] Update Self-Check Questions
- [ ] Add Real-World Routing Examples
- [ ] Update SKILL.md frontmatter if needed
- [ ] Test routing with validation scenarios
- [ ] User HITL review and approval
- [ ] Document changes in session summary

## Specific Text Changes

### Change 1: Quick Lookup Table (README.md, line 7-13)

**Before:**
```markdown
| Documentation | `sessions/$SESSION_ID/artifacts/docs/` | `docs/`, root |
```

**After:**
```markdown
| **User-facing guides** | `docs/guides/` | `sessions/*/docs/`, `inbox/`, root |
| **System development docs** | `inbox/assistant/` | `docs/guides/`, `sessions/*/docs/` |
| **Proposals/analysis** | `sessions/$SESSION_ID/artifacts/docs/` | `docs/`, root |
```

### Change 2: Self-Check Questions (README.md, line 64-76)

**Before:**
```markdown
2. **Is this session work (code, tests, docs, scripts, notes)?**
   - YES → Use `sessions/$SESSION_ID/artifacts/{type}/`
   - NO → Ask user where it should go
```

**After:**
```markdown
2. **Is this documentation?**
   - NO → Continue to question 5
   - YES → Continue to question 3

3. **Is this a user-facing guide?** (How to use features, end-user docs)
   - YES → Use `docs/guides/{category}/`
   - NO → Continue to question 4

4. **Is this system/architectural work?** (Working on the system itself)
   - YES → Use `inbox/assistant/`
   - NO → Use `sessions/$SESSION_ID/artifacts/docs/`

5. **Is this session work (code, tests, scripts, notes)?**
   - YES → Use `sessions/$SESSION_ID/artifacts/{type}/`
   - NO → Ask user where it should go
```

### Change 3: Add New Section (README.md, after line 60)

**Insert entire "Documentation Guardrails" section** (see Proposed Changes #3 above)

### Change 4: Add New Section (README.md, after line 96)

**Insert entire "Real-World Routing Examples" section** (see Proposed Changes #5 above)

### Change 5: Add New Section (README.md, after line 12)

**Insert entire "Content Type Decision Tree" section** (see Proposed Changes #1 above)

## Risks and Considerations

### Risk 1: Overcomplication
**Mitigation:** Examples section provides concrete guidance; decision tree is hierarchical

### Risk 2: User Confusion
**Mitigation:** Explicit "users can write anywhere" messaging preserved

### Risk 3: Edge Cases
**Mitigation:** Added "ask user" fallback in decision tree

### Risk 4: AI Hesitation
**Mitigation:** Clear decision criteria reduce uncertainty; examples show common patterns

## Next Steps

1. **HITL Review** (REQUIRED)
   - User reviews this proposal
   - User approves/requests changes
   - User explicitly authorizes skill file edits

2. **Implementation** (After approval)
   - Apply text changes to README.md
   - Validate with test cases
   - Update related documentation

3. **Testing** (Post-implementation)
   - Run validation scenarios
   - Monitor routing decisions in next sessions
   - Iterate based on real-world usage

## Conclusion

The file-routing skill provides excellent session artifact guidance but lacks specific rules for **distinguishing user-facing guides from system development work**. These proposed changes:

1. **Add clear decision criteria** for docs/guides/ vs inbox/assistant/ vs session artifacts
2. **Provide guardrails** against system work in user documentation
3. **Include concrete examples** for common routing scenarios
4. **Preserve user freedom** while guiding AI agent decisions

**Status:** Awaiting HITL review and approval before implementation.

---

**Related Files:**
- `.claude/skills/file-routing/SKILL.md`
- `.claude/skills/file-routing/README.md`
- `CLAUDE.md` (session management protocol)
- `inbox/assistant/` (system work destination)
- `docs/guides/` (user guide destination)
