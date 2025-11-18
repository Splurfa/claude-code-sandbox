/**
 * Confirmation Handler
 *
 * Handles user confirmation with context inference
 * for prompt improvement suggestions.
 */

const readline = require('readline');

class ConfirmationHandler {
  constructor(config = {}) {
    this.config = config;
    this.autoApprove = config.autoApprove || false;
  }

  /**
   * Get user confirmation for improvements
   * @param {string} originalPrompt - Original prompt
   * @param {object} analysis - Analysis result
   * @param {object} suggestions - Generated suggestions
   * @returns {Promise<object>} Confirmation result
   */
  async confirm(originalPrompt, analysis, suggestions) {
    if (this.autoApprove) {
      return {
        approved: true,
        reason: 'Auto-approved by configuration',
        userSelections: this._autoSelectSuggestions(suggestions)
      };
    }

    // Display analysis summary
    this._displayAnalysisSummary(analysis);

    // Display suggestions with context
    const categorizedSuggestions = this._categorizeSuggestions(suggestions);
    this._displaySuggestions(categorizedSuggestions);

    // Infer context and provide smart defaults
    const smartDefaults = this._inferSmartDefaults(analysis, suggestions);

    // Get user selections
    const userSelections = await this._getUserSelections(
      categorizedSuggestions,
      smartDefaults
    );

    if (userSelections.cancelled) {
      return {
        approved: false,
        reason: 'User cancelled',
        userSelections: null
      };
    }

    return {
      approved: true,
      reason: 'User approved selections',
      userSelections
    };
  }

  /**
   * Display analysis summary
   */
  _displayAnalysisSummary(analysis) {
    console.log('\n=== Prompt Analysis ===');
    console.log(`Mode: ${analysis.mode}`);
    console.log(`Quality Score: ${(analysis.qualityScore * 100).toFixed(1)}%`);
    console.log(`Improvement Potential: ${(analysis.improvementPotential * 100).toFixed(1)}%`);

    if (analysis.criticalIssues && analysis.criticalIssues.length > 0) {
      console.log('\n⚠️  Critical Issues:');
      for (const issue of analysis.criticalIssues) {
        console.log(`  - [${issue.severity.toUpperCase()}] ${issue.message}`);
      }
    }

    console.log(`\nEstimated Complexity: ${(analysis.complexity * 100).toFixed(0)}%`);
    console.log(`Recommended Agents: ${analysis.agentCount}`);
    console.log('');
  }

  /**
   * Categorize suggestions by priority and type
   */
  _categorizeSuggestions(suggestions) {
    const categorized = {
      critical: [],
      high: [],
      medium: [],
      low: []
    };

    for (const [category, items] of Object.entries(suggestions)) {
      for (const item of items) {
        const priority = item.priority || 'medium';
        categorized[priority].push({
          category,
          ...item
        });
      }
    }

    return categorized;
  }

  /**
   * Display suggestions to user
   */
  _displaySuggestions(categorized) {
    console.log('=== Suggested Improvements ===\n');

    const priorities = ['critical', 'high', 'medium', 'low'];
    let suggestionNumber = 1;

    for (const priority of priorities) {
      const items = categorized[priority];
      if (items.length === 0) continue;

      console.log(`\n${priority.toUpperCase()} Priority:`);
      for (const item of items) {
        console.log(`\n${suggestionNumber}. [${item.category}] ${item.description}`);

        if (item.elements) {
          console.log(`   Missing: ${item.elements.join(', ')}`);
        }
        if (item.terms) {
          console.log(`   Terms: ${item.terms.join(', ')}`);
        }
        if (item.areas) {
          console.log(`   Areas: ${item.areas.map(a => a.name || a).join(', ')}`);
        }
        if (item.recommendation) {
          console.log(`   Strategy: ${item.recommendation.type}`);
          console.log(`   Rationale: ${item.recommendation.rationale}`);
        }

        suggestionNumber++;
      }
    }

    console.log('');
  }

  /**
   * Infer smart defaults based on analysis
   */
  _inferSmartDefaults(analysis, suggestions) {
    const defaults = {
      structure: [],
      clarity: [],
      specificity: [],
      context: [],
      coordination: []
    };

    // Auto-select critical and high priority items
    for (const [category, items] of Object.entries(suggestions)) {
      for (const item of items) {
        if (item.priority === 'critical' || item.priority === 'high') {
          defaults[category].push(item.type);
        }
      }
    }

    // Auto-select based on mode
    if (analysis.mode !== 'direct' && suggestions.coordination) {
      defaults.coordination = suggestions.coordination.map(s => s.type);
    }

    // Auto-select if improvement potential is very high
    if (analysis.improvementPotential > 0.6) {
      for (const [category, items] of Object.entries(suggestions)) {
        if (items.length > 0) {
          defaults[category] = items.map(s => s.type);
        }
      }
    }

    return defaults;
  }

  /**
   * Get user selections interactively
   */
  async _getUserSelections(categorized, smartDefaults) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (query) => new Promise((resolve) => {
      rl.question(query, resolve);
    });

    try {
      // Show smart defaults
      console.log('Smart defaults (auto-selected based on analysis):');
      for (const [category, items] of Object.entries(smartDefaults)) {
        if (items.length > 0) {
          console.log(`  ${category}: ${items.join(', ')}`);
        }
      }
      console.log('');

      const answer = await question(
        'Accept smart defaults? (yes/no/customize): '
      );

      if (answer.toLowerCase().startsWith('n')) {
        rl.close();
        return { cancelled: true };
      }

      if (answer.toLowerCase().startsWith('c')) {
        // Custom selection flow
        const customSelections = await this._getCustomSelections(
          rl,
          categorized,
          smartDefaults
        );
        rl.close();
        return customSelections;
      }

      // Accept smart defaults
      rl.close();
      return smartDefaults;

    } catch (error) {
      rl.close();
      throw error;
    }
  }

  /**
   * Get custom user selections
   */
  async _getCustomSelections(rl, categorized, defaults) {
    const question = (query) => new Promise((resolve) => {
      rl.question(query, resolve);
    });

    const selections = { ...defaults };

    console.log('\nCustomize selections (comma-separated numbers, or "all"/"none"):');

    // For each category with suggestions
    for (const [category, items] of Object.entries(categorized)) {
      const allItems = items.flat();
      if (allItems.length === 0) continue;

      console.log(`\n${category.toUpperCase()}:`);
      allItems.forEach((item, idx) => {
        console.log(`  ${idx + 1}. ${item.description}`);
      });

      const answer = await question(`Select for ${category}: `);

      if (answer.toLowerCase() === 'all') {
        selections[category] = allItems.map(item => item.type);
      } else if (answer.toLowerCase() === 'none') {
        selections[category] = [];
      } else if (answer.trim()) {
        const indices = answer.split(',').map(s => parseInt(s.trim()) - 1);
        selections[category] = indices
          .filter(i => i >= 0 && i < allItems.length)
          .map(i => allItems[i].type);
      }
    }

    return selections;
  }

  /**
   * Auto-select all suggestions (for auto-approve mode)
   */
  _autoSelectSuggestions(suggestions) {
    const selections = {};

    for (const [category, items] of Object.entries(suggestions)) {
      selections[category] = items.map(item => item.type);
    }

    return selections;
  }
}

module.exports = { ConfirmationHandler };
