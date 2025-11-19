/**
 * Semantic Matcher - TF-IDF based skill matching with confidence scores
 * Matches user queries to skills using keyword extraction and similarity scoring
 */

class SemanticMatcher {
  constructor(registry) {
    this.registry = registry;
    this.skillIndex = new Map(); // keyword -> Set<skillId>
    this.buildIndex();
  }

  /**
   * Build inverted index of keywords to skills
   */
  buildIndex() {
    const allSkills = this.registry.getAll();

    for (const skill of allSkills) {
      for (const keyword of skill.tags) {
        if (!this.skillIndex.has(keyword)) {
          this.skillIndex.set(keyword, new Set());
        }
        this.skillIndex.get(keyword).add(skill.id);
      }
    }
  }

  /**
   * Match user query to skills with confidence scores
   * @param {string} query - User's natural language query
   * @param {number} threshold - Minimum confidence score (0-1)
   * @returns {Array} Array of {skill, score, matchedKeywords}
   */
  match(query, threshold = 0.3) {
    const queryKeywords = this.extractKeywords(query);
    const candidateSkills = this.getCandidateSkills(queryKeywords);
    const results = [];

    for (const skillId of candidateSkills) {
      const skill = this.registry.get(skillId);
      const { score, matches } = this.calculateScore(queryKeywords, skill);

      if (score >= threshold) {
        results.push({
          skill,
          score,
          matchedKeywords: matches
        });
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Get candidate skills that have at least one matching keyword
   */
  getCandidateSkills(queryKeywords) {
    const candidates = new Set();

    for (const keyword of queryKeywords) {
      const skillIds = this.skillIndex.get(keyword);
      if (skillIds) {
        for (const id of skillIds) {
          candidates.add(id);
        }
      }
    }

    return candidates;
  }

  /**
   * Calculate TF-IDF inspired match score
   */
  calculateScore(queryKeywords, skill) {
    const skillKeywords = new Set(skill.tags);
    const descWords = skill.description.toLowerCase().split(/\s+/);
    let score = 0;
    const matches = [];

    for (const qWord of queryKeywords) {
      // Exact match
      if (skillKeywords.has(qWord)) {
        matches.push(qWord);
        score += 1.0;

        // Position boost (early in description = higher weight)
        const position = descWords.indexOf(qWord);
        if (position >= 0 && position < 10) {
          score += (10 - position) / 20; // Up to 50% boost
        }
        continue;
      }

      // Fuzzy match (Levenshtein)
      for (const sWord of skillKeywords) {
        const similarity = this.levenshteinRatio(qWord, sWord);
        if (similarity > 0.8) {
          matches.push(sWord);
          score += similarity;
          break;
        }
      }
    }

    // Normalize by query length
    const normalizedScore = Math.min(score / queryKeywords.length, 1.0);

    return {
      score: normalizedScore,
      matches
    };
  }

  /**
   * Extract keywords from query text
   */
  extractKeywords(text) {
    const stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
      'has', 'he', 'help', 'i', 'in', 'is', 'it', 'its', 'me', 'my',
      'of', 'on', 'that', 'the', 'to', 'want', 'was', 'will', 'with',
      'when', 'where', 'which', 'who', 'you', 'your'
    ]);

    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
  }

  /**
   * Calculate Levenshtein distance ratio (0-1)
   */
  levenshteinRatio(s1, s2) {
    const distance = this.levenshteinDistance(s1, s2);
    const maxLen = Math.max(s1.length, s2.length);
    return maxLen === 0 ? 1.0 : 1 - (distance / maxLen);
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  levenshteinDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];

    // Initialize matrix
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    // Fill matrix
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,      // deletion
          matrix[i][j - 1] + 1,      // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return matrix[len1][len2];
  }

  /**
   * Parse user intent from query
   */
  parseIntent(query) {
    const patterns = {
      learn: /\b(learn|teach|explain|understand|guide|tutorial)\b/i,
      build: /\b(build|create|generate|make|scaffold|develop)\b/i,
      review: /\b(review|check|analyze|audit|inspect|examine)\b/i,
      optimize: /\b(optimi[zs](e|ed|ing|ation)?|improve|enhance|speed\s*up|fix|better)\b/i,
      coordinate: /\b(coordinate|orchestrate|swarm|agents?|multi-agent)\b/i,
      help: /\b(how|what|when|why|where|which)\b/i
    };

    for (const [action, pattern] of Object.entries(patterns)) {
      if (pattern.test(query)) {
        return action;
      }
    }

    return 'unknown';
  }
}

module.exports = SemanticMatcher;
