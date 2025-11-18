# Preventive Protocols: Anti-Pattern Prevention System

**Status**: ACTIVE
**Version**: 1.0.0
**Created**: 2025-11-17
**Purpose**: Systematic decision-tree protocols to prevent nudge-identified anti-patterns

---

## 🎯 Core Principle

**STOP, AUDIT, RESEARCH, INTEGRATE** before creating, moving, or restructuring.

---

## 📋 Protocol 1: Before Creating ANY File

### Decision Tree: "Should I Create This File?"

```
START: User requests new file or feature
  ↓
  ┌─────────────────────────────────────────┐
  │ STEP 1: EXISTENCE CHECK                 │
  │ ❓ Does similar file already exist?     │
  └─────────────────────────────────────────┘
          ↓ YES                    ↓ NO
          │                        │
  ┌───────▼──────────┐      ┌─────▼────────────┐
  │ 🛑 STOP           │      │ STEP 2: SCOPE    │
  │ Edit existing    │      │ CHECK            │
  │ file instead     │      └──────────────────┘
  └──────────────────┘             │
                                   ↓
                          ┌────────────────────────┐
                          │ ❓ Does existing       │
                          │ structure handle this? │
                          └────────────────────────┘
                                ↓ YES    ↓ NO
                                │        │
                        ┌───────▼─┐  ┌──▼──────────┐
                        │ 🛑 STOP  │  │ STEP 3:     │
                        │ Extend   │  │ FRAMEWORK   │
                        │ existing │  │ RESEARCH    │
                        └──────────┘  └─────────────┘
                                           │
                                           ↓
                                  ┌────────────────────┐
                                  │ ❓ Is there a       │
                                  │ standard framework?│
                                  └────────────────────┘
                                        ↓ YES  ↓ NO
                                        │      │
                                ┌───────▼─┐ ┌──▼─────┐
                                │ 🛑 STOP  │ │ STEP 4:│
                                │ Use      │ │ AUDIT  │
                                │ framework│ └────────┘
                                └──────────┘     │
                                                 ↓
                                        ┌────────────────┐
                                        │ ❓ Redundancy   │
                                        │ audit passed?  │
                                        └────────────────┘
                                             ↓ NO   ↓ YES
                                             │      │
                                    ┌────────▼─┐ ┌──▼──────┐
                                    │ 🛑 STOP   │ │ ✅ CREATE│
                                    │ Integrate │ │ NEW FILE│
                                    └───────────┘ └─────────┘
```

### Checklist: File Creation Protocol

#### ☑️ Phase 1: Existence Audit (MANDATORY)

```bash
# 1. Search for similar files by name pattern
glob "**/*<keyword>*"

# 2. Search for similar files by content/purpose
grep -r "<functionality>" --type md,js,ts,json

# 3. Check session artifacts from previous sessions
ls sessions/*/artifacts/{docs,code,tests,scripts}/ | grep "<topic>"

# 4. Search project memory for prior decisions
# Use: mcp__claude-flow_alpha__memory_search({ pattern: "<topic>", limit: 20 })
```

**Decision Point**:
- ✅ **None found** → Proceed to Phase 2
- 🛑 **Similar found** → STOP. Edit existing file instead. Ask: "I found `<file>` which seems to cover this. Should I enhance it instead?"

---

#### ☑️ Phase 2: Structural Scope Check (MANDATORY)

```bash
# 1. Read relevant documentation structure
read WORKSPACE-GUIDE.md
read WORKSPACE-ARCHITECTURE.md
read docs/README.md

# 2. Check existing directory organization
ls -la docs/
ls -la docs/guides/
ls -la sessions/session-*/artifacts/

# 3. Verify file routing rules
grep -A 20 "File Routing" WORKSPACE-GUIDE.md
```

**Questions to Answer**:
1. Does existing documentation structure already have a section for this?
2. Can this be added to an existing guide vs creating new file?
3. Does the file routing system already specify where this should go?

**Decision Point**:
- ✅ **New scope** → Proceed to Phase 3
- 🛑 **Existing structure handles it** → STOP. Add to existing structure. Ask: "This belongs in `<existing-section>`. Should I add it there?"

---

#### ☑️ Phase 3: Framework Research (MANDATORY)

**Research Standard Frameworks**:

```markdown
# For Documentation:
- [ ] Diátaxis Framework (tutorials, how-to, reference, explanation)
- [ ] C4 Model (architecture diagrams)
- [ ] ADR (Architecture Decision Records)
- [ ] README templates (project overview)

# For Code:
- [ ] Design Patterns (GoF, Enterprise, Domain-Driven)
- [ ] Project structure conventions (language-specific)
- [ ] Testing frameworks (Jest, Mocha, Pytest)

# For Configuration:
- [ ] Standard config formats (package.json, tsconfig.json)
- [ ] Industry conventions (eslint, prettier, git)
```

**Decision Point**:
- ✅ **No standard exists** → Proceed to Phase 4
- 🛑 **Standard framework exists** → STOP. Use framework. Ask: "Should I use `<framework>` instead of creating custom structure?"

---

#### ☑️ Phase 4: Redundancy Audit (MANDATORY)

**Cross-Reference Check**:

```bash
# 1. List all documentation files
find docs/ sessions/ -name "*.md" -type f

# 2. Map topics to files (create mental/actual map)
# Topic: Session Management
#   - WORKSPACE-GUIDE.md (section)
#   - CLAUDE.md (section)
#   - sessions/*/artifacts/docs/session-*.md

# 3. Identify overlaps
grep -r "<topic>" docs/ sessions/*/artifacts/docs/

# 4. Check for competing sources of truth
# Are there multiple files claiming to be "the guide" for this?
```

**Red Flags** (STOP if found):
- ❌ Multiple files with same purpose
- ❌ Topic already covered in 2+ places
- ❌ Competing "authoritative" guides
- ❌ Similar file names (guide.md vs GUIDE.md vs guide-v2.md)

**Decision Point**:
- ✅ **No redundancy** → Proceed to Phase 5
- 🛑 **Redundancy detected** → STOP. Consolidate first. Ask: "I found redundancy between `<file1>` and `<file2>`. Should I consolidate before adding new content?"

---

#### ☑️ Phase 5: Integration Planning (MANDATORY)

**Plan Integration Before Creation**:

1. **Cross-Links**: How will this integrate with existing docs?
2. **Navigation**: Where in the navigation hierarchy?
3. **References**: Which files will reference this?
4. **Discovery**: How will users find this?
5. **Maintenance**: Who owns updates? What's the lifecycle?

**Template for Integration Plan**:

```markdown
## Integration Plan: <new-file-name>

### Purpose
[One sentence: what problem does this solve?]

### Scope Justification
[Why can't existing files handle this?]

### Cross-Links
- Referenced by: [list files that will link here]
- References to: [list files this will link to]

### Navigation Placement
- Parent: [where in hierarchy?]
- Siblings: [what else at this level?]

### Discovery Path
- Primary: [how do users find this?]
- Secondary: [alternative discovery methods?]

### Maintenance
- Owner: [who updates this?]
- Trigger: [when does this need updates?]
- Lifecycle: [how long is this relevant?]
```

**Decision Point**:
- ✅ **Integration plan complete** → CREATE FILE
- 🛑 **Integration unclear** → STOP. Ask: "I'm unclear on how this integrates with `<existing-structure>`. Can you clarify the relationship?"

---

## 📋 Protocol 2: Before Moving ANY File

### Decision Tree: "Should I Move This File?"

```
START: Impulse to move file
  ↓
  ┌──────────────────────────────────┐
  │ STEP 1: ROOT CAUSE ANALYSIS      │
  │ ❓ Am I fixing symptom or cause? │
  └──────────────────────────────────┘
          ↓ SYMPTOM              ↓ CAUSE
          │                      │
  ┌───────▼────────┐      ┌──────▼────────┐
  │ 🛑 STOP         │      │ STEP 2:       │
  │ Fix root cause │      │ REFERENCE     │
  │ instead        │      │ AUDIT         │
  └────────────────┘      └───────────────┘
                                 │
                                 ↓
                        ┌────────────────────┐
                        │ ❓ Should I fix     │
                        │ references instead?│
                        └────────────────────┘
                              ↓ YES   ↓ NO
                              │       │
                      ┌───────▼──┐ ┌──▼──────┐
                      │ 🛑 STOP   │ │ STEP 3: │
                      │ Update    │ │ ROUTING │
                      │ references│ │ CHECK   │
                      └───────────┘ └─────────┘
                                        │
                                        ↓
                               ┌────────────────┐
                               │ ❓ File routing │
                               │ rules verified?│
                               └────────────────┘
                                    ↓ NO   ↓ YES
                                    │      │
                            ┌───────▼──┐ ┌──▼─────┐
                            │ 🛑 STOP   │ │ STEP 4:│
                            │ Follow    │ │ IMPACT │
                            │ routing   │ │ ANALYSIS│
                            └───────────┘ └────────┘
                                              │
                                              ↓
                                     ┌────────────────┐
                                     │ ❓ Impact       │
                                     │ acceptable?    │
                                     └────────────────┘
                                          ↓ NO  ↓ YES
                                          │     │
                                  ┌───────▼─┐ ┌─▼────┐
                                  │ 🛑 STOP  │ │✅ MOVE│
                                  │ Too risky│ └──────┘
                                  └──────────┘
```

### Checklist: File Movement Protocol

#### ☑️ Phase 1: Root Cause Analysis (MANDATORY)

**Why Am I Moving This File?**

Common **symptom-based** reasons (🛑 STOP):
- ❌ "It's in the wrong place" ← Why was it placed there originally?
- ❌ "I can't find it" ← Is discovery the real problem?
- ❌ "It doesn't fit" ← Should structure change, not file?
- ❌ "Cleanup" ← Is this cosmetic or functional?

Common **cause-based** reasons (✅ Proceed):
- ✅ File routing rules specify different location
- ✅ File contradicts documented structure
- ✅ File is misclassified (session artifact in root)
- ✅ File has no valid reason to exist in current location

**Questions to Ask**:
1. What problem am I actually solving?
2. Will moving this file solve the root cause?
3. Am I avoiding fixing the real issue?

**Decision Point**:
- ✅ **Root cause identified** → Proceed to Phase 2
- 🛑 **Symptom fix** → STOP. Identify root cause. Ask: "I want to move `<file>` because `<reason>`. Is this fixing symptom or cause?"

---

#### ☑️ Phase 2: Reference Audit (MANDATORY)

**Who References This File?**

```bash
# 1. Search for file references
grep -r "<filename>" --exclude-dir=node_modules

# 2. Search for path references
grep -r "<filepath>" --exclude-dir=node_modules

# 3. Check documentation links
grep -r "\[.*\](<filepath>)" docs/ sessions/

# 4. Check imports/requires (for code files)
grep -r "import.*<filename>" src/
grep -r "require.*<filename>" src/

# 5. Check git history for move reasons
git log --follow --oneline -- <filepath>
```

**Analysis Questions**:
1. How many files reference this?
2. Are references hard-coded or dynamic?
3. Will references break or auto-update?
4. Is there a symlink/alias option instead?

**Decision Point**:
- ✅ **Few/no references OR references easily updated** → Proceed to Phase 3
- 🛑 **Many references OR brittle links** → STOP. Update references instead. Ask: "Moving `<file>` will break `<N>` references. Should I update references to current location instead?"

---

#### ☑️ Phase 3: Routing Rules Verification (MANDATORY)

**Does File Routing System Specify This?**

```bash
# 1. Check file routing documentation
grep -A 50 "File Routing" WORKSPACE-GUIDE.md
grep -A 50 "File Routing" CLAUDE.md

# 2. Check session management rules
grep -A 30 "Session Management" WORKSPACE-GUIDE.md

# 3. Verify destination is documented
# Is the target location defined in routing rules?
```

**Routing Rules Reference**:

| File Type | Correct Location | Wrong Location |
|-----------|------------------|----------------|
| Session code | `sessions/$SESSION_ID/artifacts/code/` | `src/`, `lib/`, root |
| Session docs | `sessions/$SESSION_ID/artifacts/docs/` | `docs/`, root |
| Session tests | `sessions/$SESSION_ID/artifacts/tests/` | `tests/`, `__tests__/` |
| Project docs | `docs/`, `docs/guides/` | `sessions/`, root |
| Project code | `src/`, `lib/` | `sessions/`, root |
| Configs | Root (e.g., `package.json`) | `sessions/`, `docs/` |

**Decision Point**:
- ✅ **Routing rules verified, move is compliant** → Proceed to Phase 4
- 🛑 **Routing rules don't specify this OR move violates rules** → STOP. Ask: "File routing rules don't clearly specify this. Should we document the rule first?"

---

#### ☑️ Phase 4: Impact Analysis (MANDATORY)

**What Breaks If I Move This?**

**Impact Categories**:

1. **Build/Tests**: Will build or tests fail?
   ```bash
   npm run build
   npm run test
   npm run lint
   ```

2. **Documentation**: Will documentation links break?
   ```bash
   # Check for broken internal links
   grep -r "\[.*\](<old-path>)" docs/
   ```

3. **Tooling**: Will tools (ESLint, TypeScript, etc.) break?
   ```bash
   # Check tool configs
   cat tsconfig.json | grep "<old-path>"
   cat .eslintrc | grep "<old-path>"
   ```

4. **Git History**: Will file history be lost?
   ```bash
   # Git tracks moves automatically IF done correctly
   git mv <old> <new>  # Preserves history
   # vs
   rm <old> && touch <new>  # Loses history
   ```

5. **User Discovery**: Will users be unable to find this?
   ```bash
   # Check if file is referenced in guides/READMEs
   grep -r "<filename>" docs/README.md docs/guides/README.md
   ```

**Risk Matrix**:

| Impact Level | Build | Docs | Tooling | History | Discovery | Action |
|--------------|-------|------|---------|---------|-----------|--------|
| **None** | ✅ Pass | ✅ No links | ✅ Works | ✅ Preserved | ✅ Documented | ✅ MOVE |
| **Low** | ✅ Pass | ⚠️ 1-2 links | ✅ Works | ✅ Preserved | ⚠️ Findable | ✅ MOVE + Update |
| **Medium** | ⚠️ Warnings | ⚠️ 3-5 links | ⚠️ Needs config | ✅ Preserved | ⚠️ Needs guide | 🛑 STOP + Plan |
| **High** | ❌ Fails | ❌ 6+ links | ❌ Breaks | ❌ Lost | ❌ Hidden | 🛑 STOP |

**Decision Point**:
- ✅ **Impact = None/Low** → MOVE FILE
- 🛑 **Impact = Medium/High** → STOP. Create migration plan. Ask: "Moving `<file>` has `<impact-level>` impact. Should I create a migration plan first?"

---

## 📋 Protocol 3: Before Structural Changes

### Decision Tree: "Should I Restructure?"

```
START: Impulse to restructure
  ↓
  ┌─────────────────────────────────┐
  │ STEP 1: CURRENT STATE AUDIT     │
  │ ❓ Do I understand current state?│
  └─────────────────────────────────┘
          ↓ NO                  ↓ YES
          │                     │
  ┌───────▼────────┐     ┌──────▼────────┐
  │ 🛑 STOP         │     │ STEP 2:       │
  │ Audit first    │     │ FRAMEWORK MAP │
  └────────────────┘     └───────────────┘
                                │
                                ↓
                       ┌────────────────────┐
                       │ ❓ Maps to standard │
                       │ framework?         │
                       └────────────────────┘
                            ↓ YES      ↓ NO
                            │          │
                    ┌───────▼───┐  ┌───▼────────┐
                    │ 🛑 STOP    │  │ STEP 3:    │
                    │ Align with │  │ EXISTING   │
                    │ framework  │  │ ORG CHECK  │
                    └────────────┘  └────────────┘
                                         │
                                         ↓
                                ┌────────────────┐
                                │ ❓ Existing org │
                                │ is working?    │
                                └────────────────┘
                                    ↓ YES  ↓ NO
                                    │      │
                            ┌───────▼──┐ ┌─▼────────┐
                            │ 🛑 STOP   │ │ STEP 4:  │
                            │ Don't fix │ │ CONSOLI- │
                            │ not broken│ │ DATE PLAN│
                            └───────────┘ └──────────┘
                                              │
                                              ↓
                                     ┌────────────────┐
                                     │ ❓ Consolidate  │
                                     │ vs expand?     │
                                     └────────────────┘
                                          ↓ EXPAND ↓ CONSOLIDATE
                                          │        │
                                  ┌───────▼──┐  ┌──▼───────┐
                                  │ 🛑 STOP   │  │ ✅ RESTRUC│
                                  │ YAGNI     │  │ -TURE    │
                                  └───────────┘  └──────────┘
```

### Checklist: Structural Change Protocol

#### ☑️ Phase 1: Current State Audit (MANDATORY)

**Complete System Inventory**:

```bash
# 1. List ALL relevant files
find docs/ sessions/ -type f -name "*.md" | sort

# 2. Map directory structure
tree docs/
tree sessions/

# 3. Document current organization
# Create: current-state-map.md
```

**Current State Map Template**:

```markdown
## Current State Audit: <subsystem>

### File Inventory
[List ALL files with purpose]

| File Path | Purpose | Last Modified | Size | Owner |
|-----------|---------|---------------|------|-------|
| ... | ... | ... | ... | ... |

### Directory Structure
[Tree view of current organization]

### Organization Patterns
[What patterns exist? What's the current logic?]

### Pain Points
[What's broken? What's confusing?]

### Working Well
[What should be preserved?]

### Dependencies
[What depends on this structure?]
```

**Decision Point**:
- ✅ **Current state fully documented** → Proceed to Phase 2
- 🛑 **Gaps in understanding** → STOP. Complete audit. Ask: "I don't fully understand the current structure. Should I audit before restructuring?"

---

#### ☑️ Phase 2: Framework Mapping (MANDATORY)

**Map to Established Frameworks**:

**For Documentation Structure**:

| Framework | Use Case | Structure |
|-----------|----------|-----------|
| **Diátaxis** | Technical docs | Tutorials, How-To, Reference, Explanation |
| **C4 Model** | Architecture | Context, Container, Component, Code |
| **DocOps** | Documentation ops | Plan, Create, Review, Publish, Maintain |
| **Information Architecture** | Content org | Hierarchical, Sequential, Matrix, Network |

**For Code Structure**:

| Framework | Use Case | Structure |
|-----------|----------|-----------|
| **MVC** | UI patterns | Models, Views, Controllers |
| **Clean Architecture** | Domain separation | Entities, Use Cases, Interface Adapters, Frameworks |
| **Microservices** | Distributed systems | Service per domain |
| **Monorepo** | Multi-project | Packages, shared libs |

**Framework Analysis Template**:

```markdown
## Framework Mapping: <framework>

### Framework Overview
[Brief description]

### Alignment Analysis
- ✅ **Fits**: [what fits this framework?]
- ⚠️ **Partial fit**: [what partially fits?]
- ❌ **Doesn't fit**: [what doesn't fit?]

### Gaps
[What would we need to change to fully align?]

### Benefits
[What do we gain from alignment?]

### Costs
[What's the migration cost?]

### Recommendation
[Should we align with this framework?]
```

**Decision Point**:
- ✅ **No standard framework fits** → Proceed to Phase 3
- 🛑 **Standard framework available** → STOP. Align with framework. Ask: "Should we align with `<framework>` instead of custom structure?"

---

#### ☑️ Phase 3: Existing Organization Check (MANDATORY)

**Is Current Organization Working?**

**Health Indicators**:

| Indicator | Healthy ✅ | Unhealthy ❌ |
|-----------|-----------|-------------|
| **Findability** | Users can locate files in <30s | Users can't find files |
| **Consistency** | Clear patterns exist | Ad-hoc organization |
| **Scalability** | Grows without confusion | Breaks down with growth |
| **Maintainability** | Easy to update | Hard to keep current |
| **Comprehensibility** | New users understand quickly | Requires deep knowledge |

**Assessment Questions**:

1. **Can new users navigate the structure?**
   - ✅ Yes → Structure is clear
   - ❌ No → Structure is confusing

2. **Are there clear organizing principles?**
   - ✅ Yes → Structure is intentional
   - ❌ No → Structure is accidental

3. **Is the structure documented?**
   - ✅ Yes → Structure is maintained
   - ❌ No → Structure is undocumented

4. **Does the structure scale?**
   - ✅ Yes → Structure is robust
   - ❌ No → Structure is fragile

5. **Is the structure being followed?**
   - ✅ Yes → Structure is working
   - ❌ No → Structure is ignored

**Decision Point**:
- ✅ **Structure is failing (3+ ❌)** → Proceed to Phase 4
- 🛑 **Structure is working (3+ ✅)** → STOP. Don't fix what's not broken. Ask: "Current structure seems to be working. Why restructure?"

---

#### ☑️ Phase 4: Consolidation Planning (MANDATORY)

**Consolidate vs Expand?**

**Consolidation Indicators** (✅ Restructure):
- ❌ Duplicate files/content
- ❌ Overlapping scopes
- ❌ Multiple "sources of truth"
- ❌ Fragmented information
- ❌ Too many small files

**Expansion Indicators** (🛑 STOP - YAGNI):
- ⚠️ "We might need this someday"
- ⚠️ "Let's organize for future growth"
- ⚠️ "This will be cleaner"
- ⚠️ Adding structure without content
- ⚠️ Premature optimization

**Consolidation Plan Template**:

```markdown
## Consolidation Plan: <subsystem>

### Problem Statement
[What problem are we solving? Be specific.]

### Current State
[Reference audit from Phase 1]

### Target State
[What's the desired end state?]

### Consolidation Strategy
- **Merge**: [files A + B → C]
- **Archive**: [obsolete files → archive]
- **Redirect**: [old paths → new paths]
- **Delete**: [truly redundant → delete]

### Migration Steps
1. [Step-by-step plan]
2. [...]

### Backward Compatibility
[How do we handle existing references?]

### Validation
[How do we verify consolidation succeeded?]

### Rollback Plan
[What if this breaks things?]
```

**Decision Point**:
- ✅ **Consolidation plan complete, validated** → RESTRUCTURE
- 🛑 **Expansion-focused OR plan incomplete** → STOP. Ask: "This seems like expansion, not consolidation. Should we apply YAGNI?"

---

## 🎯 Adoption Plan

### Phase 1: Protocol Integration (Week 1)

**Embed in CLAUDE.md**:

```markdown
## Before Creating Files - MANDATORY PROTOCOL

Before creating ANY file, you MUST:
1. ✅ Run existence check: `glob "**/*<keyword>*"`
2. ✅ Check structure: Can existing files handle this?
3. ✅ Research frameworks: Is there a standard?
4. ✅ Audit redundancy: Will this duplicate content?
5. ✅ Plan integration: How does this fit?

See: sessions/session-20251117-100232-docs-refactor-tutor/artifacts/notes/preventive-protocols.md
```

---

### Phase 2: Tooling Support (Week 2)

**Create Validation Scripts**:

```bash
# .claude/scripts/validate-file-creation.sh
#!/bin/bash
# Validates file creation against protocols

FILENAME="$1"
PROTOCOL="file-creation"

echo "🔍 Running Protocol: $PROTOCOL"
echo "📄 File: $FILENAME"

# Phase 1: Existence check
echo "✅ Phase 1: Existence Check"
glob "**/*$(basename $FILENAME)*"

# Phase 2: Structure check
echo "✅ Phase 2: Structure Check"
# ... automation ...

# Phase 3: Framework check
echo "✅ Phase 3: Framework Research"
# ... automation ...

# Phase 4: Redundancy audit
echo "✅ Phase 4: Redundancy Audit"
# ... automation ...

echo "✅ All phases passed. File creation approved."
```

---

### Phase 3: Habit Formation (Ongoing)

**Nudge System Integration**:

1. **Pre-commit hook**: Validate file creation/moves against protocols
2. **Session closeout**: Review protocol adherence
3. **Memory triggers**: Store protocol violations for learning

**Example Pre-commit Hook**:

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for new files
NEW_FILES=$(git diff --cached --name-only --diff-filter=A)

for file in $NEW_FILES; do
  echo "🔍 Validating new file: $file"
  .claude/scripts/validate-file-creation.sh "$file" || exit 1
done

echo "✅ All new files validated"
```

---

### Phase 4: Continuous Improvement (Monthly)

**Protocol Review Cycle**:

1. **Collect violations**: Track protocol bypasses
2. **Analyze patterns**: Why were protocols skipped?
3. **Refine protocols**: Update based on learnings
4. **Document exceptions**: When is it OK to skip?

**Review Template**:

```markdown
## Protocol Review: YYYY-MM

### Violations
| Protocol | Bypassed | Reason | Justified? |
|----------|----------|--------|------------|
| ... | ... | ... | ... |

### Pattern Analysis
[What patterns emerged?]

### Protocol Refinements
[What should change?]

### Exceptions Documented
[When is it OK to skip protocols?]
```

---

## 📊 Success Metrics

**Protocol Adoption**:
- ✅ **100% adherence** in new sessions within 1 month
- ✅ **Zero nudges** for covered scenarios within 2 months
- ✅ **Automated validation** in pre-commit hooks within 1 month

**Quality Improvement**:
- ✅ **50% reduction** in duplicate files within 1 month
- ✅ **Zero structural refactors** without cause within 2 months
- ✅ **100% framework alignment** for new structures within 3 months

**Efficiency Gains**:
- ✅ **Faster decisions**: Protocols reduce decision paralysis
- ✅ **Fewer mistakes**: Automated validation catches errors
- ✅ **Better onboarding**: New agents follow protocols systematically

---

## 🎓 Training & Onboarding

### New Agent Onboarding

**Protocol Orientation** (First Session):

```markdown
## Welcome! Before You Create, Move, or Restructure...

You MUST follow these protocols:

1. **Creating files?** → Read Protocol 1 (File Creation)
2. **Moving files?** → Read Protocol 2 (File Movement)
3. **Restructuring?** → Read Protocol 3 (Structural Changes)

**Location**: sessions/session-20251117-100232-docs-refactor-tutor/artifacts/notes/preventive-protocols.md

**Quick Reference**:
- STOP, AUDIT, RESEARCH, INTEGRATE
- Check existing before creating new
- Fix root cause, not symptoms
- Integrate, don't duplicate
- Research frameworks before implementing
```

---

### Protocol Quick Reference Card

```
╔════════════════════════════════════════════════════╗
║  🚨 PREVENTIVE PROTOCOLS - QUICK REFERENCE       ║
╠════════════════════════════════════════════════════╣
║  BEFORE CREATING FILES:                            ║
║  1. ✅ Existence check (glob, grep)               ║
║  2. ✅ Structure check (can existing handle?)     ║
║  3. ✅ Framework research (standard exists?)      ║
║  4. ✅ Redundancy audit (duplicates?)             ║
║  5. ✅ Integration plan (cross-links, nav)        ║
╠════════════════════════════════════════════════════╣
║  BEFORE MOVING FILES:                              ║
║  1. ✅ Root cause (symptom vs cause?)             ║
║  2. ✅ Reference audit (what breaks?)             ║
║  3. ✅ Routing rules (compliant?)                 ║
║  4. ✅ Impact analysis (acceptable risk?)         ║
╠════════════════════════════════════════════════════╣
║  BEFORE RESTRUCTURING:                             ║
║  1. ✅ Current state audit (understand?)          ║
║  2. ✅ Framework mapping (standard exists?)       ║
║  3. ✅ Organization check (working?)              ║
║  4. ✅ Consolidate vs expand (YAGNI?)             ║
╠════════════════════════════════════════════════════╣
║  🎯 GOLDEN RULE:                                   ║
║  STOP, AUDIT, RESEARCH, INTEGRATE                  ║
╚════════════════════════════════════════════════════╝
```

---

## 📖 Appendix: Real-World Examples

### Example 1: File Creation - Documentation Guide

**Scenario**: Agent wants to create `docs/session-management-guide.md`

**Protocol Application**:

```bash
# Phase 1: Existence check
$ glob "**/*session*management*"
Found:
  - WORKSPACE-GUIDE.md (has section: "Session Management Protocol")
  - CLAUDE.md (has section: "SESSION MANAGEMENT PROTOCOL")
  - sessions/session-*/artifacts/docs/session-*.md (several)

# 🛑 STOP: Similar content exists

# Decision: Add to existing WORKSPACE-GUIDE.md instead of creating new file
```

**Outcome**: ✅ Prevented duplication, enhanced existing documentation

---

### Example 2: File Movement - Test Files

**Scenario**: Agent wants to move `tests/integration.test.js` to `src/__tests__/integration.test.js`

**Protocol Application**:

```bash
# Phase 1: Root cause analysis
Why? "It's in the wrong place"
Root cause: File routing rules specify session tests go to sessions/$SESSION_ID/artifacts/tests/

# 🛑 STOP: This is a symptom, not root cause fix

# Phase 2: Reference audit
$ grep -r "integration.test.js"
Found: package.json, jest.config.js, CI workflow

# Decision: This is project-level test, NOT session test.
# File is correctly placed in tests/.
# No move needed.
```

**Outcome**: ✅ Prevented unnecessary disruption, clarified file placement rules

---

### Example 3: Structural Change - Documentation Reorganization

**Scenario**: Agent wants to reorganize `docs/` into subdirectories

**Protocol Application**:

```bash
# Phase 1: Current state audit
$ tree docs/
docs/
  ├── WORKSPACE-GUIDE.md
  ├── WORKSPACE-ARCHITECTURE.md
  ├── guides/
  │   ├── integration-testing-guide.md
  │   ├── feature-verification-checklist.md
  │   └── troubleshooting-guide.md
  └── README.md

# Phase 2: Framework mapping
Framework: Diátaxis
  - Tutorials: ❌ None
  - How-To: ✅ guides/
  - Reference: ✅ WORKSPACE-ARCHITECTURE.md
  - Explanation: ✅ WORKSPACE-GUIDE.md

# Phase 3: Organization check
Findability: ✅ Clear
Consistency: ✅ Follows pattern
Scalability: ✅ guides/ subdirectory
Maintainability: ✅ Documented
Comprehensibility: ✅ README.md guides

# 🛑 STOP: Structure is working, don't fix

# Decision: No restructuring needed. Structure aligns with Diátaxis and works well.
```

**Outcome**: ✅ Preserved working structure, avoided unnecessary churn

---

## 🔄 Protocol Versioning & Updates

**Version History**:
- **v1.0.0** (2025-11-17): Initial protocol creation
- **v1.1.0** (TBD): Add automation tooling
- **v1.2.0** (TBD): Refine based on first month learnings

**Update Process**:
1. Collect feedback from protocol users
2. Analyze violation patterns
3. Propose protocol refinements
4. Review & approve changes
5. Update documentation
6. Train on new protocols

---

## ✅ Summary

**Core Protocols Created**:
1. ✅ **File Creation Protocol**: 5-phase decision tree with mandatory checklists
2. ✅ **File Movement Protocol**: 4-phase decision tree with impact analysis
3. ✅ **Structural Change Protocol**: 4-phase decision tree with consolidation planning

**Key Principles**:
- 🛑 **STOP before acting**: Audit, research, plan
- 🔍 **Check existing**: Before creating new
- 🎯 **Fix root cause**: Not symptoms
- 🔗 **Integrate**: Don't duplicate
- 📚 **Research frameworks**: Before implementing custom

**Adoption Strategy**:
- **Week 1**: Embed in CLAUDE.md
- **Week 2**: Create validation tooling
- **Ongoing**: Habit formation via hooks
- **Monthly**: Protocol review & refinement

**Success Metrics**:
- 100% protocol adherence within 1 month
- Zero nudges for covered scenarios within 2 months
- 50% reduction in duplicate files within 1 month

---

**Next Steps**:
1. Review & approve protocols
2. Integrate into CLAUDE.md
3. Create validation scripts
4. Set up pre-commit hooks
5. Begin tracking metrics

**Status**: ✅ READY FOR REVIEW
