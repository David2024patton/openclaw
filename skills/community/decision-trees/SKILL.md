---
name: decision-trees
description: Decision tree analysis for complex decision-making across all domains.
homepage: https://github.com/openclaw/skills/tree/main/skills/evgyur/decision-trees/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# decision-trees

Decision tree analysis for complex decision-making across all domains.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [decision-trees](https://github.com/openclaw/skills/tree/main/skills/evgyur/decision-trees/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Decision Trees — Structured Decision-Making

Decision tree analysis: a visual tool for making decisions with probabilities and expected value.

## When to Use

✅ **Good for:**
- Business decisions (investments, hiring, product launches)
- Personal choices (career, relocation, purchases)
- Trading & investing (position sizing, entry/exit)
- Operational decisions (expansion, outsourcing)
- Any situation with measurable consequences

❌ **Not suitable for:**
- Decisions with true uncertainty (black swans)
- Fast tactical choices
- Purely emotional/ethical questions

## Method

**Decision tree** = tree-like structure where:
- **Decision nodes** (squares) — your actions
- **Chance nodes** (circles) — random events
- **End nodes** (triangles) — final outcomes

**Process:**
1. **Define options** — all possible actions
2. **Define outcomes** — what can happen after each action
3. **Estimate probabilities** — how likely is each outcome (0-100%)
4. **Estimate values** — utility/reward for each outcome (money, points, utility units)
5. **Calculate EV** — expected value = Σ (probability × value)
6. **Choose** — option with highest EV

## Formula

```
EV = Σ (probability_i × value_i)
```

**Example:**
- Outcome A: 70% probability, +$100 → 0.7 × 100 = $70
- Outcome B: 30% probability, -$50 → 0.3 × (-50) = -$15
- **EV = $70 + (-$15) = $55**

## Classic Example (from Wikipedia)

**Decision:** Go to party or stay home?

### Estimates:
- Party: +9 utility (fun)
- Home: +3 utility (comfort)
- Carrying jacket unnecessarily: -2 utility
- Being cold: -10 utility
- Probability cold: 70%
- Probability warm: 30%

### Tree:

```
Decision
├─ Go to party
│  ├─ Take jacket
│  │  ├─ Cold (70%) → 9 utility (party)
│  │  └─ Warm (30%) → 9 - 2 = 7 utility (carried unnecessarily)
│  │  EV = 0.7 × 9 + 0.3 × 7 = 8.4
│  └─ Don't take jacket
│     ├─ Cold (70%) → 9 - 10 = -1 utility (froze)
│     └─ Warm (30%) → 9 utility (perfect)
│     EV = 0.7 × (-1) + 0.3 × 9 = 2.0
└─ Stay home
   └─ EV = 3.0 (alwa
