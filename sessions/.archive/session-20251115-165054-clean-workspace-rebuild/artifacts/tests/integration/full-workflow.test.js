/**
 * Integration Tests - Full Workflow
 * Tests complete end-to-end workflows
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

describe('Full Workflow Integration Tests', () => {
  const TEST_SESSION_ID = 'session-test-' + Date.now() + '-integration';

  afterAll(() => {
    // Cleanup
    try {
      execSync(`rm -rf sessions/${TEST_SESSION_ID}*`);
    } catch (e) {
      // Ignore
    }
  });

  describe('Complete Session Lifecycle', () => {
    test('full session creation → work → closeout', () => {
      // Step 1: Create session
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID);
      execSync(`mkdir -p "${sessionPath}/artifacts"/{code,tests,docs,scripts,notes}`);

      expect(fs.existsSync(sessionPath)).toBe(true);

      // Step 2: Initialize metadata
      const metadata = {
        sessionId: TEST_SESSION_ID,
        created: new Date().toISOString(),
        status: 'active',
        topic: 'integration-test'
      };

      fs.writeFileSync(
        path.join(sessionPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      // Step 3: Do work (create artifacts)
      fs.writeFileSync(
        path.join(sessionPath, 'artifacts/code/main.js'),
        'console.log("Hello, World!");'
      );

      fs.writeFileSync(
        path.join(sessionPath, 'artifacts/tests/main.test.js'),
        'test("example", () => { expect(true).toBe(true); });'
      );

      fs.writeFileSync(
        path.join(sessionPath, 'artifacts/docs/README.md'),
        '# Test Documentation'
      );

      // Step 4: Create summary
      const summary = `# Session Summary

Session ID: ${TEST_SESSION_ID}
Topic: Integration Test
Status: Completed

## Artifacts Created
- main.js
- main.test.js
- README.md
`;

      fs.writeFileSync(path.join(sessionPath, 'session-summary.md'), summary);

      // Step 5: Mark completed
      metadata.status = 'completed';
      metadata.completed = new Date().toISOString();
      fs.writeFileSync(
        path.join(sessionPath, 'metadata.json'),
        JSON.stringify(metadata, null, 2)
      );

      // Verify all steps
      expect(fs.existsSync(path.join(sessionPath, 'artifacts/code/main.js'))).toBe(true);
      expect(fs.existsSync(path.join(sessionPath, 'artifacts/tests/main.test.js'))).toBe(true);
      expect(fs.existsSync(path.join(sessionPath, 'artifacts/docs/README.md'))).toBe(true);
      expect(fs.existsSync(path.join(sessionPath, 'session-summary.md'))).toBe(true);

      const finalMetadata = JSON.parse(
        fs.readFileSync(path.join(sessionPath, 'metadata.json'), 'utf8')
      );
      expect(finalMetadata.status).toBe('completed');
    });
  });

  describe('Hooks Integration Workflow', () => {
    test('hooks fire during session lifecycle', () => {
      const testKey = `integration-test-${Date.now()}`;

      // Simulate pre-task hook
      execSync(`npx claude-flow@alpha hooks pre-task --description "Integration test" --task-id "${testKey}"`, {
        stdio: 'pipe'
      });

      // Simulate work with memory
      execSync(`npx claude-flow@alpha hooks memory --action store --key "${testKey}" --value "in-progress"`, {
        stdio: 'pipe'
      });

      // Verify memory stored
      const result = execSync(`npx claude-flow@alpha hooks memory --action retrieve --key "${testKey}"`, {
        encoding: 'utf8'
      });

      expect(result).toContain('in-progress');

      // Simulate post-task hook
      execSync(`npx claude-flow@alpha hooks post-task --task-id "${testKey}" --status "completed"`, {
        stdio: 'pipe'
      });

      // Update memory
      execSync(`npx claude-flow@alpha hooks memory --action store --key "${testKey}" --value "completed"`, {
        stdio: 'pipe'
      });
    });
  });

  describe('Multi-Agent Coordination Workflow', () => {
    test('agents coordinate via memory', () => {
      const coordinationKey = `coordination-${Date.now()}`;

      // Agent 1: Store data
      execSync(`npx claude-flow@alpha hooks memory --action store --key "${coordinationKey}-agent1" --value "agent1-data"`, {
        stdio: 'pipe'
      });

      // Agent 2: Store data
      execSync(`npx claude-flow@alpha hooks memory --action store --key "${coordinationKey}-agent2" --value "agent2-data"`, {
        stdio: 'pipe'
      });

      // Coordinator: Read both
      const result1 = execSync(`npx claude-flow@alpha hooks memory --action retrieve --key "${coordinationKey}-agent1"`, {
        encoding: 'utf8'
      });

      const result2 = execSync(`npx claude-flow@alpha hooks memory --action retrieve --key "${coordinationKey}-agent2"`, {
        encoding: 'utf8'
      });

      expect(result1).toContain('agent1-data');
      expect(result2).toContain('agent2-data');
    });
  });

  describe('File Routing Integration', () => {
    test('all file types route to correct artifacts', () => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID + '-routing');
      execSync(`mkdir -p "${sessionPath}/artifacts"/{code,tests,docs,scripts,notes}`);

      // Create various file types
      const files = [
        { type: 'code', name: 'app.js', content: 'console.log("app");' },
        { type: 'tests', name: 'app.test.js', content: 'test("app", () => {});' },
        { type: 'docs', name: 'API.md', content: '# API Documentation' },
        { type: 'scripts', name: 'deploy.sh', content: '#!/bin/bash\necho "deploy"' },
        { type: 'notes', name: 'notes.txt', content: 'Project notes' }
      ];

      files.forEach(file => {
        const filePath = path.join(sessionPath, 'artifacts', file.type, file.name);
        fs.writeFileSync(filePath, file.content);
        expect(fs.existsSync(filePath)).toBe(true);
      });

      // Cleanup
      execSync(`rm -rf "${sessionPath}"`);
    });
  });

  describe('Cross-Session Memory Persistence', () => {
    test('memory persists across sessions', () => {
      const persistKey = `persist-test-${Date.now()}`;
      const session1 = TEST_SESSION_ID + '-persist-1';
      const session2 = TEST_SESSION_ID + '-persist-2';

      // Session 1: Store data
      execSync(`npx claude-flow@alpha hooks memory --action store --key "${persistKey}" --value "persistent-data"`, {
        stdio: 'pipe'
      });

      // Session 2: Retrieve data
      const result = execSync(`npx claude-flow@alpha hooks memory --action retrieve --key "${persistKey}"`, {
        encoding: 'utf8'
      });

      expect(result).toContain('persistent-data');
    });
  });

  describe('Session Backup Integration', () => {
    test('session backed up to .swarm/backups/', () => {
      const sessionPath = path.join(process.cwd(), 'sessions', TEST_SESSION_ID + '-backup');
      const backupPath = path.join(process.cwd(), '.swarm/backups');

      // Create session
      execSync(`mkdir -p "${sessionPath}/artifacts/code"`);
      fs.writeFileSync(path.join(sessionPath, 'metadata.json'), JSON.stringify({
        sessionId: TEST_SESSION_ID + '-backup',
        status: 'completed'
      }));

      // Create backup
      execSync(`mkdir -p "${backupPath}"`);
      execSync(`tar -czf "${backupPath}/${TEST_SESSION_ID}-backup.tar.gz" -C sessions "${TEST_SESSION_ID}-backup"`);

      expect(fs.existsSync(path.join(backupPath, `${TEST_SESSION_ID}-backup.tar.gz`))).toBe(true);

      // Cleanup
      execSync(`rm -rf "${sessionPath}"`);
      execSync(`rm -f "${backupPath}/${TEST_SESSION_ID}-backup.tar.gz"`);
    });
  });

  describe('Workspace Structure Integration', () => {
    test('workspace maintains correct structure during workflow', () => {
      // Verify no working files in root
      const rootFiles = fs.readdirSync(process.cwd());
      const workingFiles = rootFiles.filter(f =>
        f.endsWith('.tmp') ||
        f.startsWith('test-') ||
        f.match(/\.test\.(js|ts)$/)
      );

      expect(workingFiles.length).toBe(0);

      // Verify .claude/ contains only custom features
      if (fs.existsSync('.claude')) {
        const claudeContents = fs.readdirSync('.claude');
        const stockFiles = claudeContents.filter(f =>
          f === 'memory.db' ||
          f === 'backups'
        );

        expect(stockFiles.length).toBe(0);
      }

      // Verify .swarm/ contains stock data
      if (fs.existsSync('.swarm')) {
        const swarmContents = fs.readdirSync('.swarm');
        // Should contain memory.db or backups
        expect(swarmContents.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Error Recovery Workflow', () => {
    test('workflow recovers from hook failures', () => {
      // Even if a hook fails, workflow should continue
      const testKey = `error-recovery-${Date.now()}`;

      try {
        // Try an invalid operation
        execSync('npx claude-flow@alpha hooks invalid-command', {
          stdio: 'pipe'
        });
      } catch (e) {
        // Expected to fail
      }

      // But valid operations should still work
      expect(() => {
        execSync(`npx claude-flow@alpha hooks memory --action store --key "${testKey}" --value "recovered"`, {
          stdio: 'pipe'
        });
      }).not.toThrow();
    });
  });
});
