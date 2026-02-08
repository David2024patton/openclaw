---
name: context-recovery
description: Automatically recover working context after session compaction or when continuation is implied but context is missing.
homepage: https://github.com/openclaw/skills/tree/main/skills/jdrhyne/context-recovery/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# context-recovery

Automatically recover working context after session compaction or when continuation is implied but context is missing.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [context-recovery](https://github.com/openclaw/skills/tree/main/skills/jdrhyne/context-recovery/SKILL.md)
- **Security Status**: SAFE

## Instructions

|-------|
| PR | #<number> |
| Branch | <name> |
| Files | <paths> |
| URLs | <links> |

### Last User Request
> "<quoted request that may not have been completed>"

### Confidence Level
- Channel context: <high/medium/low>
- Session logs: <available/partial/unavailable>
- Memory entries: <found/none>
```

### Step 6: Cache Recovered Context

**Persist to memory for future reference:**

```bash
# Write to daily memory file
MEMORY_FILE=~/clawd-*/memory/$(date +%Y-%m-%d).md

cat >> "$MEMORY_FILE" << EOF

## Context Recovery — $(date +%H:%M)

**Channel:** #<channel-name>
**Recovered context for:** <project/task summary>

### Key State
- <bullet points of critical context>

### Pending Items
- <incomplete actions>

EOF
```

This ensures context survives future compactions.

### Step 7: Respond with Context

Present the recovered context, then prompt:

> "Context recovered. Your last request was [X]. This action [completed/did not complete]. Shall I [continue/retry/clarify]?"

## Channel-Specific Notes

### Discord
- Use `channelId` from the incoming message metadata
- Guild channels have full history access
- Thread recovery: check for `threadId` in message metadata
- DMs may have limited history

### Slack
- Use `channel` parameter with Slack channel ID
- Thread context requires `threadId` — always check for thread context first
- Parent channel fetch provides surrounding conversation context
- May need workspace-level permissions for full history

### Telegram / Signal / Others
- Same `message:read` interface
- History depth may vary by platform
- Group vs. DM context may differ

## Constraints

- **MANDATORY:** Execute this protocol before responding "insufficient data" or asking clarifying questions when context appears missing
- Adaptive depth: start with 50, expand to 100 max
- Time-based goal: capture at least 2 hours of context when possible
- Session log extraction: last 3 session files maximum
- Memory cache: append to daily file, do not overwrite
- If recover
