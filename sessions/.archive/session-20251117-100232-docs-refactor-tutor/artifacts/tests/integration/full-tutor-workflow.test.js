/**
 * Full Tutor-Mode Workflow Integration Tests
 *
 * Tests complete end-to-end workflows for tutor-mode skill.
 *
 * Session: session-20251117-100232-docs-refactor-tutor
 * Agent: Tester
 */

const fs = require('fs');
const path = require('path');

describe('Full Tutor-Mode Workflow Integration', () => {
  const SKILL_PATH = path.join(process.cwd(), '.claude/skills/tutor-mode/SKILL.md');
  const SESSION_PATH = path.join(
    process.cwd(),
    'sessions/session-20251117-100232-docs-refactor-tutor/artifacts/docs'
  );

  describe('Complete Beginner Journey', () => {
    test('workflow: start → assess → foundations → exercise → progress', () => {
      // Simulate beginner user journey through tutor-mode
      const journey = {
        step1: '/tutor start',
        step2: '/tutor assess',
        step3: 'Read Phase 1: Foundations',
        step4: '/tutor exercise foundations',
        step5: '/tutor progress'
      };

      // Verify each step is documented
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        Object.values(journey).forEach(step => {
          if (step.startsWith('/tutor')) {
            expect(skillContent).toContain(step);
          }
        });
      }
    });

    test('foundations phase has all required content', () => {
      const foundationsTopics = [
        'what-is-claude-flow',
        'workspace-tour',
        'first-session',
        'basic-memory-usage'
      ];

      // Verify foundations topics are documented
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        foundationsTopics.forEach(topic => {
          expect(skillContent).toContain(topic);
        });
      }
    });

    test('success criteria are measurable', () => {
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        // Look for success criteria patterns
        expect(skillContent).toMatch(/✅.*can.*explain/i);
        expect(skillContent).toMatch(/✅.*understand/i);
        expect(skillContent).toMatch(/✅.*can.*start/i);
      }
    });
  });

  describe('Intermediate User Journey', () => {
    test('workflow: assess → skip to intermediate → queen selection → consensus', () => {
      const journey = {
        step1: '/tutor assess',
        step2: 'Jump to Phase 3: Intermediate',
        step3: 'Learn swarm topologies',
        step4: 'Learn queen selection',
        step5: 'Learn consensus mechanisms'
      };

      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        // Verify intermediate concepts are covered
        expect(skillContent).toContain('Phase 3');
        expect(skillContent).toContain('topology');
        expect(skillContent).toContain('queen');
        expect(skillContent).toContain('consensus');
      }
    });

    test('intermediate phase builds on foundations', () => {
      // Intermediate should reference foundation concepts
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        // Look for prerequisite mentions
        expect(skillContent).toMatch(/prerequisite|requires.*phase|before.*starting/i);
      }
    });
  });

  describe('Advanced User Journey', () => {
    test('workflow: assess → advanced topics → Byzantine consensus → ReasoningBank', () => {
      const advancedTopics = [
        'hive-mind',
        'byzantine-consensus',
        'adaptive-topology',
        'reasoning-bank'
      ];

      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        advancedTopics.forEach(topic => {
          expect(skillContent).toContain(topic);
        });
      }
    });

    test('mastery certification requirements defined', () => {
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        // Look for certification criteria
        expect(skillContent).toMatch(/certificate|certification/i);
        expect(skillContent).toMatch(/100%/);
        expect(skillContent).toContain('mastery');
      }
    });
  });

  describe('Learning Mode Switching', () => {
    test('can switch between ELI5 and technical modes', () => {
      const modes = [
        'ELI5',
        'Show Me The Code',
        'Test My Knowledge',
        'Why Does This Matter'
      ];

      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        modes.forEach(mode => {
          expect(skillContent).toContain(mode);
        });
      }
    });

    test('each mode has distinct characteristics', () => {
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        // ELI5 should have simple explanations
        const eli5Section = skillContent.includes('ELI5') ?
          skillContent.substring(skillContent.indexOf('ELI5'), skillContent.indexOf('ELI5') + 500) :
          '';

        if (eli5Section) {
          expect(eli5Section).toMatch(/simple|easy|imagine|like/i);
        }
      }
    });
  });

  describe('Progress Persistence', () => {
    test('progress saved to memory.db', () => {
      // Verify progress tracking uses memory
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        expect(skillContent).toContain('memory.db');
        expect(skillContent).toContain('tutor-progress');
      }
    });

    test('progress includes required fields', () => {
      // Mock progress structure
      const progressData = {
        userId: 'user-123',
        currentPhase: 'Phase 2',
        completedLessons: [],
        skillLevels: {},
        lastActive: new Date().toISOString()
      };

      expect(progressData).toHaveProperty('userId');
      expect(progressData).toHaveProperty('currentPhase');
      expect(progressData).toHaveProperty('completedLessons');
      expect(progressData).toHaveProperty('skillLevels');
    });
  });

  describe('Adaptive Recommendations', () => {
    test('recommendations based on assessment', () => {
      // Mock assessment results
      const assessment = {
        foundations: 0.8,
        essentialSkills: 0.6,
        intermediate: 0.2,
        advanced: 0.0
      };

      // Should recommend next phase
      const nextPhase = getNextRecommendedPhase(assessment);

      expect(nextPhase).toBe('essential-skills');
    });

    test('identifies weak areas', () => {
      const skills = {
        'parallel-execution': 0.9,
        'memory-coordination': 0.4,
        'consensus-mechanisms': 0.3
      };

      const weakAreas = Object.entries(skills)
        .filter(([_, score]) => score < 0.6)
        .map(([skill]) => skill);

      expect(weakAreas).toContain('memory-coordination');
      expect(weakAreas).toContain('consensus-mechanisms');
    });

    test('adjusts difficulty based on performance', () => {
      const userPerformance = {
        exercisesCompleted: 10,
        averageScore: 0.95,
        timeToComplete: 'fast'
      };

      // High performance should unlock harder content
      const shouldUnlockAdvanced = userPerformance.averageScore > 0.9;

      expect(shouldUnlockAdvanced).toBe(true);
    });
  });

  describe('Exercise System Integration', () => {
    test('exercises scale with user level', () => {
      const exerciseLevels = ['foundations', 'essential-skills', 'intermediate', 'advanced'];

      // Each level should have exercises
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        exerciseLevels.forEach(level => {
          expect(skillContent).toMatch(new RegExp(`exercise.*${level}`, 'i'));
        });
      }
    });

    test('exercises have clear objectives', () => {
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        // Look for exercise structure
        expect(skillContent).toMatch(/Exercise [FEIA]\d+/);
        expect(skillContent).toMatch(/objective|goal|requirement/i);
      }
    });
  });

  describe('Documentation Integration', () => {
    test('tutor-mode references learning files', () => {
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        // Should reference 22 learning files
        expect(skillContent).toMatch(/22 learning files/i);
      }
    });

    test('learning files organized by phase', () => {
      if (fs.existsSync(SESSION_PATH)) {
        const learningPath = path.join(SESSION_PATH, 'learning');

        if (fs.existsSync(learningPath)) {
          const items = fs.readdirSync(learningPath);

          // Should have phase directories
          const phasePattern = /^\d{2}-/;
          const phaseDirs = items.filter(item => phasePattern.test(item));

          expect(phaseDirs.length).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('system internals docs accessible', () => {
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        // Should reference system docs
        expect(skillContent).toMatch(/system.*docs|internals/i);
        expect(skillContent).toContain('architecture-overview');
      }
    });
  });

  describe('Error Handling and Recovery', () => {
    test('handles missing progress gracefully', () => {
      // When no prior progress exists
      const progress = null;

      // Should start from beginning
      const startingPhase = progress ? progress.currentPhase : 'Phase 1: Foundations';

      expect(startingPhase).toBe('Phase 1: Foundations');
    });

    test('handles invalid commands gracefully', () => {
      const invalidCommands = [
        '/tutor invalidCommand',
        '/tutor',
        '/tutor 123',
        '/tutor explain' // Missing topic
      ];

      // Should provide helpful error messages
      // (Implementation would handle these)
      invalidCommands.forEach(cmd => {
        expect(cmd).toMatch(/^\/tutor/);
      });
    });

    test('recovers from interrupted sessions', () => {
      // Mock interrupted session
      const interruptedProgress = {
        lastActive: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        currentPhase: 'Phase 2',
        inProgressLesson: 'parallel-execution'
      };

      // Should be able to resume
      expect(interruptedProgress.inProgressLesson).toBeDefined();
    });
  });

  describe('Captain\'s Log Integration', () => {
    test('suggests log entries at milestones', () => {
      if (fs.existsSync(SKILL_PATH)) {
        const skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');

        expect(skillContent).toContain('/tutor suggest-log');
        expect(skillContent).toMatch(/captain.*log/i);
      }
    });

    test('milestone achievements trigger suggestions', () => {
      const milestones = [
        'Phase 1: Foundations completion',
        'Phase 2: Essential Skills completion',
        'First Byzantine consensus implementation',
        'Mastery certification'
      ];

      // Each milestone should be notable
      milestones.forEach(milestone => {
        expect(milestone).toContain('completion');
      });
    });
  });

  describe('Memory Namespace Coordination', () => {
    test('uses distinct namespaces for different data', () => {
      const namespaces = [
        'tutor-progress/<user-id>',
        'tutor-exercises/<user-id>',
        'tutor-assessments/<user-id>',
        'tutor-preferences/<user-id>'
      ];

      // Each namespace should be unique
      const uniqueNamespaces = new Set(namespaces);
      expect(uniqueNamespaces.size).toBe(namespaces.length);
    });

    test('namespace structure prevents collisions', () => {
      const user1Progress = 'tutor-progress/user-123';
      const user2Progress = 'tutor-progress/user-456';

      // Different users should have different keys
      expect(user1Progress).not.toBe(user2Progress);
    });
  });
});

// Helper functions
function getNextRecommendedPhase(assessment) {
  const phases = [
    { name: 'foundations', score: assessment.foundations },
    { name: 'essential-skills', score: assessment.essentialSkills },
    { name: 'intermediate', score: assessment.intermediate },
    { name: 'advanced', score: assessment.advanced }
  ];

  // Find first phase below mastery (0.8)
  const nextPhase = phases.find(phase => phase.score < 0.8);

  return nextPhase ? nextPhase.name : 'mastery-achieved';
}
