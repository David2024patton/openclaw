---
name: tailscale
description: Manage Tailscale tailnet via CLI and API.
homepage: https://github.com/openclaw/skills/tree/main/skills/jmagar/tailscale/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# tailscale

Manage Tailscale tailnet via CLI and API.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [tailscale](https://github.com/openclaw/skills/tree/main/skills/jmagar/tailscale/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Tailscale Skill

Hybrid skill using CLI for local operations and API for tailnet-wide management.

## Setup

API config (optional, for tailnet-wide operations): `~/.clawdbot/credentials/tailscale/config.json`

```json
{
  "apiKey": "tskey-api-k...",
  "tailnet": "-"
}
```

Get your API key from: Tailscale Admin Console → Settings → Keys → Generate API Key

The `tailnet` can be `-` (auto-detect), your org name, or email domain.

---

## Local Operations (CLI)

These work on the current machine only.

### Status & Diagnostics

```bash
# Current status (peers, connection state)
tailscale status
tailscale status --json | jq '.Peer | to_entries[] | {name: .value.HostName, ip: .value.TailscaleIPs[0], online: .value.Online}'

# Network diagnostics (NAT type, DERP, UDP)
tailscale netcheck
tailscale netcheck --format=json

# Get this machine's Tailscale IP
tailscale ip -4

# Identify a Tailscale IP
tailscale whois 100.x.x.x
```

### Connectivity

```bash
# Ping a peer (shows direct vs relay)
tailscale ping <hostname-or-ip>

# Connect/disconnect
tailscale up
tailscale down

# Use an exit node
tailscale up --exit-node=<node-name>
tailscale exit-node list
tailscale exit-node suggest
```

### File Transfer (Taildrop)

```bash
# Send files to a device
tailscale file cp myfile.txt <device-name>:

# Receive files (moves from inbox to directory)
tailscale file get ~/Downloads
tailscale file get --wait ~/Downloads  # blocks until file arrives
```

### Expose Services

```bash
# Share locally within tailnet (private)
tailscale serve 3000
tailscale serve https://localhost:8080

# Share publicly to internet
tailscale funnel 8080

# Check what's being served
tailscale serve status
tailscale funnel status
```

### SSH

```bash
# SSH via Tailscale (uses MagicDNS)
tailscale ssh user@hostname

# Enable SSH server on this machine
tailscale up --ssh
```

---

## Tailnet-Wide Operations (API)

These manage your entire tailnet. Requires API key.

### List All Devices

```bash
./scripts/ts-api.
