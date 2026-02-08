---
name: hass-cli
description: Control Home Assistant devices and automations via hass-cli.
homepage: https://github.com/openclaw/skills/tree/main/skills/ericarnoldy/hass-cli/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# hass-cli

Control Home Assistant devices and automations via hass-cli.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [hass-cli](https://github.com/openclaw/skills/tree/main/skills/ericarnoldy/hass-cli/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Home Assistant CLI

Control Home Assistant via `hass-cli`.

## Install

```bash
# macOS (Homebrew)
brew install homeassistant-cli

# pip (any platform)
pip install homeassistant-cli

# Verify
hass-cli --version
```

## Setup

### 1. Find Your Home Assistant URL

Common URLs (try in order):
- `http://homeassistant.local:8123` — Default mDNS hostname
- `http://homeassistant:8123` — If using Docker/hostname
- `http://<IP-ADDRESS>:8123` — Direct IP (e.g., `http://192.168.1.100:8123`)
- `https://your-instance.ui.nabu.casa` — If using Nabu Casa cloud

Test it: open the URL in a browser — you should see the HA login page.

### 2. Create a Long-Lived Access Token

1. Open Home Assistant in your browser
2. Click your **profile** (bottom-left of the sidebar, your name/icon)
3. Scroll down to **Long-Lived Access Tokens**
4. Click **Create Token**
5. Give it a name (e.g., "Clawdbot" or "CLI")
6. **Copy the token immediately** — you won't see it again!

The token looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3...`

### 3. Configure Environment Variables

Add to your shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
export HASS_SERVER="http://homeassistant.local:8123"
export HASS_TOKEN="your-token-here"
```

Or for Clawdbot, store credentials in TOOLS.md:
```markdown
## Home Assistant
- **URL:** `http://homeassistant.local:8123`
- **Token:** `eyJ...your-token...`
```

Then reference TOOLS.md before making calls.

## Quick Reference

```bash
# List all entities
hass-cli state list

# Filter entities (pipe to grep)
hass-cli state list | grep -i kitchen

# Get specific entity state
hass-cli state get light.kitchen

# Turn on/off
hass-cli service call switch.turn_on --arguments entity_id=switch.fireplace
hass-cli service call switch.turn_off --arguments entity_id=switch.fireplace
hass-cli service call light.turn_on --arguments entity_id=light.kitchen
hass-cli service call light.turn_off --arguments entity_id=light.kitchen

# Light brightness (0-255)
hass-cli service call 
