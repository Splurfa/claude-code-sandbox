#!/bin/bash
# MCP Server Connection Test Script
# Tests all three MCP servers: claude-flow, ruv-swarm, flow-nexus

echo "🧪 Testing MCP Server Connections..."
echo "=================================="
echo ""

# Test 1: Claude Flow Alpha
echo "📡 Test 1: claude-flow@alpha"
echo "----------------------------"
npx claude-flow@alpha hooks pre-task --description "Test connection" --task-id "test-1" 2>&1
if [ $? -eq 0 ]; then
    echo "✅ claude-flow@alpha: Connected"
else
    echo "❌ claude-flow@alpha: Failed"
fi
echo ""

# Test 2: Flow Nexus System Health
echo "📡 Test 2: flow-nexus system health"
echo "----------------------------"
# Note: This would need MCP call - shown for reference
echo "ℹ️  Use: mcp__flow-nexus__system_health"
echo "   Expected: {success: true, health: {...}}"
echo ""

# Test 3: RUV Swarm Initialization
echo "📡 Test 3: ruv-swarm initialization"
echo "----------------------------"
# Note: This would need MCP call - shown for reference
echo "ℹ️  Use: mcp__ruv-swarm__swarm_init with topology"
echo "   Expected: Swarm initialized successfully"
echo ""

# Test 4: Memory Storage
echo "📡 Test 4: Memory operations"
echo "----------------------------"
echo "ℹ️  Use: mcp__claude-flow_alpha__memory_usage"
echo "   Actions: store, retrieve, list, search"
echo ""

echo "=================================="
echo "✅ Connection test script complete"
