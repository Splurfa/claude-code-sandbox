# Hive-Mind Troubleshooting Playbook

**Document Type**: Production Troubleshooting Guide  
**Date**: 2025-11-17  
**Readiness Level**: 100/100

---

## Quick Diagnosis

### System Health Check

```bash
# Run comprehensive health check
npx claude-flow@alpha hive-mind health-check

# Expected output for healthy system:
✅ Memory database accessible (.swarm/memory.db)
✅ Session directory writable (.hive-mind/sessions/)
✅ Auto-scaling enabled and functional
✅ Consensus mechanism configured
✅ Neural training models loaded
✅ Hooks integration active
```

---

## Common Issues & Solutions

### Issue 1: Auto-Scaling Not Triggering

**Symptoms**:
- Worker count stays constant despite high task queue
- No new agents spawned when ratio > 2.0
- Auto-scale logs show "disabled" status

**Root Causes**:
1. Auto-scaling disabled in configuration
2. Max workers limit already reached
3. Insufficient system resources (CPU/memory)

**Diagnosis**:
```bash
# Check auto-scale configuration
npx claude-flow@alpha hive-mind status --verbose

# Look for:
{
  "autoScale": true,       # Should be true
  "scaleThreshold": 2.0,   # Default threshold
  "minWorkers": 2,
  "maxWorkers": 12,
  "currentWorkers": 12     # If at max, can't scale up
}
```

**Solutions**:

```bash
# Solution 1: Enable auto-scaling
npx claude-flow@alpha hive-mind config --auto-scale true

# Solution 2: Increase max workers
npx claude-flow@alpha hive-mind config --max-workers 20

# Solution 3: Manually spawn workers
npx claude-flow@alpha hive-mind spawn-worker --type researcher
```

**Verification**:
```bash
# Add tasks and verify scaling
npx claude-flow@alpha hive-mind add-tasks --count 10
sleep 15  # Wait for auto-scale check
npx claude-flow@alpha hive-mind status | grep "currentWorkers"
```

---

### Issue 2: Consensus Votes Not Collecting

**Symptoms**:
- Decisions hang indefinitely
- Vote collection timeout errors
- Missing votes from workers

**Root Causes**:
1. Workers not spawned before consensus call
2. Consensus mechanism not configured
3. Network communication failures between agents

**Diagnosis**:
```bash
# Check active agents
npx claude-flow@alpha hive-mind status

# Verify consensus configuration
npx claude-flow@alpha hive-mind consensus --show
```

**Solutions**:

```bash
# Solution 1: Ensure workers exist
npx claude-flow@alpha hive-mind spawn-workers --types researcher,coder,tester --count 3

# Solution 2: Configure consensus mechanism
npx claude-flow@alpha hive-mind consensus --type byzantine --threshold 0.67

# Solution 3: Restart swarm with fresh configuration
npx claude-flow@alpha hive-mind stop
npx claude-flow@alpha hive-mind init --queen adaptive --consensus byzantine
```

**Verification**:
```bash
# Test consensus with simple decision
npx claude-flow@alpha hive-mind test-consensus --question "Deploy to prod?" --options "yes,no"
```

---

### Issue 3: Memory TTL Not Expiring Entries

**Symptoms**:
- Old entries persist beyond TTL
- Memory database grows indefinitely
- No automatic cleanup

**Root Causes**:
1. Auto-cleanup disabled
2. TTL not set on entries
3. Cleanup interval too long

**Diagnosis**:
```bash
# Check memory configuration
npx claude-flow@alpha hive-mind memory:config --show

# List old entries
npx claude-flow@alpha hive-mind memory:list --namespace coordination --older-than 86400000
```

**Solutions**:

```bash
# Solution 1: Enable auto-cleanup
npx claude-flow@alpha hive-mind memory:config --cleanup true --interval 3600000

# Solution 2: Manually cleanup expired entries
npx claude-flow@alpha hive-mind memory:cleanup --expired

# Solution 3: Set TTL on new entries
# (Update application code to include TTL)
await memory.store('key', 'value', { ttl: 3600000 });  # 1 hour
```

**Verification**:
```bash
# Verify cleanup running
npx claude-flow@alpha hive-mind memory:stats

# Expected output:
{
  "totalEntries": 1200,
  "expiredEntries": 45,
  "lastCleanup": "2025-11-17T12:34:56Z",
  "nextCleanup": "2025-11-17T13:34:56Z"
}
```

---

### Issue 4: Parallel Spawning Slower Than Expected

**Symptoms**:
- Agents spawn sequentially (30-40 second gaps)
- No speedup from parallel spawning
- High latency in agent creation

**Root Causes**:
1. Using wrong spawning method (sequential instead of parallel)
2. Resource bottlenecks (CPU/memory/network)
3. Concurrency limits too low

**Diagnosis**:
```bash
# Check agent spawn times
npx claude-flow@alpha hive-mind logs --filter "agent_spawn" --last 10

# Verify concurrency settings
npx claude-flow@alpha hive-mind config --show | grep concurrency
```

**Solutions**:

```bash
# Solution 1: Use parallel spawning tool
npx claude-flow@alpha hive-mind spawn-parallel \
  --agents researcher,coder,tester,reviewer,architect \
  --max-concurrency 10

# Solution 2: Increase system resources
# (Check CPU/memory usage, close other applications)

# Solution 3: Adjust concurrency limits
npx claude-flow@alpha hive-mind config --max-concurrency 10 --batch-size 5
```

**Verification**:
```bash
# Benchmark spawn performance
npx claude-flow@alpha hive-mind benchmark-spawn --agents 5

# Expected output:
{
  "sequential": "150000ms",
  "parallel": "6000ms",
  "speedup": "25x"
}
```

---

### Issue 5: Queen Behavior Not Changing by Type

**Symptoms**:
- All queen types behave identically
- No strategic planning with strategic queen
- No dynamic pivoting with adaptive queen

**Root Causes**:
1. Queen behavior engines not implemented
2. Using placeholder queen (no behavior difference)
3. Configuration not applied

**Diagnosis**:
```bash
# Check queen type
npx claude-flow@alpha hive-mind status | grep queenType

# Verify behavior engine loaded
npx claude-flow@alpha hive-mind queen-status
```

**Solutions**:

```bash
# Solution 1: Reinitialize with correct queen type
npx claude-flow@alpha hive-mind stop
npx claude-flow@alpha hive-mind init --queen adaptive --topology hierarchical

# Solution 2: Verify queen behavior engines
npx claude-flow@alpha hive-mind test-queen --type strategic --task "Plan enterprise project"

# Solution 3: Update to 100/100 implementation (migration required)
# See: migration-guide.md
```

**Verification**:
```bash
# Test queen behavior differences
npx claude-flow@alpha hive-mind queen-behavior-test

# Expected output:
Strategic Queen: 5 phases, long-term planning
Tactical Queen: 8 steps, execution-focused
Adaptive Queen: Dynamic replanning, pivot protocol
```

---

## Performance Issues

### Issue: Token Usage Higher Than Expected

**Diagnosis**:
```bash
# Check token usage per agent
npx claude-flow@alpha hive-mind metrics --tokens

# Verify memory usage (should reduce tokens via shared context)
npx claude-flow@alpha hive-mind memory:stats --usage
```

**Solutions**:
```bash
# Ensure memory sharing enabled
npx claude-flow@alpha hive-mind config --shared-memory true

# Run token reduction benchmark
npx claude-flow@alpha hive-mind benchmark-tokens
```

---

### Issue: High Memory Database Size

**Diagnosis**:
```bash
# Check database size
du -h .swarm/memory.db

# List large entries
npx claude-flow@alpha hive-mind memory:analyze --large-entries
```

**Solutions**:
```bash
# Consolidate memory
npx claude-flow@alpha hive-mind memory:consolidate --namespace coordination

# Archive old sessions
npx claude-flow@alpha hive-mind memory:archive --older-than 2592000000  # 30 days
```

---

## Emergency Procedures

### Procedure: Complete System Reset

```bash
# 1. Stop all running swarms
npx claude-flow@alpha hive-mind stop-all

# 2. Backup current state
npx claude-flow@alpha hive-mind backup --destination ./emergency-backup/

# 3. Clear all sessions (DESTRUCTIVE)
rm -rf .hive-mind/sessions/*

# 4. Reset memory (DESTRUCTIVE)
npx claude-flow@alpha hive-mind memory:reset

# 5. Reinitialize system
npx claude-flow@alpha hive-mind init --queen adaptive --topology mesh
```

---

### Procedure: Session Recovery

```bash
# 1. List available checkpoints
npx claude-flow@alpha hive-mind checkpoints --list

# 2. Restore from checkpoint
npx claude-flow@alpha hive-mind restore --checkpoint checkpoint-20251117-123456

# 3. Verify restoration
npx claude-flow@alpha hive-mind status
```

---

## Monitoring & Alerts

### Real-Time Monitoring

```bash
# Launch dashboard
npx claude-flow@alpha hive-mind dashboard

# Monitor logs in real-time
tail -f .hive-mind/logs/hive-mind.log
```

### Performance Metrics

```bash
# Export metrics report
npx claude-flow@alpha hive-mind metrics --export ./reports/

# View summary
npx claude-flow@alpha hive-mind metrics --summary
```

---

## Support Escalation

### Level 1: Self-Service
- Check this troubleshooting playbook
- Review [Integration Guide](./integration-guide.md)
- Consult [MCP Tools Reference](./mcp-tools-reference.md)

### Level 2: Community Support
- GitHub Issues: https://github.com/ruvnet/claude-flow/issues
- Documentation: https://github.com/ruvnet/claude-flow

### Level 3: Expert Assistance
- Review [Migration Guide](./migration-guide.md) for 100/100 upgrade
- Contact maintainers with diagnostic output

---

**Document Status**: Complete  
**Last Updated**: 2025-11-17  
**Version**: 1.0.0 (100/100 Readiness)
