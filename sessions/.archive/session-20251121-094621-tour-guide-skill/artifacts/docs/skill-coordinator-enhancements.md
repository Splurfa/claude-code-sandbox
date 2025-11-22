# Skill Coordinator Enhancements

## Overview

The skill-coordinator.js module has been enhanced with specialized reference methods for 8 key workspace skills, maintaining the "show don't do" boundary principle throughout.

## Enhanced Capabilities

### 1. Core Reference Methods

#### `getReferenceText(skillName, context)`
Enhanced to provide specialized formatting for 8 key skills.

**Parameters:**
- `skillName` (string): Name of skill to reference
- `context` (string): Format context - 'inline', 'sectionFooter', or 'detailed'

**Returns:** Formatted reference text with emphasis on "show don't do"

**Example:**
```javascript
const ref = getReferenceText('tutor-mode', 'inline');
// Returns formatted text showing how to invoke tutor-mode without invoking it
```

#### `getComparisonText(skill1, skill2)`
Enhanced with specialized comparisons for key skill pairs.

**Special Comparisons:**
- `tour-guide` vs `tutor-mode` - Shows vs teaches comparison
- `tour-guide` vs `meta-skill` - Orientation vs discovery
- `swarm-orchestration` vs `hive-mind-advanced` - Distributed vs centralized

**Example:**
```javascript
const comparison = getComparisonText('tour-guide', 'tutor-mode');
// Returns markdown table showing key differences
```

#### `getInvocationExample(skillName)`
Enhanced with stronger boundary reminders and better formatting.

**Returns:** Complete invocation instructions with:
- Primary invocation method
- Alternative methods
- Concrete examples
- Feature list
- Strong "show don't do" boundary reminder

### 2. Specialized Reference Methods

Eight dedicated methods for key skills, each providing rich, context-appropriate references:

#### `getTutorModeReference(topic)`
References tutor-mode for hands-on practice.

**Parameters:**
- `topic` (string): Topic for practice exercises (default: 'this topic')

**Usage:**
```javascript
const ref = getTutorModeReference('memory coordination');
// Returns reference suggesting tutor-mode for memory coordination practice
```

**Output includes:**
- Invocation methods (slash command and Skill tool)
- Interactive exercise features
- Clear boundary statement

#### `getMetaSkillReference()`
References meta-skill for capability discovery.

**Usage:**
```javascript
const ref = getMetaSkillReference();
// Returns reference for exploring all 49 skills
```

**Output includes:**
- Catalog browsing capabilities
- Filtering options
- Boundary reminder about user control

#### `getSwarmOrchestrationReference()`
References swarm-orchestration for production patterns.

**Usage:**
```javascript
const ref = getSwarmOrchestrationReference();
// Returns reference for distributed coordination patterns
```

**Output includes:**
- Topology options
- Consensus mechanisms
- Best use cases (2-5 agents)
- Boundary statement

#### `getHiveMindReference()`
References hive-mind-advanced for queen-led coordination.

**Usage:**
```javascript
const ref = getHiveMindReference();
// Returns reference for centralized swarm coordination
```

**Output includes:**
- Queen orchestration explanation
- Persistent memory features
- Best use cases (5+ agents)
- Boundary reminder

#### `getGithubCodeReviewReference()`
References github-code-review for automated review.

**Usage:**
```javascript
const ref = getGithubCodeReviewReference();
// Returns reference for multi-agent code review
```

**Output includes:**
- Swarm-based review process
- Security and performance analysis
- Quality scoring features
- Boundary statement

#### `getVerificationQualityReference()`
References verification-quality for quality gates.

**Usage:**
```javascript
const ref = getVerificationQualityReference();
// Returns reference for truth scoring and rollback
```

**Output includes:**
- 0.95 accuracy threshold
- Automatic rollback features
- Production use cases
- Boundary reminder

#### `getPairProgrammingReference()`
References pair-programming for collaborative coding.

**Usage:**
```javascript
const ref = getPairProgrammingReference();
// Returns reference for real-time collaboration
```

**Output includes:**
- Driver/Navigator/Switch modes
- TDD support
- Debugging assistance
- Boundary statement

#### `getSparcMethodologyReference()`
References sparc-methodology for TDD workflows.

**Usage:**
```javascript
const ref = getSparcMethodologyReference();
// Returns reference for systematic SPARC development
```

**Output includes:**
- 5-phase SPARC workflow
- Multi-agent coordination
- TDD automation
- Boundary reminder

### 3. Unified Access Method

#### `getSpecializedReference(skillName, topic)`
Unified access to all specialized references.

**Parameters:**
- `skillName` (string): Name of skill
- `topic` (string, optional): Context topic (only used for tutor-mode)

**Returns:** Specialized reference or null if not available

**Example:**
```javascript
// Get tutor-mode reference with topic
const ref1 = getSpecializedReference('tutor-mode', 'session management');

// Get meta-skill reference
const ref2 = getSpecializedReference('meta-skill');

// Get hive-mind reference
const ref3 = getSpecializedReference('hive-mind-advanced');
```

## "Show Don't Do" Enforcement

### Boundary Principles

All reference methods strictly enforce the "show don't do" boundary:

1. **Never Invoke**: Methods never invoke skills automatically
2. **Clear Instructions**: Always show exactly how to invoke
3. **User Control**: Emphasize user agency and control
4. **Context Appropriate**: Provide context on when to use each skill
5. **Explicit Reminders**: Include clear boundary reminders in output

### Example Boundary Statements

From `getTutorModeReference`:
```
**Note**: I'm showing you how to invoke tutor-mode, but I won't do it automatically.
You decide when you're ready for hands-on practice.
```

From `getHiveMindReference`:
```
**Note**: I'm showing you how queen-led coordination works, not invoking the hive mind.
You decide when you need that level of orchestration.
```

From `getInvocationExample`:
```
**"Show Don't Do" Boundary**:
The tour-guide won't invoke this for you - you control when to engage.
This ensures you maintain agency over your learning journey.
```

## Progressive Skill Introduction

### By Proficiency Level

**Beginner:**
- Primary: `tutor-mode`, `meta-skill`, `session-closeout`
- Defer: Advanced skills like swarm-orchestration, hive-mind-advanced

**Intermediate:**
- Add: `swarm-orchestration`, `pair-programming`
- Still defer: Expert skills like verification-quality

**Advanced:**
- Add: `hive-mind-advanced`, `github-code-review`, `verification-quality`
- Full access to most skills

**Expert:**
- All skills available
- Focus on `sparc-methodology`, contribution patterns

### Context-Aware Suggestions

The coordinator provides context-aware suggestions:

```javascript
// For learning contexts
const ref = getTutorModeReference('agent coordination');

// For discovery contexts
const ref = getMetaSkillReference();

// For production contexts
const ref = getSwarmOrchestrationReference();

// For large-scale contexts
const ref = getHiveMindReference();
```

## Integration with Tour-Guide

### Usage in Pathways

**Beginner Pathway:**
```javascript
// After explaining memory coordination
const tutorRef = getTutorModeReference('memory coordination');
// Show reference, let user decide

// When user asks "what else can I do?"
const metaRef = getMetaSkillReference();
// Show discovery options
```

**Advanced Pathway:**
```javascript
// When discussing multi-agent coordination
const swarmRef = getSwarmOrchestrationReference();
// Show production patterns

// For large swarms
const hiveRef = getHiveMindReference();
// Show queen-led coordination
```

**Expert Pathway:**
```javascript
// For code quality
const verifyRef = getVerificationQualityReference();
// Show quality gates

// For automated review
const reviewRef = getGithubCodeReviewReference();
// Show review automation
```

### Comparison Usage

```javascript
// When user asks about differences
const comparison = getComparisonText('tour-guide', 'tutor-mode');
// Returns markdown table showing key differences

// For coordination patterns
const coordComparison = getComparisonText('swarm-orchestration', 'hive-mind-advanced');
// Returns distributed vs centralized comparison
```

## Implementation Details

### No Auto-Invocation

**Critical Design Principle:**

All methods in skill-coordinator.js:
- Return TEXT about skills
- Return INSTRUCTIONS for invocation
- NEVER call Skill tool or slash commands
- NEVER trigger automatic skill invocation
- NEVER use callbacks or event handlers to invoke skills

### Text-Only Returns

All methods return formatted strings (markdown):
- Skill descriptions
- Invocation instructions
- Feature lists
- Boundary reminders

**Example:**
```javascript
// ✅ CORRECT: Returns text
const text = getTutorModeReference('memory');
console.log(text); // Displays instructions

// ❌ WRONG: Would invoke skill (this doesn't exist in our code)
// getTutorModeReference('memory', { autoInvoke: true }); // NOT IMPLEMENTED
```

### Testing "Show Don't Do"

**Validation Checklist:**
- [ ] Method returns string only
- [ ] No skill invocation in code
- [ ] Clear boundary statements in output
- [ ] Invocation instructions provided
- [ ] User control emphasized
- [ ] Context appropriate to proficiency level

## Usage Examples

### Example 1: Inline Learning Suggestion

```javascript
const skillCoordinator = require('./lib/skill-coordinator');

// After explaining a concept
const topic = 'session management';
const suggestion = skillCoordinator.getTutorModeReference(topic);

console.log(suggestion);
// User sees: "Want hands-on practice with session management?"
// User sees: "Invoke: /tutor-mode 'session management'"
// User sees: "**Note**: I won't invoke it for you..."
```

### Example 2: Skill Discovery

```javascript
// When user asks "what else exists?"
const discovery = skillCoordinator.getMetaSkillReference();

console.log(discovery);
// User sees: "Curious what other capabilities exist?"
// User sees: "Invoke: /meta-skill"
// User sees: "**Note**: I'm showing you how to explore skills..."
```

### Example 3: Advanced Coordination

```javascript
// When discussing production coordination
const proficiencyLevel = 'advanced';

if (proficiencyLevel === 'advanced' || proficiencyLevel === 'expert') {
  const coordRef = skillCoordinator.getSwarmOrchestrationReference();
  console.log(coordRef);
}
```

### Example 4: Skill Comparison

```javascript
// When user asks about differences
const comparison = skillCoordinator.getComparisonText(
  'swarm-orchestration',
  'hive-mind-advanced'
);

console.log(comparison);
// User sees markdown table with:
// - Style: Peer coordination vs Centralized queen
// - Topology: Mesh/ring/star vs Hierarchical
// - Best for: Distributed vs Large-scale
```

### Example 5: Progressive Introduction

```javascript
const level = 'beginner';

// Get suggestions for current level
const suggestions = skillCoordinator.getProgressiveSkillSuggestions(
  level,
  'coordination'
);

// Show top 3 suggestions
suggestions.slice(0, 3).forEach(skillName => {
  const ref = skillCoordinator.getSpecializedReference(skillName);
  if (ref) console.log(ref);
});
```

## Success Metrics

### Boundary Adherence
- **100%** of methods return text only
- **Zero** automatic skill invocations
- **Clear** boundary statements in all outputs

### User Agency
- User decides when to invoke skills
- User controls learning depth
- User maintains navigation control

### Discoverability
- 8 key skills have specialized references
- All skills accessible via unified method
- Context-appropriate suggestions based on level

## Maintenance Notes

### Adding New Skills

To add a new specialized reference:

1. Add skill to `SKILL_REFERENCES` object
2. Create dedicated `get[SkillName]Reference()` method
3. Add to `getSpecializedReference()` mapping
4. Update module exports
5. Document in this file

### Modifying Boundaries

When modifying boundary behavior:
1. Ensure "show don't do" maintained
2. Test that no auto-invocation occurs
3. Verify boundary reminders present
4. Update documentation

### Testing

Test all methods return:
- String output only
- No side effects
- No skill invocations
- Clear instructions
- Boundary reminders

## Conclusion

The skill-coordinator.js enhancements provide rich, context-aware references to 8 key workspace skills while strictly maintaining the "show don't do" boundary. Users receive clear guidance on how to invoke skills without losing agency over their learning journey.

**Core Principle:** The tour-guide shows the way; users decide when to walk it.
