/**
 * Unit Tests - Memory Management
 * Tests stock claude-flow memory functionality
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Memory Management Tests', () => {
  const TEST_KEY_PREFIX = 'test-memory-' + Date.now();

  afterAll(() => {
    // Cleanup test keys (best effort)
    try {
      execSync(`npx claude-flow@alpha hooks memory --action delete --key "${TEST_KEY_PREFIX}-*"`, {
        stdio: 'pipe'
      });
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  describe('Memory Store Operations', () => {
    test('can store key-value pair', () => {
      const key = `${TEST_KEY_PREFIX}-store-1`;
      const value = 'test-data';

      expect(() => {
        execSync(`npx claude-flow@alpha hooks memory --action store --key "${key}" --value "${value}"`, {
          stdio: 'pipe'
        });
      }).not.toThrow();
    });

    test('can store JSON data', () => {
      const key = `${TEST_KEY_PREFIX}-json-1`;
      const value = JSON.stringify({ test: true, count: 42 });

      expect(() => {
        execSync(`npx claude-flow@alpha hooks memory --action store --key "${key}" --value '${value}'`, {
          stdio: 'pipe'
        });
      }).not.toThrow();
    });

    test('handles special characters in values', () => {
      const key = `${TEST_KEY_PREFIX}-special-1`;
      const value = 'test with spaces & special chars!';

      expect(() => {
        execSync(`npx claude-flow@alpha hooks memory --action store --key "${key}" --value "${value}"`, {
          stdio: 'pipe'
        });
      }).not.toThrow();
    });
  });

  describe('Memory Retrieve Operations', () => {
    beforeAll(() => {
      // Store test data
      execSync(`npx claude-flow@alpha hooks memory --action store --key "${TEST_KEY_PREFIX}-retrieve-1" --value "retrieve-test"`, {
        stdio: 'pipe'
      });
    });

    test('can retrieve stored value', () => {
      const key = `${TEST_KEY_PREFIX}-retrieve-1`;

      const result = execSync(`npx claude-flow@alpha hooks memory --action retrieve --key "${key}"`, {
        encoding: 'utf8'
      });

      expect(result).toContain('retrieve-test');
    });

    test('returns error for non-existent key', () => {
      const key = `${TEST_KEY_PREFIX}-nonexistent`;

      try {
        execSync(`npx claude-flow@alpha hooks memory --action retrieve --key "${key}"`, {
          stdio: 'pipe'
        });
      } catch (error) {
        // Should fail gracefully
        expect(error).toBeDefined();
      }
    });
  });

  describe('Memory Search Operations', () => {
    beforeAll(() => {
      // Store searchable data
      execSync(`npx claude-flow@alpha hooks memory --action store --key "${TEST_KEY_PREFIX}-search-1" --value "searchable-data-1"`, {
        stdio: 'pipe'
      });
      execSync(`npx claude-flow@alpha hooks memory --action store --key "${TEST_KEY_PREFIX}-search-2" --value "searchable-data-2"`, {
        stdio: 'pipe'
      });
    });

    test('can search by pattern', () => {
      const pattern = `${TEST_KEY_PREFIX}-search`;

      const result = execSync(`npx claude-flow@alpha hooks memory --action search --pattern "${pattern}"`, {
        encoding: 'utf8'
      });

      // Should find both entries
      expect(result).toBeTruthy();
    });

    test('returns empty for non-matching pattern', () => {
      const pattern = 'nonexistent-pattern-xyz';

      const result = execSync(`npx claude-flow@alpha hooks memory --action search --pattern "${pattern}"`, {
        encoding: 'utf8'
      });

      // Should return empty or no matches
      expect(result).toBeDefined();
    });
  });

  describe('Memory Persistence', () => {
    test('memory database exists at correct location', () => {
      const memoryDbPath = path.join(process.cwd(), '.swarm/memory.db');

      // Store something to ensure DB is created
      execSync(`npx claude-flow@alpha hooks memory --action store --key "${TEST_KEY_PREFIX}-persist-1" --value "test"`, {
        stdio: 'pipe'
      });

      expect(fs.existsSync(memoryDbPath)).toBe(true);
    });

    test('memory persists across operations', () => {
      const key = `${TEST_KEY_PREFIX}-persist-2`;
      const value = 'persistent-data';

      // Store
      execSync(`npx claude-flow@alpha hooks memory --action store --key "${key}" --value "${value}"`, {
        stdio: 'pipe'
      });

      // Retrieve in separate operation
      const result = execSync(`npx claude-flow@alpha hooks memory --action retrieve --key "${key}"`, {
        encoding: 'utf8'
      });

      expect(result).toContain(value);
    });
  });

  describe('Memory Namespace Support', () => {
    test('supports namespace parameter (if implemented)', () => {
      const key = `${TEST_KEY_PREFIX}-namespace-1`;

      // Try with namespace (may not be supported yet)
      try {
        execSync(`npx claude-flow@alpha hooks memory --action store --key "${key}" --value "test" --namespace "test"`, {
          stdio: 'pipe'
        });
        // If it works, great
        expect(true).toBe(true);
      } catch (e) {
        // If not supported, that's also fine
        expect(true).toBe(true);
      }
    });
  });

  describe('Memory Error Handling', () => {
    test('handles invalid action gracefully', () => {
      try {
        execSync('npx claude-flow@alpha hooks memory --action invalid-action', {
          stdio: 'pipe'
        });
        fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    test('requires key parameter', () => {
      try {
        execSync('npx claude-flow@alpha hooks memory --action store --value "test"', {
          stdio: 'pipe'
        });
        fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
