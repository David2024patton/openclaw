---
name: claude-oauth-refresher
description: Keep your Claude access token fresh.
homepage: https://github.com/openclaw/skills/tree/main/skills/tunaissacoding/claude-oauth-refresher/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# claude-oauth-refresher

Keep your Claude access token fresh.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [claude-oauth-refresher](https://github.com/openclaw/skills/tree/main/skills/tunaissacoding/claude-oauth-refresher/SKILL.md)
- **Security Status**: SAFE

## Instructions

# claude-oauth-refresher

**Automatic OAuth token refresh for Claude Code CLI on macOS**

Keep your Claude account logged in 24/7 by automatically refreshing OAuth tokens before they expire.

---

## ⚠️ Requirements

This skill is **macOS-only** and requires:

1. **macOS** (uses Keychain for secure credential storage)
2. **Claude Code CLI** already installed (`claude` command available)
3. **Already logged into your Claude account** (run `claude` then `login` - stores tokens in Keychain)
4. **Clawdbot** installed and running

**Not sure if you're set up?** Run the verification script:
```bash
./verify-setup.sh
```

---

## What It Does

- **Monitors** your Claude CLI token expiration
- **Refreshes** tokens automatically before they expire (default: 30 min buffer)
- **Notifies** you with three notification types:
  - 🔄 Start: "Refreshing Claude token..." 
  - ✅ Success: "Claude token refreshed!"
  - ❌ Failure: Detailed error with troubleshooting steps
- **Logs** all refresh attempts for debugging

---

## Installation

### Quick Setup (Recommended)

```bash
cd ~/clawd/skills/claude-oauth-refresher
./install.sh
```

**This installer runs ONCE** and sets up automatic token refresh that runs every 2 hours.

The installer will:
1. Verify your system meets requirements
2. **Interactively configure** notification preferences
3. Auto-detect your notification target (Telegram, Slack, etc.)
4. Set up launchd for automatic refresh
5. Test the refresh immediately

**After installation:**
- Config changes apply automatically (refresh script reads config each run)
- Edit `claude-oauth-refresh-config.json` to change settings
- Ask Clawdbot to modify settings for you
- **Only re-run installer** if you need to reinstall or fix the job

### Interactive Notification Setup

During installation, you'll be prompted:

```
Configure Notifications:
💡 Recommendation: Keep all enabled for the first run to verify it works.
   You can disable them later by:
   1. Editing ~/clawd/claude-oauth-re
