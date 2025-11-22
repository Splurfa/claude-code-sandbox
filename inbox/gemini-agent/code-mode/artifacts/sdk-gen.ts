import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * SDK Generator for Code Mode
 * 
 * Usage: ts-node sdk-gen.ts <mcp-server-command> <output-path>
 * Example: ts-node sdk-gen.ts "npx claude-flow" ./claude-flow.d.ts
 */

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params?: any;
}

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: number | string;
  result?: any;
  error?: any;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: ts-node sdk-gen.ts <mcp-server-command> <output-path>');
    process.exit(1);
  }

  const [serverCmd, ...serverArgs] = args[0].split(' ');
  const outputPath = args[1];

  console.log(`Starting MCP server: ${serverCmd} ${serverArgs.join(' ')}`);

  const server = spawn(serverCmd, serverArgs, {
    stdio: ['pipe', 'pipe', 'inherit'],
    shell: true
  });

  let messageBuffer = '';
  let requestId = 1;

  const send = (method: string, params: any = {}) => {
    return new Promise<any>((resolve, reject) => {
      const id = requestId++;
      const req: JsonRpcRequest = { jsonrpc: '2.0', id, method, params };
      
      const cleanup = () => {
        server.stdout.removeListener('data', onData);
      };

      const onData = (chunk: Buffer) => {
        messageBuffer += chunk.toString();
        const lines = messageBuffer.split('\n');
        messageBuffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const response: JsonRpcResponse = JSON.parse(line);
            if (response.id === id) {
              cleanup();
              if (response.error) reject(response.error);
              else resolve(response.result);
            }
          } catch (e) {
            // Ignore parse errors for non-JSON lines (logs)
          }
        }
      };

      server.stdout.on('data', onData);
      const msg = JSON.stringify(req) + '\n';
      server.stdin.write(msg);
    });
  };

  try {
    // 1. Initialize
    console.log('Initializing...');
    await send('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'sdk-gen', version: '1.0.0' }
    });

    await send('notifications/initialized');

    // 2. List Tools
    console.log('Fetching tools...');
    const toolsResult = await send('tools/list');
    const tools = toolsResult.tools || [];

    console.log(`Found ${tools.length} tools. Generating SDK...`);
    const dtsContent = generateDts(tools);

    fs.writeFileSync(outputPath, dtsContent);
    console.log(`SDK written to ${outputPath}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    server.kill();
  }
}

function generateDts(tools: any[]): string {
  const namespaces: Record<string, string[]> = {};

  // Helper to map JSON schema types to TS types
  const mapType = (schema: any): string => {
    if (!schema) return 'any';
    if (schema.type === 'string') {
      if (schema.enum) return schema.enum.map((e: string) => `"${e}"`).join(' | ');
      return 'string';
    }
    if (schema.type === 'number' || schema.type === 'integer') return 'number';
    if (schema.type === 'boolean') return 'boolean';
    if (schema.type === 'array') return `${mapType(schema.items)}[]`;
    if (schema.type === 'object') {
      if (!schema.properties) return 'Record<string, any>';
      const props = Object.entries(schema.properties).map(([k, v]: [string, any]) => {
        const optional = !(schema.required?.includes(k)) ? '?' : '';
        return `${k}${optional}: ${mapType(v)}`;
      });
      return `{ ${props.join('; ')} }`;
    }
    return 'any';
  };

  // Process tools into namespaces based on naming convention (e.g., mcp__ns__func or ns_func)
  // Fallback: put everything in 'global' or use raw names
  
  const functions: string[] = [];

  for (const tool of tools) {
    const funcName = tool.name;
    const safeName = funcName.replace(/[^a-zA-Z0-9_]/g, '_');
    const description = tool.description ? `/** ${tool.description} */\n` : '';
    
    const inputSchema = tool.inputSchema || {};
    const paramsType = mapType(inputSchema);
    
    // We assume the output is a generic MCP ToolResult, but nicely typed promises are better
    // For now, we return Promise<any> because MCP results are dynamic
    functions.push(`${description}export function ${safeName}(params: ${paramsType}): Promise<any>;`);
  }

  return `
/**
 * Code Mode SDK for Claude-Flow
 * Generated automatically. Do not edit.
 */

// Common types
export interface ToolResult {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

// Tools
${functions.join('\n\n')}
`;
}

main().catch(console.error);

