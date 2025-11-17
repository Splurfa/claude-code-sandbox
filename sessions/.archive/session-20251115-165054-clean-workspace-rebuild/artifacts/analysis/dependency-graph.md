# Feature Dependency Graph

**Analysis Date:** 2025-11-15
**Workspace:** common-thread-sandbox

---

## Dependency Visualization

```
STOCK FOUNDATION
    │
    ├─→ .swarm/memory.db (F001) ✅ ACTIVE
    │       │
    │       ├─→ Session Backups (F002) ✅ ACTIVE
    │       │
    │       ├─→ Hooks System (F003) ✅ ACTIVE
    │       │       │
    │       │       ├─→ Auto-Hooks Wrapper (F004) ⚠️ READY
    │       │       │       │
    │       │       │       └─→ Settings.json (F017) ✅ ACTIVE
    │       │       │
    │       │       ├─→ Captain's Log (F012) ✅ ACTIVE
    │       │       │
    │       │       └─→ Git Checkpoints (F016) ⚠️ READY
    │       │
    │       ├─→ ReasoningBank Trajectory Collector (F005) ❌ INACTIVE
    │       │       │
    │       │       └─→ Verdict Judge (F006) ❌ INACTIVE
    │       │               │
    │       │               └─→ Memory Distiller (F007) ❌ INACTIVE
    │       │                       │
    │       │                       └─→ Learning Loop (F008) ❌ INACTIVE
    │       │
    │       └─→ Memory-AgentDB Bridge (F010) ❌ INACTIVE
    │               │
    │               └─→ .agentdb/reasoningbank.db (F009) ❌ INACTIVE
    │                       │
    │                       └─→ AgentDB Wrapper (F011) ❌ INACTIVE
    │
    └─→ INDEPENDENT FEATURES
            │
            ├─→ Session Management (F013) ✅ ACTIVE
            │       │
            │       ├─→ Session Auto-Init (F014) ⚠️ READY
            │       │
            │       └─→ File Routing (F015) ✅ ACTIVE
            │
            ├─→ Skills System (F018) ✅ ACTIVE
            │
            ├─→ Agent Patterns (F019) ✅ ACTIVE
            │
            └─→ Inbox System (F020) ✅ ACTIVE
```

---

## Dependency Chains

### Chain 1: Learning Pipeline (INACTIVE)

```
memory.db → trajectory-collector → verdict-judge → memory-distiller → learning-loop
  (F001)         (F005)                (F006)           (F007)          (F008)
    ✅              ❌                     ❌                ❌              ❌
```

**Status:** Foundation active, entire pipeline inactive
**Blocker:** No trajectories being collected
**Risk:** 985 lines of unused code

### Chain 2: AgentDB Integration (INACTIVE)

```
memory.db → memory-agentdb-bridge → .agentdb/ → agentdb-wrapper
  (F001)          (F010)              (F009)        (F011)
    ✅               ❌                   ❌            ❌
```

**Status:** Foundation active, integration inactive
**Blocker:** Bridge not activated, no episodes synced
**Risk:** 650 lines of unused code

### Chain 3: Auto-Hooks (READY)

```
hooks-system → auto-hooks.js → settings.json
   (F003)         (F004)          (F017)
     ✅             ⚠️              ✅
```

**Status:** All components ready, optional activation
**Blocker:** Requires opt-in via code import
**Risk:** Low, thin wrapper pattern

### Chain 4: Session Management (ACTIVE)

```
session-management → session-auto-init → file-routing
      (F013)             (F014)            (F015)
        ✅                 ⚠️                ✅
```

**Status:** Core active, auto-init ready but not integrated
**Blocker:** Manual session creation still used
**Risk:** Low, working system

### Chain 5: Journaling (ACTIVE)

```
hooks-system → journal-hook → captain's-log
   (F003)         (concept)       (F012)
     ✅             stock           ✅
```

**Status:** Fully active, stock hook implemented
**Blocker:** None
**Risk:** None

---

## Critical Dependencies

### 1. Memory Database (F001)

**Dependents:** 10 features
**Status:** ✅ Active
**Impact if removed:** Catastrophic - entire system fails
**Migration:** Cannot remove, stock foundation

### 2. Hooks System (F003)

**Dependents:** 5 features
**Status:** ✅ Active
**Impact if removed:** High - automation stops
**Migration:** Cannot remove, stock foundation

### 3. Session Management (F013)

**Dependents:** 2 features
**Status:** ✅ Active
**Impact if removed:** Medium - lose organization
**Migration:** Can migrate to stock .swarm/ only

---

## Circular Dependencies

**None detected.** All dependencies are acyclic.

---

## Unused Dependencies

### 1. ReasoningBank Scripts (F005-F008)

**Dependencies satisfied:** ✅ (memory.db exists)
**Status:** ❌ Inactive
**Reason:** No data collection happening
**Action:** Activate or remove

### 2. AgentDB Integration (F009-F011)

**Dependencies satisfied:** ✅ (memory.db + agentdb installed)
**Status:** ❌ Inactive
**Reason:** Bridge not activated
**Action:** Activate or remove

---

## External Dependencies

### NPM Packages

```
sqlite3 ────→ F001 (memory.db access)
              F005-F008 (ReasoningBank)
              F010-F011 (AgentDB bridge)

claude-flow@alpha ────→ F003 (hooks system)
                        F004 (auto-hooks)
                        F017 (settings.json)

agentdb@latest ────→ F009 (.agentdb/)
                     F010-F011 (bridge/wrapper)
```

### CLI Tools

```
jq ────→ F017 (settings.json hook piping)

git ────→ F016 (checkpoint system)

npx ────→ All stock CLI invocations
```

---

## Dependency Risks

| Risk | Severity | Impact | Mitigation |
|------|----------|--------|-----------|
| **sqlite3 version mismatch** | Low | Memory access fails | Pin version in package.json |
| **claude-flow breaking changes** | Medium | Hooks fail | Test after updates, version pin |
| **agentdb deprecation** | Low | AgentDB fails | Already inactive, remove if deprecated |
| **jq missing** | Low | Settings hooks fail | Check in CI, document requirement |
| **git missing** | Low | Checkpoints fail | Graceful degradation, warn user |

---

## Skill Conversion Dependencies

### High Priority (Core Workflows)

**session-management skill** (needs creation)
- Depends on: Nothing (standalone)
- Enables: F013, F014, F015
- Risk: Low, clear separation

**captains-log skill** (needs creation)
- Depends on: Stock journal hook
- Enables: F012
- Risk: Low, stock hook already exists

**hooks-automation skill** (already exists)
- Depends on: Stock hooks system
- Enables: F004
- Risk: Low, thin wrapper

### Medium Priority (Learning Features)

**reasoningbank-intelligence skill** (already exists)
- Depends on: Stock task_trajectories table
- Enables: F005-F008
- Risk: Medium, inactive code

**reasoningbank-agentdb skill** (already exists)
- Depends on: AgentDB installation
- Enables: F009-F011
- Risk: Low, optional feature

### Low Priority (Optional Features)

**git-checkpoint-automation skill** (needs creation)
- Depends on: Git installation
- Enables: F016
- Risk: Low, optional feature

**inbox-management skill** (needs creation)
- Depends on: Nothing (file system only)
- Enables: F020
- Risk: Low, simple workflow

---

## Migration Impact Analysis

### If Converting to Pure Stock

**Dependencies lost:**
1. Session artifact organization (F013-F015)
2. Captain's Log (F012)
3. Auto-hooks (F004)
4. Git checkpoints (F016)
5. ReasoningBank scripts (F005-F008)
6. AgentDB integration (F009-F011)

**Dependencies retained:**
1. Memory database (F001) ✅
2. Session backups (F002) ✅
3. Hooks system (F003) ✅
4. Skills structure (F018) ✅

**Effort:** Medium (3-5 hours to migrate sessions to .swarm/ backups)

### If Converting to Skill-Based

**Dependencies simplified:**
- Each feature becomes standalone skill
- Clearer separation of concerns
- Easier activation/deactivation
- Better portability

**Effort:** High (10-15 hours to convert all features)

---

## Recommended Dependency Actions

### Immediate (Week 1)

1. **Activate or Remove ReasoningBank** (F005-F008)
   - If keep: Integrate trajectory collection into workflow
   - If remove: Delete 985 lines of unused code

2. **Activate or Remove AgentDB** (F009-F011)
   - If keep: Activate memory-agentdb-bridge
   - If remove: Delete 650 lines + .agentdb/ directory

3. **Document Settings.json Dependencies**
   - List required CLI tools (jq, git, npx)
   - Add installation checks
   - Provide fallback behavior

### Short-term (Month 1)

4. **Convert to Skills** (F012-F016)
   - Session management → skill
   - Captain's Log → skill
   - Git checkpoints → skill

5. **Add Dependency Tests**
   - Check NPM package versions
   - Verify CLI tool availability
   - Test stock hook invocations

6. **Run Stock Init**
   - Create missing .claude-flow/ and .hive-mind/
   - Maintain custom features alongside stock

### Long-term (Quarter 1)

7. **Contribute Upstream**
   - Submit session management as PR to claude-flow
   - Submit Captain's Log as example implementation
   - Share skill patterns with community

8. **Automate Testing**
   - CI for custom scripts
   - Integration tests for hooks
   - Dependency version checks

---

## Summary

**Total Dependencies Mapped:** 20 features, 47 dependency relationships
**Critical Dependencies:** 2 (memory.db, hooks system)
**Inactive Chains:** 2 (ReasoningBank, AgentDB)
**Circular Dependencies:** 0
**External Dependencies:** 5 (3 NPM, 2 CLI)

**Key Insight:** Most custom features are **independent** or depend only on stock foundation. This is GOOD for migration - features can be converted to skills one-by-one without breaking others.

**Recommended Path:** Skill conversion > Activation decision > Cleanup unused code

---

**Dependency Analysis Complete**
