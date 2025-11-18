/**
 * Memory Client - Simplified Memory Access Wrapper
 *
 * Provides simplified interface to Claude Flow's MCP memory system with
 * error handling, retries, and integration with mcp__claude-flow_alpha__memory_usage.
 *
 * Features:
 * - Simple wrapper around MCP memory_usage tool
 * - Automatic retry logic for transient failures
 * - Namespace management
 * - Error handling and logging
 * - Batch operations support
 */

const DEFAULT_NAMESPACE = 'default';
const MAX_RETRIES = 3;
const RETRY_DELAY = 100; // ms

class MemoryClient {
  constructor(config = {}) {
    this.config = config;
    this.defaultNamespace = config.namespace || DEFAULT_NAMESPACE;
    this.maxRetries = config.maxRetries || MAX_RETRIES;
    this.retryDelay = config.retryDelay || RETRY_DELAY;
    this.mcpTool = config.mcpTool; // MCP tool instance
  }

  /**
   * Store a value in memory
   * @param {string} key - Storage key
   * @param {any} value - Value to store (will be JSON stringified)
   * @param {string} namespace - Optional namespace (defaults to config default)
   * @returns {Promise<object>} Store result
   */
  async store(key, value, namespace = null) {
    const ns = namespace || this.defaultNamespace;

    try {
      // Convert value to string if needed
      const valueStr = typeof value === 'string' ? value : JSON.stringify(value);

      const result = await this._executeWithRetry(async () => {
        if (this.mcpTool) {
          // Use MCP tool if provided
          return await this.mcpTool.memory_usage({
            action: 'store',
            key,
            value: valueStr,
            namespace: ns
          });
        } else {
          // Direct MCP call (for use in Claude Code)
          // This would be called via the actual MCP function
          throw new Error('MCP tool not configured - use mcp__claude-flow_alpha__memory_usage directly');
        }
      });

      return {
        success: true,
        key,
        namespace: ns,
        stored: true,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error(`[MemoryClient] Error storing ${key}:`, error.message);
      return {
        success: false,
        key,
        namespace: ns,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Retrieve a value from memory
   * @param {string} key - Storage key
   * @param {string} namespace - Optional namespace
   * @returns {Promise<any>} Retrieved value (parsed if JSON)
   */
  async retrieve(key, namespace = null) {
    const ns = namespace || this.defaultNamespace;

    try {
      const result = await this._executeWithRetry(async () => {
        if (this.mcpTool) {
          return await this.mcpTool.memory_usage({
            action: 'retrieve',
            key,
            namespace: ns
          });
        } else {
          throw new Error('MCP tool not configured - use mcp__claude-flow_alpha__memory_usage directly');
        }
      });

      // Parse value if it's JSON
      const value = result.value;
      return this._parseValue(value);

    } catch (error) {
      console.error(`[MemoryClient] Error retrieving ${key}:`, error.message);
      return null;
    }
  }

  /**
   * Search memory with a pattern
   * @param {string} pattern - Search pattern (SQL LIKE syntax)
   * @param {string} namespace - Optional namespace
   * @returns {Promise<Array>} Matching entries
   */
  async search(pattern, namespace = null) {
    const ns = namespace || this.defaultNamespace;

    try {
      const result = await this._executeWithRetry(async () => {
        if (this.mcpTool) {
          return await this.mcpTool.memory_usage({
            action: 'search',
            pattern,
            namespace: ns
          });
        } else {
          throw new Error('MCP tool not configured - use mcp__claude-flow_alpha__memory_search directly');
        }
      });

      // Parse and return results
      return (result.results || []).map(entry => ({
        key: entry.key,
        value: this._parseValue(entry.value),
        namespace: entry.namespace,
        timestamp: entry.timestamp
      }));

    } catch (error) {
      console.error(`[MemoryClient] Error searching ${pattern}:`, error.message);
      return [];
    }
  }

  /**
   * List all entries in a namespace
   * @param {string} namespace - Optional namespace
   * @returns {Promise<Array>} All entries in namespace
   */
  async list(namespace = null) {
    const ns = namespace || this.defaultNamespace;

    try {
      const result = await this._executeWithRetry(async () => {
        if (this.mcpTool) {
          return await this.mcpTool.memory_usage({
            action: 'list',
            namespace: ns
          });
        } else {
          throw new Error('MCP tool not configured - use mcp__claude-flow_alpha__memory_usage directly');
        }
      });

      // Parse and return results
      return (result.entries || []).map(entry => ({
        key: entry.key,
        value: this._parseValue(entry.value),
        namespace: entry.namespace,
        timestamp: entry.timestamp
      }));

    } catch (error) {
      console.error(`[MemoryClient] Error listing namespace ${ns}:`, error.message);
      return [];
    }
  }

  /**
   * Delete an entry from memory
   * @param {string} key - Storage key
   * @param {string} namespace - Optional namespace
   * @returns {Promise<object>} Delete result
   */
  async delete(key, namespace = null) {
    const ns = namespace || this.defaultNamespace;

    try {
      await this._executeWithRetry(async () => {
        if (this.mcpTool) {
          return await this.mcpTool.memory_usage({
            action: 'delete',
            key,
            namespace: ns
          });
        } else {
          throw new Error('MCP tool not configured - use mcp__claude-flow_alpha__memory_usage directly');
        }
      });

      return {
        success: true,
        key,
        namespace: ns,
        deleted: true,
        timestamp: Date.now()
      };

    } catch (error) {
      console.error(`[MemoryClient] Error deleting ${key}:`, error.message);
      return {
        success: false,
        key,
        namespace: ns,
        error: error.message,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Store multiple values in batch
   * @param {Array<{key, value, namespace}>} entries - Entries to store
   * @returns {Promise<Array>} Results for each entry
   */
  async storeBatch(entries) {
    try {
      const results = await Promise.all(
        entries.map(entry =>
          this.store(entry.key, entry.value, entry.namespace)
        )
      );

      return results;

    } catch (error) {
      console.error('[MemoryClient] Error in batch store:', error.message);
      return entries.map(entry => ({
        success: false,
        key: entry.key,
        error: error.message
      }));
    }
  }

  /**
   * Retrieve multiple values in batch
   * @param {Array<{key, namespace}>} queries - Queries to execute
   * @returns {Promise<Array>} Retrieved values
   */
  async retrieveBatch(queries) {
    try {
      const results = await Promise.all(
        queries.map(query =>
          this.retrieve(query.key, query.namespace)
        )
      );

      return results;

    } catch (error) {
      console.error('[MemoryClient] Error in batch retrieve:', error.message);
      return queries.map(() => null);
    }
  }

  /**
   * Check if a key exists in memory
   * @param {string} key - Storage key
   * @param {string} namespace - Optional namespace
   * @returns {Promise<boolean>} True if key exists
   */
  async exists(key, namespace = null) {
    const value = await this.retrieve(key, namespace);
    return value !== null;
  }

  /**
   * Get memory statistics for a namespace
   * @param {string} namespace - Optional namespace
   * @returns {Promise<object>} Statistics
   */
  async getStats(namespace = null) {
    const ns = namespace || this.defaultNamespace;
    const entries = await this.list(ns);

    return {
      namespace: ns,
      entryCount: entries.length,
      totalSize: this._calculateSize(entries),
      oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : null,
      newestEntry: entries.length > 0 ? Math.max(...entries.map(e => e.timestamp)) : null,
      timestamp: Date.now()
    };
  }

  /**
   * Execute operation with retry logic
   * @private
   */
  async _executeWithRetry(operation, attempt = 1) {
    try {
      return await operation();
    } catch (error) {
      if (attempt < this.maxRetries) {
        // Wait before retry
        await this._sleep(this.retryDelay * attempt);
        return this._executeWithRetry(operation, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Sleep for specified milliseconds
   * @private
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Parse value (try JSON parse, fallback to string)
   * @private
   */
  _parseValue(value) {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value !== 'string') {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  /**
   * Calculate approximate size of entries
   * @private
   */
  _calculateSize(entries) {
    return entries.reduce((total, entry) => {
      const keySize = entry.key.length * 2; // UTF-16
      const valueSize = JSON.stringify(entry.value).length * 2;
      return total + keySize + valueSize;
    }, 0);
  }

  /**
   * Create a namespaced memory client
   * @param {string} namespace - Namespace to use
   * @returns {MemoryClient} New client with namespace
   */
  withNamespace(namespace) {
    return new MemoryClient({
      ...this.config,
      namespace,
      mcpTool: this.mcpTool
    });
  }
}

/**
 * Helper function to create memory client for direct MCP usage
 * (for use in Claude Code without MCP tool instance)
 */
function createDirectMemoryClient(namespace = DEFAULT_NAMESPACE) {
  return {
    async store(key, value, ns = namespace) {
      // This is a placeholder - actual implementation would use MCP directly
      console.log(`[MemoryClient] Store to MCP: ${key} in ${ns}`);
      return { success: true, key, namespace: ns };
    },

    async retrieve(key, ns = namespace) {
      console.log(`[MemoryClient] Retrieve from MCP: ${key} in ${ns}`);
      return null;
    },

    async search(pattern, ns = namespace) {
      console.log(`[MemoryClient] Search MCP: ${pattern} in ${ns}`);
      return [];
    },

    async list(ns = namespace) {
      console.log(`[MemoryClient] List MCP: ${ns}`);
      return [];
    }
  };
}

module.exports = {
  MemoryClient,
  createDirectMemoryClient,
  DEFAULT_NAMESPACE
};
