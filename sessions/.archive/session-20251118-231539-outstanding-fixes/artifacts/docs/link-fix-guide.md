# Link Fix Guide - Documentation Restructure

**Context**: Documentation was restructured from learning-path to lifecycle-based organization.
**Impact**: 61 of 96 internal links (64%) are broken and need updating.

---

## File Structure Mapping

### Old Structure → New Structure

| Old Location | New Location | Files Affected |
|-------------|--------------|----------------|
| `docs/01-foundations/` | `docs/operate/` | 4 files (first-session, workspace-tour, basic-memory-usage) |
| `docs/01-foundations/what-is-claude-flow.md` | `docs/setup/what-is-claude-flow.md` | ✅ Already moved |
| `docs/02-essential-skills/` | `docs/operate/` + `docs/build/` | Spawning, memory, session, parallel |
| `docs/03-intermediate/` | `docs/coordinate/` | Topologies, consensus, workflows, queen |
| `docs/04-advanced/` | `docs/coordinate/` | Hive-mind, Byzantine, adaptive |
| `docs/04-advanced/reasoning-bank.md` | `docs/reference/reasoning-bank.md` | ✅ Already moved |
| `docs/essentials/` | `docs/operate/` + `docs/setup/` | Session, memory, troubleshooting |
| `docs/advanced/` | `docs/coordinate/` + `docs/build/` | Swarm coord, custom agents, extending |
| `docs/reality/` | `docs/reference/` | Architecture, limitations, what-works |
| `docs/explanation/` | `docs/reference/` + `docs/operate/` | Various explanatory docs |

---

## Critical Files Needing Updates

### Priority 1: High-Traffic Files

#### 1. `docs/setup/orientation.md` (19 broken links)
**Status**: This file still references the old learning path structure.
**Fix Strategy**: Complete rewrite to use new structure or deprecate in favor of README.md

**Broken Links:**
- All Phase 1-4 links (01-foundations/, 02-essential-skills/, 03-intermediate/, 04-advanced/)
- Troubleshooting guide path
- Progress tracker reference

**Recommended Changes:**
```markdown
# OLD
[What is Claude-Flow?](01-foundations/what-is-claude-flow.md)

# NEW
[What is Claude-Flow?](what-is-claude-flow.md)
# (Already in same directory: setup/)

# OLD
[Spawning Agents](02-essential-skills/spawning-agents.md)

# NEW
[Spawning Agents](../build/spawning-agents.md)

# OLD
[Swarm Topologies](03-intermediate/swarm-topologies.md)

# NEW
[Swarm Topologies](../coordinate/swarm-topologies.md)

# OLD
[Hive-Mind Coordination](04-advanced/hive-mind-coordination.md)

# NEW
[Hive-Mind Coordination](../coordinate/hive-mind.md)
```

#### 2. `docs/operate/troubleshooting.md` (16 broken links)
**Status**: References non-existent explanation/ and reality/ directories
**Fix Strategy**: Update to reference/ directory

**Pattern Replacements:**
```markdown
# OLD
[File Routing Explained](../../explanation/file-routing.md)

# NEW
[File Routing](../setup/quick-start.md#file-routing-rules)
# OR create: docs/reference/file-routing.md

# OLD
[Workspace Architecture](../../explanation/workspace-architecture.md)

# NEW
[Architecture](../reference/architecture.md)

# OLD
[Hooks System Architecture](../.claude/hooks/README.md)

# NEW
../../.claude/hooks/README.md
# (Fix path - should go up from docs/operate/)
```

#### 3. `docs/coordinate/swarm-coordination.md` (8 broken links)
**Status**: References old essentials/ directory and missing files
**Fix Strategy**: Update to operate/ and build/ directories

**Pattern Replacements:**
```markdown
# OLD
[Quick Start](../essentials/quick-start.md)

# NEW
[Quick Start](../setup/quick-start.md)

# OLD
[Agent Spawning](../essentials/agent-spawning.md)

# NEW
[Spawning Agents](../build/spawning-agents.md)

# OLD
[Memory Coordination](../essentials/memory-coordination.md)

# NEW
[Memory Coordination Tutorial](../operate/memory-coordination-tutorial.md)

# OLD
[Architecture Guide](../reality/architecture.md)

# NEW
[Architecture](../reference/architecture.md)

# OLD
[Extending the System](extending-system.md)

# NEW
[Extending System](../build/extending-system.md)

# OLD
[Custom Agents](custom-agents.md)

# NEW
[Custom Agents](../build/custom-agents.md)
```

---

## Systematic Fix Process

### Step 1: Create Missing Reference Files

Several referenced files don't exist. Options:
1. Create stub files with redirect notices
2. Update links to point to existing alternatives
3. Remove references if content is obsolete

**Files to Create or Redirect:**

1. `docs/operate/memory-coordination.md`
   - **Status**: Link exists, tutorial exists (`memory-coordination-tutorial.md`)
   - **Fix**: Either rename tutorial OR create simple wrapper that links to tutorial

2. `docs/setup/workspace-tour.md`
   - **Status**: Content exists in `docs/operate/workspace-tour.md`
   - **Fix**: Update links to `../operate/workspace-tour.md`

3. `docs/reference/reasoning-bank.md`
   - **Status**: File exists! Just broken link in adaptive-topology.md
   - **Fix**: Update link from `reasoning-bank.md` to `../reference/reasoning-bank.md`

### Step 2: Bulk Replace Patterns

#### Pattern 1: Old Learning Path References
```bash
# In all .md files, replace old phase directories with new structure:
01-foundations/what-is-claude-flow.md → ../setup/what-is-claude-flow.md
01-foundations/workspace-tour.md → ../operate/workspace-tour.md
01-foundations/first-session.md → ../operate/first-session.md
01-foundations/basic-memory-usage.md → ../operate/basic-memory-usage.md

02-essential-skills/spawning-agents.md → ../build/spawning-agents-tutorial.md
02-essential-skills/parallel-execution.md → ../operate/parallel-execution.md
02-essential-skills/memory-coordination.md → ../operate/memory-coordination-tutorial.md
02-essential-skills/session-management.md → ../operate/session-management-tutorial.md

03-intermediate/swarm-topologies.md → ../coordinate/swarm-topologies.md
03-intermediate/queen-selection.md → ../coordinate/queen-selection.md
03-intermediate/consensus-mechanisms.md → ../coordinate/consensus-mechanisms.md
03-intermediate/custom-workflows.md → ../coordinate/custom-workflows.md

04-advanced/hive-mind-coordination.md → ../coordinate/hive-mind.md
04-advanced/byzantine-consensus.md → ../coordinate/byzantine-consensus.md
04-advanced/adaptive-topology.md → ../coordinate/adaptive-topology.md
04-advanced/reasoning-bank.md → ../reference/reasoning-bank.md
```

#### Pattern 2: Deprecated Directory References
```bash
# Replace deprecated directory references:
../essentials/quick-start.md → ../setup/quick-start.md
../essentials/session-management.md → ../operate/session-management.md
../essentials/troubleshooting.md → ../operate/troubleshooting.md
../essentials/memory-coordination.md → ../operate/memory-coordination-tutorial.md
../essentials/agent-spawning.md → ../build/spawning-agents.md

../advanced/swarm-coordination.md → ../coordinate/swarm-coordination.md
../advanced/custom-agents.md → ../build/custom-agents.md
../advanced/extending-system.md → ../build/extending-system.md
../advanced/performance-tuning.md → ../coordinate/performance-tuning.md

../reality/architecture.md → ../reference/architecture.md
../reality/what-actually-works.md → ../reference/what-actually-works.md
../reality/limitations.md → ../reference/limitations.md

../../explanation/file-routing.md → ../reference/file-routing.md (or remove)
../../explanation/session-management.md → ../operate/session-management.md
../../explanation/workspace-architecture.md → ../reference/architecture.md
```

#### Pattern 3: Cross-Directory References
```bash
# From build/ directory:
swarm-coordination.md → ../coordinate/swarm-coordination.md
performance-tuning.md → ../coordinate/performance-tuning.md
session-management.md → ../operate/session-management.md
memory-coordination.md → ../operate/memory-coordination-tutorial.md
troubleshooting.md → ../operate/troubleshooting.md
parallel-execution.md → ../operate/parallel-execution.md

# From coordinate/ directory:
custom-agents.md → ../build/custom-agents.md
extending-system.md → ../build/extending-system.md
```

### Step 3: Fix Hooks System References

**Issue**: Links to `.claude/hooks/README.md` use incorrect relative paths from docs/

**Current (Broken):**
```markdown
[Hooks System](../.claude/hooks/README.md)              # From docs/operate/
[Migration Guide](../../../../.claude/hooks/README.md)   # Wrong - goes to /Users/.claude/
```

**Fixed:**
```markdown
[Hooks System](../../.claude/hooks/README.md)           # From docs/operate/
[Hooks System](../../.claude/hooks/README.md)           # From docs/coordinate/
```

### Step 4: Fix the One Broken Anchor

**File**: `docs/operate/session-management.md:639`
**Link**: `[File Routing](../setup/quick-start.md#file-routing-rules-critical)`
**Issue**: Anchor `#file-routing-rules-critical` doesn't exist

**Fix Options:**
1. Check `docs/setup/quick-start.md` for actual anchor name
2. Update to correct anchor: `#file-routing-rules` (without -critical)
3. Or link to section without anchor if specific heading doesn't exist

---

## Automated Fix Scripts

### Script 1: Bulk Link Update

```bash
#!/bin/bash
# fix-learning-path-links.sh

# Update orientation.md old phase links
sed -i '' 's|01-foundations/what-is-claude-flow.md|what-is-claude-flow.md|g' docs/setup/orientation.md
sed -i '' 's|01-foundations/workspace-tour.md|../operate/workspace-tour.md|g' docs/setup/orientation.md
sed -i '' 's|01-foundations/first-session.md|../operate/first-session.md|g' docs/setup/orientation.md
sed -i '' 's|01-foundations/basic-memory-usage.md|../operate/basic-memory-usage.md|g' docs/setup/orientation.md

sed -i '' 's|02-essential-skills/spawning-agents.md|../build/spawning-agents-tutorial.md|g' docs/setup/orientation.md
sed -i '' 's|02-essential-skills/parallel-execution.md|../operate/parallel-execution.md|g' docs/setup/orientation.md
sed -i '' 's|02-essential-skills/memory-coordination.md|../operate/memory-coordination-tutorial.md|g' docs/setup/orientation.md
sed -i '' 's|02-essential-skills/session-management.md|../operate/session-management-tutorial.md|g' docs/setup/orientation.md

sed -i '' 's|03-intermediate/swarm-topologies.md|../coordinate/swarm-topologies.md|g' docs/setup/orientation.md
sed -i '' 's|03-intermediate/queen-selection.md|../coordinate/queen-selection.md|g' docs/setup/orientation.md
sed -i '' 's|03-intermediate/consensus-mechanisms.md|../coordinate/consensus-mechanisms.md|g' docs/setup/orientation.md
sed -i '' 's|03-intermediate/custom-workflows.md|../coordinate/custom-workflows.md|g' docs/setup/orientation.md

sed -i '' 's|04-advanced/hive-mind-coordination.md|../coordinate/hive-mind.md|g' docs/setup/orientation.md
sed -i '' 's|04-advanced/byzantine-consensus.md|../coordinate/byzantine-consensus.md|g' docs/setup/orientation.md
sed -i '' 's|04-advanced/adaptive-topology.md|../coordinate/adaptive-topology.md|g' docs/setup/orientation.md
sed -i '' 's|04-advanced/reasoning-bank.md|../reference/reasoning-bank.md|g' docs/setup/orientation.md
```

### Script 2: Fix Cross-References

```bash
#!/bin/bash
# fix-cross-refs.sh

# Fix all docs referencing old structure
find docs -name "*.md" -type f -exec sed -i '' \
  -e 's|\.\./essentials/quick-start\.md|../setup/quick-start.md|g' \
  -e 's|\.\./essentials/session-management\.md|../operate/session-management.md|g' \
  -e 's|\.\./essentials/memory-coordination\.md|../operate/memory-coordination-tutorial.md|g' \
  -e 's|\.\./essentials/agent-spawning\.md|../build/spawning-agents.md|g' \
  -e 's|\.\./essentials/troubleshooting\.md|../operate/troubleshooting.md|g' \
  -e 's|\.\./reality/architecture\.md|../reference/architecture.md|g' \
  -e 's|\.\./reality/what-actually-works\.md|../reference/what-actually-works.md|g' \
  -e 's|\.\./reality/limitations\.md|../reference/limitations.md|g' \
  -e 's|../../explanation/workspace-architecture\.md|../reference/architecture.md|g' \
  -e 's|../../explanation/file-routing\.md|../setup/quick-start.md|g' \
  -e 's|../../explanation/session-management\.md|../operate/session-management.md|g' \
  {} \;
```

---

## Verification Checklist

After applying fixes:

- [ ] Re-run validation script: `python3 sessions/*/artifacts/docs/validate_links.py`
- [ ] Success rate should be >95%
- [ ] Spot-check 5-10 random links manually
- [ ] Test navigation flow: README → setup → operate → build → coordinate
- [ ] Verify all hooks system links work
- [ ] Confirm anchor link in session-management.md works

---

## Decision Points

### Option A: Fix All Links (Recommended)
- **Effort**: Medium (2-3 hours manual work)
- **Benefit**: Complete, working documentation
- **Risk**: Low - straightforward replacements

### Option B: Deprecate orientation.md
- **Effort**: Low (30 minutes)
- **Benefit**: Removes 19 broken links
- **Risk**: Medium - users may expect it
- **Action**: Add deprecation notice, point to README.md

### Option C: Hybrid Approach
- **Effort**: Low-Medium (1-2 hours)
- **Steps**:
  1. Deprecate orientation.md (removes 19 links)
  2. Fix high-traffic files (troubleshooting, swarm-coordination)
  3. Leave low-traffic tutorial files for later
- **Benefit**: 80/20 rule - fix most-used docs first

---

## Recommendation

**Proceed with Option C (Hybrid)**:

1. **Immediate** (30 min):
   - Deprecate `docs/setup/orientation.md` with redirect to `docs/README.md`
   - Fix `docs/operate/troubleshooting.md` (16 links)
   - Fix `docs/coordinate/swarm-coordination.md` (8 links)

2. **Short-term** (1-2 hours):
   - Fix all cross-directory references in build/
   - Fix hooks system paths
   - Fix the one broken anchor

3. **Later** (as needed):
   - Fix remaining tutorial navigation links
   - Create any missing stub files

This approach:
- ✅ Quickly improves success rate from 36% to ~80%
- ✅ Fixes most-used documentation first
- ✅ Reduces user confusion
- ✅ Leaves low-priority fixes for incremental improvement
