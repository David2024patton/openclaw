---
name: servicenow-docs
description: Search and retrieve ServiceNow documentation, release notes.
homepage: https://github.com/openclaw/skills/tree/main/skills/thesethrose/servicenow-docs/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# servicenow-docs

Search and retrieve ServiceNow documentation, release notes.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [servicenow-docs](https://github.com/openclaw/skills/tree/main/skills/thesethrose/servicenow-docs/SKILL.md)
- **Security Status**: SAFE

## Instructions

# ServiceNow Documentation Skill

Search and retrieve documentation from docs.servicenow.com and developer.servicenow.com. This skill provides access to ServiceNow's release notes, platform documentation, and developer-focused API references and guides.

## When to Use

Use this skill when the user asks about:
- ServiceNow API documentation (GlideRecord, GlideAjax, GlideQuery, etc.)
- Release notes, patches, or new features
- Platform configuration or administration
- Scripting patterns or best practices
- Accessibility, UI, or user preferences
- Any ServiceNow product or feature documentation
- Developer topics like openFrameAPI, ScriptLoader, spContextManager, or mobile APIs

## Tools

### servicenow_search
Search the ServiceNow documentation database.

**Args:**
- `query` (string, required) - Search terms (e.g., "GlideRecord", "accessibility preferences", "patch notes")
- `limit` (number, default: 10) - Maximum results to return
- `version` (string, optional) - Filter by version (e.g., "Washington DC", "Zurich", "Yokohama")

**Example:**
```json
{"query": "GlideAjax client script", "limit": 5}
```

### servicenow_get_article
Fetch the full content of a documentation article.

**Args:**
- `url` (string, required) - The article URL (automatically converted from Zoomin to docs.servicenow.com)

**Example:**
```json
{"url": "https://docs.servicenow.com/bundle/zurich-release-notes/page/release-notes/quality/zurich-patch-5.html"}
```

### servicenow_list_versions
List available ServiceNow documentation versions/releases.

**Args:** None required

### servicenow_latest_release
Get release notes for the latest ServiceNow version (automatically detects most recent).

**Args:** None required

### servicenow_dev_suggest
Get autocomplete suggestions from ServiceNow Developer Documentation.

**Args:**
- `term` (string, required) - Partial search term (e.g., "Gli", "openFrame", "spCon")

**Example:**
```json
{"term": "openFrame"}
```

### servicenow_dev_search
Search ServiceNow
