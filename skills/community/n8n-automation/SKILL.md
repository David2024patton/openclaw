---
name: n8n-automation
description: Manage n8n workflows from OpenClaw via the n8n REST API.
homepage: https://github.com/openclaw/skills/tree/main/skills/dilomcfly/n8n-automation/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# n8n-automation

Manage n8n workflows from OpenClaw via the n8n REST API.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [n8n-automation](https://github.com/openclaw/skills/tree/main/skills/dilomcfly/n8n-automation/SKILL.md)
- **Security Status**: SAFE

## Instructions

# n8n Automation

Control n8n workflow automation platform via REST API.

## Setup

Set these environment variables (or store in `.n8n-api-config`):

```bash
export N8N_API_URL="https://your-instance.app.n8n.cloud/api/v1"  # or http://localhost:5678/api/v1
export N8N_API_KEY="your-api-key-here"
```

Generate API key: n8n Settings → n8n API → Create an API key.

## Quick Reference

All calls use header `X-N8N-API-KEY` for auth.

### List Workflows
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/workflows" | jq '.data[] | {id, name, active}'
```

### Get Workflow Details
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/workflows/{id}"
```

### Activate/Deactivate Workflow
```bash
# Activate
curl -s -X PATCH -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": true}' "$N8N_API_URL/workflows/{id}"

# Deactivate
curl -s -X PATCH -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"active": false}' "$N8N_API_URL/workflows/{id}"
```

### Trigger Workflow (via webhook)
```bash
# Production webhook
curl -s -X POST "$N8N_API_URL/../webhook/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'

# Test webhook
curl -s -X POST "$N8N_API_URL/../webhook-test/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

### List Executions
```bash
# All recent executions
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?limit=10" | jq '.data[] | {id, workflowId, status, startedAt}'

# Failed executions only
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?status=error&limit=5"

# Executions for specific workflow
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions?workflowId={id}&limit=10"
```

### Get Execution Details
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_URL/executions/{id}"
```

### Create Workflow (from JSON)
```bash
curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KE
