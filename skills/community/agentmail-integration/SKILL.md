---
name: agentmail-integration
description: Integrate AgentMail API for AI agent email automation.
homepage: https://github.com/openclaw/skills/tree/main/skills/synesthesia-wav/agentmail-integration/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# agentmail-integration

Integrate AgentMail API for AI agent email automation.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [agentmail-integration](https://github.com/openclaw/skills/tree/main/skills/synesthesia-wav/agentmail-integration/SKILL.md)
- **Security Status**: SAFE

## Instructions

# AgentMail Integration

AgentMail is an API-first email platform designed specifically for AI agents. Unlike traditional email providers (Gmail, Outlook), AgentMail provides programmatic inboxes, usage-based pricing, high-volume sending, and real-time webhooks.

## Core Capabilities

- **Programmatic Inboxes**: Create and manage email addresses via API
- **Send/Receive**: Full email functionality with rich content support
- **Real-time Events**: Webhook notifications for incoming messages
- **AI-Native Features**: Semantic search, automatic labeling, structured data extraction
- **No Rate Limits**: Built for high-volume agent use

## Quick Start

1. **Create an account** at [console.agentmail.to](https://console.agentmail.to)
2. **Generate API key** in the console dashboard
3. **Install Python SDK**: `pip install agentmail python-dotenv`
4. **Set environment variable**: `AGENTMAIL_API_KEY=your_key_here`

```python
from agentmail import AgentMail
import os

# Initialize
client = AgentMail(api_key=os.getenv('AGENTMAIL_API_KEY'))

# Create inbox with optional username
inbox = client.inboxes.create(
    username="my-agent",  # Creates my-agent@agentmail.to
    client_id="unique-id"  # Ensures idempotency
)
print(f"Created: {inbox.inbox_id}")

# Send email
message = client.inboxes.messages.send(
    inbox_id=inbox.inbox_id,
    to="recipient@example.com",
    subject="Hello from Agent",
    text="Plain text version",
    html="<html><body><h1>HTML version</h1></body></html>"
)
```

## Core Concepts

### Hierarchy
- **Organization** → top-level container
- **Inbox** → email account (create thousands)
- **Thread** → conversation grouping
- **Message** → individual email
- **Attachment** → files

### Authentication
Requires `AGENTMAIL_API_KEY` environment variable or pass to constructor.

## Operations

### Inbox Management

```python
# Create inbox (auto-generates address)
inbox = client.inboxes.create()

# Create with custom username and client_id (idempotency)
inbox = c
