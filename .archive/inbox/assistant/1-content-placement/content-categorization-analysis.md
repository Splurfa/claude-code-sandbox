# Content Categorization Analysis: docs/guides/ Directory

**Date**: 2025-11-16
**Session**: session-20251116-084306-system-hygiene-check
**Purpose**: Identify content that belongs in inbox/assistant/ vs. docs/guides/

---

## Executive Summary

**Files Analyzed**: 5 markdown files in docs/guides/
**Verdict**: **1 of 5 files should be moved** to inbox/assistant/2025-11-16-research-findings/

**Key Finding**: The hive-mind-capability-mapping.md file is architectural problem-solving analysis, not a user-facing guide. It belongs in the research findings inbox where other architectural work is tracked.

---

## File-by-File Analysis

### ✅ KEEP: docs/guides/README.md

**Type**: Documentation Index / Navigation Guide
**Lines**: 335
**Category**: Reference - Navigation

**Why KEEP**:
- **Purpose**: Central index for all guides
- **Audience**: Users navigating documentation
- **Content**: Links to guides, quick starts, health checks
- **Stability**: Evolves as guides are added, but structure is permanent

**Evidence from content**:
- "📁 Documentation Structure" (lines 9-21)
- "🚀 Getting Started" section for new users (lines 25-45)
- "📚 Available Guides" with descriptions (lines 49-120)
- "🎯 Common Tasks" reference (lines 123-149)

**Proper location**: ✅ docs/guides/README.md (navigation index)

---

### ✅ KEEP: docs/guides/how-to/integration-testing-guide.md

**Type**: Task-Oriented User Guide
**Lines**: 454
**Category**: How-To - Step-by-step procedures

**Why KEEP**:
- **Purpose**: Teach users how to test integrations
- **Audience**: Anyone setting up workspace or verifying functionality
- **Content**: Actionable steps with expected outputs
- **Longevity**: Reference material, not ephemeral analysis

**Evidence from content**:
- "Step-by-step procedures" (line 9)
- Test commands with expected outputs (lines 36-56)
- "Test Script: Hook System" (lines 139-183)
- "Verification" checklists throughout

**Proper location**: ✅ docs/guides/how-to/integration-testing-guide.md

**User value**: Someone can follow this guide to test their setup RIGHT NOW. This is exactly what how-to guides should do.

---

### ✅ KEEP: docs/guides/reference/feature-verification-checklist.md

**Type**: Quick Reference Checklist
**Lines**: 441
**Category**: Reference - Verification checklist

**Why KEEP**:
- **Purpose**: Quick health check reference
- **Audience**: Users verifying system status
- **Content**: Checkboxes and verification steps
- **Usage pattern**: Repeated reference during development

**Evidence from content**:
- "Quick reference for verifying all claude-flow features" (line 5)
- Checkbox format throughout (e.g., lines 23-31)
- "Troubleshooting Quick Checks" section (lines 360-400)
- "Ready for Production" checklist (lines 414-419)

**Proper location**: ✅ docs/guides/reference/feature-verification-checklist.md

**User value**: Users can quickly verify system health without reading 800+ line guides. This is reference material.

---

### ✅ KEEP: docs/guides/troubleshooting/troubleshooting-guide.md

**Type**: Problem-Solving User Guide
**Lines**: 702
**Category**: Troubleshooting - Solutions to common issues

**Why KEEP**:
- **Purpose**: Help users fix problems they encounter
- **Audience**: Users experiencing errors or issues
- **Content**: Error messages, diagnoses, solutions
- **Pattern**: User encounters error → searches this guide → finds solution

**Evidence from content**:
- "Diagnose and fix common claude-flow integration issues" (line 5)
- "Issue:" headers with symptoms, causes, solutions (lines 22-56)
- "Common Error Messages" table (lines 673-682)
- "Emergency Fixes" section (lines 590-628)

**Proper location**: ✅ docs/guides/troubleshooting/troubleshooting-guide.md

**User value**: When things break, users need this guide. It's user-facing support documentation, not architectural analysis.

---

### ❌ MOVE: docs/guides/reference/hive-mind-capability-mapping.md

**Type**: Architectural Problem-Solving Analysis
**Lines**: 1354
**Category**: System Integration Work / Problem Analysis

**Why MOVE**:
- **Purpose**: Map research findings to hive-mind capabilities for architectural decisions
- **Audience**: Internal development team, not end users
- **Content**: Problem analysis, solution design, integration challenges
- **Nature**: Working document for "working on the system", not explaining features

**Evidence from content**:
- **Line 3**: "Mapping research findings to hive-mind-advanced skill capabilities"
- **Lines 29-36**: "Three problems identified in research findings" - This is PROBLEM ANALYSIS
- **Lines 80-93**: "Current Gaps" and "Core Issue" - ARCHITECTURAL PROBLEMS
- **Lines 824-1002**: "Capability Gaps & Custom Work Needed" - INTEGRATION WORK
- **Lines 939-983**: "Integration Challenges" - SYSTEM DESIGN

**Key phrases that signal "working on the system"**:
- "Status: PROBLEM MAPPED - Solution design pending" (line 76)
- "Custom work required" (lines 846, 858, 879, 906, 911, 917, 928)
- "Integration Challenges" (line 940)
- "Recommended Custom Development" (line 963)

**This is NOT a user guide because**:
- Users don't need to know about "capability gaps"
- Users don't care about "integration challenges"
- Users won't read 1354 lines of problem analysis
- This is INTERNAL architectural decision-making

**Comparison to inbox/assistant/ content**:
- Similar to: `inbox/assistant/2025-11-16-research-findings/coordination-improvements.md` (architectural analysis)
- Similar to: `inbox/assistant/2025-11-16-research-findings/adaptive-pivot-protocol-discussion.md` (problem exploration)

**Proper location**: ❌ Should be moved to:
```
inbox/assistant/2025-11-16-research-findings/hive-mind-integration/hive-mind-capability-mapping.md
```

**User-facing alternative (if needed)**:
If users need hive-mind guidance, create a NEW user guide:
```
docs/guides/how-to/using-hive-mind-coordination.md
```

With content like:
- "When to use hive-mind vs. single agents"
- "Choosing queen types (Strategic/Tactical/Adaptive)"
- "Quick start examples"
- No architectural analysis or capability gaps

---

## Categorization Summary

| File | Category | KEEP/MOVE | Reasoning |
|------|----------|-----------|-----------|
| README.md | Navigation Index | ✅ KEEP | Central documentation hub for users |
| integration-testing-guide.md | How-To Guide | ✅ KEEP | Step-by-step user instructions |
| feature-verification-checklist.md | Reference Checklist | ✅ KEEP | Quick health check reference |
| troubleshooting-guide.md | Problem-Solving Guide | ✅ KEEP | User-facing error solutions |
| hive-mind-capability-mapping.md | Architectural Analysis | ❌ MOVE | Internal problem-solving work |

**Move Rate**: 20% (1 of 5 files)

---

## Suggested Inbox Organization

**Recommended structure** for inbox/assistant/2025-11-16-research-findings/:

```
inbox/assistant/2025-11-16-research-findings/
├── README.md (existing - index of all research topics)
├── coordination-improvements.md (existing)
├── adaptive-pivot-protocol-discussion.md (existing)
├── core-findings-summary.md (existing)
└── hive-mind-integration/
    ├── hive-mind-capability-mapping.md (MOVE HERE)
    └── implementation-plan.md (future - implementation steps)
```

**Why this organization?**:
- Groups all hive-mind architectural work together
- Separates from user-facing documentation
- Keeps research findings organized by topic
- Makes it clear this is "working on the system" content

---

## Impact Assessment

### Changes Required

#### 1. Move File
```bash
# Create target directory
mkdir -p inbox/assistant/2025-11-16-research-findings/hive-mind-integration/

# Move file
mv docs/guides/reference/hive-mind-capability-mapping.md \
   inbox/assistant/2025-11-16-research-findings/hive-mind-integration/

# Verify move
ls -la inbox/assistant/2025-11-16-research-findings/hive-mind-integration/
```

#### 2. Update docs/guides/README.md

**Remove** (line 241):
```markdown
- [hive-mind-capability-mapping.md](reference/hive-mind-capability-mapping.md) - Hive-mind decision guide
```

**No replacement needed** - This was architectural analysis, not user documentation.

**Impact**: Minimal - README will have one less reference item. The other 4 guides remain.

#### 3. Update inbox/assistant/2025-11-16-research-findings/README.md

**Add new section**:
```markdown
### Hive-Mind Integration Analysis

**Location**: `hive-mind-integration/`

**Purpose**: Architectural analysis of how hive-mind-advanced skill maps to identified problems.

**Key Document**:
- [hive-mind-capability-mapping.md](hive-mind-integration/hive-mind-capability-mapping.md) -
  Comprehensive mapping of research findings to hive-mind capabilities, including:
  - Problem-capability matching (3 problems analyzed)
  - Queen type selection guidance (Strategic/Tactical/Adaptive)
  - Consensus mechanism recommendations
  - Integration challenges and custom work needed
  - Risk assessment and safeguards

**Use when**: Planning hive-mind coordination for architectural decisions or complex multi-agent tasks.
```

#### 4. Create User-Facing Guide (Optional, Future Work)

If users need hive-mind guidance, create:
```
docs/guides/how-to/using-hive-mind-coordination.md
```

**Content focus** (user-oriented):
- Quick start: "When should I use hive-mind?"
- Choosing queen types with simple decision tree
- Basic examples (3-5 common scenarios)
- Best practices checklist
- Link to hive-mind skill documentation

**Estimated effort**: 1-2 hours to create simplified user guide

**NOT included**: Capability gaps, integration challenges, architectural analysis (keep that in inbox)

---

## Rationale: Why This Matters

### The Core Principle

**docs/guides/** should answer:
- "How do I use this feature?"
- "What does this error mean?"
- "Where do I find X?"

**inbox/assistant/** should answer:
- "What architectural problems exist?"
- "How do we integrate system Y with system Z?"
- "What are the implementation trade-offs?"

### The Test Questions

**For each file, ask**:

1. **Would a NEW USER read this to learn the system?**
   - YES → docs/guides/
   - NO → inbox/assistant/

2. **Is this solving a problem IN the system or EXPLAINING the system?**
   - Solving problems IN → inbox/assistant/
   - Explaining TO users → docs/guides/

3. **Will this content change when the system architecture changes?**
   - YES (tightly coupled to implementation) → inbox/assistant/
   - NO (user-facing interface stays stable) → docs/guides/

**Applying to hive-mind-capability-mapping.md**:

1. Would new user read 1354 lines of capability mapping? **NO**
2. Is this solving integration problems? **YES** (capability gaps, custom work needed)
3. Will this change when architecture evolves? **YES** (deeply coupled to implementation)

**Verdict**: inbox/assistant/ (architectural work, not user guide)

---

## Verification Checklist

After moving hive-mind-capability-mapping.md:

- [ ] File moved to inbox/assistant/2025-11-16-research-findings/hive-mind-integration/
- [ ] docs/guides/README.md updated (reference line removed)
- [ ] inbox/assistant/2025-11-16-research-findings/README.md updated (new section added)
- [ ] All links to moved file updated (if any exist)
- [ ] Git commit documenting the move
- [ ] Consider: Create simplified user guide for hive-mind (future work)

---

## Recommendation

**Immediate action**: Move hive-mind-capability-mapping.md to inbox/assistant/

**Reasoning**:
- It's 100% architectural analysis, not user documentation
- It contains "capability gaps" and "integration challenges" (internal work)
- Users don't need 1354 lines of problem-solving analysis
- Belongs alongside other research findings in inbox/

**Future consideration**: Create NEW user-facing guide:
- Title: "How to Use Hive-Mind Coordination"
- Length: 200-300 lines (not 1354)
- Focus: Practical usage, not architectural analysis
- Location: docs/guides/how-to/

**Net impact**:
- docs/guides/ contains ONLY user-facing material (clarity improved)
- inbox/assistant/ consolidates all architectural work (organization improved)
- Clear separation of concerns maintained

---

## Conclusion

**The hygiene check revealed**: docs/guides/ is 80% healthy (4 of 5 files correctly placed).

**The fix**: Move 1 architectural analysis document to inbox/assistant/ where it belongs.

**The result**: Clear separation between user documentation and system integration work.

**This matters because**: As the project grows, keeping "explaining features" separate from "working on the system" prevents documentation sprawl and maintains clarity for users.

---

**Analysis Complete**
**Deliverable**: This document
**Next Step**: User reviews and approves move of hive-mind-capability-mapping.md to inbox/
