---
name: beszel-check
description: Monitor home lab servers via Beszel (PocketBase).
homepage: https://github.com/openclaw/skills/tree/main/skills/karakuscem/beszel-check/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# beszel-check

Monitor home lab servers via Beszel (PocketBase).

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [beszel-check](https://github.com/openclaw/skills/tree/main/skills/karakuscem/beszel-check/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Beszel Monitoring

Check the status of your local servers.

## Usage
- `beszel status` - Get status of all systems
- `beszel containers` - List top containers by CPU usage

## Commands
```bash
# Get status
source ~/.zshrc && ~/clawd/skills/beszel/index.js status

# Get container stats
source ~/.zshrc && ~/clawd/skills/beszel/index.js containers
```
