# Wizard Decision-Making Quick Reference Card

**⚡ Fast lookup for file confidence and classification**

---

## 🚦 Classification at a Glance

### 🟢 SAFE (Confidence: 85-100%)
**Reference directly without caveats**

✅ User configuration files
✅ Conceptual explanations (`docs/explanation/**`)
✅ Architecture documentation (`docs/internals/**`)
✅ Reference materials (`docs/reference/**`)
✅ Stable agent definitions

**Examples:**
- `CLAUDE.md` → **100%**
- `~/.claude/CLAUDE.md` → **100%**
- `WORKSPACE-ARCHITECTURE.md` → **95%**
- `docs/explanation/workspace-architecture.md` → **85%**
- `.mcp.json` → **100%**

---

### 🟡 CAUTIONARY (Confidence: 40-84%)
**Reference with verification warnings**

⚠️ Prescriptive tutorials (`docs/tutorials/**`)
⚠️ How-to guides with step-by-step procedures
⚠️ External agent research (`inbox/codex-agent/**`)
⚠️ Command/skill definitions with usage patterns
⚠️ Implementation code

**Confidence Ceilings:**
- Sequential tutorials → **55%**
- External research → **60%**
- Commands → **65%**
- Skills → **70%**
- How-to guides → **55%**

**Adaptation Required:** Extract principles, not procedures. Translate sequential to parallel.

---

### 🔴 EXCLUDE (Confidence: 0-39%)
**Do not reference in wizard context**

🚫 Session artifacts (`sessions/*/artifacts/**`)
🚫 Immutable backups (`.swarm/backups/**`)
🚫 Binary databases (`.swarm/memory.db*`)
🚫 Deprecated files (`.archive/**`)
🚫 Timestamped snapshots

---

## 🎯 Query Type Routing

### "What is...?" / "Why does...?" (Conceptual)

👉 **Use:**
- `docs/explanation/**` (85%)
- `docs/reference/**` (80%)
- `CLAUDE.md` (100%)
- Agent READMEs (80%)

🚫 **Avoid:**
- Session artifacts
- How-to guides
- Backups

---

### "How do I...?" (Procedural)

👉 **Use (with adaptation):**
- `CLAUDE.md` protocols (100% but translate to parallel)
- `docs/how-to/**` (55% - extract principles only)
- Feature verification checklist (80%)

⚠️ **Must Adapt:** Sequential → Parallel execution

🚫 **Avoid:**
- Step-by-step tutorials (too prescriptive)
- Session procedures

---

### "Can I...?" / "What tools...?" (Capability)

👉 **Use:**
- `.claude/agents/**` (80%)
- `.claude/commands/**` (65%)
- `.claude/skills/**` (70%)
- Hive-mind quick reference (80%)

🚫 **Avoid:**
- Implementation code
- External research (not authoritative)

---

### Error reports (Troubleshooting)

👉 **Use (with diagnosis):**
- Troubleshooting guide (75%)
- Integration testing guide (70%)
- Session artifacts IF debugging that session (40%)

⚠️ **Must Adapt:** Diagnose root cause, don't blindly follow steps

---

### Design / Structure (Architectural)

👉 **Use:**
- `WORKSPACE-ARCHITECTURE.md` (100%)
- `docs/explanation/workspace-architecture.md` (85%)
- `docs/internals/architecture-overview.md` (85%)
- Implementation architecture reference (80%)

🚫 **Avoid:**
- Implementation code (too granular)
- Session analyses

---

## ⚡ Critical Rules

### 1️⃣ User Config Supremacy
**CLAUDE.md overrides EVERYTHING** (100% confidence)

If doc says X but CLAUDE.md says Y → **Always follow CLAUDE.md**

---

### 2️⃣ Parallel Execution Mandate
**Translate sequential to parallel**

❌ Tutorial: "Do A, then B, then C"
✅ Wizard: [Single message] Do A, B, C in parallel

**Confidence:** Sequential tutorial = 55%, Wizard's parallel adaptation = 85%

---

### 3️⃣ Session Scope Awareness
**Wizard is cross-session by default**

- Session artifacts → **EXCLUDE** (unless user scopes to that session)
- Session summaries → **50% confidence** (if relevant)

---

### 4️⃣ READ-ONLY Respect
**NEVER recommend editing:**

- `.swarm/backups/**`
- `.swarm/memory.db*`
- `inbox/codex-agent/**`
- `inbox/cursor-agent/**`

**Confidence on permissions:** 100% (regardless of what docs say)

---

### 5️⃣ Prescriptiveness Adaptation
**Extract principles, not procedures**

Doc: "MUST run hook A, then B, then C"
Wizard understands: "Hooks A, B, C are important" (adapts execution)

**Ceiling:** 55% for rigid protocols

---

## 🎖️ Top 10 High-Value Files

| File | Confidence | Use For |
|------|------------|---------|
| **CLAUDE.md** | 100% | User config (supreme authority) |
| **~/.claude/CLAUDE.md** | 100% | Global preferences |
| **WORKSPACE-ARCHITECTURE.md** | 95% | Architecture overview |
| **docs/explanation/workspace-architecture.md** | 85% | Concepts |
| **docs/explanation/session-management.md** | 85% | Session concepts |
| **docs/explanation/file-routing.md** | 85% | Routing rules |
| **docs/reference/hive-mind-quick-reference.md** | 80% | Capabilities |
| **docs/reference/implementation-architecture.md** | 80% | Technical ref |
| **.mcp.json** | 100% | MCP config |
| **sessions/README.md** | 80% | Session protocol |

---

## 📉 Confidence Adjustments

### ⬆️ Boost Confidence When:
- **3+ sources agree** → +5% (max 95%)
- **Verified status** → +15% (max 95%)
- **User-authored** → 100%

### ⬇️ Reduce Confidence When:
- **Sources contradict** → min(confidence, 50%)
- **File age > 30 days** (if implementation) → ×0.9
- **High prescriptiveness** → cap at 55%
- **Session-specific** → cap at 25% (usually exclude)

---

## 🚨 Never Reference

- `.swarm/backups/**` (31 files)
- `sessions/*/artifacts/**` (~100+ files)
- `.swarm/memory.db*` (3 files)
- `.archive/**` (deprecated)
- `inbox/*/deprecated/**` (obsolete)

---

## 🧮 Quick Confidence Calculator

**Weighted Score = (P × 0.35) + (T × 0.25) + (U × 0.30) + (C × 0.10)**

Where:
- **P** = Prescriptiveness (0-100, lower is better)
- **T** = Temporal Stability (0-100, higher is better)
- **U** = User Authority (0-100, higher is better)
- **C** = Contextual Scope (0-100, higher is better)

### Classification:
- **≥ 70** → SAFE
- **40-69** → CAUTIONARY
- **< 40** → EXCLUDE

---

## 📊 Quick Stats

| Category | Files | Default | Notes |
|----------|-------|---------|-------|
| Configuration | 33 | 90% SAFE | User-authored |
| Agents | 77 | 80% SAFE | Stable personas |
| Commands | 81 | 65% CAUTIONARY | Usage prescriptive |
| Skills | 43 | 70% CAUTIONARY | Usage may vary |
| Docs (Explanation) | ~10 | 85% SAFE | Concepts |
| Docs (Reference) | ~7 | 80% SAFE | Info-oriented |
| Docs (Tutorials) | ~24 | 55% CAUTIONARY | Step-by-step |
| Docs (How-To) | ~4 | 55% CAUTIONARY | Procedures |
| Backups | 31 | 20% EXCLUDE | Immutable |
| External Research | 29 | 60% CAUTIONARY | Not authoritative |

---

## ✅ Wizard Self-Check

Before answering user query:

1. ✅ What query type? (Conceptual, Procedural, Capability, Troubleshooting, Architectural)
2. ✅ What sources match this query type?
3. ✅ What's the confidence for each source?
4. ✅ Do sources contradict? (Penalty!)
5. ✅ Do 3+ sources agree? (Boost!)
6. ✅ Is adaptation required? (Sequential → Parallel)
7. ✅ Am I respecting READ-ONLY zones?
8. ✅ Am I following user config supremacy?

---

**Version:** 1.0.0 | **Generated:** 2025-11-17 | **Basis:** Workspace Infrastructure Audit (360 files)
