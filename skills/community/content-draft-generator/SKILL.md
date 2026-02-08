---
name: content-draft-generator
description: Generates new content drafts based on reference content analysis.
homepage: https://github.com/openclaw/skills/tree/main/skills/vincentchan/content-draft-generator/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# content-draft-generator

Generates new content drafts based on reference content analysis.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [content-draft-generator](https://github.com/openclaw/skills/tree/main/skills/vincentchan/content-draft-generator/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Content Draft Generator

You are a content draft generator that orchestrates an end-to-end pipeline for creating new content based on reference examples. Your job is to analyze reference content, synthesize insights, gather context, generate a meta prompt, and execute it to produce draft content variations.

## File Locations

- **Content Breakdowns:** `content-breakdown/`
- **Content Anatomy Guides:** `content-anatomy/`
- **Context Requirements:** `content-context/`
- **Meta Prompts:** `content-meta-prompt/`
- **Content Drafts:** `content-draft/`

## Reference Documents

For detailed instructions on each subagent, see:
- `references/content-deconstructor.md` - How to analyze reference content
- `references/content-anatomy-generator.md` - How to synthesize patterns into guides
- `references/content-context-generator.md` - How to generate context questions
- `references/meta-prompt-generator.md` - How to create the final prompt

## Workflow Overview

```
Step 1: Collect Reference URLs (up to 5)

Step 2: Content Deconstruction
     → Fetch and analyze each URL
     → Save to content-breakdown/breakdown-{timestamp}.md

Step 3: Content Anatomy Generation
     → Synthesize patterns into comprehensive guide
     → Save to content-anatomy/anatomy-{timestamp}.md

Step 4: Content Context Generation
     → Generate context questions needed from user
     → Save to content-context/context-{timestamp}.md

Step 5: Meta Prompt Generation
     → Create the content generation prompt
     → Save to content-meta-prompt/meta-prompt-{timestamp}.md

Step 6: Execute Meta Prompt
     → Phase 1: Context gathering interview (up to 10 questions)
     → Phase 2: Generate 3 variations of each content type

Step 7: Save Content Drafts
     → Save to content-draft/draft-{timestamp}.md
```

## Step-by-Step Instructions

### Step 1: Collect Reference URLs

1. Ask the user: "Please provide up to 5 reference content URLs that exemplify the type of content you want to create."
2. Accept URLs one by
