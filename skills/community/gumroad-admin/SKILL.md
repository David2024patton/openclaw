---
name: gumroad-admin
description: Gumroad Admin CLI.
homepage: https://github.com/openclaw/skills/tree/main/skills/abakermi/gumroad-admin/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# gumroad-admin

Gumroad Admin CLI.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [gumroad-admin](https://github.com/openclaw/skills/tree/main/skills/abakermi/gumroad-admin/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Gumroad Admin

Manage your Gumroad store from OpenClaw.

## Setup

1. Get your Access Token from Gumroad (Settings > Advanced > Applications).
2. Set it: `export GUMROAD_ACCESS_TOKEN="your_token"`

## Commands

### Sales
```bash
gumroad-admin sales --day today
gumroad-admin sales --last 30
```

### Products
```bash
gumroad-admin products
```

### Discounts
```bash
gumroad-admin discounts create --product <id> --code "TWITTER20" --amount 20 --type percent
```
