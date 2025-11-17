#!/bin/bash
# Session ID Validation Library
# Prevents command injection and path traversal attacks

# Strict session ID validation
# Format: session-YYYYMMDD-HHMMSS-topic
# topic: lowercase alphanumeric with hyphens only
validate_session_id() {
    local id="$1"

    # Check format matches expected pattern
    if [[ ! "$id" =~ ^session-[0-9]{8}-[0-9]{6}-[a-z0-9-]+$ ]]; then
        echo "ERROR: Invalid session ID format" >&2
        echo "Expected: session-YYYYMMDD-HHMMSS-topic (lowercase, alphanumeric, hyphens only)" >&2
        return 1
    fi

    # Additional security checks
    # Prevent path traversal
    if [[ "$id" =~ \.\. ]]; then
        echo "ERROR: Path traversal attempt detected in session ID" >&2
        return 1
    fi

    # Prevent command substitution
    if [[ "$id" =~ [\$\`\;] ]]; then
        echo "ERROR: Command injection attempt detected in session ID" >&2
        return 1
    fi

    # ID is valid
    echo "$id"
    return 0
}

# Sanitize topic for session ID creation
sanitize_topic() {
    local topic="$1"

    # Remove any dangerous characters first (including backticks, dots)
    topic=$(echo "$topic" | tr -d '`$;|<>!*?[]{}().')

    # Convert to lowercase
    topic=$(echo "$topic" | tr '[:upper:]' '[:lower:]')

    # Remove all non-alphanumeric except hyphens and spaces
    topic=$(echo "$topic" | sed 's/[^a-z0-9 -]//g')

    # Replace spaces with hyphens
    topic=$(echo "$topic" | tr ' ' '-')

    # Remove consecutive hyphens
    topic=$(echo "$topic" | sed 's/--*/-/g')

    # Trim hyphens from start and end
    topic=$(echo "$topic" | sed 's/^-//;s/-$//')

    # Limit length to 50 characters
    topic=$(echo "$topic" | cut -c1-50)

    # Final safety check - if empty, use default
    if [ -z "$topic" ]; then
        topic="unknown"
    fi

    echo "$topic"
}

# Generate safe session ID
generate_session_id() {
    local topic="$1"

    # Sanitize the topic
    local clean_topic=$(sanitize_topic "$topic")

    # Generate timestamp
    local timestamp=$(date +%Y%m%d-%H%M%S)

    # Construct session ID
    local session_id="session-${timestamp}-${clean_topic}"

    # Validate it (should always pass, but be safe)
    if validate_session_id "$session_id"; then
        echo "$session_id"
        return 0
    else
        echo "ERROR: Generated session ID failed validation" >&2
        return 1
    fi
}

# Sanitize file path (prevent directory traversal)
sanitize_path() {
    local path="$1"

    # Remove any .. patterns
    path=$(echo "$path" | sed 's/\.\.//g')

    # Remove leading slashes (keep paths relative)
    path=$(echo "$path" | sed 's/^\/*//')

    echo "$path"
}

# Sanitize filename (keep only safe characters)
sanitize_filename() {
    local filename="$1"

    # Only allow alphanumeric, dots, hyphens, underscores
    filename=$(echo "$filename" | sed 's/[^a-zA-Z0-9._-]/_/g')

    echo "$filename"
}

# Validate artifact type
validate_artifact_type() {
    local type="$1"

    # Only allow specific artifact types
    case "$type" in
        code|tests|docs|scripts|notes)
            echo "$type"
            return 0
            ;;
        *)
            echo "ERROR: Invalid artifact type: $type" >&2
            echo "Allowed: code, tests, docs, scripts, notes" >&2
            return 1
            ;;
    esac
}

# Safe session path construction
get_session_path() {
    local session_id="$1"
    local artifact_type="${2:-}"

    # Validate session ID
    if ! validate_session_id "$session_id" >/dev/null; then
        return 1
    fi

    # Base path
    local base_path="sessions/$session_id"

    # Add artifact type if provided
    if [ -n "$artifact_type" ]; then
        if validate_artifact_type "$artifact_type" >/dev/null; then
            echo "${base_path}/artifacts/${artifact_type}"
        else
            return 1
        fi
    else
        echo "$base_path"
    fi

    return 0
}

# Export functions for use in other scripts
export -f validate_session_id
export -f sanitize_topic
export -f generate_session_id
export -f sanitize_path
export -f sanitize_filename
export -f validate_artifact_type
export -f get_session_path
