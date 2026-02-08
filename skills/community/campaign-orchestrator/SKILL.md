---
name: campaign-orchestrator
description: Multi-channel follow-up campaign orchestrator for ShapeScale sales.
homepage: https://github.com/openclaw/skills/tree/main/skills/kesslerio/campaign-orchestrator/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# campaign-orchestrator

Multi-channel follow-up campaign orchestrator for ShapeScale sales.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [campaign-orchestrator](https://github.com/openclaw/skills/tree/main/skills/kesslerio/campaign-orchestrator/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Campaign Orchestrator Skill

Multi-channel follow-up campaign orchestrator for ShapeScale sales. Executes scheduled SMS + Email sequences with CRM integration and auto-termination on replies.

## Overview

A **Campaign** is a defined sequence of steps (SMS/Email) that executes over time. When a lead replies to any message, the campaign automatically terminates.

### Key Features

- **Multi-channel**: SMS (Dialpad) + Email (Gmail)
- **Scheduled**: Cron-based execution with configurable delays
- **Personalized**: Templates filled from Attio CRM data
- **Auto-terminating**: Replies stop all future scheduled steps
- **Logged**: All activities recorded in Attio

## Setup

**Environment variables required:**
```bash
DIALPAD_API_KEY=your_dialpad_api_key
ATTIO_API_KEY=your_attio_api_key
GOG_KEYRING_PASSWORD=your_google_password  # For Gmail access
```

**Also ensure:**
- Dialpad webhook is configured to hit this server
- Attio has company/contact records for leads
- Gmail API access enabled for sales email

## Usage

### Start a Campaign

```bash
# Start primary follow-up campaign for a lead
python3 campaign.py start "primary" --lead "Apex Fitness"

# Start with custom delay override (hours)
python3 campaign.py start "primary" --lead "Apex Fitness" --delay 2

# Start with Attio deal/company ID
python3 campaign.py start "post-demo" --lead "Apex Fitness" --attio-id "deal-uuid"
```

### Pre-Campaign Checklist (MANDATORY)

Before starting ANY campaign, verify:

1. **Customer Status Check**
   - Search memory/CRM for "already a customer" or "purchased" flags
   - Check exclusion list in campaigns.json
   - Verify email domain not in customer database

2. **Email Formatting Check** (for email steps)
   - Preview template renders as proper paragraphs
   - 2-4 sentences per paragraph, blank line between
   - No single-sentence orphan paragraphs
   - No hard line breaks mid-paragraph

3. **Tone Check**
   - No apologetic language ("no worries", "sorry to bother")
   - No easy outs
