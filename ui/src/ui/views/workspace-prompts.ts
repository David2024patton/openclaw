import { html, nothing } from "lit";
import type { GatewayBrowserClient } from "../gateway";
import { renderHelpModal } from "../components/help-modal";
import type { ApiResponse } from "../ui-types";

export type WorkspacePromptFile = {
  name: string;
  filename: string;
  enabled: boolean;
  content: string;
  description: string;
  example: string;
};

export type WorkspacePromptsProps = {
  connected: boolean;
  client: GatewayBrowserClient | null;
  prompts: WorkspacePromptFile[];
  onLoadPrompts: () => Promise<void>;
  onSavePrompt: (filename: string, content: string, enabled: boolean) => Promise<void>;
};

let selectedPromptFilename: string | null = null;
let editingContent: string = "";
let editingEnabled: boolean = false;
let showHelpTooltip: string | null = null;
let helpModalOpen = false;

export function renderWorkspacePrompts(props: WorkspacePromptsProps) {
  if (!props.connected) {
    return html`
      <div class="card">
        <div class="card-title">Workspace Prompts</div>
        <div class="card-sub">Connect to gateway to edit workspace prompt files.</div>
      </div>
    `;
  }

  const selectedPrompt = props.prompts.find((p) => p.filename === selectedPromptFilename);

  const handleSave = async () => {
    if (!selectedPromptFilename) return;
    await props.onSavePrompt(selectedPromptFilename, editingContent, editingEnabled);
    await props.onLoadPrompts();
    selectedPromptFilename = null;
  };

  const handleSelectPrompt = async (filename: string) => {
    selectedPromptFilename = filename;
    const prompt = props.prompts.find((p) => p.filename === filename);
    if (prompt) {
      editingContent = prompt.content;
      editingEnabled = prompt.enabled;
    } else {
      // Load from server
      try {
        const response = await props.client?.request("workspace.prompts.get", { filename }) as ApiResponse<{ content: string; enabled: boolean }> | undefined;
        if (response?.success && response.result) {
          editingContent = response.result.content || "";
          editingEnabled = response.result.enabled || false;
        }
      } catch (err) {
        console.error("Failed to load prompt:", err);
      }
    }
  };

  return html`
    <div style="display: grid; grid-template-columns: 300px 1fr; gap: 1rem; height: calc(100vh - 200px);">
      <!-- Left Sidebar: Prompt List -->
      <div class="card" style="overflow-y: auto;">
        <div class="card-title" style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span>📝 Prompt Files</span>
            <button
              class="btn btn-xs"
              style="background: transparent; color: #9ca3af; padding: 0.25rem;"
              title="What are workspace prompts?"
              @click=${() => {
                helpModalOpen = true;
              }}
            >
              ❓
            </button>
          </div>
          <button
            class="btn btn-sm"
            style="background: #a855f7; color: white;"
            @click=${async () => {
              await props.onLoadPrompts();
            }}
            title="Refresh prompts list"
          >
            🔄
          </button>
        </div>
        <div class="card-sub">
          <div style="font-size: 0.875rem; color: #9ca3af; margin-bottom: 1rem; padding: 0.75rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem;">
            These files define your agent's personality and behavior. Toggle them on/off and edit their content.
          </div>
          
          ${props.prompts.map(
            (prompt) => html`
              <div
                style="padding: 0.75rem; margin-bottom: 0.5rem; background: ${selectedPromptFilename === prompt.filename
                  ? "rgba(168, 85, 247, 0.2)"
                  : "rgba(255, 255, 255, 0.05)"}; border-radius: 0.5rem; border: 1px solid ${selectedPromptFilename === prompt.filename
                  ? "#a855f7"
                  : "transparent"}; cursor: pointer; transition: all 0.2s;"
                @click=${() => handleSelectPrompt(prompt.filename)}
              >
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                  <div style="font-weight: 600; color: #d1d5db;">${prompt.name}</div>
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div
                      style="width: 8px; height: 8px; border-radius: 50%; background: ${prompt.enabled ? "#10b981" : "#6b7280"};"
                      title="${prompt.enabled ? "Enabled" : "Disabled"}"
                    ></div>
                    <button
                      class="btn btn-xs"
                      style="background: transparent; color: #9ca3af; padding: 0.25rem;"
                      @click=${(e: Event) => {
                        e.stopPropagation();
                        showHelpTooltip = showHelpTooltip === prompt.filename ? null : prompt.filename;
                      }}
                      title="Show help"
                    >
                      ❓
                    </button>
                  </div>
                </div>
                <div style="font-size: 0.75rem; color: #9ca3af;">${prompt.filename}</div>
                
                ${showHelpTooltip === prompt.filename
                  ? html`
                      <div
                        style="margin-top: 0.75rem; padding: 0.75rem; background: rgba(0, 0, 0, 0.5); border-radius: 0.5rem; border-left: 3px solid #3b82f6;"
                      >
                        <div style="font-size: 0.75rem; color: #9ca3af; margin-bottom: 0.5rem; font-weight: 600;">
                          What is this?
                        </div>
                        <div style="font-size: 0.75rem; color: #d1d5db; margin-bottom: 0.75rem; line-height: 1.5;">
                          ${prompt.description}
                        </div>
                        <details style="font-size: 0.75rem;">
                          <summary style="color: #a855f7; cursor: pointer; margin-bottom: 0.5rem;">Show example</summary>
                          <pre style="background: rgba(0, 0, 0, 0.3); padding: 0.75rem; border-radius: 0.25rem; overflow-x: auto; color: #d1d5db; font-size: 0.7rem; line-height: 1.4; margin-top: 0.5rem;">${prompt.example}</pre>
                        </details>
                      </div>
                    `
                  : nothing}
              </div>
            `
          )}
          
          ${props.prompts.length === 0
            ? html`
                <div style="text-align: center; padding: 2rem; color: #9ca3af; font-size: 0.875rem;">
                  No prompt files found. Click "Create from Template" to get started.
                </div>
              `
            : nothing}
        </div>
      </div>

      <!-- Right Panel: Editor -->
      <div class="card" style="display: flex; flex-direction: column; overflow: hidden;">
        ${selectedPromptFilename && selectedPrompt
          ? html`
              <div class="card-title" style="display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <span>Editing: ${selectedPrompt.name}</span>
                  <span style="font-size: 0.75rem; color: #9ca3af; font-weight: normal;">(${selectedPrompt.filename})</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.5rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem;">
                    <input
                      type="checkbox"
                      .checked=${editingEnabled}
                      @change=${(e: Event) => {
                        editingEnabled = (e.target as HTMLInputElement).checked;
                      }}
                      style="width: 18px; height: 18px; cursor: pointer;"
                    />
                    <span style="font-size: 0.875rem; color: #d1d5db; font-weight: 500;">Enable</span>
                  </label>
                  <button
                    class="btn btn-sm"
                    style="background: #10b981; color: white; font-weight: 600;"
                    @click=${handleSave}
                  >
                    💾 Save
                  </button>
                  <button
                    class="btn btn-sm"
                    style="background: transparent; color: #9ca3af;"
                    @click=${() => {
                      selectedPromptFilename = null;
                    }}
                  >
                    ✕ Close
                  </button>
                </div>
              </div>
              
              <div style="flex: 1; display: flex; flex-direction: column; overflow: hidden; margin-top: 1rem;">
                <!-- Help Section -->
                <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 3px solid #3b82f6; flex-shrink: 0;">
                  <div style="display: flex; align-items: start; justify-content: space-between;">
                    <div style="flex: 1;">
                      <div style="font-weight: 600; color: #d1d5db; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                        <span>ℹ️</span>
                        <span>About ${selectedPrompt.name}</span>
                      </div>
                      <div style="font-size: 0.875rem; color: #9ca3af; line-height: 1.5; margin-bottom: 0.75rem;">
                        ${selectedPrompt.description}
                      </div>
                      <details style="font-size: 0.875rem;">
                        <summary style="color: #3b82f6; cursor: pointer; margin-bottom: 0.5rem; font-weight: 500;">
                          📖 View Example
                        </summary>
                        <pre style="background: rgba(0, 0, 0, 0.3); padding: 0.75rem; border-radius: 0.25rem; overflow-x: auto; color: #d1d5db; font-size: 0.75rem; line-height: 1.4; margin-top: 0.5rem; white-space: pre-wrap;">${selectedPrompt.example}</pre>
                      </details>
                    </div>
                  </div>
                </div>
                
                <!-- Editor -->
                <div style="flex: 1; display: flex; flex-direction: column; min-height: 0;">
                  <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db; font-size: 0.875rem;">
                    Content
                  </label>
                  <textarea
                    .value=${editingContent}
                    @input=${(e: Event) => {
                      editingContent = (e.target as HTMLTextAreaElement).value;
                    }}
                    style="flex: 1; background: #111827; border: 1px solid #374151; color: white; padding: 1rem; border-radius: 0.5rem; font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace; font-size: 0.875rem; line-height: 1.6; resize: none; min-height: 400px;"
                    placeholder="Enter markdown content here..."
                  ></textarea>
                </div>
                
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #374151; flex-shrink: 0; display: flex; justify-content: space-between; align-items: center;">
                  <div style="font-size: 0.75rem; color: #9ca3af;">
                    ${editingEnabled
                      ? html`<span style="color: #10b981;">●</span> This file will be loaded by the agent`
                      : html`<span style="color: #6b7280;">○</span> This file is disabled and won't be loaded`}
                  </div>
                  <div style="display: flex; gap: 0.5rem;">
                    <button
                      class="btn btn-sm"
                      style="background: transparent; color: #9ca3af;"
                      @click=${async () => {
                        // Load template
                        try {
                          const response = await props.client?.request("workspace.prompts.createFromTemplate", {
                            filename: selectedPromptFilename,
                          }) as ApiResponse<{ content: string }> | undefined;
                          if (response?.success && response.result) {
                            editingContent = response.result.content || "";
                            editingEnabled = true;
                          }
                        } catch (err) {
                          console.error("Failed to load template:", err);
                        }
                      }}
                    >
                      📄 Load Template
                    </button>
                    <button
                      class="btn btn-sm"
                      style="background: #a855f7; color: white; font-weight: 600;"
                      @click=${handleSave}
                    >
                      💾 Save Changes
                    </button>
                  </div>
                </div>
              </div>
            `
          : html`
              <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #9ca3af;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📝</div>
                <div style="font-size: 1.25rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.5rem;">
                  Select a prompt file to edit
                </div>
                <div style="font-size: 0.875rem; text-align: center; max-width: 400px;">
                  Choose a file from the left sidebar to edit its content. These files control your agent's personality, behavior, and memory system.
                </div>
                <div style="margin-top: 2rem; padding: 1rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; max-width: 500px;">
                  <div style="font-weight: 600; color: #d1d5db; margin-bottom: 0.5rem;">💡 Tip</div>
                  <div style="font-size: 0.875rem; line-height: 1.5;">
                    Enable the toggle switch to activate a prompt file. Disabled files won't be loaded by the agent, allowing you to test different configurations.
                  </div>
                </div>
              </div>
            `}
      </div>
    </div>

    ${renderHelpModal({
      isOpen: helpModalOpen,
      title: "What are Workspace Prompts?",
      content: html`
        <p>Workspace prompts are markdown files that shape your agent's personality and behavior.</p>
        
        <h4>Standard Prompt Files:</h4>
        <ul>
          <li><code>SOUL.md</code> - Core personality and communication style</li>
          <li><code>IDENTITY.md</code> - Who the agent is and its role</li>
          <li><code>USER.md</code> -Information about you and your preferences</li>
          <li><code>CLAUDE.md</code> - System-level instructions</li>
          <li><code>TOOLS.md</code> - Tool usage guidelines</li>
          <li><code>BOOTSTRAP.md</code> - First-run initialization</li>
        </ul>

        <h4>How They Work:</h4>
        <p>
          These files are <strong>injected into the system prompt</strong> before every message.
          This allows you to customize the agent's behavior without changing code.
        </p>

        <h4>Using Prompts:</h4>
        <ul>
          <li>Select a prompt from the sidebar to view and edit</li>
          <li>Toggle the checkbox to enable/disable</li>
          <li>Disabled prompts won't be loaded by the agent</li>
          <li>Use this to test different configurations</li>
          <li>Click "Load Template" to restore defaults</li>
        </ul>
      `,
      onClose: () => {
        helpModalOpen = false;
      },
    })}
  `;
}
