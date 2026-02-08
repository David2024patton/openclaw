---
name: tiangong-notebooklm-cli
description: NotebookLM CLI automation for this workspace: authenticate/login, list/create/use/rename/delete notebooks.
homepage: https://github.com/openclaw/skills/tree/main/skills/fadeloo/tiangong-notebooklm-cli/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# tiangong-notebooklm-cli

NotebookLM CLI automation for this workspace: authenticate/login, list/create/use/rename/delete notebooks.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [tiangong-notebooklm-cli](https://github.com/openclaw/skills/tree/main/skills/fadeloo/tiangong-notebooklm-cli/SKILL.md)
- **Security Status**: SAFE

## Instructions

# NotebookLM

Use the workspace CLI wrapper around NotebookLM. Prefer the script in `scripts/` to avoid manual repo path setup.

## Quick start

```bash
node {baseDir}/scripts/notebooklm.mjs status
node {baseDir}/scripts/notebooklm.mjs login
node {baseDir}/scripts/notebooklm.mjs list
node {baseDir}/scripts/notebooklm.mjs use <notebook_id>
node {baseDir}/scripts/notebooklm.mjs ask "Summarize the key takeaways" --notebook <notebook_id>
```

## Session and auth

```bash
node {baseDir}/scripts/notebooklm.mjs status
node {baseDir}/scripts/notebooklm.mjs login
node {baseDir}/scripts/notebooklm.mjs clear
node {baseDir}/scripts/notebooklm.mjs auth check --test --json
```

## Notebooks

```bash
node {baseDir}/scripts/notebooklm.mjs list
node {baseDir}/scripts/notebooklm.mjs create "Research Notebook"
node {baseDir}/scripts/notebooklm.mjs use <notebook_id>
node {baseDir}/scripts/notebooklm.mjs rename "New Title" --notebook <notebook_id>
node {baseDir}/scripts/notebooklm.mjs delete --notebook <notebook_id> --yes
node {baseDir}/scripts/notebooklm.mjs summary --notebook <notebook_id> --topics
```

## Chat

```bash
node {baseDir}/scripts/notebooklm.mjs ask "What are the top risks?" --notebook <notebook_id>
node {baseDir}/scripts/notebooklm.mjs configure --mode concise --notebook <notebook_id>
node {baseDir}/scripts/notebooklm.mjs history --notebook <notebook_id> --limit 20
```

## Sources

```bash
node {baseDir}/scripts/notebooklm.mjs source add https://example.com --notebook <notebook_id>
node {baseDir}/scripts/notebooklm.mjs source add "Inline notes" --title "Meeting" --notebook <notebook_id>
node {baseDir}/scripts/notebooklm.mjs source add-drive <file_id> "Drive Doc" --notebook <notebook_id>
node {baseDir}/scripts/notebooklm.mjs source add-research "market analysis" --mode deep --import-all
node {baseDir}/scripts/notebooklm.mjs source get <source_id>
node {baseDir}/scripts/notebooklm.mjs source guide <source_id> --json
node {baseDir}/scripts/notebooklm.mjs source fulltext <sou
