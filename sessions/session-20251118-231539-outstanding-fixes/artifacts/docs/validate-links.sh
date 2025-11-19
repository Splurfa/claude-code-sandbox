#!/bin/bash
# Link Validation Script for Restructured Documentation

DOCS_DIR="/Users/splurfa/common-thread-sandbox/docs"
REPORT_FILE="/Users/splurfa/common-thread-sandbox/sessions/session-20251118-231539-outstanding-fixes/artifacts/docs/link-validation-report.md"

echo "# Documentation Link Validation Report" > "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "**Generated**: $(date)" >> "$REPORT_FILE"
echo "**Documentation Structure**: Lifecycle-based (setup/operate/build/coordinate/reference)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

total_links=0
broken_links=0
declare -A broken_link_details

# Find all markdown files
while IFS= read -r file; do
    # Extract relative path from docs/
    rel_file="${file#$DOCS_DIR/}"

    # Find all markdown links in the file
    while IFS= read -r line; do
        line_num=$(echo "$line" | cut -d: -f1)
        content=$(echo "$line" | cut -d: -f2-)

        # Extract markdown links [text](path.md) or [text](path.md#anchor)
        echo "$content" | grep -o '\[.*\]([^)]*\.md[^)]*)' | while read -r link; do
            ((total_links++))

            # Extract the path from [text](path)
            link_path=$(echo "$link" | sed 's/.*(\(.*\))/\1/')

            # Remove anchor if present
            link_file="${link_path%%#*}"
            anchor="${link_path#*#}"
            if [ "$anchor" = "$link_file" ]; then
                anchor=""
            fi

            # Resolve the absolute path based on current file location
            file_dir=$(dirname "$file")

            # Handle different link types
            if [[ "$link_file" == /* ]]; then
                # Absolute path from repo root
                target_file="$link_file"
            else
                # Relative path
                target_file="$file_dir/$link_file"
            fi

            # Normalize the path
            target_file=$(cd "$(dirname "$target_file")" 2>/dev/null && pwd)/$(basename "$target_file") 2>/dev/null

            # Check if target file exists
            if [ ! -f "$target_file" ]; then
                ((broken_links++))
                key="$rel_file:$line_num"
                broken_link_details["$key"]="$link_path"
                echo "BROKEN: $rel_file:$line_num -> $link_path (resolved: $target_file)" >> "$REPORT_FILE.tmp"
            fi

            # If anchor exists, verify it (simplified check)
            if [ -n "$anchor" ] && [ -f "$target_file" ]; then
                # Check if anchor exists in target file (basic check)
                if ! grep -q "^#.*${anchor}" "$target_file" && ! grep -q "id=\"${anchor}\"" "$target_file"; then
                    echo "WARNING: Anchor #$anchor may not exist in $target_file (from $rel_file:$line_num)" >> "$REPORT_FILE.anchor_warnings"
                fi
            fi
        done
    done < <(grep -n '\[.*\](.*\.md' "$file" 2>/dev/null)
done < <(find "$DOCS_DIR" -name "*.md" -type f)

# Write summary
echo "## Summary" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "- **Total Links Checked**: $total_links" >> "$REPORT_FILE"
echo "- **Broken Links Found**: $broken_links" >> "$REPORT_FILE"
echo "- **Success Rate**: $(( 100 - (broken_links * 100 / (total_links > 0 ? total_links : 1)) ))%" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# Add broken links section
if [ -f "$REPORT_FILE.tmp" ]; then
    echo "## Broken Links" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    cat "$REPORT_FILE.tmp" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    rm "$REPORT_FILE.tmp"
else
    echo "## ✅ No Broken Links Found!" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
fi

# Add anchor warnings if any
if [ -f "$REPORT_FILE.anchor_warnings" ]; then
    echo "## Anchor Warnings" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    cat "$REPORT_FILE.anchor_warnings" >> "$REPORT_FILE"
    echo '```' >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    rm "$REPORT_FILE.anchor_warnings"
fi

echo "Validation complete: $REPORT_FILE"
