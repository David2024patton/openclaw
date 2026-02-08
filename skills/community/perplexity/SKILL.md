---
name: perplexity
description: Search the web with AI-powered answers via Perplexity API.
homepage: https://github.com/openclaw/skills/tree/main/skills/zats/perplexity/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# perplexity

Search the web with AI-powered answers via Perplexity API.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [perplexity](https://github.com/openclaw/skills/tree/main/skills/zats/perplexity/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Perplexity Search

AI-powered web search that returns grounded answers with citations.

## Search

Single query:
```bash
node {baseDir}/scripts/search.mjs "what's happening in AI today"
```

Multiple queries (batch):
```bash
node {baseDir}/scripts/search.mjs "What is Perplexity?" "Latest AI news" "Best coffee in NYC"
```

## Options

- `--json`: Output raw JSON response

## Notes

- Requires `PERPLEXITY_API_KEY` environment variable
- Responses include citations when available
- Batch queries are processed in a single API call
