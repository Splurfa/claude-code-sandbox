# Documentation Truth-Testing Framework

**Author**: Tester Agent (Hive Mind swarm-1763455650397-danz0qyd4)
**Date**: 2025-11-18
**Purpose**: Systematic validation of documentation accuracy against actual workspace reality
**Status**: Production-Ready Framework v1.0

---

## Executive Summary

This framework provides a **systematic truth-testing approach** for documentation, ensuring all claims are verifiable, evidence-based, and accurately reflect the actual state of the workspace. It was developed through analysis of 48+ documentation files and real verification patterns from session-20251116-151059.

**Key Finding**: Documentation drift occurs when **intent is documented as completion** without filesystem verification - a pattern called "temporal conflation."

**Reality Score Method**:
- **100 points = Perfect** (all claims verified with evidence)
- **65+ = Acceptable** (infrastructure solid, manual patterns documented)
- **<50 = Problematic** (aspirational claims exceed reality)

---

## Part 1: Truth-Testing Checklist

### Level 1: File Existence Claims (Critical)

**When documentation says**: "File X exists at location Y"

**Verification Steps**:
```bash
# 1. Direct existence check
test -f /path/to/file && echo "✅ EXISTS" || echo "❌ MISSING"

# 2. Check git history
git log --all --full-history --follow -- /path/to/file

# 3. Check if moved/renamed
git log --all --diff-filter=R --find-renames --oneline -- /path/to/file

# 4. Check similar names (typos)
find /search/path -name "*similar*"
```

**Evidence Required**:
- ✅ File exists at claimed path
- ✅ File has expected content (sample check)
- ✅ File was not moved recently (check git log)
- ✅ No similar files suggest naming confusion

**Classification**:
- **Real**: File exists, contains expected content
- **Moved**: File exists elsewhere, path outdated
- **Missing**: File never created or deleted
- **Planned**: Documentation ahead of implementation

---

### Level 2: Directory Structure Claims

**When documentation says**: "Directory structure is X"

**Verification Steps**:
```bash
# 1. List directory tree
tree -L 3 /path/to/directory

# 2. Verify subdirectories
ls -la /path/to/directory

# 3. Check file counts match claims
find /path/to/directory -type f | wc -l

# 4. Compare with documented structure
diff <(documented_structure.txt) <(tree -d /actual/path)
```

**Evidence Required**:
- ✅ All documented directories exist
- ✅ No undocumented directories (orphaned work)
- ✅ File organization matches claims
- ✅ Naming conventions consistent

**Classification**:
- **Real**: Structure matches exactly
- **Partial**: Some directories exist, some missing
- **Outdated**: Old structure documented, new exists
- **Aspirational**: Documented before implementation

---

### Level 3: Feature Capability Claims

**When documentation says**: "Feature X provides capability Y"

**Verification Steps**:
```bash
# 1. Test command execution
npx command --help | grep "capability"

# 2. Verify output contains claimed feature
npx command --capability 2>&1 | tee test-output.log

# 3. Check for error messages
grep -i "error\|warning\|not found" test-output.log

# 4. Cross-reference with official docs
curl -s https://official-docs/features | grep "capability"
```

**Evidence Required**:
- ✅ Command accepts claimed flags/options
- ✅ Feature produces expected output
- ✅ No error messages indicating missing feature
- ✅ Official documentation confirms availability

**Classification**:
- **Real**: Feature works as documented
- **Manual**: Feature exists, requires manual orchestration
- **Partial**: Feature works differently than claimed
- **Missing**: Feature documented but not implemented
- **Experimental**: Feature exists in alpha/beta only

---

### Level 4: Integration Claims

**When documentation says**: "System A integrates with System B"

**Verification Steps**:
```bash
# 1. Check shared files/databases
ls -la .swarm/memory.db
sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM memory_entries;"

# 2. Verify no path conflicts
find . -name "*conflict*" -o -name "*.orig"

# 3. Test integration workflow
# Run System A → Check System B received data

# 4. Verify namespace separation
sqlite3 .swarm/memory.db "SELECT DISTINCT namespace FROM memory_entries;"
```

**Evidence Required**:
- ✅ Systems use shared infrastructure correctly
- ✅ No directory/file conflicts
- ✅ Data flows between systems
- ✅ Namespaces prevent collisions

**Classification**:
- **Real**: Integration works bidirectionally
- **Complementary**: Systems coexist without conflict
- **Planned**: Integration documented, not built
- **Conflicting**: Systems compete for resources

---

### Level 5: Completion Status Claims

**When documentation says**: "✅ Task completed"

**Verification Steps**:
```bash
# 1. Check deliverable exists
test -f /path/to/deliverable

# 2. Verify git commits reflect completion
git log --all --grep="task-name" --since="completion-date"

# 3. Check for "TODO" or "FIXME" in code
grep -r "TODO\|FIXME\|HACK" /path/to/code

# 4. Verify tests pass
npm test 2>&1 | grep -E "pass|fail"
```

**Evidence Required**:
- ✅ Deliverable file exists
- ✅ Git commits show actual work performed
- ✅ No incomplete markers (TODO/FIXME) in scope
- ✅ Tests pass (if applicable)
- ✅ Documented completion time AFTER actual work

**Classification**:
- **Real**: Work completed, verified with evidence
- **Temporal Conflation**: Completion marked BEFORE work done
- **Partial**: Some work done, not all deliverables present
- **Abandoned**: Marked complete, later reverted/removed

---

## Part 2: Documentation Classification System

### Real (Verified with Evidence)

**Definition**: Claims match actual workspace state with filesystem/git evidence

**Criteria**:
- ✅ Files exist at claimed locations
- ✅ Features work as documented
- ✅ Completion timestamps AFTER actual work
- ✅ Multiple verification methods confirm accuracy

**Example**:
```markdown
**Claim**: "Memory database exists at .swarm/memory.db with 42,346 entries"

**Evidence**:
$ ls -lh .swarm/memory.db
-rw-r--r--  120MB  .swarm/memory.db

$ sqlite3 .swarm/memory.db "SELECT COUNT(*) FROM memory_entries;"
42346

**Classification**: ✅ REAL (verified 2025-11-18)
```

**Quality Markers**:
- Version numbers (confirmed against actual)
- File paths (verified with ls/find)
- Timestamps (cross-referenced with git)
- Command outputs (reproducible)

---

### Aspirational (Planned, Not Implemented)

**Definition**: Documentation describes desired future state, not current reality

**Criteria**:
- ❌ Files don't exist yet
- ❌ Features documented but not released
- ⚠️ "Will", "planned", "future" language
- ⚠️ No verification evidence provided

**Example**:
```markdown
**Claim**: "Auto-scaling automatically spawns agents based on workload"

**Testing**:
$ npx claude-flow hive-mind spawn "task" --auto-scale
✅ Command accepted (no errors)
❌ No automatic agent spawning observed
❌ Worker count stayed constant

**Classification**: ⚠️ ASPIRATIONAL (flag exists, no auto-behavior)
```

**Documentation Pattern**:
```markdown
## Feature X (Planned)

**Status**: Under development
**Target**: v2.1.0
**Current Reality**: Manual execution required
**Workaround**: [Manual steps]
```

---

### Mixed (Partially Implemented)

**Definition**: Core infrastructure exists, but documented automation requires manual orchestration

**Criteria**:
- ✅ Framework/infrastructure present
- ⚠️ Automated behavior documented but manual
- ✅ Labels/metadata stored correctly
- ❌ No automatic triggering observed

**Example**:
```markdown
**Claim**: "Queen types (strategic/tactical/adaptive) provide automatic behavior"

**Testing**:
- ✅ Queen type stored in metadata.json
- ✅ Label changes accepted
- ❌ No automatic behavior change detected
- ⚠️ User manually applies mindset

**Classification**: ⚠️ MIXED (framework provided, execution manual)
```

**Documentation Pattern**:
```markdown
## Queen Types (Framework)

**Infrastructure**: ✅ Metadata storage, type definitions
**Automation**: ⚠️ Manual orchestration required
**Usage**: Choose type, apply mindset manually
**Reality Score**: 70/100 (framework solid, automation pending)
```

---

### Outdated (Was Real, No Longer Accurate)

**Definition**: Claims were true historically but workspace has changed

**Criteria**:
- ✅ Git history confirms past accuracy
- ❌ Current filesystem contradicts claim
- ⚠️ Migration/refactor made docs stale
- ⚠️ Date markers show documentation age

**Example**:
```markdown
**Claim**: "Files stored in inbox/assistant/"

**Evidence**:
$ git log --all -- inbox/assistant/
commit abc123 (2025-11-15) - Created inbox structure

$ ls inbox/assistant/
ls: inbox/assistant: No such file or directory

$ git log --all --grep="inbox" --since="2025-11-16"
commit def456 (2025-11-16) - Archived inbox to sessions/

**Classification**: ⚠️ OUTDATED (was accurate 2025-11-15, archived 2025-11-16)
```

**Documentation Pattern**:
```markdown
## File Location (Updated 2025-11-18)

**Previous**: inbox/assistant/ (deprecated 2025-11-16)
**Current**: sessions/session-*/artifacts/
**Reason**: Consolidated session organization
**Migration Guide**: [Link]
```

---

### Unknown (Insufficient Evidence)

**Definition**: Cannot verify accuracy without additional information or testing

**Criteria**:
- ⚠️ Claims reference external systems
- ⚠️ Features require specific setup not documented
- ⚠️ Testing would be destructive/time-consuming
- ⚠️ Contradictory sources exist

**Example**:
```markdown
**Claim**: "10-20x speedup from parallel execution"

**Testing Challenges**:
- ⚠️ Requires controlled benchmark environment
- ⚠️ Results vary by task complexity
- ⚠️ No baseline timing documented
- ⚠️ Observed: sequential with gaps, not true parallel

**Classification**: ⚠️ UNKNOWN (needs controlled benchmarking)
```

**Documentation Pattern**:
```markdown
## Performance Claims (Under Verification)

**Claimed**: 10-20x speedup
**Observed**: Sequential execution with 30-40s gaps
**Status**: UNKNOWN - needs benchmarking
**Next Steps**: Controlled timing tests
```

---

## Part 3: Validation Tools

### Tool 1: Filesystem Verification Script

**Purpose**: Check if documented files/directories exist

**Implementation**: See `scripts/verify-docs.sh` in framework documentation

**Usage**:
```bash
# Verify a single document
bash scripts/verify-docs.sh docs/understand/workspace-architecture.md

# Verify all documents
find docs -name "*.md" -exec bash scripts/verify-docs.sh {} \;
```

---

### Tool 2: Feature Capability Tester

**Purpose**: Test if documented commands/features actually work

**Usage**:
```bash
bash scripts/test-features.sh docs/organize/first-session.md
```

---

### Tool 3: Evidence Collection Script

**Purpose**: Gather evidence for claims (screenshots, outputs, timestamps)

**Usage**:
```bash
bash scripts/collect-evidence.sh "Memory database contains 42K entries"
```

---

### Tool 4: Temporal Verification Script

**Purpose**: Detect temporal conflation (completion claimed before work done)

**Usage**:
```bash
bash scripts/check-temporal-conflation.sh docs/plan/hive-mind-reality-guide.md
```

---

## Part 4: Ongoing Maintenance Process

### Monthly Documentation Audit

**Frequency**: First Monday of each month

**Process**:
1. Run filesystem verification on all docs
2. Extract verification failures
3. Investigate each failure (moved/deleted/aspirational)
4. Update documentation or create issues
5. Commit corrections

---

### User Feedback Collection

**Method**: Inline feedback markers

**Pattern**:
```markdown
<!-- ACCURACY CHECK -->
**Claimed**: Feature X works automatically
**Your Experience**: [Does it match? Yes/No/Partially]
**If No**: [What actually happened?]
<!-- /ACCURACY CHECK -->
```

---

### Version-Aware Documentation

**Pattern**: Tag claims with version numbers

**Example**:
```markdown
## Memory Database (v2.0.0)

**Location**: `.swarm/memory.db` *(verified 2025-11-18)*
**Schema**: SQLite key-value store *(stock v2.0.0)*
**Size**: 120MB with 42,346 entries *(as of 2025-11-18)*
**Status**: ✅ REAL
```

---

### Evidence Tagging System

**Implementation**: Add evidence links to claims

**Pattern**:
```markdown
**Claim**: Session structure uses `sessions/session-YYYYMMDD-HHMMSS-topic/`

**Evidence**:
- **Filesystem**: `ls sessions/` ([screenshot](evidence/2025-11-18/ls-sessions.png))
- **Git**: `git log --grep="session structure"` ([commit abc123](link))
- **Usage**: Session metadata found in 15 sessions ([query](link))
- **Verified**: 2025-11-18

**Classification**: ✅ REAL
```

---

## Part 5: Prevention Protocols

### Protocol 1: Verify-Before-Complete

**Rule**: Never mark ✅ without filesystem verification

**Process**:
```bash
# When ready to mark task complete:
# 1. Identify deliverable
# 2. Verify existence
# 3. Verify content (non-empty, expected structure)
# 4. Verify git tracking
# 5. Only AFTER verification mark complete
```

---

### Protocol 2: Evidence-Based Claims

**Rule**: Every claim MUST link to evidence

**Template**:
```markdown
**Claim**: [What you're asserting]

**Evidence**:
- **Method 1**: [How verified]
- **Method 2**: [Cross-reference]
- **Date**: [When verified]

**Classification**: [Real/Mixed/Aspirational/Outdated/Unknown]
```

---

### Protocol 3: Version Pinning

**Rule**: Tag claims with version numbers

**Pattern**:
```markdown
## Feature Name (v2.0.0+)

**Availability**: claude-flow@alpha >= v2.0.0
**Verified**: 2025-11-18
**Status**: ✅ REAL
```

---

### Protocol 4: Regular Audits

**Schedule**: Monthly documentation sweeps

**Checklist**:
- [ ] Run filesystem verification on all docs
- [ ] Check for 404 internal links
- [ ] Verify version numbers are current
- [ ] Test command examples
- [ ] Review user feedback markers
- [ ] Update verification timestamps
- [ ] Archive outdated guides
- [ ] Create issues for found problems

---

## Part 6: Quality Metrics

### Document Health Score

**Formula**:
```
Health Score = (Real Claims / Total Claims) * 100
```

**Rating Scale**:
- 90-100%: ✅ Excellent (trustworthy)
- 75-89%: ⚠️ Good (mostly accurate, minor updates needed)
- 50-74%: ⚠️ Fair (significant updates required)
- <50%: ❌ Poor (major accuracy problems)

---

## Summary

**This framework provides**:
1. **5-Level Truth-Testing Checklist** - File existence → Integration claims
2. **5-Category Classification System** - Real, Aspirational, Mixed, Outdated, Unknown
3. **4 Automated Validation Tools** - Filesystem check, feature test, evidence collection, temporal detection
4. **4 Ongoing Maintenance Processes** - Monthly audits, user feedback, version tagging, evidence linking
5. **4 Prevention Protocols** - Verify-before-complete, evidence-based claims, version pinning, regular audits

**Key Insight**: Documentation accuracy requires **filesystem verification**, not just intent documentation. The "temporal conflation" anti-pattern (documenting completion before execution) is the primary cause of false claims.

**Reality Score Method**:
- **100 = Perfect** (all claims verified)
- **65+ = Acceptable** (infrastructure solid, manual patterns documented)
- **<50 = Problematic** (aspirational exceeds reality)

---

**Created by**: Tester Agent (swarm-1763455650397-danz0qyd4)
**Session**: session-20251117-233300-workspace-docs-optimization
**Date**: 2025-11-18
**Purpose**: Ensure documentation stays grounded in workspace reality
