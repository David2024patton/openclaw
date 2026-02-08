---
name: n8n-hub
description: Centralized n8n hub for designing reliable flows (idempotency, retries, HITL) and operating them via the public REST.
homepage: https://github.com/openclaw/skills/tree/main/skills/codedao12/n8n-hub/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# n8n-hub

Centralized n8n hub for designing reliable flows (idempotency, retries, HITL) and operating them via the public REST.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [n8n-hub](https://github.com/openclaw/skills/tree/main/skills/codedao12/n8n-hub/SKILL.md)
- **Security Status**: SAFE

## Instructions

# n8n Hub

This skill merges two tracks:
1) **Design**: plan dependable workflows and optionally emit `workflow.json`.
2) **Operate**: handle workflows/executions via the public REST API.

## Availability
- Public API access is disabled on free trial plans.
- An upgraded plan is required to use the API.

## Configuration

Suggested environment variables (or store in `.n8n-api-config`):

```bash
export N8N_API_BASE_URL="https://your-instance.app.n8n.cloud/api/v1"  # or http://localhost:5678/api/v1
export N8N_API_KEY="your-api-key-here"
```

Create an API key at: n8n Settings → n8n API → Create an API key.

## Use this skill when
- You want a workflow built for idempotency, retries, logging, and review queues.
- You need importable `workflow.json` plus a runbook template.
- You want to list, publish, deactivate, or debug workflows/executions via API.

## Do not use when
- You need pure code automation without n8n.
- You want to bypass security controls or conceal audit trails.

## Inputs
**Required**
- Trigger type + schedule/timezone
- Success criteria and destinations (email/Drive/DB)

**Optional**
- Existing workflow JSON
- Sample payloads/records
- Dedup keys

## Outputs
- Default: design spec (nodes, data contracts, failure modes)
- On request: `workflow.json` + `workflow-lab.md` (from `assets/workflow-lab.md`)

## Auth header
All requests must include:

```
X-N8N-API-KEY: $N8N_API_KEY
```

## Quick actions (API)

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
curl -s -X POST -H "X-N8N-API-KE
