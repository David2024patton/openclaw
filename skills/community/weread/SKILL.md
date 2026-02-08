---
name: weread
description: Community skill by tree
homepage: https://github.com/openclaw/skills/tree/main/skills/z233/weread/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# weread



## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [weread](https://github.com/openclaw/skills/tree/main/skills/z233/weread/SKILL.md)
- **Security Status**: SAFE

## Instructions

# weread-cli

CLI tool for fetching notes and highlights from WeChat Reading (微信读书).

## Quick Start

```bash
# Login via WeChat QR code
weread login

# List books with notes
weread list

# Get highlights from a book
weread get <bookId>
```

## Commands

### Authentication

```bash
weread login     # Open browser for QR code login
weread logout    # Clear saved cookies
weread whoami    # Check login status
```

### Fetching Data

```bash
# List all books with notes
weread list [--json]

# Get book highlights and reviews
weread get <bookId> [options]
  --json, -j       JSON output
  --highlights, -H Only show highlights
  --reviews, -R    Only show reviews
  --since, -s      Filter by date (today, yesterday, YYYY-MM-DD)

# List books from shelf (sorted by recent read time)
weread shelf [-n <limit>] [--json]
```

## Practical Examples

### 1. Get Today's/Yesterday's Notes

Fetch notes created after a specific date:

```bash
# Today's highlights from a book
weread get CB_3x2HoH --since today

# Yesterday's notes
weread get CB_3x2HoH --since yesterday

# Notes after a specific date
weread get CB_3x2HoH --since 2024-01-15
```

### 2. Export to Markdown

Export book highlights as Markdown file:

```bash
# Export highlights only
weread get CB_3x2HoH -H > notes.md

# Full export with reviews
weread get CB_3x2HoH > notes.md
```

The text output is already formatted with chapter headers (`## Chapter`) and quote markers (`>`).

### 3. JSON + jq Processing

Use JSON output for batch processing:

```bash
# Get all highlight texts
weread get CB_3x2HoH --json | jq -r '.highlights[].markText'

# Count highlights per chapter
weread get CB_3x2HoH --json | jq '.chapters | length'

# Extract book info
weread get CB_3x2HoH --json | jq '.book | {title, author}'

# List all book IDs with notes
weread list --json | jq -r '.[].bookId'

# Get total highlight count across all books
weread list --json | jq '[.[].bookmarkCount] | add'
```

### 4. Shelf Management

List and manage your bookshelf
