import { html, nothing } from "lit";
import type { SkillMessageMap } from "../controllers/skills";
import type { SkillStatusEntry, SkillStatusReport } from "../types";
import type { GatewayBrowserClient } from "../gateway";
import { renderHelpModal } from "../components/help-modal";

export type SkillsMarketplaceProps = {
  loading: boolean;
  report: SkillStatusReport | null;
  error: string | null;
  filter: string;
  categoryFilter: string;
  edits: Record<string, string>;
  busyKey: string | null;
  messages: SkillMessageMap;
  client: GatewayBrowserClient | null;
  selectedSkillKey: string | null;
  editingContent: string;
  onFilterChange: (next: string) => void;
  onCategoryFilterChange: (next: string) => void;
  onRefresh: () => void;
  onToggle: (skillKey: string, enabled: boolean) => Promise<void>;
  onEdit: (skillKey: string, value: string) => void;
  onSaveKey: (skillKey: string) => Promise<void>;
  onInstall: (skillKey: string, name: string, installId: string) => Promise<void>;
  onSelectSkill: (skillKey: string | null) => void;
  onLoadSkillContent: (skillKey: string) => Promise<void>;
  onSaveSkillContent: (skillKey: string, content: string) => Promise<void>;
  onDeleteSkill: (skillKey: string) => Promise<void>;
  onTestSkill: (skillKey: string) => Promise<void>;
  onCreateSkill: () => void;
  showCreateSkillModal: boolean;
  newSkillName: string;
  newSkillCategory: string;
  newSkillContent: string;
  onNewSkillNameChange: (name: string) => void;
  onNewSkillCategoryChange: (category: string) => void;
  onNewSkillContentChange: (content: string) => void;
  onSaveNewSkill: () => void;
  onCloseCreateSkillModal: () => void;
};

export const SKILL_CATEGORIES = [
  "Development",
  "Communication",
  "Media",
  "Files",
  "APIs",
  "AI & ML",
  "Database",
  "Security",
  "DevOps",
  "Other",
] as const;

export type SkillCategory = typeof SKILL_CATEGORIES[number];

let helpModalOpen = false;

const TEMPLATE_CONTENT = `# Skill Name

## Description
Describe what this skill does and when to use it.

## Instructions
1. Step-by-step instructions for the agent
2. Include specific commands or actions
3. Define success criteria

## Tools Required
- List any tools needed
- Include API keys if applicable

## Example Usage
Provide examples of when and how to use this skill.

## Notes
- Additional context
- Limitations or caveats
- Best practices
`;

function getSkillCategory(skill: SkillStatusEntry): SkillCategory {
  // No metadata.category available on SkillStatusEntry, use name-based heuristics

  const name = skill.name.toLowerCase();
  if (name.includes("code") || name.includes("lint") || name.includes("dev")) return "Development";
  if (name.includes("chat") || name.includes("slack")) return "Communication";
  if (name.includes("image") || name.includes("media")) return "Media";
  if (name.includes("file") || name.includes("doc")) return "Files";
  if (name.includes("api") || name.includes("http")) return "APIs";
  if (name.includes("ai") || name.includes("gpt")) return "AI & ML";
  if (name.includes("db") || name.includes("sql")) return "Database";
  if (name.includes("security") || name.includes("auth")) return "Security";
  if (name.includes("deploy") || name.includes("docker")) return "DevOps";

  return "Other";
}

function renderTemplateModal(props: SkillsMarketplaceProps) {
  return html`
    <div 
      class="detail-modal-overlay"
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.75); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 2rem; backdrop-filter: blur(4px);"
      @click=${(e: Event) => {
      if (e.target === e.currentTarget) props.onSelectSkill(null);
    }}
    >
      <div 
        class="detail-modal-content"
        style="background: var(--card, #1a1a2e); border-radius: 12px; max-width: 700px; width: 100%; max-height: calc(100vh - 4rem); overflow-y: auto; border: 1px solid var(--border, #333); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); padding: 1.5rem;"
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div class="card-title" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>📋</span>
            <span>Skill Template</span>
          </div>
          <button
            class="btn btn-sm"
            style="background: transparent; color: #9ca3af;"
            @click=${() => props.onSelectSkill(null)}
          >
            ✕
          </button>
        </div>
        
        <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border-left: 3px solid #a855f7;">
          <div style="font-size: 0.875rem; color: #d1d5db; line-height: 1.5;">
            This is a template for creating new skills. Click "Clone Template" below to start.
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
              font-size: 0.75rem;
              white-space: pre-wrap;
              color: #9ca3af;
              max-height: 300px;
              overflow-y: auto;
            ">${TEMPLATE_CONTENT}</div>
          </label>
        </div>

        <button
          class="btn primary"
          style="width: 100%; margin-top: 1rem;"
          @click=${() => {
      let newName = prompt("Create New Skill\n\nEnter a name for your skill:");
      if (!newName) return;
      newName = newName.trim();

      const existingNames = props.report?.skills.map(s => s.name.toLowerCase()) || [];
      if (existingNames.includes(newName.toLowerCase())) {
        alert(`A skill named "${newName}" already exists.`);
        return;
      }

      props.client?.request("skills.create", {
        skillName: newName,
        content: TEMPLATE_CONTENT,
        category: "custom"
      }).then((result: any) => {
        if (result?.success || result?.ok) {
          alert(`Skill "${newName}" created successfully!`);
          props.onRefresh();
          props.onSelectSkill(null);
        }
      }).catch((err: any) => {
        alert(`Failed to create skill: ${err}`);
      });
    }}
        >
          📋 Clone Template
        </button>
      </div>
    </div>
  `;
}

function renderSkillDetailModal(props: SkillsMarketplaceProps, skill: SkillStatusEntry) {
  return html`
    <div 
      class="detail-modal-overlay"
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.75); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 2rem; backdrop-filter: blur(4px);"
      @click=${(e: Event) => {
      if (e.target === e.currentTarget) props.onSelectSkill(null);
    }}
    >
      <div 
        class="detail-modal-content"
        style="background: var(--card, #1a1a2e); border-radius: 12px; max-width: 700px; width: 100%; max-height: calc(100vh - 4rem); overflow-y: auto; border: 1px solid var(--border, #333); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); padding: 1.5rem;"
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div class="card-title" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${skill.emoji ? html`<span>${skill.emoji}</span>` : nothing}
            <span>${skill.name}</span>
          </div>
          <button
            class="btn btn-sm"
            style="background: transparent; color: #9ca3af;"
            @click=${() => props.onSelectSkill(null)}
          >
            ✕
          </button>
        </div>
        
        <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(168, 85, 247, 0.1); border-radius: 0.5rem; border-left: 3px solid #a855f7;">
          <div style="font-size: 0.875rem; color: #d1d5db; line-height: 1.5;">
            ${skill.description || "No description available"}
          </div>
          <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <span class="chip">${skill.source}</span>
            <span class="chip ${skill.eligible ? "chip-ok" : "chip-warn"}">
              ${skill.eligible ? "eligible" : "blocked"}
            </span>
            <span class="chip">${getSkillCategory(skill)}</span>
          </div>
        </div>

        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(0, 0, 0, 0.2); border-radius: 0.5rem;">
          <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <span style="font-weight: 500; color: #d1d5db;">Enable Skill</span>
            <input
              type="checkbox"
              .checked=${!skill.disabled}
              @change=${(e: Event) => {
      props.onToggle(skill.skillKey, !(e.target as HTMLInputElement).checked);
    }}
              style="width: 2.5rem; height: 1.25rem; cursor: pointer;"
            />
          </label>
        </div>

        ${skill.primaryEnv ? html`
          <div style="margin-bottom: 1rem;">
            <label class="field">
              <span>API Key (${skill.primaryEnv})</span>
              <input
                type="password"
                .value=${props.edits[skill.skillKey] ?? ""}
                @input=${(e: Event) =>
        props.onEdit(skill.skillKey, (e.target as HTMLInputElement).value)}
                placeholder="Enter API key..."
              />
            </label>
            <button
              class="btn primary"
              style="margin-top: 0.5rem; width: 100%;"
              ?disabled=${props.busyKey === skill.skillKey}
              @click=${() => props.onSaveKey(skill.skillKey)}
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
      await props.onLoadSkillContent(skill.skillKey);
    }}
          >
            📝 Edit Code
          </button>
          <button
            class="btn"
            style="background: #10b981; color: white;"
            @click=${() => props.onTestSkill(skill.skillKey)}
            ?disabled=${props.busyKey === skill.skillKey}
          >
            🧪 Test
          </button>
          <button
            class="btn"
            style="background: #a855f7; color: white;"
            @click=${async () => {
      let newName = prompt(`Clone "${skill.name}"\\n\\nEnter a name for the cloned skill:`);
      if (!newName) return;
      newName = newName.trim();

      const existingNames = props.report?.skills.map(s => s.name.toLowerCase()) || [];
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
        await props.onLoadSkillContent(skill.skillKey);
      }

      try {
        const result = await props.client?.request("skills.create", {
          skillName: finalName,
          content: props.editingContent,
          category: "custom"
        });
        if ((result as any)?.success || (result as any)?.ok) {
          alert(`Successfully cloned skill as "${finalName}"`);
          props.onRefresh();
        }
      } catch (err) {
        alert(`Failed to clone skill: ${err}`);
      }
    }}
            ?disabled=${props.busyKey === skill.skillKey}
          >
            📋 Clone
          </button>
          ${skill.source !== "openclaw-bundled" ? html`
            <button
              class="btn"
              style="background: #ef4444; color: white;"
              @click=${() => {
        if (confirm(`Delete "${skill.name}"? This cannot be undone.`)) {
          props.onDeleteSkill(skill.skillKey);
        }
      }}
            >
              🗑️ Delete
            </button>
          ` : nothing}
        </div>

        ${props.editingContent || props.edits[skill.skillKey + "_content"] ? html`
          <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <span style="font-weight: 500; color: #d1d5db;">SKILL.md</span>
              <div style="display: flex; gap: 0.5rem;">
                <button
                  class="btn btn-sm"
                  style="background: transparent; color: #9ca3af;"
                  @click=${() => props.onEdit(skill.skillKey + "_content", "")}
                >
                  ✕ Close
                </button>
                <button
                  class="btn btn-sm"
                  style="background: #10b981; color: white;"
                  @click=${() => {
        const content = props.editingContent || props.edits[skill.skillKey + "_content"] || "";
        props.onSaveSkillContent(skill.skillKey, content);
      }}
                >
                  💾 Save
                </button>
              </div>
            </div>
            <textarea
              .value=${props.editingContent || props.edits[skill.skillKey + "_content"] || ""}
              @input=${(e: Event) => props.onEdit(skill.skillKey + "_content", (e.target as HTMLTextAreaElement).value)}
              style="
                width: 100%;
                min-height: 400px;
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

        ${props.messages[skill.skillKey] ? html`
          <div
            class="muted"
            style="margin-top: 1rem; padding: 0.75rem; border-radius: 0.5rem; background: ${props.messages[skill.skillKey].kind === "error" ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)"}; color: ${props.messages[skill.skillKey].kind === "error" ? "#ef4444" : "#10b981"};"
          >
            ${props.messages[skill.skillKey].message}
          </div>
        ` : nothing}
      </div>
    </div>
  `;
}

function renderCreateSkillModal(props: SkillsMarketplaceProps) {
  return html`
    <div
      style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 1rem; overflow: hidden;"
      @click=${(e: Event) => {
      if ((e.target as HTMLElement).style.position === "fixed") {
        props.onCloseCreateSkillModal();
      }
    }}
    >
      <div
        style="background: #1f2937; border-radius: 0.75rem; width: 100%; max-width: min(900px, 95vw); height: 100%; max-height: min(90vh, calc(100vh - 2rem)); display: flex; flex-direction: column; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);"
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem; border-bottom: 1px solid #374151; flex-shrink: 0;">
          <h2 style="margin: 0; font-size: 1.5rem; font-weight: 600; color: white;">Create New Skill</h2>
          <button
            class="btn btn-sm"
            style="background: transparent; color: #9ca3af; font-size: 1.5rem; padding: 0.25rem 0.5rem; cursor: pointer;"
            @click=${props.onCloseCreateSkillModal}
          >
            ✕
          </button>
        </div>
        
        <div style="flex: 1; overflow-y: auto; padding: 1.5rem;">
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">Skill Name *</label>
            <input
              type="text"
              .value=${props.newSkillName}
              @input=${(e: Event) => props.onNewSkillNameChange((e.target as HTMLInputElement).value)}
              placeholder="e.g., My Awesome Skill"
              style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; font-size: 1rem;"
              required
            />
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">Category *</label>
            <select
              .value=${props.newSkillCategory}
              @change=${(e: Event) => props.onNewSkillCategoryChange((e.target as HTMLSelectElement).value)}
              style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; font-size: 1rem;"
              required
            >
              <option value="">Select a category...</option>
              ${SKILL_CATEGORIES.map(cat => html`<option value="${cat}">${cat}</option>`)}
            </select>
          </div>
          
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500; color: #d1d5db;">Skill Content (SKILL.md) *</label>
            <textarea
              .value=${props.newSkillContent}
              @input=${(e: Event) => props.onNewSkillContentChange((e.target as HTMLTextAreaElement).value)}
              placeholder="Enter skill content..."
              style="background: #111827; border: 1px solid #374151; color: white; padding: 0.75rem; border-radius: 0.5rem; width: 100%; min-height: 400px; font-family: monospace; font-size: 0.875rem; line-height: 1.6; resize: vertical;"
              required
            ></textarea>
          </div>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: flex-end; padding: 1.5rem; border-top: 1px solid #374151; flex-shrink: 0;">
          <button
            class="btn"
            style="background: transparent; border: 1px solid #374151; color: #9ca3af; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer;"
            @click=${props.onCloseCreateSkillModal}
          >
            Cancel
          </button>
          <button
            class="btn"
            style="background: #a855f7; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; cursor: pointer; font-weight: 600;"
            @click=${props.onSaveNewSkill}
            ?disabled=${!props.newSkillName.trim() || !props.newSkillCategory}
          >
            Create Skill
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderSkillCard(skill: SkillStatusEntry, props: SkillsMarketplaceProps) {
  const skillKey = skill.skillKey || skill.name;
  const isSelected = props.selectedSkillKey === skillKey;
  const busy = props.busyKey === skillKey;
  const missing = [
    ...skill.missing.bins.map((b) => `bin:${b}`),
    ...skill.missing.env.map((e) => `env:${e}`),
    ...skill.missing.config.map((c) => `config:${c}`),
    ...skill.missing.os.map((o) => `os:${o}`),
  ];
  const canInstall = skill.install.length > 0 && skill.missing.bins.length > 0;
  const category = getSkillCategory(skill);

  const categoryColors: Record<string, string> = {
    "Development": "#3b82f6",
    "Communication": "#8b5cf6",
    "Media": "#ec4899",
    "Files": "#10b981",
    "APIs": "#f59e0b",
    "AI & ML": "#06b6d4",
    "Database": "#84cc16",
    "Security": "#ef4444",
    "DevOps": "#6366f1",
    "Other": "#6b7280",
  };

  const categoryColor = categoryColors[category] || "#6b7280";

  return html`
    <div
      class="skill-card"
      style="cursor: pointer; transition: all 0.3s ease; border: 2px solid ${isSelected ? categoryColor : "rgba(255, 255, 255, 0.1)"}; background: ${isSelected ? `rgba(${parseInt(categoryColor.slice(1, 3), 16)}, ${parseInt(categoryColor.slice(3, 5), 16)}, ${parseInt(categoryColor.slice(5, 7), 16)}, 0.15)` : "linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)"}; box-shadow: ${isSelected ? `0 8px 16px rgba(${parseInt(categoryColor.slice(1, 3), 16)}, ${parseInt(categoryColor.slice(3, 5), 16)}, ${parseInt(categoryColor.slice(5, 7), 16)}, 0.3)` : "0 4px 6px rgba(0, 0, 0, 0.3)"}; transform: ${isSelected ? "translateY(-2px)" : "none"}; position: relative; overflow: hidden;"
      @click=${() => props.onSelectSkill(skillKey)}
    >
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${categoryColor} 0%, ${categoryColor}dd 100%);"></div>
      <div style="padding: 1rem; padding-top: 1.5rem;">
        <div style="display: flex; align-items: start; justify-content: space-between; margin-bottom: 0.75rem;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
              ${skill.emoji ? html`<span style="font-size: 2rem; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));">${skill.emoji}</span>` : nothing}
              <div style="font-weight: 700; color: #f3f4f6; font-size: 1.125rem;">${skill.name}</div>
            </div>
            <div style="font-size: 0.875rem; color: #d1d5db; line-height: 1.5; margin-bottom: 0.75rem; min-height: 2.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${skill.description || html`<span style="color: #6b7280; font-style: italic;">No description</span>`}
            </div>
          </div>
          <label style="display: flex; align-items: center; cursor: pointer; position: relative; z-index: 10;" @click=${(e: Event) => e.stopPropagation()}>
            <input
              type="checkbox"
              .checked=${!skill.disabled}
              @change=${(e: Event) => props.onToggle(skillKey, !(e.target as HTMLInputElement).checked)}
              style="width: 1.75rem; height: 1.75rem; cursor: pointer; accent-color: ${categoryColor};"
            />
          </label>
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
          <span class="chip" style="font-size: 0.7rem; font-weight: 600; background: ${categoryColor}20; color: ${categoryColor}; border: 1px solid ${categoryColor}40; padding: 0.25rem 0.75rem;">${category}</span>
          <span class="chip ${skill.eligible ? "chip-ok" : "chip-warn"}" style="font-size: 0.7rem; font-weight: 600;">
            ${skill.eligible ? "✓ Ready" : "✗ Blocked"}
          </span>
        </div>

        ${missing.length > 0 ? html`
          <div style="font-size: 0.75rem; color: #f59e0b; margin-bottom: 0.5rem; padding: 0.5rem; background: rgba(245, 158, 11, 0.1); border-radius: 0.25rem; border-left: 3px solid #f59e0b;">
            ⚠️ Missing: ${missing.slice(0, 2).join(", ")}${missing.length > 2 ? ` +${missing.length - 2}` : ""}
          </div>
        ` : nothing}

        ${canInstall ? html`
          <button
            class="btn btn-sm"
            style="width: 100%; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; margin-top: 0.5rem; font-weight: 600; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);"
            ?disabled=${busy}
            @click=${(e: Event) => {
        e.stopPropagation();
        props.onInstall(skillKey, skill.name, skill.install[0].id);
      }}
          >
            ${busy ? "Installing…" : `📦 ${skill.install[0].label}`}
          </button>
        ` : nothing}
      </div>
    </div>
  `;
}

// Separate function to render modals OUTSIDE the main content area
// This must be called at the app-render level, after </main>, to ensure proper fixed positioning
export function renderSkillsModals(props: SkillsMarketplaceProps) {
  const skills = props.report?.skills ?? [];
  const selectedSkill = props.selectedSkillKey
    ? skills.find((s: SkillStatusEntry) => s.skillKey === props.selectedSkillKey || s.name === props.selectedSkillKey)
    : null;

  return html`
    ${props.selectedSkillKey === '__TEMPLATE__' ? renderTemplateModal(props) : nothing}
    ${props.selectedSkillKey && props.selectedSkillKey !== '__TEMPLATE__' && selectedSkill
      ? renderSkillDetailModal(props, selectedSkill)
      : nothing}
    ${props.showCreateSkillModal ? renderCreateSkillModal(props) : nothing}
  `;
}

export function renderSkillsMarketplace(props: SkillsMarketplaceProps) {
  const skills = props.report?.skills ?? [];
  const filter = props.filter.trim().toLowerCase();

  let filtered = skills;
  if (filter) {
    filtered = filtered.filter((skill: SkillStatusEntry) =>
      [skill.name, skill.description, skill.source].join(" ").toLowerCase().includes(filter)
    );
  }
  if (props.categoryFilter && props.categoryFilter !== "all") {
    filtered = filtered.filter((skill: SkillStatusEntry) => getSkillCategory(skill) === props.categoryFilter);
  }

  // Note: Modals are now rendered separately via renderSkillsModals() in app-render.ts
  // to ensure they appear outside <main> and use proper fixed positioning

  return html`

    <div style="height: calc(100vh - 200px);">
      <section class="card">
        <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <div>
            <div class="card-title" style="display: flex; align-items: center; gap: 0.75rem;">
              <span>🛍️ Skills Marketplace</span>
              <button
                class="btn btn-xs"
                style="background: transparent; color: #9ca3af; padding: 0.25rem;"
                title="What are skills?"
                @click=${() => { helpModalOpen = true; }}
              >
                ❓
              </button>
            </div>
            <div class="card-sub">Browse, manage, and create skills to extend your agent's capabilities.</div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button
              class="btn"
              style="background: #a855f7; color: white; font-weight: 600;"
              @click=${props.onCreateSkill}
              title="Create a new skill"
            >
              ➕ New Skill
            </button>
            <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
              ${props.loading ? "Loading…" : "🔄 Refresh"}
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr auto; gap: 1rem; margin-bottom: 1.5rem;">
          <label class="field" style="flex: 1;">
            <span>🔍 Search</span>
            <input
              .value=${props.filter}
              @input=${(e: Event) => props.onFilterChange((e.target as HTMLInputElement).value)}
              placeholder="Search skills by name, description, or source..."
            />
          </label>
          <label class="field" style="width: 220px;">
            <span>📁 Category</span>
            <select
              .value=${props.categoryFilter}
              @change=${(e: Event) => props.onCategoryFilterChange((e.target as HTMLSelectElement).value)}
            >
              <option value="all">All Categories</option>
              ${SKILL_CATEGORIES.map(cat => html`<option value="${cat}">${cat}</option>`)}
            </select>
          </label>
        </div>

        ${props.error ? html`<div class="callout danger" style="margin-bottom: 1rem;">${props.error}</div>` : nothing}

        ${filtered.length === 0 && !props.loading ? html`
          <div class="muted" style="text-align: center; padding: 3rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
            <div style="font-size: 1.25rem; font-weight: 600; color: #d1d5db; margin-bottom: 0.5rem;">No skills found</div>
            <div style="font-size: 0.875rem;">
              ${filter || props.categoryFilter !== "all" ? "Try adjusting your filters" : "Click 'New Skill' to create your first skill"}
            </div>
          </div>
        ` : html`
          <div class="skills-grid" style="margin-top: 16px;">
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
              @click=${() => props.onSelectSkill('__TEMPLATE__')}
            >
              <div style="position: absolute; top: 0.75rem; right: 0.75rem; background: #a855f7; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.625rem; font-weight: 600;">TEMPLATE</div>
              <div style="font-size: 2rem; margin-bottom: 0.75rem;">📋</div>
              <div style="font-weight: 600; color: #d1d5db; margin-bottom: 0.5rem;">Skill Template</div>
              <div style="font-size: 0.75rem; color: #9ca3af; line-height: 1.5; margin-bottom: 0.75rem;">
                Click to create a new skill from this template.
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: #a855f7; font-weight: 500;">
                <span>➕</span>
                <span>Create New Skill</span>
              </div>
            </div>

            ${filtered.map(skill => renderSkillCard(skill, props))}
          </div>
          <div style="margin-top: 1rem; text-align: center; color: #9ca3af; font-size: 0.875rem;">
            Showing ${filtered.length} of ${skills.length} skills
          </div>
        `}
      </section>
    </div>

    ${renderHelpModal({
    isOpen: helpModalOpen,
    title: "What are Skills?",
    content: html`
        <p>Skills are modular, self-contained packages that extend OpenClaw's capabilities.</p>
        <h4>What Skills Provide:</h4>
        <ul>
          <li><strong>Specialized workflows</strong> - Pre-built automation sequences</li>
          <li><strong>Tool integrations</strong> - Connect with external services and APIs</li>
          <li><strong>Domain expertise</strong> - Industry-specific knowledge and patterns</li>
        </ul>
        <h4>Skills vs Tools:</h4>
        <p>
          <strong>Skills</strong> are <em>instructions</em> that agents follow.<br>
          <strong>Tools</strong> are <em>functions</em> that agents can call.
        </p>
      `,
    onClose: () => { helpModalOpen = false; },
  })}
  `;
}
