---
name: dialpad
description: Send SMS and make voice calls via Dialpad API.
homepage: https://github.com/openclaw/skills/tree/main/skills/kesslerio/dialpad/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# dialpad

Send SMS and make voice calls via Dialpad API.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [dialpad](https://github.com/openclaw/skills/tree/main/skills/kesslerio/dialpad/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Dialpad Skill

Send SMS and make voice calls via the Dialpad API.

## Available Phone Numbers

| Number | Purpose | Format |
|--------|---------|--------|
| (415) 520-1316 | Sales Team | Default for sales context |
| (415) 360-2954 | Work/Personal | Default for work context |
| (415) 991-7155 | Support SMS Only | SMS only (no voice) |

Use `--from <number>` to specify which number appears as caller ID.

## Setup

**Required environment variable:**
```
DIALPAD_API_KEY=your_api_key_here
```

**Optional (for ElevenLabs TTS in calls):**
```
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

Get your Dialpad API key from [Dialpad API Settings](https://dialpad.com/api/settings).

## Usage

### Send SMS

```bash
# Basic SMS
python3 send_sms.py --to "+14155551234" --message "Hello from Clawdbot!"

# From specific number (e.g., work phone)
python3 send_sms.py --to "+14155551234" --message "Hello!" --from "+14153602954"

# Batch SMS (up to 10 recipients)
python3 send_sms.py --to "+14155551234" "+14155555678" --message "Group update"
```

### Make Voice Calls

```bash
# Basic call (ring recipient - they'll answer to speak with you)
python3 make_call.py --to "+14155551234"

# Call with Text-to-Speech greeting (Dialpad's robotic TTS)
python3 make_call.py --to "+14155551234" --text "Hello! This is a call from ShapeScale."

# Call from specific number with TTS
python3 make_call.py --to "+14155551234" --from "+14153602954" --text "Meeting reminder"

# With custom voice (requires ELEVENLABS_API_KEY)
python3 make_call.py --to "+14155551234" --voice "Adam" --text "Premium voice test"
```

### From Agent Instructions

**SMS:**
```bash
python3 send_sms.py --to "+14155551234" --message "Your message here"
```

**Voice Call:**
```bash
python3 make_call.py --to "+14155551234" --text "Optional TTS message"
```

## Voice Options

### Low-Cost Voices (Recommended for Budget)
| Voice | Style | Notes |
|-------|-------|-------|
| **Eric** ⭐ | Male, smooth, trustworthy | Low-cost, available! |
| 
