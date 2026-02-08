---
name: joan-workflow
description: This skill should be used when the user asks about "joan", "pods", "workspace", "domain knowledge".
homepage: https://github.com/openclaw/skills/tree/main/skills/donny-son/joan-workflow/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# Joan Workflow

This skill should be used when the user asks about "joan", "pods", "workspace", "domain knowledge".

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [Joan Workflow](https://github.com/openclaw/skills/tree/main/skills/donny-son/joan-workflow/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Joan Workflow

Joan is a workspace-based knowledge and task management system for AI-assisted development. This skill covers when and how to use Joan's core concepts.

## Core Concepts

### Workspaces

Workspaces are the top-level organizational unit in Joan. Each workspace contains:
- **Pods**: Versioned domain knowledge documents
- **Todos**: Tasks scoped to the workspace
- **Plans**: Implementation specs linked to todos
- **Members**: Team members with roles (admin, member)

### Pods

Pods are versioned markdown documents containing domain knowledge. Use pods to:
- Document project architecture and design decisions
- Store domain-specific terminology and business rules
- Share knowledge across team members and AI assistants
- Maintain living documentation that evolves with the project

**Pod lifecycle:**
1. Create locally with `joan pod create`
2. Edit the markdown file in `.joan/pods/`
3. Push to server with `joan pod push`
4. Pull latest with `joan pod pull`

### Todos

Todos are tasks scoped to a workspace. Use todos to:
- Track work items across team members
- Assign tasks and set priorities
- Link implementation plans to tasks

**Todo workflow:**
1. Create with `joan todo create`
2. List with `joan todo list`
3. Update status as work progresses
4. Archive when complete

### Plans

Plans are implementation specs linked to todos. Use plans to:
- Document how a feature will be implemented
- Break down complex tasks into steps
- Share implementation approach with team

## CLI Commands Reference

### Project Initialization

```bash
joan init                    # Interactive workspace selection
joan init -w <workspace-id>  # Non-interactive with specific workspace
joan status                  # Show project and auth status
```

### Pod Management

```bash
joan pod list               # List tracked pods
joan pod list --all         # List all workspace pods
joan pod add                # Add workspace pods to project
joan pod create             # Create new pod loc
