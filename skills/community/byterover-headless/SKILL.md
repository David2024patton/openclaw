---
name: byterover-headless
description: Query and curate knowledge-base using ByteRover.
homepage: https://github.com/openclaw/skills/tree/main/skills/byteroverinc/byterover-headless/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# byterover-headless

Query and curate knowledge-base using ByteRover.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [byterover-headless](https://github.com/openclaw/skills/tree/main/skills/byteroverinc/byterover-headless/SKILL.md)
- **Security Status**: SAFE

## Instructions

# ByteRover Knowledge Management

Use the `brv` CLI to manage your own knowledgebase. ByteRover maintains a context tree that stores patterns, decisions, and implementation details about a project.

**IMPORTANT**: For headless/automated use, always add `--headless --format json` flags to get machine-parseable JSON output.

## Setup (Headless)

- ByteRover can be fully set up in headless mode. If user has not logged in or initialized `.brv/` in the current working directory (check via `projectInitialized` and and `authStatus` in `brv status --headless --format json
` response), ask them to provide:
1. **API key** - for authentication (obtain from https://app.byterover.dev/settings/keys)
2. **Team and space** - names or IDs for project initialization

### Login with API Key

Authenticate using an API key:

```bash
brv login --api-key <key>
```

Outputs text: `Logged in as <email>` on success.

### Initialize Project

Initialize ByteRover for a project (requires team and space for headless mode - can use either ID or name):

```bash
# Using names
brv init --headless --team my-team --space my-space --format json

# Using IDs
brv init --headless --team team-abc123 --space space-xyz789 --format json
```

Force re-initialization:
```bash
brv init --headless --team my-team --space my-space --force --format json
```

Example response:
```json
{
  "success": true,
  "command": "init",
  "data": {
    "status": "success",
    "teamName": "MyTeam",
    "spaceName": "MySpace",
    "configPath": "/path/to/project/.brv/config.json"
  }
}
```

**Note**: You can use either team/space names or IDs. Names are matched case-insensitively.

### Check Status

Check the current status of ByteRover and the project:

```bash
brv status --headless --format json
```

Example response:
```json
{
  "success": true,
  "command": "status",
  "data": {
    "cliVersion": "1.0.0",
    "authStatus": "logged_in",
    "userEmail": "user@example.com",
    "projectInitialized": true,
    "teamName": "MyTe
