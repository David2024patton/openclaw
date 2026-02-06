import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { setupRendererBridge, teardownRendererBridge } from './ipc-handlers';

class DesktopApplication {
  private primaryWindow: BrowserWindow | null = null;
  private readonly windowConfig = {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
  };

  constructor() {
    this.bindApplicationEvents();
  }

  private bindApplicationEvents(): void {
    app.on('ready', () => this.onApplicationReady());
    app.on('activate', () => this.onActivate());
    app.on('window-all-closed', () => this.onAllWindowsClosed());
    app.on('will-quit', () => this.onWillQuit());
  }

  private async onApplicationReady(): Promise<void> {
    setupRendererBridge();
    await this.createPrimaryWindow();
  }

  private onActivate(): void {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createPrimaryWindow();
    }
  }

  private onAllWindowsClosed(): void {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onWillQuit(): void {
    teardownRendererBridge();
  }

  private async createPrimaryWindow(): Promise<void> {
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

  private async loadRendererContent(): Promise<void> {
    if (!this.primaryWindow) return;

    if (app.isPackaged) {
      const htmlPath = path.join(__dirname, '../dist/index.html');
      await this.primaryWindow.loadFile(htmlPath);
    } else {
      const devServerUrl = 'http://localhost:5173';
      await this.primaryWindow.loadURL(devServerUrl);
    }
  }
}

new DesktopApplication();
