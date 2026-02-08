---
name: sphero-mini
description: Control Sphero Mini robot ball via Bluetooth Low Energy.
homepage: https://github.com/openclaw/skills/tree/main/skills/joneschi/sphero-mini/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# sphero-mini

Control Sphero Mini robot ball via Bluetooth Low Energy.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [sphero-mini](https://github.com/openclaw/skills/tree/main/skills/joneschi/sphero-mini/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Sphero Mini Control

Control your Sphero Mini robot ball via Bluetooth Low Energy using Python and bleak.

## Features

- 🎨 **LED Control** - Change main LED color and back LED intensity
- 🎯 **Movement** - Roll in any direction at variable speeds
- 🎲 **Random Mode** - Cat play mode with unpredictable movements
- 📐 **Draw Shapes** - Squares, stars, circles with programmable patterns
- 🔋 **Power Management** - Wake, sleep, and check battery status
- 🧭 **Heading Control** - Reset and control orientation
- 🖥️ **Cross-platform** - Works on macOS, Windows, and Linux (uses bleak, not bluepy)

## Setup

### 1. Install Dependencies

**All platforms:**
```bash
pip3 install bleak
```

### 2. Find Your Sphero Mini's MAC/UUID

**macOS/Windows:**
Use the included scan script:
```bash
python3 scripts/scan_sphero.py
```

Look for a device named like "SM-XXXX" (Sphero Mini).

### 3. Update MAC Address

Edit the scripts and replace `SPHERO_MAC` with your device's address.

## Quick Start

### Scan for Sphero Mini

```bash
python3 scripts/scan_sphero.py
```

### Change Color

```python
import asyncio
from sphero_mini_bleak import SpheroMini

async def change_color():
    sphero = SpheroMini("YOUR-MAC-ADDRESS")
    await sphero.connect()
    await sphero.wake()
    
    # Set to red
    await sphero.setLEDColor(255, 0, 0)
    await asyncio.sleep(2)
    
    await sphero.disconnect()

asyncio.run(change_color())
```

### Roll Forward

```python
import asyncio
from sphero_mini_bleak import SpheroMini

async def roll_forward():
    sphero = SpheroMini("YOUR-MAC-ADDRESS")
    await sphero.connect()
    await sphero.wake()
    
    # Roll forward at speed 100
    await sphero.roll(100, 0)
    await asyncio.sleep(3)
    
    # Stop
    await sphero.roll(0, 0)
    await sphero.disconnect()

asyncio.run(roll_forward())
```

## Pre-built Scripts

### 🐱 Cat Play Mode (Random Movement)

```bash
python3 scripts/cat_play.py
```

Makes Sphero move randomly for 1 minute with color changes - perfect
