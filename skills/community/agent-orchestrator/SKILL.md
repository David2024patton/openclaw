---
name: agent-orchestrator
description: Community skill by tree
homepage: https://github.com/openclaw/skills/tree/main/skills/aatmaan1/agent-orchestrator/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# agent-orchestrator



## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [agent-orchestrator](https://github.com/openclaw/skills/tree/main/skills/aatmaan1/agent-orchestrator/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Agent Orchestrator

Orchestrate complex tasks by decomposing them into subtasks, spawning autonomous sub-agents, and consolidating their work.

## Core Workflow

### Phase 1: Task Decomposition

Analyze the macro task and break it into independent, parallelizable subtasks:

```
1. Identify the end goal and success criteria
2. List all major components/deliverables required
3. Determine dependencies between components
4. Group independent work into parallel subtasks
5. Create a dependency graph for sequential work
```

**Decomposition Principles:**
- Each subtask should be completable in isolation
- Minimize inter-agent dependencies
- Prefer broader, autonomous tasks over narrow, interdependent ones
- Include clear success criteria for each subtask

### Phase 2: Agent Generation

For each subtask, create a sub-agent workspace:

```bash
python3 scripts/create_agent.py <agent-name> --workspace <path>
```

This creates:
```
<workspace>/<agent-name>/
âââ SKILL.md          # Generated skill file for the agent
âââ inbox/            # Receives input files and instructions
âââ outbox/           # Delivers completed work
âââ workspace/        # Agent's working area
âââ status.json       # Agent state tracking
```

**Generate SKILL.md dynamically** with:
- Agent's specific role and objective
- Tools and capabilities needed
- Input/output specifications
- Success criteria
- Communication protocol

See [references/sub-agent-templates.md](references/sub-agent-templates.md) for pre-built templates.

### Phase 3: Agent Dispatch

Initialize each agent by:

1. Writing task instructions to `inbox/instructions.md`
2. Copying required input files to `inbox/`
3. Setting `status.json` to `{"state": "pending", "started": null}`
4. Spawning the agent using the Task tool:

```python
# Spawn agent with its generated skill
Task(
    description=f"{agent_name}: {brief_description}",
    prompt=f"""
    Read the skill at {agent_path}/SKILL.md and follow its instru
