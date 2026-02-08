---
name: appdeploy
description: Deploy web apps with backend APIs, database.
homepage: https://github.com/openclaw/skills/tree/main/skills/avimak/appdeploy/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# appdeploy

Deploy web apps with backend APIs, database.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [appdeploy](https://github.com/openclaw/skills/tree/main/skills/avimak/appdeploy/SKILL.md)
- **Security Status**: SAFE

## Instructions

# AppDeploy Skill

Deploy web apps to AppDeploy via HTTP API.

## Setup (First Time Only)

1. **Check for existing API key:**
   - Look for a `.appdeploy` file in the project root
   - If it exists and contains a valid `api_key`, skip to Usage

2. **If no API key exists, register and get one:**
   ```bash
   curl -X POST https://api-v2.appdeploy.ai/mcp/api-key \
     -H "Content-Type: application/json" \
     -d '{"client_name": "claude-code"}'
   ```

   Response:
   ```json
   {
     "api_key": "ak_...",
     "user_id": "agent-claude-code-a1b2c3d4",
     "created_at": 1234567890,
     "message": "Save this key securely - it cannot be retrieved later"
   }
   ```

3. **Save credentials to `.appdeploy`:**
   ```json
   {
     "api_key": "ak_...",
     "endpoint": "https://api-v2.appdeploy.ai/mcp"
   }
   ```

   Add `.appdeploy` to `.gitignore` if not already present.

## Usage

Make JSON-RPC calls to the MCP endpoint:

```bash
curl -X POST {endpoint} \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -H "Authorization: Bearer {api_key}" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "{tool_name}",
      "arguments": { ... }
    }
  }'
```

## Workflow

1. **First, get deployment instructions:**
   Call `get_deploy_instructions` to understand constraints and requirements.

2. **Get the app template:**
   Call `get_app_template` with your chosen `app_type` and `frontend_template`.

3. **Deploy the app:**
   Call `deploy_app` with your app files. For new apps, set `app_id` to `null`.

4. **Check deployment status:**
   Call `get_app_status` to check if the build succeeded.

5. **View/manage your apps:**
   Use `get_apps` to list your deployed apps.

## Available Tools

### get_deploy_instructions

Use this when you are about to call deploy_app in order to get the deployment constraints and hard rules. You must call this tool before starting to generate any code. This 
