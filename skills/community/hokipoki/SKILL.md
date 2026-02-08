---
name: hokipoki
description: Switch between Claude, Codex, and Gemini when one gets stuck.
homepage: https://github.com/openclaw/skills/tree/main/skills/budjoskop/hokipoki/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# hokipoki

Switch between Claude, Codex, and Gemini when one gets stuck.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [hokipoki](https://github.com/openclaw/skills/tree/main/skills/budjoskop/hokipoki/SKILL.md)
- **Security Status**: SAFE

## Instructions

# HokiPoki Skill

Route tasks to different AI CLIs (Claude, Codex, Gemini) via the HokiPoki P2P network. API keys never leave the provider's machine; only encrypted requests and results are exchanged.

## Prerequisites

HokiPoki CLI must be installed and authenticated:

```bash
npm install -g @next-halo/hokipoki-cli
hokipoki login
```

Verify with `hokipoki whoami`. If not installed, guide the user through setup.

## Requesting Help from Another AI

Send a task to a remote AI model. Always use `--json` for parseable output:

```bash
# Specific files
hokipoki request --tool claude --task "Fix the auth bug" --files src/auth.ts --json

# Entire directory
hokipoki request --tool codex --task "Add error handling" --dir src/services/ --json

# Whole project (respects .gitignore)
hokipoki request --tool gemini --task "Review for security issues" --all --json

# Route to a team workspace
hokipoki request --tool claude --task "Optimize queries" --files src/db.ts --workspace my-team --json

# Skip auto-apply (just save the patch)
hokipoki request --tool codex --task "Refactor module" --dir src/ --no-auto-apply --json
```

Tool selection: if the user doesn't specify a tool, ask which model to use or omit `--tool` to let HokiPoki choose.

### Patch Auto-Apply

Patches auto-apply when the target directory is a git repo with committed files. If auto-apply fails, inform the user and suggest:

```bash
git init && git add . && git commit -m "initial"
```

## Provider Mode (Sharing Your AI)

Register and listen for incoming requests:

```bash
# Register as a provider (one-time)
hokipoki register --as-provider --tools claude codex gemini

# Start listening
hokipoki listen --tools claude codex
```

Tasks execute in isolated Docker containers (read-only filesystem, tmpfs workspace, auto-cleanup). Docker must be running.

## Status & Account

```bash
hokipoki whoami      # Current user info
hokipoki status      # Account, workspaces, history
hokipoki dashboard   # Open web dashboard in b
