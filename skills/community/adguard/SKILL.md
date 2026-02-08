---
name: adguard
description: Control AdGuard Home DNS filtering via HTTP API.
homepage: https://github.com/openclaw/skills/tree/main/skills/rowbotik/adguard/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# adguard

Control AdGuard Home DNS filtering via HTTP API.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [adguard](https://github.com/openclaw/skills/tree/main/skills/rowbotik/adguard/SKILL.md)
- **Security Status**: SAFE

## Instructions

# AdGuard Home Controller

Manage AdGuard Home DNS filtering from the command line via the REST API.

## Requirements

- AdGuard Home running with web interface
- Admin username and password
- `curl` installed (usually default on macOS/Linux)

## Quick Start

```bash
# Set password once
export ADGUARD_PASSWORD=your_admin_password

# Use commands
./adguard.sh status
./adguard.sh check example.com
./adguard.sh allow broken-site.com
./adguard.sh block malware.ru
```

## Configuration

Set environment variables for your AdGuard instance:

```bash
export ADGUARD_URL="http://192.168.1.100:3000"      # Your AdGuard IP and port
export ADGUARD_USERNAME="admin"                     # Usually 'admin' (default)
export ADGUARD_PASSWORD="your_admin_password"       # REQUIRED
```

Add to `~/.bashrc` or `~/.zshrc` for persistence.

### Config File Alternative

Create `~/.adguard/config.json` (optional):

```json
{
  "url": "http://192.168.1.100:3000",
  "username": "admin"
}
```

Then set `ADGUARD_PASSWORD` separately for security.

## Commands

### check `<domain>`

Check if a domain is currently blocked or allowed.

```bash
./adguard.sh check doubleclick.net
# ✗ doubleclick.net IS BLOCKED
#   Blocked by: Adblock Plus filter

./adguard.sh check example.com
# ✓ example.com is NOT blocked (allowed)
```

### allow `<domain>` | whitelist `<domain>`

Add a domain to the allowlist (whitelist). Creates an exception rule that overrides blocklists.

```bash
./adguard.sh allow broken-site.com
# ✓ Added rule: @@||broken-site.com^
#   Domain: broken-site.com
#   Action: allow
```

### block `<domain>` | blacklist `<domain>`

Add a domain to the blocklist. Creates a custom blocking rule.

```bash
./adguard.sh block spyware-domain.ru
# ✓ Added rule: ||spyware-domain.ru^
#   Domain: spyware-domain.ru
#   Action: block
```

### status | stats

Display DNS filtering statistics and protection state.

```bash
./adguard.sh status
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# AdGuard Home Status
# ━━━━━━━━━━━━━━
