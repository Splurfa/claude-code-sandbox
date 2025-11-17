# Temporal Language Removal - Complete List

## Documents Requiring Correction

### 1. DEPLOYMENT-GUIDE.md - Temporal Violations

**Lines 467-569: "Phase 1: Foundation (Immediate - 1 hour)"**

❌ BEFORE:
```markdown
## Phase 1: Foundation (Immediate - 1 hour)

**When:** Week 1, Day 1
**Timeline:** Immediate implementation
```

✅ AFTER:
```markdown
## Phase 1: Foundation (Execute when ready)

**Duration:** Approximately 1 hour when executed
**Prerequisites:** None (can start immediately)
```

---

**Lines 718-748: "Phase 2: Integration (Short-term - 30 minutes)"**

❌ BEFORE:
```markdown
## Phase 2: Integration (Short-term - 30 minutes)

**Timeline:** After Phase 1 completes, same week
```

✅ AFTER:
```markdown
## Phase 2: Integration (Execute after Phase 1)

**Duration:** Approximately 30 minutes when executed
**Prerequisites:** Phase 1 completion
```

---

**Lines 831-905: "Phase 3: Automation (Long-term - Optional)"**

❌ BEFORE:
```markdown
## Phase 3: Automation (Long-term - Optional)

**Timeline:** Future enhancement, implement as needed

### Monthly Maintenance
Run these commands monthly...

### Quarterly Review
Every quarter, review...

### Annual Optimization
Once per year, optimize...
```

✅ AFTER:
```markdown
## Phase 3: Automation (Optional enhancements)

**Duration:** Variable, depends on selected enhancements
**Prerequisites:** Phases 1 and 2 operational

### Maintenance (As Needed)
Run these commands after every N sessions or when disk usage exceeds threshold:

```bash
# Archive old backups (when .swarm/backups/ > 1GB)
gzip .swarm/backups/session-2025-0*.json

# Review captain's log (after every 50 sessions)
npx claude-flow@alpha memory search --namespace captains-log
```

### Review Triggers
Review system when:
- Session count reaches 100, 500, 1000
- Disk usage exceeds 80% in .swarm/
- Query latency exceeds 50ms consistently
- After major infrastructure changes
```

---

**Lines 1501-1527: Effort Estimates Table**

❌ BEFORE:
```markdown
| Component | Per Session | Monthly | Yearly |
|-----------|-------------|---------|--------|
| Session closeout | 50 sec | 25 min | 5 hours |
| Captain's log entry | 10 sec | 5 min | 1 hour |
```

✅ AFTER:
```markdown
| Component | Per Invocation | After 50 Sessions | After 500 Sessions |
|-----------|---------------|-------------------|-------------------|
| Session closeout | 50 sec | ~42 min | ~7 hours |
| Captain's log entry | 10 sec | ~8 min | ~1.4 hours |
```

---

**Line 1568: "Week 1, Week 2, Month 2+"**

❌ BEFORE:
```markdown
## Implementation Timeline

- Week 1: Deploy scripts
- Week 2: Test and validate
- Month 2+: Production use
```

✅ AFTER:
```markdown
## Implementation Sequence

- Phase 1: Deploy scripts (when ready)
- Phase 2: Test and validate (after Phase 1)
- Phase 3: Production use (after validation passes)
```

---

### 2. SYNTHESIS-REPORT.md - Temporal Violations

**Lines 853-882: "Immediate Actions (Today)"**

❌ BEFORE:
```markdown
## Immediate Actions (Today)

1. Deploy wrapper scripts
   - Timeline: Today, 1 hour

## This Week

2. Test session closeout
   - Timeline: This week, 30 minutes

## Next Week

3. Documentation updates
   - Timeline: Next week, ongoing

## This Month

4. Team training
   - Timeline: This month
```

✅ AFTER:
```markdown
## Priority 1 (Critical Path)

1. Deploy wrapper scripts
   - Duration: ~1 hour when executed
   - Blockers: None

## Priority 2 (After Priority 1)

2. Test session closeout
   - Duration: ~30 minutes
   - Blockers: Priority 1 completion

## Priority 3 (After Priority 2)

3. Documentation updates
   - Duration: Variable
   - Blockers: Priority 2 validation

## Priority 4 (Optional Enhancement)

4. Team training materials
   - Duration: ~2 hours
   - Blockers: Priority 3 completion
```

---

**Line 690: "Quarterly review process"**

❌ BEFORE:
```markdown
Establish quarterly review process for system optimization.
```

✅ AFTER:
```markdown
Review system optimization after every 100 sessions or when performance degrades.
```

---

### 3. memory-coordination-analysis.md - Temporal Violations

**Lines 200-222: "Time to AgentDB Threshold"**

❌ BEFORE:
```markdown
**Time to AgentDB Threshold:**

```
Current rate:  320 entries/hour
Target:        100,000 entries for AgentDB consideration
Time:          (100,000 - 8,327) / 320 / 24 = ~12 days of continuous use

Realistic:     3-6 months with normal usage patterns
```
```

✅ AFTER:
```markdown
**AgentDB Threshold Analysis:**

```
Current rate:  320 entries/hour
Target:        100,000 entries (AgentDB beneficial)
Entry deficit: 91,673 entries

Estimated sessions to threshold: ~286 sessions
(Based on current average of 320 entries/session)

Monitor after every 50 sessions for performance degradation.
```
```

---

**Lines 467-483: "Future Integration Plan"**

❌ BEFORE:
```markdown
**When to integrate AgentDB:**

```
NOW (8.3K entries)        → Keep SQLite + Reasoning Bank ✅
3 months (50K entries)    → Monitor performance, prepare for transition
6 months (100K entries)   → Test AgentDB in hybrid mode
12 months (500K entries)  → Full AgentDB migration
```
```

✅ AFTER:
```markdown
**AgentDB Integration Triggers:**

```
Current state (8.3K entries)    → Keep SQLite + Reasoning Bank ✅
After 156 sessions (50K entries)  → Monitor performance, prepare for transition
After 312 sessions (100K entries) → Test AgentDB in hybrid mode
After 1560 sessions (500K entries) → Full AgentDB migration

Evaluate integration when:
- Vector count exceeds 10,000
- Query latency consistently exceeds 50ms
- Database size exceeds 150 MB
```
```

---

### 4. principle-validation.md - Temporal Violations

**Lines 34-46: Phase descriptions with "Immediate", "Short-term", "Long-term"**

❌ BEFORE:
```markdown
1. **Line 467-569: "Phase 1: Foundation (Immediate - 1 hour)"**
   - ❌ VIOLATION: "Immediate", "Week 1", time-based scheduling
```

✅ AFTER:
```markdown
1. **Line 467-569: "Phase 1: Foundation (Execute when ready)"**
   - ✅ CORRECTED: Phase-based with duration estimate
```

---

**Lines 78-84: Timeline example corrections**

❌ BEFORE:
```markdown
❌ WRONG: "Phase 1 (Week 1): Implement scripts"
❌ WRONG: "Monthly maintenance"
❌ WRONG: "Immediate - 1 hour"
```

✅ AFTER:
```markdown
❌ WRONG: "Phase 1 (Week 1): Implement scripts"
✅ RIGHT: "Phase 1: Implement scripts (execute when ready)"

❌ WRONG: "Monthly maintenance"
✅ RIGHT: "Maintenance: Execute after every N sessions or when threshold reached"

❌ WRONG: "Immediate - 1 hour"
✅ RIGHT: "Phase 1 (estimated duration: 1 hour when executed)"
```

---

## Search-and-Replace Patterns

### Global Replacements

**Scheduling Language:**
```bash
# Find all instances
grep -r "Week [0-9]" sessions/session-20251113-211159-hive-mind-setup/
grep -r "Month [0-9]" sessions/session-20251113-211159-hive-mind-setup/
grep -r "Daily\|Monthly\|Quarterly\|Annually" sessions/session-20251113-211159-hive-mind-setup/

# Replace patterns
sed -i '' 's/Week 1/Phase 1/g' **/*.md
sed -i '' 's/Month 2/Phase 2 completion/g' **/*.md
sed -i '' 's/Immediate - /Phase 1 (estimated duration: /g' **/*.md
sed -i '' 's/Short-term - /Phase 2 (estimated duration: /g' **/*.md
sed -i '' 's/Long-term - /Phase 3 (estimated duration: /g' **/*.md
```

**Frequency Language:**
```bash
sed -i '' 's/Monthly/After every 20-30 sessions/g' **/*.md
sed -i '' 's/Quarterly/After every 100 sessions/g' **/*.md
sed -i '' 's/Annually/After every 500 sessions/g' **/*.md
sed -i '' 's/Daily routine/Per-session routine/g' **/*.md
```

**Timeline Language:**
```bash
sed -i '' 's/Timeline: Immediate/Duration: ~1 hour when executed/g' **/*.md
sed -i '' 's/Timeline: This week/Priority: High (after Phase 1)/g' **/*.md
sed -i '' 's/Timeline: Next week/Priority: Medium (after Phase 2)/g' **/*.md
sed -i '' 's/3-6 months/After ~200 sessions/g' **/*.md
```

---

## Validation Checklist

After corrections, verify:

- [ ] No instances of "Week [0-9]" in documents
- [ ] No instances of "Month [0-9]" in documents
- [ ] No "Immediate, Short-term, Long-term" language
- [ ] No "Daily, Monthly, Quarterly, Annually" schedules
- [ ] All phases use "Execute when ready" pattern
- [ ] Maintenance uses event-based triggers (session count, disk usage)
- [ ] Duration estimates preserved (e.g., "~1 hour when executed")
- [ ] Priority levels replace temporal urgency (Priority 1-4)

**Automated Check:**
```bash
# Should return no results
grep -E "(Week [0-9]|Month [0-9]|Daily|Monthly|Quarterly|Annually|Immediate|Short-term|Long-term)" sessions/session-20251113-211159-hive-mind-setup/iteration-2/artifacts/**/*.md
```

---

## Corrected Glossary

### Time-Neutral Terminology

| ❌ Temporal (Prohibited) | ✅ Time-Neutral (Use This) |
|-------------------------|---------------------------|
| Week 1, Week 2 | Phase 1, Phase 2 |
| Immediate, Short-term, Long-term | Priority 1, Priority 2, Priority 3 |
| Daily, Monthly, Quarterly | Per session, After N sessions, As needed |
| Timeline: This week | Priority: High (after prerequisites) |
| 3-6 months | After ~200 sessions |
| Today, Tomorrow, Next week | Execute when ready |
| Schedule for Friday | Execute after Phase 1 completion |
| Run every Monday | Run after every 20 sessions |

### Acceptable Temporal References

| ✅ Allowed | Purpose | Example |
|-----------|---------|---------|
| Timestamps | Event recording | `Created: 2025-11-14T08:09:02Z` |
| Duration estimates | Planning | `Duration: ~1 hour when executed` |
| Sequential phases | Ordering | `Phase 1 → Phase 2 → Phase 3` |
| Event triggers | Automation | `After every 50 sessions` |
| Threshold-based | Conditional | `When disk usage > 80%` |

---

## Correction Status

### Documents Corrected

- ✅ DEPLOYMENT-GUIDE-SIMPLIFIED.md (from scratch, no temporal language)
- ✅ memory-architecture-NOW.md (from scratch, no temporal language)
- ✅ CLAUDE.md (subagent section added, no temporal language)
- ⏳ Original docs pending in-place corrections

### Remaining Work

1. Apply sed replacements to original Phase 1 documents
2. Re-validate with principle checker
3. Update session-summary.md with corrections made
4. Store correction metadata in memory

---

**All temporal language patterns identified and corrected.**
