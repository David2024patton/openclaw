---
name: turix-computer-use
description: Computer Use Agent (CUA) for macOS automation using TuriX.
homepage: https://github.com/openclaw/skills/tree/main/skills/tongyu-yan/turix-computer-use/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# turix-computer-use

Computer Use Agent (CUA) for macOS automation using TuriX.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [turix-computer-use](https://github.com/openclaw/skills/tree/main/skills/tongyu-yan/turix-computer-use/SKILL.md)
- **Security Status**: SAFE

## Instructions

# TuriX-Mac Skill

This skill allows Clawdbot to control the macOS desktop visually using the TuriX Computer Use Agent.

## When to Use

- When asked to perform actions on the Mac desktop (e.g., "Open Spotify and play my liked songs").
- When navigating applications that lack command-line interfaces.
- For multi-step visual workflows (e.g., "Find the latest invoice in my email and upload it to the company portal").

## Workflow

1.  **Preparation**: Ensure the user has granted "Screen Recording" permission to `/opt/homebrew/bin/node` in System Settings.
2.  **Execution**: Pass the user's task directly to the helper script.

### Running TuriX

Invoke the helper script via `exec`. Pass the full task description as arguments. The script will automatically update the TuriX `config.json` with your task.

```bash
skills/local/turix-mac/scripts/run_turix.sh "Open System Settings and switch to Dark Mode"
```

**💡 Tips for the Agent:**
- **Task Description**: Be specific. Instead of "Open Chrome", use "Open Chrome and navigate to google.com".
- **Dynamic Injection**: You do NOT need to edit `config.json` manually; the script handles the JSON injection for you.
- **Monitoring**: Since this is a GUI-based task, keep the session open and use `process log` to check for status updates or errors like "NoneType" (permission issues).

**Note**: The process runs in the background. Monitor the output using the `process` tool if it doesn't return immediately.

## Troubleshooting

- **NoneType Error**: If TuriX fails with `AttributeError: 'NoneType' object has no attribute 'save'`, it usually means screen recording permission is missing or the process needs a restart.
- **Path Issues**: The script explicitly sets the `PATH` to include `/usr/sbin` so it can find the `screencapture` utility.
