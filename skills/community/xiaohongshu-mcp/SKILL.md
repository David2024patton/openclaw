---
name: xiaohongshu-mcp
description: Upload images and videos to Xiaohongshu Creator Platform using a local MCP server with browser automation.
homepage: https://github.com/openclaw/skills/tree/main/skills/pxfeng/xiaohongshu-mcp/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# xiaohongshu-mcp

Upload images and videos to Xiaohongshu Creator Platform using a local MCP server with browser automation.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [xiaohongshu-mcp](https://github.com/openclaw/skills/tree/main/skills/pxfeng/xiaohongshu-mcp/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Xiaohongshu Uploader Skill

This skill provides a Model Context Protocol (MCP) server that allows Clawdbot to upload content to Xiaohongshu.

## Features

- **Smart Login**: Automates login session persistence. Just scan the QR code once.
- **Auto-Upload**: Supports uploading images with titles and descriptions via natural language commands.
- **Title Validation**: Automatically validates and trims titles to under 20 characters to ensure proper saving.
- **Enhanced Save Functionality**: Uses "暂存离开" (Save and Exit) button for more reliable draft saving.
- **Browser Automation**: Leveraging Playwright for robust interaction with the Creator Platform.
- **Improved Error Handling**: Better fallback mechanisms and error reporting.

## Prerequisites

- Node.js installed.
- Playwright browsers installed (the setup script will handle this).

## Setup

1.  Navigate to the `server` directory:
    ```bash
    cd server
    npm install
    npm run build
    npx playwright install chromium
    ```

2.  Add to your Clawdbot/Claude Desktop configuration:

    ```json
    {
      "mcpServers": {
        "xiaohongshu": {
          "command": "node",
          "args": [
            "/ABSOLUTE/PATH/TO/xiaohongshu-upload-skill/server/build/index.js"
          ]
        }
      }
    }
    ```
    *Note: Replace `/ABSOLUTE/PATH/TO` with the actual full path to this skill folder.*

## Usage

### 1. Login
First time use requires login.
- **Command**: "Login to Xiaohongshu"
- **Action**: Scan the QR code in the popped-up browser.
- **Confirmation**: Wait for the browser to close or the tool to report success.

### 2. Upload
- **Command**: "Upload [file] to Xiaohongshu with title [title] and description [content]"
- **Action**: The agent will automate the upload process.
- **Automatic Title Validation**: If your title exceeds 20 characters, it will be automatically truncated to ensure proper saving.

## Troubleshooting

- **Login Failed**: Ensure you didn't close the window manually befor
