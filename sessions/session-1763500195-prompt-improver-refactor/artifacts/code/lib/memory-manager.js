/**
 * Memory Manager Module
 *
 * Handles memory operations with MCP integration for cross-agent coordination.
 * Provides persistent storage, retrieval, and search functionality.
 */

class MemoryManager {
  constructor(config = {}) {
    this.config = config;
    this.namespace = config.memoryNamespace || 'prompt-improver';
    this.mcpAvailable = this._checkMCPAvailability();

    // In-memory fallback cache
    this.fallbackCache = new Map();

    // Track operation statistics
    this.stats = {
      stores: 0,
      retrieves: 0,
      searches: 0,
      deletes: 0,
      errors: 0,
      mcpUnavailable: 0
    };
  }

  /**
   * Store data in memory
   * @param {string} key - Storage key
   * @param {any} value - Data to store (will be JSON stringified if object)
   * @param {string} namespace - Optional namespace (defaults to config namespace)
   * @returns {Promise<object>} Operation result
   */
  async store(key, value, namespace = null) {
    const ns = namespace || this.namespace;
    const storageKey = `${ns}/${key}`;

    try {
      // Serialize value if object
      const serializedValue = typeof value === 'object'
        ? JSON.stringify(value)
        : String(value);

      // Try MCP first
      if (this.mcpAvailable) {
        try {
          // In real implementation, would use MCP tool
          // For now, simulate MCP store
          const result = await this._mcpStore(storageKey, serializedValue, ns);

          this.stats.stores++;

          return {
            success: true,
            key: storageKey,
            namespace: ns,
            method: 'mcp',
            timestamp: Date.now()
          };
        } catch (mcpError) {
          console.warn('[MemoryManager] MCP store failed, falling back to cache:', mcpError.message);
          this.stats.mcpUnavailable++;
        }
      }

      // Fallback to in-memory cache
      this.fallbackCache.set(storageKey, {
        value: serializedValue,
        timestamp: Date.now(),
        namespace: ns
      });

      this.stats.stores++;

      return {
        success: true,
        key: storageKey,
        namespace: ns,
        method: 'fallback',
        warning: 'Using in-memory fallback, data not persisted',
        timestamp: Date.now()
      };

    } catch (error) {
      this.stats.errors++;
      console.error('[MemoryManager] Store error:', error.message);

      return {
        success: false,
        key: storageKey,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Retrieve data from memory
   * @param {string} key - Storage key
   * @param {string} namespace - Optional namespace
   * @returns {Promise<object>} Retrieved data or null
   */
  async retrieve(key, namespace = null) {
    const ns = namespace || this.namespace;
    const storageKey = `${ns}/${key}`;

    try {
      // Try MCP first
      if (this.mcpAvailable) {
        try {
          const result = await this._mcpRetrieve(storageKey, ns);

          this.stats.retrieves++;

          if (result && result.value) {
            // Try to parse as JSON, fallback to raw value
            try {
              return {
                success: true,
                key: storageKey,
                value: JSON.parse(result.value),
                found: true,
                method: 'mcp',
                timestamp: Date.now()
              };
            } catch {
              return {
                success: true,
                key: storageKey,
                value: result.value,
                found: true,
                method: 'mcp',
                timestamp: Date.now()
              };
            }
          }
        } catch (mcpError) {
          console.warn('[MemoryManager] MCP retrieve failed, checking fallback:', mcpError.message);
          this.stats.mcpUnavailable++;
        }
      }

      // Check fallback cache
      const cached = this.fallbackCache.get(storageKey);

      this.stats.retrieves++;

      if (cached) {
        try {
          return {
            success: true,
            key: storageKey,
            value: JSON.parse(cached.value),
            found: true,
            method: 'fallback',
            cachedAt: cached.timestamp,
            timestamp: Date.now()
          };
        } catch {
          return {
            success: true,
            key: storageKey,
            value: cached.value,
            found: true,
            method: 'fallback',
            cachedAt: cached.timestamp,
            timestamp: Date.now()
          };
        }
      }

      return {
        success: true,
        key: storageKey,
        value: null,
        found: false,
        timestamp: Date.now()
      };

    } catch (error) {
      this.stats.errors++;
      console.error('[MemoryManager] Retrieve error:', error.message);

      return {
        success: false,
        key: storageKey,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Search memory with pattern
   * @param {string} pattern - Search pattern (supports SQL LIKE syntax)
   * @param {string} namespace - Optional namespace
   * @returns {Promise<object>} Search results
   */
  async search(pattern, namespace = null) {
    const ns = namespace || this.namespace;

    try {
      // Try MCP first
      if (this.mcpAvailable) {
        try {
          const results = await this._mcpSearch(pattern, ns);

          this.stats.searches++;

          return {
            success: true,
            pattern,
            namespace: ns,
            results,
            count: results.length,
            method: 'mcp',
            timestamp: Date.now()
          };
        } catch (mcpError) {
          console.warn('[MemoryManager] MCP search failed, searching fallback:', mcpError.message);
          this.stats.mcpUnavailable++;
        }
      }

      // Search fallback cache
      const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i');
      const results = [];

      for (const [key, data] of this.fallbackCache.entries()) {
        if (data.namespace === ns && regex.test(key)) {
          try {
            results.push({
              key,
              value: JSON.parse(data.value),
              timestamp: data.timestamp
            });
          } catch {
            results.push({
              key,
              value: data.value,
              timestamp: data.timestamp
            });
          }
        }
      }

      this.stats.searches++;

      return {
        success: true,
        pattern,
        namespace: ns,
        results,
        count: results.length,
        method: 'fallback',
        timestamp: Date.now()
      };

    } catch (error) {
      this.stats.errors++;
      console.error('[MemoryManager] Search error:', error.message);

      return {
        success: false,
        pattern,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * List all entries in a namespace
   * @param {string} namespace - Optional namespace
   * @returns {Promise<object>} List of entries
   */
  async list(namespace = null) {
    const ns = namespace || this.namespace;

    try {
      // Try MCP first
      if (this.mcpAvailable) {
        try {
          const results = await this._mcpList(ns);

          return {
            success: true,
            namespace: ns,
            entries: results,
            count: results.length,
            method: 'mcp',
            timestamp: Date.now()
          };
        } catch (mcpError) {
          console.warn('[MemoryManager] MCP list failed, listing fallback:', mcpError.message);
          this.stats.mcpUnavailable++;
        }
      }

      // List from fallback cache
      const entries = [];

      for (const [key, data] of this.fallbackCache.entries()) {
        if (data.namespace === ns) {
          try {
            entries.push({
              key,
              value: JSON.parse(data.value),
              timestamp: data.timestamp
            });
          } catch {
            entries.push({
              key,
              value: data.value,
              timestamp: data.timestamp
            });
          }
        }
      }

      return {
        success: true,
        namespace: ns,
        entries,
        count: entries.length,
        method: 'fallback',
        timestamp: Date.now()
      };

    } catch (error) {
      this.stats.errors++;
      console.error('[MemoryManager] List error:', error.message);

      return {
        success: false,
        namespace: ns,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Delete entry from memory
   * @param {string} key - Storage key
   * @param {string} namespace - Optional namespace
   * @returns {Promise<object>} Operation result
   */
  async delete(key, namespace = null) {
    const ns = namespace || this.namespace;
    const storageKey = `${ns}/${key}`;

    try {
      // Try MCP first
      if (this.mcpAvailable) {
        try {
          await this._mcpDelete(storageKey, ns);

          this.stats.deletes++;

          return {
            success: true,
            key: storageKey,
            namespace: ns,
            method: 'mcp',
            timestamp: Date.now()
          };
        } catch (mcpError) {
          console.warn('[MemoryManager] MCP delete failed, deleting from fallback:', mcpError.message);
          this.stats.mcpUnavailable++;
        }
      }

      // Delete from fallback cache
      const existed = this.fallbackCache.delete(storageKey);

      this.stats.deletes++;

      return {
        success: true,
        key: storageKey,
        namespace: ns,
        existed,
        method: 'fallback',
        timestamp: Date.now()
      };

    } catch (error) {
      this.stats.errors++;
      console.error('[MemoryManager] Delete error:', error.message);

      return {
        success: false,
        key: storageKey,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Get baseline patterns for a mode (helper method)
   * @param {string} mode - Execution mode (direct, swarm, hive, wizard)
   * @returns {Promise<object>} Baseline patterns
   */
  async getBaselinePatterns(mode) {
    const result = await this.retrieve(`patterns/${mode}`);

    if (result.found && result.value) {
      return result.value;
    }

    // Return default baseline patterns
    const defaults = {
      direct: {
        structure: ['goal', 'constraints', 'deliverables'],
        clarity: ['specific', 'actionable'],
        fileRouting: 'sessions/$SESSION_ID/artifacts/'
      },
      swarm: {
        structure: ['goal', 'agents', 'coordination'],
        coordination: ['topology', 'memory', 'parallel execution'],
        fileRouting: 'sessions/$SESSION_ID/artifacts/'
      },
      hive: {
        structure: ['goal', 'queen', 'consensus'],
        coordination: ['hierarchical', 'voting', 'memory'],
        fileRouting: 'sessions/$SESSION_ID/artifacts/'
      },
      wizard: {
        structure: ['high-level goal'],
        guidance: ['interactive', 'step-by-step'],
        fileRouting: 'sessions/$SESSION_ID/artifacts/'
      }
    };

    return defaults[mode] || defaults.direct;
  }

  /**
   * Get operation statistics
   * @returns {object} Statistics
   */
  getStats() {
    return {
      ...this.stats,
      mcpAvailable: this.mcpAvailable,
      fallbackCacheSize: this.fallbackCache.size
    };
  }

  /**
   * Clear fallback cache
   */
  clearFallbackCache() {
    this.fallbackCache.clear();
  }

  // ============================================================================
  // Private MCP Integration Methods
  // ============================================================================

  /**
   * Check if MCP is available
   * @private
   */
  _checkMCPAvailability() {
    // In real implementation, would check for MCP tool availability
    // For now, return false to use fallback (will be integrated with actual MCP)
    return false;
  }

  /**
   * MCP store operation
   * @private
   */
  async _mcpStore(key, value, namespace) {
    // Placeholder for actual MCP integration
    // Would call: mcp__claude-flow_alpha__memory_usage({ action: "store", key, value, namespace })
    throw new Error('MCP not available');
  }

  /**
   * MCP retrieve operation
   * @private
   */
  async _mcpRetrieve(key, namespace) {
    // Placeholder for actual MCP integration
    // Would call: mcp__claude-flow_alpha__memory_usage({ action: "retrieve", key, namespace })
    throw new Error('MCP not available');
  }

  /**
   * MCP search operation
   * @private
   */
  async _mcpSearch(pattern, namespace) {
    // Placeholder for actual MCP integration
    // Would call: mcp__claude-flow_alpha__memory_usage({ action: "search", pattern, namespace })
    throw new Error('MCP not available');
  }

  /**
   * MCP list operation
   * @private
   */
  async _mcpList(namespace) {
    // Placeholder for actual MCP integration
    // Would call: mcp__claude-flow_alpha__memory_usage({ action: "list", namespace })
    throw new Error('MCP not available');
  }

  /**
   * MCP delete operation
   * @private
   */
  async _mcpDelete(key, namespace) {
    // Placeholder for actual MCP integration
    // Would call: mcp__claude-flow_alpha__memory_usage({ action: "delete", key, namespace })
    throw new Error('MCP not available');
  }
}

module.exports = { MemoryManager };
