/**
 * Phase 3 Intelligence Layer - Main Export
 *
 * Provides unified interface for all Phase 3 systems:
 * - AgentDB integration (150x faster vector search)
 * - Automatic routing (SQLite <10K, AgentDB >10K)
 * - Pattern recognition (72 ReasoningBank patterns)
 * - Cross-session intelligence (multi-session learning)
 */

const { AgentDBIntegration } = require('./agentdb-integration');
const { AutomaticRouter } = require('./automatic-routing');
const { PatternRecognitionSystem } = require('./pattern-recognition');
const { CrossSessionIntelligence } = require('./cross-session-intelligence');
const { Phase3Integration } = require('./phase3-integration');

// Main export - unified interface
module.exports = {
  // Primary interface
  Phase3Integration,

  // Individual components (for advanced use)
  AgentDBIntegration,
  AutomaticRouter,
  PatternRecognitionSystem,
  CrossSessionIntelligence,

  // Convenience factory
  createPhase3: (options = {}) => {
    return new Phase3Integration(options);
  }
};
