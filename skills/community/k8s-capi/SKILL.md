---
name: k8s-capi
description: Cluster API lifecycle management for provisioning, scaling, and upgrading Kubernetes clusters.
homepage: https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8s-capi/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# k8s-capi

Cluster API lifecycle management for provisioning, scaling, and upgrading Kubernetes clusters.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [k8s-capi](https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8s-capi/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Cluster API Lifecycle Management

Manage Kubernetes clusters using kubectl-mcp-server's Cluster API tools (11 tools).

## Check Installation

```python
capi_detect_tool()
```

## List Clusters

```python
# List all CAPI clusters
capi_clusters_list_tool(namespace="default")

# Shows:
# - Cluster name
# - Phase (Provisioning, Provisioned, Deleting)
# - Infrastructure ready
# - Control plane ready
```

## Get Cluster Details

```python
capi_cluster_get_tool(name="my-cluster", namespace="default")

# Shows:
# - Spec (control plane, infrastructure)
# - Status (phase, conditions)
# - Network configuration
```

## Get Cluster Kubeconfig

```python
# Get kubeconfig for workload cluster
capi_cluster_kubeconfig_tool(name="my-cluster", namespace="default")

# Returns kubeconfig to access the cluster
```

## Machines

### List Machines

```python
capi_machines_list_tool(namespace="default")

# Shows:
# - Machine name
# - Cluster
# - Phase (Running, Provisioning, Failed)
# - Provider ID
# - Version
```

### Get Machine Details

```python
capi_machine_get_tool(name="my-cluster-md-0-xxx", namespace="default")
```

## Machine Deployments

### List Machine Deployments

```python
capi_machinedeployments_list_tool(namespace="default")

# Shows:
# - Deployment name
# - Cluster
# - Replicas (ready/total)
# - Version
```

### Scale Machine Deployment

```python
# Scale worker nodes
capi_machinedeployment_scale_tool(
    name="my-cluster-md-0",
    namespace="default",
    replicas=5
)
```

## Machine Sets

```python
capi_machinesets_list_tool(namespace="default")
```

## Machine Health Checks

```python
capi_machinehealthchecks_list_tool(namespace="default")

# Health checks automatically remediate unhealthy machines
```

## Cluster Classes

```python
# List cluster templates
capi_clusterclasses_list_tool(namespace="default")

# ClusterClasses define reusable cluster configurations
```

## Create Cluster

```python
kubectl_apply(manifest="""
apiVersion: cluster.x-k8s.io/v1beta1
kind: C
