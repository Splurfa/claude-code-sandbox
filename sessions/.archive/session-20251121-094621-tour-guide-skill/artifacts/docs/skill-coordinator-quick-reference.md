# Skill Coordinator Quick Reference

## One-Liner

"Show don't do" - reference skills without invoking them.

## 8 Key Skills

### Learning & Discovery
1. **tutor-mode** - Interactive exercises with feedback
2. **meta-skill** - Discover all 49 skills

### Coordination Patterns
3. **swarm-orchestration** - Distributed multi-agent (2-5 agents)
4. **hive-mind-advanced** - Queen-led coordination (5+ agents)

### Code Quality
5. **github-code-review** - Automated PR review with AI swarms
6. **verification-quality** - Truth scoring + automatic rollback

### Development Workflows
7. **pair-programming** - Driver/Navigator/Switch modes
8. **sparc-methodology** - Systematic TDD workflows

## Quick API

### Get Specialized Reference
```javascript
const ref = getSpecializedReference('tutor-mode', 'memory coordination');
```

### Get Any Reference
```javascript
const ref = getReferenceText('hive-mind-advanced', 'detailed');
```

### Compare Skills
```javascript
const comp = getComparisonText('tour-guide', 'tutor-mode');
```

### Show Invocation
```javascript
const how = getInvocationExample('swarm-orchestration');
```

### Dedicated Methods
```javascript
getTutorModeReference(topic)           // Learning practice
getMetaSkillReference()                // Discovery
getSwarmOrchestrationReference()       // Distributed coordination
getHiveMindReference()                 // Queen-led coordination
getGithubCodeReviewReference()         // Code review
getVerificationQualityReference()      // Quality gates
getPairProgrammingReference()          // Collaborative coding
getSparcMethodologyReference()         // TDD workflows
```

## Boundary Rules

### ✅ DO
- Return formatted text
- Show how to invoke
- Explain what skills do
- Provide context
- Emphasize user control

### ❌ DON'T
- Invoke skills automatically
- Call Skill tool
- Use callbacks to trigger invocation
- Remove user agency
- Skip boundary reminders

## Output Format

All methods return markdown strings with:
1. **Skill name and purpose**
2. **Invocation methods** (slash command + Skill tool)
3. **Key features/capabilities**
4. **Best use cases**
5. **"Show don't do" boundary reminder**

## Progressive Introduction

| Level | Primary Skills |
|-------|---------------|
| **Beginner** | tutor-mode, meta-skill, session-closeout |
| **Intermediate** | + swarm-orchestration, pair-programming |
| **Advanced** | + hive-mind-advanced, github-code-review, verification-quality |
| **Expert** | + sparc-methodology, all skills |

## Integration Pattern

```javascript
// 1. Import coordinator
const skillCoordinator = require('./lib/skill-coordinator');

// 2. Get reference for context
const ref = skillCoordinator.getTutorModeReference('session management');

// 3. Display to user (don't invoke!)
console.log(ref);

// 4. User decides when to invoke
// User types: /tutor-mode "session management"
```

## Key Comparisons

### tour-guide vs tutor-mode
| Aspect | tour-guide | tutor-mode |
|--------|-----------|-----------|
| Goal | Orient | Teach |
| Method | Examples | Exercises |
| Depth | Survey | Mastery |

### swarm-orchestration vs hive-mind-advanced
| Aspect | swarm-orchestration | hive-mind-advanced |
|--------|-----------|-----------|
| Style | Distributed | Centralized |
| Agents | 2-5 | 5+ |
| Memory | Per-agent | Persistent |

### tour-guide vs meta-skill
| Aspect | tour-guide | meta-skill |
|--------|-----------|-----------|
| Goal | Workspace | Skills |
| Method | Tour | Menu |
| Best for | New users | Finding capabilities |

## Testing Checklist

- [ ] Method returns string only
- [ ] No automatic invocation
- [ ] Clear boundary statement
- [ ] Invocation instructions provided
- [ ] User control emphasized
- [ ] Context appropriate

## File Location

`sessions/session-20251121-094621-tour-guide-skill/artifacts/code/tour-guide/lib/skill-coordinator.js`

## Documentation

Full documentation: `skill-coordinator-enhancements.md`

## Remember

**"The tour-guide shows the way; users decide when to walk it."**
