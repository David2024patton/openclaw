---
name: better-memory
description: Semantic memory, intelligent compression, and context management for AI agents.
homepage: https://github.com/openclaw/skills/tree/main/skills/dvntydigital/better-memory/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# better-memory

Semantic memory, intelligent compression, and context management for AI agents.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [better-memory](https://github.com/openclaw/skills/tree/main/skills/dvntydigital/better-memory/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Better Memory

Semantic memory, intelligent compression, and context management for AI agents.

## What It Does

- Stores memories with real vector embeddings (local, no API calls)
- Semantic search via cosine similarity
- Auto-deduplicates on store (exact + semantic)
- Priority-based compression when approaching context limits
- Identity persistence across sessions
- Token-budget-aware memory retrieval
- Configurable context limits, thresholds, and summarizer

## Quick Start

```javascript
import { createContextGuardian } from 'context-guardian';

const cg = createContextGuardian({
  contextLimit: 128000,
  summarizer: async (text) => myLLM.summarize(text), // optional
});
await cg.initialize();

// Store (auto-deduplicates)
await cg.store('User prefers TypeScript', { priority: 9 });

// Search
const results = await cg.search('programming preferences');

// Get memories within token budget
const { memories, tokensUsed } = await cg.getRelevantContext('query', 4000);

// Compress conversation and store important parts
const { compressed } = await cg.summarizeAndStore(messages);
```
