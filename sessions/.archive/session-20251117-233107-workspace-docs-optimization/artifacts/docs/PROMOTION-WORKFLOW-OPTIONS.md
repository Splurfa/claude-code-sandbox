# Session Content Promotion Workflow Options

**Session**: session-20251117-233107-workspace-docs-optimization
**Date**: 2025-11-17
**Context**: AI generates 1000 docs/hr in sessions/. User promotes valuable content to workspace.

---

## Executive Summary

This document presents 4 practical workflows for promoting session content to workspace locations. Each approach balances automation, user control, and scalability for handling high-volume session output.

**Quick Comparison**:

| Approach | User Effort | Reliability | Scalability | Best For |
|----------|-------------|-------------|-------------|----------|
| A: Manual CLI Review | Medium | High | Good | Careful curation |
| B: Tag-Based Auto-Promotion | Low | High | Excellent | Known-good content |
| C: Quality-Based Suggestions | Low-Medium | Medium-High | Excellent | Large-scale filtering |
| D: Staged Review Pipeline | Medium-High | Very High | Excellent | Critical content |

---

## Approach A: Manual Review with CLI Tools

### Overview
User manually reviews session artifacts and promotes via CLI commands with smart organization.

### Workflow

```bash
# 1. List recent sessions with summaries
promote list-sessions --recent 10
# Output:
# session-20251117-100000-api-design (12 files, 3 promotable)
#   - RESEARCH.md (research quality: 8/10)
#   - API-SPEC.md (reference quality: 9/10)
#   - NOTES.md (working notes, low quality)

# 2. Preview promotable content
promote scan sessions/session-20251117-100000-api-design
# Output:
# High-quality artifacts found:
#   [docs] RESEARCH.md → projects/research/api-design-research.md
#   [docs] API-SPEC.md → docs/reference/api-specification.md
#   [code] server.js → projects/api-server/server.js

# 3. Promote specific files
promote to-projects sessions/.../artifacts/docs/RESEARCH.md \
  --target projects/research/api-design-research.md \
  --preserve-metadata

promote to-docs sessions/.../artifacts/docs/API-SPEC.md \
  --target docs/reference/api-specification.md \
  --add-frontmatter

# 4. Batch promotion
promote batch sessions/session-20251117-100000-api-design \
  --interactive  # Prompts for each file

# 5. Track promotions
promote history --session session-20251117-100000-api-design
# Output:
# Promoted 2 artifacts:
#   2025-11-17 10:45 - RESEARCH.md → projects/research/api-design-research.md
#   2025-11-17 10:46 - API-SPEC.md → docs/reference/api-specification.md
```

### File Organization Logic

```bash
# Smart target detection based on content
promote to-projects sessions/.../RESEARCH.md
# Auto-detects: projects/research/<session-topic>-research.md

promote to-docs sessions/.../GUIDE.md
# Auto-suggests: docs/how-to/<topic>-guide.md

# Override with explicit target
promote to-projects sessions/.../RESEARCH.md \
  --target projects/custom-location/file.md
```

### Metadata Preservation

```yaml
# Promoted file gets frontmatter
---
promoted_from: sessions/session-20251117-100000-api-design/artifacts/docs/RESEARCH.md
promoted_date: 2025-11-17T10:45:00Z
session_id: session-20251117-100000-api-design
original_agent: researcher
quality_score: 8/10
---

# Original Content Below
```

### CLI Implementation

```bash
#!/bin/bash
# promote-content.sh

promote() {
  local command=$1
  shift

  case $command in
    list-sessions)
      # List recent sessions with quality scores
      ;;
    scan)
      # Analyze session for promotable content
      ;;
    to-projects|to-docs|to-root)
      # Promote specific file
      ;;
    batch)
      # Batch promotion with interactive mode
      ;;
    history)
      # Show promotion history
      ;;
  esac
}
```

### Pros
- ✅ **Full user control**: Every promotion is intentional
- ✅ **Flexible targeting**: Override auto-detection
- ✅ **Clear audit trail**: Track what was promoted when
- ✅ **Safe**: No accidental promotions
- ✅ **Smart defaults**: Good suggestions for common patterns

### Cons
- ❌ **Manual effort**: User must review each session
- ❌ **Scalability concern**: 1000 docs/hr requires filtering
- ❌ **Potential missed content**: Relies on user memory

### Best For
- Important research artifacts
- User knows which sessions contain valuable content
- Content requiring careful curation

---

## Approach B: Tag-Based Auto-Promotion

### Overview
Content creators (AI agents) tag content during creation. Tagged content is auto-promoted.

### Tagging Syntax

```markdown
<!-- PROMOTE: projects/research/topic-name.md -->
<!-- QUALITY: 8/10 -->
<!-- CATEGORIES: research, api-design, architecture -->
# Research Document

Content here...
```

```python
# PROMOTE: projects/tools/data-processor.py
# QUALITY: 9/10
# CATEGORIES: tool, data-processing

def process_data():
    pass
```

### Workflow

```bash
# 1. Agent creates content with promotion tags
# (Done automatically during session work)

# 2. Session closeout scans for promotion tags
npx claude-flow@alpha hooks session-end --export-metrics true
# Auto-detects promotion tags and stages files

# 3. User reviews staged promotions
promote review-staged
# Output:
# 3 files staged for promotion:
#   [HIGH] RESEARCH.md → projects/research/api-design-research.md
#   [HIGH] API-SPEC.md → docs/reference/api-specification.md
#   [MED]  NOTES.md → docs/reference/implementation-notes.md
#
# Options: [a]ccept all, [s]elect individual, [r]eject all

# 4. Approve promotions
promote approve-staged --selective
# Prompts: "Promote RESEARCH.md? [y/n/e(dit target)]"

# 5. Auto-promotion (optional)
promote approve-staged --auto --quality-threshold 8
# Auto-promotes files with quality >= 8/10
```

### Promotion Rules File

```yaml
# .promote-rules.yml
auto_promote:
  enabled: true
  quality_threshold: 8
  categories:
    - research
    - reference
    - tool

  rules:
    - match: "*.md"
      contains: "PROMOTE: projects/research/"
      quality_min: 7
      auto: true

    - match: "*.md"
      contains: "PROMOTE: docs/reference/"
      quality_min: 8
      auto: true

    - match: "*.sh"
      contains: "PROMOTE: projects/tools/"
      quality_min: 9
      auto: false  # Always require review for scripts

staging:
  location: .promote-staged/
  expiry_days: 7  # Auto-clear after 7 days
```

### CLI Implementation

```bash
# promote-content.sh with tag support

promote_scan_tags() {
  local session_dir=$1

  # Scan for promotion tags
  grep -r "PROMOTE:" "$session_dir/artifacts" | while read -r match; do
    local file=$(echo "$match" | cut -d: -f1)
    local target=$(echo "$match" | grep -oP 'PROMOTE:\s*\K.*')
    local quality=$(grep "QUALITY:" "$file" | grep -oP '\d+/\d+')

    # Stage for promotion
    stage_promotion "$file" "$target" "$quality"
  done
}
```

### Pros
- ✅ **Low user effort**: Agents tag during creation
- ✅ **Excellent scalability**: Handles 1000 docs/hr
- ✅ **Intent capture**: Tagging happens at creation time
- ✅ **Flexible automation**: Auto-promote high-quality content
- ✅ **Safety net**: Review before final promotion

### Cons
- ❌ **Requires discipline**: Agents must tag consistently
- ❌ **Tag maintenance**: Rules need periodic updates
- ❌ **False positives**: Agents might over-tag

### Best For
- High-volume session output
- Known-good content patterns
- Automated workflows with review gates

---

## Approach C: Quality-Based Auto-Suggestions

### Overview
AI analyzes session content post-creation and suggests promotions based on quality metrics.

### Quality Analysis Metrics

```javascript
// Quality scoring algorithm
const qualityMetrics = {
  completeness: {
    weight: 0.25,
    checks: [
      'has_introduction',
      'has_conclusion',
      'has_examples',
      'has_proper_headings'
    ]
  },

  technical_depth: {
    weight: 0.20,
    checks: [
      'code_examples_count > 2',
      'technical_terms_used',
      'references_external_docs'
    ]
  },

  organization: {
    weight: 0.20,
    checks: [
      'heading_hierarchy_valid',
      'toc_present',
      'sections_balanced'
    ]
  },

  originality: {
    weight: 0.15,
    checks: [
      'not_duplicate',
      'unique_insights',
      'custom_examples'
    ]
  },

  reusability: {
    weight: 0.20,
    checks: [
      'generalized_approach',
      'clear_instructions',
      'standalone_content'
    ]
  }
};
```

### Workflow

```bash
# 1. Analyze session content
promote analyze sessions/session-20251117-100000-api-design
# Output:
# Analysis Results:
#
# HIGH QUALITY (8-10/10) - Recommend Promotion:
#   [9.2] RESEARCH.md
#     - Complete research with sources
#     - Well-organized sections
#     - Reusable patterns identified
#     → Suggest: docs/reference/api-design-patterns.md
#
#   [8.7] API-SPEC.md
#     - Comprehensive API documentation
#     - Clear examples
#     → Suggest: docs/reference/rest-api-specification.md
#
# MEDIUM QUALITY (5-7/10) - Review Before Promotion:
#   [6.5] IMPLEMENTATION.md
#     - Partial implementation notes
#     - Missing conclusion
#     → Needs: Completion, examples
#
# LOW QUALITY (0-4/10) - Do Not Promote:
#   [3.2] SCRATCH.md
#     - Working notes only
#     - No structure

# 2. Accept suggestions
promote accept-suggestions sessions/session-20251117-100000-api-design \
  --quality-threshold 8.0 \
  --review-medium  # Opens medium-quality files for review

# 3. Batch analysis across sessions
promote analyze-recent --days 7 --quality-min 8.0
# Output:
# Found 15 high-quality artifacts across 42 sessions:
#   session-20251115-* → 3 artifacts
#   session-20251116-* → 8 artifacts
#   session-20251117-* → 4 artifacts
#
# Options: [v]iew list, [p]romote all, [s]elect individual

# 4. Review and refine suggestions
promote review-suggestions --interactive
# Shows each suggestion with quality report
# User can: accept, reject, edit target, defer
```

### Analysis Report Format

```yaml
# .promote-analysis/session-20251117-100000-api-design.yml
session_id: session-20251117-100000-api-design
analyzed_at: 2025-11-17T10:30:00Z
total_artifacts: 8

recommendations:
  - file: artifacts/docs/RESEARCH.md
    quality_score: 9.2
    metrics:
      completeness: 9.5
      technical_depth: 9.0
      organization: 9.5
      originality: 8.5
      reusability: 9.0
    suggested_target: docs/reference/api-design-patterns.md
    reasoning: |
      Comprehensive research document with clear patterns,
      multiple examples, and reusable insights. High technical
      depth and excellent organization.
    recommendation: PROMOTE
    confidence: HIGH

  - file: artifacts/docs/SCRATCH.md
    quality_score: 3.2
    metrics:
      completeness: 2.0
      technical_depth: 4.0
      organization: 3.0
      originality: 5.0
      reusability: 2.0
    suggested_target: null
    reasoning: |
      Working notes with no clear structure. Content is
      exploratory and not suitable for promotion.
    recommendation: DO_NOT_PROMOTE
    confidence: HIGH
```

### CLI Implementation

```bash
# promote-content.sh with quality analysis

analyze_quality() {
  local file=$1

  # Run quality checks
  local completeness=$(check_completeness "$file")
  local depth=$(check_technical_depth "$file")
  local org=$(check_organization "$file")
  local orig=$(check_originality "$file")
  local reuse=$(check_reusability "$file")

  # Calculate weighted score
  local score=$(calculate_weighted_score \
    "$completeness" "$depth" "$org" "$orig" "$reuse")

  # Generate recommendation
  if (( $(echo "$score >= 8.0" | bc -l) )); then
    echo "PROMOTE"
  elif (( $(echo "$score >= 5.0" | bc -l) )); then
    echo "REVIEW"
  else
    echo "DO_NOT_PROMOTE"
  fi
}
```

### Pros
- ✅ **Intelligent filtering**: AI reduces review workload
- ✅ **Excellent scalability**: Handles 1000 docs/hr
- ✅ **Objective metrics**: Consistent quality assessment
- ✅ **Discovers hidden gems**: Finds content user might miss
- ✅ **Learning system**: Improves with feedback

### Cons
- ❌ **Complex implementation**: Requires quality analysis engine
- ❌ **Tuning required**: Metrics need calibration
- ❌ **False negatives**: Might miss valuable content
- ❌ **Analysis overhead**: Processing time for large sessions

### Best For
- High-volume content generation
- Discovery of valuable content across many sessions
- Users who trust AI quality assessment

---

## Approach D: Staged Review Pipeline

### Overview
Multi-stage promotion pipeline with progressive refinement and peer review.

### Pipeline Stages

```
Session Artifacts
    ↓
Stage 1: Auto-Scan (quality filter)
    ↓
Stage 2: Human Review (quick triage)
    ↓
Stage 3: Refinement (editing, formatting)
    ↓
Stage 4: Peer Review (optional, for critical content)
    ↓
Stage 5: Final Promotion
    ↓
Workspace (projects/, docs/)
```

### Workflow

```bash
# Stage 1: Auto-scan sessions
promote pipeline scan --sessions-recent 7
# Output:
# Scanned 42 sessions, found 23 candidates
# Moved to review queue: .promote-pipeline/review/

# Stage 2: Quick triage
promote pipeline triage
# Output:
# 23 artifacts in review queue
#
# [1/23] RESEARCH.md (quality: 9.2)
#   Preview: "Comprehensive research on API design patterns..."
#   Suggest: docs/reference/api-design-patterns.md
#
#   Options: [a]ccept, [r]eject, [e]dit, [d]efer, [n]ext
#
# User presses 'a'
# → Moved to refinement: .promote-pipeline/refine/

# Stage 3: Refinement (batch editor)
promote pipeline refine
# Opens editor with all accepted files
# User can:
#   - Add frontmatter
#   - Fix formatting
#   - Add cross-references
#   - Update file naming

# Stage 4: Peer review (optional)
promote pipeline request-review \
  --file RESEARCH.md \
  --reviewer alice \
  --message "Please review API design patterns doc"
# Sends notification, creates review task

# Stage 5: Final promotion
promote pipeline finalize
# Output:
# Ready to promote 8 artifacts:
#   [1] RESEARCH.md → docs/reference/api-design-patterns.md
#   [2] API-SPEC.md → docs/reference/rest-api-spec.md
#   ...
#
# Confirm promotion? [y/n]

# Track pipeline status
promote pipeline status
# Output:
# Pipeline Status:
#   Review Queue: 12 artifacts
#   Refinement: 5 artifacts
#   Pending Review: 2 artifacts
#   Ready for Promotion: 8 artifacts
```

### Pipeline State Management

```yaml
# .promote-pipeline/state.yml
stages:
  review:
    path: .promote-pipeline/review/
    artifacts:
      - file: session-20251117-*/RESEARCH.md
        quality: 9.2
        added_at: 2025-11-17T10:00:00Z
        status: pending

  refinement:
    path: .promote-pipeline/refine/
    artifacts:
      - file: RESEARCH.md
        target: docs/reference/api-design-patterns.md
        reviewer_id: user
        refined_at: 2025-11-17T10:15:00Z
        status: in_progress

  peer_review:
    path: .promote-pipeline/peer-review/
    artifacts:
      - file: CRITICAL-DECISION.md
        target: docs/reference/architecture-decisions.md
        requested_by: user
        reviewer: alice
        requested_at: 2025-11-17T10:20:00Z
        status: awaiting_review

  ready:
    path: .promote-pipeline/ready/
    artifacts:
      - file: RESEARCH.md
        target: docs/reference/api-design-patterns.md
        approved_at: 2025-11-17T10:30:00Z
        status: ready_for_promotion
```

### CLI Implementation

```bash
# promote-content.sh with pipeline support

pipeline_scan() {
  # Scan recent sessions
  # Move candidates to review queue
}

pipeline_triage() {
  # Interactive triage UI
  # Move accepted to refinement
}

pipeline_refine() {
  # Open batch editor
  # Save refined versions
}

pipeline_request_review() {
  # Create review request
  # Notify reviewer
}

pipeline_finalize() {
  # Confirm and promote
  # Update workspace
}
```

### Pros
- ✅ **Very high reliability**: Multiple review stages
- ✅ **Quality assurance**: Refinement + peer review
- ✅ **Excellent scalability**: Progressive filtering
- ✅ **Audit trail**: Complete promotion history
- ✅ **Team collaboration**: Peer review support

### Cons
- ❌ **High user effort**: Multiple stages require time
- ❌ **Complex workflow**: More steps to learn
- ❌ **Slower promotions**: Multi-stage delays
- ❌ **Overhead**: State management complexity

### Best For
- Critical content (architecture decisions, public docs)
- Team environments with peer review
- High-quality bar requirements

---

## Comparison Matrix

### Effort vs Quality

```
                Quality Assurance
                    ↑
                    |
     Approach D     |
     (Pipeline)     |
                    |
                    |     Approach C
  Approach A        |     (AI Suggestions)
  (Manual CLI)      |
                    |
                    |
                    |        Approach B
                    |        (Tags)
                    |
                    |
                    +-------------------------→
                           User Effort
```

### Decision Framework

**Use Approach A (Manual CLI)** when:
- You have < 10 sessions/day
- Content is highly specialized
- You need full control

**Use Approach B (Tag-Based)** when:
- You have > 20 sessions/day
- Content patterns are predictable
- You trust agent tagging

**Use Approach C (AI Suggestions)** when:
- You have > 50 sessions/day
- Content quality varies widely
- You want discovery features

**Use Approach D (Pipeline)** when:
- Content is mission-critical
- You have peer review requirements
- Quality bar is very high

---

## Hybrid Approaches

### Recommended: B + C Hybrid

```bash
# Combine tag-based and AI suggestions

# 1. Agents tag high-confidence promotions
<!-- PROMOTE: docs/reference/file.md -->
<!-- CONFIDENCE: high -->

# 2. AI analyzes untagged content for suggestions
promote analyze-untagged sessions/session-* --quality-min 7.0

# 3. User reviews both staged and suggested
promote review-all --group-by confidence

# 4. Batch approval
promote approve --high-confidence-auto
```

**Benefits**:
- Agent-tagged content gets fast-track promotion
- AI discovers valuable untagged content
- User maintains final approval control

---

## Implementation Roadmap

### Phase 1: Basic CLI (Approach A)
- Manual review and promotion
- Smart target detection
- Metadata preservation
- **Timeline**: 1-2 days

### Phase 2: Tag Support (Approach B)
- Tag parsing and staging
- Auto-promotion rules
- Review interface
- **Timeline**: 2-3 days

### Phase 3: AI Analysis (Approach C)
- Quality scoring engine
- Suggestion generation
- Analysis reports
- **Timeline**: 3-5 days

### Phase 4: Pipeline (Approach D)
- Multi-stage workflow
- State management
- Peer review system
- **Timeline**: 5-7 days

---

## Recommended Starting Point

**Start with Approach B (Tag-Based)** because:

1. **Immediate value**: Agents can start tagging today
2. **Low implementation cost**: Simple tag parsing
3. **Safety**: Review gate prevents mistakes
4. **Scalable**: Handles 1000 docs/hr
5. **Extensible**: Easy to add AI suggestions later

**Next Steps**:
1. Implement basic tag parsing in session-end hook
2. Create `.promote-rules.yml` with conservative defaults
3. Build `promote review-staged` CLI command
4. Test with 1-2 sessions
5. Iterate based on user feedback
6. Add AI suggestions in Phase 2

---

## Example Implementation

See `promote-content.sh` for skeleton implementation of Approach B (tag-based promotion).

---

**Memory Key**: `workspace-optimization-20251117/promotion-workflow`
