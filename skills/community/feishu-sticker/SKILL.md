---
name: feishu-sticker
description: Send images as native Feishu stickers.
homepage: https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-sticker/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# feishu-sticker

Send images as native Feishu stickers.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [feishu-sticker](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-sticker/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Feishu Sticker Skill

Sends a sticker (image) to a Feishu user or group.
Automatically uploads the image to Feishu (caching the `image_key` via MD5), converts GIFs to WebP for efficiency, and supports smart search.

## Features
- **Auto-Upload**: Uploads local images to Feishu CDN on demand.
- **Caching**: Caches `image_key` by file hash to avoid re-uploading.
- **Optimization**: Auto-converts GIFs to WebP (via `ffmpeg-static`) and compresses large images (>5MB).
- **Smart Search**: Find stickers by `--query` or `--emotion`.

## Usage

```bash
# Send random sticker
node skills/feishu-sticker/send.js --target "ou_..."

# Send specific file
node skills/feishu-sticker/send.js --target "ou_..." --file "/path/to/image.jpg"

# Search and send
node skills/feishu-sticker/send.js --target "ou_..." --query "angry cat"
node skills/feishu-sticker/send.js --target "ou_..." --emotion "happy"
```

## Setup
1.  Put your stickers in `~/.openclaw/media/stickers/` (or set `STICKER_DIR`).
2.  Install dependencies: `npm install` (requires `axios`, `commander`, `ffmpeg-static`, `form-data`, `dotenv`).
