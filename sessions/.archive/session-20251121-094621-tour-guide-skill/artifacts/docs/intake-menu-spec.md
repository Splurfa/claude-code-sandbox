# Intake Menu Specification

## Overview

The intake menu assesses user proficiency and routes to the appropriate tour pathway. It uses a brief, non-intimidating questionnaire that reveals technical depth progressively.

## Design Goals

1. **Quick Assessment**: 3-5 questions maximum
2. **Non-Threatening**: Avoid gatekeeping language
3. **Accurate Routing**: Match users to appropriate pathway
4. **Override Option**: Allow manual level selection
5. **Context Awareness**: Adapt questions based on previous answers

## Menu Flow

### Initial Greeting

```
╔══════════════════════════════════════════════════════════╗
║           Welcome to Common-Thread Workspace             ║
╚══════════════════════════════════════════════════════════╝

I'll help you explore this workspace at a pace that matches
your experience level. This quick assessment (3 questions)
will help me tailor the tour to your needs.

Ready to start? (Or skip to manual selection below)
```

### Question 1: AI Agent Familiarity

```
Question 1 of 3: AI Agent Experience
────────────────────────────────────

How familiar are you with multi-agent AI systems?

A) New to me - what's a multi-agent system?
B) I've heard of them but haven't used one
C) I've used Claude Code or similar AI assistants
D) I've built or coordinated multi-agent workflows

[Enter A, B, C, or D]
```

**Routing Logic:**
- **A** → Strong signal for Beginner
- **B** → Lean Beginner, check Q2
- **C** → Lean Intermediate, check Q2
- **D** → Lean Advanced, check Q2/Q3

### Question 2: Claude Code Experience

```
Question 2 of 3: Claude Code Familiarity
────────────────────────────────────────

Have you used Claude Code before?

A) First time using Claude Code
B) I've used Claude Code for simple tasks
C) Regular Claude Code user, new to this workspace
D) Experienced with Claude Code + multi-agent patterns

[Enter A, B, C, or D]
```

**Routing Logic:**
- **A** + Q1:A → Beginner (locked)
- **A** + Q1:B → Beginner
- **B** + Q1:C → Intermediate
- **C** + Q1:C/D → Intermediate or Advanced
- **D** + Q1:D → Advanced or Expert (check Q3)

### Question 3: Technical Depth Goal (Conditional)

**Trigger Condition**: Q1:D or Q2:D (advanced experience signals)

```
Question 3 of 3: Your Goals Here
─────────────────────────────────

What brings you to this workspace?

A) Learn the basics and start building
B) Understand the architecture and patterns
C) Evaluate stock vs. custom modifications
D) Extend the system with custom capabilities

[Enter A, B, C, or D]
```

**Routing Logic:**
- **A** → Intermediate (practical focus)
- **B** → Advanced (architecture focus)
- **C** → Expert (comparison analysis)
- **D** → Expert (extension patterns)

## Proficiency Routing Matrix

### Decision Table

| Q1 | Q2 | Q3 | → Proficiency Level |
|----|----|----|---------------------|
| A  | A  | -  | Beginner           |
| A  | B  | -  | Beginner           |
| B  | A  | -  | Beginner           |
| B  | B  | -  | Intermediate       |
| C  | B  | -  | Intermediate       |
| C  | C  | -  | Intermediate       |
| C  | D  | A  | Intermediate       |
| D  | C  | B  | Advanced           |
| D  | D  | B  | Advanced           |
| D  | D  | C  | Expert             |
| D  | D  | D  | Expert             |

### Boundary Cases

**Ambiguous Signals** (e.g., Q1:C + Q2:A):
- Default to Intermediate
- Explain: "Based on your responses, I'm starting with Intermediate. You can jump to Beginner or Advanced anytime with `/tour jump [level]`"

**Skipped Questions**:
- Default to Intermediate
- Offer explicit level selection menu

## Manual Selection Menu

### Always Available Option

```
──────────────────────────────────────────────────────
Or skip the questionnaire and choose your level:

1. Beginner - "I'm new to AI agents and Claude Code"
2. Intermediate - "I know Claude Code, new to this workspace"
3. Advanced - "I want architectural depth and patterns"
4. Expert - "Show me the full technical details"

[Enter 1, 2, 3, or 4]
──────────────────────────────────────────────────────
```

## Level Descriptions

### Beginner Pathway
**Target Audience**:
- First-time Claude Code users
- Minimal multi-agent experience
- Need high-level orientation

**Content Focus**:
- What is this workspace?
- Core concepts in plain language
- Step-by-step examples
- Frequent check-ins

**Estimated Time**: 20-30 minutes

### Intermediate Pathway
**Target Audience**:
- Regular Claude Code users
- Some multi-agent exposure
- Want practical patterns

**Content Focus**:
- Workspace architecture overview
- Session management workflow
- Agent spawning basics
- Memory coordination intro
- File routing rules

**Estimated Time**: 30-45 minutes

### Advanced Pathway
**Target Audience**:
- Experienced Claude Code users
- Multi-agent coordination experience
- Seek architectural understanding

**Content Focus**:
- Deep architecture dive
- Custom modifications overview
- Advanced coordination patterns
- Performance optimization
- Extension points

**Estimated Time**: 45-60 minutes

### Expert Pathway
**Target Audience**:
- System architects
- Framework developers
- Want to extend or modify

**Content Focus**:
- Stock vs. custom comparison
- Implementation internals
- Extension architecture
- Contribution guidelines
- Advanced use cases

**Estimated Time**: 60-90 minutes

## Pathway Transition Rules

### User-Initiated Switches

**Command**: `/tour jump [level]`

**Allowed Transitions**:
- Any level → Any level (unrestricted)
- No confirmation required
- State resets to start of new pathway
- Previous progress not saved

**Example**:
```
User: /tour jump beginner
System: Switching to Beginner pathway. Starting from the beginning.
        Use /tour jump intermediate to return to Intermediate level.
```

### System-Suggested Switches

**Trigger Conditions**:
1. User asks questions beyond current pathway depth
2. User uses advanced terminology inconsistent with level
3. User explicitly says "this is too easy/hard"

**Handling**:
```
I notice you're asking about [advanced topic]. This is covered
in the Advanced pathway. Would you like to:

A) Jump to Advanced pathway
B) Get a brief answer and continue here
C) Bookmark this for later

[Enter A, B, or C]
```

## Intake State Management

### Session Variables

```javascript
{
  intakeCompleted: true,
  q1Response: "C",
  q2Response: "D",
  q3Response: "A",
  selectedLevel: "intermediate",
  manualOverride: false,
  timestamp: "2025-11-21T09:46:21Z"
}
```

### Resumption Handling

**Scenario 1**: User invokes `/tour` again in same conversation
```
Welcome back! You're currently on the Intermediate pathway
at section: Session Management.

Options:
- /tour next - Continue where you left off
- /tour jump [level] - Switch proficiency levels
- /tour reset - Restart intake
```

**Scenario 2**: User invokes `/tour` in new conversation
```
Welcome to Common-Thread Workspace!

Let me help you get oriented. First, let me assess your
experience level...

[Restart intake from Q1]
```

## User Experience Considerations

### Question Clarity
- **Avoid jargon** in question text
- **Provide examples** in answer choices
- **No wrong answers** - every level is valid

### Pace & Rhythm
- **Brief intro** before each question
- **Progress indicator** (Question X of Y)
- **Quick feedback** after selection

### Accessibility
- **Letter choices** (A/B/C/D) not numbers
- **Keyboard-friendly** (no mouse required)
- **Clear visual hierarchy**

### Psychological Safety
- **Non-judgmental language**: "experience level" not "skill level"
- **Emphasize adaptation**: "I'll adjust to your needs"
- **Easy exit**: "Skip to manual selection" always available

## Error Handling

### Invalid Input
```
User: purple
System: Please enter A, B, C, or D. Or type 'skip' to see
        the manual selection menu.
```

### Ambiguous Input
```
User: I don't know
System: No problem! Let me show you the manual selection menu
        with descriptions of each level.
```

### Graceful Degradation
If routing logic encounters unexpected state:
1. Default to Intermediate
2. Log the edge case for future improvement
3. Inform user of default selection
4. Offer manual override

## Testing Scenarios

### Test Case 1: Absolute Beginner
- **Inputs**: Q1:A, Q2:A
- **Expected**: Beginner pathway
- **Verification**: First section uses plain language, no jargon

### Test Case 2: Claude Code Veteran
- **Inputs**: Q1:D, Q2:D, Q3:D
- **Expected**: Expert pathway
- **Verification**: Starts with stock vs. custom comparison

### Test Case 3: Humble Expert
- **Inputs**: Q1:D, Q2:C, Q3:B
- **Expected**: Advanced pathway
- **Verification**: Architecture-focused content

### Test Case 4: Manual Override
- **Inputs**: Skip questionnaire, select level 3
- **Expected**: Advanced pathway
- **Verification**: manualOverride = true in state

### Test Case 5: Mid-Tour Switch
- **Inputs**: Start Intermediate, jump to Beginner at section 3
- **Expected**: Reset to Beginner section 1
- **Verification**: Progress not retained across switch

## Localization Considerations

### Language Support (Future)
- Question text extracted to constants
- Answer choices externalized
- Level descriptions translatable
- Navigation commands localizable

### Cultural Adaptation
- Proficiency labels may need cultural adjustment
- Example scenarios may need localization
- Comfort with self-assessment varies by culture

## Accessibility Standards

### WCAG 2.1 Compliance
- **Perceivable**: Clear text hierarchy
- **Operable**: Keyboard-only navigation
- **Understandable**: Plain language, clear instructions
- **Robust**: Works with screen readers

### Inclusive Design
- **No time limits**: Users proceed at own pace
- **Multiple input methods**: Keyboard + voice
- **Clear escape routes**: Always show exit option

## Success Metrics

### Intake Effectiveness
- **Completion Rate**: % who finish intake vs. manual select
- **Routing Accuracy**: % who stay in selected pathway (don't switch)
- **Time to Complete**: Average seconds to complete intake

### User Satisfaction
- **Clarity**: Post-intake survey "The questions were clear"
- **Relevance**: "The selected level matches my needs"
- **Ease**: "The intake was quick and non-intimidating"

## Conclusion

The intake menu balances speed with accuracy, getting users into the right pathway quickly while maintaining psychological safety. The three-question assessment covers the critical dimensions (AI experience, Claude Code familiarity, goals) while remaining non-threatening. Manual override and mid-tour switching preserve user agency, ensuring the tour adapts to users rather than forcing users to adapt to the tour.
