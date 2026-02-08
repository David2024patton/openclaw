---
name: pi-admin
description: Raspberry Pi system administration.
homepage: https://github.com/openclaw/skills/tree/main/skills/thesethrose/pi-admin/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# pi-admin

Raspberry Pi system administration.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [pi-admin](https://github.com/openclaw/skills/tree/main/skills/thesethrose/pi-admin/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Raspberry Pi Administration

Complete system monitoring and introspection for the Raspberry Pi host. Access network details, system resources, storage, services, and more.

## When to Use
- Checking Pi network configuration (IP, Tailscale)
- Monitoring system resources (CPU, memory, storage)
- Viewing running services and their status
- Checking temperature and hardware info
- Troubleshooting system issues
- Getting system overview for debugging

## Usage

```bash
# Information Commands
cd /home/srose/clawd/skills/pi-admin
./skill.sh overview
./skill.sh network
./skill.sh tailscale
./skill.sh resources
./skill.sh storage
./skill.sh services
./skill.sh hardware

# Maintenance Commands
./skill.sh update       # Update system packages
./skill.sh clean        # Clean unused packages, logs, Docker
./skill.sh reboot       # Reboot with countdown
./skill.sh restart-gateway  # Restart the Clawdis Gateway

# Complete system info
./skill.sh all
```

## Tools Available

| Tool | Description |
|------|-------------|
| `overview` | Quick system summary |
| `network` | IP addresses, hostname, network interfaces |
| `tailscale` | Tailscale status, IP, peers |
| `resources` | CPU, memory, temperature |
| `storage` | Disk usage, mount points |
| `services` | Running services, Gateway status |
| `hardware` | CPU info, Raspberry Pi model, GPU |
| `all` | Complete detailed dump |

## Examples

```bash
# Quick system check
./skill.sh overview

# Debug network issues
./skill.sh network && ./skill.sh tailscale

# Check if Gateway is running
./skill.sh services | grep gateway

# Monitor disk space
./skill.sh storage
```

## Information Collected

**Network:**
- Hostname
- Local IP addresses (eth0, wlan0)
- Network interface details
- DNS configuration

**Tailscale:**
- Status (running/stopped)
- Tailscale IP
- Connected peers
- Exit node status

**Resources:**
- CPU usage
- Memory usage (used/free/total)
- CPU temperature
- Uptime

**Storage:**
- Disk usage by mount point
- Inode usage
-
