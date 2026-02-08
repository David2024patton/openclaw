---
name: otter
description: Otter.ai transcription CLI - list, search, download, and sync meeting transcripts.
homepage: https://github.com/openclaw/skills/tree/main/skills/dbhurley/otter/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# otter

Otter.ai transcription CLI - list, search, download, and sync meeting transcripts.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [otter](https://github.com/openclaw/skills/tree/main/skills/dbhurley/otter/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Otter.ai Transcription CLI

Interact with Otter.ai to manage meeting transcripts - list, search, download, upload, summarize, and sync to CRM.

## 🔑 Required Secrets

| Variable | Description | How to Get |
|----------|-------------|------------|
| `OTTER_EMAIL` | Your Otter.ai account email | Your login email |
| `OTTER_PASSWORD` | Your Otter.ai password | Set in Otter account settings |

## 🔐 Optional Secrets (for CRM sync)

| Variable | Description | How to Get |
|----------|-------------|------------|
| `TWENTY_API_URL` | Twenty CRM API endpoint | Your Twenty instance URL |
| `TWENTY_API_TOKEN` | Twenty API key | Twenty → Settings → Developers → API Keys |

## ⚙️ Setup

Configure in `~/.clawdis/clawdis.json`:
```json
{
  "skills": {
    "otter": {
      "env": {
        "OTTER_EMAIL": "you@company.com",
        "OTTER_PASSWORD": "your-password",
        "TWENTY_API_URL": "https://api.your-twenty.com",
        "TWENTY_API_TOKEN": "your-token"
      }
    }
  }
}
```

## 📋 Commands

### List Recent Transcripts
```bash
uv run {baseDir}/scripts/otter.py list [--limit 10]
```

### Get Full Transcript
```bash
uv run {baseDir}/scripts/otter.py get <speech_id>
```

### Search Transcripts
```bash
uv run {baseDir}/scripts/otter.py search "quarterly review"
```

### Download Transcript
```bash
uv run {baseDir}/scripts/otter.py download <speech_id> [--format txt|pdf|docx|srt]
```

### Upload Audio for Transcription
```bash
uv run {baseDir}/scripts/otter.py upload /path/to/audio.mp3
```

### Get AI Summary
```bash
uv run {baseDir}/scripts/otter.py summary <speech_id>
```

### Sync to Twenty CRM
```bash
uv run {baseDir}/scripts/otter.py sync-twenty <speech_id>
uv run {baseDir}/scripts/otter.py sync-twenty <speech_id> --company "Client Name"
```

## 📤 Output Formats

All commands support `--json` for machine-readable output:
```bash
uv run {baseDir}/scripts/otter.py list --json
```

## 🔗 Twenty CRM Integration

When syncing to Twenty, creates:
- **Note** with transcript titl
