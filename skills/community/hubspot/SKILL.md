---
name: hubspot
description: HubSpot CRM and CMS API integration for contacts, companies, deals, owners.
homepage: https://github.com/openclaw/skills/tree/main/skills/kwall1/hubspot/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# hubspot

HubSpot CRM and CMS API integration for contacts, companies, deals, owners.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [hubspot](https://github.com/openclaw/skills/tree/main/skills/kwall1/hubspot/SKILL.md)
- **Security Status**: SAFE

## Instructions

# HubSpot Skill

Interact with HubSpot CRM and CMS via the REST API.

## Setup

Set your HubSpot Private App access token:
```
HUBSPOT_ACCESS_TOKEN=pat-na2-xxxxx
```

## API Base

All endpoints use: `https://api.hubapi.com`

Authorization header: `Bearer $HUBSPOT_ACCESS_TOKEN`

---

## CRM Objects

### Contacts

**Create contact:**
```bash
curl -s -X POST -H "Authorization: Bearer $HUBSPOT_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"properties":{"email":"test@example.com","firstname":"Test","lastname":"User","phone":"555-1234","company":"Acme Inc","jobtitle":"Manager"}}' \
  "https://api.hubapi.com/crm/v3/objects/contacts" | jq
```

**List contacts:**
```bash
curl -s -H "Authorization: Bearer $HUBSPOT_ACCESS_TOKEN" \
  "https://api.hubapi.com/crm/v3/objects/contacts?limit=10" | jq
```

**Search contacts:**
```bash
curl -s -X POST -H "Authorization: Bearer $HUBSPOT_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filterGroups":[{"filters":[{"propertyName":"email","operator":"CONTAINS_TOKEN","value":"example.com"}]}],"limit":10}' \
  "https://api.hubapi.com/crm/v3/objects/contacts/search" | jq
```

**Get contact by ID:**
```bash
curl -s -H "Authorization: Bearer $HUBSPOT_ACCESS_TOKEN" \
  "https://api.hubapi.com/crm/v3/objects/contacts/{contactId}?properties=email,firstname,lastname,phone,company" | jq
```

**Get contact by email:**
```bash
curl -s -H "Authorization: Bearer $HUBSPOT_ACCESS_TOKEN" \
  "https://api.hubapi.com/crm/v3/objects/contacts/{email}?idProperty=email" | jq
```

### Companies

**List companies:**
```bash
curl -s -H "Authorization: Bearer $HUBSPOT_ACCESS_TOKEN" \
  "https://api.hubapi.com/crm/v3/objects/companies?limit=10&properties=name,domain,industry" | jq
```

**Search companies:**
```bash
curl -s -X POST -H "Authorization: Bearer $HUBSPOT_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filterGroups":[{"filters":[{"propertyName":"name","operator":"CONTAINS_TOKEN","value":"acme"}]}],"limit":10}'
