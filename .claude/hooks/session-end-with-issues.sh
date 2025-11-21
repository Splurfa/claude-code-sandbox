#!/bin/bash
# Session End Hook with Issue Detection Integration
# Wraps stock session-end hook and adds automated issue detection

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ISSUES_DIR="$PROJECT_ROOT/sessions/findings"
RESULTS_FILE="$PROJECT_ROOT/.swarm/backups/last-issue-detection.json"

# Ensure .swarm/backups exists
mkdir -p "$PROJECT_ROOT/.swarm/backups"

# Log function
log() {
    local level="$1"
    shift
    local message="$@"

    case "$level" in
        info)
            echo -e "${BLUE}ℹ ${message}${NC}" >&2
            ;;
        success)
            echo -e "${GREEN}✓ ${message}${NC}" >&2
            ;;
        warning)
            echo -e "${YELLOW}⚠ ${message}${NC}" >&2
            ;;
        error)
            echo -e "${RED}✗ ${message}${NC}" >&2
            ;;
    esac
}

# Detect current session ID
detect_session_id() {
    local session_id=""

    # Strategy 1: Check CLAUDE_SESSION_ID environment variable
    if [ -n "$CLAUDE_SESSION_ID" ]; then
        session_id="$CLAUDE_SESSION_ID"
        log info "Session ID from env: $session_id"
        echo "$session_id"
        return 0
    fi

    # Strategy 2: Find most recently modified session directory
    local recent_session=$(find "$PROJECT_ROOT/sessions" -maxdepth 1 -type d -name "session-*" 2>/dev/null | \
        grep -E "session-[0-9]{8}-[0-9]{6}-" | \
        xargs ls -td 2>/dev/null | head -1)

    if [ -n "$recent_session" ]; then
        session_id=$(basename "$recent_session")
        log info "Session ID from recent directory: $session_id"
        echo "$session_id"
        return 0
    fi

    # Strategy 3: Generate session ID from current timestamp
    session_id="session-$(date +%Y%m%d-%H%M%S)-auto"
    log warning "Generated session ID: $session_id"
    echo "$session_id"
    return 0
}

# Run stock session-end hook
run_stock_hook() {
    log info "Running stock session-end hook..."

    # Execute stock hook (preserve existing behavior)
    npx claude-flow@alpha hooks session-end \
        --generate-summary true \
        --persist-state true \
        --export-metrics true 2>&1 || {
        log warning "Stock session-end hook returned non-zero exit code (continuing anyway)"
    }

    log success "Stock session-end hook completed"
}

# Run issue detection
run_issue_detection() {
    local session_id="$1"

    log info "Running issue detection for session: $session_id"

    # Check if detection script exists
    if [ ! -f "$ISSUES_DIR/detect-issues.sh" ]; then
        log error "Issue detection script not found: $ISSUES_DIR/detect-issues.sh"
        return 1
    fi

    # Run detection and capture output
    local output
    local exit_code

    output=$(bash "$ISSUES_DIR/detect-issues.sh" "$session_id" 2>&1) || exit_code=$?

    # Store results
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local pattern_count=0
    local issues_created=0

    # Count patterns from database
    if [ -f "$ISSUES_DIR/.pattern-database.json" ]; then
        pattern_count=$(cat "$ISSUES_DIR/.pattern-database.json" | jq 'keys | length' 2>/dev/null || echo "0")
    fi

    # Extract issue count from output
    if echo "$output" | grep -q "Pattern Analysis"; then
        issues_created=$(echo "$output" | grep -c "ISSUE-" || echo "0")
    fi

    # Build results JSON
    cat > "$RESULTS_FILE" << EOF
{
  "timestamp": "$timestamp",
  "session_id": "$session_id",
  "exit_code": ${exit_code:-0},
  "pattern_count": $pattern_count,
  "issues_created": $issues_created,
  "output": $(echo "$output" | jq -Rs .)
}
EOF

    log success "Issue detection completed (patterns: $pattern_count, issues: $issues_created)"

    # Display summary if patterns were detected
    if [ "$pattern_count" -gt 0 ]; then
        echo ""
        log warning "Issue patterns detected - see: sessions/findings/"
        echo ""
        echo "$output" | grep -A 20 "Pattern Analysis" || true
        echo ""
    fi

    return 0
}

# Main execution
main() {
    log info "Session end hook with issue detection starting..."

    # Run stock hook first (preserve existing functionality)
    run_stock_hook || {
        log warning "Stock hook failed (continuing with issue detection)"
    }

    # Detect session ID
    local session_id=$(detect_session_id)

    if [ -z "$session_id" ]; then
        log error "Could not detect session ID - skipping issue detection"
        exit 0  # Non-blocking
    fi

    # Run issue detection
    run_issue_detection "$session_id" || {
        log warning "Issue detection failed (non-blocking)"
    }

    log success "Session end hook completed"

    # Always exit 0 (non-blocking)
    exit 0
}

# Execute main
main "$@"
