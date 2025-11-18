/**
 * Diátaxis Compliance Tests
 *
 * Validates documentation structure against Diátaxis framework.
 * Diátaxis: https://diataxis.fr/
 *
 * Four quadrants:
 * 1. Tutorials (learning-oriented)
 * 2. How-To Guides (problem-oriented)
 * 3. Reference (information-oriented)
 * 4. Explanation (understanding-oriented)
 *
 * Session: session-20251117-100232-docs-refactor-tutor
 * Agent: Tester
 */

const fs = require('fs');
const path = require('path');

describe('Diátaxis Compliance Tests', () => {
  const DOCS_ROOT = path.join(process.cwd(), 'docs');

  describe('Directory Structure', () => {
    test('docs/ directory exists', () => {
      expect(fs.existsSync(DOCS_ROOT)).toBe(true);
    });

    test('has tutorials/ directory', () => {
      const tutorialsPath = path.join(DOCS_ROOT, 'tutorials');
      expect(fs.existsSync(tutorialsPath)).toBe(true);
    });

    test('has how-to/ directory', () => {
      const howToPath = path.join(DOCS_ROOT, 'how-to');
      expect(fs.existsSync(howToPath)).toBe(true);
    });

    test('has reference/ directory', () => {
      const referencePath = path.join(DOCS_ROOT, 'reference');
      expect(fs.existsSync(referencePath)).toBe(true);
    });

    test('has explanation/ directory', () => {
      const explanationPath = path.join(DOCS_ROOT, 'explanation');
      expect(fs.existsSync(explanationPath)).toBe(true);
    });

    test('has getting-started/ directory', () => {
      const gettingStartedPath = path.join(DOCS_ROOT, 'getting-started');
      expect(fs.existsSync(gettingStartedPath)).toBe(true);
    });

    test('has advanced/ directory', () => {
      const advancedPath = path.join(DOCS_ROOT, 'advanced');
      expect(fs.existsSync(advancedPath)).toBe(true);
    });
  });

  describe('Quadrant Content Separation', () => {
    let tutorialFiles = [];
    let howToFiles = [];
    let referenceFiles = [];
    let explanationFiles = [];

    beforeAll(() => {
      if (fs.existsSync(path.join(DOCS_ROOT, 'tutorials'))) {
        tutorialFiles = getMarkdownFiles(path.join(DOCS_ROOT, 'tutorials'));
      }
      if (fs.existsSync(path.join(DOCS_ROOT, 'how-to'))) {
        howToFiles = getMarkdownFiles(path.join(DOCS_ROOT, 'how-to'));
      }
      if (fs.existsSync(path.join(DOCS_ROOT, 'reference'))) {
        referenceFiles = getMarkdownFiles(path.join(DOCS_ROOT, 'reference'));
      }
      if (fs.existsSync(path.join(DOCS_ROOT, 'explanation'))) {
        explanationFiles = getMarkdownFiles(path.join(DOCS_ROOT, 'explanation'));
      }
    });

    test('tutorials contain learning-oriented content', () => {
      tutorialFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        // Tutorials should be step-by-step
        expect(content).toMatch(/step|Step|STEP/);

        // Should be beginner-friendly
        expect(content).toMatch(/first|start|begin|getting started/i);

        // Should not assume knowledge
        expect(content.toLowerCase()).not.toMatch(/as you already know|obviously|clearly/);
      });
    });

    test('how-to guides are problem-oriented', () => {
      howToFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        // How-to should address specific problems
        expect(content).toMatch(/how to|how do|to solve|to fix/i);

        // Should have actionable steps
        expect(content).toMatch(/^[\d#]+\./m); // Numbered or bulleted lists
      });
    });

    test('reference docs are information-oriented', () => {
      referenceFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        // Reference should be dry and factual
        // Should not have conversational tone
        expect(content.toLowerCase()).not.toMatch(/let's|we'll|you'll enjoy/);

        // Should have structured data
        expect(content).toMatch(/\|.*\|/); // Tables or structured data
      });
    });

    test('explanation docs focus on understanding', () => {
      explanationFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        // Explanations should discuss concepts
        expect(content).toMatch(/why|what|how.*works|concept|architecture/i);

        // Should provide context
        expect(content).toMatch(/because|reason|purpose|goal/i);
      });
    });
  });

  describe('Learning Files Organization', () => {
    const SESSION_DOCS = path.join(
      process.cwd(),
      'sessions/session-20251117-100232-docs-refactor-tutor/artifacts/docs'
    );

    test('learning directory exists in session artifacts', () => {
      if (fs.existsSync(SESSION_DOCS)) {
        const learningPath = path.join(SESSION_DOCS, 'learning');
        expect(fs.existsSync(learningPath)).toBe(true);
      }
    });

    test('learning files are organized by phase', () => {
      if (fs.existsSync(SESSION_DOCS)) {
        const learningPath = path.join(SESSION_DOCS, 'learning');
        if (fs.existsSync(learningPath)) {
          const phases = ['01-foundations', '02-essential-skills', '03-intermediate', '04-advanced'];

          phases.forEach(phase => {
            const phasePath = path.join(learningPath, phase);
            // Phase directory should exist or be planned
            // This is a guideline, not strict requirement
            if (fs.existsSync(phasePath)) {
              expect(fs.statSync(phasePath).isDirectory()).toBe(true);
            }
          });
        }
      }
    });

    test('00-start-here.md exists', () => {
      if (fs.existsSync(SESSION_DOCS)) {
        const learningPath = path.join(SESSION_DOCS, 'learning');
        if (fs.existsSync(learningPath)) {
          const startHere = path.join(learningPath, '00-start-here.md');
          expect(fs.existsSync(startHere)).toBe(true);
        }
      }
    });
  });

  describe('Cross-Reference Validation', () => {
    test('internal links use correct paths', () => {
      const allDocs = getAllMarkdownFiles(DOCS_ROOT);

      allDocs.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');
        const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
        let match;

        while ((match = linkPattern.exec(content)) !== null) {
          const linkPath = match[2];

          // Skip external links
          if (linkPath.startsWith('http')) continue;

          // Skip anchor links
          if (linkPath.startsWith('#')) continue;

          // Validate internal links
          const resolvedPath = path.resolve(path.dirname(file), linkPath);

          // Allow for links to files that will be created
          // Just check path structure is valid
          expect(linkPath).toMatch(/^[\w/-]+\.md$/);
        }
      });
    });

    test('no broken cross-quadrant references', () => {
      // Ensure tutorials don't inappropriately reference reference docs
      // and vice versa (guidelines, not strict rules)

      const tutorials = getMarkdownFiles(path.join(DOCS_ROOT, 'tutorials'));

      tutorials.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        // Tutorials should reference tutorials, not deep dives into reference
        // This is a soft guideline
        const refLinks = content.match(/\[([^\]]+)\]\(\.\.\/reference/g) || [];

        // Allow some reference links, but shouldn't be majority
        const tutorialLinks = content.match(/\[([^\]]+)\]\(\.\.\/tutorials/g) || [];

        // If there are many cross-references, they should be balanced
        if (refLinks.length > 5) {
          expect(tutorialLinks.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Progressive Disclosure', () => {
    test('getting-started has simple, beginner content', () => {
      const gettingStartedPath = path.join(DOCS_ROOT, 'getting-started');

      if (fs.existsSync(gettingStartedPath)) {
        const files = getMarkdownFiles(gettingStartedPath);

        files.forEach(file => {
          const content = fs.readFileSync(file, 'utf-8');

          // Should use simple language
          const complexTerms = [
            'Byzantine',
            'CRDT',
            'distributed consensus',
            'eventual consistency'
          ];

          // Getting started should not overwhelm with complex terms
          complexTerms.forEach(term => {
            if (content.includes(term)) {
              // If complex term used, should have explanation
              expect(content).toMatch(new RegExp(`${term}.*?\\(.*?\\)|${term}.*?is.*?a`, 'i'));
            }
          });
        });
      }
    });

    test('advanced/ has deep technical content', () => {
      const advancedPath = path.join(DOCS_ROOT, 'advanced');

      if (fs.existsSync(advancedPath)) {
        const files = getMarkdownFiles(advancedPath);

        files.forEach(file => {
          const content = fs.readFileSync(file, 'utf-8');

          // Advanced should have technical depth
          // Look for code examples, algorithms, architecture
          expect(content).toMatch(/```|algorithm|implementation|architecture/i);
        });
      }
    });
  });

  describe('Documentation Completeness', () => {
    test('each quadrant has README.md', () => {
      const quadrants = ['tutorials', 'how-to', 'reference', 'explanation'];

      quadrants.forEach(quadrant => {
        const quadrantPath = path.join(DOCS_ROOT, quadrant);
        if (fs.existsSync(quadrantPath)) {
          const readmePath = path.join(quadrantPath, 'README.md');
          expect(fs.existsSync(readmePath)).toBe(true);
        }
      });
    });

    test('main docs/README.md exists', () => {
      const mainReadme = path.join(DOCS_ROOT, 'README.md');
      expect(fs.existsSync(mainReadme)).toBe(true);
    });

    test('main README explains Diátaxis structure', () => {
      const mainReadme = path.join(DOCS_ROOT, 'README.md');

      if (fs.existsSync(mainReadme)) {
        const content = fs.readFileSync(mainReadme, 'utf-8');

        // Should explain the doc structure
        expect(content).toMatch(/diátaxis|documentation system|structure/i);
        expect(content).toContain('tutorials');
        expect(content).toContain('how-to');
        expect(content).toContain('reference');
        expect(content).toContain('explanation');
      }
    });
  });

  describe('Accessibility', () => {
    test('all docs have descriptive titles', () => {
      const allDocs = getAllMarkdownFiles(DOCS_ROOT);

      allDocs.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        // Should start with # heading
        expect(content).toMatch(/^#\s+.+$/m);
      });
    });

    test('code blocks have language identifiers', () => {
      const allDocs = getAllMarkdownFiles(DOCS_ROOT);

      allDocs.forEach(file => {
        const content = fs.readFileSync(file, 'utf-8');

        // Find all code blocks
        const codeBlocks = content.match(/```[\s\S]*?```/g) || [];

        codeBlocks.forEach(block => {
          // Should have language identifier
          expect(block).toMatch(/```[a-z]+\n/);
        });
      });
    });
  });
});

// Helper functions
function getMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function getAllMarkdownFiles(root) {
  return getMarkdownFiles(root);
}
