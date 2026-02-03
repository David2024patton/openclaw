import { Type } from "@sinclair/typebox";
import type { AnyAgentTool } from "./common.js";
import { callGateway } from "../../gateway/call.js";
import { jsonResult, readStringParam, readStringArrayParam } from "./common.js";
import { suggestLabels, TASK_LABELS } from "../../wizard/task-labels.js";

const WizardTasksGetSchema = Type.Object({
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

const WizardTasksUpdateSchema = Type.Object({
  taskId: Type.String(),
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
});

const WizardTasksSuggestLabelsSchema = Type.Object({
  title: Type.String(),
  description: Type.Optional(Type.String()),
});

const WizardTasksLearningSchema = Type.Object({
  taskId: Type.String(),
  error: Type.String(),
  fix: Type.String(),
  pattern: Type.Optional(Type.String()),
});

const WizardTasksLearningGetSchema = Type.Object({
  pattern: Type.Optional(Type.String()),
});

export function createWizardTasksTool(): AnyAgentTool {
  return {
    label: "Wizard Tasks",
    name: "wizard_tasks",
    description:
      "Manage wizard dashboard tasks. Get tasks by status (testing, todo, in_progress, done, archived), update task status and lint results, and record learning from fixes.",
    parameters: Type.Union([
      Type.Object({
        action: Type.Literal("get"),
        ...WizardTasksGetSchema.properties,
      }),
      Type.Object({
        action: Type.Literal("getById"),
        taskId: Type.String(),
      }),
      Type.Object({
        action: Type.Literal("update"),
        ...WizardTasksUpdateSchema.properties,
      }),
      Type.Object({
        action: Type.Literal("learning.add"),
        ...WizardTasksLearningSchema.properties,
      }),
      Type.Object({
        action: Type.Literal("learning.get"),
        ...WizardTasksLearningGetSchema.properties,
      }),
      Type.Object({
        action: Type.Literal("suggestLabels"),
        ...WizardTasksSuggestLabelsSchema.properties,
      }),
      Type.Object({
        action: Type.Literal("listLabels"),
      }),
      Type.Object({
        action: Type.Literal("validate"),
        taskId: Type.String(),
      }),
    ]),
    execute: async (_toolCallId, args) => {
      const params = args as Record<string, unknown>;
      const action = readStringParam(params, "action", { required: true });

      if (action === "get") {
        const validated = WizardTasksGetSchema.safeParse(params);
        if (!validated.success) {
          return jsonResult({ error: `Invalid params: ${validated.error.message}` });
        }
        const result = await callGateway<{ tasks: unknown[] }>({
          method: "wizard.tasks.get",
          params: validated.data,
        });
        return jsonResult(result || { tasks: [] });
      }

      if (action === "getById") {
        const taskId = readStringParam(params, "taskId", { required: true });
        const result = await callGateway<{ task: unknown }>({
          method: "wizard.tasks.getById",
          params: { taskId },
        });
        return jsonResult(result || { task: null });
      }

      if (action === "update") {
        const validated = WizardTasksUpdateSchema.safeParse(params);
        if (!validated.success) {
          return jsonResult({ error: `Invalid params: ${validated.error.message}` });
        }
        const { taskId, ...updates } = validated.data;
        const result = await callGateway<{ task: unknown }>({
          method: "wizard.tasks.update",
          params: { taskId, updates },
        });
        return jsonResult(result || { task: null });
      }

      if (action === "learning.add") {
        const validated = WizardTasksLearningSchema.safeParse(params);
        if (!validated.success) {
          return jsonResult({ error: `Invalid params: ${validated.error.message}` });
        }
        const result = await callGateway<{ success: boolean }>({
          method: "wizard.tasks.learning.add",
          params: validated.data,
        });
        return jsonResult(result || { success: false });
      }

      if (action === "learning.get") {
        const validated = WizardTasksLearningGetSchema.safeParse(params);
        if (!validated.success) {
          return jsonResult({ error: `Invalid params: ${validated.error.message}` });
        }
        const result = await callGateway<{ learning: unknown[] }>({
          method: "wizard.tasks.learning.get",
          params: validated.data,
        });
        return jsonResult(result || { learning: [] });
      }

      if (action === "suggestLabels") {
        const validated = WizardTasksSuggestLabelsSchema.safeParse(params);
        if (!validated.success) {
          return jsonResult({ error: `Invalid params: ${validated.error.message}` });
        }
        const { title, description } = validated.data;
        const suggested = suggestLabels(title, description);
        return jsonResult({
          labels: suggested,
          allLabels: TASK_LABELS.map((l) => ({
            id: l.id,
            name: l.name,
            category: l.category,
            description: l.description,
          })),
        });
      }

      if (action === "listLabels") {
        return jsonResult({
          labels: TASK_LABELS.map((l) => ({
            id: l.id,
            name: l.name,
            category: l.category,
            description: l.description,
            keywords: l.keywords,
          })),
        });
      }

      if (action === "validate") {
        const taskId = readStringParam(params, "taskId", { required: true });
        const result = await callGateway<{ validations: unknown[] }>({
          method: "wizard.tasks.validate",
          params: { taskId },
        });
        return jsonResult(result || { validations: [] });
      }

      return jsonResult({ error: `Unknown action: ${action}` });
    },
  };
}
