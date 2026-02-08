---
name: tiangong-wps-ppt-automation
description: Automate common PowerPoint/WPS Presentation operations on Windows via COM (read text/notes/outline, export.
homepage: https://github.com/openclaw/skills/tree/main/skills/fadeloo/tiangong-wps-ppt-automation/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# tiangong-wps-ppt-automation

Automate common PowerPoint/WPS Presentation operations on Windows via COM (read text/notes/outline, export.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [tiangong-wps-ppt-automation](https://github.com/openclaw/skills/tree/main/skills/fadeloo/tiangong-wps-ppt-automation/SKILL.md)
- **Security Status**: SAFE

## Instructions

# WPS/PowerPoint Automation (Windows)

Use the bundled Python script to control PowerPoint or WPS Presentation via COM.

## Requirements

- Windows with **Microsoft PowerPoint** or **WPS Presentation** installed.
- Python + **pywin32** (`python -m pip install pywin32`).

## Quick start

```bash
python {baseDir}/scripts/wps_ppt_automation.py read --input "C:\path\file.pptx"
python {baseDir}/scripts/wps_ppt_automation.py export --input "C:\path\file.pptx" --format pdf --output "C:\path\out.pdf"
```

## Commands

### read
Extract all slide text.

```bash
python {baseDir}/scripts/wps_ppt_automation.py read --input "C:\path\file.pptx" --output "C:\path\out.txt"
```

### notes
Extract speaker notes.

```bash
python {baseDir}/scripts/wps_ppt_automation.py notes --input "C:\path\file.pptx" --output "C:\path\notes.txt"
```

### outline
Export slide titles as outline.

```bash
python {baseDir}/scripts/wps_ppt_automation.py outline --input "C:\path\file.pptx" --output "C:\path\outline.txt"
```

### export
Export to PDF or images (PNG).

```bash
python {baseDir}/scripts/wps_ppt_automation.py export --input "C:\path\file.pptx" --format pdf --output "C:\path\out.pdf"
python {baseDir}/scripts/wps_ppt_automation.py export --input "C:\path\file.pptx" --format images --outdir "C:\out\slides"
```

### replace
Find/replace text across slides.

```bash
python {baseDir}/scripts/wps_ppt_automation.py replace --input "C:\path\file.pptx" --find "old" --replace "new" --save "C:\path\out.pptx"
```

### slides
Insert or delete slides.

```bash
python {baseDir}/scripts/wps_ppt_automation.py insert-slide --input "C:\path\file.pptx" --index 2 --save "C:\path\out.pptx"
python {baseDir}/scripts/wps_ppt_automation.py delete-slide --input "C:\path\file.pptx" --index 3 --save "C:\path\out.pptx"
```

### font
Unify font name/size across slides.

```bash
python {baseDir}/scripts/wps_ppt_automation.py font --input "C:\path\file.pptx" --name "Microsoft YaHei" --size 20 --save "C:\path\out.pptx"
```

### t
