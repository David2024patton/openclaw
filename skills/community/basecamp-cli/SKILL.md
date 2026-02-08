---
name: basecamp-cli
description: Manage Basecamp (via bc3 API / 37signals Launchpad) projects, to-dos, messages.
homepage: https://github.com/openclaw/skills/tree/main/skills/emredoganer/basecamp-cli/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# basecamp-cli

Manage Basecamp (via bc3 API / 37signals Launchpad) projects, to-dos, messages.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [basecamp-cli](https://github.com/openclaw/skills/tree/main/skills/emredoganer/basecamp-cli/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Basecamp CLI

This repo contains a standalone CLI.

## Install

```bash
npm i -g @emredoganer/basecamp-cli
```

## Auth

Create an integration (OAuth app) in 37signals Launchpad:
- https://launchpad.37signals.com/integrations

Then:
```bash
basecamp auth configure --client-id <id> --redirect-uri http://localhost:9292/callback
export BASECAMP_CLIENT_SECRET="<secret>"
basecamp auth login
```

## Notes

- This uses the Basecamp API docs published under bc3-api: https://github.com/basecamp/bc3-api
- `BASECAMP_CLIENT_SECRET` is intentionally NOT stored on disk by the CLI.
