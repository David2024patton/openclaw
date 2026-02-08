---
name: google-web-search
description: Enables grounded question answering by automatically executing the Google Search tool within Gemini models.
homepage: https://github.com/openclaw/skills/tree/main/skills/theoseo/google-web-search/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# google-web-search

Enables grounded question answering by automatically executing the Google Search tool within Gemini models.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [google-web-search](https://github.com/openclaw/skills/tree/main/skills/theoseo/google-web-search/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Google Web Search

## Overview

This skill provides the capability to perform real-time web searches via the Gemini API's `google_search` grounding tool. It is designed to fetch the most current information available on the web to provide grounded, citable answers to user queries.

**Key Features:**
- Real-time web search via Gemini API
- Grounded responses with verifiable citations
- Configurable model selection
- Simple Python API

## Usage

This skill exposes the Gemini API's `google_search` tool. It should be used when the user asks for **real-time information**, **recent events**, or requests **verifiable citations**.

### Execution Context

The core logic is in `scripts/example.py`. This script requires the following environment variables:

- **GEMINI_API_KEY** (required): Your Gemini API key
- **GEMINI_MODEL** (optional): Model to use (default: `gemini-2.5-flash-lite`)

**Supported Models:**
- `gemini-2.5-flash-lite` (default) - Fast and cost-effective
- `gemini-3-flash-preview` - Latest flash model
- `gemini-3-pro-preview` - More capable, slower
- `gemini-2.5-flash-lite-preview-09-2025` - Specific version

### Python Tool Implementation Pattern

When integrating this skill into a larger workflow, the helper script should be executed in an environment where the `google-genai` library is available and the `GEMINI_API_KEY` is exposed.

Example Python invocation structure:
```python
from skills.google-web-search.scripts.example import get_grounded_response

# Basic usage (uses default model):
prompt = "What is the latest market trend?"
response_text = get_grounded_response(prompt)
print(response_text)

# Using a specific model:
response_text = get_grounded_response(prompt, model="gemini-3-pro-preview")
print(response_text)

# Or set via environment variable:
import os
os.environ["GEMINI_MODEL"] = "gemini-3-flash-preview"
response_text = get_grounded_response(prompt)
print(response_text)
```

### Troubleshooting

If the script fails:
1. **Missing API Key**: Ens
