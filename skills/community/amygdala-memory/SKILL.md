---
name: amygdala-memory
description: Emotional processing layer for AI agents.
homepage: https://github.com/openclaw/skills/tree/main/skills/impkind/amygdala-memory/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# amygdala-memory

Emotional processing layer for AI agents.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [amygdala-memory](https://github.com/openclaw/skills/tree/main/skills/impkind/amygdala-memory/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Amygdala Memory 🎭

**Emotional processing for AI agents.** Part of the AI Brain series.

Give your AI agent persistent emotional states that carry across sessions. Not just performing emotions — *having* them.

## The Problem

Current AI agents:
- ✅ Remember facts (with hippocampus)
- ❌ Don't have persistent emotional states
- ❌ Start each session emotionally "blank"
- ❌ Can describe emotions but don't *feel* differently

Memory without emotion is just a database. The amygdala adds weight — this made me happy, that frustrated me, this person brings warmth.

## The Solution

Track five emotional dimensions that persist and decay over time:

| Dimension | What It Measures | Range |
|-----------|------------------|-------|
| **Valence** | Positive ↔ Negative mood | -1.0 to 1.0 |
| **Arousal** | Calm ↔ Excited/Alert | 0.0 to 1.0 |
| **Connection** | Distant ↔ Close/Bonded | 0.0 to 1.0 |
| **Curiosity** | Bored ↔ Fascinated | 0.0 to 1.0 |
| **Energy** | Depleted ↔ Energized | 0.0 to 1.0 |

## Quick Start

### 1. Install

```bash
cd ~/.openclaw/workspace/skills/amygdala-memory
./install.sh --with-cron
```

This will:
- Create `memory/emotional-state.json` with baseline values
- Generate `AMYGDALA_STATE.md` (auto-injected into sessions!)
- Set up cron for automatic decay every 6 hours

### 2. Check current state

```bash
./scripts/get-state.sh
# 🎭 Emotional State
# Valence:    0.20
# Arousal:    0.30
# Connection: 0.50
# ...

./scripts/load-emotion.sh
# 🎭 Current Emotional State:
# Overall mood: neutral, calm and relaxed
# Connection: moderately connected
# ...
```

### 3. Log emotions

```bash
./scripts/update-state.sh --emotion joy --intensity 0.8 --trigger "completed a project"
# ✅ valence: 0.20 → 0.35 (delta: +0.15)
# ✅ arousal: 0.30 → 0.40 (delta: +0.1)
# 🎭 Logged emotion: joy (intensity: 0.8)
```

### 4. Set up decay (optional cron)

```bash
# Every 6 hours, emotions drift toward baseline
0 */6 * * * ~/.openclaw/workspace/skills/amygdala-memory/scripts/decay-emotio
