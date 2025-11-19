/**
 * Memory Manager - User history and personalization
 *
 * Stores user interaction history for personalized learning paths.
 * Integrates with claude-flow memory via MCP tools.
 */

const { execSync } = require('child_process');

class MemoryManager {
  constructor() {
    this.namespace = 'tutor-mode';
    this.sessionId = process.env.ACTIVE_SESSION_ID || 'default';
  }

  /**
   * Get user history from memory
   * @returns {Promise<Object>} User interaction history
   */
  async getUserHistory() {
    try {
      // Read from memory using claude-flow
      const stored = await this.retrieveFromMemory('user-history');

      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      // No history yet
    }

    // Default history
    return {
      userId: this.sessionId,
      totalInteractions: 0,
      topicsExplored: [],
      exercisesCompleted: [],
      recentInteractions: [],
      assessments: [],
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Store user history to memory
   * @param {Object} history - User history to store
   */
  async storeUserHistory(history) {
    await this.storeInMemory('user-history', JSON.stringify(history));
  }

  /**
   * Record user interaction
   * @param {string} type - Interaction type (explain, exercise, question)
   * @param {string} topic - Topic of interaction
   * @param {string} response - Response provided
   */
  async recordInteraction(type, topic, response) {
    const history = await this.getUserHistory();

    history.totalInteractions++;

    if (!history.topicsExplored.includes(topic)) {
      history.topicsExplored.push(topic);
    }

    history.recentInteractions.unshift({
      type,
      topic,
      timestamp: new Date().toISOString(),
      responseLength: response.length
    });

    // Keep only last 50 interactions
    history.recentInteractions = history.recentInteractions.slice(0, 50);

    await this.storeUserHistory(history);
  }

  /**
   * Store assessment results
   * @param {Object} assessment - Assessment results
   */
  async storeAssessment(assessment) {
    const history = await this.getUserHistory();

    history.assessments.push({
      timestamp: new Date().toISOString(),
      ...assessment
    });

    // Keep only last 10 assessments
    history.assessments = history.assessments.slice(-10);

    await this.storeUserHistory(history);
  }

  /**
   * Get user preferences
   * @returns {Promise<Object>} User preferences
   */
  async getUserPreferences() {
    try {
      const stored = await this.retrieveFromMemory('user-preferences');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      // No preferences yet
    }

    return {
      learningStyle: 'balanced', // code, theory, balanced
      detailLevel: 'medium',     // low, medium, high
      pacePreference: 'normal'   // slow, normal, fast
    };
  }

  /**
   * Store user preferences
   * @param {Object} preferences - User preferences
   */
  async storeUserPreferences(preferences) {
    await this.storeInMemory('user-preferences', JSON.stringify(preferences));
  }

  /**
   * Store data in memory using in-process API
   * @param {string} key - Memory key
   * @param {string} value - Value to store
   */
  async storeInMemory(key, value) {
    // Store in file-based cache for now
    // In production, this would use MCP memory_usage tool
    const fs = require('fs').promises;
    const path = require('path');

    const cacheDir = path.join(
      process.cwd(),
      '.swarm/tutor-cache'
    );

    await fs.mkdir(cacheDir, { recursive: true });

    const filePath = path.join(cacheDir, `${key}.json`);
    await fs.writeFile(filePath, value, 'utf-8');
  }

  /**
   * Retrieve data from memory
   * @param {string} key - Memory key
   * @returns {Promise<string>} Stored value
   */
  async retrieveFromMemory(key) {
    const fs = require('fs').promises;
    const path = require('path');

    const filePath = path.join(
      process.cwd(),
      '.swarm/tutor-cache',
      `${key}.json`
    );

    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear user history (reset progress)
   */
  async clearHistory() {
    const fs = require('fs').promises;
    const path = require('path');

    const cacheDir = path.join(process.cwd(), '.swarm/tutor-cache');

    try {
      await fs.rm(cacheDir, { recursive: true, force: true });
    } catch (error) {
      // Already cleared
    }
  }
}

module.exports = MemoryManager;
