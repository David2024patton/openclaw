// Project Editor Modal and Agent Monitoring Windows
// These functions are imported into wizard.ts

import { html, nothing } from "lit";
import type { WizardProject, WizardProps } from "./wizard.js";

let selectedProjectForMonitoring: string | null = null;
let agentActivities: any[] = [];
let agentMonitoringInterval: ReturnType<typeof setInterval> | null = null;

export function renderProjectEditorModal(
  editingProjectId: string | null,
  projectEditTab: "prompt" | "research" | "features" | "details",
  props: WizardProps,
  onClose: () => void,
  onTabChange: (tab: "prompt" | "research" | "features" | "details") => void,
) {
  if (!editingProjectId) return nothing;
  
  const project = props.projects.find((p) => p.id === editingProjectId);
  if (!project) {
    onClose();
    return nothing;
  }
  
  return html`
    <div
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow: hidden;"
      @click=${(e: Event) => {
        if ((e.target as HTMLElement).style.position === "fixed") {
          onClose();
        }
      }}
    >
      <div
        style="background: #1f2937; border-radius: 0.75rem; width: 100%; max-width: min(900px, 95vw); height: 100%; max-height: min(90vh, calc(100vh - 2rem)); display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);"
        @click=${(e: Event) => e.stopPropagation()}
      >
        <!-- Header (fixed) -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #374151; flex-shrink: 0;">
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600; color: white;">Edit Project: ${project.name}</h2>
          <button
            class="btn btn-sm"
            style="background: transparent; color: #9ca3af; font-size: 1.5rem; padding: 0.25rem 0.5rem; cursor: pointer;"
            @click=${onClose}
          >
            ✕
          </button>
        </div>
        
        <!-- Tabs (fixed) -->
        <div style="display: flex; gap: 0.5rem; padding: 0 1.5rem; border-bottom: 2px solid #374151; flex-shrink: 0; overflow-x: auto;">
          ${(["details", "prompt", "research", "features"] as const).map(
            (tab) => html`
              <button
                class="btn btn-sm"
                style="background: ${projectEditTab === tab ? "#a855f7" : "transparent"}; color: ${projectEditTab === tab ? "white" : "#9ca3af"}; padding: 0.5rem 1rem; border-radius: 0.5rem 0.5rem 0 0; border: none; border-bottom: 2px solid ${projectEditTab === tab ? "#a855f7" : "transparent"}; white-space: nowrap;"
                @click=${() => onTabChange(tab)}
              >
                ${tab === "details" ? "📋 Details" : tab === "prompt" ? "💬 Prompt" : tab === "research" ? "🔬 Research" : "⚙️ Features"}
              </button>
            `
          )}
        </div>
        
        <!-- Scrollable Content Area -->
        <div style="flex: 1; overflow-y: auto; padding: 1.5rem;">
        ${projectEditTab === "details"
          ? html`
              <form
                @submit=${(e: Event) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  props.onUpdateProject(project.id, {
                    name: formData.get("name") as string,
                    description: formData.get("description") as string || undefined,
                    githubRepo: formData.get("githubRepo") as string || undefined,
                    devServerUrl: formData.get("devServerUrl") as string || undefined,
                    manualApprovalRequired: formData.get("manualApproval") === "on",
                    selectedModel: formData.get("selectedModel") as string || undefined,
                  });
                  onClose();
                }}
              >
                <div style="margin-bottom: 1.5rem;">
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">Project Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    .value=${project.name}
                    style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%;"
                  />
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">Description</label>
                  <textarea
                    name="description"
                    .value=${project.description || ""}
                    style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; min-height: 100px;"
                  ></textarea>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">GitHub Repository URL</label>
                  <input
                    type="url"
                    name="githubRepo"
                    .value=${project.githubRepo || ""}
                    placeholder="https://github.com/username/repo"
                    style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%;"
                  />
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">Dev Server URL</label>
                  <input
                    type="url"
                    name="devServerUrl"
                    .value=${project.devServerUrl || ""}
                    placeholder="http://localhost:3000"
                    style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%;"
                  />
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">LLM Model for this Project</label>
                  <select
                    name="selectedModel"
                    style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%;"
                  >
                    <option value="">Use default model</option>
                    <option value="voytas26/my-openclaw-gpt20b:latest" ?selected=${project.selectedModel === "voytas26/my-openclaw-gpt20b:latest"}>voytas26/my-openclaw-gpt20b:latest</option>
                    <option value="qwen2.5-coder:1.5b" ?selected=${project.selectedModel === "qwen2.5-coder:1.5b"}>qwen2.5-coder:1.5b</option>
                    <option value="granite4:3b" ?selected=${project.selectedModel === "granite4:3b"}>granite4:3b</option>
                  </select>
                  <div style="margin-top: 0.5rem; color: #9ca3af; font-size: 0.875rem;">
                    Select a specific LLM model to use for this project. If not set, the default model will be used.
                  </div>
                </div>
                
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border: 1px solid rgba(168, 85, 247, 0.3);">
                  <label style="display: flex; align-items: center; gap: 0.75rem; cursor: pointer;">
                    <input
                      type="checkbox"
                      name="manualApproval"
                      ?checked=${project.manualApprovalRequired || false}
                      style="width: 20px; height: 20px; cursor: pointer;"
                    />
                    <div>
                      <div style="font-weight: 600; color: #d1d5db; margin-bottom: 0.25rem;">Manual Task Approval Required</div>
                      <div style="font-size: 0.875rem; color: #9ca3af;">
                        When enabled, tasks must be manually approved before moving to the next status category. This gives you control over task progression.
                      </div>
                    </div>
                  </label>
                </div>
                
                <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                  <button
                    type="button"
                    class="btn btn-sm"
                    style="background: transparent; color: #9ca3af;"
                    @click=${onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn btn-sm"
                    style="background: #a855f7; color: white; font-weight: 600;"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            `
          : projectEditTab === "prompt"
          ? html`
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">Original User Prompt</label>
                <textarea
                  .value=${project.prompt || ""}
                  @blur=${(e: Event) => {
                    props.onUpdateProject(project.id, { prompt: (e.target as HTMLTextAreaElement).value });
                  }}
                  placeholder="Enter the original user prompt for this project..."
                  style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; min-height: 200px; font-family: monospace;"
                ></textarea>
                <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                  ${props.onEnhancePrompt
                    ? html`
                        <button
                          class="btn btn-sm"
                          style="background: #3b82f6; color: white;"
                          @click=${() => props.onEnhancePrompt?.(project.id)}
                        >
                          ✨ Enhance Prompt
                        </button>
                      `
                    : nothing}
                </div>
              </div>
              
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">AI-Enhanced Prompt</label>
                <textarea
                  .value=${project.enhancedPrompt || ""}
                  @blur=${(e: Event) => {
                    props.onUpdateProject(project.id, { enhancedPrompt: (e.target as HTMLTextAreaElement).value });
                  }}
                  placeholder="AI-enhanced version of the prompt will appear here..."
                  style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; min-height: 200px; font-family: monospace;"
                ></textarea>
              </div>
            `
          : projectEditTab === "research"
          ? html`
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">Research & Organization</label>
                <textarea
                  .value=${project.research || ""}
                  @blur=${(e: Event) => {
                    props.onUpdateProject(project.id, { research: (e.target as HTMLTextAreaElement).value });
                  }}
                  placeholder="LLM research and organization data will appear here..."
                  style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; min-height: 400px; font-family: monospace;"
                ></textarea>
                <div style="margin-top: 0.5rem;">
                  ${props.onEnhanceResearch
                    ? html`
                        <button
                          class="btn btn-sm"
                          style="background: #3b82f6; color: white;"
                          @click=${() => props.onEnhanceResearch?.(project.id)}
                        >
                          ✨ Enhance Research
                        </button>
                      `
                    : nothing}
                </div>
              </div>
            `
          : html`
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">Features Breakdown</label>
                <textarea
                  .value=${project.features || ""}
                  @blur=${(e: Event) => {
                    props.onUpdateProject(project.id, { features: (e.target as HTMLTextAreaElement).value });
                  }}
                  placeholder="Features breakdown that can be converted to tasks..."
                  style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; min-height: 400px; font-family: monospace;"
                ></textarea>
                <div style="margin-top: 0.5rem;">
                  ${props.onGenerateTasksFromFeatures
                    ? html`
                        <button
                          class="btn btn-sm"
                          style="background: #a855f7; color: white;"
                          @click=${() => {
                            props.onGenerateTasksFromFeatures?.(project.id);
                            onClose();
                          }}
                        >
                          ⚙️ Generate Tasks from Features
                        </button>
                      `
                    : nothing}
                </div>
              </div>
            `}
        </div>
        <!-- End Scrollable Content Area -->
      </div>
    </div>
  `;
}

export function renderAgentMonitoringWindows(props: WizardProps) {
  // Only show monitoring for selected project
  if (!selectedProjectForMonitoring) {
    // Auto-select first active project if available
    const activeProject = props.projects.find((p) => p.status === "active");
    if (activeProject) {
      selectedProjectForMonitoring = activeProject.id;
    } else {
      return nothing;
    }
  }
  
  const project = props.projects.find((p) => p.id === selectedProjectForMonitoring);
  if (!project) {
    selectedProjectForMonitoring = null;
    return nothing;
  }
  
  // Fetch agent activities (polling - in production, use WebSocket)
  if (!agentMonitoringInterval) {
    agentMonitoringInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/gateway?method=wizard.agents.list&params=${encodeURIComponent(JSON.stringify({ projectId: selectedProjectForMonitoring }))}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.result?.activities) {
            agentActivities = data.result.activities;
          }
        }
      } catch (err) {
        console.error("Failed to fetch agent activities:", err);
      }
    }, 2000); // Poll every 2 seconds
  }
  
  const projectAgents = agentActivities.filter((a) => a.projectId === selectedProjectForMonitoring);
  
  if (projectAgents.length === 0) {
    return html`
      <div style="position: fixed; bottom: 1rem; right: 1rem; z-index: 1500; max-width: 400px;">
        <div style="background: #1f2937; border: 1px solid #374151; border-radius: 0.5rem; padding: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="font-weight: 600; color: #d1d5db;">Agent Monitoring: ${project.name}</div>
            <button
              class="btn btn-xs"
              style="background: transparent; color: #9ca3af;"
              @click=${() => {
                selectedProjectForMonitoring = null;
                if (agentMonitoringInterval) {
                  clearInterval(agentMonitoringInterval);
                  agentMonitoringInterval = null;
                }
              }}
            >
              ✕
            </button>
          </div>
          <div style="color: #9ca3af; font-size: 0.875rem;">No active agents for this project.</div>
        </div>
      </div>
    `;
  }
  
  return html`
    <div style="position: fixed; bottom: 1rem; right: 1rem; z-index: 1500; display: flex; flex-direction: column; gap: 1rem; max-width: 500px; max-height: 80vh; overflow-y: auto;">
      ${projectAgents.map(
        (agent) => html`
          <div style="background: #1f2937; border: 1px solid #374151; border-radius: 0.5rem; padding: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
              <div>
                <div style="font-weight: 600; color: #d1d5db; margin-bottom: 0.25rem;">${agent.agentName || "Unknown Agent"}</div>
                <div style="font-size: 0.75rem; color: #9ca3af;">
                  ${agent.agentType || "agent"} • ${agent.model || "N/A"}
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${agent.status === "working" ? "#10b981" : agent.status === "thinking" ? "#f59e0b" : "#6b7280"};"></div>
                <span style="font-size: 0.75rem; color: #9ca3af;">${agent.status || "idle"}</span>
              </div>
            </div>
            
            ${agent.thinking
              ? html`
                  <div style="margin-bottom: 0.75rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.3); border-radius: 0.25rem; border-left: 3px solid #3b82f6;">
                    <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem;">Thinking:</div>
                    <div style="font-size: 0.875rem; color: #d1d5db; white-space: pre-wrap;">${agent.thinking}</div>
                  </div>
                `
              : nothing}
            
            ${agent.actions && agent.actions.length > 0
              ? html`
                  <div style="margin-bottom: 0.75rem;">
                    <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem;">Recent Actions:</div>
                    <div style="max-height: 100px; overflow-y: auto;">
                      ${agent.actions.slice(-5).map(
                        (action: string) => html`
                          <div style="font-size: 0.75rem; color: #d1d5db; padding: 0.25rem 0; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
                            ${action}
                          </div>
                        `
                      )}
                    </div>
                  </div>
                `
              : nothing}
            
            ${agent.terminal && agent.terminal.length > 0
              ? html`
                  <div>
                    <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.25rem;">Terminal Output:</div>
                    <div style="background: #000; color: #10b981; padding: 0.75rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.75rem; max-height: 150px; overflow-y: auto; white-space: pre-wrap;">
                      ${agent.terminal.slice(-20).join("\n")}
                    </div>
                  </div>
                `
              : nothing}
          </div>
        `
      )}
    </div>
  `;
}
