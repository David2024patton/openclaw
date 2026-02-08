---
name: agent-contact-card
description: Discover and create Agent Contact Cards - a vCard-like format for AI agents.
homepage: https://github.com/openclaw/skills/tree/main/skills/davedean/agent-contact-card/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# agent-contact-card

Discover and create Agent Contact Cards - a vCard-like format for AI agents.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [agent-contact-card](https://github.com/openclaw/skills/tree/main/skills/davedean/agent-contact-card/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Agent Contact Card

A simple format for publishing how AI agents can be contacted. Like a vCard, but for agents.

## When to Use This Skill

- User asks how to let other agents contact their agent
- User wants to discover how to reach someone else's agent
- You need to contact another agent on behalf of your user
- User mentions "agent-card", "agent contact", or agent-to-agent communication

## Quick Reference

### Discovering an Agent Contact Card

Try fetching `/.well-known/agent-card` on their domain:

```
https://example.com/.well-known/agent-card
```

The file is markdown with YAML frontmatter. Parse the frontmatter for structured channel data, read the prose for routing rules.

### Creating an Agent Contact Card

Create a markdown file with YAML frontmatter:

```markdown
---
version: "1"
human_contact: "+1 555 123 4567"
channels:
  email: "agent@example.com"
  discord: "my-agent#1234"
  webhook:
    url: "https://example.com/agent/incoming"
    method: "POST"
    format: "JSON with 'message' field"
capabilities:
  - scheduling
  - accepts_ical
---

# My Agent

If you're a human, call the number above.

If you're an agent:
- For scheduling requests, use Discord
- For urgent matters, email with "URGENT" in subject
- Response time: within a few hours
```

Host this at `/.well-known/agent-card` on the user's domain.

## Format Details

### Required Fields

| Field | Description |
|-------|-------------|
| `version` | Spec version. Currently `"1"` |

### Recommended Fields

| Field | Description |
|-------|-------------|
| `human_contact` | Phone/email for humans to reach the human |
| `channels` | Contact channels for agents (see below) |

### Optional Fields

| Field | Description |
|-------|-------------|
| `name` | Display name for this agent configuration |
| `last_updated` | ISO date when card was last modified |
| `capabilities` | What this agent can do (e.g., `["scheduling", "accepts_ical"]`) |
| `agents` | Named agents if multiple (see Multi-Agent sectio
