---
name: tmux-agents
description: Manage background coding agents in tmux sessions.
homepage: https://github.com/openclaw/skills/tree/main/skills/cuba6112/tmux-agents/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# tmux-agents

Manage background coding agents in tmux sessions.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [tmux-agents](https://github.com/openclaw/skills/tree/main/skills/cuba6112/tmux-agents/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Tmux Agents

Run coding agents in persistent tmux sessions. They work in the background while you do other things.

## Available Agents

### ☁️ Cloud Agents (API credits)

| Agent | Command | Best For |
|-------|---------|----------|
| **claude** | Claude Code | Complex coding, refactoring, full projects |
| **codex** | OpenAI Codex | Quick edits, auto-approve mode |
| **gemini** | Google Gemini | Research, analysis, documentation |

### 🦙 Local Agents (FREE via Ollama)

| Agent | Command | Best For |
|-------|---------|----------|
| **ollama-claude** | Claude Code + Ollama | Long experiments, heavy refactoring |
| **ollama-codex** | Codex + Ollama | Extended coding sessions |

Local agents use your Mac's GPU — no API costs, great for experimentation!

## Quick Commands

### Spawn a new agent session
```bash
./skills/tmux-agents/scripts/spawn.sh <name> <task> [agent]

# Cloud (uses API credits)
./skills/tmux-agents/scripts/spawn.sh fix-bug "Fix login validation" claude
./skills/tmux-agents/scripts/spawn.sh refactor "Refactor the auth module" codex
./skills/tmux-agents/scripts/spawn.sh research "Research caching strategies" gemini

# Local (FREE - uses Ollama)
./skills/tmux-agents/scripts/spawn.sh experiment "Rewrite entire test suite" ollama-claude
./skills/tmux-agents/scripts/spawn.sh big-refactor "Refactor all services" ollama-codex
```

### List running sessions
```bash
tmux list-sessions
# or
./skills/tmux-agents/scripts/status.sh
```

### Check on a session
```bash
./skills/tmux-agents/scripts/check.sh session-name
```

### Attach to watch live
```bash
tmux attach -t session-name
# Detach with: Ctrl+B, then D
```

### Send additional instructions
```bash
tmux send-keys -t session-name "additional instruction here" Enter
```

### Kill a session when done
```bash
tmux kill-session -t session-name
```

## When to Use Local vs Cloud

| Scenario | Recommendation |
|----------|----------------|
| Quick fix, time-sensitive | ☁️ Cloud (faster) |
| Expensive task, bud
