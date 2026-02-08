---
name: topic-monitor
description: Monitor topics of interest and proactively alert when important developments occur.
homepage: https://github.com/openclaw/skills/tree/main/skills/robbyczgw-cla/topic-monitor/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# topic-monitor

Monitor topics of interest and proactively alert when important developments occur.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [topic-monitor](https://github.com/openclaw/skills/tree/main/skills/robbyczgw-cla/topic-monitor/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Topic Monitor

**Monitor what matters. Get notified when it happens.**

Topic Monitor transforms your assistant from reactive to proactive by continuously monitoring topics you care about and intelligently alerting you only when something truly matters.

---

## ⚡ Quick Start (New in v1.2.0!)

**Just want to monitor one topic? One command:**

```bash
python3 scripts/quick.py "AI Model Releases"
```

That's it! This creates a topic with sensible defaults:
- **Query:** Auto-generated from topic name
- **Keywords:** Extracted from topic name
- **Frequency:** Daily
- **Importance:** Medium
- **Channel:** Telegram

### Quick Start Options

```bash
# Basic - just a topic name
python3 scripts/quick.py "Bitcoin Price"

# With keywords
python3 scripts/quick.py "Security CVEs" --keywords "CVE,vulnerability,critical"

# High priority, hourly checks
python3 scripts/quick.py "Production Alerts" --frequency hourly --importance high

# Custom query
python3 scripts/quick.py "Competitor News" --query "CompanyName product launch funding"

# Different channel
python3 scripts/quick.py "Team Updates" --channel discord
```

### Quick Start vs Full Setup

| Feature | Quick Start | Full Setup |
|---------|-------------|------------|
| Speed | ⚡ 1 command | 📝 Wizard |
| Defaults | Smart | Customizable |
| Use case | Single topic | Multiple topics |
| Configuration | Minimal | Full control |

**After Quick Start, you can always customize:**
```bash
python3 scripts/manage_topics.py edit ai-model-releases --frequency hourly
```

---

## Core Capabilities

1. **Topic Configuration** - Define subjects with custom parameters
2. **Scheduled Monitoring** - Automated searches at configurable intervals
3. **AI Importance Scoring** - Smart filtering: immediate alert vs digest vs ignore
4. **Contextual Summaries** - Not just links—meaningful summaries with context
5. **Weekly Digest** - Low-priority findings compiled into readable reports
6. **Memory Integration** - References your past conversations
