#!/usr/bin/env node

/**
 * Tutor Mode - Interactive Learning Assistant
 *
 * Main entry point for slash command handler.
 * Processes user questions and coordinates with answer engine.
 */

const path = require('path');
const AnswerEngine = require('./answer-engine');
const MemoryManager = require('./memory-manager');

/**
 * Main tutor handler
 * Processes /tutor commands and routes to appropriate handlers
 */
class TutorMode {
  constructor() {
    this.answerEngine = new AnswerEngine();
    this.memoryManager = new MemoryManager();
    this.sessionId = process.env.ACTIVE_SESSION_ID || 'default';
  }

  /**
   * Process tutor command
   * @param {string[]} args - Command arguments
   * @returns {Promise<void>}
   */
  async processCommand(args) {
    const command = args[0] || 'help';
    const restArgs = args.slice(1);

    switch (command) {
      case 'start':
        await this.handleStart();
        break;
      case 'assess':
        await this.handleAssess();
        break;
      case 'next':
        await this.handleNext();
        break;
      case 'explain':
        await this.handleExplain(restArgs);
        break;
      case 'exercise':
        await this.handleExercise(restArgs);
        break;
      case 'review':
        await this.handleReview();
        break;
      case 'path':
        await this.handlePath();
        break;
      case 'progress':
        await this.handleProgress();
        break;
      case 'help':
        await this.handleHelp(restArgs);
        break;
      default:
        // Treat as a question
        await this.handleQuestion([command, ...restArgs]);
    }
  }

  /**
   * Handle /tutor start - Begin learning journey
   */
  async handleStart() {
    console.log('🎓 Welcome to Tutor Mode!');
    console.log('');
    console.log('I\'m your adaptive learning guide for claude-flow orchestration.');
    console.log('');
    console.log('Let\'s get started with a quick assessment to customize your path.');
    console.log('');

    await this.handleAssess();
  }

  /**
   * Handle /tutor assess - Knowledge assessment
   */
  async handleAssess() {
    console.log('📊 Running knowledge assessment...');
    console.log('');

    const userHistory = await this.memoryManager.getUserHistory();
    const assessment = this.assessKnowledge(userHistory);

    console.log('Assessment Results:');
    console.log('===================');
    for (const phase of assessment.phases) {
      const bar = this.createProgressBar(phase.score);
      const status = phase.score >= 80 ? '✅' : phase.score >= 50 ? '⚠️' : '❌';
      console.log(`${status} ${phase.name}: ${bar} ${phase.score}%`);
    }
    console.log('');
    console.log('Recommendation:', assessment.recommendation);
    console.log('');

    // Store assessment in memory
    await this.memoryManager.storeAssessment(assessment);
  }

  /**
   * Handle /tutor next - Get next recommended lesson
   */
  async handleNext() {
    const userHistory = await this.memoryManager.getUserHistory();
    const assessment = this.assessKnowledge(userHistory);

    console.log('📚 Recommended Next Step:');
    console.log('');
    console.log(`Phase: ${assessment.currentPhase}`);
    console.log(`Topic: ${assessment.nextTopic}`);
    console.log(`File: ${assessment.nextFile}`);
    console.log('');
    console.log('Estimated time:', assessment.estimatedTime);
  }

  /**
   * Handle /tutor explain <topic> - Explain a topic
   */
  async handleExplain(args) {
    const topic = args.join(' ');

    if (!topic) {
      console.error('❌ Usage: /tutor explain <topic>');
      return;
    }

    console.log(`🔍 Explaining: ${topic}`);
    console.log('');

    const answer = await this.answerEngine.answerQuestion(topic);
    console.log(answer);

    // Store interaction
    await this.memoryManager.recordInteraction('explain', topic, answer);
  }

  /**
   * Handle /tutor exercise <level> - Practice exercises
   */
  async handleExercise(args) {
    const level = args[0] || 'foundations';

    console.log(`🏋️ Exercise: ${level}`);
    console.log('');

    const exercise = this.getExercise(level);
    console.log(exercise);

    // Store interaction
    await this.memoryManager.recordInteraction('exercise', level, exercise);
  }

  /**
   * Handle /tutor review - Review weak areas
   */
  async handleReview() {
    console.log('📝 Review Session');
    console.log('');

    const userHistory = await this.memoryManager.getUserHistory();
    const weakAreas = this.identifyWeakAreas(userHistory);

    console.log('Areas needing attention:');
    for (const area of weakAreas) {
      console.log(`⚠️  ${area.topic} - ${area.reason}`);
    }
    console.log('');
    console.log('Recommended: Review these topics with /tutor explain');
  }

  /**
   * Handle /tutor path - Show learning roadmap
   */
  async handlePath() {
    console.log('🗺️  Learning Roadmap');
    console.log('');
    console.log('Phase 1: Foundations (2-4 hours)');
    console.log('  ├─ What is Claude-Flow?');
    console.log('  ├─ Workspace Tour');
    console.log('  ├─ First Session');
    console.log('  └─ Basic Memory');
    console.log('');
    console.log('Phase 2: Essential Skills (1-2 days)');
    console.log('  ├─ Spawning Agents');
    console.log('  ├─ Parallel Execution');
    console.log('  ├─ Memory Coordination');
    console.log('  └─ Session Management');
    console.log('');
    console.log('Phase 3: Intermediate (1-2 weeks)');
    console.log('  ├─ Swarm Topologies');
    console.log('  ├─ Queen Selection');
    console.log('  ├─ Consensus Mechanisms');
    console.log('  └─ Custom Workflows');
    console.log('');
    console.log('Phase 4: Advanced (Ongoing)');
    console.log('  ├─ Hive-Mind Coordination');
    console.log('  ├─ Byzantine Consensus');
    console.log('  ├─ Adaptive Topology');
    console.log('  └─ ReasoningBank Learning');
  }

  /**
   * Handle /tutor progress - Show learning progress
   */
  async handleProgress() {
    const userHistory = await this.memoryManager.getUserHistory();

    console.log('📈 Your Learning Progress');
    console.log('');
    console.log(`Total interactions: ${userHistory.totalInteractions}`);
    console.log(`Topics explored: ${userHistory.topicsExplored.length}`);
    console.log(`Exercises completed: ${userHistory.exercisesCompleted.length}`);
    console.log('');
    console.log('Recent activity:');
    for (const interaction of userHistory.recentInteractions.slice(0, 5)) {
      console.log(`  - ${interaction.type}: ${interaction.topic}`);
    }
  }

  /**
   * Handle /tutor help <topic> - Get help
   */
  async handleHelp(args) {
    const topic = args.join(' ');

    if (topic) {
      console.log(`📖 Help: ${topic}`);
      console.log('');
      const answer = await this.answerEngine.answerQuestion(`help with ${topic}`);
      console.log(answer);
    } else {
      this.showHelpMenu();
    }
  }

  /**
   * Handle general questions (default handler)
   */
  async handleQuestion(args) {
    const question = args.join(' ');

    console.log('💡 Answering your question...');
    console.log('');

    const answer = await this.answerEngine.answerQuestion(question);
    console.log(answer);

    // Store interaction
    await this.memoryManager.recordInteraction('question', question, answer);
  }

  /**
   * Show help menu
   */
  showHelpMenu() {
    console.log('🎓 Tutor Mode - Command Reference');
    console.log('');
    console.log('Commands:');
    console.log('  /tutor start              - Begin guided learning journey');
    console.log('  /tutor assess             - Check your current knowledge level');
    console.log('  /tutor next               - Get recommended next lesson');
    console.log('  /tutor explain <topic>    - Deep dive on any topic');
    console.log('  /tutor exercise <level>   - Practice challenge');
    console.log('  /tutor review             - Strengthen weak areas');
    console.log('  /tutor path               - Show full learning roadmap');
    console.log('  /tutor progress           - View your learning progress');
    console.log('  /tutor help <topic>       - Get help on specific topics');
    console.log('');
    console.log('You can also ask any question directly:');
    console.log('  /tutor <your question>');
  }

  /**
   * Assess user knowledge based on history
   * @param {Object} userHistory - User interaction history
   * @returns {Object} Assessment results
   */
  assessKnowledge(userHistory) {
    const phases = [
      { name: 'Phase 1: Foundations', score: this.calculatePhaseScore(userHistory, 'foundations') },
      { name: 'Phase 2: Essential Skills', score: this.calculatePhaseScore(userHistory, 'essential') },
      { name: 'Phase 3: Intermediate', score: this.calculatePhaseScore(userHistory, 'intermediate') },
      { name: 'Phase 4: Advanced', score: this.calculatePhaseScore(userHistory, 'advanced') }
    ];

    const currentPhase = phases.find(p => p.score < 80) || phases[phases.length - 1];

    return {
      phases,
      currentPhase: currentPhase.name,
      nextTopic: this.getNextTopic(currentPhase.name),
      nextFile: this.getNextFile(currentPhase.name),
      estimatedTime: this.getEstimatedTime(currentPhase.name),
      recommendation: `Focus on ${currentPhase.name} to build strong foundation`
    };
  }

  /**
   * Calculate phase score based on user history
   */
  calculatePhaseScore(userHistory, phase) {
    // Simple scoring based on interaction count
    const relevantInteractions = userHistory.topicsExplored.filter(t =>
      t.toLowerCase().includes(phase)
    );
    return Math.min(100, relevantInteractions.length * 20);
  }

  /**
   * Get next recommended topic
   */
  getNextTopic(phase) {
    const topics = {
      'Phase 1: Foundations': 'What is Claude-Flow?',
      'Phase 2: Essential Skills': 'Spawning Agents',
      'Phase 3: Intermediate': 'Swarm Topologies',
      'Phase 4: Advanced': 'Hive-Mind Coordination'
    };
    return topics[phase] || 'What is Claude-Flow?';
  }

  /**
   * Get next recommended file
   */
  getNextFile(phase) {
    const files = {
      'Phase 1: Foundations': 'docs/explanation/workspace-architecture.md',
      'Phase 2: Essential Skills': 'docs/how-to/spawning-agents.md',
      'Phase 3: Intermediate': 'docs/reference/swarm-topologies.md',
      'Phase 4: Advanced': 'docs/advanced/hive-mind-coordination.md'
    };
    return files[phase] || 'docs/explanation/workspace-architecture.md';
  }

  /**
   * Get estimated time for phase
   */
  getEstimatedTime(phase) {
    const times = {
      'Phase 1: Foundations': '2-4 hours',
      'Phase 2: Essential Skills': '1-2 days',
      'Phase 3: Intermediate': '1-2 weeks',
      'Phase 4: Advanced': 'Ongoing'
    };
    return times[phase] || '2-4 hours';
  }

  /**
   * Get exercise for level
   */
  getExercise(level) {
    const exercises = {
      foundations: 'Exercise F1: Start your first session and spawn a single agent',
      essential: 'Exercise E1: Spawn 5 agents in parallel using one message',
      intermediate: 'Exercise I1: Choose optimal topology for a given project',
      advanced: 'Exercise A1: Implement Byzantine consensus with 7 agents'
    };
    return exercises[level] || exercises.foundations;
  }

  /**
   * Identify weak areas from user history
   */
  identifyWeakAreas(userHistory) {
    // Simple heuristic: topics with few interactions
    const topicCounts = {};
    for (const topic of userHistory.topicsExplored) {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    }

    const weakAreas = [];
    const importantTopics = ['parallel-execution', 'memory-coordination', 'swarm-topologies'];

    for (const topic of importantTopics) {
      if ((topicCounts[topic] || 0) < 3) {
        weakAreas.push({
          topic,
          reason: 'Limited interaction with this critical topic'
        });
      }
    }

    return weakAreas;
  }

  /**
   * Create progress bar string
   */
  createProgressBar(score) {
    const total = 10;
    const filled = Math.floor((score / 100) * total);
    const empty = total - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const tutor = new TutorMode();

  tutor.processCommand(args)
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Error:', error.message);
      process.exit(1);
    });
}

module.exports = TutorMode;
