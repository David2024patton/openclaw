import { useState, useEffect, useRef } from 'react';

declare global {
  interface Window {
    openclawBridge: {
      launchAgentProcess: () => Promise<any>;
      haltAgentProcess: () => Promise<any>;
      executeCliCommand: (args: string[]) => Promise<any>;
      queryRuntimeState: () => Promise<any>;
      fetchTraceLogs: () => Promise<any>;
      onTraceMessage: (handler: (entry: any) => void) => () => void;
    };
  }
}

type TraceRecord = {
  severity: 'info' | 'warn' | 'error';
  content: string;
  epochMs: number;
};

type SystemState = {
  isRunning: boolean;
  exitAttempts: number;
  electronVersion: string;
  nodeVersion: string;
};

export function Dashboard() {
  const [traces, setTraces] = useState<TraceRecord[]>([]);
  const [systemState, setSystemState] = useState<SystemState | null>(null);
  const [commandInput, setCommandInput] = useState('');
  const [busyOperation, setBusyOperation] = useState(false);
  const tracesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadInitialData();
    
    const unsubscribe = window.openclawBridge.onTraceMessage((record: TraceRecord) => {
      setTraces(prev => [...prev, record]);
    });

    const refreshInterval = setInterval(refreshSystemState, 3000);

    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  useEffect(() => {
    tracesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [traces]);

  const loadInitialData = async () => {
    try {
      const [historicTraces, currentState] = await Promise.all([
        window.openclawBridge.fetchTraceLogs(),
        window.openclawBridge.queryRuntimeState(),
      ]);
      setTraces(historicTraces);
      setSystemState(currentState);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  };

  const refreshSystemState = async () => {
    try {
      const freshState = await window.openclawBridge.queryRuntimeState();
      setSystemState(freshState);
    } catch (err) {
      console.error('State refresh failed:', err);
    }
  };

  const handleLaunchAgent = async () => {
    setBusyOperation(true);
    try {
      const outcome = await window.openclawBridge.launchAgentProcess();
      console.log('Launch result:', outcome);
      await refreshSystemState();
    } catch (err) {
      console.error('Launch failed:', err);
    } finally {
      setBusyOperation(false);
    }
  };

  const handleHaltAgent = async () => {
    setBusyOperation(true);
    try {
      const outcome = await window.openclawBridge.haltAgentProcess();
      console.log('Halt result:', outcome);
      await refreshSystemState();
    } catch (err) {
      console.error('Halt failed:', err);
    } finally {
      setBusyOperation(false);
    }
  };

  const handleExecuteCommand = async () => {
    if (!commandInput.trim()) return;

    setBusyOperation(true);
    try {
      const args = commandInput.trim().split(/\s+/);
      const outcome = await window.openclawBridge.executeCliCommand(args);
      console.log('Command result:', outcome);
      setCommandInput('');
    } catch (err) {
      console.error('Command execution failed:', err);
    } finally {
      setBusyOperation(false);
    }
  };

  const getSeverityClass = (severity: string): string => {
    const mapping: Record<string, string> = {
      info: 'trace-info',
      warn: 'trace-warn',
      error: 'trace-error',
    };
    return mapping[severity] || 'trace-info';
  };

  const formatTimestamp = (epochMs: number): string => {
    const date = new Date(epochMs);
    return date.toLocaleTimeString();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img 
          src="https://mintcdn.com/clawdhub/FaXdIfo7gPK_jSWb/assets/openclaw-logo-text.png?w=1650&fit=max&auto=format&n=FaXdIfo7gPK_jSWb&q=85&s=e82a8bd9b834bec4f6e97303deb1735b" 
          alt="OpenClaw Logo" 
          className="header-logo"
        />
        <h1>Desktop Controller</h1>
      </header>

      <div className="dashboard-content">
        <section className="control-panel">
          <h2>Agent Controls</h2>
          <div className="button-group">
            <button 
              onClick={handleLaunchAgent}
              disabled={busyOperation || systemState?.isRunning}
              className="btn btn-primary"
            >
              Launch Agent
            </button>
            <button 
              onClick={handleHaltAgent}
              disabled={busyOperation || !systemState?.isRunning}
              className="btn btn-danger"
            >
              Halt Agent
            </button>
          </div>

          <div className="command-section">
            <h3>Execute CLI Command</h3>
            <div className="command-input-group">
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleExecuteCommand()}
                placeholder="e.g., config get gateway.mode"
                className="command-input"
                disabled={busyOperation}
              />
              <button 
                onClick={handleExecuteCommand}
                disabled={busyOperation || !commandInput.trim()}
                className="btn btn-secondary"
              >
                Execute
              </button>
            </div>
          </div>

          {systemState && (
            <div className="status-panel">
              <h3>System Status</h3>
              <dl className="status-list">
                <dt>Agent Status:</dt>
                <dd className={systemState.isRunning ? 'status-active' : 'status-inactive'}>
                  {systemState.isRunning ? 'Running' : 'Stopped'}
                </dd>
                
                <dt>Exit Attempts Blocked:</dt>
                <dd>{systemState.exitAttempts}</dd>
                
                <dt>Electron Version:</dt>
                <dd>{systemState.electronVersion}</dd>
                
                <dt>Node.js Version:</dt>
                <dd>{systemState.nodeVersion}</dd>
              </dl>
            </div>
          )}
        </section>

        <section className="trace-panel">
          <h2>Activity Trace</h2>
          <div className="trace-viewport">
            {traces.map((record, idx) => (
              <div key={idx} className={`trace-entry ${getSeverityClass(record.severity)}`}>
                <span className="trace-timestamp">{formatTimestamp(record.epochMs)}</span>
                <span className="trace-severity">[{record.severity.toUpperCase()}]</span>
                <span className="trace-content">{record.content}</span>
              </div>
            ))}
            <div ref={tracesEndRef} />
          </div>
        </section>
      </div>
    </div>
  );
}
