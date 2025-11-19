#!/usr/bin/env python3
"""Validate all internal markdown links in documentation."""

import re
import os
from pathlib import Path
from collections import defaultdict

DOCS_DIR = Path("/Users/splurfa/common-thread-sandbox/docs")
WORKSPACE_ROOT = Path("/Users/splurfa/common-thread-sandbox")

# Regex to match markdown links: [text](path.md) or [text](path.md#anchor)
LINK_PATTERN = re.compile(r'\[([^\]]+)\]\(([^)]+\.md[^)]*)\)')

def find_all_md_files(root_dir):
    """Find all markdown files in directory."""
    return list(root_dir.rglob("*.md"))

def extract_links_from_file(file_path):
    """Extract all internal markdown links from a file."""
    links = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            for line_num, line in enumerate(f, 1):
                for match in LINK_PATTERN.finditer(line):
                    text = match.group(1)
                    link_path = match.group(2)
                    links.append((line_num, text, link_path))
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    return links

def resolve_link_path(source_file, link_path):
    """Resolve a relative link path to absolute path."""
    # Remove anchor if present
    file_part = link_path.split('#')[0]
    anchor = link_path.split('#')[1] if '#' in link_path else None

    source_dir = source_file.parent

    # Handle different link types
    if file_part.startswith('/'):
        # Absolute from workspace root
        target = WORKSPACE_ROOT / file_part.lstrip('/')
    elif file_part.startswith('../'):
        # Relative path
        target = (source_dir / file_part).resolve()
    else:
        # Same directory or subdirectory
        target = (source_dir / file_part).resolve()

    return target, anchor

def check_anchor_exists(file_path, anchor):
    """Check if an anchor exists in the target file."""
    if not anchor:
        return True

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check for markdown headers: # Header or ## Header, etc.
            # Convert "Header Name" to "header-name" for comparison
            anchor_normalized = anchor.lower().replace(' ', '-')

            # Look for markdown headers
            header_pattern = re.compile(r'^#+\s+(.+)$', re.MULTILINE)
            for match in header_pattern.finditer(content):
                header_text = match.group(1).strip()
                header_id = header_text.lower().replace(' ', '-').replace('/', '').replace('(', '').replace(')', '').replace(':', '')
                if header_id == anchor_normalized:
                    return True

            # Also check for explicit HTML anchors
            if f'id="{anchor}"' in content or f"id='{anchor}'" in content:
                return True

        return False
    except Exception as e:
        print(f"Error checking anchor in {file_path}: {e}")
        return False

def main():
    """Main validation logic."""
    print("Starting link validation...")

    all_files = find_all_md_files(DOCS_DIR)
    print(f"Found {len(all_files)} markdown files\n")

    total_links = 0
    broken_links = []
    broken_anchors = []

    for md_file in sorted(all_files):
        rel_path = md_file.relative_to(WORKSPACE_ROOT)
        links = extract_links_from_file(md_file)

        for line_num, text, link_path in links:
            # Skip external links
            if link_path.startswith('http://') or link_path.startswith('https://'):
                continue

            total_links += 1
            target_file, anchor = resolve_link_path(md_file, link_path)

            # Check if target file exists
            if not target_file.exists():
                broken_links.append({
                    'source': str(rel_path),
                    'line': line_num,
                    'text': text,
                    'link': link_path,
                    'resolved': str(target_file.relative_to(WORKSPACE_ROOT)) if target_file.is_relative_to(WORKSPACE_ROOT) else str(target_file)
                })
            elif anchor:
                # File exists, check anchor
                if not check_anchor_exists(target_file, anchor):
                    broken_anchors.append({
                        'source': str(rel_path),
                        'line': line_num,
                        'text': text,
                        'link': link_path,
                        'anchor': anchor,
                        'target': str(target_file.relative_to(WORKSPACE_ROOT))
                    })

    # Generate report
    report_path = Path("/Users/splurfa/common-thread-sandbox/sessions/session-20251118-231539-outstanding-fixes/artifacts/docs/link-validation-report.md")

    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Documentation Link Validation Report\n\n")
        f.write(f"**Generated**: {Path.cwd()}\n")
        f.write(f"**Documentation Structure**: Lifecycle-based (setup/operate/build/coordinate/reference)\n\n")

        # Summary
        f.write("## Summary\n\n")
        f.write(f"- **Total Links Checked**: {total_links}\n")
        f.write(f"- **Broken File Links**: {len(broken_links)}\n")
        f.write(f"- **Broken Anchor Links**: {len(broken_anchors)}\n")
        success_rate = 100 - ((len(broken_links) + len(broken_anchors)) * 100 // max(total_links, 1))
        f.write(f"- **Success Rate**: {success_rate}%\n\n")

        # Broken file links
        if broken_links:
            f.write("## Broken File Links\n\n")
            f.write("These links point to files that don't exist:\n\n")

            # Group by source file
            by_source = defaultdict(list)
            for link in broken_links:
                by_source[link['source']].append(link)

            for source in sorted(by_source.keys()):
                f.write(f"### {source}\n\n")
                for link in by_source[source]:
                    f.write(f"- **Line {link['line']}**: `[{link['text']}]({link['link']})`\n")
                    f.write(f"  - Resolved to: `{link['resolved']}`\n")
                    f.write(f"  - Status: ❌ File not found\n\n")
        else:
            f.write("## ✅ No Broken File Links Found!\n\n")

        # Broken anchors
        if broken_anchors:
            f.write("## Broken Anchor Links\n\n")
            f.write("These links point to anchors that may not exist:\n\n")

            by_source = defaultdict(list)
            for link in broken_anchors:
                by_source[link['source']].append(link)

            for source in sorted(by_source.keys()):
                f.write(f"### {source}\n\n")
                for link in by_source[source]:
                    f.write(f"- **Line {link['line']}**: `[{link['text']}]({link['link']})`\n")
                    f.write(f"  - Target file: `{link['target']}`\n")
                    f.write(f"  - Missing anchor: `#{link['anchor']}`\n\n")
        else:
            f.write("## ✅ No Broken Anchor Links Found!\n\n")

        # Recommendations
        f.write("## Recommendations\n\n")
        if broken_links:
            f.write("### Fix Broken File Links\n\n")
            f.write("Common patterns found in broken links:\n\n")

            # Detect common patterns
            old_structure_links = [l for l in broken_links if any(x in l['link'] for x in ['01-foundations/', '02-essential-skills/', '03-intermediate/', '04-advanced/', 'essentials/', 'advanced/', 'learning/', 'explanation/', 'reality/'])]

            if old_structure_links:
                f.write("1. **Old structure references** - Links still pointing to deprecated directories:\n")
                f.write("   - `01-foundations/`, `02-essential-skills/`, `03-intermediate/`, `04-advanced/`\n")
                f.write("   - `essentials/`, `advanced/`, `learning/`, `explanation/`, `reality/`\n")
                f.write("   \n   These should be updated to the new structure:\n")
                f.write("   - `setup/`, `operate/`, `build/`, `coordinate/`, `reference/`\n\n")

            relative_path_issues = [l for l in broken_links if '../' in l['link']]
            if relative_path_issues:
                f.write("2. **Relative path issues** - Links using `../` that may need adjustment\n\n")

        if broken_anchors:
            f.write("### Fix Broken Anchors\n\n")
            f.write("Verify these sections exist in target files or update the anchor references.\n\n")

        f.write("## Next Steps\n\n")
        f.write("1. Review each broken link individually\n")
        f.write("2. Update links to point to correct new structure\n")
        f.write("3. Verify anchor names match actual headers\n")
        f.write("4. Re-run validation to confirm fixes\n")

    print(f"\n✅ Validation complete!")
    print(f"📄 Report saved to: {report_path}")
    print(f"\nResults:")
    print(f"  - Total links: {total_links}")
    print(f"  - Broken files: {len(broken_links)}")
    print(f"  - Broken anchors: {len(broken_anchors)}")
    print(f"  - Success rate: {success_rate}%")

if __name__ == "__main__":
    main()
