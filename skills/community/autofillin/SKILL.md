---
name: autofillin
description: Automated web form filling and file uploading skill with Playwright browser automation.
homepage: https://github.com/openclaw/skills/tree/main/skills/leohan123123/autofillin/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# autofillin

Automated web form filling and file uploading skill with Playwright browser automation.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [autofillin](https://github.com/openclaw/skills/tree/main/skills/leohan123123/autofillin/SKILL.md)
- **Security Status**: SAFE

## Instructions

# AutoFillIn - Browser Form Automation Skill

**Trigger Command**: `autofillin`

An intelligent automation skill that fills web forms, uploads files/folders to correct positions, and handles complex multi-field submissions with persistent login support.

## What's New in v1.2.0

- Enhanced Error Handling: Graceful error recovery with detailed messages
- Consolidated Configuration: Merged mcp-config into SKILL.md
- Improved Robustness: Better port conflict handling and process management
- Cross-platform Fixes: Improved Windows/Linux compatibility

## Changelog

| Version | Changes |
|---------|---------|
| v1.2.0 | Enhanced error handling, consolidated config, improved robustness |
| v1.1.0 | Added Playwright support, session persistence, folder upload |
| v1.0.0 | Initial release with Chrome debug mode |

## Features

- Navigate to any web form URL
- Auto-fill text fields, textareas, dropdowns
- Upload files/folders to correct form positions
- Persistent login via saved browser storage
- Wait for manual confirmation before submission
- Support for multi-file uploads with position mapping
- Graceful error recovery

## Quick Setup

```bash
# 1. Install Playwright browsers
npx playwright install chromium

# 2. First-time login (saves session for reuse)
npx playwright open --save-storage=~/.playwright-auth.json "https://your-target-site.com"
# Login manually in the browser that opens, then close it

# 3. Future runs will auto-login using saved session
npx playwright open --load-storage=~/.playwright-auth.json "https://your-target-site.com"
```

## MCP Configuration

Add to your MCP settings (Claude Code, OpenCode, etc.):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-playwright"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/"]
    }
  }
}
```

Environment variables for shell integration:
```bash
export CHROME_DEBUG_PORT=9222
e
