import { html, nothing } from "lit";
import type { ToolStatusEntry, ToolStatusReport } from "../types";
import type { GatewayBrowserClient } from "../gateway";

export type ToolsMarketplaceProps = {
  loading: boolean;
  report: ToolStatusReport | null;
  error: string | null;
  filter: string;
  categoryFilter: string;
  edits: Record<string, string>;
  busyKey: string | null;
  messages: Record<string, any>;
  client: GatewayBrowserClient | null;
  selectedToolKey: string | null;
  editingContent: string;
  onFilterChange: (next: string) => void;
  onCategoryFilterChange: (next: string) => void;
  onRefresh: () => void;
  onToggle: (toolKey: string, enabled: boolean) => Promise<void>;
  onEdit: (toolKey: string, value: string) => void;
  onSaveKey: (toolKey: string) => Promise<void>;
  onInstall: (toolKey: string, name: string, installId: string) => Promise<void>;
  onSelectTool: (toolKey: string | null) => void;
  onLoadToolContent: (toolKey: string) => Promise<void>;
  onSaveToolContent: (toolKey: string, content: string) => Promise<void>;
  onDeleteTool: (toolKey: string) => Promise<void>;
  onTestTool: (toolKey: string) => Promise<void>;
  onCreateTool: () => void;
};

export const TOOL_CATEGORIES = [
  "Search",
  "Data",
  "Files",
  "Media",
  "Communication",
  "Dev",
  "Other",
] as const;

const TEMPLATE_CONTENT = `# Tool Name

## Description
Describe what this tool does and when the agent should use it.

## Input Schema
Define the JSON schema for the tool inputs.
\`\`\`json
{
  "type": "object",
  "properties": {
    "param1": { "type": "string", "description": "Parameter description" }
  },
  "required": ["param1"]
}
\`\`\`

## Implementation
\`\`\`typescript
export default async function(args: { param1: string }) {
  // Tool logic here
  return "Tool output";
}
\`\`\`
`;

function getToolCategory(tool: ToolStatusEntry): string {
  if (tool.category && tool.category !== "custom") return tool.category;
  return "Other";
}

function renderTemplateModal(props: ToolsMarketplaceProps) {
  return html`
    <div 
      class="detail-modal-overlay"
      @click=${(e: Event) => {
        if (e.target === e.currentTarget) props.onSelectTool(null);
      }}
    >
      <div 
        class="detail-modal-content"
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div class="card-title" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>📋</span>
            <span>Tool Template</span>
          </div>
          <button
            class="btn btn-sm"
            style="background: transparent; color: #9ca3af;"
            @click=${() => props.onSelectTool(null)}
          >
            ✕
          </button>
        </div>
        
        <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border-left: 3px solid #a855f7;">
          <div style="font-size: 0.875rem; color: #d1d5db; line-height: 1.5;">
            This is a template for creating new tools. Click "Clone Template" below to start.
          </div>
        </div>

        <div style="margin-bottom: 1rem;">
          <label class="field">
            <span>Template Content (Read-Only)</span>
            <div style="
              background: rgba(0, 0, 0, 0.2);
              border: 1px solid var(--border);
              border-radius: var(--radius-sm);
              padding: 0.75rem;
              font-family: monospace;
              font-size: 0.875rem;
              line-height: 1.5;
              color: #9ca3af;
              white-space: pre-wrap;
              max-height: 400px;
              overflow-y: auto;
            ">${TEMPLATE_CONTENT}</div>
          </label>
        </div>

        <button
          class="btn primary"
          style="width: 100%; margin-top: 1rem;"
          @click=${() => {
            let newName = prompt("Create New Tool\n\nEnter a name for your tool:");
            if (!newName) return;
            newName = newName.trim();
            
            const existingNames = props.report?.tools.map(t => t.name.toLowerCase()) || [];
            if (existingNames.includes(newName.toLowerCase())) {
              alert(`A tool named "${newName}" already exists.`);
              return;
            }
            
            props.client?.request("tools.create", {
              toolName: newName,
              content: TEMPLATE_CONTENT,
              category: "custom"
            }).then((result: any) => {
              if (result?.success || result?.ok) {
                alert(`Tool "${newName}" created successfully!`);
                props.onRefresh();
                props.onSelectTool(null);
              }
            }).catch((err: any) => {
              alert(`Failed to create tool: ${err}`);
            });
          }}
        >
          📋 Clone Template
        </button>
      </div>
    </div>
  `;
}

function renderToolDetailModal(props: ToolsMarketplaceProps, tool: ToolStatusEntry) {
  return html`
    <div 
      class="detail-modal-overlay"
      @click=${(e: Event) => {
        if (e.target === e.currentTarget) props.onSelectTool(null);
      }}
    >
      <div 
        class="detail-modal-content"
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div class="card-title" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${tool.emoji ? html`<span>${tool.emoji}</span>` : nothing}
            <span>${tool.name}</span>
          </div>
          <button
            class="btn btn-sm"
            style="background: transparent; color: #9ca3af;"
            @click=${() => props.onSelectTool(null)}
          >
            ✕
          </button>
        </div>
        
        <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border-left: 3px solid #a855f7;">
          <div style="font-size: 0.875rem; color: #d1d5db; line-height: 1.5;">
            ${tool.description || "No description available"}
          </div>
          <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="chip">${tool.source}</span>
            <span class="chip ${tool.eligible ? "chip-ok" : "chip-warn"}">
              ${tool.eligible ? "eligible" : "blocked"}
            </span>
            <span class="chip">${getToolCategory(tool)}</span>
          </div>
        </div>

        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(0, 0, 0, 0.2); border-radius: 0.5rem;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <span style="font-weight: 500; color: #d1d5db;">Enable Tool</span>
            <input
              type="checkbox"
              .checked=${!tool.disabled}
              @change=${(e: Event) => {
                props.onToggle(tool.toolKey, !(e.target as HTMLInputElement).checked);
              }}
              style="width: 2.5rem; height: 1.25rem; cursor: pointer;"
            />
          </label>
        </div>

        ${tool.primaryEnv ? html`
          <div style="margin-bottom: 1rem;">
            <label class="field">
              <span>API Key (${tool.primaryEnv})</span>
              <input
                type="password"
                .value=${props.edits[tool.toolKey] ?? ""}
                @input=${(e: Event) =>
                  props.onEdit(tool.toolKey, (e.target as HTMLInputElement).value)}
                placeholder="Enter API key..."
              />
            </label>
            <button
              class="btn primary"
              style="margin-top: 0.5rem; width: 100%;"
              ?disabled=${props.busyKey === tool.toolKey}
              @click=${() => props.onSaveKey(tool.toolKey)}
            >
              💾 Save Key
            </button>
          </div>
        ` : nothing}

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1rem;">
          <button
            class="btn"
            style="background: #3b82f6; color: white;"
            @click=${async () => {
              await props.onLoadToolContent(tool.toolKey);
            }}
          >
            📝 Edit Code
          </button>
          <button
            class="btn"
            style="background: #10b981; color: white;"
            @click=${() => props.onTestTool(tool.toolKey)}
            ?disabled=${props.busyKey === tool.toolKey}
          >
            🧪 Test
          </button>
          <button
            class="btn"
            style="background: #a855f7; color: white;"
            @click=${async () => {
              let newName = prompt(`Clone "${tool.name}"\\n\\nEnter a name for the cloned tool:`);
              if (!newName) return;
              
              newName = newName.trim();
              const existingNames = props.report?.tools.map(t => t.name.toLowerCase()) || [];
              let finalName = newName;
              let counter = 2;
              
              while (existingNames.includes(finalName.toLowerCase())) {
                finalName = `${newName} (${counter})`;
                counter++;
              }
              
              if (finalName !== newName) {
                if (!confirm(`The name "${newName}" already exists. Use "${finalName}" instead?`)) return;
              }
              
              if (!props.editingContent) {
                await props.onLoadToolContent(tool.toolKey);
              }
              
              try {
                const result = await props.client?.request("tools.create", {
                  toolName: finalName,
                  content: props.editingContent,
                  category: getToolCategory(tool)
                });
                
                if ((result as any)?.success || (result as any)?.ok) {
                  alert(`Successfully cloned tool as "${finalName}"`);
                  props.onRefresh();
                }
              } catch (err) {
                alert(`Failed to clone tool: ${err}`);
              }
            }}
            ?disabled=${props.busyKey === tool.toolKey}
          >
            📋 Clone
          </button>
          ${tool.source !== "openclaw-bundled" ? html`
            <button
              class="btn"
              style="background: #ef4444; color: white;"
              @click=${() => {
                if (confirm(`Delete "${tool.name}"? This cannot be undone.`)) {
                  props.onDeleteTool(tool.toolKey);
                }
              }}
            >
              🗑️ Delete
            </button>
          ` : nothing}
        </div>

        ${props.editingContent || props.edits[tool.toolKey + "_content"] ? html`
          <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-weight: 500; color: #d1d5db;">TOOL.ts</span>
              <div style="display: flex; gap: 0.5rem;">
                <button
                  class="btn btn-sm"
                  style="background: transparent; color: #9ca3af;"
                  @click=${() => props.onEdit(tool.toolKey + "_content", "")}
                >
                  ✕ Close
                </button>
                <button
                  class="btn btn-sm"
                  style="background: #10b981; color: white;"
                  @click=${() => {
                    const content = props.editingContent || props.edits[tool.toolKey + "_content"] || "";
                    props.onSaveToolContent(tool.toolKey, content);
                  }}
                >
                  💾 Save
                </button>
              </div>
            </div>
            <textarea
              .value=${props.editingContent || props.edits[tool.toolKey + "_content"] || ""}
              @input=${(e: Event) => props.onEdit(tool.toolKey + "_content", (e.target as HTMLTextAreaElement).value)}
              style="
                width: 100%;
                min-height: 300px;
                font-family: monospace;
                font-size: 0.75rem;
                resize: vertical;
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                padding: 0.75rem;
                color: var(--fg);
              "
            ></textarea>
          </div>
        ` : nothing}
      </div>
    </div>
  `;
}

function renderToolCard(tool: ToolStatusEntry, props: ToolsMarketplaceProps) {
  return html`
    <div
      class="tool-card ${tool.disabled ? "disabled" : ""}"
      style="
        padding: 1rem;
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        cursor: pointer;
        transition: all 0.2s ease;
      "
      @click=${() => props.onSelectTool(tool.toolKey)}
    >
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <div style="font-size: 1.5rem;">${tool.emoji || "🔧"}</div>
          <div>
            <div style="font-weight: 600; color: #d1d5db;">${tool.name}</div>
            <div style="font-size: 0.75rem; color: #9ca3af;">${tool.source}</div>
          </div>
        </div>
        <div style="display: flex; gap: 0.25rem;">
          ${tool.primaryEnv && !props.edits[tool.toolKey] ? html`<span title="Needs Config" style="color: #fbbf24;">⚠️</span>` : nothing}
          ${!tool.eligible ? html`<span title="Incompatible" style="color: #ef4444;">🚫</span>` : nothing}
        </div>
      </div>
      
      <div style="font-size: 0.875rem; color: #9ca3af; line-height: 1.4; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
        ${tool.description}
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
        <span class="chip">${getToolCategory(tool)}</span>
        <div class="toggle-switch ${!tool.disabled ? "active" : ""}">
          <div class="toggle-knob"></div>
        </div>
      </div>
    </div>
  `;
}

// Separate function to render modals OUTSIDE the main content area
// This must be called at the app-render level, after </main>, to ensure proper fixed positioning
export function renderToolsModals(props: ToolsMarketplaceProps) {
  const tools = props.report?.tools ?? [];
  const selectedTool = props.selectedToolKey 
    ? tools.find(t => t.toolKey === props.selectedToolKey)
    : null;

  return html`
    ${props.selectedToolKey === '__TEMPLATE__' ? renderTemplateModal(props) : nothing}
    ${props.selectedToolKey && props.selectedToolKey !== '__TEMPLATE__' && selectedTool 
      ? renderToolDetailModal(props, selectedTool) 
      : nothing}
  `;
}

export function renderToolsMarketplace(props: ToolsMarketplaceProps) {
  const tools = props.report?.tools ?? [];
  const filter = props.filter.trim().toLowerCase();
  
  let filtered = tools;
  if (filter) {
    filtered = filtered.filter(t => 
      [t.name, t.description, t.source].join(" ").toLowerCase().includes(filter)
    );
  }
  if (props.categoryFilter && props.categoryFilter !== "all") {
    filtered = filtered.filter(t => getToolCategory(t) === props.categoryFilter);
  }

  // Note: Modals are now rendered separately via renderToolsModals() in app-render.ts
  // to ensure they appear outside <main> and use proper fixed positioning

  return html`
    <div style="height: calc(100vh - 200px);">
      <section class="card">
        <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <div class="card-title" style="display: flex; align-items: center; gap: 0.75rem;">
              <span>🛍️ Tools Marketplace</span>
              <button
                class="btn btn-xs"
                style="background: transparent; color: #9ca3af; padding: 0.25rem;"
                title="What are Tools?"
                @click=${() => alert("Tools allow the AI to perform actions like searching the web, reading files, or executing code.")}
              >
                ❓
              </button>
            </div>
            <div class="card-sub">Browse, manage, and create Tools to extend your agent's capabilities.</div>
          </div>
          <div class="row" style="gap: 0.5rem;">
            <button class="btn primary" @click=${props.onCreateTool}>✨ New Tool</button>
            <button class="btn" @click=${props.onRefresh}>🔄 Refresh</button>
          </div>
        </div>

        ${props.loading ? html`<div class="loading-spinner">Loading Tools...</div>` : nothing}

        <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1.5rem;">
          <label class="field" style="flex: 1;">
            <span>🔍 Search</span>
            <input
              type="text"
              placeholder="Search Tools..."
              .value=${props.filter}
              @input=${(e: Event) => props.onFilterChange((e.target as HTMLInputElement).value)}
            />
          </label>
          <label class="field" style="width: 220px;">
            <span>📁 Category</span>
            <select
              .value=${props.categoryFilter}
              @change=${(e: Event) => props.onCategoryFilterChange((e.target as HTMLSelectElement).value)}
            >
              <option value="all">All Categories</option>
              ${TOOL_CATEGORIES.map(cat => html`<option value="${cat}">${cat}</option>`)}
            </select>
          </label>
        </div>

        ${props.error ? html`<div class="callout danger" style="margin-bottom: 1rem;">${props.error}</div>` : nothing}

        ${filtered.length === 0 && !props.loading ? html`
          <div class="muted" style="text-align: center; padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
            <div style="font-size: 1.25rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.5rem;">No Tools found</div>
          </div>
        ` : html`
          <div class="tools-grid" style="margin-top: 16px;">
            <!-- Pinned Template -->
            <div
              style="
                padding: 1rem;
                background: linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%);
                border: 2px dashed #a855f7;
                border-radius: var(--radius-lg);
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
              "
              @click=${() => props.onSelectTool('__TEMPLATE__')}
            >
              <div style="position: absolute; top: 0.75rem; right: 0.75rem; background: #a855f7; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.625rem; font-weight: 600;">TEMPLATE</div>
              <div style="font-size: 2rem; margin-bottom: 0.75rem;">📋</div>
              <div style="font-weight: 600; color: #d1d5db; margin-bottom: 0.5rem;">Tool Template</div>
              <div style="font-size: 0.75rem; color: #9ca3af; line-height: 1.5;">Click to create a new Tool from this template.</div>
            </div>

            ${filtered.map(tool => renderToolCard(tool, props))}
          </div>
          <div style="margin-top: 1rem; text-align: center; color: #9ca3af; font-size: 0.875rem;">
            Showing ${filtered.length} of ${tools.length} Tools
          </div>
        `}
      </section>
    </div>
  `;
}
