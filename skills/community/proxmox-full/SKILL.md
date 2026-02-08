---
name: proxmox-full
description: Complete Proxmox VE management -.
homepage: https://github.com/openclaw/skills/tree/main/skills/msarheed/proxmox-full/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# proxmox-full

Complete Proxmox VE management -.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [proxmox-full](https://github.com/openclaw/skills/tree/main/skills/msarheed/proxmox-full/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Proxmox VE - Full Management

Complete control over Proxmox VE hypervisor via REST API.

## Setup

```bash
export PVE_URL="https://192.168.1.10:8006"
export PVE_TOKEN="user@pam!tokenid=secret-uuid"
```

**Create API token:** Datacenter → Permissions → API Tokens → Add (uncheck Privilege Separation)

## Auth Header

```bash
AUTH="Authorization: PVEAPIToken=$PVE_TOKEN"
```

---

## Cluster & Nodes

```bash
# Cluster status
curl -sk -H "$AUTH" "$PVE_URL/api2/json/cluster/status" | jq

# List nodes
curl -sk -H "$AUTH" "$PVE_URL/api2/json/nodes" | jq '.data[] | {node, status, cpu: (.cpu*100|round), mem_pct: (.mem/.maxmem*100|round)}'

# Node details
curl -sk -H "$AUTH" "$PVE_URL/api2/json/nodes/{node}/status" | jq
```

---

## List VMs & Containers

```bash
# All VMs on node
curl -sk -H "$AUTH" "$PVE_URL/api2/json/nodes/{node}/qemu" | jq '.data[] | {vmid, name, status}'

# All LXC on node
curl -sk -H "$AUTH" "$PVE_URL/api2/json/nodes/{node}/lxc" | jq '.data[] | {vmid, name, status}'

# Cluster-wide (all VMs + LXC)
curl -sk -H "$AUTH" "$PVE_URL/api2/json/cluster/resources?type=vm" | jq '.data[] | {node, type, vmid, name, status}'
```

---

## VM/Container Control

```bash
# Start
curl -sk -X POST -H "$AUTH" "$PVE_URL/api2/json/nodes/{node}/qemu/{vmid}/status/start"

# Stop (immediate)
curl -sk -X POST -H "$AUTH" "$PVE_URL/api2/json/nodes/{node}/qemu/{vmid}/status/stop"

# Shutdown (graceful)
curl -sk -X POST -H "$AUTH" "$PVE_URL/api2/json/nodes/{node}/qemu/{vmid}/status/shutdown"

# Reboot
curl -sk -X POST -H "$AUTH" "$PVE_URL/api2/json/nodes/{node}/qemu/{vmid}/status/reboot"

# For LXC: replace /qemu/ with /lxc/
```

---

## Create LXC Container

```bash
# Get next available VMID
NEWID=$(curl -sk -H "$AUTH" "$PVE_URL/api2/json/cluster/nextid" | jq -r '.data')

# Create container
curl -sk -X POST -H "$AUTH" "$PVE_URL/api2/json/nodes/{node}/lxc" \
  -d "vmid=$NEWID" \
  -d "hostname=my-container" \
  -d "ostemplate=local:vztmpl/debian-12-standard_12.2-1_amd64.tar.zst" \

