import type { GatewayRequestHandlers } from "./types.js";
import {
  addWizardActionLog,
  addWizardLearning,
  createWizardProject,
  createWizardTask,
  getWizardLearning,
  getWizardProjectById,
  getWizardProjects,
  getWizardTaskById,
  getWizardTasks,
  getWizardTasksByStatus,
  updateWizardProject,
  updateWizardTask,
  validateTask,
  saveTaskToFile,
  type WizardTask,
} from "../wizard-data-store.js";
import { createGitHubRepoForProject, commitTaskProgress, initializeProjectGitRepo } from "../../wizard/github-integration.js";
import { triggerTaskPickerCheck } from "../../wizard/task-picker-monitor.js";
import { triggerTestingCheck } from "../../wizard/testing-monitor.js";
import { triggerVisualTestingCheck } from "../../wizard/visual-testing-monitor.js";
import { errorShape, formatValidationErrors } from "../protocol/index.js";
import { ErrorCodes } from "../protocol/index.js";
import { Type } from "@sinclair/typebox";

const GetTasksParamsSchema = Type.Object({
  status: Type.Optional(
    Type.Union([
      Type.Literal("todo"),
      Type.Literal("in_progress"),
      Type.Literal("testing"),
      Type.Literal("done"),
      Type.Literal("archived"),
    ]),
  ),
  projectId: Type.Optional(Type.String()),
});

const UpdateTaskParamsSchema = Type.Object({
  taskId: Type.String(),
  updates: Type.Object({
    status: Type.Optional(
      Type.Union([
        Type.Literal("todo"),
        Type.Literal("in_progress"),
        Type.Literal("testing"),
        Type.Literal("done"),
        Type.Literal("archived"),
      ]),
    ),
    lintStatus: Type.Optional(
      Type.Union([
        Type.Literal("pending"),
        Type.Literal("running"),
        Type.Literal("passed"),
        Type.Literal("failed"),
        Type.Literal("fixed"),
      ]),
    ),
    lintErrors: Type.Optional(
      Type.Array(
        Type.Object({
          file: Type.String(),
          line: Type.Optional(Type.Number()),
          message: Type.String(),
        }),
      ),
    ),
  labels: Type.Optional(Type.Array(Type.String())),
  title: Type.Optional(Type.String()),
  description: Type.Optional(Type.String()),
  agentId: Type.Optional(Type.String()),
  agentName: Type.Optional(Type.String()),
  agentType: Type.Optional(Type.String()),
  attachments: Type.Optional(
    Type.Array(
      Type.Object({
        id: Type.String(),
        name: Type.String(),
        url: Type.String(),
        type: Type.String(),
      }),
    ),
  ),
  lockedBy: Type.Optional(Type.String()),
  lockedAt: Type.Optional(Type.String()),
  }),
});

const AddLearningParamsSchema = Type.Object({
  taskId: Type.String(),
  error: Type.String(),
  fix: Type.String(),
  pattern: Type.Optional(Type.String()),
});

const ValidateTaskParamsSchema = Type.Object({
  taskId: Type.String(),
  agentId: Type.Optional(Type.String()),
});

const GetLearningParamsSchema = Type.Object({
  pattern: Type.Optional(Type.String()),
});

const CreateTaskParamsSchema = Type.Object({
  title: Type.String(),
  description: Type.Optional(Type.String()),
  projectId: Type.Optional(Type.String()),
  priority: Type.Optional(Type.Union([Type.Literal("low"), Type.Literal("medium"), Type.Literal("high")])),
  dueDate: Type.Optional(Type.String()),
  labels: Type.Optional(Type.Array(Type.String())),
  agentId: Type.Optional(Type.String()),
  agentName: Type.Optional(Type.String()),
  agentType: Type.Optional(Type.String()),
});

export const wizardTasksHandlers: GatewayRequestHandlers = {
  "wizard.tasks.create": async ({ params, respond }) => {
    const validated = CreateTaskParamsSchema.safeParse(params);
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid params: ${formatValidationErrors(validated.error.errors)}`,
        ),
      );
      return;
    }
    const { title, description, projectId, priority, dueDate, labels, agentId, agentName, agentType } = validated.data;
    
    const task = await createWizardTask({
      title,
      description,
      projectId,
      priority,
      dueDate,
      labels: labels || [],
      status: "todo",
      checklist: [],
      attachments: [],
      agentId: agentId || "user",
      editLog: [{
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        agentId: agentId || "user",
        agentName: agentName || "User",
        agentType: agentType || "human",
        action: "created",
        description: `Task "${title}" was created`,
      }],
    });
    
    await addWizardActionLog({
      action: "Task created",
      description: `Task "${title}" created`,
      agentId: agentId || "user",
    });
    
    // Trigger task picker if task is in todo status
    if (task.status === "todo" || task.status === "in_progress") {
      triggerTaskPickerCheck().catch((err) => {
        console.error(`[TaskPickerMonitor] Error triggering check:`, err);
      });
    }
    
    respond(true, { task }, undefined);
  },

  "wizard.tasks.get": async ({ params, respond, context }) => {
    const validated = GetTasksParamsSchema.safeParse(params);
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid params: ${formatValidationErrors(validated.error.errors)}`,
        ),
      );
      return;
    }
    const { status, projectId } = validated.data;
    let tasks: WizardTask[];
    if (status) {
      tasks = await getWizardTasksByStatus(status);
    } else {
      tasks = await getWizardTasks();
    }
    if (projectId) {
      tasks = tasks.filter((t) => t.projectId === projectId);
    }
    respond(true, { tasks }, undefined);
  },

  "wizard.tasks.getById": async ({ params, respond }) => {
    if (typeof params.taskId !== "string") {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "taskId required"));
      return;
    }
    const task = await getWizardTaskById(params.taskId);
    if (!task) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "task not found"));
      return;
    }
    respond(true, { task }, undefined);
  },

  "wizard.tasks.update": async ({ params, respond, context }) => {
    const validated = UpdateTaskParamsSchema.safeParse(params);
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid params: ${formatValidationErrors(validated.error.errors)}`,
        ),
      );
      return;
    }
    const { taskId, updates } = validated.data;
    const agentId = updates.agentId || "unknown"; // TODO: extract from session context
    const agentName = updates.agentName || updates.agentId || "Unknown";
    const agentType = updates.agentType || (updates.agentId?.includes("coder") ? "coding-llm" : updates.agentId?.includes("database") ? "database-llm" : updates.agentId?.includes("testing") ? "testing-agent" : "human");
    
    // Validate labels - only allow predefined labels (from simplified list)
    if (updates.labels) {
      // Simplified predefined labels: bug, feature, refactor, test, documentation, research, deployment, security
      const validLabelIds = ["bug", "feature", "refactor", "test", "documentation", "research", "deployment", "security"];
      updates.labels = updates.labels.filter((labelId: string) => validLabelIds.includes(labelId));
    }
    
    // Get old task to track changes
    const oldTask = await getWizardTaskById(taskId);
    
    // Build edit log entry
    const changedFields: string[] = [];
    if (oldTask) {
      if (updates.title && updates.title !== oldTask.title) changedFields.push(`title: "${oldTask.title}" → "${updates.title}"`);
      if (updates.status && updates.status !== oldTask.status) changedFields.push(`status: "${oldTask.status}" → "${updates.status}"`);
      if (updates.labels && JSON.stringify(updates.labels) !== JSON.stringify(oldTask.labels)) changedFields.push(`labels updated`);
      if (updates.description && updates.description !== oldTask.description) changedFields.push(`description updated`);
    }
    
    const editLog = {
      agentId: agentName,
      agentName: agentName,
      agentType: agentType,
      action: changedFields.length > 0 ? "updated" : "touched",
      description: changedFields.length > 0 ? changedFields.join(", ") : "Task was accessed",
    };
    
    const updated = await updateWizardTask(taskId, { ...updates, agentId: agentName }, editLog);
    if (!updated) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "task not found"));
      return;
    }
    
    // Save task to file if project exists
    if (updated.projectId) {
      const project = await getWizardProjectById(updated.projectId);
      if (project) {
        try {
          const filePath = await saveTaskToFile(updated, project);
          updated.filePath = filePath;
        } catch (err) {
          console.error(`Failed to save task to file: ${err}`);
        }
      }
    }
    
    await addWizardActionLog({
      action: "Task updated",
      description: `Task "${updated.title}" updated: ${changedFields.join(", ")}`,
      agentId: agentName,
    });
    
    // Trigger event-driven monitors based on status changes
    if (updates.status) {
      if (updates.status === "todo" || updates.status === "in_progress") {
        // Trigger task picker to process new/available tasks
        triggerTaskPickerCheck().catch((err) => {
          console.error(`[TaskPickerMonitor] Error triggering check:`, err);
        });
      } else if (updates.status === "testing") {
        // Trigger testing monitor for linting
        triggerTestingCheck().catch((err) => {
          console.error(`[TestingMonitor] Error triggering check:`, err);
        });
        // Trigger visual testing if web-related
        triggerVisualTestingCheck().catch((err) => {
          console.error(`[VisualTestingMonitor] Error triggering check:`, err);
        });
      } else if (updates.status === "done") {
        // Trigger visual testing for completed web tasks
        triggerVisualTestingCheck().catch((err) => {
          console.error(`[VisualTestingMonitor] Error triggering check:`, err);
        });
      }
    }
    
    // Auto-commit to GitHub if task status changed to testing or done
    if (updates.status && (updates.status === "testing" || updates.status === "done")) {
      if (updated.projectId) {
        const commitMessage = `Task "${updated.title}" moved to ${updates.status}`;
        try {
          const committed = await commitTaskProgress(updated.projectId, updated.id, commitMessage);
          if (!committed) {
            console.warn(`[GitHub Integration] Failed to commit task progress for task ${updated.id}`);
          }
        } catch (err) {
          console.error(`[GitHub Integration] Error committing task progress:`, err);
        }
      }
    }
    
    respond(true, { task: updated }, undefined);
  },

  "wizard.tasks.learning.add": async ({ params, respond, context }) => {
    const validated = AddLearningParamsSchema.safeParse(params);
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid params: ${formatValidationErrors(validated.error.errors)}`,
        ),
      );
      return;
    }
    const { taskId, error, fix, pattern } = validated.data;
    const agentId = "unknown"; // TODO: extract from session context
    await addWizardLearning({ taskId, error, fix, pattern, agentId });
    await addWizardActionLog({
      action: "Learning recorded",
      description: `Pattern learned from task ${taskId}: ${error} -> ${fix}`,
      agentId,
    });
    respond(true, { success: true }, undefined);
  },

  "wizard.tasks.learning.get": async ({ params, respond }) => {
    const validated = GetLearningParamsSchema.safeParse(params);
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid params: ${formatValidationErrors(validated.error.errors)}`,
        ),
      );
      return;
    }
    const { pattern } = validated.data;
    const learning = await getWizardLearning(pattern);
    respond(true, { learning }, undefined);
  },

  "wizard.projects.get": async ({ params, respond }) => {
    const projects = await getWizardProjects();
    respond(true, { projects }, undefined);
  },

  "wizard.projects.getById": async ({ params, respond }) => {
    if (typeof params.projectId !== "string") {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "projectId required"));
      return;
    }
    const project = await getWizardProjectById(params.projectId);
    if (!project) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "project not found"));
      return;
    }
    respond(true, { project }, undefined);
  },

  "wizard.projects.create": async ({ params, respond }) => {
    const validated = Type.Object({
      name: Type.String(),
      description: Type.Optional(Type.String()),
      prompt: Type.Optional(Type.String()),
      research: Type.Optional(Type.String()),
      features: Type.Optional(Type.String()),
      githubRepo: Type.Optional(Type.String()),
      devServerUrl: Type.Optional(Type.String()),
    }).safeParse(params);
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid params: ${formatValidationErrors(validated.error.errors)}`,
        ),
      );
      return;
    }
    const project = await createWizardProject(validated.data);
    
    // Initialize git repo for project
    await initializeProjectGitRepo(project.id);
    
    // Create GitHub repo if requested or if project has githubRepo field
    if (validated.data.githubRepo || project.githubRepo) {
      // If githubRepo is provided, use it; otherwise create new repo
      if (!validated.data.githubRepo) {
        await createGitHubRepoForProject(project.id, true);
      }
    }
    
    await addWizardActionLog({
      action: "Project created",
      description: `Project "${project.name}" created`,
      agentId: "system",
    });
    respond(true, { project }, undefined);
  },

  "wizard.projects.update": async ({ params, respond }) => {
    const validated = Type.Object({
      projectId: Type.String(),
      updates: Type.Object({
        name: Type.Optional(Type.String()),
        description: Type.Optional(Type.String()),
        prompt: Type.Optional(Type.String()),
        research: Type.Optional(Type.String()),
        features: Type.Optional(Type.String()),
        enhancedPrompt: Type.Optional(Type.String()),
        githubRepo: Type.Optional(Type.String()),
        devServerUrl: Type.Optional(Type.String()),
        status: Type.Optional(Type.Union([Type.Literal("active"), Type.Literal("completed"), Type.Literal("archived")])),
      }),
    }).safeParse(params);
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid params: ${formatValidationErrors(validated.error.errors)}`,
        ),
      );
      return;
    }
    const { projectId, updates } = validated.data;
    const updated = await updateWizardProject(projectId, updates);
    if (!updated) {
      respond(false, undefined, errorShape(ErrorCodes.INVALID_REQUEST, "project not found"));
      return;
    }
    await addWizardActionLog({
      action: "Project updated",
      description: `Project "${updated.name}" updated`,
      agentId: "system",
    });
    respond(true, { project: updated }, undefined);
  },

  "wizard.tasks.validate": async ({ params, respond }) => {
    const validated = ValidateTaskParamsSchema.safeParse(params);
    if (!validated.success) {
      respond(
        false,
        undefined,
        errorShape(
          ErrorCodes.INVALID_REQUEST,
          `invalid params: ${formatValidationErrors(validated.error.errors)}`,
        ),
      );
      return;
    }
    const { taskId, agentId } = validated.data;
    const validations = await validateTask(taskId, agentId);
    respond(true, { validations }, undefined);
  },
};
