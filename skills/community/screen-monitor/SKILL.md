---
name: screen-monitor
description: Dual-mode screen sharing and analysis.
homepage: https://github.com/openclaw/skills/tree/main/skills/emasoudy/screen-monitor/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# screen-monitor

Dual-mode screen sharing and analysis.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [screen-monitor](https://github.com/openclaw/skills/tree/main/skills/emasoudy/screen-monitor/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Screen Monitor

This skill provides two ways for the agent to see and interact with your screen.

## 🟢 Path A: Fast Share (WebRTC)
*Best for: Quick visual checks, restricted browsers, or non-technical environments.*

### Tools
- **`screen_share_link`**: Generates a local WebRTC portal URL.
- **`screen_analyze`**: Captures the current frame from the portal and analyzes it with vision.

**Usage:**
```bash
# Get the link
bash command:"{baseDir}/references/get-share-url.sh"

# Analyze
bash command:"{baseDir}/references/screen-analyze.sh"
```

---

## 🔵 Path B: Full Control (Browser Relay)
*Best for: Deep debugging, UI automation, and clicking/typing in tabs.*

### Setup
1. Run `clawdbot browser extension install`.
2. Load the unpacked extension from `clawdbot browser extension path`.
3. Click the Clawdbot icon in your Chrome toolbar to **Attach**.

### Tools
- **`browser action:snapshot`**: Take a precise screenshot of the attached tab.
- **`browser action:click`**: Interact with elements (requires `profile="chrome"`).

---

## Technical Details
- **Port**: 18795 (WebRTC Backend)
- **Files**: 
  - `web/screen-share.html`: The sharing portal.
  - `references/backend-endpoint.js`: Frame storage server.
