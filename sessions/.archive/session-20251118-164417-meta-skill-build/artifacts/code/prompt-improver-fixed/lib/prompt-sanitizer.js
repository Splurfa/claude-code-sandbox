/**
 * Prompt Sanitizer - Security Layer for Prompt Improver
 *
 * CRITICAL SECURITY COMPONENT
 *
 * Purpose: Treat all user input as untrusted data and prevent prompt injection attacks
 *
 * Security Principles:
 * 1. User input is ALWAYS data, never directives
 * 2. No special markers can affect system behavior
 * 3. Analysis scope is strictly isolated
 * 4. Quality scores are computed, never injected
 */

class PromptSanitizer {
  /**
   * Sanitize user prompt to prevent injection attacks
   *
   * @param {string} prompt - Raw user input
   * @returns {object} Sanitized prompt context with safety metadata
   */
  static sanitize(prompt) {
    if (typeof prompt !== 'string') {
      throw new Error('Prompt must be a string');
    }

    // Create isolated analysis context
    return {
      // Original text (for display/logging only)
      originalText: prompt,

      // Safe text content (stripped of injection attempts)
      safeText: this._removeDangerousMarkers(prompt),

      // Extracted metadata (for analysis purposes only, not execution)
      extractedPatterns: this._extractPatternsAsData(prompt),

      // Security flags
      security: {
        sanitized: true,
        timestamp: Date.now(),
        injectionAttempts: this._detectInjectionAttempts(prompt),
        readonly: true  // Prevents modification of system state
      },

      // Isolation guarantees
      isolation: {
        systemOverridesDisabled: true,
        contextInjectionDisabled: true,
        qualityOverridesDisabled: true,
        fileRoutingOverridesDisabled: true,
        memoryOverridesDisabled: true
      }
    };
  }

  /**
   * Remove dangerous directive markers that could be interpreted as commands
   */
  static _removeDangerousMarkers(text) {
    // List of dangerous patterns that should never be interpreted
    const dangerousPatterns = [
      // System directive markers
      /\[SYSTEM:.*?\]/gi,
      /\[ANALYZER_CONFIG.*?\]/gi,
      /\[QUALITY_OVERRIDE.*?\]/gi,
      /\[INTERVENTION.*?\]/gi,

      // Context7 injection attempts
      /\[CONTEXT7_OVERRIDE.*?\]/gi,
      /\[CONTEXT7_CACHE_INJECT.*?\]/gi,
      /\[\/CONTEXT7_OVERRIDE\]/gi,
      /\[\/CONTEXT7_CACHE_INJECT\]/gi,

      // File routing overrides
      /\[FILE_ROUTING_OVERRIDE.*?\]/gi,
      /\[\/FILE_ROUTING_OVERRIDE\]/gi,

      // Memory injection
      /\[MEMORY_INJECT.*?\]/gi,
      /\[\/MEMORY_INJECT\]/gi,

      // Meta-instruction delimiters
      /---\s*IGNORE\s+ABOVE\s*---/gi,
      /---\s*RESUME\s+NORMAL\s+OPERATION\s*---/gi,
      /---\s*SYSTEM\s+MODE\s*---/gi,

      // Unicode variations
      /\u200B\[SYSTEM.*?\]\u200B/gi,  // Zero-width space obfuscation
      /\uFEFF\[.*?\]\uFEFF/gi,        // BOM obfuscation
    ];

    let safeText = text;

    // Remove each dangerous pattern
    for (const pattern of dangerousPatterns) {
      safeText = safeText.replace(pattern, '');
    }

    return safeText;
  }

  /**
   * Extract patterns FROM prompt as data (not as executable directives)
   *
   * This extracts information FOR ANALYSIS, but never executes it
   */
  static _extractPatternsAsData(text) {
    const patterns = {
      detectedMarkers: [],
      suspiciousKeywords: [],
      structuralElements: []
    };

    // Detect (but don't execute) directive markers
    const markerRegex = /\[([A-Z_]+)(?::|\])/g;
    let match;
    while ((match = markerRegex.exec(text)) !== null) {
      patterns.detectedMarkers.push({
        type: match[1],
        position: match.index,
        // Mark as DETECTED ONLY, not executed
        executed: false,
        neutralized: true
      });
    }

    // Detect suspicious keywords (for logging/alerting)
    const suspiciousKeywords = [
      'override', 'inject', 'bypass', 'disable', 'ignore',
      'system', 'admin', 'execute', 'eval', 'config'
    ];

    for (const keyword of suspiciousKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      if (regex.test(text)) {
        patterns.suspiciousKeywords.push(keyword);
      }
    }

    // Extract actual structural elements (goal, constraints, etc.)
    // These are SAFE because they're from user's actual request
    const structureRegex = /\*\*([A-Z][a-z]+)s?\*\*:\s*(.+?)(?=\n|$)/gi;
    while ((match = structureRegex.exec(text)) !== null) {
      patterns.structuralElements.push({
        type: match[1].toLowerCase(),
        content: match[2].trim()
      });
    }

    return patterns;
  }

  /**
   * Detect injection attempts (for logging and alerting)
   */
  static _detectInjectionAttempts(text) {
    const attempts = [];

    // Check for quality score injection
    if (/\[QUALITY_OVERRIDE|interventionThreshold.*?0\.0|\[INTERVENTION|\[ANALYZER_CONFIG/i.test(text)) {
      attempts.push({
        type: 'quality_score_injection',
        severity: 'high',
        description: 'Attempted to override quality scoring'
      });
    }

    // Check for Context7 injection
    if (/\[CONTEXT7_OVERRIDE|\[CONTEXT7_CACHE_INJECT/i.test(text)) {
      attempts.push({
        type: 'context7_injection',
        severity: 'critical',
        description: 'Attempted to inject fake Context7 insights'
      });
    }

    // Check for file routing override
    if (/\[FILE_ROUTING_OVERRIDE|targetPath.*?\//i.test(text)) {
      attempts.push({
        type: 'file_routing_injection',
        severity: 'high',
        description: 'Attempted to write files outside session'
      });
    }

    // Check for memory injection
    if (/\[MEMORY_INJECT/i.test(text)) {
      attempts.push({
        type: 'memory_injection',
        severity: 'high',
        description: 'Attempted to inject coordination data'
      });
    }

    // Check for meta-instructions
    if (/IGNORE\s+ABOVE|RESUME\s+NORMAL|SYSTEM\s+MODE/i.test(text)) {
      attempts.push({
        type: 'meta_instruction_injection',
        severity: 'critical',
        description: 'Attempted to inject meta-instructions'
      });
    }

    // Check for system directives
    if (/\[SYSTEM:/i.test(text)) {
      attempts.push({
        type: 'system_directive_injection',
        severity: 'critical',
        description: 'Attempted to inject system directives'
      });
    }

    // Check for Unicode obfuscation
    if (/[\u200B\uFEFF]/.test(text)) {
      attempts.push({
        type: 'unicode_obfuscation',
        severity: 'medium',
        description: 'Detected Unicode obfuscation characters'
      });
    }

    return attempts;
  }

  /**
   * Extract only safe text content for Context7 consultation
   *
   * This ensures Context7 only sees the actual prompt, not injection attempts
   */
  static extractSafeTextForContext7(sanitizedContext) {
    const { safeText, extractedPatterns } = sanitizedContext;

    // Build clean text from structural elements
    const cleanParts = [];

    // Add actual structural elements (these are safe)
    for (const element of extractedPatterns.structuralElements) {
      cleanParts.push(`${element.type}: ${element.content}`);
    }

    // If no structural elements, use safe text
    if (cleanParts.length === 0) {
      return safeText;
    }

    return cleanParts.join('\n');
  }

  /**
   * Validate that quality scores are computed, not injected
   */
  static validateQualityScores(scores, sanitizedContext) {
    // Ensure all scores are in valid range [0, 1]
    const validatedScores = {};

    for (const [dimension, score] of Object.entries(scores)) {
      // Check if score is a number
      if (typeof score !== 'number' || isNaN(score)) {
        console.warn(`[Security] Invalid score for ${dimension}: ${score}, defaulting to 0`);
        validatedScores[dimension] = 0;
        continue;
      }

      // Check if score is in valid range
      if (score < 0 || score > 1) {
        console.warn(`[Security] Score out of range for ${dimension}: ${score}, clamping to [0,1]`);
        validatedScores[dimension] = Math.max(0, Math.min(1, score));
        continue;
      }

      // If injection attempt detected, be conservative with scoring
      if (sanitizedContext.security.injectionAttempts.length > 0) {
        // Apply penalty for injection attempts
        validatedScores[dimension] = score * 0.7;  // 30% penalty
      } else {
        validatedScores[dimension] = score;
      }
    }

    return validatedScores;
  }

  /**
   * Log security events (injection attempts, suspicious activity)
   */
  static logSecurityEvent(event, sanitizedContext) {
    const logEntry = {
      timestamp: Date.now(),
      eventType: event.type,
      severity: event.severity,
      description: event.description,
      promptPreview: sanitizedContext.originalText.substring(0, 100),
      injectionAttempts: sanitizedContext.security.injectionAttempts.length,
      neutralized: true
    };

    // In production, this would send to security monitoring system
    console.warn('[SECURITY]', JSON.stringify(logEntry, null, 2));

    return logEntry;
  }

  /**
   * Verify that a Context7 response is legitimate (not injected)
   */
  static validateContext7Response(response) {
    // Check that response has expected structure
    const requiredFields = ['principles', 'recommendations', 'patterns'];

    for (const field of requiredFields) {
      if (!response[field] || !Array.isArray(response[field])) {
        console.warn(`[Security] Invalid Context7 response missing ${field}`);
        return null;  // Reject invalid response
      }
    }

    // Check that principles don't contain injection markers
    for (const principle of response.principles) {
      if (this._containsInjectionMarkers(principle)) {
        console.warn('[Security] Context7 principle contains injection markers');
        return null;
      }
    }

    return response;  // Response is valid
  }

  /**
   * Helper: Check if text contains injection markers
   */
  static _containsInjectionMarkers(text) {
    const injectionMarkers = [
      /\[SYSTEM:/i,
      /\[OVERRIDE/i,
      /\[INJECT/i,
      /IGNORE\s+ABOVE/i,
      /EXECUTE:/i
    ];

    return injectionMarkers.some(marker => marker.test(text));
  }
}

module.exports = { PromptSanitizer };
