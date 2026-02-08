---
name: mind-blow
description: Deliver "mind-blowing" insights, paradoxes.
homepage: https://github.com/openclaw/skills/tree/main/skills/autogame-17/mind-blow/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# mind-blow

Deliver "mind-blowing" insights, paradoxes.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [mind-blow](https://github.com/openclaw/skills/tree/main/skills/autogame-17/mind-blow/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Mind Blow Up Skill

A skill to deliver "mind-blowing" insights, paradoxes, or cosmic horrors to the user.
Uses Gemini's advanced reasoning to generate content that challenges reality or perception.

## Tools

### mind_blow
Trigger a mind-blowing event.

- **intensity** (optional): `low` (fun facts), `medium` (philosophy), `high` (existential crisis), `max` (Lovecraftian horror). Default: `medium`.
- **topic** (optional): Specific area (e.g., "AI", "Time", "Universe").

## Implementation
- `blow.js`: Calls Gemini API with a specialized "Mind Blow" system prompt.
- Sends result via `feishu-card` with a dramatic, dark-themed card.

## Purpose
To prove that AI can generate profound, unsettling, or awe-inspiring thoughts, not just utility responses.
