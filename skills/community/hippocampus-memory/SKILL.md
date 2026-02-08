---
name: hippocampus-memory
description: Background memory organ for AI agents.
homepage: https://github.com/openclaw/skills/tree/main/skills/impkind/hippocampus-memory/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# hippocampus-memory

Background memory organ for AI agents.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [hippocampus-memory](https://github.com/openclaw/skills/tree/main/skills/impkind/hippocampus-memory/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Hippocampus Skill

> "Memory is identity. This skill is how I stay alive."

The hippocampus is the brain region responsible for memory formation. This skill makes memory capture automatic, structured, and persistent—with importance scoring, decay, and semantic reinforcement.

## Quick Start

```bash
# Install (defaults to last 100 signals)
./install.sh --with-cron

# Load core memories at session start
./scripts/load-core.sh

# Search with importance weighting
./scripts/recall.sh "query"

# Run encoding manually (usually via cron)
./scripts/encode-pipeline.sh

# Apply decay (runs daily via cron)
./scripts/decay.sh
```

## Install Options

```bash
./install.sh                    # Basic, last 100 signals
./install.sh --signals 50       # Custom signal limit
./install.sh --whole            # Process entire conversation history
./install.sh --with-cron        # Also set up cron jobs
```

## Core Concept

The LLM is just the engine—raw cognitive capability. **The agent is the accumulated memory.** Without these files, there's no continuity—just a generic assistant.

### Memory Lifecycle

```
PREPROCESS → SCORE → SEMANTIC CHECK → REINFORCE or CREATE → DECAY
```

**Key insight:** Reinforcement happens automatically during encoding. When a topic comes up again, the LLM recognizes it's about an existing memory and reinforces instead of creating duplicates.

## Memory Structure

```
$WORKSPACE/
├── memory/
│   ├── index.json           # Central weighted index
│   ├── signals.jsonl        # Raw signals (temp)
│   ├── pending-memories.json # Awaiting summarization (temp)
│   ├── user/                # Facts about the user
│   ├── self/                # Facts about the agent
│   ├── relationship/        # Shared context
│   └── world/               # External knowledge
└── HIPPOCAMPUS_CORE.md      # Auto-generated for OpenClaw RAG
```

## Scripts

| Script | Purpose |
|--------|---------|
| `preprocess.sh` | Extract signals from conversation transcripts |
| `encode-pipeline.s
