# Stock vs Custom Claude-Flow: Decision Guide

**For:** Workspace architects, developers, and teams evaluating claude-flow setups
**Last Updated:** 2025-11-15

---

## Quick Decision Tree

```
Are you starting a new project?
├─ YES → Do you need session artifact organization?
│   ├─ YES → Consider Claude-Flow+ (this workspace)
│   └─ NO → Use Stock Claude-Flow
└─ NO (existing project) → Are you using stock claude-flow now?
    ├─ YES → Happy with it?
    │   ├─ YES → Stay stock
    │   └─ NO → Identify gaps → Evaluate Claude-Flow+ features
    └─ NO (custom setup) → Compare to both → Choose best fit
```

---

## The Two Options

### Stock Claude-Flow

**What it is:** Official claude-flow implementation from ruvnet/claude-flow

**Initialization:**
```bash
npx claude-flow@alpha init
```

**What you get:**
- ✅ Official support and documentation
- ✅ Automatic updates
- ✅ Simple, proven structure
- ✅ Full compatibility guarantee
- ✅ Minimal maintenance

**What you don't get:**
- ❌ Session artifact organization
- ❌ File routing system
- ❌ Captain's Log journaling
- ❌ Git auto-checkpoints
- ❌ ReasoningBank learning pipeline
- ❌ AgentDB vector integration

**Best for:**
- New users
- Simple projects
- Teams wanting official support
- Those prioritizing simplicity
- Collaborative environments

---

### Claude-Flow+ (This Workspace)

**What it is:** Custom extended implementation with 97.5% stock-first execution

**Initialization:**
```bash
# Manual setup + custom scripts
# See WORKSPACE-GUIDE.md for details
```

**What you get:**
- ✅ All stock claude-flow features
- ✅ Session artifact organization
- ✅ File routing enforcement
- ✅ Captain's Log journaling
- ✅ Git auto-checkpoints
- ✅ ReasoningBank learning pipeline (ready)
- ✅ AgentDB vector integration (ready)
- ✅ Comprehensive documentation

**What you don't get:**
- ❌ Official support (community-maintained)
- ❌ Automatic updates (may require manual adaptation)
- ❌ Simple structure (more complex)
- ❌ Stock portability (custom features)

**Best for:**
- Power users
- Complex projects
- Those needing session organization
- Teams willing to maintain custom features
- Solo developers with specific workflows

---

## Detailed Comparison

### 1. Setup & Maintenance

| Aspect | Stock | Claude-Flow+ | Winner |
|--------|-------|--------------|--------|
| **Initial Setup** | 5 minutes | 30+ minutes | Stock |
| **Learning Curve** | Low | Medium-High | Stock |
| **Maintenance** | Low (auto-updates) | Medium (manual adaptation) | Stock |
| **Documentation** | Official wiki | Custom docs | Stock |
| **Community Support** | Large | Small | Stock |

**Winner: Stock** - Much easier to get started and maintain

---

### 2. Features & Capabilities

| Feature | Stock | Claude-Flow+ | Winner |
|---------|-------|--------------|--------|
| **Memory Storage** | ✅ 34K+ entries | ✅ 34K+ entries | Tie |
| **Pattern Learning** | ✅ 77 patterns | ✅ 77 patterns | Tie |
| **Session Management** | Basic (.swarm/) | Advanced (sessions/) | Claude-Flow+ |
| **File Organization** | Manual | Enforced routing | Claude-Flow+ |
| **Journaling** | No implementation | Captain's Log | Claude-Flow+ |
| **Learning Pipeline** | Schema only | Full pipeline | Claude-Flow+ |
| **Vector Search** | No | AgentDB | Claude-Flow+ |
| **Git Integration** | No | Auto-checkpoints | Claude-Flow+ |

**Winner: Claude-Flow+** - Significantly more features

---

### 3. Workflow & Productivity

| Aspect | Stock | Claude-Flow+ | Winner |
|--------|-------|--------------|--------|
| **Session Organization** | Manual | Automatic | Claude-Flow+ |
| **File Routing** | Manual paths | Auto-routed | Claude-Flow+ |
| **Decision Tracking** | Manual | Captain's Log | Claude-Flow+ |
| **Rollback** | Manual git | Tagged checkpoints | Claude-Flow+ |
| **Learning** | Automatic patterns | Patterns + trajectories | Claude-Flow+ |
| **Setup Time** | Fast | Slow | Stock |

**Winner: Claude-Flow+** - Better for long-term productivity (after setup)

---

### 4. Compatibility & Portability

| Aspect | Stock | Claude-Flow+ | Winner |
|--------|-------|--------------|--------|
| **Stock Commands** | 100% | 70%+ | Stock |
| **Documentation Match** | 100% | 0% | Stock |
| **Portability** | High | Low | Stock |
| **Team Collaboration** | Easy | Requires training | Stock |
| **Future-Proof** | High | Medium | Stock |

**Winner: Stock** - Much better compatibility

---

### 5. Cost-Benefit Analysis

#### Stock Claude-Flow

**Costs:**
- ⏱️ 5 minutes setup
- 📚 1 hour learning official docs
- 🔧 ~1 hour/month maintenance (updates)

**Benefits:**
- ✅ Official support
- ✅ Community resources
- ✅ Simple structure
- ✅ Auto-updates

**Total Time Investment:** ~15 hours/year
**Complexity:** Low
**Risk:** Low

#### Claude-Flow+

**Costs:**
- ⏱️ 30 minutes setup
- 📚 3 hours learning custom features
- 🔧 ~3 hours/month maintenance (adapt to updates)
- 📖 Ongoing documentation maintenance

**Benefits:**
- ✅ All stock features
- ✅ Session organization
- ✅ File routing
- ✅ Captain's Log
- ✅ Git checkpoints
- ✅ Learning pipeline
- ✅ Vector search

**Total Time Investment:** ~40 hours/year
**Complexity:** Medium-High
**Risk:** Medium

---

## Use Case Analysis

### ✅ Use Stock Claude-Flow If...

**Your Project:**
- Is small to medium size
- Doesn't need complex artifact organization
- Has multiple collaborators
- Requires minimal maintenance
- Values simplicity over features

**Your Team:**
- Prefers official documentation
- Wants easy onboarding
- Has limited claude-flow experience
- Prioritizes stability over innovation

**Your Workflow:**
- Doesn't need structured sessions
- Manual file organization is fine
- You don't need git auto-checkpointing
- No need for vector search or learning pipelines

**Examples:**
- Small web app development
- API prototyping
- Learning claude-flow
- Team collaboration projects
- Simple automation tasks

---

### ✅ Use Claude-Flow+ If...

**Your Project:**
- Is large and complex
- Needs structured artifact management
- Has many sessions or iterations
- Requires extensive documentation
- Benefits from learning pipelines

**Your Team:**
- Solo developer or small team
- Experienced with claude-flow
- Willing to maintain custom features
- Values organization and structure
- Comfortable with custom setups

**Your Workflow:**
- Multiple sessions with artifact tracking
- Need file routing enforcement
- Want decision journaling (Captain's Log)
- Need git rollback capabilities
- Want vector search for past experiences

**Examples:**
- Large-scale application development
- Research projects with many experiments
- Consulting work with multiple clients
- Documentation-heavy projects
- Machine learning experimentation

---

## Migration Paths

### Stock → Claude-Flow+

**When to Migrate:**
- Stock structure feels too loose
- You need session artifact organization
- Manual file management is time-consuming
- You want learning from past sessions

**How to Migrate:**
1. Backup current workspace
2. Copy `.claude/` directory structure from this workspace
3. Run session init scripts
4. Update CLAUDE.md with custom protocols
5. Optional: Install AgentDB, enable auto-hooks

**Time:** 2-4 hours
**Risk:** Low (can always revert)
**Benefit:** Structured organization, learning capabilities

---

### Claude-Flow+ → Stock

**When to Migrate:**
- Custom features unused
- Maintenance burden too high
- Team needs simpler setup
- Want official support

**How to Migrate:**
1. Backup workspace completely
2. Run `npx claude-flow@alpha init --force`
3. Migrate `.swarm/memory.db` (compatible)
4. Manually organize files (no routing)
5. Remove custom directories

**Time:** 1-2 hours
**Risk:** Medium (lose custom features)
**Benefit:** Simplicity, official support, easy updates

---

## Hybrid Approach (Recommended)

**Best of both worlds:**

1. **Start with stock:**
```bash
npx claude-flow@alpha init
```

2. **Add custom features selectively:**
```bash
# Add session management only
cp -r <this-workspace>/.claude/session .claude/
bash .claude/session/auto-init.sh "project"

# Add Captain's Log only
cp <this-workspace>/.claude/hooks/journal.sh .claude/hooks/
bash .claude/hooks/journal.sh "First entry" "setup"

# Add git checkpoints only
cp <this-workspace>/.claude/helpers/standard-checkpoint-hooks.sh .claude/helpers/
```

3. **Document what's stock vs custom:**
```bash
echo "Stock + session management" > ARCHITECTURE.md
```

**Benefits:**
- ✅ Stock foundation
- ✅ Custom features you actually need
- ✅ Clear documentation
- ✅ Easy to explain to others

---

## Real-World Scenarios

### Scenario 1: Solo Developer Building SaaS

**Profile:**
- Solo founder
- Building complex web app
- Multiple features/iterations
- Need to track decisions

**Recommendation:** **Claude-Flow+**

**Why:**
- Session organization valuable for feature tracking
- Captain's Log for decision journaling
- Git checkpoints for easy rollback
- Learning pipeline for pattern extraction
- Solo means no collaboration overhead

---

### Scenario 2: Team of 5 Building API

**Profile:**
- Team collaboration required
- Simple REST API
- Need consistency
- Limited claude-flow experience

**Recommendation:** **Stock Claude-Flow**

**Why:**
- Easy onboarding for team
- Official documentation to share
- No custom features to explain
- Simple structure everyone understands
- Minimal maintenance

---

### Scenario 3: Research Lab Experimenting

**Profile:**
- Multiple experiments
- Need to track outcomes
- Solo researchers
- Complex workflows

**Recommendation:** **Claude-Flow+ with selective features**

**Why:**
- Session management for experiment tracking
- Captain's Log for research notes
- ReasoningBank for learning from experiments
- But skip features you don't need (e.g., file routing)

---

### Scenario 4: Startup Prototyping MVP

**Profile:**
- Speed is critical
- Simple product
- Small team
- Might pivot

**Recommendation:** **Stock Claude-Flow**

**Why:**
- Fast setup (5 minutes)
- No overhead
- Easy to hand off if needed
- Can always upgrade later

---

## Feature-by-Feature Decision

Choose stock or Claude-Flow+ based on which features you need:

| Feature | Stock | Claude-Flow+ | Keep Stock If... | Choose CF+ If... |
|---------|-------|--------------|------------------|------------------|
| **Session Organization** | Manual | Automatic | Happy with manual | Need structure |
| **File Routing** | Manual paths | Auto-routed | Comfortable with manual | Want enforcement |
| **Captain's Log** | No | Yes | Don't need journal | Want decision tracking |
| **Git Checkpoints** | Manual | Auto | Fine with manual git | Want rollback ease |
| **Learning Pipeline** | Patterns only | Full pipeline | Patterns enough | Need trajectory learning |
| **Vector Search** | No | AgentDB | Don't need semantic search | Want similarity matching |

---

## Long-Term Considerations

### Stock Claude-Flow: 5-Year Outlook

**Pros:**
- ✅ Official updates guaranteed
- ✅ Community will grow
- ✅ Documentation will improve
- ✅ New features added officially

**Cons:**
- ⚠️ May add complexity over time
- ⚠️ Breaking changes possible
- ⚠️ Your feature requests may not be prioritized

**Verdict:** Safest long-term bet for stability

---

### Claude-Flow+: 5-Year Outlook

**Pros:**
- ✅ Features you need today
- ✅ Can adapt as needed
- ✅ Full control

**Cons:**
- ⚠️ Maintenance burden
- ⚠️ Must adapt to stock changes
- ⚠️ No official support
- ⚠️ May diverge from stock

**Verdict:** Higher risk, higher reward

---

## Making the Decision

### Step 1: Assess Your Needs

**Answer these questions:**

1. How many people will use this setup?
   - 1-2: Can handle Claude-Flow+ complexity
   - 3+: Stock is safer for collaboration

2. How complex is your project?
   - Simple: Stock sufficient
   - Complex: Claude-Flow+ benefits increase

3. How much time can you invest in setup/maintenance?
   - Limited: Stock (5 min setup, 1 hr/month)
   - Flexible: Claude-Flow+ (30 min setup, 3 hr/month)

4. Do you need session artifact organization?
   - No: Stock
   - Yes: Claude-Flow+ or hybrid

5. Is official support important?
   - Yes: Stock
   - No: Either option

### Step 2: Calculate Your Score

**Stock Claude-Flow Points:**
- Team size 3+: +3 points
- Simple project: +2 points
- Limited time: +3 points
- Need official support: +2 points
- New to claude-flow: +2 points

**Claude-Flow+ Points:**
- Solo or small team: +3 points
- Complex project: +2 points
- Time for maintenance: +3 points
- Need session organization: +3 points
- Want learning capabilities: +2 points
- Experienced with claude-flow: +2 points

**Decision:**
- Stock > 8 points: Choose Stock
- CF+ > 8 points: Choose Claude-Flow+
- Tie or close: Choose Hybrid

### Step 3: Choose & Document

**If you choose Stock:**
```bash
npx claude-flow@alpha init
echo "# Stock Claude-Flow Setup" > ARCHITECTURE.md
echo "See: https://github.com/ruvnet/claude-flow" >> ARCHITECTURE.md
```

**If you choose Claude-Flow+:**
```bash
# Copy this workspace structure
echo "# Claude-Flow+ Setup" > ARCHITECTURE.md
echo "Stock-first with custom extensions" >> ARCHITECTURE.md
echo "See: WORKSPACE-ARCHITECTURE.md" >> ARCHITECTURE.md
```

**If you choose Hybrid:**
```bash
npx claude-flow@alpha init
echo "# Hybrid Setup: Stock + Custom" > ARCHITECTURE.md
echo "Stock foundation with selective features" >> ARCHITECTURE.md
# Add only features you need
```

---

## Summary: The Bottom Line

### Choose Stock Claude-Flow For:
- ✅ **Simplicity** - 5-minute setup, minimal maintenance
- ✅ **Collaboration** - Easy team onboarding
- ✅ **Stability** - Official support and updates
- ✅ **Learning** - Great for claude-flow beginners

### Choose Claude-Flow+ For:
- ✅ **Features** - Session org, file routing, Captain's Log, learning
- ✅ **Flexibility** - Full control and customization
- ✅ **Power** - Advanced capabilities for complex projects
- ✅ **Learning** - Trajectory analysis and vector search

### Choose Hybrid For:
- ✅ **Balance** - Stock foundation + selective features
- ✅ **Safety** - Easy to migrate in either direction
- ✅ **Clarity** - Clear separation of stock vs custom
- ✅ **Pragmatism** - Use only what you need

---

## Final Recommendation

**For 80% of users: Start with Stock Claude-Flow**
- Simple, proven, supported
- Can always upgrade to Claude-Flow+ later
- Minimal risk

**For 15% of users: Start with Hybrid**
- Add 1-2 custom features you really need
- Keep stock foundation
- Document clearly

**For 5% of users: Start with Claude-Flow+**
- Power users with complex needs
- Willing to maintain custom features
- Need full feature set from day 1

---

## Resources

**Stock Claude-Flow:**
- Repository: https://github.com/ruvnet/claude-flow
- Documentation: https://github.com/ruvnet/claude-flow/wiki
- Issues: https://github.com/ruvnet/claude-flow/issues

**Claude-Flow+ (This Workspace):**
- Architecture: [WORKSPACE-ARCHITECTURE.md](../WORKSPACE-ARCHITECTURE.md)
- Feature Guide: [WORKSPACE-GUIDE.md](../WORKSPACE-GUIDE.md)
- Compliance Report: [compliance-report.md](compliance-report.md)
- Stock Comparison: [stock-vs-custom-comparison.md](stock-vs-custom-comparison.md)

---

**Last Updated:** 2025-11-15
**Version:** 1.0
**Maintainer:** Claude Code Compliance Analysis
