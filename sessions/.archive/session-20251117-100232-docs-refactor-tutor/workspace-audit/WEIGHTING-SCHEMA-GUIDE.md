# Wizard Decision-Making Weighting Schema Guide

**Version:** 1.0.0
**Generated:** 2025-11-17
**Basis:** Workspace Infrastructure Audit (360 files, 88,471 lines)

---

## Purpose

This schema provides the wizard (queen-coordinator) with a systematic framework for determining:

1. **Which files to reference** when answering user queries
2. **How much confidence** to have in each file's information
3. **What adaptations to make** when translating prescriptive content to parallel execution
4. **When to exclude files** from consideration entirely

---

## Core Scoring Dimensions

### 1. Prescriptiveness (35% weight)

**What it measures:** How much content dictates specific actions vs provides information.

| Score | Description | Example |
|-------|-------------|---------|
| 0-25 | Purely informational | "The session system organizes work by conversation" |
| 26-50 | Mix of description + soft recommendations | "Sessions help organize work. Consider using them for..." |
| 51-75 | Prescriptive guidance and workflows | "Follow these steps to create a session..." |
| 76-100 | Rigid protocols with MUST/NEVER | "You MUST create sessions. NEVER work in root." |

**Impact:** High prescriptiveness = Lower confidence ceiling (capped at 55% for rigid protocols)

**Reasoning:** Wizard operates in parallel execution mode. Sequential "do step A then B" content conflicts with wizard's "do A, B, C all at once" paradigm.

---

### 2. Temporal Stability (25% weight)

**What it measures:** How likely content is to become outdated.

| Score | Description | Example |
|-------|-------------|---------|
| 0-25 | Highly volatile | "Current session is session-20251117-..." |
| 26-50 | Medium stability | "Use claude-flow@alpha hooks command" (API may change) |
| 51-75 | Stable concepts | "Hierarchical topology has coordinators at top" |
| 76-100 | Timeless | "SPARC = Specification, Pseudocode, Architecture..." |

**Impact:** Low stability = Higher risk of wizard giving outdated advice.

**Reasoning:** Wizard should favor timeless concepts over implementation details that may drift.

---

### 3. User Authority (30% weight)

**What it measures:** Whether content reflects user intent vs assistant interpretation.

| Score | Description | Example |
|-------|-------------|---------|
| 0-25 | Assistant-generated | Research reports, analysis documents |
| 26-50 | Collaborative | User edits assistant-drafted docs |
| 51-75 | User-reviewed | Assistant work explicitly approved by user |
| 76-100 | User-authored | CLAUDE.md, .mcp.json, package.json |

**Impact:** User-authored = 100% confidence. Assistant-generated capped at 65% unless verified.

**Reasoning:** User configuration is supreme authority. Wizard always defers to user intent.

---

### 4. Contextual Scope (10% weight)

**What it measures:** How broadly applicable vs narrowly scoped.

| Score | Description | Example |
|-------|-------------|---------|
| 0-25 | Session-specific | "In this session we analyzed..." |
| 26-50 | Task-specific | "When building REST APIs..." |
| 51-75 | Project-wide | "This workspace uses SPARC methodology" |
| 76-100 | Universal | "Test-driven development means..." |

**Impact:** Narrow scope = Not applicable to wizard's cross-session queries.

**Reasoning:** Wizard answers general questions. Session-specific content excluded by default.

---

## Weighted Score Formula

```
Weighted Score = (Prescriptiveness × 0.35) +
                 (Temporal Stability × 0.25) +
                 (User Authority × 0.30) +
                 (Contextual Scope × 0.10)
```

### Classification Thresholds

| Weighted Score | Classification | Confidence Ceiling | Wizard Action |
|----------------|----------------|-------------------|---------------|
| **≥ 70** | **SAFE** | 85-100% | Reference directly without caveats |
| **40-69** | **CAUTIONARY** | 40-84% | Reference with verification warnings |
| **< 40** | **EXCLUDE** | 0-39% | Do not reference in wizard context |

---

## Special Handling Rules

### 🔴 Sequential Work Protocols (Confidence Ceiling: 55%)

**Pattern:** Step-by-step tutorials with MUST/NEVER language

**Examples:**
- `docs/tutorials/**`
- `docs/how-to/**`
- Session closeout procedures

**Why capped at 55%:**
- Prescriptive sequential steps conflict with wizard's parallel execution
- Wizard must **extract principles, not copy procedures**

**Wizard Adaptation Required:**
```
❌ Tutorial says: "1. Create file A, 2. Then create file B, 3. Then test"
✅ Wizard does:   [Single message] Write A, Write B, Run tests (parallel)
```

---

### 🟢 User Configuration (Confidence: 100%)

**Files:**
- `CLAUDE.md`
- `~/.claude/CLAUDE.md`
- `.mcp.json`
- `package.json`

**Why 100% confidence:**
- Direct user intent
- Supreme authority over all other sources
- Configuration overrides documentation

**Example:**
- Doc says: "Use `git add -A`"
- CLAUDE.md says: "NEVER use `git add -A`"
- **Wizard follows CLAUDE.md**

---

### 🟡 READ-ONLY Zones (Confidence Ceiling: 60%)

**Locations:**
- `inbox/codex-agent/**`
- `inbox/cursor-agent/**`
- `.swarm/backups/**`
- `.swarm/memory.db*`

**Why cautionary:**
- External agent content (informational, not authoritative)
- Immutable snapshots (historical, not current)
- Binary databases (not human-editable)

**Wizard Guidance:** Reference for context only, never as source of truth.

---

### 🔴 Session Artifacts (Confidence Ceiling: 25% - Usually EXCLUDE)

**Pattern:** `sessions/*/artifacts/**`

**Why excluded:**
- Session-specific context
- Not applicable to cross-session wizard queries
- Highly temporal

**Exception:** Session summaries may be referenced at 50% confidence if relevant to current work.

**Wizard Scope Awareness:**
- Wizard queries are **cross-session by default**
- Only reference session artifacts if user explicitly scopes query to that session

---

### 🟢 Foundation Concepts (Confidence Ceiling: 85%)

**Files:**
- `docs/explanation/workspace-architecture.md`
- `docs/reference/implementation-architecture.md`
- `docs/internals/architecture-overview.md`
- `.claude/agents/*/README.md`

**Why high confidence:**
- Stable conceptual overviews
- High temporal stability
- Excellent for understanding "why" and "what"

**Caveat:** Less reliable for "how" (procedures) - those are prescriptive (55% ceiling).

---

## File Categories & Default Scores

### Configuration (33 files) - Default: SAFE (90% confidence)

**Reasoning:** User-authored, stable, project-wide scope

**Examples:** CLAUDE.md, .mcp.json, package.json

---

### Documentation (58 files) - Default: CAUTIONARY (60% confidence)

**Breakdown:**

| Subcategory | Classification | Confidence | Reasoning |
|-------------|----------------|------------|-----------|
| **Explanation** | SAFE | 85% | Conceptual understanding, high stability |
| **Reference** | SAFE | 80% | Information-oriented, less prescriptive |
| **Internals** | SAFE | 75% | Architecture details (but implementation may change) |
| **Tutorials** | CAUTIONARY | 55% | Prescriptive step-by-step workflows |
| **How-To** | CAUTIONARY | 55% | Task-oriented with specific procedures |

---

### Agents (77 files) - Default: SAFE (80% confidence)

**Reasoning:** Stable agent personas, but specific capabilities may evolve

**Wizard Guidance:** Use for understanding agent types and roles, not exact implementation.

---

### Commands (81 files) - Default: CAUTIONARY (65% confidence)

**Reasoning:** Command definitions stable, but invocation patterns prescriptive

**Wizard Guidance:** Reference what commands do, not how to sequence them.

---

### Skills (43 files) - Default: CAUTIONARY (70% confidence)

**Reasoning:** Skill definitions stable, but usage patterns may be prescriptive

**Wizard Guidance:** Understand skill capabilities, adapt usage to context.

---

### Hooks (11 files) - Default: CAUTIONARY (50% confidence)

**Reasoning:** Implementation details, high prescriptiveness, medium stability

**Wizard Guidance:** Reference for understanding automation, not for direct execution patterns.

---

### Backups (31 files) - Default: EXCLUDE (20% confidence)

**Reasoning:** Immutable snapshots, highly temporal, session-specific

**Wizard Guidance:** Never reference unless debugging specific historical session.

---

### External Agent Content (29 files) - Default: CAUTIONARY (60% confidence)

**Locations:** `inbox/codex-agent/**`, `inbox/cursor-agent/**`

**Reasoning:** High-quality research but not authoritative for this workspace

**Wizard Guidance:** Reference for concepts and patterns, verify against workspace config.

---

## Wizard Decision Matrix by Query Type

### 1. Conceptual Understanding ("What is...?" "Why does...?")

**Preferred Sources:**
- `docs/explanation/**` (85% confidence)
- `docs/reference/**` (80% confidence)
- `CLAUDE.md` overview sections (100% confidence)
- Agent README files (80% confidence)

**Avoid:**
- Session artifacts (too specific)
- How-to guides (too procedural)
- Backups (immutable snapshots)

---

### 2. Procedural Guidance ("How do I...?")

**Preferred Sources:**
- `CLAUDE.md` protocols (100% confidence **but adapt to parallel**)
- `docs/how-to/**` (55% confidence - **extract principles not steps**)
- `docs/reference/feature-verification-checklist.md` (80% confidence)

**Wizard Adaptation Required:** YES
- Sequential tutorials need translation to parallel wizard execution

**Avoid:**
- Step-by-step tutorials (prescriptive ceiling at 55%)
- Session-specific procedures

---

### 3. Capability Discovery ("Can I...?" "What tools...?")

**Preferred Sources:**
- `.claude/agents/**` (80% confidence)
- `.claude/commands/**` (65% confidence)
- `.claude/skills/**` (70% confidence)
- `docs/reference/hive-mind-quick-reference.md` (80% confidence)

**Avoid:**
- Implementation code (too detailed)
- External agent research (not authoritative)

---

### 4. Troubleshooting (Error reports, problems)

**Preferred Sources:**
- `docs/troubleshooting/troubleshooting-guide.md` (75% confidence)
- `docs/how-to/integration-testing-guide.md` (70% confidence)
- Session artifacts **IF debugging that specific session** (40% confidence)

**Wizard Adaptation Required:** YES
- Diagnose root cause, don't blindly follow troubleshooting steps

---

### 5. Architectural Decisions (Design, structure)

**Preferred Sources:**
- `WORKSPACE-ARCHITECTURE.md` (100% confidence)
- `docs/explanation/workspace-architecture.md` (85% confidence)
- `docs/internals/architecture-overview.md` (85% confidence)
- `docs/reference/implementation-architecture.md` (80% confidence)

**Avoid:**
- Implementation code (too granular)
- Session-specific analyses

---

## Confidence Adjustment Factors

### 📉 File Age Penalty

**Rule:** If file is implementation-focused AND not modified in 30+ days → confidence × 0.9

**Reasoning:** Implementation details drift faster than concepts.

---

### 📈 Cross-Reference Boost

**Rule:** If 3+ sources with confidence > 70 agree → boost each by +5%

**Cap:** Maximum 95% confidence (never 100% except user config)

---

### 📉 Contradiction Penalty

**Rule:** If sources contradict → reduce all to min(confidence, 50%)

**Wizard Action:** Flag contradiction and ask user for clarification.

---

### 📈 Verification Status Boost

**Markers:**
- "Verified by user"
- "100% test pass rate"
- "Integration-tested" tag

**Boost:** +15% confidence (capped at 95%)

---

## Wizard Behavioral Guidelines

### 1. Parallel Execution Mandate

**Rule:** Wizard MUST translate sequential tutorials into parallel operations.

**Example:**
```
Tutorial says: "1. Create file A, 2. Then create file B, 3. Then test both"

Wizard does:   [Single message]
               - Write A
               - Write B
               - Run tests
               (all in parallel)
```

**Confidence Impact:** Sequential tutorials capped at 55%, wizard's parallel translation at 85%.

---

### 2. User Config Supremacy

**Rule:** User configuration (CLAUDE.md, ~/.claude/CLAUDE.md) ALWAYS overrides documentation.

**Example:**
- Doc: "Use `git add -A`"
- CLAUDE.md: "NEVER use `git add -A`"
- **Wizard follows CLAUDE.md (100% confidence) over doc (0% for contradicting claim)**

---

### 3. Session Scope Awareness

**Rule:** Wizard queries are **cross-session by default** unless user specifies session context.

**Impact:** Session artifacts default to EXCLUDE unless query explicitly scoped.

**Exception:** Session summaries may be referenced at 50% confidence if relevant.

---

### 4. Prescriptiveness Adaptation

**Rule:** Extract principles from prescriptive content, don't copy procedures.

**Example:**
- Doc: "MUST run hook A, then B, then C in sequence"
- Wizard understands: "Hooks A, B, C are important" (but adapts execution to parallel context)

**Confidence Ceiling:** 55%

---

### 5. READ-ONLY Respect

**Rule:** NEVER recommend editing READ-ONLY files, even if documentation suggests it.

**Files:**
- `.swarm/backups/**`
- `.swarm/memory.db*`
- `inbox/codex-agent/**`
- `inbox/cursor-agent/**`

**Confidence:** 100% on permission boundaries, regardless of what docs say.

---

## Top 20 High-Value References

Wizard should prioritize these files:

| File | Confidence | Use Case |
|------|------------|----------|
| `CLAUDE.md` | 100% | User config, supreme authority |
| `~/.claude/CLAUDE.md` | 100% | Global user preferences |
| `WORKSPACE-ARCHITECTURE.md` | 95% | Architectural overview |
| `docs/explanation/workspace-architecture.md` | 85% | Conceptual clarity |
| `docs/explanation/session-management.md` | 85% | Core concept explanation |
| `docs/explanation/file-routing.md` | 85% | Fundamental routing rules |
| `docs/explanation/hive-mind-system.md` | 85% | Coordination paradigm |
| `docs/reference/implementation-architecture.md` | 80% | Technical reference |
| `docs/reference/hive-mind-quick-reference.md` | 80% | Quick capability lookup |
| `docs/reference/feature-verification-checklist.md` | 80% | Verification procedures |
| `.mcp.json` | 100% | MCP server config |
| `sessions/README.md` | 80% | Session protocol explanation |
| `.swarm/README.md` | 75% | Infrastructure documentation |
| `inbox/README.md` | 75% | Communication protocol |
| `docs/internals/architecture-overview.md` | 85% | System architecture details |
| `docs/internals/coordination-mechanics.md` | 80% | How coordination works |
| `docs/internals/memory-architecture.md` | 80% | Memory system design |
| `docs/troubleshooting/troubleshooting-guide.md` | 75% | Problem-solving patterns |
| `.claude/agents/queen-coordinator/README.md` | 80% | Wizard's own definition |
| `docs/how-to/choose-coordination-approach.md` | 70% | Decision framework (adapt!) |

---

## High-Risk Exclusions

**Wizard should NEVER reference these files:**

| Pattern | Count | Reasoning |
|---------|-------|-----------|
| `.swarm/backups/**` | 31 | Immutable snapshots, highly temporal |
| `sessions/*/artifacts/**` | ~100+ | Session-specific, not cross-session |
| `.swarm/memory.db*` | 3 | Binary database, hook-managed |
| `.archive/**` | Unknown | Deprecated legacy content |
| `inbox/*/deprecated/**` | Unknown | Explicitly marked obsolete |

---

## Programmatic Query Interface

### Get File Confidence

**Input:** `file_path`

**Logic:**
1. Check `special_handling_rules` for pattern matches
2. If matched, use specified `confidence_ceiling`
3. Else, check `file_categories` for default
4. Apply `confidence_adjustment_factors`
5. Return final confidence and classification

**Output:**
```json
{
  "confidence": 75,
  "classification": "SAFE",
  "reasoning": "Conceptual explanation, high temporal stability",
  "wizard_guidance": "Excellent for 'why' and 'what' questions"
}
```

---

### Get Sources for Query Type

**Input:** `query_type` (conceptual | procedural | capability | troubleshooting | architectural)

**Logic:**
1. Look up `query_type` in `wizard_decision_matrix.query_type_routing`
2. Return `preferred_sources` with confidence scores
3. Return `avoid_sources` with reasoning
4. Return `wizard_adaptation_required` flag

**Output:**
```json
{
  "preferred_sources": [
    {
      "path": "docs/explanation/**",
      "confidence": 85,
      "reasoning": "Conceptual understanding, stable"
    }
  ],
  "avoid_sources": ["sessions/*/artifacts/**"],
  "adaptation_required": false
}
```

---

### Validate Source Compatibility

**Input:** `["source_file_1", "source_file_2", ...]`

**Logic:**
1. Check for contradictions between sources
2. Apply `contradiction_penalty` if found
3. Check for cross-reference agreement
4. Apply `cross_reference_boost` if 3+ agree
5. Return compatibility assessment

**Output:**
```json
{
  "compatible": true,
  "contradictions": [],
  "agreement_boost": 5,
  "final_confidence": 85
}
```

---

## Summary Statistics

### By Classification

| Classification | Count | Percentage | Examples |
|----------------|-------|------------|----------|
| **SAFE** | ~90 | 25% | User config, concepts, architecture |
| **CAUTIONARY** | ~210 | 58% | Tutorials, implementation, external research |
| **EXCLUDE** | ~60 | 17% | Session artifacts, backups, deprecated |

---

## Validation Status

**⚠️ Important:** This schema is a **theoretical framework** based on the infrastructure audit.

**Next Steps:**
1. **Empirical Testing:** Score actual files using these dimensions
2. **Calibration:** Adjust weights and thresholds based on real results
3. **Validation:** Test wizard decision-making with real queries
4. **Iteration:** Refine schema based on wizard performance

**Current Status:** Requires implementation of scoring process to validate assumptions.

---

## Metadata

- **Schema Author:** System Architecture Designer
- **Audit Basis:** Workspace Infrastructure Audit Report (2025-11-17)
- **Files Analyzed:** 360
- **Total Lines:** 88,471
- **Workspace Size:** 2.6 MB
- **Stock-First Score:** 82/100
- **Version:** 1.0.0
- **Last Updated:** 2025-11-17
