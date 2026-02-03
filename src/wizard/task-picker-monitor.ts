import { getWizardTasksByStatus, getWizardTaskById, updateWizardTask, type WizardTask } from "../gateway/wizard-data-store.js";
import { resolveDefaultAgentId } from "../agents/agent-scope.js";
import { callGateway } from "../gateway/call.js";
import { registerSubagentRun } from "../agents/subagent-registry.js";
import { buildSubagentSystemPrompt } from "../agents/subagent-announce.js";
import { AGENT_LANE_SUBAGENT } from "../agents/lanes.js";
import { randomUUID } from "node:crypto";

const MAX_CONCURRENT_AGENTS = 5; // Max agents working on tasks at once

let isInitialized = false;
const activeTaskAgents = new Set<string>(); // Track tasks currently being worked on
const taskLocks = new Map<string, { agentId: string; lockedAt: string }>(); // Track which agent has locked which task

export async function startTaskPickerMonitor() {
  if (isInitialized) {
    return; // Already initialized
  }

  isInitialized = true;

  // On startup, check for in-progress tasks that might need recovery
  await recoverInProgressTasks();

  // Run once on startup to pick up any pending tasks
  await checkAndProcessTasks();
  console.log("[TaskPickerMonitor] Initialized (event-driven)");
}

// Event-driven trigger - call this when tasks are created or updated
export async function triggerTaskPickerCheck() {
  if (!isInitialized) {
    await startTaskPickerMonitor();
    return;
  }
  
  // Debounce: only check if not already processing
  if (activeTaskAgents.size < MAX_CONCURRENT_AGENTS) {
    await checkAndProcessTasks();
  }
}

async function recoverInProgressTasks() {
  try {
    // Get all in-progress tasks
    const inProgressTasks = await getWizardTasksByStatus("in_progress");
    
    // Check subagent registry to see which tasks have active agents
    const { loadSubagentRegistryFromDisk } = await import("../agents/subagent-registry.store.js");
    const registry = loadSubagentRegistryFromDisk();
    const activeRuns = Array.from(registry.values()).filter(
      (run) => !run.endedAt || !run.cleanupCompletedAt
    );
    
    // For tasks without active agents, check if they should be picked up again
    for (const task of inProgressTasks) {
      const hasActiveAgent = activeRuns.some(
        (run) => run.task?.includes(`Task ID: ${task.id}`) || run.task?.includes(task.title)
      );
      
      if (!hasActiveAgent) {
        // Task is in-progress but no active agent - might have been interrupted
        // Check if it's been stuck for more than 5 minutes
        const taskAge = Date.now() - new Date(task.updatedAt).getTime();
        if (taskAge > 5 * 60 * 1000) {
          console.log(`[TaskPickerMonitor] Found orphaned in-progress task: ${task.id} (${task.title}) - will be picked up`);
          // Task will be picked up by normal check cycle
        }
      }
    }
  } catch (err) {
    console.error("[TaskPickerMonitor] Error recovering in-progress tasks:", err);
  }
}

export function stopTaskPickerMonitor() {
  isInitialized = false;
  activeTaskAgents.clear();
  taskLocks.clear();
  console.log("[TaskPickerMonitor] Stopped");
}

function isTaskLocked(taskId: string): boolean {
  const lock = taskLocks.get(taskId);
  if (!lock) return false;
  
  // Lock expires after 10 minutes
  const lockAge = Date.now() - new Date(lock.lockedAt).getTime();
  if (lockAge > 10 * 60 * 1000) {
    taskLocks.delete(taskId);
    return false;
  }
  
  return true;
}

function lockTask(taskId: string, agentId: string): boolean {
  if (isTaskLocked(taskId)) {
    return false; // Already locked
  }
  
  taskLocks.set(taskId, {
    agentId,
    lockedAt: new Date().toISOString(),
  });
  
  return true;
}

function unlockTask(taskId: string): void {
  taskLocks.delete(taskId);
}

async function checkAndProcessTasks() {
  // Get tasks from "todo" and "in_progress" columns
  const todoTasks = await getWizardTasksByStatus("todo");
  const inProgressTasks = await getWizardTasksByStatus("in_progress");
  
  // Filter out tasks that are already being worked on or locked
  const availableTasks: WizardTask[] = [];
  for (const task of [...todoTasks, ...inProgressTasks]) {
    if (
      !activeTaskAgents.has(task.id) &&
      !(await isTaskLocked(task.id)) &&
      task.status !== "done" &&
      task.status !== "archived"
    ) {
      availableTasks.push(task);
    }
  }
  
  if (availableTasks.length === 0) {
    return; // No tasks to process
  }
  
  // Limit concurrent agents
  const slotsAvailable = MAX_CONCURRENT_AGENTS - activeTaskAgents.size;
  if (slotsAvailable <= 0) {
    return; // All slots full
  }
  
  // Sort by priority and creation date
  const sortedTasks = availableTasks.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1, undefined: 0 };
    const aPriority = priorityOrder[a.priority || "undefined"];
    const bPriority = priorityOrder[b.priority || "undefined"];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    // Older tasks first
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  
  // Process up to available slots
  const tasksToProcess = sortedTasks.slice(0, slotsAvailable);
  
  for (const task of tasksToProcess) {
    activeTaskAgents.add(task.id);
    processTask(task).catch(async (err) => {
      console.error(`[TaskPickerMonitor] Error processing task ${task.id}:`, err);
      activeTaskAgents.delete(task.id);
      await unlockTask(task.id);
    });
  }
}

async function processTask(task: WizardTask) {
  try {
    const { loadConfig } = await import("../config/config.js");
    const cfg = loadConfig();
    const agentId = resolveDefaultAgentId(cfg);
    
    // Lock the task (persistent lock)
    if (!(await lockTask(task.id, agentId))) {
      console.log(`[TaskPickerMonitor] Task ${task.id} is already locked, skipping`);
      activeTaskAgents.delete(task.id);
      return;
    }
    
    // Update task status to "in_progress" if it's in "todo"
    if (task.status === "todo") {
      await updateWizardTask(task.id, {
        status: "in_progress",
        agentId,
      }, {
        agentId,
        agentName: "Task Picker Monitor",
        agentType: "automated",
        action: "status_changed",
        description: `Task moved to in_progress by task picker monitor`,
      });
    }
    
    // Determine which agent type to spawn based on task labels
    let agentType = "coding-agent";
    if (task.labels) {
      if (task.labels.includes("database") || task.labels.includes("sql")) {
        agentType = "database-agent";
      } else if (task.labels.includes("frontend") || task.labels.includes("ui")) {
        agentType = "frontend-agent";
      } else if (task.labels.includes("backend") || task.labels.includes("api")) {
        agentType = "backend-agent";
      } else if (task.labels.includes("test") || task.labels.includes("testing")) {
        agentType = "testing-agent";
      }
    }
    
    // Spawn sub-agent to work on task using the subagent system (swarm pattern)
    // This follows the same pattern as sessions_spawn tool:
    // 1. Create child session key
    // 2. Call agent method with subagent lane
    // 3. Register in subagent registry (enables automatic reporting)
    // 4. Subagent gets all tools including wizard_tasks and wizard_projects
    
    const childSessionKey = `agent:${agentId}:subagent:${randomUUID()}`;
    const taskDescription = `Work on this task from the wizard dashboard:

Title: ${task.title}
Description: ${task.description || "No description"}
Project ID: ${task.projectId || "None"}
Task ID: ${task.id}

Use the wizard_tasks tool to:
1. Update the task status as you work
2. Add notes or updates to the description
3. When complete, move it to "testing" status

Use wizard_projects tool to get project context if needed.

When you're done, your results will be automatically reported to the main agent.`;
    
    const label = `Task: ${task.title.substring(0, 30)}`;
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
      console.error(`[TaskPickerMonitor] Failed to spawn sub-agent for task ${task.id}:`, err);
      unlockTask(task.id);
      activeTaskAgents.delete(task.id);
      return;
    }
    
    // Register in subagent registry - this enables:
    // - Automatic lifecycle tracking
    // - Automatic reporting back to main agent when done
    // - Persistence across restarts
    registerSubagentRun({
      runId: childRunId,
      childSessionKey,
      requesterSessionKey: `agent:${agentId}:main`, // Use main session as requester
      requesterDisplayKey: `agent:${agentId}:main`,
      task: taskDescription,
      cleanup: "keep", // Keep session for audit trail
      label,
    });
    
    // Record agent activity for monitoring
    if (task.projectId) {
      try {
        const { getWizardProjectById } = await import("../gateway/wizard-data-store.js");
        const { registerAgentActivity, updateAgentActivity } = await import("./agent-activity-monitor.js");
        const project = await getWizardProjectById(task.projectId);
        if (project) {
          registerAgentActivity({
            agentId: childSessionKey,
            agentName: label,
            agentType: agentType as "main" | "sub-agent" | "testing" | "linting" | "visual-testing" | "research" | "coding",
            projectId: task.projectId,
            taskId: task.id,
            status: "working",
            model: cfg.agents?.defaults?.model?.primary || "default",
            thinking: `Starting work on task: ${task.title}`,
            actions: [`Started working on task: ${task.title}`],
            startedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error(`[TaskPickerMonitor] Failed to record agent activity:`, err);
      }
    }
    
    console.log(`[TaskPickerMonitor] Spawned sub-agent (swarm) for task ${task.id} (${task.title}) - session: ${childSessionKey}, runId: ${childRunId}`);
    
    // The subagent system will automatically:
    // 1. Track the run in the registry
    // 2. Monitor lifecycle (start/end/error)
    // 3. Report back to main agent when done via subagent-announce flow
    // 4. Handle cleanup
    
    // We still monitor task completion to release our lock
    const completionCheck = setInterval(async () => {
      const updatedTask = await getWizardTaskById(task.id);
      if (!updatedTask) {
        clearInterval(completionCheck);
        unlockTask(task.id);
        activeTaskAgents.delete(task.id);
        return;
      }
      
      // If task moved to "testing" or "done", release lock
      if (updatedTask.status === "testing" || updatedTask.status === "done" || updatedTask.status === "archived") {
        clearInterval(completionCheck);
        await unlockTask(task.id);
        activeTaskAgents.delete(task.id);
        console.log(`[TaskPickerMonitor] Task ${task.id} completed, released lock`);
      }
    }, 30000);
    
    // Auto-cleanup after 1 hour
    setTimeout(async () => {
      clearInterval(completionCheck);
      await unlockTask(task.id);
      activeTaskAgents.delete(task.id);
    }, 60 * 60 * 1000);
    
  } catch (err) {
    console.error(`[TaskPickerMonitor] Error in processTask:`, err);
    await unlockTask(task.id);
    activeTaskAgents.delete(task.id);
  }
}
