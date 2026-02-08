---
name: council-of-the-wise
description: Multi-perspective feedback from spawned sub-agent personas.
homepage: https://github.com/openclaw/skills/tree/main/skills/jeffaf/council-of-the-wise/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# council-of-the-wise

Multi-perspective feedback from spawned sub-agent personas.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [council-of-the-wise](https://github.com/openclaw/skills/tree/main/skills/jeffaf/council-of-the-wise/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Council of the Wise

Get multi-perspective feedback on your ideas from a panel of AI experts. Perfect for stress-testing business plans, project designs, content strategies, or major decisions.

## Usage

```
"Send this to the council: [idea/plan/document]"
"Council of the wise: [topic]"
"Get the council's feedback on [thing]"
```

## Council Members

The skill **auto-discovers** agent personas from `{skill_folder}/agents/`. Any `.md` file in that folder becomes a council member.

**Default members:**
- `DevilsAdvocate.md` — Challenges assumptions, finds weaknesses, stress-tests
- `Architect.md` — Designs systems, structure, high-level approach  
- `Engineer.md` — Implementation details, technical feasibility
- `Artist.md` — Voice, style, presentation, user experience
- `Quant.md` — Risk analysis, ROI, expected value, position sizing

### Adding New Council Members

Simply add a new `.md` file to the `agents/` folder:

```bash
# Add a security reviewer
echo "# Pentester\n\nYou analyze security implications..." > agents/Pentester.md

# Add a QA perspective  
echo "# QATester\n\nYou find edge cases..." > agents/QATester.md
```

The skill will automatically include any agents it finds. No config file needed.

### Custom Agent Location (Optional)

If the user has custom PAI agents at `~/.claude/Agents/`, those can be used instead:
- Check if `~/.claude/Agents/` exists and has agent files
- If yes, prefer custom agents from that directory
- If no, use the bundled agents in this skill's `agents/` folder

## Process

1. Receive the idea/topic from the user
2. Discover available agents (scan `agents/` folder or custom path)
3. Send a loading message to the user: `🏛️ *The Council convenes...* (this takes 2-5 minutes)`
4. Spawn a sub-agent with **5-minute timeout** using this task template:

```
Analyze this idea/plan from multiple expert perspectives.

**The Idea:**
[user's idea here]

**Your Task:**
Read and apply these agent perspectives from [AGENT_PATH]:
[List all disc
