---
name: spaces-listener
description: Record, transcribe, and summarize X/Twitter Spaces — live or replays.
homepage: https://github.com/openclaw/skills/tree/main/skills/jamesalmeida/spaces-listener/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# spaces-listener

Record, transcribe, and summarize X/Twitter Spaces — live or replays.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [spaces-listener](https://github.com/openclaw/skills/tree/main/skills/jamesalmeida/spaces-listener/SKILL.md)
- **Security Status**: SAFE

## Instructions

# spaces-listener

Record, transcribe, and summarize X/Twitter Spaces — live or replays. Supports multiple concurrent recordings.

## Commands

```bash
# Start recording (runs in background)
spaces listen <url>

# Record multiple Spaces at once
spaces listen "https://x.com/i/spaces/1ABC..."
spaces listen "https://x.com/i/spaces/2DEF..."

# List all active recordings
spaces list

# Check specific recording status
spaces status 1

# Stop a recording
spaces stop 1
spaces stop all

# Clean stale pid/meta files
spaces clean

# Transcribe when done
spaces transcribe ~/Desktop/space.m4a --model medium

# Summarize an existing transcript
spaces summarize ~/Desktop/space_transcript.txt

# Skip summarization
spaces transcribe ~/Desktop/space.m4a --no-summarize
```

## Requirements

```bash
brew install yt-dlp ffmpeg openai-whisper
```

For summaries, set `OPENAI_API_KEY` (transcription still works without it).

## How It Works

1. Each `spaces listen` starts a new background recording with a unique ID
2. Recordings persist even if you close terminal
3. Run `spaces list` to see all active recordings
4. When done, `spaces stop <id>` or `spaces stop all`
5. Transcribe with `spaces transcribe <file>`
6. Summaries are generated automatically after transcription (skip with `--no-summarize`)

## Output

Each space gets its own folder under `~/Dropbox/ClawdBox/XSpaces/`:
```
~/Dropbox/ClawdBox/XSpaces/
  space_username_2026-02-03_1430/
    recording.m4a     — audio
    recording.log     — progress log
    transcript.txt    — transcript
    summary.txt       — summary
```

## Critical: Agent Usage Rules

**NEVER set a timeout on Space downloads.** Spaces can be hours long.
yt-dlp stops automatically when the Space ends — don't kill it early.

The correct workflow:
1. Run `spaces listen <url>` — it starts a background process and returns immediately
2. Set a **cron job** (every 5–10 min) to check `spaces list`
3. When recording shows "No active recordings", it's done
4. Transcribe the 
