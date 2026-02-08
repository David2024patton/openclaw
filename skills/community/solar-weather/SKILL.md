---
name: solar-weather
description: Monitor solar weather conditions including geomagnetic storms, solar flares, aurora forecasts, and solar wind data.
homepage: https://github.com/openclaw/skills/tree/main/skills/andrewdmwalker/solar-weather/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# solar-weather

Monitor solar weather conditions including geomagnetic storms, solar flares, aurora forecasts, and solar wind data.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [solar-weather](https://github.com/openclaw/skills/tree/main/skills/andrewdmwalker/solar-weather/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Solar Weather Monitor 🌞

Track space weather conditions in real-time! Monitor solar flares, geomagnetic storms, aurora forecasts, and solar wind data from NOAA's Space Weather Prediction Center.

## Features

🌞 **Current Conditions** - Real-time space weather status  
📅 **3-Day Forecast** - Predict upcoming solar activity  
🌌 **Aurora Forecast** - Will you see the Northern Lights?  
🌊 **Solar Wind** - Track solar wind magnetic field  
🚨 **Alerts** - Active space weather warnings  
📊 **Summary** - Quick comprehensive overview  

Perfect for:
- 📻 Ham radio operators
- 🌌 Aurora chasers & photographers
- 🛰️ Satellite operators
- ⚡ Power grid operators
- 🌍 Space weather enthusiasts

## Usage

### Current Space Weather

```bash
python3 solar-weather.py current
```

**Output:**
```
🌞 Space Weather Conditions
   2026-01-27 18:38:00 UTC

   📻 R0: none ✅
      Radio Blackouts (Solar Flares)

   ☢️  S0: none ✅
      Solar Radiation Storm

   🌍 G0: none ✅
      Geomagnetic Storm
```

### 3-Day Forecast

```bash
python3 solar-weather.py forecast
```

Shows today, tomorrow, and day after with probability percentages for solar events.

### Aurora Forecast

```bash
python3 solar-weather.py aurora
```

**Output:**
```
🌌 Aurora Forecast

Current Conditions:
   Geomagnetic: none
   Solar Wind Bz: -2 nT

Tomorrow (2026-01-28):
   Geomagnetic: minor

🔮 Aurora Outlook:
   ⚠️  MODERATE - Aurora possible at high latitudes
```

### Solar Wind Data

```bash
python3 solar-weather.py solarwind
```

**Output:**
```
🌊 Solar Wind Magnetic Field
   Time: 2026-01-27 18:36:00.000
   Bt: 8 nT (Total Magnitude)
   Bz: -2 nT (North/South Component)

   ✅ Slightly negative Bz
```

**Note:** Negative Bz (especially < -5 nT) is favorable for aurora activity!

### Active Alerts

```bash
python3 solar-weather.py alerts
```

Shows active space weather watches, warnings, and alerts from NOAA.

### Quick Summary

```bash
python3 solar-weather.py summary
```

Comprehensive overview of current conditions, sola
