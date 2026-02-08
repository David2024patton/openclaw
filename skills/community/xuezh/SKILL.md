---
name: xuezh
description: Teach Mandarin using the xuezh engine for review, speaking.
homepage: https://github.com/openclaw/skills/tree/main/skills/local/xuezh/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# xuezh

Teach Mandarin using the xuezh engine for review, speaking.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [xuezh](https://github.com/openclaw/skills/tree/main/skills/local/xuezh/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Xuezh Skill

## Contract

Use the xuezh CLI exactly as specified. If a command is missing, ask for implementation instead of guessing.

## Default loop

1) Call `xuezh snapshot`.
2) Pick a tiny plan (1-2 bullets).
3) Run a short activity.
4) Log outcomes.

## CLI examples

```bash
xuezh snapshot --profile default
xuezh review next --limit 10
xuezh audio process-voice --file ./utterance.wav
```
