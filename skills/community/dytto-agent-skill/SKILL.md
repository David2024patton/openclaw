---
name: dytto-agent-skill
description: Give your agent persistent memory and real-time personal context via Dytto — the context API for AI agents.
homepage: https://github.com/openclaw/skills/tree/main/skills/ayaan-p/dytto-agent-skill/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# dytto-agent-skill

Give your agent persistent memory and real-time personal context via Dytto — the context API for AI agents.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [dytto-agent-skill](https://github.com/openclaw/skills/tree/main/skills/ayaan-p/dytto-agent-skill/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Dytto — Personal Context for Agents

Dytto gives your agent memory. Query it to know who your user is, what happened today, and what they care about.

## Setup

User needs a Dytto account (sign up at https://dytto.app or via the iOS app).

Create `~/.config/dytto/config.json`:
```json
{
  "email": "user@example.com",
  "password": "their-password"
}
```

Or set env vars: `DYTTO_EMAIL` and `DYTTO_PASSWORD`.

That's it. No API keys, no extra config.

## Commands

Run via: `bash scripts/dytto.sh <command> [args...]`

### Read context

```bash
bash scripts/dytto.sh context          # Full profile — who is this person
bash scripts/dytto.sh summary          # Quick summary
bash scripts/dytto.sh patterns         # Behavioral patterns (routines, habits)
bash scripts/dytto.sh insights         # Derived insights
```

Use `context` on first interaction. Use `patterns`/`insights` for personalization.

### Search

```bash
bash scripts/dytto.sh search "career goals"        # Semantic search
bash scripts/dytto.sh story 2026-01-30              # Journal for a date
bash scripts/dytto.sh search-stories "trip to NYC"  # Search stories
```

### Write context back

```bash
bash scripts/dytto.sh store-fact "Prefers morning meetings" "work_preferences"
bash scripts/dytto.sh observe "User is more productive after lunch"
bash scripts/dytto.sh update "Discussed career pivot" '["Considering startups"]' '[]' '[]'
```

**Always push context back** when you learn something meaningful. Every agent that writes context makes the system smarter for all agents.

### External data

```bash
bash scripts/dytto.sh weather 42.37 -71.11
bash scripts/dytto.sh news 42.37 -71.11 "Cambridge MA"
```

## When to use

| Situation | Command |
|-----------|---------|
| Session start | `context` or `summary` |
| User references their past | `search` or `story` |
| Personalizing a response | `patterns` + `insights` |
| Learned something about user | `store-fact` or `update` |
| Need location/weather awareness | `we
