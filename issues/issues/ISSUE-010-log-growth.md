# ISSUE-010: Captain's Log Unbounded Growth

**Status**: Open
**Type**: Bug
**Priority**: Low
**Root Cause**: System (no automated rotation/archival)
**Created**: 2025-11-21
**Updated**: 2025-11-21
**Resolved**: N/A

## Problem Statement

Captain's log files (`sessions/captains-log/YYYY-MM-DD.md`) grow indefinitely without rotation or archival. Over time, daily files can become very large (>500KB), making them slow to open/edit and difficult to search.

## Evidence

**Memory**:
- Key: `prompt-improver/production-ready-final`
- Value includes: "Captain's log unbounded growth - mitigation: quarterly cleanup recommended"

**Current State**:
- Daily files accumulate: `2025-11-18.md`, `2025-11-19.md`, `2025-11-20.md`...
- No automatic archival after N days
- No size monitoring or warnings
- Manual cleanup required

**Projected Growth**:
- Average: ~5 KB per session entry
- Active development: ~10 sessions/day
- Daily file: ~50 KB/day
- Monthly: ~1.5 MB
- Yearly: ~18 MB

## Root Cause Analysis

**Why Unbounded Growth**:

1. **No Rotation Policy**: No rule for "archive files older than 90 days"
2. **No Size Monitoring**: No warning when file exceeds threshold
3. **Append-Only**: Files only grow, never archived
4. **Manual Process**: Requires user to notice and clean up

**Why This Matters**:
- **Now**: Low priority (files still small)
- **Future**: Will become problem after months of use
- **Search**: Large files harder to grep/search
- **Performance**: Text editors slow with huge markdown files

## Proposed Solution

### Short-term (Monitoring)
- [ ] Add size check to session closeout:
  ```bash
  # Warn if daily log >500KB
  LOG_FILE="sessions/captains-log/$(date +%Y-%m-%d).md"
  if [ -f "$LOG_FILE" ] && [ $(stat -f%z "$LOG_FILE") -gt 512000 ]; then
    echo "⚠️ Captain's log >500KB, consider archiving older entries"
  fi
  ```

### Long-term (Automation)

**Monthly Archival**:
```bash
# sessions/issues/archive-captains-log.sh

# Archive files older than 90 days
find sessions/captains-log/ -name "*.md" -mtime +90 -exec mv {} sessions/captains-log/archive/ \;

# Or: Compress older entries
tar -czf sessions/captains-log/archive/2025-Q1.tar.gz sessions/captains-log/2025-0[1-3]-*.md
rm sessions/captains-log/2025-0[1-3]-*.md
```

**Quarterly Summary**:
```markdown
# sessions/captains-log/archive/2025-Q1-SUMMARY.md

## Quarter Summary: 2025 Q1 (Jan-Mar)

**Total Sessions**: 347
**Total Issues Resolved**: 23
**Top Patterns**:
- Session naming violations: 12 occurrences
- Documentation link breaks: 8 occurrences
- False positive tests: 5 occurrences

**Key Achievements**:
- Issue tracking system implemented
- Session closeout automation improved
- Documentation quality: 98/100

**Archived Files**: 2025-Q1.tar.gz (compressed from 4.2MB to 890KB)
```

**Auto-Archival Schedule**:
- **Daily**: Check size, warn if >500KB
- **Monthly**: Move files >90 days to `archive/`
- **Quarterly**: Generate summary, compress to `.tar.gz`
- **Yearly**: Deep archive to cold storage

### Archival Structure
```
sessions/captains-log/
├── 2025-11-18.md (active, last 90 days)
├── 2025-11-19.md
├── 2025-11-20.md
├── 2025-11-21.md
├── archive/
│   ├── 2025-Q1-SUMMARY.md
│   ├── 2025-Q1.tar.gz (Jan-Mar compressed)
│   ├── 2025-Q2-SUMMARY.md
│   └── 2025-Q2.tar.gz (Apr-Jun compressed)
└── README.md
```

## Related Issues

- Related to ISSUE-001 (once captain's log automated, growth accelerates)

## Resolution Notes

**Status**: Open - Low priority until files actually become large

**Trigger Conditions**:
- Implement archival when ANY daily file exceeds 500KB
- OR when total captains-log/ directory exceeds 10MB
- OR after 6 months of active use

**Next Steps**:
1. Monitor file sizes monthly
2. Implement archival script when triggered
3. Test: Archive old files, verify still accessible
4. Add to quarterly maintenance checklist
5. Mark resolved once archival automated
