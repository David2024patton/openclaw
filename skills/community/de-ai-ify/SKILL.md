---
name: de-ai-ify
description: Remove AI-generated jargon and restore human voice.
homepage: https://github.com/openclaw/skills/tree/main/skills/itsflow/de-ai-ify/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# de-ai-ify

Remove AI-generated jargon and restore human voice.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [de-ai-ify](https://github.com/openclaw/skills/tree/main/skills/itsflow/de-ai-ify/SKILL.md)
- **Security Status**: SAFE

## Instructions

# De-AI-ify Text

Remove AI-generated patterns and restore natural human voice to your writing.

## Usage

```
/de-ai-ify <file_path>
```

## What Gets Removed

### 1. Overused Transitions

- "Moreover," "Furthermore," "Additionally," "Nevertheless"
- Excessive "However" usage
- "While X, Y" openings

### 2. AI Cliches

- "In today's fast-paced world"
- "Let's dive deep"
- "Unlock your potential"
- "Harness the power of"

### 3. Hedging Language

- "It's important to note"
- "It's worth mentioning"
- Vague quantifiers: "various," "numerous," "myriad"

### 4. Corporate Buzzwords

- "utilize" → "use"
- "facilitate" → "help"
- "optimize" → "improve"
- "leverage" → "use"

### 5. Robotic Patterns

- Rhetorical questions followed by immediate answers
- Obsessive parallel structures
- Always using exactly three examples
- Announcement of emphasis

## What Gets Added

### Natural Voice

- Varied sentence lengths
- Conversational tone
- Direct statements
- Specific examples

### Human Rhythm

- Natural transitions
- Confident assertions
- Personal perspective
- Authentic phrasing

## Process

1. **Read original file**
2. **Create copy with "-HUMAN" suffix**
3. **Apply de-AI-ification**
4. **Provide change log**

## Output

You'll get:

- A new file with natural human voice
- Change log showing what was fixed
- List of places needing specific examples

## Example Transformations

**Before (AI):** "In today's rapidly evolving digital landscape, it's crucial to
understand that leveraging AI effectively isn't just about utilizing
cutting-edge technology—it's about harnessing its transformative potential to
unlock unprecedented opportunities."

**After (Human):** "AI works best when you use it for specific tasks. Focus on
what it does well: writing code, analyzing data, and answering questions."
