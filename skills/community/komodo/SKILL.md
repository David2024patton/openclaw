---
name: komodo
description: Manage Komodo infrastructure - servers, Docker deployments, stacks, builds.
homepage: https://github.com/openclaw/skills/tree/main/skills/weird-aftertaste/komodo/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# komodo

Manage Komodo infrastructure - servers, Docker deployments, stacks, builds.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [komodo](https://github.com/openclaw/skills/tree/main/skills/weird-aftertaste/komodo/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Komodo Skill

Manage servers, Docker containers, stacks, builds, and procedures via Komodo Core API.

## Prerequisites

Set environment variables:
- `KOMODO_ADDRESS` - Komodo Core URL (e.g., `https://komodo.example.com`)
- `KOMODO_API_KEY` - API key (starts with `K-`)
- `KOMODO_API_SECRET` - API secret (starts with `S-`)

## Quick Reference

```bash
# Set env (or source from credentials file)
export KOMODO_ADDRESS="https://komodo.weird.cyou"
export KOMODO_API_KEY="K-..."
export KOMODO_API_SECRET="S-..."

# List resources
python scripts/komodo.py servers
python scripts/komodo.py deployments
python scripts/komodo.py stacks
python scripts/komodo.py builds
python scripts/komodo.py procedures
python scripts/komodo.py repos

# Server operations
python scripts/komodo.py server <name>
python scripts/komodo.py server-stats <name>

# Deployment operations
python scripts/komodo.py deployment <name>
python scripts/komodo.py deploy <name>
python scripts/komodo.py start <name>
python scripts/komodo.py stop <name>
python scripts/komodo.py restart <name>
python scripts/komodo.py logs <name> [lines]

# Stack operations
python scripts/komodo.py stack <name>
python scripts/komodo.py deploy-stack <name>
python scripts/komodo.py start-stack <name>
python scripts/komodo.py stop-stack <name>
python scripts/komodo.py restart-stack <name>
python scripts/komodo.py create-stack <name> <server> <compose.yml> [env_file]
python scripts/komodo.py delete-stack <name>
python scripts/komodo.py stack-logs <name> [service]

# Build operations
python scripts/komodo.py build <name>
python scripts/komodo.py run-build <name>

# Procedure operations
python scripts/komodo.py procedure <name>
python scripts/komodo.py run-procedure <name>
```

## State Indicators

- 🟢 Running/Ok
- 🔴 Stopped
- ⚪ NotDeployed
- 🟡 Unhealthy
- 🔄 Restarting
- 🔨 Building
- ⏳ Pending

## Direct API Calls

For operations not covered by the CLI, use curl:

```bash
# Read operation
curl -X POST "$KOMODO_ADDRESS/read/ListServers" \
  -
