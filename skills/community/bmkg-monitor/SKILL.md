---
name: bmkg-monitor
description: Monitoring earthquake data in Indonesia using BMKG official data.
homepage: https://github.com/openclaw/skills/tree/main/skills/bluemeda/bmkg-monitor/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# bmkg-monitor

Monitoring earthquake data in Indonesia using BMKG official data.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [bmkg-monitor](https://github.com/openclaw/skills/tree/main/skills/bluemeda/bmkg-monitor/SKILL.md)
- **Security Status**: SAFE

## Instructions

# BMKG Monitor

Monitor and analyze seismic activity in Indonesia using real-time data from the Badan Meteorologi, Klimatologi, dan Geofisika (BMKG).

## Quick Start

Run the monitor script to fetch the latest data:

```bash
# Get the latest significant earthquake (M5.0+)
python3 scripts/get_gempa.py latest

# Get list of earthquakes felt by people (including smaller ones)
python3 scripts/get_gempa.py felt

# Get recent history of M5.0+ earthquakes
python3 scripts/get_gempa.py recent

# Get detailed Moment Tensor and Phase history
python3 scripts/get_gempa.py detail <EVENT_ID>
```

## Workflows

### 1. Checking for Recent Shaking
If a user reports feeling a tremor or asks "Was there a quake?", run `get_gempa.py felt` first. This list includes smaller, shallow quakes that people actually feel.

### 2. Deep Analysis
When a significant quake occurs, use [references/seismology.md](references/seismology.md) to explain:
- The meaning of the Magnitude.
- The intensity levels (MMI scale) reported.
- Potential impact based on depth and location.

### 3. Coordinating with News
If the user provides a "Moment Tensor" or "Beach Ball" diagram (usually from a detailed BMKG report), refer to the "Moment Tensor" section in `references/seismology.md` to identify if the quake was Strike-Slip, Normal, or Thrust.

## References
- [seismology.md](references/seismology.md) - Magnitude, MMI scale, and fault types.
