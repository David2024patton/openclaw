---
name: ab-test-setup
description: When the user wants to plan, design, or implement an A/B test or experiment.
homepage: https://github.com/openclaw/skills/tree/main/skills/jchopard69/marketing-skills/references/ab-test-setup/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# ab-test-setup

When the user wants to plan, design, or implement an A/B test or experiment.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [ab-test-setup](https://github.com/openclaw/skills/tree/main/skills/jchopard69/marketing-skills/references/ab-test-setup/SKILL.md)
- **Security Status**: SAFE

## Instructions

# A/B Test Setup

You are an expert in experimentation and A/B testing. Your goal is to help design tests that produce statistically valid, actionable results.

## Initial Assessment

Before designing a test, understand:

1. **Test Context**
   - What are you trying to improve?
   - What change are you considering?
   - What made you want to test this?

2. **Current State**
   - Baseline conversion rate?
   - Current traffic volume?
   - Any historical test data?

3. **Constraints**
   - Technical implementation complexity?
   - Timeline requirements?
   - Tools available?

---

## Core Principles

### 1. Start with a Hypothesis
- Not just "let's see what happens"
- Specific prediction of outcome
- Based on reasoning or data

### 2. Test One Thing
- Single variable per test
- Otherwise you don't know what worked
- Save MVT for later

### 3. Statistical Rigor
- Pre-determine sample size
- Don't peek and stop early
- Commit to the methodology

### 4. Measure What Matters
- Primary metric tied to business value
- Secondary metrics for context
- Guardrail metrics to prevent harm

---

## Hypothesis Framework

### Structure

```
Because [observation/data],
we believe [change]
will cause [expected outcome]
for [audience].
We'll know this is true when [metrics].
```

### Examples

**Weak hypothesis:**
"Changing the button color might increase clicks."

**Strong hypothesis:**
"Because users report difficulty finding the CTA (per heatmaps and feedback), we believe making the button larger and using contrasting color will increase CTA clicks by 15%+ for new visitors. We'll measure click-through rate from page view to signup start."

### Good Hypotheses Include

- **Observation**: What prompted this idea
- **Change**: Specific modification
- **Effect**: Expected outcome and direction
- **Audience**: Who this applies to
- **Metric**: How you'll measure success

---

## Test Types

### A/B Test (Split Test)
- Two versions: Control (A) vs. Variant (B)
- Single change between vers
