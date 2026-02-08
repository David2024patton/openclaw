---
name: kakiyo
description: Official Kakiyo skill from Kakiyo.com for managing LinkedIn automation campaigns, prospects, and AI agents via Kakiyo.
homepage: https://github.com/openclaw/skills/tree/main/skills/cyberboyayush/kakiyo/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# kakiyo

Official Kakiyo skill from Kakiyo.com for managing LinkedIn automation campaigns, prospects, and AI agents via Kakiyo.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [kakiyo](https://github.com/openclaw/skills/tree/main/skills/cyberboyayush/kakiyo/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Kakiyo LinkedIn Automation

Official skill from Kakiyo.com to control LinkedIn outreach campaigns and AI agents through the Kakiyo MCP server.

## Quick Setup (Agent-Assisted)

**Check if configured:**
```bash
mcporter config get kakiyo
```

If not configured, prompt user: "I need your Kakiyo API key to set this up. Get it from https://app.kakiyo.com → Settings → API Keys → Create API Key (40 characters)."

**Once user provides their API key, run:**
```bash
mcporter config add kakiyo https://api.kakiyo.com/mcp \
  --header "Authorization:Bearer USER_API_KEY"
```

Replace `USER_API_KEY` with the key they provide.

**Verify setup:**
```bash
mcporter call kakiyo.verify_api_key --output json
```

## Available Tools (42 total)

### Agents (5 tools)
Manage LinkedIn automation agents.

**list_agents** - List all agents with status and config
```bash
mcporter call kakiyo.list_agents --output json
```

**get_agent** - Get detailed agent info
```bash
mcporter call kakiyo.get_agent agentId:"agent_123" --output json
```

**update_agent** - Modify agent settings (working hours, limits)
```bash
mcporter call kakiyo.update_agent agentId:"agent_123" workingHours:'{"start":"09:00","end":"17:00"}' --output json
```

**pause_agent** - Stop an agent temporarily
```bash
mcporter call kakiyo.pause_agent agentId:"agent_123" --output json
```

**resume_agent** - Restart a paused agent
```bash
mcporter call kakiyo.resume_agent agentId:"agent_123" --output json
```

### Campaigns (6 tools)
Create and manage outreach campaigns.

**list_campaigns** - List all campaigns with status
```bash
mcporter call kakiyo.list_campaigns --output json
```

**get_campaign_stats** - Get performance metrics
```bash
mcporter call kakiyo.get_campaign_stats campaignId:"camp_123" --output json
```

**create_campaign** - Create new campaign
```bash
mcporter call kakiyo.create_campaign \
  name:"Tech Founders Outreach" \
  productId:"prod_123" \
  promptId:"prompt_456" \
  agentId:"agent_789" \
  --output json
```
