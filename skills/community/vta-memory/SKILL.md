---
name: vta-memory
description: Reward and motivation system for AI agents.
homepage: https://github.com/openclaw/skills/tree/main/skills/impkind/vta-memory/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# vta-memory

Reward and motivation system for AI agents.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [vta-memory](https://github.com/openclaw/skills/tree/main/skills/impkind/vta-memory/SKILL.md)
- **Security Status**: SAFE

## Instructions

# VTA Memory ⭐

**Reward and motivation for AI agents.** Part of the AI Brain series.

Give your AI agent genuine *wanting* — not just doing things when asked, but having drive, seeking rewards, and looking forward to things.

## The Problem

Current AI agents:
- ✅ Do what they're asked
- ❌ Don't *want* anything
- ❌ Have no internal motivation
- ❌ Don't feel satisfaction from accomplishment

Without a reward system, there's no desire. Just execution.

## The Solution

Track motivation through:
- **Drive** — overall motivation level (0-1)
- **Rewards** — logged accomplishments that boost drive
- **Seeking** — what I actively want more of
- **Anticipation** — what I'm looking forward to

## Quick Start

### 1. Install

```bash
cd ~/.openclaw/workspace/skills/vta-memory
./install.sh --with-cron
```

This will:
- Create `memory/reward-state.json`
- Generate `VTA_STATE.md` (auto-injected into sessions!)
- Set up cron for drive decay every 8 hours

### 2. Check motivation

```bash
./scripts/load-motivation.sh

# ⭐ Current Motivation State:
# Drive level: 0.73 (motivated — ready to work)
# Seeking: creative work, building brain skills
# Looking forward to: showing my work
```

### 3. Log rewards

```bash
./scripts/log-reward.sh --type accomplishment --source "finished the feature" --intensity 0.8

# ⭐ Reward logged!
#    Type: accomplishment
#    Drive: 0.50 → 0.66 (+0.16)
```

### 4. Add anticipation

```bash
./scripts/anticipate.sh --add "morning conversation"

# ⭐ Now looking forward to: morning conversation
#    Drive: 0.66 → 0.71 (+0.05)
```

## Scripts

| Script | Purpose |
|--------|---------|
| `install.sh` | Set up vta-memory (run once) |
| `get-drive.sh` | Read current motivation state |
| `log-reward.sh` | Log a reward, boost drive |
| `load-motivation.sh` | Human-readable for session context |
| `decay-drive.sh` | Drive fades without rewards |
| `anticipate.sh` | Add/remove things to look forward to |
| `seek.sh` | Add/remove things we're actively seeking |
| `
