# User Intent Analysis: Workspace Documentation Optimization

**Session**: session-20251117-233107-workspace-docs-optimization
**Date**: 2025-11-17
**Analyst**: Research Agent (Intent Extractor)

---

## Executive Summary

The user is **new to this claude-flow+ workspace** and faces a critical organizational challenge: the existing `docs/` directory serves **mixed purposes** (user-facing guides + internal system docs + project work), creating confusion for new users trying to learn the system.

**Core Need**: Separate concerns cleanly so new users can:
1. **Find the entry point** (tutor-mode as gateway)
2. **Learn progressively** (foundation → essential → intermediate → advanced)
3. **Distinguish project artifacts from system documentation**
4. **Follow organizational best practices** (Claude/Claude Flow recommendations)

---

## 1. User's Stated Intent (Direct Quotes)

### Primary Request
> "I'm new to the environment... I'd like to rethink the docs/ directory structure"

**Key Pain Point**:
> "docs/ serves mixed purposes - some for guides, some for system internals, some that probably should be in a projects/ folder"

### Desired Outcomes
1. **Separate `projects/` folder** - "I want to create a separate projects/ folder"
2. **Focused docs/** - "focus docs/ on guides and system documentation"
3. **Organizational frameworks** - "with proper README documentation and organizational frameworks"
4. **Best practices** - "best practices from Claude and Claude Flow recommendations"
5. **Entry point via tutor-mode** - "tutor-mode as the primary entry point"

### Critical Concern
> "I worry that organizational frameworks are patching faulty content rather than improving understanding"

**Interpretation**: User suspects that complex folder hierarchies may be compensating for poorly organized content, rather than genuinely improving navigation.

### User's Learning State
> "I haven't learned the system yet"
> "I need comprehensive mapping"

**Translation**: User needs **complete coverage** of workspace concepts, not just "quick start" guides.

---

## 2. Evidence-Based Analysis

### 2.1 Current `docs/` Mixed Purpose Problem

**Evidence from `/docs/README.md`**:

Current structure uses **Diátaxis framework** with 5 categories:
1. **tutorials/** - Learning by doing
2. **how-to/** - Task-oriented recipes
3. **explanation/** - Conceptual understanding
4. **reference/** - Quick lookups
5. **internals/** - Technical deep-dives

**The Problem**: This is ONLY for documentation, but `docs/` also contains:
- Project artifacts (`docs/projects/` exists but empty per git status)
- System development notes (should be in `inbox/assistant/`)
- Mixed guidance (some "for users", some "about the system")

### 2.2 Inbox Structure Shows The Distinction

**Evidence from `/inbox/README.md`**:

Inbox correctly separates:
- **`inbox/assistant/`** - System development & architectural work (FOR developers)
- **`inbox/codex-agent/`** - External agent research (READ-ONLY)
- **`inbox/user/`** - User-provided materials (READ-ONLY)

**Key Quote**:
> "Use `docs/guides/` for: Explaining features to users"
> "Use `inbox/assistant/` for: Researching integration approaches, analyzing system architecture"

**Rule of thumb from inbox**:
> "FOR the user → docs/guides/"
> "ABOUT the system → inbox/assistant/"

**Implication**: `docs/` should be **user-facing ONLY**, not a dumping ground for all markdown.

### 2.3 Session Management Shows Project Pattern

**Evidence from `/sessions/README.md`**:

Session artifacts structure shows natural organization:
```
sessions/<session-id>/artifacts/
  code/        # Source code
  tests/       # Tests
  docs/        # Documentation
  scripts/     # Utility scripts
  notes/       # Working notes
```

**Critical Rule**:
> "ALL new files go to `sessions/<session-id>/artifacts/` subdirectories"
> "Exception: Only edit existing project files (package.json, CLAUDE.md) in their original locations"

**Implication**: Completed project work should be **promoted from sessions** to a permanent `projects/` location, NOT mixed into `docs/`.

### 2.4 Tutor-Mode Shows Learning Path Need

**Evidence from `.claude/skills/tutor-mode/SKILL.md`**:

Tutor-mode provides **4-phase learning progression**:
1. **Foundations** (1-2 weeks) - Basics: agents, memory, sessions
2. **Essential Skills** (2-3 weeks) - Parallel execution, coordination
3. **Intermediate** (3-4 weeks) - Swarm topologies, consensus
4. **Advanced** (Ongoing) - Hive-mind, BFT, adaptive topology

**Key Feature**: "Personalized learning paths" with "context-aware exercises" and "progress tracking"

**Implication**: Tutor-mode should be the **gateway**, referencing docs/ as needed, but NOT replacing comprehensive documentation.

---

## 3. Learning Path Needs for New Users

### 3.1 Logical Progression (Based on Tutor-Mode)

**Phase 1: Orientation (Day 1)**
1. What is this workspace? (Workspace Architecture)
2. What is claude-flow? (Foundation concepts)
3. How do sessions work? (Session Management)
4. Where do files go? (File Routing)

**Phase 2: First Actions (Week 1)**
1. Spawn first agent (Hands-on exercise)
2. Use memory for coordination (Basic pattern)
3. Create and close a session (Full lifecycle)
4. Navigate documentation (Meta-skill)

**Phase 3: Core Skills (Weeks 2-3)**
1. Parallel agent spawning (5+ agents)
2. Memory coordination patterns (Handoffs, fan-out/fan-in)
3. Multi-agent projects (Backend + frontend + tests)
4. Session artifact organization (File hygiene)

**Phase 4: Advanced (Weeks 4+)**
1. Swarm topologies (Mesh, hierarchical, star, ring)
2. Consensus mechanisms (Majority, weighted, Byzantine)
3. Hive-mind coordination (Queen selection)
4. Custom workflows (Quality gates, rollback)

### 3.2 Documentation Requirements by Phase

| Phase | Needed Docs | Current Status |
|-------|-------------|----------------|
| **Orientation** | Workspace Architecture | ✅ `docs/explanation/workspace-architecture.md` |
| | Session Management | ✅ `docs/explanation/session-management.md` |
| | File Routing | ✅ `docs/explanation/file-routing.md` |
| **First Actions** | Quick Start Tutorial | ❌ Missing (tutor-mode compensates) |
| | Memory Basics How-To | ⚠️ Incomplete |
| | Session Lifecycle How-To | ⚠️ Incomplete |
| **Core Skills** | Parallel Execution Guide | ⚠️ Mixed into CLAUDE.md |
| | Coordination Patterns | ✅ `docs/how-to/choose-coordination-approach.md` |
| | Integration Testing | ✅ `docs/how-to/integration-testing-guide.md` |
| **Advanced** | Swarm Topologies Reference | ❌ Missing |
| | Consensus Mechanisms Reference | ❌ Missing |
| | Hive-Mind Guide | ⚠️ Fragmented across sessions |

**Gap Analysis**:
- ✅ **Explanations** are strong (architecture, sessions, routing)
- ⚠️ **How-tos** are incomplete (need basic operations guides)
- ❌ **Tutorials** are missing entirely (tutor-mode provides exercises instead)
- ❌ **Reference** is weak (need API docs, agent catalog)

---

## 4. Projects vs Docs Recommendation

### 4.1 Should There Be a Separate `projects/` Folder?

**YES - Strong Evidence**

**Evidence 1: Mixed Purpose Problem**
- Current `docs/` mixes guides with project artifacts
- Git status shows `docs/projects/` exists but is empty
- Session artifacts show natural project organization pattern

**Evidence 2: Inbox Precedent**
- Inbox cleanly separates "for users" vs "about system" vs "external agents"
- Same separation principle applies to "documentation" vs "projects"

**Evidence 3: Session Promotion Pattern**
- Sessions create `artifacts/{code,tests,docs,scripts,notes}/`
- After closeout, artifacts should be **promoted** somewhere
- Currently unclear whether promotion goes to `docs/` (wrong) or elsewhere

**Evidence 4: User Expectation**
> "I want to create a separate projects/ folder"

**Recommendation**: Create `projects/` at root level with clear organization.

### 4.2 What Belongs in Each?

**`docs/` - User-Facing Documentation ONLY**
- **tutorials/** - Step-by-step learning exercises
- **how-to/** - Task-oriented recipes
- **explanation/** - Conceptual understanding
- **reference/** - Quick lookups (API, commands, agents)
- **troubleshooting/** - Common issues and solutions

**`projects/` - Completed Project Artifacts**
```
projects/
  <project-name>/
    README.md          # Project overview
    code/              # Source code (promoted from session)
    tests/             # Test suites (promoted from session)
    docs/              # Project-specific documentation
    scripts/           # Build/deploy scripts
    notes/             # Design decisions, architecture notes
    .metadata          # Links back to originating session
```

**`inbox/assistant/` - System Development Work**
- Architectural research
- Integration investigations
- Protocol design
- "Working on the system" documentation

**`sessions/` - Temporary Work-in-Progress**
- Active session artifacts
- Closed sessions in `.archive/`
- Captain's log (decisions journal)

### 4.3 Tradeoffs

**Advantages of Separate `projects/`**:
- ✅ Clear separation of concerns
- ✅ Natural promotion target from sessions
- ✅ Matches user expectation
- ✅ Scales as workspace grows
- ✅ Easier to find completed work

**Disadvantages**:
- ⚠️ One more top-level directory (but justified by clear purpose)
- ⚠️ Need to update CLAUDE.md with routing rules
- ⚠️ Need to migrate existing project artifacts from `docs/`

**Decision**: Advantages strongly outweigh disadvantages.

---

## 5. Framework Alignment

### 5.1 Diátaxis Framework (Current)

**Current Implementation**:
```
docs/
  tutorials/        # Learn by doing
  how-to/          # Solve problems
  explanation/     # Understand concepts
  reference/       # Look up facts
  internals/       # Technical deep-dives (extension)
```

**Assessment**:
- ✅ Diátaxis is **appropriate** for user-facing documentation
- ✅ Provides clear purpose-driven navigation
- ✅ Widely adopted (Django, NumPy, many OSS projects)
- ⚠️ Current implementation **incomplete** (tutorials empty, reference weak)

**User Concern**: "organizational frameworks patching faulty content"

**Diagnosis**: Framework is NOT the problem. The problem is:
1. **Incomplete implementation** (missing tutorials/reference)
2. **Mixed content** (projects mixed with docs)
3. **Unclear entry point** (new users don't know where to start)

### 5.2 Recommended Framework Application

**Keep Diátaxis for `docs/`** - It's working as intended

**Extend with Clear Structure**:

```
<root>/
  docs/                    # USER-FACING DOCUMENTATION (Diátaxis)
    README.md             # Gateway: "What's your goal?"
    tutorials/            # Learning path (reference tutor-mode)
    how-to/               # Task recipes
    explanation/          # Conceptual understanding
    reference/            # API docs, command reference, agent catalog
    troubleshooting/      # Common issues

  projects/               # COMPLETED PROJECT ARTIFACTS
    <project-name>/       # One folder per project
      README.md           # Project overview
      code/               # Promoted from session
      tests/              # Promoted from session
      docs/               # Project-specific docs
      notes/              # Design decisions

  inbox/                  # CROSS-SESSION COMMUNICATION
    assistant/            # System development work
    codex-agent/          # External research (read-only)
    cursor-agent/         # External research (read-only)
    user/                 # User-provided materials

  sessions/               # TEMPORARY WORK
    session-*/            # Active sessions
    .archive/             # Closed sessions
    captains-log/         # Decision journal
```

### 5.3 Navigation Principles

**Entry Points by User Goal**:

1. **"I'm new, where do I start?"**
   → `/tutor-mode` skill (interactive)
   → `docs/README.md` (self-serve)
   → `docs/explanation/workspace-architecture.md` (deep dive)

2. **"I want to build something"**
   → `docs/tutorials/` (step-by-step)
   → `docs/how-to/` (specific tasks)
   → `projects/<similar-project>/` (examples)

3. **"I need to understand how X works"**
   → `docs/explanation/` (concepts)
   → `docs/internals/` (technical details)
   → `inbox/assistant/` (system development notes)

4. **"I need quick facts"**
   → `docs/reference/` (commands, APIs, agents)
   → `CLAUDE.md` (quick reference)

5. **"Something's broken"**
   → `docs/troubleshooting/` (common issues)
   → `inbox/assistant/closeout-investigation/` (past debugging)

---

## 6. Prioritized Requirements

### 6.1 Critical (Must-Have)

**Priority 1**: **Separate `projects/` from `docs/`**
- **Why**: Fundamental organizational clarity
- **Evidence**: User stated need, mixed-purpose problem, inbox precedent
- **Effort**: Medium (need migration plan)
- **Impact**: High (solves core confusion)

**Priority 2**: **Clear Entry Point for New Users**
- **Why**: User hasn't learned system yet, needs starting point
- **Evidence**: User is new, tutor-mode exists but needs integration
- **Effort**: Low (update docs/README.md)
- **Impact**: High (reduces onboarding friction)

**Priority 3**: **Complete Diátaxis Implementation**
- **Why**: Framework is good, but incomplete = confusing
- **Evidence**: Empty tutorials/, weak reference/, user concern about frameworks
- **Effort**: High (need content creation)
- **Impact**: High (improves learning experience)

### 6.2 High Priority (Should-Have)

**Priority 4**: **File Routing Documentation**
- **Why**: Users need clear rules on where files go
- **Evidence**: CLAUDE.md has rules, but they're buried in dense config
- **Effort**: Medium (extract and clarify)
- **Impact**: Medium (prevents file pollution)

**Priority 5**: **Reference Documentation** (API, Commands, Agents)
- **Why**: Quick lookups are missing
- **Evidence**: Diátaxis implementation incomplete
- **Effort**: High (need comprehensive catalog)
- **Impact**: Medium (improves efficiency for advanced users)

### 6.3 Medium Priority (Nice-to-Have)

**Priority 6**: **Example Projects**
- **Why**: Learning by example is powerful
- **Evidence**: Tutor-mode exercises exist, but no full project examples
- **Effort**: High (need to promote sessions)
- **Impact**: Medium (helps intermediate+ users)

**Priority 7**: **Cross-Reference System**
- **Why**: Connect related docs across categories
- **Evidence**: Diátaxis encourages cross-linking
- **Effort**: Medium (need systematic review)
- **Impact**: Low (nice polish)

---

## 7. Structural Recommendations

### 7.1 Recommended Top-Level Organization

```
common-thread-sandbox/
├── docs/                      # USER-FACING DOCS (Diátaxis)
│   ├── README.md             # Gateway: "What's your goal?" + framework explanation
│   ├── getting-started.md    # New user quick start
│   ├── tutorials/            # Learn by doing (reference tutor-mode exercises)
│   ├── how-to/               # Task recipes
│   ├── explanation/          # Conceptual understanding
│   ├── reference/            # API, commands, agents
│   ├── troubleshooting/      # Common issues
│   └── internals/            # Technical deep-dives
│
├── projects/                  # COMPLETED PROJECT ARTIFACTS
│   ├── README.md             # Index of projects
│   ├── <project-1>/          # One folder per project
│   ├── <project-2>/
│   └── ...
│
├── inbox/                     # CROSS-SESSION COMMUNICATION
│   ├── README.md             # Inbox usage guide
│   ├── assistant/            # System development work
│   ├── codex-agent/          # External research (read-only)
│   ├── cursor-agent/         # External research (read-only)
│   └── user/                 # User materials
│
├── sessions/                  # TEMPORARY WORK
│   ├── README.md             # Session management guide
│   ├── session-*/            # Active sessions
│   ├── .archive/             # Closed sessions
│   └── captains-log/         # Decision journal
│
├── .claude/                   # CLAUDE CODE CONFIG
│   ├── skills/               # Available skills
│   ├── commands/             # Slash commands
│   └── settings.json         # Configuration
│
├── .swarm/                    # INFRASTRUCTURE
│   ├── memory.db             # Cross-session memory
│   └── backups/              # Session state archives
│
├── CLAUDE.md                  # Workspace configuration
└── README.md                  # Workspace overview
```

### 7.2 Migration Plan

**Phase 1: Establish Structure** (1 hour)
1. Create `projects/` directory
2. Create `projects/README.md` with index
3. Update `docs/README.md` with clear entry points
4. Update `CLAUDE.md` with file routing to `projects/`

**Phase 2: Migrate Content** (2-3 hours)
1. Move project artifacts from `docs/` to `projects/`
2. Move system development notes from `docs/` to `inbox/assistant/`
3. Update cross-references in remaining docs
4. Verify no broken links

**Phase 3: Fill Gaps** (Ongoing)
1. Create missing tutorials (reference tutor-mode)
2. Build reference documentation (API, commands, agents)
3. Document common troubleshooting scenarios
4. Promote exemplary sessions to `projects/`

### 7.3 File Routing Rules (Updated)

**New Files Always Go To**:
- **Session artifacts**: `sessions/<session-id>/artifacts/{code,tests,docs,scripts,notes}/`
- **NEVER** to root folders during session work

**After Session Closeout, Promote To**:
- **Completed projects**: `projects/<project-name>/` (promoted from session)
- **User-facing guides**: `docs/{tutorials,how-to,explanation,reference}/` (if documentation)
- **System development**: `inbox/assistant/<dated-topic>/` (if architectural research)
- **Decision log**: `sessions/captains-log/YYYY-MM-DD.md` (approved summary)

**Exceptions (Edit in Place)**:
- Workspace config: `CLAUDE.md`, `package.json`, `.claude/settings.json`
- Existing project files: Only if explicitly updating live code

---

## 8. Best Practices Alignment

### 8.1 Claude Code Recommendations

From global CLAUDE.md rules:
> "NEVER save working files, text/mds and tests to the root folder"
> "ALWAYS organize files in appropriate subdirectories (session artifacts)"

**Implication**: `projects/` aligns with this principle - it's a **promotion target**, not a working directory.

### 8.2 Claude Flow Recommendations

From CLAUDE.md:
> "Stock-First Score: 82/100 (68% stock architecture / 97.5% stock implementation)"

**Principle**: Minimize custom extensions, leverage stock features.

**Implication**:
- ✅ Keep using stock claude-flow session management
- ✅ Keep using stock hooks (pre-task, post-edit, session-end)
- ✅ Diátaxis is NOT a custom extension, it's a documentation pattern
- ✅ `projects/` is NOT a custom extension, it's organizational clarity

### 8.3 Documentation Best Practices

**From Diátaxis**:
- Don't mix purposes (tutorials ≠ how-tos ≠ explanations ≠ reference)
- Match user goals to doc types
- Cross-reference across categories

**From General Doc Principles**:
- Single source of truth (no duplication)
- Clear hierarchy (easy navigation)
- Progressive disclosure (don't overwhelm)
- Update atomicity (one place to change)

**Alignment Check**:
- ✅ Diátaxis prevents purpose mixing
- ✅ Separate `projects/` prevents artifact mixing
- ✅ Clear entry points (tutor-mode + docs/README.md)
- ⚠️ Some duplication exists (CLAUDE.md vs docs/) - needs audit

---

## 9. Tutor-Mode Integration

### 9.1 Role of Tutor-Mode

**From `.claude/skills/tutor-mode/SKILL.md`**:
> "Tutor Mode is an intelligent learning assistant that guides users from Claude-Flow fundamentals through advanced multi-agent orchestration."

**Key Features**:
- Personalized learning paths (4 phases)
- Context-aware guidance (references workspace docs)
- Progressive disclosure (reveals complexity gradually)
- Hands-on exercises (real projects at each level)
- Progress tracking (via memory)

**Relationship to `docs/`**:
> "The tutor references these [workspace docs] automatically when answering questions."

**Implication**: Tutor-mode is the **interactive gateway**, `docs/` is the **reference material**.

### 9.2 Entry Point Strategy

**Recommended Flow**:

**For Interactive Learners**:
1. Invoke `/tutor start`
2. Answer assessment questions
3. Follow personalized learning path
4. Tutor references `docs/` as needed

**For Self-Serve Learners**:
1. Read `docs/README.md` → "What's your goal?"
2. Navigate to appropriate category (tutorials/how-to/explanation/reference)
3. Follow documentation trail
4. Invoke `/tutor help` if stuck

**For Experienced Users**:
1. Jump directly to `docs/reference/` for quick lookups
2. Use `CLAUDE.md` for configuration reference
3. Explore `projects/` for examples

**For Developers/Debuggers**:
1. Read `docs/explanation/workspace-architecture.md` for system overview
2. Deep dive into `docs/internals/` for technical details
3. Check `inbox/assistant/` for system development notes

### 9.3 Documentation Requirements for Tutor-Mode

Tutor-mode needs comprehensive docs to reference:

**Must Exist**:
- ✅ Workspace architecture (already exists)
- ✅ Session management (already exists)
- ✅ File routing (already exists)
- ⚠️ Memory operations (incomplete)
- ❌ Agent catalog (missing)
- ❌ Command reference (missing)
- ❌ Troubleshooting guide (exists but incomplete)

**Quality Requirements**:
- SAFE score ≥70 (verified, multi-agent created)
- Clear examples for each concept
- Cross-referenced (link to related docs)
- Up-to-date (reflect current implementation)

---

## 10. Recommendations Summary

### 10.1 Immediate Actions (Session Deliverables)

**Deliverable 1: `projects/` Structure Proposal**
- Directory structure specification
- README template
- Promotion guidelines from sessions
- Integration with CLAUDE.md routing

**Deliverable 2: `docs/README.md` Rewrite**
- Clear entry points by user goal
- Tutor-mode integration
- Diátaxis framework explanation (keep it!)
- Navigation guide

**Deliverable 3: File Routing Clarification**
- Simple decision tree: "Where does this file go?"
- Session artifacts rules
- Promotion rules after closeout
- Exception cases (config files)

**Deliverable 4: Gap Analysis**
- What's missing from tutorials/reference
- Priority order for content creation
- Effort estimates
- Impact assessment

### 10.2 Follow-Up Work (Future Sessions)

**Content Creation**:
- Complete tutorials/ (can reference tutor-mode exercises)
- Build reference/ (API docs, command catalog, agent types)
- Enhance troubleshooting/ (common issues + solutions)
- Audit and remove duplication

**Migration**:
- Move project artifacts from docs/ to projects/
- Move system notes from docs/ to inbox/assistant/
- Update all cross-references
- Verify no broken links

**Quality Improvement**:
- Audit content for SAFE scores
- Multi-agent review of key docs
- Integration testing (verify links work)
- User testing (onboard new user, observe friction)

### 10.3 Success Criteria

**User Can**:
- ✅ Find entry point in <30 seconds (docs/README.md or /tutor)
- ✅ Understand where files go (clear routing rules)
- ✅ Navigate by goal (tutorial/how-to/explanation/reference)
- ✅ Find examples (projects/ folder)
- ✅ Distinguish user docs from system notes
- ✅ Progress through learning phases (tutor-mode integration)

**Structure Is**:
- ✅ Logically organized (single responsibility per folder)
- ✅ Scalable (easy to add new content)
- ✅ Maintainable (clear ownership and update paths)
- ✅ Stock-compliant (minimal custom extensions)

---

## Conclusion

**User's core need**: Separate mixed-purpose `docs/` into clean categories:
- **docs/** → User-facing documentation ONLY (keep Diátaxis)
- **projects/** → Completed project artifacts (NEW)
- **inbox/assistant/** → System development work (already exists)
- **sessions/** → Temporary work (already exists)

**Key insight**: The problem is NOT the Diátaxis framework (which is working as intended). The problem is:
1. **Mixed content** (projects + docs + system notes all in docs/)
2. **Incomplete implementation** (empty tutorials/, weak reference/)
3. **Unclear entry point** (new users don't know where to start)

**Recommended approach**:
1. Create `projects/` structure (separate concern)
2. Enhance `docs/README.md` (clear entry points)
3. Integrate tutor-mode (interactive gateway)
4. Fill gaps in Diátaxis (tutorials, reference)
5. Migrate misplaced content (projects, system notes)

**Success indicator**: A new user can answer "Where do I start?" and "Where does this file go?" in <30 seconds without help.

---

**Next Steps**: Present this analysis to user for validation, then proceed with structural proposals based on approved direction.
