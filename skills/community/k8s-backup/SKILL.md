---
name: k8s-backup
description: Kubernetes backup and restore with Velero.
homepage: https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8s-backup/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# k8s-backup

Kubernetes backup and restore with Velero.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [k8s-backup](https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8s-backup/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Kubernetes Backup with Velero

Manage backups and restores using kubectl-mcp-server's Velero tools.

## Check Velero Installation

```python
# Detect Velero
velero_detect_tool()

# List backup locations
velero_backup_locations_list_tool()
```

## Create Backups

```python
# Backup entire namespace
velero_backup_create_tool(
    name="my-backup",
    namespaces=["default", "app-namespace"]
)

# Backup with label selector
velero_backup_create_tool(
    name="app-backup",
    namespaces=["default"],
    label_selector="app=my-app"
)

# Backup excluding resources
velero_backup_create_tool(
    name="config-backup",
    namespaces=["default"],
    exclude_resources=["pods", "replicasets"]
)

# Backup with TTL
velero_backup_create_tool(
    name="daily-backup",
    namespaces=["production"],
    ttl="720h"  # 30 days
)
```

## List and Describe Backups

```python
# List all backups
velero_backups_list_tool()

# Get backup details
velero_backup_get_tool(name="my-backup")

# Check backup status
# - New: Backup request created
# - InProgress: Backup running
# - Completed: Backup successful
# - Failed: Backup failed
# - PartiallyFailed: Some items failed
```

## Restore from Backup

```python
# Full restore
velero_restore_create_tool(
    name="my-restore",
    backup_name="my-backup"
)

# Restore to different namespace
velero_restore_create_tool(
    name="my-restore",
    backup_name="my-backup",
    namespace_mappings={"old-ns": "new-ns"}
)

# Restore specific resources
velero_restore_create_tool(
    name="config-restore",
    backup_name="my-backup",
    include_resources=["configmaps", "secrets"]
)

# Restore excluding resources
velero_restore_create_tool(
    name="partial-restore",
    backup_name="my-backup",
    exclude_resources=["persistentvolumeclaims"]
)
```

## List and Monitor Restores

```python
# List restores
velero_restores_list_tool()

# Get restore details
velero_restore_get_tool(name="my-restore")
```

## Scheduled Backups

```python
# List schedules

