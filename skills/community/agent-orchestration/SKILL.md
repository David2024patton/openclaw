---
name: agent-orchestration
description: Master the art of spawning and managing sub-agents.
homepage: https://github.com/openclaw/skills/tree/main/skills/halthelobster/agent-orchestration/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# agent-orchestration

Master the art of spawning and managing sub-agents.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [agent-orchestration](https://github.com/openclaw/skills/tree/main/skills/halthelobster/agent-orchestration/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Agent Orchestration 🦞

**By Hal Labs** — Part of the Hal Stack

Your agents fail because your prompts suck. This skill fixes that.

---

## The Core Problem

You're not prompting. **You're praying.**

Most prompts are wishes tossed into the void:

```
❌ "Research the best vector databases and write a report"
```

You type something reasonable. The output is mid. You rephrase. Still mid. You add keywords. Somehow worse. You blame the model.

Here's what you don't understand: **A language model is a pattern-completion engine.** It generates the most statistically probable output given your input.

Vague input → generic output. Not because the model is dumb. Because generic is what's most probable when you give it nothing specific to work with.

**The model honored exactly what you asked for. You just didn't realize how little you gave it.**

---

## The Core Reframe

A prompt is not a request. **A prompt is a contract.**

Every contract must answer four non-negotiables:

| Element | Question |
|---------|----------|
| **Role** | Who is the model role-playing as? |
| **Task** | What exactly must it accomplish? |
| **Constraints** | What rules must be followed? |
| **Output** | What does "done" look like? |

Miss one, the model fills the gap with assumptions. Assumptions are where hallucinations are born.

---

## The 5-Layer Architecture

Effective prompts share a specific structure. This maps to how models actually process information.

### Layer 1: Identity

Who is the model in this conversation?

Not "helpful assistant" but a specific role with specific expertise:

```markdown
You are a senior product marketer who specializes in B2B SaaS positioning.
You have 15 years of experience converting technical features into emotional benefits.
You write in short sentences. You never use jargon without explaining it.
```

The model doesn't "become" this identity—it accesses different clusters of training data, different stylistic patterns, different reasoning approaches.


