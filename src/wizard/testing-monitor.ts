import { loadConfig } from "../config/config.js";
import { getWizardTasksByStatus, updateWizardTask, type WizardTask } from "../gateway/wizard-data-store.js";
import { callGateway } from "../gateway/call.js";
import { resolveDefaultAgentId } from "../agents/agent-scope.js";
import { registerSubagentRun } from "../agents/subagent-registry.js";
import { buildSubagentSystemPrompt } from "../agents/subagent-announce.js";
import { AGENT_LANE_SUBAGENT } from "../agents/lanes.js";
import { randomUUID } from "node:crypto";

const MAX_CONCURRENT_LINTS = 3; // Max agents running lints at once

let isInitialized = false;
let activeLintTasks = new Set<string>(); // Track tasks currently being linted

export async function startTestingMonitor() {
  if (isInitialized) {
    return; // Already initialized
  }

  isInitialized = true;

  // Run once on startup to check for tasks in testing status
  await checkAndProcessTestingTasks();
  console.log("[TestingMonitor] Initialized (event-driven)");
}

// Event-driven trigger - call this when tasks move to testing status
export async function triggerTestingCheck() {
  if (!isInitialized) {
    await startTestingMonitor();
    return;
  }
  
  // Only check if not already processing max tasks
  if (activeLintTasks.size < MAX_CONCURRENT_LINTS) {
    await checkAndProcessTestingTasks();
  }
}

export function stopTestingMonitor() {
  isInitialized = false;
  activeLintTasks.clear();
}

function isCodeRelatedTask(task: WizardTask): boolean {
  // Check if task has code-related labels (using predefined label IDs)
  const codeLabelIds = ["code", "bug", "feature", "refactor", "test", "documentation", "python", "javascript", "frontend", "backend", "database"];
  if (task.labels?.some(label => codeLabelIds.includes(label))) {
    return true;
  }

  // Check task title/description for code-related keywords
  const text = `${task.title} ${task.description || ""}`.toLowerCase();
  const codeKeywords = [
    "code", "function", "class", "module", "script", "file", "bug", "error", "fix", "implement",
    "python", "javascript", "typescript", "java", "go", "rust", "compile", "syntax", "lint",
    "refactor", "test", "unit test", "integration", "api", "endpoint", "database", "query"
  ];
  
  if (codeKeywords.some(keyword => text.includes(keyword))) {
    return true;
  }

  // Check if task is linked to a project with a GitHub repo (likely code project)
  if (task.projectId) {
    return true; // Assume projects are code-related unless proven otherwise
  }

  // Check for non-code keywords that indicate manual/verification tasks
  const nonCodeKeywords = [
    "check email", "checking email", "read email", "send email",
    "verify", "manual", "review", "approve", "confirm", "check", "look at",
    "meeting", "call", "phone", "message", "text", "notification"
  ];
  
  if (nonCodeKeywords.some(keyword => text.includes(keyword))) {
    return false;
  }

  // Default: if unclear, assume it might be code-related if it has a project
  return !!task.projectId;
}

async function checkAndProcessTestingTasks() {
  const testingTasks = await getWizardTasksByStatus("testing");
  
  // Separate code-related and non-code tasks
  const codeTasks = testingTasks.filter(
    (task) =>
      isCodeRelatedTask(task) &&
      !activeLintTasks.has(task.id) &&
      task.lintStatus !== "passed" &&
      task.lintStatus !== "fixed"
  );

  const nonCodeTasks = testingTasks.filter(
    (task) =>
      !isCodeRelatedTask(task) &&
      task.lintStatus !== "skipped" &&
      task.lintStatus !== "manual"
  );

  // Mark non-code tasks as manual verification needed
  for (const task of nonCodeTasks) {
    await updateWizardTask(task.id, {
      lintStatus: "manual",
      lintErrors: [{ file: "system", message: "Task requires manual verification (not code-related)" }],
    });
  }

  if (codeTasks.length === 0) {
    return;
  }

  // Process up to MAX_CONCURRENT_LINTS code-related tasks
  const tasksToProcess = codeTasks.slice(0, MAX_CONCURRENT_LINTS);

  for (const task of tasksToProcess) {
    activeLintTasks.add(task.id);
    processTaskLint(task).catch((err) => {
      console.error(`[TestingMonitor] Error processing task ${task.id}:`, err);
      activeLintTasks.delete(task.id);
    });
  }
}

async function processTaskLint(task: WizardTask) {
  try {
    // Mark task as linting in progress
    await updateWizardTask(task.id, {
      lintStatus: "running",
      agentId: "testing-monitor",
    });

    const cfg = loadConfig();
    const agentId = resolveDefaultAgentId(cfg);
    
    // Get project to find workspace directory
    const projectId = task.projectId;
    let workspaceDir: string | undefined;
    
    if (projectId) {
      const projectResult = await callGateway<{ project?: { githubRepo?: string; devServerUrl?: string } }>({
        method: "wizard.projects.getById",
        params: { projectId },
      });
      
      // Try to derive workspace from project
      if (projectResult?.project?.githubRepo) {
        // Extract repo path - this is a simple heuristic
        const repoMatch = projectResult.project.githubRepo.match(/github\.com\/([^\/]+\/[^\/]+)/);
        if (repoMatch) {
          // Assume workspace is in ~/Projects or similar
          workspaceDir = `~/Projects/${repoMatch[1].split("/")[1]}`;
        }
      }
    }

    // Spawn sub-agent to lint the code using the subagent system (swarm pattern)
    const childSessionKey = `agent:${agentId}:subagent:${randomUUID()}`;
    const taskDescription = `[Model preference: qwen2.5-coder:1.5b if available]

Task "${task.title}" is in testing. Run the linter to check for errors.

Steps:
1. Navigate to the project directory: ${workspaceDir || "the project workspace"}
2. Run: python wizard_lint.py
3. Parse the output and update the task with wizard_tasks tool:
   - If errors found: set lintStatus to "failed" and lintErrors array
   - If no errors: set lintStatus to "passed"
4. If errors found, attempt to fix them
5. After fixing, run linter again
6. If fixed successfully, set lintStatus to "fixed" and record learning with wizard_tasks learning.add

Task details:
- ID: ${task.id}
- Title: ${task.title}
- Description: ${task.description || "None"}
- Project ID: ${projectId || "None"}`;
    
    const label = `Lint: ${task.title.substring(0, 30)}`;
    const childSystemPrompt = buildSubagentSystemPrompt({
      childSessionKey,
      task: taskDescription,
      label,
    });
    
    const childIdem = randomUUID();
    let childRunId: string = childIdem;
    
    try {
      const response = await callGateway<{ runId: string }>({
        method: "agent",
        params: {
          message: taskDescription,
          sessionKey: childSessionKey,
          idempotencyKey: childIdem,
          deliver: false,
          lane: AGENT_LANE_SUBAGENT,
          extraSystemPrompt: childSystemPrompt,
          label,
        },
        timeoutMs: 10_000,
      });
      
      if (typeof response?.runId === "string" && response.runId) {
        childRunId = response.runId;
      }
    } catch (err) {
      throw new Error(`Failed to spawn lint agent: ${err}`);
    }
    
    // Register in subagent registry - enables automatic reporting
    registerSubagentRun({
      runId: childRunId,
      childSessionKey,
      requesterSessionKey: `agent:${agentId}:main`,
      requesterDisplayKey: `agent:${agentId}:main`,
      task: taskDescription,
      cleanup: "keep",
      label,
    });
    
    console.log(`[TestingMonitor] Spawned sub-agent (swarm) for linting task ${task.id} - session: ${childSessionKey}, runId: ${childRunId}`);
    
  } catch (err) {
    console.error(`[TestingMonitor] Failed to process task ${task.id}:`, err);
    await updateWizardTask(task.id, {
      lintStatus: "failed",
      lintErrors: [{ file: "system", message: `Failed to spawn lint agent: ${err}` }],
    });
    activeLintTasks.delete(task.id);
  }
}
