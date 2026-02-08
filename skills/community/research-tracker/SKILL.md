---
name: research-tracker
description: Manage autonomous AI research agents with SQLite tracking.
homepage: https://github.com/openclaw/skills/tree/main/skills/julian1645/research-tracker/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# research-tracker

Manage autonomous AI research agents with SQLite tracking.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [research-tracker](https://github.com/openclaw/skills/tree/main/skills/julian1645/research-tracker/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Research Tracker

CLI tool for managing autonomous research agents with append-only state, instruction queues, and oversight.

## Prerequisites

```bash
brew tap 1645labs/tap
brew install julians-research-tracker
```

Or: `go install github.com/1645labs/julians-research-tracker/cmd/research@latest`

## Quick Start

### Start a research project
```bash
research init market-q1 --name "Q1 Market Analysis" --objective "Analyze competitor pricing and positioning"
```

### As the research agent — log progress
```bash
export RESEARCH_SESSION_ID="$SESSION_KEY"  # Track which agent is writing

research log market-q1 STEP_BEGIN --step 1 --payload '{"task":"gather sources"}'
# ... do work ...
research log market-q1 STEP_COMPLETE --step 1
research heartbeat market-q1
```

### Check status (from main session or heartbeat)
```bash
research status market-q1 --json
research context market-q1 --last 5  # Truncated context for prompts
```

### Send instructions to running agent
```bash
research instruct market-q1 "Focus on enterprise segment" --priority URGENT
research stop-signal market-q1  # Request graceful stop
```

### Agent checks for instructions
```bash
research pending market-q1 --json
research ack market-q1 --all  # Acknowledge after processing
research check-stop market-q1  # Exit 0 = stop, Exit 1 = continue
```

## Commands Reference

| Command | Purpose |
|---------|---------|
| `init <id> -o "..."` | Create project with objective |
| `list [--status active\|done\|all]` | List projects (includes `needs_attention` flag) |
| `show <id>` | Project details + recent events |
| `stop <id>` | Stop project, send STOP instruction |
| `archive <id>` | Archive completed project |
| `log <id> <event> [--step N]` | Log event (STEP_BEGIN, CHECKPOINT, BLOCKED, etc.) |
| `heartbeat <id>` | Update alive timestamp |
| `block <id> --reason "..."` | Mark blocked, needs input |
| `complete <id>` | Mark done |
| `status <id> [--json]` | Current state summary |
| `context <id> [--last N]` | 
