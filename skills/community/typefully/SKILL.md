---
name: typefully
description: |.
homepage: https://github.com/openclaw/skills/tree/main/skills/thesethrose/typefully/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# typefully

|.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [typefully](https://github.com/openclaw/skills/tree/main/skills/thesethrose/typefully/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Typefully Skill
Schedule and publish content to X, LinkedIn, Mastodon, Threads, and Bluesky through the Typefully API.

## Setup
- Create a Typefully account at https://typefully.com
- Connect social media accounts in Typefully
- Generate an API key in Typefully settings
- Set the environment variable

```bash
export TYPEFULLY_API_KEY="your-typefully-api-key"
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| TYPEFULLY_API_KEY | Yes | Your Typefully API key |

## Commands

### User and Accounts

```bash
typefully me                    # Get current user info
typefully social-sets           # List connected social accounts
typefully social-set <id>       # Get details for a specific account
```

### Drafts

```bash
typefully drafts                     # List all drafts for an account
typefully draft <id>                 # Get a specific draft
typefully create-draft "content"     # Create a new draft
typefully update-draft <id> "text"   # Update a draft
typefully delete-draft <id>          # Delete a draft
```

### Draft Options

| Option | Description |
|--------|-------------|
| --social-set-id <id> | Account ID required for drafts |
| --schedule <time> | ISO 8601 datetime |
| --now | Publish immediately after creating |
| --next-free-slot | Schedule for optimal posting time |
| --title <text> | Internal draft title |
| --share | Generate public share URL |
| --thread | Treat content as multi-line thread |
| --reply-to <url> | Reply to an existing post URL |
| --community <id> | Post to a community |

### Filtering Drafts

```bash
typefully drafts                  # Default 10 drafts sorted by updated
typefully drafts --status draft   # Only draft status
typefully drafts --status scheduled  # Only scheduled
typefully drafts --status published  # Only published
typefully drafts --limit 25       # More results per page
typefully drafts --offset 10      # Skip first 10 results
typefully drafts --order-by creat
