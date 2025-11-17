# Migration Risk Assessment

**Analysis Date:** 2025-11-15
**Workspace:** common-thread-sandbox
**Migration Target:** Stock-first skill-based architecture

---

## Executive Summary

**Overall Risk Level:** **MEDIUM** 🟡

**Key Risks:**
- 1,635 lines of inactive code (dead weight)
- Missing stock directories may cause compatibility issues
- Custom session structure not portable to other workspaces
- No automated tests for 2,200+ lines of custom code

**Recommended Approach:** **Gradual skill conversion** with parallel stock init

**Estimated Effort:** 20-30 hours (over 2-4 weeks)

---

## Risk Matrix

| Risk Category | Severity | Likelihood | Impact | Mitigation |
|--------------|----------|------------|--------|-----------|
| **Data Loss** | High | Low | Critical | Backup before migration |
| **Feature Loss** | Medium | Medium | High | Incremental conversion |
| **Compatibility Break** | Medium | Medium | Medium | Test after each step |
| **Code Deletion** | Low | High | Medium | Git checkpoints |
| **Performance Degradation** | Low | Low | Low | Benchmark before/after |
| **User Workflow Disruption** | Medium | High | High | Parallel operation period |

---

## Risk Categories

### 1. Data Loss Risks 🔴 HIGH SEVERITY

#### R001: Memory Database Corruption

**Risk:** Migrating or modifying .swarm/memory.db could corrupt 32K+ entries

**Likelihood:** Low (SQLite is robust)
**Impact:** Critical (all learning lost)

**Mitigation:**
- ✅ Backup memory.db before ANY changes
- ✅ Use SQLite's backup command, not cp
- ✅ Verify backup integrity
- ✅ Test migration on copy first

**Recovery Plan:**
```bash
# Before migration
sqlite3 .swarm/memory.db ".backup .swarm/memory.db.backup"
sqlite3 .swarm/memory.db.backup ".schema" # Verify
```

#### R002: Session Artifacts Loss

**Risk:** Deleting sessions/ directory loses 5.8MB of work

**Likelihood:** Low (if following procedure)
**Impact:** High (months of session work)

**Mitigation:**
- ✅ Archive sessions/ before conversion
- ✅ Create tarball with timestamp
- ✅ Verify archive integrity
- ✅ Keep for 90 days minimum

**Recovery Plan:**
```bash
# Before migration
tar -czf sessions-backup-$(date +%Y%m%d).tar.gz sessions/
tar -tzf sessions-backup-*.tar.gz | head # Verify
```

#### R003: Captain's Log Loss

**Risk:** Losing daily journals (3 files, decision history)

**Likelihood:** Low
**Impact:** Medium (historical context lost, but not code)

**Mitigation:**
- ✅ Copy captains-log/ to safe location
- ✅ Export to PDF/markdown archive
- ✅ Include in session backups

---

### 2. Feature Loss Risks 🟡 MEDIUM SEVERITY

#### R004: Session Organization Lost

**Risk:** Reverting to stock loses structured artifact organization

**Likelihood:** High (if going pure stock)
**Impact:** Medium (can manually organize, but time-consuming)

**Mitigation:**
- ✅ Convert to skill BEFORE removing
- ✅ Document manual organization process
- ✅ Keep as parallel workflow initially

**Alternative:** Maintain sessions/ alongside stock .swarm/

#### R005: Auto-Hooks Lost

**Risk:** Removing auto-hooks.js loses automatic coordination

**Likelihood:** Medium
**Impact:** Low (can manually call hooks)

**Mitigation:**
- ✅ Convert to skill
- ✅ Make activation opt-in
- ✅ Document manual hook invocation

#### R006: ReasoningBank Pipeline Lost

**Risk:** Deleting inactive ReasoningBank loses learning capability

**Likelihood:** Medium (currently unused)
**Impact:** Medium (future learning potential lost)

**Mitigation:**
- ✅ Convert to skill first
- ✅ Test activation before committing
- ✅ Document setup process

**Decision Point:** Keep or delete? (985 lines)

---

### 3. Compatibility Risks 🟡 MEDIUM SEVERITY

#### R007: Stock Commands May Fail

**Risk:** Missing .claude-flow/ and .hive-mind/ breaks stock hive commands

**Likelihood:** High
**Impact:** Medium (some workflows broken)

**Mitigation:**
- ✅ Run `npx claude-flow@alpha hive init` immediately
- ✅ Test stock commands post-init
- ✅ Document which commands require stock dirs

**Test Plan:**
```bash
# After running hive init
npx claude-flow@alpha hive status  # Should work
npx claude-flow@alpha hive "test task"  # Should work
```

#### R008: MCP Tool Signature Changes

**Risk:** Stock updates change MCP tool parameters

**Likelihood:** Low (semver protected)
**Impact:** Medium (scripts break)

**Mitigation:**
- ✅ Pin claude-flow version initially
- ✅ Test before updating
- ✅ Subscribe to changelog

#### R009: Skill YAML Format Changes

**Risk:** Stock changes YAML frontmatter requirements

**Likelihood:** Low
**Impact:** Low (28 skills need updates)

**Mitigation:**
- ✅ All skills currently compliant
- ✅ Monitor upstream changes
- ✅ Automated YAML validation

---

### 4. Code Quality Risks ⚠️ MEDIUM SEVERITY

#### R010: Inactive Code Rot

**Risk:** 1,635 lines of unused code becomes unmaintainable

**Likelihood:** High (already happening)
**Impact:** Low (can delete without loss)

**Current State:**
- ReasoningBank: 985 lines, 0 trajectories
- AgentDB: 650 lines, 0 episodes

**Decision Required:**
- Activate within 30 days, OR
- Convert to skill, OR
- Delete entirely

**Recommended:** Convert to skills, test activation, then decide

#### R011: No Automated Tests

**Risk:** Changes break custom scripts without detection

**Likelihood:** Medium
**Impact:** Medium (manual testing required)

**Mitigation:**
- ✅ Add Jest tests for critical scripts
- ✅ CI/CD integration tests
- ✅ Pre-commit hook validation

**Priority:** High (before major changes)

#### R012: Settings.json Coupling

**Risk:** settings.json format is custom, may conflict with stock updates

**Likelihood:** Low
**Impact:** Medium (hooks break)

**Mitigation:**
- ✅ Document settings.json structure
- ✅ Test stock compatibility
- ✅ Provide migration path

---

### 5. User Workflow Risks 🟡 MEDIUM-HIGH SEVERITY

#### R013: Learning Curve

**Risk:** Users must learn new skill-based workflow

**Likelihood:** High
**Impact:** Medium (temporary productivity loss)

**Mitigation:**
- ✅ Comprehensive documentation
- ✅ Side-by-side examples (old vs new)
- ✅ Migration guide with screenshots
- ✅ Parallel operation period

**Timeline:** 2-4 weeks for full adoption

#### R014: CLAUDE.md Confusion

**Risk:** Stock vs custom features not clearly documented

**Likelihood:** High (already happening)
**Impact:** Medium (users misunderstand capabilities)

**Mitigation:**
- ✅ Separate CLAUDE.md into sections
- ✅ Clear "Stock" vs "Custom" labels
- ✅ Version-specific documentation

#### R015: Session Closeout Disruption

**Risk:** Existing session closeout workflow breaks during migration

**Likelihood:** Medium
**Impact:** High (sessions left open)

**Mitigation:**
- ✅ Close all sessions before migration
- ✅ Test closeout with new structure
- ✅ Provide rollback procedure

---

## Migration Phases & Risk Timeline

### Phase 1: Preparation (Week 1) - LOW RISK ✅

**Actions:**
1. Full workspace backup
2. Memory database export
3. Session archive
4. Run stock hive init
5. Document current state

**Risks:** Minimal (read-only operations)

### Phase 2: Stock Init (Week 2) - LOW-MEDIUM RISK ⚠️

**Actions:**
1. Run `npx claude-flow@alpha hive init --topology mesh`
2. Verify .claude-flow/ and .hive-mind/ created
3. Test stock commands
4. Parallel operation with custom features

**Risks:**
- R007: Stock commands may fail (mitigated by init)
- R013: User confusion (mitigated by documentation)

### Phase 3: Skill Conversion (Weeks 3-4) - MEDIUM RISK 🟡

**Actions:**
1. Convert session management to skill
2. Convert Captain's Log to skill
3. Convert auto-hooks to skill (already exists)
4. Test each skill independently

**Risks:**
- R004: Feature loss (mitigated by parallel operation)
- R011: No tests (mitigated by manual testing)
- R013: Learning curve (mitigated by docs)

### Phase 4: Cleanup (Week 5) - MEDIUM-HIGH RISK 🟠

**Actions:**
1. Decide on ReasoningBank (activate or delete)
2. Decide on AgentDB (activate or delete)
3. Remove duplicate code
4. Update CLAUDE.md

**Risks:**
- R006: Losing learning capability (mitigated by skill conversion first)
- R010: Deleting potentially useful code (mitigated by git history)

### Phase 5: Validation (Week 6) - LOW RISK ✅

**Actions:**
1. Full workflow testing
2. Performance benchmarking
3. User acceptance testing
4. Documentation review

**Risks:** Minimal (validation only)

---

## Critical Decision Points

### Decision 1: ReasoningBank Fate

**Options:**
1. **Activate** - Integrate trajectory collection into workflow
2. **Convert to Skill** - Make optional, document activation
3. **Delete** - Remove 985 lines of unused code

**Recommendation:** Convert to skill, test activation, decide in 30 days

**Risk if wrong choice:**
- Activate but don't use: Wasted effort
- Delete but need later: Re-implementation required
- Convert and abandon: Skill maintenance burden

### Decision 2: AgentDB Integration

**Options:**
1. **Activate** - Sync memory to vector DB
2. **Convert to Skill** - Make optional dependency
3. **Delete** - Remove 650 lines + .agentdb/

**Recommendation:** Convert to skill (already exists: reasoningbank-agentdb)

**Risk if wrong choice:**
- Keep but don't use: 650 lines of dead code
- Delete but need: Semantic search lost

### Decision 3: Session Structure

**Options:**
1. **Keep Custom** - Maintain sessions/ alongside stock
2. **Migrate to Stock** - Use .swarm/backups/ only
3. **Hybrid** - Skills for custom, stock for state

**Recommendation:** Hybrid approach (convert to session-management skill)

**Risk if wrong choice:**
- Keep custom: Non-portable to stock workspaces
- Full stock: Lose organization benefits
- Hybrid: Complexity in two systems

---

## Rollback Plan

### If Migration Fails

**Recovery Steps:**
1. Restore .swarm/memory.db from backup
2. Extract sessions/ from tarball
3. Revert CLAUDE.md to git checkpoint
4. Remove stock-created directories
5. Resume custom workflow

**Time to Rollback:** <30 minutes

**Data Loss:** None (if backups created)

### If Partial Migration

**Scenario:** Some features converted, others fail

**Options:**
1. Continue with converted features only
2. Rollback all changes
3. Pause and troubleshoot

**Recommendation:** Pause and troubleshoot (migration is incremental)

---

## Success Criteria

### Phase 1 Success (Preparation)

- ✅ Backups created and verified
- ✅ All data accounted for
- ✅ Documentation complete

### Phase 2 Success (Stock Init)

- ✅ .claude-flow/ directory exists
- ✅ .hive-mind/ directory exists
- ✅ Stock hive commands work
- ✅ Custom features still functional

### Phase 3 Success (Skill Conversion)

- ✅ 3+ core features converted to skills
- ✅ Each skill tested independently
- ✅ Documentation updated
- ✅ No regressions in existing workflow

### Phase 4 Success (Cleanup)

- ✅ Inactive code decision made
- ✅ <200 lines of dead code remain
- ✅ Stock-first score improved to 90/100

### Phase 5 Success (Validation)

- ✅ All workflows tested
- ✅ Performance maintained or improved
- ✅ User acceptance sign-off
- ✅ Documentation accurate

---

## Risk Monitoring

### Weekly Check-ins

**Metrics to Track:**
- Lines of inactive code
- Stock-first compliance percentage
- Number of features converted to skills
- Test coverage percentage
- User-reported issues

**Red Flags:**
- 🔴 Data corruption detected
- 🔴 Stock commands failing
- 🔴 User workflow blocked
- 🔴 Performance degradation >10%

**Response:** Pause migration, assess, rollback if needed

---

## Contingency Budget

### Time Contingency

**Planned:** 20-30 hours over 6 weeks
**Contingency:** +50% (10-15 hours) for issues
**Total:** 30-45 hours

### Rollback Contingency

**If needed:** 2-4 hours to restore backups
**Testing post-rollback:** 2-4 hours
**Total rollback cost:** 4-8 hours

---

## Final Risk Assessment

### Low Risk Features (Convert First)

1. Captain's Log (F012) - 55 lines, clear separation
2. Session Auto-Init (F014) - 67 lines, simple script
3. Git Checkpoints (F016) - 179 lines, optional feature

### Medium Risk Features (Convert Carefully)

4. Session Management (F013) - Core workflow, needs testing
5. Auto-Hooks (F004) - Integration with stock, 122 lines
6. File Routing (F015) - AI-enforced, behavioral change

### High Risk Features (Decide First)

7. ReasoningBank (F005-F008) - 985 lines, activate or delete
8. AgentDB (F009-F011) - 650 lines, optional but complex

---

## Recommendations

### Immediate Actions (Week 1)

1. ✅ Create comprehensive backups
2. ✅ Run stock hive init
3. ✅ Document current state
4. ✅ Add automated tests for critical scripts

### Short-term Actions (Month 1)

5. ✅ Convert 3 low-risk features to skills
6. ✅ Test stock compatibility
7. ✅ Update CLAUDE.md with clear stock vs custom labels
8. ✅ Decide on ReasoningBank and AgentDB

### Long-term Actions (Quarter 1)

9. ✅ Complete skill conversion for all features
10. ✅ Achieve 90/100 stock-first score
11. ✅ Contribute useful features upstream
12. ✅ Maintain <200 lines of custom infrastructure code

---

## Conclusion

**Migration is FEASIBLE** with proper planning and incremental approach.

**Biggest Risks:**
1. Data loss (mitigated by backups)
2. User workflow disruption (mitigated by parallel operation)
3. Inactive code decisions (mitigated by skill conversion first)

**Recommended Path:**
**Backup → Stock Init → Skill Conversion → Cleanup → Validation**

**Expected Outcome:**
- ✅ Stock-first compliance improved to 90/100
- ✅ All useful features preserved as skills
- ✅ Inactive code removed or activated
- ✅ Better portability and maintainability

**Risk Level After Migration:** **LOW** ✅

---

**Risk Assessment Complete**
**Analysis Confidence:** High (based on comprehensive code and dependency analysis)
**Recommended Approval:** Proceed with Phase 1 (Preparation)
