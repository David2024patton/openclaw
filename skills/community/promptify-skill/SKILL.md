---
name: promptify-skill
description: Optimize prompts for clarity and effectiveness.
homepage: https://github.com/openclaw/skills/tree/main/skills/tolibear/promptify-skill/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# promptify-skill

Optimize prompts for clarity and effectiveness.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [promptify-skill](https://github.com/openclaw/skills/tree/main/skills/tolibear/promptify-skill/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Prompt Optimizer

Transform prompts into clear, effective ones. Model-agnostic.

## Modifiers (parse from ARGUMENTS)

- **+ask** → Force clarifying questions
- **+deep** → Force codebase exploration
- **+web** → Force web search

No modifiers? Auto-detect what's needed.

## Auto-Detection Triggers

| Trigger | Signals |
|---------|---------|
| **codebase-researcher** | "this project", "our API", specific files/functions, "integrate", "extend", "refactor" |
| **clarifier** | Ambiguous ("make it better"), multiple interpretations, missing constraints, vague pronouns |
| **web-researcher** | "best practices", "latest", external APIs/libraries, framework patterns, year references |

## Agent Dispatch

When agents needed:
1. Announce which and why
2. Run in parallel via Task tool (agents/ directory)
3. Synthesize findings
4. Optimize with gathered context

---

## Core Contract (every prompt needs all four)

| Element | If Missing |
|---------|------------|
| **Role** | Add persona with expertise |
| **Task** | Make action specific |
| **Constraints** | Infer from context |
| **Output** | Specify format/structure |

## Process

1. **If image**: Analyze, incorporate context
2. **Detect type**: coding/writing/analysis/creative/data
3. **Convert output→process**: "Write X" → "Analyze → Plan → Implement → Validate"
4. **Strip fluff**: "please", "I want you to", filler, apologies
5. **Apply contract**: Verify all 4 elements
6. **Add structure**: XML tags for complex prompts

## Type Focus

- **Coding**: Specs, edge cases, framework
- **Writing**: Tone, audience, length
- **Analysis**: Criteria, depth
- **Creative**: Constraints, novelty
- **Data**: I/O format, edge cases

## Output

1. Optimized prompt in code block
2. `echo 'PROMPT' | pbcopy`
3. 2-3 sentence explanation
