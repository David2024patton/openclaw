---
name: chromadb-memory
description: Long-term memory via ChromaDB with local Ollama embeddings.
homepage: https://github.com/openclaw/skills/tree/main/skills/msensintaffar/chromadb-memory/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# chromadb-memory

Long-term memory via ChromaDB with local Ollama embeddings.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [chromadb-memory](https://github.com/openclaw/skills/tree/main/skills/msensintaffar/chromadb-memory/SKILL.md)
- **Security Status**: SAFE

## Instructions

# ChromaDB Memory

Long-term semantic memory backed by ChromaDB and local Ollama embeddings. Zero cloud dependencies.

## What It Does

- **Auto-recall**: Before every agent turn, queries ChromaDB with the user's message and injects relevant context automatically
- **`chromadb_search` tool**: Manual semantic search over your ChromaDB collection
- **100% local**: Ollama (nomic-embed-text) for embeddings, ChromaDB for vector storage

## Prerequisites

1. **ChromaDB** running (Docker recommended):
   ```bash
   docker run -d --name chromadb -p 8100:8000 chromadb/chroma:latest
   ```

2. **Ollama** with an embedding model:
   ```bash
   ollama pull nomic-embed-text
   ```

3. **Indexed documents** in ChromaDB. Use any ChromaDB-compatible indexer to populate your collection.

## Install

```bash
# 1. Copy the plugin extension
mkdir -p ~/.openclaw/extensions/chromadb-memory
cp {baseDir}/scripts/index.ts ~/.openclaw/extensions/chromadb-memory/
cp {baseDir}/scripts/openclaw.plugin.json ~/.openclaw/extensions/chromadb-memory/

# 2. Get your collection ID
curl -s http://localhost:8100/api/v2/tenants/default_tenant/databases/default_database/collections | python3 -c "import json,sys; [print(f'{c[\"id\"]}  {c[\"name\"]}') for c in json.load(sys.stdin)]"

# 3. Add to your OpenClaw config (~/.openclaw/openclaw.json):
```

```json
{
  "plugins": {
    "entries": {
      "chromadb-memory": {
        "enabled": true,
        "config": {
          "chromaUrl": "http://localhost:8100",
          "collectionId": "YOUR_COLLECTION_ID",
          "ollamaUrl": "http://localhost:11434",
          "embeddingModel": "nomic-embed-text",
          "autoRecall": true,
          "autoRecallResults": 3,
          "minScore": 0.5
        }
      }
    }
  }
}
```

```bash
# 4. Restart the gateway
openclaw gateway restart
```

## Config Options

| Option | Default | Description |
|--------|---------|-------------|
| `chromaUrl` | `http://localhost:8100` | ChromaDB server URL |
| `collectionId` | *re
