import { contextBridge, ipcRenderer } from 'electron';

const NAMESPACE = 'openclaw:';

class MessageBroker {
  private callbacks = new Map<string, Set<Function>>();

  sendInvocation<T>(route: string, ...params: any[]): Promise<T> {
    return ipcRenderer.invoke(`${NAMESPACE}${route}`, ...params);
  }

  watchMessages(route: string, callback: Function): () => void {
    const fullRoute = `${NAMESPACE}${route}`;
    
    if (!this.callbacks.has(fullRoute)) {
      this.callbacks.set(fullRoute, new Set());
      ipcRenderer.on(fullRoute, (_channel, payload) => {
        const listeners = this.callbacks.get(fullRoute);
        if (listeners) {
          listeners.forEach(fn => fn(payload));
        }
      });
    }
    
    this.callbacks.get(fullRoute)!.add(callback);
    
    return () => {
      const listeners = this.callbacks.get(fullRoute);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.callbacks.delete(fullRoute);
          ipcRenderer.removeAllListeners(fullRoute);
        }
      }
    };
  }
}

const broker = new MessageBroker();

const bridgeInterface = {
  launchAgentProcess: () => broker.sendInvocation('agent:launch'),
  haltAgentProcess: () => broker.sendInvocation('agent:terminate'),
  executeCliCommand: (args: string[]) => broker.sendInvocation('cli:exec', args),
  queryRuntimeState: () => broker.sendInvocation('state:query'),
  fetchTraceLogs: () => broker.sendInvocation('trace:fetch'),
  onTraceMessage: (handler: Function) => broker.watchMessages('trace', handler),
};

contextBridge.exposeInMainWorld('openclawBridge', bridgeInterface);

export type BridgeInterface = typeof bridgeInterface;
