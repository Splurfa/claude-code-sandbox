#!/usr/bin/env bash
# Comprehensive Artifact Review Functions
# Display all session artifacts organized by type

# show_code_artifacts: Display code artifact summary
# Arguments:
#   $1 - Session ID
show_code_artifacts() {
  local session_id="$1"
  local code_dir="sessions/$session_id/artifacts/code"

  if [[ ! -d "$code_dir" ]] || [[ -z "$(ls -A "$code_dir" 2>/dev/null)" ]]; then
    return 0  # No code artifacts
  fi

  echo "💻 Code Artifacts"
  echo "═══════════════════════════════════════"

  local file_count=$(find "$code_dir" -type f | wc -l | tr -d ' ')
  local total_size=$(du -sh "$code_dir" 2>/dev/null | cut -f1)

  echo "Total: $file_count files ($total_size)"
  echo

  # Group by file type
  local js_files=$(find "$code_dir" -name "*.js" -o -name "*.mjs" -o -name "*.cjs" 2>/dev/null | wc -l | tr -d ' ')
  local ts_files=$(find "$code_dir" -name "*.ts" -o -name "*.tsx" 2>/dev/null | wc -l | tr -d ' ')
  local sh_files=$(find "$code_dir" -name "*.sh" 2>/dev/null | wc -l | tr -d ' ')
  local json_files=$(find "$code_dir" -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
  local other_files=$((file_count - js_files - ts_files - sh_files - json_files))

  echo "By type:"
  [ $js_files -gt 0 ] && echo "  • JavaScript: $js_files files"
  [ $ts_files -gt 0 ] && echo "  • TypeScript: $ts_files files"
  [ $sh_files -gt 0 ] && echo "  • Shell scripts: $sh_files files"
  [ $json_files -gt 0 ] && echo "  • JSON configs: $json_files files"
  [ $other_files -gt 0 ] && echo "  • Other: $other_files files"
  echo

  # List notable files (>5KB or in root)
  echo "Notable files:"
  find "$code_dir" -maxdepth 2 -type f -exec du -h {} \; 2>/dev/null | sort -rh | head -10 | while read size file; do
    filename=$(basename "$file")
    echo "  • $filename ($size)"
  done
  echo
}

# show_test_artifacts: Display test artifact summary
# Arguments:
#   $1 - Session ID
show_test_artifacts() {
  local session_id="$1"
  local test_dir="sessions/$session_id/artifacts/tests"

  if [[ ! -d "$test_dir" ]] || [[ -z "$(ls -A "$test_dir" 2>/dev/null)" ]]; then
    return 0
  fi

  echo "🧪 Test Artifacts"
  echo "═══════════════════════════════════════"

  local test_count=$(find "$test_dir" -type f \( -name "*.test.js" -o -name "*.spec.js" -o -name "*.test.ts" -o -name "*.sh" \) 2>/dev/null | wc -l | tr -d ' ')
  local md_tests=$(find "$test_dir" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
  local total_size=$(du -sh "$test_dir" 2>/dev/null | cut -f1)

  echo "Total: $test_count test files, $md_tests test docs ($total_size)"
  echo

  # List all test files
  echo "Test files:"
  find "$test_dir" -type f 2>/dev/null | while read file; do
    filename=$(basename "$file")
    size=$(du -h "$file" | cut -f1)
    echo "  • $filename ($size)"
  done
  echo
}

# show_script_artifacts: Display script artifact summary
# Arguments:
#   $1 - Session ID
show_script_artifacts() {
  local session_id="$1"
  local script_dir="sessions/$session_id/artifacts/scripts"

  if [[ ! -d "$script_dir" ]] || [[ -z "$(ls -A "$script_dir" 2>/dev/null)" ]]; then
    return 0
  fi

  echo "⚙️  Script Artifacts"
  echo "═══════════════════════════════════════"

  local script_count=$(find "$script_dir" -type f 2>/dev/null | wc -l | tr -d ' ')

  echo "Automation scripts:"
  find "$script_dir" -type f 2>/dev/null | while read file; do
    filename=$(basename "$file")
    size=$(du -h "$file" | cut -f1)

    # Check if executable
    if [[ -x "$file" ]]; then
      echo "  • $filename ($size) [executable]"
    else
      echo "  • $filename ($size)"
    fi
  done
  echo
}

# show_notes_artifacts: Display notes artifact summary
# Arguments:
#   $1 - Session ID
show_notes_artifacts() {
  local session_id="$1"
  local notes_dir="sessions/$session_id/artifacts/notes"

  if [[ ! -d "$notes_dir" ]] || [[ -z "$(ls -A "$notes_dir" 2>/dev/null)" ]]; then
    return 0
  fi

  echo "📝 Notes & Research"
  echo "═══════════════════════════════════════"

  find "$notes_dir" -type f -name "*.md" 2>/dev/null | while read file; do
    filename=$(basename "$file")
    size=$(du -h "$file" | cut -f1)
    lines=$(wc -l < "$file")

    # Extract first heading for context
    first_heading=$(grep "^# " "$file" | head -1 | sed 's/^# //')

    if [[ -n "$first_heading" ]]; then
      echo "  • $filename ($size, $lines lines)"
      echo "    '$first_heading'"
    else
      echo "  • $filename ($size, $lines lines)"
    fi
  done
  echo
}
