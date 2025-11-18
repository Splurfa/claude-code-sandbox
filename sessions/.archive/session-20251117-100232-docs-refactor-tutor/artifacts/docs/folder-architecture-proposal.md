# Documentation Folder Architecture Proposal

**Session**: session-20251117-100232-docs-refactor-tutor
**Created**: 2025-11-17
**Status**: HITL Checkpoint #1 - Awaiting Approval

---

## Executive Summary

This proposal presents three documentation architecture options designed for a non-technical user learning a claude-flow workspace. Each option separates user-facing guides from system-level documentation while supporting the tutor-mode skill integration.

**Current State Analysis:**
- Existing structure uses **Divio documentation system** (tutorials, how-to, reference, explanation)
- 6 categories in `docs/guides/`: getting-started, how-to, reference, troubleshooting, concepts, advanced
- 20+ existing documentation files organized by type
- Strong separation between user guides (`docs/guides/`) and session artifacts
- No dedicated learning path or progression structure

**Target Audience:**
- Non-technical user learning claude-flow
- Needs clear progression from beginner to advanced
- Requires separation of "using the system" vs "building the system"
- Benefits from integrated tutor-mode support

---

## Option 1: Learning Path Architecture (RECOMMENDED)

### Structure
```
docs/
├── README.md                          # Main entry point with learning paths
├── learning/                          # NEW: Structured learning progression
│   ├── 00-start-here.md              # Absolute beginner onboarding
│   ├── 01-foundations/               # Week 1: Core concepts
│   │   ├── what-is-claude-flow.md
│   │   ├── understanding-agents.md
│   │   ├── memory-and-coordination.md
│   │   └── your-first-session.md
│   ├── 02-essential-skills/          # Week 2: Basic operations
│   │   ├── spawning-agents.md
│   │   ├── using-hooks.md
│   │   ├── session-management.md
│   │   └── reading-output.md
│   ├── 03-intermediate/              # Week 3-4: Complex tasks
│   │   ├── multi-agent-coordination.md
│   │   ├── hive-mind-basics.md
│   │   ├── troubleshooting-common-issues.md
│   │   └── checkpoint-patterns.md
│   ├── 04-advanced/                  # Month 2+: Power user
│   │   ├── custom-topologies.md
│   │   ├── consensus-mechanisms.md
│   │   ├── performance-optimization.md
│   │   └── neural-training.md
│   └── progress-tracker.md           # Self-assessment checklist
│
├── guides/                            # EXISTING: Task-oriented references
│   ├── README.md                     # Updated with learning path links
│   ├── getting-started/              # Quick starts (kept for compatibility)
│   ├── how-to/                       # Step-by-step task guides
│   ├── reference/                    # Quick lookups & checklists
│   ├── troubleshooting/              # Problem-solving guides
│   ├── concepts/                     # Architecture explanations
│   └── advanced/                     # Advanced patterns
│
├── system/                            # NEW: System-level documentation
│   ├── architecture/                 # System design documents
│   │   ├── workspace-architecture.md
│   │   ├── integration-points.md
│   │   ├── stock-vs-custom.md
│   │   └── decision-records/        # ADRs (Architecture Decision Records)
│   ├── development/                  # For developers extending the system
│   │   ├── contributing.md
│   │   ├── adding-agents.md
│   │   ├── custom-hooks.md
│   │   └── testing-protocols.md
│   ├── maintenance/                  # Operational documentation
│   │   ├── upgrade-guides.md
│   │   ├── backup-restore.md
│   │   └── health-monitoring.md
│   └── api/                          # Technical references
│       ├── mcp-tools-reference.md
│       ├── hooks-api.md
│       └── memory-api.md
│
└── projects/                          # EXISTING: Project templates
```

### Rationale

**Strengths:**
- **Clear learning progression**: Numbered paths (00-04) guide non-technical users from basics to mastery
- **Time-based milestones**: Week 1, Week 2, Month 2+ helps set realistic expectations
- **Separation of concerns**: `learning/` for education, `guides/` for reference, `system/` for development
- **Tutor-mode ready**: Learning paths integrate naturally with step-by-step tutorial generation
- **Minimal disruption**: Preserves existing `guides/` structure (backward compatible)
- **Self-paced progress**: `progress-tracker.md` allows users to assess their own competency

**Tutor-Mode Integration:**
```bash
# Tutor skill can reference learning paths
npx claude-flow tutor --path "learning/01-foundations/understanding-agents.md"

# Generate exercises based on current learning level
npx claude-flow tutor --level "02-essential-skills" --generate-exercises

# Track progress
npx claude-flow tutor --update-progress "01-foundations/your-first-session.md"
```

**Migration Plan:**
1. Create `docs/learning/` structure
2. Write `00-start-here.md` entry point
3. Migrate beginner content from `guides/getting-started/` to `learning/01-foundations/`
4. Create `system/` folder and move architectural docs from `guides/reference/`
5. Update `docs/README.md` with learning path navigation
6. Add `progress-tracker.md` with self-assessment questions

---

## Option 2: Audience-Segmented Architecture

### Structure
```
docs/
├── README.md                          # Audience router
├── for-users/                         # Non-technical audience
│   ├── README.md                     # "Start here if you're learning"
│   ├── onboarding/                   # First 2 weeks
│   │   ├── welcome.md
│   │   ├── setup-verification.md
│   │   └── first-steps.md
│   ├── using-claude-flow/            # Core tasks
│   │   ├── agents/
│   │   ├── sessions/
│   │   ├── memory/
│   │   └── coordination/
│   ├── troubleshooting/              # User-level problem solving
│   └── faq.md
│
├── for-developers/                    # Technical audience
│   ├── README.md                     # "Start here if you're extending"
│   ├── architecture/
│   ├── extending/
│   │   ├── custom-agents.md
│   │   ├── custom-hooks.md
│   │   └── integrations.md
│   ├── api-reference/
│   └── testing/
│
├── for-administrators/                # Operations audience
│   ├── installation.md
│   ├── configuration.md
│   ├── monitoring.md
│   ├── backup-restore.md
│   └── troubleshooting-advanced.md
│
└── reference/                         # Cross-audience quick lookups
    ├── commands/
    ├── agents/
    ├── mcp-tools/
    └── glossary.md
```

### Rationale

**Strengths:**
- **Clear audience targeting**: Users immediately know which folder to enter
- **Role-based organization**: Matches how people think about their relationship to the system
- **Reduced cognitive load**: Each folder contains ONLY relevant information for that audience
- **Professional documentation pattern**: Common in enterprise software

**Weaknesses:**
- **Content duplication risk**: Some topics (e.g., "what is an agent?") need different depths
- **Less obvious progression**: No built-in learning path like Option 1
- **Breaking change**: Requires complete reorganization of existing `guides/`

**Tutor-Mode Integration:**
```bash
# Tutor defaults to for-users/ content
npx claude-flow tutor --audience "user" --topic "agents"

# Can escalate to developer content when ready
npx claude-flow tutor --audience "developer" --topic "custom-agents"
```

**Migration Plan:**
1. Create `for-users/`, `for-developers/`, `for-administrators/` folders
2. Categorize existing content by audience
3. Migrate `guides/` content to appropriate audience folders
4. Create audience-specific READMEs with navigation
5. Build cross-reference index in `reference/`
6. Update main `docs/README.md` as audience router

---

## Option 3: Hybrid Learning + Reference Architecture

### Structure
```
docs/
├── README.md                          # Dual entry: Learning path OR quick reference
├── learn/                             # Progressive learning (for learners)
│   ├── curriculum.md                 # Complete course outline
│   ├── beginner/
│   │   ├── week-1-foundations.md
│   │   ├── week-2-basic-operations.md
│   │   ├── exercises/                # Hands-on practice
│   │   └── quizzes/                  # Self-assessment
│   ├── intermediate/
│   │   ├── month-2-coordination.md
│   │   ├── month-3-optimization.md
│   │   └── projects/                 # Small real-world projects
│   ├── advanced/
│   │   ├── mastery-topics.md
│   │   └── capstone-projects/
│   └── tutor-integration/            # Tutor skill files
│       ├── lesson-plans/
│       └── progress-tracking/
│
├── reference/                         # Quick lookups (for doers)
│   ├── quick-start.md                # 5-minute "just get started"
│   ├── commands/                     # All CLI commands
│   ├── agents/                       # Agent type reference
│   ├── patterns/                     # Common patterns & recipes
│   │   ├── simple-agent-spawn.md
│   │   ├── multi-agent-coordination.md
│   │   ├── session-checkpoint.md
│   │   └── error-recovery.md
│   ├── troubleshooting/
│   └── api/                          # Technical API docs
│
└── system/                            # System documentation (for builders)
    ├── architecture/
    ├── development/
    └── operations/
```

### Rationale

**Strengths:**
- **Dual-mode support**: Learners follow `learn/`, experienced users use `reference/`
- **Best of both worlds**: Combines learning progression + quick reference
- **Tutor-mode native**: Dedicated `learn/tutor-integration/` folder
- **Flexible entry points**: Users can start in either mode based on preference
- **Exercise integration**: Built-in practice materials and projects

**Weaknesses:**
- **More complex structure**: Three top-level folders require careful explanation
- **Potential confusion**: Users might not know whether to use `learn/` or `reference/`
- **Higher maintenance**: Need to keep lesson plans and references in sync

**Tutor-Mode Integration:**
```bash
# Tutor can generate lessons from curriculum
npx claude-flow tutor --curriculum "learn/curriculum.md" --week 1

# Interactive exercises
npx claude-flow tutor --exercise "learn/beginner/exercises/first-agent.md"

# Track progress through curriculum
npx claude-flow tutor --progress

# Generate quizzes
npx claude-flow tutor --quiz "week-2-basic-operations"
```

**Migration Plan:**
1. Create `learn/`, `reference/`, `system/` folders
2. Write `learn/curriculum.md` with complete learning outline
3. Extract tutorial content from `guides/` into `learn/beginner/`
4. Move how-to guides to `reference/patterns/`
5. Move system docs to `system/`
6. Create exercises and quizzes for each learning module
7. Update `docs/README.md` with dual-path navigation

---

## Comparison Matrix

| Criteria | Option 1: Learning Path | Option 2: Audience-Segmented | Option 3: Hybrid |
|----------|------------------------|------------------------------|------------------|
| **Beginner Friendliness** | ⭐⭐⭐⭐⭐ Clear progression | ⭐⭐⭐⭐ Clear audience | ⭐⭐⭐⭐ Flexible entry |
| **Tutor Integration** | ⭐⭐⭐⭐⭐ Natural paths | ⭐⭐⭐ Per-audience | ⭐⭐⭐⭐⭐ Dedicated folder |
| **Migration Effort** | ⭐⭐⭐⭐ Additive | ⭐⭐ Complete reorg | ⭐⭐⭐ Moderate |
| **Backward Compatibility** | ⭐⭐⭐⭐⭐ Preserves guides/ | ⭐ Breaking change | ⭐⭐⭐⭐ Minimal disruption |
| **Quick Reference** | ⭐⭐⭐ Via guides/ | ⭐⭐⭐⭐ Dedicated | ⭐⭐⭐⭐⭐ Dedicated |
| **Scalability** | ⭐⭐⭐⭐ Easy to expand | ⭐⭐⭐⭐⭐ Role-based growth | ⭐⭐⭐ More structure |
| **Maintenance** | ⭐⭐⭐⭐ Clear ownership | ⭐⭐⭐ Duplication risk | ⭐⭐⭐ Sync required |
| **Non-Technical User** | ⭐⭐⭐⭐⭐ Perfect fit | ⭐⭐⭐⭐ Clear path | ⭐⭐⭐⭐ Good fit |

---

## Recommended Approach: Option 1 (Learning Path Architecture)

### Why Option 1?

**Alignment with goals:**
1. ✅ **Non-technical user focused**: Numbered progression (00-04) provides clear milestones
2. ✅ **Minimal disruption**: Preserves existing `guides/` structure (100% backward compatible)
3. ✅ **Tutor-mode ready**: Learning paths integrate seamlessly with tutorial generation
4. ✅ **Low migration risk**: Additive changes only, no breaking reorganization
5. ✅ **Clear separation**: `learning/` (education) vs `guides/` (reference) vs `system/` (development)

**Key differentiators:**
- **Time-based expectations**: "Week 1", "Month 2" helps users understand realistic learning pace
- **Self-paced progress**: `progress-tracker.md` enables self-assessment without instructor
- **Minimal cognitive load**: Simple top-level structure (3 folders: learning, guides, system)
- **Natural tutor integration**: Lesson plans map directly to learning path structure

### Implementation Priority

**Phase 1: Foundation (Week 1)**
1. Create `docs/learning/` folder structure
2. Write `00-start-here.md` with welcome + orientation
3. Build `01-foundations/` with 4 core lessons
4. Create `progress-tracker.md` with self-assessment questions

**Phase 2: Content Migration (Week 2)**
5. Extract beginner content from `guides/getting-started/` → `learning/01-foundations/`
6. Create `system/` folder
7. Move architectural docs from `guides/reference/` → `system/architecture/`
8. Update `docs/README.md` with learning path navigation

**Phase 3: Intermediate Content (Week 3)**
9. Build `02-essential-skills/` lessons
10. Build `03-intermediate/` lessons
11. Create cross-references between `learning/` and `guides/`

**Phase 4: Advanced + Tutor Integration (Week 4)**
12. Build `04-advanced/` lessons
13. Create tutor-mode integration examples
14. Add exercise templates to each learning level
15. Final review and testing with non-technical user

---

## Naming Conventions

### Folder Names
- **Lowercase with hyphens**: `getting-started/`, `how-to/`, `multi-agent-coordination.md`
- **Numbered for sequence**: `00-start-here.md`, `01-foundations/`, `02-essential-skills/`
- **Descriptive, not generic**: `understanding-agents.md` NOT `guide-2.md`

### File Names
- **Action-oriented for how-tos**: `spawning-agents.md`, `troubleshooting-common-issues.md`
- **Noun-based for concepts**: `memory-and-coordination.md`, `consensus-mechanisms.md`
- **Clear learning level**: Files in `01-foundations/` are beginner, `04-advanced/` are expert

### Folder Purposes (Option 1)

| Folder | Purpose | Audience | Update Frequency |
|--------|---------|----------|------------------|
| `learning/` | Progressive education | Non-technical learners | Quarterly |
| `learning/01-foundations/` | Week 1 basics | Absolute beginners | Stable |
| `learning/02-essential-skills/` | Week 2 operations | New users | Monthly |
| `learning/03-intermediate/` | Month 1 complexity | Regular users | Monthly |
| `learning/04-advanced/` | Month 2+ mastery | Power users | Quarterly |
| `guides/how-to/` | Task recipes | All users | As needed |
| `guides/reference/` | Quick lookups | All users | As needed |
| `guides/troubleshooting/` | Problem solving | All users | Weekly |
| `guides/concepts/` | Architecture | Intermediate+ | Quarterly |
| `system/architecture/` | System design | Developers | Major versions |
| `system/development/` | Extension guides | Developers | As needed |
| `system/api/` | Technical reference | Developers | API changes |

---

## Migration Impact Analysis

### Files to Move

**From `guides/getting-started/` → `learning/01-foundations/`:**
- Currently empty, but future beginner tutorials go here

**From `guides/reference/` → `system/architecture/`:**
- `implementation-architecture.md`
- `session-mgmt-changes.md`
- `file-routing-changes.md`
- `skill-md-changes.md`
- `closeout-sh-changes.md`

**Stay in `guides/reference/` (user-facing):**
- `feature-verification-checklist.md`
- `hive-mind-quick-reference.md`
- `template-usage-guide.md`

**From `guides/advanced/` → `learning/04-advanced/`:**
- `adaptive-pivot-protocol.md` (after simplification for learners)

### Files to Create

**New learning content:**
- `learning/00-start-here.md`
- `learning/01-foundations/what-is-claude-flow.md`
- `learning/01-foundations/understanding-agents.md`
- `learning/01-foundations/memory-and-coordination.md`
- `learning/01-foundations/your-first-session.md`
- `learning/progress-tracker.md`

**New system docs:**
- `system/architecture/README.md`
- `system/development/contributing.md`
- `system/api/mcp-tools-reference.md`

### Breaking Changes

**None.** Option 1 is fully additive:
- Existing `guides/` structure remains functional
- Current links continue to work
- Users can choose learning path OR traditional guides

---

## Tutor-Mode Skill Integration Examples

### Example 1: Starting a Learning Path

```bash
# User invokes tutor for first time
npx claude-flow tutor --start

# Tutor reads learning/00-start-here.md
# Generates personalized welcome based on user's experience level
# Asks: "Have you used AI agents before?" → Routes to appropriate starting point
```

### Example 2: Generating Exercises

```bash
# User completes lesson
npx claude-flow tutor --lesson "learning/01-foundations/understanding-agents.md"

# Tutor generates 3 exercises:
# 1. Spawn a simple research agent
# 2. Check agent status with mcp__claude-flow__agent_list
# 3. Review agent output and explain what happened
```

### Example 3: Progress Tracking

```bash
# Tutor updates progress after successful exercise
npx claude-flow tutor --complete "01-foundations/understanding-agents"

# Updates learning/progress-tracker.md:
# [x] Understanding Agents (completed 2025-11-17)
# [ ] Memory and Coordination (in progress)
```

### Example 4: Adaptive Difficulty

```bash
# User struggles with multi-agent coordination
npx claude-flow tutor --help-with "spawning multiple agents"

# Tutor detects user is in 03-intermediate but struggling
# Recommends: "Let's review 02-essential-skills/spawning-agents.md first"
# Generates simpler exercises before returning to intermediate content
```

---

## Success Metrics

### User-Facing
- ✅ Non-technical user can find "where to start" in < 30 seconds
- ✅ Learning path provides clear "what's next" at every step
- ✅ Progress tracker shows measurable advancement
- ✅ Tutor-mode can generate exercises for any lesson

### Technical
- ✅ No broken links after migration
- ✅ All existing `guides/` references work
- ✅ 100% backward compatibility
- ✅ Documentation coverage: 80%+ of features have learning content

### Maintenance
- ✅ Clear ownership: learning content vs reference vs system docs
- ✅ Update frequency defined per folder
- ✅ New content has obvious placement (learning level or reference)

---

## Next Steps (After HITL Approval)

1. **Approve architecture** (this checkpoint)
2. **Create folder structure** (`learning/`, `system/`)
3. **Write `00-start-here.md`** (entry point)
4. **Build `01-foundations/`** (4 beginner lessons)
5. **Create `progress-tracker.md`** (self-assessment)
6. **Migrate system docs** (`guides/reference/` → `system/`)
7. **Update `docs/README.md`** (add learning path navigation)
8. **Test with non-technical user** (usability validation)

---

## Questions for HITL Checkpoint #1

1. **Does Option 1 (Learning Path) meet your learning needs?**
   - Clear progression: 00 → 01 → 02 → 03 → 04
   - Time expectations: Week 1, Week 2, Month 2+
   - Self-paced progress tracking

2. **Alternative preferences?**
   - Prefer Option 2 (Audience-Segmented)?
   - Prefer Option 3 (Hybrid Learning + Reference)?
   - Suggest modifications to Option 1?

3. **Learning path naming:**
   - OK with numbered folders (00-04)?
   - Prefer week-based? (`week-1-foundations/`)
   - Prefer level-based? (`beginner/`, `intermediate/`, `advanced/`)

4. **Tutor-mode priorities:**
   - Auto-generate exercises from lessons?
   - Interactive progress tracking?
   - Adaptive difficulty based on performance?

5. **Migration timeline:**
   - Prefer all-at-once (1 week)?
   - Prefer incremental (1 folder per week)?
   - Critical lessons to create first?

---

**Ready for HITL Approval**: This architecture proposal is complete and awaiting your decision on which option to implement.
