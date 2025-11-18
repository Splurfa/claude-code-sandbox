/**
 * Auto-Scaling System Tests
 * Test-Driven Development for intelligent agent scaling
 */

const { ComplexityDetector } = require('../code/scaling/complexity-detector.js');
const { AutoScaler } = require('../code/scaling/auto-scaler.js');
const { AgentPoolManager } = require('../code/scaling/agent-pool-manager.js');
const fs = require('fs');
const path = require('path');

describe('ComplexityDetector', () => {
  let detector;

  beforeEach(() => {
    detector = new ComplexityDetector();
  });

  describe('Task Complexity Scoring', () => {
    test('should score simple tasks low (0-30)', () => {
      const task = {
        description: 'Add a comment to function',
        files: ['utils.js'],
        dependencies: []
      };
      const score = detector.scoreTask(task);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThan(30);
    });

    test('should score medium tasks appropriately (30-70)', () => {
      const task = {
        description: 'Implement REST API endpoint with authentication and validation',
        files: ['api/auth.js', 'middleware/validate.js', 'tests/auth.test.js'],
        dependencies: ['express', 'jwt'],
        codeComplexity: 45
      };
      const score = detector.scoreTask(task);
      expect(score).toBeGreaterThanOrEqual(30);
      expect(score).toBeLessThan(70);
    });

    test('should score high complexity tasks (70-100)', () => {
      const task = {
        description: 'Build distributed system with microservices, message queue, and fault tolerance',
        files: Array(15).fill('service.js'),
        dependencies: ['rabbitmq', 'redis', 'kubernetes', 'prometheus'],
        codeComplexity: 85,
        crossCutting: true,
        parallelizable: true
      };
      const score = detector.scoreTask(task);
      expect(score).toBeGreaterThanOrEqual(70);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('should analyze description keywords for complexity', () => {
      const complexKeywords = {
        description: 'refactor distributed architecture with event-driven patterns',
        files: ['app.js']
      };
      const simpleKeywords = {
        description: 'fix typo in comment',
        files: ['app.js']
      };

      expect(detector.scoreTask(complexKeywords)).toBeGreaterThan(
        detector.scoreTask(simpleKeywords)
      );
    });

    test('should consider file count in scoring', () => {
      const manyFiles = {
        description: 'Update configuration',
        files: Array(20).fill('config.js')
      };
      const fewFiles = {
        description: 'Update configuration',
        files: ['config.js']
      };

      expect(detector.scoreTask(manyFiles)).toBeGreaterThan(
        detector.scoreTask(fewFiles)
      );
    });

    test('should factor in dependency complexity', () => {
      const manyDeps = {
        description: 'Setup project',
        files: ['package.json'],
        dependencies: ['react', 'webpack', 'babel', 'eslint', 'jest', 'typescript']
      };
      const noDeps = {
        description: 'Setup project',
        files: ['package.json'],
        dependencies: []
      };

      expect(detector.scoreTask(manyDeps)).toBeGreaterThan(
        detector.scoreTask(noDeps)
      );
    });
  });

  describe('Complexity Metrics', () => {
    test('should provide breakdown of complexity factors', () => {
      const task = {
        description: 'Build microservice with distributed caching',
        files: ['service.js', 'cache.js'],
        dependencies: ['redis'],
        codeComplexity: 60
      };

      const metrics = detector.getComplexityMetrics(task);
      expect(metrics).toHaveProperty('descriptionScore');
      expect(metrics).toHaveProperty('fileCountScore');
      expect(metrics).toHaveProperty('dependencyScore');
      expect(metrics).toHaveProperty('codeComplexityScore');
      expect(metrics).toHaveProperty('totalScore');
    });
  });
});

describe('AutoScaler', () => {
  let scaler;
  let poolManager;

  beforeEach(() => {
    poolManager = new AgentPoolManager({ maxAgents: 12 });
    scaler = new AutoScaler({
      minAgents: 1,
      maxAgents: 12,
      thresholds: {
        low: 30,
        medium: 70,
        high: 90
      },
      poolManager
    });
  });

  describe('Threshold-Based Spawning', () => {
    test('should spawn 3 agents for low complexity (score < 50)', async () => {
      const task = { complexityScore: 40 };
      const agents = await scaler.scaleForTask(task);

      expect(agents.length).toBe(3);
    });

    test('should spawn 6-8 agents for medium complexity (50-70)', async () => {
      const task = { complexityScore: 65 };
      const agents = await scaler.scaleForTask(task);

      expect(agents.length).toBeGreaterThanOrEqual(6);
      expect(agents.length).toBeLessThanOrEqual(8);
    });

    test('should spawn 8-12 agents for high complexity (>70)', async () => {
      const task = { complexityScore: 85 };
      const agents = await scaler.scaleForTask(task);

      expect(agents.length).toBeGreaterThanOrEqual(8);
      expect(agents.length).toBeLessThanOrEqual(12);
    });

    test('should never exceed max agents limit', async () => {
      const task = { complexityScore: 100 };
      const agents = await scaler.scaleForTask(task);

      expect(agents.length).toBeLessThanOrEqual(12);
    });

    test('should respect minimum agents requirement', async () => {
      const task = { complexityScore: 5 };
      const agents = await scaler.scaleForTask(task);

      expect(agents.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Graceful Scale-Down', () => {
    test('should identify idle agents for removal', async () => {
      // Simulate agents with varying idle times
      await scaler.scaleForTask({ complexityScore: 80 }); // Spawn agents

      // Mark some agents as idle
      const idleAgents = scaler.getIdleAgents({ idleTimeoutMs: 30000 });
      expect(Array.isArray(idleAgents)).toBe(true);
    });

    test('should scale down idle agents gradually', async () => {
      await scaler.scaleForTask({ complexityScore: 80 });
      const initialCount = scaler.getActiveAgentCount();

      // Simulate passage of time and idle detection
      await scaler.scaleDown({ maxRemove: 2 });
      const afterScaleDown = scaler.getActiveAgentCount();

      expect(afterScaleDown).toBeLessThanOrEqual(initialCount);
    });

    test('should not scale below minimum agents', async () => {
      await scaler.scaleForTask({ complexityScore: 20 });
      await scaler.scaleDown({ maxRemove: 10 }); // Try to remove many

      expect(scaler.getActiveAgentCount()).toBeGreaterThanOrEqual(1);
    });

    test('should preserve high-performing agents during scale-down', async () => {
      await scaler.scaleForTask({ complexityScore: 60 });

      // Mark agent performance
      const agents = scaler.getActiveAgents();
      agents[0].performance = 0.95; // High performer
      agents[1].performance = 0.45; // Low performer

      await scaler.scaleDown({ maxRemove: 1 });

      const remaining = scaler.getActiveAgents();
      expect(remaining.find(a => a.performance === 0.95)).toBeDefined();
    });
  });

  describe('Dynamic Scaling', () => {
    test('should adjust agent count based on workload changes', async () => {
      const task1 = { complexityScore: 30 };
      await scaler.scaleForTask(task1);
      const count1 = scaler.getActiveAgentCount();

      const task2 = { complexityScore: 85 };
      await scaler.scaleForTask(task2);
      const count2 = scaler.getActiveAgentCount();

      expect(count2).toBeGreaterThan(count1);
    });
  });
});

describe('AgentPoolManager', () => {
  let manager;

  beforeEach(() => {
    manager = new AgentPoolManager({
      maxAgents: 12,
      agentTypes: ['researcher', 'coder', 'tester', 'reviewer', 'architect']
    });
  });

  describe('Agent Pool Management', () => {
    test('should initialize empty pool', () => {
      expect(manager.getPoolSize()).toBe(0);
      expect(manager.getActiveCount()).toBe(0);
    });

    test('should spawn agents to pool', async () => {
      await manager.spawnAgent({ type: 'coder', id: 'agent-1' });
      expect(manager.getPoolSize()).toBe(1);
    });

    test('should track agent status (idle/active)', async () => {
      await manager.spawnAgent({ type: 'coder', id: 'agent-1' });
      const agent = manager.getAgent('agent-1');

      expect(agent.status).toBe('idle');

      manager.markActive('agent-1');
      expect(manager.getAgent('agent-1').status).toBe('active');
    });

    test('should enforce max agents limit', async () => {
      const spawnPromises = [];
      for (let i = 0; i < 15; i++) {
        spawnPromises.push(manager.spawnAgent({ type: 'coder', id: `agent-${i}` }));
      }

      await Promise.allSettled(spawnPromises);
      expect(manager.getPoolSize()).toBeLessThanOrEqual(12);
    });
  });

  describe('Performance-Based Selection', () => {
    beforeEach(async () => {
      // Create pool with varying performance
      await manager.spawnAgent({ type: 'coder', id: 'agent-1', performance: 0.95 });
      await manager.spawnAgent({ type: 'coder', id: 'agent-2', performance: 0.75 });
      await manager.spawnAgent({ type: 'coder', id: 'agent-3', performance: 0.85 });
      await manager.spawnAgent({ type: 'tester', id: 'agent-4', performance: 0.90 });
    });

    test('should select best performing agents', () => {
      const selected = manager.selectAgents({ count: 2, type: 'coder' });

      expect(selected.length).toBe(2);
      expect(selected[0].id).toBe('agent-1'); // Highest performance
      expect(selected[1].id).toBe('agent-3'); // Second highest
    });

    test('should filter by agent type', () => {
      const coders = manager.selectAgents({ type: 'coder' });
      expect(coders.every(a => a.type === 'coder')).toBe(true);
    });

    test('should return idle agents when possible', () => {
      manager.markActive('agent-1');
      const selected = manager.selectAgents({ count: 1, type: 'coder', preferIdle: true });

      expect(selected[0].status).toBe('idle');
    });

    test('should track agent performance metrics', async () => {
      const agent = manager.getAgent('agent-1');

      manager.recordTaskCompletion('agent-1', { success: true, duration: 1000 });
      manager.recordTaskCompletion('agent-1', { success: true, duration: 800 });

      const metrics = manager.getAgentMetrics('agent-1');
      expect(metrics).toHaveProperty('tasksCompleted');
      expect(metrics).toHaveProperty('averageDuration');
      expect(metrics).toHaveProperty('successRate');
    });
  });

  describe('Pool Optimization', () => {
    test('should remove underperforming agents', async () => {
      await manager.spawnAgent({ type: 'coder', id: 'good', performance: 0.90 });
      await manager.spawnAgent({ type: 'coder', id: 'bad', performance: 0.40 });

      const removed = await manager.removeUnderperformers({ threshold: 0.60 });

      expect(removed).toContain('bad');
      expect(manager.getAgent('good')).toBeDefined();
      expect(manager.getAgent('bad')).toBeUndefined();
    });

    test('should rebalance pool by agent type', async () => {
      // Create imbalanced pool
      for (let i = 0; i < 8; i++) {
        await manager.spawnAgent({ type: 'coder', id: `coder-${i}` });
      }
      await manager.spawnAgent({ type: 'tester', id: 'tester-1' });

      const rebalanced = await manager.rebalancePool({
        desired: { coder: 5, tester: 3, reviewer: 2 }
      });

      expect(rebalanced.coder).toBe(5);
      expect(rebalanced.tester).toBeGreaterThanOrEqual(2);
    });
  });
});

describe('Auto-Scaling Integration', () => {
  let detector;
  let scaler;
  let poolManager;

  beforeEach(() => {
    detector = new ComplexityDetector();
    poolManager = new AgentPoolManager({ maxAgents: 12 });
    scaler = new AutoScaler({
      minAgents: 1,
      maxAgents: 12,
      thresholds: { low: 30, medium: 70, high: 90 },
      poolManager
    });
  });

  test('should scale from task analysis to agent spawning', async () => {
    const task = {
      description: 'Build microservice with Redis caching and Kubernetes deployment',
      files: ['service.js', 'cache.js', 'k8s.yaml', 'tests/service.test.js'],
      dependencies: ['redis', 'kubernetes-client']
    };

    // 1. Detect complexity
    const complexityScore = detector.scoreTask(task);
    expect(complexityScore).toBeGreaterThan(60);

    // 2. Scale based on complexity
    task.complexityScore = complexityScore;
    const agents = await scaler.scaleForTask(task);

    // 3. Verify appropriate agent count
    expect(agents.length).toBeGreaterThanOrEqual(6);
  });

  test('should handle complexity changes dynamically', async () => {
    // Start with simple task
    const simpleTask = {
      description: 'Fix typo',
      files: ['README.md'],
      complexityScore: 15
    };

    await scaler.scaleForTask(simpleTask);
    const initialCount = scaler.getActiveAgentCount();

    // Complex task comes in
    const complexTask = {
      description: 'Refactor distributed architecture',
      files: Array(12).fill('service.js'),
      complexityScore: 88
    };

    await scaler.scaleForTask(complexTask);
    const scaledCount = scaler.getActiveAgentCount();

    expect(scaledCount).toBeGreaterThan(initialCount);
  });

  test('should maintain performance during scale operations', async () => {
    const tasks = [
      { complexityScore: 40 },
      { complexityScore: 75 },
      { complexityScore: 25 },
      { complexityScore: 90 }
    ];

    const startTime = Date.now();

    for (const task of tasks) {
      await scaler.scaleForTask(task);
    }

    const duration = Date.now() - startTime;

    // Scaling should be fast (<500ms per operation)
    expect(duration / tasks.length).toBeLessThan(500);
  });
});
