---
name: x-timeline-digest
description: Build a deduplicated digest from X (Twitter) For You and Following timelines using bird.
homepage: https://github.com/openclaw/skills/tree/main/skills/seandong/x-timeline-digest/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# x-timeline-digest

Build a deduplicated digest from X (Twitter) For You and Following timelines using bird.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [x-timeline-digest](https://github.com/openclaw/skills/tree/main/skills/seandong/x-timeline-digest/SKILL.md)
- **Security Status**: SAFE

## Instructions

# x-timeline-digest
## Overview
This skill uses bird to read X/Twitter timelines and build a high-signal digest.
Sources:
- For You timeline
- Following timeline
What it does:
1. Fetch recent tweets
2. Filter incrementally (avoid reprocessing)
3. Deduplicate (ID + near-duplicate text)
4. Rank and trim
5. Generate a Chinese digest
6. Output a structured payload
> Delivery (Telegram, email, etc.) is NOT handled here.
> Upstream OpenClaw workflows decide how to notify users.
---
## Configuration
All config is read from: skills.entries["x-timeline-digest"].config
### Config fields
| Name | Type | Default | Description |
|----|----|----|----|
| intervalHours | number | 6 | Interval window in hours |
| fetchLimitForYou | number | 100 | Tweets fetched from For You |
| fetchLimitFollowing | number | 60 | Tweets fetched from Following |
| maxItemsPerDigest | number | 25 | Max tweets in one digest |
| similarityThreshold | number | 0.9 | Near-duplicate similarity threshold |
| statePath | string | ~/.openclaw/state/x-timeline-digest.json | State file path |
---
## Dependencies
- bird must be installed and available in PATH
- bird must already be authenticated (cookie login)
- Read-only usage

## Usage

### 1. Basic (Raw JSON)
Run the digest generator to get a clean, deduplicated JSON payload:
```bash
node skills/x-timeline-digest/digest.js
```

### 2. Intelligent Digest (Recommended)
To generate the "Smart Brief" (Categorized, Summarized, Denoised):
1. Run the script: `node skills/x-timeline-digest/digest.js > digest.json`
2. Read the prompt template: `read skills/x-timeline-digest/PROMPT.md`
3. Send the prompt to your LLM, injecting the content of `digest.json` where `{{JSON_DATA}}` is.

*Note: The script automatically applies heuristic filtering (removes "gm", ads, short spam) before outputting JSON.*

## Bird Commands Used
For You timeline:
bird home -n <N> --json
Following timeline:
bird home --following -n <N> --json
---
## State Management
State is persisted to statePat
