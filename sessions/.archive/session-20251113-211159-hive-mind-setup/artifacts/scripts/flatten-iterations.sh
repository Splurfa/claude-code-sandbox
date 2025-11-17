#!/bin/bash
# Migration script to flatten iteration structure

SESSION_DIR="/Users/splurfa/common-thread-sandbox/sessions/session-20251113-211159-hive-mind-setup"
TARGET_ARTIFACTS="$SESSION_DIR/artifacts"

echo "🚀 Starting iteration structure flattening..."
echo "📂 Session: session-20251113-211159-hive-mind-setup"
echo ""

# Ensure target directories exist
mkdir -p "$TARGET_ARTIFACTS"/{code,tests,docs,scripts,notes}

# Counter for tracking
FILE_COUNT=0

# Function to copy file with iteration prefix
copy_with_prefix() {
    local src=$1
    local iteration=$2
    local category=$3  # code, tests, docs, scripts, notes

    local filename=$(basename "$src")
    local dest_dir="$TARGET_ARTIFACTS/$category"

    # Add iteration prefix to filename
    local dest_file="${iteration}-${filename}"

    # Copy file
    cp "$src" "$dest_dir/$dest_file"
    echo "  ✓ $category/$dest_file"
    ((FILE_COUNT++))
}

# Iterate through iteration-2 to iteration-6
for iter in iteration-2 iteration-3 iteration-4 iteration-5 iteration-6; do
    echo "📁 Processing $iter..."

    # Process code files
    if [ -d "$SESSION_DIR/$iter/artifacts/code" ]; then
        find "$SESSION_DIR/$iter/artifacts/code" -type f \( -name "*.js" -o -name "*.json" \) | while read file; do
            copy_with_prefix "$file" "$iter" "code"
        done
    fi

    # Process test files
    if [ -d "$SESSION_DIR/$iter/artifacts/tests" ]; then
        find "$SESSION_DIR/$iter/artifacts/tests" -type f \( -name "*.js" -o -name "*.md" \) | while read file; do
            copy_with_prefix "$file" "$iter" "tests"
        done
    fi

    # Process doc files
    if [ -d "$SESSION_DIR/$iter/artifacts/docs" ]; then
        find "$SESSION_DIR/$iter/artifacts/docs" -type f -name "*.md" | while read file; do
            copy_with_prefix "$file" "$iter" "docs"
        done
    fi

    # Process script files
    if [ -d "$SESSION_DIR/$iter/artifacts/scripts" ]; then
        find "$SESSION_DIR/$iter/artifacts/scripts" -type f \( -name "*.sh" -o -name "*.js" \) | while read file; do
            copy_with_prefix "$file" "$iter" "scripts"
        done
    fi

    # Process note files
    if [ -d "$SESSION_DIR/$iter/artifacts/notes" ]; then
        find "$SESSION_DIR/$iter/artifacts/notes" -type f -name "*.md" | while read file; do
            copy_with_prefix "$file" "$iter" "notes"
        done
    fi

    # Copy root-level markdown files
    find "$SESSION_DIR/$iter" -maxdepth 1 -type f -name "*.md" | while read file; do
        copy_with_prefix "$file" "$iter" "docs"
    done

    echo ""
done

# Process iteration-2 nested structures
echo "📁 Processing iteration-2 nested structures..."

# Corrections subdirectories
if [ -d "$SESSION_DIR/iteration-2/artifacts/corrections" ]; then
    find "$SESSION_DIR/iteration-2/artifacts/corrections" -type f -name "*.md" | while read file; do
        copy_with_prefix "$file" "iteration-2-corrections" "docs"
    done
fi

# Master oversight
if [ -d "$SESSION_DIR/iteration-2/artifacts/master-oversight" ]; then
    find "$SESSION_DIR/iteration-2/artifacts/master-oversight/docs" -type f -name "*.md" | while read file; do
        copy_with_prefix "$file" "iteration-2-master-oversight" "docs"
    done
fi

# Phase-1
if [ -d "$SESSION_DIR/iteration-2/artifacts/phase-1" ]; then
    find "$SESSION_DIR/iteration-2/artifacts/phase-1/docs" -type f \( -name "*.md" -o -name "*.json" \) | while read file; do
        copy_with_prefix "$file" "iteration-2-phase-1" "docs"
    done
fi

echo ""
echo "✅ Migration complete!"
echo "📊 Total files migrated: $FILE_COUNT"
echo ""
echo "📋 Next steps:"
echo "  1. Verify migration correctness"
echo "  2. Remove iteration directories after verification"
echo "  3. Update documentation references"
