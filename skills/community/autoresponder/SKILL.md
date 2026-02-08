---
name: autoresponder
description: Monitor iMessage/SMS conversations and auto-respond based on configurable rules, AI prompts, and rate-limiting condit.
homepage: https://github.com/openclaw/skills/tree/main/skills/koba42corp/autoresponder/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# autoresponder

Monitor iMessage/SMS conversations and auto-respond based on configurable rules, AI prompts, and rate-limiting condit.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [autoresponder](https://github.com/openclaw/skills/tree/main/skills/koba42corp/autoresponder/SKILL.md)
- **Security Status**: SAFE

## Instructions

# iMessage Auto-Responder

Automatically respond to iMessages/SMS from specific contacts using AI-generated replies that match your voice and conversation context.

## ⚠️ Requirements Checklist

Before using this skill, ensure you have:

- [ ] **macOS** with Messages.app signed in to iMessage
- [ ] **imsg CLI** installed: `brew install steipete/tap/imsg`
- [ ] **OpenAI API key** configured in Clawdbot config
- [ ] **Full Disk Access** granted to Terminal/iTerm
- [ ] **Messages automation permission** (macOS will prompt on first use)

## Features

- 🤖 **AI-powered responses** using OpenAI GPT-4
- 📱 **Contact-based prompts** - different AI personality per contact
- ⏱️ **Rate limiting** - configurable delays between auto-responses
- 💬 **Context-aware** - AI sees recent conversation history
- 📊 **Telegram management** - slash commands + natural language
- 🔄 **Background monitoring** - continuous polling for new messages
- 🔧 **Auto-cleanup** - clears stale locks on restart (prevents stuck contacts)
- 🧪 **Test mode** - generate real AI responses without sending
- ⏰ **Time windows** - only respond during specific hours (e.g., 9 AM - 10 PM)
- 🔑 **Keyword triggers** - only respond if message contains specific keywords (e.g., "urgent", "help")
- 📊 **Statistics tracking** - track total responses, daily counts, and averages per contact
- 🚦 **Daily cap** - limit max replies per day per contact (safety feature)

## Quick Start

### 1. Add contacts to watch list

```bash
cd ~/clawd/imsg-autoresponder/scripts
node manage.js add "+15551234567" "Reply with a middle finger emoji" "Best Friend"
node manage.js add "+15559876543" "You are my helpful assistant. Reply warmly and briefly, as if I'm responding myself. Keep it under 160 characters." "Mom"
```

### 2. Start the watcher

```bash
node watcher.js
```

The watcher runs in the foreground and logs to `~/clawd/logs/imsg-autoresponder.log`.

### 3. Run in background (recommended)

```bash
# Start in background
nohup node ~/clawd/imsg-
