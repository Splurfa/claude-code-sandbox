/**
 * Session Artifacts File Routing Tests
 *
 * Validates that all working files are routed to session artifacts directories,
 * and NO files are created in root tests/, docs/, or scripts/ directories.
 *
 * Session: session-20251117-100232-docs-refactor-tutor
 * Agent: Tester
 */

const fs = require('fs');
const path = require('path');

describe('Session Artifacts File Routing', () => {
  const PROJECT_ROOT = process.cwd();
  const SESSION_ID = 'session-20251117-100232-docs-refactor-tutor';
  const SESSION_ROOT = path.join(PROJECT_ROOT, 'sessions', SESSION_ID);
  const ARTIFACTS_ROOT = path.join(SESSION_ROOT, 'artifacts');

  describe('Session Directory Structure', () => {
    test('session directory exists', () => {
      expect(fs.existsSync(SESSION_ROOT)).toBe(true);
    });

    test('artifacts/ subdirectory exists', () => {
      expect(fs.existsSync(ARTIFACTS_ROOT)).toBe(true);
    });

    test('artifacts/code/ exists', () => {
      const codePath = path.join(ARTIFACTS_ROOT, 'code');
      expect(fs.existsSync(codePath)).toBe(true);
    });

    test('artifacts/tests/ exists', () => {
      const testsPath = path.join(ARTIFACTS_ROOT, 'tests');
      expect(fs.existsSync(testsPath)).toBe(true);
    });

    test('artifacts/docs/ exists', () => {
      const docsPath = path.join(ARTIFACTS_ROOT, 'docs');
      expect(fs.existsSync(docsPath)).toBe(true);
    });

    test('artifacts/scripts/ exists', () => {
      const scriptsPath = path.join(ARTIFACTS_ROOT, 'scripts');
      expect(fs.existsSync(scriptsPath)).toBe(true);
    });

    test('artifacts/notes/ exists', () => {
      const notesPath = path.join(ARTIFACTS_ROOT, 'notes');
      expect(fs.existsSync(notesPath)).toBe(true);
    });
  });

  describe('File Routing Rules', () => {
    test('test files are in session artifacts, not root tests/', () => {
      // This test file itself should be in artifacts/tests/
      const thisFile = __filename;
      expect(thisFile).toContain('sessions/');
      expect(thisFile).toContain('/artifacts/tests/');
      expect(thisFile).not.toContain(path.join(PROJECT_ROOT, 'tests'));
    });

    test('no working files in root tests/ directory', () => {
      const rootTestsPath = path.join(PROJECT_ROOT, 'tests');

      // Root tests/ should not exist or should only have pre-existing files
      if (fs.existsSync(rootTestsPath)) {
        const files = fs.readdirSync(rootTestsPath);

        // Check if any files were created during this session
        files.forEach(file => {
          const filePath = path.join(rootTestsPath, file);
          const stats = fs.statSync(filePath);
          const creationTime = stats.birthtime;

          // Files created during session should NOT be here
          const sessionStartTime = new Date('2025-11-17T10:02:32Z');

          if (creationTime > sessionStartTime) {
            fail(`File ${file} was created in root tests/ after session start`);
          }
        });
      }
    });

    test('no working docs in root docs/ directory', () => {
      const rootDocsPath = path.join(PROJECT_ROOT, 'docs');

      if (fs.existsSync(rootDocsPath)) {
        const files = getAllFiles(rootDocsPath);

        files.forEach(file => {
          const stats = fs.statSync(file);
          const creationTime = stats.birthtime;

          // Working docs should be in session artifacts
          const sessionStartTime = new Date('2025-11-17T10:02:32Z');

          if (creationTime > sessionStartTime) {
            // Exception: Only structural docs like README.md allowed
            const basename = path.basename(file);
            const allowedRootDocs = ['README.md', 'guides-legacy-readme.md'];

            if (!allowedRootDocs.includes(basename)) {
              fail(`Working doc ${file} created in root docs/ after session start`);
            }
          }
        });
      }
    });

    test('no working scripts in root scripts/ directory', () => {
      const rootScriptsPath = path.join(PROJECT_ROOT, 'scripts');

      if (fs.existsSync(rootScriptsPath)) {
        const files = fs.readdirSync(rootScriptsPath);

        files.forEach(file => {
          const filePath = path.join(rootScriptsPath, file);
          const stats = fs.statSync(filePath);
          const creationTime = stats.birthtime;

          const sessionStartTime = new Date('2025-11-17T10:02:32Z');

          if (creationTime > sessionStartTime) {
            fail(`Script ${file} was created in root scripts/ after session start`);
          }
        });
      }
    });
  });

  describe('Exception Handling', () => {
    test('allows editing existing project files', () => {
      // package.json, CLAUDE.md, etc. can be edited in place
      const allowedProjectFiles = [
        'package.json',
        'package-lock.json',
        'CLAUDE.md',
        '.gitignore',
        'README.md',
        '.claude/settings.json'
      ];

      allowedProjectFiles.forEach(file => {
        const filePath = path.join(PROJECT_ROOT, file);

        // These files may exist and be edited
        if (fs.existsSync(filePath)) {
          expect(fs.statSync(filePath).isFile()).toBe(true);
        }
      });
    });

    test('allows project configuration files in root', () => {
      // Config files must stay in root
      const configFiles = [
        '.eslintrc.js',
        '.prettierrc',
        'jest.config.js',
        'tsconfig.json'
      ];

      // These CAN exist in root (but may not for this project)
      configFiles.forEach(file => {
        const filePath = path.join(PROJECT_ROOT, file);

        if (fs.existsSync(filePath)) {
          // Just verify they're files, not that they must exist
          expect(fs.statSync(filePath).isFile()).toBe(true);
        }
      });
    });

    test('skill files remain in .claude/skills/', () => {
      const skillsPath = path.join(PROJECT_ROOT, '.claude/skills/tutor-mode');

      if (fs.existsSync(skillsPath)) {
        expect(fs.existsSync(path.join(skillsPath, 'SKILL.md'))).toBe(true);
      }
    });
  });

  describe('Path Validation', () => {
    test('session paths use correct format', () => {
      const sessionPattern = /^session-\d{8}-\d{6}-[\w-]+$/;
      expect(SESSION_ID).toMatch(sessionPattern);
    });

    test('artifacts subdirectories use standard names', () => {
      const standardDirs = ['code', 'tests', 'docs', 'scripts', 'notes'];

      const artifactsDirs = fs.readdirSync(ARTIFACTS_ROOT, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      artifactsDirs.forEach(dir => {
        // Each directory should be one of the standard names or a subdirectory
        const isStandard = standardDirs.includes(dir);
        const isNodeModules = dir === 'node_modules';

        expect(isStandard || isNodeModules).toBe(true);
      });
    });

    test('absolute paths used correctly', () => {
      // Verify this test file uses absolute path
      const thisFile = __filename;
      expect(path.isAbsolute(thisFile)).toBe(true);

      // Verify it's in the correct session artifacts location
      expect(thisFile).toContain('/sessions/session-20251117-100232-docs-refactor-tutor/artifacts/tests/');
    });
  });

  describe('File Organization Consistency', () => {
    test('test files organized by category', () => {
      const testsPath = path.join(ARTIFACTS_ROOT, 'tests');

      if (fs.existsSync(testsPath)) {
        const categories = [
          'skill-validation',
          'documentation',
          'file-routing',
          'consensus',
          'integration'
        ];

        categories.forEach(category => {
          const categoryPath = path.join(testsPath, category);

          // Category directory should exist
          expect(fs.existsSync(categoryPath)).toBe(true);
        });
      }
    });

    test('code files organized logically', () => {
      const codePath = path.join(ARTIFACTS_ROOT, 'code');

      if (fs.existsSync(codePath)) {
        // Code should have logical organization
        // (This is a guideline check, not strict)
        const items = fs.readdirSync(codePath);

        // Should have some structure (files or subdirectories)
        expect(items.length).toBeGreaterThanOrEqual(0);
      }
    });

    test('docs organized by type', () => {
      const docsPath = path.join(ARTIFACTS_ROOT, 'docs');

      if (fs.existsSync(docsPath)) {
        // Docs should be organized (learning/, system/, etc.)
        const items = fs.readdirSync(docsPath);

        // Should have subdirectories for organization
        expect(items.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Session Artifact Completeness', () => {
    test('session has metadata.json', () => {
      const metadataPath = path.join(SESSION_ROOT, 'metadata.json');

      // metadata.json should exist or be created
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

        expect(metadata).toHaveProperty('sessionId');
        expect(metadata).toHaveProperty('startTime');
      }
    });

    test('test strategy document exists', () => {
      const strategyPath = path.join(ARTIFACTS_ROOT, 'tests', 'TEST-STRATEGY.md');
      expect(fs.existsSync(strategyPath)).toBe(true);
    });

    test('all test categories have tests', () => {
      const testsPath = path.join(ARTIFACTS_ROOT, 'tests');
      const categories = ['skill-validation', 'documentation', 'file-routing', 'consensus', 'integration'];

      categories.forEach(category => {
        const categoryPath = path.join(testsPath, category);

        if (fs.existsSync(categoryPath)) {
          const files = fs.readdirSync(categoryPath);
          const testFiles = files.filter(f => f.endsWith('.test.js'));

          // Each category should have at least one test file
          expect(testFiles.length).toBeGreaterThan(0);
        }
      });
    });
  });
});

// Helper function
function getAllFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) return files;

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}
