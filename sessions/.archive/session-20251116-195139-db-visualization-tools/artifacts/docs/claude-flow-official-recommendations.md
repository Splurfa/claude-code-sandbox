# Claude-Flow Official Database Visualization Recommendations

**Research Date**: 2025-11-16
**Repository**: https://github.com/ruvnet/claude-flow
**Focus**: FREE and LOCAL database visualization tools for `.swarm/memory.db`

---

## Executive Summary

**Key Finding**: The official ruvnet/claude-flow repository **does NOT provide specific recommendations** for GUI-based database visualization tools.

The project emphasizes **CLI-based inspection** through built-in commands rather than external database viewers. No official GUI tools, VS Code extensions, or third-party database browsers are recommended in the documentation, README, wiki, or issue discussions.

---

## Official CLI Commands for Database Inspection

The claude-flow project provides built-in CLI commands for inspecting memory storage:

### Memory Status & Statistics
```bash
# Check overall memory status
npx claude-flow@alpha memory status --reasoningbank

# Get memory statistics
npx claude-flow@alpha memory stats

# Get AgentDB info (newer vector search system)
npx claude-flow@alpha memory agentdb-info
```

### Listing and Querying Memory
```bash
# List all memories in a namespace
npx claude-flow@alpha memory list --namespace backend --reasoningbank

# List all memories
npx claude-flow@alpha memory list

# Query/search for specific patterns
npx claude-flow@alpha memory query "search-term" --reasoningbank

# Vector-based semantic search (AgentDB v1.3.9+)
npx claude-flow@alpha memory vector-search "query" --k 10 --threshold 0.7 --namespace [name]
```

### Advanced Operations
```bash
# Export namespace data
npx claude-flow@alpha memory export --namespace config --output /exports/config.json

# Backup database
npx claude-flow@alpha memory backup --output /backups/memory-backup.db

# Check hive-mind status
npx claude-flow@alpha hive-mind status
```

---

## Database Storage Location

**Primary Storage**: `.swarm/memory.db` (SQLite database)

### Database Schema (12 Tables)

1. **memory_store** - Core memory storage
2. **sessions** - Session tracking
3. **agents** - Agent registry
4. **tasks** - Task management
5. **agent_memory** - Agent-specific memories
6. **shared_state** - Shared coordination state
7. **events** - Event log
8. **patterns** - Learned patterns
9. **performance_metrics** - Performance data
10. **workflow_state** - Workflow tracking
11. **swarm_topology** - Topology configuration
12. **consensus_state** - Consensus data

### Additional Storage Files
- `.swarm/backups/session-*.json` - Session backups
- `~/.claude/claude-flow-analytics.db` - Analytics database (optional)
- Various hive-mind checkpoint files

---

## Development Tools from package.json

The project uses these development tools (not visualization tools):

### Database Layer
- **better-sqlite3** (v12.2.0) - SQLite database driver
- **@types/better-sqlite3** - TypeScript definitions

### Testing & Debugging
- **Jest** (v29.7.0) - Testing framework with `test:debug` script
- **Puppeteer** (v24.11.2) - Automated testing
- **Coverage** - `test:coverage` script available

### Monitoring
- `health-check` - Built-in health monitoring
- `diagnostics` - Diagnostic manager for system inspection

---

## VS Code Configuration

The repository includes VS Code configuration files:
- `.vscode/settings.json`
- `.vscode/extensions.json`
- `.vscode/launch.json`
- `.vscode/tasks.json`

**However**, no specific VS Code extensions for SQLite viewing are mentioned or recommended in these configurations.

---

## Community Findings (Indirect)

While not officially recommended, the community and general SQLite ecosystem suggest these tools work with claude-flow's `.swarm/memory.db`:

### Free Local GUI Tools

1. **DB Browser for SQLite (DB4S)**
   - Status: Most popular, open-source
   - Platforms: Windows, macOS, Linux
   - URL: https://sqlitebrowser.org/
   - Mentioned in: General SQLite discussions (not claude-flow specific)

2. **SQLiteStudio**
   - Status: Free, portable
   - Platforms: Cross-platform
   - Features: Advanced querying, schema designer

3. **DBeaver Community Edition**
   - Status: Free, open-source
   - Platforms: Windows, macOS, Linux
   - Features: Multi-database support including SQLite

4. **Beekeeper Studio**
   - Status: Free, open-source
   - Platforms: Cross-platform
   - Features: Modern UI, query saving, CSV/JSON export

### VS Code Extensions (Community)

1. **SQLite Viewer** (by alexcvzz)
   - Features: Read-only database browser
   - Inline viewing of .db files

2. **SQLite** (by alexcvzz)
   - Features: Full database management
   - Query execution, schema viewing

### Command-Line Tools

1. **sqlite3 CLI**
   - Pre-installed on macOS/Linux
   - Direct SQL query execution

   ```bash
   sqlite3 .swarm/memory.db
   # Then run SQL: SELECT * FROM memory_store LIMIT 10;
   ```

2. **litecli**
   - Modern CLI with auto-completion
   - Syntax highlighting
   - Install: `pip install litecli`

### Web-Based Tools (Local)

1. **SQLite Viewer Web**
   - URL: https://sqliteviewer.app/
   - Features: Client-side only, no data upload
   - Works offline after initial load

2. **Sqlime**
   - Browser-based SQLite explorer
   - Runs entirely in browser

---

## Known Issues with SQLite Integration

### Platform-Specific Problems

**macOS ARM64 (Apple Silicon)** - Issue #360:
- better-sqlite3 native bindings fail when using `npx`
- Fallback to in-memory storage occurs
- Workaround: Global installation or rebuild

**Windows** - Issue #361:
- EPERM errors during npm installation
- better-sqlite3 compilation failures
- Requires administrator privileges

**Node.js v24** - Issue #824:
- Native module compilation errors
- Deprecated V8 API usage
- Stay on Node.js v20 or v22

**WSL2** - Issue #422:
- SQLite module fails to load despite correct installation
- Dynamic import mechanism issues
- Session persistence affected

### Version Conflicts - Issue #839:
- Multiple better-sqlite3 versions (11.10.0 and 12.4.1)
- Module resolution conflicts
- ReasoningBank initialization failures

---

## Documentation Gaps

The following are **NOT documented** in official claude-flow resources:

1. ❌ GUI database viewers or browsers
2. ❌ VS Code extension recommendations for SQLite
3. ❌ Third-party database inspection tools
4. ❌ Visual query builders
5. ❌ Database schema visualization tools
6. ❌ .swarm/ directory exploration utilities
7. ❌ Database migration or export tools (beyond CLI)
8. ❌ Performance monitoring dashboards (beyond CLI)

---

## Programmatic Database Access

The documentation does include SQL query examples for programmatic access:

### Example Queries from Wiki

```sql
-- Get completed tasks from last 24 hours
SELECT * FROM tasks
WHERE status = 'completed'
  AND completed_at > datetime('now', '-1 day')
ORDER BY completed_at DESC;

-- Calculate average response time
SELECT AVG(value) as avg_time
FROM performance_metrics
WHERE metric_name = 'response_time';

-- Get recent agent activity
SELECT a.name, COUNT(t.id) as task_count
FROM agents a
LEFT JOIN tasks t ON a.id = t.agent_id
WHERE t.created_at > datetime('now', '-7 day')
GROUP BY a.id;
```

### JavaScript API Examples

```javascript
// Store memory
await memory.store('key', { data: 'value' }, 'namespace');

// Retrieve memory
const data = await memory.retrieve('key', 'namespace');

// Query patterns
const results = await memory.query('search-term', { namespace: 'backend' });

// Backup database
await memory.backup('/backups/memory-backup.db');

// Export namespace
await memory.exportNamespace('config', '/exports/config.json');
```

---

## Performance Monitoring (CLI-Only)

### Terminal UI Monitor (blessed.js)

```bash
# Launch terminal-based monitoring dashboard
claude-flow monitor tui --refresh-interval 3000
```

**Features** (5 panels):
1. Live metrics (sessions, operations/min, response time)
2. Rate limiting status
3. Recent activity log
4. Neural insights panel
5. Header with key metrics

### Analytics Commands

```bash
# Usage analytics
claude-flow analytics usage --user --timeframe 24h

# Export telemetry
claude-flow telemetry export --format otlp --endpoint [url]

# Neural pattern analysis
claude-flow neural patterns --analyze --user
```

---

## Recommended Workflow (Based on Official Docs)

### For Quick Inspection:
```bash
# 1. Check what's stored
npx claude-flow@alpha memory stats
npx claude-flow@alpha memory list

# 2. Query specific data
npx claude-flow@alpha memory query "search-term"

# 3. Check hive-mind status
npx claude-flow@alpha hive-mind status
```

### For Detailed Analysis:
```bash
# 1. Export to JSON for external analysis
npx claude-flow@alpha memory export --namespace [name] --output ./data.json

# 2. Backup database for external tools
npx claude-flow@alpha memory backup --output ./memory-backup.db

# 3. Open backup with external SQLite browser (unofficial)
# Use: DB Browser for SQLite, DBeaver, etc.
```

### For Development/Debugging:
```bash
# 1. Run diagnostics
npm run diagnostics

# 2. Check health
npm run health-check

# 3. Run tests with debugging
npm run test:debug

# 4. Monitor live
claude-flow monitor tui
```

---

## Conclusion

### Official Position:
The claude-flow project **intentionally emphasizes CLI-based inspection** over GUI tools. This aligns with:
- Developer-first philosophy
- Automation-friendly workflows
- CI/CD integration
- Scriptable operations

### Practical Reality:
For visual database inspection, developers must:
1. Use unofficial third-party SQLite browsers
2. Export data to JSON for custom visualization
3. Write custom SQL queries via sqlite3 CLI
4. Build custom monitoring dashboards

### Best Practice Recommendation:

**For quick checks**: Use built-in CLI commands
**For deep inspection**: Export data or use DB Browser for SQLite (unofficial)
**For automation**: Use programmatic APIs and CLI commands
**For monitoring**: Use built-in TUI monitor

---

## References

### Official Documentation
- Main Repository: https://github.com/ruvnet/claude-flow
- Memory System Wiki: https://github.com/ruvnet/claude-flow/wiki/Memory-System
- Installation Guide: https://github.com/ruvnet/claude-flow/wiki/Installation-Guide
- MCP Tools: https://github.com/ruvnet/claude-flow/wiki/MCP-Tools

### Relevant Issues
- #589 - Memory System namespace flag issues
- #422 - SQLite module loading failures (WSL2)
- #839 - BetterSqlite3 constructor errors
- #824 - Node.js v24 compatibility
- #360 - macOS ARM64 binding issues
- #361 - Windows installation failures
- #265 - Rate limiting & usage monitoring
- #695 - Fragmented hive mind files

### Discussions
- #475 - Self-improving system architecture
- #140 - CLI-based collaboration kanban

---

## Appendix: Community-Recommended Tools (Unofficial)

These tools are **NOT** endorsed by claude-flow but are commonly used with SQLite databases:

| Tool | Type | Free | Local | Platforms |
|------|------|------|-------|-----------|
| DB Browser for SQLite | Desktop | ✅ | ✅ | Win/Mac/Linux |
| DBeaver Community | Desktop | ✅ | ✅ | Win/Mac/Linux |
| Beekeeper Studio | Desktop | ✅ | ✅ | Win/Mac/Linux |
| SQLiteStudio | Desktop | ✅ | ✅ | Win/Mac/Linux |
| SQLite Viewer (VS Code) | Extension | ✅ | ✅ | VS Code |
| sqlite3 CLI | Command-line | ✅ | ✅ | Unix/Linux/Mac |
| litecli | Command-line | ✅ | ✅ | Python-based |
| SQLite Viewer Web | Web Browser | ✅ | ✅ | Any browser |

---

**Research Conducted By**: Research Agent (Researcher)
**Session**: session-20251116-195139-db-visualization-tools
**Methodology**: Web search, documentation analysis, issue tracking review
**Sources**: 15+ GitHub pages, 20+ search results, 8 web fetches
