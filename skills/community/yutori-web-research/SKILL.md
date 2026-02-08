---
name: yutori-web-research
description: Use Yutori’s Research API and Browsing API (cloud browser) to research topics, collect sources.
homepage: https://github.com/openclaw/skills/tree/main/skills/juanpin/yutori-web-research/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# yutori-web-research

Use Yutori’s Research API and Browsing API (cloud browser) to research topics, collect sources.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [yutori-web-research](https://github.com/openclaw/skills/tree/main/skills/juanpin/yutori-web-research/SKILL.md)
- **Security Status**: SAFE

## Instructions

# yutori-web-research

Use Yutori’s cloud agents for two things:

1) **Research** (wide/deep web research + citations) via `POST /v1/research/tasks`
2) **Browsing** (web navigation agent on a cloud browser) via `POST /v1/browsing/tasks`

This skill is for **web tasks** where a dedicated web agent is helpful (papers, competitors, product info, extracting lists from a site), and where OpenClaw’s local `web_fetch` or `browser` tool is not ideal.

## Preconditions (auth + endpoint)

- Requires **YUTORI_API_KEY** (preferred: provided by OpenClaw Gateway env; fallback: `~/.openclaw/openclaw.json` at `env.YUTORI_API_KEY`).
- Endpoint defaults to **dev** unless overridden:
  - Set `YUTORI_API_BASE=https://api.dev.yutori.com` (dev)
  - or `YUTORI_API_BASE=https://api.yutori.com` (prod)

If requests return `403 Forbidden`, the key likely lacks access to the requested API product (Research/Browsing).

## Bundled runner scripts

This skill expects a small Node runner script to exist (or be bundled alongside this skill):

- `yutori-research.mjs` — create + poll a research task; prints **pretty text** output.

Recommended: bundle it under `scripts/yutori-research.mjs` in this skill folder.

## Workflow: Research a topic (brief + reading list)

When the user asks for research (example: “RL papers in the last month”):

1) Write a tight query prompt that requests:
   - **1-page brief** (themes + trends)
   - **curated reading list** (10–15 items, each with title, 1–2 sentence summary, why it matters, and link)
   - Prefer primary sources (arXiv + publisher pages)

2) Run the research task using the runner script (example):

```bash
cd /Users/juanpin/.openclaw/workspace
node yutori-research.mjs "Research reinforcement learning papers from the last 30 days. Output (1) a concise 1-page brief of themes/trends and (2) a curated list of 12 papers with title, 2-sentence summary, why it matters, and a link. Prefer arXiv + conference links."
```

3) Return results to the user as **clean bull
