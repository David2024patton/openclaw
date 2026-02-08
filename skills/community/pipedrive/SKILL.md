---
name: pipedrive
description: Pipedrive CRM API for managing deals, contacts (persons), organizations, activities, leads, pipelines, products,.
homepage: https://github.com/openclaw/skills/tree/main/skills/rdewolff/pipedrive/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# pipedrive

Pipedrive CRM API for managing deals, contacts (persons), organizations, activities, leads, pipelines, products,.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [pipedrive](https://github.com/openclaw/skills/tree/main/skills/rdewolff/pipedrive/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Pipedrive

Sales CRM API for deals, contacts, organizations, activities, pipelines, leads, and notes.

## Setup

Get your API token from Pipedrive:
1. Go to Settings → Personal preferences → API
2. Copy your personal API token

Store in `~/.clawdbot/clawdbot.json`:
```json
{
  "skills": {
    "entries": {
      "pipedrive": {
        "apiToken": "YOUR_API_TOKEN"
      }
    }
  }
}
```

Or set env: `PIPEDRIVE_API_TOKEN=xxx`

## Quick Reference

### Deals (most important!)
```bash
{baseDir}/scripts/pipedrive.sh deals list                    # List all deals
{baseDir}/scripts/pipedrive.sh deals list --status open      # Open deals only
{baseDir}/scripts/pipedrive.sh deals search "query"          # Search deals
{baseDir}/scripts/pipedrive.sh deals show <id>               # Get deal details
{baseDir}/scripts/pipedrive.sh deals create --title "Deal" --person <id> --value 1000
{baseDir}/scripts/pipedrive.sh deals update <id> --value 2000 --stage <stage_id>
{baseDir}/scripts/pipedrive.sh deals won <id>                # Mark deal as won
{baseDir}/scripts/pipedrive.sh deals lost <id> --reason "Reason"  # Mark deal as lost
{baseDir}/scripts/pipedrive.sh deals delete <id>             # Delete deal
```

### Persons (contacts)
```bash
{baseDir}/scripts/pipedrive.sh persons list                  # List all persons
{baseDir}/scripts/pipedrive.sh persons search "query"        # Search persons
{baseDir}/scripts/pipedrive.sh persons show <id>             # Get person details
{baseDir}/scripts/pipedrive.sh persons create --name "John Doe" --email "john@example.com"
{baseDir}/scripts/pipedrive.sh persons update <id> --phone "+1234567890"
{baseDir}/scripts/pipedrive.sh persons delete <id>           # Delete person
```

### Organizations
```bash
{baseDir}/scripts/pipedrive.sh orgs list                     # List all organizations
{baseDir}/scripts/pipedrive.sh orgs search "query"           # Search organizations
{baseDir}/scripts/pipedrive.sh orgs show <id>                # Get organiz
