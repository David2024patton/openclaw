---
name: openclaw-nextcloud
description: Manage Notes, Tasks, Calendar, Files, and Contacts in your Nextcloud instance via CalDAV, WebDAV.
homepage: https://github.com/openclaw/skills/tree/main/skills/keithvassallomt/openclaw-nextcloud/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# openclaw-nextcloud

Manage Notes, Tasks, Calendar, Files, and Contacts in your Nextcloud instance via CalDAV, WebDAV.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [openclaw-nextcloud](https://github.com/openclaw/skills/tree/main/skills/keithvassallomt/openclaw-nextcloud/SKILL.md)
- **Security Status**: SAFE

## Instructions

# OpenClaw Nextcloud Skill

This skill provides integration with a Nextcloud instance. It supports access to Notes, Tasks (Todos), Calendars, Files, and Contacts.

## Configuration

The skill requires the following environment variables:

- `NEXTCLOUD_URL`: The base URL of your Nextcloud instance (e.g., `https://cloud.example.com`).
- `NEXTCLOUD_USER`: Your Nextcloud username.
- `NEXTCLOUD_TOKEN`: An App Password (recommended) or your login password.

## Features

### 1. Notes (Read/Write)
- List, get, create, update, and delete notes.
- API: `index.php/apps/notes/api/v1/notes`

### 2. Tasks / Todos (Read/Write)
- List, create, update, delete, and complete tasks.
- API: CalDAV (VTODO).

### 3. Calendar (Read/Write)
- List, create, update, and delete events.
- API: CalDAV (VEVENT).

### 4. Files (Read/Write)
- List, search, upload, download, and delete files.
- API: WebDAV.

### 5. Contacts (Read/Write)
- List, get, create, update, delete, and search contacts.
- API: CardDAV.

## Usage

Run the skill via the bundled script.

```bash
node scripts/nextcloud.js <command> <subcommand> [options]
```

## Commands

### Notes
- `notes list`
- `notes get --id <id>`
- `notes create --title <t> --content <c> [--category <cat>]`
- `notes edit --id <id> [--title <t>] [--content <c>] [--category <cat>]`
- `notes delete --id <id>`

### Tasks
- `tasks list [--calendar <c>]`
- `tasks create --title <t> [--calendar <c>] [--due <d>] [--priority <p>] [--description <d>]`
- `tasks edit --uid <u> [--calendar <c>] [--title <t>] [--due <d>] [--priority <p>] [--description <d>]`
- `tasks delete --uid <u> [--calendar <c>]`
- `tasks complete --uid <u> [--calendar <c>]`

### Calendar Events
- `calendar list [--from <iso>] [--to <iso>]` (Defaults to next 7 days)
- `calendar create --summary <s> --start <iso> --end <iso> [--calendar <c>] [--description <d>]`
- `calendar edit --uid <u> [--calendar <c>] [--summary <s>] [--start <iso>] [--end <iso>] [--description <d>]`
- `calendar delete --uid <u> 
