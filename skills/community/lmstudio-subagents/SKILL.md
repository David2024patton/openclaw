---
name: lmstudio-subagents
description: Equips agents to search for and offload tasks to local models in LM Studio.
homepage: https://github.com/openclaw/skills/tree/main/skills/t-sinclair2500/lm-studio-subagents/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# lmstudio-subagents

Equips agents to search for and offload tasks to local models in LM Studio.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [lmstudio-subagents](https://github.com/openclaw/skills/tree/main/skills/t-sinclair2500/lm-studio-subagents/SKILL.md)
- **Security Status**: SAFE

## Instructions

# LM Studio Models

Offload tasks to local models when quality suffices. Base URL: http://127.0.0.1:1234. Auth: `Authorization: Bearer lmstudio`. instance_id = `loaded_instances[].id` (same model can have multiple, e.g. `key` and `key:2`).

## Key Terms

- **model**: From GET models key; use in chat and optional load.
- **lm_studio_api_url**: Default http://127.0.0.1:1234 (paths /api/v1/...).
- **response_id** / **previous_response_id**: Chat returns response_id; pass as previous_response_id for stateful.
- **instance_id**: For unload, use only the value from GET /api/v1/models for that model: each `loaded_instances[].id`. Do not assume it equals the model key; with multiple instances ids can be like key:2. LM Studio docs: List (loaded_instances[].id), Unload (instance_id).

Trigger in frontmatter; below = implementation.

## Prerequisites

LM Studio 0.4+, server :1234, models on disk; load/unload via API (JIT optional); Node for script (curl ok).

## Quick start

Minimal path: list models, then one chat. Replace `<model>` with a key from GET /api/v1/models and `<task>` with the task text.

```bash
curl -s -H 'Authorization: Bearer lmstudio' http://127.0.0.1:1234/api/v1/models
node scripts/lmstudio-api.mjs <model> '<task>' --temperature=0.5 --max-output-tokens=200
```

Stateful multi-turn: pass `--previous-response-id=<id>` from the prior script output. Or use `--stateful` to persist response_id automatically. Optional `--log <path>` for request/response.

```bash
node scripts/lmstudio-api.mjs <model> 'First turn...' --previous-response-id=$ID1
node scripts/lmstudio-api.mjs <model> 'Second turn...' --previous-response-id=$ID2
```

## Complete Workflow

### Step 0: Preflight

GET <base>/api/v1/models; non-200 or connection error = server not ready.

```bash
exec command:"curl -s -o /dev/null -w '%{http_code}' -H 'Authorization: Bearer lmstudio' http://127.0.0.1:1234/api/v1/models"
```

### Step 1: List Models and Select

GET /api/v1/models to list models. Parse each 
