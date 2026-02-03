import { LitElement, html, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import type { EventLogEntry } from "./app-events";
import type { DevicePairingList } from "./controllers/devices";
import type { ExecApprovalRequest } from "./controllers/exec-approval";
import type { ExecApprovalsFile, ExecApprovalsSnapshot } from "./controllers/exec-approvals";
import type { GatewayBrowserClient, GatewayHelloOk } from "./gateway";
import type { Tab } from "./navigation";
import type { ResolvedTheme, ThemeMode } from "./theme";
import type {
  AgentsListResult,
  ConfigSnapshot,
  ConfigUiHints,
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
  ToolStatusReport,
  StatusSummary,
  NostrProfile,
} from "./types";
import type { NostrProfileFormState } from "./views/channels.nostr-profile-form";
import type { WizardProject, WizardTask } from "./views/wizard";
import type { AppViewState } from "./app-view-state";
import {
  handleChannelConfigReload as handleChannelConfigReloadInternal,
  handleChannelConfigSave as handleChannelConfigSaveInternal,
  handleNostrProfileCancel as handleNostrProfileCancelInternal,
  handleNostrProfileEdit as handleNostrProfileEditInternal,
  handleNostrProfileFieldChange as handleNostrProfileFieldChangeInternal,
  handleNostrProfileImport as handleNostrProfileImportInternal,
  handleNostrProfileSave as handleNostrProfileSaveInternal,
  handleNostrProfileToggleAdvanced as handleNostrProfileToggleAdvancedInternal,
  handleWhatsAppLogout as handleWhatsAppLogoutInternal,
  handleWhatsAppStart as handleWhatsAppStartInternal,
  handleWhatsAppWait as handleWhatsAppWaitInternal,
} from "./app-channels";
import {
  handleAbortChat as handleAbortChatInternal,
  handleSendChat as handleSendChatInternal,
  removeQueuedMessage as removeQueuedMessageInternal,
} from "./app-chat";
import { DEFAULT_CRON_FORM, DEFAULT_LOG_LEVEL_FILTERS } from "./app-defaults";
import { connectGateway as connectGatewayInternal } from "./app-gateway";
import {
  handleConnected,
  handleDisconnected,
  handleFirstUpdated,
  handleUpdated,
} from "./app-lifecycle";
import { renderApp } from "./app-render";
import {
  exportLogs as exportLogsInternal,
  handleChatScroll as handleChatScrollInternal,
  handleLogsScroll as handleLogsScrollInternal,
  resetChatScroll as resetChatScrollInternal,
} from "./app-scroll";
import {
  applySettings as applySettingsInternal,
  loadCron as loadCronInternal,
  loadOverview as loadOverviewInternal,
  setTab as setTabInternal,
  setTheme as setThemeInternal,
  onPopState as onPopStateInternal,
} from "./app-settings";
import {
  resetToolStream as resetToolStreamInternal,
  type ToolStreamEntry,
} from "./app-tool-stream";
import { resolveInjectedAssistantIdentity } from "./assistant-identity";
import { loadAssistantIdentity as loadAssistantIdentityInternal } from "./controllers/assistant-identity";
import { loadSettings, type UiSettings } from "./storage";
import { type ApiResponse, type ChatAttachment, type ChatQueueItem, type CronFormState } from "./ui-types";
import type { ToolMessage } from "./controllers/tools";
import {
  loadSkills,
  setSkillMessage,
  updateSkillEdit,
  type SkillMessage,
} from "./controllers/skills";

declare global {
  interface Window {
    __OPENCLAW_CONTROL_UI_BASE_PATH__?: string;
  }
}

const injectedAssistantIdentity = resolveInjectedAssistantIdentity();

function resolveOnboardingMode(): boolean {
  if (!window.location.search) return false;
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("onboarding");
  if (!raw) return false;
  const normalized = raw.trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

@customElement("openclaw-app")
export class OpenClawApp extends LitElement {
  @state() settings: UiSettings = loadSettings();
  @state() password = "";
  @state() tab: Tab = "chat";
  @state() onboarding = resolveOnboardingMode();
  @state() connected = false;
  @state() theme: ThemeMode = this.settings.theme ?? "system";
  @state() themeResolved: ResolvedTheme = "dark";
  @state() hello: GatewayHelloOk | null = null;
  @state() lastError: string | null = null;
  @state() eventLog: EventLogEntry[] = [];
  private eventLogBuffer: EventLogEntry[] = [];
  private toolStreamSyncTimer: number | null = null;
  private sidebarCloseTimer: number | null = null;

  @state() assistantName = injectedAssistantIdentity.name;
  @state() assistantAvatar = injectedAssistantIdentity.avatar;
  @state() assistantAgentId = injectedAssistantIdentity.agentId ?? null;

  @state() sessionKey = this.settings.sessionKey;
  @state() chatLoading = false;
  @state() chatSending = false;
  @state() chatMessage = "";
  @state() chatMessages: unknown[] = [];
  @state() chatToolMessages: unknown[] = [];
  @state() chatStream: string | null = null;
  @state() chatStreamStartedAt: number | null = null;
  @state() chatRunId: string | null = null;
  @state() compactionStatus: import("./app-tool-stream").CompactionStatus | null = null;
  @state() chatAvatarUrl: string | null = null;
  @state() chatThinkingLevel: string | null = null;
  @state() chatQueue: ChatQueueItem[] = [];
  @state() chatAttachments: ChatAttachment[] = [];
  // Sidebar state for tool output viewing
  @state() sidebarOpen = false;
  @state() sidebarContent: string | null = null;
  @state() sidebarError: string | null = null;
  @state() splitRatio = this.settings.splitRatio;

  @state() nodesLoading = false;
  @state() nodes: Array<Record<string, unknown>> = [];
  @state() devicesLoading = false;
  @state() devicesError: string | null = null;
  @state() devicesList: DevicePairingList | null = null;
  @state() execApprovalsLoading = false;
  @state() execApprovalsSaving = false;
  @state() execApprovalsDirty = false;
  @state() execApprovalsSnapshot: ExecApprovalsSnapshot | null = null;
  @state() execApprovalsForm: ExecApprovalsFile | null = null;
  @state() execApprovalsSelectedAgent: string | null = null;
  @state() execApprovalsTarget: "gateway" | "node" = "gateway";
  @state() execApprovalsTargetNodeId: string | null = null;
  @state() execApprovalQueue: ExecApprovalRequest[] = [];
  @state() execApprovalBusy = false;
  @state() execApprovalError: string | null = null;
  @state() pendingGatewayUrl: string | null = null;

  @state() configLoading = false;
  @state() configRaw = "{\n}\n";
  @state() configRawOriginal = "";
  @state() configValid: boolean | null = null;
  @state() configIssues: unknown[] = [];
  @state() configSaving = false;
  @state() configApplying = false;
  @state() updateRunning = false;
  @state() applySessionKey = this.settings.lastActiveSessionKey;
  @state() configSnapshot: ConfigSnapshot | null = null;
  @state() configSchema: unknown | null = null;
  @state() configSchemaVersion: string | null = null;
  @state() configSchemaLoading = false;
  @state() configUiHints: ConfigUiHints = {};
  @state() configForm: Record<string, unknown> | null = null;
  @state() configFormOriginal: Record<string, unknown> | null = null;
  @state() configFormDirty = false;
  @state() configFormMode: "form" | "raw" = "form";
  @state() configSearchQuery = "";
  @state() configActiveSection: string | null = null;
  @state() configActiveSubsection: string | null = null;

  @state() channelsLoading = false;
  @state() channelsSnapshot: ChannelsStatusSnapshot | null = null;
  @state() channelsError: string | null = null;
  @state() channelsLastSuccess: number | null = null;
  @state() whatsappLoginMessage: string | null = null;
  @state() whatsappLoginQrDataUrl: string | null = null;
  @state() whatsappLoginConnected: boolean | null = null;
  @state() whatsappBusy = false;
  @state() nostrProfileFormState: NostrProfileFormState | null = null;
  @state() nostrProfileAccountId: string | null = null;

  @state() presenceLoading = false;
  @state() presenceEntries: PresenceEntry[] = [];
  @state() presenceError: string | null = null;
  @state() presenceStatus: string | null = null;

  @state() agentsLoading = false;
  @state() agentsList: AgentsListResult | null = null;
  @state() agentsError: string | null = null;
  // Agent modal state
  @state() agentModalVisible = false;
  @state() agentModalAgent: import("./types").GatewayAgentRow | null = null;
  @state() agentModalTab: "info" | "soul" | "user" | "agents" = "info";
  @state() agentModalForm: import("./views/agent-modal").AgentFormData = {
    name: "",
    role: "",
    description: "",
    avatar_emoji: "🤖",
    status: "standby",
    is_master: false,
    soul_md: "",
    user_md: "",
    agents_md: "",
  };
  @state() agentModalSubmitting = false;


  @state() sessionsLoading = false;
  @state() sessionsResult: SessionsListResult | null = null;
  @state() sessionsError: string | null = null;
  @state() sessionsFilterActive = "";
  @state() sessionsFilterLimit = "120";
  @state() sessionsIncludeGlobal = true;
  @state() sessionsIncludeUnknown = false;

  @state() cronLoading = false;
  @state() cronJobs: CronJob[] = [];
  @state() cronStatus: CronStatus | null = null;
  @state() cronError: string | null = null;
  @state() cronForm: CronFormState = { ...DEFAULT_CRON_FORM };
  @state() cronRunsJobId: string | null = null;
  @state() cronRuns: CronRunLogEntry[] = [];
  @state() cronBusy = false;

  @state() skillsLoading = false;
  @state() skillsReport: SkillStatusReport | null = null;
  @state() skillsError: string | null = null;
  @state() skillsFilter = "";
  @state() skillsCategoryFilter = "all";
  @state() skillEdits: Record<string, string> = {};
  @state() skillsBusyKey: string | null = null;
  @state() skillMessages: Record<string, SkillMessage> = {};
  @state() selectedSkillKey: string | null = null;
  @state() editingSkillContent = "";

  // Tools state (parallel to Skills)
  @state() toolsLoading = false;
  @state() toolsReport: ToolStatusReport | null = null;
  @state() toolsError: string | null = null;
  @state() toolsFilter = "";
  @state() toolsCategoryFilter = "all";
  @state() toolEdits: Record<string, string> = {};
  @state() toolsBusyKey: string | null = null;
  @state() toolMessages: Record<string, ToolMessage> = {};
  @state() selectedToolKey: string | null = null;
  @state() editingToolContent = "";

  @state() debugLoading = false;
  @state() debugStatus: StatusSummary | null = null;
  @state() debugHealth: HealthSnapshot | null = null;
  @state() debugModels: unknown[] = [];
  @state() debugHeartbeat: unknown | null = null;
  @state() debugCallMethod = "";
  @state() debugCallParams = "{}";
  @state() debugCallResult: string | null = null;
  @state() debugCallError: string | null = null;

  @state() logsLoading = false;
  @state() logsError: string | null = null;
  @state() logsFile: string | null = null;
  @state() logsEntries: LogEntry[] = [];
  @state() logsFilterText = "";
  @state() logsLevelFilters: Record<LogLevel, boolean> = {
    ...DEFAULT_LOG_LEVEL_FILTERS,
  };
  @state() logsAutoFollow = true;
  @state() logsTruncated = false;
  @state() logsCursor: number | null = null;

  @state() wizardProjects: WizardProject[] = (() => {
    try {
      const stored = localStorage.getItem("openclaw.wizard.projects");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();
  @state() wizardEditingProjectId: string | null = null;
  @state() wizardProjectEditTab: "prompt" | "research" | "features" | "details" = "details";
  @state() showCreateSkillModal = false;
  @state() newSkillName = "";
  @state() newSkillCategory: string = "";
  @state() newSkillContent = "";
  @state() wizardTasks: WizardTask[] = (() => {
    try {
      const stored = localStorage.getItem("openclaw.wizard.tasks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();
  @state() wizardNotes: Array<{ id: string; content: string; seenByAgent: boolean; createdAt: string }> = (() => {
    try {
      const stored = localStorage.getItem("openclaw.wizard.notes");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();
  @state() wizardDeliverables: Array<{ id: string; title: string; type: string; url?: string; createdAt: string }> = [];
  @state() wizardActionLog: Array<{ id: string; action: string; description?: string; agentId?: string; createdAt: string }> = (() => {
    try {
      const stored = localStorage.getItem("openclaw.wizard.actionLog");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  })();
  @state() workspacePrompts: Array<{ name: string; filename: string; enabled: boolean; content: string; description: string; example: string }> = [];
  @state() workspacePromptsLoading = false;
  @state() logsLastFetchAt: number | null = null;
  @state() logsLimit = 500;
  @state() logsMaxBytes = 250_000;
  @state() logsAtBottom = true;

  client: GatewayBrowserClient | null = null;
  private chatScrollFrame: number | null = null;
  private chatScrollTimeout: number | null = null;
  private chatHasAutoScrolled = false;
  private chatUserNearBottom = true;
  private nodesPollInterval: number | null = null;
  private logsPollInterval: number | null = null;
  private debugPollInterval: number | null = null;
  private logsScrollFrame: number | null = null;
  private toolStreamById = new Map<string, ToolStreamEntry>();
  private toolStreamOrder: string[] = [];
  refreshSessionsAfterChat = new Set<string>();
  basePath = "";
  private popStateHandler = () =>
    onPopStateInternal(this as unknown as Parameters<typeof onPopStateInternal>[0]);
  private themeMedia: MediaQueryList | null = null;
  private themeMediaHandler: ((event: MediaQueryListEvent) => void) | null = null;
  private topbarObserver: ResizeObserver | null = null;

  private logWizardAction(action: string, description?: string) {
    const entry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      description,
      agentId: this.assistantAgentId ?? undefined,
      createdAt: new Date().toISOString(),
    };
    // newest first, cap to last 100 entries
    this.wizardActionLog = [entry, ...this.wizardActionLog].slice(0, 100);
    localStorage.setItem("openclaw.wizard.actionLog", JSON.stringify(this.wizardActionLog));
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    handleConnected(this as unknown as Parameters<typeof handleConnected>[0]);
  }

  protected firstUpdated() {
    handleFirstUpdated(this as unknown as Parameters<typeof handleFirstUpdated>[0]);
  }

  disconnectedCallback() {
    handleDisconnected(this as unknown as Parameters<typeof handleDisconnected>[0]);
    super.disconnectedCallback();
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    handleUpdated(this as unknown as Parameters<typeof handleUpdated>[0], changed);
  }

  connect() {
    connectGatewayInternal(this as unknown as Parameters<typeof connectGatewayInternal>[0]);
  }

  handleChatScroll(event: Event) {
    handleChatScrollInternal(
      this as unknown as Parameters<typeof handleChatScrollInternal>[0],
      event,
    );
  }

  handleLogsScroll(event: Event) {
    handleLogsScrollInternal(
      this as unknown as Parameters<typeof handleLogsScrollInternal>[0],
      event,
    );
  }

  exportLogs(lines: string[], label: string) {
    exportLogsInternal(lines, label);
  }

  resetToolStream() {
    resetToolStreamInternal(this as unknown as Parameters<typeof resetToolStreamInternal>[0]);
  }

  resetChatScroll() {
    resetChatScrollInternal(this as unknown as Parameters<typeof resetChatScrollInternal>[0]);
  }

  async loadAssistantIdentity() {
    await loadAssistantIdentityInternal(this);
  }

  applySettings(next: UiSettings) {
    applySettingsInternal(this as unknown as Parameters<typeof applySettingsInternal>[0], next);
  }

  setTab(next: Tab) {
    setTabInternal(this as unknown as Parameters<typeof setTabInternal>[0], next);
  }

  setTheme(next: ThemeMode, context?: Parameters<typeof setThemeInternal>[2]) {
    setThemeInternal(this as unknown as Parameters<typeof setThemeInternal>[0], next, context);
  }

  async loadOverview() {
    await loadOverviewInternal(this as unknown as Parameters<typeof loadOverviewInternal>[0]);
  }

  async loadCron() {
    await loadCronInternal(this as unknown as Parameters<typeof loadCronInternal>[0]);
  }

  async handleAbortChat() {
    await handleAbortChatInternal(this as unknown as Parameters<typeof handleAbortChatInternal>[0]);
  }

  removeQueuedMessage(id: string) {
    removeQueuedMessageInternal(
      this as unknown as Parameters<typeof removeQueuedMessageInternal>[0],
      id,
    );
  }

  async handleSendChat(
    messageOverride?: string,
    opts?: Parameters<typeof handleSendChatInternal>[2],
  ) {
    await handleSendChatInternal(
      this as unknown as Parameters<typeof handleSendChatInternal>[0],
      messageOverride,
      opts,
    );
  }

  async handleWhatsAppStart(force: boolean) {
    await handleWhatsAppStartInternal(this, force);
  }

  async handleWhatsAppWait() {
    await handleWhatsAppWaitInternal(this);
  }

  async handleWhatsAppLogout() {
    await handleWhatsAppLogoutInternal(this);
  }

  async handleChannelConfigSave() {
    await handleChannelConfigSaveInternal(this);
  }

  async handleChannelConfigReload() {
    await handleChannelConfigReloadInternal(this);
  }

  handleNostrProfileEdit(accountId: string, profile: NostrProfile | null) {
    handleNostrProfileEditInternal(this, accountId, profile);
  }

  handleNostrProfileCancel() {
    handleNostrProfileCancelInternal(this);
  }

  handleNostrProfileFieldChange(field: keyof NostrProfile, value: string) {
    handleNostrProfileFieldChangeInternal(this, field, value);
  }

  async handleNostrProfileSave() {
    await handleNostrProfileSaveInternal(this);
  }

  async handleNostrProfileImport() {
    await handleNostrProfileImportInternal(this);
  }

  handleNostrProfileToggleAdvanced() {
    handleNostrProfileToggleAdvancedInternal(this);
  }

  async handleExecApprovalDecision(decision: "allow-once" | "allow-always" | "deny") {
    const active = this.execApprovalQueue[0];
    if (!active || !this.client || this.execApprovalBusy) return;
    this.execApprovalBusy = true;
    this.execApprovalError = null;
    try {
      await this.client.request("exec.approval.resolve", {
        id: active.id,
        decision,
      });
      this.execApprovalQueue = this.execApprovalQueue.filter((entry) => entry.id !== active.id);
    } catch (err) {
      this.execApprovalError = `Exec approval failed: ${String(err)}`;
    } finally {
      this.execApprovalBusy = false;
    }
  }

  handleGatewayUrlConfirm() {
    const nextGatewayUrl = this.pendingGatewayUrl;
    if (!nextGatewayUrl) return;
    this.pendingGatewayUrl = null;
    applySettingsInternal(this as unknown as Parameters<typeof applySettingsInternal>[0], {
      ...this.settings,
      gatewayUrl: nextGatewayUrl,
    });
    this.connect();
  }

  handleGatewayUrlCancel() {
    this.pendingGatewayUrl = null;
  }

  // Sidebar handlers for tool output viewing
  handleOpenSidebar(content: string) {
    if (this.sidebarCloseTimer != null) {
      window.clearTimeout(this.sidebarCloseTimer);
      this.sidebarCloseTimer = null;
    }
    this.sidebarContent = content;
    this.sidebarError = null;
    this.sidebarOpen = true;
  }

  handleCloseSidebar() {
    this.sidebarOpen = false;
    // Clear content after transition
    if (this.sidebarCloseTimer != null) {
      window.clearTimeout(this.sidebarCloseTimer);
    }
    this.sidebarCloseTimer = window.setTimeout(() => {
      if (this.sidebarOpen) return;
      this.sidebarContent = null;
      this.sidebarError = null;
      this.sidebarCloseTimer = null;
    }, 200);
  }

  handleSplitRatioChange(ratio: number) {
    const newRatio = Math.max(0.4, Math.min(0.7, ratio));
    this.splitRatio = newRatio;
    this.applySettings({ ...this.settings, splitRatio: newRatio });
  }

  handleWizardAddTask(title: string, description?: string, projectId?: string, priority?: "low" | "medium" | "high", dueDate?: string, labels?: string[]) {
    const task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      status: "todo" as const,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate,
      labels: labels || [],
      checklist: [],
      attachments: [],
      projectId,
      editLog: [{
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        agentId: "user",
        agentName: "User",
        agentType: "human",
        action: "created",
        description: `Task "${title}" was created`,
      }],
      validations: [],
    };
    this.wizardTasks = [...this.wizardTasks, task];
    localStorage.setItem("openclaw.wizard.tasks", JSON.stringify(this.wizardTasks));
    this.logWizardAction("Task created", title);
  }

  handleWizardUpdateTask(taskId: string, updates: Partial<WizardTask>) {
    this.wizardTasks = this.wizardTasks.map((t) =>
      t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    localStorage.setItem("openclaw.wizard.tasks", JSON.stringify(this.wizardTasks));
  }

  handleWizardUpdateTaskStatus(taskId: string, status: "todo" | "in_progress" | "testing" | "done" | "archived") {
    const task = this.wizardTasks.find((t) => t.id === taskId);
    if (!task) return;
    
    // Check if project requires manual approval
    if (task.projectId) {
      const project = this.wizardProjects.find((p) => p.id === task.projectId);
      if (project?.manualApprovalRequired && task.status !== status) {
        // Check if this is a status progression (not regression)
        const statusOrder = ["todo", "in_progress", "testing", "done", "archived"];
        const currentIndex = statusOrder.indexOf(task.status);
        const newIndex = statusOrder.indexOf(status);
        
        if (newIndex > currentIndex) {
          // Status progression - require approval
          if (!confirm(`Project "${project.name}" requires manual approval. Move task "${task.title}" from ${task.status} to ${status}?`)) {
            return; // User cancelled
          }
        }
      }
    }
    
    this.handleWizardUpdateTask(taskId, { status });
    if (task && task.status !== status) {
      this.logWizardAction(`Task moved to ${status}`, task.title);
    }
  }

  handleWizardDeleteTask(taskId: string) {
    const task = this.wizardTasks.find((t) => t.id === taskId);
    this.wizardTasks = this.wizardTasks.filter((t) => t.id !== taskId);
    localStorage.setItem("openclaw.wizard.tasks", JSON.stringify(this.wizardTasks));
    if (task) {
      this.logWizardAction("Task deleted", task.title);
    }
  }

  handleWizardAddNote(content: string) {
    const note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      seenByAgent: false,
      createdAt: new Date().toISOString(),
    };
    this.wizardNotes = [...this.wizardNotes, note];
    localStorage.setItem("openclaw.wizard.notes", JSON.stringify(this.wizardNotes));
    this.logWizardAction("Note added", content.slice(0, 80));
  }

  handleWizardUpdateNote(noteId: string, content: string) {
    this.wizardNotes = this.wizardNotes.map((n) => (n.id === noteId ? { ...n, content } : n));
    localStorage.setItem("openclaw.wizard.notes", JSON.stringify(this.wizardNotes));
  }

  handleWizardDeleteNote(noteId: string) {
    const note = this.wizardNotes.find((n) => n.id === noteId);
    this.wizardNotes = this.wizardNotes.filter((n) => n.id !== noteId);
    localStorage.setItem("openclaw.wizard.notes", JSON.stringify(this.wizardNotes));
    if (note) {
      this.logWizardAction("Note deleted", note.content.slice(0, 80));
    }
  }

  async handleWizardAddTaskAttachment(taskId: string, file: File) {
    const task = this.wizardTasks.find((t) => t.id === taskId);
    if (!task || !task.projectId) {
      // Fallback to old behavior if no project
      const reader = new FileReader();
      reader.onload = () => {
        const attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: reader.result as string,
          type: file.type.startsWith("image/") ? "image" : "file",
        };
        this.handleWizardUpdateTask(taskId, {
          attachments: [...(task?.attachments || []), attachment],
        });
      };
      reader.readAsDataURL(file);
      return;
    }
    
    // Save file to project folder
    try {
      const project = this.wizardProjects.find((p) => p.id === task.projectId);
      if (project) {
        // Determine file type and save to appropriate folder
        const isImage = file.type.startsWith("image/");
        const subfolder = isImage ? "img/userprompt" : "media";
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name}`;
        
        // Convert file to base64 for storage
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Data = reader.result as string;
          
          // Save via gateway API
          if (this.client) {
            try {
              await this.client.request("wizard.tasks.update", {
                taskId,
                attachments: [
                  ...(task.attachments || []),
                  {
                    id: `att-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    url: base64Data, // Store as base64 data URL
                    type: isImage ? "image" : "file",
                    savedPath: `${subfolder}/${filename}`, // Path in project folder
                  },
                ],
              });
              
              // Update local state
              this.handleWizardUpdateTask(taskId, {
                attachments: [
                  ...(task.attachments || []),
                  {
                    id: `att-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    url: base64Data,
                    type: isImage ? "image" : "file",
                  },
                ],
              });
            } catch (err) {
              console.error("Failed to save attachment to project folder:", err);
              // Fallback to local storage only
              const attachment = {
                id: `att-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
                name: file.name,
                url: base64Data,
                type: isImage ? "image" : "file",
              };
              this.handleWizardUpdateTask(taskId, {
                attachments: [...(task.attachments || []), attachment],
              });
            }
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error("Error saving attachment:", err);
      // Fallback to old behavior
      const reader = new FileReader();
      reader.onload = () => {
        const attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: reader.result as string,
          type: file.type.startsWith("image/") ? "image" : "file",
        };
        this.handleWizardUpdateTask(taskId, {
          attachments: [...(task.attachments || []), attachment],
        });
      };
      reader.readAsDataURL(file);
    }
  }

  handleWizardAddTaskChecklistItem(taskId: string, text: string) {
    const task = this.wizardTasks.find((t) => t.id === taskId);
    if (task) {
      const item = {
        id: `check-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text,
        completed: false,
      };
      this.handleWizardUpdateTask(taskId, {
        checklist: [...(task.checklist || []), item],
      });
    }
  }

  handleWizardUpdateChecklistItem(taskId: string, itemId: string, updates: Partial<{ text: string; completed: boolean }>) {
    const task = this.wizardTasks.find((t) => t.id === taskId);
    if (task) {
      this.handleWizardUpdateTask(taskId, {
        checklist: (task.checklist || []).map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
      });
    }
  }

  handleWizardDeleteChecklistItem(taskId: string, itemId: string) {
    const task = this.wizardTasks.find((t) => t.id === taskId);
    if (task) {
      this.handleWizardUpdateTask(taskId, {
        checklist: (task.checklist || []).filter((item) => item.id !== itemId),
      });
    }
  }

  handleWizardRefresh() {
    try {
      const storedTasks = localStorage.getItem("openclaw.wizard.tasks");
      if (storedTasks) this.wizardTasks = JSON.parse(storedTasks);
      const storedNotes = localStorage.getItem("openclaw.wizard.notes");
      if (storedNotes) this.wizardNotes = JSON.parse(storedNotes);
      const storedProjects = localStorage.getItem("openclaw.wizard.projects");
      if (storedProjects) this.wizardProjects = JSON.parse(storedProjects);
    } catch {
      // Ignore parse errors
    }
  }

  handleWizardClearCache() {
    if (confirm("Clear all cached wizard data? This will remove all locally stored tasks, projects, and notes. The page will reload.")) {
      // Clear all wizard-related localStorage
      localStorage.removeItem("openclaw.wizard.tasks");
      localStorage.removeItem("openclaw.wizard.notes");
      localStorage.removeItem("openclaw.wizard.projects");
      localStorage.removeItem("openclaw.wizard.deliverables");
      localStorage.removeItem("openclaw.wizard.actionLog");
      
      // Clear component state
      this.wizardTasks = [];
      this.wizardNotes = [];
      this.wizardProjects = [];
      this.wizardDeliverables = [];
      this.wizardActionLog = [];
      this.wizardEditingProjectId = null;
      this.wizardProjectEditTab = "details";
      
      // Reload the page to ensure clean state
      window.location.reload();
    }
  }

  handleWizardAddProject(name: string, description?: string) {
    const project = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      status: "active" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    };
    this.wizardProjects = [...this.wizardProjects, project];
    localStorage.setItem("openclaw.wizard.projects", JSON.stringify(this.wizardProjects));
    this.logWizardAction("Project created", name);
  }

  handleWizardUpdateProject(projectId: string, updates: Partial<import("./views/wizard").WizardProject>) {
    this.wizardProjects = this.wizardProjects.map((p) =>
      p.id === projectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    localStorage.setItem("openclaw.wizard.projects", JSON.stringify(this.wizardProjects));
  }

  handleWizardDeleteProject(projectId: string) {
    const project = this.wizardProjects.find((p) => p.id === projectId);
    this.wizardProjects = this.wizardProjects.filter((p) => p.id !== projectId);
    localStorage.setItem("openclaw.wizard.projects", JSON.stringify(this.wizardProjects));
    if (project) {
      this.logWizardAction("Project deleted", project.name);
    }
  }

  async handleWizardEnhancePrompt(projectId: string) {
    const project = this.wizardProjects.find((p) => p.id === projectId);
    if (!project || !project.prompt) return;
    
    // Send enhancement request to chat
    const enhancementPrompt = `Enhance and improve this project prompt, making it more detailed, specific, and actionable:\n\nProject: ${project.name}\nCurrent Prompt:\n${project.prompt}\n\nProvide an enhanced version that's clearer and more comprehensive. Then use the wizard_projects tool to update the project's enhancedPrompt field.`;
    
    // Switch to chat tab
    this.tab = "chat";
    await this.updateComplete;
    
    // Send message directly
    const { sendChatMessage } = await import("./controllers/chat.js");
    await sendChatMessage(this as unknown as OpenClawApp, enhancementPrompt);
  }

  async handleWizardEnhanceResearch(projectId: string) {
    const project = this.wizardProjects.find((p) => p.id === projectId);
    if (!project) return;
    
    // Send enhancement request to chat
    const enhancementPrompt = `Review and enhance the research for this project. Organize it better, add missing insights, and improve clarity:\n\nProject: ${project.name}\nCurrent Research:\n${project.research || "No research yet"}\n\nProvide enhanced, well-organized research. Then use the wizard_projects tool to update the project's research field.`;
    
    // Switch to chat tab
    this.tab = "chat";
    await this.updateComplete;
    
    // Send message directly
    const { sendChatMessage } = await import("./controllers/chat.js");
    await sendChatMessage(this as unknown as OpenClawApp, enhancementPrompt);
  }

  handleWizardGenerateTasksFromFeatures(projectId: string) {
    const project = this.wizardProjects.find((p) => p.id === projectId);
    if (!project || !project.features) return;

    const lines = project.features
      .split("\n")
      .map((line) => line.trim().replace(/^[-*]\s*/, ""))
      .filter((line) => line.length > 0)
      .slice(0, 20);

    for (const line of lines) {
      this.handleWizardAddTask(line, `From project "${project.name}" features.`, project.id);
    }

    if (lines.length > 0) {
      this.logWizardAction("Generated tasks from features", `${project.name}: ${lines.length} tasks`);
    }
  }

  async handleWorkspacePromptsLoad() {
    if (!this.client || this.workspacePromptsLoading) return;
    this.workspacePromptsLoading = true;
    try {
      const response = await this.client.request("workspace.prompts.list", {}) as ApiResponse<{ prompts: Array<{ name: string; filename: string; enabled: boolean; content: string; description: string; example: string }> }>;
      if (response?.success && response.result) {
        this.workspacePrompts = response.result.prompts || [];
      }
    } catch (err) {
      console.error("Failed to load workspace prompts:", err);
      this.workspacePrompts = [];
    } finally {
      this.workspacePromptsLoading = false;
    }
  }

  async handleWorkspacePromptsSave(filename: string, content: string, enabled: boolean) {
    if (!this.client) return;
    try {
      const response = await this.client.request("workspace.prompts.save", {
        filename,
        content,
        enabled,
      }) as ApiResponse;
      if (response?.success) {
        // Reload prompts to reflect changes
        await this.handleWorkspacePromptsLoad();
      } else {
        console.error("Failed to save workspace prompt:", response?.error);
      }
    } catch (err) {
      console.error("Failed to save workspace prompt:", err);
    }
  }

  async handleLoadSkillContent(skillKey: string) {
    if (!this.client) return;
    try {
      const response = await this.client.request("skills.getContent", { skillKey }) as ApiResponse<{ content: string }>;
      if (response?.success && response.result) {
        this.editingSkillContent = response.result.content || "";
        updateSkillEdit(this as unknown as Parameters<typeof updateSkillEdit>[0], skillKey + "_content", this.editingSkillContent);
      }
    } catch (err) {
      console.error("Failed to load skill content:", err);
    }
  }

  async handleSaveSkillContent(skillKey: string, content: string) {
    if (!this.client) return;
    try {
      const response = await this.client.request("skills.saveContent", { skillKey, content }) as ApiResponse;
      if (response?.success) {
        this.editingSkillContent = "";
        // Clear the edit cache
        const edits = { ...this.skillEdits };
        delete edits[skillKey + "_content"];
        this.skillEdits = edits;
        await loadSkills(this as unknown as Parameters<typeof loadSkills>[0], { clearMessages: true });
        setSkillMessage(this as unknown as Parameters<typeof setSkillMessage>[0], skillKey, {
          kind: "success",
          message: "Skill content saved",
        });
      } else {
        console.error("Failed to save skill content:", response?.error);
      }
    } catch (err) {
      console.error("Failed to save skill content:", err);
    }
  }

  handleDeleteSkill(skillKey: string) {
    if (!this.client) return;
    (async () => {
      try {
        const response = await this.client?.request("skills.delete", { skillKey }) as ApiResponse | undefined;
        if (response?.success) {
          this.selectedSkillKey = null;
          this.editingSkillContent = "";
          await loadSkills(this as unknown as Parameters<typeof loadSkills>[0], { clearMessages: true });
        } else {
          console.error("Failed to delete skill:", response?.error);
        }
      } catch (err) {
        console.error("Failed to delete skill:", err);
      }
    })();
  }

  async handleTestSkill(skillKey: string) {
    if (!this.client) return;
    this.skillsBusyKey = skillKey;
    try {
      const response = await this.client.request("skills.test", { skillKey }) as ApiResponse<{ isValid: boolean; message?: string; issues?: string[] }>;
      if (response?.success && response.result) {
        const { isValid, message, issues } = response.result;
        setSkillMessage(this as unknown as Parameters<typeof setSkillMessage>[0], skillKey, {
          kind: isValid ? "success" : "error",
          message: message || (isValid ? "Skill is valid" : `Validation failed: ${issues?.join(", ") || "unknown error"}`),
        });
      }
    } catch (err) {
      setSkillMessage(this as unknown as Parameters<typeof setSkillMessage>[0], skillKey, {
        kind: "error",
        message: `Test failed: ${String(err)}`,
      });
    } finally {
      this.skillsBusyKey = null;
    }
  }

  handleCreateSkill() {
    // Show the full editor modal
    this.newSkillName = "";
    this.newSkillCategory = "";
    this.newSkillContent = `---
name: [skill-name]
description: [TODO: Complete and informative explanation of what the skill does and when to use it. Include WHEN to use this skill - specific scenarios, file types, or tasks that trigger it.]
category: [selected-category]
---

# [Skill Name]

## Overview

[TODO: 1-2 sentences explaining what this skill enables]

## Usage

[TODO: Add usage instructions, examples, and workflow guidance]

## Resources (optional)

Create only the resource directories this skill actually needs.

### scripts/
Executable code (Python/Bash/etc.) that can be run directly.

### references/
Documentation and reference material.

### assets/
Files used in output (templates, icons, fonts, etc.)
`;
    this.showCreateSkillModal = true;
  }

  async handleSaveNewSkill() {
    if (!this.newSkillName.trim()) {
      alert("Please enter a skill name");
      return;
    }
    if (!this.newSkillCategory) {
      alert("Please select a category");
      return;
    }
    
    // Replace placeholders in template
    const skillName = this.newSkillName.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const content = this.newSkillContent
      .replace(/\[skill-name\]/g, skillName)
      .replace(/\[Skill Name\]/g, this.newSkillName.trim())
      .replace(/\[selected-category\]/g, this.newSkillCategory);
    
    if (!this.client) return;
    try {
      const response = await this.client.request("skills.create", {
        skillName,
        content,
        category: this.newSkillCategory,
      }) as ApiResponse<{ skillKey: string }>;
      if (response?.success && response.result) {
        await loadSkills(this as unknown as Parameters<typeof loadSkills>[0], { clearMessages: true });
        this.selectedSkillKey = response.result.skillKey;
        this.showCreateSkillModal = false;
        this.newSkillName = "";
        this.newSkillCategory = "";
        this.newSkillContent = "";
        // Load the content to show in editor
        await this.handleLoadSkillContent(response.result.skillKey);
      }
    } catch (err) {
      console.error("Failed to create skill:", err);
      alert(`Failed to create skill: ${String(err)}`);
    }
  }

  render() {
    return renderApp(this as unknown as AppViewState);
  }
}
