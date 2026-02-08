---
name: gemini
description: Gemini CLI for one-shot Q&A, summaries.
homepage: https://github.com/openclaw/skills/tree/main/skills/steipete/gemini/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# gemini

Gemini CLI for one-shot Q&A, summaries.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [gemini](https://github.com/openclaw/skills/tree/main/skills/steipete/gemini/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Gemini CLI

Use Gemini in one-shot mode with a positional prompt (avoid interactive mode).

Quick start
- `gemini "Answer this question..."`
- `gemini --model <name> "Prompt..."`
- `gemini --output-format json "Return JSON"`

Extensions
- List: `gemini --list-extensions`
- Manage: `gemini extensions <command>`

Notes
- If auth is required, run `gemini` once interactively and follow the login flow.
- Avoid `--yolo` for safety.
