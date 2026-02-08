---
name: yt-dlp-downloader-skill
description: Download videos from YouTube, Bilibili, Twitter, and thousands of other sites using yt-dlp.
homepage: https://github.com/openclaw/skills/tree/main/skills/apollo1234/yt-dlp-downloader-skill/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# yt-dlp-downloader-skill

Download videos from YouTube, Bilibili, Twitter, and thousands of other sites using yt-dlp.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [yt-dlp-downloader-skill](https://github.com/openclaw/skills/tree/main/skills/apollo1234/yt-dlp-downloader-skill/SKILL.md)
- **Security Status**: SAFE

## Instructions

# yt-dlp Video Downloader

Download videos from thousands of websites using yt-dlp.

## Prerequisites

Before downloading, verify dependencies are installed:

```bash
# Check yt-dlp
which yt-dlp || echo "yt-dlp not installed. Install with: pip install yt-dlp"

# Check ffmpeg (required for audio extraction and format merging)
which ffmpeg || echo "ffmpeg not installed. Install with: brew install ffmpeg"
```

If not installed, install them first:
```bash
pip install yt-dlp
brew install ffmpeg  # macOS
```

## Quick Start

### Basic Download (Best Quality)

```bash
yt-dlp -P "~/Downloads/yt-dlp" "VIDEO_URL"
```

### YouTube Download (Recommended - with cookies)

YouTube often blocks direct downloads with 403 errors. Always use browser cookies for YouTube:

```bash
yt-dlp -P "~/Downloads/yt-dlp" --cookies-from-browser chrome "YOUTUBE_URL"
```

Supported browsers: `chrome`, `firefox`, `safari`, `edge`, `brave`, `opera`

### Download with Custom Output Path

```bash
yt-dlp -P "/path/to/save" -o "%(title)s.%(ext)s" "VIDEO_URL"
```

## Common Tasks

### 1. Download Video (Default - Best Quality)

```bash
yt-dlp -P "~/Downloads/yt-dlp" "VIDEO_URL"
```

### 2. Extract Audio Only (MP3)

```bash
yt-dlp -P "~/Downloads/yt-dlp" -x --audio-format mp3 "VIDEO_URL"
```

### 3. Download with Subtitles

```bash
yt-dlp -P "~/Downloads/yt-dlp" --write-subs --sub-langs all "VIDEO_URL"
```

### 4. Download Specific Quality

**720p:**
```bash
yt-dlp -P "~/Downloads/yt-dlp" -f "bestvideo[height<=720]+bestaudio/best[height<=720]" "VIDEO_URL"
```

**1080p:**
```bash
yt-dlp -P "~/Downloads/yt-dlp" -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" "VIDEO_URL"
```

**Best available:**
```bash
yt-dlp -P "~/Downloads/yt-dlp" -f "bestvideo+bestaudio/best" "VIDEO_URL"
```

### 5. List Available Formats (Before Download)

```bash
yt-dlp -F "VIDEO_URL"
```

Then download specific format by ID:
```bash
yt-dlp -P "~/Downloads/yt-dlp" -f FORMAT_ID "VIDEO_URL"
```

### 6. Download Playlist

```bash
