---
name: firecrawl-skills
description: Community skill by tree
homepage: https://github.com/openclaw/skills/tree/main/skills/leonardogrig/firecrawl-skills/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# firecrawl-skills



## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [firecrawl-skills](https://github.com/openclaw/skills/tree/main/skills/leonardogrig/firecrawl-skills/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Firecrawl CLI

Use the `firecrawl` CLI to fetch and search the web. Firecrawl returns clean markdown optimized for LLM context windows, handles JavaScript rendering, bypasses common blocks, and provides structured data.

## Installation

Check status, auth, and rate limits:

```bash
firecrawl --status
```

Output when ready:

```
  🔥 firecrawl cli v1.0.2

  ● Authenticated via FIRECRAWL_API_KEY
  Concurrency: 0/100 jobs (parallel scrape limit)
  Credits: 500,000 remaining
```

- **Concurrency**: Max parallel jobs. Run parallel operations close to this limit but not above.
- **Credits**: Remaining API credits. Each scrape/crawl consumes credits.

If not installed: `npm install -g firecrawl-cli`

Always refer to the installation rules in [rules/install.md](rules/install.md) for more information if the user is not logged in.

## Authentication

If not authenticated, run:

```bash
firecrawl login --browser
```

The `--browser` flag automatically opens the browser for authentication without prompting.

## Organization

Create a `.firecrawl/` folder in the working directory unless it already exists to store results. Add `.firecrawl/` to the `.gitignore` file if not already there. Always use `-o` to write directly to file (avoids flooding context):

```bash
# Search the web (most common operation)
firecrawl search "your query" -o .firecrawl/search-{query}.json

# Search with scraping enabled
firecrawl search "your query" --scrape -o .firecrawl/search-{query}-scraped.json

# Scrape a page
firecrawl scrape https://example.com -o .firecrawl/{site}-{path}.md
```

Examples:

```
.firecrawl/search-react_server_components.json
.firecrawl/search-ai_news-scraped.json
.firecrawl/docs.github.com-actions-overview.md
.firecrawl/firecrawl.dev.md
```

## Commands

### Search - Web search with optional scraping

```bash
# Basic search (human-readable output)
firecrawl search "your query" -o .firecrawl/search-query.txt

# JSON output (recommended for parsing)
firecrawl search "your query
