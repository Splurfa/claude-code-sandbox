# README Naming Conventions Audit

**Session**: session-20251121-235433-naming-conventions-audit
**Date**: 2025-11-21
**Scope**: Root-level README.md and top-level documentation naming consistency

---

## Executive Summary

**Current State**:
- **README.md Title**: "Common Thread Sandbox"
- **Package Name**: "claude-code-sandbox"
- **Directory Name**: `/Users/splurfa/claude-code-sandbox/`
- **Git Repository**: https://github.com/Splurfa/common-thread

**Issue**: The workspace has THREE different names across different contexts, creating confusion.

**Recommendation**: Standardize on **"Common Thread"** as the official workspace name.

---

## Naming Analysis

### Option 1: "Common Thread" (RECOMMENDED)
**Pros**:
- Matches GitHub repository name (common-thread)
- Professional and memorable
- Clear conceptual metaphor (threads of work/sessions)
- Distinct from "sandbox" testing connotation

**Cons**:
- Requires renaming directory and package.json

**Usage**: GitHub repo, suggested by Captain's Log 2025-11-22

### Option 2: "claude-code-sandbox"
**Pros**:
- Currently used in package.json
- Matches current directory name
- Descriptive (indicates it uses Claude Code)

**Cons**:
- Generic "sandbox" name lacks identity
- Doesn't match GitHub repo
- Too technical/implementation-focused

### Option 3: "Common Thread Sandbox"
**Pros**:
- Currently used in README.md title
- Combines identity with descriptor

**Cons**:
- Verbose
- "Sandbox" is redundant (workspace implies development/testing)
- Doesn't match package.json or directory

---

## Detailed Findings

### 1. Root-Level README.md

**File**: `/Users/splurfa/claude-code-sandbox/README.md`

| Line | Current Text | Proposed Text | Category |
|------|--------------|---------------|----------|
| 1 | `# Common Thread Sandbox` | `# Common Thread` | Title |

**Justification**: Remove "Sandbox" suffix for cleaner branding. The workspace description already clarifies its purpose.

**Impact**: High visibility (first line users see)

---

### 2. Package.json

**File**: `/Users/splurfa/claude-code-sandbox/package.json`

| Line | Current Text | Proposed Text | Category |
|------|--------------|---------------|----------|
| 2 | `"name": "claude-code-sandbox"` | `"name": "common-thread"` | Metadata |

**Justification**: Align package name with GitHub repository and workspace identity.

**Impact**: Medium (affects npm/node tooling, not critical for this workspace)

---

### 3. CLAUDE.md Configuration

**File**: `/Users/splurfa/claude-code-sandbox/CLAUDE.md`

**Finding**: No workspace name in title or first 50 lines. Uses descriptive subtitle:
```markdown
# Claude Code Configuration - SPARC Development Environment
```

**Recommendation**: Add workspace name to subtitle:
```markdown
# Claude Code Configuration - Common Thread Workspace
```

**Justification**:
- Maintains technical configuration focus
- Adds workspace identity for clarity
- Distinguishes from generic claude-flow workspaces

| Line | Current Text | Proposed Text | Category |
|------|--------------|---------------|----------|
| 1 | `# Claude Code Configuration - SPARC Development Environment` | `# Claude Code Configuration - Common Thread Workspace` | Header |

---

### 4. Tour Guide Skill

**File**: `.claude/skills/tour-guide/README.md`

| Line | Current Text | Proposed Text | Category |
|------|--------------|---------------|----------|
| 403 | `**Workspace**: claude-code-sandbox` | `**Workspace**: Common Thread` | Metadata |
| 429 | `This is a custom skill for the claude-code-sandbox workspace` | `This is a custom skill for the Common Thread workspace` | Description |

---

### 5. Workspace Tour Documentation

**File**: `docs/operate/workspace-tour.md`

| Line | Current Text | Proposed Text | Category |
|------|--------------|---------------|----------|
| 16 | `claude-code-sandbox/` | `common-thread/` | Directory Reference |
| 197 | `claude-code-sandbox/` | `common-thread/` | File Tree |
| 219 | `"name": "claude-code-sandbox"` | `"name": "common-thread"` | Example |

---

### 6. Quick Start Guide

**File**: `docs/setup/quick-start.md`

| Line | Current Text | Proposed Text | Category |
|------|--------------|---------------|----------|
| 49 | `- Working directory: /Users/[username]/claude-code-sandbox/` | `- Working directory: /Users/[username]/common-thread/` | Example Path |

---

### 7. Beginner Tour Script

**File**: `.claude/skills/tour-guide/docs/tour-scripts/beginner-tour.md`

| Line | Current Text | Proposed Text | Category |
|------|--------------|---------------|----------|
| 19 | `you've just opened a special development environment called "claude-code-sandbox."` | `you've just opened a special development environment called "Common Thread."` | Introduction |
| 324 | `claude-code-sandbox/` | `common-thread/` | Directory Reference |

---

### 8. Expert Tour Script

**File**: `.claude/skills/tour-guide/docs/tour-scripts/expert-tour.md`

| Line | Current Text | Proposed Text | Category |
|------|--------------|---------------|----------|
| 1144 | `git clone https://github.com/yourusername/claude-code-sandbox.git` | `git clone https://github.com/Splurfa/common-thread.git` | Git Command |
| 1145 | `cd claude-code-sandbox` | `cd common-thread` | Shell Command |
| 2992 | `https://github.com/yourusername/claude-code-sandbox/discussions` | `https://github.com/Splurfa/common-thread/discussions` | URL |

**Note**: Also update placeholder username "yourusername" to actual "Splurfa"

---

### 9. Archived Documentation (Low Priority)

**Files with "Common Thread Sandbox"**:
- `sessions/.archive/session-20251118-011159-docs-rebuild/artifacts/docs/README.md` (Line 1)
- `sessions/.archive/session-20251117-233107-workspace-docs-optimization/artifacts/docs/NODE-ECOSYSTEM-EXPLAINED.md` (Line 1)

**Recommendation**: Update for historical accuracy, but low priority since archived.

---

## Related Metadata Updates

### Tour-Guide Skill Examples

**File**: `.claude/skills/tour-guide/examples/sample-tour-sessions.md`

| Line | Current Text | Proposed Text | Category |
|------|--------------|---------------|----------|
| 17 | `Welcome to Common-Thread Workspace` | `Welcome to Common Thread Workspace` | Banner |

**Note**: Remove hyphen for consistency

---

### Tour-Guide Main README

**File**: `.claude/skills/tour-guide/README.md`

| Line | Current Text | Proposed Text | Category |
|------|--------------|---------------|----------|
| 7 | `common-thread workspace` | `Common Thread workspace` | Description |

**Note**: Capitalize for consistency with proper noun

---

## Path References (Do NOT Change)

The following are **absolute file paths** that reference the current directory location. These should **NOT** be changed unless the directory is actually renamed:

- All occurrences of `/Users/splurfa/claude-code-sandbox/` in findings, validation reports, and test reports
- All occurrences of `/Users/splurfa/common-thread-sandbox/` in archived sessions (historical record)

**Rationale**: These are factual references to file locations, not branding. Changing them would break documentation accuracy.

---

## Captain's Log References

**File**: `sessions/captains-log/2025-11-22.md`

Contains historical record of the rename operation:
```markdown
Summary: Connected workspace to GitHub repository and performed comprehensive
workspace rename from "common-thread-sandbox" to "claude-code-sandbox"
```

**Recommendation**: Add clarification note that workspace name is "Common Thread" (repository "common-thread", directory "claude-code-sandbox" for technical reasons).

**Proposed Addition** (Line 85+):
```markdown
## Workspace Naming Clarification

**Official Name**: Common Thread
**Repository**: https://github.com/Splurfa/common-thread
**Directory**: claude-code-sandbox (technical artifact, retained for npm compatibility)
**Branding**: Use "Common Thread" in user-facing documentation
```

---

## Implementation Priority

### High Priority (User-Facing)
1. ✅ README.md title (Line 1)
2. ✅ CLAUDE.md header (Line 1)
3. ✅ Tour-guide skill metadata (README.md lines 403, 429)
4. ✅ Beginner tour introduction (Line 19)

### Medium Priority (Documentation)
5. ✅ workspace-tour.md references (Lines 16, 197, 219)
6. ✅ quick-start.md example paths (Line 49)
7. ✅ Expert tour git commands (Lines 1144-1145, 2992)

### Low Priority (Internal/Archived)
8. ⏸️ Package.json name (only if npm publishing planned)
9. ⏸️ Archived session documentation
10. ⏸️ Directory rename (requires user action, breaks absolute paths)

---

## Recommended Workspace Name

**Official Name**: **Common Thread**

**Reasoning**:
1. Matches GitHub repository (common-thread)
2. Professional and memorable identity
3. Clear conceptual metaphor (sessions as threads of work)
4. Distinct from generic "sandbox" terminology
5. Scalable branding (doesn't tie to specific tooling)

**Tagline** (from README.md principles):
> "A workspace built on Three Principles for AI-human collaboration"

---

## Implementation Checklist

- [ ] Update README.md title (Line 1)
- [ ] Update CLAUDE.md header (Line 1)
- [ ] Update tour-guide skill metadata (2 occurrences)
- [ ] Update beginner tour introduction
- [ ] Update workspace-tour.md references (3 occurrences)
- [ ] Update quick-start.md example path
- [ ] Update expert tour git commands (3 occurrences)
- [ ] Add naming clarification to Captain's Log 2025-11-22
- [ ] (Optional) Update package.json name
- [ ] (Optional) Update archived documentation
- [ ] (User action required) Rename directory: `mv ~/claude-code-sandbox ~/common-thread`

---

## Notes

**Why Keep Directory as "claude-code-sandbox"?**
- Breaking change for absolute paths throughout documentation
- Current directory name doesn't affect user experience
- Can be updated later if user chooses to rename

**Why Change "Common Thread Sandbox" to "Common Thread"?**
- "Sandbox" is redundant (workspace implies development environment)
- Cleaner, more professional branding
- Matches GitHub repository naming convention
- More memorable and distinctive

**Consistency Across Files**:
- User-facing: "Common Thread" (capitalized, no "Sandbox")
- Repository: "common-thread" (lowercase with hyphen)
- Directory: "claude-code-sandbox" OR "common-thread" (user choice)
- Package: "common-thread" (aligns with repository)

---

## Summary Statistics

**Total Files Requiring Updates**: 9 core files + 2 archived files
**Total Line Changes**: 17 high/medium priority + 2 low priority
**Breaking Changes**: 0 (all cosmetic/branding)
**User Action Required**: 1 (directory rename, optional)

**Estimated Impact**:
- Documentation clarity: **High**
- Brand consistency: **High**
- Technical functionality: **None**
- Git history: **Minimal** (cosmetic changes only)
