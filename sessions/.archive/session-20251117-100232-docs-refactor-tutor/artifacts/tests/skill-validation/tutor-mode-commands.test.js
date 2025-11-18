/**
 * Tutor-Mode Command Validation Tests
 *
 * Tests all tutor-mode skill commands for functionality and correctness.
 *
 * Session: session-20251117-100232-docs-refactor-tutor
 * Agent: Tester
 */

const fs = require('fs');
const path = require('path');

describe('Tutor-Mode Command Validation', () => {
  const SKILL_PATH = path.join(process.cwd(), '.claude/skills/tutor-mode/SKILL.md');
  let skillContent;

  beforeAll(() => {
    // Read skill file
    if (fs.existsSync(SKILL_PATH)) {
      skillContent = fs.readFileSync(SKILL_PATH, 'utf-8');
    }
  });

  describe('Skill File Existence', () => {
    test('tutor-mode SKILL.md exists', () => {
      expect(fs.existsSync(SKILL_PATH)).toBe(true);
    });

    test('SKILL.md has content', () => {
      expect(skillContent).toBeDefined();
      expect(skillContent.length).toBeGreaterThan(0);
    });

    test('SKILL.md has YAML frontmatter', () => {
      expect(skillContent).toMatch(/^---\n/);
      expect(skillContent).toMatch(/name:\s+tutor-mode/);
      expect(skillContent).toMatch(/version:\s+[\d.]+/);
    });
  });

  describe('Command Documentation', () => {
    const commands = [
      '/tutor start',
      '/tutor assess',
      '/tutor next',
      '/tutor explain',
      '/tutor exercise',
      '/tutor review',
      '/tutor path',
      '/tutor progress',
      '/tutor help'
    ];

    commands.forEach(command => {
      test(`${command} is documented`, () => {
        expect(skillContent).toContain(command);
      });
    });

    test('All commands have descriptions', () => {
      const commandDescriptionPattern = /\/tutor\s+\w+\s+-\s+.+/g;
      const matches = skillContent.match(commandDescriptionPattern);
      expect(matches).toBeDefined();
      expect(matches.length).toBeGreaterThanOrEqual(commands.length);
    });
  });

  describe('Learning Path Structure', () => {
    const phases = [
      'Phase 1: Foundations',
      'Phase 2: Essential Skills',
      'Phase 3: Intermediate',
      'Phase 4: Advanced'
    ];

    phases.forEach(phase => {
      test(`${phase} is defined`, () => {
        expect(skillContent).toContain(phase);
      });

      test(`${phase} has learning files`, () => {
        // Look for markdown file references related to this phase
        const phaseNum = phase.match(/Phase (\d+)/)[1];
        const filePattern = new RegExp(`0${phaseNum}-\\w+/.*\\.md`);
        expect(skillContent).toMatch(filePattern);
      });
    });

    test('Learning path has time estimates', () => {
      expect(skillContent).toMatch(/2-4 hours/i);
      expect(skillContent).toMatch(/1-2 days/i);
      expect(skillContent).toMatch(/1-2 weeks/i);
    });

    test('Learning path has success criteria', () => {
      const successPattern = /Success Criteria:[\s\S]*?✅/;
      expect(skillContent).toMatch(successPattern);
    });
  });

  describe('Learning File References', () => {
    test('References 22 learning files', () => {
      // Look for claim of 22 learning files
      const fileCountMatch = skillContent.match(/22 learning files/i);
      expect(fileCountMatch).toBeTruthy();
    });

    test('References system internals docs', () => {
      expect(skillContent).toMatch(/system.*docs/i);
      expect(skillContent).toMatch(/architecture-overview\.md/i);
    });

    test('Has valid file paths', () => {
      // Extract markdown file references
      const pathPattern = /sessions\/.*?\.md/g;
      const paths = skillContent.match(pathPattern);

      expect(paths).toBeDefined();
      expect(paths.length).toBeGreaterThan(0);

      // Validate path structure
      paths.forEach(filePath => {
        expect(filePath).toMatch(/^sessions\/session-[\d-]+\/artifacts\/docs\//);
      });
    });
  });

  describe('Exercise System', () => {
    const exerciseLevels = ['foundations', 'essential-skills', 'intermediate', 'advanced'];

    exerciseLevels.forEach(level => {
      test(`${level} exercises are documented`, () => {
        const levelPattern = new RegExp(`exercise.*${level}`, 'i');
        expect(skillContent).toMatch(levelPattern);
      });
    });

    test('Exercise structure is defined', () => {
      expect(skillContent).toContain('Exercise F1');
      expect(skillContent).toContain('Exercise E1');
      expect(skillContent).toContain('Exercise I1');
      expect(skillContent).toContain('Exercise A1');
    });

    test('Exercises have descriptions', () => {
      const exercisePattern = /Exercise [FEIA]\d+.*?:/g;
      const matches = skillContent.match(exercisePattern);
      expect(matches).toBeDefined();
      expect(matches.length).toBeGreaterThanOrEqual(12); // At least 3 per phase
    });
  });

  describe('Interactive Learning Modes', () => {
    const modes = [
      'ELI5',
      'Show Me The Code',
      'Test My Knowledge',
      'Why Does This Matter'
    ];

    modes.forEach(mode => {
      test(`${mode} mode is documented`, () => {
        expect(skillContent).toContain(mode);
      });

      test(`${mode} has example usage`, () => {
        // Look for example sections near mode mentions
        const modeIndex = skillContent.indexOf(mode);
        const sectionAfterMode = skillContent.slice(modeIndex, modeIndex + 500);
        expect(sectionAfterMode).toMatch(/Example|example|```/);
      });
    });
  });

  describe('Progress Tracking', () => {
    test('Memory-based tracking is documented', () => {
      expect(skillContent).toContain('memory.db');
      expect(skillContent).toContain('tutor-progress');
    });

    test('Context7 integration is mentioned', () => {
      expect(skillContent).toContain('context7');
      expect(skillContent).toMatch(/context7.*optional/i);
    });

    test('Progress commands are documented', () => {
      expect(skillContent).toContain('/tutor progress');
      expect(skillContent).toContain('/tutor mark-complete');
      expect(skillContent).toContain('/tutor reset-progress');
    });

    test('Namespace structure is defined', () => {
      expect(skillContent).toMatch(/tutor-progress\/.*user-id/i);
      expect(skillContent).toMatch(/tutor-exercises/i);
    });
  });

  describe('Knowledge Assessment', () => {
    test('Assessment system is documented', () => {
      expect(skillContent).toContain('/tutor assess');
      expect(skillContent).toMatch(/assessment/i);
    });

    test('Assessment categories are defined', () => {
      expect(skillContent).toMatch(/concept.*understanding/i);
      expect(skillContent).toMatch(/practical.*skills/i);
      expect(skillContent).toMatch(/pattern.*recognition/i);
      expect(skillContent).toMatch(/problem.*solving/i);
    });

    test('Assessment output format is shown', () => {
      // Look for percentage/progress indicators
      expect(skillContent).toMatch(/\d+%/);
      expect(skillContent).toMatch(/✅|❌|⚠️/);
    });
  });

  describe('Adaptive Learning Engine', () => {
    test('Adaptive features are documented', () => {
      expect(skillContent).toContain('adaptive');
      expect(skillContent).toMatch(/adaptive.*learning/i);
    });

    test('Recommendation system is described', () => {
      expect(skillContent).toMatch(/recommend/i);
      expect(skillContent).toContain('Next Steps');
    });

    test('Weakness detection is documented', () => {
      expect(skillContent).toMatch(/weak.*areas/i);
      expect(skillContent).toMatch(/struggling|difficulty/i);
    });

    test('Learning velocity tracking is mentioned', () => {
      expect(skillContent).toMatch(/velocity|pace|speed/i);
      expect(skillContent).toMatch(/faster.*than.*average|slower/i);
    });
  });

  describe('System Integration', () => {
    test('Captain\'s Log integration is documented', () => {
      expect(skillContent).toMatch(/captain.*log/i);
      expect(skillContent).toContain('/tutor suggest-log');
    });

    test('Memory coordination is documented', () => {
      expect(skillContent).toMatch(/memory.*namespace/i);
      expect(skillContent).toContain('coordination');
    });

    test('Session awareness is mentioned', () => {
      expect(skillContent).toMatch(/session.*aware/i);
      expect(skillContent).toContain('artifacts');
    });

    test('Hook integration is referenced', () => {
      expect(skillContent).toMatch(/hooks/i);
    });
  });

  describe('Topic Coverage', () => {
    const coreTopics = [
      'agents',
      'memory',
      'sessions',
      'parallel-execution',
      'coordination',
      'hooks',
      'mesh-topology',
      'hierarchical-topology',
      'consensus',
      'byzantine-consensus',
      'hive-mind',
      'reasoning-bank'
    ];

    coreTopics.forEach(topic => {
      test(`${topic} is covered`, () => {
        expect(skillContent).toContain(topic);
      });
    });

    test('All topologies are explained', () => {
      expect(skillContent).toContain('mesh');
      expect(skillContent).toContain('hierarchical');
      expect(skillContent).toContain('star');
      expect(skillContent).toContain('ring');
    });
  });

  describe('Example Interactions', () => {
    test('Has example beginner session', () => {
      expect(skillContent).toMatch(/example.*beginner|beginner.*example/i);
      expect(skillContent).toMatch(/new.*to.*claude-flow/i);
    });

    test('Has example intermediate session', () => {
      expect(skillContent).toMatch(/example.*intermediate|intermediate.*example/i);
    });

    test('Has example advanced session', () => {
      expect(skillContent).toMatch(/example.*advanced|advanced.*example/i);
    });

    test('Examples show realistic interactions', () => {
      // Look for user/tutor dialogue format
      expect(skillContent).toMatch(/User:.*\n.*Tutor:/);
    });
  });

  describe('Mastery Certification', () => {
    test('Certification system is documented', () => {
      expect(skillContent).toMatch(/certificate|certification/i);
      expect(skillContent).toMatch(/mastery/i);
    });

    test('Milestone achievements are defined', () => {
      expect(skillContent).toMatch(/🥉|bronze/i);
      expect(skillContent).toMatch(/🥈|silver/i);
      expect(skillContent).toMatch(/🥇|gold/i);
      expect(skillContent).toMatch(/💎|platinum/i);
    });

    test('Completion criteria are clear', () => {
      expect(skillContent).toMatch(/100%/);
      expect(skillContent).toMatch(/complete.*all.*phases/i);
    });
  });

  describe('Documentation Quality', () => {
    test('Has clear structure with headers', () => {
      const headerPattern = /^#{1,6}\s+.+$/gm;
      const headers = skillContent.match(headerPattern);
      expect(headers).toBeDefined();
      expect(headers.length).toBeGreaterThan(20);
    });

    test('Has code examples', () => {
      const codeBlockPattern = /```[\s\S]*?```/g;
      const codeBlocks = skillContent.match(codeBlockPattern);
      expect(codeBlocks).toBeDefined();
      expect(codeBlocks.length).toBeGreaterThan(10);
    });

    test('Has visual elements', () => {
      // Look for visual structure (ASCII art, diagrams, progress bars)
      expect(skillContent).toMatch(/[│├└─]/); // Box drawing characters
      expect(skillContent).toMatch(/[█░]/); // Progress bars
    });

    test('Has emojis for visual interest', () => {
      expect(skillContent).toMatch(/[🎓📖🎯🏋️🧠📊🎮🔧💡📚🗺️🌟]/);
    });

    test('Has clear call-to-action', () => {
      expect(skillContent).toMatch(/ready.*to.*begin/i);
      expect(skillContent).toMatch(/let.*s.*start/i);
    });
  });
});
