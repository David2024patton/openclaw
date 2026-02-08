---
name: netpad
description: Manage NetPad forms, submissions, users.
homepage: https://github.com/openclaw/skills/tree/main/skills/mrlynn/netpad/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# netpad

Manage NetPad forms, submissions, users.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [netpad](https://github.com/openclaw/skills/tree/main/skills/mrlynn/netpad/SKILL.md)
- **Security Status**: SAFE

## Instructions

# NetPad

Manage forms, submissions, users, and RBAC via CLI and REST API.

## Two Tools

| Tool | Install | Purpose |
|------|---------|---------|
| `netpad` CLI | `npm i -g @netpad/cli` | RBAC, marketplace, packages |
| REST API | curl + API key | Forms, submissions, data |

## Authentication

```bash
export NETPAD_API_KEY="np_live_xxx"  # Production
export NETPAD_API_KEY="np_test_xxx"  # Test (can submit to drafts)
```

All requests use Bearer token:
```bash
curl -H "Authorization: Bearer $NETPAD_API_KEY" \
  "https://www.netpad.io/api/v1/..."
```

---

## Quick Reference

| Task | Endpoint | Method |
|------|----------|--------|
| List projects | `/projects` | GET |
| List forms | `/forms` | GET |
| Create form | `/forms` | POST |
| Get form | `/forms/{formId}` | GET |
| Update/publish form | `/forms/{formId}` | PATCH |
| Delete form | `/forms/{formId}` | DELETE |
| List submissions | `/forms/{formId}/submissions` | GET |
| Create submission | `/forms/{formId}/submissions` | POST |
| Get submission | `/forms/{formId}/submissions/{id}` | GET |
| Delete submission | `/forms/{formId}/submissions/{id}` | DELETE |

---

## Projects

Forms belong to projects. Get project ID before creating forms.

```bash
# List projects
curl -H "Authorization: Bearer $NETPAD_API_KEY" \
  "https://www.netpad.io/api/v1/projects" | jq '.data[] | {projectId, name}'
```

---

## Forms

### List Forms

```bash
curl -H "Authorization: Bearer $NETPAD_API_KEY" \
  "https://www.netpad.io/api/v1/forms?status=published&pageSize=50"
```

### Create Form

```bash
curl -X POST -H "Authorization: Bearer $NETPAD_API_KEY" \
  -H "Content-Type: application/json" \
  "https://www.netpad.io/api/v1/forms" \
  -d '{
    "name": "Contact Form",
    "description": "Simple contact form",
    "projectId": "proj_xxx",
    "fields": [
      {"path": "name", "label": "Name", "type": "text", "required": true},
      {"path": "email", "label": "Email", "type": "email", "required": true},
      {"path": "phone", "la
