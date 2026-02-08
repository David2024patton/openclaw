---
name: notebooklm
description: Use this skill to analyze your local files with Google NotebookLM's AI.
homepage: https://github.com/openclaw/skills/tree/main/skills/seanphan/notebooklm/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# notebooklm

Use this skill to analyze your local files with Google NotebookLM's AI.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [notebooklm](https://github.com/openclaw/skills/tree/main/skills/seanphan/notebooklm/SKILL.md)
- **Security Status**: SAFE

## Instructions

# NotebookLM Local File Analyzer

Analyze your local documents with Google NotebookLM's AI to get source-grounded insights, risk assessments, and actionable recommendations. Upload your files once, then query them repeatedly for different perspectives.

## When to Use This Skill

Use this skill when user:
- Has local business documents (strategy plans, financial reports, proposals)
- Wants AI analysis of specific documents with source grounding
- Needs risk assessment, competitive analysis, or business insights
- Wants to analyze multiple related documents together
- Needs to extract actionable insights from business documentation

## Quick Start

### Step 1: One-Time Setup
```bash
python scripts/setup_notebooklm.py
```

### Step 2: Analyze Your Files

**Batch Analysis (recommended):**
```bash
python scripts/batch_analyzer.py "your/folder" --pattern "*.md"
```

**Single File Analysis:**
```bash
python scripts/local_analyzer.py "file.md" --upload
```

**Query Uploaded Documents:**
```bash
python scripts/quick_query.py "What are the key risks in this business plan?" --notebook-url "notebook-url"
```

## Core Workflows

### Workflow 1: Business Document Analysis
Upload business documents and get strategic insights:
```bash
# Analyze business strategy files
python scripts/batch_analyzer.py "Business/Strategy" --pattern "*.md"

# Upload high-priority files to NotebookLM
python scripts/local_analyzer.py "strategy_plan.md" --upload

# Get strategic insights
python scripts/quick_query.py "Identify 3 competitive advantages and implementation challenges" --notebook-url "url"
```

### Workflow 2: Financial Analysis
Analyze financial documents for risks and opportunities:
```bash
# Find financial documents
python scripts/batch_analyzer.py "Finance" --pattern "*.md"

# Query for financial insights
python scripts/quick_query.py "What are the key financial risks and ROI projections?" --notebook-url "url"
```

### Workflow 3: Risk & Compliance Analysis
Get risk assessments and comp
