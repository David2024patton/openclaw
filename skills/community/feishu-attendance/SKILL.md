---
name: feishu-attendance
description: Monitor Feishu (Lark) attendance records.
homepage: https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-attendance/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# feishu-attendance

Monitor Feishu (Lark) attendance records.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [feishu-attendance](https://github.com/openclaw/skills/tree/main/skills/autogame-17/feishu-attendance/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Feishu Attendance Skill

Monitor daily attendance, notify employees of abnormalities, and report summary to admin.

## Features
- **Smart Checks**: Detects Late, Early Leave, and Absence.
- **Holiday Aware**: Auto-detects holidays/weekends via `timor.tech` API.
- **Safe Mode**: Disables user notifications if holiday API fails (prevents spam).
- **Caching**: Caches user list (24h TTL) and holiday data for performance.
- **Reporting**: Sends rich interactive cards to Admin.

## Usage

```bash
# Check today's attendance (Default)
node index.js check

# Check specific date
node index.js check --date 2023-10-27

# Dry Run (Test mode, no messages sent)
node index.js check --dry-run
```

## Permissions Required
- `attendance:report:readonly`
- `contact:user.employee:readonly`
- `im:message:send_as_bot`
