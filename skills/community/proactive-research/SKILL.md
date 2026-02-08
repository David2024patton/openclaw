---
name: proactive-research
description: Monitor topics of interest and proactively alert when important developments occur.
homepage: https://github.com/openclaw/skills/tree/main/skills/robbyczgw-cla/proactive-research/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# proactive-research

Monitor topics of interest and proactively alert when important developments occur.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [proactive-research](https://github.com/openclaw/skills/tree/main/skills/robbyczgw-cla/proactive-research/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Proactive Research

**Monitor what matters. Get notified when it happens.**

Proactive Research transforms your assistant from reactive to proactive by continuously monitoring topics you care about and intelligently alerting you only when something truly matters.

## Core Capabilities

1. **Topic Configuration** - Define subjects with custom parameters
2. **Scheduled Monitoring** - Automated searches at configurable intervals
3. **AI Importance Scoring** - Smart filtering: immediate alert vs digest vs ignore
4. **Contextual Summaries** - Not just links—meaningful summaries with context
5. **Weekly Digest** - Low-priority findings compiled into readable reports
6. **Memory Integration** - References your past conversations and interests

## Quick Start

```bash
# Initialize config
cp config.example.json config.json

# Add a topic
python3 scripts/manage_topics.py add "Dirac Live updates" \
  --keywords "Dirac Live,room correction,audio" \
  --frequency daily \
  --importance medium

# Test monitoring (dry run)
python3 scripts/monitor.py --dry-run

# Set up cron for automatic monitoring
python3 scripts/setup_cron.py
```

## Topic Configuration

Each topic has:

- **name** - Display name (e.g., "AI Model Releases")
- **query** - Search query (e.g., "new AI model release announcement")
- **keywords** - Relevance filters (["GPT", "Claude", "Llama", "release"])
- **frequency** - `hourly`, `daily`, `weekly`
- **importance_threshold** - `high` (alert immediately), `medium` (alert if important), `low` (digest only)
- **channels** - Where to send alerts (["telegram", "discord"])
- **context** - Why you care (for AI contextual summaries)

### Example config.json

```json
{
  "topics": [
    {
      "id": "ai-models",
      "name": "AI Model Releases",
      "query": "new AI model release GPT Claude Llama",
      "keywords": ["GPT", "Claude", "Llama", "release", "announcement"],
      "frequency": "daily",
      "importance_threshold": "high",
      "channels": ["telegram"],
 
