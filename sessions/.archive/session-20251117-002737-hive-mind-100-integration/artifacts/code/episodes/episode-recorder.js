#!/usr/bin/env node
/**
 * Episode Recorder - ReasoningBank Episode Recording Engine
 *
 * Implements trajectory tracking and episode storage using AgentDB
 * Stock-First: 95% stock AgentDB CLI, 5% glue logic
 *
 * Episode Structure (ReasoningBank Standard):
 * - observation: Initial state/context
 * - thought: Agent reasoning/analysis
 * - action: What was done
 * - reward: Success score (0-1)
 * - metadata: Additional context
 *
 * Integration Points:
 * - AgentDB reflexion store (stock CLI)
 * - Memory.db for session context
 * - Trajectory tracking for state sequences
 * - Verdict judgment for reward calculation
 */

const path = require('path');
const fs = require('fs');

// Find project root and load AgentDB wrapper
function loadAgentDBWrapper() {
  let dir = __dirname;
  while (dir !== path.dirname(dir)) {
    const wrapperPath = path.join(dir, '.claude/integrations/agentdb-wrapper.js');
    if (fs.existsSync(wrapperPath)) {
      return require(wrapperPath);
    }
    dir = path.dirname(dir);
  }
  throw new Error('AgentDB wrapper not found');
}

const AgentDBWrapper = loadAgentDBWrapper();
const TrajectoryTracker = require('./trajectory-tracker.js');
const VerdictJudge = require('./verdict-judge.js');

class EpisodeRecorder {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || this._findProjectRoot();

    // Initialize AgentDB wrapper (stock integration)
    this.agentdb = new AgentDBWrapper({
      projectRoot: this.projectRoot,
      dbPath: options.agentdbPath || path.join(this.projectRoot, '.agentdb', 'reasoningbank.db')
    });

    // Initialize trajectory tracker
    this.trajectoryTracker = new TrajectoryTracker({
      projectRoot: this.projectRoot
    });

    // Initialize verdict judge
    this.verdictJudge = new VerdictJudge({
      projectRoot: this.projectRoot
    });

    // Session metadata
    this.currentSession = options.sessionId || `session-${Date.now()}`;
    this.agentType = options.agentType || 'unknown';

    // Episode buffer (for batch recording)
    this.episodeBuffer = [];
    this.bufferSize = options.bufferSize || 10;
  }

  /**
   * Find project root
   */
  _findProjectRoot() {
    let dir = __dirname;
    while (dir !== path.dirname(dir)) {
      if (fs.existsSync(path.join(dir, '.agentdb'))) {
        return dir;
      }
      dir = path.dirname(dir);
    }
    return process.cwd();
  }

  /**
   * Record a complete episode to AgentDB
   *
   * @param {Object} episode - Episode data
   * @param {string} episode.observation - Initial state
   * @param {string} episode.thought - Agent reasoning
   * @param {string} episode.action - Action taken
   * @param {number} episode.reward - Success score (0-1)
   * @param {Object} episode.metadata - Additional context
   * @returns {Promise<Object>} Recording result
   */
  async recordEpisode(episode) {
    try {
      // Validate episode structure
      this._validateEpisode(episode);

      // Add session metadata
      const enrichedEpisode = {
        ...episode,
        metadata: {
          ...episode.metadata,
          session_id: this.currentSession,
          agent_type: this.agentType,
          recorded_at: Date.now(),
          source: 'episode-recorder'
        }
      };

      // Track trajectory
      await this.trajectoryTracker.addStep({
        state: episode.observation,
        action: episode.action,
        reward: episode.reward,
        metadata: enrichedEpisode.metadata
      });

      // Store in AgentDB (stock CLI: agentdb reflexion store)
      const result = await this.agentdb.addEpisode(enrichedEpisode);

      return {
        success: true,
        episode: enrichedEpisode,
        agentdb_result: result
      };
    } catch (error) {
      console.error('Failed to record episode:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Record episode from task completion data
   * Extracts observation, thought, action from task context
   *
   * @param {Object} taskData - Task completion data
   * @param {string} taskData.taskId - Task identifier
   * @param {string} taskData.description - Task description
   * @param {string} taskData.status - Completion status
   * @param {Object} taskData.context - Additional context
   * @returns {Promise<Object>} Recording result
   */
  async recordFromTask(taskData) {
    try {
      // Extract trajectory from task
      const trajectory = await this.trajectoryTracker.getCurrentTrajectory();

      // Generate verdict/reward
      const verdict = await this.verdictJudge.judge({
        task: taskData.description,
        status: taskData.status,
        trajectory: trajectory,
        context: taskData.context
      });

      // Build episode
      const episode = {
        observation: taskData.description,
        thought: this._extractThought(taskData, trajectory),
        action: this._extractAction(taskData, trajectory),
        reward: verdict.score,
        metadata: {
          task_id: taskData.taskId,
          status: taskData.status,
          verdict_details: verdict.details,
          trajectory_length: trajectory.steps.length,
          ...taskData.context
        }
      };

      return await this.recordEpisode(episode);
    } catch (error) {
      console.error('Failed to record from task:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Add episode to buffer for batch recording
   * Automatically flushes when buffer is full
   */
  async bufferEpisode(episode) {
    this.episodeBuffer.push(episode);

    if (this.episodeBuffer.length >= this.bufferSize) {
      return await this.flushBuffer();
    }

    return { buffered: true, count: this.episodeBuffer.length };
  }

  /**
   * Flush buffered episodes to AgentDB
   */
  async flushBuffer() {
    if (this.episodeBuffer.length === 0) {
      return { flushed: 0 };
    }

    const results = {
      total: this.episodeBuffer.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    for (const episode of this.episodeBuffer) {
      const result = await this.recordEpisode(episode);
      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push(result.error);
      }
    }

    this.episodeBuffer = [];
    return results;
  }

  /**
   * Search similar episodes using AgentDB vector search
   *
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  async searchSimilarEpisodes(query, options = {}) {
    return await this.agentdb.searchEpisodes(query, options);
  }

  /**
   * Get learning insights from recorded episodes
   * Analyzes patterns in successful vs failed episodes
   */
  async getLearningInsights(options = {}) {
    const minReward = options.minReward || 0.7;

    // Get high-reward episodes (successes)
    const successes = await this.agentdb.searchEpisodes('successful task completion', {
      minReward: minReward,
      limit: 20
    });

    // Get low-reward episodes (failures)
    const failures = await this.agentdb.searchEpisodes('task failure', {
      minReward: 0,
      limit: 20
    });

    return {
      success_patterns: this._extractPatterns(successes.results || []),
      failure_patterns: this._extractPatterns(failures.results || []),
      insights: this._generateInsights(successes.results || [], failures.results || [])
    };
  }

  /**
   * Get episode statistics
   */
  async getStats() {
    const agentdbStats = this.agentdb.getStats();
    const trajectoryStats = await this.trajectoryTracker.getStats();

    return {
      agentdb: agentdbStats,
      trajectory: trajectoryStats,
      session: {
        id: this.currentSession,
        agent_type: this.agentType,
        buffer_size: this.episodeBuffer.length
      }
    };
  }

  /**
   * Validate episode structure
   */
  _validateEpisode(episode) {
    const required = ['observation', 'thought', 'action', 'reward'];
    for (const field of required) {
      if (!(field in episode)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (typeof episode.reward !== 'number' || episode.reward < 0 || episode.reward > 1) {
      throw new Error('Reward must be a number between 0 and 1');
    }
  }

  /**
   * Extract thought from task data and trajectory
   */
  _extractThought(taskData, trajectory) {
    const steps = trajectory.steps || [];
    if (steps.length === 0) {
      return `Task: ${taskData.description}`;
    }

    // Combine reasoning from trajectory steps
    const thoughts = steps
      .map(step => step.metadata?.thought || step.action)
      .filter(t => t)
      .slice(0, 3); // First 3 steps

    return thoughts.join(' → ') || `Task: ${taskData.description}`;
  }

  /**
   * Extract action from task data and trajectory
   */
  _extractAction(taskData, trajectory) {
    const steps = trajectory.steps || [];
    if (steps.length === 0) {
      return `Status: ${taskData.status}`;
    }

    // Last action in trajectory
    const lastStep = steps[steps.length - 1];
    return lastStep.action || `Completed with status: ${taskData.status}`;
  }

  /**
   * Extract patterns from episodes
   */
  _extractPatterns(episodes) {
    if (episodes.length === 0) return [];

    const patterns = new Map();

    for (const episode of episodes) {
      // Extract action patterns
      const actionType = this._classifyAction(episode.action);
      if (!patterns.has(actionType)) {
        patterns.set(actionType, 0);
      }
      patterns.set(actionType, patterns.get(actionType) + 1);
    }

    return Array.from(patterns.entries())
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Classify action type for pattern extraction
   */
  _classifyAction(action) {
    const lower = action.toLowerCase();
    if (lower.includes('create') || lower.includes('write')) return 'creation';
    if (lower.includes('read') || lower.includes('search')) return 'retrieval';
    if (lower.includes('update') || lower.includes('edit')) return 'modification';
    if (lower.includes('delete') || lower.includes('remove')) return 'deletion';
    if (lower.includes('analyze') || lower.includes('review')) return 'analysis';
    return 'other';
  }

  /**
   * Generate insights from success/failure patterns
   */
  _generateInsights(successes, failures) {
    const insights = [];

    // Reward distribution
    const avgSuccessReward = successes.reduce((sum, e) => sum + (e.reward || 0), 0) / (successes.length || 1);
    const avgFailureReward = failures.reduce((sum, e) => sum + (e.reward || 0), 0) / (failures.length || 1);

    insights.push({
      type: 'reward_distribution',
      success_avg: avgSuccessReward,
      failure_avg: avgFailureReward,
      gap: avgSuccessReward - avgFailureReward
    });

    // Episode count
    insights.push({
      type: 'volume',
      success_count: successes.length,
      failure_count: failures.length,
      success_rate: successes.length / (successes.length + failures.length)
    });

    return insights;
  }

  /**
   * Export episodes for analysis
   */
  async exportEpisodes(outputPath) {
    return await this.agentdb.export(outputPath);
  }

  /**
   * Close recorder and flush any pending episodes
   */
  async close() {
    if (this.episodeBuffer.length > 0) {
      await this.flushBuffer();
    }
    return true;
  }
}

module.exports = EpisodeRecorder;

// CLI usage
if (require.main === module) {
  (async () => {
    const recorder = new EpisodeRecorder({
      sessionId: 'test-session',
      agentType: 'test-agent'
    });

    console.log('📼 Episode Recorder - ReasoningBank Integration\n');

    // Record test episode
    const testEpisode = {
      observation: 'Task: Implement user authentication',
      thought: 'Need to create secure login system with JWT tokens',
      action: 'Created auth.js with bcrypt password hashing and JWT generation',
      reward: 0.85,
      metadata: {
        files_created: ['auth.js', 'auth.test.js'],
        test_coverage: 0.92
      }
    };

    const result = await recorder.recordEpisode(testEpisode);
    console.log('Recording result:', result.success ? '✅' : '❌');

    // Get stats
    const stats = await recorder.getStats();
    console.log('\n📊 Statistics:');
    console.log('AgentDB Episodes:', stats.agentdb?.episodes || 0);
    console.log('Session:', stats.session.id);

    await recorder.close();
  })();
}
