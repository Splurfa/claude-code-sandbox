# Documentation & Code Naming Conventions Audit

**Session**: session-20251121-235433-naming-conventions-audit
**Date**: 2025-11-21
**Scope**: Workspace name references, example paths, outdated naming conventions

---

## Executive Summary

### Key Findings

1. **Workspace Name References**: 6 instances of hardcoded workspace name "claude-code-sandbox"
2. **SPARC Methodology**: Extensively documented (70+ references) but unclear if actively used
3. **Migration References**: Multiple references to deprecated patterns and migration guides
4. **Path Examples**: Several hardcoded path examples that should use placeholders
5. **Package.json**: Contains hardcoded workspace name

### Severity Assessment

| Category | Count | Severity | Priority |
|----------|-------|----------|----------|
| Hardcoded workspace name | 6 | Medium | Medium |
| SPARC references | 70+ | Low | Low |
| Example paths | 8+ | Low | Medium |
| Migration refs | 15+ | Low | Low |
| Package name | 1 | High | High |

---

## Detailed Findings

### 1. Hardcoded Workspace Name "claude-code-sandbox"

#### 1.1 Documentation Files

**Location**: `docs/operate/workspace-tour.md`
- Line 16: `claude-code-sandbox/           ← You are here`
- Line 197: Directory structure example
- Line 219: Package.json example: `"name": "claude-code-sandbox"`

**Impact**: Medium
**Recommendation**: Replace with generic placeholder like `$WORKSPACE_NAME/` or `your-workspace/`

**Location**: `docs/reference/architecture.md`
- Line 383: `/Users/splurfa/claude-code-sandbox/`

**Impact**: Medium
**Recommendation**: Replace with `/Users/$USER/$WORKSPACE_NAME/` or use relative paths

**Location**: `docs/setup/quick-start.md`
- Line 49: `Working directory: /Users/[username]/claude-code-sandbox/`

**Impact**: Low (already uses placeholder for username)
**Recommendation**: Also replace workspace name with placeholder

**Location**: `docs/operate/session-management-tutorial.md`
- Line 174: `claude-code-sandbox/`

**Impact**: Low
**Recommendation**: Replace with generic workspace name

#### 1.2 Package Configuration

**Location**: `package.json`
- Line 2: `"name": "claude-code-sandbox"`

**Impact**: HIGH
**Recommendation**: This is the actual package name and should be addressed:
- Option A: Keep as-is if this is intended to be a template/starter
- Option B: Document that users should rename this
- Option C: Make it configurable via init script

#### 1.3 Skill Documentation

**Location**: `.claude/skills/tour-guide/docs/tour-scripts/expert-tour.md`
- Line 1144: `git clone https://github.com/yourusername/claude-code-sandbox.git`
- Line 2992: Discussion link with same URL

**Impact**: Low
**Recommendation**: Replace with generic placeholder `$REPO_URL` or `your-repository`

---

### 2. SPARC Methodology References

**Total References**: 70+ across 15 files

#### Files with SPARC References:
1. `docs/reference/agent-catalog.md` (8 refs)
2. `docs/reference/what-actually-works.md` (18 refs)
3. `docs/reference/architecture.md` (3 refs)
4. `docs/coordinate/swarm-coordination.md` (1 ref)
5. `docs/operate/prompting-flexibility.md` (4 refs)
6. `docs/build/spawning-agents.md` (11 refs)
7. `docs/build/skill-integration.md` (17 refs)
8. `docs/build/custom-agents.md` (3 refs)
9. `docs/setup/quick-start.md` (43 refs - most comprehensive)

#### Analysis:

**What Actually Works?**
According to `docs/reference/what-actually-works.md`:
- ❌ No SPARC artifacts found in workspace
- ❌ No SPARC agent definitions present
- 🔮 SPARC methodology (commands listed, never used)

**Documentation Status:**
- ✅ Extensively documented in CLAUDE.md (lines 115-145)
- ✅ 17 SPARC modes listed
- ✅ Complete command reference
- ❓ Unclear if actually functional or aspirational

**Recommendations:**

1. **Verify SPARC Status**: Determine if SPARC is:
   - Fully functional (keep docs as-is)
   - Partially functional (add status warnings)
   - Aspirational/planned (move to "Future Features" section)
   - Deprecated (add deprecation notice)

2. **Update Documentation**: Based on verification:
   - Add "Status: Experimental" badges if not fully tested
   - Add "Status: Deprecated" if no longer maintained
   - Add evidence/examples if fully functional

3. **CLAUDE.md Update**: Add clarity to SPARC section about:
   - Current implementation status
   - When to use vs regular agent spawning
   - Known limitations

---

### 3. Migration and Legacy References

**Total References**: 15+ instances

#### Locations:

**Deprecated Patterns:**
1. `docs/reference/limitations.md:168` - Migration from old hooks system complete
2. `docs/reference/limitations.md:480` - Some guides reference deprecated `auto-hooks.js`
3. `docs/reference/what-actually-works.md:123` - `.claude/hooks/auto-hooks.js` deprecated
4. `docs/operate/troubleshooting.md:329-370` - Extensive auto-hooks.js migration guide

**Database Migrations:**
5. `docs/coordinate/custom-workflows.md:106` - Database migration planning
6. `docs/coordinate/byzantine-consensus.md:307` - Schema migration approval
7. `docs/build/extending-system.md:761-807` - Migration command examples

**Legacy References:**
8. `docs/setup/quick-start.md:368` - "Refactor src/legacy-module.js"
9. `docs/coordinate/queen-selection.md:179-315` - Multiple legacy integration examples
10. `docs/README.md:55` - Reference to "legacy learning path"

#### Analysis:

**Migration Completion Status:**
- ✅ Hooks migration to native system complete (98% stock adherence)
- ⚠️ Documentation still references old auto-hooks.js pattern
- ✅ Migration guide exists (`.claude/hooks/README.md`)

**Recommendations:**

1. **Clean Up Migration Docs**:
   - Add deprecation date to old pattern references
   - Clearly mark "LEGACY" sections
   - Consider moving to archived docs folder

2. **Update Troubleshooting**:
   - Keep migration troubleshooting but mark as "Historical"
   - Focus current docs on native hook system

3. **Legacy Examples**:
   - Clarify which examples are real vs illustrative
   - Use generic names instead of "legacy-module.js"

---

### 4. Example Path Issues

#### Hardcoded Paths Found:

1. **User-specific paths:**
   - `/Users/splurfa/claude-code-sandbox/` (architecture.md:383)

2. **Generic but workspace-specific:**
   - `/Users/[username]/claude-code-sandbox/` (quick-start.md:49)
   - `claude-code-sandbox/` (multiple files)

3. **Session examples:**
   - Multiple examples correctly use `sessions/$SESSION_ID/artifacts/`
   - ✅ These are good - use variable placeholder

#### Recommendations:

**Use Consistent Placeholders:**

```bash
# ❌ Avoid
/Users/splurfa/claude-code-sandbox/
claude-code-sandbox/

# ✅ Prefer
$WORKSPACE_ROOT/
/Users/$USER/$WORKSPACE_NAME/
./  # For relative paths from workspace root
```

**Update Examples:**
- `docs/reference/architecture.md:383` - Use `$WORKSPACE_ROOT/` or `./`
- `docs/operate/workspace-tour.md:16` - Use `$WORKSPACE_NAME/` or `./`
- `docs/setup/quick-start.md:49` - Already good with `[username]`, also genericize workspace

---

### 5. CLAUDE.md Title and Description

**Current Title** (line 1):
```markdown
# Claude Code Configuration - SPARC Development Environment
```

**Analysis:**
- ✅ Generic enough (doesn't hardcode workspace name)
- ⚠️ "SPARC Development Environment" may be misleading if SPARC is not primary focus
- ❓ "claude-flow+ (custom extended) workspace" (line 3) is more accurate

**Recommendation:**

Consider more descriptive titles:

**Option A: Focus on Extension**
```markdown
# Claude Code Configuration - Extended Workspace with claude-flow
```

**Option B: Focus on Capabilities**
```markdown
# Claude Code Configuration - Multi-Agent Development Workspace
```

**Option C: Keep Current**
```markdown
# Claude Code Configuration - SPARC Development Environment
```
(If SPARC is verified as core feature)

---

## Priority Action Items

### High Priority (Do Now)

1. **package.json name**: Decide on strategy
   - Document that users should rename
   - Or provide init script to configure
   - Or keep as template name

2. **Architecture.md hardcoded path** (line 383):
   - Replace `/Users/splurfa/claude-code-sandbox/` with `$WORKSPACE_ROOT/`

### Medium Priority (Do Soon)

3. **Workspace name in docs** (6 instances):
   - Replace with `$WORKSPACE_NAME/` or `your-workspace/`
   - Files: workspace-tour.md, quick-start.md, session-management-tutorial.md

4. **SPARC status clarification**:
   - Verify if SPARC is functional
   - Add status badges/warnings if experimental
   - Update what-actually-works.md with findings

5. **Example path cleanup**:
   - Standardize on placeholder conventions
   - Update 8+ path examples across docs

### Low Priority (Do Eventually)

6. **Migration documentation**:
   - Mark deprecated sections as "LEGACY"
   - Move auto-hooks.js content to archive
   - Keep migration troubleshooting but mark historical

7. **Tour guide examples**:
   - Replace GitHub URLs with placeholders
   - Generic repository examples

8. **CLAUDE.md title**:
   - Review if "SPARC Development Environment" is accurate
   - Consider more descriptive title if needed

---

## Consistency Recommendations

### Path Placeholder Standards

Establish consistent conventions:

```markdown
# For workspace root
$WORKSPACE_ROOT/     # Absolute path
./                   # Relative from root

# For workspace name
$WORKSPACE_NAME/     # Variable
your-workspace/      # Generic example

# For user paths
$HOME/               # User home directory
/Users/$USER/        # Mac-specific with variable

# For session paths (already good)
sessions/$SESSION_ID/artifacts/
```

### Naming Convention Guide

Create a style guide section in documentation:

```markdown
## Documentation Style Guide

### Path References
- Use `$WORKSPACE_ROOT/` for absolute paths
- Use `./` for relative paths from workspace root
- Use `$SESSION_ID` for session references
- Use `$USER` for username in examples

### Code Examples
- Use generic names (avoid "example", "test", "legacy")
- Use descriptive business domain names
- Mark deprecated patterns clearly

### Status Indicators
- ✅ Verified/Working
- ⚠️ Experimental/Incomplete
- ❌ Deprecated/Broken
- 🔮 Planned/Future
```

---

## Files Requiring Updates

### High Priority Files

1. `package.json` - Package name decision
2. `docs/reference/architecture.md` - Line 383 hardcoded path
3. `CLAUDE.md` - SPARC status clarification

### Medium Priority Files

4. `docs/operate/workspace-tour.md` - Lines 16, 197, 219
5. `docs/setup/quick-start.md` - Line 49
6. `docs/operate/session-management-tutorial.md` - Line 174
7. `.claude/skills/tour-guide/docs/tour-scripts/expert-tour.md` - Lines 1144, 2992

### Low Priority Files

8. `docs/reference/what-actually-works.md` - SPARC status update
9. `docs/operate/troubleshooting.md` - Mark migration sections as legacy
10. `docs/README.md` - Update curriculum references

---

## Search Patterns Used

```bash
# Workspace name references
grep -ri "claude-code-sandbox" docs/

# Path examples
grep -rn "~/claude-code-sandbox\|/claude-code-sandbox/\|Users/.*/claude-code-sandbox" docs/

# SPARC methodology
grep -ri "SPARC\|sparc" docs/

# Migration and legacy
grep -ri "old.*name\|previous.*name\|renamed\|migration\|legacy" docs/

# Example paths
grep -ri "example.*path\|sample.*path\|path.*example" docs/
```

---

## Conclusion

### Overall Assessment

The documentation is **well-maintained** with clear structure and comprehensive coverage. The main issues are:

1. **Cosmetic**: Hardcoded workspace names (easy fix)
2. **Clarity**: SPARC methodology status unclear (needs investigation)
3. **Legacy**: Some outdated migration references (can be archived)

### Estimated Effort

- **High Priority**: 2-3 hours (path updates, package decision, SPARC verification)
- **Medium Priority**: 3-4 hours (doc updates, standardization)
- **Low Priority**: 2-3 hours (cleanup, archiving)

**Total**: 7-10 hours for complete cleanup

### Next Steps

1. **Investigate SPARC**: Verify if functional, experimental, or deprecated
2. **Define Standards**: Create path placeholder conventions document
3. **Batch Updates**: Update all workspace name references in one pass
4. **Archive Legacy**: Move deprecated content to historical section
5. **Validate**: Run documentation link checker after updates

---

## Appendix: Complete File List

### Documentation Files Scanned (35 total)

```
docs/
├── README.md
├── build/
│   ├── create-skills.md
│   ├── custom-agents.md
│   ├── extending-system.md
│   ├── skill-integration.md
│   ├── spawning-agents-tutorial.md
│   └── spawning-agents.md
├── coordinate/
│   ├── adaptive-topology.md
│   ├── byzantine-consensus.md
│   ├── custom-workflows.md
│   ├── hive-mind.md
│   ├── performance-tuning.md
│   ├── queen-selection.md
│   ├── swarm-coordination.md
│   ├── swarm-topologies.md
│   └── consensus-mechanisms.md
├── operate/
│   ├── basic-memory-usage.md
│   ├── first-session.md
│   ├── memory-basics.md
│   ├── memory-coordination-tutorial.md
│   ├── parallel-execution.md
│   ├── prompting-flexibility.md
│   ├── session-management-tutorial.md
│   ├── session-management.md
│   ├── troubleshooting.md
│   └── workspace-tour.md
├── reference/
│   ├── agent-catalog.md
│   ├── architecture.md
│   ├── curriculum-index.md
│   ├── limitations.md
│   ├── reasoning-bank.md
│   └── what-actually-works.md
└── setup/
    ├── cross-model-compatibility.md
    ├── orientation.md
    ├── quick-start.md
    └── what-is-claude-flow.md
```

### Additional Files

- `CLAUDE.md` - Main configuration file
- `package.json` - Node.js package configuration
- `.claude/skills/tour-guide/docs/tour-scripts/expert-tour.md` - Tutorial script

---

**End of Audit Report**
