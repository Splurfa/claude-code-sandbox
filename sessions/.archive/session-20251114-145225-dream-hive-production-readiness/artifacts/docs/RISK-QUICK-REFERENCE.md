# Risk Assessment Quick Reference Card
**TL;DR:** 4 critical + 8 high risks. Fix in 13 days. Then production-ready.

## 🚨 Critical Risks (Fix NOW)

| ID | Risk | Days | Mitigation |
|----|------|------|------------|
| R-OP-01 | **Disk exhaustion** | 2 | Retention policy + quota monitoring |
| R-DL-01 | **Backup corruption** | 1 | File locking + integrity checks |
| R-DL-02 | **Metadata corruption** | 1 | JSON schema + atomic writes |
| R-DL-03 | **Partial closeout** | 2 | State machine + timeouts |

**Total:** 6 days critical path

## ⚠️ High Risks (Fix Before Production)

| ID | Risk | Days |
|----|------|------|
| R-DL-04 | Recovery untested | 3 |
| R-OP-04 | Hook cascades | 2 |
| R-CP-01 | File routing bypass | 1 |
| R-OP-02 | SQLite performance | 1 |

**Total:** 7 days high-priority

## 📊 By Category

- **Data Loss:** 4 risks (2 critical, 2 high)
- **Operational:** 8 risks (1 critical, 3 high)
- **Compliance:** 4 risks (0 critical, 1 high)
- **Security:** 4 risks (0 critical, 0 high)

## ✅ Production Readiness Criteria

```bash
# Before production deploy, verify:
✅ Retention policy active (R-OP-01)
✅ Backups checksummed (R-DL-01)
✅ Metadata validated (R-DL-02)
✅ Closeout state machine (R-DL-03)
✅ Recovery drill passed (R-DL-04)
✅ Hook dependencies mapped (R-OP-04)
✅ Pre-commit file guards (R-CP-01)
✅ SQLite indexed (R-OP-02)
✅ Monitoring deployed
✅ Runbook documented
```

## 🔥 If Production Fails

### Disk Full
```bash
npx claude-flow hooks cleanup --aggressive
tar -czf archive.tar.gz sessions/session-202511*
rm -rf sessions/session-202511*
sqlite3 .swarm/memory.db "VACUUM;"
```

### Backup Corrupt
```bash
# Find last good backup
for f in .swarm/backups/*.json; do
  jq empty "$f" && echo "$f: OK"
done | tail -1

# Restore
npx claude-flow hooks restore --backup <file>
```

### Session Won't Close
```bash
# Check state
cat sessions/$SESSION_ID/metadata.json

# Force close (last resort)
echo '{"status":"closed","closed_at":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'"}' \
  > sessions/$SESSION_ID/metadata.json
```

## 📈 Monitoring Thresholds

```bash
# Alerts
disk_usage > 70%       → WARNING
disk_usage > 80%       → CRITICAL
backup_failures > 5%   → WARNING
hook_failures > 5%     → WARNING
closeout_time > 5min   → WARNING

# Checks
Daily:    Disk usage, backup success, hook health
Weekly:   Recovery drill, session audit
Monthly:  Security scan, compliance review
```

## 📚 Full Reports

- **Detailed Assessment:** `risk-assessment-report.md` (32 risks, mitigation plans)
- **Executive Summary:** `risk-assessment-executive-summary.md` (go/no-go decision)
- **Coordination Memory:** `dream-hive/risk-assessment/verdict` (structured data)

## 🎯 Timeline

```
Week 1: Critical fixes (6 days)
Week 2: High-priority fixes (7 days)
Week 3: Production deploy + monitoring

Total: 13 business days
```

## 🤝 Handoff to Integration Team

**Dependencies:**
- Testing Specialist validates fixes
- Integration Coordinator deploys monitoring
- Queen Seraphina approves production go-live

**Success Metrics:**
- All critical risks mitigated ✅
- All high risks mitigated ✅
- Recovery drill passed ✅
- Monitoring operational ✅
