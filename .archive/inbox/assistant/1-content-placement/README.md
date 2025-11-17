# Content Placement System

**Problem Space**: Establishing and enforcing rules for docs/guides/ vs inbox/assistant/ content placement

**Status**: 2 of 3 proposals COMPLETED ✅ | 1 proposal PENDING ⏳

---

## 📋 What's in This Folder

### Completed Work ✅

1. **content-categorization-analysis.md**
   - **Status**: ✅ EXECUTED (item moved)
   - **What it did**: Analyzed docs/guides/ and identified `hive-mind-capability-mapping.md` as misplaced
   - **Result**: File moved to inbox/assistant/2025-11-16-system-hygiene-check/3-execution-planning/

2. **readme-updates-proposal.md**
   - **Status**: ✅ EXECUTED (READMEs updated)
   - **What it did**: Added content placement guidelines to 4 README files
   - **Result**: Clear rules now in docs/README.md, docs/guides/README.md, inbox/README.md, inbox/assistant/README.md

### Pending Work ⏳

3. **file-routing-skill-proposal.md**
   - **Status**: ⏳ PENDING EXECUTION
   - **What it will do**: Update file-routing skill to enforce content placement rules
   - **Risk**: 🟡 Medium (changes AI routing behavior)
   - **Time**: ~25 minutes
   - **HITL Required**: Yes - review skill changes before applying

---

## 🎯 Core Principle

**The Key Distinction**:
- **docs/guides/** = FOR the user (explaining how features work)
- **inbox/assistant/** = ABOUT the system (analyzing architecture, solving problems)

**Examples**:
- ✅ "How to use hive-mind" → docs/guides/
- ❌ "Hive-mind capability analysis" → inbox/assistant/
- ✅ "Integration testing guide" → docs/guides/
- ❌ "File routing skill proposal" → inbox/assistant/

---

## 🚀 Pending Execution: File Routing Skill

### What Needs to Happen

**File**: `file-routing-skill-proposal.md`
**Target**: `.claude/skills/file-routing/SKILL.md`

### Proposed Changes

1. **Add Content Type Decision Tree**
   ```
   Is this explaining how to USE a feature? → docs/guides/
   Is this analyzing SYSTEM architecture? → inbox/assistant/
   Is this session-specific work? → sessions/$SESSION_ID/artifacts/
   ```

2. **Split "Documentation" Category**
   - Currently: All docs → sessions/artifacts/docs/
   - Proposed: 3 distinct categories with different routing

3. **Add Documentation Guardrails**
   - Prevent system analysis from landing in user guides
   - Prevent user guides from landing in assistant inbox
   - Add validation questions

4. **Update Examples**
   - 5 real-world scenarios with correct routing
   - Common mistakes to avoid

### Before/After Example

**Current**:
```markdown
| Documentation | `sessions/$SESSION_ID/artifacts/docs/` | `docs/`, root |
```

**Proposed**:
```markdown
| User-facing guides | `docs/guides/` | `sessions/*/docs/`, `inbox/`, root |
| System development docs | `inbox/assistant/YYYY-MM-DD-topic/` | `docs/guides/`, root |
| Session proposals | `sessions/$SESSION_ID/artifacts/docs/` | `docs/`, root |
```

---

## 📝 Execution Instructions

### For Coder Agent

1. **Read the proposal**:
   ```bash
   # Read completely first
   cat inbox/assistant/2025-11-16-system-hygiene-check/1-content-placement/file-routing-skill-proposal.md
   ```

2. **Review current skill**:
   ```bash
   cat .claude/skills/file-routing/SKILL.md
   ```

3. **Apply proposed changes**:
   - Add content type decision tree (section ~line 50)
   - Update quick lookup table (section ~line 80)
   - Add documentation guardrails (section ~line 120)
   - Insert self-check question (section ~line 140)
   - Add 5 real-world examples (section ~line 200)

4. **Validate changes**:
   - Test with 4 scenarios from proposal
   - Verify decision tree logic
   - Check for broken links

5. **Create git checkpoint**:
   ```bash
   git add .claude/skills/file-routing/SKILL.md
   git commit -m "Add content type routing to file-routing skill

   - Add decision tree for docs/guides vs inbox/assistant
   - Split Documentation category into 3 types
   - Add guardrails to prevent misplacement
   - Include 5 real-world routing examples

   Addresses content placement system requirements"
   ```

---

## 🎯 Success Criteria

### Skill Update Complete When:

- [ ] Decision tree added to skill
- [ ] Quick lookup table updated with 3 doc categories
- [ ] Guardrails section added
- [ ] Self-check questions updated
- [ ] 5 examples added with correct routing
- [ ] All 4 test cases pass
- [ ] Git checkpoint created

### Validation Tests

**Test 1: User Guide Routing**
```
Input: "How to use hive-mind for complex projects"
Expected: docs/guides/how-to/hive-mind-usage.md
```

**Test 2: System Analysis Routing**
```
Input: "Analyze hive-mind capabilities vs our needs"
Expected: inbox/assistant/YYYY-MM-DD-analysis/hive-mind-capabilities.md
```

**Test 3: Session Work Routing**
```
Input: "Proposal for file routing improvements"
Expected: sessions/$SESSION_ID/artifacts/docs/file-routing-proposal.md
```

**Test 4: Ambiguous Content (Should Ask)**
```
Input: "Document our authentication system"
Expected: AI asks "Is this for users to understand auth, or internal analysis?"
```

---

## 🔗 Dependencies

**Prerequisites** (all complete):
- ✅ README updates (establishes rules)
- ✅ Content categorization (validates approach)

**Enables**:
- Future content automatically routed correctly
- Prevents docs/guides pollution with system work
- Clearer boundaries for AI decision-making

**Cascades To**:
- Session management (refs file routing in protocols)
- Captain's log (may reference proper file placement)

---

## 🛡️ Risk Mitigation

### Risk Level: 🟡 Medium

**Why Medium Risk?**
- Changes AI routing behavior (not just documentation)
- Could cause confusion if decision tree is unclear
- Affects all future file creation decisions

**Mitigation**:
1. **HITL Review**: User reviews changes before applying
2. **Test Cases**: 4 validation scenarios defined
3. **Git Checkpoint**: Easy rollback if issues
4. **Clear Examples**: 5 real-world scenarios guide AI

### Rollback Procedure

**If skill changes cause routing issues**:
```bash
git checkout HEAD -- .claude/skills/file-routing/SKILL.md
```

**If routing is unclear**:
- AI should ask user for clarification
- Don't force routing if ambiguous

---

## 📊 Impact Assessment

### Files Modified: 1
- `.claude/skills/file-routing/SKILL.md`

### Lines Added: ~150
- Decision tree: ~30 lines
- Guardrails: ~40 lines
- Examples: ~50 lines
- Updated table: ~30 lines

### Behavior Changes:
- Documentation now routes to 3 different locations based on type
- AI will ask when content type is ambiguous
- Clearer boundaries prevent future misplacement

---

## 💡 Tips for Queen/Hive

**Recommended Approach**:
- Assign 1 coder agent for execution
- Use Strategic queen for review (decision-making focus)
- Simple majority consensus for approval
- ~25 minutes total time

**Communication**:
- Read proposal completely before starting
- Show user the before/after for HITL approval
- Test all 4 scenarios before committing
- Report which tests passed/failed

**Common Pitfalls**:
- Don't add examples without decision tree logic
- Don't skip validation tests
- Don't commit without git checkpoint message

---

## 📚 Related Work

**This folder is part of**: Content Placement System (1 of 3 folders)

**See also**:
- `../README.md` - Master package orientation
- `../2-quality-improvements/` - Captain's Log fixes
- `../3-execution-planning/` - Hive coordination strategies
- `docs/guides/README.md` - Current user guide index
- `inbox/assistant/README.md` - Assistant workspace rules

---

**Folder Status**: 2 of 3 complete | 1 pending execution
**Estimated Time Remaining**: ~25 minutes
**Next Action**: Execute file-routing-skill-proposal.md with HITL approval
