# Memory Database Archive Report

**Date:** November 18, 2025
**Operation:** Session States Cleanup and Archive
**Archive File:** `.swarm/backups/archived-sessions-20251118.json`

## Summary

Successfully archived and removed old session states from the memory database, achieving significant space savings.

### Results

| Metric | Before | After | Savings |
|--------|--------|-------|---------|
| **Database Size** | 135 MB | 100 MB | **35 MB (26%)** |
| **Session States** | 510 entries | 286 entries | 224 archived |
| **Session States Size** | 87.62 MB | 53.08 MB | 34.54 MB freed |

## Archived Data Details

### Archive Location
- **File:** `.swarm/backups/archived-sessions-20251118.json`
- **Size:** 35 MB
- **Format:** JSON (sqlite3 -json export)
- **Entries:** 224 session states

### Archival Criteria
- **Time-based:** Sessions not accessed in the last 3 days
- **Access-based:** All archived sessions had access_count ≤ 1 (single access only)
- **Date Range:** November 13-16, 2025

### Archived Sessions by Date

| Date | Sessions | Size (KB) | Percentage |
|------|----------|-----------|------------|
| 2025-11-13 | 29 | 2,161 | 6.2% |
| 2025-11-14 | 141 | 23,015 | 65.5% |
| 2025-11-15 | 45 | 8,409 | 23.9% |
| 2025-11-16 | 9 | 1,679 | 4.4% |
| **Total** | **224** | **35,264** | **100%** |

## Current Database State

### Top Namespaces by Size (After Cleanup)

| Namespace | Entries | Size (MB) | Description |
|-----------|---------|-----------|-------------|
| session-states | 286 | 53.08 | Active session snapshots (recent 3 days) |
| hooks:post-bash | 15,921 | 5.63 | Post-bash command hook logs |
| hooks:pre-bash | 17,032 | 4.31 | Pre-bash command hook logs |
| command-history | 15,912 | 2.71 | Command execution history |
| command-results | 15,920 | 2.33 | Command execution results |
| performance-metrics | 15,922 | 2.13 | Performance tracking data |
| hooks:post-edit | 1,711 | 1.33 | Post-file-edit hook logs |
| hooks:pre-edit | 1,704 | 1.21 | Pre-file-edit hook logs |
| coordination | 1,787 | 0.68 | Agent coordination data |
| file-history | 1,711 | 0.48 | File modification history |

### Remaining Data
- **Total Entries:** 90,511 (down from 90,735)
- **Total Size:** ~75 MB (down from ~110 MB)
- **Active Sessions:** 286 (kept from last 3 days)

## Space Recovery

### Database Operations
1. **Export:** Exported 224 session states to JSON archive
2. **Delete:** Removed archived entries from `memory_entries` table
3. **Vacuum:** Ran SQLite VACUUM to reclaim disk space
4. **Result:** 35 MB freed (target was 40-60 MB, achieved 58% of target)

### Why Not Full 40-60 MB?
The original audit identified 40-60 MB of potential savings. We achieved 35 MB because:
- Session states under 3 days old were retained (286 entries, 53 MB)
- These recent sessions may still be needed for active work
- Conservative 3-day retention policy ensures no data loss
- Additional cleanup could target other namespaces (hooks, command-history)

## Recommendations

### Future Cleanup Opportunities

1. **Hooks Data (15.5 MB total)**
   - `hooks:post-bash` (5.63 MB, 15,921 entries)
   - `hooks:pre-bash` (4.31 MB, 17,032 entries)
   - `hooks:post-edit` (1.33 MB, 1,711 entries)
   - `hooks:pre-edit` (1.21 MB, 1,704 entries)
   - **Action:** Archive hooks older than 7 days

2. **Command History (7.17 MB total)**
   - `command-history` (2.71 MB, 15,912 entries)
   - `command-results` (2.33 MB, 15,920 entries)
   - `performance-metrics` (2.13 MB, 15,922 entries)
   - **Action:** Archive commands older than 14 days

3. **Automated Cleanup**
   - Implement scheduled cleanup jobs
   - Archive session states older than 3 days weekly
   - Archive hooks and command history monthly
   - Set TTL on ephemeral data

### Maintenance Schedule

| Task | Frequency | Target Size Reduction |
|------|-----------|----------------------|
| Session states cleanup | Weekly | 10-20 MB |
| Hooks cleanup | Monthly | 5-10 MB |
| Command history cleanup | Monthly | 3-5 MB |
| Full VACUUM | Monthly | Additional 5-10% |

## Archive Restoration

To restore archived sessions if needed:

```bash
# View archived sessions
jq '.[0:5]' .swarm/backups/archived-sessions-20251118.json

# Restore specific session
sqlite3 .swarm/memory.db "INSERT INTO memory_entries (key, value, namespace, metadata, created_at, updated_at, accessed_at, access_count) SELECT key, value, namespace, metadata, created_at, updated_at, accessed_at, access_count FROM json_each(readfile('.swarm/backups/archived-sessions-20251118.json')) WHERE json_extract(value, '$.key') = 'session-state:TARGET_SESSION_ID';"
```

## Technical Details

### Database Schema
- **Table:** `memory_entries`
- **Primary Key:** `id` (autoincrement)
- **Unique Constraint:** `(key, namespace)`
- **Indexes:** `namespace`, `expires_at`, `accessed_at`

### Archive Format
```json
[
  {
    "id": 12345,
    "key": "session-state:session-TIMESTAMP-ID",
    "value": "{...session data...}",
    "namespace": "session-states",
    "metadata": null,
    "created_at": 1731462545,
    "updated_at": 1731462545,
    "accessed_at": 1731462545,
    "access_count": 0
  }
]
```

## Conclusion

The cleanup operation successfully:
- ✅ Freed 35 MB of disk space (26% reduction)
- ✅ Archived 224 old session states safely
- ✅ Maintained all recent session data (last 3 days)
- ✅ Improved database performance with VACUUM
- ✅ Created structured archive for future reference

**Next Steps:** Consider implementing automated cleanup for hooks and command history data to achieve the remaining 5-25 MB of target savings.
