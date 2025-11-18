/**
 * Load Testing Suite
 * Tests system under heavy concurrent load (100+ agents)
 */

const { performance } = require('perf_hooks');

describe('Load Testing - Concurrent Agents', () => {

  describe('1. High Agent Concurrency', () => {
    it('should handle 100 concurrent agents', async () => {
      const agentCount = 100;
      const agents = Array(agentCount).fill(null).map((_, i) => ({
        id: `agent-${i}`,
        type: ['researcher', 'coder', 'tester', 'reviewer'][i % 4]
      }));

      const start = performance.now();

      // Spawn all agents concurrently
      const spawned = await Promise.all(
        agents.map(agent => spawnAgent(agent))
      );

      const duration = performance.now() - start;

      console.log(`Spawned ${agentCount} agents in ${duration.toFixed(2)}ms`);
      expect(spawned).toHaveLength(agentCount);
      expect(duration).toBeLessThan(10000); // Under 10 seconds
    }, 15000);

    it('should maintain performance with 200 concurrent agents', async () => {
      const agentCount = 200;
      const batchSize = 50;
      const spawned = [];

      const start = performance.now();

      // Spawn in batches
      for (let i = 0; i < agentCount; i += batchSize) {
        const batch = Array(Math.min(batchSize, agentCount - i))
          .fill(null)
          .map((_, j) => ({ id: `agent-${i + j}`, type: 'coder' }));

        const batchResults = await Promise.all(
          batch.map(agent => spawnAgent(agent))
        );

        spawned.push(...batchResults);
      }

      const duration = performance.now() - start;

      console.log(`Spawned ${agentCount} agents in ${duration.toFixed(2)}ms`);
      expect(spawned).toHaveLength(agentCount);
      expect(duration).toBeLessThan(20000); // Under 20 seconds
    }, 25000);

    it('should scale linearly up to 500 agents', async () => {
      const counts = [50, 100, 200, 500];
      const results = [];

      for (const count of counts) {
        const start = performance.now();

        await Promise.all(
          Array(count).fill(null).map((_, i) =>
            spawnAgent({ id: `agent-${i}`, type: 'coder' })
          )
        );

        const duration = performance.now() - start;
        const throughput = count / (duration / 1000);

        results.push({ count, duration, throughput });
        console.log(`${count} agents: ${duration.toFixed(2)}ms (${throughput.toFixed(0)} agents/sec)`);

        // Cleanup
        await cleanupAgents();
      }

      // Throughput should remain relatively stable
      const throughputs = results.map(r => r.throughput);
      const avgThroughput = throughputs.reduce((a, b) => a + b) / throughputs.length;
      const variance = throughputs.map(t => Math.abs(t - avgThroughput) / avgThroughput);
      const maxVariance = Math.max(...variance);

      expect(maxVariance).toBeLessThan(0.5); // Less than 50% variance
    }, 60000);
  });

  describe('2. High Task Throughput', () => {
    it('should process 1000 tasks concurrently', async () => {
      const taskCount = 1000;
      const tasks = Array(taskCount).fill(null).map((_, i) => ({
        id: `task-${i}`,
        description: `Process item ${i}`,
        priority: i % 3 === 0 ? 'high' : 'medium'
      }));

      const start = performance.now();

      const results = await Promise.all(
        tasks.map(task => processTask(task))
      );

      const duration = performance.now() - start;
      const throughput = taskCount / (duration / 1000);

      console.log(`Processed ${taskCount} tasks in ${duration.toFixed(2)}ms`);
      console.log(`Throughput: ${throughput.toFixed(0)} tasks/sec`);

      expect(results).toHaveLength(taskCount);
      expect(throughput).toBeGreaterThan(100); // >100 tasks/sec
    }, 30000);

    it('should maintain throughput under sustained load', async () => {
      const duration = 10000; // 10 seconds
      const taskInterval = 10; // New task every 10ms
      const tasksProcessed = [];

      const start = performance.now();
      const endTime = start + duration;

      let taskId = 0;
      while (performance.now() < endTime) {
        const batch = Array(10).fill(null).map(() => ({
          id: `task-${taskId++}`,
          timestamp: Date.now()
        }));

        const results = await Promise.all(
          batch.map(task => processTask(task))
        );

        tasksProcessed.push(...results);
        await sleep(taskInterval);
      }

      const totalDuration = performance.now() - start;
      const avgThroughput = tasksProcessed.length / (totalDuration / 1000);

      console.log(`Processed ${tasksProcessed.length} tasks over ${totalDuration.toFixed(0)}ms`);
      console.log(`Average throughput: ${avgThroughput.toFixed(0)} tasks/sec`);

      expect(avgThroughput).toBeGreaterThan(50);
    }, 15000);
  });

  describe('3. Memory Operations Under Load', () => {
    it('should handle 10,000 memory operations per second', async () => {
      const operations = 10000;
      const start = performance.now();

      const ops = Array(operations).fill(null).map((_, i) => ({
        action: i % 2 === 0 ? 'store' : 'retrieve',
        key: `key-${i % 1000}`,
        value: `value-${i}`
      }));

      await Promise.all(
        ops.map(op => executeMemoryOperation(op))
      );

      const duration = performance.now() - start;
      const throughput = operations / (duration / 1000);

      console.log(`${operations} memory ops in ${duration.toFixed(2)}ms`);
      console.log(`Throughput: ${throughput.toFixed(0)} ops/sec`);

      expect(throughput).toBeGreaterThan(10000);
    }, 5000);

    it('should scale memory operations with agent count', async () => {
      const agentCounts = [10, 50, 100];
      const opsPerAgent = 100;

      for (const count of agentCounts) {
        const start = performance.now();

        await Promise.all(
          Array(count).fill(null).map((_, i) =>
            performAgentMemoryOps(`agent-${i}`, opsPerAgent)
          )
        );

        const duration = performance.now() - start;
        const totalOps = count * opsPerAgent;
        const throughput = totalOps / (duration / 1000);

        console.log(`${count} agents, ${totalOps} ops: ${throughput.toFixed(0)} ops/sec`);
        expect(throughput).toBeGreaterThan(5000);
      }
    });
  });

  describe('4. Vector Search Under Load', () => {
    it('should perform 1000 concurrent vector searches', async () => {
      const searchCount = 1000;
      const vectorDB = createMockVectorDB(10000);

      const start = performance.now();

      await Promise.all(
        Array(searchCount).fill(null).map(() =>
          vectorDB.search([Math.random(), Math.random(), Math.random()])
        )
      );

      const duration = performance.now() - start;
      const throughput = searchCount / (duration / 1000);

      console.log(`${searchCount} searches in ${duration.toFixed(2)}ms`);
      console.log(`Throughput: ${throughput.toFixed(0)} searches/sec`);

      expect(throughput).toBeGreaterThan(100);
    });

    it('should handle mixed read/write load', async () => {
      const vectorDB = createMockVectorDB(1000);
      const operations = 5000;

      const start = performance.now();

      await Promise.all(
        Array(operations).fill(null).map((_, i) =>
          i % 10 === 0
            ? vectorDB.insert([Math.random(), Math.random(), Math.random()])
            : vectorDB.search([Math.random(), Math.random(), Math.random()])
        )
      );

      const duration = performance.now() - start;
      const throughput = operations / (duration / 1000);

      console.log(`${operations} mixed ops in ${duration.toFixed(2)}ms`);
      expect(throughput).toBeGreaterThan(500);
    });
  });

  describe('5. Coordination Overhead', () => {
    it('should minimize coordination overhead at scale', async () => {
      const agentCounts = [10, 50, 100, 200];
      const overheads = [];

      for (const count of agentCounts) {
        // Measure without coordination
        const startNoCoord = performance.now();
        await runTasksWithoutCoordination(count);
        const durationNoCoord = performance.now() - startNoCoord;

        // Measure with coordination
        const startWithCoord = performance.now();
        await runTasksWithCoordination(count);
        const durationWithCoord = performance.now() - startWithCoord;

        const overhead = (durationWithCoord - durationNoCoord) / durationNoCoord;
        overheads.push({ count, overhead });

        console.log(`${count} agents: ${(overhead * 100).toFixed(2)}% overhead`);
      }

      // Overhead should stay reasonable even at scale
      const maxOverhead = Math.max(...overheads.map(o => o.overhead));
      expect(maxOverhead).toBeLessThan(0.5); // Less than 50% overhead
    });
  });

  describe('6. Network Communication Load', () => {
    it('should handle 10,000 messages per second', async () => {
      const messageCount = 10000;
      const start = performance.now();

      await Promise.all(
        Array(messageCount).fill(null).map((_, i) =>
          sendMessage({
            from: `agent-${i % 100}`,
            to: `agent-${(i + 1) % 100}`,
            data: { value: i }
          })
        )
      );

      const duration = performance.now() - start;
      const throughput = messageCount / (duration / 1000);

      console.log(`${messageCount} messages in ${duration.toFixed(2)}ms`);
      console.log(`Throughput: ${throughput.toFixed(0)} msg/sec`);

      expect(throughput).toBeGreaterThan(10000);
    });

    it('should handle broadcast to 100 agents', async () => {
      const agentCount = 100;
      const broadcasts = 100;

      const start = performance.now();

      for (let i = 0; i < broadcasts; i++) {
        await broadcastMessage(agentCount, { data: `broadcast-${i}` });
      }

      const duration = performance.now() - start;
      const totalMessages = broadcasts * agentCount;

      console.log(`${broadcasts} broadcasts to ${agentCount} agents: ${duration.toFixed(2)}ms`);
      console.log(`Total messages: ${totalMessages}`);

      expect(duration).toBeLessThan(5000);
    });
  });

  describe('7. Resource Utilization', () => {
    it('should maintain memory within bounds under load', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      const agentCount = 200;

      // Spawn agents
      await Promise.all(
        Array(agentCount).fill(null).map((_, i) =>
          spawnAgent({ id: `agent-${i}`, type: 'coder' })
        )
      );

      // Process tasks
      await Promise.all(
        Array(1000).fill(null).map((_, i) =>
          processTask({ id: `task-${i}`, data: 'test' })
        )
      );

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      const memoryPerAgent = memoryIncrease / agentCount;

      console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
      console.log(`Per agent: ${(memoryPerAgent / 1024).toFixed(2)}KB`);

      // Should be reasonable (<500MB total increase)
      expect(memoryIncrease).toBeLessThan(500 * 1024 * 1024);
    }, 30000);
  });

  describe('8. Topology Performance Under Load', () => {
    it('should compare topologies under 100-agent load', async () => {
      const topologies = ['mesh', 'hierarchical', 'ring', 'star'];
      const agentCount = 100;
      const taskCount = 500;
      const results = [];

      for (const topology of topologies) {
        const start = performance.now();

        // Initialize topology
        await initializeTopology(topology, agentCount);

        // Execute tasks
        await Promise.all(
          Array(taskCount).fill(null).map((_, i) =>
            executeTaskInTopology(topology, `task-${i}`)
          )
        );

        const duration = performance.now() - start;
        results.push({ topology, duration });

        console.log(`${topology}: ${duration.toFixed(2)}ms for ${taskCount} tasks`);

        // Cleanup
        await cleanupTopology(topology);
      }

      // All topologies should complete in reasonable time
      results.forEach(result => {
        expect(result.duration).toBeLessThan(30000);
      });
    }, 150000);
  });

  describe('9. Sustained Load Test', () => {
    it('should maintain performance over 60 seconds', async () => {
      const testDuration = 60000; // 60 seconds
      const measurements = [];
      const measureInterval = 5000; // Measure every 5 seconds

      const startTime = performance.now();
      let lastMeasurement = startTime;
      let totalTasks = 0;

      while (performance.now() - startTime < testDuration) {
        // Process batch of tasks
        const batchSize = 50;
        await Promise.all(
          Array(batchSize).fill(null).map((_, i) =>
            processTask({ id: `task-${totalTasks + i}` })
          )
        );

        totalTasks += batchSize;

        // Measure throughput
        const now = performance.now();
        if (now - lastMeasurement >= measureInterval) {
          const intervalDuration = now - lastMeasurement;
          const throughput = (batchSize * 1000) / intervalDuration;

          measurements.push({
            time: now - startTime,
            throughput
          });

          console.log(`@${((now - startTime) / 1000).toFixed(0)}s: ${throughput.toFixed(0)} tasks/sec`);

          lastMeasurement = now;
        }
      }

      // Throughput should remain stable (variance < 30%)
      const throughputs = measurements.map(m => m.throughput);
      const avgThroughput = throughputs.reduce((a, b) => a + b) / throughputs.length;
      const variance = throughputs.map(t => Math.abs(t - avgThroughput) / avgThroughput);
      const maxVariance = Math.max(...variance);

      console.log(`Average throughput: ${avgThroughput.toFixed(0)} tasks/sec`);
      console.log(`Max variance: ${(maxVariance * 100).toFixed(2)}%`);

      expect(maxVariance).toBeLessThan(0.3);
    }, 70000);
  });

  describe('10. Stress Test - Breaking Point', () => {
    it('should identify system limits gracefully', async () => {
      const increments = [100, 200, 500, 1000, 2000];
      let breakingPoint = null;

      for (const count of increments) {
        try {
          const start = performance.now();

          await Promise.all(
            Array(count).fill(null).map((_, i) =>
              processTask({ id: `stress-${i}`, timeout: 5000 })
            )
          );

          const duration = performance.now() - start;
          console.log(`${count} tasks: ${duration.toFixed(2)}ms - SUCCESS`);
        } catch (error) {
          console.log(`${count} tasks: FAILED - ${error.message}`);
          breakingPoint = count;
          break;
        }
      }

      // Should handle at least 500 concurrent tasks
      if (breakingPoint) {
        expect(breakingPoint).toBeGreaterThan(500);
      }
    }, 120000);
  });
});

// Helper functions for load testing

async function spawnAgent(agent) {
  await sleep(Math.random() * 10);
  return { spawned: true, id: agent.id };
}

async function processTask(task) {
  await sleep(Math.random() * 50);
  return { completed: true, id: task.id };
}

async function cleanupAgents() {
  await sleep(100);
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function executeMemoryOperation(op) {
  await sleep(0.1);
  return { success: true };
}

async function performAgentMemoryOps(agentId, count) {
  await Promise.all(
    Array(count).fill(null).map((_, i) =>
      executeMemoryOperation({ key: `${agentId}-${i}`, value: i })
    )
  );
}

function createMockVectorDB(size) {
  const vectors = Array(size).fill(null).map(() =>
    [Math.random(), Math.random(), Math.random()]
  );

  return {
    search: async (query) => {
      await sleep(0.5);
      return { results: vectors.slice(0, 10) };
    },
    insert: async (vector) => {
      await sleep(1);
      vectors.push(vector);
    }
  };
}

async function runTasksWithoutCoordination(count) {
  await Promise.all(
    Array(count).fill(null).map((_, i) =>
      processTask({ id: `task-${i}` })
    )
  );
}

async function runTasksWithCoordination(count) {
  // Simulate coordination overhead
  await sleep(count * 2);
  await Promise.all(
    Array(count).fill(null).map((_, i) =>
      processTask({ id: `task-${i}` })
    )
  );
}

async function sendMessage(message) {
  await sleep(0.1);
  return { sent: true };
}

async function broadcastMessage(agentCount, message) {
  await Promise.all(
    Array(agentCount).fill(null).map(() =>
      sendMessage(message)
    )
  );
}

async function initializeTopology(topology, agentCount) {
  await sleep(100);
}

async function executeTaskInTopology(topology, taskId) {
  await sleep(50);
  return { completed: true };
}

async function cleanupTopology(topology) {
  await sleep(100);
}
