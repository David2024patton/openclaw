---
name: byterover
description: Manages project knowledge using ByteRover context tree.
homepage: https://github.com/openclaw/skills/tree/main/skills/byteroverinc/byterover/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# byterover

Manages project knowledge using ByteRover context tree.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [byterover](https://github.com/openclaw/skills/tree/main/skills/byteroverinc/byterover/SKILL.md)
- **Security Status**: SAFE

## Instructions

# ByteRover Context Tree

A project-level knowledge repository that persists across sessions. Use it to avoid re-discovering patterns, conventions, and decisions.

## Why Use ByteRover

- **Query before working**: Get existing knowledge about patterns, conventions, and past decisions before implementing
- **Curate after learning**: Capture insights, decisions, and bug fixes so future sessions start informed

## Quick Reference

| Command | When | Example |
|---------|------|---------|
| `brv query "question"` | Before starting work | `brv query "How is auth implemented?"` |
| `brv curate "context" -f file` | After completing work | `brv curate "JWT 24h expiry" -f auth.ts` |
| `brv status` | To check prerequisites | `brv status` |

## When to Use

**Query** when you need to understand something:
- "How does X work in this codebase?"
- "What patterns exist for Y?"
- "Are there conventions for Z?"

**Curate** when you learned or created something valuable:
- Implemented a feature using specific patterns
- Fixed a bug and found root cause
- Made an architecture decision

## Curate Quality

Context must be **specific** and **actionable**:

```bash
# Good - specific, explains where and why
brv curate "Auth uses JWT 24h expiry, tokens in httpOnly cookies" -f src/auth.ts

# Bad - too vague
brv curate "Fixed auth"
```

**Note:** Context argument must come before `-f` flags. Max 5 files.

## Best Practices

1. **Break down large contexts** - Run multiple `brv curate` commands for complex topics rather than one massive context. Smaller chunks are easier to retrieve and update.

2. **Let ByteRover read files** - Don't read files yourself before curating. Use `-f` flags to let ByteRover read them directly:
   ```bash
   # Good - ByteRover reads the files
   brv curate "Auth implementation details" -f src/auth.ts -f src/middleware/jwt.ts

   # Wasteful - reading files twice
   # [agent reads files] then brv curate "..." -f same-files
   ```

3. **Be specific in queries** - Querie
