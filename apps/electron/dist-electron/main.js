import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { setupRendererBridge, teardownRendererBridge } from './ipc-handlers';
class DesktopApplication {
    constructor() {
        this.primaryWindow = null;
        this.windowConfig = {
            width: 1200,
            height: 800,
            minWidth: 800,
            minHeight: 600,
        };
        this.bindApplicationEvents();
    }
    bindApplicationEvents() {
        app.on('ready', () => this.onApplicationReady());
        app.on('activate', () => this.onActivate());
        app.on('window-all-closed', () => this.onAllWindowsClosed());
        app.on('will-quit', () => this.onWillQuit());
    }
    async onApplicationReady() {
        setupRendererBridge();
        await this.createPrimaryWindow();
    }
    onActivate() {
        if (BrowserWindow.getAllWindows().length === 0) {
            this.createPrimaryWindow();
        }
    }
    onAllWindowsClosed() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }
    onWillQuit() {
        teardownRendererBridge();
    }
    async createPrimaryWindow() {
        this.primaryWindow = new BrowserWindow({
            width: this.windowConfig.width,
            height: this.windowConfig.height,
            minWidth: this.windowConfig.minWidth,
            minHeight: this.windowConfig.minHeight,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js'),
                nodeIntegration: false,
                contextIsolation: true,
                sandbox: false,
            },
            title: 'OpenClaw Desktop',
            backgroundColor: '#1a1a1a',
        });
        this.primaryWindow.on('closed', () => {
            this.primaryWindow = null;
        });
        await this.loadRendererContent();
        if (!app.isPackaged) {
            this.primaryWindow.webContents.openDevTools({ mode: 'detach' });
        }
    }
    async loadRendererContent() {
        if (!this.primaryWindow)
            return;
        if (app.isPackaged) {
            const htmlPath = path.join(__dirname, '../dist/index.html');
            await this.primaryWindow.loadFile(htmlPath);
        }
        else {
            const devServerUrl = 'http://localhost:5173';
            await this.primaryWindow.loadURL(devServerUrl);
        }
    }
}
new DesktopApplication();
