---
name: agentmemory
description: End-to-end encrypted cloud memory for AI agents. 100GB free storage.
homepage: https://github.com/openclaw/skills/tree/main/skills/badaramoni/agentmemory/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# agentmemory

End-to-end encrypted cloud memory for AI agents. 100GB free storage.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [agentmemory](https://github.com/openclaw/skills/tree/main/skills/badaramoni/agentmemory/SKILL.md)
- **Security Status**: SAFE

## Instructions

# AgentMemory 🧠

**End-to-end encrypted** cloud memory for AI agents. 100GB free storage. Store memories, files, photos, docs, and secrets securely.

## Why AgentMemory?

**The Problem:** Your local `MEMORY.md` files get lost, can't be searched semantically, aren't encrypted, and don't sync across sessions or devices.

**The Solution:** AgentMemory stores your memories in the cloud with end-to-end encryption, vector embeddings, 100GB storage, and auto-sync.

| Feature | Local MEMORY.md | AgentMemory |
|---------|-----------------|-------------|
| Security | ❌ No encryption | ✅ **End-to-end encrypted** |
| Storage | ❌ Limited by disk | ✅ **100GB free storage** |
| File support | ❌ Text only | ✅ Photos, docs, videos, audio |
| Secrets vault | ❌ None | ✅ Encrypted API keys & credentials |
| Auto-sync | ❌ Manual | ✅ Syncs on every command |
| Survives restarts | ❌ Often lost | ✅ Always persisted |
| Semantic search | ❌ Keyword only | ✅ AI-powered meaning search |
| Cross-device sync | ❌ Local only | ✅ Cloud-synced |
| Heartbeat tracking | ❌ None | ✅ Online status & monitoring |

## Skill Files

| File | URL |
|------|-----|
| **SKILL.md** (this file) | `https://agentmemory.cloud/skill.md` |
| **package.json** (metadata) | `https://agentmemory.cloud/skill.json` |

**Install locally:**
```bash
mkdir -p ~/.moltbot/skills/agentmemory
curl -s https://agentmemory.cloud/skill.md > ~/.moltbot/skills/agentmemory/SKILL.md
```

**Or just read from the URL above!**

## CLI Tool (v1.3)

For easier integration, install our CLI:

```bash
# Install via npm
npm install -g agentmemory-cli

# Setup (auto-syncs everything!)
agentmemory init
```

**All commands auto-sync!** Just use it - data stays in sync automatically:

```bash
# Memory operations
agentmemory store "User likes dark mode"    # Store memory (auto-syncs)
agentmemory search "preferences"             # Semantic search (auto-syncs)
agentmemory list                             # List memories (auto-syncs)

# File storage (100GB 
