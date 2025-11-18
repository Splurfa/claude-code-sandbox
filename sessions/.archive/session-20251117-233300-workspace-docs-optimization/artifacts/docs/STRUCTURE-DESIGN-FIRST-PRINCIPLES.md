# Documentation Structure Design - First Principles

**Analysis Date**: 2025-11-18
**Scope**: /Users/splurfa/common-thread-sandbox/docs/
**Approach**: Ground-up design based on actual content and real usage patterns

---

## PART 1: CURRENT STATE ANALYSIS

### What Content Actually Exists

**Total**: 48 markdown files across 5 activity folders

**Density Analysis** (by line count):
```
TOP TIER (500+ lines):
- understand/workspace-architecture.md (480 lines)
- understand/integration-points.md (778 lines)
- understand/hooks-and-automation.md (785 lines)
- understand/stock-vs-custom.md (617 lines)

HIGH VALUE (300-500 lines):
- plan/hive-mind-reality-guide.md (1295 lines) ← MEGA DOC
- operate/zero-risk-execution-pattern.md (643 lines)
- operate/memory-coordination.md (502 lines)
- explore/adaptive-pivot-protocol.md (534 lines)

MEDIUM DOCS (200-400 lines):
- 15 documents in this range

THIN DOCS (< 200 lines):
- 20+ documents, many placeholders
```

### Content Quality Assessment

**REAL, BATTLE-TESTED** (verified through actual sessions):
- ✅ hive-mind-reality-guide.md (session-20251116-151059, 100% verified)
- ✅ integration-testing-guide.md (session-20251115-210537, tested)
- ✅ zero-risk-execution-pattern.md (real pattern)
- ✅ workspace-architecture.md (reflects reality)
- ✅ stock-vs-custom.md (accurate analysis)

**ASPIRATIONAL / TUTORIAL-STYLE** (educational but not verified):
- ⚠️ what-is-claude-flow.md (teaching examples, not real sessions)
- ⚠️ spawning-agents.md (syntax guides, conceptual)
- ⚠️ 00-start-here.md (learning path structure)
- ⚠️ Most "Phase 1-4" numbered content

**PLACEHOLDERS / STUBS**:
- ❌ first-session.md (referenced but thin)
- ❌ basic-memory-usage.md (referenced but thin)
- ❌ Many README.md files with sparse content

### Noise vs Signal Analysis

**HIGH SIGNAL** (frequently useful):
1. hive-mind-reality-guide.md - Honest capability assessment
2. workspace-architecture.md - System understanding
3. integration-testing-guide.md - Operational procedures
4. zero-risk-execution-pattern.md - Safety protocols
5. stock-vs-custom.md - Architecture decisions

**MODERATE SIGNAL** (occasionally useful):
- Memory coordination docs
- Spawning agents syntax
- Session management explanations
- Hooks and automation internals

**NOISE** (rarely accessed or redundant):
- Multiple README.md files saying similar things
- Aspirational learning paths (Phases 1-4)
- Placeholder "coming soon" content
- Redundant explanations across folders

---

## PART 2: USAGE PATTERN REALITY CHECK

### How Docs Are Actually Used

**From analyzing git history, session artifacts, and CLAUDE.md:**

**PRIMARY USE CASES**:
1. **"How do I..."** (Action-oriented lookup)
   - Spawn agents
   - Use memory
   - Create sessions
   - Test integration

2. **"What's the truth about..."** (Reality checks)
   - Does feature X actually work?
   - What's stock vs custom?
   - Where do files go?

3. **"I'm debugging..."** (Troubleshooting)
   - Why isn't memory working?
   - Where did my files go?
   - Why is coordination failing?

4. **"How does this work?"** (Deep dives when needed)
   - Architecture internals
   - Coordination mechanics
   - Memory database schema

**SECONDARY USE CASES**:
5. **"I'm learning..."** (Rare - most users just try things)
   - Phase-based learning paths
   - Conceptual overviews
   - Theory before practice

### Frequency Analysis

**DAILY USAGE**:
- File routing rules ("where does this go?")
- Session management ("how do I close a session?")
- Agent spawning syntax ("what's the command?")

**WEEKLY USAGE**:
- Reality checks on features
- Troubleshooting specific issues
- Integration procedures

**OCCASIONAL USAGE**:
- Architecture deep-dives
- Advanced coordination patterns
- System internals

**RARELY ACCESSED**:
- Learning paths (people learn by doing)
- Conceptual explanations without examples
- Theory-heavy content

---

## PART 3: NATURAL TAXONOMY DESIGN

### Design Principle: VERB-BASED + FREQUENCY + COMPLEXITY

Instead of activity-based (organize/operate/understand/plan/explore), structure by:
1. **What the user is doing RIGHT NOW** (verb)
2. **How often they need it** (frequency)
3. **How deep they need to go** (complexity)

### Proposed Minimal Structure

```
docs/
├── README.md                    ← Quick navigation hub
│
├── quickstart/                  ← FREQUENT: Daily operations
│   ├── spawn-agents.md          ← Syntax reference
│   ├── file-routing.md          ← Where things go
│   ├── session-basics.md        ← Start/stop sessions
│   └── memory-basics.md         ← Store/retrieve data
│
├── guides/                      ← FREQUENT: How to accomplish tasks
│   ├── integration-testing.md   ← Test the system
│   ├── safe-execution.md        ← Zero-risk patterns
│   ├── multi-agent-coord.md     ← Coordinate agents
│   └── troubleshooting.md       ← Fix common issues
│
├── reference/                   ← OCCASIONAL: Lookup tables
│   ├── agent-types.md           ← All 54 agent types
│   ├── mcp-tools.md             ← MCP tool reference
│   ├── cli-commands.md          ← Command reference
│   └── stock-vs-custom.md       ← What's what
│
├── architecture/                ← RARE: Deep understanding
│   ├── system-overview.md       ← High-level design
│   ├── memory-internals.md      ← Database schema
│   ├── coordination-mechanics.md ← How agents coordinate
│   └── integration-points.md    ← Extension points
│
└── advanced/                    ← RARE: Expert patterns
    ├── hive-mind-reality.md     ← Honest capability guide
    ├── byzantine-consensus.md   ← Advanced coordination
    ├── adaptive-workflows.md    ← Dynamic orchestration
    └── custom-extensions.md     ← Building your own
```

**TOTAL**: 5 folders, ~20 essential docs (down from 48)

---

## PART 4: EXPANSION RULES

### When to Add a New Folder

**Trigger 1: FREQUENCY DIVERGENCE**
- When a cluster of docs has VERY different access patterns
- Example: If "troubleshooting" becomes daily, split into its own folder

**Trigger 2: COMPLEXITY SEPARATION**
- When beginner and expert content are mixed
- Example: Basic memory usage vs memory database internals

**Trigger 3: SCOPE CLARITY**
- When a folder reaches 10+ docs with different purposes
- Example: "guides/" could split into "how-to/" and "tutorials/"

**Trigger 4: USER FEEDBACK**
- When users consistently can't find something
- Example: "I looked in 3 places for agent syntax"

### Expansion Examples

**Stage 1** (Current minimal structure):
```
docs/
├── quickstart/    (4 docs)
├── guides/        (4 docs)
├── reference/     (4 docs)
├── architecture/  (4 docs)
└── advanced/      (4 docs)
```

**Stage 2** (After 20+ new docs):
```
docs/
├── quickstart/    (6 docs)
├── guides/
│   ├── how-to/    (6 docs) ← SPLIT by format
│   └── tutorials/ (4 docs)
├── reference/     (8 docs)
├── architecture/  (6 docs)
└── advanced/
    ├── patterns/  (5 docs) ← SPLIT by topic
    └── internals/ (4 docs)
```

**Stage 3** (Mature state):
```
docs/
├── quickstart/        (10 docs)
├── how-to/            (15 docs) ← FREQUENT needs own space
├── tutorials/         (8 docs)
├── reference/
│   ├── commands/      (10 docs)
│   └── api/           (8 docs)
├── explanation/       (12 docs) ← CONCEPTUAL split from architecture
├── architecture/      (8 docs)
└── advanced/
    ├── patterns/      (8 docs)
    ├── extensions/    (6 docs)
    └── research/      (5 docs) ← NEW: Experimental
```

### Anti-Pattern: Don't Pre-Scale

**❌ WRONG**: Create 10 folders because "we might need them"
**✅ RIGHT**: Create 5 folders, split when content reaches 8-10 docs

**❌ WRONG**: Activity-based without considering frequency
**✅ RIGHT**: Frequency + complexity + actual usage patterns

---

## PART 5: FOLDER BOUNDARY DEFINITIONS

### quickstart/ - "I need to do X RIGHT NOW"

**What Goes Here**:
- Syntax references (commands, function calls)
- File routing rules (where things go)
- Essential operations (spawn, store, retrieve)
- Zero context required (no "first read Y")

**What Doesn't**:
- Explanations (go to architecture/)
- Detailed procedures (go to guides/)
- Edge cases (go to advanced/)

**Examples**:
- ✅ "Spawn agent: `Task('name', 'task', 'type')`"
- ✅ "Files go to: `sessions/$SESSION_ID/artifacts/code/`"
- ❌ "Understanding the coordination philosophy..." (too conceptual)
- ❌ "Advanced spawn patterns with Byzantine consensus..." (too complex)

**Test**: Can a user copy-paste and succeed in < 2 minutes?

---

### guides/ - "I want to accomplish X"

**What Goes Here**:
- Task-oriented procedures (step-by-step)
- Common workflows (testing, deploying, coordinating)
- Problem-solving patterns (troubleshooting)
- Real examples from actual sessions

**What Doesn't**:
- Syntax-only (go to quickstart/)
- Theory (go to architecture/)
- Experimental patterns (go to advanced/)

**Examples**:
- ✅ "Integration Testing: 1. Clone repo, 2. Run tests, 3. Verify..."
- ✅ "Safe Execution Pattern: Check before spawn, verify after..."
- ❌ "spawn-agents.md" (syntax belongs in quickstart/)
- ❌ "Memory architecture explained" (theory belongs in architecture/)

**Test**: Does it walk the user through completing a specific task?

---

### reference/ - "What's the X for Y?"

**What Goes Here**:
- Lookup tables (agent types, commands, tools)
- Comparison matrices (stock vs custom)
- API specifications
- Quick reference sheets

**What Doesn't**:
- How-to guides (go to guides/)
- Explanations (go to architecture/)
- Procedures (go to guides/)

**Examples**:
- ✅ "54 Agent Types: researcher, coder, tester..."
- ✅ "MCP Tools: swarm_init, agent_spawn, task_orchestrate..."
- ❌ "How to choose the right agent type" (guide pattern)
- ❌ "Understanding agent coordination" (explanation)

**Test**: Is it a table, list, or spec you look up quickly?

---

### architecture/ - "How does X work internally?"

**What Goes Here**:
- System design explanations
- Component interactions
- Data flow diagrams
- Internal mechanisms (memory, hooks, coordination)

**What Doesn't**:
- How-to guides (go to guides/)
- Quick references (go to reference/)
- Usage patterns (go to guides/)

**Examples**:
- ✅ "Memory Architecture: SQLite schema, namespace design..."
- ✅ "Coordination Mechanics: How agents share state..."
- ❌ "How to use memory" (guide)
- ❌ "Memory commands" (reference)

**Test**: Does it explain WHY or HOW the system works, not how to USE it?

---

### advanced/ - "Expert-level patterns and reality checks"

**What Goes Here**:
- Honest capability assessments (reality guides)
- Experimental patterns (not yet proven)
- Expert-level coordination (Byzantine, adaptive)
- Custom extensions and integrations

**What Doesn't**:
- Basic usage (go to quickstart/)
- Standard guides (go to guides/)
- System internals (go to architecture/)

**Examples**:
- ✅ "Hive Mind Reality Guide: What actually works (65/100)"
- ✅ "Byzantine Consensus Pattern: Manual voting protocol..."
- ❌ "Basic agent spawning" (quickstart)
- ❌ "Memory system architecture" (architecture)

**Test**: Does it require deep system understanding or handle edge cases?

---

## PART 6: MIGRATION STRATEGY

### Phase 1: Audit & Consolidate (Week 1)

**Actions**:
1. Read ALL existing docs
2. Categorize by proposed structure
3. Identify redundancy (5+ docs saying same thing)
4. Mark placeholders for deletion

**Deliverable**: Migration map (`old-path` → `new-path`)

---

### Phase 2: Create Core Structure (Week 1)

**Actions**:
1. Create 5 new folders
2. Write killer README.md (navigation hub)
3. Migrate TOP 20 docs (most used)
4. Update internal links

**Deliverable**: Functional minimal structure

---

### Phase 3: Consolidate & Archive (Week 2)

**Actions**:
1. Merge redundant content
2. Archive thin/placeholder docs to `.archive/`
3. Update all cross-references
4. Test navigation paths

**Deliverable**: Clean, navigable docs/

---

### Phase 4: Quality Polish (Week 2)

**Actions**:
1. Add "Where am I?" breadcrumbs
2. Real examples in every guide
3. Cross-link related docs
4. Verify all claims (reality-check pattern)

**Deliverable**: Production-ready documentation

---

### Migration Priorities

**P0 (Do First)**:
- hive-mind-reality-guide.md → advanced/
- integration-testing-guide.md → guides/
- workspace-architecture.md → architecture/
- stock-vs-custom.md → reference/

**P1 (Core Content)**:
- File routing → quickstart/
- Session management → quickstart/
- Memory basics → quickstart/
- Agent spawning → quickstart/

**P2 (Supporting)**:
- Coordination mechanics → architecture/
- Memory internals → architecture/
- Zero-risk execution → guides/
- Troubleshooting → guides/

**P3 (Archive)**:
- Thin placeholders
- Redundant READMEs
- Aspirational "Phase 1-4" content
- Out-of-date references

---

## PART 7: CONTENT CREATION RULES

### Rule 1: REAL OVER ASPIRATIONAL

**❌ WRONG**: "You can build X with Y" (hypothetical)
**✅ RIGHT**: "In session-Z, we built X using Y" (verified)

**Why**: Aspirational docs create false expectations. Reality-based docs build trust.

---

### Rule 2: EXAMPLES FROM ACTUAL SESSIONS

**❌ WRONG**: "Here's a made-up example..."
**✅ RIGHT**: "From session-20251116-151059..."

**Why**: Real sessions prove the pattern works. Made-up examples might not.

---

### Rule 3: VERIFY BEFORE DOCUMENTING

**❌ WRONG**: Document intent ("We'll move file X to Y")
**✅ RIGHT**: Verify first (`ls -la Y/X`), then document

**Why**: Temporal conflation (documenting plans as facts) causes false claims.

---

### Rule 4: ONE DOC = ONE PURPOSE

**❌ WRONG**: "Agent Spawning: Syntax, Architecture, Advanced Patterns, Troubleshooting"
**✅ RIGHT**: Four separate docs in appropriate folders

**Why**: Mixed-purpose docs confuse navigation and violate folder boundaries.

---

### Rule 5: FREQUENCY DETERMINES LOCATION

**❌ WRONG**: Put "spawn agents" in advanced/ because it's technical
**✅ RIGHT**: Put in quickstart/ because users need it daily

**Why**: Structure serves usage, not perceived complexity.

---

## PART 8: NAVIGATION DESIGN

### Hub-and-Spoke Model

```
README.md ← CENTRAL HUB
   ├→ quickstart/    (daily needs)
   ├→ guides/        (task completion)
   ├→ reference/     (lookup tables)
   ├→ architecture/  (understanding)
   └→ advanced/      (expert patterns)
```

### README.md as Navigation Hub

**Purpose**: Answer "Where do I go?" in 30 seconds

**Structure**:
```markdown
# Documentation

## I need to...
- [ ] Do something RIGHT NOW → [quickstart/](quickstart/)
- [ ] Accomplish a task → [guides/](guides/)
- [ ] Look up a reference → [reference/](reference/)
- [ ] Understand how it works → [architecture/](architecture/)
- [ ] Use advanced patterns → [advanced/](advanced/)

## Quick Links
- [Spawn agents](quickstart/spawn-agents.md)
- [File routing](quickstart/file-routing.md)
- [Integration testing](guides/integration-testing.md)
- [Reality guide](advanced/hive-mind-reality.md)
```

**Test**: Can a user find what they need in < 30 seconds?

---

### Breadcrumb Pattern

**Every doc should answer**:
- Where am I? (folder context)
- Why am I here? (doc purpose)
- Where can I go next? (related docs)

**Example**:
```markdown
# Agent Spawning Syntax

**Location**: quickstart/ (daily operations)
**Purpose**: Command syntax reference for spawning agents

[Content...]

**Related**:
- [Multi-agent coordination](../guides/multi-agent-coord.md)
- [Agent types reference](../reference/agent-types.md)
- [Advanced spawning patterns](../advanced/adaptive-workflows.md)
```

---

## PART 9: ANTI-PATTERNS TO AVOID

### Anti-Pattern 1: The Framework Fallacy

**Mistake**: Choose a framework (Diátaxis, etc.) BEFORE analyzing content
**Reality**: Framework might not fit your actual usage patterns

**Example**: Current docs use activity-based (organize/operate/etc.) but users think in verbs ("how do I spawn?") and frequency ("I need this daily").

---

### Anti-Pattern 2: Pre-Mature Scaling

**Mistake**: Create 15 folders because "we might need them"
**Reality**: Empty folders are navigation noise

**Rule**: Start with 5 folders, split when content reaches 8-10 docs per folder.

---

### Anti-Pattern 3: Aspirational Overload

**Mistake**: Document "coming soon" features and future plans
**Reality**: Users can't distinguish plans from reality

**Rule**: Only document what EXISTS and has been VERIFIED.

---

### Anti-Pattern 4: Topic-Based Without Frequency

**Mistake**: Organize by topic (Sessions, Memory, Agents) regardless of usage
**Reality**: Users need daily operations easily accessible

**Rule**: Frequency (daily/weekly/rare) is PRIMARY, topic is secondary.

---

### Anti-Pattern 5: Theory Before Practice

**Mistake**: Force users to read architecture before quickstart
**Reality**: Most users learn by doing, theory comes later

**Rule**: quickstart/ has NO prerequisites. Architecture docs explain, don't teach.

---

## PART 10: SUCCESS CRITERIA

### Structure is Working When:

**Quantitative**:
- ✅ User finds target doc in < 30 seconds (navigation test)
- ✅ No more than 8-10 docs per folder (cognitive load)
- ✅ < 5 clicks from README to any doc (depth limit)
- ✅ 80%+ docs have real examples from sessions (reality check)

**Qualitative**:
- ✅ New users can start without reading theory
- ✅ Experts can find advanced patterns easily
- ✅ Troubleshooting is quick (guides/ has answers)
- ✅ No one asks "where should this doc go?" (clear boundaries)

**Red Flags**:
- ❌ Users ask "where's the X doc?" (navigation failure)
- ❌ Multiple docs explain same thing (redundancy)
- ❌ Docs reference nonexistent content (placeholders)
- ❌ Users can't distinguish real from aspirational (verification failure)

---

## SUMMARY: THE MINIMAL VIABLE STRUCTURE

### Start Here (5 Folders, 20 Core Docs)

```
docs/
├── quickstart/              ← DAILY: Fast syntax references
│   ├── spawn-agents.md
│   ├── file-routing.md
│   ├── session-basics.md
│   └── memory-basics.md
│
├── guides/                  ← WEEKLY: Task completion
│   ├── integration-testing.md
│   ├── safe-execution.md
│   ├── multi-agent-coord.md
│   └── troubleshooting.md
│
├── reference/               ← LOOKUP: Quick tables
│   ├── agent-types.md
│   ├── mcp-tools.md
│   ├── cli-commands.md
│   └── stock-vs-custom.md
│
├── architecture/            ← DEEP DIVE: How it works
│   ├── system-overview.md
│   ├── memory-internals.md
│   ├── coordination-mechanics.md
│   └── integration-points.md
│
└── advanced/                ← EXPERT: Reality + patterns
    ├── hive-mind-reality.md
    ├── byzantine-consensus.md
    ├── adaptive-workflows.md
    └── custom-extensions.md
```

### Expansion Triggers

- **Split folder** when > 10 docs
- **Add folder** when frequency diverges significantly
- **Archive docs** that are thin or redundant
- **Verify content** before marking ✅

### Core Principles

1. **Verb-based** (what user does) > Activity-based
2. **Frequency-driven** (daily/weekly/rare) > Complexity-driven
3. **Real examples** (verified sessions) > Hypotheticals
4. **Start minimal** (5 folders) > Pre-scale (15 folders)
5. **Navigation hub** (README.md) > Deep hierarchies

---

**Next Step**: Execute Phase 1 migration with this design.
