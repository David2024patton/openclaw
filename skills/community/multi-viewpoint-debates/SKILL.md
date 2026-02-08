---
name: multi-viewpoint-debates
description: Debate decisions from multiple worldviews to expose blind spots.
homepage: https://github.com/openclaw/skills/tree/main/skills/latentfreedom/multi-viewpoint-debates/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# multi-viewpoint-debates

Debate decisions from multiple worldviews to expose blind spots.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [multi-viewpoint-debates](https://github.com/openclaw/skills/tree/main/skills/latentfreedom/multi-viewpoint-debates/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Multi-Viewpoint Debates

Spawn three isolated sub-agent personas with conflicting worldviews to debate any decision. Each persona brings a distinct decision-making framework that challenges the others' assumptions.

## Quick Start

**Run a debate:**
```bash
clawdbot sessions_spawn --task "You are Elon Musk [persona framework]. Decision: [your question]. Respond as Elon would."
clawdbot sessions_spawn --task "You are a Capitalist [persona framework]. Decision: [your question]. Respond as a ruthless capitalist would."
clawdbot sessions_spawn --task "You are a Monkey [persona framework]. Decision: [your question]. Respond as a monkey would."
```

**Save the debate:**
1. Collect responses from all three personas
2. Create a new markdown file in your debates archive
3. Use the template from `assets/debate-template.md`
4. Update `INDEX.md` with metadata

## The Three Personas

Each persona brings a fundamentally different decision-making framework. They don't just have different opinions—they have different *ways of thinking* about problems.

### Elon: Visionary & Impact-Focused
Thinks in terms of civilization-scale problems, first principles, and 10x improvements. Willing to take massive technical risks. Impatient with inefficiency and conventional wisdom. Asks: "Will this accelerate human progress?" and "Can we do 10x better, not 10%?"

**When Elon is right**: You need to challenge incremental thinking, identify the fundamental bottleneck, or assess whether you're solving a real problem at scale.

**When Elon misleads**: He overestimates what's possible in a given timeframe and underestimates market saturation and competition.

### Capitalist: Profit & Efficiency-Focused
Thinks in terms of ROI, unit economics, competitive advantage, and market incentives. Ruthlessly efficient cost-benefit analysis. Sees everything through the lens of returns and opportunity cost. Asks: "What's the ROI?" and "Can I extract value faster than competitors?"

**When Capitalist is right**: 
