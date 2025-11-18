# HITL Framework Quick Reference
## Fast Decision Guide for Coordinating Agents

**Version**: 1.0
**Purpose**: Quick lookup for when/how to engage user in decisions

---

## 🚦 Decision Flowchart

```
New Decision Needed
        ↓
Does it affect daily workflow?
        ↓
    YES → Is it structural (directories, workflows, conventions)?
           ↓
        YES → 🔴 CATEGORY A: MUST ASK
               Create checkpoint BEFORE implementing
               Use Template: Multiple Choice or Binary

        NO → Are there multiple valid approaches?
              ↓
           YES → 🟡 CATEGORY B: SHOULD SUGGEST
                  Implement working default
                  Show example, offer alternatives
                  Use Template: Show & Tell

           NO → Is it just personal preference?
                 ↓
              YES → 🟡 CATEGORY B: SHOULD SUGGEST

    NO → Is it implementation detail following patterns?
          ↓
       YES → 🟢 CATEGORY C: AGENT DECIDES
              Just implement, document

       NO → 🟡 CATEGORY B: SHOULD SUGGEST
```

---

## 📊 Quick Category Check

### 🔴 Category A: MUST ASK

**Ask yourself**: "If I change this later, will it disrupt the user's workflow?"

| Indicator | Category A |
|-----------|------------|
| User touches it | Daily |
| Valid approaches | 2+ with tradeoffs |
| Change cost | High (retraining) |
| Preference impact | Significant |

**Examples**:
- Projects/ directory structure
- Archive workflow
- Top-level organization
- Core naming conventions
- Promotion criteria

**Action**: Stop and create checkpoint

---

### 🟡 Category B: SHOULD SUGGEST

**Ask yourself**: "Would user notice but could live with default?"

| Indicator | Category B |
|-----------|------------|
| User touches it | Occasionally |
| Valid approaches | Defaults work |
| Change cost | Medium (adjustable) |
| Preference impact | Moderate |

**Examples**:
- README.md templates
- Metadata schemas
- Index organization
- Cross-reference styles
- Documentation formatting

**Action**: Implement default, suggest alternatives

---

### 🟢 Category C: AGENT DECIDES

**Ask yourself**: "Is this just how we implement the decision?"

| Indicator | Category C |
|-----------|------------|
| User touches it | Never/rarely |
| Valid approaches | Technical choice |
| Change cost | Low (refactorable) |
| Preference impact | None |

**Examples**:
- Internal subdirectory depth
- Supporting file names
- Index generation logic
- Utility function details
- Markdown formatting details

**Action**: Just do it, document

---

## 📝 Template Selection

| Situation | Use Template | When |
|-----------|-------------|------|
| **3-5 valid approaches** | Multiple Choice | Category A, before implementing |
| **Yes/No decision** | Binary | Category A/B, quick decisions |
| **Spectrum (cautious↔aggressive)** | Preference Scale | Category A/B, intensity decisions |
| **Have working example** | Show & Tell | Category B, after implementing |
| **Need to understand user** | Open Exploration | Category A, early planning |

---

## ⏱️ Timing Cheat Sheet

| Phase | When | What to Ask | Category |
|-------|------|------------|----------|
| **Session Start** | User just engaged | Structural decisions | A |
| **After Analysis** | Context fresh | Architectural choices | A |
| **After Prototype** | Working example exists | Refinements | B |
| **Before Promotion** | Last checkpoint | Quality verification | B |
| **Mid-Implementation** | ❌ NEVER | ❌ NOTHING | - |
| **During Debugging** | ❌ NEVER | ❌ NOTHING | - |

---

## 🎯 Batching Rules

**DO Batch** (Present together):
- 2-3 related structural decisions
- All Category A decisions before implementation
- Similar scope (all about file org)

**DON'T Batch**:
- More than 3 decisions at once
- Unrelated decisions (Projects + GitHub workflow)
- Future decisions user doesn't have context for yet

**Example Good Batch**:
```
Checkpoint: Workspace Organization
├─ Projects/ structure
├─ Archive strategy
└─ Promotion workflow
```

**Example Bad Batch**:
```
❌ Projects/ + README format + Git workflow + Testing strategy + ...
   (Too many, too broad)
```

---

## 💾 Memory Integration

**Before asking**:
```javascript
// Check if already decided
const prior = await memory.retrieve({
  namespace: 'workspace-optimization-20251117',
  key: 'user-preferences/[topic]'
});

if (prior) {
  // Don't re-ask, use stored preference
  return implementWithPreference(prior);
}
```

**After decision**:
```javascript
// Store for future consistency
await memory.store({
  namespace: 'workspace-optimization-20251117',
  key: 'user-preferences/[topic]',
  value: userChoice,
  metadata: {
    checkpointId: generateId(),
    timestamp: Date.now(),
    confidence: userConfidenceLevel
  }
});
```

---

## 📋 Pre-Flight Checklist

**Before implementing organizational change**:

```
□ Have I checked memory for prior decision on this?
   NO → Continue
   YES → Use stored preference, skip checkpoint

□ What category is this decision?
   A → Must create checkpoint before proceeding
   B → Can implement default, suggest later
   C → Just do it

□ If Category A: Do I have 3-5 clear options?
   NO → Need to develop options first
   YES → Prepare checkpoint

□ If Category A: Can I batch with other decisions?
   YES → Wait to batch 2-3 related decisions
   NO → Proceed with single checkpoint

□ Is timing right?
   Session start / After analysis → YES
   Mid-implementation / Debugging → NO, wait

□ If Category B: Do I have working example?
   NO → Implement default first
   YES → Prepare show-and-tell

□ Have I made it easy to decide?
   □ Clear context (why this matters)
   □ Concrete examples
   □ Obvious tradeoffs
   □ Escape hatch ("show me more")
   □ One-click common case
```

---

## 🎪 Template Anatomy

### Multiple Choice Template (Category A)

**Structure**:
1. **Context** (1-2 sentences why it matters)
2. **Question** (clear, specific)
3. **3-5 Options**, each with:
   - How it works
   - Pros (2-3)
   - Cons (1-2)
   - Best for (user type/situation)
4. **Escape hatch** ("Show me more")
5. **Choice field** + optional follow-up

**When**: Category A, 3+ approaches, before implementing

---

### Show & Tell Template (Category B)

**Structure**:
1. **What we implemented** (description)
2. **How it looks** (code/example)
3. **Benefits** (why this approach)
4. **Alternatives** (2-3 other options)
5. **Easy feedback** (checkbox format)

**When**: Category B, after implementing default

---

## 🚨 Anti-Patterns to Avoid

| ❌ DON'T | ✅ DO INSTEAD |
|---------|--------------|
| Ask mid-implementation | Batch at start or after completion |
| Present 10 options | 3-5 clear options with tradeoffs |
| Abstract questions | Show concrete examples |
| Block on nice-to-haves | Provide working default |
| Re-ask settled decisions | Check memory first |
| Ask during debugging | Wait for natural pause |
| Assume user context | Provide clear context |

---

## 🎯 Success Indicators

**Good checkpoint**:
- User decides in < 2 minutes
- User expresses confidence ("That's what I wanted")
- < 10% follow-up changes
- User completes rather than abandons

**Bad checkpoint**:
- Takes > 5 minutes
- User says "I guess?" or "Just pick one"
- User abandons mid-decision
- Need to reverse > 30% of decisions

**If seeing bad indicators**:
- Too many options? Reduce to 3-5
- User doesn't care? Should be Category C
- User uncertain? Need more context/examples
- User frustrated? Wrong timing or too complex

---

## 💡 Quick Examples

### Example: Projects/ Organization

**Category**: A (structural, daily use, multiple approaches)
**Template**: Multiple Choice
**Timing**: Session start, after analysis
**Options**: By Type / By Status / By Domain / Flat with metadata
**Batch with**: Archive strategy, Promotion workflow

---

### Example: README.md Format

**Category**: B (preference, has defaults)
**Template**: Show & Tell
**Timing**: After first project promotion
**Approach**: Implement standard format, show working example, offer alternatives

---

### Example: Subdirectory Depth

**Category**: C (implementation detail)
**Template**: None (agent decides)
**Timing**: Never ask
**Approach**: Follow logical structure, document in session

---

## 🔄 Feedback Loop

**After each checkpoint**:
1. **Store decision** in memory (key: `user-preferences/[topic]`)
2. **Note confidence** (confident / uncertain / didn't care)
3. **Track timing** (decision time, any follow-ups)
4. **Learn patterns** (which decisions took longest? Which got strong opinions?)
5. **Adjust framework** (move between categories if needed)

**Periodic review**:
- If Category B always gets strong opinions → Move to A
- If Category A always picks same option → Move to B (suggest default)
- If Category C gets questioned → Move to B

---

## 🚀 Quick Start for Agents

**When starting organizational work**:

1. **Scan upcoming decisions** → Run through category check
2. **Check memory** → Any prior decisions on these topics?
3. **Batch Category A** → 2-3 related structural decisions
4. **Create checkpoint** → Use appropriate template
5. **Proceed on Category C** → Just implement, document
6. **Note Category B** → Implement defaults, suggest after
7. **Store outcomes** → All decisions to memory

**When in doubt**:
- Structural + Daily use → Category A
- Preference + Has default → Category B
- Implementation detail → Category C

---

## 📚 Full Documentation

For complete framework, templates, and examples:
- **Full Guide**: `HITL-FRAMEWORK.md`
- **Memory Key**: `workspace-optimization-20251117/hitl-framework`
- **Integration**: Coordination agent implements on structural decisions

---

**Framework Status**: Ready for use
**Quick Reference Version**: 1.0
**Last Updated**: 2025-11-17
