---
name: seedream-image-gen
description: Generate images via Seedream API (doubao-seedream models).
homepage: https://github.com/openclaw/skills/tree/main/skills/owenrao/seedream-image-gen/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# seedream-image-gen

Generate images via Seedream API (doubao-seedream models).

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [seedream-image-gen](https://github.com/openclaw/skills/tree/main/skills/owenrao/seedream-image-gen/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Seedream Image Generation

Generate images using Seedream API (synchronous, no polling needed).

## Generate Image

```bash
python3 {baseDir}/scripts/generate_image.py --prompt "your description" --filename "output.png"
```

Options:
- `--size`: `2K`, `4K`, or pixels (e.g., `2048x2048`)
- `--input-image`: Image URL for image-to-image/editing

## API Key

The `SEEDREAM_API_KEY` is automatically injected from `skills.entries.seedream-image-gen.apiKey` in `clawdbot.json`. You do NOT need to provide it manually.

## Notes

- Synchronous API: returns immediately when generation completes (no polling)
- Image URLs valid for 24 hours
- Script prints `MEDIA:` line for auto-attachment
- Include datetime in filenames to distinguish
- Models 4.5/4.0 support group image generation (multiple images per request)
