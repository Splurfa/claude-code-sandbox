import * as fs from 'fs';
import * as path from 'path';
import { CodeModeRuntime } from './runtime';

/**
 * MCP Tool Wrapper for Code Mode
 * 
 * This class defines the `execute_plan` tool and manages the runtime execution.
 * It requires a `toolCaller` function to be injected, which allows the runtime
 * to invoke other MCP tools available in the system.
 */

export class CodeModeManager {
  private runtime: CodeModeRuntime;
  private workspaceRoot: string;

  constructor(
    workspaceRoot: string,
    toolCaller: (name: string, args: any) => Promise<any>
  ) {
    this.workspaceRoot = workspaceRoot;
    this.runtime = new CodeModeRuntime(toolCaller);
  }

  public getToolDefinition() {
    return {
      name: 'execute_plan',
      description: 'Execute a Code Mode plan (TypeScript/JavaScript) from a file. The plan can orchestrate multiple tool calls efficiently.',
      inputSchema: {
        type: 'object',
        properties: {
          planPath: {
            type: 'string',
            description: 'Path to the plan file (must be within sessions/ artifacts)',
          },
          dryRun: {
            type: 'boolean',
            description: 'If true, checks syntax but does not execute side effects (not fully implemented)',
          },
        },
        required: ['planPath'],
      },
    };
  }

  public async handleToolCall(params: any) {
    const { planPath } = params;
    
    // 1. Security Check: Path Traversal & Scope
    const resolvedPath = path.resolve(this.workspaceRoot, planPath);
    if (!resolvedPath.startsWith(this.workspaceRoot)) {
        throw new Error('Access denied: Path is outside workspace root');
    }
    
    // Enforce sessions artifacts policy
    if (!resolvedPath.includes('/sessions/') || !resolvedPath.includes('/artifacts/')) {
        throw new Error('Access denied: Plans must be executed from session artifacts directories.');
    }

    if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Plan file not found: ${planPath}`);
    }

    // 2. Read Code
    const code = fs.readFileSync(resolvedPath, 'utf-8');

    // 3. Execute
    const result = await this.runtime.execute(code, {
        PLAN_PATH: planPath,
        SESSION_ID: this.extractSessionId(planPath)
    });

    // 4. Format Output
    return {
        content: [
            {
                type: 'text',
                text: `Plan Execution ${result.success ? 'Succeeded' : 'Failed'}.\n\nLOGS:\n${result.logs.join('\n')}\n\n${result.error ? 'ERROR:\n' + result.error : ''}`
            }
        ],
        isError: !result.success
    };
  }

  private extractSessionId(pathStr: string): string {
    const match = pathStr.match(/sessions\/([^\/]+)\//);
    return match ? match[1] : 'unknown';
  }
}

