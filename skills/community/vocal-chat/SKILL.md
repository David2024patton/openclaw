---
name: vocal-chat
description: Handles voice-to-voice conversations on WhatsApp.
homepage: https://github.com/openclaw/skills/tree/main/skills/rubenfb23/vocal-chat/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# vocal-chat

Handles voice-to-voice conversations on WhatsApp.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [vocal-chat](https://github.com/openclaw/skills/tree/main/skills/rubenfb23/vocal-chat/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Walkie-Talkie Mode

This skill automates the voice-to-voice loop on WhatsApp using local transcription and local TTS.

## Workflow

1. **Incoming Audio**: When a user sends an audio/ogg/opus file:
   - Use `tools/transcribe_voice.sh` to get the text.
   - Process the text as a normal user prompt.

2. **Outgoing Response**:
   - Instead of a text reply, generate speech using `bin/sherpa-onnx-tts`.
   - Send the resulting `.ogg` file back to the user as a voice note.

## Triggers

- User sends an audio message.
- User says "activa modo walkie-talkie" or "hablemos por voz".

## Constraints

- Use local tools only (ffmpeg, whisper-cpp, sherpa-onnx-tts).
- Maintain a fast response time (RTF < 0.5).
- Always reply with BOTH text (for clarity) and audio.

## Manual Execution (Internal)

To respond with voice manually:
```bash
bin/sherpa-onnx-tts /tmp/reply.ogg "Tu mensaje aquí"
```
Then send `/tmp/reply.ogg` via `message` tool with `filePath`.
