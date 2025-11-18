/**
 * Enhanced Prompt Analyzer
 *
 * Refactored analyzer that grounds quality scoring in Claude Code
 * best practices and implements evidence-based intervention thresholds.
 */

const { Context7Integration } = require('./context-aware');

class EnhancedPromptAnalyzer {
  constructor(config = {}) {
    this.config = config;
    this.context7 = new Context7Integration(config);
  }

  /**
   * Analyze a prompt comprehensively with Claude Code intelligence
   * @param {string} prompt - User prompt
   * @param {object} options - Analysis options
   * @returns {Promise<object>} Analysis result with Context7 insights
   */
  async analyze(prompt, options = {}) {
    // Phase 1: Basic structural analysis
    const mode = this.detectMode(prompt);
    const structure = this._analyzeStructure(prompt);
    const clarity = this._analyzeClarity(prompt);
    const specificity = this._analyzeSpecificity(prompt);
    const complexity = this._estimateComplexity(prompt);
    const agentCount = this._estimateAgentCount(prompt, mode);
    const coordination = this._analyzeCoordination(prompt);
    const context = this._extractContext(prompt);

    // Phase 2: Claude Code-grounded quality scoring
    const qualityDimensions = this._calculateQualityDimensions({
      structure,
      clarity,
      specificity,
      coordination,
      mode,
      agentCount
    });

    // Phase 3: Evidence-based intervention decision
    const interventionAnalysis = this._analyzeInterventionNeed(qualityDimensions, mode);

    // Phase 4: Fetch Context7 insights if needed
    let context7Insights = null;
    const preliminaryAnalysis = {
      mode,
      complexity,
      qualityScore: qualityDimensions.overall,
      criticalIssues: interventionAnalysis.criticalIssues,
      agentCount,
      structure
    };

    if (this.context7.shouldConsultContext7(preliminaryAnalysis)) {
      context7Insights = await this.context7.fetchContext7Insights(preliminaryAnalysis);
    }

    return {
      mode,
      structure,
      clarity,
      specificity,
      complexity,
      agentCount,
      coordination,
      context,
      qualityDimensions,
      interventionAnalysis,
      context7Insights,
      timestamp: Date.now()
    };
  }

  /**
   * Calculate quality dimensions grounded in Claude Code principles
   */
  _calculateQualityDimensions(metrics) {
    const dimensions = {};

    // 1. Structural Completeness (based on Claude Code SPARC/task structure)
    dimensions.structuralCompleteness = this._scoreStructuralCompleteness(metrics.structure);

    // 2. Clarity & Actionability (Claude Code principle: be specific and actionable)
    dimensions.clarityActionability = this._scoreClarityActionability(
      metrics.clarity,
      metrics.specificity
    );

    // 3. File Routing Compliance (critical: sessions/$SESSION_ID/artifacts/)
    dimensions.fileRoutingCompliance = this._scoreFileRoutingCompliance(metrics.structure);

    // 4. Coordination Strategy (for multi-agent: proper topology, memory, hooks)
    dimensions.coordinationStrategy = this._scoreCoordinationStrategy(
      metrics.coordination,
      metrics.mode,
      metrics.agentCount
    );

    // 5. Mode-Specific Best Practices
    dimensions.modeBestPractices = this._scoreModeSpecificPractices(
      metrics.mode,
      metrics.structure,
      metrics.coordination
    );

    // Calculate weighted overall score
    const weights = {
      structuralCompleteness: 0.25,
      clarityActionability: 0.25,
      fileRoutingCompliance: 0.15,
      coordinationStrategy: 0.20,
      modeBestPractices: 0.15
    };

    dimensions.overall = Object.entries(weights).reduce((score, [key, weight]) => {
      return score + (dimensions[key] * weight);
    }, 0);

    // Add dimension details
    dimensions.details = this._getDimensionDetails(dimensions, metrics);

    return dimensions;
  }

  /**
   * Score structural completeness based on Claude Code task structure
   */
  _scoreStructuralCompleteness(structure) {
    // Claude Code expects: Goal, Constraints, Deliverables, Context, Steps
    const requiredElements = {
      hasGoal: /\b(build|create|implement|design|develop|analyze|refactor)\b/i.test(structure.prompt || ''),
      hasConstraints: structure.elements?.hasConstraints || false,
      hasDeliverables: structure.elements?.hasDeliverables || false,
      hasContext: structure.elements?.hasContext || false,
      hasSteps: structure.elements?.hasSteps || false
    };

    const present = Object.values(requiredElements).filter(Boolean).length;
    const total = Object.keys(requiredElements).length;

    return present / total;
  }

  /**
   * Score clarity and actionability
   */
  _scoreClarityActionability(clarity, specificity) {
    // Combine clarity (no ambiguous terms) and specificity (concrete details)
    const clarityScore = clarity.score || 0;
    const specificityScore = specificity.score || 0;

    // Penalize heavily for ambiguous pronouns (it, that, thing)
    const ambiguityPenalty = Math.min(0.3, clarity.ambiguousTerms?.length * 0.05 || 0);

    return Math.max(0, (clarityScore * 0.5 + specificityScore * 0.5) - ambiguityPenalty);
  }

  /**
   * Score file routing compliance (critical for Claude Code workspace)
   */
  _scoreFileRoutingCompliance(structure) {
    const prompt = structure.prompt || '';

    // Check for session artifact routing
    const hasSessionPath = /sessions\/[^\/]+\/artifacts\/(code|tests|docs|scripts|notes)/i.test(prompt);

    // Check for violations (writing to root)
    const rootViolations = [
      /(?:write|save|create).*(?:to|in)\s+(?:tests?|docs?|scripts?)\/(?!.*session)/i,
      /(?:tests?|docs?|scripts?)\/[^\/]+\.(?:js|ts|md|py)/i
    ];
    const hasViolation = rootViolations.some(pattern => pattern.test(prompt));

    if (hasSessionPath && !hasViolation) return 1.0;
    if (hasViolation) return 0.0;

    // Neutral if no file paths mentioned
    return 0.5;
  }

  /**
   * Score coordination strategy for multi-agent tasks
   */
  _scoreCoordinationStrategy(coordination, mode, agentCount) {
    // Direct mode doesn't need coordination
    if (mode === 'direct' || agentCount <= 1) {
      return 1.0;
    }

    let score = 0;

    // Has topology specified
    if (coordination.topology) score += 0.25;

    // Has execution strategy (parallel/sequential/adaptive)
    if (coordination.strategy) score += 0.25;

    // Has memory coordination
    if (coordination.memory) score += 0.25;

    // Has consensus mechanism (for hive)
    if (mode === 'hive' && coordination.consensus) {
      score += 0.25;
    } else if (mode !== 'hive') {
      score += 0.25; // Not needed for non-hive
    }

    return score;
  }

  /**
   * Score mode-specific best practices
   */
  _scoreModeSpecificPractices(mode, structure, coordination) {
    const practices = {
      hive: this._scoreHivePractices(structure, coordination),
      swarm: this._scoreSwarmPractices(structure, coordination),
      wizard: this._scoreWizardPractices(structure),
      direct: this._scoreDirectPractices(structure)
    };

    return practices[mode] || 0.5;
  }

  /**
   * Score hive-specific practices
   */
  _scoreHivePractices(structure, coordination) {
    let score = 0.5; // baseline

    const prompt = structure.prompt || '';

    // Has queen specified
    if (/queen/i.test(prompt)) score += 0.2;

    // Has consensus mechanism
    if (coordination.consensus) score += 0.2;

    // Uses /hive-mind:wizard
    if (/\/hive-mind:wizard/i.test(prompt)) score = 1.0;

    return Math.min(1.0, score);
  }

  /**
   * Score swarm-specific practices
   */
  _scoreSwarmPractices(structure, coordination) {
    let score = 0.5; // baseline

    const prompt = structure.prompt || '';

    // Mentions concurrent/parallel execution
    if (/\b(concurrent|parallel|simultaneously)\b/i.test(prompt)) score += 0.2;

    // Has memory coordination
    if (coordination.memory) score += 0.15;

    // Uses Task tool pattern
    if (/Task\(/i.test(prompt)) score += 0.15;

    return Math.min(1.0, score);
  }

  /**
   * Score wizard-specific practices
   */
  _scoreWizardPractices(structure) {
    let score = 0.5; // baseline

    const prompt = structure.prompt || '';

    // Provides high-level goal (wizard handles details)
    if (structure.elements?.hasGoal && !structure.elements?.hasSteps) {
      score += 0.3;
    }

    // Uses /wizard or mentions guided
    if (/\/.*:wizard|guided|interactive/i.test(prompt)) {
      score = 1.0;
    }

    return Math.min(1.0, score);
  }

  /**
   * Score direct execution practices
   */
  _scoreDirectPractices(structure) {
    // Direct mode needs complete, specific instructions
    const completeness = structure.completeness || 0;
    return completeness;
  }

  /**
   * Analyze intervention need with evidence-based thresholds
   */
  _analyzeInterventionNeed(qualityDimensions, mode) {
    const issues = [];
    const recommendations = [];

    // Critical: File routing violations (always intervene)
    if (qualityDimensions.fileRoutingCompliance < 0.5) {
      issues.push({
        type: 'file_routing',
        severity: 'critical',
        message: 'File routing violation detected',
        threshold: 0.5,
        actual: qualityDimensions.fileRoutingCompliance,
        intervention: 'required'
      });
      recommendations.push('Use sessions/$SESSION_ID/artifacts/ for all file operations');
    }

    // High: Missing coordination for multi-agent
    if (qualityDimensions.coordinationStrategy < 0.6) {
      issues.push({
        type: 'coordination',
        severity: 'high',
        message: 'Insufficient coordination strategy for multi-agent task',
        threshold: 0.6,
        actual: qualityDimensions.coordinationStrategy,
        intervention: 'recommended'
      });
      recommendations.push('Define topology, memory strategy, and agent roles');
    }

    // Medium: Low clarity/actionability
    if (qualityDimensions.clarityActionability < 0.6) {
      issues.push({
        type: 'clarity',
        severity: 'medium',
        message: 'Prompt lacks clarity and actionability',
        threshold: 0.6,
        actual: qualityDimensions.clarityActionability,
        intervention: 'suggested'
      });
      recommendations.push('Replace vague terms with specific details');
    }

    // Medium: Incomplete structure
    if (qualityDimensions.structuralCompleteness < 0.5) {
      issues.push({
        type: 'structure',
        severity: 'medium',
        message: 'Missing essential structural elements',
        threshold: 0.5,
        actual: qualityDimensions.structuralCompleteness,
        intervention: 'suggested'
      });
      recommendations.push('Add constraints, deliverables, or success criteria');
    }

    // Low: Mode-specific practices
    if (qualityDimensions.modeBestPractices < 0.7) {
      issues.push({
        type: 'mode_practices',
        severity: 'low',
        message: `Missing ${mode}-specific best practices`,
        threshold: 0.7,
        actual: qualityDimensions.modeBestPractices,
        intervention: 'optional'
      });
      recommendations.push(`Consider using /${mode}:wizard for guided setup`);
    }

    // Determine overall intervention level
    const interventionLevel = this._determineInterventionLevel(issues);

    return {
      interventionLevel,
      criticalIssues: issues.filter(i => i.severity === 'critical'),
      allIssues: issues,
      recommendations,
      shouldIntervene: interventionLevel !== 'none'
    };
  }

  /**
   * Determine intervention level based on issues
   */
  _determineInterventionLevel(issues) {
    if (issues.some(i => i.severity === 'critical')) return 'required';
    if (issues.some(i => i.severity === 'high')) return 'recommended';
    if (issues.some(i => i.severity === 'medium')) return 'suggested';
    if (issues.some(i => i.severity === 'low')) return 'optional';
    return 'none';
  }

  /**
   * Get dimension details for transparency
   */
  _getDimensionDetails(dimensions, metrics) {
    return {
      structuralCompleteness: {
        score: dimensions.structuralCompleteness,
        missing: metrics.structure.missing || [],
        recommendation: dimensions.structuralCompleteness < 0.7
          ? 'Add missing elements: goal, constraints, deliverables'
          : 'Structure is adequate'
      },
      clarityActionability: {
        score: dimensions.clarityActionability,
        ambiguousTerms: metrics.clarity.ambiguousTerms || [],
        recommendation: dimensions.clarityActionability < 0.7
          ? 'Replace ambiguous terms with specific details'
          : 'Clarity is adequate'
      },
      fileRoutingCompliance: {
        score: dimensions.fileRoutingCompliance,
        recommendation: dimensions.fileRoutingCompliance < 1.0
          ? 'Specify sessions/$SESSION_ID/artifacts/ paths'
          : 'File routing is correct'
      },
      coordinationStrategy: {
        score: dimensions.coordinationStrategy,
        recommendation: dimensions.coordinationStrategy < 0.7
          ? 'Define coordination topology and memory strategy'
          : 'Coordination strategy is adequate'
      },
      modeBestPractices: {
        score: dimensions.modeBestPractices,
        recommendation: dimensions.modeBestPractices < 0.7
          ? `Follow ${metrics.mode} best practices`
          : 'Mode-specific practices followed'
      }
    };
  }

  // ============================================================================
  // Existing analyzer methods (unchanged for compatibility)
  // ============================================================================

  /**
   * Detect execution mode from prompt
   */
  detectMode(prompt) {
    const lower = prompt.toLowerCase();

    if (lower.includes('hive') || lower.includes('queen') ||
        lower.includes('consensus') || lower.includes('byzantine')) {
      return 'hive';
    }

    if (lower.includes('swarm') || lower.includes('spawn') ||
        lower.includes('topology') || lower.includes('mesh') ||
        lower.includes('hierarchical')) {
      return 'swarm';
    }

    if (lower.includes('wizard') || lower.includes('guided') ||
        lower.includes('step-by-step') || lower.includes('interactive')) {
      return 'wizard';
    }

    if (this._hasMultiAgentIndicators(prompt)) {
      return 'swarm';
    }

    return 'direct';
  }

  /**
   * Analyze prompt structure
   */
  _analyzeStructure(prompt) {
    const elements = {
      hasGoal: /\b(build|create|implement|design|develop)\b/i.test(prompt),
      hasConstraints: /\b(must|should|require|need|constraint)\b/i.test(prompt),
      hasDeliverables: /\b(deliver|output|result|produce|generate)\b/i.test(prompt),
      hasContext: prompt.length > 100,
      hasSteps: /\b(step|phase|stage|first|then|finally)\b/i.test(prompt)
    };

    const present = Object.values(elements).filter(Boolean).length;
    const total = Object.keys(elements).length;

    const missing = Object.keys(elements)
      .filter(key => !elements[key])
      .map(key => key.replace('has', ''));

    return {
      score: present / total,
      elements,
      missing,
      completeness: present / total,
      prompt // Store for analysis
    };
  }

  /**
   * Analyze clarity
   */
  _analyzeClarity(prompt) {
    const ambiguousPatterns = [
      /\bit\b/gi,
      /\bthat\b/gi,
      /\bthing\b/gi,
      /\bstuff\b/gi,
      /\betc\b/gi,
      /\bsomething\b/gi
    ];

    const ambiguousTerms = [];
    for (const pattern of ambiguousPatterns) {
      const matches = prompt.match(pattern);
      if (matches) {
        ambiguousTerms.push(...matches.map(m => m.toLowerCase()));
      }
    }

    const uniqueAmbiguous = [...new Set(ambiguousTerms)];
    const score = Math.max(0, 1 - (uniqueAmbiguous.length * 0.1));

    return {
      score,
      ambiguousTerms: uniqueAmbiguous,
      clarityIssues: uniqueAmbiguous.length,
      recommendation: uniqueAmbiguous.length > 0 ? 'Clarify ambiguous terms' : 'Good clarity'
    };
  }

  /**
   * Analyze specificity
   */
  _analyzeSpecificity(prompt) {
    const vagueIndicators = [
      /\bgeneral\b/gi,
      /\bbasic\b/gi,
      /\bsimple\b/gi,
      /\bsome\b/gi,
      /\bfew\b/gi,
      /\bmany\b/gi,
      /\bvarious\b/gi
    ];

    let vagueCount = 0;
    const vagueAreas = [];

    for (const pattern of vagueIndicators) {
      const matches = prompt.match(pattern);
      if (matches) {
        vagueCount += matches.length;
        vagueAreas.push({
          term: pattern.source.replace(/\\b/g, '').replace(/\\/g, ''),
          count: matches.length,
          suggestion: 'Provide specific details'
        });
      }
    }

    const specificIndicators = [
      /\d+/g,
      /v\d+\.\d+/gi,
      /[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/g
    ];

    let specificCount = 0;
    for (const pattern of specificIndicators) {
      const matches = prompt.match(pattern);
      if (matches) {
        specificCount += matches.length;
      }
    }

    const score = Math.min(1, specificCount / Math.max(1, vagueCount + specificCount));

    return {
      score,
      vagueCount,
      specificCount,
      vagueAreas,
      recommendation: score < 0.6 ? 'Add more specific details' : 'Good specificity'
    };
  }

  /**
   * Estimate complexity
   */
  _estimateComplexity(prompt) {
    let score = 0;

    if (prompt.length > 500) score += 0.2;
    if (prompt.length > 1000) score += 0.2;

    const technicalTerms = [
      'api', 'database', 'authentication', 'architecture',
      'deployment', 'testing', 'security', 'performance'
    ];
    const techCount = technicalTerms.filter(term =>
      prompt.toLowerCase().includes(term)
    ).length;
    score += Math.min(0.3, techCount * 0.05);

    const stepIndicators = prompt.match(/\b(step|phase|stage|then|after|before)\b/gi);
    if (stepIndicators && stepIndicators.length > 3) score += 0.2;

    if (/\b(depend|require|need|integrate)\b/i.test(prompt)) score += 0.1;

    return Math.min(1, score);
  }

  /**
   * Estimate agent count needed
   */
  _estimateAgentCount(prompt, mode) {
    if (mode === 'direct') return 1;

    let count = 1;

    const domains = [
      'frontend', 'backend', 'database', 'testing',
      'deployment', 'security', 'documentation', 'analysis'
    ];

    for (const domain of domains) {
      if (prompt.toLowerCase().includes(domain)) count++;
    }

    if (/\b(parallel|concurrent|simultaneously)\b/i.test(prompt)) {
      count = Math.ceil(count * 1.5);
    }

    return Math.min(10, count);
  }

  /**
   * Analyze coordination needs
   */
  _analyzeCoordination(prompt) {
    const hasTopology = /\b(mesh|hierarchical|ring|star)\b/i.test(prompt);
    const hasStrategy = /\b(parallel|sequential|adaptive)\b/i.test(prompt);
    const hasMemory = /\b(memory|share|coordinate|sync)\b/i.test(prompt);
    const hasConsensus = /\b(consensus|vote|agree)\b/i.test(prompt);

    return {
      needed: hasTopology || hasStrategy || hasMemory || hasConsensus,
      topology: hasTopology,
      strategy: hasStrategy,
      memory: hasMemory,
      consensus: hasConsensus
    };
  }

  /**
   * Extract context from prompt
   */
  _extractContext(prompt) {
    const context = {};

    const fileMatches = prompt.match(/\b[\w-]+\.(js|ts|py|go|md|json|yaml)\b/gi);
    if (fileMatches) {
      context.files = [...new Set(fileMatches)];
    }

    const dirMatches = prompt.match(/\b(src|lib|tests?|docs?|api|components?)\/[\w-/]+/gi);
    if (dirMatches) {
      context.directories = [...new Set(dirMatches)];
    }

    const techPatterns = [
      'react', 'vue', 'angular', 'node', 'python', 'go', 'rust',
      'express', 'fastapi', 'django', 'postgresql', 'mongodb', 'redis'
    ];
    context.technologies = techPatterns.filter(tech =>
      prompt.toLowerCase().includes(tech)
    );

    return context;
  }

  /**
   * Check for multi-agent indicators
   */
  _hasMultiAgentIndicators(prompt) {
    const indicators = [
      /\b(multiple|several|team|agents?)\b/i,
      /\b(frontend|backend|database|testing)\b.*\b(and|with|plus)\b/i,
      /\b(coordinate|collaborate|work together)\b/i
    ];

    return indicators.some(pattern => pattern.test(prompt));
  }

  /**
   * Clear Context7 cache (on session end)
   */
  clearContext7Cache() {
    this.context7.clearCache();
  }

  /**
   * Get Context7 cache stats
   */
  getContext7CacheStats() {
    return this.context7.getCacheStats();
  }
}

module.exports = { EnhancedPromptAnalyzer };
