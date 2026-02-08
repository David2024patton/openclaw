---
name: deepread
description: OCR that never fails silently.
homepage: https://github.com/openclaw/skills/tree/main/skills/uday390/deepread/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# deepread

OCR that never fails silently.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [deepread](https://github.com/openclaw/skills/tree/main/skills/uday390/deepread/SKILL.md)
- **Security Status**: SAFE

## Instructions

# DeepRead - Production OCR API

OCR that never fails silently. Process PDFs and extract structured data with AI-powered confidence scoring that tells you exactly which fields need human review.

## What This Skill Does

DeepRead is a production-grade document processing API that **reduces human review from 100% to ~10%** through intelligent quality assessment.

**Core Features:**
- **Text Extraction**: Convert PDFs to clean markdown
- **Structured Data**: Extract JSON fields with confidence scores
- **Quality Flags**: AI determines which fields need human verification (`hil_flag`)
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

**Option B: Poll for Results**
```bash
# Upload PDF without webhook
curl -X POST https://api.deepread.tech/v1/process \
  -H "X-API-Key: $DEEPREAD_API_KEY" \
  -F "file=@document.pdf"

# Returns 
