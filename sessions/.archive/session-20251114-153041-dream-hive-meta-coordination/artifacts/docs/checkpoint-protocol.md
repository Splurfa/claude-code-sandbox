# HITL Checkpoint Protocol - Execution Guide

## Overview

This document defines HOW Queen Hive executes checkpoints, handles approvals/rejections, and incorporates feedback.

**Philosophy:** Simple pause-and-resume pattern. No complex state machines or review boards.

---

## Basic Checkpoint Pattern

### Standard Checkpoint Flow

```
┌─────────────────────────────────────┐
│ Queen Hive completes phase          │
└────────────┬────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│ PAUSE: Present checkpoint to user   │
│ - Show what was created             │
│ - Explain what needs approval       │
│ - Ask for decision                  │
└────────────┬────────────────────────┘
             ↓
      ┌──────┴──────┐
      ↓             ↓
 [approved]    [revise/gaps]
      ↓             ↓
   Resume      Update & Re-present
      ↓             ↓
   Next Phase   Same Checkpoint
```

### Implementation in Queen Hive

**Queen Hive MUST:**
1. Complete the phase fully before checkpoint
2. Present checkpoint in specified format (see hitl-checkpoint-map.md)
3. STOP and WAIT for explicit user input
4. NOT proceed to next phase until approval received

**Queen Hive MUST NOT:**
- Auto-approve checkpoints
- Skip checkpoints
- Proceed on ambiguous input ("looks good", "fine", "ok" are NOT approval)
- Make assumptions about user intent

---

## Checkpoint States

### State 1: Awaiting Approval

**Queen Hive Behavior:**
- Present checkpoint format from hitl-checkpoint-map.md
- Wait for user input
- No proactive work (no "preparing Phase 2 in advance")

**Valid User Responses:**
- `approved` → Proceed to next phase
- `revise [feedback]` → Enter revision loop
- `gaps [issue]` → (Checkpoint #4 only) Enter gap remediation
- `show [item]` → Display requested content, stay in checkpoint
- `help` → Re-explain what needs approval

**Invalid Responses:**
- Ambiguous approval ("ok", "looks good", "fine")
- Unrelated questions (answer, but stay in checkpoint)
- No response (continue waiting)

### State 2: Revision Loop

**Trigger:** User types `revise [feedback]`

**Queen Hive Behavior:**
1. Acknowledge feedback: "I'll update [specific item] to address [feedback]"
2. Make ONLY the requested changes (no scope creep)
3. Re-present the SAME checkpoint with updated content
4. Wait for approval again

**Example:**
```
User: "revise north-star.md - remove enterprise features from scope"

Queen Hive:
✏️  Updating north-star.md to clarify stock-first scope...
    - Removed enterprise feature mentions
    - Emphasized stock claude-flow infrastructure only

=== CHECKPOINT #1: North Star Validation (Revised) ===
[Re-present with changes highlighted]

Does this match your intention now?
- Type "approved" to proceed to Phase 1
- Type "revise [feedback]" for further updates
```

**Revision Loop Rules:**
- Maximum 5 revisions per checkpoint (if >5, escalate to user for re-scoping)
- Each revision shows WHAT changed
- No defensive explanations ("I thought you wanted...")
- Focus on fixes, not justifications

### State 3: Gap Remediation (Checkpoint #4 Only)

**Trigger:** User types `gaps [issue]`

**Queen Hive Behavior:**
1. Acknowledge gap: "I see the issue: [restate gap]"
2. Propose fix: "I'll [specific action] to address this"
3. Execute fix
4. Re-run validation tests
5. Re-present Checkpoint #4 with updated results

**Example:**
```
User: "gaps - session-restore pattern doesn't handle missing backups"

Queen Hive:
🔧 Addressing gap: session-restore error handling...
   - Added validation for backup file existence
   - Added user-friendly error message for missing sessions
   - Re-ran pattern tests

=== CHECKPOINT #4: Final Validation (Gap Remediated) ===
[Re-present with gap fix verified]

✅ New Test Result:
   - Session restore with missing backup: Graceful error message

Review updated validation results.
- Type "approved" to mark Dream Hive as COMPLETE
- Type "gaps [issue]" if you find other missing functionality
```

---

## Checkpoint Execution Rules

### Before Checkpoint

**Queen Hive MUST complete:**
- All deliverables for the phase
- All files saved to correct session artifacts paths
- Self-validation (no broken links, no placeholder content)

**Queen Hive MUST NOT:**
- Present checkpoint with incomplete deliverables
- Hide errors or issues (if something failed, report it)
- Assume user won't check (they will)

### During Checkpoint

**Queen Hive MUST:**
- Use exact format from hitl-checkpoint-map.md
- Present ALL relevant content (no "see file X", show the content)
- Make approval decision crystal clear (type "approved" or "revise [feedback]")

**Queen Hive MUST NOT:**
- Overwhelm with too much detail (summaries, not walls of text)
- Use technical jargon (explain in plain language)
- Ask open-ended questions ("What do you think?" is NOT a checkpoint)

### After Checkpoint

**On Approval:**
1. Acknowledge: "✅ Checkpoint #N approved. Proceeding to Phase M..."
2. Update session-summary.md with approval timestamp
3. Begin next phase immediately

**On Rejection:**
1. Acknowledge: "📝 Revising [item] based on feedback..."
2. Enter revision loop (State 2) or gap remediation (State 3)
3. Re-present same checkpoint

---

## Handling Edge Cases

### User Wants to See More Detail

**Example:** User types `show north-star.md`

**Queen Hive Behavior:**
```
📄 Full Content: north-star.md
[Display entire file contents]

Still at Checkpoint #1. Does the North Star match your intention?
- Type "approved" to proceed
- Type "revise [feedback]" to update
```

**Rule:** Stay in checkpoint, provide requested content, re-ask for approval.

### User Asks Unrelated Question

**Example:** User types "What's AgentDB?" during Checkpoint #2

**Queen Hive Behavior:**
```
ℹ️  AgentDB is a 150x faster vector database used by claude-flow hooks
   for agent memory and pattern storage.

Still at Checkpoint #2. Review the README files:
[Re-present checkpoint]
```

**Rule:** Answer question briefly, return to checkpoint, do NOT proceed.

### User Types Ambiguous Response

**Example:** User types "looks good" instead of "approved"

**Queen Hive Behavior:**
```
⚠️  Checkpoint requires explicit approval.
   Please type "approved" to proceed, or "revise [feedback]" to update.

Current checkpoint: #2 (Documentation Review)
```

**Rule:** Do NOT interpret ambiguous input as approval. Ask for explicit decision.

### User Wants to Skip Checkpoint

**Example:** User types "skip this, move to next phase"

**Queen Hive Behavior:**
```
⚠️  Checkpoints cannot be skipped per Dream Hive protocol.

   This ensures we're building the RIGHT thing. If this checkpoint isn't
   valuable, we should revise the protocol itself.

   Options:
   - Type "approved" if the deliverables meet your expectations
   - Type "revise [feedback]" if changes are needed
   - Ask to modify the checkpoint protocol for future sessions
```

**Rule:** NEVER skip checkpoints. If user insists, escalate to protocol revision discussion.

---

## Checkpoint Communication Templates

### Checkpoint Presentation Template

```
=== CHECKPOINT #N: [Name] ===

I've completed Phase M ([Phase Name]).

📄 What I've Created:
   - [Deliverable 1]: [1-line summary]
   - [Deliverable 2]: [1-line summary]

🎯 What You're Approving:
   - [ ] [Approval criterion 1]
   - [ ] [Approval criterion 2]

[Relevant content preview or demonstration]

Does this match your intention?
- Type "approved" to proceed to Phase [M+1]
- Type "revise [feedback]" to update deliverables
- Type "show [item]" to see full content
```

### Revision Acknowledgment Template

```
✏️  Updating [specific item] to address: [user feedback]

Changes made:
- [Change 1]
- [Change 2]

=== CHECKPOINT #N: [Name] (Revised) ===
[Re-present with highlighted changes]

Does this address your feedback?
- Type "approved" to proceed
- Type "revise [additional feedback]" for further updates
```

### Gap Remediation Template

```
🔧 Addressing gap: [restate user's issue]

Fix applied:
- [Fix action 1]
- [Fix action 2]

Re-validation:
✅ [Test result 1]
✅ [Test result 2]

=== CHECKPOINT #4: Final Validation (Gap Remediated) ===
[Re-present with gap fix verified]

Review updated validation results.
- Type "approved" to mark Dream Hive as COMPLETE
- Type "gaps [issue]" if you find other missing functionality
```

---

## Checkpoint Metrics (Self-Check)

Before presenting checkpoint, Queen Hive should verify:

- [ ] All deliverables from phase are complete
- [ ] Checkpoint format matches hitl-checkpoint-map.md specification
- [ ] Approval criteria are clearly stated
- [ ] User knows exactly what to type ("approved" or "revise [feedback]")
- [ ] No placeholder content or broken links
- [ ] Content preview is sufficient to make informed decision

---

## Success Criteria

A checkpoint execution is successful when:

1. **User understands what they're approving** (no confusion)
2. **Approval format is simple** (type one word + optional feedback)
3. **Rejection leads to action** (clear what needs fixing)
4. **No surprises** (user knows what to expect at each gate)

A checkpoint execution FAILS when:

1. User asks "What am I approving?" (unclear presentation)
2. User types ambiguous response (format not clear)
3. Multiple revisions for same issue (fix didn't address feedback)
4. User wants to skip checkpoint (checkpoint isn't valuable)

---

## Protocol Compliance

**Queen Hive MUST:**
- Execute ALL 4 checkpoints in sequence
- PAUSE at each checkpoint for explicit approval
- Handle rejections gracefully (revision loop or gap remediation)
- NOT proceed without "approved" input

**Queen Hive MUST NOT:**
- Skip checkpoints
- Auto-approve on behalf of user
- Proceed on ambiguous input
- Hide errors or incomplete work

**Violation Response:**
If Queen Hive violates checkpoint protocol, user should:
1. Type "protocol violation: [what happened]"
2. Queen Hive acknowledges, returns to correct checkpoint state
3. Re-presents checkpoint properly

---

## Quick Reference

| User Input | Queen Hive Response |
|------------|-------------------|
| `approved` | Proceed to next phase |
| `revise [feedback]` | Update deliverable, re-present checkpoint |
| `gaps [issue]` | Fix gap (Checkpoint #4), re-validate |
| `show [item]` | Display content, stay in checkpoint |
| `help` | Re-explain checkpoint, stay in checkpoint |
| Ambiguous ("ok", "fine") | Ask for explicit "approved" |
| Unrelated question | Answer briefly, return to checkpoint |
| `skip` | Refuse, explain checkpoint value |

---

## Final Notes

- **Simplicity is key:** One approval word, one revision pattern, one gap fix loop
- **No surprises:** User knows all 4 checkpoints exist from the start
- **Clear expectations:** Every checkpoint template shows exactly what to type
- **Graceful rejection:** Revisions are normal, not failures

This protocol ensures HITL gates are helpful, not bureaucratic.
