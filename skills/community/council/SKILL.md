---
name: council
description: Council Chamber orchestration with Memory Bridge.
homepage: https://github.com/openclaw/skills/tree/main/skills/emasoudy/council/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# council

Council Chamber orchestration with Memory Bridge.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [council](https://github.com/openclaw/skills/tree/main/skills/emasoudy/council/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Council - Chamber Orchestration Pattern

Instead of spawning separate agent silos, create a **Council Chamber** where multiple expert personas deliberate in a single session with cross-pollination and unified transcript.

## Prerequisites

- SQLite3 (member database)
- Graphiti service (Memory Bridge)
- Clawdbot gateway (sessions_spawn)

## Setup

Initialize council database:
```bash
bash command:"{baseDir}/init-db.sh"
```

## 🏛️ The Chamber Pattern

**Traditional Approach** (Silos):
- Spawn 3 separate agents
- Each analyzes independently
- No cross-pollination
- Fragmented output

**Chamber Approach** (Meeting Room):
- Single agent session
- Moderates multiple personas
- Structured turn-taking
- Unified deliberation transcript

## Tools

### council_chamber
Start a Council Chamber session (recommended).

**Usage:**
```bash
bash command:"
TOPIC='YOUR_TOPIC'
MEMBERS='architect,analyst,security'

{baseDir}/references/chamber-orchestrator.sh \"\$TOPIC\" \"\$MEMBERS\"
"
```

**What it does**:
1. Fetches Graphiti context (Memory Bridge)
2. Loads member personas from database
3. Constructs chamber task with turn structure
4. Creates session record
5. Outputs task for sessions_spawn

### council_list_members
List all registered members.

**Usage:**
```bash
bash command:"sqlite3 -header -column ~/.clawdbot/council.db 'SELECT id, name, role FROM council_members'"
```

### council_add_member
Register new member.

**Usage:**
```bash
bash command:"
sqlite3 ~/.clawdbot/council.db \"
INSERT INTO council_members (id, name, role, system_message, expertise)
VALUES ('MEMBER_ID', 'NAME', 'ROLE', 'SYSTEM_MESSAGE', 'EXPERTISE');
\""
```

## Chamber Session Structure

**3-Turn Deliberation**:

1. **Turn 1: Initial Analysis**
   - Each persona provides their perspective
   - Distinct voices maintained

2. **Turn 2: Cross-Pollination**
   - Members critique each other's points
   - Real-time responses
   - Healthy debate

3. **Turn 3: Synthesis**
   - Find common ground
   - Resolve disa
