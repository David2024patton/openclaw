---
name: model-router
description: A comprehensive AI model routing system that automatically selects the optimal model.
homepage: https://github.com/openclaw/skills/tree/main/skills/digitaladaption/model-router/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# model-router

A comprehensive AI model routing system that automatically selects the optimal model.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [model-router](https://github.com/openclaw/skills/tree/main/skills/digitaladaption/model-router/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Model Router

**Intelligent AI model routing across multiple providers for optimal cost-performance balance.**

Automatically select the best model for any task based on complexity, type, and your preferences. Support for 6 major AI providers with secure API key management and interactive configuration.

## 🎯 What It Does

- **Analyzes tasks** and classifies them by type (coding, research, creative, simple, etc.)
- **Routes to optimal models** from your configured providers
- **Optimizes costs** by using cheaper models for simple tasks
- **Secures API keys** with file permissions (600) and isolated storage
- **Provides recommendations** with confidence scoring and reasoning

## 🚀 Quick Start

### Step 1: Run the Setup Wizard

```bash
cd skills/model-router
python3 scripts/setup-wizard.py
```

The wizard will guide you through:
1. **Provider setup** - Add your API keys (Anthropic, OpenAI, Gemini, etc.)
2. **Task mappings** - Choose which model for each task type
3. **Preferences** - Set cost optimization level

### Step 2: Use the Classifier

```bash
# Get model recommendation for a task
python3 scripts/classify_task.py "Build a React authentication system"

# Output:
# Recommended Model: claude-sonnet
# Confidence: 85%
# Cost Level: medium
# Reasoning: Matched 2 keywords: build, system
```

### Step 3: Route Tasks with Sessions

```bash
# Spawn with recommended model
sessions_spawn --task "Debug this memory leak" --model claude-sonnet

# Use aliases for quick access
sessions_spawn --task "What's the weather?" --model haiku
```

## 📊 Supported Providers

| Provider | Models | Best For | Key Format |
|----------|--------|----------|------------|
| **Anthropic** | claude-opus-4-5, claude-sonnet-4-5, claude-haiku-4-5 | Coding, reasoning, creative | `sk-ant-...` |
| **OpenAI** | gpt-4o, gpt-4o-mini, o1-mini, o1-preview | Tools, deep reasoning | `sk-proj-...` |
| **Gemini** | gemini-2.0-flash, gemini-1.5-pro, gemini-1.5-flash | Multimodal, huge context (2M) | `AIza...` 
