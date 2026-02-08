---
name: ralph-loops
description: > **First time?** Read [SETUP.md](./SETUP.md) first to install dependencies and verify your setup.
homepage: https://github.com/openclaw/skills/tree/main/skills/qlifebot-coder/ralph-loops/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# ralph-loops

> **First time?** Read [SETUP.md](./SETUP.md) first to install dependencies and verify your setup.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [ralph-loops](https://github.com/openclaw/skills/tree/main/skills/qlifebot-coder/ralph-loops/SKILL.md)
- **Security Status**: SAFE

## Instructions

## ⚠️ Don't Block the Conversation!

When running a Ralph loop, **don't monitor it synchronously**. The loop runs as a separate Claude CLI process — you can keep chatting.

**❌ Wrong (blocks conversation):**
```
Start loop → sleep 60 → poll → sleep 60 → poll → ... (6 minutes of silence)
```

**✅ Right (stays responsive):**
```
Start loop → "It's running, I'll check periodically" → keep chatting → check on heartbeats
```

**How to monitor without blocking:**
1. Start the loop with `node ralph-loop.mjs ...` (runs in background)
2. Tell human: "Loop running. I'll check progress periodically or you can ask."
3. Check via `process poll <sessionId>` when asked or during heartbeats
4. Use the dashboard at http://localhost:3939 for real-time visibility

**The loop is autonomous** — that's the whole point. Don't babysit it at the cost of ignoring your human.

---

## Trigger Phrases

When human says:

| Phrase | Action |
|--------|--------|
| **"Interview me about system X"** | Start Phase 1 requirements interview |
| **"Start planning system X"** | Run `./loop.sh plan` (needs specs first) |
| **"Start building system X"** | Run `./loop.sh build` (needs plan first) |
| **"Ralph loop over X"** | **ASK which phase** (see below) |

### When Human Says "Ralph Loop" — Clarify the Phase!

Don't assume which phase. Ask:

> "Which type of Ralph loop are we doing?
> 
> 1️⃣ **Interview** — I'll ask you questions to build specs (Phase 1)
> 2️⃣ **Planning** — I'll iterate on an implementation plan (Phase 2)  
> 3️⃣ **Building** — I'll implement from a plan, one task per iteration (Phase 3)
> 4️⃣ **Generic** — Simple iterative refinement on a single topic"

**Then proceed based on their answer:**

| Choice | Action |
|--------|--------|
| Interview | Use `templates/requirements-interview.md` protocol |
| Planning | Need specs first → run planning loop with `PROMPT_plan.md` |
| Building | Need plan first → run build loop with `PROMPT_build.md` |
| Generic | Create prompt file, run `ralph-
