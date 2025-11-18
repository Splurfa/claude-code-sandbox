# HITL Checkpoint Framework
## Human-in-the-Loop Decision System for Workspace Organization

**Version**: 1.0
**Created**: 2025-11-17
**Session**: session-20251117-233107-workspace-docs-optimization
**Purpose**: Define when and how to engage user in organizational decisions

---

## 🎯 Core Principle

**"Agent autonomy on details, human guidance on structure"**

Users want appropriate touchpoints to shape organizational frameworks without micromanaging implementation. This framework identifies which decisions need human input and creates clear, easy decision points.

---

## 📊 Decision Categorization Matrix

### Category A: MUST ASK (Structural, High-Impact)
**Threshold**: Affects how user will interact with workspace daily

| Decision Type | Why MUST ASK | Example |
|--------------|--------------|---------|
| **Top-level directory structure** | User mental model, daily navigation | Projects/ organization |
| **Core workflow paths** | Affects muscle memory | Where active work lives |
| **Promotion criteria** | Reflects user's quality standards | When docs/ vs sessions/ |
| **Major naming conventions** | User preferences vary widely | Flat vs nested, prefixes |
| **Archive strategy** | Different users have different comfort levels | What to keep, when to delete |

**Characteristics**:
- User will interact with this daily
- Multiple valid approaches exist
- Personal preference matters significantly
- Hard to change later without disruption

**When to Ask**: Before implementing any structural change

---

### Category B: SHOULD SUGGEST (Preferences, Medium-Impact)
**Threshold**: Affects consistency but not core workflow

| Decision Type | Why SUGGEST | Example |
|--------------|-------------|---------|
| **Template formats** | User may have preferences | README.md structure |
| **Metadata schemas** | Affects searchability | What fields to track |
| **Directory naming patterns** | Cosmetic but impacts scanning | Kebab-case vs snake_case |
| **Index organization** | How user prefers to browse | Chronological vs topical |
| **Cross-reference style** | Reading preference | Inline links vs appendix |

**Characteristics**:
- User will notice but it's not blocking
- Defaults work for most cases
- Can be changed incrementally
- Affects polish more than function

**When to Suggest**: After showing working example, offer alternatives

---

### Category C: AGENT DECIDES (Implementation, Low-Impact)
**Threshold**: Technical details user shouldn't need to think about

| Decision Type | Why AUTONOMOUS | Example |
|--------------|----------------|---------|
| **Internal file structures** | Implementation detail | Subdirectory depth |
| **Supporting file names** | Follows established pattern | metadata.json vs _meta.json |
| **Documentation formatting** | Markdown conventions | Header styles, list formats |
| **Utility script details** | As long as it works | Function names, parameters |
| **Index generation logic** | Technical implementation | How to collect entries |

**Characteristics**:
- User doesn't care about the specifics
- Follows established conventions
- Can be refactored without user impact
- Pure implementation detail

**When to Decide**: Just do it, document in session artifacts

---

## 🎪 Checkpoint Templates

### Template 1: Multiple Choice (For Category A Decisions)

```markdown
🔹 DECISION CHECKPOINT: [Topic]

**Context**: [1-2 sentences explaining why this matters]

**We need to choose**: [Clear question]

---

### Option A: [Name]
**How it works**: [2-3 sentences]
**Pros**:
  - [Benefit 1]
  - [Benefit 2]
**Cons**:
  - [Tradeoff 1]
**Best for**: [User type/situation]

---

### Option B: [Name]
**How it works**: [2-3 sentences]
**Pros**:
  - [Benefit 1]
  - [Benefit 2]
**Cons**:
  - [Tradeoff 1]
**Best for**: [User type/situation]

---

### Option C: [Name]
**How it works**: [2-3 sentences]
**Pros**:
  - [Benefit 1]
  - [Benefit 2]
**Cons**:
  - [Tradeoff 1]
**Best for**: [User type/situation]

---

### Option D: Show Me More / I Have a Different Idea

**If you choose D, what would help?**
- [ ] See real examples of each approach
- [ ] Understand impact on daily workflow
- [ ] Explain my own approach

---

**Your choice**: ___

**Follow-up questions** (optional): ___
```

**When to use**:
- Multiple valid approaches (3-5 options)
- Each has clear tradeoffs
- Need to align with user's working style

**Example Application**: Projects/ directory organization

---

### Template 2: Binary Decision (For Clear Yes/No Choices)

```markdown
🔹 QUICK DECISION: [Topic]

**Question**: [Clear yes/no question]

**Context**: [Why this matters in 1-2 sentences]

**If YES**: [What happens]
- [Implication 1]
- [Implication 2]

**If NO**: [What happens instead]
- [Alternative 1]
- [Alternative 2]

**Recommendation**: [Agent suggestion with reasoning]

---

**Your answer**: YES / NO / NEED MORE INFO

**If you need more info**: ___
```

**When to use**:
- Two clear alternatives
- Quick decision needed
- One option is recommended but user should confirm

**Example Application**: "Should we auto-promote session docs when they reach 3+ references?"

---

### Template 3: Preference Scale (For Spectrum Decisions)

```markdown
🔹 PREFERENCE CHECK: [Topic]

**We can optimize for**: [Two ends of spectrum]

**[Conservative End] ←――――――――→ [Aggressive End]**

**Option 1 (Conservative)**: [Description]
- [Characteristic]
- Example: [Concrete example]

**Option 3 (Balanced)**: [Description]
- [Characteristic]
- Example: [Concrete example]

**Option 5 (Aggressive)**: [Description]
- [Characteristic]
- Example: [Concrete example]

---

**Where do you fall?**
1 (Most Conservative) ― 2 ― 3 (Balanced) ― 4 ― 5 (Most Aggressive)

**Your choice**: ___
```

**When to use**:
- Spectrum of approaches (cautious to aggressive)
- Trade-off between two values
- Personal preference on intensity

**Example Application**: Archive aggressiveness (keep everything vs delete liberally)

---

### Template 4: Show & Tell (For Category B Suggestions)

```markdown
🎨 IMPLEMENTATION SUGGESTION: [Topic]

**What we implemented**: [Description]

**Here's how it looks**:
```
[Code/structure example]
```

**This approach**:
- [Benefit 1]
- [Benefit 2]
- [Consideration]

**Alternative approaches**:
- **Option B**: [Brief description] - Better if [use case]
- **Option C**: [Brief description] - Better if [use case]

---

**Feedback welcome but not required**:
- [ ] Looks good, proceed
- [ ] I'd prefer [alternative]
- [ ] Let me think about this

**Your feedback** (optional): ___
```

**When to use**:
- Category B (Should Suggest) decisions
- After implementing working version
- Offering alternatives without blocking

**Example Application**: README.md template format

---

### Template 5: Open Exploration (For Uncovering Preferences)

```markdown
🗺️ EXPLORATION: [Topic]

**We're designing**: [What system/approach]

**To understand what works for you, consider**:

**Scenario 1**: [Realistic workflow situation]
- How would you want to handle this?
- What would be intuitive?

**Scenario 2**: [Another realistic situation]
- Same questions...

**Scenario 3**: [Edge case]
- Same questions...

---

**Your thoughts**:

[Open field for user to describe their mental model]

---

**If that's too open-ended, react to these statements**:

- "I want to see everything at a glance" [Agree/Disagree]
- "I prefer deep nesting to flat structures" [Agree/Disagree]
- "I value chronology over categorization" [Agree/Disagree]
- "I'm comfortable with complex systems if they're powerful" [Agree/Disagree]
```

**When to use**:
- Early in design process
- Need to understand user's mental model
- Multiple dimensions to explore

**Example Application**: Understanding how user thinks about project lifecycle

---

## ⏱️ Timing Strategy

### 1. Batching Decisions (Avoid Fatigue)

**GOOD - Batch Related Decisions**:
```
Session Start → Present 2-3 related structural decisions together
│
├─ Projects/ organization
├─ Archive strategy
└─ Promotion workflow
│
Then proceed with implementation
```

**BAD - Decision Spam**:
```
Ask about Projects/
Wait for answer
Ask about Archive/
Wait for answer
Ask about Templates/
Wait for answer
[User is exhausted]
```

**Batching Rules**:
- Max 3 decisions per checkpoint
- Group related decisions (all about file organization)
- Separate by implementation time (don't ask about Step 5 before Step 1)
- Allow "I'll decide later" option

---

### 2. Checkpoint Moments (When to Pause)

**Natural Checkpoint Moments**:

| When | Why | Decision Type |
|------|-----|---------------|
| **Session start** | Planning phase, user is engaged | Category A (structural) |
| **After analysis** | Context is fresh, before committing | Category A (architectural) |
| **After prototype** | User can see working example | Category B (refinements) |
| **Before promotion** | Last chance to adjust before permanent | Category B (quality check) |
| **During refactor** | Good time to revisit early decisions | Category A (re-evaluation) |
| **Error recovery** | User is already engaged | Category A (strategy change) |

**Anti-Patterns to Avoid**:
- ❌ Asking mid-implementation (disrupts flow)
- ❌ Asking when user is debugging (wrong context)
- ❌ Asking after the fact (feels like busywork)
- ❌ Asking repeatedly about same topic (annoying)

---

### 3. Progressive Disclosure (Show What Matters Now)

**Phase 1: Structure**
```
Ask about:
- Top-level directory organization
- Core workflow paths
- Major conventions
```

**Phase 2: Refinement** (after seeing structure work)
```
Suggest:
- Template formats
- Metadata schemas
- Cross-reference styles
```

**Phase 3: Optimization** (after using system)
```
Offer:
- Automation options
- Advanced features
- Customizations
```

**Don't ask about Phase 3 decisions in Phase 1** - user doesn't have context yet.

---

## 🎬 Integration with Agent Coordination

### How Coordination Agent Uses This Framework

**1. Planning Phase** (Pre-Task Hook):
```javascript
// Coordination agent evaluates upcoming work
const decisions = identifyDecisions(upcomingWork);
const categorized = categorizeByImpact(decisions);

// Batch Category A decisions for checkpoint
if (categorized.mustAsk.length > 0) {
  await createCheckpoint({
    type: 'multiple-choice',
    decisions: categorized.mustAsk,
    timing: 'before-implementation'
  });
}
```

**2. Implementation Phase** (During Work):
```javascript
// Agent proceeds autonomously on Category C
implementWithoutAsking(categorized.agentDecides);

// Agent notes Category B for later suggestion
storeForLaterSuggestion(categorized.shouldSuggest);
```

**3. Review Phase** (Post-Task Hook):
```javascript
// Present Category B suggestions with working examples
if (categorized.shouldSuggest.length > 0) {
  await createCheckpoint({
    type: 'show-and-tell',
    suggestions: categorized.shouldSuggest,
    timing: 'after-implementation',
    workingExample: currentImplementation
  });
}
```

**4. Memory Integration**:
```javascript
// Store user decisions for consistency
await memory.store({
  namespace: 'workspace-optimization-20251117',
  key: 'user-preferences/projects-organization',
  value: userChoice,
  metadata: {
    checkpoint: 'projects-structure-v1',
    date: '2025-11-17'
  }
});

// Retrieve for future decisions
const priorPreference = await memory.retrieve({
  key: 'user-preferences/projects-organization'
});
```

---

## 📋 Decision Checklist for Agents

**Before implementing anything, ask**:

```
□ Is this a structural decision that affects daily workflow?
  YES → Category A → Create checkpoint BEFORE implementing
  NO → Continue...

□ Are there 2+ valid approaches with different tradeoffs?
  YES → Category A/B → Present options
  NO → Continue...

□ Does this reflect personal preference vs technical requirement?
  YES → Category B → Implement example, then suggest
  NO → Continue...

□ Will the user interact with this directly and regularly?
  YES → Category A/B → Get input
  NO → Category C → Proceed autonomously

□ If I change this later, does it require user retraining?
  YES → Category A → Must ask
  NO → Category C → Agent decides

□ Is this an implementation detail that follows established patterns?
  YES → Category C → Just do it
  NO → Category A/B → Consider checkpoint
```

---

## 🎯 Example Applications

### Example 1: Projects/ Organization (Category A)

**Decision**: How to organize projects/ directory?

**Checkpoint Type**: Multiple Choice (Template 1)

**Options Presented**:
- A) By Type (research/, execution/, strategic/)
- B) By Status (active/, planning/, archive/)
- C) By Domain (ai-systems/, business/, technical/)
- D) Flat with metadata (projects/*.md with frontmatter)

**Why Category A**:
- User navigates this daily
- Affects mental model
- Hard to change later
- Multiple valid approaches

**Timing**: Session start, after initial analysis

---

### Example 2: README.md Template (Category B)

**Decision**: What format for project README.md files?

**Checkpoint Type**: Show & Tell (Template 4)

**Approach**:
1. Implement working template following common conventions
2. Show user the template with real example
3. Offer alternatives (minimalist, detailed, hybrid)
4. Get feedback but don't block on it

**Why Category B**:
- User will notice but has working default
- Can iterate based on usage
- Cosmetic more than functional

**Timing**: After implementing first project promotion

---

### Example 3: Internal File Structure (Category C)

**Decision**: How many subdirectories under sessions/[id]/artifacts/?

**Checkpoint Type**: None (Agent Decides)

**Approach**:
- Agent implements logical structure
- Documents in session artifacts
- User never needs to think about it

**Why Category C**:
- Pure implementation detail
- Follows established patterns
- User doesn't interact directly
- Can refactor without user impact

**Timing**: Never ask, just implement

---

## 🔄 Feedback Loop Integration

### Collecting Decision Outcomes

**After each checkpoint**:
```javascript
await memory.store({
  namespace: 'workspace-optimization-20251117',
  key: `checkpoint-outcomes/${checkpointId}`,
  value: {
    checkpoint: checkpointId,
    decision: userChoice,
    timestamp: Date.now(),
    confidence: userConfidenceLevel,
    notes: userFeedback
  }
});
```

### Learning from Patterns

**Periodic analysis**:
```javascript
// Which decisions took longest?
// Which had follow-up changes?
// Which were confident vs uncertain?
// Adjust categorization based on patterns
```

### Adapting Framework

**Framework evolution**:
- If Category B decisions consistently get strong opinions → Move to Category A
- If Category A decisions always pick same option → Move to Category B (suggest default)
- If Category C decisions get questioned → Move to Category B

---

## 🎓 Best Practices for Agents

### DO:
✅ **Batch related decisions** - Present 2-3 together at natural pause points
✅ **Show working examples** - Easier to react to than abstract descriptions
✅ **Provide clear tradeoffs** - "This gives X but costs Y"
✅ **Offer escape hatches** - "Show me more" / "I have a different idea"
✅ **Remember past preferences** - Don't re-ask what's already decided
✅ **Make it easy to skip** - "Looks good, proceed" should be one-click
✅ **Time checkpoints well** - When user is engaged and has context

### DON'T:
❌ **Ask mid-implementation** - Disrupts flow
❌ **Present too many options** - 3-5 max, overwhelming beyond that
❌ **Ask abstract questions** - Show concrete examples
❌ **Block on nice-to-haves** - Category B can proceed with defaults
❌ **Re-ask settled decisions** - Check memory first
❌ **Ask when user is debugging** - Wrong mental state
❌ **Make user guess implications** - Spell out what each choice means

---

## 📊 Success Metrics

**How to know if this framework is working**:

| Metric | Good | Bad |
|--------|------|-----|
| **Decision time** | < 2 minutes | > 5 minutes |
| **Follow-up changes** | < 10% of decisions | > 30% reversed |
| **User confidence** | "I'm sure" | "I guess?" |
| **Completion rate** | User finishes checkpoint | Abandons mid-decision |
| **Agent efficiency** | Proceeds confidently on Cat C | Pauses on everything |

**User sentiment indicators**:
- "That's exactly what I wanted to decide on" ✅
- "I don't care about this detail" → Was this Category A? Should be C.
- "I wish I'd known about Option D earlier" → Present options better
- "I'm not sure, just pick one" → Needs more context or default

---

## 🚀 Quick Reference for Agents

**Starting new organizational work?**

1. **Analyze decisions needed** → Run through categorization checklist
2. **Identify Category A** → Must ask before proceeding
3. **Batch 2-3 together** → Create checkpoint at session start
4. **Proceed on Category C** → Document but don't ask
5. **Note Category B** → Implement default, suggest alternatives after
6. **Store outcomes** → Memory for consistency
7. **Learn patterns** → Adapt framework over time

**Creating a checkpoint?**

1. **Choose template** → Multiple choice? Binary? Preference scale?
2. **Write clear context** → Why does this matter?
3. **Present 3-5 options** → Clear tradeoffs for each
4. **Show examples** → Concrete > Abstract
5. **Offer escape** → "Show me more" / "Different idea"
6. **Make it easy** → One-click for common case
7. **Time it right** → Natural pause point

---

## 📝 Template: Checkpoint Creation

**Agent Script for Creating Checkpoint**:

```javascript
// 1. Identify decision
const decision = {
  topic: "Projects/ organization",
  category: "A", // Must Ask
  impact: "high", // User interacts daily
  approaches: 4 // Multiple valid options
};

// 2. Check memory for prior decisions
const priorChoice = await memory.retrieve({
  key: `user-preferences/${decision.topic}`
});

if (priorChoice) {
  // Already decided, proceed with user's preference
  return implementWithPreference(priorChoice);
}

// 3. Select template
const template = selectTemplate(decision.category, decision.approaches);
// Category A + multiple approaches → Multiple Choice (Template 1)

// 4. Prepare checkpoint
const checkpoint = {
  id: generateId(),
  type: "multiple-choice",
  topic: decision.topic,
  context: "We need to decide how to organize projects/...",
  options: [
    {
      name: "By Type",
      description: "...",
      pros: ["...", "..."],
      cons: ["..."],
      bestFor: "Users who think in project categories"
    },
    // ... more options
  ],
  escape: "Show me examples / I have a different idea",
  timing: "session-start"
};

// 5. Present to user
const userChoice = await presentCheckpoint(checkpoint);

// 6. Store outcome
await memory.store({
  namespace: 'workspace-optimization-20251117',
  key: `user-preferences/${decision.topic}`,
  value: userChoice,
  metadata: { checkpointId: checkpoint.id, timestamp: Date.now() }
});

// 7. Proceed with user's choice
return implementWithPreference(userChoice);
```

---

## 🎯 Summary

**This framework provides**:
1. **Clear categorization** - Which decisions need user input (A/B/C)
2. **Flexible templates** - How to present options effectively
3. **Timing strategy** - When to pause for feedback
4. **Integration guide** - How coordination agent uses this
5. **Success metrics** - How to know it's working

**Core insight**:
Users want to shape the structure without micromanaging details. Give them clear, well-timed decision points on things that matter, proceed autonomously on implementation details, and always make it easy to provide feedback.

**Next steps**:
1. Coordination agent uses this for all organizational decisions
2. Test with first structural checkpoint (Projects/ organization)
3. Collect feedback on framework itself
4. Iterate based on user decision patterns

---

**Framework Status**: Ready for integration
**Memory Key**: workspace-optimization-20251117/hitl-framework
**Integration**: Coordination agent to implement on next structural decision
