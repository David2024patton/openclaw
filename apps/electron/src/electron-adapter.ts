import path from 'node:path';
import { app } from 'electron';

/**
 * Electron adapter for OpenClaw CLI
 * 
 * This module imports the repository's built distribution (dist/index.js) in-process
 * and provides a controlled interface to run CLI commands without terminating the Electron app.
 * 
 * IMPORTANT: The OpenClaw CLI dist/index.js currently exports utility functions but not
 * a programmatic CLI runner. This adapter provides a placeholder implementation that
 * demonstrates the integration pattern. In production, the CLI would need to export
 * a `runCli` function or similar programmatic API.
 */

interface LogCallback {
  (level: 'info' | 'warn' | 'error', message: string): void;
}

interface AdapterState {
  isRunning: boolean;
  exitAttempts: number;
  logger: LogCallback | null;
}

const state: AdapterState = {
  isRunning: false,
  exitAttempts: 0,
  logger: null
};

// Store original process.exit
const originalProcessExit = process.exit;

/**
 * Patch process.exit to prevent CLI from terminating Electron
 * This is called during adapter initialization
 */
function patchProcessExit(): void {
  process.exit = function(code?: number): never {
    state.exitAttempts++;
    const msg = `CLI attempted process.exit(${code ?? 0}) - prevented (attempt #${state.exitAttempts})`;
    console.warn('[electron-adapter]', msg);
    if (state.logger) {
      state.logger('warn', msg);
    }
    throw new Error(`Process exit prevented: exit code ${code ?? 0}`);
  } as typeof process.exit;
}

/**
 * Restore original process.exit
 */
function restoreProcessExit(): void {
  process.exit = originalProcessExit;
}

/**
 * Initialize the adapter with logging callback
 */
export function initAdapter(logger: LogCallback): void {
  state.logger = logger;
  patchProcessExit();
  logger('info', 'Electron adapter initialized');
  logger('info', `Electron version: ${process.versions.electron}`);
  logger('info', `Node version: ${process.versions.node}`);
  
  // Validate Node.js version compatibility
  const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);
  const requiredVersion = 22; // From package.json engines.node
  
  if (nodeVersion < requiredVersion) {
    logger('warn', `Node.js ${nodeVersion} may not be compatible with OpenClaw (requires ${requiredVersion}+)`);
  } else {
    logger('info', `Node.js version ${nodeVersion} meets requirements (${requiredVersion}+)`);
  }
}

/**
 * Import the OpenClaw CLI distribution
 * This is where we would dynamically import ../../dist/index.js
 */
async function importCliDist(): Promise<any> {
  try {
    // Path to the CLI dist in the packaged app
    const distPath = app.isPackaged
      ? path.join(process.resourcesPath, 'app', 'dist', 'index.js')
      : path.join(app.getAppPath(), '..', '..', 'dist', 'index.js');
    
    if (state.logger) {
      state.logger('info', `Importing CLI from: ${distPath}`);
    }
    
    // Dynamic import of the CLI distribution
    const cliModule = await import(distPath);
    
    if (state.logger) {
      state.logger('info', `CLI module imported successfully`);
      state.logger('info', `Available exports: ${Object.keys(cliModule).join(', ')}`);
    }
    
    return cliModule;
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (state.logger) {
      state.logger('error', `Failed to import CLI: ${errMsg}`);
    }
    throw error;
  }
}

/**
 * Start the agent (placeholder - would invoke CLI agent start)
 */
export async function startAgent(): Promise<{ success: boolean; message: string }> {
  try {
    if (state.isRunning) {
      return { success: false, message: 'Agent is already running' };
    }
    
    if (state.logger) {
      state.logger('info', 'Starting OpenClaw agent...');
    }
    
    // Import CLI module
    await importCliDist();
    
    // TODO: Once the CLI exports a programmatic API (e.g., runCli or startAgent),
    // invoke it here. For now, this is a placeholder.
    // Example: await cliModule.runCli(['agent', 'start', '--mode', 'rpc']);
    
    state.isRunning = true;
    
    if (state.logger) {
      state.logger('info', 'Agent started successfully (placeholder)');
    }
    
    return { 
      success: true, 
      message: 'Agent started (placeholder - CLI programmatic API integration pending)' 
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (state.logger) {
      state.logger('error', `Failed to start agent: ${errMsg}`);
    }
    return { success: false, message: `Error: ${errMsg}` };
  }
}

/**
 * Stop the agent (placeholder)
 */
export async function stopAgent(): Promise<{ success: boolean; message: string }> {
  try {
    if (!state.isRunning) {
      return { success: false, message: 'Agent is not running' };
    }
    
    if (state.logger) {
      state.logger('info', 'Stopping OpenClaw agent...');
    }
    
    // TODO: Invoke CLI stop command when programmatic API is available
    
    state.isRunning = false;
    
    if (state.logger) {
      state.logger('info', 'Agent stopped successfully (placeholder)');
    }
    
    return { success: true, message: 'Agent stopped (placeholder)' };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (state.logger) {
      state.logger('error', `Failed to stop agent: ${errMsg}`);
    }
    return { success: false, message: `Error: ${errMsg}` };
  }
}

/**
 * Run a CLI command (placeholder)
 */
export async function runCommand(args: string[]): Promise<{ success: boolean; output: string }> {
  try {
    if (state.logger) {
      state.logger('info', `Running command: openclaw ${args.join(' ')}`);
    }
    
    // Import CLI module
    await importCliDist();
    
    // TODO: Invoke CLI programmatically with args
    // Example: const result = await cliModule.runCli(args);
    
    const output = `Command executed: openclaw ${args.join(' ')}\n(Placeholder - programmatic CLI API integration pending)`;
    
    if (state.logger) {
      state.logger('info', output);
    }
    
    return { success: true, output };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (state.logger) {
      state.logger('error', `Command failed: ${errMsg}`);
    }
    return { success: false, output: `Error: ${errMsg}` };
  }
}

/**
 * Get current status
 */
export function getStatus(): { 
  isRunning: boolean; 
  exitAttempts: number;
  electronVersion: string;
  nodeVersion: string;
} {
  return {
    isRunning: state.isRunning,
    exitAttempts: state.exitAttempts,
    electronVersion: process.versions.electron || 'unknown',
    nodeVersion: process.versions.node || 'unknown'
  };
}

/**
 * Cleanup adapter on app quit
 */
export function cleanup(): void {
  restoreProcessExit();
  if (state.logger) {
    state.logger('info', 'Electron adapter cleanup complete');
  }
}
