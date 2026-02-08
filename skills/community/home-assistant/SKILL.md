---
name: home-assistant
description: Control Home Assistant smart home devices, run automations, and receive webhook events.
homepage: https://github.com/openclaw/skills/tree/main/skills/iahmadzain/home-assistant/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# home-assistant

Control Home Assistant smart home devices, run automations, and receive webhook events.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [home-assistant](https://github.com/openclaw/skills/tree/main/skills/iahmadzain/home-assistant/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Home Assistant

Control your smart home via Home Assistant's REST API and webhooks.

## Setup

### Option 1: Config File (Recommended)

Create `~/.config/home-assistant/config.json`:
```json
{
  "url": "https://your-ha-instance.duckdns.org",
  "token": "your-long-lived-access-token"
}
```

### Option 2: Environment Variables

```bash
export HA_URL="http://homeassistant.local:8123"
export HA_TOKEN="your-long-lived-access-token"
```

### Getting a Long-Lived Access Token

1. Open Home Assistant → Profile (bottom left)
2. Scroll to "Long-Lived Access Tokens"
3. Click "Create Token", name it (e.g., "Clawdbot")
4. Copy the token immediately (shown only once)

## Quick Reference

### List Entities

```bash
curl -s -H "Authorization: Bearer $HA_TOKEN" "$HA_URL/api/states" | jq '.[].entity_id'
```

### Get Entity State

```bash
curl -s -H "Authorization: Bearer $HA_TOKEN" "$HA_URL/api/states/light.living_room"
```

### Control Devices

```bash
# Turn on
curl -X POST -H "Authorization: Bearer $HA_TOKEN" -H "Content-Type: application/json" \
  "$HA_URL/api/services/light/turn_on" -d '{"entity_id": "light.living_room"}'

# Turn off
curl -X POST -H "Authorization: Bearer $HA_TOKEN" -H "Content-Type: application/json" \
  "$HA_URL/api/services/light/turn_off" -d '{"entity_id": "light.living_room"}'

# Set brightness (0-255)
curl -X POST -H "Authorization: Bearer $HA_TOKEN" -H "Content-Type: application/json" \
  "$HA_URL/api/services/light/turn_on" -d '{"entity_id": "light.living_room", "brightness": 128}'
```

### Run Scripts & Automations

```bash
# Trigger script
curl -X POST -H "Authorization: Bearer $HA_TOKEN" "$HA_URL/api/services/script/turn_on" \
  -H "Content-Type: application/json" -d '{"entity_id": "script.goodnight"}'

# Trigger automation
curl -X POST -H "Authorization: Bearer $HA_TOKEN" "$HA_URL/api/services/automation/trigger" \
  -H "Content-Type: application/json" -d '{"entity_id": "automation.motion_lights"}'
```

### Activate Scenes

```bash
curl -X POST -H 
