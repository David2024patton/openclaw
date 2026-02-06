import { contextBridge, ipcRenderer } from 'electron';
const NAMESPACE = 'openclaw:';
class MessageBroker {
    constructor() {
        this.callbacks = new Map();
    }
    sendInvocation(route, ...params) {
        return ipcRenderer.invoke(`${NAMESPACE}${route}`, ...params);
    }
    watchMessages(route, callback) {
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
        this.callbacks.get(fullRoute).add(callback);
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
    executeCliCommand: (args) => broker.sendInvocation('cli:exec', args),
    queryRuntimeState: () => broker.sendInvocation('state:query'),
    fetchTraceLogs: () => broker.sendInvocation('trace:fetch'),
    onTraceMessage: (handler) => broker.watchMessages('trace', handler),
};
contextBridge.exposeInMainWorld('openclawBridge', bridgeInterface);
