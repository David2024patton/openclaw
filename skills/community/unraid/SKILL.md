---
name: unraid
description: Query and monitor Unraid servers via the GraphQL API.
homepage: https://github.com/openclaw/skills/tree/main/skills/jmagar/unraid/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# unraid

Query and monitor Unraid servers via the GraphQL API.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [unraid](https://github.com/openclaw/skills/tree/main/skills/jmagar/unraid/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Unraid API Skill

Query and monitor Unraid servers using the GraphQL API. Access all 27 read-only endpoints for system monitoring, disk health, logs, containers, VMs, and more.

## Quick Start

Set your Unraid server credentials:

```bash
export UNRAID_URL="https://your-unraid-server/graphql"
export UNRAID_API_KEY="your-api-key"
```

**Get API Key:** Settings → Management Access → API Keys → Create (select "Viewer" role)

Use the helper script for any query:

```bash
./scripts/unraid-query.sh -q "{ online }"
```

Or run example scripts:

```bash
./scripts/dashboard.sh              # Complete multi-server dashboard
./examples/disk-health.sh           # Disk temperatures & health
./examples/read-logs.sh syslog 20   # Read system logs
```

## Core Concepts

### GraphQL API Structure

Unraid 7.2+ uses GraphQL (not REST). Key differences:
- **Single endpoint:** `/graphql` for all queries
- **Request exactly what you need:** Specify fields in query
- **Strongly typed:** Use introspection to discover fields
- **No container logs:** Docker container output logs not accessible

### Two Resources for Stats

- **`info`** - Static hardware specs (CPU model, cores, OS version)
- **`metrics`** - Real-time usage (CPU %, memory %, current load)

Always use `metrics` for monitoring, `info` for specifications.

## Common Tasks

### System Monitoring

**Check if server is online:**
```bash
./scripts/unraid-query.sh -q "{ online }"
```

**Get CPU and memory usage:**
```bash
./scripts/unraid-query.sh -q "{ metrics { cpu { percentTotal } memory { used total percentTotal } } }"
```

**Complete dashboard:**
```bash
./scripts/dashboard.sh
```

### Disk Management

**Check disk health and temperatures:**
```bash
./examples/disk-health.sh
```

**Get array status:**
```bash
./scripts/unraid-query.sh -q "{ array { state parityCheckStatus { status progress errors } } }"
```

**List all physical disks (including cache/USB):**
```bash
./scripts/unraid-query.sh -q "{ disks { name } }"
```

### St
