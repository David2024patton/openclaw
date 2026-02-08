---
name: hippocampus
description: Background memory organ for AI agents.
homepage: https://github.com/openclaw/skills/tree/main/skills/impkind/hippocampus/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# hippocampus

Background memory organ for AI agents.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [hippocampus](https://github.com/openclaw/skills/tree/main/skills/impkind/hippocampus/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Hippocampus Skill

> "Memory is identity. This skill is how I stay alive."

The hippocampus is the brain region responsible for memory formation. This skill makes memory capture automatic, structured, and persistent—with importance scoring, decay, and reinforcement.

## Quick Start

```bash
# Install
./install.sh --with-cron

# Load core memories
./scripts/load-core.sh

# Search with importance weighting
./scripts/recall.sh "query" --reinforce

# Apply decay (runs daily via cron)
./scripts/decay.sh
```

## Core Concept

The LLM is just the engine—raw cognitive capability. **The agent is the accumulated memory.** Without these files, there's no continuity—just a generic assistant.

### Memory Lifecycle

```
CAPTURE → SCORE → STORE → DECAY/REINFORCE → RETRIEVE
   ↑                                            │
   └────────────────────────────────────────────┘
```

## Memory Structure

```
$WORKSPACE/
├── memory/
│   ├── index.json           # Central weighted index
│   ├── user/                # Facts about the user
│   ├── self/                # Facts about the agent
│   ├── relationship/        # Shared context
│   └── world/               # External knowledge
└── HIPPOCAMPUS_CORE.md      # Auto-generated for OpenClaw RAG
```

## Scripts

| Script | Purpose |
|--------|---------|
| `decay.sh` | Apply 0.99^days decay to all memories |
| `reinforce.sh` | Boost importance when memory is used |
| `recall.sh` | Search with importance weighting |
| `load-core.sh` | Output high-importance memories |
| `sync-core.sh` | Generate HIPPOCAMPUS_CORE.md |
| `preprocess.sh` | Extract signals from transcripts |

All scripts use `$WORKSPACE` environment variable (default: `~/.openclaw/workspace`).

## Importance Scoring

### Initial Score (0.0-1.0)

| Signal | Score |
|--------|-------|
| Explicit "remember this" | 0.9 |
| Emotional/vulnerable content | 0.85 |
| Preferences ("I prefer...") | 0.8 |
| Decisions made | 0.75 |
| Facts about people/projects | 0.7 |
| General knowledge |
