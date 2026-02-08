---
name: smart-followups
description: Generate contextual follow-up suggestions after AI responses.
homepage: https://github.com/openclaw/skills/tree/main/skills/robbyczgw-cla/smart-followups/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# smart-followups

Generate contextual follow-up suggestions after AI responses.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [smart-followups](https://github.com/openclaw/skills/tree/main/skills/robbyczgw-cla/smart-followups/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Smart Follow-ups Skill

Generate contextual follow-up suggestions for OpenClaw conversations.

## 🚀 Slash Command (New in v2.1.0!)

**Primary command:**
```
/followups
```

**Aliases:**
```
/fu
/suggestions
```

When you type `/followups`, I'll generate 3 contextual follow-up questions based on our conversation:

1. ⚡ **Quick** — Clarification or immediate next step
2. 🧠 **Deep Dive** — Technical depth or detailed exploration
3. 🔗 **Related** — Connected topic or broader context

---

## How to Trigger

| Method | Example | Recommended |
|--------|---------|-------------|
| `/followups` | Just type it! | ✅ Yes |
| `/fu` | Short alias | ✅ Yes |
| Natural language | "give me suggestions" | Works too |
| After any answer | "what should I ask next?" | Works too |

## Usage

Say "followups" in any conversation:

```
You: What is Docker?
Bot: Docker is a containerization platform...

You: /followups

Bot: 💡 What would you like to explore next?
[⚡ How do I install Docker?]
[🧠 Explain container architecture]
[🔗 Docker vs Kubernetes?]
```

**On button channels (Telegram/Discord/Slack):** Tap a button to ask that question.

**On text channels (Signal/WhatsApp/iMessage/SMS):** Reply with 1, 2, or 3.

## Categories

Each generation produces 3 suggestions:

| Category | Emoji | Purpose |
|----------|-------|---------|
| **Quick** | ⚡ | Clarifications, definitions, immediate next steps |
| **Deep Dive** | 🧠 | Technical depth, advanced concepts, thorough exploration |
| **Related** | 🔗 | Connected topics, broader context, alternatives |

## Authentication

**Default:** Uses OpenClaw's existing auth — same login and model as your current chat.

**Optional providers:**
- `openrouter` — Requires `OPENROUTER_API_KEY`
- `anthropic` — Requires `ANTHROPIC_API_KEY`

## Configuration

```json
{
  "skills": {
    "smart-followups": {
      "enabled": true,
      "provider": "openclaw",
      "model": null
    }
  }
}
```

| Option | Default | Description |
|--------|---------|------------
