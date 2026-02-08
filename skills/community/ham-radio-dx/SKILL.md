---
name: ham-radio-dx
description: Monitor DX clusters for rare station spots, track active DX expeditions, and get daily band activity digests.
homepage: https://github.com/openclaw/skills/tree/main/skills/andrewdmwalker/ham-radio-dx/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# ham-radio-dx

Monitor DX clusters for rare station spots, track active DX expeditions, and get daily band activity digests.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [ham-radio-dx](https://github.com/openclaw/skills/tree/main/skills/andrewdmwalker/ham-radio-dx/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Ham Radio DX Monitor 📻

Monitor DX clusters in real-time, get notified of rare DX stations, and track active DX expeditions. Perfect for ham radio operators who want to catch rare contacts!

## Features

📡 **Live DX Spots** - Connect to global DX cluster network  
🌍 **Rare DX Alerts** - Notify when rare stations appear  
📊 **Daily Digest** - Band activity summary  
🗺️ **DX Expeditions** - Track active expeditions  
⏰ **Automated Monitoring** - Run via cron for alerts  

## Quick Start

### Watch Live Spots

```bash
# Get latest DX spots
python3 dx-monitor.py watch

# Specific cluster node
python3 dx-monitor.py watch --cluster ea7jxh

# Use your callsign
python3 dx-monitor.py watch --callsign KN4XYZ

# Only show NEW spots (filters duplicates)
python3 dx-monitor.py watch --new-only
```

**Output:**
```
📡 Latest DX Spots from EA7JXH

   20m   SSB      14.195   K1ABC        - CQ Contest
   40m   CW        7.015   VP8/G3XYZ    - Falklands
   15m   FT8      21.074   ZL2ABC       - New Zealand
```

### Daily Digest

```bash
python3 dx-monitor.py digest
```

**Output:**
```
# 📡 DX Digest - 2026-01-27

## Band Activity (last 100 spots)

   20m   ████████████ 24
   40m   ████████ 16
   15m   ██████ 12
   10m   ████ 8

## Rare DX Spotted

   🌍 VP8/G3XYZ    40m      7.015 - Falklands Expedition
   🌍 ZL2ABC       15m     21.074 - New Zealand
```

## DX Cluster Nodes

Available clusters:
- **ea7jxh** - dx.ea7jxh.eu:7373 (Europe)
- **om0rx** - cluster.om0rx.com:7300 (Europe)
- **oh2aq** - oh2aq.kolumbus.fi:7373 (Finland)
- **ab5k** - ab5k.net:7373 (USA)
- **w6rk** - telnet.w6rk.com:7373 (USA West Coast)

## Automated Monitoring

### Real-Time Alerts (Check Every 5 Minutes)

```bash
# Add to crontab
*/5 * * * * cd ~/clawd && python3 skills/ham-radio-dx/dx-monitor.py watch --new-only --callsign YOUR_CALL >> /tmp/dx-alerts.log
```

This checks for new DX spots every 5 minutes and logs them.

### Daily Digest (9am Every Day)

```bash
# Add to crontab
0 9 * * * cd ~/clawd && python3 
