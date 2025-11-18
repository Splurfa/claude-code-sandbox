# Projects Structure Design - First Principles Analysis

**Session**: session-20251117-233107-workspace-docs-optimization
**Date**: 2025-11-17
**Context**: Strategic workspace design for heterogeneous project work

---

## Executive Summary

The `projects/` directory is a **strategic workspace** for substantive work that transcends single chat sessions. Unlike `sessions/` (ephemeral, chat-scoped) and `inbox/` (communication hub), projects represent **persistent, multi-faceted initiatives** that may span weeks or months.

**Critical Insights from User Correction:**
- Projects are NOT just code repositories
- User brings in external projects for analysis/work
- Contains research, brainstorming, AND execution
- Both technical AND non-technical work
- Currently placeholder - will scale significantly

---

## First Principles Analysis

### 1. What Types of Projects Will Exist?

Based on the workspace architecture and user clarification:

**Research Projects**
- Literature reviews and synthesis
- Technology evaluations
- Market/competitive analysis
- Learning explorations

**Execution Projects**
- Software development initiatives
- System implementations
- Process improvements
- Tool/framework buildouts

**Strategic Projects**
- Business planning and strategy
- Architecture design and evolution
- Product/feature roadmaps
- Organizational initiatives

**Hybrid Projects** (Most Common)
- Start with research → evolve to execution
- Contain both strategic planning AND tactical work
- Mix technical AND non-technical artifacts

**External Projects**
- Third-party codebases under analysis
- Partner/client projects
- Open source contributions
- Consulting/advisory work

---

### 2. Project Lifecycle

Projects follow this natural progression:

```
CONCEPTION → RESEARCH → PLANNING → EXECUTION → REFINEMENT → COMPLETE
     ↓           ↓          ↓           ↓            ↓            ↓
  Ideas/     Analysis/  Design/     Build/      Iterate/     Archive/
  Inbox     Synthesis  Strategy    Implement    Optimize     Document
```

**Key Characteristics:**
- **Non-linear**: Projects loop back through phases
- **Multi-session**: Each phase may involve multiple chat sessions
- **Status-aware**: Projects have clear lifecycle states
- **Outcome-oriented**: Projects produce deliverables

---

### 3. Relationship to Sessions

**Sessions** (ephemeral):
- One chat = one session
- Focused on specific tasks/investigations
- Artifacts in `sessions/$SESSION_ID/artifacts/`
- Archived after completion

**Projects** (persistent):
- Multi-session endeavors
- Promoted artifacts from multiple sessions
- Maintained in `projects/$PROJECT_NAME/`
- Evolve over time

**Flow Pattern:**
```
Session A (research) → Project X (accumulates findings)
Session B (design)   → Project X (adds architecture)
Session C (build)    → Project X (adds implementation)
Session D (test)     → Project X (adds validation)
```

**Promotion Workflow:**
```bash
# Session generates artifacts
sessions/session-20251117-120000-api-auth/artifacts/code/auth.js

# Promote to project
projects/api-modernization/src/auth/auth.js
```

---

### 4. Scale Considerations

**10 Projects** (Early Stage):
- Simple flat structure works
- Manual organization acceptable
- Minimal tooling needed

**50 Projects** (Growth Phase):
- Need categorization/taxonomy
- Search and discovery critical
- Status tracking essential

**100+ Projects** (Mature Workspace):
- Hierarchical organization required
- Archive system mandatory
- Metadata and indexing crucial

---

### 5. Metadata Requirements

Each project needs:

**Identity:**
- Project name (kebab-case)
- Description (1-2 sentences)
- Created date
- Owner/team

**Status:**
- Lifecycle phase (planning, active, complete, archived)
- Last updated timestamp
- Health indicator (healthy, blocked, stale)

**Classification:**
- Type (research, execution, strategic, hybrid, external)
- Domain/area tags
- Technical vs non-technical

**Relationships:**
- Related projects
- Source sessions (traceability)
- Dependencies

**Outcomes:**
- Deliverables produced
- Key decisions
- Lessons learned

---

## Organizational Approaches

### Approach A: Lifecycle-First (Status-Based)

**Structure:**
```
projects/
├── README.md
├── .templates/
│   ├── research-project.md
│   ├── execution-project.md
│   └── hybrid-project.md
├── active/
│   ├── api-modernization/
│   │   ├── PROJECT.md (metadata)
│   │   ├── research/
│   │   ├── design/
│   │   ├── src/
│   │   └── docs/
│   └── ai-agent-coordination/
├── planning/
│   ├── mobile-app-redesign/
│   └── performance-optimization/
├── incubating/
│   ├── blockchain-integration/
│   └── ml-pipeline-exploration/
└── archive/
    ├── 2025/
    │   └── q1/
    │       └── auth-system-upgrade/
    └── 2024/
```

**Pros:**
- **Immediate status visibility** - Know what's "hot" vs "cold"
- **Clear lifecycle management** - Natural progression between states
- **Reduces clutter** - Archive moves old work out of view
- **Promotes action** - "Active" projects get attention
- **Simple mental model** - "Where is this in its lifecycle?"

**Cons:**
- **Frequent reorganization** - Projects move between folders as status changes
- **Type ambiguity** - Can't tell research from execution without diving in
- **Domain blindness** - Related projects may be scattered across status folders
- **External project confusion** - Where do third-party codebases go?

**Promotion Workflow:**
```bash
# 1. Session generates artifacts
sessions/session-20251117-140000-api-auth/artifacts/

# 2. Create project in planning/
mkdir -p projects/planning/api-modernization/research
cp -r sessions/.../artifacts/docs/* projects/planning/api-modernization/research/

# 3. As work progresses, promote to active/
mv projects/planning/api-modernization projects/active/

# 4. Add implementation from new sessions
cp sessions/session-20251118-120000-api-impl/artifacts/code/* \
   projects/active/api-modernization/src/

# 5. When complete, archive by date
mkdir -p projects/archive/2025/q4
mv projects/active/api-modernization projects/archive/2025/q4/
```

**Scaling:**
- **10 projects**: Excellent - clear status at a glance
- **50 projects**: Good - may need subdirectories in active/
- **100+ projects**: Challenging - active/ becomes crowded, need filtering

**Example Project Structure:**
```
projects/active/api-modernization/
├── PROJECT.md
│   # Status: active
│   # Type: execution
│   # Domain: backend-infrastructure
│   # Sessions: session-20251117-140000, session-20251118-120000
├── research/
│   ├── technology-evaluation.md
│   └── architecture-analysis.md
├── design/
│   ├── api-specification.yaml
│   └── database-schema.sql
├── src/
│   ├── auth/
│   └── middleware/
├── tests/
└── docs/
    └── implementation-guide.md
```

**README.md Template:**
```markdown
# Projects - Lifecycle-Organized Workspace

## Active Projects (In Progress)
Currently executing work - these projects are actively receiving updates.

## Planning Projects (Designing)
Architecture, research, and planning phase - not yet in execution.

## Incubating Projects (Exploring)
Early-stage ideas and experiments - may or may not progress to planning.

## Archive (Completed)
Finished projects organized by year and quarter for reference.

## Usage

### Creating a New Project
\`\`\`bash
# Start in planning/ or incubating/ depending on maturity
mkdir -p projects/planning/my-project/{research,design,docs}
cp .templates/execution-project.md projects/planning/my-project/PROJECT.md
\`\`\`

### Promoting a Project
\`\`\`bash
# When ready for active development
mv projects/planning/my-project projects/active/

# When complete
mkdir -p projects/archive/$(date +%Y)/q$(( ($(date +%-m)-1)/3+1 ))
mv projects/active/my-project projects/archive/$(date +%Y)/q$(( ($(date +%-m)-1)/3+1 ))/
\`\`\`

### Promoting Session Artifacts
\`\`\`bash
# Copy artifacts to project
cp -r sessions/$SESSION_ID/artifacts/code/* projects/active/my-project/src/
cp -r sessions/$SESSION_ID/artifacts/docs/* projects/active/my-project/docs/
\`\`\`
```

---

### Approach B: Domain-First (Area-Based)

**Structure:**
```
projects/
├── README.md
├── .templates/
├── ai-systems/
│   ├── agent-coordination/
│   │   ├── PROJECT.md (status: active)
│   │   └── src/
│   ├── reasoningbank-integration/
│   │   ├── PROJECT.md (status: planning)
│   │   └── research/
│   └── .archive/
│       └── neural-training-v1/
├── backend-infrastructure/
│   ├── api-modernization/
│   ├── database-optimization/
│   └── .archive/
├── business-strategy/
│   ├── product-roadmap-2025/
│   ├── market-analysis/
│   └── .archive/
├── learning-development/
│   ├── rust-exploration/
│   ├── ml-fundamentals/
│   └── .archive/
└── external/
    ├── opensourcer-project-analysis/
    ├── client-codebase-review/
    └── .archive/
```

**Pros:**
- **Domain expertise clustering** - Related work stays together
- **No reorganization on status change** - Projects stay in domain folders
- **Clear topical boundaries** - Easy to find "all AI work" or "all backend work"
- **External project clarity** - Dedicated space for third-party work
- **Scales horizontally** - Add new domains as needed

**Cons:**
- **Hidden status** - Can't see active vs complete at a glance
- **Cross-domain projects** - Where does "AI-powered API" go?
- **Domain taxonomy drift** - Categories evolve, require maintenance
- **Requires discipline** - Need consistent domain naming/boundaries

**Promotion Workflow:**
```bash
# 1. Session generates artifacts
sessions/session-20251117-140000-agent-coord/artifacts/

# 2. Identify domain, create project
mkdir -p projects/ai-systems/agent-coordination/{research,src,docs}
cp -r sessions/.../artifacts/* projects/ai-systems/agent-coordination/

# 3. Accumulate artifacts from multiple sessions
cp sessions/session-20251118-120000-agent-impl/artifacts/code/* \
   projects/ai-systems/agent-coordination/src/

# 4. Status tracked in PROJECT.md, not folder structure
# Update PROJECT.md status: planning → active → complete

# 5. Archive within domain
mkdir -p projects/ai-systems/.archive/2025-q4
mv projects/ai-systems/agent-coordination \
   projects/ai-systems/.archive/2025-q4/
```

**Scaling:**
- **10 projects**: Good - clear domains emerge
- **50 projects**: Excellent - domain clustering provides natural organization
- **100+ projects**: Very Good - domains partition complexity, archives keep folders clean

**Example Project Structure:**
```
projects/ai-systems/agent-coordination/
├── PROJECT.md
│   # Status: active (tracked in metadata)
│   # Domain: ai-systems
│   # Type: execution
│   # Related: reasoning-integration, swarm-optimization
├── research/
│   ├── coordination-patterns.md
│   └── topology-analysis.md
├── design/
│   ├── architecture.md
│   └── api-contracts.yaml
├── src/
│   ├── coordinator/
│   └── protocols/
├── tests/
└── docs/
```

**README.md Template:**
```markdown
# Projects - Domain-Organized Workspace

## Domains

### ai-systems/
Artificial intelligence, machine learning, agent coordination, neural networks.

### backend-infrastructure/
APIs, databases, services, cloud infrastructure, DevOps.

### business-strategy/
Planning, product, market analysis, organizational initiatives.

### learning-development/
Personal learning, technology exploration, skill development.

### external/
Third-party codebases, client work, open source contributions.

## Project Status

Projects track status in `PROJECT.md` metadata, not folder structure:
- **planning**: Research and design phase
- **active**: Active development
- **complete**: Finished, in maintenance mode
- **archived**: Moved to `.archive/` within domain

## Usage

### Creating a New Project
\`\`\`bash
# Identify domain first
mkdir -p projects/{domain}/{project-name}/{research,src,docs}
cp .templates/hybrid-project.md projects/{domain}/{project-name}/PROJECT.md

# Edit PROJECT.md to set status: planning
\`\`\`

### Promoting Session Artifacts
\`\`\`bash
# Determine domain and project
cp -r sessions/$SESSION_ID/artifacts/* \
   projects/{domain}/{project-name}/
\`\`\`

### Archiving Completed Projects
\`\`\`bash
# Archive within domain by quarter
mkdir -p projects/{domain}/.archive/2025-q4
mv projects/{domain}/{project-name} \
   projects/{domain}/.archive/2025-q4/
\`\`\`

## Finding Projects by Status
\`\`\`bash
# List all active projects across domains
grep -r "status: active" projects/*/*/PROJECT.md

# List all projects in specific domain
ls projects/ai-systems/
\`\`\`
```

---

### Approach C: Type-First (Work Mode-Based)

**Structure:**
```
projects/
├── README.md
├── .templates/
├── research/
│   ├── ai-coordination-patterns/
│   │   ├── PROJECT.md (domain: ai-systems, status: active)
│   │   ├── literature-review.md
│   │   ├── synthesis.md
│   │   └── findings.md
│   ├── database-performance-study/
│   └── .archive/
├── execution/
│   ├── api-modernization/
│   │   ├── PROJECT.md (domain: backend-infrastructure, status: active)
│   │   ├── src/
│   │   ├── tests/
│   │   └── docs/
│   ├── mobile-app-v2/
│   └── .archive/
├── strategic/
│   ├── product-roadmap-2025/
│   │   ├── PROJECT.md (domain: business-strategy, status: planning)
│   │   ├── market-analysis.md
│   │   ├── competitive-landscape.md
│   │   └── strategic-plan.md
│   ├── architecture-evolution/
│   └── .archive/
├── hybrid/
│   ├── reasoningbank-integration/
│   │   ├── PROJECT.md (domain: ai-systems, status: active)
│   │   ├── research/
│   │   ├── design/
│   │   └── src/
│   ├── ml-pipeline/
│   └── .archive/
└── external/
    ├── opensourcer-analysis/
    └── .archive/
```

**Pros:**
- **Work mode clarity** - Know immediately if project is research, execution, or strategic
- **Appropriate tooling** - Research projects use different tools than execution
- **Hybrid recognition** - Explicitly acknowledges most projects are multi-modal
- **External isolation** - Third-party work clearly separated
- **Phase transitions** - Projects naturally move between types

**Cons:**
- **Reorganization overhead** - Projects may move from research → execution → strategic
- **Type ambiguity for some work** - Not all projects fit cleanly
- **Status still hidden** - Need metadata to know if active/complete
- **Domain fragmentation** - Related domain work scattered across types

**Promotion Workflow:**
```bash
# 1. Session generates research artifacts
sessions/session-20251117-140000-api-research/artifacts/docs/

# 2. Create research project
mkdir -p projects/research/api-modernization-study/{literature,analysis,findings}
cp -r sessions/.../artifacts/docs/* \
   projects/research/api-modernization-study/

# 3. Research complete, transition to execution project
mkdir -p projects/execution/api-modernization/{src,tests,docs}
cp projects/research/api-modernization-study/findings/* \
   projects/execution/api-modernization/docs/reference/

# 4. Implementation sessions add code
cp sessions/session-20251118-120000-api-impl/artifacts/code/* \
   projects/execution/api-modernization/src/

# 5. Archive by type
mkdir -p projects/research/.archive/2025-q4
mv projects/research/api-modernization-study \
   projects/research/.archive/2025-q4/
```

**Scaling:**
- **10 projects**: Good - clear work modes visible
- **50 projects**: Good - types partition well, may need domain sub-folders
- **100+ projects**: Moderate - each type folder becomes large, need sub-organization

**Example Project Structure:**
```
projects/hybrid/reasoningbank-integration/
├── PROJECT.md
│   # Type: hybrid (research + execution)
│   # Domain: ai-systems
│   # Status: active
│   # Phase: implementation (after research complete)
├── research/
│   ├── technology-evaluation.md
│   ├── integration-patterns.md
│   └── proof-of-concept/
├── design/
│   ├── architecture.md
│   ├── api-specification.yaml
│   └── data-model.md
├── src/
│   ├── integration/
│   ├── adapters/
│   └── tests/
└── docs/
    ├── implementation-guide.md
    └── research-summary.md
```

**README.md Template:**
```markdown
# Projects - Type-Organized Workspace

## Research Projects
Pure investigation, analysis, and synthesis work. Deliverables: reports, findings, recommendations.

**Typical artifacts:** Literature reviews, analyses, synthesis documents, proof-of-concepts.

## Execution Projects
Building, implementing, and delivering systems. Deliverables: code, tests, documentation.

**Typical artifacts:** Source code, tests, build scripts, deployment configs.

## Strategic Projects
Planning, architecture, and roadmap work. Deliverables: plans, designs, strategies.

**Typical artifacts:** Strategic plans, architecture documents, roadmaps, decision records.

## Hybrid Projects (Most Common)
Multi-phase projects combining research, strategy, and execution.

**Typical artifacts:** Research → Design → Implementation → Validation.

## External Projects
Third-party codebases under analysis or external consulting work.

**Typical artifacts:** Analysis reports, integration guides, contribution PRs.

## Usage

### Creating a New Project
\`\`\`bash
# Choose type based on primary work mode
mkdir -p projects/{type}/{project-name}/
cp .templates/{type}-project.md projects/{type}/{project-name}/PROJECT.md

# Most projects are hybrid
mkdir -p projects/hybrid/{project-name}/{research,design,src,docs}
\`\`\`

### Transitioning Between Types
\`\`\`bash
# Research complete, move to execution
mkdir -p projects/execution/{project-name}/{src,tests,docs}
cp projects/research/{project-name}/findings/* \
   projects/execution/{project-name}/docs/reference/

# Archive research project
mv projects/research/{project-name} \
   projects/research/.archive/2025-q4/
\`\`\`

### Promoting Session Artifacts
\`\`\`bash
# Identify project type first
cp -r sessions/$SESSION_ID/artifacts/* \
   projects/{type}/{project-name}/
\`\`\`
```

---

### Approach D: Hybrid Adaptive (Recommended)

**Structure:**
```
projects/
├── README.md
├── .index/
│   ├── by-status.md (auto-generated)
│   ├── by-domain.md (auto-generated)
│   ├── by-type.md (auto-generated)
│   └── metadata.json (searchable index)
├── .templates/
│   ├── research-project.md
│   ├── execution-project.md
│   ├── strategic-project.md
│   ├── hybrid-project.md
│   └── external-project.md
├── active/
│   ├── ai-systems/
│   │   ├── agent-coordination/
│   │   │   ├── PROJECT.md (type: execution, status: active)
│   │   │   └── src/
│   │   └── reasoningbank-integration/
│   │       ├── PROJECT.md (type: hybrid, status: active)
│   │       ├── research/
│   │       └── src/
│   ├── backend-infrastructure/
│   │   ├── api-modernization/
│   │   └── database-optimization/
│   ├── business-strategy/
│   │   └── product-roadmap-2025/
│   └── external/
│       └── client-codebase-review/
├── planning/
│   ├── ai-systems/
│   │   └── neural-architecture-search/
│   │       ├── PROJECT.md (type: research, status: planning)
│   │       └── research/
│   └── backend-infrastructure/
│       └── microservices-migration/
└── archive/
    ├── 2025-q4/
    │   └── ai-systems/
    │       └── neural-training-v1/
    ├── 2025-q3/
    └── 2025-q2/
```

**Key Innovation: Three-Dimensional Organization**

1. **Primary axis**: Lifecycle status (active, planning, archive)
2. **Secondary axis**: Domain clustering (ai-systems, backend-infrastructure, etc.)
3. **Metadata axis**: Type, tags, relationships (in PROJECT.md + index)

**Pros:**
- **Best of all worlds** - Status visibility + domain clustering + type tracking
- **Minimal reorganization** - Only moves on status change (rare)
- **Domain context** - Related work naturally grouped
- **Powerful search** - Auto-generated indexes provide multiple views
- **Scales excellently** - Hierarchy handles hundreds of projects
- **Flexible** - Can add new domains without restructuring

**Cons:**
- **Requires index maintenance** - Need tooling to keep indexes current
- **Deeper nesting** - `active/domain/project/` is 3 levels deep
- **Initial complexity** - More sophisticated than flat approaches

**Promotion Workflow:**
```bash
# 1. Session generates artifacts
sessions/session-20251117-140000-agent-coord/artifacts/

# 2. Determine status, domain, type
STATUS="active"  # or "planning"
DOMAIN="ai-systems"
PROJECT="agent-coordination"

# 3. Create project structure
mkdir -p projects/$STATUS/$DOMAIN/$PROJECT/{research,design,src,tests,docs}
cp .templates/execution-project.md \
   projects/$STATUS/$DOMAIN/$PROJECT/PROJECT.md

# 4. Promote artifacts
cp -r sessions/.../artifacts/code/* \
   projects/$STATUS/$DOMAIN/$PROJECT/src/
cp -r sessions/.../artifacts/docs/* \
   projects/$STATUS/$DOMAIN/$PROJECT/docs/

# 5. Update PROJECT.md metadata
# 6. Regenerate index (automated via hook)
npx claude-flow@alpha hooks project-index-update
```

**Status Transitions:**
```bash
# Planning → Active
mv projects/planning/$DOMAIN/$PROJECT \
   projects/active/$DOMAIN/

# Active → Archive
mkdir -p projects/archive/$(date +%Y-q$(( ($(date +%-m)-1)/3+1 )))/$DOMAIN
mv projects/active/$DOMAIN/$PROJECT \
   projects/archive/$(date +%Y-q$(( ($(date +%-m)-1)/3+1 )))/$DOMAIN/
```

**Scaling:**
- **10 projects**: Excellent - all benefits, minimal overhead
- **50 projects**: Excellent - hierarchy and indexes shine
- **100+ projects**: Excellent - designed for this scale

**Example Project Structure:**
```
projects/active/ai-systems/agent-coordination/
├── PROJECT.md
│   # Status: active
│   # Domain: ai-systems
│   # Type: execution
│   # Tags: agents, coordination, distributed-systems
│   # Related: reasoningbank-integration, swarm-optimization
│   # Sessions: [session-20251117-140000, session-20251118-120000]
│   # Owner: user
│   # Created: 2025-11-17
│   # Updated: 2025-11-18
├── research/
│   ├── coordination-patterns.md
│   └── topology-analysis.md
├── design/
│   ├── architecture.md
│   └── sequence-diagrams/
├── src/
│   ├── coordinator/
│   │   ├── mesh.js
│   │   └── hierarchical.js
│   ├── protocols/
│   └── index.js
├── tests/
│   ├── coordinator.test.js
│   └── integration/
└── docs/
    ├── api-reference.md
    └── implementation-guide.md
```

**Auto-Generated Index Example** (`.index/by-status.md`):
```markdown
# Projects by Status

## Active (8 projects)

### ai-systems
- [agent-coordination](../active/ai-systems/agent-coordination/) - Multi-agent coordination framework (execution)
- [reasoningbank-integration](../active/ai-systems/reasoningbank-integration/) - ReasoningBank adaptive learning integration (hybrid)

### backend-infrastructure
- [api-modernization](../active/backend-infrastructure/api-modernization/) - REST API modernization project (execution)
- [database-optimization](../active/backend-infrastructure/database-optimization/) - PostgreSQL performance optimization (execution)

### business-strategy
- [product-roadmap-2025](../active/business-strategy/product-roadmap-2025/) - 2025 product strategy and roadmap (strategic)

### external
- [client-codebase-review](../active/external/client-codebase-review/) - External client codebase analysis (research)

## Planning (3 projects)

### ai-systems
- [neural-architecture-search](../planning/ai-systems/neural-architecture-search/) - Automated neural architecture exploration (research)

### backend-infrastructure
- [microservices-migration](../planning/backend-infrastructure/microservices-migration/) - Monolith to microservices migration (strategic)

---
*Auto-generated: 2025-11-17 23:45:00*
```

**README.md Template:**
```markdown
# Projects - Adaptive Multi-Dimensional Workspace

## Organization Philosophy

Projects are organized by **status** (lifecycle) and **domain** (area), with **type** and other metadata tracked in `PROJECT.md`.

### Primary Structure: Status → Domain → Project

\`\`\`
active/           ← Currently executing work
  ai-systems/     ← Domain clustering
    project-a/    ← Individual project
planning/         ← Design and preparation phase
  ai-systems/
    project-b/
archive/          ← Completed work by quarter
  2025-q4/
    ai-systems/
      project-c/
\`\`\`

### Auto-Generated Indexes

Multiple views of projects available in `.index/`:
- **by-status.md** - Organized by lifecycle phase
- **by-domain.md** - Organized by area of work
- **by-type.md** - Organized by work mode (research, execution, strategic, hybrid)
- **metadata.json** - Machine-readable index for search/tooling

## Domains

Domains are **emergent** - create new ones as needed:

**Current domains:**
- `ai-systems/` - AI, ML, agents, neural networks
- `backend-infrastructure/` - APIs, databases, services, DevOps
- `business-strategy/` - Planning, product, roadmaps
- `learning-development/` - Personal learning, exploration
- `external/` - Third-party work, consulting

**Creating new domains:**
```bash
# Just create the folder - it's self-organizing
mkdir -p projects/active/new-domain/first-project
```

## Project Metadata (PROJECT.md)

Every project has a `PROJECT.md` with:
- **Status**: active, planning, complete, archived
- **Domain**: Primary area of work
- **Type**: research, execution, strategic, hybrid, external
- **Tags**: Searchable keywords
- **Related**: Links to related projects
- **Sessions**: Source sessions that contributed artifacts
- **Owner**: Primary responsible person/team
- **Dates**: Created, updated timestamps

## Usage

### Creating a New Project

\`\`\`bash
# 1. Determine status and domain
STATUS="active"  # or "planning"
DOMAIN="ai-systems"  # or create new domain
PROJECT="my-project"

# 2. Create structure
mkdir -p projects/$STATUS/$DOMAIN/$PROJECT/{research,design,src,tests,docs}

# 3. Copy appropriate template
cp .templates/hybrid-project.md \
   projects/$STATUS/$DOMAIN/$PROJECT/PROJECT.md

# 4. Edit PROJECT.md with project details
\`\`\`

### Promoting Session Artifacts

\`\`\`bash
# Copy artifacts to project
cp -r sessions/$SESSION_ID/artifacts/code/* \
   projects/active/$DOMAIN/$PROJECT/src/

cp -r sessions/$SESSION_ID/artifacts/docs/* \
   projects/active/$DOMAIN/$PROJECT/docs/

# Update PROJECT.md to reference session
echo "- session-$SESSION_ID" >> \
   projects/active/$DOMAIN/$PROJECT/PROJECT.md
\`\`\`

### Transitioning Project Status

\`\`\`bash
# Planning → Active (when development begins)
mv projects/planning/$DOMAIN/$PROJECT \
   projects/active/$DOMAIN/

# Active → Archive (when complete)
QUARTER="$(date +%Y-q$(( ($(date +%-m)-1)/3+1 )))"
mkdir -p projects/archive/$QUARTER/$DOMAIN
mv projects/active/$DOMAIN/$PROJECT \
   projects/archive/$QUARTER/$DOMAIN/
\`\`\`

### Finding Projects

\`\`\`bash
# By status
ls projects/active/

# By domain
ls projects/active/ai-systems/

# By type (via index)
cat .index/by-type.md

# Search metadata
grep -r "tag: distributed-systems" projects/*/*/*/PROJECT.md
\`\`\`

## Index Maintenance

Indexes auto-regenerate on project changes via hooks. Manual regeneration:

\`\`\`bash
npx claude-flow@alpha hooks project-index-update
\`\`\`

## Best Practices

1. **One project = One focus** - Keep projects scoped
2. **Rich metadata** - Fill out PROJECT.md completely
3. **Link sessions** - Track which sessions contributed
4. **Tag generously** - Enable future discovery
5. **Archive quarterly** - Keep active/ focused on current work
6. **Promote deliberately** - Session artifacts → projects is intentional

## Related Documentation

- [Session Management](../sessions/README.md) - Understanding session lifecycle
- [File Routing](../docs/explanation/file-routing.md) - Where files go
- [Workspace Architecture](../docs/explanation/workspace-architecture.md) - Overall design
```

---

## Decision Framework

### Question Set for HITL

**1. Work Style Alignment**

"How do you think about your projects?"

- [ ] **By lifecycle phase** - "What am I working on NOW vs LATER?"
- [ ] **By domain/area** - "All my AI work in one place, all backend in another"
- [ ] **By work mode** - "This is research, that's execution, this is strategy"
- [ ] **By multiple dimensions** - "I want status + domain + flexible views"

**2. Organization Preferences**

"When looking for a project, what's your first question?"

- [ ] **"Is this active or archived?"** → Lifecycle-First (Approach A)
- [ ] **"What domain is this in?"** → Domain-First (Approach B)
- [ ] **"Is this research or execution?"** → Type-First (Approach C)
- [ ] **"I want multiple ways to find it"** → Hybrid Adaptive (Approach D)

**3. Scale Expectations**

"How many projects do you expect in 1 year?"

- [ ] **10-20 projects** - Any approach works, choose by preference
- [ ] **20-50 projects** - Domain-First or Hybrid Adaptive recommended
- [ ] **50-100 projects** - Hybrid Adaptive strongly recommended
- [ ] **100+ projects** - Hybrid Adaptive required for maintainability

**4. Reorganization Tolerance**

"How do you feel about moving project folders as status changes?"

- [ ] **"I'm fine with it"** - Lifecycle-First or Hybrid Adaptive
- [ ] **"I prefer stability"** - Domain-First or Type-First
- [ ] **"Minimal moves only"** - Hybrid Adaptive (only on status change)

**5. External Projects Volume**

"How often will you bring in external projects?"

- [ ] **Rarely** - Any approach works
- [ ] **Occasionally** - All approaches have external/ folder
- [ ] **Frequently** - Domain-First or Hybrid Adaptive (better isolation)

**6. Cross-Domain Work**

"Do you have projects that span multiple domains?"

- [ ] **Rarely** - Any approach works
- [ ] **Sometimes** - Use tags in PROJECT.md, any approach
- [ ] **Often** - Hybrid Adaptive (flexible tagging + indexing)

### Recommendation Matrix

| Scenario | Recommended Approach | Rationale |
|----------|---------------------|-----------|
| **Small workspace (10-20 projects)** | Lifecycle-First (A) | Simplicity + immediate status visibility |
| **Domain-focused work** | Domain-First (B) | Natural clustering of related work |
| **Research-heavy workflow** | Type-First (C) | Clear distinction between research and execution |
| **Large workspace (50+ projects)** | Hybrid Adaptive (D) | Scales best, multiple discovery paths |
| **Frequent external projects** | Domain-First (B) or Hybrid Adaptive (D) | Clear external/ isolation |
| **Low reorganization tolerance** | Domain-First (B) | Projects don't move on status change |
| **Need flexibility** | Hybrid Adaptive (D) | Multiple views via indexing |

---

## Industry Examples & Evidence

### Example 1: GitHub Repository Organization
- **Approach**: Domain-First (by language/framework)
- **Scale**: Thousands of repos
- **Discovery**: Tags + search
- **Takeaway**: Domain clustering works at massive scale with good metadata

### Example 2: Notion Workspace Organization
- **Approach**: Hybrid (status + area + type)
- **Scale**: Hundreds of pages
- **Discovery**: Multiple database views
- **Takeaway**: Multiple views of same data = powerful UX

### Example 3: Engineering Wiki Structures
- **Approach**: Lifecycle-First (archived vs active documentation)
- **Scale**: 50-200 pages
- **Discovery**: Status-based navigation
- **Takeaway**: Status visibility reduces clutter, improves focus

### Example 4: Consulting Firm Project Management
- **Approach**: Hybrid (client + status + type)
- **Scale**: 100-500 projects/year
- **Discovery**: Multi-dimensional filtering
- **Takeaway**: Complex work requires multi-dimensional organization

### Scalability Analysis

**Flat Structure** (no subdirectories):
- **10 projects**: ✅ Excellent
- **50 projects**: ⚠️ Becoming unwieldy
- **100+ projects**: ❌ Unmanageable

**Single-Dimension Hierarchy** (lifecycle OR domain OR type):
- **10 projects**: ✅ Excellent
- **50 projects**: ✅ Good
- **100+ projects**: ⚠️ Top-level folders become crowded

**Two-Dimension Hierarchy** (status + domain):
- **10 projects**: ✅ Excellent
- **50 projects**: ✅ Excellent
- **100+ projects**: ✅ Scales well

**Metadata + Indexing** (any structure + search):
- **10 projects**: ✅ Excellent (though overkill)
- **50 projects**: ✅ Excellent
- **100+ projects**: ✅ Essential for discovery

---

## Recommended Approach: Hybrid Adaptive (D)

**Why this wins:**

1. **Immediate status visibility** - `active/` vs `planning/` vs `archive/`
2. **Domain context** - Related work clustered within status folders
3. **Metadata flexibility** - Type, tags, relationships in PROJECT.md
4. **Multiple discovery paths** - Browse by status/domain, search by type/tags
5. **Minimal reorganization** - Only moves on status change (infrequent)
6. **Scales to 100+ projects** - Hierarchical structure + indexing
7. **External project clarity** - Dedicated external/ domain in each status folder
8. **Emergent domains** - Create new domains as needed without restructuring

**Implementation Priority:**

**Phase 1: Basic Structure**
```bash
mkdir -p projects/{active,planning,archive}/.templates
mkdir -p projects/.index
```

**Phase 2: Template Creation**
- Create PROJECT.md templates for each type
- Include all metadata fields

**Phase 3: Index Tooling** (can be manual initially)
- Script to generate by-status.md
- Script to generate by-domain.md
- Script to generate by-type.md
- Script to generate metadata.json

**Phase 4: Hook Integration**
- Auto-update indexes on project changes
- Auto-link sessions to projects

---

## Next Steps

**For User:**

1. **Review approaches** - Which organizational mental model feels right?
2. **Answer decision framework questions** - Clarify preferences
3. **Choose approach** (or request hybrid of multiple)
4. **Approve for implementation**

**For Implementation:**

1. Create directory structure
2. Write PROJECT.md templates
3. Write README.md with usage patterns
4. Create index generation tooling (if Hybrid Adaptive chosen)
5. Document promotion workflows

---

## Memory Storage

Storing this analysis for future reference:

**Namespace**: `workspace-optimization-20251117`
**Key**: `projects-design`
**Value**: Four organizational approaches designed from first principles:
- Approach A: Lifecycle-First (status-based)
- Approach B: Domain-First (area-based)
- Approach C: Type-First (work mode-based)
- Approach D: Hybrid Adaptive (status + domain + metadata) [RECOMMENDED]

**Recommendation**: Hybrid Adaptive approach for scalability, flexibility, and multiple discovery paths. Scales to 100+ projects with minimal reorganization overhead.

**Decision needed**: User to select approach based on work style and scale expectations.
