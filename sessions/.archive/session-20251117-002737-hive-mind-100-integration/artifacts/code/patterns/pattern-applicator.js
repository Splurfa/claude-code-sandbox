#!/usr/bin/env node

/**
 * Pattern Applicator with Confidence Scoring
 * Applies patterns to projects with strategic queen approval
 */

const PatternMatcher = require('./pattern-matcher');
const fs = require('fs').promises;
const path = require('path');

class PatternApplicator {
  constructor(dbPath = '.swarm/memory.db') {
    this.matcher = new PatternMatcher(dbPath);
    this.minConfidence = 0.85;
    this.autoApplyThreshold = 0.90;
    this.applicationHistory = [];
  }

  /**
   * Initialize the applicator
   */
  async initialize() {
    await this.matcher.initialize();
  }

  /**
   * Analyze project and recommend patterns
   * @param {Object} projectContext - Project context
   * @param {Object} options - Application options
   * @returns {Promise<Object>} - Recommendations and application plan
   */
  async analyzeProject(projectContext, options = {}) {
    const {
      autoApply = false,
      requireApproval = true,
      minConfidence = this.minConfidence
    } = options;

    // Extract project features
    const context = await this._buildProjectContext(projectContext);

    // Find matching patterns
    const matches = await this.matcher.matchByContext(context, {
      limit: 10,
      threshold: minConfidence,
      autoApply: false
    });

    // Score and rank recommendations
    const recommendations = this._scoreRecommendations(matches, context);

    // Prepare application plan
    const plan = this._createApplicationPlan(recommendations, {
      autoApply,
      requireApproval
    });

    return {
      context,
      matches,
      recommendations,
      plan,
      metadata: {
        totalPatterns: matches.length,
        highConfidence: matches.filter(m => m.confidence >= 0.9).length,
        autoApplicable: matches.filter(m => m.confidence >= this.autoApplyThreshold).length
      }
    };
  }

  /**
   * Apply pattern to project
   * @param {string} patternId - Pattern ID to apply
   * @param {Object} projectContext - Project context
   * @param {Object} options - Application options
   * @returns {Promise<Object>} - Application result
   */
  async applyPattern(patternId, projectContext, options = {}) {
    const {
      dryRun = false,
      createBackup = true,
      requireApproval = true
    } = options;

    // Get pattern details
    const patterns = await this.matcher.getAllPatterns();
    const pattern = patterns.find(p => p.id === patternId);

    if (!pattern) {
      throw new Error(`Pattern not found: ${patternId}`);
    }

    // Calculate confidence score
    const context = await this._buildProjectContext(projectContext);
    const contextVector = await this.matcher._extractContextFeatures(context);
    const similarity = pattern.vector ?
      this.matcher._calculateSimilarity(contextVector, pattern.vector) : 0.5;
    const confidence = pattern.confidence * similarity;

    // Check approval requirements
    if (requireApproval && confidence < this.autoApplyThreshold) {
      return {
        applied: false,
        requiresApproval: true,
        patternId,
        confidence,
        similarity,
        message: 'Pattern requires strategic queen approval before application'
      };
    }

    // Create backup if requested
    if (createBackup && !dryRun) {
      await this._createBackup(projectContext);
    }

    // Apply pattern
    let result;
    if (dryRun) {
      result = await this._simulateApplication(pattern, context);
    } else {
      result = await this._executeApplication(pattern, context);
    }

    // Update pattern usage
    if (!dryRun && result.success) {
      await this.matcher.updatePatternUsage(patternId);
    }

    // Record application
    this.applicationHistory.push({
      patternId,
      timestamp: new Date().toISOString(),
      confidence,
      similarity,
      dryRun,
      success: result.success,
      context: projectContext.path
    });

    return {
      applied: !dryRun && result.success,
      patternId,
      confidence,
      similarity,
      dryRun,
      result,
      metadata: {
        pattern: {
          id: pattern.id,
          type: pattern.type,
          usageCount: pattern.usageCount
        },
        application: {
          timestamp: new Date().toISOString(),
          requiresApproval: false
        }
      }
    };
  }

  /**
   * Apply multiple patterns in sequence
   * @param {Array<string>} patternIds - Pattern IDs to apply
   * @param {Object} projectContext - Project context
   * @param {Object} options - Application options
   * @returns {Promise<Array>} - Application results
   */
  async applyPatterns(patternIds, projectContext, options = {}) {
    const results = [];

    for (const patternId of patternIds) {
      try {
        const result = await this.applyPattern(patternId, projectContext, options);
        results.push(result);

        // Stop on failure unless continueOnError is set
        if (!result.applied && !options.continueOnError) {
          break;
        }
      } catch (error) {
        results.push({
          applied: false,
          patternId,
          error: error.message
        });

        if (!options.continueOnError) {
          break;
        }
      }
    }

    return results;
  }

  /**
   * Auto-apply patterns with high confidence
   * @param {Object} projectContext - Project context
   * @param {Object} options - Application options
   * @returns {Promise<Object>} - Auto-application results
   */
  async autoApplyPatterns(projectContext, options = {}) {
    const {
      minConfidence = this.autoApplyThreshold,
      maxPatterns = 5,
      createBackup = true
    } = options;

    // Analyze project
    const analysis = await this.analyzeProject(projectContext, {
      autoApply: true,
      minConfidence
    });

    // Filter auto-applicable patterns
    const autoApplicable = analysis.recommendations
      .filter(r => r.confidence >= minConfidence)
      .slice(0, maxPatterns);

    if (autoApplicable.length === 0) {
      return {
        applied: 0,
        results: [],
        message: 'No patterns meet auto-apply confidence threshold'
      };
    }

    // Create backup
    if (createBackup) {
      await this._createBackup(projectContext);
    }

    // Apply patterns
    const patternIds = autoApplicable.map(r => r.patternId);
    const results = await this.applyPatterns(patternIds, projectContext, {
      dryRun: false,
      requireApproval: false,
      continueOnError: true
    });

    return {
      applied: results.filter(r => r.applied).length,
      total: results.length,
      results,
      recommendations: autoApplicable,
      metadata: {
        timestamp: new Date().toISOString(),
        minConfidence,
        backupCreated: createBackup
      }
    };
  }

  /**
   * Request strategic queen approval for pattern application
   * @param {string} patternId - Pattern ID
   * @param {Object} projectContext - Project context
   * @returns {Promise<Object>} - Approval request
   */
  async requestQueenApproval(patternId, projectContext) {
    const patterns = await this.matcher.getAllPatterns();
    const pattern = patterns.find(p => p.id === patternId);

    if (!pattern) {
      throw new Error(`Pattern not found: ${patternId}`);
    }

    const context = await this._buildProjectContext(projectContext);
    const contextVector = await this.matcher._extractContextFeatures(context);
    const similarity = pattern.vector ?
      this.matcher._calculateSimilarity(contextVector, pattern.vector) : 0.5;
    const confidence = pattern.confidence * similarity;

    return {
      patternId,
      pattern: {
        id: pattern.id,
        type: pattern.type,
        data: pattern.data,
        usageCount: pattern.usageCount
      },
      confidence,
      similarity,
      recommendation: this._generateApprovalRecommendation(pattern, context, confidence),
      approvalRequired: true,
      autoApplicable: confidence >= this.autoApplyThreshold,
      metadata: {
        requestedAt: new Date().toISOString(),
        context: projectContext.path
      }
    };
  }

  /**
   * Get application history
   * @param {Object} filters - Filter options
   * @returns {Array} - Filtered application history
   */
  getApplicationHistory(filters = {}) {
    let history = [...this.applicationHistory];

    if (filters.patternId) {
      history = history.filter(h => h.patternId === filters.patternId);
    }

    if (filters.successOnly) {
      history = history.filter(h => h.success);
    }

    if (filters.minConfidence) {
      history = history.filter(h => h.confidence >= filters.minConfidence);
    }

    return history.sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  }

  /**
   * Build comprehensive project context
   * @private
   */
  async _buildProjectContext(projectContext) {
    const context = { ...projectContext };

    // Add file analysis if path provided
    if (projectContext.path) {
      try {
        const files = await this._analyzeProjectFiles(projectContext.path);
        context.files = files;
      } catch (error) {
        console.warn('Failed to analyze project files:', error.message);
      }
    }

    // Add package.json analysis if available
    if (projectContext.path) {
      try {
        const packageJson = await this._readPackageJson(projectContext.path);
        context.dependencies = packageJson.dependencies;
        context.devDependencies = packageJson.devDependencies;
        context.technologies = this._detectTechnologies(packageJson);
      } catch (error) {
        // Package.json not available
      }
    }

    return context;
  }

  /**
   * Score and rank recommendations
   * @private
   */
  _scoreRecommendations(matches, context) {
    return matches.map(match => {
      const baseScore = match.confidence;
      const usageBonus = Math.min(match.metadata.usageCount / 100, 0.1);
      const recencyBonus = this._calculateRecencyBonus(match.metadata.lastUsed);

      const finalScore = baseScore + usageBonus + recencyBonus;

      return {
        patternId: match.pattern.id,
        patternType: match.pattern.type,
        confidence: finalScore,
        similarity: match.similarity,
        reasoning: this._generateReasoning(match, context),
        autoApplicable: finalScore >= this.autoApplyThreshold,
        rank: 0 // Will be set after sorting
      };
    }).sort((a, b) => b.confidence - a.confidence)
      .map((rec, idx) => ({ ...rec, rank: idx + 1 }));
  }

  /**
   * Create application plan
   * @private
   */
  _createApplicationPlan(recommendations, options) {
    const { autoApply, requireApproval } = options;

    const plan = {
      phases: [],
      totalPatterns: recommendations.length,
      estimatedTime: recommendations.length * 5, // 5 seconds per pattern
      requiresApproval: requireApproval
    };

    // Phase 1: Auto-applicable patterns
    const autoApplicable = recommendations.filter(r => r.autoApplicable);
    if (autoApplicable.length > 0 && autoApply) {
      plan.phases.push({
        phase: 1,
        name: 'Auto-apply high-confidence patterns',
        patterns: autoApplicable.map(r => r.patternId),
        requiresApproval: false
      });
    }

    // Phase 2: Patterns requiring approval
    const requireApprovalPatterns = recommendations.filter(r => !r.autoApplicable);
    if (requireApprovalPatterns.length > 0) {
      plan.phases.push({
        phase: autoApplicable.length > 0 ? 2 : 1,
        name: 'Patterns requiring strategic approval',
        patterns: requireApprovalPatterns.map(r => r.patternId),
        requiresApproval: true
      });
    }

    return plan;
  }

  /**
   * Simulate pattern application (dry run)
   * @private
   */
  async _simulateApplication(pattern, context) {
    // Simulate the application and return what would happen
    return {
      success: true,
      simulated: true,
      changes: this._predictChanges(pattern, context),
      message: 'Simulation completed successfully'
    };
  }

  /**
   * Execute actual pattern application
   * @private
   */
  async _executeApplication(pattern, context) {
    try {
      // Execute pattern-specific application logic
      const changes = await this._applyPatternChanges(pattern, context);

      return {
        success: true,
        simulated: false,
        changes,
        message: 'Pattern applied successfully'
      };
    } catch (error) {
      return {
        success: false,
        simulated: false,
        error: error.message,
        message: 'Pattern application failed'
      };
    }
  }

  /**
   * Create backup of project state
   * @private
   */
  async _createBackup(projectContext) {
    const backupPath = path.join(
      '.swarm',
      'backups',
      `pattern-backup-${Date.now()}.json`
    );

    await fs.mkdir(path.dirname(backupPath), { recursive: true });
    await fs.writeFile(
      backupPath,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        context: projectContext,
        path: projectContext.path
      }, null, 2)
    );

    return backupPath;
  }

  /**
   * Analyze project files
   * @private
   */
  async _analyzeProjectFiles(projectPath) {
    try {
      const entries = await fs.readdir(projectPath, { withFileTypes: true });
      return entries
        .filter(e => e.isFile())
        .map(e => e.name);
    } catch (error) {
      return [];
    }
  }

  /**
   * Read package.json
   * @private
   */
  async _readPackageJson(projectPath) {
    const packagePath = path.join(projectPath, 'package.json');
    const content = await fs.readFile(packagePath, 'utf8');
    return JSON.parse(content);
  }

  /**
   * Detect technologies from package.json
   * @private
   */
  _detectTechnologies(packageJson) {
    const technologies = [];
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    if (allDeps.react) technologies.push('react');
    if (allDeps.vue) technologies.push('vue');
    if (allDeps.express) technologies.push('express');
    if (allDeps.typescript) technologies.push('typescript');

    return technologies;
  }

  /**
   * Calculate recency bonus
   * @private
   */
  _calculateRecencyBonus(lastUsed) {
    if (!lastUsed) return 0;

    const daysSinceUse = (Date.now() - new Date(lastUsed)) / (1000 * 60 * 60 * 24);
    if (daysSinceUse < 7) return 0.05;
    if (daysSinceUse < 30) return 0.02;
    return 0;
  }

  /**
   * Generate reasoning for recommendation
   * @private
   */
  _generateReasoning(match, context) {
    const reasons = [];

    if (match.similarity > 0.95) {
      reasons.push('Extremely high similarity to successful past patterns');
    } else if (match.similarity > 0.90) {
      reasons.push('Very similar to proven successful patterns');
    } else if (match.similarity > 0.85) {
      reasons.push('Similar context to previous applications');
    }

    if (match.metadata.usageCount > 10) {
      reasons.push(`Proven track record (${match.metadata.usageCount} successful uses)`);
    }

    return reasons;
  }

  /**
   * Generate approval recommendation
   * @private
   */
  _generateApprovalRecommendation(pattern, context, confidence) {
    return {
      approve: confidence >= 0.85,
      confidence: (confidence * 100).toFixed(1) + '%',
      reasoning: [
        `Pattern confidence: ${(pattern.confidence * 100).toFixed(1)}%`,
        `Context similarity: ${(confidence / pattern.confidence * 100).toFixed(1)}%`,
        `Usage count: ${pattern.usageCount}`,
        confidence >= this.autoApplyThreshold ?
          'Meets auto-apply threshold' :
          'Requires manual approval'
      ]
    };
  }

  /**
   * Predict changes from pattern
   * @private
   */
  _predictChanges(pattern, context) {
    return {
      filesModified: [],
      filesCreated: [],
      dependencies: [],
      configuration: []
    };
  }

  /**
   * Apply pattern changes
   * @private
   */
  async _applyPatternChanges(pattern, context) {
    // Placeholder for actual pattern application logic
    // This would vary based on pattern type
    return {
      filesModified: [],
      filesCreated: [],
      dependencies: [],
      configuration: []
    };
  }

  /**
   * Close database connection
   */
  async close() {
    await this.matcher.close();
  }
}

module.exports = PatternApplicator;
