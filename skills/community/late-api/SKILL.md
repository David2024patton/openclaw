---
name: late-api
description: Late API for scheduling posts across 13 social media platforms.
homepage: https://github.com/openclaw/skills/tree/main/skills/mikipalet/late-api/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# late-api

Late API for scheduling posts across 13 social media platforms.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [late-api](https://github.com/openclaw/skills/tree/main/skills/mikipalet/late-api/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Late API Reference

Schedule posts across 13 social media platforms with a single API.

**Base URL:** `https://getlate.dev/api/v1`

**Docs:** [getlate.dev/docs](https://getlate.dev/docs)

## Quick Start

```bash
# 1. Create profile
curl -X POST https://getlate.dev/api/v1/profiles \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"name": "My Brand"}'

# 2. Connect account (opens OAuth)
curl "https://getlate.dev/api/v1/connect/twitter?profileId=PROFILE_ID" \
  -H "Authorization: Bearer YOUR_API_KEY"

# 3. Create post
curl -X POST https://getlate.dev/api/v1/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"content": "Hello!", "platforms": [{"platform": "twitter", "accountId": "ACC_ID"}], "publishNow": true}'
```

## Rule Files

Read individual rule files for detailed documentation:

- [rules/authentication.md](rules/authentication.md) - API key format, usage examples, core concepts
- [rules/posts.md](rules/posts.md) - Create, schedule, retry posts, bulk upload
- [rules/accounts.md](rules/accounts.md) - List accounts, health checks, follower stats
- [rules/connect.md](rules/connect.md) - OAuth flows, Bluesky app password, Telegram bot token
- [rules/platforms.md](rules/platforms.md) - Platform-specific data for all 13 platforms
- [rules/webhooks.md](rules/webhooks.md) - Configure webhooks, verify signatures, events
- [rules/media.md](rules/media.md) - Presigned uploads, supported formats, platform limits
- [rules/queue.md](rules/queue.md) - Queue management, slots configuration
- [rules/analytics.md](rules/analytics.md) - YouTube daily views, LinkedIn analytics
- [rules/tools.md](rules/tools.md) - Media download, hashtag checker, transcripts
- [rules/errors.md](rules/errors.md) - Error codes, rate limits, publishing logs
- [rules/sdks.md](rules/sdks.md) - Direct API usage examples

## Supported Platforms

Twitter/X, Instagram, Facebook, LinkedIn, TikTok, YouTube, Pinterest, Reddit, Bluesky, Threads, Google Business, Telegram, Snapchat

---

*[Late](https:
