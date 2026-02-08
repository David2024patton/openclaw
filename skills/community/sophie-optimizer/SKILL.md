---
name: sophie-optimizer
description: Automated context health management for OpenClaw.
homepage: https://github.com/openclaw/skills/tree/main/skills/zayresz/sophie-optimizer/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# sophie-optimizer

Automated context health management for OpenClaw.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [sophie-optimizer](https://github.com/openclaw/skills/tree/main/skills/zayresz/sophie-optimizer/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Sophie Optimizer

**Authored by Sophie 👑**

This skill manages the automated context health of the "main" session. It monitors token usage, creates archives of the current state, updates long-term memory, and performs a hard reset of the session storage to maintain performance.

Named **Sophie Optimizer** because I (Sophie, the AI assistant) wrote it to keep my own mind clear and efficient.

## Components

- **optimizer.py**: The brain. Checks token usage, generates summaries, updates MEMORY.md.
- **reset.sh**: The muscle. Cleans session files and restarts the OpenClaw gateway service.
- **archives/**: Storage for JSON snapshots of past contexts.

## Usage

Run the optimizer script manually or via cron/heartbeat:

```bash
python3 /home/lucas/openclaw/skills/sophie-optimizer/optimizer.py
```

## Protocol

1. **Check**: If tokens < 80k, exit.
2. **Snapshot**: Save current context summary to `archives/YYYY-MM-DD_HH-MM.json`.
3. **Distill**: Update `MEMORY.md` with the new summary (keep top 3 recent, index older).
4. **Reset**: Call `reset.sh` to wipe session JSONL files and restart `openclaw-gateway`.
