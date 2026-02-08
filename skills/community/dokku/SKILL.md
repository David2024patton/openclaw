---
name: dokku
description: Installs, upgrades, and uses Dokku to create apps, deploy, run one-off/background tasks, and clean up containers.
homepage: https://github.com/openclaw/skills/tree/main/skills/akhil-naidu/dokku/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# dokku

Installs, upgrades, and uses Dokku to create apps, deploy, run one-off/background tasks, and clean up containers.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [dokku](https://github.com/openclaw/skills/tree/main/skills/akhil-naidu/dokku/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Dokku

Dokku is a PaaS; commands run on the Dokku host (SSH or local). Prefer running long operations (deploys, builds) in the **background** — use exec with `background: true` or short `yieldMs` when the tool allows.

## Section index

Detailed command syntax and examples live in each section file. Read the relevant file when performing that category of task.

| Section                    | File                                       | Commands / topics                                             |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| Apps                       | [apps/commands.md](apps/commands.md)       | create, destroy, list, rename, clone, lock, unlock, report    |
| Config                     | [config/commands.md](config/commands.md)   | get, set, unset, export                                       |
| Domains                    | [domains/commands.md](domains/commands.md) | add, set, remove, set-global, report                          |
| Git / deploy               | [git/commands.md](git/commands.md)         | from-image, set, deploy-branch, git push                      |
| Run (one-off / background) | [run/commands.md](run/commands.md)         | run, run:detached                                             |
| Logs                       | [logs/commands.md](logs/commands.md)       | logs, logs:failed, logs:set                                   |
| Process (ps)               | [ps/commands.md](ps/commands.md)           | scale, rebuild, restart, start, stop                          |
| Plugin                     | [plugin/commands.md](plugin/commands.md)   | list, install, update, uninstall                              |
| Certs                      | [certs/commands.md](certs/commands.md)     | add, remove, generate                                         |
| Nginx                      | [nginx/commands.md](nginx/commands.md)     | build-config, show
