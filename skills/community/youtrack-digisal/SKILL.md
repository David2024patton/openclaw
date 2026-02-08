---
name: youtrack-digisal
description: Interact with YouTrack project management system via REST API.
homepage: https://github.com/openclaw/skills/tree/main/skills/digisal/youtrack-digisal/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# youtrack-digisal

Interact with YouTrack project management system via REST API.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [youtrack-digisal](https://github.com/openclaw/skills/tree/main/skills/digisal/youtrack-digisal/SKILL.md)
- **Security Status**: SAFE

## Instructions

# YouTrack

YouTrack integration for project management, time tracking, and knowledge base.

## Quick Start

### Authentication

To generate a permanent token:
1. From the main navigation menu, select **Administration** > **Access Management** > **Users**
2. Find your user and click to open settings
3. Generate a new permanent API token
4. Set the token as an environment variable:

```bash
export YOUTRACK_TOKEN=your-permanent-token-here
```

**Important:** Configure your hourly rate (default $100/hour) by passing `--rate` to invoice_generator.py or updating `hourly_rate` parameter in your code.

Then use any YouTrack script:

```bash
# List all projects
python3 scripts/youtrack_api.py --url https://your-instance.youtrack.cloud --list-projects

# List issues in a project
python3 scripts/youtrack_api.py --url https://your-instance.youtrack.cloud --list-issues "project: MyProject"

# Generate invoice for a project
python3 scripts/invoice_generator.py --url https://your-instance.youtrack.cloud --project MyProject --month "January 2026" --from-date "2026-01-01"
```

## Python Scripts

### `scripts/youtrack_api.py`

Core API client for all YouTrack operations.

**In your Python code:**
```python
from youtrack_api import YouTrackAPI

api = YouTrackAPI('https://your-instance.youtrack.cloud', token='your-token')

# Projects
projects = api.get_projects()
project = api.get_project('project-id')

# Issues
issues = api.get_issues(query='project: MyProject')
issue = api.get_issue('issue-id')

# Create issue
api.create_issue('project-id', 'Summary', 'Description')

# Work items (time tracking)
work_items = api.get_work_items('issue-id')
issue_with_time = api.get_issue_with_work_items('issue-id')

# Knowledge base
articles = api.get_articles()
article = api.get_article('article-id')
api.create_article('project-id', 'Title', 'Content')
```

**CLI usage:**
```bash
python3 scripts/youtrack_api.py --url https://your-instance.youtrack.cloud \
    --token YOUR_TOKEN \
    --list-projects
