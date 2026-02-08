---
name: autonomous-skill-orchestrator
description: Community skill by tree
homepage: https://github.com/openclaw/skills/tree/main/skills/vishnubedi3/autonomous-skill-orchestrator/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# autonomous-skill-orchestrator



## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [autonomous-skill-orchestrator](https://github.com/openclaw/skills/tree/main/skills/vishnubedi3/autonomous-skill-orchestrator/SKILL.md)
- **Security Status**: SAFE

## Instructions

## Activation Criteria

Activate this skill if and only if all conditions below are true:
- The user explicitly invokes this skill by name or trigger keywords in the current turn.
- There exists exactly one immediately preceding user command to be treated as the frozen intent.
- At least one other executable skill is available for coordination.

Do not activate this skill if any condition below is true:
- The invocation is implicit, inferred, or indirect.
- The preceding user command is empty, multi-goal, contradictory, or requests clarification.
- No executable skills are available.
- The user issues a stop command.

## Execution Steps

1. **Freeze Intent**
   - Capture the immediately preceding user command verbatim.
   - Store it as immutable intent for the duration of this activation.
   - Do not summarize, reinterpret, expand, or decompose the intent.

2. **Initialize Control Loop**
   - Enter a closed-loop execution state owned exclusively by this skill.
   - Disable all requests for user input, confirmation, or validation.
   - Ignore all user messages except an explicit stop command.

3. **Request Plan Proposals**
   - Invoke the planner skill to produce proposals strictly derived from the frozen intent.
   - Require output to contain only:
     - A finite, ordered list of features.
     - Explicit dependencies between features.
     - Explicit assumptions stated as facts, not guesses.
   - Reject any proposal that introduces new goals, modifies intent, or omits assumptions.

4. **Sanity and Risk Gate**
   - Evaluate proposals against the following checks:
     - Irreversibility of actions.
     - Scope expansion beyond frozen intent.
     - Use of tools or capabilities not explicitly available.
     - Assumptions that cannot be verified from provided context.
   - If any check fails, halt immediately.

5. **Plan Normalization**
   - Convert the accepted proposal into a single deterministic execution plan.
   - Clas
