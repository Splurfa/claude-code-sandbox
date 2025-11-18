#!/usr/bin/env node

/**
 * Pattern Extractor
 * Extracts patterns from successful workflows and episodes
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const crypto = require('crypto');

class PatternExtractor {
  constructor(dbPath = '.swarm/memory.db') {
    this.dbPath = path.resolve(dbPath);
    this.db = null;
    this.initialized = false;
  }

  /**
   * Initialize database connection
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(new Error(`Failed to open database: ${err.message}`));
        } else {
          this.initialized = true;
          resolve();
        }
      });
    });
  }

  /**
   * Extract pattern from workflow trajectory
   * @param {Object} trajectory - Task trajectory data
   * @returns {Promise<Object>} - Extracted pattern
   */
  async extractFromTrajectory(trajectory) {
    const {
      task_id,
      agent_id,
      query,
      trajectory_json,
      judge_label,
      judge_conf
    } = trajectory;

    // Parse trajectory
    const steps = JSON.parse(trajectory_json);

    // Extract pattern features
    const pattern = {
      id: this._generatePatternId(),
      type: 'reasoning_memory',
      data: {
        source: 'trajectory',
        taskId: task_id,
        agentId: agent_id,
        query,
        steps: this._extractStepPatterns(steps),
        outcome: judge_label,
        confidence: judge_conf || 0.8
      },
      confidence: judge_conf || 0.8,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };

    return pattern;
  }

  /**
   * Extract patterns from successful episodes
   * @param {number} limit - Maximum number of episodes to analyze
   * @returns {Promise<Array>} - Extracted patterns
   */
  async extractFromSuccessfulEpisodes(limit = 20) {
    const trajectories = await this._getSuccessfulTrajectories(limit);
    const patterns = [];

    for (const trajectory of trajectories) {
      try {
        const pattern = await this.extractFromTrajectory(trajectory);
        patterns.push(pattern);
      } catch (error) {
        console.warn(`Failed to extract pattern from trajectory ${trajectory.task_id}:`, error.message);
      }
    }

    return patterns;
  }

  /**
   * Extract pattern from file operations
   * @param {Array<Object>} fileOps - File operation history
   * @returns {Object} - Extracted pattern
   */
  extractFromFileOperations(fileOps) {
    const pattern = {
      id: this._generatePatternId(),
      type: 'reasoning_memory',
      data: {
        source: 'file_operations',
        operations: this._categorizeFileOps(fileOps),
        sequence: this._extractSequencePattern(fileOps),
        frequency: this._calculateOpFrequency(fileOps)
      },
      confidence: 0.7,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };

    return pattern;
  }

  /**
   * Extract pattern from agent coordination
   * @param {Array<Object>} coordination - Agent coordination history
   * @returns {Object} - Extracted pattern
   */
  extractFromCoordination(coordination) {
    const pattern = {
      id: this._generatePatternId(),
      type: 'reasoning_memory',
      data: {
        source: 'coordination',
        topology: this._detectTopology(coordination),
        communication: this._extractCommunicationPatterns(coordination),
        taskDistribution: this._analyzeTaskDistribution(coordination)
      },
      confidence: 0.75,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };

    return pattern;
  }

  /**
   * Extract pattern from memory usage
   * @param {Array<Object>} memoryOps - Memory operation history
   * @returns {Object} - Extracted pattern
   */
  extractFromMemoryUsage(memoryOps) {
    const pattern = {
      id: this._generatePatternId(),
      type: 'reasoning_memory',
      data: {
        source: 'memory_usage',
        namespaces: this._analyzeNamespaces(memoryOps),
        accessPatterns: this._extractAccessPatterns(memoryOps),
        dataTypes: this._categorizeDataTypes(memoryOps)
      },
      confidence: 0.8,
      usageCount: 0,
      createdAt: new Date().toISOString()
    };

    return pattern;
  }

  /**
   * Save extracted pattern to database
   * @param {Object} pattern - Pattern to save
   * @returns {Promise<Object>} - Save result
   */
  async savePattern(pattern) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO patterns (id, type, pattern_data, confidence, usage_count, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const values = [
        pattern.id,
        pattern.type,
        JSON.stringify(pattern.data),
        pattern.confidence,
        pattern.usageCount || 0,
        pattern.createdAt || new Date().toISOString()
      ];

      this.db.run(query, values, function(err) {
        if (err) {
          reject(new Error(`Failed to save pattern: ${err.message}`));
        } else {
          resolve({
            id: pattern.id,
            saved: true,
            rowId: this.lastID
          });
        }
      });
    });
  }

  /**
   * Create pattern embedding and save it
   * @param {string} patternId - Pattern ID
   * @param {Array<number>} vector - Embedding vector
   * @param {string} model - Model used for embedding
   * @returns {Promise<Object>} - Save result
   */
  async savePatternEmbedding(patternId, vector, model = 'custom-tfidf') {
    return new Promise((resolve, reject) => {
      // Serialize vector to BLOB
      const buffer = Buffer.from(new Float32Array(vector).buffer);

      const query = `
        INSERT INTO pattern_embeddings (id, model, dims, vector, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          model = excluded.model,
          dims = excluded.dims,
          vector = excluded.vector,
          created_at = excluded.created_at
      `;

      const values = [
        patternId,
        model,
        vector.length,
        buffer,
        new Date().toISOString()
      ];

      this.db.run(query, values, function(err) {
        if (err) {
          reject(new Error(`Failed to save pattern embedding: ${err.message}`));
        } else {
          resolve({
            patternId,
            saved: true,
            dims: vector.length,
            model
          });
        }
      });
    });
  }

  /**
   * Create link between patterns
   * @param {string} srcId - Source pattern ID
   * @param {string} dstId - Destination pattern ID
   * @param {string} relation - Relationship type
   * @param {number} weight - Link weight
   * @returns {Promise<Object>} - Save result
   */
  async createPatternLink(srcId, dstId, relation, weight = 1.0) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO pattern_links (src_id, dst_id, relation, weight, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(src_id, dst_id, relation) DO UPDATE SET
          weight = excluded.weight,
          created_at = excluded.created_at
      `;

      const values = [srcId, dstId, relation, weight, new Date().toISOString()];

      this.db.run(query, values, function(err) {
        if (err) {
          reject(new Error(`Failed to create pattern link: ${err.message}`));
        } else {
          resolve({
            srcId,
            dstId,
            relation,
            weight,
            saved: true
          });
        }
      });
    });
  }

  /**
   * Get successful trajectories from database
   * @private
   */
  async _getSuccessfulTrajectories(limit) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT *
        FROM task_trajectories
        WHERE judge_label = 'success' OR judge_conf >= 0.8
        ORDER BY created_at DESC
        LIMIT ?
      `;

      this.db.all(query, [limit], (err, rows) => {
        if (err) {
          reject(new Error(`Failed to fetch trajectories: ${err.message}`));
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Extract step patterns from trajectory
   * @private
   */
  _extractStepPatterns(steps) {
    return steps.map(step => ({
      type: step.type || 'unknown',
      action: step.action,
      tool: step.tool,
      result: step.result ? 'success' : 'failure'
    }));
  }

  /**
   * Categorize file operations
   * @private
   */
  _categorizeFileOps(fileOps) {
    const categories = {
      read: 0,
      write: 0,
      edit: 0,
      delete: 0,
      other: 0
    };

    fileOps.forEach(op => {
      const type = op.type.toLowerCase();
      if (categories.hasOwnProperty(type)) {
        categories[type]++;
      } else {
        categories.other++;
      }
    });

    return categories;
  }

  /**
   * Extract sequence pattern from operations
   * @private
   */
  _extractSequencePattern(ops) {
    return ops.slice(0, 10).map(op => op.type);
  }

  /**
   * Calculate operation frequency
   * @private
   */
  _calculateOpFrequency(ops) {
    const freq = {};
    ops.forEach(op => {
      freq[op.type] = (freq[op.type] || 0) + 1;
    });
    return freq;
  }

  /**
   * Detect coordination topology
   * @private
   */
  _detectTopology(coordination) {
    // Simplified topology detection
    const agentCount = new Set(coordination.map(c => c.agentId)).size;

    if (agentCount <= 2) return 'peer';
    if (coordination.some(c => c.role === 'coordinator')) return 'hierarchical';
    return 'mesh';
  }

  /**
   * Extract communication patterns
   * @private
   */
  _extractCommunicationPatterns(coordination) {
    const patterns = {
      totalMessages: coordination.length,
      uniqueAgents: new Set(coordination.map(c => c.agentId)).size,
      averageMessageSize: coordination.reduce((sum, c) => sum + (c.message?.length || 0), 0) / coordination.length
    };
    return patterns;
  }

  /**
   * Analyze task distribution
   * @private
   */
  _analyzeTaskDistribution(coordination) {
    const distribution = {};
    coordination.forEach(c => {
      distribution[c.agentId] = (distribution[c.agentId] || 0) + 1;
    });
    return distribution;
  }

  /**
   * Analyze memory namespaces
   * @private
   */
  _analyzeNamespaces(memoryOps) {
    const namespaces = {};
    memoryOps.forEach(op => {
      namespaces[op.namespace] = (namespaces[op.namespace] || 0) + 1;
    });
    return namespaces;
  }

  /**
   * Extract memory access patterns
   * @private
   */
  _extractAccessPatterns(memoryOps) {
    const patterns = {
      reads: memoryOps.filter(op => op.action === 'retrieve').length,
      writes: memoryOps.filter(op => op.action === 'store').length,
      searches: memoryOps.filter(op => op.action === 'search').length
    };
    return patterns;
  }

  /**
   * Categorize data types in memory
   * @private
   */
  _categorizeDataTypes(memoryOps) {
    const types = {};
    memoryOps.forEach(op => {
      try {
        const value = JSON.parse(op.value);
        const type = Array.isArray(value) ? 'array' : typeof value;
        types[type] = (types[type] || 0) + 1;
      } catch {
        types.string = (types.string || 0) + 1;
      }
    });
    return types;
  }

  /**
   * Generate unique pattern ID
   * @private
   */
  _generatePatternId() {
    return crypto.randomUUID();
  }

  /**
   * Close database connection
   */
  async close() {
    if (this.db) {
      return new Promise((resolve) => {
        this.db.close(() => {
          this.initialized = false;
          resolve();
        });
      });
    }
  }
}

module.exports = PatternExtractor;
