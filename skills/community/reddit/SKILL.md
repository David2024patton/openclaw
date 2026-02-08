---
name: reddit
description: Browse, search, post.
homepage: https://github.com/openclaw/skills/tree/main/skills/theglove44/reddit/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# reddit

Browse, search, post.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [reddit](https://github.com/openclaw/skills/tree/main/skills/theglove44/reddit/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Reddit

Browse, search, post to, and moderate subreddits. Read-only actions work without auth; posting/moderation requires OAuth setup.

## Setup (for posting/moderation)

1. Go to https://www.reddit.com/prefs/apps
2. Click "create another app..."
3. Select "script" type
4. Set redirect URI to `http://localhost:8080`
5. Note your client ID (under app name) and client secret
6. Set environment variables:
   ```bash
   export REDDIT_CLIENT_ID="your_client_id"
   export REDDIT_CLIENT_SECRET="your_client_secret"
   export REDDIT_USERNAME="your_username"
   export REDDIT_PASSWORD="your_password"
   ```

## Read Posts (no auth required)

```bash
# Hot posts from a subreddit
node {baseDir}/scripts/reddit.mjs posts wallstreetbets

# New posts
node {baseDir}/scripts/reddit.mjs posts wallstreetbets --sort new

# Top posts (day/week/month/year/all)
node {baseDir}/scripts/reddit.mjs posts wallstreetbets --sort top --time week

# Limit results
node {baseDir}/scripts/reddit.mjs posts wallstreetbets --limit 5
```

## Search Posts

```bash
# Search within a subreddit
node {baseDir}/scripts/reddit.mjs search wallstreetbets "YOLO"

# Search all of Reddit
node {baseDir}/scripts/reddit.mjs search all "stock picks"
```

## Get Comments on a Post

```bash
# By post ID or full URL
node {baseDir}/scripts/reddit.mjs comments POST_ID
node {baseDir}/scripts/reddit.mjs comments "https://reddit.com/r/subreddit/comments/abc123/..."
```

## Submit a Post (requires auth)

```bash
# Text post
node {baseDir}/scripts/reddit.mjs submit yoursubreddit --title "Weekly Discussion" --text "What's on your mind?"

# Link post
node {baseDir}/scripts/reddit.mjs submit yoursubreddit --title "Great article" --url "https://example.com/article"
```

## Reply to a Post/Comment (requires auth)

```bash
node {baseDir}/scripts/reddit.mjs reply THING_ID "Your reply text here"
```

## Moderation (requires auth + mod permissions)

```bash
# Remove a post/comment
node {baseDir}/scripts/reddit.mjs mod remove THING_ID

# 
