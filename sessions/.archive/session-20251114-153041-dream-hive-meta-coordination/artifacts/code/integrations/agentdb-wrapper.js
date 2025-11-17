#!/usr/bin/env node
/**
 * AgentDB Wrapper - Thin integration layer for AgentDB vector database
 *
 * Stock-First Design:
 * - Uses official agentdb CLI commands (95% stock)
 * - Minimal wrapper for JavaScript API (5% glue code)
 * - No custom vector search implementation
 * - No custom embedding logic (uses Transformers.js from agentdb)
 *
 * Purpose: Bridge between Node.js code and agentdb CLI
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

class AgentDBWrapper {
  constructor(options = {}) {
    // Use project root for .agentdb path, not relative to this file
    const projectRoot = options.projectRoot || this._findProjectRoot();
    this.dbPath = options.dbPath || path.join(projectRoot, '.agentdb', 'reasoningbank.db');
    this.dimension = options.dimension || 1536;
    this.cliPath = 'npx';
    this.cliArgs = ['agentdb@latest'];

    // Verify database exists
    if (!fs.existsSync(this.dbPath)) {
      throw new Error(`AgentDB not found at ${this.dbPath}. Run: npx agentdb@latest init ${this.dbPath}`);
    }
  }

  /**
   * Find project root by looking for .agentdb directory
   */
  _findProjectRoot() {
    let dir = __dirname;
    while (dir !== path.dirname(dir)) {
      if (fs.existsSync(path.join(dir, '.agentdb'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }
    // Fallback to current working directory
    return process.cwd();
  }

  /**
   * Execute agentdb CLI command (stock API)
   */
  _exec(command, args = [], options = {}) {
    const fullArgs = [...this.cliArgs, command, ...args];
    try {
      const result = execSync(`${this.cliPath} ${fullArgs.join(' ')}`, {
        encoding: 'utf8',
        stdio: options.silent ? 'pipe' : 'inherit',
        ...options
      });
      return result;
    } catch (error) {
      throw new Error(`AgentDB command failed: ${error.message}`);
    }
  }

  /**
   * Get database statistics (stock CLI: agentdb stats)
   */
  getStats() {
    try {
      const output = this._exec('stats', [this.dbPath], { silent: true });
      return this._parseStats(output);
    } catch (error) {
      console.error('Failed to get stats:', error.message);
      return null;
    }
  }

  /**
   * Add episode to database (stock CLI: agentdb reflexion store)
   */
  async addEpisode(episode) {
    const { observation, thought, action, reward, metadata = {} } = episode;

    // Use reflexion store: agentdb reflexion store <session-id> <task> <reward> <success> [critique]
    const sessionId = metadata.session_id || `session-${Date.now()}`;
    const task = observation;
    const success = reward >= 0.5 ? 'true' : 'false';
    const critique = thought || action;

    const args = [
      sessionId,
      task,
      reward.toString(),
      success,
      critique
    ];

    try {
      return this._exec('reflexion', ['store', ...args]);
    } catch (error) {
      console.error('Failed to store episode:', error.message);
      return null;
    }
  }

  /**
   * Search episodes (stock CLI: agentdb reflexion retrieve)
   */
  async searchEpisodes(query, options = {}) {
    const limit = options.limit || 10;
    const args = [query];

    if (limit) {
      args.push('--k', limit.toString());
    }

    if (options.minReward !== undefined) {
      args.push('--min-reward', options.minReward.toString());
    }

    try {
      const output = this._exec('reflexion', ['retrieve', ...args], { silent: true });
      return this._parseSearchResults(output);
    } catch (error) {
      console.error('Failed to search episodes:', error.message);
      return { results: [], count: 0 };
    }
  }

  /**
   * Add causal edge (stock CLI: agentdb causal add)
   */
  async addCausalEdge(from, to, weight = 1.0, metadata = {}) {
    const args = [
      '--db', this.dbPath,
      '--from', from,
      '--to', to,
      '--weight', weight.toString(),
      '--metadata', JSON.stringify(metadata)
    ];

    return this._exec('causal', ['add', ...args]);
  }

  /**
   * Query causal graph (stock CLI: agentdb causal query)
   */
  async queryCausalGraph(node, options = {}) {
    const args = [
      '--db', this.dbPath,
      '--node', node
    ];

    if (options.depth !== undefined) {
      args.push('--depth', options.depth.toString());
    }

    const output = this._exec('causal', ['query', ...args], { silent: true });
    return this._parseCausalResults(output);
  }

  /**
   * Export database (stock CLI: agentdb export)
   */
  async export(outputPath) {
    return this._exec('export', [this.dbPath, outputPath]);
  }

  /**
   * Import data (stock CLI: agentdb import)
   */
  async import(inputPath) {
    return this._exec('import', [inputPath, '--db', this.dbPath]);
  }

  /**
   * Parse stats output (minimal parsing logic)
   */
  _parseStats(output) {
    const stats = {
      episodes: 0,
      embeddings: 0,
      skills: 0,
      causalEdges: 0,
      avgReward: 0
    };

    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('Episodes:')) {
        stats.episodes = parseInt(line.split(':')[1].trim()) || 0;
      } else if (line.includes('Embeddings:')) {
        stats.embeddings = parseInt(line.split(':')[1].trim()) || 0;
      } else if (line.includes('Skills:')) {
        stats.skills = parseInt(line.split(':')[1].trim()) || 0;
      } else if (line.includes('Causal Edges:')) {
        stats.causalEdges = parseInt(line.split(':')[1].trim()) || 0;
      } else if (line.includes('Average Reward:')) {
        stats.avgReward = parseFloat(line.split(':')[1].trim()) || 0;
      }
    }

    return stats;
  }

  /**
   * Parse search results (minimal parsing logic)
   */
  _parseSearchResults(output) {
    // AgentDB returns JSON for search results
    try {
      return JSON.parse(output);
    } catch {
      // Fallback to empty results
      return { results: [], count: 0 };
    }
  }

  /**
   * Parse causal graph results (minimal parsing logic)
   */
  _parseCausalResults(output) {
    try {
      return JSON.parse(output);
    } catch {
      return { nodes: [], edges: [] };
    }
  }
}

module.exports = AgentDBWrapper;

// CLI usage example
if (require.main === module) {
  const db = new AgentDBWrapper();

  console.log('AgentDB Wrapper - Stock-First Integration');
  console.log('Database:', db.dbPath);
  console.log('\nStatistics:');
  console.log(db.getStats());
}
