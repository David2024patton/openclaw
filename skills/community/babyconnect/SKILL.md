---
name: babyconnect
description: ActiveCampaign CRM integration for lead management, deal tracking.
homepage: https://github.com/openclaw/skills/tree/main/skills/kesslerio/babyconnect/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# babyconnect

ActiveCampaign CRM integration for lead management, deal tracking.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [babyconnect](https://github.com/openclaw/skills/tree/main/skills/kesslerio/babyconnect/SKILL.md)
- **Security Status**: SAFE

## Instructions

# ActiveCampaign Skill 📧

ActiveCampaign integration for CRM automation and sales pipeline management.

## Purpose

Manage leads, deals, and email automations for sales:
- **Contacts**: Sync demo attendees, leads, and prospects
- **Deals**: Track sales pipeline stages
- **Tags**: Segment leads (demo-requested, nurture, close-ready)
- **Automations**: Trigger email sequences based on actions
- **Custom Fields**: Map order, shipping, billing, and subscription data

## Setup

### 1. Credentials

```bash
# Create config directory
mkdir -p ~/.config/activecampaign

# Add credentials
echo "https://youraccount.api-us1.com" > ~/.config/activecampaign/url
echo "your-api-key" > ~/.config/activecampaign/api_key

# Or use environment variables
export ACTIVECAMPAIGN_URL="https://youraccount.api-us1.com"
export ACTIVECAMPAIGN_API_KEY="your-api-key"
```

Get API credentials from ActiveCampaign:
- **URL**: Settings → Developer → API Access
- **API Key**: Settings → Developer → API Access

### 2. Custom Fields Configuration (Optional)

The skill supports custom field mappings for order, shipping, billing, and subscription data.

```bash
# Initialize config from sample
activecampaign config init

# Edit with your field IDs
nano ~/.config/activecampaign/fields.json
```

The config file is **gitignored** and should not be committed.

## Usage

```bash
# Contacts
activecampaign contacts list                    # List all contacts
activecampaign contacts create "email@test.com" "First" "Last"
activecampaign contacts sync "email@test.com" "First" "Last"
activecampaign contacts get <id>
activecampaign contacts search "clinic"
activecampaign contacts add-tag <id> <tag_id>
activecampaign contacts remove-tag <id> <tag_id>

# Deals
activecampaign deals list
activecampaign deals create "Clinic Name" <stage_id> <value>
activecampaign deals update <id> stage=<stage_id> value=<value>
activecampaign deals get <id>

# Tags
activecampaign tags list
activecampaign tags create "Demo Requested"

# Autom
