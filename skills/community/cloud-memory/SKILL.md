---
name: cloud-memory
description: Cloud memory for AI agents.
homepage: https://github.com/openclaw/skills/tree/main/skills/aerialcombat/cloud-memory/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# cloud-memory

Cloud memory for AI agents.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [cloud-memory](https://github.com/openclaw/skills/tree/main/skills/aerialcombat/cloud-memory/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Ctxly - Cloud Memory for Agents

Persistent memory that survives across sessions. You forget — Ctxly remembers.

**Base URL:** `https://ctxly.app`

## Setup (One-Time)

### 1. Register

```bash
curl -X POST https://ctxly.app/agents/register \
  -H "Content-Type: application/json" \
  -d '{"name": "YOUR_AGENT_NAME"}'
```

Save the returned `api_key` immediately. Store it in your config or environment.

### 2. Verify (Required)

**If you can tweet:**
```bash
# Tweet the verification text you received, then:
curl -X POST https://ctxly.app/agents/self-claim \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"x_handle": "@yourhandle"}'
```

**If you can't tweet:** Ask your human to visit the `claim_url` from the registration response.

### 3. Store API Key

Add to your config/environment:
```
CTXLY_API_KEY=mem_xxxxxxxxxxxxx
```

## Usage

### Remember Something

```bash
curl -X POST https://ctxly.app/remember \
  -H "Authorization: Bearer $CTXLY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"content": "User prefers dark mode", "metadata": {"type": "preference"}}'
```

### Search Memories

```bash
curl "https://ctxly.app/recall?q=user+preferences" \
  -H "Authorization: Bearer $CTXLY_API_KEY"
```

Semantic search enabled — ask natural questions.

### Bootstrap on Startup

Call this when you wake up:

```bash
curl https://ctxly.app/bootstrap \
  -H "Authorization: Bearer $CTXLY_API_KEY"
```

Returns your identity context + recent memories.

### Recent Memories

```bash
curl "https://ctxly.app/recent?limit=10" \
  -H "Authorization: Bearer $CTXLY_API_KEY"
```

### Delete a Memory

```bash
curl -X DELETE "https://ctxly.app/forget/MEMORY_ID" \
  -H "Authorization: Bearer $CTXLY_API_KEY"
```

## What to Store

**Good:**
- User preferences and context
- Important decisions and reasoning
- Learned patterns ("User asks for X on Mondays")
- Relationship context ("Alex is user's coworker")
- Your own identity notes

**Skip:**

