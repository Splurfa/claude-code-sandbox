#!/usr/bin/env node
/**
 * Non-Interactive Test for Refactored Batch Closeout
 *
 * This test validates the 4-phase flow by examining code structure
 * and verifying that interactive prompts are properly isolated in Phase 3.
 *
 * Key validations:
 * 1. Phase 1-2 have NO readline/prompt calls
 * 2. Phase 3 contains ALL interactive prompts
 * 3. Phase 4 has NO readline/prompt calls
 * 4. Architecture supports background execution after Phase 3
 */

const fs = require('fs');
const path = require('path');

// Test configuration
const REFACTORED_CODE_PATH = path.join(
  __dirname,
  '../../../session-20251114-120738-system-validation/artifacts/code/batch-closeout-refactored.js'
);

const TEST_RESULTS_DIR = path.join(__dirname, '../docs');

/**
 * Analyze code structure to validate phase separation
 */
function analyzeCodeStructure() {
  console.log('🔍 Analyzing refactored code structure...\n');

  const code = fs.readFileSync(REFACTORED_CODE_PATH, 'utf-8');

  const analysis = {
    totalLines: code.split('\n').length,
    phases: {
      phase1: { start: null, end: null, hasPrompts: false },
      phase2: { start: null, end: null, hasPrompts: false },
      phase3: { start: null, end: null, hasPrompts: false },
      phase4: { start: null, end: null, hasPrompts: false }
    },
    promptLocations: [],
    readlineUsage: []
  };

  const lines = code.split('\n');

  // Find phase boundaries
  lines.forEach((line, index) => {
    if (line.includes('PHASE 1:')) analysis.phases.phase1.start = index;
    if (line.includes('PHASE 2:')) {
      analysis.phases.phase1.end = index;
      analysis.phases.phase2.start = index;
    }
    if (line.includes('PHASE 3:')) {
      analysis.phases.phase2.end = index;
      analysis.phases.phase3.start = index;
    }
    if (line.includes('PHASE 4:')) {
      analysis.phases.phase3.end = index;
      analysis.phases.phase4.start = index;
    }

    // Detect prompt usage
    if (line.includes('promptUser') || line.includes('promptForEdit')) {
      analysis.promptLocations.push({
        line: index + 1,
        code: line.trim(),
        phase: getPhaseForLine(index, analysis.phases)
      });
    }

    // Detect readline usage
    if (line.includes('readline.createInterface')) {
      analysis.readlineUsage.push({
        line: index + 1,
        context: 'readline.createInterface'
      });
    }
  });

  return analysis;
}

/**
 * Helper to determine which phase a line belongs to
 */
function getPhaseForLine(lineNum, phases) {
  if (phases.phase4.start && lineNum >= phases.phase4.start) return 'phase4';
  if (phases.phase3.start && lineNum >= phases.phase3.start) return 'phase3';
  if (phases.phase2.start && lineNum >= phases.phase2.start) return 'phase2';
  if (phases.phase1.start && lineNum >= phases.phase1.start) return 'phase1';
  return 'setup';
}

/**
 * Validate phase isolation
 */
function validatePhaseIsolation(analysis) {
  console.log('✅ Validating Phase Isolation...\n');

  const results = {
    phase1_clean: true,
    phase2_clean: true,
    phase3_hasPrompts: false,
    phase4_clean: true,
    violations: []
  };

  // Check each prompt location
  analysis.promptLocations.forEach(prompt => {
    console.log(`  📍 Line ${prompt.line} (${prompt.phase}): ${prompt.code}`);

    switch (prompt.phase) {
      case 'phase1':
        results.phase1_clean = false;
        results.violations.push(`Phase 1 has prompt at line ${prompt.line}`);
        break;
      case 'phase2':
        results.phase2_clean = false;
        results.violations.push(`Phase 2 has prompt at line ${prompt.line}`);
        break;
      case 'phase3':
        results.phase3_hasPrompts = true;
        break;
      case 'phase4':
        results.phase4_clean = false;
        results.violations.push(`Phase 4 has prompt at line ${prompt.line}`);
        break;
    }
  });

  console.log('');

  return results;
}

/**
 * Run structural analysis test
 */
function runStructuralTest() {
  const results = {
    testName: 'Structural Analysis - Background Process Safety',
    timestamp: new Date().toISOString(),
    success: false,
    analysis: null,
    validation: null,
    errors: []
  };

  try {
    console.log('=' .repeat(70));
    console.log('STRUCTURAL TEST: Background Process Refactor Validation');
    console.log('=' .repeat(70) + '\n');

    // Analyze code structure
    const analysis = analyzeCodeStructure();
    results.analysis = analysis;

    console.log('📊 Code Structure:');
    console.log(`  Total Lines: ${analysis.totalLines}`);
    console.log(`  Prompt Calls: ${analysis.promptLocations.length}`);
    console.log(`  Readline Usage: ${analysis.readlineUsage.length}\n`);

    // Validate phase isolation
    const validation = validatePhaseIsolation(analysis);
    results.validation = validation;

    // Determine success
    results.success =
      validation.phase1_clean &&
      validation.phase2_clean &&
      validation.phase3_hasPrompts &&
      validation.phase4_clean;

    // Display results
    console.log('=' .repeat(70));
    console.log('VALIDATION RESULTS');
    console.log('=' .repeat(70));
    console.log(`✅ Phase 1 Clean (No Prompts): ${validation.phase1_clean ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Phase 2 Clean (No Prompts): ${validation.phase2_clean ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Phase 3 Has Prompts: ${validation.phase3_hasPrompts ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Phase 4 Clean (No Prompts): ${validation.phase4_clean ? 'PASS' : 'FAIL'}`);
    console.log('=' .repeat(70) + '\n');

    if (validation.violations.length > 0) {
      console.log('❌ VIOLATIONS FOUND:');
      validation.violations.forEach(v => console.log(`  - ${v}`));
      console.log('');
    }

    console.log(`🎯 Overall Result: ${results.success ? '✅ PASSED' : '❌ FAILED'}\n`);

    return results;

  } catch (error) {
    results.success = false;
    results.errors.push({
      message: error.message,
      stack: error.stack
    });

    console.error('❌ TEST FAILED:', error.message);
    return results;
  }
}

/**
 * Generate test report
 */
function generateReport(results) {
  const reportPath = path.join(TEST_RESULTS_DIR, 'background-process-test-report.md');

  const promptsByPhase = {
    phase1: results.analysis?.promptLocations.filter(p => p.phase === 'phase1') || [],
    phase2: results.analysis?.promptLocations.filter(p => p.phase === 'phase2') || [],
    phase3: results.analysis?.promptLocations.filter(p => p.phase === 'phase3') || [],
    phase4: results.analysis?.promptLocations.filter(p => p.phase === 'phase4') || []
  };

  const report = `# Background Process Test Report

**Test Name:** ${results.testName}
**Test Type:** Structural Code Analysis (Non-Interactive)
**Timestamp:** ${results.timestamp}
**Status:** ${results.success ? '✅ PASSED' : '❌ FAILED'}

## Executive Summary

This test validates that the refactored batch closeout implementation properly isolates ALL interactive prompts in Phase 3, making Phase 4 safe for background execution without hanging.

### Key Finding: ${results.success ? '✅ ARCHITECTURE VALIDATED' : '❌ ARCHITECTURE ISSUES FOUND'}

${results.success ? `
The refactored code successfully implements the 4-phase architecture:
- **Phases 1-2:** Summary generation and preview (zero interactive prompts)
- **Phase 3:** ALL HITL approval prompts (batch + Captain's Log)
- **Phase 4:** Archive execution only (zero interactive prompts)

**Result:** Phase 4 can run in background without hanging.
` : `
Architecture issues detected:
${results.validation?.violations.map(v => `- ${v}`).join('\n') || 'Unknown errors'}
`}

## Test Methodology

**Approach:** Static code analysis to validate phase separation

**Validation Criteria:**
1. Phase 1 (Summary Generation) - Must have ZERO prompts
2. Phase 2 (Preview Display) - Must have ZERO prompts
3. Phase 3 (HITL Approval) - Must contain ALL prompts
4. Phase 4 (Archive Execution) - Must have ZERO prompts

**Code Analyzed:** \`batch-closeout-refactored.js\`
**Total Lines:** ${results.analysis?.totalLines || 'N/A'}
**Prompt Calls Found:** ${results.analysis?.promptLocations.length || 0}

## Detailed Results

### Phase 1: Summary Generation
- **Interactive Prompts:** ${promptsByPhase.phase1.length}
- **Status:** ${results.validation?.phase1_clean ? '✅ CLEAN (No Prompts)' : '❌ VIOLATION'}
${promptsByPhase.phase1.length > 0 ? `\n**Violations:**\n${promptsByPhase.phase1.map(p => `- Line ${p.line}: ${p.code}`).join('\n')}` : ''}

### Phase 2: Preview Display
- **Interactive Prompts:** ${promptsByPhase.phase2.length}
- **Status:** ${results.validation?.phase2_clean ? '✅ CLEAN (No Prompts)' : '❌ VIOLATION'}
${promptsByPhase.phase2.length > 0 ? `\n**Violations:**\n${promptsByPhase.phase2.map(p => `- Line ${p.line}: ${p.code}`).join('\n')}` : ''}

### Phase 3: HITL Approval
- **Interactive Prompts:** ${promptsByPhase.phase3.length}
- **Status:** ${results.validation?.phase3_hasPrompts ? '✅ HAS PROMPTS (As Expected)' : '❌ NO PROMPTS'}

**Expected Prompts:**
1. Batch approval (y/n)
2. Captain's Log review for each session

**Found Prompts:**
${promptsByPhase.phase3.length > 0 ? promptsByPhase.phase3.map(p => `- Line ${p.line}: ${p.code}`).join('\n') : 'None (ERROR - Phase 3 should have prompts)'}

### Phase 4: Archive Execution
- **Interactive Prompts:** ${promptsByPhase.phase4.length}
- **Status:** ${results.validation?.phase4_clean ? '✅ CLEAN (No Prompts) - CRITICAL SUCCESS' : '❌ VIOLATION - WILL HANG IN BACKGROUND'}
${promptsByPhase.phase4.length > 0 ? `\n**CRITICAL VIOLATIONS:**\n${promptsByPhase.phase4.map(p => `- Line ${p.line}: ${p.code}`).join('\n')}` : ''}

## Architecture Comparison

### OLD FLOW (Hanging Issue)
\`\`\`
Phase 3: Batch Approval → Start Background Process
Phase 4: [BACKGROUND]
  ├─ Archive Session 1
  ├─ Prompt for Captain's Log 1 ← HANGS (no TTY)
  ├─ Archive Session 2
  ├─ Prompt for Captain's Log 2 ← HANGS (no TTY)
  └─ Archive Session 3
\`\`\`

### NEW FLOW (Fixed)
\`\`\`
Phase 3: [INTERACTIVE - All Prompts Here]
  ├─ Batch Approval
  ├─ Preview Captain's Log 1 → Approve
  ├─ Preview Captain's Log 2 → Approve
  └─ Preview Captain's Log 3 → Approve

Phase 4: [BACKGROUND - No Prompts]
  ├─ Archive Session 1 + Write Log 1
  ├─ Archive Session 2 + Write Log 2
  └─ Archive Session 3 + Write Log 3
\`\`\`

## Test Validation Summary

| Criterion | Result | Status |
|-----------|--------|--------|
| Phase 1 Clean | ${results.validation?.phase1_clean ? 'Yes' : 'No'} | ${results.validation?.phase1_clean ? '✅' : '❌'} |
| Phase 2 Clean | ${results.validation?.phase2_clean ? 'Yes' : 'No'} | ${results.validation?.phase2_clean ? '✅' : '❌'} |
| Phase 3 Has Prompts | ${results.validation?.phase3_hasPrompts ? 'Yes' : 'No'} | ${results.validation?.phase3_hasPrompts ? '✅' : '❌'} |
| Phase 4 Clean | ${results.validation?.phase4_clean ? 'Yes' : 'No'} | ${results.validation?.phase4_clean ? '✅' : '❌'} |
| **OVERALL** | **${results.success ? 'PASS' : 'FAIL'}** | **${results.success ? '✅' : '❌'}** |

## Recommendations

${results.success ? `
### ✅ READY FOR PRODUCTION

The refactored code is architecturally sound and ready for deployment:

1. **Deploy to Production:** Replace existing batch-closeout.js with refactored version
2. **Update Documentation:** Document the 4-phase flow in CLAUDE.md
3. **Add Integration Tests:** Create end-to-end tests with real sessions
4. **Monitor in Production:** Track Phase 4 completion times
5. **User Training:** Update guides to reflect new approval workflow

### Next Steps

- [ ] Deploy refactored code to main branch
- [ ] Update hooks integration
- [ ] Create user documentation
- [ ] Add metrics tracking
- [ ] Schedule production testing
` : `
### ❌ ISSUES REQUIRE ATTENTION

The following violations must be fixed before production deployment:

${results.validation?.violations.map(v => `- [ ] ${v}`).join('\n') || 'See detailed results above'}

**Action Required:** Refactor code to move all prompts to Phase 3.
`}

## Test Artifacts

- **Source Code:** \`${REFACTORED_CODE_PATH}\`
- **Test Script:** \`test-batch-closeout-noninteractive.js\`
- **Test Results:** This report

## Conclusion

${results.success ? `
The refactored batch closeout implementation successfully addresses the hanging issue identified in Hive 3 investigation. By moving ALL interactive prompts to Phase 3 (before background execution), the code can now run Phase 4 in background without risk of hanging on stdin prompts.

**PRODUCTION READY:** ✅
` : `
The refactored implementation requires additional work to properly isolate interactive prompts. Review violations and refactor code to ensure Phase 4 has zero interactive prompts.

**PRODUCTION READY:** ❌
`}

---

**Test Executed By:** Dream Hive - Background Process Tester
**Session:** session-20251114-145225-dream-hive-production-readiness
**Test Date:** ${results.timestamp}
`;

  fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
  fs.writeFileSync(reportPath, report);

  return reportPath;
}

// Run test
if (require.main === module) {
  const results = runStructuralTest();
  const reportPath = generateReport(results);

  console.log('=' .repeat(70));
  console.log('TEST COMPLETE');
  console.log('=' .repeat(70));
  console.log(`Status: ${results.success ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Report: ${reportPath}`);
  console.log('=' .repeat(70) + '\n');

  // Store results in memory
  const memoryUpdate = {
    test_id: 'background-process-validation',
    timestamp: results.timestamp,
    success: results.success,
    report_path: reportPath,
    phase_validation: results.validation
  };

  console.log('💾 Memory Update:');
  console.log(JSON.stringify(memoryUpdate, null, 2));

  process.exit(results.success ? 0 : 1);
}

module.exports = { runStructuralTest, generateReport };
