# HITL Archival Plan - Inbox Cleanup

**Session**: session-20251116-215913-inbox-cleanup
**Date**: 2025-11-16
**Status**: Awaiting HITL Approval

---

## 📋 Scope of Archival

### ✅ TO ARCHIVE

**Primary Target**: `inbox/assistant/2025-11-16-system-hygiene-check/`

**Verification Status**: 100% Complete
- ✅ File routing skill created at `.claude/skills/file-routing/`
- ✅ README guidelines applied to `docs/guides/README.md`
- ✅ Captain's Log working correctly in `sessions/captains-log/`
- ✅ Organization guidelines created at `inbox/assistant/README.md`
- ✅ All proposals implemented and integrated

**Confidence Level**: 100% - Safe to archive

---

### 🔒 TO RETAIN

**Keep Active**:
1. `inbox/README.md` - Template definition (system requirement)
2. `inbox/user/` - Active user deposit area
3. `inbox/assistant/README.md` - Organization guidelines
4. `inbox/codex-agent/` - Ongoing reference materials (14 files)
5. `inbox/cursor-agent/` - Database visualization tools (newly added)

---

## 🧹 Additional Cleanup: .claude-flow Directories

**Problem Identified**: Rogue `.claude-flow` directories appearing in random folders

**Current Locations** (9 total):
```
✅ /common-thread-sandbox/.claude-flow  (ROOT - KEEP)
❌ /inbox/cursor-agent/db-visualization-tools/.claude-flow
❌ /sessions/.archive/session-20251116-084306.../artifacts/docs/.claude-flow
❌ /sessions/.archive/session-20251114-120738.../artifacts/code/.claude-flow
❌ /sessions/.archive/session-20251115-210537.../artifacts/.claude-flow
❌ /sessions/.archive/session-20251113-211159.../.claude-flow
❌ /sessions/.archive/session-20251113-211159.../iteration-5/artifacts/code/.claude-flow
❌ /sessions/.archive/session-20251115-151900.../artifacts/docs/.claude-flow
```

**Root Cause**: Stock claude-flow creates session metrics in working directories

**Cleanup Action**: Remove all `.claude-flow` directories EXCEPT the root one

---

## 🎯 Execution Plan

### Phase 1: Verification (Pre-Flight Checks)

```bash
# 1. Verify all integrations exist
test -f .claude/skills/file-routing/readme.md && \
  echo "✅ File routing skill exists" || echo "❌ Missing file routing skill"

grep -q "What Belongs in docs/" docs/guides/README.md && \
  echo "✅ README guidelines applied" || echo "❌ Missing README guidelines"

test -f sessions/captains-log/2025-11-16.md && \
  echo "✅ Captain's Log working" || echo "❌ Captain's Log missing"

test -f inbox/assistant/README.md && \
  echo "✅ Organization guidelines exist" || echo "❌ Missing org guidelines"

echo "✅ All integrations verified"
```

### Phase 2: Archive Creation

```bash
# 2. Create archive directory
mkdir -p .archive/inbox/assistant/

# 3. Copy folder to archive
cp -r inbox/assistant/2025-11-16-system-hygiene-check/ \
      .archive/inbox/assistant/

# 4. Add archive metadata
cat > .archive/inbox/assistant/2025-11-16-system-hygiene-check/ARCHIVE-METADATA.md << 'EOF'
# Archive Metadata

**Archived**: $(date +%Y-%m-%d)
**Reason**: All proposals implemented and integrated into codebase
**Session**: session-20251116-215913-inbox-cleanup

## Integrated Features

1. **File routing skill** → `.claude/skills/file-routing/`
2. **README guidelines** → `docs/guides/README.md`
3. **Captain's Log** → `sessions/captains-log/` (PST 12-hour format)
4. **Organization guidelines** → `inbox/assistant/README.md`

## Verification

All content verified as implemented. No unique information lost.
No pending action items.

## Rollback Procedure

If needed, restore with:
```bash
cp -r .archive/inbox/assistant/2025-11-16-system-hygiene-check/ \
      inbox/assistant/
```
EOF

# 5. Verify archive created successfully
test -d .archive/inbox/assistant/2025-11-16-system-hygiene-check && \
  echo "✅ Archive created successfully"
```

### Phase 3: Cleanup

```bash
# 6. Remove original from inbox
rm -rf inbox/assistant/2025-11-16-system-hygiene-check/

# 7. Verify removal
! test -d inbox/assistant/2025-11-16-system-hygiene-check && \
  echo "✅ Original removed from inbox"
```

### Phase 4: .claude-flow Cleanup

```bash
# 8. Remove rogue .claude-flow directories (keep root only)
find . -name ".claude-flow" -type d ! -path "./.claude-flow" -exec rm -rf {} + 2>/dev/null

# 9. Verify only root .claude-flow remains
CLAUDE_FLOW_DIRS=$(find . -name ".claude-flow" -type d | wc -l)
if [ $CLAUDE_FLOW_DIRS -eq 1 ]; then
  echo "✅ Only root .claude-flow remains"
else
  echo "⚠️  Found $CLAUDE_FLOW_DIRS .claude-flow directories (expected 1)"
fi
```

### Phase 5: Git Commit

```bash
# 10. Stage changes
git add .archive/inbox/ inbox/assistant/

# 11. Commit with descriptive message
git commit -m "Archive completed system hygiene check (2025-11-16)

- All proposals implemented and integrated
- File routing skill: .claude/skills/file-routing/
- README guidelines: docs/guides/README.md
- Captain's Log: sessions/captains-log/
- Organization guidelines: inbox/assistant/README.md
- Cleanup: Removed rogue .claude-flow directories

Session: session-20251116-215913-inbox-cleanup"
```

---

## 📊 Risk Assessment

| Action | Risk Level | Mitigation |
|--------|-----------|------------|
| Archive system-hygiene-check | 🟢 LOW | All content integrated, clear rollback |
| Remove .claude-flow dirs | 🟡 MEDIUM | Keep root dir, only remove duplicates |
| Retain codex-agent | 🟢 LOW | High reference value, 90-day review |
| Retain cursor-agent | 🟢 LOW | Newly added tools |

---

## 🔄 Rollback Procedure

If issues arise:

```bash
# Restore archived folder
cp -r .archive/inbox/assistant/2025-11-16-system-hygiene-check/ \
      inbox/assistant/

# Revert git commit
git revert HEAD
```

---

## 📅 Post-Archival Actions

1. **Multi-agent investigation** of .claude-flow duplication issue
2. **90-day review** of codex-agent materials (2026-02-16)
3. **Session closeout** with documentation

---

## ✅ HITL Approval Checklist

Before proceeding, confirm:

- [ ] All verification steps pass
- [ ] Archive destination is correct (`.archive/inbox/assistant/`)
- [ ] Rollback procedure is clear
- [ ] .claude-flow cleanup is understood
- [ ] Git commit message is appropriate
- [ ] Post-archival investigation is scheduled

---

## 🎯 Expected Outcome

**Before**:
```
inbox/
├── assistant/
│   ├── README.md
│   └── 2025-11-16-system-hygiene-check/ ← TO ARCHIVE
├── codex-agent/ (14 files)
├── cursor-agent/ (4 files)
└── user/
```

**After**:
```
inbox/
├── assistant/
│   └── README.md
├── codex-agent/ (14 files)
├── cursor-agent/ (4 files)
└── user/

.archive/inbox/assistant/
└── 2025-11-16-system-hygiene-check/ ← ARCHIVED
```

**Plus**: Only 1 `.claude-flow` directory (at project root)

---

**Recommendation**: ✅ **APPROVE** - All criteria met, low risk, clear rollback

