---
name: agent-docs
description: Create documentation optimized for AI agent consumption.
homepage: https://github.com/openclaw/skills/tree/main/skills/tylervovan/agent-docs/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# agent-docs

Create documentation optimized for AI agent consumption.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [agent-docs](https://github.com/openclaw/skills/tree/main/skills/tylervovan/agent-docs/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Agent Docs

Write documentation that AI agents can efficiently consume. Based on Vercel benchmarks and industry standards (AGENTS.md, llms.txt, CLAUDE.md).

## The Hybrid Context Hierarchy

Three-layer architecture for optimal agent performance:

### Layer 1: Constitution (Inline)
**Always in context.** 2,000–4,000 tokens max.

```markdown
# AGENTS.md
> Context: Next.js 16 | Tailwind | Supabase

## 🚨 CRITICAL
- NO SECRETS in output
- Use `app/` directory ONLY

## 📚 DOCS INDEX (use read_file)
- Auth: `docs/auth/llms.txt`
- DB: `docs/db/schema.md`
```

**Include:**
- Security rules, architecture constraints
- Build/test/lint commands (top for primacy bias)
- Documentation map (where to find more)

### Layer 2: Reference Library (Local Retrieval)
**Fetched on demand.** 1K–5K token chunks.

- Framework-specific guides
- Detailed style guides
- API schemas

### Layer 3: Research Assistant (External)
**Gated by allow-lists.** Edge cases only.

- Latest library updates
- Stack Overflow for obscure errors
- Third-party llms.txt

## Why This Works

**Vercel Benchmark (2026):**
| Approach | Pass Rate |
|----------|-----------|
| Tool-based retrieval | 53% |
| Retrieval + prompting | 79% |
| **Inline AGENTS.md** | **100%** |

**Root cause:** Meta-cognitive failure. Agents don't know what they don't know—they assume training data is sufficient. Inline docs bypass this entirely.

## Core Principles

### 1. Compressed Index > Full Docs

An 8KB compressed index outperforms a 40KB full dump.

**Compress to:**
- File paths (where code lives)
- Function signatures (names + types only)
- Negative constraints ("Do NOT use X")

### 2. Structure for Chunking

RAG systems split at headers. Each section must be self-contained:

```markdown
## Database Setup          ← Chunk boundary

Prerequisites: PostgreSQL 14+

1. Create database...
```

**Rules:**
- Front-load key info (chunkers truncate)
- Descriptive headers (agents search by header text)

### 3. Inline Over Links

Agents can't aut
