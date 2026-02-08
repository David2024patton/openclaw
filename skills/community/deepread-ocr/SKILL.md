---
name: deepread-ocr
description: AI-native OCR platform that turns documents into high-accuracy data in minutes.
homepage: https://github.com/openclaw/skills/tree/main/skills/uday390/deepread-ocr/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# deepread-ocr

AI-native OCR platform that turns documents into high-accuracy data in minutes.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [deepread-ocr](https://github.com/openclaw/skills/tree/main/skills/uday390/deepread-ocr/SKILL.md)
- **Security Status**: SAFE

## Instructions

# DeepRead - Production OCR API

DeepRead is an AI-native OCR platform that turns documents into high-accuracy data in minutes. Using multi-model consensus, DeepRead achieves 95%+ accuracy and flags only uncertain fields for review—reducing manual work from 100% to 5-10%. Zero prompt engineering required.

## What This Skill Does

DeepRead is a production-grade document processing API that gives you high-accuracy structured data output in minutes with human review flagging so manual review is limited to the flagged exceptions

**Core Features:**
- **Text Extraction**: Convert PDFs and images to clean markdown
- **Structured Data**: Extract JSON fields with confidence scores
- **Quality Flags**: Human Review tagging for uncertain fields (`hil_flag`)
- **Multi-Pass Processing**: Multiple validation passes for maximum accuracy
- **Multi-Model Consensus**: Cross-validation between models for reliability
- **Free Tier**: 2,000 pages/month (no credit card required)

## Setup

### 1. Get Your API Key

Sign up and create an API key:
```bash
# Visit the dashboard
https://www.deepread.tech/dashboard

# Or use this direct link
https://www.deepread.tech/dashboard/?utm_source=clawdhub
```

Save your API key:
```bash
export DEEPREAD_API_KEY="sk_live_your_key_here"
```

### 2. Clawdbot Configuration (Optional)

Add to your `clawdbot.config.json5`:
```json5
{
  skills: {
    entries: {
      "deepread": {
        enabled: true,
        apiKey: "sk_live_your_key_here"
      }
    }
  }
}
```

### 3. Process Your First Document

**Option A: With Webhook (Recommended)**
```bash
# Upload PDF with webhook notification
curl -X POST https://api.deepread.tech/v1/process \
  -H "X-API-Key: $DEEPREAD_API_KEY" \
  -F "file=@document.pdf" \
  -F "webhook_url=https://your-app.com/webhooks/deepread"

# Returns immediately
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued"
}

# Your webhook receives results when processing completes (2-5 minutes)
```

**Option B: Poll for Resu
