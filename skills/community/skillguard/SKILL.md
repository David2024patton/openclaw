---
name: skillguard
description: Security scanner for AgentSkill packages.
homepage: https://github.com/openclaw/skills/tree/main/skills/c-goro/skillguard/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# skillguard

Security scanner for AgentSkill packages.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [skillguard](https://github.com/openclaw/skills/tree/main/skills/c-goro/skillguard/SKILL.md)
- **Security Status**: SAFE

## Instructions

# SkillGuard — Agent Security Scanner

When asked to check, audit, or scan a skill for security, use SkillGuard.

## Commands

### Scan a local skill directory
```bash
node /home/claw/.openclaw/workspace/skillguard/src/cli.js scan <path>
```

### Scan with compact output (for chat)
```bash
node /home/claw/.openclaw/workspace/skillguard/src/cli.js scan <path> --compact
```

### Check text for prompt injection
```bash
node /home/claw/.openclaw/workspace/skillguard/src/cli.js check "<text>"
```

### Batch scan multiple skills
```bash
node /home/claw/.openclaw/workspace/skillguard/src/cli.js batch <directory>
```

### Scan a ClawHub skill by slug
```bash
node /home/claw/.openclaw/workspace/skillguard/src/cli.js scan-hub <slug>
```

## Score Interpretation
- 80-100 ✅ LOW risk — safe to install
- 50-79 ⚠️ MEDIUM — review findings before installing
- 20-49 🟠 HIGH — significant security concerns
- 0-19 🔴 CRITICAL — do NOT install without manual review

## Output Formats
- Default: full text report
- `--compact`: chat-friendly summary
- `--json`: machine-readable full report
- `--quiet`: score and verdict only
