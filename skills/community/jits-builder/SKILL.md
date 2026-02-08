---
name: jits-builder
description: Build instant mini-apps from voice or text descriptions.
homepage: https://github.com/openclaw/skills/tree/main/skills/dannyshmueli/jits-builder/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# jits-builder

Build instant mini-apps from voice or text descriptions.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [jits-builder](https://github.com/openclaw/skills/tree/main/skills/dannyshmueli/jits-builder/SKILL.md)
- **Security Status**: SAFE

## Instructions

----------|
| Pomodoro Timer | 25/5 min work/break cycles with sound |
| Tip Calculator | Split bills with custom tip % |
| JSON Formatter | Paste JSON, see it pretty-printed |
| Color Picker | Generate and copy color palettes |
| Countdown | Timer to a specific date/event |
| QR Generator | Text to QR code |
| Unit Converter | Length, weight, temperature |
| Decision Maker | Random picker for choices |

## Limitations

- **Single-page only** - No multi-page apps
- **No backend** - Client-side only, no databases
- **Temporary URLs** - Tunnels expire when stopped
- **No persistence** - Data doesn't survive refresh (use localStorage if needed)

## Directory Structure

```
/data/clawd/jits-apps/
├── pomodoro.html      # App HTML
├── pomodoro.pid       # Server process ID
├── pomodoro.port      # Port number
├── pomodoro.url       # Tunnel URL
└── pomodoro.tunnel.pid # Tunnel process ID
```

---

*"The best tool is the one you build exactly when you need it."* 🐱🦞
