---
name: playwright-cli
description: Browser automation via Playwright CLI for testing and scraping.
homepage: https://github.com/openclaw/skills/tree/main/skills/gumadeiras/playwright-cli/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# playwright-cli

Browser automation via Playwright CLI for testing and scraping.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [playwright-cli](https://github.com/openclaw/skills/tree/main/skills/gumadeiras/playwright-cli/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Playwright CLI

Browser automation via Playwright. Token-efficient CLI for coding agents.

## Installation

```bash
npm install -g @playwright/mcp@latest
playwright-cli --help
```

## Core Commands

| Command | Description |
|---------|-------------|
| `playwright-cli open <url>` | Open URL in browser |
| `playwright-cli close` | Close the page |
| `playwright-cli type <text>` | Type text into editable element |
| `playwright-cli click <ref> [button]` | Click on element |
| `playwright-cli dblclick <ref> [button]` | Double click |
| `playwright-cli fill <ref> <text>` | Fill text into field |
| `playwright-cli drag <startRef> <endRef>` | Drag and drop |
| `playwright-cli hover <ref>` | Hover over element |
| `playwright-cli check <ref>` | Check checkbox/radio |
| `playwright-cli uncheck <ref>` | Uncheck checkbox |
| `playwright-cli select <ref> <val>` | Select dropdown option |
| `playwright-cli snapshot` | Capture page snapshot for refs |

## Navigation

```bash
playwright-cli go-back           # Go back
playwright-cli go-forward        # Go forward
playwright-cli reload            # Reload page
```

## Keyboard & Mouse

```bash
playwright-cli press <key>       # Press key (a, arrowleft, enter...)
playwright-cli keydown <key>     # Key down
playwright-cli keyup <key>       # Key up
playwright-cli mousemove <x> <y> # Move mouse
playwright-cli mousedown [button] # Mouse down
playwright-cli mouseup [button]   # Mouse up
playwright-cli mousewheel <dx> <dy> # Scroll
```

## Save & Export

```bash
playwright-cli screenshot [ref]  # Screenshot page or element
playwright-cli pdf               # Save as PDF
```

## Tabs

```bash
playwright-cli tab-list          # List all tabs
playwright-cli tab-new [url]     # Open new tab
playwright-cli tab-close [index] # Close tab
playwright-cli tab-select <index> # Switch tab
```

## DevTools

```bash
playwright-cli console [min-level]  # View console messages
playwright-cli network              # View network requests
playwright-cli 
