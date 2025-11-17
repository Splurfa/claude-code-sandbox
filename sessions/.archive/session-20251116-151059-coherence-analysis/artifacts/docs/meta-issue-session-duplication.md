# Meta-Issue: Session Folder Duplication Bug

**Discovered**: 2025-11-16 15:27 PST
**Severity**: MODERATE
**Impact**: Confusion, wasted storage, potential file routing errors

## Issue Description

When initializing this verification session, TWO session directories were created:
1. `session-20251116-152247-inbox-verification` (empty, metadata only)
2. `session-20251116-152321-inbox-verification` (actual work location)

## Root Cause

**Timestamp generation mismatch**:
- Bash command generates timestamp: `$(date +%Y%m%d-%H%M%S)`
- Metadata.json uses hardcoded timestamp from earlier moment
- Result: Directory name ≠ metadata session_id

## Evidence

```bash
$ ls -ld sessions/session-20251116-15*inbox-verification*
drwx------  session-20251116-152247-inbox-verification (empty)
drwxr-xr-x  session-20251116-152321-inbox-verification (has work)
```

**Agents routed to**: 152321 session (later timestamp)
**Metadata created in**: 152247 session (earlier timestamp)

## Resolution

- ✅ Removed empty duplicate session (152247)
- ✅ Consolidated all work to 152321
- ⚠️ Added to verification scope (check for more duplicates)

## Prevention

**Best Practice**:
```bash
# Generate once, use everywhere
SESSION_ID="session-$(date +%Y%m%d-%H%M%S)-topic"
mkdir -p "sessions/$SESSION_ID/artifacts"/{code,tests,docs,scripts,notes}

# Use $SESSION_ID variable in metadata.json
cat > "sessions/$SESSION_ID/metadata.json" <<EOF
{
  "session_id": "$SESSION_ID",
  ...
}
EOF
```

## Added to Adaptive Plan

This meta-issue demonstrates why **Adaptive Queen** is superior for this mission:
- Discovered unexpected issue mid-flight
- Can adjust verification scope dynamically
- Queen can add "session duplication check" to verification tasks
