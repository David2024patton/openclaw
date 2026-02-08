---
name: brevo
description: Brevo (formerly Sendinblue) email marketing API for managing contacts, lists, sending transactional emails.
homepage: https://github.com/openclaw/skills/tree/main/skills/yujesyoga/brevo/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# brevo

Brevo (formerly Sendinblue) email marketing API for managing contacts, lists, sending transactional emails.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [brevo](https://github.com/openclaw/skills/tree/main/skills/yujesyoga/brevo/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Brevo Email Marketing API

Manage contacts, send emails, and automate marketing via Brevo's REST API.

## Authentication

```bash
BREVO_KEY=$(cat ~/.config/brevo/api_key)
```

All requests require header: `api-key: $BREVO_KEY`

## Base URL

```
https://api.brevo.com/v3
```

## Common Endpoints

### Contacts

| Action | Method | Endpoint |
|--------|--------|----------|
| Create contact | POST | `/contacts` |
| Get contact | GET | `/contacts/{email}` |
| Update contact | PUT | `/contacts/{email}` |
| Delete contact | DELETE | `/contacts/{email}` |
| List contacts | GET | `/contacts?limit=50&offset=0` |
| Get blacklisted | GET | `/contacts?emailBlacklisted=true` |

### Lists

| Action | Method | Endpoint |
|--------|--------|----------|
| Get all lists | GET | `/contacts/lists` |
| Create list | POST | `/contacts/lists` |
| Get list contacts | GET | `/contacts/lists/{listId}/contacts` |
| Add to list | POST | `/contacts/lists/{listId}/contacts/add` |
| Remove from list | POST | `/contacts/lists/{listId}/contacts/remove` |

### Emails

| Action | Method | Endpoint |
|--------|--------|----------|
| Send transactional | POST | `/smtp/email` |
| Send campaign | POST | `/emailCampaigns` |
| Get templates | GET | `/smtp/templates` |

## Examples

### Create/Update Contact

```bash
curl -X POST "https://api.brevo.com/v3/contacts" \
  -H "api-key: $BREVO_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "listIds": [10],
    "updateEnabled": true,
    "attributes": {
      "NOMBRE": "John",
      "APELLIDOS": "Doe"
    }
  }'
```

### Get Contact Info

```bash
curl "https://api.brevo.com/v3/contacts/user@example.com" \
  -H "api-key: $BREVO_KEY"
```

### Update Contact Attributes

```bash
curl -X PUT "https://api.brevo.com/v3/contacts/user@example.com" \
  -H "api-key: $BREVO_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "listIds": [10, 15],
    "attributes": {
      "CUSTOM_FIELD": "value"
    }
  }'
```

### Send Tran
