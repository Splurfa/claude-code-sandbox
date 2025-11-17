# Workspace Cleanup Plan

**Generated:** 2025-11-14
**Current Session:** session-20251114-153041-dream-hive-meta-coordination
**Safety Level:** LOW RISK (no deletion, archive-only)

---

## Executive Summary

**Current Workspace Status:**
- **Total Sessions:** 13 (10 regular + 3 test)
- **Total Disk Usage:** 5.4M (sessions) + 51M (.swarm) + 184K (inbox) = ~57M
- **Issues Found:** 4 (malformed directory, bloat candidates)
- **Estimated Space Savings:** ~3.4M (63% reduction in sessions/)
- **Risk Level:** LOW (all changes reversible via .archive/)

---

## Session Inventory

### Active Sessions (5)
| Session ID | Status | Files | Size | Keep? |
|-----------|--------|-------|------|-------|
| `session-20251114-145540-adversarial-testing` | active | 18 | 188K | ✅ Keep (active work) |
| `session-20251114-153041-dream-hive-meta-coordination` | active | 45 | 904K | ✅ Keep (current session) |
| `session-20251114-153041-infrastructure-audit` | active | 1 | 24K | ⚠️ Review (minimal artifacts) |
| `session-20251114-174024-readme-documentation` | active | 0 | 8K | ⚠️ Review (no artifacts) |
| `session-20251114-200257-reasoningbank-learning` | active | 13 | 116K | ✅ Keep (active work) |

### Paused Sessions (4)
| Session ID | Status | Files | Size | Action |
|-----------|--------|-------|------|--------|
| `session-20251114-120738-system-validation` | paused | 35 | 420K | 📦 Archive (compress + move) |
| `session-20251114-145225-dream-hive-production-readiness` | paused | 34 | 408K | 📦 Archive (compress + move) |
| `test-session-1` | paused | 1 | 16K | 📦 Archive (test data) |
| `test-session-2` | paused | 1 | 16K | 📦 Archive (test data) |
| `test-session-3` | paused | 1 | 16K | 📦 Archive (test data) |

### Closed Sessions (2)
| Session ID | Status | Files | Size | Action |
|-----------|--------|-------|------|--------|
| `session-20251113-211159-hive-mind-setup` | closed | 153 | 1.7M | 📦 Archive (compress + move) |
| `session-20251113-211159-hive-mind-setup.backup-before-flatten` | closed | 52 | 1.6M | 📦 Archive (compress + move) |

### Complete Sessions (1)
| Session ID | Status | Files | Size | Action |
|-----------|--------|-------|------|--------|
| `session-20251114-200256-session-automation` | complete | 7 | 52K | 📦 Archive (compress + move) |

### Malformed Items (1)
| Item | Issue | Size | Action |
|------|-------|------|--------|
| `SESSION_ID=session-20251114-200257-reasoningbank-learning` | Malformed directory name | 4K | 🗑️ Remove (duplicate metadata) |

---

## Bloat Analysis

### Large Files (>1MB)
**Result:** ✅ None found

### Empty Directories
**Count:** 20 empty subdirectories
**Examples:**
- `test-session-*/artifacts/{tests,docs,notes,scripts}`
- `session-20251114-174024-readme-documentation/artifacts/*`
- `session-20251114-153041-infrastructure-audit/artifacts/{tests,code,notes,scripts}`

**Action:** Remove during archive compression (tar will skip)

### Node Modules Pollution
**Result:** ✅ None found (clean workspace)

### Duplicate Documentation
**Total Markdown Files:** 266
**Action:** Manual review not needed (reasonable count for 13 sessions)

### Orphaned Backups
**Location:** `.swarm/backups/`
**Files:** 19+ session snapshots
**Oldest:** 2025-11-14T15:42:57
**Size:** ~300K
**Action:** ⏳ Keep (all recent, < 1 day old)

---

## Proposed Actions

### 1. Archive Closed Sessions (Priority: HIGH)
**Sessions to Archive:**
1. `session-20251113-211159-hive-mind-setup` (1.7M)
2. `session-20251113-211159-hive-mind-setup.backup-before-flatten` (1.6M)

**Actions:**
```bash
# Create archive structure
mkdir -p .archive/sessions-closed/

# Compress and move
tar -czf .archive/sessions-closed/session-20251113-211159-hive-mind-setup.tar.gz \
  sessions/session-20251113-211159-hive-mind-setup/

tar -czf .archive/sessions-closed/session-20251113-211159-hive-mind-setup.backup-before-flatten.tar.gz \
  sessions/session-20251113-211159-hive-mind-setup.backup-before-flatten/

# Log actions
echo "$(date): Archived session-20251113-211159-hive-mind-setup (1.7M)" >> .archive/cleanup-log.txt
echo "$(date): Archived session-20251113-211159-hive-mind-setup.backup-before-flatten (1.6M)" >> .archive/cleanup-log.txt
```

**Space Saved:** ~3.3M (compressed: ~1.0M estimated)
**Risk:** LOW (reversible via tar -xzf)

---

### 2. Archive Complete Sessions (Priority: HIGH)
**Sessions to Archive:**
1. `session-20251114-200256-session-automation` (52K, status: "complete")

**Actions:**
```bash
mkdir -p .archive/sessions-complete/

tar -czf .archive/sessions-complete/session-20251114-200256-session-automation.tar.gz \
  sessions/session-20251114-200256-session-automation/

echo "$(date): Archived session-20251114-200256-session-automation (52K, complete)" >> .archive/cleanup-log.txt
```

**Space Saved:** ~52K (compressed: ~20K estimated)
**Risk:** LOW (well-documented, comprehensive metadata)

---

### 3. Archive Paused Sessions (Priority: MEDIUM)
**Sessions to Archive:**
1. `session-20251114-120738-system-validation` (420K, paused)
2. `session-20251114-145225-dream-hive-production-readiness` (408K, paused)

**Actions:**
```bash
mkdir -p .archive/sessions-paused/

tar -czf .archive/sessions-paused/session-20251114-120738-system-validation.tar.gz \
  sessions/session-20251114-120738-system-validation/

tar -czf .archive/sessions-paused/session-20251114-145225-dream-hive-production-readiness.tar.gz \
  sessions/session-20251114-145225-dream-hive-production-readiness/

echo "$(date): Archived session-20251114-120738-system-validation (420K, paused)" >> .archive/cleanup-log.txt
echo "$(date): Archived session-20251114-145225-dream-hive-production-readiness (408K, paused)" >> .archive/cleanup-log.txt
```

**Space Saved:** ~828K (compressed: ~300K estimated)
**Risk:** MEDIUM (may resume work, but fully restorable)

---

### 4. Archive Test Sessions (Priority: HIGH)
**Sessions to Archive:**
1. `test-session-1` (16K)
2. `test-session-2` (16K)
3. `test-session-3` (16K)

**Actions:**
```bash
mkdir -p .archive/sessions-tests/

# Archive all test sessions together
tar -czf .archive/sessions-tests/test-sessions-all.tar.gz \
  sessions/test-session-1/ \
  sessions/test-session-2/ \
  sessions/test-session-3/

echo "$(date): Archived test-session-{1,2,3} (48K total)" >> .archive/cleanup-log.txt
```

**Space Saved:** ~48K (compressed: ~15K estimated)
**Risk:** LOW (test data only)

---

### 5. Remove Malformed Directory (Priority: HIGH)
**Item:** `sessions/SESSION_ID=session-20251114-200257-reasoningbank-learning/`

**Analysis:**
- Created due to bash error (variable expansion in directory name)
- Contains duplicate metadata.json (same content as proper session)
- Proper session exists: `session-20251114-200257-reasoningbank-learning`

**Actions:**
```bash
# Archive before removal (safety first)
mkdir -p .archive/malformed/

tar -czf .archive/malformed/SESSION_ID-malformed-20251114.tar.gz \
  "sessions/SESSION_ID=session-20251114-200257-reasoningbank-learning/"

# Remove malformed directory
rm -rf "sessions/SESSION_ID=session-20251114-200257-reasoningbank-learning/"

echo "$(date): Removed malformed directory SESSION_ID=session-20251114-200257-reasoningbank-learning" >> .archive/cleanup-log.txt
```

**Space Saved:** ~4K
**Risk:** VERY LOW (duplicate/malformed data)

---

### 6. Review Minimal Active Sessions (Priority: LOW)
**Sessions to Review:**
1. `session-20251114-153041-infrastructure-audit` (1 file, 24K)
   - **Recommendation:** Keep for now (recent, may be in progress)
2. `session-20251114-174024-readme-documentation` (0 files, 8K)
   - **Recommendation:** Archive or close (no artifacts generated)

**Actions:**
```bash
# Optional: Archive readme-documentation session
tar -czf .archive/sessions-minimal/session-20251114-174024-readme-documentation.tar.gz \
  sessions/session-20251114-174024-readme-documentation/

echo "$(date): Archived session-20251114-174024-readme-documentation (8K, no artifacts)" >> .archive/cleanup-log.txt
```

**Space Saved:** ~8K
**Risk:** LOW (no substantive artifacts)

---

## Safety Checks

### ✅ Pre-Execution Validation
- [x] Current session preserved (`session-20251114-153041-dream-hive-meta-coordination`)
- [x] No user artifacts deleted (all moved to .archive/)
- [x] Compression instead of deletion (reversible)
- [x] Archive log maintained (full audit trail)
- [x] .swarm/backups/ untouched (recent snapshots)
- [x] inbox/ untouched (active workspace)
- [x] No node_modules or large file pollution

### ✅ Rollback Plan
If anything goes wrong:
```bash
# Restore from archive
cd .archive/sessions-closed/
tar -xzf session-20251113-211159-hive-mind-setup.tar.gz -C ../../sessions/

# Check integrity
diff -r sessions/session-20251113-211159-hive-mind-setup/ \
  <original-location>/

# Restore metadata
cp sessions/session-20251113-211159-hive-mind-setup/metadata.json \
  sessions/metadata.json
```

### ✅ Post-Execution Verification
After cleanup:
```bash
# Verify archive integrity
tar -tzf .archive/sessions-closed/*.tar.gz > /dev/null && echo "OK"

# Check disk usage
du -sh sessions/ .archive/

# Count sessions
ls -1 sessions/session-* | wc -l

# Verify current session intact
ls -lah sessions/session-20251114-153041-dream-hive-meta-coordination/
```

---

## Expected Results

### Disk Space Impact
| Component | Before | After | Savings | Compression Ratio |
|-----------|--------|-------|---------|-------------------|
| `sessions/` | 5.4M | ~2.0M | ~3.4M | ~63% |
| `.archive/` | 0 | ~1.4M | -1.4M | ~2.4:1 (tar.gz) |
| **Net Savings** | - | - | **~2.0M** | **37% reduction** |

### Session Count
| Status | Before | After | Change |
|--------|--------|-------|--------|
| Active | 5 | 3-4 | -1 to -2 |
| Paused | 4 | 0 | -4 |
| Closed | 2 | 0 | -2 |
| Complete | 1 | 0 | -1 |
| Test | 3 | 0 | -3 |
| Archived | 0 | 10-11 | +10-11 |
| **Total Sessions/** | 13 | 3-4 | **-9 to -10** |

### Workspace Organization
**Before:**
- 13 session directories (mixed states)
- 1 malformed directory
- No archive structure
- Unclear session history

**After:**
- 3-4 active session directories
- Organized .archive/ structure:
  - `sessions-closed/` (2 sessions, ~3.3M)
  - `sessions-complete/` (1 session, ~52K)
  - `sessions-paused/` (2 sessions, ~828K)
  - `sessions-tests/` (3 sessions, ~48K)
  - `malformed/` (1 item, ~4K)
- Complete audit log (`.archive/cleanup-log.txt`)
- Clear active workspace

---

## Execution Plan

### Phase 1: Preparation (SAFE)
```bash
# Create archive structure
mkdir -p .archive/{sessions-closed,sessions-complete,sessions-paused,sessions-tests,malformed}

# Initialize cleanup log
cat > .archive/cleanup-log.txt <<EOF
# Workspace Cleanup Log
# Generated: $(date)
# Session: session-20251114-153041-dream-hive-meta-coordination
---
EOF

# Backup workspace state
du -sh sessions/ .swarm/ inbox/ > .archive/pre-cleanup-diskusage.txt
ls -la sessions/ > .archive/pre-cleanup-listing.txt
```

### Phase 2: High Priority Archives (HITL APPROVAL REQUIRED)
```bash
# Archive closed sessions (1.7M + 1.6M)
tar -czf .archive/sessions-closed/session-20251113-211159-hive-mind-setup.tar.gz \
  sessions/session-20251113-211159-hive-mind-setup/ && \
echo "$(date): Archived session-20251113-211159-hive-mind-setup" >> .archive/cleanup-log.txt

tar -czf .archive/sessions-closed/session-20251113-211159-hive-mind-setup.backup-before-flatten.tar.gz \
  sessions/session-20251113-211159-hive-mind-setup.backup-before-flatten/ && \
echo "$(date): Archived session-20251113-211159-hive-mind-setup.backup-before-flatten" >> .archive/cleanup-log.txt

# Archive complete session (52K)
tar -czf .archive/sessions-complete/session-20251114-200256-session-automation.tar.gz \
  sessions/session-20251114-200256-session-automation/ && \
echo "$(date): Archived session-20251114-200256-session-automation (complete)" >> .archive/cleanup-log.txt

# Archive test sessions (48K)
tar -czf .archive/sessions-tests/test-sessions-all.tar.gz \
  sessions/test-session-{1,2,3}/ && \
echo "$(date): Archived test-session-{1,2,3}" >> .archive/cleanup-log.txt

# Remove malformed directory (4K)
tar -czf .archive/malformed/SESSION_ID-malformed-20251114.tar.gz \
  "sessions/SESSION_ID=session-20251114-200257-reasoningbank-learning/" && \
rm -rf "sessions/SESSION_ID=session-20251114-200257-reasoningbank-learning/" && \
echo "$(date): Removed malformed SESSION_ID= directory" >> .archive/cleanup-log.txt
```

### Phase 3: Medium Priority Archives (OPTIONAL)
```bash
# Archive paused sessions (828K)
tar -czf .archive/sessions-paused/session-20251114-120738-system-validation.tar.gz \
  sessions/session-20251114-120738-system-validation/ && \
echo "$(date): Archived session-20251114-120738-system-validation (paused)" >> .archive/cleanup-log.txt

tar -czf .archive/sessions-paused/session-20251114-145225-dream-hive-production-readiness.tar.gz \
  sessions/session-20251114-145225-dream-hive-production-readiness/ && \
echo "$(date): Archived session-20251114-145225-dream-hive-production-readiness (paused)" >> .archive/cleanup-log.txt

# Archive minimal session (8K)
tar -czf .archive/sessions-minimal/session-20251114-174024-readme-documentation.tar.gz \
  sessions/session-20251114-174024-readme-documentation/ && \
echo "$(date): Archived session-20251114-174024-readme-documentation (no artifacts)" >> .archive/cleanup-log.txt
```

### Phase 4: Cleanup and Verification
```bash
# Remove archived session directories (ONLY after verifying archives)
# WAIT FOR EXPLICIT USER APPROVAL

# Verify archive integrity first
for archive in .archive/*/*.tar.gz; do
  echo "Verifying: $archive"
  tar -tzf "$archive" > /dev/null && echo "✅ OK" || echo "❌ CORRUPT"
done

# Post-cleanup state
du -sh sessions/ .swarm/ inbox/ .archive/ > .archive/post-cleanup-diskusage.txt
ls -la sessions/ > .archive/post-cleanup-listing.txt

# Generate summary
cat >> .archive/cleanup-log.txt <<EOF
---
Cleanup completed: $(date)
Archives created: $(find .archive/ -name "*.tar.gz" | wc -l)
Total archived size: $(du -sh .archive/ | cut -f1)
Sessions remaining: $(ls -1d sessions/session-* 2>/dev/null | wc -l)
EOF
```

---

## Risk Assessment

### Risk Level: **LOW** ✅

**Mitigation Factors:**
1. **No Deletion** - All data moved to `.archive/`, not deleted
2. **Compression** - tar.gz preserves full structure and metadata
3. **Audit Log** - Complete record of all actions
4. **Current Session Protected** - Active work untouched
5. **Reversible** - All archives can be extracted instantly
6. **Incremental** - Can execute phase-by-phase
7. **HITL Checkpoints** - User approval at each phase

**Potential Issues:**
1. **Disk Space During Compression** - Temporarily 2x usage
   - Mitigation: 5.4M → ~7M peak (57M total available)
2. **Archive Extraction Time** - Slower than direct access
   - Mitigation: Archives rarely needed (closed/complete work)
3. **Paused Session Archival** - May need restoration
   - Mitigation: Quick extraction, clear naming

---

## Human Review Checklist

**Before executing Phase 2 (HIGH PRIORITY):**
- [ ] Review closed session list (are these truly closed?)
- [ ] Confirm complete session metadata (was it successful?)
- [ ] Verify test sessions are disposable (not production tests?)
- [ ] Approve malformed directory removal (is duplicate confirmed?)

**Before executing Phase 3 (MEDIUM PRIORITY - OPTIONAL):**
- [ ] Review paused sessions (resume work soon?)
- [ ] Confirm minimal session has no hidden value
- [ ] Decide if aggressive cleanup is needed now

**Before executing Phase 4 (CLEANUP):**
- [ ] Verify ALL archive integrity (run verification script)
- [ ] Confirm disk space savings are acceptable
- [ ] Approve final removal of archived directories

---

## Deliverables

1. ✅ **Session Inventory** - Complete analysis of 13 sessions
2. ✅ **Bloat Report** - No large files, no node_modules, 20 empty dirs
3. ✅ **Cleanup Plan** - Detailed phase-by-phase execution
4. ✅ **Disk Usage Report** - Before: 5.4M → After: ~2.0M (~2.0M net savings)
5. ✅ **Safety Checklist** - Rollback plan and verification steps
6. ⏳ **Archive Structure** - Awaiting HITL approval to create
7. ⏳ **Cleanup Log** - Awaiting execution to populate

---

## Recommendations

### Immediate Actions (High Priority)
1. **Execute Phase 1** (Preparation) - SAFE, no data changes
2. **Review and Approve Phase 2** - Archive closed/complete/test sessions
3. **Verify archives** before removing source directories

### Optional Actions (Medium Priority)
4. **Consider Phase 3** - Archive paused sessions (free up 828K)
5. **Review minimal sessions** - Close or archive if abandoned

### Long-term Maintenance
6. **Session Closeout Protocol** - Always run `session-end` hook
7. **Weekly Archive Review** - Move old backups to long-term storage
8. **Quarterly Cleanup** - Run similar analysis every 3 months

---

## Approval Required

**STOP HERE - DO NOT EXECUTE WITHOUT USER APPROVAL**

Please review this cleanup plan and approve:
- [ ] Phase 1: Preparation (create .archive/ structure)
- [ ] Phase 2: Archive closed/complete/test sessions
- [ ] Phase 3: Archive paused sessions (optional)
- [ ] Phase 4: Remove archived directories (after verification)

**Questions for User:**
1. Are any "closed" sessions actually needed soon?
2. Should paused sessions be kept accessible?
3. Is aggressive cleanup (Phase 3) needed now?
4. Preferred archive retention policy?

---

**Generated by:** Claude Code (Cleanup Hive Agent)
**Session:** session-20251114-153041-dream-hive-meta-coordination
**Date:** 2025-11-14
**Safety Level:** LOW RISK ✅
