---
name: jules-cli
description: Interact with the Jules CLI to manage asynchronous coding sessions.
homepage: https://github.com/openclaw/skills/tree/main/skills/ajstafford/jules-cli/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# jules-cli

Interact with the Jules CLI to manage asynchronous coding sessions.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [jules-cli](https://github.com/openclaw/skills/tree/main/skills/ajstafford/jules-cli/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Jules CLI Skill

## Overview
This skill enables the agent to interact with the `jules` CLI. It supports task assignment, session monitoring, and result integration.

## Usage Guidelines (CRITICAL)

To prevent excessive and inappropriate session creation, you **must** follow these rules:

1.  **Local First**: If you can solve the task locally within your current environment (e.g., editing files, running tests, small refactors), **do not** use Jules.
2.  **Complexity Threshold**: Only use Jules for tasks that are:
    *   **Large-scale**: Touching many files or requiring significant architectural changes.
    *   **Isolated**: Benefiting from a clean, remote environment to avoid local dependency issues.
    *   **Exploratory**: Tasks where the solution isn't immediately obvious and requires iteration in a VM.
3.  **No Proliferation (One at a Time)**: 
    *   **Never** create multiple sessions for the same task.
    *   **Never** use a loop or parallel execution to spin up several sessions at once.
    *   Wait for a session to complete and inspect the results before deciding if another session is needed.
4.  **No "Small" Tasks**: Do not submit tasks like "Add a comment", "Change a variable name", or "Fix a typo".

---

## Safety Controls
*   **Approval Required**: If you are unsure if a task is "complex enough" for Jules, ask the user for permission before running `jules remote new`.
*   **Verification**: Always run `jules remote list --session` before creating a new one to ensure you don't already have a pending session for the same repository.

---

## Core Workflow (Manual Control)

Prefer using the CLI directly to maintain situational awareness.

### 1. Pre-flight Check
Verify repository access and format.
```bash
jules remote list --repo
```
*Note: Ensure the repo format is `GITHUB_USERNAME/REPO`.*

### 2. Submit Task
Create a session and capture the Session ID.
```bash
# Capture the output to get the ID
jules remote new --repo <repo> --session "Detailed task 
