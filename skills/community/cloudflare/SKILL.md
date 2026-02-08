---
name: cloudflare
description: Manage Cloudflare Workers, KV, D1, R2, and secrets using the Wrangler.
homepage: https://github.com/openclaw/skills/tree/main/skills/asleep123/wrangler/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# cloudflare

Manage Cloudflare Workers, KV, D1, R2, and secrets using the Wrangler.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [cloudflare](https://github.com/openclaw/skills/tree/main/skills/asleep123/wrangler/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Cloudflare (Wrangler CLI)

Manage Cloudflare Workers and associated services via the `wrangler` CLI.

## Prerequisites

- Node.js v20+ required
- Install: `npm install -g wrangler` or use project-local `npx wrangler`
- Auth: `wrangler login` (opens browser for OAuth)
- Verify: `wrangler whoami`

## Quick Reference

### Workers

```bash
# Initialize new worker
wrangler init <name>

# Local development
wrangler dev [script]

# Deploy
wrangler deploy [script]

# List deployments
wrangler deployments list

# View deployment
wrangler deployments view [deployment-id]

# Rollback
wrangler rollback [version-id]

# Delete worker
wrangler delete [name]

# Tail logs (live)
wrangler tail [worker]
```

### Secrets

```bash
# Add/update secret (interactive)
wrangler secret put <key>

# Add secret from stdin
echo "value" | wrangler secret put <key>

# List secrets
wrangler secret list

# Delete secret
wrangler secret delete <key>

# Bulk upload from JSON file
wrangler secret bulk secrets.json
```

### KV (Key-Value Store)

```bash
# Create namespace
wrangler kv namespace create <name>

# List namespaces
wrangler kv namespace list

# Delete namespace
wrangler kv namespace delete --namespace-id <id>

# Put key
wrangler kv key put <key> <value> --namespace-id <id>

# Get key
wrangler kv key get <key> --namespace-id <id>

# Delete key
wrangler kv key delete <key> --namespace-id <id>

# List keys
wrangler kv key list --namespace-id <id>

# Bulk operations (JSON file)
wrangler kv bulk put <file> --namespace-id <id>
wrangler kv bulk delete <file> --namespace-id <id>
```

### D1 (SQL Database)

```bash
# Create database
wrangler d1 create <name>

# List databases
wrangler d1 list

# Database info
wrangler d1 info <name>

# Execute SQL
wrangler d1 execute <database> --command "SELECT * FROM users"

# Execute SQL file
wrangler d1 execute <database> --file schema.sql

# Local execution (for dev)
wrangler d1 execute <database> --local --command "..."

# Export database
wrangler d1 export <n
