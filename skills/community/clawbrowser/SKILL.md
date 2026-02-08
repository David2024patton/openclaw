---
name: clawbrowser
description: Use when the agent needs to drive a browser through the Microsoft Playwright CLI (`playwright-cli`) for navigation,.
homepage: https://github.com/openclaw/skills/tree/main/skills/tezatezaz/clawbrowser/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# clawbrowser

Use when the agent needs to drive a browser through the Microsoft Playwright CLI (`playwright-cli`) for navigation,.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [clawbrowser](https://github.com/openclaw/skills/tree/main/skills/tezatezaz/clawbrowser/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Clawbrowser – browser control via Playwright CLI

## Setup & orientation
1. Install the CLI and verify availability:
   ```bash
   npm install -g @playwright/cli@latest
   playwright-cli --help
   ```
   The CLI is headless by default; add `--headed` to `open` or set `browser.launchOptions.headless` to `false` in `playwright-cli.json` when you need to see the UI.
2. The CLI reads `playwright-cli.json` by default or whatever file you pass with `--config`. Use the config to tune browser name, launch/context options, viewport, timeouts, output directories, and recording settings without changing every command.
3. Keep `playwright-cli --help` terminal-accessible; the script self-documents the latest commands and options so you can refresh your memory before trying a new action.

## Core interaction loop
1. Start with `playwright-cli open <url>` to load the page (add `--session=name` if you want isolation up front).
2. Run `playwright-cli snapshot` to generate element refs (`e1`, `e2`, …) before any interaction. Always re-snapshot after DOM changes or navigation to avoid stale refs.
3. Use refs for actions:
   - `click`, `dblclick`, `hover`, `drag`, `check`, `uncheck`, `select`, `fill`, `type`, `upload`, `eval`
   - Append `[button]`, `[value]`, or JS snippets as needed (e.g., `playwright-cli click e4 right`).
4. Capture output evidence with `screenshot [ref]`, `pdf`, `console [level]`, or `network` to prove the flow or inspect errors.
5. Example flow:
   ```bash
   playwright-cli open https://example.com/login
   playwright-cli snapshot
   playwright-cli fill e1 "user@example.com"
   playwright-cli fill e2 "supersecret"
   playwright-cli click e3
   playwright-cli snapshot
   playwright-cli screenshot
   ```

## Sessions & persistence
- Use `--session=<name>` to keep cookies, storage, and tabs isolated per workflow. Sessions behave like persistent profiles: they remember auth state, history, and tabs between commands.
- Export `PLAYWRIGHT_CLI_SESSION=mysession` if you
