#!/usr/bin/env node
/**
 * File Router Hook
 * Validates and routes files to correct session artifacts
 */

const path = require('path');

// Configuration
const CONFIG = {
  sessionsDir: process.env.SESSIONS_DIR || 'sessions',
  strictMode: process.env.STRICT_MODE !== 'false'
};

// Allowed root files (can be edited in place)
const ALLOWED_ROOT_FILES = [
  'package.json',
  'package-lock.json',
  'CLAUDE.md',
  '.gitignore',
  'README.md',
  'tsconfig.json',
  'jest.config.js',
  '.eslintrc.js'
];

/**
 * File Router Class
 */
class FileRouter {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.artifactsDir = path.join(CONFIG.sessionsDir, sessionId, 'artifacts');
  }

  /**
   * Categorize file by extension/name
   */
  categorize(filepath) {
    const basename = path.basename(filepath);
    const ext = path.extname(filepath);

    // Test files
    if (basename.includes('.test.') || basename.includes('.spec.')) {
      return 'tests';
    }

    // Scripts
    if (ext === '.sh' || basename.endsWith('.bash')) {
      return 'scripts';
    }

    // Documentation
    if (ext === '.md' || ext === '.txt') {
      return 'docs';
    }

    // Source code
    if (['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.java', '.c', '.cpp'].includes(ext)) {
      return 'code';
    }

    // Default to notes
    return 'notes';
  }

  /**
   * Check if file can be modified in root
   */
  isAllowedRootFile(filepath) {
    const basename = path.basename(filepath);
    return ALLOWED_ROOT_FILES.includes(basename);
  }

  /**
   * Route file to appropriate location
   */
  route(filepath) {
    // Already in sessions directory
    if (filepath.startsWith(CONFIG.sessionsDir)) {
      return filepath;
    }

    // Allowed root file
    if (this.isAllowedRootFile(filepath)) {
      return filepath;
    }

    // Route to artifacts
    const category = this.categorize(filepath);
    const basename = path.basename(filepath);
    return path.join(this.artifactsDir, category, basename);
  }

  /**
   * Validate file operation
   */
  validate(operation, filepath) {
    const result = {
      valid: true,
      route: null,
      warning: null,
      error: null
    };

    // Get routed path
    result.route = this.route(filepath);

    // Check if trying to modify root
    if (!this.isAllowedRootFile(filepath) && !filepath.startsWith(CONFIG.sessionsDir)) {
      result.valid = false;
      result.error = `Cannot ${operation} root file: ${filepath}`;
      result.warning = `Route to: ${result.route}`;

      if (CONFIG.strictMode) {
        throw new Error(`${result.error}\n${result.warning}`);
      }
    }

    return result;
  }

  /**
   * Get artifact type for file
   */
  getArtifactType(filepath) {
    if (filepath.includes('/artifacts/code/')) return 'code';
    if (filepath.includes('/artifacts/tests/')) return 'tests';
    if (filepath.includes('/artifacts/docs/')) return 'docs';
    if (filepath.includes('/artifacts/scripts/')) return 'scripts';
    if (filepath.includes('/artifacts/notes/')) return 'notes';
    return null;
  }
}

/**
 * Validate file operation (CLI interface)
 */
function validateFileOperation(operation, filepath, sessionId) {
  if (!sessionId) {
    console.error('[FILE-ROUTER] Error: Session ID required');
    return false;
  }

  const router = new FileRouter(sessionId);

  try {
    const result = router.validate(operation, filepath);

    if (!result.valid) {
      console.error(`[FILE-ROUTER] ❌ ${result.error}`);
      console.warn(`[FILE-ROUTER] 💡 ${result.warning}`);
      return false;
    }

    if (result.route !== filepath) {
      console.log(`[FILE-ROUTER] 📋 Routed: ${filepath} → ${result.route}`);
    }

    console.log(`[FILE-ROUTER] ✅ Valid: ${operation} ${result.route}`);
    return true;
  } catch (error) {
    console.error(`[FILE-ROUTER] ❌ ${error.message}`);
    return false;
  }
}

// CLI interface
if (require.main === module) {
  const [operation, filepath, sessionId] = process.argv.slice(2);

  if (!operation || !filepath) {
    console.error('Usage: file-router.js <operation> <filepath> [sessionId]');
    process.exit(1);
  }

  const valid = validateFileOperation(operation, filepath, sessionId);
  process.exit(valid ? 0 : 1);
}

module.exports = {
  FileRouter,
  validateFileOperation,
  ALLOWED_ROOT_FILES
};
