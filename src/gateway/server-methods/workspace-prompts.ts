import type { GatewayRequestHandlers } from "./types.js";
import { errorShape } from "../protocol/index.js";
import { ErrorCodes } from "../protocol/index.js";
import { Type } from "@sinclair/typebox";
import {
  DEFAULT_AGENTS_FILENAME,
  DEFAULT_SOUL_FILENAME,
  DEFAULT_TOOLS_FILENAME,
  DEFAULT_IDENTITY_FILENAME,
  DEFAULT_USER_FILENAME,
  DEFAULT_HEARTBEAT_FILENAME,
  DEFAULT_BOOTSTRAP_FILENAME,
  DEFAULT_MEMORY_FILENAME,
  loadWorkspaceBootstrapFiles,
  resolveDefaultAgentWorkspaceDir,
} from "../../agents/workspace.js";
import fs from "node:fs/promises";
import path from "node:path";
import { resolveUserPath } from "../../utils.js";

export type WorkspacePromptFile = {
  name: string;
  filename: string;
  enabled: boolean;
  content: string;
  description: string;
  example: string;
};

const PROMPT_DEFINITIONS: Record<string, { description: string; example: string }> = {
  [DEFAULT_SOUL_FILENAME]: {
    description:
      "Core personality and values. Defines how the agent behaves, its tone, and its fundamental principles. This is the 'soul' of your agent.",
    example: `# SOUL.md - Who You Are

## Core Truths

**Be genuinely helpful, not performatively helpful.** Skip the "Great question!" and "I'd be happy to help!" — just help.

**Have opinions.** You're allowed to disagree, prefer things, find stuff amusing or boring.

**Be resourceful before asking.** Try to figure it out. Read the file. Check the context. _Then_ ask if you're stuck.`,
  },
  [DEFAULT_IDENTITY_FILENAME]: {
    description:
      "Agent's identity: name, creature type, vibe, emoji, and avatar. Filled in during first conversation to give the agent personality.",
    example: `# IDENTITY.md - Who Am I?

- **Name:** Claw
- **Creature:** AI assistant
- **Vibe:** Helpful, resourceful, has opinions
- **Emoji:** 🤖
- **Avatar:** avatars/claw.png`,
  },
  [DEFAULT_USER_FILENAME]: {
    description:
      "Information about you (the user): name, timezone, preferences, context. Helps the agent understand who it's helping.",
    example: `# USER.md - About Your Human

- **Name:** David
- **What to call them:** David
- **Pronouns:** he/him
- **Timezone:** America/New_York
- **Notes:** 
  - Works on AI projects
  - Prefers concise responses
  - Likes automation`,
  },
  [DEFAULT_TOOLS_FILENAME]: {
    description:
      "Environment-specific notes: camera names, SSH hosts, speaker names, device nicknames. Your local setup details.",
    example: `# TOOLS.md - Local Notes

### Cameras
- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH
- home-server → 192.168.1.100, user: admin

### TTS
- Preferred voice: "Nova" (warm, slightly British)`,
  },
  [DEFAULT_AGENTS_FILENAME]: {
    description:
      "Workspace behavior guide: memory system, safety rules, group chat behavior, when to speak. The agent's operational manual.",
    example: `# AGENTS.md - Your Workspace

## Every Session
Before doing anything else:
1. Read SOUL.md — this is who you are
2. Read USER.md — this is who you're helping
3. Read memory/YYYY-MM-DD.md for recent context

## Memory
- Daily notes: memory/YYYY-MM-DD.md
- Long-term: MEMORY.md`,
  },
  [DEFAULT_HEARTBEAT_FILENAME]: {
    description:
      "Periodic check-in tasks. When the agent receives a heartbeat poll, it checks this file for proactive tasks to perform.",
    example: `# HEARTBEAT.md

# Keep this file empty to skip heartbeat API calls.
# Add tasks below when you want the agent to check something periodically.

- Check email for urgent messages
- Review calendar for upcoming events
- Check weather if user might go out`,
  },
  [DEFAULT_BOOTSTRAP_FILENAME]: {
    description:
      "First-run ritual. Guides the agent through its initial conversation to figure out who it is and who you are. Delete after first use.",
    example: `# BOOTSTRAP.md - Hello, World

Start with something like:
> "Hey. I just came online. Who am I? Who are you?"

Then figure out together:
1. Your name
2. Your nature
3. Your vibe
4. Your emoji`,
  },
  [DEFAULT_MEMORY_FILENAME]: {
    description:
      "Long-term memory. Curated memories, significant events, lessons learned. Only loaded in main sessions for security.",
    example: `# MEMORY.md - Long-Term Memory

## Significant Events
- 2024-01-15: Set up OpenClaw project management system
- 2024-01-20: User prefers concise responses

## Lessons Learned
- Always ask before sending external messages
- Use memory files to persist context across sessions`,
  },
};

export const workspacePromptsHandlers: GatewayRequestHandlers = {
  "workspace.prompts.list": async ({ params, respond }) => {
    try {
      const workspaceDir = resolveDefaultAgentWorkspaceDir();
      const resolvedDir = resolveUserPath(workspaceDir);
      
      const files = await loadWorkspaceBootstrapFiles(resolvedDir);
      
      const prompts: WorkspacePromptFile[] = files
        .filter((file) => file.name !== "memory.md") // Exclude lowercase variant
        .map((file) => {
          const def = PROMPT_DEFINITIONS[file.name] || {
            description: `Workspace file: ${file.name}`,
            example: `# ${file.name}\n\nEdit this file to customize your agent's behavior.`,
          };
          
          return {
            name: file.name.replace(".md", "").toUpperCase(),
            filename: file.name,
            enabled: !file.missing,
            content: file.content || "",
            description: def.description,
            example: def.example,
          };
        });
      
      respond(true, { prompts }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, `Failed to list prompts: ${String(err)}`));
    }
  },
  
  "workspace.prompts.get": async ({ params, respond }) => {
    const validated = Type.Object({
      filename: Type.String(),
    }).safeParse(params);
    
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, `invalid params: ${validated.error.message}`),
      );
      return;
    }
    
    try {
      const workspaceDir = resolveDefaultAgentWorkspaceDir();
      const resolvedDir = resolveUserPath(workspaceDir);
      const filePath = path.join(resolvedDir, validated.data.filename);
      
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const def = PROMPT_DEFINITIONS[validated.data.filename] || {
          description: `Workspace file: ${validated.data.filename}`,
          example: "",
        };
        
        respond(true, {
          filename: validated.data.filename,
          content,
          enabled: true,
          description: def.description,
          example: def.example,
        }, undefined);
      } catch (err: any) {
        if (err.code === "ENOENT") {
          // File doesn't exist - return empty with template
          const def = PROMPT_DEFINITIONS[validated.data.filename] || {
            description: `Workspace file: ${validated.data.filename}`,
            example: "",
          };
          
          // Try to load template using ensureAgentWorkspace
          let templateContent = "";
          try {
            const { ensureAgentWorkspace } = await import("../../agents/workspace.js");
            await ensureAgentWorkspace({ ensureBootstrapFiles: true });
            // Try reading the file again after ensuring it exists
            try {
              templateContent = await fs.readFile(filePath, "utf-8");
            } catch {
              templateContent = def.example;
            }
          } catch {
            // Template not available, use example
            templateContent = def.example;
          }
          
          respond(true, {
            filename: validated.data.filename,
            content: templateContent,
            enabled: false,
            description: def.description,
            example: def.example,
          }, undefined);
        } else {
          throw err;
        }
      }
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, `Failed to get prompt: ${String(err)}`));
    }
  },
  
  "workspace.prompts.save": async ({ params, respond }) => {
    const validated = Type.Object({
      filename: Type.String(),
      content: Type.String(),
      enabled: Type.Boolean(),
    }).safeParse(params);
    
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, `invalid params: ${validated.error.message}`),
      );
      return;
    }
    
    try {
      const workspaceDir = resolveDefaultAgentWorkspaceDir();
      const resolvedDir = resolveUserPath(workspaceDir);
      await fs.mkdir(resolvedDir, { recursive: true });
      
      const filePath = path.join(resolvedDir, validated.data.filename);
      
      if (validated.data.enabled) {
        // Save the file
        await fs.writeFile(filePath, validated.data.content, "utf-8");
      } else {
        // Delete the file if disabled
        try {
          await fs.unlink(filePath);
        } catch (err: any) {
          if (err.code !== "ENOENT") {
            throw err;
          }
          // File already doesn't exist, that's fine
        }
      }
      
      respond(true, { success: true }, undefined);
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, `Failed to save prompt: ${String(err)}`));
    }
  },
  
  "workspace.prompts.createFromTemplate": async ({ params, respond }) => {
    const validated = Type.Object({
      filename: Type.String(),
    }).safeParse(params);
    
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(ErrorCodes.INVALID_REQUEST, `invalid params: ${validated.error.message}`),
      );
      return;
    }
    
    try {
      const { ensureAgentWorkspace } = await import("../../agents/workspace.js");
      await ensureAgentWorkspace({ ensureBootstrapFiles: true });
      
      // Now read the file we just created
      const workspaceDir = resolveDefaultAgentWorkspaceDir();
      const resolvedDir = resolveUserPath(workspaceDir);
      const filePath = path.join(resolvedDir, validated.data.filename);
      
      try {
        const content = await fs.readFile(filePath, "utf-8");
        respond(true, { filename: validated.data.filename, content, enabled: true }, undefined);
      } catch {
        respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, "Template file not found"));
      }
    } catch (err) {
      respond(false, undefined, errorShape(ErrorCodes.INTERNAL_ERROR, `Failed to create from template: ${String(err)}`));
    }
  },
};
