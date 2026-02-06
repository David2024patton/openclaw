import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
export function Dashboard() {
    const [traces, setTraces] = useState([]);
    const [systemState, setSystemState] = useState(null);
    const [commandInput, setCommandInput] = useState('');
    const [busyOperation, setBusyOperation] = useState(false);
    const tracesEndRef = useRef(null);
    useEffect(() => {
        loadInitialData();
        const unsubscribe = window.openclawBridge.onTraceMessage((record) => {
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
        }
        catch (err) {
            console.error('Failed to load initial data:', err);
        }
    };
    const refreshSystemState = async () => {
        try {
            const freshState = await window.openclawBridge.queryRuntimeState();
            setSystemState(freshState);
        }
        catch (err) {
            console.error('State refresh failed:', err);
        }
    };
    const handleLaunchAgent = async () => {
        setBusyOperation(true);
        try {
            const outcome = await window.openclawBridge.launchAgentProcess();
            console.log('Launch result:', outcome);
            await refreshSystemState();
        }
        catch (err) {
            console.error('Launch failed:', err);
        }
        finally {
            setBusyOperation(false);
        }
    };
    const handleHaltAgent = async () => {
        setBusyOperation(true);
        try {
            const outcome = await window.openclawBridge.haltAgentProcess();
            console.log('Halt result:', outcome);
            await refreshSystemState();
        }
        catch (err) {
            console.error('Halt failed:', err);
        }
        finally {
            setBusyOperation(false);
        }
    };
    const handleExecuteCommand = async () => {
        if (!commandInput.trim())
            return;
        setBusyOperation(true);
        try {
            const args = commandInput.trim().split(/\s+/);
            const outcome = await window.openclawBridge.executeCliCommand(args);
            console.log('Command result:', outcome);
            setCommandInput('');
        }
        catch (err) {
            console.error('Command execution failed:', err);
        }
        finally {
            setBusyOperation(false);
        }
    };
    const getSeverityClass = (severity) => {
        const mapping = {
            info: 'trace-info',
            warn: 'trace-warn',
            error: 'trace-error',
        };
        return mapping[severity] || 'trace-info';
    };
    const formatTimestamp = (epochMs) => {
        const date = new Date(epochMs);
        return date.toLocaleTimeString();
    };
    return (_jsxs("div", { className: "dashboard-container", children: [_jsxs("header", { className: "dashboard-header", children: [_jsx("img", { src: "https://mintcdn.com/clawdhub/FaXdIfo7gPK_jSWb/assets/openclaw-logo-text.png?w=1650&fit=max&auto=format&n=FaXdIfo7gPK_jSWb&q=85&s=e82a8bd9b834bec4f6e97303deb1735b", alt: "OpenClaw Logo", className: "header-logo" }), _jsx("h1", { children: "Desktop Controller" })] }), _jsxs("div", { className: "dashboard-content", children: [_jsxs("section", { className: "control-panel", children: [_jsx("h2", { children: "Agent Controls" }), _jsxs("div", { className: "button-group", children: [_jsx("button", { onClick: handleLaunchAgent, disabled: busyOperation || systemState?.isRunning, className: "btn btn-primary", children: "Launch Agent" }), _jsx("button", { onClick: handleHaltAgent, disabled: busyOperation || !systemState?.isRunning, className: "btn btn-danger", children: "Halt Agent" })] }), _jsxs("div", { className: "command-section", children: [_jsx("h3", { children: "Execute CLI Command" }), _jsxs("div", { className: "command-input-group", children: [_jsx("input", { type: "text", value: commandInput, onChange: (e) => setCommandInput(e.target.value), onKeyPress: (e) => e.key === 'Enter' && handleExecuteCommand(), placeholder: "e.g., config get gateway.mode", className: "command-input", disabled: busyOperation }), _jsx("button", { onClick: handleExecuteCommand, disabled: busyOperation || !commandInput.trim(), className: "btn btn-secondary", children: "Execute" })] })] }), systemState && (_jsxs("div", { className: "status-panel", children: [_jsx("h3", { children: "System Status" }), _jsxs("dl", { className: "status-list", children: [_jsx("dt", { children: "Agent Status:" }), _jsx("dd", { className: systemState.isRunning ? 'status-active' : 'status-inactive', children: systemState.isRunning ? 'Running' : 'Stopped' }), _jsx("dt", { children: "Exit Attempts Blocked:" }), _jsx("dd", { children: systemState.exitAttempts }), _jsx("dt", { children: "Electron Version:" }), _jsx("dd", { children: systemState.electronVersion }), _jsx("dt", { children: "Node.js Version:" }), _jsx("dd", { children: systemState.nodeVersion })] })] }))] }), _jsxs("section", { className: "trace-panel", children: [_jsx("h2", { children: "Activity Trace" }), _jsxs("div", { className: "trace-viewport", children: [traces.map((record, idx) => (_jsxs("div", { className: `trace-entry ${getSeverityClass(record.severity)}`, children: [_jsx("span", { className: "trace-timestamp", children: formatTimestamp(record.epochMs) }), _jsxs("span", { className: "trace-severity", children: ["[", record.severity.toUpperCase(), "]"] }), _jsx("span", { className: "trace-content", children: record.content })] }, idx))), _jsx("div", { ref: tracesEndRef })] })] })] })] }));
}
