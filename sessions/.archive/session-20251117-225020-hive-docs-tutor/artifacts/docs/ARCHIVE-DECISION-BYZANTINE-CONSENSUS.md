# Byzantine Consensus: Documentation Archive Decision

**Date**: 2025-11-18T07:05:00Z
**Session**: session-20251117-225020-hive-docs-tutor
**Namespace**: hive-wizard-20251117
**Reviewer**: Documentation Review Agent

---

## Consensus Protocol

**Type**: Byzantine Fault Tolerance (BFT) with HITL approval
**Quorum**: 2/3 majority required (user + reviewer consensus)
**Decision**: ARCHIVE the following 2 files

---

## Files Proposed for Archive

### 1. `docs/tutorials/04-advanced/reasoning-bank.md`

**Audit Score**: 50 (EXCLUDE threshold)
**Weighted Score Breakdown**:
- Informational Value: Low (feature has 0 episodes)
- Prescriptive Risk: High (teaches non-functional feature)
- Temporal Stability: Low (likely never functional)
- User Authority: Medium (tutorial)

**Archive Rationale**:
1. **Evidence of non-functionality**: Feature has **0 episodes** stored
2. **User harm risk**: Tutorial teaches users to expect learning capabilities that don't exist
3. **Misleading content**: Claims "agents will learn from experience" but no evidence of learning system
4. **Better alternative**: Remove entirely or mark as "PLANNED FEATURE - NOT YET IMPLEMENTED"

**Byzantine Consensus**:
- **Reviewer Agent**: ARCHIVE ✅
- **Audit Findings**: EXCLUDE classification (score < 70)
- **User Approval**: REQUIRED (irreversible action)

**Recommended Action**: Archive to `.swarm/backups/archived-docs/reasoning-bank.md` with metadata explaining why

---

### 2. `docs/guides-legacy-readme.md`

**Audit Score**: 43 (CAUTIONARY threshold)
**Weighted Score Breakdown**:
- Informational Value: Low (superseded)
- Prescriptive Risk: Medium (conflicts with current structure)
- Temporal Stability: Very Low (marked "legacy" by name)
- User Authority: Low (outdated)

**Archive Rationale**:
1. **Superseded content**: Current `docs/README.md` is the authoritative guide
2. **Confusion risk**: Users may reference outdated structure
3. **Self-identified as legacy**: Filename explicitly says "legacy"
4. **Better alternative**: Archive entirely, all content integrated into current docs/

**Byzantine Consensus**:
- **Reviewer Agent**: ARCHIVE ✅
- **Audit Findings**: CAUTIONARY classification (score 40-69) - borderline EXCLUDE
- **User Approval**: REQUIRED (irreversible action)

**Recommended Action**: Archive to `.swarm/backups/archived-docs/guides-legacy-readme.md` with note that content is superseded

---

## Consensus Decision Log

**Agent Vote**:
- Reviewer Agent: ARCHIVE both files ✅
- Rationale: Both files fail quality thresholds and risk misleading users

**User Vote**:
- Status: PENDING APPROVAL
- Required: User must approve irreversible archive action

**Quorum Status**: 1/2 votes received (50%)
**Required for Execution**: 2/2 votes (100%) - user approval needed

---

## Archive Procedure

If user approves:

```bash
# 1. Create archive directory with metadata
mkdir -p .swarm/backups/archived-docs/2025-11-18-doc-review/

# 2. Move files with timestamp
mv docs/tutorials/04-advanced/reasoning-bank.md \
   .swarm/backups/archived-docs/2025-11-18-doc-review/reasoning-bank.md

mv docs/guides-legacy-readme.md \
   .swarm/backups/archived-docs/2025-11-18-doc-review/guides-legacy-readme.md

# 3. Create metadata file
cat > .swarm/backups/archived-docs/2025-11-18-doc-review/ARCHIVE-METADATA.json << EOF
{
  "archive_date": "2025-11-18T07:05:00Z",
  "session": "session-20251117-225020-hive-docs-tutor",
  "reviewer": "Documentation Review Agent",
  "reason": "Audit findings - EXCLUDE classification",
  "consensus_protocol": "Byzantine (user + reviewer)",
  "user_approved": true,
  "files": [
    {
      "original_path": "docs/tutorials/04-advanced/reasoning-bank.md",
      "archive_reason": "Feature has 0 episodes - misleading tutorial",
      "audit_score": 50,
      "classification": "EXCLUDE"
    },
    {
      "original_path": "docs/guides-legacy-readme.md",
      "archive_reason": "Superseded by docs/README.md",
      "audit_score": 43,
      "classification": "CAUTIONARY (borderline EXCLUDE)"
    }
  ]
}
EOF

# 4. Git commit the changes
git add .swarm/backups/archived-docs/
git rm docs/tutorials/04-advanced/reasoning-bank.md
git rm docs/guides-legacy-readme.md
git commit -m "Archive misleading and superseded documentation files"
```

---

## Alternative: User Rejection

If user rejects archive:

**Option 1**: Add stronger warnings to both files
- reasoning-bank.md: "⚠️ **UNIMPLEMENTED**: This feature is not yet functional (0 episodes)"
- guides-legacy-readme.md: "⚠️ **SUPERSEDED**: This document is outdated. See docs/README.md"

**Option 2**: Move to separate "archived-but-visible" directory
- Create `docs/archived/` directory
- Move files there with warning headers

**Option 3**: No action - keep as-is with existing CAUTIONARY warnings

---

## Cross-Reference Impact Analysis

### Files that reference `reasoning-bank.md`:
- `docs/tutorials/04-advanced/README.md` (Phase 4 overview)
- `docs/tutorials/progress-tracker.md` (learning checklist)

**If archived**: Update these 2 files to remove broken links

### Files that reference `guides-legacy-readme.md`:
- None found (already isolated)

**If archived**: No cross-reference cleanup needed

---

## Verdict Summary

**Reviewer Recommendation**: ARCHIVE both files
**Evidence Strength**: HIGH (audit scores + functionality verification)
**Risk if kept**: Medium (user confusion, wasted time learning non-functional features)
**Risk if archived**: Low (no functional content lost)

**Waiting for**: User approval to proceed with irreversible archive operation

---

**Coordination Key**: `coordination/doc-review/archive-proposal`
**Status**: PENDING_USER_APPROVAL
