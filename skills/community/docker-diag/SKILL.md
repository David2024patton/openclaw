---
name: docker-diag
description: Advanced log analysis for Docker containers using signal extraction.
homepage: https://github.com/openclaw/skills/tree/main/skills/mkrdiop/docker-diag/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# docker-diag

Advanced log analysis for Docker containers using signal extraction.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [docker-diag](https://github.com/openclaw/skills/tree/main/skills/mkrdiop/docker-diag/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Docker Pro Diagnostic

When a user asks "Why is my container failing?" or "Analyze the logs for [container]", follow these steps:

1.  **Run Extraction:** Call `python3 {{skillDir}}/log_processor.py <container_name>`.
2.  **Analyze:** Feed the output (which contains errors and context) into your reasoning engine.
3.  **Report:** Summarize the root cause. If it looks like a code error, suggest a fix. If it looks like a resource error (OOM), suggest increasing Docker memory limits.

## Example Command
`python3 log_processor.py api_gateway_prod`
