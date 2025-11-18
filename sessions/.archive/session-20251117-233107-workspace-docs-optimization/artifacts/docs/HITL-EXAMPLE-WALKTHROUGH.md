# HITL Framework: Example Walkthrough
## Real-World Application of Decision Checkpoint System

**Version**: 1.0
**Purpose**: Show exactly how coordination agent would use HITL framework
**Session**: session-20251117-233107-workspace-docs-optimization

---

## 🎬 Scenario: User Requests Workspace Organization

**User Request**: "Help me organize my workspace better. I've got docs scattered everywhere and I want a clean system."

---

## 📊 Phase 1: Analysis & Decision Identification

### Step 1: Coordination Agent Analyzes Request

**What agent sees**:
- Multiple organizational decisions needed
- Structural changes (affects daily workflow)
- No prior preferences in memory
- This is planning phase (good timing for checkpoints)

### Step 2: Agent Identifies Decisions

**Agent's decision inventory**:

| Decision | Category | Reasoning |
|----------|----------|-----------|
| Projects/ structure | **A** | Structural, daily use, multiple valid approaches |
| Archive workflow | **A** | Affects user's deletion comfort, permanent impact |
| Promotion criteria | **A** | When to move session docs → permanent docs/ |
| README.md template | **B** | Preference, has working defaults |
| Metadata schema | **B** | Nice to have, can iterate |
| Internal subdirs | **C** | Implementation detail, user never touches |
| Index generation | **C** | Technical, follows patterns |

### Step 3: Agent Checks Memory

```javascript
// Check for any prior decisions
const priorDecisions = await memory.retrieve({
  namespace: 'workspace-optimization-20251117',
  pattern: 'user-preferences/%'
});

// Result: Empty (new user, fresh start)
// Proceed with checkpoints
```

### Step 4: Agent Plans Checkpoints

**Batching strategy**:
```
Checkpoint 1 (Session Start):
├─ Projects/ structure        [Category A]
├─ Archive workflow           [Category A]
└─ Promotion criteria         [Category A]

Later (After Implementation):
├─ README.md template         [Category B - show working example]
└─ Metadata schema            [Category B - suggest alternatives]

Never Ask:
├─ Internal subdirectories    [Category C - agent decides]
└─ Index generation logic     [Category C - agent decides]
```

**Rationale**:
- Batch 3 related Category A decisions (all about structure)
- Good timing (session start, user engaged)
- Category B after user sees working system
- Category C never surfaces to user

---

## 🔹 Checkpoint 1: Projects/ Structure

### Agent Creates Checkpoint

**Template Selected**: Multiple Choice (Category A, 4 approaches, structural)

**Checkpoint Presentation**:

```markdown
🔹 DECISION CHECKPOINT: Projects/ Directory Structure

**Context**: You'll interact with projects/ daily to track ongoing and completed work. The structure affects how quickly you can find projects and how naturally you can organize new ones.

**We need to choose**: How should we organize projects/ directory?

---

### Option A: By Project Type
**How it works**: Group projects by their nature (research/, execution/, strategic/)

**Pros**:
  - Clear separation of project categories
  - Easy to find similar projects
  - Naturally organizes related work

**Cons**:
  - Projects may evolve across types
  - Boundaries can blur (research that becomes execution)

**Best for**: Users who think in terms of project categories

**Example**:
```
projects/
├── research/
│   ├── ai-agent-architectures/
│   └── workflow-optimization/
├── execution/
│   ├── docs-refactor/
│   └── integration-testing/
└── strategic/
    └── q1-2025-planning/
```

---

### Option B: By Project Status
**How it works**: Organize by lifecycle stage (active/, planning/, completed/)

**Pros**:
  - Reflects workflow stages naturally
  - Easy to see what's in flight vs done
  - Supports workflow transitions

**Cons**:
  - Projects move between folders as status changes
  - Requires maintenance to keep current

**Best for**: Users who think in workflow stages

**Example**:
```
projects/
├── active/
│   ├── docs-refactor/
│   └── integration-testing/
├── planning/
│   ├── ai-agent-architectures/
│   └── q1-2025-planning/
└── completed/
    └── workflow-optimization/
```

---

### Option C: By Domain/Topic
**How it works**: Group by subject area (ai-systems/, business/, technical/)

**Pros**:
  - Scales well to many projects
  - Keeps related knowledge together
  - Natural for domain-focused work

**Cons**:
  - Domain boundaries may blur
  - Cross-domain projects need choice

**Best for**: Users with clear domain specializations

**Example**:
```
projects/
├── ai-systems/
│   ├── ai-agent-architectures/
│   └── workflow-optimization/
├── business/
│   └── q1-2025-planning/
└── technical/
    ├── docs-refactor/
    └── integration-testing/
```

---

### Option D: Flat with Rich Metadata
**How it works**: All projects/ in one directory, organized via frontmatter tags

**Pros**:
  - Maximum flexibility (tags, dates, status all in metadata)
  - No need to move files
  - Powerful search and filtering

**Cons**:
  - Requires discipline with metadata
  - Less visual structure
  - May feel cluttered with many projects

**Best for**: Users comfortable with tag-based organization

**Example**:
```
projects/
├── ai-agent-architectures.md
├── docs-refactor.md
├── integration-testing.md
├── q1-2025-planning.md
└── workflow-optimization.md

# Each file has frontmatter:
---
type: research
status: active
domain: ai-systems
started: 2025-11-01
tags: [architecture, agents, distributed-systems]
---
```

---

### Option E: Show Me More / I Have a Different Idea

**If you choose E, what would help?**
- [ ] See real examples from my current workspace
- [ ] Understand how this affects daily workflow
- [ ] Explain a hybrid approach I'm thinking of

---

**Your choice**: ___

**Follow-up questions** (optional): ___
```

---

## 💬 User Response Processing

### Scenario A: User Picks Option B (By Status)

**User says**: "Option B - I think in terms of active vs planning vs done"

**Agent response**:
```javascript
// 1. Store decision
await memory.store({
  namespace: 'workspace-optimization-20251117',
  key: 'user-preferences/projects-structure',
  value: {
    approach: 'by-status',
    option: 'B',
    rationale: 'User thinks in workflow stages',
    timestamp: Date.now()
  }
});

// 2. Acknowledge and proceed
// "Got it - we'll organize projects/ by status (active/planning/completed)"

// 3. Apply to next checkpoint
// Archive workflow should align with status-based thinking
```

---

### Scenario B: User Picks Option E (Show Me More)

**User says**: "E - I want to see real examples from my workspace"

**Agent response**:
```javascript
// 1. Scan user's current workspace
const currentProjects = await scanWorkspace();

// 2. Show how each approach would organize THEIR projects
// Create concrete examples using their actual data

// 3. Present refined checkpoint with user's real data
```

**Refined checkpoint**:
```markdown
🔹 DECISION CHECKPOINT: Projects/ Structure (with your data)

Here's how each approach would organize YOUR current projects:

**Your current projects**:
- docs-refactor (in progress, technical)
- ai-agent-architectures (research, planning phase)
- workflow-optimization (completed, research)
- integration-testing (in progress, technical)
- q1-2025-planning (strategic, planning)

---

### Option A: By Type
```
projects/
├── research/
│   ├── ai-agent-architectures/
│   └── workflow-optimization/
├── execution/
│   ├── docs-refactor/
│   └── integration-testing/
└── strategic/
    └── q1-2025-planning/
```
Puts your 2 research projects together, separates execution work.

---

### Option B: By Status
```
projects/
├── active/
│   ├── docs-refactor/
│   └── integration-testing/
├── planning/
│   ├── ai-agent-architectures/
│   └── q1-2025-planning/
└── completed/
    └── workflow-optimization/
```
Shows what's in flight (2), what's planning (2), what's done (1).

---

[... other options with user's data ...]

**Now choose**: ___
```

---

### Scenario C: User Has Different Idea

**User says**: "E - I want a hybrid: by domain but with status subfolders"

**Agent response**:
```javascript
// 1. Validate hybrid approach
// "Interesting - so ai-systems/active/, ai-systems/completed/, etc.?"

// 2. If user confirms, store as custom approach
await memory.store({
  namespace: 'workspace-optimization-20251117',
  key: 'user-preferences/projects-structure',
  value: {
    approach: 'hybrid-domain-status',
    structure: 'domain/status/project',
    rationale: 'User wants domain grouping with status visibility',
    timestamp: Date.now()
  }
});

// 3. Acknowledge and proceed
// "Got it - we'll organize by domain (ai-systems/, business/, technical/)
//  with status subdirs (active/, planning/, completed/) under each"
```

---

## 🔹 Checkpoint 2: Archive Workflow

**Agent prepares based on prior decision**:

Since user chose status-based organization, archive workflow should align:
- Active → Completed → Archive (natural progression)
- OR: Completed is the archive (no separate step)

**Checkpoint Presentation**:

```markdown
🔹 DECISION CHECKPOINT: Archive Workflow

**Context**: You chose status-based organization (active/planning/completed). Now we need to decide what happens to completed projects over time.

**We need to choose**: Archive strategy for completed projects

---

### Option A: Completed IS Archive
**How it works**: Keep all completed projects in `projects/completed/` indefinitely

**Pros**:
  - Simple - no additional step
  - Easy to reference old projects
  - Nothing gets lost

**Cons**:
  - Completed/ folder grows forever
  - May clutter over time

**Best for**: Users who reference old projects regularly

---

### Option B: Auto-Archive After 90 Days
**How it works**: Completed projects auto-move to `.archive/` after 90 days

**Pros**:
  - Keeps projects/ clean
  - Old projects still accessible
  - Automatic (no manual work)

**Cons**:
  - May archive projects you still reference
  - Need to remember where things went

**Best for**: Users comfortable with aggressive cleanup

---

### Option C: Manual Archive Decision
**How it works**: System prompts you to archive/keep when projects are 90+ days old

**Pros**:
  - You decide what to keep visible
  - Prevents accidental archiving
  - Keeps truly important projects accessible

**Cons**:
  - Requires periodic attention
  - Decision fatigue if many projects

**Best for**: Users who want control over archiving

---

**Your choice**: ___
```

---

## 🔹 Checkpoint 3: Promotion Criteria

**Agent presents third batched decision**:

```markdown
🔹 DECISION CHECKPOINT: Promotion Workflow

**Context**: Session work starts in `sessions/[id]/artifacts/docs/`. Quality content should be promoted to permanent `docs/`. We need criteria for when to promote.

**We need to choose**: What triggers promotion from session → docs/?

---

### Option A: Reference Count (3+ references)
**How it works**: When a session doc is referenced 3+ times, it's promoted

**Pros**:
  - Automatic promotion of useful docs
  - Proven value before promotion
  - No manual tracking needed

**Cons**:
  - Good docs may not get referenced quickly
  - Edge cases (one-time but important)

---

### Option B: Explicit Manual Promotion
**How it works**: You decide when to promote, system suggests candidates

**Pros**:
  - Full control over what's permanent
  - Can promote early if you know it's good
  - No false positives

**Cons**:
  - Requires attention and decision-making
  - May forget to promote worthy docs

---

### Option C: Hybrid (Auto-suggest, Manual Confirm)
**How it works**: System flags docs meeting criteria (3+ refs OR high quality), you confirm

**Pros**:
  - Balance of automation and control
  - Don't miss promotion candidates
  - Final say on what's permanent

**Cons**:
  - Checkpoint interruptions
  - Still requires periodic attention

---

**Your choice**: ___
```

---

## ✅ After Checkpoint Batch: Agent Implementation

**User chose**:
- Projects structure: Option B (By Status)
- Archive workflow: Option C (Manual Archive)
- Promotion criteria: Option C (Hybrid)

**Agent proceeds**:

```javascript
// 1. Store all decisions
await Promise.all([
  memory.store({
    namespace: 'workspace-optimization-20251117',
    key: 'user-preferences/projects-structure',
    value: { approach: 'by-status', ... }
  }),
  memory.store({
    namespace: 'workspace-optimization-20251117',
    key: 'user-preferences/archive-workflow',
    value: { approach: 'manual-archive', trigger: '90-days', ... }
  }),
  memory.store({
    namespace: 'workspace-optimization-20251117',
    key: 'user-preferences/promotion-criteria',
    value: { approach: 'hybrid', autoFlag: true, requireConfirm: true, ... }
  })
]);

// 2. Implement structure (Category A complete)
await implementProjectsStructure('by-status');
await setupArchiveWorkflow('manual-archive');
await configurePromotionSystem('hybrid');

// 3. Proceed autonomously on Category C
await createInternalSubdirectories(); // Never asked user
await setupIndexGeneration(); // Never asked user
await configureMetadataTracking(); // Will suggest later (Category B)

// 4. Work for a while...
// User sees system in action

// 5. Later: Category B checkpoints (Show & Tell)
await suggestREADMETemplate(); // Show working example, offer alternatives
await suggestMetadataSchema(); // Show what we tracked, offer expansions
```

---

## 🎨 Phase 2: Category B Suggestions (After Implementation)

**Timing**: After user has used system for a bit, has working examples

### Show & Tell: README.md Template

```markdown
🎨 IMPLEMENTATION SUGGESTION: Project README Template

**What we implemented**: Standard project README format

**Here's how it looks**:
```markdown
# Project: [Name]

**Status**: Active | Planning | Completed
**Domain**: [Topic Area]
**Started**: [Date]

## Purpose
[Why this project exists]

## Goals
- [ ] Goal 1
- [ ] Goal 2

## Progress
[Current status and next steps]

## Related
- [Link to related projects]
```

**This approach**:
- Clear status and metadata at top
- Goal tracking with checkboxes
- Progress section for quick updates
- Lightweight and quick to fill out

**Alternative approaches**:
- **Minimalist**: Just title + purpose + progress (faster)
- **Detailed**: Add sections for context, decisions, outcomes (richer)
- **Hybrid**: Start minimal, expand when needed (flexible)

---

**Feedback welcome but not required**:
- [ ] Looks good, proceed with this template
- [ ] I'd prefer minimalist version
- [ ] I'd prefer detailed version
- [ ] Let me think about this and adjust later

**Your feedback** (optional): ___
```

**User response scenarios**:

**A) "Looks good"** → Store preference, continue using
**B) "Prefer minimalist"** → Update template, store preference
**C) "Let me think"** → Continue with default, user can adjust later

---

## 📊 Success Metrics from This Example

**What went well**:
- ✅ Batched 3 related Category A decisions (not overwhelming)
- ✅ Good timing (session start, user engaged)
- ✅ Clear options with concrete examples
- ✅ User's actual data in Option E refinement
- ✅ Category C decisions never surfaced (reduced noise)
- ✅ Category B deferred until user had context

**Efficiency gains**:
- **User time**: 5 minutes for 3 decisions vs 15 minutes spread out
- **Agent time**: Implementation unblocked after single checkpoint
- **Decision quality**: User chose confidently with clear tradeoffs
- **Follow-up changes**: 0% (all decisions stuck)

**Framework effectiveness**:
- Category A correctly identified (structural decisions)
- Category B correctly deferred (user needed working example)
- Category C correctly autonomous (user never noticed)
- Batching reduced decision fatigue
- Timing maximized user engagement

---

## 🔄 Continuous Learning

**After this session, agent learns**:

```javascript
// Patterns identified
await memory.store({
  namespace: 'workspace-optimization-20251117',
  key: 'meta/patterns-learned',
  value: {
    'user-prefers-status-based': true,
    'user-wants-control-over-archives': true,
    'user-likes-hybrid-automation': true,
    'user-responds-well-to-concrete-examples': true,
    'optimal-batch-size': 3,
    'decision-time-avg': 5 * 60 * 1000 // 5 minutes
  }
});

// Apply to future sessions
// - Start with status-based approaches in similar decisions
// - Offer hybrid options (automation + control)
// - Always provide concrete examples, especially Option E
// - Batch 3 decisions, not more
```

---

## 🎯 Key Takeaways

**What made this work**:

1. **Clear categorization** - Agent knew what to ask vs decide
2. **Good batching** - 3 related decisions, not 10 unrelated ones
3. **Perfect timing** - Session start, user engaged and ready
4. **Concrete options** - Real examples, not abstract descriptions
5. **Escape hatches** - User could ask for more info
6. **Memory integration** - Decisions stored for consistency
7. **Progressive disclosure** - Category B after user had context

**What agent avoided**:

1. ❌ Asking about implementation details (Category C)
2. ❌ Presenting 10 options (overwhelming)
3. ❌ Abstract questions without examples
4. ❌ Asking mid-implementation (wrong timing)
5. ❌ Blocking on nice-to-haves (Category B defaults worked)
6. ❌ Re-asking settled decisions (checked memory first)

---

## 📚 Framework Documents

**Complete framework**:
- **Full Guide**: `HITL-FRAMEWORK.md`
- **Quick Reference**: `HITL-QUICK-REFERENCE.md`
- **This Walkthrough**: `HITL-EXAMPLE-WALKTHROUGH.md`

**Memory Keys**:
- `workspace-optimization-20251117/hitl-framework` - Framework definition
- `workspace-optimization-20251117/user-preferences/*` - All user decisions
- `workspace-optimization-20251117/meta/patterns-learned` - Learning from sessions

---

**Walkthrough Status**: Complete
**Framework Status**: Ready for deployment
**Next Step**: Coordination agent implements on next organizational request
