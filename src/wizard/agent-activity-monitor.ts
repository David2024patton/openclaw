import type { WizardProject } from "../gateway/wizard-data-store.js";
import { getProjectFolderPaths, saveProjectFile } from "./project-folder-structure.js";

export type AgentActivity = {
  agentId: string;
  agentName: string;
  agentType: "main" | "sub-agent" | "testing" | "linting" | "visual-testing" | "research" | "coding";
  projectId?: string;
  taskId?: string;
  status: "idle" | "thinking" | "working" | "completed" | "error";
  model?: string; // LLM version being used
  thinking?: string; // Current thinking/reasoning
  actions?: string[]; // Recent actions
  terminal?: string[]; // Terminal output lines
  startedAt?: string;
  updatedAt: string;
};

// In-memory store for active agent activities
const activeAgents = new Map<string, AgentActivity>(); // key: agentId

export function registerAgentActivity(activity: AgentActivity): void {
  activeAgents.set(activity.agentId, activity);
}

export function updateAgentActivity(
  agentId: string,
  updates: Partial<Omit<AgentActivity, "agentId" | "updatedAt">>,
): void {
  const existing = activeAgents.get(agentId);
  if (existing) {
    activeAgents.set(agentId, {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } else {
    registerAgentActivity({
      agentId,
      agentName: updates.agentName || "Unknown",
      agentType: updates.agentType || "main",
      status: updates.status || "idle",
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  }
}

export function removeAgentActivity(agentId: string): void {
  activeAgents.delete(agentId);
}

export function getAgentActivities(projectId?: string): AgentActivity[] {
  const activities = Array.from(activeAgents.values());
  if (projectId) {
    return activities.filter((a) => a.projectId === projectId);
  }
  return activities;
}

export function getAgentActivity(agentId: string): AgentActivity | undefined {
  return activeAgents.get(agentId);
}

/**
 * Save agent activity log to project folder
 */
export async function saveAgentActivityLog(
  project: WizardProject,
  activity: AgentActivity,
): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `agent-${activity.agentId}-${timestamp}.md`;
  
  const logContent = `# Agent Activity: ${activity.agentName}

**Agent ID**: ${activity.agentId}
**Agent Type**: ${activity.agentType}
**Status**: ${activity.status}
**Model**: ${activity.model || "N/A"}
**Started**: ${activity.startedAt ? new Date(activity.startedAt).toLocaleString() : "N/A"}
**Updated**: ${new Date(activity.updatedAt).toLocaleString()}
${activity.taskId ? `**Task ID**: ${activity.taskId}` : ""}

## Thinking

${activity.thinking || "*No thinking recorded*"}

## Actions

${activity.actions && activity.actions.length > 0
  ? activity.actions.map((action) => `- ${action}`).join("\n")
  : "*No actions recorded*"}

## Terminal Output

\`\`\`
${activity.terminal && activity.terminal.length > 0
  ? activity.terminal.join("\n")
  : "*No terminal output*"}
\`\`\`

---
*Log saved at ${new Date().toLocaleString()}*
`;

  return await saveProjectFile(project, "agent", filename, logContent);
}

/**
 * Append terminal output to agent activity
 */
export function appendTerminalOutput(agentId: string, line: string): void {
  const activity = activeAgents.get(agentId);
  if (activity) {
    const terminal = activity.terminal || [];
    terminal.push(`[${new Date().toLocaleTimeString()}] ${line}`);
    // Keep last 1000 lines
    if (terminal.length > 1000) {
      terminal.shift();
    }
    updateAgentActivity(agentId, { terminal });
  }
}

/**
 * Append action to agent activity
 */
export function appendAction(agentId: string, action: string): void {
  const activity = activeAgents.get(agentId);
  if (activity) {
    const actions = activity.actions || [];
    actions.push(`[${new Date().toLocaleTimeString()}] ${action}`);
    // Keep last 100 actions
    if (actions.length > 100) {
      actions.shift();
    }
    updateAgentActivity(agentId, { actions });
  }
}

/**
 * Update agent thinking
 */
export function updateAgentThinking(agentId: string, thinking: string): void {
  updateAgentActivity(agentId, { thinking });
}
