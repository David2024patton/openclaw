import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "./common.js";
import { callGateway } from "../../gateway/call.js";
import { jsonResult, readStringParam } from "./common.js";

const WizardProjectsGetSchema = Type.Object({
  projectId: Type.Optional(Type.String()),
});

const WizardProjectsCreateSchema = Type.Object({
  name: Type.String(),
  description: Type.Optional(Type.String()),
  prompt: Type.Optional(Type.String()),
  research: Type.Optional(Type.String()),
  features: Type.Optional(Type.String()),
  githubRepo: Type.Optional(Type.String()),
  devServerUrl: Type.Optional(Type.String()),
});

const WizardProjectsUpdateSchema = Type.Object({
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
});

const WizardProjectsGenerateTasksSchema = Type.Object({
  projectId: Type.String(),
});

export function createWizardProjectsTool(): AnyAgentTool {
  return {
    label: "Wizard Projects",
    name: "wizard_projects",
    description:
      "Manage wizard dashboard projects. Create projects, update project details (prompt, research, features), and generate tasks from project features. Use this when a user requests a new website or application project.",
    parameters: Type.Union([
      Type.Object({
        action: Type.Literal("get"),
        ...WizardProjectsGetSchema.properties,
      }),
      Type.Object({
        action: Type.Literal("getById"),
        projectId: Type.String(),
      }),
      Type.Object({
        action: Type.Literal("create"),
        ...WizardProjectsCreateSchema.properties,
      }),
      Type.Object({
        action: Type.Literal("update"),
        ...WizardProjectsUpdateSchema.properties,
      }),
      Type.Object({
        action: Type.Literal("generateTasks"),
        ...WizardProjectsGenerateTasksSchema.properties,
      }),
    ]),
    execute: async (_toolCallId, args) => {
      const params = args as Record<string, unknown>;
      const action = readStringParam(params, "action", { required: true });

      if (action === "get") {
        const validated = WizardProjectsGetSchema.safeParse(params);
        if (!validated.success) {
          return jsonResult({ error: `Invalid params: ${validated.error.message}` });
        }
        const result = await callGateway<{ projects: unknown[] }>({
          method: "wizard.projects.get",
          params: validated.data,
        });
        return jsonResult(result || { projects: [] });
      }

      if (action === "getById") {
        const projectId = readStringParam(params, "projectId", { required: true });
        const result = await callGateway<{ project: unknown }>({
          method: "wizard.projects.getById",
          params: { projectId },
        });
        return jsonResult(result || { project: null });
      }

      if (action === "create") {
        const validated = WizardProjectsCreateSchema.safeParse(params);
        if (!validated.success) {
          return jsonResult({ error: `Invalid params: ${validated.error.message}` });
        }
        const result = await callGateway<{ project: unknown }>({
          method: "wizard.projects.create",
          params: validated.data,
        });
        return jsonResult(result || { project: null });
      }

      if (action === "update") {
        const validated = WizardProjectsUpdateSchema.safeParse(params);
        if (!validated.success) {
          return jsonResult({ error: `Invalid params: ${validated.error.message}` });
        }
        const { projectId, updates } = validated.data;
        const result = await callGateway<{ project: unknown }>({
          method: "wizard.projects.update",
          params: { projectId, updates },
        });
        return jsonResult(result || { project: null });
      }

      if (action === "generateTasks") {
        const validated = WizardProjectsGenerateTasksSchema.safeParse(params);
        if (!validated.success) {
          return jsonResult({ error: `Invalid params: ${validated.error.message}` });
        }
        const { projectId } = validated.data;
        // Get project to extract features
        const projectResult = await callGateway<{ project: { features?: string } }>({
          method: "wizard.projects.getById",
          params: { projectId },
        });
        
        if (!projectResult?.project) {
          return jsonResult({ error: "Project not found" });
        }

        const features = projectResult.project.features || "";
        const lines = features
          .split("\n")
          .map((line) => line.trim().replace(/^[-*]\s*/, ""))
          .filter((line) => line.length > 0)
          .slice(0, 50);

        const createdTasks: string[] = [];
        for (const line of lines) {
          const taskResult = await callGateway<{ task: { id: string; title: string } }>({
            method: "wizard.tasks.create",
            params: {
              title: line,
              description: `Generated from project features for project ${projectId}`,
              projectId,
              labels: ["feature"],
            },
          });
          if (taskResult?.task) {
            createdTasks.push(taskResult.task.id);
          }
        }

        return jsonResult({
          success: true,
          tasksCreated: createdTasks.length,
          taskIds: createdTasks,
        });
      }

      return jsonResult({ error: `Unknown action: ${action}` });
    },
  };
}
