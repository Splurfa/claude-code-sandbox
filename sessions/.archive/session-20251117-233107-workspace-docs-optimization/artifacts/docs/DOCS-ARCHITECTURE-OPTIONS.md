# Documentation Architecture Options - Scale Analysis

**Session**: session-20251117-233107-workspace-docs-optimization
**Context**: Design docs/ to serve "all the things that a user might possibly use this workspace for at any scale"
**Scope**: Strategic work, technical work, research, brainstorming, projects (100+ projects, multiple domains)
**Date**: 2025-11-17

---

## Executive Summary

After analyzing the workspace requirements, current structure (Diátaxis-based), and scale needs (100+ projects), I've developed **4 architectural approaches** that balance:

1. **Immediate usability** (finding what you need now)
2. **Scale tolerance** (working with 10 vs 1000 docs)
3. **Cross-domain support** (code, research, strategy, brainstorming)
4. **Integration patterns** (sessions/, projects/, inbox/ workflows)

**Current state**: 23,603 lines across 29 docs using Diátaxis (tutorials/how-to/explanation/reference/internals)
**Challenge**: Diátaxis serves **learning and execution** well but doesn't address **strategy, research, or multi-project coordination**

---

## First Principles Analysis

### What Do Users Need From Documentation?

Analyzing ALL workspace activities reveals **7 distinct documentation needs**:

| Need | User Mental State | Example Question | Current Coverage |
|------|-------------------|------------------|------------------|
| **Learning** | "I don't know how" | "How do I use sessions?" | ✅ tutorials/ |
| **Executing** | "I need to do X" | "How do I close a session?" | ✅ how-to/ |
| **Understanding** | "Why does it work this way?" | "Why use mesh topology?" | ✅ explanation/ |
| **Referencing** | "What's the syntax?" | "List all MCP tools" | ✅ reference/ |
| **Debugging** | "It's broken, why?" | "Session hook not firing" | ✅ internals/ + troubleshooting/ |
| **Planning** | "Should I do X or Y?" | "Which coordination for 50 agents?" | ⚠️ **MISSING** |
| **Researching** | "What are my options?" | "Survey of consensus mechanisms" | ⚠️ **MISSING** |
| **Brainstorming** | "Exploring possibilities" | "What if we combined X+Y?" | ⚠️ **MISSING** |

**Key insight**: Diátaxis covers **operational documentation** (do/learn/understand/lookup) but lacks **strategic documentation** (plan/research/explore).

### Scale Patterns: 10 vs 100 vs 1000 Docs

| Scale | Challenge | Organization Needs |
|-------|-----------|-------------------|
| **10 docs** | Flat structure works | Simple directories |
| **100 docs** | Category overload | Sub-categorization + indices |
| **1000 docs** | Navigation impossible | Faceted search, tagging, automation |

**Current scale**: 29 docs (works fine)
**Target scale**: 100-500 docs (requires sub-structure)
**Ultimate scale**: 1000+ docs (requires tooling)

### Audience Analysis

| Audience | Primary Need | Secondary Need | Documentation Type |
|----------|--------------|----------------|-------------------|
| **Human (you, now)** | Execute task | Quick reference | how-to, reference |
| **Human (future you)** | Recall decision | Understand rationale | explanation, research |
| **Human (collaborator)** | Onboard quickly | Learn system | tutorials, explanation |
| **AI Agent** | Follow patterns | Access templates | reference, templates |
| **Project Manager** | Plan work | Assess options | strategic, research |
| **System Developer** | Debug/extend | Technical details | internals, architecture |

**Key insight**: Different audiences need **different entry points** to the same knowledge.

---

## Approach A: Enhanced Diátaxis (Conservative Evolution)

### Structure

```
docs/
├── tutorials/              # Learning-oriented (unchanged)
├── how-to/                 # Task-oriented (unchanged)
├── explanation/            # Understanding-oriented (unchanged)
├── reference/              # Information-oriented (unchanged)
├── internals/              # System mechanics (unchanged)
├── troubleshooting/        # Problem-solving (unchanged)
│
├── strategic/              # NEW: Planning & decision-making
│   ├── architecture/       # System design decisions
│   ├── patterns/           # When to use what
│   ├── tradeoffs/          # X vs Y analyses
│   └── roadmaps/           # Future planning
│
├── research/               # NEW: Knowledge exploration
│   ├── surveys/            # "What's available?" analyses
│   ├── experiments/        # "What if?" explorations
│   ├── comparisons/        # Feature/tool comparisons
│   └── findings/           # Research conclusions
│
├── templates/              # NEW: Scaffolding & starters
│   ├── projects/           # Project templates
│   ├── workflows/          # Workflow templates
│   ├── agents/             # Agent configuration templates
│   └── documents/          # Document templates
│
└── projects/               # NEW: Project-specific docs
    ├── _INDEX.md           # Master project index
    ├── project-alpha/      # Per-project documentation
    │   ├── decisions/      # ADRs for this project
    │   ├── guides/         # Project-specific how-tos
    │   └── notes/          # Project working notes
    └── project-beta/
        └── ...
```

### Integration Patterns

**sessions/ → docs/ flow**:
```
sessions/session-*/artifacts/docs/
  ├── research-findings.md      → docs/research/findings/
  ├── architecture-decision.md  → docs/strategic/architecture/
  ├── how-to-deploy.md          → docs/how-to/ OR docs/projects/*/guides/
  └── experiment-results.md     → docs/research/experiments/
```

**projects/ → docs/ flow**:
```
docs/projects/
  ├── project-alpha/            # Project-specific documentation hub
  │   ├── decisions/            # ADRs from sessions
  │   ├── guides/               # Project how-tos
  │   └── notes/                # Working notes
  └── _INDEX.md                 # Cross-project navigation
```

**inbox/ → docs/ flow**:
```
inbox/assistant/2025-11-16-research/
  └── findings.md               → docs/research/findings/ (after review)
```

### Navigation Strategy

**Primary navigation** (by purpose):
- tutorials/ → how-to/ → explanation/ → reference/ (operational)
- strategic/ → research/ → templates/ (planning)
- projects/ (project-specific)

**Secondary navigation** (by topic):
- Cross-reference indices in each category
- Topic-based READMEs link to multiple categories
- Example: "Sessions" topic links to tutorial, how-to, explanation, reference, strategic, research

**Scale handling**:
- **10-50 docs**: Flat structure within categories
- **50-200 docs**: Sub-categories (e.g., strategic/architecture/coordinator/, strategic/architecture/neural/)
- **200+ docs**: Topic indices + search tooling

### Pros

- ✅ **Minimal disruption** - Builds on existing Diátaxis structure
- ✅ **Preserves investment** - No re-organization of existing 29 docs
- ✅ **Clear separation** - Operational vs strategic vs project-specific
- ✅ **Gradual adoption** - Can add new categories as needed
- ✅ **Familiar patterns** - Users already know tutorials/how-to/etc.

### Cons

- ⚠️ **Category proliferation** - 9 top-level directories
- ⚠️ **Unclear boundaries** - When is research vs explanation?
- ⚠️ **Scale limit** - Still hits navigation issues at 500+ docs
- ⚠️ **Projects duplication** - Project docs separate from main docs

### Scale Analysis

| Scale | Organization | Search Strategy |
|-------|--------------|-----------------|
| **10-50 docs** | Flat in categories | Browse by category |
| **50-200 docs** | Sub-categorize | Topic indices |
| **200-500 docs** | Deep hierarchy | Topic indices + grep |
| **500+ docs** | Tooling required | Full-text search + tagging |

**Recommended for**: Conservative evolution, gradual growth, preserving existing structure

---

## Approach B: Activity-Centric Architecture (Moderate Transformation)

### Structure

```
docs/
├── operate/                # DOING: Execution-focused documentation
│   ├── learn/              # Tutorials & getting started
│   ├── execute/            # How-to guides & recipes
│   ├── reference/          # Quick lookups & APIs
│   └── troubleshoot/       # Problem-solving
│
├── understand/             # KNOWING: Comprehension-focused documentation
│   ├── concepts/           # Explanations & theory
│   ├── architecture/       # System design & structure
│   ├── internals/          # Technical deep-dives
│   └── patterns/           # Design patterns & practices
│
├── plan/                   # DECIDING: Strategy-focused documentation
│   ├── decisions/          # Architecture Decision Records
│   ├── tradeoffs/          # X vs Y comparisons
│   ├── workflows/          # Process design
│   └── roadmaps/           # Future planning
│
├── explore/                # DISCOVERING: Research-focused documentation
│   ├── research/           # Surveys & investigations
│   ├── experiments/        # "What if?" explorations
│   ├── brainstorm/         # Ideation & possibilities
│   └── findings/           # Research conclusions
│
├── scaffold/               # STARTING: Templates & generators
│   ├── projects/           # Project templates
│   ├── workflows/          # Workflow templates
│   ├── agents/             # Agent configurations
│   └── documents/          # Document templates
│
└── projects/               # CONTEXT: Project-specific documentation
    ├── _INDEX.md           # Master project index
    ├── active/             # Current projects
    │   └── project-*/      # Per-project docs
    ├── archive/            # Completed projects
    │   └── project-*/      # Archived docs
    └── templates/          # Project scaffolding
```

### Integration Patterns

**sessions/ → docs/ flow** (by activity):
```
During session:
  artifacts/docs/tutorial.md       → docs/operate/learn/
  artifacts/docs/experiment.md     → docs/explore/experiments/
  artifacts/docs/decision.md       → docs/plan/decisions/
  artifacts/docs/architecture.md   → docs/understand/architecture/

After closeout:
  Session summary → Captain's Log
  Approved artifacts → Appropriate docs/ activity category
```

**projects/ integration**:
```
docs/projects/
  ├── active/
  │   └── project-alpha/
  │       ├── _meta.md            # Project metadata (links to all related docs)
  │       ├── operate/            # Project-specific how-tos
  │       ├── understand/         # Project-specific architecture
  │       ├── plan/               # Project-specific decisions
  │       └── explore/            # Project-specific research
  └── _INDEX.md                   # Cross-project navigation
```

**Navigation via "activity lens"**:
```
User asks: "How do I deploy?"
→ docs/operate/execute/deployment.md (how-to)
→ docs/understand/concepts/deployment-explained.md (why/how it works)
→ docs/plan/decisions/adr-003-deployment-strategy.md (why we chose X)
→ docs/projects/active/project-alpha/operate/deploy.md (project-specific)
```

### Navigation Strategy

**Primary navigation** (by activity):
- "I need to DO something" → operate/
- "I need to UNDERSTAND something" → understand/
- "I need to DECIDE something" → plan/
- "I need to EXPLORE options" → explore/
- "I need to START something" → scaffold/
- "I'm working on PROJECT X" → projects/active/X/

**Secondary navigation** (by topic):
- Each top-level activity has topic indices
- Topics link across activities (e.g., "Sessions" links to operate/execute/sessions.md, understand/concepts/sessions.md, etc.)

**Scale handling**:
- **Activity-first** organization reduces cognitive load
- Sub-categorization within activities (e.g., operate/execute/coordination/, operate/execute/sessions/)
- Project-specific docs isolated but use same activity structure

### Pros

- ✅ **Mental model alignment** - Matches how users think about work
- ✅ **Comprehensive coverage** - All activities (do/know/decide/discover) supported
- ✅ **Clear intent** - Directory name tells you what mental state it serves
- ✅ **Project integration** - Projects use same activity structure
- ✅ **Scale tolerance** - Activity grouping reduces top-level complexity

### Cons

- ⚠️ **Requires reorganization** - Move all 29 existing docs
- ⚠️ **New mental model** - Users must learn activity categories
- ⚠️ **Potential confusion** - "Is this operate/learn or understand/concepts?"
- ⚠️ **Migration cost** - Update all cross-references

### Scale Analysis

| Scale | Organization | Search Strategy |
|-------|--------------|-----------------|
| **10-50 docs** | Flat in activities | Browse by activity |
| **50-200 docs** | Topic sub-folders | Activity + topic |
| **200-500 docs** | Deep topic hierarchy | Activity + topic + grep |
| **500+ docs** | Automated indices | Full-text search + tagging |

**Recommended for**: Users comfortable with reorganization, want comprehensive coverage of all activity types

---

## Approach C: Audience-Centric Architecture (Radical Transformation)

### Structure

```
docs/
├── for-users/              # AUDIENCE: End-users of the workspace
│   ├── getting-started/    # Onboarding & basics
│   ├── guides/             # Task-oriented how-tos
│   ├── concepts/           # Understanding & theory
│   ├── troubleshooting/    # Problem-solving
│   └── advanced/           # Power-user features
│
├── for-developers/         # AUDIENCE: System developers & extenders
│   ├── architecture/       # System design
│   ├── internals/          # Implementation details
│   ├── apis/               # API reference
│   ├── extending/          # Extension points
│   └── debugging/          # Debugging guides
│
├── for-planners/           # AUDIENCE: Strategic decision-makers
│   ├── decisions/          # ADRs & strategic choices
│   ├── tradeoffs/          # Comparative analyses
│   ├── roadmaps/           # Planning & futures
│   ├── research/           # Research findings
│   └── patterns/           # Best practices
│
├── for-agents/             # AUDIENCE: AI agents
│   ├── instructions/       # Agent behavior specs
│   ├── patterns/           # Coordination patterns
│   ├── templates/          # Code/doc templates
│   ├── memory/             # Memory schemas
│   └── workflows/          # Workflow definitions
│
├── for-projects/           # AUDIENCE: Project teams
│   ├── _INDEX.md           # Master project index
│   ├── templates/          # Project scaffolding
│   ├── active/             # Current project docs
│   │   └── project-*/      # Full docs per project
│   └── archive/            # Completed projects
│
└── cross-cutting/          # SHARED: Topics spanning audiences
    ├── sessions/           # All docs about sessions
    ├── coordination/       # All docs about coordination
    ├── memory/             # All docs about memory
    └── ...                 # Other major topics
```

### Integration Patterns

**sessions/ → docs/ flow** (by intended audience):
```
During session:
  artifacts/docs/user-guide.md     → docs/for-users/guides/
  artifacts/docs/architecture.md   → docs/for-developers/architecture/
  artifacts/docs/decision.md       → docs/for-planners/decisions/
  artifacts/docs/agent-pattern.md  → docs/for-agents/patterns/

Promotion decision:
  "Who is this for?" → Determines destination
```

**projects/ integration**:
```
docs/for-projects/
  ├── active/
  │   └── project-alpha/
  │       ├── for-users/          # User-facing project docs
  │       ├── for-developers/     # Developer docs
  │       ├── for-planners/       # Strategic docs
  │       └── for-agents/         # Agent configs
  └── templates/
      └── project-template/       # Scaffolding for new projects
```

**Cross-cutting topics**:
```
docs/cross-cutting/sessions/
  ├── _INDEX.md                   # Links to all session docs
  ├── for-users.md                # → docs/for-users/guides/sessions.md
  ├── for-developers.md           # → docs/for-developers/internals/session-lifecycle.md
  ├── for-planners.md             # → docs/for-planners/decisions/adr-001-session-design.md
  └── for-agents.md               # → docs/for-agents/patterns/session-coordination.md
```

### Navigation Strategy

**Primary navigation** (by audience):
- "I'm a user trying to get work done" → for-users/
- "I'm developing/extending the system" → for-developers/
- "I'm making strategic decisions" → for-planners/
- "I'm configuring agents" → for-agents/
- "I'm working on a project" → for-projects/active/*/

**Secondary navigation** (by topic):
- cross-cutting/ provides topic-centric entry points
- Each topic index links to audience-specific docs
- Example: cross-cutting/sessions/_INDEX.md links to all session docs across audiences

**Scale handling**:
- Audience segmentation reduces per-audience doc count
- Topic indices provide alternative navigation
- Projects fully isolated with own audience structure

### Pros

- ✅ **Clear audience targeting** - Each section optimized for specific reader
- ✅ **Reduced noise** - Users don't see developer docs
- ✅ **Agent optimization** - AI agents have dedicated instructions section
- ✅ **Project isolation** - Project teams see only their docs
- ✅ **Topic discovery** - cross-cutting/ enables topic-based exploration

### Cons

- ⚠️ **Major reorganization** - Complete restructure of all docs
- ⚠️ **Content duplication risk** - Same concept explained differently per audience
- ⚠️ **Boundary confusion** - "Is this for users or planners?"
- ⚠️ **Maintenance burden** - Updates must propagate across audiences
- ⚠️ **Learning curve** - Users must learn audience categories

### Scale Analysis

| Scale | Organization | Search Strategy |
|-------|--------------|-----------------|
| **10-50 docs** | Flat in audiences | Browse by audience |
| **50-200 docs** | Sub-categorize | Audience + sub-category |
| **200-500 docs** | Topic indices | Audience + topic |
| **500+ docs** | Tooling required | Cross-cutting indices + search |

**Recommended for**: Multi-team environments, clear audience segmentation, AI agent optimization

---

## Approach D: Hybrid Dimensional (Innovative Multi-Axis)

### Structure

```
docs/
├── _INDEX.md               # Master navigation (ALL axes)
│
├── by-purpose/             # AXIS 1: Diátaxis (operational docs)
│   ├── tutorials/
│   ├── how-to/
│   ├── explanation/
│   ├── reference/
│   └── internals/
│
├── by-lifecycle/           # AXIS 2: Work stage (strategic docs)
│   ├── ideation/           # Brainstorming & exploration
│   ├── planning/           # Decision-making & design
│   ├── execution/          # Implementation & operation
│   ├── evaluation/         # Assessment & retrospective
│   └── evolution/          # Improvement & scaling
│
├── by-domain/              # AXIS 3: Knowledge area (topic organization)
│   ├── sessions/           # Everything about sessions
│   ├── coordination/       # Everything about coordination
│   ├── memory/             # Everything about memory
│   ├── neural/             # Everything about neural features
│   ├── workflows/          # Everything about workflows
│   └── ...                 # Other domains
│
├── by-scale/               # AXIS 4: Complexity level
│   ├── quick-start/        # Get going in <5 minutes
│   ├── standard/           # Typical use cases
│   ├── advanced/           # Complex scenarios
│   └── extreme/            # Edge cases & scaling limits
│
├── projects/               # PROJECT CONTEXT
│   ├── _INDEX.md           # Cross-project navigation
│   ├── templates/          # Project scaffolding
│   └── active/             # Current projects
│       └── project-*/
│           ├── _meta.md    # Project metadata (links to relevant docs in all axes)
│           └── local/      # Project-specific docs not in main axes
│
└── _navigation/            # NAVIGATION TOOLING
    ├── by-audience.md      # User/Developer/Planner/Agent views
    ├── by-activity.md      # Do/Know/Decide/Explore views
    ├── by-topic.md         # Topic-centric index
    └── by-project.md       # Project-centric index
```

### Key Innovation: Symlinks + Metadata

**Core principle**: Each document exists in ONE canonical location but is **discoverable through multiple axes via symlinks and metadata**.

Example document: `by-purpose/explanation/session-management.md`

```markdown
---
# YAML frontmatter for multi-axis discovery
purpose: explanation          # by-purpose axis
lifecycle: execution          # by-lifecycle axis
domain: sessions              # by-domain axis
scale: standard               # by-scale axis
audiences: [users, planners]  # for _navigation/by-audience.md
projects: [project-alpha]     # related projects
tags: [session, lifecycle, file-routing]
---

# Session Management Explained
...
```

**Symlink structure**:
```
by-purpose/explanation/session-management.md  (CANONICAL)
by-lifecycle/execution/session-management.md  → symlink
by-domain/sessions/management-explained.md    → symlink
by-scale/standard/session-management.md       → symlink
```

**Navigation indices auto-generated from frontmatter**:
```
_navigation/by-audience.md    # Lists docs tagged with each audience
_navigation/by-topic.md       # Groups docs by domain + tags
_navigation/by-project.md     # Links docs related to each project
```

### Integration Patterns

**sessions/ → docs/ flow**:
```
1. Create doc in canonical location:
   by-purpose/how-to/deploy-agent.md

2. Add comprehensive frontmatter:
   ---
   purpose: how-to
   lifecycle: execution
   domain: coordination
   scale: standard
   audiences: [users, agents]
   projects: [project-alpha]
   tags: [deployment, agents, workflows]
   ---

3. Run auto-linking script:
   npm run docs:link

4. Document now discoverable via:
   - by-purpose/how-to/ (direct)
   - by-lifecycle/execution/ (symlink)
   - by-domain/coordination/ (symlink)
   - _navigation/by-audience.md (index)
   - _navigation/by-topic.md (index)
   - projects/active/project-alpha/_meta.md (index)
```

**projects/ integration**:
```
docs/projects/active/project-alpha/
  ├── _meta.md                # Project overview + doc links
  │   # Auto-generated sections:
  │   - "How-tos for this project" (filtered by project tag)
  │   - "Architecture decisions" (filtered by project tag)
  │   - "Research findings" (filtered by project tag)
  │
  └── local/                  # Project-specific docs
      └── team-notes.md       # Too specific for main docs/
```

### Navigation Strategy

**Multiple entry points, same content**:

1. **Purpose-driven** (Diátaxis): "I need to DO something" → by-purpose/how-to/
2. **Lifecycle-driven**: "I'm in PLANNING phase" → by-lifecycle/planning/
3. **Domain-driven**: "I need info about SESSIONS" → by-domain/sessions/
4. **Scale-driven**: "I need a QUICK START" → by-scale/quick-start/
5. **Audience-driven**: "I'm a DEVELOPER" → _navigation/by-audience.md (developer section)
6. **Project-driven**: "I'm on PROJECT ALPHA" → projects/active/project-alpha/_meta.md

**Example user journey**:
```
User: "I'm planning a 50-agent coordination system"

Path 1: by-lifecycle/planning/ → coordination-strategy.md
Path 2: by-domain/coordination/ → planning/ → coordination-strategy.md
Path 3: by-scale/advanced/ → coordination/ → coordination-strategy.md
Path 4: _navigation/by-topic.md → coordination → planning → coordination-strategy.md

All paths lead to SAME document.
```

### Auto-generation & Tooling

**Scripts**:
```bash
npm run docs:link          # Generate symlinks from frontmatter
npm run docs:index         # Regenerate navigation indices
npm run docs:validate      # Check broken links & missing frontmatter
npm run docs:search TAG    # Find all docs with tag
```

**Frontmatter validation**:
```javascript
// Required frontmatter fields
{
  purpose: string,      // tutorials|how-to|explanation|reference|internals
  lifecycle: string,    // ideation|planning|execution|evaluation|evolution
  domain: string[],     // sessions|coordination|memory|neural|workflows|...
  scale: string,        // quick-start|standard|advanced|extreme
  audiences: string[],  // users|developers|planners|agents
  projects: string[],   // project-alpha|project-beta|... (optional)
  tags: string[]        // free-form tags
}
```

### Scale Handling

**10-50 docs**:
- Simple directory browsing
- Symlinks provide alternative views
- Manual navigation adequate

**50-200 docs**:
- Navigation indices become essential
- Symlink structure provides multiple pathways
- Tag-based search useful

**200-500 docs**:
- Auto-generated indices critical
- Full-text search integrated
- Frontmatter-based filtering

**500+ docs**:
- Documentation portal with UI
- Advanced search/filter by all axes
- Graph visualization of doc relationships

### Pros

- ✅ **Multi-axis discovery** - Find docs via purpose/lifecycle/domain/scale/audience/project
- ✅ **Single source of truth** - Each doc exists once (symlinks avoid duplication)
- ✅ **Flexible mental models** - Users can navigate however they think
- ✅ **Auto-generated navigation** - Indices built from frontmatter
- ✅ **Project integration** - Projects automatically link to relevant docs
- ✅ **Scale tolerance** - Works from 10 to 10,000 docs
- ✅ **Future-proof** - New axes can be added without restructuring

### Cons

- ⚠️ **Complexity** - Requires tooling & maintenance scripts
- ⚠️ **Learning curve** - Users must understand multi-axis system
- ⚠️ **Frontmatter discipline** - All docs need complete metadata
- ⚠️ **Symlink management** - Need automation to keep links current
- ⚠️ **Git complexity** - Symlinks can confuse some Git tools

### Scale Analysis

| Scale | Organization | Search Strategy | Tooling Required |
|-------|--------------|-----------------|------------------|
| **10-50 docs** | Canonical + symlinks | Browse by axis | Basic (linking script) |
| **50-200 docs** | + Navigation indices | Axis + indices | Moderate (index generation) |
| **200-500 docs** | + Tag filtering | Full-text + filters | Advanced (search integration) |
| **500+ docs** | + Documentation UI | Graph navigation | Full (doc portal) |

**Recommended for**: Users who want maximum flexibility, willing to invest in tooling, anticipate long-term scale

---

## Comparison Matrix

| Criterion | Enhanced Diátaxis | Activity-Centric | Audience-Centric | Hybrid Dimensional |
|-----------|-------------------|------------------|------------------|-------------------|
| **Migration cost** | Low | Medium | High | Medium |
| **Mental model complexity** | Low | Medium | Medium | High |
| **Purpose coverage** | Partial | Good | Good | Excellent |
| **Scale tolerance (500+ docs)** | Medium | Medium | Medium | Excellent |
| **Project integration** | Separate section | Integrated structure | Separate section | Metadata-linked |
| **Strategic support** | Added categories | Built-in (plan/) | Built-in (for-planners/) | Built-in (by-lifecycle/) |
| **Research support** | Added categories | Built-in (explore/) | Built-in (for-planners/) | Built-in (by-lifecycle/) |
| **Agent optimization** | Generic reference | Generic reference | Dedicated section | Metadata-filtered |
| **Duplication risk** | Low | Low | High | Very low (symlinks) |
| **Tooling required** | Minimal | Minimal | Minimal | Moderate |
| **Maintenance burden** | Low | Low | Medium | Medium (automation helps) |
| **Future extensibility** | Limited | Limited | Limited | Excellent |

---

## Recommendations by Use Case

### Scenario 1: Conservative Growth (10-50 projects, gradual adoption)

**Recommended**: Enhanced Diátaxis (Approach A)

**Rationale**:
- Minimal disruption to existing docs
- Gradual addition of strategic/ and research/ categories
- Familiar structure for users
- Low maintenance burden

**Implementation**:
1. Keep existing tutorials/how-to/explanation/reference/internals
2. Add strategic/ for planning docs
3. Add research/ for research notes
4. Add templates/ for scaffolding
5. Add projects/ for project-specific docs
6. Migrate new content as created

### Scenario 2: Rapid Multi-Domain Expansion (50+ projects, multiple teams)

**Recommended**: Audience-Centric (Approach C)

**Rationale**:
- Clear segmentation for different teams
- Dedicated agent documentation section
- Project isolation reduces noise
- Scales well across domains

**Implementation**:
1. Reorganize existing docs by intended audience
2. Create cross-cutting/ topic indices
3. Set up project templates
4. Document audience selection criteria
5. Migrate incrementally (audience by audience)

### Scenario 3: Long-Term Scale & Flexibility (100+ projects, 5-10 years)

**Recommended**: Hybrid Dimensional (Approach D)

**Rationale**:
- Multi-axis discovery handles growth
- Symlinks prevent duplication
- Tooling investment pays off at scale
- Future-proof for new axes

**Implementation**:
1. Define frontmatter schema
2. Build auto-linking scripts
3. Create canonical organization (by-purpose/)
4. Add secondary axes (lifecycle, domain, scale)
5. Generate navigation indices
6. Migrate docs with frontmatter + linking

### Scenario 4: Mixed Strategic + Operational Work (current state)

**Recommended**: Activity-Centric (Approach B) OR Hybrid Dimensional (Approach D)

**Rationale**:
- Activity-Centric: Good balance, moderate complexity
- Hybrid: Maximum flexibility, requires tooling investment

**Decision factors**:
- Choose Activity-Centric if: Prefer simplicity, limited tooling resources
- Choose Hybrid if: Want future-proof, willing to invest in automation

---

## Integration Deep-Dive: sessions/ → docs/ → projects/

### Content Lifecycle Flow

```
1. CREATION (in session):
   sessions/session-*/artifacts/docs/filename.md
   ↓
   Work happens in session artifacts

2. CLOSEOUT (session ends):
   User reviews session artifacts
   ↓
   Decides: Keep, promote, or discard each artifact
   ↓
   Approved for promotion?

3. PROMOTION (manual):
   sessions/session-*/artifacts/docs/filename.md
   ↓
   Copy to appropriate docs/ location
   ↓
   (varies by architecture approach)

4. PROJECT LINKAGE:
   If doc is project-specific:
   ↓
   docs/projects/active/project-*/
   OR
   Add project tag to frontmatter (Hybrid approach)

5. ARCHIVAL:
   Original session artifacts remain in sessions/
   ↓
   Session eventually moves to sessions/.archive/
   ↓
   Promoted docs stay in docs/ (single source of truth)
```

### Architecture-Specific Promotion Patterns

**Enhanced Diátaxis**:
```
Session artifact → Decision based on content type:
├─ How-to guide → docs/how-to/
├─ Explanation → docs/explanation/
├─ Research → docs/research/surveys/ OR docs/research/findings/
├─ Decision → docs/strategic/architecture/ OR docs/strategic/tradeoffs/
└─ Project-specific → docs/projects/project-*/
```

**Activity-Centric**:
```
Session artifact → Decision based on activity:
├─ "How to X" → docs/operate/execute/
├─ "Why X works" → docs/understand/concepts/
├─ "Should we do X or Y?" → docs/plan/tradeoffs/
├─ "Research on X" → docs/explore/research/
└─ Project-specific → docs/projects/active/project-*/plan/ (or operate/, etc.)
```

**Audience-Centric**:
```
Session artifact → Decision based on intended reader:
├─ For users → docs/for-users/guides/ OR docs/for-users/concepts/
├─ For developers → docs/for-developers/architecture/
├─ For planners → docs/for-planners/decisions/
├─ For agents → docs/for-agents/patterns/
└─ Project-specific → docs/for-projects/active/project-*/
```

**Hybrid Dimensional**:
```
Session artifact → Add frontmatter + promote to canonical location:
1. Determine canonical axis (usually by-purpose/)
2. Add complete frontmatter metadata
3. Copy to canonical location
4. Run npm run docs:link to create symlinks
5. Doc now discoverable via all axes
```

### Multi-Project Scenario

**Example**: Workspace with 10 active projects

**Enhanced Diátaxis**:
```
docs/
├── projects/
│   ├── _INDEX.md
│   ├── project-alpha/
│   │   ├── decisions/
│   │   ├── guides/
│   │   └── notes/
│   ├── project-beta/
│   ├── ...
│   └── project-kappa/
└── [other categories...]

Navigation: Browse projects/ → Find project → Browse project docs
```

**Activity-Centric**:
```
docs/
├── projects/
│   └── active/
│       ├── project-alpha/
│       │   ├── operate/    (project-specific how-tos)
│       │   ├── understand/ (project-specific architecture)
│       │   ├── plan/       (project-specific decisions)
│       │   └── explore/    (project-specific research)
│       ├── project-beta/
│       └── ...

Navigation: Browse projects/active/ → Find project → Browse by activity
```

**Audience-Centric**:
```
docs/
├── for-projects/
│   └── active/
│       ├── project-alpha/
│       │   ├── for-users/      (user-facing docs)
│       │   ├── for-developers/ (developer docs)
│       │   ├── for-planners/   (strategic docs)
│       │   └── for-agents/     (agent configs)
│       └── ...

Navigation: Browse for-projects/active/ → Find project → Browse by audience
```

**Hybrid Dimensional**:
```
docs/
├── by-domain/
│   ├── project-alpha/  (all project-alpha docs discoverable here)
│   └── project-beta/
├── projects/
│   └── active/
│       ├── project-alpha/
│       │   ├── _meta.md  (generated index linking to all docs tagged project-alpha)
│       │   └── local/    (docs too specific for main axes)
│       └── ...
└── _navigation/
    └── by-project.md  (index of all project docs)

Navigation: Multiple paths to same docs:
1. Browse projects/active/project-alpha/_meta.md
2. Browse by-domain/project-alpha/
3. Browse _navigation/by-project.md
4. Search for tag:project-alpha
```

---

## Decision Framework for HITL

### Key Questions for Choosing Architecture

1. **How much reorganization are you willing to accept?**
   - Minimal → Enhanced Diátaxis (A)
   - Moderate → Activity-Centric (B) or Hybrid (D)
   - Complete → Audience-Centric (C)

2. **How many projects do you anticipate?**
   - 10-20 → Enhanced Diátaxis (A) or Activity-Centric (B)
   - 20-50 → Activity-Centric (B) or Audience-Centric (C)
   - 50+ → Hybrid Dimensional (D)

3. **How important is strategic documentation?**
   - Nice to have → Enhanced Diátaxis (A)
   - Important → Activity-Centric (B) or Audience-Centric (C)
   - Critical → Activity-Centric (B) or Hybrid (D)

4. **Are you willing to invest in tooling?**
   - No → Enhanced Diátaxis (A) or Activity-Centric (B)
   - Maybe → Audience-Centric (C)
   - Yes → Hybrid Dimensional (D)

5. **How diverse are your audiences?**
   - Mostly you → Enhanced Diátaxis (A) or Activity-Centric (B)
   - You + collaborators → Activity-Centric (B) or Audience-Centric (C)
   - Multiple teams + agents → Audience-Centric (C) or Hybrid (D)

6. **How long is your planning horizon?**
   - 1-2 years → Enhanced Diátaxis (A) or Activity-Centric (B)
   - 3-5 years → Activity-Centric (B) or Audience-Centric (C)
   - 5-10 years → Hybrid Dimensional (D)

### Evaluation Scorecard

Rate each criterion (1-5, 5 = most important):

| Criterion | Weight | Enhanced Diátaxis | Activity-Centric | Audience-Centric | Hybrid Dimensional |
|-----------|--------|-------------------|------------------|------------------|-------------------|
| Ease of migration | __ | 5 | 3 | 1 | 3 |
| Strategic support | __ | 3 | 5 | 5 | 5 |
| Scale tolerance | __ | 3 | 3 | 3 | 5 |
| Project integration | __ | 3 | 4 | 3 | 5 |
| Agent optimization | __ | 2 | 2 | 5 | 4 |
| Maintenance simplicity | __ | 5 | 5 | 3 | 3 |
| Future extensibility | __ | 2 | 2 | 2 | 5 |

**Your weighted scores**:
- Enhanced Diátaxis: (5×__) + (3×__) + ... = __
- Activity-Centric: (3×__) + (5×__) + ... = __
- Audience-Centric: (1×__) + (5×__) + ... = __
- Hybrid Dimensional: (3×__) + (5×__) + ... = __

---

## Next Steps for HITL Decision

1. **Review each approach** focusing on:
   - Does this match how I think about documentation?
   - Can I maintain this structure long-term?
   - Does it support my 5-year vision?

2. **Consider hybrid options**:
   - Enhanced Diátaxis + Activity for strategic docs
   - Activity-Centric + Hybrid metadata for projects
   - Custom combination based on your workflow

3. **Prototype test** (recommended):
   - Pick 5-10 existing docs
   - Organize them in each approach
   - Navigate through each structure
   - Which feels most natural?

4. **Decision criteria**:
   - Primary: Does it serve ALL workspace uses?
   - Secondary: Can it scale to 100+ projects?
   - Tertiary: Can I maintain it myself?

5. **Migration planning**:
   - If choosing A: Gradual addition of new categories
   - If choosing B or C: Phased reorganization plan
   - If choosing D: Tooling development + incremental migration

---

## Appendix: Alternative Considerations

### Approach E: Temporal Architecture

```
docs/
├── evergreen/       # Timeless content (tutorials, concepts)
├── current/         # Active project documentation
├── archive/         # Completed work documentation
└── future/          # Roadmaps, proposals, ideas
```

**Pros**: Natural lifecycle progression
**Cons**: Content moves between directories over time (maintenance burden)

### Approach F: Role-Based Architecture

```
docs/
├── individual-contributor/ (hands-on work)
├── tech-lead/              (architecture & decisions)
├── project-manager/        (planning & coordination)
└── stakeholder/            (high-level overviews)
```

**Pros**: Very clear audience targeting
**Cons**: Limited to organizational roles, less flexible

### Approach G: Complexity-Based Architecture

```
docs/
├── essentials/     (Must-know basics)
├── intermediate/   (Common tasks)
├── advanced/       (Complex scenarios)
└── reference/      (Complete details)
```

**Pros**: Natural learning progression
**Cons**: Complexity is subjective, hard to categorize

---

## Conclusion

All four primary approaches (A-D) can serve "all the things that a user might possibly use this workspace for at any scale." The choice depends on:

1. **Your mental model**: How do you naturally think about documentation?
2. **Your scale needs**: 10 projects or 100 projects?
3. **Your maintenance capacity**: Willing to invest in tooling?
4. **Your timeline**: Planning 2 years or 10 years ahead?

**Recommendation order by confidence**:

1. **For most users**: Activity-Centric (B) - Best balance of coverage and simplicity
2. **For conservative users**: Enhanced Diátaxis (A) - Minimal disruption, gradual growth
3. **For long-term scale**: Hybrid Dimensional (D) - Maximum flexibility, requires investment
4. **For multi-team setups**: Audience-Centric (C) - Clear segmentation, moderate complexity

**Next**: HITL feedback to finalize architecture and create migration plan.
