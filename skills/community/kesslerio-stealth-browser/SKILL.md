---
name: kesslerio-stealth-browser
description: Anti-bot browser automation using Camoufox and Nodriver.
homepage: https://github.com/openclaw/skills/tree/main/skills/kesslerio/kesslerio-stealth-browser/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# kesslerio-stealth-browser

Anti-bot browser automation using Camoufox and Nodriver.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [kesslerio-stealth-browser](https://github.com/openclaw/skills/tree/main/skills/kesslerio/kesslerio-stealth-browser/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Stealth Browser Skill 🥷

Anti-bot browser automation that bypasses Cloudflare Turnstile, Datadome, and aggressive fingerprinting.

## When to Use

- Standard Playwright/Selenium gets blocked
- Site shows Cloudflare challenge or "checking your browser"
- Need to scrape Airbnb, Yelp, or similar protected sites
- `playwright-stealth` isn't working anymore

## Tool Selection

| Target Difficulty | Tool | When to Use |
|------------------|------|-------------|
| **Browser** | Camoufox | All protected sites - Cloudflare, Datadome, Yelp, Airbnb |
| **API Only** | curl_cffi | No browser needed, just TLS spoofing |

## Quick Start

All scripts run in `pybox` distrobox for isolation.

⚠️ **Use `python3.14` explicitly** - pybox may have multiple Python versions with different packages installed.

### 1. Setup (First Time)

```bash
# Install tools in pybox (use python3.14)
distrobox-enter pybox -- python3.14 -m pip install camoufox curl_cffi

# Camoufox browser downloads automatically on first run (~700MB Firefox fork)
```

### 2. Fetch a Protected Page

**Browser (Camoufox):**
```bash
distrobox-enter pybox -- python3.14 scripts/camoufox-fetch.py "https://example.com" --headless
```

**API only (curl_cffi):**
```bash
distrobox-enter pybox -- python3.14 scripts/curl-api.py "https://api.example.com/endpoint"
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     OpenClaw Agent                       │
├─────────────────────────────────────────────────────────┤
│  distrobox-enter pybox -- python3.14 scripts/xxx.py         │
├─────────────────────────────────────────────────────────┤
│                      pybox Container                     │
│         ┌─────────────┐  ┌─────────────┐               │
│         │  Camoufox   │  │  curl_cffi  │               │
│         │  (Firefox)  │  │  (TLS spoof)│               │
│         └─────────────┘  └─────────────┘               │
└─────────────────────────────────────────────────────
