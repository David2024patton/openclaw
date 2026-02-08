---
name: roon-controller
description: Control Roon music player through Roon API with automatic Core discovery and zone filtering.
homepage: https://github.com/openclaw/skills/tree/main/skills/puterjam/roon-controller/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# roon-controller

Control Roon music player through Roon API with automatic Core discovery and zone filtering.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [roon-controller](https://github.com/openclaw/skills/tree/main/skills/puterjam/roon-controller/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Roon Control Skill

Control the Roon music player with Chinese command support.

## Quick Start

### Install Dependencies

```bash
pip install roonapi
```

### Usage Examples

```python
from roon_controller import RoonController

# Create controller (token will be saved automatically)
controller = RoonController(verbose=True)

# Play/Pause
result = controller.play_pause()

# Next track
result = controller.next()

# Get current track
track_info = controller.get_current_track()
print(f"Now playing: {track_info['track']}")
```

## Core Features

### 1. Automatic Discovery and Connection
- Automatic Roon Core discovery
- Token automatically saved to `~/clawd/roon_config.json`
- Auto-reconnect after restart, no re-authorization needed

### 2. Zone Selection and Switching
- Supports switching between any available zone
- Selected zone is saved in config and persists across restarts
- If no zone is selected, defaults to zones ending with "[roon]"
- Use `set_zone()` to switch zones programmatically

**Switch Zone**
```python
result = controller.set_zone("Living Room")
# {"success": True, "message": "Switched to zone: Living Room", "zone": "Living Room"}
```

**Get Current Zone**
```python
zone = controller.get_current_zone()
# Returns zone info dict with zone_id and zone_data
```

### 3. Playback Control

**Play**
```python
result = controller.play()
# {"success": True, "message": "Playback started", "zone": "Living Room Muspi"}
```

**Pause**
```python
result = controller.pause()
# {"success": True, "message": "Paused", "zone": "Living Room Muspi"}
```

**Play/Pause Toggle**
```python
result = controller.play_pause()
```

**Previous Track**
```python
result = controller.previous()
```

**Next Track**
```python
result = controller.next()
```

### 4. Get Current Track

```python
track_info = controller.get_current_track()
# Returns:
# {
#   "success": True,
#   "is_playing": True,
#   "zone": "Living Room Muspi",
#   "track": "Bohemian Rhapsody",
#   "artist": "Queen",
#  
