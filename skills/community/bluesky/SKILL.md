---
name: bluesky
description: Read, post, and interact with Bluesky (AT Protocol).
homepage: https://github.com/openclaw/skills/tree/main/skills/jeffaf/bluesky/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# bluesky

Read, post, and interact with Bluesky (AT Protocol).

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [bluesky](https://github.com/openclaw/skills/tree/main/skills/jeffaf/bluesky/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Bluesky CLI

Full-featured CLI for Bluesky/AT Protocol.

## Agent Instructions

**First: Check if logged in**
```bash
bsky whoami
```

- If shows handle → ready to use commands below
- If "Not logged in" → guide user through Setup section

**Common tasks:**
- "Post to Bluesky" → `bsky post "text"`
- "Check my timeline" → `bsky timeline`
- "Like this post" → `bsky like <url>`
- "Follow someone" → `bsky follow @handle`

## Setup

If user isn't logged in (`bsky whoami` shows "Not logged in"), guide them through setup:

### Getting an App Password

Tell the user:
> Go to bsky.app → click your avatar → Settings → Privacy and Security → App Passwords → Add App Password. Name it "OpenClaw" and copy the password (like `xxxx-xxxx-xxxx-xxxx`). You'll only see it once!

### Logging In

Once they have the app password, run:
```bash
bsky login --handle THEIR_HANDLE.bsky.social --password THEIR_APP_PASSWORD
```

Example:
```bash
bsky login --handle alice.bsky.social --password abcd-1234-efgh-5678
```

**Security:** Password is used once to get a session token, then immediately discarded. Never stored on disk. Session auto-refreshes.

## Quick Reference

| Action | Command |
|--------|---------|
| View timeline | `bsky timeline` or `bsky tl` |
| Post | `bsky post "text"` |
| Post with image | `bsky post "text" --image photo.jpg --alt "description"` |
| Reply | `bsky reply <url> "text"` |
| Quote-post | `bsky quote <url> "text"` |
| View thread | `bsky thread <url>` |
| Like | `bsky like <url>` |
| Repost | `bsky repost <url>` |
| Follow | `bsky follow @handle` |
| Block | `bsky block @handle` |
| Mute | `bsky mute @handle` |
| Search | `bsky search "query"` |
| Notifications | `bsky notifications` or `bsky n` |
| Delete post | `bsky delete <url>` |

## Commands

### Timeline
```bash
bsky timeline              # 10 posts
bsky timeline -n 20        # 20 posts
bsky timeline --json       # JSON output
```

### Posting
```bash
bsky post "Hello world!"                           # Basi
