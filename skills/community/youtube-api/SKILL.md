---
name: youtube-api
description: YouTube API access without the official API quota hassle — transcripts, search, channels, playlists.
homepage: https://github.com/openclaw/skills/tree/main/skills/therohitdas/youtube-api/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# youtube-api

YouTube API access without the official API quota hassle — transcripts, search, channels, playlists.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [youtube-api](https://github.com/openclaw/skills/tree/main/skills/therohitdas/youtube-api/SKILL.md)
- **Security Status**: SAFE

## Instructions

# YouTube API

YouTube data access via [TranscriptAPI.com](https://transcriptapi.com) — no Google API quota needed.

## Setup

If `$TRANSCRIPT_API_KEY` is not set, help the user create an account (100 free credits, no card):

**Step 1 — Register:** Ask user for their email, generate a secure password.

```bash
node ./scripts/tapi-auth.js register --email USER_EMAIL --password SECURE_PASS --json
```

→ OTP sent to email. Ask user: _"Check your email for a 6-digit verification code."_
⚠️ **SAVE THE PASSWORD** — you need it again in Step 2!

**Step 2 — Verify:** Once user provides the OTP (use SAME password from Step 1):

```bash
node ./scripts/tapi-auth.js verify --email USER_EMAIL --password SECURE_PASS --otp CODE --json
```

→ Returns `api_key` (starts with `sk_`).

**Step 3 — Save:** Store the key (auto-configures agent + shell):

```bash
node ./scripts/tapi-auth.js save-key --key API_KEY --json
```

→ Ready to use. Agent runtime picks up the key automatically.

Manual option: [transcriptapi.com/signup](https://transcriptapi.com/signup) → Dashboard → API Keys.

## Endpoint Reference

All endpoints: `https://transcriptapi.com/api/v2/youtube/...`

| Endpoint                               | Method | Cost     |
| -------------------------------------- | ------ | -------- |
| `/transcript?video_url=ID`             | GET    | 1        |
| `/search?q=QUERY&type=video`           | GET    | 1        |
| `/channel/resolve?input=@handle`       | GET    | **free** |
| `/channel/latest?channel_id=UC_ID`     | GET    | **free** |
| `/channel/videos?channel_id=UC_ID`     | GET    | 1/page   |
| `/channel/search?channel_id=UC_ID&q=Q` | GET    | 1        |
| `/playlist/videos?playlist_id=PL_ID`   | GET    | 1/page   |

## Quick Examples

**Search videos:**

```bash
curl -s "https://transcriptapi.com/api/v2/youtube/search\
?q=python+tutorial&type=video&limit=10" \
  -H "Authorization: Bearer $TRANSCRIPT_API_KEY"
```

**Get transcript:**

```bash
curl -s "https://transcriptapi.com/ap
