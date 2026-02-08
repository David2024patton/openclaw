---
name: manus
description: Create and manage AI agent tasks via Manus API.
homepage: https://github.com/openclaw/skills/tree/main/skills/mvanhorn/manus/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# manus

Create and manage AI agent tasks via Manus API.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [manus](https://github.com/openclaw/skills/tree/main/skills/mvanhorn/manus/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Manus AI Agent

Use the Manus API to create autonomous AI tasks. Manus can browse the web, use tools, and deliver complete results (reports, code, presentations, etc.).

## API Base

`https://api.manus.ai/v1`

## Authentication

Header: `API_KEY: <your-key>`

Set via:
- `MANUS_API_KEY` env var
- Or `skills.manus.apiKey` in clawdbot config

## Recommended Workflow

When using Manus for tasks that produce files (slides, reports, etc.):

1. **Create the task** with `createShareableLink: true`
2. **Poll for completion** using the task_id
3. **Extract output files** from the response and download them locally
4. **Deliver to user** via direct file attachment (don't rely on manus.im share links)

## Create a Task

```bash
curl -X POST "https://api.manus.ai/v1/tasks" \
  -H "API_KEY: $MANUS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Your task description here",
    "agentProfile": "manus-1.6",
    "taskMode": "agent",
    "createShareableLink": true
  }'
```

Response:
```json
{
  "task_id": "abc123",
  "task_title": "Task Title",
  "task_url": "https://manus.im/app/abc123"
}
```

## Agent Profiles

| Profile | Description | Use for |
|---------|-------------|---------|
| `manus-1.6` | Standard (default) | Most tasks |
| `manus-1.6-lite` | Faster, lighter | Quick/simple stuff |
| `manus-1.6-max` | Complex, thorough | Deep research/analysis |

**Default:** Always use `manus-1.6` unless user specifies otherwise.

## Task Modes

| Mode | Description |
|------|-------------|
| `chat` | Conversational mode |
| `adaptive` | Auto-selects best approach |
| `agent` | Full autonomous agent mode (recommended for file creation) |

## Get Task Status & Output

```bash
curl "https://api.manus.ai/v1/tasks/{task_id}" \
  -H "API_KEY: $MANUS_API_KEY"
```

Status values: `pending`, `running`, `completed`, `failed`

**Important:** When status is `completed`, check the `output` array for files:
- Look for `type: "output_file"` entries
- Download files from `fi
