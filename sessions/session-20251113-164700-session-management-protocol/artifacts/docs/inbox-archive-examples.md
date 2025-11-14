# Inbox Archival - Real World Examples

Practical examples of using the inbox archival system in different scenarios.

---

## Scenario 1: Feature Development Workflow

### Situation
You receive a feature request via email, save it to inbox, and work through specification to implementation.

### Workflow

```bash
# Step 1: Initial feature idea arrives
# Save email/doc as: ./inbox/payment-integration-idea.md

# Step 2: Review and archive to projects
node .swarm/hooks/inbox-archive.js \
  ./inbox/payment-integration-idea.md \
  ./docs/projects/payment-integration/initial-spec.md \
  "Feature request from product team, approved for Q2 2025" \
  "feature,payment,q2,approved"

# Step 3: Work on feature in session
# Creates: ./sessions/2025-11-13-payment-work/artifacts/implementation.js

# Step 4: Archive implementation to codebase
node .swarm/hooks/inbox-archive.js \
  ./sessions/2025-11-13-payment-work/artifacts/implementation.js \
  ./src/features/payment/stripe-integration.js \
  "Implemented Stripe payment integration with webhooks" \
  "implementation,payment,stripe,completed"
```

**Result**: Full provenance from idea → spec → implementation

---

## Scenario 2: Bug Report Processing

### Situation
Multiple bug reports arrive over the weekend in inbox.

### Batch Processing

```bash
# Review all bug reports
ls ./inbox/bug-*.md

# Archive each with context
node .swarm/hooks/inbox-archive.js \
  ./inbox/bug-123-login-timeout.md \
  ./sessions/2025-11-13/artifacts/bug-123.md \
  "Fixed by increasing session timeout to 30min" \
  "bug,fixed,auth,critical"

node .swarm/hooks/inbox-archive.js \
  ./inbox/bug-124-image-upload.md \
  ./sessions/2025-11-13/artifacts/bug-124.md \
  "Fixed by adding image validation middleware" \
  "bug,fixed,upload,medium"

node .swarm/hooks/inbox-archive.js \
  ./inbox/bug-125-mobile-layout.md \
  ./docs/projects/mobile-redesign/bug-125.md \
  "Deferred to mobile redesign project Q3" \
  "bug,deferred,mobile,low"
```

**Result**: All bugs tracked with resolution status

---

## Scenario 3: Research & Documentation

### Situation
Researching different database options for new microservice.

### Research Archival

```bash
# Archive research notes to reference docs
node .swarm/hooks/inbox-archive.js \
  ./inbox/postgres-vs-mongodb-research.md \
  ./docs/reference/database-comparison-2025.md \
  "Comparison of PostgreSQL vs MongoDB for user service. Recommendation: PostgreSQL" \
  "research,database,reference,decision"

# Archive benchmark results
node .swarm/hooks/inbox-archive.js \
  ./inbox/db-benchmark-results.csv \
  ./docs/reference/db-benchmarks-2025-11.csv \
  "Load testing results: 10k req/sec on PostgreSQL" \
  "research,performance,benchmarks"

# Archive decision document
node .swarm/hooks/inbox-archive.js \
  ./inbox/db-selection-decision.md \
  ./docs/projects/user-service/architecture/db-decision.md \
  "Architectural decision: PostgreSQL with read replicas" \
  "architecture,decision,database"
```

**Result**: Research → Decision → Documentation pipeline

---

## Scenario 4: Code Review Feedback

### Situation
Received code review feedback, need to track and address.

### Review Processing

```bash
# Archive original review
node .swarm/hooks/inbox-archive.js \
  ./inbox/pr-456-review-feedback.md \
  ./docs/projects/api-refactor/reviews/pr-456-initial.md \
  "Initial review from senior engineer - 12 items to address" \
  "review,feedback,api-refactor"

# Work on fixes in session
# Creates: ./sessions/2025-11-13-review-fixes/artifacts/

# Archive resolution summary
node .swarm/hooks/inbox-archive.js \
  ./sessions/2025-11-13-review-fixes/artifacts/resolution-summary.md \
  ./docs/projects/api-refactor/reviews/pr-456-resolved.md \
  "Addressed all 12 review items, ready for re-review" \
  "review,resolved,api-refactor"
```

**Result**: Review → Fixes → Resolution tracking

---

## Scenario 5: Meeting Notes Processing

### Situation
Weekly team meeting generates action items and decisions.

### Meeting Notes Workflow

```bash
# Archive meeting notes
node .swarm/hooks/inbox-archive.js \
  ./inbox/team-meeting-2025-11-13.md \
  ./docs/meetings/2025/11-november/team-meeting-13.md \
  "Q4 planning meeting: 5 new features, 3 tech debt items" \
  "meeting,planning,q4"

# Extract and archive specific action items
node .swarm/hooks/inbox-archive.js \
  ./inbox/action-api-migration.md \
  ./docs/projects/api-migration/requirements.md \
  "Action item from team meeting: Migrate to GraphQL by Q1 2026" \
  "action-item,api,migration,q1-2026"

node .swarm/hooks/inbox-archive.js \
  ./inbox/action-testing-coverage.md \
  ./docs/projects/testing/improve-coverage.md \
  "Action item: Increase test coverage from 60% to 90%" \
  "action-item,testing,quality"
```

**Result**: Meeting → Actions → Projects linkage

---

## Scenario 6: Session Closeout

### Situation
Completed a productive coding session, need to organize artifacts.

### Session Archival

```bash
# Session ID: 2025-11-13-feature-auth
# Artifacts in: ./sessions/2025-11-13-feature-auth/artifacts/

# Archive implementation code
node .swarm/hooks/inbox-archive.js \
  ./sessions/2025-11-13-feature-auth/artifacts/auth-service.js \
  ./src/services/auth/oauth-provider.js \
  "OAuth2 provider implementation from session" \
  "implementation,auth,oauth,session"

# Archive tests
node .swarm/hooks/inbox-archive.js \
  ./sessions/2025-11-13-feature-auth/artifacts/auth.test.js \
  ./tests/services/auth/oauth.test.js \
  "OAuth2 test suite with 95% coverage" \
  "tests,auth,oauth,session"

# Archive documentation
node .swarm/hooks/inbox-archive.js \
  ./sessions/2025-11-13-feature-auth/artifacts/oauth-setup.md \
  ./docs/guides/oauth-integration.md \
  "OAuth2 setup guide for new developers" \
  "docs,auth,oauth,guide"

# Run session-end hook
npx claude-flow@alpha hooks session-end \
  --generate-summary true \
  --export-metrics true
```

**Result**: Session artifacts properly organized in codebase

---

## Scenario 7: Client Deliverables

### Situation
Client sends requirements, you deliver implementation and documentation.

### Client Project Workflow

```bash
# Archive client requirements
node .swarm/hooks/inbox-archive.js \
  ./inbox/client-acme-requirements-v2.pdf \
  ./docs/projects/acme-client/requirements-v2.pdf \
  "Updated requirements from client, includes API changes" \
  "client,acme,requirements,v2"

# After implementation, archive deliverables
node .swarm/hooks/inbox-archive.js \
  ./sessions/2025-11-13-acme-delivery/artifacts/implementation.zip \
  ./deliverables/acme-client/2025-11/implementation.zip \
  "Complete implementation with tests and docs" \
  "client,acme,deliverable,implementation"

node .swarm/hooks/inbox-archive.js \
  ./sessions/2025-11-13-acme-delivery/artifacts/api-documentation.html \
  ./deliverables/acme-client/2025-11/api-docs.html \
  "Generated API documentation from OpenAPI spec" \
  "client,acme,deliverable,docs,api"
```

**Result**: Complete client project provenance

---

## Scenario 8: Security Audit

### Situation
Security researcher reports vulnerability, need to track and fix.

### Security Workflow

```bash
# Archive security report (URGENT)
node .swarm/hooks/inbox-archive.js \
  ./inbox/security-report-sql-injection.md \
  ./docs/security/incidents/2025-11-13-sql-injection.md \
  "CRITICAL: SQL injection vulnerability in search endpoint" \
  "security,critical,vulnerability,sql-injection"

# Quick fix in session
# Creates: ./sessions/2025-11-13-security-fix/artifacts/

# Archive patch
node .swarm/hooks/inbox-archive.js \
  ./sessions/2025-11-13-security-fix/artifacts/search-fix.patch \
  ./docs/security/patches/2025-11-13-sql-injection-fix.patch \
  "Hotfix: Parameterized queries for search endpoint" \
  "security,critical,patch,deployed"

# Archive post-mortem
node .swarm/hooks/inbox-archive.js \
  ./sessions/2025-11-13-security-fix/artifacts/post-mortem.md \
  ./docs/security/post-mortems/2025-11-13-sql-injection.md \
  "Root cause: Missing input validation. Fix: Parameterized queries + input sanitization" \
  "security,post-mortem,learning"
```

**Result**: Security incident fully documented

---

## Common Tag Patterns

### Status Tags
```
status:new          # Newly arrived in inbox
status:review       # Under review
status:approved     # Approved for work
status:in-progress  # Currently working on
status:completed    # Finished
status:deferred     # Postponed to future
status:rejected     # Not proceeding
```

### Priority Tags
```
priority:critical   # Must do immediately
priority:high       # Important, do soon
priority:medium     # Normal priority
priority:low        # Nice to have
priority:backlog    # Future consideration
```

### Type Tags
```
type:feature        # New feature
type:bug            # Bug fix
type:docs           # Documentation
type:research       # Research/investigation
type:refactor       # Code refactoring
type:test           # Testing related
type:security       # Security related
```

### Phase Tags
```
phase:planning      # Planning/design phase
phase:implementation # Coding phase
phase:testing       # Testing phase
phase:review        # Code review phase
phase:deployment    # Deployment phase
phase:maintenance   # Maintenance phase
```

---

## Query Recipes

### Find All Critical Items
```bash
jq 'select(.tags[] | contains("critical"))' .inbox/archive/*.json
```

### Find Recent Features (Last 30 Days)
```bash
find .inbox/archive -name "*.json" -mtime -30 -exec jq 'select(.tags[] | contains("feature"))' {} \;
```

### Group by Tag
```bash
jq -r '.tags[]' .inbox/archive/*.json | sort | uniq -c | sort -rn
```

### Find by Date Range
```bash
jq 'select(.timestamp >= "2025-11-01" and .timestamp <= "2025-11-30")' .inbox/archive/*.json
```

### Export to CSV
```bash
echo "timestamp,source,destination,tags" > archives.csv
jq -r '[.timestamp, .source, .destination, (.tags | join(";"))] | @csv' .inbox/archive/*.json >> archives.csv
```

---

## Best Practices from Real Use

1. **Be Specific in Notes**: Future you needs context
2. **Use Consistent Tags**: Pick a schema and stick to it
3. **Archive Promptly**: Don't let inbox grow unbounded
4. **Link Related Items**: Use manifest paths to connect work
5. **Review Manifests**: Periodically check for patterns
6. **Clean Up Tags**: Regularly review and consolidate tag schema

---

## Integration Scripts

### Bulk Archive Script
```bash
#!/bin/bash
# bulk-archive.sh - Archive multiple files with same tags

TAG=$1
DEST_DIR=$2

for file in ./inbox/*.md; do
  filename=$(basename "$file")
  node .swarm/hooks/inbox-archive.js \
    "$file" \
    "$DEST_DIR/$filename" \
    "Bulk archive" \
    "$TAG"
done
```

### Query Script
```bash
#!/bin/bash
# query-archives.sh - Search archives by tag

TAG=$1
jq --arg tag "$TAG" \
  'select(.tags[] | contains($tag))' \
  .inbox/archive/*.json
```

---

## Conclusion

The inbox archival system handles:
- ✅ Feature development (idea → implementation)
- ✅ Bug tracking (report → fix → resolution)
- ✅ Research (investigation → decision)
- ✅ Code reviews (feedback → fixes)
- ✅ Meeting notes (discussion → actions)
- ✅ Session closeout (artifacts → codebase)
- ✅ Client deliverables (requirements → delivery)
- ✅ Security incidents (report → fix → post-mortem)

Simple, flexible, and integrated with claude-flow infrastructure.
