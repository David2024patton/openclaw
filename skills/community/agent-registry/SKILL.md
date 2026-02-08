---
name: agent-registry
description: Community skill by tree
homepage: https://github.com/openclaw/skills/tree/main/skills/matrixy/agent-registry/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# agent-registry



## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [agent-registry](https://github.com/openclaw/skills/tree/main/skills/matrixy/agent-registry/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Agent Registry

Lazy-loading system for Claude Code agents. Eliminates the "~16k tokens" warning by loading agents on-demand.

## CRITICAL RULE

**NEVER assume agents are pre-loaded.** Always use this registry to discover and load agents.

## Workflow

```
User Request → search_agents(intent) → select best match → get_agent(name) → execute with agent
```

## Available Commands

| Command | When to Use | Example |
|---------|-------------|---------|
| `list_agents.py` | User asks "what agents do I have" or needs overview | `python scripts/list_agents.py` |
| `search_agents.py` | Find agents matching user intent (ALWAYS do this first) | `python scripts/search_agents.py "code review security"` |
| `search_agents_paged.py` | Paged search for large registries (300+ agents) | `python scripts/search_agents_paged.py "query" --page 1 --page-size 10` |
| `get_agent.py` | Load a specific agent's full instructions | `python scripts/get_agent.py code-reviewer` |

## Search First Pattern

1. **Extract intent keywords** from user request
2. **Run search**: `python scripts/search_agents.py "<keywords>"`
3. **Review results**: Check relevance scores (0.0-1.0)
4. **Load if needed**: `python scripts/get_agent.py <agent-name>`
5. **Execute**: Follow the loaded agent's instructions

## Example

User: "Can you review my authentication code for security issues?"

```bash
# Step 1: Search for relevant agents
python scripts/search_agents.py "code review security authentication"

# Output:
# Found 2 matching agents:
#   1. security-auditor (score: 0.89) - Analyzes code for security vulnerabilities
#   2. code-reviewer (score: 0.71) - General code review and best practices

# Step 2: Load the best match
python scripts/get_agent.py security-auditor

# Step 3: Follow loaded agent instructions for the task
```

## Installation

### Step 1: Install the Skill

**Quick Install (Recommended):**

```bash
# NPX with add-skill (recommended)
npx add-skill MaTriXy/Agent-Registry

# OR npm directly
npm 
