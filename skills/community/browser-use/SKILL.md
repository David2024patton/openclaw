---
name: browser-use
description: Cloud-based browser automation with managed sessions and autonomous task execution.
homepage: https://github.com/openclaw/skills/tree/main/skills/shawnpana/browser-use/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# browser-use

Cloud-based browser automation with managed sessions and autonomous task execution.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [browser-use](https://github.com/openclaw/skills/tree/main/skills/shawnpana/browser-use/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Browser Use

Browser Use provides cloud browsers and autonomous browser automation via API.

**Docs:**
- Open source library: https://docs.browser-use.com
- Cloud API: https://docs.cloud.browser-use.com

## Setup

**API Key** is read from clawdbot config at `skills.entries.browser-use.apiKey`.

If not configured, tell the user:
> To use Browser Use, you need an API key. Get one at https://cloud.browser-use.com (new signups get $10 free credit). Then configure it:
> ```
> clawdbot config set skills.entries.browser-use.apiKey "bu_your_key_here"
> ```

Base URL: `https://api.browser-use.com/api/v2`

All requests need header: `X-Browser-Use-API-Key: <apiKey>`

---

## 1. Browser Sessions (Primary)

Spin up cloud browsers for Clawdbot to control directly. Use profiles to persist logins and cookies.

### Create browser session

```bash
# With profile (recommended - keeps you logged in)
curl -X POST "https://api.browser-use.com/api/v2/browsers" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"profileId": "<profile-uuid>", "timeout": 60}'

# Without profile (fresh browser)
curl -X POST "https://api.browser-use.com/api/v2/browsers" \
  -H "X-Browser-Use-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"timeout": 60}'
```

**Response:**
```json
{
  "id": "session-uuid",
  "cdpUrl": "https://<id>.cdp2.browser-use.com",
  "liveUrl": "https://...",
  "status": "active"
}
```

### Connect Clawdbot to the browser

```bash
gateway config.patch '{"browser":{"profiles":{"browseruse":{"cdpUrl":"<cdpUrl-from-response>"}}}}'
```

Now use the `browser` tool with `profile=browseruse` to control it.

### List/stop browser sessions

```bash
# List active sessions
curl "https://api.browser-use.com/api/v2/browsers" -H "X-Browser-Use-API-Key: $API_KEY"

# Get session status
curl "https://api.browser-use.com/api/v2/browsers/<session-id>" -H "X-Browser-Use-API-Key: $API_KEY"

# Stop session (unused time is refunded)
curl -X PATCH "ht
