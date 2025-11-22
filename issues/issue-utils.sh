#!/bin/bash
# Issue Tracking Utilities
# Provides helper functions for issue management

set -e

ISSUES_DIR="sessions/issues"
README_FILE="$ISSUES_DIR/README.md"
ISSUES_DB="$ISSUES_DIR/.issues-database.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ========================================
# JSON Database Functions (NEW)
# ========================================

# Initialize database if it doesn't exist
init_db() {
    if [ ! -f "$ISSUES_DB" ]; then
        echo "{}" > "$ISSUES_DB"
    fi
}

# Store issue in JSON database
issue_store() {
    local issue_id="$1"
    local slug="$2"
    local title="$3"
    local status="$4"
    local type="$5"
    local priority="$6"
    local root_cause="$7"
    local created="$8"
    local updated="$9"
    local resolved="${10:-N/A}"
    local filename="${11}"

    init_db

    # Build JSON object
    local json_entry=$(jq -n \
        --arg id "$issue_id" \
        --arg slug "$slug" \
        --arg title "$title" \
        --arg status "$status" \
        --arg type "$type" \
        --arg priority "$priority" \
        --arg root_cause "$root_cause" \
        --arg created "$created" \
        --arg updated "$updated" \
        --arg resolved "$resolved" \
        --arg file "$filename" \
        '{
            id: $id,
            slug: $slug,
            title: $title,
            status: $status,
            type: $type,
            priority: $priority,
            root_cause: $root_cause,
            created: $created,
            updated: $updated,
            resolved: $resolved,
            file: $file,
            related_issues: []
        }')

    # Add to database
    local updated_db=$(jq --arg id "$issue_id" --argjson entry "$json_entry" \
        '.[$id] = $entry' "$ISSUES_DB")
    echo "$updated_db" > "$ISSUES_DB"
}

# Get issue from JSON database
issue_get() {
    local issue_id="$1"

    if [ ! -f "$ISSUES_DB" ]; then
        echo "Error: Database not found" >&2
        return 1
    fi

    jq -r --arg id "$issue_id" '.[$id] // empty' "$ISSUES_DB"
}

# Update issue status in JSON database and markdown file
issue_update_status() {
    local issue_id="$1"
    local new_status="$2"
    local updated=$(date +%Y-%m-%d)

    init_db

    # Get issue info
    local issue=$(issue_get "$issue_id")
    if [ -z "$issue" ]; then
        echo -e "${RED}Error: Issue $issue_id not found${NC}" >&2
        return 1
    fi

    local filename=$(echo "$issue" | jq -r '.file')
    local file_path="$ISSUES_DIR/$filename"

    # Update JSON database
    local updated_db=$(jq --arg id "$issue_id" --arg status "$new_status" --arg date "$updated" \
        '.[$id].status = $status | .[$id].updated = $date' "$ISSUES_DB")
    echo "$updated_db" > "$ISSUES_DB"

    # Update markdown file
    if [ -f "$file_path" ]; then
        sed -i '' "s/^\*\*Status\*\*: .*/\*\*Status\*\*: $new_status/" "$file_path"
        sed -i '' "s/^\*\*Updated\*\*: .*/\*\*Updated\*\*: $updated/" "$file_path"
        echo -e "${GREEN}✓ Updated $issue_id status to: $new_status${NC}"
    else
        echo -e "${YELLOW}⚠ Markdown file not found: $file_path${NC}"
    fi
}

# Generate ISSUES-LOG.md from JSON database
issue_generate_log() {
    init_db

    echo -e "${BLUE}Generating ISSUES-LOG.md...${NC}"

    cat > "$ISSUES_DIR/ISSUES-LOG.md" << 'LOGEOF'
# Issue Tracking Log

**Auto-generated from `.issues-database.json`** - Do not edit manually

This is a chronological view of all tracked issues (newest first).

---

LOGEOF

    # Get all issues sorted by ID (descending)
    jq -r 'to_entries | sort_by(.key) | reverse | .[] |
        "## \(.value.id): \(.value.title)\n\n" +
        "**Status**: \(.value.status)  \n" +
        "**Priority**: \(.value.priority) | **Type**: \(.value.type) | **Root Cause**: \(.value.root_cause)  \n" +
        "**Created**: \(.value.created) | **Updated**: \(.value.updated)  \n" +
        "**File**: [\(.value.file)](./\(.value.file))  \n" +
        "\n---\n"' "$ISSUES_DB" >> "$ISSUES_DIR/ISSUES-LOG.md"

    echo -e "${GREEN}✓ Generated: ISSUES-LOG.md${NC}"
}

# Generate README.md statistics from JSON database
issue_generate_stats() {
    init_db

    echo -e "${BLUE}Generating README.md statistics...${NC}"

    local total=$(jq 'length' "$ISSUES_DB")
    local open=$(jq '[.[] | select(.status == "Open")] | length' "$ISSUES_DB")
    local in_progress=$(jq '[.[] | select(.status == "In Progress")] | length' "$ISSUES_DB")
    local resolved=$(jq '[.[] | select(.resolved != "N/A")] | length' "$ISSUES_DB")

    local critical=$(jq '[.[] | select(.priority == "Critical")] | length' "$ISSUES_DB")
    local high=$(jq '[.[] | select(.priority == "High")] | length' "$ISSUES_DB")
    local medium=$(jq '[.[] | select(.priority == "Medium")] | length' "$ISSUES_DB")
    local low=$(jq '[.[] | select(.priority == "Low")] | length' "$ISSUES_DB")

    local system=$(jq '[.[] | select(.root_cause | contains("System") or contains("system"))] | length' "$ISSUES_DB")
    local user=$(jq '[.[] | select(.root_cause | contains("User") or contains("user"))] | length' "$ISSUES_DB")
    local hybrid=$(jq '[.[] | select(.root_cause | contains("Hybrid") or contains("hybrid"))] | length' "$ISSUES_DB")

    # Calculate percentages
    local open_pct=$((open * 100 / total))
    local in_progress_pct=$((in_progress * 100 / total))
    local resolved_pct=$((resolved * 100 / total))

    cat > "$README_FILE" << STATSEOF
# Issue Tracking Registry

**Auto-generated from \`.issues-database.json\`** - Do not edit statistics manually

## Quick Stats

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Issues** | $total | 100% |
| Open | $open | ${open_pct}% |
| In Progress | $in_progress | ${in_progress_pct}% |
| Resolved | $resolved | ${resolved_pct}% |

## By Priority

| Priority | Count |
|----------|-------|
| Critical | $critical |
| High | $high |
| Medium | $medium |
| Low | $low |

## By Root Cause

| Root Cause | Count |
|------------|-------|
| System | $system |
| User | $user |
| Hybrid | $hybrid |

---

## Issue List

See [ISSUES-LOG.md](./ISSUES-LOG.md) for complete chronological log.

### Critical Priority
STATSEOF

    # Add issue lists by priority
    jq -r '.[] | select(.priority == "Critical") | "- [\(.id): \(.title)](\(.file)) - **\(.status)**"' "$ISSUES_DB" >> "$README_FILE"

    echo "" >> "$README_FILE"
    echo "### High Priority" >> "$README_FILE"
    jq -r '.[] | select(.priority == "High") | "- [\(.id): \(.title)](\(.file)) - **\(.status)**"' "$ISSUES_DB" >> "$README_FILE"

    echo "" >> "$README_FILE"
    echo "### Medium Priority" >> "$README_FILE"
    jq -r '.[] | select(.priority == "Medium") | "- [\(.id): \(.title)](\(.file)) - **\(.status)**"' "$ISSUES_DB" >> "$README_FILE"

    echo "" >> "$README_FILE"
    echo "### Low Priority" >> "$README_FILE"
    jq -r '.[] | select(.priority == "Low") | "- [\(.id): \(.title)](\(.file)) - **\(.status)**"' "$ISSUES_DB" >> "$README_FILE"

    echo "" >> "$README_FILE"
    echo "---" >> "$README_FILE"
    echo "" >> "$README_FILE"
    echo "## Pattern Database Integration" >> "$README_FILE"
    echo "" >> "$README_FILE"
    echo "Issues are automatically created when patterns reach threshold (3 occurrences)." >> "$README_FILE"
    echo "" >> "$README_FILE"
    echo "See [PATTERN-DATABASE.md](./PATTERN-DATABASE.md) for details." >> "$README_FILE"

    echo -e "${GREEN}✓ Generated: README.md with statistics${NC}"
}

# List issues with filters (JSON version)
issue_list_json() {
    local filter="${1:-all}"

    init_db

    echo -e "${BLUE}Issues from JSON database ($filter):${NC}"
    echo ""

    case "$filter" in
        all)
            jq -r '.[] | "\(.id): \(.title) [\(.status)] [\(.priority)]"' "$ISSUES_DB"
            ;;
        open)
            jq -r '.[] | select(.status == "Open") | "\(.id): \(.title) [\(.status)] [\(.priority)]"' "$ISSUES_DB"
            ;;
        "in progress"|"in_progress")
            jq -r '.[] | select(.status == "In Progress") | "\(.id): \(.title) [\(.status)] [\(.priority)]"' "$ISSUES_DB"
            ;;
        resolved)
            jq -r '.[] | select(.resolved != "N/A") | "\(.id): \(.title) [Resolved: \(.resolved)] [\(.priority)]"' "$ISSUES_DB"
            ;;
        *)
            echo -e "${RED}Unknown filter: $filter${NC}"
            echo "Valid filters: all, open, in progress, resolved"
            return 1
            ;;
    esac

    echo ""
}

# ========================================
# Original Functions (preserved)
# ========================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get next available issue number
get_next_id() {
    local max_id=0

    # Find highest ISSUE-XXX number
    for file in "$ISSUES_DIR"/issues/ISSUE-*.md; do
        if [ -f "$file" ]; then
            local filename=$(basename "$file")
            local num=$(echo "$filename" | grep -oE '[0-9]+' | head -1)
            if [ "$num" -gt "$max_id" ]; then
                max_id=$num
            fi
        fi
    done

    echo $((max_id + 1))
}

# Create slug from title
create_slug() {
    local title="$1"
    echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//'
}

# Create new issue from template
create_issue() {
    local title="$1"
    local priority="${2:-medium}"
    local type="${3:-bug}"
    local root_cause="${4:-system}"

    if [ -z "$title" ]; then
        echo -e "${RED}Error: Title required${NC}"
        echo "Usage: $0 create <title> [priority] [type] [root_cause]"
        return 1
    fi

    local issue_id=$(printf "%03d" $(get_next_id))
    local slug=$(create_slug "$title")
    local filename="$ISSUES_DIR/issues/ISSUE-$issue_id-$slug.md"
    local date=$(date +%Y-%m-%d)

    echo -e "${BLUE}Creating issue ISSUE-$issue_id...${NC}"

    cat > "$filename" << EOF
# ISSUE-$issue_id: $title

**Status**: Open
**Type**: $type
**Priority**: $(echo "$priority" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
**Root Cause**: $(echo "$root_cause" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
**Created**: $date
**Updated**: $date
**Resolved**: N/A

## Problem Statement

[Describe the issue clearly and concisely]

## Evidence

**Captain's Log**:
- [Reference to captain's log entries]

**Memory**:
- [Reference to memory keys]

**Session**:
- [Session IDs where issue occurred]

**Code**:
- [File paths and line numbers]

## Root Cause Analysis

[What's actually causing this issue?]

**Why This Matters**:
- [Impact on workflow]
- [Consequences if not fixed]

## Proposed Solution

### Short-term (Workaround)
- [ ] Action item 1
- [ ] Action item 2

### Long-term (Permanent Fix)
- [ ] Permanent fix 1
- [ ] System improvement 1

## Related Issues

- Related to ISSUE-###

## Resolution Notes

**Status**: Open - [Next steps]

**Next Steps**:
1. [Step 1]
2. [Step 2]
EOF

    echo -e "${GREEN}✓ Created: $filename${NC}"

    # Store in memory
    echo -e "${BLUE}Storing in memory...${NC}"
    npx claude-flow@alpha memory store \
        --key "issues/ISSUE-$issue_id" \
        --namespace "issues" \
        --value "{\"title\":\"$title\",\"status\":\"open\",\"type\":\"$type\",\"priority\":\"$priority\",\"root_cause\":\"$root_cause\",\"created\":\"$date\"}" \
        2>/dev/null || echo -e "${YELLOW}⚠ Could not store in memory (continuing anyway)${NC}"

    # Store in JSON database
    issue_store "ISSUE-$issue_id" "$slug" "$title" "Open" "$type" "$(echo "$priority" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')" "$(echo "$root_cause" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')" "$date" "$date" "N/A" "ISSUE-$issue_id-$slug.md"
    echo -e "${BLUE}✓ Stored in JSON database${NC}"

    echo -e "${GREEN}✓ Issue ISSUE-$issue_id created successfully${NC}"
    echo -e "${YELLOW}→ Edit file: $filename${NC}"
    echo -e "${YELLOW}→ Run: $0 update-index${NC}"
}

# Count issues by status
count_issues() {
    local status="$1"
    local count=0

    for file in "$ISSUES_DIR"/issues/ISSUE-*.md; do
        if [ -f "$file" ]; then
            if grep -q "^\*\*Status\*\*: $status" "$file"; then
                count=$((count + 1))
            fi
        fi
    done

    echo $count
}

# Count issues by priority
count_by_priority() {
    local priority="$1"
    local count=0

    for file in "$ISSUES_DIR"/issues/ISSUE-*.md; do
        if [ -f "$file" ]; then
            if grep -qi "^\*\*Priority\*\*: $priority" "$file"; then
                count=$((count + 1))
            fi
        fi
    done

    echo $count
}

# Count issues by root cause
count_by_root_cause() {
    local root_cause="$1"
    local count=0

    for file in "$ISSUES_DIR"/issues/ISSUE-*.md; do
        if [ -f "$file" ]; then
            if grep -qi "^\*\*Root Cause\*\*: $root_cause" "$file"; then
                count=$((count + 1))
            fi
        fi
    done

    echo $count
}

# Count issues by type
count_by_type() {
    local type="$1"
    local count=0

    for file in "$ISSUES_DIR"/issues/ISSUE-*.md; do
        if [ -f "$file" ]; then
            if grep -qi "^\*\*Type\*\*: $type" "$file"; then
                count=$((count + 1))
            fi
        fi
    done

    echo $count
}

# Update README.md with current statistics
update_index() {
    echo -e "${BLUE}Updating issue index...${NC}"

    local total=$(ls -1 "$ISSUES_DIR"/issues/ISSUE-*.md 2>/dev/null | wc -l | tr -d ' ')
    local open=$(count_issues "Open")
    local in_progress=$(count_issues "In Progress")
    local resolved=$(count_issues "Resolved")

    local critical=$(count_by_priority "critical")
    local high=$(count_by_priority "high")
    local medium=$(count_by_priority "medium")
    local low=$(count_by_priority "low")

    local system=$(count_by_root_cause "system")
    local user=$(count_by_root_cause "user")
    local hybrid=$(count_by_root_cause "hybrid")

    local bug=$(count_by_type "bug")
    local improvement=$(count_by_type "improvement")
    local process=$(count_by_type "process")
    local education=$(count_by_type "education")

    echo -e "${GREEN}✓ Statistics calculated${NC}"
    echo -e "  Total: $total | Open: $open | In Progress: $in_progress | Resolved: $resolved"

    echo -e "${YELLOW}→ Note: Full index regeneration not yet implemented${NC}"
    echo -e "${YELLOW}→ Manually update README.md with these stats:${NC}"
    echo -e "  - Total Issues: $total"
    echo -e "  - Open: $open ($((open * 100 / total))%)"
    echo -e "  - In Progress: $in_progress ($((in_progress * 100 / total))%)"
    echo -e "  - Resolved: $resolved ($((resolved * 100 / total))%)"
}

# List all issues
list_issues() {
    local filter="${1:-all}"

    echo -e "${BLUE}Issues ($filter):${NC}"
    echo ""

    for file in "$ISSUES_DIR"/issues/ISSUE-*.md; do
        if [ -f "$file" ]; then
            local issue_num=$(basename "$file" | grep -oE '[0-9]+' | head -1)
            local title=$(grep "^# ISSUE-" "$file" | sed 's/^# ISSUE-[0-9]*: //')
            local status=$(grep "^\*\*Status\*\*:" "$file" | sed 's/\*\*Status\*\*: //' | tr -d '\r')
            local priority=$(grep "^\*\*Priority\*\*:" "$file" | sed 's/\*\*Priority\*\*: //' | tr -d '\r')

            # Apply filter
            if [ "$filter" = "all" ] || [ "$(echo "$status" | tr '[:upper:]' '[:lower:]')" = "$(echo "$filter" | tr '[:upper:]' '[:lower:]')" ]; then
                local color=$NC
                case "$(echo "$priority" | tr '[:upper:]' '[:lower:]')" in
                    critical) color=$RED ;;
                    high) color=$YELLOW ;;
                    medium) color=$BLUE ;;
                    low) color=$NC ;;
                esac

                printf "${color}ISSUE-%03d${NC}: %s [%s] [%s]\n" "$issue_num" "$title" "$status" "$priority"
            fi
        fi
    done

    echo ""
}

# Show help
show_help() {
    cat << EOF
Issue Tracking Utilities

Usage: $0 <command> [arguments]

Commands:
    generate-log        Generate ISSUES-LOG.md from JSON database
    generate-stats      Generate README.md statistics from JSON
    update-status <id> <status>
                        Update issue status (Open|In Progress|Resolved)
    get <id>            Get issue details from JSON database
    list-json [filter]  List issues from JSON (filter: all|open|in progress|resolved)

    next-id              Get next available issue number
    create <title> [priority] [type] [root_cause]
                        Create new issue
    update-index        Update README.md statistics
    list [filter]       List issues (filter: all|open|in progress|resolved)
    help                Show this help message

Examples:
    $0 next-id
    $0 create "Database connection timeout" high bug system
    $0 update-index
    $0 list open
    $0 list all

Priority: critical | high | medium | low
Type: bug | improvement | process | education
Root Cause: system | user | hybrid
EOF
}

# Main command dispatcher
main() {
    local command="${1:-help}"

    case "$command" in
        next-id)
            get_next_id
            ;;
        create)
            shift
            create_issue "$@"
            ;;
        generate-log)
            issue_generate_log
            ;;
        generate-stats)
            issue_generate_stats
            ;;
        update-status)
            issue_update_status "${2}" "${3}"
            ;;
        get)
            issue_get "${2}"
            ;;
        list-json)
            issue_list_json "${2:-all}"
            ;;

        update-index)
            update_index
            ;;
        list)
            list_issues "${2:-all}"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            echo -e "${RED}Error: Unknown command '$command'${NC}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main if executed directly
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
