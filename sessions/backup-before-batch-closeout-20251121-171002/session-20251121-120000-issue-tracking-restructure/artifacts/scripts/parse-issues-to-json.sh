#!/bin/bash
# Parse existing ISSUE-*.md files into JSON database
# Part of Phase 2: Issue Tracking Restructure

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
ISSUES_DIR="$PROJECT_ROOT/sessions/issues"
OUTPUT_FILE="$ISSUES_DIR/.issues-database.json"

# Parse a single issue file
parse_issue() {
    local file="$1"
    local filename=$(basename "$file")

    # Extract issue ID from filename (ISSUE-001-topic.md → ISSUE-001)
    local issue_id=$(echo "$filename" | grep -oE '^ISSUE-[0-9]+')

    # Extract slug from filename (ISSUE-001-captains-log-automation.md → captains-log-automation)
    local slug=$(echo "$filename" | sed -E 's/^ISSUE-[0-9]+-(.*)\.md$/\1/')

    # Read file content
    local content=$(cat "$file")

    # Extract title (first # heading)
    local title=$(echo "$content" | grep -m1 '^# ISSUE-' | sed 's/^# ISSUE-[0-9]*: //')

    # Extract metadata from frontmatter-style section
    local status=$(echo "$content" | grep -m1 '^\*\*Status\*\*:' | sed 's/^\*\*Status\*\*: //')
    local type=$(echo "$content" | grep -m1 '^\*\*Type\*\*:' | sed 's/^\*\*Type\*\*: //')
    local priority=$(echo "$content" | grep -m1 '^\*\*Priority\*\*:' | sed 's/^\*\*Priority\*\*: //')
    local root_cause=$(echo "$content" | grep -m1 '^\*\*Root Cause\*\*:' | sed 's/^\*\*Root Cause\*\*: //')
    local created=$(echo "$content" | grep -m1 '^\*\*Created\*\*:' | sed 's/^\*\*Created\*\*: //')
    local updated=$(echo "$content" | grep -m1 '^\*\*Updated\*\*:' | sed 's/^\*\*Updated\*\*: //')
    local resolved=$(echo "$content" | grep -m1 '^\*\*Resolved\*\*:' | sed 's/^\*\*Resolved\*\*: //')

    # Extract related issues
    local related_issues=$(echo "$content" | grep -A5 '## Related Issues' | grep -oE 'ISSUE-[0-9]+' | tr '\n' ',' | sed 's/,$//')

    # Build JSON object
    cat <<EOF
  "$issue_id": {
    "id": "$issue_id",
    "slug": "$slug",
    "title": "$title",
    "status": "$status",
    "type": "$type",
    "priority": "$priority",
    "root_cause": "$root_cause",
    "created": "$created",
    "updated": "$updated",
    "resolved": "$resolved",
    "file": "$filename",
    "related_issues": [$(echo "$related_issues" | sed 's/,/", "/g' | sed 's/^/"/' | sed 's/$/"/' | sed 's/""//g')]
  }
EOF
}

echo "🔍 Parsing ISSUE-*.md files to JSON..."
echo

# Initialize JSON object
echo "{" > "$OUTPUT_FILE"

# Parse all valid issue files (skip duplicates)
first=true
for file in "$ISSUES_DIR"/ISSUE-*.md; do
    [ -f "$file" ] || continue

    filename=$(basename "$file")

    # Skip duplicate ISSUE-009 files (only keep ISSUE-009-performance-claims.md)
    if [[ "$filename" == "ISSUE-009-file-routing-violations.md" ]] || \
       [[ "$filename" == "ISSUE-009-session-naming-protocol-violations.md" ]] || \
       [[ "$filename" == "ISSUE-009-file-routing-compliance-violations.md" ]]; then
        echo "⏭️  Skipping duplicate template: $filename"
        continue
    fi

    echo "✓ Parsing: $filename"

    # Add comma if not first entry
    if [ "$first" = false ]; then
        echo "," >> "$OUTPUT_FILE"
    fi
    first=false

    # Parse issue and append to JSON
    parse_issue "$file" >> "$OUTPUT_FILE"
done

# Close JSON object
echo "" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

echo
echo "✅ JSON database created: $OUTPUT_FILE"
echo

# Validate JSON
if command -v jq &> /dev/null; then
    echo "🔍 Validating JSON..."
    if jq '.' "$OUTPUT_FILE" > /dev/null 2>&1; then
        echo "✅ JSON valid"

        # Show statistics
        echo
        echo "📊 Statistics:"
        echo "  Total issues: $(jq 'length' "$OUTPUT_FILE")"
        echo "  Open: $(jq '[.[] | select(.status == "Open")] | length' "$OUTPUT_FILE")"
        echo "  In Progress: $(jq '[.[] | select(.status == "In Progress")] | length' "$OUTPUT_FILE")"
        echo "  Resolved: $(jq '[.[] | select(.resolved != "N/A")] | length' "$OUTPUT_FILE")"
        echo
        echo "  By Priority:"
        echo "    Critical: $(jq '[.[] | select(.priority == "Critical")] | length' "$OUTPUT_FILE")"
        echo "    High: $(jq '[.[] | select(.priority == "High")] | length' "$OUTPUT_FILE")"
        echo "    Medium: $(jq '[.[] | select(.priority == "Medium")] | length' "$OUTPUT_FILE")"
        echo "    Low: $(jq '[.[] | select(.priority == "Low")] | length' "$OUTPUT_FILE")"
    else
        echo "❌ JSON validation failed"
        exit 1
    fi
else
    echo "⚠️  jq not found, skipping validation"
fi

echo
echo "📝 Next: Generate ISSUES-LOG.md and README.md from JSON database"
