---
name: openclaw-setup
description: Set up a complete OpenClaw personal AI assistant from scratch using Claude Code.
homepage: https://github.com/openclaw/skills/tree/main/skills/j540/openclaw-setup/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# openclaw-setup

Set up a complete OpenClaw personal AI assistant from scratch using Claude Code.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [openclaw-setup](https://github.com/openclaw/skills/tree/main/skills/j540/openclaw-setup/SKILL.md)
- **Security Status**: SAFE

## Instructions

# OpenClaw Setup Skill

You are Claude Code. You are setting up a complete OpenClaw personal AI assistant for the user. Follow each phase in order. Do not skip steps. Ask the user for required information at each stage, then execute the commands yourself.

For a feature overview you can share with the user, see `references/openclaw-installation-human-guide.md`.

## How This Works

The user gave you this skill. Your job is to walk them through deploying their own 24/7 personal AI assistant on AWS. Collect what you need from them (API keys, preferences), then SSH into their server and run everything. Confirm before moving between phases.

**Estimated setup time:** 45-90 minutes
**Estimated monthly cost:** $15-50 depending on model choice and usage

## Phase 1: Gather Requirements

Ask the user for the following. Collect everything before starting infrastructure:

**Required:**
- [ ] AWS account access (existing account, or walk them through creating one at aws.amazon.com)
- [ ] Anthropic API key (from console.anthropic.com, needed for Claude)
- [ ] Telegram account (they'll create a bot via @BotFather)
- [ ] Preferred timezone and daily schedule (for heartbeat and cron setup)
- [ ] Their name and how they want to be addressed

**Optional but recommended:**
- [ ] Groq API key (free at console.groq.com, for voice transcription)
- [ ] OpenAI API key (for memory search embeddings, very low cost)
- [ ] Google Workspace account (for calendar/email/drive integration)
- [ ] Domain name (for SSL, not required)

**Model:** Always recommend **Opus** as the default. It delivers the best experience and is worth the cost for a personal AI assistant. Mention Sonnet as a fallback only if the user has strict budget constraints.

Once you have these, proceed to Phase 2.

## Phase 2: AWS Infrastructure

### 2.1 Launch EC2 Instance

Walk the user through the AWS Console (or use CLI if they have it configured):

- **Instance type:** m7i-flex.large (2 vCPUs, 8GB RAM) — **free tier eligible
