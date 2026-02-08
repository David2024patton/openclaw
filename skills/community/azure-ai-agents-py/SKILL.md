---
name: azure-ai-agents-py
description: Build AI agents using the Azure AI Agents Python SDK (azure-ai-agents).
homepage: https://github.com/openclaw/skills/tree/main/skills/thegovind/azure-ai-agents-py/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# azure-ai-agents-py

Build AI agents using the Azure AI Agents Python SDK (azure-ai-agents).

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [azure-ai-agents-py](https://github.com/openclaw/skills/tree/main/skills/thegovind/azure-ai-agents-py/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Azure AI Agents Python SDK

Build agents hosted on Azure AI Foundry using the `azure-ai-agents` SDK.

## Installation

```bash
pip install azure-ai-agents azure-identity
# Or with azure-ai-projects for additional features
pip install azure-ai-projects azure-identity
```

## Environment Variables

```bash
PROJECT_ENDPOINT="https://<resource>.services.ai.azure.com/api/projects/<project>"
MODEL_DEPLOYMENT_NAME="gpt-4o-mini"
```

## Authentication

```python
from azure.identity import DefaultAzureCredential
from azure.ai.agents import AgentsClient

credential = DefaultAzureCredential()
client = AgentsClient(
    endpoint=os.environ["PROJECT_ENDPOINT"],
    credential=credential,
)
```

## Core Workflow

The basic agent lifecycle: **create agent → create thread → create message → create run → get response**

### Minimal Example

```python
import os
from azure.identity import DefaultAzureCredential
from azure.ai.agents import AgentsClient

client = AgentsClient(
    endpoint=os.environ["PROJECT_ENDPOINT"],
    credential=DefaultAzureCredential(),
)

# 1. Create agent
agent = client.create_agent(
    model=os.environ["MODEL_DEPLOYMENT_NAME"],
    name="my-agent",
    instructions="You are a helpful assistant.",
)

# 2. Create thread
thread = client.threads.create()

# 3. Add message
client.messages.create(
    thread_id=thread.id,
    role="user",
    content="Hello!",
)

# 4. Create and process run
run = client.runs.create_and_process(thread_id=thread.id, agent_id=agent.id)

# 5. Get response
if run.status == "completed":
    messages = client.messages.list(thread_id=thread.id)
    for msg in messages:
        if msg.role == "assistant":
            print(msg.content[0].text.value)

# Cleanup
client.delete_agent(agent.id)
```

## Tools Overview

| Tool | Class | Use Case |
|------|-------|----------|
| Code Interpreter | `CodeInterpreterTool` | Execute Python, generate files |
| File Search | `FileSearchTool` | RAG over uploaded documents |
| Bing Grounding | `BingGroun
