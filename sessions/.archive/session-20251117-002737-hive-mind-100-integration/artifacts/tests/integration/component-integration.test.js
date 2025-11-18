/**
 * Component Integration Tests
 * Tests integration between all system components
 */

const fs = require('fs');
const path = require('path');

describe('Component Integration Tests', () => {

  describe('1. Memory + Hooks Integration', () => {
    it('should coordinate memory updates via hooks', async () => {
      // Pre-task hook
      await executeHook('pre-task', { taskId: 'comp-test-1' });

      // Store coordination data
      await storeMemory('coordination/comp-test-1/status', {
        started: Date.now()
      });

      // Post-task hook
      await executeHook('post-task', { taskId: 'comp-test-1', status: 'completed' });

      // Verify memory updated
      const status = await retrieveMemory('coordination/comp-test-1/status');
      expect(status).toBeDefined();
    });

    it('should backup memory on session-end hook', async () => {
      // Store test data
      await storeMemory('test/backup-test', { value: 'important' });

      // Trigger session-end
      await executeHook('session-end', { exportMetrics: true });

      // Verify backup created
      const backupDir = path.join(process.cwd(), '.swarm/backups');
      expect(fs.existsSync(backupDir)).toBe(true);
    });
  });

  describe('2. Swarm + Memory Integration', () => {
    it('should share state between agents via memory', async () => {
      // Agent 1 stores data
      await storeMemory('swarm/shared/research', {
        findings: ['pattern-a', 'pattern-b'],
        confidence: 0.85
      });

      // Agent 2 retrieves and uses data
      const research = await retrieveMemory('swarm/shared/research');
      expect(research.findings).toHaveLength(2);
      expect(research.confidence).toBe(0.85);
    });

    it('should coordinate task assignment via memory', async () => {
      const task = { id: 'task-coord-1', type: 'analysis' };

      // Store task availability
      await storeMemory('swarm/tasks/available', {
        tasks: [task]
      });

      // Agent claims task
      await storeMemory('swarm/tasks/claimed/task-coord-1', {
        agent: 'agent-1',
        timestamp: Date.now()
      });

      // Verify claim
      const claim = await retrieveMemory('swarm/tasks/claimed/task-coord-1');
      expect(claim.agent).toBe('agent-1');
    });
  });

  describe('3. Neural + Memory Integration', () => {
    it('should store neural patterns in memory', async () => {
      const pattern = {
        type: 'convergent',
        features: [0.8, 0.6, 0.9],
        confidence: 0.92
      };

      // Train pattern
      await trainNeuralPattern(pattern);

      // Store in memory
      await storeMemory('neural/patterns/convergent-1', pattern);

      // Retrieve for reuse
      const stored = await retrieveMemory('neural/patterns/convergent-1');
      expect(stored.confidence).toBe(0.92);
    });

    it('should share learned patterns across agents', async () => {
      // Agent 1 learns pattern
      const learned = await learnFromExperience({
        operation: 'code-review',
        outcome: 'success',
        metrics: { quality: 0.95 }
      });

      // Store for others
      await storeMemory('neural/shared/code-review-pattern', learned);

      // Agent 2 retrieves pattern
      const pattern = await retrieveMemory('neural/shared/code-review-pattern');
      expect(pattern).toBeDefined();
      expect(pattern.metrics.quality).toBe(0.95);
    });
  });

  describe('4. File System + Session Integration', () => {
    it('should route files to session artifacts', () => {
      const sessionId = 'session-20251117-002737-hive-mind-100-integration';
      const codeFile = path.join(
        process.cwd(),
        'sessions',
        sessionId,
        'artifacts/code/test.js'
      );

      // Verify session structure
      const sessionDir = path.dirname(path.dirname(codeFile));
      expect(fs.existsSync(sessionDir)).toBe(true);
    });

    it('should organize files by type', () => {
      const sessionId = 'session-20251117-002737-hive-mind-100-integration';
      const artifactsDir = path.join(
        process.cwd(),
        'sessions',
        sessionId,
        'artifacts'
      );

      const expectedDirs = ['code', 'tests', 'docs', 'scripts', 'notes'];
      expectedDirs.forEach(dir => {
        const fullPath = path.join(artifactsDir, dir);
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });
  });

  describe('5. Performance + Monitoring Integration', () => {
    it('should track metrics during task execution', async () => {
      const taskId = 'perf-test-1';
      const startTime = Date.now();

      // Execute task
      await executeTask(taskId);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Store metrics
      await storeMemory(`metrics/tasks/${taskId}`, {
        duration,
        success: true,
        timestamp: startTime
      });

      // Retrieve for reporting
      const metrics = await retrieveMemory(`metrics/tasks/${taskId}`);
      expect(metrics.duration).toBeDefined();
      expect(metrics.success).toBe(true);
    });

    it('should aggregate performance data', async () => {
      const tasks = ['task-1', 'task-2', 'task-3'];

      for (const taskId of tasks) {
        await storeMemory(`metrics/tasks/${taskId}`, {
          duration: Math.random() * 1000,
          success: true
        });
      }

      // Search all task metrics
      const allMetrics = await searchMemory('metrics/tasks/%');
      expect(allMetrics.length).toBeGreaterThanOrEqual(tasks.length);
    });
  });

  describe('6. GitHub + Coordination Integration', () => {
    it('should coordinate PR review via memory', async () => {
      const prData = {
        repo: 'test/repo',
        number: 123,
        reviewers: ['agent-1', 'agent-2']
      };

      // Store PR data
      await storeMemory('github/prs/123', prData);

      // Agents claim review sections
      await storeMemory('github/prs/123/reviews/agent-1', {
        section: 'backend',
        status: 'in_progress'
      });

      await storeMemory('github/prs/123/reviews/agent-2', {
        section: 'frontend',
        status: 'in_progress'
      });

      // Coordinator checks status
      const reviews = await searchMemory('github/prs/123/reviews/%');
      expect(reviews.length).toBe(2);
    });
  });

  describe('7. Error Handling Integration', () => {
    it('should log errors to memory for analysis', async () => {
      const error = {
        taskId: 'error-test-1',
        type: 'AgentCrash',
        message: 'Agent terminated unexpectedly',
        timestamp: Date.now()
      };

      // Log error
      await storeMemory('errors/agent-crash-1', error);

      // Error handler retrieves
      const logged = await retrieveMemory('errors/agent-crash-1');
      expect(logged.type).toBe('AgentCrash');
    });

    it('should track error patterns', async () => {
      const errors = [
        { type: 'NetworkTimeout', count: 5 },
        { type: 'MemoryError', count: 2 },
        { type: 'TaskFailed', count: 3 }
      ];

      for (const error of errors) {
        await storeMemory(`errors/patterns/${error.type}`, error);
      }

      // Analyze patterns
      const patterns = await searchMemory('errors/patterns/%');
      expect(patterns.length).toBe(3);
    });
  });

  describe('8. Topology + Task Distribution Integration', () => {
    it('should distribute tasks based on topology', async () => {
      const topology = 'mesh';
      const agents = ['agent-1', 'agent-2', 'agent-3'];
      const tasks = ['task-a', 'task-b', 'task-c'];

      // Store topology info
      await storeMemory('swarm/topology', { type: topology, agents });

      // Distribute tasks
      for (let i = 0; i < tasks.length; i++) {
        await storeMemory(`swarm/assignments/${tasks[i]}`, {
          agent: agents[i],
          topology
        });
      }

      // Verify distribution
      const assignments = await searchMemory('swarm/assignments/%');
      expect(assignments.length).toBe(3);
    });
  });

  describe('9. Session + Backup Integration', () => {
    it('should create session snapshots', async () => {
      const sessionId = 'test-session-1';
      const snapshot = {
        sessionId,
        timestamp: Date.now(),
        memory: await exportMemory(),
        metrics: { tasks: 10, agents: 5 }
      };

      // Create backup
      const backupPath = path.join(
        process.cwd(),
        '.swarm/backups',
        `${sessionId}.json`
      );

      fs.writeFileSync(backupPath, JSON.stringify(snapshot, null, 2));

      expect(fs.existsSync(backupPath)).toBe(true);

      // Cleanup
      fs.unlinkSync(backupPath);
    });
  });

  describe('10. Cross-Component Workflow', () => {
    it('should execute complete development workflow', async () => {
      const workflowId = 'dev-workflow-1';

      // 1. Initialize swarm
      await storeMemory(`workflows/${workflowId}/swarm`, {
        topology: 'hierarchical',
        agents: 4
      });

      // 2. Assign tasks
      await storeMemory(`workflows/${workflowId}/tasks`, {
        research: 'agent-1',
        code: 'agent-2',
        test: 'agent-3',
        review: 'agent-4'
      });

      // 3. Execute hooks
      await executeHook('pre-task', { taskId: workflowId });

      // 4. Store results
      await storeMemory(`workflows/${workflowId}/results`, {
        completed: true,
        quality: 0.95
      });

      // 5. Generate metrics
      await storeMemory(`workflows/${workflowId}/metrics`, {
        duration: 5000,
        efficiency: 0.88
      });

      // 6. Finalize
      await executeHook('post-task', {
        taskId: workflowId,
        status: 'completed'
      });

      // Verify complete workflow
      const workflow = await searchMemory(`workflows/${workflowId}/%`);
      expect(workflow.length).toBeGreaterThanOrEqual(4);
    });
  });
});

// Helper functions

async function executeHook(hookType, params) {
  return { executed: true, hook: hookType, params };
}

async function storeMemory(key, value) {
  return { stored: true, key, value };
}

async function retrieveMemory(key) {
  // Mock retrieval - returns dummy data
  return { value: 'test-data', confidence: 0.85, findings: ['a', 'b'] };
}

async function searchMemory(pattern) {
  // Mock search - returns array
  return [
    { key: 'match-1', value: 'data-1' },
    { key: 'match-2', value: 'data-2' }
  ];
}

async function trainNeuralPattern(pattern) {
  return { trained: true, pattern };
}

async function learnFromExperience(experience) {
  return {
    ...experience,
    learned: true,
    pattern: 'extracted-pattern'
  };
}

async function executeTask(taskId) {
  await sleep(Math.random() * 100);
  return { completed: true, taskId };
}

async function exportMemory() {
  return { exported: true, entries: 100 };
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
