---
name: dokploy
description: Manage Dokploy deployments, projects, applications, and domains via the Dokploy API.
homepage: https://github.com/openclaw/skills/tree/main/skills/joshuarileydev/dokploy/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# dokploy

Manage Dokploy deployments, projects, applications, and domains via the Dokploy API.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [dokploy](https://github.com/openclaw/skills/tree/main/skills/joshuarileydev/dokploy/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Dokploy Skill

Interact with Dokploy's API to manage projects, applications, domains, and deployments.

## Prerequisites

1. **Dokploy instance** running with API access
2. **API Key** generated from `/settings/profile` → "API/CLI Section"
3. Set the `DOKPLOY_API_URL` environment variable (default: `http://localhost:3000`)

## Configuration

Set these environment variables or use the config command:

```bash
# Dokploy instance URL
export DOKPLOY_API_URL="https://your-dokploy-instance.com"

# Your API token
export DOKPLOY_API_KEY="your-generated-api-key"

# Or run the config command
dokploy-config set --url "https://your-dokploy-instance.com" --key "your-api-key"
```

## Projects

### List all projects
```bash
dokploy-project list
```

### Get project details
```bash
dokploy-project get <project-id>
```

### Create a new project
```bash
dokploy-project create --name "My Project" --description "Description here"
```

### Update a project
```bash
dokploy-project update <project-id> --name "New Name" --description "Updated"
```

### Delete a project
```bash
dokploy-project delete <project-id>
```

## Applications

### List applications in a project
```bash
dokploy-app list --project <project-id>
```

### Get application details
```bash
dokploy-app get <application-id>
```

### Create an application
```bash
dokploy-app create \
  --project <project-id> \
  --name "my-app" \
  --type "docker" \
  --image "nginx:latest"
```

**Application types:** `docker`, `git`, `compose`

### Trigger deployment
```bash
dokploy-app deploy <application-id>
```

### Get deployment logs
```bash
dokploy-app logs <application-id> --deployment <deployment-id>
```

### List deployments
```bash
dokploy-app deployments <application-id>
```

### Update application
```bash
dokploy-app update <application-id> --name "new-name" --env "KEY=VALUE"
```

### Delete an application
```bash
dokploy-app delete <application-id>
```

## Domains

### List domains for an application
```bash
dokploy-domain list
