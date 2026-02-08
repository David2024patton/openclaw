---
name: k8-multicluster
description: Manage multiple Kubernetes clusters, switch contexts, and perform cross-cluster operations.
homepage: https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8-multicluster/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# k8-multicluster

Manage multiple Kubernetes clusters, switch contexts, and perform cross-cluster operations.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [k8-multicluster](https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8-multicluster/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Multi-Cluster Kubernetes Management

Cross-cluster operations and context management using kubectl-mcp-server's multi-cluster support.

## Context Management

### List Available Contexts
```
list_contexts_tool()
```

### View Current Context
```
kubeconfig_view()  # Shows sanitized kubeconfig
```

### Switch Context
CLI: `kubectl-mcp-server context <context-name>`

## Cross-Cluster Operations

All kubectl-mcp-server tools support the `context` parameter:

```python
# Get pods from production cluster
get_pods(namespace="default", context="production-cluster")

# Get pods from staging cluster
get_pods(namespace="default", context="staging-cluster")
```

## Common Multi-Cluster Patterns

### Compare Environments

```
# Compare deployment across clusters
compare_namespaces(
    namespace1="production",
    namespace2="staging",
    resource_type="deployment",
    context="production-cluster"
)
```

### Parallel Queries
Query multiple clusters simultaneously:

```
# Production cluster
get_pods(namespace="app", context="prod-us-east")
get_pods(namespace="app", context="prod-eu-west")

# Development cluster
get_pods(namespace="app", context="development")
```

### Cross-Cluster Health Check
```
# Check all clusters
for context in ["prod-1", "prod-2", "staging"]:
    get_nodes(context=context)
    get_pods(namespace="kube-system", context=context)
```

## Cluster API (CAPI) Management

For managing cluster lifecycle:

### List Managed Clusters
```
capi_clusters_list_tool(namespace="capi-system")
```

### Get Cluster Details
```
capi_cluster_get_tool(name="prod-cluster", namespace="capi-system")
```

### Get Workload Cluster Kubeconfig
```
capi_cluster_kubeconfig_tool(name="prod-cluster", namespace="capi-system")
```

### Machine Management
```
capi_machines_list_tool(namespace="capi-system")
capi_machinedeployments_list_tool(namespace="capi-system")
```

### Scale Cluster
```
capi_machinedeployment_scale_tool(
    name="prod-cluster-md-0",
    namespace="capi-system",
   
