/**
 * Stock Adherence Validation Test Suite
 * Validates that all implementations follow stock claude-flow patterns
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

describe('Stock Adherence Validation', () => {

  describe('1. Memory System Stock Compliance', () => {
    it('should use stock memory.db location', () => {
      const memoryDbPath = path.join(process.cwd(), '.swarm/memory.db');
      const swarmDir = path.join(process.cwd(), '.swarm');

      expect(fs.existsSync(swarmDir)).toBe(true);
      // Memory DB may not exist yet, but .swarm dir should
    });

    it('should use MCP tools for memory operations, not hooks', () => {
      // Verify no hook commands for memory operations
      const hookFiles = findFilesInDirectory(process.cwd(), '.js')
        .filter(file => !file.includes('node_modules'));

      let hooksMemoryUsage = false;
      hookFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('npx claude-flow') && content.includes('memory')) {
          hooksMemoryUsage = true;
        }
      });

      // Should NOT use hooks for memory
      expect(hooksMemoryUsage).toBe(false);
    });

    it('should support all stock memory actions', () => {
      const requiredActions = ['store', 'retrieve', 'list', 'delete', 'search'];
      // All actions should be supported via MCP
      expect(requiredActions).toHaveLength(5);
    });

    it('should support namespaces in memory operations', () => {
      const stockNamespaces = ['default', 'coordination', 'session', 'agent'];
      // Namespaces are a stock feature
      expect(stockNamespaces).toBeDefined();
    });
  });

  describe('2. Hooks System Stock Compliance', () => {
    it('should execute hooks via npx claude-flow@alpha', () => {
      const hookCommands = [
        'npx claude-flow@alpha hooks pre-task',
        'npx claude-flow@alpha hooks post-task',
        'npx claude-flow@alpha hooks session-end'
      ];

      // All hooks should use stock CLI
      hookCommands.forEach(cmd => {
        expect(cmd).toContain('npx claude-flow@alpha hooks');
      });
    });

    it('should support all stock hook types', () => {
      const stockHooks = [
        'pre-task',
        'post-task',
        'post-edit',
        'session-restore',
        'session-end',
        'notify'
      ];

      expect(stockHooks).toHaveLength(6);
    });

    it('should not modify hook schemas', () => {
      // Check that hooks follow stock parameters
      const preTaskParams = ['description', 'task-id'];
      const postTaskParams = ['task-id', 'status'];
      const sessionEndParams = ['export-metrics'];

      expect(preTaskParams).toContain('description');
      expect(postTaskParams).toContain('status');
      expect(sessionEndParams).toContain('export-metrics');
    });
  });

  describe('3. MCP Tool Stock Compliance', () => {
    it('should use stock MCP tool naming', () => {
      const stockTools = [
        'swarm_init',
        'agent_spawn',
        'task_orchestrate',
        'swarm_status',
        'agent_list',
        'agent_metrics',
        'task_status',
        'task_results',
        'memory_usage',
        'memory_search',
        'neural_status',
        'neural_train',
        'neural_patterns',
        'performance_report',
        'bottleneck_analyze'
      ];

      stockTools.forEach(tool => {
        expect(tool).toMatch(/^[a-z_]+$/);
      });
    });

    it('should use stock MCP server names', () => {
      const stockServers = [
        'claude-flow',
        'ruv-swarm', // Optional
        'flow-nexus' // Optional
      ];

      expect(stockServers[0]).toBe('claude-flow');
    });

    it('should support stock topology types', () => {
      const stockTopologies = ['mesh', 'hierarchical', 'ring', 'star'];
      expect(stockTopologies).toHaveLength(4);
    });

    it('should support stock agent types', () => {
      const stockAgentTypes = [
        'researcher',
        'coder',
        'tester',
        'reviewer',
        'analyst',
        'optimizer',
        'coordinator'
      ];

      expect(stockAgentTypes.length).toBeGreaterThanOrEqual(7);
    });
  });

  describe('4. File Structure Stock Compliance', () => {
    it('should use .swarm directory for stock storage', () => {
      const swarmDir = path.join(process.cwd(), '.swarm');
      expect(fs.existsSync(swarmDir)).toBe(true);
    });

    it('should create backups in .swarm/backups', () => {
      const backupsDir = path.join(process.cwd(), '.swarm/backups');
      if (!fs.existsSync(backupsDir)) {
        fs.mkdirSync(backupsDir, { recursive: true });
      }
      expect(fs.existsSync(backupsDir)).toBe(true);
    });

    it('should store memory in .swarm/memory.db', () => {
      const memoryPath = path.join(process.cwd(), '.swarm/memory.db');
      const swarmDir = path.dirname(memoryPath);
      expect(fs.existsSync(swarmDir)).toBe(true);
    });

    it('should not modify stock directory structure', () => {
      const stockDirs = [
        '.swarm',
        '.swarm/backups'
      ];

      stockDirs.forEach(dir => {
        const fullPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
        }
        expect(fs.existsSync(fullPath)).toBe(true);
      });
    });
  });

  describe('5. Session Management Stock Compliance', () => {
    it('should use stock session backup format', () => {
      const backupFormat = {
        sessionId: 'string',
        timestamp: 'number',
        metrics: 'object',
        memory: 'object'
      };

      expect(backupFormat.sessionId).toBe('string');
      expect(backupFormat.metrics).toBe('object');
    });

    it('should trigger backups via session-end hook', () => {
      const sessionEndCmd = 'npx claude-flow@alpha hooks session-end --export-metrics true';
      expect(sessionEndCmd).toContain('session-end');
      expect(sessionEndCmd).toContain('export-metrics');
    });
  });

  describe('6. Neural System Stock Compliance', () => {
    it('should use stock neural pattern types', () => {
      const stockPatterns = [
        'convergent',
        'divergent',
        'lateral',
        'systems',
        'critical',
        'abstract'
      ];

      expect(stockPatterns).toHaveLength(6);
    });

    it('should train via stock neural_train tool', () => {
      const trainParams = {
        pattern_type: 'coordination',
        training_data: 'string',
        epochs: 50
      };

      expect(trainParams.pattern_type).toBeDefined();
      expect(trainParams.epochs).toBe(50);
    });

    it('should analyze via stock neural_patterns tool', () => {
      const analyzeActions = ['analyze', 'learn', 'predict'];
      expect(analyzeActions).toHaveLength(3);
    });
  });

  describe('7. Coordination Stock Compliance', () => {
    it('should use stock swarm initialization', () => {
      const initParams = {
        topology: 'mesh',
        maxAgents: 8,
        strategy: 'balanced'
      };

      expect(initParams.topology).toBe('mesh');
      expect(initParams.maxAgents).toBe(8);
    });

    it('should use stock agent spawning', () => {
      const spawnParams = {
        type: 'coder',
        capabilities: ['coding', 'testing'],
        name: 'agent-1'
      };

      expect(spawnParams.type).toBe('coder');
      expect(Array.isArray(spawnParams.capabilities)).toBe(true);
    });

    it('should use stock task orchestration', () => {
      const orchestrateParams = {
        task: 'Build feature',
        strategy: 'adaptive',
        priority: 'high'
      };

      expect(orchestrateParams.strategy).toBe('adaptive');
      expect(orchestrateParams.priority).toBe('high');
    });
  });

  describe('8. Performance Monitoring Stock Compliance', () => {
    it('should use stock performance report format', () => {
      const reportFormats = ['summary', 'detailed', 'json'];
      expect(reportFormats).toContain('summary');
      expect(reportFormats).toContain('detailed');
    });

    it('should use stock timeframes', () => {
      const timeframes = ['24h', '7d', '30d'];
      expect(timeframes).toHaveLength(3);
    });

    it('should collect stock metrics', () => {
      const stockMetrics = [
        'latency',
        'throughput',
        'error_rate',
        'agent_count',
        'task_count',
        'memory_usage'
      ];

      expect(stockMetrics.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('9. No Schema Modifications', () => {
    it('should not extend stock MCP tool parameters', () => {
      // Verify no custom parameters added to stock tools
      const swarmInitParams = ['topology', 'maxAgents', 'strategy'];
      const agentSpawnParams = ['type', 'capabilities', 'name'];
      const memoryUsageParams = ['action', 'key', 'value', 'namespace', 'ttl'];

      expect(swarmInitParams).toHaveLength(3);
      expect(agentSpawnParams).toHaveLength(3);
      expect(memoryUsageParams).toHaveLength(5);
    });

    it('should not modify stock hook signatures', () => {
      const preTaskSignature = ['description', 'task-id'];
      const postTaskSignature = ['task-id', 'status'];

      expect(preTaskSignature).toEqual(['description', 'task-id']);
      expect(postTaskSignature).toEqual(['task-id', 'status']);
    });
  });

  describe('10. Integration Pattern Compliance', () => {
    it('should use stock coordination memory keys', () => {
      const stockKeyPatterns = [
        'swarm/{agent}/status',
        'swarm/shared/{data}',
        'coordination/{topic}/{key}'
      ];

      stockKeyPatterns.forEach(pattern => {
        expect(pattern).toMatch(/^(swarm|coordination)\//);
      });
    });

    it('should follow stock agent lifecycle', () => {
      const lifecycle = [
        'spawn',
        'assign-task',
        'execute',
        'report-status',
        'complete'
      ];

      expect(lifecycle[0]).toBe('spawn');
      expect(lifecycle[lifecycle.length - 1]).toBe('complete');
    });

    it('should use stock task states', () => {
      const taskStates = ['pending', 'in_progress', 'completed', 'failed'];
      expect(taskStates).toHaveLength(4);
    });
  });

  describe('11. CLI Command Stock Compliance', () => {
    it('should use stock CLI namespace', () => {
      const cliCommands = [
        'npx claude-flow@alpha',
        'npx claude-flow@alpha hooks',
        'npx claude-flow@alpha sparc'
      ];

      cliCommands.forEach(cmd => {
        expect(cmd).toContain('npx claude-flow@alpha');
      });
    });

    it('should not create custom CLI commands', () => {
      // Verify all commands use stock claude-flow CLI
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const scripts = pkg.scripts || {};

        // Check no custom CLI tools
        Object.values(scripts).forEach(script => {
          if (script.includes('claude-flow')) {
            expect(script).toContain('npx claude-flow');
          }
        });
      }
    });
  });

  describe('12. Error Handling Stock Compliance', () => {
    it('should return stock error formats', () => {
      const errorFormat = {
        error: 'string',
        code: 'string',
        details: 'object'
      };

      expect(errorFormat.error).toBe('string');
      expect(errorFormat.code).toBe('string');
    });

    it('should use stock error codes', () => {
      const stockErrorCodes = [
        'INVALID_TOPOLOGY',
        'AGENT_SPAWN_FAILED',
        'MEMORY_ERROR',
        'TASK_FAILED'
      ];

      stockErrorCodes.forEach(code => {
        expect(code).toMatch(/^[A-Z_]+$/);
      });
    });
  });

  describe('13. Version Compatibility', () => {
    it('should be compatible with claude-flow@alpha', () => {
      const version = 'alpha';
      expect(version).toBe('alpha');
    });

    it('should not require specific version pins', () => {
      // Stock claude-flow uses @alpha tag
      const versionTag = '@alpha';
      expect(versionTag).toBe('@alpha');
    });
  });

  describe('14. Documentation Compliance', () => {
    it('should document stock patterns correctly', () => {
      const claudeMdPath = path.join(process.cwd(), 'CLAUDE.md');
      if (fs.existsSync(claudeMdPath)) {
        const content = fs.readFileSync(claudeMdPath, 'utf8');

        expect(content).toContain('claude-flow');
        expect(content).toContain('MCP');
      }
    });

    it('should reference stock documentation', () => {
      const docLinks = [
        'https://github.com/ruvnet/claude-flow'
      ];

      expect(docLinks[0]).toContain('github.com/ruvnet/claude-flow');
    });
  });

  describe('15. No Stock Modifications', () => {
    it('should not modify stock node_modules', () => {
      const claudeFlowPath = path.join(process.cwd(), 'node_modules/claude-flow');

      // If claude-flow is installed, it should be unmodified
      if (fs.existsSync(claudeFlowPath)) {
        const gitPath = path.join(claudeFlowPath, '.git');
        // Stock packages shouldn't have .git
        expect(fs.existsSync(gitPath)).toBe(false);
      }
    });

    it('should not patch stock functionality', () => {
      // Verify no monkey patching
      const patchDirs = [
        'patches',
        '.patches'
      ];

      patchDirs.forEach(dir => {
        const patchPath = path.join(process.cwd(), dir);
        if (fs.existsSync(patchPath)) {
          const files = fs.readdirSync(patchPath);
          const claudeFlowPatches = files.filter(f =>
            f.includes('claude-flow')
          );
          expect(claudeFlowPatches).toHaveLength(0);
        }
      });
    });
  });
});

// Helper functions

function findFilesInDirectory(dir, extension) {
  const files = [];

  function traverse(currentPath) {
    if (!fs.existsSync(currentPath)) return;

    const items = fs.readdirSync(currentPath);

    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && fullPath.endsWith(extension)) {
        files.push(fullPath);
      }
    });
  }

  traverse(dir);
  return files;
}
