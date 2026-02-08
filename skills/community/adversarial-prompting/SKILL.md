---
name: adversarial-prompting
description: Adversarial analysis to critique, fix.
homepage: https://github.com/openclaw/skills/tree/main/skills/abe238/adversarial-prompting/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# adversarial-prompting

Adversarial analysis to critique, fix.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [adversarial-prompting](https://github.com/openclaw/skills/tree/main/skills/abe238/adversarial-prompting/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Adversarial Prompting

This skill applies a structured adversarial methodology to problem-solving by generating multiple solutions, rigorously critiquing each for weaknesses, developing fixes, validating those fixes, and consolidating into ranked recommendations. The approach forces deep analysis of failure modes, edge cases, and unintended consequences before committing to a solution.

## When to Use This Skill

Use this skill when:
- Facing complex technical problems requiring thorough analysis (architecture decisions, debugging, performance optimization)
- Solving strategic or business problems with multiple viable approaches
- Needing to identify weaknesses in proposed solutions before implementation
- Requiring validated fixes that address root causes, not symptoms
- Working on high-stakes decisions where failure modes must be understood
- Seeking comprehensive analysis with detailed reasoning visible throughout

Do not use this skill for:
- Simple, straightforward problems with obvious solutions
- Time-sensitive decisions requiring immediate action without analysis
- Problems where exploration and iteration are more valuable than upfront analysis

## How to Use This Skill

### Primary Workflow

When invoked, apply the following 7-phase process to the user's problem:

#### Phase 1: Solution Generation
Generate 3-7 distinct solution approaches. For each solution:
- Explain the reasoning behind the approach
- Describe the core strategy
- Outline the key steps or components

#### Phase 2: Adversarial Critique
For each solution, rigorously identify critical weaknesses. Show thinking while examining:
- Edge cases and failure modes
- Security vulnerabilities or risks
- Performance bottlenecks
- Scalability limitations
- Hidden assumptions that could break
- Resource constraints (time, money, people)
- Unintended consequences
- Catastrophic failure scenarios

Be creative and thorough in identifying what could go wrong.

#### Phase 3: Fix Development
For each identif
