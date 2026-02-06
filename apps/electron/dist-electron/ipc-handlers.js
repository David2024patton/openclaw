import { ipcMain, BrowserWindow } from 'electron';
import * as cliAdapter from './electron-adapter';
class RendererBridge {
    constructor() {
        this.traceBuffer = [];
        this.bufferLimit = 1000;
        this.channelPrefix = 'openclaw:';
    }
    addTrace(severity, content) {
        const entry = {
            severity,
            content,
            epochMs: Date.now()
        };
        this.traceBuffer.push(entry);
        while (this.traceBuffer.length > this.bufferLimit) {
            this.traceBuffer.shift();
        }
        this.broadcastToRenderers(`${this.channelPrefix}trace`, entry);
    }
    broadcastToRenderers(channel, payload) {
        const allWindows = BrowserWindow.getAllWindows();
        for (const win of allWindows) {
            win.webContents.send(channel, payload);
        }
    }
    getTraceHistory() {
        return [...this.traceBuffer];
    }
    wireHandlers() {
        cliAdapter.initAdapter((severity, content) => this.addTrace(severity, content));
        ipcMain.handle(`${this.channelPrefix}agent:launch`, async () => {
            return await cliAdapter.startAgent();
        });
        ipcMain.handle(`${this.channelPrefix}agent:terminate`, async () => {
            return await cliAdapter.stopAgent();
        });
        ipcMain.handle(`${this.channelPrefix}cli:exec`, async (_evt, cmdArgs) => {
            return await cliAdapter.runCommand(cmdArgs);
        });
        ipcMain.handle(`${this.channelPrefix}state:query`, () => {
            return cliAdapter.getStatus();
        });
        ipcMain.handle(`${this.channelPrefix}trace:fetch`, () => {
            return this.getTraceHistory();
        });
        console.log('[RendererBridge] Communication channels established');
    }
    teardown() {
        const channels = [
            `${this.channelPrefix}agent:launch`,
            `${this.channelPrefix}agent:terminate`,
            `${this.channelPrefix}cli:exec`,
            `${this.channelPrefix}state:query`,
            `${this.channelPrefix}trace:fetch`
        ];
        for (const ch of channels) {
            ipcMain.removeHandler(ch);
        }
        cliAdapter.cleanup();
        console.log('[RendererBridge] Communication channels destroyed');
    }
}
const bridge = new RendererBridge();
export function setupRendererBridge() {
    bridge.wireHandlers();
}
export function teardownRendererBridge() {
    bridge.teardown();
}
