import type { GatewayBrowserClient } from "../gateway";
import type { ToolStatusReport } from "../types";

export type ToolsState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  toolsLoading: boolean;
  toolsReport: ToolStatusReport | null;
  toolsError: string | null;
  toolsBusyKey: string | null;
  toolEdits: Record<string, string>;
  toolMessages: ToolMessageMap;
};

export type ToolMessage = {
  kind: "success" | "error";
  message: string;
};

export type ToolMessageMap = Record<string, ToolMessage>;

type LoadToolsOptions = {
  clearMessages?: boolean;
};

export function setToolMessage(state: ToolsState, key: string, message?: ToolMessage) {
  if (!key.trim()) return;
  const next = { ...state.toolMessages };
  if (message) next[key] = message;
  else delete next[key];
  state.toolMessages = next;
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return String(err);
}

export async function loadTools(state: ToolsState, options?: LoadToolsOptions) {
  if (options?.clearMessages && Object.keys(state.toolMessages).length > 0) {
    state.toolMessages = {};
  }
  if (!state.client || !state.connected) return;
  if (state.toolsLoading) return;
  state.toolsLoading = true;
  state.toolsError = null;
  try {
    const res = (await state.client.request("tools.list", {})) as ToolStatusReport | undefined;
    if (res) state.toolsReport = res;
  } catch (err) {
    state.toolsError = getErrorMessage(err);
  } finally {
    state.toolsLoading = false;
  }
}

export function updateToolEdit(state: ToolsState, toolKey: string, value: string) {
  state.toolEdits = { ...state.toolEdits, [toolKey]: value };
}

export async function updateToolEnabled(state: ToolsState, toolKey: string, enabled: boolean) {
  if (!state.client || !state.connected) return;
  state.toolsBusyKey = toolKey;
  state.toolsError = null;
  try {
    await state.client.request("tools.update", { toolKey, enabled });
    await loadTools(state);
    setToolMessage(state, toolKey, {
      kind: "success",
      message: enabled ? "Tool enabled" : "Tool disabled",
    });
  } catch (err) {
    const message = getErrorMessage(err);
    state.toolsError = message;
    setToolMessage(state, toolKey, {
      kind: "error",
      message,
    });
  } finally {
    state.toolsBusyKey = null;
  }
}

export async function saveToolApiKey(state: ToolsState, toolKey: string) {
  if (!state.client || !state.connected) return;
  state.toolsBusyKey = toolKey;
  state.toolsError = null;
  try {
    const apiKey = state.toolEdits[toolKey] ?? "";
    await state.client.request("tools.update", { toolKey, apiKey });
    await loadTools(state);
    setToolMessage(state, toolKey, {
      kind: "success",
      message: "API key saved",
    });
  } catch (err) {
    const message = getErrorMessage(err);
    state.toolsError = message;
    setToolMessage(state, toolKey, {
      kind: "error",
      message,
    });
  } finally {
    state.toolsBusyKey = null;
  }
}

export async function installTool(
  state: ToolsState,
  toolKey: string,
  name: string,
  installId: string,
) {
  if (!state.client || !state.connected) return;
  state.toolsBusyKey = toolKey;
  state.toolsError = null;
  try {
    const result = (await state.client.request("tools.install", {
      name,
      installId,
      timeoutMs: 120000,
    })) as { ok?: boolean; message?: string };
    await loadTools(state);
    setToolMessage(state, toolKey, {
      kind: "success",
      message: result?.message ?? "Installed",
    });
  } catch (err) {
    const message = getErrorMessage(err);
    state.toolsError = message;
    setToolMessage(state, toolKey, {
      kind: "error",
      message,
    });
  } finally {
    state.toolsBusyKey = null;
  }
}
