/**
 * Confirmation Handler Module
 *
 * Implements user confirmation protocol for prompt improvements.
 * Provides transparent approval workflow with quality-based thresholds.
 */

class ConfirmationHandler {
  constructor(config = {}) {
    this.config = config;
    this.silentApprovalThreshold = config.silentApprovalThreshold || 9.0;
    this.requireClarificationThreshold = config.requireClarificationThreshold || 5.0;
    this.autoApprove = config.autoApprove || false;

    // Track confirmation history
    this.history = [];
  }

  /**
   * Request user confirmation for improvements
   * @param {string} originalPrompt - Original user prompt
   * @param {object} analysis - Prompt analysis result
   * @param {object} suggestions - Improvement suggestions
   * @returns {Promise<object>} Confirmation result
   */
  async confirm(originalPrompt, analysis, suggestions) {
    try {
      // Determine if confirmation is needed
      const shouldProceed = this.shouldProceed(analysis);

      // Handle different approval scenarios
      if (shouldProceed === 'silent') {
        // High quality - silent approval
        const result = {
          approved: true,
          mode: 'silent',
          reason: 'High quality prompt, minor improvements',
          userSelections: this._defaultSelections(suggestions),
          timestamp: Date.now()
        };

        this._recordConfirmation(originalPrompt, analysis, result);
        return result;
      }

      if (shouldProceed === 'clarify') {
        // Low quality - require clarification
        const result = {
          approved: false,
          mode: 'clarification_required',
          reason: 'Prompt quality too low, clarification needed before improvement',
          clarificationNeeded: this._identifyClarificationNeeds(analysis, suggestions),
          timestamp: Date.now()
        };

        this._recordConfirmation(originalPrompt, analysis, result);
        return result;
      }

      // Medium quality - interactive confirmation
      if (this.autoApprove) {
        // Auto-approve if configured (for testing/automation)
        const result = {
          approved: true,
          mode: 'auto',
          reason: 'Auto-approval enabled',
          userSelections: this._defaultSelections(suggestions),
          timestamp: Date.now()
        };

        this._recordConfirmation(originalPrompt, analysis, result);
        return result;
      }

      // Format confirmation message for user
      const message = this.formatConfirmationMessage(
        originalPrompt,
        analysis,
        suggestions
      );

      // In real implementation, would present interactive UI
      // For now, return structured confirmation request
      const result = {
        approved: true, // Default to approved in non-interactive mode
        mode: 'interactive',
        reason: 'Medium quality, improvements recommended',
        message,
        userSelections: this._defaultSelections(suggestions),
        requiresUserInput: true,
        timestamp: Date.now()
      };

      this._recordConfirmation(originalPrompt, analysis, result);
      return result;

    } catch (error) {
      console.error('[ConfirmationHandler] Error:', error.message);

      return {
        approved: false,
        mode: 'error',
        reason: error.message,
        error: true,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Determine if and how to proceed based on analysis
   * @param {object} analysis - Prompt analysis
   * @returns {string} Approval mode: 'silent', 'interactive', or 'clarify'
   */
  shouldProceed(analysis) {
    const qualityScore = (analysis.qualityDimensions?.overall || 0) * 10;

    // High quality (>= 9.0) - silent approval for minor improvements
    if (qualityScore >= this.silentApprovalThreshold) {
      return 'silent';
    }

    // Very low quality (< 5.0) - require clarification
    if (qualityScore < this.requireClarificationThreshold) {
      return 'clarify';
    }

    // Medium quality (5.0-8.9) - interactive confirmation
    return 'interactive';
  }

  /**
   * Format confirmation message for user presentation
   * @param {string} originalPrompt - Original prompt
   * @param {object} analysis - Analysis result
   * @param {object} suggestions - Improvement suggestions
   * @returns {object} Formatted message with options
   */
  formatConfirmationMessage(originalPrompt, analysis, suggestions) {
    const qualityScore = ((analysis.qualityDimensions?.overall || 0) * 10).toFixed(1);
    const interventionLevel = analysis.interventionAnalysis?.interventionLevel || 'none';

    // Build message structure
    const message = {
      title: 'Prompt Improvement Recommendations',
      summary: {
        currentQuality: `${qualityScore}/10.0`,
        interventionLevel,
        mode: analysis.mode,
        agentCount: analysis.agentCount
      },
      issues: this._formatIssues(analysis.interventionAnalysis),
      improvements: this._formatImprovements(suggestions),
      preview: this._generatePreview(originalPrompt, suggestions),
      options: this._formatOptions(suggestions)
    };

    return message;
  }

  /**
   * Identify what clarification is needed
   * @private
   */
  _identifyClarificationNeeds(analysis, suggestions) {
    const needs = [];

    // Critical file routing issues
    if (analysis.qualityDimensions?.fileRoutingCompliance < 0.5) {
      needs.push({
        type: 'file_routing',
        priority: 'critical',
        question: 'Where should files be saved?',
        suggestion: 'Specify: sessions/$SESSION_ID/artifacts/<subdirectory>/'
      });
    }

    // Missing structural elements
    const missing = analysis.qualityDimensions?.details?.structuralCompleteness?.missing || [];
    if (missing.length > 0) {
      needs.push({
        type: 'structure',
        priority: 'high',
        question: `What are the ${missing.join(', ')}?`,
        suggestion: 'Define clear goals, constraints, and deliverables'
      });
    }

    // Ambiguous terms
    const ambiguous = analysis.clarity?.ambiguousTerms || [];
    if (ambiguous.length > 3) {
      needs.push({
        type: 'clarity',
        priority: 'high',
        question: `What do these terms refer to: ${ambiguous.slice(0, 3).join(', ')}?`,
        suggestion: 'Replace pronouns and vague terms with specific nouns'
      });
    }

    // Missing coordination strategy
    if (analysis.mode !== 'direct' && analysis.qualityDimensions?.coordinationStrategy < 0.4) {
      needs.push({
        type: 'coordination',
        priority: 'high',
        question: 'How should agents coordinate?',
        suggestion: 'Specify topology (mesh/hierarchical), memory strategy, and execution order'
      });
    }

    return needs;
  }

  /**
   * Format issues for display
   * @private
   */
  _formatIssues(interventionAnalysis) {
    if (!interventionAnalysis?.allIssues) return [];

    return interventionAnalysis.allIssues.map(issue => ({
      type: issue.type,
      severity: issue.severity,
      message: issue.message,
      current: issue.actual?.toFixed(2),
      threshold: issue.threshold?.toFixed(2)
    }));
  }

  /**
   * Format improvements for display
   * @private
   */
  _formatImprovements(suggestions) {
    const formatted = {};

    for (const [category, items] of Object.entries(suggestions)) {
      if (items && items.length > 0) {
        formatted[category] = items.map(item => ({
          type: item.type,
          priority: item.priority,
          description: item.description,
          recommendation: item.recommendation
        }));
      }
    }

    return formatted;
  }

  /**
   * Generate preview of improvements
   * @private
   */
  _generatePreview(originalPrompt, suggestions) {
    // Generate a simple preview showing what would be added
    const additions = [];

    if (suggestions.fileRouting && suggestions.fileRouting.length > 0) {
      additions.push('+ File routing specification');
    }

    if (suggestions.structure && suggestions.structure.length > 0) {
      additions.push('+ Structural elements (goal, constraints, deliverables)');
    }

    if (suggestions.clarity && suggestions.clarity.length > 0) {
      additions.push('+ Clarity improvements (replace ambiguous terms)');
    }

    if (suggestions.coordination && suggestions.coordination.length > 0) {
      additions.push('+ Coordination strategy (topology, memory)');
    }

    return {
      original: originalPrompt.substring(0, 100) + '...',
      additions,
      estimatedLength: originalPrompt.length + (additions.length * 50)
    };
  }

  /**
   * Format user options
   * @private
   */
  _formatOptions(suggestions) {
    const options = [];

    if (suggestions.fileRouting && suggestions.fileRouting.length > 0) {
      options.push({
        id: 'file_routing',
        label: 'Fix File Routing',
        description: 'Add session artifact paths',
        recommended: true,
        selected: true
      });
    }

    if (suggestions.structure && suggestions.structure.length > 0) {
      options.push({
        id: 'structure',
        label: 'Improve Structure',
        description: 'Add missing structural elements',
        recommended: true,
        selected: true
      });
    }

    if (suggestions.clarity && suggestions.clarity.length > 0) {
      options.push({
        id: 'clarity',
        label: 'Enhance Clarity',
        description: 'Replace ambiguous terms',
        recommended: true,
        selected: true
      });
    }

    if (suggestions.coordination && suggestions.coordination.length > 0) {
      options.push({
        id: 'coordination',
        label: 'Add Coordination',
        description: 'Define multi-agent strategy',
        recommended: true,
        selected: true
      });
    }

    if (suggestions.context && suggestions.context.length > 0) {
      options.push({
        id: 'context',
        label: 'Add Context',
        description: 'Include mode-specific best practices',
        recommended: false,
        selected: false
      });
    }

    return options;
  }

  /**
   * Get default selections (approve all recommended improvements)
   * @private
   */
  _defaultSelections(suggestions) {
    return {
      fileRouting: suggestions.fileRouting && suggestions.fileRouting.length > 0,
      structure: suggestions.structure && suggestions.structure.length > 0,
      clarity: suggestions.clarity && suggestions.clarity.length > 0,
      coordination: suggestions.coordination && suggestions.coordination.length > 0,
      context: false // Optional improvements off by default
    };
  }

  /**
   * Record confirmation in history
   * @private
   */
  _recordConfirmation(prompt, analysis, result) {
    this.history.push({
      promptSnippet: prompt.substring(0, 100),
      qualityScore: analysis.qualityDimensions?.overall,
      mode: result.mode,
      approved: result.approved,
      timestamp: result.timestamp
    });

    // Keep only last 50 confirmations
    if (this.history.length > 50) {
      this.history.shift();
    }
  }

  /**
   * Get confirmation statistics
   * @returns {object} Statistics
   */
  getStats() {
    const total = this.history.length;
    const approved = this.history.filter(h => h.approved).length;
    const byMode = this.history.reduce((acc, h) => {
      acc[h.mode] = (acc[h.mode] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      approved,
      rejected: total - approved,
      approvalRate: total > 0 ? (approved / total * 100).toFixed(1) + '%' : 'N/A',
      byMode
    };
  }

  /**
   * Get recent confirmation history
   * @param {number} limit - Number of recent items to return
   * @returns {Array} Recent confirmations
   */
  getRecentHistory(limit = 10) {
    return this.history.slice(-limit);
  }

  /**
   * Clear confirmation history
   */
  clearHistory() {
    this.history = [];
  }
}

module.exports = { ConfirmationHandler };
