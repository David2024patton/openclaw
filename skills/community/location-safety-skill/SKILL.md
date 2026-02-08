---
name: location-safety-skill
description: Location-based safety monitoring with automatic alerts and escalation.
homepage: https://github.com/openclaw/skills/tree/main/skills/sidu/location-safety-skill/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# location-safety-skill

Location-based safety monitoring with automatic alerts and escalation.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [location-safety-skill](https://github.com/openclaw/skills/tree/main/skills/sidu/location-safety-skill/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Location Safety Monitor

Real-time safety monitoring based on user location with automatic alerting and escalation.

## Overview

This skill provides:
- **Location webhook** — receives location updates from mobile apps (OwnTracks, iOS Shortcuts)
- **Safety checker** — monitors NWS alerts, earthquakes, air quality, local news
- **Alert system** — messages user when danger detected
- **Escalation** — contacts emergency contact if user doesn't respond

## Quick Setup

Run the interactive setup wizard — it guides you through everything:

```bash
cd location-webhook/
node setup.js
```

The wizard walks you through 4 steps:

### Step 1: Your Location
- Pick from presets (Seattle, Portland, SF, LA, NYC, Chicago)
- Or enter any city (auto-geocoded)
- Configures local news feeds and keywords

### Step 2: Emergency Contact
- Name and email of someone to contact if you don't respond
- Optional but recommended for safety escalation

### Step 3: Mobile App Setup
- Install **OwnTracks** on your phone:
  - 📱 iPhone: https://apps.apple.com/app/owntracks/id692424691
  - 🤖 Android: https://play.google.com/store/apps/details?id=org.owntracks.android
- Configure app to HTTP mode
- Point to your webhook URL

### Step 4: Start Webhook Server
- Run `node server.js`
- Copy the displayed URL to OwnTracks
- Test with the publish button

---

**Quick setup** (skip the wizard):
```bash
node setup.js --city "Portland"
node setup.js --show  # View current config
```

### 5. Deploy the Location Webhook

```bash
# Copy scripts to workspace
cp -r scripts/ ~/location-webhook/
cd ~/location-webhook/

# Start the server (uses port 18800 by default)
node server.js
```

Configure the user's phone to send location updates to:
```
POST http://<your-host>:18800/location?key=<SECRET_KEY>
```

**OwnTracks setup:**
- Mode: HTTP
- URL: `http://<your-host>:18800/location?key=<SECRET_KEY>`

**iOS Shortcuts:**
- Get Current Location → Get Contents of URL (POST, JSON body with `lat` and `lon`)

### 2. Configure 
