---
name: pi-orchestration
description: Orchestrate multiple AI models (GLM, MiniMax, etc.) as workers using Pi Coding Agent.
homepage: https://github.com/openclaw/skills/tree/main/skills/dbhurley/pi-orchestration/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# pi-orchestration

Orchestrate multiple AI models (GLM, MiniMax, etc.) as workers using Pi Coding Agent.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [pi-orchestration](https://github.com/openclaw/skills/tree/main/skills/dbhurley/pi-orchestration/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Pi Orchestration

Use Claude as an orchestrator to spawn and coordinate multiple AI model workers (GLM, MiniMax, etc.) via Pi Coding Agent.

## Supported Providers

| Provider | Model | Status |
|----------|-------|--------|
| **GLM** | glm-4.7 | ✅ Working |
| **MiniMax** | MiniMax-M2.1 | ✅ Working |
| OpenAI | gpt-4o, etc. | ✅ Working |
| Anthropic | claude-* | ✅ Working |

## Setup

### 1. GLM (Zhipu AI)

Get API key from [open.bigmodel.cn](https://open.bigmodel.cn/)

```bash
export GLM_API_KEY="your-glm-api-key"
```

### 2. MiniMax

Get API key from [api.minimax.chat](https://api.minimax.chat/)

```bash
export MINIMAX_API_KEY="your-minimax-api-key"
export MINIMAX_GROUP_ID="your-group-id"  # Required for MiniMax
```

## Usage

### Direct Commands

```bash
# GLM-4.7
pi --provider glm --model glm-4.7 -p "Your task"

# MiniMax M2.1
pi --provider minimax --model MiniMax-M2.1 -p "Your task"

# Test connectivity
pi --provider glm --model glm-4.7 -p "Say hello"
```

### Orchestration Patterns

Claude (Opus) can spawn these as background workers:

#### Background Worker
```bash
bash workdir:/tmp/task background:true command:"pi --provider glm --model glm-4.7 -p 'Build feature X'"
```

#### Parallel Army (tmux)
```bash
# Create worker sessions
tmux new-session -d -s worker-1
tmux new-session -d -s worker-2

# Dispatch tasks
tmux send-keys -t worker-1 "pi --provider glm --model glm-4.7 -p 'Task 1'" Enter
tmux send-keys -t worker-2 "pi --provider minimax --model MiniMax-M2.1 -p 'Task 2'" Enter

# Check progress
tmux capture-pane -t worker-1 -p
tmux capture-pane -t worker-2 -p
```

#### Map-Reduce Pattern
```bash
# Map: Distribute subtasks to workers
for i in 1 2 3; do
  tmux send-keys -t worker-$i "pi --provider glm --model glm-4.7 -p 'Process chunk $i'" Enter
done

# Reduce: Collect and combine results
for i in 1 2 3; do
  tmux capture-pane -t worker-$i -p >> /tmp/results.txt
done
```

## Orchestration Script

```bash
# Quick orchestration helper
uv run {baseDir}/scripts/
