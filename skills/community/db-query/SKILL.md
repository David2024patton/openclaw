---
name: db-query
description: Query project databases with automatic SSH tunnel management.
homepage: https://github.com/openclaw/skills/tree/main/skills/zenixp/db-query/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# db-query

Query project databases with automatic SSH tunnel management.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [db-query](https://github.com/openclaw/skills/tree/main/skills/zenixp/db-query/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Database Query

## Overview

Query databases through a centralized configuration file with automatic SSH tunnel management. Handles connection details, SSH tunnel setup/teardown, and query execution.

## Configuration

### Setup

1. **Create config file** at `~/.config/clawdbot/db-config.json`:
   ```bash
   mkdir -p ~/.config/clawdbot
   # Copy example config and edit
   cp /usr/lib/node_modules/clawdbot/skills/db-query/scripts/config.example.json ~/.config/clawdbot/db-config.json
   ```

2. **Add database entries** with these fields:
   - `name`: Description used to find the database (required)
   - `host`: Database host (required)
   - `port`: Database port (default: 3306)
   - `database`: Database name (required)
   - `user`: Database user (required)
   - `password`: Database password (required)
   - `ssh_tunnel`: Optional SSH tunnel configuration

3. **SSH tunnel configuration** (if needed):
   - `enabled`: true/false
   - `ssh_host`: Remote SSH host
   - `ssh_user`: SSH username
   - `ssh_port`: SSH port (default: 22)
   - `local_port`: Local port to forward (e.g., 3307)
   - `remote_host`: Remote database host behind SSH (default: localhost)
   - `remote_port`: Remote database port (default: 3306)

### Example Config

```json
{
  "databases": [
    {
      "name": "生产用户库",
      "host": "localhost",
      "port": 3306,
      "database": "user_db",
      "user": "db_user",
      "password": "secret",
      "ssh_tunnel": {
        "enabled": true,
        "ssh_host": "prod.example.com",
        "ssh_user": "deploy",
        "local_port": 3307
      }
    }
  ]
}
```

## Usage

### List Databases

```bash
python3 /usr/lib/node_modules/clawdbot/skills/db-query/scripts/db_query.py --list
```

### Query a Database

```bash
python3 /usr/lib/node_modules/clawdbot/skills/db-query/scripts/db_query.py \
  --database "生产用户库" \
  --query "SELECT * FROM users LIMIT 10"
```

The script will:
1. Find database by matching description in config
2. Start SSH tunnel (if config
