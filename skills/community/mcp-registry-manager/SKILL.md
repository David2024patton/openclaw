---
name: mcp-registry-manager
description: Centralized discovery and quality scoring for the exploding MCP (Model Context Protocol) ecosystem.
homepage: https://github.com/openclaw/skills/tree/main/skills/orosha-ai/mcp-registry-manager/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# mcp-registry-manager

Centralized discovery and quality scoring for the exploding MCP (Model Context Protocol) ecosystem.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [mcp-registry-manager](https://github.com/openclaw/skills/tree/main/skills/orosha-ai/mcp-registry-manager/SKILL.md)
- **Security Status**: SAFE

## Instructions

---|--------|-----------|
| awesome-mcp-servers | Curated list | Manual discovery |
| GitHub Search | Repos with `mcp-server` topic | Fresh discoveries |
| AllInOneMCP | API registry | Centralized metadata |
| Klavis AI | MCP integrations | Production services |

## Categories

- **Files** — Filesystem, storage, S3
- **Databases** — PostgreSQL, MongoDB, Redis, SQLite
- **APIs** — HTTP, GraphQL, REST
- **Dev Tools** — Git, Docker, CI/CD
- **Media** — Image processing, video, audio
- **Communication** — Email, Slack, Discord
- **Utilities** — Time, crypto, encryption

## Architecture

```
┌─────────────────┐
│  Discovery      │  ← awesome-mcp, GitHub, AllInOneMCP
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Registry DB    │  ← SQLite/PostgreSQL with metadata
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Quality Scorer │  ← Test coverage, docs, maintenance
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Semantic Search│  ← Embeddings + vector search
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CLI Interface  │  ← Install/uninstall/update
└─────────────────┘
```

## Requirements

- Python 3.9+
- requests (for GitHub API)
- sentence-transformers (for semantic search)
- numpy/pandas (for scoring)

## Installation

```bash
# Clone repo
git clone https://github.com/orosha-ai/mcp-registry-manager

# Install dependencies
pip install requests sentence-transformers numpy pandas

# Run discovery
python3 scripts/mcp-registry.py --discover
```

## Inspiration

- **MCP Server Stack guide** — Essential servers list
- **awesome-mcp-servers** — Community-curated directory
- **AllInOneMCP** — Remote MCP registry
- **Klavis AI** — MCP integration platform

## Local-Only Promise

- Registry metadata is cached locally
- Install operations run locally
- No telemetry or data sent to external services

## Version History

- **v0.1** — MVP: Discovery, quality scoring, semantic search
- Roadmap: GitHub integration, CI 
