#!/usr/bin/env node
/**
 * Workspace Documentation Structure Validation Tests
 *
 * Purpose: Validate that documentation optimization meets all criteria
 * Session: session-20251117-233107-workspace-docs-optimization
 * Namespace: workspace-optimization-20251117
 *
 * Test Categories:
 * 1. Structure Validation - Folder organization, README placement
 * 2. Content Validation - Coverage, link validity, quality
 * 3. Learning Path Validation - Tutorial progression, tutor-mode integration
 * 4. Integration Validation - Tools, memory, sessions
 */

const fs = require('fs');
const path = require('path');
const { test, describe } = require('node:test');
const assert = require('node:assert');

// Test configuration
const DOCS_ROOT = path.join(__dirname, '../../../../docs');
const PROJECT_ROOT = path.join(__dirname, '../../../..');

// Expected Diátaxis structure
const EXPECTED_STRUCTURE = {
  'tutorials': {
    required: true,
    description: 'Learning-oriented documentation',
    subdirs: ['01-foundations', '02-essential-skills', '03-intermediate', '04-advanced']
  },
  'how-to': {
    required: true,
    description: 'Problem-solving guides',
    subdirs: []
  },
  'explanation': {
    required: true,
    description: 'Understanding-oriented documentation',
    subdirs: []
  },
  'reference': {
    required: true,
    description: 'Information-oriented documentation',
    subdirs: []
  },
  'internals': {
    required: true,
    description: 'Technical deep-dives',
    subdirs: ['system']
  }
};

// Critical files that must exist
const CRITICAL_FILES = [
  'README.md',
  'explanation/workspace-architecture.md',
  'explanation/session-management.md',
  'explanation/file-routing.md',
  'internals/system/architecture-overview.md',
  'internals/system/coordination-mechanics.md',
  'tutorials/README.md'
];

// Files that should NOT exist (deprecated/moved)
const DEPRECATED_FILES = [
  'guides/README.md', // Moved content
  'guides/concepts',  // Reorganized
  'guides/advanced/README.md', // Old structure
];

/**
 * CATEGORY 1: STRUCTURE VALIDATION
 */
describe('Structure Validation', () => {

  test('Docs root directory exists', () => {
    assert.ok(fs.existsSync(DOCS_ROOT), `Docs root not found at ${DOCS_ROOT}`);
  });

  test('Main README.md exists and uses Diátaxis', async () => {
    const readmePath = path.join(DOCS_ROOT, 'README.md');
    assert.ok(fs.existsSync(readmePath), 'Main README.md missing');

    const content = fs.readFileSync(readmePath, 'utf8');
    assert.ok(content.includes('Diátaxis'), 'README does not mention Diátaxis framework');
    assert.ok(content.includes('Tutorials'), 'README missing Tutorials section');
    assert.ok(content.includes('How-to'), 'README missing How-to section');
    assert.ok(content.includes('Explanation'), 'README missing Explanation section');
    assert.ok(content.includes('Reference'), 'README missing Reference section');
  });

  test('All required Diátaxis directories exist', () => {
    for (const [dirName, config] of Object.entries(EXPECTED_STRUCTURE)) {
      if (config.required) {
        const dirPath = path.join(DOCS_ROOT, dirName);
        assert.ok(
          fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory(),
          `Required directory '${dirName}' not found`
        );
      }
    }
  });

  test('Each category has a README.md', () => {
    for (const [dirName, config] of Object.entries(EXPECTED_STRUCTURE)) {
      if (config.required) {
        const readmePath = path.join(DOCS_ROOT, dirName, 'README.md');
        assert.ok(
          fs.existsSync(readmePath),
          `README.md missing in ${dirName}/`
        );
      }
    }
  });

  test('Tutorial structure has proper progression', () => {
    const tutorialsDir = path.join(DOCS_ROOT, 'tutorials');
    const expectedLevels = EXPECTED_STRUCTURE.tutorials.subdirs;

    for (const level of expectedLevels) {
      const levelPath = path.join(tutorialsDir, level);
      assert.ok(
        fs.existsSync(levelPath) && fs.statSync(levelPath).isDirectory(),
        `Tutorial level directory '${level}' not found`
      );

      const levelReadme = path.join(levelPath, 'README.md');
      assert.ok(
        fs.existsSync(levelReadme),
        `README.md missing in tutorials/${level}/`
      );
    }
  });

  test('Critical documentation files exist', () => {
    for (const file of CRITICAL_FILES) {
      const filePath = path.join(DOCS_ROOT, file);
      assert.ok(
        fs.existsSync(filePath),
        `Critical file '${file}' is missing`
      );
    }
  });

  test('Deprecated files are removed or relocated', () => {
    const foundDeprecated = [];
    for (const file of DEPRECATED_FILES) {
      const filePath = path.join(DOCS_ROOT, file);
      if (fs.existsSync(filePath)) {
        foundDeprecated.push(file);
      }
    }

    assert.strictEqual(
      foundDeprecated.length,
      0,
      `Deprecated files still exist: ${foundDeprecated.join(', ')}`
    );
  });

  test('Internals subdirectory structure is correct', () => {
    const internalsDir = path.join(DOCS_ROOT, 'internals');
    assert.ok(fs.existsSync(internalsDir), 'Internals directory missing');

    const systemDir = path.join(internalsDir, 'system');
    assert.ok(
      fs.existsSync(systemDir) && fs.statSync(systemDir).isDirectory(),
      'internals/system/ subdirectory missing'
    );
  });

  test('No orphaned .md files in root', () => {
    const files = fs.readdirSync(DOCS_ROOT);
    const orphanedMd = files.filter(f =>
      f.endsWith('.md') &&
      f !== 'README.md' &&
      f !== 'guides-legacy-readme.md' // Allow legacy backup
    );

    assert.strictEqual(
      orphanedMd.length,
      0,
      `Orphaned .md files in docs root: ${orphanedMd.join(', ')}`
    );
  });
});

/**
 * CATEGORY 2: CONTENT VALIDATION
 */
describe('Content Validation', () => {

  test('All markdown files have proper frontmatter or title', () => {
    const mdFiles = findMarkdownFiles(DOCS_ROOT);
    const missingTitles = [];

    for (const file of mdFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const hasTitle = content.match(/^#\s+.+/m) || content.startsWith('---');

      if (!hasTitle) {
        missingTitles.push(path.relative(DOCS_ROOT, file));
      }
    }

    assert.strictEqual(
      missingTitles.length,
      0,
      `Files missing titles: ${missingTitles.join(', ')}`
    );
  });

  test('Internal links are valid', () => {
    const mdFiles = findMarkdownFiles(DOCS_ROOT);
    const brokenLinks = [];

    for (const file of mdFiles) {
      const content = fs.readFileSync(file, 'utf8');
      const relativeDir = path.dirname(file);

      // Find markdown links: [text](path.md)
      const linkPattern = /\[([^\]]+)\]\(([^)]+\.md[^)]*)\)/g;
      let match;

      while ((match = linkPattern.exec(content)) !== null) {
        const linkPath = match[2];

        // Skip external links
        if (linkPath.startsWith('http')) continue;

        // Remove anchors
        const pathWithoutAnchor = linkPath.split('#')[0];

        // Resolve relative path
        const fullPath = path.resolve(relativeDir, pathWithoutAnchor);

        if (!fs.existsSync(fullPath)) {
          brokenLinks.push({
            file: path.relative(DOCS_ROOT, file),
            link: linkPath,
            text: match[1]
          });
        }
      }
    }

    assert.strictEqual(
      brokenLinks.length,
      0,
      `Broken links found:\n${brokenLinks.map(l =>
        `  ${l.file}: [${l.text}](${l.link})`
      ).join('\n')}`
    );
  });

  test('Navigation structure is consistent', () => {
    const mainReadme = fs.readFileSync(path.join(DOCS_ROOT, 'README.md'), 'utf8');

    // Check that main README links to all category READMEs
    for (const [dirName] of Object.entries(EXPECTED_STRUCTURE)) {
      const linkPattern = new RegExp(`\\[.*?\\]\\(${dirName}/`, 'i');
      assert.ok(
        linkPattern.test(mainReadme),
        `Main README does not link to ${dirName}/`
      );
    }
  });

  test('Category READMEs document their purpose', () => {
    for (const [dirName, config] of Object.entries(EXPECTED_STRUCTURE)) {
      const readmePath = path.join(DOCS_ROOT, dirName, 'README.md');
      if (!fs.existsSync(readmePath)) continue;

      const content = fs.readFileSync(readmePath, 'utf8');

      // Should contain description or purpose
      const hasPurpose = content.toLowerCase().includes('purpose') ||
                        content.toLowerCase().includes('about') ||
                        content.match(/^#\s+/m);

      assert.ok(
        hasPurpose,
        `${dirName}/README.md does not clearly state its purpose`
      );
    }
  });

  test('Code blocks have language specifiers', () => {
    const mdFiles = findMarkdownFiles(DOCS_ROOT);
    const missingLang = [];

    for (const file of mdFiles) {
      const content = fs.readFileSync(file, 'utf8');

      // Find code blocks without language
      const codeBlockPattern = /^```\s*$/gm;
      const matches = [...content.matchAll(codeBlockPattern)];

      if (matches.length > 0) {
        missingLang.push({
          file: path.relative(DOCS_ROOT, file),
          count: matches.length
        });
      }
    }

    // Allow some files to have plain blocks (for diagrams, etc)
    const threshold = 2;
    const critical = missingLang.filter(f => f.count > threshold);

    assert.strictEqual(
      critical.length,
      0,
      `Files with excessive unlabeled code blocks:\n${critical.map(f =>
        `  ${f.file}: ${f.count} blocks`
      ).join('\n')}`
    );
  });

  test('File paths use absolute references consistently', () => {
    const claudeMd = path.join(PROJECT_ROOT, 'CLAUDE.md');
    if (!fs.existsSync(claudeMd)) return;

    const content = fs.readFileSync(claudeMd, 'utf8');

    // Check that docs links use relative paths from root
    const docLinkPattern = /\[.*?\]\((docs\/[^)]+)\)/g;
    const links = [...content.matchAll(docLinkPattern)];

    // All should be valid
    for (const match of links) {
      const linkPath = match[1];
      const fullPath = path.join(PROJECT_ROOT, linkPath);

      // Only test .md files (some paths may be directories)
      if (linkPath.endsWith('.md')) {
        assert.ok(
          fs.existsSync(fullPath),
          `CLAUDE.md references non-existent file: ${linkPath}`
        );
      }
    }
  });
});

/**
 * CATEGORY 3: LEARNING PATH VALIDATION
 */
describe('Learning Path Validation', () => {

  test('Tutorial progression is documented', () => {
    const tutorialsReadme = path.join(DOCS_ROOT, 'tutorials/README.md');
    assert.ok(fs.existsSync(tutorialsReadme), 'tutorials/README.md missing');

    const content = fs.readFileSync(tutorialsReadme, 'utf8');

    // Should document progression
    assert.ok(
      content.toLowerCase().includes('foundation') ||
      content.includes('01-') ||
      content.toLowerCase().includes('beginner'),
      'Tutorial README does not document progression path'
    );
  });

  test('Each tutorial level has clear objectives', () => {
    const levels = EXPECTED_STRUCTURE.tutorials.subdirs;

    for (const level of levels) {
      const readmePath = path.join(DOCS_ROOT, 'tutorials', level, 'README.md');
      if (!fs.existsSync(readmePath)) continue;

      const content = fs.readFileSync(readmePath, 'utf8');

      // Should have objectives or learning outcomes
      const hasObjectives =
        content.toLowerCase().includes('objective') ||
        content.toLowerCase().includes('learn') ||
        content.toLowerCase().includes('skill') ||
        content.toLowerCase().includes('by the end');

      assert.ok(
        hasObjectives,
        `tutorials/${level}/README.md missing clear learning objectives`
      );
    }
  });

  test('Tutor-mode skill exists and references tutorials', () => {
    const tutorSkillPath = path.join(PROJECT_ROOT, '.claude/skills/tutor-mode/SKILL.md');

    if (fs.existsSync(tutorSkillPath)) {
      const content = fs.readFileSync(tutorSkillPath, 'utf8');

      // Should reference tutorials
      assert.ok(
        content.includes('tutorial') || content.includes('Tutorial'),
        'tutor-mode skill does not reference tutorials'
      );
    } else {
      // If skill doesn't exist yet, that's okay - document it
      console.log('  ℹ️  tutor-mode skill not found - may be in development');
    }
  });

  test('New user entry point is clear', () => {
    const mainReadme = fs.readFileSync(path.join(DOCS_ROOT, 'README.md'), 'utf8');

    // Should have explicit "new user" or "getting started" section
    assert.ok(
      mainReadme.includes('New Here') ||
      mainReadme.includes('New User') ||
      mainReadme.includes('Getting Started'),
      'Main README missing clear new user entry point'
    );
  });

  test('Cross-references between categories exist', () => {
    const explanationReadme = path.join(DOCS_ROOT, 'explanation/README.md');
    const howToReadme = path.join(DOCS_ROOT, 'how-to/README.md');

    if (fs.existsSync(explanationReadme)) {
      const content = fs.readFileSync(explanationReadme, 'utf8');

      // Explanations should reference tutorials or how-tos
      assert.ok(
        content.includes('tutorial') ||
        content.includes('how-to') ||
        content.includes('practical'),
        'Explanations should cross-reference practical content'
      );
    }

    if (fs.existsSync(howToReadme)) {
      const content = fs.readFileSync(howToReadme, 'utf8');

      // How-tos may reference explanations
      // Not enforcing this strictly as how-tos can stand alone
    }
  });
});

/**
 * CATEGORY 4: INTEGRATION VALIDATION
 */
describe('Integration Validation', () => {

  test('CLAUDE.md references docs correctly', () => {
    const claudeMd = path.join(PROJECT_ROOT, 'CLAUDE.md');
    assert.ok(fs.existsSync(claudeMd), 'CLAUDE.md not found');

    const content = fs.readFileSync(claudeMd, 'utf8');

    // Should reference main docs categories
    assert.ok(
      content.includes('docs/explanation/workspace-architecture'),
      'CLAUDE.md should reference workspace-architecture'
    );

    assert.ok(
      content.includes('docs/explanation/session-management'),
      'CLAUDE.md should reference session-management'
    );
  });

  test('Skills reference updated documentation', () => {
    const skillsDir = path.join(PROJECT_ROOT, '.claude/skills');
    if (!fs.existsSync(skillsDir)) return;

    const skills = fs.readdirSync(skillsDir);
    let foundDocReferences = false;

    for (const skill of skills) {
      const skillPath = path.join(skillsDir, skill, 'SKILL.md');
      if (!fs.existsSync(skillPath)) continue;

      const content = fs.readFileSync(skillPath, 'utf8');

      if (content.includes('docs/explanation') ||
          content.includes('docs/tutorials') ||
          content.includes('docs/how-to')) {
        foundDocReferences = true;

        // Validate those references are correct
        const docLinkPattern = /(docs\/[a-z-]+\/[a-z-]+\.md)/g;
        const matches = [...content.matchAll(docLinkPattern)];

        for (const match of matches) {
          const docPath = path.join(PROJECT_ROOT, match[1]);
          assert.ok(
            fs.existsSync(docPath),
            `Skill ${skill} references non-existent doc: ${match[1]}`
          );
        }
      }
    }

    // At least one skill should reference docs
    assert.ok(
      foundDocReferences,
      'No skills reference the new documentation structure'
    );
  });

  test('Session protocol documentation exists', () => {
    const sessionDoc = path.join(DOCS_ROOT, 'explanation/session-management.md');
    assert.ok(fs.existsSync(sessionDoc), 'Session management documentation missing');

    const content = fs.readFileSync(sessionDoc, 'utf8');

    // Should document session lifecycle
    assert.ok(
      content.includes('session-start') || content.includes('lifecycle'),
      'Session documentation should explain lifecycle'
    );
  });

  test('Memory coordination documentation exists', () => {
    const coordDoc = path.join(DOCS_ROOT, 'internals/system/coordination-mechanics.md');
    assert.ok(fs.existsSync(coordDoc), 'Coordination mechanics documentation missing');

    const content = fs.readFileSync(coordDoc, 'utf8');

    // Should document memory usage
    assert.ok(
      content.includes('memory') || content.includes('coordination'),
      'Coordination documentation should explain memory usage'
    );
  });

  test('Hooks documentation is accessible', () => {
    const hooksDoc = path.join(DOCS_ROOT, 'internals/system/hooks-and-automation.md');

    if (fs.existsSync(hooksDoc)) {
      const content = fs.readFileSync(hooksDoc, 'utf8');

      // Should document hook types
      assert.ok(
        content.includes('pre-task') || content.includes('post-task'),
        'Hooks documentation should list hook types'
      );
    } else {
      console.log('  ℹ️  hooks-and-automation.md not found - may be optional');
    }
  });

  test('Stock vs custom breakdown is documented', () => {
    const stockDoc = path.join(DOCS_ROOT, 'internals/system/stock-vs-custom.md');

    if (fs.existsSync(stockDoc)) {
      const content = fs.readFileSync(stockDoc, 'utf8');

      // Should quantify stock percentage
      assert.ok(
        content.includes('%') || content.includes('stock') || content.includes('custom'),
        'Stock vs custom documentation should quantify differences'
      );
    }
  });
});

/**
 * HELPER FUNCTIONS
 */

function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip hidden directories and archives
      if (!file.startsWith('.') && file !== 'node_modules') {
        findMarkdownFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  }

  return fileList;
}

/**
 * TEST SUMMARY AND REPORTING
 */

// Export for use by other test runners
module.exports = {
  DOCS_ROOT,
  PROJECT_ROOT,
  EXPECTED_STRUCTURE,
  CRITICAL_FILES,
  findMarkdownFiles
};

// Run if executed directly
if (require.main === module) {
  console.log('🧪 Running Workspace Documentation Validation Tests\n');
  console.log('📁 Docs Root:', DOCS_ROOT);
  console.log('📦 Project Root:', PROJECT_ROOT);
  console.log('');
}
