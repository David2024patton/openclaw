---
name: browsh
description: A modern text-based browser.
homepage: https://github.com/openclaw/skills/tree/main/skills/gumadeiras/browsh/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# browsh

A modern text-based browser.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [browsh](https://github.com/openclaw/skills/tree/main/skills/gumadeiras/browsh/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Browsh

A fully-modern text-based browser. It renders stories and videos, filters ads, and saves bandwidth.

## Prerequisites
- `browsh` binary must be in PATH.
- `firefox` binary must be in PATH (Browsh uses it as a headless backend).

**Local Setup (if installed in `~/apps`):**
Ensure your PATH includes the installation directories:
```bash
export PATH=$HOME/apps:$HOME/apps/firefox:$PATH
```

## Usage

Start Browsh:
```bash
browsh
```

Open a specific URL:
```bash
browsh --startup-url https://google.com
```

**Note:** Browsh is a TUI application. Run it inside a PTY session (e.g., using `tmux` or the `process` tool with `pty=true`).
