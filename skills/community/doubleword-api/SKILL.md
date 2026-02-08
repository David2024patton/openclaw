---
name: doubleword-api
description: Create and manage batch inference jobs using the Doubleword API (api.doubleword.ai).
homepage: https://github.com/openclaw/skills/tree/main/skills/pjb157/doubleword-api/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# doubleword-api

Create and manage batch inference jobs using the Doubleword API (api.doubleword.ai).

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [doubleword-api](https://github.com/openclaw/skills/tree/main/skills/pjb157/doubleword-api/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Doubleword Batch Inference

Process multiple AI inference requests asynchronously using the Doubleword batch API.

## When to Use Batches

Batches are ideal for:
- Multiple independent requests that can run simultaneously
- Workloads that don't require immediate responses
- Large volumes that would exceed rate limits if sent individually
- Cost-sensitive workloads (24h window offers better pricing)

## Quick Start

Basic workflow for any batch job:

1. **Create JSONL file** with requests (one JSON object per line)
2. **Upload file** to get file ID
3. **Create batch** using file ID
4. **Poll status** until complete
5. **Download results** from output_file_id

## Workflow

### Step 1: Create Batch Request File

Create a `.jsonl` file where each line contains a single request:

```json
{"custom_id": "req-1", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "anthropic/claude-3-5-sonnet", "messages": [{"role": "user", "content": "What is 2+2?"}]}}
{"custom_id": "req-2", "method": "POST", "url": "/v1/chat/completions", "body": {"model": "anthropic/claude-3-5-sonnet", "messages": [{"role": "user", "content": "What is the capital of France?"}]}}
```

**Required fields per line:**
- `custom_id`: Unique identifier (max 64 chars) - use descriptive IDs like `"user-123-question-5"` for easier result mapping
- `method`: Always `"POST"`
- `url`: Always `"/v1/chat/completions"`
- `body`: Standard API request with `model` and `messages`

**Optional body parameters:**
- `temperature`: 0-2 (default: 1.0)
- `max_tokens`: Maximum response tokens
- `top_p`: Nucleus sampling parameter
- `stop`: Stop sequences

**File limits:**
- Max size: 200MB
- Format: JSONL only (JSON Lines - newline-delimited JSON)
- Split large batches into multiple files if needed

**Helper script:**
Use `scripts/create_batch_file.py` to generate JSONL files programmatically:

```bash
python scripts/create_batch_file.py output.jsonl
```

Modify the script's `requests` list to generate your specif
