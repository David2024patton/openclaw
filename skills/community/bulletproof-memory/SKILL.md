---
name: bulletproof-memory
description: Never lose context again.
homepage: https://github.com/openclaw/skills/tree/main/skills/halthelobster/bulletproof-memory/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# bulletproof-memory

Never lose context again.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [bulletproof-memory](https://github.com/openclaw/skills/tree/main/skills/halthelobster/bulletproof-memory/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Bulletproof Memory 🦞

**By Hal Labs** — Part of the Hal Stack

Your agent forgets things. Mid-conversation, after compaction, between sessions — context vanishes. This skill fixes that permanently.

## The Problem

Agents lose context in three ways:
1. **Compaction** — old messages get summarized/dropped
2. **Session restart** — agent wakes up fresh  
3. **Distraction** — mid-conversation, agent forgets earlier details

Traditional fix: "Remember to save important things." 

**But agents forget to remember.**

## The Solution: Write-Ahead Log (WAL) Protocol

The key insight: **trigger writes on USER INPUT, not agent memory.**

When the user provides a concrete detail, the agent writes it down BEFORE responding. The agent doesn't have to "remember" to save — the rule fires automatically based on what the user says.

| Old Approach | WAL Approach |
|--------------|--------------|
| "Remember to save important things" | "If user gives detail → write before responding" |
| Triggered by agent memory (unreliable) | Triggered by user INPUT (reliable) |
| Agent forgets to remember | Rule fires automatically |
| Saves after the fact (too late) | Saves before responding (never too late) |

## Quick Setup

### 1. Create SESSION-STATE.md

This is your agent's "hot RAM" — the active working memory that persists across compactions.

Create `SESSION-STATE.md` in your workspace root:

```markdown
# SESSION-STATE.md — Active Working Memory

This file is the agent's "RAM" — the hot transaction log for the current active task.
Chat history is a BUFFER. This file is STORAGE.

---

## Current Task
[What we're actively working on right now]

## Immediate Context
[Key details, decisions, corrections from this session]

## Key Files
[Paths to relevant files for this task]

## Last Updated
[Timestamp]
```

### 2. Add WAL Protocol to AGENTS.md

Add this to your agent's instructions:

```markdown
### WRITE-AHEAD LOG (WAL) PROTOCOL

**The Law:** You are a stateful operator. Chat history is a
