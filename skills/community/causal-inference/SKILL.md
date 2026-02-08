---
name: causal-inference
description: Add causal reasoning to agent actions.
homepage: https://github.com/openclaw/skills/tree/main/skills/oswalpalash/causal-inference/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# causal-inference

Add causal reasoning to agent actions.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [causal-inference](https://github.com/openclaw/skills/tree/main/skills/oswalpalash/causal-inference/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Causal Inference

A lightweight causal layer for predicting action outcomes, not by pattern-matching correlations, but by modeling interventions and counterfactuals.

## Core Invariant

**Every action must be representable as an explicit intervention on a causal model, with predicted effects + uncertainty + a falsifiable audit trail.**

Plans must be *causally valid*, not just plausible.

## When to Trigger

**Trigger this skill on ANY high-level action**, including but not limited to:

| Domain | Actions to Log |
|--------|---------------|
| **Communication** | Send email, send message, reply, follow-up, notification, mention |
| **Calendar** | Create/move/cancel meeting, set reminder, RSVP |
| **Tasks** | Create/complete/defer task, set priority, assign |
| **Files** | Create/edit/share document, commit code, deploy |
| **Social** | Post, react, comment, share, DM |
| **Purchases** | Order, subscribe, cancel, refund |
| **System** | Config change, permission grant, integration setup |

Also trigger when:
- **Reviewing outcomes** — "Did that email get a reply?" → log outcome, update estimates
- **Debugging failures** — "Why didn't this work?" → trace causal graph
- **Backfilling history** — "Analyze my past emails/calendar" → parse logs, reconstruct actions
- **Planning** — "Should I send now or later?" → query causal model

## Backfill: Bootstrap from Historical Data

Don't start from zero. Parse existing logs to reconstruct past actions + outcomes.

### Email Backfill

```bash
# Extract sent emails with reply status
gog gmail list --sent --after 2024-01-01 --format json > /tmp/sent_emails.json

# For each sent email, check if reply exists
python3 scripts/backfill_email.py /tmp/sent_emails.json
```

### Calendar Backfill

```bash
# Extract past events with attendance
gog calendar list --after 2024-01-01 --format json > /tmp/events.json

# Reconstruct: did meeting happen? was it moved? attendee count?
python3 scripts/backfill_calendar.py /tmp/events.json
```

###
