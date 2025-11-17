/**
 * File Router Validation
 * Prevents CLAUDE.md violations (root-level test/docs/scripts folders)
 * Enforces: All files go to sessions/<session-id>/artifacts/
 */

/**
 * Validate file path against CLAUDE.md rules
 * @param {string} filePath - The file path to validate
 * @param {string} sessionId - Current session ID (required for session paths)
 * @returns {{valid: boolean, error?: string, suggestion?: string}}
 */
function validateFilePath(filePath, sessionId) {
  // Normalize path (remove leading ./)
  const normalizedPath = filePath.replace(/^\.\//, '');

  // Check for permanent docs FIRST (before violations)
  const isPermanentDocs = normalizedPath.match(/^docs\/(projects|protocols|guides|reference)\//i);
  if (isPermanentDocs) {
    return { valid: true }; // Allow permanent project documentation
  }

  // Root-level violations to block (after permanent docs check)
  const violations = [
    { pattern: /^test-/, type: 'test directory prefix', example: 'test-workflow-*/' },
    { pattern: /^tests?\//i, type: 'tests directory', example: 'tests/' },
    { pattern: /^docs?\//i, type: 'docs directory', example: 'docs/' },
    { pattern: /^scripts?\//i, type: 'scripts directory', example: 'scripts/' }
  ];

  // Check for violations
  for (const violation of violations) {
    if (violation.pattern.test(normalizedPath)) {
      // Determine correct destination based on file type
      let suggestedPath;
      if (normalizedPath.includes('.test.') || normalizedPath.includes('test')) {
        suggestedPath = `sessions/${sessionId}/artifacts/tests/`;
      } else if (normalizedPath.match(/\.(md|txt|pdf)$/i)) {
        suggestedPath = `sessions/${sessionId}/artifacts/docs/`;
      } else if (normalizedPath.match(/\.(sh|bash|zsh)$/i)) {
        suggestedPath = `sessions/${sessionId}/artifacts/scripts/`;
      } else if (normalizedPath.match(/\.(js|ts|py|java|go|rs|c|cpp)$/i)) {
        suggestedPath = `sessions/${sessionId}/artifacts/code/`;
      } else {
        suggestedPath = `sessions/${sessionId}/artifacts/notes/`;
      }

      return {
        valid: false,
        error: `CLAUDE.md violation: Cannot write to root-level ${violation.type} (${violation.example})`,
        suggestion: `Use: ${suggestedPath}${normalizedPath.split('/').pop()}`
      };
    }
  }

  // Verify session path format (if not an existing project file)
  const isProjectFile = normalizedPath.match(/^(package\.json|CLAUDE\.md|\.gitignore|tsconfig\.json|README\.md)$/i);
  const isSessionPath = normalizedPath.startsWith('sessions/');

  if (!isProjectFile && !isSessionPath) {
    return {
      valid: false,
      error: 'CLAUDE.md violation: All new files must go to session artifacts',
      suggestion: `Use: sessions/${sessionId}/artifacts/{code,tests,docs,scripts,notes}/`
    };
  }

  return { valid: true };
}

/**
 * Get the correct session path for a file based on its type
 * @param {string} fileName - The file name
 * @param {string} sessionId - Current session ID
 * @returns {string} Suggested full path
 */
function getSessionPath(fileName, sessionId) {
  const basePath = `sessions/${sessionId}/artifacts`;

  if (fileName.includes('.test.') || fileName.includes('spec.')) {
    return `${basePath}/tests/${fileName}`;
  } else if (fileName.match(/\.(md|txt|pdf|doc)$/i)) {
    return `${basePath}/docs/${fileName}`;
  } else if (fileName.match(/\.(sh|bash|zsh|bat|ps1)$/i)) {
    return `${basePath}/scripts/${fileName}`;
  } else if (fileName.match(/\.(js|ts|tsx|jsx|py|java|go|rs|c|cpp|h|hpp)$/i)) {
    return `${basePath}/code/${fileName}`;
  } else {
    return `${basePath}/notes/${fileName}`;
  }
}

/**
 * Check if current directory has root violations
 * @returns {Promise<Array<{path: string, size: string, files: number}>>}
 */
async function detectRootViolations() {
  const fs = require('fs').promises;
  const path = require('path');
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);

  const violations = [];
  const checkPaths = [
    { pattern: 'test-*', type: 'test prefix directories' },
    { pattern: 'tests', type: 'tests directory' },
    { pattern: 'docs', type: 'docs directory' },
    { pattern: 'scripts', type: 'scripts directory' }
  ];

  for (const check of checkPaths) {
    try {
      const { stdout } = await execAsync(`ls -d ${check.pattern} 2>/dev/null || echo ""`);
      const dirs = stdout.trim().split('\n').filter(d => d);

      for (const dir of dirs) {
        try {
          const stats = await fs.stat(dir);
          if (stats.isDirectory()) {
            // Skip permanent docs directory (allowed by CLAUDE.md)
            if (dir === 'docs') {
              const { stdout: hasPermanent } = await execAsync(`ls -d docs/{protocols,guides,reference,projects} 2>/dev/null || echo ""`);
              if (hasPermanent.trim()) {
                continue; // Skip - this is permanent project documentation
              }
            }

            const { stdout: size } = await execAsync(`du -sh "${dir}" | cut -f1`);
            const { stdout: fileCount } = await execAsync(`find "${dir}" -type f | wc -l`);

            violations.push({
              path: dir,
              size: size.trim(),
              files: parseInt(fileCount.trim()),
              type: check.type
            });
          }
        } catch (err) {
          // Directory doesn't exist or can't be accessed
        }
      }
    } catch (err) {
      // Pattern not found
    }
  }

  return violations;
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateFilePath,
    getSessionPath,
    detectRootViolations
  };
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === 'validate') {
    const filePath = args[1];
    const sessionId = args[2] || process.env.SESSION_ID || 'session-default';

    const result = validateFilePath(filePath, sessionId);
    if (result.valid) {
      console.log('✓ Valid path:', filePath);
      process.exit(0);
    } else {
      console.error('✗ Invalid path:', result.error);
      if (result.suggestion) {
        console.error('  Suggestion:', result.suggestion);
      }
      process.exit(1);
    }
  } else if (args[0] === 'detect') {
    detectRootViolations().then(violations => {
      if (violations.length === 0) {
        console.log('✓ No root-level violations detected');
      } else {
        console.log('✗ Root-level violations found:');
        violations.forEach(v => {
          console.log(`  - ${v.path} (${v.size}, ${v.files} files, ${v.type})`);
        });
        process.exit(1);
      }
    });
  } else {
    console.log('Usage:');
    console.log('  node file-router-validation.js validate <path> [session-id]');
    console.log('  node file-router-validation.js detect');
  }
}

// Example usage:
// const { validateFilePath, getSessionPath } = require('./file-router-validation');
//
// const sessionId = 'session-20251114-120738-system-validation';
//
// // Validate a path
// const result = validateFilePath('test-workflow/file.js', sessionId);
// if (!result.valid) {
//   console.error(result.error);
//   console.log('Suggestion:', result.suggestion);
// }
//
// // Get correct path for a file
// const correctPath = getSessionPath('app.test.js', sessionId);
// console.log('Use this path:', correctPath);
