---
name: glasses-to-social
description: Turn smart glasses photos into social media posts.
homepage: https://github.com/openclaw/skills/tree/main/skills/junebugg1214/glasses-to-social/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# glasses-to-social

Turn smart glasses photos into social media posts.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [glasses-to-social](https://github.com/openclaw/skills/tree/main/skills/junebugg1214/glasses-to-social/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Glasses-to-Social

Transform photos from smart glasses into social media posts with AI-generated captions.

## Overview

This skill creates a pipeline from smart glasses (Meta Ray-Ban, etc.) to social media:

1. User snaps photo with glasses
2. Photo syncs to Google Drive folder
3. Agent detects new photo, analyzes with vision
4. Agent drafts post matching user's voice/style
5. User approves, agent publishes

## Setup

### 1. Configure Google Drive Folder

Create a shared Google Drive folder for glasses photos:

```bash
# User creates folder "Glasses-to-Social" in Google Drive
# Share with "Anyone with link can view"
# Copy the folder URL
```

### 2. Set Up Config

Create config file at `glasses-to-social/config.json`:

```json
{
  "googleDriveFolderUrl": "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
  "folderId": "YOUR_FOLDER_ID",
  "downloadPath": "./glasses-to-social/downloads",
  "processedFile": "./glasses-to-social/data/processed.json",
  "defaultHashtags": ["#MedicalAI", "#HealthTech"],
  "autoPost": false
}
```

### 3. Configure Glasses Auto-Sync

For Meta Ray-Ban glasses:
1. Open Meta View app on phone
2. Settings > Gallery > Enable "Import Automatically"
3. iOS: Enable Google Photos backup (syncs Camera Roll)
4. Create iOS Shortcut to copy new Meta photos to Google Drive folder

## Usage

### Manual Check

Ask the agent to check for new photos:

```
Check my glasses folder for new photos
```

### Automated Monitoring

Set up a cron job to check periodically:

```json
{
  "name": "Glasses-to-Social: Check photos",
  "schedule": {"kind": "cron", "expr": "*/15 * * * *", "tz": "UTC"},
  "payload": {
    "message": "Check the Glasses-to-Social folder for new photos. If found, analyze and draft a tweet."
  }
}
```

### Processing Flow

When a new photo is detected:

1. Download from Google Drive using `gdown`:
   ```bash
   gdown --folder "FOLDER_URL" -O ./downloads/ --remaining-ok
   ```

2. Compare against processed list in `data/processed.json`


