#!/usr/bin/env node

/**
 * Basic test for Meta-Skill Coordinator
 * Run with: node test-coordinator.js
 */

const MetaSkillCoordinator = require('./lib/coordinator');

async function runTests() {
  console.log('🧪 Testing Meta-Skill Coordinator\n');

  const coordinator = new MetaSkillCoordinator();

  // Test 1: Initialize
  console.log('Test 1: Initialize coordinator...');
  await coordinator.initialize();
  console.log(`✅ Loaded ${coordinator.registry.size()} skills\n`);

  // Test 2: Show menu
  console.log('Test 2: Show category menu...');
  const menu = coordinator.showMenu();
  console.log(menu);
  console.log('✅ Menu generated\n');

  // Test 3: Natural language search
  console.log('Test 3: Natural language query...');
  const result = await coordinator.handle('help me optimize my prompts');
  console.log(result);
  console.log('✅ Natural language routing works\n');

  // Test 4: Search command
  console.log('Test 4: Search command...');
  const searchResult = coordinator.searchSkills('optimization');
  console.log(searchResult);
  console.log('✅ Search works\n');

  // Test 5: List skills
  console.log('Test 5: List all skills...');
  const list = coordinator.listSkills(false);
  console.log(list.substring(0, 500) + '...\n');
  console.log('✅ List works\n');

  console.log('🎉 All tests passed!');
}

// Run tests
runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
