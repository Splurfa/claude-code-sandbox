# AI Timescale Estimation - Quick Reference Card

**For AI Agents: Use This Before Estimating Any Multi-Step Task**

---

## ⚠️ The Common Mistake

**❌ Wrong Thinking:**
> "This task has 5 steps that take 2 hours each, so total = 10 hours."

**✅ Correct Thinking:**
> "This task has 5 independent steps. With 5 parallel agents, total = 2 hours + 15 minutes coordination."

---

## 🎯 Quick Decision Matrix

| Task Characteristic | Sequential | Parallel | Speedup |
|--------------------|-----------|----------|---------|
| Single file output | ✓ | ✗ | 1x |
| Multiple independent files | ✗ | ✓ | Nx |
| Code + Tests | ✗ | ✓ | 2-5x |
| Code + Tests + Docs | ✗ | ✓ | 3-8x |
| Multi-domain (FE+BE+DB) | ✗ | ✓ | 5-15x |
| Full stack + security + compliance | ✗ | ✓ | 10-50x |

---

## 🚀 Speedup Formula

```
Speedup = (Number of Parallel Agents) × (1 - Coordination Overhead)

Coordination Overhead:
- Mesh topology: ~10% (peer-to-peer)
- Hierarchical: ~15% (coordinator layer)
- Hybrid: ~20% (multiple topologies)
- Byzantine: ~25% (consensus validation)
```

**Example:**
- 6 independent tasks
- 6 parallel agents
- Mesh topology (10% overhead)
- Speedup = 6 × 0.9 = 5.4x

---

## 🧠 Meta-Cognitive Checklist

**Before estimating, ask:**

1. **Parallelization Test:**
   - [ ] Can tasks run simultaneously?
   - [ ] Are outputs independent?
   - [ ] Can agents coordinate via hooks/memory?

2. **Dependency Check:**
   - [ ] True dependency (output of A needed for B)?
   - [ ] Or just habitual sequencing?

3. **Topology Selection:**
   - [ ] Mesh (peer collaboration)?
   - [ ] Hierarchical (coordinated execution)?
   - [ ] Hybrid (complex workflows)?
   - [ ] Byzantine (critical validation)?

4. **Bias Check:**
   - [ ] Am I anchoring to human timelines?
   - [ ] Am I assuming serial execution?
   - [ ] Am I adding conservative buffers?

---

## 📊 Typical Speedups by Task Type

| Task Type | Sequential | Dream Hive | Speedup |
|-----------|-----------|------------|---------|
| Research (5 sources) | 2 hours | 15 min | 8x |
| Implementation (10 modules) | 5 days | 30 min | 240x |
| Testing (50 tests) | 3 days | 20 min | 216x |
| Security audit | 2 days | 15 min | 192x |
| Documentation | 2 days | 10 min | 288x |
| **Full production deployment** | **10-14 days** | **<1 hour** | **~336x** |

---

## 🎓 Common Pitfalls

### Pitfall #1: "Steps"
**Wrong:** "This has 5 steps, so 5 × time-per-step."
**Right:** "How many of these 'steps' are truly sequential?"

### Pitfall #2: "Dependencies"
**Wrong:** "Tests depend on code, so tests come after."
**Right:** "Tests can be written concurrently with TDD."

### Pitfall #3: "Human Constraints"
**Wrong:** "Meetings, context-switching, fatigue add 20% buffer."
**Right:** "AI agents have none of these constraints."

### Pitfall #4: "Conservative Anchoring"
**Wrong:** "Better to overestimate and finish early."
**Right:** "Accurate estimation builds calibrated confidence."

### Pitfall #5: "Sequential Framing"
**Wrong:** "First research, then implement, then test."
**Right:** "Spawn researcher + developer + tester simultaneously."

---

## ✅ Correct Estimation Pattern

**Step 1: Decompose into Work Streams**
```
Task: Build REST API with authentication
Work Streams:
  1. Backend implementation
  2. Database schema
  3. Authentication service
  4. Unit tests
  5. Integration tests
  6. API documentation
  7. Security audit
```

**Step 2: Identify Dependencies**
```
True Dependencies (sequential):
  - None (all can start immediately)

Parallelizable (concurrent):
  - All 7 work streams
```

**Step 3: Select Topology**
```
Hybrid:
  - Queen: Strategic coordination
  - Mesh: Developer ↔ Tester real-time feedback
  - Byzantine: Security + Compliance consensus
```

**Step 4: Calculate Time**
```
Critical Path: Backend implementation (40 min)
Coordination: 10 min setup + 5 min validation
Total: ~55 minutes

Sequential Would Be: 10-14 days
Speedup: 336x
```

**Step 5: Provide Estimate**
```
"Critical path: ~1 hour with Dream Hive coordination.
Spawning 7 parallel agents (Backend, Database, Auth, Tests, Integration, Docs, Security).
Using hybrid topology (Queen + mesh + Byzantine).
Expected speedup: ~336x vs. sequential."
```

---

## 🎯 Success Criteria

Your estimate is calibrated if:
- ✅ You identified parallelizable work streams
- ✅ You selected appropriate topology
- ✅ You calculated critical path (not sum of all paths)
- ✅ You accounted for coordination overhead
- ✅ You avoided anchoring to human timelines
- ✅ You expressed confidence in swarm capabilities

---

## 📚 Learn More

**Full Analysis:** `sessions/session-20251114-145540-adversarial-testing/artifacts/docs/ai-timescale-meta-analysis.md`

**Memory Key:** `dream-hive/meta-analysis/timescales`

**Captain's Log:** `sessions/captains-log/2025-11-14.md`

---

**Remember:** Human time ≠ AI time. Trust the swarm.

---

*Quick Reference Card - AI Meta-Analysis Specialist*
*Dream Hive Architecture*
*2025-11-14*
