---
name: meshguard
description: Manage MeshGuard AI agent governance - agents, policies, audit logs.
homepage: https://github.com/openclaw/skills/tree/main/skills/dbhurley/meshguard/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# meshguard

Manage MeshGuard AI agent governance - agents, policies, audit logs.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [meshguard](https://github.com/openclaw/skills/tree/main/skills/dbhurley/meshguard/SKILL.md)
- **Security Status**: SAFE

## Instructions

# MeshGuard

AI agent governance platform. Manage agents, policies, audit logs, and monitor your MeshGuard instance.

## Setup

First-time setup — run the wizard:
```bash
bash skills/meshguard/scripts/meshguard-setup.sh
```
This saves config to `~/.meshguard/config` (URL, API key, admin token).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MESHGUARD_URL` | Gateway URL (default: `https://dashboard.meshguard.app`) |
| `MESHGUARD_API_KEY` | API key for authenticated requests |
| `MESHGUARD_ADMIN_TOKEN` | Admin token for org management & signup |

Config file `~/.meshguard/config` is sourced automatically by the CLI.

## CLI Usage

All commands go through the wrapper script:
```bash
bash skills/meshguard/scripts/meshguard-cli.sh <command> [args...]
```

### Status Check
```bash
meshguard-cli.sh status
```
Returns gateway health, version, and connectivity.

### Agent Management
```bash
meshguard-cli.sh agents list                          # List all agents in org
meshguard-cli.sh agents create <name> --tier <tier>   # Create agent (tier: free|pro|enterprise)
meshguard-cli.sh agents get <agent-id>                # Get agent details
meshguard-cli.sh agents delete <agent-id>             # Delete agent
```

### Policy Management
```bash
meshguard-cli.sh policies list                        # List all policies
meshguard-cli.sh policies create <yaml-file>          # Create policy from YAML file
meshguard-cli.sh policies get <policy-id>             # Get policy details
meshguard-cli.sh policies delete <policy-id>          # Delete policy
```

Policy YAML format:
```yaml
name: rate-limit-policy
description: Limit agent calls to 100/min
rules:
  - type: rate_limit
    max_requests: 100
    window_seconds: 60
  - type: content_filter
    block_categories: [pii, credentials]
```

### Audit Logs
```bash
meshguard-cli.sh audit query                              # Recent audit events
meshguard-cli.sh audit query --agent <name>               # Filt
