#!/bin/bash
# Pattern Database - File-backed pattern tracking for issue detection
# Stores patterns across sessions, increments counts, triggers issues at threshold

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PATTERN_DB="sessions/issues/.pattern-database.json"
ISSUE_THRESHOLD=3

# Check if jq is available
HAS_JQ=false
if command -v jq &> /dev/null; then
    HAS_JQ=true
fi

# Initialize database if it doesn't exist
init_db() {
    if [ ! -f "$PATTERN_DB" ]; then
        echo "{}" > "$PATTERN_DB"
    fi
}

# Store or update a pattern
store_pattern() {
    local pattern_id="$1"
    local pattern_name="$2"
    local session_id="$3"
    local severity="${4:-medium}"
    local threshold="${5:-$ISSUE_THRESHOLD}"
    local metadata="${6:-{}}"

    if [ -z "$pattern_id" ] || [ -z "$pattern_name" ]; then
        echo -e "${RED}Error: pattern_id and pattern_name required${NC}" >&2
        return 1
    fi

    init_db

    # Read current database
    local db_content=$(cat "$PATTERN_DB")

    # Get current pattern or create new
    local count=0
    local first_seen=""
    local issue_created="null"
    local sessions_list="[]"

    if [ "$HAS_JQ" = true ]; then
        # Check if pattern exists
        if echo "$db_content" | jq -e ".[\"$pattern_id\"]" >/dev/null 2>&1; then
            count=$(echo "$db_content" | jq -r ".[\"$pattern_id\"].occurrences // 0")
            first_seen=$(echo "$db_content" | jq -r ".[\"$pattern_id\"].first_seen // \"\"")
            issue_created=$(echo "$db_content" | jq -r ".[\"$pattern_id\"].issue_created // \"null\"")
            sessions_list=$(echo "$db_content" | jq -r ".[\"$pattern_id\"].sessions // []")
        fi
    fi

    # Increment count
    count=$((count + 1))

    # Set first_seen if new
    if [ -z "$first_seen" ]; then
        first_seen=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    fi

    local last_seen=$(date -u +%Y-%m-%dT%H:%M:%SZ)

    # Add session to list
    if [ "$HAS_JQ" = true ] && [ -n "$session_id" ]; then
        if [ "$sessions_list" = "[]" ]; then
            sessions_list="[\"$session_id\"]"
        else
            sessions_list=$(echo "$sessions_list" | jq --arg sess "$session_id" '. + [$sess] | unique')
        fi
    fi

    # Check threshold
    local threshold_reached="false"
    if [ "$count" -ge "$threshold" ]; then
        threshold_reached="true"
    fi

    # Build pattern object
    if [ "$HAS_JQ" = true ]; then
        # Build JSON step by step to avoid --argjson issues
        local pattern_obj=$(echo '{}' | jq \
            --arg id "$pattern_id" \
            --arg name "$pattern_name" \
            --arg count "$count" \
            --arg first "$first_seen" \
            --arg last "$last_seen" \
            --arg sev "$severity" \
            --arg thresh "$threshold" \
            --arg reached "$threshold_reached" \
            --arg issue "$issue_created" \
            '{
                pattern_id: $id,
                pattern_name: $name,
                category: "protocol",
                occurrences: ($count | tonumber),
                first_seen: $first,
                last_seen: $last,
                sessions: [],
                severity: $sev,
                threshold: ($thresh | tonumber),
                threshold_reached: ($reached == "true"),
                issue_created: $issue,
                status: "tracked",
                metadata: {}
            }')

        # Add sessions array
        pattern_obj=$(echo "$pattern_obj" | jq --argjson sessions "$sessions_list" '.sessions = $sessions')

        # Update database
        local updated_db=$(echo "$db_content" | jq --arg key "$pattern_id" --argjson val "$pattern_obj" '. + {($key): $val}')
        echo "$updated_db" > "$PATTERN_DB"
    else
        echo -e "${YELLOW}⚠ jq required for pattern database${NC}" >&2
        return 1
    fi

    echo -e "${GREEN}✓ Pattern stored: $pattern_name ($count occurrences)${NC}"
    return 0
}

# Get a pattern
get_pattern() {
    local pattern_id="$1"

    if [ -z "$pattern_id" ]; then
        echo -e "${RED}Error: pattern_id required${NC}" >&2
        return 1
    fi

    init_db

    if [ "$HAS_JQ" = true ]; then
        cat "$PATTERN_DB" | jq -r ".[\"$pattern_id\"] // {}"
    else
        echo "{}"
    fi
}

# Increment pattern occurrence count
increment_pattern() {
    local pattern_id="$1"
    local pattern_name="$2"
    local session_id="$3"
    local severity="${4:-medium}"
    local metadata="${5:-{}}"

    # Store pattern (will increment if exists, create if new)
    store_pattern "$pattern_id" "$pattern_name" "$session_id" "$severity" "$ISSUE_THRESHOLD" "$metadata"

    local result=$?

    # Check if threshold reached and create issue if needed
    if [ $result -eq 0 ]; then
        check_threshold "$pattern_id"
    fi

    return $result
}

# Check if threshold reached and create issue if needed
check_threshold() {
    local pattern_id="$1"

    local pattern=$(get_pattern "$pattern_id")

    if [ "$pattern" = "{}" ] || [ -z "$pattern" ]; then
        return 0
    fi

    if [ "$HAS_JQ" != true ]; then
        return 0
    fi

    local count=$(echo "$pattern" | jq -r '.occurrences')
    local threshold=$(echo "$pattern" | jq -r '.threshold')
    local issue_created=$(echo "$pattern" | jq -r '.issue_created')
    local pattern_name=$(echo "$pattern" | jq -r '.pattern_name')
    local severity=$(echo "$pattern" | jq -r '.severity')

    # Check if threshold reached and issue not yet created
    if [ "$count" -ge "$threshold" ] && [ "$issue_created" = "null" ]; then
        echo -e "${YELLOW}🚨 Pattern threshold reached: $pattern_name ($count occurrences)${NC}"

        # Create issue automatically
        if [ -f "sessions/issues/issue-utils.sh" ]; then
            local issue_output=$(bash sessions/issues/issue-utils.sh create \
                "$pattern_name" \
                "$severity" \
                "process" \
                "system" 2>&1)

            local issue_id=$(echo "$issue_output" | grep -oE 'ISSUE-[0-9]+' | head -1)

            if [ -n "$issue_id" ]; then
                echo -e "${GREEN}✓ Issue created: $issue_id${NC}"

                # Update pattern with issue ID
                local db_content=$(cat "$PATTERN_DB")
                local updated_db=$(echo "$db_content" | jq --arg key "$pattern_id" --arg issue "$issue_id" '.[$key].issue_created = $issue')
                echo "$updated_db" > "$PATTERN_DB"
            else
                echo -e "${RED}⚠ Failed to create issue${NC}" >&2
            fi
        fi
    fi
}

# List all patterns
list_all_patterns() {
    local format="${1:-summary}"

    echo -e "${BLUE}=== Pattern Database ===${NC}"
    echo ""

    init_db

    if [ "$HAS_JQ" != true ]; then
        echo -e "${YELLOW}jq required for listing patterns${NC}"
        return 0
    fi

    local db_content=$(cat "$PATTERN_DB")
    local count=$(echo "$db_content" | jq 'keys | length')

    if [ "$count" -eq 0 ]; then
        echo -e "${YELLOW}No patterns found in database${NC}"
        return 0
    fi

    # List patterns
    echo "$db_content" | jq -r 'to_entries[] | "  • \(.value.pattern_name) (\(.value.occurrences) occurrences) - \(if .value.threshold_reached then "⚠️ THRESHOLD REACHED" else "tracking" end)"'

    echo ""
}

# Get pattern statistics
get_stats() {
    init_db

    if [ "$HAS_JQ" != true ]; then
        echo "jq required for statistics"
        return 0
    fi

    local db_content=$(cat "$PATTERN_DB")
    local total=$(echo "$db_content" | jq 'keys | length')
    local reached=$(echo "$db_content" | jq '[.[] | select(.threshold_reached == true)] | length')
    local with_issues=$(echo "$db_content" | jq '[.[] | select(.issue_created != null and .issue_created != "null")] | length')

    echo "Total Patterns: $total"
    echo "Threshold Reached: $reached"
    echo "Issues Created: $with_issues"
}

# Main command dispatcher
main() {
    local command="${1:-help}"
    shift || true

    case "$command" in
        store)
            store_pattern "$@"
            ;;
        get)
            get_pattern "$@"
            ;;
        increment)
            increment_pattern "$@"
            ;;
        check-threshold)
            check_threshold "$@"
            ;;
        list)
            list_all_patterns "$@"
            ;;
        stats)
            get_stats
            ;;
        help|--help|-h)
            cat << EOF
Pattern Database - File-backed pattern tracking

Usage: $0 <command> [arguments]

Commands:
    store <id> <name> <session_id> [severity] [threshold] [metadata]
        Store or update a pattern

    get <id>
        Retrieve a pattern

    increment <id> <name> <session_id> [severity] [metadata]
        Increment pattern occurrence count

    check-threshold <id>
        Check if threshold reached, create issue if needed

    list [format]
        List all patterns

    stats
        Show pattern statistics

    help
        Show this help message

Examples:
    $0 increment "file-routing-violation" "File Routing Violations" "session-123" "high"
    $0 list
    $0 get "file-routing-violation"
    $0 stats
EOF
            ;;
        *)
            echo -e "${RED}Error: Unknown command '$command'${NC}" >&2
            echo "Run '$0 help' for usage"
            exit 1
            ;;
    esac
}

# Run main if executed directly
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
