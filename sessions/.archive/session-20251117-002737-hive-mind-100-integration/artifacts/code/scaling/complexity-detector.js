/**
 * Complexity Detector
 * Analyzes task complexity on 0-100 scale for intelligent auto-scaling
 *
 * Stock Adherence: Uses standard agent definitions and coordination patterns
 */

class ComplexityDetector {
  constructor(options = {}) {
    this.weights = {
      description: 0.35,
      fileCount: 0.25,
      dependencies: 0.25,
      codeComplexity: 0.10,
      crossCutting: 0.05,
      ...options.weights
    };

    // Complexity keywords for description analysis
    this.complexityKeywords = {
      high: ['refactor', 'architecture', 'distributed', 'microservice', 'event-driven',
             'fault-tolerance', 'scaling', 'optimization', 'migration', 'integration',
             'deployment', 'kubernetes'],
      medium: ['implement', 'build', 'create', 'design', 'authentication', 'validation',
               'api', 'endpoint', 'database', 'caching', 'redis', 'service'],
      low: ['fix', 'update', 'add', 'remove', 'comment', 'typo', 'format', 'rename']
    };
  }

  /**
   * Score task complexity (0-100 scale)
   * @param {Object} task - Task to analyze
   * @returns {number} Complexity score
   */
  scoreTask(task) {
    const metrics = this.getComplexityMetrics(task);
    return Math.min(100, Math.round(metrics.totalScore));
  }

  /**
   * Get detailed complexity metrics breakdown
   * @param {Object} task - Task to analyze
   * @returns {Object} Complexity metrics
   */
  getComplexityMetrics(task) {
    const descriptionScore = this._scoreDescription(task.description || '');
    const fileCountScore = this._scoreFileCount(task.files || []);
    const dependencyScore = this._scoreDependencies(task.dependencies || []);
    const codeComplexityScore = task.codeComplexity || 0;
    const crossCuttingScore = task.crossCutting ? 20 : 0;
    const parallelizableBonus = task.parallelizable ? 15 : 0;

    let totalScore = (
      descriptionScore * this.weights.description +
      fileCountScore * this.weights.fileCount +
      dependencyScore * this.weights.dependencies +
      codeComplexityScore * this.weights.codeComplexity +
      crossCuttingScore * this.weights.crossCutting
    ) + parallelizableBonus;

    // Bonus for microservice + deployment combination
    const hasMicroserviceKeywords = (task.description || '').toLowerCase().includes('microservice');
    const hasDeploymentFiles = (task.files || []).some(f =>
      f.includes('.yaml') || f.includes('.yml') || f.includes('k8s')
    );
    if (hasMicroserviceKeywords && hasDeploymentFiles) {
      totalScore += 3;
    }

    return {
      descriptionScore,
      fileCountScore,
      dependencyScore,
      codeComplexityScore,
      crossCuttingScore,
      parallelizableBonus,
      totalScore: Math.min(100, totalScore)
    };
  }

  /**
   * Score based on description keywords and patterns
   * @private
   */
  _scoreDescription(description) {
    const normalized = description.toLowerCase();
    let score = 0;

    // Check for high complexity keywords
    const highMatches = this.complexityKeywords.high.filter(kw =>
      normalized.includes(kw)
    ).length;
    score += highMatches * 20; // Increased from 15

    // Check for medium complexity keywords
    const mediumMatches = this.complexityKeywords.medium.filter(kw =>
      normalized.includes(kw)
    ).length;
    score += mediumMatches * 13; // Increased from 12

    // Check for low complexity keywords (reduces score)
    const lowMatches = this.complexityKeywords.low.filter(kw =>
      normalized.includes(kw)
    ).length;
    score = Math.max(0, score - (lowMatches * 8)); // Increased penalty

    // Length factor (longer descriptions often indicate complexity)
    const words = normalized.split(/\s+/).length;
    if (words > 15) score += 12; // Increased sensitivity
    if (words > 30) score += 18;

    return Math.min(100, score);
  }

  /**
   * Score based on number of files affected
   * @private
   */
  _scoreFileCount(files) {
    const count = files.length;

    let score = 0;
    if (count === 0) score = 0;
    else if (count === 1) score = 10;
    else if (count <= 3) score = 25;
    else if (count <= 5) score = 40;
    else if (count <= 10) score = 60;
    else if (count <= 15) score = 80;
    else score = 100;

    // Bonus for complex file types (deployment configs, etc.)
    const complexFileTypes = files.filter(f =>
      f.includes('.yaml') || f.includes('.yml') ||
      f.includes('docker') || f.includes('k8s')
    ).length;
    score += complexFileTypes * 10;

    return Math.min(100, score);
  }

  /**
   * Score based on dependency complexity
   * @private
   */
  _scoreDependencies(dependencies) {
    const count = dependencies.length;

    // Base score from count
    let score = Math.min(50, count * 8); // Increased from 5

    // Bonus for complex dependencies
    const complexDeps = [
      'kubernetes', 'docker', 'redis', 'rabbitmq', 'kafka',
      'elasticsearch', 'prometheus', 'grafana', 'postgresql',
      'mongodb', 'cassandra', 'webpack', 'babel', 'typescript'
    ];

    const complexMatches = dependencies.filter(dep =>
      complexDeps.some(complex => dep.toLowerCase().includes(complex))
    ).length;

    score += complexMatches * 15; // Increased from 10

    return Math.min(100, score);
  }

  /**
   * Classify complexity level
   * @param {number} score - Complexity score
   * @returns {string} Level: 'low', 'medium', 'high', 'critical'
   */
  classifyComplexity(score) {
    if (score < 30) return 'low';
    if (score < 70) return 'medium';
    if (score < 90) return 'high';
    return 'critical';
  }

  /**
   * Recommend agent count based on complexity
   * @param {number} score - Complexity score
   * @param {Object} options - Scaling options
   * @returns {number} Recommended agent count
   */
  recommendAgentCount(score, options = {}) {
    const { minAgents = 1, maxAgents = 12 } = options;

    let recommended;
    if (score < 30) {
      recommended = 3;
    } else if (score < 50) {
      recommended = 4;
    } else if (score < 70) {
      recommended = 6;
    } else if (score < 85) {
      recommended = 8;
    } else {
      recommended = 10;
    }

    return Math.max(minAgents, Math.min(maxAgents, recommended));
  }
}

module.exports = { ComplexityDetector };
