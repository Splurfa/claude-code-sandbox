# Example: Full-Stack Development Workflow

This example demonstrates a complete full-stack development workflow using claude-flow best practices.

## Scenario

Build a complete user authentication system:
- Backend API (Node.js/Express)
- Frontend UI (React)
- Database schema (PostgreSQL)
- Tests (Jest + React Testing Library)

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Research   │────▶│   Planning   │────▶│  Execution   │
│    Agent     │     │    Agent     │     │   Agents     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │   Testing    │
                                          │   Agent      │
                                          └──────────────┘
```

## Step-by-Step Implementation

### Phase 1: Session Initialization

```bash
# 1. Create session
SESSION_ID="session-20251115-120000-auth-system"
mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts}

# 2. Initialize session (optional hook)
npx claude-flow@alpha hooks session-start \
  --session-id "$SESSION_ID" \
  --load-context
```

### Phase 2: Research & Planning

```javascript
// Spawn research agent via Claude Code
Task(
  "Research Agent",
  `Research authentication best practices.

   Store findings in memory with key: swarm/research/auth-patterns

   Analyze:
   - JWT vs Session cookies
   - Password hashing (bcrypt, argon2)
   - Token refresh patterns
   - Security considerations

   Save research to: sessions/${SESSION_ID}/artifacts/docs/auth-research.md`,
  "researcher"
)

// Research agent executes:
// 1. Pre-task hook fires automatically (if configured)
//    - Loads previous context from memory
//    - Initializes coordination namespace

// 2. Research work
//    - Analyzes authentication patterns
//    - Reviews security best practices
//    - Documents findings

// 3. Store findings in memory
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/research/auth-patterns",
  namespace: "coordination",
  value: JSON.stringify({
    recommendation: "JWT with refresh tokens",
    rationale: "Stateless, mobile-friendly, scalable",
    hashing: "bcrypt (battle-tested)",
    libraries: {
      backend: ["jsonwebtoken", "bcrypt", "express"],
      frontend: ["jwt-decode", "axios"]
    },
    security: [
      "HTTPS only",
      "HttpOnly cookies for refresh tokens",
      "Short-lived access tokens (15min)",
      "Long-lived refresh tokens (7d)"
    ],
    timestamp: Date.now()
  })
}

// 4. Post-task hook fires (if configured)
//    - Analyzes research performance
//    - Stores decisions
//    - Exports learnings
```

### Phase 3: Database Design

```javascript
// Spawn database architect via Claude Code
Task(
  "Database Architect",
  `Design PostgreSQL schema for authentication.

   Read research findings from memory: swarm/research/auth-patterns

   Create schema for:
   - Users table
   - Refresh tokens table
   - Sessions table (optional)

   Store schema in memory with key: swarm/database/auth-schema
   Save to: sessions/${SESSION_ID}/artifacts/code/schema.sql`,
  "code-analyzer"
)

// Database architect executes:
// 1. Read research findings
const research = await mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/research/auth-patterns",
  namespace: "coordination"
}

// 2. Design schema based on findings
const schema = `
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(512) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
`;

// 3. Store schema in memory
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/database/auth-schema",
  namespace: "coordination",
  value: JSON.stringify({
    tables: ["users", "refresh_tokens"],
    relationships: ["refresh_tokens → users (foreign key)"],
    indexes: ["idx_refresh_tokens_user_id", "idx_refresh_tokens_expires_at"],
    schema: schema,
    timestamp: Date.now()
  })
}

// 4. Write to file (post-edit hook fires automatically)
Write(`sessions/${SESSION_ID}/artifacts/code/schema.sql`, schema)
```

### Phase 4: Backend Implementation

```javascript
// Spawn backend developer via Claude Code
Task(
  "Backend Developer",
  `Implement authentication API.

   Read from memory:
   - swarm/research/auth-patterns (architecture decisions)
   - swarm/database/auth-schema (database schema)

   Implement:
   - POST /auth/register
   - POST /auth/login
   - POST /auth/refresh
   - POST /auth/logout
   - Middleware: authenticateToken

   Store API spec in memory with key: swarm/backend/api-spec
   Save to: sessions/${SESSION_ID}/artifacts/code/`,
  "backend-dev"
)

// Backend developer executes:
// 1. Read context from memory
const research = await mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/research/auth-patterns",
  namespace: "coordination"
}

const dbSchema = await mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/database/auth-schema",
  namespace: "coordination"
}

// 2. Implement API
// File: sessions/$SESSION_ID/artifacts/code/auth.routes.js
const authCode = `
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // ... DB insert
});

// Login
router.post('/login', async (req, res) => {
  // ... authentication logic
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  // ... return tokens
});

// ... other endpoints
`;

// 3. Write code (pre-edit & post-edit hooks fire)
Write(`sessions/${SESSION_ID}/artifacts/code/auth.routes.js`, authCode)

// Post-edit hook automatically:
// - Formats code with prettier
// - Stores in memory
// - Trains neural patterns

// 4. Store API spec in memory
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/backend/api-spec",
  namespace: "coordination",
  value: JSON.stringify({
    endpoints: [
      { method: "POST", path: "/auth/register", auth: false },
      { method: "POST", path: "/auth/login", auth: false },
      { method: "POST", path: "/auth/refresh", auth: false },
      { method: "POST", path: "/auth/logout", auth: true }
    ],
    middleware: ["authenticateToken", "errorHandler"],
    dependencies: research.libraries.backend,
    timestamp: Date.now()
  })
}
```

### Phase 5: Frontend Implementation

```javascript
// Spawn frontend developer via Claude Code
Task(
  "Frontend Developer",
  `Build React authentication UI.

   Read API spec from memory: swarm/backend/api-spec

   Create:
   - LoginForm component
   - RegisterForm component
   - useAuth hook
   - AuthContext provider

   Store component list in memory: swarm/frontend/components
   Save to: sessions/${SESSION_ID}/artifacts/code/`,
  "coder"
)

// Frontend developer executes:
// 1. Read API spec
const apiSpec = await mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/backend/api-spec",
  namespace: "coordination"
}

// 2. Implement components based on API
// File: sessions/$SESSION_ID/artifacts/code/LoginForm.jsx
const loginFormCode = `
import React, { useState } from 'react';
import { useAuth } from './useAuth';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
`;

Write(`sessions/${SESSION_ID}/artifacts/code/LoginForm.jsx`, loginFormCode)

// 3. Store component info
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/frontend/components",
  namespace: "coordination",
  value: JSON.stringify({
    components: ["LoginForm", "RegisterForm", "AuthContext"],
    hooks: ["useAuth"],
    api_integration: true,
    dependencies: ["react", "axios", "jwt-decode"],
    timestamp: Date.now()
  })
}
```

### Phase 6: Testing

```javascript
// Spawn test engineer via Claude Code
Task(
  "Test Engineer",
  `Create comprehensive test suite.

   Read from memory:
   - swarm/backend/api-spec (API endpoints)
   - swarm/frontend/components (UI components)

   Create tests for:
   - Backend: auth.routes.test.js
   - Frontend: LoginForm.test.jsx, useAuth.test.js
   - Integration: auth-flow.test.js

   Target: 90%+ coverage
   Save to: sessions/${SESSION_ID}/artifacts/tests/`,
  "tester"
)

// Test engineer executes:
// 1. Read context from memory
const apiSpec = await mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/backend/api-spec",
  namespace: "coordination"
}

const components = await mcp__claude-flow__memory_usage {
  action: "retrieve",
  key: "swarm/frontend/components",
  namespace: "coordination"
}

// 2. Generate tests
// File: sessions/$SESSION_ID/artifacts/tests/auth.routes.test.js
const backendTests = `
describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    it('should create new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });
      expect(res.status).toBe(201);
    });

    it('should reject duplicate email', async () => {
      // ... test
    });
  });

  describe('POST /auth/login', () => {
    it('should return access token', async () => {
      // ... test
    });
  });
});
`;

Write(`sessions/${SESSION_ID}/artifacts/tests/auth.routes.test.js`, backendTests)

// 3. Store test results
mcp__claude-flow__memory_usage {
  action: "store",
  key: "swarm/testing/results",
  namespace: "coordination",
  value: JSON.stringify({
    backend_tests: 12,
    frontend_tests: 8,
    integration_tests: 4,
    coverage: 92,
    passing: true,
    timestamp: Date.now()
  })
}
```

### Phase 7: Session Closeout

```bash
# Generate summary and backup
npx claude-flow@alpha hooks session-end \
  --session-id "$SESSION_ID" \
  --export-metrics \
  --generate-summary

# This creates:
# .swarm/backups/session-20251115-120000-auth-system.json

# Backup contains:
{
  "session_id": "session-20251115-120000-auth-system",
  "closed_at": "2025-11-15T18:30:00Z",
  "summary": "Built complete authentication system with JWT",
  "artifacts": {
    "code": [
      "schema.sql",
      "auth.routes.js",
      "auth.middleware.js",
      "LoginForm.jsx",
      "RegisterForm.jsx",
      "useAuth.js"
    ],
    "tests": [
      "auth.routes.test.js",
      "LoginForm.test.jsx",
      "useAuth.test.js",
      "auth-flow.test.js"
    ],
    "docs": ["auth-research.md"]
  },
  "memory_snapshot": {
    "decisions": ["JWT with refresh tokens", "bcrypt for hashing"],
    "architecture": ["PostgreSQL users table", "Separate refresh_tokens table"],
    "api_endpoints": 4,
    "components": 3
  },
  "metrics": {
    "agents_used": 5,
    "files_created": 10,
    "tests_written": 24,
    "test_coverage": 92,
    "duration_minutes": 45,
    "lines_of_code": 856
  }
}
```

## Memory State After Completion

```javascript
// Research findings
swarm/research/auth-patterns → {
  recommendation: "JWT",
  libraries: {...},
  security: [...]
}

// Database design
swarm/database/auth-schema → {
  tables: ["users", "refresh_tokens"],
  schema: "CREATE TABLE..."
}

// Backend implementation
swarm/backend/api-spec → {
  endpoints: [...],
  middleware: [...]
}

// Frontend implementation
swarm/frontend/components → {
  components: ["LoginForm", "RegisterForm"],
  hooks: ["useAuth"]
}

// Testing results
swarm/testing/results → {
  coverage: 92,
  passing: true
}
```

## Key Patterns Demonstrated

1. **Memory Coordination:** Agents share context via memory keys
2. **Sequential Dependencies:** Each phase reads previous phase output
3. **Hook Automation:** pre/post hooks fire automatically
4. **Session Management:** All work in session directory
5. **Stock-First:** 100% stock claude-flow hooks and memory
6. **Claude Code Execution:** Task tool spawns all agents

## Benefits

- **No manual coordination:** Memory handles context sharing
- **Automatic formatting:** Post-edit hooks format all code
- **Continuous learning:** Neural patterns trained from edits
- **Complete audit trail:** Session backup captures everything
- **Reproducible:** Can restore session and continue work

## Metrics

- **Agents:** 5 (Research, Database, Backend, Frontend, Tester)
- **Files:** 10 code files, 4 test files, 1 doc
- **Memory Keys:** 5 (research, database, backend, frontend, testing)
- **Hooks Fired:** ~30 (pre-edit, post-edit, pre-task, post-task, session-end)
- **Time:** ~45 minutes
- **Coordination Overhead:** <5 seconds total (all hooks async)
