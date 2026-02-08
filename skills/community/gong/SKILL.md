---
name: gong
description: Gong API for searching calls, transcripts.
homepage: https://github.com/openclaw/skills/tree/main/skills/jdrhyne/gong/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# gong

Gong API for searching calls, transcripts.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [gong](https://github.com/openclaw/skills/tree/main/skills/jdrhyne/gong/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Gong

Access Gong conversation intelligence - calls, transcripts, users, and analytics.

## Setup

Store credentials in `~/.config/gong/credentials.json`:
```json
{
  "base_url": "https://us-XXXXX.api.gong.io",
  "access_key": "YOUR_ACCESS_KEY",
  "secret_key": "YOUR_SECRET_KEY"
}
```

Get credentials from Gong: Settings → Ecosystem → API → Create API Key.

## Authentication

```bash
GONG_CREDS=~/.config/gong/credentials.json
GONG_BASE=$(jq -r '.base_url' $GONG_CREDS)
GONG_AUTH=$(jq -r '"\(.access_key):\(.secret_key)"' $GONG_CREDS | base64)

curl -s "$GONG_BASE/v2/endpoint" \
  -H "Authorization: Basic $GONG_AUTH" \
  -H "Content-Type: application/json"
```

## Core Operations

### List Users
```bash
curl -s "$GONG_BASE/v2/users" -H "Authorization: Basic $GONG_AUTH" | \
  jq '[.users[] | {id, email: .emailAddress, name: "\(.firstName) \(.lastName)"}]'
```

### List Calls (with date range)
```bash
curl -s -X POST "$GONG_BASE/v2/calls/extensive" \
  -H "Authorization: Basic $GONG_AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "fromDateTime": "2025-01-01T00:00:00Z",
      "toDateTime": "2025-01-31T23:59:59Z"
    },
    "contentSelector": {}
  }' | jq '{
    total: .records.totalRecords,
    calls: [.calls[] | {
      id: .metaData.id,
      title: .metaData.title,
      started: .metaData.started,
      duration_min: ((.metaData.duration // 0) / 60 | floor),
      url: .metaData.url
    }]
  }'
```

### Get Call Transcript
```bash
curl -s -X POST "$GONG_BASE/v2/calls/transcript" \
  -H "Authorization: Basic $GONG_AUTH" \
  -H "Content-Type: application/json" \
  -d '{"filter": {"callIds": ["CALL_ID"]}}' | \
  jq '.callTranscripts[0].transcript[] | "\(.speakerName // "Speaker"): \(.sentences[].text)"' -r
```

### Get Call Details
```bash
curl -s -X POST "$GONG_BASE/v2/calls/extensive" \
  -H "Authorization: Basic $GONG_AUTH" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {"callIds": ["CALL_ID"]},
    "contentSelector": {
