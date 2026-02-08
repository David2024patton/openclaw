---
name: relay-to-agent
description: Relay messages to AI agents on any OpenAI-compatible API.
homepage: https://github.com/openclaw/skills/tree/main/skills/ericsantos/relay-to-agent/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# relay-to-agent

Relay messages to AI agents on any OpenAI-compatible API.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [relay-to-agent](https://github.com/openclaw/skills/tree/main/skills/ericsantos/relay-to-agent/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Relay To Agent

Send messages to AI agents on any OpenAI-compatible endpoint. Works with Connect Chat, OpenRouter, LiteLLM, vLLM, Ollama, and any service implementing the Chat Completions API.

## List available agents

```bash
node {baseDir}/scripts/relay.mjs --list
```

## Send a message to an agent

```bash
node {baseDir}/scripts/relay.mjs --agent linkedin-alchemist "Transform this article into a LinkedIn post"
```

## Multi-turn conversation

```bash
# First message
node {baseDir}/scripts/relay.mjs --agent connect-flow-ai "Analyze our latest campaign"

# Follow-up (same session, agent remembers context)
node {baseDir}/scripts/relay.mjs --agent connect-flow-ai "Compare with last month"
```

## Reset session

```bash
node {baseDir}/scripts/relay.mjs --agent linkedin-alchemist --reset "Start fresh with this article..."
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--agent ID` | Target agent identifier | (required) |
| `--reset` | Reset conversation before sending | off |
| `--list` | List available agents | — |
| `--session ID` | Custom session identifier | `default` |
| `--json` | Raw JSON output | off |

## Configuration

### agents.json

Configure agents and endpoint in `{baseDir}/agents.json`:

```json
{
  "baseUrl": "https://api.example.com/v1",
  "agents": [
    {
      "id": "my-agent",
      "name": "My Agent",
      "description": "What this agent does",
      "model": "model-id-on-the-api"
    }
  ]
}
```

### Environment variables

```bash
export RELAY_API_KEY="sk-..."          # API key (required)
export RELAY_BASE_URL="https://..."    # Override base URL from config
export RELAY_CONFIG="/path/to/agents.json"  # Custom config path
```

## Compatible Services

- **Connect Chat** — `api.connectchat.ai/api`
- **OpenRouter** — `openrouter.ai/api/v1`
- **LiteLLM** — `localhost:4000/v1`
- **vLLM** — `localhost:8000/v1`
- **Ollama** — `localhost:11434/v1`
- **Any OpenAI-compatible API**

## Session Management

Sessions
