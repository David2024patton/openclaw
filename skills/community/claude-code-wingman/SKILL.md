---
name: claude-code-wingman
description: Run Claude Code as a skill, control from WhatsApp.
homepage: https://github.com/openclaw/skills/tree/main/skills/yossiovadia/claude-code-wingman/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# claude-code-wingman

Run Claude Code as a skill, control from WhatsApp.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [claude-code-wingman](https://github.com/openclaw/skills/tree/main/skills/yossiovadia/claude-code-wingman/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Claude Code Wingman

Your multi-session orchestrator - manage multiple Claude Code instances working on different projects simultaneously, all from WhatsApp.

**GitHub:** https://github.com/yossiovadia/claude-code-orchestrator

## ⚡ CRITICAL: Handle Approval Commands First

**When a user message matches these patterns, IMMEDIATELY run the corresponding command:**

| User Message Pattern | Command to Run |
|---------------------|----------------|
| `approve <session>` | `~/code/claude-code-orchestrator/lib/handle-approval.sh approve <session>` |
| `always <session>` | `~/code/claude-code-orchestrator/lib/handle-approval.sh always <session>` |
| `deny <session>` | `~/code/claude-code-orchestrator/lib/handle-approval.sh deny <session>` |

**Examples:**
- User: "approve vsr-bugfix" → Run: `~/code/claude-code-orchestrator/lib/handle-approval.sh approve vsr-bugfix`
- User: "always heartbeat-test" → Run: `~/code/claude-code-orchestrator/lib/handle-approval.sh always heartbeat-test`
- User: "deny proxy-refactor" → Run: `~/code/claude-code-orchestrator/lib/handle-approval.sh deny proxy-refactor`

**After running, respond with the command output** (e.g., "✓ Session 'vsr-bugfix' approved (once)")

**Why this is critical:** The master monitor daemon sends WhatsApp notifications when Claude Code sessions need approval. The user responds with these commands from their phone. Fast response = unblocked sessions.

### Quick Status Commands

| User Message | Command to Run |
|--------------|----------------|
| `sessions` or `status` | `~/code/claude-code-orchestrator/lib/session-status.sh --all --json` |
| `status <session>` | `~/code/claude-code-orchestrator/lib/session-status.sh <session> --json` |

Parse the JSON and respond with a human-readable summary.

---

## What It Does

Orchestrates multiple Claude Code sessions in parallel, each working on different tasks in different directories. You monitor and control everything remotely via WhatsApp/chat.

**The Vision:**
- **Multip
