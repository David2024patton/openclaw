---
name: azure-ai-voicelive-py
description: Build real-time voice AI applications using Azure AI Voice Live SDK (azure-ai-voicelive).
homepage: https://github.com/openclaw/skills/tree/main/skills/thegovind/azure-ai-voicelive-py/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# azure-ai-voicelive-py

Build real-time voice AI applications using Azure AI Voice Live SDK (azure-ai-voicelive).

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [azure-ai-voicelive-py](https://github.com/openclaw/skills/tree/main/skills/thegovind/azure-ai-voicelive-py/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Azure AI Voice Live SDK

Build real-time voice AI applications with bidirectional WebSocket communication.

## Installation

```bash
pip install azure-ai-voicelive aiohttp azure-identity
```

## Environment Variables

```bash
AZURE_COGNITIVE_SERVICES_ENDPOINT=https://<region>.api.cognitive.microsoft.com
# For API key auth (not recommended for production)
AZURE_COGNITIVE_SERVICES_KEY=<api-key>
```

## Authentication

**DefaultAzureCredential (preferred)**:
```python
from azure.ai.voicelive.aio import connect
from azure.identity.aio import DefaultAzureCredential

async with connect(
    endpoint=os.environ["AZURE_COGNITIVE_SERVICES_ENDPOINT"],
    credential=DefaultAzureCredential(),
    model="gpt-4o-realtime-preview",
    credential_scopes=["https://cognitiveservices.azure.com/.default"]
) as conn:
    ...
```

**API Key**:
```python
from azure.ai.voicelive.aio import connect
from azure.core.credentials import AzureKeyCredential

async with connect(
    endpoint=os.environ["AZURE_COGNITIVE_SERVICES_ENDPOINT"],
    credential=AzureKeyCredential(os.environ["AZURE_COGNITIVE_SERVICES_KEY"]),
    model="gpt-4o-realtime-preview"
) as conn:
    ...
```

## Quick Start

```python
import asyncio
import os
from azure.ai.voicelive.aio import connect
from azure.identity.aio import DefaultAzureCredential

async def main():
    async with connect(
        endpoint=os.environ["AZURE_COGNITIVE_SERVICES_ENDPOINT"],
        credential=DefaultAzureCredential(),
        model="gpt-4o-realtime-preview",
        credential_scopes=["https://cognitiveservices.azure.com/.default"]
    ) as conn:
        # Update session with instructions
        await conn.session.update(session={
            "instructions": "You are a helpful assistant.",
            "modalities": ["text", "audio"],
            "voice": "alloy"
        })
        
        # Listen for events
        async for event in conn:
            print(f"Event: {event.type}")
            if event.type == "response.audio_transcript.
