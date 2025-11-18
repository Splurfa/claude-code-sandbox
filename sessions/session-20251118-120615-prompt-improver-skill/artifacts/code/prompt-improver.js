#!/usr/bin/env node

/**
 * Prompt Improver Skill
 *
 * Analyzes user prompts and suggests improvements before execution.
 * Integrates with memory for baseline patterns and learning.
 *
 * Features:
 * - Mode detection (hive, swarm, wizard, direct)
 * - Intervention threshold evaluation
 * - Context inference for confirmation dialogs
 * - Memory integration for pattern learning
 * - Captain's log integration
 * - Token-efficient operation
 */

const { PromptAnalyzer } = require('./lib/analyzer');
const { MemoryManager } = require('./lib/memory-manager');
const { ConfirmationHandler } = require('./lib/confirmation');
const { LearningLog } = require('./lib/learning-log');
const { CaptainsLog } = require('./lib/captains-log');

class PromptImprover {
  constructor(config = {}) {
    this.config = {
      interventionThreshold: config.interventionThreshold || 0.7,
      autoLearn: config.autoLearn !== false,
      captainsLogPath: config.captainsLogPath || 'sessions/captains-log',
      memoryNamespace: config.memoryNamespace || 'prompt-improver',
      ...config
    };

    this.analyzer = new PromptAnalyzer(this.config);
    this.memory = new MemoryManager(this.config);
    this.confirmation = new ConfirmationHandler(this.config);
    this.learningLog = new LearningLog(this.config);
    this.captainsLog = new CaptainsLog(this.config);
  }

  /**
   * Main entry point - analyze and potentially improve a prompt
   * @param {string} prompt - Original user prompt
   * @param {object} options - Additional options
   * @returns {Promise<object>} Analysis result with improved prompt if needed
   */
  async improvePrompt(prompt, options = {}) {
    try {
      // Step 1: Analyze the prompt
      const analysis = await this.analyzer.analyze(prompt, options);

      // Step 2: Check intervention threshold
      if (!this._shouldIntervene(analysis)) {
        return {
          shouldImprove: false,
          originalPrompt: prompt,
          analysis,
          reason: 'Below intervention threshold'
        };
      }

      // Step 3: Retrieve baseline patterns from memory
      const patterns = await this.memory.getBaselinePatterns(analysis.mode);

      // Step 4: Generate improvement suggestions
      const suggestions = await this._generateSuggestions(analysis, patterns);

      // Step 5: Get user confirmation with context inference
      const confirmation = await this.confirmation.confirm(
        prompt,
        analysis,
        suggestions
      );

      // Step 6: Apply improvements if confirmed
      let result;
      if (confirmation.approved) {
        result = await this._applyImprovements(
          prompt,
          suggestions,
          confirmation.userSelections
        );

        // Log learning
        if (this.config.autoLearn) {
          await this.learningLog.record({
            originalPrompt: prompt,
            improvedPrompt: result.improvedPrompt,
            analysis,
            suggestions,
            userSelections: confirmation.userSelections,
            timestamp: Date.now()
          });
        }

        // Update captain's log
        await this.captainsLog.logImprovement({
          prompt,
          improvements: result.improvements,
          mode: analysis.mode,
          timestamp: Date.now()
        });

      } else {
        result = {
          shouldImprove: false,
          originalPrompt: prompt,
          reason: 'User declined improvements',
          analysis
        };

        // Still learn from rejection patterns
        if (this.config.autoLearn) {
          await this.learningLog.recordRejection({
            prompt,
            suggestions,
            reason: confirmation.reason,
            timestamp: Date.now()
          });
        }
      }

      return result;

    } catch (error) {
      console.error('[PromptImprover] Error:', error.message);
      return {
        shouldImprove: false,
        originalPrompt: prompt,
        error: error.message,
        fallback: true
      };
    }
  }

  /**
   * Detect mode from prompt (hive, swarm, wizard, direct)
   * @param {string} prompt - User prompt
   * @returns {string} Detected mode
   */
  detectMode(prompt) {
    return this.analyzer.detectMode(prompt);
  }

  /**
   * Evaluate if intervention is needed based on analysis
   * @param {object} analysis - Prompt analysis result
   * @returns {boolean} True if intervention needed
   */
  _shouldIntervene(analysis) {
    // Check overall quality score
    if (analysis.qualityScore >= this.config.interventionThreshold) {
      return false; // Prompt is good enough
    }

    // Check for critical issues that always need intervention
    if (analysis.criticalIssues && analysis.criticalIssues.length > 0) {
      return true;
    }

    // Check improvement potential
    if (analysis.improvementPotential > 0.3) {
      return true;
    }

    return false;
  }

  /**
   * Generate improvement suggestions based on analysis and patterns
   * @param {object} analysis - Prompt analysis
   * @param {object} patterns - Baseline patterns from memory
   * @returns {Promise<object>} Suggestions
   */
  async _generateSuggestions(analysis, patterns) {
    const suggestions = {
      structure: [],
      clarity: [],
      specificity: [],
      context: [],
      coordination: []
    };

    // Structure improvements
    if (analysis.structure.missing.length > 0) {
      suggestions.structure.push({
        type: 'add_missing_elements',
        elements: analysis.structure.missing,
        priority: 'high',
        description: 'Add missing structural elements for better task execution'
      });
    }

    // Clarity improvements
    if (analysis.clarity.ambiguousTerms.length > 0) {
      suggestions.clarity.push({
        type: 'clarify_terms',
        terms: analysis.clarity.ambiguousTerms,
        priority: 'medium',
        description: 'Clarify ambiguous terminology'
      });
    }

    // Specificity improvements
    if (analysis.specificity.score < 0.6) {
      suggestions.specificity.push({
        type: 'add_specifics',
        areas: analysis.specificity.vagueAreas,
        priority: 'high',
        description: 'Add specific details about requirements and deliverables'
      });
    }

    // Context improvements (from baseline patterns)
    if (patterns && patterns.bestPractices) {
      const missingContext = this._findMissingContext(analysis, patterns);
      if (missingContext.length > 0) {
        suggestions.context.push({
          type: 'add_context',
          items: missingContext,
          priority: 'medium',
          description: 'Include context based on successful past patterns'
        });
      }
    }

    // Coordination improvements (for multi-agent tasks)
    if (analysis.mode !== 'direct' && !analysis.coordination) {
      suggestions.coordination.push({
        type: 'add_coordination',
        recommendation: this._recommendCoordination(analysis),
        priority: 'high',
        description: 'Add coordination strategy for multi-agent execution'
      });
    }

    return suggestions;
  }

  /**
   * Find missing context based on baseline patterns
   * @param {object} analysis - Current analysis
   * @param {object} patterns - Baseline patterns
   * @returns {Array} Missing context items
   */
  _findMissingContext(analysis, patterns) {
    const missing = [];

    // Check for common context elements from patterns
    if (patterns.commonContext) {
      for (const [key, value] of Object.entries(patterns.commonContext)) {
        if (!analysis.context || !analysis.context[key]) {
          missing.push({
            key,
            suggestion: value,
            frequency: patterns.contextFrequency[key] || 0
          });
        }
      }
    }

    return missing;
  }

  /**
   * Recommend coordination approach based on analysis
   * @param {object} analysis - Prompt analysis
   * @returns {object} Coordination recommendation
   */
  _recommendCoordination(analysis) {
    const { complexity, agentCount, mode } = analysis;

    if (mode === 'hive') {
      return {
        type: 'hive-mind',
        topology: complexity > 0.7 ? 'hierarchical' : 'mesh',
        rationale: 'Complex task requires queen-led coordination'
      };
    }

    if (mode === 'swarm') {
      return {
        type: 'swarm',
        topology: agentCount > 5 ? 'hierarchical' : 'mesh',
        rationale: 'Agent count suggests hierarchical structure'
      };
    }

    if (mode === 'wizard') {
      return {
        type: 'wizard-guided',
        interactive: true,
        rationale: 'Wizard mode handles coordination automatically'
      };
    }

    return {
      type: 'direct',
      rationale: 'Simple task, direct execution'
    };
  }

  /**
   * Apply improvements to the prompt
   * @param {string} originalPrompt - Original prompt
   * @param {object} suggestions - Generated suggestions
   * @param {object} userSelections - User-approved selections
   * @returns {Promise<object>} Result with improved prompt
   */
  async _applyImprovements(originalPrompt, suggestions, userSelections) {
    let improvedPrompt = originalPrompt;
    const appliedImprovements = [];

    // Apply structure improvements
    if (userSelections.structure) {
      const structureResult = this._applyStructureImprovements(
        improvedPrompt,
        suggestions.structure,
        userSelections.structure
      );
      improvedPrompt = structureResult.prompt;
      appliedImprovements.push(...structureResult.improvements);
    }

    // Apply clarity improvements
    if (userSelections.clarity) {
      const clarityResult = this._applyClarityImprovements(
        improvedPrompt,
        suggestions.clarity,
        userSelections.clarity
      );
      improvedPrompt = clarityResult.prompt;
      appliedImprovements.push(...clarityResult.improvements);
    }

    // Apply specificity improvements
    if (userSelections.specificity) {
      const specificityResult = this._applySpecificityImprovements(
        improvedPrompt,
        suggestions.specificity,
        userSelections.specificity
      );
      improvedPrompt = specificityResult.prompt;
      appliedImprovements.push(...specificityResult.improvements);
    }

    // Apply context improvements
    if (userSelections.context) {
      const contextResult = this._applyContextImprovements(
        improvedPrompt,
        suggestions.context,
        userSelections.context
      );
      improvedPrompt = contextResult.prompt;
      appliedImprovements.push(...contextResult.improvements);
    }

    // Apply coordination improvements
    if (userSelections.coordination) {
      const coordResult = this._applyCoordinationImprovements(
        improvedPrompt,
        suggestions.coordination,
        userSelections.coordination
      );
      improvedPrompt = coordResult.prompt;
      appliedImprovements.push(...coordResult.improvements);
    }

    return {
      shouldImprove: true,
      originalPrompt,
      improvedPrompt,
      improvements: appliedImprovements,
      diff: this._generateDiff(originalPrompt, improvedPrompt)
    };
  }

  /**
   * Apply structure improvements
   */
  _applyStructureImprovements(prompt, suggestions, selections) {
    let improved = prompt;
    const improvements = [];

    for (const suggestion of suggestions) {
      if (selections.includes(suggestion.type)) {
        // Add missing structural elements
        const additions = this._formatStructuralAdditions(suggestion.elements);
        improved = `${improved}\n\n${additions}`;
        improvements.push({
          type: 'structure',
          action: suggestion.type,
          details: suggestion.elements
        });
      }
    }

    return { prompt: improved, improvements };
  }

  /**
   * Apply clarity improvements
   */
  _applyClarityImprovements(prompt, suggestions, selections) {
    let improved = prompt;
    const improvements = [];

    for (const suggestion of suggestions) {
      if (selections.includes(suggestion.type)) {
        // Clarify ambiguous terms
        for (const term of suggestion.terms) {
          const clarification = this._getClarification(term);
          improved = improved.replace(
            new RegExp(`\\b${term}\\b`, 'gi'),
            `${term} (${clarification})`
          );
        }
        improvements.push({
          type: 'clarity',
          action: suggestion.type,
          details: suggestion.terms
        });
      }
    }

    return { prompt: improved, improvements };
  }

  /**
   * Apply specificity improvements
   */
  _applySpecificityImprovements(prompt, suggestions, selections) {
    let improved = prompt;
    const improvements = [];

    for (const suggestion of suggestions) {
      if (selections.includes(suggestion.type)) {
        // Add specifics for vague areas
        const specifics = this._formatSpecifics(suggestion.areas);
        improved = `${improved}\n\n**Specific Requirements:**\n${specifics}`;
        improvements.push({
          type: 'specificity',
          action: suggestion.type,
          details: suggestion.areas
        });
      }
    }

    return { prompt: improved, improvements };
  }

  /**
   * Apply context improvements
   */
  _applyContextImprovements(prompt, suggestions, selections) {
    let improved = prompt;
    const improvements = [];

    for (const suggestion of suggestions) {
      if (selections.includes(suggestion.type)) {
        // Add context from patterns
        const contextAdditions = this._formatContext(suggestion.items);
        improved = `${improved}\n\n**Context:**\n${contextAdditions}`;
        improvements.push({
          type: 'context',
          action: suggestion.type,
          details: suggestion.items
        });
      }
    }

    return { prompt: improved, improvements };
  }

  /**
   * Apply coordination improvements
   */
  _applyCoordinationImprovements(prompt, suggestions, selections) {
    let improved = prompt;
    const improvements = [];

    for (const suggestion of suggestions) {
      if (selections.includes(suggestion.type)) {
        // Add coordination strategy
        const coordStrategy = this._formatCoordination(suggestion.recommendation);
        improved = `${improved}\n\n**Coordination:**\n${coordStrategy}`;
        improvements.push({
          type: 'coordination',
          action: suggestion.type,
          details: suggestion.recommendation
        });
      }
    }

    return { prompt: improved, improvements };
  }

  /**
   * Helper methods for formatting
   */
  _formatStructuralAdditions(elements) {
    return elements.map(el => `- ${el}`).join('\n');
  }

  _getClarification(term) {
    // Simple clarification - in real implementation would use patterns/context
    const clarifications = {
      'it': 'specify the exact component/feature',
      'that': 'clarify the specific element',
      'thing': 'define the concrete entity'
    };
    return clarifications[term.toLowerCase()] || 'please clarify';
  }

  _formatSpecifics(areas) {
    return areas.map(area => `- ${area.name}: ${area.suggestion || 'Add specific details'}`).join('\n');
  }

  _formatContext(items) {
    return items.map(item => `- ${item.key}: ${item.suggestion}`).join('\n');
  }

  _formatCoordination(recommendation) {
    return `Type: ${recommendation.type}\nTopology: ${recommendation.topology || 'auto'}\nRationale: ${recommendation.rationale}`;
  }

  _generateDiff(original, improved) {
    // Simple diff - shows what was added
    if (original === improved) {
      return { hasChanges: false };
    }

    const additions = improved.replace(original, '').trim();
    return {
      hasChanges: true,
      original: original.substring(0, 100) + '...',
      additions: additions.substring(0, 200) + '...'
    };
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const improver = new PromptImprover();

  switch (command) {
    case 'analyze':
      improver.improvePrompt(args[1], { dryRun: true })
        .then(result => console.log(JSON.stringify(result, null, 2)));
      break;

    case 'improve':
      improver.improvePrompt(args[1])
        .then(result => console.log(JSON.stringify(result, null, 2)));
      break;

    case 'detect-mode':
      const mode = improver.detectMode(args[1]);
      console.log(JSON.stringify({ mode }, null, 2));
      break;

    default:
      console.log('Usage:');
      console.log('  prompt-improver analyze "<prompt>"   - Analyze without improving');
      console.log('  prompt-improver improve "<prompt>"   - Analyze and improve with confirmation');
      console.log('  prompt-improver detect-mode "<prompt>" - Detect execution mode');
  }
}

module.exports = { PromptImprover };
