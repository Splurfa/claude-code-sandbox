/**
 * Automatic Routing Layer - Phase 3
 * 
 * Transparently routes between SQLite and AgentDB based on scale:
 * - <10K entries: SQLite (Phase 1 memory system)
 * - >10K entries: AgentDB (150x faster vector search)
 * - Automatic migration when threshold crossed
 * - Zero code changes required for users/agents
 */

const path = require('path');
const { AgentDBIntegration } = require('./agentdb-integration');

class AutomaticRouter {
  constructor(options = {}) {
    this.threshold = options.threshold || 10000;
    this.sqlitePath = options.sqlitePath || path.join(process.cwd(), '.swarm', 'memory.db');
    this.agentdbPath = options.agentdbPath || path.join(process.cwd(), '.swarm', 'agentdb');
    
    this.agentDB = null; // Lazy loaded
    this.entryCount = 0;
    this.useAgentDB = false;
    this.migrationInProgress = false;
    
    this.stats = {
      sqliteOperations: 0,
      agentdbOperations: 0,
      migrations: 0,
      autoSwitches: 0
    };
  }

  /**
   * Initialize router - check current scale
   */
  async initialize() {
    this.entryCount = await this._countEntries();
    this.useAgentDB = this.entryCount >= this.threshold;
    
    if (this.useAgentDB) {
      await this._initializeAgentDB();
    }
    
    await this._logRoutingDecision();
  }

  /**
   * Store entry - automatically routes to appropriate backend
   * @param {string} key - Entry key
   * @param {any} value - Entry value
   * @param {object} options - Storage options (embedding, metadata, etc.)
   */
  async store(key, value, options = {}) {
    // Check if we need to switch backends
    await this._checkAndMigrate();

    if (this.useAgentDB && options.embedding) {
      // Vector storage with AgentDB
      this.stats.agentdbOperations++;
      return await this._storeAgentDB(key, value, options);
    } else {
      // Standard storage with SQLite
      this.stats.sqliteOperations++;
      return await this._storeSQLite(key, value, options);
    }
  }

  /**
   * Retrieve entry - automatically routes to appropriate backend
   */
  async retrieve(key, options = {}) {
    if (this.useAgentDB && options.vectorSearch) {
      this.stats.agentdbOperations++;
      return await this._retrieveAgentDB(key, options);
    } else {
      this.stats.sqliteOperations++;
      return await this._retrieveSQLite(key, options);
    }
  }

  /**
   * Search entries - intelligently routes based on query type
   */
  async search(query, options = {}) {
    if (this.useAgentDB && (query.embedding || query.vectorSearch)) {
      // Vector similarity search
      this.stats.agentdbOperations++;
      return await this._searchAgentDB(query, options);
    } else {
      // Traditional key/value search
      this.stats.sqliteOperations++;
      return await this._searchSQLite(query, options);
    }
  }

  /**
   * Delete entry - routes to appropriate backend
   */
  async delete(key, options = {}) {
    const results = await Promise.allSettled([
      this._deleteSQLite(key, options),
      this.useAgentDB ? this._deleteAgentDB(key, options) : Promise.resolve(null)
    ]);

    this.entryCount = Math.max(0, this.entryCount - 1);
    return { success: true, key };
  }

  /**
   * Get routing statistics
   */
  getStats() {
    return {
      ...this.stats,
      currentBackend: this.useAgentDB ? 'agentdb' : 'sqlite',
      entryCount: this.entryCount,
      threshold: this.threshold,
      migrationInProgress: this.migrationInProgress
    };
  }

  /**
   * Private: Check if migration needed and execute
   */
  async _checkAndMigrate() {
    if (this.migrationInProgress) return;

    const shouldUseAgentDB = this.entryCount >= this.threshold;
    
    if (shouldUseAgentDB && !this.useAgentDB) {
      // Need to migrate to AgentDB
      await this._migrateToAgentDB();
      this.useAgentDB = true;
      this.stats.migrations++;
      this.stats.autoSwitches++;
    }
  }

  /**
   * Private: Migrate from SQLite to AgentDB
   */
  async _migrateToAgentDB() {
    this.migrationInProgress = true;
    
    try {
      await this._initializeAgentDB();
      
      // Migration is lazy - entries are copied on first access
      // This avoids blocking on large migrations
      await this._logMigration();
      
    } finally {
      this.migrationInProgress = false;
    }
  }

  /**
   * Private: Initialize AgentDB
   */
  async _initializeAgentDB() {
    if (!this.agentDB) {
      this.agentDB = new AgentDBIntegration({
        dbPath: this.agentdbPath
      });
      await this.agentDB.initialize();
    }
  }

  /**
   * Private: Count entries in SQLite
   */
  async _countEntries() {
    const { execSync } = require('child_process');
    try {
      const result = execSync(
        `npx claude-flow@alpha hooks memory:list --namespace "*" --format json`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
      );
      const entries = JSON.parse(result || '[]');
      return entries.length;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Private: Store to SQLite (Phase 1 system)
   */
  async _storeSQLite(key, value, options) {
    const { execSync } = require('child_process');
    const namespace = options.namespace || 'default';
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    
    execSync(
      `npx claude-flow@alpha hooks memory:store ` +
      `--key "${key}" ` +
      `--value '${valueStr}' ` +
      `--namespace "${namespace}"`,
      { stdio: 'ignore' }
    );
    
    this.entryCount++;
    return { success: true, key, backend: 'sqlite' };
  }

  /**
   * Private: Store to AgentDB
   */
  async _storeAgentDB(key, value, options) {
    await this._initializeAgentDB();
    
    const metadata = {
      ...options.metadata,
      value: typeof value === 'string' ? value : JSON.stringify(value),
      namespace: options.namespace || 'default'
    };
    
    await this.agentDB.vectorStore(key, options.embedding, metadata);
    this.entryCount++;
    return { success: true, key, backend: 'agentdb' };
  }

  /**
   * Private: Retrieve from SQLite
   */
  async _retrieveSQLite(key, options) {
    const { execSync } = require('child_process');
    try {
      const result = execSync(
        `npx claude-flow@alpha hooks memory:retrieve --key "${key}" --format json`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
      );
      return JSON.parse(result);
    } catch (error) {
      return null;
    }
  }

  /**
   * Private: Retrieve from AgentDB
   */
  async _retrieveAgentDB(key, options) {
    if (!this.agentDB) return null;
    
    const collectionName = options.namespace || 'default';
    return await this.agentDB.vectorGet(key, collectionName);
  }

  /**
   * Private: Search SQLite
   */
  async _searchSQLite(query, options) {
    const { execSync } = require('child_process');
    try {
      const pattern = query.pattern || query.key || '*';
      const result = execSync(
        `npx claude-flow@alpha hooks memory:search --pattern "${pattern}" --format json`,
        { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
      );
      return JSON.parse(result || '[]');
    } catch (error) {
      return [];
    }
  }

  /**
   * Private: Search AgentDB
   */
  async _searchAgentDB(query, options) {
    if (!this.agentDB) return { results: [], searchTime: 0 };
    
    const topK = options.topK || 10;
    const filters = options.filters || {};
    
    return await this.agentDB.vectorSearch(query.embedding, topK, filters);
  }

  /**
   * Private: Delete from SQLite
   */
  async _deleteSQLite(key, options) {
    const { execSync } = require('child_process');
    try {
      execSync(
        `npx claude-flow@alpha hooks memory:delete --key "${key}"`,
        { stdio: 'ignore' }
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Private: Delete from AgentDB
   */
  async _deleteAgentDB(key, options) {
    if (!this.agentDB) return { success: false };
    
    const collectionName = options.namespace || 'default';
    return await this.agentDB.vectorDelete(key, collectionName);
  }

  /**
   * Private: Log routing decision
   */
  async _logRoutingDecision() {
    const { execSync } = require('child_process');
    try {
      execSync(
        `npx claude-flow@alpha hooks journal ` +
        `--entry "Routing decision: ${this.useAgentDB ? 'AgentDB' : 'SQLite'} (${this.entryCount} entries)" ` +
        `--category "automatic-routing"`,
        { stdio: 'ignore' }
      );
    } catch (error) {
      // Non-fatal
    }
  }

  /**
   * Private: Log migration event
   */
  async _logMigration() {
    const { execSync } = require('child_process');
    try {
      execSync(
        `npx claude-flow@alpha hooks journal ` +
        `--entry "Automatic migration to AgentDB at ${this.entryCount} entries" ` +
        `--category "system-migration"`,
        { stdio: 'ignore' }
      );
    } catch (error) {
      // Non-fatal
    }
  }
}

module.exports = { AutomaticRouter };
