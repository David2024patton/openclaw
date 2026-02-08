---
name: turix-cua
description: Computer Use Agent (CUA) for macOS automation using TuriX.
homepage: https://github.com/openclaw/skills/tree/main/skills/tongyu-yan/turix-cua/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# turix-cua

Computer Use Agent (CUA) for macOS automation using TuriX.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [turix-cua](https://github.com/openclaw/skills/tree/main/skills/tongyu-yan/turix-cua/SKILL.md)
- **Security Status**: SAFE

## Instructions

# TuriX-Mac Skill

This skill allows Clawdbot to control the macOS desktop visually using the TuriX Computer Use Agent.

## When to Use

- When asked to perform actions on the Mac desktop (e.g., "Open Spotify and play my liked songs").
- When navigating applications that lack command-line interfaces.
- For multi-step visual workflows (e.g., "Find the latest invoice in my email and upload it to the company portal").
- When you need the agent to plan, reason, and execute complex tasks autonomously.

## Key Features

### 🤖 Multi-Model Architecture
TuriX uses a sophisticated multi-model system:
- **Brain**: Understands the task and generates step-by-step plans
- **Actor**: Executes precise UI actions based on visual understanding
- **Planner**: Coordinates high-level task decomposition (when `use_plan: true`)
- **Memory**: Maintains context across task steps

### 📋 Skills System
Skills are markdown playbooks that guide the agent for specific domains:
- `github-web-actions`: GitHub navigation, repo search, starring
- `browser-tasks`: General web browser operations
- Custom skills can be added to the `skills/` directory

### 🔄 Resume Capability
The agent can resume interrupted tasks by setting a stable `agent_id`.

## Running TuriX

### Basic Task
```bash
skills/local/turix-mac/scripts/run_turix.sh "Open Chrome and go to github.com"
```

### Resume Interrupted Task
```bash
skills/local/turix-mac/scripts/run_turix.sh --resume my-task-001
```

> ⚠️ **Important**: The `./run_turix.sh` command does NOT automatically update the task in `config.json`. **You must manually edit `examples/config.json` and modify the `agent.task` field before running!**


### Tips for Effective Tasks

**✅ Good Examples:**
- "Open Safari, go to google.com, search for 'TuriX AI', and click the first result"
- "Open System Settings, click on Dark Mode, then return to System Settings"
- "Open Finder, navigate to Documents, and create a new folder named 'Project X'"

**❌ Avoid:**
- Vague instructions: "
