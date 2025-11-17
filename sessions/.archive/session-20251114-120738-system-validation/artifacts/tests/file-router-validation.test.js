/**
 * Tests for File Router Validation
 */

const { validateFilePath, getSessionPath } = require('../code/file-router-validation');

const SESSION_ID = 'session-20251114-120738-system-validation';

describe('File Router Validation', () => {
  describe('validateFilePath', () => {
    test('should block test- prefix directories', () => {
      const result = validateFilePath('test-workflow/file.js', SESSION_ID);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('test directory prefix');
      expect(result.suggestion).toContain('sessions/');
    });

    test('should block tests/ directory', () => {
      const result = validateFilePath('tests/app.test.js', SESSION_ID);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('tests directory');
    });

    test('should block docs/ directory', () => {
      const result = validateFilePath('docs/README.md', SESSION_ID);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('docs directory');
    });

    test('should block scripts/ directory', () => {
      const result = validateFilePath('scripts/build.sh', SESSION_ID);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('scripts directory');
    });

    test('should allow session artifact paths', () => {
      const result = validateFilePath('sessions/session-123/artifacts/code/app.js', SESSION_ID);
      expect(result.valid).toBe(true);
    });

    test('should allow existing project files', () => {
      const result = validateFilePath('package.json', SESSION_ID);
      expect(result.valid).toBe(true);
    });

    test('should allow CLAUDE.md', () => {
      const result = validateFilePath('CLAUDE.md', SESSION_ID);
      expect(result.valid).toBe(true);
    });

    test('should provide suggestions with correct artifact subdirectory', () => {
      const testResult = validateFilePath('tests/app.test.js', SESSION_ID);
      expect(testResult.suggestion).toContain('/artifacts/tests/');

      const docResult = validateFilePath('docs/README.md', SESSION_ID);
      expect(docResult.suggestion).toContain('/artifacts/docs/');

      const scriptResult = validateFilePath('scripts/build.sh', SESSION_ID);
      expect(scriptResult.suggestion).toContain('/artifacts/scripts/');

      const codeResult = validateFilePath('test-workflow/app.js', SESSION_ID);
      expect(codeResult.suggestion).toContain('/artifacts/code/');
    });
  });

  describe('getSessionPath', () => {
    test('should route test files to tests/', () => {
      const path = getSessionPath('app.test.js', SESSION_ID);
      expect(path).toContain('/artifacts/tests/app.test.js');
    });

    test('should route markdown files to docs/', () => {
      const path = getSessionPath('README.md', SESSION_ID);
      expect(path).toContain('/artifacts/docs/README.md');
    });

    test('should route shell scripts to scripts/', () => {
      const path = getSessionPath('build.sh', SESSION_ID);
      expect(path).toContain('/artifacts/scripts/build.sh');
    });

    test('should route code files to code/', () => {
      const path = getSessionPath('app.js', SESSION_ID);
      expect(path).toContain('/artifacts/code/app.js');
    });

    test('should route unknown files to notes/', () => {
      const path = getSessionPath('unknown.xyz', SESSION_ID);
      expect(path).toContain('/artifacts/notes/unknown.xyz');
    });
  });
});

// Manual test examples
console.log('=== File Router Validation Tests ===\n');

console.log('Test 1: Block test-workflow/');
console.log(validateFilePath('test-workflow/file.js', SESSION_ID));
console.log('');

console.log('Test 2: Block tests/');
console.log(validateFilePath('tests/app.test.js', SESSION_ID));
console.log('');

console.log('Test 3: Allow session paths');
console.log(validateFilePath('sessions/session-123/artifacts/code/app.js', SESSION_ID));
console.log('');

console.log('Test 4: Get correct paths');
console.log('Test file:', getSessionPath('app.test.js', SESSION_ID));
console.log('Doc file:', getSessionPath('README.md', SESSION_ID));
console.log('Script file:', getSessionPath('build.sh', SESSION_ID));
console.log('Code file:', getSessionPath('app.js', SESSION_ID));
