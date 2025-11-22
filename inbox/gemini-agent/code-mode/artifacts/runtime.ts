import * as vm from 'vm';

/**
 * Runtime Harness for Code Mode
 * Executes untrusted agent scripts in a sandboxed VM context.
 */

interface ExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  logs: string[];
}

interface ToolExecutor {
  (toolName: string, params: any): Promise<any>;
}

export class CodeModeRuntime {
  private toolExecutor: ToolExecutor;

  constructor(toolExecutor: ToolExecutor) {
    this.toolExecutor = toolExecutor;
  }

  /**
   * Execute a Code Mode script
   * @param code The TypeScript/JavaScript code to execute
   * @param sessionContext Optional context variables (e.g., session ID)
   */
  async execute(code: string, sessionContext: Record<string, any> = {}): Promise<ExecutionResult> {
    const logs: string[] = [];

    // Create the sandbox context
    const context = {
      // Basics
      console: {
        log: (...args: any[]) => logs.push(args.map(a => String(a)).join(' ')),
        error: (...args: any[]) => logs.push('ERROR: ' + args.map(a => String(a)).join(' ')),
        warn: (...args: any[]) => logs.push('WARN: ' + args.map(a => String(a)).join(' ')),
      },
      
      // Session Context
      ...sessionContext,

      // The magic proxy: automatically intercepts function calls and routes to MCP
      // This allows the script to call `await mcp__tool_name({ ... })`
      // We use a Proxy to catch any global function call that isn't defined
    };

    // We can't easily proxy *globals* via the context object alone in 'vm' without
    // defining them. So we inject a 'tools' object or use a Proxy object as the global.
    // A better DX is to explicitly inject the tools we know about, or a generic 'call' helper.
    
    // Strategy: Inject a global `tools` object that proxies everything.
    // Usage in script: await tools.swarm_init(...)
    const toolsProxy = new Proxy({}, {
        get: (target, prop: string) => {
            return async (params: any) => {
                logs.push(`[Call] ${prop}`);
                try {
                    const result = await this.toolExecutor(prop, params);
                    return result;
                } catch (e: any) {
                    logs.push(`[Error] ${prop}: ${e.message}`);
                    throw e;
                }
            };
        }
    });

    // Also try to support top-level calls if they match the SDK format
    // We'll add a global `proxy` function and maybe regex replace the user code 
    // to map `func(...)` to `tools.func(...)`? 
    // Better: Just expose the proxy as `mcp` or `sdk`.
    // "Plan C" said: agent writes code using imports.
    // If we want "zero-install", we pass `sdk` in context.
    
    Object.assign(context, { sdk: toolsProxy, tools: toolsProxy });

    try {
      // Wrap in async IIFE to allow top-level await
      const wrappedCode = `
        (async () => {
          ${code}
        })()
      `;

      const script = new vm.Script(wrappedCode);
      await script.runInNewContext(context, { timeout: 30000 }); // 30s timeout

      return {
        success: true,
        logs
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        logs
      };
    }
  }
}

