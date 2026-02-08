---
name: reachy-mini
description: Control a Reachy Mini robot (by Pollen Robotics / Hugging Face) via its REST API and SSH.
homepage: https://github.com/openclaw/skills/tree/main/skills/afalk42/reachy-mini/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# reachy-mini

Control a Reachy Mini robot (by Pollen Robotics / Hugging Face) via its REST API and SSH.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [reachy-mini](https://github.com/openclaw/skills/tree/main/skills/afalk42/reachy-mini/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Reachy Mini Robot Control

## Quick Start

Use the CLI script or `curl` to control the robot. The script lives at:
```
~/clawd/skills/reachy-mini/scripts/reachy.sh
```

Set the robot IP via `REACHY_HOST` env var or `--host` flag. Default: `192.168.8.17`.

### Common Commands
```bash
reachy.sh status                    # Daemon status, version, IP
reachy.sh state                     # Full robot state
reachy.sh wake-up                   # Wake the robot
reachy.sh sleep                     # Put to sleep
reachy.sh snap                      # Camera snapshot → /tmp/reachy_snap.jpg
reachy.sh snap /path/to/photo.jpg   # Snapshot to custom path
reachy.sh play-emotion cheerful1    # Play an emotion
reachy.sh play-dance groovy_sway_and_roll  # Play a dance
reachy.sh goto --head 0.2,0,0 --duration 1.5  # Nod down
reachy.sh volume-set 70             # Set speaker volume
reachy.sh emotions                  # List all emotions
reachy.sh dances                    # List all dances
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `REACHY_HOST` | `192.168.8.17` | Robot IP address |
| `REACHY_PORT` | `8000` | REST API port |
| `REACHY_SSH_USER` | `pollen` | SSH username (for `snap` command) |
| `REACHY_SSH_PASS` | `root` | SSH password (for `snap` command, uses `sshpass`) |

## Movement Guide

### Head Control (6 DoF)
The head accepts pitch, yaw, roll in **radians**:
- **Pitch** (look up/down): -0.5 (up) to 0.5 (down)
- **Yaw** (look left/right): -0.8 (right) to 0.8 (left)
- **Roll** (tilt sideways): -0.5 to 0.5

```bash
# Look up
reachy.sh goto --head -0.3,0,0 --duration 1.0

# Look left
reachy.sh goto --head 0,0.4,0 --duration 1.0

# Tilt head right, look slightly up
reachy.sh goto --head -0.1,0,-0.3 --duration 1.5

# Return to neutral
reachy.sh goto --head 0,0,0 --duration 1.0
```

### Body Rotation (360°)
Body yaw in radians. 0 = forward, positive = left, negative = right.
```bash
reachy.sh goto --body 1.57 --duration 2.0   # Tu
