---
name: gcloud
description: Manage Google Cloud Platform resources via gcloud.
homepage: https://github.com/openclaw/skills/tree/main/skills/jortega0033/gcloud/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# gcloud

Manage Google Cloud Platform resources via gcloud.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [gcloud](https://github.com/openclaw/skills/tree/main/skills/jortega0033/gcloud/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Google Cloud Platform Skill

Manage GCP resources using `gcloud`, `gsutil`, and `firebase` CLIs.

## Installation

### gcloud CLI (one-time setup)

```bash
# Download and extract
cd ~ && curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz
tar -xzf google-cloud-cli-linux-x86_64.tar.gz

# Install (adds to PATH via .bashrc)
./google-cloud-sdk/install.sh --quiet --path-update true

# Reload shell or source
source ~/.bashrc

# Authenticate
gcloud auth login
```

### Firebase CLI

```bash
npm install -g firebase-tools
firebase login
```

## Quick Reference

### Authentication & Config

```bash
# List authenticated accounts
gcloud auth list

# Switch active account
gcloud config set account EMAIL

# List projects
gcloud projects list

# Set default project
gcloud config set project PROJECT_ID

# View current config
gcloud config list
```

---

## Compute Engine (VMs)

### List Instances

```bash
# All instances across projects
gcloud compute instances list --project PROJECT_ID

# With specific fields
gcloud compute instances list --project PROJECT_ID \
  --format="table(name,zone,status,networkInterfaces[0].accessConfigs[0].natIP)"
```

### Start/Stop/Restart

```bash
gcloud compute instances start INSTANCE_NAME --zone ZONE --project PROJECT_ID
gcloud compute instances stop INSTANCE_NAME --zone ZONE --project PROJECT_ID
gcloud compute instances reset INSTANCE_NAME --zone ZONE --project PROJECT_ID
```

### SSH Access

```bash
# Interactive SSH
gcloud compute ssh INSTANCE_NAME --zone ZONE --project PROJECT_ID

# Run command remotely
gcloud compute ssh INSTANCE_NAME --zone ZONE --project PROJECT_ID --command "uptime"

# With tunneling (e.g., for local port forwarding)
gcloud compute ssh INSTANCE_NAME --zone ZONE --project PROJECT_ID -- -L 8080:localhost:8080
```

### View Logs

```bash
# Serial port output (boot logs)
gcloud compute instances get-serial-port-output INSTANCE_NAME --zone ZONE --project PROJECT_ID

# Tail log
