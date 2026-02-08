---
name: n8n-api
description: Operate n8n via its public REST API from OpenClaw.
homepage: https://github.com/openclaw/skills/tree/main/skills/codedao12/n8n-api/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# n8n-api

Operate n8n via its public REST API from OpenClaw.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [n8n-api](https://github.com/openclaw/skills/tree/main/skills/codedao12/n8n-api/SKILL.md)
- **Security Status**: SAFE

## Instructions

# n8n Public REST API

Use this skill when you need to drive n8n programmatically. It covers the same core actions you use in the UI: workflows, executions, tags, credentials, projects, and more.

## Availability
- The public API is unavailable during the free trial.
- Upgrade your plan to enable API access.

## Configuration

Recommended environment variables (or store in `.n8n-api-config`):

```bash
export N8N_API_BASE_URL="https://your-instance.app.n8n.cloud/api/v1"  # or http://localhost:5678/api/v1
export N8N_API_KEY="your-api-key-here"
```

Create the API key in: n8n Settings → n8n API → Create an API key.

## Auth header

All requests require this header:

```
X-N8N-API-KEY: $N8N_API_KEY
```

## Playground

The API playground is only available on self-hosted n8n and operates on real data. For safe experiments, use a test workflow or a separate test instance.

## Quick actions

### Workflows: list
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_BASE_URL/workflows" \
  | jq '.data[] | {id, name, active}'
```

### Workflows: details
```bash
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" "$N8N_API_BASE_URL/workflows/{id}"
```

### Workflows: activate or deactivate
```bash
# Activate (publish)
curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"versionId":"","name":"","description":""}' \
  "$N8N_API_BASE_URL/workflows/{id}/activate"

# Deactivate
curl -s -X POST -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "$N8N_API_BASE_URL/workflows/{id}/deactivate"
```

### Webhook trigger
```bash
# Production webhook
curl -s -X POST "$N8N_API_BASE_URL/../webhook/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}'

# Test webhook
curl -s -X POST "$N8N_API_BASE_URL/../webhook-test/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"key":"value"}'
```

### Executions: list
```bash
# Recent executions
curl -s -H "X-N8N-API-KEY: $N8N_API_KEY" \
  "$N8N_API_BASE_URL/executions?limit=10" \
  | jq 
