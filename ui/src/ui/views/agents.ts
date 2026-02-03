import { html, nothing } from "lit";
import type { AgentsListResult, GatewayAgentRow } from "../types";
import { formatAgo } from "../format.js";

export type AgentsProps = {
  loading: boolean;
  agentsList: AgentsListResult | null;
  error: string | null;
  onRefresh: () => void;
  onEditAgent: (agent: GatewayAgentRow) => void;
  onCreateAgent: () => void;
};

export function renderAgents(props: AgentsProps) {
  const agents = props.agentsList?.agents ?? [];

  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div>
          <div class="card-title">Agents</div>
          <div class="card-sub">Manage your assistant roster and sub-agents.</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn primary" @click=${props.onCreateAgent}>
            + Create Agent
          </button>
           <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
            ${props.loading ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>


      ${props.error ? html`<div class="callout danger" style="margin-top: 12px;">${props.error}</div>` : nothing}

      <div class="list" style="margin-top: 16px;">
        ${agents.length === 0
          ? html`<div class="muted" style="padding: 20px; text-align: center;">No agents found. Refresh to load available agents.</div>`
          : agents.map((agent) => renderAgentRow(agent, props.onEditAgent))}
      </div>
    </section>

    <!-- Mission Control Style Roster (Inspired by reference repo) -->
    <section class="card" style="margin-top: 24px; border-top: 2px solid var(--ok, #10b981);">
       <div class="card-title" style="display: flex; align-items: center; gap: 8px;">
         <span style="color: var(--ok, #10b981);">●</span> Mission Roster
       </div>
       <div class="card-sub">Active agents across all projects and sessions.</div>
       
       <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 16px;">
         ${agents.map(agent => renderAgentCard(agent, props.onEditAgent))}
       </div>
    </section>
  `;
}

function renderAgentRow(agent: GatewayAgentRow, onEditAgent: (agent: GatewayAgentRow) => void) {
  const identity = agent.identity ?? {};
  const name = identity.name || agent.name || agent.id;
  const emoji = identity.emoji || "🤖";
  const avatarUrl = identity.avatarUrl;

  return html`
    <div class="list-item">
      <div class="row" style="gap: 12px; align-items: center;">
        <div style="width: 40px; height: 40px; background: rgba(168, 85, 247, 0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; font-size: 20px; border: 1px solid rgba(168, 85, 247, 0.2);">
          ${avatarUrl ? html`<img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" />` : emoji}
        </div>
        <div class="list-main">
          <div class="list-title" style="font-weight: 600;">${name}</div>
          <div class="list-sub" style="font-family: var(--mono); font-size: 0.75rem; opacity: 0.7;">${agent.id}</div>
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="gap: 8px;">
          <button class="btn btn--sm" @click=${() => onEditAgent(agent)}>Context</button>
          <button class="btn btn--sm primary" @click=${() => alert('Starting session...')}>Chat</button>
        </div>
      </div>
    </div>
  `;
}

function renderAgentCard(agent: GatewayAgentRow, onEditAgent: (agent: GatewayAgentRow) => void) {
  const identity = agent.identity ?? {};
  const name = identity.name || agent.name || agent.id;
  const emoji = identity.emoji || "🤖";
  const avatarUrl = identity.avatarUrl;
  
  // Fake status for now, will be wired to sessions later
  const status = Math.random() > 0.7 ? "Working" : "Standby";
  const statusColor = status === "Working" ? "var(--ok)" : "var(--muted)";

  return html`
    <div style="background: var(--bg-elevated); border: 1px solid var(--border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; transition: transform 0.2s, border-color 0.2s;" class="agent-card-hover">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="width: 48px; height: 48px; background: rgba(168, 85, 247, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; border: 1px solid rgba(168, 85, 247, 0.2);">
           ${avatarUrl ? html`<img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" />` : emoji}
        </div>
        <div style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 8px; border-radius: 4px; background: ${status === 'Working' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)'}; color: ${statusColor}; border: 1px solid ${status === 'Working' ? 'rgba(34, 197, 94, 0.2)' : 'var(--border)'};">
          ${status}
        </div>
      </div>
      
      <div>
        <div style="font-weight: 700; font-size: 1rem; color: var(--text-strong);">${name}</div>
        <div style="font-size: 0.8rem; color: var(--muted); margin-top: 2px;">Core Assistant Agent</div>
      </div>
      
      <div style="border-top: 1px solid var(--border); padding-top: 12px; margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
         <div style="font-size: 0.75rem; color: var(--muted-strong); font-family: var(--mono);">${agent.id.slice(0, 12)}...</div>
         <button style="background: transparent; border: 1px solid var(--border); color: var(--text); padding: 4px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer;" @click=${() => onEditAgent(agent)}>Manage</button>
      </div>
    </div>
  `;
}
