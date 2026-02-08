---
name: tinyfish-web-agent
description: Use TinyFish/Mino web agent to extract/scrape websites, extract data, and automate browser actions using natural.
homepage: https://github.com/openclaw/skills/tree/main/skills/simantak-dabhade/tinyfish-web-agent/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# tinyfish-web-agent

Use TinyFish/Mino web agent to extract/scrape websites, extract data, and automate browser actions using natural.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [tinyfish-web-agent](https://github.com/openclaw/skills/tree/main/skills/simantak-dabhade/tinyfish-web-agent/SKILL.md)
- **Security Status**: SAFE

## Instructions

# TinyFish Web Agent

Requires: `MINO_API_KEY` environment variable

## Best Practices

1. **Specify JSON format**: Always describe the exact structure you want returned
2. **Parallel calls**: When extracting from multiple independent sites, make separate parallel calls instead of combining into one prompt

## Basic Extract/Scrape

Extract data from a page. Specify the JSON structure you want:

```python
import requests
import json
import os

response = requests.post(
    "https://mino.ai/v1/automation/run-sse",
    headers={
        "X-API-Key": os.environ["MINO_API_KEY"],
        "Content-Type": "application/json",
    },
    json={
        "url": "https://example.com",
        "goal": "Extract product info as JSON: {\"name\": str, \"price\": str, \"in_stock\": bool}",
    },
    stream=True,
)

for line in response.iter_lines():
    if line:
        line_str = line.decode("utf-8")
        if line_str.startswith("data: "):
            event = json.loads(line_str[6:])
            if event.get("type") == "COMPLETE" and event.get("status") == "COMPLETED":
                print(json.dumps(event["resultJson"], indent=2))
```

## Multiple Items

Extract lists of data with explicit structure:

```python
json={
    "url": "https://example.com/products",
    "goal": "Extract all products as JSON array: [{\"name\": str, \"price\": str, \"url\": str}]",
}
```

## Stealth Mode

For bot-protected sites:

```python
json={
    "url": "https://protected-site.com",
    "goal": "Extract product data as JSON: {\"name\": str, \"price\": str, \"description\": str}",
    "browser_profile": "stealth",
}
```

## Proxy

Route through specific country:

```python
json={
    "url": "https://geo-restricted-site.com",
    "goal": "Extract pricing data as JSON: {\"item\": str, \"price\": str, \"currency\": str}",
    "browser_profile": "stealth",
    "proxy_config": {
        "enabled": True,
        "country_code": "US",
    },
}
```

## Output

Results are in `event["resultJson"]` when `even
