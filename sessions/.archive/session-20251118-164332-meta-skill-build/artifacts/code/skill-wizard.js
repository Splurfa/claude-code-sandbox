#!/usr/bin/env node

/**
 * Skill Wizard - Unified CLI for Skill Creation
 * Integrates Meta-Skill (Discovery) and Prompt-Improver (Refinement)
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const MetaSkillCoordinator = require('./.claude/skills/meta-skill/lib/coordinator');
const { SecurePromptImprover } = require('./.claude/skills/prompt-improver/prompt-improver-secure');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const isInteractive = process.stdin.isTTY;
let inputLines = [];
if (!isInteractive) {
  try {
    const fsSync = require('fs');
    const input = fsSync.readFileSync(0, 'utf-8');
    inputLines = input.split('\n').filter(l => l.trim().length > 0);
  } catch (e) {}
}

const question = (query) => {
  if (!isInteractive && inputLines.length > 0) {
    const answer = inputLines.shift();
    console.log(query + answer);
    return Promise.resolve(answer);
  }
  return new Promise((resolve) => rl.question(query, resolve));
};

async function main() {
  console.log('🧙‍♂️ Skill Wizard - Intelligent Skill Creator\n');

  const args = process.argv.slice(2);
  const command = args[0];
  const skillName = args[1];

  if (command !== 'create' || !skillName) {
    console.log('Usage: node skill-wizard.js create <skill-name>');
    process.exit(1);
  }

  // 1. Check for existing skills (Meta-Skill Integration)
  console.log(`🔍 Checking for existing skills matching "${skillName}"...`);
  const coordinator = new MetaSkillCoordinator();
  await coordinator.initialize();
  
  const searchResults = coordinator.searchSkills(skillName);
  if (!searchResults.includes('No skills found')) {
    console.log('\n⚠️  Found similar existing skills:');
    console.log(searchResults);
    const proceed = await question('Do you want to create a NEW skill anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('Aborted.');
      process.exit(0);
    }
  } else {
    console.log('✅ No conflicts found.');
  }

  // 2. Gather Skill Details
  console.log('\n📝 Define your new skill:');
  const description = await question('Description: ');
  const category = await question('Category (e.g., Development, Optimization): ');
  const content = await question('Draft Content (what should it do?): ');

  const draftSkill = `---
name: "${skillName}"
description: "${description}"
category: "${category}"
version: "1.0.0"
---

# ${skillName}

${content}
`;

  // 3. Refine Draft (Prompt-Improver Integration)
  console.log('\n✨ Refining skill draft with Prompt Improver...');
  const improver = new SecurePromptImprover({
    // Auto-approve for wizard mode to streamline flow
    confirmation: {
      confirm: async () => ({ approved: true, userSelections: { structure: true, clarity: true, coordination: true } })
    }
  });

  // Mock confirmation for CLI non-interactive mode if needed, but we are interactive here.
  // However, SecurePromptImprover's default confirmation might try to use its own readline or logic.
  // Let's override the confirm method to be safe and auto-approve or ask user here.
  // Actually, let's just let it run. If it needs input, it might conflict with our readline.
  // Safer to mock it to auto-approve for this "Wizard" experience which is already interactive.
  improver.confirmation.confirm = async (prompt, analysis, suggestions) => {
    console.log('\n💡 Suggested Improvements:');
    suggestions.structure.forEach(s => console.log(`- Structure: ${s.description}`));
    suggestions.clarity.forEach(s => console.log(`- Clarity: ${s.description}`));
    suggestions.coordination.forEach(s => console.log(`- Coordination: ${s.description}`));
    
    return { 
      approved: true, 
      userSelections: { structure: true, clarity: true, coordination: true } 
    };
  };

  const result = await improver.improvePrompt(draftSkill);
  
  let finalContent = draftSkill;
  if (result.shouldImprove) {
    console.log('\n✅ Draft improved automatically.');
    finalContent = result.improvedPrompt;
  } else {
    console.log('\n✅ Draft looks good!');
  }

  // 4. Save Skill
  const skillDir = path.join(process.cwd(), 'sessions', process.env.ACTIVE_SESSION_ID || 'current', 'artifacts', 'skills', skillName);
  // Fallback if no active session env var, try to find a recent session or just use a default
  // For this wizard, let's save to a specific location or ask.
  // The plan says "One-command execution".
  // Let's save to .claude/skills/ if user confirms, or a local draft folder.
  // For safety, let's save to a 'drafts' folder in current directory or session artifacts.
  
  // Let's try to detect session from path or env.
  // If not, default to .claude/skills/ (Production) or local.
  // Given "System Readiness", maybe we want to save to .claude/skills/ directly?
  // Let's ask.
  
  console.log('\n💾 Where to save?');
  console.log('1. Production (.claude/skills/)');
  console.log('2. Local Draft (./drafts/)');
  const saveOption = await question('Select (1/2): ');

  let targetPath;
  if (saveOption === '1') {
    targetPath = path.join(process.cwd(), '.claude', 'skills', skillName);
  } else {
    targetPath = path.join(process.cwd(), 'drafts', skillName);
  }

  await fs.mkdir(targetPath, { recursive: true });
  await fs.writeFile(path.join(targetPath, 'SKILL.md'), finalContent);

  console.log(`\n🎉 Skill created at: ${targetPath}/SKILL.md`);
  
  rl.close();
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

