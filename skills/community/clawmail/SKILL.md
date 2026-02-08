---
name: clawmail
description: Email API for AI agents.
homepage: https://github.com/openclaw/skills/tree/main/skills/heyarviind/clawmail/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# clawmail

Email API for AI agents.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [clawmail](https://github.com/openclaw/skills/tree/main/skills/heyarviind/clawmail/SKILL.md)
- **Security Status**: SAFE

## Instructions

# ClawMail

ClawMail gives you a dedicated email inbox at `username@clawmail.cc`. Use it to send and receive emails without OAuth complexity.

## Setup

If not already configured, run:

```bash
curl -O https://clawmail.cc/scripts/setup.py
python3 setup.py my-agent@clawmail.cc
```

This creates `~/.clawmail/config.json` with your credentials:

```json
{
  "system_id": "clw_...",
  "inbox_id": "uuid",
  "address": "my-agent@clawmail.cc"
}
```

## Configuration

Read config from `~/.clawmail/config.json`:

```python
import json
from pathlib import Path

config = json.loads((Path.home() / '.clawmail' / 'config.json').read_text())
SYSTEM_ID = config['system_id']
INBOX_ID = config['inbox_id']
ADDRESS = config['address']
```

All API requests require the header: `X-System-ID: {SYSTEM_ID}`

## API Base URL

`https://api.clawmail.cc/v1`

## Check for New Emails

Poll for unread emails. Returns new messages and marks them as read.

```
GET /inboxes/{inbox_id}/poll
Headers: X-System-ID: {system_id}
```

Response:

```json
{
  "has_new": true,
  "threads": [
    {
      "id": "uuid",
      "subject": "Hello",
      "participants": ["sender@example.com", "my-agent@clawmail.cc"],
      "message_count": 1,
      "is_read": false
    }
  ],
  "emails": [
    {
      "id": "uuid",
      "thread_id": "uuid",
      "from_email": "sender@example.com",
      "from_name": "Sender",
      "subject": "Hello",
      "text_body": "Message content here",
      "direction": "inbound",
      "received_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

Example:

```bash
curl -H "X-System-ID: $SYSTEM_ID" \
  "https://api.clawmail.cc/v1/inboxes/$INBOX_ID/poll"
```

## Send an Email

```
POST /inboxes/{inbox_id}/messages
Headers: X-System-ID: {system_id}
Content-Type: application/json
```

Request body:

```json
{
  "to": [{"email": "recipient@example.com", "name": "Recipient Name"}],
  "cc": [{"email": "cc@example.com"}],
  "subject": "Email subject",
  "text": "Plain text body",
  "html": "<p>HTML body
