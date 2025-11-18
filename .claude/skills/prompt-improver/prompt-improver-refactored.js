#!/usr/bin/env node

/**
 * Refactored Prompt Improver Skill
 *
 * Integrates Claude Code intelligence via Context7 for grounded
 * prompt improvements based on actual workspace best practices.
 *
 * Features:
 * - Context7 integration with smart caching
 * - Evidence-based intervention thresholds
 * - Claude Code-grounded quality scoring
 * - Enhanced Captain's Log integration
 * - Token-efficient operation
 */

const { EnhancedPromptAnalyzer } = require('./lib/analyzer-enhanced');
const { Context7Integration } = require('./lib/context-aware');
const { MemoryManager } = require('./lib/memory-manager');
const { ConfirmationHandler } = require('./lib/confirmation');
const { LearningLog } = require('./lib/learning-log');
const { EnhancedCaptainsLog } = require('./lib/captains-log-enhanced');

class RefactoredPromptImprover {
  constructor(config = {}) {
    this.config = {
      interventionThreshold: config.interventionThreshold || 0.7,
      autoLearn: config.autoLearn !== false,
      captainsLogPath: config.captainsLogPath || 'sessions/captains-log',
      memoryNamespace: config.memoryNamespace || 'prompt-improver',
      context7Enabled: config.context7Enabled !== false,
      cacheTTL: config.cacheTTL || 3600000, // 1 hour
      ...config
    };

    this.analyzer = new EnhancedPromptAnalyzer(this.config);
    this.context7 = new Context7Integration(this.config);
    this.memory = new MemoryManager(this.config);
    this.confirmation = new ConfirmationHandler(this.config);
    this.learningLog = new LearningLog(this.config);
    this.captainsLog = new EnhancedCaptainsLog(this.config);

    // Session tracking
    this.sessionStats = {
      startTime: Date.now(),
      totalAnalyzed: 0,
      totalImproved: 0,
      context7Consultations: 0,
      cacheHits: 0,
      issues: []
    };
  }

  /**
   * Main entry point - analyze and potentially improve a prompt
   * @param {string} prompt - Original user prompt
   * @param {object} options - Additional options
   * @returns {Promise<object>} Analysis result with improved prompt if needed
   */
  async improvePrompt(prompt, options = {}) {
    this.sessionStats.totalAnalyzed++;

    try {
      // Step 1: Enhanced analysis with Claude Code grounding
      const analysis = await this.analyzer.analyze(prompt, options);

      // Track issues for statistics
      if (analysis.interventionAnalysis?.allIssues) {
        this.sessionStats.issues.push(...analysis.interventionAnalysis.allIssues);
      }

      // Step 2: Log Context7 consultation if used
      if (analysis.context7Insights && !analysis.context7Insights.fallback) {
        this.sessionStats.context7Consultations++;

        const cacheStats = this.context7.getCacheStats();
        const wasCached = cacheStats.entries > 0;
        if (wasCached) this.sessionStats.cacheHits++;

        await this.captainsLog.logContext7Consultation({
          timestamp: Date.now(),
          trigger: this._identifyContext7Trigger(analysis),
          mode: analysis.mode,
          sections: this._extractSectionsConsulted(analysis.context7Insights),
          insights: analysis.context7Insights,
          cacheHit: wasCached,
          cacheAge: wasCached ? (Date.now() - cacheStats.newestEntry) : 0
        });
      }

      // Step 3: Check if intervention is needed
      if (!analysis.interventionAnalysis?.shouldIntervene) {
        return {
          shouldImprove: false,
          originalPrompt: prompt,
          analysis,
          reason: 'Quality meets threshold, no intervention needed'
        };
      }

      // Step 4: Retrieve baseline patterns from memory
      const patterns = await this.memory.getBaselinePatterns(analysis.mode);

      // Step 5: Generate improvement suggestions using Context7 insights
      const suggestions = await this._generateSuggestions(analysis, patterns);

      // Step 6: Get user confirmation
      const confirmation = await this.confirmation.confirm(
        prompt,
        analysis,
        suggestions
      );

      // Step 7: Apply improvements if confirmed
      let result;
      if (confirmation.approved) {
        result = await this._applyImprovements(
          prompt,
          suggestions,
          confirmation.userSelections,
          analysis
        );

        this.sessionStats.totalImproved++;

        // Log learning
        if (this.config.autoLearn) {
          await this.learningLog.record({
            originalPrompt: prompt,
            improvedPrompt: result.improvedPrompt,
            analysis,
            suggestions,
            userSelections: confirmation.userSelections,
            context7Used: !!analysis.context7Insights,
            timestamp: Date.now()
          });
        }

        // Update captain's log
        await this.captainsLog.logImprovement({
          prompt,
          improvements: result.improvements,
          mode: analysis.mode,
          qualityScore: analysis.qualityDimensions?.overall,
          interventionLevel: analysis.interventionAnalysis?.interventionLevel,
          context7Used: !!analysis.context7Insights,
          timestamp: Date.now()
        });

      } else {
        result = {
          shouldImprove: false,
          originalPrompt: prompt,
          reason: 'User declined improvements',
          analysis
        };

        // Learn from rejection patterns
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
   * Detect mode from prompt
   */
  detectMode(prompt) {
    return this.analyzer.detectMode(prompt);
  }

  /**
   * Generate improvement suggestions using Context7 insights
   */
  async _generateSuggestions(analysis, patterns) {
    const suggestions = {
      structure: [],
      clarity: [],
      specificity: [],
      context: [],
      coordination: [],
      fileRouting: []
    };

    // Use Context7 insights to inform suggestions
    const insights = analysis.context7Insights;

    // File routing (critical)
    if (analysis.qualityDimensions?.fileRoutingCompliance < 0.5) {
      suggestions.fileRouting.push({
        type: 'fix_routing',
        priority: 'critical',
        description: 'Fix file routing to use session artifacts',
        recommendation: insights?.recommendations?.find(r =>
          r.includes('sessions/$SESSION_ID')
        ) || 'Use sessions/$SESSION_ID/artifacts/ for all file operations'
      });
    }

    // Structure improvements (grounded in Claude Code principles)
    if (analysis.qualityDimensions?.structuralCompleteness < 0.7) {
      const missingElements = analysis.qualityDimensions?.details?.structuralCompleteness?.missing || [];

      suggestions.structure.push({
        type: 'add_missing_elements',
        elements: missingElements,
        priority: 'high',
        description: 'Add missing structural elements',
        claudeCodePrinciples: insights?.principles?.filter(p =>
          p.includes('goal') || p.includes('constraint') || p.includes('deliverable')
        ) || []
      });
    }

    // Clarity improvements (based on Claude Code best practices)
    if (analysis.qualityDimensions?.clarityActionability < 0.7) {
      const ambiguousTerms = analysis.clarity?.ambiguousTerms || [];

      suggestions.clarity.push({
        type: 'clarify_terms',
        terms: ambiguousTerms,
        priority: 'high',
        description: 'Replace ambiguous terms with specific details',
        claudeCodePrinciples: insights?.principles?.filter(p =>
          p.includes('specific') || p.includes('actionable')
        ) || ['Specificity beats vagueness']
      });
    }

    // Coordination improvements (with Context7 patterns)
    if (analysis.qualityDimensions?.coordinationStrategy < 0.7 && analysis.mode !== 'direct') {
      suggestions.coordination.push({
        type: 'add_coordination',
        recommendation: this._recommendCoordination(analysis),
        priority: 'high',
        description: 'Add coordination strategy for multi-agent execution',
        claudeCodePatterns: insights?.patterns?.filter(p =>
          p.includes('coordination') || p.includes('memory') || p.includes('topology')
        ) || [],
        examples: insights?.examples || []
      });
    }

    // Mode-specific best practices
    if (analysis.qualityDimensions?.modeBestPractices < 0.7) {
      suggestions.context.push({
        type: 'add_mode_practices',
        mode: analysis.mode,
        priority: 'medium',
        description: `Apply ${analysis.mode}-specific best practices`,
        recommendations: insights?.recommendations || [],
        antipatterns: insights?.antipatterns || []
      });
    }

    return suggestions;
  }

  /**
   * Recommend coordination approach based on analysis and Context7 insights
   */
  _recommendCoordination(analysis) {
    const { complexity, agentCount, mode, context7Insights } = analysis;
    const insights = context7Insights || {};

    if (mode === 'hive') {
      return {
        type: 'hive-mind',
        topology: complexity > 0.7 ? 'hierarchical' : 'mesh',
        rationale: 'Complex task requires queen-led coordination',
        command: '/hive-mind:wizard',
        patterns: insights.patterns?.filter(p => p.includes('hive') || p.includes('queen')) || []
      };
    }

    if (mode === 'swarm') {
      return {
        type: 'swarm',
        topology: agentCount > 5 ? 'hierarchical' : 'mesh',
        rationale: 'Agent count suggests hierarchical structure',
        patterns: insights.patterns?.filter(p => p.includes('swarm') || p.includes('Task')) || []
      };
    }

    if (mode === 'wizard') {
      return {
        type: 'wizard-guided',
        interactive: true,
        rationale: 'Wizard mode handles coordination automatically',
        patterns: insights.patterns?.filter(p => p.includes('wizard')) || []
      };
    }

    return {
      type: 'direct',
      rationale: 'Simple task, direct execution'
    };
  }

  /**
   * Apply improvements to the prompt
   */
  async _applyImprovements(originalPrompt, suggestions, userSelections, analysis) {
    let improvedPrompt = originalPrompt;
    const appliedImprovements = [];

    // Apply file routing fixes (highest priority)
    if (suggestions.fileRouting && suggestions.fileRouting.length > 0) {
      for (const suggestion of suggestions.fileRouting) {
        const fixResult = this._applyFileRoutingFix(improvedPrompt, suggestion);
        improvedPrompt = fixResult.prompt;
        appliedImprovements.push(...fixResult.improvements);
      }
    }

    // Apply structure improvements
    if (userSelections.structure && suggestions.structure) {
      for (const suggestion of suggestions.structure) {
        const structResult = this._applyStructureImprovements(
          improvedPrompt,
          suggestion,
          analysis.context7Insights
        );
        improvedPrompt = structResult.prompt;
        appliedImprovements.push(...structResult.improvements);
      }
    }

    // Apply clarity improvements
    if (userSelections.clarity && suggestions.clarity) {
      for (const suggestion of suggestions.clarity) {
        const clarityResult = this._applyClarityImprovements(
          improvedPrompt,
          suggestion
        );
        improvedPrompt = clarityResult.prompt;
        appliedImprovements.push(...clarityResult.improvements);
      }
    }

    // Apply coordination improvements
    if (userSelections.coordination && suggestions.coordination) {
      for (const suggestion of suggestions.coordination) {
        const coordResult = this._applyCoordinationImprovements(
          improvedPrompt,
          suggestion,
          analysis.context7Insights
        );
        improvedPrompt = coordResult.prompt;
        appliedImprovements.push(...coordResult.improvements);
      }
    }

    return {
      shouldImprove: true,
      originalPrompt,
      improvedPrompt,
      improvements: appliedImprovements,
      qualityImprovement: {
        initial: analysis.qualityDimensions?.overall || 0,
        estimated: this._estimateFinalQuality(analysis, appliedImprovements)
      },
      diff: this._generateDiff(originalPrompt, improvedPrompt)
    };
  }

  /**
   * Apply file routing fix
   */
  _applyFileRoutingFix(prompt, suggestion) {
    let improved = prompt;
    const improvements = [];

    // Add file routing specification
    const sessionPath = 'sessions/$SESSION_ID/artifacts/';
    if (!improved.includes(sessionPath)) {
      improved = `${improved}\n\n**File Routing**: Save all files to ${sessionPath}<subdirectory>/`;
      improvements.push({
        type: 'file_routing',
        action: 'Added session artifact path',
        details: suggestion.recommendation
      });
    }

    return { prompt: improved, improvements };
  }

  /**
   * Apply structure improvements with Claude Code principles
   */
  _applyStructureImprovements(prompt, suggestion, insights) {
    let improved = prompt;
    const improvements = [];

    const additions = [];

    if (suggestion.elements.includes('Goal')) {
      additions.push('**Goal**: [Define what you want to build/achieve]');
    }
    if (suggestion.elements.includes('Constraints')) {
      additions.push('**Constraints**: [List any limitations or requirements]');
    }
    if (suggestion.elements.includes('Deliverables')) {
      additions.push('**Deliverables**: [Specify expected outputs]');
    }

    if (additions.length > 0) {
      improved = `${improved}\n\n${additions.join('\n')}`;
      improvements.push({
        type: 'structure',
        action: 'Added missing structural elements',
        details: suggestion.elements,
        grounding: suggestion.claudeCodePrinciples || []
      });
    }

    return { prompt: improved, improvements };
  }

  /**
   * Apply clarity improvements
   */
  _applyClarityImprovements(prompt, suggestion) {
    let improved = prompt;
    const improvements = [];

    // Note ambiguous terms for user to clarify
    if (suggestion.terms && suggestion.terms.length > 0) {
      improved = `${improved}\n\n**Please Clarify**: Replace these ambiguous terms: ${suggestion.terms.join(', ')}`;
      improvements.push({
        type: 'clarity',
        action: 'Flagged ambiguous terms for clarification',
        details: suggestion.terms
      });
    }

    return { prompt: improved, improvements };
  }

  /**
   * Apply coordination improvements with Context7 patterns
   */
  _applyCoordinationImprovements(prompt, suggestion, insights) {
    let improved = prompt;
    const improvements = [];

    const coordination = suggestion.recommendation;
    const coordText = [
      `**Coordination Strategy**:`,
      `- Type: ${coordination.type}`,
      `- Topology: ${coordination.topology || 'auto'}`,
      `- Rationale: ${coordination.rationale}`
    ];

    if (coordination.command) {
      coordText.push(`- Recommended: ${coordination.command}`);
    }

    if (coordination.patterns && coordination.patterns.length > 0) {
      coordText.push(`- Patterns: ${coordination.patterns.join(', ')}`);
    }

    improved = `${improved}\n\n${coordText.join('\n')}`;

    improvements.push({
      type: 'coordination',
      action: 'Added coordination strategy',
      details: coordination,
      grounding: coordination.patterns || []
    });

    return { prompt: improved, improvements };
  }

  /**
   * Estimate final quality after improvements
   */
  _estimateFinalQuality(analysis, improvements) {
    let estimated = analysis.qualityDimensions?.overall || 0;

    // Each improvement type adds to quality
    const improvementBoost = {
      file_routing: 0.15,
      structure: 0.10,
      clarity: 0.10,
      coordination: 0.10
    };

    for (const improvement of improvements) {
      estimated += improvementBoost[improvement.type] || 0.05;
    }

    return Math.min(1.0, estimated);
  }

  /**
   * Generate diff
   */
  _generateDiff(original, improved) {
    if (original === improved) {
      return { hasChanges: false };
    }

    const additions = improved.replace(original, '').trim();
    return {
      hasChanges: true,
      original: original.substring(0, 100) + '...',
      additions: additions.substring(0, 300) + '...'
    };
  }

  /**
   * Identify Context7 trigger reason
   */
  _identifyContext7Trigger(analysis) {
    if (analysis.complexity > 0.6) return 'High complexity';
    if (analysis.qualityDimensions?.overall < 0.5) return 'Low quality score';
    if (analysis.interventionAnalysis?.criticalIssues?.length > 0) return 'Critical issues';
    if (analysis.mode !== 'direct' && analysis.agentCount > 2) return 'Multi-agent coordination';
    return 'Quality threshold';
  }

  /**
   * Extract sections consulted from Context7 insights
   */
  _extractSectionsConsulted(insights) {
    // In real implementation, would track which sections were fetched
    const sections = [];

    if (insights.principles?.some(p => p.includes('hive') || p.includes('queen'))) {
      sections.push('advanced/hive-mind');
    }
    if (insights.principles?.some(p => p.includes('swarm') || p.includes('Task'))) {
      sections.push('advanced/swarm-coordination');
    }
    if (insights.principles?.some(p => p.includes('session') || p.includes('artifacts'))) {
      sections.push('essentials/session-management');
    }
    if (insights.principles?.some(p => p.includes('memory') || p.includes('coordination'))) {
      sections.push('essentials/memory-coordination');
    }

    return sections.length > 0 ? sections : ['general-best-practices'];
  }

  /**
   * End session and generate summary
   */
  async endSession() {
    const duration = Date.now() - this.sessionStats.startTime;
    const context7Stats = this.context7.getCacheStats();

    // Aggregate issue types
    const issueTypes = {};
    for (const issue of this.sessionStats.issues) {
      issueTypes[issue.type] = (issueTypes[issue.type] || 0) + 1;
    }

    const topIssues = Object.entries(issueTypes)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const summary = {
      timestamp: Date.now(),
      sessionDuration: duration,
      totalAnalyzed: this.sessionStats.totalAnalyzed,
      totalImproved: this.sessionStats.totalImproved,
      context7Stats: {
        consultations: this.sessionStats.context7Consultations,
        cacheEntries: context7Stats.entries,
        cacheHits: this.sessionStats.cacheHits,
        tokenSavings: this._estimateTokenSavings()
      },
      topIssues
    };

    // Log to captain's log
    await this.captainsLog.logSessionSummary(summary);

    // Clear Context7 cache
    this.analyzer.clearContext7Cache();

    return summary;
  }

  /**
   * Estimate token savings from caching
   */
  _estimateTokenSavings() {
    // Rough estimate: each Context7 fetch ~500 tokens, cache hit saves ~400 tokens
    const savingsPerHit = 400;
    const totalSavings = this.sessionStats.cacheHits * savingsPerHit;

    if (totalSavings === 0) return 'N/A';
    if (totalSavings < 1000) return `~${totalSavings} tokens`;
    return `~${(totalSavings / 1000).toFixed(1)}k tokens`;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  const improver = new RefactoredPromptImprover();

  switch (command) {
    case 'analyze':
      improver.improvePrompt(args[1], { dryRun: true })
        .then(result => {
          console.log(JSON.stringify(result, null, 2));
          return improver.endSession();
        });
      break;

    case 'improve':
      improver.improvePrompt(args[1])
        .then(result => {
          console.log(JSON.stringify(result, null, 2));
          return improver.endSession();
        });
      break;

    case 'detect-mode':
      const mode = improver.detectMode(args[1]);
      console.log(JSON.stringify({ mode }, null, 2));
      break;

    case 'session-end':
      improver.endSession()
        .then(summary => console.log(JSON.stringify(summary, null, 2)));
      break;

    default:
      console.log('Usage:');
      console.log('  prompt-improver-refactored analyze "<prompt>"   - Analyze with Context7');
      console.log('  prompt-improver-refactored improve "<prompt>"   - Improve with Claude Code grounding');
      console.log('  prompt-improver-refactored detect-mode "<prompt>" - Detect execution mode');
      console.log('  prompt-improver-refactored session-end          - End session and show summary');
  }
}

module.exports = { RefactoredPromptImprover };
