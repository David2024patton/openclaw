---
name: solobuddy
description: Build-in-public companion for indie hackers — content workflow, Twitter engagement.
homepage: https://github.com/openclaw/skills/tree/main/skills/humanji7/solobuddy/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# solobuddy

Build-in-public companion for indie hackers — content workflow, Twitter engagement.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [solobuddy](https://github.com/openclaw/skills/tree/main/skills/humanji7/solobuddy/SKILL.md)
- **Security Status**: SAFE

## Instructions

# SoloBuddy

Build-in-public content assistant. A living companion, not a tool.

## Quick Start

1. Set your data path in `~/.clawdbot/clawdbot.json`:
```json
{
  "solobuddy": {
    "dataPath": "~/projects/my-bip-folder",
    "voice": "jester-sage"
  }
}
```

2. Create folder structure (replace path with your own):
```bash
mkdir -p ~/projects/my-bip-folder/ideas ~/projects/my-bip-folder/drafts ~/projects/my-bip-folder/data
touch ~/projects/my-bip-folder/ideas/backlog.md
```

3. Start using: "show backlog", "new idea", "generate post"

## Placeholders

ClawdBot automatically replaces these in commands:
- `{dataPath}` → your configured `solobuddy.dataPath`
- `{baseDir}` → skill installation folder

## Data Structure

All data in `{dataPath}`:
- `ideas/backlog.md` — idea queue
- `ideas/session-log.md` — session captures
- `drafts/` — work in progress
- `data/my-posts.json` — published posts
- `data/activity-snapshot.json` — project activity (updated hourly)

## Voice Profiles

Configure in `solobuddy.voice`. Available:

| Voice | Description |
|-------|-------------|
| `jester-sage` | Ironic, raw, philosophical (default) |
| `technical` | Precise, detailed, structured |
| `casual` | Friendly, conversational |
| `custom` | Use `{dataPath}/voice.md` |

See `{baseDir}/prompts/profile.md` for voice details.

## Modules

### Content Generation
Core workflow: backlog → draft → publish.
See `{baseDir}/prompts/content.md` for rules.

### Twitter Expert
Content strategy for X/Twitter with 2025 algorithm insights.
See `{baseDir}/modules/twitter-expert.md`

### Twitter Monitor (optional)
Proactive engagement — monitors watchlist, suggests comments.
Requires: `bird` CLI. See `{baseDir}/modules/twitter-monitor.md`

### Soul Wizard
Create project personality from documentation.
See `{baseDir}/references/soul-wizard.md`

## Commands

### Backlog

Show ideas:
```bash
cat {dataPath}/ideas/backlog.md
```

Add idea:
```bash
echo "- [ ] New idea text" >> {dataPath}/ideas/backlog.md
```

#
