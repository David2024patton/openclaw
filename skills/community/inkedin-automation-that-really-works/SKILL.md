---
name: inkedin-automation-that-really-works
description: LinkedIn automation — post, comment (with @mentions), edit/delete comments, repost, read feed, analytics.
homepage: https://github.com/openclaw/skills/tree/main/skills/red777777/inkedin-automation-that-really-works/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# inkedin-automation-that-really-works

LinkedIn automation — post, comment (with @mentions), edit/delete comments, repost, read feed, analytics.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [inkedin-automation-that-really-works](https://github.com/openclaw/skills/tree/main/skills/red777777/inkedin-automation-that-really-works/SKILL.md)
- **Security Status**: SAFE

## Instructions

# LinkedIn Automation

> **Author:** Community Contributors
>
> ⚠️ **DISCLAIMER — PERSONAL USE ONLY**
> This skill is provided for **personal, non-commercial use only**. It automates your own LinkedIn account for personal productivity and engagement. Do NOT use this skill for spam, mass outreach, scraping other users' data, or any commercial automation service. Use responsibly and in accordance with [LinkedIn's User Agreement](https://www.linkedin.com/legal/user-agreement). The author assumes no liability for misuse or account restrictions.

Automate LinkedIn interactions via headless Playwright browser with a persistent session.

## Prerequisites

- Python 3.10+ with Playwright installed (`pip install playwright && playwright install chromium`)
- A logged-in LinkedIn browser session (persistent Chromium profile)
- Adjust paths in `scripts/lib/browser.py` to match your setup

## Commands

```bash
CLI={baseDir}/scripts/linkedin.py

# Check if session is valid
python3 $CLI check-session

# Read feed
python3 $CLI feed --count 5

# Create a post (text only)
python3 $CLI post --text "Hello world"

# Create a post with image (handles LinkedIn's image editor modal automatically)
python3 $CLI post --text "Hello world" --image /path/to/image.png

# Comment on a post (supports @Mentions — see below)
python3 $CLI comment --url "https://linkedin.com/feed/update/..." --text "Great insight @Betina Weiler!"

# Edit a comment (match by text fragment)
python3 $CLI edit-comment --url "https://..." --match "old text" --text "new text"

# Delete a comment
python3 $CLI delete-comment --url "https://..." --match "text to identify"

# Repost with thoughts
python3 $CLI repost --url "https://..." --thoughts "My take..."

# Engagement analytics for recent posts
python3 $CLI analytics --count 10

# Profile-level stats (followers, views)
python3 $CLI profile-stats

# Monitor your likes for new ones (for comment suggestions)
python3 $CLI scan-likes --count 15

# Scrape someone's activity
python
