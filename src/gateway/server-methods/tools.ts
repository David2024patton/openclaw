import type { GatewayRequestHandlers } from "./types.js";
import { ErrorCodes, errorShape } from "../protocol/index.js";
import fs from "node:fs/promises";
import path from "node:path";
import { CONFIG_DIR } from "../../utils.js";

type ToolStatusEntry = {
  toolKey: string;
  name: string;
  description: string;
  category: string;
  source: "bundled" | "managed";
  filePath: string;
  baseDir: string;
  primaryEnv?: string;
  emoji?: string;
  homepage?: string;
  always: boolean;
  disabled: boolean;
  blockedByAllowlist: boolean;
  eligible: boolean;
  enabled: boolean;
  requirements: {
    bins: string[];
    env: string[];
    config: string[];
    os: string[];
  };
  missing: {
    bins: string[];
    env: string[];
    config: string[];
    os: string[];
  };
  configChecks: Array<{ key: string; satisfied: boolean; message: string }>;
  install: Array<{ id: string; name: string; command: string }>;
};

type ToolStatusReport = {
  tools: ToolStatusEntry[];
};

/**
 * Infer category from tool name
 */
function inferCategory(toolKey: string): string {
  const lower = toolKey.toLowerCase();
  
  if (lower.includes("web") || lower.includes("search")) return "web";
  if (lower.includes("browser")) return "web";
  if (lower.includes("image") || lower.includes("video") || lower.includes("media")) return "media";
  if (lower.includes("file") || lower.includes("fs")) return "files";
  if (lower.includes("api") || lower.includes("http")) return "apis";
  if (lower.includes("db") || lower.includes("database") || lower.includes("sql")) return "database";
  if (lower.includes("ai") || lower.includes("ml") || lower.includes("model")) return "ai";
  if (lower.includes("discord") || lower.includes("slack") || lower.includes("telegram")) return "communication";
  if (lower.includes("security") || lower.includes("auth") || lower.includes("crypto")) return "security";
  if (lower.includes("deploy") || lower.includes("docker") || lower.includes("k8s")) return "devops";
  if (lower.includes("code") || lower.includes("lint") || lower.includes("format")) return "development";
  
  return "other";
}

/**
 * Load tools from a specific directory
 */
async function loadToolsFromDir(toolsDir: string, source: "bundled" | "managed"): Promise<ToolStatusEntry[]> {
  try {
    const entries = await fs.readdir(toolsDir, { withFileTypes: true });
    const tools: ToolStatusEntry[] = [];

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const toolKey = entry.name;
      const toolMdPath = path.join(toolsDir, toolKey, "TOOL.md");

      try {
        const content = await fs.readFile(toolMdPath, "utf-8");
        
        // Parse tool name from first heading
        const nameMatch = content.match(/^#\s+(.+)$/m);
        const name = nameMatch ? nameMatch[1].trim() : toolKey;

        // Parse description from first paragraph after name
        const descMatch = content.match(/##\s+Description\s*\n([^\n]+)/);
        const description = descMatch ? descMatch[1].trim() : "No description";

        // Infer category from tool key
        const category = inferCategory(toolKey);

        tools.push({
          toolKey,
          name,
          description,
          category,
          source,
          filePath: toolMdPath,
          baseDir: path.join(toolsDir, toolKey),
          always: false,
          disabled: false,
          blockedByAllowlist: false,
          eligible: true,
          enabled: true,
          requirements: { bins: [], env: [], config: [], os: [] },
          missing: { bins: [], env: [], config: [], os: [] },
          configChecks: [],
          install: [],
        });
      } catch (err) {
        // Skip tools that can't be read
        console.warn(`Failed to load tool ${toolKey}:`, err);
      }
    }

    return tools;
  } catch (err) {
    // Directory doesn't exist or can't be read
    return [];
  }
}

/**
 * Load all tools from bundled and managed tools directories
 */
async function loadTools(): Promise<ToolStatusEntry[]> {
  const bundledToolsDir = path.join(process.cwd(), "tools");
  const managedToolsDir = path.join(CONFIG_DIR, "tools");
  
  try {
    // Ensure managed tools directory exists
    await fs.mkdir(managedToolsDir, { recursive: true });
    
    // Load from both directories (bundled tools have lower precedence)
    const bundledTools = await loadToolsFromDir(bundledToolsDir, "bundled");
    const managedTools = await loadToolsFromDir(managedToolsDir, "managed");
    
    // Merge tools (managed overrides bundled)
    const merged = new Map<string, ToolStatusEntry>();
    
    for (const tool of bundledTools) {
      merged.set(tool.toolKey, tool);
    }
    
    for (const tool of managedTools) {
      merged.set(tool.toolKey, tool);
    }
    
    return Array.from(merged.values());
  } catch (err) {
    console.error("Failed to load tools:", err);
    return [];
  }
}

export const toolsHandlers: GatewayRequestHandlers = {
    /**
     * List all available tools
     */
    "tools.list": async ({ respond }) => {
      try {
        const tools = await loadTools();
        const report: ToolStatusReport = { tools };
        respond(true, report, undefined);
      } catch (err) {
        respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, String(err)));
      }
    },

    /**
     * Get specific tool content for editing
     */
    "tools.get": async ({ params, respond }) => {
      const p = params as any;
      
      if (!p || !p.toolKey || typeof p.toolKey !== "string") {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "toolKey is required"));
        return;
      }

      try {
        const bundledToolsDir = path.join(process.cwd(), "tools");
        const managedToolsDir = path.join(CONFIG_DIR, "tools");
        
        // Check managed first, then bundled
        let toolPath = path.join(managedToolsDir, p.toolKey, "TOOL.md");
        let source: "bundled" | "managed" = "managed";
        
        try {
          await fs.access(toolPath);
        } catch {
          // Try bundled
          toolPath = path.join(bundledToolsDir, p.toolKey, "TOOL.md");
          source = "bundled";
        }
        
        const content = await fs.readFile(toolPath, "utf-8");
        
        respond(true, { toolKey: p.toolKey, content, source }, undefined);
      } catch (err) {
        respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, String(err)));
      }
    },

    /**
     * Create a new tool
     */
    "tools.create": async ({ params, respond }) => {
      const p = params as any;
      
      if (!p || !p.toolKey || typeof p.toolKey !== "string") {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "toolKey is required"));
        return;
      }
      
      if (!p.content || typeof p.content !== "string") {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "content is required"));
        return;
      }

      try {
        const managedToolsDir = path.join(CONFIG_DIR, "tools");
        const toolDir = path.join(managedToolsDir, p.toolKey);
        const toolPath = path.join(toolDir, "TOOL.md");
        
        await fs.mkdir(toolDir, { recursive: true });
        await fs.writeFile(toolPath, p.content, "utf-8");
        
        respond(true, { toolKey: p.toolKey }, undefined);
      } catch (err) {
        respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, String(err)));
      }
    },

    /**
     * Update existing tool content
     */
    "tools.update": async ({ params, respond }) => {
      const p = params as any;
      
      if (!p || !p.toolKey || typeof p.toolKey !== "string") {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "toolKey is required"));
        return;
      }
      
      if (!p.content || typeof p.content !== "string") {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "content is required"));
        return;
      }

      try {
        const managedToolsDir = path.join(CONFIG_DIR, "tools");
        const toolPath = path.join(managedToolsDir, p.toolKey, "TOOL.md");
        
        await fs.writeFile(toolPath, p.content, "utf-8");
        
        respond(true, { toolKey: p.toolKey }, undefined);
      } catch (err) {
        respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, String(err)));
      }
    },

    /**
     * Delete a tool
     */
    "tools.delete": async ({ params, respond }) => {
      const p = params as any;
      
      if (!p || !p.toolKey || typeof p.toolKey !== "string") {
        respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "toolKey is required"));
        return;
      }

      try {
        const managedToolsDir = path.join(CONFIG_DIR, "tools");
        const toolDir = path.join(managedToolsDir, p.toolKey);
        
        await fs.rm(toolDir, { recursive: true, force: true });
        
        respond(true, { toolKey: p.toolKey }, undefined);
      } catch (err) {
        respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, String(err)));
      }
    },
};
