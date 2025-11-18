---
name: Prompt Improver
description: Interactive prompt refinement assistant that analyzes user requests, suggests improvements, and adapts to different interaction modes. Uses confirmation protocol for transparent collaboration and learning logs for continuous improvement.
version: 1.0.0
category: productivity
tags: [prompt-engineering, interaction, learning, user-experience]
---

# Prompt Improver

Intelligent prompt refinement assistant that helps users craft better requests through collaborative improvement and adaptive interaction modes.

## What This Skill Does

This skill analyzes user prompts, identifies potential improvements, and collaboratively refines requests before execution. It adapts between different interaction modes based on user preferences and maintains learning logs to improve suggestions over time.

**Key Capabilities:**
- **Prompt Analysis**: Identifies ambiguities, missing context, and improvement opportunities
- **Interactive Refinement**: Suggests improvements with clear before/after examples
- **Mode Adaptation**: Switches between minimal-intervention, collaborative, and educational modes
- **Learning System**: Tracks user preferences and successful patterns
- **Confirmation Protocol**: Transparent decision-making with explicit user approval
- **Context Awareness**: Understands project-specific patterns and user history

## Prerequisites

**Required:**
- Claude Code environment
- Basic understanding of prompt engineering principles

**Optional:**
- Memory system for learning persistence (claude-flow MCP)
- Session management for tracking improvements over time

## Quick Start

### Enable Prompt Improver

Activate the skill at conversation start:

```
/prompt-improver
```

The assistant will analyze all subsequent prompts and offer refinements when beneficial.

### One-Time Improvement

Use for a single prompt improvement:

```
Improve this prompt: "Fix the auth bug"
```

**Before:**
```
Fix the auth bug
```

**After:**
```
Investigate and fix the authentication bug in the login flow:
1. Identify the specific failing scenario
2. Review relevant code (auth middleware, session handling)
3. Propose a fix with test coverage
4. Verify fix doesn't break existing functionality

Save all work to sessions/$SESSION_ID/artifacts/
```

---

## Core Concepts

### Interaction Modes

The skill operates in three primary modes, adapting to user needs:

#### 1. Minimal-Intervention Mode (Default)

**When to use:** Experienced users with clear, well-formed prompts

**Behavior:**
- Only intervenes for critical issues (safety, file routing violations)
- Silent approval for well-formed prompts
- Minimal friction in workflow

**Example:**
```
User: "Create test suite for the auth API in sessions/current/artifacts/tests/"
Assistant: [Proceeds without intervention - prompt is clear and follows routing rules]
```

#### 2. Collaborative Mode

**When to use:** Regular users working on complex tasks

**Behavior:**
- Suggests improvements with examples
- Asks clarifying questions
- Offers options for ambiguous requests
- Explains reasoning briefly

**Example:**
```
User: "Build a new API"
Assistant: "I notice this request is quite broad. Let me suggest some refinements:

Would you like to build:
1. **REST API** for a specific feature (e.g., user management)?
2. **GraphQL API** with a particular data model?
3. **Real-time API** using WebSockets?

Also, please specify:
- Programming language/framework preference
- Database requirements
- Authentication needs
- Where to save files (suggest: sessions/$SESSION_ID/artifacts/code/)"
```

#### 3. Educational Mode

**When to use:** Learning users who want to understand best practices

**Behavior:**
- Explains why improvements matter
- Teaches prompt engineering principles
- Provides detailed reasoning
- Offers learning resources

**Example:**
```
User: "make it work"
Assistant: "I understand you want to fix something, but this prompt lacks important context. Let me explain why specificity matters:

**Why this prompt is unclear:**
- What is 'it'? (code, feature, test, deployment?)
- What does 'work' mean? (pass tests, run without errors, meet requirements?)
- Where is the problem? (specific file, function, system?)

**Better prompt structure:**
'Fix [specific thing] in [location] so that [expected behavior] happens'

**Example improvement:**
'Fix the login function in src/auth.js so that users with valid credentials can authenticate successfully'

Would you like to try rephrasing your request?"
```

### Confirmation Protocol

The skill uses a transparent decision-making protocol:

#### Silent Approval (Default)

Proceed immediately when prompt is:
- Specific and actionable
- Follows workspace conventions
- Has no safety concerns
- Targets correct file locations

#### Interactive Confirmation

Request approval when:
- Multiple valid interpretations exist
- Significant scope or approach choices needed
- Potential for misunderstanding detected
- User preference unclear

**Confirmation Format:**
```
I understand you want to [interpreted action].

Before I proceed, please confirm:
- [Assumption 1]: [explanation]
- [Assumption 2]: [explanation]

Shall I proceed with this interpretation? (yes/refine/explain)
```

#### Intervention Required

Stop and request clarification when:
- Safety concerns detected (destructive operations, credentials)
- File routing violations (writing to root instead of sessions/)
- Critical ambiguity (unknown target, unclear scope)
- Contradictory requirements

**Intervention Format:**
```
I cannot proceed with this request because: [reason]

To move forward, I need:
1. [Required information]
2. [Clarification needed]

Would you like to provide this information?
```

### Mode Adaptation Logic

The skill adapts modes based on:

#### User Signals

**Switch to Minimal:**
- User says "just do it" or "skip the questions"
- Consistent well-formed prompts (3+ in a row)
- Explicit request: "minimal intervention mode"

**Switch to Collaborative:**
- User asks "what do you think?"
- Prompts vary in quality
- Explicit request: "collaborative mode"

**Switch to Educational:**
- User asks "why?" or "explain"
- Requests for learning resources
- Explicit request: "educational mode" or "teach me"

#### Context Signals

**Auto-minimal when:**
- Working in established session with clear patterns
- Repeating similar tasks
- User expertise demonstrated

**Auto-collaborative when:**
- New session or unfamiliar task
- Complex multi-step requests
- Ambiguous requirements

**Auto-educational when:**
- User is new (first session)
- Asks conceptual questions
- Makes common beginner mistakes

### Learning Log

The skill maintains a learning log to improve over time:

#### What Gets Logged

**User Preferences:**
- Preferred interaction mode
- Communication style (terse/verbose)
- Domain expertise level
- Common patterns

**Successful Patterns:**
- Effective prompt structures
- Well-received improvements
- Useful clarifying questions

**Mistakes to Avoid:**
- Rejected suggestions
- Over-intervention incidents
- Misunderstood requests

#### Log Storage

**With claude-flow MCP:**
```javascript
// Store user preferences
mcp__claude-flow__memory_usage({
  action: "store",
  key: "prompt-improver/user-prefs",
  namespace: "learning",
  value: JSON.stringify({
    mode: "collaborative",
    expertise: "intermediate",
    prefers_options: true
  })
})

// Store successful patterns
mcp__claude-flow__memory_usage({
  action: "store",
  key: "prompt-improver/patterns/api-requests",
  namespace: "learning",
  value: JSON.stringify({
    pattern: "Build [feature] API",
    improvements: ["specify framework", "define data model", "clarify auth"],
    success_rate: 0.92
  })
})
```

**Without MCP:**
- In-session memory only
- Resets each conversation
- Still adapts within single session

---

## Advanced Features

### Prompt Analysis Engine

The skill analyzes prompts across multiple dimensions:

#### Clarity Score

**High (9-10):** Specific, actionable, complete
```
"Implement JWT authentication in src/auth.js with refresh tokens, saving to sessions/current/artifacts/code/"
```

**Medium (5-8):** Mostly clear but missing details
```
"Add authentication to the API"
```

**Low (1-4):** Vague or ambiguous
```
"Fix it"
```

#### Safety Assessment

**Green:** No concerns, proceed normally
**Yellow:** Minor concerns, gentle warning
**Red:** Critical issues, must intervene

**Example Red flags:**
- Credentials in prompts
- Destructive operations without confirmation
- Writing to protected locations
- Potential data loss

#### Context Completeness

**Checks for:**
- Target location specified
- Technology stack clear
- Success criteria defined
- Dependencies identified
- Integration points noted

### Improvement Suggestions

The skill suggests improvements in categories:

#### Specificity

**Before:** "Optimize the database"
**After:** "Optimize PostgreSQL query performance in users table by adding indexes on email and created_at columns"

#### Actionability

**Before:** "The app should be faster"
**After:** "Reduce page load time from 3s to under 1s by implementing code splitting and lazy loading for React components"

#### Context

**Before:** "Write tests"
**After:** "Write Jest unit tests for authentication middleware (src/middleware/auth.js) with 90% coverage, saving to sessions/current/artifacts/tests/"

#### Structure

**Before:** "Build user management"
**After:**
```
Build user management system with:
1. Backend API (CRUD operations)
2. Frontend components (list, form, detail views)
3. Database schema (users table with auth fields)
4. Integration tests
Save to sessions/current/artifacts/
```

### Template Library

Common prompt templates for frequent tasks:

#### Bug Fix Template
```
Fix [specific bug] in [file/component]:
- Symptom: [what's happening]
- Expected: [what should happen]
- Steps to reproduce: [how to trigger it]
- Save fix to: sessions/$SESSION_ID/artifacts/code/
```

#### Feature Implementation Template
```
Implement [feature name]:
- Requirements: [what it should do]
- Tech stack: [languages/frameworks]
- Integration: [how it connects]
- Tests: [coverage expectations]
- Save to: sessions/$SESSION_ID/artifacts/
```

#### Refactoring Template
```
Refactor [component/module]:
- Current issues: [problems to fix]
- Desired outcome: [improvements wanted]
- Constraints: [backwards compatibility, etc.]
- Testing: [verification approach]
- Save to: sessions/$SESSION_ID/artifacts/code/
```

---

## Integration

### With Session Management

```bash
# Session starts, prompt improver activates
/session-start feature-auth

# User prompt (vague)
"add authentication"

# Improved prompt generated
"Implement JWT authentication system:
1. Create middleware in src/middleware/auth.js
2. Add login/logout endpoints
3. Implement token refresh
4. Add tests to sessions/session-YYYYMMDD-HHMMSS-feature-auth/artifacts/tests/"
```

### With Memory Coordination

```javascript
// Remember user's tech preferences
mcp__claude-flow__memory_usage({
  action: "store",
  key: "user/tech-prefs",
  value: JSON.stringify({
    backend: "Node.js/Express",
    frontend: "React",
    database: "PostgreSQL",
    testing: "Jest"
  })
})

// Use preferences to suggest improvements
"Build API" →
"Build Express.js REST API (based on your preference) with PostgreSQL for [feature]?"
```

### With Agent Spawning

```javascript
// Analyze complex prompt
"Build a full-stack app"

// Suggest agent-based approach
"This is a complex multi-domain task. I recommend:

1. Spawn specialized agents via Claude Code Task tool:
   - Backend Developer (API + database)
   - Frontend Developer (React components)
   - Test Engineer (Jest + integration tests)
   - DevOps Engineer (Docker + deployment)

2. Coordinate via memory:
   - Each agent stores decisions
   - Other agents read and adapt
   
Proceed with this approach?"
```

---

## Examples

### Example 1: Vague Request → Clear Specification

**User:**
```
"Make the app better"
```

**Analysis:**
- Clarity: 1/10 (completely vague)
- Safety: Green
- Context: 0/10 (no context)

**Improvement (Collaborative Mode):**
```
I'd love to help improve the app! To provide the best solution, I need more context:

What aspect would you like to improve?
1. **Performance** (load times, responsiveness)
2. **Features** (add new functionality)
3. **UI/UX** (design, user experience)
4. **Code Quality** (refactoring, maintainability)
5. **Security** (auth, data protection)
6. **Testing** (coverage, reliability)

Once you specify, I can suggest concrete improvements.
```

### Example 2: Unsafe Request → Safety Intervention

**User:**
```
"Delete all the test files"
```

**Analysis:**
- Clarity: 9/10 (specific action)
- Safety: RED (destructive operation)
- Context: Unknown scope

**Intervention:**
```
⚠️ I cannot proceed with this request without confirmation.

Deleting test files is a destructive operation that could:
- Remove important test coverage
- Break CI/CD pipelines
- Lose valuable test documentation

Before proceeding, please confirm:
1. Which test files? (specific directory/pattern)
2. Why delete vs. archive?
3. Have you committed current tests to git?
4. Do you want to create a backup first?

If you're trying to clean up, I can suggest safer alternatives:
- Move to archive directory
- Create a new branch for cleanup
- Selective deletion with backup
```

### Example 3: Missing Context → Structured Clarification

**User:**
```
"Add error handling"
```

**Analysis:**
- Clarity: 4/10 (action clear, target unclear)
- Safety: Green
- Context: 2/10 (no location specified)

**Improvement (Collaborative Mode):**
```
I'll help add error handling. To implement this effectively:

**Scope questions:**
1. Where to add it?
   - Specific file/function?
   - Entire module?
   - Application-wide?

2. What type of errors?
   - API errors (network, HTTP)?
   - Database errors?
   - Validation errors?
   - Unexpected exceptions?

3. How to handle them?
   - Log and continue?
   - User-friendly messages?
   - Retry logic?
   - Fallback behavior?

**Suggested prompt:**
"Add try-catch error handling to [file/function] for [error types], with [handling strategy], saving to sessions/$SESSION_ID/artifacts/code/"
```

### Example 4: Well-Formed Request → Silent Approval

**User:**
```
"Implement rate limiting middleware in src/middleware/rateLimit.js using express-rate-limit, allowing 100 requests per 15 minutes per IP, with Redis store for distributed systems. Include tests in sessions/current/artifacts/tests/."
```

**Analysis:**
- Clarity: 10/10 (perfectly specific)
- Safety: Green
- Context: 10/10 (complete requirements)

**Response (Minimal Mode):**
```
[Proceeds immediately with implementation]
```

---

## Best Practices

### For Users

1. **Start Specific**: Include what, where, and why
2. **Specify Locations**: Always mention target directories
3. **Define Success**: State expected outcomes
4. **Ask Questions**: If unsure, ask for options
5. **Provide Context**: Share relevant constraints
6. **Use Templates**: Leverage provided templates for common tasks

### For the Skill

1. **Respect User Time**: Only intervene when value-added
2. **Be Concise**: Clear but not verbose
3. **Offer Options**: Multiple paths when unclear
4. **Explain Reasoning**: Transparent decision-making
5. **Learn Patterns**: Adapt to user preferences
6. **Stay Helpful**: Supportive, not pedantic

---

## Troubleshooting

### Issue: Too Much Intervention

**Symptoms:**
- Constant questions for clear prompts
- Friction in workflow
- Over-explaining obvious things

**Solutions:**
```
# Switch to minimal mode
"Use minimal intervention mode"

# Or provide clearer prompts
"Create tests for auth.js in sessions/current/artifacts/tests/ using Jest with 90% coverage"
```

### Issue: Not Enough Guidance

**Symptoms:**
- Proceeding with unclear requirements
- Missing important context
- Unexpected results

**Solutions:**
```
# Switch to collaborative mode
"Use collaborative mode"

# Or request more guidance
"What information do you need to implement this?"
```

### Issue: Mode Not Adapting

**Symptoms:**
- Stuck in wrong mode
- Not learning from feedback

**Solutions:**
```
# Explicit mode change
"Switch to educational mode"

# Reset learning
"Reset prompt improver preferences"

# Provide feedback
"That was too detailed/too brief"
```

---

## Related Skills

- **SPARC Methodology**: Structured development workflow
- **Hooks Automation**: Automatic file routing and validation
- **Swarm Orchestration**: Multi-agent coordination
- **Session Management**: Proper artifact organization

---

## Learn More

- Prompt Engineering Guide: docs/essentials/prompt-engineering.md
- Interaction Patterns: docs/essentials/interaction-patterns.md
- User Preferences: docs/learning/user-preferences.md

---

**Version History:**
- 1.0.0 (2025-11-18): Initial release with three interaction modes and confirmation protocol
