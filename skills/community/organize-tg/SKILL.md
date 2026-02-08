---
name: organize-tg
description: Organize TG by Consort Technologies - Automatically scan your Telegram contacts and sync business contacts to a Googl.
homepage: https://github.com/openclaw/skills/tree/main/skills/consort-tech/organize-tg/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# organize-tg

Organize TG by Consort Technologies - Automatically scan your Telegram contacts and sync business contacts to a Googl.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [organize-tg](https://github.com/openclaw/skills/tree/main/skills/consort-tech/organize-tg/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Organize TG by Consort Technologies

Scan and organize your Telegram contacts into a Google Sheet - all from chat.

## Chat Commands

Once set up, use these in Clawdbot chat:

- **"Organize my TG contacts"** - Full scan and sync
- **"Sync TG contacts from the past week"** - Scan recent contacts
- **"Show pending TG contacts"** - Review before syncing
- **"TG sync status"** - Check if configured

## ⚠️ One-Time Setup (Terminal Required)

**CRITICAL:** First-time setup MUST be done in terminal, not via chat.

**Why?** Telegram rejects verification codes that appear in messages. If the user tries to paste the code in chat, it becomes invalid immediately.

**Setup Command:**
```bash
cd ~/clawd/skills/tg-contact-sync
./tg-sync setup
```

**What happens during setup:**
1. User enters Telegram API credentials
2. User enters phone number
3. **Telegram sends verification code**
4. **User MUST enter code directly in terminal (NOT in chat!)**
5. User copies Google Sheet template (browser opens)
6. **Browser must be logged into SAME Google account as gog CLI**

**After setup completes once, all future scans work via chat.**

## How It Works

1. **Scans Telegram** - Gets contacts from non-archived DMs
2. **Detects business contacts** - Pattern matching for company affiliations
3. **Syncs to Google Sheets** - Auto-categorizes into your sheet
4. **Deduplicates** - Skips contacts already in sheet

## For Clawdbot (Agent Instructions)

**⚠️ CRITICAL:** If user asks to "set up", "configure", or "run setup" for TG sync, STOP THEM:

```
🛑 STOP - Terminal Setup Required

You're trying to set up TG Contact Sync via chat. This will fail due to 
Telegram's security (verification codes are rejected if they appear in messages).

Please open YOUR OWN TERMINAL and run:

cd ~/clawd/skills/tg-contact-sync
./tg-sync setup

This is a one-time setup (~5 minutes). After that, all scans work via chat.

Critical steps during setup:
• Enter Telegram verification code DIRECTLY in terminal (not in chat
