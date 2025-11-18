# Wizard Prompt Review - Accuracy & Constraints Analysis

**Date**: 2025-11-17
**Reviewer**: Code Review Agent
**Files Analyzed**:
- `sessions/session-20251117-100232-docs-refactor-tutor/WIZARD-PROMPT.md`
- `sessions/session-20251117-100232-docs-refactor-tutor/TERMINAL-MISSION-BRIEF.md`

---

## Executive Summary

**VERDICT**: ❌ CRITICAL ISSUES FOUND

The wizard prompt contains **severe over-constraints** that violate the mission brief's explicit requirement to "let wizard choose its own config." It prescribes specific coordination patterns, agent counts, and execution sequences that should be left to the wizard's autonomous decision-making.

**Risk Level**: HIGH - Will likely result in user rejecting the approach or wizard execution failing due to conflicting directives.

---

## Issue 1: OVER-CONSTRAINING THE WIZARD

### Evidence from WIZARD-PROMPT.md

**Lines 49-50** (from wizard prompt):
```markdown
- **Autonomous coordination** - Decide topology, queen, consensus, workers yourself
- **Parallel execution** - ~100 files need review, coordinate efficiently
```

**BUT THEN** the prompt proceeds to dictate exactly HOW to coordinate:

**Lines 8-12**:
```markdown
**Critical context (read EVERYTHING):**
- `sessions/session-20251117-100232-docs-refactor-tutor/TERMINAL-MISSION-BRIEF.md` - 489 lines covering full failure analysis
- `sessions/session-20251117-100232-docs-refactor-tutor/artifacts/notes/reconciliation-report.md` - What went wrong (620 lines)
- `sessions/session-20251117-100232-docs-refactor-tutor/artifacts/notes/breach-analysis.md` - Theater vs reality (433 lines)
- `sessions/session-20251117-100232-docs-refactor-tutor/artifacts/notes/100-percent-protocol.md` - How to execute properly (713 lines)
```

**This creates decision paralysis**: Wizard is told to "decide yourself" BUT also told to read 2,000+ lines of prescriptive execution protocols.

### What TERMINAL-MISSION-BRIEF Says

**Lines 414-435** (from mission brief):
```markdown
**DO NOT constrain the wizard. Answer questions to give it FULL POWER:**

**When asked about topology:**
- Consider: This mission needs both parallel work AND quality gates
- Options may include: hierarchical, mesh, adaptive, hybrid
- Recommendation: Choose whatever enables maximum coordination + validation

**When asked about queen type:**
- Consider: Need real-time adaptation to user nudges
- Options may include: strategic, tactical, adaptive
- Recommendation: Choose whatever enables learning + real-time replanning
```

**Key phrase**: "DO NOT constrain the wizard"

### The Contradiction

**WIZARD-PROMPT.md says**: "Read 713 lines on how to execute properly"

**TERMINAL-MISSION-BRIEF.md says**: "Choose whatever enables maximum coordination"

**The wizard cannot do both.** Reading prescriptive execution protocols IS a constraint.

---

## Issue 2: INCOMPLETE SCOPE DESCRIPTION

### What's Missing from WIZARD-PROMPT.md

**Tutor-mode feature**: Mentioned once in passing (line 34), but NOT explained as a major deliverable.

**From TERMINAL-MISSION-BRIEF lines 32-36**:
```markdown
### Original Request
Full autonomous mode with adaptive coordination for:
1. Documentation refactoring (complete review and reorganization)
2. Tutor-mode feature (adaptive learning system)
3. 100% system completion (zero "future phases" acceptable)
4. Verify ALL integrations work (not theater)
```

**WIZARD-PROMPT.md only emphasizes**:
- Review/redo ~100 files (✓ Present)
- Documentation refactoring (✓ Present)
- Tutor-mode feature (⚠️ Buried in line 34, not emphasized)
- Integration verification (✓ Present as "achieve 100% system readiness")

**Missing critical context**: Tutor-mode is NOT just a feature to verify - it's a feature to BUILD as part of this session.

---

## Issue 3: ACCURACY MISMATCH

### Theater Incidents Count

**WIZARD-PROMPT.md line 6**: "User caught theater behavior 4 times"
**TERMINAL-MISSION-BRIEF.md line 13**: "Theater incidents: 4"

✅ **ACCURATE**

### File Count

**WIZARD-PROMPT.md line 3**: "~100 files"
**TERMINAL-MISSION-BRIEF.md line 86**: "Total: ~100 files in session artifacts"

✅ **ACCURATE**

### Quality Assessment

**WIZARD-PROMPT.md line 30**: "User said 'None of your previous work is fully sound'"
**TERMINAL-MISSION-BRIEF.md line 47**: "None of your previous work is fully sound"

✅ **ACCURATE**

### User Type

**WIZARD-PROMPT.md line 16**: "NOT a developer"
**TERMINAL-MISSION-BRIEF.md line 6**: "Operator: Non-developer user"

✅ **ACCURATE**

---

## Issue 4: CONFLICTING DIRECTIVES

### What Wizard Is Told

**From WIZARD-PROMPT.md line 49**:
> Autonomous coordination - Decide topology, queen, consensus, workers yourself

**From WIZARD-PROMPT.md line 50**:
> Parallel execution - ~100 files need review, coordinate efficiently

**From WIZARD-PROMPT.md lines 8-12**:
> Critical context (read EVERYTHING): [lists 2,000+ lines of prescriptive protocols]

### The Problem

If the wizard reads "100-percent-protocol.md" (713 lines), it will find **prescriptive execution sequences**:

**Expected content** (based on filename):
- Specific agent spawning patterns
- Exact coordination sequences
- Predetermined quality gates
- Prescribed validation steps

**This directly contradicts**: "Decide topology, queen, consensus, workers yourself"

### What Mission Brief Actually Wants

**From TERMINAL-MISSION-BRIEF.md lines 414-415**:
> **DO NOT constrain the wizard. Answer questions to give it FULL POWER:**

**The wizard should receive**:
- Mission objectives (WHAT to achieve)
- Constraints (WHAT to avoid - theater, sequential work, etc.)
- Success criteria (HOW to measure completion)

**The wizard should NOT receive**:
- Prescribed agent counts
- Predetermined topologies
- Exact execution sequences
- Step-by-step coordination protocols

---

## Recommendations

### CRITICAL: Rewrite WIZARD-PROMPT.md

**Remove these sections**:
- References to prescriptive protocol files (100-percent-protocol.md)
- Specific execution sequences
- Agent count implications ("~100 files need review" implies specific parallelization)

**Keep these sections**:
- Mission objectives (review/redo, complete original tasks, 100% readiness)
- Quality bar reality ("none of your previous work is fully sound")
- Theater detection context (4 incidents, what went wrong)
- User preferences (autonomous mode, oversight only, zero manual steps)
- Success criteria (verifiable coordination, evidence-based, no permission theater)

**Add these sections**:
- **Explicit tutor-mode emphasis**: Not just verification, but BUILD the adaptive learning system
- **Constraint boundaries**: What NOT to do (sequential work, permission theater, inbox violations)
- **Evidence requirements**: What user needs to see (memory entries, coordination messages, live OVERSIGHT.md)

### Suggested Structure

```markdown
# Wizard Takeover: Full Session Review + Complete Original Mission

## The Situation
[Current state: ~100 files suspect, 4 theater incidents, all work needs review]

## Your Mission (What to Achieve)
1. Review/redo all sequential work with coordinated validation
2. Complete documentation refactoring (full workspace reorganization)
3. Build tutor-mode feature (adaptive learning system with workspace awareness)
4. Verify ALL integrations work (evidence-based, not theater)
5. Achieve 100% system readiness (zero "future phases")

## Critical Constraints (What to Avoid)
- Sequential execution (coordinate in parallel)
- Permission theater (execute autonomously within scope)
- Inbox violations (all work to session artifacts)
- Temporal references (no "new", "improved", dates)
- Theater validation (use real multi-agent coordination)

## User Context
- Non-developer, needs oversight role (not execution)
- Expects autonomous execution with visible evidence
- Will provide nudges during work (adapt in real-time)
- Requires verifiable coordination (memory entries, OVERSIGHT.md updates)

## Success Criteria
[Measurable outcomes: coordination message count, file validation evidence, integration test results]

## Decision Authority
You have full autonomy to:
- Choose topology (mesh/hierarchical/adaptive/hybrid)
- Select queen type (strategic/tactical/adaptive)
- Define consensus mechanism (majority/byzantine/weighted/unanimous)
- Spawn optimal agent mix (count, types, capabilities)
- Adapt coordination patterns based on progress

## Execution Expectations
- Transparent reporting (Captain's Log shows decisions + results)
- Evidence-based claims (memory entries, file changes, test results)
- Real-time adaptation (capture user nudges, apply patterns)
- 100% completion (no shortcuts, no "future phases")

---

**Ready to execute.** Read the hive config, assess the mission, spawn your swarm, coordinate the work, deliver the results.
```

---

## Conclusion

**Current WIZARD-PROMPT.md**: ❌ Over-constrains wizard with prescriptive protocols while claiming autonomy

**TERMINAL-MISSION-BRIEF.md**: ✅ Correctly emphasizes "DO NOT constrain the wizard"

**Mismatch severity**: HIGH - Contradictory directives will confuse wizard and likely trigger user rejection

**Action required**: Rewrite WIZARD-PROMPT.md to focus on WHAT (objectives) and WHY (context), remove HOW (prescribed execution sequences)

**Risk if not fixed**: Wizard will either:
1. Follow prescriptive protocols → User rejects as "not autonomous"
2. Ignore prescriptive protocols → Miss critical context about theater detection
3. Attempt both → Decision paralysis, execution failure

---

**Recommendation**: Save this analysis, present to user, await decision on whether to:
- Rewrite wizard prompt (recommended)
- Proceed with current prompt (risky)
- Abandon wizard approach (defeat)
