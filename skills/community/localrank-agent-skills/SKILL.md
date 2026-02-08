---
name: localrank-agent-skills
description: Track local rankings, run SEO audits, and manage agency clients using LocalRank
homepage: https://github.com/openclaw/skills/tree/main/skills/peterw/localrank-agent-skills/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# localrank-agent-skills

Track local rankings, run SEO audits, and manage agency clients using LocalRank

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [localrank-agent-skills](https://github.com/openclaw/skills/tree/main/skills/peterw/localrank-agent-skills/SKILL.md)
- **Security Status**: SAFE

## Instructions

# LocalRank Skill

Track local rankings, run SEO audits, and manage agency clients using LocalRank.

**Last updated:** 2026-01-30

> Freshness check: If more than 30 days have passed since the last-updated date above, inform the user that this skill may be outdated and point them to the update options below.

## Keeping This Skill Updated

**Source:** github.com/peterw/localrank-agent-skills
**API docs:** app.localrank.so/settings/api

| Installation | How to update |
|-------------|---------------|
| CLI (npx skills) | `npx skills update` |
| Claude Code plugin | `/plugin update localrank@localrank-skills` |
| Cursor | Remote rules auto-sync from GitHub |
| Manual | Pull latest from repo or re-copy skills/localrank/ |

---

## Setup

Before using this skill, ensure:

1. **API Key:** Run the setup command to configure your API key securely
   - Get your key at https://app.localrank.so/settings/api
   - Run: `<skill-path>/scripts/localrank.js setup`
   - Or set environment variable: `export LOCALRANK_API_KEY=lr_your_key`

2. **Requirements:** Node.js 18+ (uses built-in fetch). No other dependencies needed.

**Config priority (highest to lowest):**
1. `LOCALRANK_API_KEY` environment variable
2. `./.localrank/config.json` (project-local)
3. `~/.config/localrank/config.json` (user-global)

### Handling "API key not found" errors

**CRITICAL:** When you receive an "API key not found" error:

1. **Tell the user to run setup** - The setup is interactive. Recommend they run:
   ```
   <skill-path>/scripts/localrank.js setup
   ```

2. **Stop and wait** - Do not continue with tasks. Wait for the user to complete setup.

**DO NOT** attempt to search for API keys in other locations or guess credentials.

---

## What LocalRank Does

LocalRank helps local SEO agencies track and improve Google Business Profile rankings:

- **Rank Tracking:** Visual grid maps showing where businesses rank across a geographic area
- **GMB Audits:** Analyze any Google Business Profile for issues an
