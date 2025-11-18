/**
 * Memory Manager
 *
 * Handles integration with Claude Flow memory for baseline patterns
 * and learning persistence.
 */

const { execSync } = require('child_process');

class MemoryManager {
  constructor(config = {}) {
    this.namespace = config.memoryNamespace || 'prompt-improver';
    this.useMcp = config.useMcp !== false;
  }

  /**
   * Get baseline patterns for a specific mode
   * @param {string} mode - Execution mode (hive, swarm, wizard, direct)
   * @returns {Promise<object>} Baseline patterns
   */
  async getBaselinePatterns(mode) {
    try {
      const key = `${this.namespace}/baselines/${mode}`;
      const result = await this._retrieve(key);

      if (result) {
        return JSON.parse(result);
      }

      // Return defaults if no patterns found
      return this._getDefaultPatterns(mode);

    } catch (error) {
      console.error('[MemoryManager] Error retrieving patterns:', error.message);
      return this._getDefaultPatterns(mode);
    }
  }

  /**
   * Store successful prompt pattern
   * @param {string} mode - Execution mode
   * @param {object} pattern - Pattern to store
   */
  async storePattern(mode, pattern) {
    try {
      const key = `${this.namespace}/patterns/${mode}/${Date.now()}`;
      await this._store(key, JSON.stringify(pattern));

      // Update baseline aggregation
      await this._updateBaseline(mode, pattern);

    } catch (error) {
      console.error('[MemoryManager] Error storing pattern:', error.message);
    }
  }

  /**
   * Store rejection pattern (for learning what not to suggest)
   * @param {string} mode - Execution mode
   * @param {object} rejection - Rejection data
   */
  async storeRejection(mode, rejection) {
    try {
      const key = `${this.namespace}/rejections/${mode}/${Date.now()}`;
      await this._store(key, JSON.stringify(rejection));

    } catch (error) {
      console.error('[MemoryManager] Error storing rejection:', error.message);
    }
  }

  /**
   * Get recent successful patterns
   * @param {string} mode - Execution mode
   * @param {number} limit - Number of patterns to retrieve
   * @returns {Promise<Array>} Recent patterns
   */
  async getRecentPatterns(mode, limit = 10) {
    try {
      const prefix = `${this.namespace}/patterns/${mode}/`;
      const keys = await this._list(prefix);

      const patterns = [];
      for (const key of keys.slice(-limit)) {
        const data = await this._retrieve(key);
        if (data) {
          patterns.push(JSON.parse(data));
        }
      }

      return patterns;

    } catch (error) {
      console.error('[MemoryManager] Error retrieving recent patterns:', error.message);
      return [];
    }
  }

  /**
   * Update baseline aggregation with new pattern
   */
  async _updateBaseline(mode, pattern) {
    try {
      const baseline = await this.getBaselinePatterns(mode);

      // Aggregate common context elements
      if (pattern.context) {
        baseline.commonContext = baseline.commonContext || {};
        baseline.contextFrequency = baseline.contextFrequency || {};

        for (const [key, value] of Object.entries(pattern.context)) {
          baseline.commonContext[key] = value;
          baseline.contextFrequency[key] = (baseline.contextFrequency[key] || 0) + 1;
        }
      }

      // Aggregate best practices
      if (pattern.improvements) {
        baseline.bestPractices = baseline.bestPractices || [];
        baseline.bestPractices.push(...pattern.improvements);

        // Keep only top practices (by frequency)
        baseline.bestPractices = this._deduplicateAndRank(
          baseline.bestPractices,
          20
        );
      }

      // Store updated baseline
      const key = `${this.namespace}/baselines/${mode}`;
      await this._store(key, JSON.stringify(baseline));

    } catch (error) {
      console.error('[MemoryManager] Error updating baseline:', error.message);
    }
  }

  /**
   * Deduplicate and rank items by frequency
   */
  _deduplicateAndRank(items, limit) {
    const frequency = {};

    for (const item of items) {
      const key = typeof item === 'string' ? item : JSON.stringify(item);
      frequency[key] = (frequency[key] || 0) + 1;
    }

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([key]) => {
        try {
          return JSON.parse(key);
        } catch {
          return key;
        }
      });
  }

  /**
   * Get default patterns for mode
   */
  _getDefaultPatterns(mode) {
    const defaults = {
      hive: {
        commonContext: {
          topology: 'Specify topology (mesh/hierarchical)',
          consensus: 'Define consensus mechanism if needed',
          queen: 'Identify queen agent if using hierarchical'
        },
        contextFrequency: {
          topology: 1,
          consensus: 1,
          queen: 1
        },
        bestPractices: [
          'Clearly define queen responsibilities',
          'Specify coordination strategy',
          'Include convergence criteria for consensus'
        ]
      },
      swarm: {
        commonContext: {
          topology: 'Specify swarm topology',
          agents: 'List required agent types',
          coordination: 'Define coordination approach'
        },
        contextFrequency: {
          topology: 1,
          agents: 1,
          coordination: 1
        },
        bestPractices: [
          'Define agent responsibilities',
          'Specify memory sharing strategy',
          'Include success criteria'
        ]
      },
      wizard: {
        commonContext: {
          interactive: 'Wizard handles interaction',
          steps: 'Wizard will guide through steps'
        },
        contextFrequency: {
          interactive: 1,
          steps: 1
        },
        bestPractices: [
          'Provide high-level goal',
          'Let wizard determine steps',
          'Include constraints and preferences'
        ]
      },
      direct: {
        commonContext: {
          deliverables: 'Specify expected outputs',
          constraints: 'List any constraints'
        },
        contextFrequency: {
          deliverables: 1,
          constraints: 1
        },
        bestPractices: [
          'Be specific about requirements',
          'Include file paths if relevant',
          'Specify testing expectations'
        ]
      }
    };

    return defaults[mode] || defaults.direct;
  }

  /**
   * Store value in memory (via MCP or fallback)
   */
  async _store(key, value) {
    if (this.useMcp) {
      try {
        // In real implementation, use MCP tool
        // For now, use filesystem fallback
        return this._storeFilesystem(key, value);
      } catch (error) {
        console.error('[MemoryManager] MCP store failed, using fallback:', error.message);
        return this._storeFilesystem(key, value);
      }
    } else {
      return this._storeFilesystem(key, value);
    }
  }

  /**
   * Retrieve value from memory (via MCP or fallback)
   */
  async _retrieve(key) {
    if (this.useMcp) {
      try {
        // In real implementation, use MCP tool
        // For now, use filesystem fallback
        return this._retrieveFilesystem(key);
      } catch (error) {
        console.error('[MemoryManager] MCP retrieve failed, using fallback:', error.message);
        return this._retrieveFilesystem(key);
      }
    } else {
      return this._retrieveFilesystem(key);
    }
  }

  /**
   * List keys with prefix
   */
  async _list(prefix) {
    if (this.useMcp) {
      try {
        // In real implementation, use MCP tool
        // For now, use filesystem fallback
        return this._listFilesystem(prefix);
      } catch (error) {
        console.error('[MemoryManager] MCP list failed, using fallback:', error.message);
        return this._listFilesystem(prefix);
      }
    } else {
      return this._listFilesystem(prefix);
    }
  }

  /**
   * Filesystem fallback methods
   */
  _storeFilesystem(key, value) {
    const fs = require('fs');
    const path = require('path');

    const dir = path.join(process.cwd(), '.prompt-improver-memory');
    const filePath = path.join(dir, `${key.replace(/\//g, '_')}.json`);

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, value, 'utf8');

    return Promise.resolve();
  }

  _retrieveFilesystem(key) {
    const fs = require('fs');
    const path = require('path');

    const dir = path.join(process.cwd(), '.prompt-improver-memory');
    const filePath = path.join(dir, `${key.replace(/\//g, '_')}.json`);

    if (fs.existsSync(filePath)) {
      return Promise.resolve(fs.readFileSync(filePath, 'utf8'));
    }

    return Promise.resolve(null);
  }

  _listFilesystem(prefix) {
    const fs = require('fs');
    const path = require('path');

    const dir = path.join(process.cwd(), '.prompt-improver-memory');

    if (!fs.existsSync(dir)) {
      return Promise.resolve([]);
    }

    const files = fs.readdirSync(dir);
    const prefixKey = prefix.replace(/\//g, '_');

    return Promise.resolve(
      files
        .filter(f => f.startsWith(prefixKey))
        .map(f => f.replace('.json', '').replace(/_/g, '/'))
    );
  }
}

module.exports = { MemoryManager };
