# Monitoring System Quick Start

Get up and running with hive mind observability in 5 minutes.

## Prerequisites

```bash
# Install dependencies
npm install ws express sqlite3

# Ensure hive mind database exists
ls -lh .hive-mind/hive.db
```

## Option 1: Interactive Dashboard (Recommended)

**Best for**: Real-time monitoring and visual insights

```bash
# Start the dashboard
node code/monitoring/dashboard-server.js

# Open in browser
open http://localhost:8080
```

**What you get:**
- 📊 Live coherence scoring with color-coded status
- ⚡ Real-time performance metrics
- 🤖 Agent health monitoring
- 🚨 Active alert notifications
- 🔄 Auto-updates every second via WebSocket

**Dashboard URL**: http://localhost:8080

---

## Option 2: Terminal Monitoring

**Best for**: Quick status checks and scripting

```bash
# Check current coherence status
node code/monitoring/coherence-display.js status

# Generate detailed report
node code/monitoring/coherence-display.js report | jq

# Forecast future values
node code/monitoring/coherence-display.js forecast

# Export to JSON
node code/monitoring/coherence-display.js export metrics.json
```

**Output example:**
```
╔════════════════════════════════════════════════════════════╗
║           COHERENCE SCORING DASHBOARD                      ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Current Score: 96.42%  [OPTIMAL]
║  ████████████████████████████████████████░░░░░░░
║                                                            ║
║  Statistics (24h):                                         ║
║    Average:    94.23%
║    Min:        89.12%
║    Max:        98.76%
║    Trend:      IMPROVING
║    Volatility: 3.45%
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## Option 3: Alert Monitoring

**Best for**: Proactive issue detection and notifications

```bash
# Start alert system
node code/monitoring/alert-system.js
```

**Alert triggers:**
- 🚨 **Critical**: Coherence < 85%
- ⚠️ **Warning**: Coherence < 95%
- 🚨 **Critical**: Consensus rate < 70%
- ⚠️ **Warning**: >30% agents inactive
- ⚠️ **Warning**: Response time > 5 seconds
- ⚠️ **Warning**: Task success < 80%

**Sample output:**
```
🚨 [CRITICAL] Critical coherence drop detected: 82.15%
   Time: 11/17/2025, 12:34:56 AM
   Rule: Critical Coherence Drop (coherence-critical)
```

---

## Option 4: REST API

**Best for**: External integrations (Grafana, Prometheus, custom dashboards)

```bash
# Start API server
node code/monitoring/metrics-api.js 3000
```

**Key endpoints:**
```bash
# Coherence metrics
curl http://localhost:3000/metrics/coherence | jq

# Performance metrics
curl http://localhost:3000/metrics/performance | jq

# Agent health
curl http://localhost:3000/metrics/agents | jq

# All metrics
curl http://localhost:3000/metrics/all | jq

# Export everything
curl http://localhost:3000/export?format=summary > metrics.json

# Time series data
curl "http://localhost:3000/timeseries/coherence_score?interval=5m" | jq
```

**API documentation**: http://localhost:3000

---

## Option 5: Complete Stack

**Best for**: Production deployment

```bash
# Terminal 1: Dashboard
node code/monitoring/dashboard-server.js 8080

# Terminal 2: Metrics API
node code/monitoring/metrics-api.js 3000

# Terminal 3: Alert System
node code/monitoring/alert-system.js
```

**Access points:**
- Dashboard: http://localhost:8080
- API: http://localhost:3000
- Alerts: Console output

---

## Integration Examples

### Grafana Integration

1. Add JSON data source:
   - URL: `http://localhost:3000`
   - Type: JSON API

2. Create panels querying:
   - `/metrics/coherence` - Coherence gauge
   - `/metrics/agents` - Agent count graph
   - `/timeseries/coherence_score` - Time series chart

### Slack Alerts

```javascript
const AlertSystem = require('./code/monitoring/alert-system');

const alerts = new AlertSystem();
await alerts.init();

alerts.on('alert', async (alert) => {
  if (alert.severity === 'critical') {
    await fetch('YOUR_SLACK_WEBHOOK', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 ${alert.message}`,
        attachments: [{
          color: 'danger',
          fields: [
            { title: 'Severity', value: alert.severity, short: true },
            { title: 'Time', value: alert.timestamp, short: true }
          ]
        }]
      })
    });
  }
});

alerts.start();
```

### Custom Dashboard with WebSocket

```html
<!DOCTYPE html>
<html>
<body>
  <div id="coherence"></div>
  <div id="agents"></div>

  <script>
    const ws = new WebSocket('ws://localhost:8080');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      document.getElementById('coherence').textContent =
        `Coherence: ${(data.coherence.current * 100).toFixed(2)}%`;

      document.getElementById('agents').textContent =
        `Active Agents: ${data.agents.active}/${data.agents.total}`;
    };
  </script>
</body>
</html>
```

### Prometheus Export

```javascript
const api = new MetricsAPI({ port: 3000 });
await api.start();

// Add Prometheus endpoint
api.app.get('/metrics/prometheus', async (req, res) => {
  const metrics = await api.getAllMetrics();

  res.setHeader('Content-Type', 'text/plain');
  res.send(`
# HELP hive_coherence Current coherence score
# TYPE hive_coherence gauge
hive_coherence ${metrics.coherence.current}

# HELP hive_agents_active Active agents count
# TYPE hive_agents_active gauge
hive_agents_active ${metrics.agents.active}

# HELP hive_consensus_rate Consensus success rate
# TYPE hive_consensus_rate gauge
hive_consensus_rate ${metrics.consensus.success_rate}
  `.trim());
});
```

---

## Running Tests

```bash
# Run comprehensive test suite
node tests/monitoring.test.js

# Expected output:
# ✅ 21 tests passed
# ❌ 0 tests failed
```

---

## Troubleshooting

### Database not found
```bash
# Check database location
ls -lh .hive-mind/hive.db

# Dashboard/API will show this error:
# "Failed to connect to database: SQLITE_CANTOPEN"

# Solution: Ensure hive mind has been initialized
# The database is created automatically when hive mind runs
```

### Port already in use
```bash
# Error: EADDRINUSE: address already in use :::8080

# Solution: Use a different port
node dashboard-server.js 8081
node metrics-api.js 3001
```

### No data showing
```bash
# Check if database has metrics
sqlite3 .hive-mind/hive.db "SELECT COUNT(*) FROM performance_metrics"

# If empty: Run hive mind operations to generate data
# The monitoring system displays live data from active hive mind operations
```

---

## Production Deployment

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start all services
pm2 start code/monitoring/dashboard-server.js --name hive-dashboard
pm2 start code/monitoring/metrics-api.js --name hive-api
pm2 start code/monitoring/alert-system.js --name hive-alerts

# Save configuration
pm2 save

# Setup startup script
pm2 startup
```

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .
RUN npm install ws express sqlite3

# Dashboard
EXPOSE 8080
# API
EXPOSE 3000

CMD ["node", "code/monitoring/dashboard-server.js"]
```

### Environment Variables

```bash
# Custom configuration
export HIVE_DB_PATH=/custom/path/.hive-mind/hive.db
export DASHBOARD_PORT=8080
export API_PORT=3000
export ALERT_INTERVAL=5000
export UPDATE_INTERVAL=1000
```

---

## Next Steps

1. **Explore the dashboard**: Open http://localhost:8080
2. **Check API endpoints**: Open http://localhost:3000
3. **Review examples**: `node code/monitoring/examples.js`
4. **Read full docs**: See `README.md`
5. **Run tests**: `node tests/monitoring.test.js`

---

## Quick Reference

| Component | Command | Port | Purpose |
|-----------|---------|------|---------|
| Dashboard | `node dashboard-server.js` | 8080 | Visual monitoring |
| API | `node metrics-api.js` | 3000 | REST endpoints |
| Alerts | `node alert-system.js` | - | Proactive monitoring |
| CLI | `node coherence-display.js` | - | Terminal reports |

**Dashboard**: http://localhost:8080
**API Docs**: http://localhost:3000
**Health Check**: http://localhost:3000/health

---

## Support

- **Full Documentation**: `README.md`
- **Verification Report**: `../docs/monitoring-verification.md`
- **Usage Examples**: `examples.js`
- **Test Suite**: `../tests/monitoring.test.js`

**Status**: ✅ Production Ready - All 21 tests passing
