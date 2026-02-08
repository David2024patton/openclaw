---
name: ccsinfo
description: Query and analyze Claude Code session data from a remote server.
homepage: https://github.com/openclaw/skills/tree/main/skills/myakove/ccsinfo/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# ccsinfo

Query and analyze Claude Code session data from a remote server.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [ccsinfo](https://github.com/openclaw/skills/tree/main/skills/myakove/ccsinfo/SKILL.md)
- **Security Status**: SAFE

## Instructions

# ccsinfo - Claude Code Session Info

Access and analyze Claude Code session data from a remote ccsinfo server running on the user's machine.

**Server Repository**: https://github.com/myk-org/ccsinfo

## Requirements

### 1. Server Setup (on the machine with Claude Code data)

The ccsinfo server must be running on the machine that has Claude Code session data.

Install and run the server:
```bash
# Install ccsinfo
uv tool install git+https://github.com/myk-org/ccsinfo.git

# Start the server (accessible on LAN)
ccsinfo serve --host 0.0.0.0 --port 9999
```

The server reads Claude Code session data from `~/.claude/projects/` and exposes it via REST API.

For full server documentation, see: https://github.com/myk-org/ccsinfo

### 2. Client Setup (where this skill runs)

The `ccsinfo` CLI tool must be installed. Check if installed:

```bash
which ccsinfo
```

If not installed, run the installation script:

```bash
bash scripts/install.sh
```

### 3. Configuration

Set the `CCSINFO_SERVER_URL` environment variable to point to your server:

```bash
export CCSINFO_SERVER_URL=http://192.168.1.100:9999
```

Add this to your shell profile (`.bashrc`, `.zshrc`, etc.) to persist across sessions.

## Quick Start

All commands automatically connect to the remote server via `$CCSINFO_SERVER_URL`.

### List recent sessions
```bash
ccsinfo sessions list
```

### Show session details (supports partial ID matching)
```bash
ccsinfo sessions show <session-id>
```

### View conversation messages
```bash
ccsinfo sessions messages <session-id>
```

### Search sessions by content
```bash
ccsinfo search sessions "search term"
```

### View global statistics
```bash
ccsinfo stats global
```

## Common Workflows

### Inspect a specific session

1. List sessions to find the ID:
   ```bash
   ccsinfo sessions list
   ```

2. Show session details:
   ```bash
   ccsinfo sessions show <id>
   ```

3. View messages:
   ```bash
   ccsinfo sessions messages <id>
   ```

4. Check tool calls:
   ```ba
