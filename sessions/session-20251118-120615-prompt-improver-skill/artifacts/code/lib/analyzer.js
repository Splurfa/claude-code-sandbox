/**
 * Prompt Analyzer
 *
 * Analyzes prompts for quality, mode detection, and improvement opportunities.
 */

class PromptAnalyzer {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Analyze a prompt comprehensively
   * @param {string} prompt - User prompt
   * @param {object} options - Analysis options
   * @returns {Promise<object>} Analysis result
   */
  async analyze(prompt, options = {}) {
    const mode = this.detectMode(prompt);
    const structure = this._analyzeStructure(prompt);
    const clarity = this._analyzeClarity(prompt);
    const specificity = this._analyzeSpecificity(prompt);
    const complexity = this._estimateComplexity(prompt);
    const agentCount = this._estimateAgentCount(prompt, mode);
    const coordination = this._analyzeCoordination(prompt);
    const context = this._extractContext(prompt);

    // Calculate overall quality score
    const qualityScore = this._calculateQualityScore({
      structure,
      clarity,
      specificity,
      coordination
    });

    // Calculate improvement potential
    const improvementPotential = this._calculateImprovementPotential({
      structure,
      clarity,
      specificity
    });

    // Identify critical issues
    const criticalIssues = this._identifyCriticalIssues({
      structure,
      clarity,
      specificity,
      coordination
    });

    return {
      mode,
      structure,
      clarity,
      specificity,
      complexity,
      agentCount,
      coordination,
      context,
      qualityScore,
      improvementPotential,
      criticalIssues,
      timestamp: Date.now()
    };
  }

  /**
   * Detect execution mode from prompt
   * @param {string} prompt - User prompt
   * @returns {string} Mode (hive, swarm, wizard, direct)
   */
  detectMode(prompt) {
    const lower = prompt.toLowerCase();

    // Hive mind indicators
    if (lower.includes('hive') || lower.includes('queen') ||
        lower.includes('consensus') || lower.includes('byzantine')) {
      return 'hive';
    }

    // Swarm indicators
    if (lower.includes('swarm') || lower.includes('spawn') ||
        lower.includes('topology') || lower.includes('mesh') ||
        lower.includes('hierarchical')) {
      return 'swarm';
    }

    // Wizard indicators
    if (lower.includes('wizard') || lower.includes('guided') ||
        lower.includes('step-by-step') || lower.includes('interactive')) {
      return 'wizard';
    }

    // Check for multi-agent indicators
    if (this._hasMultiAgentIndicators(prompt)) {
      return 'swarm'; // Default to swarm for multi-agent
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
      hasContext: prompt.length > 100, // Simple heuristic
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
      completeness: present / total
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

    // Check for specific indicators (numbers, names, versions, etc.)
    const specificIndicators = [
      /\d+/g,  // Numbers
      /v\d+\.\d+/gi,  // Versions
      /[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/g  // Proper nouns
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

    // Length factor
    if (prompt.length > 500) score += 0.2;
    if (prompt.length > 1000) score += 0.2;

    // Technical depth
    const technicalTerms = [
      'api', 'database', 'authentication', 'architecture',
      'deployment', 'testing', 'security', 'performance'
    ];
    const techCount = technicalTerms.filter(term =>
      prompt.toLowerCase().includes(term)
    ).length;
    score += Math.min(0.3, techCount * 0.05);

    // Multi-step indicator
    const stepIndicators = prompt.match(/\b(step|phase|stage|then|after|before)\b/gi);
    if (stepIndicators && stepIndicators.length > 3) score += 0.2;

    // Dependencies
    if (/\b(depend|require|need|integrate)\b/i.test(prompt)) score += 0.1;

    return Math.min(1, score);
  }

  /**
   * Estimate agent count needed
   */
  _estimateAgentCount(prompt, mode) {
    if (mode === 'direct') return 1;

    let count = 1;

    // Check for different domains
    const domains = [
      'frontend', 'backend', 'database', 'testing',
      'deployment', 'security', 'documentation', 'analysis'
    ];

    for (const domain of domains) {
      if (prompt.toLowerCase().includes(domain)) count++;
    }

    // Check for parallel work
    if (/\b(parallel|concurrent|simultaneously)\b/i.test(prompt)) {
      count = Math.ceil(count * 1.5);
    }

    return Math.min(10, count);
  }

  /**
   * Analyze coordination needs
   */
  _analyzeCoordination(prompt) {
    const lower = prompt.toLowerCase();

    const hasTopology = /\b(mesh|hierarchical|ring|star)\b/i.test(prompt);
    const hasStrategy = /\b(parallel|sequential|adaptive)\b/i.test(prompt);
    const hasMemory = /\b(memory|share|coordinate|sync)\b/i.test(prompt);
    const hasConsensus = /\b(consensus|vote|agree)\b/i.test(prompt);

    return {
      needed: hasTopology || hasStrategy || hasMemory || hasConsensus,
      topology: hasTopology,
      strategy: hasStrategy,
      memory: hasMemory,
      consensus: hasConsensus,
      recommendation: this._getCoordinationRecommendation({
        hasTopology,
        hasStrategy,
        hasMemory,
        hasConsensus
      })
    };
  }

  /**
   * Extract context from prompt
   */
  _extractContext(prompt) {
    const context = {};

    // Extract mentioned files
    const fileMatches = prompt.match(/\b[\w-]+\.(js|ts|py|go|md|json|yaml)\b/gi);
    if (fileMatches) {
      context.files = [...new Set(fileMatches)];
    }

    // Extract mentioned directories
    const dirMatches = prompt.match(/\b(src|lib|tests?|docs?|api|components?)\/[\w-/]+/gi);
    if (dirMatches) {
      context.directories = [...new Set(dirMatches)];
    }

    // Extract technologies
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
   * Calculate overall quality score
   */
  _calculateQualityScore(metrics) {
    const weights = {
      structure: 0.3,
      clarity: 0.3,
      specificity: 0.2,
      coordination: 0.2
    };

    let score = 0;
    score += metrics.structure.score * weights.structure;
    score += metrics.clarity.score * weights.clarity;
    score += metrics.specificity.score * weights.specificity;
    score += (metrics.coordination.needed ? 0.5 : 1.0) * weights.coordination;

    return score;
  }

  /**
   * Calculate improvement potential
   */
  _calculateImprovementPotential(metrics) {
    const gaps = [
      1 - metrics.structure.score,
      1 - metrics.clarity.score,
      1 - metrics.specificity.score
    ];

    return gaps.reduce((a, b) => a + b, 0) / gaps.length;
  }

  /**
   * Identify critical issues
   */
  _identifyCriticalIssues(metrics) {
    const issues = [];

    if (metrics.structure.score < 0.4) {
      issues.push({
        type: 'structure',
        severity: 'high',
        message: 'Prompt lacks essential structural elements',
        missing: metrics.structure.missing
      });
    }

    if (metrics.clarity.clarityIssues > 5) {
      issues.push({
        type: 'clarity',
        severity: 'high',
        message: 'Too many ambiguous terms',
        count: metrics.clarity.clarityIssues
      });
    }

    if (metrics.specificity.score < 0.3) {
      issues.push({
        type: 'specificity',
        severity: 'medium',
        message: 'Prompt is too vague',
        score: metrics.specificity.score
      });
    }

    return issues;
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
   * Get coordination recommendation
   */
  _getCoordinationRecommendation(flags) {
    if (!Object.values(flags).some(Boolean)) {
      return 'Consider adding coordination strategy for multi-agent work';
    }

    const missing = [];
    if (!flags.hasTopology) missing.push('topology');
    if (!flags.hasStrategy) missing.push('execution strategy');
    if (!flags.hasMemory) missing.push('memory coordination');

    if (missing.length > 0) {
      return `Consider specifying: ${missing.join(', ')}`;
    }

    return 'Good coordination specification';
  }
}

module.exports = { PromptAnalyzer };
