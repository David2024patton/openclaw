---
name: 4chan-reader
description: Browse 4chan boards and extract thread discussions into structured text files.
homepage: https://github.com/openclaw/skills/tree/main/skills/aiasisbot61/4chan-reader/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# 4chan-reader

Browse 4chan boards and extract thread discussions into structured text files.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [4chan-reader](https://github.com/openclaw/skills/tree/main/skills/aiasisbot61/4chan-reader/SKILL.md)
- **Security Status**: SAFE

## Instructions

# 4chan Reader

This skill allows you to catalog and extract threads from 4chan boards into structured text.

## Workflows

### 1. View Board Catalog
To see active threads and their reply counts on a board:
```bash
python3 scripts/chan_extractor.py catalog <board>
```
Output format: `ThreadID|PostCount|TeaserText`

### 2. Extract Thread Content
To read a specific thread and optionally save it:
```bash
python3 scripts/chan_extractor.py thread <board> <thread_id> [output_root_dir] [word_limit]
```
- `output_root_dir` (optional): If provided, saves content to `<output_root_dir>/<board>_<timestamp>/<thread_id>.txt`.
- `word_limit` (optional): Limits each line of post text to the specified number of words.

## Details
- **Scripts**: Uses [chan_extractor.py](scripts/chan_extractor.py) for all operations.
