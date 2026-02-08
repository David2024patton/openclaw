---
name: flyio-cli
description: Fly.io deploy, logs, SSH, secrets, scaling.
homepage: https://github.com/openclaw/skills/tree/main/skills/justinburdett/flyio-cli/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# flyio-cli

Fly.io deploy, logs, SSH, secrets, scaling.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [flyio-cli](https://github.com/openclaw/skills/tree/main/skills/justinburdett/flyio-cli/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Fly.io (flyctl) CLI

Operate Fly.io apps safely and repeatably with `flyctl`.

## Common tasks

- Deploy: `fly deploy` / `fly deploy --remote-only`
- Logs: `fly logs -a <app>`
- SSH / run commands: `fly ssh console -a <app> -C "…"`
- Secrets: `fly secrets list/set -a <app>`
- Postgres: `fly postgres list/connect/db create/attach`
- GitHub Actions deploys / PR previews

## Defaults / safety

- Prefer **read-only** commands first: `fly status`, `fly logs`, `fly config show`, `fly releases`, `fly secrets list`.
- **Do not run state-changing Fly.io commands without explicit user approval** (deploy/scale, secrets set/unset, volume/db create/drop, app destroy, attach/detach).
  - Read-only actions are OK without approval.
  - Destructive actions (destroy/drop) always require explicit approval.
- When debugging, classify the failure as: build/packaging vs runtime vs platform.

## Quick start (typical deploy)

From the app repo directory:

1) Confirm which app you’re targeting
- `fly app list`
- `fly status -a <app>`
- Check `fly.toml` for `app = "..."`

2) Deploy
- `fly deploy` (default)
- `fly deploy --remote-only` (common when local docker/build env is inconsistent)

3) Validate
- `fly status -a <app>`
- `fly logs -a <app>`
- `fly open -a <app>`

## Debugging deploy/build failures

### Common checks
- `fly deploy --verbose` (more build logs)
- If using Dockerfile builds: verify Dockerfile Ruby/version and Gemfile.lock platforms match your builder OS/arch.

### Rails + Docker + native gems (nokogiri, pg, etc.)
Symptoms: Bundler can’t find a platform gem like `nokogiri-…-x86_64-linux` during build.

Fix pattern:
- Ensure `Gemfile.lock` includes the Linux platform used by Fly’s builder (usually `x86_64-linux`).
  - Example: `bundle lock --add-platform x86_64-linux`
- Ensure Dockerfile’s Ruby version matches `.ruby-version`.

(See `references/rails-docker-builds.md`.)

## Logs, SSH, console

- Stream logs:
  - `fly logs -a <app>`
- SSH console:
  - `fly ssh console -a <app
