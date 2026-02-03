import { html, nothing } from "lit";
import type { SessionsListResult } from "../types";
import { formatAgo } from "../format";
import { renderProjectEditorModal, renderAgentMonitoringWindows } from "./wizard-project-editor.js";
import { PREDEFINED_LABELS, getLabelById, type TaskLabel } from "./wizard-labels.js";

export type WizardTaskEditLog = {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  agentType: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  description?: string;
};

export type WizardTaskValidation = {
  section: string;
  isValid: boolean;
  checkedAt: string;
  checkedBy?: string;
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
  editLog?: WizardTaskEditLog[];
  validations?: WizardTaskValidation[];
  filePath?: string;
  createdBy?: { agentId: string; agentName: string; agentType: string };
  workedBy?: Array<{ agentId: string; agentName: string; agentType: string; workedAt: string }>;
};

export type WizardNote = {
  id: string;
  content: string;
  seenByAgent: boolean;
  createdAt: string;
};

export type WizardDeliverable = {
  id: string;
  title: string;
  type: string;
  url?: string;
  createdAt: string;
};

export type WizardActionLogEntry = {
  id: string;
  action: string;
  description?: string;
  agentId?: string;
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
  prompt?: string; // Original user prompt - always available to LLM
  research?: string; // LLM research and organization
  features?: string; // Features breakdown that can be converted to tasks
  enhancedPrompt?: string; // AI-enhanced version of prompt
  manualApprovalRequired?: boolean; // Toggle for manual task approval
  selectedModel?: string; // Per-project LLM selection
};

export type WizardProps = {
  connected: boolean;
  sessionsResult: SessionsListResult | null;
  projects: WizardProject[];
  tasks: WizardTask[];
  notes: WizardNote[];
  deliverables: WizardDeliverable[];
  actionLog: WizardActionLogEntry[];
  onAddTask: (title: string, description?: string, projectId?: string, priority?: "low" | "medium" | "high", dueDate?: string, labels?: string[]) => void;
  onUpdateTask: (taskId: string, updates: Partial<{ title: string; description: string; status: "todo" | "in_progress" | "testing" | "done" | "archived"; priority: "low" | "medium" | "high"; dueDate: string; labels: string[]; projectId: string; attachments: Array<{ id: string; name: string; url: string; type: string }>; checklist: Array<{ id: string; text: string; completed: boolean }> }>) => void;
  onAddNote: (content: string) => void;
  onUpdateNote: (noteId: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: "todo" | "in_progress" | "testing" | "done" | "archived") => void;
  onDeleteTask: (taskId: string) => void;
  onAddTaskAttachment: (taskId: string, file: File) => void;
  onAddTaskChecklistItem: (taskId: string, text: string) => void;
  onUpdateChecklistItem: (taskId: string, itemId: string, updates: Partial<{ text: string; completed: boolean }>) => void;
  onDeleteChecklistItem: (taskId: string, itemId: string) => void;
  onRefresh: () => void;
  onAddProject: (name: string, description?: string) => void;
  onUpdateProject: (projectId: string, updates: Partial<WizardProject>) => void;
  onDeleteProject: (projectId: string) => void;
  onEnhancePrompt?: (projectId: string) => Promise<void>;
  onEnhanceResearch?: (projectId: string) => Promise<void>;
  onGenerateTasksFromFeatures?: (projectId: string) => void;
  editingProjectId?: string | null;
  projectEditTab?: "prompt" | "research" | "features" | "details";
  onSetEditingProject?: (projectId: string | null, tab?: "prompt" | "research" | "features" | "details") => void;
  onClearCache?: () => void;
};

let selectedTaskId: string | null = null;
let editingTaskId: string | null = null;
let editingNoteId: string | null = null;
let draggedTaskId: string | null = null;
let showTaskModal: boolean = false;
let editingTask: Partial<WizardTask> | null = null;
let showCardActionsMenu: string | null = null; // Task ID for which card actions menu is open
let showListActionsMenu: string | null = null; // Status for which list actions menu is open
// editingProjectId and projectEditTab are now passed as props from the component state
let showTaskAuditLog: Record<string, boolean> = {}; // Track which tasks have audit log expanded
let listColors: Record<string, string> = {
  todo: "#a855f7",
  in_progress: "#f59e0b",
  testing: "#3b82f6",
  done: "#10b981",
  archived: "#92400e",
};

export function renderWizard(props: WizardProps) {
  if (!props.connected) {
    return html`
      <div class="card">
        <div class="card-title">Wizard Dashboard</div>
        <div class="card-sub">Connect to gateway to view project management dashboard.</div>
      </div>
    `;
  }

  const tasksByStatus = {
    todo: props.tasks.filter((t) => t.status === "todo"),
    in_progress: props.tasks.filter((t) => t.status === "in_progress"),
    testing: props.tasks.filter((t) => t.status === "testing"),
    done: props.tasks.filter((t) => t.status === "done"),
    archived: props.tasks.filter((t) => t.status === "archived"),
  };

  const selectedTask = selectedTaskId ? props.tasks.find((t) => t.id === selectedTaskId) : null;

  const handleAddNote = () => {
    const input = document.getElementById("wizard-note-input") as HTMLTextAreaElement;
    if (input && input.value.trim()) {
      props.onAddNote(input.value);
      input.value = "";
    }
  };

  const handleDragStart = (e: DragEvent, taskId: string) => {
    draggedTaskId = taskId;
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", taskId);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  };

  const handleDrop = (e: DragEvent, targetStatus: "todo" | "in_progress" | "testing" | "done" | "archived") => {
    e.preventDefault();
    if (draggedTaskId) {
      props.onUpdateTaskStatus(draggedTaskId, targetStatus);
      draggedTaskId = null;
    }
  };

  const renderTaskCard = (task: WizardTask, showDetails = false) => {
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";
    const completedChecklist = (task.checklist || []).filter((item) => item.completed).length;
    const totalChecklist = (task.checklist || []).length;

    return html`
      <div
        class="mc-task-card ${task.status === 'in_progress' ? 'mc-task-card--active' : ''}"
        draggable="true"
        @dragstart=${(e: DragEvent) => handleDragStart(e, task.id)}
        @click=${() => {
          selectedTaskId = task.id;
        }}
      >
        ${task.labels && task.labels.length > 0
          ? html`
              <div style="display: flex; gap: 0.25rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
                ${task.labels.map(
                  (labelId) => {
                    const label = getLabelById(labelId);
                    if (!label) return nothing;
                    return html`
                      <span
                        style="background: ${label.color}; color: white; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 600; text-transform: uppercase;"
                        title="${label.description}"
                      >
                        ${label.name}
                      </span>
                    `;
                  }
                )}
              </div>
            `
          : nothing}
        
        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-strong); line-height: 1.3; margin-bottom: 0.4rem; display: flex; justify-content: space-between; align-items: start;">
          <span>${task.title}</span>
          ${task.priority
            ? html`
                <span
                  style="color: ${getPriorityColor(task.priority)}; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; border: 1px solid ${getPriorityColor(task.priority)}; padding: 1px 4px; border-radius: 3px;"
                >
                  ${task.priority}
                </span>
              `
            : nothing}
        </div>

        ${task.description
          ? html`<div style="font-size: 0.8rem; color: var(--muted); margin-bottom: 0.75rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${task.description}</div>`
          : nothing}

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.5rem;">
          <div style="display: flex; gap: 8px;">
            ${totalChecklist > 0 ? html`<span style="font-size: 0.75rem; color: var(--muted-strong);">✓ ${completedChecklist}/${totalChecklist}</span>` : nothing}
            ${task.attachments?.length ? html`<span style="font-size: 0.75rem; color: var(--muted-strong);">📎 ${task.attachments.length}</span>` : nothing}
          </div>
          <div style="font-size: 0.7rem; font-family: var(--mono); opacity: 0.5;">
            ${formatAgo(new Date(task.createdAt).getTime())}
          </div>
        </div>
        
        <div style="position: absolute; top: 0.25rem; right: 0.25rem;">
          <button
            class="btn btn-xs"
            style="background: transparent; color: var(--muted); border: none; padding: 2px;"
            @click=${(e: Event) => {
              e.stopPropagation();
              showCardActionsMenu = showCardActionsMenu === task.id ? null : task.id;
            }}
          >
            ⋮
          </button>
        </div>
      </div>
    `;
  };

  const renderTaskEditorModal = () => {
    if (!showTaskModal) return nothing;
    
    const task = editingTask || {};
    const isNewTask = !task.id;
    
    return html`
      <div
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow: hidden;"
        @click=${(e: Event) => {
          if ((e.target as HTMLElement).style.position === "fixed") {
            showTaskModal = false;
            editingTask = null;
          }
        }}
      >
        <div
          style="background: #1f2937; border-radius: 0.75rem; width: 100%; max-width: min(700px, 95vw); height: 100%; max-height: min(90vh, calc(100vh - 2rem)); display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <!-- Header (fixed) -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #374151; flex-shrink: 0;">
            <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600; color: white;">
              ${isNewTask ? "Create New Task" : "Edit Task"}
            </h2>
            <button
              class="btn btn-sm"
              style="background: transparent; color: #9ca3af; font-size: 1.5rem; padding: 0.25rem 0.5rem; cursor: pointer;"
              @click=${() => {
                showTaskModal = false;
                editingTask = null;
              }}
            >
              ✕
            </button>
          </div>
          
          <!-- Scrollable Content Area -->
          <div style="flex: 1; overflow-y: auto; padding: 1.5rem;">

          <form
            @submit=${(e: Event) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const title = formData.get("title") as string;
              const description = formData.get("description") as string;
              const projectId = formData.get("projectId") as string;
              const priority = formData.get("priority") as "low" | "medium" | "high" | "";
              const dueDate = formData.get("dueDate") as string;
              // Get labels from hidden JSON input (from multi-select)
              const labelsJson = formData.get("labels-json") as string;
              let labels: string[] = [];
              if (labelsJson) {
                try {
                  labels = JSON.parse(labelsJson);
                } catch {
                  // Fallback to comma-separated if JSON parse fails
                  const labelsInput = formData.get("labels") as string;
                  labels = labelsInput
                    ? labelsInput.split(",").map((l) => l.trim()).filter(Boolean)
                    : [];
                }
              }
              
              if (!title.trim()) return;
              
              // Auto-suggest labels if none selected (for new tasks only) - only from predefined labels
              if (isNewTask && labels.length === 0 && title) {
                const text = `${title} ${description || ""}`.toLowerCase();
                const suggested: string[] = [];
                
                // Match against predefined labels only
                for (const label of PREDEFINED_LABELS) {
                  const keywords = label.description.toLowerCase() + " " + label.name.toLowerCase();
                  if (text.includes(label.id) || keywords.split(" ").some(kw => text.includes(kw))) {
                    suggested.push(label.id);
                  }
                }
                
                // Specific keyword matching for predefined labels
                if (text.match(/\b(bug|error|fix|broken|issue|crash)\b/)) suggested.push("bug");
                if (text.match(/\b(feature|add|implement|new|create|build)\b/)) suggested.push("feature");
                if (text.match(/\b(refactor|improve|optimize|cleanup)\b/)) suggested.push("refactor");
                if (text.match(/\b(test|testing|unit test|qa)\b/)) suggested.push("test");
                if (text.match(/\b(documentation|docs|readme|comment)\b/)) suggested.push("documentation");
                if (text.match(/\b(research|investigate|find out)\b/)) suggested.push("research");
                if (text.match(/\b(deploy|deployment|release|publish)\b/)) suggested.push("deployment");
                if (text.match(/\b(security|secure|vulnerability|auth|encryption)\b/)) suggested.push("security");
                
                labels = [...new Set(suggested.filter(id => PREDEFINED_LABELS.some(l => l.id === id)))]; // Only keep valid predefined labels
              }
              
              if (isNewTask) {
                props.onAddTask(
                  title,
                  description || undefined,
                  projectId || undefined,
                  priority || undefined,
                  dueDate || undefined,
                  labels.length > 0 ? labels : undefined
                );
              } else {
                props.onUpdateTask(task.id!, {
                  title,
                  description: description || undefined,
                  projectId: projectId || undefined,
                  priority: priority || undefined,
                  dueDate: dueDate || undefined,
                  labels,
                });
              }
              
              showTaskModal = false;
              editingTask = null;
            }}
          >
            <!-- Project Selector -->
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db; font-size: 0.875rem;">
                Project <span style="color: #ef4444;">*</span>
              </label>
              <select
                name="projectId"
                required
                style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; font-size: 1rem;"
                .value=${task.projectId || (props.projects.length > 0 ? props.projects[0].id : "")}
              >
                ${props.projects.length === 0
                  ? html`<option value="">No projects available. Create a project first.</option>`
                  : props.projects.map(
                      (project) => html`
                        <option value="${project.id}">${project.name}</option>
                      `
                    )}
              </select>
              ${props.projects.length === 0
                ? html`
                    <div style="margin-top: 0.5rem; padding: 0.75rem; background: rgba(239, 68, 68, 0.1); border-radius: 0.5rem; color: #fca5a5; font-size: 0.875rem;">
                      ⚠️ You must create a project before adding tasks. Tasks are saved as markdown files in project folders.
                    </div>
                  `
                : html`
                    <div style="margin-top: 0.5rem; color: #9ca3af; font-size: 0.75rem;">
                      💡 Task will be saved as <code style="background: rgba(0,0,0,0.3); padding: 0.125rem 0.25rem; border-radius: 0.25rem;">wizard-projects/{project-name}/tasks/{task-id}.md</code>
                    </div>
                  `}
            </div>

            <!-- Title -->
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db; font-size: 0.875rem;">
                Task Title <span style="color: #ef4444;">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                .value=${task.title || ""}
                placeholder="Enter task title..."
                style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; font-size: 1rem;"
                autofocus
              />
            </div>

            <!-- Description (Large Textarea) -->
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db; font-size: 0.875rem;">
                Description
              </label>
              <textarea
                name="description"
                .value=${task.description || ""}
                placeholder="Enter detailed task description... (Markdown supported)"
                rows="8"
                style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; font-size: 0.9375rem; font-family: inherit; resize: vertical; min-height: 150px;"
              ></textarea>
              <div style="margin-top: 0.5rem; color: #9ca3af; font-size: 0.75rem;">
                💡 This description will be saved as markdown in the task file. You can use markdown formatting.
              </div>
            </div>

            <!-- Priority and Due Date Row -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
              <!-- Priority -->
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db; font-size: 0.875rem;">
                  Priority
                </label>
                <select
                  name="priority"
                  style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; font-size: 1rem;"
                  .value=${task.priority || ""}
                >
                  <option value="">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <!-- Due Date -->
              <div>
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db; font-size: 0.875rem;">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  .value=${task.dueDate ? task.dueDate.split("T")[0] : ""}
                  style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; font-size: 1rem;"
                />
              </div>
            </div>

            <!-- Labels / Tags -->
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db; font-size: 0.875rem;">
                Labels <span style="color: #9ca3af; font-size: 0.75rem;">(Select from predefined list)</span>
              </label>
              <div style="position: relative;">
                <select
                  name="labels"
                  multiple
                  size="8"
                  style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; font-size: 0.875rem; min-height: 150px;"
                  @change=${(e: Event) => {
                    const select = e.target as HTMLSelectElement;
                    const selected = Array.from(select.selectedOptions).map(opt => opt.value);
                    // Store selected labels in a hidden input for form submission
                    const hiddenInput = document.querySelector('input[name="labels-json"]') as HTMLInputElement;
                    if (hiddenInput) {
                      hiddenInput.value = JSON.stringify(selected);
                    }
                  }}
                >
                  ${PREDEFINED_LABELS.map(
                    (label) => html`
                      <option
                        value="${label.id}"
                        ?selected=${(task.labels || []).includes(label.id)}
                        style="background: ${label.color}; color: white; padding: 0.5rem;"
                      >
                        ${label.name} - ${label.description}
                      </option>
                    `
                  )}
                </select>
                <input type="hidden" name="labels-json" .value=${JSON.stringify(task.labels || [])} />
                <div style="margin-top: 0.5rem; color: #9ca3af; font-size: 0.75rem;">
                  Hold Ctrl/Cmd (Windows) or Cmd (Mac) to select multiple labels. Only these predefined labels can be used.
                </div>
                <!-- Show selected labels with colors -->
                ${(task.labels || []).length > 0
                  ? html`
                      <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${(task.labels || []).map((labelId) => {
                          const label = getLabelById(labelId);
                          if (!label) return nothing;
                          return html`
                            <span
                              style="background: ${label.color}; color: white; padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500; display: inline-flex; align-items: center; gap: 0.25rem;"
                            >
                              ${label.name}
                            </span>
                          `;
                        })}
                      </div>
                    `
                  : nothing}
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #374151;">
              <button
                type="button"
                class="btn"
                style="background: transparent; border: 1px solid #374151; color: #9ca3af; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; font-weight: 500;"
                @click=${() => {
                  showTaskModal = false;
                  editingTask = null;
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                class="btn"
                style="background: #a855f7; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; font-weight: 600; min-width: 120px;"
              >
                ${isNewTask ? "Create Task" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  };

  const renderTaskDetailModal = () => {
    if (!selectedTask) return nothing;

    return html`
      <div
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow: hidden;"
        @click=${(e: Event) => {
          if ((e.target as HTMLElement).style.position === "fixed") {
            selectedTaskId = null;
          }
        }}
      >
        <div
          style="background: #1f2937; border-radius: 0.75rem; width: 100%; max-width: min(700px, 95vw); height: 100%; max-height: min(90vh, calc(100vh - 2rem)); display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <!-- Header (fixed) -->
          <div style="display: flex; justify-content: space-between; align-items: start; padding: 1.5rem; border-bottom: 1px solid #374151; flex-shrink: 0;">
            <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600;">
              ${editingTaskId === selectedTask.id
                ? html`
                    <input
                      type="text"
                      .value=${selectedTask.title}
                      @blur=${(e: Event) => {
                        props.onUpdateTask(selectedTask.id, { title: (e.target as HTMLInputElement).value });
                        editingTaskId = null;
                      }}
                      @keydown=${(e: KeyboardEvent) => {
                        if (e.key === "Enter") {
                          (e.target as HTMLInputElement).blur();
                        }
                      }}
                      style="background: transparent; border: 1px solid #374151; color: white; padding: 0.5rem; border-radius: 0.25rem; width: 100%; font-size: 1.5rem;"
                      autofocus
                    />
                  `
                : html`
                    <span
                      @click=${() => {
                        editingTaskId = selectedTask.id;
                      }}
                      style="cursor: pointer;"
                    >
                      ${selectedTask.title}
                    </span>
                  `}
            </h2>
            <button
              class="btn btn-sm"
              style="background: transparent; color: #9ca3af; cursor: pointer;"
              @click=${() => {
                selectedTaskId = null;
              }}
            >
              ✕
            </button>
          </div>
          
          <!-- Scrollable Content Area -->
          <div style="flex: 1; overflow-y: auto; padding: 1.5rem;">

          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #9ca3af;">Description</label>
            ${editingTaskId === selectedTask.id
              ? html`
                  <textarea
                    .value=${selectedTask.description || ""}
                    @blur=${(e: Event) => {
                      props.onUpdateTask(selectedTask.id, { description: (e.target as HTMLTextAreaElement).value });
                      editingTaskId = null;
                    }}
                    style="background: transparent; border: 1px solid #374151; color: white; padding: 0.5rem; border-radius: 0.25rem; width: 100%; min-height: 100px;"
                    autofocus
                  ></textarea>
                `
              : html`
                  <div
                    @click=${() => {
                      editingTaskId = selectedTask.id;
                    }}
                    style="padding: 0.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 0.25rem; cursor: pointer; min-height: 50px;"
                  >
                    ${selectedTask.description || html`<span style="color: #9ca3af;">Add a description...</span>`}
                  </div>
                `}
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #9ca3af;">Due Date</label>
            <input
              type="date"
              .value=${selectedTask.dueDate ? selectedTask.dueDate.split("T")[0] : ""}
              @change=${(e: Event) => {
                const value = (e.target as HTMLInputElement).value;
                props.onUpdateTask(selectedTask.id, { dueDate: value ? new Date(value).toISOString() : undefined });
              }}
              style="background: transparent; border: 1px solid #374151; color: white; padding: 0.5rem; border-radius: 0.25rem;"
            />
          </div>

          <!-- Project Info -->
          ${selectedTask.projectId
            ? html`
                <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border-left: 3px solid #a855f7;">
                  <div style="font-weight: 500; color: #d1d5db; margin-bottom: 0.25rem; font-size: 0.875rem;">📁 Project</div>
                  <div style="color: #a855f7; font-size: 0.875rem;">
                    ${props.projects.find((p) => p.id === selectedTask.projectId)?.name || "Unknown Project"}
                  </div>
                </div>
              `
            : nothing}
          
          <!-- Creator & Worker Info -->
          <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 3px solid #3b82f6;">
            ${selectedTask.createdBy
              ? html`
                  <div style="margin-bottom: 0.5rem;">
                    <div style="font-weight: 500; color: #d1d5db; margin-bottom: 0.25rem; font-size: 0.875rem;">👤 Created By</div>
                    <div style="color: #3b82f6; font-size: 0.875rem;">
                      ${selectedTask.createdBy.agentName} <span style="color: #9ca3af;">(${selectedTask.createdBy.agentType})</span>
                    </div>
                  </div>
                `
              : nothing}
            ${selectedTask.workedBy && selectedTask.workedBy.length > 0
              ? html`
                  <div>
                    <div style="font-weight: 500; color: #d1d5db; margin-bottom: 0.25rem; font-size: 0.875rem;">⚡ Worked On By</div>
                    <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                      ${selectedTask.workedBy.map(
                        (worker) => html`
                          <div style="color: #3b82f6; font-size: 0.875rem;">
                            ${worker.agentName} <span style="color: #9ca3af;">(${worker.agentType})</span>
                            <span style="color: #6b7280; font-size: 0.75rem; margin-left: 0.5rem;">
                              ${formatAgo(new Date(worker.workedAt).getTime())}
                            </span>
                          </div>
                        `
                      )}
                    </div>
                  </div>
                `
              : nothing}
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #9ca3af;">Labels</label>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
              ${(selectedTask.labels || []).map(
                (labelId) => {
                  const label = getLabelById(labelId);
                  if (!label) return nothing;
                  return html`
                    <span
                      style="background: ${label.color}; color: white; padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;"
                      title="${label.description}"
                    >
                      ${label.name}
                      <button
                        @click=${() => {
                          props.onUpdateTask(selectedTask.id, {
                            labels: (selectedTask.labels || []).filter((l) => l !== labelId),
                          });
                        }}
                        style="background: transparent; border: none; color: white; cursor: pointer; padding: 0; font-size: 1rem; font-weight: bold;"
                      >
                        ×
                      </button>
                    </span>
                  `;
                }
              )}
            </div>
            <select
              multiple
              size="5"
              style="background: #111827; border: 1px solid #374151; color: white; padding: 0.5rem; border-radius: 0.25rem; width: 100%; font-size: 0.875rem;"
              @change=${(e: Event) => {
                const select = e.target as HTMLSelectElement;
                const selected = Array.from(select.selectedOptions).map(opt => opt.value);
                const currentLabels = selectedTask.labels || [];
                const newLabels = [...new Set([...currentLabels, ...selected])];
                props.onUpdateTask(selectedTask.id, { labels: newLabels });
                // Clear selection
                Array.from(select.options).forEach(opt => opt.selected = false);
              }}
            >
              ${PREDEFINED_LABELS.filter((label) => !(selectedTask.labels || []).includes(label.id)).map(
                (label) => html`
                  <option value="${label.id}" style="background: ${label.color}; color: white;">
                    ${label.name} - ${label.description}
                  </option>
                `
              )}
            </select>
            <div style="margin-top: 0.5rem; color: #9ca3af; font-size: 0.75rem;">
              Select labels to add. Hold Ctrl/Cmd to select multiple. Only predefined labels can be used.
            </div>
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #9ca3af;">Checklist</label>
            ${(selectedTask.checklist || []).map(
              (item) => html`
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <input
                    type="checkbox"
                    .checked=${item.completed}
                    @change=${(e: Event) => {
                      props.onUpdateChecklistItem(selectedTask.id, item.id, {
                        completed: (e.target as HTMLInputElement).checked,
                      });
                    }}
                  />
                  <input
                    type="text"
                    .value=${item.text}
                    @blur=${(e: Event) => {
                      props.onUpdateChecklistItem(selectedTask.id, item.id, {
                        text: (e.target as HTMLInputElement).value,
                      });
                    }}
                    style="background: transparent; border: 1px solid #374151; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; flex: 1; text-decoration: ${item.completed ? "line-through" : "none"}; opacity: ${item.completed ? 0.6 : 1};"
                  />
                  <button
                    @click=${() => {
                      props.onDeleteChecklistItem(selectedTask.id, item.id);
                    }}
                    style="background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 0.25rem;"
                  >
                    ×
                  </button>
                </div>
              `
            )}
            <input
              type="text"
              placeholder="Add checklist item (press Enter)"
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  const input = e.target as HTMLInputElement;
                  const text = input.value.trim();
                  if (text) {
                    props.onAddTaskChecklistItem(selectedTask.id, text);
                    input.value = "";
                  }
                }
              }}
              style="background: transparent; border: 1px solid #374151; color: white; padding: 0.5rem; border-radius: 0.25rem; width: 100%;"
            />
          </div>

          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #9ca3af;">Attachments</label>
            ${selectedTask.attachments && selectedTask.attachments.length > 0
              ? html`
                  <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.5rem;">
                    ${selectedTask.attachments.map(
                      (att) => html`
                        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 0.25rem;">
                          ${att.type === "image"
                            ? html`<img src="${att.url}" alt="${att.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 0.25rem;" />`
                            : html`<span>📎</span>`}
                          <span style="flex: 1;">${att.name}</span>
                          <a href="${att.url}" target="_blank" style="color: #a855f7; text-decoration: none;">View</a>
                        </div>
                      `
                    )}
                  </div>
                `
              : nothing}
            <label
              style="display: inline-block; padding: 0.5rem 1rem; background: #a855f7; color: white; border-radius: 0.25rem; cursor: pointer;"
            >
              📎 Add Attachment
              <input
                type="file"
                accept="image/*"
                style="display: none;"
                @change=${(e: Event) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    props.onAddTaskAttachment(selectedTask.id, file);
                  }
                }}
              />
            </label>
          </div>

          <!-- Audit Log & Validation Section (Collapsible) -->
          <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 2px solid #374151;">
            <button
              @click=${() => {
                showTaskAuditLog[selectedTask.id] = !showTaskAuditLog[selectedTask.id];
              }}
              style="width: 100%; display: flex; align-items: center; justify-content: space-between; background: transparent; border: 1px solid #374151; color: #d1d5db; padding: 0.75rem 1rem; border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem; font-weight: 500;"
            >
              <span>📋 Audit Log & Validation</span>
              <span>${showTaskAuditLog[selectedTask.id] ? "▼" : "▶"}</span>
            </button>
            
            ${showTaskAuditLog[selectedTask.id]
              ? html`
                  <div style="margin-top: 1rem; padding: 1rem; background: rgba(0, 0, 0, 0.3); border-radius: 0.5rem;">
                    <!-- Edit Log -->
                    <div style="margin-bottom: 1.5rem;">
                      <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; font-weight: 600; color: #d1d5db;">Edit History</h3>
                      ${selectedTask.editLog && selectedTask.editLog.length > 0
                        ? html`
                            <div style="display: flex; flex-direction: column; gap: 0.75rem; max-height: 300px; overflow-y: auto;">
                              ${selectedTask.editLog.map(
                                (log) => html`
                                  <div style="padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border-radius: 0.25rem; border-left: 3px solid #a855f7;">
                                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                                      <div>
                                        <div style="font-weight: 600; color: #d1d5db; font-size: 0.875rem;">
                                          ${log.agentName} <span style="color: #9ca3af; font-weight: normal;">(${log.agentType})</span>
                                        </div>
                                        <div style="color: #9ca3af; font-size: 0.75rem; margin-top: 0.25rem;">
                                          ${new Date(log.timestamp).toLocaleString()}
                                        </div>
                                      </div>
                                      <span style="background: ${log.agentType.includes("llm") ? "#3b82f6" : log.agentType.includes("agent") ? "#10b981" : "#6b7280"}; color: white; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.625rem; font-weight: 600; text-transform: uppercase;">
                                        ${log.agentType}
                                      </span>
                                    </div>
                                    <div style="color: #d1d5db; font-size: 0.8125rem;">
                                      <strong>${log.action}</strong>${log.description ? `: ${log.description}` : ""}
                                    </div>
                                    ${log.field
                                      ? html`
                                          <div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(0, 0, 0, 0.3); border-radius: 0.25rem; font-size: 0.75rem; color: #9ca3af;">
                                            <div><strong>Field:</strong> ${log.field}</div>
                                            ${log.oldValue ? html`<div><strong>From:</strong> ${log.oldValue}</div>` : nothing}
                                            ${log.newValue ? html`<div><strong>To:</strong> ${log.newValue}</div>` : nothing}
                                          </div>
                                        `
                                      : nothing}
                                  </div>
                                `,
                              )}
                            </div>
                          `
                        : html`<div style="color: #9ca3af; font-size: 0.875rem; font-style: italic;">No edit history yet</div>`}
                    </div>

                    <!-- Validation Checks -->
                    <div>
                      <h3 style="margin: 0 0 0.75rem 0; font-size: 1rem; font-weight: 600; color: #d1d5db;">Validation Status</h3>
                      ${selectedTask.validations && selectedTask.validations.length > 0
                        ? html`
                            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                              ${selectedTask.validations.map(
                                (val) => html`
                                  <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(255, 255, 255, 0.05); border-radius: 0.25rem;">
                                    <span style="font-size: 1.25rem;">${val.isValid ? "✅" : "❌"}</span>
                                    <div style="flex: 1;">
                                      <div style="font-weight: 500; color: #d1d5db; font-size: 0.875rem; text-transform: capitalize;">
                                        ${val.section}
                                      </div>
                                      <div style="color: #9ca3af; font-size: 0.75rem; margin-top: 0.25rem;">
                                        ${val.message || ""}
                                      </div>
                                    </div>
                                    <div style="color: #6b7280; font-size: 0.625rem; text-align: right;">
                                      ${new Date(val.checkedAt).toLocaleString()}
                                    </div>
                                  </div>
                                `,
                              )}
                            </div>
                          `
                        : html`<div style="color: #9ca3af; font-size: 0.875rem; font-style: italic;">No validations run yet</div>`}
                    </div>

                    ${selectedTask.filePath
                      ? html`
                          <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(16, 185, 129, 0.1); border-radius: 0.25rem; border-left: 3px solid #10b981;">
                            <div style="color: #10b981; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem;">📄 Task File</div>
                            <div style="color: #9ca3af; font-size: 0.75rem; font-family: monospace;">${selectedTask.filePath}</div>
                          </div>
                        `
                      : nothing}
                  </div>
                `
              : nothing}
          </div>
          <!-- End Scrollable Content Area -->
        </div>
      </div>
    `;
  };

  return html`
    <style>
      .task-card:hover {
        background: rgba(168, 85, 247, 0.15) !important;
      }
      .task-card:active {
        cursor: grabbing;
      }
      .column-drop-zone {
        min-height: 100px;
        border-radius: 0.5rem;
        transition: background 0.2s;
      }
      .column-drop-zone.drag-over {
        background: rgba(168, 85, 247, 0.2);
      }
    </style>
    <div class="wizard-dashboard">
      <!-- Projects Section -->
      <div class="card" style="margin-bottom: 1rem;">
        <div class="card-title" style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>
              <span>📁</span> Projects (${props.projects.length})
            </span>
            <button
              class="btn btn-xs"
              style="background: transparent; color: #9ca3af; padding: 0.25rem;"
              title="About Projects"
              @click=${() => {
                alert(`Projects organize your work into separate contexts.\n\nEach project:\n- Creates its own folder structure (tasks, agents, research, logs, media, debug)\n- Can have its own GitHub repository\n- Can use a different LLM model\n- Can require manual approval for task progression\n- Stores tasks as individual markdown files\n\nProjects help agents understand context and work more effectively.`);
              }}
            >
              ❓
            </button>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            ${props.onClearCache
              ? html`
                  <button
                    class="btn btn-sm"
                    style="background: transparent; color: #9ca3af; border: 1px solid #374151;"
                    @click=${() => props.onClearCache?.()}
                    title="Clear all cached wizard data and reload page"
                  >
                    🗑️ Clear Cache
                  </button>
                `
              : nothing}
            <button
              class="btn btn-sm"
              @click=${() => {
                const name = prompt("Project name:");
                if (name) {
                  const description = prompt("Project description (optional):");
                  props.onAddProject(name, description || undefined);
                }
              }}
            >
              + Add Project
            </button>
          </div>
        </div>
        <div class="card-sub" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem;">
          ${props.projects.map(
            (project) => html`
              <div style="padding: 1rem; background: rgba(255, 255, 255, 0.05); border-radius: 0.5rem; border: 1px solid rgba(168, 85, 247, 0.2);">
                <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 0.5rem;">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">${project.name}</div>
                    ${project.description
                      ? html`<div style="font-size: 0.875rem; color: #9ca3af; margin-bottom: 0.5rem;">${project.description}</div>`
                      : nothing}
                  </div>
                  <div style="display: flex; gap: 0.25rem;">
                    <button
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        props.onSetEditingProject?.(project.id, "details");
                      }}
                      style="background: transparent; border: none; color: #a855f7; cursor: pointer; padding: 0.25rem; font-size: 0.875rem;"
                      title="Edit project"
                    >
                      ✏️
                    </button>
                    <button
                      @click=${() => {
                        if (confirm(`Delete project "${project.name}"?`)) {
                          props.onDeleteProject(project.id);
                        }
                      }}
                      style="background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 0.25rem; font-size: 1.25rem; font-weight: bold;"
                    >
                      ×
                    </button>
                  </div>
                </div>
                ${project.githubRepo
                  ? html`
                      <div style="margin-bottom: 0.5rem;">
                        <a href="${project.githubRepo}" target="_blank" style="color: #a855f7; text-decoration: none; font-size: 0.875rem;">
                          🔗 GitHub: ${project.githubRepo.replace("https://github.com/", "")}
                        </a>
                      </div>
                    `
                  : html`<div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem;">No GitHub repo</div>`}
                ${project.devServerUrl
                  ? html`
                      <div style="margin-bottom: 0.5rem;">
                        <a href="${project.devServerUrl}" target="_blank" style="color: #10b981; text-decoration: none; font-size: 0.875rem;">
                          🚀 Dev Server: ${project.devServerUrl}
                        </a>
                      </div>
                    `
                  : html`<div style="font-size: 0.75rem; color: #6b7280; margin-bottom: 0.5rem;">No dev server</div>`}
                <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem;">
                  ${props.onGenerateTasksFromFeatures
                    ? html`
                        <button
                          class="btn btn-sm"
                          style="background: #a855f7; color: #f9fafb; font-weight: 600; flex: 0 0 auto;"
                          @click=${() => props.onGenerateTasksFromFeatures?.(project.id)}
                        >
                          ⚙ Generate tasks from features
                        </button>
                      `
                    : nothing}
                </div>
                <div style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.5rem;">
                  Status: ${project.status} • Created ${formatAgo(new Date(project.createdAt).getTime())}
                </div>
              </div>
            `
          )}
          ${props.projects.length === 0
            ? html`<div style="font-size: 0.875rem; color: #9ca3af; text-align: center; padding: 2rem; grid-column: 1 / -1;">
                No projects yet. Create a project to get started!
              </div>`
            : nothing}
        </div>
      </div>

      <!-- Active Operations Bar (Mission Control Style) -->
      <div class="card" style="margin-bottom: 1.5rem; background: var(--bg-accent); border-bottom: 2px solid var(--accent-subtle);">
        <div style="display: flex; align-items: center; justify-content: space-between;">
           <div style="display: flex; align-items: center; gap: 1rem;">
             <div class="mc-agent-badge ${tasksByStatus.in_progress.length > 0 ? 'mc-agent-badge--working' : ''}">
               <span class="mc-status-indicator ${tasksByStatus.in_progress.length > 0 ? 'mc-status-indicator--working' : ''}" style="background: ${tasksByStatus.in_progress.length > 0 ? 'var(--ok)' : 'var(--muted)'};"></span>
               ${tasksByStatus.in_progress.length > 0 ? 'SYSTEM ACTIVE' : 'SYSTEM IDLE'}
             </div>
             
             ${tasksByStatus.in_progress.length > 0 
               ? html`
                   <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text);">
                     <span style="opacity: 0.6;">Executing:</span>
                     <span style="font-weight: 600;">${tasksByStatus.in_progress[0].title}</span>
                     ${tasksByStatus.in_progress.length > 1 ? html`<span class="muted" style="font-size: 0.75rem;">+${tasksByStatus.in_progress.length - 1} more</span>` : nothing}
                   </div>
                 `
               : html`<div style="font-size: 0.85rem; color: var(--muted);">Standing by for task assignment...</div>`
             }
           </div>

           <div style="display: flex; gap: 1rem; align-items: center;">
             <div style="display: flex; flex-direction: column; align-items: flex-end;">
               <div style="font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em;">Throughput</div>
               <div style="font-size: 0.9rem; font-weight: 700; font-family: var(--mono); color: var(--ok);">
                 ${tasksByStatus.done.length} <span style="font-size: 0.7rem; font-weight: 400; opacity: 0.7;">COMPLETED</span>
               </div>
             </div>
             
             <div style="width: 1px; height: 24px; background: var(--border);"></div>

             <div style="display: flex; flex-direction: column; align-items: flex-end;">
               <div style="font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em;">Efficiency</div>
               <div style="font-size: 0.9rem; font-weight: 700; font-family: var(--mono); color: var(--accent);">
                 ${tasksByStatus.todo.length + tasksByStatus.in_progress.length + tasksByStatus.testing.length} <span style="font-size: 0.7rem; font-weight: 400; opacity: 0.7;">PENDING</span>
               </div>
             </div>
           </div>
        </div>
      </div>

      <!-- Wizard Board (Kanban-style) -->
      <div
        class="wizard-board"
        style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; margin-bottom: 1rem;"
        @click=${() => {
          showCardActionsMenu = null;
          showListActionsMenu = null;
        }}
      >
        <!-- To Do Column -->
        <div class="card" style="position: relative; background: var(--chrome);">
          <div class="mc-column-header" style="border-top: 2px solid ${listColors.todo}; color: ${listColors.todo};">
            <span>TO DO</span>
            <span class="mc-agent-badge">${tasksByStatus.todo.length}</span>
          </div>
          
          <div
            class="column-drop-zone"
            @dragover=${handleDragOver}
            @drop=${(e: DragEvent) => handleDrop(e, "todo")}
            style="min-height: 200px;"
          >
            ${tasksByStatus.todo.map((task) => renderTaskCard(task))}
            ${tasksByStatus.todo.length === 0
              ? html`<div style="font-size: 0.8rem; color: var(--muted); text-align: center; padding: 2rem; border: 1px dashed var(--border); border-radius: var(--radius-md); opacity: 0.5;">Empty</div>`
              : nothing}
            <button
              class="btn btn-sm"
              style="width: 100%; margin-top: 0.5rem; background: transparent; border-style: dashed;"
              @click=${() => {
                editingTask = { status: "todo" };
                showTaskModal = true;
              }}
            >
              + Add New
            </button>
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="card" style="position: relative; background: var(--chrome);">
          <div class="mc-column-header" style="border-top: 2px solid ${listColors.in_progress}; color: ${listColors.in_progress};">
            <span>IN PROGRESS</span>
            <span class="mc-agent-badge mc-agent-badge--working">
               <span class="mc-status-indicator mc-status-indicator--working"></span>
               ${tasksByStatus.in_progress.length}
            </span>
          </div>
          <div
            class="column-drop-zone"
            @dragover=${handleDragOver}
            @drop=${(e: DragEvent) => handleDrop(e, "in_progress")}
            style="min-height: 200px;"
          >
            ${tasksByStatus.in_progress.map((task) => renderTaskCard(task))}
            ${tasksByStatus.in_progress.length === 0
              ? html`<div style="font-size: 0.8rem; color: var(--muted); text-align: center; padding: 2rem; border: 1px dashed var(--border); border-radius: var(--radius-md); opacity: 0.5;">No active units</div>`
              : nothing}
          </div>
        </div>

        <!-- Testing Column -->
        <div class="card" style="position: relative; background: var(--chrome);">
          <div class="mc-column-header" style="border-top: 2px solid ${listColors.testing}; color: ${listColors.testing};">
            <span>TESTING</span>
            <span class="mc-agent-badge">${tasksByStatus.testing.length}</span>
          </div>
          <div
            class="column-drop-zone"
            @dragover=${handleDragOver}
            @drop=${(e: DragEvent) => handleDrop(e, "testing")}
            style="min-height: 200px;"
          >
            ${tasksByStatus.testing.map((task) => renderTaskCard(task))}
            ${tasksByStatus.testing.length === 0
              ? html`<div style="font-size: 0.8rem; color: var(--muted); text-align: center; padding: 2rem; border: 1px dashed var(--border); border-radius: var(--radius-md); opacity: 0.5;">Stable</div>`
              : nothing}
          </div>
        </div>

        <!-- Done Column -->
        <div class="card" style="position: relative; background: var(--chrome);">
          <div class="mc-column-header" style="border-top: 2px solid ${listColors.done}; color: ${listColors.done};">
            <span>COMPLETED</span>
            <span class="mc-agent-badge">${tasksByStatus.done.length}</span>
          </div>
          <div
            class="column-drop-zone"
            @dragover=${handleDragOver}
            @drop=${(e: DragEvent) => handleDrop(e, "done")}
            style="min-height: 200px;"
          >
            ${tasksByStatus.done.map((task) => renderTaskCard(task))}
            ${tasksByStatus.done.length === 0
              ? html`<div style="font-size: 0.8rem; color: var(--muted); text-align: center; padding: 2rem; border: 1px dashed var(--border); border-radius: var(--radius-md); opacity: 0.5;">Archive pending</div>`
              : nothing}
          </div>
        </div>

        <!-- Archived Column -->
        <div class="card" style="position: relative; background: var(--chrome);">
          <div class="mc-column-header" style="border-top: 2px solid ${listColors.archived}; color: ${listColors.archived};">
            <span>VAULT</span>
            <span class="mc-agent-badge">${tasksByStatus.archived.length}</span>
          </div>
          <div
            class="column-drop-zone"
            @dragover=${handleDragOver}
            @drop=${(e: DragEvent) => handleDrop(e, "archived")}
            style="min-height: 200px;"
          >
            ${tasksByStatus.archived.map((task) => renderTaskCard(task))}
            ${tasksByStatus.archived.length === 0
              ? html`<div style="font-size: 0.8rem; color: var(--muted); text-align: center; padding: 2rem; border: 1px dashed var(--border); border-radius: var(--radius-md); opacity: 0.5;">Clean</div>`
              : nothing}
          </div>
        </div>
      </div>

      <!-- Bottom Sections -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
        <!-- Deliverables -->
        <div class="card">
          <div class="card-title">
            <span>📁</span> Deliverables (${props.deliverables.length})
          </div>
          <div class="card-sub">
            ${props.deliverables.slice(-5).reverse().map(
              (deliverable) => html`
                <div style="padding: 0.75rem; margin-bottom: 0.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 0.5rem;">
                  <div style="font-weight: 500;">${deliverable.title}</div>
                  <div style="font-size: 0.875rem; color: #9ca3af; margin-top: 0.25rem;">
                    ${deliverable.type} • ${formatAgo(new Date(deliverable.createdAt).getTime())}
                  </div>
                  ${deliverable.url
                    ? html`<a href="${deliverable.url}" target="_blank" style="font-size: 0.875rem; color: #a855f7; margin-top: 0.25rem; display: block;">View →</a>`
                    : nothing}
                </div>
              `
            )}
            ${props.deliverables.length === 0
              ? html`<div style="font-size: 0.875rem; color: #9ca3af; text-align: center; padding: 1rem;">No deliverables yet</div>`
              : nothing}
          </div>
        </div>

        <!-- Notes for AI Agent -->
        <div class="card">
          <div class="card-title">
            <span>📝</span> Notes for Agent (${props.notes.length})
          </div>
          <div class="card-sub">
            <div style="margin-bottom: 0.5rem; font-size: 0.875rem; color: #9ca3af;">
              Add tasks here — Agent checks on every heartbeat
            </div>
            ${props.notes.slice(-5).reverse().map(
              (note) => html`
                <div style="padding: 0.5rem; margin-bottom: 0.5rem; background: rgba(255, 255, 255, 0.1); border-radius: 0.5rem; font-size: 0.875rem; position: relative;">
                  ${editingNoteId === note.id
                    ? html`
                        <textarea
                          .value=${note.content}
                          @blur=${(e: Event) => {
                            props.onUpdateNote(note.id, (e.target as HTMLTextAreaElement).value);
                            editingNoteId = null;
                          }}
                          @keydown=${(e: KeyboardEvent) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                              (e.target as HTMLTextAreaElement).blur();
                            }
                          }}
                          style="background: #ffffff; border: 1px solid #374151; color: #1f2937; padding: 0.5rem; border-radius: 0.25rem; width: 100%; min-height: 60px;"
                          autofocus
                        ></textarea>
                      `
                    : html`
                        <div
                          @click=${() => {
                            editingNoteId = note.id;
                          }}
                          style="cursor: pointer; color: #1f2937; font-weight: 500;"
                        >
                          ${note.content}
                        </div>
                      `}
                  <div style="color: #6b7280; font-size: 0.75rem; margin-top: 0.25rem;">
                    ${formatAgo(new Date(note.createdAt).getTime())}
                  </div>
                  <button
                    @click=${() => {
                      props.onDeleteNote(note.id);
                    }}
                    style="position: absolute; top: 0.5rem; right: 0.5rem; background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 0.25rem; font-size: 1.25rem; font-weight: bold;"
                  >
                    ×
                  </button>
                </div>
              `
            )}
            <textarea
              id="wizard-note-input"
              class="input"
              placeholder="Type a task or note for Agent..."
              style="width: 100%; min-height: 80px; margin-bottom: 0.5rem;"
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  handleAddNote();
                }
              }}
            ></textarea>
            <button
              class="btn btn-sm"
              style="width: 100%; background: #a855f7; color: #f9fafb; font-weight: 600;"
              @click=${handleAddNote}
            >
              Add Note
            </button>
          </div>
        </div>

        <!-- Action Log -->
        <div class="card">
          <div class="card-title">
            <span>📋</span> Action Log (${props.actionLog.length})
          </div>
          <div class="card-sub" style="max-height: 300px; overflow-y: auto;">
            ${props.actionLog.slice(-10).reverse().map(
              (entry) => html`
                <div style="padding: 0.5rem; margin-bottom: 0.25rem; font-size: 0.875rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                  <div style="color: #9ca3af; font-size: 0.75rem;">${formatAgo(new Date(entry.createdAt).getTime())}</div>
                  <div style="margin-top: 0.25rem; font-weight: 500;">${entry.action}</div>
                  ${entry.description ? html`<div style="margin-top: 0.25rem; color: #9ca3af;">${entry.description}</div>` : nothing}
                </div>
              `
            )}
            ${props.actionLog.length === 0
              ? html`<div style="font-size: 0.875rem; color: #9ca3af; text-align: center; padding: 1rem;">No actions yet</div>`
              : nothing}
          </div>
        </div>
      </div>

      ${renderTaskEditorModal()}
      ${renderTaskDetailModal()}
      ${renderProjectEditorModal(props.editingProjectId || null, props.projectEditTab || "details", props, () => { props.onSetEditingProject?.(null); }, (tab) => { props.onSetEditingProject?.(props.editingProjectId || null, tab); })}
      ${renderAgentMonitoringWindows(props)}
      
      <!-- Footer Attribution -->
      <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #374151; text-align: center;">
        <div style="color: #9ca3af; font-size: 0.875rem;">
          Created by{" "}
          <a
            href="https://github.com/David2024patton"
            target="_blank"
            rel="noopener noreferrer"
            style="color: #a855f7; text-decoration: none; font-weight: 500;"
          >
            David Patton
          </a>{" "}
          with ❤️ for the AI community
        </div>
        <div style="margin-top: 0.5rem;">
          <a
            href="https://github.com/David2024patton/openclaw"
            target="_blank"
            rel="noopener noreferrer"
            style="color: #a855f7; text-decoration: none; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.25rem;"
          >
            <span>🔗</span>
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    </div>
    </div>
  `;
}

function getLabelColor(labelId: string): string {
  const label = getLabelById(labelId);
  return label?.color || "#6b7280"; // Default gray if label not found
}

function getLabelName(labelId: string): string {
  const label = getLabelById(labelId);
  return label?.name || labelId; // Fallback to ID if label not found
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "high":
      return "#ef4444";
    case "medium":
      return "#f59e0b";
    case "low":
      return "#10b981";
    default:
      return "#6b7280";
  }
}

