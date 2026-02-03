import fs from "node:fs/promises";
import path from "node:path";
import { resolveStateDir } from "../config/paths.js";

const WIZARD_DATA_FILE = "wizard-data.json";

export type WizardTaskEditLog = {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  agentType: string; // e.g., "coding-llm", "database-llm", "testing-agent", "human"
  action: string; // e.g., "created", "updated", "status_changed", "label_added"
  field?: string; // Which field was changed
  oldValue?: string;
  newValue?: string;
  description?: string;
};

export type WizardTaskValidation = {
  section: string; // e.g., "title", "description", "labels", "dueDate", "checklist"
  isValid: boolean;
  checkedAt: string;
  checkedBy?: string; // Agent ID who validated
  message?: string;
};

export type WizardTask = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "testing" | "done" | "archived";
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  labels?: string[];
  checklist?: Array<{ id: string; text: string; completed: boolean }>;
  attachments?: Array<{ id: string; name: string; url: string; type: string }>;
  projectId?: string;
  lintStatus?: "pending" | "running" | "passed" | "failed" | "fixed" | "manual" | "skipped";
  lintErrors?: Array<{ file: string; line?: number; message: string }>;
  lintFixedAt?: string;
  agentId?: string;
  editLog?: WizardTaskEditLog[];
  validations?: WizardTaskValidation[];
  filePath?: string; // Path to the .md file
  createdBy?: { agentId: string; agentName: string; agentType: string }; // Who created the task
  workedBy?: Array<{ agentId: string; agentName: string; agentType: string; workedAt: string }>; // Who worked on the task
};

export type WizardNote = {
  id: string;
  content: string;
  seenByAgent: boolean;
  createdAt: string;
};

export type WizardProject = {
  id: string;
  name: string;
  description?: string;
  githubRepo?: string;
  devServerUrl?: string;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  prompt?: string;
  research?: string;
  features?: string;
  enhancedPrompt?: string;
  manualApprovalRequired?: boolean; // Toggle for manual task approval
  selectedModel?: string; // Per-project LLM model selection
};

export type WizardActionLogEntry = {
  id: string;
  action: string;
  description?: string;
  agentId?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

export type WizardLearningEntry = {
  id: string;
  taskId: string;
  error: string;
  fix: string;
  agentId: string;
  createdAt: string;
  pattern?: string;
};

export type WizardData = {
  tasks: WizardTask[];
  notes: WizardNote[];
  projects: WizardProject[];
  actionLog: WizardActionLogEntry[];
  learning: WizardLearningEntry[];
};

let cachedData: WizardData | null = null;
let dataFilePath: string | null = null;

async function getDataFilePath(): Promise<string> {
  if (dataFilePath) return dataFilePath;
  const stateDir = resolveStateDir();
  dataFilePath = path.join(stateDir, WIZARD_DATA_FILE);
  return dataFilePath;
}

async function loadData(): Promise<WizardData> {
  if (cachedData) return cachedData;
  const filePath = await getDataFilePath();
  try {
    const content = await fs.readFile(filePath, "utf-8");
    cachedData = JSON.parse(content) as WizardData;
  } catch {
    cachedData = {
      tasks: [],
      notes: [],
      projects: [],
      actionLog: [],
      learning: [],
    };
  }
  return cachedData;
}

async function saveData(data: WizardData): Promise<void> {
  cachedData = data;
  const filePath = await getDataFilePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getWizardTasks(): Promise<WizardTask[]> {
  const data = await loadData();
  return data.tasks;
}

export async function getWizardTaskById(id: string): Promise<WizardTask | undefined> {
  const tasks = await getWizardTasks();
  return tasks.find((t) => t.id === id);
}

export async function getWizardTasksByStatus(status: WizardTask["status"]): Promise<WizardTask[]> {
  const tasks = await getWizardTasks();
  return tasks.filter((t) => t.status === status);
}

export async function addTaskEditLog(
  taskId: string,
  logEntry: Omit<WizardTaskEditLog, "id" | "timestamp">,
): Promise<void> {
  const data = await loadData();
  const taskIndex = data.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;
  
  const task = data.tasks[taskIndex];
  if (!task.editLog) {
    task.editLog = [];
  }
  
  const newLog: WizardTaskEditLog = {
    ...logEntry,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
  };
  
  task.editLog.unshift(newLog);
  if (task.editLog.length > 100) {
    task.editLog = task.editLog.slice(0, 100);
  }
  
  await saveData(data);
}

export async function validateTask(taskId: string, agentId?: string): Promise<WizardTaskValidation[]> {
  const data = await loadData();
  const task = data.tasks.find((t) => t.id === taskId);
  if (!task) return [];
  
  const validations: WizardTaskValidation[] = [];
  const now = new Date().toISOString();
  
  // Validate title
  validations.push({
    section: "title",
    isValid: !!task.title && task.title.trim().length > 0,
    checkedAt: now,
    checkedBy: agentId,
    message: task.title && task.title.trim().length > 0 ? "Title is present" : "Title is required",
  });
  
  // Validate description
  validations.push({
    section: "description",
    isValid: !!task.description && task.description.trim().length > 0,
    checkedAt: now,
    checkedBy: agentId,
    message: task.description && task.description.trim().length > 0 ? "Description is present" : "Description is optional",
  });
  
  // Validate labels
  validations.push({
    section: "labels",
    isValid: (task.labels?.length || 0) > 0,
    checkedAt: now,
    checkedBy: agentId,
    message: (task.labels?.length || 0) > 0 ? `Has ${task.labels?.length} label(s)` : "No labels assigned",
  });
  
  // Validate due date
  validations.push({
    section: "dueDate",
    isValid: !!task.dueDate,
    checkedAt: now,
    checkedBy: agentId,
    message: task.dueDate ? `Due date set: ${new Date(task.dueDate).toLocaleDateString()}` : "No due date set",
  });
  
  // Validate checklist completion
  if (task.checklist && task.checklist.length > 0) {
    const completed = task.checklist.filter((item) => item.completed).length;
    validations.push({
      section: "checklist",
      isValid: completed === task.checklist.length,
      checkedAt: now,
      checkedBy: agentId,
      message: `${completed}/${task.checklist.length} checklist items completed`,
    });
  }
  
  // Validate project association
  validations.push({
    section: "project",
    isValid: !!task.projectId,
    checkedAt: now,
    checkedBy: agentId,
    message: task.projectId ? "Task is linked to a project" : "Task is not linked to a project",
  });
  
  // Update task validations
  task.validations = validations;
  await saveData(data);
  
  return validations;
}

export async function updateWizardTask(
  taskId: string,
  updates: Partial<WizardTask>,
  editLog?: Omit<WizardTaskEditLog, "id" | "timestamp">,
): Promise<WizardTask | null> {
  const data = await loadData();
  const taskIndex = data.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return null;
  
  const oldTask = { ...data.tasks[taskIndex] };
  const task = data.tasks[taskIndex];
  
  // Track who worked on the task (if agent is updating and not just the creator)
  if (editLog && editLog.agentId && editLog.agentId !== "user" && editLog.agentId !== "unknown") {
    const workedBy = task.workedBy || [];
    const existingWorker = workedBy.find((w) => w.agentId === editLog.agentId);
    if (!existingWorker) {
      // Add new worker
      workedBy.push({
        agentId: editLog.agentId,
        agentName: editLog.agentName || editLog.agentId,
        agentType: editLog.agentType || "agent",
        workedAt: new Date().toISOString(),
      });
      updates.workedBy = workedBy;
    } else {
      // Update last worked time
      existingWorker.workedAt = new Date().toISOString();
      updates.workedBy = workedBy;
    }
  }
  
  data.tasks[taskIndex] = {
    ...task,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  // Add edit log entry if provided
  if (editLog) {
    await addTaskEditLog(taskId, editLog);
  }
  
  // Auto-validate task after update
  if (editLog?.agentId) {
    await validateTask(taskId, editLog.agentId);
  }
  
  await saveData(data);
  return data.tasks[taskIndex];
}

export async function saveTaskToFile(task: WizardTask, project: WizardProject): Promise<string> {
  const stateDir = resolveStateDir();
  const projectDir = path.join(stateDir, "wizard-projects", project.name.replace(/[^a-zA-Z0-9-_]/g, "_"));
  const tasksDir = path.join(projectDir, "tasks");
  await fs.mkdir(tasksDir, { recursive: true });
  
  const fileName = `${task.id}.md`;
  const filePath = path.join(tasksDir, fileName);
  
  // Load subagent runs for this task to include in markdown
  let subagentRunsText = "*No agent work sessions*";
  try {
    const { loadSubagentRegistryFromDisk } = await import("../agents/subagent-registry.store.js");
    const registry = loadSubagentRegistryFromDisk();
    const taskRuns = Array.from(registry.values()).filter(
      (run) => run.task?.includes(`Task ID: ${task.id}`) || run.task?.includes(task.title)
    );
    if (taskRuns.length > 0) {
      subagentRunsText = taskRuns
        .map((run) => {
          const started = run.startedAt ? new Date(run.startedAt).toLocaleString() : "Unknown";
          const ended = run.endedAt ? new Date(run.endedAt).toLocaleString() : "In progress";
          const outcome = run.outcome?.status === "ok" ? "✅ Completed" : 
                         run.outcome?.status === "error" ? `❌ Error: ${run.outcome.error || "Unknown"}` :
                         run.outcome?.status === "timeout" ? "⏱️ Timeout" : "⏳ In progress";
          return `### ${run.label || "Agent Work Session"} (${started})
- **Session**: ${run.childSessionKey}
- **Run ID**: ${run.runId}
- **Status**: ${outcome}
- **Started**: ${started}
- **Ended**: ${ended}
- **Task**: ${run.task?.substring(0, 200) || "N/A"}${run.task && run.task.length > 200 ? "..." : ""}`;
        })
        .join("\n\n");
    }
  } catch (err) {
    // Ignore errors loading subagent registry
  }
  
  // Include lint status and errors
  const lintSection = task.lintStatus
    ? `## Lint Status

- **Status**: ${task.lintStatus}
${task.lintFixedAt ? `- **Fixed At**: ${new Date(task.lintFixedAt).toLocaleString()}` : ""}
${task.lintErrors && task.lintErrors.length > 0
  ? `\n### Lint Errors\n\n${task.lintErrors.map((err) => `- **${err.file}**${err.line ? `:${err.line}` : ""}: ${err.message}`).join("\n")}`
  : ""}
`
    : "";
  
  // Include attachments
  const attachmentsSection = task.attachments && task.attachments.length > 0
    ? `## Attachments

${task.attachments.map((att) => `- **${att.name}** (${att.type}): ${att.url}`).join("\n")}
`
    : "";
  
  const markdown = `# ${task.title}

${task.description || "*No description*"}

## Metadata

- **Task ID**: ${task.id}
- **Status**: ${task.status}
- **Priority**: ${task.priority || "None"}
- **Created**: ${new Date(task.createdAt).toLocaleString()}
- **Updated**: ${new Date(task.updatedAt).toLocaleString()}
${task.dueDate ? `- **Due Date**: ${new Date(task.dueDate).toLocaleDateString()}` : ""}
${task.labels && task.labels.length > 0 ? `- **Labels**: ${task.labels.join(", ")}` : ""}
${task.projectId ? `- **Project ID**: ${task.projectId}` : ""}
${task.agentId ? `- **Current Agent**: ${task.agentId}` : ""}

## Checklist

${task.checklist && task.checklist.length > 0
  ? task.checklist.map((item) => `- [${item.completed ? "x" : " "}] ${item.text}`).join("\n")
  : "*No checklist items*"}

${lintSection}${attachmentsSection}## Agent Work Sessions

${subagentRunsText}

## Edit Log

${task.editLog && task.editLog.length > 0
  ? task.editLog
      .map(
        (log) =>
          `### ${new Date(log.timestamp).toLocaleString()}\n- **Agent**: ${log.agentName} (${log.agentType})\n- **Agent ID**: ${log.agentId}\n- **Action**: ${log.action}\n${log.field ? `- **Field**: ${log.field}` : ""}${log.oldValue ? `\n- **Old Value**: ${log.oldValue}` : ""}${log.newValue ? `\n- **New Value**: ${log.newValue}` : ""}${log.description ? `\n- **Details**: ${log.description}` : ""}`,
      )
      .join("\n\n")
  : "*No edit history*"}

## Validations

${task.validations && task.validations.length > 0
  ? task.validations
      .map(
        (val) =>
          `- **${val.section}**: ${val.isValid ? "✅" : "❌"} ${val.message || ""} (${new Date(val.checkedAt).toLocaleString()})${val.checkedBy ? ` - Checked by: ${val.checkedBy}` : ""}`,
      )
      .join("\n")
  : "*No validations*"}

---

*This file is automatically updated whenever the task changes. Last updated: ${new Date().toLocaleString()}*
`;

  await fs.writeFile(filePath, markdown, "utf-8");
  return filePath;
}

export async function addWizardActionLog(entry: Omit<WizardActionLogEntry, "id" | "createdAt">): Promise<void> {
  const data = await loadData();
  const newEntry: WizardActionLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  data.actionLog.unshift(newEntry);
  if (data.actionLog.length > 1000) {
    data.actionLog = data.actionLog.slice(0, 1000);
  }
  await saveData(data);
}

export async function addWizardLearning(entry: Omit<WizardLearningEntry, "id" | "createdAt">): Promise<void> {
  const data = await loadData();
  const newEntry: WizardLearningEntry = {
    ...entry,
    id: `learn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  data.learning.unshift(newEntry);
  if (data.learning.length > 500) {
    data.learning = data.learning.slice(0, 500);
  }
  await saveData(data);
}

export async function getWizardLearning(pattern?: string): Promise<WizardLearningEntry[]> {
  const data = await loadData();
  if (!pattern) return data.learning.slice(0, 50);
  const lowerPattern = pattern.toLowerCase();
  return data.learning.filter(
    (entry) =>
      entry.error.toLowerCase().includes(lowerPattern) ||
      entry.fix.toLowerCase().includes(lowerPattern) ||
      entry.pattern?.toLowerCase().includes(lowerPattern),
  );
}

export async function getWizardProjects(): Promise<WizardProject[]> {
  const data = await loadData();
  return data.projects;
}

export async function getWizardProjectById(id: string): Promise<WizardProject | undefined> {
  const projects = await getWizardProjects();
  return projects.find((p) => p.id === id);
}

export async function createWizardProject(project: Omit<WizardProject, "id" | "createdAt" | "updatedAt">): Promise<WizardProject> {
  const data = await loadData();
  const newProject: WizardProject = {
    ...project,
    id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: project.tags || [],
  };
  data.projects.push(newProject);
  await saveData(data);
  
  // Initialize project folder structure
  try {
    const { createProjectFolders } = await import("../wizard/project-folder-structure.js");
    await createProjectFolders(newProject);
  } catch (err) {
    console.error(`Failed to initialize project folders: ${err}`);
  }
  
  return newProject;
}

export async function updateWizardProject(projectId: string, updates: Partial<WizardProject>): Promise<WizardProject | null> {
  const data = await loadData();
  const projectIndex = data.projects.findIndex((p) => p.id === projectId);
  if (projectIndex === -1) return null;
  data.projects[projectIndex] = {
    ...data.projects[projectIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await saveData(data);
  return data.projects[projectIndex];
}

export async function createWizardTask(task: Omit<WizardTask, "id" | "createdAt" | "updatedAt">): Promise<WizardTask> {
  const data = await loadData();
  const agentId = task.agentId || "user";
  const agentName = (task as any).agentName || "User";
  const agentType = (task as any).agentType || "human";
  
  const newTask: WizardTask = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: {
      agentId,
      agentName,
      agentType,
    },
    workedBy: [],
    editLog: task.editLog || [{
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      agentId,
      agentName,
      agentType,
      action: "created",
      description: `Task "${task.title}" was created`,
    }],
    validations: [],
  };
  
  data.tasks.push(newTask);
  await saveData(data);
  
  // Save to file if project exists
  if (newTask.projectId) {
    const project = await getWizardProjectById(newTask.projectId);
    if (project) {
      try {
        const filePath = await saveTaskToFile(newTask, project);
        newTask.filePath = filePath;
        // Update task with file path
        const taskIndex = data.tasks.findIndex((t) => t.id === newTask.id);
        if (taskIndex !== -1) {
          data.tasks[taskIndex].filePath = filePath;
          await saveData(data);
        }
      } catch (err) {
        console.error(`Failed to save task to file: ${err}`);
      }
    }
  }
  
  return newTask;
}
