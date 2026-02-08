---
name: kubectl-skill
description: Execute and manage Kubernetes clusters via kubectl commands.
homepage: https://github.com/openclaw/skills/tree/main/skills/ddevaal/kubectl/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# kubectl-skill

Execute and manage Kubernetes clusters via kubectl commands.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [kubectl-skill](https://github.com/openclaw/skills/tree/main/skills/ddevaal/kubectl/SKILL.md)
- **Security Status**: SAFE

## Instructions

# kubectl Skill

Execute Kubernetes cluster management operations using the `kubectl` command-line tool.

## Overview

This skill enables agents to:
- **Query Resources** — List and get details about pods, deployments, services, nodes, etc.
- **Deploy & Update** — Create, apply, patch, and update Kubernetes resources
- **Debug & Troubleshoot** — View logs, execute commands in containers, inspect events
- **Manage Configuration** — Update kubeconfig, switch contexts, manage namespaces
- **Monitor Health** — Check resource usage, rollout status, events, and pod conditions
- **Perform Operations** — Scale deployments, drain nodes, manage taints and labels

## Prerequisites

1. **kubectl binary** installed and accessible on PATH (v1.20+)
2. **kubeconfig** file configured with cluster credentials (default: `~/.kube/config`)
3. **Active connection** to a Kubernetes cluster

## Quick Setup

### Install kubectl

**macOS:**
```bash
brew install kubernetes-cli
```

**Linux:**
```bash
apt-get install -y kubectl  # Ubuntu/Debian
yum install -y kubectl      # RHEL/CentOS
```

**Verify:**
```bash
kubectl version --client
kubectl cluster-info  # Test connection
```

## Essential Commands

### Query Resources
```bash
kubectl get pods                    # List all pods in current namespace
kubectl get pods -A                 # All namespaces
kubectl get pods -o wide            # More columns
kubectl get nodes                   # List nodes
kubectl describe pod POD_NAME        # Detailed info with events
```

### View Logs
```bash
kubectl logs POD_NAME                # Get logs
kubectl logs -f POD_NAME             # Follow logs (tail -f)
kubectl logs POD_NAME -c CONTAINER   # Specific container
kubectl logs POD_NAME --previous     # Previous container logs
```

### Execute Commands
```bash
kubectl exec -it POD_NAME -- /bin/bash   # Interactive shell
kubectl exec POD_NAME -- COMMAND         # Run single command
```

### Deploy Applications
```bash
kubectl apply -f deployment.yaml     
