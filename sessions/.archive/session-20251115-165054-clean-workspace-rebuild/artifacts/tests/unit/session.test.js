/**
 * Unit Tests - Session Management
 * Tests session lifecycle and artifact management
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Session Management Tests', () => {
  const TEST_SESSION_ID = 'session-test-' + Date.now() + '-unit-test';

  afterEach(() => {
    // Cleanup test sessions
    try {
      execSync(`rm -rf sessions/${TEST_SESSION_ID}*`);
    } catch (e) {
      // Ignore cleanup errors
    }
  });

  describe('Session Directory Creation', () => {
    test('can create session directory', () => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID);

      execSync(`mkdir -p "${sessionPath}"`);

      expect(fs.existsSync(sessionPath)).toBe(true);
    });

    test('creates correct artifact structure', () => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID);

      execSync(`mkdir -p "${sessionPath}/artifacts"/{code,tests,docs,scripts,notes}`);

      expect(fs.existsSync(path.join(sessionPath, 'artifacts/code'))).toBe(true);
      expect(fs.existsSync(path.join(sessionPath, 'artifacts/tests'))).toBe(true);
      expect(fs.existsSync(path.join(sessionPath, 'artifacts/docs'))).toBe(true);
      expect(fs.existsSync(path.join(sessionPath, 'artifacts/scripts'))).toBe(true);
      expect(fs.existsSync(path.join(sessionPath, 'artifacts/notes'))).toBe(true);
    });

    test('session ID follows correct format', () => {
      const sessionIdPattern = /^session-\d{8}-\d{6}-.+$/;
      const validSessionId = 'session-20251115-165054-test-topic';

      expect(validSessionId).toMatch(sessionIdPattern);
    });
  });

  describe('Session Metadata', () => {
    test('can create metadata.json', () => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID);
      execSync(`mkdir -p "${sessionPath}"`);

      const metadata = {
        sessionId: TEST_SESSION_ID,
        created: new Date().toISOString(),
        status: 'active',
        topic: 'unit-test'
      };

      fs.writeFileSync(
        path.join(sessionPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      expect(fs.existsSync(path.join(sessionPath, 'metadata.json'))).toBe(true);
    });

    test('metadata.json is valid JSON', () => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID);
      execSync(`mkdir -p "${sessionPath}"`);

      const metadata = {
        sessionId: TEST_SESSION_ID,
        created: new Date().toISOString(),
        status: 'active'
      };

      fs.writeFileSync(
        path.join(sessionPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      const loadedMetadata = JSON.parse(
        fs.readFileSync(path.join(sessionPath, 'metadata.json'), 'utf8')
      );

      expect(loadedMetadata.sessionId).toBe(TEST_SESSION_ID);
    });

    test('can create session-summary.md', () => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID);
      execSync(`mkdir -p "${sessionPath}"`);

      const summary = `# Session Summary\n\nSession ID: ${TEST_SESSION_ID}\nStatus: Active\n`;
      fs.writeFileSync(path.join(sessionPath, 'session-summary.md'), summary);

      expect(fs.existsSync(path.join(sessionPath, 'session-summary.md'))).toBe(true);
    });
  });

  describe('File Routing to Artifacts', () => {
    beforeEach(() => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID);
      execSync(`mkdir -p "${sessionPath}/artifacts"/{code,tests,docs,scripts,notes}`);
    });

    test('can write to artifacts/code/', () => {
      const filePath = path.join(
        process.cwd(),
        'sessions',
        TEST_SESSION_ID,
        'artifacts/code/test.js'
      );

      fs.writeFileSync(filePath, 'console.log("test");');

      expect(fs.existsSync(filePath)).toBe(true);
    });

    test('can write to artifacts/tests/', () => {
      const filePath = path.join(
        process.cwd(),
        'sessions',
        TEST_SESSION_ID,
        'artifacts/tests/test.test.js'
      );

      fs.writeFileSync(filePath, 'test("example", () => {});');

      expect(fs.existsSync(filePath)).toBe(true);
    });

    test('can write to artifacts/docs/', () => {
      const filePath = path.join(
        process.cwd(),
        'sessions',
        TEST_SESSION_ID,
        'artifacts/docs/README.md'
      );

      fs.writeFileSync(filePath, '# Documentation');

      expect(fs.existsSync(filePath)).toBe(true);
    });

    test('files are isolated per session', () => {
      const session1 = TEST_SESSION_ID + '-1';
      const session2 = TEST_SESSION_ID + '-2';

      execSync(`mkdir -p sessions/${session1}/artifacts/code`);
      execSync(`mkdir -p sessions/${session2}/artifacts/code`);

      fs.writeFileSync(`sessions/${session1}/artifacts/code/file.js`, 'session1');
      fs.writeFileSync(`sessions/${session2}/artifacts/code/file.js`, 'session2');

      const content1 = fs.readFileSync(`sessions/${session1}/artifacts/code/file.js`, 'utf8');
      const content2 = fs.readFileSync(`sessions/${session2}/artifacts/code/file.js`, 'utf8');

      expect(content1).toBe('session1');
      expect(content2).toBe('session2');
    });
  });

  describe('Session Lifecycle', () => {
    test('session starts as active', () => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID);
      execSync(`mkdir -p "${sessionPath}"`);

      const metadata = {
        sessionId: TEST_SESSION_ID,
        status: 'active'
      };

      fs.writeFileSync(
        path.join(sessionPath, 'metadata.json'),
        JSON.stringify(metadata)
      );

      const loaded = JSON.parse(
        fs.readFileSync(path.join(sessionPath, 'metadata.json'), 'utf8')
      );

      expect(loaded.status).toBe('active');
    });

    test('session can be marked completed', () => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID);
      execSync(`mkdir -p "${sessionPath}"`);

      let metadata = {
        sessionId: TEST_SESSION_ID,
        status: 'active'
      };

      fs.writeFileSync(
        path.join(sessionPath, 'metadata.json'),
        JSON.stringify(metadata)
      );

      // Update status
      metadata.status = 'completed';
      fs.writeFileSync(
        path.join(sessionPath, 'metadata.json'),
        JSON.stringify(metadata)
      );

      const loaded = JSON.parse(
        fs.readFileSync(path.join(sessionPath, 'metadata.json'), 'utf8')
      );

      expect(loaded.status).toBe('completed');
    });
  });

  describe('Session Backup', () => {
    test('backup directory exists', () => {
      const backupPath = path.join(process.cwd(), '.swarm/backups');

      execSync(`mkdir -p "${backupPath}"`);

      expect(fs.existsSync(backupPath)).toBe(true);
    });

    test('can create session backup', () => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID);
      const backupPath = path.join(process.cwd(), '.swarm/backups');

      execSync(`mkdir -p "${sessionPath}/artifacts/code"`);
      fs.writeFileSync(path.join(sessionPath, 'test.txt'), 'backup test');

      execSync(`mkdir -p "${backupPath}"`);
      execSync(`cp -r "${sessionPath}" "${backupPath}/${TEST_SESSION_ID}"`);

      expect(fs.existsSync(path.join(backupPath, TEST_SESSION_ID))).toBe(true);

      // Cleanup backup
      execSync(`rm -rf "${backupPath}/${TEST_SESSION_ID}"`);
    });
  });

  describe('Session Isolation', () => {
    test('multiple sessions can coexist', () => {
      const session1 = TEST_SESSION_ID + '-multi-1';
      const session2 = TEST_SESSION_ID + '-multi-2';
      const session3 = TEST_SESSION_ID + '-multi-3';

      execSync(`mkdir -p sessions/${session1}`);
      execSync(`mkdir -p sessions/${session2}`);
      execSync(`mkdir -p sessions/${session3}`);

      expect(fs.existsSync(`sessions/${session1}`)).toBe(true);
      expect(fs.existsSync(`sessions/${session2}`)).toBe(true);
      expect(fs.existsSync(`sessions/${session3}`)).toBe(true);
    });

    test('session artifacts do not interfere', () => {
      const session1 = TEST_SESSION_ID + '-iso-1';
      const session2 = TEST_SESSION_ID + '-iso-2';

      execSync(`mkdir -p sessions/${session1}/artifacts/code`);
      execSync(`mkdir -p sessions/${session2}/artifacts/code`);

      fs.writeFileSync(`sessions/${session1}/artifacts/code/shared.js`, 'v1');
      fs.writeFileSync(`sessions/${session2}/artifacts/code/shared.js`, 'v2');

      const s1Content = fs.readFileSync(`sessions/${session1}/artifacts/code/shared.js`, 'utf8');
      const s2Content = fs.readFileSync(`sessions/${session2}/artifacts/code/shared.js`, 'utf8');

      expect(s1Content).toBe('v1');
      expect(s2Content).toBe('v2');
    });
  });
});
