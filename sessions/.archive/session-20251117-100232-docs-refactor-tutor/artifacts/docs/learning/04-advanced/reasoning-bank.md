# ReasoningBank Learning

> **Note**: Mastery topic. Your agents will learn from experience and improve over time.

Cross-session pattern storage, trajectory tracking, and continuous improvement through learned patterns.

## What is ReasoningBank?

**Definition**: A learning system that stores successful patterns from past sessions and automatically applies them in future sessions.

**Think of it like**: Organizational memory that makes your agents smarter over time.

**Components**:
- **Pattern storage**: Successful approaches from past projects
- **Trajectory tracking**: Decision paths that led to success
- **Success rate measurement**: How well patterns work
- **Auto-application**: Agents retrieve and use patterns automatically
- **Continuous improvement**: Patterns refine over time

## Why ReasoningBank Matters

**Without ReasoningBank**:
```
Session 1: Build auth system, figure out JWT best practices (progressive mastery)
Session 2: Build another auth system, figure out JWT again (progressive mastery)
Session 3: Build another auth system, figure out JWT again (progressive mastery)

Total: 1progressive mastery, no learning
```

**With ReasoningBank**:
```
Session 1: Build auth system, figure out JWT, store pattern (progressive mastery)
Session 2: Retrieve JWT pattern, apply automatically (1 hour)
Session 3: Use refined pattern, even faster (30 min)

Total: 5at your own pace, continuous improvement
Improvement: 54% faster, better quality each time
```

## Pattern Storage

**What gets stored**:
- Successful architectures
- Implementation approaches
- Security patterns
- Performance optimizations
- Error handling strategies
- Testing approaches
- Deployment workflows

**Storage format**:

```javascript
// Store authentication pattern
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "pattern/authentication/jwt-with-refresh",
  value: JSON.stringify({
    // Pattern metadata
    pattern_id: "auth-jwt-refresh",
    domain: "authentication",
    created: "2025-11-15",
    updated: "2025-11-17",

    // Success metrics
    sessions_used: 5,
    success_rate: 95,  // Started at 85%, improved to 95%
    avg_implementation_time_hours: 1.5,  // Down from progressive mastery

    // Pattern approach
    approach: "JWT access tokens + refresh tokens",
    architecture: {
      access_token: {
        storage: "httpOnly cookie",
        ttl: "15min",
        claims: ["user_id", "role", "permissions"]
      },
      refresh_token: {
        storage: "httpOnly cookie + database",
        ttl: "7days",
        rotation: "on each refresh"
      },
      security: {
        csrf_protection: true,
        same_site: "strict",
        secure_flag: true
      }
    },

    // Implementation details
    implementation: {
      backend: "Node.js + Express",
      database: "PostgreSQL (refresh token table)",
      library: "jsonwebtoken@9.0",
      middleware: "auth-middleware.js"
    },

    // Code snippets (reusable)
    code_snippets: {
      token_generation: "...",
      token_validation: "...",
      refresh_logic: "..."
    },

    // Lessons learned
    lessons: [
      "Short access token TTL (15min) limits damage from theft",
      "Refresh token rotation prevents replay attacks",
      "Database storage enables revocation",
      "CSRF protection essential with cookies"
    ],

    // Common pitfalls avoided
    anti_patterns: [
      "Don't store access tokens in localStorage (XSS risk)",
      "Don't use long-lived access tokens (security risk)",
      "Don't forget to handle token expiry gracefully"
    ],

    // Related patterns
    related: [
      "pattern/authentication/oauth2-integration",
      "pattern/authentication/password-reset",
      "pattern/security/rate-limiting"
    ]
  }),
  namespace: "reasoning-bank"
})
```

## Trajectory Tracking

**What is a trajectory?**: The sequence of decisions that led to a successful outcome.

**Example trajectory**:

```javascript
// Store successful trajectory
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "trajectory/session-20251115-auth-system/decisions",
  value: JSON.stringify({
    session_id: "session-20251115-auth-system",
    project: "Authentication system",
    outcome: "success",

    // Decision sequence
    decisions: [
      {
        step: 1,
        decision: "Choose JWT over session tokens",
        reasoning: "Stateless, scales better, works with microservices",
        alternatives_considered: ["session tokens", "OAuth only"],
        outcome: "Correct - enabled easy scaling"
      },
      {
        step: 2,
        decision: "Use httpOnly cookies over localStorage",
        reasoning: "Protection against XSS attacks",
        alternatives_considered: ["localStorage", "sessionStorage"],
        outcome: "Correct - prevented XSS in security audit"
      },
      {
        step: 3,
        decision: "15-minute access token TTL",
        reasoning: "Balance security and UX",
        alternatives_considered: ["1 hour", "5 minutes"],
        outcome: "Correct - good security without annoying users"
      },
      {
        step: 4,
        decision: "Refresh token rotation",
        reasoning: "Prevents replay attacks",
        alternatives_considered: ["No rotation", "Rotation with grace period"],
        outcome: "Correct - passed security audit"
      }
    ],

    // What worked
    successes: [
      "httpOnly cookies prevented XSS",
      "Short TTL limited damage from token theft",
      "Refresh rotation passed security audit"
    ],

    // What didn't work (initially)
    failures: [
      "First attempt: 1-hour TTL too long (security team rejected)",
      "First attempt: No CSRF protection (failed review)"
    ],

    // Adaptations made
    adaptations: [
      "Reduced TTL from 1 hour → 15 minutes",
      "Added CSRF protection middleware",
      "Implemented token rotation"
    ],

    // Final outcome
    final_outcome: {
      success: true,
      test_coverage: 98,
      security_audit: "passed",
      performance: "excellent",
      time_to_complete_hours: 4
    }
  }),
  namespace: "reasoning-bank"
})
```

## Pattern Retrieval and Auto-Application

**How agents use ReasoningBank**:

```javascript
Task("Backend Developer with Learning", `
  PROJECT: Build authentication for new app

  LEARNING-ENABLED WORKFLOW:

  STEP 1: Query ReasoningBank
  1. Search for authentication patterns:
     pattern = memory.search("pattern/authentication/*", "reasoning-bank")

  2. Found: "pattern/authentication/jwt-with-refresh"
     - Success rate: 95%
     - Used in 5 projects
     - Avg time: at your own pace

  STEP 2: Retrieve Pattern Details
  1. Read full pattern from memory
  2. Review: architecture, implementation, lessons learned
  3. Adapt to current project:
     - Backend: Node.js ✓ (matches pattern)
     - Database: PostgreSQL ✓ (matches pattern)
     - Requirements: Secure auth ✓ (pattern fits)

  STEP 3: Apply Pattern
  1. Use architecture from pattern as foundation
  2. Adapt code snippets to current project
  3. Apply lessons learned (avoid anti-patterns)
  4. Implement following successful trajectory

  STEP 4: Enhance and Store
  1. Make project-specific adaptations
  2. Measure success (tests, security, performance)
  3. If successful: Update pattern with improvements
     - Increment success rate if worked well
     - Add new lessons learned
     - Update avg implementation time
  4. If failed: Store what went wrong (learn from failures too)

  EXPECTED TIME: at your own pace (vs progressive mastery from scratch)
  EXPECTED QUALITY: 95% (proven pattern)
`, "backend-dev")
```

## Continuous Improvement Loop

**How patterns improve over time**:

```
Session 1: Create pattern
  - Success rate: 85%
  - Time: progressive mastery
  - Store baseline pattern

Session 2: Use pattern, refine
  - Success rate: 90% (improved)
  - Time: progressive mastery (faster)
  - Update pattern with improvements

Session 3: Use refined pattern
  - Success rate: 95% (better)
  - Time: at your own pace (even faster)
  - Update pattern with new lessons

Session 4: Use optimized pattern
  - Success rate: 97%
  - Time: 1 hour
  - Pattern now highly refined

Session 5+: Pattern is mature
  - Success rate: 98%+
  - Time: < 1 hour
  - Rarely needs updates
```

**Improvement tracking**:

```javascript
{
  pattern_id: "auth-jwt-refresh",

  evolution: [
    {
      version: 1,
      session: "session-20251115-auth-v1",
      success_rate: 85,
      time_hours: 4,
      changes: "Initial pattern created"
    },
    {
      version: 2,
      session: "session-20251117-auth-v2",
      success_rate: 90,
      time_hours: 2,
      changes: "Added CSRF protection, improved token rotation"
    },
    {
      version: 3,
      session: "session-20251120-auth-v3",
      success_rate: 95,
      time_hours: 1.5,
      changes: "Optimized database queries, added rate limiting"
    },
    {
      version: 4,
      session: "session-20251125-auth-v4",
      success_rate: 97,
      time_hours: 1,
      changes: "Added monitoring, improved error handling"
    }
  ],

  current_version: 4,
  mature: true,  // Rarely changes now
  recommended: true  // Widely used, proven
}
```

## Meta-Learning: Learning How to Learn

**ReasoningBank learns patterns about patterns**:

```javascript
// Meta-pattern: When to use JWT vs OAuth
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "meta-pattern/authentication-strategy-selection",
  value: JSON.stringify({
    decision: "Choose authentication strategy",

    decision_tree: {
      question_1: "Third-party login needed (Google, GitHub)?",
      if_yes: "Use OAuth2",
      if_no: {
        question_2: "Microservices architecture?",
        if_yes: "Use JWT (stateless)",
        if_no: {
          question_3: "Need fine-grained session control?",
          if_yes: "Use session tokens",
          if_no: "Use JWT (simpler)"
        }
      }
    },

    learned_from_sessions: 10,
    accuracy: 95,

    examples: [
      {
        project: "E-commerce platform",
        decision: "JWT",
        reasoning: "Microservices + no third-party login",
        outcome: "Correct"
      },
      {
        project: "Social network",
        decision: "OAuth2",
        reasoning: "Login with Google/Facebook",
        outcome: "Correct"
      }
    ]
  }),
  namespace: "reasoning-bank"
})
```

## Real Example: This Documentation Session

**Patterns learned from this session**:

```javascript
// Pattern: Progressive disclosure documentation
mcp__claude_flow_alpha__memory_usage({
  action: "store",
  key: "pattern/documentation/progressive-disclosure-learning-path",
  value: JSON.stringify({
    pattern_id: "doc-progressive-disclosure",
    domain: "documentation",

    approach: "00-04 progressive levels (start-here → foundations → skills → intermediate → advanced)",

    structure: {
      level_0: "Orientation and motivation",
      level_1: "Foundations (Phase 1: Foundations, Foundations phase)",
      level_2: "Essential skills (Phase 2: Essential Skills, Essential skills phase)",
      level_3: "Intermediate (Phase 3: Intermediate, Intermediate phase)",
      level_4: "Advanced (Phase 4: Advanced, ongoing)"
    },

    key_principles: [
      "Start with 'why' before 'how'",
      "Provide time estimates for each level",
      "Include checkpoints and self-assessment",
      "Real examples from actual sessions",
      "Hands-on exercises at each level",
      "Progress tracker for motivation"
    ],

    success_metrics: {
      completion_rate: "TBD (new pattern)",
      user_feedback: "TBD",
      time_to_mastery: "2-3 months estimated"
    },

    next_application: "Apply to other complex technical topics",

    lessons: [
      "Progressive disclosure reduces overwhelm",
      "Real examples more effective than abstract theory",
      "Self-assessment helps gauge readiness",
      "Time estimates help with planning"
    ]
  }),
  namespace: "reasoning-bank"
})
```

**Future session**: When creating documentation again, retrieve this pattern and apply it.

## You'll Know You Understand When...

✅ You store patterns from successful projects
✅ Agents auto-retrieve patterns in new sessions
✅ Your implementation time decreases over sessions
✅ Success rates improve over time
✅ You track trajectory decisions and learn from them

## Practice Exercise

**Build a learning loop**:

**Session 1**: Build a feature (e.g., user registration)
- Track all decisions made
- Store successful approach as pattern
- Measure time and success rate

**Session 2**: Build similar feature (e.g., password reset)
- Retrieve pattern from Session 1
- Apply pattern
- Measure time (should be faster)
- Update pattern with improvements

**Session 3**: Build another feature
- Retrieve refined pattern
- Apply
- Measure (should be even faster)

**Success criteria**:
- Time decreases each session
- Success rate increases
- Pattern becomes more refined

## Mastery Complete!

You've now learned:
✅ Hive-mind coordination (full integration)
✅ Byzantine consensus (fault-tolerant decisions)
✅ Adaptive topology (runtime optimization)
✅ ReasoningBank learning (continuous improvement)

**You are now a claude-flow master.**

→ **Next**: Build production systems, contribute patterns, teach others!

---

**Final Note**: Mastery is a journey, not a destination. Keep learning, keep building, keep improving. Your agents will too.
