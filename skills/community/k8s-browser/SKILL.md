---
name: k8s-browser
description: Browser automation for Kubernetes dashboards and web.
homepage: https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8s-browser/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# k8s-browser

Browser automation for Kubernetes dashboards and web.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [k8s-browser](https://github.com/openclaw/skills/tree/main/skills/rohitg00/k8s-browser/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Browser Automation for Kubernetes

Automate Kubernetes web UIs using kubectl-mcp-server's browser tools (26 tools).

## Enable Browser Tools

```bash
export MCP_BROWSER_ENABLED=true

# Optional: Cloud provider
export MCP_BROWSER_PROVIDER=browserbase  # or browseruse
export BROWSERBASE_API_KEY=bb_...
```

## Basic Navigation

```python
# Open URL
browser_open(url="http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/")

# Open with auth headers
browser_open_with_headers(
    url="https://grafana.example.com",
    headers={"Authorization": "Bearer token123"}
)

# Navigate
browser_navigate(url="https://argocd.example.com/applications")

# Go back/forward
browser_back()
browser_forward()

# Refresh
browser_refresh()
```

## Screenshots and Content

```python
# Take screenshot
browser_screenshot(path="dashboard.png")

# Full page screenshot
browser_screenshot(path="full-page.png", full_page=True)

# Get page content
browser_content()

# Get page title
browser_title()

# Get current URL
browser_url()
```

## Interactions

```python
# Click element
browser_click(selector="button.submit")
browser_click(selector="text=Deploy")
browser_click(selector="#sync-button")

# Type text
browser_type(selector="input[name=search]", text="my-deployment")
browser_type(selector=".search-box", text="nginx")

# Fill form
browser_fill(selector="#namespace", text="production")

# Select dropdown
browser_select(selector="select#cluster", value="prod-cluster")

# Press key
browser_press(key="Enter")
browser_press(key="Escape")
```

## Waiting

```python
# Wait for element
browser_wait_for_selector(selector=".loading", state="hidden")
browser_wait_for_selector(selector=".data-table", state="visible")

# Wait for navigation
browser_wait_for_navigation()

# Wait for network idle
browser_wait_for_load_state(state="networkidle")
```

## Session Management

```python
# List sessions
browser_session_list()

# Switch session
browser_session_switch(se
