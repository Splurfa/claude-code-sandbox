#!/bin/bash
# Tag-Based Content Promotion Workflow
# Promotes tagged content from sessions/ to workspace with review gates

set -e

SESSIONS_DIR="sessions"
WORKSPACE_ROOT="."
STAGING_FILE=".swarm/promotion-staging.json"
HISTORY_FILE=".swarm/promotion-history.json"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

usage() {
    cat << EOF
Usage: $(basename "$0") <command> [options]

Commands:
    scan-tags <session-id>    Scan session for PROMOTE tags
    scan-all                  Scan all non-archived sessions
    review-staged             Review files staged for promotion
    approve-staged            Execute approved promotions
    reject <file-hash>        Reject a staged promotion
    history                   View promotion history
    list-sessions             List available sessions

Examples:
    $(basename "$0") scan-tags session-20251117-233300-workspace-docs-optimization
    $(basename "$0") review-staged
    $(basename "$0") approve-staged

EOF
    exit 1
}

init_files() {
    [ ! -f "$STAGING_FILE" ] && echo "[]" > "$STAGING_FILE"
    [ ! -f "$HISTORY_FILE" ] && echo "[]" > "$HISTORY_FILE"
}

list_sessions() {
    echo -e "${BLUE}Available sessions:${NC}"
    find "$SESSIONS_DIR" -maxdepth 1 -type d -name "session-*" ! -path "*/.*" | while read -r session; do
        session_id=$(basename "$session")
        artifact_count=$(find "$session/artifacts" -type f 2>/dev/null | wc -l || echo "0")
        echo -e "  ${GREEN}$session_id${NC} ($artifact_count files)"
    done
}

scan_session_for_tags() {
    local session_id="$1"
    local session_path="$SESSIONS_DIR/$session_id"

    if [ ! -d "$session_path" ]; then
        echo -e "${RED}Error: Session not found: $session_id${NC}"
        exit 1
    fi

    echo -e "${BLUE}Scanning $session_id for PROMOTE tags...${NC}"

    local found_count=0
    local staged_promotions=()

    # Find all markdown files with PROMOTE tags
    while IFS= read -r file; do
        # Extract PROMOTE tag and target path
        local promote_line=$(grep -m 1 "^<!--.*PROMOTE:" "$file" || true)

        if [ -n "$promote_line" ]; then
            # Extract target path from comment
            local target_path=$(echo "$promote_line" | sed -E 's/.*PROMOTE:[[:space:]]*([^[:space:]]+).*/\1/' | tr -d '>')

            if [ -n "$target_path" ]; then
                found_count=$((found_count + 1))
                local file_hash=$(echo "$file" | md5)
                local file_size=$(wc -c < "$file" | tr -d ' ')
                local file_lines=$(wc -l < "$file" | tr -d ' ')

                echo -e "  ${GREEN}✓${NC} Found: $(basename "$file") → $target_path"

                # Stage for promotion
                staged_promotions+=("{\"hash\":\"$file_hash\",\"source\":\"$file\",\"target\":\"$target_path\",\"session\":\"$session_id\",\"size\":$file_size,\"lines\":$file_lines,\"status\":\"pending\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}")
            fi
        fi
    done < <(find "$session_path/artifacts" -type f -name "*.md" 2>/dev/null)

    if [ $found_count -eq 0 ]; then
        echo -e "${YELLOW}No PROMOTE tags found in $session_id${NC}"
        return
    fi

    # Update staging file
    local current_staging=$(cat "$STAGING_FILE")
    local new_staging="["

    # Keep existing non-matching entries
    local first=true
    echo "$current_staging" | jq -c '.[]' 2>/dev/null | while read -r entry; do
        if [ "$first" = true ]; then
            new_staging="$entry"
            first=false
        else
            new_staging="$new_staging,$entry"
        fi
    done

    # Add new promotions
    for promotion in "${staged_promotions[@]}"; do
        if [ "$first" = true ]; then
            new_staging="$promotion"
            first=false
        else
            new_staging="$new_staging,$promotion"
        fi
    done

    new_staging="$new_staging]"
    echo "$new_staging" | jq '.' > "$STAGING_FILE"

    echo -e "${GREEN}✓ Staged $found_count file(s) for promotion${NC}"
    echo -e "${YELLOW}Run 'review-staged' to review before approval${NC}"
}

scan_all_sessions() {
    echo -e "${BLUE}Scanning all sessions for PROMOTE tags...${NC}"
    local total_found=0

    find "$SESSIONS_DIR" -maxdepth 1 -type d -name "session-*" ! -path "*/.*" | while read -r session; do
        session_id=$(basename "$session")
        scan_session_for_tags "$session_id"
    done
}

review_staged() {
    local staging=$(cat "$STAGING_FILE")
    local count=$(echo "$staging" | jq 'length')

    if [ "$count" -eq 0 ]; then
        echo -e "${YELLOW}No files staged for promotion${NC}"
        exit 0
    fi

    echo -e "${BLUE}=== Staged Promotions ===${NC}"
    echo -e "${YELLOW}$count file(s) pending review${NC}\n"

    echo "$staging" | jq -r '.[] |
        "[\(.status)] \(.source)\n" +
        "  → Target: \(.target)\n" +
        "  Session: \(.session)\n" +
        "  Size: \(.size) bytes (\(.lines) lines)\n" +
        "  Hash: \(.hash)\n"'

    echo -e "${GREEN}To approve all: $(basename "$0") approve-staged${NC}"
    echo -e "${RED}To reject one: $(basename "$0") reject <file-hash>${NC}"
}

approve_staged() {
    local staging=$(cat "$STAGING_FILE")
    local count=$(echo "$staging" | jq '[.[] | select(.status == "pending")] | length')

    if [ "$count" -eq 0 ]; then
        echo -e "${YELLOW}No pending promotions to approve${NC}"
        exit 0
    fi

    echo -e "${BLUE}Approving $count promotion(s)...${NC}"

    local success_count=0
    local fail_count=0

    # Process each pending promotion
    echo "$staging" | jq -c '.[] | select(.status == "pending")' | while read -r promotion; do
        local source=$(echo "$promotion" | jq -r '.source')
        local target=$(echo "$promotion" | jq -r '.target')
        local hash=$(echo "$promotion" | jq -r '.hash')

        # Create target directory if needed
        local target_dir=$(dirname "$target")
        mkdir -p "$target_dir"

        # Copy file to target (preserving source)
        if cp "$source" "$target"; then
            success_count=$((success_count + 1))
            echo -e "  ${GREEN}✓${NC} Promoted: $(basename "$source") → $target"

            # Update status in staging
            jq --arg hash "$hash" '(.[] | select(.hash == $hash) | .status) = "completed"' "$STAGING_FILE" > "$STAGING_FILE.tmp"
            mv "$STAGING_FILE.tmp" "$STAGING_FILE"

            # Add to history
            local history=$(cat "$HISTORY_FILE")
            local new_entry=$(echo "$promotion" | jq ". + {\"completed_at\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\", \"status\": \"completed\"}")
            echo "$history" | jq ". + [$new_entry]" > "$HISTORY_FILE"
        else
            fail_count=$((fail_count + 1))
            echo -e "  ${RED}✗${NC} Failed: $(basename "$source") → $target"
        fi
    done

    echo -e "\n${GREEN}✓ Completed: $success_count promotion(s)${NC}"
    [ $fail_count -gt 0 ] && echo -e "${RED}✗ Failed: $fail_count promotion(s)${NC}"

    # Clean up completed entries from staging
    jq '[.[] | select(.status != "completed")]' "$STAGING_FILE" > "$STAGING_FILE.tmp"
    mv "$STAGING_FILE.tmp" "$STAGING_FILE"
}

reject_promotion() {
    local hash_to_reject="$1"

    if [ -z "$hash_to_reject" ]; then
        echo -e "${RED}Error: No hash provided${NC}"
        usage
    fi

    local staging=$(cat "$STAGING_FILE")
    local found=$(echo "$staging" | jq --arg hash "$hash_to_reject" '[.[] | select(.hash == $hash)] | length')

    if [ "$found" -eq 0 ]; then
        echo -e "${RED}Error: Hash not found in staging: $hash_to_reject${NC}"
        exit 1
    fi

    # Remove from staging
    jq --arg hash "$hash_to_reject" '[.[] | select(.hash != $hash)]' "$STAGING_FILE" > "$STAGING_FILE.tmp"
    mv "$STAGING_FILE.tmp" "$STAGING_FILE"

    echo -e "${GREEN}✓ Rejected promotion: $hash_to_reject${NC}"
}

show_history() {
    local history=$(cat "$HISTORY_FILE")
    local count=$(echo "$history" | jq 'length')

    if [ "$count" -eq 0 ]; then
        echo -e "${YELLOW}No promotion history${NC}"
        exit 0
    fi

    echo -e "${BLUE}=== Promotion History ===${NC}"
    echo -e "${YELLOW}$count completed promotion(s)${NC}\n"

    echo "$history" | jq -r '.[] |
        "[\(.completed_at)] \(.source)\n" +
        "  → \(.target)\n" +
        "  Session: \(.session)\n"'
}

# Main command router
init_files

case "${1:-}" in
    scan-tags)
        [ -z "${2:-}" ] && usage
        scan_session_for_tags "$2"
        ;;
    scan-all)
        scan_all_sessions
        ;;
    review-staged)
        review_staged
        ;;
    approve-staged)
        approve_staged
        ;;
    reject)
        reject_promotion "$2"
        ;;
    history)
        show_history
        ;;
    list-sessions)
        list_sessions
        ;;
    *)
        usage
        ;;
esac
