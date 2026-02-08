---
name: safe-exec
description: Safe command execution for OpenClaw Agents with automatic danger pattern detection, risk assessment, user approval.
homepage: https://github.com/openclaw/skills/tree/main/skills/ottttto/safe-exec/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# safe-exec

Safe command execution for OpenClaw Agents with automatic danger pattern detection, risk assessment, user approval.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [safe-exec](https://github.com/openclaw/skills/tree/main/skills/ottttto/safe-exec/SKILL.md)
- **Security Status**: SAFE

## Instructions

# SafeExec - Safe Command Execution

Provides secure command execution capabilities for OpenClaw Agents with automatic interception of dangerous operations and approval workflow.

## Features

- 🔍 **Automatic danger pattern detection** - Identifies risky commands before execution
- 🚨 **Risk-based interception** - Multi-level assessment (CRITICAL/HIGH/MEDIUM/LOW)
- 💬 **In-session notifications** - Real-time alerts in your current terminal/session
- ✅ **User approval workflow** - Commands wait for explicit confirmation
- 📊 **Complete audit logging** - Full traceability of all operations
- 🤖 **Agent-friendly** - Non-interactive mode support for automated workflows
- 🔧 **Platform-agnostic** - Works independently of communication tools (Feishu, Telegram, etc.)

## Quick Start

### Installation (One Command)

**The easiest way to install SafeExec:**

Just say in your OpenClaw chat:
```
Help me install SafeExec skill from ClawdHub
```

OpenClaw will automatically download, install, and configure SafeExec for you!

### Alternative: Manual Installation

If you prefer manual installation:

```bash
# Using ClawdHub CLI
export CLAWDHUB_REGISTRY=https://www.clawhub.ai
clawdhub install safe-exec

# Or download directly from GitHub
git clone https://github.com/OTTTTTO/safe-exec.git ~/.openclaw/skills/safe-exec
chmod +x ~/.openclaw/skills/safe-exec/safe-exec*.sh
```

### Enable SafeExec

After installation, simply say:
```
Enable SafeExec
```

SafeExec will start monitoring all shell commands automatically!

## How It Works

Once enabled, SafeExec automatically monitors all shell command executions. When a potentially dangerous command is detected, it intercepts the execution and requests your approval through **in-session terminal notifications**.

**Architecture:**
- Requests stored in: `~/.openclaw/safe-exec/pending/`
- Audit log: `~/.openclaw/safe-exec-audit.log`
- Rules config: `~/.openclaw/safe-exec-rules.json`

## Usage

**Enable SafeExec:**
```
Enable SafeExec
```

```
Turn
