import { html, nothing } from "lit";
import type { GatewayAgentRow, AgentStatus } from "../types";

export type AgentModalTab = 'info' | 'soul' | 'user' | 'agents';

export type AgentModalProps = {
  visible: boolean;
  agent: GatewayAgentRow | null;  // null = create new, otherwise edit
  activeTab: AgentModalTab;
  isSubmitting: boolean;
  form: AgentFormData;
  onTabChange: (tab: AgentModalTab) => void;
  onFormChange: (field: keyof AgentFormData, value: string | boolean) => void;
  onSave: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export type AgentFormData = {
  name: string;
  role: string;
  description: string;
  avatar_emoji: string;
  status: AgentStatus;
  is_master: boolean;
  soul_md: string;
  user_md: string;
  agents_md: string;
};

export const EMOJI_OPTIONS = ['🤖', '🦞', '💻', '🔍', '✍️', '🎨', '📊', '🧠', '⚡', '🚀', '🎯', '🔧', '👤', '🛡️', '📝', '🔬'];

export function createEmptyAgentForm(): AgentFormData {
  return {
    name: '',
    role: '',
    description: '',
    avatar_emoji: '🤖',
    status: 'standby',
    is_master: false,
    soul_md: '',
    user_md: '',
    agents_md: '',
  };
}

export function agentToFormData(agent: GatewayAgentRow): AgentFormData {
  return {
    name: agent.name || agent.identity?.name || '',
    role: agent.role || '',
    description: agent.description || '',
    avatar_emoji: agent.avatar_emoji || agent.identity?.emoji || '🤖',
    status: agent.status || 'standby',
    is_master: agent.is_master || false,
    soul_md: agent.soul_md || '',
    user_md: agent.user_md || '',
    agents_md: agent.agents_md || '',
  };
}

export function renderAgentModal(props: AgentModalProps) {
  if (!props.visible) return nothing;

  const isEditing = props.agent !== null;
  const title = isEditing ? `Edit ${props.agent?.name || 'Agent'}` : 'Create New Agent';

  const tabs: Array<{ id: AgentModalTab; label: string }> = [
    { id: 'info', label: 'Info' },
    { id: 'soul', label: 'SOUL.md' },
    { id: 'user', label: 'USER.md' },
    { id: 'agents', label: 'AGENTS.md' },
  ];

  return html`
    <div class="modal-backdrop" style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 16px;">
      <div class="modal-content" style="background: var(--bg-elevated, #1e1e2e); border: 1px solid var(--border, #3a3a4a); border-radius: 12px; width: 100%; max-width: 640px; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-bottom: 1px solid var(--border, #3a3a4a);">
          <h2 style="margin: 0; font-size: 1.125rem; font-weight: 600;">${title}</h2>
          <button 
            style="background: none; border: none; color: var(--text, #e0e0e0); cursor: pointer; padding: 4px; font-size: 1.25rem;"
            @click=${props.onClose}
          >✕</button>
        </div>

        <!-- Tabs -->
        <div style="display: flex; border-bottom: 1px solid var(--border, #3a3a4a);">
          ${tabs.map(tab => html`
            <button
              style="padding: 10px 16px; font-size: 0.875rem; font-weight: 500; background: none; border: none; border-bottom: 2px solid ${props.activeTab === tab.id ? 'var(--accent, #a855f7)' : 'transparent'}; color: ${props.activeTab === tab.id ? 'var(--accent, #a855f7)' : 'var(--muted, #888)'}; cursor: pointer; transition: all 0.2s;"
              @click=${() => props.onTabChange(tab.id)}
            >${tab.label}</button>
          `)}
        </div>

        <!-- Content -->
        <div style="flex: 1; overflow-y: auto; padding: 16px;">
          ${props.activeTab === 'info' ? renderInfoTab(props) : nothing}
          ${props.activeTab === 'soul' ? renderSoulTab(props) : nothing}
          ${props.activeTab === 'user' ? renderUserTab(props) : nothing}
          ${props.activeTab === 'agents' ? renderAgentsTab(props) : nothing}
        </div>

        <!-- Footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-top: 1px solid var(--border, #3a3a4a);">
          <div>
            ${isEditing ? html`
              <button 
                style="display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.875rem; border-radius: 6px;"
                @click=${props.onDelete}
              >🗑️ Delete</button>
            ` : nothing}
          </div>
          <div style="display: flex; gap: 8px;">
            <button 
              style="padding: 8px 16px; background: transparent; border: none; color: var(--muted, #888); cursor: pointer; font-size: 0.875rem;"
              @click=${props.onClose}
            >Cancel</button>
            <button 
              style="display: flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--accent, #a855f7); color: #000; border: none; border-radius: 6px; cursor: pointer; font-size: 0.875rem; font-weight: 500; opacity: ${props.isSubmitting ? '0.5' : '1'};"
              ?disabled=${props.isSubmitting}
              @click=${props.onSave}
            >💾 ${props.isSubmitting ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderInfoTab(props: AgentModalProps) {
  return html`
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <!-- Avatar Selection -->
      <div>
        <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 8px;">Avatar</label>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${EMOJI_OPTIONS.map(emoji => html`
            <button
              type="button"
              style="font-size: 1.5rem; padding: 8px; border-radius: 8px; border: none; cursor: pointer; background: ${props.form.avatar_emoji === emoji ? 'rgba(168, 85, 247, 0.2)' : 'transparent'}; outline: ${props.form.avatar_emoji === emoji ? '2px solid var(--accent, #a855f7)' : 'none'};"
              @click=${() => props.onFormChange('avatar_emoji', emoji)}
            >${emoji}</button>
          `)}
        </div>
      </div>

      <!-- Name -->
      <div>
        <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Name</label>
        <input
          type="text"
          .value=${props.form.name}
          @input=${(e: Event) => props.onFormChange('name', (e.target as HTMLInputElement).value)}
          placeholder="Agent name"
          style="width: 100%; padding: 8px 12px; background: var(--bg, #141420); border: 1px solid var(--border, #3a3a4a); border-radius: 6px; color: var(--text, #e0e0e0); font-size: 0.875rem;"
        />
      </div>

      <!-- Role -->
      <div>
        <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Role</label>
        <input
          type="text"
          .value=${props.form.role}
          @input=${(e: Event) => props.onFormChange('role', (e.target as HTMLInputElement).value)}
          placeholder="e.g., Code & Automation"
          style="width: 100%; padding: 8px 12px; background: var(--bg, #141420); border: 1px solid var(--border, #3a3a4a); border-radius: 6px; color: var(--text, #e0e0e0); font-size: 0.875rem;"
        />
      </div>

      <!-- Description -->
      <div>
        <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Description</label>
        <textarea
          .value=${props.form.description}
          @input=${(e: Event) => props.onFormChange('description', (e.target as HTMLTextAreaElement).value)}
          placeholder="What does this agent do?"
          rows="2"
          style="width: 100%; padding: 8px 12px; background: var(--bg, #141420); border: 1px solid var(--border, #3a3a4a); border-radius: 6px; color: var(--text, #e0e0e0); font-size: 0.875rem; resize: none;"
        ></textarea>
      </div>

      <!-- Status -->
      <div>
        <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 4px;">Status</label>
        <select
          .value=${props.form.status}
          @change=${(e: Event) => props.onFormChange('status', (e.target as HTMLSelectElement).value)}
          style="width: 100%; padding: 8px 12px; background: var(--bg, #141420); border: 1px solid var(--border, #3a3a4a); border-radius: 6px; color: var(--text, #e0e0e0); font-size: 0.875rem;"
        >
          <option value="standby">Standby</option>
          <option value="working">Working</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <!-- Master Toggle -->
      <div style="display: flex; align-items: center; gap: 8px;">
        <input
          type="checkbox"
          id="is_master"
          .checked=${props.form.is_master}
          @change=${(e: Event) => props.onFormChange('is_master', (e.target as HTMLInputElement).checked)}
          style="width: 16px; height: 16px;"
        />
        <label for="is_master" style="font-size: 0.875rem;">
          Master Orchestrator (can coordinate other agents)
        </label>
      </div>
    </div>
  `;
}

function renderSoulTab(props: AgentModalProps) {
  return html`
    <div>
      <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 8px;">
        SOUL.md — Agent Personality & Identity
      </label>
      <div style="font-size: 0.75rem; color: var(--muted, #888); margin-bottom: 8px;">
        Define this agent's core identity, personality traits, values, and communication style.
      </div>
      <textarea
        .value=${props.form.soul_md}
        @input=${(e: Event) => props.onFormChange('soul_md', (e.target as HTMLTextAreaElement).value)}
        placeholder="# Agent Name

## Personality
- Trait 1
- Trait 2

## Communication Style
..."
        rows="18"
        style="width: 100%; padding: 12px; background: var(--bg, #141420); border: 1px solid var(--border, #3a3a4a); border-radius: 6px; color: var(--text, #e0e0e0); font-size: 0.875rem; font-family: var(--mono, monospace); resize: vertical; min-height: 300px;"
      ></textarea>
    </div>
  `;
}

function renderUserTab(props: AgentModalProps) {
  return html`
    <div>
      <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 8px;">
        USER.md — Context About the Human
      </label>
      <div style="font-size: 0.75rem; color: var(--muted, #888); margin-bottom: 8px;">
        Information about the human(s) this agent works with — preferences, goals, communication style.
      </div>
      <textarea
        .value=${props.form.user_md}
        @input=${(e: Event) => props.onFormChange('user_md', (e.target as HTMLTextAreaElement).value)}
        placeholder="# User Context

## Preferences
...

## Goals
...

## Communication Style
..."
        rows="18"
        style="width: 100%; padding: 12px; background: var(--bg, #141420); border: 1px solid var(--border, #3a3a4a); border-radius: 6px; color: var(--text, #e0e0e0); font-size: 0.875rem; font-family: var(--mono, monospace); resize: vertical; min-height: 300px;"
      ></textarea>
    </div>
  `;
}

function renderAgentsTab(props: AgentModalProps) {
  return html`
    <div>
      <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 8px;">
        AGENTS.md — Team Awareness
      </label>
      <div style="font-size: 0.75rem; color: var(--muted, #888); margin-bottom: 8px;">
        Information about other agents in the system — who they are and how to collaborate with them.
      </div>
      <textarea
        .value=${props.form.agents_md}
        @input=${(e: Event) => props.onFormChange('agents_md', (e.target as HTMLTextAreaElement).value)}
        placeholder="# Team Roster

## Charlie (Master Orchestrator)
...

## Other Agents
..."
        rows="18"
        style="width: 100%; padding: 12px; background: var(--bg, #141420); border: 1px solid var(--border, #3a3a4a); border-radius: 6px; color: var(--text, #e0e0e0); font-size: 0.875rem; font-family: var(--mono, monospace); resize: vertical; min-height: 300px;"
      ></textarea>
    </div>
  `;
}
