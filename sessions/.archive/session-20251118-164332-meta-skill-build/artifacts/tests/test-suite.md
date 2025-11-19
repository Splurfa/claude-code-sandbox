# Meta-Skill Build Testing Suite

## Test Execution Plan

This document outlines comprehensive test cases for validating the meta-skill coordinator, fixed prompt-improver, and their integration with the existing skills system.

## Test Environment

- **Sandbox Location**: `sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude/`
- **Test Date**: 2025-11-18
- **Tester**: QA Specialist Agent
- **Files Under Test**: 246 .claude configuration files

---

## Phase 1: Structural Validation Tests

### Test 1.1: File Copy Integrity
**Objective**: Verify all files copied correctly to sandbox

**Procedure**:
```bash
# Count files in production
find .claude -type f | wc -l

# Count files in sandbox
find sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude -type f | wc -l

# Compare checksums
find .claude -type f -exec md5 {} \; > /tmp/prod_checksums.txt
find sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude -type f -exec md5 {} \; > /tmp/sandbox_checksums.txt
diff /tmp/prod_checksums.txt /tmp/sandbox_checksums.txt
```

**Expected Result**: All files match, no differences in checksums

**Pass Criteria**:
- File count matches (246 files)
- All checksums identical
- No missing or extra files

---

### Test 1.2: Directory Structure Validation
**Objective**: Ensure directory hierarchy is preserved

**Procedure**:
```bash
# Compare directory trees
tree .claude > /tmp/prod_tree.txt
tree sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude > /tmp/sandbox_tree.txt
diff /tmp/prod_tree.txt /tmp/sandbox_tree.txt
```

**Expected Result**: Identical directory structures

**Pass Criteria**:
- All subdirectories present
- Hierarchy matches exactly
- No structural differences

---

### Test 1.3: File Permissions Check
**Objective**: Verify file permissions are maintained

**Procedure**:
```bash
# Check permissions
ls -laR .claude > /tmp/prod_perms.txt
ls -laR sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude > /tmp/sandbox_perms.txt
# Manual review of critical files
```

**Expected Result**: Appropriate read/write permissions

**Pass Criteria**:
- All files readable
- Config files writable
- No permission errors

---

## Phase 2: Meta-Skill Coordinator Tests

### Test 2.1: Skill Discovery
**Objective**: Test meta-skill coordinator can discover all skills

**Procedure**:
```bash
# Use sandbox environment
export CLAUDE_CONFIG_DIR=/Users/splurfa/common-thread-sandbox/sessions/session-20251118-164332-meta-skill-build/artifacts/sandbox/.claude

# Test skill enumeration (simulated - would need actual CLI)
npx claude-flow@alpha skills list
```

**Test Cases**:
- List all skills
- Count skills (expected: 28 skills based on CLAUDE.md)
- Verify skill categories
- Check skill metadata

**Expected Result**: All 28 skills discovered and categorized

**Pass Criteria**:
- All skills found
- Correct categorization
- Valid metadata for each skill
- No missing skills

---

### Test 2.2: Progressive Disclosure
**Objective**: Validate progressive disclosure pattern

**Test Cases**:

1. **Level 1 - Overview**
   - Request skill overview
   - Verify concise description shown
   - Check "learn more" options provided

2. **Level 2 - Details**
   - Request detailed information
   - Verify usage examples shown
   - Check parameter documentation

3. **Level 3 - Advanced**
   - Request advanced features
   - Verify edge cases documented
   - Check troubleshooting guide

**Expected Result**: Information revealed progressively without overwhelming

**Pass Criteria**:
- Clear hierarchy of information
- Easy navigation between levels
- No information overload at any level

---

### Test 2.3: Skill Loading and Execution
**Objective**: Test meta-skill can load and execute skills

**Test Cases**:

1. **Load Simple Skill**
   ```
   User: "Use the tutor-mode skill"
   Expected: Skill loads successfully
   ```

2. **Load Complex Skill**
   ```
   User: "Use the swarm-orchestration skill"
   Expected: Skill loads with all dependencies
   ```

3. **Invalid Skill Request**
   ```
   User: "Use the nonexistent-skill"
   Expected: Graceful error message
   ```

**Expected Result**: Skills load correctly, errors handled gracefully

**Pass Criteria**:
- Successful loading of valid skills
- Clear error messages for invalid skills
- No crashes or undefined behavior

---

### Test 2.4: Error Handling
**Objective**: Test meta-skill coordinator error handling

**Test Cases**:

1. **Missing Skill File**
   - Remove a skill file temporarily
   - Request that skill
   - Verify graceful degradation

2. **Corrupted Skill File**
   - Introduce syntax error in skill
   - Attempt to load
   - Verify error reporting

3. **Circular Dependencies**
   - Create circular skill references
   - Attempt to load
   - Verify detection and prevention

**Expected Result**: All errors caught and reported clearly

**Pass Criteria**:
- No crashes
- Clear error messages
- Helpful recovery suggestions

---

### Test 2.5: Memory Integration
**Objective**: Test meta-skill coordinator memory operations

**Test Cases**:

1. **Store Skill State**
   ```javascript
   mcp__claude-flow_alpha__memory_usage({
     action: "store",
     key: "meta-skill/active-skill",
     value: "tutor-mode",
     namespace: "skills"
   })
   ```

2. **Retrieve Skill State**
   ```javascript
   mcp__claude-flow_alpha__memory_usage({
     action: "retrieve",
     key: "meta-skill/active-skill",
     namespace: "skills"
   })
   ```

3. **List Skill History**
   ```javascript
   mcp__claude-flow_alpha__memory_usage({
     action: "list",
     namespace: "skills"
   })
   ```

**Expected Result**: Memory operations work correctly

**Pass Criteria**:
- State persists correctly
- Retrieval returns correct values
- History tracking works

---

## Phase 3: Prompt-Improver Tests

### Test 3.1: Version Detection
**Objective**: Test prompt-improver v1 vs v2 detection

**Test Cases**:

1. **V1 Prompt Detection**
   ```
   Input: Old format prompt without frontmatter
   Expected: Detected as v1, upgrade offered
   ```

2. **V2 Prompt Detection**
   ```
   Input: Prompt with YAML frontmatter
   Expected: Detected as v2, ready to use
   ```

3. **Invalid Format Detection**
   ```
   Input: Malformed prompt
   Expected: Error message with guidance
   ```

**Expected Result**: Accurate version detection

**Pass Criteria**:
- Correct v1/v2 identification
- Clear upgrade messaging
- Helpful error messages

---

### Test 3.2: Improvement Logic
**Objective**: Test prompt improvement quality

**Test Cases**:

1. **Basic Prompt Improvement**
   ```
   Input: "You are a helpful assistant"
   Expected: Enhanced with context, constraints, examples
   ```

2. **Complex Prompt Improvement**
   ```
   Input: Multi-section prompt with examples
   Expected: Structure improved, clarity enhanced
   ```

3. **Already-Optimal Prompt**
   ```
   Input: Well-structured v2 prompt
   Expected: Minimal changes, quality preserved
   ```

**Expected Result**: Meaningful improvements without breaking content

**Pass Criteria**:
- Improved clarity and structure
- Original intent preserved
- No introduced errors

---

### Test 3.3: API Integration
**Objective**: Test prompt-improver API interactions

**Test Cases**:

1. **API Request Construction**
   - Verify proper API payload format
   - Check authentication headers
   - Validate request parameters

2. **API Response Handling**
   - Test successful response parsing
   - Test error response handling
   - Test timeout handling

3. **Rate Limiting**
   - Test rate limit detection
   - Verify backoff strategy
   - Check retry logic

**Expected Result**: Robust API interaction

**Pass Criteria**:
- Correct API usage
- Graceful error handling
- Proper rate limit handling

---

### Test 3.4: Output Formatting
**Objective**: Test prompt-improver output quality

**Test Cases**:

1. **YAML Frontmatter Generation**
   ```yaml
   ---
   name: skill-name
   version: 2.0.0
   description: Clear description
   ---
   ```

2. **Progressive Disclosure Structure**
   - Overview section clear and concise
   - Detailed sections properly nested
   - Advanced topics appropriately placed

3. **Example Formatting**
   - Code blocks properly formatted
   - Examples relevant and clear
   - Best practices highlighted

**Expected Result**: Well-formatted, professional output

**Pass Criteria**:
- Valid YAML frontmatter
- Clean markdown structure
- Readable and maintainable

---

## Phase 4: Integration Tests

### Test 4.1: Meta-Skill + Prompt-Improver Coordination
**Objective**: Test combined functionality

**Test Scenario**:
```
1. User requests skill improvement via meta-skill
2. Meta-skill loads target skill
3. Meta-skill invokes prompt-improver
4. Prompt-improver enhances skill
5. Meta-skill saves improved version
6. User can use improved skill
```

**Expected Result**: Seamless coordination

**Pass Criteria**:
- Smooth handoff between components
- No data loss or corruption
- Improved skill works correctly

---

### Test 4.2: Skill Chaining
**Objective**: Test multi-skill workflows

**Test Scenario**:
```
1. Meta-skill loads skill A
2. Skill A requires skill B
3. Meta-skill auto-loads skill B
4. Both skills execute in sequence
5. Results aggregated correctly
```

**Expected Result**: Skills work together seamlessly

**Pass Criteria**:
- Dependencies resolved automatically
- Execution order correct
- Results properly aggregated

---

### Test 4.3: Existing Skills Compatibility
**Objective**: Ensure compatibility with all 28 existing skills

**Test Cases**:
- Test meta-skill with each skill category:
  - AgentDB skills (5 skills)
  - GitHub skills (5 skills)
  - Hive Mind skills (1 skill)
  - Development skills (6 skills)
  - Platform skills (3 skills)
  - System skills (8 skills)

**Expected Result**: All skills work with meta-skill coordinator

**Pass Criteria**:
- No breaking changes
- All skills load correctly
- Functionality preserved

---

### Test 4.4: End-to-End Workflow
**Objective**: Test complete user journey

**Test Scenario**:
```
1. User: "I need help with AgentDB vector search"
2. Meta-skill: Presents agentdb-vector-search skill
3. User: "Load this skill"
4. Meta-skill: Loads skill and context
5. User: "Improve this skill's documentation"
6. Prompt-improver: Enhances skill prompt
7. Meta-skill: Saves improvement
8. User: Uses improved skill successfully
```

**Expected Result**: Smooth user experience

**Pass Criteria**:
- Intuitive workflow
- Clear feedback at each step
- Successful task completion

---

## Phase 5: Performance Tests

### Test 5.1: Execution Time
**Objective**: Measure performance metrics

**Test Cases**:

1. **Skill Discovery Time**
   - Measure time to enumerate all skills
   - Target: < 1 second

2. **Skill Loading Time**
   - Measure time to load single skill
   - Target: < 500ms

3. **Improvement Time**
   - Measure time to improve prompt
   - Target: < 5 seconds (excluding API time)

**Expected Result**: Acceptable performance

**Pass Criteria**:
- Discovery: < 1s
- Loading: < 500ms
- Improvement: < 5s + API time

---

### Test 5.2: Resource Usage
**Objective**: Monitor system resource consumption

**Test Cases**:

1. **Memory Usage**
   - Monitor memory during skill loading
   - Check for memory leaks
   - Verify cleanup after execution

2. **CPU Usage**
   - Monitor CPU during operations
   - Check for excessive processing
   - Verify efficient algorithms

3. **Disk I/O**
   - Monitor file access patterns
   - Check for unnecessary reads/writes
   - Verify caching effectiveness

**Expected Result**: Efficient resource usage

**Pass Criteria**:
- Memory: < 100MB peak
- CPU: < 50% sustained
- I/O: Minimal unnecessary access

---

### Test 5.3: Concurrent Operations
**Objective**: Test multi-tasking capability

**Test Cases**:

1. **Multiple Skill Loads**
   - Load 5 skills simultaneously
   - Verify no conflicts
   - Check resource sharing

2. **Concurrent Improvements**
   - Improve 3 skills concurrently
   - Verify isolated processing
   - Check result integrity

**Expected Result**: Stable concurrent execution

**Pass Criteria**:
- No race conditions
- No resource conflicts
- Correct results for all operations

---

### Test 5.4: Memory Cleanup
**Objective**: Verify proper resource cleanup

**Test Cases**:

1. **After Skill Unload**
   - Load and unload skill
   - Check memory released
   - Verify no dangling references

2. **After Error Recovery**
   - Trigger error scenario
   - Verify cleanup occurs
   - Check no resource leaks

**Expected Result**: Clean resource management

**Pass Criteria**:
- Memory returned after unload
- No resource leaks
- Clean error recovery

---

## Edge Cases and Error Conditions

### Test 6.1: Boundary Conditions

1. **Empty Skill List**
   - Remove all skills temporarily
   - Test meta-skill behavior
   - Expected: Graceful handling

2. **Maximum Skills**
   - Test with 100+ skills
   - Verify performance
   - Check memory usage

3. **Large Prompts**
   - Test with 10,000+ line prompt
   - Verify processing
   - Check performance

---

### Test 6.2: Error Recovery

1. **Partial Failures**
   - Simulate partial skill load failure
   - Verify recovery
   - Check state consistency

2. **API Failures**
   - Simulate API timeout
   - Simulate API error responses
   - Verify error handling

3. **Disk Errors**
   - Simulate read/write failures
   - Verify error handling
   - Check data integrity

---

## Test Execution Checklist

- [ ] Phase 1: Structural Validation (Tests 1.1-1.3)
- [ ] Phase 2: Meta-Skill Coordinator (Tests 2.1-2.5)
- [ ] Phase 3: Prompt-Improver (Tests 3.1-3.4)
- [ ] Phase 4: Integration (Tests 4.1-4.4)
- [ ] Phase 5: Performance (Tests 5.1-5.4)
- [ ] Edge Cases (Tests 6.1-6.2)

## Success Criteria Summary

**Must Pass**:
- All structural validation tests
- All error handling tests
- All integration tests
- No data corruption
- No crashes or undefined behavior

**Should Pass**:
- All performance targets
- All edge case tests
- Concurrent operation tests

**Nice to Have**:
- Performance exceeds targets
- Edge cases handled elegantly
- User experience exceptional

---

**Next Steps**: Execute tests and document results in test-results.md
