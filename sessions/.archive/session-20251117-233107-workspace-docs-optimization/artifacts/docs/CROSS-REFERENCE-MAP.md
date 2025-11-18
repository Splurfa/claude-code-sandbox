# Documentation Cross-Reference Map

**Session**: session-20251117-233107-workspace-docs-optimization
**Purpose**: Define cross-references between documentation types
**Last Updated**: 2025-11-17

---

## Diátaxis Cross-Reference Patterns

### The Four Documentation Types

```
┌──────────────────────────────────────────────┐
│              LEARNING ↔ WORKING              │
│                                              │
│  Tutorials ──────────→ How-to Guides        │
│     ↓                        ↓               │
│     ↓                        ↓               │
│  Explanation ←────────→ Reference            │
│                                              │
│          THEORETICAL ↔ PRACTICAL             │
└──────────────────────────────────────────────┘
```

### Cross-Reference Rules

1. **Tutorials → How-to**: "Now apply this: [How to X](../how-to/x.md)"
2. **How-to → Explanation**: "To understand why: [X Explained](../explanation/x.md)"
3. **Explanation → Tutorial**: "Try this hands-on: [Tutorial: X](../tutorials/x.md)"
4. **Reference → Internals**: "Deep dive: [X Internals](../internals/x.md)"
5. **All → Troubleshooting**: "Having issues? [Troubleshoot X](../troubleshooting/x.md)"

---

## Current Documentation Map

### Session Management Topic

| Type | File | Links To |
|------|------|----------|
| **Tutorial** | tutorials/01-foundations/first-session.md | → how-to/session-closeout.md<br>→ explanation/session-management.md |
| **Tutorial** | tutorials/02-essential-skills/session-management.md | → how-to/manual-session-management.md<br>→ reference/session-api.md (planned) |
| **How-to** | how-to/session-closeout.md (planned) | → explanation/session-management.md<br>→ reference/session-commands.md (planned) |
| **How-to** | how-to/manual-session-management.md (planned) | → explanation/session-management.md<br>→ internals/session-lifecycle.md |
| **Explanation** | explanation/session-management.md | → tutorials/01-foundations/first-session.md<br>→ internals/session-lifecycle.md |
| **Reference** | reference/session-api.md (planned) | → internals/session-lifecycle.md<br>→ how-to/session-closeout.md |
| **Internals** | internals/session-lifecycle.md | → explanation/session-management.md<br>→ reference/session-api.md |

### File Routing Topic

| Type | File | Links To |
|------|------|----------|
| **Tutorial** | tutorials/01-foundations/first-session.md | → explanation/file-routing.md<br>→ how-to/organize-files.md (planned) |
| **How-to** | how-to/organize-files.md (planned) | → explanation/file-routing.md<br>→ reference/file-routing-changes.md |
| **Explanation** | explanation/file-routing.md | → tutorials/01-foundations/first-session.md<br>→ internals/data-flow.md |
| **Reference** | reference/file-routing-changes.md | → explanation/file-routing.md<br>→ internals/data-flow.md |
| **Internals** | internals/data-flow.md | → explanation/file-routing.md |

### Workspace Architecture Topic

| Type | File | Links To |
|------|------|----------|
| **Tutorial** | (none yet) | → explanation/workspace-architecture.md |
| **How-to** | how-to/choose-coordination-approach.md | → explanation/workspace-architecture.md<br>→ explanation/coordination-patterns.md (planned) |
| **Explanation** | explanation/workspace-architecture.md | → internals/architecture-overview.md<br>→ internals/stock-vs-custom.md |
| **Reference** | (none yet) | → explanation/workspace-architecture.md |
| **Internals** | internals/architecture-overview.md | → explanation/workspace-architecture.md |
| **Internals** | internals/stock-vs-custom.md | → explanation/workspace-architecture.md |

### Coordination & Agents Topic

| Type | File | Links To |
|------|------|----------|
| **Tutorial** | tutorials/02-essential-skills/multi-agent-coordination.md (planned) | → how-to/choose-coordination-approach.md<br>→ explanation/coordination-patterns.md (planned) |
| **Tutorial** | tutorials/03-intermediate/swarm-topologies.md (planned) | → explanation/coordination-patterns.md<br>→ reference/agent-types-catalog.md (planned) |
| **How-to** | how-to/choose-coordination-approach.md | → explanation/coordination-patterns.md (planned)<br>→ reference/agent-types-catalog.md (planned) |
| **How-to** | how-to/spawn-agents.md (planned) | → tutorials/02-essential-skills/multi-agent-coordination.md<br>→ reference/agent-types-catalog.md |
| **Explanation** | explanation/coordination-patterns.md (planned) | → tutorials/03-intermediate/swarm-topologies.md<br>→ internals/coordination-mechanics.md |
| **Explanation** | explanation/hive-mind-system.md | → tutorials/03-intermediate/queen-selection.md<br>→ internals/coordination-mechanics.md |
| **Reference** | reference/agent-types-catalog.md (planned) | → how-to/spawn-agents.md<br>→ internals/coordination-mechanics.md |
| **Reference** | reference/hive-mind-quick-reference.md | → explanation/hive-mind-system.md<br>→ tutorials/03-intermediate/queen-selection.md |
| **Internals** | internals/coordination-mechanics.md | → explanation/coordination-patterns.md<br>→ explanation/hive-mind-system.md |

### Memory & State Topic

| Type | File | Links To |
|------|------|----------|
| **Tutorial** | tutorials/02-essential-skills/memory-basics.md (planned) | → how-to/memory-operations.md (planned)<br>→ explanation/memory-management.md (planned) |
| **How-to** | how-to/memory-operations.md (planned) | → explanation/memory-management.md (planned)<br>→ reference/mcp-tools-quick-reference.md (planned) |
| **Explanation** | explanation/memory-management.md (planned) | → tutorials/02-essential-skills/memory-basics.md<br>→ internals/memory-architecture.md |
| **Reference** | reference/mcp-tools-quick-reference.md (planned) | → how-to/memory-operations.md<br>→ internals/memory-architecture.md |
| **Internals** | internals/memory-architecture.md | → explanation/memory-management.md |

### Testing & Verification Topic

| Type | File | Links To |
|------|------|----------|
| **Tutorial** | tutorials/01-foundations/first-session.md | → how-to/integration-testing-guide.md |
| **How-to** | how-to/integration-testing-guide.md | → reference/feature-verification-checklist.md<br>→ troubleshooting/troubleshooting-guide.md |
| **How-to** | how-to/zero-risk-execution-pattern.md | → explanation/coordination-patterns.md (planned)<br>→ internals/coordination-mechanics.md |
| **Reference** | reference/feature-verification-checklist.md | → how-to/integration-testing-guide.md |
| **Troubleshooting** | troubleshooting/troubleshooting-guide.md | → how-to/integration-testing-guide.md<br>→ internals/ (various) |

### Hooks & Automation Topic

| Type | File | Links To |
|------|------|----------|
| **Tutorial** | tutorials/02-essential-skills/hooks-basics.md (planned) | → how-to/configure-hooks.md (planned)<br>→ explanation/hooks-system.md (planned) |
| **How-to** | how-to/configure-hooks.md (planned) | → explanation/hooks-system.md (planned)<br>→ reference/hooks-api.md (planned) |
| **Explanation** | explanation/hooks-system.md (planned) | → tutorials/02-essential-skills/hooks-basics.md<br>→ internals/hooks-and-automation.md |
| **Reference** | reference/hooks-api.md (planned) | → how-to/configure-hooks.md<br>→ internals/hooks-and-automation.md |
| **Internals** | internals/hooks-and-automation.md | → explanation/hooks-system.md |

---

## Cross-Reference Templates

### In Tutorials

**Pattern**: Point to practical application and conceptual understanding

```markdown
## What's Next?

**Try this in practice:**
- [How to: Create Your First Session](../how-to/create-session.md)
- [How to: Close Session Properly](../how-to/session-closeout.md)

**Understand the concepts:**
- [Session Management Explained](../explanation/session-management.md)
- [File Routing Explained](../explanation/file-routing.md)

**Quick reference:**
- [Session Commands](../reference/session-commands.md)
```

### In How-to Guides

**Pattern**: Link to understanding and quick lookups

```markdown
## Prerequisites

**Understand the concepts first:**
- [Session Management Explained](../explanation/session-management.md)

## See Also

**Related tasks:**
- [How to: Manual Session Management](manual-session-management.md)
- [How to: Integration Testing](integration-testing-guide.md)

**Quick reference:**
- [Session Commands Reference](../reference/session-commands.md)
- [Feature Verification Checklist](../reference/feature-verification-checklist.md)

**Troubleshooting:**
- [Session Issues](../troubleshooting/troubleshooting-guide.md#sessions)
```

### In Explanations

**Pattern**: Link to hands-on practice and deep dives

```markdown
## Try It Yourself

**Hands-on tutorials:**
- [Tutorial: Your First Session](../tutorials/01-foundations/first-session.md)
- [Tutorial: Multi-Agent Coordination](../tutorials/02-essential-skills/multi-agent-coordination.md)

## Learn More

**Technical deep dive:**
- [Session Lifecycle (Internals)](../internals/session-lifecycle.md)
- [Architecture Overview (Internals)](../internals/architecture-overview.md)

## Quick Reference

**Fast lookups:**
- [Session Commands](../reference/session-commands.md)
- [Agent Types Catalog](../reference/agent-types-catalog.md)
```

### In Reference

**Pattern**: Link to guides and deep dives

```markdown
## Usage

**Step-by-step guides:**
- [How to: Create Session](../how-to/create-session.md)
- [How to: Memory Operations](../how-to/memory-operations.md)

## Technical Details

**Implementation:**
- [Session Lifecycle (Internals)](../internals/session-lifecycle.md)

## Learning

**Understanding:**
- [Session Management Explained](../explanation/session-management.md)

**Practice:**
- [Tutorial: First Session](../tutorials/01-foundations/first-session.md)
```

### In Internals

**Pattern**: Link to explanations and usage guides

```markdown
## For Users

**Conceptual understanding:**
- [Session Management Explained](../explanation/session-management.md)

**Practical usage:**
- [How to: Session Closeout](../how-to/session-closeout.md)

## Related Internals

**Related systems:**
- [Memory Architecture](memory-architecture.md)
- [Data Flow](data-flow.md)
```

---

## Missing Cross-References Audit

### Files Needing Cross-Reference Updates

**High Priority** (user-facing docs):

1. **explanation/workspace-architecture.md**
   - Add: Link to first-session tutorial
   - Add: Link to internals/architecture-overview.md
   - Add: Link to how-to/choose-coordination-approach.md

2. **explanation/session-management.md**
   - Add: Link to first-session tutorial
   - Add: Link to internals/session-lifecycle.md
   - Add: Link to how-to/session-closeout.md (when created)

3. **explanation/file-routing.md**
   - Add: Link to first-session tutorial
   - Add: Link to internals/data-flow.md
   - Add: Link to reference/file-routing-changes.md

4. **how-to/integration-testing-guide.md**
   - Add: Link to explanation/workspace-architecture.md
   - Add: Link to reference/feature-verification-checklist.md
   - Add: Link to troubleshooting/troubleshooting-guide.md

5. **how-to/choose-coordination-approach.md**
   - Add: Link to explanation/coordination-patterns.md (when created)
   - Add: Link to tutorials/03-intermediate/swarm-topologies.md (when created)
   - Add: Link to internals/coordination-mechanics.md

6. **how-to/zero-risk-execution-pattern.md**
   - Add: Link to explanation/coordination-patterns.md (when created)
   - Add: Link to internals/coordination-mechanics.md

**Medium Priority** (reference docs):

7. **reference/feature-verification-checklist.md**
   - Add: Link to how-to/integration-testing-guide.md
   - Add: Link to troubleshooting/troubleshooting-guide.md

8. **reference/hive-mind-quick-reference.md**
   - Add: Link to explanation/hive-mind-system.md
   - Add: Link to tutorials/03-intermediate/queen-selection.md

**Low Priority** (internals, already well-linked):

9. **internals/architecture-overview.md**
   - Verify: Links to explanation/workspace-architecture.md
   - Add: Links to other internals docs

10. **internals/coordination-mechanics.md**
    - Verify: Links to explanation sections
    - Add: Links to how-to guides

---

## Cross-Reference Maintenance

### When Adding New Documentation

**Checklist for new docs:**

- [ ] Identify doc type (tutorial/how-to/explanation/reference/internals)
- [ ] Add "See Also" section at bottom
- [ ] Link to related docs in other categories:
  - [ ] Tutorial ↔ How-to
  - [ ] How-to ↔ Explanation
  - [ ] Explanation ↔ Reference
  - [ ] Reference ↔ Internals
- [ ] Update this cross-reference map
- [ ] Update docs/README.md navigation
- [ ] Test all links work

### Link Format Standards

**Internal links** (within docs/):
```markdown
[Link Text](../category/file.md)
[Link Text](../category/file.md#section)
```

**Links to root files**:
```markdown
[CLAUDE.md](../CLAUDE.md)
[README.md](../README.md)
```

**Links to skills**:
```markdown
[Skill Name](../.claude/skills/skill-name/SKILL.md)
```

**External links**:
```markdown
[External Resource](https://example.com)
```

---

## Validation

### Link Checker Script

```bash
#!/bin/bash
# Check all cross-references are valid

find docs -name "*.md" | while read file; do
  echo "Checking: $file"

  # Extract markdown links
  grep -o "\[.*\](.*\.md[^)]*)" "$file" | \
  sed 's/.*(\(.*\.md[^)]*\)).*/\1/' | \
  while read link; do
    # Calculate absolute path
    dir=$(dirname "$file")
    target="$dir/$link"

    # Normalize path
    target=$(cd "$dir" && realpath "$link" 2>/dev/null || echo "$target")

    # Check if exists
    if [ ! -f "$target" ]; then
      echo "  ❌ BROKEN: $link"
      echo "     in: $file"
    fi
  done
done
```

### Cross-Reference Coverage Check

```bash
#!/bin/bash
# Check each doc has appropriate cross-references

check_doc_type() {
  local file=$1
  local type=$2

  case $type in
    tutorial)
      grep -q "how-to" "$file" || echo "⚠️  Missing how-to link: $file"
      grep -q "explanation" "$file" || echo "⚠️  Missing explanation link: $file"
      ;;
    how-to)
      grep -q "explanation" "$file" || echo "⚠️  Missing explanation link: $file"
      grep -q "reference" "$file" || echo "⚠️  Missing reference link: $file"
      ;;
    explanation)
      grep -q "tutorial" "$file" || echo "⚠️  Missing tutorial link: $file"
      grep -q "internals" "$file" || echo "⚠️  Missing internals link: $file"
      ;;
    reference)
      grep -q "how-to" "$file" || echo "⚠️  Missing how-to link: $file"
      grep -q "internals" "$file" || echo "⚠️  Missing internals link: $file"
      ;;
  esac
}

# Check all tutorials
find docs/tutorials -name "*.md" ! -name "README.md" | \
  while read f; do check_doc_type "$f" "tutorial"; done

# Check all how-tos
find docs/how-to -name "*.md" ! -name "README.md" | \
  while read f; do check_doc_type "$f" "how-to"; done

# Check all explanations
find docs/explanation -name "*.md" ! -name "README.md" | \
  while read f; do check_doc_type "$f" "explanation"; done

# Check all references
find docs/reference -name "*.md" ! -name "README.md" | \
  while read f; do check_doc_type "$f" "reference"; done
```

---

## Summary

**Total Cross-References Planned**: 150+ links across 40+ documents

**Priority Breakdown**:
- High: 6 files need immediate updates (user-facing)
- Medium: 4 files need updates (reference/internals)
- Low: 20+ files need cross-references when created

**Maintenance**: Update this map when adding new documentation

**Validation**: Run link checker + coverage checker before commits

---

**End of Cross-Reference Map**
