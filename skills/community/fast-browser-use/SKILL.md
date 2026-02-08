---
name: fast-browser-use
description: name: fast-browser-use
homepage: https://github.com/openclaw/skills/tree/main/skills/rknoche6/fast-browser-use/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# fast-browser-use

name: fast-browser-use

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [fast-browser-use](https://github.com/openclaw/skills/tree/main/skills/rknoche6/fast-browser-use/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Fastest Browser Use

A Rust-based browser automation engine that provides a lightweight binary driving Chrome directly via CDP. It is optimized for token-efficient DOM extraction, robust session management, and speed.

![Terminal Demo](https://placehold.co/800x400/1e1e1e/ffffff?text=Terminal+Demo+Coming+Soon)

## 🧪 Recipes for Agents

### 1. Bypass "Bot Detection" via Human Emulation
Simulate mouse jitter and random delays to scrape protected sites.

```bash
fast-browser-use navigate --url "https://protected-site.com" \
  --human-emulation \
  --wait-for-selector "#content"
```

### 2. The "Deep Freeze" Snapshot
Capture the entire DOM state *and* computed styles for perfect reconstruction later.

```bash
fast-browser-use snapshot --include-styles --output state.json
```

### 3. Login & Cookie Heist
Log in manually once, then steal the session for headless automation.

**Step 1: Open non-headless for manual login**
```bash
fast-browser-use login --url "https://github.com/login" --save-session ./auth.json
```

**Step 2: Reuse session later**
```bash
fast-browser-use navigate --url "https://github.com/dashboard" --load-session ./auth.json
```

### 4. 🚜 Infinite Scroll Harvester
**Extract fresh data from infinite-scroll pages** — perfect for harvesting the latest posts, news, or social feeds.

```bash
# Harvest headlines from Hacker News (scrolls 3x, waits 800ms between)
fast-browser-use harvest \
  --url "https://news.ycombinator.com" \
  --selector ".titleline a" \
  --scrolls 3 \
  --delay 800 \
  --output headlines.json
```

**Real output** (59 unique items in ~6 seconds):
```json
[
  "Genode OS is a tool kit for building highly secure special-purpose OS",
  "Mobile carriers can get your GPS location",
  "Students using \"humanizer\" programs to beat accusations of cheating with AI",
  "Finland to end \"uncontrolled human experiment\" with ban on youth social media",
  ...
]
```

Works on any infinite scroll page: Reddit, Twitter, LinkedIn feeds, search results, e
