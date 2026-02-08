---
name: vodoo
description: Query and manage Odoo ERP data (helpdesk tickets, projects, tasks, CRM leads, knowledge articles) via the vodoo CLI
homepage: https://github.com/openclaw/skills/tree/main/skills/julian-r/vodoo/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# vodoo

Query and manage Odoo ERP data (helpdesk tickets, projects, tasks, CRM leads, knowledge articles) via the vodoo CLI

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [vodoo](https://github.com/openclaw/skills/tree/main/skills/julian-r/vodoo/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Vodoo - Odoo CLI Tool

Use `uvx vodoo` to interact with Odoo via XML-RPC. No installation required - uvx runs it directly.

## Important: Always Use --no-color

**ALWAYS add `--no-color` to every vodoo command.** This disables ANSI escape codes and significantly reduces token usage.

```bash
# Correct
uvx vodoo --no-color helpdesk list

# Wrong (wastes tokens on color codes)
uvx vodoo helpdesk list
```

## Commands Overview

| Module | Model | Description |
|--------|-------|-------------|
| `helpdesk` | helpdesk.ticket | Support tickets |
| `project-task` | project.task | Project tasks |
| `project` | project.project | Projects |
| `crm` | crm.lead | Leads & opportunities |
| `knowledge` | knowledge.article | Knowledge articles |
| `model` | any | Generic CRUD for any model |
| `security` | - | User & group management |

## Helpdesk Tickets

```bash
# List tickets
uvx vodoo helpdesk list
uvx vodoo helpdesk list --stage "New"
uvx vodoo helpdesk list --limit 5

# Show ticket details
uvx vodoo helpdesk show 123

# Add comment (visible to customer)
uvx vodoo helpdesk comment 123 "Your issue has been resolved"

# Add internal note (not visible to customer)
uvx vodoo helpdesk note 123 "Escalated to dev team"

# Manage tags
uvx vodoo helpdesk tags                    # List available tags
uvx vodoo helpdesk tag 123 "urgent"        # Add tag to ticket

# View history and attachments
uvx vodoo helpdesk chatter 123             # Message history
uvx vodoo helpdesk attachments 123         # List attachments
uvx vodoo helpdesk download 456            # Download attachment by ID
uvx vodoo helpdesk download-all 123        # Download all attachments

# Update fields
uvx vodoo helpdesk fields                  # List available fields
uvx vodoo helpdesk fields 123              # Show field values for ticket
uvx vodoo helpdesk set 123 priority=3      # Set field value

# Attachments and URL
uvx vodoo helpdesk attach 123 report.pdf   # Attach file
uvx vodoo helpdesk url 123           
