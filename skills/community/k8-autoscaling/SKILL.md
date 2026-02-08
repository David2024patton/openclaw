---
name: k8-autoscaling
description: Configure Kubernetes autoscaling with HPA, VPA.
homepage: https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8-autoscaling/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# k8-autoscaling

Configure Kubernetes autoscaling with HPA, VPA.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [k8-autoscaling](https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8-autoscaling/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Kubernetes Autoscaling

Comprehensive autoscaling using HPA, VPA, and KEDA with kubectl-mcp-server tools.

## Quick Reference

### HPA (Horizontal Pod Autoscaler)

Basic CPU-based scaling:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

Apply and verify:
```
apply_manifest(hpa_yaml, namespace)
get_hpa(namespace)
```

### VPA (Vertical Pod Autoscaler)

Right-size resource requests:
```yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: my-app-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-app
  updatePolicy:
    updateMode: "Auto"
```

## KEDA (Event-Driven Autoscaling)

### Detect KEDA Installation
```
keda_detect_tool()
```

### List ScaledObjects
```
keda_scaledobjects_list_tool(namespace)
keda_scaledobject_get_tool(name, namespace)
```

### List ScaledJobs
```
keda_scaledjobs_list_tool(namespace)
```

### Trigger Authentication
```
keda_triggerauths_list_tool(namespace)
keda_triggerauth_get_tool(name, namespace)
```

### KEDA-Managed HPAs
```
keda_hpa_list_tool(namespace)
```

See [KEDA-TRIGGERS.md](KEDA-TRIGGERS.md) for trigger configurations.

## Common KEDA Triggers

### Queue-Based Scaling (AWS SQS)
```yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: sqs-scaler
spec:
  scaleTargetRef:
    name: queue-processor
  minReplicaCount: 0  # Scale to zero!
  maxReplicaCount: 100
  triggers:
  - type: aws-sqs-queue
    metadata:
      queueURL: https://sqs.region.amazonaws.com/...
      queueLength: "5"
```

### Cron-Based Scaling
```yaml
triggers:
- type: cron
  metadata:
    timezone: America/New_York
    start: 0 8 * * 1-5   # 8 AM weekdays
    end: 0 18 * * 1-5    # 6 PM weekda
