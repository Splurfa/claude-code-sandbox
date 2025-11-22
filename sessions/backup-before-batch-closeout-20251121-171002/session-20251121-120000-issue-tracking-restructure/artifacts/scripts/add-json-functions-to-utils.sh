#!/bin/bash
# Add JSON database functions to issue-utils.sh
# Part of Phase 3: Issue Tracking Restructure

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
UTILS_FILE="$PROJECT_ROOT/sessions/issues/issue-utils.sh"

echo "📝 Adding JSON database functions to issue-utils.sh..."
echo

# Backup original
cp "$UTILS_FILE" "$UTILS_FILE.backup"
echo "✓ Backup created: issue-utils.sh.backup"

# Add JSON functions after line 8 (after ISSUES_DIR declaration)
cat > "${UTILS_FILE}.new" << 'EOF'
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

EOF

# Append original functions starting from line 10 (after colors section)
tail -n +10 "$UTILS_FILE" >> "${UTILS_FILE}.new"

# Update the create_issue function to also store in JSON
sed -i '' '/echo -e "\${GREEN}✓ Issue ISSUE-\$issue_id created successfully\${NC}"/i\
    # Store in JSON database\
    issue_store "ISSUE-$issue_id" "$slug" "$title" "Open" "$type" "$(echo "$priority" | awk '"'"'{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1'"'"')" "$(echo "$root_cause" | awk '"'"'{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1'"'"')" "$date" "$date" "N/A" "ISSUE-$issue_id-$slug.md"\
    echo -e "${BLUE}✓ Stored in JSON database${NC}"\
' "${UTILS_FILE}.new"

# Update help to show new commands
sed -i '' '/Commands:/a\
\    generate-log        Generate ISSUES-LOG.md from JSON database\
\    generate-stats      Generate README.md statistics from JSON\
\    update-status <id> <status>\
\                        Update issue status (Open|In Progress|Resolved)\
\    get <id>            Get issue details from JSON database\
\    list-json [filter]  List issues from JSON (filter: all|open|in progress|resolved)\
' "${UTILS_FILE}.new"

# Update command dispatcher to include new commands
sed -i '' '/update-index)/i\
        generate-log)\
            issue_generate_log\
            ;;\
        generate-stats)\
            issue_generate_stats\
            ;;\
        update-status)\
            issue_update_status "${2}" "${3}"\
            ;;\
        get)\
            issue_get "${2}"\
            ;;\
        list-json)\
            issue_list_json "${2:-all}"\
            ;;\
' "${UTILS_FILE}.new"

# Replace original with updated version
mv "${UTILS_FILE}.new" "$UTILS_FILE"
chmod +x "$UTILS_FILE"

echo "✅ JSON functions added to issue-utils.sh"
echo
echo "📋 New commands available:"
echo "  - generate-log       → Create ISSUES-LOG.md"
echo "  - generate-stats     → Create README.md with auto-generated statistics"
echo "  - update-status      → Update issue status in JSON + markdown"
echo "  - get                → Retrieve issue from JSON database"
echo "  - list-json          → List issues from JSON with filters"
echo
echo "🧪 Testing new functions..."
bash "$UTILS_FILE" generate-log
bash "$UTILS_FILE" generate-stats
bash "$UTILS_FILE" list-json all

echo
echo "✅ Phase 3 complete!"
