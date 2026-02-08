---
name: jules-and-lobster
description: Use the Jules REST API (v1alpha) via curl to list sources, create sessions, monitor activities, approve plans, send.
homepage: https://github.com/openclaw/skills/tree/main/skills/sanjacob99/jules-and-lobster/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# jules-and-lobster

Use the Jules REST API (v1alpha) via curl to list sources, create sessions, monitor activities, approve plans, send.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [jules-and-lobster](https://github.com/openclaw/skills/tree/main/skills/sanjacob99/jules-and-lobster/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Jules REST API Skill

## Quick Start

```bash
# 1. Verify available sources (pre-flight check)
./scripts/jules_api.sh sources

# 2. Create a session with auto PR creation
./scripts/jules_api.sh new-session \
  --source "sources/github/OWNER/REPO" \
  --title "Add unit tests" \
  --prompt "Add comprehensive unit tests for the authentication module" \
  --branch main \
  --auto-pr

# 3. Monitor session progress
./scripts/jules_api.sh activities --session SESSION_ID
```

**Note:** Use your GitHub username/org, not your local system username (e.g., `sources/github/octocat/Hello-World`, not `sources/github/$USER/Hello-World`).

## Overview

This skill enables programmatic interaction with the **Jules REST API (v1alpha)** for delegating coding tasks to Jules, Google's autonomous AI coding agent. It supports:

- **Task Assignment**: Create new coding sessions with specific prompts
- **Session Monitoring**: Track session state and activities in real-time
- **Plan Management**: Approve or review generated plans
- **Messaging**: Send follow-up messages to active sessions
- **Result Integration**: Retrieve PR URLs and code changes from completed sessions

## Before You Start

### 1. Get an API Key

Create a Jules API key in the Jules web app:
- Navigate to: https://jules.google.com/settings#api
- You can have at most **3 API keys** at a time

Export it on the machine running the agent:

```bash
export JULES_API_KEY="your-api-key-here"
```

### 2. Connect Your GitHub Repository

Before the API can operate on a GitHub repo, you must:
1. Install the **Jules GitHub app** via the Jules web UI
2. Grant access to the specific repositories you want Jules to work on

### 3. Verify Repository Access

```bash
# List available sources to verify access and see correct format
./scripts/jules_api.sh sources
```

You'll see entries like:
```json
{
  "sources": [
    {
      "name": "sources/github/octocat/Hello-World",
      "githubRepo": {
        "owner": "octocat",
        "repo": "Hello
