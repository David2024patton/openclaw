---
name: llm-council
description: Orchestrate multi-LLM councils to produce and merge implementation plans.
homepage: https://github.com/openclaw/skills/tree/main/skills/am-will/llm-council/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# llm-council

Orchestrate multi-LLM councils to produce and merge implementation plans.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [llm-council](https://github.com/openclaw/skills/tree/main/skills/am-will/llm-council/SKILL.md)
- **Security Status**: SAFE

## Instructions

# LLM Council Skill

## Quick start
- Always check for an existing agents config file first (`$XDG_CONFIG_HOME/llm-council/agents.json` or `~/.config/llm-council/agents.json`). If none exists, tell the user to run `./setup.sh` to configure or update agents.
- The orchestrator must always ask thorough intake questions first, then generates prompts so planners do **not** ask questions.
  - Even if the initial prompt is strong, ask at least a few clarifying questions about ambiguities, constraints, and success criteria.
- Tell the user that answering intake questions is optional, but more detail improves the quality of the final plan.
- Use `python3 scripts/llm_council.py run --spec /path/to/spec.json` to run the council.
- Plans are produced as Markdown files for auditability.
- Run artifacts are saved under `./llm-council/runs/<timestamp>` relative to the current working directory.
 - Configure defaults interactively with `python3 scripts/llm_council.py configure` (writes `$XDG_CONFIG_HOME/llm-council/agents.json` or `~/.config/llm-council/agents.json`).

## Workflow
1. Load the task spec and always ask thorough intake questions to build a clear task brief. Clarify any ambiguities, constraints, and success criteria. Remind the user that answers are optional but improve plan quality.
2. Build planner prompts (Markdown template) and launch the configured planner agents in parallel background shells.
3. Collect outputs, validate Markdown structure, and retry up to 2 times on failure. If any agents fails, yield and alert the user to fix the issue.
4. Anonymize plan contents and randomize order before judging.
5. Run the judge with the rubric and Markdown template, then save `judge.md` and `final-plan.md`.
6. Session management: DO NOT yield/finish the response until a full 30-minute timer has completed and judge + `final-plan.md` are confirmed saved; keep the session open during that interval to avoid closing the interface. If you yield while the Council is running, the 
