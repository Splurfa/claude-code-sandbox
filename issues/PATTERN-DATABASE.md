# Pattern Database Documentation

The pattern database provides persistent, file-backed tracking of recurring issues across sessions with automatic threshold-based issue creation.

---

## Overview

**Purpose**: Track recurring patterns to identify systemic issues that require attention

**Storage**: `sessions/issues/.pattern-database.json` (file-backed JSON, not MCP memory)

**Threshold**: Auto-creates issue when pattern occurs ≥ 3 times

**Integration**: Runs automatically via Stop hook on every chat session end

---

## Architecture

### Why File-Backed Storage?

Initial implementation used MCP memory (`mcp__claude-flow_alpha__memory_usage`) but encountered issues:

**Problem**: MCP memory uses ReasoningBank with semantic search, making exact key retrieval unreliable:
```bash
# This doesn't work reliably:
npx claude-flow@alpha memory retrieve --key "exact-pattern-id"
# Returns: Semantic matches, not exact key-value retrieval
```

**Solution**: File-backed JSON storage provides:
- Exact key-value retrieval
- Atomic read/write operations
- Simple jq-based queries
- No semantic search confusion
- Reliable threshold triggering

### Database Schema

```json
{
  "pattern-id": {
    "pattern_id": "file-routing-violation",
    "pattern_name": "File Routing Compliance Violations",
    "category": "protocol",
    "occurrences": 3,
    "first_seen": "2025-11-21T19:17:57Z",
    "last_seen": "2025-11-21T19:23:44Z",
    "sessions": [
      "session-20251121-120000-feature",
      "session-20251121-130000-bugfix",
      "session-20251121-140000-refactor"
    ],
    "severity": "high",
    "threshold": 3,
    "threshold_reached": true,
    "issue_created": "ISSUE-009",
    "status": "tracked",
    "metadata": {}
  }
}
```

**Fields**:
- `pattern_id`: Unique identifier (kebab-case)
- `pattern_name`: Human-readable name
- `category`: Pattern category (protocol, performance, quality)
- `occurrences`: Total count across all sessions
- `first_seen`: ISO 8601 timestamp of first occurrence
- `last_seen`: ISO 8601 timestamp of most recent occurrence
- `sessions`: Array of session IDs where pattern occurred
- `severity`: low | medium | high | critical
- `threshold`: Number of occurrences before auto-creating issue (default: 3)
- `threshold_reached`: Boolean flag
- `issue_created`: ISSUE-XXX ID (null if not yet created)
- `status`: tracked | resolved | archived
- `metadata`: Extensible object for additional data

---

## Usage

### Command-Line Interface

```bash
# Store or update a pattern
bash sessions/issues/pattern-database.sh store \
  "pattern-id" \
  "Pattern Name" \
  "session-id" \
  "severity" \
  "threshold" \
  '{"key": "value"}'

# Get pattern details
bash sessions/issues/pattern-database.sh get "pattern-id"

# Increment pattern count (recommended - auto-creates issue at threshold)
bash sessions/issues/pattern-database.sh increment \
  "pattern-id" \
  "Pattern Name" \
  "session-id" \
  "severity"

# Check if threshold reached
bash sessions/issues/pattern-database.sh check-threshold "pattern-id"

# List all patterns
bash sessions/issues/pattern-database.sh list

# Show statistics
bash sessions/issues/pattern-database.sh stats
```

### Programmatic Usage

**From detect-issues.sh**:

```bash
# Source the pattern database
source sessions/issues/pattern-database.sh

# Increment pattern (auto-creates issue at threshold)
if type increment_pattern &>/dev/null; then
    increment_pattern \
        "file-routing-violation" \
        "File Routing Compliance Violations" \
        "$SESSION_ID" \
        "high" >/dev/null 2>&1 || true
fi
```

**From other scripts**:

```bash
# Initialize database if it doesn't exist
init_db() {
    if [ ! -f "$PATTERN_DB" ]; then
        echo "{}" > "$PATTERN_DB"
    fi
}

# Store pattern
store_pattern \
    "custom-pattern" \
    "Custom Pattern Name" \
    "session-123" \
    "medium" \
    "5"  # Custom threshold

# Get pattern
pattern=$(get_pattern "custom-pattern")
occurrences=$(echo "$pattern" | jq -r '.occurrences')
```

---

## Tracked Patterns

### Current Patterns

1. **session-naming-violation**
   - Name: "Session Naming Protocol Violations"
   - Severity: high
   - Triggers: Session directories not matching `session-YYYYMMDD-HHMMSS-topic`

2. **file-routing-violation**
   - Name: "File Routing Compliance Violations"
   - Severity: high
   - Triggers: Files found in root `tests/`, `docs/`, `scripts/`

3. **incomplete-tasks**
   - Name: "Incomplete Task Outputs"
   - Severity: medium
   - Triggers: Unchecked tasks in TODO.md or TASKS.md

4. **doc-code-sync-gap**
   - Name: "Documentation-Code Synchronization Gaps"
   - Severity: high
   - Triggers: Summary claims deployment but no code files found

5. **test-failures**
   - Name: "Test Failures or False Positives"
   - Severity: medium
   - Triggers: Test failure indicators in artifacts/tests/

6. **user-corrections**
   - Name: "Recurring User Corrections"
   - Severity: medium
   - Triggers: >3 correction phrases in session summary

### Adding New Patterns

To track a new pattern, update `detect-issues.sh`:

```bash
detect_new_pattern() {
    echo -e "${BLUE}Checking for new pattern...${NC}"

    # Detection logic
    if [ condition ]; then
        echo -e "${YELLOW}  ⚠ New pattern detected${NC}"

        # Track pattern in database
        if type increment_pattern &>/dev/null; then
            increment_pattern \
                "new-pattern-id" \
                "New Pattern Name" \
                "$SESSION_ID" \
                "medium" >/dev/null 2>&1 || true
        fi

        PATTERNS+=("New pattern description")
        return 1
    fi

    return 0
}
```

---

## Threshold Logic

### How Thresholds Work

1. **First Occurrence**: Pattern stored with `occurrences = 1`
2. **Second Occurrence**: Pattern updated with `occurrences = 2`
3. **Third Occurrence**:
   - `occurrences = 3`
   - `threshold_reached = true`
   - **Issue auto-created** via `issue-utils.sh`
   - `issue_created` updated with ISSUE-XXX ID

### Customizing Thresholds

**Default**: 3 occurrences (configurable in `pattern-database.sh`)

**Per-pattern**:
```bash
# Store with custom threshold
store_pattern \
    "critical-pattern" \
    "Critical Security Issue" \
    "session-id" \
    "critical" \
    "1"  # Create issue immediately
```

**Global default**:
```bash
# Edit pattern-database.sh
ISSUE_THRESHOLD=5  # Require 5 occurrences
```

---

## Integration

### Stop Hook Integration

**Automatic execution on chat end**:

```bash
# .claude/settings.json
"Stop": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "/bin/bash .claude/hooks/session-end-with-issues.sh"
      }
    ]
  }
]
```

**Wrapper script** (`.claude/hooks/session-end-with-issues.sh`):
1. Runs stock session-end hook
2. Detects session ID (3 fallback strategies)
3. Runs issue detection with pattern tracking
4. Stores results in `.swarm/backups/last-issue-detection.json`
5. Always exits 0 (non-blocking)

### Manual Session Closeout

**Slash command**: `/session-closeout`

Displays issue detection results before HITL approval:
- Pattern count
- Issues created
- Pattern details
- Threshold status

---

## Testing

### Comprehensive Test Suite

```bash
bash sessions/issues/test-integration.sh
```

**Tests**:
1. Single Session Pattern Tracking (1 occurrence)
2. Threshold Triggering (3 occurrences → auto-issue creation)
3. Multiple Pattern Types (independent tracking)
4. Pattern Database Functions (store, get, increment, list, stats)
5. Detection Script Integration
6. Error Handling (missing session ID, non-existent session, missing jq)
7. Edge Cases (clean session, corruption recovery)

**Expected**: 100% pass rate (14/14 tests)

### Manual Testing

```bash
# Test 1: Single pattern
mkdir -p tests && touch tests/test.js
bash sessions/issues/detect-issues.sh "test-session-1"
bash sessions/issues/pattern-database.sh list
# Expected: 1 occurrence, threshold not reached

# Test 2: Threshold triggering
bash sessions/issues/detect-issues.sh "test-session-2"
bash sessions/issues/detect-issues.sh "test-session-3"
bash sessions/issues/pattern-database.sh list
# Expected: 3 occurrences, threshold reached, issue created

# Cleanup
rm -rf tests
```

---

## Troubleshooting

### Pattern Database Corrupted

**Symptom**: `jq: parse error: Invalid JSON`

**Fix**:
```bash
# Backup corrupted database
cp sessions/issues/.pattern-database.json sessions/issues/.pattern-database.json.backup

# Reset database
echo '{}' > sessions/issues/.pattern-database.json

# Verify
jq '.' sessions/issues/.pattern-database.json
```

### Issue Not Created at Threshold

**Symptom**: Pattern count = 3, but no issue created

**Debug**:
```bash
# Check pattern status
bash sessions/issues/pattern-database.sh get "pattern-id"
# Look for: threshold_reached: true, issue_created: "null"

# Manually trigger issue creation
bash sessions/issues/pattern-database.sh check-threshold "pattern-id"
```

### Session ID Detection Failed

**Symptom**: "Could not detect session ID - skipping issue detection"

**Fix**:
```bash
# Set session ID explicitly
export CLAUDE_SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-manual"

# Run detection
bash sessions/issues/detect-issues.sh "$CLAUDE_SESSION_ID"
```

### jq Not Found

**Symptom**: "jq required for pattern database"

**Install**:
```bash
# macOS
brew install jq

# Linux
sudo apt-get install jq

# Verify
which jq
jq --version
```

---

## Performance

**Database Size**: ~1-2 KB per 10 patterns

**Read Performance**: O(1) - direct jq key access

**Write Performance**: O(1) - atomic file write

**Memory Usage**: Minimal (file-backed)

**Bottlenecks**: None (file I/O is fast for small JSON files)

---

## Future Enhancements

### Potential Features

1. **Pattern Severity Escalation**
   - Auto-increase severity after multiple recurrences
   - Example: medium → high after 10 occurrences

2. **Pattern Clustering**
   - Group related patterns (e.g., all routing violations)
   - Create meta-issues for pattern clusters

3. **Historical Trending**
   - Track occurrence rate over time
   - Alert if pattern frequency increases

4. **Machine Learning**
   - Predict which patterns will reach threshold
   - Suggest preventive actions

5. **Custom Actions**
   - Execute custom scripts when threshold reached
   - Send notifications (Slack, email, etc.)

6. **Pattern Expiry**
   - Auto-archive patterns not seen in 90 days
   - Reduce database size over time

---

## Related Documentation

- [Issue Tracking System](README.md) - Main issue registry documentation
- [Issue Detection](detect-issues.sh) - Detection script implementation
- [Issue Utilities](issue-utils.sh) - Issue management functions
- [Test Suite](test-integration.sh) - Comprehensive testing
- [Session Closeout](.claude/skills/session-closeout/SKILL.md) - HITL workflow
- [Stop Hook](.claude/hooks/session-end-with-issues.sh) - Automatic detection

---

**Last Updated**: 2025-11-21
**Version**: 1.0.0
**Status**: Production Ready
