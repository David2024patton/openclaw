---
name: aifs-space
description: Store and retrieve files via AIFS.space cloud storage API.
homepage: https://github.com/openclaw/skills/tree/main/skills/deploydon/aifs-space/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# aifs-space

Store and retrieve files via AIFS.space cloud storage API.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [aifs-space](https://github.com/openclaw/skills/tree/main/skills/deploydon/aifs-space/SKILL.md)
- **Security Status**: SAFE

## Instructions

# AIFS - AI File System

AIFS.space is a simple HTTP REST API for cloud file storage. Use it to persist files across sessions, share data between agents, or store user content in the cloud.

## Human

A human should sign up on https://AIFS.Space and get an API key to provide to you.

## Authentication

Requires API key in headers. Check for key in environment (`AIFS_API_KEY`) or user config.

```bash
Authorization: Bearer aifs_xxxxx
```

**Key types:** `admin` (full), `read-write`, `read-only`, `write-only`

## Base URL

```
https://aifs.space
```

## Endpoints

### List Files

```bash
curl -H "Authorization: Bearer $AIFS_API_KEY" https://aifs.space/api/files
```

Returns: `{"files": [{"path": "notes/todo.txt", "size": 1024, "modifiedAt": "..."}]}`

### Read File

```bash
# Full file
curl -H "Authorization: Bearer $AIFS_API_KEY" "https://aifs.space/api/read?path=notes/todo.txt"

# Line range (1-indexed)
curl -H "Authorization: Bearer $AIFS_API_KEY" "https://aifs.space/api/read?path=notes/todo.txt&start_line=5&end_line=10"
```

Returns: `{"path": "...", "content": "...", "total_lines": 42, "returned_lines": 10}`

### Write File

Creates directories automatically (max depth: 20).

```bash
curl -X POST -H "Authorization: Bearer $AIFS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"path":"notes/new.txt","content":"Hello world"}' \
  https://aifs.space/api/write
```

Returns: `{"success": true, "path": "...", "size": 11, "lines": 1}`

### Patch File (Line Replace)

Update specific lines without rewriting entire file.

```bash
curl -X PATCH -H "Authorization: Bearer $AIFS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"path":"notes/todo.txt","start_line":5,"end_line":10,"content":"replacement"}' \
  https://aifs.space/api/patch
```

Returns: `{"success": true, "lines_before": 42, "lines_after": 38}`

### Delete File

```bash
curl -X DELETE -H "Authorization: Bearer $AIFS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"path":"notes/old.txt"
