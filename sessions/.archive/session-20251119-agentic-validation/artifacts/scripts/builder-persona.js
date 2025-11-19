const MetaSkillCoordinator = require('/Users/splurfa/common-thread-sandbox/.claude/skills/meta-skill/lib/coordinator');
const { SecurePromptImprover } = require('/Users/splurfa/common-thread-sandbox/.claude/skills/prompt-improver/prompt-improver-secure');
const fs = require('fs').promises;
const path = require('path');

async function runBuilderPersona() {
  console.log('--- BUILDER PERSONA START ---');

  // 1. Meta-Skill Search
  console.log('>>> ACTION: Searching for "build skill"');
  const coordinator = new MetaSkillCoordinator();
  const searchResult = await coordinator.handle('/meta search "build skill"');
  console.log(searchResult);

  // 2. Read Draft Skill
  const skillPath = path.join(__dirname, '../skills/test-skill/SKILL.md');
  console.log(`>>> ACTION: Reading draft skill from ${skillPath}`);
  const draftContent = await fs.readFile(skillPath, 'utf-8');
  console.log('Draft Content:', draftContent);

  // 3. Improve Skill with Prompt Improver
  console.log('>>> ACTION: Improving skill draft');
  const improver = new SecurePromptImprover({
    // Mock confirmation to always approve
    confirmation: {
      confirm: async () => ({ approved: true, userSelections: { structure: true, clarity: true, coordination: true } })
    }
  });
  
  // Mock the confirmation handler since we can't interact in CLI
  improver.confirmation.confirm = async () => ({ 
    approved: true, 
    userSelections: { structure: true, clarity: true, coordination: true } 
  });

  const result = await improver.improvePrompt(draftContent);
  
  if (result.shouldImprove) {
    console.log('>>> RESULT: Skill Improved');
    console.log('Improved Content:', result.improvedPrompt);
    
    // Save improved version
    await fs.writeFile(skillPath, result.improvedPrompt, 'utf-8');
    console.log('>>> ACTION: Saved improved skill');
  } else {
    console.log('>>> RESULT: No improvement needed (unexpected for draft)');
    console.log('Reason:', result.reason);
  }

  console.log('--- BUILDER PERSONA END ---');
}

runBuilderPersona().catch(console.error);

