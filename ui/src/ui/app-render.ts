import { html, nothing } from "lit";
import type { AppViewState } from "./app-view-state";
import type { GatewayBrowserClient, GatewayHelloOk } from "./gateway";
import type { UiSettings } from "./storage";
import type { ThemeMode } from "./theme";
import type { ThemeTransitionContext } from "./theme-transition";
import type {
  ConfigSnapshot,
  CronJob,
  CronRunLogEntry,
  CronStatus,
  HealthSnapshot,
  LogEntry,
  LogLevel,
  PresenceEntry,
  ChannelsStatusSnapshot,
  SessionsListResult,
  SkillStatusReport,
  StatusSummary,
} from "./types";
import type { ChatQueueItem, CronFormState } from "./ui-types";
import { parseAgentSessionKey } from "../../../src/routing/session-key.js";
import { refreshChatAvatar } from "./app-chat";
import { renderChatControls, renderTab, renderThemeToggle } from "./app-render.helpers";
import { loadAgents } from "./controllers/agents";
import { loadChannels } from "./controllers/channels";
import { loadChatHistory } from "./controllers/chat";
import {
  applyConfig,
  loadConfig,
  runUpdate,
  saveConfig,
  updateConfigFormValue,
  removeConfigFormValue,
} from "./controllers/config";
import {
  loadCronRuns,
  toggleCronJob,
  runCronJob,
  removeCronJob,
  addCronJob,
} from "./controllers/cron";
import { loadDebug, callDebugMethod } from "./controllers/debug";
import {
  approveDevicePairing,
  loadDevices,
  rejectDevicePairing,
  revokeDeviceToken,
  rotateDeviceToken,
} from "./controllers/devices";
import {
  loadExecApprovals,
  removeExecApprovalsFormValue,
  saveExecApprovals,
  updateExecApprovalsFormValue,
} from "./controllers/exec-approvals";
import { loadLogs } from "./controllers/logs";
import { loadNodes } from "./controllers/nodes";
import { loadPresence } from "./controllers/presence";
import { deleteSession, loadSessions, patchSession } from "./controllers/sessions";
import {
  installSkill,
  loadSkills,
  saveSkillApiKey,
  updateSkillEdit,
  updateSkillEnabled,
  type SkillMessage,
} from "./controllers/skills";
import {
  installTool,
  loadTools,
  saveToolApiKey,
  updateToolEdit,
  updateToolEnabled,
  type ToolMessage,
} from "./controllers/tools";
import { icons } from "./icons";
import {
  TAB_GROUPS,
  iconForTab,
  pathForTab,
  subtitleForTab,
  titleForTab,
  type Tab,
} from "./navigation";
import { renderAgents } from "./views/agents";
import { renderAgentModal, agentToFormData, createEmptyAgentForm } from "./views/agent-modal";
import { renderChannels } from "./views/channels";
import { renderChat } from "./views/chat";
import { renderConfig } from "./views/config";
import { renderCron } from "./views/cron";
import { renderDebug } from "./views/debug";
import { renderExecApprovalPrompt } from "./views/exec-approval";
import { renderGatewayUrlConfirmation } from "./views/gateway-url-confirmation";
import { renderInstances } from "./views/instances";
import { renderLogs } from "./views/logs";
import { renderNodes } from "./views/nodes";
import { renderOverview } from "./views/overview";
import { renderSessions } from "./views/sessions";
import { renderSkills } from "./views/skills";
import { renderSkillsMarketplace, renderSkillsModals } from "./views/skills-marketplace";
import { renderToolsMarketplace, renderToolsModals } from "./views/tools-marketplace";
import { renderWizard } from "./views/wizard";
import { renderWorkspacePrompts } from "./views/workspace-prompts";

const AVATAR_DATA_RE = /^data:/i;
const AVATAR_HTTP_RE = /^https?:\/\//i;

function resolveAssistantAvatarUrl(state: AppViewState): string | undefined {
  const list = state.agentsList?.agents ?? [];
  const parsed = parseAgentSessionKey(state.sessionKey);
  const agentId = parsed?.agentId ?? state.agentsList?.defaultId ?? "main";
  const agent = list.find((entry) => entry.id === agentId);
  const identity = agent?.identity;
  const candidate = identity?.avatarUrl ?? identity?.avatar;
  if (!candidate) return undefined;
  if (AVATAR_DATA_RE.test(candidate) || AVATAR_HTTP_RE.test(candidate)) return candidate;
  return identity?.avatarUrl;
}

export function renderApp(state: AppViewState) {
  const presenceCount = state.presenceEntries.length;
  const sessionsCount = state.sessionsResult?.count ?? null;
  const cronNext = state.cronStatus?.nextWakeAtMs ?? null;
  const chatDisabledReason = state.connected ? null : "Disconnected from gateway.";
  const isChat = state.tab === "chat";
  const chatFocus = isChat && (state.settings.chatFocusMode || state.onboarding);
  const showThinking = state.onboarding ? false : state.settings.chatShowThinking;
  const assistantAvatarUrl = resolveAssistantAvatarUrl(state);
  const chatAvatarUrl = state.chatAvatarUrl ?? assistantAvatarUrl ?? null;

  return html`
    <div class="shell ${isChat ? "shell--chat" : ""} ${chatFocus ? "shell--chat-focus" : ""} ${state.settings.navCollapsed ? "shell--nav-collapsed" : ""} ${state.onboarding ? "shell--onboarding" : ""}">
      <div style="background: #ef4444; color: white; text-align: center; padding: 4px; font-weight: bold; font-size: 12px; z-index: 9999;">
        UI VERSION v.002.1
      </div>
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${() =>
              state.applySettings({
                ...state.settings,
                navCollapsed: !state.settings.navCollapsed,
              })}
            title="${state.settings.navCollapsed ? "Expand sidebar" : "Collapse sidebar"}"
            aria-label="${state.settings.navCollapsed ? "Expand sidebar" : "Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${icons.menu}</span>
          </button>
          <div class="brand">
            <div class="brand-logo">
              <img src="/favicon.svg" alt="OpenClaw" />
            </div>
            <div class="brand-text">
              <div class="brand-title">OPENCLAW</div>
              <div class="brand-sub">Gateway Dashboard</div>
            </div>
          </div>
          ${(() => {
            const info = (window as any).__BUILD_INFO__;
            if (!info) return nothing;
            const builtAt = new Date(info.builtAt);
            const isStale = Date.now() - builtAt.getTime() > 24 * 60 * 60 * 1000;
            return html`
              <div class="brand-build-info" style="font-size: 10px; opacity: 0.4; margin-top: 4px; ${isStale ? "color: #eab308; opacity: 1;" : ""}">
                Built: ${builtAt.toLocaleString()}
                ${isStale ? html` <span title="More than 24h old">(Stale)</span>` : ""}
              </div>
            `;
          })()}
        </div>
        <div class="topbar-status">
          <div class="pill">
            <span class="statusDot ${state.connected ? "ok" : ""}"></span>
            <span>Health</span>
            <span class="mono">${state.connected ? "OK" : "Offline"}</span>
          </div>
          <button
            class="btn btn-sm"
            @click=${async () => {
              // Clear all caches via Cache API
              if ('caches' in window) {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
              }
              // Unregister service workers
              if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(registrations.map(r => r.unregister()));
              }
              // Force hard reload bypassing cache
              window.location.href = window.location.href.split('?')[0] + '?cache_bust=' + Date.now();
            }}
            title="Clear cache and reload"
            style="
              padding: 0.375rem 0.75rem;
              font-size: 0.875rem;
              background: rgba(59, 130, 246, 0.1);
              border: 1px solid rgba(59, 130, 246, 0.3);
              color: var(--text);
              border-radius: var(--radius-sm);
              cursor: pointer;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              gap: 0.25rem;
            "
            onmouseover="this.style.background='rgba(59, 130, 246, 0.2)'; this.style.borderColor='rgba(59, 130, 246, 0.5)';"
            onmouseout="this.style.background='rgba(59, 130, 246, 0.1)'; this.style.borderColor='rgba(59, 130, 246, 0.3)';"
          >
            🔄 Clear Cache
          </button>
          ${renderThemeToggle(state)}
        </div>
      </header>
      <aside class="nav ${state.settings.navCollapsed ? "nav--collapsed" : ""}">
        ${TAB_GROUPS.map((group) => {
          const isGroupCollapsed = state.settings.navGroupsCollapsed[group.label] ?? false;
          const hasActiveTab = group.tabs.some((tab) => tab === state.tab);
          return html`
            <div class="nav-group ${isGroupCollapsed && !hasActiveTab ? "nav-group--collapsed" : ""}">
              <button
                class="nav-label"
                @click=${() => {
                  const next = { ...state.settings.navGroupsCollapsed };
                  next[group.label] = !isGroupCollapsed;
                  state.applySettings({
                    ...state.settings,
                    navGroupsCollapsed: next,
                  });
                }}
                aria-expanded=${!isGroupCollapsed}
              >
                <span class="nav-label__text">${group.label}</span>
                <span class="nav-label__chevron">${isGroupCollapsed ? "+" : "−"}</span>
              </button>
              <div class="nav-group__items">
                ${group.tabs.map((tab) => renderTab(state, tab))}
              </div>
            </div>
          `;
        })}
        <div class="nav-group nav-group--links">
          <div class="nav-label nav-label--static">
            <span class="nav-label__text">Resources</span>
          </div>
          <div class="nav-group__items">
            <a
              class="nav-item nav-item--external"
              href="https://docs.openclaw.ai"
              target="_blank"
              rel="noreferrer"
              title="Docs (opens in new tab)"
            >
              <span class="nav-item__icon" aria-hidden="true">${icons.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${isChat ? "content--chat" : ""}">
        <section class="content-header">
          <div>
            <div class="page-title">${titleForTab(state.tab)}</div>
            <div class="page-sub">${subtitleForTab(state.tab)}</div>
          </div>
          <div class="page-meta">
            ${state.lastError ? html`<div class="pill danger">${state.lastError}</div>` : nothing}
            ${isChat ? renderChatControls(state) : nothing}
          </div>
        </section>

        ${
          state.tab === "overview"
            ? renderOverview({
                connected: state.connected,
                hello: state.hello,
                settings: state.settings,
                password: state.password,
                lastError: state.lastError,
                presenceCount,
                sessionsCount,
                cronEnabled: state.cronStatus?.enabled ?? null,
                cronNext,
                lastChannelsRefresh: state.channelsLastSuccess,
                onSettingsChange: (next) => state.applySettings(next),
                onPasswordChange: (next) => (state.password = next),
                onSessionKeyChange: (next) => {
                  state.sessionKey = next;
                  state.chatMessage = "";
                  state.resetToolStream();
                  state.applySettings({
                    ...state.settings,
                    sessionKey: next,
                    lastActiveSessionKey: next,
                  });
                  void state.loadAssistantIdentity();
                },
                onConnect: () => state.connect(),
                onRefresh: () => state.loadOverview(),
              })
            : nothing
        }

        ${
          state.tab === "channels"
            ? renderChannels({
                connected: state.connected,
                loading: state.channelsLoading,
                snapshot: state.channelsSnapshot,
                lastError: state.channelsError,
                lastSuccessAt: state.channelsLastSuccess,
                whatsappMessage: state.whatsappLoginMessage,
                whatsappQrDataUrl: state.whatsappLoginQrDataUrl,
                whatsappConnected: state.whatsappLoginConnected,
                whatsappBusy: state.whatsappBusy,
                configSchema: state.configSchema,
                configSchemaLoading: state.configSchemaLoading,
                configForm: state.configForm,
                configUiHints: state.configUiHints,
                configSaving: state.configSaving,
                configFormDirty: state.configFormDirty,
                nostrProfileFormState: state.nostrProfileFormState,
                nostrProfileAccountId: state.nostrProfileAccountId,
                onRefresh: (probe) => loadChannels(state, probe),
                onWhatsAppStart: (force) => state.handleWhatsAppStart(force),
                onWhatsAppWait: () => state.handleWhatsAppWait(),
                onWhatsAppLogout: () => state.handleWhatsAppLogout(),
                onConfigPatch: (path, value) => updateConfigFormValue(state, path, value),
                onConfigSave: () => state.handleChannelConfigSave(),
                onConfigReload: () => state.handleChannelConfigReload(),
                onNostrProfileEdit: (accountId, profile) =>
                  state.handleNostrProfileEdit(accountId, profile),
                onNostrProfileCancel: () => state.handleNostrProfileCancel(),
                onNostrProfileFieldChange: (field, value) =>
                  state.handleNostrProfileFieldChange(field, value),
                onNostrProfileSave: () => state.handleNostrProfileSave(),
                onNostrProfileImport: () => state.handleNostrProfileImport(),
                onNostrProfileToggleAdvanced: () => state.handleNostrProfileToggleAdvanced(),
              })
            : nothing
        }

        ${
          state.tab === "instances"
            ? renderInstances({
                loading: state.presenceLoading,
                entries: state.presenceEntries,
                lastError: state.presenceError,
                statusMessage: state.presenceStatus,
                onRefresh: () => loadPresence(state),
              })
            : nothing
        }

        ${
          state.tab === "agents"
            ? renderAgents({
                loading: state.agentsLoading,
                agentsList: state.agentsList,
                error: state.agentsError,
                onRefresh: () => loadAgents(state),
                onEditAgent: (agent) => {
                  state.agentModalAgent = agent;
                  state.agentModalForm = agentToFormData(agent);
                  state.agentModalTab = "info";
                  state.agentModalVisible = true;
                },
                onCreateAgent: () => {
                  state.agentModalAgent = null;
                  state.agentModalForm = createEmptyAgentForm();
                  state.agentModalTab = "info";
                  state.agentModalVisible = true;
                },
              })
            : nothing
        }

        ${
          state.tab === "sessions"
            ? renderSessions({
                loading: state.sessionsLoading,
                result: state.sessionsResult,
                error: state.sessionsError,
                activeMinutes: state.sessionsFilterActive,
                limit: state.sessionsFilterLimit,
                includeGlobal: state.sessionsIncludeGlobal,
                includeUnknown: state.sessionsIncludeUnknown,
                basePath: state.basePath,
                onFiltersChange: (next) => {
                  state.sessionsFilterActive = next.activeMinutes;
                  state.sessionsFilterLimit = next.limit;
                  state.sessionsIncludeGlobal = next.includeGlobal;
                  state.sessionsIncludeUnknown = next.includeUnknown;
                },
                onRefresh: () => loadSessions(state),
                onPatch: (key, patch) => patchSession(state, key, patch),
                onDelete: (key) => deleteSession(state, key),
              })
            : nothing
        }

        ${
          state.tab === "cron"
            ? renderCron({
                loading: state.cronLoading,
                status: state.cronStatus,
                jobs: state.cronJobs,
                error: state.cronError,
                busy: state.cronBusy,
                form: state.cronForm,
                channels: state.channelsSnapshot?.channelMeta?.length
                  ? state.channelsSnapshot.channelMeta.map((entry) => entry.id)
                  : (state.channelsSnapshot?.channelOrder ?? []),
                channelLabels: state.channelsSnapshot?.channelLabels ?? {},
                channelMeta: state.channelsSnapshot?.channelMeta ?? [],
                runsJobId: state.cronRunsJobId,
                runs: state.cronRuns,
                onFormChange: (patch) => (state.cronForm = { ...state.cronForm, ...patch }),
                onRefresh: () => state.loadCron(),
                onAdd: () => addCronJob(state),
                onToggle: (job, enabled) => toggleCronJob(state, job, enabled),
                onRun: (job) => runCronJob(state, job),
                onRemove: (job) => removeCronJob(state, job),
                onLoadRuns: (jobId) => loadCronRuns(state, jobId),
              })
            : nothing
        }

        ${
          state.tab === "skills"
            ? renderSkillsMarketplace({
                loading: state.skillsLoading,
                report: state.skillsReport,
                error: state.skillsError,
                filter: state.skillsFilter,
                categoryFilter: state.skillsCategoryFilter || "all",
                edits: state.skillEdits,
                messages: state.skillMessages,
                busyKey: state.skillsBusyKey,
                client: state.client,
                selectedSkillKey: state.selectedSkillKey,
                editingContent: state.editingSkillContent,
                onFilterChange: (next) => (state.skillsFilter = next),
                onCategoryFilterChange: (next) => (state.skillsCategoryFilter = next),
                onRefresh: () => loadSkills(state, { clearMessages: true }),
                onToggle: (key, enabled) => updateSkillEnabled(state, key, enabled),
                onEdit: (key, value) => updateSkillEdit(state, key, value),
                onSaveKey: (key) => saveSkillApiKey(state, key),
                onInstall: (skillKey, name, installId) =>
                  installSkill(state, skillKey, name, installId),
                onSelectSkill: (skillKey) => (state.selectedSkillKey = skillKey),
                onLoadSkillContent: () => Promise.resolve(),
                onSaveSkillContent: () => Promise.resolve(),
                onDeleteSkill: () => Promise.resolve(),
                onTestSkill: () => Promise.resolve(),
                onCreateSkill: () => {},
                showCreateSkillModal: state.showCreateSkillModal,
                newSkillName: state.newSkillName,
                newSkillCategory: state.newSkillCategory,
                newSkillContent: state.newSkillContent,
                onNewSkillNameChange: (name) => (state.newSkillName = name),
                onNewSkillCategoryChange: (category) => (state.newSkillCategory = category),
                onNewSkillContentChange: (content) => (state.newSkillContent = content),
                onSaveNewSkill: () => {},
                onCloseCreateSkillModal: () => {
                  state.showCreateSkillModal = false;
                  state.newSkillName = "";
                  state.newSkillCategory = "";
                  state.newSkillContent = "";
                },
              })
            : nothing
        }

        ${
          state.tab === "tools"
            ? renderToolsMarketplace({
                loading: state.toolsLoading ?? false,
                report: state.toolsReport ?? null,
                error: state.toolsError ?? null,
                filter: state.toolsFilter ?? "",
                categoryFilter: state.toolsCategoryFilter ?? "all",
                edits: state.toolEdits ?? {},
                messages: state.toolMessages ?? {},
                busyKey: state.toolsBusyKey ?? null,
                client: state.client,
                selectedToolKey: state.selectedToolKey ?? null,
                editingContent: state.editingToolContent ?? "",
                onFilterChange: (next: string) => (state.toolsFilter = next),
                onCategoryFilterChange: (next: string) => (state.toolsCategoryFilter = next),
                onRefresh: () => loadTools(state as any, { clearMessages: true }),
                onToggle: (key: string, enabled: boolean) => updateToolEnabled(state as any, key, enabled),
                onEdit: (key: string, value: string) => updateToolEdit(state as any, key, value),
                onSaveKey: (key: string) => saveToolApiKey(state as any, key),
                onInstall: (toolKey: string, name: string, installId: string) =>
                  installTool(state as any, toolKey, name, installId),
                onSelectTool: (toolKey: string | null) => (state.selectedToolKey = toolKey),
                onLoadToolContent: () => Promise.resolve(),
                onSaveToolContent: () => Promise.resolve(),
                onDeleteTool: () => Promise.resolve(),
                onTestTool: () => Promise.resolve(),
                onCreateTool: () => {},
              })
            : nothing
        }

        ${
          state.tab === "nodes"
            ? renderNodes({
                loading: state.nodesLoading,
                nodes: state.nodes,
                devicesLoading: state.devicesLoading,
                devicesError: state.devicesError,
                devicesList: state.devicesList,
                configForm:
                  state.configForm ??
                  (state.configSnapshot?.config as Record<string, unknown> | null),
                configLoading: state.configLoading,
                configSaving: state.configSaving,
                configDirty: state.configFormDirty,
                configFormMode: state.configFormMode,
                execApprovalsLoading: state.execApprovalsLoading,
                execApprovalsSaving: state.execApprovalsSaving,
                execApprovalsDirty: state.execApprovalsDirty,
                execApprovalsSnapshot: state.execApprovalsSnapshot,
                execApprovalsForm: state.execApprovalsForm,
                execApprovalsSelectedAgent: state.execApprovalsSelectedAgent,
                execApprovalsTarget: state.execApprovalsTarget,
                execApprovalsTargetNodeId: state.execApprovalsTargetNodeId,
                onRefresh: () => loadNodes(state),
                onDevicesRefresh: () => loadDevices(state),
                onDeviceApprove: (requestId) => approveDevicePairing(state, requestId),
                onDeviceReject: (requestId) => rejectDevicePairing(state, requestId),
                onDeviceRotate: (deviceId, role, scopes) =>
                  rotateDeviceToken(state, { deviceId, role, scopes }),
                onDeviceRevoke: (deviceId, role) => revokeDeviceToken(state, { deviceId, role }),
                onLoadConfig: () => loadConfig(state),
                onLoadExecApprovals: () => {
                  const target =
                    state.execApprovalsTarget === "node" && state.execApprovalsTargetNodeId
                      ? { kind: "node" as const, nodeId: state.execApprovalsTargetNodeId }
                      : { kind: "gateway" as const };
                  return loadExecApprovals(state, target);
                },
                onBindDefault: (nodeId) => {
                  if (nodeId) {
                    updateConfigFormValue(state, ["tools", "exec", "node"], nodeId);
                  } else {
                    removeConfigFormValue(state, ["tools", "exec", "node"]);
                  }
                },
                onBindAgent: (agentIndex, nodeId) => {
                  const basePath = ["agents", "list", agentIndex, "tools", "exec", "node"];
                  if (nodeId) {
                    updateConfigFormValue(state, basePath, nodeId);
                  } else {
                    removeConfigFormValue(state, basePath);
                  }
                },
                onSaveBindings: () => saveConfig(state),
                onExecApprovalsTargetChange: (kind, nodeId) => {
                  state.execApprovalsTarget = kind;
                  state.execApprovalsTargetNodeId = nodeId;
                  state.execApprovalsSnapshot = null;
                  state.execApprovalsForm = null;
                  state.execApprovalsDirty = false;
                  state.execApprovalsSelectedAgent = null;
                },
                onExecApprovalsSelectAgent: (agentId) => {
                  state.execApprovalsSelectedAgent = agentId;
                },
                onExecApprovalsPatch: (path, value) =>
                  updateExecApprovalsFormValue(state, path, value),
                onExecApprovalsRemove: (path) => removeExecApprovalsFormValue(state, path),
                onSaveExecApprovals: () => {
                  const target =
                    state.execApprovalsTarget === "node" && state.execApprovalsTargetNodeId
                      ? { kind: "node" as const, nodeId: state.execApprovalsTargetNodeId }
                      : { kind: "gateway" as const };
                  return saveExecApprovals(state, target);
                },
              })
            : nothing
        }

        ${
          state.tab === "chat"
            ? renderChat({
                sessionKey: state.sessionKey,
                onSessionKeyChange: (next) => {
                  state.sessionKey = next;
                  state.chatMessage = "";
                  state.chatAttachments = [];
                  state.chatStream = null;
                  state.chatStreamStartedAt = null;
                  state.chatRunId = null;
                  state.chatQueue = [];
                  state.resetToolStream();
                  state.resetChatScroll();
                  state.applySettings({
                    ...state.settings,
                    sessionKey: next,
                    lastActiveSessionKey: next,
                  });
                  void state.loadAssistantIdentity();
                  void loadChatHistory(state);
                  void refreshChatAvatar(state);
                },
                thinkingLevel: state.chatThinkingLevel,
                showThinking,
                loading: state.chatLoading,
                sending: state.chatSending,
                compactionStatus: state.compactionStatus,
                assistantAvatarUrl: chatAvatarUrl,
                messages: state.chatMessages,
                toolMessages: state.chatToolMessages,
                stream: state.chatStream,
                streamStartedAt: state.chatStreamStartedAt,
                draft: state.chatMessage,
                queue: state.chatQueue,
                connected: state.connected,
                canSend: state.connected,
                disabledReason: chatDisabledReason,
                error: state.lastError,
                sessions: state.sessionsResult,
                focusMode: chatFocus,
                onRefresh: () => {
                  state.resetToolStream();
                  return Promise.all([loadChatHistory(state), refreshChatAvatar(state)]);
                },
                onToggleFocusMode: () => {
                  if (state.onboarding) return;
                  state.applySettings({
                    ...state.settings,
                    chatFocusMode: !state.settings.chatFocusMode,
                  });
                },
                onChatScroll: (event) => state.handleChatScroll(event),
                onDraftChange: (next) => (state.chatMessage = next),
                attachments: state.chatAttachments,
                onAttachmentsChange: (next) => (state.chatAttachments = next),
                onSend: () => state.handleSendChat(),
                canAbort: Boolean(state.chatRunId),
                onAbort: () => void state.handleAbortChat(),
                onQueueRemove: (id) => state.removeQueuedMessage(id),
                onNewSession: () => state.handleSendChat("/new", { restoreDraft: true }),
                // Sidebar props for tool output viewing
                sidebarOpen: state.sidebarOpen,
                sidebarContent: state.sidebarContent,
                sidebarError: state.sidebarError,
                splitRatio: state.splitRatio,
                onOpenSidebar: (content: string) => state.handleOpenSidebar(content),
                onCloseSidebar: () => state.handleCloseSidebar(),
                onSplitRatioChange: (ratio: number) => state.handleSplitRatioChange(ratio),
                assistantName: state.assistantName,
                assistantAvatar: state.assistantAvatar,
              })
            : nothing
        }

        ${
          state.tab === "config"
            ? renderConfig({
                raw: state.configRaw,
                originalRaw: state.configRawOriginal,
                valid: state.configValid,
                issues: state.configIssues,
                loading: state.configLoading,
                saving: state.configSaving,
                applying: state.configApplying,
                updating: state.updateRunning,
                connected: state.connected,
                schema: state.configSchema,
                schemaLoading: state.configSchemaLoading,
                uiHints: state.configUiHints,
                formMode: state.configFormMode,
                formValue: state.configForm,
                originalValue: state.configFormOriginal,
                searchQuery: state.configSearchQuery,
                activeSection: state.configActiveSection,
                activeSubsection: state.configActiveSubsection,
                onRawChange: (next) => {
                  state.configRaw = next;
                },
                onFormModeChange: (mode) => (state.configFormMode = mode),
                onFormPatch: (path, value) => updateConfigFormValue(state, path, value),
                onSearchChange: (query) => (state.configSearchQuery = query),
                onSectionChange: (section) => {
                  state.configActiveSection = section;
                  state.configActiveSubsection = null;
                },
                onSubsectionChange: (section) => (state.configActiveSubsection = section),
                onReload: () => loadConfig(state),
                onSave: () => saveConfig(state),
                onApply: () => applyConfig(state),
                onUpdate: () => runUpdate(state),
              })
            : nothing
        }

        ${
          state.tab === "debug"
            ? renderDebug({
                loading: state.debugLoading,
                status: state.debugStatus,
                health: state.debugHealth,
                models: state.debugModels,
                heartbeat: state.debugHeartbeat,
                eventLog: state.eventLog,
                callMethod: state.debugCallMethod,
                callParams: state.debugCallParams,
                callResult: state.debugCallResult,
                callError: state.debugCallError,
                onCallMethodChange: (next) => (state.debugCallMethod = next),
                onCallParamsChange: (next) => (state.debugCallParams = next),
                onRefresh: () => loadDebug(state),
                onCall: () => callDebugMethod(state),
              })
            : nothing
        }

        ${
          state.tab === "wizard"
            ? renderWizard({
                connected: state.connected,
                sessionsResult: state.sessionsResult,
                projects: state.wizardProjects || [],
                tasks: state.wizardTasks || [],
                notes: state.wizardNotes || [],
                deliverables: state.wizardDeliverables || [],
                actionLog: state.wizardActionLog || [],
                onAddTask: (title, description, projectId, priority, dueDate, labels) =>
                  state.handleWizardAddTask(title, description, projectId, priority, dueDate, labels),
                onUpdateTask: (taskId, updates) => state.handleWizardUpdateTask(taskId, updates),
                onUpdateTaskStatus: (taskId, status) => state.handleWizardUpdateTaskStatus(taskId, status),
                onDeleteTask: (taskId) => state.handleWizardDeleteTask(taskId),
                onAddNote: (content) => state.handleWizardAddNote(content),
                onUpdateNote: (noteId, content) => state.handleWizardUpdateNote(noteId, content),
                onDeleteNote: (noteId) => state.handleWizardDeleteNote(noteId),
                onAddTaskAttachment: (taskId, file) => state.handleWizardAddTaskAttachment(taskId, file),
                onAddTaskChecklistItem: (taskId, text) => state.handleWizardAddTaskChecklistItem(taskId, text),
                onUpdateChecklistItem: (taskId, itemId, updates) =>
                  state.handleWizardUpdateChecklistItem(taskId, itemId, updates),
                onDeleteChecklistItem: (taskId, itemId) => state.handleWizardDeleteChecklistItem(taskId, itemId),
                onRefresh: () => state.handleWizardRefresh(),
                onClearCache: () => state.handleWizardClearCache(),
                onAddProject: (name, description) => state.handleWizardAddProject(name, description),
                onUpdateProject: (projectId, updates) => state.handleWizardUpdateProject(projectId, updates),
                onDeleteProject: (projectId) => state.handleWizardDeleteProject(projectId),
                onEnhancePrompt: state.handleWizardEnhancePrompt ? (projectId) => state.handleWizardEnhancePrompt!(projectId) : undefined,
                onEnhanceResearch: state.handleWizardEnhanceResearch ? (projectId) => state.handleWizardEnhanceResearch!(projectId) : undefined,
                onGenerateTasksFromFeatures: state.handleWizardGenerateTasksFromFeatures
                  ? (projectId) => state.handleWizardGenerateTasksFromFeatures!(projectId)
                  : undefined,
                editingProjectId: state.wizardEditingProjectId,
                projectEditTab: state.wizardProjectEditTab,
                onSetEditingProject: (projectId, tab) => {
                  state.wizardEditingProjectId = projectId || null;
                  if (tab) state.wizardProjectEditTab = tab;
                },
              })
            : nothing
        }

        ${
          state.tab === "prompts"
            ? renderWorkspacePrompts({
                connected: state.connected,
                client: state.client,
                prompts: state.workspacePrompts || [],
                onLoadPrompts: () => state.handleWorkspacePromptsLoad(),
                onSavePrompt: (filename, content, enabled) =>
                  state.handleWorkspacePromptsSave(filename, content, enabled),
              })
            : nothing
        }

        ${
          state.tab === "logs"
            ? renderLogs({
                loading: state.logsLoading,
                error: state.logsError,
                file: state.logsFile,
                entries: state.logsEntries,
                filterText: state.logsFilterText,
                levelFilters: state.logsLevelFilters,
                autoFollow: state.logsAutoFollow,
                truncated: state.logsTruncated,
                onFilterTextChange: (next) => (state.logsFilterText = next),
                onLevelToggle: (level, enabled) => {
                  state.logsLevelFilters = { ...state.logsLevelFilters, [level]: enabled };
                },
                onToggleAutoFollow: (next) => (state.logsAutoFollow = next),
                onRefresh: () => loadLogs(state, { reset: true }),
                onExport: (lines, label) => state.exportLogs(lines, label),
                onScroll: (event) => state.handleLogsScroll(event),
              })
            : nothing
        }
      </main>
      ${state.tab === "skills" ? renderSkillsModals({
        loading: state.skillsLoading,
        report: state.skillsReport,
        error: state.skillsError,
        filter: state.skillsFilter,
        categoryFilter: state.skillsCategoryFilter || "all",
        edits: state.skillEdits,
        messages: state.skillMessages,
        busyKey: state.skillsBusyKey,
        client: state.client,
        selectedSkillKey: state.selectedSkillKey,
        editingContent: state.editingSkillContent,
        onFilterChange: () => {},
        onCategoryFilterChange: () => {},
        onRefresh: () => Promise.resolve(),
        onToggle: () => Promise.resolve(),
        onEdit: () => {},
        onSaveKey: () => Promise.resolve(),
        onInstall: () => Promise.resolve(),
        onSelectSkill: (skillKey) => (state.selectedSkillKey = skillKey),
        onLoadSkillContent: () => Promise.resolve(),
        onSaveSkillContent: () => Promise.resolve(),
        onDeleteSkill: () => Promise.resolve(),
        onTestSkill: () => Promise.resolve(),
        onCreateSkill: () => {},
        showCreateSkillModal: state.showCreateSkillModal,
        newSkillName: state.newSkillName,
        newSkillCategory: state.newSkillCategory,
        newSkillContent: state.newSkillContent,
        onNewSkillNameChange: () => {},
        onNewSkillCategoryChange: () => {},
        onNewSkillContentChange: () => {},
        onSaveNewSkill: () => {},
        onCloseCreateSkillModal: () => {
          state.showCreateSkillModal = false;
          state.newSkillName = "";
          state.newSkillCategory = "";
          state.newSkillContent = "";
        },
      }) : nothing}
      ${state.tab === "tools" ? renderToolsModals({
        loading: state.toolsLoading ?? false,
        report: state.toolsReport ?? null,
        error: state.toolsError ?? null,
        filter: state.toolsFilter ?? "",
        categoryFilter: state.toolsCategoryFilter ?? "all",
        edits: state.toolEdits ?? {},
        messages: state.toolMessages ?? {},
        busyKey: state.toolsBusyKey ?? null,
        client: state.client,
        selectedToolKey: state.selectedToolKey ?? null,
        editingContent: state.editingToolContent ?? "",
        onFilterChange: () => {},
        onCategoryFilterChange: () => {},
        onRefresh: () => loadTools(state as any, { clearMessages: true }),
        onToggle: (key: string, enabled: boolean) => updateToolEnabled(state as any, key, enabled),
        onEdit: (key: string, value: string) => updateToolEdit(state as any, key, value),
        onSaveKey: (key: string) => saveToolApiKey(state as any, key),
        onInstall: (toolKey: string, name: string, installId: string) =>
          installTool(state as any, toolKey, name, installId),
        onSelectTool: (toolKey: string | null) => (state.selectedToolKey = toolKey),
        onLoadToolContent: () => Promise.resolve(),
        onSaveToolContent: () => Promise.resolve(),
        onDeleteTool: () => Promise.resolve(),
        onTestTool: () => Promise.resolve(),
        onCreateTool: () => {},
      }) : nothing}
      ${renderExecApprovalPrompt(state)}
      ${renderGatewayUrlConfirmation(state)}
      ${renderAgentModal({
        visible: state.agentModalVisible ?? false,
        agent: state.agentModalAgent ?? null,
        activeTab: state.agentModalTab ?? "info",
        isSubmitting: state.agentModalSubmitting ?? false,
        form: state.agentModalForm ?? createEmptyAgentForm(),
        onTabChange: (tab) => { state.agentModalTab = tab; },
        onFormChange: (field, value) => {
          state.agentModalForm = { ...state.agentModalForm, [field]: value };
        },
        onSave: async () => {
          state.agentModalSubmitting = true;
          try {
            // For now, just log and close - API integration would go here
            console.log("Saving agent:", state.agentModalForm);
            state.agentModalVisible = false;
            loadAgents(state);
          } finally {
            state.agentModalSubmitting = false;
          }
        },
        onDelete: async () => {
          if (!state.agentModalAgent) return;
          if (!confirm("Delete " + (state.agentModalAgent.name ?? "this agent") + "?")) return;
          console.log("Deleting agent:", state.agentModalAgent.id);
          state.agentModalVisible = false;
          loadAgents(state);
        },
        onClose: () => { state.agentModalVisible = false; },
      })}
    </div>
  `;
}
