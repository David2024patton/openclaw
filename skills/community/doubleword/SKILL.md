---
name: doubleword
description: Create and manage batch inference jobs using the Doubleword API (api.doubleword.ai).
homepage: https://github.com/openclaw/skills/tree/main/skills/pjb157/doubleword/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# doubleword

Create and manage batch inference jobs using the Doubleword API (api.doubleword.ai).

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [doubleword](https://github.com/openclaw/skills/tree/main/skills/pjb157/doubleword/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Doubleword Batch Inference

Process multiple AI inference requests asynchronously using the Doubleword batch API with high throughput and low cost.

## Prerequisites

Before submitting batches, you need:
1. **Doubleword Account** - Sign up at https://app.doubleword.ai/
2. **API Key** - Create one in the API Keys section of your dashboard
3. **Account Credits** - Add credits to process requests (see pricing below)

## When to Use Batches

Batches are ideal for:
- Multiple independent requests that can run simultaneously
- Workloads that don't require immediate responses
- Large volumes that would exceed rate limits if sent individually
- Cost-sensitive workloads (24h window = 50-60% cheaper than realtime)
- Tool calling and structured output generation at scale

## Available Models & Pricing

Pricing is per 1 million tokens (input / output):

**Qwen3-VL-30B-A3B-Instruct-FP8** (mid-size):
- Realtime SLA: $0.16 / $0.80
- 1-hour SLA: $0.07 / $0.30 (56% cheaper)
- 24-hour SLA: $0.05 / $0.20 (69% cheaper)

**Qwen3-VL-235B-A22B-Instruct-FP8** (flagship):
- Realtime SLA: $0.60 / $1.20
- 1-hour SLA: $0.15 / $0.55 (75% cheaper)
- 24-hour SLA: $0.10 / $0.40 (83% cheaper)
- Supports up to 262K total tokens, 16K new tokens per request

**Cost estimation:** Upload files to the Doubleword Console to preview expenses before submitting.

## Quick Start

Two ways to submit batches:

**Via API:**
1. Create JSONL file with requests
2. Upload file to get file ID
3. Create batch using file ID
4. Poll status until complete
5. Download results from output_file_id

**Via Web Console:**
1. Navigate to Batches section at https://app.doubleword.ai/
2. Upload JSONL file
3. Configure batch settings (model, completion window)
4. Monitor progress in real-time dashboard
5. Download results when ready

## Workflow

### Step 1: Create Batch Request File

Create a `.jsonl` file where each line contains a complete, valid JSON object with no line breaks within the object:

```json
{"custom_id": "req-1
