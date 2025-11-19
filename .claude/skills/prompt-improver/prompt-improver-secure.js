#!/usr/bin/env node

/**
 * Secure Prompt Improver Skill v2.0.1
 *
 * SECURITY FIX: Prevents prompt injection attacks
 *
 * Changes from v2.0.0:
 * - Added PromptSanitizer to treat user input as data only
 * - Isolated analysis scope to prevent directive injection
 * - Validated quality scores cannot be overridden
 * - Protected Context7 consultation from injection
 * - Added security event logging
 *
 * Security Guarantees:
 * 1. User prompts are NEVER interpreted as system directives
 * 2. Quality scores are ALWAYS computed from scratch
 * 3. Context7 insights are ALWAYS from actual documentation
 * 4. File routing recommendations ALWAYS stay within session
 * 5. Memory coordination CANNOT be manipulated via prompts
 */

const { EnhancedPromptAnalyzer } = require('./lib/analyzer-enhanced-secure');
const { Context7Integration } = require('./lib/context-aware-secure');
const { MemoryManager } = require('./lib/memory-manager');
const { ConfirmationHandler } = require('./lib/confirmation');
const { LearningLog } = require('./lib/learning-log');
const { EnhancedCaptainsLog } = require('./lib/captains-log-enhanced');
const { PromptSanitizer } = require('./lib/prompt-sanitizer');

class SecurePromptImprover {
  constructor(config = {}) {
    this.config = {
      interventionThreshold: config.interventionThreshold || 0.7,
      autoLearn: config.autoLearn !== false,
      captainsLogPath: config.captainsLogPath || 'sessions/captains-log',
      memoryNamespace: config.memoryNamespace || 'prompt-improver',
      context7Enabled: config.context7Enabled !== false,
      cacheTTL: config.cacheTTL || 3600000, // 1 hour

      // Security settings
      securityLogging: config.securityLogging !== false,
      strictMode: config.strictMode !== false,
      injectionPenalty: config.injectionPenalty || 0.3,  // 30% quality penalty for injection attempts

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
      issues: [],

      // Security metrics
      injectionAttemptsDetected: 0,
      injectionAttemptsBlocked: 0,
      securityEvents: []
    };
  }

  /**
   * Main entry point - analyze and potentially improve a prompt
   *
   * SECURITY: All user input is sanitized before analysis
   *
   * @param {string} prompt - Raw user input (UNTRUSTED)
   * @param {object} options - Additional options
   * @returns {Promise<object>} Analysis result with improved prompt if needed
   */
  async improvePrompt(prompt, options = {}) {
    this.sessionStats.totalAnalyzed++;

    try {
      // SECURITY LAYER 1: Sanitize user input
      const sanitizedContext = PromptSanitizer.sanitize(prompt);

      // Log injection attempts if detected
      if (sanitizedContext.security.injectionAttempts.length > 0) {
        this.sessionStats.injectionAttemptsDetected++;
        this.sessionStats.injectionAttemptsBlocked += sanitizedContext.security.injectionAttempts.length;

        for (const attempt of sanitizedContext.security.injectionAttempts) {
          const event = PromptSanitizer.logSecurityEvent(attempt, sanitizedContext);
          this.sessionStats.securityEvents.push(event);

          // Log to captain's log
          if (this.config.securityLogging) {
            await this.captainsLog.logSecurityEvent({
              type: 'injection_attempt',
              severity: attempt.severity,
              details: attempt,
              timestamp: Date.now()
            });
          }
        }

        // In strict mode, reject prompts with critical injection attempts
        if (this.config.strictMode) {
          const criticalAttempts = sanitizedContext.security.injectionAttempts.filter(
            a => a.severity === 'critical'
          );

          if (criticalAttempts.length > 0) {
            return {
              shouldImprove: false,
              originalPrompt: prompt,
              error: 'Prompt contains critical injection attempts and was rejected in strict mode',
              securityRejection: true,
              injectionAttempts: criticalAttempts,
              reason: 'Security policy violation'
            };
          }
        }
      }

      // SECURITY LAYER 2: Enhanced analysis with isolated context
      const analysis = await this.analyzer.analyzeSecure(sanitizedContext, options);

      // Track issues for statistics
      if (analysis.interventionAnalysis?.allIssues) {
        this.sessionStats.issues.push(...analysis.interventionAnalysis.allIssues);
      }

      // SECURITY LAYER 3: Validate Context7 insights (if used)
      if (analysis.context7Insights) {
        const validatedInsights = PromptSanitizer.validateContext7Response(analysis.context7Insights);

        if (!validatedInsights) {
          console.warn('[Security] Context7 response failed validation, using fallback');
          analysis.context7Insights = null;
          analysis.context7ValidationFailed = true;
        } else {
          analysis.context7Insights = validatedInsights;
        }

        // Log Context7 consultation
        if (!analysis.context7Insights?.fallback) {
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
            cacheAge: wasCached ? (Date.now() - cacheStats.newestEntry) : 0,
            securityValidated: true
          });
        }
      }

      // SECURITY LAYER 4: Validate quality scores
      if (analysis.qualityDimensions) {
        analysis.qualityDimensions = PromptSanitizer.validateQualityScores(
          analysis.qualityDimensions,
          sanitizedContext
        );

        // Recalculate overall score from validated dimensions
        const dimensions = Object.values(analysis.qualityDimensions);
        analysis.qualityDimensions.overall = dimensions.reduce((a, b) => a + b, 0) / dimensions.length;
      }

      // Step 3: Check if intervention is needed
      if (!analysis.interventionAnalysis?.shouldIntervene) {
        return {
          shouldImprove: false,
          originalPrompt: prompt,
          analysis,
          sanitizedContext,  // Include for transparency
          reason: 'Quality meets threshold, no intervention needed'
        };
      }

      // Step 4: Retrieve baseline patterns from memory
      const patterns = await this.memory.getBaselinePatterns(analysis.mode);

      // Step 5: Generate improvement suggestions using validated Context7 insights
      const suggestions = await this._generateSuggestions(analysis, patterns, sanitizedContext);

      // Step 6: Get user confirmation
      const confirmation = await this.confirmation.confirm(
        sanitizedContext.safeText,  // Show sanitized text
        analysis,
        suggestions
      );

      // Step 7: Apply improvements if confirmed
      let result;
      if (confirmation.approved) {
        result = await this._applyImprovements(
          sanitizedContext.safeText,
          suggestions,
          confirmation.userSelections,
          analysis
        );

        this.sessionStats.totalImproved++;

        // Log learning
        if (this.config.autoLearn) {
          await this.learningLog.record({
            originalPrompt: sanitizedContext.safeText,
            improvedPrompt: result.improvedPrompt,
            analysis,
            suggestions,
            userSelections: confirmation.userSelections,
            context7Used: !!analysis.context7Insights,
            securityContext: sanitizedContext.security,
            timestamp: Date.now()
          });
        }

        // Update captain's log
        await this.captainsLog.logImprovement({
          prompt: sanitizedContext.safeText,
          improvements: result.improvements,
          mode: analysis.mode,
          qualityScore: analysis.qualityDimensions?.overall,
          interventionLevel: analysis.interventionAnalysis?.interventionLevel,
          context7Used: !!analysis.context7Insights,
          securityValidated: true,
          injectionAttemptsDetected: sanitizedContext.security.injectionAttempts.length,
          timestamp: Date.now()
        });

      } else {
        result = {
          shouldImprove: false,
          originalPrompt: sanitizedContext.safeText,
          reason: 'User declined improvements',
          analysis,
          sanitizedContext
        };

        // Learn from rejection patterns
        if (this.config.autoLearn) {
          await this.learningLog.recordRejection({
            prompt: sanitizedContext.safeText,
            suggestions,
            reason: confirmation.reason,
            timestamp: Date.now()
          });
        }
      }

      return result;

    } catch (error) {
      console.error('[PromptImprover] Error:', error.message);

      // Log error to security events if it might be attack-related
      if (error.message.includes('injection') || error.message.includes('security')) {
        this.sessionStats.securityEvents.push({
          timestamp: Date.now(),
          eventType: 'error',
          severity: 'high',
          description: `Error during analysis: ${error.message}`,
          stackTrace: error.stack
        });
      }

      return {
        shouldImprove: false,
        originalPrompt: prompt,
        error: error.message,
        fallback: true
      };
    }
  }

  /**
   * Detect mode from prompt (operates on sanitized text)
   */
  detectMode(prompt) {
    const sanitizedContext = PromptSanitizer.sanitize(prompt);
    return this.analyzer.detectMode(sanitizedContext.safeText);
  }

  /**
   * Generate improvement suggestions using validated Context7 insights
   */
  async _generateSuggestions(analysis, patterns, sanitizedContext) {
    const suggestions = {
      structure: [],
      clarity: [],
      specificity: [],
      context: [],
      coordination: [],
      fileRouting: []
    };

    // Use VALIDATED Context7 insights only
    const insights = analysis.context7Insights;

    // File routing (critical) - ALWAYS enforce session artifacts
    if (analysis.qualityDimensions?.fileRoutingCompliance < 0.5) {
      suggestions.fileRouting.push({
        type: 'fix_routing',
        priority: 'critical',
        description: 'Fix file routing to use session artifacts',
        recommendation: insights?.recommendations?.find(r =>
          r.includes('sessions/$SESSION_ID')
        ) || 'Use sessions/$SESSION_ID/artifacts/ for all file operations',
        securityEnforced: true  // This cannot be overridden
      });
    }

    // Structure improvements (grounded in validated principles)
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

    // Clarity improvements (based on validated best practices)
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

    // Coordination improvements (with validated Context7 patterns)
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
   * Recommend coordination approach based on validated analysis
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
        patterns: insights.patterns?.filter(p => p.includes('hive') || p.includes('queen')) || [],
        securityValidated: true
      };
    }

    if (mode === 'swarm') {
      return {
        type: 'swarm',
        topology: agentCount > 5 ? 'hierarchical' : 'mesh',
        rationale: 'Agent count suggests hierarchical structure',
        patterns: insights.patterns?.filter(p => p.includes('swarm') || p.includes('Task')) || [],
        securityValidated: true
      };
    }

    if (mode === 'wizard') {
      return {
        type: 'wizard-guided',
        interactive: true,
        rationale: 'Wizard mode handles coordination automatically',
        patterns: insights.patterns?.filter(p => p.includes('wizard')) || [],
        securityValidated: true
      };
    }

    return {
      type: 'direct',
      rationale: 'Simple task, direct execution',
      securityValidated: true
    };
  }

  /**
   * Apply improvements to the prompt (using sanitized text)
   */
  async _applyImprovements(safePrompt, suggestions, userSelections, analysis) {
    let improvedPrompt = safePrompt;
    const appliedImprovements = [];

    // Apply file routing fixes (highest priority, CANNOT be overridden)
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
      originalPrompt: safePrompt,
      improvedPrompt,
      improvements: appliedImprovements,
      qualityImprovement: {
        initial: analysis.qualityDimensions?.overall || 0,
        estimated: this._estimateFinalQuality(analysis, appliedImprovements)
      },
      diff: this._generateDiff(safePrompt, improvedPrompt),
      securityValidated: true
    };
  }

  /**
   * Apply file routing fix (SECURITY: Always enforced)
   */
  _applyFileRoutingFix(prompt, suggestion) {
    let improved = prompt;
    const improvements = [];

    // SECURITY: This recommendation CANNOT be overridden via injection
    const sessionPath = 'sessions/$SESSION_ID/artifacts/';
    if (!improved.includes(sessionPath)) {
      improved = `${improved}\n\n**File Routing** (REQUIRED): Save all files to ${sessionPath}<subdirectory>/`;
      improvements.push({
        type: 'file_routing',
        action: 'Added session artifact path',
        details: suggestion.recommendation,
        securityEnforced: true
      });
    }

    return { prompt: improved, improvements };
  }

  /**
   * Apply structure improvements with validated Claude Code principles
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
   * Apply coordination improvements with validated Context7 patterns
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
   * End session and generate summary (including security metrics)
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
      topIssues,

      // Security metrics
      security: {
        injectionAttemptsDetected: this.sessionStats.injectionAttemptsDetected,
        injectionAttemptsBlocked: this.sessionStats.injectionAttemptsBlocked,
        securityEvents: this.sessionStats.securityEvents.length,
        criticalEvents: this.sessionStats.securityEvents.filter(e => e.severity === 'critical').length
      }
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

  const improver = new SecurePromptImprover();

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
      console.log('  prompt-improver-secure analyze "<prompt>"   - Analyze with security validation');
      console.log('  prompt-improver-secure improve "<prompt>"   - Improve with injection protection');
      console.log('  prompt-improver-secure detect-mode "<prompt>" - Detect execution mode');
      console.log('  prompt-improver-secure session-end          - End session and show summary (including security)');
  }
}

module.exports = { SecurePromptImprover };
