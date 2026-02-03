import { callGateway } from "../gateway/call.js";
import { getWizardProjects, getWizardProjectById } from "../gateway/wizard-data-store.js";

export type TelegramProjectCommand = {
  command: "/project" | "/proj";
  args: string[];
  userId: string;
  chatId: string;
};

export async function handleTelegramProjectCommand(
  command: TelegramProjectCommand,
): Promise<string> {
  const { args, userId, chatId } = command;
  
  if (args.length === 0 || args[0] === "help") {
    return `📋 Project Commands:
/project list - List all projects
/project select <name> - Select active project
/project create <name> - Create new project
/project current - Show current active project
/project info <name> - Show project details`;
  }
  
  const subcommand = args[0].toLowerCase();
  
  if (subcommand === "list") {
    const projects = await getWizardProjects();
    if (projects.length === 0) {
      return "📋 No projects found. Create one with /project create <name>";
    }
    const list = projects
      .map((p, idx) => `${idx + 1}. ${p.name} (${p.status})`)
      .join("\n");
    return `📋 Projects:\n${list}`;
  }
  
  if (subcommand === "select" || subcommand === "set") {
    if (args.length < 2) {
      return "❌ Usage: /project select <project-name>";
    }
    const projectName = args.slice(1).join(" ");
    const projects = await getWizardProjects();
    const project = projects.find(
      (p) => p.name.toLowerCase() === projectName.toLowerCase()
    );
    
    if (!project) {
      return `❌ Project "${projectName}" not found. Use /project list to see available projects.`;
    }
    
    // Store active project in session context
    await setSessionActiveProject(userId, chatId, project.id);
    
    return `✅ Active project set to: ${project.name}\n📝 You can now reference this project in your requests.`;
  }
  
  if (subcommand === "create") {
    if (args.length < 2) {
      return "❌ Usage: /project create <project-name> [description]";
    }
    const projectName = args.slice(1).join(" ");
    
    try {
      const result = await callGateway<{ project: { id: string; name: string } }>({
        method: "wizard.projects.create",
        params: {
          name: projectName,
          description: `Project created via Telegram by user ${userId}`,
        },
      });
      
      if (result?.project) {
        // Set as active project
        await setSessionActiveProject(userId, chatId, result.project.id);
        return `✅ Project "${result.project.name}" created and set as active!`;
      }
      return "❌ Failed to create project.";
    } catch (err) {
      return `❌ Error creating project: ${err}`;
    }
  }
  
  if (subcommand === "current" || subcommand === "active") {
    const activeProjectId = await getSessionActiveProject(userId, chatId);
    if (!activeProjectId) {
      return "📋 No active project. Use /project select <name> to set one.";
    }
    
    const project = await getWizardProjectById(activeProjectId);
    if (!project) {
      // Clear invalid project
      await setSessionActiveProject(userId, chatId, null);
      return "❌ Active project not found. Cleared.";
    }
    
    return `📋 Active Project: ${project.name}\n${project.description || ""}\nStatus: ${project.status}`;
  }
  
  if (subcommand === "info") {
    if (args.length < 2) {
      return "❌ Usage: /project info <project-name>";
    }
    const projectName = args.slice(1).join(" ");
    const projects = await getWizardProjects();
    const project = projects.find(
      (p) => p.name.toLowerCase() === projectName.toLowerCase()
    );
    
    if (!project) {
      return `❌ Project "${projectName}" not found.`;
    }
    
    let info = `📋 Project: ${project.name}\n`;
    info += `Status: ${project.status}\n`;
    if (project.description) info += `Description: ${project.description}\n`;
    if (project.githubRepo) info += `GitHub: ${project.githubRepo}\n`;
    if (project.devServerUrl) info += `Dev Server: ${project.devServerUrl}\n`;
    if (project.prompt) info += `\nPrompt: ${project.prompt.substring(0, 200)}${project.prompt.length > 200 ? "..." : ""}\n`;
    
    return info;
  }
  
  return `❌ Unknown command. Use /project help for available commands.`;
}

// Session project context storage
const sessionProjects = new Map<string, string | null>(); // key: "userId:chatId" -> projectId

function getSessionKey(userId: string, chatId: string): string {
  return `${userId}:${chatId}`;
}

async function getSessionActiveProject(userId: string, chatId: string): Promise<string | null> {
  const key = getSessionKey(userId, chatId);
  return sessionProjects.get(key) || null;
}

async function setSessionActiveProject(
  userId: string,
  chatId: string,
  projectId: string | null,
): Promise<void> {
  const key = getSessionKey(userId, chatId);
  if (projectId) {
    sessionProjects.set(key, projectId);
  } else {
    sessionProjects.delete(key);
  }
  
  // Also update session store for persistence
  try {
    const { loadSessionStore, updateSessionStore, resolveStorePath } = await import("../config/sessions.js");
    const { resolveSessionAgentId } = await import("../agents/agent-scope.js");
    const { loadConfig } = await import("../config/config.js");
    const cfg = loadConfig();
    const sessionKey = `telegram:${chatId}`;
    const agentId = resolveSessionAgentId({ sessionKey, config: cfg });
    const storePath = resolveStorePath(cfg.session?.store, { agentId });
    const sessionStore = loadSessionStore(storePath);
    const entry = sessionStore[sessionKey];
    if (entry) {
      entry.wizardActiveProjectId = projectId || undefined;
      entry.updatedAt = Date.now();
      sessionStore[sessionKey] = entry;
      await updateSessionStore(storePath, (store) => {
        store[sessionKey] = entry;
      });
    }
  } catch (err) {
    // Session store might not be available, that's OK
    console.log("[Telegram Project Commands] Could not persist to session store:", err);
  }
}

export async function getActiveProjectForSession(userId: string, chatId: string): Promise<string | null> {
  return await getSessionActiveProject(userId, chatId);
}
