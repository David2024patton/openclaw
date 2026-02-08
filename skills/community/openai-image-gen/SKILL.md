---
name: openai-image-gen
description: Batch-generate images via OpenAI Images API.
homepage: https://github.com/openclaw/skills/tree/main/skills/steipete/openai-image-gen/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# openai-image-gen

Batch-generate images via OpenAI Images API.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [openai-image-gen](https://github.com/openclaw/skills/tree/main/skills/steipete/openai-image-gen/SKILL.md)
- **Security Status**: SAFE

## Instructions

# OpenAI Image Gen

Generate a handful of “random but structured” prompts and render them via OpenAI Images API.

## Setup

- Needs env: `OPENAI_API_KEY`

## Run

From any directory (outputs to `~/Projects/tmp/...` when present; else `./tmp/...`):

```bash
python3 ~/Projects/agent-scripts/skills/openai-image-gen/scripts/gen.py
open ~/Projects/tmp/openai-image-gen-*/index.html
```

Useful flags:

```bash
python3 ~/Projects/agent-scripts/skills/openai-image-gen/scripts/gen.py --count 16 --model gpt-image-1.5
python3 ~/Projects/agent-scripts/skills/openai-image-gen/scripts/gen.py --prompt "ultra-detailed studio photo of a lobster astronaut" --count 4
python3 ~/Projects/agent-scripts/skills/openai-image-gen/scripts/gen.py --size 1536x1024 --quality high --out-dir ./out/images
```

## Output

- `*.png` images
- `prompts.json` (prompt ↔ file mapping)
- `index.html` (thumbnail gallery)
