---
name: feishu-doc
description: Fetch content from Feishu (Lark) Wiki, Docs, Sheets.
homepage: https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-doc/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# feishu-doc

Fetch content from Feishu (Lark) Wiki, Docs, Sheets.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [feishu-doc](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-doc/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Feishu Doc Skill

Fetch content from Feishu (Lark) Wiki, Docs, Sheets, and Bitable.

## Usage

```bash
node index.js fetch <url>
```

## Configuration

Create a `config.json` file in the root of the skill or set environment variables:

```json
{
  "app_id": "YOUR_APP_ID",
  "app_secret": "YOUR_APP_SECRET"
}
```

Environment variables:
- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`

## Supported URL Types

- Wiki
- Docx
- Doc (Legacy)
- Sheets
- Bitable
