const MetaSkillCoordinator = require('../../../../.claude/skills/meta-skill/lib/coordinator');

async function run() {
  const coordinator = new MetaSkillCoordinator();
  const result = await coordinator.handle('search build skill');
  console.log(result);
}

run().catch(console.error);

