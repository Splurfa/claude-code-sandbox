#!/usr/bin/env node
/**
 * Memory-AgentDB Bridge
 *
 * Connects SQLite memory.db to AgentDB for vector operations
 * Stock-First: Uses sqlite3 CLI and agentdb CLI (no custom implementations)
 *
 * Purpose:
 * - Read memory entries from .swarm/memory.db
 * - Generate embeddings via AgentDB's Transformers.js
 * - Store episodes in AgentDB for semantic search
 * - Enable cross-session pattern learning
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const AgentDBWrapper = require('./agentdb-wrapper');

class MemoryAgentDBBridge {
  constructor(options = {}) {
    // Use project root for paths
    const projectRoot = options.projectRoot || this._findProjectRoot();
    this.memoryDbPath = options.memoryDbPath || path.join(projectRoot, '.swarm', 'memory.db');
    this.agentdb = new AgentDBWrapper({
      projectRoot,
      dbPath: options.agentdbPath || path.join(projectRoot, '.agentdb', 'reasoningbank.db')
    });

    // Verify memory.db exists
    if (!fs.existsSync(this.memoryDbPath)) {
      throw new Error(`Memory database not found at ${this.memoryDbPath}`);
    }
  }

  /**
   * Find project root by looking for .swarm or .agentdb directory
   */
  _findProjectRoot() {
    let dir = __dirname;
    while (dir !== path.dirname(dir)) {
      if (fs.existsSync(path.join(dir, '.swarm')) || fs.existsSync(path.join(dir, '.agentdb'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }
    return process.cwd();
  }

  /**
   * Initialize - no-op for CLI-based approach
   */
  async init() {
    // Verify database accessibility using sqlite3 CLI (stock tool)
    try {
      execSync(`sqlite3 "${this.memoryDbPath}" "SELECT COUNT(*) FROM memory_entries;"`, {
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return true;
    } catch (error) {
      throw new Error(`Cannot access memory.db: ${error.message}`);
    }
  }

  /**
   * Get memory entries from SQLite using CLI (stock sqlite3 command)
   */
  async getMemoryEntries(options = {}) {
    const namespace = options.namespace || 'default';
    const limit = options.limit || 100;

    const query = `
      SELECT id, key, value, namespace, metadata, created_at, accessed_at, access_count
      FROM memory_entries
      WHERE namespace = '${namespace}'
      ORDER BY accessed_at DESC
      LIMIT ${limit};
    `;

    try {
      const output = execSync(
        `sqlite3 -json "${this.memoryDbPath}" "${query}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );

      return JSON.parse(output || '[]');
    } catch (error) {
      console.error('Failed to get memory entries:', error.message);
      return [];
    }
  }

  /**
   * Sync memory entry to AgentDB as episode
   * Uses AgentDB's reflexion system for episodic memory
   */
  async syncEntryToAgentDB(entry) {
    try {
      const metadata = entry.metadata ? JSON.parse(entry.metadata) : {};

      // Create episode from memory entry
      const episode = {
        observation: entry.key,
        thought: entry.value.substring(0, 500), // First 500 chars
        action: `Retrieved from namespace: ${entry.namespace}`,
        reward: this._calculateReward(entry),
        metadata: {
          ...metadata,
          memory_id: entry.id,
          namespace: entry.namespace,
          created_at: entry.created_at,
          accessed_at: entry.accessed_at,
          source: 'memory.db'
        }
      };

      await this.agentdb.addEpisode(episode);
      return { success: true, episode };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Sync all recent memory entries to AgentDB
   */
  async syncRecentMemories(options = {}) {
    const entries = await this.getMemoryEntries(options);
    const results = {
      total: entries.length,
      synced: 0,
      failed: 0,
      errors: []
    };

    for (const entry of entries) {
      const result = await this.syncEntryToAgentDB(entry);
      if (result.success) {
        results.synced++;
      } else {
        results.failed++;
        results.errors.push({ entry: entry.key, error: result.error });
      }
    }

    return results;
  }

  /**
   * Search memory via AgentDB vector search
   */
  async searchMemorySemantica(query, options = {}) {
    return this.agentdb.searchEpisodes(query, options);
  }

  /**
   * Get patterns from memory.db using CLI (stock sqlite3 command)
   */
  async getPatterns(options = {}) {
    const limit = options.limit || 50;

    const query = `
      SELECT id, type, pattern_data, confidence, usage_count, created_at
      FROM patterns
      ORDER BY confidence DESC, usage_count DESC
      LIMIT ${limit};
    `;

    try {
      const output = execSync(
        `sqlite3 -json "${this.memoryDbPath}" "${query}"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );

      return JSON.parse(output || '[]');
    } catch (error) {
      console.error('Failed to get patterns:', error.message);
      return [];
    }
  }

  /**
   * Sync pattern to AgentDB as causal relationship
   */
  async syncPatternToAgentDB(pattern) {
    try {
      const patternData = JSON.parse(pattern.pattern_data);

      // If pattern has relationships, add as causal edges
      if (patternData.relations && Array.isArray(patternData.relations)) {
        for (const relation of patternData.relations) {
          await this.agentdb.addCausalEdge(
            pattern.id,
            relation.target,
            relation.weight || pattern.confidence,
            {
              type: pattern.type,
              created_at: pattern.created_at,
              source: 'memory.db'
            }
          );
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculate reward score for memory entry
   * Based on access patterns and recency
   */
  _calculateReward(entry) {
    const accessCount = entry.access_count || 0;
    const daysSinceAccess = (Date.now() / 1000 - entry.accessed_at) / 86400;

    // Higher reward for frequently accessed, recent memories
    const accessScore = Math.min(accessCount / 10, 0.5);
    const recencyScore = Math.max(0, 0.5 - daysSinceAccess / 30);

    return Math.min(accessScore + recencyScore, 1.0);
  }

  /**
   * Get bridge statistics
   */
  async getStats() {
    const [memoryCount, patternCount, agentdbStats] = await Promise.all([
      this._countMemoryEntries(),
      this._countPatterns(),
      Promise.resolve(this.agentdb.getStats())
    ]);

    return {
      memory_db: {
        entries: memoryCount,
        patterns: patternCount
      },
      agentdb: agentdbStats,
      bridge_version: '1.0.0-stock'
    };
  }

  /**
   * Count memory entries using CLI (stock sqlite3 command)
   */
  async _countMemoryEntries() {
    try {
      const output = execSync(
        `sqlite3 "${this.memoryDbPath}" "SELECT COUNT(*) FROM memory_entries;"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      return parseInt(output.trim()) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Count patterns using CLI (stock sqlite3 command)
   */
  async _countPatterns() {
    try {
      const output = execSync(
        `sqlite3 "${this.memoryDbPath}" "SELECT COUNT(*) FROM patterns;"`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      return parseInt(output.trim()) || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Close - no-op for CLI-based approach
   */
  async close() {
    // No persistent connection to close
    return true;
  }
}

module.exports = MemoryAgentDBBridge;

// CLI usage
if (require.main === module) {
  (async () => {
    const bridge = new MemoryAgentDBBridge();

    try {
      console.log('Memory-AgentDB Bridge - Stock-First Integration\n');

      await bridge.init();
      console.log('✅ Connected to memory.db\n');

      const stats = await bridge.getStats();
      console.log('📊 Bridge Statistics:');
      console.log('Memory DB:');
      console.log(`  Entries: ${stats.memory_db.entries}`);
      console.log(`  Patterns: ${stats.memory_db.patterns}`);
      console.log('\nAgentDB:');
      console.log(`  Episodes: ${stats.agentdb.episodes}`);
      console.log(`  Embeddings: ${stats.agentdb.embeddings}`);
      console.log(`  Causal Edges: ${stats.agentdb.causalEdges}`);

      await bridge.close();
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
}
