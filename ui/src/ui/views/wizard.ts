import { html, nothing } from "lit";
import type { SessionsListResult } from "../types";
import { formatAgo } from "../format";

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
  onUpdateTask: (taskId: string, updates: Partial<{ title: string; description: string; status: "todo" | "in_progress" | "testing" | "done" | "archived"; priority: "low" | "medium" | "high"; dueDate: string; labels: string[]; projectId: string }>) => void;
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
};

let selectedTaskId: string | null = null;
let editingTaskId: string | null = null;
let editingNoteId: string | null = null;
let draggedTaskId: string | null = null;
let showTaskModal: boolean = false;
let editingTask: Partial<WizardTask> | null = null;
let showCardActionsMenu: string | null = null; // Task ID for which card actions menu is open
let showListActionsMenu: string | null = null; // Status for which list actions menu is open
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
        class="task-card"
        draggable="true"
        @dragstart=${(e: DragEvent) => handleDragStart(e, task.id)}
        style="padding: 0.75rem; margin-bottom: 0.5rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; cursor: grab; position: relative;"
        @click=${() => {
          selectedTaskId = task.id;
        }}
      >
        ${task.labels && task.labels.length > 0
          ? html`
              <div style="display: flex; gap: 0.25rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
                ${task.labels.map(
                  (label) => html`
                    <span
                      style="background: ${getLabelColor(label)}; color: white; padding: 0.125rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 500;"
                    >
                      ${label}
                    </span>
                  `
                )}
              </div>
            `
          : nothing}
        <div style="font-weight: 500; display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.25rem;">
          <span>${task.title}</span>
          <div style="display: flex; gap: 0.25rem;">
            ${task.priority
              ? html`
                  <span
                    style="background: ${getPriorityColor(task.priority)}; color: white; padding: 0.125rem 0.375rem; border-radius: 0.25rem; font-size: 0.625rem; font-weight: 600;"
                  >
                    ${task.priority.toUpperCase()}
                  </span>
                `
              : nothing}
            <button
              class="btn btn-xs"
              style="background: transparent; color: #ef4444; padding: 0.25rem;"
              @click=${(e: Event) => {
                e.stopPropagation();
                props.onDeleteTask(task.id);
              }}
            >
              ×
            </button>
          </div>
        </div>
        ${task.description
          ? html`<div style="font-size: 0.875rem; color: #9ca3af; margin-bottom: 0.5rem;">${task.description}</div>`
          : nothing}
        ${task.dueDate
          ? html`
              <div
                style="font-size: 0.75rem; color: ${isOverdue ? "#ef4444" : "#9ca3af"}; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.25rem;"
              >
                <span>📅</span>
                <span>${new Date(task.dueDate).toLocaleDateString()}</span>
                ${isOverdue ? html`<span style="color: #ef4444;">⚠ Overdue</span>` : nothing}
              </div>
            `
          : nothing}
        ${totalChecklist > 0
          ? html`
              <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem;">
                ✓ ${completedChecklist}/${totalChecklist} checklist items
              </div>
            `
          : nothing}
        ${task.attachments && task.attachments.length > 0
          ? html`
              <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem;">
                📎 ${task.attachments.length} attachment${task.attachments.length > 1 ? "s" : ""}
              </div>
            `
          : nothing}
        <div style="font-size: 0.75rem; color: #9ca3af; margin-top: 0.25rem;">${formatAgo(new Date(task.createdAt).getTime())}</div>
        <div style="position: absolute; top: 0.5rem; right: 0.5rem;">
          <button
            class="btn btn-xs"
            style="background: rgba(0, 0, 0, 0.3); color: #9ca3af; padding: 0.25rem 0.5rem; border-radius: 0.25rem; opacity: 0.7;"
            @click=${(e: Event) => {
              e.stopPropagation();
              showCardActionsMenu = showCardActionsMenu === task.id ? null : task.id;
            }}
          >
            ⋮
          </button>
          ${showCardActionsMenu === task.id
            ? html`
                <div
                  style="position: absolute; top: 1.75rem; right: 0; background: #1f2937; border: 1px solid #374151; border-radius: 0.5rem; padding: 0.5rem; min-width: 180px; z-index: 1000; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);"
                  @click=${(e: Event) => e.stopPropagation()}
                >
                  <div style="padding: 0.5rem; font-weight: 600; color: #d1d5db; border-bottom: 1px solid #374151; margin-bottom: 0.5rem; font-size: 0.875rem;">Card actions</div>
                  <button
                    class="btn btn-sm"
                    style="width: 100%; justify-content: flex-start; background: transparent; color: #d1d5db; padding: 0.5rem; font-size: 0.875rem;"
                    @click=${() => {
                      selectedTaskId = task.id;
                      showCardActionsMenu = null;
                    }}
                  >
                    📝 Open
                  </button>
                  <button
                    class="btn btn-sm"
                    style="width: 100%; justify-content: flex-start; background: transparent; color: #d1d5db; padding: 0.5rem; font-size: 0.875rem;"
                    @click=${() => {
                      const statuses = ["todo", "in_progress", "testing", "done", "archived"];
                      const currentIndex = statuses.indexOf(task.status);
                      const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                      props.onUpdateTaskStatus(task.id, nextStatus as any);
                      showCardActionsMenu = null;
                    }}
                  >
                    ➡️ Move
                  </button>
                  <button
                    class="btn btn-sm"
                    style="width: 100%; justify-content: flex-start; background: transparent; color: #d1d5db; padding: 0.5rem; font-size: 0.875rem;"
                    @click=${() => {
                      props.onAddTask(task.title, task.description, task.projectId, task.priority, task.dueDate, task.labels);
                      showCardActionsMenu = null;
                    }}
                  >
                    📋 Copy
                  </button>
                  <div style="border-top: 1px solid #374151; margin: 0.5rem 0;"></div>
                  <button
                    class="btn btn-sm"
                    style="width: 100%; justify-content: flex-start; background: transparent; color: #ef4444; padding: 0.5rem; font-size: 0.875rem;"
                    @click=${() => {
                      props.onUpdateTaskStatus(task.id, "archived");
                      showCardActionsMenu = null;
                    }}
                  >
                    📦 Archive
                  </button>
                  <button
                    class="btn btn-sm"
                    style="width: 100%; justify-content: flex-start; background: transparent; color: #ef4444; padding: 0.5rem; font-size: 0.875rem;"
                    @click=${() => {
                      if (confirm("Delete this task permanently?")) {
                        props.onDeleteTask(task.id);
                      }
                      showCardActionsMenu = null;
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              `
            : nothing}
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
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 2rem;"
        @click=${(e: Event) => {
          if ((e.target as HTMLElement).style.position === "fixed") {
            showTaskModal = false;
            editingTask = null;
          }
        }}
      >
        <div
          style="background: #1f2937; border-radius: 0.75rem; padding: 2rem; max-width: 700px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h2 style="margin: 0; font-size: 1.75rem; font-weight: 600; color: white;">
              ${isNewTask ? "Create New Task" : "Edit Task"}
            </h2>
            <button
              class="btn btn-sm"
              style="background: transparent; color: #9ca3af; font-size: 1.5rem; padding: 0.25rem 0.5rem;"
              @click=${() => {
                showTaskModal = false;
                editingTask = null;
              }}
            >
              ✕
            </button>
          </div>

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
              const labelsInput = formData.get("labels") as string;
              
              if (!title.trim()) return;
              
              const labels = labelsInput
                ? labelsInput.split(",").map((l) => l.trim()).filter(Boolean)
                : [];
              
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

            <!-- Labels -->
            <div style="margin-bottom: 1.5rem;">
              <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db; font-size: 0.875rem;">
                Labels
              </label>
              <input
                type="text"
                name="labels"
                .value=${(task.labels || []).join(", ")}
                placeholder="Enter labels separated by commas (e.g., bug, frontend, urgent)"
                style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; font-size: 1rem;"
              />
              <div style="margin-top: 0.5rem; color: #9ca3af; font-size: 0.75rem;">
                Separate multiple labels with commas
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #374151;">
              <button
                type="button"
                class="btn"
                style="background: transparent; border: 1px solid #374151; color: #9ca3af;"
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
                style="background: #a855f7; color: white; border: none;"
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
        style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem;"
        @click=${(e: Event) => {
          if ((e.target as HTMLElement).style.position === "fixed") {
            selectedTaskId = null;
          }
        }}
      >
        <div
          style="background: #1f2937; border-radius: 0.5rem; padding: 1.5rem; max-width: 600px; width: 100%; max-height: 90vh; overflow-y: auto;"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
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
              style="background: transparent; color: #9ca3af;"
              @click=${() => {
                selectedTaskId = null;
              }}
            >
              ✕
            </button>
          </div>

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

          <div style="margin-bottom: 1rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #9ca3af;">Labels</label>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
              ${(selectedTask.labels || []).map(
                (label) => html`
                  <span
                    style="background: ${getLabelColor(label)}; color: white; padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;"
                  >
                    ${label}
                    <button
                      @click=${() => {
                        props.onUpdateTask(selectedTask.id, {
                          labels: (selectedTask.labels || []).filter((l) => l !== label),
                        });
                      }}
                      style="background: transparent; border: none; color: white; cursor: pointer; padding: 0;"
                    >
                      ×
                    </button>
                  </span>
                `
              )}
            </div>
            <input
              type="text"
              placeholder="Add label (press Enter)"
              @keydown=${(e: KeyboardEvent) => {
                if (e.key === "Enter") {
                  const input = e.target as HTMLInputElement;
                  const label = input.value.trim();
                  if (label) {
                    props.onUpdateTask(selectedTask.id, {
                      labels: [...(selectedTask.labels || []), label],
                    });
                    input.value = "";
                  }
                }
              }}
              style="background: transparent; border: 1px solid #374151; color: white; padding: 0.5rem; border-radius: 0.25rem; width: 100%;"
            />
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
          <span>
            <span>📁</span> Projects (${props.projects.length})
          </span>
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

      <!-- Agent Status Indicator -->
      <div class="card" style="margin-bottom: 1rem;">
        <div class="card-title" style="display: flex; align-items: center; gap: 0.5rem;">
          <div class="status-indicator" style="width: 12px; height: 12px; border-radius: 50%; background: #10b981;"></div>
          <span>Agent Status</span>
        </div>
        <div class="card-sub">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
            <span>• Idle</span>
            <button class="btn btn-sm" style="margin-left: auto;">Ready for tasks</button>
          </div>
        </div>
      </div>

      <!-- Wizard Board (Kanban-style) -->
      <div class="wizard-board" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 1rem; margin-bottom: 1rem;">
        <!-- To Do Column -->
        <div class="card" style="position: relative;">
          <div class="card-title" style="color: ${listColors.todo}; display: flex; align-items: center; justify-content: space-between;">
            <span>
              <span>📋</span> To Do (${tasksByStatus.todo.length})
            </span>
            <button
              class="btn btn-sm"
              style="background: transparent; color: ${listColors.todo}; padding: 0.25rem;"
              @click=${(e: Event) => {
                e.stopPropagation();
                showListActionsMenu = showListActionsMenu === "todo" ? null : "todo";
              }}
            >
              ⋮
            </button>
          </div>
          ${showListActionsMenu === "todo"
            ? html`
                <div
                  style="position: absolute; top: 2.5rem; left: 0; right: 0; background: #1f2937; border: 1px solid #374151; border-radius: 0.5rem; padding: 1rem; z-index: 1000; margin: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);"
                  @click=${(e: Event) => e.stopPropagation()}
                >
                  <div style="padding: 0.5rem; font-weight: 600; color: #d1d5db; border-bottom: 1px solid #374151; margin-bottom: 0.5rem;">List actions</div>
                  <button
                    class="btn btn-sm"
                    style="width: 100%; justify-content: flex-start; background: transparent; color: #d1d5db; padding: 0.5rem; margin-bottom: 0.5rem;"
                    @click=${() => {
                      editingTask = { status: "todo" };
                      showTaskModal = true;
                      showListActionsMenu = null;
                    }}
                  >
                    ➕ Add card
                  </button>
                  <div style="border-top: 1px solid #374151; margin: 0.5rem 0; padding-top: 0.5rem;">
                    <div style="font-weight: 600; color: #d1d5db; margin-bottom: 0.5rem;">Change list color</div>
                    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; margin-bottom: 0.5rem;">
                      ${["#a855f7", "#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#ec4899", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"].map(
                        (color) => html`
                          <button
                            class="btn btn-sm"
                            style="background: ${color}; border: ${listColors.todo === color ? "2px solid white" : "none"}; width: 100%; aspect-ratio: 1; padding: 0;"
                            @click=${() => {
                              listColors.todo = color;
                              showListActionsMenu = null;
                            }}
                          ></button>
                        `
                      )}
                    </div>
                    <button
                      class="btn btn-sm"
                      style="width: 100%; justify-content: flex-start; background: transparent; color: #d1d5db; padding: 0.5rem;"
                      @click=${() => {
                        listColors.todo = "#a855f7";
                        showListActionsMenu = null;
                      }}
                    >
                      ✕ Remove color
                    </button>
                  </div>
                </div>
              `
            : nothing}
          <div
            class="card-sub column-drop-zone"
            @dragover=${handleDragOver}
            @drop=${(e: DragEvent) => handleDrop(e, "todo")}
          >
            ${tasksByStatus.todo.map((task) => renderTaskCard(task))}
            ${tasksByStatus.todo.length === 0
              ? html`<div style="font-size: 0.875rem; color: #9ca3af; text-align: center; padding: 1rem;">No tasks</div>`
              : nothing}
            <button
              class="btn btn-sm"
              style="width: 100%; margin-top: 0.5rem;"
              @click=${() => {
                editingTask = { status: "todo" };
                showTaskModal = true;
              }}
            >
              + Add Task
            </button>
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="card" style="position: relative;">
          <div class="card-title" style="color: ${listColors.in_progress}; display: flex; align-items: center; justify-content: space-between;">
            <span>
              <span>⚡</span> In Progress (${tasksByStatus.in_progress.length})
            </span>
            <button
              class="btn btn-sm"
              style="background: transparent; color: ${listColors.in_progress}; padding: 0.25rem;"
              @click=${(e: Event) => {
                e.stopPropagation();
                showListActionsMenu = showListActionsMenu === "in_progress" ? null : "in_progress";
              }}
            >
              ⋮
            </button>
          </div>
          <div
            class="card-sub column-drop-zone"
            @dragover=${handleDragOver}
            @drop=${(e: DragEvent) => handleDrop(e, "in_progress")}
          >
            ${tasksByStatus.in_progress.map((task) => renderTaskCard(task))}
            ${tasksByStatus.in_progress.length === 0
              ? html`<div style="font-size: 0.875rem; color: #9ca3af; text-align: center; padding: 1rem;">No tasks</div>`
              : nothing}
          </div>
        </div>

        <!-- Testing Column -->
        <div class="card" style="position: relative;">
          <div class="card-title" style="color: ${listColors.testing}; display: flex; align-items: center; justify-content: space-between;">
            <span>
              <span>🧪</span> Testing (${tasksByStatus.testing.length})
            </span>
            <button
              class="btn btn-sm"
              style="background: transparent; color: ${listColors.testing}; padding: 0.25rem;"
              @click=${(e: Event) => {
                e.stopPropagation();
                showListActionsMenu = showListActionsMenu === "testing" ? null : "testing";
              }}
            >
              ⋮
            </button>
          </div>
          <div
            class="card-sub column-drop-zone"
            @dragover=${handleDragOver}
            @drop=${(e: DragEvent) => handleDrop(e, "testing")}
          >
            ${tasksByStatus.testing.map((task) => renderTaskCard(task))}
            ${tasksByStatus.testing.length === 0
              ? html`<div style="font-size: 0.875rem; color: #9ca3af; text-align: center; padding: 1rem;">No tasks</div>`
              : nothing}
          </div>
        </div>

        <!-- Done Column -->
        <div class="card" style="position: relative;">
          <div class="card-title" style="color: ${listColors.done}; display: flex; align-items: center; justify-content: space-between;">
            <span>
              <span>✅</span> Done (${tasksByStatus.done.length})
            </span>
            <button
              class="btn btn-sm"
              style="background: transparent; color: ${listColors.done}; padding: 0.25rem;"
              @click=${(e: Event) => {
                e.stopPropagation();
                showListActionsMenu = showListActionsMenu === "done" ? null : "done";
              }}
            >
              ⋮
            </button>
          </div>
          <div
            class="card-sub column-drop-zone"
            @dragover=${handleDragOver}
            @drop=${(e: DragEvent) => handleDrop(e, "done")}
          >
            ${tasksByStatus.done.map((task) => renderTaskCard(task))}
            ${tasksByStatus.done.length === 0
              ? html`<div style="font-size: 0.875rem; color: #9ca3af; text-align: center; padding: 1rem;">No tasks</div>`
              : nothing}
          </div>
        </div>

        <!-- Archived Column -->
        <div class="card" style="position: relative;">
          <div class="card-title" style="color: ${listColors.archived}; display: flex; align-items: center; justify-content: space-between;">
            <span>
              <span>📦</span> Archived (${tasksByStatus.archived.length})
            </span>
            <button
              class="btn btn-sm"
              style="background: transparent; color: ${listColors.archived}; padding: 0.25rem;"
              @click=${(e: Event) => {
                e.stopPropagation();
                showListActionsMenu = showListActionsMenu === "archived" ? null : "archived";
              }}
            >
              ⋮
            </button>
          </div>
          <div
            class="card-sub column-drop-zone"
            @dragover=${handleDragOver}
            @drop=${(e: DragEvent) => handleDrop(e, "archived")}
          >
            ${tasksByStatus.archived.map((task) => renderTaskCard(task))}
            ${tasksByStatus.archived.length === 0
              ? html`<div style="font-size: 0.875rem; color: #9ca3af; text-align: center; padding: 1rem;">No tasks</div>`
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
              style="width: 100%; background: #a855f7;"
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

function getLabelColor(label: string): string {
  const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
  const hash = label.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
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
