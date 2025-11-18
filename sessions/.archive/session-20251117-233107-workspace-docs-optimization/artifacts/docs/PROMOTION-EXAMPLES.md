# Promotion Workflow Examples

**Session**: session-20251117-233107-workspace-docs-optimization
**Purpose**: Real-world examples of content promotion workflows

---

## Example 1: Research Session → Documentation

### Scenario
AI researcher creates comprehensive API design research across 3 sessions. User wants to promote best findings to workspace docs.

### Session Content
```
sessions/session-20251117-100000-api-research/artifacts/docs/
├── REST-API-PATTERNS.md        (quality: 9/10)
├── GRAPHQL-COMPARISON.md       (quality: 8/10)
├── RESEARCH-NOTES.md           (quality: 4/10)
└── SCRATCH-THOUGHTS.md         (quality: 2/10)
```

### Tagging (Approach B)
```markdown
<!-- PROMOTE: docs/reference/rest-api-design-patterns.md -->
<!-- QUALITY: 9/10 -->
<!-- CATEGORIES: research, api-design, rest -->
# REST API Design Patterns

Comprehensive research on modern REST API design...
```

### Workflow
```bash
# 1. Session closeout triggers auto-scan
npx claude-flow@alpha hooks session-end --export-metrics true
# → Detects PROMOTE tags, stages 2 files

# 2. Review staged promotions
promote review-staged
# Output:
#   [HIGH] REST-API-PATTERNS.md → docs/reference/rest-api-design-patterns.md
#   [HIGH] GRAPHQL-COMPARISON.md → docs/reference/graphql-vs-rest.md

# 3. Approve high-quality files
promote approve-staged --quality-min 8
# → Promotes both files automatically

# 4. Verify
ls docs/reference/
# Output:
#   rest-api-design-patterns.md
#   graphql-vs-rest.md
```

### Result
```yaml
promoted_artifacts:
  - source: sessions/session-20251117-100000-api-research/artifacts/docs/REST-API-PATTERNS.md
    target: docs/reference/rest-api-design-patterns.md
    quality: 9/10
    promoted_at: 2025-11-17T10:45:00Z

  - source: sessions/session-20251117-100000-api-research/artifacts/docs/GRAPHQL-COMPARISON.md
    target: docs/reference/graphql-vs-rest.md
    quality: 8/10
    promoted_at: 2025-11-17T10:45:01Z

skipped_artifacts:
  - RESEARCH-NOTES.md (quality: 4/10, below threshold)
  - SCRATCH-THOUGHTS.md (quality: 2/10, no PROMOTE tag)
```

---

## Example 2: Multi-Session Code Development → Projects

### Scenario
AI coder implements feature across 5 sessions. User wants to consolidate best code to projects/.

### Session Content
```
sessions/session-20251116-*/artifacts/code/
├── session-1: Initial prototype (quality: 6/10)
├── session-2: Refactored version (quality: 8/10)
├── session-3: Bug fixes (quality: 7/10)
├── session-4: Final implementation (quality: 9/10)
└── session-5: Performance optimization (quality: 8/10)
```

### Workflow (Manual CLI - Approach A)
```bash
# 1. List recent sessions
promote list-sessions 10
# Output shows 5 API-related sessions

# 2. Scan each session
promote scan sessions/session-20251116-140000-api-impl
# Output: Found server.js (quality: 6/10)

promote scan sessions/session-20251117-090000-api-refactor
# Output: Found server.js (quality: 9/10) ← Best version

# 3. Manually promote best version
promote to-projects \
  sessions/session-20251117-090000-api-refactor/artifacts/code/server.js \
  projects/api-server/server.js

# 4. Promote performance optimizations
promote to-projects \
  sessions/session-20251117-110000-api-optimize/artifacts/code/cache.js \
  projects/api-server/lib/cache.js

# 5. Verify
tree projects/api-server/
# Output:
#   projects/api-server/
#   ├── server.js
#   └── lib/
#       └── cache.js
```

---

## Example 3: Tool Development → Scripts

### Scenario
AI creates useful automation scripts during session work. User wants to make them reusable workspace tools.

### Session Content
```
sessions/session-20251117-120000-automation/artifacts/scripts/
├── deploy-helper.sh        (PROMOTE tagged)
├── test-runner.sh          (PROMOTE tagged)
├── debug-session.sh        (working notes, not tagged)
└── temp-fix.sh             (one-off script, not tagged)
```

### Tagging
```bash
#!/bin/bash
# PROMOTE: scripts/deploy-helper.sh
# QUALITY: 9/10
# CATEGORIES: tool, deployment, automation

# deploy-helper.sh - Production deployment automation
set -euo pipefail

deploy_app() {
  # Implementation...
}
```

### Workflow
```bash
# 1. Tag-based scan
promote scan-tags sessions/session-20251117-120000-automation

# Output:
# Staged 2 files:
#   deploy-helper.sh → scripts/deploy-helper.sh (Quality: 9/10)
#   test-runner.sh → scripts/test-runner.sh (Quality: 8/10)

# 2. Review and approve
promote review-staged
promote approve-staged --auto

# 3. Make executable
chmod +x scripts/deploy-helper.sh scripts/test-runner.sh

# 4. Test immediately
scripts/deploy-helper.sh --help
```

---

## Example 4: High-Volume Discovery (Approach C)

### Scenario
AI generates 100 sessions over 1 week. User wants to discover valuable content without manually reviewing all sessions.

### Workflow
```bash
# 1. Bulk analysis
promote analyze-recent --days 7 --quality-min 8.0

# Output:
# Analyzed 100 sessions, found 23 high-quality artifacts:
#
# Research (8 artifacts):
#   session-20251110-* → ML-OPTIMIZATION.md (9.5/10)
#   session-20251112-* → DATABASE-SCALING.md (9.0/10)
#   session-20251113-* → API-SECURITY.md (8.8/10)
#   ...
#
# Guides (7 artifacts):
#   session-20251111-* → DEPLOYMENT-GUIDE.md (9.2/10)
#   session-20251114-* → TESTING-BEST-PRACTICES.md (8.5/10)
#   ...
#
# Tools (5 artifacts):
#   session-20251115-* → performance-monitor.sh (8.7/10)
#   ...
#
# Code (3 artifacts):
#   session-20251116-* → caching-layer.js (9.0/10)
#   ...

# 2. Review suggestions
promote review-suggestions --interactive

# Shows each artifact with quality report:
#
# [1/23] ML-OPTIMIZATION.md (9.5/10)
#   Metrics:
#     Completeness: 10/10 (intro, body, conclusion, examples)
#     Technical depth: 9/10 (advanced algorithms, benchmarks)
#     Organization: 10/10 (clear hierarchy, TOC)
#     Originality: 9/10 (custom insights, unique approaches)
#     Reusability: 9/10 (general patterns, adaptable)
#
#   Suggested target: docs/reference/ml-optimization-techniques.md
#
#   Options: [a]ccept, [r]eject, [e]dit target, [d]efer, [n]ext

# 3. Batch accept high-quality research
promote accept-suggestions --quality-min 9.0 --category research

# 4. Review medium-quality suggestions
promote accept-suggestions --quality-range 8.0-8.9 --review-each
```

### Discovery Benefits
- Found 8 research docs user didn't know existed
- Identified 5 reusable tools across different sessions
- Discovered 3 high-quality code implementations
- Saved 4+ hours of manual session review

---

## Example 5: Pipeline Workflow for Critical Content (Approach D)

### Scenario
AI creates architecture decision document. User needs peer review before promoting to docs/reference/.

### Workflow
```bash
# 1. Auto-scan identifies critical content
promote pipeline scan --sessions-recent 7
# Output: Found ARCHITECTURE-DECISION.md (quality: 9/10)

# 2. Quick triage
promote pipeline triage
# [1/15] ARCHITECTURE-DECISION.md (quality: 9.0)
#   Preview: "Decision to adopt microservices architecture..."
#   Suggest: docs/reference/architecture-decisions/microservices.md
#
#   Options: [a]ccept, [r]eject, [e]dit, [d]efer, [n]ext
# User presses 'a' → Moved to refinement

# 3. Refinement stage
promote pipeline refine
# Opens editor with:
#   - Auto-generated frontmatter
#   - Formatting cleanup
#   - Cross-reference suggestions

# User edits:
---
title: Microservices Architecture Decision
date: 2025-11-17
status: proposed
reviewers: [alice, bob]
related: [docs/reference/api-design.md]
---

# Microservices Architecture Decision

[Content...]

# 4. Request peer review
promote pipeline request-review \
  --file ARCHITECTURE-DECISION.md \
  --reviewer alice \
  --message "Please review microservices decision"

# 5. Alice reviews and approves
# (External review process)

# 6. Final promotion
promote pipeline finalize
# Ready to promote 1 artifact:
#   [1] ARCHITECTURE-DECISION.md → docs/reference/architecture-decisions/microservices.md
#   Reviewed by: alice
#   Approved at: 2025-11-17T14:30:00Z
#
# Confirm promotion? [y/n]
# User types 'y'

# 7. Verify
cat docs/reference/architecture-decisions/microservices.md
```

---

## Example 6: Hybrid Workflow (B + C)

### Scenario
User wants agents to tag obvious promotions, but also wants AI to discover untagged gems.

### Setup
```yaml
# .promote-rules.yml
hybrid_mode:
  enabled: true
  tag_based:
    auto_promote: true
    quality_threshold: 8
  ai_suggestions:
    enabled: true
    analyze_untagged: true
    quality_threshold: 7
```

### Workflow
```bash
# 1. Session closeout
npx claude-flow@alpha hooks session-end --export-metrics true

# Auto-stages tagged files:
#   [HIGH] API-DESIGN.md → docs/reference/api-design-patterns.md (tagged)
#   [HIGH] DEPLOYMENT.md → docs/how-to/deployment-guide.md (tagged)

# 2. AI analyzes untagged content
promote analyze-untagged sessions/session-20251117-* --quality-min 7.0

# Discovers:
#   [MED] RESEARCH-NOTES.md (7.5/10) - Not tagged, but high quality
#   Suggest: docs/reference/api-research-notes.md

# 3. Review all (tagged + AI suggestions)
promote review-all --group-by confidence

# Output:
# High Confidence (agent-tagged):
#   [HIGH] API-DESIGN.md → docs/reference/api-design-patterns.md
#   [HIGH] DEPLOYMENT.md → docs/how-to/deployment-guide.md
#
# Medium Confidence (AI-suggested):
#   [MED] RESEARCH-NOTES.md → docs/reference/api-research-notes.md

# 4. Auto-approve high confidence, review medium
promote approve --high-confidence-auto --medium-interactive
```

### Benefits
- Agent tagging catches 80% of promotions
- AI discovers 20% of valuable untagged content
- User maintains control with confidence levels
- Best of both approaches

---

## Example 7: Update Existing Promoted Content

### Scenario
User promoted GUIDE.md last week. Session work improved the guide. How to handle updates?

### Workflow
```bash
# 1. Detect existing promotion
promote scan-tags sessions/session-20251117-150000-guide-update

# Output:
# ⚠️  GUIDE.md targets existing file:
#   Target: docs/how-to/deployment-guide.md
#   Original: sessions/session-20251110-*/GUIDE.md (promoted 2025-11-10)
#   Current: Updated version with improvements
#
#   Options:
#     [o]verwrite existing file
#     [m]erge changes
#     [v]ersion as new file (deployment-guide-v2.md)
#     [s]kip

# 2. User chooses 'v' (version)
promote approve-staged --handle-duplicates version

# Result:
#   docs/how-to/
#   ├── deployment-guide.md        (original, preserved)
#   └── deployment-guide-v2.md     (updated version)
```

### Alternative: Merge Strategy
```bash
# Use git-style merge
promote approve-staged --handle-duplicates merge

# Opens diff editor:
#   Left: Current docs/how-to/deployment-guide.md
#   Right: Updated sessions/.../GUIDE.md
#
# User merges changes, saves, promotes merged version
```

---

## Summary of Example Patterns

| Pattern | Best For | Example |
|---------|----------|---------|
| **Tag-based** | Known-good content | Ex 1, 3, 6 |
| **Manual CLI** | Selective curation | Ex 2 |
| **AI Discovery** | High-volume filtering | Ex 4 |
| **Pipeline** | Critical content | Ex 5 |
| **Hybrid** | Balanced approach | Ex 6 |
| **Update handling** | Iterative refinement | Ex 7 |

---

**Memory Key**: `workspace-optimization-20251117/promotion-examples`
